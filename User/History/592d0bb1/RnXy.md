# Tic-Tac-Toe AI Implementation Plan

## Goal
Implement a "vs Cybernet" mode with 3 difficulty levels, alongside the existing 1v1 mode.

## 1. Data Structures
### Enums
-   `GameMode`: `pvp`, `pvAi`
-   `Difficulty`: `easy` (Random), `normal` (Rules), `hard` (Minimax)

### State Updates (`TicTacToeState`)
-   Add `GameMode? gameMode`
-   Add `Difficulty? difficulty`
-   Add `bool isAiThinking` (for UI feedback)

## 2. AI Logic (`TicTacToeAI` Class)
A static helper class or service.
-   `int getBestMove(List<Player?> board, Difficulty difficulty)`
    -   **Easy**: Returns random empty index.
    -   **Normal**:
        1.  Win immediately.
        2.  Block opponent win.
        3.  Take Center (4).
        4.  Take Random Corner (0, 2, 6, 8).
        5.  Random.
    -   **Hard (Minimax)**:
        -   Recursive minimax implementation.
        -   returns index with max score.

## 3. Game Logic Updates (`TicTacToeNotifier`)
-   **Method `startGame(GameMode mode, [Difficulty? diff])`**:
    -   Sets the mode and resets board.
-   **Method `makeMove(int index)`**:
    -   Existing logic for placing X.
    -   **IF** `gameMode == pvAi` AND `currentPlayer == Player.o` (AI turn):
        -   Set `isAiThinking = true`.
        -   `Future.delayed` (simulated thinking time, e.g., 500-1000ms).
        -   Call `TicTacToeAI.getBestMove`.
        -   Execute move.
        -   Set `isAiThinking = false`.

## 4. UI Updates (`TicTacToeGame`)
-   **State Management**:
    -   If `gameMode` is null, show **Mode Selection Screen**.
-   **Mode Selection Screen**:
    -   Button: "1v1 (Human vs Human)"
    -   Button: "VS CYBERNET (AI)"
    -   If "VS CYBERNET" clicked -> Show Difficulty Buttons (Easy, Normal, Hard).
-   **Game Board**:
    -   Show "CYBERNET THINKING..." when `isAiThinking` is true.
