import {TileData} from "../data/tileData";

export class MapSpriteEntity extends Phaser.GameObjects.Sprite{
    constructor(params){
        super(params.scene, params.x, params.y , params.key);
        this.scene = params.scene;﻿
        this.scene.add.existing(this);﻿
        this.depth = this.y + TileData.PROPERTIES.TILESIZE + TileData.PROPERTIES.DEPTHSTART;
    }
}