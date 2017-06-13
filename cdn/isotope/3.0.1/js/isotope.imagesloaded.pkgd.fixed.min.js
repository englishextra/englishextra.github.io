/*!
 * modified Isotope PACKAGED v3.0.1
 * @see {@link https://github.com/metafizzy/isotope}
 * Licensed GPLv3 for open source use
 * or Isotope Commercial License for commercial use
 * @see {@link http://isotope.metafizzy.co}
 * Copyright 2016 Metafizzy
 * @see {@link https://github.com/metafizzy/isotope/blob/master/dist/isotope.pkgd.js}
 * passes jshint with suppressing comments
 */
/* jshint forin: false */
(function (root, factory) {
	root.EvEmitter = factory();
}
	( "undefined" !== typeof window ? window : this, function () {
		function EvEmitter() {}
		var proto = EvEmitter.prototype;
		proto.on = function (eventName, listener) {
			if (!eventName || !listener) {
				return;
			}
			var events = this._events = this._events || {};
			var listeners = events[eventName] = events[eventName] || [];
			if (listeners.indexOf(listener) == -1) {
				listeners.push(listener);
			}
			return this;
		};
		proto.once = function (eventName, listener) {
			if (!eventName || !listener) {
				return;
			}
			this.on(eventName, listener);
			var onceEvents = this._onceEvents = this._onceEvents || {};
			var onceListeners = onceEvents[eventName] = onceEvents[eventName] || {};
			onceListeners[listener] = true;
			return this;
		};
		proto.off = function (eventName, listener) {
			var listeners = this._events && this._events[eventName];
			if (!listeners || !listeners.length) {
				return;
			}
			var index = listeners.indexOf(listener);
			if (index != -1) {
				listeners.splice(index, 1);
			}
			return this;
		};
		proto.emitEvent = function (eventName, args) {
			var listeners = this._events && this._events[eventName];
			if (!listeners || !listeners.length) {
				return;
			}
			var i = 0;
			var listener = listeners[i];
			args = args || [];
			var onceListeners = this._onceEvents && this._onceEvents[eventName];
			while (listener) {
				var isOnce = onceListeners && onceListeners[listener];
				if (isOnce) {
					this.off(eventName, listener);
					delete onceListeners[listener];
				}
				listener.apply(this, args);
				i += isOnce ? 0 : 1;
				listener = listeners[i];
			}
			return this;
		};
		return EvEmitter;
	}));
(function (root, factory) {
	"use strict";
	root.getSize = factory();
})( "undefined" !== typeof window ? window : this, function factory() {
	"use strict";
	function getStyleSize(value) {
		var num = parseFloat(value);
		var isValid = value.indexOf('%') == -1 && !isNaN(num);
		return isValid && num;
	}
	function noop() {}
	var logError = typeof console == "undefined" ? noop : function (message) {
		console.error(message);
	};
	var measurements = ['paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom', 'marginLeft', 'marginRight', 'marginTop', 'marginBottom', 'borderLeftWidth', 'borderRightWidth', 'borderTopWidth', 'borderBottomWidth'];
	var measurementsLength = measurements.length;
	function getZeroSize() {
		var size = {
			width: 0,
			height: 0,
			innerWidth: 0,
			innerHeight: 0,
			outerWidth: 0,
			outerHeight: 0
		};
		for (var i = 0; i < measurementsLength; i++) {
			var measurement = measurements[i];
			size[measurement] = 0;
		}
		return size;
	}
	function getStyle(elem) {
		var style = getComputedStyle(elem);
		if (!style) {
			logError('Style returned ' + style + '. Are you running this code in a hidden iframe on Firefox? ' + 'See http://bit.ly/getsizebug1');
		}
		return style;
	}
	var isSetup = false;
	var isBoxSizeOuter;
	function setup() {
		if (isSetup) {
			return;
		}
		isSetup = true;
		var div = document.createElement('div');
		div.style.width = '200px';
		div.style.padding = '1px 2px 3px 4px';
		div.style.borderStyle = 'solid';
		div.style.borderWidth = '1px 2px 3px 4px';
		div.style.boxSizing = 'border-box';
		var body = document.body || document.documentElement;
		body.appendChild(div);
		var style = getStyle(div);
		getSize.isBoxSizeOuter = isBoxSizeOuter = getStyleSize(style.width) == 200;
		body.removeChild(div);
	}
	function getSize(elem) {
		setup();
		if (typeof elem == 'string') {
			elem = document.querySelector(elem);
		}
		if (!elem || typeof elem != 'object' || !elem.nodeType) {
			return;
		}
		var style = getStyle(elem);
		if (style.display == 'none') {
			return getZeroSize();
		}
		var size = {};
		size.width = elem.offsetWidth;
		size.height = elem.offsetHeight;
		var isBorderBox = size.isBorderBox = style.boxSizing == 'border-box';
		for (var i = 0; i < measurementsLength; i++) {
			var measurement = measurements[i];
			var value = style[measurement];
			var num = parseFloat(value);
			size[measurement] = !isNaN(num) ? num : 0;
		}
		var paddingWidth = size.paddingLeft + size.paddingRight;
		var paddingHeight = size.paddingTop + size.paddingBottom;
		var marginWidth = size.marginLeft + size.marginRight;
		var marginHeight = size.marginTop + size.marginBottom;
		var borderWidth = size.borderLeftWidth + size.borderRightWidth;
		var borderHeight = size.borderTopWidth + size.borderBottomWidth;
		var isBorderBoxSizeOuter = isBorderBox && isBoxSizeOuter;
		var styleWidth = getStyleSize(style.width);
		if (styleWidth !== false) {
			size.width = styleWidth + (isBorderBoxSizeOuter ? 0 : paddingWidth + borderWidth);
		}
		var styleHeight = getStyleSize(style.height);
		if (styleHeight !== false) {
			size.height = styleHeight + (isBorderBoxSizeOuter ? 0 : paddingHeight + borderHeight);
		}
		size.innerWidth = size.width - (paddingWidth + borderWidth);
		size.innerHeight = size.height - (paddingHeight + borderHeight);
		size.outerWidth = size.width + marginWidth;
		size.outerHeight = size.height + marginHeight;
		return size;
	}
	return getSize;
});
(function (window, factory) {
	"use strict";
	window.matchesSelector = factory();
}
	("undefined" !== typeof window ? window : this, function factory() {
		"use strict";
		var matchesMethod = (function () {
			var ElemProto = Element.prototype;
			if (ElemProto.matches) {
				return 'matches';
			}
			if (ElemProto.matchesSelector) {
				return 'matchesSelector';
			}
			var prefixes = ['webkit', 'moz', 'ms', 'o'];
			for (var i = 0; i < prefixes.length; i++) {
				var prefix = prefixes[i];
				var method = prefix + 'MatchesSelector';
				if (ElemProto[method]) {
					return method;
				}
			}
		}());
		return function matchesSelector(elem, selector) {
			return elem[matchesMethod](selector);
		};
	}));
