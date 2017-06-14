/*jslint node: true */
/*jslint es6 */
module.exports = function (grunt) {
	"use strict";
	grunt.initConfig({
		jshint: {
			all: [
				"libs/admin/js/bundle.js",
				"libs/branding/js/bundle.js",
				"libs/comments/js/bundle.js",
				"libs/comments/js/vendors.js",
				"libs/contents/js/bundle.js",
				"libs/english_for_free/js/bundle.js",
				"libs/paper/js/bundle.js",
				"libs/forbidden/js/bundle.js",
				"libs/index/js/bundle.js",
				"libs/irregular_verbs/js/bundle.js",
				"libs/irregular_verbs_with_shower/js/bundle.js",
				"libs/notfound/js/bundle.js",
				"libs/pictures/js/bundle.js",
				"libs/portfolio/js/bundle.js",
				"libs/products/js/bundle.js",
				"libs/search/js/bundle.js",
				"libs/search/js/vendors.js",
				"libs/serguei-eaststreet/js/bundle.js",
				"libs/serguei-webslides/js/bundle.js",
				"libs/sitemap/js/bundle.js"
			]
		}
	});
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.registerTask("default", "jshint");
};
