import { Perlin3 } from 'tumult'
import { Simplex2 } from 'tumult'
import { _ } from 'underscore'

export class TileMap extends Phaser.GameObjects.GameObject {
    constructor(params){
        super(params.scene, params.opt);
        this.init();
    }

    init(){

        this.mapHeight = 24;
        this.mapWidth = 32;

        const yellow = 0x555500;
        const green = 0x00ff00;

        const tiles = [ 0, 1 ];
        const tileSize = 32;
        const size = 32;

        let graphics = this.scene.add.graphics();
        this.drawGraphic(graphics, 0,0, size, yellow);
        this.drawGraphic(graphics, size,0, size, green);
        graphics.generateTexture("tiles", 64, size);

        this.sx = 0;
        this.animIndex = 0;
        this.updateTreshold = 0;

        this.perlin = new Perlin3();
        this.simplex = new Simplex2();
        
        this.simplexModifier = 0.1;
        this.perlinModifier = 0.2;

        let mapData = this._generateBlankMap();
        this.map = this.scene.make.tilemap({data:mapData, tileWidth: tileSize, tileHeight:tileSize});
        let tileset = this.map.addTilesetImage('tiles');
        this.layer = this.map.createDynamicLayer(0, tileset, 0, 0);
        this._initPerlexMap();
        this._generatePerlexMap();
        //this._generateWalkerMap();

        //IMPORTANT: set the collisions after you generated the map
        this.map.setCollision(1, true, true, 0);
    }

    _getRandom(x, y){
        let perlinValue = Math.abs(Math.round(this.perlin.gen(x*this.perlinModifier, y*this.perlinModifier, this.animIndex)));
        let simplexValue = Math.abs(Math.round(this.simplex.gen(x*this.simplexModifier, y*this.simplexModifier)));
        //if (perlinValue) return 0;
        return perlinValue;
    }

    _generateBlankMap(){
        let mapData = [];
        for(let y=0;y<this.mapHeight; y++){
            let row = [];
            for(let x=0;x<this.mapWidth; x++){
                row.push(0);
            }
            mapData.push(row);
        }
        return mapData;
    }

    _generateWalkerMap() {
        let steps = Math.round(Math.random() * 30) + 30;
        let start = this._getRandomPositionOnChunk();
        let previous;
        let position = start;
        let positions = [];
        positions.push(position);
        for (var i = 0; i < steps; i++) {
            positions.push(position);
            position = this._getRandomNextStep(position, positions);
        }
        this._drawTiles(positions);
    }

    _getTileAt(pos){
        let tile = this.map.getTileAt(pos.x, pos.y);
        if(tile !== null){
            return tile;
        }
        return null;
    }

    _drawTiles(positions){
        let index = 0;
        let looper = setInterval(() => {
            let pos = positions[index];
            let tile = this._getTileAt(pos)
            if(tile !== null){
                tile.index = 1;
            }
            index++;
            if(index == positions.length) clearInterval(looper);
        }, 20)
    }

    _getRandomNextStep(position, positions){
        let stepStrength = 1;
        let tries = 0;
        let pos = this._getRandomDirectionPosition(position, stepStrength);
        while(this._getTileAt(pos) == null || _.filter(positions, (item) => {return item.x == pos.x && item.y == pos.y}).length > 0){
            pos = this._getRandomDirectionPosition(position, stepStrength);
            tries++;
            if(tries > 8){
                stepStrength++;
            }
        }
        return pos;
    }

    _getRandomDirectionPosition(position, stepStrength){
        let directionX = Math.round(Math.random()*2*stepStrength)-1;
        let directionY = Math.round(Math.random()*2*stepStrength)-1;
        let pos = {x:position.x+directionX, y:position.y+directionY};
        return pos;
    }

    _getRandomPositionOnChunk(){
        let pos =  {x:Math.floor(Math.random() * (this.mapWidth-1)), y:Math.floor(Math.random() * (this.mapHeight-1))};
        return pos;
    }

    _initPerlexMap(){
        this.perlin.seed();
        this.simplex.seed();
    }

    _generatePerlexMap(){
        for(let y=0;y<this.mapHeight; y++){
            for(let x=0;x<this.mapWidth; x++){
                let tile = this.map.getTileAt(x, y);
                let i = this._getRandom(x, y);
                tile.index = i;
            }
        }
    }

    update(){
        this.updateTreshold ++;
        if(this.updateTreshold % 2 == 0){
            this.animIndex += 0.01;
            this._generatePerlexMap();
            this.map.setCollision(1, true);
            this.map.setCollision(0, false);
        }
    }

    drawGraphic(graphics, posX, posY, size, color){
        graphics.fillStyle(color, 1);
        graphics.fillRect(posX, posY, size, size);
    }
}