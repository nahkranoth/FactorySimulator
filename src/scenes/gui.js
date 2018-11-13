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
        let returnTiles = [];
        console.log(TileData.worldTileData.tiles);
        let tileSelectorContainer = this.add.container();
        for(var i=0;i<TileData.worldTileData.tiles.length;i++){
            let data = TileData.worldTileData.tiles[i];
            let x = TileData.PROPERTIES.TILESIZE*i;
            let sprite = this.add.sprite(x, 0, "worldTilesAtlas", data.name).setInteractive();
            tileSelectorContainer.add(sprite);
            sprite.on("pointerdown", (pointer) => {
                sprite.setTint(0xff0000);
            });
            tileSelectorContainer.x = 100;
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