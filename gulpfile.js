/*jslint node: true */
/*jslint es6 */
gulp.task("git-check", function (done) {
	"use strict";
	if (!sh.which("git")) {
		console.log(
			" " + gutil.colors.red("Git is not installed."),
			"\n Git, the version control system, is required to download Ionic.",
			"\n Download git here:", gutil.colors.cyan("http://git-scm.com/downloads") + ".",
			"\n Once git is installed, run \"" + gutil.colors.cyan("gulp install") + "\" again.");
		process.exit(1);
	}
	done();
});
/*!
 * @see {@link https://github.com/GoogleChrome/sw-precache/issues/97}
 * @see {@link https://github.com/GoogleChrome/sw-precache#runtime-caching}
 * @see {@link https://developers.google.com/web/ilt/pwa/using-sw-precache-and-sw-toolbox}
 * @see {@link https://github.com/deanhume/Service-Worker-Toolbox/blob/master/sw.js}
 * @see {@link https://github.com/GoogleChrome/ioweb2016/blob/master/gulp_scripts/service-worker.js}
 */
gulp.task("generate-service-worker", function (callback) {
	"use strict";
	var path = require("path");
	var swPrecache = require("sw-precache");
	swPrecache.write(`service-worker.min.js`, {
	cacheId: "englishextra",
	directoryIndex: "/",
	navigateFallback: "./",
	/* dynamicUrlToDependencies: {
		"./": "index.html"
	}, */
	staticFileGlobs: [
		"index.html"// ,
		// "manifest.json",
		// "yandex-tableau.json",
		// "**.{png,ico,svg}",
		// "cdn/**/*.{png,jpg,js,json,css}",
		// "fonts/**/*.{eot,ttf,woff,woff2}",
		// "libs/**/img/**/*.{png,jpg}",
		// "pages/**/*.html"
		],
	stripPrefix: "",
	runtimeCaching: [{
			urlPattern: /^https:\/\/yastatic\.net/,
			handler: "networkFirst"/* ,
			options: {
				debug: true
			} */
		}, {
			urlPattern: /^https:\/\/vk\.com/,
			handler: "networkFirst"/* ,
			options: {
				debug: true
			} */
		}, {
			urlPattern: /^https:\/\/mc\.yandex\.ru/,
			handler: "networkFirst"/* ,
			options: {
				debug: true
			} */
		}, {
			urlPattern: /^https:\/\/www\.google-analytics\.com/,
			handler: "networkFirst"/* ,
			options: {
				debug: true
			} */
		}, {
			urlPattern: /^https:\/\/ssl\.google-analytics\.com/,
			handler: "networkFirst"/* ,
			options: {
				debug: true
			} */
		}, {
			urlPattern: /^https:\/\/(.*?)\.disqus\.com/,
			handler: "networkOnly"/* ,
			options: {
				debug: true
			} */
		}, {
			urlPattern: /^https:\/\/w\.soundcloud\.com/,
			handler: "networkOnly"/* ,
			options: {
				debug: true
			} */
		}, {
			urlPattern: /^https:\/\/player\.vimeo\.com/,
			handler: "networkOnly"/* ,
			options: {
				debug: true
			} */
		}, {
			urlPattern: /^https:\/\/www\.youtube\.com/,
			handler: "networkOnly"/* ,
			options: {
				debug: true
			} */
		}, {
			urlPattern: /^https:\/\/(.*?)\.staticflickr\.com/,
			handler: "networkFirst"/* ,
			options: {
				debug: true
			} */
		}, {
			urlPattern: /^\/([^\/]+\.js)$/,
			handler: "networkOnly",
			options: {
				debug: true
			}
		}, {
			urlPattern: /^\/([^\/]+\.json)$/,
			handler: "networkOnly",
			options: {
				debug: true
			}
		}, {
			urlPattern: /\/cdn\//,
			handler: "networkFirst"/* ,
			options: {
				debug: true
			} */
		}, {
			urlPattern: /\/pages\//,
			handler: "networkFirst"/* ,
			options: {
				debug: true
			} */
		}, {
			urlPattern: /\/libs\//,
			handler: "networkFirst"/* ,
			options: {
				debug: true
			} */
		}
	]
	}, callback);
});