(function (window, factory) {
	window.fizzyUIUtils = factory(window, window.matchesSelector);
}
	("undefined" !== typeof window ? window : this, function factory(window, matchesSelector) {
		var utils = {};
		utils.extend = function (a, b) {
			for (var prop in b) {
				a[prop] = b[prop];
			}
			return a;
		};
		utils.modulo = function (num, div) {
			return ((num % div) + div) % div;
		};
		utils.makeArray = function (obj) {
			var ary = [];
			if (Array.isArray(obj)) {
				ary = obj;
			} else if (obj && typeof obj.length == 'number') {
				for (var i = 0; i < obj.length; i++) {
					ary.push(obj[i]);
				}
			} else {
				ary.push(obj);
			}
			return ary;
		};
		utils.removeFrom = function (ary, obj) {
			var index = ary.indexOf(obj);
			if (index != -1) {
				ary.splice(index, 1);
			}
		};
		utils.getParent = function (elem, selector) {
			while (elem != document.body) {
				elem = elem.parentNode;
				if (matchesSelector(elem, selector)) {
					return elem;
				}
			}
		};
		utils.getQueryElement = function (elem) {
			if (typeof elem == 'string') {
				return document.querySelector(elem);
			}
			return elem;
		};
		utils.handleEvent = function (event) {
			var method = 'on' + event.type;
			if (this[method]) {
				this[method](event);
			}
		};
		utils.filterFindElements = function (elems, selector) {
			elems = utils.makeArray(elems);
			var ffElems = [];
			elems.forEach(function (elem) {
				if (!(elem instanceof HTMLElement)) {
					return;
				}
				if (!selector) {
					ffElems.push(elem);
					return;
				}
				if (matchesSelector(elem, selector)) {
					ffElems.push(elem);
				}
				var childElems = elem.querySelectorAll(selector);
				for (var i = 0; i < childElems.length; i++) {
					ffElems.push(childElems[i]);
				}
			});
			return ffElems;
		};
		utils.debounceMethod = function (_class, methodName, threshold) {
			var method = _class.prototype[methodName];
			var timeoutName = methodName + 'Timeout';
			_class.prototype[methodName] = function () {
				var timeout = this[timeoutName];
				if (timeout) {
					clearTimeout(timeout);
				}
				var args = arguments;
				var _this = this;
				this[timeoutName] = setTimeout(function () {
						method.apply(_this, args);
						delete _this[timeoutName];
					}, threshold || 100);
			};
		};
		utils.docReady = function (callback) {
			var readyState = document.readyState;
			if (readyState == 'complete' || readyState == 'interactive') {
				callback();
			} else {
				document.addEventListener('DOMContentLoaded', callback);
			}
		};
		utils.toDashed = function (str) {
			return str.replace(/(.)([A-Z])/g, function (match, $1, $2) {
				return $1 + '-' + $2;
			}).toLowerCase();
		};
		var console = window.console;
		utils.htmlInit = function (WidgetClass, namespace) {
			utils.docReady(function () {
				var dashedNamespace = utils.toDashed(namespace);
				var dataAttr = 'data-' + dashedNamespace;
				var dataAttrElems = document.querySelectorAll('[' + dataAttr + ']');
				var jsDashElems = document.querySelectorAll('.js-' + dashedNamespace);
				var elems = utils.makeArray(dataAttrElems).concat(utils.makeArray(jsDashElems));
				var dataOptionsAttr = dataAttr + '-options';
				var jQuery = window.jQuery;
				elems.forEach(function (elem) {
					var attr = elem.getAttribute(dataAttr) || elem.getAttribute(dataOptionsAttr);
					var options;
					try {
						options = attr && JSON.parse(attr);
					} catch (error) {
						if (console) {
							console.error('Error parsing ' + dataAttr + ' on ' + elem.className + ': ' + error);
						}
						return;
					}
					var instance = new WidgetClass(elem, options);
					if (jQuery) {
						jQuery.data(elem, namespace, instance);
					}
				});
			});
		};
		return utils;
	}));
(function (window, factory) {
	window.Outlayer = {};
	window.Outlayer.Item = factory(window.EvEmitter, window.getSize);
}
	("undefined" !== typeof window ? window : this, function factory(EvEmitter, getSize) {
		"use strict";
		function isEmptyObj(obj) {
			for (var prop in obj) {
				return false;
			}
			prop = null;
			return true;
		}
		var docElemStyle = document.documentElement.style;
		var transitionProperty = typeof docElemStyle.transition == 'string' ? 'transition' : 'WebkitTransition';
		var transformProperty = typeof docElemStyle.transform == 'string' ? 'transform' : 'WebkitTransform';
		var transitionEndEvent = {
			WebkitTransition: 'webkitTransitionEnd',
			transition: 'transitionend'
		}
		[transitionProperty];
		var vendorProperties = {
			transform: transformProperty,
			transition: transitionProperty,
			transitionDuration: transitionProperty + 'Duration',
			transitionProperty: transitionProperty + 'Property',
			transitionDelay: transitionProperty + 'Delay'
		};
		function Item(element, layout) {
			if (!element) {
				return;
			}
			this.element = element;
			this.layout = layout;
			this.position = {
				x: 0,
				y: 0
			};
			this._create();
		}
		var proto = Item.prototype = Object.create(EvEmitter.prototype);
		proto.constructor = Item;
		proto._create = function () {
			this._transn = {
				ingProperties: {},
				clean: {},
				onEnd: {}
			};
			this.css({
				position: 'absolute'
			});
		};
		proto.handleEvent = function (event) {
			var method = 'on' + event.type;
			if (this[method]) {
				this[method](event);
			}
		};
		proto.getSize = function () {
			this.size = getSize(this.element);
		};
		proto.css = function (style) {
			var elemStyle = this.element.style;
			for (var prop in style) {
				var supportedProp = vendorProperties[prop] || prop;
				elemStyle[supportedProp] = style[prop];
			}
		};
		proto.getPosition = function () {
			var style = getComputedStyle(this.element);
			var isOriginLeft = this.layout._getOption('originLeft');
			var isOriginTop = this.layout._getOption('originTop');
			var xValue = style[isOriginLeft ? 'left' : 'right'];
			var yValue = style[isOriginTop ? 'top' : 'bottom'];
			var layoutSize = this.layout.size;
			var x = xValue.indexOf('%') != -1 ? (parseFloat(xValue) / 100) * layoutSize.width : parseInt(xValue, 10);
			var y = yValue.indexOf('%') != -1 ? (parseFloat(yValue) / 100) * layoutSize.height : parseInt(yValue, 10);
			x = isNaN(x) ? 0 : x;
			y = isNaN(y) ? 0 : y;
			x -= isOriginLeft ? layoutSize.paddingLeft : layoutSize.paddingRight;
			y -= isOriginTop ? layoutSize.paddingTop : layoutSize.paddingBottom;
			this.position.x = x;
			this.position.y = y;
		};
		proto.layoutPosition = function () {
			var layoutSize = this.layout.size;
			var style = {};
			var isOriginLeft = this.layout._getOption('originLeft');
			var isOriginTop = this.layout._getOption('originTop');
			var xPadding = isOriginLeft ? 'paddingLeft' : 'paddingRight';
			var xProperty = isOriginLeft ? 'left' : 'right';
			var xResetProperty = isOriginLeft ? 'right' : 'left';
			var x = this.position.x + layoutSize[xPadding];
			style[xProperty] = this.getXValue(x);
			style[xResetProperty] = '';
			var yPadding = isOriginTop ? 'paddingTop' : 'paddingBottom';
			var yProperty = isOriginTop ? 'top' : 'bottom';
			var yResetProperty = isOriginTop ? 'bottom' : 'top';
			var y = this.position.y + layoutSize[yPadding];
			style[yProperty] = this.getYValue(y);
			style[yResetProperty] = '';
			this.css(style);
			this.emitEvent('layout', [this]);
		};
		proto.getXValue = function (x) {
			var isHorizontal = this.layout._getOption('horizontal');
			return this.layout.options.percentPosition && !isHorizontal ? ((x / this.layout.size.width) * 100) + '%' : x + 'px';
		};
		proto.getYValue = function (y) {
			var isHorizontal = this.layout._getOption('horizontal');
			return this.layout.options.percentPosition && isHorizontal ? ((y / this.layout.size.height) * 100) + '%' : y + 'px';
		};
		proto._transitionTo = function (x, y) {
			this.getPosition();
			var curX = this.position.x;
			var curY = this.position.y;
			var compareX = parseInt(x, 10);
			var compareY = parseInt(y, 10);
			var didNotMove = compareX === this.position.x && compareY === this.position.y;
			this.setPosition(x, y);
			if (didNotMove && !this.isTransitioning) {
				this.layoutPosition();
				return;
			}
			var transX = x - curX;
			var transY = y - curY;
			var transitionStyle = {};
			transitionStyle.transform = this.getTranslate(transX, transY);
			this.transition({
				to: transitionStyle,
				onTransitionEnd: {
					transform: this.layoutPosition
				},
				isCleaning: true
			});
		};
		proto.getTranslate = function (x, y) {
			var isOriginLeft = this.layout._getOption('originLeft');
			var isOriginTop = this.layout._getOption('originTop');
			x = isOriginLeft ? x : -x;
			y = isOriginTop ? y : -y;
			return 'translate3d(' + x + 'px, ' + y + 'px, 0)';
		};
		proto.goTo = function (x, y) {
			this.setPosition(x, y);
			this.layoutPosition();
		};
		proto.moveTo = proto._transitionTo;
		proto.setPosition = function (x, y) {
			this.position.x = parseInt(x, 10);
			this.position.y = parseInt(y, 10);
		};
		proto._nonTransition = function (args) {
			this.css(args.to);
			if (args.isCleaning) {
				this._removeStyles(args.to);
			}
			for (var prop in args.onTransitionEnd) {
				args.onTransitionEnd[prop].call(this);
			}
		};
		proto.transition = function (args) {
			if (!parseFloat(this.layout.options.transitionDuration)) {
				this._nonTransition(args);
				return;
			}
			var _transition = this._transn;
			for (var prop in args.onTransitionEnd) {
				_transition.onEnd[prop] = args.onTransitionEnd[prop];
			}
			for (prop in args.to) {
				_transition.ingProperties[prop] = true;
				if (args.isCleaning) {
					_transition.clean[prop] = true;
				}
			}
			if (args.from) {
				this.css(args.from);
				var h = this.element.offsetHeight;
				h = null;
			}
			this.enableTransition(args.to);
			this.css(args.to);
			this.isTransitioning = true;
		};
		function toDashedAll(str) {
			return str.replace(/([A-Z])/g, function ($1) {
				return '-' + $1.toLowerCase();
			});
		}
		var transitionProps = 'opacity,' + toDashedAll(transformProperty);
		proto.enableTransition = function () {
			if (this.isTransitioning) {
				return;
			}
			var duration = this.layout.options.transitionDuration;
			duration = typeof duration == 'number' ? duration + 'ms' : duration;
			this.css({
				transitionProperty: transitionProps,
				transitionDuration: duration,
				transitionDelay: this.staggerDelay || 0
			});
			this.element.addEventListener(transitionEndEvent, this, false);
		};
		proto.onwebkitTransitionEnd = function (event) {
			this.ontransitionend(event);
		};
		proto.onotransitionend = function (event) {
			this.ontransitionend(event);
		};
		var dashedVendorProperties = {
			'-webkit-transform': 'transform'
		};
		proto.ontransitionend = function (event) {
			if (event.target !== this.element) {
				return;
			}
			var _transition = this._transn;
			var propertyName = dashedVendorProperties[event.propertyName] || event.propertyName;
			delete _transition.ingProperties[propertyName];
			if (isEmptyObj(_transition.ingProperties)) {
				this.disableTransition();
			}
			if (propertyName in _transition.clean) {
				this.element.style[event.propertyName] = '';
				delete _transition.clean[propertyName];
			}
			if (propertyName in _transition.onEnd) {
				var onTransitionEnd = _transition.onEnd[propertyName];
				onTransitionEnd.call(this);
				delete _transition.onEnd[propertyName];
			}
			this.emitEvent('transitionEnd', [this]);
		};
		proto.disableTransition = function () {
			this.removeTransitionStyles();
			this.element.removeEventListener(transitionEndEvent, this, false);
			this.isTransitioning = false;
		};
		proto._removeStyles = function (style) {
			var cleanStyle = {};
			for (var prop in style) {
				cleanStyle[prop] = '';
			}
			this.css(cleanStyle);
		};
		var cleanTransitionStyle = {
			transitionProperty: '',
			transitionDuration: '',
			transitionDelay: ''
		};
		proto.removeTransitionStyles = function () {
			this.css(cleanTransitionStyle);
		};
		proto.stagger = function (delay) {
			delay = isNaN(delay) ? 0 : delay;
			this.staggerDelay = delay + 'ms';
		};
		proto.removeElem = function () {
			this.element.parentNode.removeChild(this.element);
			this.css({
				display: ''
			});
			this.emitEvent('remove', [this]);
		};
		proto.remove = function () {
			if (!transitionProperty || !parseFloat(this.layout.options.transitionDuration)) {
				this.removeElem();
				return;
			}
			this.once('transitionEnd', function () {
				this.removeElem();
			});
			this.hide();
		};
		proto.reveal = function () {
			delete this.isHidden;
			this.css({
				display: ''
			});
			var options = this.layout.options;
			var onTransitionEnd = {};
			var transitionEndProperty = this.getHideRevealTransitionEndProperty('visibleStyle');
			onTransitionEnd[transitionEndProperty] = this.onRevealTransitionEnd;
			this.transition({
				from: options.hiddenStyle,
				to: options.visibleStyle,
				isCleaning: true,
				onTransitionEnd: onTransitionEnd
			});
		};
		proto.onRevealTransitionEnd = function () {
			if (!this.isHidden) {
				this.emitEvent('reveal');
			}
		};
		proto.getHideRevealTransitionEndProperty = function (styleProperty) {
			var optionStyle = this.layout.options[styleProperty];
			if (optionStyle.opacity) {
				return 'opacity';
			}
			for (var prop in optionStyle) {
				return prop;
			}
		};
		proto.hide = function () {
			this.isHidden = true;
			this.css({
				display: ''
			});
			var options = this.layout.options;
			var onTransitionEnd = {};
			var transitionEndProperty = this.getHideRevealTransitionEndProperty('hiddenStyle');
			onTransitionEnd[transitionEndProperty] = this.onHideTransitionEnd;
			this.transition({
				from: options.visibleStyle,
				to: options.hiddenStyle,
				isCleaning: true,
				onTransitionEnd: onTransitionEnd
			});
		};
		proto.onHideTransitionEnd = function () {
			if (this.isHidden) {
				this.css({
					display: 'none'
				});
				this.emitEvent('hide');
			}
		};
		proto.destroy = function () {
			this.css({
				position: '',
				left: '',
				right: '',
				top: '',
				bottom: '',
				transition: '',
				transform: ''
			});
		};
		return Item;
	}));
