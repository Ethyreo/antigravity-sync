import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:bored_games/app/app.dart';
import 'package:bored_games/core/services/storage_service.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  try {
    await StorageService.init().timeout(
      const Duration(seconds: 2),
      onTimeout: () {
        debugPrint('StorageService.init() timed out - starting app anyway');
      },
    );
  } catch (e) {
    debugPrint('StorageService.init() failed: $e');
  }
  
  runApp(
    const ProviderScope(
      child: BoredGamesApp(),
    ),
  );
}

