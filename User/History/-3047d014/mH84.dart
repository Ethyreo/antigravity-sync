import 'package:flutter/material.dart';
import 'package:flutter_card_swiper/flutter_card_swiper.dart';
import '../models/creator_models.dart';
import '../services/mock_data.dart';
import '../services/matching_service.dart';
import '../services/analytics_service.dart';
import '../widgets/swipe_card.dart';
import '../widgets/settings_sheet.dart';
import 'creator_profile_screen.dart';
import 'brand_matches_screen.dart';
import 'brand_brief_editor.dart';

class BrandDashboard extends StatefulWidget {
  const BrandDashboard({super.key});

  @override
  State<BrandDashboard> createState() => _BrandDashboardState();
}

class _BrandDashboardState extends State<BrandDashboard> {
  int _selectedIndex = 0;

  @override
  Widget build(BuildContext context) {
    final screens = [
      const _DiscoverTab(),
      const BrandMatchesScreen(),
      const BrandBriefEditor(),
    ];

    return Scaffold(
      body: screens[_selectedIndex],
      bottomNavigationBar: NavigationBar(
        selectedIndex: _selectedIndex,
        onDestinationSelected: (i) => setState(() => _selectedIndex = i),
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.explore_outlined),
            selectedIcon: Icon(Icons.explore),
            label: 'Discover',
          ),
          NavigationDestination(
            icon: Icon(Icons.handshake_outlined),
            selectedIcon: Icon(Icons.handshake),
            label: 'Matches',
          ),
          NavigationDestination(
            icon: Icon(Icons.edit_note_outlined),
            selectedIcon: Icon(Icons.edit_note),
            label: 'Brief',
          ),
        ],
      ),
    );
  }
}

// ═══════════════════════════════════════════════════════════
//  DISCOVER TAB — Card swiping with Star / Thumbs-Down
// ═══════════════════════════════════════════════════════════

class _DiscoverTab extends StatefulWidget {
  const _DiscoverTab();

  @override
  State<_DiscoverTab> createState() => _DiscoverTabState();
}

class _DiscoverTabState extends State<_DiscoverTab> {
  final CardSwiperController controller = CardSwiperController();
  final MatchingService _matchingService = MatchingService();
  final AnalyticsService _analyticsService = AnalyticsService();

  List<CreatorProfile> cards = [];
  int _currentIndex = 0;

  // Mock brand ID
  static const String _brandId = 'b1';

  @override
  void initState() {
    super.initState();
    _loadCards();
  }

  void _loadCards() {
    setState(() {
      cards = _matchingService.queryCreators(MockDataService.creators);
      _currentIndex = 0;
    });
  }

