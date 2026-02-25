# Mock-First Supabase Implementation

We will implement the service layer to support a **Mock Mode**. This allows the app to function fully locally using `MockDataService` data, while keeping the architecture ready for the Supabase switch.

## Architecture

We will introduce a `useMock` flag in our services.

### `SupabaseService` (Updated)
- `bool useMock = true;` (Default to true for now)
- **Methods**:
    - `getCreators()`:
        - If `useMock`: returns `MockDataService.creators`.
        - If `!useMock`: calls `supabase.from('creators')...`
    - `getBrands()`:
        - If `useMock`: returns `MockDataService.brands`.
    - `createMatch()`:
        - If `useMock`: adds to local `MockDataService.matches`.

### `AuthService` (Updated)
- `bool useMock = true;`
- **Methods**:
    - `signIn()`:
        - If `useMock`: accepts any email/password, returns a dummy user.
    - `signUp()`:
        - If `useMock`: returns a dummy user.

## Implementation Steps

1.  **Modify Services**: Update `SupabaseService` and `AuthService` to handle `useMock` logic.
2.  **Wire UI**: Refactor `BrandDashboard` and `CreatorDashboard` to use these services instead of calling `MockDataService` directly.
    - This is the crucial step: The UI will stop knowing about "MockData" and just ask the Service for data.
    - When we want to go live, we just set `useMock = false`.

## Verification
- Run app locally.
- Login with dummy credentials.
- Verify swiping and matching works (data persists in memory session).
