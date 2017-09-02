/*jslint browser: true */
/*jslint node: true */
/*global global, $, ActiveXObject, alignToMasterBottomLeft,
appendFragment, Carousel, changeLocation, container, Cookies, debounce,
define, DISQUS, DoSlide, Draggabilly, earlyDeviceOrientation,
earlyDeviceSize, earlyDeviceType, earlyFnGetYyyymmdd, earlyHasTouch,
earlySvgasimgSupport, earlySvgSupport, escape, FastClick, fetch,
findPos, isInViewport, fixEnRuTypo, forEach, getHTTP,
getKeyValuesFromJSON, IframeLightbox, imagePromise, imagesLoaded,
imagesPreloaded, insertExternalHTML, insertTextAsFragment, Isotope,
isValidId, jQuery, Kamil, loadExternalHTML, loadJS, loadTriggerJS,
loadUnparsedJSON, manageDataSrcImageAll, manageImgLightboxLinks, Masonry,
module, myMap, openDeviceBrowser, Packery, Parallax, parseLink,
PhotoSwipe, PhotoSwipeUI_Default, pnotify, prependFragmentBefore,
prettyPrint, Promise, Proxy, QRCode, removeChildren, removeElement,
require, routie, safelyParseJSON, scriptIsLoaded, scroll2Top,
scrollToTop, setImmediate, setStyleDisplayBlock, setStyleDisplayNone,
setStyleOpacity, setStyleVisibilityHidden, setStyleVisibilityVisible, t,
Tablesort, throttle, Timers, ToProgress, truncString, unescape, verge,
VK, Ya, ymaps, zenscroll */
/*property console, split */
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
(function (root) {
	"use strict";
	var d = root.document;d.ready = function (chainVal) {
		var loaded = /^loaded|^i|^c/.test(d.readyState),
		    DOMContentLoaded = "DOMContentLoaded",
		    load = "load";return new Promise(function (resolve) {
			if (loaded) {
				return resolve(chainVal);
			}function onReady() {
				resolve(chainVal);d.removeEventListener(DOMContentLoaded, onReady);root.removeEventListener(load, onReady);
			}d.addEventListener(DOMContentLoaded, onReady);root.addEventListener(load, onReady);
		});
	};
})(globalRoot);
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
 * so manageExternalLinkAll will set target blank to links
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
progressBar.init = function (state) {
	state = state || 20;
	return this.increase(state);
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
var handleExternalLink = function (url, ev) {
	"use strict";

	ev.stopPropagation();
	ev.preventDefault();
	var logicHandleExternalLink = openDeviceBrowser.bind(null, url),
	    debounceLogicHandleExternalLink = debounce(logicHandleExternalLink, 200);
	debounceLogicHandleExternalLink();
},
    manageExternalLinkAll = function (ctx) {
	"use strict";

	ctx = ctx && ctx.nodeName ? ctx : "";
	var d = document,
	    gEBTN = "getElementsByTagName",
	    linkTag = "a",
	    link = ctx ? ctx[gEBTN](linkTag) || "" : d[gEBTN](linkTag) || "",
	    cL = "classList",
	    aEL = "addEventListener",
	    gA = "getAttribute",
	    isBindedClass = "is-binded",
	    arrangeAll = function () {
		var arrange = function (e) {
			if (!e[cL].contains(isBindedClass)) {
				var url = e[gA]("href") || "";
				if (url && parseLink(url).isCrossDomain && parseLink(url).hasHTTP) {
					e.title = "" + (parseLink(url).hostname || "") + " откроется в новой вкладке";
					if ("undefined" !== typeof getHTTP && getHTTP()) {
						e.target = "_blank";
						e.rel = "noopener";
					} else {
						e[aEL]("click", handleExternalLink.bind(null, url));
					}
					e[cL].add(isBindedClass);
				}
			}
		};
		for (var i = 0, l = link.length; i < l; i += 1) {
			arrange(link[i]);
		}
		/* forEach(link, arrange, false); */
	};
	if (link) {
		/* console.log("triggered function: manageExternalLinkAll"); */
		arrangeAll();
	}
};
document.ready().then(manageExternalLinkAll);
/*!
 * replace img src with data-src
 * initiate on load, not on ready
 * @param {Object} [ctx] context HTML Element
 */
var handleDataSrcImageAll = function () {
	"use strict";

	var d = document,
	    gEBCN = "getElementsByClassName",
	    cL = "classList",
	    ds = "dataset",
	    imgClass = "data-src-img",
	    img = d[gEBCN](imgClass) || "",
	    isActiveClass = "is-active",
	    isBindedClass = "is-binded",
	    arrangeAll = function () {
		var arrange = function (e) {
			/*!
    * true if elem is in same y-axis as the viewport or within 100px of it
    * @see {@link https://github.com/ryanve/verge}
    */
			if (verge.inY(e, 100) /*  && 0 !== e.offsetHeight */) {
					if (!e[cL].contains(isBindedClass)) {
						var srcString = e[ds].src || "";
						if (srcString) {
							if (parseLink(srcString).isAbsolute && !parseLink(srcString).hasHTTP) {
								e[ds].src = srcString.replace(/^/, getHTTP(true) + ":");
								srcString = e[ds].src;
							}
							imagePromise(srcString).then(function (r) {
								e.src = srcString;
							}).catch(function (err) {
								console.log("cannot load image with imagePromise:", srcString);
							});
							e[cL].add(isActiveClass);
							e[cL].add(isBindedClass);
						}
					}
				}
		};
		for (var i = 0, l = img.length; i < l; i += 1) {
			arrange(img[i]);
		}
		/* forEach(img, arrange, false); */
	};
	if (img) {
		/* console.log("triggered function: manageDataSrcImageAll"); */
		arrangeAll();
	}
},
    handleDataSrcImageAllWindow = function () {
	var throttlehandleDataSrcImageAll = throttle(handleDataSrcImageAll, 100);
	throttlehandleDataSrcImageAll();
},
    manageDataSrcImageAll = function () {
	"use strict";

	var w = globalRoot,
	    aEL = "addEventListener",
	    rEL = "removeEventListener";
	w[rEL]("scroll", handleDataSrcImageAllWindow);
	w[rEL]("resize", handleDataSrcImageAllWindow);
	w[aEL]("scroll", handleDataSrcImageAllWindow);
	w[aEL]("resize", handleDataSrcImageAllWindow);
	var timers = new Timers();
	timers.timeout(function () {
		timers.clear();
		timers = null;
		handleDataSrcImageAll();
	}, 500);
};
/*!
 * on load, not on ready
 */
globalRoot.addEventListener("load", manageDataSrcImageAll);
/*!
 * init Masonry grid
 * @see {@link https://stackoverflow.com/questions/15160010/jquery-masonry-collapsing-on-initial-page-load-works-fine-after-clicking-home}
 * @see {@link https://gist.github.com/englishextra/5e423ff34f67982f017b}
 * percentPosition: true works well with percent-width items,
 * as items will not transition their position on resize.
 * masonry.desandro.com/options.html
 * use timed out layout property after initialising
 * to level the horizontal gaps
 */
var initMasonry = function () {
	"use strict";

	var w = globalRoot,
	    d = document,
	    gEBCN = "getElementsByClassName",
	    gEBTN = "getElementsByTagName",
	    gridItemClass = "masonry-grid-item",
	    gridItemSelector = ".masonry-grid-item",
	    gridSizerSelector = ".masonry-grid-sizer",
	    grid = d[gEBCN]("masonry-grid")[0] || "",
	    gridItem = d[gEBCN](gridItemClass) || "",
	    holder = d[gEBCN]("holder-filter-buttons")[0] || "",
	    btn = holder ? holder[gEBTN]("li") || "" : "",
	    sel = d[gEBCN]("filter-select")[0] || "",
	    controls = d[gEBCN]("holder-filter-controls")[0] || "",
	    iso,
	    msnry,
	    pckry,
	    initGrid = function () {
		var imgLoad;
		if (w.Masonry && w.Isotope) {
			/* console.log("function initMasonry => initialised iso"); */
			iso = new Isotope(grid, {
				itemSelector: gridItemSelector,
				layoutMode: "masonry",
				masonry: {
					columnWidth: gridSizerSelector,
					gutter: 0
				},
				percentPosition: true
			});
			if (w.imagesLoaded) {
				imgLoad = imagesLoaded(grid);
				imgLoad.on("progress", function (instance) {
					/* console.log("function initMasonry => reinitialised iso"); */
					iso.layout();
				});
			}
			var handleFilterButtonAll = function () {
				var _this = this;
				iso.arrange({
					filter: _this.dataset.filter
				});
				for (var i = 0, l = btn.length; i < l; i += 1) {
					btn[i].classList.remove("is-active");
				}
				_this.classList.add("is-active");
				for (var j = 0, m = sel.options.length; j < m; j += 1) {
					if (sel.options[j].value === _this.dataset.filter) {
						sel.selectedIndex = j;
						break;
					}
				}
				var timers = new Timers();
				timers.timeout(function () {
					timers.clear();
					timers = null;
					handleDataSrcImageAll();
				}, 500);
			};
			if (btn) {
				for (var i = 0, l = btn.length; i < l; i += 1) {
					if (!btn[i].classList.contains("is-binded")) {
						btn[i].addEventListener("click", handleFilterButtonAll);
						btn[i].classList.add("is-binded");
					}
				}
			}
			var handleFilterSelect = function () {
				var _this = this;
				iso.arrange({
					filter: _this.options[_this.selectedIndex].value
				});
				for (var i = 0, l = btn.length; i < l; i += 1) {
					btn[i].classList.remove("is-active");
				}
				for (var j = 0, m = btn.length; j < m; j += 1) {
					if (btn[j].dataset.filter === _this.options[_this.selectedIndex].value) {
						btn[j].classList.add("is-active");
						break;
					}
				}
				var timers = new Timers();
				timers.timeout(function () {
					timers.clear();
					timers = null;
					handleDataSrcImageAll();
				}, 500);
			};
			if (sel) {
				if (!sel.classList.contains("is-binded")) {
					sel.addEventListener("change", handleFilterSelect);
					sel.classList.add("is-binded");
				}
			}
			if (controls) {
				controls.classList.add("visible");
			}
		} else if (w.Masonry) {
			/* console.log("function initMasonry => initialised msnry"); */
			msnry = new Masonry(grid, {
				itemSelector: gridItemSelector,
				columnWidth: gridSizerSelector,
				gutter: 0,
				percentPosition: true
			});
			if (w.imagesLoaded) {
				imgLoad = imagesLoaded(grid);
				imgLoad.on("progress", function (instance) {
					/* console.log("function initMasonry => reinitialised msnry"); */
					msnry.layout();
				});
			}
			if (controls) {
				controls.classList.remove("visible");
			}
		} else {
			if (w.Packery) {
				/* console.log("function initMasonry => initialised pckry"); */
				pckry = new Packery(grid, {
					itemSelector: gridItemSelector,
					columnWidth: gridSizerSelector,
					gutter: 0,
					percentPosition: true
				});
				if (w.imagesLoaded) {
					imgLoad = imagesLoaded(grid);
					imgLoad.on("progress", function (instance) {
						/* console.log("function initMasonry => reinitialised pckry"); */
						pckry.layout();
					});
				}
				if (gridItem) {
					if (w.Draggabilly) {
						/* console.log("function initMasonry => initialised draggie"); */
						var draggie,
						    f = function (e) {
							var draggableElem = e;
							draggie = new Draggabilly(draggableElem, {});
							draggies.push(draggie);
						},
						    draggies = [];
						for (var j = 0, m = gridItem.length; j < m; j += 1) {
							f(gridItem[j]);
						}
						/* forEach(gridItem, f, false); */
						if (pckry && draggie) {
							/* console.log("function initMasonry => binded draggie to pckry"); */
							pckry.bindDraggabillyEvents(draggie);
						}
					}
				}
				if (controls) {
					controls.classList.remove("visible");
				}
			}
		}
	},
	    initScript = function () {
		initGrid();
		var timers = new Timers();
		timers.timeout(function () {
			timers.clear();
			timers = null;
			if ("undefined" !== typeof iso && iso) {
				iso.layout();
			} else if ("undefined" !== typeof msnry && msnry) {
				msnry.layout();
			} else {
				if ("undefined" !== typeof pckry && pckry) {
					pckry.layout();
				}
			}
		}, 500);
	};
	if (grid && gridItem) {
		/* console.log("triggered function: initMasonry"); */
		/* var jsUrl = "./cdn/masonry/4.1.1/js/masonry.imagesloaded.pkgd.fixed.min.js"; */
		/* var jsUrl = "./cdn/packery/2.1.1/js/packery.imagesloaded.pkgd.fixed.min.js"; */
		/* var jsUrl = "./cdn/packery/2.1.1/js/packery.imagesloaded.draggabilly.pkgd.fixed.min.js"; */
		var jsUrl = "./cdn/isotope/3.0.1/js/isotope.imagesloaded.pkgd.fixed.min.js";
		if (!scriptIsLoaded(jsUrl)) {
			loadJS(jsUrl, initScript);
		}
	}
};
document.ready().then(initMasonry);
/*!
 * init ui-totop
 */
var initUiTotop = function () {
	"use strict";

	var w = globalRoot,
	    d = document,
	    h = d.documentElement || "",
	    b = d.body || "",
	    gEBCN = "getElementsByClassName",
	    cL = "classList",
	    cE = "createElement",
	    aC = "appendChild",

	/* cENS = "createElementNS",
 sANS = "setAttributeNS", */
	aEL = "addEventListener",
	    btnClass = "ui-totop",
	    btnTitle = "Наверх",
	    isActiveClass = "is-active",
	    arrange = function () {
		var handleUiTotopWindow = function (_this) {
			var logicHandleUiTotopWindow = function () {
				var btn = d[gEBCN](btnClass)[0] || "",
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
		    handleUiTotopAnchor = function (ev) {
			ev.stopPropagation();
			ev.preventDefault();
			scroll2Top(0, 20000);
		},

		/* insertUpSvg = function (targetObj) {
  	var svg = d[cENS]("http://www.w3.org/2000/svg", "svg"),
  	use = d[cENS]("http://www.w3.org/2000/svg", "use");
  	svg[cL].add("ui-icon");
  	use[sANS]("http://www.w3.org/1999/xlink", "xlink:href", "#ui-icon-Up");
  	svg[aC](use);
  	targetObj[aC](svg);
  }, */
		anchor = d[cE]("a");
		anchor[cL].add(btnClass);
		/*jshint -W107 */
		anchor.href = "javascript:void(0);";
		/*jshint +W107 */
		anchor.title = btnTitle;
		anchor[aEL]("click", handleUiTotopAnchor);
		/* insertUpSvg(anchor); */
		b[aC](anchor);
		w[aEL]("scroll", handleUiTotopWindow);
	};
	if (b) {
		/* console.log("triggered function: initUiTotop"); */
		arrange();
	}
};
document.ready().then(initUiTotop);
/*!
 * show page, finish ToProgress
 */
var showPageFinishProgress = function () {
	"use strict";

	var d = document,
	    gEBI = "getElementById",
	    container = d[gEBI]("container") || "",
	    showPage = function () {
		setStyleOpacity(container, 1);
		progressBar.complete();
	};
	if (container) {
		/* if ("undefined" !== typeof imagesPreloaded) {
  	progressBar.increase(20);
  	var timers = new Timers();
  	timers.interval(function () {
  		if ("undefined" !== typeof imagesPreloaded && imagesPreloaded) {
  			timers.clear();
  			timers = null;
  			showPage();
  		}
  	}, 100);
  } else { */
		showPage();
		/* } */
	}
};
globalRoot.addEventListener("load", showPageFinishProgress);

//# sourceMappingURL=bundle.js.map