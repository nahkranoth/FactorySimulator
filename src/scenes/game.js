import {Player} from '../objects/player.js';
import {TileMapGenerator} from '../core/tileMapGenerator.js';
import {Map} from '../core/map.js';

export class Game extends Phaser.Scene {
    constructor(){
        super({key: "game"});
    }

    create() {
        this.cameras.main.roundPixels = true
        this.map = new Map({scene:this,opt:{},camera:this.cameras.main});

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
        //this.cameras.main.scrollX += 0.1;
        this.map.update();
        //this.tilemap.update();
        // this.player.update();
    }
}