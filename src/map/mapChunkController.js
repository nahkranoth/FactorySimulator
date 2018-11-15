export class MapChunkController{
    constructor(params){
        this.scene = params.scene;
        this.chunks = [];
        this._previousActiveChunk;
        this.generatedChunkIndex = 0;
    }
}