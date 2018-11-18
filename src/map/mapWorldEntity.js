export class MapWorldEntity {
    constructor(params){
        this.x = params.x;
        this.y = params.y;
        this.frame = params.frame;
        this.spriteEntity = null;
        this.chunk = params.chunk;
    }
}