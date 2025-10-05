import { Route, Routes } from "react-router-dom";
import Home from "./components/Home/Home";
import Navbar from "./components/Navbar/Navbar";
import SpacePeekCards from "./components/Cards/SpacePeekCards";
import Footer from "./components/Footer/Footer";
import Explore from "./components/Explore/Explore";
import About from "./components/About/About";

export default function App() {
  return (
    <div>
      <Navbar />

      <Routes>
        <Route path="/" element={<>
          <Home />
         
        </>} />
        
        <Route path="/explore" element={<Explore />} />
        <Route path="/SpacePeekCards" element={<SpacePeekCards />} />
        <Route path="/about" element={<About/>} />

      </Routes>
 {/* <SpacePeekCards /> */}
 
          <Footer />      
    </div>
  );
}
