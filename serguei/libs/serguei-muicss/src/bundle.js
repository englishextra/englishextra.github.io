/*jslint browser: true */
/*jslint node: true */
/*global $readMoreJS, ActiveXObject, addClass, addListener, appendFragment,
console, debounce, DISQUS, doesFontExist, EventEmitter, findPos, forcedHTTP,
getByClass, getHumanDate, hasClass, hasTouch, hasWheel, hljs, IframeLightbox,
imgLightbox, insertExternalHTML, insertFromTemplate, insertTextAsFragment,
instgrm, isNodejs, isElectron, isNwjs, isValidId, JsonHashRouter, LazyLoad,
loadDeferred, loadJsCss, loadJsonResponse, Macy, Minigrid, Mustache,
needsPolyfills, openDeviceBrowser, parseLink, progressBar, Promise, QRCode,
removeChildren, removeClass, removeListener, renderTemplate, require, ripple,
safelyParseJSON, scroll2Top, setDisplayBlock, setDisplayNone, supportsCanvas,
supportsPassive, supportsSvgSmilAnimation, t, throttle, toggleClass, twttr,
unescape, VK, WheelIndicator, Ya*/
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
			root.addEventListener("test", function() {}, opts);
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
 * hasWheel
 */
(function (root, document) {
	"use strict";
	root.hasWheel = "onwheel" in document.createElement("div") || void 0 !== document.onmousewheel || "";
})("undefined" !== typeof window ? window : this, document);
/*!
 * hasTouch
 */
(function (root, document) {
	"use strict";
	root.hasTouch = "ontouchstart" in document.documentElement || "";
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
			if (document.createRange) {
				var rg = document.createRange();
				rg.selectNode(document.body);
				var df = rg.createContextualFragment(text);
				clonedContainer.appendChild(df);
				return container.parentNode ? container.parentNode.replaceChild(clonedContainer, container) : container.innerHTML = text,
				cb();
			} else {
				clonedContainer.innerHTML = text;
				return container.parentNode ? container.parentNode.replaceChild(document.createDocumentFragment.appendChild(clonedContainer), container) : container.innerHTML = text,
				cb();
			}
		} catch (e) {
			console.log(e);
			return;
		}
	};
})("undefined" !== typeof window ? window : this, document);
/*!
 * renderTemplate
 */
(function (root, document) {
	"use strict";
	root.renderTemplate = function (parsedJson, templateId, renderId) {
		var template = document.getElementById(templateId) || "";
		var render = document.getElementById(renderId) || "";
		var jsonObj = safelyParseJSON(parsedJson);
		if (jsonObj && template && render) {
			var templateContent = template.innerHTML || "";
			if (root.t) {
				var parsedTemplate = new t(templateContent);
				return parsedTemplate.render(jsonObj);
			} else {
				if (root.Mustache) {
					Mustache.parse(templateContent);
					return Mustache.render(templateContent, jsonObj);
				}
			}
		}
		return "cannot renderTemplate";
	};
})("undefined" !== typeof window ? window : this, document);
/*!
 * insertFromTemplate
 */
