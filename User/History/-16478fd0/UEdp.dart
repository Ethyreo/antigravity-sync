
import 'package:flutter/material.dart';
import '../services/auth_service.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final AuthService _authService = AuthService();
  bool _isLoading = false;

  Future<void> _handleLogin(String userType) async {
    setState(() => _isLoading = true);

    try {
      // Mock login - we don't care about email/pass for now in mock mode
      await _authService.signIn(
        email: '$userType@test.com', 
        password: 'password'
      );

      if (!mounted) return;

      if (userType == 'brand') {
        Navigator.pushReplacementNamed(context, '/brand_dashboard');
      } else {
        Navigator.pushReplacementNamed(context, '/creator_dashboard');
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Login failed: $e')),
      );
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Text(
                'CreatorMatch',
                style: TextStyle(
                  fontSize: 32,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
              const SizedBox(height: 10),
              const Text(
                'Find your perfect partnership',
                style: TextStyle(color: Colors.grey),
              ),
              const SizedBox(height: 50),
              
              if (_isLoading)
                const CircularProgressIndicator()
              else ...[
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Theme.of(context).primaryColor,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                    ),
                    onPressed: () => _handleLogin('brand'),
                    child: const Text('I am a Brand', style: TextStyle(color: Colors.white)),
                  ),
                ),
                const SizedBox(height: 16),
                SizedBox(
                  width: double.infinity,
                  child: OutlinedButton(
                    style: OutlinedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      side: const BorderSide(color: Colors.white24),
                    ),
                    onPressed: () => _handleLogin('creator'),
                    child: const Text('I am a Creator', style: TextStyle(color: Colors.white)),
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
