import {SpriteEntityFactory} from './spriteEntityFactory.js'
import {ControllerBaseClass} from "../core/controllerBaseClass";
import {TileData} from "../data/tileData";

export class WorldEntityController extends ControllerBaseClass{

    constructor(params){
        super(params);
        this.scene = params.scene;
        this.map = params.map;
        this.spriteEntityFactory = new SpriteEntityFactory(params);
        this.movableEntityPool = [];
    }

    generateTrees(chunk){
        let treeAmount = 0;//Math.round(Math.random()*10);
        for(var i=0;i<treeAmount;i++){
            let tree = chunk._getRandomTreeType();
            let pos = this._findFittingTile(tree, chunk);
            if(!pos) continue;
            this._addWorldEntity(chunk, pos.x, pos.y, tree);
        }
    }

    generateAnimals(chunk){
        let animalAmount = 1;//Math.round(Math.random()*10);
        for(var i=0;i<animalAmount;i++){
            let animal = chunk._getRandomAnimalType();
            let pos = this._findFittingTile(animal, chunk);
            if(!pos) continue;
            this._addWorldEntity(chunk, pos.x, pos.y, animal);
        }
    }

    _addWorldEntity(chunk, x, y, source){
        let worldEntityType = source.type;
        //A variant of BaseWorldEntity
        let worldEntity = new worldEntityType({x:x, y:y, frame:source.frame, scene:this.scene, map:this.map, chunk:chunk});
        this.movableEntityPool.push(worldEntity);
        chunk.entityList.push(worldEntity);
    }

    _findFittingTile(entity, chunk){
        let posX, posY, tilePosX, tilePosY;

        let maxTries = 5;
        let tries = 0;
        while(true){
            posX = Math.floor(Math.random()*TileData.PROPERTIES.CHUNKWIDTH);
            posY = Math.floor(Math.random()*TileData.PROPERTIES.CHUNKHEIGHT);
            let tile = chunk.layer.getTileAt(posX, posY);
            tilePosX = tile.getCenterX();
            tilePosY = tile.getCenterY();
            if(entity.excludePlacement.indexOf(tile.index) === -1){
                break;
            }
            if(tries >= maxTries){
                return false;
            }
            tries++;
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
            this.spriteEntityFactory.setFreshWorldSprite(currentWorldEntity);
        }
    }

}