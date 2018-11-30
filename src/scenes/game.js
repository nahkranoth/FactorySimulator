import {Player} from "../objects/player"
import {FireBall} from "../objects/fireball"
import {Map} from "../map/map"
import {BuildInteractionController} from "../map/buildInteractionController"
import {CollisionController} from "../core/collisionController"
import {Paddle} from "../objects/paddle"
import {GameController} from "../core/gameController"

export class Game extends Phaser.Scene {
    constructor(){
        super({key: "game"});
    }

    init(data){
        this.fxVolumeLevel = 20*Math.log10(data.fxVolumeLevel);
        this.musicVolumeLevel = 20*Math.log10(data.musicVolumeLevel);
    }

    create() {
        this.cameras.main.roundPixels = true;

        this.tileMapContainer = this.add.container(0,0);

        this.tileMapContainer.setDepth(0);

        this.collisionController = new CollisionController({scene:this});

        this.pointsController = new GameController({scene:this});
        this.pointsController.on("AddScore", _.bind(this.setScore, this));
        this.pointsController.on("AddMana", _.bind(this.setMana, this));
        this.pointsController.on("AddHealth", _.bind(this.setHealth, this));

        //ORDER MATTERS. NO REALLY!
        this.player = new Player({
            scene:this,
            key:"plaey",
            x:this.cameras.main.width/2,
            y:this.cameras.main.height/2
        });

        this.paddle = new Paddle({scene:this, key:"mouse", x: this.input.x, y:this.input.y});

        this.physics.world.setBounds(this.cameras.main.scrollX, this.cameras.main.scrollY, this.cameras.main.width, this.cameras.main.height);

        this.fireBall = new FireBall({
            scene:this,
            key:"fireball",
            x:this.cameras.main.width/2,
            y:100
        });

        this.collisionController.setCollisionBetweenWorldSprites(this.fireBall, _.bind(this.fireBall.onWorldSpriteCollision, this.fireBall));

        this.collisionController.setCollisionBetweenWorldSprites(this.player, this.player.onCollisionWorldEntity);

        this.collisionController.setOverlapBetween(this.fireBall, this.paddle, _.bind(this.paddle.onCollision, this.paddle));
        this.collisionController.setOverlapBetween(this.fireBall, this.player, _.bind(this.player.onCollision, this.player));

        this.cameras.main.startFollow(this.player);
        this.gui = this.scene.manager.getScene("gui");
        this.map = new Map({scene:this,opt:{}});

        new BuildInteractionController({scene:this, gui:this.gui, map:this.map});

        this.music = this.sound.add('music_game', { loop: false, volume: (this.musicVolumeLevel/100)});
        this.music.play();

    }

    setScore(score){
        this.gui.setScoreText(score);
    }

    setMana(mana){
        this.gui.setManaText(mana);
    }

    setHealth(health){
        this.gui.setHealthText(health);
        if(GameController.health < 1){
            this.scene.sleep();
            this.scene.sleep("gui");
            this.scene.setVisible(false);
            this.scene.setVisible(false, "gui");
            this.scene.start("endscreen");
        }
    }

    update(){
        this.map.update();
        this.player.update();
        this.physics.world.setBounds(this.cameras.main.scrollX, this.cameras.main.scrollY, this.cameras.main.width, this.cameras.main.height);
        this.fireBall.update();
        this.paddle.update();
    }
}