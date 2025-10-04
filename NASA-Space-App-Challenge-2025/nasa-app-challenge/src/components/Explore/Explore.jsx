import React, { useEffect, useState } from "react";
import AOS from "aos";
import OpenSeadragonViewer from "../OpenSeadragon/OpenSeadragonViewer";

export default function Explore() {
  const [planet, setPlanet] = useState("mars");
  const [viewMode, setViewMode] = useState("2d");
  const [detectMode, setDetectMode] = useState(false);
  const [features, setFeatures] = useState([]);

  useEffect(() => { AOS.init({ duration: 2000 }); }, []);

  const proxy = "http://127.0.0.1:8000/proxy";

  const runDetection = async () => {
    const level = 0;
    const tileUrl =
      planet === "mars"
        ? `${proxy}/Mars/EQ/Mars_Viking_MDIM21_ClrMosaic_global_232m/1.0.0/default/default028mm/${level}/0/0.jpg?detect=true`
        : planet === "moon"
        ? `${proxy}/Moon/EQ/LRO_WAC_Mosaic_Global_303ppd_v02/1.0.0/default/default028mm/${level}/0/0/0.jpg?detect=true`
        : planet === "mercury"
        ? `${proxy}/Mercury/EQ/Mercury_MESSENGER_MDIS_Basemap_BDR_Mosaic_Global_166m/1.0.0/default/default028mm/${level}/0/0/0.jpg?detect=true`
        : `${proxy}/Venus/EQ/Venus_Magellan_C3-MDIR_Global_Mosaic_2025m/1.0.0/default/default028mm/${level}/0/0/0.jpg?detect=true`;

    try {
      const response = await fetch(tileUrl);
      const data = await response.json();
      setFeatures(data.features || []);
      alert(`Detected ${data.features.length} features!`);
    } catch (err) {
      console.error("AI detection failed:", err);
    }
  };

  const tileSources = {
    mars: {
      width: 65536,
      height: 32768,
      tileSize: 256,
      minLevel: 0,
      maxLevel: 7,
      getTileUrl: (level, x, y) =>
        `${proxy}/Mars/EQ/Mars_Viking_MDIM21_ClrMosaic_global_232m/1.0.0/default/default028mm/${level}/${y}/${x}.jpg`,
    },
    moon: {
      width: 21600,
      height: 10800,
      tileSize: 256,
      minLevel: 0,
      maxLevel: 7,
      getTileUrl: (level, x, y) =>
        `${proxy}/Moon/EQ/LRO_WAC_Mosaic_Global_303ppd_v02/1.0.0/default/default028mm/${level}/${y}/${x}.jpg`,
    },
    mercury: {
      width: 98304,
      height: 49152,
      tileSize: 256,
      minLevel: 0,
      maxLevel: 7,
      getTileUrl: (level, x, y) =>
        `${proxy}/Mercury/EQ/Mercury_MESSENGER_MDIS_Basemap_BDR_Mosaic_Global_166m/1.0.0/default/default028mm/${level}/${y}/${x}.jpg`,
    },
    venus: {
      width: 23040,
      height: 11520,
      tileSize: 256,
      minLevel: 0,
      maxLevel: 7,
      getTileUrl: (level, x, y) =>
        `${proxy}/Venus/EQ/Venus_Magellan_C3-MDIR_Global_Mosaic_2025m/1.0.0/default/default028mm/${level}/${y}/${x}.jpg`,
    },
  };

  return (
    <div style={{ padding: "20px", backgroundColor: "#2f3b52", color: "#fff" }}>
      <h1>Explore {planet.toUpperCase()}</h1>

      <div style={{ marginBottom: "20px" }}>
        {["mars", "moon", "mercury", "venus"].map((p) => (
          <button
            key={p}
            onClick={() => setPlanet(p)}
            style={{
              marginRight: "10px",
              padding: "8px 16px",
              backgroundColor: planet === p ? "#337ab7" : "#555",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>

      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={() => setViewMode("2d")}
          style={{
            marginRight: "10px",
            padding: "8px 16px",
            backgroundColor: viewMode === "2d" ? "#28a745" : "#555",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          2D Map
        </button>
        <button
          onClick={() => setViewMode("3d")}
          style={{
            padding: "8px 16px",
            backgroundColor: viewMode === "3d" ? "#28a745" : "#555",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          3D Globe
        </button>
        {viewMode === "2d" && (
          <button
            onClick={() => setDetectMode(!detectMode)}
            style={{
              marginLeft: "10px",
              padding: "8px 16px",
              backgroundColor: detectMode ? "#dc3545" : "#ffc107",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            {detectMode ? "Stop Detection" : "Detect Features"}
          </button>
        )}
      </div>

      <div style={{ width: "100%", height: "600px" }}>
        {viewMode === "2d" ? (
        <OpenSeadragonViewer
  tileSource={tileSources[planet]}
  features={detectMode ? features : []}
/>
        ) : (
          <iframe
            src={`https://eyes.nasa.gov/apps/solar-system/#/${planet}?embed=true`}
            width="100%"
            height="100%"
            style={{ border: "none" }}
            allowFullScreen
          />
        )}
      </div>

      {detectMode && (
        <button
          onClick={runDetection}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            backgroundColor: "#ff5722",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Run AI Detection
        </button>
      )}
    </div>
  );
}
// import React from 'react'
// import ModelViewers from '../Model Viewer/ModelViewer'
// // import ModelViewer from '../Model Viewer/ModelViewers'

// export default function Explore() {
//   return (
    
//     <div>
      
      
//  <ModelViewers
//   url="https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/main/2.0/ToyCar/glTF-Binary/ToyCar.glb"
//   width={1000}
//   height={1000}
// /> 


//     </div>
//   )
// }

