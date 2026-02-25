# Security & Optimization Plan

## Goal
Ensure "Bored Games" is secure, tamper-resistant, and compliant with App Store/Play Store guidelines. Addresses user concerns about visible code/comments and potential exploits.

## 1. Code Obfuscation (Mobile)
Mobile apps (Android/iOS) compile to native code, making them inherently harder to read than Web (JS). However, strings and class names can still be reverse-engineered.
-   **Action**: We will enforce obfuscation in our build pipeline.
-   **Command**: `flutter build ipa --obfuscate --split-debug-info=/<project-name>/debug-info` (and equivalent for appbundle).

## 2. Web Security (Current Context)
The "comments" seen in Inspect Element are likely standard HTML comments in `index.html` or unminified JS if not built in strict release mode.
-   **Action**: verify `web/index.html` and remove default Flutter comments.
-   **Action**: Explain that Web Source != Mobile Source.

## 3. Permissions Audit
Unnecessary permissions flag security reviews.
-   **Android (`AndroidManifest.xml`)**: Ensure only `INTERNET` (for ads) is requested. Remove location/camera/etc. if present by default.
-   **iOS (`Info.plist`)**: Verify no usage descriptions for unused hardware.

## 4. Secure Data Storage
Standard `SharedPreferences` is not encrypted. Rooted users can edit high scores.
-   **Action**: Migrate `StorageService` to use `flutter_secure_storage` if sensitive data (like Ad IDs or user tokens) is stored. For simple high scores, we can add a simple checksum hash to prevent trivial editing.
    -   *Strategy*: `hash = sha256(score + "secret_salt")`. Verify hash on load.

## 5. Input Validation
-   Values in Game Logic are currently trusted. We will add boundary checks in the `Notifier` to ensure moves are valid (already done in Tic-Tac-Toe, but will enforce for future games).
