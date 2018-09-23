/*global console */
/*!
 * imgLightbox
 * requires this very img-lightbox.js, and animate.css, img-lightbox.css
 * passes jshint
 */
(function (root, document) {
	"use strict";

	var docBody = document.body || "";

	var appendChild = "appendChild";
	var classList = "classList";
	var createDocumentFragment = "createDocumentFragment";
	var createElement = "createElement";
	var createTextNode = "createTextNode";
	var getAttribute = "getAttribute";
	var getElementsByClassName = "getElementsByClassName";
	var getElementsByTagName = "getElementsByTagName";
	var style = "style";
	var _addEventListener = "addEventListener";
	var _length = "length";
	var _removeEventListener = "removeEventListener";

	var isBindedimgLightboxLinkClass = "is-binded-img-lightbox-link";

	var getHTTP = function (force) {
		var any = force || "";
		var locationProtocol = root.location.protocol || "";
		return "http:" === locationProtocol ? "http" : "https:" === locationProtocol ? "https" : any ? "http" : "";
	};

	var forcedHTTP = getHTTP(true);

	var debounce = function (func, wait) {
		var timeout;
		var args;
		var context;
		var timestamp;
		return function () {
			context = this;
			args = [].slice.call(arguments, 0);
			timestamp = new Date();
			var later = function () {
				var last = (new Date()) - timestamp;
				if (last < wait) {
					timeout = setTimeout(later, wait - last);
				} else {
					timeout = null;
					func.apply(context, args);
				}
			};
			if (!timeout) {
				timeout = setTimeout(later, wait);
			}
		};
	};

	var imagePromise = function (s) {
		if (root.Promise) {
			return new Promise(function (y, n) {
				var f = function (e, p) {
					e.onload = function () {
						y(p);
					};
					e.onerror = function () {
						n(p);
					};
					e.src = p;
				};
				if ("string" === typeof s) {
					var a = new Image();
					f(a, s);
				} else {
					if ("img" !== s.tagName) {
						return Promise.reject();
					} else {
						if (s.src) {
							f(s, s.src);
						}
					}
				}
			});
		} else {
			throw new Error("Promise is not in global object");
		}
	};

	var appendFragment = function (e, a) {
		var parent = a || document[getElementsByTagName]("body")[0] || "";
		if (e) {
			var df = document[createDocumentFragment]() || "";
			if ("string" === typeof e) {
				e = document[createTextNode](e);
			}
			df[appendChild](e);
			parent[appendChild](df);
		}
	};

	/*jshint bitwise: false */
	var parseLink = function (url, full) {
		var _full = full || "";
		return (function () {
			var _replace = function (s) {
				return s.replace(/^(#|\?)/, "").replace(/\:$/, "");
			};
			var _location = location || "";
			var _protocol = function (protocol) {
				switch (protocol) {
				case "http:":
					return _full ? ":" + 80 : 80;
				case "https:":
					return _full ? ":" + 443 : 443;
				default:
					return _full ? ":" + _location.port : _location.port;
				}
			};
			var _isAbsolute = (0 === url.indexOf("//") || !!~url.indexOf("://"));
			var _locationHref = root.location || "";
			var _origin = function () {
				var o = _locationHref.protocol + "//" + _locationHref.hostname + (_locationHref.port ? ":" + _locationHref.port : "");
				return o || "";
			};
			var _isCrossDomain = function () {
				var c = document[createElement]("a");
				c.href = url;
				var v = c.protocol + "//" + c.hostname + (c.port ? ":" + c.port : "");
				return v !== _origin();
			};
			var _link = document[createElement]("a");
			_link.href = url;
			return {
				href: _link.href,
				origin: _origin(),
				host: _link.host || _location.host,
				port: ("0" === _link.port || "" === _link.port) ? _protocol(_link.protocol) : (_full ? _link.port : _replace(_link.port)),
				hash: _full ? _link.hash : _replace(_link.hash),
				hostname: _link.hostname || _location.hostname,
				pathname: _link.pathname.charAt(0) !== "/" ? (_full ? "/" + _link.pathname : _link.pathname) : (_full ? _link.pathname : _link.pathname.slice(1)),
				protocol: !_link.protocol || ":" === _link.protocol ? (_full ? _location.protocol : _replace(_location.protocol)) : (_full ? _link.protocol : _replace(_link.protocol)),
				search: _full ? _link.search : _replace(_link.search),
				query: _full ? _link.search : _replace(_link.search),
				isAbsolute: _isAbsolute,
				isRelative: !_isAbsolute,
				isCrossDomain: _isCrossDomain(),
				hasHTTP: (/^(http|https):\/\//i).test(url) ? true : false
			};
		})();
	};
	/*jshint bitwise: true */

	var handleimgLightboxContainer;
	var handleimgLightboxWindow;

	var handleimgLightboxContainerWithBind;
	var handleimgLightboxWindowWithBind;

	var hideimgLightbox = function () {
		var container = document[getElementsByClassName]("img-lightbox-container")[0] || "";
		var img = container ? container[getElementsByTagName]("img")[0] || "" : "";
		var animatedClass = "animated";
		var fadeInClass = "fadeIn";
		var fadeInUpClass = "fadeInUp";
		var fadeOutClass = "fadeOut";
		var fadeOutDownClass = "fadeOutDown";
		var dummySrc = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
		var hideContainer = function () {
			container[classList].remove(fadeInClass);
			container[classList].add(fadeOutClass);
			var hideImg = function () {
				container[classList].remove(animatedClass);
				container[classList].remove(fadeOutClass);
				img[classList].remove(animatedClass);
				img[classList].remove(fadeOutDownClass);
				img.src = dummySrc;
				container[style].display = "none";
			};
			var timer = setTimeout(function () {
					clearTimeout(timer);
					timer = null;
					hideImg();
				}, 400);
		};
		if (container && img) {
			container[_removeEventListener]("click", handleimgLightboxContainer);
			container[_removeEventListener]("click", handleimgLightboxContainerWithBind);
			root[_removeEventListener]("keyup", handleimgLightboxWindow);
			root[_removeEventListener]("keyup", handleimgLightboxWindowWithBind);
			img[classList].remove(fadeInUpClass);
			img[classList].add(fadeOutDownClass);
			var timer = setTimeout(function () {
					clearTimeout(timer);
					timer = null;
					hideContainer();
				}, 400);
		}
	};

	var callCallback = function (func, data) {
		if (typeof func !== "function") {
			return;
		}
		var caller = func.bind(this);
		caller(data);
	};

	handleimgLightboxContainer = function (callback) {
		var container = document[getElementsByClassName]("img-lightbox-container")[0] || "";
		if (container) {
			hideimgLightbox();
			callCallback(callback, root);
		}
	};

	handleimgLightboxWindow = function (callback, ev) {
		if (27 === (ev.which || ev.keyCode)) {
			hideimgLightbox();
			callCallback(callback, root);
		}
	};

	var imgLightbox = function (scope, settings) {

		var ctx = scope && scope.nodeName ? scope : "";

		var options = settings || {};

		var linkClass = "img-lightbox-link";
		var link = ctx ? ctx[getElementsByClassName](linkClass) || "" : document[getElementsByClassName](linkClass) || "";
		var containerClass = "img-lightbox-container";
		var container = document[getElementsByClassName](containerClass)[0] || "";
		var img = container ? container[getElementsByTagName]("img")[0] || "" : "";
		var animatedClass = "animated";
		var fadeInClass = "fadeIn";
		var fadeInUpClass = "fadeInUp";
		var dummySrc = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
		if (!container) {
			container = document[createElement]("div");
			img = document[createElement]("img");
			img.src = dummySrc;
			img.alt = "";
			container[appendChild](img);
			container[classList].add(containerClass);
			appendFragment(container, docBody);
		}
		var arrange = function (e) {
			var handleimgLightboxLink = function (ev) {
				ev.stopPropagation();
				ev.preventDefault();
				var _this = this;
				var logicHandleimgLightboxLink = function () {
					var hrefString = _this[getAttribute]("href") || "";
					if (container && img && hrefString) {
						/* LoadingSpinner.show(); */
						if (options.onCreated) {
							callCallback(options.onCreated, root);
						}
						container[classList].add(animatedClass);
						container[classList].add(fadeInClass);
						img[classList].add(animatedClass);
						img[classList].add(fadeInUpClass);
						if (parseLink(hrefString).isAbsolute && !parseLink(hrefString).hasHTTP) {
							hrefString = hrefString.replace(/^/, forcedHTTP + ":");
						}
						imagePromise(hrefString).then(function () {
							img.src = hrefString;
							if (options.onLoaded) {
								callCallback(options.onLoaded, root);
							}
						}).catch (function (err) {
							console.log("cannot load image with imagePromise:", hrefString, err);
							if (options.onError) {
								callCallback(options.onError, root);
							}
						});

						if (options.onClosed) {

							handleimgLightboxContainerWithBind = handleimgLightboxContainer.bind(null, options.onClosed);
							handleimgLightboxWindowWithBind = handleimgLightboxWindow.bind(null, options.onClosed);

							container[_addEventListener]("click", handleimgLightboxContainerWithBind);
							root[_addEventListener]("keyup", handleimgLightboxWindowWithBind);
						} else {
							container[_addEventListener]("click", handleimgLightboxContainer);
							root[_addEventListener]("keyup", handleimgLightboxWindow);
						}
						container[style].display = "block";
						/* LoadingSpinner.hide(); */
					}
				};
				var debounceLogicHandleimgLightboxLink = debounce(logicHandleimgLightboxLink, 200);
				debounceLogicHandleimgLightboxLink();
			};
			if (!e[classList].contains(isBindedimgLightboxLinkClass)) {
				var hrefString = e[getAttribute]("href") || "";
				if (hrefString) {
					if (parseLink(hrefString).isAbsolute && !parseLink(hrefString).hasHTTP) {
						e.setAttribute("href", hrefString.replace(/^/, forcedHTTP + ":"));
					}
					e[_addEventListener]("click", handleimgLightboxLink);
					e[classList].add(isBindedimgLightboxLinkClass);
				}
			}
		};
		if (link) {
			for (var j = 0, l = link[_length]; j < l; j += 1) {
				arrange(link[j]);
			}
			/* forEach(link, arrange, false); */
		}
	};

	root.imgLightbox = imgLightbox;
})("undefined" !== typeof window ? window : this, document);
