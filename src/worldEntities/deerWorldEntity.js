import {BaseWorldEntity} from "./baseWorldEntity";

export class DeerWorldEntity extends BaseWorldEntity{
    constructor(params){
        super(params);
    }

    update(){
        if(this.sleep) return;
        this.spriteEntity.x += 0.1;
    }
}