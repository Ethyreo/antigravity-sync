import streamlit as st
import io
import zipfile
from pypdf import PdfReader, PdfWriter
from pdf_to_jpeg import convert_pdf_to_images

st.set_page_config(page_title="NatureSync PDF", page_icon="🌿", layout="centered")

# Custom CSS based on Futuristic Nature / Dark Mode design
st.markdown("""
    <style>
    /* Global Typography - Futuristic Nature */
    html, body, [class*="css"] {
        font-family: 'Inter', 'Roboto', 'Segoe UI', sans-serif !important;
        background-color: #040f0a !important; /* Deep forest dark */
        background-image: radial-gradient(circle at 50% 0%, #0a2116 0%, #040f0a 60%) !important;
        color: #e0f2eb !important; /* Pale mint text */
        -webkit-font-smoothing: antialiased !important;
    }

    /* Glowing Headers */
    h1, h2, h3 {
        font-family: 'Inter', sans-serif !important;
        font-weight: 800 !important;
        background: -webkit-linear-gradient(45deg, #00ffa3, #8affc1);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        letter-spacing: -0.02em;
        text-shadow: 0px 4px 20px rgba(0, 255, 163, 0.2);
    }

    /* Glassmorphism Uploaders / Cards with Bioluminescent hints */
    [data-testid="stFileUploadDropzone"] {
        background: rgba(0, 255, 163, 0.02) !important;
        border: 1px solid rgba(0, 255, 163, 0.15) !important;
        border-radius: 16px !important;
        backdrop-filter: blur(24px) !important;
        -webkit-backdrop-filter: blur(24px) !important;
        color: #e0f2eb !important;
        transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
        box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
    }
    [data-testid="stFileUploadDropzone"]:hover {
        background: rgba(0, 255, 163, 0.05) !important;
        border: 1px solid rgba(0, 255, 163, 0.4) !important;
        box-shadow: 0 0 20px rgba(0, 255, 163, 0.15);
        transform: translateY(-2px);
    }
    
    /* Futuristic Neon Buttons */
    .stButton>button {
        background: rgba(0, 255, 163, 0.05) !important;
        color: #00ffa3 !important;
        border: 1px solid rgba(0, 255, 163, 0.3) !important;
        border-radius: 8px !important; 
        padding: 0.6rem 2.5rem !important;
        font-weight: 600 !important;
        text-transform: uppercase;
        letter-spacing: 1.5px;
        box-shadow: 0 0 10px rgba(0, 255, 163, 0.1) !important;
        transition: all 0.3s ease !important;
        cursor: pointer !important;
        position: relative;
        overflow: hidden;
    }
    
    .stButton>button:hover {
        background: rgba(0, 255, 163, 0.15) !important;
        border-color: #00ffa3 !important;
        color: #ffffff !important;
        box-shadow: 0 0 25px rgba(0, 255, 163, 0.4) !important;
        transform: translateY(-2px);
    }
    
    /* Minimalistic Futuristic Tabs */
    .stTabs [data-baseweb="tab-list"] {
        background-color: transparent;
        gap: 16px;
        padding-bottom: 16px;
        border-bottom: 1px solid rgba(0, 255, 163, 0.1);
    }
    .stTabs [data-baseweb="tab"] {
        height: 48px;
        padding: 0 20px;
        background: transparent;
        border-radius: 0px;
        color: rgba(224, 242, 235, 0.6) !important;
        font-weight: 500 !important;
        border: none !important;
        border-bottom: 2px solid transparent !important;
        transition: all 0.3s ease;
        text-transform: uppercase;
        letter-spacing: 1px;
        font-size: 0.9rem;
    }
    .stTabs [aria-selected="true"] {
        background: transparent !important;
        color: #00ffa3 !important;
        border-bottom: 2px solid #00ffa3 !important;
        text-shadow: 0 0 10px rgba(0, 255, 163, 0.3);
    }

    /* Input text color handling in streamit inputs */
    input {
        color: #e0f2eb !important;
    }

    /* Hide top header decoration */
    header {visibility: hidden;}
    #MainMenu {visibility: hidden;}
    footer {visibility: hidden;}
    </style>
    """, unsafe_allow_html=True)

st.title("PDF Management System")
st.markdown("_Organic processing algorithms. Minimalist digital workspace._")
st.markdown("A comprehensive suite of tools designed to seamlessly manage your PDF documents. Easily batch process watermarks, split multi-page documents, and convert PDFs to high-resolution JPEGs with a beautiful, nature-inspired interface.")

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
