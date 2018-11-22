import {BaseWorldEntity} from "./baseWorldEntity";

export class TreeWorldEntity extends BaseWorldEntity{
    constructor(params){
        super(params);
        this.canCollide = true;
        this.animate = false;
    }

    burn(){
        this.spriteEntity.setFrame("Trees/Tree2");
    }

    static getTypes(){
        return TreeWorldEntity.types;
    }
}

TreeWorldEntity.types = [
    {frame:"Trees/Tree1", type:TreeWorldEntity, excludePlacement:[2, 3, 4, 5]},
    {frame:"Trees/Tree2", type:TreeWorldEntity, excludePlacement:[2, 3, 4, 5]},
    {frame:"Trees/Tree3", type:TreeWorldEntity, excludePlacement:[2, 3, 4, 5]}
];