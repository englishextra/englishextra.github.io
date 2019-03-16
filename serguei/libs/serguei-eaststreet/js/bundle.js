/*jslint browser: true */
/*jslint node: true */
/*global ActiveXObject, addClass, addListener, appendFragment, Cookies,
debounce, DISQUS, doesFontExist, findPos, fixEnRuTypo, forcedHTTP, getByClass,
getHumanDate, hasClass, IframeLightbox, imgLightbox, includeHTMLintoTarget,
insertExternalHTML, insertTextAsFragment, isNodejs, isElectron, isNwjs,
isValidId, Kamil, LazyLoad, loadDeferred, loadExternalHTML, loadJsCss,
loadJsonResponse, needsPolyfills, openDeviceBrowser, parseLink, QRCode,
removeChildren, removeClass, removeElement, removeListener, require, routie,
safelyParseJSON, scroll2Top, setDisplayBlock, setDisplayNone, supportsCanvas,
supportsPassive, supportsSvgSmilAnimation, throttle, toggleClass, ToProgress,
truncString, unescape, VK, Ya, ymaps*/
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
 * supportsPassive
 */
(function (root) {
	"use strict";
	root.supportsPassive = (function () {
		var support = false;
		try {
			var opts = Object.defineProperty && Object.defineProperty({}, "passive", {
					get: function () {
						support = true;
					}
				});
			root.addEventListener("test", function () {}, opts);
		} catch (err) {}
		return support;
	})();
})("undefined" !== typeof window ? window : this);
/*!
 * supportsSvgSmilAnimation
 */
(function (root, document) {
	"use strict";
	var toStringFn = {}.toString;
	root.supportsSvgSmilAnimation = !!document.createElementNS &&
		(/SVGAnimate/).test(toStringFn.call(document.createElementNS("http://www.w3.org/2000/svg", "animate"))) || "";
})("undefined" !== typeof window ? window : this, document);
/*!
 * supportsCanvas
 */
(function (root, document) {
	"use strict";
	root.supportsCanvas = (function () {
		var elem = document.createElement("canvas");
		return !!(elem.getContext && elem.getContext("2d"));
	})();
})("undefined" !== typeof window ? window : this, document);
/*!
 * needsPolyfills
 */
