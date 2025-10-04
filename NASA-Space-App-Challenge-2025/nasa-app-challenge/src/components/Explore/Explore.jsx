import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
import OpenSeadragonViewer from "../OpenSeadragon/OpenSeadragonViewer";
import { FaRobot, FaGlobe, FaMapMarkedAlt } from "react-icons/fa";
import { SiNasa } from "react-icons/si";

export default function Explore() {
  const [planet, setPlanet] = useState("moon");
  const [viewMode, setViewMode] = useState("2d");
  const [detectMode, setDetectMode] = useState(false);
  const [features, setFeatures] = useState([]);

  const proxy = "http://127.0.0.1:8000";

  useEffect(() => {
    AOS.init({ duration: 1500 });
  }, []);

  // Run detection (fetch labels)
  const runDetection = async () => {
    try {
      const response = await fetch(`${proxy}/detect/${planet}`);
      const data = await response.json();
      setFeatures(data.features || []);
      alert(`🧠 AI detected ${data.features.length} features!`);
    } catch (err) {
      console.error("Detection failed:", err);
    }
  };

  // Tile sources
  const tileSources = {
    moon: {
      width: 21600,
      height: 10800,
      tileSize: 256,
      minLevel: 0,
      maxLevel: 7,
      getTileUrl: (level, x, y) =>
        `${proxy}/proxy/Moon/EQ/LRO_WAC_Mosaic_Global_303ppd_v02/1.0.0/default/default028mm/${level}/${y}/${x}.jpg`,
    },
    mercury: {
      width: 98304,
      height: 49152,
      tileSize: 256,
      minLevel: 0,
      maxLevel: 7,
      getTileUrl: (level, x, y) =>
        `${proxy}/mercury/2d?level=${level}&x=${x}&y=${y}`,
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b132b] via-[#1c2541] to-[#3a506b] text-white flex flex-col items-center py-10 px-5">
      <motion.div data-aos="fade-down" className="flex items-center gap-3 mb-6">
        <SiNasa className="text-4xl text-sky-400" />
        <h1 className="text-3xl font-bold tracking-wide">
          Explore <span className="text-sky-300">{planet.toUpperCase()}</span>
        </h1>
      </motion.div>

      <motion.div data-aos="fade-right" className="flex gap-3 mb-8 flex-wrap justify-center">
        {["moon", "mercury"].map((p) => (
          <button
            key={p}
            onClick={() => setPlanet(p)}
            className={`px-5 py-2 rounded-lg font-semibold transition-all duration-300 shadow-md ${
              planet === p ? "bg-sky-500 hover:bg-sky-400" : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
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

        {viewMode === "2d" && (
          <button
            onClick={() => setDetectMode(!detectMode)}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg font-semibold transition-all ${
              detectMode ? "bg-red-600 hover:bg-red-500" : "bg-yellow-500 hover:bg-yellow-400"
            }`}
          >
            <FaRobot /> {detectMode ? "Stop Detection" : "Detect Features"}
          </button>
        )}
      </motion.div>

      <motion.div
        data-aos="zoom-in"
        className="w-full max-w-6xl h-[600px] rounded-xl overflow-hidden shadow-2xl border border-gray-700"
      >
        {viewMode === "2d" ? (
          <OpenSeadragonViewer tileSource={tileSources[planet]} features={detectMode ? features : []} />
        ) : planet === "mercury" ? (
          <iframe
            src={`${proxy}/mercury/3d`}
            width="100%"
            height="100%"
            style={{ border: "none" }}
            allowFullScreen
          />
        ) : (
          <iframe
            src={`${proxy}/moon/3d`}
            width="100%"
            height="100%"
            style={{ border: "none" }}
            allowFullScreen
          />
        )}
      </motion.div>

      {detectMode && (
        <motion.button
          data-aos="fade-up"
          onClick={runDetection}
          className="mt-8 px-6 py-3 bg-orange-500 hover:bg-orange-400 text-white rounded-lg font-semibold shadow-lg flex items-center gap-2"
        >
          <FaRobot /> Run AI Detection
        </motion.button>
      )}

      <footer className="mt-10 text-gray-400 text-sm">
        <p>Powered by NASA & AI — Built with ❤️</p>
      </footer>
    </div>
  );
}
