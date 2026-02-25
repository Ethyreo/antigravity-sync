/**
 * Level Manager
 * Handles level loading, rendering, and collision
 */

import { Ring } from '../entities/Ring.js';
import { Enemy } from '../entities/Enemy.js';
import { PowerUp } from '../entities/PowerUp.js';

// Level definitions
const LEVELS = {
    1: {
        name: 'Green Hill Prime',
        music: 'greenhill',
        tileSize: 16,
        width: 200,
        height: 15,
        background: 'bg-greenhill',
        tileset: 'tileset-greenhill',
        spawn: { x: 50, y: 160 },
        goal: { x: 3000, y: 160 }
    },
    2: {
        name: 'Neon City 2099',
        music: 'neoncity',
        tileSize: 16,
        width: 220,
        height: 18,
        background: 'bg-neoncity',
        tileset: 'tileset-neoncity',
        spawn: { x: 50, y: 200 },
        goal: { x: 3300, y: 180 }
    },
    3: {
        name: 'Lava Depths',
        music: 'lava',
        tileSize: 16,
        width: 180,
        height: 20,
        background: 'bg-lava',
        tileset: 'tileset-lava',
        spawn: { x: 50, y: 240 },
        goal: { x: 2700, y: 200 }
    },
    4: {
        name: 'Frozen Tundra',
        music: 'frozen',
        tileSize: 16,
        width: 200,
        height: 15,
        background: 'bg-frozen',
        tileset: 'tileset-frozen',
        spawn: { x: 50, y: 160 },
        goal: { x: 3000, y: 140 }
    },
    5: {
        name: 'Mushroom Kingdom Rift',
        music: 'mushroom',
        tileSize: 16,
        width: 150,
        height: 15,
        background: 'bg-mushroom',
        tileset: 'tileset-mushroom',
        spawn: { x: 50, y: 160 },
        goal: { x: 2200, y: 160 },
        isBossLevel: true
    }
};

export class LevelManager {
    constructor(game) {
        this.game = game;

        this.currentLevel = null;
        this.currentLevelNumber = 0;

        // Tile data
        this.tileData = null;
        this.tileSize = 16;
        this.levelWidth = 0;
        this.levelHeight = 0;

        // Parallax layers
        this.parallaxLayers = [];

        // Checkpoints
        this.checkpoints = [];
        this.lastCheckpoint = null;

        // Goal/portal
        this.goal = null;
    }

    /**
     * Load a level by number
     */
    loadLevel(levelNumber) {
        const levelDef = LEVELS[levelNumber];
        if (!levelDef) {
            console.error(`Level ${levelNumber} not found`);
            return;
        }

        this.currentLevel = levelDef;
        this.currentLevelNumber = levelNumber;
        this.tileSize = levelDef.tileSize;
        this.levelWidth = levelDef.width * this.tileSize;
        this.levelHeight = levelDef.height * this.tileSize;

        // Generate tile data
        this.tileData = this.generateLevelData(levelNumber, levelDef);

        // Set camera bounds
        this.game.camera.setBounds(this.levelWidth, this.levelHeight);

        // Calculate actual spawn Y based on generated terrain
        const spawnX = levelDef.spawn.x;
        const groundY = this.getGroundY(spawnX, 0);
        const actualSpawnY = groundY ? groundY - 40 : levelDef.spawn.y;

        // Update spawn with calculated position
        this.currentLevel = {
            ...levelDef,
            spawn: { x: spawnX, y: actualSpawnY }
        };

        // Spawn entities
        this.spawnEntities(levelNumber, levelDef);

        // Set checkpoints
        this.checkpoints = [{ x: spawnX, y: actualSpawnY }];
        this.lastCheckpoint = this.checkpoints[0];

        // Set goal
        this.goal = levelDef.goal;

        console.log(`Loaded level ${levelNumber}: ${levelDef.name}`);
        console.log(`Spawn position: (${spawnX}, ${actualSpawnY})`);
    }

