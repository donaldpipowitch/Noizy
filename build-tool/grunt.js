module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		concat:{
			complete:{
				src:[
					'../src/Noizy.js',
					'../src/PRNG.js',
					'../src/ValueNoise.js',
					'../src/GradientNoise.js',
					'../src/SimplexNoise.js'
				],
				dest:'../build/Noizy.js',
				separator: '\n\n'
			}
		}
	});

	grunt.registerTask('default', 'concat');
};