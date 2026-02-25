/**
 * Player.js - Main player character for Rift Runners
 * Handles movement, jumping, dashing, and animations
 */

class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        // Create a temporary graphics object for the player sprite
        super(scene, x, y, 'player');

        // Add to scene and physics
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Player properties
        this.scene = scene;
        this.moveSpeed = 300;
        this.jumpForce = -500;
        this.dashSpeed = 600;
        this.dashDuration = 150;
        this.dashCooldown = 500;

        // State tracking
        this.canDoubleJump = true;
        this.isJumping = false;
        this.isDashing = false;
        this.canDash = true;
        this.facingRight = true;
        this.isOnWall = false;

        // Setup physics body
        this.setCollideWorldBounds(true);
        this.setBounce(0);
        this.setDragX(800);
        this.body.setSize(40, 56);
        this.setDepth(10);

        // Visual effects container
        this.particles = null;
        this.setupParticles();
    }

    setupParticles() {
        // Create particle effects for movement
        if (this.scene.textures.exists('particle')) {
            this.particles = this.scene.add.particles(0, 0, 'particle', {
                speed: { min: 50, max: 100 },
                scale: { start: 0.4, end: 0 },
                alpha: { start: 0.6, end: 0 },
                lifespan: 300,
                blendMode: 'ADD',
                follow: this,
                followOffset: { x: 0, y: 20 },
                frequency: -1 // Manual emission
            });
            this.particles.setDepth(5);
        }
    }

    update(controls) {
        if (!this.active) return;

        // Handle horizontal movement
        this.handleMovement(controls);

        // Handle jumping
        this.handleJump(controls);

        // Handle dashing
        this.handleDash(controls);

        // Update visual effects
        this.updateVisuals();

        // Check if grounded
        if (this.body.onFloor()) {
            this.canDoubleJump = true;
            this.isJumping = false;
        }
    }

    handleMovement(controls) {
        if (this.isDashing) return;

        if (controls.left) {
            this.setVelocityX(-this.moveSpeed);
            this.facingRight = false;
            this.setFlipX(true);
        } else if (controls.right) {
            this.setVelocityX(this.moveSpeed);
            this.facingRight = true;
            this.setFlipX(false);
        }
    }

    handleJump(controls) {
        if (this.isDashing) return;

        if (controls.jump) {
            if (this.body.onFloor()) {
                // Regular jump
                this.setVelocityY(this.jumpForce);
                this.isJumping = true;
                this.emitJumpParticles();
            } else if (this.canDoubleJump) {
                // Double jump
                this.setVelocityY(this.jumpForce * 0.85);
                this.canDoubleJump = false;
                this.emitJumpParticles();
            }
        }
    }

    handleDash(controls) {
        if (controls.dash && this.canDash && !this.isDashing) {
            this.isDashing = true;
            this.canDash = false;

            // Dash in facing direction
            const dashVelocity = this.facingRight ? this.dashSpeed : -this.dashSpeed;
            this.setVelocityX(dashVelocity);
            this.setVelocityY(0);

            // Dash trail effect
            this.emitDashParticles();

            // Visual feedback
            this.setTint(0x67e8f9);

            // End dash after duration
            this.scene.time.delayedCall(this.dashDuration, () => {
                this.isDashing = false;
                this.clearTint();
            });

            // Cooldown
            this.scene.time.delayedCall(this.dashCooldown, () => {
                this.canDash = true;
            });
        }
    }

    emitJumpParticles() {
        if (this.particles) {
            this.particles.emitParticle(10);
        }
    }

    emitDashParticles() {
        if (this.particles) {
            this.particles.emitParticle(20);
        }
    }

    updateVisuals() {
        // Add subtle floating animation when idle
        if (Math.abs(this.body.velocity.x) < 10 && this.body.onFloor()) {
            // Could add idle animation effects here
        }
    }

    // Called when player takes damage
    takeDamage() {
        this.setTint(0xff6b6b);
        this.scene.time.delayedCall(200, () => {
            this.clearTint();
        });
    }

    // Called when player collects an item
    collect() {
        // Flash effect
        this.setTint(0xffd93d);
        this.scene.time.delayedCall(100, () => {
            this.clearTint();
        });
    }
}

// Make available globally
window.Player = Player;