    /**
     * Generate procedural level data
     */
    generateLevelData(levelNumber, levelDef) {
        const width = levelDef.width;
        const height = levelDef.height;
        const tiles = [];

        // Initialize all tiles to empty (0)
        for (let y = 0; y < height; y++) {
            tiles[y] = [];
            for (let x = 0; x < width; x++) {
                tiles[y][x] = 0;
            }
        }

        // Generate ground with procedural terrain
        const groundLevel = Math.floor(height * 0.75);

        for (let x = 0; x < width; x++) {
            // Create undulating ground
            const noise = Math.sin(x * 0.05) * 2 + Math.sin(x * 0.02) * 3;
            const groundY = Math.floor(groundLevel + noise);

            // Ground tiles
            for (let y = groundY; y < height; y++) {
                if (y === groundY) {
                    tiles[y][x] = 1; // Top ground tile
                } else {
                    tiles[y][x] = 2; // Underground tile
                }
            }

            // Add platforms
            if (x % 30 === 15 && Math.random() > 0.3) {
                const platformY = groundY - 4 - Math.floor(Math.random() * 3);
                for (let px = 0; px < 5; px++) {
                    if (x + px < width) {
                        tiles[platformY][x + px] = 3; // Platform tile
                    }
                }
            }

            // Add steps/stairs occasionally
            if (x % 50 === 25) {
                for (let step = 0; step < 4; step++) {
                    const stepX = x + step * 2;
                    const stepY = groundY - step - 1;
                    if (stepX < width && stepY >= 0) {
                        for (let sy = stepY; sy < groundY; sy++) {
                            tiles[sy][stepX] = 1;
                            tiles[sy][stepX + 1] = 1;
                        }
                    }
                }
            }
        }

        // Level-specific modifications
        this.applyLevelTheme(tiles, levelNumber, levelDef);

        return tiles;
    }

    /**
     * Apply level-specific theme modifications
     */
    applyLevelTheme(tiles, levelNumber, levelDef) {
        const width = levelDef.width;
        const height = levelDef.height;

        switch (levelNumber) {
            case 2: // Neon City - More platforms, fewer slopes
                for (let x = 20; x < width - 20; x += 40) {
                    const platformY = Math.floor(height * 0.4 + Math.random() * 4);
                    for (let px = 0; px < 8; px++) {
                        if (x + px < width) {
                            tiles[platformY][x + px] = 3;
                        }
                    }
                }
                break;

            case 3: // Lava - Add gaps/pits
                for (let x = 50; x < width - 50; x += 60) {
                    if (Math.random() > 0.5) {
                        const gapWidth = 3 + Math.floor(Math.random() * 3);
                        for (let gx = 0; gx < gapWidth; gx++) {
                            for (let y = 0; y < height; y++) {
                                if (x + gx < width) {
                                    tiles[y][x + gx] = 0;
                                }
                            }
                        }
                    }
                }
                break;

            case 4: // Frozen - Slippery platforms
                // Add ice platforms
                for (let x = 30; x < width - 30; x += 35) {
                    const platformY = Math.floor(height * 0.45);
                    for (let px = 0; px < 6; px++) {
                        if (x + px < width) {
                            tiles[platformY][x + px] = 4; // Ice tile
                        }
                    }
                }
                break;

            case 5: // Mushroom Kingdom - Pipe platforms
                for (let x = 40; x < width - 40; x += 50) {
                    const pipeHeight = 3 + Math.floor(Math.random() * 3);
                    const pipeY = Math.floor(height * 0.7) - pipeHeight;
                    for (let py = 0; py < pipeHeight; py++) {
                        tiles[pipeY + py][x] = 5; // Pipe tile
                        tiles[pipeY + py][x + 1] = 5;
                    }
                    // Pipe top
                    tiles[pipeY][x - 1] = 6; // Pipe top left
                    tiles[pipeY][x + 2] = 6; // Pipe top right
                }
                break;
        }
    }

