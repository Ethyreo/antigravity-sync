import 'package:flutter/material.dart';
import '../models/creator_models.dart';
import '../services/matching_service.dart';
import '../services/mock_data.dart';
import '../widgets/settings_sheet.dart';

class BrandMatchesScreen extends StatefulWidget {
  const BrandMatchesScreen({super.key});

  @override
  State<BrandMatchesScreen> createState() => _BrandMatchesScreenState();
}

class _BrandMatchesScreenState extends State<BrandMatchesScreen>
    with SingleTickerProviderStateMixin {
  final MatchingService _matchingService = MatchingService();
  late TabController _tabController;

  static const String _brandId = 'b1';

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  CreatorProfile? _findCreator(String creatorId) {
    try {
      return MockDataService.creators.firstWhere((c) => c.id == creatorId);
    } catch (_) {
      return null;
    }
  }

  @override
  Widget build(BuildContext context) {
    final matches = _matchingService.matchesForBrand(_brandId);
    final pending =
        matches.where((m) => m.status == MatchStatus.pending).toList();
    final accepted =
        matches.where((m) => m.status == MatchStatus.accepted).toList();

    return Scaffold(
      appBar: AppBar(
        title: const Text('My Matches',
            style: TextStyle(fontWeight: FontWeight.bold)),
        actions: [
          IconButton(
            icon: const Icon(Icons.settings),
            onPressed: () => showSettings(context),
          ),
        ],
        bottom: TabBar(
          controller: _tabController,
          tabs: [
            Tab(text: 'Pending (${pending.length})'),
            Tab(text: 'Accepted (${accepted.length})'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          // ── Pending Tab ──
          pending.isEmpty
              ? _emptyState('No pending matches', Icons.hourglass_empty)
              : ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: pending.length,
                  itemBuilder: (context, index) {
                    final match = pending[index];
                    final creator = _findCreator(match.creatorId);
                    if (creator == null) return const SizedBox.shrink();
                    return _MatchCard(
                      creator: creator,
                      status: MatchStatus.pending,
                    );
                  },
                ),

          // ── Accepted Tab ──
          accepted.isEmpty
              ? _emptyState('No accepted matches yet', Icons.check_circle_outline)
              : ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: accepted.length,
                  itemBuilder: (context, index) {
                    final match = accepted[index];
                    final creator = _findCreator(match.creatorId);
                    if (creator == null) return const SizedBox.shrink();
                    return _MatchCard(
                      creator: creator,
                      status: MatchStatus.accepted,
                    );
                  },
                ),
        ],
      ),
    );
  }

  Widget _emptyState(String text, IconData icon) {
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 56, color: Colors.grey.shade600),
          const SizedBox(height: 12),
          Text(text, style: TextStyle(color: Colors.grey.shade500)),
        ],
      ),
    );
  }
}

// ═══════════════════════════════════════════════════════════
//  Match Card — shows creator info & contact actions
// ═══════════════════════════════════════════════════════════

class _MatchCard extends StatelessWidget {
  final CreatorProfile creator;
  final MatchStatus status;

  const _MatchCard({required this.creator, required this.status});

  @override
  Widget build(BuildContext context) {
    final isAccepted = status == MatchStatus.accepted;
    final theme = Theme.of(context);

    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                // Avatar
                CircleAvatar(
                  radius: 28,
                  backgroundImage: NetworkImage(creator.imageUrl),
                ),
                const SizedBox(width: 14),
                // Name + Tags
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(creator.name,
                          style: const TextStyle(
                              fontSize: 17, fontWeight: FontWeight.bold)),
                      const SizedBox(height: 4),
                      Wrap(
                        spacing: 4,
                        children: creator.tags
                            .take(3)
                            .map((t) => Text('#$t',
                                style: TextStyle(
                                    color: theme.primaryColor, fontSize: 12)))
                            .toList(),
                      ),
                    ],
                  ),
                ),
                // Status badge
                Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: isAccepted
                        ? Colors.green.withOpacity(0.15)
                        : Colors.orange.withOpacity(0.15),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(
                    isAccepted ? 'Accepted' : 'Pending',
                    style: TextStyle(
                      color: isAccepted ? Colors.green : Colors.orange,
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ],
            ),

            // Rate Card
            Padding(
              padding: const EdgeInsets.only(top: 12),
              child: Text(
                '\$${creator.minRate.toStringAsFixed(0)} – \$${creator.maxRate.toStringAsFixed(0)}',
                style:
                    TextStyle(color: Colors.grey.shade500, fontSize: 13),
              ),
            ),

            // Contact buttons (only for accepted)
            if (isAccepted) ...[
              const SizedBox(height: 16),
              Row(
                children: [
                  Expanded(
                    child: ElevatedButton.icon(
                      onPressed: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                              content:
                                  Text('Opening WhatsApp… (mock action)')),
                        );
                      },
                      icon: const Icon(Icons.chat, size: 18),
                      label: const Text('WhatsApp'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF25D366),
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(10)),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: OutlinedButton.icon(
                      onPressed: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                              content: Text('Opening email… (mock action)')),
                        );
                      },
                      icon: const Icon(Icons.email, size: 18),
                      label: const Text('Email'),
                      style: OutlinedButton.styleFrom(
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(10)),
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ],
        ),
      ),
    );
  }
}
