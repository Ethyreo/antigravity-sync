import '../models/creator_models.dart';

class MockDataService {
  static final List<CreatorProfile> creators = [
    CreatorProfile(
      id: '1',
      name: 'Alice Wonder',
      bio: 'Fashion & Lifestyle Content Creator. 100k+ followers on IG.',
      tags: ['Fashion', 'Beauty', 'Lifestyle'],
      imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800',
      minRate: 500,
      maxRate: 1200,
      portfolioImages: [
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800',
        'https://images.unsplash.com/photo-1529139574466-a302d2d3f524?auto=format&fit=crop&w=800',
      ],
    ),
    CreatorProfile(
      id: '2',
      name: 'Tech Guru',
      bio: 'Honest tech reviews and unwrappings. 250k Subs on YT.',
      tags: ['Tech', 'Gadgets', 'Reviews'],
      imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800',
      minRate: 1500,
      maxRate: 3000,
      portfolioImages: [
        'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=800',
      ],
    ),
    CreatorProfile(
      id: '3',
      name: 'Chef Mike',
      bio: 'Culinary artist sharing easy recipes for home cooks.',
      tags: ['Food', 'Cooking', 'Lifestyle'],
      imageUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800',
      minRate: 300,
      maxRate: 800,
      portfolioImages: [],
    ),
  ];
}
