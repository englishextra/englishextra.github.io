/*!
 * Macy.js - v2.3.1
 * @see {@link https://github.com/bigbitecreative/macy.js}
 * passes jshint
 */
(function (global, factory) {
	if (typeof exports === 'object' && typeof module !== 'undefined') {
		module.exports = factory();
	} else if (typeof define === 'function' && define.amd) {
		define(factory);
	} else {
		global.Macy = factory();
	}
}
	(this, (function () {
			'use strict';
			var $e = function $e(parameter, context) {
				if (!(this instanceof $e)) {
					return new $e(parameter, context);
				}
				parameter = parameter.replace(/^\s*/, '').replace(/\s*$/, '');
				if (context) {
					return this.byCss(parameter, context);
				}
				for (var key in this.selectors) {
					if (this.selectors.hasOwnProperty(key)) {
						context = key.split('/');
						if (new RegExp(context[1], context[2]).test(parameter)) {
							return this.selectors[key](parameter);
						}
					}
				}
				return this.byCss(parameter);
			};
			$e.prototype.byCss = function (parameter, context) {
				return (context || document).querySelectorAll(parameter);
			};
			$e.prototype.selectors = {};
			$e.prototype.selectors[/^\.[\w\-]+$/] = function (param) {
				return document.getElementsByClassName(param.substring(1));
			};
			$e.prototype.selectors[/^\w+$/] = function (param) {
				return document.getElementsByTagName(param);
			};
			$e.prototype.selectors[/^\#[\w\-]+$/] = function (param) {
				return document.getElementById(param.substring(1));
			};
			function wait(func, delta) {
				var to = void 0;
				return function () {
					if (to) {
						clearTimeout(to);
					}
					to = setTimeout(func, delta);
				};
			}
			var foreach = function foreach(iterable, callback) {
				var i = iterable.length,
				len = i;
				while (i--) {
					callback(iterable[len - i - 1]);
				}
			};
			function map(iterable, callback) {
				var i = iterable.length,
				len = i;
				var returns = [];
				while (i--) {
					returns.push(callback(iterable[len - i - 1]));
				}
				return returns;
			}
			var Queue = function Queue() {
				var events = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
				this.running = false;
				this.events = [];
				this.add(events);
			};
			Queue.prototype.run = function () {
				if (!this.running && this.events.length > 0) {
					var fn = this.events.shift();
					this.running = true;
					fn();
					this.running = false;
					this.run();
				}
			};
			Queue.prototype.add = function () {
				var _this = this;
				var event = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
				if (!event) {
					return false;
				}
				if (Array.isArray(event)) {
					return foreach(event, function (evt) {
						return _this.add(evt);
					});
				}
				this.events.push(event);
				this.run();
			};
			Queue.prototype.clear = function () {
				this.events = [];
			};
			var Event = function Event(instance) {
				var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
				this.instance = instance;
				this.data = data;
				return this;
			};
			var EventManager = function EventManager() {
				var instance = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
				this.events = {};
				this.instance = instance;
			};
			EventManager.prototype.on = function () {
				var key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
				var func = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
				if (!key || !func) {
					return false;
				}
				if (!Array.isArray(this.events[key])) {
					this.events[key] = [];
				}
				return this.events[key].push(func);
			};
			EventManager.prototype.emit = function () {
				var key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
				var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
				if (!key || !Array.isArray(this.events[key])) {
					return false;
				}
				var evt = new Event(this.instance, data);
				foreach(this.events[key], function (fn) {
					return fn(evt);
				});
			};
			var imageHasLoaded = function imageHasLoaded(img) {
				return !('naturalHeight' in img && img.naturalHeight + img.naturalWidth === 0) || img.width + img.height !== 0;
			};
			var promise = function promise(ctx, image) {
				var emitOnLoad = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
				return new Promise(function (resolve, reject) {
					if (image.complete) {
						if (!imageHasLoaded(image)) {
							return reject(image);
						}
						return resolve(image);
					}
					image.addEventListener('load', function () {
						if (imageHasLoaded(image)) {
							return resolve(image);
						}
						return reject(image);
					});
					image.addEventListener('error', function () {
						return reject(image);
					});
				}).then(function (img) {
					if (emitOnLoad) {
						ctx.emit(ctx.constants.EVENT_IMAGE_LOAD, {
							img: img
						});
					}
				}).catch (function (img) {
					return ctx.emit(ctx.constants.EVENT_IMAGE_ERROR, {
						img: img
					});
				});
			};
			var getImagePromises = function getImagePromises(ctx, images) {
				var emitOnLoad = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
				return map(images, function (image) {
					return promise(ctx, image, emitOnLoad);
				});
			};
			var imageLoaderPromise = function imageLoaderPromise(ctx, images) {
				var emitOnLoad = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
				return Promise.all(getImagePromises(ctx, images, emitOnLoad)).then(function () {
					ctx.emit(ctx.constants.EVENT_IMAGE_COMPLETE);
				});
			};
			function imagesLoadedNew(ctx, imgs) {
				var during = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
				imageLoaderPromise(ctx, imgs, during);
			}
			var createResizeEvent = function createResizeEvent(ctx) {
				return wait(function () {
					ctx.emit(ctx.constants.EVENT_RESIZE);
					ctx.queue.add(function () {
						return ctx.recalculate(true, true);
					});
				}, 100);
			};
			var setupContainer = function setupContainer(ctx) {
				ctx.container = $e(ctx.options.container);
				if (ctx.container instanceof $e || !ctx.container) {
					return ctx.options.debug ? console.error('Error: Container not found') : false;
				}
				delete ctx.options.container;
				if (ctx.container.length) {
					ctx.container = ctx.container[0];
				}
				ctx.container.style.position = 'relative';
			};
			var setupState = function setupState(ctx) {
				ctx.queue = new Queue();
				ctx.events = new EventManager(ctx);
				ctx.rows = [];
				ctx.resizer = createResizeEvent(ctx);
			};
			var setupEventListeners = function setupEventListeners(ctx) {
				var imgs = $e('img', ctx.container);
				window.addEventListener('resize', ctx.resizer);
				ctx.on(ctx.constants.EVENT_IMAGE_LOAD, function () {
					return ctx.recalculate(false, false);
				});
				ctx.on(ctx.constants.EVENT_IMAGE_COMPLETE, function () {
					return ctx.recalculate(true, true);
				});
				if (!ctx.options.useOwnImageLoader) {
					imagesLoadedNew(ctx, imgs, !ctx.options.waitForImages);
				}
				ctx.emit(ctx.constants.EVENT_INITIALIZED);
			};
			var setup = function setup(ctx) {
				setupContainer(ctx);
				setupState(ctx);
				setupEventListeners(ctx);
			};
			var isObject = function isObject(obj) {
				return obj === Object(obj) && Object.prototype.toString.call(obj) !== '[object Array]';
			};
			var replaceOptionsResponsively = function replaceOptionsResponsively(tempOpts, responsiveOptions) {
				if (!isObject(tempOpts)) {
					responsiveOptions.columns = tempOpts;
				}
				if (isObject(tempOpts) && tempOpts.columns) {
					responsiveOptions.columns = tempOpts.columns;
				}
				if (isObject(tempOpts) && tempOpts.margin && !isObject(tempOpts.margin)) {
					responsiveOptions.margin = {
						x: tempOpts.margin,
						y: tempOpts.margin
					};
				}
				if (isObject(tempOpts) && tempOpts.margin && isObject(tempOpts.margin) && tempOpts.margin.x) {
					responsiveOptions.margin.x = tempOpts.margin.x;
				}
				if (isObject(tempOpts) && tempOpts.margin && isObject(tempOpts.margin) && tempOpts.margin.y) {
					responsiveOptions.margin.y = tempOpts.margin.y;
				}
			};
			function getOptionsAsMobileFirst(_ref) {
				var options = _ref.options,
				responsiveOptions = _ref.responsiveOptions,
				keys = _ref.keys,
				docWidth = _ref.docWidth;
				var tempOpts = void 0;
				for (var i = 0; i < keys.length; i++) {
					var widths = parseInt(keys[i], 10);
					if (docWidth >= widths) {
						tempOpts = options.breakAt[widths];
						replaceOptionsResponsively(tempOpts, responsiveOptions);
					}
				}
				return responsiveOptions;
			}
			function getOptionsAsDesktopFirst(_ref2) {
				var options = _ref2.options,
				responsiveOptions = _ref2.responsiveOptions,
				keys = _ref2.keys,
				docWidth = _ref2.docWidth;
				var tempOpts = void 0;
				for (var i = keys.length - 1; i >= 0; i--) {
					var widths = parseInt(keys[i], 10);
					if (docWidth <= widths) {
						tempOpts = options.breakAt[widths];
						replaceOptionsResponsively(tempOpts, responsiveOptions);
					}
				}
				return responsiveOptions;
			}
			function getResponsiveOptions(options) {
				var docWidth = window.innerWidth;
				var responsiveOptions = {
					columns: options.columns
				};
				if (!isObject(options.margin)) {
					responsiveOptions.margin = {
						x: options.margin,
						y: options.margin
					};
				} else {
					responsiveOptions.margin = {
						x: options.margin.x,
						y: options.margin.y
					};
				}
				var keys = Object.keys(options.breakAt);
				if (options.mobileFirst) {
					return getOptionsAsMobileFirst({
						options: options,
						responsiveOptions: responsiveOptions,
						keys: keys,
						docWidth: docWidth
					});
				}
				return getOptionsAsDesktopFirst({
					options: options,
					responsiveOptions: responsiveOptions,
					keys: keys,
					docWidth: docWidth
				});
			}
			function getCurrentColumns(options) {
				var noOfColumns = getResponsiveOptions(options).columns;
				return noOfColumns;
			}
			function getCurrentMargin(options) {
				var margin = getResponsiveOptions(options).margin;
				return margin;
			}
			function getWidths(options) {
				var marginsIncluded = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
				var noOfColumns = getCurrentColumns(options);
				var margins = getCurrentMargin(options).x;
				var width = 100 / noOfColumns;
				if (!marginsIncluded) {
					return width;
				}
				if (noOfColumns === 1) {
					return '100%';
				}
				margins = (noOfColumns - 1) * margins / noOfColumns;
				return 'calc(' + width + '% - ' + margins + 'px)';
			}
			function getLeftPosition(ctx, col) {
				var noOfColumns = getCurrentColumns(ctx.options);
				var totalLeft = 0;
				var margin = void 0,
				str = void 0,
				baseMargin = void 0;
				col++;
				if (col === 1) {
					return 0;
				}
				baseMargin = getCurrentMargin(ctx.options).x;
				margin = (baseMargin - (noOfColumns - 1) * baseMargin / noOfColumns) * (col - 1);
				totalLeft += getWidths(ctx.options, false) * (col - 1);
				str = 'calc(' + totalLeft + '% + ' + margin + 'px)';
				return str;
			}
			function setContainerHeight(ctx) {
				var largest = 0;
				var container = ctx.container,
				rows = ctx.rows;
				foreach(rows, function (row) {
					largest = row > largest ? row : largest;
				});
				container.style.height = largest + 'px';
			}
			var prop = (function (element, property) {
				return window.getComputedStyle(element, null).getPropertyValue(property);
			});
			var setUpRows = function setUpRows(ctx, cols) {
				var refresh = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
				if (!ctx.lastcol) {
					ctx.lastcol = 0;
				}
				if (ctx.rows.length < 1) {
					refresh = true;
				}
				if (refresh) {
					ctx.rows = [];
					ctx.cols = [];
					ctx.lastcol = 0;
					for (var i = cols - 1; i >= 0; i--) {
						ctx.rows[i] = 0;
						ctx.cols[i] = getLeftPosition(ctx, i);
					}
					return;
				}
				if (ctx.tmpRows) {
					ctx.rows = [];
					for (var j = cols - 1; j >= 0; j--) {
						ctx.rows[j] = ctx.tmpRows[j];
					}
					return;
				}
				ctx.tmpRows = [];
				for (var k = cols - 1; k >= 0; k--) {
					ctx.tmpRows[k] = ctx.rows[k];
				}
			};
			function shuffle(ctx, $eles) {
				var refresh = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
				var markasComplete = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
				var cols = getCurrentColumns(ctx.options);
				var margin = getCurrentMargin(ctx.options).y;
				setUpRows(ctx, cols, refresh);
				foreach($eles, function (ele) {
					var smallest = 0;
					var eleHeight = parseInt(ele.offsetHeight, 10);
					if (isNaN(eleHeight))
						return;
					ctx.rows.forEach(function (v, k) {
						if (v < ctx.rows[smallest]) {
							smallest = k;
						}
					});
					ele.style.position = 'absolute';
					ele.style.top = ctx.rows[smallest] + 'px';
					ele.style.left = '' + ctx.cols[smallest];
					ctx.rows[smallest] += !isNaN(eleHeight) ? eleHeight + margin : 0;
					if (markasComplete) {
						ele.dataset.macyComplete = 1;
					}
				});
				if (markasComplete) {
					ctx.tmpRows = null;
				}
				setContainerHeight(ctx);
			}
			function sort(ctx, $eles) {
				var refresh = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
				var markasComplete = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
				var cols = getCurrentColumns(ctx.options);
				var margin = getCurrentMargin(ctx.options).y;
				setUpRows(ctx, cols, refresh);
				foreach($eles, function (ele) {
					if (ctx.lastcol === cols) {
						ctx.lastcol = 0;
					}
					var eleHeight = prop(ele, 'height');
					eleHeight = parseInt(ele.offsetHeight, 10);
					if (isNaN(eleHeight))
						return;
					ele.style.position = 'absolute';
					ele.style.top = ctx.rows[ctx.lastcol] + 'px';
					ele.style.left = '' + ctx.cols[ctx.lastcol];
					ctx.rows[ctx.lastcol] += !isNaN(eleHeight) ? eleHeight + margin : 0;
					ctx.lastcol += 1;
					if (markasComplete) {
						ele.dataset.macyComplete = 1;
					}
				});
				if (markasComplete) {
					ctx.tmpRows = null;
				}
				setContainerHeight(ctx);
			}
			var calculate = function calculate(ctx) {
				var refresh = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
				var loaded = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
				var children = refresh ? ctx.container.children : $e(':scope > *:not([data-macy-complete="1"])', ctx.container);
				var eleWidth = getWidths(ctx.options);
				foreach(children, function (child) {
					if (refresh) {
						child.dataset.macyComplete = 0;
					}
					child.style.width = eleWidth;
				});
				if (ctx.options.trueOrder) {
					sort(ctx, children, refresh, loaded);
					return ctx.emit(ctx.constants.EVENT_RECALCULATED);
				}
				shuffle(ctx, children, refresh, loaded);
				return ctx.emit(ctx.constants.EVENT_RECALCULATED);
			};
			var init$1 = function init() {
				try {
					document.createElement('a').querySelector(':scope *');
				} catch (error) {
					(function () {
						var scope = /:scope\b/gi;
						var querySelectorWithScope = polyfill(Element.prototype.querySelector);
						Element.prototype.querySelector = function querySelector(selectors) {
							return querySelectorWithScope.apply(this, arguments);
						};
						var querySelectorAllWithScope = polyfill(Element.prototype.querySelectorAll);
						Element.prototype.querySelectorAll = function querySelectorAll(selectors) {
							return querySelectorAllWithScope.apply(this, arguments);
						};
						function polyfill(originalQuerySelector) {
							return function (selectors) {
								var hasScope = selectors && scope.test(selectors);
								if (hasScope) {
									var id = this.getAttribute('id');
									if (!id) {
										this.id = 'q' + Math.floor(Math.random() * 9000000) + 1000000;
									}
									arguments[0] = selectors.replace(scope, '#' + this.id);
									var elementOrNodeList = originalQuerySelector.apply(this, arguments);
									if (id === null) {
										this.removeAttribute('id');
									} else if (!id) {
										this.id = id;
									}
									return elementOrNodeList;
								} else {
									return originalQuerySelector.apply(this, arguments);
								}
							};
						}
					})();
				}
			};
			var _extends = Object.assign || function (target) {
				for (var i = 1; i < arguments.length; i++) {
					var source = arguments[i];
					for (var key in source) {
						if (Object.prototype.hasOwnProperty.call(source, key)) {
							target[key] = source[key];
						}
					}
				}
				return target;
			};
			var defaults = {
				columns: 4,
				margin: 2,
				trueOrder: false,
				waitForImages: false,
				useImageLoader: true,
				breakAt: {},
				useOwnImageLoader: false,
				onInit: false
			};
			init$1();
			var Macy = function Macy() {
				var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaults;
				if (!(this instanceof Macy)) {
					return new Macy(opts);
				}
				this.options = {};
				_extends(this.options, defaults, opts);
				setup(this);
			};
			Macy.init = function (options) {
				console.warn('Depreciated: Macy.init will be removed in v3.0.0 opt to use Macy directly like so Macy({ /*options here*/ }) ');
				return new Macy(options);
			};
			Macy.prototype.recalculateOnImageLoad = function () {
				var waitUntilFinish = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
				var imgs = $e('img', this.container);
				return imagesLoadedNew(this, imgs, !waitUntilFinish);
			};
			Macy.prototype.runOnImageLoad = function (func) {
				var everyLoad = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
				var imgs = $e('img', this.container);
				this.on(this.constants.EVENT_IMAGE_COMPLETE, func);
				if (everyLoad) {
					this.on(this.constants.EVENT_IMAGE_LOAD, func);
				}
				return imagesLoadedNew(this, imgs, everyLoad);
			};
			Macy.prototype.recalculate = function () {
				var _this = this;
				var refresh = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
				var loaded = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
				if (loaded) {
					this.queue.clear();
				}
				return this.queue.add(function () {
					return calculate(_this, refresh, loaded);
				});
			};
			Macy.prototype.remove = function () {
				window.removeEventListener('resize', this.resizer);
				foreach(this.container.children, function (child) {
					child.removeAttribute('data-macy-complete');
					child.removeAttribute('style');
				});
				this.container.removeAttribute('style');
			};
			Macy.prototype.reInit = function () {
				this.recalculate(true, true);
				this.emit(this.constants.EVENT_INITIALIZED);
				window.addEventListener('resize', this.resizer);
				this.container.style.position = 'relative';
			};
			Macy.prototype.on = function (key, func) {
				this.events.on(key, func);
			};
			Macy.prototype.emit = function (key, data) {
				this.events.emit(key, data);
			};
			Macy.constants = {
				EVENT_INITIALIZED: 'macy.initialized',
				EVENT_RECALCULATED: 'macy.recalculated',
				EVENT_IMAGE_LOAD: 'macy.image.load',
				EVENT_IMAGE_ERROR: 'macy.image.error',
				EVENT_IMAGE_COMPLETE: 'macy.images.complete',
				EVENT_RESIZE: 'macy.resize'
			};
			Macy.prototype.constants = Macy.constants;
			return Macy;
		})));
