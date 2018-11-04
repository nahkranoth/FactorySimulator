import {MapChunk} from '../core/mapChunk.js';
import {_} from 'underscore';

export class Map extends Phaser.GameObjects.GameObject {

    constructor(params){
        super(params.scene, params.opt);
        this.camera = params.camera;
        this.chunks = [];
        this.viewportRect = this.camera.worldView;

        this.chunk1 = new MapChunk({scene:this.scene, opt:{}});
        this.chunk1.setPosition(this.camera.width/2, this.camera.height/2);

        this.chunks.push(this.chunk1);

        this._drawDebugViewport();
        console.log(this._getObservedChunk());
    }

    _drawDebugViewport(){
        this.size = 200;
        const red = 0xff0000;
        this.debugRect = this.scene.add.graphics();
        this._drawGraphic(this.debugRect, 0,0, this.size, red);
        this._initDebugViewportPosition(this.camera.width/2, this.camera.height/2);
    }

    _initDebugViewportPosition(x, y){
        this.debugRect.setX(x - this.size/2);
        this.debugRect.setY(y - this.size/2);
    }

    _getObservedChunk(){
        let p = new Phaser.Geom.Point(this.debugRect.x, this.debugRect.y);
        let activeChunk = _.filter(this.chunks, (c) => {return Phaser.Geom.Rectangle.ContainsPoint(c.getRectBounds(),p) });
        if(activeChunk.length > 1){ console.warn("Alert multiple chunks contain camera point. Not possible.")}
        if(activeChunk.length == 0){
            console.warn("Alert camera not on chunk. Avoid.");
            return false
        }
        return activeChunk[0];
    }

    _setDebugViewportPosition(x, y){
        this.debugRect.setX(x);
        this.debugRect.setY(y);
    }

    _drawGraphic(graphics, posX, posY, size, color){
        graphics.lineStyle(3, color, 1);
        graphics.strokeRect(posX, posY, size, size);
    }

    update(){
        this._setDebugViewportPosition(this.debugRect.x += 0.1, this.debugRect.y);
    }

    _getActiveChunk(){
    }
}