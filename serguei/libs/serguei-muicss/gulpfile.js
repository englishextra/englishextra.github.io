/*global require */
/*!
 * @see {@link https://github.com/mildrenben/surface/blob/master/gulpfile.js}
 * @see {@link https://www.webstoemp.com/blog/gulp-setup/}
 * @see {@link https://gulpjs.com/plugins/blackList.json}
 * @see {@link https://hackernoon.com/how-to-automate-all-the-things-with-gulp-b21a3fc96885}
 * @see {@link https://stackoverflow.com/questions/36897877/gulp-error-the-following-tasks-did-not-complete-did-you-forget-to-signal-async}
 * @see {@link https://zzz.buzz/2016/11/19/gulp-4-0-upgrade-guide/}
 * @see {@link https://blog.khophi.co/migrate-gulp-4-complete-example/}
 * @see {@link https://www.joezimjs.com/javascript/complete-guide-upgrading-gulp-4/}
 * @see {@link https://codeburst.io/switching-to-gulp-4-0-271ae63530c0}
 */
var currentLibName = "serguei-muicss";

var getTimestamp = function () {
	var dateTime = Date.now();
	return Math.floor(dateTime / 1000);
};

var gulp = require("gulp");
var plumber = require("gulp-plumber");
var sass = require("gulp-sass");
var minifyCss = require("gulp-clean-css");
var cleanCssOptions = {
	level: {
		1: {
			specialComments: 0
		}
	}
};
var uglify = require("gulp-uglify");
var sourcemaps = require("gulp-sourcemaps");
var rename = require("gulp-rename");
var replace = require("gulp-replace");
var concat = require("gulp-concat");
/* var bundle = require("gulp-bundle-assets"); */

var browserSync = require("browser-sync").create();
var reload = browserSync.reload;

/*!
 * @see {@link https://github.com/postcss/autoprefixer#options}
 */
var autoprefixer = require("gulp-autoprefixer");
var autoprefixerOptions;
autoprefixerOptions = {
	browsers: ["last 2 versions"]
};

/*!
 * @see {@link https://github.com/babel/babel/issues/7910}
 */

var babel = require("gulp-babel");
var babelOptions;
babelOptions = {
	"sourceType": "script",
	"presets": ["@babel/env"],
	"plugins": ["@babel/plugin-transform-object-assign",
		"@babel/plugin-transform-arrow-functions",
		"@babel/plugin-transform-async-to-generator"]
};

/*!
 * @see {@link https://github.com/beautify-web/js-beautify}
 * a JSON-formatted file indicated by the --config parameter
 * a .jsbeautifyrc file containing JSON data at any level of the filesystem above $PWD
 * using external config may cause
 * failure to find it
 * if the input/output files reside higher
 * than the config file itself
 */
/* var beautify = require("gulp-jsbeautifier"); */
var beautifyOptions;
beautifyOptions = {
	/* "config": ".jsbeautifyrc", */
	"editorconfig": false,
	"indent_size": 4,
	"indent_char": "\t",
	"indent_with_tabs": true,
	"eol": "\n",
	"end_with_newline": true,
	"indent_level": 0,
	"preserve_newlines": true,
	"max_preserve_newlines": 10,
	"html": {
		"indent_inner_html": true,
		"indent_scripts": false,
		"js": {},
		"css": {}
	},
	"css": {
		"newline_between_rules": true
	},
	"js": {
		"space_in_paren": false,
		"space_in_empty_paren": false,
		"jslint_happy": false,
		"space_after_anon_function": true,
		"space_after_named_function": false,
		"brace_style": "collapse",
		"unindent_chained_methods": false,
		"break_chained_methods": true,
		"keep_array_indentation": true,
		"unescape_strings": false,
		"wrap_line_length": 0,
		"e4x": false,
		"comma_first": false,
		"operator_position": "before-newline"
	}
};

/*!
 * @see {@link https://prettier.io/docs/en/options.html}
 * using external config may cause
 * failure to find it
 * if the input/output files reside higher
 * than the config file itself
 */
