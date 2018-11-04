import { Perlin2 } from 'tumult'
import { Simplex2 } from 'tumult'
import {DebugRect} from '../utils/debug.js'
import { _ } from 'underscore'

export class MapChunk extends Phaser.GameObjects.GameObject {
    constructor(params){
        super(params.scene, params.opt);
        this.x = params.x;
        this.y = params.y;
        this.map;
        this.init();
    }

    init(){

        this.chunkHeight = 12;
        this.chunkWidth = 12;
        this.tileSize = 32;

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


        //debug
        //this._debugFillChunk();
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
        return new Phaser.Geom.Rectangle(pos.x, pos.y, bounds.width, bounds.height);
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