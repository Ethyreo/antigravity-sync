import 'dart:io';
import 'package:flutter/material.dart';
import 'package:file_picker/file_picker.dart';
import 'package:pdf_watermarker/screens/options_screen.dart';
import 'package:pdf_watermarker/theme/retro_theme.dart';
import 'package:pdf_watermarker/services/watermark_service.dart';
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
                onPressed: () => _handleLocalUpload(context),
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

  Future<void> _handleLocalUpload(BuildContext context) async {
    FilePickerResult? result = await FilePicker.platform.pickFiles(
      allowMultiple: true,
      type: FileType.custom,
      allowedExtensions: ['pdf'],
    );

    if (result != null) {
      List<File> files = result.paths.map((path) => File(path!)).toList();
      _showProcessingDialog(context, files);
    }
  }

  void _showProcessingDialog(BuildContext context, List<File> files) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setState) {
            String statusText = 'INITIALIZING...';
            
            // Start processing asynchronously
            Future.delayed(const Duration(milliseconds: 500), () async {
              final result = await WatermarkService.processFiles(
                sourceFiles: files,
                onProgress: (current, total) {
                  // This callback might fire too fast to rebuild UI cleanly every millisecond,
                  // but we can try to update occasionally if needed.
                },
              );
              Navigator.pop(context); // Close dialog
              _showResultDialog(context, result);
            });

            return AlertDialog(
              backgroundColor: RetroTheme.background,
              shape: RoundedRectangleBorder(
                side: const BorderSide(color: RetroTheme.primary, width: 4),
              ),
              title: const Text('PROCESSING', style: TextStyle(color: RetroTheme.primary)),
              content: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const CircularProgressIndicator(color: RetroTheme.secondary),
                  const SizedBox(height: 20),
                  Text(statusText, style: const TextStyle(fontSize: 10)),
                ],
              ),
            );
          },
        );
      },
    );
  }

  void _showResultDialog(BuildContext context, WatermarkResult result) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: RetroTheme.background,
        shape: RoundedRectangleBorder(
          side: BorderSide(color: result.failCount == 0 ? RetroTheme.primary : RetroTheme.accent, width: 4),
        ),
        title: const Text('MISSION COMPLETE'),
        content: Text(
          'SUCCESS: ${result.successCount}\nFAILED: ${result.failCount}\n\n'
          '${result.errors.isNotEmpty ? result.errors.take(3).join('\n') : "All files processed clean."}',
          style: const TextStyle(fontSize: 10),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('ACKNOWLEDGE', style: TextStyle(color: RetroTheme.secondary)),
          )
        ],
      ),
    );
  }
}