var prettier = require("gulp-prettier");
var prettierOptions;
prettierOptions = {
	/* "config": ".prettierrc", */
	"tabWidth": 4,
	"useTabs": true,
	"endOfLine": "lf",
	"printWidth:": 0
};

var stripDebug = require("gulp-strip-debug");

var eslint = require("gulp-eslint");

/*!
 * @see {@link https://github.com/sasstools/sass-lint/blob/master/docs/sass-lint.yml}
 * @see {@link https://codebeautify.org/yaml-to-json-xml-csv}
 */
var csslint = require("gulp-sass-lint");
var csslintOptions;
var csslintOptions = {
	"options": {
		"merge-default-rules": false,
		"max-warnings": 50
	},
	"files": {
		"ignore": ["scss/_font-face.scss"]
	},
	"rules": {
		"attribute-quotes": 0,
		"border-zero": 0,
		"brace-style": 0,
		"class-name-format": 0,
		"clean-import-paths": 0,
		"empty-args": 0,
		"empty-line-between-blocks": 0,
		"extends-before-declarations": 0,
		"extends-before-mixins": 0,
		"final-newline": 0,
		"force-attribute-nesting": 0,
		"force-element-nesting": 0,
		"force-pseudo-nesting": 0,
		"function-name-format": 0,
		"hex-length": 0,
		"hex-notation": 0,
		"indentation": 0,
		"leading-zero": 0,
		"mixin-name-format": 0,
		"mixins-before-declarations": 0,
		"nesting-depth": 0,
		"no-color-keywords": 0,
		"no-color-literals": 0,
		"no-css-comments": 0,
		"no-debug": 0,
		"no-duplicate-properties": 0,
		"no-empty-rulesets": 0,
		"no-extends": 0,
		"no-ids": 0,
		"no-important": 0,
		"no-invalid-hex": 0,
		"no-mergeable-selectors": 0,
		"no-misspelled-properties": 0,
		"no-qualifying-elements": 0,
		"no-trailing-zero": 0,
		"no-transition-all": 0,
		"no-url-protocols": 0,
		"no-vendor-prefixes": 0,
		"no-warn": 0,
		"one-declaration-per-line": 0,
		"placeholder-in-extend": 0,
		"placeholder-name-format": 0,
		"property-sort-order": 0,
		"pseudo-element": 0,
		"quotes": 0,
		"shorthand-values": 0,
		"single-line-per-selector": 0,
		"space-after-bang": 0,
		"space-after-colon": 0,
		"space-after-comma": 0,
		"space-around-operator": 0,
		"space-before-bang": 0,
		"space-before-brace": 0,
		"space-before-colon": 0,
		"space-between-parens": 0,
		"trailing-semicolon": 0,
		"url-quotes": 0,
		"variable-for-property": 0,
		"variable-name-format": 0,
		"zero-unit": 0
	}
};

