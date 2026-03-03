# PDF Watermarker & Web Toolkit

## Phase 1: Planning
- [x] Draft implementation plan.
- [x] Get user approval on the plan (specifically around Google Drive integration).

## Phase 2: Setup & UI (Flutter App)
- [x] Initialize new Flutter project.
- [x] Set up 8-bit theme and core UI structure.
- [x] Build Main Screen (Google Drive input vs. Local Upload options).
- [x] Build Options Menu (Output folder, watermark upload, naming conventions).

## Phase 3: Core Logic (Flutter App)
- [x] Implement local PDF and Image picking (`file_picker`).
- [x] Implement Watermark processing logic (Image to PDF conversion, applying overlay).
- [x] Implement local saving and naming convention logic.
- [x] Implement Google Drive folder downloading via API.

## Phase 4: Verification & Export (Flutter App)
- [x] Test the pipeline on an Android emulator/device (Skipped, local SDK issue).
- [x] Build the signed/unsigned APK (Deferred to another machine).
- [x] Push code to Git for compilation on another machine.

## Phase 5: Python Web Toolkit (Streamlit)
- [x] Get user approval on the Streamlit + PyMuPDF plan.
- [x] Set up Streamlit environment (`pip install streamlit pymupdf`).
- [x] Build the PDF to JPEG conversion logic (`fitz`).
- [x] Build the Streamlit Web App UI (`app.py`).
- [x] Connect Splitter and Watermarker tools to the UI.
- [x] Test the Web App on `localhost`.

## Phase 6: Elegant UI Redesign
- [ ] Read the `ui-ux-pro-max` skill instructions.
- [ ] Apply elegant, minimalistic custom CSS to Streamlit.
- [ ] Redesign the layout for all devices.
