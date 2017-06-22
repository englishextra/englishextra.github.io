/*jslint browser: true */
/*jslint node: true */
/*global global, $, ActiveXObject, alignToMasterBottomLeft, appendFragment, BALA,
Carousel, changeLocation, container, Cookies, debounce, define,
DISQUS, DoSlide, Draggabilly, earlyDeviceOrientation, earlyDeviceSize,
earlyDeviceType, earlyFnGetYyyymmdd, earlyHasTouch,
earlySvgasimgSupport, earlySvgSupport, escape, fetch, findPos,
fixEnRuTypo, forEach, getHTTP, getKeyValuesFromJSON, IframeLightbox,
imagePromise, imagesLoaded, imagesPreloaded, insertExternalHTML,
insertTextAsFragment, Isotope, isValidId, jQuery, Kamil,
loadExternalHTML, loadJS, loadUnparsedJSON, manageDataSrcImages,
manageImgLightboxLinks, Masonry, module, openDeviceBrowser, Packery,
Parallax, parseLink, PhotoSwipe, PhotoSwipeUI_Default, pnotify,
prependFragmentBefore, prettyPrint, Promise, Proxy, QRCode,
removeChildren, removeElement, require, routie, safelyParseJSON,
scriptIsLoaded, scroll2Top, scrollToTop,
setImmediate, setStyleDisplayBlock, setStyleDisplayNone,
setStyleOpacity, setStyleVisibilityHidden, setStyleVisibilityVisible, t,
Tablesort, throttle, Timers, ToProgress, truncString, unescape, verge,
VK, Ya, ymaps */
/*!
 * define global root
 */
/* var globalRoot = "object" === typeof window && window || "object" === typeof self && self || "object" === typeof global && global || {}; */
var globalRoot = "undefined" !== typeof window ? window : this;
/*!
 * safe way to handle console.log
 * @see {@link https://github.com/paulmillr/console-polyfill}
 */
(function (root) {
	"use strict";
	if (!root.console) {
		root.console = {};
	}var con = root.console;var prop, method;var dummy = function () {};var properties = ["memory"];var methods = ("assert,clear,count,debug,dir,dirxml,error,exception,group," + "groupCollapsed,groupEnd,info,log,markTimeline,profile,profiles,profileEnd," + "show,table,time,timeEnd,timeline,timelineEnd,timeStamp,trace,warn").split(",");while (prop = properties.pop()) {
		if (!con[prop]) {
			con[prop] = {};
		}
	}while (method = methods.pop()) {
		if (!con[method]) {
			con[method] = dummy;
		}
	}
})(globalRoot);
/*!
 * modified ToProgress v0.1.1
 * @see {@link https://github.com/djyde/ToProgress}
 * @see {@link https://gist.github.com/englishextra/6a8c79c9efbf1f2f50523d46a918b785}
 * @see {@link https://jsfiddle.net/englishextra/z5xhjde8/}
 * arguments.callee changed to TP, a local wrapper function,
 * so that public function name is now customizable;
 * wrapped in curly brackets:
 * else{document.body.appendChild(this.progressBar);};
 * removed module check
 * passes jshint
 */
(function (root) {
	"use strict";
	var ToProgress = function () {
		var TP = function () {
			var t = function () {
				var s = document.createElement("fakeelement"),
				    i = { transition: "transitionend", OTransition: "oTransitionEnd", MozTransition: "transitionend", WebkitTransition: "webkitTransitionEnd" };for (var j in i) {
					if (i.hasOwnProperty(j)) {
						if (void 0 !== s.style[j]) {
							return i[j];
						}
					}
				}
			},
			    s = function (t, a) {
				if (this.progress = 0, this.options = { id: "top-progress-bar", color: "#F44336", height: "2px", duration: 0.2 }, t && "object" === typeof t) {
					for (var i in t) {
						if (t.hasOwnProperty(i)) {
							this.options[i] = t[i];
						}
					}
				}if (this.options.opacityDuration = 3 * this.options.duration, this.progressBar = document.createElement("div"), this.progressBar.id = this.options.id, this.progressBar.setCSS = function (t) {
					for (var a in t) {
						if (t.hasOwnProperty(a)) {
							this.style[a] = t[a];
						}
					}
				}, this.progressBar.setCSS({ position: a ? "relative" : "fixed", top: "0", left: "0", right: "0", "background-color": this.options.color, height: this.options.height, width: "0%", transition: "width " + this.options.duration + "s, opacity " + this.options.opacityDuration + "s", "-moz-transition": "width " + this.options.duration + "s, opacity " + this.options.opacityDuration + "s", "-webkit-transition": "width " + this.options.duration + "s, opacity " + this.options.opacityDuration + "s" }), a) {
					var o = document.querySelector(a);if (o) {
						if (o.hasChildNodes()) {
							o.insertBefore(this.progressBar, o.firstChild);
						} else {
							o.appendChild(this.progressBar);
						}
					}
				} else {
					document.body.appendChild(this.progressBar);
				}
			},
			    i = t();return s.prototype.transit = function () {
				this.progressBar.style.width = this.progress + "%";
			}, s.prototype.getProgress = function () {
				return this.progress;
			}, s.prototype.setProgress = function (t, s) {
				this.show();this.progress = t > 100 ? 100 : 0 > t ? 0 : t;this.transit();if (s) {
					s();
				}
			}, s.prototype.increase = function (t, s) {
				this.show();this.setProgress(this.progress + t, s);
			}, s.prototype.decrease = function (t, s) {
				this.show();this.setProgress(this.progress - t, s);
			}, s.prototype.finish = function (t) {
				var s = this;this.setProgress(100, t);this.hide();if (i) {
					this.progressBar.addEventListener(i, function (t) {
						s.reset();s.progressBar.removeEventListener(t.type, TP);
					});
				}
			}, s.prototype.reset = function (t) {
				this.progress = 0;this.transit();if (t) {
					t();
				}
			}, s.prototype.hide = function () {
				this.progressBar.style.opacity = "0";
			}, s.prototype.show = function () {
				this.progressBar.style.opacity = "1";
			}, s;
		};return TP();
	}();root.ToProgress = ToProgress;
})(globalRoot);
/*!
 * modified scrollToY
 * @see {@link http://stackoverflow.com/questions/8917921/cross-browser-javascript-not-jquery-scroll-to-top-animation}
 * passes jshint
 */
(function (root) {
	"use strict";
	var scroll2Top = function (scrollTargetY, speed, easing) {
		var scrollY = root.scrollY || document.documentElement.scrollTop;scrollTargetY = scrollTargetY || 0;speed = speed || 2000;easing = easing || 'easeOutSine';var currentTime = 0;var time = Math.max(0.1, Math.min(Math.abs(scrollY - scrollTargetY) / speed, 0.8));var easingEquations = { easeOutSine: function (pos) {
				return Math.sin(pos * (Math.PI / 2));
			}, easeInOutSine: function (pos) {
				return -0.5 * (Math.cos(Math.PI * pos) - 1);
			}, easeInOutQuint: function (pos) {
				if ((pos /= 0.5) < 1) {
					return 0.5 * Math.pow(pos, 5);
				}return 0.5 * (Math.pow(pos - 2, 5) + 2);
			} };function tick() {
			currentTime += 1 / 60;var p = currentTime / time;var t = easingEquations[easing](p);if (p < 1) {
				requestAnimationFrame(tick);root.scrollTo(0, scrollY + (scrollTargetY - scrollY) * t);
			} else {
				root.scrollTo(0, scrollTargetY);
			}
		}tick();
	};root.scroll2Top = scroll2Top;
})(globalRoot);
/*!
 * A function for elements selection - v0.1.9
 * @see {@link https://github.com/finom/bala}
 * @param {String} a id, class or tag string
 * @param {String|Object} [b] context tag string or HTML Element object
 * a=BALA("sometag/#someid/.someclass"[,someParent]);
 * a=BALA.one("sometag/#someid/.someclass"[,someParent]);
 * global $ becomes var g
 * renamed function $ to g
 * @see {@link https://github.com/finom/bala/blob/master/bala.js}
 * passes jshint
 */