    /**
     * Spawn level entities
     */
    spawnEntities(levelNumber, levelDef) {
        const game = this.game;

        // Spawn rings along the path
        for (let x = 100; x < this.levelWidth - 100; x += 60) {
            const groundY = this.getGroundY(x, 0) || (levelDef.height * 0.7 * this.tileSize);

            // Ring pattern
            const patternType = Math.floor(Math.random() * 3);

            if (patternType === 0) {
                // Horizontal line
                for (let i = 0; i < 5; i++) {
                    game.rings_items.push(new Ring(game, x + i * 20, groundY - 40));
                }
            } else if (patternType === 1) {
                // Arc
                for (let i = 0; i < 5; i++) {
                    const arcHeight = Math.sin(i / 4 * Math.PI) * 30;
                    game.rings_items.push(new Ring(game, x + i * 20, groundY - 40 - arcHeight));
                }
            } else {
                // Vertical stack
                for (let i = 0; i < 3; i++) {
                    game.rings_items.push(new Ring(game, x, groundY - 40 - i * 25));
                }
            }
        }

        // Spawn enemies
        for (let x = 200; x < this.levelWidth - 200; x += 150 + Math.random() * 100) {
            const groundY = this.getGroundY(x, 0) || (levelDef.height * 0.7 * this.tileSize);
            const enemyType = levelNumber <= 2 ? 'motobug' : 'crabmeat';
            game.enemies.push(new Enemy(game, x, groundY - 24, enemyType));
        }

        // Spawn power-ups
        const powerUpTypes = ['shield', 'speed', 'invincibility'];
        for (let i = 0; i < 3; i++) {
            const x = 300 + i * 800 + Math.random() * 200;
            const groundY = this.getGroundY(x, 0) || (levelDef.height * 0.7 * this.tileSize);
            const type = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
            game.powerups.push(new PowerUp(game, x, groundY - 60, type));
        }

        // Spawn chaos emerald (1 per level)
        if (levelNumber <= 7) {
            const emeraldX = this.levelWidth * 0.6 + Math.random() * 200;
            const groundY = this.getGroundY(emeraldX, 0) || (levelDef.height * 0.6 * this.tileSize);
            game.powerups.push(new PowerUp(game, emeraldX, groundY - 80, 'emerald', levelNumber - 1));
        }
    }

    /**
     * Update level (animated tiles, etc.)
     */
    update(dt) {
        // Check if player reached goal
        if (this.goal && this.game.player) {
            const player = this.game.player;
            const goalBounds = {
                x: this.goal.x - 20,
                y: 0,
                width: 40,
                height: this.levelHeight
            };

            if (player.x >= goalBounds.x) {
                player.reachedGoal = true;
            }
        }
    }

    /**
     * Render level
     */
    render(ctx) {
        // Render background
        this.renderBackground(ctx);

        // Render tiles
        this.renderTiles(ctx);

        // Render goal/portal
        this.renderGoal(ctx);
    }

    /**
     * Render parallax background
     */
    renderBackground(ctx) {
        if (!this.currentLevel) return;

        const camera = this.game.camera;
        const { NATIVE_WIDTH, NATIVE_HEIGHT } = this.game.config;
        const time = Date.now() * 0.001;

        // Level-specific backgrounds
        switch (this.currentLevelNumber) {
            case 1:
                this.renderGreenHillBackground(ctx, time);
                break;
            case 2:
                this.renderNeonCityBackground(ctx, time);
                break;
            case 3:
                this.renderLavaBackground(ctx, time);
                break;
            case 4:
                this.renderFrozenBackground(ctx, time);
                break;
            case 5:
                this.renderMushroomBackground(ctx, time);
                break;
            default:
                this.renderDefaultBackground(ctx);
        }
    }

    /**
     * Green Hill Prime - Classic sunny day with clouds
     */
    renderGreenHillBackground(ctx, time) {
        const camera = this.game.camera;
        const { NATIVE_WIDTH, NATIVE_HEIGHT } = this.game.config;

        // Sky gradient
        const skyGrad = ctx.createLinearGradient(0, camera.y, 0, camera.y + NATIVE_HEIGHT);
        skyGrad.addColorStop(0, '#4FC3F7');
        skyGrad.addColorStop(0.6, '#81D4FA');
        skyGrad.addColorStop(1, '#B3E5FC');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(camera.x, camera.y, NATIVE_WIDTH, NATIVE_HEIGHT);

        // Parallax clouds
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        for (let i = 0; i < 8; i++) {
            const cloudX = ((i * 150 + time * 10 - camera.x * 0.2) % (NATIVE_WIDTH + 200)) - 100 + camera.x;
            const cloudY = camera.y + 20 + (i % 3) * 25;
            this.drawCloud(ctx, cloudX, cloudY, 30 + (i % 3) * 10);
        }

        // Distant hills (parallax layer)
        ctx.fillStyle = '#66BB6A';
        for (let i = 0; i < 5; i++) {
            const hillX = (i * 120 - camera.x * 0.3) % (NATIVE_WIDTH + 120) - 60 + camera.x;
            const hillY = camera.y + NATIVE_HEIGHT * 0.5;
            this.drawHill(ctx, hillX, hillY, 80, 50);
        }

        // Nearer hills
        ctx.fillStyle = '#4CAF50';
        for (let i = 0; i < 4; i++) {
            const hillX = (i * 100 - camera.x * 0.5) % (NATIVE_WIDTH + 100) - 50 + camera.x;
            const hillY = camera.y + NATIVE_HEIGHT * 0.65;
            this.drawHill(ctx, hillX, hillY, 60, 40);
        }
    }

