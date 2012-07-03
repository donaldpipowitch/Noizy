module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: '<json:package.json>',
		meta: {
			banner: '/*! <%= pkg.name %> - @author <%= pkg.author %> - ' +
				'<%= grunt.template.today("yyyy-mm-dd") %> */'
		},
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
		},
		jshint: {
			options: {
				// deactivate specific jshint options
				smarttabs: true
			}
		},
		lint: {
			files: [ '../build/Noizy.js']
		},
		min: {
			dist: {
				src: [
					'<banner>',
					'../build/Noizy.js'
				],
				dest: '../build/Noizy.min.js'
			}
		}
	});

	grunt.registerTask('default', 'concat lint min');
};