var options = {
	muicss: {
		scss: "../../cdn/mui/0.9.39/scss/*.scss",
		css: "../../cdn/mui/0.9.39/css"
	},
	material: {
		scss: "../../fonts/MaterialDesign-Webfont/2.2.43/scss/*.scss",
		css: "../../fonts/MaterialDesign-Webfont/2.2.43/css"
	},
	roboto: {
		scss: "../../fonts/roboto-fontfacekit/2.137/scss/*.scss",
		css: "../../fonts/roboto-fontfacekit/2.137/css"
	},
	robotomono: {
		scss: "../../fonts/roboto-mono-fontfacekit/2.0.986/scss/*.scss",
		css: "../../fonts/roboto-mono-fontfacekit/2.0.986/css"
	},
	highlightjs: {
		src: "../../cdn/highlight.js/9.12.0/src/*.js",
		js: "../../cdn/highlight.js/9.12.0/js",
		scss: "../../cdn/highlight.js/9.12.0/scss/*.scss",
		css: "../../cdn/highlight.js/9.12.0/css"
	},
	iframelightbox: {
		src: "../../cdn/iframe-lightbox/0.2.8/src/*.js",
		js: "../../cdn/iframe-lightbox/0.2.8/js",
		scss: "../../cdn/iframe-lightbox/0.2.8/scss/*.scss",
		css: "../../cdn/iframe-lightbox/0.2.8/css"
	},
	imglightbox: {
		src: "../../cdn/img-lightbox/0.2.3/src/*.js",
		js: "../../cdn/img-lightbox/0.2.3/js",
		scss: "../../cdn/img-lightbox/0.2.3/scss/*.scss",
		css: "../../cdn/img-lightbox/0.2.3/css"
	},
	glightbox: {
		src: "../../cdn/glightbox/1.0.8/src/*.js",
		js: "../../cdn/glightbox/1.0.8/js",
		scss: "../../cdn/glightbox/1.0.8/scss/*.scss",
		css: "../../cdn/glightbox/1.0.8/css"
	},
	lightgalleryjs: {
		src: "../../cdn/lightgallery.js/1.1.1/src/*.js",
		js: "../../cdn/lightgallery.js/1.1.1/js",
		scss: "../../cdn/lightgallery.js/1.1.1/scss/*.scss",
		css: "../../cdn/lightgallery.js/1.1.1/css",
		plugins: {
			src: "../../cdn/lightgallery.js/1.1.1/src/plugins/*.js",
			js: "../../cdn/lightgallery.js/1.1.1/js",
			concatOptions: {
				js: {
					path: "lightgallery.plugins.fixed.js",
					newLine: "\n"
				}
			}
		}
	},
	libbundle: {
		src: "./src/*.js",
		js: "./js",
		scss: "./scss/*.scss",
		css: "./css"
	},
	vendors: {
		src: [
			"../../cdn/minigrid/3.1.1/js/minigrid.fixed.js",
			"../../cdn/ReadMore.js/1.0.0/js/readMoreJS.fixed.js",
			"../../cdn/ripple-js/1.4.4/js/ripple.fixed.js",
			"../../cdn/iframe-lightbox/0.2.8/js/iframe-lightbox.fixed.js",
			"../../cdn/img-lightbox/0.2.3/js/img-lightbox.fixed.js",
			"../../cdn/qrjs2/0.1.7/js/qrjs2.fixed.js",
			"../../cdn/Tocca.js/2.0.1/js/Tocca.fixed.js",
			"../../cdn/wheel-indicator/1.1.4/js/wheel-indicator.fixed.js",
			"../../cdn/resize/1.0.0/js/any-resize-event.fixed.js",
			"../../cdn/mustache/2.3.0/js/mustache.fixed.js",
			"../../cdn/EventEmitter/5.2.5/js/EventEmitter.fixed.js"
		],
		js: "./js",
		scss: [
			"../../fonts/roboto-fontfacekit/2.137/css/roboto.css",
			"../../fonts/roboto-mono-fontfacekit/2.0.986/css/roboto-mono.css",
			"../../cdn/iframe-lightbox/0.2.8/css/iframe-lightbox.fixed.css",
			"../../cdn/img-lightbox/0.2.3/css/img-lightbox.fixed.css",
			"../../cdn/mui/0.9.39/css/mui.css"
		],
		css: "./css",
		concatOptions: {
			css: {
				path: "vendors.css",
				newLine: "\n"
			},
			js: {
				path: "vendors.js",
				newLine: "\n"
			}
		}
	},
	pwabuilderServiceworkers: {
		src: "../../cdn/pwabuilder-serviceworkers/1.1.1/serviceWorker2/src/*.js",
		js: "../../"
	}
};

