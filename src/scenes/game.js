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

        this.input.on('pointerdown', this.placeTile, this);

    }

    placeTile(){
        var mouseWorldPoint = this.input.activePointer.positionToCamera(this.cameras.main);
        var source = this.map._getTileByWorldPosition(mouseWorldPoint.x, mouseWorldPoint.y);
        source.chunk.setTile(source.tile, 3);
    }


    update(){
        this.map.update();
        this.player.update();
    }
}