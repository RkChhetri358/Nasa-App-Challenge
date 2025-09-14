import { useEffect, useRef } from "react";
import OpenSeadragon from "openseadragon";

export default function OpenSeadragonViewer({ tileSource, maxZoom = 10 }) {
  const viewerRef = useRef(null);

  useEffect(() => {
    if (viewerRef.current && viewerRef.current.viewer) {
      viewerRef.current.viewer.destroy();
      viewerRef.current.viewer = null;
    }

    const viewer = OpenSeadragon({
      element: viewerRef.current,
      prefixUrl: "https://openseadragon.github.io/openseadragon/images/",
      tileSources: tileSource,
      crossOriginPolicy: "Anonymous",
      showNavigator: true,
      minZoomLevel: 0,        // default zoom
      maxZoomPixelRatio: maxZoom, // maximum zoom
    });

    viewer.addHandler("open", () => {
      viewer.viewport.zoomTo(0.3); // start fully zoomed out
    });

    viewerRef.current.viewer = viewer;

    return () => viewer.destroy();
  }, [tileSource, maxZoom]);

  return (
    <div
      ref={viewerRef}
      style={{ width: "100%", height: "600px", background: "#000" }}
    />
  );
}
