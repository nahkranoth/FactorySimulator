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

       this.resetTimerEvents();

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

        this.fireBallsActive = false;
        this.fireBalls = [];

        this.collisionController.setCollisionBetweenWorldSprites(this.player, this.player.onCollisionWorldEntity);

        this.cameras.main.startFollow(this.player);
        this.gui = this.scene.manager.getScene("gui");
        this.map = new Map({scene:this,opt:{}});

        this.createFireBall();

        new BuildInteractionController({scene:this, gui:this.gui, map:this.map});

        this.music = this.sound.add('music_game', { loop: false, volume: (this.musicVolumeLevel/100)});
        this.music.play();

        this.reStartTimer();

    }

    resetTimerEvents(){
        this.timerEvents = [
            {time:5, activated:false, callback:() => this.fireBallsActive = true},
            {time:10, activated:false, callback:_.bind(this.setFireBallSpeed, this), params:{speed:0.1}},
            {time:15, activated:false, callback:_.bind(this.setFireBallSpeed, this), params:{speed:0.2}},
            {time:20, activated:false, callback:_.bind(this.setFireBallSpeed, this), params:{speed:0.3}},
            {time:25, activated:false, callback:_.bind(this.setFireBallSpeed, this), params:{speed:0.4}},
            {time:30, activated:false, callback:_.bind(this.setFireBallSpeed, this), params:{speed:0.5}},
            {time:40, activated:false, callback:_.bind(this.setFireBallSpeed, this), params:{speed:0.6}},
            {time:50, activated:false, callback: _.bind(this.createFireBall, this) },
            {time:50, activated:false, callback:_.bind(this.setFireBallSpeed, this), params:{speed:0.3}},
            {time:60, activated:false, callback:_.bind(this.setFireBallSpeed, this), params:{speed:0.4}},
            {time:70, activated:false, callback:_.bind(this.setFireBallSpeed, this), params:{speed:0.5}},
            {time:80, activated:false, callback:_.bind(this.setFireBallSpeed, this), params:{speed:0.6}},
            {time:90, activated:false, callback:_.bind(this.setFireBallSpeed, this), params:{speed:0.7}},
            {time:100, activated:false, callback:_.bind(this.setFireBallSpeed, this), params:{speed:0.8}},
            {time:120, activated:false, callback: _.bind(this.createFireBall, this) },
            {time:120, activated:false, callback:_.bind(this.setFireBallSpeed, this), params:{speed:0.6}},
            {time:130, activated:false, callback:_.bind(this.setFireBallSpeed, this), params:{speed:0.7}},
            {time:150, activated:false, callback:_.bind(this.setFireBallSpeed, this), params:{speed:0.8}},
            {time:160, activated:false, callback:_.bind(this.setFireBallSpeed, this), params:{speed:0.9}},
            {time:170, activated:false, callback: _.bind(this.createFireBall, this) },
            {time:200, activated:false, callback: _.bind(this.createFireBall, this) }
        ]
    }

    setFireBallSpeed(params){
        this.fireBalls.forEach((fb) => fb.setSpeed(params.speed));
    }

    createFireBall(){
        let fireBall = new FireBall({
            scene:this,
            key:"fireball",
            x:this.cameras.main.width/2,
            y:100
        });

        this.collisionController.setCollisionBetweenWorldSprites(fireBall, _.bind(fireBall.onWorldSpriteCollision, fireBall));
        this.collisionController.setOverlapBetween(fireBall, this.paddle, _.bind(this.paddle.onCollision, this.paddle));
        this.collisionController.setOverlapBetween(fireBall, this.player, _.bind(this.player.onCollision, this.player));
        this.fireBalls.push(fireBall);

        this.map.chunkController.resetChunkCollisionsForAll();
    }

    reStartTimer(){
        this.startTime = Date.now();
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
        this.deltaTime = Date.now() - this.startTime;

        let activeTimerEvents = _.filter(this.timerEvents, (tE) => {
            return tE.activated === false && (tE.time * 1000) < this.deltaTime
        });

        if(activeTimerEvents.length > 0) activeTimerEvents.forEach(tE => {tE.activated = true; tE.callback(tE.params)});
        this.map.update();
        this.player.update();
        this.physics.world.setBounds(this.cameras.main.scrollX, this.cameras.main.scrollY, this.cameras.main.width, this.cameras.main.height);
        if(this.fireBallsActive) this.fireBalls.forEach((fireball) => fireball.update());
        this.paddle.update();
    }
}