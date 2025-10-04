import { Route, Routes } from "react-router-dom";
import Home from "./components/Home/Home";
import Navbar from "./components/Navbar/Navbar";
import SpacePeekCards from "./components/Cards/SpacePeekCards";
import Footer from "./components/Footer/Footer";
import Explore from "./components/Explore/Explore";

export default function App() {
  return (
    <div>
      <Navbar />

      <Routes>
        <Route path="/" element={<>
          <Home />
         
        </>} />
        
        <Route path="/explore" element={<Explore />} />
<<<<<<< HEAD
        <Route path="/SpacePeekCards" element={<SpacePeekCards />} />

      </Routes>
 <SpacePeekCards />
          <Footer />      
=======

      </Routes>
 <SpacePeekCards />
          {/* <Footer />       */}
>>>>>>> f64067d6d950b993e8e6a3eda0eb705018e04247
    </div>
  );
}
