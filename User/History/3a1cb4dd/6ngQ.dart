import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';

// App Theme
class AppTheme {
  static final ThemeData darkTheme = ThemeData(
    brightness: Brightness.dark,
    primaryColor: const Color(0xFF6C63FF),
    scaffoldBackgroundColor: const Color(0xFF1E1E2E),
    textTheme: GoogleFonts.poppinsTextTheme(ThemeData.dark().textTheme),
    colorScheme: const ColorScheme.dark(
      primary: Color(0xFF6C63FF),
      secondary: Color(0xFF00E5FF),
      surface: Color(0xFF2D2D44),
    ),
    useMaterial3: true,
  );
}
