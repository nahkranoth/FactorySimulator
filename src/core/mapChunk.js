import {ChunkGenerator} from '../core/chunkGenerator.js'

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

        this.init();
    }

    init(){

        let mapData = this._generateChunk();
        this.map = this.scene.make.tilemap({data:mapData, tileWidth: this.tileSize, tileHeight:this.tileSize});
        let tileset = this.map.addTilesetImage('worldTilesImg');
        this.layer = this.map.createDynamicLayer(0, tileset, this.x, this.y);

        this.chunkGenerator = new ChunkGenerator({
            scene:this.scene,
            chunkWidth:this.chunkWidth,
            chunkHeight:this.chunkHeight,
            xCoord:this.xCoord,
            yCoord:this.yCoord,
            map:this.map,
            layer:this.layer,
            chunk:this
        });
        this.chunkGenerator.init(this.layer);
    }

    setTile(tile, index){
        this.chunkGenerator.setTile(tile, index);
    }

    clear(){
        this.chunkGenerator.clear();
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
        if(pos.x < 0) pos.x = this.chunkWidth+pos.x;
        if(pos.y < 0) pos.y = this.chunkHeight+pos.y;
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

    getPosition(){
        let bounds = this.getBounds();
        return new Phaser.Geom.Point(this.layer.x + bounds.width/2, this.layer.y + bounds.height/2)
    }

    setPosition(x, y){
        let bounds = this.getBounds();
        this.layer.x = x - bounds.width/2;
        this.layer.y = y - bounds.height/2;
    }

}