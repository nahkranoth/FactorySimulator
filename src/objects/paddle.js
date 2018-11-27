import {TileData} from "../data/tileData"
import {GameController} from "../core/gameController"

export class Paddle extends Phaser.Physics.Arcade.Sprite {

    constructor(params) {
        super(params.scene, params.x, params.y, params.key);
        this.scene.physics.add.existing(this);
        this.scene.add.existing(this).setInteractive();
        this.body.setMass(99999);
        this.depth = TileData.PROPERTIES.DEPTHSTART + 100000;
        this.timeline = null;
        this.body.setEnable(false);
        this.timedEvent = null;

        this.on('pointerdown', this.setCollidingOn, this);
        this.on('pointerup', this.setCollidingOff, this);
        this.on('pointeleave', this.setCollidingOff, this);
    }

    onWorldSpriteCollision(sprite) {
        sprite.assignedToWorldEntity.burn();
    }

    runManaTimer() {
        this.reduceMana();
        if (this.timedEvent) this.timedEvent.destroy();
        this.timedEvent = this.scene.time.addEvent({
            delay: 100,
            callback: this.reduceMana,
            callbackScope: this,
            loop: true
        });
    }

    stopManaTimer() {
        this.timedEvent.destroy();
    }

    reduceMana() {
        GameController.addMana(-4);
    }

    setCollidingOn() {
        if (GameController.mana > 0) {
            this.body.setEnable(true);
            this.runManaTimer();
        }
    }

    setCollidingOff() {
        this.body.setEnable(false);
        this.stopManaTimer();
    }

    onCollision(sprite1) {
        let direction = new Phaser.Math.Vector2(sprite1.x - this.x, sprite1.y - this.y).normalize();
        sprite1.setVelocityX(direction.x * 140);
        sprite1.setVelocityY(direction.y * 140);
        sprite1.pauseFollow();
    }

    update() {

        let centerX = this.scene.cameras.main.width / 2;
        let centerY = this.scene.cameras.main.height / 2;

        let posX = Phaser.Math.Clamp(this.scene.input.x, 52, this.scene.cameras.main.width - 52);
        let posY = Phaser.Math.Clamp(this.scene.input.y, 52, this.scene.cameras.main.height - 52);

        this.x = posX + this.scene.cameras.main.scrollX;
        this.y = posY + this.scene.cameras.main.scrollY;
    }
}
