/**
 * Input Manager
 * Handles keyboard and touch input
 */

export class Input {
    constructor(game) {
        this.game = game;

        // Key states
        this.keys = {};
        this.previousKeys = {};

        // Virtual button states (for touch)
        this.buttons = {};
        this.previousButtons = {};

        // Key bindings
        this.bindings = {
            left: ['ArrowLeft', 'KeyA'],
            right: ['ArrowRight', 'KeyD'],
            up: ['ArrowUp', 'KeyW'],
            down: ['ArrowDown', 'KeyS'],
            jump: ['Space', 'ArrowUp', 'Enter'],
            spin: ['ShiftLeft', 'ShiftRight', 'KeyE'],
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
            this.keys[e.code] = true;

            // Prevent default for game keys
            if (this.isGameKey(e.code)) {
                e.preventDefault();
            }
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });

        // Handle focus loss
        window.addEventListener('blur', () => {
            this.keys = {};
            this.buttons = {};
        });
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

            // Touch start
            btn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.buttons[key] = true;
                btn.classList.add('active');
            });

            // Touch end
            btn.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.buttons[key] = false;
                btn.classList.remove('active');
            });

            // Touch cancel
            btn.addEventListener('touchcancel', (e) => {
                this.buttons[key] = false;
                btn.classList.remove('active');
            });

            // Mouse events for testing on desktop
            btn.addEventListener('mousedown', (e) => {
                e.preventDefault();
                this.buttons[key] = true;
            });

            btn.addEventListener('mouseup', (e) => {
                this.buttons[key] = false;
            });

            btn.addEventListener('mouseleave', (e) => {
                this.buttons[key] = false;
            });
        });
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
     * Update input state (call at start of frame)
     */
    update() {
        // Copy current states to previous
        this.previousKeys = { ...this.keys };
        this.previousButtons = { ...this.buttons };
    }

    /**
     * Check if an action is currently pressed
     */
    isPressed(action) {
        // Check keyboard
        const keyCodes = this.bindings[action];
        if (keyCodes) {
            for (const code of keyCodes) {
                if (this.keys[code]) return true;
            }
        }

        // Check touch buttons
        if (this.buttons[action]) return true;

        return false;
    }

    /**
     * Check if an action was just pressed this frame
     */
    justPressed(action) {
        const keyCodes = this.bindings[action];

        // Check keyboard
        if (keyCodes) {
            for (const code of keyCodes) {
                if (this.keys[code] && !this.previousKeys[code]) {
                    return true;
                }
            }
        }

        // Check touch buttons
        if (this.buttons[action] && !this.previousButtons[action]) {
            return true;
        }

        return false;
    }

    /**
     * Check if an action was just released this frame
     */
    justReleased(action) {
        const keyCodes = this.bindings[action];

        // Check keyboard
        if (keyCodes) {
            for (const code of keyCodes) {
                if (!this.keys[code] && this.previousKeys[code]) {
                    return true;
                }
            }
        }

        // Check touch buttons
        if (!this.buttons[action] && this.previousButtons[action]) {
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