(function (window, factory) {
	"use strict";
	window.Outlayer = factory(window, window.EvEmitter, window.getSize, window.fizzyUIUtils, window.Outlayer.Item);
}
	("undefined" !== typeof window ? window : this, function factory(window, EvEmitter, getSize, utils, Item) {
		"use strict";
		var console = window.console;
		var jQuery = window.jQuery;
		var noop = function () {};
		var GUID = 0;
		var instances = {};
		function Outlayer(element, options) {
			var queryElement = utils.getQueryElement(element);
			if (!queryElement) {
				if (console) {
					console.error('Bad element for ' + this.constructor.namespace + ': ' + (queryElement || element));
				}
				return;
			}
			this.element = queryElement;
			if (jQuery) {
				this.$element = jQuery(this.element);
			}
			this.options = utils.extend({}, this.constructor.defaults);
			this.option(options);
			var id = ++GUID;
			this.element.outlayerGUID = id;
			instances[id] = this;
			this._create();
			var isInitLayout = this._getOption('initLayout');
			if (isInitLayout) {
				this.layout();
			}
		}
		Outlayer.namespace = 'outlayer';
		Outlayer.Item = Item;
		Outlayer.defaults = {
			containerStyle: {
				position: 'relative'
			},
			initLayout: true,
			originLeft: true,
			originTop: true,
			resize: true,
			resizeContainer: true,
			transitionDuration: '0.4s',
			hiddenStyle: {
				opacity: 0,
				transform: 'scale(0.001)'
			},
			visibleStyle: {
				opacity: 1,
				transform: 'scale(1)'
			}
		};
		var proto = Outlayer.prototype;
		utils.extend(proto, EvEmitter.prototype);
		proto.option = function (opts) {
			utils.extend(this.options, opts);
		};
		proto._getOption = function (option) {
			var oldOption = this.constructor.compatOptions[option];
			return oldOption && this.options[oldOption] !== undefined ? this.options[oldOption] : this.options[option];
		};
		Outlayer.compatOptions = {
			initLayout: 'isInitLayout',
			horizontal: 'isHorizontal',
			layoutInstant: 'isLayoutInstant',
			originLeft: 'isOriginLeft',
			originTop: 'isOriginTop',
			resize: 'isResizeBound',
			resizeContainer: 'isResizingContainer'
		};
		proto._create = function () {
			this.reloadItems();
			this.stamps = [];
			this.stamp(this.options.stamp);
			utils.extend(this.element.style, this.options.containerStyle);
			var canBindResize = this._getOption('resize');
			if (canBindResize) {
				this.bindResize();
			}
		};
		proto.reloadItems = function () {
			this.items = this._itemize(this.element.children);
		};
		proto._itemize = function (elems) {
			var itemElems = this._filterFindItemElements(elems);
			var Item = this.constructor.Item;
			var items = [];
			for (var i = 0; i < itemElems.length; i++) {
				var elem = itemElems[i];
				var item = new Item(elem, this);
				items.push(item);
			}
			return items;
		};
		proto._filterFindItemElements = function (elems) {
			return utils.filterFindElements(elems, this.options.itemSelector);
		};
		proto.getItemElements = function () {
			return this.items.map(function (item) {
				return item.element;
			});
		};
		proto.layout = function () {
			this._resetLayout();
			this._manageStamps();
			var layoutInstant = this._getOption('layoutInstant');
			var isInstant = layoutInstant !== undefined ? layoutInstant : !this._isLayoutInited;
			this.layoutItems(this.items, isInstant);
			this._isLayoutInited = true;
		};
		proto._init = proto.layout;
		proto._resetLayout = function () {
			this.getSize();
		};
		proto.getSize = function () {
			this.size = getSize(this.element);
		};
		proto._getMeasurement = function (measurement, size) {
			var option = this.options[measurement];
			var elem;
			if (!option) {
				this[measurement] = 0;
			} else {
				if (typeof option == 'string') {
					elem = this.element.querySelector(option);
				} else if (option instanceof HTMLElement) {
					elem = option;
				}
				this[measurement] = elem ? getSize(elem)[size] : option;
			}
		};
		proto.layoutItems = function (items, isInstant) {
			items = this._getItemsForLayout(items);
			this._layoutItems(items, isInstant);
			this._postLayout();
		};
		proto._getItemsForLayout = function (items) {
			return items.filter(function (item) {
				return !item.isIgnored;
			});
		};
		proto._layoutItems = function (items, isInstant) {
			this._emitCompleteOnItems('layout', items);
			if (!items || !items.length) {
				return;
			}
			var queue = [];
			items.forEach(function (item) {
				var position = this._getItemLayoutPosition(item);
				position.item = item;
				position.isInstant = isInstant || item.isLayoutInstant;
				queue.push(position);
			}, this);
			this._processLayoutQueue(queue);
		};
		proto._getItemLayoutPosition = function () {
			return {
				x: 0,
				y: 0
			};
		};
		proto._processLayoutQueue = function (queue) {
			this.updateStagger();
			queue.forEach(function (obj, i) {
				this._positionItem(obj.item, obj.x, obj.y, obj.isInstant, i);
			}, this);
		};
		proto.updateStagger = function () {
			var stagger = this.options.stagger;
			if (stagger === null || stagger === undefined) {
				this.stagger = 0;
				return;
			}
			this.stagger = getMilliseconds(stagger);
			return this.stagger;
		};
		proto._positionItem = function (item, x, y, isInstant, i) {
			if (isInstant) {
				item.goTo(x, y);
			} else {
				item.stagger(i * this.stagger);
				item.moveTo(x, y);
			}
		};
		proto._postLayout = function () {
			this.resizeContainer();
		};
		proto.resizeContainer = function () {
			var isResizingContainer = this._getOption('resizeContainer');
			if (!isResizingContainer) {
				return;
			}
			var size = this._getContainerSize();
			if (size) {
				this._setContainerMeasure(size.width, true);
				this._setContainerMeasure(size.height, false);
			}
		};
		proto._getContainerSize = noop;
		proto._setContainerMeasure = function (measure, isWidth) {
			if (measure === undefined) {
				return;
			}
			var elemSize = this.size;
			if (elemSize.isBorderBox) {
				measure += isWidth ? elemSize.paddingLeft + elemSize.paddingRight + elemSize.borderLeftWidth + elemSize.borderRightWidth : elemSize.paddingBottom + elemSize.paddingTop + elemSize.borderTopWidth + elemSize.borderBottomWidth;
			}
			measure = Math.max(measure, 0);
			this.element.style[isWidth ? 'width' : 'height'] = measure + 'px';
		};
		proto._emitCompleteOnItems = function (eventName, items) {
			var _this = this;
			function onComplete() {
				_this.dispatchEvent(eventName + 'Complete', null, [items]);
			}
			var count = items.length;
			if (!items || !count) {
				onComplete();
				return;
			}
			var doneCount = 0;
			function tick() {
				doneCount++;
				if (doneCount == count) {
					onComplete();
				}
			}
			items.forEach(function (item) {
				item.once(eventName, tick);
			});
		};
		proto.dispatchEvent = function (type, event, args) {
			var emitArgs = event ? [event].concat(args) : args;
			this.emitEvent(type, emitArgs);
			if (jQuery) {
				this.$element = this.$element || jQuery(this.element);
				if (event) {
					var $event = jQuery.Event(event);
					$event.type = type;
					this.$element.trigger($event, args);
				} else {
					this.$element.trigger(type, args);
				}
			}
		};
		proto.ignore = function (elem) {
			var item = this.getItem(elem);
			if (item) {
				item.isIgnored = true;
			}
		};
		proto.unignore = function (elem) {
			var item = this.getItem(elem);
			if (item) {
				delete item.isIgnored;
			}
		};
		proto.stamp = function (elems) {
			elems = this._find(elems);
			if (!elems) {
				return;
			}
			this.stamps = this.stamps.concat(elems);
			elems.forEach(this.ignore, this);
		};
		proto.unstamp = function (elems) {
			elems = this._find(elems);
			if (!elems) {
				return;
			}
			elems.forEach(function (elem) {
				utils.removeFrom(this.stamps, elem);
				this.unignore(elem);
			}, this);
		};
		proto._find = function (elems) {
			if (!elems) {
				return;
			}
			if (typeof elems == 'string') {
				elems = this.element.querySelectorAll(elems);
			}
			elems = utils.makeArray(elems);
			return elems;
		};
		proto._manageStamps = function () {
			if (!this.stamps || !this.stamps.length) {
				return;
			}
			this._getBoundingRect();
			this.stamps.forEach(this._manageStamp, this);
		};
		proto._getBoundingRect = function () {
			var boundingRect = this.element.getBoundingClientRect();
			var size = this.size;
			this._boundingRect = {
				left: boundingRect.left + size.paddingLeft + size.borderLeftWidth,
				top: boundingRect.top + size.paddingTop + size.borderTopWidth,
				right: boundingRect.right - (size.paddingRight + size.borderRightWidth),
				bottom: boundingRect.bottom - (size.paddingBottom + size.borderBottomWidth)
			};
		};
		proto._manageStamp = noop;
		proto._getElementOffset = function (elem) {
			var boundingRect = elem.getBoundingClientRect();
			var thisRect = this._boundingRect;
			var size = getSize(elem);
			var offset = {
				left: boundingRect.left - thisRect.left - size.marginLeft,
				top: boundingRect.top - thisRect.top - size.marginTop,
				right: thisRect.right - boundingRect.right - size.marginRight,
				bottom: thisRect.bottom - boundingRect.bottom - size.marginBottom
			};
			return offset;
		};
		proto.handleEvent = utils.handleEvent;
		proto.bindResize = function () {
			window.addEventListener('resize', this);
			this.isResizeBound = true;
		};
		proto.unbindResize = function () {
			window.removeEventListener('resize', this);
			this.isResizeBound = false;
		};
		proto.onresize = function () {
			this.resize();
		};
		utils.debounceMethod(Outlayer, 'onresize', 100);
		proto.resize = function () {
			if (!this.isResizeBound || !this.needsResizeLayout()) {
				return;
			}
			this.layout();
		};
		proto.needsResizeLayout = function () {
			var size = getSize(this.element);
			var hasSizes = this.size && size;
			return hasSizes && size.innerWidth !== this.size.innerWidth;
		};
		proto.addItems = function (elems) {
			var items = this._itemize(elems);
			if (items.length) {
				this.items = this.items.concat(items);
			}
			return items;
		};
		proto.appended = function (elems) {
			var items = this.addItems(elems);
			if (!items.length) {
				return;
			}
			this.layoutItems(items, true);
			this.reveal(items);
		};
		proto.prepended = function (elems) {
			var items = this._itemize(elems);
			if (!items.length) {
				return;
			}
			var previousItems = this.items.slice(0);
			this.items = items.concat(previousItems);
			this._resetLayout();
			this._manageStamps();
			this.layoutItems(items, true);
			this.reveal(items);
			this.layoutItems(previousItems);
		};
		proto.reveal = function (items) {
			this._emitCompleteOnItems('reveal', items);
			if (!items || !items.length) {
				return;
			}
			var stagger = this.updateStagger();
			items.forEach(function (item, i) {
				item.stagger(i * stagger);
				item.reveal();
			});
		};
		proto.hide = function (items) {
			this._emitCompleteOnItems('hide', items);
			if (!items || !items.length) {
				return;
			}
			var stagger = this.updateStagger();
			items.forEach(function (item, i) {
				item.stagger(i * stagger);
				item.hide();
			});
		};
		proto.revealItemElements = function (elems) {
			var items = this.getItems(elems);
			this.reveal(items);
		};
		proto.hideItemElements = function (elems) {
			var items = this.getItems(elems);
			this.hide(items);
		};
		proto.getItem = function (elem) {
			for (var i = 0; i < this.items.length; i++) {
				var item = this.items[i];
				if (item.element == elem) {
					return item;
				}
			}
		};
		proto.getItems = function (elems) {
			elems = utils.makeArray(elems);
			var items = [];
			elems.forEach(function (elem) {
				var item = this.getItem(elem);
				if (item) {
					items.push(item);
				}
			}, this);
			return items;
		};
		proto.remove = function (elems) {
			var removeItems = this.getItems(elems);
			this._emitCompleteOnItems('remove', removeItems);
			if (!removeItems || !removeItems.length) {
				return;
			}
			removeItems.forEach(function (item) {
				item.remove();
				utils.removeFrom(this.items, item);
			}, this);
		};
		proto.destroy = function () {
			var style = this.element.style;
			style.height = '';
			style.position = '';
			style.width = '';
			this.items.forEach(function (item) {
				item.destroy();
			});
			this.unbindResize();
			var id = this.element.outlayerGUID;
			delete instances[id];
			delete this.element.outlayerGUID;
			if (jQuery) {
				jQuery.removeData(this.element, this.constructor.namespace);
			}
		};
		Outlayer.data = function (elem) {
			elem = utils.getQueryElement(elem);
			var id = elem && elem.outlayerGUID;
			return id && instances[id];
		};
		Outlayer.create = function (namespace, options) {
			var Layout = subclass(Outlayer);
			Layout.defaults = utils.extend({}, Outlayer.defaults);
			utils.extend(Layout.defaults, options);
			Layout.compatOptions = utils.extend({}, Outlayer.compatOptions);
			Layout.namespace = namespace;
			Layout.data = Outlayer.data;
			Layout.Item = subclass(Item);
			utils.htmlInit(Layout, namespace);
			if (jQuery && jQuery.bridget) {
				jQuery.bridget(namespace, Layout);
			}
			return Layout;
		};
		function subclass(Parent) {
			function SubClass() {
				Parent.apply(this, arguments);
			}
			SubClass.prototype = Object.create(Parent.prototype);
			SubClass.prototype.constructor = SubClass;
			return SubClass;
		}
		var msUnits = {
			ms: 1,
			s: 1000
		};
		function getMilliseconds(time) {
			if (typeof time == 'number') {
				return time;
			}
			var matches = time.match(/(^\d*\.?\d*)(\w*)/);
			var num = matches && matches[1];
			var unit = matches && matches[2];
			if (!num.length) {
				return 0;
			}
			num = parseFloat(num);
			var mult = msUnits[unit] || 1;
			return num * mult;
		}
		Outlayer.Item = Item;
		return Outlayer;
	}));
