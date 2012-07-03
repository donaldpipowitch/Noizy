/**
 * Noizy
 *
 * @author: donaldpipowitch
 */

// namespace
window.Noizy = {};

/**
 * Pseudo random number geneator (PRNG)
 *
 * Robert Jenkins' 32 bit integer hash function.
 * src: http://stackoverflow.com/questions/3428136/javascript-integer-math-incorrect-results/3428186#3428186
 *
 * Returns values from 0 to -1.
 * Use static functions PRNG.hash | PRNG.random
 * or create a new PRNG instance with specific seed (optional).
 *
 * @author: donaldpipowitch
 */

window.Noizy.PRNG = (function() {

	// ~~~ PRIVATE STATIC

	var privateStaticAttribute = true;

	var privateStaticMethod = function() {
		return true;
	};

	// ~~~ CONSTRUCTOR
	var PRNG = function(seed) {

		// ~~~ PRIVATE INSTANCE

		// specific seed or default seed
		var _seed = seed ? seed : 49734321;

		// ~~~ PUBLIC INSTANCE

		// get pseudo random, returns values from 0 to 1
		PRNG.prototype.random = function() {
			_seed = ((_seed + 0x7ed55d16) + (_seed << 12))  & 0xffffffff;
			_seed = ((_seed ^ 0xc761c23c) ^ (_seed >>> 19)) & 0xffffffff;
			_seed = ((_seed + 0x165667b1) + (_seed << 5))   & 0xffffffff;
			_seed = ((_seed + 0xd3a2646c) ^ (_seed << 9))   & 0xffffffff;
			_seed = ((_seed + 0xfd7046c5) + (_seed << 3))   & 0xffffffff;
			_seed = ((_seed ^ 0xb55a4f09) ^ (_seed >>> 16)) & 0xffffffff;
			return (_seed & 0xfffffff) / 0x10000000;
		};
	};

	// ~~~ PUBLIC STATIC

	// static function: returns pseudo random value from PRNG singleton (default seed)
	PRNG.random = (function() {
		var prng = new PRNG();
		return prng.random;
	})();

	// static function: simple hash
	PRNG.hash = function(x) {
		x = ((x + 0x7ed55d16) + (x << 12))  & 0xffffffff;
		x = ((x ^ 0xc761c23c) ^ (x >>> 19)) & 0xffffffff;
		x = ((x + 0x165667b1) + (x << 5))   & 0xffffffff;
		x = ((x + 0xd3a2646c) ^ (x << 9))   & 0xffffffff;
		x = ((x + 0xfd7046c5) + (x << 3))   & 0xffffffff;
		x = ((x ^ 0xb55a4f09) ^ (x >>> 16)) & 0xffffffff;
		return (x & 0xfffffff) / 0x10000000;
	};

	// ~~~ RETURN CONSTRUCTOR
	return PRNG;
})();


/**
 * Value Noise
 *
 * Requires:
 * - Noizy.PRNG
 *
 * src:  http://freespace.virgin.net/hugo.elias/models/m_perlin.htm
 * src2: http://www.xnamag.de/forum/viewtopic.php?t=5463&postdays=0&postorder=asc&start=0
 */

