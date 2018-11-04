import {MapChunk} from '../core/mapChunk.js';
import {DebugRect} from '../utils/debug.js'
import {_} from 'underscore';

export class Map extends Phaser.GameObjects.GameObject {

    constructor(params){
        super(params.scene, params.opt);
        this.camera = params.scene.cameras.main;
        this.chunks = [];
        this.viewportRect = this.camera.worldView;

        this.chunk1 = new MapChunk({scene:this.scene, opt:{}});
        this.chunk1.setPosition(this.camera.width/2, this.camera.height/2);

        this.chunks.push(this.chunk1);

        this.activeCameraDebugBounds = new DebugRect({scene:this.scene, size:200, color:0xff0000, lineColor:0xff0000, outlinesOnly:true});
        this.activeChunkDebugBounds = new DebugRect({scene:this.scene, camera:this.camera, size:this.chunk1.getBounds().width, color:0x0000ff, lineColor:0x0000ff, outlinesOnly:true});

        console.log(this._getObservedChunk());
    }

    _getObservedChunk(){
        //Something goes wrong with centerpositions and stuff - add a point to the debug to really see the measured position
        let p = new Phaser.Geom.Point(this.activeCameraDebugBounds.getPosition().x, this.activeCameraDebugBounds.getPosition().y);
        let activeChunk = _.filter(this.chunks, (c) => {return Phaser.Geom.Rectangle.ContainsPoint(c.getRectBounds(),p) });
        if(activeChunk.length > 1){ console.error("Alert multiple chunks contain camera point. Not possible.")}
        if(activeChunk.length == 0){
            console.warn("Alert camera not on chunk. Avoid.");
            return false
        }
        return activeChunk[0];
    }

    update(){
        //update to fictional camera position
        this.activeCameraDebugBounds.setPosition(this.activeCameraDebugBounds.getPosition().x += 0.3, this.activeCameraDebugBounds.getPosition().y);
        this.activeChunkDebugBounds.setPosition(this.chunk1.getPosition().x, this.chunk1.getPosition().y);
        console.log(this._getObservedChunk());
    }
}