    /**
     * Neon City 2099 - Cyberpunk cityscape
     */
    renderNeonCityBackground(ctx, time) {
        const camera = this.game.camera;
        const { NATIVE_WIDTH, NATIVE_HEIGHT } = this.game.config;

        // Dark gradient sky
        const skyGrad = ctx.createLinearGradient(0, camera.y, 0, camera.y + NATIVE_HEIGHT);
        skyGrad.addColorStop(0, '#0d0221');
        skyGrad.addColorStop(0.4, '#1a0533');
        skyGrad.addColorStop(1, '#2d1b4e');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(camera.x, camera.y, NATIVE_WIDTH, NATIVE_HEIGHT);

        // Animated stars
        ctx.fillStyle = '#fff';
        for (let i = 0; i < 40; i++) {
            const starX = ((i * 67) % NATIVE_WIDTH) + camera.x;
            const starY = ((i * 41) % (NATIVE_HEIGHT * 0.6)) + camera.y;
            const twinkle = Math.sin(time * 3 + i) * 0.5 + 0.5;
            ctx.globalAlpha = twinkle;
            ctx.fillRect(starX, starY, 1, 1);
        }
        ctx.globalAlpha = 1;

        // Distant buildings
        for (let i = 0; i < 12; i++) {
            const buildX = (i * 40 - camera.x * 0.2) % (NATIVE_WIDTH + 40) - 20 + camera.x;
            const buildH = 40 + (i * 17) % 60;
            const buildY = camera.y + NATIVE_HEIGHT * 0.6 - buildH;

            // Building
            ctx.fillStyle = '#1a1a3e';
            ctx.fillRect(buildX, buildY, 25, buildH);

            // Neon glow windows
            const hue = (time * 30 + i * 40) % 360;
            ctx.fillStyle = `hsla(${hue}, 100%, 60%, 0.8)`;
            for (let w = 0; w < 4; w++) {
                const winY = buildY + 5 + w * 12;
                if (winY < buildY + buildH - 5) {
                    ctx.fillRect(buildX + 5, winY, 3, 3);
                    ctx.fillRect(buildX + 12, winY, 3, 3);
                }
            }
        }

        // Neon ground glow
        const glowGrad = ctx.createLinearGradient(0, camera.y + NATIVE_HEIGHT * 0.8, 0, camera.y + NATIVE_HEIGHT);
        glowGrad.addColorStop(0, 'transparent');
        glowGrad.addColorStop(1, `hsla(${(time * 20) % 360}, 100%, 50%, 0.3)`);
        ctx.fillStyle = glowGrad;
        ctx.fillRect(camera.x, camera.y + NATIVE_HEIGHT * 0.8, NATIVE_WIDTH, NATIVE_HEIGHT * 0.2);
    }

    /**
     * Lava Depths - Volcanic underground
     */
    renderLavaBackground(ctx, time) {
        const camera = this.game.camera;
        const { NATIVE_WIDTH, NATIVE_HEIGHT } = this.game.config;

        // Dark red gradient
        const skyGrad = ctx.createLinearGradient(0, camera.y, 0, camera.y + NATIVE_HEIGHT);
        skyGrad.addColorStop(0, '#1a0000');
        skyGrad.addColorStop(0.5, '#330000');
        skyGrad.addColorStop(1, '#661a00');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(camera.x, camera.y, NATIVE_WIDTH, NATIVE_HEIGHT);

        // Lava bubbles/glow at bottom
        const lavaGrad = ctx.createLinearGradient(0, camera.y + NATIVE_HEIGHT * 0.7, 0, camera.y + NATIVE_HEIGHT);
        lavaGrad.addColorStop(0, 'transparent');
        lavaGrad.addColorStop(0.5, 'rgba(255, 100, 0, 0.4)');
        lavaGrad.addColorStop(1, 'rgba(255, 200, 0, 0.6)');
        ctx.fillStyle = lavaGrad;
        ctx.fillRect(camera.x, camera.y + NATIVE_HEIGHT * 0.7, NATIVE_WIDTH, NATIVE_HEIGHT * 0.3);

        // Floating embers
        ctx.fillStyle = '#ff6600';
        for (let i = 0; i < 20; i++) {
            const emberX = ((i * 53 + time * 20) % NATIVE_WIDTH) + camera.x;
            const emberY = camera.y + NATIVE_HEIGHT - ((time * 30 + i * 37) % (NATIVE_HEIGHT * 0.5));
            const size = 1 + Math.sin(time * 5 + i) * 0.5;
            ctx.globalAlpha = 0.5 + Math.sin(time * 4 + i) * 0.3;
            ctx.fillRect(emberX, emberY, size, size);
        }
        ctx.globalAlpha = 1;

        // Rock silhouettes
        ctx.fillStyle = '#1a0000';
        for (let i = 0; i < 6; i++) {
            const rockX = (i * 80 - camera.x * 0.2) % (NATIVE_WIDTH + 80) - 40 + camera.x;
            this.drawJaggedRock(ctx, rockX, camera.y + NATIVE_HEIGHT * 0.4, 50, 80);
        }
    }

