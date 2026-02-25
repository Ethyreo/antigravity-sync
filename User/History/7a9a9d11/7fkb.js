/**
 * Asset Loader
 * Handles loading images and audio with progress tracking
 * Creates placeholder assets for missing files
 */

export class AssetLoader {
    constructor() {
        this.images = new Map();
        this.audio = new Map();
        this.onProgress = null;
        this.totalAssets = 0;
        this.loadedAssets = 0;
    }

    /**
     * Load all assets from manifest
     */
    async loadAll(manifest) {
        const imageEntries = Object.entries(manifest.images || {});
        const audioEntries = Object.entries(manifest.audio || {});

        this.totalAssets = imageEntries.length + audioEntries.length;
        this.loadedAssets = 0;

        // Load images
        for (const [name, path] of imageEntries) {
            await this.loadImage(name, path);
        }

        // Load audio
        for (const [name, path] of audioEntries) {
            await this.loadAudio(name, path);
        }

        return {
            images: this.images,
            audio: this.audio
        };
    }

    /**
     * Load a single image
     */
    async loadImage(name, path) {
        return new Promise((resolve) => {
            const img = new Image();

            img.onload = () => {
                this.images.set(name, img);
                this.updateProgress(name);
                resolve(img);
            };

            img.onerror = () => {
                // Create placeholder image
                const placeholder = this.createPlaceholderImage(name);
                this.images.set(name, placeholder);
                this.updateProgress(name + ' (placeholder)');
                resolve(placeholder);
            };

            img.src = path;
        });
    }

    /**
     * Load a single audio file
     */
    async loadAudio(name, path) {
        return new Promise((resolve) => {
            const audio = new Audio();

            audio.oncanplaythrough = () => {
                this.audio.set(name, audio);
                this.updateProgress(name);
                resolve(audio);
            };

            audio.onerror = () => {
                // Create silent placeholder
                this.audio.set(name, null);
                this.updateProgress(name + ' (silent)');
                resolve(null);
            };

            // Set a timeout in case audio never loads
            setTimeout(() => {
                if (!this.audio.has(name)) {
                    this.audio.set(name, null);
                    this.updateProgress(name + ' (timeout)');
                    resolve(null);
                }
            }, 3000);

            audio.src = path;
            audio.load();
        });
    }

    /**
     * Create a colorful placeholder image for missing assets
     */
    createPlaceholderImage(name) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Determine size based on asset type
        let width = 32;
        let height = 32;

        if (name.includes('bg-') || name.includes('background')) {
            width = 320;
            height = 224;
        } else if (name.includes('tileset')) {
            width = 256;
            height = 256;
        } else if (name.includes('title')) {
            width = 256;
            height = 64;
        }

        canvas.width = width;
        canvas.height = height;

        // Generate color based on name
        const hue = this.hashString(name) % 360;

        if (name.includes('bg-')) {
            // Create gradient background
            this.drawPlaceholderBackground(ctx, width, height, name);
        } else if (name.includes('sonic')) {
            // Draw Sonic placeholder
            this.drawSonicPlaceholder(ctx, width, height, name);
        } else if (name.includes('ring')) {
            // Draw ring placeholder
            this.drawRingPlaceholder(ctx, width, height);
        } else if (name.includes('enemy')) {
            // Draw enemy placeholder
            this.drawEnemyPlaceholder(ctx, width, height);
        } else if (name.includes('tileset')) {
            // Draw tileset placeholder
            this.drawTilesetPlaceholder(ctx, width, height, name);
        } else {
            // Default colored square
            ctx.fillStyle = `hsl(${hue}, 70%, 50%)`;
            ctx.fillRect(0, 0, width, height);
            ctx.strokeStyle = '#fff';
            ctx.strokeRect(1, 1, width - 2, height - 2);
        }

