
import 'package:supabase_flutter/supabase_flutter.dart';

class AuthService {
  static final AuthService _instance = AuthService._internal();
  factory AuthService() => _instance;
  AuthService._internal();

  final SupabaseClient _client = Supabase.instance.client;

  // Toggle for mock mode
  bool useMock = true;

  User? get currentUser {
    if (useMock) {
      // Return a dummy user if in mock mode
      // We can expand this to return different users based on login if needed
      return const User(
        id: 'mock_user_id', 
        appMetadata: {}, 
        userMetadata: {}, 
        aud: 'authenticated', 
        createdAt: '2023-01-01',
      );
    }
    return _client.auth.currentUser;
  }

  Stream<AuthState> get authStateChanges => _client.auth.onAuthStateChange;

  Future<AuthResponse> signIn({required String email, required String password}) async {
    if (useMock) {
      await Future.delayed(const Duration(seconds: 1)); // Create loading feel
      // Simulate success
      return AuthResponse(
        session: const Session(
          accessToken: 'mock_token', 
          tokenType: 'bearer', 
          user: User(
            id: 'mock_user_id', 
            appMetadata: {}, 
            userMetadata: {}, 
            aud: 'authenticated', 
            createdAt: '2023-01-01'
          )
        ), 
        user: const User(
            id: 'mock_user_id', 
            appMetadata: {}, 
            userMetadata: {}, 
            aud: 'authenticated', 
            createdAt: '2023-01-01'
          )
      );
    }

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
    if (useMock) {
       await Future.delayed(const Duration(seconds: 1));
       return AuthResponse(
        session: const Session(
          accessToken: 'mock_token', 
          tokenType: 'bearer', 
          user: User(
            id: 'mock_user_id', 
            appMetadata: {}, 
            userMetadata: {'name': name, 'user_type': userType}, 
            aud: 'authenticated', 
            createdAt: '2023-01-01'
          )
        ), 
        user: const User(
            id: 'mock_user_id', 
            appMetadata: {}, 
            userMetadata: {'name': name, 'user_type': userType}, 
            aud: 'authenticated', 
            createdAt: '2023-01-01'
        )
      );
    }

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
    if (useMock) {
      return;
    }
    await _client.auth.signOut();
  }
}
