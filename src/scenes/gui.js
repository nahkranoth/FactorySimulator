import {TileData} from "../data/tileData";
import {PointsController} from "../core/pointsController";

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
        this.tileButtons = this.generateTiles();
        this.selectedTileButton = 0;
        let bg = this.add.sprite( 0, 0, "bg");
        let sprites = [bg];
        sprites = sprites.concat(this.tileButtons);
        let container = this.add.container(x, y, sprites);
        this.indexSelected = 0;

        this.score = this.add.text(this.cameras.main.width/2, 52, '0000', { fontFamily: 'Arial', fontSize: 64, color: '#ffffff', align:"center"});
        this.score.setStroke('#072535', 8);
        this.score.setOrigin(0.5);

        this.points = this.add.text(this.cameras.main.width/2, 104, '', { fontFamily: 'Arial', fontSize: 34, color: '#ffffff', align:"center"});
        this.points.setOrigin(0.5);

    }

    setScoreText(points){
        this.score.text = PointsController.score;
        let sign = points > 0 ? "+" : "-";
        let color = points > 0 ? "#00ff00" : "#ff0000";
        this.points.text = sign+Math.abs(points);
        this.points.setColor(color);
    }

    tileButtonResetTint(){
        this.tileButtons.forEach((t) => {t.setTint(0xffffff)});
    }

    generateTiles(){
        let returnTiles = [];
        for(var i=0;i<TileData.worldTileData.tiles.length;i++){
            let data = TileData.worldTileData.tiles[i];
            let x = TileData.PROPERTIES.TILESIZE*i;
            let sprite = this.add.sprite(x, 0, "worldTilesAtlas", data.name).setInteractive();

            console.log(data.name);
            sprite.selectionIndex = data.index;
            sprite.on("pointerdown", () => {
                this.tileButtonResetTint();
                sprite.setTint(0xff0000);
                this.indexSelected = sprite.selectionIndex;
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