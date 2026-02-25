/**
 * Menu System
 * Handles title screen, pause menu, and other menus
 */

export class Menu {
    constructor(game) {
        this.game = game;

        // Menu state
        this.currentMenu = null;
        this.selectedIndex = 0;
        this.menuItems = [];

        // Menu item positions for click detection
        this.menuItemBounds = [];

        // Animation
        this.animationTimer = 0;
        this.transitionAlpha = 0;

        // Level complete tallying
        this.tallying = false;
        this.tallyTimeBonus = 0;
        this.tallyRingBonus = 0;
        this.displayTimeBonus = 0;
        this.displayRingBonus = 0;

        // DOM menu elements
        this.pauseMenu = document.getElementById('pause-menu');
        this.setupPauseMenu();

        // Mouse/click support for canvas menus
        this.setupMouseEvents();
    }

    /**
     * Set up mouse event listeners for canvas menus
     */
    setupMouseEvents() {
        const canvas = this.game.canvas;

        canvas.addEventListener('click', (e) => {
            // Only allow menu interaction in specific states
            const allowedStates = ['menu', 'paused', 'game_over', 'victory', 'level_complete'];
            if (!this.currentMenu || !allowedStates.includes(this.game.state)) return;

            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            const x = (e.clientX - rect.left) * scaleX;
            const y = (e.clientY - rect.top) * scaleY;

            // Check if click is on a menu item
            for (let i = 0; i < this.menuItemBounds.length; i++) {
                const bounds = this.menuItemBounds[i];
                if (x >= bounds.x && x <= bounds.x + bounds.width &&
                    y >= bounds.y && y <= bounds.y + bounds.height) {
                    this.selectedIndex = i;
                    const item = this.menuItems[i];
                    if (item && item.action) {
                        item.action();
                    }
                    return;
                }
            }
        });

        // Hover support
        canvas.addEventListener('mousemove', (e) => {
            // Only allow menu interaction in specific states
            const allowedStates = ['menu', 'paused', 'game_over', 'victory', 'level_complete'];
            if (!this.currentMenu || !allowedStates.includes(this.game.state)) return;

            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            const x = (e.clientX - rect.left) * scaleX;
            const y = (e.clientY - rect.top) * scaleY;

            // Check if hover is on a menu item
            for (let i = 0; i < this.menuItemBounds.length; i++) {
                const bounds = this.menuItemBounds[i];
                if (x >= bounds.x && x <= bounds.x + bounds.width &&
                    y >= bounds.y && y <= bounds.y + bounds.height) {
                    this.selectedIndex = i;
                    return;
                }
            }
        });
    }

    /**
     * Set up pause menu event listeners
     */
    setupPauseMenu() {
        const resumeBtn = document.getElementById('resume-btn');
        const restartBtn = document.getElementById('restart-btn');
        const quitBtn = document.getElementById('quit-btn');

        if (resumeBtn) {
            resumeBtn.addEventListener('click', () => this.game.resume());
        }
        if (restartBtn) {
            restartBtn.addEventListener('click', () => {
                this.hide();
                this.game.loadLevel(this.game.levelManager.currentLevelNumber);
            });
        }
        if (quitBtn) {
            quitBtn.addEventListener('click', () => {
                this.hide();
                this.game.returnToMenu();
            });
        }
    }

    /**
     * Show title menu
     */
    showTitle() {
        this.currentMenu = 'title';
        this.selectedIndex = 0;
        this.menuItems = [
            { text: 'NEW GAME', action: () => this.game.newGame() },
            { text: 'CONTINUE', action: () => this.continueGame() },
            { text: 'HIGH SCORES', action: () => this.showHighScores() }
        ];
    }

    /**
     * Show pause menu
     */
    showPause() {
        this.currentMenu = 'pause';
        if (this.pauseMenu) {
            this.pauseMenu.classList.remove('hidden');
        }
    }

    /**
     * Show level complete screen
     */
    showLevelComplete(timeBonus, ringBonus) {
        this.currentMenu = 'levelComplete';
        this.tallying = true;
        this.tallyTimeBonus = Math.floor(timeBonus);
        this.tallyRingBonus = Math.floor(ringBonus);
        this.displayTimeBonus = 0;
        this.displayRingBonus = 0;
    }

    /**
     * Show game over screen
     */
    showGameOver() {
        this.currentMenu = 'gameOver';
        this.selectedIndex = 0;
        this.menuItems = [
            { text: 'TRY AGAIN', action: () => this.game.newGame() },
            { text: 'QUIT', action: () => this.game.returnToMenu() }
        ];
    }

    /**
     * Show victory screen
     */
    showVictory() {
        this.currentMenu = 'victory';
        this.selectedIndex = 0;
        this.menuItems = [
            { text: 'PLAY AGAIN', action: () => this.game.newGame() },
            { text: 'MAIN MENU', action: () => this.game.returnToMenu() }
        ];
    }

