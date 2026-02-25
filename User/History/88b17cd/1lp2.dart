import 'dart:math';

// ─── Enums ────────────────────────────────────────────
enum PlayerState { idle, running, jumping, falling, hurt }
enum FacingDir { left, right }
enum EnemyType { walker, flyer }

// ─── Constants ────────────────────────────────────────
class GC {
  static const double gravity = 920.0;
  static const double jumpForce = -400.0;
  static const double maxSpeed = 220.0;
  static const double accel = 800.0;
  static const double friction = 600.0;
  static const double playerW = 22.0;
  static const double playerH = 28.0;
  static const double viewW = 480.0;
  static const double viewH = 270.0;
  static const double ringSize = 14.0;
  static const double enemyW = 26.0;
  static const double enemyH = 26.0;
  static const int startLives = 3;
  static const double hurtTime = 1.2;
  static const double respawnTime = 0.8;
}

// ─── Data Types ───────────────────────────────────────
class R2 {
  double x, y, w, h;
  R2(this.x, this.y, this.w, this.h);
  double get r => x + w;
  double get b => y + h;
  double get cx => x + w / 2;
  double get cy => y + h / 2;
  bool hits(R2 o) => x < o.r && r > o.x && y < o.b && b > o.y;
}

class Platform {
  final R2 rect;
  final bool oneWay;
  Platform(double x, double y, double w, double h, {this.oneWay = false})
      : rect = R2(x, y, w, h);
}

class Enemy {
  R2 rect;
  final EnemyType type;
  final double pMin, pMax, speed;
  FacingDir facing;
  bool alive;
  double baseY, t;
  Enemy({
    required double x, required double y,
    required this.type,
    required this.pMin, required this.pMax,
    this.speed = 60,
  })  : rect = R2(x, y, GC.enemyW, GC.enemyH),
        facing = FacingDir.right,
        alive = true,
        baseY = y,
        t = 0;
}

class NeonRing {
  double x, y;
  bool collected;
  double t;
  NeonRing(this.x, this.y) : collected = false, t = 0;
}

// ─── Game State ───────────────────────────────────────
class HedgehogState {
  double px, py, vx, vy;
  PlayerState pState;
  FacingDir facing;
  double hurtTimer, respawnTimer, animTime;
  bool grounded;
  int score, rings, lives;
  double gameTime;
  bool playing, gameOver, victory;
  List<Platform> platforms;
  List<Enemy> enemies;
  List<NeonRing> neonRings;
  double levelW, goalX, cameraX;
  bool inLeft, inRight, inJump;

  HedgehogState()
      : px = 50, py = 180, vx = 0, vy = 0,
        pState = PlayerState.idle,
        facing = FacingDir.right,
        hurtTimer = 0, respawnTimer = 0, animTime = 0,
        grounded = false,
        score = 0, rings = 0, lives = GC.startLives,
        gameTime = 0,
        playing = false, gameOver = false, victory = false,
        platforms = [], enemies = [], neonRings = [],
        levelW = 3200, goalX = 3050, cameraX = 0,
        inLeft = false, inRight = false, inJump = false;
}

