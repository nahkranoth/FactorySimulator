export class GameController extends Phaser.Events.EventEmitter {
    constructor(params) {
        super(params);
        if (GameController.instance === null) {
            GameController.instance = this;
            console.log("set Instance");
        } else {
            console.warn("Instance allready exists");
        }
    }

    static reset() {
        GameController.score = 0;
        GameController.mana = 100;
        GameController.health = 100;
    }

    static addScore(points) {
        GameController.score += points;
        GameController.instance.emit("AddScore", points);
    }

    static addMana(mana) {
        GameController.mana += mana;
        GameController.mana = Phaser.Math.Clamp(GameController.mana, 0, 100);
        GameController.instance.emit("AddMana", mana);
    }

    static addHealth(health) {
        GameController.health += health;
        GameController.health = Phaser.Math.Clamp(GameController.health, 0, 100);
        GameController.instance.emit("AddHealth", health);
    }
}

GameController.score = 0;
GameController.mana = 100;
GameController.health = 100;
GameController.instance = null;
