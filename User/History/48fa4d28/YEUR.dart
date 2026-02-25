import 'dart:convert';
import 'package:crypto/crypto.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter/foundation.dart';

class StorageService {
  static SharedPreferences? _prefs;
  // In a real app, this salt would be more complex and potentially obfuscated
  static const _salt = 'bored_games_secure_salt_v1';

  static Future<void> init() async {
    try {
      _prefs = await SharedPreferences.getInstance();
    } catch (e) {
      debugPrint('StorageService: Failed to initialize SharedPreferences: $e');
    }
  }

  static Future<void> setString(String key, String value) async {
    await _prefs?.setString(key, value);
  }

  static String? getString(String key) {
    return _prefs?.getString(key);
  }

  static Future<void> setInt(String key, int value) async {
    await _prefs?.setInt(key, value);
  }

  static int? getInt(String key) {
    return _prefs?.getInt(key);
  }

  static Future<void> setBool(String key, bool value) async {
    await _prefs?.setBool(key, value);
  }

  static bool getBool(String key, {bool defaultValue = false}) {
    return _prefs?.getBool(key) ?? defaultValue;
  }

  // --- Secure High Score Logic ---

  /// Saves a high score with a checksum to prevent tampering.
  static Future<void> setSecureHighscore(String gameId, int score) async {
    if (_prefs == null) return;
    
    final key = 'highscore_$gameId';
    final hashKey = 'hash_$gameId';
    
    // Create a hash: sha256(score + salt)
    final hash = _generateHash(score);

    await _prefs!.setInt(key, score);
    await _prefs!.setString(hashKey, hash);
  }

  /// Retrieves the high score, verifying the checksum.
  /// Returns 0 if data is tampered or missing.
  static int getSecureHighscore(String gameId) {
    if (_prefs == null) return 0;

    final key = 'highscore_$gameId';
    final hashKey = 'hash_$gameId';

    final score = _prefs!.getInt(key);
    final storedHash = _prefs!.getString(hashKey);

    if (score == null || storedHash == null) {
      return 0;
    }

    // Verify hash
    final expectedHash = _generateHash(score);
    if (storedHash == expectedHash) {
      return score;
    } else {
      debugPrint('WARNING: High score for $gameId has been tampered with!');
      return 0; // Return 0 if tampered
    }
  }

  static String _generateHash(int score) {
    final bytes = utf8.encode('$score$_salt');
    return sha256.convert(bytes).toString();
  }
}
