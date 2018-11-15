import {_} from "underscore";
import {TileData} from "../data/tileData";
import {MapChunkNeighbour} from "./mapChunkNeighbour";

export class MapChunkController{
    constructor(params){
        this.scene = params.scene;
        this.map = params.map;
        this.camera = this.scene.cameras.main;
        this.chunks = [];
        this._previousActiveChunk;
        this.generatedChunkIndex = 0;
    }

    resetChunkCollisionsFor(chunkList){
        chunkList.forEach((c)=>{
            c.resetCollision();
        })
    }

    _getWorldPositionFromPointerPosition(x, y){
        return({x:x+this.camera.scrollX, y:y+this.camera.scrollY});
    }

    _getChunkByCoord(x, y){
        let chunks = _.filter(this.chunks, (c) => { return (c.xCoord == x && c.yCoord == y);});
        if(chunks.length > 1) console.error("Returned multiple chunks on same coordinate");
        return chunks[0];
    }

    _getOrCreateChunkByCoord(x, y){
        let fresh = false;
        let possibleChunk = this._getChunkByCoord(x, y);
        if(typeof(possibleChunk) == "undefined") {//prevent from building one if already exists at that world cordinate
            possibleChunk = this.map._createChunk(x, y);
            this.map.mapGenerator.addConstruct(possibleChunk);
            fresh = true;
        }
        return {chunk: possibleChunk, fresh: fresh};
    }

    _convertCoordToPos(x, y){
        let xChunkPos, yChunkPos;
        xChunkPos = Math.round((x * TileData.getChunkDimensionsInPixels().x))+(this.camera.width/2);
        yChunkPos = Math.round((y * TileData.getChunkDimensionsInPixels().y))+(this.camera.height/2);
        return {x: xChunkPos, y:yChunkPos};
    }

    _convertPosToChunkCoord(x, y){
        let xChunkCoord, yChunkCoord;
        xChunkCoord = Math.round((x / TileData.getChunkDimensionsInPixels().x));
        yChunkCoord = Math.round((y / TileData.getChunkDimensionsInPixels().y));
        return {x: xChunkCoord, y:yChunkCoord};
    }

    _getTileWorldCoord(tile, chunk) {
        let chunkWorldXPos = chunk.xCoord * TileData.PROPERTIES.CHUNKWIDTH;
        let chunkWorldYPos = chunk.yCoord * TileData.PROPERTIES.CHUNKHEIGHT;
        let xWorld = chunkWorldXPos + tile.x;
        let yWorld = chunkWorldYPos + tile.y;
        return {x: xWorld, y: yWorld};
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

    getActiveChunk(){
        let x = this.camera.scrollX;
        let y = this.camera.scrollY;
        let coords = this._convertPosToChunkCoord(x, y);
        let activeChunk = this._getChunkByCoord(coords.x, coords.y);
        return activeChunk;
    }

    _generateNeighbouringChunks(){
        if(this.map.activeChunk.neighbours.length < 8){
            for(var x=-1;x<=1;x++){
                for(var y=-1;y<=1;y++){
                    //prevent from making itself a neighbour
                    if(x == 0 && y == 0) continue;
                    let offsetXCoord = this.map.activeChunk.xCoord+x;
                    let offsetYCoord = this.map.activeChunk.yCoord+y;
                    let possibleChunk = this._getOrCreateChunkByCoord(offsetXCoord, offsetYCoord);
                    this.map.activeChunk.addNeighbourChunkReference(new MapChunkNeighbour({mapChunk:possibleChunk.chunk, xDir:x, yDir:y}));
                }
            }
        }
    }

    _activeChunkChanged(){
        console.log("ACTIVE CHUNK CHANGED");
        this._generateNeighbouringChunks();
        this.map.mapWorldEntityController._updateSpriteEntityFactory(this.map.activeChunk);
    }

    _updateActiveChunk(){
        let currentActiveChunk = this.getActiveChunk();
        if(this._previousActiveChunk != currentActiveChunk) {
            this.map.activeChunk = currentActiveChunk;
            this._activeChunkChanged();
            this._previousActiveChunk = currentActiveChunk;
            return true;
        }
        return false;
    }

    _getTileAndChunkByCoord(x, y){
        let chunkCoords = {x:Math.floor(x/TileData.PROPERTIES.CHUNKWIDTH), y:Math.floor(y/TileData.PROPERTIES.CHUNKWIDTH)};
        let xTile = x % (TileData.PROPERTIES.CHUNKWIDTH);
        let yTile = y % (TileData.PROPERTIES.CHUNKHEIGHT);
        let possibleChunk = this._getOrCreateChunkByCoord(chunkCoords.x, chunkCoords.y);
        let tile = possibleChunk.chunk.getTileAt({x:xTile, y:yTile});
        return {chunk:possibleChunk.chunk, tile:tile};
    }
}