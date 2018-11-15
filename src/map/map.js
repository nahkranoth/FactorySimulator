import {MapChunk} from '../map/mapChunk.js';
import {TileData} from '../data/tileData.js'
import {MapChunkNeighbour} from '../map/mapChunkNeighbour.js'
import {MapSpriteEntityFactory} from '../map/mapSpriteEntityFactory.js'
import {MapGenerator} from '../map/mapGenerator.js'
import {_} from 'underscore';
import {MapDebugController} from "../map/mapDebugController.js";

export class Map extends Phaser.GameObjects.GameObject {

    constructor(params){
        super(params.scene, params.opt);
        this.camera = params.scene.cameras.main;

        this.chunks = [];
        this.neighbouringChunks = [];

        this.chunkWidth = TileData.PROPERTIES.CHUNKWIDTH;
        this.chunkHeight = TileData.PROPERTIES.CHUNKHEIGHT;
        this.tileSize = TileData.PROPERTIES.TILESIZE;
        this.generatedChunkIndex = 0;

        this.chunkPixelWidth = this.chunkWidth * this.tileSize;
        this.chunkPixelHeight = this.chunkHeight * this.tileSize;

        this._previousActiveChunk;

        this.mapSpriteEntityFactory = new MapSpriteEntityFactory(this.scene);

        this.mapGenerator = new MapGenerator({scene:this.scene, map:this});
        this.rootChunkCenterPosition = {width:this.camera.width/2, height:this.camera.height/2};
        this.rootChunk = this._createChunk(0, 0);
        this.rootChunk.setPosition(this.rootChunkCenterPosition.width, this.rootChunkCenterPosition.height);
        this.activeChunk = this.rootChunk;

        this._activeChunkChanged();
        this._updateSpriteEntityFactory();

        this.mapDebugController = new MapDebugController({enabled:true, scene:this.scene, rootChunk:this.rootChunk});
    }


    resetChunkCollisionsFor(chunkList){
        chunkList.forEach((c)=>{
            c.resetCollision();
        })
    }

    _getOrCreateChunkByCoord(x, y){
        let fresh = false;
        let possibleChunk = this._getChunkByCoord(x, y);
        if(typeof(possibleChunk) == "undefined") {//prevent from building one if already exists at that world cordinate
            possibleChunk = this._createChunk(x, y);
            this.mapGenerator.addConstruct(possibleChunk);
            fresh = true;
        }
        return {chunk: possibleChunk, fresh: fresh};
    }

    _createChunk(x, y){
        this.generatedChunkIndex++;

        let pos = this._convertCoordToPos(x, y);

        let generatedChunk = new MapChunk({
            scene: this.scene,
            opt: {
                index: this.generatedChunkIndex,
                xCoord: x,
                yCoord: y,
                x:pos.x,
                y:pos.y,
                chunkHeight: this.chunkHeight,
                chunkWidth: this.chunkWidth,
                tileSize: this.tileSize
            }
        });

        this.chunks.push(generatedChunk);
        return generatedChunk;
    }

    _generateNeighbouringChunks(){
        if(this.activeChunk.neighbours.length < 8){
            for(var x=-1;x<=1;x++){
                for(var y=-1;y<=1;y++){
                    //prevent from making itself a neighbour
                    if(x == 0 && y == 0) continue;
                    let offsetXCoord = this.activeChunk.xCoord+x;
                    let offsetYCoord = this.activeChunk.yCoord+y;
                    let possibleChunk = this._getOrCreateChunkByCoord(offsetXCoord, offsetYCoord);
                    this.activeChunk.addNeighbourChunkReference(new MapChunkNeighbour({mapChunk:possibleChunk.chunk, xDir:x, yDir:y}));
                }
            }
        }
    }

    _updateSpriteEntityFactory(){
        for(var i=0;i<this.activeChunk.neighbours.length;i++){
            this._updateChunkSpriteEntities(this.activeChunk.neighbours[i].mapChunk);
        }
        this._updateChunkSpriteEntities(this.activeChunk);
    }

