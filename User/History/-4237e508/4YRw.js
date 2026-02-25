/**
 * Player Character (Sonic)
 * Handles movement, physics, and player states
 */

export class Player {
    constructor(game, x, y) {
        this.game = game;
        this.config = game.config.PLAYER;

        // Position and size
        this.x = x;
        this.y = y;
        this.width = 24;
        this.height = 32;

        // Velocity
        this.velocityX = 0;
        this.velocityY = 0;

        // Ground detection
        this.grounded = false;
        this.groundAngle = 0;

        // Movement states
        this.facing = 1; // 1 = right, -1 = left
        this.state = 'idle'; // idle, running, jumping, falling, spinning, hurt

        // Spin dash
        this.spinDashCharge = 0;
        this.isSpinDashing = false;

        // Super Sonic
        this.isSuper = false;
        this.canTransform = false;
        this.superTimer = 0;

        // Invincibility
        this.invincible = false;
        this.invincibilityTimer = 0;
        this.flashTimer = 0;
        this.visible = true;

        // Power-ups
        this.hasShield = false;
        this.hasSpeedBoost = false;
        this.speedBoostTimer = 0;
        this.canPhase = false;
        this.phaseTimer = 0;

        // Death/completion
        this.isDead = false;
        this.reachedGoal = false;

        // Animation
        this.animation = 'idle';
        this.animationFrame = 0;
        this.animationTimer = 0;

        // Sprite
        this.sprite = game.assets.getImage('sonic-idle');
    }

    /**
     * Update player
     */
    update(dt) {
        if (this.isDead) {
            this.updateDead(dt);
            return;
        }

        // Handle input
        this.handleInput(dt);

        // Apply physics
        this.applyPhysics(dt);

        // Update position
        this.move(dt);

        // Check level collision
        this.checkLevelCollision();

        // Update state
        this.updateState();

        // Update timers
        this.updateTimers(dt);

        // Update animation
        this.updateAnimation(dt);
    }

    /**
     * Handle player input
     */
    handleInput(dt) {
        const input = this.game.input;

        // Horizontal movement
        const h = input.getHorizontal();

        if (h !== 0) {
            this.facing = h;
        }

        // Check for spin dash
        if (this.grounded && input.isPressed('down')) {
            if (input.justPressed('jump')) {
                this.isSpinDashing = true;
                this.spinDashCharge = Math.min(this.spinDashCharge + this.config.SPIN_DASH_CHARGE_RATE, 1);
                this.game.audio.playSFX('sfx-spin');
            } else if (this.isSpinDashing) {
                // Keep charging
                this.spinDashCharge = Math.min(this.spinDashCharge + this.config.SPIN_DASH_CHARGE_RATE * 0.5 * dt, 1);
            }

            // Release spin dash
            if (this.isSpinDashing && input.justReleased('down')) {
                this.releaseSpinDash();
            }
        } else if (this.isSpinDashing) {
            this.releaseSpinDash();
        }

        // Normal movement (not during spin dash charge)
        if (!this.isSpinDashing) {
            const accel = this.grounded ? this.config.ACCELERATION : this.config.ACCELERATION * 0.5;
            const speedMult = this.hasSpeedBoost ? 1.5 : 1;
            const maxSpeed = this.config.MAX_SPEED * speedMult * (this.isSuper ? 1.3 : 1);

            if (h !== 0) {
                this.velocityX += h * accel * dt;
                this.velocityX = Math.max(-maxSpeed, Math.min(maxSpeed, this.velocityX));
            } else if (this.grounded) {
                // Deceleration
                if (Math.abs(this.velocityX) > this.config.DECELERATION) {
                    this.velocityX -= Math.sign(this.velocityX) * this.config.DECELERATION * dt;
                } else {
                    this.velocityX = 0;
                }
            }
        }

        // Jump
        if (input.justPressed('jump') && this.grounded && !this.isSpinDashing) {
            this.jump();
        }

        // Variable jump height
        if (input.justReleased('jump') && this.velocityY < 0) {
            this.velocityY *= 0.5;
        }

        // Super Sonic transformation
        if (this.canTransform && input.justPressed('spin') && !this.isSuper) {
            this.transformToSuper();
        }
    }

    /**
     * Release spin dash
     */
    releaseSpinDash() {
        if (this.spinDashCharge > 0) {
            const speed = this.config.SPIN_DASH_MAX_SPEED * this.spinDashCharge;
            this.velocityX = speed * this.facing;
            this.game.audio.playSFX('sfx-spin');
        }
        this.isSpinDashing = false;
        this.spinDashCharge = 0;
        this.state = 'spinning';
    }

    /**
     * Jump
     */
    jump() {
        this.velocityY = this.config.JUMP_FORCE;
        this.grounded = false;
        this.state = 'jumping';
        this.game.audio.playSFX('sfx-jump');
    }

