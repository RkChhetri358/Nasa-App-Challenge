import { useState } from "react";
import Home from "./components/Home/Home";
import Navbar from "./components/Navbar/Navbar";

import CarouselHome from "./components/Carousel/CarouselHome";
import SpacePeekCards from "./components/Cards/SpacePeekCards";
import Footer from "./components/Footer/Footer";
// import OpenSeadragonViewer from "./components/OpenSeadragon/OpenSeadragonViewer";

export default function App() {


  return (
    <div> 
<Navbar/>
     
<Home/>
   
<SpacePeekCards/>

     <Footer/>
      
    </div>
  );
}
