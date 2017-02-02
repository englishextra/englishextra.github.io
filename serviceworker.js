/*!
 * github.com/GoogleChrome/sw-toolbox
 * googlechrome.github.io/sw-toolbox/docs/master/tutorial-usage
 * mobiforge.com/design-development/caching-with-service-workers-the-easy-way
 * googlechrome.github.io/samples/service-worker/registration/index.html
 */
importScripts("/cdn/sw-toolbox/3.4.0/js/sw-toolbox.fixed.min.js");
toolbox.router.default = toolbox.cacheFirst;
toolbox.precache([
		"/index.html",
		"/libs/index/css/bundle.css",
		"/libs/index/js/bundle.js",
		"/libs/index/css/bundle.min.css",
		"/libs/index/js/bundle.min.js",
		"/libs/index/img/header.jpg",
		"/libs/index/img/sitelogo-rounded-BB3F3F-72x72.svg",
		"/libs/index/img/sitelogo-rounded-BB3F3F-72x72.png",
		"/libs/index/img/sitelogo-rounded-BB3F3F-200x200.svg",
		"/libs/index/img/sitelogo-rounded-BB3F3F-200x200.png",
		"/fonts/englishextra-ui-icons-fontfacekit/englishextra-ui-icons.woff",
		"/fonts/englishextra-ui-icons-fontfacekit/englishextra-ui-icons.woff2",
		"/fonts/englishextra-ui-icons-fontfacekit/englishextra-ui-icons.ttf",
		"/fonts/source-sans-pro-fontfacekit/SourceSansPro-Light.otf.woff",
		"/fonts/source-sans-pro-fontfacekit/SourceSansPro-Light.otf.woff2",
		"/fonts/source-sans-pro-fontfacekit/SourceSansPro-Light.ttf",
		"/fonts/source-sans-pro-fontfacekit/SourceSansPro-Regular.otf.woff",
		"/fonts/source-sans-pro-fontfacekit/SourceSansPro-Regular.otf.woff2",
		"/fonts/source-sans-pro-fontfacekit/SourceSansPro-Regular.ttf"
	]);
