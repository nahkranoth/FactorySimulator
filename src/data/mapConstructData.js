export class MapConstructData{
    static init(scene){
        MapConstructData.constructData = scene.cache.json.get('mapConstructData');
    }

    static getBuilding(i){
        let buildingData = MapConstructData.constructData.buildings[i];
        buildingData.map = MapConstructData.rotateMap(buildingData.map);
        return {map:buildingData.map, properties:buildingData.properties};
    }

    static getAmountOfBuildings(){
        return MapConstructData.constructData.buildings.length;
    }

    //NOTE: All maps turned counterClockwise on return because of easier placement.
    static rotateMap(grid){
        let rotated = grid[0].map((col, i) => grid.map(row => row[i]));
        return rotated;

    }

    static mapDataToString(indexMapList){
        let rotatedMap = MapConstructData.rotateMap(indexMapList);

        let outStr = "[\n";
        for(var x = 0;x< rotatedMap.length;x++){
            outStr += "[";
            for(var y=0;y<rotatedMap[x].length;y++){
                outStr += rotatedMap[x][y];
                outStr += y != rotatedMap[x].length-1 ? "," : "";
            }
            outStr += x != rotatedMap.length-1 ? "],\n" : "]\n]";
        }
        return outStr;
    }
}

MapConstructData.constructData = {};
