import {TileData} from "../data/tileData";
import {MapSpriteEntity} from "../map/mapSpriteEnitity";

export class MapSpriteEntityFactory{
    constructor(scene){
        this.scene = scene;
        this.poolMax = 100; //This should be: 9 chunks * possible items
        this.spritePool = [];
        this.movableSpritePool = [];
        this.spritePoolIndex = 0;
    }

    _createNewSprite(chunk){
        let index = this.spritePool.length;
        let sprite = new MapSpriteEntity({
            scene: this.scene,
            key: 'worldEntities',
            frame:'Tree1',
            index:index,
            x:400,
            y:300 + (20 * index),
            assignedToChunk:chunk
        });
        this.spritePool.push(sprite);
        this.movableSpritePool.push(sprite);
        return sprite;
    }

    _getOrCreateSprite(chunk){
        if(this.spritePool.length <= this.poolMax) return this._createNewSprite(chunk);
        return this._getFromSpritePool(chunk);
    }

    _getFromSpritePool(chunk){
        this.spritePoolIndex %= (this.poolMax+1);
        this.spritePoolIndex++;
        let sprite = this.spritePool[this.spritePool.length - (this.spritePoolIndex)];
        sprite.assignedToChunk = chunk;
        return sprite;
    }

    setFreshSprite(x, y, frame, chunk){
        let sprite = this._getOrCreateSprite(chunk);
        if(frame) sprite.setFrame(frame);
        sprite.setPosition(x, y-(sprite.height/2));
        sprite.setDepth(y + TileData.PROPERTIES.TILESIZE + TileData.PROPERTIES.DEPTHSTART - (sprite.height/2));
        return sprite;
    }

    updateMovableEntities(){
        for(var i=0;i<this.movableSpritePool.length;i++){
            this.movableSpritePool[i].update();
        }
    }
}