(function (window, factory) {
	window.Isotope = window.Isotope || {};
	window.Isotope.Item = factory(window.Outlayer);
}
	("undefined" !== typeof window ? window : this, function factory(Outlayer) {
		"use strict";
		function Item() {
			Outlayer.Item.apply(this, arguments);
		}
		var proto = Item.prototype = Object.create(Outlayer.Item.prototype);
		var _create = proto._create;
		proto._create = function () {
			this.id = this.layout.itemGUID++;
			_create.call(this);
			this.sortData = {};
		};
		proto.updateSortData = function () {
			if (this.isIgnored) {
				return;
			}
			this.sortData.id = this.id;
			this.sortData['original-order'] = this.id;
			this.sortData.random = Math.random();
			var getSortData = this.layout.options.getSortData;
			var sorters = this.layout._sorters;
			for (var key in getSortData) {
				var sorter = sorters[key];
				this.sortData[key] = sorter(this.element, this);
			}
		};
		var _destroy = proto.destroy;
		proto.destroy = function () {
			_destroy.apply(this, arguments);
			this.css({
				display: ''
			});
		};
		return Item;
	}));
(function (window, factory) {
	window.Isotope = window.Isotope || {};
	window.Isotope.LayoutMode = factory(window.getSize, window.Outlayer);
}
	("undefined" !== typeof window ? window : this, function factory(getSize, Outlayer) {
		"use strict";
		function LayoutMode(isotope) {
			this.isotope = isotope;
			if (isotope) {
				this.options = isotope.options[this.namespace];
				this.element = isotope.element;
				this.items = isotope.filteredItems;
				this.size = isotope.size;
			}
		}
		var proto = LayoutMode.prototype;
		var facadeMethods = ['_resetLayout', '_getItemLayoutPosition', '_manageStamp', '_getContainerSize', '_getElementOffset', 'needsResizeLayout', '_getOption'];
		facadeMethods.forEach(function (methodName) {
			proto[methodName] = function () {
				return Outlayer.prototype[methodName].apply(this.isotope, arguments);
			};
		});
		proto.needsVerticalResizeLayout = function () {
			var size = getSize(this.isotope.element);
			var hasSizes = this.isotope.size && size;
			return hasSizes && size.innerHeight != this.isotope.size.innerHeight;
		};
		proto._getMeasurement = function () {
			this.isotope._getMeasurement.apply(this, arguments);
		};
		proto.getColumnWidth = function () {
			this.getSegmentSize('column', 'Width');
		};
		proto.getRowHeight = function () {
			this.getSegmentSize('row', 'Height');
		};
		proto.getSegmentSize = function (segment, size) {
			var segmentName = segment + size;
			var outerSize = 'outer' + size;
			this._getMeasurement(segmentName, outerSize);
			if (this[segmentName]) {
				return;
			}
			var firstItemSize = this.getFirstItemSize();
			this[segmentName] = firstItemSize && firstItemSize[outerSize] || this.isotope.size['inner' + size];
		};
		proto.getFirstItemSize = function () {
			var firstItem = this.isotope.filteredItems[0];
			return firstItem && firstItem.element && getSize(firstItem.element);
		};
		proto.layout = function () {
			this.isotope.layout.apply(this.isotope, arguments);
		};
		proto.getSize = function () {
			this.isotope.getSize();
			this.size = this.isotope.size;
		};
		LayoutMode.modes = {};
		LayoutMode.create = function (namespace, options) {
			function Mode() {
				LayoutMode.apply(this, arguments);
			}
			Mode.prototype = Object.create(proto);
			Mode.prototype.constructor = Mode;
			if (options) {
				Mode.options = options;
			}
			Mode.prototype.namespace = namespace;
			LayoutMode.modes[namespace] = Mode;
			return Mode;
		};
		return LayoutMode;
	}));
