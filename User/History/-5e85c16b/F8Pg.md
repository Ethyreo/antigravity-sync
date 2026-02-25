# Build Brand & Creator Dashboards

## Phase 1: Models, Services & Bridge Logic
- [x] Extend models (`CreatorProfile`, `BrandProfile`, new `Match`, `BrandPreferences`, `CreatorStats`)
- [x] Build `MatchingService` (preference manager, smart query, match manager)
- [x] Build `AnalyticsService` (profile views, hotness score, 7-day mock data)
- [x] Expand `MockDataService` (more creators, mock matches, analytics data)

## Phase 2: Brand Dashboard
- [x] Refactor `BrandDashboard` with bottom nav (Discover | Matches | Settings)
- [x] Wire Star/Thumbs Down to preference engine
- [x] Build `BrandMatchesScreen` (pending/accepted with Contact Now)
- [x] Build `BrandBriefEditor` (Why Us, What We Need, budget filter)

## Phase 3: Creator Dashboard
- [/] Refactor `CreatorDashboard` with bottom nav (Inbox | Profile | Analytics)
- [/] Build `BrandBriefView` (expand opportunity, Slide-to-Accept)
- [/] Build `CreatorAnalyticsScreen` (7-day bar chart, hotness score)
- [/] Build shared widgets (`AnalyticsChart`, `MatchCard`, `SlideToAccept`)
- [ ] Enhance `CreatorEditor` with media grid placeholder

## Verification
- [ ] Run app → test Brand flow (swipe, star, thumbs down, matches)
- [ ] Run app → test Creator flow (inbox, accept/decline, analytics)
- [ ] Test light/dark mode on both dashboards
