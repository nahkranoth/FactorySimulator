import {_} from 'underscore';
import {MapChunk} from './mapChunk.js';
import {TileData} from '../data/tileData.js'
import {MapChunkNeighbour} from './mapChunkNeighbour.js'
import {MapGenerator} from './mapGenerator.js'
import {MapDebugController} from "./mapDebugController.js";
import {MapWorldEntityController} from "./mapWorldEntityController.js";
import {MapChunkController} from "./mapChunkController";

export class Map extends Phaser.GameObjects.GameObject {

    constructor(params){
        super(params.scene, params.opt);
        this.camera = params.scene.cameras.main;

        this.mapChunkController = new MapChunkController({scene:this.scene});
        this.mapGenerator = new MapGenerator({scene:this.scene, map:this});

        this.rootChunkCenterPosition = {width:this.camera.width/2, height:this.camera.height/2};
        this.rootChunk = this._createChunk(0, 0);
        this.rootChunk.setPosition(this.rootChunkCenterPosition.width, this.rootChunkCenterPosition.height);

        this.activeChunk = this.rootChunk;

        this.mapWorldEntityController = new MapWorldEntityController({scene:this.scene});

        this._activeChunkChanged();
        this.mapDebugController = new MapDebugController({enabled:true, scene:this.scene, rootChunk:this.rootChunk});
    }

    _getOrCreateChunkByCoord(x, y){
        let fresh = false;
        let possibleChunk = this.mapChunkController._getChunkByCoord(x, y);
        if(typeof(possibleChunk) == "undefined") {//prevent from building one if already exists at that world cordinate
            possibleChunk = this._createChunk(x, y);
            this.mapGenerator.addConstruct(possibleChunk);
            fresh = true;
        }
        return {chunk: possibleChunk, fresh: fresh};
    }

    _createChunk(x, y){
        this.mapChunkController.generatedChunkIndex++;

        let pos = this.mapChunkController._convertCoordToPos(x, y);

        let generatedChunk = new MapChunk({
            scene: this.scene,
            opt: {
                index: this.mapChunkController.generatedChunkIndex,
                xCoord: x,
                yCoord: y,
                x:pos.x,
                y:pos.y,
                chunkHeight: TileData.PROPERTIES.CHUNKHEIGHT,
                chunkWidth: TileData.PROPERTIES.CHUNKWIDTH,
                tileSize: TileData.PROPERTIES.TILESIZE
            }
        });

        this.mapChunkController.chunks.push(generatedChunk);
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

    _activeChunkChanged(){
        console.log("ACTIVE CHUNK CHANGED");
        this._generateNeighbouringChunks();
        this.mapWorldEntityController._updateSpriteEntityFactory(this.activeChunk);
    }

    _updateActiveChunk(){
        let currentActiveChunk = this.mapChunkController.getActiveChunk();
        if(this.mapChunkController._previousActiveChunk != currentActiveChunk) {
            this.activeChunk = currentActiveChunk;
            this._activeChunkChanged();
            this.mapChunkController._previousActiveChunk = currentActiveChunk;
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
        let chunkCoords = {x:Math.floor(x/TileData.PROPERTIES.CHUNKWIDTH), y:Math.floor(y/TileData.PROPERTIES.CHUNKWIDTH)};
        let xTile = x % (TileData.PROPERTIES.CHUNKWIDTH);
        let yTile = y % (TileData.PROPERTIES.CHUNKHEIGHT);
        let possibleChunk = this._getOrCreateChunkByCoord(chunkCoords.x, chunkCoords.y);
        let tile = possibleChunk.chunk.getTileAt({x:xTile, y:yTile});
        return {chunk:possibleChunk.chunk, tile:tile};
    }

    _getTileByWorldPosition(x, y){
        let xOffset = x - (this.camera.width/2);
        let yOffset = y - (this.camera.height/2);
        let chunkCoords = this.mapChunkController._convertPosToChunkCoord(xOffset, yOffset);
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



    update(){
        this._updateActiveChunk();
        this.mapDebugController.update(this);
    }
}