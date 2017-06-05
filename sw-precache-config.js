/*!
 * @see {@link https://github.com/GoogleChrome/sw-precache/issues/97}
 * @see {@link https://github.com/GoogleChrome/sw-precache#runtime-caching}
 * @see {@link https://developers.google.com/web/ilt/pwa/using-sw-precache-and-sw-toolbox}
 */
module.exports = {
	staticFileGlobs: ["index.html",
		"manifest.json",
		"yandex-tableau.json",
		"**.{png,ico,svg}",
		"cdn/**/*.{png,jpg,js,json,css}",
		"fonts/**/*.{eot,ttf,woff,woff2}",
		"libs/**/img/**/*.{png,jpg}",
		"pages/**/*.html"],
	stripPrefix: "./",
	runtimeCaching: [{
			urlPattern: /^https:\/\/mc\.yandex\.ru/,
			handler: "networkOnly",
			options: {
				debug: true
			}
		}, {
			urlPattern: /^https:\/\/www\.google-analytics\.com/,
			handler: "networkOnly",
			options: {
				debug: true
			}
		}, {
			urlPattern: /^https:\/\/ssl\.google-analytics\.com/,
			handler: "networkOnly",
			options: {
				debug: true
			}
		}, {
			urlPattern: /^https:\/\/(.*?)\.disqus\.com/,
			handler: "networkOnly",
			options: {
				debug: true
			}
		}, {
			urlPattern: /^https:\/\/w\.soundcloud\.com/,
			handler: "networkOnly",
			options: {
				debug: true
			}
		}, {
			urlPattern: /^https:\/\/player\.vimeo\.com/,
			handler: "networkOnly",
			options: {
				debug: true
			}
		}, {
			urlPattern: /^https:\/\/www\.youtube\.com/,
			handler: "networkOnly",
			options: {
				debug: true
			}
		}, {
			urlPattern: /\/libs\/(.*?)\/css\//,
			handler: "fastest",
			options: {
				debug: true
			}
		}, {
			urlPattern: /\/libs\/(.*?)\/js\//,
			handler: "fastest",
			options: {
				debug: true
			}
		}, {
			urlPattern: /\/libs\/(.*?)\/json\//,
			handler: "fastest",
			options: {
				debug: true
			}
		}
	]
};