    /**
     * Frozen Tundra - Snowy arctic landscape
     */
    renderFrozenBackground(ctx, time) {
        const camera = this.game.camera;
        const { NATIVE_WIDTH, NATIVE_HEIGHT } = this.game.config;

        // Aurora gradient sky
        const skyGrad = ctx.createLinearGradient(0, camera.y, 0, camera.y + NATIVE_HEIGHT);
        skyGrad.addColorStop(0, '#0a1628');
        skyGrad.addColorStop(0.3, '#1a3a5c');
        skyGrad.addColorStop(0.6, '#2d5a7b');
        skyGrad.addColorStop(1, '#4a7c9b');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(camera.x, camera.y, NATIVE_WIDTH, NATIVE_HEIGHT);

        // Aurora borealis effect
        ctx.globalAlpha = 0.3;
        for (let i = 0; i < 3; i++) {
            const auroraY = camera.y + 30 + i * 20;
            const hue = (time * 10 + i * 60) % 360;
            const wave = Math.sin(time + i * 0.5) * 10;

            ctx.strokeStyle = `hsla(${hue}, 70%, 60%, 0.5)`;
            ctx.lineWidth = 8;
            ctx.beginPath();
            for (let x = 0; x < NATIVE_WIDTH; x += 5) {
                const y = auroraY + Math.sin((x + camera.x) * 0.02 + time + i) * 15 + wave;
                if (x === 0) ctx.moveTo(camera.x + x, y);
                else ctx.lineTo(camera.x + x, y);
            }
            ctx.stroke();
        }
        ctx.globalAlpha = 1;

        // Snowy mountains
        ctx.fillStyle = '#b0c4de';
        for (let i = 0; i < 4; i++) {
            const mtX = (i * 120 - camera.x * 0.3) % (NATIVE_WIDTH + 120) - 60 + camera.x;
            this.drawMountain(ctx, mtX, camera.y + NATIVE_HEIGHT * 0.5, 80, 60);
        }

        // Snow particles
        ctx.fillStyle = '#fff';
        for (let i = 0; i < 30; i++) {
            const snowX = ((i * 47 + time * 10) % NATIVE_WIDTH) + camera.x;
            const snowY = ((time * 20 + i * 31) % NATIVE_HEIGHT) + camera.y;
            ctx.globalAlpha = 0.6 + Math.sin(time + i) * 0.2;
            ctx.fillRect(snowX, snowY, 2, 2);
        }
        ctx.globalAlpha = 1;
    }

    /**
     * Mushroom Kingdom Rift - Mario-inspired world
     */
    renderMushroomBackground(ctx, time) {
        const camera = this.game.camera;
        const { NATIVE_WIDTH, NATIVE_HEIGHT } = this.game.config;

        // Bright blue sky
        const skyGrad = ctx.createLinearGradient(0, camera.y, 0, camera.y + NATIVE_HEIGHT);
        skyGrad.addColorStop(0, '#5c94fc');
        skyGrad.addColorStop(0.7, '#8cb4f8');
        skyGrad.addColorStop(1, '#b8d4fc');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(camera.x, camera.y, NATIVE_WIDTH, NATIVE_HEIGHT);

        // Fluffy clouds
        ctx.fillStyle = '#fff';
        for (let i = 0; i < 6; i++) {
            const cloudX = ((i * 100 + time * 8 - camera.x * 0.15) % (NATIVE_WIDTH + 150)) - 75 + camera.x;
            const cloudY = camera.y + 25 + (i % 2) * 20;
            this.drawMarioCloud(ctx, cloudX, cloudY);
        }

        // Bush hills in background
        ctx.fillStyle = '#38a838';
        for (let i = 0; i < 5; i++) {
            const hillX = (i * 90 - camera.x * 0.4) % (NATIVE_WIDTH + 90) - 45 + camera.x;
            const hillY = camera.y + NATIVE_HEIGHT * 0.6;
            this.drawBush(ctx, hillX, hillY, 50, 30);
        }
    }

