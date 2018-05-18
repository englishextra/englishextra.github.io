/*jslint browser: true */
/*jslint node: true */
/*global doesFontExist, DoSlide, loadCSS, loadJsCss, QRCode, require, Timers,
ToProgress, unescape, VK, Ya*/
/*property console, split */
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
})("undefined" !== typeof window ? window : this);
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
		var parentNode = "parentNode";
		var style = "style";
		var title = "title";
		var _addEventListener = "addEventListener";

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
		var prependFragmentBefore = function (e, a) {
			if ("string" === typeof e) {
				e = document[createTextNode](e);
			}
			var p = a[parentNode] || "";
			var df = document[createDocumentFragment]();
			if (p) {
				df[appendChild](e);
				p.insertBefore(df, a);
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

		var hideUiBtnsInFullScreen = function () {
			var cdPrev = document[getElementsByClassName]("cd-prev")[0] || "";
			var cdNext = document[getElementsByClassName]("cd-next")[0] || "";
			var btnNavMenu = document[getElementsByClassName]("btn-nav-menu")[0] || "";
			var btnMenuMore = document[getElementsByClassName]("btn-menu-more")[0] || "";
			var btnShowVKLike = document[getElementsByClassName]("btn-show-vk-like")[0] || "";
			var btnShareButtons = document[getElementsByClassName]("btn-share-buttons")[0] || "";
			var btnUiTotop = document[getElementsByClassName]("ui-totop")[0] || "";
			var holderSearchForm = document[getElementsByClassName]("holder-search-form")[0] || "";
			var jsUrl = getHTTP(true) + "://vk.com/js/api/openapi.js?122";
			var f = false;
			if (!f) {
				f = true;
				/*!
				 * Detecting if a browser is in full screen mode
				 * @see {@link https://stackoverflow.com/questions/2863351/checking-if-browser-is-in-fullscreen}
				 * @see {@link https://stackoverflow.com/questions/1047319/detecting-if-a-browser-is-in-full-screen-mode}
				 */
				var args = [cdPrev, cdNext, btnNavMenu, btnMenuMore, btnShareButtons, btnUiTotop, holderSearchForm];
				if ((root.navigator.standalone) || (screen.height === root.outerHeight) || (root.fullScreen) || (root.innerWidth === screen.width && root.innerHeight === screen.height)) {
					for (var i = 0, l = args[_length]; i < l; i += 1) {
						setStyleDisplayNone(args[i]);
					}
					setStyleDisplayNone(btnShowVKLike);
				} else {
					for (var j = 0, m = args[_length]; j < m; j += 1) {
						setStyleDisplayBlock(args[j]);
					}
					if (!scriptIsLoaded(jsUrl)) {
						setStyleDisplayBlock(btnShowVKLike);
					}
				}
			}
		};
		var resizeHideUiBtnsInFullScreen = function () {
			if ("undefined" !== typeof earlyDeviceType && "desktop" === earlyDeviceType) {
				hideUiBtnsInFullScreen();
				root[_addEventListener]("resize", hideUiBtnsInFullScreen);
			}
		};
		resizeHideUiBtnsInFullScreen();

		var initDoSlide = function () {
			var getElementsByClassName = "getElementsByClassName";
			var _addEventListener = "addEventListener";
			var dsContainerSelector = ".ds-container";
			var dsContainer = document[getElementsByClassName]("ds-container")[0] || "";
			var cdPrev = document[getElementsByClassName]("cd-prev")[0] || "";
			var cdNext = document[getElementsByClassName]("cd-next")[0] || "";
			var initScript = function () {
				var slide = new DoSlide(dsContainerSelector, {
					duration : 2000,
					horizontal : true,
					infinite : true
				});
				var timer = function (slide, interval, token) {
					var next = function () {
						token = setTimeout(next, interval);
						if (!(document.hidden || document.webkitHidden)) {
							slide.next();
						}
					};
					return function () {
						clearTimeout(token);
						token = setTimeout(next, interval);
					};
				};
				var slideTimer = timer(slide, 5000);
				var handleCdPrev = function (ev) {
					ev.preventDefault();
					ev.stopPropagation();
					slide.prev();
				};
				var handleCdNext = function (ev) {
					ev.preventDefault();
					ev.stopPropagation();
					slide.next();
				};
				if (root.DoSlide) {
					/*!
					 * dont JSMin line below: Notepad++ will freeze
					 * comment out if you dont want slide autorotation
					 */
					slide.onChanged(slideTimer).do(slideTimer);
					/*!
					 * init next button if no slide autorotation
					 */
					setStyleDisplayBlock(cdPrev);
					setStyleDisplayBlock(cdNext);
					cdPrev[_addEventListener]("click", handleCdPrev);
					cdNext[_addEventListener]("click", handleCdNext);
				}
			};
			if (dsContainer && cdPrev && cdNext) {
				/* var jsUrl = "../../cdn/doSlide/1.1.4/js/do-slide.fixed.min.js";
				if (!scriptIsLoaded(jsUrl)) {
					var load;
					load = new loadJsCss([jsUrl], initScript);
				} */
				initScript();
			}
		};
		initDoSlide();

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

		var showMenuMore = function () {
			var holderPanelMenuMore = document[getElementsByClassName]("holder-panel-menu-more")[0] || "";
			var isActiveClass = "is-active";
			if (holderPanelMenuMore) {
				var timers = new Timers();
				timers.timeout(function () {
					timers.clear();
					timers = null;
					holderPanelMenuMore[classList].add(isActiveClass);
				}, 2000);
			}
		};
		showMenuMore();

		var addAppUpdatesLink = function () {
			var getElementsByClassName = "getElementsByClassName";
			var getElementsByTagName = "getElementsByTagName";
			var createElement = "createElement";
			var createTextNode = "createTextNode";
			var appendChild = "appendChild";
			var _addEventListener = "addEventListener";
			var panel = document[getElementsByClassName]("panel-menu-more")[0] || "";
			var items = panel ? panel[getElementsByTagName]("li") || "" : "";
			var navigatorUserAgent = navigator.userAgent || "";
			var linkHref;
			if (/Windows/i.test(navigatorUserAgent) && /(WOW64|Win64)/i.test(navigatorUserAgent)) {
				linkHref = "https://github.com/englishextra/englishextra-app/releases/download/v1.0.0/englishextra-win32-x64-setup.exe";
			} else if (/(x86_64|x86-64|x64;|amd64|AMD64|x64_64)/i.test(navigatorUserAgent) && /(Linux|X11)/i.test(navigatorUserAgent)) {
				linkHref = "https://github.com/englishextra/englishextra-app/releases/download/v1.0.0/englishextra-linux-x64.tar.gz";
			} else if (/IEMobile/i.test(navigatorUserAgent)) {
				linkHref = "https://github.com/englishextra/englishextra-app/releases/download/v1.0.0/englishextra.Windows10_1.0.0.0_x86_debug.appx";
			} else {
				if (/Android/i.test(navigatorUserAgent)) {
					linkHref = "https://github.com/englishextra/englishextra-app/releases/download/v1.0.0/englishextra-debug.apk";
				}
			}
			var	arrange = function () {
				var listItem = document[createElement]("li");
				var link = document[createElement]("a");
				var linkText = "Скачать приложение сайта";
				link.title = "" + (parseLink(linkHref).hostname || "") + " откроется в новой вкладке";
				link.href = linkHref;
				var handleAppUpdatesLink = function () {
					openDeviceBrowser(linkHref);
				};
				if ("undefined" !== typeof getHTTP && getHTTP()) {
					link.target = "_blank";
					link.rel = "noopener";
				} else {
					/*!
					 * no prevent default and void .href above
					 */
					/* jshint -W107 */
					link.href = "javascript:void(0);";
					/* jshint +W107 */
					link[_addEventListener]("click", handleAppUpdatesLink);
				}
				link[appendChild](document[createTextNode]("" + linkText));
				listItem[appendChild](link);
				if (panel.hasChildNodes()) {
					prependFragmentBefore(listItem, panel.firstChild);
				}
			};
			if (panel && items && linkHref) {
				arrange();
			}
		};
		addAppUpdatesLink();

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

		hideProgressBar();
	};

	/* var scripts = ["../../libs/irregular_verbs/css/bundle.min.css"]; */
	var scripts = [];

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
		scripts.push("../../cdn/polyfills/js/polyfills.fixed.min.js");
	}

	/* var scripts = ["../../cdn/doSlide/1.1.4/js/do-slide.fixed.min.js"]; */

	scripts.push("../../libs/irregular_verbs/js/vendors.min.js");

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
			/* forcedHTTP + "://fonts.googleapis.com/css?family=Roboto:300,400,400i,700,700i%7CRoboto+Mono:400,700&subset=cyrillic,latin-ext", */
			"../../libs/irregular_verbs/css/bundle.min.css",
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
