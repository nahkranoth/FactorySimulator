
export class Player extends Phaser.GameObjects.GameObject {
    constructor(params) {
        super(params.scene);
        this.scene = params.scene;

        this.init();
    }

    init() {
        console.log(this.scene);
        this.sprite = this.scene.physics.add.sprite(120, 120, "tiles").setBounce(0.1);
        this.cursors = this.scene.input.keyboard.createCursorKeys();
    }

    update() {
    }
}