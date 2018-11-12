export class Preloader extends Phaser.Scene {

    constructor(){
        super({key: "boot"});
    }

    preload(){
        this.load.image("plaey", "assets/plaey.png");
        this.load.image('worldTilesImg', 'assets/worldTiles.png');
        this.load.json('worldTileData', 'assets/worldTiles.json');﻿﻿
    }

    create() {
        this.scene.start("gui");
        this.scene.start("game");
        this.add.image(500, 500, 'download');
        this.add.text(100, 100, 'Preloader!', {fill: '#0f0'});
    }
}