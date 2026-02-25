# Brand & Creator Dashboard Features

Build the full intelligence layer (Brand), management layer (Creator), and bridge logic (Smart Matching) — all with local mock data first, ready for Supabase later.

## User Review Required

> [!IMPORTANT]
> **Scope Decision**: This is a large feature set. I propose building it in **3 phases** below. All logic will use local state + mock data (no Supabase yet). Supabase integration can be wired in as a follow-up.

> [!WARNING]
> **Breaking Changes**: The existing `creator_models.dart`, `mock_data.dart`, `brand_dashboard.dart`, and `creator_dashboard.dart` will be significantly rewritten. The models need new fields (excluded tags, preference weights, match status, analytics, etc.).

---

## Phase 1: Models, Services & Brand Dashboard Intelligence

### Models Layer
#### [MODIFY] [creator_models.dart](file:///Users/gurman/Coding%20Projects/brand-creator-app/lib/models/creator_models.dart)
- Add `Match` model with `id`, `brandId`, `creatorId`, `status` (pending/accepted/declined), `timestamp`
- Add `BrandPreferences` model with `tagWeights` map, `excludedTags` list, `minBudget`, `maxBudget`
- Add `CreatorStats` model with `profileViews`, `rightSwipes`, `totalViews`, `hotnessScore`, `weeklyViews` (7-day array)
- Extend `BrandProfile` with `whyUs`, `whatWeNeed`, `contactEmail`, `contactPhone` fields
- Extend `CreatorProfile` with `socialHandle`, `portfolioVideos` list

### Services Layer
#### [NEW] [matching_service.dart](file:///Users/gurman/Coding%20Projects/brand-creator-app/lib/services/matching_service.dart)
- `BrandPreferenceManager`: manages `tagWeights` and `excludedTags` in memory
  - `handleStar(creatorTags)`: multiplies weight by 1.40
  - `handleThumbsDown(tag)`: adds tag to `excludedTags`
- `SmartMatchingQuery`: the bridge logic
  - Filters by budget range, excluded tags
  - Sorts by `preferenceWeight × random()` 
  - Returns top 20 creators
- `MatchManager`: manages match state
  - `createMatch(brandId, creatorId)` → status = pending
  - `acceptMatch(matchId)` / `declineMatch(matchId)`
  - `getPendingMatches(creatorId)` → filtered list
  - `getAcceptedMatches(brandId)` → list with contact info unlocked

#### [NEW] [analytics_service.dart](file:///Users/gurman/Coding%20Projects/brand-creator-app/lib/services/analytics_service.dart)
- `CreatorAnalyticsService`
  - `recordProfileView(creatorId)`
  - `getStats(creatorId)` → `CreatorStats`
  - `calculateHotnessScore()` → `rightSwipes / totalViews`
  - Mock 7-day data for bar chart

#### [MODIFY] [mock_data.dart](file:///Users/gurman/Coding%20Projects/brand-creator-app/lib/services/mock_data.dart)
- Expand to 8-10 creators with diverse tags
- Add mock matches (pending, accepted)
- Add mock brand preferences
- Add mock analytics data

---

## Phase 2: Brand Dashboard (Intelligence Layer)

### Brand Dashboard Screens
#### [MODIFY] [brand_dashboard.dart](file:///Users/gurman/Coding%20Projects/brand-creator-app/lib/screens/brand_dashboard.dart)
- Add bottom nav: **Discover** (cards) | **Matches** | **Settings**
- Wire Star button → `handleStar()` with 1.40× weight boost
- Wire Thumbs Down → `handleThumbsDown()` adding tag to exclusion
- Right swipe → creates a pending match
- Use `SmartMatchingQuery` to load/reorder card stack
- Track current card index for button actions

#### [NEW] [brand_matches_screen.dart](file:///Users/gurman/Coding%20Projects/brand-creator-app/lib/screens/brand_matches_screen.dart)
- **Pending** section: list of creators who haven't responded yet
- **Accepted** section: creators who accepted → show "Contact Now" button (WhatsApp/Email link)
- Match card shows creator thumbnail, name, tags, status badge

#### [NEW] [brand_brief_editor.dart](file:///Users/gurman/Coding%20Projects/brand-creator-app/lib/screens/brand_brief_editor.dart)
- Edit "Why Us" and "What We Need" fields
- Set budget filter (min/max slider)
- These values feed into the smart matching query

---

## Phase 3: Creator Dashboard (Management Layer)

### Creator Dashboard Screens
#### [MODIFY] [creator_dashboard.dart](file:///Users/gurman/Coding%20Projects/brand-creator-app/lib/screens/creator_dashboard.dart)
- Add bottom nav: **Inbox** | **Profile** | **Analytics**
- Inbox = opportunity cards (pending matches from brands)

#### [MODIFY] [creator_editor.dart](file:///Users/gurman/Coding%20Projects/brand-creator-app/lib/screens/creator_editor.dart)
- Add media grid uploader (images only for MVP; mock with placeholder grid)
- Keep tag selector and rate card slider (already exist)
- Add social handle field (already exists)

#### [NEW] [brand_brief_view.dart](file:///Users/gurman/Coding%20Projects/brand-creator-app/lib/screens/brand_brief_view.dart)
- Expand view when creator taps an opportunity card
- Shows brand's "Why Us", "What We Need", budget range
- Slide-to-Accept / Tap-to-Decline actions
- On accept → status changes to `accepted`, brand gets notified (snackbar for now)

#### [NEW] [creator_analytics_screen.dart](file:///Users/gurman/Coding%20Projects/brand-creator-app/lib/screens/creator_analytics_screen.dart)
- 7-day bar chart of profile views (using custom painted bars, no extra dependency)
- "Hotness Score" card: `(rightSwipes / totalViews) × 100`%
- Total matches, acceptance rate stats

### Widgets
#### [NEW] [analytics_chart.dart](file:///Users/gurman/Coding%20Projects/brand-creator-app/lib/widgets/analytics_chart.dart)
- Custom `CustomPainter` bar chart widget for 7-day views
- Animated bars with labels

#### [NEW] [match_card.dart](file:///Users/gurman/Coding%20Projects/brand-creator-app/lib/widgets/match_card.dart)
- Reusable card for both brand and creator match lists
- Shows avatar, name, status badge, action buttons

#### [NEW] [slide_to_accept.dart](file:///Users/gurman/Coding%20Projects/brand-creator-app/lib/widgets/slide_to_accept.dart)
- Swipeable "Slide to Accept" widget for creator inbox

---

## Verification Plan

### Automated Tests
```bash
cd "/Users/gurman/Coding Projects/brand-creator-app" && flutter pub get && flutter run -d chrome
```

### Manual Verification
- Login as Brand → swipe cards → verify Star boosts weights, Thumbs Down excludes tags
- Check Matches tab shows pending/accepted states
- Login as Creator → check Inbox shows pending brand requests
- Accept a match → verify it appears as "Contact Now" on brand side
- Check Analytics tab shows bar chart and hotness score
- Toggle light/dark mode on both dashboards
