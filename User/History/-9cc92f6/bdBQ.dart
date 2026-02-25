import 'package:flutter/material.dart';
import '../models/creator_models.dart';

class CreatorEditor extends StatefulWidget {
  const CreatorEditor({super.key});

  @override
  State<CreatorEditor> createState() => _CreatorEditorState();
}

class _CreatorEditorState extends State<CreatorEditor> {
  // Form State
  final _bioController = TextEditingController();
  final _handleController = TextEditingController();
  RangeValues _rateRange = const RangeValues(100, 1000);
  List<String> _selectedTags = [];
  
  // Mock Data for "Available Tags"
  final List<String> _allTags = [
    'Tech', 'Beauty', 'Fashion', 'Travel', 'Food', 'Gaming', 'Lifestyle', 'UGC', 'Fitness', 'Business'
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.home),
          onPressed: () {
            // Dummy action
          },
        ),
        title: const Text('Edit Profile'),
        actions: [
          TextButton(
            onPressed: () {
              // Save Logic
              ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Profile Saved!')));
            },
            child: const Text('Save', style: TextStyle(color: Colors.blueAccent)),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Bio Section
            const Text('Bio', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            TextField(
              controller: _bioController,
              maxLines: 4,
              decoration: InputDecoration(
                hintText: 'Tell brands about yourself...',
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                filled: true,
                fillColor: Colors.white.withOpacity(0.05),
              ),
            ),
            
            const SizedBox(height: 24),

            // Primary Handle
            const Text('Primary Social Handle', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            TextField(
              controller: _handleController,
              decoration: InputDecoration(
                hintText: '@yourhandle (IG/TikTok/YT)',
                prefixIcon: const Icon(Icons.link),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
              ),
            ),

            const SizedBox(height: 24),

            // Category Tags
            const Text('Category Tags (Max 5)', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            Wrap(
              spacing: 8,
              children: _allTags.map((tag) {
                final isSelected = _selectedTags.contains(tag);
                return FilterChip(
                  label: Text(tag),
                  selected: isSelected,
                  onSelected: (selected) {
                    setState(() {
                      if (selected) {
                        if (_selectedTags.length < 5) _selectedTags.add(tag);
                      } else {
                        _selectedTags.remove(tag);
                      }
                    });
                  },
                );
              }).toList(),
            ),

            const SizedBox(height: 24),

            // Rate Card Range
            const Text('Rate Card (USD)', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('\$${_rateRange.start.round()}'),
                Text('\$${_rateRange.end.round()}'),
              ],
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
                setState(() {
                  _rateRange = values;
                });
              },
            ),
          ],
        ),
      ),
    );
  }
}