(function (root) {
	"use strict";
	var BALA = function () {
		var g = function (document, s_addEventListener, s_querySelectorAll) {
			function g(s, context, bala) {
				bala = Object.create(g.fn);if (s) {
					bala.push.apply(bala, s[s_addEventListener] ? [s] : "" + s === s ? /</.test(s) ? ((context = document.createElement(context || s_addEventListener)).innerHTML = s, context.children) : context ? (context = g(context)[0]) ? context[s_querySelectorAll](s) : bala : document[s_querySelectorAll](s) : typeof s === "function" ? document.readyState[7] ? s() : document[s_addEventListener]('DOMContentLoaded', s) : s);
				}return bala;
			}g.fn = [];g.one = function (s, context) {
				return g(s, context)[0] || null;
			};return g;
		}(document, 'addEventListener', 'querySelectorAll');return g;
	}();root.BALA = BALA;
})(globalRoot);
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
(function (doc, win) {
	"use strict";
	if (typeof doc.createEvent !== "function") {
		return false;
	}var pointerEventSupport = function (type) {
		var lo = type.toLowerCase(),
		    ms = "MS" + type;return navigator.msPointerEnabled ? ms : win.PointerEvent ? lo : false;
	},
	    defaults = { useJquery: !win.IGNORE_JQUERY && typeof jQuery !== "undefined", swipeThreshold: win.SWIPE_THRESHOLD || 100, tapThreshold: win.TAP_THRESHOLD || 150, dbltapThreshold: win.DBL_TAP_THRESHOLD || 200, longtapThreshold: win.LONG_TAP_THRESHOLD || 1000, tapPrecision: win.TAP_PRECISION / 2 || 60 / 2, justTouchEvents: win.JUST_ON_TOUCH_DEVICES },
	    wasTouch = false,
	    touchevents = { touchstart: pointerEventSupport("PointerDown") || "touchstart", touchend: pointerEventSupport("PointerUp") || "touchend", touchmove: pointerEventSupport("PointerMove") || "touchmove" },
	    isTheSameFingerId = function (e) {
		return !e.pointerId || typeof pointerId === "undefined" || e.pointerId === pointerId;
	},
	    setListener = function (elm, events, callback) {
		var eventsArray = events.split(" "),
		    i = eventsArray.length;while (i--) {
			elm.addEventListener(eventsArray[i], callback, false);
		}
	},
	    getPointerEvent = function (event) {
		return event.targetTouches ? event.targetTouches[0] : event;
	},
	    getTimestamp = function () {
		return new Date().getTime();
	},
	    sendEvent = function (elm, eventName, originalEvent, data) {
		var customEvent = doc.createEvent("Event");customEvent.originalEvent = originalEvent;data = data || {};data.x = currX;data.y = currY;data.distance = data.distance;if (defaults.useJquery) {
			customEvent = jQuery.Event(eventName, { originalEvent: originalEvent });jQuery(elm).trigger(customEvent, data);
		}if (customEvent.initEvent) {
			for (var key in data) {
				if (data.hasOwnProperty(key)) {
					customEvent[key] = data[key];
				}
			}customEvent.initEvent(eventName, true, true);elm.dispatchEvent(customEvent);
		}while (elm) {
			if (elm["on" + eventName]) {
				elm["on" + eventName](customEvent);
			}elm = elm.parentNode;
		}
	},
	    onTouchStart = function (e) {
		if (!isTheSameFingerId(e)) {
			return;
		}pointerId = e.pointerId;if (e.type !== "mousedown") {
			wasTouch = true;
		}if (e.type === "mousedown" && wasTouch) {
			return;
		}var pointer = getPointerEvent(e);cachedX = currX = pointer.pageX;cachedY = currY = pointer.pageY;longtapTimer = setTimeout(function () {
			sendEvent(e.target, "longtap", e);target = e.target;
		}, defaults.longtapThreshold);timestamp = getTimestamp();tapNum++;
	},
	    onTouchEnd = function (e) {
		if (!isTheSameFingerId(e)) {
			return;
		}pointerId = undefined;if (e.type === "mouseup" && wasTouch) {
			wasTouch = false;return;
		}var eventsArr = [],
		    now = getTimestamp(),
		    deltaY = cachedY - currY,
		    deltaX = cachedX - currX;clearTimeout(dblTapTimer);clearTimeout(longtapTimer);if (deltaX <= -defaults.swipeThreshold) {
			eventsArr.push("swiperight");
		}if (deltaX >= defaults.swipeThreshold) {
			eventsArr.push("swipeleft");
		}if (deltaY <= -defaults.swipeThreshold) {
			eventsArr.push("swipedown");
		}if (deltaY >= defaults.swipeThreshold) {
			eventsArr.push("swipeup");
		}if (eventsArr.length) {
			for (var i = 0; i < eventsArr.length; i++) {
				var eventName = eventsArr[i];sendEvent(e.target, eventName, e, { distance: { x: Math.abs(deltaX), y: Math.abs(deltaY) } });
			}tapNum = 0;
		} else {
			if (cachedX >= currX - defaults.tapPrecision && cachedX <= currX + defaults.tapPrecision && cachedY >= currY - defaults.tapPrecision && cachedY <= currY + defaults.tapPrecision) {
				if (timestamp + defaults.tapThreshold - now >= 0) {
					sendEvent(e.target, tapNum >= 2 && target === e.target ? "dbltap" : "tap", e);target = e.target;
				}
			}dblTapTimer = setTimeout(function () {
				tapNum = 0;
			}, defaults.dbltapThreshold);
		}
	},
	    onTouchMove = function (e) {
		if (!isTheSameFingerId(e)) {
			return;
		}if (e.type === "mousemove" && wasTouch) {
			return;
		}var pointer = getPointerEvent(e);currX = pointer.pageX;currY = pointer.pageY;
	},
	    tapNum = 0,
	    pointerId,
	    currX,
	    currY,
	    cachedX,
	    cachedY,
	    timestamp,
	    target,
	    dblTapTimer,
	    longtapTimer;setListener(doc, touchevents.touchstart + (defaults.justTouchEvents ? "" : " mousedown"), onTouchStart);setListener(doc, touchevents.touchend + (defaults.justTouchEvents ? "" : " mouseup"), onTouchEnd);setListener(doc, touchevents.touchmove + (defaults.justTouchEvents ? "" : " mousemove"), onTouchMove);win.tocca = function (options) {
		for (var opt in options) {
			if (options.hasOwnProperty(opt)) {
				defaults[opt] = options[opt];
			}
		}return defaults;
	};
})(document, globalRoot);
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
	var verge = function () {
		var xports = {},
		    win = typeof root !== "undefined" && root,
		    doc = typeof document !== "undefined" && document,
		    docElem = doc && doc.documentElement,
		    matchMedia = win.matchMedia || win.msMatchMedia,
		    mq = matchMedia ? function (q) {
			return !!matchMedia.call(win, q).matches;
		} : function () {
			return false;
		},
		    viewportW = xports.viewportW = function () {
			var a = docElem.clientWidth,
			    b = win.innerWidth;return a < b ? b : a;
		},
		    viewportH = xports.viewportH = function () {
			var a = docElem.clientHeight,
			    b = win.innerHeight;return a < b ? b : a;
		};xports.mq = mq;xports.matchMedia = matchMedia ? function () {
			return matchMedia.apply(win, arguments);
		} : function () {
			return {};
		};function viewport() {
			return { "width": viewportW(), "height": viewportH() };
		}xports.viewport = viewport;xports.scrollX = function () {
			return win.pageXOffset || docElem.scrollLeft;
		};xports.scrollY = function () {
			return win.pageYOffset || docElem.scrollTop;
		};function calibrate(coords, cushion) {
			var o = {};cushion = +cushion || 0;o.width = (o.right = coords.right + cushion) - (o.left = coords.left - cushion);o.height = (o.bottom = coords.bottom + cushion) - (o.top = coords.top - cushion);return o;
		}function rectangle(el, cushion) {
			el = el && !el.nodeType ? el[0] : el;if (!el || 1 !== el.nodeType) {
				return false;
			}return calibrate(el.getBoundingClientRect(), cushion);
		}xports.rectangle = rectangle;function aspect(o) {
			o = null === o ? viewport() : 1 === o.nodeType ? rectangle(o) : o;var h = o.height,
			    w = o.width;h = typeof h === "function" ? h.call(o) : h;w = typeof w === "function" ? w.call(o) : w;return w / h;
		}xports.aspect = aspect;xports.inX = function (el, cushion) {
			var r = rectangle(el, cushion);return !!r && r.right >= 0 && r.left <= viewportW() && 0 !== el.offsetHeight;
		};xports.inY = function (el, cushion) {
			var r = rectangle(el, cushion);return !!r && r.bottom >= 0 && r.top <= viewportH() && 0 !== el.offsetHeight;
		};xports.inViewport = function (el, cushion) {
			var r = rectangle(el, cushion);return !!r && r.bottom >= 0 && r.right >= 0 && r.top <= viewportH() && r.left <= viewportW() && 0 !== el.offsetHeight;
		};return xports;
	}();root.verge = verge;
})(globalRoot);
/*!
 * return image is loaded promise
 * @see {@link https://jsfiddle.net/englishextra/56pavv7d/}
 * @param {String|Object} s image path string or HTML DOM Image Object
 * var m = document.querySelector("img") || "";
 * var s = m.src || "";
 * imagePromise(m).then(function (r) {
 * alert(r);
 * }).catch (function (err) {
 * alert(err);
 * });
 * imagePromise(s).then(function (r) {
 * alert(r);
 * }).catch (function (err) {
 * alert(err);
 * });
 * @see {@link https://gist.github.com/englishextra/3e95d301d1d47fe6e26e3be198f0675e}
 * passes jshint
 */
