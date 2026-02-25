/**
 * BootScene.js - Asset loading and initialization
 * Loads all game assets and shows loading progress
 */

class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        // Get loading bar elements
        const loadingBar = document.querySelector('.loading-bar');
        const loadingText = document.querySelector('.loading-text');

        // Update loading progress
        this.load.on('progress', (value) => {
            const percent = Math.round(value * 100);
            if (loadingBar) {
                loadingBar.style.width = `${percent}%`;
            }
            if (loadingText) {
                loadingText.textContent = `Loading dimensions... ${percent}%`;
            }
        });

        // Create placeholder graphics for sprites
        this.createPlaceholderGraphics();
    }

    createPlaceholderGraphics() {
        // Player sprite (will be replaced with actual assets)
        const playerGraphics = this.make.graphics({ x: 0, y: 0, add: false });

        // Body gradient (fantasy purple to sci-fi cyan)
        playerGraphics.fillStyle(0x8b5cf6, 1);
        playerGraphics.fillRoundedRect(0, 0, 48, 64, 8);

        // Glowing core
        playerGraphics.fillStyle(0x06b6d4, 1);
        playerGraphics.fillCircle(24, 24, 10);

        // Eyes
        playerGraphics.fillStyle(0xffffff, 1);
        playerGraphics.fillCircle(16, 20, 5);
        playerGraphics.fillCircle(32, 20, 5);
        playerGraphics.fillStyle(0x0f172a, 1);
        playerGraphics.fillCircle(17, 20, 2);
        playerGraphics.fillCircle(33, 20, 2);

        playerGraphics.generateTexture('player', 48, 64);
        playerGraphics.destroy();

        // Platform tile
        const platformGraphics = this.make.graphics({ x: 0, y: 0, add: false });

        // Main platform body
        platformGraphics.fillStyle(0x1e293b, 1);
        platformGraphics.fillRoundedRect(0, 0, 64, 32, 4);

        // Top highlight
        platformGraphics.fillStyle(0x334155, 1);
        platformGraphics.fillRect(2, 2, 60, 4);

        // Circuit pattern
        platformGraphics.lineStyle(1, 0x06b6d4, 0.5);
        platformGraphics.lineBetween(8, 16, 56, 16);
        platformGraphics.lineBetween(32, 8, 32, 24);

        // Glowing edges
        platformGraphics.lineStyle(2, 0x8b5cf6, 0.6);
        platformGraphics.strokeRoundedRect(0, 0, 64, 32, 4);

        platformGraphics.generateTexture('platform', 64, 32);
        platformGraphics.destroy();

        // Ground tile (wider)
        const groundGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        groundGraphics.fillStyle(0x1e293b, 1);
        groundGraphics.fillRect(0, 0, 64, 64);
        groundGraphics.fillStyle(0x334155, 1);
        groundGraphics.fillRect(0, 0, 64, 8);

        // Rune pattern
        groundGraphics.lineStyle(1, 0x8b5cf6, 0.3);
        groundGraphics.strokeCircle(32, 40, 12);

        groundGraphics.generateTexture('ground', 64, 64);
        groundGraphics.destroy();

        // Particle
        const particleGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        particleGraphics.fillStyle(0xffffff, 1);
        particleGraphics.fillCircle(4, 4, 4);
        particleGraphics.generateTexture('particle', 8, 8);
        particleGraphics.destroy();

        // Collectible orb
        const orbGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        orbGraphics.fillStyle(0x8b5cf6, 1);
        orbGraphics.fillCircle(16, 16, 16);
        orbGraphics.fillStyle(0xc4b5fd, 0.8);
        orbGraphics.fillCircle(12, 12, 6);
        orbGraphics.generateTexture('orb', 32, 32);
        orbGraphics.destroy();

        // Background layers
        this.createBackgroundLayers();
    }

    createBackgroundLayers() {
        // Far background (stars/nebula)
        const bg1 = this.make.graphics({ x: 0, y: 0, add: false });
        bg1.fillGradientStyle(0x0f0c29, 0x0f0c29, 0x1a1a2e, 0x16213e);
        bg1.fillRect(0, 0, 1280, 720);

        // Add stars
        for (let i = 0; i < 100; i++) {
            const x = Math.random() * 1280;
            const y = Math.random() * 720;
            const size = Math.random() * 2 + 1;
            bg1.fillStyle(0xffffff, Math.random() * 0.5 + 0.3);
            bg1.fillCircle(x, y, size);
        }
        bg1.generateTexture('bg_far', 1280, 720);
        bg1.destroy();

        // Mid background (floating islands silhouette)
        const bg2 = this.make.graphics({ x: 0, y: 0, add: false });
        bg2.fillStyle(0x1e1b4b, 0.6);

        // Floating islands
        bg2.fillRoundedRect(100, 500, 200, 40, 20);
        bg2.fillRoundedRect(400, 450, 150, 35, 15);
        bg2.fillRoundedRect(700, 520, 180, 45, 20);
        bg2.fillRoundedRect(1000, 480, 160, 38, 18);

        bg2.generateTexture('bg_mid', 1280, 720);
        bg2.destroy();
    }

    create() {
        // Simulate loading time for visual effect
        this.time.delayedCall(500, () => {
            // Hide loading screen
            const loadingScreen = document.getElementById('loading-screen');
            if (loadingScreen) {
                loadingScreen.classList.add('hidden');
            }

            // Start menu scene
            this.scene.start('MenuScene');
        });
    }
}

// Make available globally
window.BootScene = BootScene;