gulp.task("compile-material-css", function () {
	return gulp.src(options.material.scss)
	.pipe(plumber())
	.pipe(sourcemaps.init())
	.pipe(sass({
			errLogToConsole: true
		}))
	.pipe(autoprefixer(autoprefixerOptions))
	.pipe(prettier(prettierOptions))
	/* .pipe(beautify(beautifyOptions)) */
	.pipe(rename(function (path) {
			path.basename += ".min";
		}))
	.pipe(minifyCss(cleanCssOptions))
	.pipe(sourcemaps.write("."))
	.pipe(gulp.dest(options.material.css))
	.pipe(plumber.stop());
});

gulp.task("compile-roboto-css", function () {
	return gulp.src(options.roboto.scss)
	.pipe(plumber())
	.pipe(sourcemaps.init())
	.pipe(sass({
			errLogToConsole: true
		}))
	.pipe(autoprefixer(autoprefixerOptions))
	.pipe(prettier(prettierOptions))
	/* .pipe(beautify(beautifyOptions)) */
	.pipe(gulp.dest(options.roboto.css))
	.pipe(rename(function (path) {
			path.basename += ".min";
		}))
	.pipe(minifyCss(cleanCssOptions))
	.pipe(sourcemaps.write("."))
	.pipe(gulp.dest(options.roboto.css))
	.pipe(plumber.stop());
});

gulp.task("compile-roboto-mono-css", function () {
	return gulp.src(options.robotomono.scss)
	.pipe(plumber())
	.pipe(sourcemaps.init())
	.pipe(sass({
			errLogToConsole: true
		}))
	.pipe(autoprefixer(autoprefixerOptions))
	.pipe(prettier(prettierOptions))
	/* .pipe(beautify(beautifyOptions)) */
	.pipe(gulp.dest(options.robotomono.css))
	.pipe(rename(function (path) {
			path.basename += ".min";
		}))
	.pipe(minifyCss(cleanCssOptions))
	.pipe(sourcemaps.write("."))
	.pipe(gulp.dest(options.robotomono.css))
	.pipe(plumber.stop());
});

gulp.task("compile-libbundle-css", function () {
	return gulp.src(options.libbundle.scss)
	.pipe(plumber())
	.pipe(sourcemaps.init())
	.pipe(sass({
			errLogToConsole: true
		}))
	.pipe(autoprefixer(autoprefixerOptions))
	.pipe(prettier(prettierOptions))
	/* .pipe(beautify(beautifyOptions)) */
	.pipe(gulp.dest(options.libbundle.css))
	.pipe(rename(function (path) {
			path.basename += ".min";
		}))
	.pipe(minifyCss(cleanCssOptions))
	.pipe(sourcemaps.write("."))
	.pipe(gulp.dest(options.libbundle.css))
	.pipe(plumber.stop());
});

gulp.task("lint-libbundle-css", function () {
	return gulp.src(options.libbundle.scss)
	.pipe(csslint(csslintOptions))
	.pipe(csslint.format())
	.pipe(csslint.failOnError());
});

gulp.task("compile-libbundle-js", function () {
	return gulp.src(options.libbundle.src)
	.pipe(plumber())
	.pipe(sourcemaps.init())
	.pipe(babel(babelOptions))
	.pipe(prettier(prettierOptions))
	/* .pipe(beautify(beautifyOptions)) */
	.pipe(gulp.dest(options.libbundle.js))
	.pipe(rename(function (path) {
			path.basename += ".min";
		}))
	.pipe(stripDebug())
	.pipe(uglify())
	.pipe(sourcemaps.write("."))
	.pipe(gulp.dest(options.libbundle.js))
	.pipe(plumber.stop());
});

gulp.task("lint-libbundle-js", function () {
	return gulp.src(options.libbundle.src)
	.pipe(eslint())
	.pipe(eslint.format())
	.pipe(eslint.failAfterError());
});

gulp.task("compile-vendors-css", function () {
	return gulp.src(options.vendors.scss)
	.pipe(plumber())
	.pipe(sourcemaps.init())
	.pipe(sass({
			errLogToConsole: true
		}))
	.pipe(autoprefixer(autoprefixerOptions))
	.pipe(prettier(prettierOptions))
	/* .pipe(beautify(beautifyOptions)) */
	.pipe(concat(options.vendors.concatOptions.css))
	.pipe(gulp.dest(options.vendors.css))
	.pipe(rename(function (path) {
			path.basename += ".min";
		}))
	.pipe(minifyCss(cleanCssOptions))
	.pipe(sourcemaps.write("."))
	.pipe(gulp.dest(options.vendors.css))
	.pipe(plumber.stop());
});

