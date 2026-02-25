/**
 * Integration Tests for Super Sonic Game
 * Tests that all components work together properly
 */

import { Game } from './js/engine/Game.js';
import { AssetLoader } from './js/engine/AssetLoader.js';

// Test configuration
const CONFIG = {
    NATIVE_WIDTH: 320,
    NATIVE_HEIGHT: 224,
    TARGET_FPS: 60,
    GRAVITY: 0.5,
    MAX_FALL_SPEED: 16,
    PLAYER: {
        MAX_SPEED: 8,
        ACCELERATION: 0.15,
        DECELERATION: 0.1,
        JUMP_FORCE: -12,
        SPIN_DASH_CHARGE_RATE: 0.5,
        SPIN_DASH_MAX_SPEED: 16
    },
    STARTING_LIVES: 3,
    RING_LOSS_ON_HIT: true,
    INVINCIBILITY_FRAMES: 120,
    SUPER_SONIC: {
        REQUIRED_EMERALDS: 7,
        REQUIRED_RINGS: 50,
        RING_DRAIN_RATE: 60
    }
};

// Results tracking
const Results = {
    passed: 0,
    failed: 0,
    errors: []
};

function log(msg, type = 'info') {
    const styles = {
        info: 'color: #3498db',
        pass: 'color: #2ecc71; font-weight: bold',
        fail: 'color: #e74c3c; font-weight: bold',
        warn: 'color: #f39c12'
    };
    console.log(`%c${msg}`, styles[type] || '');
}

function assert(condition, testName, message = '') {
    if (condition) {
        log(`✅ ${testName}`, 'pass');
        Results.passed++;
    } else {
        log(`❌ ${testName}: ${message}`, 'fail');
        Results.failed++;
        Results.errors.push({ test: testName, message });
    }
}

// ==========================================
// INTEGRATION TESTS
// ==========================================

async function testGameInitialization() {
    log('\n🎮 GAME INITIALIZATION TEST', 'info');
    log('============================', 'info');

    // Create a test canvas
    const canvas = document.createElement('canvas');
    canvas.width = CONFIG.NATIVE_WIDTH;
    canvas.height = CONFIG.NATIVE_HEIGHT;
    document.body.appendChild(canvas);

    try {
        // Create asset loader
        const assetLoader = new AssetLoader();
        assert(assetLoader !== null, 'AssetLoader created');

        // Load minimal assets
        await assetLoader.loadAll({ images: {}, audio: {} });
        assert(true, 'AssetLoader.loadAll completes without error');

        // Create game
        const game = new Game(canvas, CONFIG, assetLoader);
        assert(game !== null, 'Game instance created');
        assert(game.state === 'loading', 'Game starts in loading state');

        // Start game
        game.start();
        assert(game.state === 'menu', 'Game transitions to menu state');
        assert(game.running === true, 'Game is running');

        // Stop for cleanup
        game.running = false;

        // Clean up
        document.body.removeChild(canvas);

        return game;
    } catch (e) {
        assert(false, 'Game initialization', e.message);
        console.error(e);
        return null;
    }
}

async function testNewGame() {
    log('\n🆕 NEW GAME TEST', 'info');
    log('=================', 'info');

    const canvas = document.createElement('canvas');
    canvas.width = CONFIG.NATIVE_WIDTH;
    canvas.height = CONFIG.NATIVE_HEIGHT;

    try {
        const assetLoader = new AssetLoader();
        await assetLoader.loadAll({ images: {}, audio: {} });

        const game = new Game(canvas, CONFIG, assetLoader);
        game.start();

        // Start new game
        game.newGame();

        assert(game.state === 'playing', 'State changes to playing');
        assert(game.player !== null, 'Player is created');
        assert(game.score === 0, 'Score is reset to 0');
        assert(game.rings === 0, 'Rings are reset to 0');
        assert(game.lives === CONFIG.STARTING_LIVES, 'Lives are set correctly');
        assert(game.levelManager.currentLevelNumber === 1, 'Level 1 is loaded');

        // Check player position
        const spawn = game.levelManager.getSpawnPoint();
        assert(game.player.x === spawn.x, 'Player spawns at correct X');
        assert(game.player.y === spawn.y, 'Player spawns at correct Y');

        // Check entities are spawned
        assert(game.rings_items.length > 0, 'Rings are spawned');
        assert(game.enemies.length > 0, 'Enemies are spawned');
        assert(game.powerups.length > 0, 'Power-ups are spawned');

        game.running = false;
        return game;
    } catch (e) {
        assert(false, 'New game test', e.message);
        console.error(e);
        return null;
    }
}

