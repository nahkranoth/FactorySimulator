import {BaseWorldEntity} from "./baseWorldEntity";
import {FireBall} from "../objects/fireball";

export class TreeWorldEntity extends BaseWorldEntity{
    constructor(params){
        super(params);
        this.canCollide = true;
    }

    burn(){
        console.log("Burn Tree");
        this.spriteEntity.setFrame("Tree2");
    }
}