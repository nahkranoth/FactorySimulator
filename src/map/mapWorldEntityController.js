import {MapSpriteEntityFactory} from '../map/mapSpriteEntityFactory.js'
import {ControllerBaseClass} from "../core/controllerBaseClass";
import {_} from 'underscore'

export class MapWorldEntityController extends ControllerBaseClass{

    constructor(params){
        super(params);
        this.scene = params.scene;
        this.mapSpriteEntityFactory = new MapSpriteEntityFactory(this.scene);

    }

    _updateSpriteEntityFactory(activeChunk){
        for(var i=0;i<activeChunk.neighbours.length;i++){
            this._updateChunkSpriteEntities(activeChunk.neighbours[i].mapChunk);
        }
        this._updateChunkSpriteEntities(activeChunk);
    }

    _updateChunkSpriteEntities(chunk){
        let treeList= chunk.chunkGenerator.treeList;
        for(var j=0;j<treeList.length;j++){
            let currentTree = treeList[j];
            this.mapSpriteEntityFactory.setFreshSprite(currentTree.x,currentTree.y, currentTree.frame);
        }
    }

}