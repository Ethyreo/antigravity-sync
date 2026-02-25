import 'package:flutter/material.dart';
import 'package:pdf_watermarker/screens/options_screen.dart';
import 'package:pdf_watermarker/theme/retro_theme.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('PDF WATERMARKER'),
        actions: [
          IconButton(
            icon: const Icon(Icons.settings),
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => const OptionsScreen()),
              );
            },
          )
        ],
      ),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(32.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              _buildPixelIcon(Icons.insert_drive_file),
              const SizedBox(height: 48),
              ElevatedButton.icon(
                icon: const Icon(Icons.folder_open),
                label: const Text('LOCAL UPLOAD'),
                onPressed: () {
                  // TODO: Implement local upload
                },
              ),
              const SizedBox(height: 24),
              const Center(
                child: Text(
                  'VS',
                  style: TextStyle(color: RetroTheme.secondary, fontSize: 16),
                ),
              ),
              const SizedBox(height: 24),
              ElevatedButton.icon(
                icon: const Icon(Icons.cloud_download),
                label: const Text('G-DRIVE SCAN'),
                style: ElevatedButton.styleFrom(
                  side: const BorderSide(color: RetroTheme.secondary, width: 4),
                  foregroundColor: RetroTheme.secondary,
                ),
                onPressed: () {
                  // TODO: Implement Google Drive link input dialog
                },
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildPixelIcon(IconData icon) {
    return Container(
      width: 100,
      height: 100,
      decoration: BoxDecoration(
        border: Border.all(color: RetroTheme.primary, width: 6),
        color: Colors.black,
      ),
      child: Center(
        child: Icon(icon, size: 60, color: RetroTheme.primary),
      ),
    );
  }
}
