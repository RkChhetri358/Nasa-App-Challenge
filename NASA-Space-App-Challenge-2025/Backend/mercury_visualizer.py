import requests, io, os
from PIL import Image
import geopandas as gpd
import numpy as np
import plotly.graph_objects as go

class MercuryVisualizer:
    def __init__(self, proxy, layer, shapefile_path, zoom=3, min_diameter=50, max_labels=500):
        self.proxy = proxy
        self.layer = layer
        self.shapefile_path = shapefile_path
        self.zoom = zoom
        self.min_diameter = min_diameter
        self.max_labels = max_labels

        self._cached_full_img = None
        self._cached_gray_img = None
        self._cached_labels = None

        # Load shapefile once
        self.gdf = gpd.read_file(shapefile_path)
        if "diameter" in self.gdf.columns:
            self.gdf = self.gdf[self.gdf["diameter"].astype(float) > self.min_diameter]
            self.gdf = self.gdf.sort_values("diameter", ascending=False).head(self.max_labels)

    # ----------------------
    # 1. FETCH & CACHE BASEMAP
    # ----------------------
    def fetch_basemap(self):
        if self._cached_full_img is not None:
            return self._cached_full_img, self._cached_gray_img

        tile_size = 256
        num_tiles = 2 ** self.zoom
        # Full image size = num_tiles * tile_size
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

        # Cache full image at native resolution
        gray_img = np.array(full_img.convert("L"))
        self._cached_full_img = full_img
        self._cached_gray_img = gray_img
        return full_img, gray_img

    # ----------------------
    # 2. GENERATE 2D IMAGE (JPEG)
    # ----------------------
    def generate_2d(self):
        full_img, _ = self.fetch_basemap()
        buf = io.BytesIO()
        full_img.save(buf, format="JPEG")
        buf.seek(0)
        return buf

    # ----------------------
    # 3. GENERATE 3D GLOBE (HTML)
    # ----------------------
    def generate_3d_html(self):
        _, gray_img = self.fetch_basemap()
        h, w = gray_img.shape

        # Sphere coordinates
        phi = np.linspace(0, np.pi, h)
        theta = np.linspace(0, 2*np.pi, w)
        theta, phi = np.meshgrid(theta, phi)

        x = np.cos(theta) * np.sin(phi)
        y = np.sin(theta) * np.sin(phi)
        z = np.cos(phi)

        # Basemap surface
        surface = go.Surface(
            x=x, y=y, z=z,
            surfacecolor=gray_img,
            colorscale="gray",
            cmin=0, cmax=255,
            showscale=False,
            lighting=dict(
                ambient=0.6,
                diffuse=0.8,
                specular=0.5,
                roughness=0.4,
                fresnel=0.05
            ),
            lightposition=dict(x=100, y=200, z=0)
        )

        # Feature labels
        labels = []
        for _, row in self.gdf.iterrows():
            lon, lat = row["center_lon"], row["center_lat"]
            if lon > 180:
                lon -= 360
            lon_rad = np.deg2rad(lon)
            lat_rad = np.deg2rad(lat)

            lx = np.cos(lon_rad) * np.cos(lat_rad)
            ly = np.sin(lon_rad) * np.cos(lat_rad)
            lz = np.sin(lat_rad)

            labels.append(go.Scatter3d(
                x=[lx], y=[ly], z=[lz],
                mode="markers+text",
                marker=dict(size=3, color="red"),
                text=[row["name"]],
                textposition="top center",
                textfont=dict(size=9, color="yellow")
            ))

        fig = go.Figure(data=[surface] + labels)
        fig.update_layout(
            scene=dict(
                xaxis=dict(visible=False),
                yaxis=dict(visible=False),
                zaxis=dict(visible=False),
                aspectmode="data",
                bgcolor="black"
            ),
            margin=dict(l=0, r=0, t=0, b=0)
        )

        return fig.to_html(full_html=True, include_plotlyjs="cdn")