(function (window, factory) {
	window.Masonry = factory(window.Outlayer, window.getSize);
}
	("undefined" !== typeof window ? window : this, function factory(Outlayer, getSize) {
		var Masonry = Outlayer.create('masonry');
		Masonry.compatOptions.fitWidth = 'isFitWidth';
		Masonry.prototype._resetLayout = function () {
			this.getSize();
			this._getMeasurement('columnWidth', 'outerWidth');
			this._getMeasurement('gutter', 'outerWidth');
			this.measureColumns();
			this.colYs = [];
			for (var i = 0; i < this.cols; i++) {
				this.colYs.push(0);
			}
			this.maxY = 0;
		};
		Masonry.prototype.measureColumns = function () {
			this.getContainerWidth();
			if (!this.columnWidth) {
				var firstItem = this.items[0];
				var firstItemElem = firstItem && firstItem.element;
				this.columnWidth = firstItemElem && getSize(firstItemElem).outerWidth || this.containerWidth;
			}
			var columnWidth = this.columnWidth += this.gutter;
			var containerWidth = this.containerWidth + this.gutter;
			var cols = containerWidth / columnWidth;
			var excess = columnWidth - containerWidth % columnWidth;
			var mathMethod = excess && excess < 1 ? 'round' : 'floor';
			cols = Math[mathMethod](cols);
			this.cols = Math.max(cols, 1);
		};
		Masonry.prototype.getContainerWidth = function () {
			var isFitWidth = this._getOption('fitWidth');
			var container = isFitWidth ? this.element.parentNode : this.element;
			var size = getSize(container);
			this.containerWidth = size && size.innerWidth;
		};
		Masonry.prototype._getItemLayoutPosition = function (item) {
			item.getSize();
			var remainder = item.size.outerWidth % this.columnWidth;
			var mathMethod = remainder && remainder < 1 ? 'round' : 'ceil';
			var colSpan = Math[mathMethod](item.size.outerWidth / this.columnWidth);
			colSpan = Math.min(colSpan, this.cols);
			var colGroup = this._getColGroup(colSpan);
			var minimumY = Math.min.apply(Math, colGroup);
			var shortColIndex = colGroup.indexOf(minimumY);
			var position = {
				x: this.columnWidth * shortColIndex,
				y: minimumY
			};
			var setHeight = minimumY + item.size.outerHeight;
			var setSpan = this.cols + 1 - colGroup.length;
			for (var i = 0; i < setSpan; i++) {
				this.colYs[shortColIndex + i] = setHeight;
			}
			return position;
		};
		Masonry.prototype._getColGroup = function (colSpan) {
			if (colSpan < 2) {
				return this.colYs;
			}
			var colGroup = [];
			var groupCount = this.cols + 1 - colSpan;
			for (var i = 0; i < groupCount; i++) {
				var groupColYs = this.colYs.slice(i, i + colSpan);
				colGroup[i] = Math.max.apply(Math, groupColYs);
			}
			return colGroup;
		};
		Masonry.prototype._manageStamp = function (stamp) {
			var stampSize = getSize(stamp);
			var offset = this._getElementOffset(stamp);
			var isOriginLeft = this._getOption('originLeft');
			var firstX = isOriginLeft ? offset.left : offset.right;
			var lastX = firstX + stampSize.outerWidth;
			var firstCol = Math.floor(firstX / this.columnWidth);
			firstCol = Math.max(0, firstCol);
			var lastCol = Math.floor(lastX / this.columnWidth);
			lastCol -= lastX % this.columnWidth ? 0 : 1;
			lastCol = Math.min(this.cols - 1, lastCol);
			var isOriginTop = this._getOption('originTop');
			var stampMaxY = (isOriginTop ? offset.top : offset.bottom) + stampSize.outerHeight;
			for (var i = firstCol; i <= lastCol; i++) {
				this.colYs[i] = Math.max(stampMaxY, this.colYs[i]);
			}
		};
		Masonry.prototype._getContainerSize = function () {
			this.maxY = Math.max.apply(Math, this.colYs);
			var size = {
				height: this.maxY
			};
			if (this._getOption('fitWidth')) {
				size.width = this._getContainerFitWidth();
			}
			return size;
		};
		Masonry.prototype._getContainerFitWidth = function () {
			var unusedCols = 0;
			var i = this.cols;
			while (--i) {
				if (this.colYs[i] !== 0) {
					break;
				}
				unusedCols++;
			}
			return (this.cols - unusedCols) * this.columnWidth - this.gutter;
		};
		Masonry.prototype.needsResizeLayout = function () {
			var previousWidth = this.containerWidth;
			this.getContainerWidth();
			return previousWidth != this.containerWidth;
		};
		return Masonry;
	}));
