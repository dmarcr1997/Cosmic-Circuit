// src/noisejs.d.ts
declare module "noisejs" {
  export class Noise {
    constructor(seed: number);
    simplex3(x: number, y: number, z: number): number;
    perlin3(x: number, y: number, z: number): number;
  }
}
