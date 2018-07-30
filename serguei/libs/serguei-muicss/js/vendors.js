/*!
 * modified Simple lightbox effect in pure JS
 * @see {@link https://github.com/squeral/lightbox}
 * @see {@link https://github.com/squeral/lightbox/blob/master/lightbox.js}
 * @params {Object} elem Node element
 * @params {Object} [rate] debounce rate, default 500ms
 * new IframeLightbox(elem)
 * passes jshint
 */
(function (root, document) {
	"use strict";
	var addEventListener = "addEventListener";
	var getElementById = "getElementById";
	var getElementsByClassName = "getElementsByClassName";
	var createElement = "createElement";
	var classList = "classList";
	var appendChild = "appendChild";
	var dataset = "dataset";
	var containerClass = "iframe-lightbox";
	var isLoadedClass = "is-loaded";
	var isOpenedClass = "is-opened";
	var isShowingClass = "is-showing";
	var IframeLightbox = function (elem, settings) {
		var options = settings || {};
		this.trigger = elem;
		this.rate = options.rate || 500;
		this.el = document[getElementsByClassName](containerClass)[0] || "";
		this.body = this.el ? this.el[getElementsByClassName]("body")[0] : "";
		this.content = this.el ? this.el[getElementsByClassName]("content")[0] : "";
		this.href = elem[dataset].src || "";
		this.paddingBottom = elem[dataset].paddingBottom || "";
		//Event handlers
		this.onOpened = options.onOpened;
		this.onIframeLoaded = options.onIframeLoaded;
		this.onLoaded = options.onLoaded;
		this.onCreated = options.onCreated;
		this.onClosed = options.onClosed;
		this.init();
	};
	IframeLightbox.prototype.init = function () {
		var _this = this;
		if (!this.el) {
			this.create();
		}
		var debounce = function (func, wait) {
			var timeout,
			args,
			context,
			timestamp;
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
		var handleOpenIframeLightbox = function (e) {
			e.preventDefault();
			_this.open();
		};
		var debounceHandleOpenIframeLightbox = debounce(handleOpenIframeLightbox, this.rate);
		this.trigger[addEventListener]("click", debounceHandleOpenIframeLightbox);
	};
	IframeLightbox.prototype.create = function () {
		var _this = this,
		bd = document[createElement]("div");
		this.el = document[createElement]("div");
		this.content = document[createElement]("div");
		this.body = document[createElement]("div");
		this.el[classList].add(containerClass);
		bd[classList].add("backdrop");
		this.content[classList].add("content");
		this.body[classList].add("body");
		this.el[appendChild](bd);
		this.content[appendChild](this.body);
		this.contentHolder = document[createElement]("div");
		this.contentHolder[classList].add("content-holder");
		this.contentHolder[appendChild](this.content);
		this.el[appendChild](this.contentHolder);
		document.body[appendChild](this.el);
		bd[addEventListener]("click", function () {
			_this.close();
		});
		var clearBody = function () {
			if (_this.isOpen()) {
				return;
			}
			_this.el[classList].remove(isShowingClass);
			_this.body.innerHTML = "";
		};
		this.el[addEventListener]("transitionend", clearBody, false);
		this.el[addEventListener]("webkitTransitionEnd", clearBody, false);
		this.el[addEventListener]("mozTransitionEnd", clearBody, false);
		this.el[addEventListener]("msTransitionEnd", clearBody, false);
		this.callCallback(this.onCreated, this);
	};
	IframeLightbox.prototype.loadIframe = function () {
		var _this = this;
		this.iframeId = containerClass + Date.now();
		this.body.innerHTML = '<iframe src="' + this.href + '" name="' + this.iframeId + '" id="' + this.iframeId + '" onload="this.style.opacity=1;" style="opacity:0;border:none;" scrolling="no" webkitallowfullscreen="true" mozallowfullscreen="true" allowfullscreen="true" height="166" frameborder="no"></iframe>';
		(function (iframeId, body) {
			document[getElementById](iframeId).onload = function () {
				this.style.opacity = 1;
				body[classList].add(isLoadedClass);
				_this.callCallback(_this.onIframeLoaded, _this);
				_this.callCallback(_this.onLoaded, _this);
			};
		})(this.iframeId, this.body);
	};
	IframeLightbox.prototype.open = function () {
		this.loadIframe();
		if (this.paddingBottom) {
			this.content.style.paddingBottom = this.paddingBottom;
		} else {
			this.content.removeAttribute("style");
		}
		this.el[classList].add(isShowingClass);
		this.el[classList].add(isOpenedClass);
		this.callCallback(this.onOpened, this);
	};
	IframeLightbox.prototype.close = function () {
		this.el[classList].remove(isOpenedClass);
		this.body[classList].remove(isLoadedClass);
		this.callCallback(this.onClosed, this);
	};
	IframeLightbox.prototype.isOpen = function () {
		return this.el[classList].contains(isOpenedClass);
	};
	IframeLightbox.prototype.callCallback = function(func, data) {
		if (typeof func !== "function") {
			return;
		}
		var caller = func.bind(this);
		caller(data);
	};
	root.IframeLightbox = IframeLightbox;
})("undefined" !== typeof window ? window : this, document);

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

/*!
 * modified qr.js -- QR code generator in Javascript (revision 2011-01-19)
 * Written by Kang Seonghoon <public+qrjs@mearie.org>.
 * v0.0.20110119
 * This source code is in the public domain; if your jurisdiction does not
 * recognize the public domain the terms of Creative Commons CC0 license
 * apply. In the other words, you can always do what you want.
 * added options properties: fillcolor and textcolor
 * svg now works in Edge 13 and IE 11
 * @see {@link https://gist.github.com/englishextra/b46969e3382ef737c611bb59d837220b}
 * @see {@link https://github.com/lifthrasiir/qr.js/blob/v0.0.20110119/qr.js}
 * passes jshint with suppressing comments
 */
/*jshint bitwise: false */
/*jshint shadow: true */
/*jshint sub:true */
/*jshint -W041 */
(function (root, name, definition) {
	root[name] = definition();
}("undefined" !== typeof window ? window : this, "QRCode", function () {
	var VERSIONS = [null, [[10, 7, 17, 13], [1, 1, 1, 1], []], [[16, 10, 28, 22], [1, 1, 1, 1], [4, 16]], [[26, 15, 22, 18], [1, 1, 2, 2], [4, 20]], [[18, 20, 16, 26], [2, 1, 4, 2], [4, 24]], [[24, 26, 22, 18], [2, 1, 4, 4], [4, 28]], [[16, 18, 28, 24], [4, 2, 4, 4], [4, 32]], [[18, 20, 26, 18], [4, 2, 5, 6], [4, 20, 36]], [[22, 24, 26, 22], [4, 2, 6, 6], [4, 22, 40]], [[22, 30, 24, 20], [5, 2, 8, 8], [4, 24, 44]], [[26, 18, 28, 24], [5, 4, 8, 8], [4, 26, 48]], [[30, 20, 24, 28], [5, 4, 11, 8], [4, 28, 52]], [[22, 24, 28, 26], [8, 4, 11, 10], [4, 30, 56]], [[22, 26, 22, 24], [9, 4, 16, 12], [4, 32, 60]], [[24, 30, 24, 20], [9, 4, 16, 16], [4, 24, 44, 64]], [[24, 22, 24, 30], [10, 6, 18, 12], [4, 24, 46, 68]], [[28, 24, 30, 24], [10, 6, 16, 17], [4, 24, 48, 72]], [[28, 28, 28, 28], [11, 6, 19, 16], [4, 28, 52, 76]], [[26, 30, 28, 28], [13, 6, 21, 18], [4, 28, 54, 80]], [[26, 28, 26, 26], [14, 7, 25, 21], [4, 28, 56, 84]], [[26, 28, 28, 30], [16, 8, 25, 20], [4, 32, 60, 88]], [[26, 28, 30, 28], [17, 8, 25, 23], [4, 26, 48, 70, 92]], [[28, 28, 24, 30], [17, 9, 34, 23], [4, 24, 48, 72, 96]], [[28, 30, 30, 30], [18, 9, 30, 25], [4, 28, 52, 76, 100]], [[28, 30, 30, 30], [20, 10, 32, 27], [4, 26, 52, 78, 104]], [[28, 26, 30, 30], [21, 12, 35, 29], [4, 30, 56, 82, 108]], [[28, 28, 30, 28], [23, 12, 37, 34], [4, 28, 56, 84, 112]], [[28, 30, 30, 30], [25, 12, 40, 34], [4, 32, 60, 88, 116]], [[28, 30, 30, 30], [26, 13, 42, 35], [4, 24, 48, 72, 96, 120]], [[28, 30, 30, 30], [28, 14, 45, 38], [4, 28, 52, 76, 100, 124]], [[28, 30, 30, 30], [29, 15, 48, 40], [4, 24, 50, 76, 102, 128]], [[28, 30, 30, 30], [31, 16, 51, 43], [4, 28, 54, 80, 106, 132]], [[28, 30, 30, 30], [33, 17, 54, 45], [4, 32, 58, 84, 110, 136]], [[28, 30, 30, 30], [35, 18, 57, 48], [4, 28, 56, 84, 112, 140]], [[28, 30, 30, 30], [37, 19, 60, 51], [4, 32, 60, 88, 116, 144]], [[28, 30, 30, 30], [38, 19, 63, 53], [4, 28, 52, 76, 100, 124, 148]], [[28, 30, 30, 30], [40, 20, 66, 56], [4, 22, 48, 74, 100, 126, 152]], [[28, 30, 30, 30], [43, 21, 70, 59], [4, 26, 52, 78, 104, 130, 156]], [[28, 30, 30, 30], [45, 22, 74, 62], [4, 30, 56, 82, 108, 134, 160]], [[28, 30, 30, 30], [47, 24, 77, 65], [4, 24, 52, 80, 108, 136, 164]], [[28, 30, 30, 30], [49, 25, 81, 68], [4, 28, 56, 84, 112, 140, 168]]];
	var MODE_TERMINATOR = 0;
	var MODE_NUMERIC = 1,
	MODE_ALPHANUMERIC = 2,
	MODE_OCTET = 4,
	MODE_KANJI = 8;
	var NUMERIC_REGEXP = /^\d*$/;
	var ALPHANUMERIC_REGEXP = /^[A-Za-z0-9 $%*+\-./:]*$/;
	var ALPHANUMERIC_OUT_REGEXP = /^[A-Z0-9 $%*+\-./:]*$/;
	var ECCLEVEL_L = 1,
	ECCLEVEL_M = 0,
	ECCLEVEL_Q = 3,
	ECCLEVEL_H = 2;
	var GF256_MAP = [],
	GF256_INVMAP = [-1];
	for (var i = 0, v = 1; i < 255; ++i) {
		GF256_MAP.push(v);
		GF256_INVMAP[v] = i;
		v = (v * 2) ^ (v >= 128 ? 0x11d : 0);
	}
	var GF256_GENPOLY = [[]];
	for (var i = 0; i < 30; ++i) {
		var prevpoly = GF256_GENPOLY[i],
		poly = [];
		for (var j = 0; j <= i; ++j) {
			var a = (j < i ? GF256_MAP[prevpoly[j]] : 0);
			var b = GF256_MAP[(i + (prevpoly[j - 1] || 0)) % 255];
			poly.push(GF256_INVMAP[a ^ b]);
		}
		GF256_GENPOLY.push(poly);
	}
	var ALPHANUMERIC_MAP = {};
	for (var i = 0; i < 45; ++i) {
		ALPHANUMERIC_MAP["0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:".charAt(i)] = i;
	}
	var MASKFUNCS = [function (i, j) {
			return (i + j) % 2 === 0;
		}, function (i, j) {
			return i % 2 === 0;
		}, function (i, j) {
			return j % 3 === 0;
		}, function (i, j) {
			return (i + j) % 3 === 0;
		}, function (i, j) {
			return (((i / 2) | 0) + ((j / 3) | 0)) % 2 === 0;
		}, function (i, j) {
			return (i * j) % 2 + (i * j) % 3 === 0;
		}, function (i, j) {
			return ((i * j) % 2 + (i * j) % 3) % 2 === 0;
		}, function (i, j) {
			return ((i + j) % 2 + (i * j) % 3) % 2 === 0;
		}
	];
	var needsverinfo = function (ver) {
		return ver > 6;
	};
	var getsizebyver = function (ver) {
		return 4 * ver + 17;
	};
	var nfullbits = function (ver) {
		var v = VERSIONS[ver];
		var nbits = 16 * ver * ver + 128 * ver + 64;
		if (needsverinfo(ver)) {
			nbits -= 36;
		}
		if (v[2].length) {
			nbits -= 25 * v[2].length * v[2].length - 10 * v[2].length - 55;
		}
		return nbits;
	};
	var ndatabits = function (ver, ecclevel) {
		var nbits = nfullbits(ver) & ~7;
		var v = VERSIONS[ver];
		nbits -= 8 * v[0][ecclevel] * v[1][ecclevel];
		return nbits;
	};
	var ndatalenbits = function (ver, mode) {
		switch (mode) {
		case MODE_NUMERIC:
			return (ver < 10 ? 10 : ver < 27 ? 12 : 14);
		case MODE_ALPHANUMERIC:
			return (ver < 10 ? 9 : ver < 27 ? 11 : 13);
		case MODE_OCTET:
			return (ver < 10 ? 8 : 16);
		case MODE_KANJI:
			return (ver < 10 ? 8 : ver < 27 ? 10 : 12);
		}
	};
	var getmaxdatalen = function (ver, mode, ecclevel) {
		var nbits = ndatabits(ver, ecclevel) - 4 - ndatalenbits(ver, mode);
		switch (mode) {
		case MODE_NUMERIC:
			return ((nbits / 10) | 0) * 3 + (nbits % 10 < 4 ? 0 : nbits % 10 < 7 ? 1 : 2);
		case MODE_ALPHANUMERIC:
			return ((nbits / 11) | 0) * 2 + (nbits % 11 < 6 ? 0 : 1);
		case MODE_OCTET:
			return (nbits / 8) | 0;
		case MODE_KANJI:
			return (nbits / 13) | 0;
		}
	};
	var validatedata = function (mode, data) {
		switch (mode) {
		case MODE_NUMERIC:
			if (!data.match(NUMERIC_REGEXP)) {
				return null;
			}
			return data;
		case MODE_ALPHANUMERIC:
			if (!data.match(ALPHANUMERIC_REGEXP)) {
				return null;
			}
			return data.toUpperCase();
		case MODE_OCTET:
			if (typeof data === "string") {
				var newdata = [];
				for (var i = 0; i < data.length; ++i) {
					var ch = data.charCodeAt(i);
					if (ch < 0x80) {
						newdata.push(ch);
					} else if (ch < 0x800) {
						newdata.push(0xc0 | (ch >> 6), 0x80 | (ch & 0x3f));
					} else if (ch < 0x10000) {
						newdata.push(0xe0 | (ch >> 12), 0x80 | ((ch >> 6) & 0x3f), 0x80 | (ch & 0x3f));
					} else {
						newdata.push(0xf0 | (ch >> 18), 0x80 | ((ch >> 12) & 0x3f), 0x80 | ((ch >> 6) & 0x3f), 0x80 | (ch & 0x3f));
					}
				}
				return newdata;
			} else {
				return data;
			}
		}
	};
	var encode = function (ver, mode, data, maxbuflen) {
		var buf = [];
		var bits = 0,
		remaining = 8;
		var datalen = data.length;
		var pack = function (x, n) {
			if (n >= remaining) {
				buf.push(bits | (x >> (n -= remaining)));
				while (n >= 8) {
					buf.push((x >> (n -= 8)) & 255);
				}
				bits = 0;
				remaining = 8;
			}
			if (n > 0) {
				bits |= (x & ((1 << n) - 1)) << (remaining -= n);
			}
		};
		var nlenbits = ndatalenbits(ver, mode);
		pack(mode, 4);
		pack(datalen, nlenbits);
		switch (mode) {
		case MODE_NUMERIC:
			for (var i = 2; i < datalen; i += 3) {
				pack(parseInt(data.substring(i - 2, i + 1), 10), 10);
			}
			pack(parseInt(data.substring(i - 2), 10), [0, 4, 7][datalen % 3]);
			break;
		case MODE_ALPHANUMERIC:
			for (var i = 1; i < datalen; i += 2) {
				pack(ALPHANUMERIC_MAP[data.charAt(i - 1)] * 45 +
					ALPHANUMERIC_MAP[data.charAt(i)], 11);
			}
			if (datalen % 2 === 1) {
				pack(ALPHANUMERIC_MAP[data.charAt(i - 1)], 6);
			}
			break;
		case MODE_OCTET:
			for (var i = 0; i < datalen; ++i) {
				pack(data[i], 8);
			}
			break;
		}
		pack(MODE_TERMINATOR, 4);
		if (remaining < 8) {
			buf.push(bits);
		}
		while (buf.length + 1 < maxbuflen) {
			buf.push(0xec, 0x11);
		}
		if (buf.length < maxbuflen) {
			buf.push(0xec);
		}
		return buf;
	};
	var calculateecc = function (poly, genpoly) {
		var modulus = poly.slice(0);
		var polylen = poly.length,
		genpolylen = genpoly.length;
		for (var k = 0; k < genpolylen; ++k) {
			modulus.push(0);
		}
		for (var i = 0; i < polylen; ) {
			var quotient = GF256_INVMAP[modulus[i++]];
			if (quotient >= 0) {
				for (var j = 0; j < genpolylen; ++j) {
					modulus[i + j] ^= GF256_MAP[(quotient + genpoly[j]) % 255];
				}
			}
		}
		return modulus.slice(polylen);
	};
	var augumenteccs = function (poly, nblocks, genpoly) {
		var subsizes = [];
		var subsize = (poly.length / nblocks) | 0,
		subsize0 = 0;
		var pivot = nblocks - poly.length % nblocks;
		for (var i = 0; i < pivot; ++i) {
			subsizes.push(subsize0);
			subsize0 += subsize;
		}
		for (var i = pivot; i < nblocks; ++i) {
			subsizes.push(subsize0);
			subsize0 += subsize + 1;
		}
		subsizes.push(subsize0);
		var eccs = [];
		for (var i = 0; i < nblocks; ++i) {
			eccs.push(calculateecc(poly.slice(subsizes[i], subsizes[i + 1]), genpoly));
		}
		var result = [];
		var nitemsperblock = (poly.length / nblocks) | 0;
		for (var i = 0; i < nitemsperblock; ++i) {
			for (var j = 0; j < nblocks; ++j) {
				result.push(poly[subsizes[j] + i]);
			}
		}
		for (var j = pivot; j < nblocks; ++j) {
			result.push(poly[subsizes[j + 1] - 1]);
		}
		for (var i = 0; i < genpoly.length; ++i) {
			for (var j = 0; j < nblocks; ++j) {
				result.push(eccs[j][i]);
			}
		}
		return result;
	};
	var augumentbch = function (poly, p, genpoly, q) {
		var modulus = poly << q;
		for (var i = p - 1; i >= 0; --i) {
			if ((modulus >> (q + i)) & 1) {
				modulus ^= genpoly << i;
			}
		}
		return (poly << q) | modulus;
	};
	var makebasematrix = function (ver) {
		var v = VERSIONS[ver],
		n = getsizebyver(ver);
		var matrix = [],
		reserved = [];
		for (var i = 0; i < n; ++i) {
			matrix.push([]);
			reserved.push([]);
		}
		var blit = function (y, x, h, w, bits) {
			for (var i = 0; i < h; ++i) {
				for (var j = 0; j < w; ++j) {
					matrix[y + i][x + j] = (bits[i] >> j) & 1;
					reserved[y + i][x + j] = 1;
				}
			}
		};
		blit(0, 0, 9, 9, [0x7f, 0x41, 0x5d, 0x5d, 0x5d, 0x41, 0x17f, 0x00, 0x40]);
		blit(n - 8, 0, 8, 9, [0x100, 0x7f, 0x41, 0x5d, 0x5d, 0x5d, 0x41, 0x7f]);
		blit(0, n - 8, 9, 8, [0xfe, 0x82, 0xba, 0xba, 0xba, 0x82, 0xfe, 0x00, 0x00]);
		for (var i = 9; i < n - 8; ++i) {
			matrix[6][i] = matrix[i][6] = ~i & 1;
			reserved[6][i] = reserved[i][6] = 1;
		}
		var aligns = v[2],
		m = aligns.length;
		for (var i = 0; i < m; ++i) {
			var minj = (i === 0 || i === m - 1 ? 1 : 0),
			maxj = (i === 0 ? m - 1 : m);
			for (var j = minj; j < maxj; ++j) {
				blit(aligns[i], aligns[j], 5, 5, [0x1f, 0x11, 0x15, 0x11, 0x1f]);
			}
		}
		if (needsverinfo(ver)) {
			var code = augumentbch(ver, 6, 0x1f25, 12);
			var k = 0;
			for (var i = 0; i < 6; ++i) {
				for (var j = 0; j < 3; ++j) {
					matrix[i][(n - 11) + j] = matrix[(n - 11) + j][i] = (code >> k++) & 1;
					reserved[i][(n - 11) + j] = reserved[(n - 11) + j][i] = 1;
				}
			}
		}
		return {
			matrix: matrix,
			reserved: reserved
		};
	};
	var putdata = function (matrix, reserved, buf) {
		var n = matrix.length;
		var k = 0,
		dir = -1;
		for (var i = n - 1; i >= 0; i -= 2) {
			if (i === 6) {
				--i;
			}
			var jj = (dir < 0 ? n - 1 : 0);
			for (var j = 0; j < n; ++j) {
				for (var ii = i; ii > i - 2; --ii) {
					if (!reserved[jj][ii]) {
						matrix[jj][ii] = (buf[k >> 3] >> (~k & 7)) & 1;
						++k;
					}
				}
				jj += dir;
			}
			dir = -dir;
		}
		return matrix;
	};
	var maskdata = function (matrix, reserved, mask) {
		var maskf = MASKFUNCS[mask];
		var n = matrix.length;
		for (var i = 0; i < n; ++i) {
			for (var j = 0; j < n; ++j) {
				if (!reserved[i][j]) {
					matrix[i][j] ^= maskf(i, j);
				}
			}
		}
		return matrix;
	};
	var putformatinfo = function (matrix, reserved, ecclevel, mask) {
		var n = matrix.length;
		var code = augumentbch((ecclevel << 3) | mask, 5, 0x537, 10) ^ 0x5412;
		for (var i = 0; i < 15; ++i) {
			var r = [0, 1, 2, 3, 4, 5, 7, 8, n - 7, n - 6, n - 5, n - 4, n - 3, n - 2, n - 1][i];
			var c = [n - 1, n - 2, n - 3, n - 4, n - 5, n - 6, n - 7, n - 8, 7, 5, 4, 3, 2, 1, 0][i];
			matrix[r][8] = matrix[8][c] = (code >> i) & 1;
		}
		return matrix;
	};
	var evaluatematrix = function (matrix) {
		var PENALTY_CONSECUTIVE = 3;
		var PENALTY_TWOBYTWO = 3;
		var PENALTY_FINDERLIKE = 40;
		var PENALTY_DENSITY = 10;
		var evaluategroup = function (groups) {
			var score = 0;
			for (var i = 0; i < groups.length; ++i) {
				if (groups[i] >= 5) {
					score += PENALTY_CONSECUTIVE + (groups[i] - 5);
				}
			}
			for (var i = 5; i < groups.length; i += 2) {
				var p = groups[i];
				if (groups[i - 1] === p && groups[i - 2] === 3 * p && groups[i - 3] === p && groups[i - 4] === p && (groups[i - 5] >= 4 * p || groups[i + 1] >= 4 * p)) {
					score += PENALTY_FINDERLIKE;
				}
			}
			return score;
		};
		var n = matrix.length;
		var score = 0,
		nblacks = 0;
		for (var i = 0; i < n; ++i) {
			var row = matrix[i];
			var groups;
			groups = [0];
			for (var j = 0; j < n; ) {
				var k;
				for (k = 0; j < n && row[j]; ++k) {
					++j;
				}
				groups.push(k);
				for (k = 0; j < n && !row[j]; ++k) {
					++j;
				}
				groups.push(k);
			}
			score += evaluategroup(groups);
			groups = [0];
			for (var j = 0; j < n; ) {
				var k;
				for (k = 0; j < n && matrix[j][i]; ++k) {
					++j;
				}
				groups.push(k);
				for (k = 0; j < n && !matrix[j][i]; ++k) {
					++j;
				}
				groups.push(k);
			}
			score += evaluategroup(groups);
			var nextrow = matrix[i + 1] || [];
			nblacks += row[0];
			for (var j = 1; j < n; ++j) {
				var p = row[j];
				nblacks += p;
				if (row[j - 1] === p && nextrow[j] === p && nextrow[j - 1] === p) {
					score += PENALTY_TWOBYTWO;
				}
			}
		}
		score += PENALTY_DENSITY * ((Math.abs(nblacks / n / n - 0.5) / 0.05) | 0);
		return score;
	};
	var generate = function (data, ver, mode, ecclevel, mask) {
		var v = VERSIONS[ver];
		var buf = encode(ver, mode, data, ndatabits(ver, ecclevel) >> 3);
		buf = augumenteccs(buf, v[1][ecclevel], GF256_GENPOLY[v[0][ecclevel]]);
		var result = makebasematrix(ver);
		var matrix = result.matrix,
		reserved = result.reserved;
		putdata(matrix, reserved, buf);
		if (mask < 0) {
			maskdata(matrix, reserved, 0);
			putformatinfo(matrix, reserved, ecclevel, 0);
			var bestmask = 0,
			bestscore = evaluatematrix(matrix);
			maskdata(matrix, reserved, 0);
			for (mask = 1; mask < 8; ++mask) {
				maskdata(matrix, reserved, mask);
				putformatinfo(matrix, reserved, ecclevel, mask);
				var score = evaluatematrix(matrix);
				if (bestscore > score) {
					bestscore = score;
					bestmask = mask;
				}
				maskdata(matrix, reserved, mask);
			}
			mask = bestmask;
		}
		maskdata(matrix, reserved, mask);
		putformatinfo(matrix, reserved, ecclevel, mask);
		return matrix;
	};
	var QRCode = {
		"generate": function (data, options) {
			var MODES = {
				"numeric": MODE_NUMERIC,
				"alphanumeric": MODE_ALPHANUMERIC,
				"octet": MODE_OCTET
			};
			var ECCLEVELS = {
				"L": ECCLEVEL_L,
				"M": ECCLEVEL_M,
				"Q": ECCLEVEL_Q,
				"H": ECCLEVEL_H
			};
			options = options || {};
			var ver = options.version || -1;
			var ecclevel = ECCLEVELS[(options.ecclevel || "L").toUpperCase()];
			var mode = options.mode ? MODES[options.mode.toLowerCase()] : -1;
			var mask = "mask" in options ? options.mask : -1;
			if (mode < 0) {
				if (typeof data === "string") {
					if (data.match(NUMERIC_REGEXP)) {
						mode = MODE_NUMERIC;
					} else if (data.match(ALPHANUMERIC_OUT_REGEXP)) {
						mode = MODE_ALPHANUMERIC;
					} else {
						mode = MODE_OCTET;
					}
				} else {
					mode = MODE_OCTET;
				}
			} else if (!(mode ===  MODE_NUMERIC || mode ===  MODE_ALPHANUMERIC || mode ===  MODE_OCTET)) {
				throw "invalid or unsupported mode";
			}
			data = validatedata(mode, data);
			if (data === null) {
				throw "invalid data format";
			}
			if (ecclevel < 0 || ecclevel > 3) {
				throw "invalid ECC level";
			}
			if (ver < 0) {
				for (ver = 1; ver <= 40; ++ver) {
					if (data.length <= getmaxdatalen(ver, mode, ecclevel)) {
						break;
					}
				}
				if (ver > 40) {
					throw "too large data";
				}
			} else if (ver < 1 || ver > 40) {
				throw "invalid version";
			}
			if (mask !== -1 && (mask < 0 || mask > 8)) {
				throw "invalid mask";
			}
			return generate(data, ver, mode, ecclevel, mask);
		},
		"generateHTML": function (data, options) {
			options = options || {};
			var fillcolor = options.fillcolor ? options.fillcolor : "#FFFFFF";
			var textcolor = options.textcolor ? options.textcolor : "#000000";
			var matrix = QRCode["generate"](data, options);
			var modsize = Math.max(options.modulesize || 5, 0.5);
			var margin = Math.max(options.margin !== null ? options.margin : 4, 0.0);
			var e = document.createElement("div");
			var n = matrix.length;
			var html = ['<table border="0" cellspacing="0" cellpadding="0" style="border:' +
				modsize * margin + 'px solid ' + fillcolor + ';background:' + fillcolor + '">'];
			for (var i = 0; i < n; ++i) {
				html.push("<tr>");
				for (var j = 0; j < n; ++j) {
					html.push('<td style="width:' + modsize + 'px;height:' + modsize + 'px' +
						(matrix[i][j] ? ';background:' + textcolor : '') + '"></td>');
				}
				html.push("</tr>");
			}
			e.className = "qrcode";
			/* e.innerHTML = html.join("") + "</table>"; */
			var range = document.createRange();
			range.selectNodeContents(e);
			var frag = range.createContextualFragment(html.join("") + "</table>");
			e.appendChild(frag);
			return e;
		},
		"generateSVG": function (data, options) {
			options = options || {};
			var fillcolor = options.fillcolor ? options.fillcolor : "#FFFFFF";
			var textcolor = options.textcolor ? options.textcolor : "#000000";
			var matrix = QRCode["generate"](data, options);
			var n = matrix.length;
			var modsize = Math.max(options.modulesize || 5, 0.5);
			var margin = Math.max(options.margin ? options.margin : 4, 0.0);
			var size = modsize * (n + 2 * margin);
			/* var common = ' class= "fg"' + ' width="' + modsize + '" height="' + modsize + '"/>'; */
			var e = document.createElementNS("http://www.w3.org/2000/svg", "svg");
			e.setAttribute("viewBox", "0 0 " + size + " " + size);
			e.setAttribute("style", "shape-rendering:crispEdges");
			var qrcodeId = "qrcode" + Date.now();
			e.setAttribute("id", qrcodeId);
			var frag = document.createDocumentFragment();
			/* var svg = ['<style scoped>.bg{fill:' + fillcolor + '}.fg{fill:' + textcolor + '}</style>', '<rect class="bg" x="0" y="0"', 'width="' + size + '" height="' + size + '"/>', ]; */
			var style = document.createElementNS("http://www.w3.org/2000/svg", "style");
			style.appendChild(document.createTextNode("#" + qrcodeId + " .bg{fill:" + fillcolor + "}#" + qrcodeId + " .fg{fill:" + textcolor + "}"));
			/* style.setAttribute("scoped", "scoped"); */
			frag.appendChild(style);
			var createRect = function (c, f, x, y, s) {
				var fg = document.createElementNS("http://www.w3.org/2000/svg", "rect") || "";
				fg.setAttributeNS(null, "class", c);
				fg.setAttributeNS(null, "fill", f);
				fg.setAttributeNS(null, "x", x);
				fg.setAttributeNS(null, "y", y);
				fg.setAttributeNS(null, "width", s);
				fg.setAttributeNS(null, "height", s);
				return fg;
			};
			frag.appendChild(createRect("bg", "none", 0, 0, size));
			var yo = margin * modsize;
			for (var y = 0; y < n; ++y) {
				var xo = margin * modsize;
				for (var x = 0; x < n; ++x) {
					if (matrix[y][x]) {
						/* svg.push('<rect x="' + xo + '" y="' + yo + '"', common); */
						frag.appendChild(createRect("fg", "none", xo, yo, modsize));
					}
					xo += modsize;
				}
				yo += modsize;
			}
			/* e.innerHTML = svg.join(""); */
			e.appendChild(frag);
			return e;
		},
		"generatePNG": function (data, options) {
			options = options || {};
			var fillcolor = options.fillcolor ? options.fillcolor : "#FFFFFF";
			var textcolor = options.textcolor ? options.textcolor : "#000000";
			var matrix = QRCode["generate"](data, options);
			var modsize = Math.max(options.modulesize || 5, 0.5);
			var margin = Math.max((options.margin !== null && options.margin !== undefined) ? options.margin : 4, 0.0);
			var n = matrix.length;
			var size = modsize * (n + 2 * margin);
			var canvas = document.createElement("canvas"),
			context;
			canvas.width = canvas.height = size;
			context = canvas.getContext("2d");
			if (!context) {
				throw "canvas support is needed for PNG output";
			}
			context.fillStyle = fillcolor;
			context.fillRect(0, 0, size, size);
			context.fillStyle = textcolor;
			for (var i = 0; i < n; ++i) {
				for (var j = 0; j < n; ++j) {
					if (matrix[i][j]) {
						context.fillRect(modsize * (margin + j), modsize * (margin + i), modsize, modsize);
					}
				}
			}
			return canvas.toDataURL();
		}
	};
	return QRCode;
}));
/*jshint bitwise: true */
/*jshint shadow: false */
/*jshint sub: false */
/*jshint +W041 */

/**
 * Generates event when user makes new movement (like a swipe on a touchscreen).
 * @version 1.2.0
 * @link https://github.com/Promo/wheel-indicator
 * @license MIT
 */

/* global module, window, document */

var WheelIndicator = (function() {
    function Module(options) {
        var DEFAULTS = {
            callback: function(){},
            elem: document,
            preventMouse: true
        };

        this.eventWheel = 'onwheel' in document ? 'wheel' : 'mousewheel';
        this._options = extend(DEFAULTS, options);
        this._deltaArray = [ 0, 0, 0 ];
        this._isAcceleration = false;
        this._isStopped = true;
        this._direction = '';
        this._timer = '';
        this._isWorking = true;

        var self = this;
        this._wheelHandler = function(event) {
            if (self._isWorking) {
                processDelta.call(self, event);

                if (self._options.preventMouse) {
                    preventDefault(event);
                }
            }
        };

        addEvent(this._options.elem, this.eventWheel, this._wheelHandler);
    }

    Module.prototype = {
        constructor: Module,

        turnOn: function(){
            this._isWorking = true;

            return this;
        },

        turnOff: function(){
            this._isWorking = false;

            return this;
        },

        setOptions: function(options){
            this._options = extend(this._options, options);

            return this;
        },

        getOption: function(option){
            var neededOption = this._options[option];

            if (neededOption !== undefined) {
                return neededOption;
            }

            throw new Error('Unknown option');
        },

        destroy: function(){
            removeEvent(this._options.elem, this.eventWheel, this._wheelHandler);

            return this;
        }
    };

    function triggerEvent(event){
        event.direction = this._direction;

        this._options.callback.call(this, event);
    }

    var getDeltaY = function(event){
        if (event.wheelDelta && !event.deltaY) {
            getDeltaY = function(event) {
                return event.wheelDelta * -1;
            };
        } else {
            getDeltaY = function(event) {
                return event.deltaY;
            };
        }

        return getDeltaY(event);
    };

    function preventDefault(event){
        event = event || window.event;

        if (event.preventDefault) {
            event.preventDefault();
        } else {
            event.returnValue = false;
        }
    }

    function processDelta(event) {
        var
            self = this,
            delta = getDeltaY(event);

        if (delta === 0) return;

        var direction = delta > 0 ? 'down' : 'up',
            arrayLength = self._deltaArray.length,
            changedDirection = false,
            repeatDirection = 0,
            sustainableDirection, i;

        clearTimeout(self._timer);

        self._timer = setTimeout(function() {
            self._deltaArray = [ 0, 0, 0 ];
            self._isStopped = true;
            self._direction = direction;
        }, 150);

        //check how many of last three deltas correspond to certain direction
        for(i = 0; i < arrayLength; i++) {
            if(self._deltaArray[i] !== 0) {
                self._deltaArray[i] > 0 ? ++repeatDirection : --repeatDirection;
            }
        }

        //if all of last three deltas is greater than 0 or lesser than 0 then direction is switched
        if (Math.abs(repeatDirection) === arrayLength) {
            //determine type of sustainable direction
            //(three positive or negative deltas in a row)
            sustainableDirection = repeatDirection > 0 ? 'down' : 'up';

            if(sustainableDirection !== self._direction) {
                //direction is switched
                changedDirection = true;
                self._direction = direction;
            }
        }

        //if wheel`s moving and current event is not the first in array
        if (!self._isStopped){
            if(changedDirection) {
                self._isAcceleration = true;

                triggerEvent.call(this, event);
            } else {
                //check only if movement direction is sustainable
                if(Math.abs(repeatDirection) === arrayLength) {
                    //must take deltas to don`t get a bug
                    //[-116, -109, -103]
                    //[-109, -103, 1] - new impulse

                    analyzeArray.call(this, event);
                }
            }
        }

        //if wheel is stopped and current delta value is the first in array
        if (self._isStopped) {
            self._isStopped = false;
            self._isAcceleration = true;
            self._direction = direction;

            triggerEvent.call(this, event);
        }

        self._deltaArray.shift();
        self._deltaArray.push(delta);
    }

    function analyzeArray(event) {
        var
            deltaArray0Abs  = Math.abs(this._deltaArray[0]),
            deltaArray1Abs  = Math.abs(this._deltaArray[1]),
            deltaArray2Abs  = Math.abs(this._deltaArray[2]),
            deltaAbs        = Math.abs(getDeltaY(event));

        if((deltaAbs       > deltaArray2Abs) &&
            (deltaArray2Abs > deltaArray1Abs) &&
            (deltaArray1Abs > deltaArray0Abs)) {

            if(!this._isAcceleration) {
                triggerEvent.call(this, event);
                this._isAcceleration = true;
            }
        }

        if((deltaAbs < deltaArray2Abs) &&
            (deltaArray2Abs <= deltaArray1Abs)) {
            this._isAcceleration = false;
        }
    }

    function addEvent(elem, type, handler){
        if(elem.addEventListener) {
            elem.addEventListener(type, handler, false);
        } else if (elem.attachEvent) {
            elem.attachEvent('on' + type, handler);
        }
    }

    function removeEvent(elem, type, handler) {
        if (elem.removeEventListener) {
            elem.removeEventListener(type, handler, false);
        } else if (elem.detachEvent) {
            elem.detachEvent('on'+ type, handler);
        }
    }

    function extend(defaults, options) {
        var extended = {},
            prop;

        for (prop in defaults) {
            if (Object.prototype.hasOwnProperty.call(defaults, prop)) {
                extended[prop] = defaults[prop];
            }
        }

        for (prop in options) {
            if (Object.prototype.hasOwnProperty.call(options, prop)) {
                extended[prop] = options[prop];
            }
        }

        return extended;
    }

    return Module;
}());

if (typeof exports === 'object') {
    module.exports = WheelIndicator;
}

/*!
 * verge 1.10.2+201705300050
 * http://npm.im/verge
 * MIT Ryan Van Etten
 */

!function(root, name, make) {
  if (typeof module != 'undefined' && module['exports']) module['exports'] = make();
  else root[name] = make();
}(this, 'verge', function() {

  var xports = {}
    , win = typeof window != 'undefined' && window
    , doc = typeof document != 'undefined' && document
    , docElem = doc && doc.documentElement
    , matchMedia = win['matchMedia'] || win['msMatchMedia']
    , mq = matchMedia ? function(q) {
        return !!matchMedia.call(win, q).matches;
      } : function() {
        return false;
      }
    , viewportW = xports['viewportW'] = function() {
        var a = docElem['clientWidth'], b = win['innerWidth'];
        return a < b ? b : a;
      }
    , viewportH = xports['viewportH'] = function() {
        var a = docElem['clientHeight'], b = win['innerHeight'];
        return a < b ? b : a;
      };

  /**
   * Test if a media query is active. Like Modernizr.mq
   * @since 1.6.0
   * @return {boolean}
   */
  xports['mq'] = mq;

  /**
   * Normalized matchMedia
   * @since 1.6.0
   * @return {MediaQueryList|Object}
   */
  xports['matchMedia'] = matchMedia ? function() {
    // matchMedia must be binded to window
    return matchMedia.apply(win, arguments);
  } : function() {
    // Gracefully degrade to plain object
    return {};
  };

  /**
   * @since 1.8.0
   * @return {{width:number, height:number}}
   */
  function viewport() {
    return {'width':viewportW(), 'height':viewportH()};
  }
  xports['viewport'] = viewport;

  /**
   * Cross-browser window.scrollX
   * @since 1.0.0
   * @return {number}
   */
  xports['scrollX'] = function() {
    return win.pageXOffset || docElem.scrollLeft;
  };

  /**
   * Cross-browser window.scrollY
   * @since 1.0.0
   * @return {number}
   */
  xports['scrollY'] = function() {
    return win.pageYOffset || docElem.scrollTop;
  };

  /**
   * @param {{top:number, right:number, bottom:number, left:number}} coords
   * @param {number=} cushion adjustment
   * @return {Object}
   */
  function calibrate(coords, cushion) {
    var o = {};
    cushion = +cushion || 0;
    o['width'] = (o['right'] = coords['right'] + cushion) - (o['left'] = coords['left'] - cushion);
    o['height'] = (o['bottom'] = coords['bottom'] + cushion) - (o['top'] = coords['top'] - cushion);
    return o;
  }

  /**
   * Cross-browser element.getBoundingClientRect plus optional cushion.
   * Coords are relative to the top-left corner of the viewport.
   * @since 1.0.0
   * @param {Element|Object} el element or stack (uses first item)
   * @param {number=} cushion +/- pixel adjustment amount
   * @return {Object|boolean}
   */
  function rectangle(el, cushion) {
    el = el && !el.nodeType ? el[0] : el;
    if (!el || 1 !== el.nodeType) return false;
    return calibrate(el.getBoundingClientRect(), cushion);
  }
  xports['rectangle'] = rectangle;

  /**
   * Get the viewport aspect ratio (or the aspect ratio of an object or element)
   * @since 1.7.0
   * @param {(Element|Object)=} o optional object with width/height props or methods
   * @return {number}
   * @link http://w3.org/TR/css3-mediaqueries/#orientation
   */
  function aspect(o) {
    o = null == o ? viewport() : 1 === o.nodeType ? rectangle(o) : o;
    var h = o['height'], w = o['width'];
    h = typeof h == 'function' ? h.call(o) : h;
    w = typeof w == 'function' ? w.call(o) : w;
    return w/h;
  }
  xports['aspect'] = aspect;

  /**
   * Test if an element is in the same x-axis section as the viewport.
   * @since 1.0.0
   * @param {Element|Object} el
   * @param {number=} cushion
   * @return {boolean}
   */
  xports['inX'] = function(el, cushion) {
    var r = rectangle(el, cushion);
    return !!r && r.right >= 0 && r.left <= viewportW();
  };

  /**
   * Test if an element is in the same y-axis section as the viewport.
   * @since 1.0.0
   * @param {Element|Object} el
   * @param {number=} cushion
   * @return {boolean}
   */
  xports['inY'] = function(el, cushion) {
    var r = rectangle(el, cushion);
    return !!r && r.bottom >= 0 && r.top <= viewportH();
  };

  /**
   * Test if an element is in the viewport.
   * @since 1.0.0
   * @param {Element|Object} el
   * @param {number=} cushion
   * @return {boolean}
   */
  xports['inViewport'] = function(el, cushion) {
    // Equiv to `inX(el, cushion) && inY(el, cushion)` but just manually do both
    // to avoid calling rectangle() twice. It gzips just as small like this.
    var r = rectangle(el, cushion);
    return !!r && r.bottom >= 0 && r.right >= 0 && r.top <= viewportH() && r.left <= viewportW();
  };

  return xports;
});

/**
 *
 * Version: 2.0.1
 * Author: Gianluca Guarini
 * Contact: gianluca.guarini@gmail.com
 * Website: http://www.gianlucaguarini.com/
 * Twitter: @gianlucaguarini
 *
 * Copyright (c) Gianluca Guarini
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 **/
/* global jQuery */
(function(doc, win) {
  if (typeof doc.createEvent !== 'function') return false // no tap events here
  // helpers
  var pointerEvent = function(type) {
      var lo = type.toLowerCase(),
        ms = 'MS' + type
      return navigator.msPointerEnabled ? ms : window.PointerEvent ? lo : false
    },
    touchEvent = function(name) {
      return 'on' + name in window ? name : false
    },
    defaults = {
      useJquery: !win.IGNORE_JQUERY && typeof jQuery !== 'undefined',
      swipeThreshold: win.SWIPE_THRESHOLD || 100,
      tapThreshold: win.TAP_THRESHOLD || 150, // range of time where a tap event could be detected
      dbltapThreshold: win.DBL_TAP_THRESHOLD || 200, // delay needed to detect a double tap
      longtapThreshold: win.LONG_TAP_THRESHOLD || 1000, // delay needed to detect a long tap
      tapPrecision: win.TAP_PRECISION / 2 || 60 / 2, // touch events boundaries ( 60px by default )
      justTouchEvents: win.JUST_ON_TOUCH_DEVICES
    },
    // was initially triggered a "touchstart" event?
    wasTouch = false,
    touchevents = {
      touchstart: touchEvent('touchstart') || pointerEvent('PointerDown'),
      touchend: touchEvent('touchend') || pointerEvent('PointerUp'),
      touchmove: touchEvent('touchmove') || pointerEvent('PointerMove')
    },
    isTheSameFingerId = function(e) {
      return !e.pointerId || typeof pointerId === 'undefined' || e.pointerId === pointerId
    },
    setListener = function(elm, events, callback) {
      var eventsArray = events.split(' '),
        i = eventsArray.length

      while (i--) {
        elm.addEventListener(eventsArray[i], callback, false)
      }
    },
    getPointerEvent = function(event) {
      return event.targetTouches ? event.targetTouches[0] : event
    },
    getTimestamp = function () {
      return new Date().getTime()
    },
    sendEvent = function(elm, eventName, originalEvent, data) {
      var customEvent = doc.createEvent('Event')
      customEvent.originalEvent = originalEvent
      data = data || {}
      data.x = currX
      data.y = currY
      data.distance = data.distance

      // jquery
      if (defaults.useJquery) {
        customEvent = jQuery.Event(eventName, {originalEvent: originalEvent})
        jQuery(elm).trigger(customEvent, data)
      }

      // addEventListener
      if (customEvent.initEvent) {
        for (var key in data) {
          customEvent[key] = data[key]
        }

        customEvent.initEvent(eventName, true, true)
        elm.dispatchEvent(customEvent)
      }

      // detect all the inline events
      // also on the parent nodes
      while (elm) {
        // inline
        if (elm['on' + eventName])
          elm['on' + eventName](customEvent)
        elm = elm.parentNode
      }

    },

    onTouchStart = function(e) {
      /**
       * Skip all the mouse events
       * events order:
       * Chrome:
       *   touchstart
       *   touchmove
       *   touchend
       *   mousedown
       *   mousemove
       *   mouseup <- this must come always after a "touchstart"
       *
       * Safari
       *   touchstart
       *   mousedown
       *   touchmove
       *   mousemove
       *   touchend
       *   mouseup <- this must come always after a "touchstart"
       */

      if (!isTheSameFingerId(e)) return

      pointerId = e.pointerId

      // it looks like it was a touch event!
      if (e.type !== 'mousedown')
        wasTouch = true

      // skip this event we don't need to track it now
      if (e.type === 'mousedown' && wasTouch) return

      var pointer = getPointerEvent(e)

      // caching the current x
      cachedX = currX = pointer.pageX
      // caching the current y
      cachedY = currY = pointer.pageY

      longtapTimer = setTimeout(function() {
        sendEvent(e.target, 'longtap', e)
        target = e.target
      }, defaults.longtapThreshold)

      // we will use these variables on the touchend events
      timestamp = getTimestamp()

      tapNum++

    },
    onTouchEnd = function(e) {

      if (!isTheSameFingerId(e)) return

      pointerId = undefined

      // skip the mouse events if previously a touch event was dispatched
      // and reset the touch flag
      if (e.type === 'mouseup' && wasTouch) {
        wasTouch = false
        return
      }

      var eventsArr = [],
        now = getTimestamp(),
        deltaY = cachedY - currY,
        deltaX = cachedX - currX

      // clear the previous timer if it was set
      clearTimeout(dblTapTimer)
      // kill the long tap timer
      clearTimeout(longtapTimer)

      if (deltaX <= -defaults.swipeThreshold)
        eventsArr.push('swiperight')

      if (deltaX >= defaults.swipeThreshold)
        eventsArr.push('swipeleft')

      if (deltaY <= -defaults.swipeThreshold)
        eventsArr.push('swipedown')

      if (deltaY >= defaults.swipeThreshold)
        eventsArr.push('swipeup')

      if (eventsArr.length) {
        for (var i = 0; i < eventsArr.length; i++) {
          var eventName = eventsArr[i]
          sendEvent(e.target, eventName, e, {
            distance: {
              x: Math.abs(deltaX),
              y: Math.abs(deltaY)
            }
          })
        }
        // reset the tap counter
        tapNum = 0
      } else {

        if (
          cachedX >= currX - defaults.tapPrecision &&
          cachedX <= currX + defaults.tapPrecision &&
          cachedY >= currY - defaults.tapPrecision &&
          cachedY <= currY + defaults.tapPrecision
        ) {
          if (timestamp + defaults.tapThreshold - now >= 0)
          {
            // Here you get the Tap event
            sendEvent(e.target, tapNum >= 2 && target === e.target ? 'dbltap' : 'tap', e)
            target= e.target
          }
        }

        // reset the tap counter
        dblTapTimer = setTimeout(function() {
          tapNum = 0
        }, defaults.dbltapThreshold)

      }
    },
    onTouchMove = function(e) {
      if (!isTheSameFingerId(e)) return
      // skip the mouse move events if the touch events were previously detected
      if (e.type === 'mousemove' && wasTouch) return

      var pointer = getPointerEvent(e)
      currX = pointer.pageX
      currY = pointer.pageY
    },
    tapNum = 0,
    pointerId, currX, currY, cachedX, cachedY, timestamp, target, dblTapTimer, longtapTimer

  //setting the events listeners
  // we need to debounce the callbacks because some devices multiple events are triggered at same time
  setListener(doc, touchevents.touchstart + (defaults.justTouchEvents ? '' : ' mousedown'), onTouchStart)
  setListener(doc, touchevents.touchend + (defaults.justTouchEvents ? '' : ' mouseup'), onTouchEnd)
  setListener(doc, touchevents.touchmove + (defaults.justTouchEvents ? '' : ' mousemove'), onTouchMove)

  // Configure the tocca default options at any time
  win.tocca = function(options) {
    for (var opt in options) {
      defaults[opt] = options[opt]
    }

    return defaults
  }
})(document, window)

/*!
LegoMushroom @legomushroom http://legomushroom.com
MIT License 2014
 */
/*jshint -W083 */
(function () {
	var Main;
	Main = (function () {
		function Main(o) {
			this.o = o !== null ? o : {};
			if (window.isAnyResizeEventInited) {
				return;
			}
			this.vars();
			this.redefineProto();
		}
		Main.prototype.vars = function () {
			window.isAnyResizeEventInited = true;
			this.allowedProtos = [HTMLDivElement, HTMLFormElement, HTMLLinkElement, HTMLBodyElement, HTMLParagraphElement, HTMLFieldSetElement, HTMLLegendElement, HTMLLabelElement, HTMLButtonElement, HTMLUListElement, HTMLOListElement, HTMLLIElement, HTMLHeadingElement, HTMLQuoteElement, HTMLPreElement, HTMLBRElement, HTMLFontElement, HTMLHRElement, HTMLModElement, HTMLParamElement, HTMLMapElement, HTMLTableElement, HTMLTableCaptionElement, HTMLImageElement, HTMLTableCellElement, HTMLSelectElement, HTMLInputElement, HTMLTextAreaElement, HTMLAnchorElement, HTMLObjectElement, HTMLTableColElement, HTMLTableSectionElement, HTMLTableRowElement];
			return (this.timerElements = {
					img: 1,
					textarea: 1,
					input: 1,
					embed: 1,
					object: 1,
					svg: 1,
					canvas: 1,
					tr: 1,
					tbody: 1,
					thead: 1,
					tfoot: 1,
					a: 1,
					select: 1,
					option: 1,
					optgroup: 1,
					dl: 1,
					dt: 1,
					br: 1,
					basefont: 1,
					font: 1,
					col: 1,
					iframe: 1
				});
		};
		Main.prototype.redefineProto = function () {
			var i,
			it,
			proto,
			t;
			it = this;
			return (t = (function () {
					var _i,
					_len,
					_ref,
					_results;
					_ref = this.allowedProtos;
					_results = [];
					for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
						proto = _ref[i];
						if (proto.prototype === null) {
							continue;
						}
						_results.push((function (proto) {
								var listener,
								remover;
								listener = proto.prototype.addEventListener || proto.prototype.attachEvent;
								var wrappedListener;
								(function (listener) {
									wrappedListener = function () {
										var option;
										if (this !== window || this !== document) {
											option = arguments[0] === 'onresize' && !this.isAnyResizeEventInited;
											if (option) {
												it.handleResize({
													args: arguments,
													that: this
												});
											}

										}
										return listener.apply(this, arguments);
									};
									if (proto.prototype.addEventListener) {
										return (proto.prototype.addEventListener = wrappedListener);
									} else if (proto.prototype.attachEvent) {
										return (proto.prototype.attachEvent = wrappedListener);
									}
								})(listener);
								remover = proto.prototype.removeEventListener || proto.prototype.detachEvent;
								return (function (remover) {
									var wrappedRemover;
									wrappedRemover = function () {
										this.isAnyResizeEventInited = false;
										if (this.iframe) {
											this.removeChild(this.iframe);
										}
										return remover.apply(this, arguments);
									};
									if (proto.prototype.removeEventListener) {
										return (proto.prototype.removeEventListener = wrappedRemover);
									} else if (proto.prototype.detachEvent) {
										return (proto.prototype.detachEvent = wrappedListener);
									}
								})(remover);
							})(proto));
					}
					return _results;
				}).call(this));
		};
		Main.prototype.handleResize = function (args) {
			var computedStyle,
			el,
			iframe,
			isEmpty,
			isStatic,
			_ref;
			el = args.that;
			if (!this.timerElements[el.tagName.toLowerCase()]) {
				iframe = document.createElement('iframe');
				el.appendChild(iframe);
				iframe.style.width = '100%';
				iframe.style.height = '100%';
				iframe.style.position = 'absolute';
				iframe.style.zIndex = -999;
				iframe.style.opacity = 0;
				iframe.style.top = 0;
				iframe.style.left = 0;
				computedStyle = window.getComputedStyle ? getComputedStyle(el) : el.currentStyle;
				isStatic = computedStyle.position === 'static' && el.style.position === '';
				isEmpty = computedStyle.position === '' && el.style.position === '';
				if (isStatic || isEmpty) {
					el.style.position = 'relative';
				}
				if ((_ref = iframe.contentWindow) !== null) {
					_ref.onresize = (function (_this) {
						return function (e) {
							return _this.dispatchEvent(el);
						};
					})(this);
				}
				el.iframe = iframe;
			} else {
				this.initTimer(el);
			}
			return (el.isAnyResizeEventInited = true);
		};
		Main.prototype.initTimer = function (el) {
			var height,
			width;
			width = 0;
			height = 0;
			return (this.interval = setInterval((function (_this) {
							return function () {
								var newHeight,
								newWidth;
								newWidth = el.offsetWidth;
								newHeight = el.offsetHeight;
								if (newWidth !== width || newHeight !== height) {
									_this.dispatchEvent(el);
									width = newWidth;
									return (height = newHeight);
								}
							};
						})(this), this.o.interval || 62.5));
		};
		Main.prototype.dispatchEvent = function (el) {
			var e;
			if (document.createEvent) {
				e = document.createEvent('HTMLEvents');
				e.initEvent('onresize', false, false);
				return el.dispatchEvent(e);
			} else if (document.createEventObject) {
				e = document.createEventObject();
				return el.fireEvent('onresize', e);
			} else {
				return false;
			}
		};
		Main.prototype.destroy = function () {
			var i,
			it,
			proto,
			_i,
			_len,
			_ref,
			_results;
			clearInterval(this.interval);
			this.interval = null;
			window.isAnyResizeEventInited = false;
			it = this;
			_ref = this.allowedProtos;
			_results = [];
			for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
				proto = _ref[i];
				if (proto.prototype === null) {
					continue;
				}
				_results.push((function (proto) {
						var listener;
						listener = proto.prototype.addEventListener || proto.prototype.attachEvent;
						if (proto.prototype.addEventListener) {
							proto.prototype.addEventListener = Element.prototype.addEventListener;
						} else if (proto.prototype.attachEvent) {
							proto.prototype.attachEvent = Element.prototype.attachEvent;
						}
						if (proto.prototype.removeEventListener) {
							return (proto.prototype.removeEventListener = Element.prototype.removeEventListener);
						} else if (proto.prototype.detachEvent) {
							return (proto.prototype.detachEvent = Element.prototype.detachEvent);
						}
					})(proto));
			}
			return _results;
		};
		return Main;
	})();
	if ((typeof define === "function") && define.amd) {
		define("any-resize-event", [], function () {
			return new Main();
		});
	} else if ((typeof module === "object") && (typeof module.exports === "object")) {
		module.exports = new Main();
	} else {
		if (typeof window !== "undefined" && window !== null) {
			window.AnyResizeEvent = Main;
		}
		if (typeof window !== "undefined" && window !== null) {
			window.anyResizeEvent = new Main();
		}
	}
}).call(this);
/*jshint +W083 */

