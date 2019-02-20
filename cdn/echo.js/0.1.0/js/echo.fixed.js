/*!
 * modified Echo.js, simple JavaScript image lazy loading
 * added option to specify data attribute and img class
 * @see {@link https://toddmotto.com/echo-js-simple-javascript-image-lazy-loading/}
 * @see {@link https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md#feature-detection}
 * forced passive event listener if supported
 * passes jshint
 */
(function (root, document) {
	"use strict";
	var echo = function (imgClass, dataAttributeName, throttleRate) {
		var _imgClass = imgClass || "data-src-img";
		var _dataAttributeName = dataAttributeName || "src";
		var _throttleRate = throttleRate || 100;
			var documentElement = "documentElement";
		var getBoundingClientRect = "getBoundingClientRect";
				var Echo = function (elem) {
			var _this = this;
			_this.elem = elem;
			_this.render();
			_this.listen();
		};
		var echoIsBindedClass = "echo--is-binded";
		var isBindedEcho = (function () {
			return document[documentElement].classList.contains(echoIsBindedClass) || "";
		})();
		var echoStore = [];
		var scrolledIntoView = function (element) {
			var coords = element[getBoundingClientRect]();
			return ((coords.top >= 0 && coords.left >= 0 && coords.top) <= (root.innerHeight || document[documentElement].clientHeight));
		};
		var echoSrc = function (img, callback) {
			img.src = img.dataset[_dataAttributeName] || img.getAttribute("data-" + _dataAttributeName);
			if (callback && "function" === typeof callback) {
				callback();
			}
		};
		var removeEcho = function (element, index) {
			if (echoStore.indexOf(element) !== -1) {
				echoStore.splice(index, 1);
			}
		};
		var echoImageAll = function () {
			var i;
			for (i = 0; i < echoStore.length; i++) {
				var self = echoStore[i];
				if (scrolledIntoView(self)) {
					echoSrc(self, removeEcho(self, i));
				}
			}
			i = null;
		};
		var throttle = function (func, wait) {
			var ctx;
			var args;
			var rtn;
			var timeoutID;
			var last = 0;
			function call() {
				timeoutID = 0;
				last = +new Date();
				rtn = func.apply(ctx, args);
				ctx = null;
				args = null;
			}
			return function throttled() {
				ctx = this;
				args = arguments;
				var delta = new Date() - last;
				if (!timeoutID) {
					if (delta >= wait) {
						call();
					} else {
						timeoutID = setTimeout(call, wait - delta);
					}
				}
				return rtn;
			};
		};
		var throttleEchoImageAll = throttle(echoImageAll, _throttleRate);
		var supportsPassive = (function () {
				var support = false;
				try {
					var opts = Object.defineProperty && Object.defineProperty({}, "passive", {
							get: function () {
								support = true;
							}
						});
					root.addEventListener("test", function() {}, opts);
				} catch (err) {}
				return support;
			})();
		Echo.prototype = {
			init: function () {
				echoStore.push(this.elem);
			},
			render: function () {
				echoImageAll();
			},
			listen: function () {
				if (!isBindedEcho) {
					root.addEventListener("scroll", throttleEchoImageAll, supportsPassive ? {passive: true} : false);
					root.addEventListener("resize", throttleEchoImageAll);
					document[documentElement].classList.add(echoIsBindedClass);
				}
			}
		};
		var lazyImgs = document.getElementsByClassName(_imgClass) || "";
		var walkLazyImageAll = function () {
			for (var i = 0; i < lazyImgs.length; i++) {
				new Echo(lazyImgs[i]).init();
			}
		};
		if (lazyImgs) {
			walkLazyImageAll();
		}
	};
	root.echo = echo;
})("undefined" !== typeof window ? window : this, document);
