import {TileData} from "../data/tileData";

export class FireBall extends Phaser.Physics.Arcade.Sprite{

    constructor(params) {
        super(params.scene, params.x, params.y, params.key);
        this.scene.physics.add.existing(this);
        this.scene.add.existing(this);
        this.cursors = this.scene.input.keyboard.createCursorKeys();
        this.rotation = 0.08;
        this.moveSpeed = 200;
        this.depth = TileData.PROPERTIES.DEPTHSTART + 99999;
        this.body.setBounce(1).setCollideWorldBounds(true);
        this.body.setVelocityX((Math.random()*20) + 100);
        this.body.setVelocityY((Math.random()*20) + 100);
        this.body.setCircle(30, 10, 10);
        this.body.onWall();
    }

    onWorldSpriteCollision(sprite){
        sprite.assignedToWorldEntity.burn();
    }

    update(){
        this.angle+=2;
    }
}