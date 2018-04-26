/*jslint browser: true */
/*jslint node: true */
/*global doesFontExist, imagePromise, imagesLoaded, imagesPreloaded, loadCSS,
loadJsCss, Masonry, Packery, PhotoSwipe, PhotoSwipeUI_Default, Promise,
QRCode, require, Timers, ToProgress, unescape, verge, VK, Ya*/
/*property console, join, split */
/*!
 * safe way to handle console.log
 * @see {@link https://github.com/paulmillr/console-polyfill}
 */
(function(root){
	"use strict";
	if (!root.console) {
		root.console = {};
	}
	var con = root.console;
	var prop;
	var method;
	var dummy = function () {};
	var properties = ["memory"];
	var methods = ["assert,clear,count,debug,dir,dirxml,error,exception,group,",
		"groupCollapsed,groupEnd,info,log,markTimeline,profile,profiles,profileEnd,",
		"show,table,time,timeEnd,timeline,timelineEnd,timeStamp,trace,warn"];
	methods.join("").split(",");
	for (; (prop = properties.pop()); ) {
		if (!con[prop]) {
			con[prop] = {};
		}
	}
	for (; (method = methods.pop()); ) {
		if (!con[method]) {
			con[method] = dummy;
		}
	}
	prop = method = dummy = properties = methods = null;
}("undefined" !== typeof window ? window : this));
/*!
 * modified ToProgress v0.1.1
 * arguments.callee changed to TP, a local wrapper function,
 * so that public function name is now customizable;
 * wrapped in curly brackets:
 * else{document.body.appendChild(this.progressBar);};
 * removed module check
 * @see {@link http://github.com/djyde/ToProgress}
 * @see {@link https://github.com/djyde/ToProgress/blob/master/ToProgress.js}
 * @see {@link https://gist.github.com/englishextra/6a8c79c9efbf1f2f50523d46a918b785}
 * @see {@link https://jsfiddle.net/englishextra/z5xhjde8/}
 * passes jshint
 */
(function (root, document, undefined) {
	"use strict";
	var ToProgress = (function () {
		var TP = function () {
			var _addEventListener = "addEventListener";
			var appendChild = "appendChild";
			var createElement = "createElement";
			var firstChild = "firstChild";
			var getElementById = "getElementById";
			var getElementsByClassName = "getElementsByClassName";
			var hasOwnProperty = "hasOwnProperty";
			var opacity = "opacity";
			var prototype = "prototype";
			var _removeEventListener = "removeEventListener";
			var style = "style";
			function whichTransitionEvent() {
				var t,
				el = document[createElement]("fakeelement");
				var transitions = {
					"transition": "transitionend",
					"OTransition": "oTransitionEnd",
					"MozTransition": "transitionend",
					"WebkitTransition": "webkitTransitionEnd"
				};
				for (t in transitions) {
					if (transitions[hasOwnProperty](t)) {
						if (el[style][t] !== undefined) {
							return transitions[t];
						}
					}
				}
			}
			var transitionEvent = whichTransitionEvent();
			function ToProgress(opt, selector) {
				this.progress = 0;
				this.options = {
					id: "top-progress-bar",
					color: "#F44336",
					height: "2px",
					duration: 0.2,
					zIndex: "auto"
				};
				if (opt && typeof opt === "object") {
					for (var key in opt) {
						if (opt[hasOwnProperty](key)) {
							this.options[key] = opt[key];
						}
					}
				}
				this.options.opacityDuration = this.options.duration * 3;
				this.progressBar = document[createElement]("div");
				this.progressBar.id = this.options.id;
				this.progressBar.setCSS = function (style) {
					for (var property in style) {
						if (style[hasOwnProperty](property)) {
							this.style[property] = style[property];
						}
					}
				};
				this.progressBar.setCSS({
					"position": selector ? "relative" : "fixed",
					"top": "0",
					"left": "0",
					"right": "0",
					"background-color": this.options.color,
					"height": this.options.height,
					"width": "0%",
					"transition": "width " + this.options.duration + "s" + ", opacity " + this.options.opacityDuration + "s",
					"-moz-transition": "width " + this.options.duration + "s" + ", opacity " + this.options.opacityDuration + "s",
					"-webkit-transition": "width " + this.options.duration + "s" + ", opacity " + this.options.opacityDuration + "s",
					"z-index": this.options.zIndex
				});
				if (selector) {
					var el;
					if (selector.indexOf("#", 0) !== -1) {
						el = document[getElementById](selector) || "";
					} else {
						if (selector.indexOf(".", 0) !== -1) {
							el = document[getElementsByClassName](selector)[0] || "";
						}
					}
					if (el) {
						if (el.hasChildNodes()) {
							el.insertBefore(this.progressBar, el[firstChild]);
						} else {
							el[appendChild](this.progressBar);
						}
					}
				} else {
					document.body[appendChild](this.progressBar);
				}
			}
			ToProgress[prototype].transit = function () {
				this.progressBar[style].width = this.progress + "%";
			};
			ToProgress[prototype].getProgress = function () {
				return this.progress;
			};
			ToProgress[prototype].setProgress = function (progress, callback) {
				this.show();
				if (progress > 100) {
					this.progress = 100;
				} else if (progress < 0) {
					this.progress = 0;
				} else {
					this.progress = progress;
				}
				this.transit();
				if (callback) {
					callback();
				}
			};
			ToProgress[prototype].increase = function (toBeIncreasedProgress, callback) {
				this.show();
				this.setProgress(this.progress + toBeIncreasedProgress, callback);
			};
			ToProgress[prototype].decrease = function (toBeDecreasedProgress, callback) {
				this.show();
				this.setProgress(this.progress - toBeDecreasedProgress, callback);
			};
			ToProgress[prototype].finish = function (callback) {
				var that = this;
				this.setProgress(100, callback);
				this.hide();
				if (transitionEvent) {
					this.progressBar[_addEventListener](transitionEvent, function (e) {
						that.reset();
						that.progressBar[_removeEventListener](e.type, TP);
					});
				}
			};
			ToProgress[prototype].reset = function (callback) {
				this.progress = 0;
				this.transit();
				if (callback) {
					callback();
				}
			};
			ToProgress[prototype].hide = function () {
				this.progressBar[style][opacity] = "0";
			};
			ToProgress[prototype].show = function () {
				this.progressBar[style][opacity] = "1";
			};
			return ToProgress;
		};
		return TP();
	})();
	root.ToProgress = ToProgress;
})("undefined" !== typeof window ? window : this, document);
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
	root.imagePromise = imagePromise;
})("undefined" !== typeof window ? window : this);
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
	"use strict";
	var Timers = function (ids) {
		this.ids = ids || [];
	};
	Timers.prototype.timeout = function (fn, ms) {
		var id = setTimeout(fn, ms);
		this.ids.push(id);
		return id;
	};
	Timers.prototype.interval = function (fn, ms) {
		var id = setInterval(fn, ms);
		this.ids.push(id);
		return id;
	};
	Timers.prototype.clear = function () {
		this.ids.forEach(clearTimeout);
		this.ids = [];
	};
	root.Timers = Timers;
})("undefined" !== typeof window ? window : this, document);
/*!
 * modified Detect Whether a Font is Installed
 * @param {String} fontName The name of the font to check
 * @return {Boolean}
 * @author Kirupa <sam@samclarke.com>
 * @see {@link https://www.kirupa.com/html5/detect_whether_font_is_installed.htm}
 * passes jshint
 */
