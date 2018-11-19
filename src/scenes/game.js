import {Player} from '../objects/player.js';
import {FireBall} from '../objects/fireball.js'
import {Map} from '../map/map.js';
import {BuildInteractionController} from '../map/buildInteractionController';
import {SpriteEntity} from "../map/spriteEntity";

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

        this.physics.world.setBounds(this.cameras.main.scrollX, this.cameras.main.scrollY, this.cameras.main.width, this.cameras.main.height);

        this.fireBall = new FireBall({
            scene:this,
            key:"fireball",
            x:this.cameras.main.width/2,
            y:this.cameras.main.height/2
        });

        this.cameras.main.startFollow(this.player);
        this.gui = this.scene.manager.getScene("gui");
        this.map = new Map({scene:this,opt:{}});



        new BuildInteractionController({scene:this, gui:this.gui, map:this.map});
        //Depth Controller
    }


    update(){
        this.map.update();
        this.player.update();
        this.physics.world.setBounds(this.cameras.main.scrollX, this.cameras.main.scrollY, this.cameras.main.width, this.cameras.main.height);
        this.fireBall.update();
    }
}