    _updateChunkSpriteEntities(chunk){
        let treeList= chunk.chunkGenerator.treeList;
        for(var j=0;j<treeList.length;j++){
            let currentTree = treeList[j];
            this.mapSpriteEntityFactory.setFreshSprite(currentTree.x,currentTree.y);
        }
    }

    _activeChunkChanged(){
        console.log("ACTIVE CHUNK CHANGED");
        this.neighbouringChunks = [];
        this._generateNeighbouringChunks();
        this._updateSpriteEntityFactory();
    }

    _updateActiveChunk(){
        let currentActiveChunk = this.getActiveChunk();
        if(this._previousActiveChunk != currentActiveChunk) {
            this.activeChunk = currentActiveChunk;
            this._activeChunkChanged();
            this._previousActiveChunk = currentActiveChunk;
            return true;
        }
        return false;
    }

    _getWorldPositionFromPointerPosition(x, y){
        let cameraX = this.scene.cameras.main.scrollX;
        let cameraY = this.scene.cameras.main.scrollY;
        return({x:x+cameraX, y:y+cameraY});
    }

    _getTileAndChunkByCoord(x, y){
        let chunkCoords = {x:Math.floor(x/this.chunkWidth), y:Math.floor(y/this.chunkWidth)};
        let xTile = x % (this.chunkWidth);
        let yTile = y % (this.chunkHeight);
        let possibleChunk = this._getOrCreateChunkByCoord(chunkCoords.x, chunkCoords.y);
        let tile = possibleChunk.chunk.getTileAt({x:xTile, y:yTile});
        return {chunk:possibleChunk.chunk, tile:tile};
    }

    _getTileByWorldPosition(x, y){
        let xOffset = x - (this.camera.width/2);
        let yOffset = y - (this.camera.height/2);
        let chunkCoords = this._convertPosToChunkCoord(xOffset, yOffset);
        let possibleChunk = this._getOrCreateChunkByCoord(chunkCoords.x, chunkCoords.y);
        let tilePos = possibleChunk.chunk.tileMap.worldToTileXY(x, y);
        let tile = possibleChunk.chunk.getTileAt({x:tilePos.x, y:tilePos.y});
        return {tile: tile, chunk: possibleChunk.chunk};
    }

    _getTileWorldCoord(tile, chunk) {
        let chunkWorldXPos = chunk.xCoord * TileData.PROPERTIES.CHUNKWIDTH;
        let chunkWorldYPos = chunk.yCoord * TileData.PROPERTIES.CHUNKHEIGHT;
        let xWorld = chunkWorldXPos + tile.x;
        let yWorld = chunkWorldYPos + tile.y;
        return {x: xWorld, y: yWorld};
    }

    getActiveChunk(){
        let x = this.camera.scrollX;
        let y = this.camera.scrollY;
        let coords = this._convertPosToChunkCoord(x, y);
        let activeChunk = this._getChunkByCoord(coords.x, coords.y);
        return activeChunk;
    }

    _convertPosToChunkCoord(x, y){
        let xChunkCoord, yChunkCoord;
        xChunkCoord = Math.round((x / this.chunkPixelWidth));
        yChunkCoord = Math.round((y / this.chunkPixelHeight));
        return {x: xChunkCoord, y:yChunkCoord};
    }

    _convertCoordToPos(x, y){
        let xChunkPos, yChunkPos;
        xChunkPos = Math.round((x * this.chunkPixelWidth))+(this.camera.width/2);
        yChunkPos = Math.round((y * this.chunkPixelHeight))+(this.camera.height/2);
        return {x: xChunkPos, y:yChunkPos};
    }

    _getChunkByCoord(x, y){
        let chunks = _.filter(this.chunks, (c) => { return (c.xCoord == x && c.yCoord == y);});
        if(chunks.length > 1) console.error("Returned multiple chunks on same coordinate");
        return chunks[0];
    }

    _getNeighbouringChunkByCoord(x, y){
        let chunks = _.filter(this.neighbouringChunks, (c) => { return (c.xCoord == x && c.yCoord == y);});
        if(chunks.length > 1) console.error("Returned multiple chunks on same coordinate");
        return chunks[0];
    }

    update(){
        this._updateActiveChunk();
        this.mapDebugController.update(this);
    }
}