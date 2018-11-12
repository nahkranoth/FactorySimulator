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
        let tiles = this.generateTiles();
        let bg = this.add.sprite( 0, 0, "bg");
        let sprites = [bg];
        sprites = sprites.concat(tiles);
        let container = this.add.container(x, y, sprites);

    }

    generateTiles(){
        let tiles = this.add.sprite( 0, 0, "worldTilesImg");
        let tileWidth = tiles.width;
        let tileHeight = tiles.height;
        let tileAmount = tileWidth/TileData.PROPERTIES.TILESIZE;
        let croppedTileWidth = tileWidth/tileAmount;
        tiles.destroy();//got the sizes, thats all I needed

        let returnTiles = [tiles];
        for(var i=0;i<tileAmount;i++){
            let x = croppedTileWidth*i;
            let sprite = this.add.sprite(x, 0, "worldTilesImg").setCrop(x, 0, croppedTileWidth, tileHeight).setInteractive();

            sprite.on("pointerdown", (pointer) => {
                sprite.setTint(0xff0000);
            });

            returnTiles.push(sprite);
        }

        return returnTiles;
    }

    update(){

    }

    _drawGraphic(graphics, posX, posY, width, height, color){
        graphics.fillStyle(color, 1);
        graphics.fillRect(posX, posY, width, height);
    }
}