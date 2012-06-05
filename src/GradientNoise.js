/**
 * Gradient Noise
 *
 * src: http://mrl.nyu.edu/~perlin/doc/oscar.html#noise
 * src2: http://code.google.com/p/processing/source/browse/trunk/processing/java/libraries/opengl/examples/Advanced/Planets/Perlin.pde?spec=svn9511&r=9511
 * src3: http://www.gamedev.net/topic/291699-blocky-perlin-noise-pics-included/
 */

define([
        './PRNG'
    ],
    function(PRNG) {

    // own PRNG instance
    var pseudoRandom = new PRNG().random;

    var randomFloat = function() {
        return pseudoRandom() * 2 - 1;    // output: [-1, 1]
        //return ((pseudoRandom() * (MASK + MASK) - MASK)) / MASK;    // output: [-1, 1]
    };

    var MASK = 256, // B
        MAXIM = 4096,   // N
        permutationTable = new Array(MASK + MASK),  // p
        randomTable = new Array(MASK + MASK);   // g1

    var X =  { int0: 0, int1: 0, frac0: 0, frac1: 0 },
        Y =  { int0: 0, int1: 0, frac0: 0, frac1: 0 },
        Z =  { int0: 0, int1: 0, frac0: 0, frac1: 0 };

    var s_curve = function(t) {
        return t * t * (3 - 2 * t);
    };

    var lerp = function(t, a, b) {
        return a + t * (b - a);
    };

    var setup = function(p, P)
    {
        var t = p + MAXIM;
        var intT = Math.floor(t);

        P.int0 = Math.floor(intT % MASK);
        P.int1 = Math.floor((P.int0 + 1) % MASK);
        P.frac0 = t - intT;
        P.frac1 = P.frac0 - 1;
    };

    var noise1 = function(x) {
        setup(x, X);

        var index0 = permutationTable[X.int0];
        var index1 = permutationTable[X.int1];

        var sx = s_curve(X.frac0);

        var u = X.frac0 * randomTable[index0].x;
        var v = X.frac1 * randomTable[index1].x;

        return lerp(sx, u, v);
    };

    var noise2 = function(x, y) {
        setup(x, X);
        setup(y, Y);

        var index0 = permutationTable[X.int0];
        var index1 = permutationTable[X.int1];

        var corner0 = permutationTable[index0 + Y.int0];
        var corner1 = permutationTable[index1 + Y.int0];
        var corner2 = permutationTable[index0 + Y.int1];
        var corner3 = permutationTable[index1 + Y.int1];

        var sx = s_curve(X.frac0);
        var sy = s_curve(Y.frac0);

        var v, kx, ky;
        v = randomTable[corner0];   
        kx = X.frac0 * v.x + Y.frac0 * v.y;
        v = randomTable[corner1]; 	
        ky = X.frac1 * v.x + Y.frac0 * v.y;
        var a = lerp(sx, kx, ky);

        v = randomTable[corner2]; 	
        kx = X.frac0 * v.x + Y.frac1 * v.y;
        v = randomTable[corner3]; 	
        ky = X.frac1 * v.x + Y.frac1 * v.y;
        var b = lerp(sx, kx, ky);

        return lerp(sy, a, b);
    };

    var noise3 = function(x, y, z) {
        setup(x, X);
        setup(y, Y);
        setup(z, Z);

        var index0 = permutationTable[X.int0];
        var index1 = permutationTable[X.int1];

        var corner0 = permutationTable[index0 + Y.int0];
        var corner1 = permutationTable[index1 + Y.int0];
        var corner2 = permutationTable[index0 + Y.int1];
        var corner3 = permutationTable[index1 + Y.int1];

        var sx = s_curve(X.frac0);
        var sy = s_curve(Y.frac0);
        var sz = s_curve(Z.frac0);

        var v, kx, ky, a, b;
        v = randomTable[corner0 + Z.int0];
        kx = X.frac0 * v.x + Y.frac0 * v.y + Z.frac0 * v.z;
        v = randomTable[corner1 + Z.int0];
        ky = X.frac1 * v.x + Y.frac0 * v.y + Z.frac0 * v.z;
        a = lerp(sx, kx, ky);

        v = randomTable[corner2 + Z.int0];
        kx = X.frac0 * v.x + Y.frac1 * v.y + Z.frac0 * v.z;
        v = randomTable[corner3 + Z.int0];
        ky = X.frac1 * v.x + Y.frac1 * v.y + Z.frac0 * v.z;
        b = lerp(sx, kx, ky);

        var c = lerp(sy, a, b);

        v = randomTable[corner0 + Z.int1];
        kx = X.frac0 * v.x + Y.frac0 * v.y + Z.frac1 * v.z;
        v = randomTable[corner1 + Z.int1];
        ky = X.frac1 * v.x + Y.frac0 * v.y + Z.frac1 * v.z;
        a = lerp(sx, kx, ky);

        v = randomTable[corner2 + Z.int1];
        kx = X.frac0 * v.x + Y.frac1 * v.y + Z.frac1 * v.z;
        v = randomTable[corner3 + Z.int1];
        ky = X.frac1 * v.x + Y.frac1 * v.y + Z.frac1 * v.z;
        b = lerp(sx, kx, ky);

        var d = lerp(sy, a, b);

        return lerp(sz, c, d);
    };

    var normalize = function(v) {
        var s = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
        v.x /= s;
        v.y /= s;
        v.z /= s;
    };

    var generateTables =  function() {
        var i, k, temp;

        for(i = 0; i < randomTable.length; i++)
            randomTable[i] = {};

        for (i = 0; i < MASK ; i++) {
            permutationTable[i] = i;

            randomTable[i].x = randomFloat();
            randomTable[i].y = randomFloat();
            randomTable[i].z = randomFloat();
            normalize(randomTable[i]);
        }

        for (i = 0; i < MASK; i++) {
            k = Math.floor(pseudoRandom() * MASK);
            temp = Math.floor(permutationTable[i]);
            permutationTable[i] = permutationTable[k];
            permutationTable[k] = temp;
        }

        for (i = MASK; i < MASK + MASK; i++) {
            permutationTable[i] = permutationTable[i - MASK];
            randomTable[i] = randomTable[i - MASK];
        }
    };

    /**
     * Frequency, Amplitude, Persistance and Octaves
     */

    var get1D = function(x, frequency, amplitude, persistence, octaves)
    {
        var value = 0;
        frequency = 1 / frequency;
        for (var i = 0; i < octaves; i++)
        {
            value += noise1(x * frequency) * amplitude;
            frequency *= 2;
            amplitude *= persistence;
        }
        return value;
    };

    var get2D = function(x, y, frequency, amplitude, persistence, octaves)
    {
        var value = 0;
        frequency = 1 / frequency;
        for (var i = 0; i < octaves; i++)
        {
            value += noise2(x * frequency, y * frequency) * amplitude;
            frequency *= 2;
            amplitude *= persistence;
        }
        return value;
    };

    var get3D = function(x, y, z, frequency, amplitude, persistence, octaves)
    {
        var value = 0;
        frequency = 1 / frequency;
        for (var i = 0; i < octaves; i++)
        {
            value += noise3(x * frequency, y * frequency, z * frequency) * amplitude;
            frequency *= 2;
            amplitude *= persistence;
        }
        return value;
    };

    /**
     * Init
     */

    generateTables();

    /**
     * Return facade
     */

    return {
        get1D: get1D,
        get2D: get2D,
        get3D: get3D
    }
});