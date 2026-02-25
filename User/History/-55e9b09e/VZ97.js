/**
 * GameScene.js - Main gameplay scene
 * Handles level rendering, physics, and game logic
 */

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.player = null;
        this.controls = null;
        this.platforms = null;
        this.orbs = null;
        this.score = 0;
    }

    create() {
        const { width, height } = this.scale;

        // Setup world bounds
        this.physics.world.bounds.width = 2560;
        this.physics.world.bounds.height = height;

        // Create parallax backgrounds
        this.createBackgrounds();

        // Create platforms
        this.createPlatforms();

        // Create collectibles
        this.createOrbs();

        // Create player
        this.createPlayer();

        // Setup camera
        this.setupCamera();

        // Setup controls
        this.controls = new Controls(this);

        // Create UI
        this.createUI();

        // Collision detection
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.overlap(this.player, this.orbs, this.collectOrb, null, this);
    }

    createBackgrounds() {
        const { width, height } = this.scale;

        // Far background (stars) - slowest scroll
        this.bgFar1 = this.add.image(640, height / 2, 'bg_far').setScrollFactor(0.1);
        this.bgFar2 = this.add.image(1920, height / 2, 'bg_far').setScrollFactor(0.1);

        // Mid background - medium scroll
        this.bgMid1 = this.add.image(640, height / 2, 'bg_mid').setScrollFactor(0.3).setAlpha(0.6);
        this.bgMid2 = this.add.image(1920, height / 2, 'bg_mid').setScrollFactor(0.3).setAlpha(0.6);

        // Add atmospheric glow
        const glow = this.add.graphics();
        glow.fillGradientStyle(0x8b5cf6, 0x06b6d4, 0x8b5cf6, 0x06b6d4, 0.1);
        glow.fillRect(0, height - 100, 2560, 100);
        glow.setScrollFactor(0);
        glow.setDepth(1);
    }

    createPlatforms() {
        this.platforms = this.physics.add.staticGroup();

        const { height } = this.scale;

        // Ground floor
        for (let x = 0; x < 2560; x += 64) {
            const ground = this.platforms.create(x + 32, height - 32, 'ground');
            ground.setScale(1).refreshBody();
        }

        // Floating platforms - create an interesting level layout
        const platformData = [
            // Starting area
            { x: 200, y: height - 150, width: 3 },
            { x: 400, y: height - 250, width: 2 },
            { x: 600, y: height - 180, width: 2 },

            // First jump section
            { x: 850, y: height - 280, width: 2 },
            { x: 1050, y: height - 350, width: 3 },
            { x: 1300, y: height - 280, width: 2 },

            // Mid section with variety
            { x: 1500, y: height - 200, width: 4 },
            { x: 1750, y: height - 320, width: 2 },
            { x: 1950, y: height - 250, width: 2 },
            { x: 2150, y: height - 380, width: 3 },

            // End area
            { x: 2350, y: height - 200, width: 4 }
        ];

        platformData.forEach(data => {
            for (let i = 0; i < data.width; i++) {
                const platform = this.platforms.create(
                    data.x + (i * 64),
                    data.y,
                    'platform'
                );
                platform.setScale(1).refreshBody();
            }
        });
    }

    createOrbs() {
        this.orbs = this.physics.add.group();

        const { height } = this.scale;

        // Place orbs above platforms
        const orbPositions = [
            { x: 200, y: height - 200 },
            { x: 400, y: height - 300 },
            { x: 600, y: height - 230 },
            { x: 850, y: height - 330 },
            { x: 1050, y: height - 400 },
            { x: 1300, y: height - 330 },
            { x: 1500, y: height - 250 },
            { x: 1600, y: height - 250 },
            { x: 1750, y: height - 370 },
            { x: 1950, y: height - 300 },
            { x: 2150, y: height - 430 },
            { x: 2350, y: height - 250 },
            { x: 2450, y: height - 250 }
        ];

        orbPositions.forEach(pos => {
            const orb = this.orbs.create(pos.x, pos.y, 'orb');
            orb.setBounce(0);
            orb.body.setAllowGravity(false);

            // Floating animation
            this.tweens.add({
                targets: orb,
                y: orb.y - 10,
                duration: 1500 + Math.random() * 500,
                ease: 'Sine.easeInOut',
                yoyo: true,
                repeat: -1
            });

            // Glow pulse
            this.tweens.add({
                targets: orb,
                alpha: 0.7,
                duration: 800,
                ease: 'Sine.easeInOut',
                yoyo: true,
                repeat: -1
            });
        });
    }

    createPlayer() {
        // Spawn player at starting position
        this.player = new Player(this, 100, this.scale.height - 150);
    }

    setupCamera() {
        // Follow player with smooth lerp
        this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
        this.cameras.main.setBounds(0, 0, 2560, this.scale.height);

        // Slight deadzone for smoother feel
        this.cameras.main.setDeadzone(100, 100);
    }

    createUI() {
        // Score display (fixed to camera)
        this.scoreText = this.add.text(20, 20, 'Orbs: 0', {
            fontFamily: 'Orbitron, sans-serif',
            fontSize: '24px',
            color: '#c4b5fd',
            stroke: '#1e1b4b',
            strokeThickness: 4
        }).setScrollFactor(0).setDepth(100);

        // Controls hint (bottom)
        this.add.text(this.scale.width / 2, this.scale.height - 20,
            '← → Move  |  ↑/SPACE Jump  |  SHIFT Dash  |  ESC Pause', {
            fontFamily: 'Quicksand, sans-serif',
            fontSize: '14px',
            color: '#64748b'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(100);
    }

    collectOrb(player, orb) {
        // Visual feedback
        this.cameras.main.flash(100, 139, 92, 246, false);

        // Particle burst
        const particles = this.add.particles(orb.x, orb.y, 'particle', {
            speed: { min: 100, max: 200 },
            scale: { start: 0.6, end: 0 },
            alpha: { start: 1, end: 0 },
            lifespan: 500,
            blendMode: 'ADD',
            quantity: 15
        });

        this.time.delayedCall(500, () => particles.destroy());

        // Update score
        this.score++;
        this.scoreText.setText(`Orbs: ${this.score}`);

        // Player feedback
        player.collect();

        // Remove orb
        orb.destroy();

        // Check win condition
        if (this.orbs.countActive() === 0) {
            this.showVictory();
        }
    }

    showVictory() {
        const { width, height } = this.scale;

        // Freeze player
        this.controls.disable();
        this.player.setVelocity(0, 0);

        // Victory overlay
        const overlay = this.add.rectangle(
            this.cameras.main.scrollX + width / 2,
            height / 2,
            width, height,
            0x000000, 0.7
        ).setScrollFactor(0).setDepth(200);

        const victoryText = this.add.text(
            this.cameras.main.scrollX + width / 2,
            height / 2 - 50,
            '🎉 LEVEL COMPLETE! 🎉',
            {
                fontFamily: 'Orbitron, sans-serif',
                fontSize: '48px',
                color: '#ffffff',
                stroke: '#8b5cf6',
                strokeThickness: 4
            }
        ).setOrigin(0.5).setScrollFactor(0).setDepth(201);

        const subtitleText = this.add.text(
            this.cameras.main.scrollX + width / 2,
            height / 2 + 20,
            `Collected all ${this.score} orbs!`,
            {
                fontFamily: 'Quicksand, sans-serif',
                fontSize: '28px',
                color: '#c4b5fd'
            }
        ).setOrigin(0.5).setScrollFactor(0).setDepth(201);

        const returnText = this.add.text(
            this.cameras.main.scrollX + width / 2,
            height / 2 + 80,
            'Press ENTER to return to menu',
            {
                fontFamily: 'Quicksand, sans-serif',
                fontSize: '20px',
                color: '#64748b'
            }
        ).setOrigin(0.5).setScrollFactor(0).setDepth(201);

        // Listen for return
        this.input.keyboard.once('keydown-ENTER', () => {
            this.scene.start('MenuScene');
        });
    }

    update() {
        // Update player
        if (this.player && this.controls) {
            this.player.update(this.controls);

            // Handle pause
            if (this.controls.pause) {
                this.scene.launch('PauseScene');
                this.scene.pause();
            }
        }

        // Check if player fell
        if (this.player && this.player.y > this.scale.height + 100) {
            this.respawnPlayer();
        }
    }

    respawnPlayer() {
        this.cameras.main.flash(500, 255, 100, 100);
        this.player.setPosition(100, this.scale.height - 150);
        this.player.setVelocity(0, 0);
    }
}

// Make available globally
window.GameScene = GameScene;
