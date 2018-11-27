import {TileData} from "../data/tileData"

export class FireBall extends Phaser.Physics.Arcade.Sprite {

    constructor(params) {
        super(params.scene, params.x, params.y, params.key);
        this.scene.physics.add.existing(this);
        this.scene.add.existing(this);
        this.cursors = this.scene.input.keyboard.createCursorKeys();
        this.rotation = 0.08;
        this.moveSpeed = 200;
        this.depth = TileData.PROPERTIES.DEPTHSTART + 99999;
        this.body.setCircle(30, 10, 10).setAllowDrag(true).setBounce(1).setCollideWorldBounds(true);
        this.body.onWall();
        this.followCounter = 0;
        this.follow = true;
    }

    onWorldSpriteCollision(sprite) {
        sprite.assignedToWorldEntity.burn();
    }

    pauseFollow() {
        this.follow = false;
    }

    update() {
        if (this.follow) {
            let distance = Phaser.Math.Distance.Between(this.x, this.y, this.scene.player.x, this.scene.player.y);
            this.scene.physics.accelerateTo(this, this.scene.player.x, this.scene.player.y, distance * 10, 300, 300);
        } else {
            this.followCounter++;
            if (this.followCounter >= 100) {
                this.follow = true;
                this.followCounter = 0;
            }
        }
        this.angle += 8;
    }
}
