import {TileData} from "../data/tileData";
import {FireBall} from "./fireball";

export class Player extends Phaser.Physics.Arcade.Sprite{

    constructor(params) {
        super(params.scene, params.x, params.y, params.key);
        this.scene.physics.add.existing(this);
        this.scene.add.existing(this);
        this.cursors = this.scene.input.keyboard.createCursorKeys();
        this.rotation = 0.08;
        this.moveSpeed = 200;
        this.depth = TileData.PROPERTIES.DEPTHSTART;
        this.keyW= this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyA = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyS = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyD = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    }

    update(){
        this.body.setVelocityX(0);
        this.body.setVelocityY(0);
        if (this.cursors.right.isDown || this.keyD.isDown)
        {
            this.body.setVelocityX(this.moveSpeed);
        }else if(this.cursors.left.isDown || this.keyA.isDown){
            this.body.setVelocityX(-this.moveSpeed);
        }

        if (this.cursors.up.isDown || this.keyW.isDown)
        {
            this.body.setVelocityY(-this.moveSpeed);
            //NOTE: this can run into problems
            this.depth = this.y + TileData.PROPERTIES.DEPTHSTART;
        }else if(this.cursors.down.isDown || this.keyS.isDown){
            this.depth = this.y + TileData.PROPERTIES.DEPTHSTART;
            this.body.setVelocityY(this.moveSpeed);
        }
    }

    onCollision(collidingSprite){
        if(collidingSprite instanceof FireBall){
            console.log("Player Burn");
        }
    }
}