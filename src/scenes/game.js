import {Player} from '../objects/player.js';
import {TileMapGenerator} from '../core/tileMapGenerator.js';
import {Map} from '../core/map.js';

export class Game extends Phaser.Scene {
    constructor(){
        super({key: "game"});
    }

    create() {
        this.cameras.main.roundPixels = true;

        this.map = new Map({scene:this,opt:{}});

        this.player = new Player({
            scene:this,
            key:"plaey",
            x:this.cameras.main.width/2,
            y:this.cameras.main.height/2
        });

        this.cameras.main.startFollow(this.player);

    }

    update(){
        //this.cameras.main.scrollX += 2;
        //this.cameras.main.scrollY += 2;
        this.map.update();
        this.player.update();
        //this.tilemap.update();
        // this.player.update();
    }
}