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
			longtapTimer = setTimeout(function () {
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

				dblTapTimer = setTimeout(function () {
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

	win.tocca = function (options) {
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
			var e = document.createElement("div");
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

			var range = document.createRange();
			range.selectNodeContents(e);
			var frag = range.createContextualFragment(
				html.join("") + "</table>"
			);
			e.appendChild(frag);
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

			var e = document.createElementNS(
				"http://www.w3.org/2000/svg",
				"svg"
			);
			e.setAttributeNS(null, "viewBox", "0 0 " + size + " " + size);
			e.setAttributeNS(null, "style", "shape-rendering:crispEdges");
			var qrcodeId = "qrcode" + Date.now();
			e.setAttributeNS(null, "id", qrcodeId);
			var frag = document.createDocumentFragment();
			/* var svg = ['<style scoped>.bg{fill:' + fillcolor + '}.fg{fill:' + textcolor + '}</style>', '<rect class="bg" x="0" y="0"', 'width="' + size + '" height="' + size + '"/>', ]; */

			var style = document.createElementNS(
				"http://www.w3.org/2000/svg",
				"style"
			);
			style.appendChild(
				document.createTextNode(
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
			/* style.setAttributeNS(null, "scoped", "scoped"); */

			frag.appendChild(style);

			var createRect = function createRect(c, f, x, y, s) {
				var fg =
					document.createElementNS(
						"http://www.w3.org/2000/svg",
						"rect"
					) || "";
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
						frag.appendChild(
							createRect("fg", "none", xo, yo, modsize)
						);
					}

					xo += modsize;
				}

				yo += modsize;
			}
			/* e.innerHTML = svg.join(""); */

			e.appendChild(frag);
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

/*jslint browser: true */

/*jslint node: true */

/*global global, ActiveXObject, define, escape, module, pnotify, Proxy, jQuery, require, self, setImmediate, window */

/*!
 * modified PhotoSwipe - v4.1.0 - 2015-07-11
 * @see {@link http://photoswipe.com}
 * Copyright (c) 2015 Dmitry Semenov;
 * @see {@link https://github.com/dimsemenov/PhotoSwipe}
 * removed module check
 * exposed as window property
 * @see {@link https://github.com/dimsemenov/PhotoSwipe/blob/master/dist/photoswipe.js}
 * passes jshint
 */
(function(root, factory) {
	root.PhotoSwipe = factory();
})("undefined" !== typeof window ? window : this, function () {
	"use strict";

	var PhotoSwipe = function PhotoSwipe(template, UiClass, items, options) {
		var framework = {
			features: null,
			bind: function bind(target, type, listener, unbind) {
				var methodName = (unbind ? "remove" : "add") + "EventListener";
				type = type.split(" ");

				for (var i = 0; i < type.length; i++) {
					if (type[i]) {
						target[methodName](type[i], listener, false);
					}
				}
			},
			isArray: function isArray(obj) {
				return obj instanceof Array;
			},
			createEl: function createEl(classes, tag) {
				var el = document.createElement(tag || "div");

				if (classes) {
					el.className = classes;
				}

				return el;
			},
			getScrollY: function getScrollY() {
				var yOffset = window.pageYOffset;
				return yOffset !== undefined
					? yOffset
					: document.documentElement.scrollTop;
			},
			unbind: function unbind(target, type, listener) {
				framework.bind(target, type, listener, true);
			},
			removeClass: function removeClass(el, className) {
				var reg = new RegExp("(\\s|^)" + className + "(\\s|$)");
				el.className = el.className
					.replace(reg, " ")
					.replace(/^\s\s*/, "")
					.replace(/\s\s*$/, "");
			},
			addClass: function addClass(el, className) {
				if (!framework.hasClass(el, className)) {
					el.className += (el.className ? " " : "") + className;
				}
			},
			hasClass: function hasClass(el, className) {
				return (
					el.className &&
					new RegExp("(^|\\s)" + className + "(\\s|$)").test(
						el.className
					)
				);
			},
			getChildByClass: function getChildByClass(
				parentEl,
				childClassName
			) {
				var node = parentEl.firstChild;

				while (node) {
					if (framework.hasClass(node, childClassName)) {
						return node;
					}

					node = node.nextSibling;
				}
			},
			arraySearch: function arraySearch(array, value, key) {
				var i = array.length;

				while (i--) {
					if (array[i][key] === value) {
						return i;
					}
				}

				return -1;
			},
			extend: function extend(o1, o2, preventOverwrite) {
				for (var prop in o2) {
					if (o2.hasOwnProperty(prop)) {
						if (preventOverwrite && o1.hasOwnProperty(prop)) {
							continue;
						}

						o1[prop] = o2[prop];
					}
				}
			},
			easing: {
				sine: {
					out: function out(k) {
						return Math.sin(k * (Math.PI / 2));
					},
					inOut: function inOut(k) {
						return -(Math.cos(Math.PI * k) - 1) / 2;
					}
				},
				cubic: {
					out: function out(k) {
						return --k * k * k + 1;
					}
				}
			},
			detectFeatures: function detectFeatures() {
				if (framework.features) {
					return framework.features;
				}

				var helperEl = framework.createEl(),
					helperStyle = helperEl.style,
					vendor = "",
					features = {};
				features.oldIE = document.all && !document.addEventListener;
				features.touch = "ontouchstart" in window;

				if (window.requestAnimationFrame) {
					features.raf = window.requestAnimationFrame;
					features.caf = window.cancelAnimationFrame;
				}

				features.pointerEvent =
					navigator.pointerEnabled || navigator.msPointerEnabled;

				if (!features.pointerEvent) {
					var ua = navigator.userAgent;

					if (/iP(hone|od)/.test(navigator.platform)) {
						var v = navigator.appVersion.match(
							/OS (\d+)_(\d+)_?(\d+)?/
						);

						if (v && v.length > 0) {
							v = parseInt(v[1], 10);

							if (v >= 1 && v < 8) {
								features.isOldIOSPhone = true;
							}
						}
					}

					var match = ua.match(/Android\s([0-9\.]*)/);
					var androidversion = match ? match[1] : 0;
					androidversion = parseFloat(androidversion);

					if (androidversion >= 1) {
						if (androidversion < 4.4) {
							features.isOldAndroid = true;
						}

						features.androidVersion = androidversion;
					}

					features.isMobileOpera = /opera mini|opera mobi/i.test(ua);
				}

				var styleChecks = ["transform", "perspective", "animationName"],
					vendors = ["", "webkit", "Moz", "ms", "O"],
					styleCheckItem,
					styleName;

				for (var i = 0; i < 4; i++) {
					vendor = vendors[i];

					for (var a = 0; a < 3; a++) {
						styleCheckItem = styleChecks[a];
						styleName =
							vendor +
							(vendor
								? styleCheckItem.charAt(0).toUpperCase() +
								  styleCheckItem.slice(1)
								: styleCheckItem);

						if (
							!features[styleCheckItem] &&
							styleName in helperStyle
						) {
							features[styleCheckItem] = styleName;
						}
					}

					if (vendor && !features.raf) {
						vendor = vendor.toLowerCase();
						features.raf = window[vendor + "RequestAnimationFrame"];

						if (features.raf) {
							features.caf =
								window[vendor + "CancelAnimationFrame"] ||
								window[vendor + "CancelRequestAnimationFrame"];
						}
					}
				}

				if (!features.raf) {
					var lastTime = 0;

					features.raf = function (fn) {
						var currTime = new Date().getTime();
						var timeToCall = Math.max(
							0,
							16 - (currTime - lastTime)
						);
						var id = window.setTimeout(function () {
							fn(currTime + timeToCall);
						}, timeToCall);
						lastTime = currTime + timeToCall;
						return id;
					};

					features.caf = function (id) {
						clearTimeout(id);
					};
				}

				features.svg =
					!!document.createElementNS &&
					!!document.createElementNS(
						"http://www.w3.org/2000/svg",
						"svg"
					).createSVGRect;
				framework.features = features;
				return features;
			}
		};
		framework.detectFeatures();

		if (framework.features.oldIE) {
			framework.bind = function (target, type, listener, unbind) {
				type = type.split(" ");

				var methodName = (unbind ? "detach" : "attach") + "Event",
					evName,
					_handleEv = function _handleEv() {
						listener.handleEvent.call(listener);
					};

				for (var i = 0; i < type.length; i++) {
					evName = type[i];

					if (evName) {
						if (
							_typeof(listener) === "object" &&
							listener.handleEvent
						) {
							if (!unbind) {
								listener["oldIE" + evName] = _handleEv;
							} else {
								if (!listener["oldIE" + evName]) {
									return false;
								}
							}

							target[methodName](
								"on" + evName,
								listener["oldIE" + evName]
							);
						} else {
							target[methodName]("on" + evName, listener);
						}
					}
				}
			};
		}

		var self = this;
		var DOUBLE_TAP_RADIUS = 25,
			NUM_HOLDERS = 3;
		var _options = {
			allowPanToNext: true,
			spacing: 0.12,
			bgOpacity: 1,
			mouseUsed: false,
			loop: true,
			pinchToClose: true,
			closeOnScroll: true,
			closeOnVerticalDrag: true,
			verticalDragRange: 0.75,
			hideAnimationDuration: 333,
			showAnimationDuration: 333,
			showHideOpacity: false,
			focus: true,
			escKey: true,
			arrowKeys: true,
			mainScrollEndFriction: 0.35,
			panEndFriction: 0.35,
			isClickableElement: function isClickableElement(el) {
				return el.tagName === "A";
			},
			getDoubleTapZoom: function getDoubleTapZoom(isMouseClick, item) {
				if (isMouseClick) {
					return 1;
				} else {
					return item.initialZoomLevel < 0.7 ? 1 : 1.33;
				}
			},
			maxSpreadZoom: 1.33,
			modal: true,
			scaleMode: "fit"
		};
		framework.extend(_options, options);

		var _getEmptyPoint = function _getEmptyPoint() {
			return {
				x: 0,
				y: 0
			};
		};

		var _isOpen,
			_isDestroying,
			_closedByScroll,
			_currentItemIndex,
			_containerStyle,
			_containerShiftIndex,
			_currPanDist = _getEmptyPoint(),
			_startPanOffset = _getEmptyPoint(),
			_panOffset = _getEmptyPoint(),
			_upMoveEvents,
			_downEvents,
			_globalEventHandlers,
			_viewportSize = {},
			_currZoomLevel,
			_startZoomLevel,
			_translatePrefix,
			_translateSufix,
			_updateSizeInterval,
			_itemsNeedUpdate,
			_currPositionIndex = 0,
			_offset = {},
			_slideSize = _getEmptyPoint(),
			_itemHolders,
			_prevItemIndex,
			_indexDiff = 0,
			_dragStartEvent,
			_dragMoveEvent,
			_dragEndEvent,
			_dragCancelEvent,
			_transformKey,
			_pointerEventEnabled,
			_isFixedPosition = true,
			_likelyTouchDevice,
			_modules = [],
			_requestAF,
			_cancelAF,
			_initalClassName,
			_initalWindowScrollY,
			_oldIE,
			_currentWindowScrollY,
			_features,
			_windowVisibleSize = {},
			_renderMaxResolution = false,
			_registerModule = function _registerModule(name, module) {
				framework.extend(self, module.publicMethods);

				_modules.push(name);
			},
			_getLoopedId = function _getLoopedId(index) {
				var numSlides = _getNumItems();

				if (index > numSlides - 1) {
					return index - numSlides;
				} else if (index < 0) {
					return numSlides + index;
				}

				return index;
			},
			_listeners = {},
			_listen = function _listen(name, fn) {
				if (!_listeners[name]) {
					_listeners[name] = [];
				}

				return _listeners[name].push(fn);
			},
			_shout = function _shout(name) {
				var listeners = _listeners[name];

				if (listeners) {
					var args = Array.prototype.slice.call(arguments);
					args.shift();

					for (var i = 0; i < listeners.length; i++) {
						listeners[i].apply(self, args);
					}
				}
			},
			_getCurrentTime = function _getCurrentTime() {
				return new Date().getTime();
			},
			_applyBgOpacity = function _applyBgOpacity(opacity) {
				_bgOpacity = opacity;
				self.bg.style.opacity = opacity * _options.bgOpacity;
			},
			_applyZoomTransform = function _applyZoomTransform(
				styleObj,
				x,
				y,
				zoom,
				item
			) {
				if (!_renderMaxResolution || (item && item !== self.currItem)) {
					zoom =
						zoom / (item ? item.fitRatio : self.currItem.fitRatio);
				}

				styleObj[_transformKey] =
					_translatePrefix +
					x +
					"px, " +
					y +
					"px" +
					_translateSufix +
					" scale(" +
					zoom +
					")";
			},
			_applyCurrentZoomPan = function _applyCurrentZoomPan(
				allowRenderResolution
			) {
				if (_currZoomElementStyle) {
					if (allowRenderResolution) {
						if (_currZoomLevel > self.currItem.fitRatio) {
							if (!_renderMaxResolution) {
								_setImageSize(self.currItem, false, true);

								_renderMaxResolution = true;
							}
						} else {
							if (_renderMaxResolution) {
								_setImageSize(self.currItem);

								_renderMaxResolution = false;
							}
						}
					}

					_applyZoomTransform(
						_currZoomElementStyle,
						_panOffset.x,
						_panOffset.y,
						_currZoomLevel
					);
				}
			},
			_applyZoomPanToItem = function _applyZoomPanToItem(item) {
				if (item.container) {
					_applyZoomTransform(
						item.container.style,
						item.initialPosition.x,
						item.initialPosition.y,
						item.initialZoomLevel,
						item
					);
				}
			},
			_setTranslateX = function _setTranslateX(x, elStyle) {
				elStyle[_transformKey] =
					_translatePrefix + x + "px, 0px" + _translateSufix;
			},
			_moveMainScroll = function _moveMainScroll(x, dragging) {
				if (!_options.loop && dragging) {
					var newSlideIndexOffset =
							_currentItemIndex +
							(_slideSize.x * _currPositionIndex - x) /
								_slideSize.x,
						delta = Math.round(x - _mainScrollPos.x);

					if (
						(newSlideIndexOffset < 0 && delta > 0) ||
						(newSlideIndexOffset >= _getNumItems() - 1 && delta < 0)
					) {
						x =
							_mainScrollPos.x +
							delta * _options.mainScrollEndFriction;
					}
				}

				_mainScrollPos.x = x;

				_setTranslateX(x, _containerStyle);
			},
			_calculatePanOffset = function _calculatePanOffset(
				axis,
				zoomLevel
			) {
				var m = _midZoomPoint[axis] - _offset[axis];
				return (
					_startPanOffset[axis] +
					_currPanDist[axis] +
					m -
					m * (zoomLevel / _startZoomLevel)
				);
			},
			_equalizePoints = function _equalizePoints(p1, p2) {
				p1.x = p2.x;
				p1.y = p2.y;

				if (p2.id) {
					p1.id = p2.id;
				}
			},
			_roundPoint = function _roundPoint(p) {
				p.x = Math.round(p.x);
				p.y = Math.round(p.y);
			},
			_mouseMoveTimeout = null,
			_onFirstMouseMove = function _onFirstMouseMove() {
				if (_mouseMoveTimeout) {
					framework.unbind(document, "mousemove", _onFirstMouseMove);
					framework.addClass(template, "pswp--has_mouse");
					_options.mouseUsed = true;

					_shout("mouseUsed");
				}

				_mouseMoveTimeout = setTimeout(function () {
					_mouseMoveTimeout = null;
				}, 100);
			},
			_bindEvents = function _bindEvents() {
				framework.bind(document, "keydown", self);

				if (_features.transform) {
					framework.bind(self.scrollWrap, "click", self);
				}

				if (!_options.mouseUsed) {
					framework.bind(document, "mousemove", _onFirstMouseMove);
				}

				framework.bind(window, "resize scroll", self);

				_shout("bindEvents");
			},
			_unbindEvents = function _unbindEvents() {
				framework.unbind(window, "resize", self);
				framework.unbind(window, "scroll", _globalEventHandlers.scroll);
				framework.unbind(document, "keydown", self);
				framework.unbind(document, "mousemove", _onFirstMouseMove);

				if (_features.transform) {
					framework.unbind(self.scrollWrap, "click", self);
				}

				if (_isDragging) {
					framework.unbind(window, _upMoveEvents, self);
				}

				_shout("unbindEvents");
			},
			_calculatePanBounds = function _calculatePanBounds(
				zoomLevel,
				update
			) {
				var bounds = _calculateItemSize(
					self.currItem,
					_viewportSize,
					zoomLevel
				);

				if (update) {
					_currPanBounds = bounds;
				}

				return bounds;
			},
			_getMinZoomLevel = function _getMinZoomLevel(item) {
				if (!item) {
					item = self.currItem;
				}

				return item.initialZoomLevel;
			},
			_getMaxZoomLevel = function _getMaxZoomLevel(item) {
				if (!item) {
					item = self.currItem;
				}

				return item.w > 0 ? _options.maxSpreadZoom : 1;
			},
			_modifyDestPanOffset = function _modifyDestPanOffset(
				axis,
				destPanBounds,
				destPanOffset,
				destZoomLevel
			) {
				if (destZoomLevel === self.currItem.initialZoomLevel) {
					destPanOffset[axis] = self.currItem.initialPosition[axis];
					return true;
				} else {
					destPanOffset[axis] = _calculatePanOffset(
						axis,
						destZoomLevel
					);

					if (destPanOffset[axis] > destPanBounds.min[axis]) {
						destPanOffset[axis] = destPanBounds.min[axis];
						return true;
					} else if (destPanOffset[axis] < destPanBounds.max[axis]) {
						destPanOffset[axis] = destPanBounds.max[axis];
						return true;
					}
				}

				return false;
			},
			_setupTransforms = function _setupTransforms() {
				if (_transformKey) {
					var allow3dTransform =
						_features.perspective && !_likelyTouchDevice;
					_translatePrefix =
						"translate" + (allow3dTransform ? "3d(" : "(");
					_translateSufix = _features.perspective ? ", 0px)" : ")";
					return;
				}

				_transformKey = "left";
				framework.addClass(template, "pswp--ie");

				_setTranslateX = function _setTranslateX(x, elStyle) {
					elStyle.left = x + "px";
				};

				_applyZoomPanToItem = function _applyZoomPanToItem(item) {
					var zoomRatio = item.fitRatio > 1 ? 1 : item.fitRatio,
						s = item.container.style,
						w = zoomRatio * item.w,
						h = zoomRatio * item.h;
					s.width = w + "px";
					s.height = h + "px";
					s.left = item.initialPosition.x + "px";
					s.top = item.initialPosition.y + "px";
				};

				_applyCurrentZoomPan = function _applyCurrentZoomPan() {
					if (_currZoomElementStyle) {
						var s = _currZoomElementStyle,
							item = self.currItem,
							zoomRatio = item.fitRatio > 1 ? 1 : item.fitRatio,
							w = zoomRatio * item.w,
							h = zoomRatio * item.h;
						s.width = w + "px";
						s.height = h + "px";
						s.left = _panOffset.x + "px";
						s.top = _panOffset.y + "px";
					}
				};
			},
			_onKeyDown = function _onKeyDown(e) {
				var keydownAction = "";

				if (_options.escKey && e.keyCode === 27) {
					keydownAction = "close";
				} else if (_options.arrowKeys) {
					if (e.keyCode === 37) {
						keydownAction = "prev";
					} else if (e.keyCode === 39) {
						keydownAction = "next";
					}
				}

				if (keydownAction) {
					if (!e.ctrlKey && !e.altKey && !e.shiftKey && !e.metaKey) {
						if (e.preventDefault) {
							e.preventDefault();
						} else {
							e.returnValue = false;
						}

						self[keydownAction]();
					}
				}
			},
			_onGlobalClick = function _onGlobalClick(e) {
				if (!e) {
					return;
				}

				if (
					_moved ||
					_zoomStarted ||
					_mainScrollAnimating ||
					_verticalDragInitiated
				) {
					e.preventDefault();
					e.stopPropagation();
				}
			},
			_updatePageScrollOffset = function _updatePageScrollOffset() {
				self.setScrollOffset(0, framework.getScrollY());
			};

		var _animations = {},
			_numAnimations = 0,
			_stopAnimation = function _stopAnimation(name) {
				if (_animations[name]) {
					if (_animations[name].raf) {
						_cancelAF(_animations[name].raf);
					}

					_numAnimations--;
					delete _animations[name];
				}
			},
			_registerStartAnimation = function _registerStartAnimation(name) {
				if (_animations[name]) {
					_stopAnimation(name);
				}

				if (!_animations[name]) {
					_numAnimations++;
					_animations[name] = {};
				}
			},
			_stopAllAnimations = function _stopAllAnimations() {
				for (var prop in _animations) {
					if (_animations.hasOwnProperty(prop)) {
						_stopAnimation(prop);
					}
				}
			},
			_animateProp = function _animateProp(
				name,
				b,
				endProp,
				d,
				easingFn,
				onUpdate,
				onComplete
			) {
				var startAnimTime = _getCurrentTime(),
					t;

				_registerStartAnimation(name);

				var animloop = function animloop() {
					if (_animations[name]) {
						t = _getCurrentTime() - startAnimTime;

						if (t >= d) {
							_stopAnimation(name);

							onUpdate(endProp);

							if (onComplete) {
								onComplete();
							}

							return;
						}

						onUpdate((endProp - b) * easingFn(t / d) + b);
						_animations[name].raf = _requestAF(animloop);
					}
				};

				animloop();
			};

		var publicMethods = {
			shout: _shout,
			listen: _listen,
			viewportSize: _viewportSize,
			options: _options,
			isMainScrollAnimating: function isMainScrollAnimating() {
				return _mainScrollAnimating;
			},
			getZoomLevel: function getZoomLevel() {
				return _currZoomLevel;
			},
			getCurrentIndex: function getCurrentIndex() {
				return _currentItemIndex;
			},
			isDragging: function isDragging() {
				return _isDragging;
			},
			isZooming: function isZooming() {
				return _isZooming;
			},
			setScrollOffset: function setScrollOffset(x, y) {
				_offset.x = x;
				_currentWindowScrollY = _offset.y = y;

				_shout("updateScrollOffset", _offset);
			},
			applyZoomPan: function applyZoomPan(
				zoomLevel,
				panX,
				panY,
				allowRenderResolution
			) {
				_panOffset.x = panX;
				_panOffset.y = panY;
				_currZoomLevel = zoomLevel;

				_applyCurrentZoomPan(allowRenderResolution);
			},
			init: function init() {
				if (_isOpen || _isDestroying) {
					return;
				}

				var i;
				self.framework = framework;
				self.template = template;
				self.bg = framework.getChildByClass(template, "pswp__bg");
				_initalClassName = template.className;
				_isOpen = true;
				_features = framework.detectFeatures();
				_requestAF = _features.raf;
				_cancelAF = _features.caf;
				_transformKey = _features.transform;
				_oldIE = _features.oldIE;
				self.scrollWrap = framework.getChildByClass(
					template,
					"pswp__scroll-wrap"
				);
				self.container = framework.getChildByClass(
					self.scrollWrap,
					"pswp__container"
				);
				_containerStyle = self.container.style;
				self.itemHolders = _itemHolders = [
					{
						el: self.container.children[0],
						wrap: 0,
						index: -1
					},
					{
						el: self.container.children[1],
						wrap: 0,
						index: -1
					},
					{
						el: self.container.children[2],
						wrap: 0,
						index: -1
					}
				];
				_itemHolders[0].el.style.display = _itemHolders[2].el.style.display =
					"none";

				_setupTransforms();

				_globalEventHandlers = {
					resize: self.updateSize,
					scroll: _updatePageScrollOffset,
					keydown: _onKeyDown,
					click: _onGlobalClick
				};
				var oldPhone =
					_features.isOldIOSPhone ||
					_features.isOldAndroid ||
					_features.isMobileOpera;

				if (
					!_features.animationName ||
					!_features.transform ||
					oldPhone
				) {
					_options.showAnimationDuration = _options.hideAnimationDuration = 0;
				}

				for (i = 0; i < _modules.length; i++) {
					self["init" + _modules[i]]();
				}

				if (UiClass) {
					var ui = (self.ui = new UiClass(self, framework));
					ui.init();
				}

				_shout("firstUpdate");

				_currentItemIndex = _currentItemIndex || _options.index || 0;

				if (
					isNaN(_currentItemIndex) ||
					_currentItemIndex < 0 ||
					_currentItemIndex >= _getNumItems()
				) {
					_currentItemIndex = 0;
				}

				self.currItem = _getItemAt(_currentItemIndex);

				if (_features.isOldIOSPhone || _features.isOldAndroid) {
					_isFixedPosition = false;
				}

				template.setAttribute("aria-hidden", "false");

				if (_options.modal) {
					if (!_isFixedPosition) {
						template.style.position = "absolute";
						template.style.top = framework.getScrollY() + "px";
					} else {
						template.style.position = "fixed";
					}
				}

				if (_currentWindowScrollY === undefined) {
					_shout("initialLayout");

					_currentWindowScrollY = _initalWindowScrollY = framework.getScrollY();
				}

				var rootClasses = "pswp--open ";

				if (_options.mainClass) {
					rootClasses += _options.mainClass + " ";
				}

				if (_options.showHideOpacity) {
					rootClasses += "pswp--animate_opacity ";
				}

				rootClasses += _likelyTouchDevice
					? "pswp--touch"
					: "pswp--notouch";
				rootClasses += _features.animationName
					? " pswp--css_animation"
					: "";
				rootClasses += _features.svg ? " pswp--svg" : "";
				framework.addClass(template, rootClasses);
				self.updateSize();
				_containerShiftIndex = -1;
				_indexDiff = null;

				for (i = 0; i < NUM_HOLDERS; i++) {
					_setTranslateX(
						(i + _containerShiftIndex) * _slideSize.x,
						_itemHolders[i].el.style
					);
				}

				if (!_oldIE) {
					framework.bind(self.scrollWrap, _downEvents, self);
				}

				_listen("initialZoomInEnd", function () {
					self.setContent(_itemHolders[0], _currentItemIndex - 1);
					self.setContent(_itemHolders[2], _currentItemIndex + 1);
					_itemHolders[0].el.style.display = _itemHolders[2].el.style.display =
						"block";

					if (_options.focus) {
						template.focus();
					}

					_bindEvents();
				});

				self.setContent(_itemHolders[1], _currentItemIndex);
				self.updateCurrItem();

				_shout("afterInit");

				if (!_isFixedPosition) {
					_updateSizeInterval = setInterval(function () {
						if (
							!_numAnimations &&
							!_isDragging &&
							!_isZooming &&
							_currZoomLevel === self.currItem.initialZoomLevel
						) {
							self.updateSize();
						}
					}, 1000);
				}

				framework.addClass(template, "pswp--visible");
			},
			close: function close() {
				if (!_isOpen) {
					return;
				}

				_isOpen = false;
				_isDestroying = true;

				_shout("close");

				_unbindEvents();

				_showOrHide(self.currItem, null, true, self.destroy);
			},
			destroy: function destroy() {
				_shout("destroy");

				if (_showOrHideTimeout) {
					clearTimeout(_showOrHideTimeout);
				}

				template.setAttribute("aria-hidden", "true");
				template.className = _initalClassName;

				if (_updateSizeInterval) {
					clearInterval(_updateSizeInterval);
				}

				framework.unbind(self.scrollWrap, _downEvents, self);
				framework.unbind(window, "scroll", self);

				_stopDragUpdateLoop();

				_stopAllAnimations();

				_listeners = null;
			},
			panTo: function panTo(x, y, force) {
				if (!force) {
					if (x > _currPanBounds.min.x) {
						x = _currPanBounds.min.x;
					} else if (x < _currPanBounds.max.x) {
						x = _currPanBounds.max.x;
					}

					if (y > _currPanBounds.min.y) {
						y = _currPanBounds.min.y;
					} else if (y < _currPanBounds.max.y) {
						y = _currPanBounds.max.y;
					}
				}

				_panOffset.x = x;
				_panOffset.y = y;

				_applyCurrentZoomPan();
			},
			handleEvent: function handleEvent(e) {
				e = e || window.event;

				if (_globalEventHandlers[e.type]) {
					_globalEventHandlers[e.type](e);
				}
			},
			goTo: function goTo(index) {
				index = _getLoopedId(index);
				var diff = index - _currentItemIndex;
				_indexDiff = diff;
				_currentItemIndex = index;
				self.currItem = _getItemAt(_currentItemIndex);
				_currPositionIndex -= diff;

				_moveMainScroll(_slideSize.x * _currPositionIndex);

				_stopAllAnimations();

				_mainScrollAnimating = false;
				self.updateCurrItem();
			},
			next: function next() {
				self.goTo(_currentItemIndex + 1);
			},
			prev: function prev() {
				self.goTo(_currentItemIndex - 1);
			},
			updateCurrZoomItem: function updateCurrZoomItem(emulateSetContent) {
				if (emulateSetContent) {
					_shout("beforeChange", 0);
				}

				if (_itemHolders[1].el.children.length) {
					var zoomElement = _itemHolders[1].el.children[0];

					if (framework.hasClass(zoomElement, "pswp__zoom-wrap")) {
						_currZoomElementStyle = zoomElement.style;
					} else {
						_currZoomElementStyle = null;
					}
				} else {
					_currZoomElementStyle = null;
				}

				_currPanBounds = self.currItem.bounds;
				_startZoomLevel = _currZoomLevel =
					self.currItem.initialZoomLevel;
				_panOffset.x = _currPanBounds.center.x;
				_panOffset.y = _currPanBounds.center.y;

				if (emulateSetContent) {
					_shout("afterChange");
				}
			},
			invalidateCurrItems: function invalidateCurrItems() {
				_itemsNeedUpdate = true;

				for (var i = 0; i < NUM_HOLDERS; i++) {
					if (_itemHolders[i].item) {
						_itemHolders[i].item.needsUpdate = true;
					}
				}
			},
			updateCurrItem: function updateCurrItem(beforeAnimation) {
				if (_indexDiff === 0) {
					return;
				}

				var diffAbs = Math.abs(_indexDiff),
					tempHolder;

				if (beforeAnimation && diffAbs < 2) {
					return;
				}

				self.currItem = _getItemAt(_currentItemIndex);
				_renderMaxResolution = false;

				_shout("beforeChange", _indexDiff);

				if (diffAbs >= NUM_HOLDERS) {
					_containerShiftIndex +=
						_indexDiff +
						(_indexDiff > 0 ? -NUM_HOLDERS : NUM_HOLDERS);
					diffAbs = NUM_HOLDERS;
				}

				for (var i = 0; i < diffAbs; i++) {
					if (_indexDiff > 0) {
						tempHolder = _itemHolders.shift();
						_itemHolders[NUM_HOLDERS - 1] = tempHolder;
						_containerShiftIndex++;

						_setTranslateX(
							(_containerShiftIndex + 2) * _slideSize.x,
							tempHolder.el.style
						);

						self.setContent(
							tempHolder,
							_currentItemIndex - diffAbs + i + 1 + 1
						);
					} else {
						tempHolder = _itemHolders.pop();

						_itemHolders.unshift(tempHolder);

						_containerShiftIndex--;

						_setTranslateX(
							_containerShiftIndex * _slideSize.x,
							tempHolder.el.style
						);

						self.setContent(
							tempHolder,
							_currentItemIndex + diffAbs - i - 1 - 1
						);
					}
				}

				if (_currZoomElementStyle && Math.abs(_indexDiff) === 1) {
					var prevItem = _getItemAt(_prevItemIndex);

					if (prevItem.initialZoomLevel !== _currZoomLevel) {
						_calculateItemSize(prevItem, _viewportSize);

						_setImageSize(prevItem);

						_applyZoomPanToItem(prevItem);
					}
				}

				_indexDiff = 0;
				self.updateCurrZoomItem();
				_prevItemIndex = _currentItemIndex;

				_shout("afterChange");
			},
			updateSize: function updateSize(force) {
				if (!_isFixedPosition && _options.modal) {
					var windowScrollY = framework.getScrollY();

					if (_currentWindowScrollY !== windowScrollY) {
						template.style.top = windowScrollY + "px";
						_currentWindowScrollY = windowScrollY;
					}

					if (
						!force &&
						_windowVisibleSize.x === window.innerWidth &&
						_windowVisibleSize.y === window.innerHeight
					) {
						return;
					}

					_windowVisibleSize.x = window.innerWidth;
					_windowVisibleSize.y = window.innerHeight;
					template.style.height = _windowVisibleSize.y + "px";
				}

				_viewportSize.x = self.scrollWrap.clientWidth;
				_viewportSize.y = self.scrollWrap.clientHeight;

				_updatePageScrollOffset();

				_slideSize.x =
					_viewportSize.x +
					Math.round(_viewportSize.x * _options.spacing);
				_slideSize.y = _viewportSize.y;

				_moveMainScroll(_slideSize.x * _currPositionIndex);

				_shout("beforeResize");

				if (_containerShiftIndex !== undefined) {
					var holder, item, hIndex;

					for (var i = 0; i < NUM_HOLDERS; i++) {
						holder = _itemHolders[i];

						_setTranslateX(
							(i + _containerShiftIndex) * _slideSize.x,
							holder.el.style
						);

						hIndex = _currentItemIndex + i - 1;

						if (_options.loop && _getNumItems() > 2) {
							hIndex = _getLoopedId(hIndex);
						}

						item = _getItemAt(hIndex);

						if (
							item &&
							(_itemsNeedUpdate ||
								item.needsUpdate ||
								!item.bounds)
						) {
							self.cleanSlide(item);
							self.setContent(holder, hIndex);

							if (i === 1) {
								self.currItem = item;
								self.updateCurrZoomItem(true);
							}

							item.needsUpdate = false;
						} else if (holder.index === -1 && hIndex >= 0) {
							self.setContent(holder, hIndex);
						}

						if (item && item.container) {
							_calculateItemSize(item, _viewportSize);

							_setImageSize(item);

							_applyZoomPanToItem(item);
						}
					}

					_itemsNeedUpdate = false;
				}

				_startZoomLevel = _currZoomLevel =
					self.currItem.initialZoomLevel;
				_currPanBounds = self.currItem.bounds;

				if (_currPanBounds) {
					_panOffset.x = _currPanBounds.center.x;
					_panOffset.y = _currPanBounds.center.y;

					_applyCurrentZoomPan(true);
				}

				_shout("resize");
			},
			zoomTo: function zoomTo(
				destZoomLevel,
				centerPoint,
				speed,
				easingFn,
				updateFn
			) {
				if (centerPoint) {
					_startZoomLevel = _currZoomLevel;
					_midZoomPoint.x = Math.abs(centerPoint.x) - _panOffset.x;
					_midZoomPoint.y = Math.abs(centerPoint.y) - _panOffset.y;

					_equalizePoints(_startPanOffset, _panOffset);
				}

				var destPanBounds = _calculatePanBounds(destZoomLevel, false),
					destPanOffset = {};

				_modifyDestPanOffset(
					"x",
					destPanBounds,
					destPanOffset,
					destZoomLevel
				);

				_modifyDestPanOffset(
					"y",
					destPanBounds,
					destPanOffset,
					destZoomLevel
				);

				var initialZoomLevel = _currZoomLevel;
				var initialPanOffset = {
					x: _panOffset.x,
					y: _panOffset.y
				};

				_roundPoint(destPanOffset);

				var onUpdate = function onUpdate(now) {
					if (now === 1) {
						_currZoomLevel = destZoomLevel;
						_panOffset.x = destPanOffset.x;
						_panOffset.y = destPanOffset.y;
					} else {
						_currZoomLevel =
							(destZoomLevel - initialZoomLevel) * now +
							initialZoomLevel;
						_panOffset.x =
							(destPanOffset.x - initialPanOffset.x) * now +
							initialPanOffset.x;
						_panOffset.y =
							(destPanOffset.y - initialPanOffset.y) * now +
							initialPanOffset.y;
					}

					if (updateFn) {
						updateFn(now);
					}

					_applyCurrentZoomPan(now === 1);
				};

				if (speed) {
					_animateProp(
						"customZoomTo",
						0,
						1,
						speed,
						easingFn || framework.easing.sine.inOut,
						onUpdate
					);
				} else {
					onUpdate(1);
				}
			}
		};
		var MIN_SWIPE_DISTANCE = 30,
			DIRECTION_CHECK_OFFSET = 10;

		var _gestureStartTime,
			_gestureCheckSpeedTime,
			p = {},
			p2 = {},
			delta = {},
			_currPoint = {},
			_startPoint = {},
			_currPointers = [],
			_startMainScrollPos = {},
			_releaseAnimData,
			_posPoints = [],
			_tempPoint = {},
			_isZoomingIn,
			_verticalDragInitiated,
			_oldAndroidTouchEndTimeout,
			_currZoomedItemIndex = 0,
			_centerPoint = _getEmptyPoint(),
			_lastReleaseTime = 0,
			_isDragging,
			_isMultitouch,
			_zoomStarted,
			_moved,
			_dragAnimFrame,
			_mainScrollShifted,
			_currentPoints,
			_isZooming,
			_currPointsDistance,
			_startPointsDistance,
			_currPanBounds,
			_mainScrollPos = _getEmptyPoint(),
			_currZoomElementStyle,
			_mainScrollAnimating,
			_midZoomPoint = _getEmptyPoint(),
			_currCenterPoint = _getEmptyPoint(),
			_direction,
			_isFirstMove,
			_opacityChanged,
			_bgOpacity,
			_wasOverInitialZoom,
			_isEqualPoints = function _isEqualPoints(p1, p2) {
				return p1.x === p2.x && p1.y === p2.y;
			},
			_isNearbyPoints = function _isNearbyPoints(touch0, touch1) {
				return (
					Math.abs(touch0.x - touch1.x) < DOUBLE_TAP_RADIUS &&
					Math.abs(touch0.y - touch1.y) < DOUBLE_TAP_RADIUS
				);
			},
			_calculatePointsDistance = function _calculatePointsDistance(
				p1,
				p2
			) {
				_tempPoint.x = Math.abs(p1.x - p2.x);
				_tempPoint.y = Math.abs(p1.y - p2.y);
				return Math.sqrt(
					_tempPoint.x * _tempPoint.x + _tempPoint.y * _tempPoint.y
				);
			},
			_stopDragUpdateLoop = function _stopDragUpdateLoop() {
				if (_dragAnimFrame) {
					_cancelAF(_dragAnimFrame);

					_dragAnimFrame = null;
				}
			},
			_dragUpdateLoop = function _dragUpdateLoop() {
				if (_isDragging) {
					_dragAnimFrame = _requestAF(_dragUpdateLoop);

					_renderMovement();
				}
			},
			_canPan = function _canPan() {
				return !(
					_options.scaleMode === "fit" &&
					_currZoomLevel === self.currItem.initialZoomLevel
				);
			},
			_closestElement = function _closestElement(el, fn) {
				if (!el || el === document) {
					return false;
				}

				if (
					el.getAttribute("class") &&
					el.getAttribute("class").indexOf("pswp__scroll-wrap") > -1
				) {
					return false;
				}

				if (fn(el)) {
					return el;
				}

				return _closestElement(el.parentNode, fn);
			},
			_preventObj = {},
			_preventDefaultEventBehaviour = function _preventDefaultEventBehaviour(
				e,
				isDown
			) {
				_preventObj.prevent = !_closestElement(
					e.target,
					_options.isClickableElement
				);

				_shout("preventDragEvent", e, isDown, _preventObj);

				return _preventObj.prevent;
			},
			_convertTouchToPoint = function _convertTouchToPoint(touch, p) {
				p.x = touch.pageX;
				p.y = touch.pageY;
				p.id = touch.identifier;
				return p;
			},
			_findCenterOfPoints = function _findCenterOfPoints(
				p1,
				p2,
				pCenter
			) {
				pCenter.x = (p1.x + p2.x) * 0.5;
				pCenter.y = (p1.y + p2.y) * 0.5;
			},
			_pushPosPoint = function _pushPosPoint(time, x, y) {
				if (time - _gestureCheckSpeedTime > 50) {
					var o = _posPoints.length > 2 ? _posPoints.shift() : {};
					o.x = x;
					o.y = y;

					_posPoints.push(o);

					_gestureCheckSpeedTime = time;
				}
			},
			_calculateVerticalDragOpacityRatio = function _calculateVerticalDragOpacityRatio() {
				var yOffset = _panOffset.y - self.currItem.initialPosition.y;
				return 1 - Math.abs(yOffset / (_viewportSize.y / 2));
			},
			_ePoint1 = {},
			_ePoint2 = {},
			_tempPointsArr = [],
			_tempCounter,
			_getTouchPoints = function _getTouchPoints(e) {
				while (_tempPointsArr.length > 0) {
					_tempPointsArr.pop();
				}

				if (!_pointerEventEnabled) {
					if (e.type.indexOf("touch") > -1) {
						if (e.touches && e.touches.length > 0) {
							_tempPointsArr[0] = _convertTouchToPoint(
								e.touches[0],
								_ePoint1
							);

							if (e.touches.length > 1) {
								_tempPointsArr[1] = _convertTouchToPoint(
									e.touches[1],
									_ePoint2
								);
							}
						}
					} else {
						_ePoint1.x = e.pageX;
						_ePoint1.y = e.pageY;
						_ePoint1.id = "";
						_tempPointsArr[0] = _ePoint1;
					}
				} else {
					_tempCounter = 0;

					_currPointers.forEach(function(p) {
						if (_tempCounter === 0) {
							_tempPointsArr[0] = p;
						} else if (_tempCounter === 1) {
							_tempPointsArr[1] = p;
						}

						_tempCounter++;
					});
				}

				return _tempPointsArr;
			},
			_panOrMoveMainScroll = function _panOrMoveMainScroll(axis, delta) {
				var panFriction,
					overDiff = 0,
					newOffset = _panOffset[axis] + delta[axis],
					startOverDiff,
					dir = delta[axis] > 0,
					newMainScrollPosition = _mainScrollPos.x + delta.x,
					mainScrollDiff = _mainScrollPos.x - _startMainScrollPos.x,
					newPanPos,
					newMainScrollPos;

				if (
					newOffset > _currPanBounds.min[axis] ||
					newOffset < _currPanBounds.max[axis]
				) {
					panFriction = _options.panEndFriction;
				} else {
					panFriction = 1;
				}

				newOffset = _panOffset[axis] + delta[axis] * panFriction;

				if (
					_options.allowPanToNext ||
					_currZoomLevel === self.currItem.initialZoomLevel
				) {
					if (!_currZoomElementStyle) {
						newMainScrollPos = newMainScrollPosition;
					} else if (
						_direction === "h" &&
						axis === "x" &&
						!_zoomStarted
					) {
						if (dir) {
							if (newOffset > _currPanBounds.min[axis]) {
								panFriction = _options.panEndFriction;
								overDiff = _currPanBounds.min[axis] - newOffset;
								startOverDiff =
									_currPanBounds.min[axis] -
									_startPanOffset[axis];
							}

							if (
								(startOverDiff <= 0 || mainScrollDiff < 0) &&
								_getNumItems() > 1
							) {
								newMainScrollPos = newMainScrollPosition;

								if (
									mainScrollDiff < 0 &&
									newMainScrollPosition >
										_startMainScrollPos.x
								) {
									newMainScrollPos = _startMainScrollPos.x;
								}
							} else {
								if (
									_currPanBounds.min.x !==
									_currPanBounds.max.x
								) {
									newPanPos = newOffset;
								}
							}
						} else {
							if (newOffset < _currPanBounds.max[axis]) {
								panFriction = _options.panEndFriction;
								overDiff = newOffset - _currPanBounds.max[axis];
								startOverDiff =
									_startPanOffset[axis] -
									_currPanBounds.max[axis];
							}

							if (
								(startOverDiff <= 0 || mainScrollDiff > 0) &&
								_getNumItems() > 1
							) {
								newMainScrollPos = newMainScrollPosition;

								if (
									mainScrollDiff > 0 &&
									newMainScrollPosition <
										_startMainScrollPos.x
								) {
									newMainScrollPos = _startMainScrollPos.x;
								}
							} else {
								if (
									_currPanBounds.min.x !==
									_currPanBounds.max.x
								) {
									newPanPos = newOffset;
								}
							}
						}
					}

					if (axis === "x") {
						if (newMainScrollPos !== undefined) {
							_moveMainScroll(newMainScrollPos, true);

							if (newMainScrollPos === _startMainScrollPos.x) {
								_mainScrollShifted = false;
							} else {
								_mainScrollShifted = true;
							}
						}

						if (_currPanBounds.min.x !== _currPanBounds.max.x) {
							if (newPanPos !== undefined) {
								_panOffset.x = newPanPos;
							} else if (!_mainScrollShifted) {
								_panOffset.x += delta.x * panFriction;
							}
						}

						return newMainScrollPos !== undefined;
					}
				}

				if (!_mainScrollAnimating) {
					if (!_mainScrollShifted) {
						if (_currZoomLevel > self.currItem.fitRatio) {
							_panOffset[axis] += delta[axis] * panFriction;
						}
					}
				}
			},
			_onDragStart = function _onDragStart(e) {
				if (e.type === "mousedown" && e.button > 0) {
					return;
				}

				if (_initialZoomRunning) {
					e.preventDefault();
					return;
				}

				if (_oldAndroidTouchEndTimeout && e.type === "mousedown") {
					return;
				}

				if (_preventDefaultEventBehaviour(e, true)) {
					e.preventDefault();
				}

				_shout("PointerDown");

				if (_pointerEventEnabled) {
					var pointerIndex = framework.arraySearch(
						_currPointers,
						e.pointerId,
						"id"
					);

					if (pointerIndex < 0) {
						pointerIndex = _currPointers.length;
					}

					_currPointers[pointerIndex] = {
						x: e.pageX,
						y: e.pageY,
						id: e.pointerId
					};
				}

				var startPointsList = _getTouchPoints(e),
					numPoints = startPointsList.length;

				_currentPoints = null;

				_stopAllAnimations();

				if (!_isDragging || numPoints === 1) {
					_isDragging = _isFirstMove = true;
					framework.bind(window, _upMoveEvents, self);
					_isZoomingIn = _wasOverInitialZoom = _opacityChanged = _verticalDragInitiated = _mainScrollShifted = _moved = _isMultitouch = _zoomStarted = false;
					_direction = null;

					_shout("firstTouchStart", startPointsList);

					_equalizePoints(_startPanOffset, _panOffset);

					_currPanDist.x = _currPanDist.y = 0;

					_equalizePoints(_currPoint, startPointsList[0]);

					_equalizePoints(_startPoint, _currPoint);

					_startMainScrollPos.x = _slideSize.x * _currPositionIndex;
					_posPoints = [
						{
							x: _currPoint.x,
							y: _currPoint.y
						}
					];
					_gestureCheckSpeedTime = _gestureStartTime = _getCurrentTime();

					_calculatePanBounds(_currZoomLevel, true);

					_stopDragUpdateLoop();

					_dragUpdateLoop();
				}

				if (
					!_isZooming &&
					numPoints > 1 &&
					!_mainScrollAnimating &&
					!_mainScrollShifted
				) {
					_startZoomLevel = _currZoomLevel;
					_zoomStarted = false;
					_isZooming = _isMultitouch = true;
					_currPanDist.y = _currPanDist.x = 0;

					_equalizePoints(_startPanOffset, _panOffset);

					_equalizePoints(p, startPointsList[0]);

					_equalizePoints(p2, startPointsList[1]);

					_findCenterOfPoints(p, p2, _currCenterPoint);

					_midZoomPoint.x =
						Math.abs(_currCenterPoint.x) - _panOffset.x;
					_midZoomPoint.y =
						Math.abs(_currCenterPoint.y) - _panOffset.y;
					_currPointsDistance = _startPointsDistance = _calculatePointsDistance(
						p,
						p2
					);
				}
			},
			_onDragMove = function _onDragMove(e) {
				e.preventDefault();

				if (_pointerEventEnabled) {
					var pointerIndex = framework.arraySearch(
						_currPointers,
						e.pointerId,
						"id"
					);

					if (pointerIndex > -1) {
						var p = _currPointers[pointerIndex];
						p.x = e.pageX;
						p.y = e.pageY;
					}
				}

				if (_isDragging) {
					var touchesList = _getTouchPoints(e);

					if (!_direction && !_moved && !_isZooming) {
						if (
							_mainScrollPos.x !==
							_slideSize.x * _currPositionIndex
						) {
							_direction = "h";
						} else {
							var diff =
								Math.abs(touchesList[0].x - _currPoint.x) -
								Math.abs(touchesList[0].y - _currPoint.y);

							if (Math.abs(diff) >= DIRECTION_CHECK_OFFSET) {
								_direction = diff > 0 ? "h" : "v";
								_currentPoints = touchesList;
							}
						}
					} else {
						_currentPoints = touchesList;
					}
				}
			},
			_renderMovement = function _renderMovement() {
				if (!_currentPoints) {
					return;
				}

				var numPoints = _currentPoints.length;

				if (numPoints === 0) {
					return;
				}

				_equalizePoints(p, _currentPoints[0]);

				delta.x = p.x - _currPoint.x;
				delta.y = p.y - _currPoint.y;

				if (_isZooming && numPoints > 1) {
					_currPoint.x = p.x;
					_currPoint.y = p.y;

					if (
						!delta.x &&
						!delta.y &&
						_isEqualPoints(_currentPoints[1], p2)
					) {
						return;
					}

					_equalizePoints(p2, _currentPoints[1]);

					if (!_zoomStarted) {
						_zoomStarted = true;

						_shout("zoomGestureStarted");
					}

					var pointsDistance = _calculatePointsDistance(p, p2);

					var zoomLevel = _calculateZoomLevel(pointsDistance);

					if (
						zoomLevel >
						self.currItem.initialZoomLevel +
							self.currItem.initialZoomLevel / 15
					) {
						_wasOverInitialZoom = true;
					}

					var zoomFriction = 1,
						minZoomLevel = _getMinZoomLevel(),
						maxZoomLevel = _getMaxZoomLevel();

					if (zoomLevel < minZoomLevel) {
						if (
							_options.pinchToClose &&
							!_wasOverInitialZoom &&
							_startZoomLevel <= self.currItem.initialZoomLevel
						) {
							var minusDiff = minZoomLevel - zoomLevel;
							var percent = 1 - minusDiff / (minZoomLevel / 1.2);

							_applyBgOpacity(percent);

							_shout("onPinchClose", percent);

							_opacityChanged = true;
						} else {
							zoomFriction =
								(minZoomLevel - zoomLevel) / minZoomLevel;

							if (zoomFriction > 1) {
								zoomFriction = 1;
							}

							zoomLevel =
								minZoomLevel -
								zoomFriction * (minZoomLevel / 3);
						}
					} else if (zoomLevel > maxZoomLevel) {
						zoomFriction =
							(zoomLevel - maxZoomLevel) / (minZoomLevel * 6);

						if (zoomFriction > 1) {
							zoomFriction = 1;
						}

						zoomLevel = maxZoomLevel + zoomFriction * minZoomLevel;
					}

					if (zoomFriction < 0) {
						zoomFriction = 0;
					}

					_currPointsDistance = pointsDistance;

					_findCenterOfPoints(p, p2, _centerPoint);

					_currPanDist.x += _centerPoint.x - _currCenterPoint.x;
					_currPanDist.y += _centerPoint.y - _currCenterPoint.y;

					_equalizePoints(_currCenterPoint, _centerPoint);

					_panOffset.x = _calculatePanOffset("x", zoomLevel);
					_panOffset.y = _calculatePanOffset("y", zoomLevel);
					_isZoomingIn = zoomLevel > _currZoomLevel;
					_currZoomLevel = zoomLevel;

					_applyCurrentZoomPan();
				} else {
					if (!_direction) {
						return;
					}

					if (_isFirstMove) {
						_isFirstMove = false;

						if (Math.abs(delta.x) >= DIRECTION_CHECK_OFFSET) {
							delta.x -= _currentPoints[0].x - _startPoint.x;
						}

						if (Math.abs(delta.y) >= DIRECTION_CHECK_OFFSET) {
							delta.y -= _currentPoints[0].y - _startPoint.y;
						}
					}

					_currPoint.x = p.x;
					_currPoint.y = p.y;

					if (delta.x === 0 && delta.y === 0) {
						return;
					}

					if (_direction === "v" && _options.closeOnVerticalDrag) {
						if (!_canPan()) {
							_currPanDist.y += delta.y;
							_panOffset.y += delta.y;

							var opacityRatio = _calculateVerticalDragOpacityRatio();

							_verticalDragInitiated = true;

							_shout("onVerticalDrag", opacityRatio);

							_applyBgOpacity(opacityRatio);

							_applyCurrentZoomPan();

							return;
						}
					}

					_pushPosPoint(_getCurrentTime(), p.x, p.y);

					_moved = true;
					_currPanBounds = self.currItem.bounds;

					var mainScrollChanged = _panOrMoveMainScroll("x", delta);

					if (!mainScrollChanged) {
						_panOrMoveMainScroll("y", delta);

						_roundPoint(_panOffset);

						_applyCurrentZoomPan();
					}
				}
			},
			_onDragRelease = function _onDragRelease(e) {
				if (_features.isOldAndroid) {
					if (_oldAndroidTouchEndTimeout && e.type === "mouseup") {
						return;
					}

					if (e.type.indexOf("touch") > -1) {
						clearTimeout(_oldAndroidTouchEndTimeout);
						_oldAndroidTouchEndTimeout = setTimeout(function () {
							_oldAndroidTouchEndTimeout = 0;
						}, 600);
					}
				}

				_shout("PointerUp");

				if (_preventDefaultEventBehaviour(e, false)) {
					e.preventDefault();
				}

				var releasePoint;

				if (_pointerEventEnabled) {
					var pointerIndex = framework.arraySearch(
						_currPointers,
						e.pointerId,
						"id"
					);

					if (pointerIndex > -1) {
						releasePoint = _currPointers.splice(pointerIndex, 1)[0];

						if (navigator.pointerEnabled) {
							releasePoint.type = e.pointerType || "mouse";
						} else {
							var MSPOINTER_TYPES = {
								4: "mouse",
								2: "touch",
								3: "pen"
							};
							releasePoint.type = MSPOINTER_TYPES[e.pointerType];

							if (!releasePoint.type) {
								releasePoint.type = e.pointerType || "mouse";
							}
						}
					}
				}

				var touchList = _getTouchPoints(e),
					gestureType,
					numPoints = touchList.length;

				if (e.type === "mouseup") {
					numPoints = 0;
				}

				if (numPoints === 2) {
					_currentPoints = null;
					return true;
				}

				if (numPoints === 1) {
					_equalizePoints(_startPoint, touchList[0]);
				}

				if (numPoints === 0 && !_direction && !_mainScrollAnimating) {
					if (!releasePoint) {
						if (e.type === "mouseup") {
							releasePoint = {
								x: e.pageX,
								y: e.pageY,
								type: "mouse"
							};
						} else if (e.changedTouches && e.changedTouches[0]) {
							releasePoint = {
								x: e.changedTouches[0].pageX,
								y: e.changedTouches[0].pageY,
								type: "touch"
							};
						}
					}

					_shout("touchRelease", e, releasePoint);
				}

				var releaseTimeDiff = -1;

				if (numPoints === 0) {
					_isDragging = false;
					framework.unbind(window, _upMoveEvents, self);

					_stopDragUpdateLoop();

					if (_isZooming) {
						releaseTimeDiff = 0;
					} else if (_lastReleaseTime !== -1) {
						releaseTimeDiff = _getCurrentTime() - _lastReleaseTime;
					}
				}

				_lastReleaseTime = numPoints === 1 ? _getCurrentTime() : -1;

				if (releaseTimeDiff !== -1 && releaseTimeDiff < 150) {
					gestureType = "zoom";
				} else {
					gestureType = "swipe";
				}

				if (_isZooming && numPoints < 2) {
					_isZooming = false;

					if (numPoints === 1) {
						gestureType = "zoomPointerUp";
					}

					_shout("zoomGestureEnded");
				}

				_currentPoints = null;

				if (
					!_moved &&
					!_zoomStarted &&
					!_mainScrollAnimating &&
					!_verticalDragInitiated
				) {
					return;
				}

				_stopAllAnimations();

				if (!_releaseAnimData) {
					_releaseAnimData = _initDragReleaseAnimationData();
				}

				_releaseAnimData.calculateSwipeSpeed("x");

				if (_verticalDragInitiated) {
					var opacityRatio = _calculateVerticalDragOpacityRatio();

					if (opacityRatio < _options.verticalDragRange) {
						self.close();
					} else {
						var initalPanY = _panOffset.y,
							initialBgOpacity = _bgOpacity;

						_animateProp(
							"verticalDrag",
							0,
							1,
							300,
							framework.easing.cubic.out,
							function(now) {
								_panOffset.y =
									(self.currItem.initialPosition.y -
										initalPanY) *
										now +
									initalPanY;

								_applyBgOpacity(
									(1 - initialBgOpacity) * now +
										initialBgOpacity
								);

								_applyCurrentZoomPan();
							}
						);

						_shout("onVerticalDrag", 1);
					}

					return;
				}

				if (
					(_mainScrollShifted || _mainScrollAnimating) &&
					numPoints === 0
				) {
					var itemChanged = _finishSwipeMainScrollGesture(
						gestureType,
						_releaseAnimData
					);

					if (itemChanged) {
						return;
					}

					gestureType = "zoomPointerUp";
				}

				if (_mainScrollAnimating) {
					return;
				}

				if (gestureType !== "swipe") {
					_completeZoomGesture();

					return;
				}

				if (
					!_mainScrollShifted &&
					_currZoomLevel > self.currItem.fitRatio
				) {
					_completePanGesture(_releaseAnimData);
				}
			},
			_initDragReleaseAnimationData = function _initDragReleaseAnimationData() {
				var lastFlickDuration, tempReleasePos;
				var s = {
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
					calculateSwipeSpeed: function calculateSwipeSpeed(axis) {
						if (_posPoints.length > 1) {
							lastFlickDuration =
								_getCurrentTime() - _gestureCheckSpeedTime + 50;
							tempReleasePos =
								_posPoints[_posPoints.length - 2][axis];
						} else {
							lastFlickDuration =
								_getCurrentTime() - _gestureStartTime;
							tempReleasePos = _startPoint[axis];
						}

						s.lastFlickOffset[axis] =
							_currPoint[axis] - tempReleasePos;
						s.lastFlickDist[axis] = Math.abs(
							s.lastFlickOffset[axis]
						);

						if (s.lastFlickDist[axis] > 20) {
							s.lastFlickSpeed[axis] =
								s.lastFlickOffset[axis] / lastFlickDuration;
						} else {
							s.lastFlickSpeed[axis] = 0;
						}

						if (Math.abs(s.lastFlickSpeed[axis]) < 0.1) {
							s.lastFlickSpeed[axis] = 0;
						}

						s.slowDownRatio[axis] = 0.95;
						s.slowDownRatioReverse[axis] =
							1 - s.slowDownRatio[axis];
						s.speedDecelerationRatio[axis] = 1;
					},
					calculateOverBoundsAnimOffset: function calculateOverBoundsAnimOffset(
						axis,
						speed
					) {
						if (!s.backAnimStarted[axis]) {
							if (_panOffset[axis] > _currPanBounds.min[axis]) {
								s.backAnimDestination[axis] =
									_currPanBounds.min[axis];
							} else if (
								_panOffset[axis] < _currPanBounds.max[axis]
							) {
								s.backAnimDestination[axis] =
									_currPanBounds.max[axis];
							}

							if (s.backAnimDestination[axis] !== undefined) {
								s.slowDownRatio[axis] = 0.7;
								s.slowDownRatioReverse[axis] =
									1 - s.slowDownRatio[axis];

								if (s.speedDecelerationRatioAbs[axis] < 0.05) {
									s.lastFlickSpeed[axis] = 0;
									s.backAnimStarted[axis] = true;

									_animateProp(
										"bounceZoomPan" + axis,
										_panOffset[axis],
										s.backAnimDestination[axis],
										speed || 300,
										framework.easing.sine.out,
										function(pos) {
											_panOffset[axis] = pos;

											_applyCurrentZoomPan();
										}
									);
								}
							}
						}
					},
					calculateAnimOffset: function calculateAnimOffset(axis) {
						if (!s.backAnimStarted[axis]) {
							s.speedDecelerationRatio[axis] =
								s.speedDecelerationRatio[axis] *
								(s.slowDownRatio[axis] +
									s.slowDownRatioReverse[axis] -
									(s.slowDownRatioReverse[axis] *
										s.timeDiff) /
										10);
							s.speedDecelerationRatioAbs[axis] = Math.abs(
								s.lastFlickSpeed[axis] *
									s.speedDecelerationRatio[axis]
							);
							s.distanceOffset[axis] =
								s.lastFlickSpeed[axis] *
								s.speedDecelerationRatio[axis] *
								s.timeDiff;
							_panOffset[axis] += s.distanceOffset[axis];
						}
					},
					panAnimLoop: function panAnimLoop() {
						if (_animations.zoomPan) {
							_animations.zoomPan.raf = _requestAF(s.panAnimLoop);
							s.now = _getCurrentTime();
							s.timeDiff = s.now - s.lastNow;
							s.lastNow = s.now;
							s.calculateAnimOffset("x");
							s.calculateAnimOffset("y");

							_applyCurrentZoomPan();

							s.calculateOverBoundsAnimOffset("x");
							s.calculateOverBoundsAnimOffset("y");

							if (
								s.speedDecelerationRatioAbs.x < 0.05 &&
								s.speedDecelerationRatioAbs.y < 0.05
							) {
								_panOffset.x = Math.round(_panOffset.x);
								_panOffset.y = Math.round(_panOffset.y);

								_applyCurrentZoomPan();

								_stopAnimation("zoomPan");

								return;
							}
						}
					}
				};
				return s;
			},
			_completePanGesture = function _completePanGesture(animData) {
				animData.calculateSwipeSpeed("y");
				_currPanBounds = self.currItem.bounds;
				animData.backAnimDestination = {};
				animData.backAnimStarted = {};

				if (
					Math.abs(animData.lastFlickSpeed.x) <= 0.05 &&
					Math.abs(animData.lastFlickSpeed.y) <= 0.05
				) {
					animData.speedDecelerationRatioAbs.x = animData.speedDecelerationRatioAbs.y = 0;
					animData.calculateOverBoundsAnimOffset("x");
					animData.calculateOverBoundsAnimOffset("y");
					return true;
				}

				_registerStartAnimation("zoomPan");

				animData.lastNow = _getCurrentTime();
				animData.panAnimLoop();
			},
			_finishSwipeMainScrollGesture = function _finishSwipeMainScrollGesture(
				gestureType,
				_releaseAnimData
			) {
				var itemChanged;

				if (!_mainScrollAnimating) {
					_currZoomedItemIndex = _currentItemIndex;
				}

				var itemsDiff;

				if (gestureType === "swipe") {
					var totalShiftDist = _currPoint.x - _startPoint.x,
						isFastLastFlick = _releaseAnimData.lastFlickDist.x < 10;

					if (
						totalShiftDist > MIN_SWIPE_DISTANCE &&
						(isFastLastFlick ||
							_releaseAnimData.lastFlickOffset.x > 20)
					) {
						itemsDiff = -1;
					} else if (
						totalShiftDist < -MIN_SWIPE_DISTANCE &&
						(isFastLastFlick ||
							_releaseAnimData.lastFlickOffset.x < -20)
					) {
						itemsDiff = 1;
					}
				}

				var nextCircle;

				if (itemsDiff) {
					_currentItemIndex += itemsDiff;

					if (_currentItemIndex < 0) {
						_currentItemIndex = _options.loop
							? _getNumItems() - 1
							: 0;
						nextCircle = true;
					} else if (_currentItemIndex >= _getNumItems()) {
						_currentItemIndex = _options.loop
							? 0
							: _getNumItems() - 1;
						nextCircle = true;
					}

					if (!nextCircle || _options.loop) {
						_indexDiff += itemsDiff;
						_currPositionIndex -= itemsDiff;
						itemChanged = true;
					}
				}

				var animateToX = _slideSize.x * _currPositionIndex;
				var animateToDist = Math.abs(animateToX - _mainScrollPos.x);
				var finishAnimDuration;

				if (
					!itemChanged &&
					animateToX > _mainScrollPos.x !==
						_releaseAnimData.lastFlickSpeed.x > 0
				) {
					finishAnimDuration = 333;
				} else {
					finishAnimDuration =
						Math.abs(_releaseAnimData.lastFlickSpeed.x) > 0
							? animateToDist /
							  Math.abs(_releaseAnimData.lastFlickSpeed.x)
							: 333;
					finishAnimDuration = Math.min(finishAnimDuration, 400);
					finishAnimDuration = Math.max(finishAnimDuration, 250);
				}

				if (_currZoomedItemIndex === _currentItemIndex) {
					itemChanged = false;
				}

				_mainScrollAnimating = true;

				_shout("mainScrollAnimStart");

				_animateProp(
					"mainScroll",
					_mainScrollPos.x,
					animateToX,
					finishAnimDuration,
					framework.easing.cubic.out,
					_moveMainScroll,
					function() {
						_stopAllAnimations();

						_mainScrollAnimating = false;
						_currZoomedItemIndex = -1;

						if (
							itemChanged ||
							_currZoomedItemIndex !== _currentItemIndex
						) {
							self.updateCurrItem();
						}

						_shout("mainScrollAnimComplete");
					}
				);

				if (itemChanged) {
					self.updateCurrItem(true);
				}

				return itemChanged;
			},
			_calculateZoomLevel = function _calculateZoomLevel(
				touchesDistance
			) {
				return (
					(1 / _startPointsDistance) *
					touchesDistance *
					_startZoomLevel
				);
			},
			_completeZoomGesture = function _completeZoomGesture() {
				var destZoomLevel = _currZoomLevel,
					minZoomLevel = _getMinZoomLevel(),
					maxZoomLevel = _getMaxZoomLevel();

				if (_currZoomLevel < minZoomLevel) {
					destZoomLevel = minZoomLevel;
				} else if (_currZoomLevel > maxZoomLevel) {
					destZoomLevel = maxZoomLevel;
				}

				var destOpacity = 1,
					onUpdate,
					initialOpacity = _bgOpacity;

				if (
					_opacityChanged &&
					!_isZoomingIn &&
					!_wasOverInitialZoom &&
					_currZoomLevel < minZoomLevel
				) {
					self.close();
					return true;
				}

				if (_opacityChanged) {
					onUpdate = function onUpdate(now) {
						_applyBgOpacity(
							(destOpacity - initialOpacity) * now +
								initialOpacity
						);
					};
				}

				self.zoomTo(
					destZoomLevel,
					0,
					200,
					framework.easing.cubic.out,
					onUpdate
				);
				return true;
			};

		_registerModule("Gestures", {
			publicMethods: {
				initGestures: function initGestures() {
					var addEventNames = function addEventNames(
						pref,
						down,
						move,
						up,
						cancel
					) {
						_dragStartEvent = pref + down;
						_dragMoveEvent = pref + move;
						_dragEndEvent = pref + up;

						if (cancel) {
							_dragCancelEvent = pref + cancel;
						} else {
							_dragCancelEvent = "";
						}
					};

					_pointerEventEnabled = _features.pointerEvent;

					if (_pointerEventEnabled && _features.touch) {
						_features.touch = false;
					}

					if (_pointerEventEnabled) {
						if (navigator.pointerEnabled) {
							addEventNames(
								"pointer",
								"down",
								"move",
								"up",
								"cancel"
							);
						} else {
							addEventNames(
								"MSPointer",
								"Down",
								"Move",
								"Up",
								"Cancel"
							);
						}
					} else if (_features.touch) {
						addEventNames(
							"touch",
							"start",
							"move",
							"end",
							"cancel"
						);
						_likelyTouchDevice = true;
					} else {
						addEventNames("mouse", "down", "move", "up");
					}

					_upMoveEvents =
						_dragMoveEvent +
						" " +
						_dragEndEvent +
						" " +
						_dragCancelEvent;
					_downEvents = _dragStartEvent;

					if (_pointerEventEnabled && !_likelyTouchDevice) {
						_likelyTouchDevice =
							navigator.maxTouchPoints > 1 ||
							navigator.msMaxTouchPoints > 1;
					}

					self.likelyTouchDevice = _likelyTouchDevice;
					_globalEventHandlers[_dragStartEvent] = _onDragStart;
					_globalEventHandlers[_dragMoveEvent] = _onDragMove;
					_globalEventHandlers[_dragEndEvent] = _onDragRelease;

					if (_dragCancelEvent) {
						_globalEventHandlers[_dragCancelEvent] =
							_globalEventHandlers[_dragEndEvent];
					}

					if (_features.touch) {
						_downEvents += " mousedown";
						_upMoveEvents += " mousemove mouseup";
						_globalEventHandlers.mousedown =
							_globalEventHandlers[_dragStartEvent];
						_globalEventHandlers.mousemove =
							_globalEventHandlers[_dragMoveEvent];
						_globalEventHandlers.mouseup =
							_globalEventHandlers[_dragEndEvent];
					}

					if (!_likelyTouchDevice) {
						_options.allowPanToNext = false;
					}
				}
			}
		});

		var _showOrHideTimeout,
			_showOrHide = function _showOrHide(item, img, out, completeFn) {
				if (_showOrHideTimeout) {
					clearTimeout(_showOrHideTimeout);
				}

				_initialZoomRunning = true;
				_initialContentSet = true;
				var thumbBounds;

				if (item.initialLayout) {
					thumbBounds = item.initialLayout;
					item.initialLayout = null;
				} else {
					thumbBounds =
						_options.getThumbBoundsFn &&
						_options.getThumbBoundsFn(_currentItemIndex);
				}

				var duration = out
					? _options.hideAnimationDuration
					: _options.showAnimationDuration;

				var onComplete = function onComplete() {
					_stopAnimation("initialZoom");

					if (!out) {
						_applyBgOpacity(1);

						if (img) {
							img.style.display = "block";
						}

						framework.addClass(template, "pswp--animated-in");

						_shout("initialZoom" + (out ? "OutEnd" : "InEnd"));
					} else {
						self.template.removeAttribute("style");
						self.bg.removeAttribute("style");
					}

					if (completeFn) {
						completeFn();
					}

					_initialZoomRunning = false;
				};

				if (!duration || !thumbBounds || thumbBounds.x === undefined) {
					_shout("initialZoom" + (out ? "Out" : "In"));

					_currZoomLevel = item.initialZoomLevel;

					_equalizePoints(_panOffset, item.initialPosition);

					_applyCurrentZoomPan();

					template.style.opacity = out ? 0 : 1;

					_applyBgOpacity(1);

					if (duration) {
						setTimeout(function () {
							onComplete();
						}, duration);
					} else {
						onComplete();
					}

					return;
				}

				var startAnimation = function startAnimation() {
					var closeWithRaf = _closedByScroll,
						fadeEverything =
							!self.currItem.src ||
							self.currItem.loadError ||
							_options.showHideOpacity;

					if (item.miniImg) {
						item.miniImg.style.webkitBackfaceVisibility = "hidden";
					}

					if (!out) {
						_currZoomLevel = thumbBounds.w / item.w;
						_panOffset.x = thumbBounds.x;
						_panOffset.y = thumbBounds.y - _initalWindowScrollY;
						self[
							fadeEverything ? "template" : "bg"
						].style.opacity = 0.001;

						_applyCurrentZoomPan();
					}

					_registerStartAnimation("initialZoom");

					if (out && !closeWithRaf) {
						framework.removeClass(template, "pswp--animated-in");
					}

					if (fadeEverything) {
						if (out) {
							framework[
								(closeWithRaf ? "remove" : "add") + "Class"
							](template, "pswp--animate_opacity");
						} else {
							setTimeout(function () {
								framework.addClass(
									template,
									"pswp--animate_opacity"
								);
							}, 30);
						}
					}

					_showOrHideTimeout = setTimeout(
						function() {
							_shout("initialZoom" + (out ? "Out" : "In"));

							if (!out) {
								_currZoomLevel = item.initialZoomLevel;

								_equalizePoints(
									_panOffset,
									item.initialPosition
								);

								_applyCurrentZoomPan();

								_applyBgOpacity(1);

								if (fadeEverything) {
									template.style.opacity = 1;
								} else {
									_applyBgOpacity(1);
								}

								_showOrHideTimeout = setTimeout(
									onComplete,
									duration + 20
								);
							} else {
								var destZoomLevel = thumbBounds.w / item.w,
									initialPanOffset = {
										x: _panOffset.x,
										y: _panOffset.y
									},
									initialZoomLevel = _currZoomLevel,
									initalBgOpacity = _bgOpacity,
									onUpdate = function onUpdate(now) {
										if (now === 1) {
											_currZoomLevel = destZoomLevel;
											_panOffset.x = thumbBounds.x;
											_panOffset.y =
												thumbBounds.y -
												_currentWindowScrollY;
										} else {
											_currZoomLevel =
												(destZoomLevel -
													initialZoomLevel) *
													now +
												initialZoomLevel;
											_panOffset.x =
												(thumbBounds.x -
													initialPanOffset.x) *
													now +
												initialPanOffset.x;
											_panOffset.y =
												(thumbBounds.y -
													_currentWindowScrollY -
													initialPanOffset.y) *
													now +
												initialPanOffset.y;
										}

										_applyCurrentZoomPan();

										if (fadeEverything) {
											template.style.opacity = 1 - now;
										} else {
											_applyBgOpacity(
												initalBgOpacity -
													now * initalBgOpacity
											);
										}
									};

								if (closeWithRaf) {
									_animateProp(
										"initialZoom",
										0,
										1,
										duration,
										framework.easing.cubic.out,
										onUpdate,
										onComplete
									);
								} else {
									onUpdate(1);
									_showOrHideTimeout = setTimeout(
										onComplete,
										duration + 20
									);
								}
							}
						},
						out ? 25 : 90
					);
				};

				startAnimation();
			};

		var _items,
			_tempPanAreaSize = {},
			_imagesToAppendPool = [],
			_initialContentSet,
			_initialZoomRunning,
			_controllerDefaultOptions = {
				index: 0,
				errorMsg:
					'<div class="pswp__error-msg"><a href="%url%" target="_blank">The image</a> could not be loaded.</div>',
				forceProgressiveLoading: false,
				preload: [1, 1],
				getNumItemsFn: function getNumItemsFn() {
					return _items.length;
				}
			};

		var _getItemAt,
			_getNumItems,
			_initialIsLoop,
			_getZeroBounds = function _getZeroBounds() {
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
			_calculateSingleItemPanBounds = function _calculateSingleItemPanBounds(
				item,
				realPanElementW,
				realPanElementH
			) {
				var bounds = item.bounds;
				bounds.center.x = Math.round(
					(_tempPanAreaSize.x - realPanElementW) / 2
				);
				bounds.center.y =
					Math.round((_tempPanAreaSize.y - realPanElementH) / 2) +
					item.vGap.top;
				bounds.max.x =
					realPanElementW > _tempPanAreaSize.x
						? Math.round(_tempPanAreaSize.x - realPanElementW)
						: bounds.center.x;
				bounds.max.y =
					realPanElementH > _tempPanAreaSize.y
						? Math.round(_tempPanAreaSize.y - realPanElementH) +
						  item.vGap.top
						: bounds.center.y;
				bounds.min.x =
					realPanElementW > _tempPanAreaSize.x ? 0 : bounds.center.x;
				bounds.min.y =
					realPanElementH > _tempPanAreaSize.y
						? item.vGap.top
						: bounds.center.y;
			},
			_calculateItemSize = function _calculateItemSize(
				item,
				viewportSize,
				zoomLevel
			) {
				if (item.src && !item.loadError) {
					var isInitial = !zoomLevel;

					if (isInitial) {
						if (!item.vGap) {
							item.vGap = {
								top: 0,
								bottom: 0
							};
						}

						_shout("parseVerticalMargin", item);
					}

					_tempPanAreaSize.x = viewportSize.x;
					_tempPanAreaSize.y =
						viewportSize.y - item.vGap.top - item.vGap.bottom;

					if (isInitial) {
						var hRatio = _tempPanAreaSize.x / item.w;
						var vRatio = _tempPanAreaSize.y / item.h;
						item.fitRatio = hRatio < vRatio ? hRatio : vRatio;
						var scaleMode = _options.scaleMode;

						if (scaleMode === "orig") {
							zoomLevel = 1;
						} else if (scaleMode === "fit") {
							zoomLevel = item.fitRatio;
						}

						if (zoomLevel > 1) {
							zoomLevel = 1;
						}

						item.initialZoomLevel = zoomLevel;

						if (!item.bounds) {
							item.bounds = _getZeroBounds();
						}
					}

					if (!zoomLevel) {
						return;
					}

					_calculateSingleItemPanBounds(
						item,
						item.w * zoomLevel,
						item.h * zoomLevel
					);

					if (isInitial && zoomLevel === item.initialZoomLevel) {
						item.initialPosition = item.bounds.center;
					}

					return item.bounds;
				} else {
					item.w = item.h = 0;
					item.initialZoomLevel = item.fitRatio = 1;
					item.bounds = _getZeroBounds();
					item.initialPosition = item.bounds.center;
					return item.bounds;
				}
			},
			_appendImage = function _appendImage(
				index,
				item,
				baseDiv,
				img,
				preventAnimation,
				keepPlaceholder
			) {
				if (item.loadError) {
					return;
				}

				if (img) {
					item.imageAppended = true;

					_setImageSize(
						item,
						img,
						item === self.currItem && _renderMaxResolution
					);

					baseDiv.appendChild(img);

					if (keepPlaceholder) {
						setTimeout(function () {
							if (item && item.loaded && item.placeholder) {
								item.placeholder.style.display = "none";
								item.placeholder = null;
							}
						}, 500);
					}
				}
			},
			_preloadImage = function _preloadImage(item) {
				item.loading = true;
				item.loaded = false;
				var img = (item.img = framework.createEl("pswp__img", "img"));

				var onComplete = function onComplete() {
					item.loading = false;
					item.loaded = true;

					if (item.loadComplete) {
						item.loadComplete(item);
					} else {
						item.img = null;
					}

					img.onload = img.onerror = null;
					img = null;
				};

				img.onload = onComplete;

				img.onerror = function () {
					item.loadError = true;
					onComplete();
				};

				img.src = item.src;
				return img;
			},
			_checkForError = function _checkForError(item, cleanUp) {
				if (item.src && item.loadError && item.container) {
					if (cleanUp) {
						item.container.innerHTML = "";
					}

					item.container.innerHTML = _options.errorMsg.replace(
						"%url%",
						item.src
					);
					return true;
				}
			},
			_setImageSize = function _setImageSize(item, img, maxRes) {
				if (!item.src) {
					return;
				}

				if (!img) {
					img = item.container.lastChild;
				}

				var w = maxRes ? item.w : Math.round(item.w * item.fitRatio),
					h = maxRes ? item.h : Math.round(item.h * item.fitRatio);

				if (item.placeholder && !item.loaded) {
					item.placeholder.style.width = w + "px";
					item.placeholder.style.height = h + "px";
				}

				img.style.width = w + "px";
				img.style.height = h + "px";
			},
			_appendImagesPool = function _appendImagesPool() {
				if (_imagesToAppendPool.length) {
					var poolItem;

					for (var i = 0; i < _imagesToAppendPool.length; i++) {
						poolItem = _imagesToAppendPool[i];

						if (poolItem.holder.index === poolItem.index) {
							_appendImage(
								poolItem.index,
								poolItem.item,
								poolItem.baseDiv,
								poolItem.img,
								false,
								poolItem.clearPlaceholder
							);
						}
					}

					_imagesToAppendPool = [];
				}
			};

		_registerModule("Controller", {
			publicMethods: {
				lazyLoadItem: function lazyLoadItem(index) {
					index = _getLoopedId(index);

					var item = _getItemAt(index);

					if (
						!item ||
						((item.loaded || item.loading) && !_itemsNeedUpdate)
					) {
						return;
					}

					_shout("gettingData", index, item);

					if (!item.src) {
						return;
					}

					_preloadImage(item);
				},
				initController: function initController() {
					framework.extend(_options, _controllerDefaultOptions, true);
					self.items = _items = items;
					_getItemAt = self.getItemAt;
					_getNumItems = _options.getNumItemsFn;
					_initialIsLoop = _options.loop;

					if (_getNumItems() < 3) {
						_options.loop = false;
					}

					_listen("beforeChange", function(diff) {
						var p = _options.preload,
							isNext = diff === null ? true : diff >= 0,
							preloadBefore = Math.min(p[0], _getNumItems()),
							preloadAfter = Math.min(p[1], _getNumItems()),
							i;

						for (
							i = 1;
							i <= (isNext ? preloadAfter : preloadBefore);
							i++
						) {
							self.lazyLoadItem(_currentItemIndex + i);
						}

						for (
							i = 1;
							i <= (isNext ? preloadBefore : preloadAfter);
							i++
						) {
							self.lazyLoadItem(_currentItemIndex - i);
						}
					});

					_listen("initialLayout", function () {
						self.currItem.initialLayout =
							_options.getThumbBoundsFn &&
							_options.getThumbBoundsFn(_currentItemIndex);
					});

					_listen("mainScrollAnimComplete", _appendImagesPool);

					_listen("initialZoomInEnd", _appendImagesPool);

					_listen("destroy", function () {
						var item;

						for (var i = 0; i < _items.length; i++) {
							item = _items[i];

							if (item.container) {
								item.container = null;
							}

							if (item.placeholder) {
								item.placeholder = null;
							}

							if (item.img) {
								item.img = null;
							}

							if (item.preloader) {
								item.preloader = null;
							}

							if (item.loadError) {
								item.loaded = item.loadError = false;
							}
						}

						_imagesToAppendPool = null;
					});
				},
				getItemAt: function getItemAt(index) {
					if (index >= 0) {
						return _items[index] !== undefined
							? _items[index]
							: false;
					}

					return false;
				},
				allowProgressiveImg: function allowProgressiveImg() {
					return (
						_options.forceProgressiveLoading ||
						!_likelyTouchDevice ||
						_options.mouseUsed ||
						screen.width > 1200
					);
				},
				setContent: function setContent(holder, index) {
					if (_options.loop) {
						index = _getLoopedId(index);
					}

					var prevItem = self.getItemAt(holder.index);

					if (prevItem) {
						prevItem.container = null;
					}

					var item = self.getItemAt(index),
						img;

					if (!item) {
						holder.el.innerHTML = "";
						return;
					}

					_shout("gettingData", index, item);

					holder.index = index;
					holder.item = item;
					var baseDiv = (item.container = framework.createEl(
						"pswp__zoom-wrap"
					));

					if (!item.src && item.html) {
						if (item.html.tagName) {
							baseDiv.appendChild(item.html);
						} else {
							baseDiv.innerHTML = item.html;
						}
					}

					_checkForError(item);

					_calculateItemSize(item, _viewportSize);

					if (item.src && !item.loadError && !item.loaded) {
						item.loadComplete = function (item) {
							if (!_isOpen) {
								return;
							}

							if (holder && holder.index === index) {
								if (_checkForError(item, true)) {
									item.loadComplete = item.img = null;

									_calculateItemSize(item, _viewportSize);

									_applyZoomPanToItem(item);

									if (holder.index === _currentItemIndex) {
										self.updateCurrZoomItem();
									}

									return;
								}

								if (!item.imageAppended) {
									if (
										_features.transform &&
										(_mainScrollAnimating ||
											_initialZoomRunning)
									) {
										_imagesToAppendPool.push({
											item: item,
											baseDiv: baseDiv,
											img: item.img,
											index: index,
											holder: holder,
											clearPlaceholder: true
										});
									} else {
										_appendImage(
											index,
											item,
											baseDiv,
											item.img,
											_mainScrollAnimating ||
												_initialZoomRunning,
											true
										);
									}
								} else {
									if (
										!_initialZoomRunning &&
										item.placeholder
									) {
										item.placeholder.style.display = "none";
										item.placeholder = null;
									}
								}
							}

							item.loadComplete = null;
							item.img = null;

							_shout("imageLoadComplete", index, item);
						};

						if (framework.features.transform) {
							var placeholderClassName =
								"pswp__img pswp__img--placeholder";
							placeholderClassName += item.msrc
								? ""
								: " pswp__img--placeholder--blank";
							var placeholder = framework.createEl(
								placeholderClassName,
								item.msrc ? "img" : ""
							);

							if (item.msrc) {
								placeholder.src = item.msrc;
							}

							_setImageSize(item, placeholder);

							baseDiv.appendChild(placeholder);
							item.placeholder = placeholder;
						}

						if (!item.loading) {
							_preloadImage(item);
						}

						if (self.allowProgressiveImg()) {
							if (!_initialContentSet && _features.transform) {
								_imagesToAppendPool.push({
									item: item,
									baseDiv: baseDiv,
									img: item.img,
									index: index,
									holder: holder
								});
							} else {
								_appendImage(
									index,
									item,
									baseDiv,
									item.img,
									true,
									true
								);
							}
						}
					} else if (item.src && !item.loadError) {
						img = framework.createEl("pswp__img", "img");
						img.style.opacity = 1;
						img.src = item.src;

						_setImageSize(item, img);

						_appendImage(index, item, baseDiv, img, true);
					}

					if (!_initialContentSet && index === _currentItemIndex) {
						_currZoomElementStyle = baseDiv.style;

						_showOrHide(item, img || item.img);
					} else {
						_applyZoomPanToItem(item);
					}

					holder.el.innerHTML = "";
					holder.el.appendChild(baseDiv);
				},
				cleanSlide: function cleanSlide(item) {
					if (item.img) {
						item.img.onload = item.img.onerror = null;
					}

					item.loaded = item.loading = item.img = item.imageAppended = false;
				}
			}
		});

		var tapTimer,
			tapReleasePoint = {},
			_dispatchTapEvent = function _dispatchTapEvent(
				origEvent,
				releasePoint,
				pointerType
			) {
				var e = document.createEvent("CustomEvent"),
					eDetail = {
						origEvent: origEvent,
						target: origEvent.target,
						releasePoint: releasePoint,
						pointerType: pointerType || "touch"
					};
				e.initCustomEvent("pswpTap", true, true, eDetail);
				origEvent.target.dispatchEvent(e);
			};

		_registerModule("Tap", {
			publicMethods: {
				initTap: function initTap() {
					_listen("firstTouchStart", self.onTapStart);

					_listen("touchRelease", self.onTapRelease);

					_listen("destroy", function () {
						tapReleasePoint = {};
						tapTimer = null;
					});
				},
				onTapStart: function onTapStart(touchList) {
					if (touchList.length > 1) {
						clearTimeout(tapTimer);
						tapTimer = null;
					}
				},
				onTapRelease: function onTapRelease(e, releasePoint) {
					if (!releasePoint) {
						return;
					}

					if (!_moved && !_isMultitouch && !_numAnimations) {
						var p0 = releasePoint;

						if (tapTimer) {
							clearTimeout(tapTimer);
							tapTimer = null;

							if (_isNearbyPoints(p0, tapReleasePoint)) {
								_shout("doubleTap", p0);

								return;
							}
						}

						if (releasePoint.type === "mouse") {
							_dispatchTapEvent(e, releasePoint, "mouse");

							return;
						}

						var clickedTagName = e.target.tagName.toUpperCase();

						if (
							clickedTagName === "BUTTON" ||
							framework.hasClass(e.target, "pswp__single-tap")
						) {
							_dispatchTapEvent(e, releasePoint);

							return;
						}

						_equalizePoints(tapReleasePoint, p0);

						tapTimer = setTimeout(function () {
							_dispatchTapEvent(e, releasePoint);

							tapTimer = null;
						}, 300);
					}
				}
			}
		});

		var _wheelDelta;

		_registerModule("DesktopZoom", {
			publicMethods: {
				initDesktopZoom: function initDesktopZoom() {
					if (_oldIE) {
						return;
					}

					if (_likelyTouchDevice) {
						_listen("mouseUsed", function () {
							self.setupDesktopZoom();
						});
					} else {
						self.setupDesktopZoom(true);
					}
				},
				setupDesktopZoom: function setupDesktopZoom(onInit) {
					_wheelDelta = {};
					var events = "wheel mousewheel DOMMouseScroll";

					_listen("bindEvents", function () {
						framework.bind(template, events, self.handleMouseWheel);
					});

					_listen("unbindEvents", function () {
						if (_wheelDelta) {
							framework.unbind(
								template,
								events,
								self.handleMouseWheel
							);
						}
					});

					self.mouseZoomedIn = false;

					var hasDraggingClass,
						updateZoomable = function updateZoomable() {
							if (self.mouseZoomedIn) {
								framework.removeClass(
									template,
									"pswp--zoomed-in"
								);
								self.mouseZoomedIn = false;
							}

							if (_currZoomLevel < 1) {
								framework.addClass(
									template,
									"pswp--zoom-allowed"
								);
							} else {
								framework.removeClass(
									template,
									"pswp--zoom-allowed"
								);
							}

							removeDraggingClass();
						},
						removeDraggingClass = function removeDraggingClass() {
							if (hasDraggingClass) {
								framework.removeClass(
									template,
									"pswp--dragging"
								);
								hasDraggingClass = false;
							}
						};

					_listen("resize", updateZoomable);

					_listen("afterChange", updateZoomable);

					_listen("PointerDown", function () {
						if (self.mouseZoomedIn) {
							hasDraggingClass = true;
							framework.addClass(template, "pswp--dragging");
						}
					});

					_listen("PointerUp", removeDraggingClass);

					if (!onInit) {
						updateZoomable();
					}
				},
				handleMouseWheel: function handleMouseWheel(e) {
					if (_currZoomLevel <= self.currItem.fitRatio) {
						if (_options.modal) {
							if (
								!_options.closeOnScroll ||
								_numAnimations ||
								_isDragging
							) {
								e.preventDefault();
							} else if (
								_transformKey &&
								Math.abs(e.deltaY) > 2
							) {
								_closedByScroll = true;
								self.close();
							}
						}

						return true;
					}

					e.stopPropagation();
					_wheelDelta.x = 0;

					if ("deltaX" in e) {
						if (e.deltaMode === 1) {
							_wheelDelta.x = e.deltaX * 18;
							_wheelDelta.y = e.deltaY * 18;
						} else {
							_wheelDelta.x = e.deltaX;
							_wheelDelta.y = e.deltaY;
						}
					} else if ("wheelDelta" in e) {
						if (e.wheelDeltaX) {
							_wheelDelta.x = -0.16 * e.wheelDeltaX;
						}

						if (e.wheelDeltaY) {
							_wheelDelta.y = -0.16 * e.wheelDeltaY;
						} else {
							_wheelDelta.y = -0.16 * e.wheelDelta;
						}
					} else if ("detail" in e) {
						_wheelDelta.y = e.detail;
					} else {
						return;
					}

					_calculatePanBounds(_currZoomLevel, true);

					var newPanX = _panOffset.x - _wheelDelta.x,
						newPanY = _panOffset.y - _wheelDelta.y;

					if (
						_options.modal ||
						(newPanX <= _currPanBounds.min.x &&
							newPanX >= _currPanBounds.max.x &&
							newPanY <= _currPanBounds.min.y &&
							newPanY >= _currPanBounds.max.y)
					) {
						e.preventDefault();
					}

					self.panTo(newPanX, newPanY);
				},
				toggleDesktopZoom: function toggleDesktopZoom(centerPoint) {
					centerPoint = centerPoint || {
						x: _viewportSize.x / 2 + _offset.x,
						y: _viewportSize.y / 2 + _offset.y
					};

					var doubleTapZoomLevel = _options.getDoubleTapZoom(
						true,
						self.currItem
					);

					var zoomOut = _currZoomLevel === doubleTapZoomLevel;
					self.mouseZoomedIn = !zoomOut;
					self.zoomTo(
						zoomOut
							? self.currItem.initialZoomLevel
							: doubleTapZoomLevel,
						centerPoint,
						333
					);
					framework[(!zoomOut ? "add" : "remove") + "Class"](
						template,
						"pswp--zoomed-in"
					);
				}
			}
		});

		var _historyDefaultOptions = {
			history: true,
			galleryUID: 1
		};

		var _historyUpdateTimeout,
			_hashChangeTimeout,
			_hashAnimCheckTimeout,
			_hashChangedByScript,
			_hashChangedByHistory,
			_hashReseted,
			_initialHash,
			_historyChanged,
			_closedFromURL,
			_urlChangedOnce,
			_windowLoc,
			_supportsPushState,
			_getHash = function _getHash() {
				return _windowLoc.hash.substring(1);
			},
			_cleanHistoryTimeouts = function _cleanHistoryTimeouts() {
				if (_historyUpdateTimeout) {
					clearTimeout(_historyUpdateTimeout);
				}

				if (_hashAnimCheckTimeout) {
					clearTimeout(_hashAnimCheckTimeout);
				}
			},
			_parseItemIndexFromURL = function _parseItemIndexFromURL() {
				var hash = _getHash(),
					params = {};

				if (hash.length < 5) {
					return params;
				}

				var i,
					vars = hash.split("&");

				for (i = 0; i < vars.length; i++) {
					if (!vars[i]) {
						continue;
					}

					var pair = vars[i].split("=");

					if (pair.length < 2) {
						continue;
					}

					params[pair[0]] = pair[1];
				}

				if (_options.galleryPIDs) {
					var searchfor = params.pid;
					params.pid = 0;

					for (i = 0; i < _items.length; i++) {
						if (_items[i].pid === searchfor) {
							params.pid = i;
							break;
						}
					}
				} else {
					params.pid = parseInt(params.pid, 10) - 1;
				}

				if (params.pid < 0) {
					params.pid = 0;
				}

				return params;
			},
			_updateHash = function _updateHash() {
				if (_hashAnimCheckTimeout) {
					clearTimeout(_hashAnimCheckTimeout);
				}

				if (_numAnimations || _isDragging) {
					_hashAnimCheckTimeout = setTimeout(_updateHash, 500);
					return;
				}

				if (_hashChangedByScript) {
					clearTimeout(_hashChangeTimeout);
				} else {
					_hashChangedByScript = true;
				}

				var pid = _currentItemIndex + 1;

				var item = _getItemAt(_currentItemIndex);

				if (item.hasOwnProperty("pid")) {
					pid = item.pid;
				}

				var newHash =
					_initialHash +
					"&" +
					"gid=" +
					_options.galleryUID +
					"&" +
					"pid=" +
					pid;

				if (!_historyChanged) {
					if (_windowLoc.hash.indexOf(newHash) === -1) {
						_urlChangedOnce = true;
					}
				}

				var newURL = _windowLoc.href.split("#")[0] + "#" + newHash;

				if (_supportsPushState) {
					if ("#" + newHash !== window.location.hash) {
						history[_historyChanged ? "replaceState" : "pushState"](
							"",
							document.title,
							newURL
						);
					}
				} else {
					if (_historyChanged) {
						_windowLoc.replace(newURL);
					} else {
						_windowLoc.hash = newHash;
					}
				}

				_historyChanged = true;
				_hashChangeTimeout = setTimeout(function () {
					_hashChangedByScript = false;
				}, 60);
			};

		_registerModule("History", {
			publicMethods: {
				initHistory: function initHistory() {
					framework.extend(_options, _historyDefaultOptions, true);

					if (!_options.history) {
						return;
					}

					_windowLoc = window.location;
					_urlChangedOnce = false;
					_closedFromURL = false;
					_historyChanged = false;
					_initialHash = _getHash();
					_supportsPushState = "pushState" in history;

					if (_initialHash.indexOf("gid=") > -1) {
						_initialHash = _initialHash.split("&gid=")[0];
						_initialHash = _initialHash.split("?gid=")[0];
					}

					_listen("afterChange", self.updateURL);

					_listen("unbindEvents", function () {
						framework.unbind(
							window,
							"hashchange",
							self.onHashChange
						);
					});

					var returnToOriginal = function returnToOriginal() {
						_hashReseted = true;

						if (!_closedFromURL) {
							if (_urlChangedOnce) {
								history.back();
							} else {
								if (_initialHash) {
									_windowLoc.hash = _initialHash;
								} else {
									if (_supportsPushState) {
										history.pushState(
											"",
											document.title,
											_windowLoc.pathname +
												_windowLoc.search
										);
									} else {
										_windowLoc.hash = "";
									}
								}
							}
						}

						_cleanHistoryTimeouts();
					};

					_listen("unbindEvents", function () {
						if (_closedByScroll) {
							returnToOriginal();
						}
					});

					_listen("destroy", function () {
						if (!_hashReseted) {
							returnToOriginal();
						}
					});

					_listen("firstUpdate", function () {
						_currentItemIndex = _parseItemIndexFromURL().pid;
					});

					var index = _initialHash.indexOf("pid=");

					if (index > -1) {
						_initialHash = _initialHash.substring(0, index);

						if (_initialHash.slice(-1) === "&") {
							_initialHash = _initialHash.slice(0, -1);
						}
					}

					setTimeout(function () {
						if (_isOpen) {
							framework.bind(
								window,
								"hashchange",
								self.onHashChange
							);
						}
					}, 40);
				},
				onHashChange: function onHashChange() {
					if (_getHash() === _initialHash) {
						_closedFromURL = true;
						self.close();
						return;
					}

					if (!_hashChangedByScript) {
						_hashChangedByHistory = true;
						self.goTo(_parseItemIndexFromURL().pid);
						_hashChangedByHistory = false;
					}
				},
				updateURL: function updateURL() {
					_cleanHistoryTimeouts();

					if (_hashChangedByHistory) {
						return;
					}

					if (!_historyChanged) {
						_updateHash();
					} else {
						_historyUpdateTimeout = setTimeout(_updateHash, 800);
					}
				}
			}
		});

		framework.extend(self, publicMethods);
	};

	return PhotoSwipe;
});

/*!
 * modified PhotoSwipe Default UI - 4.1.0 - 2015-07-11
 * @see {@link http://photoswipe.com}
 * Copyright (c) 2015 Dmitry Semenov;
 * removed module check
 * exposed as window property
 * @see {@link https://github.com/dimsemenov/PhotoSwipe/blob/master/dist/photoswipe-ui-default.js}
 * passes jshint
 */

(function(root, factory) {
	root.PhotoSwipeUI_Default = factory();
})("undefined" !== typeof window ? window : this, function () {
	"use strict";

	var PhotoSwipeUI_Default = function PhotoSwipeUI_Default(pswp, framework) {
		var ui = this;

		var _overlayUIUpdated = false,
			_controlsVisible = true,
			_fullscrenAPI,
			_controls,
			_captionContainer,
			_fakeCaptionContainer,
			_indexIndicator,
			_shareButton,
			_shareModal,
			_shareModalHidden = true,
			_initalCloseOnScrollValue,
			_isIdle,
			_listen,
			_loadingIndicator,
			_loadingIndicatorHidden,
			_loadingIndicatorTimeout,
			_galleryHasOneSlide,
			_options,
			_defaultUIOptions = {
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
				timeToIdle: 4000,
				timeToIdleOutside: 1000,
				loadingIndicatorDelay: 1000,
				addCaptionHTMLFn: function addCaptionHTMLFn(item, captionEl) {
					if (!item.title) {
						captionEl.children[0].innerHTML = "";
						return false;
					}

					captionEl.children[0].innerHTML = item.title;
					return true;
				},
				closeEl: true,
				captionEl: true,
				fullscreenEl: true,
				zoomEl: true,
				shareEl: true,
				counterEl: true,
				arrowEl: true,
				preloaderEl: true,
				tapToClose: false,
				tapToToggleControls: true,
				clickToCloseNonZoomable: true,
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
							"http://www.pinterest.com/pin/create/button/" +
							"?url={{url}}&media={{image_url}}&description={{text}}"
					},
					{
						id: "download",
						label: "Download image",
						url: "{{raw_image_url}}",
						download: true
					}
				],
				getImageURLForShare: function getImageURLForShare() {
					return pswp.currItem.src || "";
				},
				getPageURLForShare: function getPageURLForShare() {
					return window.location.href;
				},
				getTextForShare: function getTextForShare() {
					return pswp.currItem.title || "";
				},
				indexIndicatorSep: " / ",
				fitControlsWidth: 1200
			},
			_blockControlsTap,
			_blockControlsTapTimeout;

		var _onControlsTap = function _onControlsTap(e) {
				if (_blockControlsTap) {
					return true;
				}

				e = e || window.event;

				if (_options.timeToIdle && _options.mouseUsed && !_isIdle) {
					_onIdleMouseMove();
				}

				var target = e.target || e.srcElement,
					uiElement,
					clickedClass = target.getAttribute("class") || "",
					found;

				for (var i = 0; i < _uiElements.length; i++) {
					uiElement = _uiElements[i];

					if (
						uiElement.onTap &&
						clickedClass.indexOf("pswp__" + uiElement.name) > -1
					) {
						uiElement.onTap();
						found = true;
					}
				}

				if (found) {
					if (e.stopPropagation) {
						e.stopPropagation();
					}

					_blockControlsTap = true;
					var tapDelay = framework.features.isOldAndroid ? 600 : 30;
					_blockControlsTapTimeout = setTimeout(function () {
						_blockControlsTap = false;
					}, tapDelay);
				}
			},
			_fitControlsInViewport = function _fitControlsInViewport() {
				return (
					!pswp.likelyTouchDevice ||
					_options.mouseUsed ||
					screen.width > _options.fitControlsWidth
				);
			},
			_togglePswpClass = function _togglePswpClass(el, cName, add) {
				framework[(add ? "add" : "remove") + "Class"](
					el,
					"pswp__" + cName
				);
			},
			_countNumItems = function _countNumItems() {
				var hasOneSlide = _options.getNumItemsFn() === 1;

				if (hasOneSlide !== _galleryHasOneSlide) {
					_togglePswpClass(_controls, "ui--one-slide", hasOneSlide);

					_galleryHasOneSlide = hasOneSlide;
				}
			},
			_toggleShareModalClass = function _toggleShareModalClass() {
				_togglePswpClass(
					_shareModal,
					"share-modal--hidden",
					_shareModalHidden
				);
			},
			_toggleShareModal = function _toggleShareModal() {
				_shareModalHidden = !_shareModalHidden;

				if (!_shareModalHidden) {
					_toggleShareModalClass();

					setTimeout(function () {
						if (!_shareModalHidden) {
							framework.addClass(
								_shareModal,
								"pswp__share-modal--fade-in"
							);
						}
					}, 30);
				} else {
					framework.removeClass(
						_shareModal,
						"pswp__share-modal--fade-in"
					);
					setTimeout(function () {
						if (_shareModalHidden) {
							_toggleShareModalClass();
						}
					}, 300);
				}

				if (!_shareModalHidden) {
					_updateShareURLs();
				}

				return false;
			},
			_openWindowPopup = function _openWindowPopup(e) {
				e = e || window.event;
				var target = e.target || e.srcElement;
				pswp.shout("shareLinkClick", e, target);

				if (!target.href) {
					return false;
				}

				if (target.hasAttribute("download")) {
					return true;
				}

				window.open(
					target.href,
					"pswp_share",
					"scrollbars=yes,resizable=yes,toolbar=no," +
						"location=yes,width=550,height=420,top=100,left=" +
						(window.screen
							? Math.round(screen.width / 2 - 275)
							: 100)
				);

				if (!_shareModalHidden) {
					_toggleShareModal();
				}

				return false;
			},
			_updateShareURLs = function _updateShareURLs() {
				var shareButtonOut = "",
					shareButtonData,
					shareURL,
					image_url,
					page_url,
					share_text;

				for (var i = 0; i < _options.shareButtons.length; i++) {
					shareButtonData = _options.shareButtons[i];
					image_url = _options.getImageURLForShare(shareButtonData);
					page_url = _options.getPageURLForShare(shareButtonData);
					share_text = _options.getTextForShare(shareButtonData);
					shareURL = shareButtonData.url
						.replace("{{url}}", encodeURIComponent(page_url))
						.replace("{{image_url}}", encodeURIComponent(image_url))
						.replace("{{raw_image_url}}", image_url)
						.replace("{{text}}", encodeURIComponent(share_text));
					shareButtonOut +=
						'<a href="' +
						shareURL +
						'" target="_blank" ' +
						'class="pswp__share--' +
						shareButtonData.id +
						'"' +
						(shareButtonData.download ? "download" : "") +
						">" +
						shareButtonData.label +
						"</a>";

					if (_options.parseShareButtonOut) {
						shareButtonOut = _options.parseShareButtonOut(
							shareButtonData,
							shareButtonOut
						);
					}
				}

				_shareModal.children[0].innerHTML = shareButtonOut;
				_shareModal.children[0].onclick = _openWindowPopup;
			},
			_hasCloseClass = function _hasCloseClass(target) {
				for (var i = 0; i < _options.closeElClasses.length; i++) {
					if (
						framework.hasClass(
							target,
							"pswp__" + _options.closeElClasses[i]
						)
					) {
						return true;
					}
				}
			},
			_idleInterval,
			_idleTimer,
			_idleIncrement = 0,
			_onIdleMouseMove = function _onIdleMouseMove() {
				clearTimeout(_idleTimer);
				_idleIncrement = 0;

				if (_isIdle) {
					ui.setIdle(false);
				}
			},
			_onMouseLeaveWindow = function _onMouseLeaveWindow(e) {
				e = e ? e : window.event;
				var from = e.relatedTarget || e.toElement;

				if (!from || from.nodeName === "HTML") {
					clearTimeout(_idleTimer);
					_idleTimer = setTimeout(function () {
						ui.setIdle(true);
					}, _options.timeToIdleOutside);
				}
			},
			_setupFullscreenAPI = function _setupFullscreenAPI() {
				if (_options.fullscreenEl && !framework.features.isOldAndroid) {
					if (!_fullscrenAPI) {
						_fullscrenAPI = ui.getFullscreenAPI();
					}

					if (_fullscrenAPI) {
						framework.bind(
							document,
							_fullscrenAPI.eventK,
							ui.updateFullscreen
						);
						ui.updateFullscreen();
						framework.addClass(pswp.template, "pswp--supports-fs");
					} else {
						framework.removeClass(
							pswp.template,
							"pswp--supports-fs"
						);
					}
				}
			},
			_setupLoadingIndicator = function _setupLoadingIndicator() {
				if (_options.preloaderEl) {
					_toggleLoadingIndicator(true);

					_listen("beforeChange", function () {
						clearTimeout(_loadingIndicatorTimeout);
						_loadingIndicatorTimeout = setTimeout(function () {
							if (pswp.currItem && pswp.currItem.loading) {
								if (
									!pswp.allowProgressiveImg() ||
									(pswp.currItem.img &&
										!pswp.currItem.img.naturalWidth)
								) {
									_toggleLoadingIndicator(false);
								}
							} else {
								_toggleLoadingIndicator(true);
							}
						}, _options.loadingIndicatorDelay);
					});

					_listen("imageLoadComplete", function(index, item) {
						if (pswp.currItem === item) {
							_toggleLoadingIndicator(true);
						}
					});
				}
			},
			_toggleLoadingIndicator = function _toggleLoadingIndicator(hide) {
				if (_loadingIndicatorHidden !== hide) {
					_togglePswpClass(
						_loadingIndicator,
						"preloader--active",
						!hide
					);

					_loadingIndicatorHidden = hide;
				}
			},
			_applyNavBarGaps = function _applyNavBarGaps(item) {
				var gap = item.vGap;

				if (_fitControlsInViewport()) {
					var bars = _options.barsSize;

					if (_options.captionEl && bars.bottom === "auto") {
						if (!_fakeCaptionContainer) {
							_fakeCaptionContainer = framework.createEl(
								"pswp__caption pswp__caption--fake"
							);

							_fakeCaptionContainer.appendChild(
								framework.createEl("pswp__caption__center")
							);

							_controls.insertBefore(
								_fakeCaptionContainer,
								_captionContainer
							);

							framework.addClass(_controls, "pswp__ui--fit");
						}

						if (
							_options.addCaptionHTMLFn(
								item,
								_fakeCaptionContainer,
								true
							)
						) {
							var captionSize =
								_fakeCaptionContainer.clientHeight;
							gap.bottom = parseInt(captionSize, 10) || 44;
						} else {
							gap.bottom = bars.top;
						}
					} else {
						gap.bottom = bars.bottom === "auto" ? 0 : bars.bottom;
					}

					gap.top = bars.top;
				} else {
					gap.top = gap.bottom = 0;
				}
			},
			_setupIdle = function _setupIdle() {
				if (_options.timeToIdle) {
					_listen("mouseUsed", function () {
						framework.bind(document, "mousemove", _onIdleMouseMove);
						framework.bind(
							document,
							"mouseout",
							_onMouseLeaveWindow
						);
						_idleInterval = setInterval(function () {
							_idleIncrement++;

							if (_idleIncrement === 2) {
								ui.setIdle(true);
							}
						}, _options.timeToIdle / 2);
					});
				}
			},
			_setupHidingControlsDuringGestures = function _setupHidingControlsDuringGestures() {
				_listen("onVerticalDrag", function(now) {
					if (_controlsVisible && now < 0.95) {
						ui.hideControls();
					} else if (!_controlsVisible && now >= 0.95) {
						ui.showControls();
					}
				});

				var pinchControlsHidden;

				_listen("onPinchClose", function(now) {
					if (_controlsVisible && now < 0.9) {
						ui.hideControls();
						pinchControlsHidden = true;
					} else if (
						pinchControlsHidden &&
						!_controlsVisible &&
						now > 0.9
					) {
						ui.showControls();
					}
				});

				_listen("zoomGestureEnded", function () {
					pinchControlsHidden = false;

					if (pinchControlsHidden && !_controlsVisible) {
						ui.showControls();
					}
				});
			};

		var _uiElements = [
			{
				name: "caption",
				option: "captionEl",
				onInit: function onInit(el) {
					_captionContainer = el;
				}
			},
			{
				name: "share-modal",
				option: "shareEl",
				onInit: function onInit(el) {
					_shareModal = el;
				},
				onTap: function onTap() {
					_toggleShareModal();
				}
			},
			{
				name: "button--share",
				option: "shareEl",
				onInit: function onInit(el) {
					_shareButton = el;
				},
				onTap: function onTap() {
					_toggleShareModal();
				}
			},
			{
				name: "button--zoom",
				option: "zoomEl",
				onTap: pswp.toggleDesktopZoom
			},
			{
				name: "counter",
				option: "counterEl",
				onInit: function onInit(el) {
					_indexIndicator = el;
				}
			},
			{
				name: "button--close",
				option: "closeEl",
				onTap: pswp.close
			},
			{
				name: "button--arrow--left",
				option: "arrowEl",
				onTap: pswp.prev
			},
			{
				name: "button--arrow--right",
				option: "arrowEl",
				onTap: pswp.next
			},
			{
				name: "button--fs",
				option: "fullscreenEl",
				onTap: function onTap() {
					if (_fullscrenAPI.isFullscreen()) {
						_fullscrenAPI.exit();
					} else {
						_fullscrenAPI.enter();
					}
				}
			},
			{
				name: "preloader",
				option: "preloaderEl",
				onInit: function onInit(el) {
					_loadingIndicator = el;
				}
			}
		];

		var _setupUIElements = function _setupUIElements() {
			var item, classAttr, uiElement;

			var loopThroughChildElements = function loopThroughChildElements(
				sChildren
			) {
				if (!sChildren) {
					return;
				}

				var l = sChildren.length;

				for (var i = 0; i < l; i += 1) {
					item = sChildren[i];
					classAttr = item.className;

					for (var a = 0; a < _uiElements.length; a++) {
						uiElement = _uiElements[a];

						if (classAttr.indexOf("pswp__" + uiElement.name) > -1) {
							if (_options[uiElement.option]) {
								framework.removeClass(
									item,
									"pswp__element--disabled"
								);

								if (uiElement.onInit) {
									uiElement.onInit(item);
								}
							} else {
								framework.addClass(
									item,
									"pswp__element--disabled"
								);
							}
						}
					}
				}
			};

			loopThroughChildElements(_controls.children);
			var topBar = framework.getChildByClass(_controls, "pswp__top-bar");

			if (topBar) {
				loopThroughChildElements(topBar.children);
			}
		};

		ui.init = function () {
			framework.extend(pswp.options, _defaultUIOptions, true);
			_options = pswp.options;
			_controls = framework.getChildByClass(pswp.scrollWrap, "pswp__ui");
			_listen = pswp.listen;

			_setupHidingControlsDuringGestures();

			_listen("beforeChange", ui.update);

			_listen("doubleTap", function(point) {
				var initialZoomLevel = pswp.currItem.initialZoomLevel;

				if (pswp.getZoomLevel() !== initialZoomLevel) {
					pswp.zoomTo(initialZoomLevel, point, 333);
				} else {
					pswp.zoomTo(
						_options.getDoubleTapZoom(false, pswp.currItem),
						point,
						333
					);
				}
			});

			_listen("preventDragEvent", function(e, isDown, preventObj) {
				var t = e.target || e.srcElement;

				if (
					t &&
					t.getAttribute("class") &&
					e.type.indexOf("mouse") > -1 &&
					(t.getAttribute("class").indexOf("__caption") > 0 ||
						/(SMALL|STRONG|EM)/i.test(t.tagName))
				) {
					preventObj.prevent = false;
				}
			});

			_listen("bindEvents", function () {
				framework.bind(_controls, "pswpTap click", _onControlsTap);
				framework.bind(pswp.scrollWrap, "pswpTap", ui.onGlobalTap);

				if (!pswp.likelyTouchDevice) {
					framework.bind(
						pswp.scrollWrap,
						"mouseover",
						ui.onMouseOver
					);
				}
			});

			_listen("unbindEvents", function () {
				if (!_shareModalHidden) {
					_toggleShareModal();
				}

				if (_idleInterval) {
					clearInterval(_idleInterval);
				}

				framework.unbind(document, "mouseout", _onMouseLeaveWindow);
				framework.unbind(document, "mousemove", _onIdleMouseMove);
				framework.unbind(_controls, "pswpTap click", _onControlsTap);
				framework.unbind(pswp.scrollWrap, "pswpTap", ui.onGlobalTap);
				framework.unbind(pswp.scrollWrap, "mouseover", ui.onMouseOver);

				if (_fullscrenAPI) {
					framework.unbind(
						document,
						_fullscrenAPI.eventK,
						ui.updateFullscreen
					);

					if (_fullscrenAPI.isFullscreen()) {
						_options.hideAnimationDuration = 0;

						_fullscrenAPI.exit();
					}

					_fullscrenAPI = null;
				}
			});

			_listen("destroy", function () {
				if (_options.captionEl) {
					if (_fakeCaptionContainer) {
						_controls.removeChild(_fakeCaptionContainer);
					}

					framework.removeClass(
						_captionContainer,
						"pswp__caption--empty"
					);
				}

				if (_shareModal) {
					_shareModal.children[0].onclick = null;
				}

				framework.removeClass(_controls, "pswp__ui--over-close");
				framework.addClass(_controls, "pswp__ui--hidden");
				ui.setIdle(false);
			});

			if (!_options.showAnimationDuration) {
				framework.removeClass(_controls, "pswp__ui--hidden");
			}

			_listen("initialZoomIn", function () {
				if (_options.showAnimationDuration) {
					framework.removeClass(_controls, "pswp__ui--hidden");
				}
			});

			_listen("initialZoomOut", function () {
				framework.addClass(_controls, "pswp__ui--hidden");
			});

			_listen("parseVerticalMargin", _applyNavBarGaps);

			_setupUIElements();

			if (_options.shareEl && _shareButton && _shareModal) {
				_shareModalHidden = true;
			}

			_countNumItems();

			_setupIdle();

			_setupFullscreenAPI();

			_setupLoadingIndicator();
		};

		ui.setIdle = function (isIdle) {
			_isIdle = isIdle;

			_togglePswpClass(_controls, "ui--idle", isIdle);
		};

		ui.update = function () {
			if (_controlsVisible && pswp.currItem) {
				ui.updateIndexIndicator();

				if (_options.captionEl) {
					_options.addCaptionHTMLFn(pswp.currItem, _captionContainer);

					_togglePswpClass(
						_captionContainer,
						"caption--empty",
						!pswp.currItem.title
					);
				}

				_overlayUIUpdated = true;
			} else {
				_overlayUIUpdated = false;
			}

			if (!_shareModalHidden) {
				_toggleShareModal();
			}

			_countNumItems();
		};

		ui.updateFullscreen = function (e) {
			if (e) {
				setTimeout(function () {
					pswp.setScrollOffset(0, framework.getScrollY());
				}, 50);
			}

			framework[
				(_fullscrenAPI.isFullscreen() ? "add" : "remove") + "Class"
			](pswp.template, "pswp--fs");
		};

		ui.updateIndexIndicator = function () {
			if (_options.counterEl) {
				_indexIndicator.innerHTML =
					pswp.getCurrentIndex() +
					1 +
					_options.indexIndicatorSep +
					_options.getNumItemsFn();
			}
		};

		ui.onGlobalTap = function (e) {
			e = e || window.event;
			var target = e.target || e.srcElement;

			if (_blockControlsTap) {
				return;
			}

			if (e.detail && e.detail.pointerType === "mouse") {
				if (_hasCloseClass(target)) {
					pswp.close();
					return;
				}

				if (framework.hasClass(target, "pswp__img")) {
					if (
						pswp.getZoomLevel() === 1 &&
						pswp.getZoomLevel() <= pswp.currItem.fitRatio
					) {
						if (_options.clickToCloseNonZoomable) {
							pswp.close();
						}
					} else {
						pswp.toggleDesktopZoom(e.detail.releasePoint);
					}
				}
			} else {
				if (_options.tapToToggleControls) {
					if (_controlsVisible) {
						ui.hideControls();
					} else {
						ui.showControls();
					}
				}

				if (
					_options.tapToClose &&
					(framework.hasClass(target, "pswp__img") ||
						_hasCloseClass(target))
				) {
					pswp.close();
					return;
				}
			}
		};

		ui.onMouseOver = function (e) {
			e = e || window.event;
			var target = e.target || e.srcElement;

			_togglePswpClass(
				_controls,
				"ui--over-close",
				_hasCloseClass(target)
			);
		};

		ui.hideControls = function () {
			framework.addClass(_controls, "pswp__ui--hidden");
			_controlsVisible = false;
		};

		ui.showControls = function () {
			_controlsVisible = true;

			if (!_overlayUIUpdated) {
				ui.update();
			}

			framework.removeClass(_controls, "pswp__ui--hidden");
		};

		ui.supportsFullscreen = function () {
			var d = document;
			return !!(
				d.exitFullscreen ||
				d.mozCancelFullScreen ||
				d.webkitExitFullscreen ||
				d.msExitFullscreen
			);
		};

		ui.getFullscreenAPI = function () {
			var dE = document.documentElement,
				api,
				tF = "fullscreenchange";

			if (dE.requestFullscreen) {
				api = {
					enterK: "requestFullscreen",
					exitK: "exitFullscreen",
					elementK: "fullscreenElement",
					eventK: tF
				};
			} else if (dE.mozRequestFullScreen) {
				api = {
					enterK: "mozRequestFullScreen",
					exitK: "mozCancelFullScreen",
					elementK: "mozFullScreenElement",
					eventK: "moz" + tF
				};
			} else if (dE.webkitRequestFullscreen) {
				api = {
					enterK: "webkitRequestFullscreen",
					exitK: "webkitExitFullscreen",
					elementK: "webkitFullscreenElement",
					eventK: "webkit" + tF
				};
			} else if (dE.msRequestFullscreen) {
				api = {
					enterK: "msRequestFullscreen",
					exitK: "msExitFullscreen",
					elementK: "msFullscreenElement",
					eventK: "MSFullscreenChange"
				};
			}

			if (api) {
				api.enter = function () {
					_initalCloseOnScrollValue = _options.closeOnScroll;
					_options.closeOnScroll = false;

					if (this.enterK === "webkitRequestFullscreen") {
						pswp.template[this.enterK](
							Element.ALLOW_KEYBOARD_INPUT
						);
					} else {
						return pswp.template[this.enterK]();
					}
				};

				api.exit = function () {
					_options.closeOnScroll = _initalCloseOnScrollValue;
					return document[this.exitK]();
				};

				api.isFullscreen = function () {
					return document[this.elementK];
				};
			}

			return api;
		};
	};

	return PhotoSwipeUI_Default;
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

/*jslint browser: true */

/*jslint node: true */

/*global global, ActiveXObject, define, escape, module, pnotify, Proxy, jQuery, require, self, setImmediate, window */

/*!
 * modified Packery PACKAGED v2.1.1
 * Gapless, draggable grid layouts
 * Licensed GPLv3 for open source use
 * or Packery Commercial License for commercial use
 * packery.metafizzy.co
 * Copyright 2016 Metafizzy
 * removed jQuery support
 * removed module check
 * exposed as window property
 * @see {@link https://github.com/metafizzy/packery/blob/master/dist/packery.pkgd.js}
 * passes jshint
 */
(function(root, factory) {
	"use strict";

	root.getSize = factory();
})("undefined" !== typeof window ? window : this, function factory() {
	"use strict";

	function getStyleSize(value) {
		var num = parseFloat(value);
		var isValid = value.indexOf("%") === -1 && !isNaN(num);
		return isValid && num;
	}

	function noop() {}

	var logError =
		typeof console === "undefined"
			? noop
			: function(message) {
					console.error(message);
			  };
	var measurements = [
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
	];
	var measurementsLength = measurements.length;

	function getZeroSize() {
		var size = {
			width: 0,
			height: 0,
			innerWidth: 0,
			innerHeight: 0,
			outerWidth: 0,
			outerHeight: 0
		};

		for (var i = 0; i < measurementsLength; i++) {
			var measurement = measurements[i];
			size[measurement] = 0;
		}

		return size;
	}

	function getStyle(elem) {
		var style = getComputedStyle(elem);

		if (!style) {
			logError(
				"Style returned " +
					style +
					". Are you running this code in a hidden iframe on Firefox? " +
					"See http://bit.ly/getsizebug1"
			);
		}

		return style;
	}

	var isSetup = false;
	var isBoxSizeOuter;

	function setup() {
		if (isSetup) {
			return;
		}

		isSetup = true;
		var div = document.createElement("div");
		div.style.width = "200px";
		div.style.padding = "1px 2px 3px 4px";
		div.style.borderStyle = "solid";
		div.style.borderWidth = "1px 2px 3px 4px";
		div.style.boxSizing = "border-box";
		var body = document.body || document.documentElement;
		body.appendChild(div);
		var style = getStyle(div);
		getSize.isBoxSizeOuter = isBoxSizeOuter =
			getStyleSize(style.width) === 200;
		body.removeChild(div);
	}

	function getSize(elem) {
		setup();

		if (typeof elem === "string") {
			elem = document.querySelector(elem);
		}

		if (!elem || _typeof(elem) !== "object" || !elem.nodeType) {
			return;
		}

		var style = getStyle(elem);

		if (style.display === "none") {
			return getZeroSize();
		}

		var size = {};
		size.width = elem.offsetWidth;
		size.height = elem.offsetHeight;
		var isBorderBox = (size.isBorderBox = style.boxSizing === "border-box");

		for (var i = 0; i < measurementsLength; i++) {
			var measurement = measurements[i];
			var value = style[measurement];
			var num = parseFloat(value);
			size[measurement] = !isNaN(num) ? num : 0;
		}

		var paddingWidth = size.paddingLeft + size.paddingRight;
		var paddingHeight = size.paddingTop + size.paddingBottom;
		var marginWidth = size.marginLeft + size.marginRight;
		var marginHeight = size.marginTop + size.marginBottom;
		var borderWidth = size.borderLeftWidth + size.borderRightWidth;
		var borderHeight = size.borderTopWidth + size.borderBottomWidth;
		var isBorderBoxSizeOuter = isBorderBox && isBoxSizeOuter;
		var styleWidth = getStyleSize(style.width);

		if (styleWidth !== false) {
			size.width =
				styleWidth +
				(isBorderBoxSizeOuter ? 0 : paddingWidth + borderWidth);
		}

		var styleHeight = getStyleSize(style.height);

		if (styleHeight !== false) {
			size.height =
				styleHeight +
				(isBorderBoxSizeOuter ? 0 : paddingHeight + borderHeight);
		}

		size.innerWidth = size.width - (paddingWidth + borderWidth);
		size.innerHeight = size.height - (paddingHeight + borderHeight);
		size.outerWidth = size.width + marginWidth;
		size.outerHeight = size.height + marginHeight;
		return size;
	}

	return getSize;
});

(function(root, factory) {
	root.EvEmitter = factory();
})("undefined" !== typeof window ? window : this, function () {
	function EvEmitter() {}

	var proto = EvEmitter.prototype;

	proto.on = function (eventName, listener) {
		if (!eventName || !listener) {
			return;
		}

		var events = (this._events = this._events || {});
		var listeners = (events[eventName] = events[eventName] || []);

		if (listeners.indexOf(listener) === -1) {
			listeners.push(listener);
		}

		return this;
	};

	proto.once = function (eventName, listener) {
		if (!eventName || !listener) {
			return;
		}

		this.on(eventName, listener);
		var onceEvents = (this._onceEvents = this._onceEvents || {});
		var onceListeners = (onceEvents[eventName] =
			onceEvents[eventName] || {});
		onceListeners[listener] = true;
		return this;
	};

	proto.off = function (eventName, listener) {
		var listeners = this._events && this._events[eventName];

		if (!listeners || !listeners.length) {
			return;
		}

		var index = listeners.indexOf(listener);

		if (index !== -1) {
			listeners.splice(index, 1);
		}

		return this;
	};

	proto.emitEvent = function (eventName, args) {
		var listeners = this._events && this._events[eventName];

		if (!listeners || !listeners.length) {
			return;
		}

		var i = 0;
		var listener = listeners[i];
		args = args || [];
		var onceListeners = this._onceEvents && this._onceEvents[eventName];

		while (listener) {
			var isOnce = onceListeners && onceListeners[listener];

			if (isOnce) {
				this.off(eventName, listener);
				delete onceListeners[listener];
			}

			listener.apply(this, args);
			i += isOnce ? 0 : 1;
			listener = listeners[i];
		}

		return this;
	};

	return EvEmitter;
});

(function(window, factory) {
	"use strict";

	window.matchesSelector = factory();
})("undefined" !== typeof window ? window : this, function factory() {
	"use strict";

	var matchesMethod = (function () {
		var ElemProto = Element.prototype;

		if (ElemProto.matches) {
			return "matches";
		}

		if (ElemProto.matchesSelector) {
			return "matchesSelector";
		}

		var prefixes = ["webkit", "moz", "ms", "o"];

		for (var i = 0; i < prefixes.length; i++) {
			var prefix = prefixes[i];
			var method = prefix + "MatchesSelector";

			if (ElemProto[method]) {
				return method;
			}
		}
	})();

	return function matchesSelector(elem, selector) {
		return elem[matchesMethod](selector);
	};
});

(function(window, factory) {
	window.fizzyUIUtils = factory(window, window.matchesSelector);
})("undefined" !== typeof window ? window : this, function factory(
	window,
	matchesSelector
) {
	var utils = {};

	utils.extend = function (a, b) {
		for (var prop in b) {
			if (b.hasOwnProperty(prop)) {
				a[prop] = b[prop];
			}
		}

		return a;
	};

	utils.modulo = function (num, div) {
		return ((num % div) + div) % div;
	};

	utils.makeArray = function (obj) {
		var ary = [];

		if (Array.isArray(obj)) {
			ary = obj;
		} else if (obj && typeof obj.length === "number") {
			for (var i = 0; i < obj.length; i++) {
				ary.push(obj[i]);
			}
		} else {
			ary.push(obj);
		}

		return ary;
	};

	utils.removeFrom = function (ary, obj) {
		var index = ary.indexOf(obj);

		if (index !== -1) {
			ary.splice(index, 1);
		}
	};

	utils.getParent = function (elem, selector) {
		while (elem !== document.body) {
			elem = elem.parentNode;

			if (matchesSelector(elem, selector)) {
				return elem;
			}
		}
	};

	utils.getQueryElement = function (elem) {
		if (typeof elem === "string") {
			return document.querySelector(elem);
		}

		return elem;
	};

	utils.handleEvent = function (event) {
		var method = "on" + event.type;

		if (this[method]) {
			this[method](event);
		}
	};

	utils.filterFindElements = function (elems, selector) {
		elems = utils.makeArray(elems);
		var ffElems = [];
		elems.forEach(function(elem) {
			if (!(elem instanceof HTMLElement)) {
				return;
			}

			if (!selector) {
				ffElems.push(elem);
				return;
			}

			if (matchesSelector(elem, selector)) {
				ffElems.push(elem);
			}

			var childElems = elem.querySelectorAll(selector);

			for (var i = 0; i < childElems.length; i++) {
				ffElems.push(childElems[i]);
			}
		});
		return ffElems;
	};

	utils.debounceMethod = function (_class, methodName, threshold) {
		var method = _class.prototype[methodName];
		var timeoutName = methodName + "Timeout";

		_class.prototype[methodName] = function () {
			var timeout = this[timeoutName];

			if (timeout) {
				clearTimeout(timeout);
			}

			var args = arguments;

			var _this = this;

			this[timeoutName] = setTimeout(function () {
				method.apply(_this, args);
				delete _this[timeoutName];
			}, threshold || 100);
		};
	};

	utils.docReady = function (callback) {
		if (document.readyState === "complete") {
			callback();
		} else {
			document.addEventListener("DOMContentLoaded", callback);
		}
	};

	utils.toDashed = function (str) {
		return str
			.replace(/(.)([A-Z])/g, function(match, $1, $2) {
				return $1 + "-" + $2;
			})
			.toLowerCase();
	};

	var console = window.console;

	utils.htmlInit = function (WidgetClass, namespace) {
		utils.docReady(function () {
			var dashedNamespace = utils.toDashed(namespace);
			var dataAttr = "data-" + dashedNamespace;
			var dataAttrElems = document.querySelectorAll("[" + dataAttr + "]");
			var jsDashElems = document.querySelectorAll(
				".js-" + dashedNamespace
			);
			var elems = utils
				.makeArray(dataAttrElems)
				.concat(utils.makeArray(jsDashElems));
			var dataOptionsAttr = dataAttr + "-options";
			var jQuery = window.jQuery;
			elems.forEach(function(elem) {
				var attr =
					elem.getAttribute(dataAttr) ||
					elem.getAttribute(dataOptionsAttr);
				var options;

				try {
					options = attr && JSON.parse(attr);
				} catch (error) {
					if (console) {
						console.error(
							"Error parsing " +
								dataAttr +
								" on " +
								elem.className +
								": " +
								error
						);
					}

					return;
				}

				var instance = new WidgetClass(elem, options);

				if (jQuery) {
					jQuery.data(elem, namespace, instance);
				}
			});
		});
	};

	return utils;
});

(function(window, factory) {
	window.Outlayer = {};
	window.Outlayer.Item = factory(window.EvEmitter, window.getSize);
})("undefined" !== typeof window ? window : this, function factory(
	EvEmitter,
	getSize
) {
	"use strict";

	function isEmptyObj(obj) {
		for (var prop in obj) {
			if (obj.hasOwnProperty(prop)) {
				return false;
			}
		}

		prop = null;
		return true;
	}

	var docElemStyle = document.documentElement.style;
	var transitionProperty =
		typeof docElemStyle.transition === "string"
			? "transition"
			: "WebkitTransition";
	var transformProperty =
		typeof docElemStyle.transform === "string"
			? "transform"
			: "WebkitTransform";
	var transitionEndEvent = {
		WebkitTransition: "webkitTransitionEnd",
		transition: "transitionend"
	}[transitionProperty];
	var vendorProperties = {
		transform: transformProperty,
		transition: transitionProperty,
		transitionDuration: transitionProperty + "Duration",
		transitionProperty: transitionProperty + "Property",
		transitionDelay: transitionProperty + "Delay"
	};

	function Item(element, layout) {
		if (!element) {
			return;
		}

		this.element = element;
		this.layout = layout;
		this.position = {
			x: 0,
			y: 0
		};

		this._create();
	}

	var proto = (Item.prototype = Object.create(EvEmitter.prototype));
	proto.constructor = Item;

	proto._create = function () {
		this._transn = {
			ingProperties: {},
			clean: {},
			onEnd: {}
		};
		this.css({
			position: "absolute"
		});
	};

	proto.handleEvent = function (event) {
		var method = "on" + event.type;

		if (this[method]) {
			this[method](event);
		}
	};

	proto.getSize = function () {
		this.size = getSize(this.element);
	};

	proto.css = function (style) {
		var elemStyle = this.element.style;

		for (var prop in style) {
			if (style.hasOwnProperty(prop)) {
				var supportedProp = vendorProperties[prop] || prop;
				elemStyle[supportedProp] = style[prop];
			}
		}
	};

	proto.getPosition = function () {
		var style = getComputedStyle(this.element);

		var isOriginLeft = this.layout._getOption("originLeft");

		var isOriginTop = this.layout._getOption("originTop");

		var xValue = style[isOriginLeft ? "left" : "right"];
		var yValue = style[isOriginTop ? "top" : "bottom"];
		var layoutSize = this.layout.size;
		var x =
			xValue.indexOf("%") !== -1
				? (parseFloat(xValue) / 100) * layoutSize.width
				: parseInt(xValue, 10);
		var y =
			yValue.indexOf("%") !== -1
				? (parseFloat(yValue) / 100) * layoutSize.height
				: parseInt(yValue, 10);
		x = isNaN(x) ? 0 : x;
		y = isNaN(y) ? 0 : y;
		x -= isOriginLeft ? layoutSize.paddingLeft : layoutSize.paddingRight;
		y -= isOriginTop ? layoutSize.paddingTop : layoutSize.paddingBottom;
		this.position.x = x;
		this.position.y = y;
	};

	proto.layoutPosition = function () {
		var layoutSize = this.layout.size;
		var style = {};

		var isOriginLeft = this.layout._getOption("originLeft");

		var isOriginTop = this.layout._getOption("originTop");

		var xPadding = isOriginLeft ? "paddingLeft" : "paddingRight";
		var xProperty = isOriginLeft ? "left" : "right";
		var xResetProperty = isOriginLeft ? "right" : "left";
		var x = this.position.x + layoutSize[xPadding];
		style[xProperty] = this.getXValue(x);
		style[xResetProperty] = "";
		var yPadding = isOriginTop ? "paddingTop" : "paddingBottom";
		var yProperty = isOriginTop ? "top" : "bottom";
		var yResetProperty = isOriginTop ? "bottom" : "top";
		var y = this.position.y + layoutSize[yPadding];
		style[yProperty] = this.getYValue(y);
		style[yResetProperty] = "";
		this.css(style);
		this.emitEvent("layout", [this]);
	};

	proto.getXValue = function (x) {
		var isHorizontal = this.layout._getOption("horizontal");

		return this.layout.options.percentPosition && !isHorizontal
			? (x / this.layout.size.width) * 100 + "%"
			: x + "px";
	};

	proto.getYValue = function (y) {
		var isHorizontal = this.layout._getOption("horizontal");

		return this.layout.options.percentPosition && isHorizontal
			? (y / this.layout.size.height) * 100 + "%"
			: y + "px";
	};

	proto._transitionTo = function (x, y) {
		this.getPosition();
		var curX = this.position.x;
		var curY = this.position.y;
		var compareX = parseInt(x, 10);
		var compareY = parseInt(y, 10);
		var didNotMove =
			compareX === this.position.x && compareY === this.position.y;
		this.setPosition(x, y);

		if (didNotMove && !this.isTransitioning) {
			this.layoutPosition();
			return;
		}

		var transX = x - curX;
		var transY = y - curY;
		var transitionStyle = {};
		transitionStyle.transform = this.getTranslate(transX, transY);
		this.transition({
			to: transitionStyle,
			onTransitionEnd: {
				transform: this.layoutPosition
			},
			isCleaning: true
		});
	};

	proto.getTranslate = function (x, y) {
		var isOriginLeft = this.layout._getOption("originLeft");

		var isOriginTop = this.layout._getOption("originTop");

		x = isOriginLeft ? x : -x;
		y = isOriginTop ? y : -y;
		return "translate3d(" + x + "px, " + y + "px, 0)";
	};

	proto.goTo = function (x, y) {
		this.setPosition(x, y);
		this.layoutPosition();
	};

	proto.moveTo = proto._transitionTo;

	proto.setPosition = function (x, y) {
		this.position.x = parseInt(x, 10);
		this.position.y = parseInt(y, 10);
	};

	proto._nonTransition = function (args) {
		this.css(args.to);

		if (args.isCleaning) {
			this._removeStyles(args.to);
		}

		for (var prop in args.onTransitionEnd) {
			if (args.onTransitionEnd.hasOwnProperty(prop)) {
				args.onTransitionEnd[prop].call(this);
			}
		}
	};

	proto.transition = function (args) {
		if (!parseFloat(this.layout.options.transitionDuration)) {
			this._nonTransition(args);

			return;
		}

		var _transition = this._transn;

		for (var prop in args.onTransitionEnd) {
			if (args.onTransitionEnd.hasOwnProperty(prop)) {
				_transition.onEnd[prop] = args.onTransitionEnd[prop];
			}
		}

		for (prop in args.to) {
			if (args.to.hasOwnProperty(prop)) {
				_transition.ingProperties[prop] = true;

				if (args.isCleaning) {
					_transition.clean[prop] = true;
				}
			}
		}

		if (args.from) {
			this.css(args.from);
			var h = this.element.offsetHeight;
			h = null;
		}

		this.enableTransition(args.to);
		this.css(args.to);
		this.isTransitioning = true;
	};

	function toDashedAll(str) {
		return str.replace(/([A-Z])/g, function($1) {
			return "-" + $1.toLowerCase();
		});
	}

	var transitionProps = "opacity," + toDashedAll(transformProperty);

	proto.enableTransition = function () {
		if (this.isTransitioning) {
			return;
		}

		var duration = this.layout.options.transitionDuration;
		duration = typeof duration === "number" ? duration + "ms" : duration;
		this.css({
			transitionProperty: transitionProps,
			transitionDuration: duration,
			transitionDelay: this.staggerDelay || 0
		});
		this.element.addEventListener(transitionEndEvent, this, false);
	};

	proto.onwebkitTransitionEnd = function (event) {
		this.ontransitionend(event);
	};

	proto.onotransitionend = function (event) {
		this.ontransitionend(event);
	};

	var dashedVendorProperties = {
		"-webkit-transform": "transform"
	};

	proto.ontransitionend = function (event) {
		if (event.target !== this.element) {
			return;
		}

		var _transition = this._transn;
		var propertyName =
			dashedVendorProperties[event.propertyName] || event.propertyName;
		delete _transition.ingProperties[propertyName];

		if (isEmptyObj(_transition.ingProperties)) {
			this.disableTransition();
		}

		if (propertyName in _transition.clean) {
			this.element.style[event.propertyName] = "";
			delete _transition.clean[propertyName];
		}

		if (propertyName in _transition.onEnd) {
			var onTransitionEnd = _transition.onEnd[propertyName];
			onTransitionEnd.call(this);
			delete _transition.onEnd[propertyName];
		}

		this.emitEvent("transitionEnd", [this]);
	};

	proto.disableTransition = function () {
		this.removeTransitionStyles();
		this.element.removeEventListener(transitionEndEvent, this, false);
		this.isTransitioning = false;
	};

	proto._removeStyles = function (style) {
		var cleanStyle = {};

		for (var prop in style) {
			if (style.hasOwnProperty(prop)) {
				cleanStyle[prop] = "";
			}
		}

		this.css(cleanStyle);
	};

	var cleanTransitionStyle = {
		transitionProperty: "",
		transitionDuration: "",
		transitionDelay: ""
	};

	proto.removeTransitionStyles = function () {
		this.css(cleanTransitionStyle);
	};

	proto.stagger = function (delay) {
		delay = isNaN(delay) ? 0 : delay;
		this.staggerDelay = delay + "ms";
	};

	proto.removeElem = function () {
		this.element.parentNode.removeChild(this.element);
		this.css({
			display: ""
		});
		this.emitEvent("remove", [this]);
	};

	proto.remove = function () {
		if (
			!transitionProperty ||
			!parseFloat(this.layout.options.transitionDuration)
		) {
			this.removeElem();
			return;
		}

		this.once("transitionEnd", function () {
			this.removeElem();
		});
		this.hide();
	};

	proto.reveal = function () {
		delete this.isHidden;
		this.css({
			display: ""
		});
		var options = this.layout.options;
		var onTransitionEnd = {};
		var transitionEndProperty = this.getHideRevealTransitionEndProperty(
			"visibleStyle"
		);
		onTransitionEnd[transitionEndProperty] = this.onRevealTransitionEnd;
		this.transition({
			from: options.hiddenStyle,
			to: options.visibleStyle,
			isCleaning: true,
			onTransitionEnd: onTransitionEnd
		});
	};

	proto.onRevealTransitionEnd = function () {
		if (!this.isHidden) {
			this.emitEvent("reveal");
		}
	};

	proto.getHideRevealTransitionEndProperty = function (styleProperty) {
		var optionStyle = this.layout.options[styleProperty];

		if (optionStyle.opacity) {
			return "opacity";
		}

		for (var prop in optionStyle) {
			if (optionStyle.hasOwnProperty(prop)) {
				return prop;
			}
		}
	};

	proto.hide = function () {
		this.isHidden = true;
		this.css({
			display: ""
		});
		var options = this.layout.options;
		var onTransitionEnd = {};
		var transitionEndProperty = this.getHideRevealTransitionEndProperty(
			"hiddenStyle"
		);
		onTransitionEnd[transitionEndProperty] = this.onHideTransitionEnd;
		this.transition({
			from: options.visibleStyle,
			to: options.hiddenStyle,
			isCleaning: true,
			onTransitionEnd: onTransitionEnd
		});
	};

	proto.onHideTransitionEnd = function () {
		if (this.isHidden) {
			this.css({
				display: "none"
			});
			this.emitEvent("hide");
		}
	};

	proto.destroy = function () {
		this.css({
			position: "",
			left: "",
			right: "",
			top: "",
			bottom: "",
			transition: "",
			transform: ""
		});
	};

	return Item;
});

(function(window, factory) {
	"use strict";

	window.Outlayer = factory(
		window,
		window.EvEmitter,
		window.getSize,
		window.fizzyUIUtils,
		window.Outlayer.Item
	);
})("undefined" !== typeof window ? window : this, function factory(
	window,
	EvEmitter,
	getSize,
	utils,
	Item
) {
	"use strict";

	var console = window.console;
	var jQuery = window.jQuery;

	var noop = function noop() {};

	var GUID = 0;
	var instances = {};

	function Outlayer(element, options) {
		var queryElement = utils.getQueryElement(element);

		if (!queryElement) {
			if (console) {
				console.error(
					"Bad element for " +
						this.constructor.namespace +
						": " +
						(queryElement || element)
				);
			}

			return;
		}

		this.element = queryElement;

		if (jQuery) {
			this.$element = jQuery(this.element);
		}

		this.options = utils.extend({}, this.constructor.defaults);
		this.option(options);
		var id = ++GUID;
		this.element.outlayerGUID = id;
		instances[id] = this;

		this._create();

		var isInitLayout = this._getOption("initLayout");

		if (isInitLayout) {
			this.layout();
		}
	}

	Outlayer.namespace = "outlayer";
	Outlayer.Item = Item;
	Outlayer.defaults = {
		containerStyle: {
			position: "relative"
		},
		initLayout: true,
		originLeft: true,
		originTop: true,
		resize: true,
		resizeContainer: true,
		transitionDuration: "0.4s",
		hiddenStyle: {
			opacity: 0,
			transform: "scale(0.001)"
		},
		visibleStyle: {
			opacity: 1,
			transform: "scale(1)"
		}
	};
	var proto = Outlayer.prototype;
	utils.extend(proto, EvEmitter.prototype);

	proto.option = function (opts) {
		utils.extend(this.options, opts);
	};

	proto._getOption = function (option) {
		var oldOption = this.constructor.compatOptions[option];
		return oldOption && this.options[oldOption] !== undefined
			? this.options[oldOption]
			: this.options[option];
	};

	Outlayer.compatOptions = {
		initLayout: "isInitLayout",
		horizontal: "isHorizontal",
		layoutInstant: "isLayoutInstant",
		originLeft: "isOriginLeft",
		originTop: "isOriginTop",
		resize: "isResizeBound",
		resizeContainer: "isResizingContainer"
	};

	proto._create = function () {
		this.reloadItems();
		this.stamps = [];
		this.stamp(this.options.stamp);
		utils.extend(this.element.style, this.options.containerStyle);

		var canBindResize = this._getOption("resize");

		if (canBindResize) {
			this.bindResize();
		}
	};

	proto.reloadItems = function () {
		this.items = this._itemize(this.element.children);
	};

	proto._itemize = function (elems) {
		var itemElems = this._filterFindItemElements(elems);

		var Item = this.constructor.Item;
		var items = [];

		for (var i = 0; i < itemElems.length; i++) {
			var elem = itemElems[i];
			var item = new Item(elem, this);
			items.push(item);
		}

		return items;
	};

	proto._filterFindItemElements = function (elems) {
		return utils.filterFindElements(elems, this.options.itemSelector);
	};

	proto.getItemElements = function () {
		return this.items.map(function(item) {
			return item.element;
		});
	};

	proto.layout = function () {
		this._resetLayout();

		this._manageStamps();

		var layoutInstant = this._getOption("layoutInstant");

		var isInstant =
			layoutInstant !== undefined ? layoutInstant : !this._isLayoutInited;
		this.layoutItems(this.items, isInstant);
		this._isLayoutInited = true;
	};

	proto._init = proto.layout;

	proto._resetLayout = function () {
		this.getSize();
	};

	proto.getSize = function () {
		this.size = getSize(this.element);
	};

	proto._getMeasurement = function (measurement, size) {
		var option = this.options[measurement];
		var elem;

		if (!option) {
			this[measurement] = 0;
		} else {
			if (typeof option === "string") {
				elem = this.element.querySelector(option);
			} else if (option instanceof HTMLElement) {
				elem = option;
			}

			this[measurement] = elem ? getSize(elem)[size] : option;
		}
	};

	proto.layoutItems = function (items, isInstant) {
		items = this._getItemsForLayout(items);

		this._layoutItems(items, isInstant);

		this._postLayout();
	};

	proto._getItemsForLayout = function (items) {
		return items.filter(function(item) {
			return !item.isIgnored;
		});
	};

	proto._layoutItems = function (items, isInstant) {
		this._emitCompleteOnItems("layout", items);

		if (!items || !items.length) {
			return;
		}

		var queue = [];
		items.forEach(function(item) {
			var position = this._getItemLayoutPosition(item);

			position.item = item;
			position.isInstant = isInstant || item.isLayoutInstant;
			queue.push(position);
		}, this);

		this._processLayoutQueue(queue);
	};

	proto._getItemLayoutPosition = function () {
		return {
			x: 0,
			y: 0
		};
	};

	proto._processLayoutQueue = function (queue) {
		this.updateStagger();
		queue.forEach(function(obj, i) {
			this._positionItem(obj.item, obj.x, obj.y, obj.isInstant, i);
		}, this);
	};

	proto.updateStagger = function () {
		var stagger = this.options.stagger;

		if (stagger === null || stagger === undefined) {
			this.stagger = 0;
			return;
		}

		this.stagger = getMilliseconds(stagger);
		return this.stagger;
	};

	proto._positionItem = function (item, x, y, isInstant, i) {
		if (isInstant) {
			item.goTo(x, y);
		} else {
			item.stagger(i * this.stagger);
			item.moveTo(x, y);
		}
	};

	proto._postLayout = function () {
		this.resizeContainer();
	};

	proto.resizeContainer = function () {
		var isResizingContainer = this._getOption("resizeContainer");

		if (!isResizingContainer) {
			return;
		}

		var size = this._getContainerSize();

		if (size) {
			this._setContainerMeasure(size.width, true);

			this._setContainerMeasure(size.height, false);
		}
	};

	proto._getContainerSize = noop;

	proto._setContainerMeasure = function (measure, isWidth) {
		if (measure === undefined) {
			return;
		}

		var elemSize = this.size;

		if (elemSize.isBorderBox) {
			measure += isWidth
				? elemSize.paddingLeft +
				  elemSize.paddingRight +
				  elemSize.borderLeftWidth +
				  elemSize.borderRightWidth
				: elemSize.paddingBottom +
				  elemSize.paddingTop +
				  elemSize.borderTopWidth +
				  elemSize.borderBottomWidth;
		}

		measure = Math.max(measure, 0);
		this.element.style[isWidth ? "width" : "height"] = measure + "px";
	};

	proto._emitCompleteOnItems = function (eventName, items) {
		var _this = this;

		function onComplete() {
			_this.dispatchEvent(eventName + "Complete", null, [items]);
		}

		var count = items.length;

		if (!items || !count) {
			onComplete();
			return;
		}

		var doneCount = 0;

		function tick() {
			doneCount++;

			if (doneCount === count) {
				onComplete();
			}
		}

		items.forEach(function(item) {
			item.once(eventName, tick);
		});
	};

	proto.dispatchEvent = function (type, event, args) {
		var emitArgs = event ? [event].concat(args) : args;
		this.emitEvent(type, emitArgs);

		if (jQuery) {
			this.$element = this.$element || jQuery(this.element);

			if (event) {
				var $event = jQuery.Event(event);
				$event.type = type;
				this.$element.trigger($event, args);
			} else {
				this.$element.trigger(type, args);
			}
		}
	};

	proto.ignore = function (elem) {
		var item = this.getItem(elem);

		if (item) {
			item.isIgnored = true;
		}
	};

	proto.unignore = function (elem) {
		var item = this.getItem(elem);

		if (item) {
			delete item.isIgnored;
		}
	};

	proto.stamp = function (elems) {
		elems = this._find(elems);

		if (!elems) {
			return;
		}

		this.stamps = this.stamps.concat(elems);
		elems.forEach(this.ignore, this);
	};

	proto.unstamp = function (elems) {
		elems = this._find(elems);

		if (!elems) {
			return;
		}

		elems.forEach(function(elem) {
			utils.removeFrom(this.stamps, elem);
			this.unignore(elem);
		}, this);
	};

	proto._find = function (elems) {
		if (!elems) {
			return;
		}

		if (typeof elems === "string") {
			elems = this.element.querySelectorAll(elems);
		}

		elems = utils.makeArray(elems);
		return elems;
	};

	proto._manageStamps = function () {
		if (!this.stamps || !this.stamps.length) {
			return;
		}

		this._getBoundingRect();

		this.stamps.forEach(this._manageStamp, this);
	};

	proto._getBoundingRect = function () {
		var boundingRect = this.element.getBoundingClientRect();
		var size = this.size;
		this._boundingRect = {
			left: boundingRect.left + size.paddingLeft + size.borderLeftWidth,
			top: boundingRect.top + size.paddingTop + size.borderTopWidth,
			right:
				boundingRect.right -
				(size.paddingRight + size.borderRightWidth),
			bottom:
				boundingRect.bottom -
				(size.paddingBottom + size.borderBottomWidth)
		};
	};

	proto._manageStamp = noop;

	proto._getElementOffset = function (elem) {
		var boundingRect = elem.getBoundingClientRect();
		var thisRect = this._boundingRect;
		var size = getSize(elem);
		var offset = {
			left: boundingRect.left - thisRect.left - size.marginLeft,
			top: boundingRect.top - thisRect.top - size.marginTop,
			right: thisRect.right - boundingRect.right - size.marginRight,
			bottom: thisRect.bottom - boundingRect.bottom - size.marginBottom
		};
		return offset;
	};

	proto.handleEvent = utils.handleEvent;

	proto.bindResize = function () {
		window.addEventListener("resize", this);
		this.isResizeBound = true;
	};

	proto.unbindResize = function () {
		window.removeEventListener("resize", this);
		this.isResizeBound = false;
	};

	proto.onresize = function () {
		this.resize();
	};

	utils.debounceMethod(Outlayer, "onresize", 100);

	proto.resize = function () {
		if (!this.isResizeBound || !this.needsResizeLayout()) {
			return;
		}

		this.layout();
	};

	proto.needsResizeLayout = function () {
		var size = getSize(this.element);
		var hasSizes = this.size && size;
		return hasSizes && size.innerWidth !== this.size.innerWidth;
	};

	proto.addItems = function (elems) {
		var items = this._itemize(elems);

		if (items.length) {
			this.items = this.items.concat(items);
		}

		return items;
	};

	proto.appended = function (elems) {
		var items = this.addItems(elems);

		if (!items.length) {
			return;
		}

		this.layoutItems(items, true);
		this.reveal(items);
	};

	proto.prepended = function (elems) {
		var items = this._itemize(elems);

		if (!items.length) {
			return;
		}

		var previousItems = this.items.slice(0);
		this.items = items.concat(previousItems);

		this._resetLayout();

		this._manageStamps();

		this.layoutItems(items, true);
		this.reveal(items);
		this.layoutItems(previousItems);
	};

	proto.reveal = function (items) {
		this._emitCompleteOnItems("reveal", items);

		if (!items || !items.length) {
			return;
		}

		var stagger = this.updateStagger();
		items.forEach(function(item, i) {
			item.stagger(i * stagger);
			item.reveal();
		});
	};

	proto.hide = function (items) {
		this._emitCompleteOnItems("hide", items);

		if (!items || !items.length) {
			return;
		}

		var stagger = this.updateStagger();
		items.forEach(function(item, i) {
			item.stagger(i * stagger);
			item.hide();
		});
	};

	proto.revealItemElements = function (elems) {
		var items = this.getItems(elems);
		this.reveal(items);
	};

	proto.hideItemElements = function (elems) {
		var items = this.getItems(elems);
		this.hide(items);
	};

	proto.getItem = function (elem) {
		for (var i = 0; i < this.items.length; i++) {
			var item = this.items[i];

			if (item.element === elem) {
				return item;
			}
		}
	};

	proto.getItems = function (elems) {
		elems = utils.makeArray(elems);
		var items = [];
		elems.forEach(function(elem) {
			var item = this.getItem(elem);

			if (item) {
				items.push(item);
			}
		}, this);
		return items;
	};

	proto.remove = function (elems) {
		var removeItems = this.getItems(elems);

		this._emitCompleteOnItems("remove", removeItems);

		if (!removeItems || !removeItems.length) {
			return;
		}

		removeItems.forEach(function(item) {
			item.remove();
			utils.removeFrom(this.items, item);
		}, this);
	};

	proto.destroy = function () {
		var style = this.element.style;
		style.height = "";
		style.position = "";
		style.width = "";
		this.items.forEach(function(item) {
			item.destroy();
		});
		this.unbindResize();
		var id = this.element.outlayerGUID;
		delete instances[id];
		delete this.element.outlayerGUID;

		if (jQuery) {
			jQuery.removeData(this.element, this.constructor.namespace);
		}
	};

	Outlayer.data = function (elem) {
		elem = utils.getQueryElement(elem);
		var id = elem && elem.outlayerGUID;
		return id && instances[id];
	};

	Outlayer.create = function (namespace, options) {
		var Layout = subclass(Outlayer);
		Layout.defaults = utils.extend({}, Outlayer.defaults);
		utils.extend(Layout.defaults, options);
		Layout.compatOptions = utils.extend({}, Outlayer.compatOptions);
		Layout.namespace = namespace;
		Layout.data = Outlayer.data;
		Layout.Item = subclass(Item);
		utils.htmlInit(Layout, namespace);

		if (jQuery && jQuery.bridget) {
			jQuery.bridget(namespace, Layout);
		}

		return Layout;
	};

	function subclass(Parent) {
		function SubClass() {
			Parent.apply(this, arguments);
		}

		SubClass.prototype = Object.create(Parent.prototype);
		SubClass.prototype.constructor = SubClass;
		return SubClass;
	}

	var msUnits = {
		ms: 1,
		s: 1000
	};

	function getMilliseconds(time) {
		if (typeof time === "number") {
			return time;
		}

		var matches = time.match(/(^\d*\.?\d*)(\w*)/);
		var num = matches && matches[1];
		var unit = matches && matches[2];

		if (!num.length) {
			return 0;
		}

		num = parseFloat(num);
		var mult = msUnits[unit] || 1;
		return num * mult;
	}

	Outlayer.Item = Item;
	return Outlayer;
});

(function(window, factory) {
	window.Packery = window.Packery || {};
	window.Packery.Rect = factory();
})("undefined" !== typeof window ? window : this, function factory() {
	"use strict";

	function Rect(props) {
		for (var prop in Rect.defaults) {
			if (Rect.defaults.hasOwnProperty(prop)) {
				this[prop] = Rect.defaults[prop];
			}
		}

		for (prop in props) {
			if (props.hasOwnProperty(prop)) {
				this[prop] = props[prop];
			}
		}
	}

	Rect.defaults = {
		x: 0,
		y: 0,
		width: 0,
		height: 0
	};
	var proto = Rect.prototype;

	proto.contains = function (rect) {
		var otherWidth = rect.width || 0;
		var otherHeight = rect.height || 0;
		return (
			this.x <= rect.x &&
			this.y <= rect.y &&
			this.x + this.width >= rect.x + otherWidth &&
			this.y + this.height >= rect.y + otherHeight
		);
	};

	proto.overlaps = function (rect) {
		var thisRight = this.x + this.width;
		var thisBottom = this.y + this.height;
		var rectRight = rect.x + rect.width;
		var rectBottom = rect.y + rect.height;
		return (
			this.x < rectRight &&
			thisRight > rect.x &&
			this.y < rectBottom &&
			thisBottom > rect.y
		);
	};

	proto.getMaximalFreeRects = function (rect) {
		if (!this.overlaps(rect)) {
			return false;
		}

		var freeRects = [];
		var freeRect;
		var thisRight = this.x + this.width;
		var thisBottom = this.y + this.height;
		var rectRight = rect.x + rect.width;
		var rectBottom = rect.y + rect.height;

		if (this.y < rect.y) {
			freeRect = new Rect({
				x: this.x,
				y: this.y,
				width: this.width,
				height: rect.y - this.y
			});
			freeRects.push(freeRect);
		}

		if (thisRight > rectRight) {
			freeRect = new Rect({
				x: rectRight,
				y: this.y,
				width: thisRight - rectRight,
				height: this.height
			});
			freeRects.push(freeRect);
		}

		if (thisBottom > rectBottom) {
			freeRect = new Rect({
				x: this.x,
				y: rectBottom,
				width: this.width,
				height: thisBottom - rectBottom
			});
			freeRects.push(freeRect);
		}

		if (this.x < rect.x) {
			freeRect = new Rect({
				x: this.x,
				y: this.y,
				width: rect.x - this.x,
				height: this.height
			});
			freeRects.push(freeRect);
		}

		return freeRects;
	};

	proto.canFit = function (rect) {
		return this.width >= rect.width && this.height >= rect.height;
	};

	return Rect;
});

(function(window, factory) {
	var Packery = (window.Packery = window.Packery || {});
	Packery.Packer = factory(Packery.Rect);
})("undefined" !== typeof window ? window : this, function factory(Rect) {
	"use strict";

	function Packer(width, height, sortDirection) {
		this.width = width || 0;
		this.height = height || 0;
		this.sortDirection = sortDirection || "downwardLeftToRight";
		this.reset();
	}

	var proto = Packer.prototype;

	proto.reset = function () {
		this.spaces = [];
		var initialSpace = new Rect({
			x: 0,
			y: 0,
			width: this.width,
			height: this.height
		});
		this.spaces.push(initialSpace);
		this.sorter =
			sorters[this.sortDirection] || sorters.downwardLeftToRight;
	};

	proto.pack = function (rect) {
		for (var i = 0; i < this.spaces.length; i++) {
			var space = this.spaces[i];

			if (space.canFit(rect)) {
				this.placeInSpace(rect, space);
				break;
			}
		}
	};

	proto.columnPack = function (rect) {
		for (var i = 0; i < this.spaces.length; i++) {
			var space = this.spaces[i];
			var canFitInSpaceColumn =
				space.x <= rect.x &&
				space.x + space.width >= rect.x + rect.width &&
				space.height >= rect.height - 0.01;

			if (canFitInSpaceColumn) {
				rect.y = space.y;
				this.placed(rect);
				break;
			}
		}
	};

	proto.rowPack = function (rect) {
		for (var i = 0; i < this.spaces.length; i++) {
			var space = this.spaces[i];
			var canFitInSpaceRow =
				space.y <= rect.y &&
				space.y + space.height >= rect.y + rect.height &&
				space.width >= rect.width - 0.01;

			if (canFitInSpaceRow) {
				rect.x = space.x;
				this.placed(rect);
				break;
			}
		}
	};

	proto.placeInSpace = function (rect, space) {
		rect.x = space.x;
		rect.y = space.y;
		this.placed(rect);
	};

	proto.placed = function (rect) {
		var revisedSpaces = [];

		for (var i = 0; i < this.spaces.length; i++) {
			var space = this.spaces[i];
			var newSpaces = space.getMaximalFreeRects(rect);

			if (newSpaces) {
				revisedSpaces.push.apply(revisedSpaces, newSpaces);
			} else {
				revisedSpaces.push(space);
			}
		}

		this.spaces = revisedSpaces;
		this.mergeSortSpaces();
	};

	proto.mergeSortSpaces = function () {
		Packer.mergeRects(this.spaces);
		this.spaces.sort(this.sorter);
	};

	proto.addSpace = function (rect) {
		this.spaces.push(rect);
		this.mergeSortSpaces();
	};

	Packer.mergeRects = function (rects) {
		var i = 0;
		var rect = rects[i];

		rectLoop: while (rect) {
			var j = 0;
			var compareRect = rects[i + j];

			while (compareRect) {
				if (compareRect === rect) {
					j++;
				} else if (compareRect.contains(rect)) {
					rects.splice(i, 1);
					rect = rects[i];
					continue rectLoop;
				} else if (rect.contains(compareRect)) {
					rects.splice(i + j, 1);
				} else {
					j++;
				}

				compareRect = rects[i + j];
			}

			i++;
			rect = rects[i];
		}

		return rects;
	};

	var sorters = {
		downwardLeftToRight: function downwardLeftToRight(a, b) {
			return a.y - b.y || a.x - b.x;
		},
		rightwardTopToBottom: function rightwardTopToBottom(a, b) {
			return a.x - b.x || a.y - b.y;
		}
	};
	return Packer;
});

(function(window, factory) {
	window.Packery.Item = factory(window.Outlayer, window.Packery.Rect);
})("undefined" !== typeof window ? window : this, function factory(
	Outlayer,
	Rect
) {
	"use strict";

	var docElemStyle = document.documentElement.style;
	var transformProperty =
		typeof docElemStyle.transform === "string"
			? "transform"
			: "WebkitTransform";

	var Item = function PackeryItem() {
		Outlayer.Item.apply(this, arguments);
	};

	var proto = (Item.prototype = Object.create(Outlayer.Item.prototype));
	var __create = proto._create;

	proto._create = function () {
		__create.call(this);

		this.rect = new Rect();
	};

	var _moveTo = proto.moveTo;

	proto.moveTo = function (x, y) {
		var dx = Math.abs(this.position.x - x);
		var dy = Math.abs(this.position.y - y);
		var canHackGoTo =
			this.layout.dragItemCount &&
			!this.isPlacing &&
			!this.isTransitioning &&
			dx < 1 &&
			dy < 1;

		if (canHackGoTo) {
			this.goTo(x, y);
			return;
		}

		_moveTo.apply(this, arguments);
	};

	proto.enablePlacing = function () {
		this.removeTransitionStyles();

		if (this.isTransitioning && transformProperty) {
			this.element.style[transformProperty] = "none";
		}

		this.isTransitioning = false;
		this.getSize();

		this.layout._setRectSize(this.element, this.rect);

		this.isPlacing = true;
	};

	proto.disablePlacing = function () {
		this.isPlacing = false;
	};

	proto.removeElem = function () {
		this.element.parentNode.removeChild(this.element);
		this.layout.packer.addSpace(this.rect);
		this.emitEvent("remove", [this]);
	};

	proto.showDropPlaceholder = function () {
		var dropPlaceholder = this.dropPlaceholder;

		if (!dropPlaceholder) {
			dropPlaceholder = this.dropPlaceholder = document.createElement(
				"div"
			);
			dropPlaceholder.className = "packery-drop-placeholder";
			dropPlaceholder.style.position = "absolute";
		}

		dropPlaceholder.style.width = this.size.width + "px";
		dropPlaceholder.style.height = this.size.height + "px";
		this.positionDropPlaceholder();
		this.layout.element.appendChild(dropPlaceholder);
	};

	proto.positionDropPlaceholder = function () {
		this.dropPlaceholder.style[transformProperty] =
			"translate(" + this.rect.x + "px, " + this.rect.y + "px)";
	};

	proto.hideDropPlaceholder = function () {
		var parent = this.dropPlaceholder.parentNode;

		if (parent) {
			parent.removeChild(this.dropPlaceholder);
		}
	};

	return Item;
});

(function(window, factory) {
	window.Packery = factory(
		window.getSize,
		window.Outlayer,
		window.Packery.Rect,
		window.Packery.Packer,
		window.Packery.Item
	);
})("undefined" !== typeof window ? window : this, function factory(
	getSize,
	Outlayer,
	Rect,
	Packer,
	Item
) {
	"use strict";

	Rect.prototype.canFit = function (rect) {
		return this.width >= rect.width - 1 && this.height >= rect.height - 1;
	};

	var Packery = Outlayer.create("packery");
	Packery.Item = Item;
	var proto = Packery.prototype;

	proto._create = function () {
		Outlayer.prototype._create.call(this);

		this.packer = new Packer();
		this.shiftPacker = new Packer();
		this.isEnabled = true;
		this.dragItemCount = 0;

		var _this = this;

		this.handleDraggabilly = {
			dragStart: function dragStart() {
				_this.itemDragStart(this.element);
			},
			dragMove: function dragMove() {
				_this.itemDragMove(
					this.element,
					this.position.x,
					this.position.y
				);
			},
			dragEnd: function dragEnd() {
				_this.itemDragEnd(this.element);
			}
		};
		this.handleUIDraggable = {
			start: function handleUIDraggableStart(event, ui) {
				if (!ui) {
					return;
				}

				_this.itemDragStart(event.currentTarget);
			},
			drag: function handleUIDraggableDrag(event, ui) {
				if (!ui) {
					return;
				}

				_this.itemDragMove(
					event.currentTarget,
					ui.position.left,
					ui.position.top
				);
			},
			stop: function handleUIDraggableStop(event, ui) {
				if (!ui) {
					return;
				}

				_this.itemDragEnd(event.currentTarget);
			}
		};
	};

	proto._resetLayout = function () {
		this.getSize();

		this._getMeasurements();

		var width, height, sortDirection;

		if (this._getOption("horizontal")) {
			width = Infinity;
			height = this.size.innerHeight + this.gutter;
			sortDirection = "rightwardTopToBottom";
		} else {
			width = this.size.innerWidth + this.gutter;
			height = Infinity;
			sortDirection = "downwardLeftToRight";
		}

		this.packer.width = this.shiftPacker.width = width;
		this.packer.height = this.shiftPacker.height = height;
		this.packer.sortDirection = this.shiftPacker.sortDirection = sortDirection;
		this.packer.reset();
		this.maxY = 0;
		this.maxX = 0;
	};

	proto._getMeasurements = function () {
		this._getMeasurement("columnWidth", "width");

		this._getMeasurement("rowHeight", "height");

		this._getMeasurement("gutter", "width");
	};

	proto._getItemLayoutPosition = function (item) {
		this._setRectSize(item.element, item.rect);

		if (this.isShifting || this.dragItemCount > 0) {
			var packMethod = this._getPackMethod();

			this.packer[packMethod](item.rect);
		} else {
			this.packer.pack(item.rect);
		}

		this._setMaxXY(item.rect);

		return item.rect;
	};

	proto.shiftLayout = function () {
		this.isShifting = true;
		this.layout();
		delete this.isShifting;
	};

	proto._getPackMethod = function () {
		return this._getOption("horizontal") ? "rowPack" : "columnPack";
	};

	proto._setMaxXY = function (rect) {
		this.maxX = Math.max(rect.x + rect.width, this.maxX);
		this.maxY = Math.max(rect.y + rect.height, this.maxY);
	};

	proto._setRectSize = function (elem, rect) {
		var size = getSize(elem);
		var w = size.outerWidth;
		var h = size.outerHeight;

		if (w || h) {
			w = this._applyGridGutter(w, this.columnWidth);
			h = this._applyGridGutter(h, this.rowHeight);
		}

		rect.width = Math.min(w, this.packer.width);
		rect.height = Math.min(h, this.packer.height);
	};

	proto._applyGridGutter = function (measurement, gridSize) {
		if (!gridSize) {
			return measurement + this.gutter;
		}

		gridSize += this.gutter;
		var remainder = measurement % gridSize;
		var mathMethod = remainder && remainder < 1 ? "round" : "ceil";
		measurement = Math[mathMethod](measurement / gridSize) * gridSize;
		return measurement;
	};

	proto._getContainerSize = function () {
		if (this._getOption("horizontal")) {
			return {
				width: this.maxX - this.gutter
			};
		} else {
			return {
				height: this.maxY - this.gutter
			};
		}
	};

	proto._manageStamp = function (elem) {
		var item = this.getItem(elem);
		var rect;

		if (item && item.isPlacing) {
			rect = item.rect;
		} else {
			var offset = this._getElementOffset(elem);

			rect = new Rect({
				x: this._getOption("originLeft") ? offset.left : offset.right,
				y: this._getOption("originTop") ? offset.top : offset.bottom
			});
		}

		this._setRectSize(elem, rect);

		this.packer.placed(rect);

		this._setMaxXY(rect);
	};

	function verticalSorter(a, b) {
		return a.position.y - b.position.y || a.position.x - b.position.x;
	}

	function horizontalSorter(a, b) {
		return a.position.x - b.position.x || a.position.y - b.position.y;
	}

	proto.sortItemsByPosition = function () {
		var sorter = this._getOption("horizontal")
			? horizontalSorter
			: verticalSorter;
		this.items.sort(sorter);
	};

	proto.fit = function (elem, x, y) {
		var item = this.getItem(elem);

		if (!item) {
			return;
		}

		this.stamp(item.element);
		item.enablePlacing();
		this.updateShiftTargets(item);
		x = x === undefined ? item.rect.x : x;
		y = y === undefined ? item.rect.y : y;
		this.shift(item, x, y);

		this._bindFitEvents(item);

		item.moveTo(item.rect.x, item.rect.y);
		this.shiftLayout();
		this.unstamp(item.element);
		this.sortItemsByPosition();
		item.disablePlacing();
	};

	proto._bindFitEvents = function (item) {
		var _this = this;

		var ticks = 0;

		function onLayout() {
			ticks++;

			if (ticks !== 2) {
				return;
			}

			_this.dispatchEvent("fitComplete", null, [item]);
		}

		item.once("layout", onLayout);
		this.once("layoutComplete", onLayout);
	};

	proto.resize = function () {
		if (!this.isResizeBound || !this.needsResizeLayout()) {
			return;
		}

		if (this.options.shiftPercentResize) {
			this.resizeShiftPercentLayout();
		} else {
			this.layout();
		}
	};

	proto.needsResizeLayout = function () {
		var size = getSize(this.element);
		var innerSize = this._getOption("horizontal")
			? "innerHeight"
			: "innerWidth";
		return size[innerSize] !== this.size[innerSize];
	};

	proto.resizeShiftPercentLayout = function () {
		var items = this._getItemsForLayout(this.items);

		var isHorizontal = this._getOption("horizontal");

		var coord = isHorizontal ? "y" : "x";
		var measure = isHorizontal ? "height" : "width";
		var segmentName = isHorizontal ? "rowHeight" : "columnWidth";
		var innerSize = isHorizontal ? "innerHeight" : "innerWidth";
		var previousSegment = this[segmentName];
		previousSegment = previousSegment && previousSegment + this.gutter;

		if (previousSegment) {
			this._getMeasurements();

			var currentSegment = this[segmentName] + this.gutter;
			items.forEach(function(item) {
				var seg = Math.round(item.rect[coord] / previousSegment);
				item.rect[coord] = seg * currentSegment;
			});
		} else {
			var currentSize = getSize(this.element)[innerSize] + this.gutter;
			var previousSize = this.packer[measure];
			items.forEach(function(item) {
				item.rect[coord] =
					(item.rect[coord] / previousSize) * currentSize;
			});
		}

		this.shiftLayout();
	};

	proto.itemDragStart = function (elem) {
		if (!this.isEnabled) {
			return;
		}

		this.stamp(elem);
		var item = this.getItem(elem);

		if (!item) {
			return;
		}

		item.enablePlacing();
		item.showDropPlaceholder();
		this.dragItemCount++;
		this.updateShiftTargets(item);
	};

	proto.updateShiftTargets = function (dropItem) {
		this.shiftPacker.reset();

		this._getBoundingRect();

		var isOriginLeft = this._getOption("originLeft");

		var isOriginTop = this._getOption("originTop");

		this.stamps.forEach(function(stamp) {
			var item = this.getItem(stamp);

			if (item && item.isPlacing) {
				return;
			}

			var offset = this._getElementOffset(stamp);

			var rect = new Rect({
				x: isOriginLeft ? offset.left : offset.right,
				y: isOriginTop ? offset.top : offset.bottom
			});

			this._setRectSize(stamp, rect);

			this.shiftPacker.placed(rect);
		}, this);

		var isHorizontal = this._getOption("horizontal");

		var segmentName = isHorizontal ? "rowHeight" : "columnWidth";
		var measure = isHorizontal ? "height" : "width";
		this.shiftTargetKeys = [];
		this.shiftTargets = [];
		var boundsSize;
		var segment = this[segmentName];
		segment = segment && segment + this.gutter;

		if (segment) {
			var segmentSpan = Math.ceil(dropItem.rect[measure] / segment);
			var segs = Math.floor(
				(this.shiftPacker[measure] + this.gutter) / segment
			);
			boundsSize = (segs - segmentSpan) * segment;

			for (var i = 0; i < segs; i++) {
				var initialX = isHorizontal ? 0 : i * segment;
				var initialY = isHorizontal ? i * segment : 0;

				this._addShiftTarget(initialX, initialY, boundsSize);
			}
		} else {
			boundsSize =
				this.shiftPacker[measure] +
				this.gutter -
				dropItem.rect[measure];

			this._addShiftTarget(0, 0, boundsSize);
		}

		var items = this._getItemsForLayout(this.items);

		var packMethod = this._getPackMethod();

		items.forEach(function(item) {
			var rect = item.rect;

			this._setRectSize(item.element, rect);

			this.shiftPacker[packMethod](rect);

			this._addShiftTarget(rect.x, rect.y, boundsSize);

			var cornerX = isHorizontal ? rect.x + rect.width : rect.x;
			var cornerY = isHorizontal ? rect.y : rect.y + rect.height;

			this._addShiftTarget(cornerX, cornerY, boundsSize);

			if (segment) {
				var segSpan = Math.round(rect[measure] / segment);

				for (var i = 1; i < segSpan; i++) {
					var segX = isHorizontal ? cornerX : rect.x + segment * i;
					var segY = isHorizontal ? rect.y + segment * i : cornerY;

					this._addShiftTarget(segX, segY, boundsSize);
				}
			}
		}, this);
	};

	proto._addShiftTarget = function (x, y, boundsSize) {
		var checkCoord = this._getOption("horizontal") ? y : x;

		if (checkCoord !== 0 && checkCoord > boundsSize) {
			return;
		}

		var key = x + "," + y;
		var hasKey = this.shiftTargetKeys.indexOf(key) !== -1;

		if (hasKey) {
			return;
		}

		this.shiftTargetKeys.push(key);
		this.shiftTargets.push({
			x: x,
			y: y
		});
	};

	proto.shift = function (item, x, y) {
		var shiftPosition;
		var minDistance = Infinity;
		var position = {
			x: x,
			y: y
		};
		this.shiftTargets.forEach(function(target) {
			var distance = getDistance(target, position);

			if (distance < minDistance) {
				shiftPosition = target;
				minDistance = distance;
			}
		});
		item.rect.x = shiftPosition.x;
		item.rect.y = shiftPosition.y;
	};

	function getDistance(a, b) {
		var dx = b.x - a.x;
		var dy = b.y - a.y;
		return Math.sqrt(dx * dx + dy * dy);
	}

	var DRAG_THROTTLE_TIME = 120;

	proto.itemDragMove = function (elem, x, y) {
		var item = this.isEnabled && this.getItem(elem);

		if (!item) {
			return;
		}

		x -= this.size.paddingLeft;
		y -= this.size.paddingTop;

		var _this = this;

		function onDrag() {
			_this.shift(item, x, y);

			item.positionDropPlaceholder();

			_this.layout();
		}

		var now = new Date();

		if (
			this._itemDragTime &&
			now - this._itemDragTime < DRAG_THROTTLE_TIME
		) {
			clearTimeout(this.dragTimeout);
			this.dragTimeout = setTimeout(onDrag, DRAG_THROTTLE_TIME);
		} else {
			onDrag();
			this._itemDragTime = now;
		}
	};

	proto.itemDragEnd = function (elem) {
		var item = this.isEnabled && this.getItem(elem);

		if (!item) {
			return;
		}

		clearTimeout(this.dragTimeout);
		item.element.classList.add("is-positioning-post-drag");
		var completeCount = 0;

		var _this = this;

		function onDragEndLayoutComplete() {
			completeCount++;

			if (completeCount !== 2) {
				return;
			}

			item.element.classList.remove("is-positioning-post-drag");
			item.hideDropPlaceholder();

			_this.dispatchEvent("dragItemPositioned", null, [item]);
		}

		item.once("layout", onDragEndLayoutComplete);
		this.once("layoutComplete", onDragEndLayoutComplete);
		item.moveTo(item.rect.x, item.rect.y);
		this.layout();
		this.dragItemCount = Math.max(0, this.dragItemCount - 1);
		this.sortItemsByPosition();
		item.disablePlacing();
		this.unstamp(item.element);
	};

	proto.bindDraggabillyEvents = function (draggie) {
		this._bindDraggabillyEvents(draggie, "on");
	};

	proto.unbindDraggabillyEvents = function (draggie) {
		this._bindDraggabillyEvents(draggie, "off");
	};

		proto._bindDraggabillyEvents = function (draggie, method) {
			var handlers = this.handleDraggabilly;
			draggie[method]('dragStart', handlers.dragStart);
			draggie[method]('dragMove', handlers.dragMove);
			draggie[method]('dragEnd', handlers.dragEnd);
		};

	proto.bindUIDraggableEvents = function ($elems) {
		this._bindUIDraggableEvents($elems, "on");
	};

	proto.unbindUIDraggableEvents = function ($elems) {
		this._bindUIDraggableEvents($elems, "off");
	};

	proto._bindUIDraggableEvents = function ($elems, method) {
		var handlers = this.handleUIDraggable;
		$elems[method]("dragstart", handlers.start)
			[method]("drag", handlers.drag)
			[method]("dragstop", handlers.stop);
	};

	var _destroy = proto.destroy;

	proto.destroy = function () {
		_destroy.apply(this, arguments);

		this.isEnabled = false;
	};

	Packery.Rect = Rect;
	Packery.Packer = Packer;
	return Packery;
});

/*!
 * modified imagesLoaded PACKAGED v4.1.1
 * JavaScript is all like "You images are done yet or what?"
 * MIT License
 * removed module check
 * exposed as window property
 * passes jshint
 */

(function(root, factory) {
	root.EvEmitter = factory();
})("undefined" !== typeof window ? window : this, function () {
	function EvEmitter() {}

	var proto = EvEmitter.prototype;

	proto.on = function (eventName, listener) {
		if (!eventName || !listener) {
			return;
		}

		var events = (this._events = this._events || {});
		var listeners = (events[eventName] = events[eventName] || []);

		if (listeners.indexOf(listener) === -1) {
			listeners.push(listener);
		}

		return this;
	};

	proto.once = function (eventName, listener) {
		if (!eventName || !listener) {
			return;
		}

		this.on(eventName, listener);
		var onceEvents = (this._onceEvents = this._onceEvents || {});
		var onceListeners = (onceEvents[eventName] =
			onceEvents[eventName] || {});
		onceListeners[listener] = true;
		return this;
	};

	proto.off = function (eventName, listener) {
		var listeners = this._events && this._events[eventName];

		if (!listeners || !listeners.length) {
			return;
		}

		var index = listeners.indexOf(listener);

		if (index !== -1) {
			listeners.splice(index, 1);
		}

		return this;
	};

	proto.emitEvent = function (eventName, args) {
		var listeners = this._events && this._events[eventName];

		if (!listeners || !listeners.length) {
			return;
		}

		var i = 0;
		var listener = listeners[i];
		args = args || [];
		var onceListeners = this._onceEvents && this._onceEvents[eventName];

		while (listener) {
			var isOnce = onceListeners && onceListeners[listener];

			if (isOnce) {
				this.off(eventName, listener);
				delete onceListeners[listener];
			}

			listener.apply(this, args);
			i += isOnce ? 0 : 1;
			listener = listeners[i];
		}

		return this;
	};

	return EvEmitter;
});

(function(window, factory) {
	"use strict";

	window.imagesLoaded = factory(window, window.EvEmitter);
})("undefined" !== typeof window ? window : this, function factory(
	window,
	EvEmitter
) {
	var $ = window.jQuery;
	var console = window.console;

	function extend(a, b) {
		for (var prop in b) {
			if (b.hasOwnProperty(prop)) {
				a[prop] = b[prop];
			}
		}

		return a;
	}

	function makeArray(obj) {
		var ary = [];

		if (Array.isArray(obj)) {
			ary = obj;
		} else if (typeof obj.length === "number") {
			for (var i = 0; i < obj.length; i++) {
				ary.push(obj[i]);
			}
		} else {
			ary.push(obj);
		}

		return ary;
	}

	function ImagesLoaded(elem, options, onAlways) {
		if (!(this instanceof ImagesLoaded)) {
			return new ImagesLoaded(elem, options, onAlways);
		}

		if (typeof elem === "string") {
			elem = document.querySelectorAll(elem);
		}

		this.elements = makeArray(elem);
		this.options = extend({}, this.options);

		if (typeof options === "function") {
			onAlways = options;
		} else {
			extend(this.options, options);
		}

		if (onAlways) {
			this.on("always", onAlways);
		}

		this.getImages();

		if ($) {
			this.jqDeferred = new $.Deferred();
		}

		setTimeout(
			function() {
				this.check();
			}.bind(this)
		);
	}

	ImagesLoaded.prototype = Object.create(EvEmitter.prototype);
	ImagesLoaded.prototype.options = {};

	ImagesLoaded.prototype.getImages = function () {
		this.images = [];
		this.elements.forEach(this.addElementImages, this);
	};

	ImagesLoaded.prototype.addElementImages = function (elem) {
		if (elem.nodeName === "img") {
			this.addImage(elem);
		}

		if (this.options.background === true) {
			this.addElementBackgroundImages(elem);
		}

		var nodeType = elem.nodeType;

		if (!nodeType || !elementNodeTypes[nodeType]) {
			return;
		}

		var childImgs = elem.querySelectorAll("img");

		for (var i = 0; i < childImgs.length; i++) {
			var img = childImgs[i];
			this.addImage(img);
		}

		if (typeof this.options.background === "string") {
			var children = elem.querySelectorAll(this.options.background);

			for (i = 0; i < children.length; i++) {
				var child = children[i];
				this.addElementBackgroundImages(child);
			}
		}
	};

	var elementNodeTypes = {
		1: true,
		9: true,
		11: true
	};

	ImagesLoaded.prototype.addElementBackgroundImages = function (elem) {
		var style = getComputedStyle(elem);

		if (!style) {
			return;
		}

		var reURL = /url\((['"])?(.*?)\1\)/gi;
		var matches = reURL.exec(style.backgroundImage);

		while (matches !== null) {
			var url = matches && matches[2];

			if (url) {
				this.addBackground(url, elem);
			}

			matches = reURL.exec(style.backgroundImage);
		}
	};

	ImagesLoaded.prototype.addImage = function (img) {
		var loadingImage = new LoadingImage(img);
		this.images.push(loadingImage);
	};

	ImagesLoaded.prototype.addBackground = function (url, elem) {
		var background = new Background(url, elem);
		this.images.push(background);
	};

	ImagesLoaded.prototype.check = function () {
		var _this = this;

		this.progressedCount = 0;
		this.hasAnyBroken = false;

		if (!this.images.length) {
			this.complete();
			return;
		}

		function onProgress(image, elem, message) {
			setTimeout(function () {
				_this.progress(image, elem, message);
			});
		}

		this.images.forEach(function(loadingImage) {
			loadingImage.once("progress", onProgress);
			loadingImage.check();
		});
	};

	ImagesLoaded.prototype.progress = function (image, elem, message) {
		this.progressedCount++;
		this.hasAnyBroken = this.hasAnyBroken || !image.isLoaded;
		this.emitEvent("progress", [this, image, elem]);

		if (this.jqDeferred && this.jqDeferred.notify) {
			this.jqDeferred.notify(this, image);
		}

		if (this.progressedCount === this.images.length) {
			this.complete();
		}

		if (this.options.debug && console) {
			console.log("progress: " + message, image, elem);
		}
	};

	ImagesLoaded.prototype.complete = function () {
		var eventName = this.hasAnyBroken ? "fail" : "done";
		this.isComplete = true;
		this.emitEvent(eventName, [this]);
		this.emitEvent("always", [this]);

		if (this.jqDeferred) {
			var jqMethod = this.hasAnyBroken ? "reject" : "resolve";
			this.jqDeferred[jqMethod](this);
		}
	};

	function LoadingImage(img) {
		this.img = img;
	}

	LoadingImage.prototype = Object.create(EvEmitter.prototype);

	LoadingImage.prototype.check = function () {
		var isComplete = this.getIsImageComplete();

		if (isComplete) {
			this.confirm(this.img.naturalWidth !== 0, "naturalWidth");
			return;
		}

		this.proxyImage = new Image();
		this.proxyImage.addEventListener("load", this);
		this.proxyImage.addEventListener("error", this);
		this.img.addEventListener("load", this);
		this.img.addEventListener("error", this);
		this.proxyImage.src = this.img.src;
	};

	LoadingImage.prototype.getIsImageComplete = function () {
		return this.img.complete && this.img.naturalWidth !== undefined;
	};

	LoadingImage.prototype.confirm = function (isLoaded, message) {
		this.isLoaded = isLoaded;
		this.emitEvent("progress", [this, this.img, message]);
	};

	LoadingImage.prototype.handleEvent = function (event) {
		var method = "on" + event.type;

		if (this[method]) {
			this[method](event);
		}
	};

	LoadingImage.prototype.onload = function () {
		this.confirm(true, "onload");
		this.unbindEvents();
	};

	LoadingImage.prototype.onerror = function () {
		this.confirm(false, "onerror");
		this.unbindEvents();
	};

	LoadingImage.prototype.unbindEvents = function () {
		this.proxyImage.removeEventListener("load", this);
		this.proxyImage.removeEventListener("error", this);
		this.img.removeEventListener("load", this);
		this.img.removeEventListener("error", this);
	};

	function Background(url, element) {
		this.url = url;
		this.element = element;
		this.img = new Image();
	}

	Background.prototype = Object.create(LoadingImage.prototype);

	Background.prototype.check = function () {
		this.img.addEventListener("load", this);
		this.img.addEventListener("error", this);
		this.img.src = this.url;
		var isComplete = this.getIsImageComplete();

		if (isComplete) {
			this.confirm(this.img.naturalWidth !== 0, "naturalWidth");
			this.unbindEvents();
		}
	};

	Background.prototype.unbindEvents = function () {
		this.img.removeEventListener("load", this);
		this.img.removeEventListener("error", this);
	};

	Background.prototype.confirm = function (isLoaded, message) {
		this.isLoaded = isLoaded;
		this.emitEvent("progress", [this, this.element, message]);
	};

	ImagesLoaded.makeJQueryPlugin = function (jQuery) {
		jQuery = jQuery || window.jQuery;

		if (!jQuery) {
			return;
		}

		$ = jQuery;

		$.fn.imagesLoaded = function (options, callback) {
			var instance = new ImagesLoaded(this, options, callback);
			return instance.jqDeferred.promise($(this));
		};
	};

	ImagesLoaded.makeJQueryPlugin();
	return ImagesLoaded;
});

var _extends =
	Object.assign ||
	function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];

			for (var key in source) {
				if (Object.prototype.hasOwnProperty.call(source, key)) {
					target[key] = source[key];
				}
			}
		}

		return target;
	};

var LazyLoad = (function () {
	"use strict";

	var defaultSettings = {
		elements_selector: "img",
		container: document,
		threshold: 300,
		thresholds: null,
		data_src: "src",
		data_srcset: "srcset",
		data_sizes: "sizes",
		data_bg: "bg",
		class_loading: "loading",
		class_loaded: "loaded",
		class_error: "error",
		load_delay: 0,
		callback_load: null,
		callback_error: null,
		callback_set: null,
		callback_enter: null,
		callback_finish: null,
		to_webp: false
	};

	var getInstanceSettings = function getInstanceSettings(customSettings) {
		return _extends({}, defaultSettings, customSettings);
	};

	var dataPrefix = "data-";
	var processedDataName = "was-processed";
	var timeoutDataName = "ll-timeout";
	var trueString = "true";

	var getData = function getData(element, attribute) {
		return element.getAttribute(dataPrefix + attribute);
	};

	var setData = function setData(element, attribute, value) {
		var attrName = dataPrefix + attribute;

		if (value === null) {
			element.removeAttribute(attrName);
			return;
		}

		element.setAttribute(attrName, value);
	};

	var setWasProcessedData = function setWasProcessedData(element) {
		return setData(element, processedDataName, trueString);
	};

	var getWasProcessedData = function getWasProcessedData(element) {
		return getData(element, processedDataName) === trueString;
	};

	var setTimeoutData = function setTimeoutData(element, value) {
		return setData(element, timeoutDataName, value);
	};

	var getTimeoutData = function getTimeoutData(element) {
		return getData(element, timeoutDataName);
	};

	var purgeProcessedElements = function purgeProcessedElements(elements) {
		return elements.filter(function(element) {
			return !getWasProcessedData(element);
		});
	};

	var purgeOneElement = function purgeOneElement(elements, elementToPurge) {
		return elements.filter(function(element) {
			return element !== elementToPurge;
		});
	};
/* Creates instance and notifies it through the window element */

	var createInstance = function createInstance(classObj, options) {
		var event;
		var eventString = "LazyLoad::Initialized";
		var instance = new classObj(options);

		try {
			// Works in modern browsers
			event = new CustomEvent(eventString, {
				detail: {
					instance: instance
				}
			});
		} catch (err) {
			// Works in Internet Explorer (all versions)
			event = document.createEvent("CustomEvent");
			event.initCustomEvent(eventString, false, false, {
				instance: instance
			});
		}

		window.dispatchEvent(event);
	};
/* Auto initialization of one or more instances of lazyload, depending on the
	  options passed in (plain object or an array) */

	function autoInitialize(classObj, options) {
		if (!options) {
			return;
		}

		if (!options.length) {
			// Plain object
			createInstance(classObj, options);
		} else {
			// Array of objects
			for (var i = 0, optionsItem; (optionsItem = options[i]); i += 1) {
				createInstance(classObj, optionsItem);
			}
		}
	}

	var replaceExtToWebp = function replaceExtToWebp(value, condition) {
		return condition ? value.replace(/\.(jpe?g|png)/gi, ".webp") : value;
	};

	var detectWebp = function detectWebp() {
		var webpString = "image/webp";
		var canvas = document.createElement("canvas");

		if (canvas.getContext && canvas.getContext("2d")) {
			return (
				canvas.toDataURL(webpString).indexOf("data:" + webpString) === 0
			);
		}

		return false;
	};

	var runningOnBrowser = typeof window !== "undefined";
	var isBot =
		(runningOnBrowser && !("onscroll" in window)) ||
		/(gle|ing|ro)bot|crawl|spider/i.test(navigator.userAgent);
	var supportsIntersectionObserver =
		runningOnBrowser && "IntersectionObserver" in window;
	var supportsClassList =
		runningOnBrowser && "classList" in document.createElement("p");
	var supportsWebp = runningOnBrowser && detectWebp();

	var setSourcesInChildren = function setSourcesInChildren(
		parentTag,
		attrName,
		dataAttrName,
		toWebpFlag
	) {
		for (var i = 0, childTag; (childTag = parentTag.children[i]); i += 1) {
			if (childTag.tagName === "SOURCE") {
				var attrValue = getData(childTag, dataAttrName);
				setAttributeIfValue(childTag, attrName, attrValue, toWebpFlag);
			}
		}
	};

	var setAttributeIfValue = function setAttributeIfValue(
		element,
		attrName,
		value,
		toWebpFlag
	) {
		if (!value) {
			return;
		}

		element.setAttribute(attrName, replaceExtToWebp(value, toWebpFlag));
	};

	var setSourcesImg = function setSourcesImg(element, settings) {
		var toWebpFlag = supportsWebp && settings.to_webp;
		var srcsetDataName = settings.data_srcset;
		var parent = element.parentNode;

		if (parent && parent.tagName === "PICTURE") {
			setSourcesInChildren(parent, "srcset", srcsetDataName, toWebpFlag);
		}

		var sizesDataValue = getData(element, settings.data_sizes);
		setAttributeIfValue(element, "sizes", sizesDataValue);
		var srcsetDataValue = getData(element, srcsetDataName);
		setAttributeIfValue(element, "srcset", srcsetDataValue, toWebpFlag);
		var srcDataValue = getData(element, settings.data_src);
		setAttributeIfValue(element, "src", srcDataValue, toWebpFlag);
	};

	var setSourcesIframe = function setSourcesIframe(element, settings) {
		var srcDataValue = getData(element, settings.data_src);
		setAttributeIfValue(element, "src", srcDataValue);
	};

	var setSourcesVideo = function setSourcesVideo(element, settings) {
		var srcDataName = settings.data_src;
		var srcDataValue = getData(element, srcDataName);
		setSourcesInChildren(element, "src", srcDataName);
		setAttributeIfValue(element, "src", srcDataValue);
		element.load();
	};

	var setSourcesBgImage = function setSourcesBgImage(element, settings) {
		var toWebpFlag = supportsWebp && settings.to_webp;
		var srcDataValue = getData(element, settings.data_src);
		var bgDataValue = getData(element, settings.data_bg);

		if (srcDataValue) {
			var setValue = replaceExtToWebp(srcDataValue, toWebpFlag);
			element.style.backgroundImage = 'url("' + setValue + '")';
		}

		if (bgDataValue) {
			var _setValue = replaceExtToWebp(bgDataValue, toWebpFlag);

			element.style.backgroundImage = _setValue;
		}
	};

	var setSourcesFunctions = {
		IMG: setSourcesImg,
		IFRAME: setSourcesIframe,
		VIDEO: setSourcesVideo
	};

	var setSources = function setSources(element, instance) {
		var settings = instance._settings;
		var tagName = element.tagName;
		var setSourcesFunction = setSourcesFunctions[tagName];

		if (setSourcesFunction) {
			setSourcesFunction(element, settings);

			instance._updateLoadingCount(1);

			instance._elements = purgeOneElement(instance._elements, element);
			return;
		}

		setSourcesBgImage(element, settings);
	};

	var addClass = function addClass(element, className) {
		if (supportsClassList) {
			element.classList.add(className);
			return;
		}

		element.className += (element.className ? " " : "") + className;
	};

	var removeClass = function removeClass(element, className) {
		if (supportsClassList) {
			element.classList.remove(className);
			return;
		}

		element.className = element.className
			.replace(new RegExp("(^|\\s+)" + className + "(\\s+|$)"), " ")
			.replace(/^\s+/, "")
			.replace(/\s+$/, "");
	};

	var callbackIfSet = function callbackIfSet(callback, argument) {
		if (callback) {
			callback(argument);
		}
	};

	var genericLoadEventName = "load";
	var mediaLoadEventName = "loadeddata";
	var errorEventName = "error";

	var addEventListener = function addEventListener(
		element,
		eventName,
		handler
	) {
		element.addEventListener(eventName, handler);
	};

	var removeEventListener = function removeEventListener(
		element,
		eventName,
		handler
	) {
		element.removeEventListener(eventName, handler);
	};

	var addEventListeners = function addEventListeners(
		element,
		loadHandler,
		errorHandler
	) {
		addEventListener(element, genericLoadEventName, loadHandler);
		addEventListener(element, mediaLoadEventName, loadHandler);
		addEventListener(element, errorEventName, errorHandler);
	};

	var removeEventListeners = function removeEventListeners(
		element,
		loadHandler,
		errorHandler
	) {
		removeEventListener(element, genericLoadEventName, loadHandler);
		removeEventListener(element, mediaLoadEventName, loadHandler);
		removeEventListener(element, errorEventName, errorHandler);
	};

	var eventHandler = function eventHandler(event, success, instance) {
		var settings = instance._settings;
		var className = success ? settings.class_loaded : settings.class_error;
		var callback = success
			? settings.callback_load
			: settings.callback_error;
		var element = event.target;
		removeClass(element, settings.class_loading);
		addClass(element, className);
		callbackIfSet(callback, element);

		instance._updateLoadingCount(-1);
	};

	var addOneShotEventListeners = function addOneShotEventListeners(
		element,
		instance
	) {
		var loadHandler = function loadHandler(event) {
			eventHandler(event, true, instance);
			removeEventListeners(element, loadHandler, errorHandler);
		};

		var errorHandler = function errorHandler(event) {
			eventHandler(event, false, instance);
			removeEventListeners(element, loadHandler, errorHandler);
		};

		addEventListeners(element, loadHandler, errorHandler);
	};

	var managedTags = ["IMG", "IFRAME", "VIDEO"];

	var loadAndUnobserve = function loadAndUnobserve(
		element,
		observer,
		instance
	) {
		revealElement(element, instance);
		observer.unobserve(element);
	};

	var cancelDelayLoad = function cancelDelayLoad(element) {
		var timeoutId = getTimeoutData(element);

		if (!timeoutId) {
			return; // do nothing if timeout doesn't exist
		}

		clearTimeout(timeoutId);
		setTimeoutData(element, null);
	};

	var delayLoad = function delayLoad(element, observer, instance) {
		var loadDelay = instance._settings.load_delay;
		var timeoutId = getTimeoutData(element);

		if (timeoutId) {
			return; // do nothing if timeout already set
		}

		timeoutId = setTimeout(function () {
			loadAndUnobserve(element, observer, instance);
			cancelDelayLoad(element);
		}, loadDelay);
		setTimeoutData(element, timeoutId);
	};

	function revealElement(element, instance, force) {
		var settings = instance._settings;

		if (!force && getWasProcessedData(element)) {
			return; // element has already been processed and force wasn't true
		}

		callbackIfSet(settings.callback_enter, element);

		if (managedTags.indexOf(element.tagName) > -1) {
			addOneShotEventListeners(element, instance);
			addClass(element, settings.class_loading);
		}

		setSources(element, instance);
		setWasProcessedData(element);
		callbackIfSet(settings.callback_set, element);
	}
/* entry.isIntersecting needs fallback because is null on some versions of MS Edge, and
	 entry.intersectionRatio is not enough alone because it could be 0 on some intersecting elements */

	var isIntersecting = function isIntersecting(entry) {
		return entry.isIntersecting || entry.intersectionRatio > 0;
	};

	var getObserverSettings = function getObserverSettings(settings) {
		return {
			root: settings.container === document ? null : settings.container,
			rootMargin: settings.thresholds || settings.threshold + "px"
		};
	};

	var LazyLoad = function LazyLoad(customSettings, elements) {
		this._settings = getInstanceSettings(customSettings);

		this._setObserver();

		this._loadingCount = 0;
		this.update(elements);
	};

	LazyLoad.prototype = {
		_manageIntersection: function _manageIntersection(entry) {
			var observer = this._observer;
			var loadDelay = this._settings.load_delay;
			var element = entry.target; // WITHOUT LOAD DELAY

			if (!loadDelay) {
				if (isIntersecting(entry)) {
					loadAndUnobserve(element, observer, this);
				}

				return;
			} // WITH LOAD DELAY

			if (isIntersecting(entry)) {
				delayLoad(element, observer, this);
			} else {
				cancelDelayLoad(element);
			}
		},
		_onIntersection: function _onIntersection(entries) {
			entries.forEach(this._manageIntersection.bind(this));
		},
		_setObserver: function _setObserver() {
			if (!supportsIntersectionObserver) {
				return;
			}

			this._observer = new IntersectionObserver(
				this._onIntersection.bind(this),
				getObserverSettings(this._settings)
			);
		},
		_updateLoadingCount: function _updateLoadingCount(plusMinus) {
			this._loadingCount += plusMinus;

			if (this._elements.length === 0 && this._loadingCount === 0) {
				callbackIfSet(this._settings.callback_finish);
			}
		},
		update: function update(elements) {
			var _this = this;

			var settings = this._settings;
			var nodeSet =
				elements ||
				settings.container.querySelectorAll(settings.elements_selector);
			this._elements = purgeProcessedElements(
				Array.prototype.slice.call(nodeSet) // NOTE: nodeset to array for IE compatibility
			);

			if (isBot || !this._observer) {
				this.loadAll();
				return;
			}

			this._elements.forEach(function(element) {
				_this._observer.observe(element);
			});
		},
		destroy: function destroy() {
			var _this2 = this;

			if (this._observer) {
				this._elements.forEach(function(element) {
					_this2._observer.unobserve(element);
				});

				this._observer = null;
			}

			this._elements = null;
			this._settings = null;
		},
		load: function load(element, force) {
			revealElement(element, this, force);
		},
		loadAll: function loadAll() {
			var _this3 = this;

			var elements = this._elements;
			elements.forEach(function(element) {
				_this3.load(element);
			});
		}
	};
/* Automatic instances creation if required (useful for async script loading) */

	if (runningOnBrowser) {
		autoInitialize(LazyLoad, window.lazyLoadOptions);
	}

	return LazyLoad;
})();
