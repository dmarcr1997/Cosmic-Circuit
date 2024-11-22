import { Mesh, Scene } from "@babylonjs/core";

export class PlanetGenerator {
  static createPlanet(scene: Scene, seed: number) {
    // Use seed to generate planet characteristics
    const radius = this.getRandomFromSeed(seed, 1, 3);

    // Create basic sphere for now
    // replace with proc gen based on seed later
    const planet = Mesh.CreateSphere("planet", 32, radius * 2, scene);

    // Add materials and features based on seed

    return planet;
  }

  private static getRandomFromSeed(seed: number, min: number, max: number) {
    const x = Math.sin(seed++) * 10000;
    return min + (x - Math.floor(x)) * (max - min);
  }
}
