import {RandomGenerator} from "../utils/randomGenerator"
import {TileData} from "../data/tileData"
import {_} from "underscore"
import {GameController} from "../core/gameController"
import {FireBall} from "../objects/fireball";
import {StepCounter} from "../utils/stepcounter";


export class ChunkGenerator {
    constructor(params) {
        this.scene = params.scene;
        this.chunkWidth = params.chunkWidth;
        this.chunkHeight = params.chunkHeight;
        this.xCoord = params.xCoord;
        this.yCoord = params.yCoord;
        this.tileMap = params.tileMap;
        this.layer = params.layer;
        this.chunk = params.chunk;
        this.playerHurtStepCounter = new StepCounter({step:50, callback:this.playerHurt, scope:this});

        this.init();
    }

    init() {
        this.generatePerlinMap(1, 0.3);//generate trees
        this.generatePerlinMap(2, 0.08);//generate lakes
        this.generatePerlinMap(4, 0.3, 0.9);//generate rocks
        this.setTileCollisions();
    }

    setTileCollisions(){
        let list = this.scene.fireBalls.slice();
        list.push(this.scene.player);
        this.scene.physics.add.collider(list, this.layer, _.bind(this.onCollision, this));
    }

    onCollision(collider){
        if(collider instanceof FireBall){
            this.scene.sound.playAudioSprite('sfx', "bounce",{volume: (this.scene.fxVolumeLevel/100)});
        }
    }

    clear() {
        this.layer.forEachTile((tile) => {
            this.setTile(tile, 0);
        });
        this.layer.setCollision(0, false);
    }

    //Convert chunk position to axis.
    // Doing this to feed into the perlin generator else it would be 4 ways symetric.
    _convertToAxis(x, y) {
        if (x != 0) x = x > 0 ? 1 : -1;
        if (y != 0) y = y > 0 ? 1 : -1;
        return x + y + 2;//add 2 to make it absolute
    }

    _getRandom(x, y, modifier, octave) {
        let xOffset = Math.abs(x + (this.chunkWidth * this.xCoord));
        let yOffset = Math.abs(y + (this.chunkHeight * this.yCoord));
        let axis = this._convertToAxis(this.xCoord, this.yCoord);
        if (octave) {
            return Math.abs(Math.round(RandomGenerator.generatePerlin3Octave(octave, xOffset * modifier, yOffset * modifier, axis)));
        }
        return Math.abs(Math.round(RandomGenerator.generatePerlin3(xOffset * modifier, yOffset * modifier, axis)));
    }

    playerHurt(){
        GameController.addHealth(-1);
        this.scene.cameras.main.shake(150, 0.01);
        this.scene.sound.playAudioSprite('sfx', "player_hurt", {volume: (this.scene.fxVolumeLevel/100)});
    }

    setTile(tile, index) {
        tile.index = index;
        let data = TileData.getTileData(index);
        tile.properties.collision = data.collision;
        tile.properties.points = data.points;
        if (data.collision) {
            tile.setCollisionCallback(
                (collision) => {
                    if (collision === this.scene.player) return;
                    if (data.points) GameController.addScore(data.points);
                    this.scene.map.flagTileForCollisionChange(tile, this);
                });
        } else {
            tile.setCollisionCallback(
                (collision, me) => {
                    if (collision === this.scene.player && me.index === 6){
                        this.playerHurtStepCounter.tick();
                    }

                    if (collision === this.scene.player) return;
                    if (data.points) GameController.addScore(data.points);
                    tile.index = 6;
                    //tile.setCollisionCallback(null);
                    //this.scene.map.flagTileForCollisionChange(tile, this);
                });
        }
    }

    generatePerlinMap(index, modifier, octave) {
        for (let y = 0; y < this.chunkHeight; y++) {
            for (let x = 0; x < this.chunkWidth; x++) {
                let tile = this.tileMap.getTileAt(x, y);
                let i = this._getRandom(x, y, modifier, octave) ? index : tile.index;
                this.setTile(tile, i);
            }
        }
        this.resetCollision();
    }

    resetCollision() {
        this.layer.setCollisionByProperty({collision: true});
        this.layer.setCollisionByProperty({collision: false}, false);
    }

}
