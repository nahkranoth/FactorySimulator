import {TileData} from "../data/tileData"

export class Preloader extends Phaser.Scene {

    constructor() {
        super({key: "boot"});
    }

    preload() {
        this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');

        this.load.json('worldTileData', 'assets/worldTiles.json');
        //for when I need to wait on a file first
        this.load.once('filecomplete', () => {
            this.load.json('mapConstructData', 'assets/constructionMaps.json');
            this.load.once('filecomplete', () => {
                this.load.image("plaey", "assets/plaey.png");
                this.load.image("fireball", "assets/fireball.png");
                this.load.image("mouse", "assets/mouse.png");
                this.load.image("ice", "assets/ice.png");
                this.load.audioSprite('sfx', 'assets/audio/audio_fx_sprite.json', [ 'assets/audio/audio_fx_sprite.ogg', 'assets/audio/audio_fx_sprite.mp3' ]);
                this.load.audio('music_game', ['assets/music_game.mp3', "assets/music_game.ogg"]);

                this.load.image("worldTilesImg", "assets/worldTiles.png");
                this.load.atlas('worldEntities', "assets/worldEntities.png", "assets/worldEntities.json");
                this.load.atlas('worldTilesAtlas', 'assets/worldTiles.png', 'assets/worldTiles_atlas.json');

                this.load.image("titleScreenBG", "assets/titleScreenBG.png");
                this.load.image("bunny", "assets/bunny.png");
                this.load.image("title", "assets/title.png");
                this.load.image("titleSub", "assets/titleSub.png");

                this.load.image("optionsBG", "assets/titleScreen_OptionsBG.png");

            });
        });
    }

    create() {
        this.startGroup = this.add.group();


        WebFont.load({
            custom: {
                families: [ 'AtlantisBold', 'AtlantisRegular' ]
            },
            active: _.bind(this.buildStartScreen, this)
        });

        TileData.create(this.cache.json.get('worldTileData'));//init static tiledata

    }

    buildStartScreen(){
        this.add.image(this.cameras.main.width/2, this.cameras.main.height/2, 'titleScreenBG');
        this.add.image(30, this.cameras.main.height/2+150, 'bunny');
        this.add.image(this.cameras.main.width/2, this.cameras.main.height/2-100, 'title');
        this.add.image(this.cameras.main.width/2, 470, 'titleSub');

        this.startTxt = this.add.text(this.cameras.main.width/2, 620, '- Start Game -', {fontFamily: 'AtlantisRegular', fontSize: 42, fill: '#fff', align:'center'});
        this.startTxt.setOrigin(0.5);
        this.startTxt.setInteractive();
        this.startGroup.add(this.startTxt);
        this.startTxt.on('pointerdown', this.startGame, this);

        this.optionsTxt = this.add.text(this.cameras.main.width/2, 690, '- Options -', {fontFamily: 'AtlantisRegular', fontSize: 42, fill: '#fff', align:'center'});
        this.optionsTxt.setOrigin(0.5);
        this.optionsTxt.setInteractive();
        this.startGroup.add(this.optionsTxt);

        this.optionsTxt.on('pointerdown', this.openOptions, this);

        this.optionsGroup = this.add.group();
        this.optionsBG = this.add.image(this.cameras.main.width/2, 630, 'optionsBG');
        this.optionsGroup.add(this.optionsBG);
        this.optionsGroup.toggleVisible();

    }

    openOptions(){
        this.startGroup.toggleVisible();
        this.optionsGroup.toggleVisible();
    }

    closeOptions(){
        this.startGroup.toggleVisible();
    }

    startGame(){
        this.scene.start("game");
        this.scene.start("gui");
    }
}
