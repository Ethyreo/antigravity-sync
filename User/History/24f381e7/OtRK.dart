import 'package:flutter/material.dart';
import '../models/creator_models.dart';
import '../services/mock_data.dart';
import '../services/matching_service.dart';
import '../widgets/settings_sheet.dart';
import 'creator_editor.dart';
import 'creator_analytics_screen.dart';
import 'brand_brief_view.dart';

class CreatorDashboard extends StatefulWidget {
  const CreatorDashboard({super.key});

  @override
  State<CreatorDashboard> createState() => _CreatorDashboardState();
}

class _CreatorDashboardState extends State<CreatorDashboard> {
  int _selectedIndex = 0;

  final List<Widget> _screens = const [
    _InboxTab(),
    CreatorEditor(),
    CreatorAnalyticsScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _screens[_selectedIndex],
      bottomNavigationBar: NavigationBar(
        selectedIndex: _selectedIndex,
        onDestinationSelected: (i) => setState(() => _selectedIndex = i),
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.inbox_outlined),
            selectedIcon: Icon(Icons.inbox),
            label: 'Inbox',
          ),
          NavigationDestination(
            icon: Icon(Icons.person_outline),
            selectedIcon: Icon(Icons.person),
            label: 'Profile',
          ),
          NavigationDestination(
            icon: Icon(Icons.bar_chart_outlined),
            selectedIcon: Icon(Icons.bar_chart),
            label: 'Analytics',
          ),
        ],
      ),
    );
  }
}

// ═══════════════════════════════════════════════════════════
//  INBOX TAB — Opportunity Cards from Brands
// ═══════════════════════════════════════════════════════════

class _InboxTab extends StatefulWidget {
  const _InboxTab();

  @override
  State<_InboxTab> createState() => _InboxTabState();
}

class _InboxTabState extends State<_InboxTab> {
  final MatchingService _matchingService = MatchingService();

  // Mock creator ID
  static const String _creatorId = 'c1';

  List<Match> _pendingRequests = [];

  @override
  void initState() {
    super.initState();
    _seedInitialMatches();
    _loadRequests();
  }

  void _seedInitialMatches() {
    // Seed some initial pending matches if none exist
    final existing = _matchingService.pendingMatchesForCreator(_creatorId);
    if (existing.isEmpty) {
      for (final brand in MockDataService.brands) {
        _matchingService.createMatch(brand.id, _creatorId);
      }
    }
  }

  void _loadRequests() {
    setState(() {
      _pendingRequests =
          _matchingService.pendingMatchesForCreator(_creatorId);
    });
  }

  BrandProfile? _findBrand(String brandId) {
    try {
      return MockDataService.brands.firstWhere((b) => b.id == brandId);
    } catch (_) {
      return null;
    }
  }

  void _openBrief(BrandProfile brand, Match match) async {
    final result = await Navigator.push<bool>(
      context,
      MaterialPageRoute(
        builder: (context) =>
            BrandBriefView(brand: brand, match: match),
      ),
    );

    if (result == true) {
      _loadRequests(); // Refresh after accept/decline
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.home),
          onPressed: () {},
        ),
        title: const Text('Incoming Requests',
            style: TextStyle(fontWeight: FontWeight.bold)),
        actions: [
          IconButton(
            icon: const Icon(Icons.settings),
            onPressed: () => showSettings(context),
          ),
        ],
      ),
      body: _pendingRequests.isEmpty
          ? Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(Icons.inbox, size: 64, color: Colors.grey.shade600),
                  const SizedBox(height: 16),
                  Text('All caught up!',
                      style: TextStyle(
                          color: Colors.grey.shade500,
                          fontSize: 18,
                          fontWeight: FontWeight.w500)),
                  const SizedBox(height: 4),
                  Text('No pending brand requests.',
                      style: TextStyle(
                          color: Colors.grey.shade600, fontSize: 13)),
                ],
              ),
            )
          : ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: _pendingRequests.length,
              itemBuilder: (context, index) {
                final match = _pendingRequests[index];
                final brand = _findBrand(match.brandId);
                if (brand == null) return const SizedBox.shrink();

                return _OpportunityCard(
                  brand: brand,
                  onTap: () => _openBrief(brand, match),
                  onDecline: () {
                    _matchingService.declineMatch(match.id);
                    _loadRequests();
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text('Declined ${brand.name}'),
                        backgroundColor: Colors.grey,
                      ),
                    );
                  },
                );
              },
            ),
    );
  }
}

// ── Opportunity Card ──
class _OpportunityCard extends StatelessWidget {
  final BrandProfile brand;
  final VoidCallback onTap;
  final VoidCallback onDecline;

  const _OpportunityCard({
    required this.brand,
    required this.onTap,
    required this.onDecline,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  // Brand avatar
                  CircleAvatar(
                    radius: 26,
                    backgroundColor: theme.primaryColor.withOpacity(0.15),
                    child: Text(
                      brand.name[0],
                      style: TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 18,
                          color: theme.primaryColor),
                    ),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(brand.name,
                            style: const TextStyle(
                                fontSize: 17,
                                fontWeight: FontWeight.bold)),
                        const SizedBox(height: 2),
                        Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 8, vertical: 2),
                          decoration: BoxDecoration(
                            color: theme.primaryColor.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: Text(brand.industry,
                              style: TextStyle(
                                  color: theme.primaryColor,
                                  fontSize: 11)),
                        ),
                      ],
                    ),
                  ),
                  // Chevron
                  Icon(Icons.chevron_right,
                      color: Colors.grey.shade500),
                ],
              ),

              const SizedBox(height: 12),
              Text(brand.description,
                  style: TextStyle(
                      color: Colors.grey.shade400, height: 1.4)),

              if (brand.whatWeNeed.isNotEmpty) ...[
                const SizedBox(height: 10),
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: Colors.amber.withOpacity(0.08),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Row(
                    children: [
                      Icon(Icons.lightbulb_outline,
                          size: 16, color: Colors.amber.shade600),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          brand.whatWeNeed,
                          style: TextStyle(
                              fontSize: 12,
                              color: Colors.amber.shade300),
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    ],
                  ),
                ),
              ],

              const SizedBox(height: 14),

              // Actions
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      onPressed: onDecline,
                      style: OutlinedButton.styleFrom(
                          foregroundColor: Colors.redAccent),
                      child: const Text('Decline'),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: onTap,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: theme.primaryColor,
                        foregroundColor: Colors.white,
                      ),
                      child: const Text('View Brief'),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
