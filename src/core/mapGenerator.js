import {MapConstructData} from '../data/mapConstructData.js'

export class MapGenerator {
    constructor(params){
        this.scene = params.scene;
        this.map = params.map;
    }

    addConstruct(chunk){
        let ran = Math.round(Math.random() * 10);
        if(ran == 1){
            this.createBuilding(chunk);
        }
    }

    createBuilding(chunk){
        let rootTile = chunk.getTileAt({x:1,y:1});

        let mapData = MapConstructData.getBuildingOne();

        for(var x=0;x<mapData.length;x++){
            let xOffset = rootTile.x + x + (chunk.chunkWidth * chunk.xCoord);
            for(var y=0;y<mapData[x].length;y++) {
                if(mapData[x][y] == -1) continue;
                let yOffset = rootTile.y + y + (chunk.chunkHeight * chunk.yCoord);
                let source = this.map._getTileAndChunkByCoord(xOffset, yOffset);
                source.chunk.setTile(source.tile, mapData[x][y]);
            }
        }
    }
}