gulp.task("compile-vendors-js", function () {
	return gulp.src(options.vendors.src)
	.pipe(plumber())
	.pipe(sourcemaps.init())
	.pipe(babel(babelOptions))
	.pipe(prettier(prettierOptions))
	/* .pipe(beautify(beautifyOptions)) */
	.pipe(concat(options.vendors.concatOptions.js))
	.pipe(gulp.dest(options.vendors.js))
	.pipe(rename(function (path) {
			path.basename += ".min";
		}))
	.pipe(stripDebug())
	.pipe(uglify())
	.pipe(sourcemaps.write("."))
	.pipe(gulp.dest(options.vendors.js))
	.pipe(plumber.stop());
});

gulp.task("lint-vendors-js", function () {
	return gulp.src(options.vendors.src)
	.pipe(eslint())
	.pipe(eslint.format())
	.pipe(eslint.failAfterError());
});

gulp.task("compile-muicss-css", function () {
	return gulp.src(options.muicss.scss)
	.pipe(plumber())
	.pipe(sourcemaps.init())
	.pipe(sass({
			errLogToConsole: true
		}))
	.pipe(autoprefixer(autoprefixerOptions))
	.pipe(prettier(prettierOptions))
	/* .pipe(beautify(beautifyOptions)) */
	.pipe(gulp.dest(options.muicss.css))
	.pipe(rename(function (path) {
			path.basename += ".min";
		}))
	.pipe(minifyCss(cleanCssOptions))
	.pipe(sourcemaps.write("."))
	.pipe(gulp.dest(options.muicss.css))
	.pipe(plumber.stop());
});

gulp.task("compile-highlightjs-css", function () {
	return gulp.src(options.highlightjs.scss)
	.pipe(plumber())
	.pipe(sourcemaps.init())
	.pipe(sass({
			errLogToConsole: true
		}))
	.pipe(autoprefixer(autoprefixerOptions))
	.pipe(prettier(prettierOptions))
	/* .pipe(beautify(beautifyOptions)) */
	.pipe(gulp.dest(options.highlightjs.css))
	.pipe(rename(function (path) {
			path.basename += ".min";
		}))
	.pipe(minifyCss(cleanCssOptions))
	.pipe(sourcemaps.write("."))
	.pipe(gulp.dest(options.highlightjs.css))
	.pipe(plumber.stop());
});

gulp.task("compile-highlightjs-js", function () {
	return gulp.src(options.highlightjs.src)
	.pipe(plumber())
	.pipe(sourcemaps.init())
	.pipe(babel(babelOptions))
	.pipe(prettier(prettierOptions))
	/* .pipe(beautify(beautifyOptions)) */
	.pipe(gulp.dest(options.highlightjs.js))
	.pipe(rename(function (path) {
			path.basename += ".min";
		}))
	.pipe(stripDebug())
	.pipe(uglify())
	.pipe(sourcemaps.write("."))
	.pipe(gulp.dest(options.highlightjs.js))
	.pipe(plumber.stop());
});

gulp.task("compile-img-lightbox-css", function () {
	return gulp.src(options.imglightbox.scss)
	.pipe(plumber())
	.pipe(sourcemaps.init())
	.pipe(sass({
			errLogToConsole: true
		}))
	.pipe(autoprefixer(autoprefixerOptions))
	.pipe(prettier(prettierOptions))
	/* .pipe(beautify(beautifyOptions)) */
	.pipe(gulp.dest(options.imglightbox.css))
	.pipe(rename(function (path) {
			path.basename += ".min";
		}))
	.pipe(minifyCss(cleanCssOptions))
	.pipe(sourcemaps.write("."))
	.pipe(gulp.dest(options.imglightbox.css))
	.pipe(plumber.stop());
});

