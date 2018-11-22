import {BaseWorldEntity} from "./baseWorldEntity";
import {FireBall} from "../objects/fireball";

export class DeerWorldEntity extends BaseWorldEntity{
    constructor(params) {
        super(params);

        this.hunger = Math.random()*100;
        this.direction = 1;

        this.behaviourStates = {
            "idle": {object: new IdleState(this)},
            "walking": {object: new WalkingState(this)},
            "fleeing": {object: new FleeingState(this)}
        };

        this.currentBehaviourState = this.behaviourStates["idle"].object;
        this.currentBehaviourState.enter();
        this.canCollide = true;
    }

    burn(){
        console.log("Ooh Deer, it hurts");
        this.switchBehaviourState("fleeing");
    }

    switchBehaviourState(state){
        this.currentBehaviourState.exit();
        this.currentBehaviourState = this.behaviourStates[state].object;
        this.currentBehaviourState.enter();
    }

    update(){
        super.update();
        this.currentBehaviourState.run();
        let spritePos = this.spriteEntity.getPosition();

        if(this.currentBehaviourState !== this.behaviourStates["fleeing"].object && Phaser.Math.Distance.Between(spritePos.x, spritePos.y, this.scene.player.x, this.scene.player.y) <= 100){
            this.switchBehaviourState("fleeing");
        }

    }
}

class IdleState{
    constructor(worldEntity){
        this.me = worldEntity;
    }

    enter(){
    }

    run(){
        if(this.me.hunger <= 0){
            this.me.switchBehaviourState("walking");
            return;
        }

        this.me.hunger -= 0.4;
    }

    exit(){

    }
}

class WalkingState{
    constructor(worldEntity){
        this.me = worldEntity;
    }

    enter(){

    }

    run(){
        let pos = this.me.spriteEntity.getPosition();
        this.me.spriteEntity.setPosition(pos.x += 0.2 * this.me.direction, pos.y);
        this.me.hunger += 1;
        if(this.me.hunger >= 100){
            this.me.switchBehaviourState("idle");
        }
    }

    exit(){

    }
}

class FleeingState{
    constructor(worldEntity){
        this.me = worldEntity;
    }

    enter(){
        let playerV = new Phaser.Math.Vector2(this.me.scene.player);
        let entityV = new Phaser.Math.Vector2(this.me.spriteEntity.getPosition());
        this.me.direction = new Phaser.Math.Vector2(playerV.x - entityV.x, playerV.y - entityV.y).normalize();
        this.sprintEnergy = 100;
    }

    run(){
        let pos = this.me.spriteEntity.getPosition();
        this.me.spriteEntity.setPosition(pos.x -= 4 * this.me.direction.x, pos.y -= 4 * this.me.direction.y);
        this.sprintEnergy -= 1;
        if(this.sprintEnergy <= 0){
            this.me.switchBehaviourState("idle");
        }
    }

    exit(){

    }
}