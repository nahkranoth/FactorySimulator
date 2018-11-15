import {_} from "underscore";
import {TileData} from "../data/tileData";

export class MapChunkController{
    constructor(params){
        this.scene = params.scene;
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
        return({x:x+this.camera.x, y:y+this.camera.y});
    }

    _getChunkByCoord(x, y){
        let chunks = _.filter(this.chunks, (c) => { return (c.xCoord == x && c.yCoord == y);});
        if(chunks.length > 1) console.error("Returned multiple chunks on same coordinate");
        return chunks[0];
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

    _convertCoordToPos(x, y){
        let xChunkPos, yChunkPos;
        xChunkPos = Math.round((x * TileData.getChunkDimensionsInPixels().x))+(this.camera.width/2);
        yChunkPos = Math.round((y * TileData.getChunkDimensionsInPixels().y))+(this.camera.height/2);
        return {x: xChunkPos, y:yChunkPos};
    }

    _convertPosToChunkCoord(x, y){
        let xChunkCoord, yChunkCoord;
        xChunkCoord = Math.round((x / TileData.getChunkDimensionsInPixels().x));
        yChunkCoord = Math.round((y / TileData.getChunkDimensionsInPixels().x));
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
}