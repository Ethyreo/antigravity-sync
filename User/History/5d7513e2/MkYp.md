# PDF Watermarker Android App

The goal is to build an Android application with a minimalistic "8-bit" theme that can batch watermark PDF files, either from local storage or from a public Google Drive folder link.

## User Review Required
> [!WARNING]
> **Google Drive Folder Parsing:**
> In our Python script, we had to use a Browser agent to physically scroll the page and scrape the 176 file IDs because Google Drive limits unauthenticated folder downloads. 
> In a native Android app, we cannot easily run a headless browser to scrape links. We have a few options for the Google Drive feature:
> 1. **Google Sign-In + Drive API:** The app asks you to log in with your Google account. It then uses the official Drive API to list and download files from the provided folder link. (Recommended for stability and bypassing limits).
> 2. **Basic Scraping (Fragile):** We attempt to make an HTTP request to the folder URL and scrape the HTML for file IDs. This will likely break if the folder has more than 50 files (just like `gdown` did), as Google dynamically loads the rest.
> 
> *Please let me know if you are okay with adding Google Sign-in to authorize the app to read your Drive files!*

## Proposed Changes

### Tech Stack & Project Setup
We will use **Flutter** to build this application. Flutter allows us to build a beautiful, custom 8-bit UI while leveraging powerful Dart packages for file system access and PDF manipulation, and easily compiling to an Android APK.

#### [NEW] `/Users/gurman/Coding Projects/PDF_Watermarker_App/`
I will initialize a new Flutter project here.

### Dependencies
- `file_picker`: To allow the user to select local PDFs and the watermark Image/PDF.
- `syncfusion_flutter_pdf`: A robust library for manipulating PDFs. We will use this to read the source PDFs, draw the watermark image/PDF over every page, and save the result.
- `shared_preferences`: To save the user's selected output folder and naming convention preferences.
- `http`: For downloading files.
- `google_sign_in` & `googleapis`: (If approved) to handle Google Drive folder reading.

### UI / UX Design (8-bit Theme)
- Use a pixel-art style font (e.g., 'Press Start 2P' from Google Fonts).
- Use blocky, high-contrast UI elements, retro colors, and CRT-style scanline effects if possible.
- **Main Screen:** Two main large buttons: "Drop GDrive Link" and "Select Local PDFs".
- **Options Screen:** 
  - Watermark selector (Upload Image or PDF).
  - Output Folder selector.
  - Advanced Naming Convention toggles (Append text: `[OriginalName]_Watermarked.pdf` or Sequential: `File_001.pdf`).

### Core Logic
1. **Watermark Processing:** If the user uploads an image, the app will dynamically reduce its opacity (to ~25%) and convert it to a PDF page stream to be used as an overlay.
2. **Batch Processor:** A background isolate or standard async loop that iterates through the selected files, applies the watermark using `syncfusion_flutter_pdf`, applies the naming convention, and saves to the output directory.

## Verification Plan

### Automated Tests
- I will write unit tests for the naming convention logic and the Google Drive URL parsing logic.

### Manual Verification
- We will run the app locally using your Mac (via macOS desktop build or Android emulator if available) to ensure the UI looks perfectly 8-bit and the local file processing works.
- Finally, I will run `flutter build apk` to generate the `.apk` file you can side-load onto your Android device.
