import requests, io
from PIL import Image, ImageDraw, ImageFont
import geopandas as gpd
import numpy as np

class MoonVisualizer:
    def __init__(self, proxy, layer, shapefile_path, zoom=3, min_diameter=50, max_labels=500):
        self.proxy = proxy
        self.layer = layer
        self.shapefile_path = shapefile_path
        self.zoom = zoom
        self.min_diameter = min_diameter
        self.max_labels = max_labels

        self._cached_full_img = None
        self.gdf = gpd.read_file(shapefile_path)

        # Filter by diameter if present
        if "diameter" in self.gdf.columns:
            self.gdf = self.gdf[self.gdf["diameter"].astype(float) > self.min_diameter]
            self.gdf = self.gdf.sort_values("diameter", ascending=False).head(self.max_labels)

    # ----------------------
    # 1. FETCH & STITCH BASEMAP
    # ----------------------
    def fetch_basemap(self):
        if self._cached_full_img is not None:
            return self._cached_full_img

        tile_size = 256
        num_tiles = 2 ** self.zoom
        full_img = Image.new("RGB", (num_tiles * tile_size, num_tiles * tile_size))

        print(f"Fetching {num_tiles} × {num_tiles} tiles at zoom {self.zoom}...")
        for x in range(num_tiles):
            for y in range(num_tiles):
                url = f"{self.proxy}/{self.layer}/{self.zoom}/{y}/{x}.jpg"
                r = requests.get(url)
                if r.status_code == 200:
                    tile = Image.open(io.BytesIO(r.content)).convert("RGB")
                    full_img.paste(tile, (x * tile_size, y * tile_size))
                else:
                    print(f"⚠ Missing tile: {url}")

        self._cached_full_img = full_img
        print(f"✅ Stitched image size: {full_img.size[0]} × {full_img.size[1]}")
        return full_img

    # ----------------------
    # 2. LON/LAT → PIXEL
    # ----------------------
    @staticmethod
    def lonlat_to_pixel(lon, lat, width, height):
        if lon > 180:
            lon -= 360
        x = (lon + 180.0) / 360.0 * width
        y = (90.0 - lat) / 180.0 * height
        return int(x), int(y)

    # ----------------------
    # 3. GENERATE 2D LABELED IMAGE
    # ----------------------
    def generate_2d(self, output_file="moon_yolo_labeled_filtered.jpg"):
        full_img = self.fetch_basemap()
        width, height = full_img.size

        draw = ImageDraw.Draw(full_img)
        try:
            font = ImageFont.truetype("arial.ttf", 12)
        except:
            font = ImageFont.load_default()

        for idx, row in self.gdf.iterrows():
            try:
                name = row["name"]
                ftype = row.get("type", "")
                lon, lat = row["center_lon"], row["center_lat"]
                px, py = self.lonlat_to_pixel(lon, lat, width, height)

                # Draw small red square
                r = 2
                draw.rectangle([px-r, py-r, px+r, py+r], outline="red", width=1)

                # Draw label
                label = f"{name} ({ftype})" if ftype else name
                draw.text((px+5, py), label, fill="yellow", font=font)
            except Exception as e:
                print(f"Skipping row {idx} due to error: {e}")

        full_img.save(output_file)
        print(f"✅ Saved filtered labeled Moon map → {output_file}")
        return output_file

# -----------------------------
# USAGE EXAMPLE
# -----------------------------
if __name__ == "__main__":
    proxy = "http://127.0.0.1:8000/proxy"
    layer = "Moon/EQ/LRO_WAC_Mosaic_Global_303ppd_v02/1.0.0/default/default028mm"
    shapefile_path = "MoonData/MOON_nomenclature_center_pts.shp"

    visualizer = MoonVisualizer(proxy, layer, shapefile_path, zoom=3, min_diameter=50, max_labels=500)
    visualizer.generate_2d(output_file="moon_yolo_labeled_filtered.jpg")
