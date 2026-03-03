# PDF Toolkit Web App

The goal is to consolidate the Python PDF watermarking, splitting, and a new PDF-to-JPEG conversion tool into a single cohesive web interface that runs on `localhost`. Since this is a local Python tool, we will use **Streamlit** to build a modern, interactive web application quickly, and **PyMuPDF** for high-quality image extraction.

## Proposed Changes

### Tech Stack & Dependencies
- **UI Framework:** `streamlit` - A fast, beautiful way to build local Python web interfaces without writing raw HTML/CSS/JS.
- **PDF-to-Image:** `PyMuPDF` (imported as `fitz`) - A robust Python library capable of rendering PDF pages to high-quality JPEG images without requiring system-level dependencies like Poppler.
- **PDF Manipulation:** `pypdf` (already used) - Will continue to be used for watermarking and splitting.

### Project Structure (Python Web App)
We will create a new main entry point file for the web app in `/Users/gurman/Coding Projects/PDF_Watermarker/`.

#### [NEW] `app.py`
The main Streamlit application featuring a sidebar to navigate between three core tools:
1. **Watermarker:** Upload source PDFs and a watermark. Apply the watermark and download a ZIP of the processed files.
2. **Splitter:** Upload a multi-page PDF, split it into single pages, and download them as a ZIP folder.
3. **JPEG Converter:** Upload a multi-page PDF, render every page to a high-quality JPEG, and download all images in a ZIP.

#### [MODIFY] `split_pdf.py` & `watermark.py`
We will wrap the core logic inside these existing scripts into functions that accept input file objects (from the web UI) and return structured outputs (e.g., in-memory ZIP files) rather than just writing directly to the disk, so the web UI can serve them as instant downloads.

#### [NEW] `pdf_to_jpeg.py`
A new script utilizing `fitz` to open a PDF, iterate through its pages, get the pixel map (pixmap), and save it as `.jpg`.

### Core Logic for PDF to JPEG
```python
import fitz  # PyMuPDF
# ...
doc = fitz.open("input.pdf")
for i, page in enumerate(doc):
    pix = page.get_pixmap(dpi=300)  # High resolution
    pix.save(f"page_{i}.jpg")
```

## Verification Plan

### Manual Verification
- We will install `streamlit` and `PyMuPDF` in the terminal using `pip`.
- We will run the app using `streamlit run app.py`, which will automatically open `http://localhost:8501` in the browser.
- Verify we can upload a PDF and successfully convert it to JPEGs and download the result.
