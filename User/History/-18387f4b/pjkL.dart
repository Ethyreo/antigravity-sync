
import 'package:supabase_flutter/supabase_flutter.dart';
import '../models/creator_models.dart';

class SupabaseService {
  static final SupabaseService _instance = SupabaseService._internal();
  factory SupabaseService() => _instance;
  SupabaseService._internal();

  final SupabaseClient _client = Supabase.instance.client;

  // ── Brands ────────────────────────────────────────────────
  Future<List<BrandProfile>> getBrands() async {
    final response = await _client.from('brands').select();
    final data = response as List<dynamic>;
    return data.map((json) {
      // Assuming 'profiles' join or flat structure. 
      // For MVP we might have all data in 'brands' view or table.
      // Adjusting based on schema plan: brands extends profiles.
      // So we might need to join with profiles if they are separate tables, 
      // or if 'brands' is a view.
      // For simplicity in MVP let's assume 'brands' view contains all necessary fields.
      return BrandProfile(
        id: json['id'],
        name: json['name'],
        industry: json['industry'],
        logoUrl: json['avatar_url'] ?? '',
        description: json['description'],
        whyUs: json['why_us'],
        whatWeNeed: json['what_we_need'],
        contactEmail: json['email'],
        contactPhone: '', // Start with empty or add to schema if needed
      );
    }).toList();
  }

  // ── Creators ──────────────────────────────────────────────
  Future<List<CreatorProfile>> getCreators() async {
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
        socialHandle: '', // Add to schema if needed
        portfolioImages: List<String>.from(json['portfolio_images'] ?? []),
      );
    }).toList();
  }

  // ── Matches ───────────────────────────────────────────────
  Future<void> createMatch(String brandId, String creatorId) async {
    await _client.from('matches').insert({
      'brand_id': brandId,
      'creator_id': creatorId,
      'status': 'pending',
    });
  }

  Future<List<Match>> getMatchesForBrand(String brandId) async {
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
    await _client.from('matches').update({
      'status': status.name,
    }).eq('id', matchId);
  }
}
