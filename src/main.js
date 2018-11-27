import './styling/main.css';

import 'phaser';

import { Game } from "./scenes/game";
import { Preloader } from './scenes/preloader';
import { GUI } from './scenes/gui';

const gameConfig = {
    type: Phaser.AUTO,
    width: 1024,
    height: 768,
    scene: [Preloader, Game, GUI],
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 0 } , debug: true}
    }

};

new Phaser.Game(gameConfig);
