import { Perlin3 } from 'tumult'

export class RandomGenerator {

    static generatePerlin3(x, y, z) {
        return RandomGenerator.perlin.gen(x, y, z);
    }

}
RandomGenerator.perlin = new Perlin3();
RandomGenerator.perlin.seed();