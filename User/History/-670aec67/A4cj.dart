import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'screens/login_screen.dart';
import 'screens/brand_dashboard.dart';
import 'screens/creator_dashboard.dart';

void main() {
  runApp(const CreatorMatchApp());
}

class CreatorMatchApp extends StatelessWidget {
  const CreatorMatchApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'CreatorMatch',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: const Color(0xFF121212), // Deep Gray
        primaryColor: const Color(0xFF007AFF), // Electric Blue
        colorScheme: const ColorScheme.dark(
          primary: Color(0xFF007AFF),
          secondary: Color(0xFF00C7BE), // Teal accent
          surface: Color(0xFF1E1E1E),
        ),
        textTheme: GoogleFonts.interTextTheme(ThemeData.dark().textTheme),
        useMaterial3: true,
      ),
      initialRoute: '/',
      routes: {
        '/': (context) => const LoginScreen(),
        '/brand_dashboard': (context) => const BrandDashboard(),
        '/creator_dashboard': (context) => const CreatorDashboard(),
      },
    );
  }
}
