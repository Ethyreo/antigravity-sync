# Retro Hedgehog Integration

## Planning
- [x] Research GitHub repo (Unity C# — cannot embed, must build Flutter-native)
- [x] Study existing game architecture (registry, routes, scaffold, snake pattern)
- [x] Write implementation plan
- [x] User review & approval

## Phase 1: Core Game Engine
- [x] Create `logic.dart` — state management, physics, level data, enemies, collectibles
- [x] Create `renderer.dart` — CustomPainter for all game visuals
- [x] Create `game.dart` — main widget, game loop, input handling

## Phase 2: Touch Controls & Orientation
- [x] Translucent HUD (D-pad + jump button)
- [x] Portrait→landscape rotation animation on game open
- [x] Reverse animation on game exit

## Phase 3: App Integration
- [x] Add to `game_registry.dart`
- [x] Add route in `routes.dart`
- [x] Fix Loading Screen (bootstrap kickoff)
- [x] Disable Haptics (for web stability)

## Phase 4: Verification
- [x] `flutter analyze` clean
- [x] Full play-through test in browser
- [x] End-to-end flow: home → game → play → back
