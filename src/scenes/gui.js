import {TileData} from "../data/tileData";

export class GUI extends Phaser.Scene {

    constructor(){
        super({key:"gui"})
    }

    preload(){
        console.log("PRELOAD GUI");
    }

    create(){
        console.log("CREATE GUI");
        //Background:
        let graphics = this.add.graphics();
        let height = 40;
        let width = this.cameras.main.width;
        let x = this.cameras.main.width/2;
        let y = this.cameras.main.height-(height/2);

        this._drawGraphic(graphics, 0, 0, width, height, 0xE1E0E7);
        graphics.generateTexture("bg", width, height);
        graphics.destroy();
        //Sprite Editor
        let tiles = this.add.sprite( 0, 0, "worldTilesImg").setInteractive();
        let tileWidth = tiles.width;
        let tileHeight = tiles.height;

        console.log(TileData.PROPERTIES);

        let bg = this.add.sprite( 0, 0, "bg");

        let container = this.add.container(x, y, [bg, tiles]);

    }

    update(){

    }

    _drawGraphic(graphics, posX, posY, width, height, color){
        graphics.fillStyle(color, 1);
        graphics.fillRect(posX, posY, width, height);
    }
}