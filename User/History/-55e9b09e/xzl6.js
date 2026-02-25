/**
 * GameScene.js - Main gameplay scene
 * Handles level rendering, physics, and game logic
 */

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.player = null;
        this.controls = null;
        this.dimensionManager = null;
        this.platforms = null;
        this.orbs = null;
        this.score = 0;
    }

    create() {
        const { width, height } = this.scale;

        // Setup world bounds
        this.physics.world.bounds.width = 2560;
        this.physics.world.bounds.height = height;

        // Initialize Dimension Manager
        this.dimensionManager = new DimensionManager(this);

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

        // Listen for dimension events
        this.dimensionManager.events.on('dimensionChanged', this.onDimensionChanged, this);

        // Initial dimension setup
        this.onDimensionChanged(this.dimensionManager.currentDimension);
    }

    createBackgrounds() {
        const { width, height } = this.scale;

        // Far background (stars) - moves independently
        this.bgFar1 = this.add.image(640, height / 2, 'bg_far').setScrollFactor(0.1);
        this.bgFar2 = this.add.image(1920, height / 2, 'bg_far').setScrollFactor(0.1);

        // Add dimension-specific backgrounds (layer 2)
        // Fantasy Layer
        this.bgFantasy1 = this.add.image(640, height / 2, 'bg_mid').setScrollFactor(0.3).setTint(0x8b5cf6);
        this.bgFantasy2 = this.add.image(1920, height / 2, 'bg_mid').setScrollFactor(0.3).setTint(0x8b5cf6);

        // Sci-Fi Layer (initially hidden)
        this.bgSciFi1 = this.add.image(640, height / 2, 'bg_mid').setScrollFactor(0.3).setTint(0x06b6d4);
        this.bgSciFi2 = this.add.image(1920, height / 2, 'bg_mid').setScrollFactor(0.3).setTint(0x06b6d4);

        // Add atmospheric glow
        this.glow = this.add.graphics();
        this.glow.fillGradientStyle(0x8b5cf6, 0x06b6d4, 0x8b5cf6, 0x06b6d4, 0.1);
        this.glow.fillRect(0, height - 100, 2560, 100);
        this.glow.setScrollFactor(0);
        this.glow.setDepth(1);
    }

    createPlatforms() {
        this.platforms = this.physics.add.staticGroup();

        const { height } = this.scale;

        // Define Platform Data: x, y, width, dimension ('both', 'fantasy', 'scifi')
        const platformData = [
            // Starting ground (Both)
            { x: 200, y: height - 32, width: 8, type: 'both' },

            // First jump (Fantasy Only)
            { x: 600, y: height - 150, width: 3, type: 'fantasy' },

            // Alternate path (Sci-Fi Only)
            { x: 600, y: height - 250, width: 3, type: 'scifi' },

            // Connection (Both)
            { x: 900, y: height - 300, width: 2, type: 'both' },

            // Gap requiring swap
            { x: 1200, y: height - 350, width: 3, type: 'fantasy' },
            { x: 1400, y: height - 250, width: 3, type: 'scifi' },

            // High path
            { x: 1700, y: height - 400, width: 4, type: 'fantasy' },

            // Low path
            { x: 1700, y: height - 200, width: 4, type: 'scifi' },

            // End platform
            { x: 2300, y: height - 200, width: 6, type: 'both' }
        ];

        platformData.forEach(data => {
            const texture = data.type === 'scifi' ? 'platform_scifi' :
                data.type === 'fantasy' ? 'platform_fantasy' : 'platform';

            for (let i = 0; i < data.width; i++) {
                const platform = this.platforms.create(
                    data.x + (i * 64),
                    data.y,
                    texture
                );

                // Store dimension type in the game object
                platform.dimensionType = data.type;
                platform.setScale(1).refreshBody();

                // Add visual hints
                if (data.type === 'fantasy') platform.setTint(0xc4b5fd);
                if (data.type === 'scifi') platform.setTint(0x67e8f9);
            }
        });
    }

    createOrbs() {
        this.orbs = this.physics.add.group();

        // Orbs exist in BOTH dimensions for now
        const orbPositions = [
            { x: 600, y: height - 200 }, // Over fantasy
            { x: 600, y: height - 300 }, // Over scifi
            { x: 1200, y: height - 400 },
            { x: 1400, y: height - 300 },
            { x: 2300, y: height - 250 }
        ];

        const { height } = this.scale;

        orbPositions.forEach(pos => {
            const orb = this.orbs.create(pos.x, pos.y, 'orb');
            orb.setBounce(0);
            orb.body.setAllowGravity(false);

            this.tweens.add({
                targets: orb,
                y: orb.y - 10,
                duration: 1500 + Math.random() * 500,
                ease: 'Sine.easeInOut',
                yoyo: true,
                repeat: -1
            });
        });
    }

    createPlayer() {
        this.player = new Player(this, 100, this.scale.height - 150);
    }

    setupCamera() {
        this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
        this.cameras.main.setBounds(0, 0, 2560, this.scale.height);
        this.cameras.main.setDeadzone(100, 100);
    }

    createUI() {
        this.scoreText = this.add.text(20, 20, 'Orbs: 0', {
            fontFamily: 'Orbitron, sans-serif',
            fontSize: '24px',
            color: '#c4b5fd',
            stroke: '#1e1b4b',
            strokeThickness: 4
        }).setScrollFactor(0).setDepth(100);

        this.dimensionText = this.add.text(20, 60, 'Dimension: FANTASY', {
            fontFamily: 'Orbitron, sans-serif',
            fontSize: '20px',
            color: '#c4b5fd',
            stroke: '#1e1b4b',
            strokeThickness: 4
        }).setScrollFactor(0).setDepth(100);

        this.add.text(this.scale.width / 2, this.scale.height - 20,
            '← → Move | SPACE Jump | SHIFT Dash | E Swap Dimension', {
            fontFamily: 'Quicksand, sans-serif',
            fontSize: '14px',
            color: '#64748b'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(100);
    }

    onDimensionChanged(dimension) {
        // Update UI
        this.dimensionText.setText(`Dimension: ${dimension.toUpperCase()}`);
        this.dimensionText.setColor(dimension === 'fantasy' ? '#c4b5fd' : '#67e8f9');

        // Update Backgrounds
        if (dimension === 'fantasy') {
            this.bgFantasy1.setAlpha(1);
            this.bgFantasy2.setAlpha(1);
            this.bgSciFi1.setAlpha(0);
            this.bgSciFi2.setAlpha(0);
        } else {
            this.bgFantasy1.setAlpha(0);
            this.bgFantasy2.setAlpha(0);
            this.bgSciFi1.setAlpha(1);
            this.bgSciFi2.setAlpha(1);
        }

        // Update Platforms visibility and collision
        this.platforms.children.iterate((platform) => {
            const isVisible = this.dimensionManager.isVisibleInCurrent(platform.dimensionType);

            platform.setVisible(isVisible);

            // Enable/Disable collision body
            if (isVisible) {
                // If previously disabled, we need to re-enable
                platform.body.checkCollision.none = false;
            } else {
                platform.body.checkCollision.none = true;
            }

            // Visual transparency for 'ghost' platforms (optional game design choice)
            // For now, we hide them completely
        });
    }

    collectOrb(player, orb) {
        this.score++;
        this.scoreText.setText(`Orbs: ${this.score}`);
        player.collect();
        orb.destroy();

        if (this.orbs.countActive() === 0) {
            this.showVictory();
        }
    }

    showVictory() {
        // (Same victory logic as before)
        const { width, height } = this.scale;
        this.controls.disable();
        this.player.setVelocity(0, 0);

        this.add.text(
            this.cameras.main.scrollX + width / 2,
            height / 2,
            'LEVEL COMPLETE!',
            { fontFamily: 'Orbitron', fontSize: '48px', color: '#fff' }
        ).setOrigin(0.5).setDepth(200);

        this.input.keyboard.once('keydown-ENTER', () => this.scene.start('MenuScene'));
    }

    update() {
        if (this.player && this.controls) {
            this.player.update(this.controls);

            // Handle Dimension Swap
            if (this.controls.swap) {
                this.dimensionManager.swap();
            }

            if (this.controls.pause) {
                this.scene.launch('PauseScene');
                this.scene.pause();
            }
        }

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

window.GameScene = GameScene;
