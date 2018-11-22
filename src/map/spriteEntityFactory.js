import {TileData} from "../data/tileData";
import {SpriteEntity} from "./spriteEntity";
import {_} from "underscore"
import {CollisionController} from "../core/collisionController";

export class SpriteEntityFactory extends Phaser.Events.EventEmitter{
    constructor(params){
        super(params);
        this.scene = params.scene;
        this.poolMax = 500; //This should be: 9 chunks * possible items
        this.spritePool = [];
        this.spritePoolIndex = 0;

        // this.scene.physics.add.overlap(this.scene.fireBall, this, (fireBall, spriteEntity)=>{
        //     this.assignedToWorldEntity.onCollision(fireBall);
        // });
    }

    _createNewSprite(worldEntity){
        let index = this.spritePool.length;
        let sprite = new SpriteEntity({
            scene: this.scene,
            key: 'worldEntities',
            frame:worldEntity.frame,
            index:index,
            x:400,
            y:300 + (20 * index),
            assignedToWorldEntity:worldEntity
        });
        if(worldEntity.canCollide) CollisionController.registerAsWorldCollisionSprite(sprite, this.scene);
        this.spritePool.push(sprite);

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
        sprite.reAssign(worldEntity);
        return sprite;
    }

    setFreshWorldSprite(worldEntity){
        let sprite = this._getOrCreateSprite(worldEntity);
        worldEntity.reKindle(sprite);
        sprite.setPosition(worldEntity.x, worldEntity.y);
        let spritePos = sprite.getPosition();
        sprite.setDepth(spritePos.y - (TileData.PROPERTIES.CHUNKHEIGHT/2) + TileData.PROPERTIES.DEPTHSTART);
        return sprite;
    }
}