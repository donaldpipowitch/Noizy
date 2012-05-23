require(['../../../src/Noizy'], function(Noizy) {
    console.log(Noizy);

    // config
    var seedX = 1,
        seedY = 1,
        seedZ = 1,
        stepX = 0.1,
        stepY = 0.1,
        stepZ = 0.1,
        frequency = 1,
        amplitude = 1,
        persistence = 1,
        octaves = 1;

    // draw function
    var drawNoise3D = function(canvas, noiseFunction, seedX, seedY, seedZ, stepX, stepY, stepZ,
                               frequency, amplitude, persistence, octaves) {
        var w = canvas.width;
        var h = canvas.height;
        var context  = canvas.getContext("2d");
        var imageData = context.createImageData(w, h);

        var cubeSize = 100;

        var map = [cubeSize];
        for (var z = 0; z < cubeSize; z++) {
            map[z] = [cubeSize];
            for (var y = 0; y < cubeSize; y++) {
                map[z][y] = [cubeSize];
                for (var x = 0; x < cubeSize; x++) {
                    map[z][y][x] = noiseFunction(seedX + x * stepX, seedY + y * stepY, seedZ + z * stepZ,
                        frequency, amplitude, persistence, octaves) * 255;
                }
            }
        }

        var offset = 10;
        for(var z = 0; z < cubeSize / 2; z++) {
            for (var i = 0, l = imageData.data.length; i < l; i += 4) {
                var x = (i / 4) % w;
                var y = Math.floor(i / w / 4);
                var shadowOrLight = 0;

                if((x >= offset && y >= offset) &&
                    (cubeSize > x - offset && cubeSize > y - offset)) {
                    if(y - offset == 0) shadowOrLight += 50;
                    if(x - offset == 0) shadowOrLight -= 50;
                    var value = map[z * 2][y - offset][x - offset] + shadowOrLight;
                    imageData.data[i  ] = value;
                    imageData.data[i + 1] = value;
                    imageData.data[i + 2] = value;
                    imageData.data[i + 3] = 255;
                }
            }

            context.putImageData(imageData, 0, 0);

            offset++;
        }
    };

    // -> draw calls

    // ValueNoise 3D Linear
    drawNoise3D(
        document.getElementById("valueNoise3DLinear"),
        Noizy.ValueNoise.get3DLinear,
        seedX,
        seedY,
        seedZ,
        stepX,
        stepY,
        stepZ,
        frequency,
        amplitude,
        persistence,
        octaves
    );

    // ValueNoise 3D Cosine
    drawNoise3D(
        document.getElementById("valueNoise3DCosine"),
        Noizy.ValueNoise.get3DCosine,
        seedX,
        seedY,
        seedZ,
        stepX,
        stepY,
        stepZ,
        frequency,
        amplitude,
        persistence,
        octaves
    );

    // ValueNoise 3D Cubic
    drawNoise3D(
        document.getElementById("valueNoise3DCubic"),
        Noizy.ValueNoise.get3DCubic,
        seedX,
        seedY,
        seedZ,
        stepX,
        stepY,
        stepZ,
        frequency,
        amplitude,
        persistence,
        octaves
    );

    // GradientNoise 3D Linear
    drawNoise3D(
        document.getElementById("gradientNoise3D"),
        Noizy.GradientNoise.get3D,
        seedX,
        seedY,
        seedZ,
        stepX,
        stepY,
        stepZ,
        frequency,
        amplitude,
        persistence,
        octaves
    );
});