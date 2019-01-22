//This is the "Offline copy of pages" service worker
//Add this below content to your HTML page, or add the js file to your page at the very top to register service worker
(function(root, document) {
	"use strict";

	if (
		self.location.protocol !== "https:" &&
		self.location.protocol !== "http:"
	) {
		return;
	}

	var swJs =
		document.currentScript && document.currentScript.dataset.serviceWorker;

	if (swJs) {
		if (navigator.serviceWorker.controller) {
			console.log(
				"[sw-register.js] Active service worker found, no need to register."
			);
		} else {
			//Register the ServiceWorker
			navigator.serviceWorker
				.register(swJs, {
					scope: "./"
				})
				.then(function(reg) {
					console.log(
						"[sw-register.js] Service worker has been registered for scope: " +
							reg.scope
					);
				});
		}
	}
})("undefined" !== typeof window ? window : this, document);
