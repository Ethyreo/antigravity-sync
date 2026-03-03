import streamlit as st
import io
import zipfile
from pypdf import PdfReader, PdfWriter
from pdf_to_jpeg import convert_pdf_to_images

st.set_page_config(page_title="Ken's PDF Toolkit", page_icon="📄", layout="centered")

st.title("📄 Ken's PDF Web Toolkit")
st.markdown("A retro-style local web toolkit for your PDFs, built by Ken for Lovish.")

tab1, tab2, tab3 = st.tabs(["🖌️ Watermarker", "✂️ Splitter", "🖼️ PDF to JPEG"])

# --- WATERMARKER TAB ---
with tab1:
    st.header("Batch Watermarker")
    st.write("Upload source PDFs and a watermark PDF. Get a ZIP of watermarked files back.")
    
    source_files = st.file_uploader("Upload Source PDFs", type=["pdf"], accept_multiple_files=True, key="water_source")
    watermark_file = st.file_uploader("Upload Watermark PDF", type=["pdf"], key="water_mark")
    
    if st.button("Apply Watermarks"):
        if source_files and watermark_file:
            with st.spinner("Watermarking..."):
                wm_reader = PdfReader(watermark_file)
                wm_page = wm_reader.pages[0]
                
                zip_buffer = io.BytesIO()
                with zipfile.ZipFile(zip_buffer, "a", zipfile.ZIP_DEFLATED) as zipf:
                    for sf in source_files:
                        reader = PdfReader(sf)
                        writer = PdfWriter()
                        
                        for i in range(len(reader.pages)):
                            page = reader.pages[i]
                            # Merge watermark onto page
                            page.merge_page(wm_page)
                            writer.add_page(page)
                        
                        pdf_buffer = io.BytesIO()
                        writer.write(pdf_buffer)
                        zipf.writestr(f"watermarked_{sf.name}", pdf_buffer.getvalue())
                
                st.success("Successfully watermarked!")
                st.download_button(
                    label="⬇️ Download Watermarked ZIP",
                    data=zip_buffer.getvalue(),
                    file_name="watermarked_pdfs.zip",
                    mime="application/zip"
                )
        else:
            st.error("Please upload both Source PDFs and a Watermark PDF.")

# --- SPLITTER TAB ---
with tab2:
    st.header("PDF Splitter")
    st.write("Upload a multi-page PDF to split it into single individual pages.")
    
    split_files = st.file_uploader("Upload PDF(s) to split", type=["pdf"], accept_multiple_files=True, key="split")
    
    if st.button("Split PDF(s)"):
        if split_files:
            with st.spinner("Splitting pages..."):
                zip_buffer = io.BytesIO()
                with zipfile.ZipFile(zip_buffer, "a", zipfile.ZIP_DEFLATED) as zipf:
                    for split_file in split_files:
                        reader = PdfReader(split_file)
                        base_name = split_file.name.replace('.pdf', '')
                        
                        for i in range(len(reader.pages)):
                            writer = PdfWriter()
                            writer.add_page(reader.pages[i])
                            
                            pdf_buffer = io.BytesIO()
                            writer.write(pdf_buffer)
                            
                            # Use base_name and leading zeros
                            zipf.writestr(f"{base_name}_page_{i+1:03d}.pdf", pdf_buffer.getvalue())
                
                st.success("Successfully split into individual pages!")
                st.download_button(
                    label="⬇️ Download Separated Pages ZIP",
                    data=zip_buffer.getvalue(),
                    file_name="split_pages.zip",
                    mime="application/zip"
                )
        else:
            st.error("Please upload at least one PDF to split.")

# --- PDF TO JPEG TAB ---
with tab3:
    st.header("PDF to JPEG Converter")
    st.write("Upload a multi-page PDF to convert every page to a high-res JPEG image.")
    
    conv_files = st.file_uploader("Upload PDF(s) to convert", type=["pdf"], accept_multiple_files=True, key="convert")
    
    if st.button("Convert to JPEG(s)"):
        if conv_files:
            with st.spinner("Rendering JPEGs (this may take a moment)..."):
                zip_buffer = io.BytesIO()
                with zipfile.ZipFile(zip_buffer, "a", zipfile.ZIP_DEFLATED) as zipf:
                    for conv_file in conv_files:
                        base_name = conv_file.name.replace('.pdf', '')
                        # We need to process the file and add its contents to the combined zip.
                        # Since pdf_to_jpeg function creates its own zip, we will instead just do the fitz logic directly here,
                        # or extract from the returned zip. Doing it directly is cleaner for naming.
                        import fitz
                        doc = fitz.open("pdf", conv_file.getvalue())
                        for i, page in enumerate(doc):
                            pix = page.get_pixmap(dpi=300)
                            img_bytes = pix.tobytes("jpeg")
                            zipf.writestr(f"{base_name}_page_{i+1:03d}.jpg", img_bytes)
                        doc.close()
                
                st.success("Successfully converted to JPEGs!")
                st.download_button(
                    label="⬇️ Download Images ZIP",
                    data=zip_buffer.getvalue(),
                    file_name="converted_images.zip",
                    mime="application/zip"
                )
        else:
            st.error("Please upload at least one PDF to convert.")
