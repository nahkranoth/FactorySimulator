import {_} from 'underscore';
import {MapChunk} from './mapChunk.js';
import {TileData} from '../data/tileData.js'
import {MapChunkNeighbour} from './mapChunkNeighbour.js'
import {MapGenerator} from './mapGenerator.js'
import {MapDebugController} from "./mapDebugController.js";
import {MapWorldEntityController} from "./mapWorldEntityController.js";
import {MapChunkController} from "./mapChunkController";

export class Map extends Phaser.GameObjects.GameObject {

    constructor(params){
        super(params.scene, params.opt);
        this.camera = params.scene.cameras.main;

        this.mapChunkController = new MapChunkController({scene:this.scene, map:this});
        this.mapGenerator = new MapGenerator({scene:this.scene, map:this});

        this.rootChunkCenterPosition = {width:this.camera.width/2, height:this.camera.height/2};
        this.rootChunk = this._createChunk(0, 0);
        this.rootChunk.setPosition(this.rootChunkCenterPosition.width, this.rootChunkCenterPosition.height);

        this.activeChunk = this.rootChunk;

        this.mapWorldEntityController = new MapWorldEntityController({scene:this.scene});

        this.mapChunkController._activeChunkChanged();
        this.mapDebugController = new MapDebugController({enabled:true, scene:this.scene, rootChunk:this.rootChunk});
    }


    _createChunk(x, y){
        this.mapChunkController.generatedChunkIndex++;

        let pos = this.mapChunkController._convertCoordToPos(x, y);

        let generatedChunk = new MapChunk({
            scene: this.scene,
            opt: {
                index: this.mapChunkController.generatedChunkIndex,
                xCoord: x,
                yCoord: y,
                x:pos.x,
                y:pos.y,
                chunkHeight: TileData.PROPERTIES.CHUNKHEIGHT,
                chunkWidth: TileData.PROPERTIES.CHUNKWIDTH,
                tileSize: TileData.PROPERTIES.TILESIZE
            }
        });

        this.mapChunkController.chunks.push(generatedChunk);
        return generatedChunk;
    }

    update(){
        this.mapChunkController._updateActiveChunk();
        this.mapDebugController.update(this);
    }
}