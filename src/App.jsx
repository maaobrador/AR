import { Route, Routes } from "react-router-dom";
import "./App.css";
import XrGalleryContainer from "./components/xr-gallery/XrGalleryContainer";

function App() {
  return (
    <Routes>
      <Route path="/" element={<XrGalleryContainer />} />
      <Route path="/xr-gallery" element={<XrGalleryContainer />} />
    </Routes>
  );
}

export default App;