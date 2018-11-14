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
        this.startSource.chunk.setTile(this.startSource.tile, 4);
    }

    moveTileSelect(event){
        if(!this.draw) return;
        let tempSource = this.map._getTileByWorldPosition(event.x, event.y);
        let tileWorldPos = this.map._getTileWorldCoord(tempSource.tile, tempSource.chunk);
        let xDiff = tileWorldPos.x - this.startPos.x;
        let yDiff = tileWorldPos.y - this.startPos.y;
        let xDirection = xDiff > 0 ? 1 : -1;
        let yDirection = yDiff > 0 ? 1 : -1;
        let width = Math.abs(xDiff);
        let height = Math.abs(yDiff);

        for(var x=0;x<width+1;x++){
            for(var y=0;y<height+1;y++) {
                let source = this.map._getTileAndChunkByCoord(this.startPos.x + (x * xDirection), this.startPos.y + (y * yDirection));
                source.chunk.setTile(source.tile, 4);
            }
        }

        console.log(xDiff);

        tempSource.chunk.setTile(tempSource.tile, 4);
    }

    stopTileSelect(event){
        let stopSource = this.map._getTileByWorldPosition(event.x, event.y);
        stopSource.chunk.setTile(stopSource.tile, 4);

        this.draw = false;
    }

}