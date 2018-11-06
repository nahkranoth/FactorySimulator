import {GameObject} from "../core/gameObject"

export class Player extends GameObject{
    init(){
        this.addSprite("download");
        this.cursors = this.scene.input.keyboard.createCursorKeys();
    }

    update(){
        if (this.cursors.right.isDown)
        {
            //this.rotation += 0.1;
        }
    }
}