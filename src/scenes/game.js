import {Player} from '../objects/player.js';
import {TileMapGenerator} from '../core/tileMapGenerator.js';
import {Map} from '../core/map.js';

export class Game extends Phaser.Scene {
    constructor(){
        super({key: "game"});
    }

    create() {
        this.cameras.main.roundPixels = true;
        this.player = new Player({
            scene:this,
            key:"plaey",
            x:this.cameras.main.width/2,
            y:this.cameras.main.height/2
        });

        this.map = new Map({scene:this,opt:{}});
        this.cameras.main.startFollow(this.player);
    }

    update(){
        //this.player.x += 10;
        //this.player.y += 10;
        this.map.update();
        this.player.update();
    }
}