  bool _onSwipe(
    int previousIndex,
    int? currentIndex,
    CardSwiperDirection direction,
  ) {
    final creator = cards[previousIndex];

    // Record the view
    _analyticsService.recordProfileView(creator.id);

    if (direction == CardSwiperDirection.right) {
      // Right swipe → create match + record
      _matchingService.createMatch(_brandId, creator.id);
      _analyticsService.recordRightSwipe(creator.id);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Shortlisted ${creator.name}! ✨'),
          backgroundColor: const Color(0xFF00C7BE),
          duration: const Duration(milliseconds: 800),
        ),
      );
    } else if (direction == CardSwiperDirection.left) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Passed on ${creator.name}'),
          duration: const Duration(milliseconds: 500),
          backgroundColor: Colors.redAccent,
        ),
      );
    }

    if (currentIndex != null) {
      _currentIndex = currentIndex;
    }

    return true;
  }

  void _onStar() {
    if (cards.isEmpty || _currentIndex >= cards.length) return;
    final creator = cards[_currentIndex];

    // ★ Star Logic: boost all tags by ×1.40
    _matchingService.handleStar(creator.tags);
    _matchingService.createMatch(_brandId, creator.id);
    _analyticsService.recordRightSwipe(creator.id);

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('⭐ Starred ${creator.name}! Tags boosted ×1.4'),
        backgroundColor: Colors.amber.shade700,
        duration: const Duration(seconds: 1),
      ),
    );

    controller.swipe(CardSwiperDirection.right);
  }

  void _onThumbsDown() {
    if (cards.isEmpty || _currentIndex >= cards.length) return;
    final creator = cards[_currentIndex];

    // Show tag picker for exclusion
    _showTagExclusionPicker(creator.tags);
  }

  void _showTagExclusionPicker(List<String> tags) {
    showModalBottomSheet(
      context: context,
      builder: (ctx) => Container(
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(
          color: Theme.of(context).scaffoldBackgroundColor,
          borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Exclude which tag?',
              style: Theme.of(context)
                  .textTheme
                  .titleMedium
                  ?.copyWith(fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            Text(
              'Creators with this tag won\'t appear again.',
              style: TextStyle(color: Colors.grey.shade500, fontSize: 13),
            ),
            const SizedBox(height: 16),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: tags.map((tag) {
                return ActionChip(
                  label: Text(tag),
                  avatar: const Icon(Icons.block, size: 16),
                  onPressed: () {
                    _matchingService.handleThumbsDown(tag);
                    Navigator.pop(ctx);

                    // Reload the card stack with updated exclusions
                    _loadCards();

                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content:
                            Text('👎 Excluded "$tag" from future results'),
                        backgroundColor: Colors.grey.shade700,
                      ),
                    );

                    controller.swipe(CardSwiperDirection.left);
                  },
                );
              }).toList(),
            ),
            const SizedBox(height: 16),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final prefs = _matchingService.preferences;
    final excludedCount = prefs.excludedTags.length;

    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.home),
          onPressed: () {
            _matchingService.reset();
            _loadCards();
            ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Feed reset')));
          },
        ),
        title: const Text('Discover Creators',
            style: TextStyle(fontWeight: FontWeight.bold)),
        actions: [
          if (excludedCount > 0)
            Padding(
              padding: const EdgeInsets.only(right: 4),
              child: Chip(
                label: Text('$excludedCount blocked',
                    style: const TextStyle(fontSize: 11)),
                backgroundColor: Colors.red.withOpacity(0.15),
                visualDensity: VisualDensity.compact,
                side: BorderSide.none,
              ),
            ),
          IconButton(
            icon: const Icon(Icons.settings),
            onPressed: () => showSettings(context),
          ),
        ],
      ),
      body: Column(
        children: [
          Expanded(
            child: cards.isEmpty
                ? Center(
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(Icons.search_off,
                            size: 64, color: Colors.grey.shade600),
                        const SizedBox(height: 16),
                        Text('No creators match your filters',
                            style: TextStyle(color: Colors.grey.shade500)),
                        const SizedBox(height: 16),
                        TextButton.icon(
                          onPressed: () {
                            _matchingService.reset();
                            _loadCards();
                          },
                          icon: const Icon(Icons.refresh),
                          label: const Text('Reset Filters'),
                        ),
                      ],
                    ),
                  )
                : CardSwiper(
                    controller: controller,
                    cardsCount: cards.length,
                    onSwipe: _onSwipe,
                    numberOfCardsDisplayed:
                        cards.length >= 3 ? 3 : cards.length,
                    cardBuilder: (context, index,
                        horizontalOffsetPercentage,
                        verticalOffsetPercentage) {
                      return SwipeCard(
                        creator: cards[index],
                        onScrollUp: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => CreatorProfileDetail(
                                  creator: cards[index]),
                            ),
                          );
                        },
                      );
                    },
                  ),
          ),

          // ── Action Buttons ──
          Padding(
            padding:
                const EdgeInsets.symmetric(vertical: 24.0, horizontal: 40),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                _ActionButton(
                  icon: Icons.close,
                  color: Colors.red,
                  onPressed: () =>
                      controller.swipe(CardSwiperDirection.left),
                ),
                _ActionButton(
                  icon: Icons.thumb_down,
                  color: Colors.grey,
                  small: true,
                  onPressed: _onThumbsDown,
                ),
                _ActionButton(
                  icon: Icons.star,
                  color: Colors.amber,
                  small: true,
                  onPressed: _onStar,
                ),
                _ActionButton(
                  icon: Icons.favorite,
                  color: const Color(0xFF00C7BE),
                  onPressed: () =>
                      controller.swipe(CardSwiperDirection.right),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

// ── Reusable action button ──
class _ActionButton extends StatelessWidget {
  final IconData icon;
  final Color color;
  final VoidCallback onPressed;
  final bool small;

  const _ActionButton({
    required this.icon,
    required this.color,
    required this.onPressed,
    this.small = false,
  });

  @override
  Widget build(BuildContext context) {
    return FloatingActionButton(
      heroTag: null,
      backgroundColor: Theme.of(context).colorScheme.surface,
      elevation: 4,
      mini: small,
      onPressed: onPressed,
      child: Icon(icon, color: color, size: small ? 20 : 28),
    );
  }
}
