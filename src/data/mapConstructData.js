export class MapConstructData{
    //NOTE: All maps turned counterClockwise on return because of easier placement.
    static getBuildingOne(){
        let properties = {
            probability:1000 // 1%
        };
        let map = [
            [ 3, 3, 3, 3, 3],
            [ 3, 5, 5, 5, 3],
            [ 3, 5, 5, 5, 3],
            [ 3, 5, 5, 5, 3],
            [ 3, 3, 5, 3, 3]
        ];
        map = MapConstructData.rotateMap(map);
        return {map:map, properties:properties};
    }

    static getBuildingTwo(){
        let properties = {
            probability:4 // 0.4%
        };
        let map = [
            [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
            [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
            [2,2,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,2,2],
            [2,2,4,4,4,3,3,3,3,3,3,3,3,3,3,3,3,4,4,4,2,2],
            [2,2,4,4,4,5,5,5,5,5,5,5,5,5,5,5,5,4,4,4,2,2],
            [2,2,4,3,5,5,5,3,3,3,5,5,3,3,3,5,5,5,3,4,2,2],
            [2,2,4,3,5,5,5,5,5,3,3,3,3,5,5,5,5,5,3,4,2,2],
            [2,2,4,3,5,5,5,5,5,5,5,5,5,5,5,5,5,5,3,4,2,2],
            [2,2,4,3,5,5,5,5,5,5,5,5,5,5,5,5,5,5,3,4,2,2],
            [2,2,4,3,5,5,5,5,5,5,5,5,5,5,5,5,5,5,3,4,2,2],
            [2,2,4,3,5,5,5,5,5,5,5,5,5,5,5,5,5,5,3,4,2,2],
            [2,2,4,3,5,5,5,5,5,5,5,5,5,5,5,5,5,5,3,4,2,2],
            [2,2,4,3,5,5,5,5,5,5,5,5,5,5,5,5,5,5,3,4,2,2],
            [2,2,4,3,5,5,5,5,5,5,5,5,5,5,5,5,5,5,3,4,2,2],
            [2,2,4,3,5,5,5,5,5,5,5,5,5,5,5,5,5,5,3,4,2,2],
            [2,2,4,3,5,5,5,5,5,5,5,5,5,5,5,5,5,5,3,4,2,2],
            [2,2,4,4,4,5,5,5,5,5,5,5,5,5,5,5,5,4,4,4,2,2],
            [2,2,4,4,4,3,3,3,3,3,5,5,3,3,3,3,3,4,4,4,2,2],
            [2,2,4,4,4,4,4,4,4,4,5,5,4,4,4,4,4,4,4,4,2,2],
            [2,2,2,2,2,2,2,2,2,2,5,5,2,2,2,2,2,2,2,2,2,2],
            [2,2,2,2,2,2,2,2,2,2,5,5,2,2,2,2,2,2,2,2,2,2]
        ];
        map = MapConstructData.rotateMap(map);
        return {map:map, properties:properties};
    }

    static getBuildingThree(){
        let properties = {
            probability:10 // 1%
        };
        let map =  [
            [4,4,4,4,4,4,4,4,4],
            [4,3,3,3,3,3,3,3,4],
            [4,3,5,5,5,5,5,3,4],
            [4,3,5,4,5,4,5,3,4],
            [4,3,5,5,5,5,5,3,4],
            [4,4,3,5,5,5,3,4,4],
            [0,4,3,5,4,5,3,4,0],
            [0,4,4,5,5,5,4,4,0],
            [2,4,4,5,5,5,4,4,0]
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
