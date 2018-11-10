import {DebugRect} from '../utils/debug.js'
import { _ } from 'underscore'

export class MapChunk extends Phaser.GameObjects.GameObject {
    constructor(params){
        super(params.scene, params.opt);
        this.xCoord = params.opt.xCoord;
        this.yCoord = params.opt.yCoord;
        this.index = params.opt.index;
        console.log("Chunk generated with coord X:",this.xCoord," Y:",this.yCoord);

        this.chunkHeight = params.opt.chunkHeight;
        this.chunkWidth = params.opt.chunkWidth;
        this.tileSize = params.opt.tileSize;

        this.perlin = params.opt.perlin;
        this.perlinModifier = params.opt.perlinModifier;

        this.neighbours = [];

        this.map;
        this.init();
    }

    init(){

        const darkgreen = 0x223322;
        const green = 0x00ff00;
        const tiles = [ 0, 1 ];
        const size = 32;

        let graphics = this.scene.add.graphics();
        this.drawGraphic(graphics, 0,0, size, darkgreen);
        this.drawGraphic(graphics, size,0, size, green);
        graphics.generateTexture("tiles", 64, size);

        let mapData = this._generateChunk();
        this.map = this.scene.make.tilemap({data:mapData, tileWidth: this.tileSize, tileHeight:this.tileSize});
        let tileset = this.map.addTilesetImage('tiles');
        this.layer = this.map.createDynamicLayer(0, tileset, this.x, this.y);

        this._generatePerlinMap();

        //debug
        //this._debugFillChunk();
    }

    addNeighbourChunkReference(neighbour){
        this.neighbours.push(neighbour);
        if(this.neighbours.length > 8){console.warn("MapChunk has more than 8 neighbours")}
    }

    _getRandom(x, y){
        let perlinValue = Math.abs(Math.round(this.perlin.gen(x*this.perlinModifier, y*this.perlinModifier, this.index)));
        return perlinValue;
    }

    _generatePerlinMap(){
        for(let y=0;y<this.chunkHeight; y++){
            for(let x=0;x<this.chunkWidth; x++){
                let tile = this.map.getTileAt(x, y);
                console.log(this._getRandom(x, y));
                tile.index = this._getRandom(x, y) + 1;
            }
        }
    }

    _generateChunk(){
        let mapData = [];
        for(let y=0;y<this.chunkHeight; y++){
            let row = [];
            for(let x=0;x<this.chunkWidth; x++){
                row.push(0);
            }
            mapData.push(row);
        }
        return mapData;
    }

    _debugFillChunk(){
        this.map.forEachTile((tile) => {tile.index = 1});
    }

    _getTileAt(pos){
        let tile = this.map.getTileAt(pos.x, pos.y);
        if(tile !== null){
            return tile;
        }
        return null;
    }

    getBounds(){
        return {width:this.chunkWidth*this.tileSize, height:this.chunkHeight*this.tileSize}
    }
    
    getRectBounds(){
        let bounds = this.getBounds();
        let pos = this.getPosition();
        return new Phaser.Geom.Rectangle(pos.x - bounds.width/2, pos.y - bounds.height/2, bounds.width, bounds.height);
    }

    getPosition(){
        let bounds = this.getBounds();
        return new Phaser.Geom.Point(this.layer.x + bounds.width/2, this.layer.y + bounds.height/2)
    }

    setPosition(x, y){
        let bounds = this.getBounds();
        this.layer.x = x - bounds.width/2;
        this.layer.y = y - bounds.height/2;
    }

    drawGraphic(graphics, posX, posY, size, color, lineColor, outlinesOnly){
        if(!outlinesOnly){
            graphics.fillStyle(color, 1);
            graphics.fillRect(posX, posY, size, size);
        }

        graphics.lineStyle(1, lineColor, 1);
        graphics.strokeRect(posX, posY, size, size);
    }
}