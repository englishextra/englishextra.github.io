module.exports = function (grunt) {
	grunt.initConfig({
		jshint: {
			all: ["libs/pwa-englishextra/js/bundle.js"]
		}
	});
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.registerTask("default", "jshint");
};
