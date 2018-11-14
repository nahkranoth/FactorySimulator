import {TileData} from "../data/tileData";
import {MapSpriteEntity} from "../map/mapSpriteEnitity";

export class MapSpriteEntityFactory{
    constructor(scene){
        this.scene = scene;
        this.poolAmount = TileData.PROPERTIES.CHUNKWIDTH * TileData.PROPERTIES.CHUNKHEIGHT;
        this.spritePool = [];
        this.generatePool();
    }

    generatePool(){
        for(var i=0;i<this.poolAmount;i++){
            let sprite = new MapSpriteEntity({
                scene: this.scene,
                key: 'worldEntities',
                x: 100,
                y: 100
            });
            this.spritePool.push(sprite);
        }

        console.log(this.scene);
    }

    getFreshSprite(x, y, key){

    }
}