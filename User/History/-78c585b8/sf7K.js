/**
 * Main Game Engine
 * Handles game loop, state management, and core game logic
 */

import { Input } from './Input.js';
import { Camera } from './Camera.js';
import { Audio } from './Audio.js';
import { Player } from '../entities/Player.js';
import { LevelManager } from '../levels/LevelManager.js';
import { HUD } from '../ui/HUD.js';
import { Menu } from '../ui/Menu.js';
import { Storage } from '../utils/Storage.js';

// Game states
export const GameState = {
    LOADING: 'loading',
    MENU: 'menu',
    PLAYING: 'playing',
    PAUSED: 'paused',
    LEVEL_COMPLETE: 'level_complete',
    GAME_OVER: 'game_over',
    VICTORY: 'victory'
};

export class Game {
    constructor(canvas, config, assetLoader) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.config = config;
        this.assets = assetLoader;

        // Timing
        this.lastTime = 0;
        this.deltaTime = 0;
        this.targetFrameTime = 1000 / config.TARGET_FPS;
        this.running = false;

        // Game state
        this.state = GameState.LOADING;
        this.score = 0;
        this.rings = 0;
        this.lives = config.STARTING_LIVES;
        this.time = 0;
        this.emeralds = [false, false, false, false, false, false, false];

        // Initialize subsystems
        this.input = new Input(this);
        this.camera = new Camera(config.NATIVE_WIDTH, config.NATIVE_HEIGHT);
        this.audio = new Audio(assetLoader);
        this.storage = new Storage();
        this.hud = new HUD(this);
        this.menu = new Menu(this);
        this.levelManager = new LevelManager(this);

        // Player (created when level starts)
        this.player = null;

        // Entity collections
        this.entities = [];
        this.rings_items = [];
        this.enemies = [];
        this.powerups = [];
        this.effects = [];

        // Bind methods
        this.gameLoop = this.gameLoop.bind(this);

        // Set up rendering context
        this.ctx.imageSmoothingEnabled = false;

