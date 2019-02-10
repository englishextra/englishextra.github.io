/*!
 * modified verge 1.9.1+201402130803
 * @see {@link https://github.com/ryanve/verge}
 * MIT License 2013 Ryan Van Etten
 * removed module
 * converted to dot notation
 * added &&r.left<=viewportW()&&(0!==el.offsetHeight);
 * added &&r.left<=viewportW()&&(0!==el.offsetHeight);
 * added &&r.top<=viewportH()&&(0!==el.offsetHeight);
 * Substitute inViewport with: inY on vertical sites, inX on horizontal ones.
 * On pages without horizontal scroll, inX is always true.
 * On pages without vertical scroll, inY is always true.
 * If the viewport width is >= the document width, then inX is always true.
 * bug: inViewport returns true if element is hidden
 * @see {@link https://github.com/ryanve/verge/issues/19}
 * @see {@link https://github.com/ryanve/verge/blob/master/verge.js}
 * passes jshint
 */
(function(root) {
	"use strict";

	var verge = (function() {
		var xports = {},
			win = typeof root !== "undefined" && root,
			doc = typeof document !== "undefined" && document,
			docElem = doc && doc.documentElement,
			matchMedia = win.matchMedia || win.msMatchMedia,
			mq = matchMedia
				? function(q) {
						return !!matchMedia.call(win, q).matches;
				  }
				: function() {
						return false;
				  },
			viewportW = (xports.viewportW = function() {
				var a = docElem.clientWidth,
					b = win.innerWidth;
				return a < b ? b : a;
			}),
			viewportH = (xports.viewportH = function() {
				var a = docElem.clientHeight,
					b = win.innerHeight;
				return a < b ? b : a;
			});

		xports.mq = mq;
		xports.matchMedia = matchMedia
			? function() {
					return matchMedia.apply(win, arguments);
			  }
			: function() {
					return {};
			  };

		function viewport() {
			return {
				width: viewportW(),
				height: viewportH()
			};
		}

		xports.viewport = viewport;

		xports.scrollX = function() {
			return win.pageXOffset || docElem.scrollLeft;
		};

		xports.scrollY = function() {
			return win.pageYOffset || docElem.scrollTop;
		};

		function calibrate(coords, cushion) {
			var o = {};
			cushion = +cushion || 0;
			o.width =
				(o.right = coords.right + cushion) -
				(o.left = coords.left - cushion);
			o.height =
				(o.bottom = coords.bottom + cushion) -
				(o.top = coords.top - cushion);
			return o;
		}

		function rectangle(el, cushion) {
			el = el && !el.nodeType ? el[0] : el;

			if (!el || 1 !== el.nodeType) {
				return false;
			}

			return calibrate(el.getBoundingClientRect(), cushion);
		}

		xports.rectangle = rectangle;

		function aspect(o) {
			o = null === o ? viewport() : 1 === o.nodeType ? rectangle(o) : o;
			var h = o.height,
				w = o.width;
			h = typeof h === "function" ? h.call(o) : h;
			w = typeof w === "function" ? w.call(o) : w;
			return w / h;
		}

		xports.aspect = aspect;

		xports.inX = function(el, cushion) {
			var r = rectangle(el, cushion);
			return (
				!!r &&
				r.right >= 0 &&
				r.left <= viewportW() &&
				0 !== el.offsetHeight
			);
		};

		xports.inY = function(el, cushion) {
			var r = rectangle(el, cushion);
			return (
				!!r &&
				r.bottom >= 0 &&
				r.top <= viewportH() &&
				0 !== el.offsetHeight
			);
		};

		xports.inViewport = function(el, cushion) {
			var r = rectangle(el, cushion);
			return (
				!!r &&
				r.bottom >= 0 &&
				r.right >= 0 &&
				r.top <= viewportH() &&
				r.left <= viewportW() &&
				0 !== el.offsetHeight
			);
		};

		return xports;
	})();

	root.verge = verge;
})("undefined" !== typeof window ? window : this);

/*!
 * @see {@link https://github.com/englishextra/iframe-lightbox}
 * modified Simple lightbox effect in pure JS
 * @see {@link https://github.com/squeral/lightbox}
 * @see {@link https://github.com/squeral/lightbox/blob/master/lightbox.js}
 * @params {Object} elem Node element
 * @params {Object} settings object
 * el.lightbox = new IframeLightbox(elem, settings)
 * passes jshint
 */

