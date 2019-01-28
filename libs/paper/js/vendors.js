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

		var logic = function logic() {
			_this.open();
		};

		var handleIframeLightboxLink = function handleIframeLightboxLink(e) {
			e.stopPropagation();
			e.preventDefault();
			debounce(logic, this.rate).call();
		};

		if (
			!this.trigger[classList].contains(iframeLightboxLinkIsBindedClass)
		) {
			this.trigger[classList].add(iframeLightboxLinkIsBindedClass);

			this.trigger[_addEventListener]("click", handleIframeLightboxLink);

			if (isTouch && (_this.touch || _this.dataTouch)) {
				this.trigger[_addEventListener](
					"touchstart",
					handleIframeLightboxLink
				);
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

	IframeLightbox.prototype.close = function() {
		this.el[classList].remove(isOpenedClass);
		this.body[classList].remove(isLoadedClass);
		docElem[classList].remove(iframeLightboxOpenClass);
		docBody[classList].remove(iframeLightboxOpenClass);
		this.callCallback(this.onClosed, this);
	};

	IframeLightbox.prototype.isOpen = function() {
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

	var callCallback = function callCallback(func, data) {
		if (typeof func !== "function") {
			return;
		}

		var caller = func.bind(this);
		caller(data);
	};

	var hideImgLightbox = function hideImgLightbox(callback) {
		var container =
			document[getElementsByClassName](containerClass)[0] || "";
		var img = container
			? container[getElementsByTagName]("img")[0] || ""
			: "";

		var hideContainer = function hideContainer() {
			container[classList].remove(fadeInClass);
			container[classList].add(fadeOutClass);

			var hideImg = function hideImg() {
				container[classList].remove(animatedClass);
				container[classList].remove(fadeOutClass);
				img[classList].remove(animatedClass);
				img[classList].remove(fadeOutDownClass);

				img.onload = function() {
					container[classList].remove(isLoadedClass);
				};

				img.src = dummySrc;
				container[style].display = "none";
				callCallback(callback, root);
			};

			var timer = setTimeout(function() {
				clearTimeout(timer);
				timer = null;
				hideImg();
			}, 400);
		};

		if (container && img) {
			img[classList].remove(fadeInUpClass);
			img[classList].add(fadeOutDownClass);
			var timer = setTimeout(function() {
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
		var container =
			document[getElementsByClassName](containerClass)[0] || "";
		var img = container
			? container[getElementsByTagName]("img")[0] || ""
			: "";

		if (!container) {
			container = document[createElement]("div");
			container[classList].add(containerClass);
			var html = [];
			html.push('<img src="' + dummySrc + '" alt="" />');
			html.push(
				'<div class="half-circle-spinner"><div class="circle circle-1"></div><div class="circle circle-2"></div></div>'
			);
			html.push('<a href="javascript:void(0);" class="btn-close"></a>');
			container[innerHTML] = html.join("");
			docBody[appendChild](container);
			img = container
				? container[getElementsByTagName]("img")[0] || ""
				: "";
			var btnClose = container
				? container[getElementsByClassName](btnCloseClass)[0] || ""
				: "";

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

			var handleImgLightboxLink = function handleImgLightboxLink(ev) {
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

					img.onload = function() {
						container[classList].add(isLoadedClass);

						if (onLoaded) {
							callCallback(onLoaded, root);
						}
					};

					img.onerror = function() {
						if (onError) {
							callCallback(onError, root);
						}
					};

					img.src = hrefString;
					container[style].display = "block";
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
			var margin = Math.max(
				options.margin !== null ? options.margin : 4,
				0.0
			);
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

			var e = document[createElementNS](
				"http://www.w3.org/2000/svg",
				"svg"
			);
			e[setAttributeNS](null, "viewBox", "0 0 " + size + " " + size);
			e[setAttributeNS](null, "style", "shape-rendering:crispEdges");
			var qrcodeId = "qrcode" + Date.now();
			e[setAttributeNS](null, "id", qrcodeId);
			var frag = document[createDocumentFragment]();
			/* var svg = ['<style scoped>.bg{fill:' + fillcolor + '}.fg{fill:' + textcolor + '}</style>', '<rect class="bg" x="0" y="0"', 'width="' + size + '" height="' + size + '"/>', ]; */

			var style = document[createElementNS](
				"http://www.w3.org/2000/svg",
				"style"
			);
			style[appendChild](
				document[createTextNode](
					"#" +
						qrcodeId +
						" .bg{fill:" +
						fillcolor +
						"}#" +
						qrcodeId +
						" .fg{fill:" +
						textcolor +
						"}"
				)
			);
			/* style[setAttributeNS](null, "scoped", "scoped"); */

			frag[appendChild](style);

			var createRect = function createRect(c, f, x, y, s) {
				var fg =
					document[createElementNS](
						"http://www.w3.org/2000/svg",
						"rect"
					) || "";
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
				void 0 !== this.current && this.sortTable(this.current, !0);
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
				s.initEvent(n, !0, !0);

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
