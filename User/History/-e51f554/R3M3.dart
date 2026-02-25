import '../models/creator_models.dart';

class MockDataService {
  // ── 10 Diverse Creators ────────────────────────────────
  static final List<CreatorProfile> creators = [
    CreatorProfile(
      id: 'c1',
      name: 'Alice Wonder',
      bio: 'Fashion & Lifestyle Content Creator. 100k+ followers on IG.',
      tags: ['Fashion', 'Beauty', 'Lifestyle'],
      imageUrl:
          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800',
      minRate: 500,
      maxRate: 1200,
      socialHandle: '@alicewonder',
      portfolioImages: [
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800',
        'https://images.unsplash.com/photo-1529139574466-a302d2d3f524?auto=format&fit=crop&w=800',
      ],
    ),
    CreatorProfile(
      id: 'c2',
      name: 'Tech Guru',
      bio: 'Honest tech reviews and unwrappings. 250k Subs on YT.',
      tags: ['Tech', 'Gadgets', 'Reviews'],
      imageUrl:
          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800',
      minRate: 1500,
      maxRate: 3000,
      socialHandle: '@techguru',
      portfolioImages: [
        'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800',
      ],
    ),
    CreatorProfile(
      id: 'c3',
      name: 'Chef Mike',
      bio: 'Culinary artist sharing easy recipes for home cooks.',
      tags: ['Food', 'Cooking', 'Lifestyle'],
      imageUrl:
          'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800',
      minRate: 300,
      maxRate: 800,
      socialHandle: '@chefmike',
      portfolioImages: [],
    ),
    CreatorProfile(
      id: 'c4',
      name: 'FitFiona',
      bio: 'Certified PT. Workout routines & supplement reviews. 80k IG.',
      tags: ['Fitness', 'Health', 'Lifestyle'],
      imageUrl:
          'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800',
      minRate: 400,
      maxRate: 1000,
      socialHandle: '@fitfiona',
      portfolioImages: [
        'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800',
        'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800',
      ],
    ),
    CreatorProfile(
      id: 'c5',
      name: 'Wanderlust Jay',
      bio: 'Travel vlogger. 30 countries. Cinematic storytelling.',
      tags: ['Travel', 'Lifestyle', 'UGC'],
      imageUrl:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800',
      minRate: 800,
      maxRate: 2500,
      socialHandle: '@wanderlustjay',
      portfolioImages: [
        'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=800',
      ],
    ),
    CreatorProfile(
      id: 'c6',
      name: 'GamerZone',
      bio: 'Twitch streamer. FPS & RPG gameplay. 500k+ community.',
      tags: ['Gaming', 'Tech', 'Entertainment'],
      imageUrl:
          'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800',
      minRate: 600,
      maxRate: 1800,
      socialHandle: '@gamerzone',
      portfolioImages: [],
    ),
    CreatorProfile(
      id: 'c7',
      name: 'Priya Styles',
      bio: 'UGC specialist for D2C brands. Product shoots & reels.',
      tags: ['UGC', 'Fashion', 'Beauty'],
      imageUrl:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800',
      minRate: 200,
      maxRate: 600,
      socialHandle: '@priyastyles',
      portfolioImages: [
        'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&w=800',
        'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?auto=format&fit=crop&w=800',
      ],
    ),
    CreatorProfile(
      id: 'c8',
      name: 'BizTalks Raj',
      bio: 'LinkedIn thought leader. Business & startup content.',
      tags: ['Business', 'Tech', 'Education'],
      imageUrl:
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800',
      minRate: 1000,
      maxRate: 4000,
      socialHandle: '@biztalkraj',
      portfolioImages: [],
    ),
    CreatorProfile(
      id: 'c9',
      name: 'SkinGlow Nia',
      bio: 'Dermatologist-approved skincare routines. 150k TikTok.',
      tags: ['Beauty', 'Health', 'UGC'],
      imageUrl:
          'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=800',
      minRate: 350,
      maxRate: 900,
      socialHandle: '@skinglownia',
      portfolioImages: [
        'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800',
      ],
    ),
    CreatorProfile(
      id: 'c10',
      name: 'AutoMax Dev',
      bio: 'Car reviews, test drives, and auto industry insights.',
      tags: ['Automotive', 'Tech', 'Reviews'],
      imageUrl:
          'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800',
      minRate: 1200,
      maxRate: 3500,
      socialHandle: '@automaxdev',
      portfolioImages: [],
    ),
  ];

  // ── Brands with extended "brief" fields ────────────────
  static final List<BrandProfile> brands = [
    BrandProfile(
      id: 'b1',
      name: 'Urban Sneakers',
      industry: 'Fashion',
      logoUrl: '',
      description: 'Streetwear brand looking for cool, urban content creators.',
      whyUs: 'We are the #1 D2C sneaker brand in India with 2M+ customers.',
      whatWeNeed:
          'Looking for 3 creators to shoot lifestyle reels wearing our new drop.',
      contactEmail: 'collabs@urbansneakers.com',
      contactPhone: '+91 98765 43210',
    ),
    BrandProfile(
      id: 'b2',
      name: 'TechNova',
      industry: 'Electronics',
      logoUrl: '',
      description: 'Launching a new smartwatch. Need unboxing videos.',
      whyUs:
          'Backed by Y Combinator. Our last product had 10M views in launch week.',
      whatWeNeed: 'Unboxing + 7-day review videos for YouTube & Instagram.',
      contactEmail: 'creators@technova.io',
      contactPhone: '+91 91234 56789',
    ),
    BrandProfile(
      id: 'b3',
      name: 'GlowUp Skincare',
      industry: 'Beauty',
      logoUrl: '',
      description: 'Clean beauty brand seeking authentic UGC content.',
      whyUs: 'Dermatologist-tested products. Featured in Vogue India.',
      whatWeNeed: 'Before/after skincare routine reels. Authentic, no filters.',
      contactEmail: 'partnerships@glowup.co',
      contactPhone: '+91 87654 32100',
    ),
    BrandProfile(
      id: 'b4',
      name: 'FitFuel',
      industry: 'Health & Fitness',
      logoUrl: '',
      description: 'Protein supplements for the modern fitness enthusiast.',
      whyUs: 'NSF certified. Used by 50+ professional athletes.',
      whatWeNeed:
          'Gym workout content featuring our shaker & protein powder.',
      contactEmail: 'team@fitfuel.in',
      contactPhone: '+91 77777 88888',
    ),
  ];

  // ── Mock incoming requests (for Creator inbox) ─────────
  static final List<BrandProfile> incomingRequests =
      List.from(brands); // All brands as potential requests

  // ── Pre-seeded matches ─────────────────────────────────
  static List<Match> seedMatches() {
    return [
      Match(
        id: 'm1',
        brandId: 'b1',
        creatorId: 'c1',
        status: MatchStatus.pending,
      ),
      Match(
        id: 'm2',
        brandId: 'b2',
        creatorId: 'c2',
        status: MatchStatus.accepted,
      ),
      Match(
        id: 'm3',
        brandId: 'b3',
        creatorId: 'c1',
        status: MatchStatus.pending,
      ),
      Match(
        id: 'm4',
        brandId: 'b1',
        creatorId: 'c7',
        status: MatchStatus.pending,
      ),
      Match(
        id: 'm5',
        brandId: 'b4',
        creatorId: 'c4',
        status: MatchStatus.accepted,
      ),
    ];
  }
}
