# 2.5D Fantasy/Sci-Fi Platformer Game

A browser-based 2.5D platformer inspired by "It Takes Two" featuring evolving abilities, beautiful visuals, and engaging gameplay.

## User Review Required

> [!IMPORTANT]
> **Game Name**: We need a name for your game! Some suggestions:
> - *Rift Runners* (dimension-hopping duo)
> - *Echoes & Embers* (magic meets technology)
> - *Dual Realms*
> - Or suggest your own!

> [!IMPORTANT]
> **Single Player vs Co-op**: "It Takes Two" is co-op only. For a browser game:
> - **Option A**: Single player with AI companion (easier to build)
> - **Option B**: Local co-op (split keyboard controls)
> - **Option C**: Online co-op (complex, needs backend)

---

## Game Concept

### Story Premise
Two heroes from parallel dimensions—one from a **fantasy realm** (magic, ancient forests, mystical creatures) and one from a **sci-fi world** (technology, neon cities, robots)—are pulled together when their worlds begin to collide. They must work together, combining magic and technology, to save both realities.

### Core Mechanics (Inspired by "It Takes Two")
| Feature | Description |
|---------|-------------|
| **Evolving Abilities** | Each level introduces new powers that change gameplay |
| **Platforming** | Jump, double-jump, dash, wall-slide |
| **Puzzle Elements** | Use abilities to unlock paths and solve environmental puzzles |
| **Visual Storytelling** | Environments tell the story of the merging worlds |

### Visual Style
- **Modern illustrated** look with vibrant colors
- **Fantasy elements**: Glowing runes, floating islands, magical particles
- **Sci-fi elements**: Holographic platforms, energy beams, circuit patterns
- **Parallax backgrounds** for depth (2.5D effect)

---

## Technology Stack

| Component | Choice | Reason |
|-----------|--------|--------|
| **Game Engine** | Phaser 3 | Beginner-friendly, great docs, browser-native |
| **Language** | JavaScript/ES6 | Runs everywhere, easy to deploy |
| **Rendering** | WebGL (via Phaser) | Hardware-accelerated graphics |
| **Physics** | Arcade Physics | Built into Phaser, perfect for platformers |
| **Hosting** | GitHub Pages | Free, easy to set up subdomain |

---

## Proposed Changes

### Project Structure

#### [NEW] [fantasy-scifi-platformer/](file:///Users/gurman/Coding%20Projects/fantasy-scifi-platformer/)

```
fantasy-scifi-platformer/
├── index.html          # Entry point
├── css/
│   └── style.css       # Game container styling
├── js/
│   ├── main.js         # Phaser config & game initialization
│   ├── scenes/
│   │   ├── BootScene.js      # Asset loading
│   │   ├── MenuScene.js      # Title screen & menus
│   │   ├── GameScene.js      # Main gameplay
│   │   └── PauseScene.js     # Pause overlay
│   ├── entities/
│   │   ├── Player.js         # Player character class
│   │   └── Platform.js       # Platform types
│   └── utils/
│       └── Controls.js       # Input handling
├── assets/
│   ├── sprites/        # Character & object sprites
│   ├── backgrounds/    # Parallax layers
│   ├── audio/          # Music & sound effects
│   └── tilemaps/       # Level data
└── README.md           # Project documentation
```

---

## Development Phases

### Phase 1: Foundation (MVP)
- [x] Project setup
- [ ] Phaser 3 integration
- [ ] Basic player movement (run, jump, double-jump)
- [ ] Simple test level with platforms
- [ ] Camera following player

### Phase 2: Core Gameplay
- [ ] Dash ability
- [ ] Wall-slide/wall-jump
- [ ] Collectibles (orbs/crystals)
- [ ] Basic enemies or obstacles
- [ ] Death/respawn system

### Phase 3: Polish & Content
- [ ] Parallax backgrounds
- [ ] Particle effects (magic/tech)
- [ ] Sound effects & music
- [ ] Multiple levels
- [ ] Menu system

### Phase 4: Advanced Features
- [ ] Evolving abilities per level
- [ ] Co-op mode (if chosen)
- [ ] Minigames
- [ ] Boss encounters

---

## Verification Plan

### Automated Tests
- Run local dev server and test in Chrome/Firefox/Safari
- Verify 60 FPS performance
- Test keyboard controls responsiveness

### Manual Verification
- Playtest each level for fun factor
- Check visual quality on different screen sizes
- Validate game runs on your website subdomain

---

## Free Assets to Use

| Type | Source | Examples |
|------|--------|----------|
| **Characters** | [itch.io](https://itch.io/game-assets/free/tag-platformer) | Pixel/illustrated heroes |
| **Tilesets** | [OpenGameArt](https://opengameart.org) | Fantasy & sci-fi platforms |
| **Backgrounds** | [CraftPix](https://craftpix.net/freebies/) | Parallax layers |
| **Audio** | [Freesound](https://freesound.org) | SFX & ambient |
| **Music** | [OpenGameArt](https://opengameart.org/art-search-advanced?field_art_type_tid%5B%5D=12) | Royalty-free tracks |
