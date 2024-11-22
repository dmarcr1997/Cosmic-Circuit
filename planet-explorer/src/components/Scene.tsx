import { useEffect, RefObject } from "react";
import {
  Engine,
  Scene as BabylonScene,
  Vector3,
  Color4,
  ArcRotateCamera,
  HemisphericLight,
  MeshBuilder,
  StandardMaterial,
  Color3,
  Mesh,
} from "@babylonjs/core";

interface SceneProps {
  canvas: RefObject<HTMLCanvasElement>;
  planetId: number | null;
}

export const Scene = ({ canvas, planetId }: SceneProps) => {
  useEffect(() => {
    if (!canvas.current) return;

    // Initialize Babylon.js engine and scene
    const engine = new Engine(canvas.current, true);
    const scene = new BabylonScene(engine);

    // Set scene clear color
    scene.clearColor = new Color4(0, 0, 0, 1);

    // Create camera
    const camera = new ArcRotateCamera(
      "camera",
      0,
      Math.PI / 3,
      10,
      Vector3.Zero(),
      scene
    );
    camera.attachControl(canvas.current, true);
    camera.lowerRadiusLimit = 5;
    camera.upperRadiusLimit = 20;

    // Add lighting
    const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
    light.intensity = 0.7;

    // Create or update planet based on planetId
    const planet = MeshBuilder.CreateSphere(
      "planet",
      { diameter: 4, segments: 32 },
      scene
    );

    // Basic material for the planet
    const planetMaterial = new StandardMaterial("planetMaterial", scene);
    planetMaterial.diffuseColor = new Color3(0.4, 0.6, 0.8);
    planetMaterial.specularColor = new Color3(0.2, 0.2, 0.2);
    planet.material = planetMaterial;

    // Add rotation animation
    scene.registerBeforeRender(() => {
      planet.rotate(Vector3.Up(), 0.002);
    });

    // If we have a planetId, update the planet appearance
    if (planetId !== null) {
      // fetch planet data from planetNFT contract
      // and use to update planet's appearance
      updatePlanetAppearance(planet, planetId);
    }

    // Start the render loop
    engine.runRenderLoop(() => {
      scene.render();
    });

    // Handle window resize
    window.addEventListener("resize", () => {
      engine.resize();
    });

    // Cleanup
    return () => {
      scene.dispose();
      engine.dispose();
    };
  }, [canvas, planetId]);

  return null;
};

const updatePlanetAppearance = async (planet: Mesh, planetId: number) => {
  const features = generatePlanetFeatures(planetId);

  const planetMaterial = planet.material as StandardMaterial;

  planetMaterial.diffuseColor = new Color3(features.color.r, features.color.g, features.color.b);
};

const generatePlanetFeatures = (seed: number) => {
  // generate consistent planet features
  const random = (min: number, max: number) => {
    const x = Math.sin(seed++) * 10000;
    return min + (x - Math.floor(x)) * (max - min);
  };

  return {
    radius: random(2, 5),
    roughness: random(0.1, 0.5),
    atmosphere: random(0, 1) > 0.5,
    rings: random(0, 1) > 0.8,
    color: {
      r: random(0.2, 0.8),
      g: random(0.2, 0.8),
      b: random(0.2, 0.8),
    },
  };
};