window.Noizy.ValueNoise = (function() {

	// ~~~ PRIVATE STATIC

	/**
	 * Value Noise 1D
	 */

	var getNoise1D = Noizy.PRNG.hash;

	var getLinearInterpolation1D = function(a, b, x) {
		return a * (1 - x) + b * x;
	};

	var getCosineInterpolation1D = function(a, b, x) {
		var ft = x * 3.1415927;
		ft = (1 - Math.cos(ft)) * 0.5;
		return a * (1 - ft) + b * ft;
	};

	// v0 = before a, v1 = a, v2 = b, v3 = after b
	var getCubicInterpolation1D = function(v0, v1, v2, v3, x) {
		var P = (v3 - v2) - (v0 - v1);
		var Q = (v0 - v1) - P;
		var R = v2 - v0;
		var S = v1;

		return P * x * x * x + Q * x * x + R * x + S;
	};

	var getNoise1DLinear = function(x, frequency, amplitude, persistence, octaves) {
		var value = 0,
			pointPrev,
			pointAfter,
			xFrqz;
		frequency = 1 / frequency;
		for (var i = 0; i < octaves; i++) {
			xFrqz = Math.floor(x * frequency);
			pointPrev = getNoise1D(xFrqz);
			pointAfter = getNoise1D(xFrqz + 1);
			value += getLinearInterpolation1D(pointPrev, pointAfter,
				x % (1 / frequency) * frequency) * amplitude;
			frequency *= 2;
			amplitude *= persistence;
		}
		return value;
	};

	var getNoise1DCosine = function(x, frequency, amplitude, persistence, octaves) {
		var value = 0,
			pointPrev,
			pointAfter,
			xFrqz;
		frequency = 1 / frequency;
		for (var i = 0; i < octaves; i++) {
			xFrqz = Math.floor(x * frequency);
			pointPrev = getNoise1D(xFrqz);
			pointAfter = getNoise1D(xFrqz + 1);
			value += getCosineInterpolation1D(pointPrev, pointAfter,
				x % (1 / frequency) * frequency) * amplitude;
			frequency *= 2;
			amplitude *= persistence;
		}
		return value;
	};

	var getNoise1DCubic = function(x, frequency, amplitude, persistence, octaves) {
		var value = 0,
			pointPrev2,
			pointPrev1,
			pointAfter1,
			pointAfter2,
			xFrqz;
		frequency = 1 / frequency;
		for (var i = 0; i < octaves; i++) {
			xFrqz = Math.floor(x * frequency);
			pointPrev2 = getNoise1D(xFrqz - 1);
			pointPrev1 = getNoise1D(xFrqz);
			pointAfter1 = getNoise1D(xFrqz + 1);
			pointAfter2 = getNoise1D(xFrqz + 2);
			value += getCubicInterpolation1D(pointPrev2, pointPrev1, pointAfter1, pointAfter2,
				x % (1 / frequency) * frequency) * amplitude;
			frequency *= 2;
			amplitude *= persistence;
		}
		return value;
	};

	/**
	 * Value Noise 2D
	 */

	var getNoise2D = function(x, y) {
		return getNoise1D(x * 46349111 + y * 46351111);
	};

	var getLinearInterpolation2D = function(v00, v01, v10, v11, x, y) {
		var x0 = getLinearInterpolation1D(v00, v01, y);
		var x1 = getLinearInterpolation1D(v10, v11, y);
		return getLinearInterpolation1D(x0, x1, x);
	};

	var getCosineInterpolation2D = function(v00, v01, v10, v11, x, y) {
		var x0 = getCosineInterpolation1D(v00, v01, y);
		var x1 = getCosineInterpolation1D(v10, v11, y);
		return getCosineInterpolation1D(x0, x1, x);
	};

	var getCubicInterpolation2D = function(v_12, v02, v12, v22, v_11, v01, v11, v21, v_10, v00, v10, v20, v_1_1, v0_1, v1_1, v2_1, x, y) {
		var x_1 = getCubicInterpolation1D(v_1_1, v_10, v_11, v_12, y);
		var x0 = getCubicInterpolation1D(v0_1, v00, v01, v02, y);
		var x1 = getCubicInterpolation1D(v1_1, v10, v11, v12, y);
		var x2 = getCubicInterpolation1D(v2_1, v20, v21, v22, y);
		return getCubicInterpolation1D(x_1, x0, x1, x2, x);
	};

	var getNoise2DLinear = function(x, y, frequency, amplitude, persistence, octaves) {
		var value = 0,
			v00,
			v01,
			v10,
			v11,
			xFrqz,
			yFrqz;
		frequency = 1 / frequency;
		for (var i = 0; i < octaves; i++) {
			xFrqz = Math.floor(x * frequency);
			yFrqz = Math.floor(y * frequency);
			v00 = getNoise2D(xFrqz, yFrqz);
			v01 = getNoise2D(xFrqz, yFrqz + 1);
			v10 = getNoise2D(xFrqz + 1, yFrqz);
			v11 = getNoise2D(xFrqz + 1, yFrqz + 1);
			value += getLinearInterpolation2D(v00, v01, v10, v11,
				x % (1 / frequency) * frequency,
				y % (1 / frequency) * frequency) * amplitude;
			frequency *= 2;
			amplitude *= persistence;
		}
		return value;
	};

	var getNoise2DCosine = function(x, y, frequency, amplitude, persistence, octaves) {
		var value = 0,
			v00,
			v01,
			v10,
			v11,
			xFrqz,
			yFrqz;
		frequency = 1 / frequency;
		for (var i = 0; i < octaves; i++) {
			xFrqz = Math.floor(x * frequency);
			yFrqz = Math.floor(y * frequency);
			v00 = getNoise2D(xFrqz, yFrqz);
			v01 = getNoise2D(xFrqz, yFrqz + 1);
			v10 = getNoise2D(xFrqz + 1, yFrqz);
			v11 = getNoise2D(xFrqz + 1, yFrqz + 1);
			value += getCosineInterpolation2D(v00, v01, v10, v11,
				x % (1 / frequency) * frequency, y % (1 / frequency) * frequency) * amplitude;
			frequency *= 2;
			amplitude *= persistence;
		}
		return value;
	};

	var getNoise2DCubic = function(x, y, frequency, amplitude, persistence, octaves) {
		var value = 0,
			xFrqz,
			yFrqz,
			v = [4],
			i;
		for (i = 0; i < 4; i++) {
			v[i] = [4];
		}
		frequency = 1 / frequency;
		for (i = 0; i < octaves; i++) {
			xFrqz = Math.floor(x * frequency);
			yFrqz = Math.floor(y * frequency);

			v[0][3] = getNoise2D(xFrqz - 1, yFrqz + 2);
			v[0][2] = getNoise2D(xFrqz, yFrqz + 2);
			v[0][1] = getNoise2D(xFrqz + 1, yFrqz + 2);
			v[0][0] = getNoise2D(xFrqz + 2, yFrqz + 2);

			v[3][3] = getNoise2D(xFrqz - 1, yFrqz - 1);
			v[3][2] = getNoise2D(xFrqz, yFrqz - 1);
			v[3][1] = getNoise2D(xFrqz + 1, yFrqz - 1);
			v[3][0] = getNoise2D(xFrqz + 2, yFrqz - 1);

			v[1][3] = getNoise2D(xFrqz - 1, yFrqz + 1);
			v[1][2] = getNoise2D(xFrqz, yFrqz + 1);
			v[1][1] = getNoise2D(xFrqz + 1, yFrqz + 1);
			v[1][0] = getNoise2D(xFrqz + 2, yFrqz + 1);

			v[2][3] = getNoise2D(xFrqz - 1, yFrqz);
			v[2][2] = getNoise2D(xFrqz, yFrqz);
			v[2][1] = getNoise2D(xFrqz + 1, yFrqz);
			v[2][0] = getNoise2D(xFrqz + 2, yFrqz);

			value += getCubicInterpolation2D(v[0][3], v[0][2], v[0][1], v[0][0], v[1][3], v[1][2], v[1][1], v[1][0],
				v[2][3], v[2][2], v[2][1], v[2][0], v[3][3], v[3][2], v[3][1], v[3][0],
				x % (1 / frequency) * frequency, y % (1 / frequency) * frequency) * amplitude;
			frequency *= 2;
			amplitude *= persistence;
		}
		return value;
	};

	/**
	 * Value Noise 3D
	 */

	var getNoise3D = function(x, y, z) {
		return getNoise1D(x * 1663 + y * 1667 + z * 1669);
	};

	var getLinearInterpolation3D = function(v000, v010, v100, v110, v001, v011, v101, v111, x, y, z) {
		var x0 = getLinearInterpolation1D(v000, v010, y);
		var x1 = getLinearInterpolation1D(v100, v110, y);
		var x2 = getLinearInterpolation1D(v001, v011, y);
		var x3 = getLinearInterpolation1D(v101, v111, y);
		var y0 = getLinearInterpolation1D(x0, x1, x);
		var y1 = getLinearInterpolation1D(x2, x3, x);
		return getLinearInterpolation1D(y0, y1, z);
	};

	var getCosineInterpolation3D = function(v000, v010, v100, v110, v001, v011, v101, v111, x, y, z) {
		var x0 = getCosineInterpolation1D(v000, v010, y);
		var x1 = getCosineInterpolation1D(v100, v110, y);
		var x2 = getCosineInterpolation1D(v001, v011, y);
		var x3 = getCosineInterpolation1D(v101, v111, y);
		var y0 = getCosineInterpolation1D(x0, x1, x);
		var y1 = getCosineInterpolation1D(x2, x3, x);
		return getCosineInterpolation1D(y0, y1, z);
	};

	var getCubicInterpolation3D = function(values, x, y, z) {
		var xy_1_1 = getCubicInterpolation1D(values[0][0][0], values[0][0][1], values[0][0][2], values[0][0][3], z);
		var xy_10 = getCubicInterpolation1D(values[0][1][0], values[0][1][1], values[0][1][2], values[0][1][3], z);
		var xy_11 = getCubicInterpolation1D(values[0][2][0], values[0][2][1], values[0][2][2], values[0][2][3], z);
		var xy_12 = getCubicInterpolation1D(values[0][3][0], values[0][3][1], values[0][3][2], values[0][3][3], z);
		var xy0_1 = getCubicInterpolation1D(values[1][0][0], values[1][0][1], values[1][0][2], values[1][0][3], z);
		var xy00 = getCubicInterpolation1D(values[1][1][0], values[1][1][1], values[1][0][2], values[1][1][3], z);
		var xy01 = getCubicInterpolation1D(values[1][2][0], values[1][2][1], values[1][0][2], values[1][2][3], z);
		var xy02 = getCubicInterpolation1D(values[1][3][0], values[1][3][1], values[1][0][2], values[1][3][3], z);
		var xy1_1 = getCubicInterpolation1D(values[2][0][0], values[2][0][1], values[2][0][2], values[2][0][3], z);
		var xy10 = getCubicInterpolation1D(values[2][1][0], values[2][1][1], values[2][0][2], values[2][1][3], z);
		var xy11 = getCubicInterpolation1D(values[2][2][0], values[2][2][1], values[2][0][2], values[2][2][3], z);
		var xy12 = getCubicInterpolation1D(values[2][3][0], values[2][3][1], values[2][0][2], values[2][3][3], z);
		var xy2_1 = getCubicInterpolation1D(values[3][0][0], values[3][0][1], values[3][0][2], values[3][0][3], z);
		var xy20 = getCubicInterpolation1D(values[3][1][0], values[3][1][1], values[3][0][2], values[3][1][3], z);
		var xy21 = getCubicInterpolation1D(values[3][2][0], values[3][2][1], values[3][0][2], values[3][2][3], z);
		var xy22 = getCubicInterpolation1D(values[3][3][0], values[3][3][1], values[3][0][2], values[3][3][3], z);
		var x_1 = getCubicInterpolation1D(xy_1_1, xy_10, xy_11, xy_12, y);
		var x0 = getCubicInterpolation1D(xy0_1, xy00, xy01, xy02, y);
		var x1 = getCubicInterpolation1D(xy1_1, xy10, xy11, xy12, y);
		var x2 = getCubicInterpolation1D(xy2_1, xy20, xy21, xy22, y);
		return getCubicInterpolation1D(x_1, x0, x1, x2, x);
	};

	var getNoise3DLinear = function(x, y, z, frequency, amplitude, persistence, octaves) {
		var value = 0,
			v000,
			v010,
			v100,
			v110,
			v001,
			v011,
			v101,
			v111,
			xFrqz,
			yFrqz,
			zFrqz;
		frequency = 1 / frequency;
		for (var i = 0; i < octaves; i++) {
			xFrqz = Math.floor(x * frequency);
			yFrqz = Math.floor(y * frequency);
			zFrqz = Math.floor(z * frequency);
			v000 = getNoise3D(xFrqz, yFrqz, zFrqz);
			v010 = getNoise3D(xFrqz, yFrqz + 1, zFrqz);
			v100 = getNoise3D(xFrqz + 1, yFrqz, zFrqz);
			v110 = getNoise3D(xFrqz + 1, yFrqz + 1, zFrqz);
			v001 = getNoise3D(xFrqz, yFrqz, zFrqz + 1);
			v011 = getNoise3D(xFrqz, yFrqz + 1, zFrqz + 1);
			v101 = getNoise3D(xFrqz + 1, yFrqz, zFrqz + 1);
			v111 = getNoise3D(xFrqz + 1, yFrqz + 1, zFrqz + 1);
			value += getLinearInterpolation3D(v000, v010, v100, v110, v001, v011, v101, v111,
				x % (1 / frequency) * frequency,
				y % (1 / frequency) * frequency,
				z % (1 / frequency) * frequency) * amplitude;
			frequency *= 2;
			amplitude *= persistence;
		}
		return value;
	};

	var getNoise3DCosine = function(x, y, z, frequency, amplitude, persistence, octaves) {
		var value = 0,
			v000,
			v010,
			v100,
			v110,
			v001,
			v011,
			v101,
			v111,
			xFrqz,
			yFrqz,
			zFrqz;
		frequency = 1 / frequency;
		for (var i = 0; i < octaves; i++) {
			xFrqz = Math.floor(x * frequency);
			yFrqz = Math.floor(y * frequency);
			zFrqz = Math.floor(z * frequency);
			v000 = getNoise3D(xFrqz, yFrqz, zFrqz);
			v010 = getNoise3D(xFrqz, yFrqz + 1, zFrqz);
			v100 = getNoise3D(xFrqz + 1, yFrqz, zFrqz);
			v110 = getNoise3D(xFrqz + 1, yFrqz + 1, zFrqz);
			v001 = getNoise3D(xFrqz, yFrqz, zFrqz + 1);
			v011 = getNoise3D(xFrqz, yFrqz + 1, zFrqz + 1);
			v101 = getNoise3D(xFrqz + 1, yFrqz, zFrqz + 1);
			v111 = getNoise3D(xFrqz + 1, yFrqz + 1, zFrqz + 1);
			value += getCosineInterpolation3D(v000, v010, v100, v110, v001, v011, v101, v111,
				x % (1 / frequency) * frequency,
				y % (1 / frequency) * frequency,
				z % (1 / frequency) * frequency) * amplitude;
			frequency *= 2;
			amplitude *= persistence;
		}
		return value;
	};

	var getNoise3DCubic = function(x, y, z, frequency, amplitude, persistence, octaves) {
		var value = 0,
			xFrqz,
			yFrqz,
			zFrqz,
			v = [4],
			i;
		for (i = 0; i < 4; i++) {
			v[i] = [4];
			for (var j = 0; j < 4; j++) {
				v[i][j] = [4];
			}
		}
		frequency = 1 / frequency;
		for (i = 0; i < octaves; i++) {
			xFrqz = Math.floor(x * frequency);
			yFrqz = Math.floor(y * frequency);
			zFrqz = Math.floor(z * frequency);
			for (var vx = 0; vx < 4; vx++) {
				for (var vy = 0; vy < 4; vy++) {
					for (var vz = 0; vz < 4; vz++) {
						v[vx][vy][vz] = getNoise3D(xFrqz + vx - 1, yFrqz + vy - 1, zFrqz + vz - 1);
					}
				}
			}
			value += getCubicInterpolation3D(v,
				x % (1 / frequency) * frequency,
				y % (1 / frequency) * frequency,
				z % (1 / frequency) * frequency) * amplitude;
			frequency *= 2;
			amplitude *= persistence;
		}
		return value;
	};

	// ~~~ END PRIVATE STATIC

	// ~~~ CONSTRUCTOR
	var ValueNoise = function() {
		// just static methods...
	};

	// ~~~ PUBLIC STATIC

	ValueNoise.get1DLinear = getNoise1DLinear;
	ValueNoise.get1DCosine = getNoise1DCosine;
	ValueNoise.get1DCubic = getNoise1DCubic;
	ValueNoise.get2DLinear = getNoise2DLinear;
	ValueNoise.get2DCosine = getNoise2DCosine;
	ValueNoise.get2DCubic = getNoise2DCubic;
	ValueNoise.get3DLinear = getNoise3DLinear;
	ValueNoise.get3DCosine = getNoise3DCosine;
	ValueNoise.get3DCubic = getNoise3DCubic;

	// ~~~ RETURN CONSTRUCTOR
	return ValueNoise;
})();

