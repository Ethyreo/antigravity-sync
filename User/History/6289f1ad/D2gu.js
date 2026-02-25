/**
 * Enemy Entity
 * Base enemy class with AI behaviors
 */

export class Enemy {
    constructor(game, x, y, type = 'motobug') {
        this.game = game;
        this.type = type;

        this.x = x;
        this.y = y;
        this.width = 32;
        this.height = 24;

        // Movement
        this.velocityX = 0;
        this.velocityY = 0;
        this.speed = type === 'motobug' ? 1 : 0.5;
        this.direction = -1; // Start moving left

        // State
        this.isDead = false;
        this.state = 'patrol';
        this.stateTimer = 0;

        // Patrol bounds
        this.startX = x;
        this.patrolRange = 100;

        // Animation
        this.animationFrame = 0;
        this.animationTimer = 0;

        // Sprite
        this.sprite = game.assets.getImage(`enemy-${type}`);

        // Type-specific settings
        this.setupType(type);
    }

    /**
     * Set up type-specific properties
     */
    setupType(type) {
        switch (type) {
            case 'motobug':
                this.width = 32;
                this.height = 24;
                this.speed = 1;
                break;

            case 'crabmeat':
                this.width = 40;
                this.height = 28;
                this.speed = 0.5;
                this.canShoot = true;
                this.shootCooldown = 0;
                break;

            case 'buzzbomber':
                this.width = 36;
                this.height = 28;
                this.speed = 1.5;
                this.flying = true;
                break;
        }
    }

    /**
     * Update enemy
     */
    update(dt) {
        if (this.isDead) return;

        // Update based on type
        switch (this.type) {
            case 'motobug':
                this.updateMotobug(dt);
                break;
            case 'crabmeat':
                this.updateCrabmeat(dt);
                break;
            case 'buzzbomber':
                this.updateBuzzbomber(dt);
                break;
            default:
                this.updateMotobug(dt);
        }

        // Update animation
        this.updateAnimation(dt);
    }

    /**
     * Motobug AI - Simple patrol
     */
    updateMotobug(dt) {
        // Patrol movement
        this.velocityX = this.speed * this.direction;
        this.x += this.velocityX * dt;

        // Turn around at patrol bounds
        if (this.x < this.startX - this.patrolRange) {
            this.direction = 1;
        } else if (this.x > this.startX + this.patrolRange) {
            this.direction = -1;
        }

        // Check for walls/edges
        this.checkEdges();
    }

    /**
     * Crabmeat AI - Patrol and shoot
     */
    updateCrabmeat(dt) {
        // Patrol movement (slower)
        this.velocityX = this.speed * this.direction;
        this.x += this.velocityX * dt;

        // Turn around
        if (this.x < this.startX - this.patrolRange / 2) {
            this.direction = 1;
        } else if (this.x > this.startX + this.patrolRange / 2) {
            this.direction = -1;
        }

        // Shooting
        if (this.canShoot) {
            this.shootCooldown -= dt;
            if (this.shootCooldown <= 0) {
                this.shoot();
                this.shootCooldown = 180; // 3 seconds
            }
        }
    }

    /**
     * Buzzbomber AI - Flying patrol
     */
    updateBuzzbomber(dt) {
        // Horizontal movement
        this.velocityX = this.speed * this.direction;
        this.x += this.velocityX * dt;

        // Bobbing motion
        this.stateTimer += 0.05 * dt;
        this.y = this.startY + Math.sin(this.stateTimer) * 20;

        // Turn around
        if (this.x < this.startX - this.patrolRange) {
            this.direction = 1;
        } else if (this.x > this.startX + this.patrolRange) {
            this.direction = -1;
        }
    }

    /**
     * Check for edges/walls and turn around
     */
    checkEdges() {
        const level = this.game.levelManager;

        // Check for ground in front
        const checkX = this.direction > 0 ? this.x + this.width + 8 : this.x - 8;
        const groundY = level.getGroundY(checkX, this.y);

        if (groundY === null || groundY > this.y + this.height + 16) {
            // Edge detected, turn around
            this.direction *= -1;
        }

        // Check for walls
        const wallX = level.getWallX(checkX, this.y + this.height / 2, this.direction);
        if (wallX !== null) {
            this.direction *= -1;
        }
    }

