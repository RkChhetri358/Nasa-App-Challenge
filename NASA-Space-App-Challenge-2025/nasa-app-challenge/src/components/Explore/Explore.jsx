import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
import OpenSeadragonViewer from "../OpenSeadragon/OpenSeadragonViewer";
import { FaGlobe, FaMapMarkedAlt } from "react-icons/fa";
import { SiNasa } from "react-icons/si";

export default function Explore() {
  const [planet, setPlanet] = useState("mercury");
  const [viewMode, setViewMode] = useState("2d");
  const [features, setFeatures] = useState([]);
  const proxy = "http://127.0.0.1:8000";

  const tileSources = {
    mercury: {
      width: 98304,
      height: 49152,
      tileSize: 256,
      minLevel: 0,
      maxLevel: 3,
      getTileUrl: (level, x, y) => `${proxy}/mercury/tiles/${level}/${y}/${x}.jpg`,
    },
  };

  useEffect(() => {
    AOS.init({ duration: 1500 });
    fetch(`${proxy}/mercury/labels?limit=500`)
      .then((res) => res.json())
      .then((data) => setFeatures(data))
      .catch(() => console.error("Failed to load features"));
  }, []);

  // Send feature search to 3D globe
  const sendToGlobe = (feature) => {
    const iframe = document.getElementById("globe-iframe");
    if (!iframe) return;
    iframe.contentWindow.postMessage({ type: "goto-feature", feature }, "*");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b132b] via-[#1c2541] to-[#3a506b] text-white flex flex-col items-center py-10 px-5">
      <motion.div data-aos="fade-down" className="flex items-center gap-3 mb-6">
        <SiNasa className="text-4xl text-sky-400" />
        <h1 className="text-3xl font-bold tracking-wide">
          Explore <span className="text-sky-300">{planet.toUpperCase()}</span>
        </h1>
      </motion.div>

      <motion.div data-aos="fade-left" className="flex gap-3 mb-8 flex-wrap justify-center">
        <button
          onClick={() => setViewMode("2d")}
          className={`flex items-center gap-2 px-5 py-2 rounded-lg font-semibold transition-all ${
            viewMode === "2d" ? "bg-green-500 hover:bg-green-400" : "bg-gray-700 hover:bg-gray-600"
          }`}
        >
          <FaMapMarkedAlt /> 2D Map
        </button>

        <button
          onClick={() => setViewMode("3d")}
          className={`flex items-center gap-2 px-5 py-2 rounded-lg font-semibold transition-all ${
            viewMode === "3d" ? "bg-green-500 hover:bg-green-400" : "bg-gray-700 hover:bg-gray-600"
          }`}
        >
          <FaGlobe /> 3D Globe
        </button>
      </motion.div>

      <motion.div data-aos="fade-up" className="mb-6 w-full max-w-2xl flex justify-center">
        <input
          type="text"
          placeholder="Search feature or coordinates (e.g. Caloris Basin or 23.5,45.2)"
          className="w-full px-4 py-2 rounded-l-lg bg-gray-800 text-white focus:outline-none"
          onKeyDown={async (e) => {
            if (e.key !== "Enter") return;
            const query = e.target.value.trim();
            if (!query) return;

            const coordMatch = query.match(/^(-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)$/);
            if (coordMatch) {
              const lat = parseFloat(coordMatch[1]);
              const lon = parseFloat(coordMatch[3]);
              if (viewMode === "2d") {
                window.dispatchEvent(
                  new CustomEvent("osd-goto", { detail: { x: lon, y: lat, zoom: 2 } })
                );
              } else sendToGlobe({ lat, lon });
              return;
            }

            try {
              const res = await fetch(`${proxy}/mercury/labels/${encodeURIComponent(query)}`);
              if (!res.ok) throw new Error();
              const data = await res.json();
              if (viewMode === "2d") {
                window.dispatchEvent(
                  new CustomEvent("osd-goto", { detail: { x: data.lon, y: data.lat, zoom: 2 } })
                );
              } else sendToGlobe(data);
            } catch {
              alert("Feature not found.");
            }
          }}
        />
      </motion.div>

      <motion.div
        data-aos="zoom-in"
        className="w-full max-w-6xl h-[600px] rounded-xl overflow-hidden shadow-2xl border border-gray-700"
      >
        {viewMode === "2d" ? (
          <OpenSeadragonViewer tileSource={tileSources[planet]} features={features} />
        ) : (
          <iframe
            id="globe-iframe"
            src={`${proxy}/mercury/3d`}
            width="100%"
            height="100%"
            style={{ border: "none" }}
            allowFullScreen
          />
        )}
      </motion.div>

      <footer className="mt-10 text-gray-400 text-sm">
        <p>Powered by NASA & AI — Built with ❤️</p>
      </footer>
    </div>
  );
}
