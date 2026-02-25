/**
 * Super Sonic Game Test Suite
 * Tests core game functionality
 * 
 * Run tests by opening test.html in browser and checking console
 */

// Test Results
const TestResults = {
    passed: 0,
    failed: 0,
    errors: []
};

// Test utilities
function assert(condition, testName, message = '') {
    if (condition) {
        console.log(`✅ PASS: ${testName}`);
        TestResults.passed++;
    } else {
        console.error(`❌ FAIL: ${testName}${message ? ' - ' + message : ''}`);
        TestResults.failed++;
        TestResults.errors.push({ test: testName, message });
    }
}

function assertEqual(actual, expected, testName) {
    assert(actual === expected, testName, `Expected ${expected}, got ${actual}`);
}

function assertExists(value, testName) {
    assert(value !== undefined && value !== null, testName, 'Value is undefined or null');
}

// Test Groups
const Tests = {
    // ==========================================
    // MODULE LOADING TESTS
    // ==========================================
    async testModulesLoad() {
        console.log('\n📦 MODULE LOADING TESTS');
        console.log('========================');

        try {
            const { Game } = await import('./js/engine/Game.js');
            assertExists(Game, 'Game module loads');
        } catch (e) {
            assert(false, 'Game module loads', e.message);
        }

        try {
            const { Input } = await import('./js/engine/Input.js');
            assertExists(Input, 'Input module loads');
        } catch (e) {
            assert(false, 'Input module loads', e.message);
        }

        try {
            const { Camera } = await import('./js/engine/Camera.js');
            assertExists(Camera, 'Camera module loads');
        } catch (e) {
            assert(false, 'Camera module loads', e.message);
        }

        try {
            const { Audio } = await import('./js/engine/Audio.js');
            assertExists(Audio, 'Audio module loads');
        } catch (e) {
            assert(false, 'Audio module loads', e.message);
        }

        try {
            const { AssetLoader } = await import('./js/engine/AssetLoader.js');
            assertExists(AssetLoader, 'AssetLoader module loads');
        } catch (e) {
            assert(false, 'AssetLoader module loads', e.message);
        }

        try {
            const { Player } = await import('./js/entities/Player.js');
            assertExists(Player, 'Player module loads');
        } catch (e) {
            assert(false, 'Player module loads', e.message);
        }

        try {
            const { Ring } = await import('./js/entities/Ring.js');
            assertExists(Ring, 'Ring module loads');
        } catch (e) {
            assert(false, 'Ring module loads', e.message);
        }

        try {
            const { Enemy } = await import('./js/entities/Enemy.js');
            assertExists(Enemy, 'Enemy module loads');
        } catch (e) {
            assert(false, 'Enemy module loads', e.message);
        }

        try {
            const { PowerUp } = await import('./js/entities/PowerUp.js');
            assertExists(PowerUp, 'PowerUp module loads');
        } catch (e) {
            assert(false, 'PowerUp module loads', e.message);
        }

        try {
            const { LevelManager } = await import('./js/levels/LevelManager.js');
            assertExists(LevelManager, 'LevelManager module loads');
        } catch (e) {
            assert(false, 'LevelManager module loads', e.message);
        }

        try {
            const { HUD } = await import('./js/ui/HUD.js');
            assertExists(HUD, 'HUD module loads');
        } catch (e) {
            assert(false, 'HUD module loads', e.message);
        }

        try {
            const { Menu } = await import('./js/ui/Menu.js');
            assertExists(Menu, 'Menu module loads');
        } catch (e) {
            assert(false, 'Menu module loads', e.message);
        }

        try {
            const { Storage } = await import('./js/utils/Storage.js');
            assertExists(Storage, 'Storage module loads');
        } catch (e) {
            assert(false, 'Storage module loads', e.message);
        }
    },

    // ==========================================
    // CAMERA TESTS
    // ==========================================
    async testCamera() {
        console.log('\n📷 CAMERA TESTS');
        console.log('================');

        const { Camera } = await import('./js/engine/Camera.js');
        const camera = new Camera(320, 224);

        assertExists(camera, 'Camera instantiates');
        assertEqual(camera.viewWidth, 320, 'Camera has correct view width');
        assertEqual(camera.viewHeight, 224, 'Camera has correct view height');

        // Test bounds
        camera.setBounds(1000, 500);
        assertEqual(camera.maxX, 680, 'Camera calculates maxX correctly'); // 1000 - 320
        assertEqual(camera.maxY, 276, 'Camera calculates maxY correctly'); // 500 - 224

        // Test visibility check
        assert(camera.isVisible(10, 10, 50, 50), 'Camera detects visible objects');
        assert(!camera.isVisible(500, 500, 50, 50), 'Camera detects non-visible objects');

        // Test centerOn
        camera.centerOn(500, 250);
        assert(camera.x >= 0, 'Camera respects minimum X bound after centerOn');
    },

    // ==========================================
    // STORAGE TESTS
    // ==========================================
    async testStorage() {
        console.log('\n💾 STORAGE TESTS');
        console.log('=================');

        const { Storage } = await import('./js/utils/Storage.js');
        const storage = new Storage();

        assertExists(storage, 'Storage instantiates');
        assertExists(storage.data, 'Storage has data object');

        // Test high score saving
        const rank = storage.saveHighScore(50000, 'TST');
        assert(rank >= 1, 'High score saved successfully');

        const highScores = storage.getHighScores();
        assert(Array.isArray(highScores), 'getHighScores returns array');
        assert(highScores.length > 0, 'High scores list is not empty after save');

        // Test progress saving
        storage.saveLevelProgress(2, 10000);
        const progress = storage.loadProgress();
        assert(progress.currentLevel >= 1, 'Level progress saves correctly');

        // Clean up
        storage.clearAll();
    },

    // ==========================================
    // ASSET LOADER TESTS
    // ==========================================
    async testAssetLoader() {
        console.log('\n🖼️ ASSET LOADER TESTS');
        console.log('======================');

        const { AssetLoader } = await import('./js/engine/AssetLoader.js');
        const loader = new AssetLoader();

        assertExists(loader, 'AssetLoader instantiates');

        // Test placeholder image creation
        const placeholder = loader.createPlaceholderImage('sonic-idle');
        assertExists(placeholder, 'Creates placeholder image');
        assert(placeholder.width === 32, 'Placeholder has correct default width');

        // Test background placeholder
        const bgPlaceholder = loader.createPlaceholderImage('bg-greenhill');
        assertEqual(bgPlaceholder.width, 320, 'Background placeholder has correct width');
        assertEqual(bgPlaceholder.height, 224, 'Background placeholder has correct height');
    },

    // ==========================================
    // RING ENTITY TESTS
    // ==========================================
    async testRing() {
        console.log('\n💍 RING ENTITY TESTS');
        console.log('=====================');

        const { Ring } = await import('./js/entities/Ring.js');

        // Mock game object
        const mockGame = {
            assets: { getImage: () => null },
            levelManager: { getGroundY: () => 200 }
        };

        const ring = new Ring(mockGame, 100, 100);

        assertExists(ring, 'Ring instantiates');
        assertEqual(ring.x, 100, 'Ring has correct X position');
        assertEqual(ring.y, 100, 'Ring has correct Y position');
        assertEqual(ring.collected, false, 'Ring is not collected initially');

        // Test collection
        ring.collect();
        assertEqual(ring.collected, true, 'Ring can be collected');

        // Test bounds
        const bounds = ring.getBounds();
        assertExists(bounds.x, 'Ring bounds has x');
        assertExists(bounds.width, 'Ring bounds has width');
    },

    // ==========================================
    // POWER UP TESTS
    // ==========================================
    async testPowerUp() {
        console.log('\n⚡ POWER UP TESTS');
        console.log('==================');

        const { PowerUp } = await import('./js/entities/PowerUp.js');

        const mockGame = { collectEmerald: () => { } };

        const shield = new PowerUp(mockGame, 50, 50, 'shield');
        assertExists(shield, 'Shield power-up instantiates');
        assertEqual(shield.type, 'shield', 'Shield has correct type');

        const emerald = new PowerUp(mockGame, 100, 100, 'emerald', 2);
        assertEqual(emerald.type, 'emerald', 'Emerald has correct type');
        assertEqual(emerald.emeraldIndex, 2, 'Emerald has correct index');
    },

    // ==========================================
    // ENEMY TESTS
    // ==========================================
    async testEnemy() {
        console.log('\n👾 ENEMY TESTS');
        console.log('===============');

        const { Enemy } = await import('./js/entities/Enemy.js');

        const mockGame = {
            assets: { getImage: () => null },
            levelManager: { getGroundY: () => 200, getWallX: () => null },
            addEffect: () => { }
        };

        const motobug = new Enemy(mockGame, 100, 100, 'motobug');
        assertExists(motobug, 'Motobug enemy instantiates');
        assertEqual(motobug.type, 'motobug', 'Motobug has correct type');
        assertEqual(motobug.isDead, false, 'Enemy is alive initially');

        // Test destroy
        motobug.destroy();
        assertEqual(motobug.isDead, true, 'Enemy can be destroyed');

        // Test crabmeat
        const crabmeat = new Enemy(mockGame, 200, 100, 'crabmeat');
        assertEqual(crabmeat.type, 'crabmeat', 'Crabmeat has correct type');
        assert(crabmeat.canShoot === true, 'Crabmeat can shoot');
    },

    // ==========================================
    // INPUT TESTS
    // ==========================================
    async testInput() {
        console.log('\n🎮 INPUT TESTS');
        console.log('===============');

        const { Input } = await import('./js/engine/Input.js');

        const mockGame = {};
        const input = new Input(mockGame);

        assertExists(input, 'Input instantiates');
        assertExists(input.bindings, 'Input has key bindings');
        assert('left' in input.bindings, 'Input has left binding');
        assert('right' in input.bindings, 'Input has right binding');
        assert('jump' in input.bindings, 'Input has jump binding');

        // Test initial state
        assertEqual(input.getHorizontal(), 0, 'Initial horizontal is 0');
        assertEqual(input.getVertical(), 0, 'Initial vertical is 0');
    }
};

