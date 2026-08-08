import { Board } from './Board.js';
import { Tetromino } from './Tetromino.js';
import { InputManager } from './InputManager.js';
import { UIManager } from './UIManager.js';
import { Storage } from './Storage.js';
import { ACTIONS, SHAPES, GAME_SPEED_START, MIN_SPEED, SPEED_INCREMENT } from './constants.js';

export class Game {
    constructor() {
        this.board = new Board();
        this.ui = new UIManager();
        this.storage = new Storage();
        this.input = new InputManager(this.handleInput.bind(this));
        
        this.state = 'MENU';
        
        this.score = 0;
        this.level = 1;
        this.linesClearedTotal = 0;
        
        this.activePiece = null;
        this.nextPieceKey = null;
        
        this.dropInterval = GAME_SPEED_START;
        this.lastTime = 0;
        this.dropCounter = 0;
        this.animationId = null;

        this.isAnimating = false;

        this.ui.overlayBtn.addEventListener('click', () => {
            if (this.state === 'MENU' || this.state === 'GAMEOVER') {
                this.start();
            } else if (this.state === 'PAUSED') {
                this.resume();
            }
        });
        
        this.updateScoreUI();
        this.ui.renderLeaderboard(this.storage.getLeaderboard());
    }

    getRandomPieceKey() {
        const keys = Object.keys(SHAPES);
        return keys[Math.floor(Math.random() * keys.length)];
    }

    spawnPiece() {
        if (!this.nextPieceKey) {
            this.nextPieceKey = this.getRandomPieceKey();
        }
        
        this.activePiece = new Tetromino(this.nextPieceKey);
        this.nextPieceKey = this.getRandomPieceKey();
        
        this.ui.renderNextPiece(this.nextPieceKey, SHAPES);
        
        if (!this.board.isValidMove(this.activePiece, this.activePiece.x, this.activePiece.y)) {
            this.gameOver();
        }
    }

    start() {
        this.board.reset();
        this.score = 0;
        this.level = 1;
        this.linesClearedTotal = 0;
        this.dropInterval = GAME_SPEED_START;
        this.state = 'PLAYING';
        this.isAnimating = false;
        this.nextPieceKey = null;
        
        this.spawnPiece();
        this.updateScoreUI();
        
        this.ui.toggleOverlay(false);
        this.input.bindKeys();
        
        this.lastTime = performance.now();
        this.dropCounter = 0;
        
        if (this.animationId) cancelAnimationFrame(this.animationId);
        this.animationId = requestAnimationFrame(this.update.bind(this));
    }

    pause() {
        if (this.state === 'PLAYING') {
            this.state = 'PAUSED';
            cancelAnimationFrame(this.animationId);
            this.ui.toggleOverlay(true, 'Paused', 'Resume');
        }
    }

    resume() {
        if (this.state === 'PAUSED') {
            this.state = 'PLAYING';
            this.ui.toggleOverlay(false);
            this.lastTime = performance.now();
            this.animationId = requestAnimationFrame(this.update.bind(this));
        }
    }

    gameOver() {
        this.state = 'GAMEOVER';
        cancelAnimationFrame(this.animationId);
        this.input.unbindKeys();
        
        this.storage.saveHighScore(this.score);
        this.storage.saveToLeaderboard(this.score);
        this.updateScoreUI();
        this.ui.renderLeaderboard(this.storage.getLeaderboard());
        
        this.ui.toggleOverlay(true, 'Game Over!', 'Play Again');
    }

    updateScoreUI() {
        this.ui.updateScore(this.score, this.storage.getHighScore(), this.level);
    }

