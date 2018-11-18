import {MapSpriteEntityFactory} from '../map/mapSpriteEntityFactory.js'
import {ControllerBaseClass} from "../core/controllerBaseClass";
import {_} from 'underscore'
import {TileData} from "../data/tileData";

export class MapWorldEntityController extends ControllerBaseClass{

    constructor(params){
        super(params);
        this.scene = params.scene;
        this.mapSpriteEntityFactory = new MapSpriteEntityFactory(this.scene);
    }

    generateTrees(chunk){
        let treeAmount = Math.round(Math.random()*10);
        for(var i=0;i<treeAmount;i++){
            let treeType = chunk._getRandomTreeType();
            let pos = this._findFittingTile(treeType, chunk);
            chunk.entityList.push({x:pos.x, y:pos.y,frame:treeType.frame});
        }
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
            let currentTree = entityList[j];
            let possibleSprite = this.mapSpriteEntityFactory.getSpriteAt(currentTree.x, currentTree.y, currentTree.frame, chunk);
            //it's clear to spawn new entity
            if(typeof(possibleSprite) !== "undefined") return;
            this.mapSpriteEntityFactory.setFreshWorldSprite(currentTree.x,currentTree.y, currentTree.frame, chunk);
            //this.emit("worldEntityReassigned", worldEntity, chunk, possibleSprite.assignedToChunk);
        }
    }

}