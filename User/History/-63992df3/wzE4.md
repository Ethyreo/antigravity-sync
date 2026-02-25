# Batch PDF Watermarking Pipeline

- [/] Scan workspace for source PDFs and watermark file. (Waiting for Google Drive link from user)
- [x] Initialize Python virtual environment.
- [x] Install dependencies (`pypdf`, `tqdm`).
- [x] Write Python watermarking script.
  - [x] Iterate through source directory.
  - [x] Load `watermark.pdf`.
  - [x] Overlay watermark on the first page to every page of target PDFs.
  - [x] Handle password-protected/corrupted files.
  - [x] Use `tqdm` for progress logging.
  - [x] Save to timestamped `Watermarked_Results` directory.
- [ ] Execute script and provide summary.
