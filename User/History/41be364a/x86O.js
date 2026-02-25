/**
 * Storage Manager
 * Handles saving and loading game data using localStorage
 */

const STORAGE_KEY = 'sonic-multiverse-save';

export class Storage {
    constructor() {
        this.data = this.loadData();
    }

    /**
     * Load all data from localStorage
     */
    loadData() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (e) {
            console.warn('Failed to load save data:', e);
        }

        // Default data structure
        return {
            version: 1,
            progress: {
                currentLevel: 1,
                unlockedLevels: [1],
                emeralds: [false, false, false, false, false, false, false],
                bestTimes: {}
            },
            highScores: [],
            settings: {
                musicVolume: 0.7,
                sfxVolume: 1.0,
                muted: false
            },
            gameComplete: false
        };
    }

    /**
     * Save all data to localStorage
     */
    saveData() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
        } catch (e) {
            console.warn('Failed to save data:', e);
        }
    }

    /**
     * Save level progress
     */
    saveLevelProgress(levelNumber, score) {
        // Update current level
        this.data.progress.currentLevel = levelNumber;

        // Unlock next level
        const nextLevel = levelNumber + 1;
        if (nextLevel <= 5 && !this.data.progress.unlockedLevels.includes(nextLevel)) {
            this.data.progress.unlockedLevels.push(nextLevel);
        }

        // Update best score for level
        const currentBest = this.data.progress.bestTimes[levelNumber] || 0;
        if (score > currentBest) {
            this.data.progress.bestTimes[levelNumber] = score;
        }

        this.saveData();
    }

    /**
     * Save collected emeralds
     */
    saveEmeralds(emeralds) {
        this.data.progress.emeralds = emeralds;
        this.saveData();
    }

    /**
     * Save game complete status
     */
    saveGameComplete(finalScore, emeralds) {
        this.data.gameComplete = true;
        this.data.progress.emeralds = emeralds;
        this.saveHighScore(finalScore);
        this.saveData();
    }

    /**
     * Save high score
     */
    saveHighScore(score, name = 'AAA') {
        const entry = { name, score, date: Date.now() };

        // Add to high scores
        this.data.highScores.push(entry);

        // Sort by score descending
        this.data.highScores.sort((a, b) => b.score - a.score);

        // Keep only top 10
        this.data.highScores = this.data.highScores.slice(0, 10);

        this.saveData();

        // Return rank
        return this.data.highScores.findIndex(e => e.date === entry.date) + 1;
    }

    /**
     * Get high scores
     */
    getHighScores() {
        return this.data.highScores;
    }

    /**
     * Load progress
     */
    loadProgress() {
        return this.data.progress;
    }

    /**
     * Check if game was completed
     */
    isGameComplete() {
        return this.data.gameComplete;
    }

    /**
     * Get unlocked levels
     */
    getUnlockedLevels() {
        return this.data.progress.unlockedLevels;
    }

    /**
     * Save settings
     */
    saveSettings(settings) {
        this.data.settings = { ...this.data.settings, ...settings };
        this.saveData();
    }

    /**
     * Load settings
     */
    loadSettings() {
        return this.data.settings;
    }

    /**
     * Clear all data
     */
    clearAll() {
        this.data = this.loadData();
        localStorage.removeItem(STORAGE_KEY);
    }

    /**
     * Check if save data exists
     */
    hasSaveData() {
        return localStorage.getItem(STORAGE_KEY) !== null;
    }
}
