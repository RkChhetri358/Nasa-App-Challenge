# main.py
import sqlite3
import os
from PIL import Image
# --- ADD these two imports ---
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import processing
import deepzoom

from astropy.io import fits
from astropy.visualization import AsinhStretch, ImageNormalize
import matplotlib.pyplot as plt

Image.MAX_IMAGE_PIXELS = None

class Label(BaseModel):
    image_id: str
    x_coord: float
    y_coord: float
    label_type: str
    
app = FastAPI()

# --- ADD THIS CORS MIDDLEWARE SECTION ---
# This allows the frontend (running on a different port) to request data from the backend.
origins = [
    "http://localhost",
    "http://localhost:8501",  # Default Streamlit port
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# --- END of new section ---

os.makedirs("static/dzi", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

# (The rest of the file is exactly the same)
@app.get("/")
def read_root():
    return {"message": "JWST Explorer API is running!"}

@app.post("/process-image/")
async def create_upload_file(file: UploadFile):
    temp_file_path = f"temp_{file.filename}"
    with open(temp_file_path, "wb") as buffer:
        buffer.write(await file.read())
    detections = processing.analyze_fits_image(temp_file_path)
    image_id = file.filename.split('.')[0]
    conn = sqlite3.connect('jwst_data.db')
    cursor = conn.cursor()
    for obj in detections:
        cursor.execute(
            "INSERT INTO detections (image_id, ra, dec, type, confidence) VALUES (?, ?, ?, ?, ?)",
            (image_id, obj["ra"], obj["dec"], obj["type"], obj["confidence"])
        )
    conn.commit()
    conn.close()
    return {"filename": file.filename, "message": "File processed successfully", "features_detected": len(detections)}


@app.post("/labels/")
async def save_label(label: Label):
    conn = sqlite3.connect('jwst_data.db')
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO labels (image_id, x_coord, y_coord, label_type) VALUES (?, ?, ?, ?)",
        (label.image_id, label.x_coord, label.y_coord, label.label_type)
    )
    conn.commit()
    conn.close()
    return {"status": "success", "label_data": label.dict()}

@app.get("/labels/{image_id}")
async def get_labels(image_id: str):
    conn = sqlite3.connect('jwst_data.db')
    conn.row_factory = sqlite3.Row 
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM labels WHERE image_id = ?", (image_id,))
    labels = cursor.fetchall()
    conn.close()
    return labels

@app.get("/detections/{image_id}")
async def get_detections(image_id: str):
    conn = sqlite3.connect('jwst_data.db')
    conn.row_factory = sqlite3.Row 
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM detections WHERE image_id = ?", (image_id,))
    detections = cursor.fetchall()
    conn.close()
    return detections

@app.post("/generate-tiles/")
async def generate_tiles(file: UploadFile):
    temp_file_path = f"temp_{file.filename}"
    with open(temp_file_path, "wb") as buffer:
        buffer.write(await file.read())

    image_to_tile = temp_file_path

    if file.filename.lower().endswith(".fits"):
        try:
            with fits.open(temp_file_path) as hdul:
                data = hdul[1].data
                norm = ImageNormalize(data, stretch=AsinhStretch())
                temp_png_path = "temp_converted.png"
                plt.imsave(temp_png_path, norm(data), cmap='gray', origin='lower')
                image_to_tile = temp_png_path
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to process FITS file: {e}")

    image_id = file.filename.split('.')[0]
    dzi_path = f"static/dzi/{image_id}.dzi"

    try:
        creator = deepzoom.DeepZoomImageCreator(
            tile_size=254,
            tile_overlap=1,
            tile_format="png",
            image_quality=0.8,
            resize_filter=Image.Resampling.LANCZOS
        )
        creator.create(image_to_tile, dzi_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create DZI tiles: {e}")

    return {"dzi_path": dzi_path}