import 'package:flutter/services.dart';

class HapticsService {
  static Future<void> lightImpact() async {
    await HapticFeedback.lightImpact();
  }

  static Future<void> mediumImpact() async {
    await HapticFeedback.mediumImpact();
  }

  static Future<void> heavyImpact() async {
    await HapticFeedback.heavyImpact();
  }

  static Future<void> vibrate() async {
    await HapticFeedback.vibrate();
  }

  static Future<void> selectionClick() async {
    await HapticFeedback.selectionClick();
  }
}
