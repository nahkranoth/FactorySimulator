import {TileData} from "../data/tileData";

export class FireBall extends Phaser.Physics.Arcade.Sprite{

    constructor(params) {
        super(params.scene, params.x, params.y, params.key);
        this.scene.physics.add.existing(this);
        this.scene.add.existing(this);
        this.cursors = this.scene.input.keyboard.createCursorKeys();
        this.rotation = 0.08;
        this.moveSpeed = 200;
        this.depth = TileData.PROPERTIES.DEPTHSTART + 99999;
        this.body.setBounce(1).setCollideWorldBounds(true);
        this.body.setVelocityX((Math.random()*20) + 100);
        this.body.setVelocityY((Math.random()*20) + 100);
        this.body.setCircle(30, 10, 10);
        this.body.onWall();

        this.flipTimer = 0;
        this.deltaTime = 0;
        //this.body.on("collide", () => {console.log("Collide")})
    }

    onWorldSpriteCollision(sprite){
        sprite.assignedToWorldEntity.burn();
    }

    // flipVelocity(){
    //     this.deltaTime = Date.now() - this.flipTimer;
    //     if(this.deltaTime >= 300){
    //         //this.body.setVelocityX(-this.body.velocity.x);
    //         this.body.setVelocityY(-this.body.velocity.y);
    //         this.flipTimer = Date.now();
    //     }
    // }

    update(){
        this.angle+=2;
    }
}