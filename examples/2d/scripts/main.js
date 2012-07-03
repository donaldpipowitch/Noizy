(function() {
	console.log(Noizy);

	// config
	var seedX = 1,
		seedY = 1,
		stepX = 0.01,
		stepY = 0.01,
		frequency = 1,
		amplitude = 0.2,
		persistence = 1,
		octaves = 5;

	// draw function
	var drawNoise2D = function(canvas, noiseFunction, seedX, seedY, stepX, stepY,
	                           frequency, amplitude, persistence, octaves, normalizeValue) {
		var w = canvas.width;
		var h = canvas.height;
		var context = canvas.getContext('2d');
		var imageData = context.createImageData(w, h);

		var map = [h];
		for (var y = 0; y < h; y++) {
			map[y] = [w];
			for (var x = 0; x < w; x++) {
				var noise = noiseFunction(seedX + x * stepX, seedY + y * stepY,
					frequency, amplitude, persistence, octaves) + normalizeValue;
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

	// -> draw calls (with modifications to get similar visual results)

	// ValueNoise 2D Linear
	drawNoise2D(
		document.getElementById('valueNoise2DLinear'),
		Noizy.ValueNoise.get2DLinear,
		seedX,
		seedY,
		stepX,
		stepY,
		frequency,
		amplitude,
		persistence,
		octaves,
		0
	);

	// ValueNoise 2D Cosine
	drawNoise2D(
		document.getElementById('valueNoise2DCosine'),
		Noizy.ValueNoise.get2DCosine,
		seedX,
		seedY,
		stepX,
		stepY,
		frequency,
		amplitude,
		persistence,
		octaves,
		0
	);

	// ValueNoise 2D Cubic
	drawNoise2D(
		document.getElementById('valueNoise2DCubic'),
		Noizy.ValueNoise.get2DCubic,
		seedX,
		seedY,
		stepX,
		stepY,
		frequency,
		amplitude,
		persistence,
		octaves,
		0
	);

	// GradientNoise 2D
	drawNoise2D(
		document.getElementById('gradientNoise2D'),
		Noizy.GradientNoise.get2D,
		seedX,
		seedY,
		stepX / 2,
		stepY / 2,
		frequency,
		amplitude,
		persistence * 1.1,
		octaves,
		0.5
	);

	// SimplexNoise 2D
	drawNoise2D(
		document.getElementById('simplexNoise2D'),
		Noizy.SimplexNoise.get2D,
		seedX,
		seedY,
		stepX / 2,
		stepY / 2,
		frequency,
		amplitude,
		persistence,
		octaves,
		0.5
	);
})();