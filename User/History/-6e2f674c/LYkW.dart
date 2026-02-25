import 'package:flutter/material.dart';
import 'package:flutter_card_swiper/flutter_card_swiper.dart';
import '../models/creator_models.dart';
import '../services/mock_data.dart';
import '../widgets/swipe_card.dart';
import 'creator_profile_screen.dart';

class BrandDashboard extends StatefulWidget {
  const BrandDashboard({super.key});

  @override
  State<BrandDashboard> createState() => _BrandDashboardState();
}

class _BrandDashboardState extends State<BrandDashboard> {
  final CardSwiperController controller = CardSwiperController();
  List<CreatorProfile> cards = [];
  Map<String, double> tagWeights = {};
  List<CreatorProfile> shortlisted = [];

  @override
  void initState() {
    super.initState();
    _loadCards();
  }

  void _loadCards() {
    setState(() {
      cards = List.from(MockDataService.creators);
    });
  }

  // Recommendation Logic
  void _updateWeights(List<String> tags, double weightDelta) {
    for (var tag in tags) {
      tagWeights[tag] = (tagWeights[tag] ?? 1.0) + weightDelta;
    }
    _reorderCards();
  }

  void _reorderCards() {
    // Sort remaining cards based on tag weights
    // This is a simplified version; in a real app, this would happen on the backend or efficiently locally
    setState(() {
      cards.sort((a, b) {
        double scoreA = a.tags.fold(0, (sum, tag) => sum + (tagWeights[tag] ?? 0));
        double scoreB = b.tags.fold(0, (sum, tag) => sum + (tagWeights[tag] ?? 0));
        return scoreB.compareTo(scoreA); // Descending
      });
    });
  }

  bool _onSwipe(
    int previousIndex,
    int? currentIndex,
    CardSwiperDirection direction,
  ) {
    final creator = cards[previousIndex];

    if (direction == CardSwiperDirection.right) {
      // Shortlist
      shortlisted.add(creator);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Shortlisted ${creator.name}!')),
      );
    } else if (direction == CardSwiperDirection.left) {
      // Reject
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Rejected ${creator.name}'),
          duration: const Duration(milliseconds: 500),
          backgroundColor: Colors.redAccent,
        ),
      );
    } 
    
    return true;
  }

  void _onStar() {
     if (cards.isEmpty) return;
     // The current top card is at the index provided by the controller, but implementation varies.
     // For simplicity in this mock, we assume the top card is at index 0 of the *displayed* list.
     // However, flutter_card_swiper handles indices differently. 
     // We will use the 'undo' or manual trigger logic.
     
     // Actually, simple "Star" button action:
     controller.swipe(CardSwiperDirection.top); // Treat Star as Up swipe or custom
     
     // Apply 40% boost to tags of the current card (visually top card)
      // Note: Getting the *current* card index from controller is tricky if we don't track it.
      // We will rely on the onSwipe callback if we trigger it programmatically.
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
            icon: const Icon(Icons.home),
            onPressed: () {
               // "Home" action - Reset/Go to Feed
               _loadCards();
               ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Returning to Discovery Feed')));
            },
        ),
        title: const Text('Creator Home Page', style: TextStyle(fontWeight: FontWeight.bold)),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            tooltip: 'Reset Deck',
            onPressed: _loadCards,
          ),
          IconButton(
            icon: const Icon(Icons.list),
            onPressed: () {
               // Navigate to Shortlist View
            },
          ),
        ],
      ),
      body: Column(
        children: [
          Expanded(
            child: cards.isEmpty
                ? const Center(child: CircularProgressIndicator())
                : CardSwiper(
                    controller: controller,
                    cardsCount: cards.length,
                    onSwipe: _onSwipe,
                    numberOfCardsDisplayed: 3,
                    cardBuilder: (context, index, horizontalOffsetPercentage, verticalOffsetPercentage) {
                      return SwipeCard(
                        creator: cards[index],
                        onScrollUp: () {
                           Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => CreatorProfileDetail(creator: cards[index]),
                            ),
                          );
                        },
                      );
                    },
                  ),
          ),
          
          // Interaction Buttons
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 24.0, horizontal: 40),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                _ActionButton(
                  icon: Icons.close,
                  color: Colors.red,
                  onPressed: () => controller.swipe(CardSwiperDirection.left),
                ),
                _ActionButton(
                  icon: Icons.thumb_down,
                  color: Colors.grey,
                  small: true,
                  onPressed: () {
                     // Negative feedback logic
                     // _updateWeights(currentTags, -1.0);
                     controller.swipe(CardSwiperDirection.left);
                  },
                ),
                _ActionButton(
                  icon: Icons.star,
                  color: Colors.amber,
                  small: true,
                  onPressed: () {
                     // Priority Match logic
                     // _updateWeights(currentTags, 0.4); 
                     controller.swipe(CardSwiperDirection.right);
                  },
                ),
                _ActionButton(
                  icon: Icons.favorite,
                  color: const Color(0xFF00C7BE), // Teal
                  onPressed: () => controller.swipe(CardSwiperDirection.right),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

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
      backgroundColor: const Color(0xFF1E1E1E),
      elevation: 4,
      mini: small,
      onPressed: onPressed,
      child: Icon(icon, color: color, size: small ? 20 : 28),
    );
  }
}
