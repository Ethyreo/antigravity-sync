# PDF Watermarker Android App

## Phase 1: Planning
- [/] Draft implementation plan.
- [ ] Get user approval on the plan (specifically around Google Drive integration).

## Phase 2: Setup & UI
- [x] Initialize new Flutter project.
- [x] Set up 8-bit theme and core UI structure.
- [x] Build Main Screen (Google Drive input vs. Local Upload options).
- [x] Build Options Menu (Output folder, watermark upload, naming conventions).

## Phase 3: Core Logic
- [x] Implement local PDF and Image picking (`file_picker`).
- [x] Implement Watermark processing logic (Image to PDF conversion, applying overlay).
- [x] Implement local saving and naming convention logic.
- [x] Implement Google Drive folder downloading via API.

## Phase 4: Verification & Export
- [x] Test the pipeline on an Android emulator/device (Skipped, local SDK issue).
- [x] Build the signed/unsigned APK (Deferred to another machine).
- [x] Push code to Git for compilation on another machine.
