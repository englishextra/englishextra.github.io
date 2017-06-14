/*!
 * modified Packery PACKAGED v2.1.1
 * Gapless, draggable grid layouts
 * Licensed GPLv3 for open source use
 * or Packery Commercial License for commercial use
 * packery.metafizzy.co
 * Copyright 2016 Metafizzy
 * removed jQuery support
 * removed module check
 * exposed as window property
 * @see {@link https://github.com/metafizzy/packery/blob/master/dist/packery.pkgd.js}
 * passes jshint
 */
(function (root, factory) {
	"use strict";
	root.getSize = factory();
})( "undefined" !== typeof window ? window : this, function factory() {
	"use strict";
	function getStyleSize(value) {
		var num = parseFloat(value);
		var isValid = value.indexOf('%') === -1 && !isNaN(num);
		return isValid && num;
	}
	function noop() {}
	var logError = typeof console === "undefined" ? noop : function (message) {
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
		getSize.isBoxSizeOuter = isBoxSizeOuter = getStyleSize(style.width) === 200;
		body.removeChild(div);
	}
	function getSize(elem) {
		setup();
		if (typeof elem === "string") {
			elem = document.querySelector(elem);
		}
		if (!elem || typeof elem !== "object" || !elem.nodeType) {
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
			if (listeners.indexOf(listener) === -1) {
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
			if (index !== -1) {
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
				if (b.hasOwnProperty(prop)) {
					a[prop] = b[prop];
				}
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
			} else if (obj && typeof obj.length === "number") {
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
			if (index !== -1) {
				ary.splice(index, 1);
			}
		};
		utils.getParent = function (elem, selector) {
			while (elem !== document.body) {
				elem = elem.parentNode;
				if (matchesSelector(elem, selector)) {
					return elem;
				}
			}
		};
		utils.getQueryElement = function (elem) {
			if (typeof elem === "string") {
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
			if (document.readyState == 'complete') {
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
				if (obj.hasOwnProperty(prop)) {
					return false;
				}
			}
			prop = null;
			return true;
		}
		var docElemStyle = document.documentElement.style;
		var transitionProperty = typeof docElemStyle.transition === "string" ? 'transition' : 'WebkitTransition';
		var transformProperty = typeof docElemStyle.transform === "string" ? "transform" : "WebkitTransform";
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
				if (style.hasOwnProperty(prop)) {
					var supportedProp = vendorProperties[prop] || prop;
					elemStyle[supportedProp] = style[prop];
				}
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
			var y = yValue.indexOf('%') !== -1 ? (parseFloat(yValue) / 100) * layoutSize.height : parseInt(yValue, 10);
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
				if (args.onTransitionEnd.hasOwnProperty(prop)) {
					args.onTransitionEnd[prop].call(this);
				}
			}
		};
		proto.transition = function (args) {
			if (!parseFloat(this.layout.options.transitionDuration)) {
				this._nonTransition(args);
				return;
			}
			var _transition = this._transn;
			for (var prop in args.onTransitionEnd) {
				if (args.onTransitionEnd.hasOwnProperty(prop)) {
					_transition.onEnd[prop] = args.onTransitionEnd[prop];
				}
			}
			for (prop in args.to) {
				if (args.to.hasOwnProperty(prop)) {
					_transition.ingProperties[prop] = true;
					if (args.isCleaning) {
						_transition.clean[prop] = true;
					}
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
			duration = typeof duration === "number" ? duration + 'ms' : duration;
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
			'-webkit-transform': "transform"
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
				if (style.hasOwnProperty(prop)) {
					cleanStyle[prop] = '';
				}
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
				if (optionStyle.hasOwnProperty(prop)) {
					return prop;
				}
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
				if (typeof option === "string") {
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
				if (doneCount === count) {
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
			if (typeof elems === "string") {
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
				if (item.element === elem) {
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
			if (typeof time === 'number') {
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
	window.Packery = window.Packery || {};
	window.Packery.Rect = factory();
}
	("undefined" !== typeof window ? window : this, function factory() {
		"use strict";
		function Rect(props) {
			for (var prop in Rect.defaults) {
				if (Rect.defaults.hasOwnProperty(prop)) {
					this[prop] = Rect.defaults[prop];
				}
			}
			for (prop in props) {
				if (props.hasOwnProperty(prop)) {
					this[prop] = props[prop];
				}
			}
		}
		Rect.defaults = {
			x: 0,
			y: 0,
			width: 0,
			height: 0
		};
		var proto = Rect.prototype;
		proto.contains = function (rect) {
			var otherWidth = rect.width || 0;
			var otherHeight = rect.height || 0;
			return this.x <= rect.x && this.y <= rect.y && this.x + this.width >= rect.x + otherWidth && this.y + this.height >= rect.y + otherHeight;
		};
		proto.overlaps = function (rect) {
			var thisRight = this.x + this.width;
			var thisBottom = this.y + this.height;
			var rectRight = rect.x + rect.width;
			var rectBottom = rect.y + rect.height;
			return this.x < rectRight && thisRight > rect.x && this.y < rectBottom && thisBottom > rect.y;
		};
		proto.getMaximalFreeRects = function (rect) {
			if (!this.overlaps(rect)) {
				return false;
			}
			var freeRects = [];
			var freeRect;
			var thisRight = this.x + this.width;
			var thisBottom = this.y + this.height;
			var rectRight = rect.x + rect.width;
			var rectBottom = rect.y + rect.height;
			if (this.y < rect.y) {
				freeRect = new Rect({
						x: this.x,
						y: this.y,
						width: this.width,
						height: rect.y - this.y
					});
				freeRects.push(freeRect);
			}
			if (thisRight > rectRight) {
				freeRect = new Rect({
						x: rectRight,
						y: this.y,
						width: thisRight - rectRight,
						height: this.height
					});
				freeRects.push(freeRect);
			}
			if (thisBottom > rectBottom) {
				freeRect = new Rect({
						x: this.x,
						y: rectBottom,
						width: this.width,
						height: thisBottom - rectBottom
					});
				freeRects.push(freeRect);
			}
			if (this.x < rect.x) {
				freeRect = new Rect({
						x: this.x,
						y: this.y,
						width: rect.x - this.x,
						height: this.height
					});
				freeRects.push(freeRect);
			}
			return freeRects;
		};
		proto.canFit = function (rect) {
			return this.width >= rect.width && this.height >= rect.height;
		};
		return Rect;
	}));
(function (window, factory) {
	var Packery = window.Packery = window.Packery || {};
	Packery.Packer = factory(Packery.Rect);
}
	("undefined" !== typeof window ? window : this, function factory(Rect) {
		"use strict";
		function Packer(width, height, sortDirection) {
			this.width = width || 0;
			this.height = height || 0;
			this.sortDirection = sortDirection || 'downwardLeftToRight';
			this.reset();
		}
		var proto = Packer.prototype;
		proto.reset = function () {
			this.spaces = [];
			var initialSpace = new Rect({
					x: 0,
					y: 0,
					width: this.width,
					height: this.height
				});
			this.spaces.push(initialSpace);
			this.sorter = sorters[this.sortDirection] || sorters.downwardLeftToRight;
		};
		proto.pack = function (rect) {
			for (var i = 0; i < this.spaces.length; i++) {
				var space = this.spaces[i];
				if (space.canFit(rect)) {
					this.placeInSpace(rect, space);
					break;
				}
			}
		};
		proto.columnPack = function (rect) {
			for (var i = 0; i < this.spaces.length; i++) {
				var space = this.spaces[i];
				var canFitInSpaceColumn = space.x <= rect.x && space.x + space.width >= rect.x + rect.width && space.height >= rect.height - 0.01;
				if (canFitInSpaceColumn) {
					rect.y = space.y;
					this.placed(rect);
					break;
				}
			}
		};
		proto.rowPack = function (rect) {
			for (var i = 0; i < this.spaces.length; i++) {
				var space = this.spaces[i];
				var canFitInSpaceRow = space.y <= rect.y && space.y + space.height >= rect.y + rect.height && space.width >= rect.width - 0.01;
				if (canFitInSpaceRow) {
					rect.x = space.x;
					this.placed(rect);
					break;
				}
			}
		};
		proto.placeInSpace = function (rect, space) {
			rect.x = space.x;
			rect.y = space.y;
			this.placed(rect);
		};
		proto.placed = function (rect) {
			var revisedSpaces = [];
			for (var i = 0; i < this.spaces.length; i++) {
				var space = this.spaces[i];
				var newSpaces = space.getMaximalFreeRects(rect);
				if (newSpaces) {
					revisedSpaces.push.apply(revisedSpaces, newSpaces);
				} else {
					revisedSpaces.push(space);
				}
			}
			this.spaces = revisedSpaces;
			this.mergeSortSpaces();
		};
		proto.mergeSortSpaces = function () {
			Packer.mergeRects(this.spaces);
			this.spaces.sort(this.sorter);
		};
		proto.addSpace = function (rect) {
			this.spaces.push(rect);
			this.mergeSortSpaces();
		};
		Packer.mergeRects = function (rects) {
			var i = 0;
			var rect = rects[i];
			rectLoop: while (rect) {
				var j = 0;
				var compareRect = rects[i + j];
				while (compareRect) {
					if (compareRect === rect) {
						j++;
					} else if (compareRect.contains(rect)) {
						rects.splice(i, 1);
						rect = rects[i];
						continue rectLoop;
					} else if (rect.contains(compareRect)) {
						rects.splice(i + j, 1);
					} else {
						j++;
					}
					compareRect = rects[i + j];
				}
				i++;
				rect = rects[i];
			}
			return rects;
		};
		var sorters = {
			downwardLeftToRight: function (a, b) {
				return a.y - b.y || a.x - b.x;
			},
			rightwardTopToBottom: function (a, b) {
				return a.x - b.x || a.y - b.y;
			}
		};
		return Packer;
	}));
(function (window, factory) {
	window.Packery.Item = factory(window.Outlayer, window.Packery.Rect);
}
	("undefined" !== typeof window ? window : this, function factory(Outlayer, Rect) {
		"use strict";
		var docElemStyle = document.documentElement.style;
		var transformProperty = typeof docElemStyle.transform === "string" ? "transform" : "WebkitTransform";
		var Item = function PackeryItem() {
			Outlayer.Item.apply(this, arguments);
		};
		var proto = Item.prototype = Object.create(Outlayer.Item.prototype);
		var __create = proto._create;
		proto._create = function () {
			__create.call(this);
			this.rect = new Rect();
		};
		var _moveTo = proto.moveTo;
		proto.moveTo = function (x, y) {
			var dx = Math.abs(this.position.x - x);
			var dy = Math.abs(this.position.y - y);
			var canHackGoTo = this.layout.dragItemCount && !this.isPlacing && !this.isTransitioning && dx < 1 && dy < 1;
			if (canHackGoTo) {
				this.goTo(x, y);
				return;
			}
			_moveTo.apply(this, arguments);
		};
		proto.enablePlacing = function () {
			this.removeTransitionStyles();
			if (this.isTransitioning && transformProperty) {
				this.element.style[transformProperty] = 'none';
			}
			this.isTransitioning = false;
			this.getSize();
			this.layout._setRectSize(this.element, this.rect);
			this.isPlacing = true;
		};
		proto.disablePlacing = function () {
			this.isPlacing = false;
		};
		proto.removeElem = function () {
			this.element.parentNode.removeChild(this.element);
			this.layout.packer.addSpace(this.rect);
			this.emitEvent('remove', [this]);
		};
		proto.showDropPlaceholder = function () {
			var dropPlaceholder = this.dropPlaceholder;
			if (!dropPlaceholder) {
				dropPlaceholder = this.dropPlaceholder = document.createElement('div');
				dropPlaceholder.className = 'packery-drop-placeholder';
				dropPlaceholder.style.position = 'absolute';
			}
			dropPlaceholder.style.width = this.size.width + 'px';
			dropPlaceholder.style.height = this.size.height + 'px';
			this.positionDropPlaceholder();
			this.layout.element.appendChild(dropPlaceholder);
		};
		proto.positionDropPlaceholder = function () {
			this.dropPlaceholder.style[transformProperty] = 'translate(' + this.rect.x + 'px, ' + this.rect.y + 'px)';
		};
		proto.hideDropPlaceholder = function () {
			var parent = this.dropPlaceholder.parentNode;
			if (parent) {
				parent.removeChild(this.dropPlaceholder);
			}
		};
		return Item;
	}));
(function (window, factory) {
	window.Packery = factory(window.getSize, window.Outlayer, window.Packery.Rect, window.Packery.Packer, window.Packery.Item);
}
	("undefined" !== typeof window ? window : this, function factory(getSize, Outlayer, Rect, Packer, Item) {
		"use strict";
		Rect.prototype.canFit = function (rect) {
			return this.width >= rect.width - 1 && this.height >= rect.height - 1;
		};
		var Packery = Outlayer.create('packery');
		Packery.Item = Item;
		var proto = Packery.prototype;
		proto._create = function () {
			Outlayer.prototype._create.call(this);
			this.packer = new Packer();
			this.shiftPacker = new Packer();
			this.isEnabled = true;
			this.dragItemCount = 0;
			var _this = this;
			this.handleDraggabilly = {
				dragStart: function () {
					_this.itemDragStart(this.element);
				},
				dragMove: function () {
					_this.itemDragMove(this.element, this.position.x, this.position.y);
				},
				dragEnd: function () {
					_this.itemDragEnd(this.element);
				}
			};
			this.handleUIDraggable = {
				start: function handleUIDraggableStart(event, ui) {
					if (!ui) {
						return;
					}
					_this.itemDragStart(event.currentTarget);
				},
				drag: function handleUIDraggableDrag(event, ui) {
					if (!ui) {
						return;
					}
					_this.itemDragMove(event.currentTarget, ui.position.left, ui.position.top);
				},
				stop: function handleUIDraggableStop(event, ui) {
					if (!ui) {
						return;
					}
					_this.itemDragEnd(event.currentTarget);
				}
			};
		};
		proto._resetLayout = function () {
			this.getSize();
			this._getMeasurements();
			var width,
			height,
			sortDirection;
			if (this._getOption('horizontal')) {
				width = Infinity;
				height = this.size.innerHeight + this.gutter;
				sortDirection = 'rightwardTopToBottom';
			} else {
				width = this.size.innerWidth + this.gutter;
				height = Infinity;
				sortDirection = 'downwardLeftToRight';
			}
			this.packer.width = this.shiftPacker.width = width;
			this.packer.height = this.shiftPacker.height = height;
			this.packer.sortDirection = this.shiftPacker.sortDirection = sortDirection;
			this.packer.reset();
			this.maxY = 0;
			this.maxX = 0;
		};
		proto._getMeasurements = function () {
			this._getMeasurement('columnWidth', 'width');
			this._getMeasurement('rowHeight', 'height');
			this._getMeasurement('gutter', 'width');
		};
		proto._getItemLayoutPosition = function (item) {
			this._setRectSize(item.element, item.rect);
			if (this.isShifting || this.dragItemCount > 0) {
				var packMethod = this._getPackMethod();
				this.packer[packMethod](item.rect);
			} else {
				this.packer.pack(item.rect);
			}
			this._setMaxXY(item.rect);
			return item.rect;
		};
		proto.shiftLayout = function () {
			this.isShifting = true;
			this.layout();
			delete this.isShifting;
		};
		proto._getPackMethod = function () {
			return this._getOption('horizontal') ? 'rowPack' : 'columnPack';
		};
		proto._setMaxXY = function (rect) {
			this.maxX = Math.max(rect.x + rect.width, this.maxX);
			this.maxY = Math.max(rect.y + rect.height, this.maxY);
		};
		proto._setRectSize = function (elem, rect) {
			var size = getSize(elem);
			var w = size.outerWidth;
			var h = size.outerHeight;
			if (w || h) {
				w = this._applyGridGutter(w, this.columnWidth);
				h = this._applyGridGutter(h, this.rowHeight);
			}
			rect.width = Math.min(w, this.packer.width);
			rect.height = Math.min(h, this.packer.height);
		};
		proto._applyGridGutter = function (measurement, gridSize) {
			if (!gridSize) {
				return measurement + this.gutter;
			}
			gridSize += this.gutter;
			var remainder = measurement % gridSize;
			var mathMethod = remainder && remainder < 1 ? 'round' : 'ceil';
			measurement = Math[mathMethod](measurement / gridSize) * gridSize;
			return measurement;
		};
		proto._getContainerSize = function () {
			if (this._getOption('horizontal')) {
				return {
					width: this.maxX - this.gutter
				};
			} else {
				return {
					height: this.maxY - this.gutter
				};
			}
		};
		proto._manageStamp = function (elem) {
			var item = this.getItem(elem);
			var rect;
			if (item && item.isPlacing) {
				rect = item.rect;
			} else {
				var offset = this._getElementOffset(elem);
				rect = new Rect({
						x: this._getOption('originLeft') ? offset.left : offset.right,
						y: this._getOption('originTop') ? offset.top : offset.bottom
					});
			}
			this._setRectSize(elem, rect);
			this.packer.placed(rect);
			this._setMaxXY(rect);
		};
		function verticalSorter(a, b) {
			return a.position.y - b.position.y || a.position.x - b.position.x;
		}
		function horizontalSorter(a, b) {
			return a.position.x - b.position.x || a.position.y - b.position.y;
		}
		proto.sortItemsByPosition = function () {
			var sorter = this._getOption('horizontal') ? horizontalSorter : verticalSorter;
			this.items.sort(sorter);
		};
		proto.fit = function (elem, x, y) {
			var item = this.getItem(elem);
			if (!item) {
				return;
			}
			this.stamp(item.element);
			item.enablePlacing();
			this.updateShiftTargets(item);
			x = x === undefined ? item.rect.x : x;
			y = y === undefined ? item.rect.y : y;
			this.shift(item, x, y);
			this._bindFitEvents(item);
			item.moveTo(item.rect.x, item.rect.y);
			this.shiftLayout();
			this.unstamp(item.element);
			this.sortItemsByPosition();
			item.disablePlacing();
		};
		proto._bindFitEvents = function (item) {
			var _this = this;
			var ticks = 0;
			function onLayout() {
				ticks++;
				if (ticks != 2) {
					return;
				}
				_this.dispatchEvent('fitComplete', null, [item]);
			}
			item.once('layout', onLayout);
			this.once('layoutComplete', onLayout);
		};
		proto.resize = function () {
			if (!this.isResizeBound || !this.needsResizeLayout()) {
				return;
			}
			if (this.options.shiftPercentResize) {
				this.resizeShiftPercentLayout();
			} else {
				this.layout();
			}
		};
		proto.needsResizeLayout = function () {
			var size = getSize(this.element);
			var innerSize = this._getOption('horizontal') ? 'innerHeight' : 'innerWidth';
			return size[innerSize] != this.size[innerSize];
		};
		proto.resizeShiftPercentLayout = function () {
			var items = this._getItemsForLayout(this.items);
			var isHorizontal = this._getOption('horizontal');
			var coord = isHorizontal ? 'y' : 'x';
			var measure = isHorizontal ? 'height' : 'width';
			var segmentName = isHorizontal ? 'rowHeight' : 'columnWidth';
			var innerSize = isHorizontal ? 'innerHeight' : 'innerWidth';
			var previousSegment = this[segmentName];
			previousSegment = previousSegment && previousSegment + this.gutter;
			if (previousSegment) {
				this._getMeasurements();
				var currentSegment = this[segmentName] + this.gutter;
				items.forEach(function (item) {
					var seg = Math.round(item.rect[coord] / previousSegment);
					item.rect[coord] = seg * currentSegment;
				});
			} else {
				var currentSize = getSize(this.element)[innerSize] + this.gutter;
				var previousSize = this.packer[measure];
				items.forEach(function (item) {
					item.rect[coord] = (item.rect[coord] / previousSize) * currentSize;
				});
			}
			this.shiftLayout();
		};
		proto.itemDragStart = function (elem) {
			if (!this.isEnabled) {
				return;
			}
			this.stamp(elem);
			var item = this.getItem(elem);
			if (!item) {
				return;
			}
			item.enablePlacing();
			item.showDropPlaceholder();
			this.dragItemCount++;
			this.updateShiftTargets(item);
		};
		proto.updateShiftTargets = function (dropItem) {
			this.shiftPacker.reset();
			this._getBoundingRect();
			var isOriginLeft = this._getOption('originLeft');
			var isOriginTop = this._getOption('originTop');
			this.stamps.forEach(function (stamp) {
				var item = this.getItem(stamp);
				if (item && item.isPlacing) {
					return;
				}
				var offset = this._getElementOffset(stamp);
				var rect = new Rect({
						x: isOriginLeft ? offset.left : offset.right,
						y: isOriginTop ? offset.top : offset.bottom
					});
				this._setRectSize(stamp, rect);
				this.shiftPacker.placed(rect);
			}, this);
			var isHorizontal = this._getOption('horizontal');
			var segmentName = isHorizontal ? 'rowHeight' : 'columnWidth';
			var measure = isHorizontal ? 'height' : 'width';
			this.shiftTargetKeys = [];
			this.shiftTargets = [];
			var boundsSize;
			var segment = this[segmentName];
			segment = segment && segment + this.gutter;
			if (segment) {
				var segmentSpan = Math.ceil(dropItem.rect[measure] / segment);
				var segs = Math.floor((this.shiftPacker[measure] + this.gutter) / segment);
				boundsSize = (segs - segmentSpan) * segment;
				for (var i = 0; i < segs; i++) {
					var initialX = isHorizontal ? 0 : i * segment;
					var initialY = isHorizontal ? i * segment : 0;
					this._addShiftTarget(initialX, initialY, boundsSize);
				}
			} else {
				boundsSize = (this.shiftPacker[measure] + this.gutter) - dropItem.rect[measure];
				this._addShiftTarget(0, 0, boundsSize);
			}
			var items = this._getItemsForLayout(this.items);
			var packMethod = this._getPackMethod();
			items.forEach(function (item) {
				var rect = item.rect;
				this._setRectSize(item.element, rect);
				this.shiftPacker[packMethod](rect);
				this._addShiftTarget(rect.x, rect.y, boundsSize);
				var cornerX = isHorizontal ? rect.x + rect.width : rect.x;
				var cornerY = isHorizontal ? rect.y : rect.y + rect.height;
				this._addShiftTarget(cornerX, cornerY, boundsSize);
				if (segment) {
					var segSpan = Math.round(rect[measure] / segment);
					for (var i = 1; i < segSpan; i++) {
						var segX = isHorizontal ? cornerX : rect.x + segment * i;
						var segY = isHorizontal ? rect.y + segment * i : cornerY;
						this._addShiftTarget(segX, segY, boundsSize);
					}
				}
			}, this);
		};
		proto._addShiftTarget = function (x, y, boundsSize) {
			var checkCoord = this._getOption('horizontal') ? y : x;
			if (checkCoord !== 0 && checkCoord > boundsSize) {
				return;
			}
			var key = x + ',' + y;
			var hasKey = this.shiftTargetKeys.indexOf(key) !== -1;
			if (hasKey) {
				return;
			}
			this.shiftTargetKeys.push(key);
			this.shiftTargets.push({
				x: x,
				y: y
			});
		};
		proto.shift = function (item, x, y) {
			var shiftPosition;
			var minDistance = Infinity;
			var position = {
				x: x,
				y: y
			};
			this.shiftTargets.forEach(function (target) {
				var distance = getDistance(target, position);
				if (distance < minDistance) {
					shiftPosition = target;
					minDistance = distance;
				}
			});
			item.rect.x = shiftPosition.x;
			item.rect.y = shiftPosition.y;
		};
		function getDistance(a, b) {
			var dx = b.x - a.x;
			var dy = b.y - a.y;
			return Math.sqrt(dx * dx + dy * dy);
		}
		var DRAG_THROTTLE_TIME = 120;
		proto.itemDragMove = function (elem, x, y) {
			var item = this.isEnabled && this.getItem(elem);
			if (!item) {
				return;
			}
			x -= this.size.paddingLeft;
			y -= this.size.paddingTop;
			var _this = this;
			function onDrag() {
				_this.shift(item, x, y);
				item.positionDropPlaceholder();
				_this.layout();
			}
			var now = new Date();
			if (this._itemDragTime && now - this._itemDragTime < DRAG_THROTTLE_TIME) {
				clearTimeout(this.dragTimeout);
				this.dragTimeout = setTimeout(onDrag, DRAG_THROTTLE_TIME);
			} else {
				onDrag();
				this._itemDragTime = now;
			}
		};
		proto.itemDragEnd = function (elem) {
			var item = this.isEnabled && this.getItem(elem);
			if (!item) {
				return;
			}
			clearTimeout(this.dragTimeout);
			item.element.classList.add('is-positioning-post-drag');
			var completeCount = 0;
			var _this = this;
			function onDragEndLayoutComplete() {
				completeCount++;
				if (completeCount != 2) {
					return;
				}
				item.element.classList.remove('is-positioning-post-drag');
				item.hideDropPlaceholder();
				_this.dispatchEvent('dragItemPositioned', null, [item]);
			}
			item.once('layout', onDragEndLayoutComplete);
			this.once('layoutComplete', onDragEndLayoutComplete);
			item.moveTo(item.rect.x, item.rect.y);
			this.layout();
			this.dragItemCount = Math.max(0, this.dragItemCount - 1);
			this.sortItemsByPosition();
			item.disablePlacing();
			this.unstamp(item.element);
		};
		proto.bindDraggabillyEvents = function (draggie) {
			this._bindDraggabillyEvents(draggie, 'on');
		};
		proto.unbindDraggabillyEvents = function (draggie) {
			this._bindDraggabillyEvents(draggie, 'off');
		};
		proto._bindDraggabillyEvents = function (draggie, method) {
			var handlers = this.handleDraggabilly;
			draggie[method]('dragStart', handlers.dragStart);
			draggie[method]('dragMove', handlers.dragMove);
			draggie[method]('dragEnd', handlers.dragEnd);
		};
		proto.bindUIDraggableEvents = function ($elems) {
			this._bindUIDraggableEvents($elems, 'on');
		};
		proto.unbindUIDraggableEvents = function ($elems) {
			this._bindUIDraggableEvents($elems, 'off');
		};
		proto._bindUIDraggableEvents = function ($elems, method) {
			var handlers = this.handleUIDraggable;
			$elems[method]('dragstart', handlers.start)[method]('drag', handlers.drag)[method]('dragstop', handlers.stop);
		};
		var _destroy = proto.destroy;
		proto.destroy = function () {
			_destroy.apply(this, arguments);
			this.isEnabled = false;
		};
		Packery.Rect = Rect;
		Packery.Packer = Packer;
		return Packery;
	}));
