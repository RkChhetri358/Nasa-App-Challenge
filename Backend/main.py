from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import pyvips
import tempfile
import os

app = FastAPI(title="NASA Image Explorer API")

# Allow all origins for simplicity
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Predefined datasets
DATASETS = [
    {
        "id": "mars_global",
        "name": "Mars Global Map",
        "tif_url": "https://mars.nasa.gov/system/news_items/main_images/9663_Mars_globe.tif",
        "description": "Global Mars surface map in TIF"
    },
    {
        "id": "moon_surface",
        "name": "Lunar Recon Orbiter",
        "tif_url": "https://lroc.sese.asu.edu/data/LRO_LROC_GLOBAL_MOSAIC.tif",
        "description": "Moon surface map"
    }
]

# Store temporary folders for generated tiles
TMP_FOLDERS = {}

@app.get("/datasets")
async def list_datasets():
    return {"datasets": DATASETS}

@app.get("/dzi/{dataset_id}")
async def get_dzi(dataset_id: str):
    dataset = next((d for d in DATASETS if d["id"] == dataset_id), None)
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")

    # Check if already converted
    if dataset_id in TMP_FOLDERS:
        tmp_dir = TMP_FOLDERS[dataset_id]
    else:
        tmp_dir = tempfile.mkdtemp()
        TMP_FOLDERS[dataset_id] = tmp_dir
        try:
            image = pyvips.Image.new_from_file(dataset["tif_url"], access='sequential')
            image.dzsave(os.path.join(tmp_dir, dataset_id), layout='zoomify', suffix='.jpeg', overlap=1, tile_size=256)
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    return FileResponse(os.path.join(tmp_dir, f"{dataset_id}.dzi"), media_type="application/xml")

@app.get("/dzi_tiles/{dataset_id}/{z}/{x}_{y}.jpeg")
async def get_tile(dataset_id: str, z: int, x: int, y: int):
    if dataset_id not in TMP_FOLDERS:
        raise HTTPException(status_code=404, detail="Tiles not generated yet")

    tile_path = os.path.join(TMP_FOLDERS[dataset_id], f"{dataset_id}_files", str(z), f"{x}_{y}.jpeg")
    if not os.path.exists(tile_path):
        raise HTTPException(status_code=404, detail="Tile not found")
    return FileResponse(tile_path, media_type="image/jpeg")
