import { COLS, ROWS } from './constants.js';

export class Board {
    constructor() {
        this.grid = this.getEmptyGrid();
    }

    getEmptyGrid() {
        return Array.from({ length: ROWS }, () => Array(COLS).fill(null));
    }

    reset() {
        this.grid = this.getEmptyGrid();
    }

    isValidMove(piece, nextX, nextY, nextMatrix = piece.matrix) {
        for (let r = 0; r < nextMatrix.length; r++) {
            for (let c = 0; c < nextMatrix[r].length; c++) {
                if (nextMatrix[r][c] !== 0) {
                    const newY = nextY + r;
                    const newX = nextX + c;

                    if (newX < 0 || newX >= COLS || newY >= ROWS) {
                        return false;
                    }

                    if (newY >= 0 && this.grid[newY][newX] !== null) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    lockPiece(piece) {
        for (let r = 0; r < piece.matrix.length; r++) {
            for (let c = 0; c < piece.matrix[r].length; c++) {
                if (piece.matrix[r][c] !== 0) {
                    const boardY = piece.y + r;
                    const boardX = piece.x + c;
                    if (boardY >= 0 && boardY < ROWS && boardX >= 0 && boardX < COLS) {
                        this.grid[boardY][boardX] = piece.className;
                    }
                }
            }
        }
    }

    getLinesToClear() {
        let lines = [];
        for (let r = ROWS - 1; r >= 0; r--) {
            if (this.grid[r].every(cell => cell !== null)) {
                lines.push(r);
            }
        }
        return lines;
    }

    clearSpecificLines(lines) {
        for (let r of lines) {
            this.grid.splice(r, 1);
        }
        for (let i = 0; i < lines.length; i++) {
            this.grid.unshift(Array(COLS).fill(null));
        }
    }
}