/*!
 * @license Minigrid v3.1.1 minimal cascading grid layout http://alves.im/minigrid
 * @see {@link https://github.com/henriquea/minigrid}
 */
(function(root, document) {
	"use strict";
	var getElementsByClassName = "getElementsByClassName";
	var getElementById = "getElementById";
	var _length = "length";
	function extend(a, b) {
		for (var key in b) {
			if (b.hasOwnProperty(key)) {
				a[key] = b[key];
			}
		}
		return a;
	}
	var Minigrid = function(props) {
		var containerEle = props.container instanceof Node ?
			(props.container) :
			(document[getElementById](props.container) || document[getElementsByClassName](props.container)[0] || "");
		var itemsNodeList = props.item instanceof NodeList ?
			props.item :
			(containerEle[getElementsByClassName](props.item) || "");
		this.props = extend(props, {
			container: containerEle,
			nodeList: itemsNodeList
		});
	};
	Minigrid.prototype.mount = function() {
		if (!this.props.container) {
			return false;
		}
		if (!this.props.nodeList || this.props.nodeList[_length] === 0) {
			return false;
		}
		var gutter = (typeof this.props.gutter === "number" && isFinite(this.props.gutter) && Math.floor(this.props.gutter) === this.props.gutter) ? this.props.gutter : 0;
		var done = this.props.done;
		var containerEle = this.props.container;
		var itemsNodeList = this.props.nodeList;
		containerEle.style.width = "";
		var forEach = Array.prototype.forEach;
		var containerWidth = containerEle.getBoundingClientRect().width;
		var firstChildWidth = itemsNodeList[0].getBoundingClientRect().width + gutter;
		var cols = Math.max(Math.floor((containerWidth - gutter) / firstChildWidth), 1);
		var count = 0;
		containerWidth = (firstChildWidth * cols + gutter) + "px";
		containerEle.style.width = containerWidth;
		containerEle.style.position = "relative";
		var itemsGutter = [];
		var itemsPosX = [];
		for (var g = 0; g < cols; ++g) {
			itemsPosX.push(g * firstChildWidth + gutter);
			itemsGutter.push(gutter);
		}
		if (this.props.rtl) {
			itemsPosX.reverse();
		}
		forEach.call(itemsNodeList, function(item) {
			var itemIndex = itemsGutter.slice(0).sort(function(a, b) {
				return a - b;
			}).shift();
			itemIndex = itemsGutter.indexOf(itemIndex);
			var posX = parseInt(itemsPosX[itemIndex]);
			var posY = parseInt(itemsGutter[itemIndex]);
			item.style.position = "absolute";
			item.style.webkitBackfaceVisibility = item.style.backfaceVisibility = "hidden";
			item.style.transformStyle = "preserve-3d";
			item.style.transform = "translate3D(" + posX + "px," + posY + "px, 0)";
			itemsGutter[itemIndex] += item.getBoundingClientRect().height + gutter;
			count = count + 1;
		});
		containerEle.style.display = "";
		var containerHeight = itemsGutter.slice(0).sort(function(a, b) {
			return a - b;
		}).pop();
		containerEle.style.height = containerHeight + "px";
		if (typeof done === "function") {
			done(itemsNodeList);
		}
	};
	root.Minigrid = Minigrid;
}
("undefined" !== typeof window ? window : this, document));

