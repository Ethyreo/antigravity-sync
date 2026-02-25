import 'package:flutter/material.dart';
import '../widgets/settings_sheet.dart';

class CreatorEditor extends StatefulWidget {
  const CreatorEditor({super.key});

  @override
  State<CreatorEditor> createState() => _CreatorEditorState();
}

class _CreatorEditorState extends State<CreatorEditor> {
  // Form State
  final _bioController = TextEditingController(
    text: 'Fashion & Lifestyle Content Creator. 100k+ followers on IG.',
  );
  final _handleController = TextEditingController(text: '@alicewonder');
  RangeValues _rateRange = const RangeValues(500, 1200);
  List<String> _selectedTags = ['Fashion', 'Beauty', 'Lifestyle'];

  final List<String> _allTags = [
    'Tech',
    'Beauty',
    'Fashion',
    'Travel',
    'Food',
    'Gaming',
    'Lifestyle',
    'UGC',
    'Fitness',
    'Business',
    'Health',
    'Education',
    'Entertainment',
    'Automotive',
    'Reviews',
  ];

  // Mock portfolio grid
  final List<String> _portfolioImages = [
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400',
    'https://images.unsplash.com/photo-1529139574466-a302d2d3f524?auto=format&fit=crop&w=400',
  ];

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.home),
          onPressed: () {},
        ),
        title: const Text('Edit Profile',
            style: TextStyle(fontWeight: FontWeight.bold)),
        actions: [
          IconButton(
            icon: const Icon(Icons.settings),
            onPressed: () => showSettings(context),
          ),
          TextButton(
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Profile Saved! ✓'),
                  backgroundColor: Color(0xFF00C7BE),
                ),
              );
            },
            child:
                Text('Save', style: TextStyle(color: theme.primaryColor)),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // ── Portfolio Media Grid ──
            _sectionHeader(context, 'Portfolio', Icons.photo_library),
            const SizedBox(height: 8),
            Text('Tap + to add photos. Brands see these on your card.',
                style: TextStyle(color: Colors.grey.shade500, fontSize: 13)),
            const SizedBox(height: 12),
            SizedBox(
              height: 140,
              child: ListView(
                scrollDirection: Axis.horizontal,
                children: [
                  // Existing images
                  ..._portfolioImages.map((url) => Padding(
                        padding: const EdgeInsets.only(right: 10),
                        child: Stack(
                          children: [
                            ClipRRect(
                              borderRadius: BorderRadius.circular(12),
                              child: Image.network(
                                url,
                                width: 110,
                                height: 140,
                                fit: BoxFit.cover,
                                errorBuilder: (_, __, ___) => Container(
                                  width: 110,
                                  height: 140,
                                  color: Colors.grey.shade800,
                                  child: const Icon(Icons.broken_image),
                                ),
                              ),
                            ),
                            Positioned(
                              top: 4,
                              right: 4,
                              child: GestureDetector(
                                onTap: () {
                                  setState(() {
                                    _portfolioImages.remove(url);
                                  });
                                },
                                child: Container(
                                  padding: const EdgeInsets.all(4),
                                  decoration: const BoxDecoration(
                                    color: Colors.black54,
                                    shape: BoxShape.circle,
                                  ),
                                  child: const Icon(Icons.close,
                                      size: 14, color: Colors.white),
                                ),
                              ),
                            ),
                          ],
                        ),
                      )),

                  // Add button
                  GestureDetector(
                    onTap: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                            content:
                                Text('Image picker coming soon (mock)')),
                      );
                    },
                    child: Container(
                      width: 110,
                      height: 140,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(
                            color: theme.primaryColor.withOpacity(0.5),
                            width: 2),
                        color: theme.primaryColor.withOpacity(0.05),
                      ),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.add_photo_alternate,
                              color: theme.primaryColor, size: 32),
                          const SizedBox(height: 6),
                          Text('Add',
                              style: TextStyle(
                                  color: theme.primaryColor, fontSize: 13)),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),

            // ── Bio ──
            _sectionHeader(context, 'Bio', Icons.edit),
            const SizedBox(height: 8),
            TextField(
              controller: _bioController,
              maxLines: 4,
              decoration: InputDecoration(
                hintText: 'Tell brands about yourself...',
                border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12)),
                filled: true,
                fillColor: Colors.white.withOpacity(0.05),
              ),
            ),

            const SizedBox(height: 24),

            // ── Social Handle ──
            _sectionHeader(context, 'Primary Social Handle', Icons.link),
            const SizedBox(height: 8),
            TextField(
              controller: _handleController,
              decoration: InputDecoration(
                hintText: '@yourhandle (IG/TikTok/YT)',
                prefixIcon: const Icon(Icons.alternate_email),
                border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12)),
              ),
            ),

            const SizedBox(height: 24),

            // ── Category Tags ──
            _sectionHeader(context, 'Category Tags (Max 5)', Icons.tag),
            const SizedBox(height: 8),
            Wrap(
              spacing: 8,
              runSpacing: 6,
              children: _allTags.map((tag) {
                final isSelected = _selectedTags.contains(tag);
                return FilterChip(
                  label: Text(tag),
                  selected: isSelected,
                  selectedColor: theme.primaryColor.withOpacity(0.2),
                  checkmarkColor: theme.primaryColor,
                  onSelected: (selected) {
                    setState(() {
                      if (selected) {
                        if (_selectedTags.length < 5) {
                          _selectedTags.add(tag);
                        } else {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                                content: Text('Max 5 tags allowed')),
                          );
                        }
                      } else {
                        _selectedTags.remove(tag);
                      }
                    });
                  },
                );
              }).toList(),
            ),

            const SizedBox(height: 24),

            // ── Rate Card ──
            _sectionHeader(context, 'Rate Card (USD)', Icons.attach_money),
            const SizedBox(height: 8),

            Container(
              padding:
                  const EdgeInsets.symmetric(vertical: 12, horizontal: 16),
              decoration: BoxDecoration(
                color: theme.primaryColor.withOpacity(0.08),
                borderRadius: BorderRadius.circular(14),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('\$${_rateRange.start.round()}',
                      style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          color: theme.primaryColor)),
                  Text('—', style: TextStyle(color: Colors.grey.shade500)),
                  Text('\$${_rateRange.end.round()}',
                      style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          color: theme.primaryColor)),
                ],
              ),
            ),

            RangeSlider(
              values: _rateRange,
              min: 0,
              max: 5000,
              divisions: 50,
              labels: RangeLabels(
                '\$${_rateRange.start.round()}',
                '\$${_rateRange.end.round()}',
              ),
              onChanged: (values) {
                setState(() => _rateRange = values);
              },
            ),

            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }

  Widget _sectionHeader(BuildContext context, String title, IconData icon) {
    return Row(
      children: [
        Icon(icon, size: 20, color: Theme.of(context).primaryColor),
        const SizedBox(width: 8),
        Text(title,
            style:
                const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
      ],
    );
  }
}
