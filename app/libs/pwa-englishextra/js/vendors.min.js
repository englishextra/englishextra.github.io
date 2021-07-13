/*!
 * modified t.js
 * a micro-templating framework in ~400 bytes gzipped
 * @author Jason Mooberry <jasonmoo@me.com>
 * @license MIT
 * @version 0.1.0
 * Simple interpolation: {{=value}}
 * Scrubbed interpolation: {{%unsafe_value}}
 * Name-spaced variables: {{=User.address.city}}
 * If/else blocks: {{value}} <<markup>> {{:value}} <<alternate markup>> {{/value}}
 * If not blocks: {{!value}} <<markup>> {{/!value}}
 * Object/Array iteration: {{@object_value}} {{=_key}}:{{=_val}} {{/@object_value}}
 * Multi-line templates (no removal of newlines required to render)
 * Render the same template multiple times with different data
 * Works in all modern browsers
 * @see {@link https://github.com/loele/t.js/blob/2b3ab7039353cc365fb3463f6df08fd00eb3eb3d/t.js}
 * passes jshint
 */
(function(root) {
	"use strict";

	var _hasOwnProperty = "hasOwnProperty";
	var replace = "replace";
	var blockregex = /\{\{(([@!]?)(.+?))\}\}(([\s\S]+?)(\{\{:\1\}\}([\s\S]+?))?)\{\{\/\1\}\}/g;
	var valregex = /\{\{([=%])(.+?)\}\}/g;

	var t = function t(template) {
		this.t = template;
	};

	function scrub(val) {
		return new Option(val).text[replace](/"/g, "&quot;");
	}

	function get_value(vars, key) {
		var parts = key.split(".");

		while (parts.length) {
			if (!(parts[0] in vars)) {
				return false;
			}

			vars = vars[parts.shift()];
		}

		return vars;
	}

	function render(fragment, vars) {
		return fragment[replace](blockregex, function(
			_,
			__,
			meta,
			key,
			inner,
			if_true,
			has_else,
			if_false
		) {
			var val = get_value(vars, key),
				temp = "",
				i;

			if (!val) {
				if (meta === "!") {
					return render(inner, vars);
				}

				if (has_else) {
					return render(if_false, vars);
				}

				return "";
			}

			if (!meta) {
				return render(if_true, vars);
			}

			if (meta === "@") {
				_ = vars._key;
				__ = vars._val;

				for (i in val) {
					if (val.hasOwnProperty(i)) {
						vars._key = i;
						vars._val = val[i];
						temp += render(inner, vars);
					}
				}

				vars._key = _;
				vars._val = __;
				return temp;
			}
		}).replace(valregex, function(_, meta, key) {
			var val = get_value(vars, key);

			if (val || val === 0) {
				return meta === "%" ? scrub(val) : val;
			}

			return "";
		});
	}

	t.prototype.render = function (vars) {
		return render(this.t, vars);
	};

	root.t = t;
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
		this.el = document.getElementsByClassName(containerClass)[0] || "";
		this.body = this.el ? this.el.getElementsByClassName("body")[0] : "";
		this.content = this.el
			? this.el.getElementsByClassName("content")[0]
			: "";
		this.src = elem.dataset.src || "";
		this.href = elem.getAttribute("href") || "";
		this.dataPaddingBottom = elem.dataset.paddingBottom || "";
		this.dataScrolling = elem.dataset.scrolling || "";
		this.dataTouch = elem.dataset.touch || "";
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

	IframeLightbox.prototype.init = function () {
		var _this = this;

		if (!this.el) {
			this.create();
		}

		var debounce = function debounce(func, wait) {
			var timeout, args, context, timestamp;
			return function () {
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
			!this.trigger.classList.contains(iframeLightboxLinkIsBindedClass)
		) {
			this.trigger.classList.add(iframeLightboxLinkIsBindedClass);

			this.trigger.addEventListener("click", handleIframeLightboxLink);

			if (isTouch && (_this.touch || _this.dataTouch)) {
				this.trigger.addEventListener(
					"touchstart",
					handleIframeLightboxLink
				);
			}
		}
	};

	IframeLightbox.prototype.create = function () {
		var _this = this,
			backdrop = document.createElement("div");

		backdrop.classList.add("backdrop");
		this.el = document.createElement("div");
		this.el.classList.add(containerClass);
		this.el.appendChild(backdrop);
		this.content = document.createElement("div");
		this.content.classList.add("content");
		this.body = document.createElement("div");
		this.body.classList.add("body");
		this.content.appendChild(this.body);
		this.contentHolder = document.createElement("div");
		this.contentHolder.classList.add("content-holder");
		this.contentHolder.appendChild(this.content);
		this.el.appendChild(this.contentHolder);
		this.btnClose = document.createElement("button");
		this.btnClose.classList.add("btn-close");

		this.el.appendChild(this.btnClose);
		docBody.appendChild(this.el);

		backdrop.addEventListener("click", function () {
			_this.close();
		});

		this.btnClose.addEventListener("click", function () {
			_this.close();
		});

		if (!docElem.classList.contains(iframeLightboxWindowIsBindedClass)) {
			docElem.classList.add(iframeLightboxWindowIsBindedClass);

			root.addEventListener("keyup", function(ev) {
				if (27 === (ev.which || ev.keyCode)) {
					_this.close();
				}
			});
		}

		var clearBody = function clearBody() {
			if (_this.isOpen()) {
				return;
			}

			_this.el.classList.remove(isShowingClass);

			_this.body.innerHTML = "";
		};

		this.el.addEventListener("transitionend", clearBody, false);

		this.el.addEventListener("webkitTransitionEnd", clearBody, false);

		this.el.addEventListener("mozTransitionEnd", clearBody, false);

		this.el.addEventListener("msTransitionEnd", clearBody, false);

		this.callCallback(this.onCreated, this);
	};

	IframeLightbox.prototype.loadIframe = function () {
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
		this.body.innerHTML = html.join("");

		(function(iframeId, body) {
			var iframe = document.getElementById(iframeId);

			iframe.onload = function () {
				this.style.opacity = 1;
				body.classList.add(isLoadedClass);

				if (_this.scrolling || _this.dataScrolling) {
					iframe.removeAttribute("scrolling");
					iframe.style.overflow = "scroll";
				} else {
					iframe.setAttribute("scrolling", "no");
					iframe.style.overflow = "hidden";
				}

				_this.callCallback(_this.onIframeLoaded, _this);

				_this.callCallback(_this.onLoaded, _this);
			};
		})(this.iframeId, this.body);
	};

	IframeLightbox.prototype.open = function () {
		this.loadIframe();

		if (this.dataPaddingBottom) {
			this.content.style.paddingBottom = this.dataPaddingBottom;
		} else {
			this.content.removeAttribute("style");
		}

		this.el.classList.add(isShowingClass);
		this.el.classList.add(isOpenedClass);
		docElem.classList.add(iframeLightboxOpenClass);
		docBody.classList.add(iframeLightboxOpenClass);
		this.callCallback(this.onOpened, this);
	};

	IframeLightbox.prototype.close = function () {
		this.el.classList.remove(isOpenedClass);
		this.body.classList.remove(isLoadedClass);
		docElem.classList.remove(iframeLightboxOpenClass);
		docBody.classList.remove(iframeLightboxOpenClass);
		this.callCallback(this.onClosed, this);
	};

	IframeLightbox.prototype.isOpen = function () {
		return this.el.classList.contains(isOpenedClass);
	};

	IframeLightbox.prototype.callCallback = function (func, data) {
		if (typeof func !== "function") {
			return;
		}

		var caller = func.bind(this);
		caller(data);
	};

	root.IframeLightbox = IframeLightbox;
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

/*jslint browser: true */

/*jslint node: true */

/*global global, ActiveXObject, define, escape, module, pnotify, Proxy, jQuery, require, self, setImmediate, window */

/*!
 * modified JavaScript Cookie - v2.1.3
 * @see {@link https://github.com/js-cookie/js-cookie}
 * Copyright 2006, 2015 Klaus Hartl & Fagner Brack
 * Released under the MIT license
 * Cookies.set('name', 'value');
 * Create a cookie that expires 7 days from now, valid across the entire site:
 * Cookies.set('name', 'value', { expires: 7 });
 * Create an expiring cookie, valid to the path of the current page:
 * Cookies.set('name', 'value', { expires: 7, path: '' });
 * Cookies.get('name'); // => 'value'
 * Cookies.get('nothing'); // => undefined
 * Read all visible cookies:
 * Cookies.get(); // => { name: 'value' }
 * Cookies.remove('name');
 * Delete a cookie valid to the path of the current page:
 * Cookies.set('name', 'value', { path: '' });
 * Cookies.remove('name'); // fail!
 * Cookies.remove('name', { path: '' }); // removed!
 * IMPORTANT! when deleting a cookie, you must pass the exact same path
 * and domain attributes that was used to set the cookie,
 * unless you're relying on the default attributes.
 * removed AMD, CJS, ES6 wrapper
 * fixed this
 * @see {@link https://github.com/js-cookie/js-cookie/blob/master/src/js.cookie.js}
 * passes jshint
 */
(function(root) {
	"use strict";

	var Cookies = (function () {
		function extend() {
			var i = 0;
			var result = {};

			for (; i < arguments.length; i++) {
				var attributes = arguments[i];

				for (var key in attributes) {
					if (attributes.hasOwnProperty(key)) {
						result[key] = attributes[key];
					}
				}
			}

			return result;
		}

		function init(converter) {
			var api = function api(key, value, attributes) {
				var _this = this;

				var result;

				if (typeof document === "undefined") {
					return;
				}

				if (arguments.length > 1) {
					attributes = extend(
						{
							path: "/"
						},
						api.defaults,
						attributes
					);

					if (typeof attributes.expires === "number") {
						var expires = new Date();
						expires.setMilliseconds(
							expires.getMilliseconds() +
								attributes.expires * 864e5
						);
						attributes.expires = expires;
					}

					try {
						result = JSON.stringify(value);

						if (/^[\{\[]/.test(result)) {
							value = result;
						}
					} catch (e) {}

					if (!converter.write) {
						value = encodeURIComponent(String(value)).replace(
							/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g,
							decodeURIComponent
						);
					} else {
						value = converter.write(value, key);
					}

					key = encodeURIComponent(String(key));
					key = key.replace(
						/%(23|24|26|2B|5E|60|7C)/g,
						decodeURIComponent
					);
					key = key.replace(/[\(\)]/g, escape);
					var ret = (document.cookie = [
						key,
						"=",
						value,
						attributes.expires
							? "; expires=" + attributes.expires.toUTCString()
							: "",
						attributes.path ? "; path=" + attributes.path : "",
						attributes.domain
							? "; domain=" + attributes.domain
							: "",
						attributes.sameSite
							? "; samesite=" + attributes.sameSite
							: "",
						attributes.secure ? "; secure" : ""
					].join(""));
					return ret;
				}

				if (!key) {
					result = {};
				}

				var cookies = document.cookie
					? document.cookie.split("; ")
					: [];
				var rdecode = /(%[0-9A-Z]{2})+/g;
				var i = 0;

				for (; i < cookies.length; i++) {
					var parts = cookies[i].split("=");
					var cookie = parts.slice(1).join("=");

					if (cookie.charAt(0) === '"') {
						cookie = cookie.slice(1, -1);
					}

					try {
						var name = parts[0].replace(
							rdecode,
							decodeURIComponent
						);
						cookie = converter.read
							? converter.read(cookie, name)
							: converter(cookie, name) ||
							  cookie.replace(rdecode, decodeURIComponent);

						if (_this.json) {
							try {
								cookie = JSON.parse(cookie);
							} catch (e) {}
						}

						if (key === name) {
							result = cookie;
							break;
						}

						if (!key) {
							result[name] = cookie;
						}
					} catch (e) {}
				}

				return result;
			};

			api.set = api;

			api.get = function (key) {
				return api.call(api, key);
			};

			api.getJSON = function () {
				return api.apply(
					{
						json: true
					},
					[].slice.call(arguments)
				);
			};

			api.defaults = {};

			api.remove = function (key, attributes) {
				api(
					key,
					"",
					extend(attributes, {
						expires: -1
					})
				);
			};

			api.withConverter = init;
			return api;
		}

		return init(function () {});
	})();

	root.Cookies = Cookies;
})("undefined" !== typeof window ? window : this);

/*jslint browser: true */

/*jslint node: true */

/*global global, ActiveXObject, define, escape, module, pnotify, Proxy, jQuery, require, self, setImmediate, window */

/*!
 * modified Kamil v0.1.1
 * Autocomplete library - pure JS
 * @see {@link http://oss6.github.io/kamil}
 * MIT License
 * by Ossama Edbali
 * fixed radix parameter - 10
 * @see {@link https://stackoverflow.com/questions/7818903/jslint-says-missing-radix-parameter-what-should-i-do}
 * changed infix operator invocation to normal IIFE
 * @see {@link https://github.com/oss6/kamil/blob/gh-pages/kamil.js}
 * passes jshint
 */
(function(root, document) {
	var defaults = {
		source: null,
		appendTo: null,
		disabled: false,
		autoFocus: false,
		minChars: 1,
		property: null,
		exclude: "kamil-autocomplete-category",
		filter: function filter(text, input) {
			var re = new RegExp($.escapeRegex(input), "i");
			return re.test(text);
		},
		sort: function sort(a, b) {
			var prop = this._opts.property,
				v1 = prop === null ? a.label || a.value || a : a[prop],
				v2 = prop === null ? b.label || b.value || b : b[prop];
			return v1.length - v2.length;
		}
	};
	var $ = {
		extend: function extend(defaults, options) {
			var extended = {};
			var prop;

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
		},
		escapeRegex: function escapeRegex(s) {
			return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
		},
		getItemValue: function getItemValue(kamil, listItem) {
			var item =
					kamil._data[
						parseInt(listItem.getAttribute("data-position"), 10)
					],
				prop = kamil._opts.property;

			if (typeof item !== "undefined") {
				return prop === null
					? item.label || item.value || item
					: item[prop];
			}
		},
		trigger: function trigger(target, type, properties) {
			var evt = document.createEvent("HTMLEvents");
			evt.initEvent(type, true, true);

			for (var j in properties) {
				if (properties.hasOwnProperty(j)) {
					evt[j] = properties[j];
				}
			}

			target.dispatchEvent(evt);
		},
		isActive: function isActive(menu, idx) {
			var items = menu.getElementsByTagName("li"),
				len = items.length;

			if (typeof idx === "string") {
				idx = idx === "first" ? 0 : len - 1;
			}

			if (!items[idx]) {
				return null;
			}

			return items[idx].classList.contains("kamil-active");
		},
		noActive: function noActive(menu) {
			return menu.getElementsByClassName("kamil-active").length === 0;
		},
		setActive: function setActive(o) {
			if (o.item.classList.contains(this._opts.exclude)) {
				return;
			}

			var activeArr = this._menu.getElementsByClassName("kamil-active");

			if (activeArr.length !== 0) {
				activeArr[0].classList.remove("kamil-active");
			}

			o.item.classList.add("kamil-active");

			if (o.fillSource) {
				this._srcElement.value = $.getItemValue(this, o.item);
			}

			$.trigger(this._menu, "kamilfocus", {
				item: this._data[
					parseInt(o.item.getAttribute("data-position"), 10)
				],
				inputElement: this._srcElement
			});
		},
		move: function move(direction) {
			if (!this.open) {
				this.start(null);
				return;
			}

			var items = this._menu.getElementsByTagName("li");

			if (
				(direction === "previous" && $.isActive(this._menu, "first")) ||
				(direction === "next" && $.isActive(this._menu, "last")) ||
				(direction === "previous" &&
					this._activeIndex === 1 &&
					items[0].classList.contains(this._opts.exclude))
			) {
				this._srcElement.value = this.term;
				this._activeIndex = null;

				for (var i = 0, l = items.length; i < l; i++) {
					if (items[i].classList.contains("kamil-active")) {
						items[i].classList.remove("kamil-active");
					}
				}

				return;
			}

			if ($.noActive(this._menu) || this._activeIndex === null) {
				if (direction === "previous") {
					this._activeIndex = items.length - 1;
				} else if (direction === "next") {
					this._activeIndex = 0;
				}
			} else {
				this._activeIndex =
					this._activeIndex + (direction === "previous" ? -1 : 1);
			}

			if (
				items[this._activeIndex] &&
				items[this._activeIndex].classList.contains(this._opts.exclude)
			) {
				this._activeIndex =
					this._activeIndex + (direction === "previous" ? -1 : 1);
			}

			$.setActive.call(this, {
				item: items[this._activeIndex],
				fillSource: true
			});
		}
	};
	var init = {
		source: function source() {
			var source = this._opts.source;

			if (source.constructor === Array) {
				this.source = source;
			} else {
				var list = document.querySelector(source),
					children = list.children;
				this.source = [];

				for (var i = 0, l = children.length; i < l; i++) {
					var item = children[i];
					this.source.push(item.textContent);
				}
			}
		},
		list: function list() {
			var appendTo = this._opts.appendTo;
			this._menu = document.createElement("ul");
			this._menu.className = "kamil-autocomplete";

			if (appendTo !== null) {
				document.querySelector(appendTo).appendChild(this._menu);
			} else {
				this._srcElement.parentNode.insertBefore(
					this._menu,
					this._srcElement.nextSibling
				);
			}
		}
	};
	var handlers = {
		keyup: function keyup(k) {
			return function (e) {
				if (k._opts.disabled) {
					return;
				}

				switch (e.keyCode) {
					case 38:
						$.move.call(k, "previous", e);
						break;

					case 40:
						$.move.call(k, "next", e);
						break;

					case 13:
						var tmp = k._menu.getElementsByClassName(
							"kamil-active"
						);

						if (tmp.length === 0) {
							return;
						}

						var activeItem = tmp[0];
						k._srcElement.value = $.getItemValue(k, activeItem);
						$.trigger(k._menu, "kamilselect", {
							item:
								k._data[
									parseInt(
										activeItem.getAttribute(
											"data-position"
										),
										10
									)
								],
							inputElement: k._srcElement
						});
						k.close();
						break;

					case 27:
						k._srcElement.value = k.term;
						k.close();
						break;
				}
			};
		},
		keydown: function keydown(e) {
			if (e.keyCode === 38 || e.keyCode === 40) {
				e.preventDefault();
				return false;
			}
		},
		input: function input() {
			var self = this;
			return function () {
				if (self._opts.disabled) {
					return;
				}

				if (self.term !== self._srcElement.value || !self.open) {
					self._activeIndex = null;
					self.start(null);
				}
			};
		},
		itemClickFlag: true,
		mousedown: function mousedown() {
			handlers.itemClickFlag = false;
		},
		mouseup: function mouseup(k) {
			return function () {
				handlers.itemClickFlag = true;
				k._srcElement.value = $.getItemValue(k, this);
				$.trigger(k._menu, "kamilselect", {
					item:
						k._data[
							parseInt(this.getAttribute("data-position"), 10)
						],
					inputElement: k._srcElement
				});

				k._srcElement.focus();

				k.close();
			};
		},
		mouseover: function mouseover(k) {
			return function () {
				$.setActive.call(k, {
					item: this,
					fillSource: false
				});
			};
		},
		mouseout: function mouseout(k) {
			return function () {
				var active = k._menu.getElementsByClassName("kamil-active")[0];

				if (active) {
					active.classList.remove("kamil-active");
				}
			};
		},
		blur: function blur(k) {
			return function () {
				if (k._opts.disabled || !handlers.itemClickFlag) {
					return;
				}

				k.close();
			};
		}
	};

	var Kamil = (root.Kamil = function (element, options) {
		var self = this;
		self._opts = $.extend(defaults, options);
		self._activeIndex = null;
		self._data = null;
		self.open = false;
		var srcElement = (self._srcElement =
			typeof element === "string"
				? document.querySelector(element)
				: element);
		srcElement.addEventListener("input", handlers.input.call(self), false);
		srcElement.addEventListener("keyup", handlers.keyup(self), false);
		srcElement.addEventListener("keydown", handlers.keydown, false);
		srcElement.addEventListener("blur", handlers.blur(self), false);
		init.source.call(self);
		init.list.call(self);
	});

	Kamil.prototype._resizeMenu = function () {
		var style = this._menu.style;
		style.width = this._srcElement.offsetWidth + "px";
		style.left = this._srcElement.offsetLeft + "px";
		style.top =
			this._srcElement.offsetTop + this._srcElement.offsetHeight + "px";
	};

	Kamil.prototype._renderItemData = function (ul, item, index) {
		var li = this.renderItem(ul, item);
		li.setAttribute("data-position", index);
		li.addEventListener("mousedown", handlers.mousedown, false);
		li.addEventListener("mouseup", handlers.mouseup(this), false);
		li.addEventListener("mouseover", handlers.mouseover(this), false);
		li.addEventListener("mouseout", handlers.mouseout(this), false);
		return li;
	};

	Kamil.prototype._renderMenu = function (items, callback) {
		var ls = this._menu;

		while (ls.firstChild) {
			ls.removeChild(ls.firstChild);
		}

		this._resizeMenu();

		this.renderMenu(ls, items);

		if (ls.children.length === 0) {
			ls.style.display = "none";
			return;
		}

		if (ls.style.display !== "block") {
			ls.style.display = "block";
		}

		callback();
	};

	Kamil.prototype.renderItem = function (ul, item) {
		var li = document.createElement("li");
		li.innerHTML =
			this._opts.property === null
				? item.label || item.value || item
				: item[this._opts.property];
		ul.appendChild(li);
		return li;
	};

	Kamil.prototype.renderMenu = function (ul, items) {
		for (var i = 0, l = items.length; i < l; i++) {
			var item = items[i];

			this._renderItemData(ul, item, i);
		}
	};

	Kamil.prototype.start = function (value) {
		var self = this;
		value = value !== null ? value : self._srcElement.value;
		self.term = self._srcElement.value;

		if (self._opts.disabled) {
			return;
		}

		if (!value) {
			self.close();
			return;
		}

		if (value.length < self._opts.minChars) {
			self.close();
			return;
		}

		self._data = self.source
			.filter(function(e) {
				return self._opts.filter(
					self._opts.property === null
						? e.label || e.value || e
						: e[self._opts.property],
					value
				);
			})
			.sort(function(a, b) {
				return self._opts.sort.call(self, a, b);
			});
		$.trigger(this._menu, "kamilresponse", {
			content: self._data,
			inputElement: self._srcElement
		});

		self._renderMenu(self._data, function () {
			if (self._opts.autoFocus) {
				var items = self._menu.getElementsByTagName("li");

				$.setActive.call(self, {
					item: items[0],
					fillSource: false
				});
			}

			self.open = true;
			$.trigger(self._menu, "kamilopen");
		});
	};

	Kamil.prototype.close = function () {
		if (this.open) {
			this._menu.style.display = "none";
			this.open = false;
			$.trigger(this._menu, "kamilclose");
		}
	};

	Kamil.prototype.destroy = function () {
		this._menu.remove();

		var srcElement = this._srcElement;
		srcElement.removeEventListener(
			"input",
			handlers.input.call(this),
			false
		);
		srcElement.removeEventListener("keyup", handlers.keyup(this), false);
		srcElement.removeEventListener("keydown", handlers.keydown, false);
		srcElement.removeEventListener("blur", handlers.blur(this), false);
	};

	Kamil.prototype.disable = function () {
		this.close();
		this._opts.disabled = true;
	};

	Kamil.prototype.enable = function () {
		this._opts.disabled = false;
	};

	Kamil.prototype.isEnabled = function () {
		return !this._opts.disabled;
	};

	Kamil.prototype.option = function () {
		var retval = "";

		switch (arguments.length) {
			case 0:
				retval = this._opts;
				break;

			case 1:
				retval = this._opts[arguments[0]];
				break;

			case 2:
				this._opts[arguments[0]] = arguments[1];
				break;
		}

		return retval;
	};

	Kamil.prototype.on = function (eventName, fn) {
		var self = this;

		self._menu.addEventListener(
			eventName,
			function(e) {
				if (eventName === "kamilresponse") {
					self._data = fn(e);
				} else {
					fn(e);
				}
			},
			false
		);
	};
})("undefined" !== typeof window ? window : this, document);

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

/*jshint esnext: true */

/*jshint -W069 */

/*global define, module, Vimeo, YT, jwplayer */
(function (global, factory) {
	if (typeof define === "function" && define.amd) {
		define('GLightbox', ['module'], factory);
	} else if (typeof exports !== "undefined") {
		factory(module);
	} else {
		var mod = {
			exports: {}
		};
		factory(mod);
		global.GLightbox = mod.exports;
	}
})("undefined" !== typeof window ? window : this, function (module) {
	'use strict';
/*jshint validthis: true */
	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) {
			throw new TypeError("Cannot call a class as a function");
		}
	}
	var _createClass = function () {
		function defineProperties(target, props) {
			for (var i = 0; i < props.length; i++) {
				var descriptor = props[i];
				descriptor.enumerable = descriptor.enumerable || false;
				descriptor.configurable = true;
				if ("value" in descriptor)
					descriptor.writable = true;
				Object.defineProperty(target, descriptor.key, descriptor);
			}
		}
		return function (Constructor, protoProps, staticProps) {
			if (protoProps)
				defineProperties(Constructor.prototype, protoProps);
			if (staticProps)
				defineProperties(Constructor, staticProps);
			return Constructor;
		};
	}
	();
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
		return typeof obj;
	}
	 : function (obj) {
		return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
	};
/**
	 * GLightbox v1.0.8
	 * Awesome pure javascript lightbox
	 * made by mcstudios.com.mx
	 */
	var isMobile = navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(Android)|(PlayBook)|(BB10)|(BlackBerry)|(Opera Mini)|(IEMobile)|(webOS)|(MeeGo)/i);
	var isTouch = isMobile !== null || document.createTouch !== undefined || 'ontouchstart' in window || 'onmsgesturechange' in window || navigator.msMaxTouchPoints;
	var html = document.getElementsByTagName('html')[0];
	var body = document.body;
	var transitionEnd = whichTransitionEvent();
	var animationEnd = whichAnimationEvent();
	var uid = Date.now();
	var YTTemp = [];
	var videoPlayers = {};
	// Default settings
	var defaults = {
		selector: 'glightbox',
		skin: 'clean',
		closeButton: true,
		startAt: 0,
		autoplayVideos: true,
		descPosition: 'bottom',
		width: 900,
		height: 506,
		videosWidth: 960,
		videosHeight: 540,
		beforeSlideChange: null,
		afterSlideChange: null,
		beforeSlideLoad: null,
		afterSlideLoad: null,
		onOpen: null,
		onClose: null,
		loopAtEnd: false,
		touchNavigation: true,
		keyboardNavigation: true,
		closeOnOutsideClick: true,
		jwplayer: {
			api: null,
			licenseKey: null,
			params: {
				width: '100%',
				aspectratio: '16:9',
				stretching: 'uniform'
			}
		},
		vimeo: {
			api: 'https://player.vimeo.com/api/player.js',
			params: {
				api: 1,
				title: 0,
				byline: 0,
				portrait: 0
			}
		},
		youtube: {
			api: 'https://www.youtube.com/iframe_api',
			params: {
				enablejsapi: 1,
				showinfo: 0
			}
		},
		openEffect: 'zoomIn', // fade, zoom, none
		closeEffect: 'zoomOut', // fade, zoom, none
		slideEffect: 'slide', // fade, slide, zoom, none
		moreText: 'See more',
		moreLength: 60,
		slideHtml: '',
		lightboxHtml: '',
		cssEfects: {
			fade: {
				in: 'fadeIn',
				out: 'fadeOut'
			},
			zoom: {
				in: 'zoomIn',
				out: 'zoomOut'
			},
			slide: {
				in: 'slideInRight',
				out: 'slideOutLeft'
			},
			slide_back: {
				in: 'slideInLeft',
				out: 'slideOutRight'
			}
		}
	};
/* jshint multistr: true */
	// You can pass your own slide structure
	// just make sure that add the same classes so they are populated
	// title class = gslide-title
	// desc class = gslide-desc
	// prev arrow class = gnext
	// next arrow id = gprev
	// close id = gclose
	var lightboxSlideHtml = '<div class="gslide">\
		<div class="gslide-inner-content">\
		<div class="ginner-container">\
		<div class="gslide-media">\
		</div>\
		<div class="gslide-description">\
		<h4 class="gslide-title"></h4>\
		<div class="gslide-desc"></div>\
		</div>\
		</div>\
		</div>\
		</div>';
	defaults.slideHtml = lightboxSlideHtml;
	var lightboxHtml = '<div id="glightbox-body" class="glightbox-container">\
		<div class="gloader visible"></div>\
		<div class="goverlay"></div>\
		<div class="gcontainer">\
		<div id="glightbox-slider" class="gslider"></div>\
		<a class="gnext"></a>\
		<a class="gprev"></a>\
		<a class="gclose"></a>\
		</div>\
		</div>';
	defaults.lightboxHtml = lightboxHtml;
/**
	 * Merge two or more objects
	 */
	function extend() {
		var extended = {};
		var deep = false;
		var i = 0;
		var length = arguments.length;
		if (Object.prototype.toString.call(arguments[0]) === '[object Boolean]') {
			deep = arguments[0];
			i++;
		}
		var merge = function merge(obj) {
			for (var prop in obj) {
				if (Object.prototype.hasOwnProperty.call(obj, prop)) {
					if (deep && Object.prototype.toString.call(obj[prop]) === '[object Object]') {
						extended[prop] = extend(true, extended[prop], obj[prop]);
					} else {
						extended[prop] = obj[prop];
					}
				}
			}
		};
		for (; i < length; i++) {
			var obj = arguments[i];
			merge(obj);
		}
		return extended;
	}
	var utils = {
		isFunction: function isFunction(f) {
			return typeof f === 'function';
		},
		isString: function isString(s) {
			return typeof s === 'string';
		},
		isNode: function isNode(el) {
			return !!(el && el.nodeType && el.nodeType == 1);
		},
		isArray: function isArray(ar) {
			return Array.isArray(ar);
		},
		isArrayLike: function isArrayLike(ar) {
			return ar && ar.length && isFinite(ar.length);
		},
		isObject: function isObject(o) {
			var type = typeof o === 'undefined' ? 'undefined' : _typeof(o);
			return type === 'object' && o != null && !utils.isFunction(o) && !utils.isArray(o);
		},
		isNil: function isNil(o) {
			return o == null;
		},
		has: function has(obj, key) {
			return obj !== null && hasOwnProperty.call(obj, key);
		},
		size: function size(o) {
			if (utils.isObject(o)) {
				if (o.keys) {
					return o.keys().length;
				}
				var l = 0;
				for (var k in o) {
					if (utils.has(o, k)) {
						l++;
					}
				}
				return l;
			} else {
				return o.length;
			}
		},
		isNumber: function isNumber(n) {
			return !isNaN(parseFloat(n)) && isFinite(n);
		}
	};
/**
	 * Each
	 *
	 * @param {mixed} node lisy, array, object
	 * @param {function} callback
	 */
	function each(collection, callback) {
		if (utils.isNode(collection) || collection === window || collection === document) {
			collection = [collection];
		}
		if (!utils.isArrayLike(collection) && !utils.isObject(collection)) {
			collection = [collection];
		}
		if (utils.size(collection) == 0) {
			return;
		}
		if (utils.isArrayLike(collection) && !utils.isObject(collection)) {
			var l = collection.length,
			i = 0;
			for (; i < l; i += 1) {
				if (callback.call(collection[i], collection[i], i, collection) === false) {
					break;
				}
			}
		} else if (utils.isObject(collection)) {
			for (var key in collection) {
				if (utils.has(collection, key)) {
					if (callback.call(collection[key], collection[key], key, collection) === false) {
						break;
					}
				}
			}
		}
	}
/**
	 * Get nde events
	 * return node events and optionally
	 * check if the node has already a specific event
	 * to avoid duplicated callbacks
	 *
	 * @param {node} node
	 * @param {string} name event name
	 * @param {object} fn callback
	 * @returns {object}
	 */
	function getNodeEvents(node) {
		var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
		var fn = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
		var cache = node[uid] = node[uid] || [];
		var data = {
			all: cache,
			evt: null,
			found: null
		};
		if (name && fn && utils.size(cache) > 0) {
			each(cache, function (cl, i) {
				if (cl.eventName == name && cl.fn.toString() == fn.toString()) {
					data.found = true;
					data.evt = i;
					return false;
				}
			});
		}
		return data;
	}
/**
	 * Add Event
	 * Add an event listener
	 *
	 * @param {string} eventName
	 * @param {object} detials
	 */
	function addEvent(eventName) {
		var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
		onElement = _ref.onElement,
		withCallback = _ref.withCallback,
		_ref$avoidDuplicate = _ref.avoidDuplicate,
		avoidDuplicate = _ref$avoidDuplicate === undefined ? true : _ref$avoidDuplicate,
		_ref$once = _ref.once,
		once = _ref$once === undefined ? false : _ref$once,
		_ref$useCapture = _ref.useCapture,
		useCapture = _ref$useCapture === undefined ? false : _ref$useCapture;
		var thisArg = arguments[2];
		var element = onElement || [];
		if (utils.isString(element)) {
			element = document.querySelectorAll(element);
		}
		function handler(event) {
			if (utils.isFunction(withCallback)) {
				withCallback.call(thisArg, event, this);
			}
			if (once) {
				handler.destroy();
			}
		}
		handler.destroy = function () {
			each(element, function (el) {
				var events = getNodeEvents(el, eventName, handler);
				if (events.found) {
					events.all.splice(events.evt, 1);
				}
				if (el.removeEventListener)
					el.removeEventListener(eventName, handler, useCapture);
			});
		};
		each(element, function (el) {
			var events = getNodeEvents(el, eventName, handler);
			if (el.addEventListener && avoidDuplicate && !events.found || !avoidDuplicate) {
				el.addEventListener(eventName, handler, useCapture);
				events.all.push({
					eventName: eventName,
					fn: handler
				});
			}
		});
		return handler;
	}
/**
	 * Add element class
	 *
	 * @param {node} element
	 * @param {string} class name
	 */
	function addClass(node, name) {
		if (hasClass(node, name)) {
			return;
		}
		if (node.classList) {
			node.classList.add(name);
		} else {
			node.className += " " + name;
		}
	}
/**
	 * Remove element class
	 *
	 * @param {node} element
	 * @param {string} class name
	 */
	function removeClass(node, name) {
		var c = name.split(' ');
		if (c.length > 1) {
			each(c, function (cl) {
				removeClass(node, cl);
			});
			return;
		}
		if (node.classList) {
			node.classList.remove(name);
		} else {
			node.className = node.className.replace(name, "");
		}
	}
/**
	 * Has class
	 *
	 * @param {node} element
	 * @param {string} class name
	 */
	function hasClass(node, name) {
		return node.classList ? node.classList.contains(name) : new RegExp("(^| )" + name + "( |$)", "gi").test(node.className);
	}
/**
	 * Determine animation events
	 */
	function whichAnimationEvent() {
		var t = void 0,
		el = document.createElement("fakeelement");
		var animations = {
			animation: "animationend",
			OAnimation: "oAnimationEnd",
			MozAnimation: "animationend",
			WebkitAnimation: "webkitAnimationEnd"
		};
		for (t in animations) {
			if (el.style[t] !== undefined) {
				return animations[t];
			}
		}
	}
/**
	 * Determine transition events
	 */
	function whichTransitionEvent() {
		var t = void 0,
		el = document.createElement("fakeelement");
		var transitions = {
			transition: "transitionend",
			OTransition: "oTransitionEnd",
			MozTransition: "transitionend",
			WebkitTransition: "webkitTransitionEnd"
		};
		for (t in transitions) {
			if (el.style[t] !== undefined) {
				return transitions[t];
			}
		}
	}
/**
	 * CSS Animations
	 *
	 * @param {node} element
	 * @param {string} animation name
	 * @param {function} callback
	 */
	function animateElement(element) {
		var animation = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
		var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
		if (!element || animation === '') {
			return false;
		}
		if (animation == 'none') {
			if (utils.isFunction(callback))
				callback();
			return false;
		}
		var animationNames = animation.split(' ');
		each(animationNames, function (name) {
			addClass(element, 'g' + name);
		});
		addEvent(animationEnd, {
			onElement: element,
			avoidDuplicate: false,
			once: true,
			withCallback: function withCallback(event, target) {
				each(animationNames, function (name) {
					removeClass(target, 'g' + name);
				});
				if (utils.isFunction(callback))
					callback();
			}
		});
	}
/**
	 * Create a document fragment
	 *
	 * @param {string} html code
	 */
	function createHTML(htmlStr) {
		var frag = document.createDocumentFragment(),
		temp = document.createElement('div');
		temp.innerHTML = htmlStr;
		while (temp.firstChild) {
			frag.appendChild(temp.firstChild);
		}
		return frag;
	}
/**
	 * Get the closestElement
	 *
	 * @param {node} element
	 * @param {string} class name
	 */
	function getClosest(elem, selector) {
		while (elem !== document.body) {
			elem = elem.parentElement;
			var matches = typeof elem.matches == 'function' ? elem.matches(selector) : elem.msMatchesSelector(selector);
			if (matches)
				return elem;
		}
	}
/**
	 * Show element
	 *
	 * @param {node} element
	 */
	function show(element) {
		element.style.display = 'block';
	}
/**
	 * Hide element
	 */
	function hide(element) {
		element.style.display = 'none';
	}
/**
	 * Get slide data
	 *
	 * @param {node} element
	 */
	var getSlideData = function getSlideData() {
		var element = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
		var settings = arguments[1];
		var data = {
			href: '',
			title: '',
			description: '',
			descPosition: 'bottom',
			effect: '',
			node: element
		};
		if (utils.isObject(element) && !utils.isNode(element)) {
			return extend(data, element);
		}
		var url = '';
		var config = element.getAttribute('data-glightbox');
		var type = element.nodeName.toLowerCase();
		if (type === 'a')
			url = element.href;
		if (type === 'img')
			url = element.src;
		data.href = url;
		each(data, function (val, key) {
			if (utils.has(settings, key)) {
				data[key] = settings[key];
			}
			var nodeData = element.dataset[key];
			if (!utils.isNil(nodeData)) {
				data[key] = nodeData;
			}
		});
		var sourceType = getSourceType(url);
		data = extend(data, sourceType);
		if (!utils.isNil(config)) {
			var cleanKeys = [];
			each(data, function (v, k) {
				cleanKeys.push(';\\s?' + k);
			});
			cleanKeys = cleanKeys.join('\\s?:|');
			if (config.trim() !== '') {
				each(data, function (val, key) {
					var str = config;
					var match = '\s?' + key + '\s?:\s?(.*?)(' + cleanKeys + '\s?:|$)';
					var regex = new RegExp(match);
					var matches = str.match(regex);
					if (matches && matches.length && matches[1]) {
						var value = matches[1].trim().replace(/;\s*$/, '');
						data[key] = value;
					}
				});
			}
		} else {
			if (type == 'a') {
				var title = element.title;
				if (!utils.isNil(title) && title !== '')
					data.title = title;
			}
			if (type == 'img') {
				var alt = element.alt;
				if (!utils.isNil(alt) && alt !== '')
					data.title = alt;
			}
			var desc = element.getAttribute('data-description');
			if (!utils.isNil(desc) && desc !== '')
				data.description = desc;
		}
		var nodeDesc = element.querySelector('.glightbox-desc');
		if (nodeDesc) {
			data.description = nodeDesc.innerHTML;
		}
		data.sourcetype = data.hasOwnProperty('type') ? data.type : data.sourcetype;
		data.type = data.sourcetype;
		var defaultWith = data.sourcetype == 'video' ? settings.videosWidth : settings.width;
		var defaultHeight = data.sourcetype == 'video' ? settings.videosHeight : settings.height;
		data.width = utils.has(data, 'width') ? data.width : defaultWith;
		data.height = utils.has(data, 'height') ? data.height : defaultHeight;
		return data;
	};
/**
	 * Set slide content
	 *
	 * @param {node} slide
	 * @param {object} data
	 * @param {function} callback
	 */
	var setSlideContent = function setSlideContent() {
		var slide = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
		var _this = this;
		var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
		var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
		if (hasClass(slide, 'loaded')) {
			return false;
		}
		if (utils.isFunction(this.settings.beforeSlideLoad)) {
			this.settings.beforeSlideLoad(slide, data);
		}
		var type = data.type;
		var position = data.descPosition;
		var slideMedia = slide.querySelector('.gslide-media');
		var slideTitle = slide.querySelector('.gslide-title');
		var slideText = slide.querySelector('.gslide-desc');
		var slideDesc = slide.querySelector('.gslide-description');
		var finalCallback = callback;
		if (utils.isFunction(this.settings.afterSlideLoad)) {
			finalCallback = function finalCallback() {
				if (utils.isFunction(callback)) {
					callback();
				}
				_this.settings.afterSlideLoad(slide, data);
			};
		}
		if (data.title == '' && data.description == '') {
			if (slideDesc) {
				slideDesc.parentNode.removeChild(slideDesc);
			}
		} else {
			if (slideTitle && data.title !== '') {
				slideTitle.innerHTML = data.title;
			} else {
				slideTitle.parentNode.removeChild(slideTitle);
			}
			if (slideText && data.description !== '') {
				if (isMobile && this.settings.moreLength > 0) {
					data.smallDescription = slideShortDesc(data.description, this.settings.moreLength, this.settings.moreText);
					slideText.innerHTML = data.smallDescription;
					slideDescriptionEvents.apply(this, [slideText, data]);
				} else {
					slideText.innerHTML = data.description;
				}
			} else {
				slideText.parentNode.removeChild(slideText);
			}
			addClass(slideMedia.parentNode, 'desc-' + position);
			addClass(slideDesc, 'description-' + position);
		}
		addClass(slideMedia, 'gslide-' + type);
		addClass(slide, 'loaded');
		if (type === 'video') {
			setSlideVideo.apply(this, [slide, data, finalCallback]);
			return;
		}
		if (type === 'external') {
			var iframe = createIframe(data.href, data.width, data.height, finalCallback);
			slideMedia.appendChild(iframe);
			return;
		}
		if (type === 'inline') {
			setInlineContent.apply(this, [slide, data, finalCallback]);
			return;
		}
		if (type === 'image') {
			var img = new Image();
			img.addEventListener('load', function () {
				if (utils.isFunction(finalCallback)) {
					finalCallback();
				}
			}, false);
			img.src = data.href;
			slideMedia.appendChild(img);
			return;
		}
		if (utils.isFunction(finalCallback))
			finalCallback();
	};
/**
	 * Set slide video
	 *
	 * @param {node} slide
	 * @param {object} data
	 * @param {function} callback
	 */
	function setSlideVideo(slide, data, callback) {
		var _this2 = this;
		var source = data.source;
		var video_id = 'gvideo' + data.index;
		var slideMedia = slide.querySelector('.gslide-media');
		var url = data.href;
		var protocol = location.protocol.replace(':', '');
		if (protocol == 'file') {
			protocol = 'http';
		}
		// Set vimeo videos
		if (source == 'vimeo') {
			var vimeo_id = /vimeo.*\/(\d+)/i.exec(url);
			var params = parseUrlParams(this.settings.vimeo.params);
			var video_url = protocol + '://player.vimeo.com/video/' + vimeo_id[1] + '?' + params;
			injectVideoApi(this.settings.vimeo.api);
			var finalCallback = function finalCallback() {
				waitUntil(function () {
					return typeof Vimeo !== 'undefined';
				}, function () {
					var player = new Vimeo.Player(iframe);
					videoPlayers[video_id] = player;
					if (utils.isFunction(callback)) {
						callback();
					}
				});
			};
			var iframe = createIframe(video_url, data.width, data.height, finalCallback, slideMedia);
			iframe.id = video_id;
			iframe.className = 'vimeo-video gvideo';
			if (this.settings.autoplayVideos && !isMobile) {
				iframe.className += ' wait-autoplay';
			}
		}
		// Set youtube videos
		if (source == 'youtube') {
			var youtube_params = extend(this.settings.youtube.params, {
					playerapiid: video_id
				});
			var yparams = parseUrlParams(youtube_params);
			var youtube_id = getYoutubeID(url);
			var _video_url = protocol + '://www.youtube.com/embed/' + youtube_id + '?' + yparams;
			injectVideoApi(this.settings.youtube.api);
			var _finalCallback = function _finalCallback() {
				if (!utils.isNil(YT) && YT.loaded) {
					var player = new YT.Player(_iframe);
					videoPlayers[video_id] = player;
				} else {
					YTTemp.push(_iframe);
				}
				if (utils.isFunction(callback)) {
					callback();
				}
			};
			var _iframe = createIframe(_video_url, data.width, data.height, _finalCallback, slideMedia);
			_iframe.id = video_id;
			_iframe.className = 'youtube-video gvideo';
			if (this.settings.autoplayVideos && !isMobile) {
				_iframe.className += ' wait-autoplay';
			}
		}
		if (source == 'local') {
			var _html = '<video id="' + video_id + '" ';
			_html += 'style="background:#000; width: ' + data.width + 'px; height: ' + data.height + 'px;" ';
			_html += 'preload="metadata" ';
			_html += 'x-webkit-airplay="allow" ';
			_html += 'webkit-playsinline="" ';
			_html += 'controls ';
			_html += 'class="gvideo">';
			var format = url.toLowerCase().split('.').pop();
			var sources = {
				'mp4': '',
				'ogg': '',
				'webm': ''
			};
			sources[format] = url;
			for (var key in sources) {
				if (sources.hasOwnProperty(key)) {
					var videoFile = sources[key];
					if (data.hasOwnProperty(key)) {
						videoFile = data[key];
					}
					if (videoFile !== '') {
						_html += '<source src="' + videoFile + '" type="video/' + key + '">';
					}
				}
			}
			_html += '</video>';
			var video = createHTML(_html);
			slideMedia.appendChild(video);
			var vnode = document.getElementById(video_id);
			if (this.settings.jwplayer !== null && this.settings.jwplayer.api !== null) {
				var jwplayerConfig = this.settings.jwplayer;
				var jwplayerApi = this.settings.jwplayer.api;
				if (!jwplayerApi) {
					console.warn('Missing jwplayer api file');
					if (utils.isFunction(callback))
						callback();
					return false;
				}
				injectVideoApi(jwplayerApi, function () {
					var jwconfig = extend(_this2.settings.jwplayer.params, {
							width: data.width + 'px',
							height: data.height + 'px',
							file: url
						});
					jwplayer.key = _this2.settings.jwplayer.licenseKey;
					var player = jwplayer(video_id);
					player.setup(jwconfig);
					videoPlayers[video_id] = player;
					player.on('ready', function () {
						vnode = slideMedia.querySelector('.jw-video');
						addClass(vnode, 'gvideo');
						vnode.id = video_id;
						if (utils.isFunction(callback))
							callback();
					});
				});
			} else {
				addClass(vnode, 'html5-video');
				videoPlayers[video_id] = vnode;
				if (utils.isFunction(callback))
					callback();
			}
		}
	}
/**
	 * Create an iframe element
	 *
	 * @param {string} url
	 * @param {numeric} width
	 * @param {numeric} height
	 * @param {function} callback
	 */
	function createIframe(url, width, height, callback, appendTo) {
		var iframe = document.createElement('iframe');
		var winWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
		iframe.className = 'vimeo-video gvideo';
		iframe.src = url;
		if (isMobile && winWidth < 767) {
			iframe.style.height = '';
		} else {
			iframe.style.height = height + 'px';
		}
		iframe.style.width = width + 'px';
		iframe.setAttribute('allowFullScreen', '');
		iframe.onload = function () {
			addClass(iframe, 'iframe-ready');
			if (utils.isFunction(callback)) {
				callback();
			}
		};
		if (appendTo) {
			appendTo.appendChild(iframe);
		}
		return iframe;
	}
/**
	 * Get youtube ID
	 *
	 * @param {string} url
	 * @returns {string} video id
	 */
	function getYoutubeID(url) {
		var videoID = '';
		url = url.replace(/(>|<)/gi, '').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
		if (url[2] !== undefined) {
			videoID = url[2].split(/[^0-9a-z_\-]/i);
			videoID = videoID[0];
		} else {
			videoID = url;
		}
		return videoID;
	}
/**
	 * Inject videos api
	 * used for youtube, vimeo and jwplayer
	 *
	 * @param {string} url
	 * @param {function} callback
	 */
	function injectVideoApi(url, callback) {
		if (utils.isNil(url)) {
			console.error('Inject videos api error');
			return;
		}
		var found = document.querySelectorAll('script[src="' + url + '"]');
		if (utils.isNil(found) || found.length == 0) {
			var script = document.createElement('script');
			script.type = 'text/javascript';
			script.src = url;
			script.onload = function () {
				if (utils.isFunction(callback))
					callback();
			};
			document.body.appendChild(script);
			return false;
		}
		if (utils.isFunction(callback))
			callback();
	}
/**
	 * Handle youtube Api
	 * This is a simple fix, when the video
	 * is ready sometimes the youtube api is still
	 * loading so we can not autoplay or pause
	 * we need to listen onYouTubeIframeAPIReady and
	 * register the videos if required
	 */
	function youtubeApiHandle() {
		for (var i = 0; i < YTTemp.length; i++) {
			var iframe = YTTemp[i];
			var player = new YT.Player(iframe);
			videoPlayers[iframe.id] = player;
		}
	}
	if (typeof window.onYouTubeIframeAPIReady !== 'undefined') {
		window.onYouTubeIframeAPIReady = function () {
			window.onYouTubeIframeAPIReady();
			youtubeApiHandle();
		};
	} else {
		window.onYouTubeIframeAPIReady = youtubeApiHandle;
	}
/**
	 * Wait until
	 * wait until all the validations
	 * are passed
	 *
	 * @param {function} check
	 * @param {function} onComplete
	 * @param {numeric} delay
	 * @param {numeric} timeout
	 */
	function waitUntil(check, onComplete, delay, timeout) {
		if (check()) {
			onComplete();
			return;
		}
		if (!delay)
			delay = 100;
		var timeoutPointer;
		var intervalPointer = setInterval(function () {
				if (!check())
					return;
				clearInterval(intervalPointer);
				if (timeoutPointer)
					clearTimeout(timeoutPointer);
				onComplete();
			}, delay);
		if (timeout)
			timeoutPointer = setTimeout(function () {
					clearInterval(intervalPointer);
				}, timeout);
	}
/**
	 * Parse url params
	 * convert an object in to a
	 * url query string parameters
	 *
	 * @param {object} params
	 */
	function parseUrlParams(params) {
		var qs = '';
		var i = 0;
		each(params, function (val, key) {
			if (i > 0) {
				qs += '&amp;';
			}
			qs += key + '=' + val;
			i += 1;
		});
		return qs;
	}
/**
	 * Set slide inline content
	 * we'll extend this to make http
	 * requests using the fetch api
	 * but for now we keep it simple
	 *
	 * @param {node} slide
	 * @param {object} data
	 * @param {function} callback
	 */
	function setInlineContent(slide, data, callback) {
		var slideMedia = slide.querySelector('.gslide-media');
		var div = document.getElementById(data.inlined.replace('#', ''));
		if (div) {
			var cloned = div.cloneNode(true);
			cloned.style.height = data.height + 'px';
			cloned.style.maxWidth = data.width + 'px';
			addClass(cloned, 'ginlined-content');
			slideMedia.appendChild(cloned);
			if (utils.isFunction(callback)) {
				callback();
			}
			return;
		}
	}
/**
	 * Get source type
	 * gte the source type of a url
	 *
	 * @param {string} url
	 */
	var getSourceType = function getSourceType(url) {
		var origin = url;
		url = url.toLowerCase();
		var data = {};
		if (url.match(/\.(jpeg|jpg|gif|png)$/) !== null) {
			data.sourcetype = 'image';
			return data;
		}
		if (url.match(/(youtube\.com|youtube-nocookie\.com)\/watch\?v=([a-zA-Z0-9\-_]+)/) || url.match(/youtu\.be\/([a-zA-Z0-9\-_]+)/)) {
			data.sourcetype = 'video';
			data.source = 'youtube';
			return data;
		}
		if (url.match(/vimeo\.com\/([0-9]*)/)) {
			data.sourcetype = 'video';
			data.source = 'vimeo';
			return data;
		}
		if (url.match(/\.(mp4|ogg|webm)$/) !== null) {
			data.sourcetype = 'video';
			data.source = 'local';
			return data;
		}
		// Check if inline content
		if (url.indexOf("#") > -1) {
			var hash = origin.split('#').pop();
			if (hash.trim() !== '') {
				data.sourcetype = 'inline';
				data.source = url;
				data.inlined = '#' + hash;
				return data;
			}
		}
		// Ajax
		if (url.includes("gajax=true")) {
			data.sourcetype = 'ajax';
			data.source = url;
		}
		// Any other url
		data.sourcetype = 'external';
		data.source = url;
		return data;
	};
/**
	 * Desktop keyboard navigation
	 */
	function keyboardNavigation() {
		var _this3 = this;
		if (this.events.hasOwnProperty('keyboard')) {
			return false;
		}
		this.events['keyboard'] = addEvent('keydown', {
				onElement: window,
				withCallback: function withCallback(event, target) {
					event = event || window.event;
					var key = event.keyCode;
					if (key == 39)
						_this3.nextSlide();
					if (key == 37)
						_this3.prevSlide();
					if (key == 27)
						_this3.close();
				}
			});
	}
/**
	 * Touch navigation
	 */
	function touchNavigation() {
		var _this4 = this;
		if (this.events.hasOwnProperty('touchStart')) {
			return false;
		}
		var index = void 0,
		hDistance = void 0,
		vDistance = void 0,
		hDistanceLast = void 0,
		vDistanceLast = void 0,
		hDistancePercent = void 0,
		vSwipe = false,
		hSwipe = false,
		hSwipMinDistance = 0,
		vSwipMinDistance = 0,
		doingPinch = false,
		pinchBigger = false,
		startCoords = {},
		endCoords = {},
		slider = this.slidesContainer,
		activeSlide = null,
		xDown = 0,
		yDown = 0,
		activeSlideImage = null,
		activeSlideMedia = null,
		activeSlideDesc = null;
		var winWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
		var winHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
		this.events['doctouchmove'] = addEvent('touchmove', {
				onElement: document,
				withCallback: function withCallback(e, target) {
					if (hasClass(body, 'gdesc-open')) {
						e.preventDefault();
						return false;
					}
				}
			});
		this.events['touchStart'] = addEvent('touchstart', {
				onElement: body,
				withCallback: function withCallback(e, target) {
					if (hasClass(body, 'gdesc-open')) {
						return;
					}
					addClass(body, 'touching');
					activeSlide = _this4.getActiveSlide();
					activeSlideImage = activeSlide.querySelector('.gslide-image');
					activeSlideMedia = activeSlide.querySelector('.gslide-media');
					activeSlideDesc = activeSlide.querySelector('.gslide-description');
					index = _this4.index;
					endCoords = e.targetTouches[0];
					startCoords.pageX = e.targetTouches[0].pageX;
					startCoords.pageY = e.targetTouches[0].pageY;
					xDown = e.targetTouches[0].clientX;
					yDown = e.targetTouches[0].clientY;
				}
			});
		this.events['gestureStart'] = addEvent('gesturestart', {
				onElement: body,
				withCallback: function withCallback(e, target) {
					if (activeSlideImage) {
						e.preventDefault();
						doingPinch = true;
					}
				}
			});
		this.events['gestureChange'] = addEvent('gesturechange', {
				onElement: body,
				withCallback: function withCallback(e, target) {
					e.preventDefault();
					slideCSSTransform(activeSlideImage, 'scale(' + e.scale + ')');
				}
			});
		this.events['gesturEend'] = addEvent('gestureend', {
				onElement: body,
				withCallback: function withCallback(e, target) {
					doingPinch = false;
					if (e.scale < 1) {
						pinchBigger = false;
						slideCSSTransform(activeSlideImage, 'scale(1)');
					} else {
						pinchBigger = true;
					}
				}
			});
		this.events['touchMove'] = addEvent('touchmove', {
				onElement: body,
				withCallback: function withCallback(e, target) {
					if (!hasClass(body, 'touching')) {
						return;
					}
					if (hasClass(body, 'gdesc-open') || doingPinch || pinchBigger) {
						return;
					}
					e.preventDefault();
					endCoords = e.targetTouches[0];
					var slideHeight = activeSlide.querySelector('.gslide-inner-content').offsetHeight;
					var slideWidth = activeSlide.querySelector('.gslide-inner-content').offsetWidth;
					var xUp = e.targetTouches[0].clientX;
					var yUp = e.targetTouches[0].clientY;
					var xDiff = xDown - xUp;
					var yDiff = yDown - yUp;
					if (Math.abs(xDiff) > Math.abs(yDiff)) {
						/*most significant*/
						vSwipe = false;
						hSwipe = true;
					} else {
						hSwipe = false;
						vSwipe = true;
					}
					if (vSwipe) {
						vDistanceLast = vDistance;
						vDistance = endCoords.pageY - startCoords.pageY;
						if (Math.abs(vDistance) >= vSwipMinDistance || vSwipe) {
							var opacity = 0.75 - Math.abs(vDistance) / slideHeight;
							activeSlideMedia.style.opacity = opacity;
							if (activeSlideDesc) {
								activeSlideDesc.style.opacity = opacity;
							}
							slideCSSTransform(activeSlideMedia, 'translate3d(0, ' + vDistance + 'px, 0)');
						}
						return;
					}
					hDistanceLast = hDistance;
					hDistance = endCoords.pageX - startCoords.pageX;
					hDistancePercent = hDistance * 100 / winWidth;
					if (hSwipe) {
						if (_this4.index + 1 == _this4.elements.length && hDistance < -60) {
							resetSlideMove(activeSlide);
							return false;
						}
						if (_this4.index - 1 < 0 && hDistance > 60) {
							resetSlideMove(activeSlide);
							return false;
						}
						var _opacity = 0.75 - Math.abs(hDistance) / slideWidth;
						activeSlideMedia.style.opacity = _opacity;
						if (activeSlideDesc) {
							activeSlideDesc.style.opacity = _opacity;
						}
						slideCSSTransform(activeSlideMedia, 'translate3d(' + hDistancePercent + '%, 0, 0)');
					}
				}
			});
		this.events['touchEnd'] = addEvent('touchend', {
				onElement: body,
				withCallback: function withCallback(e, target) {
					vDistance = endCoords.pageY - startCoords.pageY;
					hDistance = endCoords.pageX - startCoords.pageX;
					hDistancePercent = hDistance * 100 / winWidth;
					removeClass(body, 'touching');
					var slideHeight = activeSlide.querySelector('.gslide-inner-content').offsetHeight;
					var slideWidth = activeSlide.querySelector('.gslide-inner-content').offsetWidth;
					// Swipe to top/bottom to close
					if (vSwipe) {
						var onEnd = slideHeight / 2;
						vSwipe = false;
						if (Math.abs(vDistance) >= onEnd) {
							_this4.close();
							return;
						}
						resetSlideMove(activeSlide);
						return;
					}
					if (hSwipe) {
						hSwipe = false;
						var where = 'prev';
						var asideExist = true;
						if (hDistance < 0) {
							where = 'next';
							hDistance = Math.abs(hDistance);
						}
						if (where == 'prev' && _this4.index - 1 < 0) {
							asideExist = false;
						}
						if (where == 'next' && _this4.index + 1 >= _this4.elements.length) {
							asideExist = false;
						}
						if (asideExist && hDistance >= slideWidth / 2 - 90) {
							if (where == 'next') {
								_this4.nextSlide();
							} else {
								_this4.prevSlide();
							}
							return;
						}
						resetSlideMove(activeSlide);
					}
				}
			});
	}
	function slideCSSTransform(slide) {
		var translate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
		if (translate == '') {
			slide.style.webkitTransform = '';
			slide.style.MozTransform = '';
			slide.style.msTransform = '';
			slide.style.OTransform = '';
			slide.style.transform = '';
			return false;
		}
		slide.style.webkitTransform = translate;
		slide.style.MozTransform = translate;
		slide.style.msTransform = translate;
		slide.style.OTransform = translate;
		slide.style.transform = translate;
	}
	function resetSlideMove(slide) {
		var media = slide.querySelector('.gslide-media');
		var desc = slide.querySelector('.gslide-description');
		addClass(media, 'greset');
		slideCSSTransform(media, 'translate3d(0, 0, 0)');
		var animation = addEvent(transitionEnd, {
				onElement: media,
				once: true,
				withCallback: function withCallback(event, target) {
					removeClass(media, 'greset');
				}
			});
		media.style.opacity = '';
		if (desc) {
			desc.style.opacity = '';
		}
	}
	function slideShortDesc(string) {
		var n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 50;
		var wordBoundary = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
		var useWordBoundary = wordBoundary;
		string = string.trim();
		if (string.length <= n) {
			return string;
		}
		var subString = string.substr(0, n - 1);
		if (!useWordBoundary) {
			return subString;
		}
		return subString + '... <a href="#" class="desc-more">' + wordBoundary + '</a>';
	}
	function slideDescriptionEvents(desc, data) {
		var moreLink = desc.querySelector('.desc-more');
		if (!moreLink) {
			return false;
		}
		addEvent('click', {
			onElement: moreLink,
			withCallback: function withCallback(event, target) {
				event.preventDefault();
				var desc = getClosest(target, '.gslide-desc');
				if (!desc) {
					return false;
				}
				desc.innerHTML = data.description;
				addClass(body, 'gdesc-open');
				var shortEvent = addEvent('click', {
						onElement: [body, getClosest(desc, '.gslide-description')],
						withCallback: function withCallback(event, target) {
							if (event.target.nodeName.toLowerCase() !== 'a') {
								removeClass(body, 'gdesc-open');
								addClass(body, 'gdesc-closed');
								desc.innerHTML = data.smallDescription;
								slideDescriptionEvents(desc, data);
								setTimeout(function () {
									removeClass(body, 'gdesc-closed');
								}, 400);
								shortEvent.destroy();
							}
						}
					});
			}
		});
	}
/**
	 * GLightbox Class
	 * Class and public methods
	 */
	var GlightboxInit = function () {
		function GlightboxInit(options) {
			_classCallCheck(this, GlightboxInit);
			this.settings = extend(defaults, options || {});
			this.effectsClasses = this.getAnimationClasses();
		}
		_createClass(GlightboxInit, [{
					key: 'init',
					value: function init() {
						var _this5 = this;
						this.baseEvents = addEvent('click', {
								onElement: '.' + this.settings.selector,
								withCallback: function withCallback(e, target) {
									e.preventDefault();
									_this5.open(target);
								}
							});
					}
				}, {
					key: 'open',
					value: function open() {
						var element = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
						this.elements = this.getElements(element);
						if (this.elements.length == 0)
							return false;
						this.activeSlide = null;
						this.prevActiveSlideIndex = null;
						this.prevActiveSlide = null;
						var index = this.settings.startAt;
						if (element) {
							// if element passed, get the index
							index = this.elements.indexOf(element);
							if (index < 0) {
								index = 0;
							}
						}
						this.build();
						animateElement(this.overlay, this.settings.openEffect == 'none' ? 'none' : this.settings.cssEfects.fade.in);
						var bodyWidth = body.offsetWidth;
						body.style.width = bodyWidth + 'px';
						addClass(body, 'glightbox-open');
						addClass(html, 'glightbox-open');
						if (isMobile) {
							addClass(html, 'glightbox-mobile');
							this.settings.slideEffect = 'slide';
						}
						this.showSlide(index, true);
						if (this.elements.length == 1) {
							hide(this.prevButton);
							hide(this.nextButton);
						} else {
							show(this.prevButton);
							show(this.nextButton);
						}
						this.lightboxOpen = true;
						if (utils.isFunction(this.settings.onOpen)) {
							this.settings.onOpen();
						}
						if (isMobile && isTouch && this.settings.touchNavigation) {
							touchNavigation.apply(this);
							return false;
						}
						if (this.settings.keyboardNavigation) {
							keyboardNavigation.apply(this);
						}
					}
				}, {
					key: 'showSlide',
					value: function showSlide() {
						var _this6 = this;
						var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
						var first = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
						show(this.loader);
						this.index = index;
						var current = this.slidesContainer.querySelector('.current');
						if (current) {
							removeClass(current, 'current');
						}
						// hide prev slide
						this.slideAnimateOut();
						var slide = this.slidesContainer.querySelectorAll('.gslide')[index];
						show(this.slidesContainer);
						// Check if slide's content is alreay loaded
						if (hasClass(slide, 'loaded')) {
							this.slideAnimateIn(slide, first);
							hide(this.loader);
						} else {
							// If not loaded add the slide content
							show(this.loader);
							// console.log("a", this.settings);
							var slide_data = getSlideData(this.elements[index], this.settings);
							// console.log(slide_data);
							slide_data.index = index;
							setSlideContent.apply(this, [slide, slide_data, function () {
										hide(_this6.loader);
										_this6.slideAnimateIn(slide, first);
									}
								]);
						}
						// Preload subsequent slides
						this.preloadSlide(index + 1);
						this.preloadSlide(index - 1);
						// Handle navigation arrows
						removeClass(this.nextButton, 'disabled');
						removeClass(this.prevButton, 'disabled');
						if (index === 0) {
							addClass(this.prevButton, 'disabled');
						} else if (index === this.elements.length - 1 && this.settings.loopAtEnd !== true) {
							addClass(this.nextButton, 'disabled');
						}
						this.activeSlide = slide;
					}
				}, {
					key: 'preloadSlide',
					value: function preloadSlide(index) {
						var _this7 = this;
						// Verify slide index, it can not be lower than 0
						// and it can not be greater than the total elements
						if (index < 0 || index > this.elements.length)
							return false;
						if (utils.isNil(this.elements[index]))
							return false;
						var slide = this.slidesContainer.querySelectorAll('.gslide')[index];
						if (hasClass(slide, 'loaded')) {
							return false;
						}
						var slide_data = getSlideData(this.elements[index], this.settings);
						slide_data.index = index;
						var type = slide_data.sourcetype;
						if (type == 'video' || type == 'external') {
							setTimeout(function () {
								setSlideContent.apply(_this7, [slide, slide_data]);
							}, 200);
						} else {
							setSlideContent.apply(this, [slide, slide_data]);
						}
					}
				}, {
					key: 'prevSlide',
					value: function prevSlide() {
						var prev = this.index - 1;
						if (prev < 0) {
							return false;
						}
						this.goToSlide(prev);
					}
				}, {
					key: 'nextSlide',
					value: function nextSlide() {
						var next = this.index + 1;
						if (next > this.elements.length)
							return false;
						this.goToSlide(next);
					}
				}, {
					key: 'goToSlide',
					value: function goToSlide() {
						var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
						if (index > -1) {
							this.prevActiveSlide = this.activeSlide;
							this.prevActiveSlideIndex = this.index;
							if (index < this.elements.length) {
								this.showSlide(index);
							} else {
								if (this.settings.loopAtEnd === true) {
									index = 0;
									this.showSlide(index);
								}
							}
						}
					}
				}, {
					key: 'slideAnimateIn',
					value: function slideAnimateIn(slide, first) {
						var _this8 = this;
						var slideMedia = slide.querySelector('.gslide-media');
						var slideDesc = slide.querySelector('.gslide-description');
						var prevData = {
							index: this.prevActiveSlideIndex,
							slide: this.prevActiveSlide
						};
						var nextData = {
							index: this.index,
							slide: this.activeSlide
						};
						if (slideMedia.offsetWidth > 0 && slideDesc) {
							hide(slideDesc);
							slide.querySelector('.ginner-container').style.maxWidth = slideMedia.offsetWidth + 'px';
							slideDesc.style.display = '';
						}
						removeClass(slide, this.effectsClasses);
						if (first) {
							animateElement(slide, this.settings.openEffect, function () {
								if (!isMobile && _this8.settings.autoplayVideos) {
									_this8.playSlideVideo(slide);
								}
								if (utils.isFunction(_this8.settings.afterSlideChange)) {
									_this8.settings.afterSlideChange.apply(_this8, [prevData, nextData]);
								}
							});
						} else {
							var effect_name = this.settings.slideEffect;
							var animIn = effect_name !== 'none' ? this.settings.cssEfects[effect_name].in : effect_name;
							if (this.prevActiveSlideIndex > this.index) {
								if (this.settings.slideEffect == 'slide') {
									animIn = this.settings.cssEfects.slide_back.in;
								}
							}
							animateElement(slide, animIn, function () {
								if (!isMobile && _this8.settings.autoplayVideos) {
									_this8.playSlideVideo(slide);
								}
								if (utils.isFunction(_this8.settings.afterSlideChange)) {
									_this8.settings.afterSlideChange.apply(_this8, [prevData, nextData]);
								}
							});
						}
						addClass(slide, 'current');
					}
				}, {
					key: 'slideAnimateOut',
					value: function slideAnimateOut() {
						if (!this.prevActiveSlide) {
							return false;
						}
						var prevSlide = this.prevActiveSlide;
						removeClass(prevSlide, this.effectsClasses);
						addClass(prevSlide, 'prev');
						var animation = this.settings.slideEffect;
						var animOut = animation !== 'none' ? this.settings.cssEfects[animation].out : animation;
						this.stopSlideVideo(prevSlide);
						if (utils.isFunction(this.settings.beforeSlideChange)) {
							this.settings.beforeSlideChange.apply(this, [{
										index: this.prevActiveSlideIndex,
										slide: this.prevActiveSlide
									}, {
										index: this.index,
										slide: this.activeSlide
									}
								]);
						}
						if (this.prevActiveSlideIndex > this.index && this.settings.slideEffect == 'slide') {
							// going back
							animOut = this.settings.cssEfects.slide_back.out;
						}
						animateElement(prevSlide, animOut, function () {
							var media = prevSlide.querySelector('.gslide-media');
							var desc = prevSlide.querySelector('.gslide-description');
							media.style.transform = '';
							removeClass(media, 'greset');
							media.style.opacity = '';
							if (desc) {
								desc.style.opacity = '';
							}
							removeClass(prevSlide, 'prev');
						});
					}
				}, {
					key: 'stopSlideVideo',
					value: function stopSlideVideo(slide) {
						if (utils.isNumber(slide)) {
							slide = this.slidesContainer.querySelectorAll('.gslide')[slide];
						}
						var slideVideo = slide ? slide.querySelector('.gvideo') : null;
						if (!slideVideo) {
							return false;
						}
						var videoID = slideVideo.id;
						if (videoPlayers && videoPlayers.hasOwnProperty(videoID)) {
							var player = videoPlayers[videoID];
							if (hasClass(slideVideo, 'vimeo-video')) {
								player.pause();
							}
							if (hasClass(slideVideo, 'youtube-video')) {
								player.pauseVideo();
							}
							if (hasClass(slideVideo, 'jw-video')) {
								player.pause(true);
							}
							if (hasClass(slideVideo, 'html5-video')) {
								player.pause();
							}
						}
					}
				}, {
					key: 'playSlideVideo',
					value: function playSlideVideo(slide) {
						if (utils.isNumber(slide)) {
							slide = this.slidesContainer.querySelectorAll('.gslide')[slide];
						}
						var slideVideo = slide.querySelector('.gvideo');
						if (!slideVideo) {
							return false;
						}
						var videoID = slideVideo.id;
						if (videoPlayers && videoPlayers.hasOwnProperty(videoID)) {
							var player = videoPlayers[videoID];
							if (hasClass(slideVideo, 'vimeo-video')) {
								player.play();
							}
							if (hasClass(slideVideo, 'youtube-video')) {
								player.playVideo();
							}
							if (hasClass(slideVideo, 'jw-video')) {
								player.play();
							}
							if (hasClass(slideVideo, 'html5-video')) {
								player.play();
							}
							setTimeout(function () {
								removeClass(slideVideo, 'wait-autoplay');
							}, 300);
							return false;
						}
					}
				}, {
					key: 'setElements',
					value: function setElements(elements) {
						this.settings.elements = elements;
					}
				}, {
					key: 'getElements',
					value: function getElements() {
						var element = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
						this.elements = [];
						if (!utils.isNil(this.settings.elements) && utils.isArray(this.settings.elements)) {
							return this.settings.elements;
						}
						var nodes = false;
						if (element !== null) {
							var gallery = element.getAttribute('data-gallery');
							if (gallery && gallery !== '') {
								nodes = document.querySelectorAll('[data-gallery="' + gallery + '"]');
							}
						}
						if (nodes == false) {
							nodes = document.querySelectorAll('.' + this.settings.selector);
						}
						nodes = Array.prototype.slice.call(nodes);
						return nodes;
					}
				}, {
					key: 'getActiveSlide',
					value: function getActiveSlide() {
						return this.slidesContainer.querySelectorAll('.gslide')[this.index];
					}
				}, {
					key: 'getActiveSlideIndex',
					value: function getActiveSlideIndex() {
						return this.index;
					}
				}, {
					key: 'getAnimationClasses',
					value: function getAnimationClasses() {
						var effects = [];
						for (var key in this.settings.cssEfects) {
							if (this.settings.cssEfects.hasOwnProperty(key)) {
								var effect = this.settings.cssEfects[key];
								effects.push('g' + effect.in);
								effects.push('g' + effect.out);
							}
						}
						return effects.join(' ');
					}
				}, {
					key: 'build',
					value: function build() {
						var _this9 = this;
						if (this.built) {
							return false;
						}
						var lightbox_html = createHTML(this.settings.lightboxHtml);
						document.body.appendChild(lightbox_html);
						var modal = document.getElementById('glightbox-body');
						this.modal = modal;
						var closeButton = modal.querySelector('.gclose');
						this.prevButton = modal.querySelector('.gprev');
						this.nextButton = modal.querySelector('.gnext');
						this.overlay = modal.querySelector('.goverlay');
						this.loader = modal.querySelector('.gloader');
						this.slidesContainer = document.getElementById('glightbox-slider');
						this.events = {};
						addClass(this.modal, 'glightbox-' + this.settings.skin);
						if (this.settings.closeButton && closeButton) {
							this.events['close'] = addEvent('click', {
									onElement: closeButton,
									withCallback: function withCallback(e, target) {
										e.preventDefault();
										_this9.close();
									}
								});
						}
						if (closeButton && !this.settings.closeButton) {
							closeButton.parentNode.removeChild(closeButton);
						}
						if (this.nextButton) {
							this.events['next'] = addEvent('click', {
									onElement: this.nextButton,
									withCallback: function withCallback(e, target) {
										e.preventDefault();
										_this9.nextSlide();
									}
								});
						}
						if (this.prevButton) {
							this.events['prev'] = addEvent('click', {
									onElement: this.prevButton,
									withCallback: function withCallback(e, target) {
										e.preventDefault();
										_this9.prevSlide();
									}
								});
						}
						if (this.settings.closeOnOutsideClick) {
							this.events['outClose'] = addEvent('click', {
									onElement: modal,
									withCallback: function withCallback(e, target) {
										if (!getClosest(e.target, '.ginner-container')) {
											if (!hasClass(e.target, 'gnext') && !hasClass(e.target, 'gprev')) {
												_this9.close();
											}
										}
									}
								});
						}
						each(this.elements, function () {
							var slide = createHTML(_this9.settings.slideHtml);
							_this9.slidesContainer.appendChild(slide);
						});
						if (isTouch) {
							addClass(html, 'glightbox-touch');
						}
						this.built = true;
					}
				}, {
					key: 'reload',
					value: function reload() {
						this.init();
					}
				}, {
					key: 'close',
					value: function close() {
						var _this10 = this;
						if (this.closing) {
							return false;
						}
						this.closing = true;
						this.stopSlideVideo(this.activeSlide);
						addClass(this.modal, 'glightbox-closing');
						animateElement(this.overlay, this.settings.openEffect == 'none' ? 'none' : this.settings.cssEfects.fade.out);
						animateElement(this.activeSlide, this.settings.closeEffect, function () {
							_this10.activeSlide = null;
							_this10.prevActiveSlideIndex = null;
							_this10.prevActiveSlide = null;
							_this10.built = false;
							if (_this10.events) {
								for (var key in _this10.events) {
									if (_this10.events.hasOwnProperty(key)) {
										_this10.events[key].destroy();
									}
								}
							}
							removeClass(body, 'glightbox-open');
							removeClass(html, 'glightbox-open');
							removeClass(body, 'touching');
							removeClass(body, 'gdesc-open');
							body.style.width = '';
							_this10.modal.parentNode.removeChild(_this10.modal);
							if (utils.isFunction(_this10.settings.onClose)) {
								_this10.settings.onClose();
							}
							_this10.closing = null;
						});
					}
				}, {
					key: 'destroy',
					value: function destroy() {
						this.close();
						this.baseEvents.destroy();
					}
				}
			]);
		return GlightboxInit;
	}
	();
	module.exports = function () {
		var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
		var instance = new GlightboxInit(options);
		instance.init();
		return instance;
	};
/*jshint validthis: false */
});
/*jshint +W069 */

/*jshint esnext: false */
