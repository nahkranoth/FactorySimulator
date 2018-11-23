import { _ } from 'underscore'


export class TileData{
    static create(tileData){
        TileData.worldTileData = tileData;
    }

    static getTileData(index){
        return _.find(TileData.worldTileData.tiles, (tileData) => { return tileData.index == index });
    }

    static getChunkDimensionsInPixels(){
        return {
            x:TileData.PROPERTIES.TILESIZE * TileData.PROPERTIES.CHUNKWIDTH,
            y:TileData.PROPERTIES.TILESIZE * TileData.PROPERTIES.CHUNKHEIGHT
        };
    }
}

TileData.worldTileData = [];

TileData.PROPERTIES = {
    TILESIZE:24,
    CHUNKWIDTH:8,
    CHUNKHEIGHT:8,
    DEPTHSTART:1000000
};