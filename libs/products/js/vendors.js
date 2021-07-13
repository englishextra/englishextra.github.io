function _typeof2(obj) {
	if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
		_typeof2 = function _typeof2(obj) {
			return typeof obj;
		};
	} else {
		_typeof2 = function _typeof2(obj) {
			return obj &&
				typeof Symbol === "function" &&
				obj.constructor === Symbol &&
				obj !== Symbol.prototype
				? "symbol"
				: typeof obj;
		};
	}
	return _typeof2(obj);
}

/*jslint browser: true */

/*jslint node: true */

/*global global, ActiveXObject, define, escape, module, pnotify, Proxy, jQuery, require, self, setImmediate, window */

/*!
 * DoSlide v1.1.4
 * (c) 2017 MopTym <moptym@163.com>
 * Released under the MIT License.
 * Homepage - https://github.com/MopTym/doSlide
 * compile with webpack config from source, set libraryTarget: "var"
 * @see {@link https://webpack.js.org/configuration/output/}
 * cached this in _that beforehand for listener function
 * ~~ can be changed to Math.floor()
 * (0,doSmth)(arg1,arg2) change to doSmth(arg1,arg2)
 * @see {@link https://github.com/MopTym/doSlide/blob/dev/dist/do-slide.js}
 * passes jshint with suppressing comments
 */

/*jshint esnext: true */

