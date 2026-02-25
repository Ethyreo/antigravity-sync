/**
 * Controls.js - Input handling for Rift Runners
 * Manages keyboard input and provides a clean API for game controls
 */

class Controls {
    constructor(scene) {
        this.scene = scene;
        this.cursors = null;
        this.keys = {};
        this.enabled = true;

        this.setupControls();
    }

    setupControls() {
        // Arrow keys
        this.cursors = this.scene.input.keyboard.createCursorKeys();

        // WASD keys
        this.keys = {
            W: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            A: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            S: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            D: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
            SPACE: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
            SHIFT: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT),
            ESC: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC),
            ENTER: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER),
            E: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E)
        };
    }

    // Movement checks
    get left() {
        if (!this.enabled) return false;
        return this.cursors.left.isDown || this.keys.A.isDown;
    }

    get right() {
        if (!this.enabled) return false;
        return this.cursors.right.isDown || this.keys.D.isDown;
    }

    get up() {
        if (!this.enabled) return false;
        return this.cursors.up.isDown || this.keys.W.isDown;
    }

    get down() {
        if (!this.enabled) return false;
        return this.cursors.down.isDown || this.keys.S.isDown;
    }

    // Action checks
    get jump() {
        if (!this.enabled) return false;
        return Phaser.Input.Keyboard.JustDown(this.cursors.up) ||
            Phaser.Input.Keyboard.JustDown(this.keys.W) ||
            Phaser.Input.Keyboard.JustDown(this.keys.SPACE);
    }

    get dash() {
        if (!this.enabled) return false;
        return Phaser.Input.Keyboard.JustDown(this.keys.SHIFT);
    }

    get swap() {
        if (!this.enabled) return false;
        return Phaser.Input.Keyboard.JustDown(this.keys.E);
    }

    get pause() {
        return Phaser.Input.Keyboard.JustDown(this.keys.ESC);
    }

    get confirm() {
        return Phaser.Input.Keyboard.JustDown(this.keys.ENTER) ||
            Phaser.Input.Keyboard.JustDown(this.keys.SPACE);
    }

    // Enable/disable controls
    disable() {
        this.enabled = false;
    }

    enable() {
        this.enabled = true;
    }
}

// Make available globally
window.Controls = Controls;
