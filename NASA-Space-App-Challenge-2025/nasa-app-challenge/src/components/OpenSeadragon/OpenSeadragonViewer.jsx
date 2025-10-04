import { useEffect, useRef, useState } from "react";
import OpenSeadragon from "openseadragon";

export default function OpenSeadragonViewer({ tileSource, features = [] }) {
  const viewerRef = useRef(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const markersRef = useRef([]);

  useEffect(() => {
    // Destroy previous viewer
    if (viewerRef.current?.viewer) {
      viewerRef.current.viewer.destroy();
      viewerRef.current.viewer = null;
    }

    // Initialize viewer
    const viewer = OpenSeadragon({
      element: viewerRef.current,
      prefixUrl: "https://openseadragon.github.io/openseadragon/images/",
      showNavigator: true,
      navigatorPosition: "BOTTOM_RIGHT",
      showNavigationControl: true,
      immediateRender: true,
      preload: true,
      preserveViewport: false,
      animationTime: 1.2,
      blendTime: 0.5,
      minZoomLevel: 0.5,
      maxZoomPixelRatio: 2,
      visibilityRatio: 1,
      constrainDuringPan: true,
      tileSources: {
        width: tileSource.width,
        height: tileSource.height,
        tileSize: tileSource.tileSize,
        minLevel: tileSource.minLevel,
        maxLevel: tileSource.maxLevel,
        getTileUrl: tileSource.getTileUrl,
      },
    });

    viewerRef.current.viewer = viewer;

    // Clear overlays if any
    viewer.clearOverlays();
    markersRef.current = [];

    // --- 🧭 Mouse Coordinate Tracker ---
    viewer.addHandler("canvas-hover", (event) => {
      const webPoint = event.position;
      const viewportPoint = viewer.viewport.pointFromPixel(webPoint);
      const imagePoint = viewer.viewport.viewportToImageCoordinates(viewportPoint);
      setCoords({
        x: Math.round(imagePoint.x),
        y: Math.round(imagePoint.y),
      });
    });

    // --- 📌 Click to Add Marker ---
    viewer.addHandler("canvas-click", (event) => {
      if (event.quick) {
        const point = viewer.viewport.pointFromPixel(event.position);
        const overlay = document.createElement("div");
        overlay.className = "user-marker";
        overlay.title = `Marker (${Math.round(point.x)}, ${Math.round(point.y)})`;
        overlay.style.width = "14px";
        overlay.style.height = "14px";
        overlay.style.background = "#00ffff";
        overlay.style.border = "2px solid white";
        overlay.style.borderRadius = "50%";
        overlay.style.cursor = "pointer";
        overlay.style.transition = "transform 0.3s";
        overlay.onmouseenter = () => (overlay.style.transform = "scale(1.5)");
        overlay.onmouseleave = () => (overlay.style.transform = "scale(1)");

        viewer.addOverlay({
          element: overlay,
          location: point,
        });

        markersRef.current.push(point);
      }
    });

    // --- 🧠 AI Feature Overlays ---
    features.forEach((feature) => {
      const label = document.createElement("div");
      label.className = "feature-label";
      label.style.position = "absolute";
      label.style.background = "rgba(0,0,0,0.6)";
      label.style.color = "white";
      label.style.padding = "2px 5px";
      label.style.borderRadius = "4px";
      label.style.fontSize = "12px";
      label.style.whiteSpace = "nowrap";
      label.innerText = feature.name || "Feature";

      const xFrac = (feature.lon + 180) / 360;
      const yFrac = (90 - feature.lat) / 180;

      viewer.addOverlay({
        element: label,
        location: viewer.viewport.imageToViewportRectangle(
          xFrac * tileSource.width,
          yFrac * tileSource.height,
          12,
          12
        ),
      });
    });

    // --- 📸 Snapshot Export on "S" Key ---
    window.addEventListener("keydown", async (e) => {
      if (e.key.toLowerCase() === "s") {
        const canvas = viewer.drawer.canvas;
        const link = document.createElement("a");
        link.download = "snapshot.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
      }
    });

    // Cleanup
    return () => {
      if (viewerRef.current?.viewer) {
        viewerRef.current.viewer.destroy();
      }
    };
  }, [tileSource, features]);

  return (
    <div className="relative w-full h-full">
      <div ref={viewerRef} className="w-full h-full" />
      
      {/* Coordinate Display */}
      <div className="absolute bottom-2 left-2 bg-black/60 text-white px-3 py-1 rounded text-sm">
        🧭 X: {coords.x} | Y: {coords.y}
      </div>

      <style>{`
        .user-marker:hover {
          transform: scale(1.5);
        }
        .feature-label {
          pointer-events: none;
          text-shadow: 0 0 4px black;
        }
      `}</style>
    </div>
  );
}
