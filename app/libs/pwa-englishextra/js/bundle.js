/*jslint browser: true */

/*jslint node: true */

/*global ActiveXObject, addClass, addListener, ajaxGet, appendFragment,
Carousel, Cookies, dataSrcIframeClass, dataSrcImgClass, debounce, DISQUS,
doesFontExist, earlySvgSupport, earlySvgasimgSupport, earlyHasTouch,
earlyDeviceType, earlyDeviceFormfactor, findPos, fixEnRuTypo, getByClass,
getHumanDate, GLightbox, hasClass, IframeLightbox, imgLightbox,
insertExternalHtml, insertFromTemplate, embedHtmlFragment, isNodejs,
isElectron, isNwjs, isValidId, Kamil, LazyLoad, loadDeferred, LoadingSpinner,
loadJsCss, manageIframeLightbox, manageGLightbox, manageExpandingLayerAll,
manageSearchInput, manageExternalLinkAll, manageDataSrcImgAll,
manageDataSrcIframeAll, Masonry, Mustache, needsPolyfills, notiBar,
openDeviceBrowser, Packery, parseLink, QRCode, removeChildren, removeClass,
removeListener, renderTemplate, require, safelyParseJson, scroll2Top,
setDisplayBlock, setDisplayNone, supportsCanvas, supportsPassive,
supportsSvgSmilAnimation, t, throttle, toggleClass, ToProgress,
truncateString, unescape, VK, Ya*/

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
	 * findPos
	 */
	root.findPos = function (elem) {
		var _elem = elem.getBoundingClientRect();
		var docElem = document.documentElement || "";
		var docBody = document.body || "";
		return {
			top: Math.round(_elem.top + (root.pageYOffset || docElem.scrollTop || docBody.scrollTop) - (docElem.clientTop || docBody.clientTop || 0)),
			left: Math.round(_elem.left + (root.pageXOffset || docElem.scrollLeft || docBody.scrollLeft) - (docElem.clientLeft || docBody.clientLeft || 0))
		};
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
	 * fixEnRuTypo
	 */
	root.fixEnRuTypo = function (str, left, right) {
		var result = "";
		if ("ru" === left && "en" === right) {
			left = '\u0430\u0431\u0432\u0433\u0434\u0435\u0451\u0436\u0437\u0438\u0439\u043a\u043b\u043c\u043d\u043e\u043f\u0440\u0441\u0442\u0443\u0444\u0445\u0446\u0447\u0448\u0449\u044a\u044c\u044b\u044d\u044e\u044f\u0410\u0411\u0412\u0413\u0414\u0415\u0401\u0416\u0417\u0418\u0419\u041a\u041b\u041c\u041d\u041e\u041f\u0420\u0421\u0422\u0423\u0424\u0425\u0426\u0427\u0428\u0429\u042a\u042c\u042b\u042d\u042e\u042f"\u2116;:?/.,';
			right = "f,dult`;pbqrkvyjghcnea[wxio]ms'.zF<DULT~:PBQRKVYJGHCNEA{WXIO}MS'>Z@#$^&|/?";
		} else {
			left = "f,dult`;pbqrkvyjghcnea[wxio]ms'.zF<DULT~:PBQRKVYJGHCNEA{WXIO}MS'>Z@#$^&|/?";
			right = '\u0430\u0431\u0432\u0433\u0434\u0435\u0451\u0436\u0437\u0438\u0439\u043a\u043b\u043c\u043d\u043e\u043f\u0440\u0441\u0442\u0443\u0444\u0445\u0446\u0447\u0448\u0449\u044a\u044c\u044b\u044d\u044e\u044f\u0410\u0411\u0412\u0413\u0414\u0415\u0401\u0416\u0417\u0418\u0419\u041a\u041b\u041c\u041d\u041e\u041f\u0420\u0421\u0422\u0423\u0424\u0425\u0426\u0427\u0428\u0429\u042a\u042c\u042b\u042d\u042e\u042f"\u2116;:?/.,';
		}
		var i,
		l;
		for (i = 0, l = str.length; i < l; i += 1) {
			var dir = left.indexOf(str.charAt(i));
			if (result > dir) {
				result += str.charAt(i);
			} else {
				result += right.charAt(dir);
			}
		}
		i = l = null;
		return result;
	};

	/*!
	 * truncateString
	 */
	root.truncateString = function (str, max, add) {
		var _add = add || "\u2026";
		return ("string" === typeof str && str.length > max ? str.substring(0, max) + _add : str);
	};

	/*!
	 * isValidId
	 */
	root.isValidId = function (id, withHash) {
		return withHash ? /^\#[A-Za-z][-A-Za-z0-9_:.]*$/.test(id) ? true : false : /^[A-Za-z][-A-Za-z0-9_:.]*$/.test(id) ? true : false;
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
	 * insertExternalHtml
	 * accepts external HTML url
	 * and renders text response as HTML into DOM element
	 */
	root.insertExternalHtml = function (renderId, url, callback, onFailure, useInnerHtml) {
		var _callback = function () {
			return callback && "function" === typeof callback && callback();
		};
		var _useInnerHtml = useInnerHtml || "";
		var render = document.getElementById(renderId.replace(/^#/, "")) || "";
		if (render) {
			ajaxGet(url, {
				overrideMimeType: "text/html;charset=utf-8",
				success: function (responseText) {
					embedHtmlFragment(responseText, render, _callback, _useInnerHtml);
				},
				failure: function (status) {
					return onFailure && "function" === typeof onFailure && onFailure(status);
				}
			});
		}
	};

	/*!
	 * notiBar
	 */
	root.notiBar = function (options) {
		var docBody = document.body || "";
		var notibarClass = "notibar";
		var notibar = getByClass(document, notibarClass)[0] || "";
		var messageClass = "message";
		var closeButtonClass = "close";
		var defaultKey = "_notibar_dismiss_";
		var defaultDatum = "ok";
		var animatedClass = "animated";
		var fadeInDownClass = "fadeInDown";
		var fadeOutUpClass = "fadeOutUp";
		if ("string" === typeof options) {
			options = {
				"message": options
			};
		}
		var defaultOptions = {
			"message": "",
			"timeout": 10000,
			"key": defaultKey,
			"datum": defaultDatum,
			"days": 0
		};
		var _options = options || {};
		var key;
		for (key in defaultOptions) {
			if (defaultOptions.hasOwnProperty(key) && !_options.hasOwnProperty(key)) {
				_options[key] = defaultOptions[key];
			}
		}
		key = null;
		var cookieKey = Cookies.get(_options.key) || "";
		if (cookieKey && cookieKey === decodeURIComponent(_options.datum)) {
			return;
		}
		if (notibar) {
			removeChildren(notibar);
		} else {
			notibar = document.createElement("div");
			addClass(notibar, notibarClass);
			addClass(notibar, animatedClass);
		}
		var msgContainer = document.createElement("div");
		addClass(msgContainer, messageClass);
		var msgContent = _options.message || "";
		if ("string" === typeof msgContent) {
			msgContent = document.createTextNode(msgContent);
		}
		msgContainer.appendChild(msgContent);
		notibar.appendChild(msgContainer);
		var insertCancelSvg = function (targetObj) {
			var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
			var use = document.createElementNS("http://www.w3.org/2000/svg", "use");
			svg.setAttribute("class", "ui-icon");
			use.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#ui-icon-Cancel");
			svg.appendChild(use);
			targetObj.appendChild(svg);
		};
		var closeButton = document.createElement("button");
		addClass(closeButton, closeButtonClass);
		closeButton.title = "Закрыть";
		insertCancelSvg(closeButton);
		var setCookie = function () {
			if (_options.days) {
				Cookies.set(_options.key, _options.datum, {
					expires: _options.days,
					sameSite: "strict"
				});
			} else {
				Cookies.set(_options.key, _options.datum, {
					sameSite: "strict"
				});
			}
		};
		var hideMessage = function () {
			var notibar = getByClass(document, notibarClass)[0] || "";
			if (notibar) {
				removeClass(notibar, fadeInDownClass);
				addClass(notibar, fadeOutUpClass);
				removeChildren(notibar);
			}
		};
		var handleCloseButton = function () {
			removeListener(closeButton, "click", handleCloseButton);
			hideMessage();
			setCookie();
		};
		addListener(closeButton, "click", handleCloseButton);
		notibar.appendChild(closeButton);
		if (docBody) {
			appendFragment(notibar, docBody);
			removeClass(notibar, fadeOutUpClass);
			addClass(notibar, fadeInDownClass);
			var timer = setTimeout(function () {
				clearTimeout(timer);
				timer = null;
				hideMessage();
			}, _options.timeout);
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
	 * manageDataSrcIframeAll
	 * @see {@link https://github.com/verlok/lazyload}
	 */
	root.dataSrcIframeClass = "data-src-iframe";

	root.lazyLoadDataSrcIframeInstance = null;
	root.manageDataSrcIframeAll = function (callback) {
		var _callback = function () {
			return callback && "function" === typeof callback && callback();
		};
		var isActiveClass = "is-active";
		var dataSrcIframeIsBindedClass = "data-src-iframe--is-binded";
		var iframes = getByClass(document, dataSrcIframeClass) || "";
		var i = iframes.length;
		while (i--) {
			if (!hasClass(iframes[i], dataSrcIframeIsBindedClass)) {
				addClass(iframes[i], dataSrcIframeIsBindedClass);
				addClass(iframes[i], isActiveClass);
				addListener(iframes[i], "load", _callback);
				var attributes = {
					"frameborder": "no",
					"style": "border:none;",
					"webkitallowfullscreen": "true",
					"mozallowfullscreen": "true",
					"scrolling": "no",
					"allowfullscreen": "true"
				};
				var key;
				for (key in attributes) {
					if (attributes.hasOwnProperty(key)) {
						iframes[i].setAttribute(key, attributes[key]);
					}
				}
				key = attributes = null;
			}
		}
		i = null;
		if (root.LazyLoad) {
			if (root.lazyLoadDataSrcIframeInstance) {
				root.lazyLoadDataSrcIframeInstance.destroy();
			}
			root.lazyLoadDataSrcIframeInstance = new LazyLoad({
					elements_selector: "." + dataSrcIframeClass
				});
		}
	};

	/*!
	 * manageIframeLightbox
	 * @see {@link https://github.com/englishextra/iframe-lightbox}
	 */
	root.manageIframeLightbox = function () {
		var link = getByClass(document, "iframe-lightbox-link") || "";
		var initScript = function () {
			var arrange = function (e) {
				e.lightbox = new IframeLightbox(e, {
						onLoaded: function () {
							LoadingSpinner.hide();
						},
						onClosed: function () {
							LoadingSpinner.hide();
						},
						onOpened: function () {
							LoadingSpinner.show();
						},
						touch: false
					});
			};
			var i,
			l;
			for (i = 0, l = link.length; i < l; i += 1) {
				arrange(link[i]);
			}
			i = l = null;
		};
		if (root.IframeLightbox && link) {
			initScript();
		}
	};

	/*!
	 * manageGLightbox
	 */
	root.manageGLightbox = function () {
		var glightboxClass = "img-lightbox-link";
		var link = getByClass(document, glightboxClass)[0] || "";
		var initScript = function () {
			var glbox;
			glbox = new GLightbox({
					selector: glightboxClass
				});
		};
		if (root.GLightbox && link) {
			initScript();
		}
	};

	/*!
	 * manageExpandingLayerAll
	 */
	root.manageExpandingLayerAll = function (callback) {
		var btn = getByClass(document, "btn-expand-hidden-layer") || "";
		var isActiveClass = "is-active";
		var isBindedClass = "is-binded";
		var arrange = function (e) {
			var handle = function () {
				var _this = this;
				var layer = _this.parentNode ? _this.parentNode.nextElementSibling : "";
				if (layer) {
					toggleClass(_this, isActiveClass);
					toggleClass(layer, isActiveClass);
					return callback && "function" === typeof callback && callback();
				}
				return;
			};
			if (!hasClass(e, isBindedClass)) {
				addListener(e, "click", handle);
				addClass(e, isBindedClass);
			}
		};
		if (btn) {
			var i,
			l;
			for (i = 0, l = btn.length; i < l; i += 1) {
				arrange(btn[i]);
			}
			i = l = null;
		}
	};

	/*!
	 * manageSearchInput
	 */
	root.manageSearchInput = function () {
		var text = document.getElementById("text") || "";
		var handle = function () {
			var _this = this;
			var logic = function () {
				_this.value = _this.value.replace(/\\/g, "").replace(/ +(?= )/g, " ").replace(/\/+(?=\/)/g, "/") || "";
			};
			debounce(logic, 200).call(root);
		};
		if (text) {
			text.focus();
			addListener(text, "input", handle);
		}
	};

	/*!
	 * LoadingSpinner
	 */
	root.LoadingSpinner = (function () {
		var docBody = document.body || "";
		var loadingSpinnerClass = "loading-spinner";
		var sp = getByClass(document, loadingSpinnerClass)[0] || "";
		var loadingSpinnerIsActiveClass = "loading-spinner--is-active";
		if (!sp) {
			sp = document.createElement("div");
			addClass(sp, loadingSpinnerClass);
			appendFragment(sp, docBody);
		}
		return {
			show: function () {
				return hasClass(docBody, loadingSpinnerIsActiveClass) || addClass(docBody, loadingSpinnerIsActiveClass);
			},
			hide: function (callback, timeout) {
				var delay = timeout || 500;
				var timer = setTimeout(function () {
						clearTimeout(timer);
						timer = null;
						removeClass(docBody, loadingSpinnerIsActiveClass);
						return callback && "function" === typeof callback && callback();
					}, delay);
			}
		};
	})();

	/*!
	 * Carousel v1.0
	 * @see {@link https://habrahabr.ru/post/327246/}
	 * @see {@link https://codepen.io/iGetPass/pen/apZPMo}
	 */
	root.Carousel = function (options) {
		var _this = this;
		var _options = options || {};
		if (getByClass(document, _options.wrap)[0] === null) {
			console.error("Carousel not fount selector " + _options.wrap);
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
		privates._options = _options;
		privates.sel = {
			"main": getByClass(document, privates._options.main)[0],
			"wrap": getByClass(document, privates._options.wrap)[0],
			"children": getByClass(document, privates._options.wrap)[0].children,
			"prev": getByClass(document, privates._options.prev)[0],
			"next": getByClass(document, privates._options.next)[0]
		};
		privates.opt = {
			"position": 0,
			"max_position": getByClass(document, privates._options.wrap)[0].children.length
		};
		if (privates.sel.prev !== null) {
			addListener(privates.sel.prev, "click", function () {
				_this.prev_slide();
			});
		}
		if (privates.sel.next !== null) {
			addListener(privates.sel.next, "click", function () {
				_this.next_slide();
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
		var isDropdownClass = "is-dropdown";
		var isFixedClass = "is-fixed";
		var isCollapsableClass = "is-collapsable";

		removeClass(docElem, "no-js");
		addClass(docElem, "js");

		progressBar.increase(20);

		var initialDocTitle = document.title || "";

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

		manageSearchInput();

		var alignToMasterBottomLeft = function (masterId, servantId, sameWidth) {
			sameWidth = sameWidth || "";
			var master = document.getElementById(masterId) || "";
			var servant = document.getElementById(servantId) || "";
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

		var hideOtherDropdownAll = function (_self) {
			var _this = _self || this;
			var list = getByClass(document, isDropdownClass) || "";
			var removeActiveClass = function (e) {
				if (_this !== e) {
					removeClass(e, isActiveClass);
				}
			};
			if (list) {
				var i,
				l;
				for (i = 0, l = list.length; i < l; i += 1) {
					removeActiveClass(list[i]);
				}
				i = l = null;
			}
		};
		var manageDropdownAll = function () {
			var container = document.getElementById("container") || "";
			if (container) {
				addListener(container, "click", hideOtherDropdownAll);
			}
		};
		manageDropdownAll();
		addListener(root, "hashchange", hideOtherDropdownAll);

		var manageChaptersSelect = function () {
			var chaptersSelect = document.getElementById("chapters-select") || "";
			var holderChaptersSelect = getByClass(document, "holder-chapters-select")[0] || "";
			var uiPanelContentsSelect = getByClass(document, "ui-panel-contents-select")[0] || "";
			var chaptersListClass = "chapters-list";
			var chaptersListButtonClass = "chapters-list-button";
			var rerenderChaptersList = function () {
				var handleChaptersListItem = function (listObj, hashString) {
					var uiPanelContentsSelectHeight = uiPanelContentsSelect ? (hasClass(uiPanelContentsSelect, isFixedClass) ? uiPanelContentsSelect.offsetHeight : uiPanelContentsSelect.offsetHeight * 2) : 0;
					if (hashString) {
						var targetObj = hashString ? (isValidId(hashString, true) ? document.getElementById(hashString.replace(/^#/,"")) || "" : "") : "";
						if (targetObj) {
							scroll2Top(findPos(targetObj).top - uiPanelContentsSelectHeight, 10000);
						} else {
							root.location.hash = hashString;
						}
					}
					removeClass(listObj, isActiveClass);
				};
				var chaptersList = document.createElement("ul");
				var chaptersListItems = chaptersSelect ? chaptersSelect.getElementsByTagName("option") || "" : "";
				var chaptersListBtnDefaultText = "";
				var fragment = document.createDocumentFragment();
				var generateChaptersListItems = function (_this, i) {
					if (0 === i) {
						chaptersListBtnDefaultText = _this.firstChild.textContent;
					}
					var chaptersListItem = document.createElement("li");
					var chaptersListItemText = _this.firstChild.textContent || "";
					var chaptersListItemValue = _this.value;
					/* var chaptersListItemTextTruncated = truncateString("" + chaptersListItemText, 28); */
					var chaptersListItemTextTruncated = "" + chaptersListItemText;
					chaptersListItem.appendChild(document.createTextNode(chaptersListItemTextTruncated));
					chaptersListItem.title = chaptersListItemText;
					addListener(chaptersListItem, "click", handleChaptersListItem.bind(null, chaptersList, chaptersListItemValue));
					fragment.appendChild(chaptersListItem);
					fragment.appendChild(document.createTextNode("\n"));
				};
				var i,
				l;
				for (i = 0, l = chaptersListItems.length; i < l; i += 1) {
					generateChaptersListItems(chaptersListItems[i], i);
				}
				i = l = null;
				appendFragment(fragment, chaptersList);
				addClass(chaptersList, chaptersListClass);
				addClass(chaptersList, isDropdownClass);
				holderChaptersSelect.replaceChild(chaptersList, chaptersSelect.parentNode.parentNode);
				var chaptersListButton = document.createElement("button");
				addClass(chaptersListButton, chaptersListButtonClass);
				chaptersListButton.appendChild(document.createTextNode(chaptersListBtnDefaultText));
				chaptersList.parentNode.insertBefore(chaptersListButton, chaptersList);
				var insertChevronDownSmallSvg = function (targetObj) {
					var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
					var use = document.createElementNS("http://www.w3.org/2000/svg", "use");
					svg.setAttribute("class", "ui-icon");
					use.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#ui-icon-ChevronDownSmall");
					svg.appendChild(use);
					targetObj.appendChild(svg);
				};
				insertChevronDownSmallSvg(chaptersListButton);
				var handleChaptersListBtn = function (ev) {
					ev.stopPropagation();
					ev.preventDefault();
					toggleClass(chaptersList, isActiveClass);
					hideOtherDropdownAll(chaptersList);
				};
				addListener(chaptersListButton, "click", handleChaptersListBtn);
			};
			if (holderChaptersSelect && chaptersSelect) {
				rerenderChaptersList();
			}
		};

		root.masonryInstance = null;
		root.packeryInstance = null;
		var initMasonry = function () {
			var gridItemSelector = ".masonry-grid-item";
			var gridSizerSelector = ".masonry-grid-sizer";
			var grid = getByClass(document, "masonry-grid")[0] || "";
			var gridItem = getByClass(document, "masonry-grid-item")[0] || "";
			var initScript = function () {
				if (root.Masonry) {
					if (root.masonryInstance) {
						root.masonryInstance.destroy();
					}
					root.masonryInstance = new Masonry(grid, {
							itemSelector: gridItemSelector,
							columnWidth: gridSizerSelector,
							gutter: 0,
							percentPosition: true
						});
				} else {
					if (root.Packery) {
						if (root.packeryInstance) {
							root.packeryInstance.destroy();
						}
						root.packeryInstance = new Packery(grid, {
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
					if (root.masonryInstance) {
						root.masonryInstance.layout();
					} else {
						if (root.packeryInstance) {
							root.packeryInstance.layout();
						}
					}
				}, 500);
			};
			if (grid && gridItem) {
				/* var jsUrl = "./cdn/masonry/4.1.1/js/masonry.pkgd.fixed.min.js"; */
				/* var jsUrl = "./cdn/packery/2.1.1/js/packery.pkgd.fixed.js"; */
				initScript();
			}
		};

		var manageDisqusBtn = function () {
			var btn = getByClass(document, "btn-show-disqus")[0] || "";
			var disqusThread = document.getElementById("disqus_thread") || "";
			var locHref = root.location.href || "";
			var shortname = disqusThread ? (disqusThread.dataset.shortname || "") : "";
			var hideDisqusButton = function () {
				addClass(disqusThread, isActiveClass);
				setDisplayNone(btn);
			};
			var hide = function () {
				removeChildren(disqusThread);
				var replacementText = document.createElement("p");
				replacementText.appendChild(document.createTextNode("Комментарии доступны только в веб версии этой страницы."));
				appendFragment(replacementText, disqusThread);
				disqusThread.removeAttribute("id");
				hideDisqusButton();
			};
			var handleBtn = function (ev) {
				ev.stopPropagation();
				ev.preventDefault();
				var logic = function () {
					var initScript = function () {
						try {
							DISQUS.reset({
								reload: true,
								config: function () {
									this.page.identifier = shortname;
									this.page.url = locHref;
								}
							});
							removeListener(btn, "click", handleBtn);
							hideDisqusButton();
						} catch (err) {
							throw new Error("cannot DISQUS.reset " + err);
						}
					};
					var jsUrl = "https://" + shortname + ".disqus.com/embed.js";
					if (!root.DISQUS) {
						var load;
						load = new loadJsCss([jsUrl], initScript);
					} else {
						initScript();
					}
				};
				debounce(logic, 200).call(root);
			};
			if (disqusThread && btn && shortname && locHref) {
				if (root.getHttp) {
					addListener(btn, "click", handleBtn);
				} else {
					hide();
				}
			}
		};

		var initNotibarMsg = function () {
			var uiPanelContentsSelect = getByClass(document, "ui-panel-contents-select")[0] || "";
			var cookieKey = "_notibar_dismiss_";
			var cookieDatum = "Выбрать статью можно щелкнув по самофиксирующейся планке с заголовком текущей страницы.";
			var locOrigin = parseLink(root.location.href).origin;
			var arrange = function () {
				var timer = setTimeout(function () {
					clearTimeout(timer);
					timer = null;
					var msgObj = document.createElement("span");
					var handleMsgObj = function (ev) {
						ev.stopPropagation();
						ev.preventDefault();
						removeListener(msgObj, "click", handleMsgObj);
						var uiPanelContentsSelectPos = uiPanelContentsSelect ? findPos(uiPanelContentsSelect).top : 0;
						var uiPanelContentsSelectHeight = uiPanelContentsSelect ? (hasClass(uiPanelContentsSelect, isFixedClass) ? uiPanelContentsSelect.offsetHeight : uiPanelContentsSelect.offsetHeight) : 0;
						scroll2Top(uiPanelContentsSelectPos - uiPanelContentsSelectHeight, 2000);
					};
					addListener(msgObj, "click", handleMsgObj);
					msgObj.appendChild(document.createTextNode(cookieDatum));
					notiBar({
						"message": msgObj,
						"timeout": 5000,
						"key": cookieKey,
						"datum": cookieDatum,
						"days": 0
					});
				}, 3000);
			};
			if (locOrigin && uiPanelContentsSelect) {
				if (root.getHttp) {
					arrange();
				}
			}
		};
		initNotibarMsg();

		root.kamilInstance = null;
		var manageKamil = function (jsonObject) {
			var searchForm = getByClass(document, "search-form")[0] || "";
			var textInputSelector = "#text";
			var textInput = document.getElementById("text") || "";
			var container = document.getElementById("container") || "";
			var typoAutcompleteListSelector = "kamil-typo-autocomplete";
			var typoAutcompleteListClass = "kamil-autocomplete";
			var initScript = function () {
				var ac;
				try {
					if (!jsonObject[0].hasOwnProperty("title")) {
						throw new Error("incomplete JSON data: no title");
					}
					ac = new Kamil(textInputSelector, {
							source: jsonObject,
							property: "title",
							minChars: 2
						});
				} catch (err) {
					console.log("cannot init Kamil " + err);
					return;
				}
				/*!
				 * create typo suggestion list
				 */
				var typoAutcompleteList = document.createElement("ul");
				var typoListItem = document.createElement("li");
				var handleTypoSuggestion = function () {
					setDisplayNone(typoAutcompleteList);
					setDisplayNone(typoListItem);
				};
				var showTypoSuggestion = function () {
					setDisplayBlock(typoAutcompleteList);
					setDisplayBlock(typoListItem);
				};
				addClass(typoAutcompleteList, typoAutcompleteListClass);
				typoAutcompleteList.id = typoAutcompleteListSelector;
				handleTypoSuggestion();
				typoAutcompleteList.appendChild(typoListItem);
				textInput.parentNode.insertBefore(typoAutcompleteList, textInput.nextElementSibling);
				/*!
				 * this is an optional setup of every li
				 * uset to set a description title attribute
				 * comment out the title attribute setup below
				 */
				ac.renderItem = function (ul, item) {
					var li = document.createElement("li");
					/* li.innerHTML = item.title; */
					appendFragment(document.createTextNode("" + item.title), li);
					li.title = item.text;
					ul.appendChild(li);
					return li;
				};
				/*!
				 * show suggestions
				 */
				ac.renderMenu = function (ul, stance) {
					var items = stance || "";
					var itemsLength = items.length;
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
						var i;
						for (i = 0; i < itemsLength; i += 1) {
							limitKamilOutput(items[i], i);
						}
						i = null;
					}
					/*!
					 * fix typo - non latin characters found
					 */
					var logic = function () {
						while (itemsLength < 1) {
							var textInputValue = textInput.value || "";
							if (/[^\u0000-\u007f]/.test(textInputValue)) {
								textInputValue = fixEnRuTypo(textInputValue, "ru", "en");
							} else {
								textInputValue = fixEnRuTypo(textInputValue, "en", "ru");
							}
							showTypoSuggestion();
							removeChildren(typoListItem);
							appendFragment(document.createTextNode("" + textInputValue), typoListItem);
							if (textInputValue.match(/^\s*$/)) {
								handleTypoSuggestion();
							}
							/*!
							 * hide typo suggestion
							 */
							if (textInput.value.length < 3 || textInput.value.match(/^\s*$/)) {
								handleTypoSuggestion();
							}
							itemsLength += 1;
						}
					};
					debounce(logic, 200).call(root);
					/*!
					 * truncate text
					 */
					var lis = ul ? ul.getElementsByTagName("li") || "" : "";
					var truncateKamilText = function (e) {
						var truncText = e.firstChild.textContent || "";
						var truncTextObj = document.createTextNode(truncateString(truncText, 24));
						e.replaceChild(truncTextObj, e.firstChild);
						/* e.title = "" + truncText; */
					};
					if (lis) {
						var j,
						m;
						for (j = 0, m = lis.length; j < m; j += 1) {
							truncateKamilText(lis[j]);
						}
						j = m = null;
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
				addListener(typoListItem, "click", handleTypoListItem);
				/*!
				 * hide suggestions on outside click
				 */
				if (container) {
					addListener(container, "click", handleTypoSuggestion);
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
			if (root.Kamil && searchForm && textInput) {
				initScript();
			}
		};

		var renderNavigation = function () {
			var navbar = document.getElementById("navbar") || "";
			var navbarParent = navbar.parentNode || "";
			var popularTemplateId = "template_navbar_popular";
			var popularTemplate = document.getElementById(popularTemplateId) || "";
			var popularRenderId = "render_navbar_popular";
			var popularRender = document.getElementById(popularRenderId) || "";
			var moreTemplateId = "template_navbar_more";
			var moreTemplate = document.getElementById(moreTemplateId) || "";
			var moreRenderId = "render_navbar_more";
			var moreRender = document.getElementById(moreRenderId) || "";
			var carouselTemplateId = "template_b_carousel";
			var carouselTemplate = document.getElementById(carouselTemplateId) || "";
			var carouselRenderId = "render_b_carousel";
			var carouselRender = document.getElementById(carouselRenderId) || "";
			var carouselRenderParent = carouselRender.parentNode || "";
			var showRenderNavbarPopularId = "show_render_navbar_popular";
			var showRenderNavbarPopular = document.getElementById(showRenderNavbarPopularId) || "";
			var renderNavbarPopularId = "render_navbar_popular";
			var renderNavbarPopular = document.getElementById(renderNavbarPopularId) || "";
			var showRenderNavbarMoreId = "show_render_navbar_more";
			var showRenderNavbarMore = document.getElementById(showRenderNavbarMoreId) || "";
			var renderNavbarMoreId = "render_navbar_more";
			var renderNavbarMore = document.getElementById(renderNavbarMoreId) || "";
			var navigationJsonUrl = "./libs/pwa-englishextra/json/navigation.json";
			var processJsonResponse = function (responseText) {
				try {
					var jsonObject = safelyParseJson(responseText);
					if (!jsonObject.navbar_popular) {
						throw new Error("incomplete JSON data: no navbar_popular");
					} else if (!jsonObject.navbar_more) {
						throw new Error("incomplete JSON data: no navbar_more");
					} else {
						if (!jsonObject.b_carousel) {
							throw new Error("incomplete JSON data: no b_carousel");
						}
					}
					jsonObject = null;
				} catch (err) {
					console.log("cannot init processJsonResponse " + err);
					return;
				}
				var handleListItemAll = function (e) {
					var items = e ? e.getElementsByTagName("li") || "" : "";
					var arrange = function (e) {
						addListener(e, "click", hideOtherDropdownAll);
					};
					if (items) {
						var i,
						l;
						for (i = 0, l = items.length; i < l; i += 1) {
							arrange(items[i]);
						}
						i = l = null;
					}
				};
				var handleShowRenderNavbarPopular = function (ev) {
					ev.stopPropagation();
					ev.preventDefault();
					toggleClass(renderNavbarPopular, isActiveClass);
					hideOtherDropdownAll(renderNavbarPopular);
				};
				var handleShowRenderNavbarMore = function (ev) {
					ev.stopPropagation();
					ev.preventDefault();
					toggleClass(renderNavbarMore, isActiveClass);
					hideOtherDropdownAll(renderNavbarMore);
				};
				var alignNavbarListAll = function () {
					alignToMasterBottomLeft(showRenderNavbarPopularId, renderNavbarPopularId);
					alignToMasterBottomLeft(showRenderNavbarMoreId, renderNavbarMoreId);
				};
				var handleShowNavbarListsWindow = function () {
					throttle(alignNavbarListAll, 100).call(root);
				};
				if (popularTemplate && popularRender) {
					insertFromTemplate(responseText, popularTemplateId, popularRenderId, function () {
						if (moreTemplate && moreRender) {
							insertFromTemplate(responseText, moreTemplateId, moreRenderId, function () {
								alignNavbarListAll();
								handleListItemAll(renderNavbarPopular);
								handleListItemAll(renderNavbarMore);
								addListener(showRenderNavbarPopular, "click", handleShowRenderNavbarPopular);
								addListener(showRenderNavbarMore, "click", handleShowRenderNavbarMore);
								addListener(root, "resize", handleShowNavbarListsWindow);
								if (navbarParent) {
									manageExternalLinkAll(navbarParent);
								}
							}, true);
						}
					}, true);
				}
				if (carouselTemplate && carouselRender) {
					insertFromTemplate(responseText, carouselTemplateId, carouselRenderId, function () {
						var carousel;
						carousel = new Carousel({
								"main": "js-carousel",
								"wrap": "js-carousel__wrap",
								"prev": "js-carousel__prev",
								"next": "js-carousel__next"
							});
						if (carouselRenderParent) {
							manageExternalLinkAll(carouselRenderParent);
							/* var timer = setTimeout(function () {
								clearTimeout(timer);
								timer = null;
								manageDataSrcImgAll();
							}, 500); */
						}
					}, true);
				}
			};
			if (navbar) {
				ajaxGet(navigationJsonUrl, {
					overrideMimeType: "application/json;charset=utf-8",
					success: function (responseText) {
						processJsonResponse(responseText);
					},
					failure: function (status) {
						console.log(status);
					}
				});
			}
		};
		renderNavigation();

		var fixUiPanelContentsSelect = function () {
			var uiPanelNavigation = getByClass(document, "ui-panel-navigation")[0] || "";
			var holderHero = getByClass(document, "holder-hero")[0] || "";
			var uiPanelContentsSelect = getByClass(document, "ui-panel-contents-select")[0] || "";
			var criticalHeight = (uiPanelNavigation ? uiPanelNavigation.offsetHeight : 0) + (holderHero ? holderHero.offsetHeight : 0);
			var handleUiPanelContentsSelect = function () {
				var logic = function () {
					if ((docBody.scrollTop || docElem.scrollTop || 0) > criticalHeight) {
						addClass(uiPanelContentsSelect, isFixedClass);
					} else {
						removeClass(uiPanelContentsSelect, isFixedClass);
					}
				};
				throttle(logic, 100).call(root);
			};
			if (uiPanelContentsSelect) {
				addListener(root, "scroll", handleUiPanelContentsSelect, {passive: true});
			}
		};
		fixUiPanelContentsSelect();

		var handleOtherSocialBtnAll = function (_self) {
			var _this = _self || this;
			var btn = getByClass(document, isCollapsableClass) || "";
			var arrange = function (e) {
				if (_this !== e) {
					removeClass(e, isActiveClass);
				}
			};
			if (btn) {
				var i,
				l;
				for (i = 0, l = btn.length; i < l; i += 1) {
					arrange(btn[i]);
				}
				i = l = null;
			}
		};
		var manageOtherSocialBtnAll = function () {
			var container = document.getElementById("container") || "";
			if (container) {
				addListener(container, "click", handleOtherSocialBtnAll);
			}
		};
		manageOtherSocialBtnAll();
		addListener(root, "hashchange", handleOtherSocialBtnAll);

		var manageLocationQrcode = function () {
			var btn = getByClass(document, "btn-toggle-holder-location-qrcode")[0] || "";
			var holder = getByClass(document, "holder-location-qrcode")[0] || "";
			var locHref = root.location.href || "";
			var handleBtn = function (ev) {
				ev.stopPropagation();
				ev.preventDefault();
				var logic = function () {
					toggleClass(holder, isActiveClass);
					addClass(holder, isCollapsableClass);
					handleOtherSocialBtnAll(holder);
					var locHref = root.location.href || "";
					var newImg = document.createElement("img");
					var newTitle = document.title ? ("Ссылка на страницу «" + document.title.replace(/\[[^\]]*?\]/g, "").trim() + "»") : "";
					var newSrc = "https://chart.googleapis.com/chart?cht=qr&chld=M%7C4&choe=UTF-8&chs=512x512&chl=" + encodeURIComponent(locHref);
					newImg.alt = newTitle;
					if ("undefined" !== typeof earlySvgSupport && "svg" === earlySvgSupport) {
						newSrc = QRCode.generateSVG(locHref, {
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
						newSrc = QRCode.generatePNG(locHref, {
								ecclevel: "M",
								format: "html",
								fillcolor: "#FFFFFF",
								textcolor: "#191919",
								margin: 4,
								modulesize: 8
							});
						newImg.src = newSrc;
					}
					addClass(newImg, "qr-code-img");
					newImg.title = newTitle;
					removeChildren(holder);
					appendFragment(newImg, holder);
				};
				debounce(logic, 200).call(root);
			};
			if (root.QRCode && btn && holder && locHref && root.getHttp) {
				addListener(btn, "click", handleBtn);
			}
		};
		manageLocationQrcode();

		root.yaShare2Instance = null;
		var manageYaShare2Btn = function () {
			var btn = getByClass(document, "btn-toggle-holder-share-buttons")[0] || "";
			var yaShare2Id = "ya-share2";
			var yaShare2 = document.getElementById(yaShare2Id) || "";
			var holder = getByClass(document, "holder-share-buttons")[0] || "";
			var handleBtn = function (ev) {
				ev.stopPropagation();
				ev.preventDefault();
				var logic = function () {
					toggleClass(holder, isActiveClass);
					addClass(holder, isCollapsableClass);
					handleOtherSocialBtnAll(holder);
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
			if (btn && holder && yaShare2 && root.getHttp) {
				addListener(btn, "click", handleBtn);
			}
		};
		manageYaShare2Btn();

		root.vkLikeInstance = null;
		var manageVkLikeBtn = function () {
			var btn = getByClass(document, "btn-toggle-holder-vk-like")[0] || "";
			var holder = getByClass(document, "holder-vk-like")[0] || "";
			var vkLikeId = "vk-like";
			var vkLike = document.getElementById(vkLikeId) || "";
			var handleBtn = function (ev) {
				ev.stopPropagation();
				ev.preventDefault();
				var logic = function () {
					toggleClass(holder, isActiveClass);
					addClass(holder, isCollapsableClass);
					handleOtherSocialBtnAll(holder);
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
			if (btn && holder && vkLike && root.getHttp) {
				addListener(btn, "click", handleBtn);
			}
		};
		manageVkLikeBtn();

		var manageDebugGridBtn = function () {
			var container = document.getElementById("container") || "";
			var page = document.getElementById("page") || "";
			var btn = getByClass(document, "btn-toggle-col-debug")[0] || "";
			var debugClass = "debug";
			var cookieKey = "_manageDebugGridButton_";
			var cookieDatum = "ok";
			var handleBtn = function (ev) {
				ev.stopPropagation();
				ev.preventDefault();
				toggleClass(container, debugClass);
				var showMsg = function () {
					var col = getByClass(document, "col")[0] || "";
					var elements = [docBody, page, container, col];
					var debugMessage = [];
					var renderElementsInfo = function (e) {
						if (e) {
							debugMessage.push((e.className ? "." + e.className : e.id ? "#" + e.id : e.tagName), " ", root.getComputedStyle(e).getPropertyValue("font-size"), " ", root.getComputedStyle(e).getPropertyValue("line-height"), " ", e.offsetWidth, "x", e.offsetHeight, " \u003e ");
						}
					};
					var i,
					l;
					for (i = 0, l = elements.length; i < l; i += 1) {
						renderElementsInfo(elements[i]);
					}
					i = l = null;
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
				var handleContainer = function () {
					if (container) {
						removeClass(container, debugClass);
						removeListener(container, "click", handleContainer);
					}
				};
				if (hasClass(container, debugClass)) {
					addListener(container, "click", handleContainer);
					showMsg();
				} else {
					removeListener(container, "click", handleContainer);
				}
			};
			if (page && container && btn) {
				var locHref = root.location.href || "";
				if (locHref && parseLink(locHref).hasHTTP && (/^(localhost|127.0.0.1)/).test(parseLink(locHref).hostname)) {
					addListener(btn, "click", handleBtn);
				} else {
					setDisplayNone(btn);
				}
			}
		};
		manageDebugGridBtn();

		var initRouting = function () {
			var appContentId = "app-content";
			var appContent = document.getElementById(appContentId) || "";
			var appContentParent;
			if (appContent) {
				appContentParent = appContent.parentNode || "";
			}
			/* var contentsSelectTemplate = document.getElementById("template_contents_select") || "";
			var contentsSelectRender = document.getElementById("render_contents_select") || ""; */
			var contentsSelect = getByClass(document, "contents-select")[0] || "";
			var holderContentsSelect = getByClass(document, "holder-contents-select")[0] || "";
			var contentsListButtonClass = "contents-list-button";
			var contentsListClass = "contents-list";
			var searchTextInput = document.getElementById("text") || "";
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
			var jsonHashRouterIsBindedClass = "json-hash-router--is-binded";
			var processJsonResponse = function (responseText) {
				var routesJsonObj;
				try {
					routesJsonObj = safelyParseJson(responseText);
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
					console.log("cannot init processJsonResponse " + err);
					return;
				}
				var renderMasonry;
				var renderComments;
				var triggerOnContentInserted = function (titleString, nextHrefString, asideJsonObject, jsonObject) {
					/* var h1 = contentsSelect || document.getElementById("h1") || "";
					var h1Pos = findPos(h1).top || 0;
					if (h1) {
						scroll2Top(h1Pos, 20000);
					} else {
						scroll2Top(0, 20000);
					} */
					/* scroll2Top(0, 20000); */
					/* if (titleString) { */
					document.title = (titleString ? titleString + " - " : "") + (initialDocTitle ? initialDocTitle + (userBrowser ? userBrowser : "") : "");
					/* } */
					var locationHash = root.location.hash || "";
					if (contentsSelect) {
						var optionMatched = false;
						var i,
						l;
						for (i = 0, l = contentsSelect.options.length; i < l; i += 1) {
							if (locationHash === contentsSelect.options[i].value) {
								optionMatched = true;
								contentsSelect.selectedIndex = i;
								break;
							}
						}
						i = l = null;
						/* var key;
						for (key in contentsSelect.options) {
							if (contentsSelect.options.hasOwnProperty(key)) {
								if (locationHash === contentsSelect.options[key].value) {
									optionMatched = true;
									contentsSelect.selectedIndex = key;
									break;
								}
							}
						}
						key = null; */
						if (!optionMatched) {
							contentsSelect.selectedIndex = 0;
						}
					}
					var contentsList = getByClass(document, contentsListClass)[0] || "";
					if (contentsList) {
						var contentsListButton = holderContentsSelect ? getByClass(holderContentsSelect, contentsListButtonClass)[0] || "" : "";
						if (contentsListButton) {
							var itemMatched = false;
							var contentsListItems = contentsList ? contentsList.getElementsByTagName("li") || "" : "";
							var j,
							m;
							for (j = 0, m = contentsListItems.length; j < m; j += 1) {
								if (locationHash === contentsListItems[j].dataset.href) {
									itemMatched = true;
									contentsListButton.replaceChild(document.createTextNode(contentsListItems[j].firstChild.textContent), contentsListButton.firstChild);
									break;
								}
							}
							j = m = null;
							/* var key2;
							for (key2 in contentsListItems) {
								if (contentsListItems.hasOwnProperty(key2)) {
									if (locationHash === contentsListItems[key2].dataset.href) {
										itemMatched = true;
										contentsListButton.replaceChild(document.createTextNode(contentsListItems[key2].firstChild.textContent), contentsListButton.firstChild);
										break;
									}
								}
							}
							key2 = null; */
							if (!itemMatched) {
								contentsListButton.replaceChild(document.createTextNode(contentsListButtonDefaultText), contentsListButton.firstChild);
							}
						}
					}
					if (asideJsonObject) {
						var asideTemplate = document.getElementById(asideTemplateId) || "";
						var asideRender = document.getElementById(asideRenderId) || "";
						var asideRenderParent = asideRender.parentNode || "";
						if (asideTemplate && asideRender) {
							insertFromTemplate(asideJsonObject, asideTemplateId, asideRenderId, function () {
								if (asideRenderParent) {
									manageExternalLinkAll(asideRenderParent);
									/* var timer = setTimeout(function () {
										clearTimeout(timer);
										timer = null;
										manageDataSrcImgAll();
									}, 500); */
								}
							}, true);
						}
					}
					if (nextHrefString) {
						var nextHrefTemplate = document.getElementById(nextHrefTemplateId) || "";
						var nextHrefRender = document.getElementById(nextHrefRenderId) || "";
						if (nextHrefTemplate && nextHrefRender) {
							insertFromTemplate({
								"next_href": nextHrefString
							}, nextHrefTemplateId, nextHrefRenderId, null, true);
						}
					}
					var commentsTemplate = document.getElementById(commentsTemplateId) || "";
					var commentsRender = document.getElementById(commentsRenderId) || "";
					var commentsRenderParent = commentsRender.parentNode || "";
					if (commentsTemplate && commentsRender) {
						if (!renderComments) {
							renderComments = renderTemplate({}, commentsTemplateId);
						}
						embedHtmlFragment(renderComments, commentsRender, function () {
							if (commentsRenderParent) {
								manageDisqusBtn();
							}
						}, true);
					}
					var masonryGrid = getByClass(document, masonryGridClass)[0] || "";
					var masonryGridParent = masonryGrid.parentNode || "";
					if (masonryGrid && masonryGridParent) {
						var contentsGridTemplate = document.getElementById(contentsGridTemplateId) || "";
						var contentsGridRender = document.getElementById(contentsGridRenderId) || "";
						var contentsGridRenderParent = contentsGridRender.parentNode || "";
						if (contentsGridTemplate && contentsGridRender) {
							if (!renderMasonry) {
								if (jsonObject) {
									renderMasonry = renderTemplate(jsonObject, contentsGridTemplateId);
								}
							}
							embedHtmlFragment(renderMasonry, contentsGridRender, function () {
								if (contentsGridRenderParent) {
									initMasonry(contentsGridRenderParent);
									manageExternalLinkAll(contentsGridRenderParent);
									/* var timer = setTimeout(function () {
										clearTimeout(timer);
										timer = null;
										manageDataSrcImgAll();
									}, 500); */
								}
							}, true);
						} else {
							initMasonry(masonryGridParent);
						}
					}
					/*!
					 * cache parent node beforehand
					 * put when templates rendered
					 */
					if (appContentParent) {
						manageExternalLinkAll();
						manageGLightbox();
						manageIframeLightbox();
						manageChaptersSelect();
						manageExpandingLayerAll();
						var timer = setTimeout(function () {
								clearTimeout(timer);
								timer = null;
								manageDataSrcIframeAll();
								manageDataSrcImgAll();
							}, 100);
					}
					LoadingSpinner.hide(scroll2Top.bind(null, 0, 20000));
				};
				manageKamil(routesJsonObj.hashes);
				var handleRoutesWindow = function () {
					if (searchTextInput) {
						searchTextInput.blur();
					}
					var locationHash = root.location.hash || "";
					if (locationHash) {
						var isFound = false;
						var i,
						l;
						for (i = 0, l = routesJsonObj.hashes.length; i < l; i += 1) {
							if (locationHash === routesJsonObj.hashes[i].href) {
								isFound = true;
								LoadingSpinner.show();
								insertExternalHtml(appContentId, routesJsonObj.hashes[i].url, triggerOnContentInserted.bind(null, routesJsonObj.hashes[i].title, routesJsonObj.hashes[i].next_href, routesJsonObj.hashes[i].aside, routesJsonObj), null, true);
								break;
							}
						}
						i = l = null;
						/* var key;
						for (key in routesJsonObj.hashes) {
							if (routesJsonObj.hashes.hasOwnProperty(key)) {
								if (locationHash === routesJsonObj.hashes[key].href) {
									isFound = true;
									LoadingSpinner.show();
									insertExternalHtml(appContentId, routesJsonObj.hashes[key].url, triggerOnContentInserted.bind(null, routesJsonObj.hashes[key].title, routesJsonObj.hashes[key].next_href, routesJsonObj.hashes[key].aside, routesJsonObj), null, true);
									break;
								}
							}
						}
						key = null; */
						if (false === isFound) {
							if (document.getElementById(locationHash.substring(1))) {
								root.location.hash = locationHash;
							} else {
								var notfoundUrl = routesJsonObj.notfound.url;
								var notfoundTitle = routesJsonObj.notfound.title;
								if (notfoundUrl /* && notfoundTitle */) {
									LoadingSpinner.show();
									insertExternalHtml(appContentId, notfoundUrl, triggerOnContentInserted.bind(null, notfoundTitle, null, null, routesJsonObj), null, true);
								}
							}
						}
					} else {
						var homeUrl = routesJsonObj.home.url;
						var homeTitle = routesJsonObj.home.title;
						if (homeUrl /* && homeTitle */) {
							LoadingSpinner.show();
							insertExternalHtml(appContentId, homeUrl, triggerOnContentInserted.bind(null, homeTitle, null, null, routesJsonObj), null, true);
						}
					}
				};
				handleRoutesWindow();
				if (!hasClass(docElem, jsonHashRouterIsBindedClass)) {
					addClass(docElem, jsonHashRouterIsBindedClass);
					addListener(root, "hashchange", handleRoutesWindow);
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
					var contentsSelectHtml = contentsSelectTemplate.innerHTML || "";
					var renderContentsSelectTemplate = new t(contentsSelectHtml);
					var contentsSelectRendered = renderContentsSelectTemplate.render(routesJsonObj);
					contentsSelectRender.innerHTML = contentsSelectRendered;
				} */
				/* var rerenderContentsSelect = function () {
					var handleContentsSelect = function () {
						var _this = this;
						var hashString = _this.options[_this.selectedIndex].value || "";
						if (hashString) {
							var targetObj = isValidId(hashString, true) ? document.getElementById(hashString.replace(/^#/, "")) || "" : "";
							if (targetObj) {
								scroll2Top(findPos(targetObj).top, 10000);
							} else {
								if (hashString.substring(1, 0) === "#") {
									root.location.hash = hashString;
								} else {
									root.location.href = hashString;
								}
							}
						}
					};
					var df = document.createDocumentFragment();
					var generateContentsSelectOptions = function (e) {
						if (e.title) {
							var contentsOption = document.createElement("option");
							contentsOption.value = e.href;
							var contentsOptionText = e.title;
							contentsOption.title = contentsOptionText;
							var contentsOptionTextTruncated = truncateString("" + contentsOptionText, 44);
							contentsOption.appendChild(document.createTextNode(contentsOptionTextTruncated));
							df.appendChild(contentsOption);
							df.appendChild(document.createTextNode("\n"));
						}
					};
					var i,
					l;
					for (i = 0, l = routesJsonObj.hashes.length; i < l; i += 1) {
						generateContentsSelectOptions(routesJsonObj.hashes[i]);
					}
					i = l = null;
					appendFragment(df, contentsSelectRender);
					addListener(contentsSelect, "change", handleContentsSelect);
				}; */
				var rerenderContentsList = function () {
					var handleContentsListItem = function (listObj, hashString) {
						if (hashString) {
							var targetObj = isValidId(hashString, true) ? document.getElementById(hashString.replace(/^#/, "")) || "" : "";
							if (targetObj) {
								scroll2Top(findPos(targetObj).top, 10000);
							} else {
								if (hashString.substring(1, 0) === "#") {
									root.location.hash = hashString;
								} else {
									root.location.href = hashString;
								}
							}
						}
						removeClass(listObj, isActiveClass);
					};
					var contentsList = document.createElement("ul");
					var contentsListButtonText = contentsSelect.options[0].textContent || "";
					var df = document.createDocumentFragment();
					var generateContentsListItems = function (e) {
						if (e.title) {
							var contentsListItem = document.createElement("li");
							var contentsListItemHref = e.href;
							var contentsListItemText = e.title;
							contentsListItem.title = contentsListItemText;
							contentsListItem.dataset.href = contentsListItemHref;
							/* var contentsListItemTextTruncated = truncateString("" + contentsListItemText, 44); */
							var contentsListItemTextTruncated = "" + contentsListItemText;
							contentsListItem.appendChild(document.createTextNode(contentsListItemTextTruncated));
							addListener(contentsListItem, "click", handleContentsListItem.bind(null, contentsList, contentsListItemHref));
							df.appendChild(contentsListItem);
							df.appendChild(document.createTextNode("\n"));
						}
					};
					var j,
					m;
					for (j = 0, m = routesJsonObj.hashes.length; j < m; j += 1) {
						generateContentsListItems(routesJsonObj.hashes[j]);
					}
					j = m = null;
					appendFragment(df, contentsList);
					addClass(contentsList, contentsListClass);
					addClass(contentsList, isDropdownClass);
					holderContentsSelect.replaceChild(contentsList, contentsSelect.parentNode.parentNode);
					var contentsListButton = document.createElement("button");
					addClass(contentsListButton, contentsListButtonClass);
					contentsListButton.appendChild(document.createTextNode(contentsListButtonText));
					contentsList.parentNode.insertBefore(contentsListButton, contentsList);
					var insertChevronDownSmallSvg = function (targetObj) {
						var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
						var use = document.createElementNS("http://www.w3.org/2000/svg", "use");
						svg.setAttribute("class", "ui-icon");
						use.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#ui-icon-ChevronDownSmall");
						svg.appendChild(use);
						targetObj.appendChild(svg);
					};
					insertChevronDownSmallSvg(contentsListButton);
					var handleContentsListItemsButton = function (ev) {
						ev.stopPropagation();
						ev.preventDefault();
						toggleClass(contentsList, isActiveClass);
						hideOtherDropdownAll(contentsList);
					};
					addListener(contentsListButton, "click", handleContentsListItemsButton);
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
				ajaxGet(routesJsonUrl, {
					overrideMimeType: "application/json;charset=utf-8",
					success: function (responseText) {
						processJsonResponse(responseText);
					},
					failure: function (status) {
						console.log(status);
					}
				});
			}
		};
		initRouting();

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
		scripts.push("./cdn/polyfills/js/polyfills.fixed.min.js");
	}

	scripts.push("./libs/pwa-englishextra/js/vendors.min.js");

	var bodyFontFamily = "Roboto";

	var urlArray = ["./libs/pwa-englishextra/css/bundle.min.css"];

	loadDeferred(urlArray, onFontReady.bind(null, bodyFontFamily, scripts, false));
})("undefined" !== typeof window ? window : this, document);
