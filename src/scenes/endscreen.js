import {GameController} from "../core/gameController"

export class EndScreen extends Phaser.Scene {

    constructor() {
        super({key: "endscreen"})
    }

    preload() {
    }

    create() {
        console.log("CREATE ENDSCREEN");

        let bg = this.add.sprite(0, 0, "endScreenBG").setOrigin(0);

        this.score = this.add.text(this.cameras.main.width / 2, 390, "$" + GameController.score, {
            fontFamily: 'AtlantisRegular',
            fontSize: 84,
            color: '#ffffff',
            align: "center"
        });
        this.score.setStroke('#072535', 8);
        this.score.setOrigin(0.5);

        this.restartBtn = this.add.text(this.cameras.main.width / 2, 624, ' - Restart - ', {
            fontFamily: 'AtlantisRegular',
            fontSize: 34,
            color: '#ffffff',
            align: "center"
        });
        this.restartBtn.setOrigin(0.5).setInteractive();
        this.restartBtn.on("pointerdown", _.bind(this.restart, this));
    }

    restart(){
        this.scene.sleep();
        this.scene.setVisible(false);
        GameController.reset();
        this.scene.get("game").scene.restart();
        this.scene.get("gui").scene.restart();
    }

    update() {

    }
}
