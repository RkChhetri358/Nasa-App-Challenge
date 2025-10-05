import { useEffect, useRef, useState } from "react";
import OpenSeadragon from "openseadragon";

export default function OpenSeadragonViewer({ tileSource, features = [] }) {
  const viewerRef = useRef(null);
  const overlaysRef = useRef([]);
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (viewerRef.current?.viewer) {
      viewerRef.current.viewer.destroy();
      viewerRef.current.viewer = null;
    }

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
      imageLoaderLimit: 3,
      tileSources: tileSource,
    });

    viewerRef.current.viewer = viewer;
    overlaysRef.current = [];

    const projectFeature = (lon, lat) => ({
      x: ((lon + 180) / 360) * tileSource.width,
      y: ((90 - lat) / 180) * tileSource.height,
    });

    features.forEach((feature) => {
      const { lon, lat, name } = feature;
      const { x, y } = projectFeature(lon, lat);

      const marker = document.createElement("div");
      marker.className =
        "absolute w-2 h-2 bg-red-500 rounded-full border border-yellow-300 shadow-md";
      marker.style.transform = "translate(-50%, -50%)";

      const label = document.createElement("div");
      label.className =
        "absolute text-[10px] text-yellow-300 bg-black/60 px-1 rounded mt-2 pointer-events-none whitespace-nowrap";
      label.style.transform = "translate(-50%, -50%)";
      label.textContent = name || "Unnamed";

      viewer.addOverlay({ element: marker, location: viewer.viewport.imageToViewportCoordinates(x, y) });
      viewer.addOverlay({ element: label, location: viewer.viewport.imageToViewportCoordinates(x, y) });

      overlaysRef.current.push({ marker, label, x, y, minZoom: feature.minZoom || 2 });
    });

    const updateOverlays = () => {
      const zoom = viewer.viewport.getZoom();
      overlaysRef.current.forEach((o) => {
        o.label.style.display = zoom >= o.minZoom ? "block" : "none";
      });
    };

    viewer.addHandler("open", updateOverlays);
    viewer.addHandler("animation", updateOverlays);
    viewer.addHandler("animation-finish", updateOverlays);
    viewer.addHandler("resize", updateOverlays);
    viewer.addHandler("zoom", updateOverlays);

    viewer.addHandler("canvas-hover", (event) => {
      const viewportPoint = viewer.viewport.pointFromPixel(event.position);
      const imagePoint = viewer.viewport.viewportToImageCoordinates(viewportPoint);
      setCoords({
        x: Math.round(imagePoint.x),
        y: Math.round(imagePoint.y),
      });
    });

    return () => viewer.destroy();
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
