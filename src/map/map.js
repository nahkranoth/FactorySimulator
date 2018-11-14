import {MapChunk} from '../map/mapChunk.js';
import {TileData} from '../data/tileData.js'
import {MapChunkNeighbour} from '../map/mapChunkNeighbour'
import {MapGenerator} from '../map/mapGenerator'
import {_} from 'underscore';

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

        this.mapGenerator = new MapGenerator({scene:this.scene, map:this});

        this.rootChunkCenterPosition = {width:this.camera.width/2, height:this.camera.height/2};
        this.rootChunk = this._createChunk(0, 0);
        this.rootChunk.setPosition(this.rootChunkCenterPosition.width, this.rootChunkCenterPosition.height);
        this.activeChunk = this.rootChunk;
        this._activeChunkChanged();

        this.mapGenerator.addConstruct(this.rootChunk);

        //this.mapGenerator.addConstruct(this.rootChunk);

        // let tile = this._getTileByCoord(127, 8);
        // tile.index = 2;

        //this.activeCameraDebugBounds = new DebugRect({scene:this.scene, size:200, color:0xff0000, lineColor:0xff0000, outlinesOnly:true});
        //this.activeChunkDebugBounds = new DebugRect({scene:this.scene, camera:this.camera, size:this.rootChunk.getBounds().width, color:0x0000ff, lineColor:0x0000ff, outlinesOnly:true});
    }

    _getOrCreateChunkByCoord(x, y){
        let possibleChunk = this._getChunkByCoord(x, y);
        if(typeof(possibleChunk) == "undefined") {//prevent from building one if already exists at that world cordinate
            possibleChunk = this._createChunk(x, y);
            this.mapGenerator.addConstruct(possibleChunk);
        }
        return possibleChunk;
    }

    _createChunk(x, y){
        this.generatedChunkIndex++;
        let generatedChunk = new MapChunk({
            scene: this.scene,
            opt: {
                index: this.generatedChunkIndex,
                xCoord: x,
                yCoord: y,
                chunkHeight: this.chunkHeight,
                chunkWidth: this.chunkWidth,
                tileSize: this.tileSize
            }
        });

        let pos = this._convertCoordToPos(x, y);
        generatedChunk.setPosition(pos.x, pos.y);
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
                    //then just add as neighbour
                    this.activeChunk.addNeighbourChunkReference(new MapChunkNeighbour({mapChunk:possibleChunk, xDir:x, yDir:y}));
                }
            }
        }
    }

    _activeChunkChanged(){
        console.log("ACTIVE CHUNK CHANGED");
        this.neighbouringChunks = [];
        this._generateNeighbouringChunks();
    }

    _updateActiveChunk(){
        let currentActiveChunk = this._getActiveChunk();
        if(this._previousActiveChunk != currentActiveChunk) {
            this.activeChunk = currentActiveChunk;
            this._activeChunkChanged();
            this._previousActiveChunk = currentActiveChunk;
            return true;
        }
        return false;
    }

    _getTileAndChunkByCoord(x, y){
        let chunkCoords = {x:Math.floor(x/this.chunkWidth), y:Math.floor(y/this.chunkWidth)};
        let xTile = x % (this.chunkWidth);
        let yTile = y % (this.chunkHeight);
        let chunk = this._getOrCreateChunkByCoord(chunkCoords.x, chunkCoords.y);
        let tile = chunk.getTileAt({x:xTile, y:yTile});
        return {chunk:chunk, tile:tile};
    }

    _getTileByWorldPosition(x, y){
        let xOffset = x - (this.camera.width/2);
        let yOffset = y - (this.camera.height/2);
        let chunkCoords = this._convertPosToChunkCoord(xOffset, yOffset);
        let chunk = this._getOrCreateChunkByCoord(chunkCoords.x, chunkCoords.y);
        let tilePos = chunk.map.worldToTileXY(x, y);
        let tile = chunk.getTileAt({x:tilePos.x, y:tilePos.y});
        return {tile: tile, chunk: chunk};
    }

    _getTileWorldCoord(tile, chunk) {
        let chunkWorldXPos = chunk.xCoord * TileData.PROPERTIES.CHUNKWIDTH;
        let chunkWorldYPos = chunk.yCoord * TileData.PROPERTIES.CHUNKHEIGHT;
        let xWorld = chunkWorldXPos + tile.x;
        let yWorld = chunkWorldYPos + tile.y;
        return {x: xWorld, y: yWorld};
    }
    _getActiveChunk(){
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
        //update to fictional camera position
        //this.activeCameraDebugBounds.setPosition(this.camera.scrollX+this.camera.centerX, this.camera.scrollY+this.camera.centerY);
        //this.activeChunkDebugBounds.setPosition(this._getActiveChunk().getPosition().x, this._getActiveChunk().getPosition().y);
    }
}