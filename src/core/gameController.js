export class GameController extends Phaser.Events.EventEmitter{
    constructor(params){
        super(params);
        if(GameController.instance === null){
            GameController.instance = this;
            console.log("set Instance");
        }else{
            console.warn("Instance allready exists");
        }


    }

    static addScore(points){
        GameController.score += points;
        GameController.instance.emit("AddScore", points);
    }

    static addMana(mana){
        GameController.mana += mana;
    }
}

GameController.score = 0;
GameController.mana = 100;
GameController.instance = null;