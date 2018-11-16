import {TileData} from "../data/tileData";

export class Preloader extends Phaser.Scene {

    constructor(){
        super({key: "boot"});
    }

    preload(){
        this.load.json('worldTileData', 'assets/worldTiles.json');
        //for when I need to wait on a file first
        this.load.once('filecomplete', ()=>{
            this.load.json('mapConstructData', 'assets/constructionMaps.json');
                this.load.once('filecomplete', ()=>{
                    this.load.image("plaey", "assets/plaey.png");
                    this.load.image("worldTilesImg", "assets/worldTiles.png");
                    this.load.atlas('worldEntities', "assets/worldEntities.png", "assets/worldEntities.json");
                    this.load.atlas('worldTilesAtlas', 'assets/worldTiles.png', 'assets/worldTiles_atlas.json');
                });
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