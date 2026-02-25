import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:bored_games/app/app.dart';
import 'package:bored_games/core/services/storage_service.dart';
import 'dart:js_interop';
import 'dart:js_interop_unsafe';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await StorageService.init();
  
  runApp(
    const ProviderScope(
      child: BoredGamesApp(),
    ),
  );

  // Dismiss the native HTML loading screen now that Flutter is running
  WidgetsBinding.instance.addPostFrameCallback((_) {
    try {
      globalContext.callMethod('dismissLoadingScreen'.toJS);
    } catch (_) {
      // Silently fail on non-web platforms
    }
  });
}