    /**
     * Apply physics
     */
    applyPhysics(dt) {
        // Gravity
        if (!this.grounded || this.velocityY < 0) {
            this.velocityY += this.game.config.GRAVITY * dt;
            this.velocityY = Math.min(this.velocityY, this.game.config.MAX_FALL_SPEED);
        }

        // Air drag when spinning
        if (this.state === 'spinning' && !this.grounded) {
            this.velocityX *= 0.99;
        }
    }

    /**
     * Move player
     */
    move(dt) {
        this.x += this.velocityX * dt;
        this.y += this.velocityY * dt;
    }

    /**
     * Check collision with level geometry
     */
    checkLevelCollision() {
        const level = this.game.levelManager;
        if (!level.currentLevel) return;

        // Get tiles around player
        const bounds = this.getBounds();
        this.grounded = false;

        // Check ground collision
        const groundY = level.getGroundY(this.x + this.width / 2, this.y + this.height);
        if (groundY !== null && this.velocityY >= 0) {
            if (this.y + this.height > groundY) {
                this.y = groundY - this.height;
                this.velocityY = 0;
                this.grounded = true;
            }
        }

        // Check ceiling collision
        const ceilingY = level.getCeilingY(this.x + this.width / 2, this.y);
        if (ceilingY !== null && this.velocityY < 0) {
            if (this.y < ceilingY) {
                this.y = ceilingY;
                this.velocityY = 0;
            }
        }

        // Check wall collision (left)
        const leftWallX = level.getWallX(this.x, this.y + this.height / 2, -1);
        if (leftWallX !== null) {
            if (this.x < leftWallX) {
                this.x = leftWallX;
                this.velocityX = Math.max(0, this.velocityX);
            }
        }

        // Check wall collision (right)
        const rightWallX = level.getWallX(this.x + this.width, this.y + this.height / 2, 1);
        if (rightWallX !== null) {
            if (this.x + this.width > rightWallX) {
                this.x = rightWallX - this.width;
                this.velocityX = Math.min(0, this.velocityX);
            }
        }

        // Check death pit
        if (this.y > level.getLevelHeight() + 100) {
            this.die();
        }

        // Check level bounds
        this.x = Math.max(0, this.x);
    }

    /**
     * Update player state
     */
    updateState() {
        if (this.state === 'hurt') return;

        if (this.grounded) {
            if (this.isSpinDashing) {
                this.state = 'spindash';
            } else if (this.state === 'spinning') {
                // Keep spinning until slow enough
                if (Math.abs(this.velocityX) < 2) {
                    this.state = Math.abs(this.velocityX) > 0.5 ? 'running' : 'idle';
                }
            } else if (Math.abs(this.velocityX) > 0.5) {
                this.state = 'running';
            } else {
                this.state = 'idle';
            }
        } else {
            if (this.velocityY < 0) {
                this.state = 'jumping';
            } else {
                this.state = 'falling';
            }
        }
    }

    /**
     * Update timers
     */
    updateTimers(dt) {
        // Invincibility
        if (this.invincibilityTimer > 0) {
            this.invincibilityTimer -= dt;
            this.flashTimer += dt;

            // Flash effect
            if (this.flashTimer >= 4) {
                this.visible = !this.visible;
                this.flashTimer = 0;
            }

            if (this.invincibilityTimer <= 0) {
                this.invincible = false;
                this.visible = true;
            }
        }

        // Speed boost
        if (this.speedBoostTimer > 0) {
            this.speedBoostTimer -= dt;
            if (this.speedBoostTimer <= 0) {
                this.hasSpeedBoost = false;
            }
        }

        // Phase ability
        if (this.phaseTimer > 0) {
            this.phaseTimer -= dt;
            if (this.phaseTimer <= 0) {
                this.canPhase = false;
            }
        }

        // Super Sonic ring drain
        if (this.isSuper) {
            this.superTimer += dt;
            if (this.superTimer >= this.game.config.SUPER_SONIC.RING_DRAIN_RATE) {
                this.superTimer = 0;
                this.game.rings--;

                if (this.game.rings <= 0) {
                    this.revertFromSuper();
                }
            }
        }
    }