(function (window, factory) {
	factory(window.Isotope.LayoutMode, window.Masonry);
}
	("undefined" !== typeof window ? window : this, function factory(LayoutMode, Masonry) {
		"use strict";
		var MasonryMode = LayoutMode.create('masonry');
		var proto = MasonryMode.prototype;
		var keepModeMethods = {
			_getElementOffset: true,
			layout: true,
			_getMeasurement: true
		};
		for (var method in Masonry.prototype) {
			if (!keepModeMethods[method]) {
				proto[method] = Masonry.prototype[method];
			}
		}
		var measureColumns = proto.measureColumns;
		proto.measureColumns = function () {
			this.items = this.isotope.filteredItems;
			measureColumns.call(this);
		};
		var _getOption = proto._getOption;
		proto._getOption = function (option) {
			if (option == 'fitWidth') {
				return this.options.isFitWidth !== undefined ? this.options.isFitWidth : this.options.fitWidth;
			}
			return _getOption.apply(this.isotope, arguments);
		};
		return MasonryMode;
	}));
(function (window, factory) {
	factory(window.Isotope.LayoutMode);
}
	("undefined" !== typeof window ? window : this, function factory(LayoutMode) {
		"use strict";
		var FitRows = LayoutMode.create('fitRows');
		var proto = FitRows.prototype;
		proto._resetLayout = function () {
			this.x = 0;
			this.y = 0;
			this.maxY = 0;
			this._getMeasurement('gutter', 'outerWidth');
		};
		proto._getItemLayoutPosition = function (item) {
			item.getSize();
			var itemWidth = item.size.outerWidth + this.gutter;
			var containerWidth = this.isotope.size.innerWidth + this.gutter;
			if (this.x !== 0 && itemWidth + this.x > containerWidth) {
				this.x = 0;
				this.y = this.maxY;
			}
			var position = {
				x: this.x,
				y: this.y
			};
			this.maxY = Math.max(this.maxY, this.y + item.size.outerHeight);
			this.x += itemWidth;
			return position;
		};
		proto._getContainerSize = function () {
			return {
				height: this.maxY
			};
		};
		return FitRows;
	}));
(function (window, factory) {
	factory(window.Isotope.LayoutMode);
}
	("undefined" !== typeof window ? window : this, function factory(LayoutMode) {
		"use strict";
		var Vertical = LayoutMode.create('vertical', {
				horizontalAlignment: 0
			});
		var proto = Vertical.prototype;
		proto._resetLayout = function () {
			this.y = 0;
		};
		proto._getItemLayoutPosition = function (item) {
			item.getSize();
			var x = (this.isotope.size.innerWidth - item.size.outerWidth) * this.options.horizontalAlignment;
			var y = this.y;
			this.y += item.size.outerHeight;
			return {
				x: x,
				y: y
			};
		};
		proto._getContainerSize = function () {
			return {
				height: this.y
			};
		};
		return Vertical;
	}));
