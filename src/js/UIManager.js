import { COLS, ROWS } from './constants.js';
import { ParticleManager } from './ParticleManager.js';

export class UIManager {
    constructor() {
        this.boardContainer = document.getElementById('board');
        this.nextPieceContainer = document.getElementById('next-piece-grid');
        this.scoreElement = document.getElementById('score');
        this.highScoreElement = document.getElementById('high-score');
        this.levelElement = document.getElementById('level');
        this.overlay = document.getElementById('overlay');
        this.overlayTitle = document.getElementById('overlay-title');
        this.overlayBtn = document.getElementById('overlay-btn');
        this.leaderboardList = document.getElementById('leaderboard-list');
        
        this.boardCells = [];
        this.nextCells = [];

        this.particles = new ParticleManager(document.body);

        this.initBoard();
        this.initNextPieceBoard();
        this.particles = new ParticleManager(this.boardContainer);
    }

    initBoard() {
        this.boardContainer.style.gridTemplateColumns = `repeat(${COLS}, 1fr)`;
        this.boardContainer.style.gridTemplateRows = `repeat(${ROWS}, 1fr)`;
        
        for (let r = 0; r < ROWS; r++) {
            this.boardCells[r] = [];
            for (let c = 0; c < COLS; c++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                this.boardContainer.appendChild(cell);
                this.boardCells[r][c] = cell;
            }
        }
    }

    initNextPieceBoard() {
        this.nextPieceContainer.style.gridTemplateColumns = `repeat(4, 1fr)`;
        this.nextPieceContainer.style.gridTemplateRows = `repeat(4, 1fr)`;
        for (let r = 0; r < 4; r++) {
            this.nextCells[r] = [];
            for (let c = 0; c < 4; c++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                this.nextPieceContainer.appendChild(cell);
                this.nextCells[r][c] = cell;
            }
        }
    }

    render(boardState, activePiece) {
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                this.boardCells[r][c].className = 'cell';
                if (boardState[r][c]) {
                    this.boardCells[r][c].classList.add('filled', boardState[r][c]);
                }
            }
        }

        if (activePiece) {
            for (let r = 0; r < activePiece.matrix.length; r++) {
                for (let c = 0; c < activePiece.matrix[r].length; c++) {
                    if (activePiece.matrix[r][c]) {
                        const drawY = activePiece.y + r;
                        const drawX = activePiece.x + c;
                        if (drawY >= 0 && drawY < ROWS && drawX >= 0 && drawX < COLS) {
                            this.boardCells[drawY][drawX].classList.add('filled', activePiece.className, 'active');
                        }
                    }
                }
            }
        }
    }

    renderGhostPiece(ghostPiece) {
        if (!ghostPiece) return;
        for (let r = 0; r < ghostPiece.matrix.length; r++) {
            for (let c = 0; c < ghostPiece.matrix[r].length; c++) {
                if (ghostPiece.matrix[r][c]) {
                    const drawY = ghostPiece.y + r;
                    const drawX = ghostPiece.x + c;
                    if (drawY >= 0 && drawY < ROWS && drawX >= 0 && drawX < COLS) {
                        const cell = this.boardCells[drawY][drawX];
                        if (!cell.classList.contains('active') && !cell.classList.contains('filled')) {
                            cell.classList.add('ghost', ghostPiece.className);
                        }
                    }
                }
            }
        }
    }

    renderNextPiece(pieceKey, shapes) {
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                this.nextCells[r][c].className = 'cell';
            }
        }
        
        if (!pieceKey) return;

        const shape = shapes[pieceKey];
        const matrix = shape.matrix;
        const offsetRow = Math.floor((4 - matrix.length) / 2);
        const offsetCol = Math.floor((4 - matrix[0].length) / 2);

        for (let r = 0; r < matrix.length; r++) {
            for (let c = 0; c < matrix[r].length; c++) {
                if (matrix[r][c]) {
                    this.nextCells[offsetRow + r][offsetCol + c].classList.add('filled', shape.className);
                }
            }
        }
    }

    updateScore(score, highScore, level) {
        this.scoreElement.textContent = score;
        this.highScoreElement.textContent = highScore;
        this.levelElement.textContent = level;
    }

    toggleOverlay(isVisible, title = '', btnText = '') {
        if (isVisible) {
            this.overlay.classList.add('show');
            this.overlayTitle.textContent = title;
            this.overlayBtn.textContent = btnText;
        } else {
            this.overlay.classList.remove('show');
        }
    }

    async animateClearLines(lines) {
        // Trigger African firework explosions across the cleared lines
        const boardRect = this.boardContainer.getBoundingClientRect ? this.boardContainer.getBoundingClientRect() : { left: 0, top: 0, width: 300, height: 600 };
        const cellHeight = boardRect.height / ROWS;

        lines.forEach(r => {
            const lineY = boardRect.top + r * cellHeight + cellHeight / 2;
            this.particles.triggerLineClearExplosion(lineY, boardRect.width);
        });

        return new Promise(resolve => {
            lines.forEach(r => {
                for(let c=0; c<COLS; c++) {
                    this.boardCells[r][c].classList.add('clear-anim');
                }
                
                // Get the DOM element for the first cell in the row to calculate Y position
                const cellRect = this.boardCells[r][0].getBoundingClientRect();
                const containerRect = this.boardContainer.getBoundingClientRect();
                const rowY = cellRect.top - containerRect.top + cellRect.height / 2;
                
                this.particles.triggerLineClearExplosion(rowY, containerRect.width);
            });
            setTimeout(() => {
                lines.forEach(r => {
                    for(let c=0; c<COLS; c++) {
                        this.boardCells[r][c].classList.remove('clear-anim');
                    }
                });
                resolve();
            }, 400); 
        });
    }

    triggerLockAnimation(piece) {
        for (let r = 0; r < piece.matrix.length; r++) {
            for (let c = 0; c < piece.matrix[r].length; c++) {
                if (piece.matrix[r][c]) {
                    const drawY = piece.y + r;
                    const drawX = piece.x + c;
                    if (drawY >= 0 && drawY < ROWS && drawX >= 0 && drawX < COLS) {
                        this.boardCells[drawY][drawX].classList.add('lock-anim');
                        setTimeout(() => {
                             if(this.boardCells[drawY] && this.boardCells[drawY][drawX]){
                                 this.boardCells[drawY][drawX].classList.remove('lock-anim');
                             }
                        }, 300);
                    }
                }
            }
        }
    }

    renderLeaderboard(scores) {
        this.leaderboardList.innerHTML = '';
        if (!scores || scores.length === 0) {
            const li = document.createElement('li');
            li.textContent = '-';
            li.style.textAlign = 'center';
            this.leaderboardList.appendChild(li);
            return;
        }

        scores.forEach(score => {
            const li = document.createElement('li');
            li.textContent = score;
            this.leaderboardList.appendChild(li);
        });
    }
}
