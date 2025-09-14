import { useState } from "react";
import Home from "./components/Home/Home";
import Navbar from "./components/Navbar/Navbar";
import Carousel from "./components/Carousel/Carousel";
import CarouselHome from "./components/Carousel/CarouselHome";
// import OpenSeadragonViewer from "./components/OpenSeadragon/OpenSeadragonViewer";

export default function App() {


  return (
    <div> 
<Navbar/>
     

<CarouselHome/>
   
      
<Carousel/>

     
      {/* <Home/>  */}
      
    </div>
  );
}
