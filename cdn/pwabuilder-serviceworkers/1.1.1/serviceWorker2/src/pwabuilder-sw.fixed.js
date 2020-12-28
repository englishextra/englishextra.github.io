/*global caches, self, Promise, */

/*!
 * https://github.com/meanbee/magento-meanbee-pwa/issues/20#issuecomment-497626347
 * This is a reworked code of the "Offline copy of pages" service worker
 */

var cacheName = "pwabuilder-offline";

var indexPage = "index.html";
var offlinePages = [indexPage];

function updateStaticCache() {
	return caches.open(cacheName).then(function (cache) {
		console.log("[sw.js] Added to offline during install: " + offlinePages);
		return cache.addAll(offlinePages);
	});
}

function clearOldCaches() {
	return caches.keys().then(function (keys) {
		return Promise.all(keys.filter(function (key) {
				return key.indexOf(cacheName) !== 0;
			}).map(function (key) {
				return caches.delete (key);
			}));
	});
}

function isHtmlRequest(request) {
	return request.headers.get("Accept").indexOf("text/html") !== -1;
}

function isCachableResponse(response) {
	return (response && response.ok);
}

self.addEventListener("install", function (event) {
	event.waitUntil(updateStaticCache().then(function () {
			return self.skipWaiting();
		}));
});

self.addEventListener("activate", function (event) {
	event.waitUntil(clearOldCaches().then(function () {
			return self.clients.claim();
		}));
});

self.addEventListener("fetch", function (event) {

	var request = event.request;

	if (request.method !== "GET") {
		if (!navigator.onLine && isHtmlRequest(request)) {
			return event.respondWith(caches.match(indexPage));
		}
		return;
	}

	if (isHtmlRequest(request)) {

		event.respondWith(fetch(request).then(function (response) {
				if (isCachableResponse(response)) {
					var clonedResponse = response.clone();
					caches.open(cacheName).then(function (cache) {
						console.log("[sw.js] Added to offline: " + clonedResponse.url);
						return cache.put(request, clonedResponse);
					});
				}
				return response;
			}).catch (function () {
				return caches.match(request).then(function (response) {
					if (!response && request.mode === "navigate") {
						return caches.match(indexPage);
					}
					return response;
				});
			}));
	} else {

		if (event.request.cache === "only-if-cached" && event.request.mode !== "same-origin") {
			return;
		}

		event.respondWith(caches.match(request).then(function (response) {
				return response || fetch(request, {
					credentials: "include",
					redirect: "follow"
				}).then(function (response) {
					if (isCachableResponse(response)) {
						var clonedResponse = response.clone();
						caches.open(cacheName).then(function (cache) {
							console.log("[sw.js] Added to offline: " + clonedResponse.url);
							return cache.put(request, clonedResponse);
						});
					}
					return response;
				});
			}));
	}
});
