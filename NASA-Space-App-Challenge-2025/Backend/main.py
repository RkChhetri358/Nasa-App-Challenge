from fastapi import FastAPI, Query
from fastapi.responses import FileResponse, HTMLResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
from PIL import Image
import os, io

from mercury_visualizer import MercuryVisualizer


app = FastAPI()

# === CORS ===
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# === Paths ===
CURRENT_FILE = os.path.abspath(__file__)
PROJECT_ROOT = os.path.abspath(os.path.join(CURRENT_FILE, ".."))
TILE_DIR = os.path.join(PROJECT_ROOT, "tiles")
os.makedirs(TILE_DIR, exist_ok=True)

# === Mercury visualizer ===
mercury_vis = MercuryVisualizer(
    proxy="https://trek.nasa.gov/tiles",
    layer="Mercury/EQ/Mercury_MESSENGER_MDIS_Basemap_BDR_Mosaic_Global_166m/1.0.0/default/default028mm",
    shapefile_path=os.path.join(PROJECT_ROOT, "MercuryData", "MERCURY_nomenclature_center_pts.shp"),
    zoom=3
)

# === Startup: preload basemap ===
@app.on_event("startup")
async def preload_mercury():
    mercury_vis.fetch_basemap()
    print("✅ Mercury basemap preloaded and cached")

# === Root ===
@app.get("/")
async def root():
    return {"message": "NASA Space App Backend running!"}

# === 3D endpoint ===
@app.get("/mercury/3d")
async def mercury_3d():
    html = mercury_vis.generate_3d_html()
    return HTMLResponse(html)

# === Tiles endpoint ===
@app.get("/mercury/tiles/{level}/{y}/{x}.jpg")
async def get_tile(level: int, y: int, x: int):
    tile_path = os.path.join(TILE_DIR, str(level), str(y), f"{x}.jpg")
    if os.path.exists(tile_path):
        return FileResponse(tile_path)
    
    # Generate tile dynamically
    full_img, _ = mercury_vis.fetch_basemap()
    tile_size = 256
    num_tiles = 2 ** level
    w, h = full_img.size
    scale = w / (2 ** mercury_vis.zoom * tile_size)  # scale full image to desired level

    left = int(x * tile_size * scale)
    upper = int(y * tile_size * scale)
    right = int(min(left + tile_size * scale, w))
    lower = int(min(upper + tile_size * scale, h))

    tile = full_img.crop((left, upper, right, lower)).resize((tile_size, tile_size), Image.LANCZOS)
    os.makedirs(os.path.dirname(tile_path), exist_ok=True)
    tile.save(tile_path, "JPEG")
    return FileResponse(tile_path)






@app.get("/mercury/labels")
async def get_all_labels(limit: Optional[int] = Query(100, ge=1, le=1000)):
    """Return crater/feature labels (name, lat, lon, diameter)."""
    gdf = mercury_vis.gdf.head(limit)
    labels = [
        {
            "name": str(row.get("name", "Unnamed")),
            "type": str(row.get("feature_type", "Unknown")),
            "diameter": float(row.get("diameter", 0.0)),
            "lon": float(row.get("center_lon", 0.0)),
            "lat": float(row.get("center_lat", 0.0)),
        }
        for _, row in gdf.iterrows()
    ]
    return JSONResponse(labels)

# === 2. Get a label by name ===
@app.get("/mercury/labels/{name}")
async def get_label_by_name(name: str):
    """Return details of a specific labeled feature by name (case-insensitive)."""
    match = mercury_vis.gdf[mercury_vis.gdf["name"].str.lower() == name.lower()]
    if match.empty:
        return JSONResponse({"error": "Label not found"}, status_code=404)
    row = match.iloc[0]
    label = {
        "name": str(row.get("name", "Unnamed")),
        "type": str(row.get("feature_type", "Unknown")),
        "diameter": float(row.get("diameter", 0.0)),
        "lon": float(row.get("center_lon", 0.0)),
        "lat": float(row.get("center_lat", 0.0)),
    }
    return JSONResponse(label)

# === 3. Filter labels by diameter or region ===
@app.get("/mercury/labels/filter")
async def filter_labels(
    min_diameter: float = Query(0),
    max_diameter: float = Query(1e6),
    min_lat: Optional[float] = None,
    max_lat: Optional[float] = None,
    min_lon: Optional[float] = None,
    max_lon: Optional[float] = None
):
    """Filter labels based on diameter and optional coordinate bounds."""
    gdf = mercury_vis.gdf
    gdf_filtered = gdf[
        (gdf["diameter"].astype(float) >= min_diameter)
        & (gdf["diameter"].astype(float) <= max_diameter)
    ]

    if None not in (min_lat, max_lat):
        gdf_filtered = gdf_filtered[
            (gdf_filtered["center_lat"] >= min_lat) & (gdf_filtered["center_lat"] <= max_lat)
        ]
    if None not in (min_lon, max_lon):
        gdf_filtered = gdf_filtered[
            (gdf_filtered["center_lon"] >= min_lon) & (gdf_filtered["center_lon"] <= max_lon)
        ]

    labels = [
        {
            "name": str(row.get("name", "Unnamed")),
            "type": str(row.get("feature_type", "Unknown")),
            "diameter": float(row.get("diameter", 0.0)),
            "lon": float(row.get("center_lon", 0.0)),
            "lat": float(row.get("center_lat", 0.0)),
        }
        for _, row in gdf_filtered.iterrows()
    ]

    return JSONResponse(labels)