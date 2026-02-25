import 'package:flutter/material.dart';

/// Custom painted 7-day bar chart for profile views.
class AnalyticsChart extends StatelessWidget {
  final List<int> weeklyViews;
  static const _days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const AnalyticsChart({super.key, required this.weeklyViews});

  @override
  Widget build(BuildContext context) {
    final maxVal = weeklyViews.reduce((a, b) => a > b ? a : b).toDouble();
    final theme = Theme.of(context);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SizedBox(
          height: 180,
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: List.generate(7, (i) {
              final fraction = maxVal == 0 ? 0.0 : weeklyViews[i] / maxVal;
              return Expanded(
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 4),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: [
                      Text(
                        '${weeklyViews[i]}',
                        style: TextStyle(
                          fontSize: 11,
                          color: Colors.grey.shade500,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      const SizedBox(height: 4),
                      AnimatedContainer(
                        duration: Duration(milliseconds: 400 + i * 80),
                        curve: Curves.easeOutCubic,
                        height: 140 * fraction,
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(6),
                          gradient: LinearGradient(
                            begin: Alignment.bottomCenter,
                            end: Alignment.topCenter,
                            colors: [
                              theme.primaryColor,
                              theme.primaryColor.withOpacity(0.5),
                            ],
                          ),
                        ),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        _days[i],
                        style: TextStyle(
                          fontSize: 11,
                          color: Colors.grey.shade500,
                        ),
                      ),
                    ],
                  ),
                ),
              );
            }),
          ),
        ),
      ],
    );
  }
}
