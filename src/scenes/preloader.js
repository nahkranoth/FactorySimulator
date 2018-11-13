import {TileData} from "../data/tileData";

export class Preloader extends Phaser.Scene {

    constructor(){
        super({key: "boot"});
    }

    preload(){
        this.load.image("plaey", "assets/plaey.png");
        this.load.image('worldTilesImg', 'assets/worldTiles.png');
        this.load.json('worldTileData', 'assets/worldTiles.json');﻿﻿

        this.load.once('filecomplete', ()=>{
            var worldTileData = this.cache.json.get('worldTileData');
            for(var i=0;i<worldTileData.tiles.length;i++){
                let tileData = worldTileData.tiles[i];
                this.load.image(tileData.name, tileData.image_url);
            }
        });
    }

    create() {
        TileData.create(this.cache.json.get('worldTileData'));//init static tiledata
        this.scene.start("gui");
        this.scene.start("game");
        this.add.image(500, 500, 'download');
        this.add.text(100, 100, 'Preloader!', {fill: '#0f0'});
    }
}