        // Debug mode (press F3 to toggle)
        this.debugMode = false;
        this.fpsHistory = [];
        this.setupDebugControls();
    }

    /**
     * Set up debug controls
     */
    setupDebugControls() {
        window.addEventListener('keydown', (e) => {
            // F3 toggles debug mode
            if (e.code === 'F3') {
                this.debugMode = !this.debugMode;
                console.log(`Debug mode: ${this.debugMode ? 'ON' : 'OFF'}`);
                e.preventDefault();
            }
            // F5 reloads level
            if (e.code === 'F5' && this.state === GameState.PLAYING) {
                this.loadLevel(this.levelManager.currentLevelNumber);
                e.preventDefault();
            }
            // F6 skips to next level
            if (e.code === 'F6' && this.state === GameState.PLAYING) {
                this.nextLevel();
                e.preventDefault();
            }
            // F7 gives rings
            if (e.code === 'F7' && this.player) {
                this.rings += 50;
                console.log(`Rings: ${this.rings}`);
                e.preventDefault();
            }
            // F8 gives all emeralds
            if (e.code === 'F8') {
                this.emeralds = [true, true, true, true, true, true, true];
                this.hud.updateEmeralds(this.emeralds);
                console.log('All emeralds collected!');
                e.preventDefault();
            }
        });
    }

    /**
     * Start the game
     */
    start() {
        this.running = true;
        this.state = GameState.MENU;
        this.menu.showTitle();
        this.audio.playMusic('music-title');
        this.lastTime = performance.now();
        requestAnimationFrame(this.gameLoop);
    }

    /**
     * Main game loop
     */
    gameLoop(currentTime) {
        if (!this.running) return;

        // Calculate delta time
        this.deltaTime = (currentTime - this.lastTime) / this.targetFrameTime;
        this.lastTime = currentTime;

        // Cap delta time to prevent large jumps
        if (this.deltaTime > 3) this.deltaTime = 3;

        // Update
        this.update(this.deltaTime);

        // Render
        this.render();

        // Continue loop
        requestAnimationFrame(this.gameLoop);
    }

    /**
     * Update game logic
     */
    update(dt) {
        this.input.update();

        switch (this.state) {
            case GameState.MENU:
                this.menu.update(dt);
                break;

            case GameState.PLAYING:
                this.updatePlaying(dt);
                break;

            case GameState.PAUSED:
                this.menu.update(dt);
                break;

            case GameState.LEVEL_COMPLETE:
                this.updateLevelComplete(dt);
                break;

            case GameState.GAME_OVER:
            case GameState.VICTORY:
                this.menu.update(dt);
                break;
        }
    }

    /**
     * Update playing state
     */
    updatePlaying(dt) {
        // Update game time
        this.time += dt * (1000 / 60); // Convert to ms

        // Check for pause
        if (this.input.justPressed('pause')) {
            this.pause();
            return;
        }

        // Update player
        if (this.player) {
            this.player.update(dt);
            this.camera.follow(this.player);
        }

        // Update level
        this.levelManager.update(dt);

        // Update all entities
        for (const entity of this.entities) {
            entity.update(dt);
        }

        // Update rings
        for (const ring of this.rings_items) {
            ring.update(dt);
        }

        // Update enemies
        for (const enemy of this.enemies) {
            enemy.update(dt);
        }

        // Update powerups
        for (const powerup of this.powerups) {
            powerup.update(dt);
        }

        // Update effects
        for (let i = this.effects.length - 1; i >= 0; i--) {
            this.effects[i].update(dt);
            if (this.effects[i].isDead) {
                this.effects.splice(i, 1);
            }
        }

        // Check collisions
        this.checkCollisions();

        // Update HUD
        this.hud.update(dt);

        // Check win/lose conditions
        this.checkGameConditions();
    }

    /**
     * Update level complete state
     */
    updateLevelComplete(dt) {
        // Score tally animation
        if (this.menu.tallying) {
            this.menu.update(dt);
        }
    }

    /**
     * Check all collisions
     */
    checkCollisions() {
        if (!this.player) return;

        const playerBounds = this.player.getBounds();

        // Player vs Rings
        for (let i = this.rings_items.length - 1; i >= 0; i--) {
            const ring = this.rings_items[i];
            if (!ring.collected && this.checkAABB(playerBounds, ring.getBounds())) {
                ring.collect();
                this.collectRing();
            }
        }

        // Player vs Enemies
        for (const enemy of this.enemies) {
            if (enemy.isDead) continue;

            if (this.checkAABB(playerBounds, enemy.getBounds())) {
                // Check if player is attacking (spinning/jumping on top)
                if (this.player.isAttacking() && this.player.y + this.player.height / 2 < enemy.y) {
                    enemy.destroy();
                    this.player.bounce();
                    this.addScore(100);
                    this.audio.playSFX('sfx-destroy');
                } else if (!this.player.isInvincible()) {
                    this.player.hurt();
                }
            }
        }

        // Player vs Powerups
        for (let i = this.powerups.length - 1; i >= 0; i--) {
            const powerup = this.powerups[i];
            if (this.checkAABB(playerBounds, powerup.getBounds())) {
                powerup.apply(this.player);
                this.powerups.splice(i, 1);
                this.audio.playSFX('sfx-powerup');
            }
        }
    }

    /**
     * AABB collision check
     */
    checkAABB(a, b) {
        return a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y;
    }

    /**
     * Check win/lose conditions
     */
    checkGameConditions() {
        if (!this.player) return;

        // Check player death
        if (this.player.isDead) {
            this.lives--;

            if (this.lives <= 0) {
                this.gameOver();
            } else {
                this.respawnPlayer();
            }
        }

        // Check level complete
        if (this.player.reachedGoal) {
            this.completeLevel();
        }
    }

    /**
     * Render the game
     */
    render() {
        // Clear canvas
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.config.NATIVE_WIDTH, this.config.NATIVE_HEIGHT);

        switch (this.state) {
            case GameState.MENU:
                this.menu.render(this.ctx);
                break;

            case GameState.PLAYING:
            case GameState.PAUSED:
                this.renderPlaying();
                if (this.state === GameState.PAUSED) {
                    this.menu.render(this.ctx);
                }
                break;

            case GameState.LEVEL_COMPLETE:
                this.renderPlaying();
                this.menu.render(this.ctx);
                break;

            case GameState.GAME_OVER:
            case GameState.VICTORY:
                this.menu.render(this.ctx);
                break;
        }
    }

    /**
     * Render playing state
     */
    renderPlaying() {
        // Save context
        this.ctx.save();

        // Apply camera transform
        this.camera.applyTransform(this.ctx);

        // Render level (background + tiles)
        this.levelManager.render(this.ctx);

        // Render rings
        for (const ring of this.rings_items) {
            ring.render(this.ctx);
        }

        // Render powerups
        for (const powerup of this.powerups) {
            powerup.render(this.ctx);
        }

        // Render enemies
        for (const enemy of this.enemies) {
            enemy.render(this.ctx);
        }

        // Render player
        if (this.player) {
            this.player.render(this.ctx);
        }

        // Render effects
        for (const effect of this.effects) {
            effect.render(this.ctx);
        }

        // Restore context
        this.ctx.restore();

        // Render HUD (not affected by camera)
        this.hud.render(this.ctx);

        // Debug overlay
        if (this.debugMode) {
            this.renderDebugOverlay();
        }
    }

    /**
     * Render debug overlay
     */
    renderDebugOverlay() {
        const ctx = this.ctx;
        ctx.save();

        // Background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(5, 5, 120, 100);

        // Text
        ctx.fillStyle = '#0f0';
        ctx.font = '8px monospace';
        ctx.textAlign = 'left';

        let y = 15;
        const lineHeight = 10;

        // FPS
        const fps = Math.round(1000 / (this.deltaTime * this.targetFrameTime));
        ctx.fillText(`FPS: ${fps}`, 10, y); y += lineHeight;

        // Game state
        ctx.fillText(`State: ${this.state}`, 10, y); y += lineHeight;

        // Player info
        if (this.player) {
            ctx.fillText(`X: ${Math.round(this.player.x)}`, 10, y); y += lineHeight;
            ctx.fillText(`Y: ${Math.round(this.player.y)}`, 10, y); y += lineHeight;
            ctx.fillText(`VX: ${this.player.velocityX.toFixed(1)}`, 10, y); y += lineHeight;
            ctx.fillText(`VY: ${this.player.velocityY.toFixed(1)}`, 10, y); y += lineHeight;
            ctx.fillText(`Grounded: ${this.player.grounded}`, 10, y); y += lineHeight;
            ctx.fillText(`P.State: ${this.player.state}`, 10, y); y += lineHeight;
        }

        // Input state
        ctx.fillStyle = '#ff0';
        ctx.fillText(`Input:`, 10, y); y += lineHeight;

        const activeKeys = Object.entries(this.input.keys)
            .filter(([k, v]) => v)
            .map(([k]) => k.replace('Arrow', '').replace('Key', ''))
            .join(' ');
        ctx.fillText(activeKeys || '(none)', 10, y);

        ctx.restore();
    }

    /**
     * Start a new game
     */
    newGame() {
        this.score = 0;
        this.rings = 0;
        this.lives = this.config.STARTING_LIVES;
        this.time = 0;
        this.emeralds = [false, false, false, false, false, false, false];

        this.loadLevel(1);
    }

    /**
     * Load a level
     */
    loadLevel(levelNumber) {
        // Clear entities
        this.entities = [];
        this.rings_items = [];
        this.enemies = [];
        this.powerups = [];
        this.effects = [];

        // Load level data
        this.levelManager.loadLevel(levelNumber);

        // Create player at spawn point
        const spawn = this.levelManager.getSpawnPoint();
        this.player = new Player(this, spawn.x, spawn.y);

        // Reset camera
        this.camera.reset();
        this.camera.follow(this.player);

        // Play level music
        const musicKey = `music-${this.levelManager.currentLevel.music || 'greenhill'}`;
        this.audio.playMusic(musicKey);

        // Start playing
        this.time = 0;
        this.state = GameState.PLAYING;
        this.hud.show();
    }

    /**
     * Respawn player at checkpoint
     */
    respawnPlayer() {
        const checkpoint = this.levelManager.getCheckpoint();
        this.player = new Player(this, checkpoint.x, checkpoint.y);
        this.rings = 0;
        this.camera.follow(this.player);
    }

    /**
     * Complete the current level
     */
    completeLevel() {
        this.state = GameState.LEVEL_COMPLETE;
        this.audio.stopMusic();

        // Calculate bonuses
        const timeBonus = Math.max(0, 60000 - this.time) / 100;
        const ringBonus = this.rings * 100;

        this.menu.showLevelComplete(timeBonus, ringBonus);

        // Save progress
        this.storage.saveLevelProgress(this.levelManager.currentLevelNumber, this.score);
    }

    /**
     * Go to next level
     */
    nextLevel() {
        const nextLevelNumber = this.levelManager.currentLevelNumber + 1;

        if (nextLevelNumber > 5) {
            this.victory();
        } else {
            this.loadLevel(nextLevelNumber);
        }
    }

    /**
     * Game over
     */
    gameOver() {
        this.state = GameState.GAME_OVER;
        this.audio.stopMusic();
        this.menu.showGameOver();
        this.storage.saveHighScore(this.score);
    }

    /**
     * Victory - beat the game!
     */
    victory() {
        this.state = GameState.VICTORY;
        this.audio.stopMusic();
        this.menu.showVictory();
        this.storage.saveGameComplete(this.score, this.emeralds);
    }

    /**
     * Pause the game
     */
    pause() {
        if (this.state === GameState.PLAYING) {
            this.state = GameState.PAUSED;
            this.audio.pauseMusic();
            this.menu.showPause();
        }
    }

    /**
     * Resume the game
     */
    resume() {
        if (this.state === GameState.PAUSED) {
            this.state = GameState.PLAYING;
            this.audio.resumeMusic();
            this.menu.hide();
        }
    }

    /**
     * Return to main menu
     */
    returnToMenu() {
        this.state = GameState.MENU;
        this.audio.stopMusic();
        this.audio.playMusic('music-title');
        this.menu.showTitle();
        this.hud.hide();
    }

    /**
     * Collect a ring
     */
    collectRing() {
        this.rings++;
        this.addScore(10);
        this.audio.playSFX('sfx-ring');

        // Check for Super Sonic availability
        this.checkSuperSonicAvailable();
    }

    /**
     * Collect an emerald
     */
    collectEmerald(index) {
        if (index >= 0 && index < 7 && !this.emeralds[index]) {
            this.emeralds[index] = true;
            this.addScore(1000);
            this.audio.playSFX('sfx-powerup');
            this.hud.updateEmeralds(this.emeralds);
            this.checkSuperSonicAvailable();
        }
    }

    /**
     * Check if Super Sonic is available
     */
    checkSuperSonicAvailable() {
        const collectedEmeralds = this.emeralds.filter(e => e).length;
        const { REQUIRED_EMERALDS, REQUIRED_RINGS } = this.config.SUPER_SONIC;

        if (collectedEmeralds >= REQUIRED_EMERALDS &&
            this.rings >= REQUIRED_RINGS &&
            this.player &&
            !this.player.isSuper) {

            this.player.canTransform = true;
        }
    }

    /**
     * Add to score
     */
    addScore(points) {
        this.score += points;

        // Extra life every 50000 points
        if (Math.floor(this.score / 50000) > Math.floor((this.score - points) / 50000)) {
            this.lives++;
            // Play 1-up sound
        }
    }

    /**
     * Add an effect
     */
    addEffect(effect) {
        this.effects.push(effect);
    }

    /**
     * Spawn rings from player when hurt
     */
    spawnRingsFromPlayer(count) {
        const rings = Math.min(count, 20); // Max 20 rings scattered
        for (let i = 0; i < rings; i++) {
            const angle = (Math.PI * 2 / rings) * i;
            const speed = 3 + Math.random() * 2;
            // Create scattered ring entity
            // TODO: Implement scattered rings
        }
    }
}