    /**
     * Show high scores
     */
    showHighScores() {
        this.currentMenu = 'highScores';
        this.menuItems = [
            { text: 'BACK', action: () => this.showTitle() }
        ];
    }

    /**
     * Hide menu
     */
    hide() {
        this.currentMenu = null;
        if (this.pauseMenu) {
            this.pauseMenu.classList.add('hidden');
        }
    }

    /**
     * Continue from saved game
     */
    continueGame() {
        const saveData = this.game.storage.loadProgress();
        if (saveData && saveData.currentLevel) {
            this.game.loadLevel(saveData.currentLevel);
            this.game.emeralds = saveData.emeralds || [false, false, false, false, false, false, false];
        } else {
            this.game.newGame();
        }
    }

    /**
     * Update menu
     */
    update(dt) {
        this.animationTimer += dt;

        // Handle input for canvas-based menus
        if (this.currentMenu === 'title' || this.currentMenu === 'gameOver' || this.currentMenu === 'victory') {
            this.handleMenuInput();
        }

        // Level complete tallying
        if (this.tallying) {
            this.updateTally(dt);
        }
    }

    /**
     * Handle menu navigation input
     */
    handleMenuInput() {
        const input = this.game.input;

        // Navigate
        if (input.justPressed('up')) {
            this.selectedIndex--;
            if (this.selectedIndex < 0) {
                this.selectedIndex = this.menuItems.length - 1;
            }
        }

        if (input.justPressed('down')) {
            this.selectedIndex++;
            if (this.selectedIndex >= this.menuItems.length) {
                this.selectedIndex = 0;
            }
        }

        // Select
        if (input.justPressed('jump') || input.justPressed('spin')) {
            const item = this.menuItems[this.selectedIndex];
            if (item && item.action) {
                item.action();
            }
        }
    }

    /**
     * Update level complete tally
     */
    updateTally(dt) {
        const tallySpeed = 50;

        // Tally time bonus
        if (this.displayTimeBonus < this.tallyTimeBonus) {
            this.displayTimeBonus = Math.min(this.displayTimeBonus + tallySpeed, this.tallyTimeBonus);
            this.game.score += tallySpeed;
        }
        // Tally ring bonus
        else if (this.displayRingBonus < this.tallyRingBonus) {
            this.displayRingBonus = Math.min(this.displayRingBonus + tallySpeed, this.tallyRingBonus);
            this.game.score += tallySpeed;
        }
        // Done tallying
        else {
            this.tallying = false;

            // Wait for input to continue
            if (this.game.input.justPressed('jump')) {
                this.game.nextLevel();
            }
        }
    }

    /**
     * Render menu
     */
    render(ctx) {
        switch (this.currentMenu) {
            case 'title':
                this.renderTitle(ctx);
                break;
            case 'levelComplete':
                this.renderLevelComplete(ctx);
                break;
            case 'gameOver':
                this.renderGameOver(ctx);
                break;
            case 'victory':
                this.renderVictory(ctx);
                break;
            case 'highScores':
                this.renderHighScores(ctx);
                break;
        }
    }

    /**
     * Render title screen
     */
    renderTitle(ctx) {
        const { NATIVE_WIDTH, NATIVE_HEIGHT } = this.game.config;

        // Background
        const gradient = ctx.createLinearGradient(0, 0, 0, NATIVE_HEIGHT);
        gradient.addColorStop(0, '#0f0c29');
        gradient.addColorStop(0.5, '#302b63');
        gradient.addColorStop(1, '#24243e');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, NATIVE_WIDTH, NATIVE_HEIGHT);

        // Stars
        ctx.fillStyle = '#fff';
        for (let i = 0; i < 50; i++) {
            const x = (i * 47 + this.animationTimer * 0.1) % NATIVE_WIDTH;
            const y = (i * 31) % NATIVE_HEIGHT;
            const size = (Math.sin(i + this.animationTimer * 0.05) + 1) * 1.5;
            ctx.fillRect(x, y, size, size);
        }

        // Title
        ctx.textAlign = 'center';

        // Main title - "SUPER SONIC"
        const titleY = 50 + Math.sin(this.animationTimer * 0.1) * 3;

        // Shadow first
        ctx.fillStyle = '#0d47a1';
        ctx.font = '16px "Press Start 2P"';
        ctx.fillText('SUPER SONIC', NATIVE_WIDTH / 2 + 2, titleY + 2);

        // Main title
        ctx.fillStyle = '#1565C0';
        ctx.fillText('SUPER SONIC', NATIVE_WIDTH / 2, titleY);