/*!
 * mustache.js - Logic-less {{mustache}} templates with JavaScript
 * http://github.com/janl/mustache.js
 */

/*global define: false Mustache: true*/

(function defineMustache (global, factory) {
  if (typeof exports === 'object' && exports && typeof exports.nodeName !== 'string') {
    factory(exports); // CommonJS
  } else if (typeof define === 'function' && define.amd) {
    define(['exports'], factory); // AMD
  } else {
    global.Mustache = {};
    factory(global.Mustache); // script, wsh, asp
  }
}(this, function mustacheFactory (mustache) {

  var objectToString = Object.prototype.toString;
  var isArray = Array.isArray || function isArrayPolyfill (object) {
    return objectToString.call(object) === '[object Array]';
  };

  function isFunction (object) {
    return typeof object === 'function';
  }

  /**
   * More correct typeof string handling array
   * which normally returns typeof 'object'
   */
  function typeStr (obj) {
    return isArray(obj) ? 'array' : typeof obj;
  }

  function escapeRegExp (string) {
    return string.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
  }

  /**
   * Null safe way of checking whether or not an object,
   * including its prototype, has a given property
   */
  function hasProperty (obj, propName) {
    return obj != null && typeof obj === 'object' && (propName in obj);
  }

  // Workaround for https://issues.apache.org/jira/browse/COUCHDB-577
  // See https://github.com/janl/mustache.js/issues/189
  var regExpTest = RegExp.prototype.test;
  function testRegExp (re, string) {
    return regExpTest.call(re, string);
  }

  var nonSpaceRe = /\S/;
  function isWhitespace (string) {
    return !testRegExp(nonSpaceRe, string);
  }

  var entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
  };

  function escapeHtml (string) {
    return String(string).replace(/[&<>"'`=\/]/g, function fromEntityMap (s) {
      return entityMap[s];
    });
  }

  var whiteRe = /\s*/;
  var spaceRe = /\s+/;
  var equalsRe = /\s*=/;
  var curlyRe = /\s*\}/;
  var tagRe = /#|\^|\/|>|\{|&|=|!/;

  /**
   * Breaks up the given `template` string into a tree of tokens. If the `tags`
   * argument is given here it must be an array with two string values: the
   * opening and closing tags used in the template (e.g. [ "<%", "%>" ]). Of
   * course, the default is to use mustaches (i.e. mustache.tags).
   *
   * A token is an array with at least 4 elements. The first element is the
   * mustache symbol that was used inside the tag, e.g. "#" or "&". If the tag
   * did not contain a symbol (i.e. {{myValue}}) this element is "name". For
   * all text that appears outside a symbol this element is "text".
   *
   * The second element of a token is its "value". For mustache tags this is
   * whatever else was inside the tag besides the opening symbol. For text tokens
   * this is the text itself.
   *
   * The third and fourth elements of the token are the start and end indices,
   * respectively, of the token in the original template.
   *
   * Tokens that are the root node of a subtree contain two more elements: 1) an
   * array of tokens in the subtree and 2) the index in the original template at
   * which the closing tag for that section begins.
   */
  function parseTemplate (template, tags) {
    if (!template)
      return [];

    var sections = [];     // Stack to hold section tokens
    var tokens = [];       // Buffer to hold the tokens
    var spaces = [];       // Indices of whitespace tokens on the current line
    var hasTag = false;    // Is there a {{tag}} on the current line?
    var nonSpace = false;  // Is there a non-space char on the current line?

    // Strips all whitespace tokens array for the current line
    // if there was a {{#tag}} on it and otherwise only space.
    function stripSpace () {
      if (hasTag && !nonSpace) {
        while (spaces.length)
          delete tokens[spaces.pop()];
      } else {
        spaces = [];
      }

      hasTag = false;
      nonSpace = false;
    }

    var openingTagRe, closingTagRe, closingCurlyRe;
    function compileTags (tagsToCompile) {
      if (typeof tagsToCompile === 'string')
        tagsToCompile = tagsToCompile.split(spaceRe, 2);

      if (!isArray(tagsToCompile) || tagsToCompile.length !== 2)
        throw new Error('Invalid tags: ' + tagsToCompile);

      openingTagRe = new RegExp(escapeRegExp(tagsToCompile[0]) + '\\s*');
      closingTagRe = new RegExp('\\s*' + escapeRegExp(tagsToCompile[1]));
      closingCurlyRe = new RegExp('\\s*' + escapeRegExp('}' + tagsToCompile[1]));
    }

    compileTags(tags || mustache.tags);

    var scanner = new Scanner(template);

    var start, type, value, chr, token, openSection;
    while (!scanner.eos()) {
      start = scanner.pos;

      // Match any text between tags.
      value = scanner.scanUntil(openingTagRe);

      if (value) {
        for (var i = 0, valueLength = value.length; i < valueLength; ++i) {
          chr = value.charAt(i);

          if (isWhitespace(chr)) {
            spaces.push(tokens.length);
          } else {
            nonSpace = true;
          }

          tokens.push([ 'text', chr, start, start + 1 ]);
          start += 1;

          // Check for whitespace on the current line.
          if (chr === '\n')
            stripSpace();
        }
      }

      // Match the opening tag.
      if (!scanner.scan(openingTagRe))
        break;

      hasTag = true;

      // Get the tag type.
      type = scanner.scan(tagRe) || 'name';
      scanner.scan(whiteRe);

      // Get the tag value.
      if (type === '=') {
        value = scanner.scanUntil(equalsRe);
        scanner.scan(equalsRe);
        scanner.scanUntil(closingTagRe);
      } else if (type === '{') {
        value = scanner.scanUntil(closingCurlyRe);
        scanner.scan(curlyRe);
        scanner.scanUntil(closingTagRe);
        type = '&';
      } else {
        value = scanner.scanUntil(closingTagRe);
      }

      // Match the closing tag.
      if (!scanner.scan(closingTagRe))
        throw new Error('Unclosed tag at ' + scanner.pos);

      token = [ type, value, start, scanner.pos ];
      tokens.push(token);

      if (type === '#' || type === '^') {
        sections.push(token);
      } else if (type === '/') {
        // Check section nesting.
        openSection = sections.pop();

        if (!openSection)
          throw new Error('Unopened section "' + value + '" at ' + start);

        if (openSection[1] !== value)
          throw new Error('Unclosed section "' + openSection[1] + '" at ' + start);
      } else if (type === 'name' || type === '{' || type === '&') {
        nonSpace = true;
      } else if (type === '=') {
        // Set the tags for the next time around.
        compileTags(value);
      }
    }

    // Make sure there are no open sections when we're done.
    openSection = sections.pop();

    if (openSection)
      throw new Error('Unclosed section "' + openSection[1] + '" at ' + scanner.pos);

    return nestTokens(squashTokens(tokens));
  }

  /**
   * Combines the values of consecutive text tokens in the given `tokens` array
   * to a single token.
   */
  function squashTokens (tokens) {
    var squashedTokens = [];

    var token, lastToken;
    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
      token = tokens[i];

      if (token) {
        if (token[0] === 'text' && lastToken && lastToken[0] === 'text') {
          lastToken[1] += token[1];
          lastToken[3] = token[3];
        } else {
          squashedTokens.push(token);
          lastToken = token;
        }
      }
    }

    return squashedTokens;
  }

  /**
   * Forms the given array of `tokens` into a nested tree structure where
   * tokens that represent a section have two additional items: 1) an array of
   * all tokens that appear in that section and 2) the index in the original
   * template that represents the end of that section.
   */
  function nestTokens (tokens) {
    var nestedTokens = [];
    var collector = nestedTokens;
    var sections = [];

    var token, section;
    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
      token = tokens[i];

      switch (token[0]) {
        case '#':
        case '^':
          collector.push(token);
          sections.push(token);
          collector = token[4] = [];
          break;
        case '/':
          section = sections.pop();
          section[5] = token[2];
          collector = sections.length > 0 ? sections[sections.length - 1][4] : nestedTokens;
          break;
        default:
          collector.push(token);
      }
    }

    return nestedTokens;
  }

  /**
   * A simple string scanner that is used by the template parser to find
   * tokens in template strings.
   */
  function Scanner (string) {
    this.string = string;
    this.tail = string;
    this.pos = 0;
  }

  /**
   * Returns `true` if the tail is empty (end of string).
   */
  Scanner.prototype.eos = function eos () {
    return this.tail === '';
  };

  /**
   * Tries to match the given regular expression at the current position.
   * Returns the matched text if it can match, the empty string otherwise.
   */
  Scanner.prototype.scan = function scan (re) {
    var match = this.tail.match(re);

    if (!match || match.index !== 0)
      return '';

    var string = match[0];

    this.tail = this.tail.substring(string.length);
    this.pos += string.length;

    return string;
  };

  /**
   * Skips all text until the given regular expression can be matched. Returns
   * the skipped string, which is the entire tail if no match can be made.
   */
  Scanner.prototype.scanUntil = function scanUntil (re) {
    var index = this.tail.search(re), match;

    switch (index) {
      case -1:
        match = this.tail;
        this.tail = '';
        break;
      case 0:
        match = '';
        break;
      default:
        match = this.tail.substring(0, index);
        this.tail = this.tail.substring(index);
    }

    this.pos += match.length;

    return match;
  };

  /**
   * Represents a rendering context by wrapping a view object and
   * maintaining a reference to the parent context.
   */
  function Context (view, parentContext) {
    this.view = view;
    this.cache = { '.': this.view };
    this.parent = parentContext;
  }

  /**
   * Creates a new context using the given view with this context
   * as the parent.
   */
  Context.prototype.push = function push (view) {
    return new Context(view, this);
  };

  /**
   * Returns the value of the given name in this context, traversing
   * up the context hierarchy if the value is absent in this context's view.
   */
  Context.prototype.lookup = function lookup (name) {
    var cache = this.cache;

    var value;
    if (cache.hasOwnProperty(name)) {
      value = cache[name];
    } else {
      var context = this, names, index, lookupHit = false;

      while (context) {
        if (name.indexOf('.') > 0) {
          value = context.view;
          names = name.split('.');
          index = 0;

          /**
           * Using the dot notion path in `name`, we descend through the
           * nested objects.
           *
           * To be certain that the lookup has been successful, we have to
           * check if the last object in the path actually has the property
           * we are looking for. We store the result in `lookupHit`.
           *
           * This is specially necessary for when the value has been set to
           * `undefined` and we want to avoid looking up parent contexts.
           **/
          while (value != null && index < names.length) {
            if (index === names.length - 1)
              lookupHit = hasProperty(value, names[index]);

            value = value[names[index++]];
          }
        } else {
          value = context.view[name];
          lookupHit = hasProperty(context.view, name);
        }

        if (lookupHit)
          break;

        context = context.parent;
      }

      cache[name] = value;
    }

    if (isFunction(value))
      value = value.call(this.view);

    return value;
  };

  /**
   * A Writer knows how to take a stream of tokens and render them to a
   * string, given a context. It also maintains a cache of templates to
   * avoid the need to parse the same template twice.
   */
  function Writer () {
    this.cache = {};
  }

  /**
   * Clears all cached templates in this writer.
   */
  Writer.prototype.clearCache = function clearCache () {
    this.cache = {};
  };

  /**
   * Parses and caches the given `template` and returns the array of tokens
   * that is generated from the parse.
   */
  Writer.prototype.parse = function parse (template, tags) {
    var cache = this.cache;
    var tokens = cache[template];

    if (tokens == null)
      tokens = cache[template] = parseTemplate(template, tags);

    return tokens;
  };

  /**
   * High-level method that is used to render the given `template` with
   * the given `view`.
   *
   * The optional `partials` argument may be an object that contains the
   * names and templates of partials that are used in the template. It may
   * also be a function that is used to load partial templates on the fly
   * that takes a single argument: the name of the partial.
   */
  Writer.prototype.render = function render (template, view, partials) {
    var tokens = this.parse(template);
    var context = (view instanceof Context) ? view : new Context(view);
    return this.renderTokens(tokens, context, partials, template);
  };

  /**
   * Low-level method that renders the given array of `tokens` using
   * the given `context` and `partials`.
   *
   * Note: The `originalTemplate` is only ever used to extract the portion
   * of the original template that was contained in a higher-order section.
   * If the template doesn't use higher-order sections, this argument may
   * be omitted.
   */
  Writer.prototype.renderTokens = function renderTokens (tokens, context, partials, originalTemplate) {
    var buffer = '';

    var token, symbol, value;
    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
      value = undefined;
      token = tokens[i];
      symbol = token[0];

      if (symbol === '#') value = this.renderSection(token, context, partials, originalTemplate);
      else if (symbol === '^') value = this.renderInverted(token, context, partials, originalTemplate);
      else if (symbol === '>') value = this.renderPartial(token, context, partials, originalTemplate);
      else if (symbol === '&') value = this.unescapedValue(token, context);
      else if (symbol === 'name') value = this.escapedValue(token, context);
      else if (symbol === 'text') value = this.rawValue(token);

      if (value !== undefined)
        buffer += value;
    }

    return buffer;
  };

  Writer.prototype.renderSection = function renderSection (token, context, partials, originalTemplate) {
    var self = this;
    var buffer = '';
    var value = context.lookup(token[1]);

    // This function is used to render an arbitrary template
    // in the current context by higher-order sections.
    function subRender (template) {
      return self.render(template, context, partials);
    }

    if (!value) return;

    if (isArray(value)) {
      for (var j = 0, valueLength = value.length; j < valueLength; ++j) {
        buffer += this.renderTokens(token[4], context.push(value[j]), partials, originalTemplate);
      }
    } else if (typeof value === 'object' || typeof value === 'string' || typeof value === 'number') {
      buffer += this.renderTokens(token[4], context.push(value), partials, originalTemplate);
    } else if (isFunction(value)) {
      if (typeof originalTemplate !== 'string')
        throw new Error('Cannot use higher-order sections without the original template');

      // Extract the portion of the original template that the section contains.
      value = value.call(context.view, originalTemplate.slice(token[3], token[5]), subRender);

      if (value != null)
        buffer += value;
    } else {
      buffer += this.renderTokens(token[4], context, partials, originalTemplate);
    }
    return buffer;
  };

  Writer.prototype.renderInverted = function renderInverted (token, context, partials, originalTemplate) {
    var value = context.lookup(token[1]);

    // Use JavaScript's definition of falsy. Include empty arrays.
    // See https://github.com/janl/mustache.js/issues/186
    if (!value || (isArray(value) && value.length === 0))
      return this.renderTokens(token[4], context, partials, originalTemplate);
  };

  Writer.prototype.renderPartial = function renderPartial (token, context, partials) {
    if (!partials) return;

    var value = isFunction(partials) ? partials(token[1]) : partials[token[1]];
    if (value != null)
      return this.renderTokens(this.parse(value), context, partials, value);
  };

  Writer.prototype.unescapedValue = function unescapedValue (token, context) {
    var value = context.lookup(token[1]);
    if (value != null)
      return value;
  };

  Writer.prototype.escapedValue = function escapedValue (token, context) {
    var value = context.lookup(token[1]);
    if (value != null)
      return mustache.escape(value);
  };

  Writer.prototype.rawValue = function rawValue (token) {
    return token[1];
  };

  mustache.name = 'mustache.js';
  mustache.version = '2.3.0';
  mustache.tags = [ '{{', '}}' ];

  // All high-level mustache.* functions use this writer.
  var defaultWriter = new Writer();

  /**
   * Clears all cached templates in the default writer.
   */
  mustache.clearCache = function clearCache () {
    return defaultWriter.clearCache();
  };

  /**
   * Parses and caches the given template in the default writer and returns the
   * array of tokens it contains. Doing this ahead of time avoids the need to
   * parse templates on the fly as they are rendered.
   */
  mustache.parse = function parse (template, tags) {
    return defaultWriter.parse(template, tags);
  };

  /**
   * Renders the `template` with the given `view` and `partials` using the
   * default writer.
   */
  mustache.render = function render (template, view, partials) {
    if (typeof template !== 'string') {
      throw new TypeError('Invalid template! Template should be a "string" ' +
                          'but "' + typeStr(template) + '" was given as the first ' +
                          'argument for mustache#render(template, view, partials)');
    }

    return defaultWriter.render(template, view, partials);
  };

  // This is here for backwards compatibility with 0.4.x.,
  /*eslint-disable */ // eslint wants camel cased function name
  mustache.to_html = function to_html (template, view, partials, send) {
    /*eslint-enable*/

    var result = mustache.render(template, view, partials);

    if (isFunction(send)) {
      send(result);
    } else {
      return result;
    }
  };

  // Export the escaping function so that the user may override it.
  // See https://github.com/janl/mustache.js/issues/244
  mustache.escape = escapeHtml;

  // Export these mainly for testing, but also for advanced usage.
  mustache.Scanner = Scanner;
  mustache.Context = Context;
  mustache.Writer = Writer;

  return mustache;
}));