(function (window, factory) {
	window.Isotope = factory(window, window.Outlayer, window.getSize, window.matchesSelector, window.fizzyUIUtils, window.Isotope.Item, window.Isotope.LayoutMode);
}
	("undefined" !== typeof window ? window : this, function factory(window, Outlayer, getSize, matchesSelector, utils, Item, LayoutMode) {
		var jQuery = window.jQuery;
		var trim = String.prototype.trim ? function (str) {
			return str.trim();
		}
		 : function (str) {
			return str.replace(/^\s+|\s+$/g, '');
		};
		var Isotope = Outlayer.create('isotope', {
				layoutMode: 'masonry',
				isJQueryFiltering: true,
				sortAscending: true
			});
		Isotope.Item = Item;
		Isotope.LayoutMode = LayoutMode;
		var proto = Isotope.prototype;
		proto._create = function () {
			this.itemGUID = 0;
			this._sorters = {};
			this._getSorters();
			Outlayer.prototype._create.call(this);
			this.modes = {};
			this.filteredItems = this.items;
			this.sortHistory = ['original-order'];
			for (var name in LayoutMode.modes) {
				this._initLayoutMode(name);
			}
		};
		proto.reloadItems = function () {
			this.itemGUID = 0;
			Outlayer.prototype.reloadItems.call(this);
		};
		proto._itemize = function () {
			var items = Outlayer.prototype._itemize.apply(this, arguments);
			for (var i = 0; i < items.length; i++) {
				var item = items[i];
				item.id = this.itemGUID++;
			}
			this._updateItemsSortData(items);
			return items;
		};
		proto._initLayoutMode = function (name) {
			var Mode = LayoutMode.modes[name];
			var initialOpts = this.options[name] || {};
			this.options[name] = Mode.options ? utils.extend(Mode.options, initialOpts) : initialOpts;
			this.modes[name] = new Mode(this);
		};
		proto.layout = function () {
			if (!this._isLayoutInited && this._getOption('initLayout')) {
				this.arrange();
				return;
			}
			this._layout();
		};
		proto._layout = function () {
			var isInstant = this._getIsInstant();
			this._resetLayout();
			this._manageStamps();
			this.layoutItems(this.filteredItems, isInstant);
			this._isLayoutInited = true;
		};
		proto.arrange = function (opts) {
			this.option(opts);
			this._getIsInstant();
			var filtered = this._filter(this.items);
			this.filteredItems = filtered.matches;
			this._bindArrangeComplete();
			if (this._isInstant) {
				this._noTransition(this._hideReveal, [filtered]);
			} else {
				this._hideReveal(filtered);
			}
			this._sort();
			this._layout();
		};
		proto._init = proto.arrange;
		proto._hideReveal = function (filtered) {
			this.reveal(filtered.needReveal);
			this.hide(filtered.needHide);
		};
		proto._getIsInstant = function () {
			var isLayoutInstant = this._getOption('layoutInstant');
			var isInstant = isLayoutInstant !== undefined ? isLayoutInstant : !this._isLayoutInited;
			this._isInstant = isInstant;
			return isInstant;
		};
		proto._bindArrangeComplete = function () {
			var isLayoutComplete,
			isHideComplete,
			isRevealComplete;
			var _this = this;
			function arrangeParallelCallback() {
				if (isLayoutComplete && isHideComplete && isRevealComplete) {
					_this.dispatchEvent('arrangeComplete', null, [_this.filteredItems]);
				}
			}
			this.once('layoutComplete', function () {
				isLayoutComplete = true;
				arrangeParallelCallback();
			});
			this.once('hideComplete', function () {
				isHideComplete = true;
				arrangeParallelCallback();
			});
			this.once('revealComplete', function () {
				isRevealComplete = true;
				arrangeParallelCallback();
			});
		};
		proto._filter = function (items) {
			var filter = this.options.filter;
			filter = filter || '*';
			var matches = [];
			var hiddenMatched = [];
			var visibleUnmatched = [];
			var test = this._getFilterTest(filter);
			for (var i = 0; i < items.length; i++) {
				var item = items[i];
				if (item.isIgnored) {
					continue;
				}
				var isMatched = test(item);
				if (isMatched) {
					matches.push(item);
				}
				if (isMatched && item.isHidden) {
					hiddenMatched.push(item);
				} else if (!isMatched && !item.isHidden) {
					visibleUnmatched.push(item);
				}
			}
			return {
				matches: matches,
				needReveal: hiddenMatched,
				needHide: visibleUnmatched
			};
		};
		proto._getFilterTest = function (filter) {
			if (jQuery && this.options.isJQueryFiltering) {
				return function (item) {
					return jQuery(item.element).is(filter);
				};
			}
			if (typeof filter == "function") {
				return function (item) {
					return filter(item.element);
				};
			}
			return function (item) {
				return matchesSelector(item.element, filter);
			};
		};
		proto.updateSortData = function (elems) {
			var items;
			if (elems) {
				elems = utils.makeArray(elems);
				items = this.getItems(elems);
			} else {
				items = this.items;
			}
			this._getSorters();
			this._updateItemsSortData(items);
		};
		proto._getSorters = function () {
			var getSortData = this.options.getSortData;
			for (var key in getSortData) {
				var sorter = getSortData[key];
				this._sorters[key] = mungeSorter(sorter);
			}
		};
		proto._updateItemsSortData = function (items) {
			var len = items && items.length;
			for (var i = 0; len && i < len; i++) {
				var item = items[i];
				item.updateSortData();
			}
		};
		var mungeSorter = (function () {
			function mungeSorter(sorter) {
				if (typeof sorter != 'string') {
					return sorter;
				}
				var args = trim(sorter).split(' ');
				var query = args[0];
				var attrMatch = query.match(/^\[(.+)\]$/);
				var attr = attrMatch && attrMatch[1];
				var getValue = getValueGetter(attr, query);
				var parser = Isotope.sortDataParsers[args[1]];
				sorter = parser ? function (elem) {
					return elem && parser(getValue(elem));
				}
				 : function (elem) {
					return elem && getValue(elem);
				};
				return sorter;
			}
			function getValueGetter(attr, query) {
				if (attr) {
					return function getAttribute(elem) {
						return elem.getAttribute(attr);
					};
				}
				return function getChildText(elem) {
					var child = elem.querySelector(query);
					return child && child.textContent;
				};
			}
			return mungeSorter;
		}());
		Isotope.sortDataParsers = {
			'parseInt': function (val) {
				return parseInt(val, 10);
			},
			'parseFloat': function (val) {
				return parseFloat(val);
			}
		};
		proto._sort = function () {
			var sortByOpt = this.options.sortBy;
			if (!sortByOpt) {
				return;
			}
			var sortBys = [].concat.apply(sortByOpt, this.sortHistory);
			var itemSorter = getItemSorter(sortBys, this.options.sortAscending);
			this.filteredItems.sort(itemSorter);
			if (sortByOpt != this.sortHistory[0]) {
				this.sortHistory.unshift(sortByOpt);
			}
		};
		function getItemSorter(sortBys, sortAsc) {
			return function sorter(itemA, itemB) {
				for (var i = 0; i < sortBys.length; i++) {
					var sortBy = sortBys[i];
					var a = itemA.sortData[sortBy];
					var b = itemB.sortData[sortBy];
					if (a > b || a < b) {
						var isAscending = sortAsc[sortBy] !== undefined ? sortAsc[sortBy] : sortAsc;
						var direction = isAscending ? 1 : -1;
						return (a > b ? 1 : -1) * direction;
					}
				}
				return 0;
			};
		}
		proto._mode = function () {
			var layoutMode = this.options.layoutMode;
			var mode = this.modes[layoutMode];
			if (!mode) {
				throw new Error('No layout mode: ' + layoutMode);
			}
			mode.options = this.options[layoutMode];
			return mode;
		};
		proto._resetLayout = function () {
			Outlayer.prototype._resetLayout.call(this);
			this._mode()._resetLayout();
		};
		proto._getItemLayoutPosition = function (item) {
			return this._mode()._getItemLayoutPosition(item);
		};
		proto._manageStamp = function (stamp) {
			this._mode()._manageStamp(stamp);
		};
		proto._getContainerSize = function () {
			return this._mode()._getContainerSize();
		};
		proto.needsResizeLayout = function () {
			return this._mode().needsResizeLayout();
		};
		proto.appended = function (elems) {
			var items = this.addItems(elems);
			if (!items.length) {
				return;
			}
			var filteredItems = this._filterRevealAdded(items);
			this.filteredItems = this.filteredItems.concat(filteredItems);
		};
		proto.prepended = function (elems) {
			var items = this._itemize(elems);
			if (!items.length) {
				return;
			}
			this._resetLayout();
			this._manageStamps();
			var filteredItems = this._filterRevealAdded(items);
			this.layoutItems(this.filteredItems);
			this.filteredItems = filteredItems.concat(this.filteredItems);
			this.items = items.concat(this.items);
		};
		proto._filterRevealAdded = function (items) {
			var filtered = this._filter(items);
			this.hide(filtered.needHide);
			this.reveal(filtered.matches);
			this.layoutItems(filtered.matches, true);
			return filtered.matches;
		};
		proto.insert = function (elems) {
			var items = this.addItems(elems);
			if (!items.length) {
				return;
			}
			var i,
			item;
			var len = items.length;
			for (i = 0; i < len; i++) {
				item = items[i];
				this.element.appendChild(item.element);
			}
			var filteredInsertItems = this._filter(items).matches;
			for (i = 0; i < len; i++) {
				items[i].isLayoutInstant = true;
			}
			this.arrange();
			for (i = 0; i < len; i++) {
				delete items[i].isLayoutInstant;
			}
			this.reveal(filteredInsertItems);
		};
		var _remove = proto.remove;
		proto.remove = function (elems) {
			elems = utils.makeArray(elems);
			var removeItems = this.getItems(elems);
			_remove.call(this, elems);
			var len = removeItems && removeItems.length;
			for (var i = 0; len && i < len; i++) {
				var item = removeItems[i];
				utils.removeFrom(this.filteredItems, item);
			}
		};
		proto.shuffle = function () {
			for (var i = 0; i < this.items.length; i++) {
				var item = this.items[i];
				item.sortData.random = Math.random();
			}
			this.options.sortBy = 'random';
			this._sort();
			this._layout();
		};
		proto._noTransition = function (fn, args) {
			var transitionDuration = this.options.transitionDuration;
			this.options.transitionDuration = 0;
			var returnValue = fn.apply(this, args);
			this.options.transitionDuration = transitionDuration;
			return returnValue;
		};
		proto.getFilteredItemElements = function () {
			return this.filteredItems.map(function (item) {
				return item.element;
			});
		};
		return Isotope;
	}));
/* jshint forin: true */
/*!
 * modified imagesLoaded PACKAGED v4.1.1
 * JavaScript is all like "You images are done yet or what?"
 * MIT License
 * removed module check
 * exposed as window property
 * passes jshint
 */
