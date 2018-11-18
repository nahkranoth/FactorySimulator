import {TileData} from "../data/tileData";
import {MapSpriteEntity} from "../map/mapSpriteEnitity";
import {_} from "underscore"

export class MapSpriteEntityFactory extends Phaser.Events.EventEmitter{
    constructor(params){
        super(params);
        this.scene = params.scene;
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

    getSpriteAt(x, y, frame, chunk){
        let arr = _.find(this.spritePool, (sprite) => {
            let spritePosition = sprite.getPosition();
            return (spritePosition.y == y && spritePosition.x == x && sprite.frame.name == frame && sprite.assignedToChunk == chunk)
        });
        return arr;
    }

    setFreshWorldSprite(x, y, frame, chunk){
        let sprite = this._getOrCreateSprite(chunk);
        if(frame) sprite.setFrame(frame);
        sprite.setPosition(x, y);
        sprite.setDepth(y + TileData.PROPERTIES.TILESIZE + TileData.PROPERTIES.DEPTHSTART);
        return sprite;
    }

    updateMovableEntities(){
        for(var i=0;i<this.movableSpritePool.length;i++){
            this.movableSpritePool[i].update();
        }
    }
}