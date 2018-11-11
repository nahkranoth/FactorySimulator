import {GameObject} from "../core/gameObject"

export class Player extends GameObject{
    init(){
        this.addSprite("plaey");
        this.cursors = this.scene.input.keyboard.createCursorKeys();
        this.rotation = 0.12;
    }

    update(){
        if (this.cursors.right.isDown)
        {
            this.rotation += 0.1;
        }
    }
}