/**
 * @app ReadMoreJS
 * @desc Breaks the content of an element to the specified number of words
 * @version 1.0.0
 * @license The MIT License (MIT)
 * @author George Raptis | http://georap.gr
 */
(function (win, doc, undef) {
	'use strict';
	var RM = {};
	RM.helpers = {
		extendObj: function () {
			for (var i = 1, l = arguments.length; i < l; i++) {
				for (var key in arguments[i]) {
					if (arguments[i].hasOwnProperty(key)) {
						if (arguments[i][key] && arguments[i][key].constructor && arguments[i][key].constructor === Object) {
							arguments[0][key] = arguments[0][key] || {};
							this.extendObj(arguments[0][key], arguments[i][key]);
						} else {
							arguments[0][key] = arguments[i][key];
						}
					}
				}
			}
			return arguments[0];
		}
	};
	RM.countWords = function (str) {
		return str.split(/\s+/).length;
	};
	RM.generateTrimmed = function (str, wordsNum) {
		return str.split(/\s+/).slice(0, wordsNum).join(' ') + '...';
	};
	RM.init = function (options) {
		var defaults = {
			target: '',
			numOfWords: 50,
			toggle: true,
			moreLink: 'read more...',
			lessLink: 'read less'
		};
		options = RM.helpers.extendObj({}, defaults, options);
		var target = doc.querySelectorAll(options.target),
		targetLen = target.length,
		targetContent,
		trimmedTargetContent,
		targetContentWords,
		initArr = [],
		trimmedArr = [],
		i,
		j,
		l,
		moreContainer,
		rmLink,
		moreLinkID,
		index;
		for (i = 0; i < targetLen; i++) {
			targetContent = target[i].innerHTML;
			trimmedTargetContent = RM.generateTrimmed(targetContent, options.numOfWords);
			targetContentWords = RM.countWords(targetContent);
			initArr.push(targetContent);
			trimmedArr.push(trimmedTargetContent);
			if (options.numOfWords < targetContentWords - 1) {
				target[i].innerHTML = trimmedArr[i];
				if (options.inline) {
					moreContainer = doc.createElement('span');
				} else {
					if (options.customBlockElement) {
						moreContainer = doc.createElement(options.customBlockElement);
					} else {
						moreContainer = doc.createElement('div');
					}
				}
				moreContainer.innerHTML = '<a id="rm-more_' +
					i +
					'" class="rm-link" style="cursor:pointer;">' +
					options.moreLink +
					'</a>';
				if (options.inline) {
					target[i].appendChild(moreContainer);
				} else {
					target[i].parentNode.insertBefore(moreContainer, target[i].nextSibling);
				}
			}
		}
		rmLink = doc.querySelectorAll('.rm-link');
		var func = function () {
			moreLinkID = this.getAttribute('id');
			index = moreLinkID.split('_')[1];
			if (this.getAttribute('data-clicked') !== 'true') {
				target[index].innerHTML = initArr[index];
				if (options.toggle !== false) {
					this.innerHTML = options.lessLink;
					this.setAttribute('data-clicked', true);
				} else {
					this.innerHTML = '';
				}
			} else {
				target[index].innerHTML = trimmedArr[index];
				this.innerHTML = options.moreLink;
				this.setAttribute('data-clicked', false);
			}
		};
		for (j = 0, l = rmLink.length; j < l; j++) {
			rmLink[j].onclick = func;
		}
	};
	window.$readMoreJS = RM;
})(this, this.document);

