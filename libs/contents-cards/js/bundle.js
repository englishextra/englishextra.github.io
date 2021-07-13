/*jslint browser: true */

/*jslint node: true */

/*global ActiveXObject, addClass, addListener, ajaxGet, dataSrcImgClass,
debounce, doesFontExist, getByClass, getHumanDate, hasClass, hasTouch,
hasWheel, insertFromTemplate, embedHtmlFragment, isNodejs, isElectron, isNwjs,
LazyLoad, loadDeferred, loadJsCss, manageDataSrcImgAll, manageExternalLinkAll,
Minigrid, Mustache, needsPolyfills, openDeviceBrowser, parseLink, platform,
Promise, removeClass, removeListener, renderTemplate, safelyParseJson,
scroll2Top, setDisplayNone, setVisible, supportsCanvas, supportsPassive,
supportsSvgSmilAnimation, t, throttle, toggleClass, ToProgress, VK,
WheelIndicator, Ya*/

/*property console, join, split */

(function (root, document) {
	"use strict";

	/*!
	 * safe way to handle console.log
	 * @see {@link https://github.com/paulmillr/console-polyfill}
	 */
	(function () {
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
			"show,table,time,timeEnd,timeline,timelineEnd,timeStamp,trace,warn"
		];
		methods.join("").split(",");
		for (;(prop = properties.pop());) {
			if (!con[prop]) {
				con[prop] = {};
			}
		}
		for (;(method = methods.pop());) {
			if (!con[method]) {
				con[method] = dummy;
			}
		}
		prop = method = dummy = properties = methods = null;
	})();

	/*!
	 * supportsPassive
	 */
	root.supportsPassive = (function () {
		var support = false;
		try {
			var options = Object.defineProperty && Object.defineProperty({}, "passive", {
				get: function() {
					support = true;
				}
			});
			root.addEventListener("test", function () {}, options);
		} catch (err) {}
		return support;
	})();

	/*!
	 * supportsSvgSmilAnimation
	 */
	root.supportsSvgSmilAnimation = (function () {
		var fn = {}.toString;
		return !!document.createElementNS &&
		(/SVGAnimate/).test(fn.call(document.createElementNS("http://www.w3.org/2000/svg", "animate"))) || "";
	})();

	/*!
	 * supportsCanvas
	 */
	root.supportsCanvas = (function () {
		var canvas = document.createElement("canvas");
		return !!(canvas.getContext && canvas.getContext("2d"));
	})();

	/*!
	 * hasWheel
	 */
	root.hasWheel = "onwheel" in document.createElement("div") || void 0 !== document.onmousewheel || "";

	/*!
	 * hasTouch
	 */
	root.hasTouch = "ontouchstart" in document.documentElement || "";

	/*!
	 * needsPolyfills
	 */
	root.needsPolyfills = (function () {
		return !String.prototype.startsWith ||
		!supportsPassive ||
		!root.requestAnimationFrame ||
		!root.matchMedia ||
		("undefined" === typeof root.Element && !("dataset" in document.documentElement)) ||
		!("classList" in document.createElement("_")) ||
		(document.createElementNS && !("classList" in document.createElementNS("http://www.w3.org/2000/svg", "g"))) ||
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

	/*!
	 * getHumanDate
	 */
	root.getHumanDate = (function () {
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
		return "".concat(newYear, "-", newMonth, "-", newDay);
	})();

	/*!
	 * Super-simple wrapper around addEventListener and attachEvent (old IE).
	 * Does not handle differences in the Event-objects.
	 * @see {@link https://github.com/finn-no/eventlistener}
	 */
	(function () {
		var setListener = function (standard, fallback) {
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
		root.addListener = setListener("addEventListener", "attachEvent");
		root.removeListener = setListener("removeEventListener", "detachEvent");
	})();

	/*!
	 * get elements by class name wrapper
	 */
	root.getByClass = function (parent, name) {
		if (!document.getElementsByClassName) {
			var children = (parent || document.body).getElementsByTagName("*"),
			elements = [],
			regx = new RegExp("\\b" + name + "\\b"),
				child;
			var i,
				l;
			for (i = 0, l = children.length; i < l; i += 1) {
				child = children[i];
				if (regx.test(child.className)) {
					elements.push(child);
				}
			}
			i = l = null;
			return elements;
		} else {
			return parent ? parent.getElementsByClassName(name) : "";
		}
	};

	/*!
	 * class list wrapper
	 */
	(function () {
		var hasClass;
		var addClass;
		var removeClass;
		if ("classList" in document.documentElement) {
			hasClass = function (el, name) {
				return el.classList.contains(name);
			};
			addClass = function (el, name) {
				el.classList.add(name);
			};
			removeClass = function (el, name) {
				el.classList.remove(name);
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
		root.hasClass = hasClass;
		root.addClass = addClass;
		root.removeClass = removeClass;
		root.toggleClass = function (el, name) {
			if (hasClass(el, name)) {
				removeClass(el, name);
			} else {
				addClass(el, name);
			}
		};
	})();

	/*!
	 * parseLink
	 */

	/*jshint bitwise: false */
	root.parseLink = function (url, full) {
		var _full = full || "";
		var _url = encodeURI(url);
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
			var _origin = function () {
				var c = document.createElement("a");
				c.href = _url;
				var o = c.protocol + "//" + c.hostname + (c.port ? ":" + c.port : "");
				return o || "";
			};
			var _isCrossDomain = function () {
				var _locationHref = window.location || "";
				var v = _locationHref.protocol + "//" + _locationHref.hostname + (_locationHref.port ? ":" + _locationHref.port : "");
				return v !== _origin();
			};
			var _link = document.createElement("a");
			_link.href = _url;
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

	/*!
	 * getHttp
	 */
	root.getHttp = (function () {
		var prot = root.location.protocol || "";
		return "http:" === prot ? "http" : "https:" === prot ? "https" : "";
	})();

	/*!
	 * throttle
	 */
	root.throttle = function (func, wait) {
		var context;
		var args;
		var fn;
		var timer;
		var last = 0;
		function call() {
			timer = 0;
			last = +new Date();
			fn = func.apply(context, args);
			context = null;
			args = null;
		}
		return function throttled() {
			context = this;
			args = arguments;
			var delta = new Date() - last;
			if (!timer) {
				if (delta >= wait) {
					call();
				} else {
					timer = setTimeout(call, wait - delta);
				}
			}
			return fn;
		};
	};

	/*!
	 * debounce
	 */
	root.debounce = function (func, wait) {
		var timer;
		var args;
		var context;
		var timestamp;
		return function debounced() {
			context = this;
			args = [].slice.call(arguments, 0);
			timestamp = new Date();
			var later = function () {
				var last = (new Date()) - timestamp;
				if (last < wait) {
					timer = setTimeout(later, wait - last);
				} else {
					timer = null;
					func.apply(context, args);
				}
			};
			if (!timer) {
				timer = setTimeout(later, wait);
			}
		};
	};

	/*!
	 * isNodejs isElectron isNwjs;
	 */
	root.isNodejs = "undefined" !== typeof process && "undefined" !== typeof require || "";
	root.isElectron = (function () {
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
	root.isNwjs = (function () {
		if ("undefined" !== typeof isNodejs && isNodejs) {
			try {
				if ("undefined" !== typeof require("nw.gui")) {
					return true;
				}
			} catch (err) {
				return false;
			}
		}
		return false;
	})();

	/*!
	 * openDeviceBrowser
	 */
	root.openDeviceBrowser = function (url) {
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
			if (root.getHttp) {
				return true;
			} else {
				onLocal();
			}
		}
	};

	/*!
	 * scroll2Top
	 */
	root.scroll2Top = function (scrollTargetY, speed, easing) {
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

	/*!
	 * setDisplayNone
	 */
	root.setDisplayNone = function (elem) {
		return elem && (elem.style.display = "none");
	};

	/*!
	 * setVisible
	 */
	root.setVisible = function (elem) {
		return elem && (elem.style.visibility = "visible", elem.style.opacity = 1);
	};

	/*!
	 * removeElement
	 */
	root.removeElement = function (elem) {
		if (elem) {
			if ("undefined" !== typeof elem.remove) {
				return elem.remove();
			} else {
				return elem.parentNode && elem.parentNode.removeChild(elem);
			}
		}
	};

	/*!
	 * safelyParseJson
	 */
	root.safelyParseJson = function (response) {
		var isObj = function (obj) {
			var objType = typeof obj;
			return ["boolean", "number", "string", 'symbol', "function"].indexOf(objType) === -1;
		};
		if (!isObj(response)) {
			return JSON.parse(response);
		} else {
			return response;
		}
	};

	/*!
	 * embedHtmlFragment
	 */
	root.embedHtmlFragment = function (textHtml, render, callback, useInnerHtml) {
		var _useInnerHtml = useInnerHtml || "";
		try {
			if (_useInnerHtml) {
				render.innerHTML = textHtml;
			} else {
				if (render.parentNode) {
					var cloned = render.cloneNode(false);
					if (document.createRange) {
						var range = document.createRange();
						range.selectNode(document.body);
						var fragment = range.createContextualFragment(textHtml);
						cloned.appendChild(fragment);
						render.parentNode.replaceChild(cloned, render);
					} else {
						cloned.innerHTML = textHtml;
						render.parentNode.replaceChild(document.createDocumentFragment.appendChild(cloned), render);
					}
				}
			}
			return callback && "function" === typeof callback && callback();
		} catch (err) {
			console.log(err);
		}
	};

	/*!
	 * renderTemplate
	 */
	root.renderTemplate = function (jsonObject, templateId) {
		var template = document.getElementById(templateId.replace(/^#/, "")) || "";
		var _jsonObject = safelyParseJson(jsonObject);
		if (_jsonObject && template) {
			var textHtml = template.innerHTML || "";
			if (root.t) {
				var parsedTemplate = new t(textHtml);
				return parsedTemplate.render(_jsonObject);
			} else {
				if (root.Mustache) {
					Mustache.parse(textHtml);
					return Mustache.render(textHtml, _jsonObject);
				}
			}
		}
		return "cannot renderTemplate";
	};

	/*!
	 * insertFromTemplate
	 */
	root.insertFromTemplate = function (jsonObject, templateId, renderId, callback, useInnerHtml) {
		var _callback = function () {
			return callback && "function" === typeof callback && callback();
		};
		var _useInnerHtml = useInnerHtml || "";
		var template = document.getElementById(templateId.replace(/^#/, "")) || "";
		var render = document.getElementById(renderId.replace(/^#/, "")) || "";
		if (jsonObject && template && render) {
			var textHtml = renderTemplate(jsonObject, templateId);
			embedHtmlFragment(textHtml, render, _callback, _useInnerHtml);
		}
	};

	/*!
	 * ajaxGet
	 * accepts external url and returns text response
	 */
	root.ajaxGet = function (url, options) {
		var _options = options || {};
		var success = _options.hasOwnProperty("success") ? _options.success : "";
		var failure = _options.hasOwnProperty("failure") ? _options.failure : "";
		var x = root.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
		if(_options.hasOwnProperty("overrideMimeType")) {
			x.overrideMimeType(_options.overrideMimeType);
		}
		x.open("GET", url, true);
		x.setRequestHeader("X-Requested-With", "XMLHttpRequest");
		x.withCredentials = _options.hasOwnProperty("withCredentials");
		x.addEventListener("readystatechange", function () {
			if (x.status === 404 || x.status === 0) {
				return failure && "function" === typeof failure && failure(x.status);
			} else if (x.readyState === 4 && x.status === 200 && x.responseText) {
				return success && "function" === typeof success && success(x.responseText);
			}
		}, false);
		x.send(null);
	};

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
	root.ToProgress = (function () {
		var TP = function () {
			var whichTransitionEvent = function () {
				var el = document.createElement("fakeelement");
				var transitions = {
					"transition": "transitionend",
					"OTransition": "oTransitionEnd",
					"MozTransition": "transitionend",
					"WebkitTransition": "webkitTransitionEnd"
				};
				var t;
				for (t in transitions) {
					if (transitions.hasOwnProperty(t)) {
						if (el.style[t] !== undefined) {
							return transitions[t];
						}
					}
				}
				t = null;
			};
			var transitionEvent = whichTransitionEvent();
			var ToProgress = function (opt, selector) {
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
						if (opt.hasOwnProperty(key)) {
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
						if (style.hasOwnProperty(property)) {
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
						el = document.getElementById(selector) || "";
					} else {
						if (selector.indexOf(".", 0) !== -1) {
							el = document.getElementsByClassName(selector)[0] || "";
						}
					}
					if (el) {
						if (el.hasChildNodes()) {
							el.insertBefore(this.progressBar, el.firstChild);
						} else {
							el.appendChild(this.progressBar);
						}
					}
				} else {
					document.body.appendChild(this.progressBar);
				}
			};
			ToProgress.prototype.transit = function () {
				this.progressBar.style.width = this.progress + "%";
			};
			ToProgress.prototype.getProgress = function () {
				return this.progress;
			};
			ToProgress.prototype.setProgress = function (progress, callback) {
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
			ToProgress.prototype.increase = function (toBeIncreasedProgress, callback) {
				this.show();
				this.setProgress(this.progress + toBeIncreasedProgress, callback);
			};
			ToProgress.prototype.decrease = function (toBeDecreasedProgress, callback) {
				this.show();
				this.setProgress(this.progress - toBeDecreasedProgress, callback);
			};
			ToProgress.prototype.finish = function (callback) {
				var that = this;
				this.setProgress(100, callback);
				this.hide();
				if (transitionEvent) {
					this.progressBar.addEventListener(transitionEvent, function (e) {
						that.reset();
						that.progressBar.removeEventListener(e.type, TP);
					});
				}
			};
			ToProgress.prototype.reset = function (callback) {
				this.progress = 0;
				this.transit();
				if (callback) {
					callback();
				}
			};
			ToProgress.prototype.hide = function () {
				this.progressBar.style.opacity = "0";
			};
			ToProgress.prototype.show = function () {
				this.progressBar.style.opacity = "1";
			};
			return ToProgress;
		};
		return TP();
	})();

	/*!
	 * manageExternalLinkAll
	 */
	root.manageExternalLinkAll = function () {
		var link = document.getElementsByTagName("a") || "";
		var arrange = function (e) {
			var handle = function (url, ev) {
				ev.stopPropagation();
				ev.preventDefault();
				var logic = function () {
					openDeviceBrowser(url);
				};
				debounce(logic, 200).call(root);
			};
			var externalLinkIsBindedClass = "external-link--is-binded";
			if (!hasClass(e, externalLinkIsBindedClass)) {
				var url = e.getAttribute("href") || "";
				if (url && parseLink(url).isCrossDomain && parseLink(url).hasHTTP) {
					e.title = "" + (parseLink(url).hostname || "") + " откроется в новой вкладке";
					if (root.getHttp) {
						e.target = "_blank";
						e.setAttribute("rel", "noopener noreferrer");
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
			for (i = 0, l = link.length; i < l; i += 1) {
				arrange(link[i]);
			}
			i = l = null;
		}
	};

	/*!
	 * manageDataSrcImgAll
	 * @see {@link https://github.com/verlok/lazyload}
	 */
	root.dataSrcImgClass = "data-src-img";

	root.lazyLoadDataSrcImgInstance = null;
	root.manageDataSrcImgAll = function (callback) {
		var _callback = function () {
			return callback && "function" === typeof callback && callback();
		};
		var isActiveClass = "is-active";
		var dataSrcImgIsBindedClass = "data-src-img--is-binded";
		var images = getByClass(document, dataSrcImgClass) || "";
		var i = images.length;
		while (i--) {
			if (!hasClass(images[i], dataSrcImgIsBindedClass)) {
				addClass(images[i], dataSrcImgIsBindedClass);
				addClass(images[i], isActiveClass);
				addListener(images[i], "load", _callback);
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

	/*!
	 * modified Detect Whether a Font is Installed
	 * @param {String} fontName The name of the font to check
	 * @return {Boolean}
	 * @author Kirupa <sam@samclarke.com>
	 * @see {@link https://www.kirupa.com/html5/detect_whether_font_is_installed.htm}
	 * passes jshint
	 */
	root.doesFontExist = function (fontName) {
		var canvas = document.createElement("canvas");
		var context = canvas.getContext("2d");
		var text = "abcdefghijklmnopqrstuvwxyz0123456789";
		context.font = "72px monospace";
		var baselineSize = context.measureText(text).width;
		context.font = "72px '" + fontName + "', monospace";
		var newSize = context.measureText(text).width;
		canvas = null;
		if (newSize === baselineSize) {
			return false;
		} else {
			return true;
		}
	};

	/*!
	 * modified loadExt
	 * @see {@link https://gist.github.com/englishextra/ff9dc7ab002312568742861cb80865c9}
	 * passes jshint
	 */
	root.loadJsCss = function (files, callback, type) {
		var _this = this;
		_this.files = files;
		_this.js = [];
		_this.head = document.getElementsByTagName("head")[0] || "";
		_this.body = document.body || "";
		_this.ref = document.getElementsByTagName("script")[0] || "";
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
			link.setAttribute("property", "stylesheet");
			/* _this.head.appendChild(link); */
			(_this.body || _this.head).appendChild(link);
		};
		_this.loadScript = function (i) {
			var script = document.createElement("script");
			script.type = "text/javascript";
			script.async = true;
			script.src = _this.js[i];
			var loadNextScript = function () {
				if (++i < _this.js.length) {
					_this.loadScript(i);
				} else {
					_this.callback();
				}
			};
			script.onload = function () {
				loadNextScript();
			};
			_this.head.appendChild(script);
			/* if (_this.ref.parentNode) {
				_this.ref.parentNode[insertBefore](script, _this.ref);
			} else {
				(_this.body || _this.head).appendChild(script);
			} */
			(_this.body || _this.head).appendChild(script);
		};
		var i,
		l;
		for (i = 0, l = _this.files.length; i < l; i += 1) {
			if ((/\.js$|\.js\?/).test(_this.files[i]) || _this.type === "js") {
				_this.js.push(_this.files[i]);
			}
			if ((/\.css$|\.css\?|\/css\?/).test(_this.files[i]) || _this.type === "css") {
				_this.loadStyle(_this.files[i]);
			}
		}
		i = l = null;
		if (_this.js.length > 0) {
			_this.loadScript(0);
		} else {
			_this.callback();
		}
	};

	/*!
	 * loadDeferred
	 */
	root.loadDeferred = function (urlArray, callback) {
		var timer;
		var handle = function () {
			clearTimeout(timer);
			timer = null;
			var load;
			load = new loadJsCss(urlArray, callback);
		};
		var req;
		var raf = function () {
			cancelAnimationFrame(req);
			timer = setTimeout(handle, 0);
		};
		if (root.requestAnimationFrame) {
			req = requestAnimationFrame(raf);
		} else {
			addListener(root, "load", handle);
		}
	};
})("undefined" !== typeof window ? window : this, document);

/*!
 * app logic
 */
(function (root, document) {
	"use strict";

	var docElem = document.documentElement || "";
	var docBody = document.body || "";

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

	if (supportsSvgSmilAnimation) {
		addClass(docElem, "svganimate");
	}

	var run = function () {

		var isActiveClass = "is-active";
		var isFixedClass = "is-fixed";
		var isHiddenClass = "is-hidden";
		var isSocialClass = "is-social";

		removeClass(docElem, "no-js");
		addClass(docElem, "js");

		progressBar.increase(20);

		if (root.platform && document.title && navigator.userAgent) {
			var userBrowserDescription = platform.description || "";
			document.title = document.title +
			" [" +
			(getHumanDate ? " " + getHumanDate : "") +
			(userBrowserDescription ? " " + userBrowserDescription : "") +
			((hasTouch || hasWheel) ? " with" : "") +
			(hasTouch ? " touch" : "") +
			((hasTouch && hasWheel) ? "," : "") +
			(hasWheel ? " mousewheel" : "") +
			"]";
		}

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

		var observeMutations = function (scope) {
			var context = scope && scope.nodeName ? scope : "";
			var mo;
			var getMutations = function (e) {
				var onMutation = function (m) {
					console.log("mutations observer: " + m.type);
					console.log(m.type, "target: " + m.target.tagName + ("." + m.target.className || "#" + m.target.id || ""));
					console.log(m.type, "added: " + m.addedNodes.length + " nodes");
					console.log(m.type, "removed: " + m.removedNodes.length + " nodes");
					if ("childList" === m.type || "subtree" === m.type) {
						mo.disconnect();
						hideProgressBar();
					}
				};
				var i,
				l;
				for (i = 0, l = e.length; i < l; i += 1) {
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

		var minigridClass = "minigrid";

		var minigridIsActiveClass = "minigrid--is-active";

		var minigridItemClass = "minigrid__item";

		var minigridItemIsBindedClass = "minigrid__item--is-binded";

		var minigrid = getByClass(document, minigridClass)[0] || "";

		observeMutations(minigrid);

		manageExternalLinkAll();

		var jsonHrefKeyName = "href";
		var jsonSrcKeyName = "src";
		var jsonTitleKeyName = "title";
		var jsonTextKeyName = "text";
		var jsonWidthKeyName = "width";
		var jsonHeightKeyName = "height";

		var jsonUrl = "./libs/contents-cards/json/contents.json";

		var container = getByClass(document, "container")[0] || "";

		var manageMinigrid = function () {
			var generate = function (responseText) {

				return new Promise(function (resolve, reject) {

					var jsonObject;

					try {
						jsonObject = safelyParseJson(responseText);
						if (!jsonObject.pages[0][jsonHrefKeyName]) {
							throw new Error("incomplete JSON data: no " + jsonHrefKeyName);
						} else if (!jsonObject.pages[0][jsonSrcKeyName]) {
							throw new Error("incomplete JSON data: no " + jsonSrcKeyName);
						} else if (!jsonObject.pages[0][jsonWidthKeyName]) {
							throw new Error("incomplete JSON data: no " + jsonWidthKeyName);
						} else if (!jsonObject.pages[0][jsonHeightKeyName]) {
							throw new Error("incomplete JSON data: no " + jsonHeightKeyName);
						} else if (!jsonObject.pages[0][jsonTitleKeyName]) {
							throw new Error("incomplete JSON data: no " + jsonTitleKeyName);
						} else {
							if (!jsonObject.pages[0][jsonTextKeyName]) {
								throw new Error("incomplete JSON data: no " + jsonTextKeyName);
							}
						}
					} catch (err) {
						console.log("cannot init generate " + err);
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
					var pagesKeysNumber = countObjKeys(jsonObject.pages);
					insertFromTemplate(jsonObject, "template_minigrid", "render_minigrid", function () {
						var macyItems = getByClass(container, minigridItemClass) || "";
						var count = 0;
						var i,
						l;
						for (i = 0, l = macyItems.length; i < l; i += 1) {
							count++;
							if (count === pagesKeysNumber) {
								i = l = null;
								return resolve();
							}
						}
						i = l = null;
						return reject();
					}, true);
				});
			};

			var addCardWrapCssRule = function () {
				var toDashedAll = function (str) {
					return str.replace((/([A-Z])/g), function ($1) {
						return "-" + $1.toLowerCase();
					});
				};
				var docElemStyle = docElem.style;
				var transitionProperty = typeof docElemStyle.transition === "string" ?
					"transition" : "WebkitTransition";
				var transformProperty = typeof docElemStyle.transform === "string" ?
					"transform" : "WebkitTransform";
				var styleSheet = document.styleSheets[0] || "";
				if (styleSheet) {
					var cssRule;
					cssRule = toDashedAll([".",
								minigridItemClass,
								"{",
								transitionProperty,
								": ",
								transformProperty,
								" 0.4s ease-out;",
								"}"].join(""));
					styleSheet.insertRule(cssRule, 0);
				}
			};

			var timerCreate;
			var create = function () {
				clearTimeout(timerCreate);
				timerCreate = null;

				root.minigridInstance = null;

				var updateMinigrid = function () {
					if (root.minigridInstance) {
						var timer = setTimeout(function () {
								clearTimeout(timer);
								timer = null;
								root.minigridInstance.mount();
							}, 100);
					}
				};

				var updateMinigridThrottled = throttle(updateMinigrid, 1000);

				var onMinigridCreated = function () {
					setVisible(minigrid);
					addCardWrapCssRule();
					var minigridItems = getByClass(minigrid, minigridItemClass) || "";
					if (minigridItems) {
						var i,
						l;
						for (i = 0, l = minigridItems.length; i < l; i += 1) {
							if (!hasClass(minigridItems[i], minigridItemIsBindedClass)) {
								addClass(minigridItems[i], minigridItemIsBindedClass);
							}
							if (!hasClass(minigridItems[i], anyResizeEventIsBindedClass)) {
								addClass(minigridItems[i], anyResizeEventIsBindedClass);
								addListener(minigridItems[i], "onresize", updateMinigridThrottled, {passive: true});
							}
						}
						i = l = null;
					}
				};

				var initMinigrid = function () {
					try {
						if (root.minigridInstance) {
							root.minigridInstance = null;
							removeListener(root, "resize", updateMinigridThrottled);
						}
						root.minigridInstance = new Minigrid({
								container: "." + minigridClass,
								item: "." + minigridItemClass,
								gutter: 20
							});
						root.minigridInstance.mount();
						addClass(minigrid, minigridIsActiveClass);
						addListener(root, "resize", updateMinigridThrottled, {passive: true});
						onMinigridCreated();
					} catch (err) {
						throw new Error("cannot init Minigrid " + err);
					}
				};
				initMinigrid();
			};

			var timerLazy;
			var lazy = function () {
				clearTimeout(timerLazy);
				timerLazy = null;
				manageDataSrcImgAll();
			};

			if (root.Minigrid && minigrid) {
				ajaxGet(jsonUrl, {
					overrideMimeType: "application/json;charset=utf-8",
					success: function (responseText) {
						generate(responseText);
						timerCreate = setTimeout(create, 200);
						timerLazy = setTimeout(lazy, 500);
					},
					failure: function (status) {
						throw new Error("Cannot create Minigrid " + status);
					}
				});
			}
		};
		manageMinigrid();

		var hideOtherIsSocial = function (thisObj) {
			var _thisObj = thisObj || this;
			var elem = getByClass(document, isSocialClass) || "";
			if (elem) {
				var i,
				l;
				for (i = 0, l = elem.length; i < l; i += 1) {
					if (_thisObj !== elem[i]) {
						removeClass(elem[i], isActiveClass);
					}
				}
				i = l = null;
			}
		};
		addListener(root, "click", hideOtherIsSocial);

		root.yaShare2Instance = null;
		var manageYaShare2Btn = function () {
			var btn = getByClass(document, "btn-share-buttons")[0] || "";
			var yaShare2Id = "ya-share2";
			var yaShare2 = document.getElementById(yaShare2Id) || "";
			var handleBtn = function (ev) {
				ev.stopPropagation();
				ev.preventDefault();
				var logic = function () {
					toggleClass(yaShare2, isActiveClass);
					hideOtherIsSocial(yaShare2);
					var initScript = function () {
						try {
							if (root.yaShare2Instance) {
								root.yaShare2Instance.updateContent({
									title: document.title || "",
									description: document.title || "",
									url: root.location.href || ""
								});
							} else {
								root.yaShare2Instance = Ya.share2(yaShare2Id, {
									content: {
										title: document.title || "",
										description: document.title || "",
										url: root.location.href || ""
									}
								});
							}
						} catch (err) {
							throw new Error("cannot root.yaShare2Instance.updateContent or Ya.share2 " + err);
						}
					};
					if (!(root.Ya && Ya.share2)) {
						var jsUrl = "https://yastatic.net/share2/share.js";
						var load;
						load = new loadJsCss([jsUrl], initScript);
					} else {
						initScript();
					}
				};
				debounce(logic, 200).call(root);
			};
			if (btn && yaShare2) {
				if (root.getHttp) {
					addListener(btn, "click", handleBtn);
				} else {
					setDisplayNone(btn);
				}
			}
		};
		manageYaShare2Btn();

		root.vkLikeInstance = null;
		var manageVkLikeBtn = function () {
			var vkLikeId = "vk-like";
			var vkLike = document.getElementById(vkLikeId) || "";
			var holderVkLike = getByClass(document, "holder-vk-like")[0] || "";
			var btn = getByClass(document, "btn-show-vk-like")[0] || "";
			var handleBtn = function (ev) {
				ev.stopPropagation();
				ev.preventDefault();
				var logic = function () {
					toggleClass(holderVkLike, isActiveClass);
					hideOtherIsSocial(holderVkLike);
					var initScript = function () {
						if (!root.vkLikeInstance) {
							try {
								VK.init({
									apiId: (vkLike.dataset.apiid || ""),
									nameTransportPath: "/xd_receiver.htm",
									onlyWidgets: true
								});
								VK.Widgets.Like(vkLikeId, {
									type: "button",
									height: 24
								});
								root.vkLikeInstance = true;
							} catch (err) {
								throw new Error("cannot VK.init " + err);
							}
						}
					};
					if (!(root.VK && VK.init && VK.Widgets && VK.Widgets.Like)) {
						var jsUrl = "https://vk.com/js/api/openapi.js?168";
						var load;
						load = new loadJsCss([jsUrl], initScript);
					} else {
						initScript();
					}
				};
				debounce(logic, 200).call(root);
			};
			if (btn && vkLike) {
				if (root.getHttp) {
					addListener(btn, "click", handleBtn);
				} else {
					setDisplayNone(btn);
				}
			}
		};
		manageVkLikeBtn();

		var titleBar = getByClass(document, "title-bar")[0] || "";
		var titleBarHeight = titleBar.offsetHeight || 0;

		/*!
		 * set fixed or hidden class depending on scroll/swipe direction
		 * and titleBar position
		 * needs transition top 0.4s ease out in CSS for .title-bar
		 */
		var hideTitleBar = function () {
			var logic = function () {
				removeClass(titleBar, isFixedClass);
				if ((document.body.scrollTop || docElem.scrollTop || 0) > titleBarHeight) {
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
				if ((document.body.scrollTop || docElem.scrollTop || 0) > titleBarHeight) {
					addClass(titleBar, isFixedClass);
				} else {
					removeClass(titleBar, isFixedClass);
				}
			};
			throttle(logic, 100).call(root);
		};
		var resetTitleBar = function () {
			var logic = function () {
				if ((document.body.scrollTop || docElem.scrollTop || 0) < titleBarHeight) {
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

		var manageTotopBtn = function () {
			var btnClass = "btn-totop";
			var btn = getByClass(document, btnClass)[0] || "";
			var insertUpSvg = function (e) {
				var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
				var use = document.createElementNS("http://www.w3.org/2000/svg", "use");
				svg.setAttribute("class", "ui-icon");
				use.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#ui-icon-Up");
				svg.appendChild(use);
				e.appendChild(svg);
			};
			if (!btn) {
				btn = document.createElement("button");
				addClass(btn, btnClass);
				btn.title = "Наверх";
				insertUpSvg(btn);
				docBody.appendChild(btn);
			}
			var handleBtn = function (ev) {
				ev.stopPropagation();
				ev.preventDefault();
				scroll2Top(0, 20000);
			};
			var handleRoot = function (_this) {
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
				addListener(btn, "click", handleBtn);
				addListener(root, "scroll", handleRoot, {passive: true});
			}
		};
		manageTotopBtn();
	};

	var onFontReady = function (bodyFontFamily, scripts, useCheck) {
		var _useCheck = useCheck || "";
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
		var check = function () {
			if (doesFontExist(bodyFontFamily)) {
				init();
			}
		};
		if (_useCheck && supportsCanvas) {
			slot = setInterval(check, 100);
		} else {
			slot = null;
			init();
		}
	};

	var scripts = [];

	if (needsPolyfills) {
		scripts.push("./cdn/polyfills/js/polyfills.fixed.min.js");
	}

	scripts.push("./libs/contents-cards/js/vendors.min.js");

	var bodyFontFamily = "Roboto";

	var urlArray = ["./libs/contents-cards/css/bundle.min.css"];

	loadDeferred(urlArray, onFontReady.bind(null, bodyFontFamily, scripts, false));
})("undefined" !== typeof window ? window : this, document);
