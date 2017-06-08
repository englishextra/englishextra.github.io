/*!
 * @see {@link https://github.com/GoogleChrome/sw-precache/issues/97}
 * @see {@link https://github.com/GoogleChrome/sw-precache#runtime-caching}
 * @see {@link https://developers.google.com/web/ilt/pwa/using-sw-precache-and-sw-toolbox}
 * @see {@link https://github.com/deanhume/Service-Worker-Toolbox/blob/master/sw.js}
 * @see {@link https://github.com/GoogleChrome/ioweb2016/blob/master/gulp_scripts/service-worker.js}
 */
module.exports = {
	cacheId: "englishextra",
	navigateFallback: "./",
	/* dynamicUrlToDependencies: {
		"./": "index.html"
	}, */
	staticFileGlobs: [
		"index.html",
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
			urlPattern: /^\/([^/]+\.html)$/,
			handler: "networkFirst"/* ,
			options: {
				debug: true
			} */
		}, {
			urlPattern: /^\/([^/]+\.js)$/,
			handler: "networkOnly"/* ,
			options: {
				debug: true
			} */
		}, {
			urlPattern: /^\/([^/]+\.json)$/,
			handler: "networkOnly"/* ,
			options: {
				debug: true
			} */
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
	};