// Run all tests
async function runAllTests() {
    console.log('🦔 SUPER SONIC GAME TEST SUITE');
    console.log('==============================');
    console.log('Starting tests...\n');

    const startTime = Date.now();

    try {
        await Tests.testModulesLoad();
        await Tests.testCamera();
        await Tests.testStorage();
        await Tests.testAssetLoader();
        await Tests.testRing();
        await Tests.testPowerUp();
        await Tests.testEnemy();
        await Tests.testInput();
    } catch (e) {
        console.error('Test suite error:', e);
    }

    const duration = Date.now() - startTime;

    console.log('\n==============================');
    console.log('📊 TEST RESULTS');
    console.log('==============================');
    console.log(`✅ Passed: ${TestResults.passed}`);
    console.log(`❌ Failed: ${TestResults.failed}`);
    console.log(`⏱️ Duration: ${duration}ms`);

    if (TestResults.errors.length > 0) {
        console.log('\n❌ FAILED TESTS:');
        TestResults.errors.forEach(err => {
            console.log(`  - ${err.test}: ${err.message}`);
        });
    }

    // Update UI if available
    const resultsDiv = document.getElementById('test-results');
    if (resultsDiv) {
        resultsDiv.innerHTML = `
            <h2>Test Results</h2>
            <p style="color: green;">✅ Passed: ${TestResults.passed}</p>
            <p style="color: ${TestResults.failed > 0 ? 'red' : 'green'};">❌ Failed: ${TestResults.failed}</p>
            <p>⏱️ Duration: ${duration}ms</p>
            ${TestResults.errors.length > 0 ? `
                <h3>Failed Tests:</h3>
                <ul style="color: red;">
                    ${TestResults.errors.map(e => `<li>${e.test}: ${e.message}</li>`).join('')}
                </ul>
            ` : '<p style="color: green;">All tests passed!</p>'}
        `;
    }

    return TestResults;
}

// Auto-run tests when loaded
if (typeof window !== 'undefined') {
    window.runAllTests = runAllTests;

    // Run on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runAllTests);
    } else {
        runAllTests();
    }
}

export { runAllTests, TestResults };
