/*!
 * modified Generates event when user makes new movement (like a swipe on a touchscreen).
 * @version 1.1.4
 * @link https://github.com/Promo/wheel-indicator
 * @license MIT
 * @see {@link https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md#feature-detection}
 * forced passive event listener if supported
 * passes jshint
 */
/* global module, window, document */
var WheelIndicator = (function (root, document) {
	var eventWheel = "onwheel" in document ? "wheel" : "mousewheel",
	DEFAULTS = {
		callback: function () {},
		elem: document,
		preventMouse: true
	};
	function Module(options) {
		this._options = extend(DEFAULTS, options);
		this._deltaArray = [0, 0, 0];
		this._isAcceleration = false;
		this._isStopped = true;
		this._direction = "";
		this._timer = "";
		this._isWorking = true;
		var self = this;
		this._wheelHandler = function (event) {
			if (self._isWorking) {
				processDelta.call(self, event);
				if (self._options.preventMouse) {
					preventDefault(event);
				}
			}
		};
		addEvent(this._options.elem, eventWheel, this._wheelHandler);
	}
	Module.prototype = {
		constructor: Module,
		turnOn: function () {
			this._isWorking = true;
			return this;
		},
		turnOff: function () {
			this._isWorking = false;
			return this;
		},
		setOptions: function (options) {
			this._options = extend(this._options, options);
			return this;
		},
		getOption: function (option) {
			var neededOption = this._options[option];
			if (neededOption !== undefined) {
				return neededOption;
			}
			throw new Error("Unknown option");
		},
		destroy: function () {
			removeEvent(this._options.elem, eventWheel, this._wheelHandler);
			return this;
		}
	};
	function triggerEvent(event) {
		event.direction = this._direction;
		this._options.callback.call(this, event);
	}
	var getDeltaY = function (event) {
		if (event.wheelDelta && !event.deltaY) {
			getDeltaY = function (event) {
				return event.wheelDelta * -1;
			};
		} else {
			getDeltaY = function (event) {
				return event.deltaY;
			};
		}
		return getDeltaY(event);
	};
	function preventDefault(event) {
		event = event || root.event;
		if (event.preventDefault) {
			event.preventDefault();
		} else {
			event.returnValue = false;
		}
	}
	function processDelta(event) {
		var
		self = this,
		delta = getDeltaY(event);
		if (delta === 0)
			return;
		var direction = delta > 0 ? "down" : "up",
		arrayLength = self._deltaArray.length,
		changedDirection = false,
		repeatDirection = 0,
		sustainableDirection,
		i;
		clearTimeout(self._timer);
		self._timer = setTimeout(function () {
				self._deltaArray = [0, 0, 0];
				self._isStopped = true;
				self._direction = direction;
			}, 150);
		for (i = 0; i < arrayLength; i++) {
			if (self._deltaArray[i] !== 0) {
				if (self._deltaArray[i] > 0) {
					++repeatDirection;
				} else {
					--repeatDirection;
				}
			}
		}
		if (Math.abs(repeatDirection) === arrayLength) {
			sustainableDirection = repeatDirection > 0 ? "down" : "up";
			if (sustainableDirection !== self._direction) {
				changedDirection = true;
				self._direction = direction;
			}
		}
		if (!self._isStopped) {
			if (changedDirection) {
				self._isAcceleration = true;
				triggerEvent.call(this, event);
			} else {
				if (Math.abs(repeatDirection) === arrayLength) {
					analyzeArray.call(this, event);
				}
			}
		}
		if (self._isStopped) {
			self._isStopped = false;
			self._isAcceleration = true;
			self._direction = direction;
			triggerEvent.call(this, event);
		}
		self._deltaArray.shift();
		self._deltaArray.push(delta);
	}
	function analyzeArray(event) {
		var
		deltaArray0Abs = Math.abs(this._deltaArray[0]),
		deltaArray1Abs = Math.abs(this._deltaArray[1]),
		deltaArray2Abs = Math.abs(this._deltaArray[2]),
		deltaAbs = Math.abs(getDeltaY(event));
		if ((deltaAbs > deltaArray2Abs) && (deltaArray2Abs > deltaArray1Abs) && (deltaArray1Abs > deltaArray0Abs)) {
			if (!this._isAcceleration) {
				triggerEvent.call(this, event);
				this._isAcceleration = true;
			}
		}
		if ((deltaAbs < deltaArray2Abs) && (deltaArray2Abs <= deltaArray1Abs)) {
			this._isAcceleration = false;
		}
	}
	var supportsPassive = (function () {
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
	}
		());
	function addEvent(elem, type, handler) {
		if (elem.addEventListener) {
			elem.addEventListener(type, handler, supportsPassive ? {
				passive: true
			}
				 : false);
		} else if (elem.attachEvent) {
			elem.attachEvent("on" + type, handler);
		}
	}
	function removeEvent(elem, type, handler) {
		if (elem.removeEventListener) {
			elem.removeEventListener(type, handler, supportsPassive ? {
				passive: true
			}
				 : false);
		} else if (elem.detachEvent) {
			elem.detachEvent("on" + type, handler);
		}
	}
	function extend(defaults, options) {
		var extended = {},
		prop;
		for (prop in defaults) {
			if (Object.prototype.hasOwnProperty.call(defaults, prop)) {
				extended[prop] = defaults[prop];
			}
		}
		for (prop in options) {
			if (Object.prototype.hasOwnProperty.call(options, prop)) {
				extended[prop] = options[prop];
			}
		}
		return extended;
	}
	return Module;
}
	("undefined" !== typeof window ? window : this, document));
if (typeof exports === "object") {
	module.exports = WheelIndicator;
}
