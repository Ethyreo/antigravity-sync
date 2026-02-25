import 'package:flutter/material.dart';
import '../services/analytics_service.dart';
import '../widgets/analytics_chart.dart';
import '../widgets/settings_sheet.dart';

class CreatorAnalyticsScreen extends StatelessWidget {
  const CreatorAnalyticsScreen({super.key});

  // Mock creator ID (would come from auth in production)
  static const String _creatorId = 'c1';

  @override
  Widget build(BuildContext context) {
    final analytics = AnalyticsService();
    final stats = analytics.getStats(_creatorId);
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Analytics',
            style: TextStyle(fontWeight: FontWeight.bold)),
        actions: [
          IconButton(
            icon: const Icon(Icons.settings),
            onPressed: () => showSettings(context),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // ── Hotness Score ──
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    Colors.orange.shade700,
                    Colors.red.shade600,
                  ],
                ),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Row(
                children: [
                  // Score
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            const Icon(Icons.local_fire_department,
                                color: Colors.white, size: 22),
                            const SizedBox(width: 6),
                            Text('Hotness Score',
                                style: TextStyle(
                                    color: Colors.white.withOpacity(0.9),
                                    fontSize: 14,
                                    fontWeight: FontWeight.w500)),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Text(
                          '${stats.hotnessScore.toStringAsFixed(1)}%',
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 40,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          '${stats.rightSwipes} right swipes / ${stats.totalViews} views',
                          style: TextStyle(
                              color: Colors.white.withOpacity(0.7),
                              fontSize: 12),
                        ),
                      ],
                    ),
                  ),
                  // Circular indicator
                  SizedBox(
                    width: 70,
                    height: 70,
                    child: Stack(
                      fit: StackFit.expand,
                      children: [
                        CircularProgressIndicator(
                          value: stats.hotnessScore / 100,
                          strokeWidth: 6,
                          backgroundColor: Colors.white.withOpacity(0.2),
                          valueColor: const AlwaysStoppedAnimation(Colors.white),
                        ),
                        Center(
                          child: Text(
                            '🔥',
                            style: TextStyle(fontSize: 24),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),

            // ── Stats Grid ──
            Row(
              children: [
                _StatCard(
                  title: 'Total Views',
                  value: '${stats.totalViews}',
                  icon: Icons.visibility,
                  color: theme.primaryColor,
                ),
                const SizedBox(width: 12),
                _StatCard(
                  title: 'Matches',
                  value: '${stats.totalMatches}',
                  icon: Icons.handshake,
                  color: const Color(0xFF00C7BE),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                _StatCard(
                  title: 'Acceptance',
                  value: '${stats.acceptanceRate.toStringAsFixed(0)}%',
                  icon: Icons.check_circle,
                  color: Colors.green,
                ),
                const SizedBox(width: 12),
                _StatCard(
                  title: 'Right Swipes',
                  value: '${stats.rightSwipes}',
                  icon: Icons.favorite,
                  color: Colors.pink,
                ),
              ],
            ),

            const SizedBox(height: 28),

            // ── 7-Day Profile Views Chart ──
            const Text('Profile Views (Last 7 Days)',
                style: TextStyle(fontSize: 17, fontWeight: FontWeight.bold)),
            const SizedBox(height: 4),
            Text('How many brands viewed your card this week.',
                style: TextStyle(color: Colors.grey.shade500, fontSize: 13)),
            const SizedBox(height: 16),

            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: theme.colorScheme.surface,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.white10),
              ),
              child: AnalyticsChart(weeklyViews: stats.weeklyViews),
            ),

            const SizedBox(height: 24),

            // ── Tip ──
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: theme.primaryColor.withOpacity(0.08),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Row(
                children: [
                  Icon(Icons.lightbulb_outline,
                      color: theme.primaryColor, size: 20),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Text(
                      'Tip: Creators with complete portfolios get 3× more right swipes.',
                      style: TextStyle(
                          color: theme.primaryColor,
                          fontSize: 13,
                          fontWeight: FontWeight.w500),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }
}

class _StatCard extends StatelessWidget {
  final String title;
  final String value;
  final IconData icon;
  final Color color;

  const _StatCard({
    required this.title,
    required this.value,
    required this.icon,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Theme.of(context).colorScheme.surface,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: Colors.white10),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(icon, color: color, size: 22),
            const SizedBox(height: 10),
            Text(value,
                style: const TextStyle(
                    fontSize: 24, fontWeight: FontWeight.bold)),
            const SizedBox(height: 2),
            Text(title,
                style:
                    TextStyle(color: Colors.grey.shade500, fontSize: 12)),
          ],
        ),
      ),
    );
  }
}
