export class BaseWorldEntity {
    constructor(params){
        this.x = params.x;
        this.y = params.y;
        this.scene = params.scene;
        this.frame = params.frame;
        this.spriteEntity = null;
        this.map = params.map;
        this.chunk = params.chunk;
        this.asleep = true;
        this.canCollide = false;//is assigned to the global sprite collision checker (CollisionController)
    }

    slumber(){
        this.asleep = true;
        this.x = this.spriteEntity.getPosition().x;
        this.y = this.spriteEntity.getPosition().y;
        this.frame = this.spriteEntity.frame;

        this.spriteEntity = null;
    }

    reKindle(spriteEntity){
        this.asleep = false;
        this.spriteEntity = spriteEntity;
        this.spriteEntity.setPosition(this.x, this.y);
        this.spriteEntity.setFrame(this.frame);
    }

    update(){
        if(this.asleep) return;
    }

}