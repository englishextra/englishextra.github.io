/*jslint browser: true */
/*jslint node: true */
/*global ActiveXObject, Cookies, Carousel, DISQUS, doesFontExist,
IframeLightbox, imagePromise, Kamil, loadCSS, loadJsCss, Masonry, Mustache,
Packery, Promise, QRCode, require, t, Timers, ToProgress, unescape, verge, VK,
Ya*/
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
 * Carousel v1.0
 * @see {@link https://habrahabr.ru/post/327246/}
 * @see {@link https://codepen.io/iGetPass/pen/apZPMo}
 */
(function (root, document) {
	"use strict";
	var getElementsByClassName = "getElementsByClassName";
	var _addEventListener = "addEventListener";
	var _length = "length";
	var Carousel = function (setting) {
		var _this = this;
		if (document[getElementsByClassName](setting.wrap)[0] === null) {
			console.error("Carousel not fount selector " + setting.wrap);
			return;
		}
		var privates = {};
		this.prev_slide = function () {
			--privates.opt.position;
			if (privates.opt.position < 0) {
				privates.opt.position = privates.opt.max_position - 1;
			}
			privates.sel.wrap.style.transform = "translateX(-" + privates.opt.position + "00%)";
		};
		this.next_slide = function () {
			++privates.opt.position;
			if (privates.opt.position >= privates.opt.max_position) {
				privates.opt.position = 0;
			}
			privates.sel.wrap.style.transform = "translateX(-" + privates.opt.position + "00%)";
		};
		privates.setting = setting;
		privates.sel = {
			"main": document[getElementsByClassName](privates.setting.main)[0],
			"wrap": document[getElementsByClassName](privates.setting.wrap)[0],
			"children": document[getElementsByClassName](privates.setting.wrap)[0].children,
			"prev": document[getElementsByClassName](privates.setting.prev)[0],
			"next": document[getElementsByClassName](privates.setting.next)[0]
		};
		privates.opt = {
			"position": 0,
			"max_position": document[getElementsByClassName](privates.setting.wrap)[0].children[_length]
		};
		if (privates.sel.prev !== null) {
			privates.sel.prev[_addEventListener]("click", function () {
				_this.prev_slide();
			});
		}
		if (privates.sel.next !== null) {
			privates.sel.next[_addEventListener]("click", function () {
				_this.next_slide();
			});
		}
	};
	root.Carousel = Carousel;
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
	var getElementById = "getElementById";
	var getOwnPropertyDescriptor = "getOwnPropertyDescriptor";
	var querySelector = "querySelector";
	var querySelectorAll = "querySelectorAll";
	var _addEventListener = "addEventListener";
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
		var cloneNode = "cloneNode";
		var createContextualFragment = "createContextualFragment";
		var createDocumentFragment = "createDocumentFragment";
		var createRange = "createRange";
		var createTextNode = "createTextNode";
		var dataset = "dataset";
		var getAttribute = "getAttribute";
		var getElementsByClassName = "getElementsByClassName";
		var getElementsByTagName = "getElementsByTagName";
		var href = "href";
		var innerHTML = "innerHTML";
		var parentNode = "parentNode";
		var replaceChild = "replaceChild";
		var setAttribute = "setAttribute";
		var setAttributeNS = "setAttributeNS";
		var style = "style";
		var title = "title";
		var _removeEventListener = "removeEventListener";

		var isActiveClass = "is-active";
		var isBindedClass = "is-binded";
		var isDropdownClass = "is-dropdown";
		var isFixedClass = "is-fixed";
		var isCollapsableClass = "is-collapsable";

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
					var c;
					for (c = 0; c < b[_length]; c += 1) {
						a = b[c];
						selectors.add(a);
					}
					c = null;
				}
			};
			var g = function (a) {
				var b = a.split(" ");
				if (selectors) {
					var c;
					for (c = 0; c < b[_length]; c += 1) {
						a = b[c];
						selectors.remove(a);
					}
					c = null;
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

		var initialDocumentTitle = document.title || "";

		var userBrowsingDetails = " [" + (getHumanDate ? getHumanDate : "") + (earlyDeviceType ? " " + earlyDeviceType : "") + (earlyDeviceFormfactor.orientation ? " " + earlyDeviceFormfactor.orientation : "") + (earlyDeviceFormfactor.size ? " " + earlyDeviceFormfactor.size : "") + (earlySvgSupport ? " " + earlySvgSupport : "") + (earlySvgasimgSupport ? " " + earlySvgasimgSupport : "") + (earlyHasTouch ? " " + earlyHasTouch : "") + "]";

		if (document[title]) {
			document[title] = document[title] + userBrowsingDetails;
		}

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

		var LoadingSpinner = (function () {
			var spinnerClass = "loading-spinner";
			var spinner = document[getElementsByClassName](spinnerClass)[0] || "";
			var isActiveClass = "is-active-loading-spinner";
			if (!spinner) {
				spinner = document[createElement]("div");
				spinner[classList].add(spinnerClass);
				appendFragment(spinner, docBody);
			}
			return {
				show: function () {
					return docBody[classList].contains(isActiveClass) || docBody[classList].add(isActiveClass);
				},
				hide: function (callback, timeout) {
					var delay = timeout || 500;
					var timer = setTimeout(function () {
							clearTimeout(timer);
							timer = null;
							docBody[classList].remove(isActiveClass);
							if (callback && "function" === typeof callback) {
								callback();
							}
						}, delay);
				}
			};
		})();

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

		var loadUnparsedJSON = function (url, callback, onerror) {
			var cb = function (string) {
				return callback && "function" === typeof callback && callback(string);
			};
			var x = root.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
			x.overrideMimeType("application/json;charset=utf-8");
			x.open("GET", url, !0);
			x.withCredentials = !1;
			x.onreadystatechange = function () {
				if (x.status === 404 || x.status === 0) {
					console.log("Error XMLHttpRequest-ing file", x.status);
					return onerror && "function" === typeof onerror && onerror();
				} else if (x.readyState === 4 && x.status === 200 && x.responseText) {
					cb(x.responseText);
				}
			};
			x.send(null);
		};

		var safelyParseJSON = function (response) {
			var isJson = function (obj) {
				var objType = typeof obj;
				return ["boolean", "number", "string", 'symbol', "function"].indexOf(objType) === -1;
			};
			if (!isJson(response)) {
				return JSON.parse(response);
			} else {
				return response;
			}
		};

		var truncString = function (str, max, add) {
			add = add || "\u2026";
			return ("string" === typeof str && str[_length] > max ? str.substring(0, max) + add : str);
		};

		var fixEnRuTypo = function (e, a, b) {
			var c = "";
			if ("ru" === a && "en" === b) {
				a = '\u0430\u0431\u0432\u0433\u0434\u0435\u0451\u0436\u0437\u0438\u0439\u043a\u043b\u043c\u043d\u043e\u043f\u0440\u0441\u0442\u0443\u0444\u0445\u0446\u0447\u0448\u0449\u044a\u044c\u044b\u044d\u044e\u044f\u0410\u0411\u0412\u0413\u0414\u0415\u0401\u0416\u0417\u0418\u0419\u041a\u041b\u041c\u041d\u041e\u041f\u0420\u0421\u0422\u0423\u0424\u0425\u0426\u0427\u0428\u0429\u042a\u042c\u042b\u042d\u042e\u042f"\u2116;:?/.,';
				b = "f,dult`;pbqrkvyjghcnea[wxio]ms'.zF<DULT~:PBQRKVYJGHCNEA{WXIO}MS'>Z@#$^&|/?";
			} else {
				a = "f,dult`;pbqrkvyjghcnea[wxio]ms'.zF<DULT~:PBQRKVYJGHCNEA{WXIO}MS'>Z@#$^&|/?";
				b = '\u0430\u0431\u0432\u0433\u0434\u0435\u0451\u0436\u0437\u0438\u0439\u043a\u043b\u043c\u043d\u043e\u043f\u0440\u0441\u0442\u0443\u0444\u0445\u0446\u0447\u0448\u0449\u044a\u044c\u044b\u044d\u044e\u044f\u0410\u0411\u0412\u0413\u0414\u0415\u0401\u0416\u0417\u0418\u0419\u041a\u041b\u041c\u041d\u041e\u041f\u0420\u0421\u0422\u0423\u0424\u0425\u0426\u0427\u0428\u0429\u042a\u042c\u042b\u042d\u042e\u042f"\u2116;:?/.,';
			}
			for (var d = 0; d < e[_length]; d++) {
				var f = a.indexOf(e.charAt(d));
				if (c > f) {
					c += e.charAt(d);
				} else {
					c += b.charAt(f);
				}
			}
			return c;
		};

		var renderTemplate = function (parsedJson, templateId, targetId) {
			var template = document[getElementById](templateId) || "";
			var target = document[getElementById](targetId) || "";
			var jsonObj = safelyParseJSON(parsedJson);
			if (jsonObj && template && target) {
				var targetHtml = template[innerHTML] || "";
				if (root.t) {
					var renderTargetTemplate = new t(targetHtml);
					return renderTargetTemplate.render(jsonObj);
				} else {
					if (root.Mustache) {
						Mustache.parse(targetHtml);
						return Mustache.render(targetHtml, jsonObj);
					}
				}
			}
			return "cannot renderTemplate";
		};

		var insertTextAsFragment = function (text, container, callback) {
			var body = document.body || "";
			var cb = function () {
				return callback && "function" === typeof callback && callback();
			};
			try {
				var clonedContainer = container[cloneNode](false);
				if (document[createRange]) {
					var rg = document[createRange]();
					rg.selectNode(body);
					var df = rg[createContextualFragment](text);
					clonedContainer[appendChild](df);
					return container[parentNode] ? container[parentNode].replaceChild(clonedContainer, container) : container[innerHTML] = text,
					cb();
				} else {
					clonedContainer[innerHTML] = text;
					return container[parentNode] ? container[parentNode].replaceChild(document[createDocumentFragment][appendChild](clonedContainer), container) : container[innerHTML] = text,
					cb();
				}
			} catch (e) {
				console.log(e);
				return;
			}
		};

		var insertFromTemplate = function (parsedJson, templateId, targetId, callback, useInner) {
			var _useInner = useInner || "";
			var template = document[getElementById](templateId) || "";
			var target = document[getElementById](targetId) || "";
			var cb = function () {
				return callback && "function" === typeof callback && callback();
			};
			if (parsedJson && template && target) {
				var targetRendered = renderTemplate(parsedJson, templateId, targetId);
				if (_useInner) {
					target[innerHTML] = targetRendered;
					cb();
				} else {
					insertTextAsFragment(targetRendered, target, cb);
				}
			}
		};

		var isValidId = function (a, full) {
			return full ? /^\#[A-Za-z][-A-Za-z0-9_:.]*$/.test(a) ? true : false : /^[A-Za-z][-A-Za-z0-9_:.]*$/.test(a) ? true : false;
		};

		var findPos = function (a) {
			a = a.getBoundingClientRect();
			return {
				top: Math.round(a.top + (root.pageYOffset || docElem.scrollTop || docBody.scrollTop) - (docElem.clientTop || docBody.clientTop || 0)),
				left: Math.round(a.left + (root.pageXOffset || docElem.scrollLeft || docBody.scrollLeft) - (docElem.clientLeft || docBody.clientLeft || 0))
			};
		};

		var alignToMasterBottomLeft = function (masterId, servantId, sameWidth) {
			sameWidth = sameWidth || "";
			var master = document[getElementById](masterId) || "";
			var servant = document[getElementById](servantId) || "";
			if (master && servant) {
				var style = servant.style || "";
				if (style) {
					if (sameWidth) {
						style.width = servant.offsetWidth + "px";
					}
					style.left = master.offsetLeft + "px";
					style.top = (master.offsetTop + master.offsetHeight) + "px";
				}
			}
		};

		var removeChildren = function (e) {
			if (e && e.firstChild) {
				for (; e.firstChild; ) {
					e.removeChild(e.firstChild);
				}
			}
		};

		var insertExternalHTML = function (id, url, callback, onerror) {
			var container = document[getElementById](id.replace(/^#/, "")) || "";
			var arrange = function () {
				var x = root.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
				x.overrideMimeType("text/html;charset=utf-8");
				x.open("GET", url, !0);
				x.withCredentials = !1;
				x.onreadystatechange = function () {
					var cb = function () {
						return callback && "function" === typeof callback && callback();
					};
					if (x.status === 404 || x.status === 0) {
						console.log("Error XMLHttpRequest-ing file", x.status);
						return onerror && "function" === typeof onerror && onerror();
					} else if (x.readyState === 4 && x.status === 200 && x.responseText) {
						var frag = x.responseText;
						try {
							var clonedContainer = container[cloneNode](false);
							if (document[createRange]) {
								var rg = document[createRange]();
								rg.selectNode(docBody);
								var df = rg[createContextualFragment](frag);
								clonedContainer[appendChild](df);
								return container[parentNode] ? container[parentNode][replaceChild](clonedContainer, container) : container[innerHTML] = frag,
								cb();
							} else {
								clonedContainer[innerHTML] = frag;
								return container[parentNode] ? container[parentNode][replaceChild](document[createDocumentFragment][appendChild](clonedContainer), container) : container[innerHTML] = frag,
								cb();
							}
						} catch (e) {
							console.log(e);
						}
						return;
					}
				};
				x.send(null);
			};
			if (container) {
				arrange();
			}
		};

		var handleExternalLink = function (url, ev) {
			ev.stopPropagation();
			ev.preventDefault();
			var logic = function () {
					openDeviceBrowser(url);
				};
				debounce(logic, 200).call(root);
		};
		var manageExternalLinkAll = function (scope) {
			var ctx = scope && scope.nodeName ? scope : "";
			var linkTag = "a";
			var link = ctx ? ctx[getElementsByTagName](linkTag) || "" : document[getElementsByTagName](linkTag) || "";
			var arrange = function (e) {
				var externalLinkIsBindedClass = "external-link--is-binded";
				if (!e[classList].contains(externalLinkIsBindedClass)) {
					var url = e[getAttribute]("href") || "";
					if (url && parseLink(url).isCrossDomain && parseLink(url).hasHTTP) {
						e.title = "" + (parseLink(url).hostname || "") + " откроется в новой вкладке";
						if ("undefined" !== typeof getHTTP && getHTTP()) {
							e.target = "_blank";
							e.rel = "noopener";
						} else {
							e[_addEventListener]("click", handleExternalLink.bind(null, url));
						}
						e[classList].add(externalLinkIsBindedClass);
					}
				}
			};
			if (link) {
				var i,
				l;
				for (i = 0, l = link[_length]; i < l; i += 1) {
					arrange(link[i]);
				}
				i = l = null;
			}
		};
		manageExternalLinkAll();

		var handleDataSrcImageAll = function () {
			var img = document[getElementsByClassName]("data-src-img") || "";
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
			var timer = setTimeout(function () {
					clearTimeout(timer);
					timer = null;
					handleDataSrcImageAll();
				}, 100);
		};
		manageDataSrcImageAll();
		/* root[_addEventListener]("load", manageDataSrcImageAll); */

		var handleDataSrcIframeAll = function () {
			var iframe = document[getElementsByClassName]("data-src-iframe") || "";
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
							e.src = srcString;
							e[classList].add(isActiveClass);
							e[classList].add(isBindedClass);
							e[setAttribute]("frameborder", "no");
							e[setAttribute]("style", "border:none;");
							e[setAttribute]("webkitallowfullscreen", "true");
							e[setAttribute]("mozallowfullscreen", "true");
							e[setAttribute]("scrolling", "no");
							e[setAttribute]("allowfullscreen", "true");
						}
					}
				}
			};
			if (iframe) {
				for (var i = 0, l = iframe[_length]; i < l; i += 1) {
					arrange(iframe[i]);
				}
				/* forEach(iframe, arrange, false); */
			}
		};
		var handleDataSrcIframeAllWindow = function () {
			var throttlehandleDataSrcIframeAll = throttle(handleDataSrcIframeAll, 100);
			throttlehandleDataSrcIframeAll();
		};
		var manageDataSrcIframeAll = function () {
			root[_removeEventListener]("scroll", handleDataSrcIframeAllWindow, {passive: true});
			root[_removeEventListener]("resize", handleDataSrcIframeAllWindow);
			root[_addEventListener]("scroll", handleDataSrcIframeAllWindow, {passive: true});
			root[_addEventListener]("resize", handleDataSrcIframeAllWindow);
			var timer = setTimeout(function () {
					clearTimeout(timer);
					timer = null;
					handleDataSrcIframeAll();
				}, 100);
		};
		manageDataSrcIframeAll();
		/* root[_addEventListener]("load", manageDataSrcIframeAll); */

		var manageIframeLightboxLinkAll = function (linkClass) {
			var link = document[getElementsByClassName](linkClass) || "";
			var arrange = function (e) {
				if (!e[classList].contains(isBindedClass)) {
					e.lightbox = new IframeLightbox(e, {
								touch: false
							});
					e[classList].add(isBindedClass);
				}
			};
			if (link) {
				var i,
				l;
				for (i = 0, l = link[_length]; i < l; i += 1) {
					arrange(link[i]);
				}
				i = l = null;
			}
		};
		manageIframeLightboxLinkAll();

		var hideImgLightbox = function () {
			var container = document[getElementsByClassName]("img-lightbox-container")[0] || "";
			var img = container ? container[getElementsByTagName]("img")[0] || "" : "";
			var animatedClass = "animated";
			var fadeInClass = "fadeIn";
			var fadeInUpClass = "fadeInUp";
			var fadeOutClass = "fadeOut";
			var fadeOutDownClass = "fadeOutDown";
			var dummySrc = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
			var hideContainer = function () {
				container[classList].remove(fadeInClass);
				container[classList].add(fadeOutClass);
				var hideImg = function () {
					container[classList].remove(animatedClass);
					container[classList].remove(fadeOutClass);
					img[classList].remove(animatedClass);
					img[classList].remove(fadeOutDownClass);
					img.src = dummySrc;
					container[style].display = "none";
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
		};
		var handleImgLightboxContainer = function () {
			var container = document[getElementsByClassName]("img-lightbox-container")[0] || "";
			if (container) {
				container[_removeEventListener]("click", handleImgLightboxContainer);
				hideImgLightbox();
			}
		};
		var handleImgLightboxWindow = function (ev) {
			var _removeEventListener = "removeEventListener";
			root[_removeEventListener]("keyup", handleImgLightboxWindow);
			if (27 === (ev.which || ev.keyCode)) {
				hideImgLightbox();
			}
		};
		var manageImgLightboxLinkAll = function (scope) {
			var ctx = scope && scope.nodeName ? scope : "";
			var linkClass = "img-lightbox-link";
			var link = ctx ? ctx[getElementsByClassName](linkClass) || "" : document[getElementsByClassName](linkClass) || "";
			var containerClass = "img-lightbox-container";
			var container = document[getElementsByClassName](containerClass)[0] || "";
			var img = container ? container[getElementsByTagName]("img")[0] || "" : "";
			var animatedClass = "animated";
			var fadeInClass = "fadeIn";
			var fadeInUpClass = "fadeInUp";
			var dummySrc = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
			if (!container) {
				container = document[createElement]("div");
				img = document[createElement]("img");
				img.src = dummySrc;
				img.alt = "";
				container[appendChild](img);
				container[classList].add(containerClass);
				appendFragment(container, docBody);
			}
			var arrange = function (e) {
				var handleImgLightboxLink = function (ev) {
					ev.stopPropagation();
					ev.preventDefault();
					var _this = this;
					var logicHandleImgLightboxLink = function () {
						var hrefString = _this[getAttribute]("href") || "";
						if (container && img && hrefString) {
							LoadingSpinner.show();
							container[classList].add(animatedClass);
							container[classList].add(fadeInClass);
							img[classList].add(animatedClass);
							img[classList].add(fadeInUpClass);
							if (parseLink(hrefString).isAbsolute && !parseLink(hrefString).hasHTTP) {
								hrefString = hrefString.replace(/^/, forcedHTTP + ":");
							}
							imagePromise(hrefString).then(function () {
								img.src = hrefString;
							}).catch (function (err) {
								console.log("cannot load image with imagePromise:", hrefString, err);
							});
							root[_addEventListener]("keyup", handleImgLightboxWindow);
							container[_addEventListener]("click", handleImgLightboxContainer);
							container[style].display = "block";
							LoadingSpinner.hide();
						}
					};
					var debounceLogicHandleImgLightboxLink = debounce(logicHandleImgLightboxLink, 200);
					debounceLogicHandleImgLightboxLink();
				};
				if (!e[classList].contains(isBindedClass)) {
					var hrefString = e[getAttribute]("href") || "";
					if (hrefString) {
						if (parseLink(hrefString).isAbsolute && !parseLink(hrefString).hasHTTP) {
							e.setAttribute("href", hrefString.replace(/^/, forcedHTTP + ":"));
						}
						e[_addEventListener]("click", handleImgLightboxLink);
						e[classList].add(isBindedClass);
					}
				}
			};
			if (link) {
				for (var j = 0, l = link[_length]; j < l; j += 1) {
					arrange(link[j]);
				}
			}
		};

		var handleOtherDropdownLists = function (_self) {
			var _this = _self || this;
			var list = document[getElementsByClassName](isDropdownClass) || "";
			var removeActiveClass = function (e) {
				if (_this !== e) {
					e[classList].remove(isActiveClass);
				}
			};
			if (list) {
				for (var i = 0, l = list[_length]; i < l; i += 1) {
					removeActiveClass(list[i]);
				}
				/* forEach(list, removeActiveClass, false); */
			}
		};
		var manageOtherDropdownListAll = function () {
			var container = document[getElementById]("container") || "";
			if (container) {
				container[_addEventListener]("click", handleOtherDropdownLists);
			}
		};
		manageOtherDropdownListAll();
		root[_addEventListener]("hashchange", handleOtherDropdownLists);

		var manageChaptersSelect = function () {
			var chaptersSelect = document[getElementById]("chapters-select") || "";
			var holderChaptersSelect = document[getElementsByClassName]("holder-chapters-select")[0] || "";
			var uiPanelContentsSelect = document[getElementsByClassName]("ui-panel-contents-select")[0] || "";
			var chaptersListClass = "chapters-list";
			/* var rerenderChaptersSelect = function () {
				var handleChaptersSelect = function () {
					var _this = this;
					var hashString = _this.options[_this.selectedIndex].value || "";
					var uiPanelContentsSelectHeight = uiPanelContentsSelect ? (uiPanelContentsSelect[classList].contains(isFixedClass) ? uiPanelContentsSelect.offsetHeight : uiPanelContentsSelect.offsetHeight * 2) : 0;
					if (hashString) {
						var targetObj = hashString ? (isValidId(hashString, true) ? document[getElementById](hashString.replace(/^#/,"")) || "" : "") : "";
						if (targetObj) {
							scroll2Top(findPos(targetObj).top - uiPanelContentsSelectHeight, 10000);
						} else {
							root.location.hash = hashString;
						}
					}
				};
				if (!chaptersSelect[classList].contains(isBindedClass)) {
					chaptersSelect[_addEventListener]("change", handleChaptersSelect);
					chaptersSelect[classList].add(isBindedClass);
				}
				var rerenderOption = function (option) {
					if (option) {
						var optionText = option.textContent;
						option.title = optionText;
						var optionTextTruncated = truncString("" + optionText, 28);
						removeChildren(option);
						appendFragment(document[createTextNode](optionTextTruncated), option);
					}
				};
				var chaptersSelectOptions = chaptersSelect ? chaptersSelect[getElementsByTagName]("option") || "" : "";
				for (var i = 0, l = chaptersSelectOptions[_length]; i < l; i += 1) {
					rerenderOption(chaptersSelectOptions[i]);
				}
			}; */
			var rerenderChaptersList = function () {
				var handleChaptersListItem = function (listObj, hashString) {
					var uiPanelContentsSelectHeight = uiPanelContentsSelect ? (uiPanelContentsSelect[classList].contains(isFixedClass) ? uiPanelContentsSelect.offsetHeight : uiPanelContentsSelect.offsetHeight * 2) : 0;
					if (hashString) {
						var targetObj = hashString ? (isValidId(hashString, true) ? document[getElementById](hashString.replace(/^#/,"")) || "" : "") : "";
						if (targetObj) {
							scroll2Top(findPos(targetObj).top - uiPanelContentsSelectHeight, 10000);
						} else {
							root.location.hash = hashString;
						}
					}
					listObj[classList].remove(isActiveClass);
				};
				var chaptersList = document[createElement]("ul");
				var chaptersListItems = chaptersSelect ? chaptersSelect[getElementsByTagName]("option") || "" : "";
				var chaptersListButtonDefaultText = "";
				var df = document[createDocumentFragment]();
				var generateChaptersListItems = function (_this, i) {
					if (0 === i) {
						chaptersListButtonDefaultText = _this.firstChild.textContent;
					}
					var chaptersListItem = document[createElement]("li");
					var chaptersListItemText = _this.firstChild.textContent || "";
					var chaptersListItemValue = _this.value;
					var chaptersListItemTextTruncated = truncString("" + chaptersListItemText, 28);
					chaptersListItem[appendChild](document[createTextNode](chaptersListItemTextTruncated));
					chaptersListItem.title = chaptersListItemText;
					chaptersListItem[_addEventListener]("click", handleChaptersListItem.bind(null, chaptersList, chaptersListItemValue));
					df[appendChild](chaptersListItem);
					df[appendChild](document[createTextNode]("\n"));
				};
				for (var i = 0, l = chaptersListItems[_length]; i < l; i += 1) {
					generateChaptersListItems(chaptersListItems[i], i);
				}
				/* forEach(chaptersListItems, generateChaptersListItems, false); */
				appendFragment(df, chaptersList);
				chaptersList[classList].add(chaptersListClass);
				chaptersList[classList].add(isDropdownClass);
				holderChaptersSelect.replaceChild(chaptersList, chaptersSelect[parentNode][parentNode]);
				var chaptersListButton = document[createElement]("a");
				chaptersListButton[appendChild](document[createTextNode](chaptersListButtonDefaultText));
				chaptersList[parentNode].insertBefore(chaptersListButton, chaptersList);
				/* jshint -W107 */
				chaptersListButton.href = "javascript:void(0);";
				/* jshint +W107 */
				var insertChevronDownSmallSvg = function (targetObj) {
					var svg = document[createElementNS]("http://www.w3.org/2000/svg", "svg");
					var use = document[createElementNS]("http://www.w3.org/2000/svg", "use");
					svg[setAttribute]("class", "ui-icon");
					use[setAttributeNS]("http://www.w3.org/1999/xlink", "xlink:href", "#ui-icon-ChevronDownSmall");
					svg[appendChild](use);
					targetObj[appendChild](svg);
				};
				insertChevronDownSmallSvg(chaptersListButton);
				var handleChaptersListItemsButton = function (ev) {
					ev.stopPropagation();
					ev.preventDefault();
					chaptersList[classList].toggle(isActiveClass);
					handleOtherDropdownLists(chaptersList);
				};
				chaptersListButton[_addEventListener]("click", handleChaptersListItemsButton);
			};
			if (holderChaptersSelect && chaptersSelect) {
				/* rerenderChaptersSelect(); */
				rerenderChaptersList();
			}
		};

		var manageExpandingLayers = function (scope) {
			var ctx = scope && scope.nodeName ? scope : "";
			var btnClass = "btn-expand-hidden-layer";
			var btn = ctx ? ctx[getElementsByClassName](btnClass) || "" : document[getElementsByClassName](btnClass) || "";
			var arrange = function (e) {
				var handleExpandingLayerAll = function () {
					var _this = this;
					var s = _this[parentNode] ? _this[parentNode].nextElementSibling : "";
					if (s) {
						_this[classList].toggle(isActiveClass);
						s[classList].toggle(isActiveClass);
					}
					return;
				};
				if (!e[classList].contains(isBindedClass)) {
					e[_addEventListener]("click", handleExpandingLayerAll);
					e[classList].add(isBindedClass);
				}
			};
			if (btn) {
				var i,
				l;
				for (i = 0, l = btn[_length]; i < l; i += 1) {
					arrange(btn[i]);
				}
				i = l = null;
				/* forEach(btn, arrange, false); */
			}
		};

		var msnry;
		var pckry;
		var initMasonry = function (scope) {
			var ctx = scope && scope.nodeName ? scope : "";
			var gridClass = "masonry-grid";
			var gridItemClass = "masonry-grid-item";
			var gridItemSelector = ".masonry-grid-item";
			var gridSizerSelector = ".masonry-grid-sizer";
			var grid = ctx ? ctx[getElementsByClassName](gridClass)[0] || "" : document[getElementsByClassName](gridClass)[0] || "";
			var gridItem = ctx ? ctx[getElementsByClassName](gridItemClass)[0] || "" : document[getElementsByClassName](gridItemClass)[0] || "";
			var initScript = function () {
				if (root.Masonry) {
					if (msnry) {
						msnry.destroy();
					}
					msnry = new Masonry(grid, {
							itemSelector: gridItemSelector,
							columnWidth: gridSizerSelector,
							gutter: 0,
							percentPosition: true
						});
				} else {
					if (root.Packery) {
						if (pckry) {
							pckry.destroy();
						}
						pckry = new Packery(grid, {
								itemSelector: gridItemSelector,
								columnWidth: gridSizerSelector,
								gutter: 0,
								percentPosition: true
							});
					}
				}
				var timer = setTimeout(function () {
					clearTimeout(timer);
					timer = null;
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
				/* var jsUrl = "./cdn/masonry/4.1.1/js/masonry.pkgd.fixed.min.js"; */
				/* var jsUrl = "./cdn/packery/2.1.1/js/packery.pkgd.fixed.min.js";
				if (!scriptIsLoaded(jsUrl)) {
					var load;
					load = new loadJsCss([jsUrl], initScript);
				} else {
					initScript();
				} */
				initScript();
			}
		};

		var manageDisqusButton = function (scope) {
			var ctx = scope && scope.nodeName ? scope : "";
			var btnClass = "btn-show-disqus";
			var btn = ctx ? ctx[getElementsByClassName](btnClass)[0] || "" : document[getElementsByClassName](btnClass)[0] || "";
			var disqusThread = document[getElementById]("disqus_thread") || "";
			var locationHref = root.location.href || "";
			var disqusThreadShortname = disqusThread ? (disqusThread[dataset].shortname || "") : "";
			var hideDisqusButton = function () {
				disqusThread[classList].add(isActiveClass);
				btn[style].display = "none";
			};
			var hideDisqusThread = function () {
				removeChildren(disqusThread);
				var replacementText = document[createElement]("p");
				replacementText[appendChild](document[createTextNode]("Комментарии доступны только в веб версии этой страницы."));
				appendFragment(replacementText, disqusThread);
				disqusThread.removeAttribute("id");
				hideDisqusButton();
			};
			var addBtnHandler = function () {
				var handleDisqusButton = function (ev) {
					ev.stopPropagation();
					ev.preventDefault();
					var logicHandleDisqusButton = function () {
						var initScript = function () {
							if (root.DISQUS) {
								try {
									DISQUS.reset({
										reload: true,
										config: function () {
											this.page.identifier = disqusThreadShortname;
											this.page.url = locationHref;
										}
									});
									btn[_removeEventListener]("click", handleDisqusButton);
									hideDisqusButton();
								} catch (err) {
									throw new Error("cannot DISQUS.reset " + err);
								}
							}
						};
						var jsUrl = forcedHTTP + "://" + disqusThreadShortname + ".disqus.com/embed.js";
						if (!scriptIsLoaded(jsUrl)) {
							var load;
							load = new loadJsCss([jsUrl], initScript);
						} else {
							initScript();
						}
					};
					var debounceLogicHandleDisqusButton = debounce(logicHandleDisqusButton, 200);
					debounceLogicHandleDisqusButton();
				};
				btn[_addEventListener]("click", handleDisqusButton);
				btn[classList].add(isBindedClass);
			};
			if (disqusThread && btn && disqusThreadShortname && locationHref) {
				if ("undefined" !== typeof getHTTP && getHTTP()) {
					if (!btn[classList].contains(isBindedClass)) {
						addBtnHandler();
					}
				} else {
					hideDisqusThread();
				}
			}
		};

		var notiBar = function (opt) {
			var notibarClass = "notibar";
			var notibarContainer = document[getElementsByClassName](notibarClass)[0] || "";
			var messageClass = "message";
			var closeButtonClass = "close";
			var defaultKey = "_notibar_dismiss_";
			var defaultDatum = "ok";
			var animatedClass = "animated";
			var fadeInDownClass = "fadeInDown";
			var fadeOutUpClass = "fadeOutUp";
			if ("string" === typeof opt) {
				opt = {
					"message": opt
				};
			}
			var settings = {
				"message": "",
				"timeout": 10000,
				"key": defaultKey,
				"datum": defaultDatum,
				"days": 0,
			};
			for (var i in opt) {
				if (opt.hasOwnProperty(i)) {
					settings[i] = opt[i];
				}
			}
			var cookieKey = Cookies.get(settings.key) || "";
			if (cookieKey && cookieKey === decodeURIComponent(settings.datum)) {
				return;
			}
			if (notibarContainer) {
				removeChildren(notibarContainer);
			} else {
				notibarContainer = document[createElement]("div");
				notibarContainer[classList].add(notibarClass);
				notibarContainer[classList].add(animatedClass);
			}
			var msgContainer = document[createElement]("div");
			msgContainer[classList].add(messageClass);
			var msgContent = settings.message || "";
			if ("string" === typeof msgContent) {
				msgContent = document[createTextNode](msgContent);
			}
			msgContainer[appendChild](msgContent);
			notibarContainer[appendChild](msgContainer);
			var insertCancelSvg = function (targetObj) {
				var svg = document[createElementNS]("http://www.w3.org/2000/svg", "svg");
				var use = document[createElementNS]("http://www.w3.org/2000/svg", "use");
				svg[setAttribute]("class", "ui-icon");
				use[setAttributeNS]("http://www.w3.org/1999/xlink", "xlink:href", "#ui-icon-Cancel");
				svg[appendChild](use);
				targetObj[appendChild](svg);
			},
			closeButton = document[createElement]("a");
			closeButton[classList].add(closeButtonClass);
			insertCancelSvg(closeButton);
			var setCookie = function () {
				if (settings.days) {
					Cookies.set(settings.key, settings.datum, {
						expires: settings.days
					});
				} else {
					Cookies.set(settings.key, settings.datum);
				}
			};
			var hideMessage = function () {
				var notibarContainer = document[getElementsByClassName](notibarClass)[0] || "";
				if (notibarContainer) {
					notibarContainer[classList].remove(fadeInDownClass);
					notibarContainer[classList].add(fadeOutUpClass);
					removeChildren(notibarContainer);
				}
			};
			var handleCloseButton = function () {
				closeButton[_removeEventListener]("click", handleCloseButton);
				hideMessage();
				setCookie();
			};
			closeButton[_addEventListener]("click", handleCloseButton);
			notibarContainer[appendChild](closeButton);
			if (docBody) {
				appendFragment(notibarContainer, docBody);
				notibarContainer[classList].remove(fadeOutUpClass);
				notibarContainer[classList].add(fadeInDownClass);
				var timer = setTimeout(function () {
					clearTimeout(timer);
					timer = null;
					hideMessage();
				}, settings.timeout);
			}
		};

		var initNotibarMsg = function () {
			var uiPanelContentsSelect = document[getElementsByClassName]("ui-panel-contents-select")[0] || "";
			var cookieKey = "_notibar_dismiss_";
			var cookieDatum = "Выбрать статью можно щелкнув по самофиксирующейся планке с заголовком текущей страницы.";
			var locationOrigin = parseLink(root.location.href).origin;
			var arrange = function () {
				var timer = setTimeout(function () {
					clearTimeout(timer);
					timer = null;
					var msgObj = document[createElement]("a");
					/* jshint -W107 */
					msgObj.href = "javascript:void(0);";
					/* jshint +W107 */
					var handleMsgObj = function (ev) {
						ev.stopPropagation();
						ev.preventDefault();
						msgObj[_removeEventListener]("click", handleMsgObj);
						var uiPanelContentsSelectPos = uiPanelContentsSelect ? findPos(uiPanelContentsSelect).top : 0;
						var uiPanelContentsSelectHeight = uiPanelContentsSelect ? (uiPanelContentsSelect[classList].contains(isFixedClass) ? uiPanelContentsSelect.offsetHeight : uiPanelContentsSelect.offsetHeight) : 0;
						scroll2Top(uiPanelContentsSelectPos - uiPanelContentsSelectHeight, 2000);
					};
					msgObj[_addEventListener]("click", handleMsgObj);
					msgObj[appendChild](document[createTextNode](cookieDatum));
					notiBar({
						"message": msgObj,
						"timeout": 5000,
						"key": cookieKey,
						"datum": cookieDatum,
						"days": 0
					});
				}, 3000);
			};
			if (locationOrigin && uiPanelContentsSelect) {
				if ("undefined" !== typeof getHTTP && getHTTP()) {
					arrange();
				}
			}
		};
		initNotibarMsg();

		var manageSearchInput = function () {
			var searchInput = document[getElementById]("text") || "";
			var handleSearchInputValue = function () {
				var _this = this;
				var logicHandleSearchInputValue = function () {
					_this.value = _this.value.replace(/\\/g, "").replace(/ +(?= )/g, " ").replace(/\/+(?=\/)/g, "/") || "";
				};
				var debounceLogicHandleSearchInputValue = debounce(logicHandleSearchInputValue, 200);
				debounceLogicHandleSearchInputValue();
			};
			if (searchInput) {
				searchInput.focus();
				searchInput[_addEventListener]("input", handleSearchInputValue);
			}
		};
		manageSearchInput();

		var initKamilAutocomplete = function (jsonObj) {
			var searchForm = document[getElementsByClassName]("search-form")[0] || "";
			var textInputSelector = "#text";
			var textInput = document[getElementById]("text") || "";
			var container = document[getElementById]("container") || "";
			var typoAutcompleteListSelector = "kamil-typo-autocomplete";
			var typoAutcompleteListClass = "kamil-autocomplete";
			var initScript = function () {
				var ac;
				try {
					if (!jsonObj[0].hasOwnProperty("title")) {
						throw new Error("incomplete JSON data: no title");
					}
					ac = new Kamil(textInputSelector, {
							source: jsonObj,
							property: "title",
							minChars: 2
						});
				} catch (err) {
					console.log("cannot init Kamil", err);
					return;
				}
				/*!
				 * create typo suggestion list
				 */
				var typoAutcompleteList = document[createElement]("ul");
				var typoListItem = document[createElement]("li");
				var handleTypoSuggestion = function () {
					typoAutcompleteList[style].display = "none";
					typoListItem[style].display = "none";
				};
				var showTypoSuggestion = function () {
					typoAutcompleteList[style].display = "block";
					typoListItem[style].display = "block";
				};
				typoAutcompleteList[classList].add(typoAutcompleteListClass);
				typoAutcompleteList.id = typoAutcompleteListSelector;
				handleTypoSuggestion();
				typoAutcompleteList[appendChild](typoListItem);
				textInput[parentNode].insertBefore(typoAutcompleteList, textInput.nextElementSibling);
				/*!
				 * this is an optional setup of every li
				 * uset to set a description title attribute
				 * comment out the title attribute setup below
				 */
				ac.renderItem = function (ul, item) {
					var li = document[createElement]("li");
					/* li.innerHTML = item.title; */
					appendFragment(document[createTextNode]("" + item.title), li);
					li.title = item.text;
					ul.appendChild(li);
					return li;
				};
				/*!
				 * show suggestions
				 */
				ac.renderMenu = function (ul, stance) {
					var items = stance || "";
					var itemsLength = items[_length];
					var _this = this;
					/*!
					 * limit output
					 */
					var limitKamilOutput = function (e, i) {
						if (i < 10) {
							_this._renderItemData(ul, e, i);
						}
					};
					if (items) {
						for (var i = 0; i < itemsLength; i += 1) {
							limitKamilOutput(items[i], i);
						}
						/* forEach(items, function (e, i) {
							limitKamilOutput(e, i);
						}, false); */
					}
					/*!
					 * fix typo - non latin characters found
					 */
					var logicReplaceTypo = function () {
						while (itemsLength < 1) {
							var textInputValue = textInput.value || "";
							if (/[^\u0000-\u007f]/.test(textInputValue)) {
								textInputValue = fixEnRuTypo(textInputValue, "ru", "en");
							} else {
								textInputValue = fixEnRuTypo(textInputValue, "en", "ru");
							}
							showTypoSuggestion();
							removeChildren(typoListItem);
							appendFragment(document[createTextNode]("" + textInputValue), typoListItem);
							if (textInputValue.match(/^\s*$/)) {
								handleTypoSuggestion();
							}
							/*!
							 * hide typo suggestion
							 */
							if (textInput.value[_length] < 3 || textInput.value.match(/^\s*$/)) {
								handleTypoSuggestion();
							}
							itemsLength += 1;
						}
					};
					var debounceLogicReplaceTypo = debounce(logicReplaceTypo, 200);
					debounceLogicReplaceTypo();
					/*!
					 * truncate text
					 */
					var lis = ul ? ul[getElementsByTagName]("li") || "" : "";
					var truncateKamilText = function (e) {
						var truncText = e.firstChild.textContent || "";
						var truncTextObj = document[createTextNode](truncString(truncText, 24));
						e.replaceChild(truncTextObj, e.firstChild);
						/* e.title = "" + truncText; */
					};
					if (lis) {
						for (var j = 0, m = lis[_length]; j < m; j += 1) {
							truncateKamilText(lis[j]);
						}
						/* forEach(lis, truncateKamilText, false); */
					}
				};
				/*!
				 * set text input value from typo suggestion
				 */
				var handleTypoListItem = function (ev) {
					ev.stopPropagation();
					ev.preventDefault();
					/*!
					 * set focus first, then set text
					 */
					textInput.focus();
					textInput.value = typoListItem.textContent || "";
					handleTypoSuggestion();
				};
				typoListItem[_addEventListener]("click", handleTypoListItem);
				/*!
				 * hide suggestions on outside click
				 */
				if (container) {
					container[_addEventListener]("click", handleTypoSuggestion);
				}
				/*!
				 * unless you specify property option in new Kamil
				 * use kamil built-in word label as search key in JSON file
				 * [{"link":"/","label":"some text to match"},
				 * {"link":"/pages/contents.html","label":"some text to match"}]
				 */
				ac.on("kamilselect", function (e) {
					var kamilItemLink = e.item.href || "";
					var handleKamilItem = function () {
						e.inputElement.value = "";
						handleTypoSuggestion();
						root.location.href = kamilItemLink;
					};
					if (kamilItemLink) {
						/*!
						 * nwjs wont like setImmediate here
						 */
						/* setImmediate(handleKamilItem); */
						handleKamilItem();
					}
				});
			};
			if (searchForm && textInput) {
				/* var jsUrl = "./cdn/kamil/0.1.1/js/kamil.fixed.min.js";
				if (!scriptIsLoaded(jsUrl)) {
					var load;
					load = new loadJsCss([jsUrl], initScript);
				} */
				initScript();
			}
		};

		var renderNavigation = function () {
			var navbar = document[getElementById]("navbar") || "";
			var navbarParent = navbar[parentNode] || "";
			var popularTemplateId = "template_navbar_popular";
			var popularTemplate = document[getElementById](popularTemplateId) || "";
			var popularRenderId = "render_navbar_popular";
			var popularRender = document[getElementById](popularRenderId) || "";
			var moreTemplateId = "template_navbar_more";
			var moreTemplate = document[getElementById](moreTemplateId) || "";
			var moreRenderId = "render_navbar_more";
			var moreRender = document[getElementById](moreRenderId) || "";
			var carouselTemplateId = "template_b_carousel";
			var carouselTemplate = document[getElementById](carouselTemplateId) || "";
			var carouselRenderId = "render_b_carousel";
			var carouselRender = document[getElementById](carouselRenderId) || "";
			var carouselRenderParent = carouselRender[parentNode] || "";
			var showRenderNavbarPopularId = "show_render_navbar_popular";
			var showRenderNavbarPopular = document[getElementById](showRenderNavbarPopularId) || "";
			var renderNavbarPopularId = "render_navbar_popular";
			var renderNavbarPopular = document[getElementById](renderNavbarPopularId) || "";
			var showRenderNavbarMoreId = "show_render_navbar_more";
			var showRenderNavbarMore = document[getElementById](showRenderNavbarMoreId) || "";
			var renderNavbarMoreId = "render_navbar_more";
			var renderNavbarMore = document[getElementById](renderNavbarMoreId) || "";
			var navigationJsonUrl = "./libs/pwa-englishextra/json/navigation.json";
			var processNavigationJsonResponse = function (navigationJsonResponse) {
				try {
					var navigationJsonObj = JSON.parse(navigationJsonResponse);
					if (!navigationJsonObj.navbar_popular) {
						throw new Error("incomplete JSON data: no navbar_popular");
					} else if (!navigationJsonObj.navbar_more) {
						throw new Error("incomplete JSON data: no navbar_more");
					} else {
						if (!navigationJsonObj.b_carousel) {
							throw new Error("incomplete JSON data: no b_carousel");
						}
					}
					navigationJsonObj = null;
				} catch (err) {
					console.log("cannot init processNavigationJsonResponse", err);
					return;
				}
				var handleListItemAll = function (e) {
					var items = e ? e[getElementsByTagName]("li") || "" : "";
					var addHandler = function (e) {
						e[_addEventListener]("click", handleOtherDropdownLists);
					};
					if (items) {
						for (var i = 0, l = items[_length]; i < l; i += 1) {
							addHandler(items[i]);
						}
						/* forEach(btn, addHandler, false); */
					}
				};
				var handleShowRenderNavbarPopularButton = function (ev) {
					ev.stopPropagation();
					ev.preventDefault();
					renderNavbarPopular[classList].toggle(isActiveClass);
					handleOtherDropdownLists(renderNavbarPopular);
				};
				var handleShowRenderNavbarMoreButton = function (ev) {
					ev.stopPropagation();
					ev.preventDefault();
					renderNavbarMore[classList].toggle(isActiveClass);
					handleOtherDropdownLists(renderNavbarMore);
				};
				var alignNavbarListAll = function () {
					alignToMasterBottomLeft(showRenderNavbarPopularId, renderNavbarPopularId);
					alignToMasterBottomLeft(showRenderNavbarMoreId, renderNavbarMoreId);
				};
				var handleShowNavbarListsWindow = function () {
					var logicHandleShowNavbarListsWindow = alignNavbarListAll;
					var throttleLogicHandleShowNavbarListsWindow = throttle(logicHandleShowNavbarListsWindow, 100);
					throttleLogicHandleShowNavbarListsWindow();
				};
				if (popularTemplate && popularRender) {
					insertFromTemplate(navigationJsonResponse, popularTemplateId, popularRenderId, function () {
						if (moreTemplate && moreRender) {
							insertFromTemplate(navigationJsonResponse, moreTemplateId, moreRenderId, function () {
								alignNavbarListAll();
								handleListItemAll(renderNavbarPopular);
								handleListItemAll(renderNavbarMore);
								showRenderNavbarPopular[_addEventListener]("click", handleShowRenderNavbarPopularButton);
								showRenderNavbarMore[_addEventListener]("click", handleShowRenderNavbarMoreButton);
								root[_addEventListener]("resize", handleShowNavbarListsWindow);
								if (navbarParent) {
									manageExternalLinkAll(navbarParent);
								}
							}, true);
						}
					}, true);
				}
				if (carouselTemplate && carouselRender) {
					insertFromTemplate(navigationJsonResponse, carouselTemplateId, carouselRenderId, function () {
						var carousel;
						carousel = new Carousel({
								"main": "js-carousel",
								"wrap": "js-carousel__wrap",
								"prev": "js-carousel__prev",
								"next": "js-carousel__next"
							});
						if (carouselRenderParent) {
							manageExternalLinkAll(carouselRenderParent);
							var timer = setTimeout(function () {
								clearTimeout(timer);
								timer = null;
								handleDataSrcImageAll();
							}, 500);
						}
					});
				}
			};
			if (navbar) {
				loadUnparsedJSON(navigationJsonUrl, processNavigationJsonResponse);
			}
		};
		renderNavigation();

		var fixUiPanelContentsSelect = function () {
			var uiPanelNavigation = document[getElementsByClassName]("ui-panel-navigation")[0] || "";
			var holderHero = document[getElementsByClassName]("holder-hero")[0] || "";
			var uiPanelContentsSelect = document[getElementsByClassName]("ui-panel-contents-select")[0] || "";
			var criticalHeight = (uiPanelNavigation ? uiPanelNavigation.offsetHeight : 0) + (holderHero ? holderHero.offsetHeight : 0);
			var handleUiPanelContentsSelect = function () {
				var logicHandleUiPanelContentsSelect = function () {
					if ((docBody.scrollTop || docElem.scrollTop || 0) > criticalHeight) {
						uiPanelContentsSelect[classList].add(isFixedClass);
					} else {
						uiPanelContentsSelect[classList].remove(isFixedClass);
					}
				};
				var throttleLogicHandleUiPanelContentsSelect = throttle(logicHandleUiPanelContentsSelect, 100);
				throttleLogicHandleUiPanelContentsSelect();
			};
			if (uiPanelContentsSelect) {
				root[_addEventListener]("scroll", handleUiPanelContentsSelect, {passive: true});
			}
		};
		fixUiPanelContentsSelect();

		var handleOtherSocialButtons = function (_self) {
			var _this = _self || this;
			var btn = document[getElementsByClassName](isCollapsableClass) || "";
			var removeActiveClass = function (e) {
				if (_this !== e) {
					e[classList].remove(isActiveClass);
				}
			};
			if (btn) {
				var i,
				l;
				for (i = 0, l = btn[_length]; i < l; i += 1) {
					removeActiveClass(btn[i]);
				}
				i = l = null;
			}
		};
		var manageOtherSocialButtonAll = function () {
			var container = document[getElementById]("container") || "";
			if (container) {
				container[_addEventListener]("click", handleOtherSocialButtons);
			}
		};
		manageOtherSocialButtonAll();
		root[_addEventListener]("hashchange", handleOtherSocialButtons);

		var manageLocationQrCodeImage = function () {
			var btn = document[getElementsByClassName]("btn-toggle-holder-location-qrcode")[0] || "";
			var holder = document[getElementsByClassName]("holder-location-qrcode")[0] || "";
			var locationHref = root.location.href || "";
			var handleLocationQrCodeButton = function (ev) {
				ev.stopPropagation();
				ev.preventDefault();
				var logic = function () {
					holder[classList].toggle(isActiveClass);
					holder[classList].add(isCollapsableClass);
					handleOtherSocialButtons(holder);
					var locationHref = root.location.href || "";
					var newImg = document[createElement]("img");
					var newTitle = document[title] ? ("Ссылка на страницу «" + document[title].replace(/\[[^\]]*?\]/g, "").trim() + "»") : "";
					var newSrc = forcedHTTP + "://chart.googleapis.com/chart?cht=qr&chld=M%7C4&choe=UTF-8&chs=512x512&chl=" + encodeURIComponent(locationHref);
					newImg.alt = newTitle;
					var initScript = function () {
						if (root.QRCode) {
							if ("undefined" !== typeof earlySvgSupport && "svg" === earlySvgSupport) {
								newSrc = QRCode.generateSVG(locationHref, {
										ecclevel: "M",
										fillcolor: "#FFFFFF",
										textcolor: "#191919",
										margin: 4,
										modulesize: 8
									});
								var XMLS = new XMLSerializer();
								newSrc = XMLS.serializeToString(newSrc);
								newSrc = "data:image/svg+xml;base64," + root.btoa(unescape(encodeURIComponent(newSrc)));
								newImg.src = newSrc;
							} else {
								newSrc = QRCode.generatePNG(locationHref, {
										ecclevel: "M",
										format: "html",
										fillcolor: "#FFFFFF",
										textcolor: "#191919",
										margin: 4,
										modulesize: 8
									});
								newImg.src = newSrc;
							}
						} else {
							newImg.src = newSrc;
						}
						newImg[classList].add("qr-code-img");
						newImg.title = newTitle;
						removeChildren(holder);
						appendFragment(newImg, holder);
					};
					/* var jsUrl = "./cdn/qrjs2/0.1.7/js/qrjs2.fixed.min.js";
					if (!scriptIsLoaded(jsUrl)) {
						var load;
						load = new loadJsCss([jsUrl], initScript);
					} else {
						initScript();
					} */
					initScript();
				};
				debounce(logic, 200).call(root);
			};
			if (btn && holder && locationHref) {
				if ("undefined" !== typeof getHTTP && getHTTP()) {
					btn[_addEventListener]("click", handleLocationQrCodeButton);
				}
			}
		};
		manageLocationQrCodeImage();

		var yshare;
		var manageShareButton = function () {
			var btn = document[getElementsByClassName]("btn-toggle-holder-share-buttons")[0] || "";
			var yaShare2Id = "ya-share2";
			var yaShare2 = document[getElementById](yaShare2Id) || "";
			var holder = document[getElementsByClassName]("holder-share-buttons")[0] || "";
			var handleShareButton = function (ev) {
				ev.stopPropagation();
				ev.preventDefault();
				var logic = function () {
					holder[classList].toggle(isActiveClass);
					holder[classList].add(isCollapsableClass);
					handleOtherSocialButtons(holder);
					var initScript = function () {
						try {
							if (yshare) {
								yshare.updateContent({
									title: document[title] || "",
									description: document[title] || "",
									url: root.location.href || ""
								});
							} else {
								yshare = Ya.share2(yaShare2Id, {
									content: {
										title: document[title] || "",
										description: document[title] || "",
										url: root.location.href || ""
									}
								});
							}
						} catch (err) {
							throw new Error("cannot yshare.updateContent or Ya.share2 " + err);
						}
					};
					var jsUrl = forcedHTTP + "://yastatic.net/share2/share.js";
					if (!root.Ya) {
						var load;
						load = new loadJsCss([jsUrl], initScript);
					} else {
						initScript();
					}
				};
				debounce(logic, 200).call(root);
			};
			if (btn && holder && yaShare2) {
				if ("undefined" !== typeof getHTTP && getHTTP()) {
					btn[_addEventListener]("click", handleShareButton);
				}
			}
		};
		manageShareButton();

		var vlike;
		var manageVKLikeButton = function () {
			var btn = document[getElementsByClassName]("btn-toggle-holder-vk-like")[0] || "";
			var holder = document[getElementsByClassName]("holder-vk-like")[0] || "";
			var vkLikeId = "vk-like";
			var vkLike = document[getElementById](vkLikeId) || "";
			var handleVKLikeButton = function (ev) {
				ev.stopPropagation();
				ev.preventDefault();
				var logic = function () {
					holder[classList].toggle(isActiveClass);
					holder[classList].add(isCollapsableClass);
					handleOtherSocialButtons(holder);
					var initScript = function () {
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
								throw new Error("cannot VK.init " + err);
							}
						}
					};
					var jsUrl = forcedHTTP + "://vk.com/js/api/openapi.js?154";
					if (!root.VK) {
						var load;
						load = new loadJsCss([jsUrl], initScript);
					} else {
						initScript();
					}
				};
				debounce(logic, 200).call(root);
			};
			if (btn && holder && vkLike) {
				if ("undefined" !== typeof getHTTP && getHTTP()) {
					btn[_addEventListener]("click", handleVKLikeButton);
				}
			}
		};
		manageVKLikeButton();

		var manageDebugGridButton = function () {
			var container = document[getElementById]("container") || "";
			var page = document[getElementById]("page") || "";
			var btn = document[getElementsByClassName]("btn-toggle-col-debug")[0] || "";
			var debugClass = "debug";
			var cookieKey = "_manageDebugGridButton_";
			var cookieDatum = "ok";
			var handleDebugGridButton = function (ev) {
				ev.stopPropagation();
				ev.preventDefault();
				container[classList].toggle(debugClass);
				var showDebugGridMessage = function () {
					var col = document[getElementsByClassName]("col")[0] || "";
					var elements = [docBody, page, container, col];
					var debugMessage = [];
					var renderElementsInfo = function (e) {
						if (e) {
							debugMessage.push((e.className ? "." + e.className : e.id ? "#" + e.id : e.tagName), " ", root.getComputedStyle(e).getPropertyValue("font-size"), " ", root.getComputedStyle(e).getPropertyValue("line-height"), " ", e.offsetWidth, "x", e.offsetHeight, " \u003e ");
						}
					};
					for (var i = 0, l = elements[_length]; i < l; i += 1) {
						renderElementsInfo(elements[i]);
					}
					/* forEach(elements, renderElementsInfo, false); */
					debugMessage = debugMessage.join("");
					debugMessage = debugMessage.slice(0, debugMessage.lastIndexOf(" \u003e "));
					notiBar({
						"message": debugMessage,
						"timeout": 5000,
						"key": cookieKey,
						"datum": cookieDatum,
						"days": 0
					});
				};
				var handleDebugGridContainer = function () {
					if (container) {
						container[classList].remove(debugClass);
						container[_removeEventListener]("click", handleDebugGridContainer);
					}
				};
				if (container[classList].contains(debugClass)) {
					container[_addEventListener]("click", handleDebugGridContainer);
					showDebugGridMessage();
				} else {
					container[_removeEventListener]("click", handleDebugGridContainer);
				}
			};
			if (page && container && btn) {
				var locationHref = root.location.href || "";
				if (locationHref && parseLink(locationHref).hasHTTP && (/^(localhost|127.0.0.1)/).test(parseLink(locationHref).hostname)) {
					btn[_addEventListener]("click", handleDebugGridButton);
				} else {
					btn[style].display = "none";
				}
			}
		};
		manageDebugGridButton();

		var initRouting = function () {
			var appContentId = "app-content";
			var appContent = document[getElementById](appContentId) || "";
			var appContentParent;
			if (appContent) {
				appContentParent = appContent[parentNode] || "";
			}
			/* var contentsSelectTemplate = document[getElementById]("template_contents_select") || "";
			var contentsSelectRender = document[getElementById]("render_contents_select") || ""; */
			var contentsSelect = document[getElementsByClassName]("contents-select")[0] || "";
			var holderContentsSelect = document[getElementsByClassName]("holder-contents-select")[0] || "";
			var contentsListClass = "contents-list";
			var searchTextInput = document[getElementById]("text") || "";
			var asideTemplateId = "template_aside";
			var asideRenderId = "render_aside";
			var commentsTemplateId = "template_comments";
			var commentsRenderId = "render_comments";
			var nextHrefTemplateId = "template_bottom_navigation";
			var nextHrefRenderId = "render_bottom_navigation";
			var contentsGridTemplateId = "template_contents_grid";
			var contentsGridRenderId = "render_contents_grid";
			var masonryGridClass = "masonry-grid";
			var routesJsonUrl = "./libs/pwa-englishextra/json/routes.json";
			var contentsListButtonDefaultText = contentsSelect ? (contentsSelect.options[0].firstChild.textContent || "") : "";
			var handleRoutesWindowIsBindedClass = "handle-routes-window--is-binded";
			var processRoutesJsonResponse = function (routesJsonResponse) {
				var routesJsonObj;
				try {
					routesJsonObj = JSON.parse(routesJsonResponse);
					if (!routesJsonObj.hashes) {
						throw new Error("incomplete JSON data: no hashes");
					} else if (!routesJsonObj.home) {
						throw new Error("incomplete JSON data: no home");
					} else {
						if (!routesJsonObj.notfound) {
							throw new Error("incomplete JSON data: no notfound");
						}
					}
				} catch (err) {
					console.log("cannot init processRoutesJsonResponse", err);
					return;
				}
				var renderMasonry;
				var renderComments;
				var triggerOnContentInserted = function (titleString, nextHrefString, asideObj, routesObj) {
					/* var h1 = contentsSelect || document[getElementById]("h1") || "";
					var h1Pos = findPos(h1).top || 0;
					if (h1) {
						scroll2Top(h1Pos, 20000);
					} else {
						scroll2Top(0, 20000);
					} */
					/* scroll2Top(0, 20000); */
					/* if (titleString) { */
					document[title] = (titleString ? titleString + " - " : "") + (initialDocumentTitle ? initialDocumentTitle + (userBrowsingDetails ? userBrowsingDetails : "") : "");
					/* } */
					var locationHash = root.location.hash || "";
					if (contentsSelect) {
						var optionMatched = false;
						for (var i = 0, l = contentsSelect.options[_length]; i < l; i += 1) {
							if (locationHash === contentsSelect.options[i].value) {
								optionMatched = true;
								contentsSelect.selectedIndex = i;
								break;
							}
						}
						/* for (var key in contentsSelect.options) {
							if (contentsSelect.options.hasOwnProperty(key)) {
								if (locationHash === contentsSelect.options[key].value) {
									optionMatched = true;
									contentsSelect.selectedIndex = key;
									break;
								}
							}
						} */
						if (!optionMatched) {
							contentsSelect.selectedIndex = 0;
						}
					}
					var contentsList = document[getElementsByClassName](contentsListClass)[0] || "";
					if (contentsList) {
						var contentsListButton = holderContentsSelect ? holderContentsSelect[getElementsByTagName]("a")[0] || "" : "";
						if (contentsListButton) {
							var itemMatched = false;
							var contentsListItems = contentsList ? contentsList[getElementsByTagName]("li") || "" : "";
							for (var j = 0, m = contentsListItems[_length]; j < m; j += 1) {
								if (locationHash === contentsListItems[j][dataset][href]) {
									itemMatched = true;
									contentsListButton.replaceChild(document[createTextNode](contentsListItems[j].firstChild.textContent), contentsListButton.firstChild);
									break;
								}
							}
							/* for (var key2 in contentsListItems) {
								if (contentsListItems.hasOwnProperty(key2)) {
									if (locationHash === contentsListItems[key2][dataset][href]) {
										itemMatched = true;
										contentsListButton.replaceChild(document[createTextNode](contentsListItems[key2].firstChild.textContent), contentsListButton.firstChild);
										break;
									}
								}
							} */
							if (!itemMatched) {
								contentsListButton.replaceChild(document[createTextNode](contentsListButtonDefaultText), contentsListButton.firstChild);
							}
						}
					}
					if (asideObj) {
						var asideTemplate = document[getElementById](asideTemplateId) || "";
						var asideRender = document[getElementById](asideRenderId) || "";
						var asideRenderParent = asideRender[parentNode] || "";
						if (asideTemplate && asideRender) {
							insertFromTemplate(asideObj, asideTemplateId, asideRenderId, function () {
								if (asideRenderParent) {
									manageExternalLinkAll(asideRenderParent);
									var timer = setTimeout(function () {
										clearTimeout(timer);
										timer = null;
										handleDataSrcImageAll();
									}, 500);
								}
							});
						}
					}
					if (nextHrefString) {
						var nextHrefTemplate = document[getElementById](nextHrefTemplateId) || "";
						var nextHrefRender = document[getElementById](nextHrefRenderId) || "";
						if (nextHrefTemplate && nextHrefRender) {
							insertFromTemplate({
								"next_href": nextHrefString
							}, nextHrefTemplateId, nextHrefRenderId);
						}
					}
					var commentsTemplate = document[getElementById](commentsTemplateId) || "";
					var commentsRender = document[getElementById](commentsRenderId) || "";
					var commentsRenderParent = commentsRender[parentNode] || "";
					if (commentsTemplate && commentsRender) {
						if (!renderComments) {
							renderComments = renderTemplate({}, commentsTemplateId, commentsRenderId);
						}
						insertTextAsFragment(renderComments, commentsRender, function () {
							if (commentsRenderParent) {
								manageDisqusButton(commentsRenderParent);
							}
						});
					}
					var masonryGrid = document[getElementsByClassName](masonryGridClass)[0] || "";
					var masonryGridParent = masonryGrid[parentNode] || "";
					if (masonryGrid && masonryGridParent) {
						var contentsGridTemplate = document[getElementById](contentsGridTemplateId) || "";
						var contentsGridRender = document[getElementById](contentsGridRenderId) || "";
						var contentsGridRenderParent = contentsGridRender[parentNode] || "";
						if (contentsGridTemplate && contentsGridRender) {
							if (!renderMasonry) {
								if (routesObj) {
									renderMasonry = renderTemplate(routesObj, contentsGridTemplateId, contentsGridRenderId);
								}
							}
							insertTextAsFragment(renderMasonry, contentsGridRender, function () {
								if (contentsGridRenderParent) {
									initMasonry(contentsGridRenderParent);
									manageExternalLinkAll(contentsGridRenderParent);
									var timer = setTimeout(function () {
										clearTimeout(timer);
										timer = null;
										handleDataSrcImageAll();
									}, 500);
								}
							});
						} else {
							initMasonry(masonryGridParent);
						}
					}
					/*!
					 * cache parent node beforehand
					 * put when templates rendered
					 */
					if (appContentParent) {
						var timer = setTimeout(function () {
								clearTimeout(timer);
								timer = null;
								handleDataSrcIframeAll();
								handleDataSrcImageAll();
								manageExternalLinkAll();
								manageImgLightboxLinkAll("img-lightbox-link");
								manageIframeLightboxLinkAll("iframe-lightbox-link");
								manageChaptersSelect(appContentParent);
								manageExpandingLayers(appContentParent);
							}, 100);
					}
					LoadingSpinner.hide(scroll2Top.bind(null, 0, 20000));
				};
				initKamilAutocomplete(routesJsonObj.hashes);
				var handleRoutesWindow = function () {
					if (searchTextInput) {
						searchTextInput.blur();
					}
					var locationHash = root.location.hash || "";
					if (locationHash) {
						var isFound = false;
						for (var i = 0, l = routesJsonObj.hashes[_length]; i < l; i += 1) {
							if (locationHash === routesJsonObj.hashes[i][href]) {
								isFound = true;
								LoadingSpinner.show();
								insertExternalHTML(appContentId, routesJsonObj.hashes[i].url, triggerOnContentInserted.bind(null, routesJsonObj.hashes[i][title], routesJsonObj.hashes[i].next_href, routesJsonObj.hashes[i].aside, routesJsonObj));
								break;
							}
						}
						/* for (var key in routesJsonObj.hashes) {
							if (routesJsonObj.hashes.hasOwnProperty(key)) {
								if (locationHash === routesJsonObj.hashes[key][href]) {
									isFound = true;
									LoadingSpinner.show();
									insertExternalHTML(appContentId, routesJsonObj.hashes[key].url, triggerOnContentInserted.bind(null, routesJsonObj.hashes[key][title], routesJsonObj.hashes[key].next_href, routesJsonObj.hashes[key].aside, routesJsonObj));
									break;
								}
							}
						} */
						if (false === isFound) {
							if (document[getElementById](locationHash.substring(1))) {
								root.location.hash = locationHash;
							} else {
								var notfoundUrl = routesJsonObj.notfound.url;
								var notfoundTitle = routesJsonObj.notfound[title];
								if (notfoundUrl /* && notfoundTitle */) {
									LoadingSpinner.show();
									insertExternalHTML(appContentId, notfoundUrl, triggerOnContentInserted.bind(null, notfoundTitle, null, null, routesJsonObj));
								}
							}
						}
					} else {
						var homeUrl = routesJsonObj.home.url;
						var homeTitle = routesJsonObj.home[title];
						if (homeUrl /* && homeTitle */) {
							LoadingSpinner.show();
							insertExternalHTML(appContentId, homeUrl, triggerOnContentInserted.bind(null, homeTitle, null, null, routesJsonObj));
						}
					}
				};
				handleRoutesWindow();
				if (!docElem[classList].contains(handleRoutesWindowIsBindedClass)) {
					docElem[classList].add(handleRoutesWindowIsBindedClass);
					root[_addEventListener]("hashchange", handleRoutesWindow);
				}
				/*!
				 * insertFromTemplate used in renderTemplate
				 * will remove event listener from select (parent) element,
				 * because it uses fragment method and not inner html
				 * (UPD now you can set last arg as true, and the event listener will work),
				 * so you will have to use inner html method
				 * alternative way to generate select options
				 * with document fragment
				 */
				/* if (contentsSelectTemplate && contentsSelectRender) {
					var contentsSelectHtml = contentsSelectTemplate[innerHTML] || "";
					var renderContentsSelectTemplate = new t(contentsSelectHtml);
					var contentsSelectRendered = renderContentsSelectTemplate.render(routesJsonObj);
					contentsSelectRender[innerHTML] = contentsSelectRendered;
				} */
				/* var rerenderContentsSelect = function () {
					var handleContentsSelect = function () {
						var _this = this;
						var hashString = _this.options[_this.selectedIndex].value || "";
						if (hashString) {
							var targetObj = isValidId(hashString, true) ? document[getElementById](hashString.replace(/^#/, "")) || "" : "";
							if (targetObj) {
								scroll2Top(findPos(targetObj).top, 10000);
							} else {
								if (hashString.startsWith("#", 0)) {
									root.location.hash = hashString;
								} else {
									root.location.href = hashString;
								}
							}
						}
					};
					var df = document[createDocumentFragment]();
					var generateContentsSelectOptions = function (e) {
						if (e[title]) {
							var contentsOption = document[createElement]("option");
							contentsOption.value = e[href];
							var contentsOptionText = e[title];
							contentsOption[title] = contentsOptionText;
							var contentsOptionTextTruncated = truncString("" + contentsOptionText, 44);
							contentsOption[appendChild](document[createTextNode](contentsOptionTextTruncated));
							df[appendChild](contentsOption);
							df[appendChild](document[createTextNode]("\n"));
						}
					};
					for (var i = 0, l = routesJsonObj.hashes[_length]; i < l; i += 1) {
						generateContentsSelectOptions(routesJsonObj.hashes[i]);
					}
					appendFragment(df, contentsSelectRender);
					contentsSelect[_addEventListener]("change", handleContentsSelect);
				}; */
				var rerenderContentsList = function () {
					var handleContentsListItem = function (listObj, hashString) {
						if (hashString) {
							var targetObj = isValidId(hashString, true) ? document[getElementById](hashString.replace(/^#/, "")) || "" : "";
							if (targetObj) {
								scroll2Top(findPos(targetObj).top, 10000);
							} else {
								if (hashString.startsWith("#", 0)) {
									root.location.hash = hashString;
								} else {
									root.location.href = hashString;
								}
							}
						}
						listObj[classList].remove(isActiveClass);
					};
					var contentsList = document[createElement]("ul");
					var contentsListButtonText = contentsSelect.options[0].textContent || "";
					var df = document[createDocumentFragment]();
					var generateContentsListItems = function (e) {
						if (e[title]) {
							var contentsListItem = document[createElement]("li");
							var contentsListItemHref = e[href];
							var contentsListItemText = e[title];
							contentsListItem[title] = contentsListItemText;
							contentsListItem[dataset][href] = contentsListItemHref;
							var contentsListItemTextTruncated = truncString("" + contentsListItemText, 44);
							contentsListItem[appendChild](document[createTextNode](contentsListItemTextTruncated));
							contentsListItem[_addEventListener]("click", handleContentsListItem.bind(null, contentsList, contentsListItemHref));
							df[appendChild](contentsListItem);
							df[appendChild](document[createTextNode]("\n"));
						}
					};
					for (var j = 0, m = routesJsonObj.hashes[_length]; j < m; j += 1) {
						generateContentsListItems(routesJsonObj.hashes[j]);
					}
					/* forEach(routesJsonObj.hashes, generateContentsListItems, false); */
					appendFragment(df, contentsList);
					contentsList[classList].add(contentsListClass);
					contentsList[classList].add(isDropdownClass);
					holderContentsSelect.replaceChild(contentsList, contentsSelect[parentNode][parentNode]);
					var contentsListButton = document[createElement]("a");
					contentsListButton[appendChild](document[createTextNode](contentsListButtonText));
					contentsList[parentNode].insertBefore(contentsListButton, contentsList);
					/* jshint -W107 */
					contentsListButton[href] = "javascript:void(0);";
					/* jshint +W107 */
					var insertChevronDownSmallSvg = function (targetObj) {
						var svg = document[createElementNS]("http://www.w3.org/2000/svg", "svg");
						var use = document[createElementNS]("http://www.w3.org/2000/svg", "use");
						svg[setAttribute]("class", "ui-icon");
						use[setAttributeNS]("http://www.w3.org/1999/xlink", "xlink:href", "#ui-icon-ChevronDownSmall");
						svg[appendChild](use);
						targetObj[appendChild](svg);
					};
					insertChevronDownSmallSvg(contentsListButton);
					var handleContentsListItemsButton = function (ev) {
						ev.stopPropagation();
						ev.preventDefault();
						contentsList[classList].toggle(isActiveClass);
						handleOtherDropdownLists(contentsList);
					};
					contentsListButton[_addEventListener]("click", handleContentsListItemsButton);
				};
				if (contentsSelect) {
					/* if (contentsSelectRender) {
						rerenderContentsSelect();
					} */
					if (holderContentsSelect) {
						rerenderContentsList();
					}
				}
			};
			if (appContent) {
				loadUnparsedJSON(routesJsonUrl, processRoutesJsonResponse);
			}
		};
		initRouting();

		/* var observeMutations = function (scope) {
			var ctx = scope && scope.nodeName ? scope : "";
			var mo;
			var getMutations = function (e) {
				var triggerOnMutation = function (m) {
					console.log("mutations observer: " + m.type);
					console.log(m.type, "target: " + m.target.tagName + ("." + m.target.className || "#" + m.target.id || ""));
					console.log(m.type, "added: " + m.addedNodes[_length] + " nodes");
					console.log(m.type, "removed: " + m.removedNodes[_length] + " nodes");
					if ("childList" === m.type || "subtree" === m.type) {
						mo.disconnect();
					}
				};
				var i,
				l;
				for (i = 0, l = e[_length]; i < l; i += 1) {
					triggerOnMutation(e[i]);
				}
				i = l = null;
			};
			if (ctx) {
				mo = new MutationObserver(getMutations);
				mo.observe(ctx, {
					childList: true,
					subtree: true,
					attributes: false,
					characterData: false
				});
			}
		}; */
		/*!
		 * apply changes to inserted DOM
		 * because replace child is used in the first place
		 * to insert new content, and if parent node doesnt exist
		 * inner html method is applied,
		 * the parent node should be observed, not the target
		 * node for the insertion
		 */
		/* var updateInsertedDom = function () {
			var getElementById = "getElementById";
			var parentNode = "parentNode";
			var ctx = document[getElementById]("app-content")[parentNode] || "";
			var locationHash = root.location.hash || "";
			if (ctx && locationHash) {
				console.log("triggered function: updateInsertedDom");
				observeMutations(ctx);
			}
		};
		root[_addEventListener]("hashchange", updateInsertedDom); */

		var initUiTotop = function () {
			var btnClass = "ui-totop";
			var btnTitle = "Наверх";
			var anchor = document[createElement]("a");
			var insertUpSvg = function (targetObj) {
				var svg = document[createElementNS]("http://www.w3.org/2000/svg", "svg");
				var use = document[createElementNS]("http://www.w3.org/2000/svg", "use");
				svg[setAttribute]("class", "ui-icon");
				use[setAttributeNS]("http://www.w3.org/1999/xlink", "xlink:href", "#ui-icon-Up");
				svg[appendChild](use);
				targetObj[appendChild](svg);
			};
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
			anchor.title = btnTitle;
			insertUpSvg(anchor);
			docBody[appendChild](anchor);
			if (docBody) {
				anchor[_addEventListener]("click", handleUiTotopAnchor);
				root[_addEventListener]("scroll", handleUiTotopWindow, {passive: true});
			}
		};
		initUiTotop();

		hideProgressBar();
	};

	/* var scripts = ["./libs/pwa-englishextra/css/bundle.min.css"]; */
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
		scripts.push("./cdn/polyfills/js/polyfills.fixed.min.js");
	}

	/* var scripts = ["./cdn/t.js/0.1.0/js/t.fixed.min.js",
		"./cdn/verge/1.9.1/js/verge.fixed.min.js",
		"./cdn/iframe-lightbox/0.1.6/js/iframe-lightbox.fixed.min.js",
		"./cdn/qrjs2/0.1.7/js/qrjs2.fixed.min.js",
		"./cdn/js-cookie/2.1.3/js/js.cookie.fixed.min.js",
		"./cdn/kamil/0.1.1/js/kamil.fixed.min.js",
		"./cdn/packery/2.1.1/js/packery.pkgd.fixed.min.js"]; */

	scripts.push("./libs/pwa-englishextra/js/vendors.min.js");

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

		/* if (supportsCanvas) {
			slot = setInterval(checkFontIsLoaded, 100);
		} else {
			slot = null;
			onFontsLoaded();
		} */
		onFontsLoaded();
	};

	loadCSS(
			/* forcedHTTP + "://fonts.googleapis.com/css?family=Roboto:300,400,400i,700,700i%7CRoboto+Mono:400,700&subset=cyrillic,latin-ext", */
			"./libs/pwa-englishextra/css/bundle.min.css",
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
			var i;
			for (i = 0; i < this.listeners[_length]; i++) {
				this.listeners[i]();
			}
			i = null;
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
