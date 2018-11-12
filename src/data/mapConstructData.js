export class MapConstructData{
    //NOTE: All maps turned counterClockwise on return because of easier placement.
    static getBuildingOne(){

        let properties = {
            probability:1
        };

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

        map = MapConstructData.rotateMap(map);

        return {map:map, properties:properties};
    }

    static rotateMap(grid){
        let rotated = grid[0].map((col, i) => grid.map(row => row[i]));
        return rotated;
    }
}
