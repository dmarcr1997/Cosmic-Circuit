import { useRef } from "react";
import { Scene } from "./Scene";

interface PlanetViewerProps {
  planetId: number | null;
}

export const PlanetViewer = ({ planetId }: PlanetViewerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  return (
    <div className="w-full h-full relative">
      <canvas ref={canvasRef} className="w-full h-full rounded-lg" />
      <Scene canvas={canvasRef} planetId={planetId} />

      <div className="absolute bottom-4 left-4 text-white text-sm">
        {planetId ? `Viewing Planet #${planetId}` : "No planet selected"}
      </div>
    </div>
  );
};
