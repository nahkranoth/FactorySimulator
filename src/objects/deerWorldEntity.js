import {MapWorldEntity} from "../map/mapWorldEntity";

export class DeerWorldEntity extends MapWorldEntity{
    constructor(params){
        super(params);
    }

    update(){
        if(this.sleep) return;
        this.spriteEntity.x += 0.1;
    }
}