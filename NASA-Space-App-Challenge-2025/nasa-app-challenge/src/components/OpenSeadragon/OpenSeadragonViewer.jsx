



import { useEffect, useRef, useState } from "react";
import OpenSeadragon from "openseadragon";

export default function OpenSeadragonViewer({ tileSource, features = [] }) {
  const viewerRef = useRef(null);
  const overlayLayerRef = useRef(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Cleanup previous viewer instance
    if (viewerRef.current?.viewer) {
      viewerRef.current.viewer.destroy();
      viewerRef.current.viewer = null;
    }

    // Initialize OpenSeadragon viewer
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
      timeout: 60000,
      imageLoaderLimit: 3,
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

    // Create overlay container
    const overlayLayer = document.createElement("div");
    overlayLayer.className =
      "absolute top-0 left-0 w-full h-full pointer-events-none";
    viewer.container.appendChild(overlayLayer);
    overlayLayerRef.current = overlayLayer;

    // Function: Convert lon/lat → image coordinates (equirectangular projection)
    const projectFeature = (lon, lat) => {
      const x = ((lon + 180) / 360) * tileSource.width;
      const y = ((90 - lat) / 180) * tileSource.height;
      return { x, y };
    };

    // Function: Render crater dots + labels
    const renderLabels = () => {
      if (!overlayLayerRef.current) return;
      overlayLayerRef.current.innerHTML = ""; // clear previous overlays

      features.forEach((feature) => {
        const { lon, lat, name } = feature;
        const { x, y } = projectFeature(lon, lat);

        // Create marker (red dot)
        const marker = document.createElement("div");
        marker.className =
          "absolute w-2 h-2 bg-red-500 rounded-full border border-yellow-300 shadow-md";
        marker.style.transform = "translate(-50%, -50%)";

        // Create label (name text)
        const label = document.createElement("div");
        label.className =
          "absolute text-[10px] text-yellow-300 bg-black/60 px-1 rounded mt-2 pointer-events-none whitespace-nowrap";
        label.style.transform = "translate(-50%, -50%)";
        label.textContent = name || "Unnamed";

        // Convert image coords → viewport coords
        const point = viewer.viewport.imageToViewportCoordinates(x, y);

        // Add overlays to viewer
        viewer.addOverlay({ element: marker, location: point });
        viewer.addOverlay({ element: label, location: point });
      });
    };

    // Render overlays when the map opens or moves
    viewer.addHandler("open", renderLabels);
    viewer.addHandler("animation", renderLabels);
    viewer.addHandler("animation-finish", renderLabels);
    viewer.addHandler("resize", renderLabels);

    // Display cursor coordinates
    viewer.addHandler("canvas-hover", (event) => {
      const webPoint = event.position;
      const viewportPoint = viewer.viewport.pointFromPixel(webPoint);
      const imagePoint = viewer.viewport.viewportToImageCoordinates(viewportPoint);
      setCoords({
        x: Math.round(imagePoint.x),
        y: Math.round(imagePoint.y),
      });
    });

    return () => {
      if (viewerRef.current?.viewer) viewerRef.current.viewer.destroy();
    };
  }, [tileSource, features]);

  return (
    <div className="relative w-full h-full">
      <div ref={viewerRef} className="w-full h-full" />
      <div className="absolute bottom-2 left-2 bg-black/60 text-white px-3 py-1 rounded text-sm">
        🧭 X: {coords.x} | Y: {coords.y}
      </div>
    </div>
  );
}