require(['../../../src/Noizy'], function(Noizy) {
    console.log(Noizy);

    // config
    var seedX = 1,
        seedY = 1,
        stepX = 0.1,
        stepY = 0.1,
        frequency = 1,
        amplitude = 1,
        persistence = 1,
        octaves = 1;

    // draw function
    var drawNoise2D = function(canvas, noiseFunction, seedX, seedY, stepX, stepY,
                               frequency, amplitude, persistence, octaves) {
        var w = canvas.width;
        var h = canvas.height;
        var context  = canvas.getContext("2d");
        var imageData = context.createImageData(w, h);

        var map = [h];
        for (var y = 0; y < h; y++) {
            map[y] = [w];
            for (var x = 0; x < w; x++) {
                var noise = noiseFunction(seedX + x * stepX, seedY + y * stepY,
                    frequency, amplitude, persistence, octaves);
                map[y][x] = noise * 255;

            }
        }

        for (var i = 0, l = imageData.data.length; i < l; i += 4) {
            var x = (i / 4) % w;
            var y = Math.floor(i / w / 4);

            imageData.data[i  ] = map[y][x];
            imageData.data[i + 1] = map[y][x];
            imageData.data[i + 2] = map[y][x];
            imageData.data[i + 3] = 255;
        }

        context.putImageData(imageData, 0, 0);
    };

    // -> draw calls

    // ValueNoise 2D Linear
    drawNoise2D(
        document.getElementById("valueNoise2DLinear"),
        Noizy.ValueNoise.get2DLinear,
        seedX,
        seedY,
        stepX,
        stepY,
        frequency,
        amplitude,
        persistence,
        octaves
    );

    // ValueNoise 2D Cosine
    drawNoise2D(
        document.getElementById("valueNoise2DCosine"),
        Noizy.ValueNoise.get2DCosine,
        seedX,
        seedY,
        stepX,
        stepY,
        frequency,
        amplitude,
        persistence,
        octaves
    );

    // ValueNoise 2D Cubic
    drawNoise2D(
        document.getElementById("valueNoise2DCubic"),
        Noizy.ValueNoise.get2DCubic,
        seedX,
        seedY,
        stepX,
        stepY,
        frequency,
        amplitude,
        persistence,
        octaves
    );

    // GradientNoise 2D Linear
    drawNoise2D(
        document.getElementById("gradientNoise2D"),
        Noizy.GradientNoise.get2D,
        seedX,
        seedY,
        stepX,
        stepY,
        frequency,
        amplitude,
        persistence,
        octaves
    );
});