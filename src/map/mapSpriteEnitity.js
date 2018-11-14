export class MapSpriteEntity extends Phaser.GameObjects.Sprite{
    constructor(params){
        super(params.scene, params.x, params.y , params.key);
        this.scene = params.scene;﻿
        this.scene.add.existing(this);﻿
    }
}