(function (root, document) {
	"use strict";
	root.insertFromTemplate = function (parsedJson, templateId, renderId, callback, useInner) {
		var cb = function () {
			return callback && "function" === typeof callback && callback();
		};
		var _useInner = useInner || "";
		var template = document.getElementById(templateId) || "";
		var render = document.getElementById(renderId) || "";
		if (parsedJson && template && render) {
			var html = renderTemplate(parsedJson, templateId, renderId);
			if (_useInner) {
				render.innerHTML = html;
				cb();
			} else {
				insertTextAsFragment(html, render, cb);
			}
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
						if (document.createRange) {
							var rg = document.createRange();
							rg.selectNode(document.body);
							var df = rg.createContextualFragment(frag);
							clonedContainer.appendChild(df);
							return container.parentNode ? container.parentNode.replaceChild(clonedContainer, container) : container.innerHTML = frag,
							cb();
						} else {
							clonedContainer.innerHTML = frag;
							return container.parentNode ? container.parentNode.replaceChild(document.createDocumentFragment.appendChild(clonedContainer), container) : container.innerHTML = frag,
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
})("undefined" !== typeof window ? window : this, document);
/*!
 * json based hash routing
 * with loading external html into element
 */
/*global ActiveXObject, console */
(function (root, document) {
	"use strict";
	root.JsonHashRouter = (function () {
		return function (jsonUrl, renderId, settings) {
			var options = settings || {};
			options.jsonHomePropName = options.jsonHomePropName || "home";
			options.jsonNotfoundPropName = options.jsonNotfoundPropName || "notfound";
			options.jsonHashesPropName = options.jsonHashesPropName || "hashes";
			options.jsonHrefPropName = options.jsonHrefPropName || "href";
			options.jsonUrlPropName = options.jsonUrlPropName || "url";
			options.jsonTitlePropName = options.jsonTitlePropName || "title";
			var docElem = document.documentElement || "";
			var jsonHashRouterIsBindedClass = "json-hash-router--is-binded";
			var processJsonResponse = function (jsonResponse) {
				var jsonObj;
				try {
					jsonObj = JSON.parse(jsonResponse);
					if (!jsonObj[options.jsonHashesPropName]) {
						throw new Error("incomplete JSON data: no " + options.jsonHashesPropName);
					} else if (!jsonObj[options.jsonHomePropName]) {
						throw new Error("incomplete JSON data: no " + options.jsonHomePropName);
					} else {
						if (!jsonObj[options.jsonNotfoundPropName]) {
							throw new Error("incomplete JSON data: no " + options.jsonNotfoundPropName);
						}
					}
				} catch (err) {
					console.log("cannot init processJsonResponse", err);
					return;
				}
				if ("function" === typeof options.onJsonParsed) {
					options.onJsonParsed(jsonResponse);
				}
				var triggerOnContentInserted = function (jsonObj, titleString) {
					if ("function" === typeof options.onContentInserted) {
						options.onContentInserted(jsonObj, titleString);
					}
				};
				var handleRoutesWindow = function () {
					if ("function" === typeof options.onBeforeContentInserted) {
						options.onBeforeContentInserted();
					}
					var locationHash = root.location.hash || "";
					if (locationHash) {
						var isFound = false;
						var i,
						l;
						for (i = 0, l = jsonObj[options.jsonHashesPropName].length; i < l; i += 1) {
							if (locationHash === jsonObj[options.jsonHashesPropName][i][options.jsonHrefPropName]) {
								isFound = true;
								insertExternalHTML(renderId, jsonObj[options.jsonHashesPropName][i][options.jsonUrlPropName], triggerOnContentInserted.bind(null, jsonObj, jsonObj[options.jsonHashesPropName][i][options.jsonTitlePropName]));
								break;
							}
						}
						i = l = null;
						if (false === isFound) {
							var targetObj = locationHash ? (isValidId(locationHash, true) ? document.getElementById(locationHash.replace(/^#/, "")) || "" : "") : "";
							if (targetObj) {
								root.scrollTo(findPos(targetObj).left, findPos(targetObj).top);
							} else {
								var notfoundUrl = jsonObj[options.jsonNotfoundPropName][options.jsonUrlPropName];
								var notfoundTitle = jsonObj[options.jsonNotfoundPropName][options.jsonTitlePropName];
								if (notfoundUrl && notfoundTitle) {
									insertExternalHTML(renderId, notfoundUrl, triggerOnContentInserted.bind(null, jsonObj, notfoundTitle));
								}
							}
						}
					} else {
						var homeUrl = jsonObj[options.jsonHomePropName][options.jsonUrlPropName];
						var homeTitle = jsonObj[options.jsonHomePropName][options.jsonTitlePropName];
						if (homeUrl && homeTitle) {
							insertExternalHTML(renderId, homeUrl, triggerOnContentInserted.bind(null, jsonObj, homeTitle));
						}
					}
				};
				handleRoutesWindow();
				if (!hasClass(docElem, jsonHashRouterIsBindedClass)) {
					addClass(docElem, jsonHashRouterIsBindedClass);
					addListener(root, "hashchange", handleRoutesWindow);
				}
			};
			var render = document.getElementById(renderId) || "";
			if (render) {
				loadJsonResponse(jsonUrl, processJsonResponse);
			}
		};
	})();
})("undefined" !== typeof window ? window : this, document);
/*!
 * modified Detect Whether a Font is Installed
 * @param {String} fontName The name of the font to check
 * @return {Boolean}
 * @author Kirupa <sam@samclarke.com>
 * @see {@link https://www.kirupa.com/html5/detect_whether_font_is_installed.htm}
 * passes jshint
 */
(function(root, document) {
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
(function(root, document) {
	"use strict";

	var docElem = document.documentElement || "";
	var docImplem = document.implementation || "";
	var docBody = document.body || "";

	addClass(docBody, "hide-sidedrawer");

	if (supportsSvgSmilAnimation) {
		addClass(docElem, "svganimate");
	}

	var run = function () {

		var isActiveClass = "is-active";
		var isBindedClass = "is-binded";
		var isCollapsableClass = "is-collapsable";
		var isFixedClass = "is-fixed";
		var isHiddenClass = "is-hidden";

		removeClass(docElem, "no-js");
		addClass(docElem, "js");

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
			var spinner = document.getElementById("loading-spinner") || "";
			if (!spinner) {
				spinner = document.createElement("div");
				spinner.setAttribute("class", "half-circle-spinner");
				spinner.setAttribute("id", "loading-spinner");
				spinner.setAttribute("aria-hidden", "true");
				spinner.innerHTML = '<div class="circle circle-1"></div><div class="circle circle-2"></div>';
				docBody.appendChild(spinner);
			}
			return {
				show: function () {
					return (spinner.style.display = "block");
				},
				hide: function (callback, timeout) {
					var delay = timeout || 500;
					var timer = setTimeout(function () {
						clearTimeout(timer);
						timer = null;
						setDisplayNone(spinner);
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

		var dataQrcodeImgClass = "data-qrcode-img";

		var manageDataQrcodeImgAll = function (callback) {
			var cb = function () {
				return callback && "function" === typeof callback && callback();
			};
			var img = getByClass(document, dataQrcodeImgClass) || "";
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
					cb();
				}
			};
			if (img) {
				var i,
				l;
				for (i = 0, l = img.length; i < l; i += 1) {
					generateImg(img[i]);
				}
				i = l = null;
			}
		};

		var appEvents = new EventEmitter();

		root.minigridInstance = null;

		var updateMinigrid = function (delay) {
			var timeout = delay || 100;
			var logThis;
			logThis = function () {
				console.log("updateMinigrid");
			};
			if (root.minigridInstance) {
				var timer = setTimeout(function () {
						clearTimeout(timer);
						timer = null;
						/* logThis(); */
						root.minigridInstance.mount();
					}, timeout);
			}
		};

		var updateMinigridThrottled = throttle(updateMinigrid, 1000);

		var manageReadMore = function (callback, options) {
			var cb = function () {
				return callback && "function" === typeof callback && callback();
			};
			var initScript = function () {
				var defaultSettings = {
					target: ".dummy",
					numOfWords: 10,
					toggle: true,
					moreLink: "БОЛЬШЕ",
					lessLink: "МЕНЬШЕ",
					inline: true,
					customBlockElement: "p"
				};
				var settings = options || {};
				var opt;
				for (opt in defaultSettings) {
					if (defaultSettings.hasOwnProperty(opt) && !settings.hasOwnProperty(opt)) {
						settings[opt] = defaultSettings[opt];
					}
				}
				opt = null;
				$readMoreJS.init(settings);
				var rmLink = getByClass(document, "rm-link") || "";
				var arrange = function (e) {
					var rmLinkIsBindedClass = "rm-link--is-binded";
					if (!hasClass(e, rmLinkIsBindedClass)) {
						addClass(e, rmLinkIsBindedClass);
						addListener(e, "click", cb);
					}
				};
				var i,
				l;
				for (i = 0, l = rmLink.length; i < l; i += 1) {
					arrange(rmLink[i]);
				}
				i = l = null;
			};
			if (root.$readMoreJS) {
				initScript();
			}
		};

		var manageExpandingLayerAll = function () {
			var btn = getByClass(document, "btn-expand-hidden-layer") || "";
			var arrange = function (e) {
				var handle = function () {
					var _this = this;
					var s = _this.nextElementSibling || "";
					if (s) {
						toggleClass(_this, isActiveClass);
						toggleClass(s, isActiveClass);
						updateMinigrid();
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

		var appContentId = "app-content";

		var appContent = document.getElementById(appContentId) || "";

		var appContentParent = appContent ? appContent.parentNode ? appContent.parentNode : "" : "";

		var sidedrawer = document.getElementById("sidedrawer") || "";

		var hideSidedrawerClass = "hide-sidedrawer";

		var hideSidedrawer = function () {
			addClass(docBody, hideSidedrawerClass);
			removeClass(sidedrawer, isActiveClass);
		};

		var manageCollapsableAll = function (_self) {
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
			if (sidedrawer && _self !== sidedrawer) {
				hideSidedrawer();
			}
		};
		if (appContentParent) {
			addListener(appContentParent, "click", manageCollapsableAll);
		}
		addListener(root, "hashchange", manageCollapsableAll);

		var manageLocationQrcode = function () {
			var btn = getByClass(document, "btn-toggle-holder-qrcode")[0] || "";
			var holder = getByClass(document, "holder-location-qrcode")[0] || "";
			var locHref = root.location.href || "";
			var hideHolder = function () {
				removeClass(holder, isActiveClass);
			};
			var handleBtn = function (ev) {
				ev.stopPropagation();
				ev.preventDefault();
				manageCollapsableAll(holder);
				var logic = function () {
					toggleClass(holder, isActiveClass);
					var locHref = root.location.href || "";
					var newImg = document.createElement("img");
					var newTitle = document.title ? ("Ссылка на страницу «" + document.title.replace(/\[[^\]]*?\]/g, "").trim() + "»") : "";
					var newSrc = forcedHTTP + "://chart.googleapis.com/chart?cht=qr&chld=M%7C4&choe=UTF-8&chs=512x512&chl=" + encodeURIComponent(locHref);
					newImg.alt = newTitle;
					var initScript = function () {
						if (root.QRCode) {
							if ("undefined" !== typeof earlySvgSupport && "svg" === earlySvgSupport) {
								newSrc = QRCode.generateSVG(locHref, {
										ecclevel: "M",
										fillcolor: "#FFFFFF",
										textcolor: "#212121",
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
										textcolor: "#212121",
										margin: 4,
										modulesize: 8
									});
								newImg.src = newSrc;
							}
						} else {
							newImg.src = newSrc;
						}
						addClass(newImg, "qr-code-img");
						newImg.title = newTitle;
						removeChildren(holder);
						appendFragment(newImg, holder);
					};
					initScript();
				};
				debounce(logic, 200).call(root);
			};
			if (btn && holder && locHref) {
				addClass(holder, isCollapsableClass);
				if (root.getHTTP && root.getHTTP()) {
					addListener(btn, "click", handleBtn);
					if (appContentParent) {
						addListener(appContentParent, "click", hideHolder);
					}
					addListener(root, "hashchange", hideHolder);
				}
			}
		};
		manageLocationQrcode();

		var manageMobileappsBtn = function () {
			var btn = getByClass(document, "btn-toggle-holder-mobileapps-buttons")[0] || "";
			var holder = getByClass(document, "holder-mobileapps-buttons")[0] || "";
			var handleBtn = function (ev) {
				ev.stopPropagation();
				ev.preventDefault();
				var logic = function () {
					toggleClass(holder, isActiveClass);
					addClass(holder, isCollapsableClass);
					manageCollapsableAll(holder);
				};
				debounce(logic, 200).call(root);
			};
			if (btn && holder) {
				if (root.getHTTP && root.getHTTP()) {
					addListener(btn, "click", handleBtn);
				}
			}
		};
		manageMobileappsBtn();

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
					manageCollapsableAll(holder);
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
						var jsUrl = forcedHTTP + "://yastatic.net/share2/share.js";
						var load;
						load = new loadJsCss([jsUrl], initScript);
					} else {
						initScript();
					}
				};
				debounce(logic, 200).call(root);
			};
			if (btn && holder && yaShare2) {
				if (root.getHTTP && root.getHTTP()) {
					addListener(btn, "click", handleBtn);
				}
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
					manageCollapsableAll(holder);
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
						var jsUrl = forcedHTTP + "://vk.com/js/api/openapi.js?154";
						var load;
						load = new loadJsCss([jsUrl], initScript);
					} else {
						initScript();
					}
				};
				debounce(logic, 200).call(root);
			};
			if (btn && holder && vkLike) {
				if (root.getHTTP && root.getHTTP()) {
					addListener(btn, "click", handleBtn);
				}
			}
		};
		manageVkLikeBtn();

		var manageTotopBtn = function () {
			var btnClass = "btn-totop";
			var btn = getByClass(document, btnClass)[0] || "";
			var insertUpSvg = function (e) {
				var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
				var use = document.createElementNS("http://www.w3.org/2000/svg", "use");
				svg.setAttribute("class", "ui-icon");
				use.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#ui-icon-outline-arrow_upward");
				svg.appendChild(use);
				e.appendChild(svg);
			};
			if (!btn) {
				btn = document.createElement("a");
				addClass(btn, btnClass);
				addClass(btn, "mui-btn");
				addClass(btn, "mui-btn--fab");
				addClass(btn, "ripple");
				btn.setAttribute("aria-label", "Навигация");
				/* jshint -W107 */
				btn.href = "javascript:void(0);";
				/* jshint +W107 */
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

		var manageDropdownBtnAll = function () {
			var link = document.getElementsByTagName("a") || "";
			var btn = [];
			var j,
			m;
			for (j = 0, m = link.length; j < m; j += 1) {
				if (link[j].dataset.muiToggle) {
					btn.push(link[j]);
				}
			}
			j = m = null;
			var handleBtn = function (evt) {
				evt.stopPropagation();
				evt.preventDefault();
				var _this = this;
				var menu = _this.nextElementSibling;
				var rect = _this.getBoundingClientRect();
				var top = rect.top + rect.height;
				var left = rect.left;
				var handleLink = function (e) {
					if (e) {
						if (hasClass(e, isActiveClass)) {
							removeClass(e, isActiveClass);
							manageCollapsableAll(e);
						}
					}
				};
				if (menu) {
					menu.style.top = top + "px";
					if (!hasClass(menu, "mui-dropdown__menu--right")) {
						menu.style.left = left + "px";
					}
					if (!hasClass(menu, isActiveClass)) {
						addClass(menu, isActiveClass);
					} else {
						removeClass(menu, isActiveClass);
					}
					manageCollapsableAll(menu);
					var link = menu.getElementsByTagName("a") || "";
					if (link) {
						var i,
						l;
						for (i = 0, l = link.length; i < l; i += 1) {
							addListener(link[i], "click", handleLink.bind(null, menu));
						}
						i = l = null;
					}
				}
			};
			if (btn) {
				var i,
				l;
				for (i = 0, l = btn.length; i < l; i += 1) {
					if (!hasClass(btn[i], isBindedClass) &&
						btn[i].nextElementSibling.nodeName.toLowerCase() === "ul" &&
						btn[i].nextElementSibling.nodeType === 1) {
						addListener(btn[i], "click", handleBtn);
						addClass(btn[i], isBindedClass);
						removeClass(btn[i], isActiveClass);
						addClass(btn[i].nextElementSibling, isCollapsableClass);
					}
				}
				i = l = null;
			}
		};
		manageDropdownBtnAll();

		var hideOnNavigating = function () {
			var hide = function () {
				var menu = getByClass(document, "mui-dropdown__menu") || "";
				if (menu) {
					var i,
					l;
					for (i = 0, l = menu.length; i < l; i += 1) {
						if (hasClass(menu[i], isActiveClass)) {
							removeClass(menu[i], isActiveClass);
						}
					}
					i = l = null;
				}
			};
			if (appContentParent) {
				addListener(appContentParent, "click", hide);
			}
			addListener(root, "resize", hide);
		};
		hideOnNavigating();

		var manageHljs = function () {
			var code = document.getElementsByTagName("code") || "";
			var initScript = function () {
				var i,
				l;
				for (i = 0, l = code.length; i < l; i += 1) {
					if (hasClass(code[i], "hljs") && !hasClass(code[i], isBindedClass)) {
						hljs.highlightBlock(code[i]);
						addClass(code[i], isBindedClass);
					}
				}
				i = l = null;
			};
			if (root.hljs && code) {
				initScript();
			}
		};

		var manageRipple = function () {
			if (root.ripple) {
				ripple.registerRipples();
			}
		};
		manageRipple();

		var setIsActiveClass = function (e) {
			if (e && e.nodeName && !hasClass(e, isActiveClass)) {
				addClass(e, isActiveClass);
			}
		};

		var onHeightChange = function (e, delay, tresholdHeight, callback) {
			var cb = function () {
				return callback && "function" === typeof callback && callback();
			};
			var keyHeight = tresholdHeight || 108;
			var logThis;
			logThis = function (timer, slot, height) {
				console.log("onHeightChange:",
					timer,
					slot,
					keyHeight,
					e.nodeName ? e.nodeName : "",
					e.className ? "." + e.className : "",
					e.id ? "#" + e.id : "",
					height);
			};
			/* destroy operation if for some time
			failed - you should multiply counter
			by set interval slot
			to get milliseconds */
			var counter = 8;
			var slot = delay || 100;
			var timer = setInterval(function () {
					counter--;
					if (counter === 0) {
						clearInterval(timer);
						timer = null;
					}
					var height = e.clientHeight || e.offsetHeight || "";
					/* logThis(timer, slot, height); */
					if (keyHeight < height) {
						clearInterval(timer);
						timer = null;
						/* logThis(timer, slot, height); */
						cb();
					}
				}, slot);
		};

		var minigridItemIsBindedClass = "minigrid__item--is-binded";

		var manageDisqusEmbed = function () {
			var disqusThread = document.getElementById("disqus_thread") || "";
			var disqusThreadIsBindedClass = "disqus-thread--is-binded";
			var locHref = root.location.href || "";
			var shortname = disqusThread ? (disqusThread.dataset.shortname || "") : "";
			var hide = function () {
				removeChildren(disqusThread);
				var replacementText = document.createElement("p");
				replacementText.appendChild(document.createTextNode("Комментарии доступны только в веб версии этой страницы."));
				appendFragment(replacementText, disqusThread);
				disqusThread.removeAttribute("id");
			};
			var initScript = function () {
				try {
					DISQUS.reset({
						reload: true,
						config: function () {
							this.page.identifier = shortname;
							this.page.url = locHref;
						}
					});
					if (!hasClass(disqusThread.parentNode.parentNode, disqusThreadIsBindedClass)) {
						addClass(disqusThread.parentNode.parentNode, disqusThreadIsBindedClass);
						console.log(disqusThread.parentNode.parentNode.className);
						onHeightChange(disqusThread.parentNode.parentNode, 1000, null, setIsActiveClass.bind(null, disqusThread));
					}
				} catch (err) {
					throw new Error("cannot DISQUS.reset " + err);
				}
			};
			if (disqusThread && shortname && locHref) {
				if (root.getHTTP && root.getHTTP()) {
					if (!root.DISQUS) {
						var jsUrl = forcedHTTP + "://" + shortname + ".disqus.com/embed.js";
						var load;
						load = new loadJsCss([jsUrl], initScript);
					} else {
						initScript();
					}
				} else {
					hide();
				}
			}
		};

		var manageInstagramEmbedAll = function () {
			var instagramMediaClass = "instagram-media";
			var instagramMediaIsBindedClass = "instagram-media--is-binded";
			var instagramMedia = getByClass(document, instagramMediaClass)[0] || "";
			var initScript = function () {
				try {
					var instagramMedia = getByClass(document, instagramMediaClass) || "";
					if (instagramMedia) {
						instgrm.Embeds.process();
						var i,
						l;
						for (i = 0, l = instagramMedia.length; i < l; i += 1) {
							if (!hasClass(instagramMedia[i].parentNode, instagramMediaIsBindedClass)) {
								addClass(instagramMedia[i].parentNode, instagramMediaIsBindedClass);
								console.log(instagramMedia[i].parentNode.className);
								onHeightChange(instagramMedia[i].parentNode, 1000, null, setIsActiveClass.bind(null, instagramMedia[i].parentNode));
							}
						}
						i = l = null;
					}
				} catch (err) {
					throw new Error("cannot instgrm.Embeds.process " + err);
				}
			};
			if (instagramMedia) {
				if (!root.instgrm) {
					var jsUrl = forcedHTTP + "://www.instagram.com/embed.js";
					var load;
					load = new loadJsCss([jsUrl], initScript);
				} else {
					initScript();
				}
			}
		};

		var manageTwitterEmbedAll = function () {
			var twitterTweetClass = "twitter-tweet";
			var twitterTweetIsBindedClass = "twitter-tweet--is-binded";
			var twitterTweet = getByClass(document, twitterTweetClass)[0] || "";
			var initScript = function () {
				try {
					var twitterTweet = getByClass(document, twitterTweetClass) || "";
					if (twitterTweet) {
						twttr.widgets.load();
						var i,
						l;
						for (i = 0, l = twitterTweet.length; i < l; i += 1) {
							if (!hasClass(twitterTweet[i].parentNode, twitterTweetIsBindedClass)) {
								addClass(twitterTweet[i].parentNode, twitterTweetIsBindedClass);
								console.log(twitterTweet[i].parentNode.className);
								onHeightChange(twitterTweet[i].parentNode, 1000, null, setIsActiveClass.bind(null, twitterTweet[i].parentNode));
							}
						}
						i = l = null;
					}
				} catch (err) {
					throw new Error("cannot twttr.widgets.load " + err);
				}
			};
			if (twitterTweet) {
				if (!root.twttr) {
					var jsUrl = forcedHTTP + "://platform.twitter.com/widgets.js";
					var load;
					load = new loadJsCss([jsUrl], initScript);
				} else {
					initScript();
				}
			}
		};

		var manageVkEmbedAll = function () {
			var vkPostClass = "vk-post";
			var vkPostIsBindedClass = "vk-post--is-binded";
			var vkPost = getByClass(document, vkPostClass)[0] || "";
			var initScript = function () {
				var initVkPost = function (element_id, owner_id, post_id, hash) {
					if (!VK.Widgets.Post(element_id, owner_id, post_id, hash)) {
						initVkPost();
					}
				};
				try {
					var vkPost = getByClass(document, vkPostClass) || "";
					if (vkPost) {
						var i,
						l;
						for (i = 0, l = vkPost.length; i < l; i += 1) {
							if (!hasClass(vkPost[i].parentNode, vkPostIsBindedClass)) {
								addClass(vkPost[i].parentNode, vkPostIsBindedClass);
								console.log(vkPost[i].parentNode.className);
								onHeightChange(vkPost[i].parentNode, 1000, null, setIsActiveClass.bind(null, vkPost[i].parentNode));
								initVkPost(vkPost[i].id, vkPost[i].dataset.vkOwnerid, vkPost[i].dataset.vkPostid, vkPost[i].dataset.vkHash);
							}
						}
						i = l = null;
					}
				} catch (err) {
					throw new Error("cannot initVkPost " + err);
				}
			};
			if (vkPost) {
				if (!(root.VK && VK.Widgets && VK.Widgets.Post)) {
					var jsUrl = forcedHTTP + "://vk.com/js/api/openapi.js?154";
					var load;
					load = new loadJsCss([jsUrl], initScript);
				} else {
					initScript();
				}
			}
		};

		var anyResizeEventIsBindedClass = "any-resize-event--is-binded";

		appEvents.addListeners("MinigridInited", [manageDataSrcIframeAll.bind(null, updateMinigridThrottled),
				manageDataSrcImgAll.bind(null, updateMinigridThrottled),
				manageDataQrcodeImgAll.bind(null, updateMinigridThrottled),
				manageReadMore.bind(null, updateMinigridThrottled),
				scroll2Top.bind(null, 0, 20000),
				manageInstagramEmbedAll,
				manageTwitterEmbedAll,
				manageVkEmbedAll,
				manageDisqusEmbed]);

		var minigridClass = "minigrid";

		var minigridIsActiveClass = "minigrid--is-active";

		var minigridItemClass = "minigrid__item";

		var initMinigrid = function () {
			var minigrid = getByClass(document, minigridClass)[0] || "";
			if (minigrid) {
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
					appEvents.emitEvent("MinigridInited");
				} catch (err) {
					throw new Error("cannot init Minigrid " + err);
				}
			}
		};

		appEvents.addListeners("MinigridItemsFound", [initMinigrid]);

		var manageMinigrid = function () {
			return new Promise(function (resolve, reject) {
				var minigrid = getByClass(document, minigridClass)[0] || "";
				var initScript = function () {
					var minigridItems = getByClass(minigrid, minigridItemClass) || "";
					var itemLength = minigridItems.length || 0;
					if (minigridItems && !hasClass(minigrid, minigridIsActiveClass)) {
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
						scroll2Top(1, 20000);
						appEvents.emitEvent("MinigridItemsFound");
						resolve("manageMinigrid: found " + itemLength + " cards");
					} else {
						reject("manageMinigrid: no items found");
					}
				};
				if (root.Minigrid && minigrid) {
					initScript();
				}
			});
		};

		root.macyInstance = null;

		var updateMacy = function (delay) {
			var timeout = delay || 100;
			var logThis;
			logThis = function () {
				console.log("updateMacy");
			};
			if (root.macyInstance) {
				var timer = setTimeout(function () {
						clearTimeout(timer);
						timer = null;
						/* logThis(); */
						root.macyInstance.recalculate(true, true);
					}, timeout);
			}
		};

		var updateMacyThrottled = throttle(updateMacy, 1000);

		appEvents.addListeners("MacyInited", [manageDataSrcIframeAll.bind(null, updateMacyThrottled),
				manageDataSrcImgAll.bind(null, updateMacyThrottled),
				manageReadMore.bind(null, updateMinigridThrottled),
				scroll2Top.bind(null, 0, 20000)]);

		var macyClass = "macy";

		var macyItemIsBindedClass = "macy__item--is-binded";

		var macyIsActiveClass = "macy--is-active";

		var initMacy = function () {
			var macy = getByClass(document, macyClass)[0] || "";
			if (macy) {
				try {
					if (root.macyInstance) {
						root.macyInstance.remove();
					}
					root.macyInstance = new Macy({
							container: "." + macyClass,
							trueOrder: false,
							waitForImages: false,
							margin: 0,
							columns: 5,
							breakAt: {
								1280: 5,
								1024: 4,
								960: 3,
								640: 2,
								480: 2,
								360: 1
							}
						});
					addClass(macy, macyIsActiveClass);
					appEvents.emitEvent("MacyInited");
				} catch (err) {
					throw new Error("cannot init Macy " + err);
				}
			}
		};

		appEvents.addListeners("MacyItemsFound", [initMacy]);

		var manageMacy = function () {
			return new Promise(function (resolve, reject) {
				var macy = getByClass(document, macyClass)[0] || "";
				var initScript = function () {
					var macyItems = macy ? (macy.children || macy.querySelectorAll("." + macyClass + " > *") || "") : "";
					var itemLength = macyItems.length || 0;
					if (macyItems && !hasClass(macy, macyIsActiveClass)) {
						var i,
						l;
						for (i = 0, l = macyItems.length; i < l; i += 1) {
							if (!hasClass(macyItems[i], macyItemIsBindedClass)) {
								addClass(macyItems[i], macyItemIsBindedClass);
							}
							if (!hasClass(macyItems[i], anyResizeEventIsBindedClass)) {
								addClass(macyItems[i], anyResizeEventIsBindedClass);
								addListener(macyItems[i], "onresize", updateMacyThrottled, {passive: true});
							}
						}
						i = l = null;
						scroll2Top(1, 20000);
						appEvents.emitEvent("MacyItemsFound");
						resolve("manageMacy: found " + itemLength + " items");
					} else {
						reject("manageMacy: no items found");
					}
				};
				if (root.Macy && macy) {
					initScript();
				}
			});
		};

		var manageSidedrawerCategoryAll = function () {
			var category = sidedrawer ? sidedrawer.getElementsByTagName("strong") || "" : "";
			var handleCategory = function (evt) {
				evt.stopPropagation();
				evt.preventDefault();
				var _this = this;
				var categoryItem = _this.nextElementSibling;
				if (categoryItem) {
					if (categoryItem.style.display === "none") {
						setDisplayBlock(categoryItem);
					} else {
						setDisplayNone(categoryItem);
					}
				}
			};
			if (category) {
				var i,
				l;
				for (i = 0, l = category.length; i < l; i += 1) {
					if (!hasClass(category[i], isBindedClass) &&
						category[i].nextElementSibling.nodeName.toLowerCase() === "ul" &&
						category[i].nextElementSibling.nodeType === 1
						) {
							setDisplayNone(category[i].nextElementSibling);
							addListener(category[i], "click", handleCategory);
							addClass(category[i], isBindedClass);
					}
				}
				i = l = null;
			}
		};

		var hideSidedrawerOnNavigating = function () {
			var link = sidedrawer ? sidedrawer.getElementsByTagName("a") || "" : "";
			if (link) {
				var i,
				l;
				for (i = 0, l = link.length; i < l; i += 1) {
					if (!hasClass(link[i], isBindedClass)) {
						addListener(link[i], "click", hideSidedrawer);
						addClass(link[i], isBindedClass);
					}
				}
				i = l = null;
			}
			if (appContentParent) {
				addListener(appContentParent, "click", hideSidedrawer);
			}
		};

		var manageSidedrawer = function () {
			var btn = getByClass(document, "sidedrawer-toggle") || "";
			var handleBtn = function () {
				if (sidedrawer) {
					if (!hasClass(docBody, hideSidedrawerClass)) {
						addClass(docBody, hideSidedrawerClass);
					} else {
						removeClass(docBody, hideSidedrawerClass);
					}
					if (!hasClass(sidedrawer, isActiveClass)) {
						addClass(sidedrawer, isActiveClass);
					} else {
						removeClass(sidedrawer, isActiveClass);
					}
					manageCollapsableAll(sidedrawer);
				}
			};
			if (btn) {
				var i,
				l;
				for (i = 0, l = btn.length; i < l; i += 1) {
					if (!hasClass(btn[i], isBindedClass)) {
						addListener(btn[i], "click", handleBtn);
						addClass(btn[i], isBindedClass);
					}
				}
				i = l = null;
			}
		};
		manageSidedrawer();

		var highlightSidedrawerItem = function () {
			var sidedrawerCategoriesList = document.getElementById("render_sidedrawer_categories") || "";
			var items = sidedrawerCategoriesList ? sidedrawerCategoriesList.getElementsByTagName("a") || "" : "";
			var locHref = root.location.href || "";
			var arrange = function (e) {
				if (locHref === e.href) {
					addClass(e, isActiveClass);
				} else {
					removeClass(e, isActiveClass);
				}
			};
			var addHandle = function () {
				var i,
				l;
				for (i = 0, l = items.length; i < l; i += 1) {
					arrange(items[i]);
				}
				i = l = null;
			};
			if (sidedrawerCategoriesList && items && locHref) {
				addHandle();
			}
		};
		addListener(root, "hashchange", highlightSidedrawerItem);

		var appBar = document.getElementsByTagName("header")[0] || "";

		var appBarHeight = appBar.offsetHeight || 0;

		var hideAppBar = function () {
			var logic = function () {
				removeClass(appBar, isFixedClass);
				if ((document.body.scrollTop || docElem.scrollTop || 0) > appBarHeight) {
					addClass(appBar, isHiddenClass);
				} else {
					removeClass(appBar, isHiddenClass);
				}
			};
			throttle(logic, 100).call(root);
		};

		var revealAppBar = function () {
			var logic = function () {
				removeClass(appBar, isHiddenClass);
				if ((document.body.scrollTop || docElem.scrollTop || 0) > appBarHeight) {
					addClass(appBar, isFixedClass);
				} else {
					removeClass(appBar, isFixedClass);
				}
			};
			throttle(logic, 100).call(root);
		};

		var resetAppBar = function () {
			var logic = function () {
				if ((document.body.scrollTop || docElem.scrollTop || 0) < appBarHeight) {
					removeClass(appBar, isHiddenClass);
					removeClass(appBar, isFixedClass);
				}
			};
			throttle(logic, 100).call(root);
		};

		if (appBar) {
			addListener(root, "scroll", resetAppBar, {passive: true});
			if (hasTouch) {
				if (root.tocca) {
					addListener(document, "swipeup", hideAppBar, {passive: true});
					addListener(document, "swipedown", revealAppBar, {passive: true});
				}
			} else {
				if (hasWheel) {
					if (root.WheelIndicator) {
						var indicator;
						indicator = new WheelIndicator({
								elem: root,
								callback: function (e) {
									if ("down" === e.direction) {
										hideAppBar();
									}
									if ("up" === e.direction) {
										revealAppBar();
									}
								},
								preventMouse: false
							});
					}
				}
			}
		}

		var managePrevNext = function (jsonObj) {
			var btnPrevPage = getByClass(document, "btn-prev-page")[0] || "";
			var btnNextPage = getByClass(document, "btn-next-page")[0] || "";
			if (btnPrevPage && btnNextPage) {
				var locationHash = root.location.hash || "";
				var prevHash;
				var nextHash;
				if (locationHash) {
					var i,
					l;
					for (i = 0, l = jsonObj.hashes.length; i < l; i += 1) {
						if (locationHash === jsonObj.hashes[i].href) {
							prevHash = i > 0 ? jsonObj.hashes[i - 1].href : jsonObj.hashes[jsonObj.hashes.length - 1].href;
							nextHash = jsonObj.hashes.length > i + 1 ? jsonObj.hashes[i + 1].href : jsonObj.hashes[0].href;
							break;
						}
					}
					i = l = null;
				} else {
					prevHash = jsonObj.hashes[jsonObj.hashes.length - 1].href;
					nextHash = jsonObj.hashes[1].href;
				}
				if (prevHash && nextHash) {
					btnPrevPage.href = prevHash;
					btnNextPage.href = nextHash;
				}
			}
		};

		var jhrouter;
		jhrouter = new JsonHashRouter("./libs/serguei-muicss/json/navigation.min.json", appContentId, {
				jsonHomePropName: "home",
				jsonNotfoundPropName: "notfound",
				jsonHashesPropName: "hashes",
				jsonHrefPropName: "href",
				jsonUrlPropName: "url",
				jsonTitlePropName: "title",
				onJsonParsed: function (jsonResponse) {
					var templateSidedrawerCategoriesId = "template_sitedrawer_categories";
					if (root.t) {
						templateSidedrawerCategoriesId = "t_template_sitedrawer_categories";
					} else {
						if (root.Mustache) {
							templateSidedrawerCategoriesId = "mustache_template_sitedrawer_categories";
						}
					}
					var templateSidedrawerCategories = document.getElementById(templateSidedrawerCategoriesId) || "";
					var renderSidedrawerCategoriesId = "render_sidedrawer_categories";
					var renderSidedrawerCategories = document.getElementById(renderSidedrawerCategoriesId) || "";
					if (templateSidedrawerCategories && renderSidedrawerCategories) {
						insertFromTemplate(jsonResponse, templateSidedrawerCategoriesId, renderSidedrawerCategoriesId, function () {
							manageSidedrawerCategoryAll();
							hideSidedrawerOnNavigating();
						}, true);
					}
					var templateDropdownContactsId = "template_dropdown_contacts";
					if (root.t) {
						templateDropdownContactsId = "t_template_dropdown_contacts";
					} else {
						if (root.Mustache) {
							templateDropdownContactsId = "mustache_template_dropdown_contacts";
						}
					}
					var templateDropdownContacts = document.getElementById(templateDropdownContactsId) || "";
					var renderDropdownContactsId = "render_dropdown_contacts";
					var renderDropdownContacts = document.getElementById(renderDropdownContactsId) || "";
					if (templateDropdownContacts && renderDropdownContacts) {
						insertFromTemplate(jsonResponse, templateDropdownContactsId, renderDropdownContactsId, function () {
							manageDropdownBtnAll();
							manageExternalLinkAll();
						}, true);
					}
					var templateDropdownAdsId = "template_dropdown_ads";
					if (root.t) {
						templateDropdownAdsId = "t_template_dropdown_ads";
					} else {
						if (root.Mustache) {
							templateDropdownAdsId = "mustache_template_dropdown_ads";
						}
					}
					var templateDropdownAds = document.getElementById(templateDropdownAdsId) || "";
					var renderDropdownAdsId = "render_dropdown_ads";
					var renderDropdownAds = document.getElementById(renderDropdownAdsId) || "";
					if (templateDropdownAds && renderDropdownAds) {
						insertFromTemplate(jsonResponse, templateDropdownAdsId, renderDropdownAdsId, function () {
							manageDropdownBtnAll();
							manageExternalLinkAll();
						}, true);
					}
				},
				onContentInserted: function (jsonObj, titleString) {
					document.title = (titleString ? titleString + " - " : "") + (initialDocTitle ? initialDocTitle + (userBrowser ? userBrowser : "") : "");
					if (appContentParent) {
						highlightSidedrawerItem();
						managePrevNext(jsonObj);
						manageExternalLinkAll();
						manageImgLightbox();
						manageIframeLightbox();
						manageDropdownBtnAll();
						manageHljs();
						manageRipple();
						manageExpandingLayerAll();
						manageMacy().then(function (result) {
							console.log(result);
						})
						/* .then(function () {
							manageDataSrcImgAll(updateMacyThrottled);
						}).then(function () {
							manageDataSrcIframeAll(updateMacyThrottled);
						}).then(function () {
							manageDataQrcodeImgAll(updateMacyThrottled);
						})..then(function () {
							scroll2Top(0, 20000);
						}) */
						.catch (function (err) {
							console.log(err);
						});
						manageMinigrid().then(function (result) {
							console.log(result);
						})
						/* .then(function () {
							manageDataSrcImgAll(updateMinigridThrottled);
						}).then(function () {
							manageDataSrcIframeAll(updateMinigridThrottled);
						}).then(function () {
							manageDataQrcodeImgAll(updateMinigridThrottled);
						}).then(function () {
							scroll2Top(0, 20000);
						}) */
						.catch (function (err) {
							console.log(err);
						});
					}
					LoadingSpinner.hide();
					scroll2Top(0, 20000);
				},
				onBeforeContentInserted: function () {
					LoadingSpinner.show();
				}
			});
	};

	var scripts = ["./libs/serguei-muicss/css/bundle.min.css"];

	if (needsPolyfills) {
		scripts.push("./cdn/polyfills/js/polyfills.fixed.min.js");
	}

	scripts.push("./libs/serguei-muicss/js/vendors.min.js");

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

	loadDeferred(["./libs/serguei-muicss/css/vendors.min.css"], loadOnFontsReady.bind(null, bodyFontFamily, null));
})("undefined" !== typeof window ? window : this, document);
