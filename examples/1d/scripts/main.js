(function() {
	console.log(Noizy);

	// config
	var seedX = 1,
		stepX = 0.01,
		frequency = 1,
		amplitude = 0.2,
		persistence = 1,
		octaves = 5;

	// draw function
	var drawNoise1D = function(canvas, noiseFunction, seedX, stepX,
	                           frequency, amplitude, persistence, octaves) {
		var w = canvas.width;
		var h = canvas.height;
		var context = canvas.getContext('2d');
		var imageData = context.createImageData(w, h);

		var height = [];
		for (var i = 0; i < w; i++) {
			var noise = noiseFunction(seedX + i * stepX,
				frequency, amplitude, persistence, octaves);
			height[i] = noise * 50 + 50;
		}

		for (var i = 0, l = imageData.data.length; i < l; i += 4) {
			var x = (i / 4) % w;
			var y = Math.floor(i / w / 4);

			var value = 0;

			if (y < height[x]) value = 255;

			imageData.data[i  ] = value;
			imageData.data[i + 1] = value;
			imageData.data[i + 2] = value;
			imageData.data[i + 3] = 255;
		}

		context.putImageData(imageData, 0, 0);
	};

	// -> draw calls (with modifications to get similar visual results)

	// ValueNoise 1D Linear
	drawNoise1D(
		document.getElementById('valueNoise1DLinear'),
		Noizy.ValueNoise.get1DLinear,
		seedX,
		stepX,
		frequency,
		amplitude,
		persistence,
		octaves
	);

	// ValueNoise 1D Cosine
	drawNoise1D(
		document.getElementById('valueNoise1DCosine'),
		Noizy.ValueNoise.get1DCosine,
		seedX,
		stepX,
		frequency,
		amplitude,
		persistence,
		octaves
	);

	// ValueNoise 1D Cubic
	drawNoise1D(
		document.getElementById('valueNoise1DCubic'),
		Noizy.ValueNoise.get1DCubic,
		seedX,
		stepX,
		frequency,
		amplitude,
		persistence,
		octaves
	);

	// GradientNoise 1D Linear
	drawNoise1D(
		document.getElementById('gradientNoise1D'),
		Noizy.GradientNoise.get1D,
		seedX / 2,
		stepX / 2,
		frequency,
		amplitude,
		persistence * 1.2,
		octaves
	);
	// SimplexNoise 1D Linear
	drawNoise1D(
		document.getElementById('simplexNoise1D'),
		Noizy.SimplexNoise.get1D,
		seedX / 2,
		stepX / 2,
		frequency,
		amplitude,
		persistence,
		octaves
	);
})();