(function (root, document) {
	"use strict";
	var doesFontExist = function (fontName) {
		var createElement = "createElement";
		var getContext = "getContext";
		var measureText = "measureText";
		var width = "width";
		var canvas = document[createElement]("canvas");
		var context = canvas[getContext]("2d");
		var text = "abcdefghijklmnopqrstuvwxyz0123456789";
		context.font = "72px monospace";
		var baselineSize = context[measureText](text)[width];
		context.font = "72px '" + fontName + "', monospace";
		var newSize = context[measureText](text)[width];
		canvas = null;
		if (newSize === baselineSize) {
			return false;
		} else {
			return true;
		}
	};
	root.doesFontExist = doesFontExist;
})("undefined" !== typeof window ? window : this, document);
/*!
 * load CSS async
 * modified order of arguments, added callback option, removed CommonJS stuff
 * @see {@link https://github.com/filamentgroup/loadCSS}
 * @see {@link https://gist.github.com/englishextra/50592e9944bd2edc46fe5a82adec3396}
 * @param {String} hrefString path string
 * @param {Object} callback callback function
 * @param {String} media media attribute string value
 * @param {Object} [before] target HTML element
 * loadCSS(hrefString,callback,media,before)
 */
(function (root, document) {
	"use strict";
	var loadCSS = function (_href, callback) {
		var ref = document.getElementsByTagName("head")[0] || "";
		var link = document.createElement("link");
		link.rel = "stylesheet";
		link.href = _href;
		link.media = "all";
		if (ref) {
			ref.appendChild(link);
			if (callback && "function" === typeof callback) {
				link.onload = callback;
			}
			return link;
		}
		return;
	};
	root.loadCSS = loadCSS;
})("undefined" !== typeof window ? window : this, document);
/*!
 * modified loadExt
 * @see {@link https://gist.github.com/englishextra/ff9dc7ab002312568742861cb80865c9}
 * passes jshint
 */
(function (root, document) {
	"use strict";
	var loadJsCss = function (files, callback) {
		var _this = this;
		var appendChild = "appendChild";
		var body = "body";
		var createElement = "createElement";
		var getElementsByTagName = "getElementsByTagName";
		var insertBefore = "insertBefore";
		var _length = "length";
		var parentNode = "parentNode";
		_this.files = files;
		_this.js = [];
		_this.head = document[getElementsByTagName]("head")[0] || "";
		_this.body = document[body] || "";
		_this.ref = document[getElementsByTagName]("script")[0] || "";
		_this.callback = callback || function () {};
		_this.loadStyle = function (file) {
			var link = document[createElement]("link");
			link.rel = "stylesheet";
			link.type = "text/css";
			link.href = file;
			_this.head[appendChild](link);
		};
		_this.loadScript = function (i) {
			var script = document[createElement]("script");
			script.type = "text/javascript";
			script.async = true;
			script.src = _this.js[i];
			var loadNextScript = function () {
				if (++i < _this.js[_length]) {
					_this.loadScript(i);
				} else {
					_this.callback();
				}
			};
			script.onload = function () {
				loadNextScript();
			};
			_this.head[appendChild](script);
			if (_this.ref[parentNode]) {
				_this.ref[parentNode][insertBefore](script, _this.ref);
			} else {
				(_this.body || _this.head)[appendChild](script);
			}
		};
		var i,
		l;
		for (i = 0, l = _this.files[_length]; i < l; i += 1) {
			if ((/\.js$|\.js\?/).test(_this.files[i])) {
				_this.js.push(_this.files[i]);
			}
			if ((/\.css$|\.css\?|\/css\?/).test(_this.files[i])) {
				_this.loadStyle(_this.files[i]);
			}
		}
		i = l = null;
		if (_this.js[_length] > 0) {
			_this.loadScript(0);
		} else {
			_this.callback();
		}
	};
	root.loadJsCss = loadJsCss;
})("undefined" !== typeof window ? window : this, document);
/*!
 * app logic
 */
