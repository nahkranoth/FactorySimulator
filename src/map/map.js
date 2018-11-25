import {ConstructGenerator} from './constructGenerator.js'
import {DebugController} from "./debugController.js";
import {WorldEntityController} from "./worldEntityController.js";
import {ChunkController} from "./chunkController";
import {PathFindingController} from "./pathFindingController";

export class Map extends Phaser.GameObjects.GameObject {

    constructor(params){
        super(params.scene, params.opt);
        this.camera = params.scene.cameras.main;

        this.debug = false;

        this.chunkController = new ChunkController({scene:this.scene, map:this});
        this.chunkController.on("activeChunkChanged", this.activeChunkChanged, this);
        this.chunkController.on("chunkCreated", this.chunkCreated, this);

        this.constructGenerator = new ConstructGenerator({scene:this.scene, map:this});
        //Done in state mode because of optimization
        this.constructGenerator.on("requestSetTilesStart", this.requestSetTileStart, this);
        this.constructGenerator.on("requestSetTile", this.requestSetTile, this);
        this.constructGenerator.on("requestSetTilesFinished", this.requestSetTileFinished, this);

        this.worldEntityController = new WorldEntityController({scene:this.scene, map:this});

        this.pathFindingController = new PathFindingController({scene:this.scene, map:this});

        this.debugController = new DebugController({enabled:true, scene:this.scene, map:this});

        this.init = false;

        this.flaggedForCollisionChanges = [];

        this.afterInit();
    }


    afterInit(){
        this.chunkController.afterInit();
        //From here on out the map is initialized
        if(this.debug) this.debugController.afterInit(this.chunkController.activeChunk);
        this.worldEntityController.resetSpriteEntityController(this.chunkController.activeChunk);
        this.pathFindingController.afterInit(this.chunkController);
        this.init = true;
    }

    requestSetTileStart(){
        this.touchedChunks = [];
    }

    requestSetTile(x, y, index) {
        let source = this.chunkController._getTileAndChunkByCoord(x, y);
        source.chunk.setTile(source.tile, index);
        if (this.touchedChunks.indexOf(source.chunk) === -1) {
            this.touchedChunks.push(source.chunk);
        }
    }


    requestSetTileFinished(){
        this.chunkController.resetChunkCollisionsFor(this.touchedChunks);
    }

    chunkCreated(chunk){
        this.constructGenerator.addConstruct(chunk);
        this.worldEntityController.generateTrees(chunk);
        this.worldEntityController.generateAnimals(chunk);
        this.worldEntityController.generateItems(chunk);
    }

    activeChunkChanged(){
        this.worldEntityController.resetSpriteEntityController(this.chunkController.activeChunk);
    }

    flagTileForCollisionChange(tile, generator){
        this.flaggedForCollisionChanges.push({tile:tile, generator:generator});
    }

    update(){
        if(!this.init)return;
        if(this.debug) this.debugController.update(this.chunkController.activeChunk);
        this.worldEntityController.update();
        this.chunkController.update();
        if(this.flaggedForCollisionChanges.length > 0){
            this.flaggedForCollisionChanges.forEach((source) => {
                source.tile.index = 6;
                source.tile.properties.collision = false;
                source.tile.setCollisionCallback(null);
                source.generator.resetCollision();
            });
            this.flaggedForCollisionChanges = [];
        }
    }
}