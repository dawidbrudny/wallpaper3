import React, { useState } from "react";
import WallpaperVisualizer from "./components/WallpaperVisualizer";
import "./App.css";

function App() {
  const [wallWidth, setWallWidth] = useState(800);
  const [wallHeight, setWallHeight] = useState(600);
  const [selectedWallpaper, setSelectedWallpaper] = useState("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedWallpaper(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="App">
      <div>
        <label>Wall Width (cm):</label>
        <input type="number" value={wallWidth} onChange={(e) => setWallWidth(parseInt(e.target.value))} />
      </div>
      <div>
        <label>Wall Height (cm):</label>
        <input type="number" value={wallHeight} onChange={(e) => setWallHeight(parseInt(e.target.value))} />
      </div>
      <div>
        <label>Upload Wallpaper:</label>
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </div>
      <WallpaperVisualizer wallWidth={wallWidth} wallHeight={wallHeight} selectedWallpaper={selectedWallpaper} />
    </div>
  );
}

export default App;