gulp.task("compile-img-lightbox-js", function () {
	return gulp.src(options.imglightbox.src)
	.pipe(plumber())
	.pipe(sourcemaps.init())
	.pipe(babel(babelOptions))
	.pipe(prettier(prettierOptions))
	/* .pipe(beautify(beautifyOptions)) */
	.pipe(gulp.dest(options.imglightbox.js))
	.pipe(rename(function (path) {
			path.basename += ".min";
		}))
	.pipe(stripDebug())
	.pipe(uglify())
	.pipe(sourcemaps.write("."))
	.pipe(gulp.dest(options.imglightbox.js))
	.pipe(plumber.stop());
});

gulp.task("compile-iframe-lightbox-css", function () {
	return gulp.src(options.iframelightbox.scss)
	.pipe(plumber())
	.pipe(sourcemaps.init())
	.pipe(sass({
			errLogToConsole: true
		}))
	.pipe(autoprefixer(autoprefixerOptions))
	.pipe(prettier(prettierOptions))
	/* .pipe(beautify(beautifyOptions)) */
	.pipe(gulp.dest(options.iframelightbox.css))
	.pipe(rename(function (path) {
			path.basename += ".min";
		}))
	.pipe(minifyCss(cleanCssOptions))
	.pipe(sourcemaps.write("."))
	.pipe(gulp.dest(options.iframelightbox.css))
	.pipe(plumber.stop());
});

gulp.task("compile-iframe-lightbox-js", function () {
	return gulp.src(options.iframelightbox.src)
	.pipe(plumber())
	.pipe(sourcemaps.init())
	.pipe(babel(babelOptions))
	.pipe(prettier(prettierOptions))
	/* .pipe(beautify(beautifyOptions)) */
	.pipe(gulp.dest(options.iframelightbox.js))
	.pipe(rename(function (path) {
			path.basename += ".min";
		}))
	.pipe(stripDebug())
	.pipe(uglify())
	.pipe(sourcemaps.write("."))
	.pipe(gulp.dest(options.iframelightbox.js))
	.pipe(plumber.stop());
});

gulp.task("compile-lightgalleryjs-css", function () {
	return gulp.src(options.lightgalleryjs.scss)
	.pipe(plumber())
	.pipe(sourcemaps.init())
	.pipe(sass({
			errLogToConsole: true
		}))
	.pipe(autoprefixer(autoprefixerOptions))
	.pipe(prettier(prettierOptions))
	/* .pipe(beautify(beautifyOptions)) */
	.pipe(gulp.dest(options.lightgalleryjs.css))
	.pipe(rename(function (path) {
			path.basename += ".min";
		}))
	.pipe(minifyCss(cleanCssOptions))
	.pipe(sourcemaps.write("."))
	.pipe(gulp.dest(options.lightgalleryjs.css))
	.pipe(plumber.stop());
});

gulp.task("compile-lightgalleryjs-js", function () {
	return gulp.src(options.lightgalleryjs.src)
	.pipe(plumber())
	.pipe(sourcemaps.init())
	.pipe(babel(babelOptions))
	.pipe(prettier(prettierOptions))
	/* .pipe(beautify(beautifyOptions)) */
	.pipe(gulp.dest(options.lightgalleryjs.js))
	.pipe(rename(function (path) {
			path.basename += ".min";
		}))
	.pipe(stripDebug())
	.pipe(uglify())
	.pipe(sourcemaps.write("."))
	.pipe(gulp.dest(options.lightgalleryjs.js))
	.pipe(plumber.stop());
});

