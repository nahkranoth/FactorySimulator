import {DebugRect} from '../utils/debug.js'
import {TileMapGenerator} from '../core/tileMapGenerator.js'
import { _ } from 'underscore'

export class MapChunk extends Phaser.GameObjects.GameObject {
    constructor(params){
        super(params.scene, params.opt);
        this.scene = params.scene;
        this.xCoord = params.opt.xCoord;
        this.yCoord = params.opt.yCoord;
        this.index = params.opt.index;

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
        const blue = 0x0000ff;
        const tiles = [ 0, 1 ];

        let graphics = this.scene.add.graphics();
        this.drawGraphic(graphics, 0,0, this.tileSize, darkgreen);
        this.drawGraphic(graphics, this.tileSize,0, this.tileSize, green);
        this.drawGraphic(graphics, this.tileSize*2, 0, this.tileSize, blue);
        graphics.generateTexture("tiles", 96, this.tileSize);

        let mapData = this._generateChunk();
        this.map = this.scene.make.tilemap({data:mapData, tileWidth: this.tileSize, tileHeight:this.tileSize});
        let tileset = this.map.addTilesetImage('tiles');
        this.layer = this.map.createDynamicLayer(0, tileset, this.x, this.y);

        this.tileMapGenerator = new TileMapGenerator({
            scene:this.scene,
            chunkWidth:this.chunkWidth,
            chunkHeight:this.chunkHeight,
            xCoord:this.xCoord,
            yCoord:this.yCoord,
            map:this.map
        });
        //order matters - there should be a condition map for who to overwrite and who not
        //index, modifier, overwritemap, collision, other properties
        this.tileMapGenerator.generatePerlinMap(1, 0.3);
        this.tileMapGenerator.generatePerlinMap(2, 0.08);
        this.map.setCollision(1);
        this.map.setCollision(2);
        this.scene.physics.add.collider(this.scene.player, this.layer);
    }

    addNeighbourChunkReference(neighbour){
        this.neighbours.push(neighbour);
        if(this.neighbours.length > 8){console.warn("MapChunk has more than 8 neighbours")}
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

    getTileAt(pos){
        if(pos.x < 0){ pos.x = this.chunkWidth+pos.x}
        if(pos.y < 0){ pos.y = this.chunkHeight+pos.y}
        let tile = this.map.getTileAt(pos.x, pos.y);
        if(tile !== null){
            return tile;
        }

        console.warn("No tile found at this position");
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