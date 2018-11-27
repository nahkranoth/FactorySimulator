export class BaseWorldEntity {
    constructor(params) {
        this.x = params.x;
        this.y = params.y;
        this.scene = params.scene;
        this.frame = params.frame;
        this.spriteEntity = null;
        this.map = params.map;
        this.chunk = params.chunk;
        this.asleep = true;
        this.currentBehaviourState = null;
        this.canCollide = false;//is assigned to the global sprite collision checker (CollisionController)
        this.animate = false;
    }

    slumber() {
        this.asleep = true;
        if (this.spriteEntity === null) return;
        this.x = this.spriteEntity.getPosition().x;
        this.y = this.spriteEntity.getPosition().y;
        this.frame = this.spriteEntity.frame;

        this.spriteEntity = null;
    }

    reKindle(spriteEntity) {
        this.spriteEntity = spriteEntity;
        this.spriteEntity.setPosition(this.x, this.y);
        this.spriteEntity.setFrame(this.frame);
        this.asleep = false;
    }

    update() {
        if (this.asleep) return;
        if (this.spriteEntity === null) return;
    }

}
