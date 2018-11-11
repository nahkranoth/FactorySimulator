import {GameObject} from "../core/gameObject"

export class Player extends Phaser.Physics.Arcade.Sprite{

    constructor(params) {
        super(params.scene, params.x, params.y, params.key);
        this.scene.add.existing(this);
        this.cursors = this.scene.input.keyboard.createCursorKeys();
        this.rotation = 0.08;
        this.depth = 999999;
        this.speed = 3;
    }

    update(){
        if (this.cursors.right.isDown)
        {
            this.x += this.speed;
        }else if(this.cursors.left.isDown){
            this.x -= this.speed;
        }
        if (this.cursors.up.isDown)
        {
            this.y -= this.speed;
        }else if(this.cursors.down.isDown){
            this.y += this.speed;
        }
    }
}