import { PlanetViewer } from "./components/PlanetViewer";
import "./App.css"


function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="w-full h-[80vh]">
        <PlanetViewer planetId={1234911234500000020} />
      </div>
    </div>

  );
}

export default App;
