
import 'package:supabase_flutter/supabase_flutter.dart';
import '../models/creator_models.dart';
import 'mock_data.dart';

class SupabaseService {
  static final SupabaseService _instance = SupabaseService._internal();
  factory SupabaseService() => _instance;
  SupabaseService._internal();

  final SupabaseClient _client = Supabase.instance.client;
  
  // Toggle this to switch between Mock and Real data
  bool useMock = true; 

  // ── Brands ────────────────────────────────────────────────
  Future<List<BrandProfile>> getBrands() async {
    if (useMock) {
      // Simulate network delay
      await Future.delayed(const Duration(milliseconds: 500));
      return MockDataService.brands;
    }

    try {
      final response = await _client.from('brands').select();
      final data = response as List<dynamic>;
      return data.map((json) {
        return BrandProfile(
          id: json['id'],
          name: json['name'],
          industry: json['industry'],
          logoUrl: json['avatar_url'] ?? '',
          description: json['description'],
          whyUs: json['why_us'],
          whatWeNeed: json['what_we_need'],
          contactEmail: json['email'],
          contactPhone: '', 
        );
      }).toList();
    } catch (e) {
      print('Error fetching brands: $e');
      return [];
    }
  }

  // ── Creators ──────────────────────────────────────────────
  Future<List<CreatorProfile>> getCreators() async {
    if (useMock) {
      await Future.delayed(const Duration(milliseconds: 800));
      return MockDataService.creators;
    }

    try {
      final response = await _client.from('creators').select();
      final data = response as List<dynamic>;
      return data.map((json) {
        return CreatorProfile(
          id: json['id'],
          name: json['name'],
          bio: json['bio'],
          tags: List<String>.from(json['tags'] ?? []),
          imageUrl: json['avatar_url'] ?? '',
          minRate: json['min_rate'],
          maxRate: json['max_rate'],
          socialHandle: '', 
          portfolioImages: List<String>.from(json['portfolio_images'] ?? []),
        );
      }).toList();
    } catch (e) {
      print('Error fetching creators: $e');
      return [];
    }
  }

  // ── Matches ───────────────────────────────────────────────
  Future<void> createMatch(String brandId, String creatorId) async {
    if (useMock) {
       // In mock mode, we just print or update a local list if we had one for session
       print('Mock Match Created: $brandId -> $creatorId');
       return;
    }

    await _client.from('matches').insert({
      'brand_id': brandId,
      'creator_id': creatorId,
      'status': 'pending',
    });
  }

  Future<List<Match>> getMatchesForBrand(String brandId) async {
    if (useMock) {
       // Return existing mock matches + any dynamically created ones if we tracked them
       return MockDataService.seedMatches().where((m) => m.brandId == brandId).toList();
    }

    final response = await _client
        .from('matches')
        .select()
        .eq('brand_id', brandId);
        
    final data = response as List<dynamic>;
    return data.map((json) => Match(
      id: json['id'],
      brandId: json['brand_id'],
      creatorId: json['creator_id'],
      status: MatchStatus.values.firstWhere((e) => e.name == json['status']),
    )).toList();
  }

  Future<List<Match>> getMatchesForCreator(String creatorId) async {
    if (useMock) {
       return MockDataService.seedMatches().where((m) => m.creatorId == creatorId).toList();
    }

    final response = await _client
        .from('matches')
        .select()
        .eq('creator_id', creatorId);

    final data = response as List<dynamic>;
    return data.map((json) => Match(
      id: json['id'],
      brandId: json['brand_id'],
      creatorId: json['creator_id'],
      status: MatchStatus.values.firstWhere((e) => e.name == json['status']),
    )).toList();
  }

  Future<void> updateMatchStatus(String matchId, MatchStatus status) async {
    if (useMock) {
       print('Mock Update Match: $matchId -> $status');
       return;
    }

    await _client.from('matches').update({
      'status': status.name,
    }).eq('id', matchId);
  }
}
