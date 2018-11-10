import {Player} from '../objects/playerTilePhysics.js';
import {TileMap} from '../objects/tileMap.js';

export class Game extends Phaser.Scene {
    constructor(){
        super({key: "game"});
    }

    create() {

        console.log("createa");
        this.tilemap = new TileMap({scene:this, opt:{}});

        this.player = new Player({
            scene:this
        });

        this.player.x = 320;
        this.player.y = 320;


        this.tilemap.layer.setTileIndexCallback(1, this.hitCoin, this);
        this.physics.add.collider(this.player.sprite, this.tilemap.layer);
        //
        // this.cameras.main.setBounds(0, 0, this.tilemap.widthInPixels, this.tilemap.heightInPixels);
    }

    hitCoin(){
        console.log("HITS");
    }

    update(){
        this.tilemap.update();
        this.player.update();
    }
}