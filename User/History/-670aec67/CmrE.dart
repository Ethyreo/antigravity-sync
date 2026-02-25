import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'services/theme_service.dart';
import 'screens/login_screen.dart';
import 'screens/brand_dashboard.dart';
import 'screens/creator_dashboard.dart';

void main() {
  runApp(
    ChangeNotifierProvider(
      create: (_) => ThemeService(),
      child: const CreatorMatchApp(),
    ),
  );
}

class CreatorMatchApp extends StatelessWidget {
  const CreatorMatchApp({super.key});

  @override
  Widget build(BuildContext context) {
    final themeService = Provider.of<ThemeService>(context);
    
    return MaterialApp(
      title: 'CreatorMatch',
      debugShowCheckedModeBanner: false,
      themeMode: themeService.themeMode,
      theme: ThemeData(
        brightness: Brightness.light,
        primaryColor: const Color(0xFF007AFF),
        scaffoldBackgroundColor: Colors.white,
        colorScheme: const ColorScheme.light(
          primary: Color(0xFF007AFF),
          secondary: Color(0xFF00C7BE),
          surface: Colors.white,
        ),
        useMaterial3: true,
        textTheme: GoogleFonts.interTextTheme(ThemeData.light().textTheme),
        appBarTheme: const AppBarTheme(
          backgroundColor: Colors.white,
          foregroundColor: Colors.black,
          elevation: 0,
        ),
      ),
      darkTheme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: const Color(0xFF121212),
        primaryColor: const Color(0xFF007AFF),
        colorScheme: const ColorScheme.dark(
          primary: Color(0xFF007AFF),
          secondary: Color(0xFF00C7BE),
          surface: Color(0xFF1E1E1E),
        ),
        useMaterial3: true,
        textTheme: GoogleFonts.interTextTheme(ThemeData.dark().textTheme),
        appBarTheme: const AppBarTheme(
          backgroundColor: Color(0xFF121212),
          foregroundColor: Colors.white,
          elevation: 0,
        ),
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
