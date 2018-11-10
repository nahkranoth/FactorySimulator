import {MapChunk} from '../core/mapChunk.js';
import {DebugRect} from '../utils/debug.js'
import { Perlin3 } from 'tumult'
import {MapChunkNeighbour} from '../core/mapChunkNeighbour'
import {_} from 'underscore';

export class Map extends Phaser.GameObjects.GameObject {

    constructor(params){
        super(params.scene, params.opt);
        this.camera = params.scene.cameras.main;


        /*TODO:
          make a division between chunks and active chunks -
          now I'm itterating through the complete set of chunks -
          while I know that chunks positioned 2 chunks away from me can never be a neighbour.
        */

        this.chunks = [];
        this.viewportRect = this.camera.worldView;

        this.chunkWidth = 8;
        this.chunkHeight = 8;
        this.tileSize = 16;
        this.generatedChunkIndex = 0;

        this.perlin = new Perlin3();
        this.perlin.seed();
        this.perlinModifier = 0.1;

        this._previousActiveChunk;

        this.rootChunkCenterPosition = {width:this.camera.width/2, height:this.camera.height/2};

        this.rootChunk = new MapChunk({
            scene:this.scene,
            opt:{
                index:this.generatedChunkIndex,
                xCoord:0,
                yCoord:0,
                chunkHeight:this.chunkHeight,
                chunkWidth:this.chunkWidth,
                tileSize:this.tileSize,
                perlin:this.perlin,
                perlinModifier:this.perlinModifier
            }});

        this.rootChunk.setPosition(this.rootChunkCenterPosition.width, this.rootChunkCenterPosition.height);
        this.activeChunk = this.rootChunk;

        this.chunks.push(this.rootChunk);

        this.activeCameraDebugBounds = new DebugRect({scene:this.scene, size:200, color:0xff0000, lineColor:0xff0000, outlinesOnly:true});
        this.activeChunkDebugBounds = new DebugRect({scene:this.scene, camera:this.camera, size:this.rootChunk.getBounds().width, color:0x0000ff, lineColor:0x0000ff, outlinesOnly:true});

        // this.debugGraph = this.scene.add.graphics();

    }

    _getChunkByCoord(x, y){
        let chunks = _.filter(this.chunks, (c) => { return (c.xCoord == x && c.yCoord == y);});
        if(chunks.length > 1) console.error("Returned multiple chunks on same coordinate");
        return chunks[0];
    }

    _generateNeighbouringChunks(){
        let activeChunkPos = this.activeChunk.getPosition();
        if(this.activeChunk.neighbours.length == 0){
            for(var x=-1;x<=1;x++){
                for(var y=-1;y<=1;y++){
                    //prevent from making itself a neighbour
                    if(x == 0 && y == 0) continue;
                    let offsetXCoord = this.activeChunk.xCoord+x;
                    let offsetYCoord = this.activeChunk.yCoord+y;
                    let possibleChunk = this._getChunkByCoord(offsetXCoord, offsetYCoord);
                    if(typeof(possibleChunk) == "undefined"){//prevent from building one if allready exists at that world cordinate
                        this.generatedChunkIndex++;
                        let chunk = new MapChunk({
                            scene:this.scene,
                            opt:{
                                index:this.generatedChunkIndex,
                                xCoord:offsetXCoord,
                                yCoord:offsetYCoord,
                                chunkHeight:this.chunkHeight,
                                chunkWidth:this.chunkWidth,
                                tileSize:this.tileSize,
                                perlin:this.perlin,
                                perlinModifier:this.perlinModifier
                            }});

                        let xPos = activeChunkPos.x + (x*this.chunkWidth*this.tileSize);
                        let yPos = activeChunkPos.y + (y*this.chunkHeight*this.tileSize);
                        chunk.setPosition(xPos, yPos);
                        this.chunks.push(chunk);
                    }
                    //then just add as neighbour
                    this.activeChunk.addNeighbourChunkReference(new MapChunkNeighbour({mapChunk:possibleChunk, xDir:x, yDir:y}));
                }
            }
        }
    }

    _activeChunkChanged(){
        this._generateNeighbouringChunks();
    }

    _updateActiveChunk(){
        let currentActiveChunk = this._getActiveChunk();
        if(this._previousActiveChunk != currentActiveChunk) {
            console.log("Active chunk switch");
            this.activeChunk = currentActiveChunk;
            this._activeChunkChanged();
            this._previousActiveChunk = currentActiveChunk;
            return true;
        }
        return false;
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
        this._updateActiveChunk();
        //update to fictional camera position
        this.activeCameraDebugBounds.setPosition(this.activeCameraDebugBounds.getPosition().x -= 2, this.activeCameraDebugBounds.getPosition().y -= 2);
        this.activeChunkDebugBounds.setPosition(this._getActiveChunk().getPosition().x, this._getActiveChunk().getPosition().y);
    }
}