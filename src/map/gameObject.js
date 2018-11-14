export class GameObject extends Phaser.GameObjects.GameObject{
    constructor(params){
        super(params.scene, params.opt);

        //order matters
        this._initTransform(params.position, params.size, params.rotation, params.pivot);
        this._group = this.scene.add.group();
        //defined here to be used as a shape for setInteractive
        this.boundRect = new Phaser.Geom.Rectangle(this._getTranslatedPositionX(), this._getTranslatedPositionY(), this._transform.size.w, this._transform.size.h);

        this.init();
        this._ownAfterInit();
    }

    init(){
        //override in extension
    }

    get x(){
        return this._transform.position.x;
    }

    set x(val){
        this._transform.position.x = val;
        this._resetPosition();
    }

    get y(){
        return this._transform.position.y;
    }

    set y(val){
        this._transform.position.y = val;
        this._resetPosition();
    }

    get rotation(){
         return this._transform.rotation;
    }

    set rotation(val){
        this._transform.rotation = val;
        this._resetRotation();
    }

    _ownAfterInit(){
        if(DEBUG){
            this._drawDebugBox();
        }
        this._resetPosition();
        this._resetRotation();
    }

    _resetPosition(){
        Phaser.Actions.SetX(this._group.getChildren(), this._transform.position.x);
        Phaser.Actions.SetY(this._group.getChildren(), this._transform.position.y);
    }

    _resetRotation(){
        console.log(this._transform.rotation);
        Phaser.Actions.Rotate(this._group.getChildren(), this._transform.rotation);
        this._transform.rotation = 0;
        //Phaser.Actions.RotateAround(this._group.getChildren(), {x:this._transform.position.x+this._getTranslatedPositionX(), y:this._transform.position.y+this._getTranslatedPositionX()}, this._transform.rotation);
    }

    _initTransform(position, size, rotation, pivot){
        this._transform = {
            position : {x:0, y:0},
            size : {w:0, h:0},
            rotation: 0,
            pivot: {x:0.5, y:0.5}
        };

        this._transform.size = size ? size : this._transform.size;
        this._transform.pivot = pivot ? pivot : this._transform.pivot;
        this._transform.position = position ? position : this._transform.position;
        this._transform.rotation = rotation ? rotation : this._transform.rotation;

    }

    //getTranslatedPosition is only used for setting the graphics within the group or after the pivot or size is changed. After that is done, never use getPosition to
    //request a position.
    _getTranslatedPositionX(){
        return -(this._transform.pivot.x * this._transform.size.w);
    }

    _getTranslatedPositionY(){
        return -(this._transform.pivot.y * this._transform.size.w);
    }

    addSprite(key){
        let sprite = this.scene.add.sprite(0,0, key);
        this._group.add(sprite);
    }

    _drawDebugBox(){
        let graphics = this.scene.add.graphics({ fillStyle: { color: 0x0000ff } });
        graphics.fillRectShape(this.boundRect);
        this._group.add(graphics);
    }
}