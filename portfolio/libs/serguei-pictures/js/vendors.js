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

!(function(e, t) {
	e.PhotoSwipe = t();
})("undefined" != typeof window ? window : this, function() {
	"use strict";

	var e = function e(_e2, t, n, o) {
		var i = {
			features: null,
			bind: function bind(e, t, n, o) {
				var i = (o ? "remove" : "add") + "EventListener";
				t = t.split(" ");

				for (var a = 0; a < t.length; a++) {
					t[a] && e[i](t[a], n, !1);
				}
			},
			isArray: function isArray(e) {
				return e instanceof Array;
			},
			createEl: function createEl(e, t) {
				var n = document.createElement(t || "div");
				return e && (n.className = e), n;
			},
			getScrollY: function getScrollY() {
				var e = window.pageYOffset;
				return void 0 !== e ? e : document.documentElement.scrollTop;
			},
			unbind: function unbind(e, t, n) {
				i.bind(e, t, n, true);
			},
			removeClass: function removeClass(e, t) {
				var n = new RegExp("(\\s|^)" + t + "(\\s|$)");
				e.className = e.className
					.replace(n, " ")
					.replace(/^\s\s*/, "")
					.replace(/\s\s*$/, "");
			},
			addClass: function addClass(e, t) {
				i.hasClass(e, t) ||
					(e.className += (e.className ? " " : "") + t);
			},
			hasClass: function hasClass(e, t) {
				return (
					e.className &&
					new RegExp("(^|\\s)" + t + "(\\s|$)").test(e.className)
				);
			},
			getChildByClass: function getChildByClass(e, t) {
				for (var n = e.firstChild; n; ) {
					if (i.hasClass(n, t)) return n;
					n = n.nextSibling;
				}
			},
			arraySearch: function arraySearch(e, t, n) {
				for (var o = e.length; o--; ) {
					if (e[o][n] === t) return o;
				}

				return -1;
			},
			extend: function extend(e, t, n) {
				for (var o in t) {
					if (t.hasOwnProperty(o)) {
						if (n && e.hasOwnProperty(o)) continue;
						e[o] = t[o];
					}
				}
			},
			easing: {
				sine: {
					out: function out(e) {
						return Math.sin(e * (Math.PI / 2));
					},
					inOut: function inOut(e) {
						return -(Math.cos(Math.PI * e) - 1) / 2;
					}
				},
				cubic: {
					out: function out(e) {
						return --e * e * e + 1;
					}
				}
			},
			detectFeatures: function detectFeatures() {
				if (i.features) return i.features;
				var e = i.createEl(),
					t = e.style,
					n = "",
					o = {};

				if (
					((o.oldIE = document.all && !document.addEventListener),
					(o.touch = "ontouchstart" in window),
					window.requestAnimationFrame &&
						((o.raf = window.requestAnimationFrame),
						(o.caf = window.cancelAnimationFrame)),
					(o.pointerEvent =
						navigator.pointerEnabled || navigator.msPointerEnabled),
					!o.pointerEvent)
				) {
					var a = navigator.userAgent;

					if (/iP(hone|od)/.test(navigator.platform)) {
						var r = navigator.appVersion.match(
							/OS (\d+)_(\d+)_?(\d+)?/
						);
						r &&
							r.length > 0 &&
							((r = parseInt(r[1], 10)),
							r >= 1 && 8 > r && (o.isOldIOSPhone = !0));
					}

					var l = a.match(/Android\s([0-9\.]*)/),
						s = l ? l[1] : 0;
					(s = parseFloat(s)),
						s >= 1 &&
							(4.4 > s && (o.isOldAndroid = !0),
							(o.androidVersion = s)),
						(o.isMobileOpera = /opera mini|opera mobi/i.test(a));
				}

				for (
					var u,
						c,
						d = ["transform", "perspective", "animationName"],
						p = ["", "webkit", "Moz", "ms", "O"],
						m = 0;
					4 > m;
					m++
				) {
					n = p[m];

					for (var f = 0; 3 > f; f++) {
						(u = d[f]),
							(c =
								n +
								(n
									? u.charAt(0).toUpperCase() + u.slice(1)
									: u)),
							!o[u] && c in t && (o[u] = c);
					}

					n &&
						!o.raf &&
						((n = n.toLowerCase()),
						(o.raf = window[n + "RequestAnimationFrame"]),
						o.raf &&
							(o.caf =
								window[n + "CancelAnimationFrame"] ||
								window[n + "CancelRequestAnimationFrame"]));
				}

				if (!o.raf) {
					var h = 0;
					(o.raf = function(e) {
						var t = new Date().getTime(),
							n = Math.max(0, 16 - (t - h)),
							o = window.setTimeout(function() {
								e(t + n);
							}, n);
						return (h = t + n), o;
					}),
						(o.caf = function(e) {
							clearTimeout(e);
						});
				}

				return (
					(o.svg =
						!!document.createElementNS &&
						!!document.createElementNS(
							"http://www.w3.org/2000/svg",
							"svg"
						).createSVGRect),
					(i.features = o),
					o
				);
			}
		};
		i.detectFeatures(),
			i.features.oldIE &&
				(i.bind = function(e, t, n, o) {
					t = t.split(" ");

					for (
						var i,
							a = (o ? "detach" : "attach") + "Event",
							r = function r() {
								n.handleEvent.call(n);
							},
							l = 0;
						l < t.length;
						l++
					) {
						if ((i = t[l]))
							if ("object" == _typeof(n) && n.handleEvent) {
								if (o) {
									if (!n["oldIE" + i]) return !1;
								} else n["oldIE" + i] = r;

								e[a]("on" + i, n["oldIE" + i]);
							} else e[a]("on" + i, n);
					}
				});
		var a = this,
			r = 25,
			l = 3,
			s = {
				allowPanToNext: !0,
				spacing: 0.12,
				bgOpacity: 1,
				mouseUsed: !1,
				loop: !0,
				pinchToClose: !0,
				closeOnScroll: !0,
				closeOnVerticalDrag: !0,
				verticalDragRange: 0.75,
				hideAnimationDuration: 333,
				showAnimationDuration: 333,
				showHideOpacity: !1,
				focus: !0,
				escKey: !0,
				arrowKeys: !0,
				mainScrollEndFriction: 0.35,
				panEndFriction: 0.35,
				isClickableElement: function isClickableElement(e) {
					return "A" === e.tagName;
				},
				getDoubleTapZoom: function getDoubleTapZoom(e, t) {
					return e ? 1 : t.initialZoomLevel < 0.7 ? 1 : 1.33;
				},
				maxSpreadZoom: 1.33,
				modal: !0,
				scaleMode: "fit"
			};
		i.extend(s, o);

		var u,
			c,
			d,
			p,
			m,
			f,
			h,
			v,
			g,
			w,
			x,
			y,
			b,
			C,
			I,
			T,
			E,
			D,
			S,
			_,
			M,
			F,
			O,
			k,
			A,
			R,
			L,
			P,
			Z,
			z,
			N,
			U,
			K,
			H,
			B,
			W,
			Y,
			G,
			q,
			V,
			X,
			$,
			j,
			J,
			Q,
			et,
			tt,
			nt,
			ot,
			it,
			at,
			rt,
			lt,
			st,
			ut,
			ct,
			dt = function dt() {
				return {
					x: 0,
					y: 0
				};
			},
			pt = dt(),
			mt = dt(),
			ft = dt(),
			ht = {},
			vt = 0,
			gt = {},
			wt = dt(),
			xt = 0,
			yt = !0,
			bt = [],
			Ct = {},
			It = !1,
			Tt = function Tt(e, t) {
				i.extend(a, t.publicMethods), bt.push(e);
			},
			Et = function Et(e) {
				var t = eo();
				return e > t - 1 ? e - t : 0 > e ? t + e : e;
			},
			Dt = {},
			St = function St(e, t) {
				return Dt[e] || (Dt[e] = []), Dt[e].push(t);
			},
			_t = function _t(e) {
				var t = Dt[e];

				if (t) {
					var n = Array.prototype.slice.call(arguments);
					n.shift();

					for (var o = 0; o < t.length; o++) {
						t[o].apply(a, n);
					}
				}
			},
			Mt = function Mt() {
				return new Date().getTime();
			},
			Ft = function Ft(e) {
				(st = e), (a.bg.style.opacity = e * s.bgOpacity);
			},
			Ot = function Ot(e, t, n, o, i) {
				(!It || (i && i !== a.currItem)) &&
					(o /= i ? i.fitRatio : a.currItem.fitRatio),
					(e[F] =
						y + t + "px, " + n + "px" + b + " scale(" + o + ")");
			},
			kt = function kt(e) {
				ot &&
					(e &&
						(w > a.currItem.fitRatio
							? It || (mo(a.currItem, !1, !0), (It = !0))
							: It && (mo(a.currItem), (It = !1))),
					Ot(ot, ft.x, ft.y, w));
			},
			At = function At(e) {
				e.container &&
					Ot(
						e.container.style,
						e.initialPosition.x,
						e.initialPosition.y,
						e.initialZoomLevel,
						e
					);
			},
			Rt = function Rt(e, t) {
				t[F] = y + e + "px, 0px" + b;
			},
			Lt = function Lt(e, t) {
				if (!s.loop && t) {
					var n = p + (wt.x * vt - e) / wt.x,
						o = Math.round(e - xn.x);
					((0 > n && o > 0) || (n >= eo() - 1 && 0 > o)) &&
						(e = xn.x + o * s.mainScrollEndFriction);
				}

				(xn.x = e), Rt(e, m);
			},
			Pt = function Pt(e, t) {
				var n = yn[e] - gt[e];
				return mt[e] + pt[e] + n - n * (t / x);
			},
			Zt = function Zt(e, t) {
				(e.x = t.x), (e.y = t.y), t.id && (e.id = t.id);
			},
			zt = function zt(e) {
				(e.x = Math.round(e.x)), (e.y = Math.round(e.y));
			},
			Nt = null,
			Ut = function Ut() {
				Nt &&
					(i.unbind(document, "mousemove", Ut),
					i.addClass(_e2, "pswp--has_mouse"),
					(s.mouseUsed = !0),
					_t("mouseUsed")),
					(Nt = setTimeout(function() {
						Nt = null;
					}, 100));
			},
			Kt = function Kt() {
				i.bind(document, "keydown", a),
					N.transform && i.bind(a.scrollWrap, "click", a),
					s.mouseUsed || i.bind(document, "mousemove", Ut),
					i.bind(window, "resize scroll", a),
					_t("bindEvents");
			},
			Ht = function Ht() {
				i.unbind(window, "resize", a),
					i.unbind(window, "scroll", g.scroll),
					i.unbind(document, "keydown", a),
					i.unbind(document, "mousemove", Ut),
					N.transform && i.unbind(a.scrollWrap, "click", a),
					G && i.unbind(window, h, a),
					_t("unbindEvents");
			},
			Bt = function Bt(e, t) {
				var n = so(a.currItem, ht, e);
				return t && (nt = n), n;
			},
			Wt = function Wt(e) {
				return e || (e = a.currItem), e.initialZoomLevel;
			},
			Yt = function Yt(e) {
				return e || (e = a.currItem), e.w > 0 ? s.maxSpreadZoom : 1;
			},
			Gt = function Gt(e, t, n, o) {
				return o === a.currItem.initialZoomLevel
					? ((n[e] = a.currItem.initialPosition[e]), !0)
					: ((n[e] = Pt(e, o)),
					  n[e] > t.min[e]
							? ((n[e] = t.min[e]), !0)
							: n[e] < t.max[e]
							? ((n[e] = t.max[e]), !0)
							: !1);
			},
			qt = function qt() {
				if (F) {
					var t = N.perspective && !k;
					return (
						(y = "translate" + (t ? "3d(" : "(")),
						void (b = N.perspective ? ", 0px)" : ")")
					);
				}

				(F = "left"),
					i.addClass(_e2, "pswp--ie"),
					(Rt = function Rt(e, t) {
						t.left = e + "px";
					}),
					(At = function At(e) {
						var t = e.fitRatio > 1 ? 1 : e.fitRatio,
							n = e.container.style,
							o = t * e.w,
							i = t * e.h;
						(n.width = o + "px"),
							(n.height = i + "px"),
							(n.left = e.initialPosition.x + "px"),
							(n.top = e.initialPosition.y + "px");
					}),
					(kt = function kt() {
						if (ot) {
							var e = ot,
								t = a.currItem,
								n = t.fitRatio > 1 ? 1 : t.fitRatio,
								o = n * t.w,
								i = n * t.h;
							(e.width = o + "px"),
								(e.height = i + "px"),
								(e.left = ft.x + "px"),
								(e.top = ft.y + "px");
						}
					});
			},
			Vt = function Vt(e) {
				var t = "";
				s.escKey && 27 === e.keyCode
					? (t = "close")
					: s.arrowKeys &&
					  (37 === e.keyCode
							? (t = "prev")
							: 39 === e.keyCode && (t = "next")),
					t &&
						(e.ctrlKey ||
							e.altKey ||
							e.shiftKey ||
							e.metaKey ||
							(e.preventDefault
								? e.preventDefault()
								: (e.returnValue = !1),
							a[t]()));
			},
			Xt = function Xt(e) {
				e &&
					(X || V || it || W) &&
					(e.preventDefault(), e.stopPropagation());
			},
			$t = function $t() {
				a.setScrollOffset(0, i.getScrollY());
			},
			jt = {},
			Jt = 0,
			Qt = function Qt(e) {
				jt[e] && (jt[e].raf && R(jt[e].raf), Jt--, delete jt[e]);
			},
			en = function en(e) {
				jt[e] && Qt(e), jt[e] || (Jt++, (jt[e] = {}));
			},
			tn = function tn() {
				for (var e in jt) {
					jt.hasOwnProperty(e) && Qt(e);
				}
			},
			nn = function nn(e, t, n, o, i, a, r) {
				var l,
					s = Mt();
				en(e);

				var u = function u() {
					if (jt[e]) {
						if (((l = Mt() - s), l >= o))
							return Qt(e), a(n), void (r && r());
						a((n - t) * i(l / o) + t), (jt[e].raf = A(u));
					}
				};

				u();
			},
			on = {
				shout: _t,
				listen: St,
				viewportSize: ht,
				options: s,
				isMainScrollAnimating: function isMainScrollAnimating() {
					return it;
				},
				getZoomLevel: function getZoomLevel() {
					return w;
				},
				getCurrentIndex: function getCurrentIndex() {
					return p;
				},
				isDragging: function isDragging() {
					return G;
				},
				isZooming: function isZooming() {
					return Q;
				},
				setScrollOffset: function setScrollOffset(e, t) {
					(gt.x = e), (z = gt.y = t), _t("updateScrollOffset", gt);
				},
				applyZoomPan: function applyZoomPan(e, t, n, o) {
					(ft.x = t), (ft.y = n), (w = e), kt(o);
				},
				init: function init() {
					if (!u && !c) {
						var n;
						(a.framework = i),
							(a.template = _e2),
							(a.bg = i.getChildByClass(_e2, "pswp__bg")),
							(L = _e2.className),
							(u = !0),
							(N = i.detectFeatures()),
							(A = N.raf),
							(R = N.caf),
							(F = N.transform),
							(Z = N.oldIE),
							(a.scrollWrap = i.getChildByClass(
								_e2,
								"pswp__scroll-wrap"
							)),
							(a.container = i.getChildByClass(
								a.scrollWrap,
								"pswp__container"
							)),
							(m = a.container.style),
							(a.itemHolders = T = [
								{
									el: a.container.children[0],
									wrap: 0,
									index: -1
								},
								{
									el: a.container.children[1],
									wrap: 0,
									index: -1
								},
								{
									el: a.container.children[2],
									wrap: 0,
									index: -1
								}
							]),
							(T[0].el.style.display = T[2].el.style.display =
								"none"),
							qt(),
							(g = {
								resize: a.updateSize,
								scroll: $t,
								keydown: Vt,
								click: Xt
							});
						var o =
							N.isOldIOSPhone ||
							N.isOldAndroid ||
							N.isMobileOpera;

						for (
							(N.animationName && N.transform && !o) ||
								(s.showAnimationDuration = s.hideAnimationDuration = 0),
								n = 0;
							n < bt.length;
							n++
						) {
							a["init" + bt[n]]();
						}

						if (t) {
							var r = (a.ui = new t(a, i));
							r.init();
						}

						_t("firstUpdate"),
							(p = p || s.index || 0),
							(isNaN(p) || 0 > p || p >= eo()) && (p = 0),
							(a.currItem = Qn(p)),
							(N.isOldIOSPhone || N.isOldAndroid) && (yt = !1),
							_e2.setAttribute("aria-hidden", "false"),
							s.modal &&
								(yt
									? (_e2.style.position = "fixed")
									: ((_e2.style.position = "absolute"),
									  (_e2.style.top = i.getScrollY() + "px"))),
							void 0 === z &&
								(_t("initialLayout"), (z = P = i.getScrollY()));
						var d = "pswp--open ";

						for (
							s.mainClass && (d += s.mainClass + " "),
								s.showHideOpacity &&
									(d += "pswp--animate_opacity "),
								d += k ? "pswp--touch" : "pswp--notouch",
								d += N.animationName
									? " pswp--css_animation"
									: "",
								d += N.svg ? " pswp--svg" : "",
								i.addClass(_e2, d),
								a.updateSize(),
								f = -1,
								xt = null,
								n = 0;
							l > n;
							n++
						) {
							Rt((n + f) * wt.x, T[n].el.style);
						}

						Z || i.bind(a.scrollWrap, v, a),
							St("initialZoomInEnd", function() {
								a.setContent(T[0], p - 1),
									a.setContent(T[2], p + 1),
									(T[0].el.style.display = T[2].el.style.display =
										"block"),
									s.focus && _e2.focus(),
									Kt();
							}),
							a.setContent(T[1], p),
							a.updateCurrItem(),
							_t("afterInit"),
							yt ||
								(C = setInterval(function() {
									Jt ||
										G ||
										Q ||
										w !== a.currItem.initialZoomLevel ||
										a.updateSize();
								}, 1e3)),
							i.addClass(_e2, "pswp--visible");
					}
				},
				close: function close() {
					u &&
						((u = !1),
						(c = !0),
						_t("close"),
						Ht(),
						no(a.currItem, null, !0, a.destroy));
				},
				destroy: function destroy() {
					_t("destroy"),
						Xn && clearTimeout(Xn),
						_e2.setAttribute("aria-hidden", "true"),
						(_e2.className = L),
						C && clearInterval(C),
						i.unbind(a.scrollWrap, v, a),
						i.unbind(window, "scroll", a),
						En(),
						tn(),
						(Dt = null);
				},
				panTo: function panTo(e, t, n) {
					n ||
						(e > nt.min.x
							? (e = nt.min.x)
							: e < nt.max.x && (e = nt.max.x),
						t > nt.min.y
							? (t = nt.min.y)
							: t < nt.max.y && (t = nt.max.y)),
						(ft.x = e),
						(ft.y = t),
						kt();
				},
				handleEvent: function handleEvent(e) {
					(e = e || window.event), g[e.type] && g[e.type](e);
				},
				goTo: function goTo(e) {
					e = Et(e);
					var t = e - p;
					(xt = t),
						(p = e),
						(a.currItem = Qn(p)),
						(vt -= t),
						Lt(wt.x * vt),
						tn(),
						(it = !1),
						a.updateCurrItem();
				},
				next: function next() {
					a.goTo(p + 1);
				},
				prev: function prev() {
					a.goTo(p - 1);
				},
				updateCurrZoomItem: function updateCurrZoomItem(e) {
					if ((e && _t("beforeChange", 0), T[1].el.children.length)) {
						var t = T[1].el.children[0];
						ot = i.hasClass(t, "pswp__zoom-wrap") ? t.style : null;
					} else ot = null;

					(nt = a.currItem.bounds),
						(x = w = a.currItem.initialZoomLevel),
						(ft.x = nt.center.x),
						(ft.y = nt.center.y),
						e && _t("afterChange");
				},
				invalidateCurrItems: function invalidateCurrItems() {
					I = !0;

					for (var e = 0; l > e; e++) {
						T[e].item && (T[e].item.needsUpdate = !0);
					}
				},
				updateCurrItem: function updateCurrItem(e) {
					if (0 !== xt) {
						var t,
							n = Math.abs(xt);

						if (!(e && 2 > n)) {
							(a.currItem = Qn(p)),
								(It = !1),
								_t("beforeChange", xt),
								n >= l &&
									((f += xt + (xt > 0 ? -l : l)), (n = l));

							for (var o = 0; n > o; o++) {
								xt > 0
									? ((t = T.shift()),
									  (T[l - 1] = t),
									  f++,
									  Rt((f + 2) * wt.x, t.el.style),
									  a.setContent(t, p - n + o + 1 + 1))
									: ((t = T.pop()),
									  T.unshift(t),
									  f--,
									  Rt(f * wt.x, t.el.style),
									  a.setContent(t, p + n - o - 1 - 1));
							}

							if (ot && 1 === Math.abs(xt)) {
								var i = Qn(E);
								i.initialZoomLevel !== w &&
									(so(i, ht), mo(i), At(i));
							}

							(xt = 0),
								a.updateCurrZoomItem(),
								(E = p),
								_t("afterChange");
						}
					}
				},
				updateSize: function updateSize(t) {
					if (!yt && s.modal) {
						var n = i.getScrollY();
						if (
							(z !== n && ((_e2.style.top = n + "px"), (z = n)),
							!t &&
								Ct.x === window.innerWidth &&
								Ct.y === window.innerHeight)
						)
							return;
						(Ct.x = window.innerWidth),
							(Ct.y = window.innerHeight),
							(_e2.style.height = Ct.y + "px");
					}

					if (
						((ht.x = a.scrollWrap.clientWidth),
						(ht.y = a.scrollWrap.clientHeight),
						$t(),
						(wt.x = ht.x + Math.round(ht.x * s.spacing)),
						(wt.y = ht.y),
						Lt(wt.x * vt),
						_t("beforeResize"),
						void 0 !== f)
					) {
						for (var o, r, u, c = 0; l > c; c++) {
							(o = T[c]),
								Rt((c + f) * wt.x, o.el.style),
								(u = p + c - 1),
								s.loop && eo() > 2 && (u = Et(u)),
								(r = Qn(u)),
								r && (I || r.needsUpdate || !r.bounds)
									? (a.cleanSlide(r),
									  a.setContent(o, u),
									  1 === c &&
											((a.currItem = r),
											a.updateCurrZoomItem(!0)),
									  (r.needsUpdate = !1))
									: -1 === o.index &&
									  u >= 0 &&
									  a.setContent(o, u),
								r && r.container && (so(r, ht), mo(r), At(r));
						}

						I = !1;
					}

					(x = w = a.currItem.initialZoomLevel),
						(nt = a.currItem.bounds),
						nt &&
							((ft.x = nt.center.x),
							(ft.y = nt.center.y),
							kt(!0)),
						_t("resize");
				},
				zoomTo: function zoomTo(e, t, n, o, a) {
					t &&
						((x = w),
						(yn.x = Math.abs(t.x) - ft.x),
						(yn.y = Math.abs(t.y) - ft.y),
						Zt(mt, ft));
					var r = Bt(e, !1),
						l = {};
					Gt("x", r, l, e), Gt("y", r, l, e);
					var s = w,
						u = {
							x: ft.x,
							y: ft.y
						};
					zt(l);

					var c = function c(t) {
						1 === t
							? ((w = e), (ft.x = l.x), (ft.y = l.y))
							: ((w = (e - s) * t + s),
							  (ft.x = (l.x - u.x) * t + u.x),
							  (ft.y = (l.y - u.y) * t + u.y)),
							a && a(t),
							kt(1 === t);
					};

					n
						? nn(
								"customZoomTo",
								0,
								1,
								n,
								o || i.easing.sine.inOut,
								c
						  )
						: c(1);
				}
			},
			an = 30,
			rn = 10,
			ln = {},
			sn = {},
			un = {},
			cn = {},
			dn = {},
			pn = [],
			mn = {},
			fn = [],
			hn = {},
			vn = 0,
			gn = dt(),
			wn = 0,
			xn = dt(),
			yn = dt(),
			bn = dt(),
			Cn = function Cn(e, t) {
				return e.x === t.x && e.y === t.y;
			},
			In = function In(e, t) {
				return Math.abs(e.x - t.x) < r && Math.abs(e.y - t.y) < r;
			},
			Tn = function Tn(e, t) {
				return (
					(hn.x = Math.abs(e.x - t.x)),
					(hn.y = Math.abs(e.y - t.y)),
					Math.sqrt(hn.x * hn.x + hn.y * hn.y)
				);
			},
			En = function En() {
				$ && (R($), ($ = null));
			},
			Dn = function Dn() {
				G && (($ = A(Dn)), Hn());
			},
			Sn = function Sn() {
				return !(
					"fit" === s.scaleMode && w === a.currItem.initialZoomLevel
				);
			},
			_n = function _n(e, t) {
				return e && e !== document
					? e.getAttribute("class") &&
					  e.getAttribute("class").indexOf("pswp__scroll-wrap") > -1
						? !1
						: t(e)
						? e
						: _n(e.parentNode, t)
					: !1;
			},
			Mn = {},
			Fn = function Fn(e, t) {
				return (
					(Mn.prevent = !_n(e.target, s.isClickableElement)),
					_t("preventDragEvent", e, t, Mn),
					Mn.prevent
				);
			},
			On = function On(e, t) {
				return (
					(t.x = e.pageX), (t.y = e.pageY), (t.id = e.identifier), t
				);
			},
			kn = function kn(e, t, n) {
				(n.x = 0.5 * (e.x + t.x)), (n.y = 0.5 * (e.y + t.y));
			},
			An = function An(e, t, n) {
				if (e - K > 50) {
					var o = fn.length > 2 ? fn.shift() : {};
					(o.x = t), (o.y = n), fn.push(o), (K = e);
				}
			},
			Rn = function Rn() {
				var e = ft.y - a.currItem.initialPosition.y;
				return 1 - Math.abs(e / (ht.y / 2));
			},
			Ln = {},
			Pn = {},
			Zn = [],
			zn = function zn(e) {
				for (; Zn.length > 0; ) {
					Zn.pop();
				}

				return (
					O
						? ((ct = 0),
						  pn.forEach(function(e) {
								0 === ct
									? (Zn[0] = e)
									: 1 === ct && (Zn[1] = e),
									ct++;
						  }))
						: e.type.indexOf("touch") > -1
						? e.touches &&
						  e.touches.length > 0 &&
						  ((Zn[0] = On(e.touches[0], Ln)),
						  e.touches.length > 1 &&
								(Zn[1] = On(e.touches[1], Pn)))
						: ((Ln.x = e.pageX),
						  (Ln.y = e.pageY),
						  (Ln.id = ""),
						  (Zn[0] = Ln)),
					Zn
				);
			},
			Nn = function Nn(e, t) {
				var n,
					o,
					i,
					r,
					l = 0,
					u = ft[e] + t[e],
					c = t[e] > 0,
					d = xn.x + t.x,
					p = xn.x - mn.x;
				return (
					(n = u > nt.min[e] || u < nt.max[e] ? s.panEndFriction : 1),
					(u = ft[e] + t[e] * n),
					(!s.allowPanToNext && w !== a.currItem.initialZoomLevel) ||
					(ot
						? "h" !== at ||
						  "x" !== e ||
						  V ||
						  (c
								? (u > nt.min[e] &&
										((n = s.panEndFriction),
										(l = nt.min[e] - u),
										(o = nt.min[e] - mt[e])),
								  (0 >= o || 0 > p) && eo() > 1
										? ((r = d),
										  0 > p && d > mn.x && (r = mn.x))
										: nt.min.x !== nt.max.x && (i = u))
								: (u < nt.max[e] &&
										((n = s.panEndFriction),
										(l = u - nt.max[e]),
										(o = mt[e] - nt.max[e])),
								  (0 >= o || p > 0) && eo() > 1
										? ((r = d),
										  p > 0 && d < mn.x && (r = mn.x))
										: nt.min.x !== nt.max.x && (i = u)))
						: (r = d),
					"x" !== e)
						? void (
								it ||
								j ||
								(w > a.currItem.fitRatio && (ft[e] += t[e] * n))
						  )
						: (void 0 !== r &&
								(Lt(r, !0), (j = r === mn.x ? !1 : !0)),
						  nt.min.x !== nt.max.x &&
								(void 0 !== i
									? (ft.x = i)
									: j || (ft.x += t.x * n)),
						  void 0 !== r)
				);
			},
			Un = function Un(e) {
				if (!("mousedown" === e.type && e.button > 0)) {
					if (Jn) return void e.preventDefault();

					if (!Y || "mousedown" !== e.type) {
						if (
							(Fn(e, !0) && e.preventDefault(),
							_t("PointerDown"),
							O)
						) {
							var t = i.arraySearch(pn, e.pointerId, "id");
							0 > t && (t = pn.length),
								(pn[t] = {
									x: e.pageX,
									y: e.pageY,
									id: e.pointerId
								});
						}

						var n = zn(e),
							o = n.length;
						(J = null),
							tn(),
							(G && 1 !== o) ||
								((G = rt = !0),
								i.bind(window, h, a),
								(B = ut = lt = W = j = X = q = V = !1),
								(at = null),
								_t("firstTouchStart", n),
								Zt(mt, ft),
								(pt.x = pt.y = 0),
								Zt(cn, n[0]),
								Zt(dn, cn),
								(mn.x = wt.x * vt),
								(fn = [
									{
										x: cn.x,
										y: cn.y
									}
								]),
								(K = U = Mt()),
								Bt(w, !0),
								En(),
								Dn()),
							!Q &&
								o > 1 &&
								!it &&
								!j &&
								((x = w),
								(V = !1),
								(Q = q = !0),
								(pt.y = pt.x = 0),
								Zt(mt, ft),
								Zt(ln, n[0]),
								Zt(sn, n[1]),
								kn(ln, sn, bn),
								(yn.x = Math.abs(bn.x) - ft.x),
								(yn.y = Math.abs(bn.y) - ft.y),
								(et = tt = Tn(ln, sn)));
					}
				}
			},
			Kn = function Kn(e) {
				if ((e.preventDefault(), O)) {
					var t = i.arraySearch(pn, e.pointerId, "id");

					if (t > -1) {
						var n = pn[t];
						(n.x = e.pageX), (n.y = e.pageY);
					}
				}

				if (G) {
					var o = zn(e);
					if (at || X || Q) J = o;
					else if (xn.x !== wt.x * vt) at = "h";
					else {
						var a =
							Math.abs(o[0].x - cn.x) - Math.abs(o[0].y - cn.y);
						Math.abs(a) >= rn &&
							((at = a > 0 ? "h" : "v"), (J = o));
					}
				}
			},
			Hn = function Hn() {
				if (J) {
					var e = J.length;
					if (0 !== e)
						if (
							(Zt(ln, J[0]),
							(un.x = ln.x - cn.x),
							(un.y = ln.y - cn.y),
							Q && e > 1)
						) {
							if (
								((cn.x = ln.x),
								(cn.y = ln.y),
								!un.x && !un.y && Cn(J[1], sn))
							)
								return;
							Zt(sn, J[1]),
								V || ((V = !0), _t("zoomGestureStarted"));
							var t = Tn(ln, sn),
								n = qn(t);
							n >
								a.currItem.initialZoomLevel +
									a.currItem.initialZoomLevel / 15 &&
								(ut = !0);
							var o = 1,
								i = Wt(),
								r = Yt();
							if (i > n) {
								if (
									s.pinchToClose &&
									!ut &&
									x <= a.currItem.initialZoomLevel
								) {
									var l = i - n,
										u = 1 - l / (i / 1.2);
									Ft(u), _t("onPinchClose", u), (lt = !0);
								} else
									(o = (i - n) / i),
										o > 1 && (o = 1),
										(n = i - o * (i / 3));
							} else
								n > r &&
									((o = (n - r) / (6 * i)),
									o > 1 && (o = 1),
									(n = r + o * i));
							0 > o && (o = 0),
								(et = t),
								kn(ln, sn, gn),
								(pt.x += gn.x - bn.x),
								(pt.y += gn.y - bn.y),
								Zt(bn, gn),
								(ft.x = Pt("x", n)),
								(ft.y = Pt("y", n)),
								(B = n > w),
								(w = n),
								kt();
						} else {
							if (!at) return;
							if (
								(rt &&
									((rt = !1),
									Math.abs(un.x) >= rn &&
										(un.x -= J[0].x - dn.x),
									Math.abs(un.y) >= rn &&
										(un.y -= J[0].y - dn.y)),
								(cn.x = ln.x),
								(cn.y = ln.y),
								0 === un.x && 0 === un.y)
							)
								return;

							if ("v" === at && s.closeOnVerticalDrag && !Sn()) {
								(pt.y += un.y), (ft.y += un.y);
								var c = Rn();
								return (
									(W = !0),
									_t("onVerticalDrag", c),
									Ft(c),
									void kt()
								);
							}

							An(Mt(), ln.x, ln.y),
								(X = !0),
								(nt = a.currItem.bounds);
							var d = Nn("x", un);
							d || (Nn("y", un), zt(ft), kt());
						}
				}
			},
			Bn = function Bn(e) {
				if (N.isOldAndroid) {
					if (Y && "mouseup" === e.type) return;
					e.type.indexOf("touch") > -1 &&
						(clearTimeout(Y),
						(Y = setTimeout(function() {
							Y = 0;
						}, 600)));
				}

				_t("PointerUp"), Fn(e, !1) && e.preventDefault();
				var t;

				if (O) {
					var n = i.arraySearch(pn, e.pointerId, "id");
					if (n > -1)
						if (
							((t = pn.splice(n, 1)[0]), navigator.pointerEnabled)
						)
							t.type = e.pointerType || "mouse";
						else {
							var o = {
								4: "mouse",
								2: "touch",
								3: "pen"
							};
							(t.type = o[e.pointerType]),
								t.type || (t.type = e.pointerType || "mouse");
						}
				}

				var r,
					l = zn(e),
					u = l.length;
				if (("mouseup" === e.type && (u = 0), 2 === u))
					return (J = null), !0;
				1 === u && Zt(dn, l[0]),
					0 !== u ||
						at ||
						it ||
						(t ||
							("mouseup" === e.type
								? (t = {
										x: e.pageX,
										y: e.pageY,
										type: "mouse"
								  })
								: e.changedTouches &&
								  e.changedTouches[0] &&
								  (t = {
										x: e.changedTouches[0].pageX,
										y: e.changedTouches[0].pageY,
										type: "touch"
								  })),
						_t("touchRelease", e, t));
				var c = -1;
				if (
					(0 === u &&
						((G = !1),
						i.unbind(window, h, a),
						En(),
						Q ? (c = 0) : -1 !== wn && (c = Mt() - wn)),
					(wn = 1 === u ? Mt() : -1),
					(r = -1 !== c && 150 > c ? "zoom" : "swipe"),
					Q &&
						2 > u &&
						((Q = !1),
						1 === u && (r = "zoomPointerUp"),
						_t("zoomGestureEnded")),
					(J = null),
					X || V || it || W)
				)
					if (
						(tn(), H || (H = Wn()), H.calculateSwipeSpeed("x"), W)
					) {
						var d = Rn();
						if (d < s.verticalDragRange) a.close();
						else {
							var p = ft.y,
								m = st;
							nn(
								"verticalDrag",
								0,
								1,
								300,
								i.easing.cubic.out,
								function(e) {
									(ft.y =
										(a.currItem.initialPosition.y - p) * e +
										p),
										Ft((1 - m) * e + m),
										kt();
								}
							),
								_t("onVerticalDrag", 1);
						}
					} else {
						if ((j || it) && 0 === u) {
							var f = Gn(r, H);
							if (f) return;
							r = "zoomPointerUp";
						}

						if (!it)
							return "swipe" !== r
								? void Vn()
								: void (!j && w > a.currItem.fitRatio && Yn(H));
					}
			},
			Wn = function Wn() {
				var e,
					t,
					n = {
						lastFlickOffset: {},
						lastFlickDist: {},
						lastFlickSpeed: {},
						slowDownRatio: {},
						slowDownRatioReverse: {},
						speedDecelerationRatio: {},
						speedDecelerationRatioAbs: {},
						distanceOffset: {},
						backAnimDestination: {},
						backAnimStarted: {},
						calculateSwipeSpeed: function calculateSwipeSpeed(o) {
							fn.length > 1
								? ((e = Mt() - K + 50),
								  (t = fn[fn.length - 2][o]))
								: ((e = Mt() - U), (t = dn[o])),
								(n.lastFlickOffset[o] = cn[o] - t),
								(n.lastFlickDist[o] = Math.abs(
									n.lastFlickOffset[o]
								)),
								(n.lastFlickSpeed[o] =
									n.lastFlickDist[o] > 20
										? n.lastFlickOffset[o] / e
										: 0),
								Math.abs(n.lastFlickSpeed[o]) < 0.1 &&
									(n.lastFlickSpeed[o] = 0),
								(n.slowDownRatio[o] = 0.95),
								(n.slowDownRatioReverse[o] =
									1 - n.slowDownRatio[o]),
								(n.speedDecelerationRatio[o] = 1);
						},
						calculateOverBoundsAnimOffset: function calculateOverBoundsAnimOffset(
							e,
							t
						) {
							n.backAnimStarted[e] ||
								(ft[e] > nt.min[e]
									? (n.backAnimDestination[e] = nt.min[e])
									: ft[e] < nt.max[e] &&
									  (n.backAnimDestination[e] = nt.max[e]),
								void 0 !== n.backAnimDestination[e] &&
									((n.slowDownRatio[e] = 0.7),
									(n.slowDownRatioReverse[e] =
										1 - n.slowDownRatio[e]),
									n.speedDecelerationRatioAbs[e] < 0.05 &&
										((n.lastFlickSpeed[e] = 0),
										(n.backAnimStarted[e] = !0),
										nn(
											"bounceZoomPan" + e,
											ft[e],
											n.backAnimDestination[e],
											t || 300,
											i.easing.sine.out,
											function(t) {
												(ft[e] = t), kt();
											}
										))));
						},
						calculateAnimOffset: function calculateAnimOffset(e) {
							n.backAnimStarted[e] ||
								((n.speedDecelerationRatio[e] =
									n.speedDecelerationRatio[e] *
									(n.slowDownRatio[e] +
										n.slowDownRatioReverse[e] -
										(n.slowDownRatioReverse[e] *
											n.timeDiff) /
											10)),
								(n.speedDecelerationRatioAbs[e] = Math.abs(
									n.lastFlickSpeed[e] *
										n.speedDecelerationRatio[e]
								)),
								(n.distanceOffset[e] =
									n.lastFlickSpeed[e] *
									n.speedDecelerationRatio[e] *
									n.timeDiff),
								(ft[e] += n.distanceOffset[e]));
						},
						panAnimLoop: function panAnimLoop() {
							return jt.zoomPan &&
								((jt.zoomPan.raf = A(n.panAnimLoop)),
								(n.now = Mt()),
								(n.timeDiff = n.now - n.lastNow),
								(n.lastNow = n.now),
								n.calculateAnimOffset("x"),
								n.calculateAnimOffset("y"),
								kt(),
								n.calculateOverBoundsAnimOffset("x"),
								n.calculateOverBoundsAnimOffset("y"),
								n.speedDecelerationRatioAbs.x < 0.05 &&
									n.speedDecelerationRatioAbs.y < 0.05)
								? ((ft.x = Math.round(ft.x)),
								  (ft.y = Math.round(ft.y)),
								  kt(),
								  void Qt("zoomPan"))
								: void 0;
						}
					};
				return n;
			},
			Yn = function Yn(e) {
				return (
					e.calculateSwipeSpeed("y"),
					(nt = a.currItem.bounds),
					(e.backAnimDestination = {}),
					(e.backAnimStarted = {}),
					Math.abs(e.lastFlickSpeed.x) <= 0.05 &&
					Math.abs(e.lastFlickSpeed.y) <= 0.05
						? ((e.speedDecelerationRatioAbs.x = e.speedDecelerationRatioAbs.y = 0),
						  e.calculateOverBoundsAnimOffset("x"),
						  e.calculateOverBoundsAnimOffset("y"),
						  !0)
						: (en("zoomPan"),
						  (e.lastNow = Mt()),
						  void e.panAnimLoop())
				);
			},
			Gn = function Gn(e, t) {
				var n;
				it || (vn = p);
				var o;

				if ("swipe" === e) {
					var r = cn.x - dn.x,
						l = t.lastFlickDist.x < 10;
					r > an && (l || t.lastFlickOffset.x > 20)
						? (o = -1)
						: -an > r &&
						  (l || t.lastFlickOffset.x < -20) &&
						  (o = 1);
				}

				var u;
				o &&
					((p += o),
					0 > p
						? ((p = s.loop ? eo() - 1 : 0), (u = !0))
						: p >= eo() && ((p = s.loop ? 0 : eo() - 1), (u = !0)),
					(!u || s.loop) && ((xt += o), (vt -= o), (n = !0)));
				var c,
					d = wt.x * vt,
					m = Math.abs(d - xn.x);
				return (
					n || d > xn.x == t.lastFlickSpeed.x > 0
						? ((c =
								Math.abs(t.lastFlickSpeed.x) > 0
									? m / Math.abs(t.lastFlickSpeed.x)
									: 333),
						  (c = Math.min(c, 400)),
						  (c = Math.max(c, 250)))
						: (c = 333),
					vn === p && (n = !1),
					(it = !0),
					_t("mainScrollAnimStart"),
					nn(
						"mainScroll",
						xn.x,
						d,
						c,
						i.easing.cubic.out,
						Lt,
						function() {
							tn(),
								(it = !1),
								(vn = -1),
								(n || vn !== p) && a.updateCurrItem(),
								_t("mainScrollAnimComplete");
						}
					),
					n && a.updateCurrItem(!0),
					n
				);
			},
			qn = function qn(e) {
				return (1 / tt) * e * x;
			},
			Vn = function Vn() {
				var e = w,
					t = Wt(),
					n = Yt();
				t > w ? (e = t) : w > n && (e = n);
				var o,
					r = 1,
					l = st;
				return lt && !B && !ut && t > w
					? (a.close(), !0)
					: (lt &&
							(o = function o(e) {
								Ft((r - l) * e + l);
							}),
					  a.zoomTo(e, 0, 200, i.easing.cubic.out, o),
					  !0);
			};

		Tt("Gestures", {
			publicMethods: {
				initGestures: function initGestures() {
					var e = function e(_e, t, n, o, i) {
						(D = _e + t),
							(S = _e + n),
							(_ = _e + o),
							(M = i ? _e + i : "");
					};

					(O = N.pointerEvent),
						O && N.touch && (N.touch = !1),
						O
							? navigator.pointerEnabled
								? e("pointer", "down", "move", "up", "cancel")
								: e("MSPointer", "Down", "Move", "Up", "Cancel")
							: N.touch
							? (e("touch", "start", "move", "end", "cancel"),
							  (k = !0))
							: e("mouse", "down", "move", "up"),
						(h = S + " " + _ + " " + M),
						(v = D),
						O &&
							!k &&
							(k =
								navigator.maxTouchPoints > 1 ||
								navigator.msMaxTouchPoints > 1),
						(a.likelyTouchDevice = k),
						(g[D] = Un),
						(g[S] = Kn),
						(g[_] = Bn),
						M && (g[M] = g[_]),
						N.touch &&
							((v += " mousedown"),
							(h += " mousemove mouseup"),
							(g.mousedown = g[D]),
							(g.mousemove = g[S]),
							(g.mouseup = g[_])),
						k || (s.allowPanToNext = !1);
				}
			}
		});

		var Xn,
			$n,
			jn,
			Jn,
			Qn,
			eo,
			to,
			no = function no(t, n, o, r) {
				Xn && clearTimeout(Xn), (Jn = !0), (jn = !0);
				var l;
				t.initialLayout
					? ((l = t.initialLayout), (t.initialLayout = null))
					: (l = s.getThumbBoundsFn && s.getThumbBoundsFn(p));

				var u = o ? s.hideAnimationDuration : s.showAnimationDuration,
					c = function c() {
						Qt("initialZoom"),
							o
								? (a.template.removeAttribute("style"),
								  a.bg.removeAttribute("style"))
								: (Ft(1),
								  n && (n.style.display = "block"),
								  i.addClass(_e2, "pswp--animated-in"),
								  _t("initialZoom" + (o ? "OutEnd" : "InEnd"))),
							r && r(),
							(Jn = !1);
					};

				if (!u || !l || void 0 === l.x)
					return (
						_t("initialZoom" + (o ? "Out" : "In")),
						(w = t.initialZoomLevel),
						Zt(ft, t.initialPosition),
						kt(),
						(_e2.style.opacity = o ? 0 : 1),
						Ft(1),
						void (u
							? setTimeout(function() {
									c();
							  }, u)
							: c())
					);

				var m = function m() {
					var n = d,
						r =
							!a.currItem.src ||
							a.currItem.loadError ||
							s.showHideOpacity;
					t.miniImg &&
						(t.miniImg.style.webkitBackfaceVisibility = "hidden"),
						o ||
							((w = l.w / t.w),
							(ft.x = l.x),
							(ft.y = l.y - P),
							(a[r ? "template" : "bg"].style.opacity = 0.001),
							kt()),
						en("initialZoom"),
						o && !n && i.removeClass(_e2, "pswp--animated-in"),
						r &&
							(o
								? i[(n ? "remove" : "add") + "Class"](
										_e2,
										"pswp--animate_opacity"
								  )
								: setTimeout(function() {
										i.addClass(
											_e2,
											"pswp--animate_opacity"
										);
								  }, 30)),
						(Xn = setTimeout(
							function() {
								if (
									(_t("initialZoom" + (o ? "Out" : "In")), o)
								) {
									var a = l.w / t.w,
										s = {
											x: ft.x,
											y: ft.y
										},
										d = w,
										p = st,
										m = function m(t) {
											1 === t
												? ((w = a),
												  (ft.x = l.x),
												  (ft.y = l.y - z))
												: ((w = (a - d) * t + d),
												  (ft.x =
														(l.x - s.x) * t + s.x),
												  (ft.y =
														(l.y - z - s.y) * t +
														s.y)),
												kt(),
												r
													? (_e2.style.opacity =
															1 - t)
													: Ft(p - t * p);
										};

									n
										? nn(
												"initialZoom",
												0,
												1,
												u,
												i.easing.cubic.out,
												m,
												c
										  )
										: (m(1), (Xn = setTimeout(c, u + 20)));
								} else
									(w = t.initialZoomLevel),
										Zt(ft, t.initialPosition),
										kt(),
										Ft(1),
										r ? (_e2.style.opacity = 1) : Ft(1),
										(Xn = setTimeout(c, u + 20));
							},
							o ? 25 : 90
						));
				};

				m();
			},
			oo = {},
			io = [],
			ao = {
				index: 0,
				errorMsg:
					'<div class="pswp__error-msg"><a href="%url%" target="_blank">The image</a> could not be loaded.</div>',
				forceProgressiveLoading: !1,
				preload: [1, 1],
				getNumItemsFn: function getNumItemsFn() {
					return $n.length;
				}
			},
			ro = function ro() {
				return {
					center: {
						x: 0,
						y: 0
					},
					max: {
						x: 0,
						y: 0
					},
					min: {
						x: 0,
						y: 0
					}
				};
			},
			lo = function lo(e, t, n) {
				var o = e.bounds;
				(o.center.x = Math.round((oo.x - t) / 2)),
					(o.center.y = Math.round((oo.y - n) / 2) + e.vGap.top),
					(o.max.x = t > oo.x ? Math.round(oo.x - t) : o.center.x),
					(o.max.y =
						n > oo.y
							? Math.round(oo.y - n) + e.vGap.top
							: o.center.y),
					(o.min.x = t > oo.x ? 0 : o.center.x),
					(o.min.y = n > oo.y ? e.vGap.top : o.center.y);
			},
			so = function so(e, t, n) {
				if (e.src && !e.loadError) {
					var o = !n;

					if (
						(o &&
							(e.vGap ||
								(e.vGap = {
									top: 0,
									bottom: 0
								}),
							_t("parseVerticalMargin", e)),
						(oo.x = t.x),
						(oo.y = t.y - e.vGap.top - e.vGap.bottom),
						o)
					) {
						var i = oo.x / e.w,
							a = oo.y / e.h;
						e.fitRatio = a > i ? i : a;
						var r = s.scaleMode;
						"orig" === r
							? (n = 1)
							: "fit" === r && (n = e.fitRatio),
							n > 1 && (n = 1),
							(e.initialZoomLevel = n),
							e.bounds || (e.bounds = ro());
					}

					if (!n) return;
					return (
						lo(e, e.w * n, e.h * n),
						o &&
							n === e.initialZoomLevel &&
							(e.initialPosition = e.bounds.center),
						e.bounds
					);
				}

				return (
					(e.w = e.h = 0),
					(e.initialZoomLevel = e.fitRatio = 1),
					(e.bounds = ro()),
					(e.initialPosition = e.bounds.center),
					e.bounds
				);
			},
			uo = function uo(e, t, n, o, i, r) {
				t.loadError ||
					(o &&
						((t.imageAppended = !0),
						mo(t, o, t === a.currItem && It),
						n.appendChild(o),
						r &&
							setTimeout(function() {
								t &&
									t.loaded &&
									t.placeholder &&
									((t.placeholder.style.display = "none"),
									(t.placeholder = null));
							}, 500)));
			},
			co = function co(e) {
				(e.loading = !0), (e.loaded = !1);

				var t = (e.img = i.createEl("pswp__img", "img")),
					n = function n() {
						(e.loading = !1),
							(e.loaded = !0),
							e.loadComplete ? e.loadComplete(e) : (e.img = null),
							(t.onload = t.onerror = null),
							(t = null);
					};

				return (
					(t.onload = n),
					(t.onerror = function() {
						(e.loadError = !0), n();
					}),
					(t.src = e.src),
					t
				);
			},
			po = function po(e, t) {
				return e.src && e.loadError && e.container
					? (t && (e.container.innerHTML = ""),
					  (e.container.innerHTML = s.errorMsg.replace(
							"%url%",
							e.src
					  )),
					  !0)
					: void 0;
			},
			mo = function mo(e, t, n) {
				if (e.src) {
					t || (t = e.container.lastChild);
					var o = n ? e.w : Math.round(e.w * e.fitRatio),
						i = n ? e.h : Math.round(e.h * e.fitRatio);
					e.placeholder &&
						!e.loaded &&
						((e.placeholder.style.width = o + "px"),
						(e.placeholder.style.height = i + "px")),
						(t.style.width = o + "px"),
						(t.style.height = i + "px");
				}
			},
			fo = function fo() {
				if (io.length) {
					for (var e, t = 0; t < io.length; t++) {
						(e = io[t]),
							e.holder.index === e.index &&
								uo(
									e.index,
									e.item,
									e.baseDiv,
									e.img,
									!1,
									e.clearPlaceholder
								);
					}

					io = [];
				}
			};

		Tt("Controller", {
			publicMethods: {
				lazyLoadItem: function lazyLoadItem(e) {
					e = Et(e);
					var t = Qn(e);
					t &&
						((!t.loaded && !t.loading) || I) &&
						(_t("gettingData", e, t), t.src && co(t));
				},
				initController: function initController() {
					i.extend(s, ao, !0),
						(a.items = $n = n),
						(Qn = a.getItemAt),
						(eo = s.getNumItemsFn),
						(to = s.loop),
						eo() < 3 && (s.loop = !1),
						St("beforeChange", function(e) {
							var t,
								n = s.preload,
								o = null === e ? !0 : e >= 0,
								i = Math.min(n[0], eo()),
								r = Math.min(n[1], eo());

							for (t = 1; (o ? r : i) >= t; t++) {
								a.lazyLoadItem(p + t);
							}

							for (t = 1; (o ? i : r) >= t; t++) {
								a.lazyLoadItem(p - t);
							}
						}),
						St("initialLayout", function() {
							a.currItem.initialLayout =
								s.getThumbBoundsFn && s.getThumbBoundsFn(p);
						}),
						St("mainScrollAnimComplete", fo),
						St("initialZoomInEnd", fo),
						St("destroy", function() {
							for (var e, t = 0; t < $n.length; t++) {
								(e = $n[t]),
									e.container && (e.container = null),
									e.placeholder && (e.placeholder = null),
									e.img && (e.img = null),
									e.preloader && (e.preloader = null),
									e.loadError &&
										(e.loaded = e.loadError = !1);
							}

							io = null;
						});
				},
				getItemAt: function getItemAt(e) {
					return e >= 0 && void 0 !== $n[e] ? $n[e] : !1;
				},
				allowProgressiveImg: function allowProgressiveImg() {
					return (
						s.forceProgressiveLoading ||
						!k ||
						s.mouseUsed ||
						screen.width > 1200
					);
				},
				setContent: function setContent(e, t) {
					s.loop && (t = Et(t));
					var n = a.getItemAt(e.index);
					n && (n.container = null);
					var o,
						r = a.getItemAt(t);
					if (!r) return void (e.el.innerHTML = "");
					_t("gettingData", t, r), (e.index = t), (e.item = r);
					var l = (r.container = i.createEl("pswp__zoom-wrap"));
					if (
						(!r.src &&
							r.html &&
							(r.html.tagName
								? l.appendChild(r.html)
								: (l.innerHTML = r.html)),
						po(r),
						so(r, ht),
						!r.src || r.loadError || r.loaded)
					)
						r.src &&
							!r.loadError &&
							((o = i.createEl("pswp__img", "img")),
							(o.style.opacity = 1),
							(o.src = r.src),
							mo(r, o),
							uo(t, r, l, o, !0));
					else {
						if (
							((r.loadComplete = function(n) {
								if (u) {
									if (e && e.index === t) {
										if (po(n, !0))
											return (
												(n.loadComplete = n.img = null),
												so(n, ht),
												At(n),
												void (
													e.index === p &&
													a.updateCurrZoomItem()
												)
											);
										n.imageAppended
											? !Jn &&
											  n.placeholder &&
											  ((n.placeholder.style.display =
													"none"),
											  (n.placeholder = null))
											: N.transform && (it || Jn)
											? io.push({
													item: n,
													baseDiv: l,
													img: n.img,
													index: t,
													holder: e,
													clearPlaceholder: !0
											  })
											: uo(t, n, l, n.img, it || Jn, true);
									}

									(n.loadComplete = null),
										(n.img = null),
										_t("imageLoadComplete", t, n);
								}
							}),
							i.features.transform)
						) {
							var c = "pswp__img pswp__img--placeholder";
							c += r.msrc ? "" : " pswp__img--placeholder--blank";
							var d = i.createEl(c, r.msrc ? "img" : "");
							r.msrc && (d.src = r.msrc),
								mo(r, d),
								l.appendChild(d),
								(r.placeholder = d);
						}

						r.loading || co(r),
							a.allowProgressiveImg() &&
								(!jn && N.transform
									? io.push({
											item: r,
											baseDiv: l,
											img: r.img,
											index: t,
											holder: e
									  })
									: uo(t, r, l, r.img, !0, !0));
					}
					jn || t !== p ? At(r) : ((ot = l.style), no(r, o || r.img)),
						(e.el.innerHTML = ""),
						e.el.appendChild(l);
				},
				cleanSlide: function cleanSlide(e) {
					e.img && (e.img.onload = e.img.onerror = null),
						(e.loaded = e.loading = e.img = e.imageAppended = !1);
				}
			}
		});

		var ho,
			vo = {},
			go = function go(e, t, n) {
				var o = document.createEvent("CustomEvent"),
					i = {
						origEvent: e,
						target: e.target,
						releasePoint: t,
						pointerType: n || "touch"
					};
				o.initCustomEvent("pswpTap", !0, !0, i),
					e.target.dispatchEvent(o);
			};

		Tt("Tap", {
			publicMethods: {
				initTap: function initTap() {
					St("firstTouchStart", a.onTapStart),
						St("touchRelease", a.onTapRelease),
						St("destroy", function() {
							(vo = {}), (ho = null);
						});
				},
				onTapStart: function onTapStart(e) {
					e.length > 1 && (clearTimeout(ho), (ho = null));
				},
				onTapRelease: function onTapRelease(e, t) {
					if (t && !X && !q && !Jt) {
						var n = t;
						if (ho && (clearTimeout(ho), (ho = null), In(n, vo)))
							return void _t("doubleTap", n);
						if ("mouse" === t.type) return void go(e, t, "mouse");
						var o = e.target.tagName.toUpperCase();
						if (
							"BUTTON" === o ||
							i.hasClass(e.target, "pswp__single-tap")
						)
							return void go(e, t);
						Zt(vo, n),
							(ho = setTimeout(function() {
								go(e, t), (ho = null);
							}, 300));
					}
				}
			}
		});
		var wo;
		Tt("DesktopZoom", {
			publicMethods: {
				initDesktopZoom: function initDesktopZoom() {
					Z ||
						(k
							? St("mouseUsed", function() {
									a.setupDesktopZoom();
							  })
							: a.setupDesktopZoom(!0));
				},
				setupDesktopZoom: function setupDesktopZoom(t) {
					wo = {};
					var n = "wheel mousewheel DOMMouseScroll";
					St("bindEvents", function() {
						i.bind(_e2, n, a.handleMouseWheel);
					}),
						St("unbindEvents", function() {
							wo && i.unbind(_e2, n, a.handleMouseWheel);
						}),
						(a.mouseZoomedIn = !1);

					var o,
						r = function r() {
							a.mouseZoomedIn &&
								(i.removeClass(_e2, "pswp--zoomed-in"),
								(a.mouseZoomedIn = !1)),
								1 > w
									? i.addClass(_e2, "pswp--zoom-allowed")
									: i.removeClass(_e2, "pswp--zoom-allowed"),
								l();
						},
						l = function l() {
							o &&
								(i.removeClass(_e2, "pswp--dragging"),
								(o = !1));
						};

					St("resize", r),
						St("afterChange", r),
						St("PointerDown", function() {
							a.mouseZoomedIn &&
								((o = !0), i.addClass(_e2, "pswp--dragging"));
						}),
						St("PointerUp", l),
						t || r();
				},
				handleMouseWheel: function handleMouseWheel(e) {
					if (w <= a.currItem.fitRatio)
						return (
							s.modal &&
								(!s.closeOnScroll || Jt || G
									? e.preventDefault()
									: F &&
									  Math.abs(e.deltaY) > 2 &&
									  ((d = !0), a.close())),
							!0
						);
					if ((e.stopPropagation(), (wo.x = 0), "deltaX" in e))
						1 === e.deltaMode
							? ((wo.x = 18 * e.deltaX), (wo.y = 18 * e.deltaY))
							: ((wo.x = e.deltaX), (wo.y = e.deltaY));
					else if ("wheelDelta" in e)
						e.wheelDeltaX && (wo.x = -0.16 * e.wheelDeltaX),
							(wo.y = e.wheelDeltaY
								? -0.16 * e.wheelDeltaY
								: -0.16 * e.wheelDelta);
					else {
						if (!("detail" in e)) return;
						wo.y = e.detail;
					}
					Bt(w, true);
					var t = ft.x - wo.x,
						n = ft.y - wo.y;
					(s.modal ||
						(t <= nt.min.x &&
							t >= nt.max.x &&
							n <= nt.min.y &&
							n >= nt.max.y)) &&
						e.preventDefault(),
						a.panTo(t, n);
				},
				toggleDesktopZoom: function toggleDesktopZoom(t) {
					t = t || {
						x: ht.x / 2 + gt.x,
						y: ht.y / 2 + gt.y
					};
					var n = s.getDoubleTapZoom(!0, a.currItem),
						o = w === n;
					(a.mouseZoomedIn = !o),
						a.zoomTo(o ? a.currItem.initialZoomLevel : n, t, 333),
						i[(o ? "remove" : "add") + "Class"](
							_e2,
							"pswp--zoomed-in"
						);
				}
			}
		});

		var xo,
			yo,
			bo,
			Co,
			Io,
			To,
			Eo,
			Do,
			So,
			_o,
			Mo,
			Fo,
			Oo = {
				history: !0,
				galleryUID: 1
			},
			ko = function ko() {
				return Mo.hash.substring(1);
			},
			Ao = function Ao() {
				xo && clearTimeout(xo), bo && clearTimeout(bo);
			},
			Ro = function Ro() {
				var e = ko(),
					t = {};
				if (e.length < 5) return t;
				var n,
					o = e.split("&");

				for (n = 0; n < o.length; n++) {
					if (o[n]) {
						var i = o[n].split("=");
						i.length < 2 || (t[i[0]] = i[1]);
					}
				}

				if (s.galleryPIDs) {
					var a = t.pid;

					for (t.pid = 0, n = 0; n < $n.length; n++) {
						if ($n[n].pid === a) {
							t.pid = n;
							break;
						}
					}
				} else t.pid = parseInt(t.pid, 10) - 1;

				return t.pid < 0 && (t.pid = 0), t;
			},
			Lo = function Lo() {
				if ((bo && clearTimeout(bo), Jt || G))
					return void (bo = setTimeout(Lo, 500));
				Co ? clearTimeout(yo) : (Co = !0);
				var e = p + 1,
					t = Qn(p);
				t.hasOwnProperty("pid") && (e = t.pid);
				var n = Eo + "&gid=" + s.galleryUID + "&pid=" + e;
				Do || (-1 === Mo.hash.indexOf(n) && (_o = !0));
				var o = Mo.href.split("#")[0] + "#" + n;
				Fo
					? "#" + n !== window.location.hash &&
					  history[Do ? "replaceState" : "pushState"](
							"",
							document.title,
							o
					  )
					: Do
					? Mo.replace(o)
					: (Mo.hash = n),
					(Do = !0),
					(yo = setTimeout(function() {
						Co = !1;
					}, 60));
			};

		Tt("History", {
			publicMethods: {
				initHistory: function initHistory() {
					if ((i.extend(s, Oo, !0), s.history)) {
						(Mo = window.location),
							(_o = !1),
							(So = !1),
							(Do = !1),
							(Eo = ko()),
							(Fo = "pushState" in history),
							Eo.indexOf("gid=") > -1 &&
								((Eo = Eo.split("&gid=")[0]),
								(Eo = Eo.split("?gid=")[0])),
							St("afterChange", a.updateURL),
							St("unbindEvents", function() {
								i.unbind(window, "hashchange", a.onHashChange);
							});

						var e = function e() {
							(To = !0),
								So ||
									(_o
										? history.back()
										: Eo
										? (Mo.hash = Eo)
										: Fo
										? history.pushState(
												"",
												document.title,
												Mo.pathname + Mo.search
										  )
										: (Mo.hash = "")),
								Ao();
						};

						St("unbindEvents", function() {
							d && e();
						}),
							St("destroy", function() {
								To || e();
							}),
							St("firstUpdate", function() {
								p = Ro().pid;
							});
						var t = Eo.indexOf("pid=");
						t > -1 &&
							((Eo = Eo.substring(0, t)),
							"&" === Eo.slice(-1) && (Eo = Eo.slice(0, -1))),
							setTimeout(function() {
								u &&
									i.bind(
										window,
										"hashchange",
										a.onHashChange
									);
							}, 40);
					}
				},
				onHashChange: function onHashChange() {
					return ko() === Eo
						? ((So = !0), void a.close())
						: void (Co || ((Io = !0), a.goTo(Ro().pid), (Io = !1)));
				},
				updateURL: function updateURL() {
					Ao(), Io || (Do ? (xo = setTimeout(Lo, 800)) : Lo());
				}
			}
		}),
			i.extend(a, on);
	};

	return e;
}),
	(function(e, t) {
		e.PhotoSwipeUI_Default = t();
	})("undefined" != typeof window ? window : this, function() {
		"use strict";

		var e = function e(_e3, t) {
			var n,
				o,
				i,
				a,
				r,
				l,
				s,
				u,
				c,
				d,
				p,
				m,
				f,
				h,
				v,
				g,
				w,
				x,
				y,
				b = this,
				C = !1,
				I = !0,
				T = !0,
				E = {
					barsSize: {
						top: 44,
						bottom: "auto"
					},
					closeElClasses: [
						"item",
						"caption",
						"zoom-wrap",
						"ui",
						"top-bar"
					],
					timeToIdle: 4e3,
					timeToIdleOutside: 1e3,
					loadingIndicatorDelay: 1e3,
					addCaptionHTMLFn: function addCaptionHTMLFn(e, t) {
						return e.title
							? ((t.children[0].innerHTML = e.title), !0)
							: ((t.children[0].innerHTML = ""), !1);
					},
					closeEl: !0,
					captionEl: !0,
					fullscreenEl: !0,
					zoomEl: !0,
					shareEl: !0,
					counterEl: !0,
					arrowEl: !0,
					preloaderEl: !0,
					tapToClose: !1,
					tapToToggleControls: !0,
					clickToCloseNonZoomable: !0,
					shareButtons: [
						{
							id: "facebook",
							label: "Share on Facebook",
							url:
								"https://www.facebook.com/sharer/sharer.php?u={{url}}"
						},
						{
							id: "twitter",
							label: "Tweet",
							url:
								"https://twitter.com/intent/tweet?text={{text}}&url={{url}}"
						},
						{
							id: "pinterest",
							label: "Pin it",
							url:
								"http://www.pinterest.com/pin/create/button/?url={{url}}&media={{image_url}}&description={{text}}"
						},
						{
							id: "download",
							label: "Download image",
							url: "{{raw_image_url}}",
							download: !0
						}
					],
					getImageURLForShare: function getImageURLForShare() {
						return _e3.currItem.src || "";
					},
					getPageURLForShare: function getPageURLForShare() {
						return window.location.href;
					},
					getTextForShare: function getTextForShare() {
						return _e3.currItem.title || "";
					},
					indexIndicatorSep: " / ",
					fitControlsWidth: 1200
				},
				D = function D(e) {
					if (g) return !0;
					(e = e || window.event),
						v.timeToIdle && v.mouseUsed && !c && P();

					for (
						var n,
							o,
							i = e.target || e.srcElement,
							a = i.getAttribute("class") || "",
							r = 0;
						r < W.length;
						r++
					) {
						(n = W[r]),
							n.onTap &&
								a.indexOf("pswp__" + n.name) > -1 &&
								(n.onTap(), (o = !0));
					}

					if (o) {
						e.stopPropagation && e.stopPropagation(), (g = !0);
						var l = t.features.isOldAndroid ? 600 : 30;
						w = setTimeout(function() {
							g = !1;
						}, l);
					}
				},
				S = function S() {
					return (
						!_e3.likelyTouchDevice ||
						v.mouseUsed ||
						screen.width > v.fitControlsWidth
					);
				},
				_ = function _(e, n, o) {
					t[(o ? "add" : "remove") + "Class"](e, "pswp__" + n);
				},
				M = function M() {
					var e = 1 === v.getNumItemsFn();
					e !== h && (_(o, "ui--one-slide", e), (h = e));
				},
				F = function F() {
					_(s, "share-modal--hidden", T);
				},
				O = function O() {
					return (
						(T = !T),
						T
							? (t.removeClass(s, "pswp__share-modal--fade-in"),
							  setTimeout(function() {
									T && F();
							  }, 300))
							: (F(),
							  setTimeout(function() {
									T ||
										t.addClass(
											s,
											"pswp__share-modal--fade-in"
										);
							  }, 30)),
						T || A(),
						!1
					);
				},
				k = function k(t) {
					t = t || window.event;
					var n = t.target || t.srcElement;
					return (
						_e3.shout("shareLinkClick", t, n),
						n.href
							? n.hasAttribute("download")
								? !0
								: (window.open(
										n.href,
										"pswp_share",
										"scrollbars=yes,resizable=yes,toolbar=no,location=yes,width=550,height=420,top=100,left=" +
											(window.screen
												? Math.round(
														screen.width / 2 - 275
												  )
												: 100)
								  ),
								  T || O(),
								  !1)
							: !1
					);
				},
				A = function A() {
					for (
						var e, t, n, o, i, a = "", r = 0;
						r < v.shareButtons.length;
						r++
					) {
						(e = v.shareButtons[r]),
							(n = v.getImageURLForShare(e)),
							(o = v.getPageURLForShare(e)),
							(i = v.getTextForShare(e)),
							(t = e.url
								.replace("{{url}}", encodeURIComponent(o))
								.replace("{{image_url}}", encodeURIComponent(n))
								.replace("{{raw_image_url}}", n)
								.replace("{{text}}", encodeURIComponent(i))),
							(a +=
								'<a href="' +
								t +
								'" target="_blank" class="pswp__share--' +
								e.id +
								'"' +
								(e.download ? "download" : "") +
								">" +
								e.label +
								"</a>"),
							v.parseShareButtonOut &&
								(a = v.parseShareButtonOut(e, a));
					}

					(s.children[0].innerHTML = a), (s.children[0].onclick = k);
				},
				R = function R(e) {
					for (var n = 0; n < v.closeElClasses.length; n++) {
						if (t.hasClass(e, "pswp__" + v.closeElClasses[n]))
							return !0;
					}
				},
				L = 0,
				P = function P() {
					clearTimeout(y), (L = 0), c && b.setIdle(!1);
				},
				Z = function Z(e) {
					e = e ? e : window.event;
					var t = e.relatedTarget || e.toElement;
					(t && "HTML" !== t.nodeName) ||
						(clearTimeout(y),
						(y = setTimeout(function() {
							b.setIdle(!0);
						}, v.timeToIdleOutside)));
				},
				z = function z() {
					v.fullscreenEl &&
						!t.features.isOldAndroid &&
						(n || (n = b.getFullscreenAPI()),
						n
							? (t.bind(document, n.eventK, b.updateFullscreen),
							  b.updateFullscreen(),
							  t.addClass(_e3.template, "pswp--supports-fs"))
							: t.removeClass(_e3.template, "pswp--supports-fs"));
				},
				N = function N() {
					v.preloaderEl &&
						(U(!0),
						d("beforeChange", function() {
							clearTimeout(f),
								(f = setTimeout(function() {
									_e3.currItem && _e3.currItem.loading
										? (!_e3.allowProgressiveImg() ||
												(_e3.currItem.img &&
													!_e3.currItem.img
														.naturalWidth)) &&
										  U(!1)
										: U(!0);
								}, v.loadingIndicatorDelay));
						}),
						d("imageLoadComplete", function(t, n) {
							_e3.currItem === n && U(!0);
						}));
				},
				U = function U(e) {
					m !== e && (_(p, "preloader--active", !e), (m = e));
				},
				K = function K(e) {
					var n = e.vGap;

					if (S()) {
						var r = v.barsSize;
						if (v.captionEl && "auto" === r.bottom) {
							if (
								(a ||
									((a = t.createEl(
										"pswp__caption pswp__caption--fake"
									)),
									a.appendChild(
										t.createEl("pswp__caption__center")
									),
									o.insertBefore(a, i),
									t.addClass(o, "pswp__ui--fit")),
								v.addCaptionHTMLFn(e, a, !0))
							) {
								var l = a.clientHeight;
								n.bottom = parseInt(l, 10) || 44;
							} else n.bottom = r.top;
						} else n.bottom = "auto" === r.bottom ? 0 : r.bottom;
						n.top = r.top;
					} else n.top = n.bottom = 0;
				},
				H = function H() {
					v.timeToIdle &&
						d("mouseUsed", function() {
							t.bind(document, "mousemove", P),
								t.bind(document, "mouseout", Z),
								(x = setInterval(function() {
									L++, 2 === L && b.setIdle(!0);
								}, v.timeToIdle / 2));
						});
				},
				B = function B() {
					d("onVerticalDrag", function(e) {
						I && 0.95 > e
							? b.hideControls()
							: !I && e >= 0.95 && b.showControls();
					});
					var e;
					d("onPinchClose", function(t) {
						I && 0.9 > t
							? (b.hideControls(), (e = !0))
							: e && !I && t > 0.9 && b.showControls();
					}),
						d("zoomGestureEnded", function() {
							(e = !1), e && !I && b.showControls();
						});
				},
				W = [
					{
						name: "caption",
						option: "captionEl",
						onInit: function onInit(e) {
							i = e;
						}
					},
					{
						name: "share-modal",
						option: "shareEl",
						onInit: function onInit(e) {
							s = e;
						},
						onTap: function onTap() {
							O();
						}
					},
					{
						name: "button--share",
						option: "shareEl",
						onInit: function onInit(e) {
							l = e;
						},
						onTap: function onTap() {
							O();
						}
					},
					{
						name: "button--zoom",
						option: "zoomEl",
						onTap: _e3.toggleDesktopZoom
					},
					{
						name: "counter",
						option: "counterEl",
						onInit: function onInit(e) {
							r = e;
						}
					},
					{
						name: "button--close",
						option: "closeEl",
						onTap: _e3.close
					},
					{
						name: "button--arrow--left",
						option: "arrowEl",
						onTap: _e3.prev
					},
					{
						name: "button--arrow--right",
						option: "arrowEl",
						onTap: _e3.next
					},
					{
						name: "button--fs",
						option: "fullscreenEl",
						onTap: function onTap() {
							n.isFullscreen() ? n.exit() : n.enter();
						}
					},
					{
						name: "preloader",
						option: "preloaderEl",
						onInit: function onInit(e) {
							p = e;
						}
					}
				],
				Y = function Y() {
					var e,
						n,
						i,
						a = function a(o) {
							if (o)
								for (var a = o.length, r = 0; a > r; r++) {
									(e = o[r]), (n = e.className);

									for (var l = 0; l < W.length; l++) {
										(i = W[l]),
											n.indexOf("pswp__" + i.name) > -1 &&
												(v[i.option]
													? (t.removeClass(
															e,
															"pswp__element--disabled"
													  ),
													  i.onInit && i.onInit(e))
													: t.addClass(
															e,
															"pswp__element--disabled"
													  ));
									}
								}
						};

					a(o.children);
					var r = t.getChildByClass(o, "pswp__top-bar");
					r && a(r.children);
				};

			(b.init = function() {
				t.extend(_e3.options, E, !0),
					(v = _e3.options),
					(o = t.getChildByClass(_e3.scrollWrap, "pswp__ui")),
					(d = _e3.listen),
					B(),
					d("beforeChange", b.update),
					d("doubleTap", function(t) {
						var n = _e3.currItem.initialZoomLevel;
						_e3.getZoomLevel() !== n
							? _e3.zoomTo(n, t, 333)
							: _e3.zoomTo(
									v.getDoubleTapZoom(!1, _e3.currItem),
									t,
									333
							  );
					}),
					d("preventDragEvent", function(e, t, n) {
						var o = e.target || e.srcElement;
						o &&
							o.getAttribute("class") &&
							e.type.indexOf("mouse") > -1 &&
							(o.getAttribute("class").indexOf("__caption") > 0 ||
								/(SMALL|STRONG|EM)/i.test(o.tagName)) &&
							(n.prevent = !1);
					}),
					d("bindEvents", function() {
						t.bind(o, "pswpTap click", D),
							t.bind(_e3.scrollWrap, "pswpTap", b.onGlobalTap),
							_e3.likelyTouchDevice ||
								t.bind(
									_e3.scrollWrap,
									"mouseover",
									b.onMouseOver
								);
					}),
					d("unbindEvents", function() {
						T || O(),
							x && clearInterval(x),
							t.unbind(document, "mouseout", Z),
							t.unbind(document, "mousemove", P),
							t.unbind(o, "pswpTap click", D),
							t.unbind(_e3.scrollWrap, "pswpTap", b.onGlobalTap),
							t.unbind(
								_e3.scrollWrap,
								"mouseover",
								b.onMouseOver
							),
							n &&
								(t.unbind(
									document,
									n.eventK,
									b.updateFullscreen
								),
								n.isFullscreen() &&
									((v.hideAnimationDuration = 0), n.exit()),
								(n = null));
					}),
					d("destroy", function() {
						v.captionEl &&
							(a && o.removeChild(a),
							t.removeClass(i, "pswp__caption--empty")),
							s && (s.children[0].onclick = null),
							t.removeClass(o, "pswp__ui--over-close"),
							t.addClass(o, "pswp__ui--hidden"),
							b.setIdle(!1);
					}),
					v.showAnimationDuration ||
						t.removeClass(o, "pswp__ui--hidden"),
					d("initialZoomIn", function() {
						v.showAnimationDuration &&
							t.removeClass(o, "pswp__ui--hidden");
					}),
					d("initialZoomOut", function() {
						t.addClass(o, "pswp__ui--hidden");
					}),
					d("parseVerticalMargin", K),
					Y(),
					v.shareEl && l && s && (T = !0),
					M(),
					H(),
					z(),
					N();
			}),
				(b.setIdle = function(e) {
					(c = e), _(o, "ui--idle", e);
				}),
				(b.update = function() {
					I && _e3.currItem
						? (b.updateIndexIndicator(),
						  v.captionEl &&
								(v.addCaptionHTMLFn(_e3.currItem, i),
								_(i, "caption--empty", !_e3.currItem.title)),
						  (C = !0))
						: (C = !1),
						T || O(),
						M();
				}),
				(b.updateFullscreen = function(o) {
					o &&
						setTimeout(function() {
							_e3.setScrollOffset(0, t.getScrollY());
						}, 50),
						t[(n.isFullscreen() ? "add" : "remove") + "Class"](
							_e3.template,
							"pswp--fs"
						);
				}),
				(b.updateIndexIndicator = function() {
					v.counterEl &&
						(r.innerHTML =
							_e3.getCurrentIndex() +
							1 +
							v.indexIndicatorSep +
							v.getNumItemsFn());
				}),
				(b.onGlobalTap = function(n) {
					n = n || window.event;
					var o = n.target || n.srcElement;
					if (!g)
						if (n.detail && "mouse" === n.detail.pointerType) {
							if (R(o)) return void _e3.close();
							t.hasClass(o, "pswp__img") &&
								(1 === _e3.getZoomLevel() &&
								_e3.getZoomLevel() <= _e3.currItem.fitRatio
									? v.clickToCloseNonZoomable && _e3.close()
									: _e3.toggleDesktopZoom(
											n.detail.releasePoint
									  ));
						} else if (
							(v.tapToToggleControls &&
								(I ? b.hideControls() : b.showControls()),
							v.tapToClose &&
								(t.hasClass(o, "pswp__img") || R(o)))
						)
							return void _e3.close();
				}),
				(b.onMouseOver = function(e) {
					e = e || window.event;
					var t = e.target || e.srcElement;

					_(o, "ui--over-close", R(t));
				}),
				(b.hideControls = function() {
					t.addClass(o, "pswp__ui--hidden"), (I = !1);
				}),
				(b.showControls = function() {
					(I = !0),
						C || b.update(),
						t.removeClass(o, "pswp__ui--hidden");
				}),
				(b.supportsFullscreen = function() {
					var e = document;
					return !!(
						e.exitFullscreen ||
						e.mozCancelFullScreen ||
						e.webkitExitFullscreen ||
						e.msExitFullscreen
					);
				}),
				(b.getFullscreenAPI = function() {
					var t,
						n = document.documentElement,
						o = "fullscreenchange";
					return (
						n.requestFullscreen
							? (t = {
									enterK: "requestFullscreen",
									exitK: "exitFullscreen",
									elementK: "fullscreenElement",
									eventK: o
							  })
							: n.mozRequestFullScreen
							? (t = {
									enterK: "mozRequestFullScreen",
									exitK: "mozCancelFullScreen",
									elementK: "mozFullScreenElement",
									eventK: "moz" + o
							  })
							: n.webkitRequestFullscreen
							? (t = {
									enterK: "webkitRequestFullscreen",
									exitK: "webkitExitFullscreen",
									elementK: "webkitFullscreenElement",
									eventK: "webkit" + o
							  })
							: n.msRequestFullscreen &&
							  (t = {
									enterK: "msRequestFullscreen",
									exitK: "msExitFullscreen",
									elementK: "msFullscreenElement",
									eventK: "MSFullscreenChange"
							  }),
						t &&
							((t.enter = function() {
								return (
									(u = v.closeOnScroll),
									(v.closeOnScroll = !1),
									"webkitRequestFullscreen" !== this.enterK
										? _e3.template[this.enterK]()
										: void _e3.template[this.enterK](
												Element.ALLOW_KEYBOARD_INPUT
										  )
								);
							}),
							(t.exit = function() {
								return (
									(v.closeOnScroll = u),
									document[this.exitK]()
								);
							}),
							(t.isFullscreen = function() {
								return document[this.elementK];
							})),
						t
					);
				});
		};

		return e;
	});

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
				var f = h[d],
					l = o[f],
					g = parseFloat(l);
				a[f] = isNaN(g) ? 0 : g;
			}

			var p = a.paddingLeft + a.paddingRight,
				m = a.paddingTop + a.paddingBottom,
				y = a.marginLeft + a.marginRight,
				v = a.marginTop + a.marginBottom,
				E = a.borderLeftWidth + a.borderRightWidth,
				_ = a.borderTopWidth + a.borderBottomWidth,
				w = c && r,
				x = t(o.width);

			x !== !1 && (a.width = x + (w ? 0 : p + E));
			var b = t(o.height);
			return (
				b !== !1 && (a.height = b + (w ? 0 : m + _)),
				(a.innerWidth = a.width - (p + E)),
				(a.innerHeight = a.height - (m + _)),
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
		var f = {
			"-webkit-transform": "transform"
		};
		(c.ontransitionend = function(t) {
			if (t.target === this.element) {
				var i = this._transn,
					n = f[t.propertyName] || t.propertyName;

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
		var l = {
			transitionProperty: "",
			transitionDuration: "",
			transitionDelay: ""
		};
		return (
			(c.removeTransitionStyles = function() {
				this.css(l);
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
			(this.element.outlayerGUID = s), (f[s] = this), this._create();

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
			f = {};

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
		var l = o.prototype;
		n.extend(l, i.prototype),
			(l.option = function(t) {
				n.extend(this.options, t);
			}),
			(l._getOption = function(t) {
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
			(l._create = function() {
				this.reloadItems(),
					(this.stamps = []),
					this.stamp(this.options.stamp),
					n.extend(this.element.style, this.options.containerStyle);

				var t = this._getOption("resize");

				t && this.bindResize();
			}),
			(l.reloadItems = function() {
				this.items = this._itemize(this.element.children);
			}),
			(l._itemize = function(t) {
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
			(l._filterFindItemElements = function(t) {
				return n.filterFindElements(t, this.options.itemSelector);
			}),
			(l.getItemElements = function() {
				return this.items.map(function(t) {
					return t.element;
				});
			}),
			(l.layout = function() {
				this._resetLayout(), this._manageStamps();

				var t = this._getOption("layoutInstant"),
					i = void 0 !== t ? t : !this._isLayoutInited;

				this.layoutItems(this.items, i), (this._isLayoutInited = !0);
			}),
			(l._init = l.layout),
			(l._resetLayout = function() {
				this.getSize();
			}),
			(l.getSize = function() {
				this.size = e(this.element);
			}),
			(l._getMeasurement = function(t, i) {
				var n,
					s = this.options[t];
				s
					? ("string" == typeof s
							? (n = this.element.querySelector(s))
							: s instanceof HTMLElement && (n = s),
					  (this[t] = n ? e(n)[i] : s))
					: (this[t] = 0);
			}),
			(l.layoutItems = function(t, i) {
				(t = this._getItemsForLayout(t)),
					this._layoutItems(t, i),
					this._postLayout();
			}),
			(l._getItemsForLayout = function(t) {
				return t.filter(function(t) {
					return !t.isIgnored;
				});
			}),
			(l._layoutItems = function(t, i) {
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
			(l._getItemLayoutPosition = function() {
				return {
					x: 0,
					y: 0
				};
			}),
			(l._processLayoutQueue = function(t) {
				this.updateStagger(),
					t.forEach(function(t, i) {
						this._positionItem(t.item, t.x, t.y, t.isInstant, i);
					}, this);
			}),
			(l.updateStagger = function() {
				var t = this.options.stagger;
				return null === t || void 0 === t
					? void (this.stagger = 0)
					: ((this.stagger = a(t)), this.stagger);
			}),
			(l._positionItem = function(t, i, e, n, s) {
				n
					? t.goTo(i, e)
					: (t.stagger(s * this.stagger), t.moveTo(i, e));
			}),
			(l._postLayout = function() {
				this.resizeContainer();
			}),
			(l.resizeContainer = function() {
				var t = this._getOption("resizeContainer");

				if (t) {
					var i = this._getContainerSize();

					i &&
						(this._setContainerMeasure(i.width, !0),
						this._setContainerMeasure(i.height, !1));
				}
			}),
			(l._getContainerSize = c),
			(l._setContainerMeasure = function(t, i) {
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
			(l._emitCompleteOnItems = function(t, i) {
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
			(l.dispatchEvent = function(t, i, e) {
				var n = i ? [i].concat(e) : e;
				if ((this.emitEvent(t, n), u))
					if (
						((this.$element = this.$element || u(this.element)), i)
					) {
						var s = u.Event(i);
						(s.type = t), this.$element.trigger(s, e);
					} else this.$element.trigger(t, e);
			}),
			(l.ignore = function(t) {
				var i = this.getItem(t);
				i && (i.isIgnored = !0);
			}),
			(l.unignore = function(t) {
				var i = this.getItem(t);
				i && delete i.isIgnored;
			}),
			(l.stamp = function(t) {
				(t = this._find(t)),
					t &&
						((this.stamps = this.stamps.concat(t)),
						t.forEach(this.ignore, this));
			}),
			(l.unstamp = function(t) {
				(t = this._find(t)),
					t &&
						t.forEach(function(t) {
							n.removeFrom(this.stamps, t), this.unignore(t);
						}, this);
			}),
			(l._find = function(t) {
				return t
					? ("string" == typeof t &&
							(t = this.element.querySelectorAll(t)),
					  (t = n.makeArray(t)))
					: void 0;
			}),
			(l._manageStamps = function() {
				this.stamps &&
					this.stamps.length &&
					(this._getBoundingRect(),
					this.stamps.forEach(this._manageStamp, this));
			}),
			(l._getBoundingRect = function() {
				var t = this.element.getBoundingClientRect(),
					i = this.size;
				this._boundingRect = {
					left: t.left + i.paddingLeft + i.borderLeftWidth,
					top: t.top + i.paddingTop + i.borderTopWidth,
					right: t.right - (i.paddingRight + i.borderRightWidth),
					bottom: t.bottom - (i.paddingBottom + i.borderBottomWidth)
				};
			}),
			(l._manageStamp = c),
			(l._getElementOffset = function(t) {
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
			(l.handleEvent = n.handleEvent),
			(l.bindResize = function() {
				t.addEventListener("resize", this), (this.isResizeBound = !0);
			}),
			(l.unbindResize = function() {
				t.removeEventListener("resize", this),
					(this.isResizeBound = !1);
			}),
			(l.onresize = function() {
				this.resize();
			}),
			n.debounceMethod(o, "onresize", 100),
			(l.resize = function() {
				this.isResizeBound && this.needsResizeLayout() && this.layout();
			}),
			(l.needsResizeLayout = function() {
				var t = e(this.element),
					i = this.size && t;
				return i && t.innerWidth !== this.size.innerWidth;
			}),
			(l.addItems = function(t) {
				var i = this._itemize(t);

				return i.length && (this.items = this.items.concat(i)), i;
			}),
			(l.appended = function(t) {
				var i = this.addItems(t);
				i.length && (this.layoutItems(i, !0), this.reveal(i));
			}),
			(l.prepended = function(t) {
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
			(l.reveal = function(t) {
				if ((this._emitCompleteOnItems("reveal", t), t && t.length)) {
					var i = this.updateStagger();
					t.forEach(function(t, e) {
						t.stagger(e * i), t.reveal();
					});
				}
			}),
			(l.hide = function(t) {
				if ((this._emitCompleteOnItems("hide", t), t && t.length)) {
					var i = this.updateStagger();
					t.forEach(function(t, e) {
						t.stagger(e * i), t.hide();
					});
				}
			}),
			(l.revealItemElements = function(t) {
				var i = this.getItems(t);
				this.reveal(i);
			}),
			(l.hideItemElements = function(t) {
				var i = this.getItems(t);
				this.hide(i);
			}),
			(l.getItem = function(t) {
				for (var i = 0; i < this.items.length; i++) {
					var e = this.items[i];
					if (e.element === t) return e;
				}
			}),
			(l.getItems = function(t) {
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
			(l.remove = function(t) {
				var i = this.getItems(t);
				this._emitCompleteOnItems("remove", i),
					i &&
						i.length &&
						i.forEach(function(t) {
							t.remove(), n.removeFrom(this.items, t);
						}, this);
			}),
			(l.destroy = function() {
				var t = this.element.style;
				(t.height = ""),
					(t.position = ""),
					(t.width = ""),
					this.items.forEach(function(t) {
						t.destroy();
					}),
					this.unbindResize();
				var i = this.element.outlayerGUID;
				delete f[i],
					delete this.element.outlayerGUID,
					u && u.removeData(this.element, this.constructor.namespace);
			}),
			(o.data = function(t) {
				t = n.getQueryElement(t);
				var i = t && t.outlayerGUID;
				return i && f[i];
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
						var f = s ? 0 : d * h,
							l = s ? d * h : 0;

						this._addShiftTarget(f, l, a);
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

		t.imagesLoaded = i(t, t.EvEmitter);
	})("undefined" != typeof window ? window : this, function(t, i) {
		function e(t, i) {
			for (var e in i) {
				i.hasOwnProperty(e) && (t[e] = i[e]);
			}

			return t;
		}

		function n(t) {
			var i = [];
			if (Array.isArray(t)) i = t;
			else if ("number" == typeof t.length)
				for (var e = 0; e < t.length; e++) {
					i.push(t[e]);
				}
			else i.push(t);
			return i;
		}

		function s(t, i, o) {
			return this instanceof s
				? ("string" == typeof t && (t = document.querySelectorAll(t)),
				  (this.elements = n(t)),
				  (this.options = e({}, this.options)),
				  "function" == typeof i ? (o = i) : e(this.options, i),
				  o && this.on("always", o),
				  this.getImages(),
				  a && (this.jqDeferred = new a.Deferred()),
				  void setTimeout(
						function() {
							this.check();
						}.bind(this)
				  ))
				: new s(t, i, o);
		}

		function o(t) {
			this.img = t;
		}

		function r(t, i) {
			(this.url = t), (this.element = i), (this.img = new Image());
		}

		var a = t.jQuery,
			h = t.console;
		(s.prototype = Object.create(i.prototype)),
			(s.prototype.options = {}),
			(s.prototype.getImages = function() {
				(this.images = []),
					this.elements.forEach(this.addElementImages, this);
			}),
			(s.prototype.addElementImages = function(t) {
				"img" === t.nodeName && this.addImage(t),
					this.options.background === !0 &&
						this.addElementBackgroundImages(t);
				var i = t.nodeType;

				if (i && u[i]) {
					for (
						var e = t.querySelectorAll("img"), n = 0;
						n < e.length;
						n++
					) {
						var s = e[n];
						this.addImage(s);
					}

					if ("string" == typeof this.options.background) {
						var o = t.querySelectorAll(this.options.background);

						for (n = 0; n < o.length; n++) {
							var r = o[n];
							this.addElementBackgroundImages(r);
						}
					}
				}
			});
		var u = {
			1: !0,
			9: !0,
			11: !0
		};
		return (
			(s.prototype.addElementBackgroundImages = function(t) {
				var i = getComputedStyle(t);
				if (i)
					for (
						var e = /url\((['"])?(.*?)\1\)/gi,
							n = e.exec(i.backgroundImage);
						null !== n;

					) {
						var s = n && n[2];
						s && this.addBackground(s, t),
							(n = e.exec(i.backgroundImage));
					}
			}),
			(s.prototype.addImage = function(t) {
				var i = new o(t);
				this.images.push(i);
			}),
			(s.prototype.addBackground = function(t, i) {
				var e = new r(t, i);
				this.images.push(e);
			}),
			(s.prototype.check = function() {
				function t(t, e, n) {
					setTimeout(function() {
						i.progress(t, e, n);
					});
				}

				var i = this;
				return (
					(this.progressedCount = 0),
					(this.hasAnyBroken = !1),
					this.images.length
						? void this.images.forEach(function(i) {
								i.once("progress", t), i.check();
						  })
						: void this.complete()
				);
			}),
			(s.prototype.progress = function(t, i, e) {
				this.progressedCount++,
					(this.hasAnyBroken = this.hasAnyBroken || !t.isLoaded),
					this.emitEvent("progress", [this, t, i]),
					this.jqDeferred &&
						this.jqDeferred.notify &&
						this.jqDeferred.notify(this, t),
					this.progressedCount === this.images.length &&
						this.complete(),
					this.options.debug && h && h.log("progress: " + e, t, i);
			}),
			(s.prototype.complete = function() {
				var t = this.hasAnyBroken ? "fail" : "done";

				if (
					((this.isComplete = !0),
					this.emitEvent(t, [this]),
					this.emitEvent("always", [this]),
					this.jqDeferred)
				) {
					var i = this.hasAnyBroken ? "reject" : "resolve";
					this.jqDeferred[i](this);
				}
			}),
			(o.prototype = Object.create(i.prototype)),
			(o.prototype.check = function() {
				var t = this.getIsImageComplete();
				return t
					? void this.confirm(
							0 !== this.img.naturalWidth,
							"naturalWidth"
					  )
					: ((this.proxyImage = new Image()),
					  this.proxyImage.addEventListener("load", this),
					  this.proxyImage.addEventListener("error", this),
					  this.img.addEventListener("load", this),
					  this.img.addEventListener("error", this),
					  void (this.proxyImage.src = this.img.src));
			}),
			(o.prototype.getIsImageComplete = function() {
				return this.img.complete && void 0 !== this.img.naturalWidth;
			}),
			(o.prototype.confirm = function(t, i) {
				(this.isLoaded = t),
					this.emitEvent("progress", [this, this.img, i]);
			}),
			(o.prototype.handleEvent = function(t) {
				var i = "on" + t.type;
				this[i] && this[i](t);
			}),
			(o.prototype.onload = function() {
				this.confirm(!0, "onload"), this.unbindEvents();
			}),
			(o.prototype.onerror = function() {
				this.confirm(!1, "onerror"), this.unbindEvents();
			}),
			(o.prototype.unbindEvents = function() {
				this.proxyImage.removeEventListener("load", this),
					this.proxyImage.removeEventListener("error", this),
					this.img.removeEventListener("load", this),
					this.img.removeEventListener("error", this);
			}),
			(r.prototype = Object.create(o.prototype)),
			(r.prototype.check = function() {
				this.img.addEventListener("load", this),
					this.img.addEventListener("error", this),
					(this.img.src = this.url);
				var t = this.getIsImageComplete();
				t &&
					(this.confirm(0 !== this.img.naturalWidth, "naturalWidth"),
					this.unbindEvents());
			}),
			(r.prototype.unbindEvents = function() {
				this.img.removeEventListener("load", this),
					this.img.removeEventListener("error", this);
			}),
			(r.prototype.confirm = function(t, i) {
				(this.isLoaded = t),
					this.emitEvent("progress", [this, this.element, i]);
			}),
			(s.makeJQueryPlugin = function(i) {
				(i = i || t.jQuery),
					i &&
						((a = i),
						(a.fn.imagesLoaded = function(t, i) {
							var e = new s(this, t, i);
							return e.jqDeferred.promise(a(this));
						}));
			}),
			s.makeJQueryPlugin(),
			s
		);
	});
