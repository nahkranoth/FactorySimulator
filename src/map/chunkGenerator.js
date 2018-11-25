import {RandomGenerator} from '../utils/randomGenerator'
import {TileData} from '../data/tileData.js';
import {_} from "underscore";
import {PointsController} from "../core/pointsController";

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
        this.generatePerlinMap(4, 0.3, 0.9);//generate rocks

        this.scene.physics.add.collider([this.scene.player], this.layer);
        this.scene.physics.add.overlap([this.scene.fireBall], this.layer, this.onCollision);
    }

    onCollision(collision){
        //console.log(collision);
    }

    clear(){
        this.layer.forEachTile((tile) => {
            this.setTile(tile, 0);
        });
        this.layer.setCollision(0, false);
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
        tile.properties.points = data.points;
        if(data.collision){
            tile.setCollisionCallback(
                (collision) => {
                    if (collision === this.scene.player) return;
                    if (data.points) PointsController.addScore(data.points);
                    this.scene.map.flagTileForCollisionChange(tile, this);
                });
        }else{
            tile.setCollisionCallback(
                (collision) => {
                    if (collision === this.scene.player) return;
                    if (data.points) PointsController.addScore(data.points);
                    tile.index = 6;
                    tile.setCollisionCallback(null);
                    this.scene.map.flagTileForCollisionChange(tile, this);
                });
        }
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
        this.layer.setCollisionByProperty({ collision: true });
        this.layer.setCollisionByProperty({ collision: false }, false);
    }

}