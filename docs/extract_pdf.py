import fitz  # PyMuPDF
import os

pdf_path = "Aplicaciones Moviles.pdf"
doc = fitz.open(pdf_path)

for i in range(len(doc)):
    page = doc.load_page(i)
    pix = page.get_pixmap(dpi=150)
    pix.save(f"page_{i}.png")
    print(f"Saved page_{i}.png")

print("Done")
