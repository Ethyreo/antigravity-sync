# 🦔 Super Sonic in the Multiverse of Madness

> An H5 (HTML5) retro platformer game featuring Sonic traversing through multiple universes, gaining power-ups, and clashing with familiar faces!

---

## 🎮 Game Concept

**Title**: Super Sonic in the Multiverse of Madness  
**Genre**: Platformer / Action  
**Theme**: Multiverse adventure with dimension-hopping mechanics

### Story Premise
Sonic discovers portals to alternate universes and must collect chaos emeralds scattered across dimensions. Along the way, he gains the ability to go **Super Sonic** and ultimately faces off against a familiar plumber from another universe!

---

## 🎨 Visual Style

| Aspect | Specification |
|--------|---------------|
| **Era** | 16-bit (SNES/Sega Genesis aesthetic) |
| **Resolution** | 320x224 scaled up (classic Genesis resolution) |
| **Color Palette** | Vibrant, era-appropriate limited palette |
| **Animation** | Smooth sprite-based animations |
| **Parallax** | Multi-layer scrolling backgrounds |

---

## 🕹️ Controls & Platform

### Desktop (Keyboard)
| Action | Key |
|--------|-----|
| Move Left/Right | ← → or A/D |
| Jump | Space or W |
| Spin Dash | Hold ↓ + Space |
| Activate Power-up | E or Shift |
| Pause | Escape or P |

### Mobile (Touch)
- **Virtual D-Pad** (left side) for movement
- **Action Buttons** (right side) for Jump, Spin Dash, Power-up
- **Responsive layout** adapting to screen size

---

## ⚙️ Core Features

### 1. Scoring System & High Scores
- [x] Points for collecting rings
- [x] Points for defeating enemies
- [x] Time bonus at level end
- [x] Local high score leaderboard (localStorage)
- [ ] Optional: Online leaderboard

### 2. Multiple Levels (5 Universes)

| # | Universe | Theme | Description |
|---|----------|-------|-------------|
| 1 | **Green Hill Prime** | Classic grasslands | Tutorial level, Sonic's home dimension |
| 2 | **Neon City 2099** | Cyberpunk metropolis | Fast-paced urban environment |
| 3 | **Lava Depths** | Volcanic underworld | Platforming over molten lava |
| 4 | **Frozen Tundra** | Ice & snow dimension | Slippery surfaces, snowstorms |
| 5 | **Mushroom Kingdom Rift** | Familiar plumber's world | Final boss arena! |

Each level includes:
- Unique tileset & background
- Dimension-specific enemies
- Hidden chaos emerald
- End-of-level checkpoint

### 3. Sound Effects & Music
- **SFX**: Jump, ring collect, spin dash, damage, power-up, portal enter
- **Music**: Unique 16-bit chiptune track per universe
- **Boss Music**: Epic confrontation theme for final battle
- Volume controls for SFX and Music separately

### 4. Power-Ups

| Power-Up | Effect | Duration |
|----------|--------|----------|
| 🛡️ **Shield** | Absorbs one hit | Until damaged |
| ⚡ **Speed Boost** | 2x movement speed | 10 seconds |
| 💫 **Invincibility** | Cannot be damaged | 8 seconds |
| 🌀 **Multiverse Dash** | Phase through obstacles | 5 seconds |
| ✨ **Super Sonic** | All abilities + flight | Until rings depleted |

### 5. Multiverse Traversal Mechanic
- **Portal Rings**: Special checkpoints that transport Sonic between dimensions
- **Dimension Shifting**: Visual effects (screen warp, color shift) during transitions
- **Cross-dimension secrets**: Some areas only accessible by returning from another universe

### 6. Super Sonic Transformation
- **Activation**: Collect all 7 Chaos Emeralds + 50 Rings
- **Abilities**: 
  - Invincibility
  - Flight/hovering
  - Faster movement
  - Golden sprite transformation
- **Cost**: Drains 1 ring per second

### 7. Boss Battle: The Plumber Clash 🍄
- **Final Boss**: A red-capped rival from the Mushroom dimension
- **Phases**:
  1. Ground combat with fireball attacks
  2. Platform jumping battle
  3. Super Sonic vs Power Star showdown
- **Victory Condition**: 8 hits to defeat

---

## 📐 Technical Specifications

| Aspect | Technology |
|--------|------------|
| **Engine** | Vanilla JavaScript + Canvas API |
| **Resolution** | 320x224 native, scaled to viewport |
| **Frame Rate** | 60 FPS target |
| **Audio** | Web Audio API |
| **Storage** | localStorage for saves/high scores |
| **Build** | Single HTML file or modular JS |

---

## 📦 Scope Summary

| Category | Count/Detail |
|----------|--------------|
| **Levels** | 5 unique universes |
| **Enemies** | 3-4 types per level |
| **Power-ups** | 5 types |
| **Boss Fights** | 1 major (final), optional mini-bosses |
| **Estimated Dev Time** | Medium complexity |

---

## 🎯 MVP Priorities

### Phase 1 - Core Gameplay
1. ✅ Sonic movement & physics (run, jump, spin dash)
2. ✅ Basic level structure with platforms
3. ✅ Ring collection & scoring
4. ✅ Enemy collision & damage

### Phase 2 - Levels & Progression
1. ✅ 5 themed universes
2. ✅ Portal/dimension transition mechanic
3. ✅ Checkpoint system
4. ✅ Level completion & scoring

### Phase 3 - Power-ups & Super Sonic
1. ✅ Power-up pickups
2. ✅ Super Sonic transformation
3. ✅ Chaos Emerald collection

### Phase 4 - Boss & Polish
1. ✅ Final boss battle
2. ✅ Sound effects & music
3. ✅ High score system
4. ✅ Mobile touch controls

---

## ✅ Finalized Decisions

| Question | Decision |
|----------|----------|
| **Art Assets** | 🎨 Generate pixel art sprites using AI image generation |
| **Music/Sound** | 🎵 Integrate royalty-free retro/chiptune tracks |
| **Difficulty** | ⚔️ Normal difficulty (single mode for now) |
| **Save System** | 💾 Full level progress saving (localStorage) |

---

## 🚀 Requirements Complete!

This document is finalized and ready for implementation planning.
