/**
 * Camera System
 * Handles viewport following and smooth scrolling
 */

export class Camera {
    constructor(viewWidth, viewHeight) {
        this.x = 0;
        this.y = 0;
        this.viewWidth = viewWidth;
        this.viewHeight = viewHeight;

        // Level bounds
        this.minX = 0;
        this.minY = 0;
        this.maxX = 0;
        this.maxY = 0;

        // Smoothing
        this.smoothing = 0.1;
        this.targetX = 0;
        this.targetY = 0;

        // Look ahead
        this.lookAheadX = 0;
        this.lookAheadFactor = 40;

        // Deadzone
        this.deadzoneX = 20;
        this.deadzoneY = 30;

        // Shake effect
        this.shakeIntensity = 0;
        this.shakeDuration = 0;
        this.shakeOffsetX = 0;
        this.shakeOffsetY = 0;
    }

    /**
     * Set level bounds for camera clamping
     */
    setBounds(levelWidth, levelHeight) {
        this.minX = 0;
        this.minY = 0;
        this.maxX = Math.max(0, levelWidth - this.viewWidth);
        this.maxY = Math.max(0, levelHeight - this.viewHeight);
    }

    /**
     * Reset camera position
     */
    reset() {
        this.x = 0;
        this.y = 0;
        this.targetX = 0;
        this.targetY = 0;
        this.lookAheadX = 0;
    }

    /**
     * Follow a target entity
     */
    follow(target) {
        if (!target) return;

        // Calculate target camera position (center on target)
        const targetCenterX = target.x + target.width / 2;
        const targetCenterY = target.y + target.height / 2;

        // Look ahead based on movement direction
        if (target.velocityX > 0.5) {
            this.lookAheadX = Math.min(this.lookAheadX + 2, this.lookAheadFactor);
        } else if (target.velocityX < -0.5) {
            this.lookAheadX = Math.max(this.lookAheadX - 2, -this.lookAheadFactor);
        } else {
            // Slowly return to center
            this.lookAheadX *= 0.95;
        }

        this.targetX = targetCenterX - this.viewWidth / 2 + this.lookAheadX;
        this.targetY = targetCenterY - this.viewHeight / 2 - 20; // Slightly above center

        // Apply deadzone
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;

        if (Math.abs(dx) > this.deadzoneX) {
            this.x += (dx - Math.sign(dx) * this.deadzoneX) * this.smoothing;
        }

        if (Math.abs(dy) > this.deadzoneY) {
            this.y += (dy - Math.sign(dy) * this.deadzoneY) * this.smoothing;
        }

        // Clamp to level bounds
        this.x = Math.max(this.minX, Math.min(this.maxX, this.x));
        this.y = Math.max(this.minY, Math.min(this.maxY, this.y));

        // Update shake
        this.updateShake();
    }

    /**
     * Immediately center on position
     */
    centerOn(x, y) {
        this.x = x - this.viewWidth / 2;
        this.y = y - this.viewHeight / 2;
        this.targetX = this.x;
        this.targetY = this.y;

        // Clamp to bounds
        this.x = Math.max(this.minX, Math.min(this.maxX, this.x));
        this.y = Math.max(this.minY, Math.min(this.maxY, this.y));
    }

    /**
     * Start camera shake
     */
    shake(intensity, duration) {
        this.shakeIntensity = intensity;
        this.shakeDuration = duration;
    }

    /**
     * Update shake effect
     */
    updateShake() {
        if (this.shakeDuration > 0) {
            this.shakeOffsetX = (Math.random() - 0.5) * this.shakeIntensity * 2;
            this.shakeOffsetY = (Math.random() - 0.5) * this.shakeIntensity * 2;
            this.shakeDuration--;

            // Decay intensity
            this.shakeIntensity *= 0.95;
        } else {
            this.shakeOffsetX = 0;
            this.shakeOffsetY = 0;
        }
    }

    /**
     * Apply camera transform to context
     */
    applyTransform(ctx) {
        const offsetX = Math.round(this.x + this.shakeOffsetX);
        const offsetY = Math.round(this.y + this.shakeOffsetY);
        ctx.translate(-offsetX, -offsetY);
    }

    /**
     * Convert screen coordinates to world coordinates
     */
    screenToWorld(screenX, screenY) {
        return {
            x: screenX + this.x,
            y: screenY + this.y
        };
    }

    /**
     * Convert world coordinates to screen coordinates
     */
    worldToScreen(worldX, worldY) {
        return {
            x: worldX - this.x,
            y: worldY - this.y
        };
    }

    /**
     * Check if a rectangle is visible on screen
     */
    isVisible(x, y, width, height) {
        return x + width > this.x &&
            x < this.x + this.viewWidth &&
            y + height > this.y &&
            y < this.y + this.viewHeight;
    }
}
