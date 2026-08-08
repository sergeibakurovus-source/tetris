import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert';

// Mock DOM and Browser APIs before importing Game
global.document = {
    getElementById: (id) => {
        return {
            style: {},
            appendChild: () => {},
            classList: {
                add: () => {},
                remove: () => {}
            },
            addEventListener: () => {},
            removeEventListener: () => {},
            textContent: ''
        };
    },
    createElement: () => {
        return {
            style: {},
            classList: {
                add: () => {},
                remove: () => {},
                contains: () => false
            },
            textContent: ''
        };
    },
    addEventListener: () => {},
    removeEventListener: () => {}
};

global.localStorage = {
    getItem: () => null,
    setItem: () => {}
};

global.requestAnimationFrame = (cb) => setTimeout(() => cb(performance.now()), 0);
global.cancelAnimationFrame = (id) => clearTimeout(id);

// Now we can import Game safely
import { Game } from '../src/js/Game.js';
import { ACTIONS } from '../src/js/constants.js';

describe('Game Business Logic', () => {
    let game;

    beforeEach(() => {
        game = new Game();
    });

    it('should initialize with correct default state', () => {
        assert.strictEqual(game.state, 'MENU');
        assert.strictEqual(game.score, 0);
        assert.strictEqual(game.level, 1);
        assert.strictEqual(game.linesClearedTotal, 0);
    });

    it('should transition state on start', () => {
        game.start();
        assert.strictEqual(game.state, 'PLAYING');
        assert.notStrictEqual(game.activePiece, null);
        assert.notStrictEqual(game.nextPieceKey, null);
    });

    it('should pause and resume correctly', () => {
        game.start();
        assert.strictEqual(game.state, 'PLAYING');
        
        game.pause();
        assert.strictEqual(game.state, 'PAUSED');
        
        game.resume();
        assert.strictEqual(game.state, 'PLAYING');
    });

    it('should move piece left on input', () => {
        game.start();
        const initialX = game.activePiece.x;
        game.handleInput(ACTIONS.LEFT);
        
        // Active piece could be near the left wall, but for most shapes startX allows moving left
        if (initialX > 0) {
            assert.strictEqual(game.activePiece.x, initialX - 1);
        }
    });

    it('should hard drop piece on DROP action', () => {
        game.start();
        const initialY = game.activePiece.y;
        game.handleInput(ACTIONS.DROP);
        
        // Piece should have moved down significantly
        assert.ok(game.activePiece.y > initialY);
    });

    it('should transition to GAMEOVER if no valid moves on spawn', () => {
        game.start();
        
        // Fill the top rows artificially
        for (let r = 0; r < 4; r++) {
            for (let i = 0; i < 10; i++) {
                game.board.grid[r][i] = 'block';
            }
        }
        
        // Attempt to spawn a piece
        game.spawnPiece();
        assert.strictEqual(game.state, 'GAMEOVER');
    });
    
    it('should update score correctly when clearing lines', () => {
        game.start();
        const initialScore = game.score;
        
        // 1 line clear logic
        game.updateScoreAndLevel(1); 
        // 40 points per line at level 1
        assert.strictEqual(game.score, initialScore + 40);
        
        game.updateScoreAndLevel(4);
        // 1200 points for 4 lines at level 1
        assert.strictEqual(game.score, initialScore + 40 + 1200);
    });
});
