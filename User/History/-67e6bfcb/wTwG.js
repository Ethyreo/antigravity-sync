/**
 * Power-Up Entity
 * Collectible items that give special abilities
 */

export class PowerUp {
    constructor(game, x, y, type, emeraldIndex = 0) {
        this.game = game;
        this.type = type;
        this.emeraldIndex = emeraldIndex;

        this.x = x;
        this.y = y;
        this.width = 24;
        this.height = 24;

        // Animation
        this.animationTimer = Math.random() * Math.PI * 2;
        this.baseY = y;
        this.rotation = 0;
        this.glow = 0;

        // Type-specific settings
        this.setupType(type);
    }

    /**
     * Set up type-specific properties
     */
    setupType(type) {
        switch (type) {
            case 'shield':
                this.color = '#3498db';
                this.glowColor = 'rgba(52, 152, 219, 0.5)';
                break;
            case 'speed':
                this.color = '#f1c40f';
                this.glowColor = 'rgba(241, 196, 15, 0.5)';
                break;
            case 'invincibility':
                this.color = '#9b59b6';
                this.glowColor = 'rgba(155, 89, 182, 0.5)';
                break;
            case 'phase':
                this.color = '#8e44ad';
                this.glowColor = 'rgba(142, 68, 173, 0.5)';
                break;
            case 'emerald':
                this.setupEmerald();
                break;
            default:
                this.color = '#fff';
                this.glowColor = 'rgba(255, 255, 255, 0.5)';
        }
    }

    /**
     * Set up chaos emerald colors
     */
    setupEmerald() {
        const emeraldColors = [
            { color: '#e74c3c', glow: 'rgba(231, 76, 60, 0.5)' },   // Red
            { color: '#f39c12', glow: 'rgba(243, 156, 18, 0.5)' },  // Orange
            { color: '#f1c40f', glow: 'rgba(241, 196, 15, 0.5)' },  // Yellow
            { color: '#2ecc71', glow: 'rgba(46, 204, 113, 0.5)' },  // Green
            { color: '#3498db', glow: 'rgba(52, 152, 219, 0.5)' },  // Blue
            { color: '#9b59b6', glow: 'rgba(155, 89, 182, 0.5)' },  // Purple
            { color: '#ecf0f1', glow: 'rgba(236, 240, 241, 0.5)' }  // White
        ];

        const colorSet = emeraldColors[this.emeraldIndex % 7];
        this.color = colorSet.color;
        this.glowColor = colorSet.glow;
        this.width = 20;
        this.height = 24;
    }

    /**
     * Update power-up
     */
    update(dt) {
        // Floating animation
        this.animationTimer += 0.08 * dt;
        this.y = this.baseY + Math.sin(this.animationTimer) * 4;

        // Rotation for emeralds
        if (this.type === 'emerald') {
            this.rotation += 0.05 * dt;
        }

        // Pulsing glow
        this.glow = (Math.sin(this.animationTimer * 2) + 1) * 0.5;
    }

    /**
     * Apply power-up to player
     */
    apply(player) {
        switch (this.type) {
            case 'shield':
                player.applyPowerUp('shield');
                break;
            case 'speed':
                player.applyPowerUp('speed');
                break;
            case 'invincibility':
                player.applyPowerUp('invincibility');
                break;
            case 'phase':
                player.applyPowerUp('phase');
                break;
            case 'emerald':
                this.game.collectEmerald(this.emeraldIndex);
                break;
        }
    }

    /**
     * Get collision bounds
     */
    getBounds() {
        return {
            x: this.x - this.width / 2,
            y: this.y - this.height / 2,
            width: this.width,
            height: this.height
        };
    }

    /**
     * Render power-up
     */
    render(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);

        // Glow effect
        const glowSize = 30 + this.glow * 10;
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, glowSize);
        gradient.addColorStop(0, this.glowColor);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fillRect(-glowSize, -glowSize, glowSize * 2, glowSize * 2);

        if (this.type === 'emerald') {
            this.renderEmerald(ctx);
        } else {
            this.renderMonitor(ctx);
        }

        ctx.restore();
    }

    /**
     * Render item monitor box
     */
    renderMonitor(ctx) {
        // Monitor box
        ctx.fillStyle = '#333';
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);

        // Screen
        ctx.fillStyle = '#666';
        ctx.fillRect(-this.width / 2 + 2, -this.height / 2 + 2, this.width - 4, this.height - 8);

        // Icon
        ctx.fillStyle = this.color;

        switch (this.type) {
            case 'shield':
                // Shield bubble icon
                ctx.beginPath();
                ctx.arc(0, 0, 6, 0, Math.PI * 2);
                ctx.stroke();
                ctx.strokeStyle = this.color;
                ctx.lineWidth = 2;
                ctx.stroke();
                break;

            case 'speed':
                // Lightning bolt
                ctx.beginPath();
                ctx.moveTo(-3, -6);
                ctx.lineTo(1, -1);
                ctx.lineTo(-1, -1);
                ctx.lineTo(3, 6);
                ctx.lineTo(-1, 1);
                ctx.lineTo(1, 1);
                ctx.closePath();
                ctx.fill();
                break;

            case 'invincibility':
                // Star
                this.drawStar(ctx, 0, 0, 5, 7, 3);
                ctx.fill();
                break;

            case 'phase':
                // Swirl
                ctx.strokeStyle = this.color;
                ctx.lineWidth = 2;
                ctx.beginPath();
                for (let i = 0; i < 720; i += 20) {
                    const angle = i * Math.PI / 180;
                    const radius = (i / 720) * 6;
                    const x = Math.cos(angle) * radius;
                    const y = Math.sin(angle) * radius;
                    if (i === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.stroke();
                break;
        }

        // Monitor stand
        ctx.fillStyle = '#444';
        ctx.fillRect(-3, this.height / 2 - 4, 6, 4);
    }

    /**
     * Render chaos emerald
     */
    renderEmerald(ctx) {
        ctx.rotate(this.rotation);

        // Emerald shape (diamond)
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(0, -this.height / 2);
        ctx.lineTo(this.width / 2, 0);
        ctx.lineTo(0, this.height / 2);
        ctx.lineTo(-this.width / 2, 0);
        ctx.closePath();
        ctx.fill();

        // Highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.beginPath();
        ctx.moveTo(0, -this.height / 2);
        ctx.lineTo(this.width / 4, -this.height / 4);
        ctx.lineTo(0, 0);
        ctx.lineTo(-this.width / 4, -this.height / 4);
        ctx.closePath();
        ctx.fill();

        // Sparkle
        if (Math.sin(this.animationTimer * 3) > 0.7) {
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(-this.width / 4, -this.height / 4, 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    /**
     * Draw a star shape
     */
    drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
        let rot = Math.PI / 2 * 3;
        let x = cx;
        let y = cy;
        const step = Math.PI / spikes;

        ctx.beginPath();
        ctx.moveTo(cx, cy - outerRadius);

        for (let i = 0; i < spikes; i++) {
            x = cx + Math.cos(rot) * outerRadius;
            y = cy + Math.sin(rot) * outerRadius;
            ctx.lineTo(x, y);
            rot += step;

            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            ctx.lineTo(x, y);
            rot += step;
        }

        ctx.lineTo(cx, cy - outerRadius);
        ctx.closePath();
    }
}