/*jshint bitwise: false */
(function(root) {
	var DoSlide = (function(modules) {
		var installedModules = {};

		function __webpack_require__(moduleId) {
			if (installedModules[moduleId]) {
				return installedModules[moduleId].exports;
			}

			var module = (installedModules[moduleId] = {
				exports: {},
				id: moduleId,
				loaded: false
			});
			modules[moduleId].call(
				module.exports,
				module,
				module.exports,
				__webpack_require__
			);
			module.loaded = true;
			return module.exports;
		}

		__webpack_require__.m = modules;
		__webpack_require__.c = installedModules;
		__webpack_require__.p = "";
		return __webpack_require__(0);
	})([
		function(module, exports, __webpack_require__) {
			"use strict";

			var _extends =
				Object.assign ||
				function(target) {
					for (var i = 1; i < arguments.length; i++) {
						var source = arguments[i];

						for (var key in source) {
							if (
								Object.prototype.hasOwnProperty.call(
									source,
									key
								)
							) {
								target[key] = source[key];
							}
						}
					}

					return target;
				};

			var _createClass = (function () {
				function defineProperties(target, props) {
					for (var i = 0; i < props.length; i++) {
						var descriptor = props[i];
						descriptor.enumerable = descriptor.enumerable || false;
						descriptor.configurable = true;

						if ("value" in descriptor) {
							descriptor.writable = true;
						}

						Object.defineProperty(
							target,
							descriptor.key,
							descriptor
						);
					}
				}

				return function (Constructor, protoProps, staticProps) {
					if (protoProps) {
						defineProperties(Constructor.prototype, protoProps);
					}

					if (staticProps) {
						defineProperties(Constructor, staticProps);
					}

					return Constructor;
				};
			})();

			var _config = __webpack_require__(1);

			var _util = __webpack_require__(2);

			function _interopRequireDefault(obj) {
				return obj && obj.__esModule
					? obj
					: {
							default: obj
					  };
			}

			var _util2 = _interopRequireDefault(_util);

			var _init = __webpack_require__(3);

			var _event = __webpack_require__(5);

			var _show = __webpack_require__(4);

			var _keyboard = __webpack_require__(6);

			var _keyboard2 = _interopRequireDefault(_keyboard);

			function _classCallCheck(instance, Constructor) {
				if (!(instance instanceof Constructor)) {
					throw new TypeError("Cannot call a class as a function");
				}
			}

			var DoSlide = (function () {
				function DoSlide() {
					var selector =
						arguments.length > 0 && arguments[0] !== undefined
							? arguments[0]
							: document.createElement("div");
					var config =
						arguments.length > 1 && arguments[1] !== undefined
							? arguments[1]
							: {};

					_classCallCheck(this, DoSlide);

					Object.defineProperty(
						this,
						"_data",
						_config.DATA_DESCRIPTOR
					);
					this.$ = _util2["default"];
					this.callbacks = {
						onChanged: [],
						onBeforeChange: [],
						onOverRange: [],
						onUserMouseWheel: [],
						onUserSwipe: []
					};
					this.userEvent = null;
					this.isChanging = false;
					this.el = selector.nodeType
						? selector
						: document.querySelector(selector);
					this.eventEl = null;
					this.sections = this.el.children;
					this.currentIndex = config.initIndex || 0;
					this.currentSection = this.sections[this.currentIndex];
					this.config = _extends(
						{},
						_config.DEFAULT_CONFIG,
						_config.DEFAULT_INIT_CONFIG
					);
					this.set(config);
					/* (0, _init.init)(this); */

					_init.init(this);
				}

				_createClass(DoSlide, [
					{
						key: "set",
						value: function set(name, value) {
							var config = this.config;

							if (typeof name === "string") {
								config[name] = value;
							} else {
								_extends(config, name);
							}

							return this;
						}
					},
					{
						key: "get",
						value: function get(name) {
							return this.config[name];
						}
					},
					{
						key: "next",
						value: function next() {
							var index = this.config.infinite
								? (this.currentIndex + 1) %
								  this.el.children.length
								: this.currentIndex + 1;
							this.go(index);
							return this;
						}
					},
					{
						key: "prev",
						value: function prev() {
							var index = this.config.infinite
								? (this.currentIndex ||
										this.el.children.length) - 1
								: this.currentIndex - 1;
							this.go(index);
							return this;
						}
					},
					{
						key: "go",
						value: function go(index) {
							/* (0, _show.change)(this, +index || 0); */
							_show.change(this, +index || 0);

							return this;
						}
					},
					{
						key: "do",
						value: function _do(callback) {
							callback.call(
								this,
								this.currentIndex,
								this.currentSection
							);
							return this;
						}
					},
					{
						key: "onChanged",
						value: function onChanged(callback) {
							this.callbacks.onChanged.push(callback);
							return this;
						}
					},
					{
						key: "onBeforeChange",
						value: function onBeforeChange(callback) {
							this.callbacks.onBeforeChange.push(callback);
							return this;
						}
					},
					{
						key: "onOverRange",
						value: function onOverRange(callback) {
							this.callbacks.onOverRange.push(callback);
							return this;
						}
					},
					{
						key: "onUserMouseWheel",
						value: function onUserMouseWheel(callback) {
							this.callbacks.onUserMouseWheel.push(callback);
							return this;
						}
					},
					{
						key: "onUserSwipe",
						value: function onUserSwipe(callback) {
							this.callbacks.onUserSwipe.push(callback);
							return this;
						}
					},
					{
						key: "initSpaceByKey",
						value: function initSpaceByKey(key) {
							Object.defineProperty(this._data, key, {
								enumerable: false,
								configurable: true,
								writable: false,
								value: {}
							});
							return this._data[key];
						}
					},
					{
						key: "getSpaceByKey",
						value: function getSpaceByKey(key) {
							return this._data[key];
						}
					}
				]);

				return DoSlide;
			})();

			DoSlide.from = function (doSlide, selector, config) {
				return new DoSlide(
					selector,
					_extends({}, doSlide.config, config)
				);
			};

			DoSlide.applyNewKey = function () {
				var key = "key" + Date.now() + ~~(Math.random() * 10000);
				return key;
			};

			DoSlide.use = function (plugin, config) {
				if (plugin && plugin.install) {
					plugin.install(DoSlide, config);
				}
			};

			DoSlide.use(_keyboard2["default"]);
			DoSlide.$ = _util2["default"];
			DoSlide.supportedTransition = _util2["default"].getSupportedCSS(
				"transition"
			);
			DoSlide.supportedTransform = _util2["default"].getSupportedCSS(
				"transform"
			);
			module.exports = DoSlide;
		},
		function(module, exports) {
			"use strict";

			Object.defineProperty(exports, "__esModule", {
				value: true
			});
			var DEFAULT_INIT_CONFIG = (exports.DEFAULT_INIT_CONFIG = {
				initIndex: 0,
				initClass: "ds-init",
				activeClass: "active",
				transitionInClass: "transition-in",
				transitionOutClass: "transition-out",
				silent: false,
				horizontal: false,
				infinite: false,
				listenUserMouseWheel: true,
				listenUserSwipe: true,
				eventElemSelector: null
			});
			var DEFAULT_CONFIG = (exports.DEFAULT_CONFIG = {
				duration: 1000,
				timingFunction: "ease",
				minInterval: 50,
				translate3d: true,
				parent: null,
				respondToUserEvent: true,
				stopPropagation: false
			});
			var DATA_DESCRIPTOR = (exports.DATA_DESCRIPTOR = {
				enumerable: false,
				configurable: false,
				writable: false,
				value: {}
			});
		},
		function(module, exports) {
			"use strict";

			Object.defineProperty(exports, "__esModule", {
				value: true
			});

			var _typeof =
				typeof Symbol === "function" &&
				_typeof2(Symbol.iterator) === "symbol"
					? function(obj) {
							return _typeof2(obj);
					  }
					: function(obj) {
							return obj &&
								typeof Symbol === "function" &&
								obj.constructor === Symbol &&
								obj !== Symbol.prototype
								? "symbol"
								: _typeof2(obj);
					  };

			var _extends =
				Object.assign ||
				function(target) {
					for (var i = 1; i < arguments.length; i++) {
						var source = arguments[i];

						for (var key in source) {
							if (
								Object.prototype.hasOwnProperty.call(
									source,
									key
								)
							) {
								target[key] = source[key];
							}
						}
					}

					return target;
				};

			var MAX_TOUCH_TIME = 800;
			var SLIDE_THRESHOLD = 50;

			var util = function util(selector) {
				return new util.prototype.Init(selector);
			};

			util.prototype = {
				constructor: util,
				length: 0,
				Init: function Init(selector) {
					var _this = this;

					if (!selector) {
						return this;
					}

					if (selector instanceof util) {
						return selector;
					}

					if (selector.nodeType) {
						this[0] = selector;
						this.length = 1;
					} else {
						if (typeof selector === "string") {
							selector =
								document.querySelectorAll(selector) || [];
						}

						util.each(selector, function(elem, index) {
							return (_this[index] = elem);
						});
						this.length = selector.length;
					}

					return this;
				}
			};
			util.prototype.Init.prototype = util.prototype;

			_extends(util.prototype, {
				each: function each(
					callback,
					isContext,
					isFalseBreak,
					breakValue
				) {
					return util.each(
						this,
						callback,
						isContext,
						isFalseBreak,
						breakValue
					);
				},
				eq: function eq(index) {
					if (!isNaN(index)) {
						return util(
							this[index < 0 ? this.length + index : index]
						);
					}

					return util();
				},
				on: function on(type, listener) {
					var useCapture =
						arguments.length > 2 && arguments[2] !== undefined
							? arguments[2]
							: false;
					return this.each(function(elem) {
						return util.on(elem, type, listener, useCapture);
					});
				},
				off: function off(type, listener) {
					var useCapture =
						arguments.length > 2 && arguments[2] !== undefined
							? arguments[2]
							: false;
					return this.each(function(elem) {
						return util.off(elem, type, listener, useCapture);
					});
				},
				attr: function attr(name, value) {
					return access(this, util.attr, name);
				},
				css: function css(name, value) {
					return access(this, util.css, name, value);
				},
				removeAttr: function removeAttr(name) {
					return this.each(function(elem) {
						return util.removeAttr(elem, name);
					});
				},
				addClass: function addClass(name) {
					return this.each(function(elem) {
						return util.addClass(elem, name);
					});
				},
				removeClass: function removeClass(name) {
					return this.each(function(elem) {
						return util.removeClass(elem, name);
					});
				},
				hasClass: function hasClass(name) {
					return !this.each(
						function(elem) {
							return !util.hasClass(elem, name);
						},
						false,
						true,
						false
					);
				},
				onMouseWheel: function onMouseWheel(callback, isStopPropFn) {
					return this.each(function(elem) {
						return util.onMouseWheel(elem, callback, isStopPropFn);
					});
				},
				onSwipe: function onSwipe(callback, isStopPropFn) {
					return this.each(function(elem) {
						return util.onSwipe(elem, callback, isStopPropFn);
					});
				}
			});

			_extends(util, {
				each: function each(
					elems,
					fn,
					isContext,
					isFalseBreak,
					breakValue
				) {
					if (isArrayLike(elems)) {
						for (var i = 0, len = elems.length, val; i < len; i++) {
							val = isContext
								? fn.call(elems[i], elems[i], i, elems)
								: fn(elems[i], i, elems);

							if (val === false && isFalseBreak) {
								return breakValue;
							}
						}
					}

					return elems;
				},
				on: function on(elem, type, listener) {
					var useCapture =
						arguments.length > 3 && arguments[3] !== undefined
							? arguments[3]
							: false;

					if (elem) {
						elem.addEventListener(type, listener, useCapture);
					}
				},
				off: function off(elem, type, listener) {
					var useCapture =
						arguments.length > 3 && arguments[3] !== undefined
							? arguments[3]
							: false;

					if (elem) {
						elem.removeEventListener(type, listener, useCapture);
					}
				},
				attr: function attr(elem, name, value) {
					if (elem) {
						if (typeof name === "string") {
							if (isSet(value)) {
								elem.setAttribute(name, value);
							} else {
								return elem.getAttribute(name) || "";
							}
						} else {
							for (var key in name) {
								if (name.hasOwnProperty(key)) {
									elem.setAttribute(key, name[key]);
								}
							}
						}
					}
				},
				css: function css(elem, name, value) {
					if (elem && name) {
						if (typeof name === "string") {
							if (isSet(value)) {
								elem.style[name] = value;
							} else {
								return elem.style[name];
							}
						} else {
							for (var key in name) {
								if (name.hasOwnProperty(key)) {
									elem.style[key] = name[key];
								}
							}
						}
					}
				},
				removeAttr: function removeAttr(elem, name) {
					if (elem) {
						elem.removeAttribute(name);
					}
				},
				addClass: function addClass(elem, name) {
					if (elem && name && !this.hasClass(elem, name)) {
						var cur = this.attr(elem, "class").trim();
						var res = (cur + " " + name).trim();
						this.attr(elem, "class", res);
					}
				},
				removeClass: function removeClass(elem, name) {
					if (elem && name) {
						var reg = new RegExp("\\s*\\b" + name + "\\b\\s*", "g");
						var res = this.attr(elem, "class")
							.replace(reg, " ")
							.trim();
						this.attr(elem, "class", res);
					}
				},
				hasClass: function hasClass(elem, name) {
					return (
						!!(elem && name) &&
						new RegExp("\\b" + name + "\\b").test(
							this.attr(elem, "class")
						)
					);
				}
			});

			function forEach(array, fn, context, breakValue) {
				if (array && fn) {
					for (var i = 0, len = array.length, val; i < len; i++) {
						val = context
							? fn.call(context, array[i], i, array)
							: fn(array[i], i, array);

						if (val === false) {
							return breakValue;
						}
					}
				}
			}

			function keys(obj, fn) {
				var keys = [];

				for (var key in obj) {
					if (obj.hasOwnProperty(key)) {
						keys.push(fn ? fn(key) : key);
					}
				}

				return keys;
			}

			_extends(util, {
				getSupportedCSS: (function () {
					var prefixes = ["", "-webkit-", "-moz-", "-o-", "-ms-"];
					var elem = document.createElement("div");
					var style = elem.style;
					return function (name) {
						var isAutoPrefix =
							arguments.length > 1 && arguments[1] !== undefined
								? arguments[1]
								: true;
						var names = isAutoPrefix
							? prefixes.map(function(prefix) {
									return prefix + name;
							  })
							: [name];
						var supportedName;
						forEach(names, function(name) {
							supportedName =
								style[name] !== undefined
									? name
									: supportedName;
							return supportedName === undefined;
						});
						return supportedName;
					};
				})(),
				onMouseWheel: function onMouseWheel(elem, callback) {
					var isStopPropFn =
						arguments.length > 2 && arguments[2] !== undefined
							? arguments[2]
							: function() {
									return false;
							  };

					if (!elem || !callback) {
						return;
					}

					var lastTime = 0,
						scrollings = [];
					["DOMMouseScroll", "mousewheel"].map(function(mouseWheel) {
						elem.addEventListener(
							mouseWheel,
							function(event) {
								event.preventDefault();

								if (isStopPropFn()) {
									event.stopPropagation();
								}

								var delta = event.detail
									? -event.detail
									: event.wheelDelta;

								if (delta) {
									if (Date.now() - lastTime > 200) {
										scrollings = [];
									}

									lastTime = Date.now();
									scrollings.push(Math.abs(delta));

									if (scrollings.length > 150) {
										scrollings.shift();
									}

									var avgEnd = ~~getAvarage(
										scrollings.slice(-10)
									);
									var avgMiddle = ~~getAvarage(
										scrollings.slice(-70)
									);
									var isAccelerating = avgEnd >= avgMiddle;

									if (isAccelerating) {
										var direction =
											delta < 0 ? "down" : "up";
										callback.call(elem, direction);
									}
								}
							},
							false
						);
					});
				},
				onSwipe: function onSwipe(elem, callback) {
					var isStopPropFn =
						arguments.length > 2 && arguments[2] !== undefined
							? arguments[2]
							: function() {
									return false;
							  };

					if (!elem || !callback) {
						return;
					}

					var startX = void 0,
						startY = void 0,
						startTime = void 0,
						endX = void 0,
						endY = void 0;
					elem.addEventListener(
						"touchstart",
						function(event) {
							if (isStopPropFn()) {
								event.stopPropagation();
							}

							var touch = event.changedTouches[0];
							startX = touch.clientX;
							startY = touch.clientY;
							endX = touch.clientX;
							endY = touch.clientY;
							startTime = Date.now();
						},
						false
					);
					elem.addEventListener(
						"touchmove",
						function(event) {
							if (isStopPropFn()) {
								event.stopPropagation();
							}

							event.preventDefault();

							if (
								!(event.scale && event.scale !== 1) &&
								event.changedTouches.length === 1
							) {
								var touch = event.changedTouches[0];
								endX = touch.clientX;
								endY = touch.clientY;
							}
						},
						false
					);
					elem.addEventListener(
						"touchend",
						function(event) {
							if (isStopPropFn()) {
								event.stopPropagation();
							}

							if (Date.now() - startTime < MAX_TOUCH_TIME) {
								var diffX = endX - startX,
									diffY = endY - startY;
								var absDiffX = Math.abs(diffX),
									absDiffY = Math.abs(diffY);
								var direction = void 0;

								if (
									Math.max(absDiffX, absDiffY) >
									SLIDE_THRESHOLD
								) {
									if (absDiffX > absDiffY) {
										direction =
											diffX > 0 ? "right" : "left";
									} else {
										direction = diffY > 0 ? "down" : "up";
									}

									callback.call(elem, direction);
								}
							}
						},
						false
					);
				},
				forEach: forEach,
				keys: keys
			});

			function getAvarage(array) {
				if (!array.length) {
					return 0;
				}

				var sum = Array.prototype.reduce.call(array, function(
					last,
					item
				) {
					return last + item;
				});
				return sum / array.length;
			}

			function isArrayLike(tar) {
				return (
					(typeof tar === "undefined"
						? "undefined"
						: _typeof(tar)) === "object" && isSet(tar.length)
				);
			}

			function access(elems, fn, key, value) {
				if (
					isSet(value) ||
					(typeof key === "undefined"
						? "undefined"
						: _typeof(key)) === "object"
				) {
					util.each(elems, function(elem) {
						return fn(elem, key, value);
					});
					return elems;
				} else {
					return elems.length ? fn(elems[0], key) : undefined;
				}
			}

			function isSet(tar) {
				return typeof tar !== "undefined";
			}

			exports["default"] = util;
		},
		function(module, exports, __webpack_require__) {
			"use strict";

			Object.defineProperty(exports, "__esModule", {
				value: true
			});
			exports.init = undefined;

			var _util = __webpack_require__(2);

			function _interopRequireDefault(obj) {
				return obj && obj.__esModule
					? obj
					: {
							default: obj
					  };
			}

			var _util2 = _interopRequireDefault(_util);

			var _show = __webpack_require__(4);

			var _event = __webpack_require__(5);

			function init(doSlide) {
				if (!doSlide.config.silent) {
					/* (0, _show.initSections)(doSlide, doSlide.config.initIndex || 0); */
					_show.initSections(doSlide, doSlide.config.initIndex || 0);
				}

				if (doSlide.config.eventElemSelector !== false) {
					/* (0, _event.startListen)(doSlide); */
					_event.startListen(doSlide);
				}

				_util2["default"].removeClass(
					doSlide.el,
					doSlide.config.initClass
				);
			}

			exports.init = init;
		},
		function(module, exports, __webpack_require__) {
			"use strict";

			Object.defineProperty(exports, "__esModule", {
				value: true
			});
			exports.change = exports.initSections = undefined;

			var _util = __webpack_require__(2);

			function _interopRequireDefault(obj) {
				return obj && obj.__esModule
					? obj
					: {
							default: obj
					  };
			}

			var _util2 = _interopRequireDefault(_util);

			var _event = __webpack_require__(5);

			var supportedTransition = _util2["default"].getSupportedCSS(
				"transition"
			);

			var supportedTransform = _util2["default"].getSupportedCSS(
				"transform"
			);

			var isSupport3d = (function () {
				var has3d = false;

				if (supportedTransform && window.getComputedStyle) {
					var el = document.createElement("div");
					document.body.insertBefore(el, null);
					el.style[supportedTransform] = "translate3d(1%, 1%, 0)";
					has3d = window
						.getComputedStyle(el)
						.getPropertyValue(supportedTransform);
					document.body.removeChild(el);
				}

				return has3d && has3d !== "none";
			})();

			function initSections(doSlide, initIndex) {
				/* var $container = (0, _util2.default)(doSlide.el); */
				var $container = _util2["default"](doSlide.el);
				/* var $sections = (0, _util2.default)(doSlide.sections); */

				var $sections = _util2["default"](doSlide.sections);

				if (doSlide.config.horizontal) {
					$container.css("width", $sections.length + "00%");
					$sections.css({
						width: 100 / $sections.length + "%",
						float: "left"
					});
				} else {
					$container.css("height", $sections.length + "00%");
					$sections.css("height", 100 / $sections.length + "%");
				}

				showSection(doSlide, initIndex, true);
			}

			function showSection(doSlide, index, isImmediate) {
				var cur = doSlide.currentSection;
				var tar = doSlide.sections[index];
				var config = doSlide.config;
				var busyTime =
					config.minInterval +
					(supportedTransition ? config.duration : 0);
				busyTime = isImmediate ? 0 : busyTime;
				doSlide.isChanging = true;

				if (!doSlide.config.silent) {
					setActiveClass(doSlide, index);

					if (!isImmediate) {
						toggleTransitionClass(config, cur, tar, true);
					}

					transform(doSlide, index, isImmediate);
				}

				setTimeout(function () {
					if (!config.silent && !isImmediate) {
						toggleTransitionClass(config, cur, tar, false);
					}

					doSlide.isChanging = false;
				}, busyTime);
				return busyTime;
			}

			function toggleTransitionClass(config, cur, tar, isAdd) {
				if (isAdd) {
					_util2["default"].addClass(cur, config.transitionOutClass);

					_util2["default"].addClass(tar, config.transitionInClass);
				} else {
					_util2["default"].removeClass(
						cur,
						config.transitionOutClass
					);

					_util2["default"].removeClass(
						tar,
						config.transitionInClass
					);
				}
			}

			function setActiveClass(doSlide, index) {
				/* (0, _util2.default)(doSlide.sections).each(function (section, i) { */
				_util2["default"](doSlide.sections).each(function(section, i) {
					if (i === index) {
						_util2["default"].addClass(
							section,
							doSlide.config.activeClass
						);
					} else {
						_util2["default"].removeClass(
							section,
							doSlide.config.activeClass
						);
					}
				});
			}

			function change(doSlide, index) {
				if (canChangeNow(doSlide, index)) {
					if (isOverRange(doSlide, index)) {
						doingOnOverRange(doSlide, index);
						/* } else if ((0, _event.executeUserEventCallbacks)(doSlide)) { */
					} else if (_event.executeUserEventCallbacks(doSlide)) {
						var lastIndex = doSlide.currentIndex;
						/* var isOK = (0, _event.executeEventCallbacks)(doSlide, { */

						var isOK = _event.executeEventCallbacks(doSlide, {
							name: "onBeforeChange",
							args: [
								lastIndex,
								index,
								doSlide.currentSection,
								doSlide.sections[index]
							]
						});

						if (isOK) {
							var busyTime = showSection(doSlide, index);
							doSlide.currentIndex = index;
							doSlide.currentSection = doSlide.sections[index];
							setTimeout(function () {
								/* (0, _event.executeEventCallbacks)(doSlide, { */
								_event.executeEventCallbacks(doSlide, {
									name: "onChanged",
									args: [
										index,
										lastIndex,
										doSlide.currentSection,
										doSlide.sections[lastIndex]
									]
								});
							}, busyTime);
						}
					}
				}
			}

			function canChangeNow(doSlide, index) {
				return !doSlide.isChanging && index !== doSlide.currentIndex;
			}

			function isOverRange(doSlide, index) {
				return index < 0 || index >= doSlide.sections.length;
			}

			function doingOnOverRange(doSlide, index) {
				var parent = doSlide.config.parent;
				/* var isOK = (0, _event.executeEventCallbacks)(doSlide, { */

				var isOK = _event.executeEventCallbacks(doSlide, {
					name: "onOverRange",
					args: [doSlide.currentIndex, index, doSlide.currentSection]
				});

				if (isOK && parent) {
					if (index < 0) {
						parent.prev();
					} else {
						parent.next();
					}
				}
			}

			function transform(doSlide, index, isImmediate) {
				var config = doSlide.config;

				if (supportedTransform) {
					if (supportedTransition) {
						var transition =
							supportedTransform +
							" " +
							(config.timingFunction || "") +
							" " +
							config.duration +
							"ms";
						var transitionClean = supportedTransform + " 0ms";

						_util2["default"].css(
							doSlide.el,
							supportedTransition,
							isImmediate ? transitionClean : transition
						);
					}

					var offset = (-index * 100) / doSlide.sections.length + "%";
					var translate = config.horizontal
						? offset + ",0"
						: "0," + offset;
					translate =
						isSupport3d && config.translate3d
							? "translate3d(" + translate + ",0)"
							: "translate(" + translate + ")";

					_util2["default"].css(
						doSlide.el,
						supportedTransform,
						translate
					);
				} else {
					_util2["default"].css(
						doSlide.el,
						config.horizontal ? "left" : "top",
						-index + "00%"
					);
				}
			}

			exports.initSections = initSections;
			exports.change = change;
		},
		function(module, exports, __webpack_require__) {
			"use strict";

			Object.defineProperty(exports, "__esModule", {
				value: true
			});
			exports.executeUserEventCallbacks = exports.executeEventCallbacks = exports.startListen = undefined;

			var _util = __webpack_require__(2);

			function _interopRequireDefault(obj) {
				return obj && obj.__esModule
					? obj
					: {
							default: obj
					  };
			}

			var _util2 = _interopRequireDefault(_util);

			function executeUserEventCallbacks(doSlide) {
				var event = doSlide.userEvent;

				if (event) {
					doSlide.userEvent = null;
					var callbacks = doSlide.callbacks[event.name];
					var ret = execute(callbacks, event.args, doSlide, false);
					return ret !== false;
				}

				return true;
			}

			function executeEventCallbacks(doSlide, event) {
				var callbacks = doSlide.callbacks[event.name];
				var ret = execute(callbacks, event.args, doSlide, false);
				return ret !== false;
			}

			function execute(callbacks, args, context, breakValue) {
				return _util2["default"].forEach(
					callbacks,
					function(callback) {
						return callback.apply(context, args);
					},
					null,
					breakValue
				);
			}

			function startListen(doSlide) {
				determineEventElem(doSlide);

				if (doSlide.config.listenUserMouseWheel) {
					listenUserMouseWheel(doSlide, doSlide.eventEl);
				}

				if (doSlide.config.listenUserSwipe) {
					listenUserSwipe(doSlide, doSlide.eventEl);
				}
			}

			function determineEventElem(doSlide) {
				var selector = doSlide.config.eventElemSelector;

				if (selector === null) {
					doSlide.eventEl = doSlide.el;
				} else {
					doSlide.eventEl = selector.nodeType
						? selector
						: document.querySelector(selector);
				}
			}

			function listenUserMouseWheel(doSlide, eventElem) {
				_util2["default"].onMouseWheel(
					eventElem,
					function(direction) {
						if (
							!doSlide.config.respondToUserEvent ||
							doSlide.isChanging
						) {
							return;
						}

						doSlide.userEvent = {
							name: "onUserMouseWheel",
							args: [direction]
						};

						if (direction === "down") {
							doSlide.next();
						} else {
							doSlide.prev();
						}
					},
					function() {
						return doSlide.config.stopPropagation;
					}
				);
			}

			function listenUserSwipe(doSlide, eventElem) {
				_util2["default"].onSwipe(
					eventElem,
					function(direction) {
						if (
							!doSlide.config.respondToUserEvent ||
							doSlide.isChanging
						) {
							return;
						}

						doSlide.userEvent = {
							name: "onUserSwipe",
							args: [direction]
						};

						if (doSlide.config.horizontal) {
							if (direction === "left") {
								doSlide.next();
							}

							if (direction === "right") {
								doSlide.prev();
							}
						} else {
							if (direction === "up") {
								doSlide.next();
							}

							if (direction === "down") {
								doSlide.prev();
							}
						}
					},
					function() {
						return doSlide.config.stopPropagation;
					}
				);
			}

			exports.startListen = startListen;
			exports.executeEventCallbacks = executeEventCallbacks;
			exports.executeUserEventCallbacks = executeUserEventCallbacks;
		},
		function(module, exports) {
			"use strict";

			Object.defineProperty(exports, "__esModule", {
				value: true
			});

			var _createClass = (function () {
				function defineProperties(target, props) {
					for (var i = 0; i < props.length; i++) {
						var descriptor = props[i];
						descriptor.enumerable = descriptor.enumerable || false;
						descriptor.configurable = true;

						if ("value" in descriptor) {
							descriptor.writable = true;
						}

						Object.defineProperty(
							target,
							descriptor.key,
							descriptor
						);
					}
				}

				return function (Constructor, protoProps, staticProps) {
					if (protoProps) {
						defineProperties(Constructor.prototype, protoProps);
					}

					if (staticProps) {
						defineProperties(Constructor, staticProps);
					}

					return Constructor;
				};
			})();

			function _classCallCheck(instance, Constructor) {
				if (!(instance instanceof Constructor)) {
					throw new TypeError("Cannot call a class as a function");
				}
			}

			var Keyboard = (function () {
				function Keyboard(doSlide, key) {
					_classCallCheck(this, Keyboard);

					this.eventType = "keydown";
					this.eventElement = window;
					this["for"] = doSlide;
					this.$ = doSlide.$;
					this.isOn = false;
					this.listener = listener.bind(this);
					this.mappings = [
						{
							filter: filterByKeyCode(40),
							action: function action() {
								if (!this.config.horizontal) {
									this.next();
								}
							}
						},
						{
							filter: filterByKeyCode(38),
							action: function action() {
								if (!this.config.horizontal) {
									this.prev();
								}
							}
						},
						{
							filter: filterByKeyCode(39),
							action: function action() {
								if (this.config.horizontal) {
									this.next();
								}
							}
						},
						{
							filter: filterByKeyCode(37),
							action: function action() {
								if (this.config.horizontal) {
									this.prev();
								}
							}
						}
					];
				}

				_createClass(Keyboard, [
					{
						key: "setEventType",
						value: function setEventType(eventType) {
							if (eventType !== this.eventType) {
								var isOn = this.isOn;

								if (isOn) {
									this.turnOff();
								}

								this.eventType = eventType;

								if (isOn) {
									this.turnOn();
								}
							}

							return this;
						}
					},
					{
						key: "setEventElement",
						value: function setEventElement(elem) {
							if (elem !== this.eventElement) {
								var isOn = this.isOn;

								if (isOn) {
									this.turnOff();
								}

								this.eventElement = elem;

								if (isOn) {
									this.turnOn();
								}
							}

							return this;
						}
					},
					{
						key: "getMappings",
						value: function getMappings() {
							return this.mappings;
						}
					},
					{
						key: "setMappings",
						value: function setMappings(mappings) {
							this.mappings = mappings;
							return this;
						}
					},
					{
						key: "turnOn",
						value: function turnOn() {
							if (!this.isOn) {
								this.$.on(
									this.eventElement,
									this.eventType,
									this.listener,
									false
								);
								this.isOn = true;
							}

							return this;
						}
					},
					{
						key: "turnOff",
						value: function turnOff() {
							if (this.isOn) {
								this.$.off(
									this.eventElement,
									this.eventType,
									this.listener,
									false
								);
								this.isOn = false;
							}

							return this;
						}
					}
				]);

				return Keyboard;
			})();

			function filterByKeyCode(keyCode) {
				return function (event) {
					return event.keyCode === keyCode;
				};
			}

			var listener = function listener(event) {
				var mappings = this.mappings || [];
				var doSlide = this["for"];
				mappings.forEach(function(mapping) {
					if (mapping.filter.call(doSlide, event) === true) {
						mapping.action.call(doSlide, event);
					}
				});
			};

			function install(DoSlide) {
				DoSlide.prototype.getKeyboard = (function () {
					var key = DoSlide.applyNewKey();
					return function () {
						var space = this.getSpaceByKey(key);

						if (!space) {
							space = this.initSpaceByKey(key);
							space.res = new Keyboard(this, key);
						}

						return space.res;
					};
				})();
			}

			exports["default"] = {
				install: install
			};
		}
	]);

	root.DoSlide = DoSlide;
})("undefined" !== typeof window ? window : this);
/*jshint esnext: false */

