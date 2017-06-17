/*jslint node: true */
/*jslint es6 */
module.exports = function (grunt) {
	"use strict";
	grunt.initConfig({
		jshint: {
			all: [
				"libs/**/js/bundle.js",
				"libs/**/js/vendor.js"
			]
		}
	});
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.registerTask("default", "jshint");
};
