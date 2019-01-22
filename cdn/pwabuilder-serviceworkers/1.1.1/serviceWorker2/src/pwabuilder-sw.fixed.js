/*global caches, self, Promise, */
/*!
 * @see {@link https://github.com/pwa-builder/pwabuilder-serviceworkers/blob/master/serviceWorker2/pwabuilder-sw.js}
 * @see {@link https://github.com/pwa-builder/serviceworkers/pull/28}
 */
//This is the "Offline copy of pages" service worker

var cacheName = "pwabuilder-offline";

//Install stage sets up the index page (home page) in the cache and opens a new cache
self.addEventListener("install", function (event) {
	var indexPage = new Request("index.html");
	event.waitUntil(
		fetch(indexPage).then(function (response) {
			return caches.open(cacheName).then(function (cache) {
				console.log("[sw.js] Cached index page during install: " + response.url);
				return cache.put(indexPage, response);
			});
		}));
});

//If any fetch fails, it will look for the request in the cache and serve it from there first
self.addEventListener("fetch", function (event) {
	var updateCache = function (request) {
		return caches.open(cacheName).then(function (cache) {
			/*!
			 * @see {@link https://github.com/pwa-builder/serviceworkers/issues/16#issuecomment-388215410}
			 * @see {@link https://github.com/icarito/serviceworkers/commit/f17f892ba9f2be057aeffa133f01f243604ddc0c}
			 */
			//return fetch(request).then(function(response) {
			return fetch(request, {
				credentials: "include",
				redirect: "follow"
			}).then(function (response) {
				console.log("[sw.js] Add page to offline: " + response.url);
				return cache.put(request, response);
			});
		});
	};

	event.waitUntil(updateCache(event.request));

	event.respondWith(
		fetch(event.request).catch (function (error) {
			console.log("[sw.js] Network request Failed. Serving content from cache: " + error);

			//Check to see if you have it in the cache
			//Return response
			//If not in the cache, then return error page
			return caches.open(cacheName).then(function (cache) {
				return cache.match(event.request).then(function (matching) {
					var report = !matching || matching.status == 404 ? Promise.reject("no-match") : matching;
					return report;
				});
			});
		})
			);
	});
