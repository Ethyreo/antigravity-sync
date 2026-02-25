/**
 * Super Sonic in the Multiverse of Madness
 * Main Entry Point
 */

import { Game } from './engine/Game.js';
import { AssetLoader } from './engine/AssetLoader.js';

// Game configuration
const CONFIG = {
    // Canvas dimensions (16-bit era resolution)
    NATIVE_WIDTH: 320,
    NATIVE_HEIGHT: 224,

    // Target frame rate
    TARGET_FPS: 60,

    // Physics constants
    GRAVITY: 0.5,
    MAX_FALL_SPEED: 16,

    // Player settings
    PLAYER: {
        MAX_SPEED: 8,
        ACCELERATION: 0.15,
        DECELERATION: 0.1,
        JUMP_FORCE: -12,
        SPIN_DASH_CHARGE_RATE: 0.5,
        SPIN_DASH_MAX_SPEED: 16
    },

    // Game settings
    STARTING_LIVES: 3,
    RING_LOSS_ON_HIT: true,
    INVINCIBILITY_FRAMES: 120, // 2 seconds at 60fps

    // Super Sonic settings
    SUPER_SONIC: {
        REQUIRED_EMERALDS: 7,
        REQUIRED_RINGS: 50,
        RING_DRAIN_RATE: 60 // frames per ring drain (1 per second)
    }
};

// Asset manifest
const ASSETS = {
    images: {
        // Player sprites
        'sonic-idle': 'assets/sprites/sonic-idle.png',
        'sonic-run': 'assets/sprites/sonic-run.png',
        'sonic-jump': 'assets/sprites/sonic-jump.png',
        'sonic-spin': 'assets/sprites/sonic-spin.png',
        'sonic-super': 'assets/sprites/sonic-super.png',

        // Items
        'ring': 'assets/sprites/ring.png',
        'emerald': 'assets/sprites/emerald.png',
        'powerup-shield': 'assets/sprites/powerup-shield.png',
        'powerup-speed': 'assets/sprites/powerup-speed.png',
        'powerup-invincibility': 'assets/sprites/powerup-invincibility.png',

        // Enemies
        'enemy-motobug': 'assets/sprites/enemy-motobug.png',
        'enemy-crabmeat': 'assets/sprites/enemy-crabmeat.png',

        // Tiles
        'tileset-greenhill': 'assets/tiles/greenhill.png',
        'tileset-neoncity': 'assets/tiles/neoncity.png',
        'tileset-lava': 'assets/tiles/lava.png',
        'tileset-frozen': 'assets/tiles/frozen.png',
        'tileset-mushroom': 'assets/tiles/mushroom.png',

        // Backgrounds
        'bg-greenhill': 'assets/backgrounds/greenhill.png',
        'bg-neoncity': 'assets/backgrounds/neoncity.png',
        'bg-lava': 'assets/backgrounds/lava.png',
        'bg-frozen': 'assets/backgrounds/frozen.png',
        'bg-mushroom': 'assets/backgrounds/mushroom.png',

        // UI
        'title-logo': 'assets/ui/title-logo.png',
        'hud-ring': 'assets/ui/hud-ring.png'
    },
    audio: {
        // Music
        'music-title': 'assets/audio/music-title.mp3',
        'music-greenhill': 'assets/audio/music-greenhill.mp3',
        'music-neoncity': 'assets/audio/music-neoncity.mp3',
        'music-lava': 'assets/audio/music-lava.mp3',
        'music-frozen': 'assets/audio/music-frozen.mp3',
        'music-mushroom': 'assets/audio/music-mushroom.mp3',
        'music-boss': 'assets/audio/music-boss.mp3',
        'music-super': 'assets/audio/music-super.mp3',

        // Sound effects
        'sfx-jump': 'assets/audio/sfx-jump.mp3',
        'sfx-ring': 'assets/audio/sfx-ring.mp3',
        'sfx-spin': 'assets/audio/sfx-spin.mp3',
        'sfx-hurt': 'assets/audio/sfx-hurt.mp3',
        'sfx-destroy': 'assets/audio/sfx-destroy.mp3',
        'sfx-powerup': 'assets/audio/sfx-powerup.mp3',
        'sfx-checkpoint': 'assets/audio/sfx-checkpoint.mp3',
        'sfx-transform': 'assets/audio/sfx-transform.mp3'
    }
};

// Global game instance
let game = null;

/**
 * Handle click-to-start overlay
 */
function setupClickToStart() {
    const overlay = document.getElementById('click-to-start');
    const canvas = document.getElementById('game-canvas');

    if (!overlay) return;

    const activateGame = () => {
        // Hide overlay
        overlay.style.display = 'none';

        // Focus canvas for keyboard input
        canvas.focus();

        console.log('🎮 Game activated! Canvas focused for keyboard input.');
    };

    // Click handler
    overlay.addEventListener('click', activateGame);

    // Key press handler
    window.addEventListener('keydown', function onFirstKey(e) {
        activateGame();
        window.removeEventListener('keydown', onFirstKey);
    }, { once: true });
}

/**
 * Initialize the game
 */
async function init() {
    console.log('🦔 Super Sonic in the Multiverse of Madness');
    console.log('Initializing game...');

    const canvas = document.getElementById('game-canvas');
    const loadingBar = document.getElementById('loading-bar');
    const loadingText = document.getElementById('loading-text');
    const loadingScreen = document.getElementById('loading-screen');

    // Set canvas size
    canvas.width = CONFIG.NATIVE_WIDTH;
    canvas.height = CONFIG.NATIVE_HEIGHT;

    // Create asset loader
    const assetLoader = new AssetLoader();

    // Update loading progress
    assetLoader.onProgress = (progress, assetName) => {
        loadingBar.style.width = `${progress * 100}%`;
        loadingText.textContent = `Loading ${assetName}...`;
    };

    try {
        // Load all assets (with fallback for missing assets)
        loadingText.textContent = 'Loading assets...';
        await assetLoader.loadAll(ASSETS);

        loadingText.textContent = 'Starting game...';
        loadingBar.style.width = '100%';

        // Create game instance
        game = new Game(canvas, CONFIG, assetLoader);

        // Hide loading screen
        await new Promise(resolve => setTimeout(resolve, 500));
        loadingScreen.classList.add('hidden');

        // Set up click-to-start
        setupClickToStart();

        // Start the game
        game.start();

        console.log('Game started successfully! 🚀');
        console.log('Controls: Arrow Keys or WASD to move, Space to jump/select');
        console.log('Press F2 for input debug, F3 for game debug');

    } catch (error) {
        console.error('Failed to initialize game:', error);
        loadingText.textContent = 'Error loading game. Check console.';
        loadingText.style.color = '#e74c3c';
    }
}

// Start when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Export for debugging
window.getGame = () => game;
window.CONFIG = CONFIG;