    /**
     * Shoot a projectile
     */
    shoot() {
        // TODO: Implement projectile system
        console.log('Crabmeat shoots!');
    }

    /**
     * Update animation
     */
    updateAnimation(dt) {
        this.animationTimer += dt;
        if (this.animationTimer >= 8) {
            this.animationTimer = 0;
            this.animationFrame = (this.animationFrame + 1) % 4;
        }
    }

    /**
     * Destroy the enemy
     */
    destroy() {
        this.isDead = true;

        // Spawn point bonus effect
        this.game.addEffect({
            x: this.x + this.width / 2,
            y: this.y,
            text: '100',
            lifetime: 60,
            isDead: false,
            update(dt) {
                this.y -= dt;
                this.lifetime -= dt;
                if (this.lifetime <= 0) this.isDead = true;
            },
            render(ctx) {
                ctx.fillStyle = '#fff';
                ctx.font = '8px "Press Start 2P"';
                ctx.textAlign = 'center';
                ctx.fillText(this.text, this.x, this.y);
            }
        });
    }

    /**
     * Get collision bounds
     */
    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }

    /**
     * Render enemy
     */
    render(ctx) {
        if (this.isDead) return;

        ctx.save();

        // Flip based on direction
        if (this.direction > 0) {
            ctx.translate(this.x + this.width, this.y);
            ctx.scale(-1, 1);
            ctx.translate(-this.x, -this.y);
        }

        if (this.sprite) {
            ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height);
        } else {
            // Fallback drawing
            this.renderFallback(ctx);
        }

        ctx.restore();
    }

    /**
     * Fallback rendering when sprite is missing
     */
    renderFallback(ctx) {
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;

        // Body
        ctx.fillStyle = this.type === 'crabmeat' ? '#e74c3c' : '#8B0000';
        ctx.beginPath();

        if (this.type === 'motobug') {
            // Motobug - round body with wheel
            ctx.ellipse(centerX, centerY, this.width / 2.5, this.height / 2, 0, 0, Math.PI * 2);
            ctx.fill();

            // Wheel
            ctx.fillStyle = '#333';
            ctx.beginPath();
            ctx.arc(this.x + this.width / 4, this.y + this.height - 4, 6, 0, Math.PI * 2);
            ctx.fill();

            // Wheel spoke
            ctx.strokeStyle = '#666';
            ctx.lineWidth = 2;
            const wheelAngle = this.animationFrame * Math.PI / 2;
            ctx.beginPath();
            ctx.moveTo(this.x + this.width / 4, this.y + this.height - 4);
            ctx.lineTo(
                this.x + this.width / 4 + Math.cos(wheelAngle) * 4,
                this.y + this.height - 4 + Math.sin(wheelAngle) * 4
            );
            ctx.stroke();
        } else if (this.type === 'crabmeat') {
            // Crabmeat - crab body
            ctx.ellipse(centerX, centerY, this.width / 2.5, this.height / 2.5, 0, 0, Math.PI * 2);
            ctx.fill();

            // Claws
            ctx.fillStyle = '#c0392b';
            ctx.beginPath();
            ctx.arc(this.x + 5, centerY, 6, 0, Math.PI * 2);
            ctx.arc(this.x + this.width - 5, centerY, 6, 0, Math.PI * 2);
            ctx.fill();

            // Legs
            ctx.strokeStyle = '#e74c3c';
            ctx.lineWidth = 2;
            for (let i = 0; i < 3; i++) {
                ctx.beginPath();
                ctx.moveTo(this.x + 10 + i * 10, this.y + this.height);
                ctx.lineTo(this.x + 8 + i * 10, this.y + this.height + 5);
                ctx.stroke();
            }
        }

        // Eyes
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(centerX - 4, centerY - 4, 3, 0, Math.PI * 2);
        ctx.arc(centerX + 4, centerY - 4, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(centerX - 4 + this.direction, centerY - 4, 1.5, 0, Math.PI * 2);
        ctx.arc(centerX + 4 + this.direction, centerY - 4, 1.5, 0, Math.PI * 2);
        ctx.fill();
    }
}
