/*!
 * @see {@link https://github.com/GoogleChrome/sw-toolbox}
 * googlechrome.github.io/sw-toolbox/docs/master/tutorial-usage
 * mobiforge.com/design-development/caching-with-service-workers-the-easy-way
 * googlechrome.github.io/samples/service-worker/registration/index.html
 */
/*!
 * toolbox.precache() will add one or more URLs to a cache when the service worker is installed,
 * but it won't take any steps to make sure that those URLs are kept up to date.
 * So, for instance, if you call toolbox.precache(['index.html']),
 * it will add an entry for index.html to your runtime cache when the service worker is installed,
 * but there is nothing that will automatically update that entry when index.html changes.
 * sw-toolbox also does not set up any routes or handlers to serve that cached response by default.
 * It's up to you, as a developer, to set up a route that will match requests for index.html
 * and use an appropriate handler (and hopefully not use cacheFirst, or else index.html will never be updated).
 * @see {@link https://github.com/GoogleChrome/sw-precache/issues/267}
 */
/*!
 * Example 1 uses a cache first strategy to fetch content from the googleapis.com domain. It will store up to 20 matches in the googleapis cache.
 * Example 2 uses a cache first strategy to fetch all PNG and JPG images (those files that end with "png" or "jpg") from the images-cache cache. If it can't find the items in the cache, it fetches them from the network and adds them to the images-cache cache. When more than 50 items are stored in the cache, the oldest items are removed.
 * Example 3 works with local videos in MP4 and a network only strategy. We don't want large files to bloat the cache so we will only play the videos when we are online.
 * Example 4 matches all files from Youtube and Vimeo and uses the network only strategy. When working with external video sources we not only have to worry about cache size but also about potential copyright issues.
 * Example 5 presents our default route. If the request did not match any prior routes it will match this one and run with a cache first strategy.
 * @see {@link https://developers.google.com/web/ilt/pwa/using-sw-precache-and-sw-toolbox}
 */
(function (global) {
	"use strict";
	/* Load the sw-toolbox library. */
	importScripts("/cdn/sw-toolbox/3.6.1/js/sw-toolbox.fixed.min.js");
	global.toolbox.options.debug = true;
	/* Ensure that our service worker takes control of the page as soon as possible. */
	global.addEventListener("install", event => event.waitUntil(global.skipWaiting()));
	global.addEventListener("activate", event => event.waitUntil(global.clients.claim()));
	/* global.toolbox.precache(["","",""]); */
	global.toolbox.router.default = global.toolbox.fastest;
})(self);
/*!
 * You can remove service workers programmatically like this:
 * @see {@link https://stackoverflow.com/questions/33704791/how-do-i-uninstall-a-service-worker}
 */
/* navigator.serviceWorker.getRegistrations().then(function (registrations) {
	"use strict";
	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError;
	var _iterator;
	var _step;
	try {
		for (_iterator = registrations[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var registration = _step.value;
			registration.unregister();
		}
	} catch (err) {
		_didIteratorError = true;
		_iteratorError = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion && _iterator.return ) {
				_iterator.return ();
			}
		}
		finally {
			if (_didIteratorError) {
				throw _iteratorError;
			}
		}
	}
}); */
