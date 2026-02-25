/**
 * Input Manager
 * Handles keyboard and touch input
 */

export class Input {
    constructor(game) {
        this.game = game;

        // Key states with frame timestamps
        // Format: { [code]: { down: boolean, pressedAt: number, releasedAt: number } }
        this.keyStates = {};

        // Touch states
        this.buttonStates = {};

        // Key bindings
        this.bindings = {
            left: ['ArrowLeft', 'KeyA'],
            right: ['ArrowRight', 'KeyD'],
            up: ['ArrowUp', 'KeyW'],
            down: ['ArrowDown', 'KeyS'],
            jump: ['Space', 'Enter', 'KeyZ', 'KeyJ'],
            spin: ['ShiftLeft', 'ShiftRight', 'KeyX', 'KeyK'],
            pause: ['Escape', 'KeyP']
        };

        // Debug logging
        this.debugInput = false;

        // Detect mobile
        this.isMobile = this.detectMobile();

        // Set up event listeners
        this.setupKeyboardEvents();
        this.setupTouchEvents();

        // Show/hide touch controls
        this.updateTouchControlsVisibility();
    }

    /**
     * Detect if device is mobile
     */
    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
            ('ontouchstart' in window) ||
            (navigator.maxTouchPoints > 0);
    }

    /**
     * Set up keyboard event listeners
     */
    setupKeyboardEvents() {
        window.addEventListener('keydown', (e) => {
            if (e.repeat) return; // Ignore auto-repeat

            this.setKeyState(e.code, true);

            // Debug logging
            if (this.debugInput) {
                console.log(`Key DOWN: ${e.code} Frame: ${this.game.frameCount}`);
            }

            // Prevent default for game keys
            if (this.isGameKey(e.code)) {
                e.preventDefault();
            }
        });

        window.addEventListener('keyup', (e) => {
            this.setKeyState(e.code, false);

            if (this.debugInput) {
                console.log(`Key UP: ${e.code} Frame: ${this.game.frameCount}`);
            }
        });

        // Handle focus loss
        window.addEventListener('blur', () => {
            // Reset all keys to avoid collisions
            this.keyStates = {};
            this.buttonStates = {};
        });

        // Log that input is ready
        console.log('🎮 Input system initialized (Robust Mode). Press F2 to toggle input debug.');

        // F2 toggles input debug
        window.addEventListener('keydown', (e) => {
            if (e.code === 'F2') {
                this.debugInput = !this.debugInput;
                console.log(`Input debug: ${this.debugInput ? 'ON' : 'OFF'}`);
            }
        });
    }

    /**
     * Update key state with timestamp
     */
    setKeyState(code, isDown) {
        if (!this.keyStates[code]) {
            this.keyStates[code] = { down: false, pressedAt: 0, releasedAt: 0 };
        }

        const state = this.keyStates[code];
        const frame = this.game.frameCount || 0;

        if (isDown && !state.down) {
            state.down = true;
            state.pressedAt = frame;
        } else if (!isDown && state.down) {
            state.down = false;
            state.releasedAt = frame;
        }
    }

    /**
     * Set up touch event listeners
     */
    setupTouchEvents() {
        const touchControls = document.getElementById('touch-controls');
        if (!touchControls) return;

        const buttons = touchControls.querySelectorAll('.touch-btn');

        buttons.forEach(btn => {
            const key = btn.dataset.key;

            const handleTouch = (isDown) => {
                // Use a virtual key code for touch buttons to share logic
                this.setButtonState(key, isDown);
                if (isDown) btn.classList.add('active');
                else btn.classList.remove('active');
            };

            btn.addEventListener('touchstart', (e) => { e.preventDefault(); handleTouch(true); });
            btn.addEventListener('touchend', (e) => { e.preventDefault(); handleTouch(false); });
            btn.addEventListener('touchcancel', (e) => handleTouch(false));

            // Mouse support for testing
            btn.addEventListener('mousedown', (e) => { e.preventDefault(); handleTouch(true); });
            btn.addEventListener('mouseup', () => handleTouch(false));
            btn.addEventListener('mouseleave', () => handleTouch(false));
        });
    }

    setButtonState(key, isDown) {
        if (!this.buttonStates[key]) {
            this.buttonStates[key] = { down: false, pressedAt: 0, releasedAt: 0 };
        }

        const state = this.buttonStates[key];
        const frame = this.game.frameCount || 0;

        if (isDown && !state.down) {
            state.down = true;
            state.pressedAt = frame;
        } else if (!isDown && state.down) {
            state.down = false;
            state.releasedAt = frame;
        }
    }

    /**
     * Update touch controls visibility
     */
    updateTouchControlsVisibility() {
        const touchControls = document.getElementById('touch-controls');
        if (touchControls) {
            if (this.isMobile) {
                touchControls.classList.remove('hidden');
            } else {
                touchControls.classList.add('hidden');
            }
        }
    }

    /**
     * Check if a key is a game key
     */
    isGameKey(code) {
        for (const action in this.bindings) {
            if (this.bindings[action].includes(code)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Update input state - No longer needed!
     * Kept for compatibility but does nothing.
     */
    update() {
        // Frame-based system doesn't need explicit updates
    }

    /**
     * Check if an action is currently pressed
     */
    isPressed(action) {
        // Check keyboard
        const keyCodes = this.bindings[action];
        if (keyCodes) {
            for (const code of keyCodes) {
                if (this.keyStates[code]?.down) return true;
            }
        }

        // Check touch buttons
        if (this.buttonStates[action]?.down) return true;

        return false;
    }

    /**
     * Check if an action was just pressed this frame
     * Allows 5 frames of buffer to prevent missed inputs
     */
    justPressed(action) {
        const frame = this.game.frameCount || 0;
        const tolerance = 5; // Look back 5 frames

        // Check keyboard
        const keyCodes = this.bindings[action];
        if (keyCodes) {
            for (const code of keyCodes) {
                const state = this.keyStates[code];
                if (state && state.down && (frame - state.pressedAt) <= tolerance && (frame - state.pressedAt) >= 0) {
                    // Consume the press so it doesn't trigger multiple times
                    // We change pressedAt to avoid re-triggering, but keep down=true
                    state.pressedAt = -100;
                    return true;
                }
            }
        }

        // Check touch buttons
        const btnState = this.buttonStates[action];
        if (btnState && btnState.down && (frame - btnState.pressedAt) <= tolerance && (frame - btnState.pressedAt) >= 0) {
            btnState.pressedAt = -100;
            return true;
        }

        return false;
    }

    /**
     * Check if an action was just released this frame
     */
    justReleased(action) {
        const frame = this.game.frameCount || 0;
        const tolerance = 5;

        // Check keyboard
        const keyCodes = this.bindings[action];
        if (keyCodes) {
            for (const code of keyCodes) {
                const state = this.keyStates[code];
                if (state && !state.down && (frame - state.releasedAt) <= tolerance && (frame - state.releasedAt) >= 0) {
                    state.releasedAt = -100;
                    return true;
                }
            }
        }

        // Check touch
        const btnState = this.buttonStates[action];
        if (btnState && !btnState.down && (frame - btnState.releasedAt) <= tolerance && (frame - btnState.releasedAt) >= 0) {
            btnState.releasedAt = -100;
            return true;
        }

        return false;
    }

    /**
     * Get horizontal input (-1 to 1)
     */
    getHorizontal() {
        let h = 0;
        if (this.isPressed('left')) h -= 1;
        if (this.isPressed('right')) h += 1;
        return h;
    }

    /**
     * Get vertical input (-1 to 1)
     */
    getVertical() {
        let v = 0;
        if (this.isPressed('up')) v -= 1;
        if (this.isPressed('down')) v += 1;
        return v;
    }
}
