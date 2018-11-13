import {Player} from '../objects/player.js';
import {Map} from '../core/map.js';
import {GUI} from './gui.js';
import {TileData} from '../data/tileData.js';

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

        this.cameras.main.startFollow(this.player);

        this.map = new Map({scene:this,opt:{}});

        this.input.on('pointerdown', this.placeTile, this);
    }

    placeTile(){
        var mouseWorldPoint = this.input.activePointer.positionToCamera(this.cameras.main);
        var source = this.map._getTileByWorldPosition(mouseWorldPoint.x, mouseWorldPoint.y);
        source.chunk.setTile(source.tile, 3);
        source.chunk.resetCollision();
    }

    update(){
        this.map.update();
        this.player.update();
    }
}