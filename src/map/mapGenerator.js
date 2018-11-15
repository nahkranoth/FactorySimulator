import {MapConstructData} from '../data/mapConstructData.js'

export class MapGenerator {
    constructor(params){
        this.scene = params.scene;
        this.map = params.map;
        MapConstructData.init(this.scene);
    }

    addConstruct(chunk){
        for(var i=0;i<MapConstructData.getAmountOfBuildings();i++){
            let constructData = MapConstructData.getBuilding(i);
            if(this.diceRollBuildAllowed(constructData.properties.probability)){
                this.createBuilding(chunk, constructData.map);
                break;//TODO: this makes the probability broken - sort buildings on probability first
            }
        }
    }

    diceRollBuildAllowed(probability){
        let ran = Math.round(Math.random() * 1000);
        if(typeof(probability) == "undefined" || probability == 0) console.log("Note that constructData has a probability of ZERO or is undefined");
        return ran <= probability;
    }

    createBuilding(chunk, constructData){
        let rootTile = chunk.getTileAt({x:1,y:1});
        let touchedChunks = [];

        for(var x=0;x<constructData.length;x++){
            let xOffset = rootTile.x + x + (chunk.chunkWidth * chunk.xCoord);
            for(var y=0;y<constructData[x].length;y++) {
                if(constructData[x][y] == -1) continue;
                let yOffset = rootTile.y + y + (chunk.chunkHeight * chunk.yCoord);
                let source = this.map._getTileAndChunkByCoord(xOffset, yOffset);
                source.chunk.setTile(source.tile, constructData[x][y]);
                if(touchedChunks.indexOf(source.chunk) == -1){
                    touchedChunks.push(source.chunk);
                }
            }
        }
        this.map.mapChunkController.resetChunkCollisionsFor(touchedChunks);
    }
}