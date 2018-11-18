import {MapGenerationController} from './mapGenerationController.js'
import {MapDebugController} from "./mapDebugController.js";
import {MapWorldEntityController} from "./mapWorldEntityController.js";
import {MapChunkController} from "./mapChunkController";

export class Map extends Phaser.GameObjects.GameObject {

    constructor(params){
        super(params.scene, params.opt);
        this.camera = params.scene.cameras.main;

        this.debug = true;

        this.mapChunkController = new MapChunkController({scene:this.scene, map:this});
        this.mapChunkController.on("activeChunkChanged", this.activeChunkChanged, this);
        this.mapChunkController.on("chunkCreated", this.chunkCreated, this);

        this.mapGenerator = new MapGenerationController({scene:this.scene, map:this});
        //Done in state mode because of optimization
        this.mapGenerator.on("requestSetTilesStart", this.requestSetTileStart, this);
        this.mapGenerator.on("requestSetTile", this.requestSetTile, this);
        this.mapGenerator.on("requestSetTilesFinished", this.requestSetTileFinished, this);

        this.mapWorldEntityController = new MapWorldEntityController({scene:this.scene});
        this.mapWorldEntityController.on("worldEntityReassigned", this.worldEntityReassigned, this);

        this.mapDebugController = new MapDebugController({enabled:true, scene:this.scene, map:this});

        this.init = false;
        this.afterInit();
    }

    afterInit(){
        this.mapChunkController.afterInit();
        //From here on out the map is initialized
        if(this.debug) this.mapDebugController.afterInit(this.mapChunkController.activeChunk);
        this.mapWorldEntityController.resetSpriteEntityController(this.mapChunkController.activeChunk);
        this.init = true;
    }

    worldEntityReassigned(sprite, toChunk, fromChunk){
        console.log("World Entity Reassigned");
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
        this.mapWorldEntityController.generateTrees(chunk);
    }

    activeChunkChanged(){
        this.mapWorldEntityController.resetSpriteEntityController(this.mapChunkController.activeChunk);
    }

    update(){
        if(!this.init)return;
        this.mapChunkController.updateActiveChunk();
        if(this.debug) this.mapDebugController.update(this.mapChunkController.activeChunk);
        this.mapWorldEntityController.update();
    }
}