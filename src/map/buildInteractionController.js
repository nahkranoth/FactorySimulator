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
            "fill":{"pointerdown": this.startTileFill, "pointermove":this.moveTileFill, "pointerup":this.stopTileFill},
            "bucket":{"pointerdown": this.startBucketPlace, "pointermove":this.moveBucketPlace, "pointerup":this.stopBucketPlace}
        };

        this.setBuildMode("place");

        this.scene.input.keyboard.on('keydown_Z', () => this.setBuildMode("place"));
        this.scene.input.keyboard.on('keydown_X', () => this.setBuildMode("select"));
        this.scene.input.keyboard.on('keydown_C', () => this.setBuildMode("fill"));
        this.scene.input.keyboard.on('keydown_V', () => this.setBuildMode("bucket"));
    }

    setBuildMode(mode){
        this.scene.input.removeListener("pointerdown");
        this.scene.input.removeListener("pointermove");
        this.scene.input.removeListener("pointerup");

        this.scene.input.on('pointerdown', this.callbackMode[mode].pointerdown, this);
        this.scene.input.on('pointermove', (event) => {this.pointerMove(event, mode)}, this);
        this.scene.input.on('pointerup', this.callbackMode[mode].pointerup, this);
    }

    pointerMove(event, mode){
        this.callbackMode[mode].pointermove(event);
    }

    startBucketPlace(event){
        this.draw = true;
        let pointerPos = this.map.chunkController._getWorldPositionFromPointerPosition(event.x, event.y);
        let source = this.map.chunkController.getChunkAndTileByWorldPosition(pointerPos.x, pointerPos.y);
        source.chunk.setTile(source.tile, 16);
        let sources = [source];
        let running = true;
        while(running){
            let neighbourSources = [];
            for(let j = 0;j<sources.length;j++){
                let sourceTile = sources[j];
                let validNeighbours = this.checkNeighbours(this.map.chunkController._getTileWorldCoord(sourceTile.tile, sourceTile.chunk), 2);
                if(validNeighbours.length === 0) continue;
                for(let i=0;i<validNeighbours.length;i++){
                    let neighbour = validNeighbours[i];
                    neighbour.chunk.setTile(neighbour.tile, 16);
                    neighbourSources.push(neighbour);
                }
            }
            if(neighbourSources.length === 0) return false;
            sources = neighbourSources;
        }

        source.chunk.resetCollision();
    }

    checkNeighbours(pos, index){
        let n = {x:pos.x, y:pos.y-1};
        let ne = {x:pos.x+1, y:pos.y-1};
        let nw = {x:pos.x-1, y:pos.y-1};
        let s = {x:pos.x, y:pos.y+1};
        let sw = {x:pos.x-1, y:pos.y+1};
        let se = {x:pos.x+1, y:pos.y+1};
        let e = {x:pos.x+1, y:pos.y};
        let w = {x:pos.x-1, y:pos.y};

        let nTile = this.map.chunkController._getTileAndChunkByCoord(n.x, n.y);
        let neTile = this.map.chunkController._getTileAndChunkByCoord(ne.x, ne.y);
        let nwTile = this.map.chunkController._getTileAndChunkByCoord(nw.x, nw.y);
        let sTile = this.map.chunkController._getTileAndChunkByCoord(s.x, s.y);
        let seTile = this.map.chunkController._getTileAndChunkByCoord(se.x, se.y);
        let swTile = this.map.chunkController._getTileAndChunkByCoord(sw.x, sw.y);
        let eTile = this.map.chunkController._getTileAndChunkByCoord(e.x, e.y);
        let wTile = this.map.chunkController._getTileAndChunkByCoord(w.x, w.y);

        let matchingSources = [];
        if(nTile.tile.index === index) matchingSources.push(nTile);
        if(neTile.tile.index === index) matchingSources.push(neTile);
        if(nwTile.tile.index === index) matchingSources.push(nwTile);
        if(sTile.tile.index === index) matchingSources.push(sTile);
        if(seTile.tile.index === index) matchingSources.push(seTile);
        if(swTile.tile.index === index) matchingSources.push(swTile);
        if(eTile.tile.index === index) matchingSources.push(eTile);
        if(wTile.tile.index === index) matchingSources.push(wTile);

        return matchingSources;
    }

    moveBucketPlace(event){

    }

    stopBucketPlace(){
        this.draw = false;
    }

    startTilePlace(event){
        this.draw = true;
        let pointerPos = this.map.chunkController._getWorldPositionFromPointerPosition(event.x, event.y);
        let source = this.map.chunkController.getChunkAndTileByWorldPosition(pointerPos.x, pointerPos.y);
        source.chunk.setTile(source.tile, this.gui.indexSelected);
        source.chunk.resetCollision();
    }

    moveTilePlace(event){
        if(!this.draw) return;
        let pointerPos = this.map.chunkController._getWorldPositionFromPointerPosition(event.x, event.y);
        let source = this.map.chunkController.getChunkAndTileByWorldPosition(pointerPos.x, pointerPos.y);
        source.chunk.setTile(source.tile, this.gui.indexSelected);
        source.chunk.resetCollision();
    }

    stopTilePlace(){
        this.draw = false;
    }

    startTileSelect(event){
        this.draw = true;
        let pointerPos = this.map.chunkController._getWorldPositionFromPointerPosition(event.x, event.y);
        this.startSource = this.map.chunkController.getChunkAndTileByWorldPosition(pointerPos.x, pointerPos.y);
        this.startPos = this.map.chunkController._getTileWorldCoord(this.startSource.tile, this.startSource.chunk);
    }

    moveTileSelect(event){
        //if(!this.draw) return;
    }

    stopTileSelect(event){
        let pointerPos = this.map.chunkController._getWorldPositionFromPointerPosition(event.x, event.y);
        let stopSource = this.map.chunkController.getChunkAndTileByWorldPosition(pointerPos.x, pointerPos.y);
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
        this.startSource = this.map.chunkController.getChunkAndTileByWorldPosition(pointerPos.x, pointerPos.y);
        this.startPos = this.map.chunkController._getTileWorldCoord(this.startSource.tile, this.startSource.chunk);
    }

    moveTileFill(event){
        //if(!this.draw) return;
    }

    stopTileFill(event){
        let pointerPos = this.map.chunkController._getWorldPositionFromPointerPosition(event.x, event.y);
        let stopSource = this.map.chunkController.getChunkAndTileByWorldPosition(pointerPos.x, pointerPos.y);
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