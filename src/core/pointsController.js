export class PointsController extends Phaser.Events.EventEmitter{
    constructor(params){
        super(params);
        if(PointsController.instance === null){
            PointsController.instance = this;
            console.log("set Instance");
        }else{
            console.warn("Instance allready exists");
        }


    }

    static addScore(points){
        PointsController.score += points;
        PointsController.instance.emit("AddScore", points);
    }
}

PointsController.score = 0;
PointsController.instance = null;