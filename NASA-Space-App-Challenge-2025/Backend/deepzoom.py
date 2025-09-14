# deepzoom.py
import math
import os
from PIL import Image

class DeepZoomImageCreator(object):
    def __init__(self, tile_size=254, tile_overlap=1, tile_format="png",
                 image_quality=0.8, resize_filter=None):
        self.tile_size = tile_size
        self.tile_overlap = tile_overlap
        self.tile_format = tile_format
        self.image_quality = image_quality
        self.resize_filter = resize_filter

    def create(self, image_source, destination):
        image = Image.open(image_source)
        width, height = image.size
        if destination.endswith(".dzi"):
            container = os.path.splitext(destination)[0] + "_files"
        else:
            container = destination
            destination += ".dzi"
        if not os.path.exists(container):
            os.makedirs(container)

        max_level = int(math.ceil(math.log(max(width, height), 2)))
        levels = []
        for level in range(max_level, -1, -1):
            w = int(width / (2**(max_level - level)))
            h = int(height / (2**(max_level - level)))
            if w > 0 and h > 0:
                levels.append((level, (w, h)))
        
        for level, (w, h) in levels:
            level_dir = os.path.join(container, str(level))
            if not os.path.exists(level_dir):
                os.makedirs(level_dir)
            
            img_resized = image.resize((w, h), self.resize_filter or Image.Resampling.LANCZOS)
            
            cols = int(math.ceil(w / self.tile_size))
            rows = int(math.ceil(h / self.tile_size))

            for row in range(rows):
                for col in range(cols):
                    left = col * self.tile_size
                    top = row * self.tile_size
                    right = min(left + self.tile_size, w)
                    bottom = min(top + self.tile_size, h)
                    tile = img_resized.crop((left, top, right, bottom))
                    tile_path = os.path.join(level_dir, f"{col}_{row}.{self.tile_format}")
                    with open(tile_path, "wb") as f:
                        if self.tile_format.lower() in ["jpg", "jpeg"]:
                            tile.save(f, self.tile_format, quality=int(self.image_quality * 100))
                        else:
                            tile.save(f, self.tile_format)
        
        # --- MODIFIED SECTION: Write standard XML instead of JSON ---
        xml_content = (
            '<?xml version="1.0" encoding="UTF-8"?>\n'
            '<Image xmlns="http://schemas.microsoft.com/deepzoom/2008" '
            f'Format="{self.tile_format}" '
            f'Overlap="{self.tile_overlap}" '
            f'TileSize="{self.tile_size}">\n'
            f'    <Size Width="{width}" Height="{height}"/>\n'
            '</Image>'
        )
        with open(destination, "w") as f:
            f.write(xml_content)