enum UserRole { brand, creator }

class CreatorProfile {
  final String id;
  final String name;
  final String bio;
  final List<String> tags;
  final String imageUrl;
  final double minRate;
  final double maxRate;
  final List<String> portfolioImages;

  CreatorProfile({
    required this.id,
    required this.name,
    required this.bio,
    required this.tags,
    required this.imageUrl,
    required this.minRate,
    required this.maxRate,
    required this.portfolioImages,
  });

  // Factory for Supabase JSON
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
    );
  }
}
