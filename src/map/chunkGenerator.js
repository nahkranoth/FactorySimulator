import {RandomGenerator} from '../utils/randomGenerator'
import {TileData} from '../data/tileData.js';
import {_} from "underscore";

export class ChunkGenerator {
    constructor(params){
        this.scene = params.scene;
        this.chunkWidth = params.chunkWidth;
        this.chunkHeight = params.chunkHeight;
        this.xCoord = params.xCoord;
        this.yCoord = params.yCoord;
        this.tileMap = params.tileMap;
        this.layer = params.layer;
        this.chunk = params.chunk;
        this.init();
    }

    init(){
        this.generatePerlinMap(1, 0.3);//generate trees
        this.generatePerlinMap(2, 0.08);//generate lakes
        this.generatePerlinMap(4, 0.3, 9);//generate rocks

        //this.generateTrees();

        this.scene.physics.add.collider(this.scene.player, this.layer);
    }

    clear(){
        this.layer.forEachTile((tile) => {
            this.setTile(tile, 0);
        });
        this.tileMap.setCollision(0, false);
    }

    //TODO: REMOVE AFTER REFACTOR
    generateTrees(){
        let treeAmount = Math.round(Math.random()*10);
        let chunkDimensions = TileData.getChunkDimensionsInPixels();
        for(var i=0;i<treeAmount;i++){
            let treeType = _.sample(this.treeTypes);
            let pos = this._findFittingTile(treeType, chunkDimensions);
            let posXOffset = pos.x + this.chunk.x - (chunkDimensions.x/2);
            let posYOffset = pos.y + this.chunk.y - (chunkDimensions.y/2);
            this.treeList.push({x:posXOffset, y:posYOffset,frame:treeType.frame});
        }
    }

    _findFittingTile(treeType, chunkDimensions){
        let posX, posY;
        while(true){
            posX = (Math.random()*chunkDimensions.x);
            posY = (Math.random()*chunkDimensions.y);
            let tile = this.tileMap.getTileAtWorldXY(posX, posY);
            //console.log("TILEINDEX: ",tile.index);
            //console.log(treeType.excludePlacement.indexOf(tile.index));
            if(treeType.excludePlacement.indexOf(tile.index) === -1){
                break;
            }
        }
        return {x:posX, y:posY}
    }

    //Convert chunk position to axis.
    // Doing this to feed into the perlin generator else it would be 4 ways symetric.
    _convertToAxis(x, y){
        if(x != 0) x = x > 0 ? 1 : -1;
        if(y != 0) y = y > 0 ? 1 : -1;
        return x + y + 2;//add 2 to make it absolute
    }

    _getRandom(x, y, modifier, octave){
        let xOffset = Math.abs(x + (this.chunkWidth * this.xCoord));
        let yOffset = Math.abs(y + (this.chunkHeight * this.yCoord));
        let axis = this._convertToAxis(this.xCoord, this.yCoord);
        if(octave){
            return Math.abs(Math.round(RandomGenerator.generatePerlin3Octave(octave, xOffset*modifier, yOffset*modifier, axis)));
        }
        return Math.abs(Math.round(RandomGenerator.generatePerlin3(xOffset*modifier, yOffset*modifier, axis)));
    }

    setTile(tile, index){
        tile.index = index;
        let data = TileData.getTileData(index);
        tile.properties.collision = data.collision;
    }

    generatePerlinMap(index, modifier, octave){
        for(let y=0;y<this.chunkHeight; y++){
            for(let x=0;x<this.chunkWidth; x++){
                let tile = this.tileMap.getTileAt(x, y);
                let i = this._getRandom(x, y, modifier, octave) ? index : tile.index;
                this.setTile(tile, i);
            }
        }
        this.resetCollision();
    }

    resetCollision(){
        this.tileMap.setCollisionByProperty({ collision: true });
        this.tileMap.setCollisionByProperty({ collision: false }, false);
    }

}