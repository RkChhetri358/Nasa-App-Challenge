import requests
import io
from PIL import Image, ImageDraw, ImageFont
import geopandas as gpd

# -----------------------------
# 1. SETTINGS
# -----------------------------
proxy = "http://127.0.0.1:8000/proxy"
layer = "Moon/EQ/LRO_WAC_Mosaic_Global_303ppd_v02/1.0.0/default/default028mm"

zoom = 2  # try 2 first; increase to 3 or 4 for more detail (but larger images)

shapefile_path = "MoonData/MOON_nomenclature_center_pts.shp"
output_file = "moon_yolo_labeled.jpg"

# -----------------------------
# 2. FETCH + STITCH TILES
# -----------------------------
tile_size = 256
num_tiles = 2 ** zoom  # number of tiles across for equirectangular map

print(f"Fetching {num_tiles} × {num_tiles} tiles at zoom {zoom}...")

full_img = Image.new("RGB", (num_tiles * tile_size, num_tiles * tile_size))

for x in range(num_tiles):
    for y in range(num_tiles):
        url = f"{proxy}/{layer}/{zoom}/{x}/{y}.jpg"
        r = requests.get(url)
        if r.status_code == 200:
            tile = Image.open(io.BytesIO(r.content)).convert("RGB")
            full_img.paste(tile, (x * tile_size, y * tile_size))
        else:
            print(f"⚠️ Missing tile: {url}")

width, height = full_img.size
print(f"✅ Stitched image size: {width} × {height}")

# -----------------------------
# 3. LOAD SHAPEFILE
# -----------------------------
gdf = gpd.read_file(shapefile_path)
print("Columns:", gdf.columns)
print("Total features:", len(gdf))

# -----------------------------
# 4. CONVERT LON/LAT → PIXEL
# -----------------------------
def lonlat_to_pixel(lon, lat, width, height):
    """
    Map lon (-180→180), lat (90→-90) to pixel (x, y).
    Image is global equirectangular projection.
    """
    x = (lon + 180.0) / 360.0 * width
    y = (90.0 - lat) / 180.0 * height
    return int(x), int(y)

# -----------------------------
# 5. DRAW LABELS
# -----------------------------
draw = ImageDraw.Draw(full_img)
font = ImageFont.load_default()

for idx, row in gdf.iterrows():
    try:
        name = row["name"]
        ftype = row.get("type", "")
        lon, lat = row["center_lon"], row["center_lat"]

        px, py = lonlat_to_pixel(lon, lat, width, height)

        # Draw a small red box
        r = 2
        draw.rectangle([px-r, py-r, px+r, py+r], outline="red", width=1)

        # Label: name + type
        label = f"{name} ({ftype})" if ftype else name
        draw.text((px+5, py), label, fill="yellow", font=font)
    except Exception as e:
        print(f"Skipping row {idx} due to error: {e}")

# -----------------------------
# 6. SAVE OUTPUT
# -----------------------------
full_img.save(output_file)
print(f"✅ Saved labeled Moon map → {output_file}")


# %%


# %% [markdown]
# Big

# %%
import requests, io
from PIL import Image, ImageDraw, ImageFont
import geopandas as gpd

# -----------------------------
# 1. SETTINGS
# -----------------------------
proxy = "http://127.0.0.1:8000/proxy"
layer = "Moon/EQ/LRO_WAC_Mosaic_Global_303ppd_v02/1.0.0/default/default028mm"

zoom = 3  # test with 2 or 3 first, 4 for detailed output

shapefile_path = "MoonData/MOON_nomenclature_center_pts.shp"
output_file = "moon_yolo_labeled_filtered.jpg"

min_diameter = 50   # km, only label features bigger than this
max_labels = 500    # optional: cap total number of labels to avoid clutter

# -----------------------------
# 2. FETCH + STITCH TILES
# -----------------------------
tile_size = 256
num_tiles = 2 ** zoom

print(f"Fetching {num_tiles} × {num_tiles} tiles at zoom {zoom}...")

full_img = Image.new("RGB", (num_tiles * tile_size, num_tiles * tile_size))

for x in range(num_tiles):
    for y in range(num_tiles):
        url = f"{proxy}/{layer}/{zoom}/{y}/{x}.jpg"
        r = requests.get(url)
        if r.status_code == 200:
            tile = Image.open(io.BytesIO(r.content)).convert("RGB")
            full_img.paste(tile, (x * tile_size, y * tile_size))
        else:
            print(f"⚠ Missing tile: {url}")

width, height = full_img.size
print(f"✅ Stitched image size: {width} × {height}")

# -----------------------------
# 3. LOAD SHAPEFILE + FILTER
# -----------------------------
gdf = gpd.read_file(shapefile_path)
print("Columns:", gdf.columns)
print("Total features before filtering:", len(gdf))

# Filter by diameter (if column exists)
if "diameter" in gdf.columns:
    gdf = gdf[gdf["diameter"].astype(float) > min_diameter]

