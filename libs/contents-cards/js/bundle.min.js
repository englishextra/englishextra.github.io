/*jslint browser: true */
/*jslint node: true */
/*global doesFontExist, echo, Headers, loadCSS, loadJsCss, Minigrid, Mustache,
platform, Promise, t, ToProgress, VK, WheelIndicator, Ya */
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
	var docBody = document.body || "";

	var createElement = "createElement";
	var createElementNS = "createElementNS";
	var defineProperty = "defineProperty";
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

	var hasTouch = "ontouchstart" in docElem || "";

	var hasWheel = "onwheel" in document[createElement]("div") || void 0 !== document.onmousewheel || "";

	var getHTTP = function (force) {
		var any = force || "";
		var locationProtocol = root.location.protocol || "";
		return "http:" === locationProtocol ? "http" : "https:" === locationProtocol ? "https" : any ? "http" : "";
	};

	var forcedHTTP = getHTTP(true);

	var run = function () {

		var appendChild = "appendChild";
		var body = "body";
		var classList = "classList";
		var className = "className";
		var cloneNode = "cloneNode";
		var createContextualFragment = "createContextualFragment";
		var createDocumentFragment = "createDocumentFragment";
		var createRange = "createRange";
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

		var isActiveClass = "is-active";
		var isBindedClass = "is-binded";
		var isFixedClass = "is-fixed";
		var isHiddenClass = "is-hidden";

		var documentTitle = document[title] || "";
		var locationHref = root.location[href] || "";
		var navigatorUserAgent = navigator.userAgent || "";

		progressBar.increase(20);

		if (docElem && docElem[classList]) {
			docElem[classList].remove("no-js");
			docElem[classList].add("js");
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

		var observeMutations = function (scope) {
			var context = scope && scope.nodeName ? scope : "";
			var mo;
			var getMutations = function (e) {
				var triggerOnMutation = function (m) {
					console.log("mutations observer: " + m.type);
					console.log(m.type, "target: " + m.target.tagName + ("." + m.target[className] || "#" + m.target.id || ""));
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
					triggerOnMutation(e[i]);
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

		var cardGridClass = "card-grid";
		var cardGrid = document[getElementsByClassName](cardGridClass)[0] || "";

		observeMutations(cardGrid);

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

		var manageExternalLinkAll = function (scope) {
			var context = scope && scope.nodeName ? scope : "";
			var linkTag = "a";
			var externalLinks = context ? context[getElementsByTagName](linkTag) || "" : document[getElementsByTagName](linkTag) || "";
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
							e[_addEventListener]("click", handleExternalLink.bind(null, url));
						}
						e[classList].add(isBindedClass);
					}
				}
			};
			if (externalLinks) {
				var i;
				var l;
				for (i = 0, l = externalLinks[_length]; i < l; i += 1) {
					arrange(externalLinks[i]);
				}
				i = l = null;
			}
		};

		var wrapper = document[getElementsByClassName]("wrapper")[0] || "";

		manageExternalLinkAll(wrapper);

		var dataSrcImgClass = "data-src-img";
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
				 * attention IE11 counts elements within template tag,
				 * so you might have length + 1
				 * to fix that select elemnts in a container that doesnt have source template
				 */
				var pagesKeysNumber = countObjKeys(jsonObj.pages);
				insertFromTemplate(jsonObj, "template_card_grid", "target_card_grid", function () {
					if (wrapper[getElementsByClassName](cardWrapClass)[pagesKeysNumber - 1]) {
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
							img[classList].add(dataSrcImgClass);
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

		var addCardWrapCssRule = function () {
			var toDashedAll = function (str) {
				return str.replace((/([A-Z])/g), function ($1) {
					return "-" + $1.toLowerCase();
				});
			};
			var docElemStyle = docElem[style];
			var transitionProperty = typeof docElemStyle.transition === "string" ?
				"transition" : "WebkitTransition";
			var transformProperty = typeof docElemStyle.transform === "string" ?
				"transform" : "WebkitTransform";
			var styleSheet = document[styleSheets][0] || "";
			if (styleSheet) {
				var cssRule;
				cssRule = toDashedAll([".",
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

		var timerCreateGrid;
		var createGrid = function () {
			clearTimeout(timerCreateGrid);
			timerCreateGrid = null;

			var onMinigridCreated = function () {
				cardGrid[style].visibility = "visible";
				cardGrid[style].opacity = 1;
			};
			var mgrid;
		
		var isBindedMinigridCardClass = "is-binded-minigrid-card";
			var initMinigrid = function () {
				mgrid = new Minigrid({
						container: cardGridClass,
						item: cardWrapClass,
						gutter: 20/* ,
						done: onMinigridCreated */
					});
				mgrid.mount();
				onMinigridCreated();
				addCardWrapCssRule();
			};
			var updateMinigrid = function () {
				if (mgrid) {
					var timer = setTimeout(function () {
							clearTimeout(timer);
							timer = null;
							mgrid.mount();
						}, 100);
				}
			};
			initMinigrid();
			root[_addEventListener]("resize", updateMinigrid, {passive: true});
		};

		var timerSetLazyloading;
		var setLazyloading = function () {
			clearTimeout(timerSetLazyloading);
			timerSetLazyloading = null;

			echo(dataSrcImgClass, jsonSrcKeyName);
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
			generateCardGrid(text).then(function () {
				timerCreateGrid = setTimeout(createGrid, 500);
			}).then(function () {
				manageExternalLinkAll(wrapper);
			}).then(function () {
				timerSetLazyloading = setTimeout(setLazyloading, 1000);
			}).catch (function (err) {
				console.log("Cannot create card grid", err);
			});
		}).catch (function (err) {
			console.log("cannot parse", jsonUrl, err);
		});

		var hideOtherIsSocial = function (thisObj) {
			var _thisObj = thisObj || this;
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
							/* console.log("cannot yshare.updateContent or Ya.share2", err); */
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
			btnShareLink[_addEventListener]("click", showYaShare2);
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
								/* console.log("cannot VK.init", err); */
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
			btnLikeLink[_addEventListener]("click", showVkLike);
		}

		var titleBar = document[getElementsByClassName]("title-bar")[0] || "";
		var titleBarHeight = titleBar.offsetHeight || 0;

		/*!
		 * set fixed on scroll/swipedependong on titleBar position
		 */
		/* var handleTitleBar = function () {
			var logic = function () {
				if ((document[body].scrollTop || docElem.scrollTop || 0) > titleBarHeight) {
					titleBar[classList].add(isFixedClass);
				} else {
					titleBar[classList].remove(isFixedClass);
				}
			};
			var throttleLogic = throttle(logic, 100);
			throttleLogic();
		};
		if (titleBar) {
			root[_addEventListener]("scroll", handleTitleBar, {passive: true});
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
				if ((document[body].scrollTop || docElem.scrollTop || 0) > titleBarHeight) {
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
				if ((document[body].scrollTop || docElem.scrollTop || 0) > titleBarHeight) {
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
					root[_addEventListener]("swipeup", hideTitleBar, {passive: true});
					root[_addEventListener]("swipedown", revealTitleBar, {passive: true});
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
				titleBar[classList].remove(isFixedClass);
				if ((document[body].scrollTop || docElem.scrollTop || 0) > titleBarHeight) {
					titleBar[classList].add(isHiddenClass);
				} else {
					titleBar[classList].remove(isHiddenClass);
				}
			};
			var throttleLogic = throttle(logic, 100);
			throttleLogic();
		};
		var revealTitleBar = function () {
			var logic = function () {
				titleBar[classList].remove(isHiddenClass);
				if ((document[body].scrollTop || docElem.scrollTop || 0) > titleBarHeight) {
					titleBar[classList].add(isFixedClass);
				} else {
					titleBar[classList].remove(isFixedClass);
				}
			};
			var throttleLogic = throttle(logic, 100);
			throttleLogic();
		};
		var resetTitleBar = function () {
			var logic = function () {
				if ((document[body].scrollTop || docElem.scrollTop || 0) < titleBarHeight) {
					titleBar[classList].remove(isHiddenClass);
					titleBar[classList].remove(isFixedClass);
				}
			};
			var throttleLogic = throttle(logic, 100);
			throttleLogic();
		};
		if (titleBar) {
			root[_addEventListener]("scroll", resetTitleBar, {passive: true});
			if (hasTouch) {
				if (root.tocca) {
					root[_addEventListener]("swipeup", hideTitleBar, {passive: true});
					root[_addEventListener]("swipedown", revealTitleBar, {passive: true});
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

		var btnClass = "btn-totop";
		var btnTotop = document[getElementsByClassName](btnClass)[0] || "";
		var handleBtnTotop = function (evt) {
			evt.stopPropagation();
			evt.preventDefault();
			scroll2Top(0, 20000);
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
			btnTotop[_addEventListener]("click", handleBtnTotop);
			root[_addEventListener]("scroll", handleBtnTotopWindow, {passive: true});
		}
	};

	/* var scripts = ["./libs/contents-cards/css/bundle.min.css"]; */
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

	/* scripts.push("./cdn/platform/1.3.4/js/platform.fixed.min.js",
		"./cdn/minigrid/3.1.1/js/minigrid.fixed.min.js",
		"./cdn/echo.js/0.1.0/js/echo.fixed.min.js",
		"./cdn/t.js/0.1.0/js/t.fixed.min.js",
		"./cdn/Tocca.js/2.0.1/js/Tocca.fixed.min.js",
		"./cdn/wheel-indicator/1.1.4/js/wheel-indicator.fixed.min.js"); */

	scripts.push("./libs/contents-cards/js/vendors.min.js");

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

	loadCSS(
			/* forcedHTTP + "://fonts.googleapis.com/css?family=Roboto:400,700&subset=cyrillic", */
			"./libs/contents-cards/css/bundle.min.css",
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
