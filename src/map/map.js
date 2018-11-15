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


        this.mapWorldEntityController = new MapWorldEntityController({scene:this.scene});

        this.mapChunkController._activeChunkChanged();
        this.mapDebugController = new MapDebugController({enabled:true, scene:this.scene, map:this});
    }

    update(){
        this.mapChunkController._updateActiveChunk();
        this.mapDebugController.update(this);
    }
}