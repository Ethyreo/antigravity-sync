import fitz
import io
import zipfile

def convert_pdf_to_images(pdf_file_bytes):
    """
    Receives bytes of a PDF.
    Returns bytes of a ZIP file containing high-resolution JPEGs of each page.
    """
    # Open the PDF directly from memory
    doc = fitz.open("pdf", pdf_file_bytes)
    
    zip_buffer = io.BytesIO()
    with zipfile.ZipFile(zip_buffer, "a", zipfile.ZIP_DEFLATED) as zip_file:
        for i, page in enumerate(doc):
            # Render the page to an image pixmap (300 DPI)
            pix = page.get_pixmap(dpi=300)
            
            # Convert the pixmap to JPEG bytes
            img_bytes = pix.tobytes("jpeg")
            
            # Write to the ZIP archive
            zip_file.writestr(f"page_{i+1:03d}.jpg", img_bytes)
            
    doc.close()
    return zip_buffer.getvalue()
