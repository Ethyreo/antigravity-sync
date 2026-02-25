/**
 * main.js - Rift Runners Game Configuration
 * Initializes Phaser 3 and starts the game
 */

// Game configuration
const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: 1280,
    height: 720,
    backgroundColor: '#0a0a0f',
    pixelArt: false,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1000 },
            debug: false
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [
        BootScene,
        MenuScene,
        GameScene,
        PauseScene
    ]
};

// Create game instance
const game = new Phaser.Game(config);

// Handle visibility changes (pause when tab is hidden)
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        game.scene.pause('GameScene');
    }
});

// Prevent context menu on right-click
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

console.log('🎮 Rift Runners - Loaded successfully!');
