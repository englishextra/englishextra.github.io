/*!
 * @see {@link https://github.com/dowjones/gulp-bundle-assets/blob/master/examples/full/bundle.config.js#L86}
 */
module.exports = {
	bundle: {
		"js/vendors": {
			scripts: [
				// "../../cdn/adaptivecards/1.1.0/js/adaptivecards.fixed.js",
				// "../../cdn/EventEmitter/5.2.5/js/EventEmitter.fixed.js",
				// "../../cdn/glightbox/1.0.8/js/glightbox.fixed.js",
				// "../../cdn/highlight.js/9.12.0/js/highlight.pack.fixed.js",
				// "../../cdn/iframe-lightbox/0.2.8/js/iframe-lightbox.fixed.js",
				// "../../cdn/imagesloaded/4.1.4/js/imagesloaded.pkgd.fixed.js",
				// "../../cdn/img-lightbox/0.2.1/js/img-lightbox.fixed.js",
				// "../../cdn/lazyload/10.19.0/js/lazyload.iife.fixed.js",
				// "../../cdn/lightgallery.js/1.1.1/js/lg-autoplay.fixed.js",
				// "../../cdn/lightgallery.js/1.1.1/js/lg-fullscreen.fixed.js",
				// "../../cdn/lightgallery.js/1.1.1/js/lg-hash.fixed.js",
				// "../../cdn/lightgallery.js/1.1.1/js/lg-share.fixed.js",
				// "../../cdn/lightgallery.js/1.1.1/js/lg-thumbnail.fixed.js",
				// "../../cdn/lightgallery.js/1.1.1/js/lg-zoom.fixed.js",
				// "../../cdn/lightgallery.js/1.1.1/js/lightgallery.fixed.js",
				// "../../cdn/macy.js/2.3.1/js/macy.fixed.js",
				// "../../cdn/minigrid/3.1.1/js/minigrid.fixed.js",
				// "../../cdn/mustache/2.3.0/js/mustache.fixed.js",
				// "../../cdn/qrjs2/0.1.7/js/qrjs2.fixed.js",
				// "../../cdn/ReadMore.js/1.0.0/js/readMoreJS.fixed.js",
				// "../../cdn/resize/1.0.0/js/any-resize-event.fixed.js",
				// "../../cdn/ripple-js/1.4.4/js/ripple.fixed.js",
				// "../../cdn/t.js/0.1.0/js/t.fixed.js",
				// "../../cdn/Tocca.js/2.0.1/js/Tocca.fixed.js",
				// "../../cdn/uwp-web-framework/2.0/js/uwp.core.fixed.js",
				// "../../cdn/verge/1.9.1/js/verge.fixed.js",
				// "../../cdn/wheel-indicator/1.1.4/js/wheel-indicator.fixed.js",
				// "./bower_components/iframe-lightbox/iframe-lightbox.js",
				// "./bower_components/img-lightbox/img-lightbox.js",
				// "./bower_components/mui/packages/cdn/js/mui.js",
				// "./bower_components/qrjs2/qrjs2.js",
				// "./bower_components/Tocca.js/Tocca.js",
				// "./bower_components/verge/verge.js",
				// "./bower_components/wheel-indicator/lib/wheel-indicator.js",
				// "./node_modules/adaptivecards/dist/adaptivecards.js",
				// "./node_modules/any-resize-event/dist/any-resize-event.js",
				// "./node_modules/imagesloaded/imagesloaded.pkgd.js",
				// "./node_modules/jquery/dist/jquery.js",
				// "./node_modules/macy/dist/macy.js",
				// "./node_modules/minigrid/dist/minigrid.min.js",
				// "./node_modules/mustache/mustache.js",
				// "./node_modules/vanilla-lazyload/dist/lazyload.iife.js",
				// "./node_modules/wolfy87-eventemitter/EventEmitter.js",				
				"../../cdn/minigrid/3.1.1/js/minigrid.fixed.js",
				"../../cdn/ReadMore.js/1.0.0/js/readMoreJS.fixed.js",
				"../../cdn/ripple-js/1.4.4/js/ripple.fixed.js",
				"../../cdn/iframe-lightbox/0.2.8/js/iframe-lightbox.fixed.js",
				"../../cdn/img-lightbox/0.2.1/js/img-lightbox.fixed.js",
				"../../cdn/qrjs2/0.1.7/js/qrjs2.fixed.js",
				"../../cdn/Tocca.js/2.0.1/js/Tocca.fixed.js",
				"../../cdn/wheel-indicator/1.1.4/js/wheel-indicator.fixed.js",
				"../../cdn/resize/1.0.0/js/any-resize-event.fixed.js",
				"../../cdn/mustache/2.3.0/js/mustache.fixed.js",
				"../../cdn/EventEmitter/5.2.5/js/EventEmitter.fixed.js"
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
				// "../../cdn/adaptivecards/1.1.0/js/adaptivecards.fixed.js",
				// "../../cdn/EventEmitter/5.2.5/js/EventEmitter.fixed.js",
				// "../../cdn/glightbox/1.0.8/js/glightbox.fixed.js",
				// "../../cdn/highlight.js/9.12.0/js/highlight.pack.fixed.js",
				// "../../cdn/iframe-lightbox/0.2.8/js/iframe-lightbox.fixed.js",
				// "../../cdn/imagesloaded/4.1.4/js/imagesloaded.pkgd.fixed.js",
				// "../../cdn/img-lightbox/0.2.1/js/img-lightbox.fixed.js",
				// "../../cdn/lazyload/10.19.0/js/lazyload.iife.fixed.js",
				// "../../cdn/lightgallery.js/1.1.1/js/lg-autoplay.fixed.js",
				// "../../cdn/lightgallery.js/1.1.1/js/lg-fullscreen.fixed.js",
				// "../../cdn/lightgallery.js/1.1.1/js/lg-hash.fixed.js",
				// "../../cdn/lightgallery.js/1.1.1/js/lg-share.fixed.js",
				// "../../cdn/lightgallery.js/1.1.1/js/lg-thumbnail.fixed.js",
				// "../../cdn/lightgallery.js/1.1.1/js/lg-zoom.fixed.js",
				// "../../cdn/lightgallery.js/1.1.1/js/lightgallery.fixed.js",
				// "../../cdn/macy.js/2.3.1/js/macy.fixed.js",
				// "../../cdn/minigrid/3.1.1/js/minigrid.fixed.js",
				// "../../cdn/mustache/2.3.0/js/mustache.fixed.js",
				// "../../cdn/qrjs2/0.1.7/js/qrjs2.fixed.js",
				// "../../cdn/ReadMore.js/1.0.0/js/readMoreJS.fixed.js",
				// "../../cdn/resize/1.0.0/js/any-resize-event.fixed.js",
				// "../../cdn/ripple-js/1.4.4/js/ripple.fixed.js",
				// "../../cdn/t.js/0.1.0/js/t.fixed.js",
				// "../../cdn/Tocca.js/2.0.1/js/Tocca.fixed.js",
				// "../../cdn/uwp-web-framework/2.0/js/uwp.core.fixed.js",
				// "../../cdn/verge/1.9.1/js/verge.fixed.js",
				// "../../cdn/wheel-indicator/1.1.4/js/wheel-indicator.fixed.js",
				// "./bower_components/iframe-lightbox/iframe-lightbox.js",
				// "./bower_components/img-lightbox/img-lightbox.js",
				// "./bower_components/mui/packages/cdn/js/mui.js",
				// "./bower_components/qrjs2/qrjs2.js",
				// "./bower_components/Tocca.js/Tocca.js",
				// "./bower_components/verge/verge.js",
				// "./bower_components/wheel-indicator/lib/wheel-indicator.js",
				// "./node_modules/adaptivecards/dist/adaptivecards.js",
				// "./node_modules/any-resize-event/dist/any-resize-event.js",
				// "./node_modules/imagesloaded/imagesloaded.pkgd.js",
				// "./node_modules/jquery/dist/jquery.js",
				// "./node_modules/macy/dist/macy.js",
				// "./node_modules/minigrid/dist/minigrid.min.js",
				// "./node_modules/mustache/mustache.js",
				// "./node_modules/vanilla-lazyload/dist/lazyload.iife.js",
				// "./node_modules/wolfy87-eventemitter/EventEmitter.js",				
				"../../cdn/minigrid/3.1.1/js/minigrid.fixed.js",
				"../../cdn/ReadMore.js/1.0.0/js/readMoreJS.fixed.js",
				"../../cdn/ripple-js/1.4.4/js/ripple.fixed.js",
				"../../cdn/iframe-lightbox/0.2.8/js/iframe-lightbox.fixed.js",
				"../../cdn/img-lightbox/0.2.1/js/img-lightbox.fixed.js",
				"../../cdn/qrjs2/0.1.7/js/qrjs2.fixed.js",
				"../../cdn/Tocca.js/2.0.1/js/Tocca.fixed.js",
				"../../cdn/wheel-indicator/1.1.4/js/wheel-indicator.fixed.js",
				"../../cdn/resize/1.0.0/js/any-resize-event.fixed.js",
				"../../cdn/mustache/2.3.0/js/mustache.fixed.js",
				"../../cdn/EventEmitter/5.2.5/js/EventEmitter.fixed.js"
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
				// "../../cdn/adaptivecards/1.1.0/scss/adaptivecards.custom.css",
				// "../../cdn/glightbox/1.0.8/css/glightbox.fixed.css",
				// "../../cdn/highlight.js/9.12.0/css/hljs.css",
				// "../../cdn/iframe-lightbox/0.2.8/css/iframe-lightbox.fixed.css",
				// "../../cdn/img-lightbox/0.2.1/css/img-lightbox.fixed.css",
				// "../../cdn/lightgallery.js/1.1.1/css/lightgallery.fixed.css",
				// "../../cdn/mui/0.9.39/css/mui.css",
				// "../../cdn/typeboost-uwp.css/0.1.8/css/typeboost-uwp.css",
				// "../../cdn/uwp-web-framework/2.0/css/uwp.style.fixed.css",
				// "../../fonts/material-design-icons/3.0.1/css/material-icons.css",
				// "../../fonts/MaterialDesign-Webfont/2.2.43/css/materialdesignicons.css",
				// "../../fonts/roboto-fontfacekit/2.137/css/roboto.css",
				// "../../fonts/roboto-mono-fontfacekit/2.0.986/css/roboto-mono.css",
				// "./bower_components/iframe-lightbox/iframe-lightbox.css",
				// "./bower_components/img-lightbox/img-lightbox.css",
				// "./bower_components/mui/src/sass/mui.css",
				// "./node_modules/normalize.css/normalize.css",
				"../../fonts/roboto-fontfacekit/2.137/css/roboto.css",
				"../../fonts/roboto-mono-fontfacekit/2.0.986/css/roboto-mono.css",
				"../../cdn/iframe-lightbox/0.2.8/css/iframe-lightbox.fixed.css",
				"../../cdn/img-lightbox/0.2.1/css/img-lightbox.fixed.css",
				"../../cdn/mui/0.9.39/css/mui.css"
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
				// "../../cdn/adaptivecards/1.1.0/scss/adaptivecards.custom.css",
				// "../../cdn/glightbox/1.0.8/css/glightbox.fixed.css",
				// "../../cdn/highlight.js/9.12.0/css/hljs.css",
				// "../../cdn/iframe-lightbox/0.2.8/css/iframe-lightbox.fixed.css",
				// "../../cdn/img-lightbox/0.2.1/css/img-lightbox.fixed.css",
				// "../../cdn/lightgallery.js/1.1.1/css/lightgallery.fixed.css",
				// "../../cdn/mui/0.9.39/css/mui.css",
				// "../../cdn/typeboost-uwp.css/0.1.8/css/typeboost-uwp.css",
				// "../../cdn/uwp-web-framework/2.0/css/uwp.style.fixed.css",
				// "../../fonts/material-design-icons/3.0.1/css/material-icons.css",
				// "../../fonts/MaterialDesign-Webfont/2.2.43/css/materialdesignicons.css",
				// "../../fonts/roboto-fontfacekit/2.137/css/roboto.css",
				// "../../fonts/roboto-mono-fontfacekit/2.0.986/css/roboto-mono.css",
				// "./bower_components/iframe-lightbox/iframe-lightbox.css",
				// "./bower_components/img-lightbox/img-lightbox.css",
				// "./bower_components/mui/src/sass/mui.css",
				// "./node_modules/normalize.css/normalize.css",
				"../../fonts/roboto-fontfacekit/2.137/css/roboto.css",
				"../../fonts/roboto-mono-fontfacekit/2.0.986/css/roboto-mono.css",
				"../../cdn/iframe-lightbox/0.2.8/css/iframe-lightbox.fixed.css",
				"../../cdn/img-lightbox/0.2.1/css/img-lightbox.fixed.css",
				"../../cdn/mui/0.9.39/css/mui.css"
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