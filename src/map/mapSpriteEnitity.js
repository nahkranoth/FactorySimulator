import {TileData} from "../data/tileData";

export class MapSpriteEntity extends Phaser.GameObjects.Sprite{
    constructor(params){
        super(params.scene, params.x, params.y , params.key, params.frame);
        this.scene = params.scene;﻿
        this.assignedToWorldEntity = params.assignedToWorldEntity;
        this.scene.add.existing(this);﻿
        this.depth = this.y; + TileData.PROPERTIES.TILESIZE + TileData.PROPERTIES.DEPTHSTART - (this.height/2);
    }

    setPosition(x, y){
        super.setPosition(x, y - (this.height/2));
         this.displayOriginY = this.height;
    }

    getPosition(){
        return {x: this.x, y:this.y+(this.height/2)};
    }

    update(){
        this.angle++;
    }
}