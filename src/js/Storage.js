export class Storage {
    constructor() {
        this.highScoreKey = 'african_tetris_highscore';
        this.leaderboardKey = 'african_tetris_leaderboard';
    }

    getHighScore() {
        try {
            const score = localStorage.getItem(this.highScoreKey);
            return score ? parseInt(score, 10) : 0;
        } catch (e) {
            return 0; // fallback if localStorage is disabled
        }
    }

    saveHighScore(score) {
        try {
            const currentHigh = this.getHighScore();
            if (score > currentHigh) {
                localStorage.setItem(this.highScoreKey, score);
                return true;
            }
            return false;
        } catch (e) {
            return false;
        }
    }

    getLeaderboard() {
        try {
            const data = localStorage.getItem(this.leaderboardKey);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            return [];
        }
    }

    saveToLeaderboard(score) {
        if (score <= 0) return; // Don't save 0 scores
        try {
            const board = this.getLeaderboard();
            board.push(score);
            board.sort((a, b) => b - a);
            const top5 = board.slice(0, 5);
            localStorage.setItem(this.leaderboardKey, JSON.stringify(top5));
        } catch (e) {
            // Ignore if localStorage is disabled
        }
    }
}
