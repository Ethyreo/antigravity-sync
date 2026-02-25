import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../models/creator_models.dart';

class SwipeCard extends StatelessWidget {
  final CreatorProfile creator;
  final VoidCallback onScrollUp;

  const SwipeCard({
    super.key,
    required this.creator,
    required this.onScrollUp,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onVerticalDragEnd: (details) {
        if (details.primaryVelocity! < -500) {
          // Scrolled up
          onScrollUp();
        }
      },
      child: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(32),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.2),
              blurRadius: 10,
              offset: const Offset(0, 5),
            ),
          ],
        ),
        clipBehavior: Clip.antiAlias,
        child: Stack(
          fit: StackFit.expand,
          children: [
            // Background Image
            CachedNetworkImage(
              imageUrl: creator.imageUrl,
              fit: BoxFit.cover,
              placeholder: (context, url) => Container(color: Colors.grey[800]),
              errorWidget: (context, url, error) => const Icon(Icons.error),
            ),
            
            // Gradient Overlay
            Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    Colors.transparent,
                    Colors.black.withOpacity(0.8),
                  ],
                  stops: const [0.6, 1.0],
                ),
              ),
            ),

            // Content
            Padding(
              padding: const EdgeInsets.all(20.0),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.end,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    creator.name,
                    style: const TextStyle(
                      fontSize: 28,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Wrap(
                    spacing: 8,
                    children: creator.tags.map((tag) {
                      return Chip(
                        label: Text(tag, style: const TextStyle(fontSize: 12)),
                        backgroundColor: Theme.of(context).primaryColor.withOpacity(0.8),
                        labelStyle: const TextStyle(color: Colors.white),
                        padding: EdgeInsets.zero,
                        visualDensity: VisualDensity.compact,
                        side: BorderSide.none,
                      );
                    }).toList(),
                  ),
                  const SizedBox(height: 16),
                  const Center(
                    child: Icon(
                      Icons.keyboard_arrow_up,
                      color: Colors.white70,
                      size: 32,
                    ),
                  ),
                  const Center(
                    child: Text(
                      'Scroll up for Portfolio',
                      style: TextStyle(color: Colors.white70, fontSize: 12),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
