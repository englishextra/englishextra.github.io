/*jslint browser: true */
/*jslint node: true */
/*global doesFontExist, echo, Headers, loadJsCss, Minigrid, platform,
Promise, t, ToProgress, VK, WheelIndicator, Ya */
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
	var methods = ("assert,clear,count,debug,dir,dirxml,error,exception,group," +
		"groupCollapsed,groupEnd,info,log,markTimeline,profile,profiles,profileEnd," +
		"show,table,time,timeEnd,timeline,timelineEnd,timeStamp,trace,warn").split(",");
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
 * @see {@link http://github.com/djyde/ToProgress}
 * @see {@link https://github.com/djyde/ToProgress/blob/master/ToProgress.js}
 * passes jshint
 */
(function (root, document, undefined) {
	"use strict";
	var ToProgress = (function () {
		var TP = function () {
			var addEventListener = "addEventListener";
			var appendChild = "appendChild";
			var createElement = "createElement";
			var firstChild = "firstChild";
			var getElementById = "getElementById";
			var getElementsByClassName = "getElementsByClassName";
			var hasOwnProperty = "hasOwnProperty";
			var opacity = "opacity";
			var prototype = "prototype";
			var removeEventListener = "removeEventListener";
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
					duration: 0.2
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
					"-webkit-transition": "width " + this.options.duration + "s" + ", opacity " + this.options.opacityDuration + "s"
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
					this.progressBar[addEventListener](transitionEvent, function (e) {
						that.reset();
						that.progressBar[removeEventListener](e.type, TP);
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
	}
		());
	root.ToProgress = ToProgress;
}
	("undefined" !== typeof window ? window : this, document));
/*!
 * @license Minigrid v3.1.1 minimal cascading grid layout http://alves.im/minigrid
 * @see {@link https://github.com/henriquea/minigrid}
 */
(function(root, document) {
	"use strict";
	var getElementsByClassName = "getElementsByClassName";
	var getElementById = "getElementById";
	var length = "length";
	function extend(a, b) {
		for (var key in b) {
			if (b.hasOwnProperty(key)) {
				a[key] = b[key];
			}
		}
		return a;
	}
	var Minigrid = function(props) {
		var containerEle = props.container instanceof Node ?
			(props.container) :
			(document[getElementById](props.container) || document[getElementsByClassName](props.container)[0] || "");
		var itemsNodeList = props.item instanceof NodeList ?
			props.item :
			(containerEle[getElementsByClassName](props.item) || "");
		this.props = extend(props, {
			container: containerEle,
			nodeList: itemsNodeList
		});
	};
	Minigrid.prototype.mount = function() {
		if (!this.props.container) {
			return false;
		}
		if (!this.props.nodeList || this.props.nodeList[length] === 0) {
			return false;
		}
		var gutter = (typeof this.props.gutter === "number" && isFinite(this.props.gutter) && Math.floor(this.props.gutter) === this.props.gutter) ? this.props.gutter : 0;
		var done = this.props.done;
		var containerEle = this.props.container;
		var itemsNodeList = this.props.nodeList;
		containerEle.style.width = "";
		var forEach = Array.prototype.forEach;
		var containerWidth = containerEle.getBoundingClientRect().width;
		var firstChildWidth = itemsNodeList[0].getBoundingClientRect().width + gutter;
		var cols = Math.max(Math.floor((containerWidth - gutter) / firstChildWidth), 1);
		var count = 0;
		containerWidth = (firstChildWidth * cols + gutter) + "px";
		containerEle.style.width = containerWidth;
		containerEle.style.position = "relative";
		var itemsGutter = [];
		var itemsPosX = [];
		for (var g = 0; g < cols; ++g) {
			itemsPosX.push(g * firstChildWidth + gutter);
			itemsGutter.push(gutter);
		}
		if (this.props.rtl) {
			itemsPosX.reverse();
		}
		forEach.call(itemsNodeList, function(item) {
			var itemIndex = itemsGutter.slice(0).sort(function(a, b) {
				return a - b;
			}).shift();
			itemIndex = itemsGutter.indexOf(itemIndex);
			var posX = parseInt(itemsPosX[itemIndex]);
			var posY = parseInt(itemsGutter[itemIndex]);
			item.style.position = "absolute";
			item.style.webkitBackfaceVisibility = item.style.backfaceVisibility = "hidden";
			item.style.transformStyle = "preserve-3d";
			item.style.transform = "translate3D(" + posX + "px," + posY + "px, 0)";
			itemsGutter[itemIndex] += item.getBoundingClientRect().height + gutter;
			count = count + 1;
		});
		containerEle.style.display = "";
		var containerHeight = itemsGutter.slice(0).sort(function(a, b) {
			return a - b;
		}).pop();
		containerEle.style.height = containerHeight + "px";
		if (typeof done === "function") {
			done(itemsNodeList);
		}
	};
	root.Minigrid = Minigrid;
}
("undefined" !== typeof window ? window : this, document));
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
(function (root) {
	"use strict";
	var length = "length";
	var replace = "replace";
	var blockregex = /\{\{(([@!]?)(.+?))\}\}(([\s\S]+?)(\{\{:\1\}\}([\s\S]+?))?)\{\{\/\1\}\}/g;
	var valregex = /\{\{([=%])(.+?)\}\}/g;
	var t = function (template) {
		this.t = template;
	};
	function scrub(val) {
		return new Option(val).text[replace](/"/g, "&quot;");
	}
	function get_value(vars, key) {
		var parts = key.split(".");
		while (parts[length]) {
			if (!(parts[0]in vars)) {
				return false;
			}
			vars = vars[parts.shift()];
		}
		return vars;
	}
	function render(fragment, vars) {
		return fragment[replace](blockregex, function (_, __, meta, key, inner, if_true, has_else, if_false) {
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
		}).replace(valregex, function (_, meta, key) {
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
}
	("undefined" !== typeof window ? window : this));
/*!
 * modified Echo.js, simple JavaScript image lazy loading
 * added option to specify data attribute and img class
 * @see {@link https://toddmotto.com/echo-js-simple-javascript-image-lazy-loading/}
 * @see {@link https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md#feature-detection}
 * forced passive event listener if supported
 * passes jshint
 */
(function (root, document) {
	"use strict";
	var echo = function (imgClass, dataAttributeName, throttleRate) {
		var _imgClass = imgClass || "data-src-img";
		var _dataAttributeName = dataAttributeName || "src";
		var _throttleRate = throttleRate || 100;
		var addEventListener = "addEventListener";
		var classList = "classList";
		var dataset = "dataset";
		var defineProperty = "defineProperty";
		var documentElement = "documentElement";
		var getAttribute = "getAttribute";
		var getBoundingClientRect = "getBoundingClientRect";
		var getElementsByClassName = "getElementsByClassName";
		var length = "length";
		var Echo = function (elem) {
			var _this = this;
			_this.elem = elem;
			_this.render();
			_this.listen();
		};
		var isBindedEchoClass = "is-binded-echo";
		var isBindedEcho = (function () {
			return document[documentElement][classList].contains(isBindedEchoClass) || "";
		}
			());
		var echoStore = [];
		var scrolledIntoView = function (element) {
			var coords = element[getBoundingClientRect]();
			return ((coords.top >= 0 && coords.left >= 0 && coords.top) <= (root.innerHeight || document[documentElement].clientHeight));
		};
		var echoSrc = function (img, callback) {
			img.src = img[dataset][_dataAttributeName] || img[getAttribute]("data-" + _dataAttributeName);
			if (callback) {
				callback();
			}
		};
		var removeEcho = function (element, index) {
			if (echoStore.indexOf(element) !== -1) {
				echoStore.splice(index, 1);
			}
		};
		var echoImageAll = function () {
			for (var i = 0; i < echoStore[length]; i++) {
				var self = echoStore[i];
				if (scrolledIntoView(self)) {
					echoSrc(self, removeEcho(self, i));
				}
			}
		};
		var throttle = function (func, wait) {
			var ctx,
			args,
			rtn,
			timeoutID;
			var last = 0;
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
			function call() {
				timeoutID = 0;
				last = +new Date();
				rtn = func.apply(ctx, args);
				ctx = null;
				args = null;
			}
		};
		var throttleEchoImageAll = throttle(echoImageAll, _throttleRate);
		var supportsPassive = (function () {
				var support = false;
				try {
					var opts = Object[defineProperty] && Object[defineProperty]({}, "passive", {
							get: function () {
								support = true;
							}
						});
					root[addEventListener]("test", function () {}, opts);
				} catch (err) {}
				return support;
			}
				());
		Echo.prototype = {
			init: function () {
				echoStore.push(this.elem);
			},
			render: function () {
				echoImageAll();
			},
			listen: function () {
				if (!isBindedEcho) {
					root[addEventListener]("scroll", throttleEchoImageAll, supportsPassive ? {passive: true} : false);
					document[documentElement][classList].add(isBindedEchoClass);
				}
			}
		};
		var lazyImgs = document[getElementsByClassName](_imgClass) || "";
		var walkLazyImageAll = function () {
			for (var i = 0; i < lazyImgs[length]; i++) {
				new Echo(lazyImgs[i]).init();
			}
		};
		if (lazyImgs) {
			walkLazyImageAll();
		}
	};
	root.echo = echo;
}
	("undefined" !== typeof window ? window : this, document));
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
		var canvas = document.createElement("canvas");
		var context = canvas.getContext("2d");
		var text = "abcdefghijklmnopqrstuvwxyz0123456789";
		context.font = "72px monospace";
		var baselineSize = context.measureText(text).width;
		context.font = "72px '" + fontName + "', monospace";
		var newSize = context.measureText(text).width;
		canvas = null;
		if (newSize == baselineSize) {
			return false;
		} else {
			return true;
		}
	};
	root.doesFontExist = doesFontExist;
}
	("undefined" !== typeof window ? window : this, document));
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
		var length = "length";
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
				if (++i < _this.js[length]) {
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
		for (i = 0, l = _this.files[length]; i < l; i += 1) {
			if ((/\.js$|\.js\?/).test(_this.files[i])) {
				_this.js.push(_this.files[i]);
			}
			if ((/\.css$|\.css\?|\/css\?/).test(_this.files[i])) {
				_this.loadStyle(_this.files[i]);
			}
		}
		i = l = null;
		if (_this.js[length] > 0) {
			_this.loadScript(0);
		} else {
			_this.callback();
		}
	};
	root.loadJsCss = loadJsCss;
}
	("undefined" !== typeof window ? window : this, document));
/*!
 * app logic
 */
(function (root, document) {
	"use strict";

	var createElement = "createElement";
	var documentElement = "documentElement";
	var length = "length";

	var progressBar = new ToProgress({
			id: "top-progress-bar",
			color: "#FF2C40",
			height: "0.200rem",
			duration: 0.2
		});

	var hideProgressBar = function () {
		progressBar.finish();
		progressBar.hide();
	};

	progressBar.increase(20);

	var hasTouch = "ontouchstart" in document[documentElement] || "";

	var hasWheel = "onwheel" in document[createElement]("div") || void 0 !== document.onmousewheel || "";

	var getHTTP = function (force) {
		var any = force || "";
		var locationProtocol = root.location.protocol || "";
		return "http:" === locationProtocol ? "http" : "https:" === locationProtocol ? "https" : any ? "http" : "";
	};

	var run = function () {

		var addEventListener = "addEventListener";
		var appendChild = "appendChild";
		var body = "body";
		var classList = "classList";
		var createContextualFragment = "createContextualFragment";
		var createDocumentFragment = "createDocumentFragment";
		var dataset = "dataset";
		var getAttribute = "getAttribute";
		var getElementById = "getElementById";
		var getElementsByClassName = "getElementsByClassName";
		var getElementsByTagName = "getElementsByTagName";
		var href = "href";
		var innerHTML = "innerHTML";
		var parentNode = "parentNode";
		var style = "style";
		var styleSheets = "styleSheets";
		var title = "title";

		var docElem = document[documentElement] || "";
		if (docElem && docElem[classList]) {
			docElem[classList].remove("no-js");
			docElem[classList].add("js");
		}

		progressBar.increase(20);

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
					hasHTTP: /^(http|https):\/\//i.test(url) ? !0 : !1
				};
			}
				());
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
		}
			());

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

		var debounce = function (func, wait, immediate) {
			var timeout;
			var args;
			var context;
			var timestamp;
			var result;
			if (undefined === wait || null === wait) {
				wait = 100;
			}
			function later() {
				var last = Date.now() - timestamp;
				if (last < wait && last >= 0) {
					timeout = setTimeout(later, wait - last);
				} else {
					timeout = null;
					if (!immediate) {
						result = func.apply(context, args);
						context = args = null;
					}
				}
			}
			var debounced = function () {
				context = this;
				args = arguments;
				timestamp = Date.now();
				var callNow = immediate && !timeout;
				if (!timeout) {
					timeout = setTimeout(later, wait);
				}
				if (callNow) {
					result = func.apply(context, args);
					context = args = null;
				}
				return result;
			};
			debounced.clear = function () {
				if (timeout) {
					clearTimeout(timeout);
					timeout = null;
				}
			};
			debounced.flush = function () {
				if (timeout) {
					result = func.apply(context, args);
					context = args = null;
					clearTimeout(timeout);
					timeout = null;
				}
			};
			return debounced;
		};

		var isBindedClass = "is-binded";

		var manageExternalLinkAll = function (ctx) {
			var _ctx = ctx && ctx.nodeName ? ctx : "";
			var linkTag = "a";
			var externalLinks = _ctx ? _ctx[getElementsByTagName](linkTag) || "" : document[getElementsByTagName](linkTag) || "";
			var arrange = function (e) {
				var handleExternalLink = function (url, evt) {
					evt.stopPropagation();
					evt.preventDefault();
					var logic = openDeviceBrowser.bind(null, url);
					var debounceLogic = debounce(logic, 200);
					debounceLogic();
				};
				if (!e[classList].contains(isBindedClass) &&
						!e.target &&
						!e.rel) {
					var url = e[getAttribute]("href") || "";
					if (url &&
						parseLink(url).isCrossDomain &&
						parseLink(url).hasHTTP) {
						e.title = "" + (parseLink(url).hostname || "") + " откроется в новой вкладке";
						if ("undefined" !== typeof getHTTP && getHTTP()) {
							e.target = "_blank";
							e.rel = "noopener";
						} else {
							e[addEventListener]("click", handleExternalLink.bind(null, url));
						}
						e[classList].add(isBindedClass);
					}
				}
			};
			if (externalLinks) {
				var i;
				var l;
				for (i = 0, l = externalLinks.length; i < l; i += 1) {
					arrange(externalLinks[i]);
				}
				i = l = null;
			}
		};

		var wrapper = document[getElementsByClassName]("wrapper")[0] || "";

		manageExternalLinkAll(wrapper);

		var documentTitle = document[title] || "";

		var navigatorUserAgent = navigator.userAgent || "";

		var getHumanDate = function () {
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
		}
		();

		var platformName = "";
		var platformDescription = "";
		if (navigatorUserAgent && root.platform) {
			platformName = platform.name || "";
			platformDescription = platform.description || "";
			document[title] = documentTitle +
			" [" +
			(getHumanDate ? " " + getHumanDate : "") +
			(platformDescription ? " " + platformDescription : "") +
			((hasTouch || hasWheel) ? " with" : "") +
			(hasTouch ? " touch" : "") +
			((hasTouch && hasWheel) ? "," : "") +
			(hasWheel ? " mousewheel" : "") +
			"]";
		}

		var cardGridClass = "card-grid";
		var cardGrid = document[getElementsByClassName](cardGridClass)[0] || "";
		var imgClass = "data-src-img";
		var cardWrapClass = "card-wrap";
		var jsonHrefKeyName = "href";
		var jsonSrcKeyName = "src";
		var jsonTitleKeyName = "title";
		var jsonTextKeyName = "text";
		var jsonWidthKeyName = "width";
		var jsonHeightKeyName = "height";
		var jsonUrl = "./libs/contents-cards/json/contents.json";

		var safelyParseJSON = function (response) {
			var isJson = function (obj) {
				var objType = typeof obj;
				return ['boolean', 'number', "string", 'symbol', "function"].indexOf(objType) === -1;
			};
			if (!isJson(response)) {
				return JSON.parse(response);
			} else {
				return response;
			}
		};

		var renderTemplate = function (parsedJson, templateId, targetId) {
			var template = document[getElementById](templateId) || "";
			var target = document[getElementById](targetId) || "";
			var jsonObj = safelyParseJSON(parsedJson);
			if (jsonObj && template && target) {
				var targetHtml = template[innerHTML] || "",
				renderTargetTemplate = new t(targetHtml);
				return renderTargetTemplate.render(jsonObj);
			}
			return {};
		};

		var insertTextAsFragment = function (text, container, callback) {
			var body = document.body || "";
			var cb = function () {
				return callback && "function" === typeof callback && callback();
			};
			try {
				var clonedContainer = container.cloneNode(!1);
				if (document.createRange) {
					var rg = document.createRange();
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

		var countObjKeys = function (obj) {
			var count = 0;
			for (var prop in obj) {
				if (obj.hasOwnProperty(prop)) {
					++count;
				}
			}
			return count;
		};

		var generateCardGrid = function (text) {

			return new Promise(function (resolve, reject) {

				var jsonObj;

				try {
					jsonObj = JSON.parse(text);
					if (!jsonObj.pages[0][jsonHrefKeyName]) {
						throw new Error("incomplete JSON data: no " + jsonHrefKeyName);
					} else if (!jsonObj.pages[0][jsonSrcKeyName]) {
						throw new Error("incomplete JSON data: no " + jsonSrcKeyName);
					} else if (!jsonObj.pages[0][jsonWidthKeyName]) {
						throw new Error("incomplete JSON data: no " + jsonWidthKeyName);
					} else if (!jsonObj.pages[0][jsonHeightKeyName]) {
						throw new Error("incomplete JSON data: no " + jsonHeightKeyName);
					} else if (!jsonObj.pages[0][jsonTitleKeyName]) {
						throw new Error("incomplete JSON data: no " + jsonTitleKeyName);
					} else {
						if (!jsonObj.pages[0][jsonTextKeyName]) {
							throw new Error("incomplete JSON data: no " + jsonTextKeyName);
						}
					}
				} catch (err) {
					console.log("cannot init generateCardGrid", err);
					return;
				}

				/*!
				 * render with <template> and t.js
				 * the drawback you cannot know image sizes
				 * attention to last param: if false cloneNode will be used
				 * and setting listeners or changing its CSS will not be possible
				 */
				var pagesKeysNumber = countObjKeys(jsonObj.pages);
				insertFromTemplate(jsonObj, "template_card_grid", "target_card_grid", function () {
					if (pagesKeysNumber === document[getElementsByClassName](cardWrapClass)[length]) {
						resolve();
					} else {
						reject();
					}
				}, true);

				/*!
				 * render with creating DOM Nodes
				 */
				/* var alt = "alt";
				var createTextNode = "createTextNode";
				var dataset = "dataset";
				var hasOwnProperty = "hasOwnProperty";
				var href = "href";
				var src = "src";

				var cardClass = "card";
				var cardContentClass = "card-content";

				jsonObj = jsonObj.pages;

				var df = document[createDocumentFragment]();

				var key;
				for (key in jsonObj) {
					if (jsonObj[hasOwnProperty](key)) {
						if (jsonObj[key][jsonSrcKeyName] &&
							jsonObj[key][jsonHrefKeyName] &&
							jsonObj[key][jsonTitleKeyName] &&
							jsonObj[key][jsonTextKeyName]) {

							var cardWrap = document[createElement]("div");
							cardWrap[classList].add(cardWrapClass);

							var card = document[createElement]("div");
							card[classList].add(cardClass);

							cardWrap[appendChild](card);

							var img = document[createElement]("img");
							if (jsonObj[key][jsonWidthKeyName] && jsonObj[key][jsonHeightKeyName]) {
								img[src] = ["data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20viewBox%3D%270%200%20",
									jsonObj[key][jsonWidthKeyName],
									"%20",
									jsonObj[key][jsonHeightKeyName],
									"%27%2F%3E"].join("");
							} else {
								var dummyImg = new Image();
								dummyImg[src] = jsonObj[key][jsonSrcKeyName];
								var dummyImgWidth = dummyImg.naturalWidth;
								var dummyImgHeight = dummyImg.naturalHeight;
								if (dummyImgWidth && dummyImgHeight) {
									img[src] = ["data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20viewBox%3D%270%200%20", dummyImgWidth, "%20", dummyImgHeight, "%27%2F%3E"].join("");
								} else {
									img[src] = ["data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20viewBox%3D%270%200%20", 640, "%20", 360, "%27%2F%3E"].join("");
								}
							}
							img[dataset][jsonSrcKeyName] = jsonObj[key][jsonSrcKeyName];
							img[classList].add(imgClass);
							img[alt] = "";

							card[appendChild](img);

							var cardContent = document[createElement]("div");
							cardContent[classList].add(cardContentClass);

							var heading2 = document[createElement]("h2");
							heading2[appendChild](document[createTextNode](jsonObj[key][jsonTitleKeyName]));

							cardContent[appendChild](heading2);

							var paragraph = document[createElement]("p");
							paragraph[appendChild](document[createTextNode](jsonObj[key][jsonTextKeyName]));

							cardContent[appendChild](paragraph);

							card[appendChild](cardContent);

							var cardLink = document[createElement]("a");
							cardLink[href] = ["", jsonObj[key][jsonHrefKeyName]].join("");
							cardLink[appendChild](card);

							cardWrap[appendChild](cardLink);

							df[appendChild](cardWrap);
							df[appendChild](document[createTextNode]("\n"));
						}
					}
				}
				key = null;

				if (cardGrid[appendChild](df)) {
					resolve();
				} else {
					reject();
				} */
			});
		};

		var timerCreateGrid;
		var createGrid = function () {
			clearTimeout(timerCreateGrid);
			timerCreateGrid = null;

			var onMinigridCreated = function () {
				cardGrid[style].visibility = "visible";
				cardGrid[style].opacity = 1;
			};
			var mgrid;
			var initMinigrid = function () {
				mgrid = new Minigrid({
						container: cardGridClass,
						item: cardWrapClass,
						gutter: 20,
						done: onMinigridCreated
					});
				mgrid.mount();
			};
			var updateMinigrid = function () {
				mgrid.mount();
			};
			initMinigrid();
			root[addEventListener]("resize", updateMinigrid, {passive: true});

			var toDashedAll = function (str) {
				return str.replace((/([A-Z])/g), function ($1) {
					return "-" + $1.toLowerCase();
				});
			};
			var docElemStyle = document[documentElement][style];
			var transitionProperty = typeof docElemStyle.transition == "string" ?
				"transition" : "WebkitTransition";
			var transformProperty = typeof docElemStyle.transform == "string" ?
				"transform" : "WebkitTransform";
			var styleSheet = document[styleSheets][0] || "";
			if (styleSheet) {
				var cssRule = toDashedAll([".",
							cardWrapClass,
							"{",
							transitionProperty,
							": ",
							transformProperty,
							" 0.4s ease-out;",
							"}"].join(""));
				styleSheet.insertRule(cssRule, 0);
			}
		};

		var timerSetLazyloading;
		var setLazyloading = function () {
			clearTimeout(timerSetLazyloading);
			timerSetLazyloading = null;

			echo(imgClass, jsonSrcKeyName);
		};

		var myHeaders = new Headers();

		fetch(jsonUrl, {
			headers: myHeaders,
			credentials: "same-origin"
		}).then(function (response) {
			if (response.ok) {
				return response.text();
			} else {
				throw new Error("cannot fetch", jsonUrl);
			}
		}).then(function (text) {
			generateCardGrid(text).then(function (result) {
				return result;
			}).then(function (result) {
				timerCreateGrid = setTimeout(createGrid, 200);
			}).then(function (result) {
				timerSetLazyloading = setTimeout(setLazyloading, 200);
			}).catch (function (err) {
				console.log("Cannot create card grid", err);
			});
		}).catch (function (err) {
			console.log("cannot parse", jsonUrl);
		});

		var locationHref = root.location[href] || "";

		var scriptIsLoaded = function (scriptSrc) {
			var scriptAll,
			i,
			l;
			for (scriptAll = document[getElementsByTagName]("script") || "", i = 0, l = scriptAll[length]; i < l; i += 1) {
				if (scriptAll[i][getAttribute]("src") === scriptSrc) {
					scriptAll = i = l = null;
					return true;
				}
			}
			scriptAll = i = l = null;
			return false;
		};

		var isActiveClass = "is-active";

		var hideOtherIsSocial = function (thisObj) {
			var _thisObj = thisObj || this;
			var isSocialAll = document[getElementsByClassName]("is-social") || "";
			if (isSocialAll) {
				var k,
				n;
				for (k = 0, n = isSocialAll[length]; k < n; k += 1) {
					if (_thisObj !== isSocialAll[k]) {
						isSocialAll[k][classList].remove(isActiveClass);
					}
				}
				k = n = null;
			}
		};

		root[addEventListener]("click", hideOtherIsSocial);

		var yaShare2Id = "ya-share2";

		var yaShare2 = document[getElementById](yaShare2Id) || "";

		var btnShare = document[getElementsByClassName]("btn-share")[0] || "";
		var btnShareLink = btnShare ? btnShare[getElementsByTagName]("a")[0] || "" : "";
		var yshare;
		var showYaShare2 = function (ev) {
			ev.preventDefault();
			ev.stopPropagation();
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
							console.log("cannot update or init Ya", err);
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

		if (btnShare && btnShareLink && yaShare2) {
			btnShareLink[addEventListener]("click", showYaShare2);
		}

		var vkLikeClass = "vk-like";
		var vkLike = document[getElementsByClassName](vkLikeClass)[0] || "";

		var holderVkLikeClass = "holder-vk-like";
		var holderVkLike = document[getElementsByClassName](holderVkLikeClass)[0] || "";

		var btnLike = document[getElementsByClassName]("btn-like")[0] || "";
		var btnLikeLink = btnLike ? btnLike[getElementsByTagName]("a")[0] || "" : "";
		var vkLikeId = "vk-like";

		var vlike;
		var showVkLike = function (ev) {
			ev.preventDefault();
			ev.stopPropagation();
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
								console.log("cannot init VK", err);
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

		if (btnLike && btnLikeLink && vkLike) {
			btnLikeLink[addEventListener]("click", showVkLike);
		}

		var throttle = function (func, wait) {
			var ctx;
			var args;
			var rtn;
			var timeoutID;
			var last = 0;
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
			function call() {
				timeoutID = 0;
				last = +new Date();
				rtn = func.apply(ctx, args);
				ctx = null;
				args = null;
			}
		};

		var titleBar = document[getElementsByClassName]("title-bar")[0] || "";
		var titleBarHeight = titleBar.offsetHeight || 0;
		var isFixedClass = "is-fixed";

		/*!
		 * set fixed on scroll/swipedependong on titleBar position
		 */
		/* var handleTitleBar = function () {
			var logic = function () {
				if ((document[body].scrollTop || document[documentElement].scrollTop || 0) > titleBarHeight) {
					titleBar[classList].add(isFixedClass);
				} else {
					titleBar[classList].remove(isFixedClass);
				}
			};
			var throttleLogic = throttle(logic, 100);
			throttleLogic();
		};
		if (titleBar) {
			root[addEventListener]("scroll", handleTitleBar, {passive: true});
		} */

		/*!
		 * set fixed depending on scroll/swipe direction
		 * and titleBar position
		 * needs animate.css classes
		 */
		/* var animatedClass = "animated";
		var duration4msClass = "duration-4ms";
		var slideInDownClass = "slideInDown";
		var slideOutUpClass = "slideOutUp";

		var hideTitleBar = function () {
			var logic = function () {
				titleBar[classList].remove(slideInDownClass);
				if ((document[body].scrollTop || document[documentElement].scrollTop || 0) > titleBarHeight) {
					titleBar[classList].add(slideOutUpClass);
				} else {
					titleBar[classList].remove(isFixedClass);
					titleBar[classList].remove(slideOutUpClass);
				}
			};
			var throttleLogic = throttle(logic, 100);
			throttleLogic();
		};
		var revealTitleBar = function () {
			var logic = function () {
				titleBar[classList].remove(slideOutUpClass);
				if ((document[body].scrollTop || document[documentElement].scrollTop || 0) > titleBarHeight) {
					titleBar[classList].add(isFixedClass);
					titleBar[classList].add(slideInDownClass);
				} else {
					titleBar[classList].remove(isFixedClass);
					titleBar[classList].remove(slideInDownClass);
				}
			};
			var throttleLogic = throttle(logic, 100);
			throttleLogic();
		};
		if (wrapper && titleBar) {
			titleBar[classList].add(animatedClass);
			titleBar[classList].add(duration4msClass);
			if (hasTouch) {
				if (root.tocca) {
					root[addEventListener]("swipeup", hideTitleBar, {passive: true});
					root[addEventListener]("swipedown", revealTitleBar, {passive: true});
				}
			} else {
				if (hasWheel) {
					if (root.WheelIndicator) {
						var indicator;
						indicator = new WheelIndicator({
								elem: wrapper,
								callback: function (e) {
									if ("down" === e.direction) {
										hideTitleBar();
									}
									if ("up" === e.direction) {
										revealTitleBar();
									}
								},
								preventMouse: false
							});
					}
				}
			}
		} */

		/*!
		 * set fixed or hidden class depending on scroll/swipe direction
		 * and titleBar position
		 * needs transition top 0.4s ease out in CSS for .title-bar
		 */
		var isHiddenClass = "is-hidden";

		var hideTitleBar = function () {
			var logic = function () {
				if ((document[body].scrollTop || document[documentElement].scrollTop || 0) > titleBarHeight) {
					titleBar[classList].add(isHiddenClass);
				} else {
					titleBar[classList].remove(isFixedClass);
					titleBar[classList].remove(isHiddenClass);
				}
			};
			var throttleLogic = throttle(logic, 100);
			throttleLogic();
		};
		var revealTitleBar = function () {
			var logic = function () {
				titleBar[classList].remove(isHiddenClass);
				if ((document[body].scrollTop || document[documentElement].scrollTop || 0) > titleBarHeight) {
					titleBar[classList].add(isFixedClass);
				} else {
					titleBar[classList].remove(isFixedClass);
				}
			};
			var throttleLogic = throttle(logic, 100);
			throttleLogic();
		};
		if (wrapper && titleBar) {
			if (hasTouch) {
				if (root.tocca) {
					root[addEventListener]("swipeup", hideTitleBar, {
						passive: true
					});
					root[addEventListener]("swipedown", revealTitleBar, {
						passive: true
					});
				}
			} else {
				if (hasWheel) {
					if (root.WheelIndicator) {
						var indicator;
						indicator = new WheelIndicator({
								elem: wrapper,
								callback: function (e) {
									if ("down" === e.direction) {
										hideTitleBar();
									}
									if ("up" === e.direction) {
										revealTitleBar();
									}
								},
								preventMouse: false
							});
					}
				}
			}
		}

		var scroll2Top = function (scrollTargetY, speed, easing) {
			var scrollY = root.scrollY || document.documentElement.scrollTop;
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

		var docBody = document[body] || "";
		var btnClass = "btn-totop";
		var btnTotop = document[getElementsByClassName](btnClass)[0] || "";
		var handleBtnTotop = function (evt) {
			evt.stopPropagation();
			evt.preventDefault();
			scroll2Top(0, 20000);
			if (titleBar) {
				titleBar[classList].remove(isHiddenClass);
			}
		};
		var handleBtnTotopWindow = function (_this) {
			var logic = function () {
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
			var throttleLogic = throttle(logic, 100);
			throttleLogic();
		};
		if (btnTotop) {
			btnTotop[addEventListener]("click", handleBtnTotop);
			root[addEventListener]("scroll", handleBtnTotopWindow, {passive: true});
		}

		hideProgressBar();
	};

	var defineProperty = "defineProperty";

	var scripts = ["./libs/contents-cards/css/bundle.min.css"];

	var forcedHTTP = getHTTP(true);

	var supportsClassList = "classList" in document[createElement]("_") || "";

	if (!supportsClassList) {
		scripts.push(forcedHTTP + "://cdn.jsdelivr.net/npm/classlist.js@1.1.20150312/classList.min.js");
	}

	var supportsDataset = "undefined" !== typeof root.Element && "dataset" in document[documentElement] || "";

	if (!supportsDataset) {
		scripts.push(forcedHTTP + "://cdn.jsdelivr.net/npm/element-dataset@2.2.6/lib/browser/index.cjs.min.js");
	}

	var supportsPassive = (function () {
		var support = false;
		try {
			var opts = Object[defineProperty] && Object[defineProperty]({}, "passive", {
					get: function () {
						support = true;
					}
				});
			root[addEventListener]("test", function () {}, opts);
		} catch (err) {}
		return support;

	}
		());

	if (!supportsPassive) {
		scripts.push(forcedHTTP + "://cdn.jsdelivr.net/npm/dom4@1.8.5/build/dom4.max.min.js");
	}

	if (!root.Promise) {
		scripts.push(forcedHTTP + "://cdn.jsdelivr.net/es6-promise-polyfill/1.2.0/promise.min.js");
	}

	if (!root.fetch) {
		scripts.push(forcedHTTP + "://cdn.jsdelivr.net/fetch/2.0.1/fetch.min.js");
	}

	scripts.push(forcedHTTP + "://cdn.jsdelivr.net/npm/platform@1.3.4/platform.min.js");

	if (hasTouch) {
		scripts.push(forcedHTTP + "://cdnjs.cloudflare.com/ajax/libs/Tocca.js/2.0.1/Tocca.min.js");
	} else {
		if (hasWheel) {
			scripts.push("./cdn/wheel-indicator/1.1.4/js/wheel-indicator.fixed.min.js");
		}
	}

	/*!
	 * load scripts after webfonts loaded using doesFontExist
	 */

	var onFontsLoadedCallback = function () {

		var slot;
		var onFontsLoaded = function () {
			clearInterval(slot);
			slot = null;

			progressBar.increase(20);

			var load;
			load = new loadJsCss(scripts, run);
		};

		var supportsCanvas = (function () {
			var elem = document[createElement]("canvas");
			return !!(elem.getContext && elem.getContext("2d"));
		}
			());

		var checkFontIsLoaded = function () {
			if (doesFontExist("Roboto")) {
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

	var load;
	load = new loadJsCss(
			[forcedHTTP + "://fonts.googleapis.com/css?family=Roboto:400,700&subset=cyrillic"],
			onFontsLoadedCallback
		);

	/*!
	 * load scripts after webfonts loaded using webfontloader
	 */

	/* root.WebFontConfig = {
		google: {
			families: [
				"Roboto:400,700:cyrillic"
			]
		},
		listeners: [],
		active: function () {
			this.called_ready = true;
			for (var i = 0; i < this.listeners[length]; i++) {
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
}
	("undefined" !== typeof window ? window : this, document));