    /**
     * Default background fallback
     */
    renderDefaultBackground(ctx) {
        const gradient = ctx.createLinearGradient(0, 0, 0, this.game.config.NATIVE_HEIGHT);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(1, '#228B22');
        ctx.fillStyle = gradient;
        ctx.fillRect(this.game.camera.x, this.game.camera.y, this.game.config.NATIVE_WIDTH, this.game.config.NATIVE_HEIGHT);
    }

    // Helper drawing functions
    drawCloud(ctx, x, y, size) {
        ctx.beginPath();
        ctx.arc(x, y, size * 0.5, 0, Math.PI * 2);
        ctx.arc(x + size * 0.4, y - size * 0.2, size * 0.4, 0, Math.PI * 2);
        ctx.arc(x + size * 0.8, y, size * 0.45, 0, Math.PI * 2);
        ctx.fill();
    }

    drawMarioCloud(ctx, x, y) {
        ctx.beginPath();
        ctx.arc(x, y, 15, 0, Math.PI * 2);
        ctx.arc(x + 20, y - 5, 18, 0, Math.PI * 2);
        ctx.arc(x + 40, y, 15, 0, Math.PI * 2);
        ctx.fill();
    }

    drawHill(ctx, x, y, width, height) {
        ctx.beginPath();
        ctx.moveTo(x - width / 2, y);
        ctx.quadraticCurveTo(x, y - height, x + width / 2, y);
        ctx.fill();
    }

    drawMountain(ctx, x, y, width, height) {
        ctx.beginPath();
        ctx.moveTo(x - width / 2, y);
        ctx.lineTo(x, y - height);
        ctx.lineTo(x + width / 2, y);
        ctx.fill();

        // Snow cap
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.moveTo(x - width / 6, y - height * 0.6);
        ctx.lineTo(x, y - height);
        ctx.lineTo(x + width / 6, y - height * 0.6);
        ctx.fill();
        ctx.fillStyle = '#b0c4de';
    }

    drawJaggedRock(ctx, x, y, width, height) {
        ctx.beginPath();
        ctx.moveTo(x, y + height);
        ctx.lineTo(x + width * 0.2, y + height * 0.3);
        ctx.lineTo(x + width * 0.4, y + height * 0.5);
        ctx.lineTo(x + width * 0.6, y);
        ctx.lineTo(x + width * 0.8, y + height * 0.4);
        ctx.lineTo(x + width, y + height);
        ctx.fill();
    }

    drawBush(ctx, x, y, width, height) {
        ctx.beginPath();
        ctx.arc(x, y, width * 0.3, 0, Math.PI * 2);
        ctx.arc(x + width * 0.3, y - height * 0.2, width * 0.35, 0, Math.PI * 2);
        ctx.arc(x + width * 0.6, y, width * 0.3, 0, Math.PI * 2);
        ctx.fill();
    }

    /**
     * Render tile layer
     */
    renderTiles(ctx) {
        if (!this.tileData) return;

        const camera = this.game.camera;
        const tileSize = this.tileSize;

        // Calculate visible tile range
        const startCol = Math.max(0, Math.floor(camera.x / tileSize));
        const endCol = Math.min(this.currentLevel.width, Math.ceil((camera.x + camera.viewWidth) / tileSize) + 1);
        const startRow = Math.max(0, Math.floor(camera.y / tileSize));
        const endRow = Math.min(this.currentLevel.height, Math.ceil((camera.y + camera.viewHeight) / tileSize) + 1);

        // Get tileset
        const tileset = this.game.assets.getImage(this.currentLevel.tileset);

        // Render only visible tiles
        for (let row = startRow; row < endRow; row++) {
            for (let col = startCol; col < endCol; col++) {
                const tile = this.tileData[row]?.[col];

                if (tile && tile !== 0) {
                    const x = col * tileSize;
                    const y = row * tileSize;

                    this.renderTile(ctx, tile, x, y, tileSize, tileset, row, col);
                }
            }
        }
    }

    /**
     * Render a single tile with enhanced graphics
     */
    renderTile(ctx, tileId, x, y, size, tileset, row, col) {
        if (tileset) {
            // Draw from tileset (assuming 16x16 tiles in a 256x256 tileset)
            const tilesPerRow = 16;
            const srcX = ((tileId - 1) % tilesPerRow) * size;
            const srcY = Math.floor((tileId - 1) / tilesPerRow) * size;
            ctx.drawImage(tileset, srcX, srcY, size, size, x, y, size, size);
        } else {
            // Enhanced fallback rendering based on level theme
            this.renderThemedTile(ctx, tileId, x, y, size, row, col);
        }
    }

