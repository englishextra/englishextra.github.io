/*jshint node: true */
/*jshint esversion: 6 */
/*!
 * npmjs.com/package/gulp-autoprefixer
 * const gulp = require("gulp");
 * const sourcemaps = require("gulp-sourcemaps");
 * const autoprefixer = require("gulp-autoprefixer");
 * const concat = require("gulp-concat");
 * gulp.task("default", () =>
 * gulp.src("src")
 * .pipe(sourcemaps.init())
 * .pipe(autoprefixer())
 * .pipe(concat("all.css"))
 * .pipe(sourcemaps.write("."))
 * .pipe(gulp.dest("dest")));
 * npmjs.com/package/gulp-rename
 * npmjs.com/package/gulp-babel
 */
var gulp = require("gulp");
var gutil = require("gulp-util");
var bower = require("bower");
var sass = require("gulp-sass");
var sourcemaps = require("gulp-sourcemaps");
var autoprefixer = require("gulp-autoprefixer");
var cleancss = require("gulp-clean-css");
var rename = require("gulp-rename");
var sh = require("shelljs");
var babel = require("gulp-babel");
var uglify = require("gulp-uglify");
var rootDir = "./libs/pwa-englishextra/";
var paths = {
	sass: [rootDir + "scss/**/*.scss"]
};
gulp.task("default", ["sass", "babel"]);
gulp.task("sass", function (done) {
	"use strict";
	gulp.src(rootDir + "scss/*.scss")
	.pipe(sass())
	.on("error", sass.logError)
	.pipe(cleancss({
			format: {
				breaks: { // controls where to insert breaks
					afterAtRule: true, // controls if a line break comes after an at-rule; e.g. `@charset`; defaults to `false`
					afterBlockBegins: true, // controls if a line break comes after a block begins; e.g. `@media`; defaults to `false`
					afterBlockEnds: true, // controls if a line break comes after a block ends, defaults to `false`
					afterComment: true, // controls if a line break comes after a comment; defaults to `false`
					afterProperty: true, // controls if a line break comes after a property; defaults to `false`
					afterRuleBegins: true, // controls if a line break comes after a rule begins; defaults to `false`
					afterRuleEnds: true, // controls if a line break comes after a rule ends; defaults to `false`
					beforeBlockEnds: true, // controls if a line break comes before a block ends; defaults to `false`
					betweenSelectors: true // controls if a line break comes between selectors; defaults to `false`
				},
				indentBy: 1, // controls number of characters to indent with; defaults to `0`
				indentWith: "tab", // controls a character to indent with, can be `'space'` or `'tab'`; defaults to `'space'`
				spaces: { // controls where to insert spaces
					aroundSelectorRelation: true, // controls if spaces come around selector relations; e.g. `div > a`; defaults to `false`
					beforeBlockBegins: true, // controls if a space comes before a block begins; e.g. `.block {`; defaults to `false`
					beforeValue: true // controls if a space comes before a value; e.g. `width: 1rem`; defaults to `false`
				},
				wrapAt: false // controls maximum line length; defaults to `false`
			}
		}))
	.pipe(gulp.dest(rootDir + "css/"))
	.pipe(rename({
			extname: ".min.css"
		}))
	.pipe(sourcemaps.init())
	.pipe(autoprefixer())
	.pipe(cleancss({
			level: {
				1: {
					cleanupCharsets: true, // controls `@charset` moving to the front of a stylesheet; defaults to `true`
					normalizeUrls: false, // controls URL normalization; defaults to `true`
					optimizeBackground: true, // controls `background` property optimizations; defaults to `true`
					optimizeBorderRadius: true, // controls `border-radius` property optimizations; defaults to `true`
					optimizeFilter: true, // controls `filter` property optimizations; defaults to `true`
					optimizeFont: true, // controls `font` property optimizations; defaults to `true`
					optimizeFontWeight: true, // controls `font-weight` property optimizations; defaults to `true`
					optimizeOutline: true, // controls `outline` property optimizations; defaults to `true`
					removeEmpty: true, // controls removing empty rules and nested blocks; defaults to `true`
					removeNegativePaddings: false, // controls removing negative paddings; defaults to `true`
					removeQuotes: true, // controls removing quotes when unnecessary; defaults to `true`
					removeWhitespace: true, // controls removing unused whitespace; defaults to `true`
					replaceMultipleZeros: true, // contols removing redundant zeros; defaults to `true`
					replaceTimeUnits: true, // controls replacing time units with shorter values; defaults to `true`
					replaceZeroUnits: true, // controls replacing zero values with units; defaults to `true`
					roundingPrecision: false, // rounds pixel values to `N` decimal places; `false` disables rounding; defaults to `false`
					selectorsSortingMethod: "none", // denotes selector sorting method; can be `'natural'` or `'standard'`, `'none'`, or false (the last two since 4.1.0); defaults to `'standard'`
					specialComments: 0, // denotes a number of /*! ... */ comments preserved; defaults to `all`
					tidyAtRules: true, // controls at-rules (e.g. `@charset`, `@import`) optimizing; defaults to `true`
					tidyBlockScopes: true, // controls block scopes (e.g. `@media`) optimizing; defaults to `true`
					tidySelectors: true, // controls selectors optimizing; defaults to `true`,
					transform: function () {}
					// defines a callback for fine-grained property optimization; defaults to no-op
				}
			}
		}))
	.pipe(sourcemaps.write("."))
	.pipe(gulp.dest(rootDir + "css/"))
	.on("end", done);
});
gulp.task("babel", function (done) {
	"use strict";
	gulp.src(rootDir + "src/*.js")
	.pipe(gulp.dest(rootDir + "js/"))
	.pipe(rename({
			extname: ".min.js"
		}))
	.pipe(sourcemaps.init())
	.pipe(babel({
			presets: ["es2015"]
		}))
	.pipe(uglify())
	.pipe(sourcemaps.write("."))
	.pipe(gulp.dest(rootDir + "js/"))
	.on("end", done);
});
gulp.task("watch", function () {
	"use strict";
	gulp.watch(paths.sass, ["sass"]);
});
gulp.task("install", ["git-check"], function () {
	"use strict";
	return bower.commands.install()
	.on("log", function (data) {
		gutil.log("bower", gutil.colors.cyan(data.id), data.message);
	});
});
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
