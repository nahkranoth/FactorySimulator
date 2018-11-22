import {ControllerBaseClass} from "../core/controllerBaseClass";
import {js as EasyStar} from "easystarjs";
import {_} from "underscore";

export class PathFindingController extends ControllerBaseClass {

    constructor(params){
        super(params);
        this.scene = params.scene;
        this.map = params.map;
        this.chunkController = null;
        this.easyStar = new EasyStar();
    }

    afterInit(chunkController){
        this.chunkController = chunkController;

        var grid = [
            [0,0,1,0,0],
            [0,0,1,0,0],
            [0,0,1,0,0],
            [0,0,1,0,0],
            [0,0,0,0,0]];

        this.easyStar.setGrid(grid);
        this.easyStar.setAcceptableTiles([0]);
        this.easyStar.findPath(0, 0, 3, 3, _.bind(this.pathFound, this, "test"));
        this.easyStar.calculate();
    }

    findPath(startX, startY, stopX, stopY){
        let startChunk = this.map.chunkController.getChunkAndTileByWorldPosition(startX, startY);
        let stopChunk = this.map.chunkController.getChunkAndTileByWorldPosition(stopX, stopY);
        console.log(startChunk);
        console.log(stopChunk);

    }

    pathFound(val, path){
        console.log("Path Found: ", path);
        console.log("Path Found: ", val);
    }


    concat2DArrays(){
        let arr1 = [
            [0,0,0,0],
            [0,1,1,0],
            [0,1,1,0],
            [0,1,1,0],
            [0,0,0,0]
        ];
        //
        // let arr1XCoord = 0;
        // let arr1YCoord = 0;

        let arr2 = [
            [1,1,1,1],
            [1,0,0,1],
            [1,0,0,1],
            [1,0,0,1],
            [1,1,1,1]
        ];

        let arr3 = [
            [2,2,2,2],
            [2,1,1,2],
            [2,1,1,2],
            [2,1,1,2],
            [2,2,2,2]
        ];
        //
        // let arr1XCoord = 0;
        // let arr1YCoord = 0;

        let arr4 = [
            [3,3,3,3],
            [3,0,0,3],
            [3,0,0,3],
            [3,0,0,3],
            [3,3,3,3]
        ];

        let result = this.concat2DArrayHorizontal(arr1, arr2, false);
        result = this.concat2DArrayHorizontal(result, arr3, false);
        result = this.concat2DArrayVertical(result, arr2);
        result = this.concat2DArrayVertical(result, arr4);
        console.log(result);
    }

    concat2DArrayVertical(arr1, arr2, prepend){

        if(prepend){
            let tmp = arr2;
            arr2 = arr1;
            arr1 = tmp;
        }
        let arr1Length = arr1.length;
        let outArr = arr1;
        for(let y=0;y<arr2.length;y++){
            outArr.push([]);
            for(let x=0;x<arr2[y].length;x++){
                outArr[y+arr1Length].push(arr2[y][x]);
            }
        }
        return outArr;
    }

    concat2DArrayHorizontal(arr1, arr2, prepend){

        if(prepend){
            let tmp = arr2;
            arr2 = arr1;
            arr1 = tmp;
        }

        let outArr = arr1;
        for(let y=0;y<arr1.length;y++){
            for(let x=0;x<arr2[y].length;x++){
                outArr[y].push(arr2[y][x]);
            }
        }
        return outArr;
    }


}