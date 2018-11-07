import './styling/main.css';

import 'phaser';

import { Game } from './scenes/game';
import { Preloader } from './scenes/preloader';

const gameConfig = {
    type: Phaser.AUTO,
    width: 1024,
    height: 768,
    scene: [Preloader, Game],
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 300 } }
    }

};

new Phaser.Game(gameConfig);