# Optionally keep only the top N largest
if "diameter" in gdf.columns:
    gdf = gdf.sort_values("diameter", ascending=False).head(max_labels)

print("Total features after filtering:", len(gdf))

# -----------------------------
# 4. LON/LAT → PIXEL
# -----------------------------
def lonlat_to_pixel(lon, lat, width, height):
    # Convert 0–360 longitudes to -180–180
    if lon > 180:
        lon -= 360

    x = (lon + 180.0) / 360.0 * width
    y = (90.0 - lat) / 180.0 * height
    return int(x), int(y)
# -----------------------------
# 5. DRAW LABELS
# -----------------------------
draw = ImageDraw.Draw(full_img)
font = ImageFont.load_default()

for idx, row in gdf.iterrows():
    try:
        name = row["name"]
        ftype = row.get("type", "")
        lon, lat = row["center_lon"], row["center_lat"]

        px, py = lonlat_to_pixel(lon, lat, width, height)

        # Draw red dot / small box
        r = 2
        draw.rectangle([px-r, py-r, px+r, py+r], outline="red", width=1)

        # Label text
        label = f"{name} ({ftype})" if ftype else name
        draw.text((px+5, py), label, fill="yellow", font=font)
    except Exception as e:
        print(f"Skipping row {idx} due to error: {e}")

# -----------------------------
# 6. SAVE
# -----------------------------
full_img.save(output_file)
print(f"✅ Saved filtered labeled Moon map → {output_file}")

# %%
import requests, io
from PIL import Image, ImageDraw, ImageFont
import geopandas as gpd

# -----------------------------
# 1. SETTINGS
# -----------------------------
proxy = "http://127.0.0.1:8000/proxy"
layer = "Mars/EQ/Mars_Viking_MDIM21_ClrMosaic_global_232m/1.0.0/default/default028mm"

zoom = 3  # test with 2 or 3 first, 4 for detailed output

shapefile_path = "MarsData/MARS_nomenclature_center_pts.shp"
output_file = "mars_yolo_labeled_filtered.jpg"

min_diameter = 50   # km, only label features bigger than this
max_labels = 500    # optional: cap total number of labels to avoid clutter

# -----------------------------
# 2. FETCH + STITCH TILES
# -----------------------------
tile_size = 256
num_tiles = 2 ** zoom

print(f"Fetching {num_tiles} × {num_tiles} tiles at zoom {zoom}...")

full_img = Image.new("RGB", (num_tiles * tile_size, num_tiles * tile_size))

for x in range(num_tiles):
    for y in range(num_tiles):
        url = f"{proxy}/{layer}/{zoom}/{y}/{x}.jpg"
        r = requests.get(url)
        if r.status_code == 200:
            tile = Image.open(io.BytesIO(r.content)).convert("RGB")
            full_img.paste(tile, (x * tile_size, y * tile_size))
        else:
            print(f"⚠️ Missing tile: {url}")

width, height = full_img.size
print(f"✅ Stitched image size: {width} × {height}")

# -----------------------------
# 3. LOAD SHAPEFILE + FILTER
# -----------------------------
gdf = gpd.read_file(shapefile_path)
print("Columns:", gdf.columns)
print("Total features before filtering:", len(gdf))

# Filter by diameter (if column exists)
if "diameter" in gdf.columns:
    gdf = gdf[gdf["diameter"].astype(float) > min_diameter]

# Optionally keep only the top N largest
if "diameter" in gdf.columns:
    gdf = gdf.sort_values("diameter", ascending=False).head(max_labels)

print("Total features after filtering:", len(gdf))

# -----------------------------
# 4. LON/LAT → PIXEL
# -----------------------------
def lonlat_to_pixel(lon, lat, width, height):
    # Convert 0–360 longitudes to -180–180
    if lon > 180:
        lon -= 360

    x = (lon + 180.0) / 360.0 * width
    y = (90.0 - lat) / 180.0 * height
    return int(x), int(y)
# -----------------------------
# 5. DRAW LABELS
# -----------------------------
draw = ImageDraw.Draw(full_img)
font = ImageFont.load_default()
for idx, row in gdf.iterrows():
    try:
        name = row["name"]
        ftype = row.get("type", "")
        lon, lat = row["center_lon"], row["center_lat"]

        px, py = lonlat_to_pixel(lon, lat, width, height)

        # Draw red dot / small box
        r = 2
        draw.rectangle([px-r, py-r, px+r, py+r], outline="red", width=1)

        # Label text
        label = f"{name} ({ftype})" if ftype else name
        draw.text((px+5, py), label, fill="yellow", font=font)
    except Exception as e:
        print(f"Skipping row {idx} due to error: {e}")

# -----------------------------
# 6. SAVE
# -----------------------------
full_img.save(output_file)
print(f"✅ Saved filtered labeled Mars map → {output_file}")