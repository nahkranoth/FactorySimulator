
export class Player extends Phaser.GameObjects.GameObject {
    constructor(params) {
        super(params.scene);
        this.scene = params.scene;

        this.init();
    }

    init() {
        this.jump_locked = false;
        this.jump_toggle = false;
        this.double_jump_locked = false;
        this.momentum = 0;
        this.momentumIncrease = 8;
        this.momentumCap = 200;
        this.sprite = this.scene.physics.add.sprite(120, 120, "player").setBounce(0.1);
        this.cursors = this.scene.input.keyboard.createCursorKeys();
    }

    jump(){
        if(this.jump_locked) return;
        this.jump_locked = true;
        this.sprite.body.setVelocityY(-250);
    }

    doubleJump(){
        if(this.double_jump_locked) return;
        this.double_jump_locked = true;
        this.sprite.body.setVelocityY(-350);
    }

    update() {
        this.sprite.body.setVelocityX(0);

        if(this.cursors.right.isDown) {
            this.sprite.body.setVelocityX(100 + Math.min(this.momentum, this.momentumCap));
            this.momentum += this.momentumIncrease;
        }
        else if(this.cursors.left.isDown) {
            this.sprite.body.setVelocityX(-100 - Math.min(this.momentum, this.momentumCap));
            this.momentum += this.momentumIncrease;
        }else{
            this.momentum = 0;
        }

        if(this.cursors.up.isDown ) {
            this.jump();
            if(this.jump_locked && !this.jump_toggle){
                this.doubleJump();
            }
            this.jump_toggle = true;
        }else{
            this.jump_toggle = false;
        }

        if(this.sprite.body.onFloor()){
            this.jump_locked = false;
            this.double_jump_locked = false;
        }

    }
}