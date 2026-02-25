/**
 * MenuScene.js - Main menu and title screen
 * Features animated title and interactive menu options
 */

class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
        this.selectedOption = 0;
        this.menuOptions = ['Start Game', 'Controls', 'Credits'];
    }

    create() {
        const { width, height } = this.scale;

        // Background
        this.add.image(width / 2, height / 2, 'bg_far').setScrollFactor(0);
        this.add.image(width / 2, height / 2, 'bg_mid').setScrollFactor(0).setAlpha(0.5);

        // Floating particles effect
        this.createAmbientParticles();

        // Title with animation
        this.createTitle();

        // Menu options
        this.createMenuOptions();

        // Controls hint
        this.createControlsHint();

        // Input
        this.controls = new Controls(this);

        // Keyboard navigation
        this.input.keyboard.on('keydown-UP', () => this.changeSelection(-1));
        this.input.keyboard.on('keydown-DOWN', () => this.changeSelection(1));
        this.input.keyboard.on('keydown-W', () => this.changeSelection(-1));
        this.input.keyboard.on('keydown-S', () => this.changeSelection(1));
        this.input.keyboard.on('keydown-ENTER', () => this.selectOption());
        this.input.keyboard.on('keydown-SPACE', () => this.selectOption());
    }

    createAmbientParticles() {
        const { width, height } = this.scale;

        // Create floating orbs
        for (let i = 0; i < 20; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const orb = this.add.circle(x, y, Math.random() * 3 + 2);

            // Alternate between fantasy and sci-fi colors
            orb.setFillStyle(i % 2 === 0 ? 0x8b5cf6 : 0x06b6d4, 0.6);

            // Float animation
            this.tweens.add({
                targets: orb,
                y: orb.y - 50 - Math.random() * 50,
                alpha: { from: 0.6, to: 0.2 },
                duration: 3000 + Math.random() * 2000,
                ease: 'Sine.easeInOut',
                yoyo: true,
                repeat: -1,
                delay: Math.random() * 2000
            });
        }
    }

    createTitle() {
        const { width, height } = this.scale;

        // Main title
        this.titleText = this.add.text(width / 2, height * 0.25, 'RIFT RUNNERS', {
            fontFamily: 'Orbitron, sans-serif',
            fontSize: '72px',
            fontStyle: 'bold',
            color: '#ffffff',
            stroke: '#8b5cf6',
            strokeThickness: 4,
            shadow: {
                offsetX: 0,
                offsetY: 0,
                color: '#06b6d4',
                blur: 20,
                fill: true
            }
        }).setOrigin(0.5);

        // Subtitle
        this.add.text(width / 2, height * 0.35, 'Where Fantasy Meets Technology', {
            fontFamily: 'Quicksand, sans-serif',
            fontSize: '24px',
            color: '#94a3b8'
        }).setOrigin(0.5);

        // Title float animation
        this.tweens.add({
            targets: this.titleText,
            y: this.titleText.y - 10,
            duration: 2000,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });
    }

    createMenuOptions() {
        const { width, height } = this.scale;
        this.menuTexts = [];

        this.menuOptions.forEach((option, index) => {
            const y = height * 0.55 + index * 60;

            const text = this.add.text(width / 2, y, option, {
                fontFamily: 'Quicksand, sans-serif',
                fontSize: '32px',
                color: index === 0 ? '#ffffff' : '#64748b'
            }).setOrigin(0.5).setInteractive();

            // Hover effects
            text.on('pointerover', () => {
                this.selectedOption = index;
                this.updateMenuSelection();
            });

            text.on('pointerdown', () => {
                this.selectOption();
            });

            this.menuTexts.push(text);
        });

        // Selection indicator
        this.selector = this.add.text(width / 2 - 120, height * 0.55, '►', {
            fontFamily: 'sans-serif',
            fontSize: '32px',
            color: '#8b5cf6'
        }).setOrigin(0.5);

        // Selector pulse animation
        this.tweens.add({
            targets: this.selector,
            alpha: 0.5,
            duration: 500,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });
    }

    createControlsHint() {
        const { width, height } = this.scale;

        this.add.text(width / 2, height - 40, 'Use ↑↓ or W/S to navigate  •  ENTER or SPACE to select', {
            fontFamily: 'Quicksand, sans-serif',
            fontSize: '16px',
            color: '#475569'
        }).setOrigin(0.5);
    }

    changeSelection(direction) {
        this.selectedOption = Phaser.Math.Wrap(
            this.selectedOption + direction,
            0,
            this.menuOptions.length
        );
        this.updateMenuSelection();
    }

    updateMenuSelection() {
        const { height } = this.scale;

        // Update text colors
        this.menuTexts.forEach((text, index) => {
            if (index === this.selectedOption) {
                text.setColor('#ffffff');
                text.setScale(1.1);
            } else {
                text.setColor('#64748b');
                text.setScale(1);
            }
        });

        // Move selector
        this.tweens.add({
            targets: this.selector,
            y: height * 0.55 + this.selectedOption * 60,
            duration: 150,
            ease: 'Power2'
        });
    }

    selectOption() {
        const option = this.menuOptions[this.selectedOption];

        // Flash effect
        this.cameras.main.flash(200, 139, 92, 246);

        switch (option) {
            case 'Start Game':
                this.time.delayedCall(200, () => {
                    this.scene.start('GameScene');
                });
                break;
            case 'Controls':
                this.showControls();
                break;
            case 'Credits':
                this.showCredits();
                break;
        }
    }

    showControls() {
        const { width, height } = this.scale;

        // Create overlay
        const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.8);

        const controlsText = [
            'CONTROLS',
            '',
            '← → or A/D  -  Move',
            '↑ or W or SPACE  -  Jump',
            'SHIFT  -  Dash',
            'ESC  -  Pause',
            '',
            'Press any key to return'
        ].join('\n');

        const text = this.add.text(width / 2, height / 2, controlsText, {
            fontFamily: 'Quicksand, sans-serif',
            fontSize: '24px',
            color: '#ffffff',
            align: 'center',
            lineSpacing: 10
        }).setOrigin(0.5);

        // Close on any key
        this.input.keyboard.once('keydown', () => {
            overlay.destroy();
            text.destroy();
        });
    }

    showCredits() {
        const { width, height } = this.scale;

        const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.8);

        const creditsText = [
            'RIFT RUNNERS',
            '',
            'A Fantasy/Sci-Fi Platformer',
            'Inspired by It Takes Two',
            '',
            'Built with Phaser 3',
            '',
            'Press any key to return'
        ].join('\n');

        const text = this.add.text(width / 2, height / 2, creditsText, {
            fontFamily: 'Quicksand, sans-serif',
            fontSize: '24px',
            color: '#ffffff',
            align: 'center',
            lineSpacing: 10
        }).setOrigin(0.5);

        this.input.keyboard.once('keydown', () => {
            overlay.destroy();
            text.destroy();
        });
    }
}

// Make available globally
window.MenuScene = MenuScene;
