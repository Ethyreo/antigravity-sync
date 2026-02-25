# CreatorMatch (Flutter MVP)

This is a cross-platform mobile app built with Flutter, designed for Brands to discover Creators using a Tinder-style swipe interface.

## 🚀 Getting Started

Since this project was generated in an environment without the Flutter SDK, follow these steps to "hydrate" the project and run it on your machine.

### Prerequisites

1.  **Install Flutter SDK**: [Official Guide](https://docs.flutter.dev/get-started/install)
2.  **Verify Installation**: Run `flutter doctor` in your terminal.

### Setup Instructions

1.  **Navigate directly into the project folder**:
    ```bash
    cd "Coding Projects/creator_match"
    ```

2.  **Generate Native Files**:
    This is critical. Run this command to generate the `android`, `ios`, `linux`, `macos`, and `web` directories:
    ```bash
    flutter create .
    ```

3.  **Install Dependencies**:
    ```bash
    flutter pub get
    ```

4.  **Run the App**:
    -   **Web (Chrome)**: `flutter run -d chrome`
    -   **iOS Simulator**: `open -a Simulator` then `flutter run`
    -   **Android Emulator**: Launch via Android Studio then `flutter run`

## 📱 Features

-   **Role Selection**: Brand vs Creator login.
-   **Discovery Feed**: Swipe Right to Shortlist, Left to Reject.
-   **Weighted Recommendations**: 'Star' interaction boosts similar categories by 40%.
-   **Detailed View**: Scroll up (or tap) on a card to view the Creator's specific portfolio and rates.
-   **Dark Mode**: Premium "AdTech" aesthetic.

## 🛠 Tech Stack

-   **Framework**: Flutter (Dart)
-   **Backend**: Supabase (Mocked for Demo in `services/mock_data.dart`)
-   **State Management**: `setState` (Local) / Provider (Ready)
-   **UI Library**: `flutter_card_swiper`, `google_fonts`