/*jshint bitwise: true */

/*!
 * modified qr.js -- QR code generator in Javascript (revision 2011-01-19)
 * Written by Kang Seonghoon <public+qrjs@mearie.org>.
 * v0.0.20110119
 * This source code is in the public domain; if your jurisdiction does not
 * recognize the public domain the terms of Creative Commons CC0 license
 * apply. In the other words, you can always do what you want.
 * added options properties: fillcolor and textcolor
 * svg now works in Edge 13 and IE 11
 * @see {@link https://gist.github.com/englishextra/b46969e3382ef737c611bb59d837220b}
 * @see {@link https://github.com/lifthrasiir/qr.js/blob/v0.0.20110119/qr.js}
 * passes jshint with suppressing comments
 */

/*jshint bitwise: false */
(function(root, document) {
	"use strict";

	var length = "length";
	var VERSIONS = [
		null,
		[[10, 7, 17, 13], [1, 1, 1, 1], []],
		[[16, 10, 28, 22], [1, 1, 1, 1], [4, 16]],
		[[26, 15, 22, 18], [1, 1, 2, 2], [4, 20]],
		[[18, 20, 16, 26], [2, 1, 4, 2], [4, 24]],
		[[24, 26, 22, 18], [2, 1, 4, 4], [4, 28]],
		[[16, 18, 28, 24], [4, 2, 4, 4], [4, 32]],
		[[18, 20, 26, 18], [4, 2, 5, 6], [4, 20, 36]],
		[[22, 24, 26, 22], [4, 2, 6, 6], [4, 22, 40]],
		[[22, 30, 24, 20], [5, 2, 8, 8], [4, 24, 44]],
		[[26, 18, 28, 24], [5, 4, 8, 8], [4, 26, 48]],
		[[30, 20, 24, 28], [5, 4, 11, 8], [4, 28, 52]],
		[[22, 24, 28, 26], [8, 4, 11, 10], [4, 30, 56]],
		[[22, 26, 22, 24], [9, 4, 16, 12], [4, 32, 60]],
		[[24, 30, 24, 20], [9, 4, 16, 16], [4, 24, 44, 64]],
		[[24, 22, 24, 30], [10, 6, 18, 12], [4, 24, 46, 68]],
		[[28, 24, 30, 24], [10, 6, 16, 17], [4, 24, 48, 72]],
		[[28, 28, 28, 28], [11, 6, 19, 16], [4, 28, 52, 76]],
		[[26, 30, 28, 28], [13, 6, 21, 18], [4, 28, 54, 80]],
		[[26, 28, 26, 26], [14, 7, 25, 21], [4, 28, 56, 84]],
		[[26, 28, 28, 30], [16, 8, 25, 20], [4, 32, 60, 88]],
		[[26, 28, 30, 28], [17, 8, 25, 23], [4, 26, 48, 70, 92]],
		[[28, 28, 24, 30], [17, 9, 34, 23], [4, 24, 48, 72, 96]],
		[[28, 30, 30, 30], [18, 9, 30, 25], [4, 28, 52, 76, 100]],
		[[28, 30, 30, 30], [20, 10, 32, 27], [4, 26, 52, 78, 104]],
		[[28, 26, 30, 30], [21, 12, 35, 29], [4, 30, 56, 82, 108]],
		[[28, 28, 30, 28], [23, 12, 37, 34], [4, 28, 56, 84, 112]],
		[[28, 30, 30, 30], [25, 12, 40, 34], [4, 32, 60, 88, 116]],
		[[28, 30, 30, 30], [26, 13, 42, 35], [4, 24, 48, 72, 96, 120]],
		[[28, 30, 30, 30], [28, 14, 45, 38], [4, 28, 52, 76, 100, 124]],
		[[28, 30, 30, 30], [29, 15, 48, 40], [4, 24, 50, 76, 102, 128]],
		[[28, 30, 30, 30], [31, 16, 51, 43], [4, 28, 54, 80, 106, 132]],
		[[28, 30, 30, 30], [33, 17, 54, 45], [4, 32, 58, 84, 110, 136]],
		[[28, 30, 30, 30], [35, 18, 57, 48], [4, 28, 56, 84, 112, 140]],
		[[28, 30, 30, 30], [37, 19, 60, 51], [4, 32, 60, 88, 116, 144]],
		[[28, 30, 30, 30], [38, 19, 63, 53], [4, 28, 52, 76, 100, 124, 148]],
		[[28, 30, 30, 30], [40, 20, 66, 56], [4, 22, 48, 74, 100, 126, 152]],
		[[28, 30, 30, 30], [43, 21, 70, 59], [4, 26, 52, 78, 104, 130, 156]],
		[[28, 30, 30, 30], [45, 22, 74, 62], [4, 30, 56, 82, 108, 134, 160]],
		[[28, 30, 30, 30], [47, 24, 77, 65], [4, 24, 52, 80, 108, 136, 164]],
		[[28, 30, 30, 30], [49, 25, 81, 68], [4, 28, 56, 84, 112, 140, 168]]
	];
	var MODE_TERMINATOR = 0;
	var MODE_NUMERIC = 1,
		MODE_ALPHANUMERIC = 2,
		MODE_OCTET = 4,
		MODE_KANJI = 8;
	var NUMERIC_REGEXP = /^\d*$/;
	var ALPHANUMERIC_REGEXP = /^[A-Za-z0-9 $%*+\-./:] * $ /;
	var ALPHANUMERIC_OUT_REGEXP = /^[A-Z0-9 $%*+\-./:] * $ /;
	var ECCLEVEL_L = 1,
		ECCLEVEL_M = 0,
		ECCLEVEL_Q = 3,
		ECCLEVEL_H = 2;
	var GF256_MAP = [],
		GF256_INVMAP = [-1];

	for (var i1 = 0, v = 1; i1 < 255; ++i1) {
		GF256_MAP.push(v);
		GF256_INVMAP[v] = i1;
		v = (v * 2) ^ (v >= 128 ? 0x11d : 0);
	}

	var GF256_GENPOLY = [[]];

	for (var i2 = 0; i2 < 30; ++i2) {
		var prevpoly = GF256_GENPOLY[i2],
			poly = [];

		for (var j1 = 0; j1 <= i2; ++j1) {
			var a = j1 < i2 ? GF256_MAP[prevpoly[j1]] : 0;
			var b = GF256_MAP[(i2 + (prevpoly[j1 - 1] || 0)) % 255];
			poly.push(GF256_INVMAP[a ^ b]);
		}

		GF256_GENPOLY.push(poly);
	}

	var ALPHANUMERIC_MAP = {};

	for (var i = 0; i < 45; ++i) {
		ALPHANUMERIC_MAP[
			"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:".charAt(i)
		] = i;
	}

	var MASKFUNCS = [
		function(i, j) {
			return (i + j) % 2 === 0;
		},
		function(i) {
			return i % 2 === 0;
		},
		function(i, j) {
			return j % 3 === 0;
		},
		function(i, j) {
			return (i + j) % 3 === 0;
		},
		function(i, j) {
			return (((i / 2) | 0) + ((j / 3) | 0)) % 2 === 0;
		},
		function(i, j) {
			return ((i * j) % 2) + ((i * j) % 3) === 0;
		},
		function(i, j) {
			return (((i * j) % 2) + ((i * j) % 3)) % 2 === 0;
		},
		function(i, j) {
			return (((i + j) % 2) + ((i * j) % 3)) % 2 === 0;
		}
	];

	var needsverinfo = function needsverinfo(ver) {
		return ver > 6;
	};

	var getsizebyver = function getsizebyver(ver) {
		return 4 * ver + 17;
	};

	var nfullbits = function nfullbits(ver) {
		var v = VERSIONS[ver];
		var nbits = 16 * ver * ver + 128 * ver + 64;

		if (needsverinfo(ver)) {
			nbits -= 36;
		}

		if (v[2][length]) {
			nbits -= 25 * v[2][length] * v[2][length] - 10 * v[2][length] - 55;
		}

		return nbits;
	};

	var ndatabits = function ndatabits(ver, ecclevel) {
		var nbits = nfullbits(ver) & ~7;
		var v = VERSIONS[ver];
		nbits -= 8 * v[0][ecclevel] * v[1][ecclevel];
		return nbits;
	};

	var ndatalenbits = function ndatalenbits(ver, mode) {
		switch (mode) {
			case MODE_NUMERIC:
				return ver < 10 ? 10 : ver < 27 ? 12 : 14;

			case MODE_ALPHANUMERIC:
				return ver < 10 ? 9 : ver < 27 ? 11 : 13;

			case MODE_OCTET:
				return ver < 10 ? 8 : 16;

			case MODE_KANJI:
				return ver < 10 ? 8 : ver < 27 ? 10 : 12;
		}
	};

	var getmaxdatalen = function getmaxdatalen(ver, mode, ecclevel) {
		var nbits = ndatabits(ver, ecclevel) - 4 - ndatalenbits(ver, mode);

		switch (mode) {
			case MODE_NUMERIC:
				return (
					((nbits / 10) | 0) * 3 +
					(nbits % 10 < 4 ? 0 : nbits % 10 < 7 ? 1 : 2)
				);

			case MODE_ALPHANUMERIC:
				return ((nbits / 11) | 0) * 2 + (nbits % 11 < 6 ? 0 : 1);

			case MODE_OCTET:
				return (nbits / 8) | 0;

			case MODE_KANJI:
				return (nbits / 13) | 0;
		}
	};

	var validatedata = function validatedata(mode, data) {
		switch (mode) {
			case MODE_NUMERIC:
				if (!data.match(NUMERIC_REGEXP)) {
					return null;
				}

				return data;

			case MODE_ALPHANUMERIC:
				if (!data.match(ALPHANUMERIC_REGEXP)) {
					return null;
				}

				return data.toUpperCase();

			case MODE_OCTET:
				if (typeof data === "string") {
					var newdata = [];

					for (var i = 0; i < data[length]; ++i) {
						var ch = data.charCodeAt(i);

						if (ch < 0x80) {
							newdata.push(ch);
						} else if (ch < 0x800) {
							newdata.push(0xc0 | (ch >> 6), 0x80 | (ch & 0x3f));
						} else if (ch < 0x10000) {
							newdata.push(
								0xe0 | (ch >> 12),
								0x80 | ((ch >> 6) & 0x3f),
								0x80 | (ch & 0x3f)
							);
						} else {
							newdata.push(
								0xf0 | (ch >> 18),
								0x80 | ((ch >> 12) & 0x3f),
								0x80 | ((ch >> 6) & 0x3f),
								0x80 | (ch & 0x3f)
							);
						}
					}

					return newdata;
				} else {
					return data;
				}
		}
	};

	var encode = function encode(ver, mode, data, maxbuflen) {
		var buf = [];
		var bits = 0,
			remaining = 8;
		var datalen = data[length];

		var pack = function pack(x, n) {
			if (n >= remaining) {
				buf.push(bits | (x >> (n -= remaining)));

				while (n >= 8) {
					buf.push((x >> (n -= 8)) & 255);
				}

				bits = 0;
				remaining = 8;
			}

			if (n > 0) {
				bits |= (x & ((1 << n) - 1)) << (remaining -= n);
			}
		};

		var nlenbits = ndatalenbits(ver, mode);
		pack(mode, 4);
		pack(datalen, nlenbits);

		switch (mode) {
			case MODE_NUMERIC:
				for (var i = 2; i < datalen; i += 3) {
					pack(parseInt(data.substring(i - 2, i + 1), 10), 10);
				}

				pack(
					parseInt(data.substring(i - 2), 10),
					[0, 4, 7][datalen % 3]
				);
				break;

			case MODE_ALPHANUMERIC:
				for (var i2 = 1; i2 < datalen; i2 += 2) {
					pack(
						ALPHANUMERIC_MAP[data.charAt(i2 - 1)] * 45 +
							ALPHANUMERIC_MAP[data.charAt(i2)],
						11
					);
				}

				if (datalen % 2 === 1) {
					pack(ALPHANUMERIC_MAP[data.charAt(i2 - 1)], 6);
				}

				break;

			case MODE_OCTET:
				for (var i3 = 0; i3 < datalen; ++i3) {
					pack(data[i3], 8);
				}

				break;
		}

		pack(MODE_TERMINATOR, 4);

		if (remaining < 8) {
			buf.push(bits);
		}

		while (buf[length] + 1 < maxbuflen) {
			buf.push(0xec, 0x11);
		}

		if (buf[length] < maxbuflen) {
			buf.push(0xec);
		}

		return buf;
	};

	var calculateecc = function calculateecc(poly, genpoly) {
		var modulus = poly.slice(0);
		var polylen = poly[length],
			genpolylen = genpoly[length];

		for (var k = 0; k < genpolylen; ++k) {
			modulus.push(0);
		}

		for (var i = 0; i < polylen; ) {
			var quotient = GF256_INVMAP[modulus[i++]];

			if (quotient >= 0) {
				for (var j = 0; j < genpolylen; ++j) {
					modulus[i + j] ^= GF256_MAP[(quotient + genpoly[j]) % 255];
				}
			}
		}

		return modulus.slice(polylen);
	};

	var augumenteccs = function augumenteccs(poly, nblocks, genpoly) {
		var subsizes = [];
		var subsize = (poly[length] / nblocks) | 0,
			subsize0 = 0;
		var pivot = nblocks - (poly[length] % nblocks);

		for (var i = 0; i < pivot; ++i) {
			subsizes.push(subsize0);
			subsize0 += subsize;
		}

		for (var i2 = pivot; i2 < nblocks; ++i2) {
			subsizes.push(subsize0);
			subsize0 += subsize + 1;
		}

		subsizes.push(subsize0);
		var eccs = [];

		for (var i3 = 0; i3 < nblocks; ++i3) {
			eccs.push(
				calculateecc(
					poly.slice(subsizes[i3], subsizes[i3 + 1]),
					genpoly
				)
			);
		}

		var result = [];
		var nitemsperblock = (poly[length] / nblocks) | 0;

		for (var i4 = 0; i4 < nitemsperblock; ++i4) {
			for (var j = 0; j < nblocks; ++j) {
				result.push(poly[subsizes[j] + i4]);
			}
		}

		for (var j2 = pivot; j2 < nblocks; ++j2) {
			result.push(poly[subsizes[j2 + 1] - 1]);
		}

		for (var i5 = 0; i5 < genpoly[length]; ++i5) {
			for (var j3 = 0; j3 < nblocks; ++j3) {
				result.push(eccs[j3][i5]);
			}
		}

		return result;
	};

	var augumentbch = function augumentbch(poly, p, genpoly, q) {
		var modulus = poly << q;

		for (var i = p - 1; i >= 0; --i) {
			if ((modulus >> (q + i)) & 1) {
				modulus ^= genpoly << i;
			}
		}

		return (poly << q) | modulus;
	};

	var makebasematrix = function makebasematrix(ver) {
		var v = VERSIONS[ver],
			n = getsizebyver(ver);
		var matrix = [],
			reserved = [];

		for (var i = 0; i < n; ++i) {
			matrix.push([]);
			reserved.push([]);
		}

		var blit = function blit(y, x, h, w, bits) {
			for (var i = 0; i < h; ++i) {
				for (var j = 0; j < w; ++j) {
					matrix[y + i][x + j] = (bits[i] >> j) & 1;
					reserved[y + i][x + j] = 1;
				}
			}
		};

		blit(0, 0, 9, 9, [
			0x7f,
			0x41,
			0x5d,
			0x5d,
			0x5d,
			0x41,
			0x17f,
			0x00,
			0x40
		]);
		blit(n - 8, 0, 8, 9, [0x100, 0x7f, 0x41, 0x5d, 0x5d, 0x5d, 0x41, 0x7f]);
		blit(0, n - 8, 9, 8, [
			0xfe,
			0x82,
			0xba,
			0xba,
			0xba,
			0x82,
			0xfe,
			0x00,
			0x00
		]);

		for (var i2 = 9; i2 < n - 8; ++i2) {
			matrix[6][i2] = matrix[i2][6] = ~i2 & 1;
			reserved[6][i2] = reserved[i2][6] = 1;
		}

		var aligns = v[2],
			m = aligns[length];

		for (var i3 = 0; i3 < m; ++i3) {
			var minj = i3 === 0 || i3 === m - 1 ? 1 : 0,
				maxj = i3 === 0 ? m - 1 : m;

			for (var j = minj; j < maxj; ++j) {
				blit(aligns[i3], aligns[j], 5, 5, [
					0x1f,
					0x11,
					0x15,
					0x11,
					0x1f
				]);
			}
		}

		if (needsverinfo(ver)) {
			var code = augumentbch(ver, 6, 0x1f25, 12);
			var k = 0;

			for (var i4 = 0; i4 < 6; ++i4) {
				for (var j2 = 0; j2 < 3; ++j2) {
					matrix[i4][n - 11 + j2] = matrix[n - 11 + j2][i4] =
						(code >> k++) & 1;
					reserved[i4][n - 11 + j2] = reserved[n - 11 + j2][i4] = 1;
				}
			}
		}

		return {
			matrix: matrix,
			reserved: reserved
		};
	};

	var putdata = function putdata(matrix, reserved, buf) {
		var n = matrix[length];
		var k = 0,
			dir = -1;

		for (var i = n - 1; i >= 0; i -= 2) {
			if (i === 6) {
				--i;
			}

			var jj = dir < 0 ? n - 1 : 0;

			for (var j = 0; j < n; ++j) {
				for (var ii = i; ii > i - 2; --ii) {
					if (!reserved[jj][ii]) {
						matrix[jj][ii] = (buf[k >> 3] >> (~k & 7)) & 1;
						++k;
					}
				}

				jj += dir;
			}

			dir = -dir;
		}

		return matrix;
	};

	var maskdata = function maskdata(matrix, reserved, mask) {
		var maskf = MASKFUNCS[mask];
		var n = matrix[length];

		for (var i = 0; i < n; ++i) {
			for (var j = 0; j < n; ++j) {
				if (!reserved[i][j]) {
					matrix[i][j] ^= maskf(i, j);
				}
			}
		}

		return matrix;
	};

	var putformatinfo = function putformatinfo(
		matrix,
		reserved,
		ecclevel,
		mask
	) {
		var n = matrix[length];
		var code = augumentbch((ecclevel << 3) | mask, 5, 0x537, 10) ^ 0x5412;

		for (var i = 0; i < 15; ++i) {
			var r = [
				0,
				1,
				2,
				3,
				4,
				5,
				7,
				8,
				n - 7,
				n - 6,
				n - 5,
				n - 4,
				n - 3,
				n - 2,
				n - 1
			][i];
			var c = [
				n - 1,
				n - 2,
				n - 3,
				n - 4,
				n - 5,
				n - 6,
				n - 7,
				n - 8,
				7,
				5,
				4,
				3,
				2,
				1,
				0
			][i];
			matrix[r][8] = matrix[8][c] = (code >> i) & 1;
		}

		return matrix;
	};

	var evaluatematrix = function evaluatematrix(matrix) {
		var PENALTY_CONSECUTIVE = 3;
		var PENALTY_TWOBYTWO = 3;
		var PENALTY_FINDERLIKE = 40;
		var PENALTY_DENSITY = 10;

		var evaluategroup = function evaluategroup(groups) {
			var score = 0;

			for (var i = 0; i < groups[length]; ++i) {
				if (groups[i] >= 5) {
					score += PENALTY_CONSECUTIVE + (groups[i] - 5);
				}
			}

			for (var i2 = 5; i2 < groups[length]; i2 += 2) {
				var p = groups[i2];

				if (
					groups[i2 - 1] === p &&
					groups[i2 - 2] === 3 * p &&
					groups[i2 - 3] === p &&
					groups[i2 - 4] === p &&
					(groups[i2 - 5] >= 4 * p || groups[i2 + 1] >= 4 * p)
				) {
					score += PENALTY_FINDERLIKE;
				}
			}

			return score;
		};

		var n = matrix[length];
		var score = 0,
			nblacks = 0;

		for (var i = 0; i < n; ++i) {
			var row = matrix[i];
			var groups;
			groups = [0];

			for (var j = 0; j < n; ) {
				var k;

				for (k = 0; j < n && row[j]; ++k) {
					++j;
				}

				groups.push(k);

				for (k = 0; j < n && !row[j]; ++k) {
					++j;
				}

				groups.push(k);
			}

			score += evaluategroup(groups);
			groups = [0];

			for (var j2 = 0; j2 < n; ) {
				var k2;

				for (k2 = 0; j2 < n && matrix[j2][i]; ++k2) {
					++j2;
				}

				groups.push(k2);

				for (k2 = 0; j2 < n && !matrix[j2][i]; ++k2) {
					++j2;
				}

				groups.push(k2);
			}

			score += evaluategroup(groups);
			var nextrow = matrix[i + 1] || [];
			nblacks += row[0];

			for (var j3 = 1; j3 < n; ++j3) {
				var p = row[j3];
				nblacks += p;

				if (
					row[j3 - 1] === p &&
					nextrow[j3] === p &&
					nextrow[j3 - 1] === p
				) {
					score += PENALTY_TWOBYTWO;
				}
			}
		}

		score +=
			PENALTY_DENSITY * ((Math.abs(nblacks / n / n - 0.5) / 0.05) | 0);
		return score;
	};

	var _generate = function generate(data, ver, mode, ecclevel, mask) {
		var v = VERSIONS[ver];
		var buf = encode(ver, mode, data, ndatabits(ver, ecclevel) >> 3);
		buf = augumenteccs(buf, v[1][ecclevel], GF256_GENPOLY[v[0][ecclevel]]);
		var result = makebasematrix(ver);
		var matrix = result.matrix,
			reserved = result.reserved;
		putdata(matrix, reserved, buf);

		if (mask < 0) {
			maskdata(matrix, reserved, 0);
			putformatinfo(matrix, reserved, ecclevel, 0);
			var bestmask = 0,
				bestscore = evaluatematrix(matrix);
			maskdata(matrix, reserved, 0);

			for (mask = 1; mask < 8; ++mask) {
				maskdata(matrix, reserved, mask);
				putformatinfo(matrix, reserved, ecclevel, mask);
				var score = evaluatematrix(matrix);

				if (bestscore > score) {
					bestscore = score;
					bestmask = mask;
				}

				maskdata(matrix, reserved, mask);
			}

			mask = bestmask;
		}

		maskdata(matrix, reserved, mask);
		putformatinfo(matrix, reserved, ecclevel, mask);
		return matrix;
	};

	var QRCode = {
		generate: function generate(data, settings) {
			var options = settings || {};
			var MODES = {
				numeric: MODE_NUMERIC,
				alphanumeric: MODE_ALPHANUMERIC,
				octet: MODE_OCTET
			};
			var ECCLEVELS = {
				L: ECCLEVEL_L,
				M: ECCLEVEL_M,
				Q: ECCLEVEL_Q,
				H: ECCLEVEL_H
			};
			var ver = options.version || -1;
			var ecclevel = ECCLEVELS[(options.ecclevel || "L").toUpperCase()];
			var mode = options.mode ? MODES[options.mode.toLowerCase()] : -1;
			var mask = "mask" in options ? options.mask : -1;

			if (mode < 0) {
				if (typeof data === "string") {
					if (data.match(NUMERIC_REGEXP)) {
						mode = MODE_NUMERIC;
					} else if (data.match(ALPHANUMERIC_OUT_REGEXP)) {
						mode = MODE_ALPHANUMERIC;
					} else {
						mode = MODE_OCTET;
					}
				} else {
					mode = MODE_OCTET;
				}
			} else if (
				!(
					mode === MODE_NUMERIC ||
					mode === MODE_ALPHANUMERIC ||
					mode === MODE_OCTET
				)
			) {
				throw "invalid or unsupported mode";
			}

			data = validatedata(mode, data);

			if (data === null) {
				throw "invalid data format";
			}

			if (ecclevel < 0 || ecclevel > 3) {
				throw "invalid ECC level";
			}

			if (ver < 0) {
				for (ver = 1; ver <= 40; ++ver) {
					if (data[length] <= getmaxdatalen(ver, mode, ecclevel)) {
						break;
					}
				}

				if (ver > 40) {
					throw "too large data";
				}
			} else if (ver < 1 || ver > 40) {
				throw "invalid version";
			}

			if (mask !== -1 && (mask < 0 || mask > 8)) {
				throw "invalid mask";
			}

			return _generate(data, ver, mode, ecclevel, mask);
		},
		generateHTML: function generateHTML(data, settings) {
			var options = settings || {};
			var fillcolor = options.fillcolor ? options.fillcolor : "#FFFFFF";
			var textcolor = options.textcolor ? options.textcolor : "#000000";
			var matrix = QRCode.generate(data, options);
			var modsize = Math.max(options.modulesize || 5, 0.5);
			var margin = Math.max(
				options.margin !== null ? options.margin : 4,
				0.0
			);
			var e = document.createElement("div");
			var n = matrix[length];
			var html = [
				'<table border="0" cellspacing="0" cellpadding="0" style="border:' +
					modsize * margin +
					"px solid " +
					fillcolor +
					";background:" +
					fillcolor +
					'">'
			];

			for (var i = 0; i < n; ++i) {
				html.push("<tr>");

				for (var j = 0; j < n; ++j) {
					html.push(
						'<td style="width:' +
							modsize +
							"px;height:" +
							modsize +
							"px" +
							(matrix[i][j] ? ";background:" + textcolor : "") +
							'"></td>'
					);
				}

				html.push("</tr>");
			}

			e.className = "qrcode";
			/* e.innerHTML = html.join("") + "</table>"; */

			var range = document.createRange();
			range.selectNodeContents(e);
			var frag = range.createContextualFragment(
				html.join("") + "</table>"
			);
			e.appendChild(frag);
			return e;
		},
		generateSVG: function generateSVG(data, settings) {
			var options = settings || {};
			var fillcolor = options.fillcolor ? options.fillcolor : "#FFFFFF";
			var textcolor = options.textcolor ? options.textcolor : "#000000";
			var matrix = QRCode.generate(data, options);
			var n = matrix[length];
			var modsize = Math.max(options.modulesize || 5, 0.5);
			var margin = Math.max(options.margin ? options.margin : 4, 0.0);
			var size = modsize * (n + 2 * margin);
			/* var common = ' class= "fg"' + ' width="' + modsize + '" height="' + modsize + '"/>'; */

			var e = document.createElementNS(
				"http://www.w3.org/2000/svg",
				"svg"
			);
			e.setAttributeNS(null, "viewBox", "0 0 " + size + " " + size);
			e.setAttributeNS(null, "style", "shape-rendering:crispEdges");
			var qrcodeId = "qrcode" + Date.now();
			e.setAttributeNS(null, "id", qrcodeId);
			var frag = document.createDocumentFragment();
			/* var svg = ['<style scoped>.bg{fill:' + fillcolor + '}.fg{fill:' + textcolor + '}</style>', '<rect class="bg" x="0" y="0"', 'width="' + size + '" height="' + size + '"/>', ]; */

			var style = document.createElementNS(
				"http://www.w3.org/2000/svg",
				"style"
			);
			style.appendChild(
				document.createTextNode(
					"#" +
						qrcodeId +
						" .bg{fill:" +
						fillcolor +
						"}#" +
						qrcodeId +
						" .fg{fill:" +
						textcolor +
						"}"
				)
			);
			/* style.setAttributeNS(null, "scoped", "scoped"); */

			frag.appendChild(style);

			var createRect = function createRect(c, f, x, y, s) {
				var fg =
					document.createElementNS(
						"http://www.w3.org/2000/svg",
						"rect"
					) || "";
				fg.setAttributeNS(null, "class", c);
				fg.setAttributeNS(null, "fill", f);
				fg.setAttributeNS(null, "x", x);
				fg.setAttributeNS(null, "y", y);
				fg.setAttributeNS(null, "width", s);
				fg.setAttributeNS(null, "height", s);
				return fg;
			};

			frag.appendChild(createRect("bg", "none", 0, 0, size));
			var yo = margin * modsize;

			for (var y = 0; y < n; ++y) {
				var xo = margin * modsize;

				for (var x = 0; x < n; ++x) {
					if (matrix[y][x]) {
						/* svg.push('<rect x="' + xo + '" y="' + yo + '"', common); */
						frag.appendChild(
							createRect("fg", "none", xo, yo, modsize)
						);
					}

					xo += modsize;
				}

				yo += modsize;
			}
			/* e.innerHTML = svg.join(""); */

			e.appendChild(frag);
			return e;
		},
		generatePNG: function generatePNG(data, settings) {
			var options = settings || {};
			var fillcolor = options.fillcolor || "#FFFFFF";
			var textcolor = options.textcolor || "#000000";
			var matrix = QRCode.generate(data, options);
			var modsize = Math.max(options.modulesize || 5, 0.5);
			var margin = Math.max(
				options.margin !== null && options.margin !== undefined
					? options.margin
					: 4,
				0.0
			);
			var n = matrix[length];
			var size = modsize * (n + 2 * margin);
			var canvas = document.createElement("canvas"),
				context;
			canvas.width = canvas.height = size;
			context = canvas.getContext("2d");

			if (!context) {
				throw "canvas support is needed for PNG output";
			}

			context.fillStyle = fillcolor;
			context.fillRect(0, 0, size, size);
			context.fillStyle = textcolor;

			for (var i = 0; i < n; ++i) {
				for (var j = 0; j < n; ++j) {
					if (matrix[i][j]) {
						context.fillRect(
							modsize * (margin + j),
							modsize * (margin + i),
							modsize,
							modsize
						);
					}
				}
			}

			return canvas.toDataURL();
		}
	};
	root.QRCode = QRCode;
})("undefined" !== typeof window ? window : this, document);
/*jshint bitwise: true */
