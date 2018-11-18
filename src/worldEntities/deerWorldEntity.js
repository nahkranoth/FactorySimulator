import {BaseWorldEntity} from "./baseWorldEntity";

export class DeerWorldEntity extends BaseWorldEntity{
    constructor(params){
        super(params);
        console.log(this.chunk);
    }

    update(){
        if(this.sleep) return;
        //this.spriteEntity.x += 0.1;
    }
}