    async handleInput(action) {
        if (this.state !== 'PLAYING' || this.isAnimating) {
            if (action === ACTIONS.PAUSE) {
                if (this.state === 'PLAYING') this.pause();
                else if (this.state === 'PAUSED') this.resume();
            }
            return;
        }

        let needsRender = false;

        switch(action) {
            case ACTIONS.LEFT:
                if (this.board.isValidMove(this.activePiece, this.activePiece.x - 1, this.activePiece.y)) {
                    this.activePiece.moveLeft();
                    needsRender = true;
                }
                break;
            case ACTIONS.RIGHT:
                if (this.board.isValidMove(this.activePiece, this.activePiece.x + 1, this.activePiece.y)) {
                    this.activePiece.moveRight();
                    needsRender = true;
                }
                break;
            case ACTIONS.DOWN:
                if (this.board.isValidMove(this.activePiece, this.activePiece.x, this.activePiece.y + 1)) {
                    this.activePiece.moveDown();
                    this.dropCounter = 0;
                    needsRender = true;
                }
                break;
            case ACTIONS.ROTATE:
                const rotatedMatrix = this.activePiece.rotate();
                if (this.board.isValidMove(this.activePiece, this.activePiece.x, this.activePiece.y, rotatedMatrix)) {
                    this.activePiece.matrix = rotatedMatrix;
                    needsRender = true;
                }
                break;
            case ACTIONS.DROP:
                this.hardDrop();
                needsRender = true;
                break;
            case ACTIONS.PAUSE:
                this.pause();
                break;
        }

        if (needsRender) {
            this.ui.render(this.board.grid, this.activePiece);
            if (this.activePiece) {
                this.ui.renderGhostPiece(this.getGhostPosition());
            }
        }
    }

    async update(time) {
        if (this.state !== 'PLAYING') return;

        const deltaTime = time - this.lastTime;
        this.lastTime = time;

        if (!this.isAnimating) {
            this.dropCounter += deltaTime;

            if (this.dropCounter >= this.dropInterval) {
                if (this.board.isValidMove(this.activePiece, this.activePiece.x, this.activePiece.y + 1)) {
                    this.activePiece.moveDown();
                } else {
                    this.isAnimating = true;
                    this.ui.triggerLockAnimation(this.activePiece);
                    this.board.lockPiece(this.activePiece);
                    
                    const linesToClear = this.board.getLinesToClear();
                    if (linesToClear.length > 0) {
                        await this.ui.animateClearLines(linesToClear);
                        this.board.clearSpecificLines(linesToClear);
                        
                        this.updateScoreAndLevel(linesToClear.length);
                    }
                    
                    this.isAnimating = false;
                    this.spawnPiece();
                }
                this.dropCounter = 0;
            }
        }

        if (this.state === 'PLAYING') {
            this.ui.render(this.board.grid, this.activePiece);
            if (this.activePiece) {
                this.ui.renderGhostPiece(this.getGhostPosition());
            }
            // Update firework particles
            this.ui.particles.update();
            this.animationId = requestAnimationFrame(this.update.bind(this));
        }
    }

    updateScoreAndLevel(linesCleared) {
        const lineScores = [0, 40, 100, 300, 1200];
        this.score += lineScores[linesCleared] * this.level;
        this.linesClearedTotal += linesCleared;
        
        this.level = Math.floor(this.linesClearedTotal / 10) + 1;
        this.dropInterval = Math.max(MIN_SPEED, GAME_SPEED_START - ((this.level - 1) * SPEED_INCREMENT));
        
        this.updateScoreUI();
    }

    getGhostPosition() {
        if (!this.activePiece) return null;
        let ghostY = this.activePiece.y;
        while (this.board.isValidMove(this.activePiece, this.activePiece.x, ghostY + 1)) {
            ghostY++;
        }
        return {
            matrix: this.activePiece.matrix,
            x: this.activePiece.x,
            y: ghostY,
            className: this.activePiece.className
        };
    }

    hardDrop() {
        if (!this.activePiece) return;
        while(this.board.isValidMove(this.activePiece, this.activePiece.x, this.activePiece.y + 1)) {
            this.activePiece.moveDown();
        }
        this.dropCounter = this.dropInterval;
    }
}