        // Subtitle
        ctx.fillStyle = '#FFD700';
        ctx.font = '8px "Press Start 2P"';
        ctx.fillText('in the', NATIVE_WIDTH / 2, titleY + 25);
        ctx.fillText('MULTIVERSE OF MADNESS', NATIVE_WIDTH / 2, titleY + 40);

        // Reset menu item bounds
        this.menuItemBounds = [];

        // Menu items
        const menuStartY = 130;
        ctx.font = '8px "Press Start 2P"';

        for (let i = 0; i < this.menuItems.length; i++) {
            const item = this.menuItems[i];
            const y = menuStartY + i * 22;

            // Calculate text width for click bounds
            const textWidth = ctx.measureText(item.text).width;
            const itemX = NATIVE_WIDTH / 2 - textWidth / 2 - 20;
            const itemWidth = textWidth + 40;
            const itemHeight = 18;

            // Store bounds for click detection
            this.menuItemBounds.push({
                x: itemX,
                y: y - 10,
                width: itemWidth,
                height: itemHeight
            });

            // Draw selection background
            if (i === this.selectedIndex) {
                ctx.fillStyle = 'rgba(255, 215, 0, 0.2)';
                ctx.fillRect(itemX, y - 10, itemWidth, itemHeight);
                ctx.fillStyle = '#FFD700';

                // Animated cursor
                const cursorX = itemX + 2;
                ctx.fillText('>', cursorX + Math.sin(this.animationTimer * 0.2) * 3, y + 2);
            } else {
                ctx.fillStyle = '#fff';
            }

            ctx.fillText(item.text, NATIVE_WIDTH / 2, y + 2);
        }

