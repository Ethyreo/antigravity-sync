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

        const bg = this.game.assets.getImage(this.currentLevel.background);
        if (bg) {
            // Calculate parallax offset
            const parallaxX = this.game.camera.x * 0.3;
            const parallaxY = this.game.camera.y * 0.1;

            // Draw background tiled
            const bgWidth = bg.width || 320;
            const bgHeight = bg.height || 224;

            const startX = Math.floor(parallaxX / bgWidth) * bgWidth;

            for (let x = startX - bgWidth; x < this.game.camera.x + this.game.config.NATIVE_WIDTH + bgWidth; x += bgWidth) {
                ctx.drawImage(bg, x - parallaxX + this.game.camera.x, -parallaxY + this.game.camera.y, bgWidth, bgHeight);
            }
        } else {
            // Fallback gradient
            const gradient = ctx.createLinearGradient(0, 0, 0, this.game.config.NATIVE_HEIGHT);
            gradient.addColorStop(0, '#87CEEB');
            gradient.addColorStop(1, '#228B22');
            ctx.fillStyle = gradient;
            ctx.fillRect(this.game.camera.x, this.game.camera.y, this.game.config.NATIVE_WIDTH, this.game.config.NATIVE_HEIGHT);
        }
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

                    this.renderTile(ctx, tile, x, y, tileSize, tileset);
                }
            }
        }
    }

    /**
     * Render a single tile
     */
    renderTile(ctx, tileId, x, y, size, tileset) {
        if (tileset) {
            // Draw from tileset (assuming 16x16 tiles in a 256x256 tileset)
            const tilesPerRow = 16;
            const srcX = ((tileId - 1) % tilesPerRow) * size;
            const srcY = Math.floor((tileId - 1) / tilesPerRow) * size;
            ctx.drawImage(tileset, srcX, srcY, size, size, x, y, size, size);
        } else {
            // Fallback colors
            const colors = {
                1: '#4a7c23', // Ground top
                2: '#8B4513', // Underground
                3: '#654321', // Platform
                4: '#87CEEB', // Ice
                5: '#2ecc71', // Pipe
                6: '#27ae60'  // Pipe top
            };

            ctx.fillStyle = colors[tileId] || '#888';
            ctx.fillRect(x, y, size, size);

            // Add simple texture
            ctx.strokeStyle = 'rgba(0,0,0,0.2)';
            ctx.strokeRect(x, y, size, size);
        }
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
