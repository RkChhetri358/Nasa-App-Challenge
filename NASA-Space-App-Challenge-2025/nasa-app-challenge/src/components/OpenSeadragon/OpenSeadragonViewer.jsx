import { useEffect, useRef } from "react";
import OpenSeadragon from "openseadragon";

export default function OpenSeadragonViewer({ tileSource, features = [] }) {
  const viewerRef = useRef(null);

  useEffect(() => {
    // Destroy previous viewer if exists
    if (viewerRef.current?.viewer) {
      viewerRef.current.viewer.destroy();
      viewerRef.current.viewer = null;
    }

    // Initialize OpenSeadragon viewer
    viewerRef.current.viewer = OpenSeadragon({
      element: viewerRef.current,
      prefixUrl: "https://openseadragon.github.io/openseadragon/images/",
      showNavigationControl: true,
      tileSources: {
        width: tileSource.width,
        height: tileSource.height,
        tileSize: tileSource.tileSize,
        minLevel: tileSource.minLevel,
        maxLevel: tileSource.maxLevel,
        getTileUrl: tileSource.getTileUrl,
      },
    });

    const viewer = viewerRef.current.viewer;

    // Clear previous overlays
    viewer.clearOverlays();

    // Add markers for features
    features.forEach((feature) => {
      const elt = document.createElement("div");
      elt.style.width = "12px";
      elt.style.height = "12px";
      elt.style.background = "red";
      elt.style.borderRadius = "50%";
      elt.style.border = "2px solid white";
      elt.title = feature.name;

      // OpenSeadragon expects coordinates as fraction of the image
      const xFrac = (feature.lon + 180) / 360; // adjust if lon range differs
      const yFrac = (90 - feature.lat) / 180;  // adjust if lat range differs

      viewer.addOverlay({
        element: elt,
        location: viewer.viewport.imageToViewportRectangle(
          xFrac * tileSource.width,
          yFrac * tileSource.height,
          12,
          12
        ),
      });
    });

    return () => {
      if (viewerRef.current?.viewer) {
        viewerRef.current.viewer.destroy();
      }
    };
  }, [tileSource, features]);

  return <div ref={viewerRef} style={{ width: "100%", height: "100%" }} />;
}
