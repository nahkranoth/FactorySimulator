import {MapConstructData} from "../data/mapConstructData.js"

export class MapBuildController{
    constructor(params){
        this.scene = params.scene;
        this.gui = params.gui;
        this.map = params.map;
        this.init();
    }

    init(){
        this.draw = false;

        this.callbackMode = {
            "place":{"pointerdown": this.startPlaceTile, "pointermove":this.movePlaceTile, "pointerup":this.stopPlaceTile},
            "select":{"pointerdown": this.startTileSelect, "pointermove":this.moveTileSelect, "pointerup":this.stopTileSelect}
        };

        this.setBuildMode("place");
    }

    setBuildMode(mode){
        this.scene.input.removeListener("pointerdown");
        this.scene.input.removeListener("pointermove");
        this.scene.input.removeListener("pointerup");

        this.scene.input.on('pointerdown', this.callbackMode[mode].pointerdown, this);
        this.scene.input.on('pointermove', this.callbackMode[mode].pointermove, this);
        this.scene.input.on('pointerup', this.callbackMode[mode].pointerup, this);
    }

    startPlaceTile(){
        this.draw = true;
    }

    movePlaceTile(event){
        if(!this.draw) return;
        var source = this.map._getTileByWorldPosition(event.x, event.y);
        source.chunk.setTile(source.tile, this.gui.indexSelected);
        source.chunk.resetCollision();
    }

    stopPlaceTile(){
        this.draw = false;
    }

    startTileSelect(event){
        this.draw = true;
        this.startSource = this.map._getTileByWorldPosition(event.x, event.y);
        this.startPos = this.map._getTileWorldCoord(this.startSource.tile, this.startSource.chunk);
        //this.startSource.chunk.setTile(this.startSource.tile, 4);
    }

    moveTileSelect(event){
        if(!this.draw) return;
        //let tempSource = this.map._getTileByWorldPosition(event.x, event.y);
    }

    stopTileSelect(event){
        let stopSource = this.map._getTileByWorldPosition(event.x, event.y);
        let tileWorldPos = this.map._getTileWorldCoord(stopSource.tile, stopSource.chunk);

        var range = this._getTileSelectionRangeAndDirection(this.startPos, tileWorldPos);

        let outArr = [];

        for(var x=0;x<range.width+1;x++){
            outArr.push([]);
            for(var y=0;y<range.height+1;y++) {
                let source = this.map._getTileAndChunkByCoord(this.startPos.x + (x * range.xDirection), this.startPos.y + (y * range.yDirection));
                outArr[x].push(source.tile.index);
                //source.chunk.setTile(source.tile, 4);
            }
        }
        console.log(MapConstructData.mapDataToString(outArr));
        this.draw = false;
    }

    _getTileSelectionRangeAndDirection(startPos, endPos){
        let _xDiff = endPos.x - startPos.x;
        let _yDiff = endPos.y - startPos.y;
        let xDirection = _xDiff > 0 ? 1 : -1;
        let yDirection = _yDiff > 0 ? 1 : -1;
        let width = Math.abs(_xDiff);
        let height = Math.abs(_yDiff);
        return {width:width, height:height, xDirection:xDirection, yDirection:yDirection};
    }

}