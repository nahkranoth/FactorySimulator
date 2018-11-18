import {MapConstructData} from "../data/mapConstructData.js"

export class BuildInteractionController{
    constructor(params){
        this.scene = params.scene;
        this.gui = params.gui;
        this.map = params.map;
        this.init();
    }

    init(){
        this.draw = false;

        this.callbackMode = {
            "place":{"pointerdown": this.startTilePlace, "pointermove":this.moveTilePlace, "pointerup":this.stopTilePlace},
            "select":{"pointerdown": this.startTileSelect, "pointermove":this.moveTileSelect, "pointerup":this.stopTileSelect},
            "fill":{"pointerdown": this.startTileFill, "pointermove":this.moveTileFill, "pointerup":this.stopTileFill}
        };

        this.setBuildMode("place");

        this.scene.input.keyboard.on('keydown_Z', () => this.setBuildMode("place"));
        this.scene.input.keyboard.on('keydown_X', () => this.setBuildMode("select"));
        this.scene.input.keyboard.on('keydown_C', () => this.setBuildMode("fill"));
    }

    setBuildMode(mode){
        this.scene.input.removeListener("pointerdown");
        this.scene.input.removeListener("pointermove");
        this.scene.input.removeListener("pointerup");

        this.scene.input.on('pointerdown', this.callbackMode[mode].pointerdown, this);
        this.scene.input.on('pointermove', this.callbackMode[mode].pointermove, this);
        this.scene.input.on('pointerup', this.callbackMode[mode].pointerup, this);
    }

    startTilePlace(event){
        this.draw = true;
        let pointerPos = this.map.chunkController._getWorldPositionFromPointerPosition(event.x, event.y);
        let source = this.map.chunkController._getTileByWorldPosition(pointerPos.x, pointerPos.y);
        source.chunk.setTile(source.tile, this.gui.indexSelected);
        source.chunk.resetCollision();
    }

    moveTilePlace(event){
        if(!this.draw) return;
        let pointerPos = this.map.chunkController._getWorldPositionFromPointerPosition(event.x, event.y);
        let source = this.map.chunkController._getTileByWorldPosition(pointerPos.x, pointerPos.y);
        source.chunk.setTile(source.tile, this.gui.indexSelected);
        source.chunk.resetCollision();
    }

    stopTilePlace(){
        this.draw = false;
    }

    startTileSelect(event){
        this.draw = true;
        let pointerPos = this.map.chunkController._getWorldPositionFromPointerPosition(event.x, event.y);
        this.startSource = this.map.chunkController._getTileByWorldPosition(pointerPos.x, pointerPos.y);
        this.startPos = this.map.chunkController._getTileWorldCoord(this.startSource.tile, this.startSource.chunk);
    }

    moveTileSelect(event){
        //if(!this.draw) return;
    }

    stopTileSelect(event){
        let pointerPos = this.map.chunkController._getWorldPositionFromPointerPosition(event.x, event.y);
        let stopSource = this.map.chunkController._getTileByWorldPosition(pointerPos.x, pointerPos.y);
        let tileWorldPos = this.map.chunkController._getTileWorldCoord(stopSource.tile, stopSource.chunk);
        var range = this._getTileSelectionRangeAndDirection(this.startPos, tileWorldPos);
        let outArr = [];

        for(var x=0;x<range.width+1;x++){
            outArr.push([]);
            for(var y=0;y<range.height+1;y++) {
                let source = this.map.chunkController._getTileAndChunkByCoord(this.startPos.x + (x * range.xDirection), this.startPos.y + (y * range.yDirection));
                outArr[x].push(source.tile.index);
            }
        }

        console.log(MapConstructData.mapDataToString(outArr));
        this.draw = false;
    }

    startTileFill(event){
        this.draw = true;
        let pointerPos = this.map.chunkController._getWorldPositionFromPointerPosition(event.x, event.y);
        this.startSource = this.map.chunkController._getTileByWorldPosition(pointerPos.x, pointerPos.y);
        this.startPos = this.map.chunkController._getTileWorldCoord(this.startSource.tile, this.startSource.chunk);
    }

    moveTileFill(event){
        //if(!this.draw) return;
    }

    stopTileFill(event){
        let pointerPos = this.map.chunkController._getWorldPositionFromPointerPosition(event.x, event.y);
        let stopSource = this.map.chunkController._getTileByWorldPosition(pointerPos.x, pointerPos.y);
        let tileWorldPos = this.map.chunkController._getTileWorldCoord(stopSource.tile, stopSource.chunk);
        var range = this._getTileSelectionRangeAndDirection(this.startPos, tileWorldPos);
        let outArr = [];

        for(var x=0;x<range.width+1;x++){
            for(var y=0;y<range.height+1;y++) {
                let source = this.map.chunkController._getTileAndChunkByCoord(this.startPos.x + (x * range.xDirection), this.startPos.y + (y * range.yDirection));
                source.chunk.setTile(source.tile, this.gui.indexSelected);
                source.chunk.resetCollision();
            }
        }
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