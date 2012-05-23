//require(['../../../build/test'], function(test) {
require(['../../../src/Noizy', './benchmark'], function(Noizy, Benchmark) {

    // draw function
    var drawNoise1D = function(canvas, noiseFunction, seedX, stepX, frequency,
                               amplitude, persistence, octaves) {
        var w = canvas.width;
        var h = canvas.height;
        var context  = canvas.getContext("2d");
        var imageData = context.createImageData(w, h);

        var height = [];
        for (var i = 0; i < w; i++) {
            var noise = noiseFunction(seedX + i * stepX, frequency, amplitude, persistence, octaves);
            height[i] = noise * 50 + 50;
        }

        for (var i = 0, l = imageData.data.length; i < l; i += 4) {
            var x = (i / 4) % w;
            var y = Math.floor(i / w / 4);

            var value = 0;

            if(y < height[x]) value = 255;

            imageData.data[i  ] = value;
            imageData.data[i + 1] = value;
            imageData.data[i + 2] = value;
            imageData.data[i + 3] = 255;
        }

        context.putImageData(imageData, 0, 0);
    };

    var createDynamicCanvas = function(w, stepX, noiseFunction) {
        var seedX = 6,
            frequency = 1,  // smoothness
            amplitude = 1,  // contrast
            persistence = 1,    // similar to contrast (gain? gamma?)
            octaves = 1,    // detail
            canvas = document.createElement("canvas");

        canvas.width = w;
        canvas.height = 150;

        drawNoise1D(
            canvas,
            noiseFunction,
            seedX,
            stepX,
            frequency,
            amplitude,
            persistence,
            octaves
        );

        return canvas;
    };

    // examples

    $('#valueNoise1D').append(
        createDynamicCanvas(500, 0.04, Noizy.ValueNoise.get1DCosine)
    );
    $('#gradientNoise1D').append(
        createDynamicCanvas(500, 0.04, Noizy.GradientNoise.get1D)
    );

    // benchmark
    var testCount = 0;
    var suite = new Benchmark.Suite;

    // add tests
    suite/*.add('ValueNoise*500', function() {
        createDynamicCanvas(500, 0.04, Noizy.ValueNoise.get1DCosine);
    })
    .add('GradientNoise*500', function() {
        createDynamicCanvas(500, 0.04, Noizy.GradientNoise.get1D);
    })
    .add('ValueNoise*1000', function() {
        createDynamicCanvas(1000, 0.02, Noizy.ValueNoise.get1DCosine);
    })
    .add('GradientNoise*1000', function() {
        createDynamicCanvas(1000, 0.02, Noizy.GradientNoise.get1D);
    })
    .add('ValueNoise*2000', function() {
        createDynamicCanvas(2000, 0.01, Noizy.ValueNoise.get1DCosine);
    })
    .add('GradientNoise*2000', function() {
        createDynamicCanvas(2000, 0.01, Noizy.GradientNoise.get1D);
    })
    .add('ValueNoise*4000', function() {
        createDynamicCanvas(4000, 0.005, Noizy.ValueNoise.get1DCosine);
    })
    .add('GradientNoise*4000', function() {
        createDynamicCanvas(4000, 0.005, Noizy.GradientNoise.get1D);
    })*/
    .add('ValueNoise*8000', function() {
        createDynamicCanvas(8000, 0.0025, Noizy.ValueNoise.get1DCosine);
    })
    .add('GradientNoise*8000', function() {
        createDynamicCanvas(8000, 0.0025, Noizy.GradientNoise.get1D);
    })
    /*.add('ValueNoise*200', function() {
        createDynamicCanvas(200, 0.02, Noizy.ValueNoise.get1DCosine);
    })
    .add('ValueNoise*400', function() {
        createDynamicCanvas(400, 0.01, Noizy.ValueNoise.get1DCosine);
    })
    .add('ValueNoise*800', function() {
        createDynamicCanvas(800, 0.005, Noizy.ValueNoise.get1DCosine);
    })
    .add('ValueNoise*1600', function() {
        createDynamicCanvas(1600, 0.0025, Noizy.ValueNoise.get1DCosine);
    })
    .add('ValueNoise*3200', function() {
        createDynamicCanvas(3200, 0.00125, Noizy.ValueNoise.get1DCosine);
    })*/
    /*.add('GradientNoise*100', function() {
        createDynamicCanvas(100, 0.04, Noizy.GradientNoise.get1D);
    })
    .add('GradientNoise*200', function() {
        createDynamicCanvas(200, 0.02, Noizy.ValueNoise.get1D);
    })
    .add('GradientNoise*400', function() {
        createDynamicCanvas(400, 0.01, Noizy.ValueNoise.get1D);
    })
    .add('GradientNoise*800', function() {
        createDynamicCanvas(800, 0.005, Noizy.ValueNoise.get1D);
    })
    .add('GradientNoise*1600', function() {
        createDynamicCanvas(1600, 0.0025, Noizy.ValueNoise.get1D);
    })
    .add('GradientNoise*3200', function() {
        createDynamicCanvas(3200, 0.00125, Noizy.ValueNoise.get1D);
    })*/
    // add listeners
    .on('cycle', function(event, bench) {
        //console.log(this, arguments, event.target.stats.mean);
        $('#testCount').text('Absolvierte Messungen: ' + (++testCount));
        $('#noiseResults').append(
            '<p>' +
                event.target.name +
                ': ' +
                (Math.round(event.target.stats.mean * 1000)) +
                ' ms' +
                ' ± ' +
                (Math.round(event.target.stats.deviation * 1000)) +
                ' ms' +
                '</p>');
    })
    .on('complete', function() {
        //console.log('Fastest is ' + this.filter('fastest').pluck('name'));
        //console.log(this, arguments);

        $('#testsRunning').text('Messungen beendet.');
    })
    // run
    .run({async: true});
});