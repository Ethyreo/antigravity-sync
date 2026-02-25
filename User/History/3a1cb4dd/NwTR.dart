import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

// Cyber-8-bit Color Palette
class CyberColors {
  static const Color voidBlack = Color(0xFF000000);
  static const Color electricCyan = Color(0xFF00FFFF);
  static const Color cyberYellow = Color(0xFFFFF000);
  static const Color hazardMagenta = Color(0xFFFF00FF);
  static const Color ghostWhite = Color(0xFFF0F0F0);
  static const Color dimGrid = Color(0xFF1A1A1A);
}

class AppTheme {
  static final ThemeData cyberTheme = ThemeData(
    brightness: Brightness.dark,
    primaryColor: CyberColors.electricCyan,
    scaffoldBackgroundColor: CyberColors.voidBlack,
    fontFamily: GoogleFonts.pressStart2p().fontFamily,
    
    // Color Scheme
    colorScheme: const ColorScheme(
      brightness: Brightness.dark,
      primary: CyberColors.electricCyan,
      onPrimary: CyberColors.voidBlack,
      secondary: CyberColors.hazardMagenta,
      onSecondary: CyberColors.voidBlack,
      error: CyberColors.hazardMagenta,
      onError: CyberColors.voidBlack,
      surface: CyberColors.voidBlack,
      onSurface: CyberColors.ghostWhite,
    ),

    // Text Theme
    textTheme: TextTheme(
      headlineLarge: GoogleFonts.pressStart2p(
        fontSize: 32,
        color: CyberColors.electricCyan,
      ),
      headlineMedium: GoogleFonts.pressStart2p(
        fontSize: 24,
        color: CyberColors.ghostWhite,
      ),
      bodyLarge: GoogleFonts.pressStart2p(
        fontSize: 14,
        color: CyberColors.ghostWhite,
        height: 1.5, // Better readability
      ),
      bodyMedium: GoogleFonts.roboto(
        fontSize: 14, // Fallback for dense text
        color: CyberColors.ghostWhite,
      ),
    ),

    // Components
    cardTheme: CardTheme(
      color: CyberColors.voidBlack,
      shape: const RoundedRectangleBorder(
        side: BorderSide(color: CyberColors.hazardMagenta, width: 2),
        borderRadius: BorderRadius.zero, // Sharp corners
      ),
      elevation: 0,
    ),

    appBarTheme: AppBarTheme(
      backgroundColor: CyberColors.voidBlack,
      elevation: 0,
      centerTitle: true,
      titleTextStyle: GoogleFonts.pressStart2p(
        fontSize: 16,
        color: CyberColors.electricCyan,
      ),
      iconTheme: const IconThemeData(color: CyberColors.electricCyan),
    ),

    iconTheme: const IconThemeData(color: CyberColors.electricCyan),
  );
}
