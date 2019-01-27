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

var currentLibName = "englishextra.github.io";

var getTimestamp = function () {
	var dateTime = Date.now();
	return Math.floor(dateTime / 1000);
};

var gulp = require("gulp");
var plumber = require("gulp-plumber");
var uglify = require("gulp-uglify");
var sourcemaps = require("gulp-sourcemaps");
var rename = require("gulp-rename");
var replace = require("gulp-replace");

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

var options = {
	libbundle: {
		src: "**/libs/**/src/*.js"
	},
	pwabuilderServiceworkers: {
		src: "./cdn/pwabuilder-serviceworkers/1.1.1/serviceWorker2/src/*.js",
		js: "./"
	}
};

gulp.task("lint-libbundle-js", function () {
	return gulp.src(options.libbundle.src)
	.pipe(eslint())
	.pipe(eslint.format())
	.pipe(eslint.failAfterError());
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

gulp.task("default", gulp.task("lint-libbundle-js"));