// ─── Level Builder ────────────────────────────────────
HedgehogState _buildLevel() {
  final s = HedgehogState();

  // Ground sections with gaps for platforming
  void ground(double x, double w) =>
      s.platforms.add(Platform(x, 238, w, 32));
  void plat(double x, double y, double w) =>
      s.platforms.add(Platform(x, y, w, 14, oneWay: true));

  // Section 1: Gentle start (0–480)
  ground(0, 500);

  // Section 2: First gap + elevated (500–900)
  ground(560, 220);
  plat(580, 185, 70);
  plat(700, 155, 70);

  // Section 3: Middle ground (900–1200)
  ground(840, 320);
  plat(900, 192, 55);
  plat(1020, 162, 55);

  // Section 4: Multi-height (1200–1650)
  ground(1200, 150);
  plat(1210, 185, 90);
  plat(1360, 198, 80);
  ground(1420, 230);

  // Section 5: Speed run (1700–2100)
  ground(1700, 420);
  plat(1760, 202, 70);
  plat(1910, 178, 70);
  plat(2050, 158, 70);

  // Section 6: Final challenge (2150–2700)
  ground(2150, 200);
  ground(2420, 200);
  plat(2440, 182, 70);
  plat(2560, 198, 70);

  // Section 7: Goal area (2700–3200)
  ground(2700, 500);

  // ── Neon Rings ──
  final ringPos = <List<double>>[
    // Start zone
    [100,212],[140,212],[180,212],[250,192],[290,192],[330,192],
    // Elevated
    [600,158],[640,158],[720,128],[755,128],
    // Middle
    [870,212],[910,212],[940,168],[1040,138],
    // Multi-height
    [1230,160],[1270,160],[1380,174],[1460,212],[1500,212],[1540,212],
    // Speed run
    [1780,178],[1820,178],[1930,154],[1970,154],[2070,134],[2100,134],
    // Final
    [2190,212],[2230,212],[2460,158],[2500,158],[2580,174],[2610,174],
    // Goal area bonus
    [2760,212],[2800,212],[2840,212],[2880,212],[2920,212],
  ];
  for (final p in ringPos) {
    s.neonRings.add(NeonRing(p[0], p[1]));
  }

  // ── Enemies ──
  s.enemies.addAll([
    Enemy(x: 360, y: 212, type: EnemyType.walker,
        pMin: 300, pMax: 460, speed: 55),
    Enemy(x: 880, y: 212, type: EnemyType.walker,
        pMin: 840, pMax: 1100, speed: 65),
    Enemy(x: 1760, y: 212, type: EnemyType.walker,
        pMin: 1700, pMax: 2060, speed: 75),
    Enemy(x: 2760, y: 212, type: EnemyType.walker,
        pMin: 2700, pMax: 3100, speed: 68),
    // Flyers
    Enemy(x: 1260, y: 115, type: EnemyType.flyer,
        pMin: 1200, pMax: 1420, speed: 42),
    Enemy(x: 2380, y: 125, type: EnemyType.flyer,
        pMin: 2300, pMax: 2560, speed: 48),
  ]);

  return s;
}

// ─── Game Engine ──────────────────────────────────────
class HedgehogEngine {
  HedgehogState state;
  HedgehogEngine() : state = _buildLevel();

  void start() {
    state = _buildLevel();
    state.playing = true;
  }

  void _respawn() {
    state.px = 50;
    state.py = 180;
    state.vx = 0;
    state.vy = 0;
    state.pState = PlayerState.idle;
    state.grounded = false;
    state.hurtTimer = 0;
    state.respawnTimer = 0;
    state.cameraX = 0;
  }

  void update(double dt) {
    if (!state.playing || state.gameOver || state.victory) return;
    dt = dt.clamp(0.0, 0.05);
    state.gameTime += dt;
    state.animTime += dt;

    // Respawn countdown
    if (state.respawnTimer > 0) {
      state.respawnTimer -= dt;
      if (state.respawnTimer <= 0) _respawn();
      return;
    }

    _input(dt);
    _physics(dt);
    _collide();
    _enemies(dt);
    _rings(dt);
    _camera(dt);

    if (state.px >= state.goalX) {
      state.victory = true;
      state.playing = false;
      state.score += state.lives * 1000;
    }
    if (state.py > 360) _die();
  }

  // ── Input ──
  void _input(double dt) {
    if (state.pState == PlayerState.hurt) return;

    if (state.inLeft) {
      state.vx -= GC.accel * dt;
      state.facing = FacingDir.left;
    } else if (state.inRight) {
      state.vx += GC.accel * dt;
      state.facing = FacingDir.right;
    } else {
      if (state.vx > 0) {
        state.vx = max(0, state.vx - GC.friction * dt);
      } else if (state.vx < 0) {
        state.vx = min(0, state.vx + GC.friction * dt);
      }
    }
    state.vx = state.vx.clamp(-GC.maxSpeed, GC.maxSpeed);

    if (state.inJump && state.grounded) {
      state.vy = GC.jumpForce;
      state.grounded = false;
      state.pState = PlayerState.jumping;
      state.inJump = false;
    }
  }

  // ── Physics ──
  void _physics(double dt) {
    if (!state.grounded) state.vy += GC.gravity * dt;
    state.px += state.vx * dt;
    state.py += state.vy * dt;
    state.px = state.px.clamp(0, state.levelW - GC.playerW);
  }