(function (root, document) {
	"use strict";
	root.needsPolyfills = (function () {
		return !String.prototype.startsWith ||
		!supportsPassive ||
		!root.requestAnimationFrame ||
		!root.matchMedia ||
		("undefined" === typeof root.Element && !("dataset" in document.documentElement)) ||
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
})("undefined" !== typeof window ? window : this, document);
/*!
 * getHumanDate
 */
(function (root) {
	"use strict";
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
		return newYear + "-" + newMonth + "-" + newDay;
	})();
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
	root.getByClass = function (parent, name) {
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
})("undefined" !== typeof window ? window : this, document);
/*!
 * class list wrapper
 */
(function (root, document) {
	"use strict";
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
})("undefined" !== typeof window ? window : this, document);
/*!
 * parseLink
 */
(function (root, document) {
	"use strict";
	/*jshint bitwise: false */
	root.parseLink = function (url, full) {
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
})("undefined" !== typeof window ? window : this, document);
/*!
 * getHTTP
 */
(function (root) {
	"use strict";
	var getHTTP = function (force) {
		var any = force || "";
		var locProtocol = root.location.protocol || "";
		return "http:" === locProtocol ? "http" : "https:" === locProtocol ? "https" : any ? "http" : "";
	};
	root.getHTTP = getHTTP;
	root.forcedHTTP = getHTTP(true);
})("undefined" !== typeof window ? window : this);
/*!
 * throttle
 */
(function (root) {
	"use strict";
	root.throttle = function (func, wait) {
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
})("undefined" !== typeof window ? window : this);
/*!
 * debounce
 */
(function (root) {
	"use strict";
	root.debounce = function (func, wait) {
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
})("undefined" !== typeof window ? window : this);
/*!
 * isNodejs isElectron isNwjs;
 */
(function (root) {
	"use strict";
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
})("undefined" !== typeof window ? window : this);
/*!
 * openDeviceBrowser
 */
(function (root) {
	"use strict";
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
			var locProtocol = root.location.protocol || "";
			var hasHTTP = locProtocol ? "http:" === locProtocol ? "http" : "https:" === locProtocol ? "https" : "" : "";
			if (hasHTTP) {
				return true;
			} else {
				onLocal();
			}
		}
	};
})("undefined" !== typeof window ? window : this);
/*!
 * scroll2Top
 */
(function (root, document) {
	"use strict";
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
})("undefined" !== typeof window ? window : this, document);
/*!
 * setDisplayBlock
 */
(function (root) {
	"use strict";
	root.setDisplayBlock = function (e) {
		if (e) {
			e.style.display = "block";
		}
	};
})("undefined" !== typeof window ? window : this);
/*!
 * setDisplayNone
 */
(function (root) {
	"use strict";
	root.setDisplayNone = function (e) {
		if (e) {
			e.style.display = "none";
		}
	};
})("undefined" !== typeof window ? window : this);
/*!
 * setVisible
 */
(function (root) {
	"use strict";
	root.setVisible = function (e) {
		if (e) {
			e.style.visibility = "visible";
			e.style.opacity = 1;
		}
	};
})("undefined" !== typeof window ? window : this);
/*!
 * appendFragment
 */
(function (root, document) {
	"use strict";
	root.appendFragment = function (e, a) {
		var parent = a || document.getElementsByTagName("body")[0] || "";
		if (e) {
			var df = document.createDocumentFragment() || "";
			if ("string" === typeof e) {
				e = document.createTextNode(e);
			}
			df.appendChild(e);
			parent.appendChild(df);
		}
	};
})("undefined" !== typeof window ? window : this, document);
/*!
 * removeElement
 */
(function (root) {
	"use strict";
	root.removeElement = function (e) {
		if (e) {
			if ("undefined" !== typeof e.remove) {
				return e.remove();
			} else {
				return e.parentNode && e.parentNode.removeChild(e);
			}
		}
	};
})("undefined" !== typeof window ? window : this);
/*!
 * removeChildren
 */
(function (root) {
	"use strict";
	root.removeChildren = function (e) {
		if (e && e.firstChild) {
			for (; e.firstChild; ) {
				e.removeChild(e.firstChild);
			}
		}
	};
})("undefined" !== typeof window ? window : this);
/*!
 * findPos
 */
(function (root) {
	"use strict";
	var docElem = document.documentElement || "";
	var docBody = document.body || "";
	root.findPos = function (e) {
		e = e.getBoundingClientRect();
		return {
			top: Math.round(e.top + (root.pageYOffset || docElem.scrollTop || docBody.scrollTop) - (docElem.clientTop || docBody.clientTop || 0)),
			left: Math.round(e.left + (root.pageXOffset || docElem.scrollLeft || docBody.scrollLeft) - (docElem.clientLeft || docBody.clientLeft || 0))
		};
	};
})("undefined" !== typeof window ? window : this);
/*!
 * safelyParseJSON
 */
(function (root) {
	"use strict";
	root.safelyParseJSON = function (response) {
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
})("undefined" !== typeof window ? window : this);
/*!
 * fixEnRuTypo
 */
(function (root) {
	"use strict";
	root.fixEnRuTypo = function (e, a, b) {
		var c = "";
		if ("ru" === a && "en" === b) {
			a = '\u0430\u0431\u0432\u0433\u0434\u0435\u0451\u0436\u0437\u0438\u0439\u043a\u043b\u043c\u043d\u043e\u043f\u0440\u0441\u0442\u0443\u0444\u0445\u0446\u0447\u0448\u0449\u044a\u044c\u044b\u044d\u044e\u044f\u0410\u0411\u0412\u0413\u0414\u0415\u0401\u0416\u0417\u0418\u0419\u041a\u041b\u041c\u041d\u041e\u041f\u0420\u0421\u0422\u0423\u0424\u0425\u0426\u0427\u0428\u0429\u042a\u042c\u042b\u042d\u042e\u042f"\u2116;:?/.,';
			b = "f,dult`;pbqrkvyjghcnea[wxio]ms'.zF<DULT~:PBQRKVYJGHCNEA{WXIO}MS'>Z@#$^&|/?";
		} else {
			a = "f,dult`;pbqrkvyjghcnea[wxio]ms'.zF<DULT~:PBQRKVYJGHCNEA{WXIO}MS'>Z@#$^&|/?";
			b = '\u0430\u0431\u0432\u0433\u0434\u0435\u0451\u0436\u0437\u0438\u0439\u043a\u043b\u043c\u043d\u043e\u043f\u0440\u0441\u0442\u0443\u0444\u0445\u0446\u0447\u0448\u0449\u044a\u044c\u044b\u044d\u044e\u044f\u0410\u0411\u0412\u0413\u0414\u0415\u0401\u0416\u0417\u0418\u0419\u041a\u041b\u041c\u041d\u041e\u041f\u0420\u0421\u0422\u0423\u0424\u0425\u0426\u0427\u0428\u0429\u042a\u042c\u042b\u042d\u042e\u042f"\u2116;:?/.,';
		}
		var d;
		for (d = 0; d < e.length; d += 1) {
			var f = a.indexOf(e.charAt(d));
			if (c > f) {
				c += e.charAt(d);
			} else {
				c += b.charAt(f);
			}
		}
		d = null;
		return c;
	};
})("undefined" !== typeof window ? window : this);
/*!
 * truncString
 */
(function (root) {
	"use strict";
	root.truncString = function (str, max, add) {
		var _add = add || "\u2026";
		return ("string" === typeof str && str.length > max ? str.substring(0, max) + _add : str);
	};
})("undefined" !== typeof window ? window : this);
/*!
 * isValidId
 */
(function (root) {
	"use strict";
	root.isValidId = function (a, full) {
		return full ? /^\#[A-Za-z][-A-Za-z0-9_:.]*$/.test(a) ? true : false : /^[A-Za-z][-A-Za-z0-9_:.]*$/.test(a) ? true : false;
	};
})("undefined" !== typeof window ? window : this);
/*!
 * insertTextAsFragment
 */
(function (root, document) {
	"use strict";
	root.insertTextAsFragment = function (text, container, callback) {
		var cb = function () {
			return callback && "function" === typeof callback && callback();
		};
		try {
			var clonedContainer = container.cloneNode(false);
			if (container.parentNode) {
				if (document.createRange) {
					var rg = document.createRange();
					rg.selectNode(document.body);
					var df = rg.createContextualFragment(text);
					clonedContainer.appendChild(df);
					container.parentNode.replaceChild(clonedContainer, container);
				} else {
					container.parentNode.replaceChild(document.createDocumentFragment.appendChild(clonedContainer), container);
				}
			} else {
				container.innerHTML = text;
			}
			cb();
		} catch (e) {
			console.log(e);
			return;
		}
	};
})("undefined" !== typeof window ? window : this, document);
/*!
 * loadJsonResponse
 */
(function (root) {
	"use strict";
	root.loadJsonResponse = function (url, callback, onerror) {
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
})("undefined" !== typeof window ? window : this);
/*!
 * loadExternalHTML
 */
(function (root) {
	"use strict";
	var loadExternalHTML = function (url, callback, onerror) {
		var cb = function (string) {
			return callback && "function" === typeof callback && callback(string);
		};
		var x = root.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
		x.overrideMimeType("text/html;charset=utf-8");
		x.open("GET", url, true);
		x.withCredentials = false;
		x.onreadystatechange = function () {
			if (x.status === 404 || x.status === 0) {
				console.log("Error XMLHttpRequest-ing file " + url, x.status);
				return onerror && "function" === typeof onerror && onerror();
			} else if (x.readyState === 4 && x.status === 200 && x.responseText) {
				cb(x.responseText);
			}
		};
		x.send(null);
	};
	root.loadExternalHTML = loadExternalHTML;
})("undefined" !== typeof window ? window : this);
/*!
 * includeHTMLintoTarget
 */
(function (root, document) {
	"use strict";
	var includeHTMLintoTarget = function (_thisObj, url, text, callback) {
		var cb = function () {
			return callback && "function" === typeof callback && callback();
		};
		var container = document.getElementById(text.replace(/^#/, "")) || "" || "";
		var arrangeContainer = function () {
			var hideBtn = function () {
				if (_thisObj.parentNode) {
					setDisplayNone(_thisObj.parentNode);
				} else {
					setDisplayNone(_thisObj);
				}
			};
			var processResponse = function (text) {
				var onInserted = function () {
					hideBtn();
					cb();
				};
				insertTextAsFragment(text, container, onInserted);
			};
			var hideAllOnError = function () {
				hideBtn();
				setDisplayNone(container);
			};
			loadExternalHTML(url, function (text) {
				processResponse(text);
			}, function () {
				hideAllOnError();
			});
		};
		if (container) {
			arrangeContainer();
		}
	};
	root.includeHTMLintoTarget = includeHTMLintoTarget;
})("undefined" !== typeof window ? window : this, document);
/*!
 * insertExternalHTML
 */
(function (root, document) {
	"use strict";
	root.insertExternalHTML = function (id, url, callback, onerror) {
		var cb = function () {
			return callback && "function" === typeof callback && callback();
		};
		var container = document.getElementById(id.replace(/^#/, "")) || "";
		var arrange = function () {
			var x = root.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
			x.overrideMimeType("text/html;charset=utf-8");
			x.open("GET", url, true);
			x.withCredentials = false;
			x.onreadystatechange = function () {
				if (x.status === 404 || x.status === 0) {
					console.log("Error XMLHttpRequest-ing file", x.status);
					return onerror && "function" === typeof onerror && onerror();
				} else if (x.readyState === 4 && x.status === 200 && x.responseText) {
					var frag = x.responseText;
					try {
						var clonedContainer = container.cloneNode(false);
						if (container.parentNode) {
							if (document.createRange) {
								var rg = document.createRange();
								rg.selectNode(document.body);
								var df = rg.createContextualFragment(frag);
								clonedContainer.appendChild(df);
								container.parentNode.replaceChild(clonedContainer, container);
							} else {
								clonedContainer.innerHTML = frag;
								container.parentNode.replaceChild(document.createDocumentFragment.appendChild(clonedContainer), container);
							}
						} else {
							container.innerHTML = frag;
						}
						cb();
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
			var whichTransitionEvent = function () {
				var t;
				var el = document.createElement("fakeelement");
				var transitions = {
					"transition": "transitionend",
					"OTransition": "oTransitionEnd",
					"MozTransition": "transitionend",
					"WebkitTransition": "webkitTransitionEnd"
				};
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
})("undefined" !== typeof window ? window : this, document);
/*!
 * modified loadExt
 * @see {@link https://gist.github.com/englishextra/ff9dc7ab002312568742861cb80865c9}
 * passes jshint
 */
(function (root, document) {
	"use strict";
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
})("undefined" !== typeof window ? window : this, document);
/*!
 * loadDeferred
 */
(function (root) {
	"use strict";
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
})("undefined" !== typeof window ? window : this);
/*!
 * app logic
 */
(function (root, document) {
	"use strict";

	var docElem = document.documentElement || "";
	var docImplem = document.implementation || "";
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

		var isActiveMenumoreClass = "ui-menumore--is-active";
		var isActiveQRCodeClass = "holder-location-qrcode--is-active";
		var isActiveShareClass = "holder-share-buttons--is-active";
		var isActiveSidepanelClass = "ui-sidepanel--is-active";
		var isActiveVKLikeClass = "holder-vk-like--is-active";

		removeClass(docElem, "no-js");
		addClass(docElem, "js");

		progressBar.increase(20);

		var earlyDeviceFormfactor = (function (selectors) {
			var orientation;
			var size;
			var f = function (e) {
				var b = e.split(" ");
				if (selectors) {
					var c;
					for (c = 0; c < b.length; c += 1) {
						e = b[c];
						selectors.add(e);
					}
					c = null;
				}
			};
			var g = function (e) {
				var b = e.split(" ");
				if (selectors) {
					var c;
					for (c = 0; c < b.length; c += 1) {
						e = b[c];
						selectors.remove(e);
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
		})(docElem.classList || "");

		var earlyDeviceType = (function (mobile, desktop, opera) {
			var selector = (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i).test(opera) ||
				(/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i).test(opera.substr(0, 4)) ?
				mobile :
				desktop;
			addClass(docElem, selector);
			return selector;
		})("mobile", "desktop", navigator.userAgent || navigator.vendor || (root).opera);

		var earlySvgSupport = (function (selector) {
			selector = docImplem.hasFeature("http://www.w3.org/2000/svg", "1.1") ? selector : "no-" + selector;
			addClass(docElem, selector);
			return selector;
		})("svg");

		var earlySvgasimgSupport = (function (selector) {
			selector = docImplem.hasFeature("http://www.w3.org/TR/SVG11/feature#Image", "1.1") ? selector : "no-" + selector;
			addClass(docElem, selector);
			return selector;
		})("svgasimg");

		var earlyHasTouch = (function (selector) {
			selector = "ontouchstart" in docElem ? selector : "no-" + selector;
			addClass(docElem, selector);
			return selector;
		})("touch");

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

		var LoadingSpinner = (function () {
			var spinnerClass = "loading-spinner";
			var spinner = getByClass(document, spinnerClass)[0] || "";
			var isActiveClass = "loading-spinner--is-active";
			if (!spinner) {
				spinner = document.createElement("div");
				addClass(spinner, spinnerClass);
				appendFragment(spinner, docBody);
			}
			return {
				show: function () {
					return hasClass(docBody, isActiveClass) || addClass(docBody, isActiveClass);
				},
				hide: function (callback, timeout) {
					var delay = timeout || 500;
					var timer = setTimeout(function () {
							clearTimeout(timer);
							timer = null;
							removeClass(docBody, isActiveClass);
							if (callback && "function" === typeof callback) {
								callback();
							}
						}, delay);
				}
			};
		})();

		var manageExternalLinkAll = function () {
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
						if (root.getHTTP && root.getHTTP()) {
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
				for (i = 0, l = link.length; i < l; i += 1) {
					arrange(link[i]);
				}
				i = l = null;
			}
		};
		manageExternalLinkAll();

		var notiBar = function (opt) {
			var notibarClass = "notibar";
			var notibarContainer = getByClass(document, notibarClass)[0] || "";
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
			var i;
			for (i in opt) {
				if (opt.hasOwnProperty(i)) {
					settings[i] = opt[i];
				}
			}
			i = null;
			var cookieKey = Cookies.get(settings.key) || "";
			if (cookieKey && cookieKey === decodeURIComponent(settings.datum)) {
				return;
			}
			if (notibarContainer) {
				removeChildren(notibarContainer);
			} else {
				notibarContainer = document.createElement("div");
				addClass(notibarContainer, notibarClass);
				addClass(notibarContainer, animatedClass);
			}
			var msgContainer = document.createElement("div");
			addClass(msgContainer, messageClass);
			var msgContent = settings.message || "";
			if ("string" === typeof msgContent) {
				msgContent = document.createTextNode(msgContent);
			}
			msgContainer.appendChild(msgContent);
			notibarContainer.appendChild(msgContainer);
			/* var insertCancelSvg = function (targetObj) {
				var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
				var use = document.createElementNS("http://www.w3.org/2000/svg", "use");
				svg.setAttribute("class", "ui-icon");
				use.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#ui-icon-Cancel");
				svg.appendChild(use);
				targetObj.appendChild(svg);
			}, */
			var closeButton = document.createElement("a");
			addClass(closeButton, closeButtonClass);
			/* insertCancelSvg(closeButton); */
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
				var notibarContainer = getByClass(document, notibarClass)[0] || "";
				if (notibarContainer) {
					removeClass(notibarContainer, fadeInDownClass);
					addClass(notibarContainer, fadeOutUpClass);
					removeChildren(notibarContainer);
				}
			};
			var handleCloseButton = function () {
				removeListener(closeButton, "click", handleCloseButton);
				hideMessage();
				setCookie();
			};
			addListener(closeButton, "click", handleCloseButton);
			notibarContainer.appendChild(closeButton);
			if (docBody) {
				appendFragment(notibarContainer, docBody);
				removeClass(notibarContainer, fadeOutUpClass);
				addClass(notibarContainer, fadeInDownClass);
				var timer = setTimeout(function () {
					clearTimeout(timer);
					timer = null;
					hideMessage();
				}, settings.timeout);
			}
		};

		var Notifier42 = function (annonce, timeout, elemClass) {
			var msgObj = annonce || "No message passed as argument";
			var delay = timeout || 0;
			var msgClass = elemClass || "";
			var cls = "notifier42";
			var container = getByClass(document, cls)[0] || "";
			var an = "animated";
			var an2 = "fadeInUp";
			var an4 = "fadeOutDown";
			if (!container) {
				container = document.createElement("div");
				appendFragment(container, docBody);
			}
			addClass(container, cls);
			addClass(container, an);
			addClass(container, an2);
			if (msgClass) {
				addClass(container, msgClass);
			}
			if ("string" === typeof msgObj) {
				msgObj = document.createTextNode(msgObj);
			}
			appendFragment(msgObj, container);
			var clearContainer = function (cb) {
				removeClass(container, an2);
				addClass(container, an4);
				var timer = setTimeout(function () {
					clearTimeout(timer);
					timer = null;
					removeClass(container, an);
					removeClass(container, an4);
					if (msgClass) {
						removeClass(container, msgClass);
					}
					removeChildren(container);
					if (cb && "function" === typeof cb) {
						cb();
					}
				}, 400);
			};
			addListener(container, "click", function handleContainer() {
				removeListener(this, "click", handleContainer);
				clearContainer();
			});
			if (0 !== delay) {
				var timer = setTimeout(function () {
					clearTimeout(timer);
					timer = null;
					clearContainer();
				}, delay);
			}
			return {
				destroy : function () {
					return clearContainer(removeElement.bind(null, container));
				}
			};
		};

		var initNotifier42WriteMe = function () {
			if (root.getHTTP && !root.getHTTP()) {
				return;
			}
			var cookieKey = "_notifier42_write_me_";
			var msgText = "Напишите мне, отвечу очень скоро. Регистрироваться не нужно.";
			var locOrigin = parseLink(root.location.href).origin;
			var showMsg = function () {
				var msgObj = document.createElement("a");
				/* jshint -W107 */
				msgObj.href = "javascript:void(0);";
				appendFragment(msgText, msgObj);
				/* jshint +W107 */
				var handleMsgObj = function (ev) {
					ev.stopPropagation();
					ev.preventDefault();
					removeListener(msgObj, "click", handleMsgObj);
					var targetObj = document.getElementById("disqus_thread") || "";
					scroll2Top((targetObj ? findPos(targetObj).top : 0), 20000);
				};
				addListener(msgObj, "click", handleMsgObj);
				var nf42;
				nf42 = new Notifier42(msgObj, 5000);
				Cookies.set(cookieKey, msgText);
			};
			if (!Cookies.get(cookieKey) && locOrigin) {
				var timer = setTimeout(function () {
					clearTimeout(timer);
					timer = null;
					showMsg();
				}, 8000);
			}
		};
		initNotifier42WriteMe();

		var initSidepanel = function () {
			var btn = getByClass(document, "btn-toggle-ui-sidepanel")[0] || "";
			var page = getByClass(document, "page")[0] || "";
			var container = getByClass(document, "container")[0] || "";
			var overlay = getByClass(document, "page-overlay")[0] || "";
			var panel = getByClass(document, "ui-sidepanel")[0] || "";
			var items = panel ? panel.getElementsByTagName("li") || "" : "";
			var arrange = function () {
				var handleOtherUIElementAll = function () {
					if (hasClass(page, isActiveQRCodeClass)) {
						removeClass(page, isActiveQRCodeClass);
					}
					if (hasClass(page, isActiveVKLikeClass)) {
						removeClass(page, isActiveVKLikeClass);
					}
					if (hasClass(page, isActiveShareClass)) {
						removeClass(page, isActiveShareClass);
					}
					if (hasClass(page, isActiveMenumoreClass)) {
						removeClass(page, isActiveMenumoreClass);
					}
				};
				var handleBtnSidepanel = function (ev) {
					ev.stopPropagation();
					ev.preventDefault();
					toggleClass(page, isActiveSidepanelClass);
					handleOtherUIElementAll();
				};
				var handleOverlaySidepanel = function () {
					if (hasClass(page, isActiveSidepanelClass)) {
						removeClass(page, isActiveSidepanelClass);
					}
					handleOtherUIElementAll();
				};
				var handleContainerSidepanel = function () {
					if (!hasClass(page, isActiveSidepanelClass)) {
						addClass(page, isActiveSidepanelClass);
					}
					handleOtherUIElementAll();
				};
				addListener(btn, "click", handleBtnSidepanel);
				if (root.tocca) {
					if ("undefined" !== typeof earlyHasTouch && "touch" === earlyHasTouch) {
						addListener(overlay, "swipeleft", handleOverlaySidepanel);
						addListener(container, "swiperight", handleContainerSidepanel);
					}
				}
				if (items) {
					var g = function (e) {
						addListener(e, "click", handleOverlaySidepanel);
					};
					var i,
					l;
					for (i = 0, l = items.length; i < l; i += 1) {
						g(items[i]);
					}
					i = l = null;
				}
				addListener(docBody, "click", handleOverlaySidepanel);
			};
			if (docBody && btn && page && container) {
				arrange();
			}
		};
		initSidepanel();

		var highlightSidepanelItem = function () {
			var panel = getByClass(document, "ui-sidepanel-list")[0] || "";
			var items = panel ? panel.getElementsByTagName("a") || "" : "";
			var locHref = root.location.href || "";
			var arrange = function (e) {
				if (locHref === e.href) {
					addClass(e, isActiveClass);
				} else {
					removeClass(e, isActiveClass);
				}
			};
			var addItemHandlerAll = function () {
				var i,
				l;
				for (i = 0, l = items.length; i < l; i += 1) {
					arrange(items[i]);
				}
				i = l = null;
			};
			if (panel && items && locHref) {
				addItemHandlerAll();
			}
		};
		highlightSidepanelItem();
		addListener(root, "hashchange", highlightSidepanelItem);

		var manageMenuMore = function () {
			var btn = getByClass(document, "btn-toggle-ui-menumore")[0] || "";
			var page = getByClass(document, "page")[0] || "";
			var holder = getByClass(document, "ui-menumore")[0] || "";
			var items = holder ? holder.getElementsByTagName("li") || "" : "";
			var arrange = function () {
				var handleOtherUIElementAll = function () {
					if (hasClass(page, isActiveQRCodeClass)) {
						removeClass(page, isActiveQRCodeClass);
					}
					if (hasClass(page, isActiveVKLikeClass)) {
						removeClass(page, isActiveVKLikeClass);
					}
					if (hasClass(page, isActiveShareClass)) {
						removeClass(page, isActiveShareClass);
					}
					if (hasClass(page, isActiveSidepanelClass)) {
						removeClass(page, isActiveSidepanelClass);
					}
				};
				var handleContainer = function (ev) {
					ev.stopPropagation();
					ev.preventDefault();
					toggleClass(page, isActiveMenumoreClass);
					handleOtherUIElementAll();
				};
				addListener(btn, "click", handleContainer);
				var handleItem = function () {
					if (hasClass(page, isActiveMenumoreClass)) {
						removeClass(page, isActiveMenumoreClass);
					}
					handleOtherUIElementAll();
				};
				if (items) {
					var addItemHandler = function (e) {
						addListener(e, "click", handleItem);
					};
					var i,
					l;
					for (i = 0, l = items.length; i < l; i += 1) {
						addItemHandler(items[i]);
					}
					i = l = null;
				}
			};
			if (btn && page) {
				arrange();
			}
		};
		manageMenuMore();

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
			var i = images.length;
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

		var dataSrcIframeClass = "data-src-iframe";

		var dataSrcIframeIsBindedClass = "data-src-iframe--is-binded";

		root.lazyLoadDataSrcIframeInstance = null;

		/*!
		 * @see {@link https://github.com/verlok/lazyload}
		 */
		var manageDataSrcIframeAll = function (callback) {
			var cb = function () {
				return callback && "function" === typeof callback && callback();
			};
			var iframes = getByClass(document, dataSrcIframeClass) || "";
			var i = iframes.length;
			while (i--) {
				if (!hasClass(iframes[i], dataSrcIframeIsBindedClass)) {
					addClass(iframes[i], dataSrcIframeIsBindedClass);
					addClass(iframes[i], isActiveClass);
					addListener(iframes[i], "load", cb);
					iframes[i].setAttribute("frameborder", "no");
					iframes[i].setAttribute("style", "border:none;");
					iframes[i].setAttribute("webkitallowfullscreen", "true");
					iframes[i].setAttribute("mozallowfullscreen", "true");
					iframes[i].setAttribute("scrolling", "no");
					iframes[i].setAttribute("allowfullscreen", "true");
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

		var imgLightboxLinkClass = "img-lightbox-link";

		/*!
		 * @see {@link https://github.com/englishextra/img-lightbox}
		 */
		var manageImgLightbox = function () {
			var link = getByClass(document, imgLightboxLinkClass) || "";
			var initScript = function () {
				imgLightbox(imgLightboxLinkClass, {
					onLoaded: function () {
						LoadingSpinner.hide();
					},
					onClosed: function () {
						LoadingSpinner.hide();
					},
					onCreated: function () {
						LoadingSpinner.show();
					},
					touch: false
				});
			};
			if (root.imgLightbox && link) {
				initScript();
			}
		};
		manageImgLightbox();

		var iframeLightboxLinkClass = "iframe-lightbox-link";

		/*!
		 * @see {@link https://github.com/englishextra/iframe-lightbox}
		 */
		var manageIframeLightbox = function () {
			var link = getByClass(document, iframeLightboxLinkClass) || "";
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
		manageIframeLightbox();

		var manageDataQrcodeImgAll = function () {
			var img = getByClass(document, "data-qrcode-img") || "";
			var generateImg = function (e) {
				var qrcode = e.dataset.qrcode || "";
				qrcode = decodeURIComponent(qrcode);
				if (qrcode) {
					var imgSrc = forcedHTTP + "://chart.googleapis.com/chart?cht=qr&chld=M%7C4&choe=UTF-8&chs=512x512&chl=" + encodeURIComponent(qrcode);
					e.title = qrcode;
					e.alt = qrcode;
					if (root.QRCode) {
						if ("undefined" !== typeof earlySvgSupport && "svg" === earlySvgSupport) {
							imgSrc = QRCode.generateSVG(qrcode, {
									ecclevel: "M",
									fillcolor: "#F3F3F3",
									textcolor: "#191919",
									margin: 4,
									modulesize: 8
								});
							var XMLS = new XMLSerializer();
							imgSrc = XMLS.serializeToString(imgSrc);
							imgSrc = "data:image/svg+xml;base64," + root.btoa(unescape(encodeURIComponent(imgSrc)));
							e.src = imgSrc;
						} else {
							imgSrc = QRCode.generatePNG(qrcode, {
									ecclevel: "M",
									format: "html",
									fillcolor: "#F3F3F3",
									textcolor: "#191919",
									margin: 4,
									modulesize: 8
								});
							e.src = imgSrc;
						}
					} else {
						e.src = imgSrc;
					}
				}
			};
			var initScript = function () {
				var i,
				l;
				for (i = 0, l = img.length; i < l; i += 1) {
					generateImg(img[i]);
				}
				i = l = null;
			};
			if (root.QRCode && img) {
				initScript();
			}
		};
		manageDataQrcodeImgAll();
		/* addListener(root, "load", manageDataQrcodeImgAll); */

		var manageChaptersSelect = function () {
			var chaptersSelect = document.getElementById("chapters-select") || "";
			var handleChaptersSelect = function () {
				var _this = this;
				var hashString = _this.options[_this.selectedIndex].value || "";
				if (hashString) {
					var targetObj = hashString ? (isValidId(hashString, true) ? document.getElementById(hashString.replace(/^#/,"")) || "" : "") : "";
					if (targetObj) {
						scroll2Top((targetObj ? findPos(targetObj).top : 0), 20000);
					} else {
						root.location.href = hashString;
					}
				}
			};
			if (chaptersSelect) {
				addListener(chaptersSelect, "change", handleChaptersSelect);
			}
		};

		var manageSearchInput = function () {
			var searchInput = document.getElementById("text") || "";
			var handleSearchInput = function () {
				var _this = this;
				var logic = function () {
					_this.value = _this.value.replace(/\\/g, "").replace(/ +(?= )/g, " ").replace(/\/+(?=\/)/g, "/") || "";
				};
				debounce(logic, 200).call(root);
			};
			if (searchInput) {
				searchInput.focus();
				addListener(searchInput, "input", handleSearchInput);
			}
		};
		manageSearchInput();

		var manageExpandingLayerAll = function () {
			var btn = getByClass(document, "btn-expand-hidden-layer") || "";
			var handleBtn = function () {
				var _this = this;
				var layer = _this.parentNode ? _this.parentNode.nextElementSibling : "";
				if (layer) {
					toggleClass(_this, isActiveClass);
					toggleClass(layer, isActiveClass);
				}
				return;
			};
			var arrange = function (e) {
				addListener(e, "click", handleBtn);
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

		var manageDataTargetLinks = function () {
			var link = getByClass(document, "data-target-link") || "";
			var arrange = function (e) {
				var onIncluded = function () {
					var timer = setTimeout(function () {
							clearTimeout(timer);
							timer = null;
							manageExternalLinkAll();
							manageImgLightbox();
							manageIframeLightbox();
							manageDataSrcImgAll();
							manageDataSrcIframeAll();
						}, 100);
				};
				var includeUrl = e.dataset.include || "";
				var targetElement = e.dataset.target || "";
				var handleLink = function (ev) {
					ev.stopPropagation();
					ev.preventDefault();
					removeListener(e, "click", handleLink);
					includeHTMLintoTarget(e, includeUrl, targetElement, onIncluded);
				};
				if (includeUrl && targetElement) {
					e.title = "Появится здесь же";
					addListener(e, "click", handleLink);
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

		var manageDebugGridBtn = function () {
			var container = document.getElementById("container") || "";
			var page = document.getElementById("page") || "";
			var btn = getByClass(document, "btn-toggle-col-debug")[0] || "";
			var debugClass = "debug";
			var cookieKey = "_manageDebugGridButton_";
			var cookieDatum = "ok";
			var handleContainer = function () {
				if (container) {
					removeClass(container, debugClass);
					removeListener(container, "click", handleContainer);
				}
			};
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
			var handleBtn = function (ev) {
				ev.stopPropagation();
				ev.preventDefault();
				toggleClass(container, debugClass);
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

		var manageLocationQrcode = function () {
			var btn = getByClass(document, "btn-toggle-holder-location-qrcode")[0] || "";
			var page = getByClass(document, "page")[0] || "";
			var holder = getByClass(document, "holder-location-qrcode")[0] || "";
			var locHref = root.location.href || "";
			var handleOtherUIElementAll = function () {
				if (hasClass(page, isActiveVKLikeClass)) {
					removeClass(page, isActiveVKLikeClass);
				}
				if (hasClass(page, isActiveShareClass)) {
					removeClass(page, isActiveShareClass);
				}
				if (hasClass(page, isActiveSidepanelClass)) {
					removeClass(page, isActiveSidepanelClass);
				}
				if (hasClass(page, isActiveMenumoreClass)) {
					removeClass(page, isActiveMenumoreClass);
				}
			};
			var handleGenerateLocationQrCodeImgBtn = function (ev) {
				ev.stopPropagation();
				ev.preventDefault();
				toggleClass(page, isActiveQRCodeClass);
				handleOtherUIElementAll();
			};
			var removePageIsActiveClass = function () {
				if (hasClass(page, isActiveQRCodeClass)) {
					removeClass(page, isActiveQRCodeClass);
				}
			};
			var handleGenerateLocationQrCodeImgHolder = function () {
				removePageIsActiveClass();
				handleOtherUIElementAll();
			};
			var generateLocationQrCodeImg = function () {
				var locHref = root.location.href || "";
				var img = document.createElement("img");
				var imgTitle = document.title ? ("Ссылка на страницу «" + document.title.replace(/\[[^\]]*?\]/g, "").trim() + "»") : "";
				var imgSrc = forcedHTTP + "://chart.googleapis.com/chart?cht=qr&chld=M%7C4&choe=UTF-8&chs=512x512&chl=" + encodeURIComponent(locHref);
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
			var initScript = function () {
				removePageIsActiveClass();
				addListener(btn, "click", generateLocationQrCodeImg);
				addListener(btn, "click", handleGenerateLocationQrCodeImgBtn);
				addListener(root, "hashchange", generateLocationQrCodeImg);
				addListener(holder, "click", handleGenerateLocationQrCodeImgHolder);
			};
			if (root.QRCode && btn && page && holder && locHref && root.getHTTP && root.getHTTP()) {
				initScript();
			}
		};
		manageLocationQrcode();

		root.yaShare2Instance = null;
		var manageYaShare2Btn = function () {
			var btn = getByClass(document, "btn-toggle-holder-share-buttons")[0] || "";
			var yaShare2Id = "ya-share2";
			var yaShare2 = document.getElementById(yaShare2Id) || "";
			var page = getByClass(document, "page")[0] || "";
			var holder = getByClass(document, "holder-share-buttons")[0] || "";
			var handleBtn = function (ev) {
				ev.stopPropagation();
				ev.preventDefault();
				toggleClass(page, isActiveShareClass);
				if (hasClass(page, isActiveQRCodeClass)) {
					removeClass(page, isActiveQRCodeClass);
				}
				if (hasClass(page, isActiveVKLikeClass)) {
					removeClass(page, isActiveVKLikeClass);
				}
				if (hasClass(page, isActiveSidepanelClass)) {
					removeClass(page, isActiveSidepanelClass);
				}
				if (hasClass(page, isActiveMenumoreClass)) {
					removeClass(page, isActiveMenumoreClass);
				}
				var initScript = function () {
					/*!
					 * remove ya-share2 class in html markup
					 * or you will end up with two copies of Ya.share2
					 */
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
				};
				if (hasClass(page, isActiveShareClass)) {
					if (!(root.Ya && Ya.share2)) {
						var jsUrl = forcedHTTP + "://yastatic.net/share2/share.js";
						var load;
						load = new loadJsCss([jsUrl], initScript);
					} else {
						initScript();
					}
				}
			};
			if (btn && page && holder && yaShare2) {
				if (root.getHTTP && root.getHTTP()) {
					addListener(btn, "click", handleBtn);
				}
			}
		};
		manageYaShare2Btn();

		root.vkLikeInstance = null;
		var manageVkLikeBtn = function () {
			var btn = getByClass(document, "btn-toggle-holder-vk-like")[0] || "";
			var page = getByClass(document, "page")[0] || "";
			var vkLikeId = "vk-like";
			var vkLike = document.getElementById(vkLikeId) || "";
			var handleBtn = function (ev) {
				ev.stopPropagation();
				ev.preventDefault();
				toggleClass(page, isActiveVKLikeClass);
				if (hasClass(page, isActiveQRCodeClass)) {
					removeClass(page, isActiveQRCodeClass);
				}
				if (hasClass(page, isActiveShareClass)) {
					removeClass(page, isActiveShareClass);
				}
				if (hasClass(page, isActiveSidepanelClass)) {
					removeClass(page, isActiveSidepanelClass);
				}
				if (hasClass(page, isActiveMenumoreClass)) {
					removeClass(page, isActiveMenumoreClass);
				}
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
				if (hasClass(page, isActiveVKLikeClass)) {
					if (!(root.VK && VK.init && VK.Widgets && VK.Widgets.Like)) {
						var jsUrl = forcedHTTP + "://vk.com/js/api/openapi.js?154";
						var load;
						load = new loadJsCss([jsUrl], initScript);
					} else {
						initScript();
					}
				}
			};
			if (btn && page && vkLike) {
				if (root.getHTTP && root.getHTTP()) {
					addListener(btn, "click", handleBtn);
				}
			}
		};
		manageVkLikeBtn();

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
					var jsUrl = forcedHTTP + "://" + shortname + ".disqus.com/embed.js";
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
				if (root.getHTTP && root.getHTTP()) {
					addListener(btn, "click", handleBtn);
				} else {
					hide();
				}
			}
		};

		root.ymapsInstance = null;
		var initYandexMap = function (yandexMapId) {
			var yandexMap = document.getElementById(yandexMapId) || "";
			var btnShow = yandexMap ? (document.getElementById(yandexMap.dataset.btnShow) || "") : "";
			var btnDestroy = yandexMap ? (document.getElementById(yandexMap.dataset.btnDestroy) || "") : "";
			var yandexMapCenter = yandexMap ? (yandexMap.dataset.center || "") : "";
			var yandexMapZoom = yandexMap ? (yandexMap.dataset.zoom || "") : "";
			var handleYandexMapBtnDestroy = function (ev) {
				ev.stopPropagation();
				ev.preventDefault();
				removeListener(btnDestroy, "click", handleYandexMapBtnDestroy);
				if (root.ymapsInstance) {
					root.ymapsInstance.destroy();
				}
			};
			var initScript = function () {
				var initMyMap = function () {
					if (root.ymapsInstance) {
						root.ymapsInstance.destroy();
					}
					root.ymapsInstance = new ymaps.Map(yandexMapId, {
							center: JSON.parse(yandexMapCenter),
							zoom: yandexMapZoom
						});
				};
				try {
					ymaps.ready(initMyMap);
					addClass(yandexMap.parentNode, isActiveClass);
					setDisplayNone(btnShow);
				} catch (err) {
					console.log("cannot init ymaps", err);
				}
			};
			if (yandexMap && yandexMapCenter && yandexMapZoom && btnShow) {
				if (root.getHTTP && root.getHTTP()) {
					if (btnDestroy) {
						addListener(btnDestroy, "click", handleYandexMapBtnDestroy);
					}
					if (!root.ymaps) {
						var jsUrl = forcedHTTP + "://api-maps.yandex.ru/2.1/?lang=ru_RU";
						var load;
						load = new loadJsCss([jsUrl], initScript, "js");
					} else {
						initScript();
					}
				} else {
					removeChildren(yandexMap);
					var msgText = document.createRange().createContextualFragment("<p>Карты доступны только в веб версии этой страницы.</p>");
					appendFragment(msgText, yandexMap);
					yandexMap.removeAttribute("id");
					setDisplayNone(btnShow.parentNode);
				}
			}
		};
		var manageYandexMapButton = function (yandexMapId) {
			var yandexMap = document.getElementById(yandexMapId) || "";
			var btnShow = yandexMap ? (document.getElementById(yandexMap.dataset.btnShow) || "") : "";
			var handleBtnShow = function (ev) {
				ev.stopPropagation();
				ev.preventDefault();
				removeListener(btnShow, "click", handleBtnShow);
				initYandexMap(yandexMapId);
				return;
			};
			if (yandexMap && btnShow) {
				addListener(btnShow, "click", handleBtnShow);
			}
		};

		root.kamilInstance = null;
		var manageKamil = function () {
			var searchForm = getByClass(document, "search-form")[0] || "";
			var textInputSelector = "#text";
			var textInput = document.getElementById("text") || "";
			var container = document.getElementById("container") || "";
			var suggestionUlId = "kamil-typo-autocomplete";
			var suggestionUlClass = "kamil-autocomplete";
			var jsonUrl = "../app/libs/pwa-englishextra/json/routes.json";
			var processJsonResponse = function (jsonResponse) {
				var ac;
				try {
					var jsonObj = safelyParseJSON(jsonResponse);
					if (!jsonObj.hashes[0].hasOwnProperty("title")) {
						throw new Error("incomplete JSON data: no title");
					}
					ac = new Kamil(textInputSelector, {
							source: jsonObj.hashes,
							property: "title",
							minChars: 2
						});
				} catch (err) {
					console.log("cannot init generateMenu", err);
					return;
				}
				/*!
				 * create typo suggestion list
				 */
				var suggestionUl = document.createElement("ul");
				var suggestionLi = document.createElement("li");
				var handleTypoSuggestion = function () {
					setDisplayNone(suggestionUl);
					setDisplayNone(suggestionLi);
				};
				var showTypoSuggestion = function () {
					setDisplayBlock(suggestionUl);
					setDisplayBlock(suggestionLi);
				};
				addClass(suggestionUl, suggestionUlClass);
				suggestionUl.id = suggestionUlId;
				handleTypoSuggestion();
				suggestionUl.appendChild(suggestionLi);
				textInput.parentNode.insertBefore(suggestionUl, textInput.nextElementSibling);
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
					while (itemsLength < 1) {
						var textValue = textInput.value;
						if (/[^\u0000-\u007f]/.test(textValue)) {
							textValue = fixEnRuTypo(textValue, "ru", "en");
						} else {
							textValue = fixEnRuTypo(textValue, "en", "ru");
						}
						showTypoSuggestion();
						removeChildren(suggestionLi);
						suggestionLi.appendChild(document.createTextNode("" + textValue));
						if (textValue.match(/^\s*$/)) {
							handleTypoSuggestion();
						}
						if (textInput.value.length < 3 || textInput.value.match(/^\s*$/)) {
							handleTypoSuggestion();
						}
						itemsLength += 1;
					}
					/*!
					 * truncate text
					 */
					var lis = ul ? ul.getElementsByTagName("li") || "" : "";
					var truncateKamilText = function (e) {
						var truncText = e.firstChild.textContent || "";
						var truncTextObj = document.createTextNode(truncString(truncText, 24));
						e.replaceChild(truncTextObj, e.firstChild);
						e.title = "" + truncText;
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
				var handleSuggestionLi = function (ev) {
					ev.stopPropagation();
					ev.preventDefault();
					/*!
					 * set focus first, then set text
					 */
					textInput.focus();
					textInput.value = suggestionLi.firstChild.textContent || "";
					setDisplayNone(suggestionUl);
				};
				addListener(suggestionLi, "click", handleSuggestionLi);
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
						root.location.href = "../app/" + kamilItemLink;
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
			var initScript = function () {
				if (!root.kamilInstance) {
					root.kamilInstance = true;
					loadJsonResponse(jsonUrl, processJsonResponse);
				}
			};
			if (root.Kamil && searchForm && textInput) {
				initScript();
			}
		};
		manageKamil();

		var initRoutie = function () {
			var appContentId = "app-content";
			var appContent = document.getElementById(appContentId) || "";
			var loadVirtualPage = function (c, h, f) {
				if (c && h) {
					LoadingSpinner.show();
					insertExternalHTML(c, h, f);
				}
			};
			var reinitVirtualPage = function (titleString) {
				titleString = titleString || "";
				/*!
				 * hide loading spinner before scrolling
				 */
				document.title = (titleString ? titleString + " - " : "" ) + (initialDocTitle ? initialDocTitle + (userBrowser ? userBrowser : "") : "");
				var timer = setTimeout(function () {
						clearTimeout(timer);
						timer = null;
						manageYandexMapButton("ymap");
						manageDisqusBtn();
						manageExternalLinkAll();
						manageDataTargetLinks();
						manageImgLightbox();
						manageIframeLightbox();
						manageDataQrcodeImgAll();
						manageChaptersSelect();
						manageExpandingLayerAll();
						manageDataSrcImgAll();
					}, 100);
				LoadingSpinner.hide(scroll2Top.bind(null, 0, 20000));
			};
			var loadNotFoundPage = function (containerClass) {
				var container = document.getElementById(containerClass) || "";
				var msgText = document.createRange().createContextualFragment('<div class="padded-content"><div class="col"><div class="row"><div class="column small-12 medium-12 large-12"><p>Нет такой страницы. <a href="#/home">Исправить?</a></p></div></div></div></div>');
				if (container) {
					LoadingSpinner.show();
					removeChildren(container);
					appendFragment(msgText, container);
					reinitVirtualPage("Нет такой страницы");
				}
			};
			/*!
			 * init routie
			 * "#" => ""
			 * "#/" => "/"
			 * "#/home" => "/home"
			 */
			if (appContent) {
				routie({
					"": function () {
						loadVirtualPage(appContentId, "./includes/serguei-eaststreet/home.html", function () {
							reinitVirtualPage("Начало");
						});
					},
					"/home": function () {
						loadVirtualPage(appContentId, "./includes/serguei-eaststreet/home.html", function () {
							reinitVirtualPage("Начало");
						});
					},
					"/schedule": function () {
						if (root.getHTTP && root.getHTTP()) {
							loadVirtualPage(appContentId, "./includes/serguei-eaststreet/schedule.html", function () {
								reinitVirtualPage("Расписание");
							});
						}
					},
					"/map": function () {
						if (root.getHTTP && root.getHTTP()) {
							loadVirtualPage(appContentId, "./includes/serguei-eaststreet/map.html", function () {
								reinitVirtualPage("Карта");
							});
						}
					},
					"/level_test": function () {
						loadVirtualPage(appContentId, "./includes/serguei-eaststreet/level_test.html", function () {
							reinitVirtualPage("Уровневый тест");
						});
					},
					"/common_mistakes": function () {
						loadVirtualPage(appContentId, "./includes/serguei-eaststreet/common_mistakes.html", function () {
							reinitVirtualPage("Распространенные ошибки");
						});
					},
					"/demo_ege": function () {
						loadVirtualPage(appContentId, "./includes/serguei-eaststreet/demo_ege.html", function () {
							reinitVirtualPage("Демо-вариант ЕГЭ-11 АЯ (ПЧ)");
						});
					},
					"/demo_ege_speaking": function () {
						loadVirtualPage(appContentId, "./includes/serguei-eaststreet/demo_ege_speaking.html", function () {
							reinitVirtualPage("Демо-вариант ЕГЭ-11 АЯ (УЧ)");
						});
					},
					"/previous_ege_analysis": function () {
						loadVirtualPage(appContentId, "./includes/serguei-eaststreet/previous_ege_analysis.html", function () {
							reinitVirtualPage("ЕГЭ: разбор ошибок");
						});
					},
					"/*": function () {
						loadNotFoundPage(appContentId);
					}
				});
			}
		};
		initRoutie();

		var manageTotopBtn = function () {
			var btnClass = "btn-totop";
			var btn = getByClass(document, btnClass)[0] || "";
			if (!btn) {
				btn = document.createElement("a");
				addClass(btn, btnClass);
				/* jshint -W107 */
				btn.href = "javascript:void(0);";
				/* jshint +W107 */
				btn.title = "Наверх";
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

	var scripts = [];

	if (needsPolyfills) {
		scripts.push("./cdn/polyfills/js/polyfills.fixed.min.js");
	}

	scripts.push("./libs/serguei-eaststreet/js/vendors.min.js");

	var loadOnFontsReady = function (bodyFontFamily, useCheck) {
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
		if (useCheck && supportsCanvas) {
			slot = setInterval(check, 100);
		} else {
			slot = null;
			init();
		}
	};

	var bodyFontFamily = "Roboto";

	loadDeferred(["./libs/serguei-eaststreet/css/bundle.min.css"], loadOnFontsReady.bind(null, bodyFontFamily, null));
})("undefined" !== typeof window ? window : this, document);
