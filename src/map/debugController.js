import {DebugRect} from "../utils/debug";

export class DebugController{
    constructor(params){
        this.scene = params.scene;
        this.map = params.map;
        this.camera = this.scene.cameras.main;
        this.DEBUG = params.enabled;
    }


    afterInit(activeChunk){
        if(!this.DEBUG) return;
        this.neighbourDebugs = [];
        for(var i=0;i<8;i++){
            let liveNeighboursChunkDebugBounds = new DebugRect({scene:this.scene, camera:this.camera, size:activeChunk.getBounds().width, color:0x0000ff, lineColor:0xff00ff, outlinesOnly:true});
            this.neighbourDebugs.push(liveNeighboursChunkDebugBounds);
        }
        this.activeCameraDebugBounds = new DebugRect({scene:this.scene, size:200, color:0xff0000, lineColor:0xff0000, outlinesOnly:true});
        this.activeChunkDebugBounds = new DebugRect({scene:this.scene, camera:this.camera, size:activeChunk.getBounds().width, color:0x0000ff, lineColor:0x0000ff, outlinesOnly:true});
    }

    update(activeChunk){
        if(!this.DEBUG) return;
        this.activeCameraDebugBounds.setPosition(this.camera.scrollX+this.camera.centerX, this.camera.scrollY+this.camera.centerY);
        this.activeChunkDebugBounds.setPosition(activeChunk.getPosition().x, activeChunk.getPosition().y);
        for(var i=0;i<this.neighbourDebugs.length;i++){
            let neighbour = activeChunk.neighbours[i];
            if(!neighbour) return;
            this.neighbourDebugs[i].setPosition(neighbour.mapChunk.getPosition().x, neighbour.mapChunk.getPosition().y);
        }
    }

}