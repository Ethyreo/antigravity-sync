# CreatorMatch Walkthrough

## ✅ Current Status
**Flutter MVP Framework Complete.**
The app is fully functional (with mocked data) and supports both Brand and Creator workflows.

## 🟢 Features Implemented

### 1. Brand Experience
-   **Discovery Feed**: Tinder-style card stack with "Scroll Up" for details.
-   **Actions**: 
    -   Swipe Right: Shortlist (+ Feedback)
    -   Swipe Left: Reject (+ Feedback)
    -   Home Button: Resets the deck.
-   **Settings**: Toggle Dark/Light mode.

### 2. Creator Experience
-   **Dashboard Tabs**: "Requests" and "Profile".
-   **Requests**: View incoming brands, Accept/Decline matches.
-   **Profile Editor**:
    -   Edit Bio & Social Handle.
    -   Select Tags (Chips).
    -   Set Rate Card (Range Slider).

## 🚀 How to Resume Work

To restart the app:
1.  Open terminal.
2.  `cd "Coding Projects/creator_match"`
3.  `flutter run -d chrome`

## 🔮 Next Steps (Phase 2)
1.  **Supabase Integration**: Replace `MockDataService` with real database calls.
2.  **Portfolio Upload**: Implement image picking for the Creator Portfolio.
3.  **Chat**: Enable messaging after a successful match.
