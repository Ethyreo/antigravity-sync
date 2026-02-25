# Game Design Blueprint: Rift Runners

> [!IMPORTANT]
> **Blueprint Status**: Draft for User Review
> **Goal**: Define the exact look, feel, and logic of the game *before* writing complex code.
> **Action Item**: Please review the "Asset Requirement List" section to know what to download.

## 1. The "2.5D" Approach
Since we are using **Phaser 3** (a 2D engine) for a browser game, we will achieve a **2.5D aesthetic** using these techniques (similar to *Hollow Knight* or *Ori and the Blind Forest*):
-   **Parallax Scrolling**: Background layers move at different speeds to create deep 3D-like depth.
-   **Lighting & Shadows**: Dynamic lighting effects to make 2D sprites pop.
-   **Perspective Tricks**: Using angled platform assets to show "depth" (top and side visible).

## 2. Gameplay Mechanics (Inspired by "It Takes Two")
The game focuses on **flow** and **dual-world interactions**.

### Core Actions
1.  **Movement**: Smooth acceleration/deceleration.
2.  **Jump & Double Jump**: Essential for platforming.
3.  **Dash**: A burst of speed (visualized as a "phase shift" glitch effect).
4.  **Dimension Swap (Unique Mechanic)**: 
    -   Pressing a key toggles the world between **Fantasy** and **Sci-Fi**.
    -   *Fantasy World*: Platforms are tree branches/magic stones.
    -   *Sci-Fi World*: Platforms are neon hard-light bridges/metal.
    -   *Puzzle*: Some platforms only exist in one dimension!

## 3. Visual Style & "It Takes Two" Vibe
-   **Fantasy Layer**: Warm colors (Purple, Gold), organic shapes, magical particles.
-   **Sci-Fi Layer**: Cool colors (Cyan, Neon Blue), geometric shapes, digital glitches.
-   **The Mix**: The player character is a "Rift Walker" who visually fits both (e.g., a mage with a cybernetic arm).

## 4. Asset Requirement List (For You to Download)
Please look for assets that match these descriptions. You can find them on Itch.io, CraftPix, or Kenny Assets.

### A. Character Sprites (The Player)
We need a **Sprite Sheet** (a single image with multiple frames) or separate images for:
-   **Idle**: Character standing still (breathing/floating).
-   **Run/Walk**: Moving left/right.
-   **Jump**: Going up.
-   **Fall**: Coming down.
-   **Dash**: (Optional) Action pose.
*Format*: PNG with transparent background.

### B. Environment (Tilesets)
We need **two distinct sets** to create the "Dual World" mechanic:
1.  **Fantasy Tileset**: 
    -   Ground blocks (Grass, Stone, Dirt).
    -   Floating platforms (Islands, Magic rocks).
    -   Decorations (Vines, Mushrooms).
2.  **Sci-Fi Tileset**:
    -   Ground blocks (Metal, Circuit boards).
    -   Floating platforms (Holograms, Metal grates).
    -   Decorations (Pipes, Wires, Screens).
*Note*: Ideally, these two sets should have tiles of roughly the same size (e.g., 32x32 or 64x64 pixels) so we can overlap them.

### C. Backgrounds (Parallax Layers)
To get that 2.5D depth, we need separate image layers:
1.  **Close Background**: Trees/Pillars (moves fast).
2.  **Mid Background**: Mountains/Cityscape (moves slow).
3.  **Far Background**: Sky/Stars/Nebula (moves very slow).
*Theme*: One set for Fantasy, one for Sci-Fi (or a mix).

### D. UI & Objects
-   **Collectibles**: Coins, Orbs, or "Rift Shards".
-   **Particles**: Glow textures, Sparkles, Smoke.
-   **Font**: (I have already included Google Fonts, so this is covered).

## 5. Deployment Structure
We will store these in the folder structure I created:
-   `assets/sprites/` -> Player images.
-   `assets/tilemaps/` -> World blocks.
-   `assets/backgrounds/` -> Parallax images.

---

### Comparison: What "2.5D" means here vs "It Takes Two"
-   **It Takes Two**: Full 3D models, requiring a heavy 3D engine (Unity/Unreal). Hard for a simple browser entry.
-   **Our Game**: 2D Artwork with 3D Depth effects. Much lighter, runs on any website, easier to build "Dimension Swap" mechanics.

**Does this Blueprint align with your vision?** Specifically, does the "Dimension Swap" mechanic sound good for the "It Takes Two" fantasy/sci-fi theme?
