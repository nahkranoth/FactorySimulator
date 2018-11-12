export class MapConstructData{

    //NOTE: All maps are drawn turned 90 degrees counterclockwise


    static getBuildingOne(){
        let map = [
            [ 3, 3, 3, 3, 3],
            [ 3,-1,-1,-1, 3],
            [ 3,-1,-1,-1, 3],
            [ 3,-1,-1,-1, 3],
            [ 3,-1,-1,-1, 3],
            [ 3,-1,-1,-1, 3],
            [ 3,-1,-1,-1, 3],
            [ 3,-1,-1,-1, 3]
        ];
        return MapConstructData.rotateMap(map);
    }

    static rotateMap(grid){
        let rotated = grid[0].map((col, i) => grid.map(row => row[i]));
        return rotated;
    }
}
