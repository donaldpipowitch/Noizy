/**
 * Value Noise
 *
 * src:  http://freespace.virgin.net/hugo.elias/models/m_perlin.htm
 * src2: http://www.xnamag.de/forum/viewtopic.php?t=5463&postdays=0&postorder=asc&start=0
 */

define([
        './PRNG'
    ],
    function(PRNG) {

    /**
     * Value Noise 1D
     */

    var getNoise1D = PRNG.hash;

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

    var getNoise1DLinear = function(x, frequency, amplitude, persistence, octaves)
    {
        var value = 0,
            pointPrev,
            pointAfter,
            xFrqz;
        frequency = 1 / frequency;
        for (var i = 0; i < octaves; i++)
        {
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

    var getNoise1DCosine = function(x, frequency, amplitude, persistence, octaves)
    {
        var value = 0,
            pointPrev,
            pointAfter,
            xFrqz;
        frequency = 1 / frequency;
        for (var i = 0; i < octaves; i++)
        {
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

    var getNoise1DCubic = function(x, frequency, amplitude, persistence, octaves)
    {
        var value = 0,
            pointPrev2,
            pointPrev1,
            pointAfter1,
            pointAfter2,
            xFrqz;
        frequency = 1 / frequency;
        for (var i = 0; i < octaves; i++)
        {
            xFrqz = Math.floor(x * frequency);
            pointPrev2 = getNoise1D(xFrqz -1);
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

    var getCubicInterpolation2D = function(v_12, v02, v12, v22, v_11, v01, v11, v21, v_10,
                                           v00, v10, v20, v_1_1,v0_1, v1_1,v2_1, x, y) {
        var x_1 = getCubicInterpolation1D(v_1_1, v_10, v_11, v_12, y);
        var x0 = getCubicInterpolation1D(v0_1, v00, v01, v02, y);
        var x1 = getCubicInterpolation1D(v1_1, v10, v11, v12, y);
        var x2 = getCubicInterpolation1D(v2_1, v20, v21, v22, y);
        return getCubicInterpolation1D(x_1, x0, x1, x2, x);
    };

    var getNoise2DLinear = function(x, y, frequency, amplitude, persistence, octaves)
    {
        var value = 0,
            v00,
            v01,
            v10,
            v11,
            xFrqz,
            yFrqz;
        frequency = 1 / frequency;
        for (var i = 0; i < octaves; i++)
        {
            xFrqz  = Math.floor(x * frequency);
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

    var getNoise2DCosine = function(x, y, frequency, amplitude, persistence, octaves)
    {
        var value = 0,
            v00,
            v01,
            v10,
            v11,
            xFrqz,
            yFrqz;
        frequency = 1 / frequency;
        for (var i = 0; i < octaves; i++)
        {
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

    var getNoise2DCubic = function(x, y, frequency, amplitude, persistence, octaves)
    {
        var value = 0,
            xFrqz,
            yFrqz,
            v = [4];
        for (var i = 0; i < 4; i++) {
            v[i] = [4];
        }
        frequency = 1 / frequency;
        for (var i = 0; i < octaves; i++)
        {
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

    var getNoise3DLinear = function(x, y, z, frequency, amplitude, persistence, octaves)
    {
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
        for (var i = 0; i < octaves; i++)
        {
            xFrqz  = Math.floor(x * frequency);
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

    var getNoise3DCosine = function(x, y, z, frequency, amplitude, persistence, octaves)
    {
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
        for (var i = 0; i < octaves; i++)
        {
            xFrqz  = Math.floor(x * frequency);
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

    var getNoise3DCubic = function(x, y, z, frequency, amplitude, persistence, octaves)
    {
        var value = 0,
            xFrqz,
            yFrqz,
            zFrqz,
            v = [4];
        for (var i = 0; i < 4; i++) {
            v[i] = [4];
            for (var j = 0; j < 4; j++) {
                v[i][j] = [4];
            }
        }
        frequency = 1 / frequency;
        for (var i = 0; i < octaves; i++)
        {
            xFrqz  = Math.floor(x * frequency);
            yFrqz = Math.floor(y * frequency);
            zFrqz = Math.floor(z * frequency);
            for (var vx = 0; vx < 4; vx++)
            {
                for (var vy = 0; vy < 4; vy++)
                {
                    for (var vz = 0; vz < 4; vz++)
                    {
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

    /**
     * Return facade
     */

    return {
        get1DLinear: getNoise1DLinear,
        get1DCosine: getNoise1DCosine,
        get1DCubic: getNoise1DCubic,
        get2DLinear: getNoise2DLinear,
        get2DCosine: getNoise2DCosine,
        get2DCubic: getNoise2DCubic,
        get3DLinear: getNoise3DLinear,
        get3DCosine: getNoise3DCosine,
        get3DCubic: getNoise3DCubic
    }
});