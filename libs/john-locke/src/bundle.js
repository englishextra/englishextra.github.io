/*jslint browser: true */
/*jslint node: true */
/*global doesFontExist, loadJsCss, addListener, removeListener, getByClass, addClass, hasClass, removeClass, toggleClass,
Parallax, platform, QRCode, ToProgress, unescape, VK, WheelIndicator, Ya*/
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
		if (!Element.getElementsByClassName) {
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
(function (root, document, undefined) {
	"use strict";

	var docElem = document.documentElement || "";

	var alt = "alt";
	var className = "className";
	var getAttribute = "getAttribute";
	var getElementsByTagName = "getElementsByTagName";
	var height = "height";
	var parentNode = "parentNode";
	var remove = "remove";
	var removeChild = "removeChild";
	var src = "src";
	var style = "style";
	var styleSheets = "styleSheets";
	var width = "width";
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

	if (!supportsSvgSmilAnimation) {

		progressBar.increase(20);

		addListener(root, "load", hideProgressBar);
	}

	var removeElement = function (a) {
		if (a) {
			if ("undefined" !== typeof a[remove]) {
				return a[remove]();
			} else {
				return a[parentNode] && a[parentNode][removeChild](a);
			}
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

	var ripple = getByClass(document, "ripple")[0] || "";

	var removeRipple = function () {
		removeElement(ripple);
	};

	var timerRipple;
	var deferRemoveRipple = function () {
		clearTimeout(timerRipple);
		timerRipple = null;
		removeRipple();
	};

	var loading = getByClass(document, "loading")[0] || "";

	var removeLoading = function () {
		removeElement(loading);
	};

	var timerLoading;
	var deferRemoveLoading = function () {
		clearTimeout(timerLoading);
		timerLoading = null;
		removeLoading();
	};

	var bounceOutUpClass = "bounceOutUp";

	var hidePreloaders = function () {
		if (ripple) {
			ripple[className] += " " + bounceOutUpClass;
			timerRipple = setTimeout(deferRemoveRipple, 5000);
		}
		if (loading) {
			loading[className] += " " + bounceOutUpClass;
			timerLoading = setTimeout(deferRemoveLoading, 5000);
		}
	};

	if (!supportsSvgSmilAnimation) {
		removeRipple();
		removeLoading();
	} else {
		addListener(root, "load", hidePreloaders);
	}

	var supportsSvgAsImg = document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image", "1.1") || "";

	if (!supportsSvgAsImg) {
		var svgNosmilImgAll = getByClass(document, "svg-nosmil-img") || "";
		if (svgNosmilImgAll) {
			var i,
			l;
			for (i = 0, l = svgNosmilImgAll[_length]; i < l; i += 1) {
				svgNosmilImgAll[i][src] = svgNosmilImgAll[i][getAttribute]("data-fallback-src");
			}
			i = l = null;
		}
	}

	if (!supportsSvgSmilAnimation) {
		var svgSmilImgAll = getByClass(document, "svg-smil-img") || "";
		if (svgSmilImgAll) {
			var j,
			m;
			for (j = 0, m = svgSmilImgAll[_length]; j < m; j += 1) {
				svgSmilImgAll[j][src] = svgSmilImgAll[j][getAttribute]("data-fallback-src");
			}
			j = m = null;
		}
	}

	var drawImageFromUrl = function (canvasObj, url) {
		if (!canvasObj || !url) {
			return;
		}
		var img = new Image();
		addListener(img, "load", function () {
			var ctx = canvasObj.getContext("2d");
			if (ctx) {
				ctx.drawImage(img, 0, 0, canvasObj[width], canvasObj[height]);
			}
		});
		img[src] = url;
	};

	var replaceCanvasWithImg = function (canvasObj, url) {
		if (!canvasObj || !url) {
			return;
		}
		var img = document.createElement("img");
		img[src] = url;
		img[alt] = "";
		img[className] = canvasObj[className].split(" ").join(" ");
		img[width] = canvasObj[width];
		img[height] = canvasObj[height];
		if (canvasObj[parentNode]) {
			canvasObj[parentNode].insertBefore(img, canvasObj.nextSibling);
		}
		setStyleDisplayNone(canvasObj);
	};

	var canvasAll = document[getElementsByTagName]("canvas") || "";

	var styleSheetsLength = document[styleSheets][_length] || 0;

	var slotDrawCanvasAll;
	var drawCanvasAll = function () {
		if (document[styleSheets][_length] > styleSheetsLength) {
			clearInterval(slotDrawCanvasAll);
			slotDrawCanvasAll = null;
			var i,
			l,
			canvasObj,
			url;
			for (i = 0, l = canvasAll[_length]; i < l; i += 1) {
				if (canvasAll[i][getAttribute]("data-src")) {
					canvasObj = canvasAll[i];
					url = canvasAll[i][getAttribute]("data-src");
					if (supportsCanvas) {
						drawImageFromUrl(canvasObj, url);
					} else {
						replaceCanvasWithImg(canvasObj, url);
					}

				}
			}
			i = l = canvasObj = url = null;
		}
	};

	if (canvasAll && styleSheetsLength) {
		slotDrawCanvasAll = setInterval(drawCanvasAll, 100);
	}

	var run = function () {

		var appendChild = "appendChild";
		var dataset = "dataset";
		var getElementById = "getElementById";
		var href = "href";
		var opacity = "opacity";
		var title = "title";
		var visibility = "visibility";

		var bounceInUpClass = "bounceInUp";
		var bounceOutDownClass = "bounceOutDown";

		var isActiveClass = "is-active";
		var isSocialClass = "is-social";

		var docTitle = document[title] || "";
		var locHref = root.location[href] || "";
		var navUA = navigator.userAgent || "";

		if (!supportsSvgSmilAnimation) {
			progressBar.increase(20);
		}

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

		var wrapper = getByClass(document, "wrapper")[0] || "";

		manageExternalLinkAll(wrapper);

		var manageLocationQrcode = function () {
			var qrcode = getByClass(document, "qrcode")[0] || "";
			var timerQrcode;
			var showQrcode = function () {
				clearTimeout(timerQrcode);
				timerQrcode = null;
				qrcode[style][visibility] = "visible";
				qrcode[style][opacity] = 1;
			};
			if (qrcode) {
				var img = document.createElement("img");
				var imgTitle = docTitle ? ("Ссылка на страницу «" + docTitle.replace(/\[[^\]]*?\]/g, "").trim() + "»") : "";
				var imgSrc = forcedHTTP + "://chart.googleapis.com/chart?cht=qr&chld=M%7C4&choe=UTF-8&chs=512x512&chl=" + encodeURIComponent(locHref);
				img[alt] = imgTitle;
				if (root.QRCode) {
					if (supportsSvgAsImg) {
						imgSrc = QRCode.generateSVG(locHref, {
								ecclevel: "M",
								fillcolor: "#FFFFFF",
								textcolor: "#191919",
								margin: 4,
								modulesize: 8
							});
						var XMLS = new XMLSerializer();
						imgSrc = XMLS.serializeToString(imgSrc);
						imgSrc = "data:image/svg+xml;base64," + root.btoa(unescape(encodeURIComponent(imgSrc)));
						img[src] = imgSrc;
					} else {
						imgSrc = QRCode.generatePNG(locHref, {
								ecclevel: "M",
								format: "html",
								fillcolor: "#FFFFFF",
								textcolor: "#1F1F1F",
								margin: 4,
								modulesize: 8
							});
						img[src] = imgSrc;
					}
				} else {
					img[src] = imgSrc;
				}
				img[title] = imgTitle;
				qrcode[appendChild](img);
				timerQrcode = setTimeout(showQrcode, 2000);
			}
		};
		manageLocationQrcode();

		var manageDownloadAppBtn = function () {
			var downloadApp = getByClass(document, "download-app")[0] || "";
			var link = downloadApp ? downloadApp[getElementsByTagName]("a")[0] || "" : "";
			var img = downloadApp ? downloadApp[getElementsByTagName]("img")[0] || "" : "";
			var timer;
			var showDownloadApp = function () {
				clearTimeout(timer);
				timer = null;
				downloadApp[style][visibility] = "visible";
				downloadApp[style][opacity] = 1;
			};
			if (root.platform && navUA && downloadApp && link && img) {
				var osFamily = platform.os.family || "";
				var osVersion = platform.os.version || "";
				var osArchitecture = platform.os.architecture || "";
				/* console.log(navUA);
				console.log(platform.os);
				console.log(brName + "|" + osFamily + "|" + osVersion + "|" + osArchitecture + "|" + brDescription); */
				var imgSrc;
				var linkHref;
				if (osFamily.indexOf("Windows Phone", 0) !== -1 && "10.0" === osVersion) {
					imgSrc = "./libs/products/img/download_wp_app_144x52.svg";
					linkHref = "https://github.com/englishextra/englishextra-app/releases/download/v1.0.0/englishextra.Windows10_x86_debug.appx";
				} else if (brName.indexOf("IE Mobile", 0) !== -1 && ("7.5" === osVersion || "8.0" === osVersion || "8.1" === osVersion)) {
					imgSrc = "./libs/products/img/download_wp_app_144x52.svg";
					linkHref = "https://github.com/englishextra/englishextra-app/releases/download/v1.0.0/englishextra_app-debug.xap";
				} else if (osFamily.indexOf("Windows", 0) !== -1 && 64 === osArchitecture) {
					imgSrc = "./libs/products/img/download_windows_app_144x52.svg";
					linkHref = "https://github.com/englishextra/englishextra-app/releases/download/v1.0.0/englishextra-win32-x64-setup.exe";
				} else if (osFamily.indexOf("Windows", 0) !== -1 && 32 === osArchitecture) {
					imgSrc = "./libs/products/img/download_windows_app_144x52.svg";
					linkHref = "https://github.com/englishextra/englishextra-app/releases/download/v1.0.0/englishextra-win32-ia32-setup.exe";
				} else if (navUA.indexOf("armv7l", 0) !== -1) {
					imgSrc = "./libs/products/img/download_linux_app_144x52.svg";
					linkHref = "https://github.com/englishextra/englishextra-app/releases/download/v1.0.0/englishextra-linux-armv7l.tar.gz";
				} else if (navUA.indexOf("X11", 0) !== -1 && navUA.indexOf("Linux") !== -1 && 64 === osArchitecture) {
					imgSrc = "./libs/products/img/download_linux_app_144x52.svg";
					linkHref = "https://github.com/englishextra/englishextra-app/releases/download/v1.0.0/englishextra-linux-x64.tar.gz";
				} else if (navUA.indexOf("X11", 0) !== -1 && navUA.indexOf("Linux") !== -1 && 32 === osArchitecture) {
					imgSrc = "./libs/products/img/download_linux_app_144x52.svg";
					linkHref = "https://github.com/englishextra/englishextra-app/releases/download/v1.0.0/englishextra-linux-ia32.tar.gz";
				} else {
					if (osFamily.indexOf("Android", 0) !== -1) {
						imgSrc = "./libs/products/img/download_android_app_144x52.svg";
						linkHref = "https://github.com/englishextra/englishextra-app/releases/download/v1.0.0/englishextra-debug.apk";
					}
				}
				if (imgSrc && linkHref) {
					link[href] = linkHref;
					link.rel = "noopener";
					link.target = "_blank";
					link[title] = "Скачать приложение";
					if (!supportsSvgAsImg) {
						imgSrc = [imgSrc.slice(0, -3), "png"].join("");
					}
					img[src] = imgSrc;
					timer = setTimeout(showDownloadApp, 1000);
				}
			}
		};
		manageDownloadAppBtn();

		var scene = document[getElementById]("scene") || "";
		var parallax;
		if (root.Parallax && scene) {
			parallax = new Parallax(scene);
		}

		var guesture = getByClass(document, "guesture")[0] || "";

		var start = getByClass(document, "start")[0] || "";
		var hand = getByClass(document, "hand")[0] || "";

		var revealStart = function () {
			if (start) {
				removeClass(start, bounceOutDownClass);
				addClass(start, bounceInUpClass);
				setStyleDisplayBlock(start);
			}
			if (hand) {
				removeClass(hand, bounceOutDownClass);
				addClass(hand, bounceInUpClass);
				setStyleDisplayBlock(hand);
			}
			if (guesture) {
				addClass(guesture, bounceOutUpClass);
			}
		};

		var concealStart = function () {
			if (start) {
				removeClass(start, bounceInUpClass);
				addClass(start, bounceOutDownClass);
			}
			if (hand) {
				removeClass(hand, bounceInUpClass);
				addClass(hand, bounceOutDownClass);
			}
			var timer;
			var hideStart = function () {
				clearTimeout(timer);
				timer = null;
				setStyleDisplayNone(start);
				setStyleDisplayNone(hand);
			};
			timer = setTimeout(hideStart, 1000);
		};

		var mousewheeldown = getByClass(document, "mousewheeldown")[0] || "";
		var swipeup = getByClass(document, "swipeup")[0] || "";
		if (mousewheeldown && swipeup) {
			if (hasTouch) {
				setStyleDisplayNone(mousewheeldown);
				if (root.tocca) {
					addListener(document, "swipeup", revealStart, {passive: true});
					addListener(document, "swipedown", concealStart, {passive: true});
				}
			} else {
				if (hasWheel) {
					setStyleDisplayNone(swipeup);
					if (root.WheelIndicator) {
						var indicator;
						indicator = new WheelIndicator({
								elem: root,
								callback: function (e) {
									if ("down" === e.direction) {
										revealStart();
									}
									if ("up" === e.direction) {
										concealStart();
									}
								},
								preventMouse: false
							});
					}
				}
			}
			if (hasTouch || hasWheel) {
				addClass(guesture, bounceInUpClass);
				setStyleDisplayBlock(guesture);
			}
		}

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
			addListener(root, "test", function () {}, opts);
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

	scripts.push("./libs/john-locke/js/vendors.min.js");

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
	load = new loadJsCss(["./libs/john-locke/css/bundle.min.css"], onFontsLoaded);
})("undefined" !== typeof window ? window : this, document);
