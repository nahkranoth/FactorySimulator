import {MapConstructData} from '../data/mapConstructData.js'

export class MapGenerator {
    constructor(params){
        this.scene = params.scene;
        this.map = params.map;
    }

    addConstruct(chunk){
        let constructData1 = MapConstructData.getBuildingOne();
        if(this.diceRollBuildAllowed(constructData1))this.createBuilding(chunk, constructData1.map);

        let constructData2 = MapConstructData.getBuildingTwo();
        if(this.diceRollBuildAllowed(constructData2))this.createBuilding(chunk, constructData2.map);
    }

    diceRollBuildAllowed(constructData){
        let ran = Math.round(Math.random() * 1000);
        if(typeof(constructData.properties.probability) == "undefined" || constructData.properties.probability == 0) console.log("Note that constructData has a probability of ZERO or is undefined");
        return ran <= constructData.properties.probability;
    }

    createBuilding(chunk, constructData){
        let rootTile = chunk.getTileAt({x:1,y:1});
        for(var x=0;x<constructData.length;x++){
            let xOffset = rootTile.x + x + (chunk.chunkWidth * chunk.xCoord);
            for(var y=0;y<constructData[x].length;y++) {
                if(constructData[x][y] == -1) continue;
                let yOffset = rootTile.y + y + (chunk.chunkHeight * chunk.yCoord);
                let source = this.map._getTileAndChunkByCoord(xOffset, yOffset);
                source.chunk.setTile(source.tile, constructData[x][y]);
                source.chunk.resetCollision();
            }
        }
    }
}