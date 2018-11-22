import {BaseWorldEntity} from "./baseWorldEntity";

export class TreeWorldEntity extends BaseWorldEntity{
    constructor(params){
        super(params);
        this.canCollide = true;
    }

    burn(){
        console.log("Burn Tree");
        this.spriteEntity.setFrame("Tree2");
    }

    static getTypes(){
        return TreeWorldEntity.types;
    }
}

TreeWorldEntity.types = [
    {frame:"Tree1", type:TreeWorldEntity, excludePlacement:[2, 3, 4, 5]},
    {frame:"Tree2", type:TreeWorldEntity, excludePlacement:[2, 3, 4, 5]},
    {frame:"Tree3", type:TreeWorldEntity, excludePlacement:[2, 3, 4, 5]}
];