  // ── Platform Collision ──
  void _collide() {
    state.grounded = false;
    final pr = R2(state.px, state.py, GC.playerW, GC.playerH);

    for (final p in state.platforms) {
      if (!pr.hits(p.rect)) continue;

      final oL = pr.r - p.rect.x;
      final oR = p.rect.r - pr.x;
      final oT = pr.b - p.rect.y;
      final oB = p.rect.b - pr.y;
      final m = [oL, oR, oT, oB].reduce(min);

      if (m == oT && state.vy >= 0) {
        state.py = p.rect.y - GC.playerH;
        state.vy = 0;
        state.grounded = true;
        if (state.pState == PlayerState.jumping ||
            state.pState == PlayerState.falling) {
          state.pState =
              state.vx.abs() > 10 ? PlayerState.running : PlayerState.idle;
        }
      } else if (!p.oneWay) {
        if (m == oB) {
          state.py = p.rect.b;
          state.vy = 0;
        } else if (m == oL) {
          state.px = p.rect.x - GC.playerW;
          state.vx = 0;
        } else if (m == oR) {
          state.px = p.rect.r;
          state.vx = 0;
        }
      }
    }

    // Update visual state
    if (state.pState != PlayerState.hurt) {
      if (!state.grounded) {
        state.pState =
            state.vy < 0 ? PlayerState.jumping : PlayerState.falling;
      } else if (state.vx.abs() > 10) {
        state.pState = PlayerState.running;
      } else {
        state.pState = PlayerState.idle;
      }
    }

    // Enemy contact
    if (state.hurtTimer <= 0) {
      final pRect = R2(state.px, state.py, GC.playerW, GC.playerH);
      for (final e in state.enemies) {
        if (!e.alive || !pRect.hits(e.rect)) continue;
        final landedOn =
            state.vy > 0 && (state.py + GC.playerH - e.rect.y) < 14;
        if (landedOn) {
          e.alive = false;
          state.score += 100;
          state.vy = GC.jumpForce * 0.6;
        } else {
          _hurt();
        }
      }
    }
  }

  void _hurt() {
    if (state.rings > 0) {
      state.rings = 0;
      state.hurtTimer = GC.hurtTime;
      state.pState = PlayerState.hurt;
      state.vy = GC.jumpForce * 0.5;
    } else {
      _die();
    }
  }

  void _die() {
    state.lives--;
    if (state.lives <= 0) {
      state.gameOver = true;
      state.playing = false;
    } else {
      state.respawnTimer = GC.respawnTime;
      state.pState = PlayerState.hurt;
      state.vy = GC.jumpForce * 0.4;
    }
  }

  // ── Enemy AI ──
  void _enemies(double dt) {
    for (final e in state.enemies) {
      if (!e.alive) continue;
      e.t += dt;
      if (e.type == EnemyType.walker) {
        if (e.facing == FacingDir.right) {
          e.rect.x += e.speed * dt;
          if (e.rect.x >= e.pMax) e.facing = FacingDir.left;
        } else {
          e.rect.x -= e.speed * dt;
          if (e.rect.x <= e.pMin) e.facing = FacingDir.right;
        }
      } else {
        if (e.facing == FacingDir.right) {
          e.rect.x += e.speed * dt;
          if (e.rect.x >= e.pMax) e.facing = FacingDir.left;
        } else {
          e.rect.x -= e.speed * dt;
          if (e.rect.x <= e.pMin) e.facing = FacingDir.right;
        }
        e.rect.y = e.baseY + sin(e.t * 3) * 25;
      }
    }
  }

  // ── Ring Collection ──
  void _rings(double dt) {
    final pr = R2(state.px, state.py, GC.playerW, GC.playerH);
    for (final r in state.neonRings) {
      if (r.collected) continue;
      r.t += dt;
      if (pr.hits(R2(r.x, r.y, GC.ringSize, GC.ringSize))) {
        r.collected = true;
        state.rings++;
        state.score += 10;
        if (state.rings % 100 == 0) state.lives++;
      }
    }
  }

  // ── Camera ──
  void _camera(double dt) {
    double tx = state.px - GC.viewW * 0.35;
    tx = tx.clamp(0.0, state.levelW - GC.viewW);
    state.cameraX += (tx - state.cameraX) * 5 * dt;
  }
}
