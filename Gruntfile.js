/*jslint node: true */
/*jslint esversion: 6 */
module.exports = function (grunt) {
	"use strict";
	grunt.initConfig({
		jshint: {
			all: [
				"**/libs/**/src/bundle.js"//,
				//"**/libs/**/js/include-script/src/*.js"
			]
		}
	});
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.registerTask("default", "jshint");
};
