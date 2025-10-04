# backend/main.py

from fastapi import FastAPI, Response, HTMLResponse, Query
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
import os, io, requests
from PIL import Image
from moon_visualizer import MoonVisualizer

app = FastAPI()

# === CORS ===
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# === Project root ===
CURRENT_FILE = os.path.abspath(__file__)
PROJECT_ROOT = os.path.abspath(os.path.join(CURRENT_FILE, ".."))

# === Moon visualizer instance ===
moon_vis = MoonVisualizer(
    proxy="http://127.0.0.1:8000/proxy",  # can also directly use NASA tiles if proxy not needed
    layer="Moon/EQ/LRO_WAC_Mosaic_Global_303ppd_v02/1.0.0/default/default028mm",
    shapefile_path=os.path.join(PROJECT_ROOT, "MoonData", "MOON_nomenclature_center_pts.shp"),
    zoom=3,
    min_diameter=50,
    max_labels=500
)

# === Preload basemap on startup (synchronous) ===
@app.on_event("startup")
def preload_moon():
    print("🚀 Preloading Moon basemap...")
    moon_vis.fetch_basemap()
    print("✅ Moon basemap cached successfully!")

# === Root endpoint ===
@app.get("/")
def root():
    return {"message": "NASA Space App Backend running!"}

# === 2D Moon image endpoint ===
@app.get("/moon/2d")
def moon_2d():
    buf = moon_vis.generate_2d()
    return StreamingResponse(buf, media_type="image/jpeg")

# === Moon labels endpoint ===
@app.get("/moon/labels")
def moon_labels(limit: int = Query(500, description="Max number of labels")):
    features = []
    for _, row in moon_vis.gdf.head(limit).iterrows():
        features.append({
            "name": row.get("name"),
            "type": row.get("type"),
            "diameter": float(row.get("diameter")) if row.get("diameter") else None,
            "lon": float(row.get("center_lon")),
            "lat": float(row.get("center_lat")),
        })
    return {"labels": features}

# === Proxy endpoint for tiles ===
@app.get("/proxy/{planet}/{rest_of_path:path}")
def proxy_tile(planet: str, rest_of_path: str):
    nasa_base_url = "https://trek.nasa.gov/tiles"
    tile_url = f"{nasa_base_url}/{planet}/{rest_of_path}"

    print(f"Fetching tile: {tile_url}")
    r = requests.get(tile_url)
    if r.status_code == 200:
        return Response(content=r.content, media_type="image/jpeg", headers={"Access-Control-Allow-Origin": "*"})
    
    return Response(
        content=f"Tile not found: {tile_url}",
        status_code=404,
        headers={"Access-Control-Allow-Origin": "*"}
    )
