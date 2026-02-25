import 'package:flutter/material.dart';
import '../services/matching_service.dart';
import '../widgets/settings_sheet.dart';

class BrandBriefEditor extends StatefulWidget {
  const BrandBriefEditor({super.key});

  @override
  State<BrandBriefEditor> createState() => _BrandBriefEditorState();
}

class _BrandBriefEditorState extends State<BrandBriefEditor> {
  final _whyUsController = TextEditingController(
    text: 'We are the #1 D2C sneaker brand in India with 2M+ customers.',
  );
  final _whatWeNeedController = TextEditingController(
    text: 'Looking for 3 creators to shoot lifestyle reels wearing our new drop.',
  );
  final MatchingService _matchingService = MatchingService();
  late RangeValues _budgetRange;
  bool _saved = false;

  @override
  void initState() {
    super.initState();
    _budgetRange = RangeValues(
      _matchingService.preferences.minBudget,
      _matchingService.preferences.maxBudget,
    );
  }

  void _save() {
    // Update the matching service budget filter
    _matchingService.preferences.minBudget = _budgetRange.start;
    _matchingService.preferences.maxBudget = _budgetRange.end;

    setState(() => _saved = true);

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Brand brief saved! Budget filter updated.'),
        backgroundColor: Color(0xFF00C7BE),
      ),
    );

    Future.delayed(const Duration(seconds: 2), () {
      if (mounted) setState(() => _saved = false);
    });
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final prefs = _matchingService.preferences;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Brand Brief',
            style: TextStyle(fontWeight: FontWeight.bold)),
        actions: [
          IconButton(
            icon: const Icon(Icons.settings),
            onPressed: () => showSettings(context),
          ),
          TextButton.icon(
            onPressed: _save,
            icon: Icon(_saved ? Icons.check : Icons.save,
                color: theme.primaryColor, size: 18),
            label: Text(_saved ? 'Saved' : 'Save',
                style: TextStyle(color: theme.primaryColor)),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // ── Why Us ──
            _sectionHeader(context, 'Why Us', Icons.business_center),
            const SizedBox(height: 8),
            Text('Tell creators why they should work with you.',
                style: TextStyle(color: Colors.grey.shade500, fontSize: 13)),
            const SizedBox(height: 10),
            TextField(
              controller: _whyUsController,
              maxLines: 4,
              decoration: _inputDecor('Our brand story…'),
            ),

            const SizedBox(height: 28),

            // ── What We Need ──
            _sectionHeader(context, 'What We Need', Icons.list_alt),
            const SizedBox(height: 8),
            Text('Describe the deliverables you expect.',
                style: TextStyle(color: Colors.grey.shade500, fontSize: 13)),
            const SizedBox(height: 10),
            TextField(
              controller: _whatWeNeedController,
              maxLines: 4,
              decoration: _inputDecor('Content requirements…'),
            ),

            const SizedBox(height: 28),

            // ── Budget Filter ──
            _sectionHeader(context, 'Budget Filter', Icons.attach_money),
            const SizedBox(height: 8),
            Text(
              'Only show creators within this budget range.',
              style: TextStyle(color: Colors.grey.shade500, fontSize: 13),
            ),
            const SizedBox(height: 16),

            // Budget display
            Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 20),
              decoration: BoxDecoration(
                color: theme.primaryColor.withOpacity(0.08),
                borderRadius: BorderRadius.circular(14),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    children: [
                      Text('MIN',
                          style: TextStyle(
                              fontSize: 11, color: Colors.grey.shade500)),
                      Text('\$${_budgetRange.start.round()}',
                          style: TextStyle(
                              fontSize: 22,
                              fontWeight: FontWeight.bold,
                              color: theme.primaryColor)),
                    ],
                  ),
                  Icon(Icons.arrow_forward,
                      color: Colors.grey.shade500, size: 20),
                  Column(
                    children: [
                      Text('MAX',
                          style: TextStyle(
                              fontSize: 11, color: Colors.grey.shade500)),
                      Text('\$${_budgetRange.end.round()}',
                          style: TextStyle(
                              fontSize: 22,
                              fontWeight: FontWeight.bold,
                              color: theme.primaryColor)),
                    ],
                  ),
                ],
              ),
            ),

            RangeSlider(
              values: _budgetRange,
              min: 0,
              max: 5000,
              divisions: 50,
              labels: RangeLabels(
                '\$${_budgetRange.start.round()}',
                '\$${_budgetRange.end.round()}',
              ),
              onChanged: (v) => setState(() => _budgetRange = v),
            ),

            const SizedBox(height: 28),

            // ── Excluded Tags Overview ──
            _sectionHeader(context, 'Excluded Tags', Icons.block),
            const SizedBox(height: 8),
            prefs.excludedTags.isEmpty
                ? Text('No tags excluded yet.',
                    style: TextStyle(color: Colors.grey.shade500, fontSize: 13))
                : Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: prefs.excludedTags.map((tag) {
                      return Chip(
                        label: Text(tag),
                        deleteIcon:
                            const Icon(Icons.close, size: 16),
                        onDeleted: () {
                          setState(() {
                            prefs.excludedTags.remove(tag);
                          });
                        },
                        backgroundColor: Colors.red.withOpacity(0.1),
                        labelStyle: const TextStyle(color: Colors.red),
                        side: BorderSide.none,
                      );
                    }).toList(),
                  ),

            const SizedBox(height: 28),

            // ── Preference Weights ──
            if (prefs.tagWeights.isNotEmpty) ...[
              _sectionHeader(context, 'Tag Preferences', Icons.trending_up),
              const SizedBox(height: 12),
              ...prefs.tagWeights.entries.map((e) {
                final boost = ((e.value - 1.0) * 100).round();
                return Padding(
                  padding: const EdgeInsets.only(bottom: 8),
                  child: Row(
                    children: [
                      Text('#${e.key}',
                          style: TextStyle(
                              color: theme.primaryColor,
                              fontWeight: FontWeight.w500)),
                      const Spacer(),
                      Text('+$boost%',
                          style: TextStyle(
                              color: Colors.green.shade400,
                              fontWeight: FontWeight.w600)),
                    ],
                  ),
                );
              }),
            ],

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

  InputDecoration _inputDecor(String hint) {
    return InputDecoration(
      hintText: hint,
      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
      filled: true,
      fillColor: Colors.white.withOpacity(0.05),
    );
  }
}
