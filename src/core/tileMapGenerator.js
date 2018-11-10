import { _ } from 'underscore'
import {RandomGenerator} from '../utils/randomGenerator'


export class TileMapGenerator {
    constructor(params){
        this.scene = params.scene;
        this.chunkWidth = params.chunkWidth;
        this.chunkHeight = params.chunkHeight;
        this.xCoord = params.xCoord;
        this.yCoord = params.yCoord;
        this.map = params.map;
        this.perlinModifier = 0.1;
    }

    _convertToAxis(x, y){
        if(x != 0){
            x = x > 0 ? 1 : -1
        }
        if(y != 0){
            y = y > 0 ? 1 : -1
        }
        return x + y + 2;//add  to make it absolute
    }

    _getRandom(x, y){
        let xOffset = Math.abs(x + (this.chunkWidth * this.xCoord));
        let yOffset = Math.abs(y + (this.chunkHeight * this.yCoord));
        let axis = this._convertToAxis(this.xCoord, this.yCoord);

        let perlinValue = Math.abs(Math.round(RandomGenerator.generatePerlin3(xOffset*this.perlinModifier, yOffset*this.perlinModifier, axis)));
        return perlinValue;
    }

    generatePerlinMap(){
        for(let y=0;y<this.chunkHeight; y++){
            for(let x=0;x<this.chunkWidth; x++){
                let tile = this.map.getTileAt(x, y);
                tile.index = this._getRandom(x, y);
            }
        }
    }


}