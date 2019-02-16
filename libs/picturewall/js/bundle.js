/*jslint browser: true */
/*jslint node: true */
/*global ActiveXObject, doesFontExist, LazyLoad, loadJsCss, addListener,
 getByClass, addClass, hasClass, removeClass, toggleClass, Zoomwall, Mustache,
 platform, Promise, t, ToProgress, VK, WheelIndicator, Ya*/
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
 * Super-simple wrapper around addEventListener and attachEvent (old IE).
 * Does not handle differences in the Event-objects.
 * @see {@link https://github.com/finn-no/eventlistener}
 */
(function (root) {
	"use strict";
	var wrap = function (standard, fallback) {
		return function (el, type, listener, useCapture) {
			if (el[standard]) {
				el[standard](type, listener, useCapture);
			} else {
				if (el[fallback]) {
					el[fallback]("on" + type, listener);
				}
			}
		};
	};
	root.addListener = wrap("addEventListener", "attachEvent");
	root.removeListener = wrap("removeEventListener", "detachEvent");
})("undefined" !== typeof window ? window : this);
/*!
 * get elements by class name wrapper
 */
(function (root, document) {
	"use strict";
	var getByClass = function (parent, name) {
		if (!document.getElementsByClassName) {
			var children = (parent || document.body).getElementsByTagName("*"),
			elements = [],
			classRE = new RegExp("\\b" + name + "\\b"),
			child;
			var i,
			l;
			for (i = 0, l = children.length; i < l; i += 1) {
				child = children[i];
				if (classRE.test(child.className)) {
					elements.push(child);
				}
			}
			i = l = null;
			return elements;
		} else {
			return parent ? parent.getElementsByClassName(name) : "";
		}
	};
	root.getByClass = getByClass;
})("undefined" !== typeof window ? window : this, document);
/*!
 * class list wrapper
 */
(function (root, document) {
	"use strict";
	var classList = "classList";
	var hasClass;
	var addClass;
	var removeClass;
	if (classList in document.documentElement) {
		hasClass = function (el, name) {
			return el[classList].contains(name);
		};
		addClass = function (el, name) {
			el[classList].add(name);
		};
		removeClass = function (el, name) {
			el[classList].remove(name);
		};
	} else {
		hasClass = function (el, name) {
			return new RegExp("\\b" + name + "\\b").test(el.className);
		};
		addClass = function (el, name) {
			if (!hasClass(el, name)) {
				el.className += " " + name;
			}
		};
		removeClass = function (el, name) {
			el.className = el.className.replace(new RegExp("\\b" + name + "\\b", "g"), "");
		};
	}
	var toggleClass = function (el, name) {
		if (hasClass(el, name)) {
			removeClass(el, name);
		} else {
			addClass(el, name);
		}
	};
	root.hasClass = hasClass;
	root.addClass = addClass;
	root.removeClass = removeClass;
	root.toggleClass = toggleClass;
})("undefined" !== typeof window ? window : this, document);
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
				el = document.createElement("fakeelement");
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
				t = null;
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
					var key;
					for (key in opt) {
						if (opt[hasOwnProperty](key)) {
							this.options[key] = opt[key];
						}
					}
					key = null;
				}
				this.options.opacityDuration = this.options.duration * 3;
				this.progressBar = document.createElement("div");
				this.progressBar.id = this.options.id;
				this.progressBar.setCSS = function (style) {
					var property;
					for (property in style) {
						if (style[hasOwnProperty](property)) {
							this.style[property] = style[property];
						}
					}
					property = null;
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
		var getContext = "getContext";
		var measureText = "measureText";
		var width = "width";
		var canvas = document.createElement("canvas");
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
 * modified loadExt
 * @see {@link https://gist.github.com/englishextra/ff9dc7ab002312568742861cb80865c9}
 * passes jshint
 */
(function (root, document) {
	"use strict";
	var loadJsCss = function (files, callback, type) {
		var _this = this;
		var appendChild = "appendChild";
		var body = "body";
		var getElementsByTagName = "getElementsByTagName";
		var setAttribute = "setAttribute";
		var _length = "length";
		_this.files = files;
		_this.js = [];
		_this.head = document[getElementsByTagName]("head")[0] || "";
		_this.body = document[body] || "";
		_this.ref = document[getElementsByTagName]("script")[0] || "";
		_this.callback = callback || function () {};
		_this.type = type ? type.toLowerCase() : "";
		_this.loadStyle = function (file) {
			var link = document.createElement("link");
			link.rel = "stylesheet";
			link.type = "text/css";
			link.href = file;
			link.media = "only x";
			link.onload = function () {
				this.onload = null;
				this.media = "all";
			};
			link[setAttribute]("property", "stylesheet");
			/* _this.head[appendChild](link); */
			(_this.body || _this.head)[appendChild](link);
		};
		_this.loadScript = function (i) {
			var script = document.createElement("script");
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
			/* if (_this.ref[parentNode]) {
				_this.ref[parentNode][insertBefore](script, _this.ref);
			} else {
				(_this.body || _this.head)[appendChild](script);
			} */
			(_this.body || _this.head)[appendChild](script);
		};
		var i,
		l;
		for (i = 0, l = _this.files[_length]; i < l; i += 1) {
			if ((/\.js$|\.js\?/).test(_this.files[i]) || _this.type === "js") {
				_this.js.push(_this.files[i]);
			}
			if ((/\.css$|\.css\?|\/css\?/).test(_this.files[i]) || _this.type === "css") {
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
	var docBody = document.body || "";

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

	progressBar.increase(20);

	var toStringFn = {}.toString;
	var supportsSvgSmilAnimation = !!document.createElementNS &&
		(/SVGAnimate/).test(toStringFn.call(document.createElementNS("http://www.w3.org/2000/svg", "animate"))) || "";

	if (supportsSvgSmilAnimation && docElem) {
		addClass(docElem, "svganimate");
	}

	var hasTouch = "ontouchstart" in docElem || "";

	var hasWheel = "onwheel" in document.createElement("div") || void 0 !== document.onmousewheel || "";

	var getHTTP = function (force) {
		var any = force || "";
		var locProtocol = root.location.protocol || "";
		return "http:" === locProtocol ? "http" : "https:" === locProtocol ? "https" : any ? "http" : "";
	};

	var forcedHTTP = getHTTP(true);

	var supportsCanvas;
	supportsCanvas = (function () {
		var elem = document.createElement("canvas");
		return !!(elem.getContext && elem.getContext("2d"));
	})();

	var run = function () {

		var appendChild = "appendChild";
		var body = "body";
		var cloneNode = "cloneNode";
		var createContextualFragment = "createContextualFragment";
		var createDocumentFragment = "createDocumentFragment";
		var createRange = "createRange";
		var dataset = "dataset";
		var getAttribute = "getAttribute";
		var getElementById = "getElementById";
		var getElementsByTagName = "getElementsByTagName";
		var innerHTML = "innerHTML";
		var parentNode = "parentNode";
		var querySelectorAll = "querySelectorAll";
		var style = "style";
		var title = "title";

		var isActiveClass = "is-active";
		var isFixedClass = "is-fixed";
		var isHiddenClass = "is-hidden";
		var isSocialClass = "is-social";

		var docTitle = document[title] || "";
		var navUA = navigator.userAgent || "";

		progressBar.increase(20);

		if (docElem && docElem.classList) {
			removeClass(docElem, "no-js");
			addClass(docElem, "js");
		}

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

		var brName = "";
		var brDescription = "";
		if (root.platform && navUA) {
			brName = platform.name || "";
			brDescription = platform.description || "";
			document[title] = docTitle +
			" [" +
			(getHumanDate ? " " + getHumanDate : "") +
			(brDescription ? " " + brDescription : "") +
			((hasTouch || hasWheel) ? " with" : "") +
			(hasTouch ? " touch" : "") +
			((hasTouch && hasWheel) ? "," : "") +
			(hasWheel ? " mousewheel" : "") +
			"]";
		}

		var loadUnparsedJSON = function (url, callback, onerror) {
			var cb = function (string) {
				return callback && "function" === typeof callback && callback(string);
			};
			var x = root.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
			x.overrideMimeType("application/json;charset=utf-8");
			x.open("GET", url, true);
			x.withCredentials = false;
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

		var setStyleDisplayNone = function (a) {
			if (a) {
				a[style].display = "none";
			}
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

		var countObjKeys = function (obj) {
			var count = 0;
			var prop;
			for (prop in obj) {
				if (obj.hasOwnProperty(prop)) {
					++count;
				}
			}
			prop = null;
			return count;
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

		var observeMutations = function (scope) {
			var context = scope && scope.nodeName ? scope : "";
			var mo;
			var getMutations = function (e) {
				var onMutation = function (m) {
					console.log("mutations observer: " + m.type);
					console.log(m.type, "target: " + m.target.tagName + ("." + m.target.className || "#" + m.target.id || ""));
					console.log(m.type, "added: " + m.addedNodes[_length] + " nodes");
					console.log(m.type, "removed: " + m.removedNodes[_length] + " nodes");
					if ("childList" === m.type || "subtree" === m.type) {
						mo.disconnect();
						hideProgressBar();
					}
				};
				var i,
				l;
				for (i = 0, l = e[_length]; i < l; i += 1) {
					onMutation(e[i]);
				}
				i = l = null;
			};
			if (context) {
				mo = new MutationObserver(getMutations);
				mo.observe(context, {
					childList: true,
					subtree: true,
					attributes: false,
					characterData: false
				});
			}
		};

		var anyResizeEventIsBindedClass = "any-resize-event--is-binded";

		var zoomwallClass = "zoomwall";

		var zoomwallIsActiveClass = "zoomwall--is-active";

		var zoomwallItemClass = "zoomwall__item";

		var zoomwallItemIsBindedClass = "zoomwall__item--is-binded";

		var zoomwall = getByClass(document, zoomwallClass)[0] || "";

		observeMutations(zoomwall);

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
					var o = _locationHref.protocol +
						"//" +
						_locationHref.hostname +
						(_locationHref.port ? ":" + _locationHref.port : "");
					return o || "";
				};
				var _isCrossDomain = function () {
					var c = document.createElement("a");
					c.href = url;
					var v = c.protocol + "//" + c.hostname + (c.port ? ":" + c.port : "");
					return v !== _origin();
				};
				var _link = document.createElement("a");
				_link.href = url;
				return {
					href: _link.href,
					origin: _origin(),
					host: _link.host || _location.host,
					port: ("0" === _link.port || "" === _link.port) ?
						_protocol(_link.protocol) :
						(_full ? _link.port : _replace(_link.port)),
					hash: _full ? _link.hash : _replace(_link.hash),
					hostname: _link.hostname || _location.hostname,
					pathname: _link.pathname.charAt(0) !== "/" ?
						(_full ? "/" + _link.pathname : _link.pathname) :
						(_full ? _link.pathname : _link.pathname.slice(1)),
					protocol: !_link.protocol ||
						":" === _link.protocol ?
						(_full ? _location.protocol : _replace(_location.protocol)) :
						(_full ? _link.protocol : _replace(_link.protocol)),
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
		var isElectron = (function () {
			if (typeof root !== "undefined" &&
				typeof root.process === "object" &&
				root.process.type === "renderer") {
				return true;
			}
			if (typeof root !== "undefined" &&
				typeof root.process !== "undefined" &&
				typeof root.process.versions === "object" &&
				!!root.process.versions.electron) {
				return true;
			}
			if (typeof navigator === "object" &&
				typeof navigator.userAgent === "string" &&
				navigator.userAgent.indexOf("Electron") >= 0) {
				return true;
			}
			return false;
		})();
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
			var onElectron = function () {
				var es = isElectron ? require("electron").shell : "";
				return es ? es.openExternal(url) : "";
			};
			var onNwjs = function () {
				var ns = isNwjs ? require("nw.gui").Shell : "";
				return ns ? ns.openExternal(url) : "";
			};
			var onLocal = function () {
				return root.open(url, "_system", "scrollbars=1,location=no");
			};
			if (isElectron) {
				onElectron();
			} else if (isNwjs) {
				onNwjs();
			} else {
				var locProtocol = root.location.protocol || "",
				hasHTTP = locProtocol ? "http:" === locProtocol ? "http" : "https:" === locProtocol ? "https" : "" : "";
				if (hasHTTP) {
					return true;
				} else {
					onLocal();
				}
			}
		};

		var manageExternalLinkAll = function () {
			var link = document[getElementsByTagName]("a") || "";
			var handle = function (url, ev) {
				ev.stopPropagation();
				ev.preventDefault();
				var logic = function () {
					openDeviceBrowser(url);
				};
				debounce(logic, 200).call(root);
			};
			var arrange = function (e) {
				var externalLinkIsBindedClass = "external-link--is-binded";
				if (!hasClass(e, externalLinkIsBindedClass)) {
					var url = e[getAttribute]("href") || "";
					if (url && parseLink(url).isCrossDomain && parseLink(url).hasHTTP) {
						e.title = "" + (parseLink(url).hostname || "") + " откроется в новой вкладке";
						if ("undefined" !== typeof getHTTP && getHTTP()) {
							e.target = "_blank";
							e.rel = "noopener";
						} else {
							addListener(e, "click", handle.bind(null, url));
						}
						addClass(e, externalLinkIsBindedClass);
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

		var dataSrcImgClass = "data-src-img";

		var dataSrcImgIsBindedClass = "data-src-img--is-binded";

		root.lazyLoadDataSrcImgInstance = null;

		/*!
		 * @see {@link https://github.com/verlok/lazyload}
		 */
		var manageDataSrcImgAll = function (callback) {
			var cb = function () {
				return callback && "function" === typeof callback && callback();
			};
			var images = getByClass(document, dataSrcImgClass) || "";
			var i = images[_length];
			while (i--) {
				if (!hasClass(images[i], dataSrcImgIsBindedClass)) {
					addClass(images[i], dataSrcImgIsBindedClass);
					addClass(images[i], isActiveClass);
					addListener(images[i], "load", cb);
				}
			}
			i = null;
			if (root.LazyLoad) {
				if (root.lazyLoadDataSrcImgInstance) {
					root.lazyLoadDataSrcImgInstance.destroy();
				}
				root.lazyLoadDataSrcImgInstance = new LazyLoad({
						elements_selector: "." + dataSrcImgClass
					});
			}
		};

		var jsonSrcKeyName = "src";
		var jsonWidthKeyName = "width";
		var jsonHeightKeyName = "height";
		var jsonTitleKeyName = "title";

		var jsonUrl = "./libs/contents-cards/json/contents.json";

		var container = getByClass(document, "container")[0] || "";

		var manageZoomwall = function () {
			var generate = function (text) {

				return new Promise(function (resolve, reject) {

					var jsonObj;

					try {
						jsonObj = JSON.parse(text);
						if (!jsonObj.pages[0][jsonSrcKeyName]) {
							throw new Error("incomplete JSON data: no " + jsonSrcKeyName);
						} else if (!jsonObj.pages[0][jsonWidthKeyName]) {
							throw new Error("incomplete JSON data: no " + jsonWidthKeyName);
						} else if (!jsonObj.pages[0][jsonHeightKeyName]) {
							throw new Error("incomplete JSON data: no " + jsonHeightKeyName);
						} else {
							if (!jsonObj.pages[0][jsonTitleKeyName]) {
								throw new Error("incomplete JSON data: no " + jsonTitleKeyName);
							}
						}
					} catch (err) {
						console.log("cannot init generate", err);
						return;
					}

					/*!
					 * render with <template> and t.js
					 * the drawback you cannot know image sizes
					 * attention to last param: if false cloneNode will be used
					 * and setting listeners or changing its CSS will not be possible
					 * attention IE11 counts elements within template tag,
					 * so you might have length + 1
					 * to fix that select elemnts in a container that doesnt have source template
					 */
					var pagesKeysNumber = countObjKeys(jsonObj.pages);
					insertFromTemplate(jsonObj, "template_zoomwall", "render_zoomwall", function () {
						var zoomwallLastItem = container ?
							getByClass(container, zoomwallItemClass) ?
							getByClass(container, zoomwallItemClass)[pagesKeysNumber - 1] :
							"" :
							"";
						if (zoomwallLastItem) {
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

					jsonObj = jsonObj.pages;

					var df = document[createDocumentFragment]();

					var key;
					for (key in jsonObj) {
						if (jsonObj[hasOwnProperty](key)) {
							if (jsonObj[key][jsonSrcKeyName]) {
								var img = document.createElement("img");
								if (jsonObj[key][jsonWidthKeyName]) {
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
								addClass(img, dataSrcImgClass);
								img[alt] = jsonObj[key][jsonTitleKeyName];
								img[title] = jsonObj[key][jsonTitleKeyName];

								df[appendChild](img);
								df[appendChild](document[createTextNode]("\n"));
							}
						}
					}
					key = null;

					if (zoomwall[appendChild](df)) {
						resolve();
					} else {
						reject();
					} */
				});
			};

			var timerCreate;
			var create = function () {
				clearTimeout(timerCreate);
				timerCreate = null;

				root.zoomwallInstance = null;

				var onZoomwallCreated = function () {
					zoomwall[style].visibility = "visible";
					zoomwall[style].opacity = 1;
					var zoomwallItems = zoomwall ? (zoomwall.children || zoomwall[querySelectorAll]("." + zoomwallClass + " > *") || "") : "";
					if (zoomwallItems) {
						var i,
						l;
						for (i = 0, l = zoomwallItems[_length]; i < l; i += 1) {
							if (!hasClass(zoomwallItems[i], zoomwallItemIsBindedClass)) {
								addClass(zoomwallItems[i], zoomwallItemIsBindedClass);
							}
							if (!hasClass(zoomwallItems[i], anyResizeEventIsBindedClass)) {
								addClass(zoomwallItems[i], anyResizeEventIsBindedClass);

							}
						}
						i = l = null;
					}
				};

				var initZoomwall = function () {
					try {
						if (root.zoomwallInstance) {
							root.zoomwallInstance = null;
						}
						root.zoomwallInstance = new Zoomwall.create(zoomwall, true, jsonSrcKeyName, null, onZoomwallCreated);
						addClass(zoomwall, zoomwallIsActiveClass);
					} catch (err) {
						throw new Error("cannot init Zoomwall " + err);
					}
				};
				initZoomwall();
			};

			var timerLazy;
			var lazy = function () {
				clearTimeout(timerLazy);
				timerLazy = null;

				/* echo(dataSrcImgClass, jsonSrcKeyName); */
				manageDataSrcImgAll();
			};

			/* var myHeaders = new Headers();

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
				generate(text).then(function () {
					timerCreate = setTimeout(create, 500);
				}).then(function () {
					manageExternalLinkAll();
				}).then(function () {
					timerLazy = setTimeout(lazy, 1000);
				}).catch (function (err) {
					console.log("Cannot create zoomwall gallery", err);
				});
			}).catch (function (err) {
				console.log("cannot parse", jsonUrl, err);
			}); */
			if (root.Zoomwall && zoomwall) {
				loadUnparsedJSON(jsonUrl, function (text) {
					generate(text);
					timerCreate = setTimeout(create, 200);
					timerLazy = setTimeout(lazy, 500);
				}, function (err) {
					console.log("cannot parse", jsonUrl, err);
				});
			}
		};
		manageZoomwall();

		var hideOtherIsSocial = function (thisObj) {
			var _thisObj = thisObj || this;
			var elem = getByClass(document, isSocialClass) || "";
			if (elem) {
				var k,
				n;
				for (k = 0, n = elem[_length]; k < n; k += 1) {
					if (_thisObj !== elem[k]) {
						removeClass(elem[k], isActiveClass);
					}
				}
				k = n = null;
			}
		};
		addListener(root, "click", hideOtherIsSocial);

		var yshare;
		var manageShareButtons = function () {
			var btn = getByClass(document, "btn-share-buttons")[0] || "";
			var yaShare2Id = "ya-share2";
			var yaShare2 = document[getElementById](yaShare2Id) || "";
			var locHref = root.location || "";
			var docTitle = document[title] || "";
			var handle = function (ev) {
				ev.stopPropagation();
				ev.preventDefault();
				var logic = function () {
					toggleClass(yaShare2, isActiveClass);
					hideOtherIsSocial(yaShare2);
					var initScript = function () {
						try {
							if (yshare) {
								yshare.updateContent({
									title: docTitle,
									description: docTitle,
									url: locHref
								});
							} else {
								yshare = Ya.share2(yaShare2Id, {
									content: {
										title: docTitle,
										description: docTitle,
										url: locHref
									}
								});
							}
						} catch (err) {
							throw new Error("cannot yshare.updateContent or Ya.share2 " + err);
						}
					};
					if (!(root.Ya && Ya.share2)) {
						var jsUrl = forcedHTTP + "://yastatic.net/share2/share.js";
						var load;
						load = new loadJsCss([jsUrl], initScript);
					} else {
						initScript();
					}
				};
				debounce(logic, 200).call(root);
			};
			if (btn && yaShare2) {
				if ("undefined" !== typeof getHTTP && getHTTP()) {
					addListener(btn, "click", handle);
				} else {
					setStyleDisplayNone(btn);
				}
			}
		};
		manageShareButtons();

		var vlike;
		var manageVKLikeButton = function () {
			var vkLikeId = "vk-like";
			var vkLike = document[getElementById](vkLikeId) || "";
			var holderVkLike = getByClass(document, "holder-vk-like")[0] || "";
			var btn = getByClass(document, "btn-show-vk-like")[0] || "";
			var handle = function (ev) {
				ev.stopPropagation();
				ev.preventDefault();
				var logic = function () {
					toggleClass(holderVkLike, isActiveClass);
					hideOtherIsSocial(holderVkLike);
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
					if (!(root.VK && VK.init && VK.Widgets && VK.Widgets.Like)) {
						var jsUrl = forcedHTTP + "://vk.com/js/api/openapi.js?154";
						var load;
						load = new loadJsCss([jsUrl], initScript);
					} else {
						initScript();
					}
				};
				debounce(logic, 200).call(root);
			};
			if (btn && vkLike) {
				if ("undefined" !== typeof getHTTP && getHTTP()) {
					addListener(btn, "click", handle);
				} else {
					setStyleDisplayNone(btn);
				}
			}
		};
		manageVKLikeButton();

		var titleBar = getByClass(document, "title-bar")[0] || "";
		var titleBarHeight = titleBar.offsetHeight || 0;

		/*!
		 * set fixed on scroll/swipedependong on titleBar position
		 */
		/* var handleTitleBar = function () {
			var logic = function () {
				if ((document[body].scrollTop || docElem.scrollTop || 0) > titleBarHeight) {
					addClass(titleBar, isFixedClass);
				} else {
					removeClass(titleBar, isFixedClass);
				}
			};
			throttle(logic, 100).call(root);
		};
		if (titleBar) {
			addListener(root, "scroll", handleTitleBar, {passive: true});
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
				removeClass(titleBar, slideInDownClass);
				if ((document[body].scrollTop || docElem.scrollTop || 0) > titleBarHeight) {
					addClass(titleBar, slideOutUpClass);
				} else {
					removeClass(titleBar, isFixedClass);
					removeClass(titleBar, slideOutUpClass);
				}
			};
			throttle(logic, 100).call(root);
		};
		var revealTitleBar = function () {
			var logic = function () {
				removeClass(titleBar, slideOutUpClass);
				if ((document[body].scrollTop || docElem.scrollTop || 0) > titleBarHeight) {
					addClass(titleBar, isFixedClass);
					addClass(titleBar, slideInDownClass);
				} else {
					removeClass(titleBar, isFixedClass);
					removeClass(titleBar, slideInDownClass);
				}
			};
			throttle(logic, 100).call(root);
		};
		if (container && titleBar) {
			addClass(titleBar, animatedClass);
			addClass(titleBar, duration4msClass);
			if (hasTouch) {
				if (root.tocca) {
					addListener(document, "swipeup", hideTitleBar, {passive: true});
					addListener(document, "swipedown", revealTitleBar, {passive: true});
				}
			} else {
				if (hasWheel) {
					if (root.WheelIndicator) {
						var indicator;
						indicator = new WheelIndicator({
								elem: root,
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
		var hideTitleBar = function () {
			var logic = function () {
				removeClass(titleBar, isFixedClass);
				if ((document[body].scrollTop || docElem.scrollTop || 0) > titleBarHeight) {
					addClass(titleBar, isHiddenClass);
				} else {
					removeClass(titleBar, isHiddenClass);
				}
			};
			throttle(logic, 100).call(root);
		};
		var revealTitleBar = function () {
			var logic = function () {
				removeClass(titleBar, isHiddenClass);
				if ((document[body].scrollTop || docElem.scrollTop || 0) > titleBarHeight) {
					addClass(titleBar, isFixedClass);
				} else {
					removeClass(titleBar, isFixedClass);
				}
			};
			throttle(logic, 100).call(root);
		};
		var resetTitleBar = function () {
			var logic = function () {
				if ((document[body].scrollTop || docElem.scrollTop || 0) < titleBarHeight) {
					removeClass(titleBar, isHiddenClass);
					removeClass(titleBar, isFixedClass);
				}
			};
			throttle(logic, 100).call(root);
		};
		if (titleBar) {
			addListener(root, "scroll", resetTitleBar, {passive: true});
			if (hasTouch) {
				if (root.tocca) {
					addListener(document, "swipeup", hideTitleBar, {passive: true});
					addListener(document, "swipedown", revealTitleBar, {passive: true});
				}
			} else {
				if (hasWheel) {
					if (root.WheelIndicator) {
						var indicator;
						indicator = new WheelIndicator({
								elem: root,
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

		var manageBtnTotop = function () {
			var btnClass = "btn-totop";
			var btn = getByClass(document, btnClass)[0] || "";
			if (!btn) {
				btn = document.createElement("a");
				addClass(btn, btnClass);
				/* jshint -W107 */
				btn.href = "javascript:void(0);";
				/* jshint +W107 */
				btn.title = "Наверх";
				docBody[appendChild](btn);
			}
			var handle = function (ev) {
				ev.stopPropagation();
				ev.preventDefault();
				scroll2Top(0, 20000);
			};
			var handleWindow = function (_this) {
				var logic = function () {
					var scrollPosition = _this.pageYOffset || docElem.scrollTop || docBody.scrollTop || "";
					var windowHeight = _this.innerHeight || docElem.clientHeight || docBody.clientHeight || "";
					if (scrollPosition && windowHeight && btn) {
						if (scrollPosition > windowHeight) {
							addClass(btn, isActiveClass);
						} else {
							removeClass(btn, isActiveClass);
						}
					}
				};
				throttle(logic, 100).call(root);
			};
			if (docBody) {
				addListener(btn, "click", handle);
				addListener(root, "scroll", handleWindow, {passive: true});
			}
		};
		manageBtnTotop();
	};

	var scripts = [];

	var supportsPassive = (function () {
		var support = false;
		try {
			var opts = Object.defineProperty && Object.defineProperty({}, "passive", {
					get: function () {
						support = true;
					}
				});
			root.addEventListener("test", function() {}, opts);
		} catch (err) {}
		return support;
	})();

	var needsPolyfills = (function () {
		return !String.prototype.startsWith ||
		!supportsPassive ||
		!root.requestAnimationFrame ||
		!root.matchMedia ||
		("undefined" === typeof root.Element && !("dataset" in docElem)) ||
		!("classList" in document.createElement("_")) ||
		document.createElementNS && !("classList" in document.createElementNS("http://www.w3.org/2000/svg", "g")) ||
		(root.attachEvent && !root.addEventListener) ||
		!("onhashchange" in root) ||
		!Array.prototype.indexOf ||
		!root.Promise ||
		!root.fetch ||
		!document.querySelectorAll ||
		!document.querySelector ||
		!Function.prototype.bind ||
		(Object.defineProperty &&
			Object.getOwnPropertyDescriptor &&
			Object.getOwnPropertyDescriptor(Element.prototype, "textContent") &&
			!Object.getOwnPropertyDescriptor(Element.prototype, "textContent").get) ||
		!("undefined" !== typeof root.localStorage && "undefined" !== typeof root.sessionStorage) ||
		!root.WeakMap ||
		!root.MutationObserver;
	})();

	if (needsPolyfills) {
		scripts.push("./cdn/polyfills/js/polyfills.fixed.min.js");
	}

	scripts.push("./libs/picturewall/js/vendors.min.js");

	var bodyFontFamily = "Roboto";

	var onFontsLoaded = function () {
		var slot;
		var init = function () {
			clearInterval(slot);
			slot = null;
			if (!supportsSvgSmilAnimation && "undefined" !== typeof progressBar) {
				progressBar.increase(20);
			}
			var load;
			load = new loadJsCss(scripts, run);
		};
		var check;
		check = function () {
			if (doesFontExist(bodyFontFamily)) {
				init();
			}
		};
		/* if (supportsCanvas) {
			slot = setInterval(check, 100);
		} else {
			slot = null;
			init();
		} */
		init();
	};

	var load;
	load = new loadJsCss(["./libs/picturewall/css/bundle.min.css"], onFontsLoaded);
})("undefined" !== typeof window ? window : this, document);
