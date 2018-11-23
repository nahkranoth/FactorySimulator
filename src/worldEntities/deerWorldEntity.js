import {BaseWorldEntity} from "./baseWorldEntity";

export class DeerWorldEntity extends BaseWorldEntity{
    constructor(params) {
        super(params);

        this.hunger = Math.random()*100;
        this.direction = 1;

        this.behaviourStates = {
            "idle": {object: new IdleState(this)},
            "path": {object: new PathState(this)},
            "walking": {object: new WalkingState(this)},
            "fleeing": {object: new FleeingState(this)},
            "burning": {object: new BurningState(this)},
        };

        this.currentBehaviourState = this.behaviourStates["path"].object;
        this.canCollide = true;
        this.animate = true;
    }

    burn(){
        this.switchBehaviourState("burning");
    }

    switchBehaviourState(state){
        this.currentBehaviourState.exit();
        this.currentBehaviourState = this.behaviourStates[state].object;
        this.currentBehaviourState.enter();
    }

    update(){
        super.update();
        this.currentBehaviourState.run();
    }

    reKindle(spriteEntity){
        super.reKindle(spriteEntity);
        this.currentBehaviourState.enter();
    }

    static getTypes(){
        return DeerWorldEntity.types;
    }
}

    DeerWorldEntity.types = [
    {frame:"Deer/deer_idle", type:DeerWorldEntity, excludePlacement:[2, 3, 4, 5]}
];

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

        this.me.hunger -= 0.04;
        let spritePos = this.me.spriteEntity.getPosition();
        if(Phaser.Math.Distance.Between(spritePos.x, spritePos.y, this.me.scene.player.x, this.me.scene.player.y) <= 100){
            this.me.switchBehaviourState("fleeing");
        }
    }

    exit(){

    }
}

class PathState{
    constructor(worldEntity){
        this.me = worldEntity;
    }

    enter(){
        this.me.map.pathFindingController.findPath(this.me.spriteEntity.x, this.me.spriteEntity.y, 1000 ,1000);
    }

    run(){
    }

    exit(){

    }
}

class WalkingState{
    constructor(worldEntity){
        this.me = worldEntity;
    }

    enter(){
        this.me.spriteEntity.anims.pause();
    }

    run(){
        let pos = this.me.spriteEntity.getPosition();
        this.me.spriteEntity.setPosition(pos.x += 0.2 * this.me.direction, pos.y);
        this.me.hunger += 1;
        if(this.me.hunger >= 100){
            this.me.switchBehaviourState("idle");
        }
        let spritePos = this.me.spriteEntity.getPosition();
        if(Phaser.Math.Distance.Between(spritePos.x, spritePos.y, this.me.scene.player.x, this.me.scene.player.y) <= 100){
            this.me.switchBehaviourState("fleeing");
        }
    }

    exit(){

    }
}

class BurningState{
    constructor(worldEntity){
        this.me = worldEntity;
    }

    enter(){
        let playerV = new Phaser.Math.Vector2(this.me.scene.player);
        let entityV = new Phaser.Math.Vector2(this.me.spriteEntity.getPosition());
        this.me.direction = new Phaser.Math.Vector2(playerV.x - entityV.x, playerV.y - entityV.y).normalize();
        this.burnEnergy = 100;
        this.me.spriteEntity.anims.play("deer_burn");
    }

    run(){
        let pos = this.me.spriteEntity.getPosition();
        this.me.spriteEntity.setPosition(pos.x -= 4 * this.me.direction.x, pos.y -= 4 * this.me.direction.y);
        this.burnEnergy--;
        if(this.burnEnergy <= 0) this.me.switchBehaviourState("idle");
    }

    exit(){
        this.me.spriteEntity.anims.remove();
        this.me.spriteEntity.setFrame("Deer/deer_idle");
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
