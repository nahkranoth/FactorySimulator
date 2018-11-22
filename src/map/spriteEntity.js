import {TileData} from "../data/tileData";

export class SpriteEntity extends Phaser.Physics.Arcade.Sprite{
    constructor(params){
        super(params.scene, params.x, params.y , params.key, params.frame);
        this.scene = params.scene;﻿
        this.assignedToWorldEntity = params.assignedToWorldEntity;
        this.scene.physics.add.existing(this);
        this.body.setSize(this.frame.width, this.frame.height);
        this.scene.add.existing(this);﻿
        this.depth = this.y; + TileData.PROPERTIES.TILESIZE + TileData.PROPERTIES.DEPTHSTART - (this.height/2);

        this.scene.physics.add.overlap(this.scene.fireBall, this, (fireBall, spriteEntity)=>{
            this.assignedToWorldEntity.onCollision(fireBall);
        });
    }

    setFrame(name){
        super.setFrame(name);
    }

    reAssign(worldEntity){
        this.assignedToWorldEntity.slumber();
        this.assignedToWorldEntity = worldEntity;
    }

    setPosition(x, y){
        super.setPosition(x, y - (this.height/2));
        //TODO: REFACTOR USING THIS INSTEAD OF MINUS HEIGHT: this.displayOriginY = this.height;
    }

    getPosition(){
        return {x: this.x, y:this.y+(this.height/2)};
    }
}