/**
 * Gradient Noise
 *
 * Requires:
 * - Noizy.PRNG
 *
 * src: http://mrl.nyu.edu/~perlin/doc/oscar.html#noise
 * src2: http://code.google.com/p/processing/source/browse/trunk/processing/java/libraries/opengl/examples/Advanced/Planets/Perlin.pde?spec=svn9511&r=9511
 * src3: http://www.gamedev.net/topic/291699-blocky-perlin-noise-pics-included/
 */

window.Noizy.GradientNoise = (function() {

	// ~~~ PRIVATE STATIC

	// own PRNG instance
	var pseudoRandom = new Noizy.PRNG().random;

	var randomFloat = function() {
		return pseudoRandom() * 2 - 1;    // output: [-1, 1]
		//return ((pseudoRandom() * (MASK + MASK) - MASK)) / MASK;    // output: [-1, 1]
	};

	var MASK = 256, // B
		MAXIM = 4096, // N
		permutationTable = new Array(MASK + MASK), // p
		randomTable = new Array(MASK + MASK);   // g1

	var X = { int0:0, int1:0, frac0:0, frac1:0 },
		Y = { int0:0, int1:0, frac0:0, frac1:0 },
		Z = { int0:0, int1:0, frac0:0, frac1:0 };

	var s_curve = function(t) {
		return t * t * (3 - 2 * t);
	};

	var lerp = function(t, a, b) {
		return a + t * (b - a);
	};

	var setup = function(p, P) {
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

	var generateTables = function() {
		var i, k, temp;

		for (i = 0; i < randomTable.length; i++)
			randomTable[i] = {};

		for (i = 0; i < MASK; i++) {
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

	var get1D = function(x, frequency, amplitude, persistence, octaves) {
		var value = 0;
		frequency = 1 / frequency;
		for (var i = 0; i < octaves; i++) {
			value += noise1(x * frequency) * amplitude;
			frequency *= 2;
			amplitude *= persistence;
		}
		return value;
	};

	var get2D = function(x, y, frequency, amplitude, persistence, octaves) {
		var value = 0;
		frequency = 1 / frequency;
		for (var i = 0; i < octaves; i++) {
			value += noise2(x * frequency, y * frequency) * amplitude;
			frequency *= 2;
			amplitude *= persistence;
		}
		return value;
	};

	var get3D = function(x, y, z, frequency, amplitude, persistence, octaves) {
		var value = 0;
		frequency = 1 / frequency;
		for (var i = 0; i < octaves; i++) {
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

	// ~~~ END PRIVATE STATIC

	// ~~~ CONSTRUCTOR
	var GradientNoise = function() {
		// just static methods...
	};

	// ~~~ PUBLIC STATIC

	GradientNoise.get1D = get1D;
	GradientNoise.get2D = get2D;
	GradientNoise.get3D = get3D;

	// ~~~ RETURN CONSTRUCTOR
	return GradientNoise;
})();

/**
 * Simplex Noise
 *
 * src: http://cs.nyu.edu/~perlin/noise/
 * src2: http://asserttrue.blogspot.de/2011/12/perlin-noise-in-javascript_31.html
 */

window.Noizy.SimplexNoise = (function() {

	// ~~~ PRIVATE STATIC

	var p = new Array(512), permutation = [ 151,160,137,91,90,15,
		131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,
		190, 6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,
		88,237,149,56,87,174,20,125,136,171,168, 68,175,74,165,71,134,139,48,27,166,
		77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,
		102,143,54, 65,25,63,161, 1,216,80,73,209,76,132,187,208, 89,18,169,200,196,
		135,130,116,188,159,86,164,100,109,198,173,186, 3,64,52,217,226,250,124,123,
		5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,
		223,183,170,213,119,248,152, 2,44,154,163, 70,221,153,101,155,167, 43,172,9,
		129,22,39,253, 19,98,108,110,79,113,224,232,178,185, 112,104,218,246,97,228,
		251,34,242,193,238,210,144,12,191,179,162,241, 81,51,145,235,249,14,239,107,
		49,192,214, 31,181,199,106,157,184, 84,204,176,115,121,50,45,127, 4,150,254,
		138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180
	];

	for (var i = 0; i < 256; i++) {
		p[256 + i] = p[i] = permutation[i];
	}

	var noise = function(x, y, z) {
		var X = Math.floor(x) & 255, // FIND UNIT CUBE THAT
			Y = Math.floor(y) & 255, // CONTAINS POINT.
			Z = Math.floor(z) & 255;

		x -= Math.floor(x); // FIND RELATIVE X,Y,Z
		y -= Math.floor(y); // OF POINT IN CUBE.
		z -= Math.floor(z);

		var u = fade(x), // COMPUTE FADE CURVES
			v = fade(y), // FOR EACH OF X,Y,Z.
			w = fade(z);

		var A = Math.floor(p[X  ] + Y), AA = Math.floor(p[A] + Z), AB = Math.floor(p[A + 1] + Z), // HASH COORDINATES OF
			B = Math.floor(p[X + 1] + Y), BA = Math.floor(p[B] + Z), BB = Math.floor(p[B + 1] + Z);   // THE 8 CUBE CORNERS,

		return lerp(w, lerp(v, lerp(u, grad(p[AA], x, y, z), // AND ADD
			grad(p[BA], x - 1, y, z)), // BLENDED
			lerp(u, grad(p[AB], x, y - 1, z), // RESULTS
				grad(p[BB], x - 1, y - 1, z))), // FROM  8
			lerp(v, lerp(u, grad(p[AA + 1], x, y, z - 1), // CORNERS
				grad(p[BA + 1], x - 1, y, z - 1)), // OF CUBE
				lerp(u, grad(p[AB + 1], x, y - 1, z - 1),
					grad(p[BB + 1], x - 1, y - 1, z - 1))));
	};

	var fade = function(t) {
		return t * t * t * (t * (t * 6 - 15) + 10);
	};

	var lerp = function(t, a, b) {
		return a + t * (b - a);
	};

	var grad = function(hash, x, y, z) {
		var h = hash & 15;          // CONVERT LO 4 BITS OF HASH CODE
		var u = h < 8 ? x : y, // INTO 12 GRADIENT DIRECTIONS.
			v = h < 4 ? y : h === 12 || h === 14 ? x : z;
		return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
	};

	/**
	 * Frequency, Amplitude, Persistance and Octaves
	 */

	var get1D = function(x, frequency, amplitude, persistence, octaves) {
		var value = 0;
		frequency = 1 / frequency;
		for (var i = 0; i < octaves; i++) {
			value += noise(x * frequency, 0, 0) * amplitude;
			frequency *= 2;
			amplitude *= persistence;
		}
		return value;
	};

	var get2D = function(x, y, frequency, amplitude, persistence, octaves) {
		var value = 0;
		frequency = 1 / frequency;
		for (var i = 0; i < octaves; i++) {
			value += noise(x * frequency, y * frequency, 0) * amplitude;
			frequency *= 2;
			amplitude *= persistence;
		}
		return value;
	};

	var get3D = function(x, y, z, frequency, amplitude, persistence, octaves) {
		var value = 0;
		frequency = 1 / frequency;
		for (var i = 0; i < octaves; i++) {
			value += noise(x * frequency, y * frequency, z * frequency) * amplitude;
			frequency *= 2;
			amplitude *= persistence;
		}
		return value;
	};

	// ~~~ END PRIVATE STATIC

	// ~~~ CONSTRUCTOR
	var SimplexNoise = function() {
		// just static methods...
	};

	// ~~~ PUBLIC STATIC

	SimplexNoise.get1D = get1D;
	SimplexNoise.get2D = get2D;
	SimplexNoise.get3D = get3D;

	// ~~~ RETURN CONSTRUCTOR
	return SimplexNoise;
})();