(function (root, document) {
	"use strict";

	var docElem = document.documentElement || "";
	var docImplem = document.implementation || "";
	var docBody = document.body || "";

	var createElement = "createElement";
	var createElementNS = "createElementNS";
	var defineProperty = "defineProperty";
	var getOwnPropertyDescriptor = "getOwnPropertyDescriptor";
	var querySelector = "querySelector";
	var querySelectorAll = "querySelectorAll";	var _addEventListener = "addEventListener";
	var _length = "length";

	var progressBar = new ToProgress({
			id: "top-progress-bar",
			color: "#FF2C40",
			height: "0.200rem",
			duration: 0.2,
			zIndex: 999
		});

	var hideProgressBar = function () {
		progressBar.finish();
		progressBar.hide();
	};

	/* progressBar.complete = function () {
		return this.finish(),
		this.hide();
	}; */

	progressBar.increase(20);

	var getHTTP = function (force) {
		var any = force || "";
		var locationProtocol = root.location.protocol || "";
		return "http:" === locationProtocol ? "http" : "https:" === locationProtocol ? "https" : any ? "http" : "";
	};

	var forcedHTTP = getHTTP(true);

	var run = function () {

		var appendChild = "appendChild";
		var classList = "classList";
		var createDocumentFragment = "createDocumentFragment";
		var createElement = "createElement";
		var createTextNode = "createTextNode";
		var dataset = "dataset";
		var getAttribute = "getAttribute";
		var getElementById = "getElementById";
		var getElementsByClassName = "getElementsByClassName";
		var getElementsByTagName = "getElementsByTagName";
		var innerHTML = "innerHTML";
		var parentNode = "parentNode";
		var setAttribute = "setAttribute";
		var style = "style";
		var title = "title";
		var _addEventListener = "addEventListener";
		var _removeEventListener = "removeEventListener";

		progressBar.increase(20);

		if (docElem && docElem[classList]) {
			docElem[classList].remove("no-js");
			docElem[classList].add("js");
		}

		var earlyDeviceFormfactor = (function (selectors) {
			var orientation;
			var size;
			var f = function (a) {
				var b = a.split(" ");
				if (selectors) {
					for (var c = 0; c < b[_length]; c += 1) {
						a = b[c];
						selectors.add(a);
					}
				}
			};
			var g = function (a) {
				var b = a.split(" ");
				if (selectors) {
					for (var c = 0; c < b[_length]; c += 1) {
						a = b[c];
						selectors.remove(a);
					}
				}
			};
			var h = {
				landscape: "all and (orientation:landscape)",
				portrait: "all and (orientation:portrait)"
			};
			var k = {
				small: "all and (max-width:768px)",
				medium: "all and (min-width:768px) and (max-width:991px)",
				large: "all and (min-width:992px)"
			};
			var d;
			var matchMedia = "matchMedia";
			var matches = "matches";
			var o = function (a, b) {
				var c = function (a) {
					if (a[matches]) {
						f(b);
						orientation = b;
					} else {
						g(b);
					}
				};
				c(a);
				a.addListener(c);
			};
			var s = function (a, b) {
				var c = function (a) {
					if (a[matches]) {
						f(b);
						size = b;
					} else {
						g(b);
					}
				};
				c(a);
				a.addListener(c);
			};
			for (d in h) {
				if (h.hasOwnProperty(d)) {
					o(root[matchMedia](h[d]), d);
				}
			}
			for (d in k) {
				if (k.hasOwnProperty(d)) {
					s(root[matchMedia](k[d]), d);
				}
			}
			return {
				orientation: orientation || "",
				size: size || ""
			};
		})(docElem[classList] || "");

		var earlyDeviceType = (function (mobile, desktop, opera) {
			var selector = (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i).test(opera) || (/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i).test(opera.substr(0, 4)) ? mobile : desktop;
			docElem[classList].add(selector);
			return selector;
		})("mobile", "desktop", navigator.userAgent || navigator.vendor || (root).opera);

		var earlySvgSupport = (function (selector) {
			selector = docImplem.hasFeature("http://www.w3.org/2000/svg", "1.1") ? selector : "no-" + selector;
			docElem[classList].add(selector);
			return selector;
		})("svg");

		var earlySvgasimgSupport = (function (selector) {
			selector = docImplem.hasFeature("http://www.w3.org/TR/SVG11/feature#Image", "1.1") ? selector : "no-" + selector;
			docElem[classList].add(selector);
			return selector;
		})("svgasimg");

		var earlyHasTouch = (function (selector) {
			selector = "ontouchstart" in docElem ? selector : "no-" + selector;
			docElem[classList].add(selector);
			return selector;
		})("touch");

		var getHumanDate = (function () {
			var newDate = (new Date());
			var newDay = newDate.getDate();
			var newYear = newDate.getFullYear();
			var newMonth = newDate.getMonth();
			(newMonth += 1);
			if (10 > newDay) {
				newDay = "0" + newDay;
			}
			if (10 > newMonth) {
				newMonth = "0" + newMonth;
			}
			return newYear + "-" + newMonth + "-" + newDay;
		})();

		var userBrowsingDetails = " [" + (getHumanDate ? getHumanDate : "") + (earlyDeviceType ? " " + earlyDeviceType : "") + (earlyDeviceFormfactor.orientation ? " " + earlyDeviceFormfactor.orientation : "") + (earlyDeviceFormfactor.size ? " " + earlyDeviceFormfactor.size : "") + (earlySvgSupport ? " " + earlySvgSupport : "") + (earlySvgasimgSupport ? " " + earlySvgasimgSupport : "") + (earlyHasTouch ? " " + earlyHasTouch : "") + "]";

		if (document[title]) {
			document[title] = document[title] + userBrowsingDetails;
		}

		var scroll2Top = function (scrollTargetY, speed, easing) {
			var scrollY = root.scrollY || docElem.scrollTop;
			var posY = scrollTargetY || 0;
			var rate = speed || 2000;
			var soothing = easing || "easeOutSine";
			var currentTime = 0;
			var time = Math.max(0.1, Math.min(Math.abs(scrollY - posY) / rate, 0.8));
			var easingEquations = {
				easeOutSine: function (pos) {
					return Math.sin(pos * (Math.PI / 2));
				},
				easeInOutSine: function (pos) {
					return (-0.5 * (Math.cos(Math.PI * pos) - 1));
				},
				easeInOutQuint: function (pos) {
					if ((pos /= 0.5) < 1) {
						return 0.5 * Math.pow(pos, 5);
					}
					return 0.5 * (Math.pow((pos - 2), 5) + 2);
				}
			};
			function tick() {
				currentTime += 1 / 60;
				var p = currentTime / time;
				var t = easingEquations[soothing](p);
				if (p < 1) {
					requestAnimationFrame(tick);
					root.scrollTo(0, scrollY + ((posY - scrollY) * t));
				} else {
					root.scrollTo(0, posY);
				}
			}
			tick();
		};

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

		var throttle = function (func, wait) {
			var ctx;
			var args;
			var rtn;
			var timeoutID;
			var last = 0;
			function call() {
				timeoutID = 0;
				last = +new Date();
				rtn = func.apply(ctx, args);
				ctx = null;
				args = null;
			}
			return function throttled() {
				ctx = this;
				args = arguments;
				var delta = new Date() - last;
				if (!timeoutID) {
					if (delta >= wait) {
						call();
					} else {
						timeoutID = setTimeout(call, wait - delta);
					}
				}
				return rtn;
			};
		};

		var scriptIsLoaded = function (scriptSrc) {
			var scriptAll,
			i,
			l;
			for (scriptAll = document[getElementsByTagName]("script") || "", i = 0, l = scriptAll[_length]; i < l; i += 1) {
				if (scriptAll[i][getAttribute]("src") === scriptSrc) {
					scriptAll = i = l = null;
					return true;
				}
			}
			scriptAll = i = l = null;
			return false;
		};

		var removeChildren = function (e) {
			if (e && e.firstChild) {
				for (; e.firstChild; ) {
					e.removeChild(e.firstChild);
				}
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

		var isNodejs = "undefined" !== typeof process && "undefined" !== typeof require || "";
		var isElectron = "undefined" !== typeof root && root.process && "renderer" === root.process.type || "";
		var isNwjs = (function () {
			if ("undefined" !== typeof isNodejs && isNodejs) {
				try {
					if ("undefined" !== typeof require("nw.gui")) {
						return true;
					}
				} catch (e) {
					return false;
				}
			}
			return false;
		})();

		var openDeviceBrowser = function (url) {
			var triggerForElectron = function () {
				var es = isElectron ? require("electron").shell : "";
				return es ? es.openExternal(url) : "";
			};
			var triggerForNwjs = function () {
				var ns = isNwjs ? require("nw.gui").Shell : "";
				return ns ? ns.openExternal(url) : "";
			};
			var triggerForHTTP = function () {
				return true;
			};
			var triggerForLocal = function () {
				return root.open(url, "_system", "scrollbars=1,location=no");
			};
			if (isElectron) {
				triggerForElectron();
			} else if (isNwjs) {
				triggerForNwjs();
			} else {
				var locationProtocol = root.location.protocol || "",
				hasHTTP = locationProtocol ? "http:" === locationProtocol ? "http" : "https:" === locationProtocol ? "https" : "" : "";
				if (hasHTTP) {
					triggerForHTTP();
				} else {
					triggerForLocal();
				}
			}
		};

		var handleExternalLink = function (url, ev) {
			ev.stopPropagation();
			ev.preventDefault();
			var logicHandleExternalLink = openDeviceBrowser.bind(null, url);
			var debounceLogicHandleExternalLink = debounce(logicHandleExternalLink, 200);
			debounceLogicHandleExternalLink();
		};
		var manageExternalLinkAll = function (scope) {
			var ctx = scope && scope.nodeName ? scope : "";
			var linkTag = "a";
			var link = ctx ? ctx[getElementsByTagName](linkTag) || "" : document[getElementsByTagName](linkTag) || "";
			var isBindedClass = "is-binded";
			var arrange = function (e) {
				if (!e[classList].contains(isBindedClass)) {
					var url = e[getAttribute]("href") || "";
					if (url && parseLink(url).isCrossDomain && parseLink(url).hasHTTP) {
						e[title] = "" + (parseLink(url).hostname || "") + " откроется в новой вкладке";
						if ("undefined" !== typeof getHTTP && getHTTP()) {
							e.target = "_blank";
							e.rel = "noopener";
						} else {
							e[_addEventListener]("click", handleExternalLink.bind(null, url));
						}
						e[classList].add(isBindedClass);
					}
				}
			};
			if (link) {
				for (var i = 0, l = link[_length]; i < l; i += 1) {
					arrange(link[i]);
				}
				/* forEach(link, arrange, false); */
			}
		};
		manageExternalLinkAll();

		var handleDataSrcImageAll = function () {
			var img = document[getElementsByClassName]("data-src-img") || "";
			var isActiveClass = "is-active";
			var isBindedClass = "is-binded";
			var arrange = function (e) {
				/*!
				 * true if elem is in same y-axis as the viewport or within 100px of it
				 * @see {@link https://github.com/ryanve/verge}
				 */
				if (verge.inY(e, 100) /* && 0 !== e.offsetHeight */) {
					if (!e[classList].contains(isBindedClass)) {
						var srcString = e[dataset].src || "";
						if (srcString) {
							if (parseLink(srcString).isAbsolute && !parseLink(srcString).hasHTTP) {
								e[dataset].src = srcString.replace(/^/, forcedHTTP + ":");
								srcString = e[dataset].src;
							}
							imagePromise(srcString).then(function () {
								e.src = srcString;
							}).catch (function (err) {
								console.log("cannot load image with imagePromise:", srcString, err);
							});
							e[classList].add(isActiveClass);
							e[classList].add(isBindedClass);
						}
					}
				}
			};
			if (img) {
				for (var i = 0, l = img[_length]; i < l; i += 1) {
					arrange(img[i]);
				}
				/* forEach(img, arrange, false); */
			}
		};
		var handleDataSrcImageAllWindow = function () {
			var throttleHandleDataSrcImageAll = throttle(handleDataSrcImageAll, 100);
			throttleHandleDataSrcImageAll();
		};
		var manageDataSrcImageAll = function () {
			root[_removeEventListener]("scroll", handleDataSrcImageAllWindow, {passive: true});
			root[_removeEventListener]("resize", handleDataSrcImageAllWindow);
			root[_addEventListener]("scroll", handleDataSrcImageAllWindow, {passive: true});
			root[_addEventListener]("resize", handleDataSrcImageAllWindow);
			var timers = new Timers();
			timers.timeout(function () {
				timers.clear();
				timers = null;
				handleDataSrcImageAll();
			}, 500);
		};
		manageDataSrcImageAll();

		var manageLocationQrCodeImage = function () {
			var holder = document[getElementsByClassName]("holder-location-qr-code")[0] || "";
			var locationHref = root.location.href || "";
			var initScript = function () {
				var locationHref = root.location.href || "";
				var img = document[createElement]("img");
				var imgTitle = document[title] ? ("Ссылка на страницу «" + document[title].replace(/\[[^\]]*?\]/g, "").trim() + "»") : "";
				var imgSrc = forcedHTTP + "://chart.googleapis.com/chart?cht=qr&chld=M%7C4&choe=UTF-8&chs=512x512&chl=" + encodeURIComponent(locationHref);
				img.alt = imgTitle;
				if (root.QRCode) {
					if ("undefined" !== typeof earlySvgSupport && "svg" === earlySvgSupport) {
						imgSrc = QRCode.generateSVG(locationHref, {
								ecclevel: "M",
								fillcolor: "#FFFFFF",
								textcolor: "#191919",
								margin: 4,
								modulesize: 8
							});
						var XMLS = new XMLSerializer();
						imgSrc = XMLS.serializeToString(imgSrc);
						imgSrc = "data:image/svg+xml;base64," + root.btoa(unescape(encodeURIComponent(imgSrc)));
						img.src = imgSrc;
					} else {
						imgSrc = QRCode.generatePNG(locationHref, {
								ecclevel: "M",
								format: "html",
								fillcolor: "#FFFFFF",
								textcolor: "#191919",
								margin: 4,
								modulesize: 8
							});
						img.src = imgSrc;
					}
				} else {
					img.src = imgSrc;
				}
				img[classList].add("qr-code-img");
				img[title] = imgTitle;
				removeChildren(holder);
				appendFragment(img, holder);
			};
			if (holder && locationHref) {
				if ("undefined" !== typeof getHTTP && getHTTP()) {
					/* var jsUrl = "../cdn/qrjs2/0.1.6/js/qrjs2.fixed.min.js";
					if (!scriptIsLoaded(jsUrl)) {
						var load;
						load = new loadJsCss([jsUrl], initScript);
					} */
					initScript();
				}
			}
		};
		manageLocationQrCodeImage();

		var initNavMenu = function () {
			var container = document[getElementById]("container") || "";
			var page = document[getElementById]("page") || "";
			var btnNavMenu = document[getElementsByClassName]("btn-nav-menu")[0] || "";
			var panelNavMenu = document[getElementsByClassName]("panel-nav-menu")[0] || "";
			var panelNavMenuItems = panelNavMenu ? panelNavMenu[getElementsByTagName]("a") || "" : "";
			var holderPanelMenuMore = document[getElementsByClassName]("holder-panel-menu-more")[0] || "";
			var isActiveClass = "is-active";
			var locationHref = root.location.href || "";
			var removeAllActiveClass = function () {
				page[classList].remove(isActiveClass);
				panelNavMenu[classList].remove(isActiveClass);
				btnNavMenu[classList].remove(isActiveClass);
			};
			var removeHolderActiveClass = function () {
				if (holderPanelMenuMore && holderPanelMenuMore[classList].contains(isActiveClass)) {
					holderPanelMenuMore[classList].remove(isActiveClass);
				}
			};
			var addContainerHandler = function () {
				var handleContainerLeft = function () {
					/* console.log("swipeleft"); */
					removeHolderActiveClass();
					if (panelNavMenu[classList].contains(isActiveClass)) {
						removeAllActiveClass();
					}
				};
				var handleContainerRight = function () {
					/* console.log("swiperight"); */
					removeHolderActiveClass();
					var addAllActiveClass = function () {
						page[classList].add(isActiveClass);
						panelNavMenu[classList].add(isActiveClass);
						btnNavMenu[classList].add(isActiveClass);
					};
					if (!panelNavMenu[classList].contains(isActiveClass)) {
						addAllActiveClass();
					}
				};
				container[_addEventListener]("click", handleContainerLeft);
				if (root.tocca) {
					if ("undefined" !== typeof earlyHasTouch && "touch" === earlyHasTouch) {
						container[_addEventListener]("swipeleft", handleContainerLeft);
						container[_addEventListener]("swiperight", handleContainerRight);
					}
				}
			};
			var addBtnHandler = function () {
				var toggleAllActiveClass = function () {
					page[classList].toggle(isActiveClass);
					panelNavMenu[classList].toggle(isActiveClass);
					btnNavMenu[classList].toggle(isActiveClass);
				};
				var handleBtnNavMenu = function (ev) {
					ev.stopPropagation();
					ev.preventDefault();
					removeHolderActiveClass();
					toggleAllActiveClass();
				};
				btnNavMenu[_addEventListener]("click", handleBtnNavMenu);
			};
			var addItemHandlerAll = function () {
				var addItemHandler = function (e) {
					var addActiveClass = function (e) {
						e[classList].add(isActiveClass);
					};
					var removeHolderAndAllActiveClass = function () {
						removeHolderActiveClass();
						removeAllActiveClass();
					};
					var removeActiveClass = function (e) {
						e[classList].remove(isActiveClass);
					};
					var handleItem = function () {
						if (panelNavMenu[classList].contains(isActiveClass)) {
							removeHolderAndAllActiveClass();
						}
						for (var j = 0, l = panelNavMenuItems[_length]; j < l; j += 1) {
							removeActiveClass(panelNavMenuItems[j]);
						}
						/* forEach(panelNavMenuItems, removeActiveClass, false); */
						addActiveClass(e);
					};
					e[_addEventListener]("click", handleItem);
					if (locationHref === e.href) {
						addActiveClass(e);
					} else {
						removeActiveClass(e);
					}
				};
				for (var i = 0, l = panelNavMenuItems[_length]; i < l; i += 1) {
					addItemHandler(panelNavMenuItems[i]);
				}
				/* forEach(panelNavMenuItems, addItemHandler, false); */
			};
			if (page && container && btnNavMenu && panelNavMenu && panelNavMenuItems) {
				/*!
				 * close nav on outside click
				 */
				addContainerHandler();
				/*!
				 * open or close nav
				 */
				addBtnHandler();
				/*!
				 * close nav, scroll to top, highlight active nav item
				 */
				addItemHandlerAll();
			}
		};
		initNavMenu();

		var initMenuMore = function () {
			var container = document[getElementById]("container") || "";
			var page = document[getElementById]("page") || "";
			var holderPanelMenuMore = document[getElementsByClassName]("holder-panel-menu-more")[0] || "";
			var btnMenuMore = document[getElementsByClassName]("btn-menu-more")[0] || "";
			var panelMenuMore = document[getElementsByClassName]("panel-menu-more")[0] || "";
			var panelMenuMoreItems = panelMenuMore ? panelMenuMore[getElementsByTagName]("li") || "" : "";
			var panelNavMenu = document[getElementsByClassName]("panel-nav-menu")[0] || "";
			var isActiveClass = "is-active";
			var handleItem = function () {
				page[classList].remove(isActiveClass);
				holderPanelMenuMore[classList].remove(isActiveClass);
				if (panelNavMenu && panelNavMenu[classList].contains(isActiveClass)) {
					panelNavMenu[classList].remove(isActiveClass);
				}
			};
			var addContainerHandler = function () {
				container[_addEventListener]("click", handleItem);
			};
			var addBtnHandler = function () {
				var handleBtnMenuMore = function (ev) {
					ev.stopPropagation();
					ev.preventDefault();
					holderPanelMenuMore[classList].toggle(isActiveClass);
				};
				btnMenuMore[_addEventListener]("click", handleBtnMenuMore);
			};
			var addItemHandlerAll = function () {
				var addItemHandler = function (e) {
					e[_addEventListener]("click", handleItem);
				};
				for (var i = 0, l = panelMenuMoreItems[_length]; i < l; i += 1) {
					addItemHandler(panelMenuMoreItems[i]);
				}
				/* forEach(panelMenuMoreItems, addItemHandler, false); */
			};
			if (page && container && holderPanelMenuMore && btnMenuMore && panelMenuMore && panelMenuMoreItems) {
				/*!
				 * hide menu more on outside click
				 */
				addContainerHandler();
				/*!
				 * show or hide menu more
				 */
				addBtnHandler();
				/*!
				 * hide menu more on item clicked
				 */
				addItemHandlerAll();
			}
		};
		initMenuMore();

		var localImagesPreloaded;
		var initMasonry = function () {
			var gridItemClass = "masonry-grid-item";
			var gridItemSelector = ".masonry-grid-item";
			var gridSizerSelector = ".masonry-grid-sizer";
			var grid = document[getElementsByClassName]("masonry-grid")[0] || "";
			var gridItem = document[getElementsByClassName](gridItemClass)[0] || "";
			var msnry;
			var pckry;
			var initGrid = function () {
				var imgLoad;
				if (root.Masonry) {
					msnry = new Masonry(grid, {
							itemSelector: gridItemSelector,
							columnWidth: gridSizerSelector,
							gutter: 0,
							percentPosition: true
						});
					if (root.imagesLoaded) {
						imgLoad = imagesLoaded(grid);
						imgLoad.on("progress", function () {
							msnry.layout();
						});
					}
					if ("undefined" !== typeof imagesPreloaded) {
						localImagesPreloaded = true;
					}
				} else {
					if (root.Packery) {
						pckry = new Packery(grid, {
								itemSelector: gridItemSelector,
								columnWidth: gridSizerSelector,
								gutter: 0,
								percentPosition: true
							});
						if (root.imagesLoaded) {
							imgLoad = imagesLoaded(grid);
							imgLoad.on("progress", function () {
								pckry.layout();
							});
						}
						if ("undefined" !== typeof imagesPreloaded) {
							localImagesPreloaded = true;
						}
					}
				}
			};
			var initScript = function () {
				initGrid();
				var timers = new Timers();
				timers.timeout(function () {
					timers.clear();
					timers = null;
					if ("undefined" !== typeof msnry && msnry) {
						msnry.layout();
					} else {
						if ("undefined" !== typeof pckry && pckry) {
							pckry.layout();
						}
					}
				}, 500);
			};
			if (grid && gridItem) {
				/* var jsUrl = "../cdn/masonry/4.1.1/js/masonry.imagesloaded.pkgd.fixed.min.js"; */
				/* var jsUrl = "../cdn/packery/2.1.1/js/packery.imagesloaded.pkgd.fixed.min.js";
				if (!scriptIsLoaded(jsUrl)) {
					var load;
					load = new loadJsCss([jsUrl], initScript);
				} */
				initScript();
			}
		};
		initMasonry();

		var initPhotoswipe = function () {
			var pswpGalleryClass = "pswp-gallery";
			var pswpGallerySelector = ".pswp-gallery";
			var pswpGallery = document[getElementsByClassName](pswpGalleryClass) || "";
			var pswpGalleryItems = document[getElementsByClassName]("masonry-grid-item") || "";
			/*!
			 * modified PhotoSwipe v4.1.1 init code
			 * fixed: 7 'el' is already defined.
			 * fixed: 73 Expected an assignment or function call and instead saw an expression.
			 * replaced single quotes with double quotes
			 * source: photoswipe.com
			 * other suggested variation:
			 * photoswipe.com/documentation/getting-started.html
			 * passes jshint
			 */
			var initPhotoSwipeFromDOM = function (gallerySelector) {
				var parseThumbnailElements = function (el) {
					var thumbElements = el.childNodes,
						numNodes = thumbElements[_length],
						items = [],
						childElements,
						size,
						item;
					for (var i = 0; i < numNodes; i++) {
						el = thumbElements[i];
						if (el.nodeType !== 1) {
							continue;
						}
						childElements = el.children;
						size = el[getAttribute]('data-size').split('x');
						item = {
							src: el[getAttribute]('href'),
							w: parseInt(size[0], 10),
							h: parseInt(size[1], 10),
							author: el[getAttribute]('data-author')
						};
						item.el = el;
						if (childElements[_length] > 0) {
							item.msrc = childElements[0][getAttribute]('src');
							if (childElements[_length] > 1) {
								item[title] = childElements[1][innerHTML];
							}
						}
						var mediumSrc = el[getAttribute]('data-med');
						if (mediumSrc) {
							size = el[getAttribute]('data-med-size').split('x');
							item.m = {
								src: mediumSrc,
								w: parseInt(size[0], 10),
								h: parseInt(size[1], 10)
							};
						}
						item.o = {
							src: item.src,
							w: item.w,
							h: item.h
						};
						items.push(item);
					}
					return items;
				};
				var closest = function closest(el, fn) {
					return el && (fn(el) ? el : closest(el[parentNode], fn));
				};
				var openPhotoSwipe = function (index, galleryElement, disableAnimation, fromURL) {
					var pswpElement = document[querySelectorAll]('.pswp')[0],
						gallery,
						options,
						items;
					items = parseThumbnailElements(galleryElement);
					options = {
						galleryUID: galleryElement[getAttribute]('data-pswp-uid'),
						getThumbBoundsFn: function (index) {
							var thumbnail = items[index].el.children[0],
								pageYScroll = root.pageYOffset || docElem.scrollTop,
								rect = thumbnail.getBoundingClientRect();
							return {
								x: rect.left,
								y: rect.top + pageYScroll,
								w: rect.width
							};
						},
						addCaptionHTMLFn: function (item, captionEl) {
							if (!item[title]) {
								captionEl.children[0].innerText = "";
								return false;
							}
							captionEl.children[0][innerHTML] = item[title] + '<br/><small>Photo: ' + item.author + '</small>';
							return true;
						}
					};
					if (fromURL) {
						if (options.galleryPIDs) {
							for (var j = 0; j < items[_length]; j++) {
								if (items[j].pid === index) {
									options.index = j;
									break;
								}
							}
						} else {
							options.index = parseInt(index, 10) - 1;
						}
					} else {
						options.index = parseInt(index, 10);
					}
					if (isNaN(options.index)) {
						return;
					}
					var radios = document.getElementsByName('gallery-style');
					for (var i = 0, length = radios[_length]; i < length; i++) {
						if (radios[i].checked) {
							if (radios[i].id === 'radio-minimal-black') {
								options.mainClass = 'pswp--minimal--dark';
								options.barsSize = {
									top: 0,
									bottom: 0
								};
								options.captionEl = false;
								options.fullscreenEl = false;
								options.shareEl = false;
								options.bgOpacity = 0.85;
								options.tapToClose = true;
								options.tapToToggleControls = false;
							}
							break;
						}
					}
					if (disableAnimation) {
						options.showAnimationDuration = 0;
					}
					gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
					var realViewportWidth,
						useLargeImages = false,
						firstResize = true,
						imageSrcWillChange;
					gallery.listen('beforeResize', function () {
						var dpiRatio = root.devicePixelRatio ? root.devicePixelRatio : 1;
						dpiRatio = Math.min(dpiRatio, 2.5);
						realViewportWidth = gallery.viewportSize.x * dpiRatio;
						if (realViewportWidth >= 1200 || !gallery.likelyTouchDevice && realViewportWidth > 800 || screen.width > 1200) {
							if (!useLargeImages) {
								useLargeImages = true;
								imageSrcWillChange = true;
							}
						} else {
							if (useLargeImages) {
								useLargeImages = false;
								imageSrcWillChange = true;
							}
						}
						if (imageSrcWillChange && !firstResize) {
							gallery.invalidateCurrItems();
						}
						if (firstResize) {
							firstResize = false;
						}
						imageSrcWillChange = false;
					});
					gallery.listen('gettingData', function (index, item) {
						if (useLargeImages) {
							item.src = item.o.src;
							item.w = item.o.w;
							item.h = item.o.h;
						} else {
							item.src = item.m.src;
							item.w = item.m.w;
							item.h = item.m.h;
						}
					});
					gallery.init();
				};
				var onThumbnailsClick = function (e) {
					e = e || root.event;
					if (e.preventDefault) {
						e.preventDefault();
					} else {
						e.returnValue = false;
					}
					var eTarget = e.target || e.srcElement;
					var clickedListItem = closest(eTarget, function (el) {
						return el.tagName === 'A';
					});
					if (!clickedListItem) {
						return;
					}
					var clickedGallery = clickedListItem[parentNode];
					var childNodes = clickedListItem[parentNode].childNodes,
						numChildNodes = childNodes[_length],
						nodeIndex = 0,
						index;
					for (var i = 0; i < numChildNodes; i++) {
						if (childNodes[i].nodeType !== 1) {
							continue;
						}
						if (childNodes[i] === clickedListItem) {
							index = nodeIndex;
							break;
						}
						nodeIndex++;
					}
					if (index >= 0) {
						openPhotoSwipe(index, clickedGallery);
					}
					return false;
				};
				var photoswipeParseHash = function () {
					var hash = root.location.hash.substring(1),
						params = {};
					if (hash[_length] < 5) {
						return params;
					}
					var vars = hash.split('&');
					for (var i = 0; i < vars[_length]; i++) {
						if (!vars[i]) {
							continue;
						}
						var pair = vars[i].split('=');
						if (pair[_length] < 2) {
							continue;
						}
						params[pair[0]] = pair[1];
					}
					if (params.gid) {
						params.gid = parseInt(params.gid, 10);
					}
					return params;
				};
				var galleryElements = document[querySelectorAll](gallerySelector);
				for (var i = 0, l = galleryElements[_length]; i < l; i++) {
					galleryElements[i][setAttribute]('data-pswp-uid', i + 1);
					galleryElements[i].onclick = onThumbnailsClick;
				}
				var hashData = photoswipeParseHash();
				if (hashData.pid && hashData.gid) {
					openPhotoSwipe(hashData.pid, galleryElements[hashData.gid - 1], true, true);
				}
			};
			var initScript = function () {
				var arrange = function (e) {
					setStyleDisplayBlock(e);
					var fixUrlAll = function (linkArr) {
						var fixUrl = function (link) {
							var med = link[dataset].med || "";
							if (med && parseLink(med).isCrossDomain && !parseLink(med).hasHTTP) {
								link[dataset].med = med.replace(/^/, forcedHTTP + ":");
							}
							/*!
							 * dont use href to read href, use getAttribute, because href adds protocol
							 */
							var hrefString = link[getAttribute]("href") || "";
							if (hrefString && parseLink(hrefString).isCrossDomain && !parseLink(hrefString).hasHTTP) {
								link.href = hrefString.replace(/^/, forcedHTTP + ":");
							}
						};
						for (var i = 0, l = linkArr[_length]; i < l; i += 1) {
							fixUrl(linkArr[i]);
						}
						/* forEach(linkArr, fixUrl, false); */
					};
					var galleryLinkArr = e ? e[getElementsByTagName]("a") || "" : "";
					if (galleryLinkArr) {
						fixUrlAll(galleryLinkArr);
					}
				};
				for (var i = 0, l = pswpGallery[_length]; i < l; i += 1) {
					arrange(pswpGallery[i]);
				}
				/* forEach(galleries, initPhotoSwipeFromDOM, false); */
				initPhotoSwipeFromDOM(pswpGallerySelector);
			};
			if (pswpGallery && pswpGalleryItems) {
				/* var jsUrl = "../cdn/photoswipe/4.1.0/js/photoswipe.photoswipe-ui-default.fixed.min.js";
				if (!scriptIsLoaded(jsUrl)) {
					var load;
					load = new loadJsCss([jsUrl], initScript);
				} */
				initScript();
			}
		};
		initPhotoswipe();

		var hideOtherIsSocial = function (thisObj) {
			var _thisObj = thisObj || this;
			var isActiveClass = "is-active";
			var isSocialAll = document[getElementsByClassName]("is-social") || "";
			if (isSocialAll) {
				var k,
				n;
				for (k = 0, n = isSocialAll[_length]; k < n; k += 1) {
					if (_thisObj !== isSocialAll[k]) {
						isSocialAll[k][classList].remove(isActiveClass);
					}
				}
				k = n = null;
			}
		};
		root[_addEventListener]("click", hideOtherIsSocial);

		var yshare;
		var manageShareButton = function () {
			var btn = document[getElementsByClassName]("btn-share-buttons")[0] || "";
			var yaShare2Id = "ya-share2";
			var yaShare2 = document[getElementById](yaShare2Id) || "";
			var locationHref = root.location || "";
			var documentTitle = document[title] || "";
			var isActiveClass = "is-active";
			var handleShareButton = function (ev) {
				ev.stopPropagation();
				ev.preventDefault();
				var logic = function () {
					yaShare2[classList].toggle(isActiveClass);
					hideOtherIsSocial(yaShare2);
					var initScript = function () {
						if (root.Ya) {
							try {
								if (yshare) {
									yshare.updateContent({
										title: documentTitle,
										description: documentTitle,
										url: locationHref
									});
								} else {
									yshare = Ya.share2(yaShare2Id, {
										content: {
											title: documentTitle,
											description: documentTitle,
											url: locationHref
										}
									});
								}
							} catch (err) {
								/* console.log("cannot update or init Ya", err); */
							}
						}
					};
					var jsUrl = forcedHTTP + "://yastatic.net/share2/share.js";
					if (!scriptIsLoaded(jsUrl)) {
						var load;
						load = new loadJsCss([jsUrl], initScript);
					} else {
						initScript();
					}
				};
				var debounceLogic = debounce(logic, 200);
				debounceLogic();
			};
			if (btn && yaShare2) {
				if ("undefined" !== typeof getHTTP && getHTTP()) {
					btn[_addEventListener]("click", handleShareButton);
				} else {
					setStyleDisplayNone(btn);
				}
			}
		};
		manageShareButton();

		var vlike;
		var manageVKLikeButton = function () {
			var vkLikeId = "vk-like";
			var vkLike = document[getElementById](vkLikeId) || "";
			var holderVkLike = document[getElementsByClassName]("holder-vk-like")[0] || "";
			var btn = document[getElementsByClassName]("btn-show-vk-like")[0] || "";
			var isActiveClass = "is-active";
			var handleVKLikeButton = function (ev) {
				ev.stopPropagation();
				ev.preventDefault();
				var logic = function () {
					holderVkLike[classList].toggle(isActiveClass);
					hideOtherIsSocial(holderVkLike);
					var initScript = function () {
						if (root.VK) {
							if (!vlike) {
								try {
									VK.init({
										apiId: (vkLike[dataset].apiid || ""),
										nameTransportPath: "/xd_receiver.htm",
										onlyWidgets: true
									});
									VK.Widgets.Like(vkLikeId, {
										type: "button",
										height: 24
									});
									vlike = true;
								} catch (err) {
									/* console.log("cannot init VK", err); */
								}
							}
						}
					};
					var jsUrl = forcedHTTP + "://vk.com/js/api/openapi.js?147";
					if (!scriptIsLoaded(jsUrl)) {
						var load;
						load = new loadJsCss([jsUrl], initScript);
					} else {
						initScript();
					}
				};
				var debounceLogic = debounce(logic, 200);
				debounceLogic();
			};
			if (btn && vkLike) {
				if ("undefined" !== typeof getHTTP && getHTTP()) {
					btn[_addEventListener]("click", handleVKLikeButton);
				} else {
					setStyleDisplayNone(btn);
				}
			}
		};
		manageVKLikeButton();

		var initUiTotop = function () {
			var btnClass = "ui-totop";
			var btnTitle = "Наверх";
			var isActiveClass = "is-active";
			var anchor = document[createElement]("a");
			var handleUiTotopAnchor = function (ev) {
				ev.stopPropagation();
				ev.preventDefault();
				scroll2Top(0, 20000);
			};
			var handleUiTotopWindow = function (_this) {
				var logicHandleUiTotopWindow = function () {
					var btn = document[getElementsByClassName](btnClass)[0] || "";
					var scrollPosition = _this.pageYOffset || docElem.scrollTop || docBody.scrollTop || "";
					var windowHeight = _this.innerHeight || docElem.clientHeight || docBody.clientHeight || "";
					if (scrollPosition && windowHeight && btn) {
						if (scrollPosition > windowHeight) {
							btn[classList].add(isActiveClass);
						} else {
							btn[classList].remove(isActiveClass);
						}
					}
				};
				var throttleLogicHandleUiTotopWindow = throttle(logicHandleUiTotopWindow, 100);
				throttleLogicHandleUiTotopWindow();
			};
			anchor[classList].add(btnClass);
			/* jshint -W107 */
			anchor.href = "javascript:void(0);";
			/* jshint +W107 */
			anchor[title] = btnTitle;
			docBody[appendChild](anchor);
			if (docBody) {
				anchor[_addEventListener]("click", handleUiTotopAnchor);
				root[_addEventListener]("scroll", handleUiTotopWindow, {
					passive: true
				});
			}
		};
		initUiTotop();

		hideProgressBar();
	};

	var scripts = ["../libs/pictures/css/bundle.min.css"];

	var supportsPassive = (function () {
		var support = false;
		try {
			var opts = Object[defineProperty] && Object[defineProperty]({}, "passive", {
					get: function () {
						support = true;
					}
				});
			root[_addEventListener]("test", function () {}, opts);
		} catch (err) {}
		return support;
	})();

	var needsPolyfills = (function () {
		return !String.prototype.startsWith ||
		!supportsPassive ||
		!root.requestAnimationFrame ||
		!root.matchMedia ||
		("undefined" === typeof root.Element && !("dataset" in docElem)) ||
		!("classList" in document[createElement]("_")) ||
		document[createElementNS] && !("classList" in document[createElementNS]("http://www.w3.org/2000/svg", "g")) ||
		/* !document.importNode || */
		/* !("content" in document[createElement]("template")) || */
		(root.attachEvent && !root[_addEventListener]) ||
		!("onhashchange" in root) ||
		!Array.prototype.indexOf ||
		!root.Promise ||
		!root.fetch ||
		!document[querySelectorAll] ||
		!document[querySelector] ||
		!Function.prototype.bind ||
		(Object[defineProperty] &&
			Object[getOwnPropertyDescriptor] &&
			Object[getOwnPropertyDescriptor](Element.prototype, "textContent") &&
			!Object[getOwnPropertyDescriptor](Element.prototype, "textContent").get) ||
		!("undefined" !== typeof root.localStorage && "undefined" !== typeof root.sessionStorage) ||
		!root.WeakMap ||
		!root.MutationObserver;
	})();

	if (needsPolyfills) {
		scripts.push("../cdn/polyfills/js/polyfills.fixed.min.js");
	}

	/* var scripts = ["../cdn/verge/1.9.1/js/verge.fixed.min.js",
		"../cdn/Tocca.js/2.0.1/js/Tocca.fixed.min.js",
		"../cdn/packery/2.1.1/js/packery.imagesloaded.pkgd.fixed.min.js",
		"../cdn/qrjs2/0.1.6/js/qrjs2.fixed.min.js",
		"../cdn/photoswipe/4.1.0/js/photoswipe.photoswipe-ui-default.fixed.min.js"]; */

	scripts.push("../libs/pictures/js/vendors.min.js");

	/*!
	 * load scripts after webfonts loaded using doesFontExist
	 */

	var supportsCanvas = (function () {
		var elem = document[createElement]("canvas");
		return !!(elem.getContext && elem.getContext("2d"));
	})();

	var onFontsLoadedCallback = function () {

		var slot;
		var onFontsLoaded = function () {
			clearInterval(slot);
			slot = null;

			progressBar.increase(20);

			var load;
			load = new loadJsCss(scripts, run);
		};

		var checkFontIsLoaded = function () {
			/*!
			 * check only for fonts that are used in current page
			 */
			if (doesFontExist("Roboto") /* && doesFontExist("Roboto Mono") */) {
				onFontsLoaded();
			}
		};

		if (supportsCanvas) {
			slot = setInterval(checkFontIsLoaded, 100);
		} else {
			slot = null;
			onFontsLoaded();
		}
	};

	loadCSS(
			forcedHTTP + "://fonts.googleapis.com/css?family=Roboto:300,400,400i,700,700i%7CRoboto+Mono:400,700&subset=cyrillic,latin-ext",
			onFontsLoadedCallback
		);

	/*!
	 * load scripts after webfonts loaded using webfontloader
	 */

	/* root.WebFontConfig = {
		google: {
			families: [
				"Roboto:300,400,400i,700,700i:cyrillic",
				"Roboto Mono:400,700:cyrillic,latin-ext"
			]
		},
		listeners: [],
		active: function () {
			this.called_ready = true;
			for (var i = 0; i < this.listeners[_length]; i++) {
				this.listeners[i]();
			}
		},
		ready: function (callback) {
			if (this.called_ready) {
				callback();
			} else {
				this.listeners.push(callback);
			}
		}
	};

	var onFontsLoadedCallback = function () {

		var onFontsLoaded = function () {
			progressBar.increase(20);

			var load;
			load = new loadJsCss(scripts, run);
		};

		root.WebFontConfig.ready(onFontsLoaded);
	};

	var load;
	load = new loadJsCss(
			[forcedHTTP + "://cdn.jsdelivr.net/npm/webfontloader@1.6.28/webfontloader.min.js"],
			onFontsLoadedCallback
		); */
})("undefined" !== typeof window ? window : this, document);
