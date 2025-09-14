
import React, { useState } from 'react';



import OpenSeadragonViewer from '../OpenSeadragon/OpenSeadragonViewer';


const Home = () => {
      const images = [
    {
      url: "https://openseadragon.github.io/example-images/duomo/duomo.dzi",
      label: "Duomo Cathedral",
    },
    {
      url: "https://openseadragon.github.io/example-images/highsmith/highsmith.dzi",
      label: "Highsmith Collection",
    },
    {
      url: "https://openseadragon.github.io/example-images/gael/gael.dzi",
      label: "Gael Image",
    },
    {
      url: "https://openseadragon.github.io/example-images/hamilton/hamilton.dzi",
      label: "Hamilton Illustration",
    },
  ];
   const [index, setIndex] = useState(0);

  const prevImage = () => {
    setIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  };

  const nextImage = () => {
    setIndex((i) => (i + 1) % images.length);
  };
    return (
        
        <>
    <div className="App" style={{ padding: "20px" }}>
      <center><h1>OpenSeadragon Gallery</h1>
</center>
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        <OpenSeadragonViewer tileSource={images[index].url} />


        <div
          style={{
            position: "absolute",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "rgba(0,0,0,0.5)",
            color: "#fff",
            padding: "5px 10px",
            borderRadius: "5px",
            pointerEvents: "none",
            fontSize: "16px",
          }}
        >
          {images[index].label}
        </div>
      </div>

      <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
        <button onClick={prevImage} style={{ padding: "10px 20px" }}>
          Previous
        </button>
        <button onClick={nextImage} style={{ padding: "10px 20px" }}>
          Next
        </button>
      </div>
    </div>



        </>
    );
};

export default Home;




