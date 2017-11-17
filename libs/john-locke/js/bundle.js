/*jslint browser: true */
/*jslint node: true */
/*global doesFontExist, loadCSS, loadJsCss, Parallax, platform, QRCode,
ToProgress, unescape, VK, WheelIndicator, Ya*/
/*property console, join, split */
/*!
 * safe way to handle console.log
 * @see {@link https://github.com/paulmillr/console-polyfill}
 */
(function (root) {
	"use strict";

	if (!root.console) {
		root.console = {};
	}
	var con = root.console;
	var prop;
	var method;
	var dummy = function () {};
	var properties = ["memory"];
	var methods = ["assert,clear,count,debug,dir,dirxml,error,exception,group,", "groupCollapsed,groupEnd,info,log,markTimeline,profile,profiles,profileEnd,", "show,table,time,timeEnd,timeline,timelineEnd,timeStamp,trace,warn"];
	methods.join("").split(",");
	for (; prop = properties.pop();) {
		if (!con[prop]) {
			con[prop] = {};
		}
	}
	for (; method = methods.pop();) {
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

	var ToProgress = function () {
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
	}();
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
	var loadCSS = function (_href, callback) {
		"use strict";

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
		var i, l;
		for (i = 0, l = _this.files[_length]; i < l; i += 1) {
			if (/\.js$|\.js\?/.test(_this.files[i])) {
				_this.js.push(_this.files[i]);
			}
			if (/\.css$|\.css\?|\/css\?/.test(_this.files[i])) {
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
	var createElement = "createElement";
	var createElementNS = "createElementNS";
	var defineProperty = "defineProperty";
	var getAttribute = "getAttribute";
	var getElementsByClassName = "getElementsByClassName";
	var getElementsByTagName = "getElementsByTagName";
	var getOwnPropertyDescriptor = "getOwnPropertyDescriptor";
	var height = "height";
	var parentNode = "parentNode";
	var querySelector = "querySelector";
	var querySelectorAll = "querySelectorAll";
	var remove = "remove";
	var removeChild = "removeChild";
	var src = "src";
	var style = "style";
	var styleSheets = "styleSheets";
	var width = "width";
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

	var toStringFn = {}.toString;
	var supportsSvgSmilAnimation = !!document[createElementNS] && /SVGAnimate/.test(toStringFn.call(document[createElementNS]("http://www.w3.org/2000/svg", "animate"))) || "";

	if (!supportsSvgSmilAnimation) {

		progressBar.increase(20);

		root[_addEventListener]("load", hideProgressBar);
	}

	var removeElement = function (elem) {
		if (elem) {
			if ("undefined" !== typeof elem[remove]) {
				return elem[remove]();
			} else {
				return elem[parentNode] && elem[parentNode][removeChild](elem);
			}
		}
	};

	var ripple = document[getElementsByClassName]("ripple")[0] || "";

	var removeRipple = function () {
		removeElement(ripple);
	};

	var timerDeferRemoveRipple;
	var deferRemoveRipple = function () {
		clearTimeout(timerDeferRemoveRipple);
		timerDeferRemoveRipple = null;
		removeRipple();
	};

	var loading = document[getElementsByClassName]("loading")[0] || "";

	var removeLoading = function () {
		removeElement(loading);
	};

	var timerDeferRemoveLoading;
	var deferRemoveLoading = function () {
		clearTimeout(timerDeferRemoveLoading);
		timerDeferRemoveLoading = null;
		removeLoading();
	};

	var bounceOutUpClass = "bounceOutUp";

	var hidePreloaders = function () {
		if (ripple) {
			ripple[className] += " " + bounceOutUpClass;
			timerDeferRemoveRipple = setTimeout(deferRemoveRipple, 5000);
		}
		if (loading) {
			loading[className] += " " + bounceOutUpClass;
			timerDeferRemoveLoading = setTimeout(deferRemoveLoading, 5000);
		}
	};

	if (!supportsSvgSmilAnimation) {
		removeRipple();
		removeLoading();
	} else {
		root[_addEventListener]("load", hidePreloaders);
	}

	var supportsSvgAsImg = document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image", "1.1") || "";

	if (!supportsSvgAsImg) {
		var svgNosmilImages = document[getElementsByClassName]("svg-nosmil-img") || "";
		if (svgNosmilImages) {
			var i, l;
			for (i = 0, l = svgNosmilImages[_length]; i < l; i += 1) {
				svgNosmilImages[i][src] = svgNosmilImages[i][getAttribute]("data-fallback-src");
			}
			i = l = null;
		}
	}

	if (!supportsSvgSmilAnimation) {
		var svgSmilImages = document[getElementsByClassName]("svg-smil-img") || "";
		if (svgSmilImages) {
			var j, m;
			for (j = 0, m = svgSmilImages[_length]; j < m; j += 1) {
				svgSmilImages[j][src] = svgSmilImages[j][getAttribute]("data-fallback-src");
			}
			j = m = null;
		}
	}

	var drawImageFromUrl = function (canvasObj, url) {
		if (!canvasObj || !url) {
			return;
		}
		var img = new Image();
		img[_addEventListener]("load", function () {
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
		var img = document[createElement]("img");
		img[src] = url;
		img[alt] = "";
		img[className] = canvasObj[className].split(" ").join(" ");
		img[width] = canvasObj[width];
		img[height] = canvasObj[height];
		if (canvasObj[parentNode]) {
			canvasObj[parentNode].insertBefore(img, canvasObj.nextSibling);
		}
		canvasObj[style].display = "none";
	};

	var canvasAll = document[getElementsByTagName]("canvas") || "";

	var styleSheetsLength = document[styleSheets][_length] || 0;

	var supportsCanvas = function () {
		var elem = document[createElement]("canvas");
		return !!(elem.getContext && elem.getContext("2d"));
	}();

	var slotDrawCanvasAll;
	var drawCanvasAll = function () {
		if (document[styleSheets][_length] > styleSheetsLength) {
			clearInterval(slotDrawCanvasAll);
			slotDrawCanvasAll = null;
			var i, l, canvasObj, url;
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
		var classList = "classList";
		var dataset = "dataset";
		var getElementById = "getElementById";
		var href = "href";
		var opacity = "opacity";
		var title = "title";
		var visibility = "visibility";

		if (!supportsSvgSmilAnimation) {
			progressBar.increase(20);
		}

		if (docElem && docElem[classList]) {
			docElem[classList].remove("no-js");
			docElem[classList].add("js");
		}

		/*jshint bitwise: false */
		var parseLink = function (url, full) {
			var _full = full || "";
			return function () {
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
				var _isAbsolute = 0 === url.indexOf("//") || !!~url.indexOf("://");
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
					port: "0" === _link.port || "" === _link.port ? _protocol(_link.protocol) : _full ? _link.port : _replace(_link.port),
					hash: _full ? _link.hash : _replace(_link.hash),
					hostname: _link.hostname || _location.hostname,
					pathname: _link.pathname.charAt(0) !== "/" ? _full ? "/" + _link.pathname : _link.pathname : _full ? _link.pathname : _link.pathname.slice(1),
					protocol: !_link.protocol || ":" === _link.protocol ? _full ? _location.protocol : _replace(_location.protocol) : _full ? _link.protocol : _replace(_link.protocol),
					search: _full ? _link.search : _replace(_link.search),
					query: _full ? _link.search : _replace(_link.search),
					isAbsolute: _isAbsolute,
					isRelative: !_isAbsolute,
					isCrossDomain: _isCrossDomain(),
					hasHTTP: /^(http|https):\/\//i.test(url) ? !0 : !1
				};
			}();
		};
		/*jshint bitwise: true */

		var isNodejs = "undefined" !== typeof process && "undefined" !== typeof require || "";
		var isElectron = "undefined" !== typeof root && root.process && "renderer" === root.process.type || "";
		var isNwjs = function () {
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
		}();

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
					var last = new Date() - timestamp;
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

		var isBindedClass = "is-binded";

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
				if (!e[classList].contains(isBindedClass) && !e.target && !e.rel) {
					var url = e[getAttribute]("href") || "";
					if (url && parseLink(url).isCrossDomain && parseLink(url).hasHTTP) {
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
			var newDate = new Date();
			var newDay = newDate.getDate();
			var newYear = newDate.getFullYear();
			var newMonth = newDate.getMonth();
			newMonth += 1;
			if (10 > newDay) {
				newDay = "0" + newDay;
			}
			if (10 > newMonth) {
				newMonth = "0" + newMonth;
			}
			return newYear + "-" + newMonth + "-" + newDay;
		}();

		var platformName = "";
		var platformDescription = "";
		if (navigatorUserAgent && root.platform) {
			platformName = platform.name || "";
			platformDescription = platform.description || "";
			document[title] = documentTitle + " [" + (getHumanDate ? " " + getHumanDate : "") + (platformDescription ? " " + platformDescription : "") + (hasTouch || hasWheel ? " with" : "") + (hasTouch ? " touch" : "") + (hasTouch && hasWheel ? "," : "") + (hasWheel ? " mousewheel" : "") + "]";
		}

		var qrcode = document[getElementsByClassName]("qrcode")[0] || "";

		var timerShowQrcode;
		var showQrcode = function () {
			clearTimeout(timerShowQrcode);
			timerShowQrcode = null;
			qrcode[style][visibility] = "visible";
			qrcode[style][opacity] = 1;
		};

		var locationHref = root.location[href] || "";

		if (qrcode) {
			var qrcodeImg = document[createElement]("img");
			var qrcodeImgTitle = documentTitle ? "Ссылка на страницу «" + documentTitle.replace(/\[[^\]]*?\]/g, "").trim() + "»" : "";
			var qrcodeImgSrc = forcedHTTP + "://chart.googleapis.com/chart?cht=qr&chld=M%7C4&choe=UTF-8&chs=512x512&chl=" + encodeURIComponent(locationHref);
			qrcodeImg[alt] = qrcodeImgTitle;
			if (root.QRCode) {
				if (supportsSvgAsImg) {
					qrcodeImgSrc = QRCode.generateSVG(locationHref, {
						ecclevel: "M",
						fillcolor: "#FFFFFF",
						textcolor: "#191919",
						margin: 4,
						modulesize: 8
					});
					var XMLS = new XMLSerializer();
					qrcodeImgSrc = XMLS.serializeToString(qrcodeImgSrc);
					qrcodeImgSrc = "data:image/svg+xml;base64," + root.btoa(unescape(encodeURIComponent(qrcodeImgSrc)));
					qrcodeImg[src] = qrcodeImgSrc;
				} else {
					qrcodeImgSrc = QRCode.generatePNG(locationHref, {
						ecclevel: "M",
						format: "html",
						fillcolor: "#FFFFFF",
						textcolor: "#1F1F1F",
						margin: 4,
						modulesize: 8
					});
					qrcodeImg[src] = qrcodeImgSrc;
				}
			} else {
				qrcodeImg[src] = qrcodeImgSrc;
			}
			qrcodeImg[title] = qrcodeImgTitle;
			qrcode[appendChild](qrcodeImg);
			timerShowQrcode = setTimeout(showQrcode, 2000);
		}

		var downloadApp = document[getElementsByClassName]("download-app")[0] || "";
		var downloadAppLink = downloadApp ? downloadApp[getElementsByTagName]("a")[0] || "" : "";
		var downloadAppImg = downloadApp ? downloadApp[getElementsByTagName]("img")[0] || "" : "";

		var timerhowDownloadApp;
		var showDownloadApp = function () {
			clearTimeout(timerhowDownloadApp);
			timerhowDownloadApp = null;
			downloadApp[style][visibility] = "visible";
			downloadApp[style][opacity] = 1;
		};

		if (navigatorUserAgent && downloadApp && downloadAppLink && downloadAppImg && root.platform) {
			var platformOsFamily = platform.os.family || "";
			var platformOsVersion = platform.os.version || "";
			var platformOsArchitecture = platform.os.architecture || "";
			/* console.log(navigatorUserAgent);
   console.log(platform.os);
   console.log(platformName + "|" + platformOsFamily + "|" + platformOsVersion + "|" + platformOsArchitecture + "|" + platformDescription); */
			var downloadAppImgSrc;
			var downloadAppLinkHref;
			if (platformOsFamily.indexOf("Windows Phone", 0) !== -1 && "10.0" === platformOsVersion) {
				downloadAppImgSrc = "./libs/products/img/download_wp_app_144x52.svg";
				downloadAppLinkHref = "https://github.com/englishextra/englishextra-app/releases/download/v1.0.0/englishextra.Windows10_1.0.0.0_x86_debug.appx";
			} else if (platformName.indexOf("IE Mobile", 0) !== -1 && ("7.5" === platformOsVersion || "8.0" === platformOsVersion || "8.1" === platformOsVersion)) {
				downloadAppImgSrc = "./libs/products/img/download_wp_app_144x52.svg";
				downloadAppLinkHref = "https://github.com/englishextra/englishextra-app/releases/download/v1.0.0/englishextra_app-debug.xap";
			} else if (platformOsFamily.indexOf("Windows", 0) !== -1 && 64 === platformOsArchitecture) {
				downloadAppImgSrc = "./libs/products/img/download_windows_app_144x52.svg";
				downloadAppLinkHref = "https://github.com/englishextra/englishextra-app/releases/download/v1.0.0/englishextra-win32-x64-setup.exe";
			} else if (platformOsFamily.indexOf("Windows", 0) !== -1 && 32 === platformOsArchitecture) {
				downloadAppImgSrc = "./libs/products/img/download_windows_app_144x52.svg";
				downloadAppLinkHref = "https://github.com/englishextra/englishextra-app/releases/download/v1.0.0/englishextra-win32-ia32-setup.exe";
			} else if (navigatorUserAgent.indexOf("armv7l", 0) !== -1) {
				downloadAppImgSrc = "./libs/products/img/download_linux_app_144x52.svg";
				downloadAppLinkHref = "https://github.com/englishextra/englishextra-app/releases/download/v1.0.0/englishextra-linux-armv7l.tar.gz";
			} else if (navigatorUserAgent.indexOf("X11", 0) !== -1 && navigatorUserAgent.indexOf("Linux") !== -1 && 64 === platformOsArchitecture) {
				downloadAppImgSrc = "./libs/products/img/download_linux_app_144x52.svg";
				downloadAppLinkHref = "https://github.com/englishextra/englishextra-app/releases/download/v1.0.0/englishextra-linux-x64.tar.gz";
			} else if (navigatorUserAgent.indexOf("X11", 0) !== -1 && navigatorUserAgent.indexOf("Linux") !== -1 && 32 === platformOsArchitecture) {
				downloadAppImgSrc = "./libs/products/img/download_linux_app_144x52.svg";
				downloadAppLinkHref = "https://github.com/englishextra/englishextra-app/releases/download/v1.0.0/englishextra-linux-ia32.tar.gz";
			} else {
				if (platformOsFamily.indexOf("Android", 0) !== -1) {
					downloadAppImgSrc = "./libs/products/img/download_android_app_144x52.svg";
					downloadAppLinkHref = "https://github.com/englishextra/englishextra-app/releases/download/v1.0.0/englishextra-debug.apk";
				}
			}
			if (downloadAppImgSrc && downloadAppLinkHref) {
				downloadAppLink[href] = downloadAppLinkHref;
				downloadAppLink.rel = "noopener";
				downloadAppLink.target = "_blank";
				downloadAppLink[title] = "Скачать приложение";
				if (!supportsSvgAsImg) {
					downloadAppImgSrc = [downloadAppImgSrc.slice(0, -3), "png"].join("");
				}
				downloadAppImg[src] = downloadAppImgSrc;
				timerhowDownloadApp = setTimeout(showDownloadApp, 1000);
			}
		}

		var scene = document[getElementById]("scene") || "";
		var parallax;
		if (scene && root.Parallax) {
			parallax = new Parallax(scene);
		}

		var bounceInUpClass = "bounceInUp";
		var bounceOutDownClass = "bounceOutDown";

		var guesture = document[getElementsByClassName]("guesture")[0] || "";

		var start = document[getElementsByClassName]("start")[0] || "";
		var hand = document[getElementsByClassName]("hand")[0] || "";

		var revealStart = function () {
			if (start) {
				start[classList].remove(bounceOutDownClass);
				start[classList].add(bounceInUpClass);
				start[style].display = "block";
			}
			if (hand) {
				hand[classList].remove(bounceOutDownClass);
				hand[classList].add(bounceInUpClass);
				hand[style].display = "block";
			}
			if (guesture) {
				guesture[classList].add(bounceOutUpClass);
			}
		};

		var concealStart = function () {
			if (start) {
				start[classList].remove(bounceInUpClass);
				start[classList].add(bounceOutDownClass);
			}
			if (hand) {
				hand[classList].remove(bounceInUpClass);
				hand[classList].add(bounceOutDownClass);
			}
			var timerHideStart;
			var hideStart = function () {
				clearTimeout(timerHideStart);
				timerHideStart = null;
				start[style].display = "none";
				hand[style].display = "none";
			};
			timerHideStart = setTimeout(hideStart, 1000);
		};

		var mousewheeldown = document[getElementsByClassName]("mousewheeldown")[0] || "";
		var swipeup = document[getElementsByClassName]("swipeup")[0] || "";
		if (mousewheeldown && swipeup) {
			if (hasTouch) {
				mousewheeldown[style].display = "none";
				if (root.tocca) {
					root[_addEventListener]("swipeup", revealStart, { passive: true });
					root[_addEventListener]("swipedown", concealStart, { passive: true });
				}
			} else {
				if (hasWheel) {
					swipeup[style].display = "none";
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
				guesture[classList].add(bounceInUpClass);
				guesture[style].display = "block";
			}
		}

		var scriptIsLoaded = function (scriptSrc) {
			var scriptAll, i, l;
			for (scriptAll = document[getElementsByTagName]("script") || "", i = 0, l = scriptAll[_length]; i < l; i += 1) {
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
				var k, n;
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
									apiId: vkLike[dataset].apiid || "",
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

		if (btnLike && btnLikeLink && vkLike) {
			btnLikeLink[_addEventListener]("click", showVkLike);
		}
	};

	var scripts = [forcedHTTP + "://cdnjs.cloudflare.com/ajax/libs/github-fork-ribbon-css/0.2.2/gh-fork-ribbon.min.css", "./libs/john-locke/css/bundle.min.css"];

	var supportsPassive = function () {
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
	}();

	var needsPolyfills = function () {
		return !supportsPassive || !root.requestAnimationFrame || !root.matchMedia || "undefined" === typeof root.Element && !("dataset" in docElem) || !("classList" in document[createElement]("_")) || document[createElementNS] && !("classList" in document[createElementNS]("http://www.w3.org/2000/svg", "g")) ||
		/* !document.importNode || */
		/* !("content" in document[createElement]("template")) || */
		root.attachEvent && !root[_addEventListener] || !("onhashchange" in root) || !Array.prototype.indexOf || !root.Promise || !root.fetch || !document[querySelectorAll] || !document[querySelector] || !Function.prototype.bind || Object[defineProperty] && Object[getOwnPropertyDescriptor] && Object[getOwnPropertyDescriptor](Element.prototype, "textContent") && !Object[getOwnPropertyDescriptor](Element.prototype, "textContent").get || !("undefined" !== typeof root.localStorage && "undefined" !== typeof root.sessionStorage) || !root.WeakMap || !root.MutationObserver;
	}();

	if (needsPolyfills) {
		scripts.push("../../cdn/polyfills/js/polyfills.fixed.min.js");
	}

	/* scripts.push(forcedHTTP + "://cdn.jsdelivr.net/npm/platform@1.3.4/platform.min.js",
 	forcedHTTP + "://cdn.jsdelivr.net/npm/qrjs2@0.1.6/qrjs2.min.js",
 	forcedHTTP + "://cdn.jsdelivr.net/npm/parallax-js@3.1.0/dist/parallax.min.js");
 	if (hasTouch) {
 	scripts.push(forcedHTTP + "://cdn.jsdelivr.net/npm/tocca@2.0.1/Tocca.min.js");
 } else {
 	if (hasWheel) {
 		scripts.push("./cdn/wheel-indicator/1.1.4/js/wheel-indicator.fixed.min.js");
 	}
 } */

	scripts.push("./libs/john-locke/js/vendors.min.js");

	/*!
  * load scripts after webfonts loaded using doesFontExist
  */

	var onFontsLoadedCallback = function () {

		var slot;
		var onFontsLoaded = function () {
			clearInterval(slot);
			slot = null;

			if (!supportsSvgSmilAnimation) {
				progressBar.increase(20);
			}

			var load;
			load = new loadJsCss(scripts, run);
		};

		var checkFontIsLoaded = function () {
			/*!
    * check only for fonts that are used in current page
    */
			if (doesFontExist("Roboto") && doesFontExist("Roboto Condensed") && doesFontExist("PT Serif")) {
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

	loadCSS(forcedHTTP + "://fonts.googleapis.com/css?family=PT+Serif:400%7CRoboto:400,700%7CRoboto+Condensed:700&subset=cyrillic", onFontsLoadedCallback);

	/*!
  * load scripts after webfonts loaded using webfontloader
  */

	/* root.WebFontConfig = {
 	google: {
 		families: [
 			"PT Serif:400:cyrillic",
 			"Roboto:400,700:cyrillic",
 			"Roboto Condensed:700:cyrillic"
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
 		if (!supportsSvgSmilAnimation) {
 			progressBar.increase(20);
 		}
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

//# sourceMappingURL=bundle.js.map