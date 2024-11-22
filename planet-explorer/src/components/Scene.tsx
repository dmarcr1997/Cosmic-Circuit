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
  VertexData,
} from "@babylonjs/core";
import Noise from "noisejs";

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


    // If we have a planetId, update the planet appearance
    if (planetId !== null) {
      // fetch planet data from planetNFT contract
      // and use to update planet's appearance
      createPlanet(planetId, scene);
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

const applyTerrain = (planet: Mesh, roughness: number, seed: number) => {
  const noise = new Noise.Noise(seed);
  const positions = planet.getVerticesData("position")!;
  const indices = planet.getIndices()!; // Needed to compute normals
  const normals = new Float32Array(positions.length); // Placeholder for recalculated normals

  // const scaling = 30; // Adjust this for visible noise patterns V1
  //V2
  // const scaling = 10;
  // const flattenFactor = 0.5;

  //V3
  const scaling = 5; // Lower scaling for broader noise features
  const plateauThreshold = 0.4; // Controls the flatness of certain areas
  const amplitude = 0.2; // Maximum displacement amplitude for subtle variations

  for (let i = 0; i < positions.length; i += 3) {
    const x = positions[i];
    const y = positions[i + 1];
    const z = positions[i + 2];
    const length = Math.sqrt(x * x + y * y + z * z);
    const nx = x / length;
    const ny = y / length;
    const nz = z / length;

    // Generate noise value V1
    // const noiseValue = noise.perlin3(nx * scaling, ny * scaling, nz * scaling);

    // Apply displacement V1
    // const displacement = 1 + noiseValue * roughness; 
    //V2
    // const lowFreqNoise = noise.perlin3(nx * scaling, ny * scaling, nz * scaling);
    // const highFreqNoise = noise.perlin3(nx * scaling * 2, ny * scaling * 2, nz * scaling * 2);

    // const combinedNoise = lowFreqNoise * 0.8 + highFreqNoise * 0.2;
    // const displacement = 1 + combinedNoise * roughness * Math.pow(1 - combinedNoise, flattenFactor);

    //V3
    const baseNoise = noise.perlin3(nx * scaling, ny * scaling, nz * scaling);
    const refinedNoise = Math.max(-1, Math.min(1, baseNoise * 0.6));
    const elevationWeight = Math.pow(1 - Math.abs(refinedNoise), plateauThreshold);

    // Final displacement with smoothing
    const displacement = 1 + refinedNoise * roughness * amplitude * elevationWeight;

    positions[i] = nx * length * displacement;
    positions[i + 1] = ny * length * displacement;
    positions[i + 2] = nz * length * displacement;
  }

  // Compute new normals based on the updated positions
  VertexData.ComputeNormals(positions, indices, normals);

  const vertexData = new VertexData();
  vertexData.positions = positions;
  vertexData.indices = indices;
  vertexData.normals = normals;
  
  // Apply it to the mesh
  vertexData.applyToMesh(planet, true);

  planet.forceSharedVertices();
  planet.refreshBoundingInfo();
};


const createAtmosphere = (radius: number, scene: BabylonScene) => {
  const atmosphere = MeshBuilder.CreateSphere(
    "atmosphere",
    {diameter: radius * 3, segments: 32 },
    scene
  )

  const atmosphereMaterial = new StandardMaterial("atmosphereMaterial", scene);
  atmosphereMaterial.emissiveColor = new Color3(0.5, 0.5, 1.0);
  atmosphereMaterial.alpha = 0.3; // Transparency
  atmosphere.material = atmosphereMaterial;
}

const createRings = (scene: BabylonScene, radius: number) => {
  const ring = MeshBuilder.CreateTorus(
    "ring",
    { diameter: radius * 3.5, thickness: 0.05, tessellation: 64 },
    scene
  );

  const ringMaterial = new StandardMaterial("ringMaterial", scene);
  ringMaterial.diffuseColor = new Color3(0.8, 0.8, 0.5);
  ringMaterial.alpha = 0.7; // Semi-transparent rings
  ring.material = ringMaterial;

  ring.rotation.x = Math.PI / 2; // Align with the planet's equator
};

const createPlanet = async (planetId: number, scene: BabylonScene) => {
    const features = generatePlanetFeatures(planetId);
    // Create or update planet based on planetId
    const planet = MeshBuilder.CreateSphere(
      "planet",
      { diameter: features.radius * 2, segments: 64 },
      scene
    );

    // Basic material for the planet
    const basePlanetMaterial = new StandardMaterial("planetMaterial", scene);
    basePlanetMaterial.diffuseColor = new Color3(0.4, 0.6, 0.8);
    basePlanetMaterial.specularColor = new Color3(0.2, 0.2, 0.2);
    planet.material = basePlanetMaterial;

    // Add rotation animation
    scene.registerBeforeRender(() => {
      planet.rotate(Vector3.Up(), 0.002);
    });


    const planetMaterial = planet.material as StandardMaterial;

    planetMaterial.diffuseColor = new Color3(features.color.r, features.color.g, features.color.b);
    applyTerrain(planet, features.roughness, planetId);
    if (features.atmosphere) {
      createAtmosphere(features.radius, scene);
    }

    // Add rings
    if (features.rings) {
      createRings(scene, features.radius);
    }
};

const generatePlanetFeatures = (seed: number) => {
  // generate consistent planet features
  const random = (min: number, max: number) => {
    const x = Math.sin(seed++) * 10000;
    return min + (x - Math.floor(x)) * (max - min);
  };

  return {
    radius: random(1, 4),
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