        // Instructions - clearer
        ctx.fillStyle = '#aaa';
        ctx.font = '6px "Press Start 2P"';
        ctx.fillText('CLICK OR PRESS SPACE', NATIVE_WIDTH / 2, NATIVE_HEIGHT - 30);
        ctx.fillText('ARROWS OR WASD TO NAVIGATE', NATIVE_WIDTH / 2, NATIVE_HEIGHT - 18);
    }

    /**
     * Render level complete screen
     */
    renderLevelComplete(ctx) {
        const { NATIVE_WIDTH, NATIVE_HEIGHT } = this.game.config;

        // Semi-transparent overlay
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, NATIVE_WIDTH, NATIVE_HEIGHT);

        ctx.textAlign = 'center';

        // Level name
        const levelName = this.game.levelManager.currentLevel?.name || 'Level Complete';
        ctx.fillStyle = '#FFD700';
        ctx.font = '12px "Press Start 2P"';
        ctx.fillText(levelName, NATIVE_WIDTH / 2, 50);

        ctx.fillStyle = '#2ecc71';
        ctx.font = '10px "Press Start 2P"';
        ctx.fillText('CLEAR!', NATIVE_WIDTH / 2, 70);

        // Tally
        ctx.font = '8px "Press Start 2P"';
        ctx.textAlign = 'left';
        const startX = NATIVE_WIDTH / 2 - 80;

        ctx.fillStyle = '#fff';
        ctx.fillText('TIME BONUS:', startX, 100);
        ctx.fillText('RING BONUS:', startX, 120);
        ctx.fillText('TOTAL:', startX, 150);

        ctx.textAlign = 'right';
        const endX = NATIVE_WIDTH / 2 + 80;

        ctx.fillStyle = '#FFD700';
        ctx.fillText(Math.floor(this.displayTimeBonus).toString(), endX, 100);
        ctx.fillText(Math.floor(this.displayRingBonus).toString(), endX, 120);

        ctx.fillStyle = '#2ecc71';
        const total = Math.floor(this.displayTimeBonus + this.displayRingBonus);
        ctx.fillText(total.toString(), endX, 150);

        // Continue prompt
        if (!this.tallying) {
            ctx.textAlign = 'center';
            ctx.fillStyle = '#888';
            ctx.font = '6px "Press Start 2P"';
            ctx.fillText('PRESS SPACE TO CONTINUE', NATIVE_WIDTH / 2, NATIVE_HEIGHT - 30);
        }
    }

    /**
     * Render game over screen
     */
    renderGameOver(ctx) {
        const { NATIVE_WIDTH, NATIVE_HEIGHT } = this.game.config;

        // Dark overlay
        ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
        ctx.fillRect(0, 0, NATIVE_WIDTH, NATIVE_HEIGHT);

        ctx.textAlign = 'center';

        // Game Over text
        ctx.fillStyle = '#e74c3c';
        ctx.font = '16px "Press Start 2P"';
        ctx.fillText('GAME OVER', NATIVE_WIDTH / 2, 70);

        // Final score
        ctx.fillStyle = '#fff';
        ctx.font = '8px "Press Start 2P"';
        ctx.fillText('FINAL SCORE', NATIVE_WIDTH / 2, 100);

        ctx.fillStyle = '#FFD700';
        ctx.font = '12px "Press Start 2P"';
        ctx.fillText(this.game.score.toLocaleString(), NATIVE_WIDTH / 2, 120);

        // Menu items
        const menuStartY = 160;
        ctx.font = '8px "Press Start 2P"';

        for (let i = 0; i < this.menuItems.length; i++) {
            const item = this.menuItems[i];
            const y = menuStartY + i * 20;

            if (i === this.selectedIndex) {
                ctx.fillStyle = '#FFD700';
                ctx.fillText('> ' + item.text, NATIVE_WIDTH / 2, y);
            } else {
                ctx.fillStyle = '#fff';
                ctx.fillText(item.text, NATIVE_WIDTH / 2, y);
            }
        }
    }

    /**
     * Render victory screen
     */
    renderVictory(ctx) {
        const { NATIVE_WIDTH, NATIVE_HEIGHT } = this.game.config;

        // Celebration background
        const hue = (this.animationTimer * 2) % 360;
        const gradient = ctx.createRadialGradient(
            NATIVE_WIDTH / 2, NATIVE_HEIGHT / 2, 0,
            NATIVE_WIDTH / 2, NATIVE_HEIGHT / 2, NATIVE_WIDTH
        );
        gradient.addColorStop(0, `hsl(${hue}, 50%, 30%)`);
        gradient.addColorStop(1, '#000');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, NATIVE_WIDTH, NATIVE_HEIGHT);

        ctx.textAlign = 'center';

        // Victory text
        ctx.fillStyle = '#FFD700';
        ctx.font = '14px "Press Start 2P"';
        ctx.fillText('CONGRATULATIONS!', NATIVE_WIDTH / 2, 50);

        ctx.fillStyle = '#fff';
        ctx.font = '8px "Press Start 2P"';
        ctx.fillText('YOU SAVED THE MULTIVERSE!', NATIVE_WIDTH / 2, 75);

        // Stats
        ctx.fillText('FINAL SCORE: ' + this.game.score.toLocaleString(), NATIVE_WIDTH / 2, 110);

        // Emerald count
        const emeraldCount = this.game.emeralds.filter(e => e).length;
        ctx.fillText(`EMERALDS: ${emeraldCount} / 7`, NATIVE_WIDTH / 2, 130);

        if (emeraldCount === 7) {
            ctx.fillStyle = '#FFD700';
            ctx.fillText('SUPER SONIC UNLOCKED!', NATIVE_WIDTH / 2, 150);
        }

        // Menu items
        const menuStartY = 180;
        ctx.font = '8px "Press Start 2P"';

        for (let i = 0; i < this.menuItems.length; i++) {
            const item = this.menuItems[i];
            const y = menuStartY + i * 20;

            if (i === this.selectedIndex) {
                ctx.fillStyle = '#FFD700';
                ctx.fillText('> ' + item.text, NATIVE_WIDTH / 2, y);
            } else {
                ctx.fillStyle = '#fff';
                ctx.fillText(item.text, NATIVE_WIDTH / 2, y);
            }
        }
    }

    /**
     * Render high scores screen
     */
    renderHighScores(ctx) {
        const { NATIVE_WIDTH, NATIVE_HEIGHT } = this.game.config;

        // Background
        ctx.fillStyle = '#0a0a12';
        ctx.fillRect(0, 0, NATIVE_WIDTH, NATIVE_HEIGHT);

        ctx.textAlign = 'center';

        // Title
        ctx.fillStyle = '#FFD700';
        ctx.font = '12px "Press Start 2P"';
        ctx.fillText('HIGH SCORES', NATIVE_WIDTH / 2, 40);

        // Get high scores
        const highScores = this.game.storage.getHighScores();

        ctx.font = '8px "Press Start 2P"';

        if (highScores.length === 0) {
            ctx.fillStyle = '#888';
            ctx.fillText('NO SCORES YET', NATIVE_WIDTH / 2, NATIVE_HEIGHT / 2);
        } else {
            for (let i = 0; i < Math.min(highScores.length, 10); i++) {
                const score = highScores[i];
                const y = 70 + i * 15;

                ctx.fillStyle = i === 0 ? '#FFD700' : '#fff';
                ctx.textAlign = 'left';
                ctx.fillText(`${i + 1}.`, NATIVE_WIDTH / 2 - 80, y);
                ctx.fillText(score.name || 'AAA', NATIVE_WIDTH / 2 - 50, y);
                ctx.textAlign = 'right';
                ctx.fillText(score.score.toLocaleString(), NATIVE_WIDTH / 2 + 80, y);
            }
        }

        // Back button
        ctx.textAlign = 'center';
        ctx.fillStyle = this.selectedIndex === 0 ? '#FFD700' : '#888';
        ctx.fillText('> BACK', NATIVE_WIDTH / 2, NATIVE_HEIGHT - 30);
    }
}
