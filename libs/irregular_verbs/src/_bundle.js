/*jslint browser: true */

/*jslint node: true */

/*global addClass, addListener, ajaxGet, appendFragment, debounce,
doesFontExist, earlySvgSupport, earlySvgasimgSupport, earlyHasTouch,
earlyDeviceType, earlyDeviceFormfactor, DoSlide, getByClass, getHumanDate,
hasClass, isNodejs, isElectron, isNwjs, loadDeferred, loadJsCss,
manageExternalLinkAll, needsPolyfills, openDeviceBrowser, parseLink,
prependFragment, QRCode, removeChildren, removeClass, require,
setDisplayBlock, setDisplayNone, supportsCanvas, supportsPassive,
supportsSvgSmilAnimation, toggleClass, ToProgress, unescape, VK, Ya*/

/*property console, split */

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
	 * setDisplayBlock
	 */
	root.setDisplayBlock = function (elem) {
		return elem && (elem.style.display = "block");
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
	 * prependFragment
	 */
	root.prependFragment = function (loco, car) {
		if (loco && car) {
			var parent = car.parentNode || "";
			if (parent) {
				var fragment = document.createDocumentFragment();
				if ("string" === typeof loco) {
					loco = document.createTextNode(loco);
				}
				fragment.appendChild(loco);
				parent.insertBefore(fragment, car);
			}
		}
	};

	/*!
	 * appendFragment
	 */
	root.appendFragment = function (car, loco) {
		if (car && loco) {
			var fragment = document.createDocumentFragment() || "";
			if ("string" === typeof car) {
				car = document.createTextNode(car);
			}
			fragment.appendChild(car);
			loco.appendChild(fragment);
		}
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
	 * removeChildren
	 */
	root.removeChildren = function (elem) {
		if (elem && elem.firstChild) {
			for (; elem.firstChild; ) {
				elem.removeChild(elem.firstChild);
			}
		}
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

	/*!
	 * early utility classes
	 */
	root.earlyDeviceFormfactor = (function (selectors) {
		var orientation;
		var size;
		var addClasses = function (e) {
			var classesList = e.split(" ");
			if (selectors) {
				var i;
				for (i = 0; i < classesList.length; i += 1) {
					e = classesList[i];
					selectors.add(e);
				}
				i = null;
			}
		};
		var removeClasses = function (e) {
			var classesList = e.split(" ");
			if (selectors) {
				var i;
				for (i = 0; i < classesList.length; i += 1) {
					e = classesList[i];
					selectors.remove(e);
				}
				i = null;
			}
		};
		var orientationMq = {
			landscape: "all and (orientation:landscape)",
			portrait: "all and (orientation:portrait)"
		};
		var sizeMq = {
			small: "all and (max-width:768px)",
			medium: "all and (min-width:768px) and (max-width:991px)",
			large: "all and (min-width:992px)"
		};
		var matchMedia = "matchMedia";
		var matches = "matches";
		var toggleOrientationClasses = function (mqList, classText) {
			var handleMq = function (mqList) {
				if (mqList[matches]) {
					addClasses(classText);
					orientation = classText;
				} else {
					removeClasses(classText);
				}
			};
			handleMq(mqList);
			mqList.addListener(handleMq);
		};
		var toggleSizeClasses = function (mqList, classText) {
			var handleMq = function (mqList) {
				if (mqList[matches]) {
					addClasses(classText);
					size = classText;
				} else {
					removeClasses(classText);
				}
			};
			handleMq(mqList);
			mqList.addListener(handleMq);
		};
		var key;
		for (key in orientationMq) {
			if (orientationMq.hasOwnProperty(key)) {
				toggleOrientationClasses(root[matchMedia](orientationMq[key]), key);
			}
		}
		for (key in sizeMq) {
			if (sizeMq.hasOwnProperty(key)) {
				toggleSizeClasses(root[matchMedia](sizeMq[key]), key);
			}
		}
		key = null;
		return {
			orientation: orientation || "",
			size: size || ""
		};
	})(document.documentElement.classList || "");

	root.earlyDeviceType = (function (mobile, desktop, opera) {
		var selector = (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i).test(opera) ||
			(/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i).test(opera.substr(0, 4)) ?
			mobile :
			desktop;
		addClass(document.documentElement, selector);
		return selector;
	})("mobile", "desktop", navigator.userAgent || navigator.vendor || (root).opera);

	root.earlySvgSupport = (function (selector) {
		selector = document.implementation.hasFeature("http://www.w3.org/2000/svg", "1.1") ? selector : "no-" + selector;
		addClass(document.documentElement, selector);
		return selector;
	})("svg");

	root.earlySvgasimgSupport = (function (selector) {
		selector = document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image", "1.1") ? selector : "no-" + selector;
		addClass(document.documentElement, selector);
		return selector;
	})("svgasimg");

	root.earlyHasTouch = (function (selector) {
		selector = "ontouchstart" in document.documentElement ? selector : "no-" + selector;
		addClass(document.documentElement, selector);
		return selector;
	})("touch");
})("undefined" !== typeof window ? window : this, document);

/*!
 * app logic
 */
(function (root, document) {
	"use strict";

	var docElem = document.documentElement || "";

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
		var isSocialClass = "is-social";

		removeClass(docElem, "no-js");
		addClass(docElem, "js");

		progressBar.increase(20);

		var userBrowser = " [" +
			(getHumanDate ? getHumanDate : "") +
			(earlyDeviceType ? " " + earlyDeviceType : "") +
			(earlyDeviceFormfactor.orientation ? " " + earlyDeviceFormfactor.orientation : "") +
			(earlyDeviceFormfactor.size ? " " + earlyDeviceFormfactor.size : "") +
			(earlySvgSupport ? " " + earlySvgSupport : "") +
			(earlySvgasimgSupport ? " " + earlySvgasimgSupport : "") +
			(earlyHasTouch ? " " + earlyHasTouch : "") +
			"]";

		if (document.title) {
			document.title = document.title + userBrowser;
		}

		manageExternalLinkAll();

		var hideUiBtnsInFullScreen = function () {
			var cdPrev = getByClass(document, "cd-prev")[0] || "";
			var cdNext = getByClass(document, "cd-next")[0] || "";
			var btnNavMenu = getByClass(document, "btn-nav-menu")[0] || "";
			var btnMenuMore = getByClass(document, "btn-menu-more")[0] || "";
			var btnShowVKLike = getByClass(document, "btn-show-vk-like")[0] || "";
			var btnShareButtons = getByClass(document, "btn-share-buttons")[0] || "";
			var btnUiTotop = getByClass(document, "btn-totop")[0] || "";
			var holderSearchForm = getByClass(document, "holder-search-form")[0] || "";
			var f = false;
			if (!f) {
				f = true;
				/*!
				 * Detecting if a browser is in full screen mode
				 * @see {@link https://stackoverflow.com/questions/2863351/checking-if-browser-is-in-fullscreen}
				 * @see {@link https://stackoverflow.com/questions/1047319/detecting-if-a-browser-is-in-full-screen-mode}
				 */
				var args = [cdPrev, cdNext, btnNavMenu, btnMenuMore, btnShareButtons, btnUiTotop, holderSearchForm];
				if ((root.navigator.standalone) ||
					(screen.height === root.outerHeight) ||
					(root.fullScreen) ||
					(root.innerWidth === screen.width && root.innerHeight === screen.height)) {
					var i,
					l;
					for (i = 0, l = args.length; i < l; i += 1) {
						setDisplayNone(args[i]);
					}
					i = l = null;
					setDisplayNone(btnShowVKLike);
				} else {
					var j,
					m;
					for (j = 0, m = args.length; j < m; j += 1) {
						setDisplayBlock(args[j]);
					}
					j = m = null;
					if (!(root.VK && VK.init && VK.Widgets && VK.Widgets.Like)) {
						setDisplayBlock(btnShowVKLike);
					}
				}
			}
		};
		var resizeHideUiBtnsInFullScreen = function () {
			if ("undefined" !== typeof earlyDeviceType && "desktop" === earlyDeviceType) {
				hideUiBtnsInFullScreen();
				addListener(root, "resize", hideUiBtnsInFullScreen);
			}
		};
		resizeHideUiBtnsInFullScreen();

		var initDoSlide = function () {
			var dsContainerSelector = ".ds-container";
			var dsContainer = getByClass(document, "ds-container")[0] || "";
			var cdPrev = getByClass(document, "cd-prev")[0] || "";
			var cdNext = getByClass(document, "cd-next")[0] || "";
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
				/*!
				 * dont JSMin line below: Notepad++ will freeze
				 * comment out if you dont want slide autorotation
				 */
				slide.onChanged(slideTimer).do(slideTimer);
				/*!
				 * init next button if no slide autorotation
				 */
				setDisplayBlock(cdPrev);
				setDisplayBlock(cdNext);
				addListener(cdPrev, "click", handleCdPrev);
				addListener(cdNext, "click", handleCdNext);
			};
			if (root.DoSlide && dsContainer && cdPrev && cdNext) {
				initScript();
			}
		};
		initDoSlide();

		var manageLocationQrcode = function () {
			var holder = getByClass(document, "holder-location-qrcode")[0] || "";
			var locHref = root.location.href || "";
			var initScript = function () {
				var locHref = root.location.href || "";
				var img = document.createElement("img");
				var imgTitle = document.title ? ("Ссылка на страницу «" + document.title.replace(/\[[^\]]*?\]/g, "").trim() + "»") : "";
				var imgSrc = "https://chart.googleapis.com/chart?cht=qr&chld=M%7C4&choe=UTF-8&chs=512x512&chl=" + encodeURIComponent(locHref);
				img.alt = imgTitle;
				if (root.QRCode) {
					if ("undefined" !== typeof earlySvgSupport && "svg" === earlySvgSupport) {
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
						img.src = imgSrc;
					} else {
						imgSrc = QRCode.generatePNG(locHref, {
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
				addClass(img, "qr-code-img");
				img.title = imgTitle;
				removeChildren(holder);
				appendFragment(img, holder);
			};
			if (root.QRCode && holder && locHref && root.getHttp) {
				initScript();
			}
		};
		manageLocationQrcode();

		var manageMenuMore = function () {
			var container = document.getElementById("container") || "";
			var page = document.getElementById("page") || "";
			var holder = getByClass(document, "holder-panel-menu-more")[0] || "";
			var btn = getByClass(document, "btn-menu-more")[0] || "";
			var panel = getByClass(document, "panel-menu-more")[0] || "";
			var panelItems = panel ? panel.getElementsByTagName("li") || "" : "";
			var panelNavMenu = getByClass(document, "panel-nav-menu")[0] || "";
			var handleItem = function () {
				removeClass(page, isActiveClass);
				removeClass(holder, isActiveClass);
				if (panelNavMenu && hasClass(panelNavMenu, isActiveClass)) {
					removeClass(panelNavMenu, isActiveClass);
				}
			};
			var addContainerHandler = function () {
				addListener(container, "click", handleItem);
			};
			var addBtnHandler = function () {
				var handlebtn = function (ev) {
					ev.stopPropagation();
					ev.preventDefault();
					toggleClass(holder, isActiveClass);
				};
				addListener(btn, "click", handlebtn);
			};
			var addItemHandlerAll = function () {
				var addItemHandler = function (e) {
					addListener(e, "click", handleItem);
				};
				var i,
				l;
				for (i = 0, l = panelItems.length; i < l; i += 1) {
					addItemHandler(panelItems[i]);
				}
				i = l = null;
			};
			if (page &&
				container &&
				holder &&
				btn &&
				panel &&
				panelItems) {
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
		manageMenuMore();

		var showMenuMore = function () {
			var holder = getByClass(document, "holder-panel-menu-more")[0] || "";
			if (holder) {
				var timer = setTimeout(function () {
					clearTimeout(timer);
					timer = null;
					addClass(holder, isActiveClass);
				}, 2000);
			}
		};
		showMenuMore();

		var addUpdateAppLink = function () {
			var panel = getByClass(document, "panel-menu-more")[0] || "";
			var items = panel ? panel.getElementsByTagName("li") || "" : "";
			var navUA = navigator.userAgent || "";
			var linkHref;
			if (/Windows/i.test(navUA) && /(WOW64|Win64)/i.test(navUA)) {
				linkHref = "https://github.com/englishextra/englishextra-app/releases/download/v1.0.0/englishextra-win32-x64-setup.exe";
			} else if (/(x86_64|x86-64|x64;|amd64|AMD64|x64_64)/i.test(navUA) && /(Linux|X11)/i.test(navUA)) {
				linkHref = "https://github.com/englishextra/englishextra-app/releases/download/v1.0.0/englishextra-linux-x64.tar.gz";
			} else if (/IEMobile/i.test(navUA)) {
				linkHref = "https://github.com/englishextra/englishextra-app/releases/download/v1.0.0/englishextra.Windows10_x86_debug.appx";
			} else {
				if (/Android/i.test(navUA)) {
					linkHref = "https://github.com/englishextra/englishextra-app/releases/download/v1.0.0/englishextra-debug.apk";
				}
			}
			var	arrange = function () {
				var listItem = document.createElement("li");
				var link = document.createElement("a");
				var linkText = "Скачать приложение сайта";
				link.title = "" + (parseLink(linkHref).hostname || "") + " откроется в новой вкладке";
				link.href = linkHref;
				var handle = function (url, ev) {
					ev.stopPropagation();
					ev.preventDefault();
					var logic = function () {
						openDeviceBrowser(url);
					};
					debounce(logic, 200).call(root);
				};
				if (root.getHttp) {
					link.target = "_blank";
					link.setAttribute("rel", "noopener noreferrer");
				} else {
					addListener(link, "click", handle.bind(null, linkHref));
				}
				link.appendChild(document.createTextNode("" + linkText));
				listItem.appendChild(link);
				if (panel.hasChildNodes()) {
					prependFragment(listItem, panel.firstChild);
				}
			};
			if (panel && items && linkHref) {
				arrange();
			}
		};
		addUpdateAppLink();

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

		hideProgressBar();
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
		scripts.push("../../cdn/polyfills/js/polyfills.fixed.min.js");
	}

	scripts.push("../../libs/irregular_verbs/js/vendors.min.js");

	var bodyFontFamily = "Roboto";

	var urlArray = ["../../libs/irregular_verbs/css/bundle.min.css"];

	loadDeferred(urlArray, onFontReady.bind(null, bodyFontFamily, scripts, false));
})("undefined" !== typeof window ? window : this, document);
