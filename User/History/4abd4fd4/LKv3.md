# Retro Hedgehog Integration

## Planning
- [x] Research GitHub repo (Unity C# — cannot embed, must build Flutter-native)
- [x] Study existing game architecture (registry, routes, scaffold, snake pattern)
- [x] Write implementation plan
- [ ] User review & approval

## Phase 1: Core Game Engine
- [ ] Create `logic.dart` — state management, physics, level data, enemies, collectibles
- [ ] Create `renderer.dart` — CustomPainter for all game visuals
- [ ] Create `game.dart` — main widget, game loop, input handling

## Phase 2: Touch Controls & Orientation
- [ ] Translucent HUD (D-pad + jump button)
- [ ] Portrait→landscape rotation animation on game open
- [ ] Reverse animation on game exit

## Phase 3: App Integration
- [ ] Add to `game_registry.dart`
- [ ] Add route in `routes.dart`
- [ ] Verify game card appears in home screen

## Phase 4: Verification
- [ ] `flutter analyze` clean
- [ ] Full play-through test in browser
- [ ] End-to-end flow: home → game → play → back
