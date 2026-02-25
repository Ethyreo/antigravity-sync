/**
 * Ring Entity
 * Collectible rings that protect Sonic
 */

export class Ring {
    constructor(game, x, y) {
        this.game = game;

        this.x = x;
        this.y = y;
        this.width = 16;
        this.height = 16;

        this.collected = false;
        this.animationFrame = 0;
        this.animationTimer = 0;
        this.rotation = Math.random() * Math.PI * 2;

        // Floating animation
        this.baseY = y;
        this.floatTimer = Math.random() * Math.PI * 2;

        // Sparkle effect
        this.sparkleTimer = 0;

        this.sprite = game.assets.getImage('ring');
    }

    /**
     * Update ring
     */
    update(dt) {
        if (this.collected) return;

        // Float animation
        this.floatTimer += 0.1 * dt;
        this.y = this.baseY + Math.sin(this.floatTimer) * 3;

        // Rotation animation
        this.rotation += 0.15 * dt;

        // Sparkle
        this.sparkleTimer += dt;
    }

    /**
     * Collect the ring
     */
    collect() {
        this.collected = true;
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
     * Render ring
     */
    render(ctx) {
        if (this.collected) return;

        ctx.save();
        ctx.translate(this.x, this.y);

        // Apply rotation (simulates 3D spin)
        const scale = Math.abs(Math.cos(this.rotation));
        ctx.scale(scale, 1);

        if (this.sprite) {
            ctx.drawImage(
                this.sprite,
                -this.width / 2,
                -this.height / 2,
                this.width,
                this.height
            );
        } else {
            // Fallback ring drawing
            ctx.strokeStyle = '#FFD700';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(0, 0, 6, 0, Math.PI * 2);
            ctx.stroke();

            ctx.strokeStyle = '#FFAA00';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(0, 0, 4, 0, Math.PI * 2);
            ctx.stroke();
        }

        // Sparkle effect
        if (Math.sin(this.sparkleTimer * 0.5) > 0.8) {
            ctx.fillStyle = '#fff';
            ctx.fillRect(-1, -this.height / 2 - 3, 2, 4);
        }

        ctx.restore();
    }
}

/**
 * Scattered Ring (when player is hit)
 */
export class ScatteredRing extends Ring {
    constructor(game, x, y, angle, speed) {
        super(game, x, y);

        this.velocityX = Math.cos(angle) * speed;
        this.velocityY = Math.sin(angle) * speed - 8;
        this.gravity = 0.4;
        this.lifetime = 180; // 3 seconds at 60fps
        this.canCollect = false;
        this.collectDelay = 30; // Can't collect immediately
    }

    update(dt) {
        if (this.collected) return;

        // Physics
        this.velocityY += this.gravity * dt;
        this.x += this.velocityX * dt;
        this.y += this.velocityY * dt;

        // Bounce off ground
        const groundY = this.game.levelManager.getGroundY(this.x, 0);
        if (groundY && this.y > groundY - this.height / 2) {
            this.y = groundY - this.height / 2;
            this.velocityY = -this.velocityY * 0.5;
            this.velocityX *= 0.8;
        }

        // Collection delay
        if (this.collectDelay > 0) {
            this.collectDelay -= dt;
        } else {
            this.canCollect = true;
        }

        // Lifetime
        this.lifetime -= dt;
        if (this.lifetime <= 0) {
            this.collected = true;
        }

        // Animation
        this.rotation += 0.2 * dt;

        // Blink when about to disappear
        if (this.lifetime < 60) {
            this.sparkleTimer += 0.3;
        }
    }

    render(ctx) {
        // Blink effect when disappearing
        if (this.lifetime < 60 && Math.floor(this.sparkleTimer) % 2 === 0) {
            return;
        }
        super.render(ctx);
    }
}
