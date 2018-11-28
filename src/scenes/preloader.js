import {TileData} from "../data/tileData"

export class Preloader extends Phaser.Scene {

    constructor() {
        super({key: "boot"});
    }

    preload() {
        this.load.json('worldTileData', 'assets/worldTiles.json');
        //for when I need to wait on a file first
        this.load.once('filecomplete', () => {
            this.load.json('mapConstructData', 'assets/constructionMaps.json');
            this.load.once('filecomplete', () => {
                this.load.image("plaey", "assets/plaey.png");
                this.load.image("fireball", "assets/fireball.png");
                this.load.image("mouse", "assets/mouse.png");
                this.load.image("ice", "assets/ice.png");
                this.load.image("ice", "assets/ice.png");
                this.load.audioSprite('sfx', 'assets/audio/audio_fx_sprite.json', [ 'assets/audio/audio_fx_sprite.ogg', 'assets/audio/audio_fx_sprite.mp3' ]);
                this.load.audio('music_game', ['assets/music_game.mp3', "assets/music_game.ogg"]);

                this.load.image("worldTilesImg", "assets/worldTiles.png");
                this.load.atlas('worldEntities', "assets/worldEntities.png", "assets/worldEntities.json");
                this.load.atlas('worldTilesAtlas', 'assets/worldTiles.png', 'assets/worldTiles_atlas.json');
            });
        });
    }

    create() {
        console.log("CREATEA");
        TileData.create(this.cache.json.get('worldTileData'));//init static tiledata
        this.scene.start("game");
        this.scene.start("gui");
        this.add.image(500, 500, 'download');
        this.add.text(100, 100, 'Preloader!', {fill: '#0f0'});
    }
}
