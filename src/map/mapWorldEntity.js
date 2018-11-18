export class MapWorldEntity {
    constructor(params){
        this.x = params.x;
        this.y = params.y;
        this.frame = params.frame;
        this.spriteEntity = null;
        this.chunk = params.chunk;
        this.sleep = true;
    }

    slumber(){
        this.sleep = true;
        this.x = this.spriteEntity.getPosition().x;
        this.y = this.spriteEntity.getPosition().y;
        this.frame = this.spriteEntity.frame.name;

        this.spriteEntity = null;
    }

    reKindle(spriteEntity){
        this.sleep = false;
        this.spriteEntity = spriteEntity;
        this.spriteEntity.setPosition(this.x, this.y);
        this.spriteEntity.setFrame(this.frame);
    }

    update(){
        //overwrite
    }

}