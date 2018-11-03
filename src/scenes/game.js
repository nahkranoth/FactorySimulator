import {Player} from '../objects/player.js';
import {TileMap} from '../objects/tileMap.js';

export class Game extends Phaser.Scene {
    constructor(){
        super({key: "game"});
    }

    create() {

        this.tilemap = new TileMap({scene:this, opt:{}});



        // this.player = new Player({
        //     scene:this,
        //     opt:{},
        //     position:{x:0, y:0},
        //     size:{w:64, h:64},
        //     rotation:1.2,
        //     pivot:{x:0.5, y:0.5}
        // });
        //
        // this.player.x = 320;
        // this.player.y = 320;
    }

    update(){
        this.tilemap.update();
        // this.player.update();
    }
}