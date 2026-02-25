# Bored Games - Implementation Plan

## Goal Description
Create a scalable, offline-first Flutter application "Bored Games" that serves as a collection of mini-games. The app will feature a unified launcher/home screen, local progress storage, and a modular architecture to easily add new games. It will also include placeholders for future AdTech integration.

## Proposed Architecture
We will use a **Feature-First Modular Architecture**. Each game will be a self-contained feature module, while core services (Navigation, Storage, Ads, Theme) are shared.

### Folder Structure
```
lib/
├── main.dart                  # Application entry point
├── app/                       # App-wide configuration
│   ├── app.dart               # MaterialApp widget
│   ├── routes.dart            # Centralized navigation (GoRouter)
│   └── theme.dart             # App theme (Colors, Typography)
├── core/                      # Shared resources & utilities
│   ├── constants/             # App constants (Strings, Assets paths)
│   ├── services/              # Core Services
│   │   ├── storage_service.dart # Interface for Local Storage (SharedPreferences)
│   │   └── ad_service.dart     # Interface for AdTech (Placeholder)
│   └── widgets/               # Shared UI components (Buttons, Cards, Dialogs)
└── features/
    ├── home/                  # Main Dashboard
    │   ├── presentation/
    │   │   ├── screens/       # Home Screen
    │   │   └── widgets/       # GameGrid, GameCard
    │   └── domain/            # GameRegistry (List of available games)
    └── games/                 # The Collection of Games
        ├── game_template/     # Documentation/Template for new games
        └── tic_tac_toe/       # Example Game Module
            ├── game.dart      # Game Entry Point (Widget)
            ├── logic.dart     # Game Logic
            └── assets.dart    # Game-specific assets
```

### Key Components

1.  **Game Registry**: A central configuration file in `features/home/domain` that lists all available games. Each entry includes:
    -   `title`: String
    -   `icon`: IconData/AssetPath
    -   `route`: String
    -   `difficulty`: Enum (Easy, Medium, Hard)
    -   `isLongForm`: bool (to distinguish quick play vs long form)

2.  **AdTech Layer**: A `AdService` class in `core/services` that exposes methods like `showBanner()`, `showInterstitial()`. Initially, these will be empty or log to console.

3.  **Local Storage**: A `StorageService` using `shared_preferences` to save:
    -   Global app settings (Theme)
    -   Game high scores (Key: `game_id_highscore`)
    -   Long-form game saves (JSON strings)

4.  **UI/UX**:
    -   **Splash Screen**: Animated logo.
    -   **Home**: "Fun looking" grid/list with distinct visual style.
    -   **Game Mode**: Full-screen immersive mode.

## Implementation Steps

### Phase 1: Foundation
1.  **Dependencies**: Add `flutter_riverpod` (state management), `go_router` (navigation), `shared_preferences` (storage), `google_fonts` (typography).
2.  **Project Structure**: Create the folder hierarchy.
3.  **Core Services**: Implement basic `StorageService` and dummy `AdService`.

### Phase 2: Home & Navigation
1.  **Routing**: Set up `GoRouter` with Home and Game routes.
2.  **Home Screen**: Build the UI to display the list of games.
3.  **Game Registry**: Create the data model for a "Game".

### Phase 3: First Game (Tic-Tac-Toe)
1.  Create `lib/features/games/tic_tac_toe`.
2.  Implement game logic and UI.
3.  Connect to Home Screen via Registry.

### Phase 4: Polish (Completed)
1.  **Launch Animation**: "Neon Line" transition.
2.  **Particle System**: Square 8-bit explosions.
3.  **Haptics**: Tactile feedback for game events.

### Phase 5: Second Game (Neon Snake)
1.  **Architecture**: Reuse `GameScaffold` and `CyberParticles`.
2.  **Game Logic**: Grid-based movement, snake growth, collision detection.
3.  **Cyber Twist**:
    -   Snake body is a glowing neon trail.
    -   Food is a pulsing "glitch" pixel.
    -   Speed increases as you eat.

## Verification Plan

### Automated Tests
-   **Unit Tests**: Test `GameRegistry` logic and `StorageService` mocking.
-   **Widget Tests**: Verify Home Screen renders the list of games correctly.

### Manual Verification
1.  **Launch App**: Verify Splash screen and transition to Home.
2.  **Navigation**: Click a game card -> opens game -> back button returns to Home.
3.  **Offline**: Turn off WiFi/Data -> Verify app runs and games play.
4.  **Storage**: Play a game, save score/progress -> Restart app -> Verify progress persists.
5.  **Responsiveness**: Test on iOS Simulator (iPhone) and Android Emulator (Pixel).
