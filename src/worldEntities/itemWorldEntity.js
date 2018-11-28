import {BaseWorldEntity} from "../worldEntities/baseWorldEntity"

export class ItemWorldEntity extends BaseWorldEntity{
    constructor(params) {
        super(params);
        this.canCollide = true;
        this.animate = true;
    }

    update() {
        super.update();
    }

    burn() {
    }

    pickup() {
        this.spriteEntity.x = 9999;
        this.spriteEntity.y = 9999;
        this.slumber();
    }

    reKindle(spriteEntity) {
        super.reKindle(spriteEntity);
    }

    static getTypes() {
        return ItemWorldEntity.types;
    }
}

ItemWorldEntity.types = [
    //TODO!!: REVERT WHEN MUSHROOMS BASK!!
    {frame: "Deer/deer_idle", type: ItemWorldEntity, excludePlacement: [2, 3, 4, 5]}
];
