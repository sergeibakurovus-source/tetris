import { describe, it } from 'node:test';
import assert from 'node:assert';
import { Tetromino } from '../src/js/Tetromino.js';
import { SHAPES } from '../src/js/constants.js';

describe('Tetromino Business Logic', () => {
    it('should initialize with correct shape and starting position', () => {
        const piece = new Tetromino('T');
        
        assert.deepStrictEqual(piece.matrix, SHAPES['T'].matrix);
        assert.strictEqual(piece.className, SHAPES['T'].className);
        
        // Initial y should be 0
        assert.strictEqual(piece.y, 0);
    });

    it('should rotate matrix correctly (90 degrees clockwise)', () => {
        const piece = new Tetromino('T');
        // Initial T matrix:
        // [0, 1, 0]
        // [1, 1, 1]
        // [0, 0, 0]
        
        const rotated = piece.rotate();
        
        // Expected after 1 rotation:
        // [0, 1, 0]
        // [0, 1, 1]
        // [0, 1, 0]
        const expected = [
            [0, 1, 0],
            [0, 1, 1],
            [0, 1, 0]
        ];
        
        assert.deepStrictEqual(rotated, expected);
    });

    it('should update coordinates on move commands', () => {
        const piece = new Tetromino('I');
        const startX = piece.x;
        const startY = piece.y;
        
        piece.moveDown();
        assert.strictEqual(piece.y, startY + 1);
        
        piece.moveLeft();
        assert.strictEqual(piece.x, startX - 1);
        
        piece.moveRight();
        assert.strictEqual(piece.x, startX);
    });
});
