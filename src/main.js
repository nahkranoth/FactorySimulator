import './styling/main.css';

import 'phaser';

import { Game } from './scenes/game';
import { Preloader } from './scenes/preloader';

const gameConfig = {
    type: Phaser.AUTO,
    width: 1024,
    height: 768,
    scene: [Preloader, Game]

};

new Phaser.Game(gameConfig);
