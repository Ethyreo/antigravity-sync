# Mock Mode Walkthrough

The app is now configured to run in **Mock Mode** by default. This allows you to test the full flow without connecting to Supabase.

## How to Run
1.  Run the app normally: `flutter run`
2.  On the login screen, choose "I am a Brand" or "I am a Creator".
    - No real credentials needed; the app simulates a successful login.

## Features to Test

### 1. Brand Flow
- **Discover**: Swipe right/left on creators.
    - Swiping right creates a "match".
- **Matches**: Go to the "Matches" tab.
    - You will see the creators you swiped right on in the "Pending" tab.
- **Brief**: The "Brief" tab is a UI mock (doesn't save to DB yet).

### 2. Creator Flow
- **Inbox**: Go to the "Inbox" tab.
    - You should see incoming requests (seeded from mock data + any you created as a brand).
- **Accept/Decline**:
    - **Accept**: Moves the match to "Accepted" status.
    - **Decline**: Removes it from the list.

### 3. Data Persistence
- **Session Only**: In Mock Mode, data (like matches) is stored in memory.
- **Restarting the App**: Will reset the data to the initial seed state.

## Switching to Real Backend
To switch to the real Supabase backend later:
1.  Open `lib/services/supabase_service.dart`.
2.  Set `bool useMock = false;`.
3.  Open `lib/services/auth_service.dart`.
4.  Set `bool useMock = false;`.
5.  Ensure `.env` has valid credentials.
