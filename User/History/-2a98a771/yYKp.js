/**
 * DimensionManager.js - Handles Dimension Swapping logic
 * Manages the state between Fantasy and Sci-Fi worlds
 */

class DimensionManager {
    constructor(scene) {
        this.scene = scene;
        this.currentDimension = 'fantasy'; // 'fantasy' or 'scifi'
        this.isSwapping = false;

        // Listen for dimension events
        this.events = new Phaser.Events.EventEmitter();
    }

    swap() {
        if (this.isSwapping) return;

        this.isSwapping = true;

        // Toggle dimension
        this.currentDimension = this.currentDimension === 'fantasy' ? 'scifi' : 'fantasy';

        // Visual effect for swap (Screen shake + flash)
        this.scene.cameras.main.shake(100, 0.01);
        const color = this.currentDimension === 'fantasy' ? 0x8b5cf6 : 0x06b6d4;
        this.scene.cameras.main.flash(300, (color >> 16) & 0xFF, (color >> 8) & 0xFF, color & 0xFF);

        // Emit event for other entities to react
        this.events.emit('dimensionChanged', this.currentDimension);

        // Cooldown
        this.scene.time.delayedCall(500, () => {
            this.isSwapping = false;
        });
    }

    // Check if an object belongs to current dimension
    isVisibleInCurrent(dimensionType) {
        return dimensionType === 'both' || dimensionType === this.currentDimension;
    }
}

// Make available globally
window.DimensionManager = DimensionManager;
