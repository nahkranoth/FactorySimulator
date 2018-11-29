import {TileData} from "../data/tileData"
import {Slider} from "../ui/slider";

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
                this.load.audio('music_start', ['assets/music_start.mp3', "assets/music_start.ogg"]);

                this.load.image("worldTilesImg", "assets/worldTiles.png");
                this.load.atlas('worldEntities', "assets/worldEntities.png", "assets/worldEntities.json");
                this.load.atlas('worldTilesAtlas', 'assets/worldTiles.png', 'assets/worldTiles_atlas.json');

                this.load.image("titleScreenBG", "assets/titleScreenBG.png");
                this.load.image("bunny", "assets/bunny.png");
                this.load.image("title", "assets/title.png");
                this.load.image("titleSub", "assets/titleSub.png");
                this.load.image("closeBtn", "assets/closeBtn.png");
                this.load.image("slider", "assets/slider.png");

                this.load.image("optionsBG", "assets/titleScreen_OptionsBG.png");

            });
        });
    }

    create() {
        this.startGroup = this.add.group();
        this.fxAudioCounter = 0;

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
        this.closeBtn = this.add.image(this.cameras.main.width/2+220, 570, 'closeBtn').setInteractive();
        this.closeBtn.on('pointerdown', this.closeOptions, this);
        this.optionsGroup.add(this.closeBtn);

        this.fxVolume = 50;
        this.fxVolStr = "Fx Volume: ";

        this.fxVolumeTxt = this.add.text(this.cameras.main.width/2, 560, this.fxVolStr+this.fxVolume, {fontFamily: 'AtlantisRegular', fontSize: 42, fill: '#fff', align:'center'});
        this.fxVolumeTxt.setOrigin(0.5);
        this.optionsGroup.add(this.fxVolumeTxt);

        this.fxVolumeSlider = new Slider({
            scene:this,
            key:"slider",
            x:this.cameras.main.width/2,
            y:610,
            group:this.optionsGroup,
            callback: _.bind(this.FxVolumeSliderUpdated, this),
            ratio:this.fxVolume/100
        });

        this.musicVolume = 50;
        this.musicVolStr = "Music Volume: ";

        this.musicVolumeTxt = this.add.text(this.cameras.main.width/2, 670, this.musicVolStr+this.musicVolume, {fontFamily: 'AtlantisRegular', fontSize: 42, fill: '#fff', align:'center'});
        this.musicVolumeTxt.setOrigin(0.5);
        this.optionsGroup.add(this.musicVolumeTxt);

        this.musicVolumeSlider = new Slider({
            scene:this,
            key:"slider",
            x:this.cameras.main.width/2,
            y:720,
            group:this.optionsGroup,
            callback: _.bind(this.musicVolumeSliderUpdated, this),
            ratio:this.musicVolume/100
        });

        this.optionsGroup.toggleVisible();

        this.music = this.sound.add('music_start', { loop: true, volume: (this.musicVolume/100)});
        this.music.play();

    }

    musicVolumeSliderUpdated(ratio){
        this.musicVolume = ratio*100;
        this.music.setVolume(ratio);
        this.musicVolumeTxt.text = this.musicVolStr+Math.round(this.musicVolume * ratio);
    }

    FxVolumeSliderUpdated(ratio){
        if(this.fxAudioCounter >= 10){
            this.sound.playAudioSprite('sfx', "pickup", {volume: ratio});
            this.fxAudioCounter = 0;
        }
        this.fxAudioCounter++;

        this.fxVolume = ratio*100;
        this.fxVolumeTxt.text = this.fxVolStr+Math.round(this.fxVolume * ratio);
    }

    openOptions(){
        this.startGroup.toggleVisible();
        this.optionsGroup.toggleVisible();
        this.fxVolumeSlider.show(this.fxVolume/100);
        this.musicVolumeSlider.show(this.musicVolume/100);
    }

    closeOptions(){
        this.startGroup.toggleVisible();
        this.optionsGroup.toggleVisible();
        this.fxVolumeSlider.hide();
        this.musicVolumeSlider.hide();
    }

    startGame(){
        this.music.stop();
        this.scene.start("game", {fxVolumeLevel:this.fxVolume, musicVolumeLevel:this.musicVolume});
        this.scene.start("gui");
    }
}