async function testPlayerMovement() {
    log('\n🏃 PLAYER MOVEMENT TEST', 'info');
    log('========================', 'info');

    const canvas = document.createElement('canvas');
    canvas.width = CONFIG.NATIVE_WIDTH;
    canvas.height = CONFIG.NATIVE_HEIGHT;

    try {
        const assetLoader = new AssetLoader();
        await assetLoader.loadAll({ images: {}, audio: {} });

        const game = new Game(canvas, CONFIG, assetLoader);
        game.start();
        game.newGame();

        const player = game.player;
        const initialX = player.x;
        const initialY = player.y;

        // Simulate movement input
        game.input.keys['ArrowRight'] = true;

        // Run a few update frames
        for (let i = 0; i < 30; i++) {
            game.update(1);
        }

        assert(player.velocityX > 0, 'Player gains positive X velocity');
        assert(player.x > initialX, 'Player moves right');

        // Test gravity
        game.input.keys = {};
        const preJumpY = player.y;

        // Make player airborne
        player.grounded = false;
        player.velocityY = -10;

        for (let i = 0; i < 10; i++) {
            game.update(1);
        }

        assert(player.velocityY > -10, 'Gravity increases Y velocity');

        game.running = false;
        return game;
    } catch (e) {
        assert(false, 'Player movement test', e.message);
        console.error(e);
        return null;
    }
}

async function testRingCollection() {
    log('\n💍 RING COLLECTION TEST', 'info');
    log('========================', 'info');

    const canvas = document.createElement('canvas');
    canvas.width = CONFIG.NATIVE_WIDTH;
    canvas.height = CONFIG.NATIVE_HEIGHT;

    try {
        const assetLoader = new AssetLoader();
        await assetLoader.loadAll({ images: {}, audio: {} });

        const game = new Game(canvas, CONFIG, assetLoader);
        game.start();
        game.newGame();

        const initialRings = game.rings;
        const initialScore = game.score;

        // Place a ring right on the player
        if (game.rings_items.length > 0) {
            const ring = game.rings_items[0];
            ring.x = game.player.x + game.player.width / 2;
            ring.y = game.player.y + game.player.height / 2;

            // Run collision check
            game.checkCollisions();

            assert(ring.collected === true, 'Ring is marked as collected');
            assert(game.rings === initialRings + 1, 'Ring count increases');
            assert(game.score > initialScore, 'Score increases');
        } else {
            assert(false, 'Ring collection', 'No rings spawned');
        }

        game.running = false;
    } catch (e) {
        assert(false, 'Ring collection test', e.message);
        console.error(e);
    }
}

async function testEnemyCollision() {
    log('\n👾 ENEMY COLLISION TEST', 'info');
    log('========================', 'info');

    const canvas = document.createElement('canvas');
    canvas.width = CONFIG.NATIVE_WIDTH;
    canvas.height = CONFIG.NATIVE_HEIGHT;

    try {
        const assetLoader = new AssetLoader();
        await assetLoader.loadAll({ images: {}, audio: {} });

        const game = new Game(canvas, CONFIG, assetLoader);
        game.start();
        game.newGame();

        // Give player some rings
        game.rings = 10;

        if (game.enemies.length > 0) {
            const enemy = game.enemies[0];

            // Test getting hurt (player not attacking)
            game.player.x = enemy.x;
            game.player.y = enemy.y;
            game.player.state = 'running';

            game.checkCollisions();

            assert(game.player.invincible === true, 'Player becomes invincible after hit');

            // Test killing enemy (player attacking from above)
            const enemy2 = game.enemies.find(e => !e.isDead);
            if (enemy2) {
                game.player.x = enemy2.x;
                game.player.y = enemy2.y - 30;
                game.player.state = 'jumping';
                game.player.invincible = false;
                game.player.invincibilityTimer = 0;

                game.checkCollisions();

                assert(enemy2.isDead === true, 'Enemy is destroyed when attacked');
            }
        } else {
            log('No enemies to test', 'warn');
        }

        game.running = false;
    } catch (e) {
        assert(false, 'Enemy collision test', e.message);
        console.error(e);
    }
}

async function testLevelProgression() {
    log('\n🎯 LEVEL PROGRESSION TEST', 'info');
    log('==========================', 'info');

    const canvas = document.createElement('canvas');
    canvas.width = CONFIG.NATIVE_WIDTH;
    canvas.height = CONFIG.NATIVE_HEIGHT;

    try {
        const assetLoader = new AssetLoader();
        await assetLoader.loadAll({ images: {}, audio: {} });

        const game = new Game(canvas, CONFIG, assetLoader);
        game.start();
        game.newGame();

        // Move player to goal
        const goal = game.levelManager.goal;
        game.player.x = goal.x;

        // Update to trigger goal check
        game.updatePlaying(1);

        assert(game.player.reachedGoal === true, 'Player reaches goal');

        // Check game conditions should trigger level complete
        game.checkGameConditions();

        assert(game.state === 'level_complete', 'State changes to level complete');

        game.running = false;
    } catch (e) {
        assert(false, 'Level progression test', e.message);
        console.error(e);
    }
}

