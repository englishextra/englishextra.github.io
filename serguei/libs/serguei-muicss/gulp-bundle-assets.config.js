/*!
 * @see {@link https://github.com/dowjones/gulp-bundle-assets/blob/master/examples/full/bundle.config.js#L86}
 */
module.exports = {
	bundle: {
		"js/vendors": {
			scripts: [
				//"./node_modules/jquery/dist/jquery.js",
				//"./bower_components/mui/packages/cdn/js/mui.js",
				//"../../cdn/highlight.js/9.12.0/js/highlight.pack.fixed.js",
				//"../../cdn/t.js/0.1.0/js/t.fixed.js",
				//"./bower_components/verge/verge.js",
				//"../../cdn/verge/1.9.1/js/verge.fixed.js",
				//"../../cdn/iframe-lightbox/0.1.7/js/iframe-lightbox.fixed.js",
				"./bower_components/iframe-lightbox/iframe-lightbox.js",
				//"../../cdn/img-lightbox/0.1.2/js/img-lightbox.fixed.js",
				"./bower_components/img-lightbox/img-lightbox.js",
				//"../../cdn/qrjs2/0.1.6/js/qrjs2.fixed.js",
				"./bower_components/qrjs2/qrjs2.js",
				//"../../cdn/Tocca.js/2.0.1/js/Tocca.fixed.js",
				"./bower_components/Tocca.js/Tocca.js",
				//"../../cdn/wheel-indicator/1.1.4/js/wheel-indicator.fixed.js",
				"./bower_components/wheel-indicator/lib/wheel-indicator.js",
				//"../../cdn/resize/1.0.0/js/any-resize-event.fixed.js",
				"./node_modules/any-resize-event/dist/any-resize-event.js",
				//"../../cdn/macy.js/2.3.1/js/macy.fixed.js",
				"./node_modules/macy/dist/macy.js",
				//"../../cdn/mustache/2.3.0/js/mustache.fixed.js",
				"./node_modules/mustache/mustache.js",
				//"../../cdn/EventEmitter/5.2.5/js/EventEmitter.fixed.js",
				"./node_modules/wolfy87-eventemitter/EventEmitter.js",
				//"./node_modules/minigrid/dist/minigrid.min.js",
				"../../cdn/minigrid/3.1.1/js/minigrid.fixed.js",
				"../../cdn/ripple-js/1.4.4/js/ripple.fixed.js",
				"../../cdn/ReadMore.js/1.0.0/js/readMoreJS.fixed.js"
			],
			"options": {
				rev: false,
				uglify: false,
				maps: false,
				"pluginOptions": {
					'gulp-sourcemaps': {
						destPath: './'
					}
				}
			}
		},
		"js/vendors.min": {
			scripts: [
				//"./node_modules/jquery/dist/jquery.js",
				//"./bower_components/mui/packages/cdn/js/mui.js",
				//"../../cdn/highlight.js/9.12.0/js/highlight.pack.fixed.js",
				//"../../cdn/t.js/0.1.0/js/t.fixed.js",
				//"./bower_components/verge/verge.js",
				//"../../cdn/verge/1.9.1/js/verge.fixed.js",
				//"../../cdn/iframe-lightbox/0.1.7/js/iframe-lightbox.fixed.js",
				"./bower_components/iframe-lightbox/iframe-lightbox.js",
				//"../../cdn/img-lightbox/0.1.2/js/img-lightbox.fixed.js",
				"./bower_components/img-lightbox/img-lightbox.js",
				//"../../cdn/qrjs2/0.1.6/js/qrjs2.fixed.js",
				"./bower_components/qrjs2/qrjs2.js",
				//"../../cdn/Tocca.js/2.0.1/js/Tocca.fixed.js",
				"./bower_components/Tocca.js/Tocca.js",
				//"../../cdn/wheel-indicator/1.1.4/js/wheel-indicator.fixed.js",
				"./bower_components/wheel-indicator/lib/wheel-indicator.js",
				//"../../cdn/resize/1.0.0/js/any-resize-event.fixed.js",
				"./node_modules/any-resize-event/dist/any-resize-event.js",
				//"../../cdn/macy.js/2.3.1/js/macy.fixed.js",
				"./node_modules/macy/dist/macy.js",
				//"../../cdn/mustache/2.3.0/js/mustache.fixed.js",
				"./node_modules/mustache/mustache.js",
				//"../../cdn/EventEmitter/5.2.5/js/EventEmitter.fixed.js",
				"./node_modules/wolfy87-eventemitter/EventEmitter.js",
				//"./node_modules/minigrid/dist/minigrid.min.js",
				"../../cdn/minigrid/3.1.1/js/minigrid.fixed.js",
				"../../cdn/ripple-js/1.4.4/js/ripple.fixed.js",
				"../../cdn/ReadMore.js/1.0.0/js/readMoreJS.fixed.js"
			],
			"options": {
				rev: false,
				uglify: true,
				maps: true,
				"pluginOptions": {
					'gulp-sourcemaps': {
						destPath: './'
					}
				}
			}
		},
		"css/vendors": {
			styles: [
				//"./node_modules/normalize.css/normalize.css",
				//"../../cdn/highlight.js/9.12.0/css/hljs.css",
				"../../fonts/roboto-fontfacekit/2.137/css/roboto.css",
				"../../fonts/roboto-mono-fontfacekit/2.0.986/css/roboto-mono.css",
				//"../../fonts/material-design-icons/3.0.1/css/material-icons.css",
				//"../../fonts/MaterialDesign-Webfont/2.2.43/css/materialdesignicons.css",
				"./bower_components/mui/src/sass/mui.css",
				//"../../cdn/mui/0.9.39/css/mui.css",
				"./bower_components/iframe-lightbox/iframe-lightbox.css",
				//"../../cdn/iframe-lightbox/0.1.7/css/iframe-lightbox.fixed.css",
				"./bower_components/img-lightbox/img-lightbox.css"
				//"../../cdn/img-lightbox/0.1.2/css/img-lightbox.fixed.css"
			],
			"options": {
				rev: false,
				uglify: false,
				minCSS: false,
				maps: false,
				"pluginOptions": {
					'gulp-sourcemaps': {
						destPath: './'
					}
				}
			}
		},
		"css/vendors.min": {
			styles: [
				//"./node_modules/normalize.css/normalize.css",
				//"../../cdn/highlight.js/9.12.0/css/hljs.css",
				"../../fonts/roboto-fontfacekit/2.137/css/roboto.css",
				"../../fonts/roboto-mono-fontfacekit/2.0.986/css/roboto-mono.css",
				//"../../fonts/material-design-icons/3.0.1/css/material-icons.css",
				//"../../fonts/MaterialDesign-Webfont/2.2.43/css/materialdesignicons.css",
				"./bower_components/mui/src/sass/mui.css",
				//"../../cdn/mui/0.9.39/css/mui.css",
				"./bower_components/iframe-lightbox/iframe-lightbox.css",
				//"../../cdn/iframe-lightbox/0.1.7/css/iframe-lightbox.fixed.css",
				"./bower_components/img-lightbox/img-lightbox.css"
				//"../../cdn/img-lightbox/0.1.2/css/img-lightbox.fixed.css"
			],
			"options": {
				rev: false,
				uglify: true,
				minCSS: true,
				maps: true,
				"pluginOptions": {
					'gulp-sourcemaps': {
						destPath: './'
					}
				}
			}
		}
	}
};