# Supabase Integration Plan

This plan outlines the steps to transition the CreatorMatch app from mock data to a live Supabase backend.

## User Review Required

> [!IMPORTANT]
> **Supabase Credentials Needed**: I need the `SUPABASE_URL` and `SUPABASE_ANON_KEY` to initialize the client. Please provide these or set them in a `.env` file (I can help create one).

> [!NOTE]
> **Database Schema**: I will propose a schema below. Please review it to ensure it matches your data requirements.

## Proposed Changes

### 1. Dependencies & Configuration
- **Add `flutter_dotenv`**: To manage environment variables securely.
- **Initialize Supabase**: Update `lib/main.dart` to initialize Supabase before `runApp`.

### 2. Database Schema (SQL)
I recommend the following schema for the MVP:

- `profiles` (extends `auth.users`)
    - `id` (uuid, PK, references `auth.users.id`)
    - `user_type` (text: 'brand' or 'creator')
    - `name` (text)
    - `email` (text)
    - `avatar_url` (text)
    - `created_at` (timestamptz)

- `creators` (extends `profiles`)
    - `id` (uuid, PK, references `profiles.id`)
    - `bio` (text)
    - `tags` (text[])
    - `min_rate` (int)
    - `max_rate` (int)
    - `portfolio_images` (text[])

- `brands` (extends `profiles`)
    - `id` (uuid, PK, references `profiles.id`)
    - `industry` (text)
    - `description` (text)
    - `why_us` (text)
    - `what_we_need` (text)

- `matches`
    - `id` (uuid, PK)
    - `brand_id` (uuid, references `brands.id`)
    - `creator_id` (uuid, references `creators.id`)
    - `status` (text: 'pending', 'accepted', 'declined')
    - `created_at` (timestamptz)

### 3. Authentication Service
#### [NEW] `lib/services/auth_service.dart`
- Implement `AuthService` class.
- Methods: `signIn`, `signUp`, `signOut`, `getCurrentUser`.
- Handle user type (Brand vs Creator) during sign-up.

### 4. Data Service
#### [NEW] `lib/services/supabase_service.dart`
- Implement `SupabaseService` class to replace `MockDataService`.
- Methods:
    - `getCreators()`: Fetch creators (with optional filters).
    - `getBrandProfile(id)`: Fetch brand details.
    - `createMatch(brandId, creatorId)`: Insert into `matches`.
    - `getMatches(userId)`: Fetch matches for a brand or creator.

### 5. UI Integration
#### [MODIFY] `lib/screens/login_screen.dart`
- Replace dummy login with `AuthService` calls.

#### [MODIFY] `lib/screens/brand_dashboard.dart`
- Replace `MockDataService.creators` with `SupabaseService.getCreators()`.
- Wrap the card stack in a `FutureBuilder` or `StreamBuilder`.

#### [MODIFY] `lib/screens/creator_dashboard.dart`
- Fetch real incoming requests using `SupabaseService`.

## Verification Plan

### Automated Tests
- Since we are relying on an external backend, unit tests will mock the `SupabaseClient`.
- I will create a test to verify `AuthService` handles session persistence correctly.

### Manual Verification
1. **Sign Up Flow**: Create a new Brand account and a new Creator account. Verify they appear in the `profiles` table.
2. **Matching**: Log in as a Brand, swipe right on a Creator. Log in as that Creator, verify the request appears in the Inbox.
3. **Accept/Decline**: Accept the request as Creator. Verify usage in Brand's "Matches" tab.
