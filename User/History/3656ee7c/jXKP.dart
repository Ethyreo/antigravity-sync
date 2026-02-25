import 'dart:math';
import '../models/creator_models.dart';
import 'supabase_service.dart';

/// Manages brand tag preferences and the smart matching query.
class MatchingService {
  // ── Singleton for shared state across screens ──
  static final MatchingService _instance = MatchingService._();
  factory MatchingService() => _instance;
  MatchingService._();

  final BrandPreferences _prefs = BrandPreferences();
  final Random _rng = Random();
  final SupabaseService _supabaseService = SupabaseService();

  BrandPreferences get preferences => _prefs;

  // ── Star / Thumbs-Down  (Brand Intelligence) ──

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

  // ── Smart Matching Query  (The Bridge Logic) ──

  /// Returns up to [limit] creators filtered & sorted by preferences.
  /// now accepts a pool of creators (which we'll fetch from SupabaseService)
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

  // ── Match Management (Delegates to SupabaseService) ──

  /// Brand swipes right → create a pending match
  Future<void> createMatch(String brandId, String creatorId) async {
    await _supabaseService.createMatch(brandId, creatorId);
  }

  /// Creator accepts
  Future<void> acceptMatch(String matchId) async {
    await _supabaseService.updateMatchStatus(matchId, MatchStatus.accepted);
  }

  /// Creator declines
  Future<void> declineMatch(String matchId) async {
    await _supabaseService.updateMatchStatus(matchId, MatchStatus.declined);
  }

  /// Pending matches for a creator (their "inbox")
  Future<List<Match>> pendingMatchesForCreator(String creatorId) async {
    final allMatches = await _supabaseService.getMatchesForCreator(creatorId);
    return allMatches.where((m) => m.status == MatchStatus.pending).toList();
  }

  /// All matches for a brand, grouped by status
  Future<List<Match>> matchesForBrand(String brandId) async {
    return await _supabaseService.getMatchesForBrand(brandId);
  }

  /// Reset everything (useful for testing)
  void reset() {
    _prefs.tagWeights.clear();
    _prefs.excludedTags.clear();
    // note: we cannot easily reset Supabase data, only local prefs
  }
}