/*jshint -W014 */
(function(root, document) {
	"use strict";

	var docElem = document.documentElement || "";
	var docBody = document.body || "";
	var appendChild = "appendChild";
	var classList = "classList";
	var createElement = "createElement";
	var dataset = "dataset";
	var getAttribute = "getAttribute";
	var getElementById = "getElementById";
	var getElementsByClassName = "getElementsByClassName";
	var innerHTML = "innerHTML";
	var setAttribute = "setAttribute";
	var _addEventListener = "addEventListener";
	var containerClass = "iframe-lightbox";
	var iframeLightboxWindowIsBindedClass = "iframe-lightbox-window--is-binded";
	var iframeLightboxOpenClass = "iframe-lightbox--open";
	var iframeLightboxLinkIsBindedClass = "iframe-lightbox-link--is-binded";
	var isLoadedClass = "is-loaded";
	var isOpenedClass = "is-opened";
	var isShowingClass = "is-showing";
	var isMobile = navigator.userAgent.match(
		/(iPad)|(iPhone)|(iPod)|(Android)|(PlayBook)|(BB10)|(BlackBerry)|(Opera Mini)|(IEMobile)|(webOS)|(MeeGo)/i
	);
	var isTouch =
		isMobile !== null ||
		document.createTouch !== undefined ||
		"ontouchstart" in root ||
		"onmsgesturechange" in root ||
		navigator.msMaxTouchPoints;

	var IframeLightbox = function IframeLightbox(elem, settings) {
		var options = settings || {};
		this.trigger = elem;
		this.el = document[getElementsByClassName](containerClass)[0] || "";
		this.body = this.el ? this.el[getElementsByClassName]("body")[0] : "";
		this.content = this.el
			? this.el[getElementsByClassName]("content")[0]
			: "";
		this.src = elem[dataset].src || "";
		this.href = elem[getAttribute]("href") || "";
		this.dataPaddingBottom = elem[dataset].paddingBottom || "";
		this.dataScrolling = elem[dataset].scrolling || "";
		this.dataTouch = elem[dataset].touch || "";
		this.rate = options.rate || 500;
		this.scrolling = options.scrolling;
		this.touch = options.touch;
		this.onOpened = options.onOpened;
		this.onIframeLoaded = options.onIframeLoaded;
		this.onLoaded = options.onLoaded;
		this.onCreated = options.onCreated;
		this.onClosed = options.onClosed;
		this.init();
	};

	IframeLightbox.prototype.init = function() {
		var _this = this;

		if (!this.el) {
			this.create();
		}

		var debounce = function debounce(func, wait) {
			var timeout, args, context, timestamp;
			return function() {
				context = this;
				args = [].slice.call(arguments, 0);
				timestamp = new Date();

				var later = function later() {
					var last = new Date() - timestamp;

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

		var logic = function () {
			_this.open();
		};

		var handleIframeLightboxLink = function (e) {
			e.stopPropagation();
			e.preventDefault();
			debounce(logic, this.rate).call();
		};
		if (!this.trigger[classList].contains(iframeLightboxLinkIsBindedClass)) {
			this.trigger[classList].add(iframeLightboxLinkIsBindedClass);
			this.trigger[_addEventListener]("click", handleIframeLightboxLink);
			if (isTouch && (_this.touch || _this.dataTouch)) {
				this.trigger[_addEventListener]("touchstart", handleIframeLightboxLink);
			}
		}
	};

	IframeLightbox.prototype.create = function() {
		var _this = this,
		backdrop = document[createElement]("div");
		backdrop[classList].add("backdrop");
		this.el = document[createElement]("div");
		this.el[classList].add(containerClass);
		this.el[appendChild](backdrop);
		this.content = document[createElement]("div");
		this.content[classList].add("content");
		this.body = document[createElement]("div");
		this.body[classList].add("body");
		this.content[appendChild](this.body);
		this.contentHolder = document[createElement]("div");
		this.contentHolder[classList].add("content-holder");
		this.contentHolder[appendChild](this.content);
		this.el[appendChild](this.contentHolder);
		this.btnClose = document[createElement]("a");
		this.btnClose[classList].add("btn-close");
		/* jshint -W107 */

		this.btnClose[setAttribute]("href", "javascript:void(0);");
		/* jshint +W107 */

		this.el[appendChild](this.btnClose);
		docBody[appendChild](this.el);

		backdrop[_addEventListener]("click", function() {
			_this.close();
		});

		this.btnClose[_addEventListener]("click", function () {
			_this.close();
		});
		if (!docElem[classList].contains(iframeLightboxWindowIsBindedClass)) {
			docElem[classList].add(iframeLightboxWindowIsBindedClass);
			root[_addEventListener]("keyup", function (ev) {
				if (27 === (ev.which || ev.keyCode)) {
					_this.close();
				}
			});
		}

		var clearBody = function clearBody() {
			if (_this.isOpen()) {
				return;
			}

			_this.el[classList].remove(isShowingClass);

			_this.body[innerHTML] = "";
		};

		this.el[_addEventListener]("transitionend", clearBody, false);

		this.el[_addEventListener]("webkitTransitionEnd", clearBody, false);

		this.el[_addEventListener]("mozTransitionEnd", clearBody, false);

		this.el[_addEventListener]("msTransitionEnd", clearBody, false);

		this.callCallback(this.onCreated, this);
	};

	IframeLightbox.prototype.loadIframe = function() {
		var _this = this;

		this.iframeId = containerClass + Date.now();
		this.iframeSrc = this.src || this.href || "";
		var html = [];
		html.push(
			'<iframe src="' +
				this.iframeSrc +
				'" name="' +
				this.iframeId +
				'" id="' +
				this.iframeId +
				'" onload="this.style.opacity=1;" style="opacity:0;border:none;" webkitallowfullscreen="true" mozallowfullscreen="true" allowfullscreen="true" height="166" frameborder="no"></iframe>'
		);
		html.push(
			'<div class="half-circle-spinner"><div class="circle circle-1"></div><div class="circle circle-2"></div></div>'
		);
		this.body[innerHTML] = html.join("");

		(function(iframeId, body) {
			var iframe = document[getElementById](iframeId);

			iframe.onload = function() {
				this.style.opacity = 1;
				body[classList].add(isLoadedClass);

				if (_this.scrolling || _this.dataScrolling) {
					iframe.removeAttribute("scrolling");
					iframe.style.overflow = "scroll";
				} else {
					iframe[setAttribute]("scrolling", "no");
					iframe.style.overflow = "hidden";
				}

				_this.callCallback(_this.onIframeLoaded, _this);

				_this.callCallback(_this.onLoaded, _this);
			};
		})(this.iframeId, this.body);
	};

	IframeLightbox.prototype.open = function() {
		this.loadIframe();

		if (this.dataPaddingBottom) {
			this.content.style.paddingBottom = this.dataPaddingBottom;
		} else {
			this.content.removeAttribute("style");
		}

		this.el[classList].add(isShowingClass);
		this.el[classList].add(isOpenedClass);
		docElem[classList].add(iframeLightboxOpenClass);
		docBody[classList].add(iframeLightboxOpenClass);
		this.callCallback(this.onOpened, this);
	};
	IframeLightbox.prototype.close = function () {
		this.el[classList].remove(isOpenedClass);
		this.body[classList].remove(isLoadedClass);
		docElem[classList].remove(iframeLightboxOpenClass);
		docBody[classList].remove(iframeLightboxOpenClass);
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

/*!
 * @see {@link https://github.com/englishextra/img-lightbox}
 * imgLightbox
 * requires this very img-lightbox.js, and animate.css, img-lightbox.css
 * @params {String} linkClass
 * @params {Object} settings object
 * imgLightbox(linkClass, settings)
 * passes jshint
 */

/*jshint -W014 */
(function(root, document) {
	"use strict";

	var docElem = document.documentElement || "";
	var docBody = document.body || "";
	var animatedClass = "animated";
	var appendChild = "appendChild";
	var classList = "classList";
	var createElement = "createElement";
	var getAttribute = "getAttribute";
	var getElementsByClassName = "getElementsByClassName";
	var getElementsByTagName = "getElementsByTagName";
	var innerHTML = "innerHTML";
	var style = "style";
	var _addEventListener = "addEventListener";
	var _length = "length";
	var btnCloseClass = "btn-close";
	var containerClass = "img-lightbox";
	var fadeInClass = "fadeIn";
	var fadeInUpClass = "fadeInUp";
	var fadeOutClass = "fadeOut";
	var fadeOutDownClass = "fadeOutDown";
	var imgLightboxWindowIsBindedClass = "img-lightbox-window--is-binded";
	var imgLightboxOpenClass = "img-lightbox--open";
	var imgLightboxLinkIsBindedClass = "img-lightbox-link--is-binded";
	var isLoadedClass = "is-loaded";
	var dummySrc =
		"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
	var isMobile = navigator.userAgent.match(
		/(iPad)|(iPhone)|(iPod)|(Android)|(PlayBook)|(BB10)|(BlackBerry)|(Opera Mini)|(IEMobile)|(webOS)|(MeeGo)/i
	);
	var isTouch =
		isMobile !== null ||
		document.createTouch !== undefined ||
		"ontouchstart" in root ||
		"onmsgesturechange" in root ||
		navigator.msMaxTouchPoints;

	var debounce = function debounce(func, wait) {
		var timeout;
		var args;
		var context;
		var timestamp;
		return function() {
			context = this;
			args = [].slice.call(arguments, 0);
			timestamp = new Date();

			var later = function later() {
				var last = new Date() - timestamp;

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

	var callCallback = function (func, data) {
		if (typeof func !== "function") {
			return;
		}
		var caller = func.bind(this);
		caller(data);
	};
		var setStyleDisplayBlock = function (a) {
			if (a) {
				a[style].display = "block";
			}
		};

		var setStyleDisplayNone = function (a) {
			if (a) {
				a[style].display = "none";
			}
		};
	var hideImgLightbox = function (callback) {
		var container = document[getElementsByClassName](containerClass)[0] || "";
		var img = container ? container[getElementsByTagName]("img")[0] || "" : "";
		var hideContainer = function () {
			container[classList].remove(fadeInClass);
			container[classList].add(fadeOutClass);
			var hideImg = function () {
				container[classList].remove(animatedClass);
				container[classList].remove(fadeOutClass);
				img[classList].remove(animatedClass);
				img[classList].remove(fadeOutDownClass);
				img.onload = function () {
					container[classList].remove(isLoadedClass);
				};
				img.src = dummySrc;
				setStyleDisplayNone(container);
				callCallback(callback, root);
			};
			var timer = setTimeout(function () {
					clearTimeout(timer);
					timer = null;
					hideImg();
				}, 400);
		};
		if (container && img) {
			img[classList].remove(fadeInUpClass);
			img[classList].add(fadeOutDownClass);
			var timer = setTimeout(function () {
					clearTimeout(timer);
					timer = null;
					hideContainer();
				}, 400);
		}
		docElem[classList].remove(imgLightboxOpenClass);
		docBody[classList].remove(imgLightboxOpenClass);
	};

	var imgLightbox = function imgLightbox(linkClass, settings) {
		var _linkClass = linkClass || "";

		var options = settings || {};
		var rate = options.rate || 500;
		var touch = options.touch;
		var onError = options.onError;
		var onLoaded = options.onLoaded;
		var onCreated = options.onCreated;
		var onClosed = options.onClosed;
		var link = document[getElementsByClassName](_linkClass) || "";
		var container = document[getElementsByClassName](containerClass)[0] || "";
		var img = container ? container[getElementsByTagName]("img")[0] || "" : "";
		if (!container) {
			container = document[createElement]("div");
			container[classList].add(containerClass);
			var html = [];
			html.push('<img src="' + dummySrc + '" alt="" />');
			html.push('<div class="half-circle-spinner"><div class="circle circle-1"></div><div class="circle circle-2"></div></div>');
			html.push('<a href="javascript:void(0);" class="btn-close"></a>');
			container[innerHTML] = html.join("");
			docBody[appendChild](container);
			img = container ? container[getElementsByTagName]("img")[0] || "" : "";
			var btnClose = container ? container[getElementsByClassName](btnCloseClass)[0] || "" : "";

			var handleImgLightboxContainer = function handleImgLightboxContainer() {
				hideImgLightbox(onClosed);
			};

			container[_addEventListener]("click", handleImgLightboxContainer);

			btnClose[_addEventListener]("click", handleImgLightboxContainer);
			if (!docElem[classList].contains(imgLightboxWindowIsBindedClass)) {
				docElem[classList].add(imgLightboxWindowIsBindedClass);
				root[_addEventListener]("keyup", function (ev) {
					if (27 === (ev.which || ev.keyCode)) {
						hideImgLightbox(onClosed);
					}
				});
			}
		}

		var arrange = function arrange(e) {
			var hrefString =
				e[getAttribute]("href") || e[getAttribute]("data-src") || "";
			var dataTouch = e[getAttribute]("data-touch") || "";

			if (!hrefString) {
				return;
			}

			var handleImgLightboxLink = function (ev) {
				ev.stopPropagation();
				ev.preventDefault();
				docElem[classList].add(imgLightboxOpenClass);
				docBody[classList].add(imgLightboxOpenClass);
				container[classList].remove(isLoadedClass);
				var logic = function logic() {
					if (onCreated) {
						callCallback(onCreated, root);
					}
					container[classList].add(animatedClass);
					container[classList].add(fadeInClass);
					img[classList].add(animatedClass);
					img[classList].add(fadeInUpClass);
					img.onload = function () {
						container[classList].add(isLoadedClass);
						if (onLoaded) {
							callCallback(onLoaded, root);
						}
					};
					img.onerror = function () {
						if (onError) {
							callCallback(onError, root);
						}
					};
					img.src = hrefString;
					setStyleDisplayBlock(container);
				};
				debounce(logic, rate).call();
			};
			if (!e[classList].contains(imgLightboxLinkIsBindedClass)) {
				e[classList].add(imgLightboxLinkIsBindedClass);
				e[_addEventListener]("click", handleImgLightboxLink);
				if (isTouch && (touch || dataTouch)) {
					e[_addEventListener]("touchstart", handleImgLightboxLink);
				}
			}
		};

		if (container && img && link) {
			var i, l;

			for (i = 0, l = link[_length]; i < l; i += 1) {
				arrange(link[i]);
			}

			i = l = null;
		}
	};

	root.imgLightbox = imgLightbox;
})("undefined" !== typeof window ? window : this, document);

/*global jQuery */

/*!
 * Super lightweight script (~1kb) to detect via Javascript events like
 * 'tap' 'dbltap' "swipeup" "swipedown" "swipeleft" "swiperight"
 * on any kind of device.
 * Version: 2.0.1
 * Author: Gianluca Guarini
 * Contact: gianluca.guarini@gmail.com
 * Website: http://www.gianlucaguarini.com/
 * Twitter: @gianlucaguarini
 * Copyright (c) Gianluca Guarini
 * @see {@link https://github.com/GianlucaGuarini/Tocca.js/blob/master/Tocca.js}
 * passes jshint
 */
(function(doc, win) {
	"use strict";

	if (typeof doc.createEvent !== "function") {
		return false;
	}

	var tapNum = 0,
		pointerId,
		currX,
		currY,
		cachedX,
		cachedY,
		timestamp,
		target,
		dblTapTimer,
		longtapTimer;

	var pointerEventSupport = function pointerEventSupport(type) {
			var lo = type.toLowerCase(),
				ms = "MS" + type;
			return navigator.msPointerEnabled
				? ms
				: window.PointerEvent
				? lo
				: "";
		},
		defaults = {
			useJquery: !win.IGNORE_JQUERY && typeof jQuery !== "undefined",
			swipeThreshold: win.SWIPE_THRESHOLD || 100,
			tapThreshold: win.TAP_THRESHOLD || 150,
			dbltapThreshold: win.DBL_TAP_THRESHOLD || 200,
			longtapThreshold: win.LONG_TAP_THRESHOLD || 1000,
			tapPrecision: win.TAP_PRECISION / 2 || 60 / 2,
			justTouchEvents: win.JUST_ON_TOUCH_DEVICES
		},
		wasTouch = false,
		touchevents = {
			touchstart: pointerEventSupport("PointerDown") || "touchstart",
			touchend: pointerEventSupport("PointerUp") + " touchend",
			touchmove: pointerEventSupport("PointerMove") + " touchmove"
		},
		isTheSameFingerId = function isTheSameFingerId(e) {
			return (
				!e.pointerId ||
				typeof pointerId === "undefined" ||
				e.pointerId === pointerId
			);
		},
		setListener = function setListener(elm, events, callback) {
			var eventsArray = events.split(" "),
				i = eventsArray.length;

			while (i--) {
				elm.addEventListener(eventsArray[i], callback, false);
			}
		},
		getPointerEvent = function getPointerEvent(event) {
			return event.targetTouches ? event.targetTouches[0] : event;
		},
		getTimestamp = function getTimestamp() {
			return new Date().getTime();
		},
		sendEvent = function sendEvent(elm, eventName, originalEvent, data) {
			var customEvent = doc.createEvent("Event");
			customEvent.originalEvent = originalEvent;
			data = data || {};
			data.x = currX;
			data.y = currY;
			data.distance = data.distance;

			if (defaults.useJquery) {
				customEvent = jQuery.Event(eventName, {
					originalEvent: originalEvent
				});
				jQuery(elm).trigger(customEvent, data);
			}

			if (customEvent.initEvent) {
				for (var key in data) {
					if (data.hasOwnProperty(key)) {
						customEvent[key] = data[key];
					}
				}

				customEvent.initEvent(eventName, true, true);
				elm.dispatchEvent(customEvent);
			}

			while (elm) {
				if (elm["on" + eventName]) {
					elm["on" + eventName](customEvent);
				}

				elm = elm.parentNode;
			}
		},
		onTouchStart = function onTouchStart(e) {
			if (!isTheSameFingerId(e)) {
				return;
			}

			var isMousedown = e.type === "mousedown";
			wasTouch = !isMousedown;
			pointerId = e.pointerId;

			if (e.type === "mousedown" && wasTouch) {
				return;
			}

			var pointer = getPointerEvent(e);
			cachedX = currX = pointer.pageX;
			cachedY = currY = pointer.pageY;
			longtapTimer = setTimeout(function() {
				sendEvent(e.target, "longtap", e);
				target = e.target;
			}, defaults.longtapThreshold);
			timestamp = getTimestamp();
			tapNum++;
		},
		onTouchEnd = function onTouchEnd(e) {
			if (!isTheSameFingerId(e)) {
				return;
			}

			pointerId = undefined;

			if (e.type === "mouseup" && wasTouch) {
				wasTouch = false;
				return;
			}

			var eventsArr = [],
				now = getTimestamp(),
				deltaY = cachedY - currY,
				deltaX = cachedX - currX;
			clearTimeout(dblTapTimer);
			clearTimeout(longtapTimer);

			if (deltaX <= -defaults.swipeThreshold) {
				eventsArr.push("swiperight");
			}

			if (deltaX >= defaults.swipeThreshold) {
				eventsArr.push("swipeleft");
			}

			if (deltaY <= -defaults.swipeThreshold) {
				eventsArr.push("swipedown");
			}

			if (deltaY >= defaults.swipeThreshold) {
				eventsArr.push("swipeup");
			}

			if (eventsArr.length) {
				for (var i = 0; i < eventsArr.length; i++) {
					var eventName = eventsArr[i];
					sendEvent(e.target, eventName, e, {
						distance: {
							x: Math.abs(deltaX),
							y: Math.abs(deltaY)
						}
					});
				}

				tapNum = 0;
			} else {
				if (
					cachedX >= currX - defaults.tapPrecision &&
					cachedX <= currX + defaults.tapPrecision &&
					cachedY >= currY - defaults.tapPrecision &&
					cachedY <= currY + defaults.tapPrecision
				) {
					if (timestamp + defaults.tapThreshold - now >= 0) {
						sendEvent(
							e.target,
							tapNum >= 2 && target === e.target
								? "dbltap"
								: "tap",
							e
						);
						target = e.target;
					}
				}

				dblTapTimer = setTimeout(function() {
					tapNum = 0;
				}, defaults.dbltapThreshold);
			}
		},
		onTouchMove = function onTouchMove(e) {
			if (!isTheSameFingerId(e)) {
				return;
			}

			if (e.type === "mousemove" && wasTouch) {
				return;
			}

			var pointer = getPointerEvent(e);
			currX = pointer.pageX;
			currY = pointer.pageY;
		};

	setListener(
		doc,
		touchevents.touchstart + (defaults.justTouchEvents ? "" : " mousedown"),
		onTouchStart
	);
	setListener(
		doc,
		touchevents.touchend + (defaults.justTouchEvents ? "" : " mouseup"),
		onTouchEnd
	);
	setListener(
		doc,
		touchevents.touchmove + (defaults.justTouchEvents ? "" : " mousemove"),
		onTouchMove
	);

	win.tocca = function(options) {
		for (var opt in options) {
			if (options.hasOwnProperty(opt)) {
				defaults[opt] = options[opt];
			}
		}

		return defaults;
	};
})(document, "undefined" !== typeof window ? window : this);

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
(function(root, document) {
	"use strict";

	var length = "length";
	var VERSIONS = [
		null,
		[[10, 7, 17, 13], [1, 1, 1, 1], []],
		[[16, 10, 28, 22], [1, 1, 1, 1], [4, 16]],
		[[26, 15, 22, 18], [1, 1, 2, 2], [4, 20]],
		[[18, 20, 16, 26], [2, 1, 4, 2], [4, 24]],
		[[24, 26, 22, 18], [2, 1, 4, 4], [4, 28]],
		[[16, 18, 28, 24], [4, 2, 4, 4], [4, 32]],
		[[18, 20, 26, 18], [4, 2, 5, 6], [4, 20, 36]],
		[[22, 24, 26, 22], [4, 2, 6, 6], [4, 22, 40]],
		[[22, 30, 24, 20], [5, 2, 8, 8], [4, 24, 44]],
		[[26, 18, 28, 24], [5, 4, 8, 8], [4, 26, 48]],
		[[30, 20, 24, 28], [5, 4, 11, 8], [4, 28, 52]],
		[[22, 24, 28, 26], [8, 4, 11, 10], [4, 30, 56]],
		[[22, 26, 22, 24], [9, 4, 16, 12], [4, 32, 60]],
		[[24, 30, 24, 20], [9, 4, 16, 16], [4, 24, 44, 64]],
		[[24, 22, 24, 30], [10, 6, 18, 12], [4, 24, 46, 68]],
		[[28, 24, 30, 24], [10, 6, 16, 17], [4, 24, 48, 72]],
		[[28, 28, 28, 28], [11, 6, 19, 16], [4, 28, 52, 76]],
		[[26, 30, 28, 28], [13, 6, 21, 18], [4, 28, 54, 80]],
		[[26, 28, 26, 26], [14, 7, 25, 21], [4, 28, 56, 84]],
		[[26, 28, 28, 30], [16, 8, 25, 20], [4, 32, 60, 88]],
		[[26, 28, 30, 28], [17, 8, 25, 23], [4, 26, 48, 70, 92]],
		[[28, 28, 24, 30], [17, 9, 34, 23], [4, 24, 48, 72, 96]],
		[[28, 30, 30, 30], [18, 9, 30, 25], [4, 28, 52, 76, 100]],
		[[28, 30, 30, 30], [20, 10, 32, 27], [4, 26, 52, 78, 104]],
		[[28, 26, 30, 30], [21, 12, 35, 29], [4, 30, 56, 82, 108]],
		[[28, 28, 30, 28], [23, 12, 37, 34], [4, 28, 56, 84, 112]],
		[[28, 30, 30, 30], [25, 12, 40, 34], [4, 32, 60, 88, 116]],
		[[28, 30, 30, 30], [26, 13, 42, 35], [4, 24, 48, 72, 96, 120]],
		[[28, 30, 30, 30], [28, 14, 45, 38], [4, 28, 52, 76, 100, 124]],
		[[28, 30, 30, 30], [29, 15, 48, 40], [4, 24, 50, 76, 102, 128]],
		[[28, 30, 30, 30], [31, 16, 51, 43], [4, 28, 54, 80, 106, 132]],
		[[28, 30, 30, 30], [33, 17, 54, 45], [4, 32, 58, 84, 110, 136]],
		[[28, 30, 30, 30], [35, 18, 57, 48], [4, 28, 56, 84, 112, 140]],
		[[28, 30, 30, 30], [37, 19, 60, 51], [4, 32, 60, 88, 116, 144]],
		[[28, 30, 30, 30], [38, 19, 63, 53], [4, 28, 52, 76, 100, 124, 148]],
		[[28, 30, 30, 30], [40, 20, 66, 56], [4, 22, 48, 74, 100, 126, 152]],
		[[28, 30, 30, 30], [43, 21, 70, 59], [4, 26, 52, 78, 104, 130, 156]],
		[[28, 30, 30, 30], [45, 22, 74, 62], [4, 30, 56, 82, 108, 134, 160]],
		[[28, 30, 30, 30], [47, 24, 77, 65], [4, 24, 52, 80, 108, 136, 164]],
		[[28, 30, 30, 30], [49, 25, 81, 68], [4, 28, 56, 84, 112, 140, 168]]
	];
	var MODE_TERMINATOR = 0;
	var MODE_NUMERIC = 1,
		MODE_ALPHANUMERIC = 2,
		MODE_OCTET = 4,
		MODE_KANJI = 8;
	var NUMERIC_REGEXP = /^\d*$/;
	var ALPHANUMERIC_REGEXP = /^[A-Za-z0-9 $%*+\-./:] * $ /;
	var ALPHANUMERIC_OUT_REGEXP = /^[A-Z0-9 $%*+\-./:] * $ /;
	var ECCLEVEL_L = 1,
		ECCLEVEL_M = 0,
		ECCLEVEL_Q = 3,
		ECCLEVEL_H = 2;
	var GF256_MAP = [],
		GF256_INVMAP = [-1];

	for (var i1 = 0, v = 1; i1 < 255; ++i1) {
		GF256_MAP.push(v);
		GF256_INVMAP[v] = i1;
		v = (v * 2) ^ (v >= 128 ? 0x11d : 0);
	}

	var GF256_GENPOLY = [[]];

	for (var i2 = 0; i2 < 30; ++i2) {
		var prevpoly = GF256_GENPOLY[i2],
			poly = [];

		for (var j1 = 0; j1 <= i2; ++j1) {
			var a = j1 < i2 ? GF256_MAP[prevpoly[j1]] : 0;
			var b = GF256_MAP[(i2 + (prevpoly[j1 - 1] || 0)) % 255];
			poly.push(GF256_INVMAP[a ^ b]);
		}

		GF256_GENPOLY.push(poly);
	}

	var ALPHANUMERIC_MAP = {};

	for (var i = 0; i < 45; ++i) {
		ALPHANUMERIC_MAP[
			"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:".charAt(i)
		] = i;
	}

	var MASKFUNCS = [
		function(i, j) {
			return (i + j) % 2 === 0;
		},
		function(i) {
			return i % 2 === 0;
		},
		function(i, j) {
			return j % 3 === 0;
		},
		function(i, j) {
			return (i + j) % 3 === 0;
		},
		function(i, j) {
			return (((i / 2) | 0) + ((j / 3) | 0)) % 2 === 0;
		},
		function(i, j) {
			return ((i * j) % 2) + ((i * j) % 3) === 0;
		},
		function(i, j) {
			return (((i * j) % 2) + ((i * j) % 3)) % 2 === 0;
		},
		function(i, j) {
			return (((i + j) % 2) + ((i * j) % 3)) % 2 === 0;
		}
	];

	var needsverinfo = function needsverinfo(ver) {
		return ver > 6;
	};

	var getsizebyver = function getsizebyver(ver) {
		return 4 * ver + 17;
	};

	var nfullbits = function nfullbits(ver) {
		var v = VERSIONS[ver];
		var nbits = 16 * ver * ver + 128 * ver + 64;

		if (needsverinfo(ver)) {
			nbits -= 36;
		}

		if (v[2][length]) {
			nbits -= 25 * v[2][length] * v[2][length] - 10 * v[2][length] - 55;
		}

		return nbits;
	};

	var ndatabits = function ndatabits(ver, ecclevel) {
		var nbits = nfullbits(ver) & ~7;
		var v = VERSIONS[ver];
		nbits -= 8 * v[0][ecclevel] * v[1][ecclevel];
		return nbits;
	};

	var ndatalenbits = function ndatalenbits(ver, mode) {
		switch (mode) {
			case MODE_NUMERIC:
				return ver < 10 ? 10 : ver < 27 ? 12 : 14;

			case MODE_ALPHANUMERIC:
				return ver < 10 ? 9 : ver < 27 ? 11 : 13;

			case MODE_OCTET:
				return ver < 10 ? 8 : 16;

			case MODE_KANJI:
				return ver < 10 ? 8 : ver < 27 ? 10 : 12;
		}
	};

	var getmaxdatalen = function getmaxdatalen(ver, mode, ecclevel) {
		var nbits = ndatabits(ver, ecclevel) - 4 - ndatalenbits(ver, mode);

		switch (mode) {
			case MODE_NUMERIC:
				return (
					((nbits / 10) | 0) * 3 +
					(nbits % 10 < 4 ? 0 : nbits % 10 < 7 ? 1 : 2)
				);

			case MODE_ALPHANUMERIC:
				return ((nbits / 11) | 0) * 2 + (nbits % 11 < 6 ? 0 : 1);

			case MODE_OCTET:
				return (nbits / 8) | 0;

			case MODE_KANJI:
				return (nbits / 13) | 0;
		}
	};

	var validatedata = function validatedata(mode, data) {
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

					for (var i = 0; i < data[length]; ++i) {
						var ch = data.charCodeAt(i);

						if (ch < 0x80) {
							newdata.push(ch);
						} else if (ch < 0x800) {
							newdata.push(0xc0 | (ch >> 6), 0x80 | (ch & 0x3f));
						} else if (ch < 0x10000) {
							newdata.push(
								0xe0 | (ch >> 12),
								0x80 | ((ch >> 6) & 0x3f),
								0x80 | (ch & 0x3f)
							);
						} else {
							newdata.push(
								0xf0 | (ch >> 18),
								0x80 | ((ch >> 12) & 0x3f),
								0x80 | ((ch >> 6) & 0x3f),
								0x80 | (ch & 0x3f)
							);
						}
					}

					return newdata;
				} else {
					return data;
				}
		}
	};

	var encode = function encode(ver, mode, data, maxbuflen) {
		var buf = [];
		var bits = 0,
			remaining = 8;
		var datalen = data[length];

		var pack = function pack(x, n) {
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

				pack(
					parseInt(data.substring(i - 2), 10),
					[0, 4, 7][datalen % 3]
				);
				break;

			case MODE_ALPHANUMERIC:
				for (var i2 = 1; i2 < datalen; i2 += 2) {
					pack(
						ALPHANUMERIC_MAP[data.charAt(i2 - 1)] * 45 +
							ALPHANUMERIC_MAP[data.charAt(i2)],
						11
					);
				}

				if (datalen % 2 === 1) {
					pack(ALPHANUMERIC_MAP[data.charAt(i2 - 1)], 6);
				}

				break;

			case MODE_OCTET:
				for (var i3 = 0; i3 < datalen; ++i3) {
					pack(data[i3], 8);
				}

				break;
		}

		pack(MODE_TERMINATOR, 4);

		if (remaining < 8) {
			buf.push(bits);
		}

		while (buf[length] + 1 < maxbuflen) {
			buf.push(0xec, 0x11);
		}

		if (buf[length] < maxbuflen) {
			buf.push(0xec);
		}

		return buf;
	};

	var calculateecc = function calculateecc(poly, genpoly) {
		var modulus = poly.slice(0);
		var polylen = poly[length],
			genpolylen = genpoly[length];

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

	var augumenteccs = function augumenteccs(poly, nblocks, genpoly) {
		var subsizes = [];
		var subsize = (poly[length] / nblocks) | 0,
			subsize0 = 0;
		var pivot = nblocks - (poly[length] % nblocks);

		for (var i = 0; i < pivot; ++i) {
			subsizes.push(subsize0);
			subsize0 += subsize;
		}

		for (var i2 = pivot; i2 < nblocks; ++i2) {
			subsizes.push(subsize0);
			subsize0 += subsize + 1;
		}

		subsizes.push(subsize0);
		var eccs = [];

		for (var i3 = 0; i3 < nblocks; ++i3) {
			eccs.push(
				calculateecc(
					poly.slice(subsizes[i3], subsizes[i3 + 1]),
					genpoly
				)
			);
		}

		var result = [];
		var nitemsperblock = (poly[length] / nblocks) | 0;

		for (var i4 = 0; i4 < nitemsperblock; ++i4) {
			for (var j = 0; j < nblocks; ++j) {
				result.push(poly[subsizes[j] + i4]);
			}
		}

		for (var j2 = pivot; j2 < nblocks; ++j2) {
			result.push(poly[subsizes[j2 + 1] - 1]);
		}

		for (var i5 = 0; i5 < genpoly[length]; ++i5) {
			for (var j3 = 0; j3 < nblocks; ++j3) {
				result.push(eccs[j3][i5]);
			}
		}

		return result;
	};

	var augumentbch = function augumentbch(poly, p, genpoly, q) {
		var modulus = poly << q;

		for (var i = p - 1; i >= 0; --i) {
			if ((modulus >> (q + i)) & 1) {
				modulus ^= genpoly << i;
			}
		}

		return (poly << q) | modulus;
	};

	var makebasematrix = function makebasematrix(ver) {
		var v = VERSIONS[ver],
			n = getsizebyver(ver);
		var matrix = [],
			reserved = [];

		for (var i = 0; i < n; ++i) {
			matrix.push([]);
			reserved.push([]);
		}

		var blit = function blit(y, x, h, w, bits) {
			for (var i = 0; i < h; ++i) {
				for (var j = 0; j < w; ++j) {
					matrix[y + i][x + j] = (bits[i] >> j) & 1;
					reserved[y + i][x + j] = 1;
				}
			}
		};

		blit(0, 0, 9, 9, [
			0x7f,
			0x41,
			0x5d,
			0x5d,
			0x5d,
			0x41,
			0x17f,
			0x00,
			0x40
		]);
		blit(n - 8, 0, 8, 9, [0x100, 0x7f, 0x41, 0x5d, 0x5d, 0x5d, 0x41, 0x7f]);
		blit(0, n - 8, 9, 8, [
			0xfe,
			0x82,
			0xba,
			0xba,
			0xba,
			0x82,
			0xfe,
			0x00,
			0x00
		]);

		for (var i2 = 9; i2 < n - 8; ++i2) {
			matrix[6][i2] = matrix[i2][6] = ~i2 & 1;
			reserved[6][i2] = reserved[i2][6] = 1;
		}

		var aligns = v[2],
			m = aligns[length];

		for (var i3 = 0; i3 < m; ++i3) {
			var minj = i3 === 0 || i3 === m - 1 ? 1 : 0,
				maxj = i3 === 0 ? m - 1 : m;

			for (var j = minj; j < maxj; ++j) {
				blit(aligns[i3], aligns[j], 5, 5, [
					0x1f,
					0x11,
					0x15,
					0x11,
					0x1f
				]);
			}
		}

		if (needsverinfo(ver)) {
			var code = augumentbch(ver, 6, 0x1f25, 12);
			var k = 0;

			for (var i4 = 0; i4 < 6; ++i4) {
				for (var j2 = 0; j2 < 3; ++j2) {
					matrix[i4][n - 11 + j2] = matrix[n - 11 + j2][i4] =
						(code >> k++) & 1;
					reserved[i4][n - 11 + j2] = reserved[n - 11 + j2][i4] = 1;
				}
			}
		}

		return {
			matrix: matrix,
			reserved: reserved
		};
	};

	var putdata = function putdata(matrix, reserved, buf) {
		var n = matrix[length];
		var k = 0,
			dir = -1;

		for (var i = n - 1; i >= 0; i -= 2) {
			if (i === 6) {
				--i;
			}

			var jj = dir < 0 ? n - 1 : 0;

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

	var maskdata = function maskdata(matrix, reserved, mask) {
		var maskf = MASKFUNCS[mask];
		var n = matrix[length];

		for (var i = 0; i < n; ++i) {
			for (var j = 0; j < n; ++j) {
				if (!reserved[i][j]) {
					matrix[i][j] ^= maskf(i, j);
				}
			}
		}

		return matrix;
	};

	var putformatinfo = function putformatinfo(
		matrix,
		reserved,
		ecclevel,
		mask
	) {
		var n = matrix[length];
		var code = augumentbch((ecclevel << 3) | mask, 5, 0x537, 10) ^ 0x5412;

		for (var i = 0; i < 15; ++i) {
			var r = [
				0,
				1,
				2,
				3,
				4,
				5,
				7,
				8,
				n - 7,
				n - 6,
				n - 5,
				n - 4,
				n - 3,
				n - 2,
				n - 1
			][i];
			var c = [
				n - 1,
				n - 2,
				n - 3,
				n - 4,
				n - 5,
				n - 6,
				n - 7,
				n - 8,
				7,
				5,
				4,
				3,
				2,
				1,
				0
			][i];
			matrix[r][8] = matrix[8][c] = (code >> i) & 1;
		}

		return matrix;
	};

	var evaluatematrix = function evaluatematrix(matrix) {
		var PENALTY_CONSECUTIVE = 3;
		var PENALTY_TWOBYTWO = 3;
		var PENALTY_FINDERLIKE = 40;
		var PENALTY_DENSITY = 10;

		var evaluategroup = function evaluategroup(groups) {
			var score = 0;

			for (var i = 0; i < groups[length]; ++i) {
				if (groups[i] >= 5) {
					score += PENALTY_CONSECUTIVE + (groups[i] - 5);
				}
			}

			for (var i2 = 5; i2 < groups[length]; i2 += 2) {
				var p = groups[i2];

				if (
					groups[i2 - 1] === p &&
					groups[i2 - 2] === 3 * p &&
					groups[i2 - 3] === p &&
					groups[i2 - 4] === p &&
					(groups[i2 - 5] >= 4 * p || groups[i2 + 1] >= 4 * p)
				) {
					score += PENALTY_FINDERLIKE;
				}
			}

			return score;
		};

		var n = matrix[length];
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

			for (var j2 = 0; j2 < n; ) {
				var k2;

				for (k2 = 0; j2 < n && matrix[j2][i]; ++k2) {
					++j2;
				}

				groups.push(k2);

				for (k2 = 0; j2 < n && !matrix[j2][i]; ++k2) {
					++j2;
				}

				groups.push(k2);
			}

			score += evaluategroup(groups);
			var nextrow = matrix[i + 1] || [];
			nblacks += row[0];

			for (var j3 = 1; j3 < n; ++j3) {
				var p = row[j3];
				nblacks += p;

				if (
					row[j3 - 1] === p &&
					nextrow[j3] === p &&
					nextrow[j3 - 1] === p
				) {
					score += PENALTY_TWOBYTWO;
				}
			}
		}

		score +=
			PENALTY_DENSITY * ((Math.abs(nblacks / n / n - 0.5) / 0.05) | 0);
		return score;
	};

	var _generate = function generate(data, ver, mode, ecclevel, mask) {
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

	var appendChild = "appendChild";
	var createElement = "createElement";
	var createElementNS = "createElementNS";
	var setAttributeNS = "setAttributeNS";
	var createRange = "createRange";
	var selectNodeContents = "selectNodeContents";
	var createContextualFragment = "createContextualFragment";
	var createDocumentFragment = "createDocumentFragment";
	var createTextNode = "createTextNode";
	var QRCode = {
		generate: function generate(data, settings) {
			var options = settings || {};
			var MODES = {
				numeric: MODE_NUMERIC,
				alphanumeric: MODE_ALPHANUMERIC,
				octet: MODE_OCTET
			};
			var ECCLEVELS = {
				L: ECCLEVEL_L,
				M: ECCLEVEL_M,
				Q: ECCLEVEL_Q,
				H: ECCLEVEL_H
			};
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
			} else if (
				!(
					mode === MODE_NUMERIC ||
					mode === MODE_ALPHANUMERIC ||
					mode === MODE_OCTET
				)
			) {
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
					if (data[length] <= getmaxdatalen(ver, mode, ecclevel)) {
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

			return _generate(data, ver, mode, ecclevel, mask);
		},
		generateHTML: function generateHTML(data, settings) {
			var options = settings || {};
			var fillcolor = options.fillcolor ? options.fillcolor : "#FFFFFF";
			var textcolor = options.textcolor ? options.textcolor : "#000000";
			var matrix = QRCode.generate(data, options);
			var modsize = Math.max(options.modulesize || 5, 0.5);
			var margin = Math.max(options.margin !== null ? options.margin : 4, 0.0);
			var e = document[createElement]("div");
			var n = matrix[length];
			var html = [
				'<table border="0" cellspacing="0" cellpadding="0" style="border:' +
					modsize * margin +
					"px solid " +
					fillcolor +
					";background:" +
					fillcolor +
					'">'
			];

			for (var i = 0; i < n; ++i) {
				html.push("<tr>");

				for (var j = 0; j < n; ++j) {
					html.push(
						'<td style="width:' +
							modsize +
							"px;height:" +
							modsize +
							"px" +
							(matrix[i][j] ? ";background:" + textcolor : "") +
							'"></td>'
					);
				}

				html.push("</tr>");
			}

			e.className = "qrcode";
			/* e.innerHTML = html.join("") + "</table>"; */

			var range = document[createRange]();
			range[selectNodeContents](e);
			var frag = range[createContextualFragment](
				html.join("") + "</table>"
			);
			e[appendChild](frag);
			return e;
		},
		generateSVG: function generateSVG(data, settings) {
			var options = settings || {};
			var fillcolor = options.fillcolor ? options.fillcolor : "#FFFFFF";
			var textcolor = options.textcolor ? options.textcolor : "#000000";
			var matrix = QRCode.generate(data, options);
			var n = matrix[length];
			var modsize = Math.max(options.modulesize || 5, 0.5);
			var margin = Math.max(options.margin ? options.margin : 4, 0.0);
			var size = modsize * (n + 2 * margin);
			/* var common = ' class= "fg"' + ' width="' + modsize + '" height="' + modsize + '"/>'; */

			var e = document[createElementNS]("http://www.w3.org/2000/svg", "svg");
			e[setAttributeNS](null, "viewBox", "0 0 " + size + " " + size);
			e[setAttributeNS](null, "style", "shape-rendering:crispEdges");
			var qrcodeId = "qrcode" + Date.now();
			e[setAttributeNS](null, "id", qrcodeId);
			var frag = document[createDocumentFragment]();
			/* var svg = ['<style scoped>.bg{fill:' + fillcolor + '}.fg{fill:' + textcolor + '}</style>', '<rect class="bg" x="0" y="0"', 'width="' + size + '" height="' + size + '"/>', ]; */
			var style = document[createElementNS]("http://www.w3.org/2000/svg", "style");
			style[appendChild](document[createTextNode]("#" + qrcodeId + " .bg{fill:" + fillcolor + "}#" + qrcodeId + " .fg{fill:" + textcolor + "}"));
			/* style[setAttributeNS](null, "scoped", "scoped"); */
			frag[appendChild](style);
			var createRect = function (c, f, x, y, s) {
				var fg = document[createElementNS]("http://www.w3.org/2000/svg", "rect") || "";
				fg[setAttributeNS](null, "class", c);
				fg[setAttributeNS](null, "fill", f);
				fg[setAttributeNS](null, "x", x);
				fg[setAttributeNS](null, "y", y);
				fg[setAttributeNS](null, "width", s);
				fg[setAttributeNS](null, "height", s);
				return fg;
			};

			frag[appendChild](createRect("bg", "none", 0, 0, size));
			var yo = margin * modsize;

			for (var y = 0; y < n; ++y) {
				var xo = margin * modsize;

				for (var x = 0; x < n; ++x) {
					if (matrix[y][x]) {
						/* svg.push('<rect x="' + xo + '" y="' + yo + '"', common); */
						frag[appendChild](
							createRect("fg", "none", xo, yo, modsize)
						);
					}

					xo += modsize;
				}

				yo += modsize;
			}
			/* e.innerHTML = svg.join(""); */

			e[appendChild](frag);
			return e;
		},
		generatePNG: function generatePNG(data, settings) {
			var options = settings || {};
			var fillcolor = options.fillcolor || "#FFFFFF";
			var textcolor = options.textcolor || "#000000";
			var matrix = QRCode.generate(data, options);
			var modsize = Math.max(options.modulesize || 5, 0.5);
			var margin = Math.max(
				options.margin !== null && options.margin !== undefined
					? options.margin
					: 4,
				0.0
			);
			var n = matrix[length];
			var size = modsize * (n + 2 * margin);
			var canvas = document[createElement]("canvas"),
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
						context.fillRect(
							modsize * (margin + j),
							modsize * (margin + i),
							modsize,
							modsize
						);
					}
				}
			}

			return canvas.toDataURL();
		}
	};
	root.QRCode = QRCode;
})("undefined" !== typeof window ? window : this, document);
/*jshint bitwise: true */

!(function(t) {
	"use strict";

	function e(t, o) {
		if (!(this instanceof e)) return new e(t, o);
		if (!t || "TABLE" !== t.tagName)
			throw new Error("Element must be a table");
		this.init(t, o || {});
	}

	var o = [],
		s = function s(e) {
			var o;
			return (
				t.CustomEvent && "function" == typeof t.CustomEvent
					? (o = new CustomEvent(e))
					: ((o = document.createEvent("CustomEvent")),
					  o.initCustomEvent(e, !1, !1, void 0)),
				o
			);
		},
		r = function r(t) {
			return (
				t.getAttribute("data-sort") ||
				t.textContent ||
				t.innerText ||
				""
			);
		},
		n = function n(t, e) {
			return (
				(t = t.toLowerCase()),
				(e = e.toLowerCase()),
				t === e ? 0 : e > t ? 1 : -1
			);
		},
		i = function i(t, e) {
			return function(o, s) {
				var r = t(o.td, s.td);
				return 0 === r
					? e
						? s.index - o.index
						: o.index - s.index
					: r;
			};
		};

	(e.extend = function(t, e, s) {
		if ("function" != typeof e || "function" != typeof s)
			throw new Error("Pattern and sort must be a function");
		o.push({
			name: t,
			pattern: e,
			sort: s
		});
	}),
		(e.prototype = {
			init: function init(t, e) {
				var o,
					s,
					r,
					n,
					i = this;
				if (
					((i.table = t),
					(i.thead = !1),
					(i.options = e),
					t.rows && t.rows.length > 0)
				)
					if (t.tHead && t.tHead.rows.length > 0) {
						for (r = 0; r < t.tHead.rows.length; r++) {
							if (
								t.tHead.rows[r].classList.contains("sort-row")
							) {
								o = t.tHead.rows[r];
								break;
							}
						}

						o || (o = t.tHead.rows[t.tHead.rows.length - 1]),
							(i.thead = !0);
					} else o = t.rows[0];

				if (o) {
					var a = function a() {
						i.current &&
							i.current !== this &&
							(i.current.classList.remove("sort-up"),
							i.current.classList.remove("sort-down")),
							(i.current = this),
							i.sortTable(this);
					};

					for (r = 0; r < o.cells.length; r++) {
						(n = o.cells[r]),
							n.classList.contains("no-sort") ||
								(n.classList.add("sort-header"),
								(n.tabindex = 0),
								n.addEventListener("click", a, !1),
								n.classList.contains("sort-default") &&
									(s = n));
					}

					s && ((i.current = s), i.sortTable(s));
				}
			},
			sortTable: function sortTable(t, e) {
				var a,
					d = this,
					l = t.cellIndex,
					c = n,
					u = "",
					f = [],
					h = d.thead ? 0 : 1,
					w = t.getAttribute("data-sort-method"),
					p = t.getAttribute("data-sort-order");

				if (
					(d.table.dispatchEvent(s("beforeSort")),
					e
						? (a = t.classList.contains("sort-up")
								? "sort-up"
								: "sort-down")
						: ((a = t.classList.contains("sort-up")
								? "sort-down"
								: t.classList.contains("sort-down")
								? "sort-up"
								: "asc" === p
								? "sort-down"
								: "desc" === p
								? "sort-up"
								: d.options.descending
								? "sort-up"
								: "sort-down"),
						  t.classList.remove(
								"sort-down" === a ? "sort-up" : "sort-down"
						  ),
						  t.classList.add(a)),
					!(d.table.rows.length < 2))
				) {
					if (!w) {
						for (
							;
							f.length < 3 && h < d.table.tBodies[0].rows.length;

						) {
							(u = r(d.table.tBodies[0].rows[h].cells[l])),
								(u = u.trim()),
								u.length > 0 && f.push(u),
								h++;
						}

						if (!f) return;
					}

					for (h = 0; h < o.length; h++) {
						if (((u = o[h]), w)) {
							if (u.name === w) {
								c = u.sort;
								break;
							}
						} else if (f.every(u.pattern)) {
							c = u.sort;
							break;
						}
					}

					for (d.col = l, h = 0; h < d.table.tBodies.length; h++) {
						var b,
							v = [],
							m = {},
							g = 0,
							L = 0;

						if (!(d.table.tBodies[h].rows.length < 2)) {
							for (
								b = 0;
								b < d.table.tBodies[h].rows.length;
								b++
							) {
								(u = d.table.tBodies[h].rows[b]),
									u.classList.contains("no-sort")
										? (m[g] = u)
										: v.push({
												tr: u,
												td: r(u.cells[d.col]),
												index: g
										  }),
									g++;
							}

							for (
								"sort-down" === a
									? (v.sort(i(c, !0)), v.reverse())
									: v.sort(i(c, !1)),
									b = 0;
								g > b;
								b++
							) {
								m[b] ? ((u = m[b]), L++) : (u = v[b - L].tr),
									d.table.tBodies[h].appendChild(u);
							}
						}
					}

					d.table.dispatchEvent(s("afterSort"));
				}
			},
			refresh: function refresh() {
				void 0 !== this.current && this.sortTable(this.current, true);
			}
		}),
		"undefined" != typeof module && module.exports
			? (module.exports = e)
			: (t.Tablesort = e);
})("undefined" != typeof window ? window : this);

!(function(e) {
	"use strict";

	var n = (function() {
		function e() {
			for (var e = 0, n = {}; e < arguments.length; e++) {
				var t = arguments[e];

				for (var r in t) {
					t.hasOwnProperty(r) && (n[r] = t[r]);
				}
			}

			return n;
		}

		function n(t) {
			var r = function r(n, o, i) {
				var c,
					a = this;

				if ("undefined" != typeof document) {
					if (arguments.length > 1) {
						if (
							"number" ==
							typeof (i = e(
								{
									path: "/"
								},
								r.defaults,
								i
							)).expires
						) {
							var s = new Date();
							s.setMilliseconds(
								s.getMilliseconds() + 864e5 * i.expires
							),
								(i.expires = s);
						}

						try {
							(c = JSON.stringify(o)),
								/^[\{\[]/.test(c) && (o = c);
						} catch (e) {}

						return (
							(o = t.write
								? t.write(o, n)
								: encodeURIComponent(String(o)).replace(
										/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g,
										decodeURIComponent
								  )),
							(n = (n = (n = encodeURIComponent(
								String(n)
							)).replace(
								/%(23|24|26|2B|5E|60|7C)/g,
								decodeURIComponent
							)).replace(/[\(\)]/g, escape)),
							(document.cookie = [
								n,
								"=",
								o,
								i.expires
									? "; expires=" + i.expires.toUTCString()
									: "",
								i.path ? "; path=" + i.path : "",
								i.domain ? "; domain=" + i.domain : "",
								i.secure ? "; secure" : ""
							].join(""))
						);
					}

					n || (c = {});

					for (
						var p = document.cookie
								? document.cookie.split("; ")
								: [],
							d = /(%[0-9A-Z]{2})+/g,
							u = 0;
						u < p.length;
						u++
					) {
						var f = p[u].split("="),
							l = f.slice(1).join("=");
						'"' === l.charAt(0) && (l = l.slice(1, -1));

						try {
							var h = f[0].replace(d, decodeURIComponent);
							if (
								((l = t.read
									? t.read(l, h)
									: t(l, h) ||
									  l.replace(d, decodeURIComponent)),
								a.json)
							)
								try {
									l = JSON.parse(l);
								} catch (e) {}

							if (n === h) {
								c = l;
								break;
							}

							n || (c[h] = l);
						} catch (e) {}
					}

					return c;
				}
			};

			return (
				(r.set = r),
				(r.get = function(e) {
					return r.call(r, e);
				}),
				(r.getJSON = function() {
					return r.apply(
						{
							json: !0
						},
						[].slice.call(arguments)
					);
				}),
				(r.defaults = {}),
				(r.remove = function(n, t) {
					r(
						n,
						"",
						e(t, {
							expires: -1
						})
					);
				}),
				(r.withConverter = n),
				r
			);
		}

		return n(function() {});
	})();

	e.Cookies = n;
})("undefined" != typeof window ? window : this);

!(function(e, t) {
	var n = {
			source: null,
			appendTo: null,
			disabled: !1,
			autoFocus: !1,
			minChars: 1,
			property: null,
			exclude: "kamil-autocomplete-category",
			filter: function filter(e, t) {
				var n = new RegExp(i.escapeRegex(t), "i");
				return n.test(e);
			},
			sort: function sort(e, t) {
				var n = this._opts.property,
					i = null === n ? e.label || e.value || e : e[n],
					s = null === n ? t.label || t.value || t : t[n];
				return i.length - s.length;
			}
		},
		i = {
			extend: function extend(e, t) {
				var n,
					i = {};

				for (n in e) {
					Object.prototype.hasOwnProperty.call(e, n) && (i[n] = e[n]);
				}

				for (n in t) {
					Object.prototype.hasOwnProperty.call(t, n) && (i[n] = t[n]);
				}

				return i;
			},
			escapeRegex: function escapeRegex(e) {
				return e.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
			},
			getItemValue: function getItemValue(e, t) {
				var n = e._data[parseInt(t.getAttribute("data-position"), 10)],
					i = e._opts.property;

				return "undefined" != typeof n
					? null === i
						? n.label || n.value || n
						: n[i]
					: void 0;
			},
			trigger: function trigger(e, n, i) {
				var s = t.createEvent("HTMLEvents");
				s.initEvent(n, !0, true);

				for (var r in i) {
					i.hasOwnProperty(r) && (s[r] = i[r]);
				}

				e.dispatchEvent(s);
			},
			isActive: function isActive(e, t) {
				var n = e.getElementsByTagName("li"),
					i = n.length;
				return (
					"string" == typeof t && (t = "first" === t ? 0 : i - 1),
					n[t] ? n[t].classList.contains("kamil-active") : null
				);
			},
			noActive: function noActive(e) {
				return 0 === e.getElementsByClassName("kamil-active").length;
			},
			setActive: function setActive(e) {
				if (!e.item.classList.contains(this._opts.exclude)) {
					var t = this._menu.getElementsByClassName("kamil-active");

					0 !== t.length && t[0].classList.remove("kamil-active"),
						e.item.classList.add("kamil-active"),
						e.fillSource &&
							(this._srcElement.value = i.getItemValue(
								this,
								e.item
							)),
						i.trigger(this._menu, "kamilfocus", {
							item: this._data[
								parseInt(
									e.item.getAttribute("data-position"),
									10
								)
							],
							inputElement: this._srcElement
						});
				}
			},
			move: function move(e) {
				if (!this.open) return void this.start(null);

				var t = this._menu.getElementsByTagName("li");

				if (
					("previous" === e && i.isActive(this._menu, "first")) ||
					("next" === e && i.isActive(this._menu, "last")) ||
					("previous" === e &&
						1 === this._activeIndex &&
						t[0].classList.contains(this._opts.exclude))
				) {
					(this._srcElement.value = this.term),
						(this._activeIndex = null);

					for (var n = 0, s = t.length; s > n; n++) {
						t[n].classList.contains("kamil-active") &&
							t[n].classList.remove("kamil-active");
					}
				} else
					i.noActive(this._menu) || null === this._activeIndex
						? "previous" === e
							? (this._activeIndex = t.length - 1)
							: "next" === e && (this._activeIndex = 0)
						: (this._activeIndex =
								this._activeIndex +
								("previous" === e ? -1 : 1)),
						t[this._activeIndex] &&
							t[this._activeIndex].classList.contains(
								this._opts.exclude
							) &&
							(this._activeIndex =
								this._activeIndex +
								("previous" === e ? -1 : 1)),
						i.setActive.call(this, {
							item: t[this._activeIndex],
							fillSource: !0
						});
			}
		},
		s = {
			source: function source() {
				var e = this._opts.source;
				if (e.constructor === Array) this.source = e;
				else {
					var n = t.querySelector(e),
						i = n.children;
					this.source = [];

					for (var s = 0, r = i.length; r > s; s++) {
						var o = i[s];
						this.source.push(o.textContent);
					}
				}
			},
			list: function list() {
				var e = this._opts.appendTo;
				(this._menu = t.createElement("ul")),
					(this._menu.className = "kamil-autocomplete"),
					null !== e
						? t.querySelector(e).appendChild(this._menu)
						: this._srcElement.parentNode.insertBefore(
								this._menu,
								this._srcElement.nextSibling
						  );
			}
		},
		r = {
			keyup: function keyup(e) {
				return function(t) {
					if (!e._opts.disabled)
						switch (t.keyCode) {
							case 38:
								i.move.call(e, "previous", t);
								break;

							case 40:
								i.move.call(e, "next", t);
								break;

							case 13:
								var n = e._menu.getElementsByClassName(
									"kamil-active"
								);

								if (0 === n.length) return;
								var s = n[0];
								(e._srcElement.value = i.getItemValue(e, s)),
									i.trigger(e._menu, "kamilselect", {
										item:
											e._data[
												parseInt(
													s.getAttribute(
														"data-position"
													),
													10
												)
											],
										inputElement: e._srcElement
									}),
									e.close();
								break;

							case 27:
								(e._srcElement.value = e.term), e.close();
						}
				};
			},
			keydown: function keydown(e) {
				return 38 === e.keyCode || 40 === e.keyCode
					? (e.preventDefault(), !1)
					: void 0;
			},
			input: function input() {
				var e = this;
				return function() {
					e._opts.disabled ||
						(e.term === e._srcElement.value && e.open) ||
						((e._activeIndex = null), e.start(null));
				};
			},
			itemClickFlag: !0,
			mousedown: function mousedown() {
				r.itemClickFlag = !1;
			},
			mouseup: function mouseup(e) {
				return function() {
					(r.itemClickFlag = !0),
						(e._srcElement.value = i.getItemValue(e, this)),
						i.trigger(e._menu, "kamilselect", {
							item:
								e._data[
									parseInt(
										this.getAttribute("data-position"),
										10
									)
								],
							inputElement: e._srcElement
						}),
						e._srcElement.focus(),
						e.close();
				};
			},
			mouseover: function mouseover(e) {
				return function() {
					i.setActive.call(e, {
						item: this,
						fillSource: !1
					});
				};
			},
			mouseout: function mouseout(e) {
				return function() {
					var t = e._menu.getElementsByClassName("kamil-active")[0];

					t && t.classList.remove("kamil-active");
				};
			},
			blur: function blur(e) {
				return function() {
					!e._opts.disabled && r.itemClickFlag && e.close();
				};
			}
		},
		o = (e.Kamil = function(e, o) {
			var l = this;
			(l._opts = i.extend(n, o)),
				(l._activeIndex = null),
				(l._data = null),
				(l.open = !1);
			var a = (l._srcElement =
				"string" == typeof e ? t.querySelector(e) : e);
			a.addEventListener("input", r.input.call(l), !1),
				a.addEventListener("keyup", r.keyup(l), !1),
				a.addEventListener("keydown", r.keydown, !1),
				a.addEventListener("blur", r.blur(l), !1),
				s.source.call(l),
				s.list.call(l);
		});

	(o.prototype._resizeMenu = function() {
		var e = this._menu.style;
		(e.width = this._srcElement.offsetWidth + "px"),
			(e.left = this._srcElement.offsetLeft + "px"),
			(e.top =
				this._srcElement.offsetTop +
				this._srcElement.offsetHeight +
				"px");
	}),
		(o.prototype._renderItemData = function(e, t, n) {
			var i = this.renderItem(e, t);
			return (
				i.setAttribute("data-position", n),
				i.addEventListener("mousedown", r.mousedown, !1),
				i.addEventListener("mouseup", r.mouseup(this), !1),
				i.addEventListener("mouseover", r.mouseover(this), !1),
				i.addEventListener("mouseout", r.mouseout(this), !1),
				i
			);
		}),
		(o.prototype._renderMenu = function(e, t) {
			for (var n = this._menu; n.firstChild; ) {
				n.removeChild(n.firstChild);
			}

			return (
				this._resizeMenu(),
				this.renderMenu(n, e),
				0 === n.children.length
					? void (n.style.display = "none")
					: ("block" !== n.style.display &&
							(n.style.display = "block"),
					  void t())
			);
		}),
		(o.prototype.renderItem = function(e, n) {
			var i = t.createElement("li");
			return (
				(i.innerHTML =
					null === this._opts.property
						? n.label || n.value || n
						: n[this._opts.property]),
				e.appendChild(i),
				i
			);
		}),
		(o.prototype.renderMenu = function(e, t) {
			for (var n = 0, i = t.length; i > n; n++) {
				var s = t[n];

				this._renderItemData(e, s, n);
			}
		}),
		(o.prototype.start = function(e) {
			var t = this;

			if (
				((e = null !== e ? e : t._srcElement.value),
				(t.term = t._srcElement.value),
				!t._opts.disabled)
			) {
				if (!e) return void t.close();
				if (e.length < t._opts.minChars) return void t.close();
				(t._data = t.source
					.filter(function(n) {
						return t._opts.filter(
							null === t._opts.property
								? n.label || n.value || n
								: n[t._opts.property],
							e
						);
					})
					.sort(function(e, n) {
						return t._opts.sort.call(t, e, n);
					})),
					i.trigger(this._menu, "kamilresponse", {
						content: t._data,
						inputElement: t._srcElement
					}),
					t._renderMenu(t._data, function() {
						if (t._opts.autoFocus) {
							var e = t._menu.getElementsByTagName("li");

							i.setActive.call(t, {
								item: e[0],
								fillSource: !1
							});
						}

						(t.open = !0), i.trigger(t._menu, "kamilopen");
					});
			}
		}),
		(o.prototype.close = function() {
			this.open &&
				((this._menu.style.display = "none"),
				(this.open = !1),
				i.trigger(this._menu, "kamilclose"));
		}),
		(o.prototype.destroy = function() {
			this._menu.remove();

			var e = this._srcElement;
			e.removeEventListener("input", r.input.call(this), !1),
				e.removeEventListener("keyup", r.keyup(this), !1),
				e.removeEventListener("keydown", r.keydown, !1),
				e.removeEventListener("blur", r.blur(this), !1);
		}),
		(o.prototype.disable = function() {
			this.close(), (this._opts.disabled = !0);
		}),
		(o.prototype.enable = function() {
			this._opts.disabled = !1;
		}),
		(o.prototype.isEnabled = function() {
			return !this._opts.disabled;
		}),
		(o.prototype.option = function() {
			var e = "";

			switch (arguments.length) {
				case 0:
					e = this._opts;
					break;

				case 1:
					e = this._opts[arguments[0]];
					break;

				case 2:
					this._opts[arguments[0]] = arguments[1];
			}

			return e;
		}),
		(o.prototype.on = function(e, t) {
			var n = this;

			n._menu.addEventListener(
				e,
				function(i) {
					"kamilresponse" === e ? (n._data = t(i)) : t(i);
				},
				!1
			);
		});
})("undefined" != typeof window ? window : this, document);

var IN_GLOBAL_SCOPE = !0;
window.PR_SHOULD_USE_CONTINUATION = !0;
var prettyPrintOne, prettyPrint;
!(function() {
	function e(e) {
		function t(e) {
			var t = e.charCodeAt(0);
			if (92 !== t) return t;
			var n = e.charAt(1);
			return (
				(t = f[n]),
				t
					? t
					: n >= "0" && "7" >= n
					? parseInt(e.substring(1), 8)
					: "u" === n || "x" === n
					? parseInt(e.substring(2), 16)
					: e.charCodeAt(1)
			);
		}

		function n(e) {
			if (32 > e) return (16 > e ? "\\x0" : "\\x") + e.toString(16);
			var t = String.fromCharCode(e);
			return "\\" === t || "-" === t || "]" === t || "^" === t
				? "\\" + t
				: t;
		}

		function r(e) {
			var r = e
					.substring(1, e.length - 1)
					.match(
						new RegExp(
							"\\\\u[0-9A-Fa-f]{4}|\\\\x[0-9A-Fa-f]{2}|\\\\[0-3][0-7]{0,2}|\\\\[0-7]{1,2}|\\\\[\\s\\S]|-|[^-\\\\]",
							"g"
						)
					),
				a = [],
				s = "^" === r[0],
				i = ["["];
			s && i.push("^");

			for (var l = s ? 1 : 0, o = r.length; o > l; ++l) {
				var u = r[l];
				if (/\\[bdsw]/i.test(u)) i.push(u);
				else {
					var c,
						f = t(u);
					o > l + 2 && "-" === r[l + 1]
						? ((c = t(r[l + 2])), (l += 2))
						: (c = f),
						a.push([f, c]),
						65 > c ||
							f > 122 ||
							(65 > c ||
								f > 90 ||
								a.push([
									32 | Math.max(65, f),
									32 | Math.min(c, 90)
								]),
							97 > c ||
								f > 122 ||
								a.push([
									-33 & Math.max(97, f),
									-33 & Math.min(c, 122)
								]));
				}
			}

			a.sort(function(e, t) {
				return e[0] - t[0] || t[1] - e[1];
			});

			for (var d = [], p = [], l = 0; l < a.length; ++l) {
				var g = a[l];
				g[0] <= p[1] + 1
					? (p[1] = Math.max(p[1], g[1]))
					: d.push((p = g));
			}

			for (var l = 0; l < d.length; ++l) {
				var g = d[l];
				i.push(n(g[0])),
					g[1] > g[0] &&
						(g[1] + 1 > g[0] && i.push("-"), i.push(n(g[1])));
			}

			return i.push("]"), i.join("");
		}

		function a(e) {
			for (
				var t = e.source.match(
						new RegExp(
							"(?:\\[(?:[^\\x5C\\x5D]|\\\\[\\s\\S])*\\]|\\\\u[A-Fa-f0-9]{4}|\\\\x[A-Fa-f0-9]{2}|\\\\[0-9]+|\\\\[^ux0-9]|\\(\\?[:!=]|[\\(\\)\\^]|[^\\x5B\\x5C\\(\\)\\^]+)",
							"g"
						)
					),
					a = t.length,
					l = [],
					o = 0,
					u = 0;
				a > o;
				++o
			) {
				var c = t[o];
				if ("(" === c) ++u;
				else if ("\\" === c.charAt(0)) {
					var f = +c.substring(1);
					f && (u >= f ? (l[f] = -1) : (t[o] = n(f)));
				}
			}

			for (var o = 1; o < l.length; ++o) {
				-1 === l[o] && (l[o] = ++s);
			}

			for (var o = 0, u = 0; a > o; ++o) {
				var c = t[o];
				if ("(" === c) ++u, l[u] || (t[o] = "(?:");
				else if ("\\" === c.charAt(0)) {
					var f = +c.substring(1);
					f && u >= f && (t[o] = "\\" + l[f]);
				}
			}

			for (var o = 0; a > o; ++o) {
				"^" === t[o] && "^" !== t[o + 1] && (t[o] = "");
			}

			if (e.ignoreCase && i)
				for (var o = 0; a > o; ++o) {
					var c = t[o],
						d = c.charAt(0);
					c.length >= 2 && "[" === d
						? (t[o] = r(c))
						: "\\" !== d &&
						  (t[o] = c.replace(/[a-zA-Z]/g, function(e) {
								var t = e.charCodeAt(0);
								return (
									"[" +
									String.fromCharCode(-33 & t, 32 | t) +
									"]"
								);
						  }));
				}
			return t.join("");
		}

		for (var s = 0, i = !1, l = !1, o = 0, u = e.length; u > o; ++o) {
			var c = e[o];
			if (c.ignoreCase) l = !0;
			else if (
				/[a-z]/i.test(
					c.source.replace(
						/\\u[0-9a-f]{4}|\\x[0-9a-f]{2}|\\[^ux]/gi,
						""
					)
				)
			) {
				(i = !0), (l = !1);
				break;
			}
		}

		for (
			var f = {
					b: 8,
					t: 9,
					n: 10,
					v: 11,
					f: 12,
					r: 13
				},
				d = [],
				o = 0,
				u = e.length;
			u > o;
			++o
		) {
			var c = e[o];
			if (c.global || c.multiline) throw new Error("" + c);
			d.push("(?:" + a(c) + ")");
		}

		return new RegExp(d.join("|"), l ? "gi" : "g");
	}

	function t(e, t) {
		function n(e) {
			var o = e.nodeType;

			if (1 == o) {
				if (r.test(e.className)) return;

				for (var u = e.firstChild; u; u = u.nextSibling) {
					n(u);
				}

				var c = e.nodeName.toLowerCase();
				("br" === c || "li" === c) &&
					((a[l] = "\n"), (i[l << 1] = s++), (i[(l++ << 1) | 1] = e));
			} else if (3 == o || 4 == o) {
				var f = e.nodeValue;
				f.length &&
					((f = t
						? f.replace(/\r\n?/g, "\n")
						: f.replace(/[ \t\r\n]+/g, " ")),
					(a[l] = f),
					(i[l << 1] = s),
					(s += f.length),
					(i[(l++ << 1) | 1] = e));
			}
		}

		var r = /(?:^|\s)nocode(?:\s|$)/,
			a = [],
			s = 0,
			i = [],
			l = 0;
		return (
			n(e),
			{
				sourceCode: a.join("").replace(/\n$/, ""),
				spans: i
			}
		);
	}

	function n(e, t, n, r) {
		if (t) {
			var a = {
				sourceCode: t,
				basePos: e
			};
			n(a), r.push.apply(r, a.decorations);
		}
	}

	function r(e) {
		for (var t = void 0, n = e.firstChild; n; n = n.nextSibling) {
			var r = n.nodeType;
			t = 1 === r ? (t ? e : n) : 3 === r && V.test(n.nodeValue) ? e : t;
		}

		return t === e ? void 0 : t;
	}

	function a(t, r) {
		var a,
			s = {};
		!(function() {
			for (
				var n = t.concat(r), i = [], l = {}, o = 0, u = n.length;
				u > o;
				++o
			) {
				var c = n[o],
					f = c[3];
				if (f)
					for (var d = f.length; --d >= 0; ) {
						s[f.charAt(d)] = c;
					}
				var p = c[1],
					g = "" + p;
				l.hasOwnProperty(g) || (i.push(p), (l[g] = null));
			}

			i.push(/[\0-\uffff]/), (a = e(i));
		})();

		var i = r.length,
			l = function l(e) {
				for (
					var t = e.sourceCode,
						o = e.basePos,
						c = [o, I],
						f = 0,
						d = t.match(a) || [],
						p = {},
						g = 0,
						h = d.length;
					h > g;
					++g
				) {
					var m,
						v = d[g],
						y = p[v],
						b = void 0;
					if ("string" == typeof y) m = !1;
					else {
						var x = s[v.charAt(0)];
						if (x) (b = v.match(x[1])), (y = x[0]);
						else {
							for (var w = 0; i > w; ++w) {
								if (((x = r[w]), (b = v.match(x[1])))) {
									y = x[0];
									break;
								}
							}

							b || (y = I);
						}
						(m = y.length >= 5 && "lang-" === y.substring(0, 5)),
							!m ||
								(b && "string" == typeof b[1]) ||
								((m = !1), (y = M)),
							m || (p[v] = y);
					}
					var S = f;

					if (((f += v.length), m)) {
						var C = b[1],
							P = v.indexOf(C),
							R = P + C.length;
						b[2] &&
							((R = v.length - b[2].length), (P = R - C.length));
						var N = y.substring(5);
						n(o + S, v.substring(0, P), l, c),
							n(o + S + P, C, u(N, C), c),
							n(o + S + R, v.substring(R), l, c);
					} else c.push(o + S, y);
				}

				e.decorations = c;
			};

		return l;
	}

	function s(e) {
		var t = [],
			n = [];
		t.push(
			e.tripleQuotedStrings
				? [
						E,
						/^(?:\'\'\'(?:[^\'\\]|\\[\s\S]|\'{1,2}(?=[^\']))*(?:\'\'\'|$)|\"\"\"(?:[^\"\\]|\\[\s\S]|\"{1,2}(?=[^\"]))*(?:\"\"\"|$)|\'(?:[^\\\']|\\[\s\S])*(?:\'|$)|\"(?:[^\\\"]|\\[\s\S])*(?:\"|$))/,
						null,
						"'\""
				  ]
				: e.multiLineStrings
				? [
						E,
						/^(?:\'(?:[^\\\']|\\[\s\S])*(?:\'|$)|\"(?:[^\\\"]|\\[\s\S])*(?:\"|$)|\`(?:[^\\\`]|\\[\s\S])*(?:\`|$))/,
						null,
						"'\"`"
				  ]
				: [
						E,
						/^(?:\'(?:[^\\\'\r\n]|\\.)*(?:\'|$)|\"(?:[^\\\"\r\n]|\\.)*(?:\"|$))/,
						null,
						"\"'"
				  ]
		),
			e.verbatimStrings &&
				n.push([E, /^@\"(?:[^\"]|\"\")*(?:\"|$)/, null]);
		var r = e.hashComments;
		r &&
			(e.cStyleComments
				? (t.push(
						r > 1
							? [
									A,
									/^#(?:##(?:[^#]|#(?!##))*(?:###|$)|.*)/,
									null,
									"#"
							  ]
							: [
									A,
									/^#(?:(?:define|e(?:l|nd)if|else|error|ifn?def|include|line|pragma|undef|warning)\b|[^\r\n]*)/,
									null,
									"#"
							  ]
				  ),
				  n.push([
						E,
						/^<(?:(?:(?:\.\.\/)*|\/?)(?:[\w-]+(?:\/[\w-]+)+)?[\w-]+\.h(?:h|pp|\+\+)?|[a-z]\w*)>/,
						null
				  ]))
				: t.push([A, /^#[^\r\n]*/, null, "#"])),
			e.cStyleComments &&
				(n.push([A, /^\/\/[^\r\n]*/, null]),
				n.push([A, /^\/\*[\s\S]*?(?:\*\/|$)/, null]));
		var s = e.regexLiterals;

		if (s) {
			var i = s > 1 ? "" : "\n\r",
				l = i ? "." : "[\\S\\s]",
				o =
					"/(?=[^/*" +
					i +
					"])(?:[^/\\x5B\\x5C" +
					i +
					"]|\\x5C" +
					l +
					"|\\x5B(?:[^\\x5C\\x5D" +
					i +
					"]|\\x5C" +
					l +
					")*(?:\\x5D|$))+/";
			n.push(["lang-regex", RegExp("^" + G + "(" + o + ")")]);
		}

		var u = e.types;
		u && n.push([k, u]);
		var c = ("" + e.keywords).replace(/^ | $/g, "");
		c.length &&
			n.push([
				T,
				new RegExp("^(?:" + c.replace(/[\s,]+/g, "|") + ")\\b"),
				null
			]),
			t.push([I, /^\s+/, null, " \r\n	 "]);
		var f = "^.[^\\s\\w.$@'\"`/\\\\]*";
		return (
			e.regexLiterals && (f += "(?!s*/)"),
			n.push(
				[O, /^@[a-z_$][a-z_$@0-9]*/i, null],
				[k, /^(?:[@_]?[A-Z]+[a-z][A-Za-z_$@0-9]*|\w+_t\b)/, null],
				[I, /^[a-z_$][a-z_$@0-9]*/i, null],
				[
					O,
					new RegExp(
						"^(?:0x[a-f0-9]+|(?:\\d(?:_\\d+)*\\d*(?:\\.\\d*)?|\\.\\d\\+)(?:e[+\\-]?\\d+)?)[a-z]*",
						"i"
					),
					null,
					"0123456789"
				],
				[I, /^\\[\s\S]?/, null],
				[$, new RegExp(f), null]
			),
			a(t, n)
		);
	}

	function i(e, t, n) {
		function r(e) {
			var t = e.nodeType;

			if (1 != t || s.test(e.className)) {
				if ((3 == t || 4 == t) && n) {
					var o = e.nodeValue,
						u = o.match(i);

					if (u) {
						var c = o.substring(0, u.index);
						e.nodeValue = c;
						var f = o.substring(u.index + u[0].length);

						if (f) {
							var d = e.parentNode;
							d.insertBefore(l.createTextNode(f), e.nextSibling);
						}

						a(e), c || e.parentNode.removeChild(e);
					}
				}
			} else if ("br" === e.nodeName)
				a(e), e.parentNode && e.parentNode.removeChild(e);
			else
				for (var p = e.firstChild; p; p = p.nextSibling) {
					r(p);
				}
		}

		function a(e) {
			function t(e, n) {
				var r = n ? e.cloneNode(!1) : e,
					a = e.parentNode;

				if (a) {
					var s = t(a, 1),
						i = e.nextSibling;
					s.appendChild(r);

					for (var l = i; l; l = i) {
						(i = l.nextSibling), s.appendChild(l);
					}
				}

				return r;
			}

			for (; !e.nextSibling; ) {
				if (((e = e.parentNode), !e)) return;
			}

			for (
				var n, r = t(e.nextSibling, 0);
				(n = r.parentNode) && 1 === n.nodeType;

			) {
				r = n;
			}

			u.push(r);
		}

		for (
			var s = /(?:^|\s)nocode(?:\s|$)/,
				i = /\r\n?|\n/,
				l = e.ownerDocument,
				o = l.createElement("li");
			e.firstChild;

		) {
			o.appendChild(e.firstChild);
		}

		for (var u = [o], c = 0; c < u.length; ++c) {
			r(u[c]);
		}

		t === (0 | t) && u[0].setAttribute("value", t);
		var f = l.createElement("ol");
		f.className = "linenums";

		for (
			var d = Math.max(0, (t - 1) | 0) || 0, c = 0, p = u.length;
			p > c;
			++c
		) {
			(o = u[c]),
				(o.className = "L" + ((c + d) % 10)),
				o.firstChild || o.appendChild(l.createTextNode(" ")),
				f.appendChild(o);
		}

		e.appendChild(f);
	}

	function l(e) {
		var t = /\bMSIE\s(\d+)/.exec(navigator.userAgent);
		t = t && +t[1] <= 8;
		var n = /\n/g,
			r = e.sourceCode,
			a = r.length,
			s = 0,
			i = e.spans,
			l = i.length,
			o = 0,
			u = e.decorations,
			c = u.length,
			f = 0;
		u[c] = a;
		var d, p;

		for (p = d = 0; c > p; ) {
			u[p] !== u[p + 2]
				? ((u[d++] = u[p++]), (u[d++] = u[p++]))
				: (p += 2);
		}

		for (c = d, p = d = 0; c > p; ) {
			for (
				var g = u[p], h = u[p + 1], m = p + 2;
				c >= m + 2 && u[m + 1] === h;

			) {
				m += 2;
			}

			(u[d++] = g), (u[d++] = h), (p = m);
		}

		c = u.length = d;
		var v,
			y = e.sourceNode;
		y && ((v = y.style.display), (y.style.display = "none"));

		try {
			for (; l > o; ) {
				var b,
					x = (i[o], i[o + 2] || a),
					w = u[f + 2] || a,
					m = Math.min(x, w),
					S = i[o + 1];

				if (1 !== S.nodeType && (b = r.substring(s, m))) {
					t && (b = b.replace(n, "\r")), (S.nodeValue = b);
					var C = S.ownerDocument,
						P = C.createElement("span");
					P.className = u[f + 1];
					var R = S.parentNode;
					R.replaceChild(P, S),
						P.appendChild(S),
						x > s &&
							((i[o + 1] = S = C.createTextNode(
								r.substring(m, x)
							)),
							R.insertBefore(S, P.nextSibling));
				}

				(s = m), s >= x && (o += 2), s >= w && (f += 2);
			}
		} finally {
			y && (y.style.display = v);
		}
	}

	function o(e, t) {
		for (var n = t.length; --n >= 0; ) {
			var r = t[n];
			F.hasOwnProperty(r)
				? p.console &&
				  console.warn("cannot override language handler %s", r)
				: (F[r] = e);
		}
	}

	function u(e, t) {
		return (
			(e && F.hasOwnProperty(e)) ||
				(e = /^\s*</.test(t) ? "default-markup" : "default-code"),
			F[e]
		);
	}

	function c(e) {
		var n = e.langExtension;

		try {
			var r = t(e.sourceNode, e.pre),
				a = r.sourceCode;
			(e.sourceCode = a),
				(e.spans = r.spans),
				(e.basePos = 0),
				u(n, a)(e),
				l(e);
		} catch (s) {
			p.console && console.log((s && s.stack) || s);
		}
	}

	function f(e, t, n) {
		var r = document.createElement("div");
		(r.innerHTML = "<pre>" + e + "</pre>"),
			(r = r.firstChild),
			n && i(r, n, true);
		var a = {
			langExtension: t,
			numberLines: n,
			sourceNode: r,
			pre: 1
		};
		return c(a), r.innerHTML;
	}

	function d(e, t) {
		function n(e) {
			return s.getElementsByTagName(e);
		}

		function a() {
			for (
				var t = p.PR_SHOULD_USE_CONTINUATION ? h.now() + 250 : 1 / 0;
				v < u.length && h.now() < t;
				v++
			) {
				for (var n = u[v], s = P, o = n; (o = o.previousSibling); ) {
					var f = o.nodeType,
						d = (7 === f || 8 === f) && o.nodeValue;
					if (
						d
							? !/^\??prettify\b/.test(d)
							: 3 !== f || /\S/.test(o.nodeValue)
					)
						break;

					if (d) {
						(s = {}),
							d.replace(/\b(\w+)=([\w:.%+-]+)/g, function(
								e,
								t,
								n
							) {
								s[t] = n;
							});
						break;
					}
				}

				var g = n.className;

				if ((s !== P || b.test(g)) && !x.test(g)) {
					for (var R = !1, N = n.parentNode; N; N = N.parentNode) {
						var _ = N.tagName;

						if (C.test(_) && N.className && b.test(N.className)) {
							R = !0;
							break;
						}
					}

					if (!R) {
						n.className += " prettyprinted";
						var L = s.lang;

						if (!L) {
							L = g.match(y);
							var E;
							!L &&
								(E = r(n)) &&
								S.test(E.tagName) &&
								(L = E.className.match(y)),
								L && (L = L[1]);
						}

						var T;
						if (w.test(n.tagName)) T = 1;
						else {
							var A = n.currentStyle,
								k = l.defaultView,
								O = A
									? A.whiteSpace
									: k && k.getComputedStyle
									? k
											.getComputedStyle(n, null)
											.getPropertyValue("white-space")
									: 0;
							T = O && "pre" === O.substring(0, 3);
						}
						var $ = s.linenums;
						($ = "true" === $ || +$) ||
							(($ = g.match(/\blinenums\b(?::(\d+))?/)),
							($ = $ ? ($[1] && $[1].length ? +$[1] : !0) : !1)),
							$ && i(n, $, T),
							(m = {
								langExtension: L,
								sourceNode: n,
								numberLines: $,
								pre: T
							}),
							c(m);
					}
				}
			}

			v < u.length ? setTimeout(a, 250) : "function" == typeof e && e();
		}

		for (
			var s = t || document.body,
				l = s.ownerDocument || document,
				o = [n("pre"), n("code"), n("xmp")],
				u = [],
				f = 0;
			f < o.length;
			++f
		) {
			for (var d = 0, g = o[f].length; g > d; ++d) {
				u.push(o[f][d]);
			}
		}

		o = null;
		var h = Date;
		h.now ||
			(h = {
				now: function now() {
					return +new Date();
				}
			});
		var m,
			v = 0,
			y = /\blang(?:uage)?-([\w.]+)(?!\S)/,
			b = /\bprettyprint\b/,
			x = /\bprettyprinted\b/,
			w = /pre|xmp/i,
			S = /^code$/i,
			C = /^(?:pre|code|xmp)$/i,
			P = {};
		a();
	}

	var p = window,
		g = ["break,continue,do,else,for,if,return,while"],
		h = [
			g,
			"auto,case,char,const,default,double,enum,extern,float,goto,inline,int,long,register,short,signed,sizeof,static,struct,switch,typedef,union,unsigned,void,volatile"
		],
		m = [
			h,
			"catch,class,delete,false,import,new,operator,private,protected,public,this,throw,true,try,typeof"
		],
		v = [
			m,
			"alignof,align_union,asm,axiom,bool,concept,concept_map,const_cast,constexpr,decltype,delegate,dynamic_cast,explicit,export,friend,generic,late_check,mutable,namespace,nullptr,property,reinterpret_cast,static_assert,static_cast,template,typeid,typename,using,virtual,where"
		],
		y = [
			m,
			"abstract,assert,boolean,byte,extends,final,finally,implements,import,instanceof,interface,null,native,package,strictfp,super,synchronized,throws,transient"
		],
		b = [
			y,
			"as,base,by,checked,decimal,delegate,descending,dynamic,event,fixed,foreach,from,group,implicit,in,internal,into,is,let,lock,object,out,override,orderby,params,partial,readonly,ref,sbyte,sealed,stackalloc,string,select,uint,ulong,unchecked,unsafe,ushort,var,virtual,where"
		],
		x =
			"all,and,by,catch,class,else,extends,false,finally,for,if,in,is,isnt,loop,new,no,not,null,of,off,on,or,return,super,then,throw,true,try,unless,until,when,while,yes",
		w = [
			m,
			"debugger,eval,export,function,get,null,set,undefined,var,with,Infinity,NaN"
		],
		S =
			"caller,delete,die,do,dump,elsif,eval,exit,foreach,for,goto,if,import,last,local,my,next,no,our,print,package,redo,require,sub,undef,unless,until,use,wantarray,while,BEGIN,END",
		C = [
			g,
			"and,as,assert,class,def,del,elif,except,exec,finally,from,global,import,in,is,lambda,nonlocal,not,or,pass,print,raise,try,with,yield,False,True,None"
		],
		P = [
			g,
			"alias,and,begin,case,class,def,defined,elsif,end,ensure,false,in,module,next,nil,not,or,redo,rescue,retry,self,super,then,true,undef,unless,until,when,yield,BEGIN,END"
		],
		R = [
			g,
			"as,assert,const,copy,drop,enum,extern,fail,false,fn,impl,let,log,loop,match,mod,move,mut,priv,pub,pure,ref,self,static,struct,true,trait,type,unsafe,use"
		],
		N = [g, "case,done,elif,esac,eval,fi,function,in,local,set,then,until"],
		_ = [v, b, w, S, C, P, N],
		L = /^(DIR|FILE|vector|(de|priority_)?queue|list|stack|(const_)?iterator|(multi)?(set|map)|bitset|u?(int|float)\d*)\b/,
		E = "str",
		T = "kwd",
		A = "com",
		k = "typ",
		O = "lit",
		$ = "pun",
		I = "pln",
		z = "tag",
		D = "dec",
		M = "src",
		j = "atn",
		B = "atv",
		U = "nocode",
		G =
			"(?:^^\\.?|[+-]|[!=]=?=?|\\#|%=?|&&?=?|\\(|\\*=?|[+\\-]=|->|\\/=?|::?|<<?=?|>>?>?=?|,|;|\\?|@|\\[|~|{|\\^\\^?=?|\\|\\|?=?|break|case|continue|delete|do|else|finally|instanceof|return|throw|try|typeof)\\s*",
		V = /\S/,
		H = s({
			keywords: _,
			hashComments: !0,
			cStyleComments: !0,
			multiLineStrings: !0,
			regexLiterals: !0
		}),
		F = {};
	o(H, ["default-code"]),
		o(
			a(
				[],
				[
					[I, /^[^<?]+/],
					[D, /^<!\w[^>]*(?:>|$)/],
					[A, /^<\!--[\s\S]*?(?:-\->|$)/],
					["lang-", /^<\?([\s\S]+?)(?:\?>|$)/],
					["lang-", /^<%([\s\S]+?)(?:%>|$)/],
					[$, /^(?:<[%?]|[%?]>)/],
					["lang-", /^<xmp\b[^>]*>([\s\S]+?)<\/xmp\b[^>]*>/i],
					[
						"lang-js",
						/^<script\b[^>]*>([\s\S]*?)(<\/script\b[^>]*>)/i
					],
					[
						"lang-css",
						/^<style\b[^>]*>([\s\S]*?)(<\/style\b[^>]*>)/i
					],
					["lang-in.tag", /^(<\/?[a-z][^<>]*>)/i]
				]
			),
			["default-markup", "htm", "html", "mxml", "xhtml", "xml", "xsl"]
		),
		o(
			a(
				[
					[I, /^[\s]+/, null, " 	\r\n"],
					[B, /^(?:\"[^\"]*\"?|\'[^\']*\'?)/, null, "\"'"]
				],
				[
					[z, /^^<\/?[a-z](?:[\w.:-]*\w)?|\/?>$/i],
					[j, /^(?!style[\s=]|on)[a-z](?:[\w:-]*\w)?/i],
					[
						"lang-uq.val",
						/^=\s*([^>\'\"\s]*(?:[^>\'\"\s\/]|\/(?=\s)))/
					],
					[$, /^[=<>\/]+/],
					["lang-js", /^on\w+\s*=\s*\"([^\"]+)\"/i],
					["lang-js", /^on\w+\s*=\s*\'([^\']+)\'/i],
					["lang-js", /^on\w+\s*=\s*([^\"\'>\s]+)/i],
					["lang-css", /^style\s*=\s*\"([^\"]+)\"/i],
					["lang-css", /^style\s*=\s*\'([^\']+)\'/i],
					["lang-css", /^style\s*=\s*([^\"\'>\s]+)/i]
				]
			),
			["in.tag"]
		),
		o(a([], [[B, /^[\s\S]+/]]), ["uq.val"]),
		o(
			s({
				keywords: v,
				hashComments: !0,
				cStyleComments: !0,
				types: L
			}),
			["c", "cc", "cpp", "cxx", "cyc", "m"]
		),
		o(
			s({
				keywords: "null,true,false"
			}),
			["json"]
		),
		o(
			s({
				keywords: b,
				hashComments: !0,
				cStyleComments: !0,
				verbatimStrings: !0,
				types: L
			}),
			["cs"]
		),
		o(
			s({
				keywords: y,
				cStyleComments: !0
			}),
			["java"]
		),
		o(
			s({
				keywords: N,
				hashComments: !0,
				multiLineStrings: !0
			}),
			["bash", "bsh", "csh", "sh"]
		),
		o(
			s({
				keywords: C,
				hashComments: !0,
				multiLineStrings: !0,
				tripleQuotedStrings: !0
			}),
			["cv", "py", "python"]
		),
		o(
			s({
				keywords: S,
				hashComments: !0,
				multiLineStrings: !0,
				regexLiterals: 2
			}),
			["perl", "pl", "pm"]
		),
		o(
			s({
				keywords: P,
				hashComments: !0,
				multiLineStrings: !0,
				regexLiterals: !0
			}),
			["rb", "ruby"]
		),
		o(
			s({
				keywords: w,
				cStyleComments: !0,
				regexLiterals: !0
			}),
			["javascript", "js"]
		),
		o(
			s({
				keywords: x,
				hashComments: 3,
				cStyleComments: !0,
				multilineStrings: !0,
				tripleQuotedStrings: !0,
				regexLiterals: !0
			}),
			["coffee"]
		),
		o(
			s({
				keywords: R,
				cStyleComments: !0,
				multilineStrings: !0
			}),
			["rc", "rs", "rust"]
		),
		o(a([], [[E, /^[\s\S]+/]]), ["regex"]);
	var q = (p.PR = {
		createSimpleLexer: a,
		registerLangHandler: o,
		sourceDecorator: s,
		PR_ATTRIB_NAME: j,
		PR_ATTRIB_VALUE: B,
		PR_COMMENT: A,
		PR_DECLARATION: D,
		PR_KEYWORD: T,
		PR_LITERAL: O,
		PR_NOCODE: U,
		PR_PLAIN: I,
		PR_PUNCTUATION: $,
		PR_SOURCE: M,
		PR_STRING: E,
		PR_TAG: z,
		PR_TYPE: k,
		prettyPrintOne: IN_GLOBAL_SCOPE
			? (p.prettyPrintOne = f)
			: (prettyPrintOne = f),
		prettyPrint: (prettyPrint = IN_GLOBAL_SCOPE
			? (p.prettyPrint = d)
			: (prettyPrint = d))
	});
	"function" == typeof define &&
		define.amd &&
		define("google-code-prettify", [], function() {
			return q;
		});
})(),
	PR.registerLangHandler(
		PR.createSimpleLexer(
			[[PR.PR_PLAIN, /^[ \t\r\n\f]+/, null, " 	\r\n\f"]],
			[
				[
					PR.PR_STRING,
					/^\"(?:[^\n\r\f\\\"]|\\(?:\r\n?|\n|\f)|\\[\s\S])*\"/,
					null
				],
				[
					PR.PR_STRING,
					/^\'(?:[^\n\r\f\\\']|\\(?:\r\n?|\n|\f)|\\[\s\S])*\'/,
					null
				],
				["lang-css-str", /^url\(([^\)\"\']+)\)/i],
				[
					PR.PR_KEYWORD,
					/^(?:url|rgb|\!important|@import|@page|@media|@charset|inherit)(?=[^\-\w]|$)/i,
					null
				],
				[
					"lang-css-kw",
					/^(-?(?:[_a-z]|(?:\\[0-9a-f]+ ?))(?:[_a-z0-9\-]|\\(?:\\[0-9a-f]+ ?))*)\s*:/i
				],
				[PR.PR_COMMENT, /^\/\*[^*]*\*+(?:[^\/*][^*]*\*+)*\//],
				[PR.PR_COMMENT, /^(?:<!--|-->)/],
				[PR.PR_LITERAL, /^(?:\d+|\d*\.\d+)(?:%|[a-z]+)?/i],
				[PR.PR_LITERAL, /^#(?:[0-9a-f]{3}){1,2}\b/i],
				[
					PR.PR_PLAIN,
					/^-?(?:[_a-z]|(?:\\[\da-f]+ ?))(?:[_a-z\d\-]|\\(?:\\[\da-f]+ ?))*/i
				],
				[PR.PR_PUNCTUATION, /^[^\s\w\'\"]+/]
			]
		),
		["css"]
	),
	PR.registerLangHandler(
		PR.createSimpleLexer(
			[],
			[
				[
					PR.PR_KEYWORD,
					/^-?(?:[_a-z]|(?:\\[\da-f]+ ?))(?:[_a-z\d\-]|\\(?:\\[\da-f]+ ?))*/i
				]
			]
		),
		["css-kw"]
	),
	PR.registerLangHandler(
		PR.createSimpleLexer([], [[PR.PR_STRING, /^[^\)\"\']+/]]),
		["css-str"]
	);

function _typeof(obj) {
	if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
		_typeof = function _typeof(obj) {
			return typeof obj;
		};
	} else {
		_typeof = function _typeof(obj) {
			return obj &&
				typeof Symbol === "function" &&
				obj.constructor === Symbol &&
				obj !== Symbol.prototype
				? "symbol"
				: typeof obj;
		};
	}
	return _typeof(obj);
}

!(function(t, i) {
	"use strict";

	t.getSize = i();
})("undefined" != typeof window ? window : this, function() {
	"use strict";

	function t(t) {
		var i = parseFloat(t),
			e = -1 === t.indexOf("%") && !isNaN(i);
		return e && i;
	}

	function i() {}

	function e() {
		for (
			var t = {
					width: 0,
					height: 0,
					innerWidth: 0,
					innerHeight: 0,
					outerWidth: 0,
					outerHeight: 0
				},
				i = 0;
			u > i;
			i++
		) {
			var e = h[i];
			t[e] = 0;
		}

		return t;
	}

	function n(t) {
		var i = getComputedStyle(t);
		return (
			i ||
				a(
					"Style returned " +
						i +
						". Are you running this code in a hidden iframe on Firefox? See http://bit.ly/getsizebug1"
				),
			i
		);
	}

	function s() {
		if (!c) {
			c = !0;
			var i = document.createElement("div");
			(i.style.width = "200px"),
				(i.style.padding = "1px 2px 3px 4px"),
				(i.style.borderStyle = "solid"),
				(i.style.borderWidth = "1px 2px 3px 4px"),
				(i.style.boxSizing = "border-box");
			var e = document.body || document.documentElement;
			e.appendChild(i);
			var s = n(i);
			(o.isBoxSizeOuter = r = 200 === t(s.width)), e.removeChild(i);
		}
	}

	function o(i) {
		if (
			(s(),
			"string" == typeof i && (i = document.querySelector(i)),
			i && "object" == _typeof(i) && i.nodeType)
		) {
			var o = n(i);
			if ("none" === o.display) return e();
			var a = {};
			(a.width = i.offsetWidth), (a.height = i.offsetHeight);

			for (
				var c = (a.isBorderBox = "border-box" === o.boxSizing), d = 0;
				u > d;
				d++
			) {
				var l = h[d],
					f = o[l],
					g = parseFloat(f);
				a[l] = isNaN(g) ? 0 : g;
			}

			var p = a.paddingLeft + a.paddingRight,
				m = a.paddingTop + a.paddingBottom,
				y = a.marginLeft + a.marginRight,
				v = a.marginTop + a.marginBottom,
				_ = a.borderLeftWidth + a.borderRightWidth,
				w = a.borderTopWidth + a.borderBottomWidth,
				x = c && r,
				E = t(o.width);

			E !== !1 && (a.width = E + (x ? 0 : p + _));
			var b = t(o.height);
			return (
				b !== !1 && (a.height = b + (x ? 0 : m + w)),
				(a.innerWidth = a.width - (p + _)),
				(a.innerHeight = a.height - (m + w)),
				(a.outerWidth = a.width + y),
				(a.outerHeight = a.height + v),
				a
			);
		}
	}

	var r,
		a =
			"undefined" == typeof console
				? i
				: function(t) {
						console.error(t);
				  },
		h = [
			"paddingLeft",
			"paddingRight",
			"paddingTop",
			"paddingBottom",
			"marginLeft",
			"marginRight",
			"marginTop",
			"marginBottom",
			"borderLeftWidth",
			"borderRightWidth",
			"borderTopWidth",
			"borderBottomWidth"
		],
		u = h.length,
		c = !1;
	return o;
}),
	(function(t, i) {
		t.EvEmitter = i();
	})("undefined" != typeof window ? window : this, function() {
		function t() {}

		var i = t.prototype;
		return (
			(i.on = function(t, i) {
				if (t && i) {
					var e = (this._events = this._events || {}),
						n = (e[t] = e[t] || []);
					return -1 === n.indexOf(i) && n.push(i), this;
				}
			}),
			(i.once = function(t, i) {
				if (t && i) {
					this.on(t, i);
					var e = (this._onceEvents = this._onceEvents || {}),
						n = (e[t] = e[t] || {});
					return (n[i] = !0), this;
				}
			}),
			(i.off = function(t, i) {
				var e = this._events && this._events[t];

				if (e && e.length) {
					var n = e.indexOf(i);
					return -1 !== n && e.splice(n, 1), this;
				}
			}),
			(i.emitEvent = function(t, i) {
				var e = this._events && this._events[t];

				if (e && e.length) {
					var n = 0,
						s = e[n];
					i = i || [];

					for (var o = this._onceEvents && this._onceEvents[t]; s; ) {
						var r = o && o[s];
						r && (this.off(t, s), delete o[s]),
							s.apply(this, i),
							(n += r ? 0 : 1),
							(s = e[n]);
					}

					return this;
				}
			}),
			t
		);
	}),
	(function(t, i) {
		"use strict";

		t.matchesSelector = i();
	})("undefined" != typeof window ? window : this, function() {
		"use strict";

		var t = (function() {
			var t = Element.prototype;
			if (t.matches) return "matches";
			if (t.matchesSelector) return "matchesSelector";

			for (
				var i = ["webkit", "moz", "ms", "o"], e = 0;
				e < i.length;
				e++
			) {
				var n = i[e],
					s = n + "MatchesSelector";
				if (t[s]) return s;
			}
		})();

		return function(i, e) {
			return i[t](e);
		};
	}),
	(function(t, i) {
		t.fizzyUIUtils = i(t, t.matchesSelector);
	})("undefined" != typeof window ? window : this, function(t, i) {
		var e = {};
		(e.extend = function(t, i) {
			for (var e in i) {
				i.hasOwnProperty(e) && (t[e] = i[e]);
			}

			return t;
		}),
			(e.modulo = function(t, i) {
				return ((t % i) + i) % i;
			}),
			(e.makeArray = function(t) {
				var i = [];
				if (Array.isArray(t)) i = t;
				else if (t && "number" == typeof t.length)
					for (var e = 0; e < t.length; e++) {
						i.push(t[e]);
					}
				else i.push(t);
				return i;
			}),
			(e.removeFrom = function(t, i) {
				var e = t.indexOf(i);
				-1 !== e && t.splice(e, 1);
			}),
			(e.getParent = function(t, e) {
				for (; t !== document.body; ) {
					if (((t = t.parentNode), i(t, e))) return t;
				}
			}),
			(e.getQueryElement = function(t) {
				return "string" == typeof t ? document.querySelector(t) : t;
			}),
			(e.handleEvent = function(t) {
				var i = "on" + t.type;
				this[i] && this[i](t);
			}),
			(e.filterFindElements = function(t, n) {
				t = e.makeArray(t);
				var s = [];
				return (
					t.forEach(function(t) {
						if (t instanceof HTMLElement) {
							if (!n) return void s.push(t);
							i(t, n) && s.push(t);

							for (
								var e = t.querySelectorAll(n), o = 0;
								o < e.length;
								o++
							) {
								s.push(e[o]);
							}
						}
					}),
					s
				);
			}),
			(e.debounceMethod = function(t, i, e) {
				var n = t.prototype[i],
					s = i + "Timeout";

				t.prototype[i] = function() {
					var t = this[s];
					t && clearTimeout(t);
					var i = arguments,
						o = this;
					this[s] = setTimeout(function() {
						n.apply(o, i), delete o[s];
					}, e || 100);
				};
			}),
			(e.docReady = function(t) {
				"complete" === document.readyState
					? t()
					: document.addEventListener("DOMContentLoaded", t);
			}),
			(e.toDashed = function(t) {
				return t
					.replace(/(.)([A-Z])/g, function(t, i, e) {
						return i + "-" + e;
					})
					.toLowerCase();
			});
		var n = t.console;
		return (
			(e.htmlInit = function(i, s) {
				e.docReady(function() {
					var o = e.toDashed(s),
						r = "data-" + o,
						a = document.querySelectorAll("[" + r + "]"),
						h = document.querySelectorAll(".js-" + o),
						u = e.makeArray(a).concat(e.makeArray(h)),
						c = r + "-options",
						d = t.jQuery;
					u.forEach(function(t) {
						var e,
							o = t.getAttribute(r) || t.getAttribute(c);

						try {
							e = o && JSON.parse(o);
						} catch (a) {
							return void (
								n &&
								n.error(
									"Error parsing " +
										r +
										" on " +
										t.className +
										": " +
										a
								)
							);
						}

						var h = new i(t, e);
						d && d.data(t, s, h);
					});
				});
			}),
			e
		);
	}),
	(function(t, i) {
		(t.Outlayer = {}), (t.Outlayer.Item = i(t.EvEmitter, t.getSize));
	})("undefined" != typeof window ? window : this, function(t, i) {
		"use strict";

		function e(t) {
			for (var i in t) {
				if (t.hasOwnProperty(i)) return !1;
			}

			return (i = null), !0;
		}

		function n(t, i) {
			t &&
				((this.element = t),
				(this.layout = i),
				(this.position = {
					x: 0,
					y: 0
				}),
				this._create());
		}

		function s(t) {
			return t.replace(/([A-Z])/g, function(t) {
				return "-" + t.toLowerCase();
			});
		}

		var o = document.documentElement.style,
			r =
				"string" == typeof o.transition
					? "transition"
					: "WebkitTransition",
			a =
				"string" == typeof o.transform
					? "transform"
					: "WebkitTransform",
			h = {
				WebkitTransition: "webkitTransitionEnd",
				transition: "transitionend"
			}[r],
			u = {
				transform: a,
				transition: r,
				transitionDuration: r + "Duration",
				transitionProperty: r + "Property",
				transitionDelay: r + "Delay"
			},
			c = (n.prototype = Object.create(t.prototype));
		(c.constructor = n),
			(c._create = function() {
				(this._transn = {
					ingProperties: {},
					clean: {},
					onEnd: {}
				}),
					this.css({
						position: "absolute"
					});
			}),
			(c.handleEvent = function(t) {
				var i = "on" + t.type;
				this[i] && this[i](t);
			}),
			(c.getSize = function() {
				this.size = i(this.element);
			}),
			(c.css = function(t) {
				var i = this.element.style;

				for (var e in t) {
					if (t.hasOwnProperty(e)) {
						var n = u[e] || e;
						i[n] = t[e];
					}
				}
			}),
			(c.getPosition = function() {
				var t = getComputedStyle(this.element),
					i = this.layout._getOption("originLeft"),
					e = this.layout._getOption("originTop"),
					n = t[i ? "left" : "right"],
					s = t[e ? "top" : "bottom"],
					o = this.layout.size,
					r =
						-1 !== n.indexOf("%")
							? (parseFloat(n) / 100) * o.width
							: parseInt(n, 10),
					a =
						-1 !== s.indexOf("%")
							? (parseFloat(s) / 100) * o.height
							: parseInt(s, 10);

				(r = isNaN(r) ? 0 : r),
					(a = isNaN(a) ? 0 : a),
					(r -= i ? o.paddingLeft : o.paddingRight),
					(a -= e ? o.paddingTop : o.paddingBottom),
					(this.position.x = r),
					(this.position.y = a);
			}),
			(c.layoutPosition = function() {
				var t = this.layout.size,
					i = {},
					e = this.layout._getOption("originLeft"),
					n = this.layout._getOption("originTop"),
					s = e ? "paddingLeft" : "paddingRight",
					o = e ? "left" : "right",
					r = e ? "right" : "left",
					a = this.position.x + t[s];

				(i[o] = this.getXValue(a)), (i[r] = "");
				var h = n ? "paddingTop" : "paddingBottom",
					u = n ? "top" : "bottom",
					c = n ? "bottom" : "top",
					d = this.position.y + t[h];
				(i[u] = this.getYValue(d)),
					(i[c] = ""),
					this.css(i),
					this.emitEvent("layout", [this]);
			}),
			(c.getXValue = function(t) {
				var i = this.layout._getOption("horizontal");

				return this.layout.options.percentPosition && !i
					? (t / this.layout.size.width) * 100 + "%"
					: t + "px";
			}),
			(c.getYValue = function(t) {
				var i = this.layout._getOption("horizontal");

				return this.layout.options.percentPosition && i
					? (t / this.layout.size.height) * 100 + "%"
					: t + "px";
			}),
			(c._transitionTo = function(t, i) {
				this.getPosition();
				var e = this.position.x,
					n = this.position.y,
					s = parseInt(t, 10),
					o = parseInt(i, 10),
					r = s === this.position.x && o === this.position.y;
				if ((this.setPosition(t, i), r && !this.isTransitioning))
					return void this.layoutPosition();
				var a = t - e,
					h = i - n,
					u = {};
				(u.transform = this.getTranslate(a, h)),
					this.transition({
						to: u,
						onTransitionEnd: {
							transform: this.layoutPosition
						},
						isCleaning: !0
					});
			}),
			(c.getTranslate = function(t, i) {
				var e = this.layout._getOption("originLeft"),
					n = this.layout._getOption("originTop");

				return (
					(t = e ? t : -t),
					(i = n ? i : -i),
					"translate3d(" + t + "px, " + i + "px, 0)"
				);
			}),
			(c.goTo = function(t, i) {
				this.setPosition(t, i), this.layoutPosition();
			}),
			(c.moveTo = c._transitionTo),
			(c.setPosition = function(t, i) {
				(this.position.x = parseInt(t, 10)),
					(this.position.y = parseInt(i, 10));
			}),
			(c._nonTransition = function(t) {
				this.css(t.to), t.isCleaning && this._removeStyles(t.to);

				for (var i in t.onTransitionEnd) {
					t.onTransitionEnd.hasOwnProperty(i) &&
						t.onTransitionEnd[i].call(this);
				}
			}),
			(c.transition = function(t) {
				if (!parseFloat(this.layout.options.transitionDuration))
					return void this._nonTransition(t);
				var i = this._transn;

				for (var e in t.onTransitionEnd) {
					t.onTransitionEnd.hasOwnProperty(e) &&
						(i.onEnd[e] = t.onTransitionEnd[e]);
				}

				for (e in t.to) {
					t.to.hasOwnProperty(e) &&
						((i.ingProperties[e] = !0),
						t.isCleaning && (i.clean[e] = !0));
				}

				if (t.from) {
					this.css(t.from);
					var n = this.element.offsetHeight;
					n = null;
				}

				this.enableTransition(t.to),
					this.css(t.to),
					(this.isTransitioning = !0);
			});
		var d = "opacity," + s(a);
		(c.enableTransition = function() {
			if (!this.isTransitioning) {
				var t = this.layout.options.transitionDuration;
				(t = "number" == typeof t ? t + "ms" : t),
					this.css({
						transitionProperty: d,
						transitionDuration: t,
						transitionDelay: this.staggerDelay || 0
					}),
					this.element.addEventListener(h, this, !1);
			}
		}),
			(c.onwebkitTransitionEnd = function(t) {
				this.ontransitionend(t);
			}),
			(c.onotransitionend = function(t) {
				this.ontransitionend(t);
			});
		var l = {
			"-webkit-transform": "transform"
		};
		(c.ontransitionend = function(t) {
			if (t.target === this.element) {
				var i = this._transn,
					n = l[t.propertyName] || t.propertyName;

				if (
					(delete i.ingProperties[n],
					e(i.ingProperties) && this.disableTransition(),
					n in i.clean &&
						((this.element.style[t.propertyName] = ""),
						delete i.clean[n]),
					n in i.onEnd)
				) {
					var s = i.onEnd[n];
					s.call(this), delete i.onEnd[n];
				}

				this.emitEvent("transitionEnd", [this]);
			}
		}),
			(c.disableTransition = function() {
				this.removeTransitionStyles(),
					this.element.removeEventListener(h, this, !1),
					(this.isTransitioning = !1);
			}),
			(c._removeStyles = function(t) {
				var i = {};

				for (var e in t) {
					t.hasOwnProperty(e) && (i[e] = "");
				}

				this.css(i);
			});
		var f = {
			transitionProperty: "",
			transitionDuration: "",
			transitionDelay: ""
		};
		return (
			(c.removeTransitionStyles = function() {
				this.css(f);
			}),
			(c.stagger = function(t) {
				(t = isNaN(t) ? 0 : t), (this.staggerDelay = t + "ms");
			}),
			(c.removeElem = function() {
				this.element.parentNode.removeChild(this.element),
					this.css({
						display: ""
					}),
					this.emitEvent("remove", [this]);
			}),
			(c.remove = function() {
				return r && parseFloat(this.layout.options.transitionDuration)
					? (this.once("transitionEnd", function() {
							this.removeElem();
					  }),
					  void this.hide())
					: void this.removeElem();
			}),
			(c.reveal = function() {
				delete this.isHidden,
					this.css({
						display: ""
					});
				var t = this.layout.options,
					i = {},
					e = this.getHideRevealTransitionEndProperty("visibleStyle");
				(i[e] = this.onRevealTransitionEnd),
					this.transition({
						from: t.hiddenStyle,
						to: t.visibleStyle,
						isCleaning: !0,
						onTransitionEnd: i
					});
			}),
			(c.onRevealTransitionEnd = function() {
				this.isHidden || this.emitEvent("reveal");
			}),
			(c.getHideRevealTransitionEndProperty = function(t) {
				var i = this.layout.options[t];
				if (i.opacity) return "opacity";

				for (var e in i) {
					if (i.hasOwnProperty(e)) return e;
				}
			}),
			(c.hide = function() {
				(this.isHidden = !0),
					this.css({
						display: ""
					});
				var t = this.layout.options,
					i = {},
					e = this.getHideRevealTransitionEndProperty("hiddenStyle");
				(i[e] = this.onHideTransitionEnd),
					this.transition({
						from: t.visibleStyle,
						to: t.hiddenStyle,
						isCleaning: !0,
						onTransitionEnd: i
					});
			}),
			(c.onHideTransitionEnd = function() {
				this.isHidden &&
					(this.css({
						display: "none"
					}),
					this.emitEvent("hide"));
			}),
			(c.destroy = function() {
				this.css({
					position: "",
					left: "",
					right: "",
					top: "",
					bottom: "",
					transition: "",
					transform: ""
				});
			}),
			n
		);
	}),
	(function(t, i) {
		"use strict";

		t.Outlayer = i(
			t,
			t.EvEmitter,
			t.getSize,
			t.fizzyUIUtils,
			t.Outlayer.Item
		);
	})("undefined" != typeof window ? window : this, function(t, i, e, n, s) {
		"use strict";

		function o(t, i) {
			var e = n.getQueryElement(t);
			if (!e)
				return void (
					h &&
					h.error(
						"Bad element for " +
							this.constructor.namespace +
							": " +
							(e || t)
					)
				);
			(this.element = e),
				u && (this.$element = u(this.element)),
				(this.options = n.extend({}, this.constructor.defaults)),
				this.option(i);
			var s = ++d;
			(this.element.outlayerGUID = s), (l[s] = this), this._create();

			var o = this._getOption("initLayout");

			o && this.layout();
		}

		function r(t) {
			function i() {
				t.apply(this, arguments);
			}

			return (
				(i.prototype = Object.create(t.prototype)),
				(i.prototype.constructor = i),
				i
			);
		}

		function a(t) {
			if ("number" == typeof t) return t;
			var i = t.match(/(^\d*\.?\d*)(\w*)/),
				e = i && i[1],
				n = i && i[2];
			if (!e.length) return 0;
			e = parseFloat(e);
			var s = g[n] || 1;
			return e * s;
		}

		var h = t.console,
			u = t.jQuery,
			c = function c() {},
			d = 0,
			l = {};

		(o.namespace = "outlayer"),
			(o.Item = s),
			(o.defaults = {
				containerStyle: {
					position: "relative"
				},
				initLayout: !0,
				originLeft: !0,
				originTop: !0,
				resize: !0,
				resizeContainer: !0,
				transitionDuration: "0.4s",
				hiddenStyle: {
					opacity: 0,
					transform: "scale(0.001)"
				},
				visibleStyle: {
					opacity: 1,
					transform: "scale(1)"
				}
			});
		var f = o.prototype;
		n.extend(f, i.prototype),
			(f.option = function(t) {
				n.extend(this.options, t);
			}),
			(f._getOption = function(t) {
				var i = this.constructor.compatOptions[t];
				return i && void 0 !== this.options[i]
					? this.options[i]
					: this.options[t];
			}),
			(o.compatOptions = {
				initLayout: "isInitLayout",
				horizontal: "isHorizontal",
				layoutInstant: "isLayoutInstant",
				originLeft: "isOriginLeft",
				originTop: "isOriginTop",
				resize: "isResizeBound",
				resizeContainer: "isResizingContainer"
			}),
			(f._create = function() {
				this.reloadItems(),
					(this.stamps = []),
					this.stamp(this.options.stamp),
					n.extend(this.element.style, this.options.containerStyle);

				var t = this._getOption("resize");

				t && this.bindResize();
			}),
			(f.reloadItems = function() {
				this.items = this._itemize(this.element.children);
			}),
			(f._itemize = function(t) {
				for (
					var i = this._filterFindItemElements(t),
						e = this.constructor.Item,
						n = [],
						s = 0;
					s < i.length;
					s++
				) {
					var o = i[s],
						r = new e(o, this);
					n.push(r);
				}

				return n;
			}),
			(f._filterFindItemElements = function(t) {
				return n.filterFindElements(t, this.options.itemSelector);
			}),
			(f.getItemElements = function() {
				return this.items.map(function(t) {
					return t.element;
				});
			}),
			(f.layout = function() {
				this._resetLayout(), this._manageStamps();

				var t = this._getOption("layoutInstant"),
					i = void 0 !== t ? t : !this._isLayoutInited;

				this.layoutItems(this.items, i), (this._isLayoutInited = !0);
			}),
			(f._init = f.layout),
			(f._resetLayout = function() {
				this.getSize();
			}),
			(f.getSize = function() {
				this.size = e(this.element);
			}),
			(f._getMeasurement = function(t, i) {
				var n,
					s = this.options[t];
				s
					? ("string" == typeof s
							? (n = this.element.querySelector(s))
							: s instanceof HTMLElement && (n = s),
					  (this[t] = n ? e(n)[i] : s))
					: (this[t] = 0);
			}),
			(f.layoutItems = function(t, i) {
				(t = this._getItemsForLayout(t)),
					this._layoutItems(t, i),
					this._postLayout();
			}),
			(f._getItemsForLayout = function(t) {
				return t.filter(function(t) {
					return !t.isIgnored;
				});
			}),
			(f._layoutItems = function(t, i) {
				if ((this._emitCompleteOnItems("layout", t), t && t.length)) {
					var e = [];
					t.forEach(function(t) {
						var n = this._getItemLayoutPosition(t);

						(n.item = t),
							(n.isInstant = i || t.isLayoutInstant),
							e.push(n);
					}, this),
						this._processLayoutQueue(e);
				}
			}),
			(f._getItemLayoutPosition = function() {
				return {
					x: 0,
					y: 0
				};
			}),
			(f._processLayoutQueue = function(t) {
				this.updateStagger(),
					t.forEach(function(t, i) {
						this._positionItem(t.item, t.x, t.y, t.isInstant, i);
					}, this);
			}),
			(f.updateStagger = function() {
				var t = this.options.stagger;
				return null === t || void 0 === t
					? void (this.stagger = 0)
					: ((this.stagger = a(t)), this.stagger);
			}),
			(f._positionItem = function(t, i, e, n, s) {
				n
					? t.goTo(i, e)
					: (t.stagger(s * this.stagger), t.moveTo(i, e));
			}),
			(f._postLayout = function() {
				this.resizeContainer();
			}),
			(f.resizeContainer = function() {
				var t = this._getOption("resizeContainer");

				if (t) {
					var i = this._getContainerSize();

					i &&
						(this._setContainerMeasure(i.width, !0),
						this._setContainerMeasure(i.height, !1));
				}
			}),
			(f._getContainerSize = c),
			(f._setContainerMeasure = function(t, i) {
				if (void 0 !== t) {
					var e = this.size;
					e.isBorderBox &&
						(t += i
							? e.paddingLeft +
							  e.paddingRight +
							  e.borderLeftWidth +
							  e.borderRightWidth
							: e.paddingBottom +
							  e.paddingTop +
							  e.borderTopWidth +
							  e.borderBottomWidth),
						(t = Math.max(t, 0)),
						(this.element.style[i ? "width" : "height"] = t + "px");
				}
			}),
			(f._emitCompleteOnItems = function(t, i) {
				function e() {
					s.dispatchEvent(t + "Complete", null, [i]);
				}

				function n() {
					r++, r === o && e();
				}

				var s = this,
					o = i.length;
				if (!i || !o) return void e();
				var r = 0;
				i.forEach(function(i) {
					i.once(t, n);
				});
			}),
			(f.dispatchEvent = function(t, i, e) {
				var n = i ? [i].concat(e) : e;
				if ((this.emitEvent(t, n), u))
					if (
						((this.$element = this.$element || u(this.element)), i)
					) {
						var s = u.Event(i);
						(s.type = t), this.$element.trigger(s, e);
					} else this.$element.trigger(t, e);
			}),
			(f.ignore = function(t) {
				var i = this.getItem(t);
				i && (i.isIgnored = !0);
			}),
			(f.unignore = function(t) {
				var i = this.getItem(t);
				i && delete i.isIgnored;
			}),
			(f.stamp = function(t) {
				(t = this._find(t)),
					t &&
						((this.stamps = this.stamps.concat(t)),
						t.forEach(this.ignore, this));
			}),
			(f.unstamp = function(t) {
				(t = this._find(t)),
					t &&
						t.forEach(function(t) {
							n.removeFrom(this.stamps, t), this.unignore(t);
						}, this);
			}),
			(f._find = function(t) {
				return t
					? ("string" == typeof t &&
							(t = this.element.querySelectorAll(t)),
					  (t = n.makeArray(t)))
					: void 0;
			}),
			(f._manageStamps = function() {
				this.stamps &&
					this.stamps.length &&
					(this._getBoundingRect(),
					this.stamps.forEach(this._manageStamp, this));
			}),
			(f._getBoundingRect = function() {
				var t = this.element.getBoundingClientRect(),
					i = this.size;
				this._boundingRect = {
					left: t.left + i.paddingLeft + i.borderLeftWidth,
					top: t.top + i.paddingTop + i.borderTopWidth,
					right: t.right - (i.paddingRight + i.borderRightWidth),
					bottom: t.bottom - (i.paddingBottom + i.borderBottomWidth)
				};
			}),
			(f._manageStamp = c),
			(f._getElementOffset = function(t) {
				var i = t.getBoundingClientRect(),
					n = this._boundingRect,
					s = e(t),
					o = {
						left: i.left - n.left - s.marginLeft,
						top: i.top - n.top - s.marginTop,
						right: n.right - i.right - s.marginRight,
						bottom: n.bottom - i.bottom - s.marginBottom
					};
				return o;
			}),
			(f.handleEvent = n.handleEvent),
			(f.bindResize = function() {
				t.addEventListener("resize", this), (this.isResizeBound = !0);
			}),
			(f.unbindResize = function() {
				t.removeEventListener("resize", this),
					(this.isResizeBound = !1);
			}),
			(f.onresize = function() {
				this.resize();
			}),
			n.debounceMethod(o, "onresize", 100),
			(f.resize = function() {
				this.isResizeBound && this.needsResizeLayout() && this.layout();
			}),
			(f.needsResizeLayout = function() {
				var t = e(this.element),
					i = this.size && t;
				return i && t.innerWidth !== this.size.innerWidth;
			}),
			(f.addItems = function(t) {
				var i = this._itemize(t);

				return i.length && (this.items = this.items.concat(i)), i;
			}),
			(f.appended = function(t) {
				var i = this.addItems(t);
				i.length && (this.layoutItems(i, !0), this.reveal(i));
			}),
			(f.prepended = function(t) {
				var i = this._itemize(t);

				if (i.length) {
					var e = this.items.slice(0);
					(this.items = i.concat(e)),
						this._resetLayout(),
						this._manageStamps(),
						this.layoutItems(i, !0),
						this.reveal(i),
						this.layoutItems(e);
				}
			}),
			(f.reveal = function(t) {
				if ((this._emitCompleteOnItems("reveal", t), t && t.length)) {
					var i = this.updateStagger();
					t.forEach(function(t, e) {
						t.stagger(e * i), t.reveal();
					});
				}
			}),
			(f.hide = function(t) {
				if ((this._emitCompleteOnItems("hide", t), t && t.length)) {
					var i = this.updateStagger();
					t.forEach(function(t, e) {
						t.stagger(e * i), t.hide();
					});
				}
			}),
			(f.revealItemElements = function(t) {
				var i = this.getItems(t);
				this.reveal(i);
			}),
			(f.hideItemElements = function(t) {
				var i = this.getItems(t);
				this.hide(i);
			}),
			(f.getItem = function(t) {
				for (var i = 0; i < this.items.length; i++) {
					var e = this.items[i];
					if (e.element === t) return e;
				}
			}),
			(f.getItems = function(t) {
				t = n.makeArray(t);
				var i = [];
				return (
					t.forEach(function(t) {
						var e = this.getItem(t);
						e && i.push(e);
					}, this),
					i
				);
			}),
			(f.remove = function(t) {
				var i = this.getItems(t);
				this._emitCompleteOnItems("remove", i),
					i &&
						i.length &&
						i.forEach(function(t) {
							t.remove(), n.removeFrom(this.items, t);
						}, this);
			}),
			(f.destroy = function() {
				var t = this.element.style;
				(t.height = ""),
					(t.position = ""),
					(t.width = ""),
					this.items.forEach(function(t) {
						t.destroy();
					}),
					this.unbindResize();
				var i = this.element.outlayerGUID;
				delete l[i],
					delete this.element.outlayerGUID,
					u && u.removeData(this.element, this.constructor.namespace);
			}),
			(o.data = function(t) {
				t = n.getQueryElement(t);
				var i = t && t.outlayerGUID;
				return i && l[i];
			}),
			(o.create = function(t, i) {
				var e = r(o);
				return (
					(e.defaults = n.extend({}, o.defaults)),
					n.extend(e.defaults, i),
					(e.compatOptions = n.extend({}, o.compatOptions)),
					(e.namespace = t),
					(e.data = o.data),
					(e.Item = r(s)),
					n.htmlInit(e, t),
					u && u.bridget && u.bridget(t, e),
					e
				);
			});
		var g = {
			ms: 1,
			s: 1e3
		};
		return (o.Item = s), o;
	}),
	(function(t, i) {
		(t.Packery = t.Packery || {}), (t.Packery.Rect = i());
	})("undefined" != typeof window ? window : this, function() {
		"use strict";

		function t(i) {
			for (var e in t.defaults) {
				t.defaults.hasOwnProperty(e) && (this[e] = t.defaults[e]);
			}

			for (e in i) {
				i.hasOwnProperty(e) && (this[e] = i[e]);
			}
		}

		t.defaults = {
			x: 0,
			y: 0,
			width: 0,
			height: 0
		};
		var i = t.prototype;
		return (
			(i.contains = function(t) {
				var i = t.width || 0,
					e = t.height || 0;
				return (
					this.x <= t.x &&
					this.y <= t.y &&
					this.x + this.width >= t.x + i &&
					this.y + this.height >= t.y + e
				);
			}),
			(i.overlaps = function(t) {
				var i = this.x + this.width,
					e = this.y + this.height,
					n = t.x + t.width,
					s = t.y + t.height;
				return this.x < n && i > t.x && this.y < s && e > t.y;
			}),
			(i.getMaximalFreeRects = function(i) {
				if (!this.overlaps(i)) return !1;
				var e,
					n = [],
					s = this.x + this.width,
					o = this.y + this.height,
					r = i.x + i.width,
					a = i.y + i.height;
				return (
					this.y < i.y &&
						((e = new t({
							x: this.x,
							y: this.y,
							width: this.width,
							height: i.y - this.y
						})),
						n.push(e)),
					s > r &&
						((e = new t({
							x: r,
							y: this.y,
							width: s - r,
							height: this.height
						})),
						n.push(e)),
					o > a &&
						((e = new t({
							x: this.x,
							y: a,
							width: this.width,
							height: o - a
						})),
						n.push(e)),
					this.x < i.x &&
						((e = new t({
							x: this.x,
							y: this.y,
							width: i.x - this.x,
							height: this.height
						})),
						n.push(e)),
					n
				);
			}),
			(i.canFit = function(t) {
				return this.width >= t.width && this.height >= t.height;
			}),
			t
		);
	}),
	(function(t, i) {
		var e = (t.Packery = t.Packery || {});
		e.Packer = i(e.Rect);
	})("undefined" != typeof window ? window : this, function(t) {
		"use strict";

		function i(t, i, e) {
			(this.width = t || 0),
				(this.height = i || 0),
				(this.sortDirection = e || "downwardLeftToRight"),
				this.reset();
		}

		var e = i.prototype;
		(e.reset = function() {
			this.spaces = [];
			var i = new t({
				x: 0,
				y: 0,
				width: this.width,
				height: this.height
			});
			this.spaces.push(i),
				(this.sorter = n[this.sortDirection] || n.downwardLeftToRight);
		}),
			(e.pack = function(t) {
				for (var i = 0; i < this.spaces.length; i++) {
					var e = this.spaces[i];

					if (e.canFit(t)) {
						this.placeInSpace(t, e);
						break;
					}
				}
			}),
			(e.columnPack = function(t) {
				for (var i = 0; i < this.spaces.length; i++) {
					var e = this.spaces[i],
						n =
							e.x <= t.x &&
							e.x + e.width >= t.x + t.width &&
							e.height >= t.height - 0.01;

					if (n) {
						(t.y = e.y), this.placed(t);
						break;
					}
				}
			}),
			(e.rowPack = function(t) {
				for (var i = 0; i < this.spaces.length; i++) {
					var e = this.spaces[i],
						n =
							e.y <= t.y &&
							e.y + e.height >= t.y + t.height &&
							e.width >= t.width - 0.01;

					if (n) {
						(t.x = e.x), this.placed(t);
						break;
					}
				}
			}),
			(e.placeInSpace = function(t, i) {
				(t.x = i.x), (t.y = i.y), this.placed(t);
			}),
			(e.placed = function(t) {
				for (var i = [], e = 0; e < this.spaces.length; e++) {
					var n = this.spaces[e],
						s = n.getMaximalFreeRects(t);
					s ? i.push.apply(i, s) : i.push(n);
				}

				(this.spaces = i), this.mergeSortSpaces();
			}),
			(e.mergeSortSpaces = function() {
				i.mergeRects(this.spaces), this.spaces.sort(this.sorter);
			}),
			(e.addSpace = function(t) {
				this.spaces.push(t), this.mergeSortSpaces();
			}),
			(i.mergeRects = function(t) {
				var i = 0,
					e = t[i];

				t: for (; e; ) {
					for (var n = 0, s = t[i + n]; s; ) {
						if (s === e) n++;
						else {
							if (s.contains(e)) {
								t.splice(i, 1), (e = t[i]);
								continue t;
							}

							e.contains(s) ? t.splice(i + n, 1) : n++;
						}
						s = t[i + n];
					}

					i++, (e = t[i]);
				}

				return t;
			});
		var n = {
			downwardLeftToRight: function downwardLeftToRight(t, i) {
				return t.y - i.y || t.x - i.x;
			},
			rightwardTopToBottom: function rightwardTopToBottom(t, i) {
				return t.x - i.x || t.y - i.y;
			}
		};
		return i;
	}),
	(function(t, i) {
		t.Packery.Item = i(t.Outlayer, t.Packery.Rect);
	})("undefined" != typeof window ? window : this, function(t, i) {
		"use strict";

		var e = document.documentElement.style,
			n =
				"string" == typeof e.transform
					? "transform"
					: "WebkitTransform",
			s = function s() {
				t.Item.apply(this, arguments);
			},
			o = (s.prototype = Object.create(t.Item.prototype)),
			r = o._create;

		o._create = function() {
			r.call(this), (this.rect = new i());
		};

		var a = o.moveTo;
		return (
			(o.moveTo = function(t, i) {
				var e = Math.abs(this.position.x - t),
					n = Math.abs(this.position.y - i),
					s =
						this.layout.dragItemCount &&
						!this.isPlacing &&
						!this.isTransitioning &&
						1 > e &&
						1 > n;
				return s ? void this.goTo(t, i) : void a.apply(this, arguments);
			}),
			(o.enablePlacing = function() {
				this.removeTransitionStyles(),
					this.isTransitioning &&
						n &&
						(this.element.style[n] = "none"),
					(this.isTransitioning = !1),
					this.getSize(),
					this.layout._setRectSize(this.element, this.rect),
					(this.isPlacing = !0);
			}),
			(o.disablePlacing = function() {
				this.isPlacing = !1;
			}),
			(o.removeElem = function() {
				this.element.parentNode.removeChild(this.element),
					this.layout.packer.addSpace(this.rect),
					this.emitEvent("remove", [this]);
			}),
			(o.showDropPlaceholder = function() {
				var t = this.dropPlaceholder;
				t ||
					((t = this.dropPlaceholder = document.createElement("div")),
					(t.className = "packery-drop-placeholder"),
					(t.style.position = "absolute")),
					(t.style.width = this.size.width + "px"),
					(t.style.height = this.size.height + "px"),
					this.positionDropPlaceholder(),
					this.layout.element.appendChild(t);
			}),
			(o.positionDropPlaceholder = function() {
				this.dropPlaceholder.style[n] =
					"translate(" + this.rect.x + "px, " + this.rect.y + "px)";
			}),
			(o.hideDropPlaceholder = function() {
				var t = this.dropPlaceholder.parentNode;
				t && t.removeChild(this.dropPlaceholder);
			}),
			s
		);
	}),
	(function(t, i) {
		t.Packery = i(
			t.getSize,
			t.Outlayer,
			t.Packery.Rect,
			t.Packery.Packer,
			t.Packery.Item
		);
	})("undefined" != typeof window ? window : this, function(t, i, e, n, s) {
		"use strict";

		function o(t, i) {
			return t.position.y - i.position.y || t.position.x - i.position.x;
		}

		function r(t, i) {
			return t.position.x - i.position.x || t.position.y - i.position.y;
		}

		function a(t, i) {
			var e = i.x - t.x,
				n = i.y - t.y;
			return Math.sqrt(e * e + n * n);
		}

		e.prototype.canFit = function(t) {
			return this.width >= t.width - 1 && this.height >= t.height - 1;
		};

		var h = i.create("packery");
		h.Item = s;
		var u = h.prototype;
		(u._create = function() {
			i.prototype._create.call(this),
				(this.packer = new n()),
				(this.shiftPacker = new n()),
				(this.isEnabled = !0),
				(this.dragItemCount = 0);
			var t = this;
			(this.handleDraggabilly = {
				dragStart: function dragStart() {
					t.itemDragStart(this.element);
				},
				dragMove: function dragMove() {
					t.itemDragMove(
						this.element,
						this.position.x,
						this.position.y
					);
				},
				dragEnd: function dragEnd() {
					t.itemDragEnd(this.element);
				}
			}),
				(this.handleUIDraggable = {
					start: function start(i, e) {
						e && t.itemDragStart(i.currentTarget);
					},
					drag: function drag(i, e) {
						e &&
							t.itemDragMove(
								i.currentTarget,
								e.position.left,
								e.position.top
							);
					},
					stop: function stop(i, e) {
						e && t.itemDragEnd(i.currentTarget);
					}
				});
		}),
			(u._resetLayout = function() {
				this.getSize(), this._getMeasurements();
				var t, i, e;
				this._getOption("horizontal")
					? ((t = 1 / 0),
					  (i = this.size.innerHeight + this.gutter),
					  (e = "rightwardTopToBottom"))
					: ((t = this.size.innerWidth + this.gutter),
					  (i = 1 / 0),
					  (e = "downwardLeftToRight")),
					(this.packer.width = this.shiftPacker.width = t),
					(this.packer.height = this.shiftPacker.height = i),
					(this.packer.sortDirection = this.shiftPacker.sortDirection = e),
					this.packer.reset(),
					(this.maxY = 0),
					(this.maxX = 0);
			}),
			(u._getMeasurements = function() {
				this._getMeasurement("columnWidth", "width"),
					this._getMeasurement("rowHeight", "height"),
					this._getMeasurement("gutter", "width");
			}),
			(u._getItemLayoutPosition = function(t) {
				if (
					(this._setRectSize(t.element, t.rect),
					this.isShifting || this.dragItemCount > 0)
				) {
					var i = this._getPackMethod();

					this.packer[i](t.rect);
				} else this.packer.pack(t.rect);

				return this._setMaxXY(t.rect), t.rect;
			}),
			(u.shiftLayout = function() {
				(this.isShifting = !0), this.layout(), delete this.isShifting;
			}),
			(u._getPackMethod = function() {
				return this._getOption("horizontal") ? "rowPack" : "columnPack";
			}),
			(u._setMaxXY = function(t) {
				(this.maxX = Math.max(t.x + t.width, this.maxX)),
					(this.maxY = Math.max(t.y + t.height, this.maxY));
			}),
			(u._setRectSize = function(i, e) {
				var n = t(i),
					s = n.outerWidth,
					o = n.outerHeight;
				(s || o) &&
					((s = this._applyGridGutter(s, this.columnWidth)),
					(o = this._applyGridGutter(o, this.rowHeight))),
					(e.width = Math.min(s, this.packer.width)),
					(e.height = Math.min(o, this.packer.height));
			}),
			(u._applyGridGutter = function(t, i) {
				if (!i) return t + this.gutter;
				i += this.gutter;
				var e = t % i,
					n = e && 1 > e ? "round" : "ceil";
				return (t = Math[n](t / i) * i);
			}),
			(u._getContainerSize = function() {
				return this._getOption("horizontal")
					? {
							width: this.maxX - this.gutter
					  }
					: {
							height: this.maxY - this.gutter
					  };
			}),
			(u._manageStamp = function(t) {
				var i,
					n = this.getItem(t);
				if (n && n.isPlacing) i = n.rect;
				else {
					var s = this._getElementOffset(t);

					i = new e({
						x: this._getOption("originLeft") ? s.left : s.right,
						y: this._getOption("originTop") ? s.top : s.bottom
					});
				}
				this._setRectSize(t, i),
					this.packer.placed(i),
					this._setMaxXY(i);
			}),
			(u.sortItemsByPosition = function() {
				var t = this._getOption("horizontal") ? r : o;
				this.items.sort(t);
			}),
			(u.fit = function(t, i, e) {
				var n = this.getItem(t);
				n &&
					(this.stamp(n.element),
					n.enablePlacing(),
					this.updateShiftTargets(n),
					(i = void 0 === i ? n.rect.x : i),
					(e = void 0 === e ? n.rect.y : e),
					this.shift(n, i, e),
					this._bindFitEvents(n),
					n.moveTo(n.rect.x, n.rect.y),
					this.shiftLayout(),
					this.unstamp(n.element),
					this.sortItemsByPosition(),
					n.disablePlacing());
			}),
			(u._bindFitEvents = function(t) {
				function i() {
					n++, 2 === n && e.dispatchEvent("fitComplete", null, [t]);
				}

				var e = this,
					n = 0;
				t.once("layout", i), this.once("layoutComplete", i);
			}),
			(u.resize = function() {
				this.isResizeBound &&
					this.needsResizeLayout() &&
					(this.options.shiftPercentResize
						? this.resizeShiftPercentLayout()
						: this.layout());
			}),
			(u.needsResizeLayout = function() {
				var i = t(this.element),
					e = this._getOption("horizontal")
						? "innerHeight"
						: "innerWidth";
				return i[e] !== this.size[e];
			}),
			(u.resizeShiftPercentLayout = function() {
				var i = this._getItemsForLayout(this.items),
					e = this._getOption("horizontal"),
					n = e ? "y" : "x",
					s = e ? "height" : "width",
					o = e ? "rowHeight" : "columnWidth",
					r = e ? "innerHeight" : "innerWidth",
					a = this[o];

				if ((a = a && a + this.gutter)) {
					this._getMeasurements();

					var h = this[o] + this.gutter;
					i.forEach(function(t) {
						var i = Math.round(t.rect[n] / a);
						t.rect[n] = i * h;
					});
				} else {
					var u = t(this.element)[r] + this.gutter,
						c = this.packer[s];
					i.forEach(function(t) {
						t.rect[n] = (t.rect[n] / c) * u;
					});
				}

				this.shiftLayout();
			}),
			(u.itemDragStart = function(t) {
				if (this.isEnabled) {
					this.stamp(t);
					var i = this.getItem(t);
					i &&
						(i.enablePlacing(),
						i.showDropPlaceholder(),
						this.dragItemCount++,
						this.updateShiftTargets(i));
				}
			}),
			(u.updateShiftTargets = function(t) {
				this.shiftPacker.reset(), this._getBoundingRect();

				var i = this._getOption("originLeft"),
					n = this._getOption("originTop");

				this.stamps.forEach(function(t) {
					var s = this.getItem(t);

					if (!s || !s.isPlacing) {
						var o = this._getElementOffset(t),
							r = new e({
								x: i ? o.left : o.right,
								y: n ? o.top : o.bottom
							});

						this._setRectSize(t, r), this.shiftPacker.placed(r);
					}
				}, this);

				var s = this._getOption("horizontal"),
					o = s ? "rowHeight" : "columnWidth",
					r = s ? "height" : "width";

				(this.shiftTargetKeys = []), (this.shiftTargets = []);
				var a,
					h = this[o];

				if ((h = h && h + this.gutter)) {
					var u = Math.ceil(t.rect[r] / h),
						c = Math.floor((this.shiftPacker[r] + this.gutter) / h);
					a = (c - u) * h;

					for (var d = 0; c > d; d++) {
						var l = s ? 0 : d * h,
							f = s ? d * h : 0;

						this._addShiftTarget(l, f, a);
					}
				} else
					(a = this.shiftPacker[r] + this.gutter - t.rect[r]),
						this._addShiftTarget(0, 0, a);

				var g = this._getItemsForLayout(this.items),
					p = this._getPackMethod();

				g.forEach(function(t) {
					var i = t.rect;
					this._setRectSize(t.element, i),
						this.shiftPacker[p](i),
						this._addShiftTarget(i.x, i.y, a);
					var e = s ? i.x + i.width : i.x,
						n = s ? i.y : i.y + i.height;
					if ((this._addShiftTarget(e, n, a), h))
						for (var o = Math.round(i[r] / h), u = 1; o > u; u++) {
							var c = s ? e : i.x + h * u,
								d = s ? i.y + h * u : n;

							this._addShiftTarget(c, d, a);
						}
				}, this);
			}),
			(u._addShiftTarget = function(t, i, e) {
				var n = this._getOption("horizontal") ? i : t;

				if (!(0 !== n && n > e)) {
					var s = t + "," + i,
						o = -1 !== this.shiftTargetKeys.indexOf(s);
					o ||
						(this.shiftTargetKeys.push(s),
						this.shiftTargets.push({
							x: t,
							y: i
						}));
				}
			}),
			(u.shift = function(t, i, e) {
				var n,
					s = 1 / 0,
					o = {
						x: i,
						y: e
					};
				this.shiftTargets.forEach(function(t) {
					var i = a(t, o);
					s > i && ((n = t), (s = i));
				}),
					(t.rect.x = n.x),
					(t.rect.y = n.y);
			});
		var c = 120;
		(u.itemDragMove = function(t, i, e) {
			function n() {
				o.shift(s, i, e), s.positionDropPlaceholder(), o.layout();
			}

			var s = this.isEnabled && this.getItem(t);

			if (s) {
				(i -= this.size.paddingLeft), (e -= this.size.paddingTop);
				var o = this,
					r = new Date();
				this._itemDragTime && r - this._itemDragTime < c
					? (clearTimeout(this.dragTimeout),
					  (this.dragTimeout = setTimeout(n, c)))
					: (n(), (this._itemDragTime = r));
			}
		}),
			(u.itemDragEnd = function(t) {
				function i() {
					n++,
						2 === n &&
							(e.element.classList.remove(
								"is-positioning-post-drag"
							),
							e.hideDropPlaceholder(),
							s.dispatchEvent("dragItemPositioned", null, [e]));
				}

				var e = this.isEnabled && this.getItem(t);

				if (e) {
					clearTimeout(this.dragTimeout),
						e.element.classList.add("is-positioning-post-drag");
					var n = 0,
						s = this;
					e.once("layout", i),
						this.once("layoutComplete", i),
						e.moveTo(e.rect.x, e.rect.y),
						this.layout(),
						(this.dragItemCount = Math.max(
							0,
							this.dragItemCount - 1
						)),
						this.sortItemsByPosition(),
						e.disablePlacing(),
						this.unstamp(e.element);
				}
			}),
			(u.bindDraggabillyEvents = function(t) {
				this._bindDraggabillyEvents(t, "on");
			}),
			(u.unbindDraggabillyEvents = function(t) {
				this._bindDraggabillyEvents(t, "off");
			}),
			(u._bindDraggabillyEvents = function(t, i) {
				var e = this.handleDraggabilly;
				t[i]("dragStart", e.dragStart),
					t[i]("dragMove", e.dragMove),
					t[i]("dragEnd", e.dragEnd);
			}),
			(u.bindUIDraggableEvents = function(t) {
				this._bindUIDraggableEvents(t, "on");
			}),
			(u.unbindUIDraggableEvents = function(t) {
				this._bindUIDraggableEvents(t, "off");
			}),
			(u._bindUIDraggableEvents = function(t, i) {
				var e = this.handleUIDraggable;
				t[i]("dragstart", e.start)
					[i]("drag", e.drag)
					[i]("dragstop", e.stop);
			});
		var d = u.destroy;
		return (
			(u.destroy = function() {
				d.apply(this, arguments), (this.isEnabled = !1);
			}),
			(h.Rect = e),
			(h.Packer = n),
			h
		);
	});
