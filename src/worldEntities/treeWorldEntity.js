import {BaseWorldEntity} from "./baseWorldEntity";
import {FireBall} from "../objects/fireball";

export class TreeWorldEntity extends BaseWorldEntity{
    constructor(params){
        super(params);
    }

    onCollision(collidingSprite){
        if(collidingSprite instanceof FireBall){
            this.burn();
        }
    }

    burn(){
        this.spriteEntity.setFrame("Tree2");
    }
}