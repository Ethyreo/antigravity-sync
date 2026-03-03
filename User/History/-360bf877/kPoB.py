import os
import argparse
import tkinter as tk
from tkinter import filedialog
from pypdf import PdfReader, PdfWriter

def select_file():
    root = tk.Tk()
    root.withdraw() # Hide the main window
    
    # Bring the dialog to the front on macOS
    root.call('wm', 'attributes', '.', '-topmost', True)
    
    file_path = filedialog.askopenfilename(
        title="Select a PDF file to split",
        filetypes=[("PDF files", "*.pdf"), ("All files", "*.*")]
    )
    return file_path

def split_pdf(input_path, output_dir=None):
    if not os.path.exists(input_path):
        print(f"Error: File '{input_path}' not found.")
        return

    if output_dir is None:
        # Create a directory with the same name as the PDF (without extension)
        base_name = os.path.splitext(os.path.basename(input_path))[0]
        output_dir = os.path.join(os.path.dirname(input_path), f"{base_name}_split_pages")

    os.makedirs(output_dir, exist_ok=True)

    try:
        reader = PdfReader(input_path)
        total_pages = len(reader.pages)
        print(f"Found {total_pages} pages in '{input_path}'. Splitting...")

        for i in range(total_pages):
            writer = PdfWriter()
            writer.add_page(reader.pages[i])
            
            # Format filename with leading zeros, e.g., page_001.pdf
            output_filename = f"page_{i + 1:03d}.pdf"
            output_filepath = os.path.join(output_dir, output_filename)
            
            with open(output_filepath, "wb") as f:
                writer.write(f)
                
        print(f"Successfully split into {total_pages} individual PDFs in:\n{output_dir}")
        
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Split a PDF into individual pages.")
    parser.add_argument("input_pdf", nargs="?", help="Path to the input PDF file", default=None)
    parser.add_argument("-o", "--output_dir", help="Directory to save the split pages (optional)", default=None)
    
    args = parser.parse_args()
    
    input_file = args.input_pdf
    if not input_file:
        print("No file provided via command line. Opening file picker dialog...")
        input_file = select_file()
        
    if input_file:
        split_pdf(input_file, args.output_dir)
    else:
        print("Operation cancelled. No file was selected.")
