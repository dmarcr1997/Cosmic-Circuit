import { PlanetViewer } from "./components/PlanetViewer";
import "./App.css"
import { useState } from "react";


function App() {
  const [planetId, setPlanetId] = useState(100155225);
  const handleSliderChange = (event: { target: { value: any; }; }) => {
    setPlanetId(Number(event.target.value));
  }; //for testing generation

  const handleNumberInputChange = (event: { target: { value: any; }; }) => {
    const value = Number(event.target.value);
    setPlanetId(value);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="mt-4">
        <input
          type="range"
          min="0"
          max="100200000"
          value={planetId}
          onChange={handleSliderChange}
          className="w-full max-w-md"
        />
        <div className="text-gray-300 text-center mt-2">
          Current Planet ID: {planetId}
        </div>
      </div>
      <div className="mt-4">
        <input
          type="number"
          min="100000000"
          max="100200000"
          value={planetId}
          onChange={handleNumberInputChange}
          className="border rounded p-2 text-gray-900"
        />
        <div className="text-gray-400 text-center mt-2">
          Enter a specific Planet ID
        </div>
      </div>
      <div className="w-full h-[80vh]">
        <PlanetViewer planetId={planetId} />
      </div>
    </div>

  );
}

export default App;
//try 340320 or 21342940 or 97586827