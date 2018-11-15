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

    _getChunkByCoord(x, y){
        let chunks = _.filter(this.chunks, (c) => { return (c.xCoord == x && c.yCoord == y);});
        if(chunks.length > 1) console.error("Returned multiple chunks on same coordinate");
        return chunks[0];
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

    getActiveChunk(){
        let x = this.camera.scrollX;
        let y = this.camera.scrollY;
        let coords = this._convertPosToChunkCoord(x, y);
        let activeChunk = this._getChunkByCoord(coords.x, coords.y);
        return activeChunk;
    }
}