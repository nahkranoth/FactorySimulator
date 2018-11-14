import {Player} from '../objects/player.js';
import {Map} from '../map/map.js';
import {MapBuildController} from '../map/mapBuildController';
import {MapSpriteEntity} from "../map/mapSpriteEnitity";

export class Game extends Phaser.Scene {
    constructor(){
        super({key: "game"});
    }

    create() {
        this.cameras.main.roundPixels = true;

        this.tileMapContainer = this.add.container(0,0);

        this.tileMapContainer.setDepth(0);
        //ORDER MATTERS. NO REALLY!
        this.player = new Player({
            scene:this,
            key:"plaey",
            x:this.cameras.main.width/2,
            y:this.cameras.main.height/2
        });

        this.cameras.main.startFollow(this.player);
        this.gui = this.scene.manager.getScene("gui");
        this.map = new Map({scene:this,opt:{}});

        this.mapBuildController = new MapBuildController({scene:this, gui:this.gui, map:this.map});
        //Depth Controller
    }


    update(){
        this.map.update();
        this.player.update();
    }
}