    /**
     * Render themed tile based on current level
     */
    renderThemedTile(ctx, tileId, x, y, size, row, col) {
        const level = this.currentLevelNumber;
        const time = Date.now() * 0.002;

        switch (level) {
            case 1: // Green Hill
                this.renderGreenHillTile(ctx, tileId, x, y, size, row, col);
                break;
            case 2: // Neon City
                this.renderNeonTile(ctx, tileId, x, y, size, row, col, time);
                break;
            case 3: // Lava Depths
                this.renderLavaTile(ctx, tileId, x, y, size, row, col, time);
                break;
            case 4: // Frozen Tundra
                this.renderFrozenTile(ctx, tileId, x, y, size, row, col);
                break;
            case 5: // Mushroom Kingdom
                this.renderMushroomTile(ctx, tileId, x, y, size, row, col);
                break;
            default:
                this.renderDefaultTile(ctx, tileId, x, y, size);
        }
    }

    renderGreenHillTile(ctx, tileId, x, y, size, row, col) {
        if (tileId === 1) {
            // Grass top with texture
            const grassGrad = ctx.createLinearGradient(x, y, x, y + size);
            grassGrad.addColorStop(0, '#7ac943');
            grassGrad.addColorStop(0.3, '#4caf50');
            grassGrad.addColorStop(1, '#388e3c');
            ctx.fillStyle = grassGrad;
            ctx.fillRect(x, y, size, size);

            // Grass blades
            ctx.fillStyle = '#8bc34a';
            for (let i = 0; i < 3; i++) {
                ctx.fillRect(x + 2 + i * 5, y, 2, 4);
            }
        } else if (tileId === 2) {
            // Dirt with checkered pattern
            ctx.fillStyle = ((row + col) % 2 === 0) ? '#8B4513' : '#A0522D';
            ctx.fillRect(x, y, size, size);
        } else {
            ctx.fillStyle = '#654321';
            ctx.fillRect(x, y, size, size);
        }
    }

    renderNeonTile(ctx, tileId, x, y, size, row, col, time) {
        // Dark metal base
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(x, y, size, size);

        // Neon grid lines
        const hue = (col * 20 + time * 50) % 360;
        ctx.strokeStyle = `hsla(${hue}, 100%, 60%, 0.6)`;
        ctx.lineWidth = 1;
        ctx.strokeRect(x + 1, y + 1, size - 2, size - 2);

        if (tileId === 1) {
            // Glowing surface
            ctx.fillStyle = `hsla(${hue}, 100%, 50%, 0.3)`;
            ctx.fillRect(x + 2, y + 2, size - 4, 4);
        }
    }

