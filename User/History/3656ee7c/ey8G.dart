import 'dart:math';
import '../models/creator_models.dart';

/// Manages brand tag preferences and the smart matching query.
class MatchingService {
  // ── Singleton for shared state across screens ──
  static final MatchingService _instance = MatchingService._();
  factory MatchingService() => _instance;
  MatchingService._();

  final BrandPreferences _prefs = BrandPreferences();
  final List<Match> _matches = [];
  final Random _rng = Random();
  int _matchIdCounter = 100;

  BrandPreferences get preferences => _prefs;
  List<Match> get allMatches => List.unmodifiable(_matches);

  // ────────────────────────────────────────────────
  //  Star / Thumbs-Down  (Brand Intelligence)
  // ────────────────────────────────────────────────

  /// Star: boost every tag on this creator by ×1.40
  void handleStar(List<String> creatorTags) {
    for (final tag in creatorTags) {
      final current = _prefs.tagWeights[tag] ?? 1.0;
      _prefs.tagWeights[tag] = current * 1.40;
    }
  }

  /// Thumbs-down: exclude a specific tag from future results
  void handleThumbsDown(String tag) {
    if (!_prefs.excludedTags.contains(tag)) {
      _prefs.excludedTags.add(tag);
    }
  }

  // ────────────────────────────────────────────────
  //  Smart Matching Query  (The Bridge Logic)
  // ────────────────────────────────────────────────

  /// Returns up to [limit] creators filtered & sorted by preferences.
  ///
  /// SQL equivalent:
  /// ```sql
  /// SELECT * FROM Creators
  /// WHERE budget >= brand_min
  ///   AND tag NOT IN (excluded)
  /// ORDER BY (preference_weight * random()) DESC
  /// LIMIT 20;
  /// ```
  List<CreatorProfile> queryCreators(
    List<CreatorProfile> pool, {
    int limit = 20,
  }) {
    // 1. Filter out excluded tags
    var filtered = pool.where((c) {
      // Creator must NOT have any excluded tag
      for (final tag in c.tags) {
        if (_prefs.excludedTags.contains(tag)) return false;
      }
      return true;
    }).toList();

    // 2. Filter by budget
    if (_prefs.minBudget > 0 || _prefs.maxBudget < 10000) {
      filtered = filtered.where((c) {
        return c.maxRate >= _prefs.minBudget && c.minRate <= _prefs.maxBudget;
      }).toList();
    }

    // 3. Sort by (preference_weight × random())
    filtered.sort((a, b) {
      double scoreA = a.tags.fold<double>(
          0, (sum, tag) => sum + (_prefs.tagWeights[tag] ?? 1.0));
      double scoreB = b.tags.fold<double>(
          0, (sum, tag) => sum + (_prefs.tagWeights[tag] ?? 1.0));

      // Multiply by random [0.5 .. 1.5] for freshness
      scoreA *= (0.5 + _rng.nextDouble());
      scoreB *= (0.5 + _rng.nextDouble());

      return scoreB.compareTo(scoreA);
    });

    return filtered.take(limit).toList();
  }

  // ────────────────────────────────────────────────
  //  Match Management
  // ────────────────────────────────────────────────

  /// Brand swipes right → create a pending match
  Match createMatch(String brandId, String creatorId) {
    // Avoid duplicates
    final existing = _matches.where(
      (m) => m.brandId == brandId && m.creatorId == creatorId,
    );
    if (existing.isNotEmpty) return existing.first;

    final match = Match(
      id: 'm${_matchIdCounter++}',
      brandId: brandId,
      creatorId: creatorId,
    );
    _matches.add(match);
    return match;
  }

  /// Creator accepts
  void acceptMatch(String matchId) {
    final m = _matches.firstWhere((m) => m.id == matchId);
    m.status = MatchStatus.accepted;
  }

  /// Creator declines
  void declineMatch(String matchId) {
    final m = _matches.firstWhere((m) => m.id == matchId);
    m.status = MatchStatus.declined;
  }

  /// Pending matches for a creator (their "inbox")
  List<Match> pendingMatchesForCreator(String creatorId) {
    return _matches
        .where(
            (m) => m.creatorId == creatorId && m.status == MatchStatus.pending)
        .toList();
  }

  /// All matches for a brand, grouped by status
  List<Match> matchesForBrand(String brandId) {
    return _matches.where((m) => m.brandId == brandId).toList();
  }

  /// Reset everything (useful for testing)
  void reset() {
    _prefs.tagWeights.clear();
    _prefs.excludedTags.clear();
    _matches.clear();
    _matchIdCounter = 100;
  }
}
