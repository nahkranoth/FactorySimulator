import {BaseWorldEntity} from "../worldEntities/baseWorldEntity"
import {GameController} from "../core/gameController"

export class TreeWorldEntity extends BaseWorldEntity{
    constructor(params) {
        super(params);
        this.canCollide = true;
        this.animate = false;
        this.burning = false;
        this.hitResetTimer = 0;
        this.hit = false;
    }

    burn() {
        if (this.burning) return;
        this.burning = true;
        this.scene.sound.playAudioSprite('sfx', "burn");
        GameController.addScore(100);
        this.spriteEntity.setFrame("Trees/Tree2");
    }

    reKindle(spriteEntity) {
        super.reKindle(spriteEntity);
    }

    static getTypes() {
        return TreeWorldEntity.types;
    }
}

TreeWorldEntity.types = [
    {frame: "Trees/Tree1", type: TreeWorldEntity, excludePlacement: [2, 3, 4, 5]},
    {frame: "Trees/Tree2", type: TreeWorldEntity, excludePlacement: [2, 3, 4, 5]},
    {frame: "Trees/Tree3", type: TreeWorldEntity, excludePlacement: [2, 3, 4, 5]}
];
