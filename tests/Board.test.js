import { describe, it } from 'node:test';
import assert from 'node:assert';
import { Board } from '../src/js/Board.js';
import { Tetromino } from '../src/js/Tetromino.js';
import { COLS, ROWS } from '../src/js/constants.js';

describe('Board Business Logic', () => {
    it('should initialize with an empty grid', () => {
        const board = new Board();
        assert.strictEqual(board.grid.length, ROWS);
        assert.strictEqual(board.grid[0].length, COLS);
        assert.strictEqual(board.grid[0][0], null);
    });

    it('should correctly validate a valid move', () => {
        const board = new Board();
        const piece = new Tetromino('I');
        
        piece.x = 0;
        piece.y = 0;
        
        const isValid = board.isValidMove(piece, piece.x, piece.y);
        assert.strictEqual(isValid, true);
    });

    it('should detect collision with walls', () => {
        const board = new Board();
        const piece = new Tetromino('I');
        
        // I shape is 4 cells wide in the 2nd row of its 4x4 matrix
        // Moving it far left should be invalid
        piece.x = -5; 
        piece.y = 0;
        
        const isValid = board.isValidMove(piece, piece.x, piece.y);
        assert.strictEqual(isValid, false);
    });

    it('should lock piece onto the grid', () => {
        const board = new Board();
        const piece = new Tetromino('O');
        
        piece.x = 0;
        piece.y = 0;
        
        board.lockPiece(piece);
        
        // O piece matrix is 2x2 at top left
        assert.strictEqual(board.grid[0][0], piece.className);
        assert.strictEqual(board.grid[0][1], piece.className);
        assert.strictEqual(board.grid[1][0], piece.className);
        assert.strictEqual(board.grid[1][1], piece.className);
        assert.strictEqual(board.grid[2][0], null); // cell below should be empty
    });

    it('should clear full lines and return the cleared lines indices', () => {
        const board = new Board();
        
        // Fill the bottom row completely
        for (let c = 0; c < COLS; c++) {
            board.grid[ROWS - 1][c] = 'block-i';
        }
        
        const linesToClear = board.getLinesToClear();
        assert.deepStrictEqual(linesToClear, [ROWS - 1]);
        
        board.clearSpecificLines(linesToClear);
        
        // Bottom row should now be empty (or whatever fell down from above, which is null)
        assert.strictEqual(board.grid[ROWS - 1][0], null);
    });
});
