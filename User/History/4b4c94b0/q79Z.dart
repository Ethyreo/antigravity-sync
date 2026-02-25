import 'package:flutter/material.dart';
import '../models/creator_models.dart';
import '../services/mock_data.dart';
import '../widgets/slide_to_accept.dart';
import '../services/matching_service.dart';

/// Expand view showing a brand's brief + slide-to-accept/decline
class BrandBriefView extends StatefulWidget {
  final BrandProfile brand;
  final Match match;

  const BrandBriefView({
    super.key,
    required this.brand,
    required this.match,
  });

  @override
  State<BrandBriefView> createState() => _BrandBriefViewState();
}

class _BrandBriefViewState extends State<BrandBriefView> {
  bool _handled = false;

  void _accept() {
    MatchingService().acceptMatch(widget.match.id);
    setState(() => _handled = true);

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('You accepted ${widget.brand.name}! 🎉'),
        backgroundColor: Colors.green,
      ),
    );

    Future.delayed(const Duration(seconds: 1), () {
      if (mounted) Navigator.pop(context, true);
    });
  }

  void _decline() {
    MatchingService().declineMatch(widget.match.id);

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Declined ${widget.brand.name}'),
        backgroundColor: Colors.grey,
      ),
    );

    Navigator.pop(context, true);
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final brand = widget.brand;

    return Scaffold(
      appBar: AppBar(
        title: Text(brand.name),
        backgroundColor: Colors.transparent,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // ── Brand Header ──
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    theme.primaryColor.withOpacity(0.15),
                    theme.primaryColor.withOpacity(0.05),
                  ],
                ),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Column(
                children: [
                  CircleAvatar(
                    radius: 36,
                    backgroundColor: theme.primaryColor.withOpacity(0.2),
                    child: Text(
                      brand.name[0],
                      style: TextStyle(
                          fontSize: 28,
                          fontWeight: FontWeight.bold,
                          color: theme.primaryColor),
                    ),
                  ),
                  const SizedBox(height: 12),
                  Text(brand.name,
                      style: const TextStyle(
                          fontSize: 22, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 4),
                  Container(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
                    decoration: BoxDecoration(
                      color: theme.primaryColor.withOpacity(0.12),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Text(brand.industry,
                        style: TextStyle(
                            color: theme.primaryColor, fontSize: 13)),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),

            // ── Description ──
            Text(brand.description,
                style: TextStyle(
                    color: Colors.grey.shade400, height: 1.5, fontSize: 15)),

            const SizedBox(height: 24),

            // ── Why Us ──
            if (brand.whyUs.isNotEmpty) ...[
              _SectionTitle(title: 'Why Us', icon: Icons.star_outline),
              const SizedBox(height: 8),
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: theme.colorScheme.surface,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: Colors.white10),
                ),
                child: Text(brand.whyUs,
                    style: const TextStyle(height: 1.6)),
              ),
              const SizedBox(height: 24),
            ],

            // ── What We Need ──
            if (brand.whatWeNeed.isNotEmpty) ...[
              _SectionTitle(
                  title: 'What We Need', icon: Icons.checklist),
              const SizedBox(height: 8),
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: theme.colorScheme.surface,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: Colors.white10),
                ),
                child: Text(brand.whatWeNeed,
                    style: const TextStyle(height: 1.6)),
              ),
              const SizedBox(height: 24),
            ],

            // ── Contact Info (teaser) ──
            if (brand.contactEmail.isNotEmpty) ...[
              _SectionTitle(title: 'Contact', icon: Icons.lock_outline),
              const SizedBox(height: 8),
              Text(
                'Contact info will be unlocked after accepting.',
                style:
                    TextStyle(color: Colors.grey.shade500, fontSize: 13),
              ),
              const SizedBox(height: 24),
            ],

            const SizedBox(height: 8),
          ],
        ),
      ),

      // ── Bottom Actions ──
      bottomNavigationBar: _handled
          ? null
          : SafeArea(
              child: Padding(
                padding:
                    const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    SlideToAccept(onAccept: _accept),
                    const SizedBox(height: 12),
                    TextButton(
                      onPressed: _decline,
                      child: const Text('Decline',
                          style: TextStyle(color: Colors.redAccent)),
                    ),
                  ],
                ),
              ),
            ),
    );
  }
}

class _SectionTitle extends StatelessWidget {
  final String title;
  final IconData icon;

  const _SectionTitle({required this.title, required this.icon});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Icon(icon, size: 20, color: Theme.of(context).primaryColor),
        const SizedBox(width: 8),
        Text(title,
            style:
                const TextStyle(fontSize: 17, fontWeight: FontWeight.bold)),
      ],
    );
  }
}
