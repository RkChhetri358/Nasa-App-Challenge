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
  const proxy = "http://127.0.0.1:8000";

  const tileSources = {
    mercury: {
      width: 98304, // Full image width approx for zoom 3
      height: 49152,
      tileSize: 256,
      minLevel: 0,
      maxLevel: 3,
      getTileUrl: (level, x, y) => `${proxy}/mercury/tiles/${level}/${y}/${x}.jpg`,
    },
  };

  useEffect(() => {
    AOS.init({ duration: 1500 });
  }, []);

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
                if (e.key === "Enter") {
                  const query = e.target.value.trim();
                  if (!query) return;

                  // Example: If coordinates entered as "lat,lon"
                  const coordMatch = query.match(/^(-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)$/);
                  if (coordMatch) {
                    const lat = parseFloat(coordMatch[1]);
                    const lon = parseFloat(coordMatch[3]);
                    // Convert lat/lon to image coordinates (dummy example, replace with real conversion)
                    // For Mercury, let's assume equirectangular projection
                    const { width, height } = tileSources[planet];
                    const x = ((lon + 180) / 360) * width;
                    const y = ((90 - lat) / 180) * height;
                    window.dispatchEvent(
                      new CustomEvent("osd-goto", { detail: { x, y, zoom: 1.5 } })
                    );
                    return;
                  }

                  // Otherwise, treat as feature name: fetch coordinates from backend
                  try {
                    const res = await fetch(`${proxy}/mercury/features/search?q=${encodeURIComponent(query)}`);
                    if (res.ok) {
                      const data = await res.json();
                      if (data && data.x !== undefined && data.y !== undefined) {
                        window.dispatchEvent(
                          new CustomEvent("osd-goto", { detail: { x: data.x, y: data.y, zoom: 2 } })
                        );
                      } else {
                        alert("Feature not found.");
                      }
                    } else {
                      alert("Feature not found.");
                    }
                  } catch {
                    alert("Error searching for feature.");
                  }
                }
              }}
            />
            <button
              className="px-4 py-2 rounded-r-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold"
              onClick={async () => {
                const input = document.querySelector("input[placeholder^='Search feature']");
                if (!input) return;
                const query = input.value.trim();
                if (!query) return;

                const coordMatch = query.match(/^(-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)$/);
                if (coordMatch) {
                  const lat = parseFloat(coordMatch[1]);
                  const lon = parseFloat(coordMatch[3]);
                  const { width, height } = tileSources[planet];
                  const x = ((lon + 180) / 360) * width;
                  const y = ((90 - lat) / 180) * height;
                  window.dispatchEvent(
                    new CustomEvent("osd-goto", { detail: { x, y, zoom: 1.5 } })
                  );
                  return;
                }

                try {
                  const res = await fetch(`${proxy}/mercury/features/search?q=${encodeURIComponent(query)}`);
                  if (res.ok) {
                    const data = await res.json();
                    if (data && data.x !== undefined && data.y !== undefined) {
                      window.dispatchEvent(
                        new CustomEvent("osd-goto", { detail: { x: data.x, y: data.y, zoom: 2 } })
                      );
                    } else {
                      alert("Feature not found.");
                    }
                  } else {
                    alert("Feature not found.");
                  }
                } catch {
                  alert("Error searching for feature.");
                }
              }}
            >
              Search
            </button>
          </motion.div>
      <motion.div
        data-aos="zoom-in"
        className="w-full max-w-6xl h-[600px] rounded-xl overflow-hidden shadow-2xl border border-gray-700"
      >



        {viewMode === "2d" ? (
          <OpenSeadragonViewer tileSource={tileSources[planet]} features={[]} />
        ) : (
          <iframe
            src={`${proxy}/mercury/3d`}
            width="100%"
            height="100%"
            style={{ border: "none" }}
            allowFullScreen
          />
        )}
      </motion.div>

   
    </div>
  );
}
