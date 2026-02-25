import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/theme_service.dart';

class SettingsSheet extends StatelessWidget {
  const SettingsSheet({super.key});

  @override
  Widget build(BuildContext context) {
    final themeService = Provider.of<ThemeService>(context);

    return Container(
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
            'Settings',
            style: Theme.of(context).textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 24),
          ListTile(
            contentPadding: EdgeInsets.zero,
            leading: Icon(
              themeService.isDarkMode ? Icons.dark_mode : Icons.light_mode,
              color: Theme.of(context).primaryColor,
            ),
            title: const Text('Dark Mode'),
            trailing: Switch(
              value: themeService.isDarkMode,
              onChanged: (value) {
                themeService.toggleTheme();
              },
            ),
          ),
          const SizedBox(height: 24),
        ],
      ),
    );
  }
}

void showSettings(BuildContext context) {
  showModalBottomSheet(
    context: context,
    builder: (context) => const SettingsSheet(),
  );
}
