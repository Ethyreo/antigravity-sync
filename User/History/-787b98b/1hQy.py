import streamlit as st
import io
import zipfile
from pypdf import PdfReader, PdfWriter
from pdf_to_jpeg import convert_pdf_to_images

st.set_page_config(page_title="PDF Toolkit", page_icon="📝", layout="centered")

# Custom CSS based on Apple Presentation / macOS Dark Mode design
st.markdown("""
    <style>
    /* Global Typography - SF Pro / Apple System Font */
    html, body, [class*="css"] {
        font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
        background-color: #000000 !important;
        color: #F5F5F7 !important;
        -webkit-font-smoothing: antialiased !important;
    }

    /* Presentation Header */
    h1, h2, h3 {
        font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif !important;
        font-weight: 700 !important;
        background: -webkit-linear-gradient(45deg, #FFF, #A1A1A6);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        letter-spacing: -0.015em;
    }

    /* Glassmorphism Uploaders / Cards */
    [data-testid="stFileUploadDropzone"] {
        background: rgba(255, 255, 255, 0.05) !important;
        border: 1px solid rgba(255, 255, 255, 0.1) !important;
        border-radius: 12px !important;
        backdrop-filter: blur(20px) !important;
        -webkit-backdrop-filter: blur(20px) !important;
        color: #F5F5F7 !important;
        transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
    }
    [data-testid="stFileUploadDropzone"]:hover {
        background: rgba(255, 255, 255, 0.08) !important;
        border: 1px solid rgba(255, 255, 255, 0.2) !important;
        transform: scale(1.01);
    }
    
    /* Apple Style CTA Buttons */
    .stButton>button {
        background: linear-gradient(180deg, #2C2C2E 0%, #1C1C1E 100%) !important;
        color: #FFFFFF !important;
        border: 1px solid rgba(255, 255, 255, 0.15) !important;
        border-radius: 98px !important; /* Pill shape */
        padding: 0.5rem 2rem !important;
        font-weight: 500 !important;
        box-shadow: 0 4px 14px 0 rgba(0,0,0,0.39) !important;
        transition: all 0.2s ease !important;
        cursor: pointer !important;
        letter-spacing: 0.5px;
    }
    
    .stButton>button:hover {
        background: linear-gradient(180deg, #3A3A3C 0%, #2C2C2E 100%) !important;
        border-color: rgba(255, 255, 255, 0.3) !important;
        transform: translateY(-1px);
    }
    
    /* Clean Tab Navigation */
    .stTabs [data-baseweb="tab-list"] {
        background-color: transparent;
        gap: 8px;
        padding-bottom: 20px;
    }
    .stTabs [data-baseweb="tab"] {
        height: 40px;
        padding: 0 16px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
        color: #A1A1A6 !important;
        font-weight: 500 !important;
        border: 1px solid transparent !important;
        transition: all 0.2s ease;
    }
    .stTabs [aria-selected="true"] {
        background: rgba(255, 255, 255, 0.15) !important;
        color: #FFFFFF !important;
        border: 1px solid rgba(255, 255, 255, 0.2) !important;
        border-bottom-color: rgba(255, 255, 255, 0.2) !important;
    }

    /* Hide top header decoration */
    header {visibility: hidden;}
    #MainMenu {visibility: hidden;}
    footer {visibility: hidden;}
    </style>
    """, unsafe_allow_html=True)

st.title("PDF Web Toolkit")
st.markdown("Pro-level tools. Built for speed. Designed for you.")

tab1, tab2, tab3 = st.tabs(["Watermarker", "Splitter", "PDF to JPEG"])

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
                    label="Download Watermarked ZIP",
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
                    label="Download Separated Pages ZIP",
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
                    label="Download Images ZIP",
                    data=zip_buffer.getvalue(),
                    file_name="converted_images.zip",
                    mime="application/zip"
                )
        else:
            st.error("Please upload at least one PDF to convert.")
