
import 'package:supabase_flutter/supabase_flutter.dart';

class AuthService {
  static final AuthService _instance = AuthService._internal();
  factory AuthService() => _instance;
  AuthService._internal();

  final SupabaseClient _client = Supabase.instance.client;

  User? get currentUser => _client.auth.currentUser;

  Stream<AuthState> get authStateChanges => _client.auth.onAuthStateChange;

  Future<AuthResponse> signIn({required String email, required String password}) async {
    return await _client.auth.signInWithPassword(
      email: email,
      password: password,
    );
  }

  Future<AuthResponse> signUp({
    required String email,
    required String password,
    required String name,
    required String userType, // 'brand' or 'creator'
  }) async {
    return await _client.auth.signUp(
      email: email,
      password: password,
      data: {
        'name': name,
        'user_type': userType,
      },
    );
  }

  Future<void> signOut() async {
    await _client.auth.signOut();
  }
}
