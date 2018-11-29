export class Slider extends Phaser.GameObjects.Sprite{
    constructor(params){
        super(params.scene, params.x, params.y, params.key);
        this.group = typeof params.group === "undefined" ? null : params.group;
        this.callback = typeof params.callback === "undefined" ? null : params.callback;
        this.ratio = typeof params.ratio === "undefined" ? 1 : params.ratio;
        this.color = typeof params.color === "undefined" ? 0xffff00 : params.color;
        this.text = typeof params.text === "undefined" ? null : params.text;

        this.offset = 20;
        this.makeFillerGraphic(this.ratio);
        if(this.group) this.group.add(this.graphics);
        this.scene.add.existing(this);
        if(this.group) this.group.add(this);

        let txt = this.scene.add.text(this.x-(this.width/2-this.offset-6), this.y-10, this.text, {fontFamily: 'AtlantisRegular', fontSize: 22, fill: '#fff', align:'center'});

        if(this.group) this.group.add(txt);

        this.setInteractive();
        this.drag = false;

        this.on('pointerdown', this.pointerDown, this);
        this.on('pointermove', this.pointerMove, this);
        this.on('pointerout', this.pointerUp, this);
        this.on('pointerup', this.pointerUp, this);
    }

    makeFillerGraphic(ratio){
        let height = 30;
        let startPos = this.x-(this.width/2) + this.offset;
        let width = (this.width - this.offset*2) * ratio;
        if(typeof this.graphics !== "undefined") this.graphics.clear();
        this.graphics = this.scene.add.graphics();
        this.graphics.fillStyle(this.color, 1);
        this.graphics.fillRect(startPos,  this.y-(height/2), width, 30);
        this.scene.children.bringToTop(this);
    }

    show(x){
        console.log(x);
        this.makeFillerGraphic(x);
    }

    hide(){
        this.graphics.clear();
    }

    pointerDown(event){
        this.drag = true;
        this.setBarPosition(event.downX);
    }

    setBarPosition(x){
        let xPos = (x) - this.x + (this.width/2);
        let ratioX = xPos/this.width;
        this.makeFillerGraphic(ratioX);
        this.callback(ratioX);
    }

    pointerMove(event){
        if(this.drag){
            this.setBarPosition(event.position.x);
        }
    }

    pointerUp(){
        this.drag = false;
    }

    update() {

    }
}