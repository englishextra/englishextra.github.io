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
(function (root) {
	"use strict";
	var verge = (function () {
		var xports = {},
		win = typeof root !== "undefined" && root,
		doc = typeof document !== "undefined" && document,
		docElem = doc && doc.documentElement,
		matchMedia = win.matchMedia || win.msMatchMedia,
		mq = matchMedia ? function (q) {
			return !!matchMedia.call(win, q).matches;
		}
		 : function () {
			return false;
		},
		viewportW = xports.viewportW = function () {
			var a = docElem.clientWidth,
			b = win.innerWidth;
			return a < b ? b : a;
		},
		viewportH = xports.viewportH = function () {
			var a = docElem.clientHeight,
			b = win.innerHeight;
			return a < b ? b : a;
		};
		xports.mq = mq;
		xports.matchMedia = matchMedia ? function () {
			return matchMedia.apply(win, arguments);
		}
		 : function () {
			return {};
		};
		function viewport() {
			return {
				"width": viewportW(),
				"height": viewportH()
			};
		}
		xports.viewport = viewport;
		xports.scrollX = function () {
			return win.pageXOffset || docElem.scrollLeft;
		};
		xports.scrollY = function () {
			return win.pageYOffset || docElem.scrollTop;
		};
		function calibrate(coords, cushion) {
			var o = {};
			cushion = +cushion || 0;
			o.width = (o.right = coords.right + cushion) - (o.left = coords.left - cushion);
			o.height = (o.bottom = coords.bottom + cushion) - (o.top = coords.top - cushion);
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
		xports.inX = function (el, cushion) {
			var r = rectangle(el, cushion);
			return !!r && r.right >= 0 && r.left <= viewportW() && (0 !== el.offsetHeight);
		};
		xports.inY = function (el, cushion) {
			var r = rectangle(el, cushion);
			return !!r && r.bottom >= 0 && r.top <= viewportH() && (0 !== el.offsetHeight);
		};
		xports.inViewport = function (el, cushion) {
			var r = rectangle(el, cushion);
			return !!r && r.bottom >= 0 && r.right >= 0 && r.top <= viewportH() && r.left <= viewportW() && (0 !== el.offsetHeight);
		};
		return xports;
	})();
	root.verge = verge;
})("undefined" !== typeof window ? window : this);
