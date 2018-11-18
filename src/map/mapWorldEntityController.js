import {MapSpriteEntityFactory} from '../map/mapSpriteEntityFactory.js'
import {ControllerBaseClass} from "../core/controllerBaseClass";
import {TileData} from "../data/tileData";
import {BaseWorldEntity} from "../worldEntities/baseWorldEntity";
import {DeerWorldEntity} from "../worldEntities/deerWorldEntity";

export class MapWorldEntityController extends ControllerBaseClass{

    constructor(params){
        super(params);
        this.scene = params.scene;
        this.mapSpriteEntityFactory = new MapSpriteEntityFactory(params);
        this.movableEntityPool = [];

    }

    generateTrees(chunk){
        let treeAmount = Math.round(Math.random()*10);
        for(var i=0;i<treeAmount;i++){
            let tree = chunk._getRandomTreeType();
            let pos = this._findFittingTile(tree, chunk);
            this._addWorldEntity(chunk, pos.x, pos.y, tree);
        }
    }

    generateAnimals(chunk){
        let animalAmount = Math.round(Math.random()*10);
        for(var i=0;i<animalAmount;i++){
            let animal = chunk._getRandomAnimalType();
            let pos = this._findFittingTile(animal, chunk);
            this._addWorldEntity(chunk, pos.x, pos.y, animal);
        }
    }

    _addWorldEntity(chunk, x, y, source){
        let worldEntityType = source.type;
        let worldEntity = new worldEntityType({x:x, y:y, frame:source.frame, chunk:chunk});
        this.movableEntityPool.push(worldEntity);
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
        this.movableEntityPool.forEach((worldEntity) => {
            worldEntity.update();
        });
    }

    _updateChunkSpriteEntities(chunk){
        let entityList = chunk.entityList;
        for(var j=0;j<entityList.length;j++){
            let currentWorldEntity = entityList[j];
            if(currentWorldEntity.spriteEntity !== null) break;
            this.mapSpriteEntityFactory.setFreshWorldSprite(currentWorldEntity);
        }
    }

}