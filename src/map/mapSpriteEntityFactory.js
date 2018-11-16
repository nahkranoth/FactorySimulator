import {TileData} from "../data/tileData";
import {MapSpriteEntity} from "../map/mapSpriteEnitity";

export class MapSpriteEntityFactory{
    constructor(scene){
        this.scene = scene;
        this.poolMax = 100; //This should be: 9 chunks * possible items
        this.spritePool = [];
        this.spritePoolIndex = 0;
    }

    //TODO: Refactor to seperate SpritePool Object to be re-used by NPC's etc

    _createNewSprite(){
        let index = this.spritePool.length;
        let sprite = new MapSpriteEntity({
            scene: this.scene,
            key: 'worldEntities',
            frame:'Tree1',
            index:index,
            x:400,
            y:300 + (20 * index)
        });
        this.spritePool.push(sprite);
        //console.log("Create new sprite");
        return sprite;
    }

    _getOrCreateSprite(){
        if(this.spritePool.length <= this.poolMax) return this._createNewSprite();
        return this._getFromSpritePool();
    }

    _getFromSpritePool(){
        this.spritePoolIndex %= (this.poolMax+1);
        this.spritePoolIndex++;
        //console.log("lenght ",this.spritePoolIndex-1);
        return this.spritePool[this.spritePool.length - (this.spritePoolIndex)];
    }

    setFreshSprite(x, y, frame){
        let sprite = this._getOrCreateSprite();
        if(frame) sprite.setFrame(frame);
        sprite.setPosition(x, y);
        sprite.setDepth(y + TileData.PROPERTIES.TILESIZE + TileData.PROPERTIES.DEPTHSTART);
    }
}