gulp.task("compile-lightgalleryjs-plugins-js", function () {
	return gulp.src(options.lightgalleryjs.plugins.src)
	.pipe(plumber())
	.pipe(sourcemaps.init())
	.pipe(babel(babelOptions))
	.pipe(prettier(prettierOptions))
	/* .pipe(beautify(beautifyOptions)) */
	.pipe(concat(options.lightgalleryjs.plugins.concatOptions.js))
	.pipe(concat(options.lightgalleryjs.plugins.concatOptions.js))
	.pipe(gulp.dest(options.lightgalleryjs.plugins.js))
	.pipe(rename(function (path) {
			path.basename += ".min";
		}))
	.pipe(stripDebug())
	.pipe(uglify())
	.pipe(sourcemaps.write("."))
	.pipe(gulp.dest(options.lightgalleryjs.plugins.js))
	.pipe(plumber.stop());
});

gulp.task("compile-glightbox-css", function () {
	return gulp.src(options.glightbox.scss)
	.pipe(plumber())
	.pipe(sourcemaps.init())
	.pipe(sass({
			errLogToConsole: true
		}))
	.pipe(autoprefixer(autoprefixerOptions))
	.pipe(prettier(prettierOptions))
	/* .pipe(beautify(beautifyOptions)) */
	.pipe(gulp.dest(options.glightbox.css))
	.pipe(rename(function (path) {
			path.basename += ".min";
		}))
	.pipe(minifyCss(cleanCssOptions))
	.pipe(sourcemaps.write("."))
	.pipe(gulp.dest(options.glightbox.css))
	.pipe(plumber.stop());
});

gulp.task("compile-glightbox-js", function () {
	return gulp.src(options.glightbox.src)
	.pipe(plumber())
	.pipe(sourcemaps.init())
	.pipe(babel(babelOptions))
	.pipe(prettier(prettierOptions))
	/* .pipe(beautify(beautifyOptions)) */
	.pipe(gulp.dest(options.glightbox.js))
	.pipe(rename(function (path) {
			path.basename += ".min";
		}))
	.pipe(stripDebug())
	.pipe(uglify())
	.pipe(sourcemaps.write("."))
	.pipe(gulp.dest(options.glightbox.js))
	.pipe(plumber.stop());
});

gulp.task("compile-pwabuilder-serviceworkers-js", function () {
	return gulp.src(options.pwabuilderServiceworkers.src)
	.pipe(plumber())
	.pipe(sourcemaps.init())
	.pipe(rename(function (path) {
			var pattern = /pwabuilder-|.fixed/ig;
			path.basename = path.basename.replace(pattern, "");
		}))
	.pipe(replace("pwabuilder-offline", "" + currentLibName + "-offline-v" + getTimestamp()))
	.pipe(babel(babelOptions))
	.pipe(prettier(prettierOptions))
	/* .pipe(beautify(beautifyOptions)) */
	.pipe(gulp.dest(options.pwabuilderServiceworkers.js))
	.pipe(rename(function (path) {
			path.basename += ".min";
		}))
	.pipe(stripDebug())
	.pipe(uglify())
	.pipe(sourcemaps.write("."))
	.pipe(gulp.dest(options.pwabuilderServiceworkers.js))
	.pipe(plumber.stop());
});

/*!
 * @see {@link https://browsersync.io/docs/gulp}
 */
gulp.task("browser-sync", gulp.series(gulp.parallel(
			"lint-libbundle-js",
			"lint-libbundle-css",
			"lint-vendors-js"), function watchChanges() {

		browserSync.init({
			server: "../../"
		});

		gulp.watch("../../**/*.html").on("change", reload);
		gulp.watch("../../libs/" + currentLibName + "/css/*.css").on("change", reload);
		gulp.watch("../../libs/" + currentLibName + "/scss/*.scss", gulp.parallel("compile-libbundle-css")).on("change", reload);
		gulp.watch("../../libs/" + currentLibName + "/js/*.js").on("change", reload);
		gulp.watch("../../libs/" + currentLibName + "/src/*.js", gulp.parallel("compile-libbundle-js")).on("change", reload);
		gulp.watch("../../libs/" + currentLibName + "/json/*.json").on("change", reload);
	}));

gulp.task("default", gulp.task("browser-sync"));
