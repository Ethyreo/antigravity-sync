/**
 * HUD (Heads-Up Display)
 * Renders game UI during gameplay
 */

export class HUD {
    constructor(game) {
        this.game = game;

        // DOM elements
        this.hudElement = document.getElementById('hud');
        this.scoreElement = document.getElementById('hud-score');
        this.timeElement = document.getElementById('hud-time');
        this.ringsElement = document.getElementById('hud-rings');
        this.livesElement = document.getElementById('hud-lives');
        this.emeraldDisplay = document.getElementById('emerald-display');

        // Initialize emerald display
        this.initEmeraldDisplay();

        // Animation
        this.ringFlashTimer = 0;
        this.scorePopups = [];
    }

    /**
     * Initialize emerald display
     */
    initEmeraldDisplay() {
        if (!this.emeraldDisplay) return;

        this.emeraldDisplay.innerHTML = '';

        for (let i = 0; i < 7; i++) {
            const emerald = document.createElement('div');
            emerald.className = `emerald emerald-${i + 1}`;
            this.emeraldDisplay.appendChild(emerald);
        }
    }

    /**
     * Show HUD
     */
    show() {
        if (this.hudElement) {
            this.hudElement.classList.remove('hidden');
        }

        // Show touch controls on mobile
        const touchControls = document.getElementById('touch-controls');
        if (touchControls && this.game.input.isMobile) {
            touchControls.classList.remove('hidden');
        }
    }

    /**
     * Hide HUD
     */
    hide() {
        if (this.hudElement) {
            this.hudElement.classList.add('hidden');
        }

        const touchControls = document.getElementById('touch-controls');
        if (touchControls) {
            touchControls.classList.add('hidden');
        }
    }

    /**
     * Update HUD
     */
    update(dt) {
        // Update score display
        if (this.scoreElement) {
            this.scoreElement.textContent = this.formatNumber(this.game.score);
        }

        // Update time display
        if (this.timeElement) {
            this.timeElement.textContent = this.formatTime(this.game.time);
        }

        // Update rings display
        if (this.ringsElement) {
            this.ringsElement.textContent = this.game.rings;

            // Flash when rings are 0
            if (this.game.rings === 0) {
                this.ringFlashTimer += dt;
                this.ringsElement.style.color = Math.floor(this.ringFlashTimer / 15) % 2 === 0 ? '#e74c3c' : '#FFAA00';
            } else {
                this.ringsElement.style.color = '#FFAA00';
            }
        }

        // Update lives display
        if (this.livesElement) {
            this.livesElement.textContent = this.game.lives;
        }

        // Update score popups
        for (let i = this.scorePopups.length - 1; i >= 0; i--) {
            this.scorePopups[i].lifetime -= dt;
            this.scorePopups[i].y -= dt * 0.5;

            if (this.scorePopups[i].lifetime <= 0) {
                this.scorePopups.splice(i, 1);
            }
        }
    }

    /**
     * Update emerald display
     */
    updateEmeralds(emeralds) {
        if (!this.emeraldDisplay) return;

        const emeraldElements = this.emeraldDisplay.querySelectorAll('.emerald');
        emeraldElements.forEach((el, i) => {
            if (emeralds[i]) {
                el.classList.add('collected');
            } else {
                el.classList.remove('collected');
            }
        });
    }

    /**
     * Add a score popup
     */
    addScorePopup(x, y, value) {
        this.scorePopups.push({
            x, y,
            value,
            lifetime: 60
        });
    }

    /**
     * Render HUD (canvas-based elements)
     */
    render(ctx) {
        // Render score popups
        for (const popup of this.scorePopups) {
            const alpha = popup.lifetime / 60;
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.font = '8px "Press Start 2P"';
            ctx.textAlign = 'center';
            ctx.fillText(popup.value.toString(), popup.x, popup.y);
        }
    }

    /**
     * Format number with commas
     */
    formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    /**
     * Format time as M:SS
     */
    formatTime(ms) {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }
}
