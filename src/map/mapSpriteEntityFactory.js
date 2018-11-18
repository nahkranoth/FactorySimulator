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

    _createNewSprite(worldEntity){
        let index = this.spritePool.length;
        let sprite = new MapSpriteEntity({
            scene: this.scene,
            key: 'worldEntities',
            frame:'Tree1',
            index:index,
            x:400,
            y:300 + (20 * index),
            assignedToWorldEntity:worldEntity
        });
        this.spritePool.push(sprite);
        worldEntity.spriteEntity = sprite;
        this.movableSpritePool.push(sprite);
        return sprite;
    }

    _getOrCreateSprite(worldEntity){
        if(this.spritePool.length <= this.poolMax) return this._createNewSprite(worldEntity);
        return this._getFromSpritePool(worldEntity);
    }

    _getFromSpritePool(worldEntity){
        this.spritePoolIndex %= (this.poolMax+1);
        this.spritePoolIndex++;
        let sprite = this.spritePool[this.spritePool.length - (this.spritePoolIndex)];
        sprite.assignedToWorldEntity.spriteEntity = null;
        sprite.assignedToWorldEntity = worldEntity;
        worldEntity.spriteEntity = sprite;
        return sprite;
    }

    setFreshWorldSprite(worldEntity){
        let sprite = this._getOrCreateSprite(worldEntity);
        if(worldEntity.frame) sprite.setFrame(worldEntity.frame);
        sprite.setPosition(worldEntity.x, worldEntity.y);
        sprite.setDepth(worldEntity.y + TileData.PROPERTIES.TILESIZE + TileData.PROPERTIES.DEPTHSTART);
        return sprite;
    }

    updateMovableEntities(){
        for(var i=0;i<this.movableSpritePool.length;i++){
            this.movableSpritePool[i].update();
        }
    }
}