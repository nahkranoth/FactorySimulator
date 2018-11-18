import {MapSpriteEntityFactory} from '../map/mapSpriteEntityFactory.js'
import {ControllerBaseClass} from "../core/controllerBaseClass";
import {TileData} from "../data/tileData";
import {MapWorldEntity} from "./mapWorldEntity";

export class MapWorldEntityController extends ControllerBaseClass{

    constructor(params){
        super(params);
        this.scene = params.scene;
        this.mapSpriteEntityFactory = new MapSpriteEntityFactory(params);
    }

    generateTrees(chunk){
        let treeAmount = Math.round(Math.random()*10);
        for(var i=0;i<treeAmount;i++){
            let treeType = chunk._getRandomTreeType();
            let pos = this._findFittingTile(treeType, chunk);
            chunk.entityList.push({x:pos.x, y:pos.y,frame:treeType.frame});
            this._addWorldEntity(chunk, pos.x, pos.y, treeType.frame);
        }
    }

    _addWorldEntity(chunk, x, y, frame){
        let worldEntity = new MapWorldEntity({x:x, y:y, frame:frame});
        chunk.entityList.push(worldEntity);
    }

    _findFittingTile(treeType, chunk){
        let posX, posY, tilePosX, tilePosY;
        while(true){
            posX = Math.floor(Math.random()*TileData.PROPERTIES.CHUNKWIDTH);
            posY = Math.floor(Math.random()*TileData.PROPERTIES.CHUNKHEIGHT);
            let tile = chunk.layer.getTileAt(posX, posY);
            tilePosX = tile.getCenterX();
            tilePosY = tile.getCenterY();
            if(treeType.excludePlacement.indexOf(tile.index) === -1){
                break;
            }
        }
        return {x:tilePosX, y:tilePosY}
    }

    resetSpriteEntityController(activeChunk){
        for(var i=0;i<activeChunk.neighbours.length;i++){
            this._updateChunkSpriteEntities(activeChunk.neighbours[i].mapChunk);
        }
        this._updateChunkSpriteEntities(activeChunk);
    }

    update(){
        this.mapSpriteEntityFactory.updateMovableEntities();
    }

    _updateChunkSpriteEntities(chunk){
        let entityList = chunk.entityList;
        for(var j=0;j<entityList.length;j++){
            let currentWorldEntity = entityList[j];
            let possibleSprite = this.mapSpriteEntityFactory.getSpriteAt(currentWorldEntity.x, currentWorldEntity.y, currentWorldEntity.frame, chunk);
            //it's clear to spawn new entity
            if(typeof(possibleSprite) !== "undefined") return;
            let spriteEntity = this.mapSpriteEntityFactory.setFreshWorldSprite(currentWorldEntity.x,currentWorldEntity.y, currentWorldEntity.frame, chunk);
            currentWorldEntity.spriteEntity = spriteEntity;
            //this.emit("worldEntityReassigned", worldEntity, chunk, possibleSprite.assignedToChunk);
        }
    }

}