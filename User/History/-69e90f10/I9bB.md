# AI News Feed - implementation_plan.md

## Goal
Build a personal news feed system that aggregates content from YouTube and Websites, processes it using Gemini (Translation, Summarization, Key Points), and presents it in a Tinder-style swipeable iOS application.

## System Architecture
Because web scraping and video transcription/summarization are heavy tasks (and restricted in iOS background modes), we will split this into two parts:

1.  **The "Brain" (Backend/Local Script)**: A Python-based engine.
    *   **Input**: List of YouTube Channels/Keywords, List of Websites.
    *   **Process**: 
        *   Scrape/API fetch.
        *   Extract subtitles or Audio.
        *   Send to **Gemini API** for "Key Points & Summary".
    *   **Output**: A structured JSON feed or Database (Firebase/Supabase) that the App reads.
    
2.  **The "Viewer" (iOS App)**:
    *   **UI**: specific Tinder-like Card Stack.
    *   **Data**: Fetches the processed JSON.
    *   **Features**: Filter by Category (Multi-select), Swipe Left/Right.

## User Review Required
> [!IMPORTANT]
> **API Keys Needed**:
> 1.  **Google Gemini API Key**: For summarizing and extracting insights.
> 2.  **YouTube Data API Key** (Optional but recommended): For reliable video search/metadata.

## Proposed Changes

### Phase 1: The "Brain" (Python)
We will create a `backend/` folder in the project.
#### [NEW] `backend/feeder.py`
The main orchestrator script.
#### [NEW] `backend/processors.py`
Functions to handle:
*   YouTube download/caption extraction (`yt-dlp` or `youtube-transcript-api`).
*   Web scraping (`beautifulsoup4`).
*   Gemini Prompting (`google-generativeai`).

### Phase 2: The "Viewer" (iOS)
#### [NEW] `NewsFeedApp/Models`
Swift structs matching the JSON output from the Brain.
#### [NEW] `NewsFeedApp/Views/CardStackView.swift`
The custom Tinder-like swipeable container.
#### [NEW] `NewsFeedApp/Views/CardView.swift`
The individual card design (Title, Summary, Key Points).

## Verification Plan
1.  **Backend Test**: Run `python backend/feeder.py` and verify it generates a `feed.json` with summarized content from a sample YouTube video.
2.  **UI Test**: Load the `feed.json` into the iOS Simulator and test the swipe gesture responsiveness and filtering logic.
