# Brand-Creator Discovery App Implementation Plan

## User Review Required
> [!IMPORTANT]
> **Tech Stack Decision**: I strongly recommend **Next.js (React) + PWA** for rapid prototyping and cross-platform compatibility in this environment. If a native mobile app is strictly required, we can switch to **React Native (Expo)**, but previewing will be harder.
> **Backend Decision**: Should we use **Supabase** for real-time requests/auth, or **Mock Data** for a frontend-only demo?

## Proposed Changes
### Project Structure
- **Frontend**: Next.js 14 (App Router), Tailwind CSS, Framer Motion (for gestures).
- **State Management**: Zustand (for local state/mock data).
- **Icons**: Lucide React.
- **Components**: Shadcn UI (for accessible primitives).

### Core Features
#### Discovery Feed
- `Deck.tsx`: Handles the stack of cards and swipe logic.
- `Card.tsx`: Displays Creator profile. expanded view with `AnimatePresence`.
- `RecommendationEngine.ts`: Utility to filter/sort creators based on interaction history.

#### Onboarding
- `OnboardingWizard.tsx`: Multi-step form for Creators (Bio -> Tags -> Rates -> Media).
- `BrandSetup.tsx`: Simple profile creation for Brands.

#### Dashboard
- `RequestsTable.tsx`: For Brands to see shortlisted creators.
- `PendingInvites.tsx`: For Creators to accept/decline.

## Verification Plan
### Automated Tests
- Unit tests for the Recommendation Algorithm (checking 40% weight increase).
### Manual Verification
- Verify Swipe Left/Right updates the "Requests" state.
- Verify "Star" interaction boosts similar tags in subsequent cards.
- Verify "Thumbs Down" removes tags from the pool.
