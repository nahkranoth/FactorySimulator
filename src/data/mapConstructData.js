export class MapConstructData{
    //NOTE: All maps turned counterClockwise on return because of easier placement.
    static getBuildingOne(){
        let properties = {
            probability:10
        };
        let map = [
            [ 3, 3, 3, 3, 3],
            [ 3,-1,-1,-1, 3],
            [ 3,-1,-1,-1, 3],
            [ 3,-1,-1,-1, 3],
            [ 3,-1,-1,-1, 3]
        ];
        map = MapConstructData.rotateMap(map);
        return {map:map, properties:properties};
    }

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
