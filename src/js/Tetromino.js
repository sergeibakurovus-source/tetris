import { SHAPES, COLS } from './constants.js';

export class Tetromino {
    constructor(shapeKey) {
        this.shapeKey = shapeKey;
        const shape = SHAPES[shapeKey];
        this.matrix = shape.matrix.map(row => [...row]);
        this.className = shape.className;
        
        this.x = Math.floor(COLS / 2) - Math.floor(this.matrix[0].length / 2);
        this.y = 0;
    }

    rotate() {
        const N = this.matrix.length;
        const rotated = [];
        for (let i = 0; i < N; i++) {
            rotated[i] = [];
            for (let j = 0; j < N; j++) {
                rotated[i][j] = this.matrix[N - j - 1][i];
            }
        }
        return rotated;
    }

    moveDown() {
        this.y += 1;
    }

    moveLeft() {
        this.x -= 1;
    }

    moveRight() {
        this.x += 1;
    }
}
