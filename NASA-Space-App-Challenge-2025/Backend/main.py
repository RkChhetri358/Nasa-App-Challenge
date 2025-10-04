# from fastapi import FastAPI, Path, Query
# from fastapi.responses import FileResponse, StreamingResponse, Response
# from fastapi.middleware.cors import CORSMiddleware
# import geopandas as gpd
# import os
# import httpx

# app = FastAPI()

# # === CORS for frontend ===
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # change to ["http://localhost:3000"] for production
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # === Auto-detect project root ===
# CURRENT_FILE = os.path.abspath(__file__)
# PROJECT_ROOT = os.path.abspath(os.path.join(CURRENT_FILE, "..", ".."))
# print("Current file:", CURRENT_FILE)
# print("Project root:", PROJECT_ROOT)

# # === Favicon ===
# @app.get("/favicon.ico")
# async def favicon():
#     favicon_path = os.path.join(PROJECT_ROOT, "favicon.ico")
#     if os.path.exists(favicon_path):
#         return FileResponse(favicon_path)
#     return Response(status_code=404)

# # === Auto-discover Moon shapefile ===
# SHP_PATH = None
# for root, dirs, files in os.walk(PROJECT_ROOT):
#     for f in files:
#         if f.lower().endswith(".shp") and "moon_nomenclature_center_pts" in f.lower():
#             SHP_PATH = os.path.join(root, f)
#             break
#     if SHP_PATH:
#         break

# if not SHP_PATH or not os.path.exists(SHP_PATH):
#     raise FileNotFoundError("Could not find MOON_nomenclature_center_pts.shp anywhere in project!")

# print("Using shapefile:", SHP_PATH)

# # Load shapefile once
# moon_gdf = gpd.read_file(SHP_PATH)

# # === Root endpoint ===
# @app.get("/")
# async def root():
#     return {"message": "NASA Space App Backend running!"}

# # === Moon labels endpoint ===
# @app.get("/labels/moon")
# async def get_moon_labels(limit: int = 500):
#     features = []
#     for _, row in moon_gdf.head(limit).iterrows():
#         features.append({
#             "name": row.get("name"),
#             "clean_name": row.get("clean_name"),
#             "type": row.get("type"),
#             "diameter": row.get("diameter"),
#             "lon": float(row.get("center_lon")),
#             "lat": float(row.get("center_lat")),
#         })
#     return {"labels": features}

# # === Proxy endpoint for OpenSeadragon tiles ===
# @app.get("/proxy/{planet}/{rest_of_path:path}")
# async def proxy_tile(planet: str, rest_of_path: str):
#     """
#     Proxy tiles from NASA for OpenSeadragon.
#     Adds CORS headers to avoid browser blocking.
#     """
#     nasa_base_url = "https://trek.nasa.gov/tiles"
#     tile_url = f"{nasa_base_url}/{planet}/{rest_of_path}"

#     async with httpx.AsyncClient() as client:
#         resp = await client.get(tile_url)
#         if resp.status_code == 200:
#             headers = {"Access-Control-Allow-Origin": "*"}  # fix CORS
#             return StreamingResponse(resp.aiter_bytes(), media_type="image/jpeg", headers=headers)
#         return Response(
#             content=f"Tile not found: {tile_url}",
#             status_code=404,
#             headers={"Access-Control-Allow-Origin": "*"}
#         )

# # === AI detection endpoint for features ===
# @app.get("/detect/{planet}")
# async def detect_features(
#     planet: str = Path(..., description="Planet name"),
#     level: int = Query(0, description="Tile zoom level"),
#     x: int = Query(0, description="Tile x coordinate"),
#     y: int = Query(0, description="Tile y coordinate")
# ):
#     """
#     Returns detected features for a planet.
#     Currently, only Moon returns features from shapefile.
#     """
#     results = []

#     if planet.lower() == "moon":
#         # For now, return all Moon labels
#         for _, row in moon_gdf.iterrows():
#             results.append({
#                 "name": row.get("name"),
#                 "type": row.get("type"),
#                 "lon": float(row.get("center_lon")),
#                 "lat": float(row.get("center_lat")),
#                 "diameter": row.get("diameter"),
#             })
#     else:
#         # Placeholder for Mars, Mercury, Venus
#         results = []

#     return {"features": results}

from fastapi import FastAPI, Path, Query
from fastapi.responses import StreamingResponse, Response, HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
import os, httpx

# Import Moon visualizer
from moon_visualizer import MoonVisualizer  # <- your updated class

app = FastAPI()

# === CORS ===
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# === Auto-detect project root ===
CURRENT_FILE = os.path.abspath(__file__)
PROJECT_ROOT = os.path.abspath(os.path.join(CURRENT_FILE, "..", ".."))

# === Moon visualizer instance ===
moon_vis = MoonVisualizer(
    proxy="http://127.0.0.1:8000/proxy",
    layer="Moon/EQ/LRO_WAC_Mosaic_Global_303ppd_v02/1.0.0/default/default028mm",
    shapefile_path=os.path.join(PROJECT_ROOT, "Backend", "MoonData", "MOON_nomenclature_center_pts.shp"),
    zoom=3,
    min_diameter=50,
    max_labels=500
)

# === Preload basemap on startup ===
@app.on_event("startup")
async def preload_moon():
    moon_vis.fetch_basemap()
    print("✅ Moon basemap preloaded and cached")

# === Root ===
@app.get("/")
async def root():
    return {"message": "NASA Space App Backend running!"}

# === Moon endpoints ===
@app.get("/moon/2d")
async def moon_2d():
    """Return labeled 2D Moon image as JPEG."""
    buf = moon_vis.generate_2d()
    return StreamingResponse(buf, media_type="image/jpeg")

@app.get("/moon/labels")
async def moon_labels(limit: int = 500):
    """Return Moon feature labels as JSON (for frontend overlay/maps)."""
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

# === Proxy endpoint (for OpenSeadragon or direct tile fetch) ===
@app.get("/proxy/{planet}/{rest_of_path:path}")
async def proxy_tile(planet: str, rest_of_path: str):
    nasa_base_url = "https://trek.nasa.gov/tiles"
    tile_url = f"{nasa_base_url}/{planet}/{rest_of_path}"

    async with httpx.AsyncClient() as client:
        resp = await client.get(tile_url)
        if resp.status_code == 200:
            headers = {"Access-Control-Allow-Origin": "*"}
            return StreamingResponse(resp.aiter_bytes(), media_type="image/jpeg", headers=headers)

        return Response(
            content=f"Tile not found: {tile_url}",
            status_code=404,
            headers={"Access-Control-Allow-Origin": "*"}
        )
