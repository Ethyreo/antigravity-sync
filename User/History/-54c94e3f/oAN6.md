# Cyber-8-bit Design System Plan

## Vision
A high-contrast, neon-drenched retro-futuristic aesthetic inspired by *Tomb of the Mask*.
**Core Tenet**: Pure Black (#000000) backgrounds for infinite contrast + pixel-perfect neon elements.

## 1. Color Palette (The "Neon-Void")
| Name | Hex | Usage |
| :--- | :--- | :--- |
| **Void Black** | `#000000` | Backgrounds (Absolute black for OLED) |
| **Electric Cyan** | `#00FFFF` | Player / Primary Actions / Active Selection |
| **Cyber Yellow** | `#FFF000` | Collectibles / Score / Highlights |
| **Hazard Magenta**| `#FF00FF` | Enemies / Danger / "Game Over" states |
| **Ghost White** | `#F0F0F0` | Primary Text (High visibility) |
| **Dim Grid** | `#1A1A1A` | Passive background grid lines |

## 2. Typography
-   **Primary (Headers/Game)**: `Press Start 2P` (Google Font) - Pixelated, roughly 8px grid.
-   **Secondary (Body/UI)**: `Roboto` or `Inter` (Google Font) - Clean san-serif for readability in settings/small text.

## 3. UI Components & Effects
### A. The "CRT" Shader
A subtle overlay pointer-event-through stack:
-   **Scanlines**: Horizontal lines with 5% opacity.
-   **Vignette**: Slight darkening at corners.
-   **Chromatic Aberration**: Minimal RGB shift at edges (optional, strictly monitored for performance).

### B. Containers & Borders
-   **Style**: 2px solid neon stroke (Cyan or Magenta).
-   **Shape**: Sharp corners (0 radius) or slight pixelated rounding (4px aliased).
-   **Fill**: Pure black or 90% opacity black.

### C. Animations ("Juice")
-   **Transitions**: "Snap" logic (Linear / Stepped). No smooth curves.
-   **Menus**: "Scanline Wipe" - Vertical expand animation on open.
-   **Button Press**:
    -   *Down*: Scale 0.95 (Instant)
    -   *Up*: Scale 1.1 -> 1.0 (Bounce)

## 4. Implementation Steps
1.  **Theme Update**: Replace `AppTheme` with new color palette and fonts.
2.  **Asset Import**: Add `Press Start 2P` font.
3.  **Widgets**:
    -   `CyberContainer`: Reusable box with neon border.
    -   `CyberButton`: Bouncy, pixelated button.
    -   `ScanlineOverlay`: IgnorePointer widget for the CRT effect.
4.  **Reskin**: Update Home Screen and Tic-Tac-Toe to use these new components.
