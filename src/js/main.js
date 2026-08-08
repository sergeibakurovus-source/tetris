import { Game } from './Game.js';

document.addEventListener('DOMContentLoaded', () => {
    const game = new Game();
    game.ui.render(game.board.grid, null);
    game.ui.toggleOverlay(true, 'African Tetris', 'Start Game');
});
