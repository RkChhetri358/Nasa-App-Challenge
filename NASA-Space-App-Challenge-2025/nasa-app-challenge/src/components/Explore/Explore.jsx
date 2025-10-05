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

  // Supported planets
  const planets = ["mercury", "venus", "moon", "mars"];

  // Dynamically construct tileSources for planets
  const tileSources = planets.reduce((acc, p) => {
    acc[p] = {
      width: 98304, // adjust if needed per planet
      height: 49152,
      tileSize: 256,
      minLevel: 0,
      maxLevel: 7,
      getTileUrl: (level, x, y) =>
        `${proxy}/proxy/${p.charAt(0).toUpperCase() + p.slice(1)}/EQ/${p
          .charAt(0)
          .toUpperCase() + p.slice(1)}_MESSENGER_MDIS_Basemap_BDR_Mosaic_Global_166m/1.0.0/default/default028mm/${level}/${y}/${x}.jpg`,
    };
    return acc;
  }, {});

  useEffect(() => {
    AOS.init({ duration: 1500 });
    fetchLabels();
  }, [planet]);

  // Fetch feature/crater labels from backend
  const fetchLabels = async () => {
    try {
      const res = await fetch(`${proxy}/${planet}/labels`);
      const data = await res.json();
      setFeatures(data); // backend returns an array
      console.log(`✅ Loaded ${data.length} ${planet} features`);
    } catch (err) {
      console.error("Failed to fetch labels:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b132b] via-[#1c2541] to-[#3a506b] text-white flex flex-col items-center py-10 px-5">
      <motion.div data-aos="fade-down" className="flex items-center gap-3 mb-6">
        <SiNasa className="text-4xl text-sky-400" />
        <h1 className="text-3xl font-bold tracking-wide">
          Explore <span className="text-sky-300">{planet.toUpperCase()}</span>
        </h1>
      </motion.div>

      {/* Planet Selector */}
      <motion.div data-aos="fade-left" className="flex gap-3 mb-8 flex-wrap justify-center">
        {planets.map((p) => (
          <button
            key={p}
            onClick={() => setPlanet(p)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              planet === p ? "bg-green-500 hover:bg-green-400" : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            {p.toUpperCase()}
          </button>
        ))}
      </motion.div>

      {/* View Mode Toggle */}
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

      {/* Viewer */}
      <motion.div data-aos="zoom-in" className="w-full max-w-6xl h-[600px] rounded-xl overflow-hidden shadow-2xl border border-gray-700">
        {viewMode === "2d" ? (
          <OpenSeadragonViewer tileSource={tileSources[planet]} features={features} />
        ) : (
          <iframe
            src={`${proxy}/${planet}/3d?with_labels=true`}
            width="100%"
            height="100%"
            style={{ border: "none" }}
            allowFullScreen
          />
        )}
      </motion.div>

      <footer className="mt-10 text-gray-400 text-sm">
        <p>Powered by NASA & AI — Built with ❤</p>
      </footer>
    </div>
  );
}
