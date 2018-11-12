import { _ } from 'underscore'


export class TileData{
    static create(scene){
        TileData.worldTileData = scene.cache.json.get('worldTileData');
    }

    static getTileData(index){
        return _.find(TileData.worldTileData.tiles, (tileData) => { return tileData.index == index });
    }
}
TileData.worldTileData = [];

TileData.PROPERTIES = {
    TILESIZE:24,
    CHUNKWIDTH:8,
    CHUNKHEIGHT:8
};