    renderLavaTile(ctx, tileId, x, y, size, row, col, time) {
        if (tileId === 1) {
            // Charred rock surface
            const rockGrad = ctx.createLinearGradient(x, y, x, y + size);
            rockGrad.addColorStop(0, '#4a3728');
            rockGrad.addColorStop(1, '#2d1f1a');
            ctx.fillStyle = rockGrad;
            ctx.fillRect(x, y, size, size);

            // Glowing cracks
            ctx.strokeStyle = `rgba(255, ${100 + Math.sin(time + col) * 50}, 0, 0.8)`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x + 3, y + size);
            ctx.lineTo(x + size / 2, y + size / 2);
            ctx.lineTo(x + size - 3, y);
            ctx.stroke();
        } else {
            ctx.fillStyle = '#1a0f0a';
            ctx.fillRect(x, y, size, size);
        }
    }

    renderFrozenTile(ctx, tileId, x, y, size, row, col) {
        if (tileId === 1 || tileId === 4) {
            // Ice surface
            const iceGrad = ctx.createLinearGradient(x, y, x + size, y + size);
            iceGrad.addColorStop(0, '#b8e4f0');
            iceGrad.addColorStop(0.5, '#e0f4ff');
            iceGrad.addColorStop(1, '#a8d8ea');
            ctx.fillStyle = iceGrad;
            ctx.fillRect(x, y, size, size);

            // Ice shine
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.fillRect(x + 2, y + 2, size / 3, 3);
        } else {
            // Snow/permafrost
            ctx.fillStyle = ((row + col) % 2 === 0) ? '#8fa8b8' : '#7a98a8';
            ctx.fillRect(x, y, size, size);
        }
    }

    renderMushroomTile(ctx, tileId, x, y, size, row, col) {
        if (tileId === 1) {
            // Mario-style brick
            ctx.fillStyle = '#c84c0c';
            ctx.fillRect(x, y, size, size);

            // Brick lines
            ctx.strokeStyle = '#a03000';
            ctx.lineWidth = 1;
            ctx.strokeRect(x, y, size, size);
            ctx.beginPath();
            ctx.moveTo(x + size / 2, y);
            ctx.lineTo(x + size / 2, y + size);
            ctx.stroke();
        } else if (tileId === 5 || tileId === 6) {
            // Pipe - green
            const pipeGrad = ctx.createLinearGradient(x, y, x + size, y);
            pipeGrad.addColorStop(0, '#00b800');
            pipeGrad.addColorStop(0.5, '#00ff00');
            pipeGrad.addColorStop(1, '#00b800');
            ctx.fillStyle = pipeGrad;
            ctx.fillRect(x, y, size, size);

            // Pipe highlight
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.fillRect(x + 2, y, 3, size);
        } else {
            // Ground block
            ctx.fillStyle = '#d88040';
            ctx.fillRect(x, y, size, size);
        }
    }

    renderDefaultTile(ctx, tileId, x, y, size) {
        const colors = {
            1: '#4a7c23',
            2: '#8B4513',
            3: '#654321',
            4: '#87CEEB',
            5: '#2ecc71',
            6: '#27ae60'
        };

        ctx.fillStyle = colors[tileId] || '#888';
        ctx.fillRect(x, y, size, size);
        ctx.strokeStyle = 'rgba(0,0,0,0.2)';
        ctx.strokeRect(x, y, size, size);
    }

    /**
     * Render goal/finish portal
     */
    renderGoal(ctx) {
        if (!this.goal) return;

        const { x, y } = this.goal;
        const time = Date.now() * 0.003;

        // Portal effect
        ctx.save();
        ctx.translate(x, y - 40);

        // Outer glow
        ctx.strokeStyle = `hsl(${(time * 50) % 360}, 70%, 50%)`;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.ellipse(0, 0, 25 + Math.sin(time) * 5, 35 + Math.cos(time) * 5, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Inner portal
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 30);
        gradient.addColorStop(0, `hsla(${(time * 50) % 360}, 80%, 60%, 0.8)`);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.ellipse(0, 0, 20, 30, 0, 0, Math.PI * 2);
        ctx.fill();

        // "GOAL" text
        ctx.fillStyle = '#fff';
        ctx.font = '8px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.fillText('GOAL', 0, -50);

        ctx.restore();
    }

    /**
     * Get ground Y position at world X
     */
    getGroundY(worldX, startY) {
        if (!this.tileData) return null;

        const col = Math.floor(worldX / this.tileSize);

        for (let row = Math.floor(startY / this.tileSize); row < this.currentLevel.height; row++) {
            const tile = this.tileData[row]?.[col];
            if (tile && tile !== 0) {
                return row * this.tileSize;
            }
        }

        return null;
    }

    /**
     * Get ceiling Y position at world X
     */
    getCeilingY(worldX, startY) {
        if (!this.tileData) return null;

        const col = Math.floor(worldX / this.tileSize);
        const startRow = Math.floor(startY / this.tileSize);

        for (let row = startRow; row >= 0; row--) {
            const tile = this.tileData[row]?.[col];
            if (tile && tile !== 0) {
                return (row + 1) * this.tileSize;
            }
        }

        return null;
    }

    /**
     * Get wall X position
     */
    getWallX(worldX, worldY, direction) {
        if (!this.tileData) return null;

        const row = Math.floor(worldY / this.tileSize);
        const col = Math.floor(worldX / this.tileSize);

        const tile = this.tileData[row]?.[col];
        if (tile && tile !== 0) {
            if (direction > 0) {
                return col * this.tileSize;
            } else {
                return (col + 1) * this.tileSize;
            }
        }

        return null;
    }

    /**
     * Get level height in pixels
     */
    getLevelHeight() {
        return this.levelHeight;
    }

    /**
     * Get spawn point
     */
    getSpawnPoint() {
        return this.currentLevel?.spawn || { x: 50, y: 160 };
    }

    /**
     * Get last checkpoint
     */
    getCheckpoint() {
        return this.lastCheckpoint || this.getSpawnPoint();
    }

    /**
     * Add a checkpoint
     */
    addCheckpoint(x, y) {
        this.checkpoints.push({ x, y });
        this.lastCheckpoint = { x, y };
    }
}
