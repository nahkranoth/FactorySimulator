import {MapGenerationController} from './mapGenerationController.js'
import {MapDebugController} from "./mapDebugController.js";
import {MapWorldEntityController} from "./mapWorldEntityController.js";
import {MapChunkController} from "./mapChunkController";

export class Map extends Phaser.GameObjects.GameObject {

    constructor(params){
        super(params.scene, params.opt);
        this.camera = params.scene.cameras.main;

        this.mapChunkController = new MapChunkController({scene:this.scene, map:this});
        this.mapChunkController.on("activeChunkChanged", this.chunksCreated, this);
        this.mapChunkController.on("chunkCreated", this.chunkCreated, this);

        this.mapGenerator = new MapGenerationController({scene:this.scene, map:this});
        this.mapGenerator.on("requestSetTilesStart", this.requestSetTileStart, this);
        this.mapGenerator.on("requestSetTile", this.requestSetTile, this);
        this.mapGenerator.on("requestSetTilesFinished", this.requestSetTileFinished, this);

        this.mapWorldEntityController = new MapWorldEntityController({scene:this.scene});

        this.mapDebugController = new MapDebugController({enabled:true, scene:this.scene, map:this});
    }

    requestSetTileStart(){
        this.touchedChunks = [];
    }

    requestSetTile(x, y, index){
        let source = this.mapChunkController._getTileAndChunkByCoord(x, y);
        source.chunk.setTile(source.tile, index);
        if(this.touchedChunks.indexOf(source.chunk) === -1){
            this.touchedChunks.push(source.chunk);
        }
    }

    requestSetTileFinished(){
        this.mapChunkController.resetChunkCollisionsFor(this.touchedChunks);
    }

    chunkCreated(chunk){
        this.mapGenerator.addConstruct(chunk);
    }

    chunksCreated(){
        console.log("chunks created");
    }

    update(){
        this.mapChunkController._updateActiveChunk();
        this.mapDebugController.update();
    }
}