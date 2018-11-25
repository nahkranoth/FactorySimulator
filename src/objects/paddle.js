import {TileData} from "../data/tileData";

export class Paddle extends Phaser.Physics.Arcade.Sprite{

    constructor(params) {
        super(params.scene, params.x, params.y, params.key);
        this.scene.physics.add.existing(this);
        this.scene.add.existing(this).setInteractive();
        this.body.setMass(99999);
        this.depth = TileData.PROPERTIES.DEPTHSTART + 100000;
        this.body.setEnable(false);
        this.on('pointerdown', this.setCollidingOn, this);
        this.on('pointerup', this.setCollidingOff, this);
    }

    onWorldSpriteCollision(sprite){
        sprite.assignedToWorldEntity.burn();
    }

    setCollidingOn(){
        this.body.setEnable(true);
    }

    setCollidingOff(){
        this.body.setEnable(false);
    }

    onCollision(sprite1){
        let direction = new Phaser.Math.Vector2(sprite1.x -this.x, sprite1.y-this.y).normalize();
        sprite1.setVelocityX(direction.x * 160);
        sprite1.setVelocityY(direction.y * 160);
    }

    update(){

        let size = 600;
        let centerX = this.scene.cameras.main.width/2;
        let centerY = this.scene.cameras.main.height/2;

        let posX = Phaser.Math.Clamp(this.scene.input.x, centerX-size/2, centerX+size/2);
        let posY = Phaser.Math.Clamp(this.scene.input.y, centerY-size/2, centerY+size/2);

        this.x = posX + this.scene.cameras.main.scrollX;
        this.y = posY + this.scene.cameras.main.scrollY;
    }
}