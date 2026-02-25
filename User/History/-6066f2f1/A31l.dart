import '../models/creator_models.dart';

/// Mock analytics service — generates fake stats for demo purposes.
/// In production this would read from a Creator_Stats table populated by a cron job.
class AnalyticsService {
  static final AnalyticsService _instance = AnalyticsService._();
  factory AnalyticsService() => _instance;
  AnalyticsService._();

  // In-memory view counters
  final Map<String, int> _viewCounts = {};
  final Map<String, int> _swipeCounts = {};

  void recordProfileView(String creatorId) {
    _viewCounts[creatorId] = (_viewCounts[creatorId] ?? 0) + 1;
  }

  void recordRightSwipe(String creatorId) {
    _swipeCounts[creatorId] = (_swipeCounts[creatorId] ?? 0) + 1;
  }

  CreatorStats getStats(String creatorId) {
    final views = _viewCounts[creatorId] ?? 0;
    final swipes = _swipeCounts[creatorId] ?? 0;

    // Generate mock 7-day data (Mon→Sun) — would come from cron in production
    final weeklyViews = _generateMockWeekly(creatorId);

    return CreatorStats(
      creatorId: creatorId,
      weeklyViews: weeklyViews,
      totalViews: views + weeklyViews.fold(0, (a, b) => a + b),
      rightSwipes: swipes + (weeklyViews.fold(0, (a, b) => a + b) * 0.3).round(),
      totalMatches: 8, // mock
      acceptedMatches: 5, // mock
    );
  }

  List<int> _generateMockWeekly(String creatorId) {
    // Seed based on creatorId for consistent demo data
    final seed = creatorId.hashCode;
    final base = (seed.abs() % 40) + 10;
    return List.generate(7, (i) {
      return base + ((seed + i * 17) % 25);
    });
  }
}