    /**
     * Update animation
     */
    updateAnimation(dt) {
        this.animationTimer += dt;

        // Animation speed based on state
        let frameRate = 8;
        if (this.state === 'running') {
            frameRate = Math.min(4, 10 / (Math.abs(this.velocityX) + 1));
        } else if (this.state === 'spinning' || this.state === 'spindash') {
            frameRate = 2;
        }

        if (this.animationTimer >= frameRate) {
            this.animationTimer = 0;
            this.animationFrame++;
        }

        // Update sprite based on state
        let spriteKey = 'sonic-idle';
        if (this.isSuper) {
            spriteKey = 'sonic-super';
        } else if (this.state === 'running') {
            spriteKey = 'sonic-run';
        } else if (this.state === 'jumping' || this.state === 'falling') {
            spriteKey = 'sonic-jump';
        } else if (this.state === 'spinning' || this.state === 'spindash') {
            spriteKey = 'sonic-spin';
        }

        this.sprite = this.game.assets.getImage(spriteKey);
    }

    /**
     * Hurt the player
     */
    hurt() {
        if (this.invincible || this.isSuper) return;

        if (this.hasShield) {
            // Shield absorbs hit
            this.hasShield = false;
            this.game.audio.playSFX('sfx-hurt');
            return;
        }

        if (this.game.rings > 0) {
            // Scatter rings
            this.game.spawnRingsFromPlayer(this.game.rings);
            this.game.rings = 0;
        } else {
            // Death
            this.die();
            return;
        }

        // Knockback
        this.velocityX = -this.facing * 4;
        this.velocityY = -8;
        this.grounded = false;

        // Invincibility frames
        this.invincible = true;
        this.invincibilityTimer = this.game.config.INVINCIBILITY_FRAMES;
        this.state = 'hurt';

        this.game.audio.playSFX('sfx-hurt');
    }

    /**
     * Kill the player
     */
    die() {
        if (this.isDead) return;

        this.isDead = true;
        this.velocityY = -12;
        this.velocityX = 0;
        this.game.audio.playSFX('sfx-hurt');
    }

    /**
     * Update while dead
     */
    updateDead(dt) {
        this.velocityY += this.game.config.GRAVITY * dt;
        this.y += this.velocityY * dt;
    }

    /**
     * Bounce (after defeating enemy)
     */
    bounce() {
        this.velocityY = this.config.JUMP_FORCE * 0.7;
        this.grounded = false;
    }

    /**
     * Transform to Super Sonic
     */
    transformToSuper() {
        this.isSuper = true;
        this.canTransform = false;
        this.invincible = true;
        this.game.audio.playSFX('sfx-transform');
        this.game.audio.playMusic('music-super');

        // Visual effect
        this.game.camera.shake(10, 30);
    }

    /**
     * Revert from Super Sonic
     */
    revertFromSuper() {
        this.isSuper = false;
        this.invincible = false;
        this.superTimer = 0;

        // Resume normal level music
        const musicKey = `music-${this.game.levelManager.currentLevel?.music || 'greenhill'}`;
        this.game.audio.playMusic(musicKey);
    }

    /**
     * Apply power-up effects
     */
    applyPowerUp(type) {
        switch (type) {
            case 'shield':
                this.hasShield = true;
                break;
            case 'speed':
                this.hasSpeedBoost = true;
                this.speedBoostTimer = 600; // 10 seconds
                break;
            case 'invincibility':
                this.invincible = true;
                this.invincibilityTimer = 480; // 8 seconds
                break;
            case 'phase':
                this.canPhase = true;
                this.phaseTimer = 300; // 5 seconds
                break;
        }
    }

    /**
     * Check if player is in attack state
     */
    isAttacking() {
        return this.state === 'jumping' ||
            this.state === 'spinning' ||
            this.state === 'spindash' ||
            this.isSuper;
    }

    /**
     * Check if player is invincible
     */
    isInvincible() {
        return this.invincible || this.isSuper;
    }

    /**
     * Get collision bounds
     */
    getBounds() {
        // Slightly smaller hitbox than visual
        return {
            x: this.x + 4,
            y: this.y + 4,
            width: this.width - 8,
            height: this.height - 4
        };
    }

    /**
     * Render player
     */
    render(ctx) {
        if (!this.visible) return;

        ctx.save();

        // Flip sprite based on facing direction
        if (this.facing < 0) {
            ctx.translate(this.x + this.width, this.y);
            ctx.scale(-1, 1);
            ctx.translate(-this.x, -this.y);
        }

        // Super Sonic glow
        if (this.isSuper) {
            ctx.shadowColor = '#FFD700';
            ctx.shadowBlur = 20;
        }

        // Shield effect
        if (this.hasShield && !this.isSuper) {
            ctx.strokeStyle = 'rgba(100, 200, 255, 0.5)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(
                this.x + this.width / 2,
                this.y + this.height / 2,
                Math.max(this.width, this.height) / 2 + 4,
                0, Math.PI * 2
            );
            ctx.stroke();
        }

        // Draw sprite
        if (this.sprite) {
            ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height);
        } else {
            // Fallback colored box
            ctx.fillStyle = this.isSuper ? '#FFD700' : '#1565C0';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }

        ctx.restore();
    }
}
