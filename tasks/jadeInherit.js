'use strict';

var JadeInheritance = require('jade-inheritance');

module.exports = function(grunt) {
	var config = grunt.config('jade.compile.files')[0],
		baseDir = config.cwd,
		src = config.src,
		changedFiles = [],

		onChange = grunt.util._.debounce(function() {
			var dependantFiles = [],
				jadeSrc, inheritance;

			jadeSrc = src.map(function(item) {
				return baseDir + '/' + item;
			});

			changedFiles.forEach(function(filename) {
				inheritance = new JadeInheritance(filename, baseDir, {basedir : baseDir});
				dependantFiles = dependantFiles.concat(inheritance.files);
			});

			dependantFiles = dependantFiles.filter(function(filename, i) {
				return grunt.file.isMatch(jadeSrc, baseDir + '/' + filename);
			});

			config.src = dependantFiles;

			grunt.config('jade.compile.files', [config]);

			changedFiles = [];
		}, 200);

	grunt.event.on('watch', function(action, filepath) {
		console.log(arguments);
		changedFiles.push(filepath);
		onChange();
	});
};