/*!
 * A small javascript library for ripples
 * /Written by Aaron Längert
 * @see {@link https://github.com/SirBaaron/ripple-js}
 * replaced eval with workaround
 * moved functions away from for loop
 * == to ===
 * added is binded ripple class to avoid multiple assignments
 * moved some functions higher
 * passes jshint
 */
(function (root, document) {
	"use strict";
	var ripple = (function () {
		function getRippleContainer(el) {
			var childs = el.childNodes;
			for (var ii = 0; ii < childs.length; ii++) {
				try {
					/* if (childs[ii].className.indexOf("rippleContainer") > -1) { */
					if (childs[ii].classList.contains("rippleContainer")) {
						return childs[ii];
					}
				} catch (err) {}
			}
			return el;
		}
		function rippleStart(e) {
			var rippleContainer = getRippleContainer(e.target);
			/* if ((rippleContainer.getAttribute("animating") === "0" || !rippleContainer.hasAttribute("animating")) && e.target.className.indexOf("ripple") > -1) { */
			if ((rippleContainer.getAttribute("animating") === "0" || !rippleContainer.hasAttribute("animating")) && e.target.classList.contains("ripple")) {
				rippleContainer.setAttribute("animating", "1");
				var offsetX = typeof e.offsetX === "number" ? e.offsetX : e.touches[0].clientX - e.target.getBoundingClientRect().left;
				var offsetY = typeof e.offsetY === "number" ? e.offsetY : e.touches[0].clientY - e.target.getBoundingClientRect().top;
				var fullCoverRadius = Math.max(Math.sqrt(Math.pow(offsetX, 2) + Math.pow(offsetY, 2)), Math.sqrt(Math.pow(e.target.clientWidth - offsetX, 2) + Math.pow(e.target.clientHeight - offsetY, 2)), Math.sqrt(Math.pow(offsetX, 2) + Math.pow(e.target.clientHeight - offsetY, 2)), Math.sqrt(Math.pow(offsetY, 2) + Math.pow(e.target.clientWidth - offsetX, 2)));
				var expandTime = e.target.getAttribute("ripple-press-expand-time") || 3;
				rippleContainer.style.transition = "transform " + expandTime + "s ease-out, box-shadow 0.1s linear";
				rippleContainer.style.background = e.target.getAttribute("ripple-color") || "white";
				rippleContainer.style.opacity = e.target.getAttribute("ripple-opacity") || "0.6";
				rippleContainer.style.boxShadow = e.target.getAttribute("ripple-shadow") || "none";
				rippleContainer.style.top = offsetY + "px";
				rippleContainer.style.left = offsetX + "px";
				rippleContainer.style.transform = "translate(-50%, -50%) scale(" + fullCoverRadius / 100 + ")";
			}
		}
		function rippleEnd(e) {
			var rippleContainer = getRippleContainer(e.target);
			if (rippleContainer.getAttribute("animating") === "1") {
				rippleContainer.setAttribute("animating", "2");
				var background = root.getComputedStyle(rippleContainer, null).getPropertyValue("background");
				var destinationRadius = e.target.clientWidth + e.target.clientHeight;
				rippleContainer.style.transition = "none";
				var expandTime = e.target.getAttribute("ripple-release-expand-time") || 0.4;
				rippleContainer.style.transition = "transform " + expandTime + "s linear, background " + expandTime + "s linear, opacity " + expandTime + "s ease-in-out";
				rippleContainer.style.transform = "translate(-50%, -50%) scale(" + destinationRadius / 100 + ")";
				rippleContainer.style.background = "radial-gradient(transparent 10%, " + background + " 40%)";
				rippleContainer.style.opacity = "0";
				e.target.dispatchEvent(new CustomEvent("ripple-button-click", {
						target: e.target
					}));
				var Fn = Function;
				new Fn("" + e.target.getAttribute("onrippleclick")).call(root);
			}
		}
		function rippleRetrieve(e) {
			var rippleContainer = getRippleContainer(e.target);
			if (rippleContainer.style.transform === "translate(-50%, -50%) scale(0)") {
				rippleContainer.setAttribute("animating", "0");
			}
			if (rippleContainer.getAttribute("animating") === "1") {
				rippleContainer.setAttribute("animating", "3");
				var collapseTime = e.target.getAttribute("ripple-leave-collapse-time") || 0.4;
				rippleContainer.style.transition = "transform " + collapseTime + "s linear, box-shadow " + collapseTime + "s linear";
				rippleContainer.style.boxShadow = "none";
				rippleContainer.style.transform = "translate(-50%, -50%) scale(0)";
			}
		}
		var ripple = {
			registerRipples: function () {
				var rippleButtons = document.getElementsByClassName("ripple");
				var i;
				var fn1 = function () {
					rippleButtons[i].addEventListener("touchstart", function (e) {
						rippleStart(e);
					}, {
						passive: true
					});
					rippleButtons[i].addEventListener("touchmove", function (e) {
						if (e.target.hasAttribute("ripple-cancel-on-move")) {
							rippleRetrieve(e);
							return;
						}
						var overEl;
						try {
							/* overEl = document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY).className.indexOf("ripple") >= 0; */
							overEl = document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY).classList.contains("ripple");
						} catch (err) {
							overEl = false;
						}
						if (!overEl) {
							rippleRetrieve(e);
						}
					}, {
						passive: true
					});
					rippleButtons[i].addEventListener("touchend", function (e) {
						rippleEnd(e);
					}, {
						passive: true
					});
					rippleButtons[i].addEventListener("mousedown", function (e) {
						rippleStart(e);
					}, {
						passive: true
					});
					rippleButtons[i].addEventListener("mouseup", function (e) {
						rippleEnd(e);
					}, {
						passive: true
					});
					rippleButtons[i].addEventListener("mousemove", function (e) {
						if (e.target.hasAttribute("ripple-cancel-on-move") && (e.movementX !== 0 || e.movementY !== 0)) {
							rippleRetrieve(e);
						}
					}, {
						passive: true
					});
					rippleButtons[i].addEventListener("mouseleave", function (e) {
						rippleRetrieve(e);
					}, {
						passive: true
					});
					rippleButtons[i].addEventListener("transitionend", function (e) {
						if (e.target.getAttribute("animating") === "2" || e.target.getAttribute("animating") === "3") {
							e.target.style.transition = "none";
							e.target.style.transform = "translate(-50%, -50%) scale(0)";
							e.target.style.boxShadow = "none";
							e.target.setAttribute("animating", "0");
						}
					}, {
						passive: true
					});
					if (getRippleContainer(rippleButtons[i]) === rippleButtons[i]) {
						rippleButtons[i].innerHTML += '<div class="rippleContainer"></div>';
					}
				};
				for (i = 0; i < rippleButtons.length; i++) {
					var isBindedRippleClass = "is-binded-ripple";
					if (!rippleButtons[i].classList.contains(isBindedRippleClass)) {
						rippleButtons[i].classList.add(isBindedRippleClass);
						fn1();
					}
				}
			},
			ripple: function (el) {
				/* if (el.className.indexOf("ripple") < 0) { */
				if (!el.classList.contains("ripple")) {
					return;
				}
				var rect = el.getBoundingClientRect();
				var e = {
					target: el,
					offsetX: rect.width / 2,
					offsetY: rect.height / 2
				};
				rippleStart(e);
				rippleEnd(e);
			}
		};
		/* root.addEventListener("load", function () { */
			var css = document.createElement("style");
			css.type = "text/css";
			css.innerHTML = ".ripple { overflow: hidden !important; position: relative; } .ripple .rippleContainer { display: block; height: 200px !important; width: 200px !important; padding: 0px 0px 0px 0px; border-radius: 50%; position: absolute !important; top: 0px; left: 0px; transform: translate(-50%, -50%) scale(0); -webkit-transform: translate(-50%, -50%) scale(0); -ms-transform: translate(-50%, -50%) scale(0); background-color: transparent; } .ripple * {pointer-events: none !important;}";
			document.head.appendChild(css);
			ripple.registerRipples();
		/* }); */
		return ripple;
	})
	();
	root.ripple = ripple;
})("undefined" !== typeof window ? window : this, document);
