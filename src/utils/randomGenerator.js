import {tumult} from "tumult"


export class RandomGenerator {

    static generatePerlin3(x, y, z) {
        return RandomGenerator.perlin.gen(x, y, z);
    }

    static generatePerlin3Octave(x, y, z, octave) {
        return RandomGenerator.perlin.octavate(octave, x, y, z);
    }

}

RandomGenerator.perlin = new tumult.Perlin3();
RandomGenerator.perlin.seed();
