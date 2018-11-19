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

    findPath(spriteEntity){

    }

    pathFound(val, path){
        console.log("Path Found: ", path);
        console.log("Path Found: ", val);
    }


}