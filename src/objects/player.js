import {GameObject} from "../core/gameObject"

export class Player extends Phaser.Physics.Arcade.Sprite{

    constructor(params) {
        super(params.scene, params.x, params.y, params.key);
        this.scene.physics.add.existing(this);
        this.scene.add.existing(this);
        this.cursors = this.scene.input.keyboard.createCursorKeys();
        this.rotation = 0.08;
        this.depth = 999999;
        //this.speed = 3;
    }

    update(){
        this.body.setVelocityX(0);
        this.body.setVelocityY(0);
        if (this.cursors.right.isDown)
        {
            this.body.setVelocityX(100);
        }else if(this.cursors.left.isDown){
            this.body.setVelocityX(-100);

        }
        if (this.cursors.up.isDown)
        {
            this.body.setVelocityY(-100);
        }else if(this.cursors.down.isDown){
            this.body.setVelocityY(100);
        }
    }
}