async function testPauseResume() {
    log('\n⏸️ PAUSE/RESUME TEST', 'info');
    log('=====================', 'info');

    const canvas = document.createElement('canvas');
    canvas.width = CONFIG.NATIVE_WIDTH;
    canvas.height = CONFIG.NATIVE_HEIGHT;

    try {
        const assetLoader = new AssetLoader();
        await assetLoader.loadAll({ images: {}, audio: {} });

        const game = new Game(canvas, CONFIG, assetLoader);
        game.start();
        game.newGame();

        // Pause
        game.pause();
        assert(game.state === 'paused', 'Game pauses correctly');

        // Resume
        game.resume();
        assert(game.state === 'playing', 'Game resumes correctly');

        game.running = false;
    } catch (e) {
        assert(false, 'Pause/resume test', e.message);
        console.error(e);
    }
}

async function testSaveLoad() {
    log('\n💾 SAVE/LOAD TEST', 'info');
    log('==================', 'info');

    const canvas = document.createElement('canvas');
    canvas.width = CONFIG.NATIVE_WIDTH;
    canvas.height = CONFIG.NATIVE_HEIGHT;

    try {
        const assetLoader = new AssetLoader();
        await assetLoader.loadAll({ images: {}, audio: {} });

        const game = new Game(canvas, CONFIG, assetLoader);
        game.start();
        game.newGame();

        // Add some score
        game.score = 50000;

        // Save high score
        game.storage.saveHighScore(game.score, 'TST');

        // Load and verify
        const scores = game.storage.getHighScores();
        assert(scores.some(s => s.score === 50000), 'High score is saved and retrievable');

        // Save level progress
        game.storage.saveLevelProgress(3, 100000);
        const progress = game.storage.loadProgress();
        assert(progress.currentLevel >= 1, 'Level progress saves');

        // Clear for cleanup
        game.storage.clearAll();

        game.running = false;
    } catch (e) {
        assert(false, 'Save/load test', e.message);
        console.error(e);
    }
}

// Run all integration tests
async function runIntegrationTests() {
    log('🦔 SUPER SONIC INTEGRATION TEST SUITE', 'info');
    log('======================================', 'info');
    log('Running comprehensive integration tests...\n', 'info');

    const startTime = Date.now();

    await testGameInitialization();
    await testNewGame();
    await testPlayerMovement();
    await testRingCollection();
    await testEnemyCollision();
    await testLevelProgression();
    await testPauseResume();
    await testSaveLoad();

    const duration = Date.now() - startTime;

    log('\n======================================', 'info');
    log('📊 INTEGRATION TEST RESULTS', 'info');
    log('======================================', 'info');
    log(`✅ Passed: ${Results.passed}`, Results.passed > 0 ? 'pass' : 'info');
    log(`❌ Failed: ${Results.failed}`, Results.failed > 0 ? 'fail' : 'pass');
    log(`⏱️ Duration: ${duration}ms`, 'info');

    if (Results.errors.length > 0) {
        log('\n❌ FAILED TESTS:', 'fail');
        Results.errors.forEach(err => {
            log(`  - ${err.test}: ${err.message}`, 'fail');
        });
    } else {
        log('\n🎉 All integration tests passed!', 'pass');
    }

    // Update UI
    const resultsDiv = document.getElementById('integration-results');
    if (resultsDiv) {
        resultsDiv.innerHTML = `
            <h2>Integration Test Results</h2>
            <p style="color: ${Results.passed > 0 ? 'green' : 'gray'};">✅ Passed: ${Results.passed}</p>
            <p style="color: ${Results.failed > 0 ? 'red' : 'green'};">❌ Failed: ${Results.failed}</p>
            <p>⏱️ Duration: ${duration}ms</p>
            ${Results.errors.length > 0 ? `
                <h3 style="color: red;">Failed Tests:</h3>
                <ul style="color: red;">
                    ${Results.errors.map(e => `<li>${e.test}: ${e.message}</li>`).join('')}
                </ul>
            ` : '<p style="color: green;">🎉 All tests passed!</p>'}
        `;
    }

    return Results;
}

// Export and auto-run
window.runIntegrationTests = runIntegrationTests;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runIntegrationTests);
} else {
    setTimeout(runIntegrationTests, 100);
}

export { runIntegrationTests };
