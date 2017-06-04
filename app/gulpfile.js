/*!
 * npmjs.com/package/gulp-autoprefixer
 * const gulp = require('gulp');
 * const sourcemaps = require('gulp-sourcemaps');
 * const autoprefixer = require('gulp-autoprefixer');
 * const concat = require('gulp-concat');
 * gulp.task('default', () =>
 * gulp.src('src')
 * .pipe(sourcemaps.init())
 * .pipe(autoprefixer())
 * .pipe(concat('all.css'))
 * .pipe(sourcemaps.write('.'))
 * .pipe(gulp.dest('dest')));
 * npmjs.com/package/gulp-rename
 * npmjs.com/package/gulp-babel
 */
var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var cleancss = require('gulp-clean-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var babel = require('gulp-babel');
var uglify = require('gulp-uglify');
var paths = {
	sass: ['./libs/pwa-englishextra/scss/**/*.scss']
};
gulp.task('default', ['sass', 'babel']);
gulp.task('sass', function (done) {
	gulp.src('./libs/pwa-englishextra/scss/bundle.scss')
	.pipe(sass())
	.pipe(sourcemaps.init())
	.pipe(autoprefixer())
	.on('error', sass.logError)
	/* .pipe(rename({
	suffix: '-compiled'
	})) */
	.pipe(gulp.dest('./libs/pwa-englishextra/css/'))
	.pipe(cleancss({
			keepSpecialComments: 0
		}))
	.pipe(rename({
			extname: '.min.css'
		}))
	.pipe(sourcemaps.write('.'))
	.pipe(gulp.dest('./libs/pwa-englishextra/css/'))
	.on('end', done);
});
gulp.task('babel', function (done) {
	return gulp.src('./libs/pwa-englishextra/js/bundle.js')
	.pipe(sourcemaps.init())
	.pipe(babel({
			presets: ['es2015']
		}))
	/* .pipe(rename({
	suffix: '-compiled'
	})) */
	.pipe(gulp.dest('./libs/pwa-englishextra/js/'))
	.pipe(uglify())
	.pipe(rename({
			extname: '.min.js'
		}))
	.pipe(sourcemaps.write('.'))
	.pipe(gulp.dest('./libs/pwa-englishextra/js/'));
});
gulp.task('watch', function () {
	gulp.watch(paths.sass, ['sass']);
});
gulp.task('install', ['git-check'], function () {
	return bower.commands.install()
	.on('log', function (data) {
		gutil.log('bower', gutil.colors.cyan(data.id), data.message);
	});
});
gulp.task('git-check', function (done) {
	if (!sh.which('git')) {
		console.log(
			' ' + gutil.colors.red('Git is not installed.'),
			'\n Git, the version control system, is required to download Ionic.',
			'\n Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
			'\n Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.');
		process.exit(1);
	}
	done();
});
gulp.task('generate-service-worker', function (callback) {
	var path = require('path');
	var swPrecache = require('sw-precache');
	var rootDir = './';
	swPrecache.write(`${rootDir}/service-worker.js`, {
		/*!
		 * @see {@link https://github.com/GoogleChrome/sw-precache/issues/97}
		 */
		staticFileGlobs: [rootDir + 'index.html',
			rootDir + 'manifest.json',
			rootDir + 'yandex-tableau.json',
			rootDir + '/**.{png,ico,svg}',
			rootDir + '/{cdn,libs,pages}/**/*.{png,jpg,html,js,json,css}'],
		stripPrefix: rootDir,
		stripPrefixMulti: {
			"node_modules/": 'scripts/'
		},
	}, callback);
});