(function (root) {
	"use strict";
	var imagePromise = function (s) {
		if (root.Promise) {
			return new Promise(function (y, n) {
				var f = function (e, p) {
					e.onload = function () {
						y(p);
					};e.onerror = function () {
						n(p);
					};e.src = p;
				};if ("string" === typeof s) {
					var a = new Image();f(a, s);
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
	};globalRoot.imagePromise = imagePromise;
})(globalRoot);
/*!
 * safe way to handle console.log
 * @see {@link https://github.com/paulmillr/console-polyfill}
 */
(function (root) {
	"use strict";
	if (!root.console) {
		root.console = {};
	}var con = root.console;var prop, method;var dummy = function () {};var properties = ["memory"];var methods = ("assert,clear,count,debug,dir,dirxml,error,exception,group," + "groupCollapsed,groupEnd,info,log,markTimeline,profile,profiles,profileEnd," + "show,table,time,timeEnd,timeline,timelineEnd,timeStamp,trace,warn").split(",");while (prop = properties.pop()) {
		if (!con[prop]) {
			con[prop] = {};
		}
	}while (method = methods.pop()) {
		if (!con[method]) {
			con[method] = dummy;
		}
	}
})(globalRoot);
/*!
 * add js class to html element
 */
(function (classes) {
	"use strict";
	if (classes) {
		classes.add("js");
	}
})(document.documentElement.classList || "");
/*!
 * modified MediaHack - (c) 2013 Pomke Nohkan MIT LICENCED.
 * @see {@link https://gist.github.com/englishextra/ff8c9dde94abe32a9d7c4a65e0f2ccac}
 * @see {@link https://jsfiddle.net/englishextra/xg7ce8kc/}
 * removed className fallback and additionally
 * returns earlyDeviceOrientation,earlyDeviceSize
 * Add media query classes to DOM nodes
 * @see {@link https://github.com/pomke/mediahack/blob/master/mediahack.js}
 */
(function (root, selectors) {
	"use strict";
	var orientation,
	    size,
	    f = function (a) {
		var b = a.split(" ");if (selectors) {
			for (var c = 0; c < b.length; c += 1) {
				a = b[c];selectors.add(a);
			}
		}
	},
	    g = function (a) {
		var b = a.split(" ");if (selectors) {
			for (var c = 0; c < b.length; c += 1) {
				a = b[c];selectors.remove(a);
			}
		}
	},
	    h = { landscape: "all and (orientation:landscape)", portrait: "all and (orientation:portrait)" },
	    k = { small: "all and (max-width:768px)", medium: "all and (min-width:768px) and (max-width:991px)", large: "all and (min-width:992px)" },
	    d,
	    mM = "matchMedia",
	    m = "matches",
	    o = function (a, b) {
		var c = function (a) {
			if (a[m]) {
				f(b);orientation = b;
			} else {
				g(b);
			}
		};c(a);a.addListener(c);
	},
	    s = function (a, b) {
		var c = function (a) {
			if (a[m]) {
				f(b);size = b;
			} else {
				g(b);
			}
		};c(a);a.addListener(c);
	};for (d in h) {
		if (h.hasOwnProperty(d)) {
			o(root[mM](h[d]), d);
		}
	}for (d in k) {
		if (k.hasOwnProperty(d)) {
			s(root[mM](k[d]), d);
		}
	}root.earlyDeviceOrientation = orientation || "";root.earlyDeviceSize = size || "";
})(globalRoot, document.documentElement.classList || "");
/*!
 * add mobile or desktop class
 * using Detect Mobile Browsers | Open source mobile phone detection
 * Regex updated: 1 August 2014
 * detectmobilebrowsers.com
 * @see {@link https://github.com/heikojansen/plack-middleware-detectmobilebrowsers}
 */
(function (root, html, mobile, desktop, opera) {
	"use strict";
	var selector = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(opera) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(opera.substr(0, 4)) ? mobile : desktop;if (html) {
		html.classList.add(selector);
	}root.earlyDeviceType = selector || "";
})(globalRoot, document.documentElement || "", "mobile", "desktop", navigator.userAgent || navigator.vendor || globalRoot.opera);
/*!
 * add svg support class
 */
(function (root, html, selector) {
	"use strict";
	selector = document.implementation.hasFeature("http://www.w3.org/2000/svg", "1.1") ? selector : "no-" + selector;if (html) {
		html.classList.add(selector);
	}root.earlySvgSupport = selector || "";
})(globalRoot, document.documentElement || "", "svg");
/*!
 * add svgasimg support class
 */
(function (root, html, selector) {
	"use strict";
	selector = document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image", "1.1") ? selector : "no-" + selector;if (html) {
		html.classList.add(selector);
	}root.earlySvgasimgSupport = selector || "";
})(globalRoot, document.documentElement || "", "svgasimg");
/*!
 * add touch support class
 * @see {@link https://gist.github.com/englishextra/3cb22aab31a52b6760b5921e4fe8db95}
 * @see {@link https://jsfiddle.net/englishextra/z5xhjde8/}
 */
(function (root, html, selector) {
	"use strict";
	selector = "ontouchstart" in html ? selector : "no-" + selector;if (html) {
		html.classList.add(selector);
	}root.earlyHasTouch = selector || "";
})(globalRoot, document.documentElement || "", "touch");
/*!
 * return date in YYYY-MM-DD format
 */
(function (root) {
	"use strict";
	var newDate = new Date(),
	    newDay = newDate.getDate(),
	    newYear = newDate.getFullYear(),
	    newMonth = newDate.getMonth();newMonth += 1;if (10 > newDay) {
		newDay = "0" + newDay;
	}if (10 > newMonth) {
		newMonth = "0" + newMonth;
	}root.earlyFnGetYyyymmdd = newYear + "-" + newMonth + "-" + newDay;
})(globalRoot);
/*!
 * append details to title
 */
var userBrowsingDetails = " [" + (earlyFnGetYyyymmdd ? earlyFnGetYyyymmdd : "") + (earlyDeviceType ? " " + earlyDeviceType : "") + (earlyDeviceSize ? " " + earlyDeviceSize : "") + (earlyDeviceOrientation ? " " + earlyDeviceOrientation : "") + (earlySvgSupport ? " " + earlySvgSupport : "") + (earlySvgasimgSupport ? " " + earlySvgasimgSupport : "") + (earlyHasTouch ? " " + earlyHasTouch : "") + "]";
if (document.title) {
	document.title = document.title + userBrowsingDetails;
}
/*!
 * modified JavaScript Sync/Async forEach - v0.1.2 - 1/10/2012
 * @see {@link https://github.com/millermedeiros/amd-utils/issues/17}
 * @see {@link https://github.com/cowboy/javascript-sync-async-foreach}
 * @see {@link http://stackoverflow.com/questions/22335853/hack-to-convert-javascript-number-to-uint32}
 * @see {@link https://jsfiddle.net/englishextra/voq0bb62/}
 * Copyright (c) 2012 "Cowboy" Ben Alman; Licensed MIT
 * removed Node.js / browser support wrapper function
 * @param {Object} a Any object to walk through
 * @param {Object} b The sync callback function
 * @param {Object} [c] The async callback function
 * forEach(a,function(e){console.log("eachCallback: "+e);},!1});
 * forEach(a,function(e){console.log("eachCallback: "+e);},function(){console.log("doneCallback");});
 * @see {@link https://github.com/cowboy/javascript-sync-async-foreach/blob/master/dist/ba-foreach.js}
 * passes jshint
 */
(function (root) {
	"use strict";
	root.forEach = function (arr, eachFn, doneFn) {
		var i = -1;var len = function (val) {
			val = +val;if (!isFinite(val) || !val) {
				return 0;
			}return function (left, right) {
				return left - right * Math.floor(left / right);
			}(Math.floor(val), Math.pow(2, 32));
		}(arr.length);(function next(result) {
			var async;var abort = result === false;do {
				++i;
			} while (!(i in arr) && i !== len);if (abort || i === len) {
				if (doneFn) {
					doneFn(!abort, arr);
				}return;
			}result = eachFn.call({ async: function () {
					async = true;return next;
				} }, arr[i], i, arr);if (!async) {
				next(result);
			}
		})();
	};
})(globalRoot);
/*!
 * Timer management (setInterval / setTimeout)
 * @param {Function} fn
 * @param {Number} ms
 * var timers = new Timers();
 * timers.timeout(function () {
 * console.log("before:", timers);
 * timers.clear();
 * timers = null;
 * doSomething();
 * console.log("after:", timers);
 * }, 3000);
 * @see {@link https://github.com/component/timers}
 * @see {@link https://github.com/component/timers/blob/master/index.js}
 * passes jshint
 */
(function (root) {
	var Timers = function (ids) {
		this.ids = ids || [];
	};Timers.prototype.timeout = function (fn, ms) {
		var id = setTimeout(fn, ms);this.ids.push(id);return id;
	};Timers.prototype.interval = function (fn, ms) {
		var id = setInterval(fn, ms);this.ids.push(id);return id;
	};Timers.prototype.clear = function () {
		this.ids.forEach(clearTimeout);this.ids = [];
	};root.Timers = Timers;
})(globalRoot);
/*!
 * modified Returns a function, that, as long as it continues to be invoked, will not
 * be triggered. The function will be called after it stops being called for
 * N milliseconds. If `immediate` is passed, trigger the function on the
 * leading edge, instead of the trailing. The function also has a property 'clear'
 * that is a function which will clear the timer to prevent previously scheduled executions.
 * @source underscore.js
 * @see http://unscriptable.com/2009/03/20/debouncing-javascript-methods/
 * @param {Function} function to wrap
 * @param {Number} timeout in ms (`100`)
 * @param {Boolean} whether to execute at the beginning (`false`)
 * @api public
 * @see {@link https://github.com/component/debounce/blob/master/index.js}
 * passes jshint
 */
(function (root, undefined) {
	var debounce = function (func, wait, immediate) {
		var timeout, args, context, timestamp, result;if (undefined === wait || null === wait) {
			wait = 100;
		}function later() {
			var last = Date.now() - timestamp;if (last < wait && last >= 0) {
				timeout = setTimeout(later, wait - last);
			} else {
				timeout = null;if (!immediate) {
					result = func.apply(context, args);context = args = null;
				}
			}
		}var debounced = function () {
			context = this;args = arguments;timestamp = Date.now();var callNow = immediate && !timeout;if (!timeout) {
				timeout = setTimeout(later, wait);
			}if (callNow) {
				result = func.apply(context, args);context = args = null;
			}return result;
		};debounced.clear = function () {
			if (timeout) {
				clearTimeout(timeout);timeout = null;
			}
		};debounced.flush = function () {
			if (timeout) {
				result = func.apply(context, args);context = args = null;clearTimeout(timeout);timeout = null;
			}
		};return debounced;
	};root.debounce = debounce;
})(globalRoot);
/*!
 * modified Returns a new function that, when invoked, invokes `func` at most once per `wait` milliseconds.
 * @param {Function} func Function to wrap.
 * @param {Number} wait Number of milliseconds that must elapse between `func` invocations.
 * @return {Function} A new function that wraps the `func` function passed in.
 * @see {@link https://github.com/component/throttle/blob/master/index.js}
 * passes jshint
 */
(function (root, undefined) {
	var throttle = function (func, wait) {
		var ctx, args, rtn, timeoutID;var last = 0;return function throttled() {
			ctx = this;args = arguments;var delta = new Date() - last;if (!timeoutID) {
				if (delta >= wait) {
					call();
				} else {
					timeoutID = setTimeout(call, wait - delta);
				}
			}return rtn;
		};function call() {
			timeoutID = 0;last = +new Date();rtn = func.apply(ctx, args);ctx = null;args = null;
		}
	};root.throttle = throttle;
})(globalRoot);
/*!
 * A simple promise-compatible "document ready" event handler with a few extra treats.
 * With browserify/webpack:
 * const ready = require('document-ready-promise')
 * ready().then(function(){})
 * If in a non-commonjs environment, just include the script. It will attach document.ready for you.
 * document.ready().then(function() {})
 * The document.ready promise will preserve any values that you may be passing through the promise chain.
 * Using ES2015 and fetch
 * fetch(new Request('kitten.jpg'))
 * .then(response => response.blob())
 * .then(document.ready)
 * .then(blob => document.querySelector("img").src = URL.createObjectURL(blob))
 * @see {@link https://github.com/michealparks/document-ready-promise}
 * @see {@link https://github.com/michealparks/document-ready-promise/blob/master/document-ready-promise.js}
 * passes jshint
 */
(function (document, promise) {
	document.ready = promise;
})(globalRoot.document, function (chainVal) {
	"use strict";
	var d = document,
	    w = globalRoot,
	    loaded = /^loaded|^i|^c/.test(d.readyState),
	    DOMContentLoaded = "DOMContentLoaded",
	    load = "load";return new Promise(function (resolve) {
		if (loaded) {
			return resolve(chainVal);
		}function onReady() {
			resolve(chainVal);d.removeEventListener(DOMContentLoaded, onReady);w.removeEventListener(load, onReady);
		}d.addEventListener(DOMContentLoaded, onReady);w.addEventListener(load, onReady);
	});
});
/*!
 * How can I check if a JS file has been included already?
 * @see {@link https://gist.github.com/englishextra/403a0ca44fc5f495400ed0e20bc51d47}
 * @see {@link https://stackoverflow.com/questions/18155347/how-can-i-check-if-a-js-file-has-been-included-already}
 * @param {String} s path string
 * scriptIsLoaded(s)
 */
(function (root) {
	"use strict";
	var scriptIsLoaded = function (s) {
		for (var b = document.getElementsByTagName("script") || "", a = 0; a < b.length; a += 1) {
			if (b[a].getAttribute("src") === s) {
				return !0;
			}
		}return !1;
	};root.scriptIsLoaded = scriptIsLoaded;
})(globalRoot);
/*!
 * Load and execute JS via AJAX
 * @see {@link https://gist.github.com/englishextra/8dc9fe7b6ff8bdf5f9b483bf772b9e1c}
 * IE 5.5+, Firefox, Opera, Chrome, Safari XHR object
 * @see {@link https://gist.github.com/Xeoncross/7663273}
 * modified callback(x.responseText,x); to callback(eval(x.responseText),x);
 * @see {@link https://stackoverflow.com/questions/3728798/running-javascript-downloaded-with-xmlhttprequest}
 * @param {String} url path string
 * @param {Object} [callback] callback function
 * @param {Object} [onerror] on error callback function
 * loadTriggerJS(url,callback,onerror)
 */
(function (root) {
	"use strict";
	var loadTriggerJS = function (url, callback, onerror) {
		var cb = function (string) {
			return callback && "function" === typeof callback && callback(string);
		},
		    fn = function (string) {
			try {
				var Fn = Function;new Fn("" + string).call(root);
			} catch (err) {
				throw new Error("Error evaluating file " + url, err);
			}
		};if (root.Promise && root.fetch && !root.chrome && !("undefined" !== typeof root && root.process && "renderer" === root.process.type)) {
			fetch(url).then(function (response) {
				if (!response.ok) {
					if (onerror && "function" === typeof onerror) {
						onerror();
					} else {
						throw new Error(response.statusText);
					}
				}return response;
			}).then(function (response) {
				return response.text();
			}).then(function (text) {
				fn(text);cb(text);
			}).catch(function (err) {
				console.log("Error fetch-ing file " + url, err);
			});
		} else {
			var x = root.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");x.overrideMimeType("application/javascript;charset=utf-8");x.open("GET", url, !0);x.withCredentials = !1;x.onreadystatechange = function () {
				if (x.status === "404" || x.status === 0) {
					console.log("Error XMLHttpRequest-ing file " + url, x.status);return onerror && "function" === typeof onerror && onerror();
				} else if (x.readyState === 4 && x.status === 200 && x.responseText) {
					fn(x.responseText);cb(x.responseText);
				}
			};x.send(null);
		}
	};root.loadTriggerJS = loadTriggerJS;
})(globalRoot);
/*!
 * Load .json file, but don't JSON.parse it
 * modified JSON with JS.md
 * @see {@link https://gist.github.com/thiagodebastos/08ea551b97892d585f17}
 * @see {@link https://gist.github.com/englishextra/e2752e27761649479f044fd93a602312}
 * @param {String} url path string
 * @param {Object} [callback] callback function
 * @param {Object} [onerror] on error callback function
 * loadUnparsedJSON(url,callback,onerror)
 */
(function (root) {
	"use strict";
	var loadUnparsedJSON = function (url, callback, onerror) {
		var cb = function (string) {
			return callback && "function" === typeof callback && callback(string);
		};if (root.Promise && root.fetch && !root.chrome && !("undefined" !== typeof root && root.process && "renderer" === root.process.type)) {
			fetch(url).then(function (response) {
				if (!response.ok) {
					if (onerror && "function" === typeof onerror) {
						onerror();
					} else {
						throw new Error(response.statusText);
					}
				}return response;
			}).then(function (response) {
				return response.text();
			}).then(function (text) {
				cb(text);
			}).catch(function (err) {
				console.log("Error fetch-ing file " + url, err);
			});
		} else {
			var x = root.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");x.overrideMimeType("application/json;charset=utf-8");x.open("GET", url, !0);x.withCredentials = !1;x.onreadystatechange = function () {
				if (x.status === "404" || x.status === 0) {
					console.log("Error XMLHttpRequest-ing file", x.status);return onerror && "function" === typeof onerror && onerror();
				} else if (x.readyState === 4 && x.status === 200 && x.responseText) {
					cb(x.responseText);
				}
			};x.send(null);
		}
	};root.loadUnparsedJSON = loadUnparsedJSON;
})(globalRoot);
/*!
 * parse JSON without try / catch
 * @param {String} a JSON string
 * @see {@link http://stackoverflow.com/questions/11182924/how-to-check-if-javascript-object-is-json}
 * safelyParseJSON(a)
 */
(function (root) {
	"use strict";
	var safelyParseJSON = function (a) {
		var isJson = function (obj) {
			var t = typeof obj;return ['boolean', 'number', "string", 'symbol', "function"].indexOf(t) === -1;
		};if (!isJson(a)) {
			return JSON.parse(a);
		} else {
			return a;
		}
	};root.safelyParseJSON = safelyParseJSON;
})(globalRoot);
/*!
 * loop over the Array
 * @see {@link https://stackoverflow.com/questions/18238173/javascript-loop-through-json-array}
 * @see {@link https://gist.github.com/englishextra/b4939b3430da4b55d731201460d3decb}
 * @param {String} str any text string
 * @param {Int} max a whole positive number
 * @param {String} add any text string
 * truncString(str,max,add)
 */
(function (root) {
	"use strict";
	var truncString = function (str, max, add) {
		add = add || "\u2026";return "string" === typeof str && str.length > max ? str.substring(0, max) + add : str;
	};root.truncString = truncString;
})(globalRoot);
/*!
 * fix en ru / ru en typo
 * modified sovtime.ru/soft/convert.html
 * @see {@link https://gist.github.com/englishextra/8f398bb7a3e438b692352a3c114a13ae}
 * @see {@link https://jsfiddle.net/englishextra/6p150wu1/}
 * @see {@link https://jsbin.com/runoju/edit?js,output}
 * @param {String} e any text string
 * @param {String} a "ru" or "en", default "en"
 * @param {String} b "en" or "ru", default "ru"
 * fixEnRuTypo(e,a,b)
 */
(function (root) {
	"use strict";
	var fixEnRuTypo = function (e, a, b) {
		var c = "";if ("ru" === a && "en" === b) {
			a = '\u0430\u0431\u0432\u0433\u0434\u0435\u0451\u0436\u0437\u0438\u0439\u043a\u043b\u043c\u043d\u043e\u043f\u0440\u0441\u0442\u0443\u0444\u0445\u0446\u0447\u0448\u0449\u044a\u044c\u044b\u044d\u044e\u044f\u0410\u0411\u0412\u0413\u0414\u0415\u0401\u0416\u0417\u0418\u0419\u041a\u041b\u041c\u041d\u041e\u041f\u0420\u0421\u0422\u0423\u0424\u0425\u0426\u0427\u0428\u0429\u042a\u042c\u042b\u042d\u042e\u042f"\u2116;:?/.,';b = "f,dult`;pbqrkvyjghcnea[wxio]ms'.zF<DULT~:PBQRKVYJGHCNEA{WXIO}MS'>Z@#$^&|/?";
		} else {
			a = "f,dult`;pbqrkvyjghcnea[wxio]ms'.zF<DULT~:PBQRKVYJGHCNEA{WXIO}MS'>Z@#$^&|/?";b = '\u0430\u0431\u0432\u0433\u0434\u0435\u0451\u0436\u0437\u0438\u0439\u043a\u043b\u043c\u043d\u043e\u043f\u0440\u0441\u0442\u0443\u0444\u0445\u0446\u0447\u0448\u0449\u044a\u044c\u044b\u044d\u044e\u044f\u0410\u0411\u0412\u0413\u0414\u0415\u0401\u0416\u0417\u0418\u0419\u041a\u041b\u041c\u041d\u041e\u041f\u0420\u0421\u0422\u0423\u0424\u0425\u0426\u0427\u0428\u0429\u042a\u042c\u042b\u042d\u042e\u042f"\u2116;:?/.,';
		}for (var d = 0; d < e.length; d++) {
			var f = a.indexOf(e.charAt(d));if (c > f) {
				c += e.charAt(d);
			} else {
				c += b.charAt(f);
			}
		}return c;
	};root.fixEnRuTypo = fixEnRuTypo;
})(globalRoot);
/*!
 * remove all children of parent element
 * @see {@link https://gist.github.com/englishextra/da26bf39bc90fd29435e8ae0b409ddc3}
 * @param {Object} e parent HTML Element
 * removeChildren(e)
 */
(function (root) {
	"use strict";
	var removeChildren = function (e) {
		return function () {
			if (e && e.firstChild) {
				for (; e.firstChild;) {
					e.removeChild(e.firstChild);
				}
			}
		}();
	};root.removeChildren = removeChildren;
})(globalRoot);
/*!
 * append node into other with fragment
 * @see {@link https://gist.github.com/englishextra/0ff3204d5fb285ef058d72f31e3af766}
 * @param {String|object} e an HTML Element to append
 * @param {Object} a target HTML Element
 * appendFragment(e,a)
 */
(function (root) {
	"use strict";
	var appendFragment = function (e, a) {
		var d = document;a = a || d.getElementsByTagNames("body")[0] || "";return function () {
			if (e) {
				var d = document,
				    df = d.createDocumentFragment() || "",
				    aC = "appendChild";if ("string" === typeof e) {
					e = d.createTextNode(e);
				}df[aC](e);a[aC](df);
			}
		}();
	};root.appendFragment = appendFragment;
})(globalRoot);
/*!
 * Adds Element as fragment BEFORE NeighborElement
 * @see {@link https://gist.github.com/englishextra/fa19e39ce84982b17fc76485db9d1bea}
 * @param {String|object} e HTML Element to prepend before before
 * @param {Object} a target HTML Element
 * prependFragmentBefore(e,a)
 */
(function (root) {
	var prependFragmentBefore = function (e, a) {
		if ("string" === typeof e) {
			e = document.createTextNode(e);
		}var p = a.parentNode || "",
		    df = document.createDocumentFragment();return function () {
			if (p) {
				df.appendChild(e);p.insertBefore(df, a);
			}
		}();
	};root.prependFragmentBefore = prependFragmentBefore;
})(globalRoot);
/*!
 * set style display block of an element
 * @param {Object} a an HTML Element
 * setStyleDisplayBlock(a)
 */
(function (root) {
	var setStyleDisplayBlock = function (a) {
		return function () {
			if (a) {
				a.style.display = "block";
			}
		}();
	};root.setStyleDisplayBlock = setStyleDisplayBlock;
})(globalRoot);
/*!
 * set style display none of an element
 * @param {Object} a an HTML Element
 * setStyleDisplayNone(a)
 */
(function (root) {
	var setStyleDisplayNone = function (a) {
		return function () {
			if (a) {
				a.style.display = "none";
			}
		}();
	};root.setStyleDisplayNone = setStyleDisplayNone;
})(globalRoot);
/*!
 * set style opacity of an element
 * @param {Object} a an HTML Element
 * @param {Number} n any positive decimal number 0.00-1.00
 * setStyleOpacity(a,n)
 */
(function (root) {
	var setStyleOpacity = function (a, n) {
		n = n || 1;return function () {
			if (a) {
				a.style.opacity = n;
			}
		}();
	};root.setStyleOpacity = setStyleOpacity;
})(globalRoot);
/*!
 * set style visibility visible of an element
 * @param {Object} a an HTML Element
 * setStyleVisibilityVisible(a)
 */
(function (root) {
	var setStyleVisibilityVisible = function (a) {
		return function () {
			if (a) {
				a.style.visibility = "visible";
			}
		}();
	};root.setStyleVisibilityVisible = setStyleVisibilityVisible;
})(globalRoot);
/*!
 * set style visibility hidden of an element
 * @param {Object} a an HTML Element
 * setStyleVisibilityHidden(a)
 */
(function (root) {
	var setStyleVisibilityHidden = function (a) {
		return function () {
			if (a) {
				a.style.visibility = "hidden";
			}
		}();
	};root.setStyleVisibilityHidden = setStyleVisibilityHidden;
})(globalRoot);
/*!
 * Check if string represents a valid HTML id
 * @see {@link https://gist.github.com/englishextra/b5aaef8b555a3ba84c68a6e251db149d}
 * @see {@link https://jsfiddle.net/englishextra/z19tznau/}
 * @param {String} a text string
 * @param {Int} [full] if true, checks with leading hash/number sign
 * isValidId(a,full)
 */
(function (root) {
	"use strict";
	var isValidId = function (a, full) {
		return full ? /^\#[A-Za-z][-A-Za-z0-9_:.]*$/.test(a) ? !0 : !1 : /^[A-Za-z][-A-Za-z0-9_:.]*$/.test(a) ? !0 : !1;
	};root.isValidId = isValidId;
})(globalRoot);
/*!
 * find element's position
 * @see {@link https://stackoverflow.com/questions/5598743/finding-elements-position-relative-to-the-document}
 * @param {Object} a an HTML element
 * findPos(a).top
 */
(function (root) {
	"use strict";
	var findPos = function (a) {
		a = a.getBoundingClientRect();var b = document.body,
		    c = document.documentElement;return { top: Math.round(a.top + (root.pageYOffset || c.scrollTop || b.scrollTop) - (c.clientTop || b.clientTop || 0)), left: Math.round(a.left + (root.pageXOffset || c.scrollLeft || b.scrollLeft) - (c.clientLeft || b.clientLeft || 0)) };
	};root.findPos = findPos;
})(globalRoot);
/*!
 * change document location
 * @param {String} a URL / path string
 * changeLocation(a)
 */
(function (root) {
	var changeLocation = function (a) {
		return function () {
			if (a) {
				document.location.href = a;
			}
		}();
	};root.changeLocation = changeLocation;
})(globalRoot);
/*!
 * modified Unified URL parsing API in the browser and node
 * @see {@link https://github.com/wooorm/parse-link}
 * removed module check
 * @see {@link https://gist.github.com/englishextra/4e9a0498772f05fa5d45cfcc0d8be5dd}
 * @see {@link https://gist.github.com/englishextra/2a7fdabd0b23a8433d5fc148fb788455}
 * @see {@link https://jsfiddle.net/englishextra/fcdds4v6/}
 * @param {String} url URL string
 * @param {Boolean} [true|false] if true, returns protocol:, :port, /pathname, ?search, ?query, #hash
 * if set to false, returns protocol, port, pathname, search, query, hash
 * alert(parseLink("http://localhost/search?s=t&v=z#dev").href|
 * origin|host|port|hash|hostname|pathname|protocol|search|query|isAbsolute|isRelative|isCrossDomain);
 */
/*jshint bitwise: false */
(function (root) {
	"use strict";
	var parseLink = function (url, full) {
		full = full || !1;return function () {
			var _r = function (s) {
				return s.replace(/^(#|\?)/, "").replace(/\:$/, "");
			},
			    l = location || "",
			    _p = function (protocol) {
				switch (protocol) {case "http:":
						return full ? ":" + 80 : 80;case "https:":
						return full ? ":" + 443 : 443;default:
						return full ? ":" + l.port : l.port;}
			},
			    _s = 0 === url.indexOf("//") || !!~url.indexOf("://"),
			    w = root.location || "",
			    _o = function () {
				var o = w.protocol + "//" + w.hostname + (w.port ? ":" + w.port : "");return o || "";
			},
			    _c = function () {
				var c = document.createElement("a");c.href = url;var v = c.protocol + "//" + c.hostname + (c.port ? ":" + c.port : "");return v !== _o();
			},
			    a = document.createElement("a");a.href = url;return { href: a.href, origin: _o(), host: a.host || l.host, port: "0" === a.port || "" === a.port ? _p(a.protocol) : full ? a.port : _r(a.port), hash: full ? a.hash : _r(a.hash), hostname: a.hostname || l.hostname, pathname: a.pathname.charAt(0) !== "/" ? full ? "/" + a.pathname : a.pathname : full ? a.pathname : a.pathname.slice(1), protocol: !a.protocol || ":" === a.protocol ? full ? l.protocol : _r(l.protocol) : full ? a.protocol : _r(a.protocol), search: full ? a.search : _r(a.search), query: full ? a.search : _r(a.search), isAbsolute: _s, isRelative: !_s, isCrossDomain: _c(), hasHTTP: /^(http|https):\/\//i.test(url) ? !0 : !1 };
		}();
	};root.parseLink = parseLink;
})(globalRoot);
/*jshint bitwise: true */
/*!
 * get current protocol - "http" or "https", else return ""
 * @param {Boolean} [force] When set to "true", and the result is empty,
 * the function will return "http"
 * getHTTP(true)
 */
(function (root) {
	"use strict";
	var getHTTP = function (type) {
		return function (force) {
			force = force || "";return "http:" === type ? "http" : "https:" === type ? "https" : force ? "http" : "";
		};
	}(root.location.protocol || "");root.getHTTP = getHTTP;
})(globalRoot);
/*!
 * Open external links in default browser out of Electron / nwjs
 * @see {@link https://gist.github.com/englishextra/b9a8140e1c1b8aa01772375aeacbf49b}
 * @see {@link https://stackoverflow.com/questions/32402327/how-can-i-force-external-links-from-browser-window-to-open-in-a-default-browser}
 * @see {@link https://github.com/nwjs/nw.js/wiki/shell}
 * electron - file: | nwjs - chrome-extension: | http: Intel XDK
 * wont do in electron and nw,
 * so manageExternalLinks will set target blank to links
 * var win = w.open(url, "_blank");
 * win.focus();
 * @param {String} url URL/path string
 * openDeviceBrowser(url)
 * detect Node.js
 * @see {@link https://github.com/lyrictenor/node-is-nwjs/blob/master/is-nodejs.js}
 * @returns {Boolean} true or false
 * detect Electron
 * @returns {Boolean} true or false
 * detect NW.js
 * @see {@link https://github.com/lyrictenor/node-is-nwjs/blob/master/index.js}
 * @returns {Boolean} true or false
 */
(function (root) {
	"use strict";
	var isNodejs = "undefined" !== typeof process && "undefined" !== typeof require || "",
	    isElectron = "undefined" !== typeof root && root.process && "renderer" === root.process.type || "",
	    isNwjs = function () {
		if ("undefined" !== typeof isNodejs && isNodejs) {
			try {
				if ("undefined" !== typeof require("nw.gui")) {
					return !0;
				}
			} catch (e) {
				return !1;
			}
		}return !1;
	}(),
	    openDeviceBrowser = function (url) {
		var triggerForElectron = function () {
			var es = isElectron ? require("electron").shell : "";return es ? es.openExternal(url) : "";
		},
		    triggerForNwjs = function () {
			var ns = isNwjs ? require("nw.gui").Shell : "";return ns ? ns.openExternal(url) : "";
		},
		    triggerForHTTP = function () {
			return !0;
		},
		    triggerForLocal = function () {
			return root.open(url, "_system", "scrollbars=1,location=no");
		};if (isElectron) {
			triggerForElectron();
		} else if (isNwjs) {
			triggerForNwjs();
		} else {
			var locationProtocol = root.location.protocol || "",
			    hasHTTP = locationProtocol ? "http:" === locationProtocol ? "http" : "https:" === locationProtocol ? "https" : "" : "";if (hasHTTP) {
				triggerForHTTP();
			} else {
				triggerForLocal();
			}
		}
	};root.openDeviceBrowser = openDeviceBrowser;
})(globalRoot);
/*!
 * init ToProgress and extend methods
 */
var progressBar = new ToProgress({
	id: "top-progress-bar",
	color: "#FF2C40",
	height: "3px",
	duration: 0.2
});
/*!
 * @memberof progressBar
 * @param {Int} [n] a whole positive number
 * progressBar.init(n)
 */
progressBar.init = function (n) {
	n = n || 20;
	return this.increase(n);
};
/*!
 * @memberof progressBar
 * progressBar.complete()
 */
progressBar.complete = function () {
	return this.finish(), this.hide();
};
progressBar.init();
/*!
 * set click event on external links,
 * so that they open in new browser tab
 * @param {Object} [ctx] context HTML Element
 */
var handleExternalLink = function (p, ev) {
	"use strict";

	ev.stopPropagation();
	ev.preventDefault();
	openDeviceBrowser(p);
},
    manageExternalLinks = function (ctx) {
	"use strict";

	ctx = ctx && ctx.nodeName ? ctx : "";
	var aEL = "addEventListener",
	    cls = "a",
	    a = ctx ? BALA.one(cls, ctx) || "" : BALA.one(cls) || "",
	    g = function (e) {
		var p = e.getAttribute("href") || "";
		if (p && parseLink(p).isCrossDomain && parseLink(p).hasHTTP) {
			e.title = "" + (parseLink(p).hostname || "") + " откроется в новой вкладке";
			if ("undefined" !== typeof getHTTP && getHTTP()) {
				e.target = "_blank";
				e.rel = "noopener";
			} else {
				e[aEL]("click", handleExternalLink.bind(null, p));
			}
		}
	},
	    k = function () {
		a = ctx ? BALA(cls, ctx) || "" : BALA(cls) || "";
		for (var i = 0, l = a.length; i < l; i += 1) {
			g(a[i]);
		}
		/* forEach(a, g, !1); */
	};
	if (a) {
		/* console.log("triggered function: manageExternalLinks"); */
		k();
	}
};
document.ready().then(manageExternalLinks);
/*!
 * loading spinner
 * @requires Timers
 * @see {@link https://gist.github.com/englishextra/24ef040fbda405f7468da70e4f3b69e7}
 * @param {Object} [callback] callback function
 * @param {Int} [delay] any positive whole number, default: 500
 * LoadingSpinner.show();
 * LoadingSpinner.hide(f,n);
 */
var LoadingSpinner = function () {
	"use strict";

	var d = document,
	    b = d.body || "",
	    qS = "querySelector",
	    spinnerClass = "loading-spinner",
	    spinner = d[qS]("." + spinnerClass) || "",
	    cL = "classList",
	    cE = "createElement",
	    isActiveClass = "is-active-loading-spinner";
	/* console.log("triggered function: LoadingSpinner"); */
	if (!spinner) {
		spinner = d[cE]("div");
		spinner[cL].add(spinnerClass);
		appendFragment(spinner, b);
	}
	return {
		show: function () {
			return b[cL].contains(isActiveClass) || b[cL].add(isActiveClass);
		},
		hide: function (callback, delay) {
			delay = delay || 500;
			var timers = new Timers();
			timers.timeout(function () {
				timers.clear();
				timers = null;
				b[cL].remove(isActiveClass);
				if (callback && "function" === typeof callback) {
					callback();
				}
			}, delay);
		}
	};
}();
/*!
 * init all Masonry grids
 */
var initAllMasonry = function () {
	"use strict";

	var w = globalRoot,
	    g = ".masonry-grid",
	    h = ".masonry-grid-item",
	    k = ".masonry-grid-sizer",
	    grid = BALA.one(g) || "",
	    grid_item = BALA.one(h) || "",
	    q = function (a, c) {
		var f = function (e) {
			if (w.Masonry) {
				var msnry;
				msnry = new Masonry(e, {
					itemSelector: h,
					columnWidth: k,
					gutter: 0
				});
			} else if (w.Packery) {
				var pckry,
				    f = function (e) {
					pckry = new Packery(e, {
						itemSelector: h,
						columnWidth: k,
						gutter: 0,
						percentPosition: !0
					});
				};
				for (var j = 0, m = a.length; j < m; j += 1) {
					f(a[j]);
				}
				/* forEach(a, f, !1); */
				if (w.Draggabilly) {
					var draggie,
					    s = function (e) {
						var draggableElem = e;
						draggie = new Draggabilly(draggableElem, {});
						draggies.push(draggie);
					},
					    draggies = [];
					for (var i = 0, l = c.length; i < l; i += 1) {
						s(c[i]);
					}
					/* forEach(c, s, !1); */
					if (pckry) {
						pckry.bindDraggabillyEvents(draggie);
					}
				}
			}
		};
		for (var i = 0, l = a.length; i < l; i += 1) {
			f(a[i]);
		}
		/* forEach(a, f, !1); */
	},
	    v = function (a) {
		q(a, c);
	};
	if (grid && grid_item) {
		/* console.log("triggered function: initAllMasonry"); */
		var a = BALA(g),
		    c = BALA(h) || "";
		if (a && c) {
			v(a, c);
		}
	}
},
    loadInitAllMasonry = function () {
	"use strict";
	/* var js = "../../cdn/masonry/4.1.1/js/masonry.pkgd.fixed.min.js"; */
	/* var js = "../../cdn/packery/2.1.1/js/packery.draggabilly.pkgd.fixed.min.js"; */

	var js = "../../cdn/packery/2.1.1/js/packery.pkgd.fixed.min.js";
	if (!scriptIsLoaded(js)) {
		loadJS(js, initAllMasonry);
	}
};
document.ready().then(loadInitAllMasonry);
/*!
 * init prettyPrint
 */
var initPrettyPrint = function () {
	"use strict";

	var w = globalRoot,
	    a = BALA.one('[class^="prettyprint"]') || "";
	if (a) {
		/* console.log("triggered function: initPrettyPrint"); */
		if (w.prettyPrint) {
			prettyPrint();
		}
	}
},
    loadInitPrettyPrint = function () {
	"use strict";

	var js = "../../cdn/google-code-prettify/0.1/js/prettify.bundled.fixed.min.js";
	if (!scriptIsLoaded(js)) {
		loadJS(js, initPrettyPrint);
	}
};
document.ready().then(loadInitPrettyPrint);
/*!
 * manage data lightbox img links
 */
var hideImgLightbox = function () {
	"use strict";

	var d = document,
	    qS = "querySelector",
	    gEBTN = "getElementsByTagName",
	    cL = "classList",
	    container = d[qS](".img-lightbox-container") || "",
	    img = container ? container[gEBTN]("img")[0] || "" : "",
	    an = "animated",
	    an1 = "fadeIn",
	    an2 = "fadeInUp",
	    an3 = "fadeOut",
	    an4 = "fadeOutDown",
	    dummySrc = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
	if (container && img) {
		img[cL].remove(an2);
		img[cL].add(an4);
		var hideImg = function () {
			container[cL].remove(an);
			container[cL].remove(an3);
			img[cL].remove(an);
			img[cL].remove(an4);
			img.src = dummySrc;
			container.style.display = "none";
		},
		    hideContainer = function () {
			container[cL].remove(an1);
			container[cL].add(an3);
			var timers = new Timers();
			timers.timeout(function () {
				timers.clear();
				timers = null;
				hideImg();
			}, 400);
		};
		var timers = new Timers();
		timers.timeout(function () {
			timers.clear();
			timers = null;
			hideContainer();
		}, 400);
	}
},
    handleImgLightboxContainer = function () {
	"use strict";

	var rEL = "removeEventListener";
	if (container) {
		container[rEL]("click", handleImgLightboxContainer);
		hideImgLightbox();
	}
},
    handleImgLightboxWindow = function (ev) {
	"use strict";

	var w = globalRoot,
	    rEL = "removeEventListener";
	w[rEL]("keyup", handleImgLightboxWindow);
	if (27 === (ev.which || ev.keyCode)) {
		hideImgLightbox();
	}
},
    manageImgLightboxLinks = function (ctx) {
	"use strict";

	ctx = ctx && ctx.nodeName ? ctx : "";
	var w = globalRoot,
	    d = document,
	    b = d.body || "",
	    gEBCN = "getElementsByClassName",
	    gEBTN = "getElementsByTagName",
	    cL = "classList",
	    aEL = "addEventListener",
	    aC = "appendChild",
	    cE = "createElement",
	    gA = "getAttribute",
	    linkClass = "img-lightbox-link",
	    link = ctx ? ctx[gEBCN](linkClass) || "" : d[gEBCN](linkClass) || "",
	    containerClass = "img-lightbox-container",
	    container = d[gEBCN](containerClass)[0] || "",
	    img = container ? container[gEBTN]("img")[0] || "" : "",
	    an = "animated",
	    an1 = "fadeIn",
	    an2 = "fadeInUp",
	    isBindedClass = "is-binded",
	    dummySrc = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
	if (!container) {
		container = d[cE]("div");
		img = d[cE]("img");
		img.src = dummySrc;
		img.alt = "";
		container[aC](img);
		container[cL].add(containerClass);
		appendFragment(container, b);
	}
	var handleImgLightboxLink = function (ev) {
		ev.stopPropagation();
		ev.preventDefault();
		var _this = this;
		var logicHandleImgLightboxLink = function () {
			var _href = _this[gA]("href") || "";
			if (container && img && _href) {
				LoadingSpinner.show();
				container[cL].add(an);
				container[cL].add(an1);
				img[cL].add(an);
				img[cL].add(an2);
				if (parseLink(_href).isAbsolute && !parseLink(_href).hasHTTP) {
					_href = _href.replace(/^/, getHTTP(!0) + ":");
				}
				imagePromise(_href).then(function (r) {
					img.src = _href;
					/* console.log("manageImgLightboxLinks => imagePromise: loaded image:", r); */
				}).catch(function (err) {
					/* console.log("manageImgLightboxLinks => imagePromise: cannot load image:", err); */
				});
				/* img.src = _href; */
				w[aEL]("keyup", handleImgLightboxWindow);
				container[aEL]("click", handleImgLightboxContainer);
				container.style.display = "block";
				LoadingSpinner.hide();
			}
		},
		    debounceLogicHandleImgLightboxLink = debounce(logicHandleImgLightboxLink, 200);
		debounceLogicHandleImgLightboxLink();
	},
	    arrangeImgLightboxLink = function (e) {
		if (!e[cL].contains(isBindedClass)) {
			var _href = e[gA]("href") || "";
			if (_href) {
				if (parseLink(_href).isAbsolute && !parseLink(_href).hasHTTP) {
					e.setAttribute("href", _href.replace(/^/, getHTTP(!0) + ":"));
				}
				e[aEL]("click", handleImgLightboxLink);
				e[cL].add(isBindedClass);
			}
		}
	},
	    rerenderImgLightboxLinks = function () {
		for (var j = 0, l = link.length; j < l; j += 1) {
			arrangeImgLightboxLink(link[j]);
		}
		/* forEach(link, arrangeImgLightboxLink); */
	};
	if (link) {
		/* console.log("triggered function: manageImgLightboxLinks"); */
		rerenderImgLightboxLinks();
	}
};
document.ready().then(manageImgLightboxLinks);
/*!
 * replace img src with data-src
 * @param {Object} [ctx] context HTML Element
 */
var handleDataSrcImages = function () {
	"use strict";

	var d = document,
	    gEBCN = "getElementsByClassName",
	    cL = "classList",
	    ds = "dataset",
	    imgClass = "data-src-img",
	    img = d[gEBCN](imgClass) || "",
	    isActiveClass = "is-active",
	    isBindedClass = "is-binded",
	    rerenderDataSrcImage = function (e) {
		if (!e[cL].contains(isBindedClass)) {
			var _src = e[ds].src || "";
			if (_src) {
				if (parseLink(_src).isAbsolute && !parseLink(_src).hasHTTP) {
					e[ds].src = _src.replace(/^/, getHTTP(!0) + ":");
					_src = e[ds].src;
				}
				imagePromise(_src).then(function (r) {
					e.src = _src;
					/* console.log("manageDataSrcImages => imagePromise: loaded image:", r); */
				}).catch(function (err) {
					/* console.log("manageDataSrcImages => imagePromise: cannot load image:", err); */
				});
				/* e.src = _src; */
				e[cL].add(isActiveClass);
				e[cL].add(isBindedClass);
			}
		}
	},
	    arrangeDataSrcImage = function (e) {
		/*!
   * true if elem is in same y-axis as the viewport or within 100px of it
   * @see {@link https://github.com/ryanve/verge}
   */
		if (verge.inY(e, 100) /*  && 0 !== e.offsetHeight */) {
				rerenderDataSrcImage(e);
			}
	},
	    rerenderDataSrcImages = function () {
		for (var i = 0, l = img.length; i < l; i += 1) {
			arrangeDataSrcImage(img[i]);
		}
		/* forEach(img, arrangeDataSrcImage); */
	};
	if (img) {
		/* console.log("triggered function: manageDataSrcImages"); */
		rerenderDataSrcImages();
	}
},
    handleDataSrcImagesWindow = function () {
	var throttleHandleDataSrcImages = throttle(handleDataSrcImages, 100);
	throttleHandleDataSrcImages();
},
    manageDataSrcImages = function () {
	"use strict";

	var w = globalRoot,
	    aEL = "addEventListener",
	    rEL = "removeEventListener";
	w[rEL]("scroll", handleDataSrcImagesWindow);
	w[rEL]("resize", handleDataSrcImagesWindow);
	w[aEL]("scroll", handleDataSrcImagesWindow);
	w[aEL]("resize", handleDataSrcImagesWindow);
	var timers = new Timers();
	timers.timeout(function () {
		timers.clear();
		timers = null;
		handleDataSrcImages();
	}, 100);
};
document.ready().then(manageDataSrcImages);
/*!
 * append media-iframe
 * @param {Object} [ctx] context HTML Element
 */
var manageDataSrcIframes = function (ctx) {
	"use strict";

	ctx = ctx && ctx.nodeName ? ctx : "";
	var w = globalRoot,
	    cls = "iframe[data-src]",
	    a = ctx ? BALA.one(cls, ctx) || "" : BALA.one(cls) || "",
	    is_active = "is-active",
	    cL = "classList",
	    ds = "dataset",
	    sA = "setAttribute",
	    aEL = "addEventListener",
	    rEL = "removeEventListener",
	    k = function (e) {
		var _src = e[ds].src || "";
		if (_src) {
			if (parseLink(_src).isAbsolute && !parseLink(_src).hasHTTP) {
				e[ds].src = _src.replace(/^/, getHTTP(!0) + ":");
				_src = e[ds].src;
			}
			if (!e[cL].contains(is_active)) {
				e.src = _src;
				e[cL].add(is_active);
				e[sA]("frameborder", "no");
				e[sA]("style", "border:none;");
				e[sA]("webkitallowfullscreen", "true");
				e[sA]("mozallowfullscreen", "true");
				e[sA]("scrolling", "no");
				e[sA]("allowfullscreen", "true");
			}
		}
	},
	    g = function (e) {
		/*!
   * true if elem is in same y-axis as the viewport or within 100px of it
   * @see {@link https://github.com/ryanve/verge}
   */
		if (verge.inY(e, 100) /* && 0 !== e.offsetHeight */) {
				k(e);
			}
	};
	if (a) {
		/* console.log("triggered function: manageDataSrcImages"); */
		a = ctx ? BALA(cls, ctx) || "" : BALA(cls) || "";
		var h_w = function () {
			for (var i = 0, l = a.length; i < l; i += 1) {
				g(a[i]);
			}
			/* forEach(a, g, !1); */
		};
		h_w();
		w[aEL]("scroll", h_w);
		w[aEL]("resize", h_w);
		w[aEL]("hashchange", function h_r() {
			w[rEL]("scroll", h_w);
			w[rEL]("resize", h_w);
			w[rEL]("hashchange", h_r);
		});
	}
};
document.ready().then(manageDataSrcIframes);
/*!
 * add smooth scroll or redirection to static select options
 * @param {Object} [ctx] context HTML Element
 */
var handleChaptersSelect = function () {
	"use strict";

	var _this = this;
	var d = document,
	    gEBI = "getElementById",
	    _hash = _this.options[_this.selectedIndex].value || "",
	    tragetObject = _hash ? isValidId(_hash, true) ? d[gEBI](_hash.replace(/^#/, "")) || "" : "" : "";
	if (_hash) {
		if (tragetObject) {
			scroll2Top(findPos(tragetObject).top, 20000);
		} else {
			changeLocation(_hash);
		}
	}
},
    manageChaptersSelect = function (ctx) {
	"use strict";

	ctx = ctx && ctx.nodeName ? ctx : "";
	var cls = "#chapters-select",
	    a = ctx ? BALA.one(cls, ctx) || "" : BALA.one(cls) || "",
	    aEL = "addEventListener",
	    k = function () {
		a[aEL]("change", handleChaptersSelect);
	};
	if (a) {
		/* console.log("triggered function: manageChaptersSelect"); */
		k();
	}
};
document.ready().then(manageChaptersSelect);
/*!
 * manage search input
 */
var manageSearchInput = function () {
	"use strict";

	var a = BALA.one("#text") || "",
	    aEL = "addEventListener",
	    g = function () {
		var _this = this;
		_this.value = _this.value.replace(/\\/g, "").replace(/ +(?= )/g, " ").replace(/\/+(?=\/)/g, "/") || "";
	},
	    k = function (e) {
		e.focus();
		e[aEL]("input", g);
	};
	if (a) {
		/* console.log("triggered function: manageSearchInput"); */
		k(a);
	}
};
document.ready().then(manageSearchInput);
/*!
 * add click event on hidden-layer show btn
 * @param {Object} [ctx] context HTML Element
 */
var handleExpandingLayers = function () {
	"use strict";

	var _this = this;
	var cL = "classList",
	    pN = "parentNode",
	    is_active = "is-active",
	    s = _this[pN] ? _this[pN].nextElementSibling : "";
	if (s) {
		_this[cL].toggle(is_active);
		s[cL].toggle(is_active);
	}
	return !1;
},
    manageExpandingLayers = function (ctx) {
	"use strict";

	ctx = ctx && ctx.nodeName ? ctx : "";
	var w = globalRoot,
	    cls = ".btn-expand-hidden-layer",
	    a = ctx ? BALA.one(cls, ctx) || "" : BALA.one(cls) || "",
	    aEL = "addEventListener",
	    k = function (e) {
		e[aEL]("click", handleExpandingLayers);
	},
	    q = function () {
		a = ctx ? BALA(cls, ctx) || "" : BALA(cls) || "";
		for (var i = 0, l = a.length; i < l; i += 1) {
			k(a[i]);
		}
		/* forEach(a, k, !1); */
	};
	if (a) {
		/* console.log("triggered function: manageExpandingLayers"); */
		q();
	}
};
document.ready().then(manageExpandingLayers);
/*!
 * add click event on source code show btn
 * @param {Object} [ctx] context HTML Element
 */
var handleSourceCodeLayers = function () {
	"use strict";

	var _this = this;
	var cL = "classList",
	    pN = "parentNode",
	    is_active = "is-active",
	    s = _this[pN] ? _this[pN].nextElementSibling : "";
	if (s) {
		_this[cL].toggle(is_active);
		s[cL].toggle(is_active);
	}
	return !1;
},
    manageSourceCodeLayers = function (ctx) {
	"use strict";

	ctx = ctx && ctx.nodeName ? ctx : "";
	var w = globalRoot,
	    cls = ".sg-btn--source",
	    a = ctx ? BALA.one(cls, ctx) || "" : BALA.one(cls) || "",
	    aEL = "addEventListener",
	    k = function (e) {
		e[aEL]("click", handleSourceCodeLayers);
	},
	    q = function () {
		a = ctx ? BALA(cls, ctx) || "" : BALA(cls) || "";
		for (var i = 0, l = a.length; i < l; i += 1) {
			k(a[i]);
		}
		/* forEach(a, k, !1); */
	};
	if (a) {
		/* console.log("triggered function: manageSourceCodeLayers"); */
		q();
	}
};
document.ready().then(manageSourceCodeLayers);
/*!
 * init qr-code
 * @see {@link https://stackoverflow.com/questions/12777622/how-to-use-enquire-js}
 */
var generateLocationQrCodeImg = function () {
	"use strict";

	var w = globalRoot,
	    d = document,
	    holder = ".holder-location-qr-code",
	    c = BALA.one(holder) || "",
	    cls = "qr-code-img",
	    u = w.location.href || "",
	    cL = "classList",
	    cE = "createElement",
	    m = d[cE]("img"),
	    t = d.title ? "Ссылка на страницу «" + d.title.replace(/\[[^\]]*?\]/g, "").trim() + "»" : "",
	    s = getHTTP(!0) + "://chart.googleapis.com/chart?cht=qr&chld=M%7C4&choe=UTF-8&chs=300x300&chl=" + encodeURIComponent(u);
	m.alt = t;
	if (w.QRCode) {
		if ("undefined" !== typeof earlySvgSupport && "svg" === earlySvgSupport) {
			s = QRCode.generateSVG(u, {
				ecclevel: "M",
				fillcolor: "#FFFFFF",
				textcolor: "#191919",
				margin: 4,
				modulesize: 8
			});
			var XMLS = new XMLSerializer();
			s = XMLS.serializeToString(s);
			s = "data:image/svg+xml;base64," + w.btoa(unescape(encodeURIComponent(s)));
			m.src = s;
		} else {
			s = QRCode.generatePNG(u, {
				ecclevel: "M",
				format: "html",
				fillcolor: "#FFFFFF",
				textcolor: "#191919",
				margin: 4,
				modulesize: 8
			});
			m.src = s;
		}
	} else {
		m.src = s;
	}
	m[cL].add(cls);
	m.title = t;
	removeChildren(c);
	appendFragment(m, c);
},
    manageLocationQrCodeImage = function () {
	"use strict";

	var w = globalRoot,
	    holder = ".holder-location-qr-code",
	    c = BALA.one(holder) || "",
	    u = w.location.href || "";
	if (c && u) {
		/* console.log("triggered function: manageLocationQrCodeImage"); */
		if ("undefined" !== typeof getHTTP && getHTTP()) {
			generateLocationQrCodeImg();
		}
	}
},
    loadManageLocationQrCodeImg = function () {
	"use strict";

	var js = "../../cdn/qrjs2/0.1.3/js/qrjs2.fixed.min.js";
	if (!scriptIsLoaded(js)) {
		loadJS(js, manageLocationQrCodeImage);
	} else {
		manageLocationQrCodeImage();
	}
};
document.ready().then(loadManageLocationQrCodeImg);
/*!
 * init nav-menu
 */
var initNavMenu = function () {
	"use strict";

	var w = globalRoot,
	    container = BALA.one("#container") || "",
	    page = BALA.one("#page") || "",
	    btn = BALA.one(".btn-nav-menu") || "",
	    panel = BALA.one(".panel-nav-menu") || "",
	    items = BALA("a", panel) || "",
	    holder = BALA.one(".holder-panel-menu-more") || "",
	    cL = "classList",
	    aEL = "addEventListener",
	    is_active = "is-active",
	    p = w.location.href || "",
	    r = function () {
		page[cL].remove(is_active);
		panel[cL].remove(is_active);
		btn[cL].remove(is_active);
	},
	    f = function () {
		page[cL].add(is_active);
		panel[cL].add(is_active);
		btn[cL].add(is_active);
	},
	    t = function () {
		page[cL].toggle(is_active);
		panel[cL].toggle(is_active);
		btn[cL].toggle(is_active);
	},
	    h = function () {
		if (holder && holder[cL].contains(is_active)) {
			holder[cL].remove(is_active);
		}
	},
	    g = function () {
		var h_container_left = function () {
			/* console.log("swipeleft"); */
			h();
			if (panel[cL].contains(is_active)) {
				r();
			}
		},
		    h_container_right = function () {
			/* console.log("swiperight"); */
			h();
			if (!panel[cL].contains(is_active)) {
				f();
			}
		};
		container[aEL]("click", h_container_left);
		/* container.onclick = h_container_left; */
		if ("undefined" !== typeof earlyHasTouch && "touch" === earlyHasTouch) {
			container[aEL]("swipeleft", h_container_left);
			/* container.onswipeleft = h_container_left; */
			container[aEL]("swiperight", h_container_right);
			/* container.onswiperight = h_container_right; */
		}
	},
	    k = function () {
		var h_btn = function (ev) {
			ev.stopPropagation();
			ev.preventDefault();
			h();
			t();
		};
		btn[aEL]("click", h_btn);
	},
	    q = function () {
		h();
		r();
	},
	    m = function (e) {
		e[cL].remove(is_active);
	},
	    n = function (e) {
		e[cL].add(is_active);
	},
	    s = function (a) {
		for (var j = 0, l = a.length; j < l; j += 1) {
			m(a[j]);
		}
		/* forEach(a, m, !1); */
	},
	    v = function (e) {
		var h_e = function () {
			if (panel[cL].contains(is_active)) {
				q();
			}
			s(items);
			n(e);
		};
		e[aEL]("click", h_e);
		if (e.href === p) {
			n(e);
		} else {
			m(e);
		}
	},
	    z = function () {
		for (var i = 0, l = items.length; i < l; i += 1) {
			v(items[i]);
		}
		/* forEach(items, v, !1); */
	};
	if (container && page && btn && panel && items) {
		/* console.log("triggered function: initNavMenu"); */
		/*!
   * open or close nav
   */
		k();
		g();
		/*!
   * close nav, scroll to top, highlight active nav item
   */
		z();
	}
};
document.ready().then(initNavMenu);
/*!
 * add updates link to menu more
 * place that above init menu more
 */
var addAppUpdatesLink = function () {
	"use strict";

	var d = document,
	    gEBCN = "getElementsByClassName",
	    gEBTN = "getElementsByTagName",
	    cE = "createElement",
	    cTN = "createTextNode",
	    aC = "appendChild",
	    aEL = "addEventListener",
	    panel = d[gEBCN]("panel-menu-more")[0] || "",
	    items = panel ? panel[gEBTN]("li") || "" : "",
	    navigatorUserAgent = navigator.userAgent || "",
	    linkHref;
	if (/Windows/i.test(navigatorUserAgent) && /(WOW64|Win64)/i.test(navigatorUserAgent)) {
		linkHref = "https://github.com/englishextra/englishextra-app/releases/download/v1.0.0/englishextra-app-win32-x64-setup.exe";
	} else if (/(x86_64|x86-64|x64;|amd64|AMD64|x64_64)/i.test(navigatorUserAgent) && /(Linux|X11)/i.test(navigatorUserAgent)) {
		linkHref = "https://github.com/englishextra/englishextra-app/releases/download/v1.0.0/englishextra-app-linux-x64.tar.gz";
	} else if (/IEMobile/i.test(navigatorUserAgent)) {
		linkHref = "https://github.com/englishextra/englishextra-app/releases/download/v1.0.0/englishextra_app.Windows10_1.0.0.0_x86_debug.appx";
	} else if (/Android/i.test(navigatorUserAgent)) {
		linkHref = "https://github.com/englishextra/englishextra-app/releases/download/v1.0.0/englishextra_app-debug.apk";
	} else {
		linkHref = "";
	}
	var arrangeAppUpdatesLink = function () {
		var listItem = d[cE]("li"),
		    link = d[cE]("a"),
		    linkText = "Скачать приложение сайта";
		link.title = "" + (parseLink(linkHref).hostname || "") + " откроется в новой вкладке";
		link.href = linkHref;
		if ("undefined" !== typeof getHTTP && getHTTP()) {
			link.target = "_blank";
			link.rel = "noopener";
		} else {
			/*!
    * no prevent default and void .href above
    */
			/*jshint -W107 */
			link.href = "javascript:void(0);";
			/*jshint +W107 */
			var handleAppUpdatesLink = function () {
				openDeviceBrowser(linkHref);
			};
			link[aEL]("click", handleAppUpdatesLink);
		}
		link[aC](d[cTN]("" + linkText));
		listItem[aC](link);
		if (panel.hasChildNodes()) {
			prependFragmentBefore(listItem, panel.firstChild);
		}
	};
	if (panel && items && linkHref) {
		/* console.log("triggered function: addAppUpdatesLink"); */
		arrangeAppUpdatesLink();
	}
};
document.ready().then(addAppUpdatesLink);
/*!
 * init menu-more
 */
var initMenuMore = function () {
	"use strict";

	var w = globalRoot,
	    container = BALA.one("#container") || "",
	    holder = BALA.one(".holder-panel-menu-more") || "",
	    btn = BALA.one(".btn-menu-more") || "",
	    panel = BALA.one(".panel-menu-more") || "",
	    items = BALA("li", panel) || "",
	    cL = "classList",
	    aEL = "addEventListener",
	    is_active = "is-active",
	    h_e = function () {
		holder[cL].remove(is_active);
	},
	    g = function (e) {
		e[aEL]("click", h_e);
	},
	    k = function () {
		container[aEL]("click", h_e);
	},
	    q = function () {
		var h_btn = function (ev) {
			ev.stopPropagation();
			ev.preventDefault();
			holder[cL].toggle(is_active);
		};
		btn[aEL]("click", h_btn);
	},
	    v = function () {
		for (var i = 0, l = items.length; i < l; i += 1) {
			g(items[i]);
		}
		/* forEach(items, g, !1); */
	};
	if (container && holder && btn && panel && items) {
		/* console.log("triggered function: initMenuMore"); */
		/*!
   * hide menu more on outside click
   */
		k();
		/*!
   * show or hide menu more
   */
		q();
		/*!
   * hide menu more on item clicked
   */
		v();
	}
};
document.ready().then(initMenuMore);
/*!
 * init ui-totop
 */
var initUiTotop = function () {
	"use strict";

	var w = globalRoot,
	    d = document,
	    h = d.documentElement || "",
	    b = d.body || "",
	    qS = "querySelector",
	    cL = "classList",
	    cE = "createElement",
	    aC = "appendChild",
	    cENS = "createElementNS",
	    sANS = "setAttributeNS",
	    aEL = "addEventListener",
	    btnClass = "ui-totop",
	    btnTitle = "Наверх",
	    isActiveClass = "is-active",
	    handleUiTotopWindow = function (_this) {
		var logicHandleUiTotopWindow = function () {
			var btn = d[qS]("." + btnClass) || "",
			    scrollPosition = _this.pageYOffset || h.scrollTop || b.scrollTop || "",
			    windowHeight = _this.innerHeight || h.clientHeight || b.clientHeight || "";
			if (scrollPosition && windowHeight && btn) {
				if (scrollPosition > windowHeight) {
					btn[cL].add(isActiveClass);
				} else {
					btn[cL].remove(isActiveClass);
				}
			}
		},
		    throttleLogicHandleUiTotopWindow = throttle(logicHandleUiTotopWindow, 100);
		throttleLogicHandleUiTotopWindow();
	},
	    renderUiTotop = function () {
		var handleUiTotopAnchor = function (ev) {
			ev.stopPropagation();
			ev.preventDefault();
			scroll2Top(0, 20000);
		},
		    insertUpSvg = function (targetObj) {
			var svg = d[cENS]("http://www.w3.org/2000/svg", "svg"),
			    use = d[cENS]("http://www.w3.org/2000/svg", "use");
			svg[cL].add("ui-icon");
			use[sANS]("http://www.w3.org/1999/xlink", "xlink:href", "#ui-icon-Up");
			svg[aC](use);
			targetObj[aC](svg);
		},
		    anchor = d[cE]("a");
		anchor[cL].add(btnClass);
		/*jshint -W107 */
		anchor.href = "javascript:void(0);";
		/*jshint +W107 */
		anchor.title = btnTitle;
		anchor[aEL]("click", handleUiTotopAnchor);
		insertUpSvg(anchor);
		b[aC](anchor);
		w[aEL]("scroll", handleUiTotopWindow);
	};
	if (b) {
		/* console.log("triggered function: initUiTotop"); */
		renderUiTotop();
	}
};
document.ready().then(initUiTotop);
/*!
 * init pluso-engine or ya-share on click
 */
var initPlusoYaShare = function () {
	"use strict";

	var a = BALA.one(".btn-share-buttons") || "",
	    pluso = BALA.one(".pluso") || "",
	    ya_share2 = BALA.one(".ya-share2") || "",
	    aEL = "addEventListener",
	    rEL = "removeEventListener",
	    pluso_like_js_src = getHTTP(!0) + "://share.pluso.ru/pluso-like.js",
	    share_js_src = getHTTP(!0) + "://yastatic.net/share2/share.js",
	    g = function (s, b) {
		setStyleVisibilityVisible(s);
		setStyleOpacity(s, 1);
		setStyleDisplayNone(b);
	},
	    k = function (js, s, b) {
		if (!scriptIsLoaded(js)) {
			loadJS(js, g.bind(null, s, b));
		}
	},
	    q = function () {
		if (pluso) {
			k(pluso_like_js_src, pluso, a);
		} else {
			if (ya_share2) {
				k(share_js_src, ya_share2, a);
			}
		}
	},
	    v = function () {
		var h_a = function (ev) {
			ev.stopPropagation();
			ev.preventDefault();
			a[rEL]("click", h_a);
			q();
		};
		a[aEL]("click", h_a);
	};
	if ((pluso || ya_share2) && a) {
		/* console.log("triggered function: initPlusoYaShare"); */
		if ("undefined" !== typeof getHTTP && getHTTP()) {
			v();
		} else {
			setStyleDisplayNone(a);
		}
	}
};
document.ready().then(initPlusoYaShare);
/*!
 * init disqus_thread on scroll
 */
var initDisqusOnScroll = function () {
	"use strict";

	var d = document,
	    w = globalRoot,
	    c = BALA.one("#disqus_thread") || "",
	    is_active = "is-active",
	    btn = BALA.one(".btn-show-disqus") || "",
	    p = w.location.href || "",
	    cL = "classList",
	    ds = "dataset",
	    pN = "parentNode",
	    aEL = "addEventListener",
	    rEL = "removeEventListener",
	    n = c ? c[ds].shortname || "" : "",
	    js = getHTTP(!0) + "://" + n + ".disqus.com/embed.js",
	    g = function () {
		setStyleDisplayNone(btn);
		c[cL].add(is_active);
		LoadingSpinner.hide();
	},
	    k = function () {
		LoadingSpinner.show();
		if (!scriptIsLoaded(js)) {
			loadJS(js, g);
		}
	},
	    q = function () {
		var h_btn = function (ev) {
			ev.preventDefault();
			ev.stopPropagation();
			btn[rEL]("click", h_btn);
			k();
		};
		btn[aEL]("click", h_btn);
	},
	    v = function () {
		removeChildren(c);
		var s = d.createRange().createContextualFragment('<p>Комментарии доступны только в веб версии этой страницы.</p>');
		appendFragment(s, c);
		c.removeAttribute("id");
		setStyleDisplayNone(btn[pN]);
	};
	if (c && btn && n && p) {
		/* console.log("triggered function: initDisqusOnScroll"); */
		if ("undefined" !== typeof getHTTP && getHTTP()) {
			q();
			/* if (!("undefined" !== typeof earlyDeviceSize && "small" === earlyDeviceSize)) {
   	var h_w = function () {
   		if (fitsIntoViewport(c)) {
   			w[rEL]("scroll", h_w);
   			k();
   		}
   	};
   	w[aEL]("scroll", h_w);
   } */
		} else {
			v();
		}
	}
};
document.ready().then(initDisqusOnScroll);
/*!
 * init vk-like on click
 */
var manageVKLikeButton = function () {
	"use strict";

	var w = globalRoot,
	    vk_like = "vk-like",
	    c = BALA.one("#" + vk_like) || "",
	    a = BALA.one(".btn-show-vk-like") || "",
	    js = getHTTP(!0) + "://vk.com/js/api/openapi.js?122",
	    ds = "dataset",
	    aEL = "addEventListener",
	    rEL = "removeEventListener",
	    g = function () {
		try {
			if (w.VK) {
				VK.init({
					apiId: c[ds].apiid || "",
					nameTransportPath: "/xd_receiver.htm",
					onlyWidgets: !0
				});
				VK.Widgets.Like(vk_like, {
					type: "button",
					height: 24
				});
			}
			setStyleVisibilityVisible(c);
			setStyleOpacity(c, 1);
			setStyleDisplayNone(a);
		} catch (e) {
			setStyleVisibilityHidden(c);
			setStyleOpacity(c, 0);
			setStyleDisplayBlock(a);
		}
	},
	    k = function () {
		if (!scriptIsLoaded(js)) {
			loadJS(js, g);
		}
	},
	    q = function () {
		var h_a = function (ev) {
			ev.stopPropagation();
			ev.preventDefault();
			a[rEL]("click", h_a);
			k();
		};
		a[aEL]("click", h_a);
	};
	if (c && a) {
		/* console.log("triggered function: manageVKLikeButton"); */
		if ("undefined" !== typeof getHTTP && getHTTP()) {
			q();
		} else {
			setStyleDisplayNone(a);
		}
	}
};
document.ready().then(manageVKLikeButton);
/*!
 * init Pages Kamil autocomplete
 * @see {@link https://github.com/oss6/kamil/wiki/Example-with-label:link-json-and-typo-correct-suggestion}
 */
var initKamilAutocomplete = function () {
	"use strict";

	var w = globalRoot,
	    d = document,
	    gEBI = "getElementById",
	    search_form = BALA.one(".search-form") || "",
	    id = "#text",
	    text = BALA.one(id) || "",
	    outsideContainer = d[gEBI]("container") || "",
	    _ul_id = "kamil-typo-autocomplete",
	    _ul_class = "kamil-autocomplete",
	    jsn = "../../libs/paper/json/pages.json",
	    cL = "classList",
	    cE = "createElement",
	    cTN = "createTextNode",
	    pN = "parentNode",
	    aC = "appendChild",
	    aEL = "addEventListener",
	    q = function (jsonResponse) {
		var jpr = safelyParseJSON(jsonResponse);
		if (jpr) {
			var ac = new Kamil(id, {
				source: jpr,
				property: "label",
				minChars: 2
			});
			/*!
    * create typo suggestion list
    */
			var _ul = d[cE]("ul"),
			    _li = d[cE]("li"),
			    handleTypoSuggestions = function () {
				setStyleDisplayNone(_ul);
				setStyleDisplayNone(_li);
			},
			    showTypoSuggestions = function () {
				setStyleDisplayBlock(_ul);
				setStyleDisplayBlock(_li);
			};
			_ul[cL].add(_ul_class);
			_ul.id = _ul_id;
			handleTypoSuggestions();
			_ul[aC](_li);
			text[pN].insertBefore(_ul, text.nextElementSibling);
			/*!
    * show suggestions
    */
			ac.renderMenu = function (ul, items) {
				items = items || "";
				var l = items.length,
				    _this = this,

				/*!
     * limit output
     */
				f = function (e, i) {
					if (i < 10) {
						_this._renderItemData(ul, e, i);
					}
				};
				if (items) {
					for (var i = 0; i < l; i += 1) {
						f(items[i], i);
					}
					/* forEach(items, f, !1); */
				}
				/*!
     * fix typo - non latin characters found
     */
				while (l < 1) {
					var v = text.value;
					if (/[^\u0000-\u007f]/.test(v)) {
						v = fixEnRuTypo(v, "ru", "en");
					} else {
						v = fixEnRuTypo(v, "en", "ru");
					}
					showTypoSuggestions();
					removeChildren(_li);
					_li[aC](d[cTN]("" + v));
					if (v.match(/^\s*$/)) {
						handleTypoSuggestions();
					}
					if (text.value.length < 3 || text.value.match(/^\s*$/)) {
						handleTypoSuggestions();
					}
					l += 1;
				}
				/*!
     * truncate text
     */
				var lis = BALA("li", ul) || "",
				    g = function (e) {
					var t = e.firstChild.textContent || "",
					    n = d.createTextNode(truncString(t, 24));
					e.replaceChild(n, e.firstChild);
					e.title = "" + t;
				};
				if (lis) {
					for (var j = 0, m = lis.length; j < m; j += 1) {
						g(lis[j]);
					}
					/* forEach(lis, g, !1); */
				}
			};
			/*!
    * set text input value from typo suggestion
    */
			var h_li = function (ev) {
				ev.stopPropagation();
				ev.preventDefault();
				/*!
     * set focus first, then set text
     */
				text.focus();
				text.value = _li.firstChild.textContent || "";
				setStyleDisplayNone(_ul);
			};
			_li[aEL]("click", h_li);
			/*!
    * hide suggestions on outside click
    */
			if (outsideContainer) {
				outsideContainer[aEL]("click", handleTypoSuggestions);
			}
			/*!
    * unless you specify property option in new Kamil
    * use kamil built-in word label as search key in JSON file
    * [{"link":"/","label":"some text to match"},
    * {"link":"/pages/contents.html","label":"some text to match"}]
    */
			ac.on("kamilselect", function (e) {
				var p = e.item.link || "",
				    sm = function () {
					e.inputElement.value = "";
					handleTypoSuggestions();
					changeLocation(p);
				};
				if (p) {
					/*!
      * nwjs wont like setImmediate here
      */
					/* setImmediate(sm); */
					sm();
				}
			});
		}
	},
	    v = function () {
		loadUnparsedJSON(jsn, q);
	};
	if (search_form && text) {
		/* console.log("triggered function: initKamilAutocomplete"); */
		v();
	}
},
    loadInitKamilAutocomplete = function () {
	"use strict";

	var js = "../../cdn/kamil/0.1.1/js/kamil.fixed.min.js";
	if (!scriptIsLoaded(js)) {
		loadJS(js, initKamilAutocomplete);
	}
};
document.ready().then(loadInitKamilAutocomplete);
/*!
 * init search form and ya-site-form
 */
var initSearchForm = function () {
	"use strict";

	var w = globalRoot,
	    h = BALA.one("html") || "",
	    search_form = BALA.one(".search-form") || "",
	    ya_site_form = BALA.one(".ya-site-form.ya-site-form_inited_no") || "",
	    all_js_src = getHTTP(!0) + "://site.yandex.net/v2.0/js/all.js",
	    cL = "classList",
	    sA = "setAttribute",
	    aEL = "addEventListener",
	    g = function () {
		search_form.action = getHTTP(!0) + "://yandex.ru/sitesearch";
		search_form.target = "_blank";
	},
	    k = function () {
		if (h && !h[cL].contains("ya-page_js_yes")) {
			h[cL].add("ya-page_js_yes");
		}
		/*!
   * should be onclick attribute
   */
		ya_site_form[sA]("onclick", "return {'action':'https://yandex.com/search/site/','arrow':false,'bg':'transparent','fontsize':16,'fg':'#000000','language':'auto','logo':'rb','publicname':'\u041f\u043e\u0438\u0441\u043a \u043f\u043e \u0441\u0430\u0439\u0442\u0443 englishextra.github.io','suggest':true,'target':'_blank','tld':'com','type':3,'usebigdictionary':true,'searchid':2192588,'input_fg':'#363636','input_bg':'#E9E9E9','input_fontStyle':'normal','input_fontWeight':'normal','input_placeholder':'\u041F\u043E\u0438\u0441\u043A','input_placeholderColor':'#686868','input_borderColor':'#E9E9E9'};");
		var f = function () {
			/*!
    * yandex will load its own css making form visible
    */
			if (w.Ya) {
				Ya.Site.Form.init();
			}
		};
		if (!scriptIsLoaded(all_js_src)) {
			loadJS(all_js_src, f);
		}
	},
	    q = function () {
		search_form.action = "#";
		search_form.target = "_self";
		var h_search_form = function () {
			return !1;
		};
		search_form[aEL]("submit", h_search_form);
		setStyleDisplayNone(ya_site_form);
	};
	/* console.log("triggered function: initSearchForm"); */
	if ("undefined" !== typeof getHTTP && getHTTP()) {
		if (search_form) {
			g();
		}
		if (ya_site_form) {
			k();
		}
	} else {
		q();
	}
};
document.ready().then(initSearchForm);
/*!
 * init manUP.js
 */
var loadInitManUp = function () {
	"use strict";

	var manUpJsUrl = "/cdn/ManUp.js/0.7/js/manup.fixed.min.js",
	    initManUp = function () {
		/* console.log("triggered function: initManUp"); */
	};
	if ("undefined" !== typeof getHTTP && getHTTP()) {
		if (!scriptIsLoaded(manUpJsUrl)) {
			loadJS(manUpJsUrl, initManUp);
		} else {
			initManUp();
		}
	}
};
document.ready().then(loadInitManUp);
/*!
 * show page, finish ToProgress
 */
var showPageFinishProgress = function () {
	"use strict";

	var a = BALA.one("#container") || "";
	/* console.log("triggered function: showPageFinishProgress"); */
	setStyleOpacity(a, 1);
	progressBar.complete();
};
document.ready().then(showPageFinishProgress);

//# sourceMappingURL=bundle.js.map