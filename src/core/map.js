import {MapChunk} from '../core/mapChunk.js';
import {DebugRect} from '../utils/debug.js'
import {MapChunkNeighbour} from '../core/mapChunkNeighbour'
import {_} from 'underscore';

export class Map extends Phaser.GameObjects.GameObject {

    constructor(params){
        super(params.scene, params.opt);
        this.camera = params.scene.cameras.main;
        this.chunks = [];
        this.viewportRect = this.camera.worldView;

        this.rootChunkCenterPosition = {width:this.camera.width/2, height:this.camera.height/2};

        this.rootChunk = new MapChunk({scene:this.scene, opt:{xCoord:0, yCoord:0, chunkHeight:8, chunkWidth:8, tileSize:32}});
        this.rootChunk.setPosition(this.rootChunkCenterPosition.width, this.rootChunkCenterPosition.height);

        this.chunks.push(this.rootChunk);

        this.activeCameraDebugBounds = new DebugRect({scene:this.scene, size:200, color:0xff0000, lineColor:0xff0000, outlinesOnly:true});
        this.activeChunkDebugBounds = new DebugRect({scene:this.scene, camera:this.camera, size:this.rootChunk.getBounds().width, color:0x0000ff, lineColor:0x0000ff, outlinesOnly:true});

        // this.debugGraph = this.scene.add.graphics();
        this._generateNeighbouringChunks();
    }

    _generateNeighbouringChunks(){
        let activeChunk = this._getActiveChunk();
        if(activeChunk.neighbours.length == 0){
            for(var x=-1;x<=1;x++){
                for(var y=-1;y<=1;y++){
                    //prevent from making itself a neighbour
                    if(x == 0 && y == 0) continue;
                    activeChunk.addNeighbourChunkReference(new MapChunkNeighbour({mapChunk:null, xDir:x, yDir:y}));
                }
            }
        }
    }

    _getActiveChunk(){
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
        //this.activeCameraDebugBounds.setPosition(this.activeCameraDebugBounds.getPosition().x += 0.3, this.activeCameraDebugBounds.getPosition().y);
        //this.activeChunkDebugBounds.setPosition(this._getActiveChunk().getPosition().x, this._getActiveChunk().getPosition().y);
    }
}