/**
 * PauseScene.js - Pause menu overlay
 * Overlays on top of GameScene with resume/quit options
 */

class PauseScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PauseScene' });
        this.selectedOption = 0;
        this.menuOptions = ['Resume', 'Restart', 'Main Menu'];
    }

    create() {
        const { width, height } = this.scale;

        // Semi-transparent overlay
        this.add.rectangle(width / 2, height / 2, width, height, 0x0a0a0f, 0.85);

        // Pause title
        this.add.text(width / 2, height * 0.3, 'PAUSED', {
            fontFamily: 'Orbitron, sans-serif',
            fontSize: '56px',
            fontStyle: 'bold',
            color: '#8b5cf6',
            stroke: '#1e1b4b',
            strokeThickness: 4
        }).setOrigin(0.5);

        // Menu options
        this.menuTexts = [];
        this.menuOptions.forEach((option, index) => {
            const y = height * 0.5 + index * 50;
            const text = this.add.text(width / 2, y, option, {
                fontFamily: 'Quicksand, sans-serif',
                fontSize: '28px',
                color: index === 0 ? '#ffffff' : '#64748b'
            }).setOrigin(0.5).setInteractive();

            text.on('pointerover', () => {
                this.selectedOption = index;
                this.updateSelection();
            });

            text.on('pointerdown', () => {
                this.selectOption();
            });

            this.menuTexts.push(text);
        });

        // Selector
        this.selector = this.add.text(width / 2 - 100, height * 0.5, '►', {
            fontFamily: 'sans-serif',
            fontSize: '28px',
            color: '#06b6d4'
        }).setOrigin(0.5);

        this.tweens.add({
            targets: this.selector,
            alpha: 0.5,
            duration: 400,
            yoyo: true,
            repeat: -1
        });

        // Hint
        this.add.text(width / 2, height - 50, 'ESC to resume', {
            fontFamily: 'Quicksand, sans-serif',
            fontSize: '16px',
            color: '#475569'
        }).setOrigin(0.5);

        // Input handlers
        this.input.keyboard.on('keydown-UP', () => this.changeSelection(-1));
        this.input.keyboard.on('keydown-DOWN', () => this.changeSelection(1));
        this.input.keyboard.on('keydown-W', () => this.changeSelection(-1));
        this.input.keyboard.on('keydown-S', () => this.changeSelection(1));
        this.input.keyboard.on('keydown-ENTER', () => this.selectOption());
        this.input.keyboard.on('keydown-SPACE', () => this.selectOption());
        this.input.keyboard.on('keydown-ESC', () => this.resumeGame());
    }

    changeSelection(direction) {
        this.selectedOption = Phaser.Math.Wrap(
            this.selectedOption + direction,
            0,
            this.menuOptions.length
        );
        this.updateSelection();
    }

    updateSelection() {
        const { height } = this.scale;

        this.menuTexts.forEach((text, index) => {
            if (index === this.selectedOption) {
                text.setColor('#ffffff');
                text.setScale(1.1);
            } else {
                text.setColor('#64748b');
                text.setScale(1);
            }
        });

        this.tweens.add({
            targets: this.selector,
            y: height * 0.5 + this.selectedOption * 50,
            duration: 100,
            ease: 'Power2'
        });
    }

    selectOption() {
        const option = this.menuOptions[this.selectedOption];

        switch (option) {
            case 'Resume':
                this.resumeGame();
                break;
            case 'Restart':
                this.scene.stop();
                this.scene.stop('GameScene');
                this.scene.start('GameScene');
                break;
            case 'Main Menu':
                this.scene.stop();
                this.scene.stop('GameScene');
                this.scene.start('MenuScene');
                break;
        }
    }

    resumeGame() {
        this.scene.resume('GameScene');
        this.scene.stop();
    }
}

// Make available globally
window.PauseScene = PauseScene;