        return canvas;
    }

    /**
     * Draw a Sonic placeholder sprite
     */
    drawSonicPlaceholder(ctx, width, height, name) {
        const isSuper = name.includes('super');
        const baseColor = isSuper ? '#FFD700' : '#1565C0';
        const secondaryColor = isSuper ? '#FFF8DC' : '#87CEEB';

        // Body
        ctx.fillStyle = baseColor;
        ctx.beginPath();
        ctx.ellipse(width / 2, height / 2, width / 3, height / 2.5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Spikes
        ctx.fillStyle = baseColor;
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.moveTo(width / 2 + 5, height / 3 - i * 4);
            ctx.lineTo(width - 2, height / 4 - i * 3);
            ctx.lineTo(width / 2 + 5, height / 3 - i * 4 + 6);
            ctx.fill();
        }

        // Belly
        ctx.fillStyle = '#F5DEB3';
        ctx.beginPath();
        ctx.ellipse(width / 2 - 2, height / 2 + 2, width / 5, height / 4, 0, 0, Math.PI * 2);
        ctx.fill();

        // Eyes
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.ellipse(width / 2 - 3, height / 3, 4, 5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(width / 2 - 2, height / 3, 2, 0, Math.PI * 2);
        ctx.fill();

        // Shoes
        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(width / 2 - 8, height - 8, 6, 6);
        ctx.fillRect(width / 2 + 2, height - 8, 6, 6);
    }

    /**
     * Draw a ring placeholder
     */
    drawRingPlaceholder(ctx, width, height) {
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, Math.min(width, height) / 3, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = '#FFAA00';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, Math.min(width, height) / 3 - 2, 0, Math.PI * 2);
        ctx.stroke();
    }

    /**
     * Draw an enemy placeholder
     */
    drawEnemyPlaceholder(ctx, width, height) {
        // Body
        ctx.fillStyle = '#e74c3c';
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, Math.min(width, height) / 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Eyes
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(width / 2 - 5, height / 2 - 3, 4, 0, Math.PI * 2);
        ctx.arc(width / 2 + 5, height / 2 - 3, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(width / 2 - 5, height / 2 - 3, 2, 0, Math.PI * 2);
        ctx.arc(width / 2 + 5, height / 2 - 3, 2, 0, Math.PI * 2);
        ctx.fill();
    }

    /**
     * Draw a tileset placeholder
     */
    drawTilesetPlaceholder(ctx, width, height, name) {
        const tileSize = 16;
        const colors = this.getThemeColors(name);

        for (let y = 0; y < height; y += tileSize) {
            for (let x = 0; x < width; x += tileSize) {
                const tileIndex = (x / tileSize + y / tileSize) % 16;

                if (tileIndex === 0) {
                    // Empty/sky tile
                    ctx.fillStyle = colors.sky;
                } else if (tileIndex < 4) {
                    // Ground tile
                    ctx.fillStyle = colors.ground;
                } else if (tileIndex < 8) {
                    // Accent tile
                    ctx.fillStyle = colors.accent;
                } else {
                    // Decorative tile
                    ctx.fillStyle = colors.decor;
                }

                ctx.fillRect(x, y, tileSize, tileSize);
                ctx.strokeStyle = 'rgba(0,0,0,0.2)';
                ctx.strokeRect(x, y, tileSize, tileSize);
            }
        }
    }

    /**
     * Draw a placeholder background
     */
    drawPlaceholderBackground(ctx, width, height, name) {
        const colors = this.getThemeColors(name);

        // Sky gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, colors.sky);
        gradient.addColorStop(0.7, colors.skyBottom || colors.sky);
        gradient.addColorStop(1, colors.ground);

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        // Add some decorative elements based on theme
        if (name.includes('greenhill')) {
            // Hills
            ctx.fillStyle = '#228B22';
            this.drawHill(ctx, 50, height - 30, 80, 40);
            this.drawHill(ctx, 150, height - 20, 100, 30);
            this.drawHill(ctx, 280, height - 35, 70, 45);
        } else if (name.includes('neon')) {
            // City buildings
            ctx.fillStyle = '#1a1a2e';
            for (let i = 0; i < 8; i++) {
                const bw = 20 + Math.random() * 30;
                const bh = 40 + Math.random() * 80;
                ctx.fillRect(i * 45, height - bh, bw, bh);
            }
        } else if (name.includes('lava')) {
            // Lava at bottom
            ctx.fillStyle = '#ff4500';
            ctx.fillRect(0, height - 30, width, 30);
            ctx.fillStyle = '#ff6347';
            for (let i = 0; i < 10; i++) {
                ctx.beginPath();
                ctx.arc(i * 35 + 15, height - 25, 8, 0, Math.PI * 2);
                ctx.fill();
            }
        } else if (name.includes('frozen')) {
            // Snow
            ctx.fillStyle = '#fff';
            for (let i = 0; i < 50; i++) {
                ctx.beginPath();
                ctx.arc(Math.random() * width, Math.random() * height, 2, 0, Math.PI * 2);
                ctx.fill();
            }
        } else if (name.includes('mushroom')) {
            // Mushrooms and pipes
            ctx.fillStyle = '#228B22';
            ctx.fillRect(0, height - 20, width, 20);
            // Pipes
            ctx.fillStyle = '#2ecc71';
            ctx.fillRect(80, height - 60, 30, 60);
            ctx.fillRect(200, height - 80, 30, 80);
        }
    }

    /**
     * Draw a decorative hill
     */
    drawHill(ctx, x, y, width, height) {
        ctx.beginPath();
        ctx.moveTo(x - width / 2, y);
        ctx.quadraticCurveTo(x, y - height, x + width / 2, y);
        ctx.fill();
    }

    /**
     * Get theme colors based on level name
     */
    getThemeColors(name) {
        if (name.includes('greenhill')) {
            return {
                sky: '#87CEEB',
                skyBottom: '#98D8C8',
                ground: '#228B22',
                accent: '#8B4513',
                decor: '#90EE90'
            };
        } else if (name.includes('neon')) {
            return {
                sky: '#0f0c29',
                skyBottom: '#302b63',
                ground: '#1a1a2e',
                accent: '#e94560',
                decor: '#00f5d4'
            };
        } else if (name.includes('lava')) {
            return {
                sky: '#2c0a0a',
                skyBottom: '#4a1010',
                ground: '#8B0000',
                accent: '#FF4500',
                decor: '#FF6347'
            };
        } else if (name.includes('frozen')) {
            return {
                sky: '#1a1a2e',
                skyBottom: '#4a6fa5',
                ground: '#E0FFFF',
                accent: '#00CED1',
                decor: '#FFFFFF'
            };
        } else if (name.includes('mushroom')) {
            return {
                sky: '#87CEEB',
                skyBottom: '#98FB98',
                ground: '#8B4513',
                accent: '#FF0000',
                decor: '#2ecc71'
            };
        }

        return {
            sky: '#333',
            ground: '#666',
            accent: '#999',
            decor: '#ccc'
        };
    }

    /**
     * Simple string hash for color generation
     */
    hashString(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return Math.abs(hash);
    }

    /**
     * Update loading progress
     */
    updateProgress(assetName) {
        this.loadedAssets++;
        const progress = this.loadedAssets / this.totalAssets;

        if (this.onProgress) {
            this.onProgress(progress, assetName);
        }
    }

    /**
     * Get a loaded image
     */
    getImage(name) {
        return this.images.get(name);
    }

    /**
     * Get a loaded audio
     */
    getAudio(name) {
        return this.audio.get(name);
    }
}
