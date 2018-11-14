export class MapBuildController{
    constructor(params){
        this.scene = params.scene;
        this.gui = params.gui;
        this.map = params.map;
        this.init();
    }

    init(){
        let callbackMode = {};

        this.draw = false;
        this.scene.input.on('pointerdown', this.startPlaceTile, this);
        this.scene.input.on('pointermove', this.movePlaceTile, this);
        this.scene.input.on('pointerup', this.stopPlaceTile, this);
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

    placeTile(){

    }
}