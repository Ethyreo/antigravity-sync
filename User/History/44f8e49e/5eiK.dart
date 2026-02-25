enum UserRole { brand, creator }

enum MatchStatus { pending, accepted, declined }

// ─── Brand ───────────────────────────────────────────────
class BrandProfile {
  final String id;
  final String name;
  final String industry;
  final String logoUrl;
  final String description;
  final String whyUs;
  final String whatWeNeed;
  final String contactEmail;
  final String contactPhone;

  BrandProfile({
    required this.id,
    required this.name,
    required this.industry,
    required this.logoUrl,
    required this.description,
    this.whyUs = '',
    this.whatWeNeed = '',
    this.contactEmail = '',
    this.contactPhone = '',
  });
}

// ─── Creator ─────────────────────────────────────────────
class CreatorProfile {
  final String id;
  final String name;
  final String bio;
  final List<String> tags;
  final String imageUrl;
  final double minRate;
  final double maxRate;
  final List<String> portfolioImages;
  final List<String> portfolioVideos;
  final String socialHandle;

  CreatorProfile({
    required this.id,
    required this.name,
    required this.bio,
    required this.tags,
    required this.imageUrl,
    required this.minRate,
    required this.maxRate,
    required this.portfolioImages,
    this.portfolioVideos = const [],
    this.socialHandle = '',
  });

  factory CreatorProfile.fromJson(Map<String, dynamic> json) {
    return CreatorProfile(
      id: json['id'],
      name: json['name'],
      bio: json['bio'],
      tags: List<String>.from(json['tags']),
      imageUrl: json['image_url'],
      minRate: (json['min_rate'] as num).toDouble(),
      maxRate: (json['max_rate'] as num).toDouble(),
      portfolioImages: List<String>.from(json['portfolio_images'] ?? []),
      portfolioVideos: List<String>.from(json['portfolio_videos'] ?? []),
      socialHandle: json['social_handle'] ?? '',
    );
  }
}

// ─── Match ───────────────────────────────────────────────
class Match {
  final String id;
  final String brandId;
  final String creatorId;
  MatchStatus status;
  final DateTime timestamp;

  Match({
    required this.id,
    required this.brandId,
    required this.creatorId,
    this.status = MatchStatus.pending,
    DateTime? timestamp,
  }) : timestamp = timestamp ?? DateTime.now();
}

// ─── Brand Preferences (for the intelligence layer) ─────
class BrandPreferences {
  final Map<String, double> tagWeights;
  final List<String> excludedTags;
  double minBudget;
  double maxBudget;

  BrandPreferences({
    Map<String, double>? tagWeights,
    List<String>? excludedTags,
    this.minBudget = 0,
    this.maxBudget = 10000,
  })  : tagWeights = tagWeights ?? {},
        excludedTags = excludedTags ?? [];
}

// ─── Creator Stats (for analytics) ──────────────────────
class CreatorStats {
  final String creatorId;
  final List<int> weeklyViews; // 7 entries, Mon→Sun
  final int totalViews;
  final int rightSwipes;
  final int totalMatches;
  final int acceptedMatches;

  CreatorStats({
    required this.creatorId,
    required this.weeklyViews,
    required this.totalViews,
    required this.rightSwipes,
    this.totalMatches = 0,
    this.acceptedMatches = 0,
  });

  double get hotnessScore =>
      totalViews == 0 ? 0 : (rightSwipes / totalViews) * 100;

  double get acceptanceRate =>
      totalMatches == 0 ? 0 : (acceptedMatches / totalMatches) * 100;
}
