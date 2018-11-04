export function Test(){
    return "test";
}

export class DebugRect extends Phaser.GameObjects.GameObject{

    constructor(params){
        super(params.scene, params.opt);
        this.scene = params.scene;
        this.size = params.size;
        this.camera = this.scene.cameras.main;
        let color = params.color;
        let lineColor = params.lineColor;
        let outlinesOnly = params.outlinesOnly;

        this.debugRect = this.scene.add.graphics();
        this._drawGraphic(this.debugRect, 0,0, this.size, color, lineColor, outlinesOnly);
        this.setPosition(this.camera.width/2, this.camera.height/2);
        this.setPosition(this.getPosition().x, this.getPosition().y);
    }

    getPosition(){
        return {x:this.debugRect.x + this.size/2, y:this.debugRect.y + this.size/2};
    }

    setPosition(x, y){
        this.debugRect.setX(x - this.size/2);
        this.debugRect.setY(y - this.size/2);
    }

    _drawGraphic(graphics, posX, posY, size, color, lineColor, outlinesOnly){
        if(!outlinesOnly){
            graphics.fillStyle(color, 1);
            graphics.fillRect(posX, posY, size, size);
        }

        graphics.lineStyle(3, lineColor, 1);
        graphics.strokeRect(posX, posY, size, size);
    }
}