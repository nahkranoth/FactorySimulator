import {TileData} from "../data/tileData";
import {MapSpriteEntity} from "../map/mapSpriteEnitity";
import {_} from "underscore"

export class MapSpriteEntityFactory{
    constructor(scene){
        this.scene = scene;
        this.poolMax = 100; //This should be: 9 chunks * possible items
        this.spritePool = [];
        this.movableSpritePool = [];
        this.spritePoolIndex = 0;

        this._writableChunk = null;//TODO: Warning this might break if I add any more entrypoints
    }

    _createNewSprite(){
        let index = this.spritePool.length;
        let sprite = new MapSpriteEntity({
            scene: this.scene,
            key: 'worldEntities',
            frame:'Tree1',
            index:index,
            x:400,
            y:300 + (20 * index),
            assignedChunk:this._writableChunk
        });
        this.spritePool.push(sprite);
        this.movableSpritePool.push(sprite);
        return sprite;
    }

    _getOrCreateSprite(){
        if(this.spritePool.length <= this.poolMax) return this._createNewSprite();
        return this._getFromSpritePool();
    }

    _getFromSpritePool(){
        this.spritePoolIndex %= (this.poolMax+1);
        this.spritePoolIndex++;

        let sprite = this.spritePool[this.spritePool.length - (this.spritePoolIndex)];
        return sprite;
    }

    _spriteStillAlive(x, y, frame, chunk){
        let arr = _.find(this.spritePool, (sprite) => {
            return (sprite.y == y-(sprite.height/2) && sprite.x == x && sprite.frame.name == frame && sprite.assignedChunk == chunk)
        });
        return arr;
    }

    setFreshSprite(x, y, frame, chunk){
        if(this._spriteStillAlive(x, y, frame, chunk)) return;
        //check if not still alive
        this._writableChunk = chunk;
        let sprite = this._getOrCreateSprite();
        if(frame) sprite.setFrame(frame);
        sprite.setPosition(x, y-(sprite.height/2));
        sprite.setDepth(y + TileData.PROPERTIES.TILESIZE + TileData.PROPERTIES.DEPTHSTART - (sprite.height/2));
    }

    updateMovableEntities(){
        for(var i=0;i<this.movableSpritePool.length;i++){
            this.movableSpritePool[i].update();
        }
    }
}