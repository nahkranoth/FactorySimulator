export class Preloader extends Phaser.Scene {

    constructor(){
        super({key: "boot"});
    }

    preload(){
        this.load.image("plaey", "assets/plaey.png");
    }

    create() {
        this.scene.start("game");
        this.add.image(500, 500, 'download');
        this.add.text(100, 100, 'Preloader!', {fill: '#0f0'});
    }
}