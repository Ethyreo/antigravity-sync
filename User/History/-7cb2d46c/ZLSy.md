# Rift Runners

A 2.5D fantasy/sci-fi platformer built with Phaser 3, inspired by "It Takes Two".

![Genre](https://img.shields.io/badge/Genre-Platformer-8b5cf6)
![Engine](https://img.shields.io/badge/Engine-Phaser%203-06b6d4)
![License](https://img.shields.io/badge/License-MIT-green)

## 🎮 About

**Rift Runners** is a browser-based 2.5D platformer where two heroes from parallel dimensions—one from a fantasy realm and one from a sci-fi world—unite to save their merging realities.

### Features

- 🏃 Fluid movement with double-jump and dash abilities
- ✨ Beautiful parallax backgrounds
- 💎 Collectible orbs system
- 🎨 Modern illustrated visual style
- 🎵 Responsive controls (keyboard support)

## 🚀 Quick Start

1. **Clone or download** this repository
2. **Start a local server** (required for ES6 modules):
   ```bash
   # Using Python
   python3 -m http.server 8080

   # Or using Node.js
   npx serve .
   ```
3. **Open in browser**: Navigate to `http://localhost:8080`

## 🎯 Controls

| Action | Keys |
|--------|------|
| Move Left | `←` or `A` |
| Move Right | `→` or `D` |
| Jump | `↑` or `W` or `SPACE` |
| Double Jump | Jump again in mid-air |
| Dash | `SHIFT` |
| Pause | `ESC` |

## 📁 Project Structure

```
fantasy-scifi-platformer/
├── index.html          # Entry point
├── css/
│   └── style.css       # Game styling
├── js/
│   ├── main.js         # Phaser config
│   ├── scenes/
│   │   ├── BootScene.js
│   │   ├── MenuScene.js
│   │   ├── GameScene.js
│   │   └── PauseScene.js
│   ├── entities/
│   │   └── Player.js
│   └── utils/
│       └── Controls.js
├── assets/             # Game assets (sprites, audio, etc.)
└── README.md
```

## 🌐 Deploying to GitHub Pages

1. Push this folder to a GitHub repository
2. Go to **Settings** → **Pages**
3. Select **main** branch and save
4. Your game will be live at `https://yourusername.github.io/repo-name`

For a subdomain (e.g., `game.yoursite.com`):
1. Add a `CNAME` file with your subdomain
2. Configure DNS to point to GitHub Pages

## 🛠️ Tech Stack

- **Phaser 3** - Game engine
- **JavaScript ES6** - Game logic
- **CSS3** - Styling and animations
- **WebGL** - Hardware-accelerated rendering

## 📝 License

MIT License - feel free to use and modify!

---

*Built with 💜 and ⚡*