(function (root, factory) {
	root.EvEmitter = factory();
}
	( "undefined" !== typeof window ? window : this, function () {
		function EvEmitter() {}
		var proto = EvEmitter.prototype;
		proto.on = function (eventName, listener) {
			if (!eventName || !listener) {
				return;
			}
			var events = this._events = this._events || {};
			var listeners = events[eventName] = events[eventName] || [];
			if (listeners.indexOf(listener) == -1) {
				listeners.push(listener);
			}
			return this;
		};
		proto.once = function (eventName, listener) {
			if (!eventName || !listener) {
				return;
			}
			this.on(eventName, listener);
			var onceEvents = this._onceEvents = this._onceEvents || {};
			var onceListeners = onceEvents[eventName] = onceEvents[eventName] || {};
			onceListeners[listener] = true;
			return this;
		};
		proto.off = function (eventName, listener) {
			var listeners = this._events && this._events[eventName];
			if (!listeners || !listeners.length) {
				return;
			}
			var index = listeners.indexOf(listener);
			if (index != -1) {
				listeners.splice(index, 1);
			}
			return this;
		};
		proto.emitEvent = function (eventName, args) {
			var listeners = this._events && this._events[eventName];
			if (!listeners || !listeners.length) {
				return;
			}
			var i = 0;
			var listener = listeners[i];
			args = args || [];
			var onceListeners = this._onceEvents && this._onceEvents[eventName];
			while (listener) {
				var isOnce = onceListeners && onceListeners[listener];
				if (isOnce) {
					this.off(eventName, listener);
					delete onceListeners[listener];
				}
				listener.apply(this, args);
				i += isOnce ? 0 : 1;
				listener = listeners[i];
			}
			return this;
		};
		return EvEmitter;
	}));
(function (window, factory) {
	"use strict";
	window.imagesLoaded = factory(window, window.EvEmitter);
})("undefined" !== typeof window ? window : this, function factory(window, EvEmitter) {
	var $ = window.jQuery;
	var console = window.console;
	function extend(a, b) {
		for (var prop in b) {
			if (b.hasOwnProperty(prop)) {
				a[prop] = b[prop];
			}
		}
		return a;
	}
	function makeArray(obj) {
		var ary = [];
		if (Array.isArray(obj)) {
			ary = obj;
		} else if (typeof obj.length == 'number') {
			for (var i = 0; i < obj.length; i++) {
				ary.push(obj[i]);
			}
		} else {
			ary.push(obj);
		}
		return ary;
	}
	function ImagesLoaded(elem, options, onAlways) {
		if (!(this instanceof ImagesLoaded)) {
			return new ImagesLoaded(elem, options, onAlways);
		}
		if (typeof elem == 'string') {
			elem = document.querySelectorAll(elem);
		}
		this.elements = makeArray(elem);
		this.options = extend({}, this.options);
		if (typeof options == "function") {
			onAlways = options;
		} else {
			extend(this.options, options);
		}
		if (onAlways) {
			this.on('always', onAlways);
		}
		this.getImages();
		if ($) {
			this.jqDeferred = new $.Deferred();
		}
		setTimeout(function () {
			this.check();
		}
			.bind(this));
	}
	ImagesLoaded.prototype = Object.create(EvEmitter.prototype);
	ImagesLoaded.prototype.options = {};
	ImagesLoaded.prototype.getImages = function () {
		this.images = [];
		this.elements.forEach(this.addElementImages, this);
	};
	ImagesLoaded.prototype.addElementImages = function (elem) {
		if (elem.nodeName == 'IMG') {
			this.addImage(elem);
		}
		if (this.options.background === true) {
			this.addElementBackgroundImages(elem);
		}
		var nodeType = elem.nodeType;
		if (!nodeType || !elementNodeTypes[nodeType]) {
			return;
		}
		var childImgs = elem.querySelectorAll('img');
		for (var i = 0; i < childImgs.length; i++) {
			var img = childImgs[i];
			this.addImage(img);
		}
		if (typeof this.options.background == 'string') {
			var children = elem.querySelectorAll(this.options.background);
			for (i = 0; i < children.length; i++) {
				var child = children[i];
				this.addElementBackgroundImages(child);
			}
		}
	};
	var elementNodeTypes = {
		1: true,
		9: true,
		11: true
	};
	ImagesLoaded.prototype.addElementBackgroundImages = function (elem) {
		var style = getComputedStyle(elem);
		if (!style) {
			return;
		}
		var reURL = /url\((['"])?(.*?)\1\)/gi;
		var matches = reURL.exec(style.backgroundImage);
		while (matches !== null) {
			var url = matches && matches[2];
			if (url) {
				this.addBackground(url, elem);
			}
			matches = reURL.exec(style.backgroundImage);
		}
	};
	ImagesLoaded.prototype.addImage = function (img) {
		var loadingImage = new LoadingImage(img);
		this.images.push(loadingImage);
	};
	ImagesLoaded.prototype.addBackground = function (url, elem) {
		var background = new Background(url, elem);
		this.images.push(background);
	};
	ImagesLoaded.prototype.check = function () {
		var _this = this;
		this.progressedCount = 0;
		this.hasAnyBroken = false;
		if (!this.images.length) {
			this.complete();
			return;
		}
		function onProgress(image, elem, message) {
			setTimeout(function () {
				_this.progress(image, elem, message);
			});
		}
		this.images.forEach(function (loadingImage) {
			loadingImage.once('progress', onProgress);
			loadingImage.check();
		});
	};
	ImagesLoaded.prototype.progress = function (image, elem, message) {
		this.progressedCount++;
		this.hasAnyBroken = this.hasAnyBroken || !image.isLoaded;
		this.emitEvent('progress', [this, image, elem]);
		if (this.jqDeferred && this.jqDeferred.notify) {
			this.jqDeferred.notify(this, image);
		}
		if (this.progressedCount == this.images.length) {
			this.complete();
		}
		if (this.options.debug && console) {
			console.log('progress: ' + message, image, elem);
		}
	};
	ImagesLoaded.prototype.complete = function () {
		var eventName = this.hasAnyBroken ? 'fail' : 'done';
		this.isComplete = true;
		this.emitEvent(eventName, [this]);
		this.emitEvent('always', [this]);
		if (this.jqDeferred) {
			var jqMethod = this.hasAnyBroken ? 'reject' : 'resolve';
			this.jqDeferred[jqMethod](this);
		}
	};
	function LoadingImage(img) {
		this.img = img;
	}
	LoadingImage.prototype = Object.create(EvEmitter.prototype);
	LoadingImage.prototype.check = function () {
		var isComplete = this.getIsImageComplete();
		if (isComplete) {
			this.confirm(this.img.naturalWidth !== 0, 'naturalWidth');
			return;
		}
		this.proxyImage = new Image();
		this.proxyImage.addEventListener('load', this);
		this.proxyImage.addEventListener('error', this);
		this.img.addEventListener('load', this);
		this.img.addEventListener('error', this);
		this.proxyImage.src = this.img.src;
	};
	LoadingImage.prototype.getIsImageComplete = function () {
		return this.img.complete && this.img.naturalWidth !== undefined;
	};
	LoadingImage.prototype.confirm = function (isLoaded, message) {
		this.isLoaded = isLoaded;
		this.emitEvent('progress', [this, this.img, message]);
	};
	LoadingImage.prototype.handleEvent = function (event) {
		var method = 'on' + event.type;
		if (this[method]) {
			this[method](event);
		}
	};
	LoadingImage.prototype.onload = function () {
		this.confirm(true, 'onload');
		this.unbindEvents();
	};
	LoadingImage.prototype.onerror = function () {
		this.confirm(false, 'onerror');
		this.unbindEvents();
	};
	LoadingImage.prototype.unbindEvents = function () {
		this.proxyImage.removeEventListener('load', this);
		this.proxyImage.removeEventListener('error', this);
		this.img.removeEventListener('load', this);
		this.img.removeEventListener('error', this);
	};
	function Background(url, element) {
		this.url = url;
		this.element = element;
		this.img = new Image();
	}
	Background.prototype = Object.create(LoadingImage.prototype);
	Background.prototype.check = function () {
		this.img.addEventListener('load', this);
		this.img.addEventListener('error', this);
		this.img.src = this.url;
		var isComplete = this.getIsImageComplete();
		if (isComplete) {
			this.confirm(this.img.naturalWidth !== 0, 'naturalWidth');
			this.unbindEvents();
		}
	};
	Background.prototype.unbindEvents = function () {
		this.img.removeEventListener('load', this);
		this.img.removeEventListener('error', this);
	};
	Background.prototype.confirm = function (isLoaded, message) {
		this.isLoaded = isLoaded;
		this.emitEvent('progress', [this, this.element, message]);
	};
	ImagesLoaded.makeJQueryPlugin = function (jQuery) {
		jQuery = jQuery || window.jQuery;
		if (!jQuery) {
			return;
		}
		$ = jQuery;
		$.fn.imagesLoaded = function (options, callback) {
			var instance = new ImagesLoaded(this, options, callback);
			return instance.jqDeferred.promise($(this));
		};
	};
	ImagesLoaded.makeJQueryPlugin();
	return ImagesLoaded;
});
