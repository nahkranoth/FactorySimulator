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

    afterInit(){

    }

    generateTrees(chunk){
        let treeAmount = Math.round(Math.random()*10);
        let chunkDimensions = TileData.getChunkDimensionsInPixels();
        for(var i=0;i<treeAmount;i++){
            let treeType = chunk._getRandomTreeType();
            let pos = this._findFittingTile(treeType, chunk, chunkDimensions);
            chunk.treeList.push({x:pos.x, y:pos.y,frame:treeType.frame});
        }
    }

    _findFittingTile(treeType, chunk, chunkDimensions){
        let posX, posY, tilePosX, tilePosY;
        while(true){
            posX = Math.floor(Math.random()*TileData.PROPERTIES.CHUNKWIDTH);
            posY = Math.floor(Math.random()*TileData.PROPERTIES.CHUNKHEIGHT);
            let tile = chunk.layer.getTileAt(posX, posY);
            tilePosX = tile.getCenterX();
            tilePosY = tile.getCenterY();
            //console.log(treeType.excludePlacement.indexOf(tile.index));
            if(treeType.excludePlacement.indexOf(tile.index) === -1){
                break;
            }
        }
        return {x:tilePosX, y:tilePosY}
    }

    _updateSpriteEntityFactory(activeChunk){
        for(var i=0;i<activeChunk.neighbours.length;i++){
            this._updateChunkSpriteEntities(activeChunk.neighbours[i].mapChunk);
        }
        this._updateChunkSpriteEntities(activeChunk);
    }

    _updateChunkSpriteEntities(chunk){
        let treeList= chunk.treeList;
        for(var j=0;j<treeList.length;j++){
            let currentTree = treeList[j];

            this.mapSpriteEntityFactory.setFreshSprite(currentTree.x,currentTree.y, currentTree.frame);
        }
    }

}