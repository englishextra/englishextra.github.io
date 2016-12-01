module.exports = function (grunt) {
	grunt.initConfig({
		jshint: {
			all: [
				"libs/admin/js/bundle.js",
				"libs/branding/js/bundle.js",
				"libs/comments/js/bundle.js",
				"libs/comments/js/vendors.js",
				"libs/contents/js/bundle.js",
				"libs/english_for_free/js/bundle.js",
				"libs/englishextra-ui/js/bundle.js",
				"libs/index/js/bundle.js",
				"libs/irregular_verbs/js/bundle.js",
				"libs/irregular_verbs_with_shower/js/bundle.js",
				"libs/notfound/js/bundle.js",
				"libs/pictures/js/bundle.js",
				"libs/portfolio/js/bundle.js",
				"libs/products/js/bundle.js",
				"libs/search/js/bundle.js",
				"libs/search/js/vendors.js",
				"libs/serguei/js/bundle.js"
			]
		}
	});
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.registerTask("default", "jshint");
};
