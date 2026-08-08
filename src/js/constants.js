export const COLS = 10;
export const ROWS = 20;
export const GAME_SPEED_START = 1000;
export const SPEED_INCREMENT = 50;
export const MIN_SPEED = 100;

export const SHAPES = {
    I: {
        matrix: [
            [0, 0, 0, 0],
            [1, 1, 1, 1],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ],
        className: 'block-i'
    },
    J: {
        matrix: [
            [1, 0, 0],
            [1, 1, 1],
            [0, 0, 0]
        ],
        className: 'block-j'
    },
    L: {
        matrix: [
            [0, 0, 1],
            [1, 1, 1],
            [0, 0, 0]
        ],
        className: 'block-l'
    },
    O: {
        matrix: [
            [1, 1],
            [1, 1]
        ],
        className: 'block-o'
    },
    S: {
        matrix: [
            [0, 1, 1],
            [1, 1, 0],
            [0, 0, 0]
        ],
        className: 'block-s'
    },
    T: {
        matrix: [
            [0, 1, 0],
            [1, 1, 1],
            [0, 0, 0]
        ],
        className: 'block-t'
    },
    Z: {
        matrix: [
            [1, 1, 0],
            [0, 1, 1],
            [0, 0, 0]
        ],
        className: 'block-z'
    }
};

export const ACTIONS = {
    LEFT: 'LEFT',
    RIGHT: 'RIGHT',
    DOWN: 'DOWN',
    ROTATE: 'ROTATE',
    DROP: 'DROP',
    PAUSE: 'PAUSE'
};
