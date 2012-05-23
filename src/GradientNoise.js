/**
 * Gradient Noise
 *
 * src: http://mrl.nyu.edu/~perlin/doc/oscar.html#noise
 */

define(function() {

    // pseudo random: http://stackoverflow.com/questions/3428136/javascript-integer-math-incorrect-results/3428186#3428186
    var pseudoRandom = (function() {
        var seed = 49734321;
        return function() {
            // Robert Jenkins' 32 bit integer hash function.
            seed = ((seed + 0x7ed55d16) + (seed << 12))  & 0xffffffff;
            seed = ((seed ^ 0xc761c23c) ^ (seed >>> 19)) & 0xffffffff;
            seed = ((seed + 0x165667b1) + (seed << 5))   & 0xffffffff;
            seed = ((seed + 0xd3a2646c) ^ (seed << 9))   & 0xffffffff;
            seed = ((seed + 0xfd7046c5) + (seed << 3))   & 0xffffffff;
            seed = ((seed ^ 0xb55a4f09) ^ (seed >>> 16)) & 0xffffffff;
            return (seed & 0xfffffff) / 0x10000000;
        };
    })();

    var pseudoRandomMask = function() {
        return ((pseudoRandom() * (B + B)) - B) / B;    // output: [-1, 1]
        //return (pseudoRandom() * (B + B)) / B / 2;    // output: [0, 1]
    };

    var B = 0x100;
    var BM = 0xff;
    var N = 0x1000;
    var NP = 12;   /* 2^N */
    var NM = 0xfff;

    var p = new Array(B + B + 2);

    var g3 = new Array(B + B + 2);
    for(var i = 0; i < g3.length; i++)
        g3[i] = new Array(3);

    var g2 = new Array(B + B + 2);
    for(var i = 0; i < g2.length; i++)
        g2[i] = new Array(2);

    var g1 = new Array(B + B + 2);
    var start = 1;

    var s_curve = function(t) {
        return t * t * (3. - 2. * t);
    };

    var lerp = function(t, a, b) {
        return a + t * (b - a);
    };

    var setup = function(pos, posValue) {
        var s = {};
        var t = posValue + N;
        s['b' + pos + '0'] = (Math.floor(t)) & BM;
        s['b' + pos + '1'] = (s['b' + pos + '0'] + 1) & BM;
        s['r' + pos + '0'] = t - Math.floor(t);
        s['r' + pos + '1'] = s['r' + pos + '0'] - 1.;
        return s;
    };

    var noise1 = function(x) {
        var sx, u, v, vec = {};

        vec.x = x;
        if (start) {
            start = 0;
            init();
        }

        var setupX = setup('x', vec.x);

        sx = s_curve(setupX.rx0);

        u = setupX.rx0 * g1[ p[ setupX.bx0 ] ];
        v = setupX.rx1 * g1[ p[ setupX.bx1 ] ];

        return lerp(sx, u, v);
    };

    var noise2 = function(x, y) {
        var b00, b10, b01, b11, q, sx, sy, a, b, u, v, vec = {};
        var i, j;

        vec.x = x;
        vec.y = y;
        if (start) {
            start = 0;
            init();
        }

        var setupX = setup('x', vec.x);
        var setupY = setup('y', vec.y);

        i = p[ setupX.bx0 ];
        j = p[ setupX.bx1 ];

        b00 = p[ i + setupY.by0 ];
        b10 = p[ j + setupY.by0 ];
        b01 = p[ i + setupY.by1 ];
        b11 = p[ j + setupY.by1 ];

        sx = s_curve(setupX.rx0);
        sy = s_curve(setupY.ry0);

        var at2 = function(rx,ry) {
            return rx * q[0] + ry * q[1];
        };

        q = g2[ b00 ] ; u = at2(setupX.rx0,setupY.ry0);
        q = g2[ b10 ] ; v = at2(setupX.rx1,setupY.ry0);
        a = lerp(sx, u, v);

        q = g2[ b01 ] ; u = at2(setupX.rx0,setupY.ry1);
        q = g2[ b11 ] ; v = at2(setupX.rx1,setupY.ry1);
        b = lerp(sx, u, v);

        return lerp(sy, a, b);
    };

    var noise3 = function(x, y, z) {
        var b00, b10, b01, b11, q, sy, sz, a, b, c, d, t, u, v, vec = {};
        var i, j;

        vec.x = x;
        vec.y = y;
        vec.z = z;
        if (start) {
            start = 0;
            init();
        }

        var setupX = setup('x', vec.x);
        var setupY = setup('y', vec.y);
        var setupZ = setup('z', vec.z);

        i = p[ setupX.bx0 ];
        j = p[ setupX.bx1 ];

        b00 = p[ i + setupY.by0 ];
        b10 = p[ j + setupY.by0 ];
        b01 = p[ i + setupY.by1 ];
        b11 = p[ j + setupY.by1 ];

        t  = s_curve(setupX.rx0);
        sy = s_curve(setupY.ry0);
        sz = s_curve(setupZ.rz0);

        var at3 = function(rx,ry,rz) {
            return rx * q[0] + ry * q[1] + rz * q[2];
        };

        q = g3[ b00 + setupZ.bz0 ] ; u = at3(setupX.rx0,setupY.ry0,setupZ.rz0);
        q = g3[ b10 + setupZ.bz0 ] ; v = at3(setupX.rx1,setupY.ry0,setupZ.rz0);
        a = lerp(t, u, v);

        q = g3[ b01 + setupZ.bz0 ] ; u = at3(setupX.rx0,setupY.ry1,setupZ.rz0);
        q = g3[ b11 + setupZ.bz0 ] ; v = at3(setupX.rx1,setupY.ry1,setupZ.rz0);
        b = lerp(t, u, v);

        c = lerp(sy, a, b);

        q = g3[ b00 + setupZ.bz1 ] ; u = at3(setupX.rx0,setupY.ry0,setupZ.rz1);
        q = g3[ b10 + setupZ.bz1 ] ; v = at3(setupX.rx1,setupY.ry0,setupZ.rz1);
        a = lerp(t, u, v);

        q = g3[ b01 + setupZ.bz1 ] ; u = at3(setupX.rx0,setupY.ry1,setupZ.rz1);
        q = g3[ b11 + setupZ.bz1 ] ; v = at3(setupX.rx1,setupY.ry1,setupZ.rz1);
        b = lerp(t, u, v);

        d = lerp(sy, a, b);

        return lerp(sz, c, d);
    };

    var normalize2 = function(v) {
        var s = Math.sqrt(v[0] * v[0] + v[1] * v[1]);
        v[0] = v[0] / s;
        v[1] = v[1] / s;
    };

    var normalize3 = function(v) {
        var s = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
        v[0] = v[0] / s;
        v[1] = v[1] / s;
        v[2] = v[2] / s;
    };

    var init =  function() {
        var i, j, k;

        for (i = 0; i < B ; i++) {
            p[i] = i;

            g1[i] = pseudoRandomMask();

            for (j = 0; j < 2 ; j++)
                g2[i][j] = pseudoRandomMask();
            normalize2(g2[i]);

            for (j = 0; j < 3 ; j++)
                g3[i][j] = pseudoRandomMask();
            normalize3(g3[i]);
        }

        while (--i) {
            k = p[i];
            p[i] = p[j = Math.floor(pseudoRandom() * B)];
            p[j] = k;
        }

        for (i = 0 ; i < B + 2 ; i++) {
            p[B + i] = p[i];
            g1[B + i] = g1[i];
            for (j = 0; j < 2; j++)
                g2[B + i][j] = g2[i][j];
            for (j = 0; j < 3; j++)
                g3[B + i][j] = g3[i][j];
        }
    };

    /**
     * Return object.
     */

    return {
        get1D: noise1,
        get2D: noise2,
        get3D: noise3
    }
});