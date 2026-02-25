# CreatorMatch Implementation Plan (Flutter + Supabase)

## User Review Required
> [!IMPORTANT]
> **Pivot to Flutter**: Switched from Next.js to Flutter for native iOS/Android support.
> **Supabase**: Will provide code for Supabase setup (Schema/tables), but I cannot run cloud infrastructure commands. You will need to create the project in the Supabase dashboard.
> **Prerequisites**: Ensure you have the Flutter SDK installed on your machine.

## Proposed Changes
### Project Structure
- **Framework**: Flutter (Dart)
- **Backend**: Supabase (Auth, Database, Storage)
- **Architecture**: Modular (MVVM-ish)
    - `lib/models/`: Data classes (User, Brand, Creator, Request)
    - `lib/screens/`: UI Screens (Login, Discovery, Profile, Dashboard)
    - `lib/services/`: Supabase client, Auth logic, Recommendation engine
    - `lib/widgets/`: Reusable components (SwipeCard, AdaptiveButtons)

### Core Features
#### Authentication & Onboarding
- Role Selection (Brand vs Creator) on Login.
- Creator Profile Editor (Tags, Price, Media).

#### Discovery Feed (Brand)
- **Swipe Logic**: `Draggable` widgets or `flutter_card_swiper` package.
- **Scroll-Up Interaction**: `GestureDetector` handling vertical drags to show `BottomSheet`.
- **Recommendation Engine**: Local logic to re-sort the feed based on weighted tags.

#### Dashboard
- **Creator**: Pending Requests view.
- **Brand**: Shortlisted Creators.

## Verification Plan
### Manual Verification
- Run `flutter run -d chrome` (or simulator) to verify UI.
- Test Swipe Left/Right triggers database inserts.
- Test "Star" increases tag weight in the session.
