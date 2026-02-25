import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:bored_games/app/app.dart';
import 'package:bored_games/core/services/storage_service.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await StorageService.init();
  
  runApp(
    const ProviderScope(
      child: BoredGamesApp(),
    ),
  );
}

