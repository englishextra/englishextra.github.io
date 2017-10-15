/*jslint browser: true */
/*jslint node: true */
/*global doesFontExist, echo, Headers, loadJsCss, platform, Promise, t,
zoomwall */
/*property console, split */
/*!
 * safe way to handle console.log
 * @see {@link https://github.com/paulmillr/console-polyfill}
 */
(function (root) {
	"use strict";

	if (!root.console) {
		root.console = {};
	}
	var con = root.console;
	var prop;
	var method;
	var dummy = function () {};
	var properties = ["memory"];
	var methods = ("assert,clear,count,debug,dir,dirxml,error,exception,group," + "groupCollapsed,groupEnd,info,log,markTimeline,profile,profiles,profileEnd," + "show,table,time,timeEnd,timeline,timelineEnd,timeStamp,trace,warn").split(",");
	for (; prop = properties.pop();) {
		if (!con[prop]) {
			con[prop] = {};
		}
	}
	for (; method = methods.pop();) {
		if (!con[method]) {
			con[method] = dummy;
		}
	}
	prop = method = dummy = properties = methods = null;
})("undefined" !== typeof window ? window : this);
/*!
 * modified ToProgress v0.1.1
 * @see {@link http://github.com/djyde/ToProgress}
 * @see {@link https://github.com/djyde/ToProgress/blob/master/ToProgress.js}
 * passes jshint
 */
(function (root, document, undefined) {
	"use strict";

	var ToProgress = function () {
		var TP = function () {
			var style = "style";
			var createElement = "createElement";
			var appendChild = "appendChild";
			var prototype = "prototype";
			var hasOwnProperty = "hasOwnProperty";
			var getElementById = "getElementById";
			var getElementsByClassName = "getElementsByClassName";
			var firstChild = "firstChild";
			var addEventListener = "addEventListener";
			var removeEventListener = "removeEventListener";
			var opacity = "opacity";
			function whichTransitionEvent() {
				var t,
				    el = document[createElement]("fakeelement");
				var transitions = {
					"transition": "transitionend",
					"OTransition": "oTransitionEnd",
					"MozTransition": "transitionend",
					"WebkitTransition": "webkitTransitionEnd"
				};
				for (t in transitions) {
					if (transitions[hasOwnProperty](t)) {
						if (el[style][t] !== undefined) {
							return transitions[t];
						}
					}
				}
			}
			var transitionEvent = whichTransitionEvent();
			function ToProgress(opt, selector) {
				this.progress = 0;
				this.options = {
					id: "top-progress-bar",
					color: "#F44336",
					height: "2px",
					duration: 0.2
				};
				if (opt && typeof opt === "object") {
					for (var key in opt) {
						if (opt[hasOwnProperty](key)) {
							this.options[key] = opt[key];
						}
					}
				}
				this.options.opacityDuration = this.options.duration * 3;
				this.progressBar = document[createElement]("div");
				this.progressBar.id = this.options.id;
				this.progressBar.setCSS = function (style) {
					for (var property in style) {
						if (style[hasOwnProperty](property)) {
							this.style[property] = style[property];
						}
					}
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
					"-webkit-transition": "width " + this.options.duration + "s" + ", opacity " + this.options.opacityDuration + "s"
				});
				if (selector) {
					var el;
					if (selector.indexOf("#", 0) !== -1) {
						el = document[getElementById](selector) || "";
					} else {
						if (selector.indexOf(".", 0) !== -1) {
							el = document[getElementsByClassName](selector)[0] || "";
						}
					}
					if (el) {
						if (el.hasChildNodes()) {
							el.insertBefore(this.progressBar, el[firstChild]);
						} else {
							el[appendChild](this.progressBar);
						}
					}
				} else {
					document.body[appendChild](this.progressBar);
				}
			}
			ToProgress[prototype].transit = function () {
				this.progressBar[style].width = this.progress + "%";
			};
			ToProgress[prototype].getProgress = function () {
				return this.progress;
			};
			ToProgress[prototype].setProgress = function (progress, callback) {
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
			ToProgress[prototype].increase = function (toBeIncreasedProgress, callback) {
				this.show();
				this.setProgress(this.progress + toBeIncreasedProgress, callback);
			};
			ToProgress[prototype].decrease = function (toBeDecreasedProgress, callback) {
				this.show();
				this.setProgress(this.progress - toBeDecreasedProgress, callback);
			};
			ToProgress[prototype].finish = function (callback) {
				var that = this;
				this.setProgress(100, callback);
				this.hide();
				if (transitionEvent) {
					this.progressBar[addEventListener](transitionEvent, function (e) {
						that.reset();
						that.progressBar[removeEventListener](e.type, TP);
					});
				}
			};
			ToProgress[prototype].reset = function (callback) {
				this.progress = 0;
				this.transit();
				if (callback) {
					callback();
				}
			};
			ToProgress[prototype].hide = function () {
				this.progressBar[style][opacity] = "0";
			};
			ToProgress[prototype].show = function () {
				this.progressBar[style][opacity] = "1";
			};
			return ToProgress;
		};
		return TP();
	}();
	root.ToProgress = ToProgress;
})("undefined" !== typeof window ? window : this, document);
/*!
 * modified zoomwall.js v1.1.1
 * The MIT License (MIT)
 * Copyright (c) 2014 Eric Leong
 * added option to specify data attributes for high and low resolution
 * @see {@link https://github.com/ericleong/zoomwall.js}
 * @see {@link https://github.com/ericleong/zoomwall.js/blob/master/zoomwall.js}
 * passes jshint
 */
(function (root, document) {
	"use strict";

	var parentNode = "parentNode";
	var addEventListener = "addEventListener";
	var classList = "classList";
	var getElementsByClassName = "getElementsByClassName";
	var children = "children";
	var getComputedStyle = "getComputedStyle";
	var offsetTop = "offsetTop";
	var dataset = "dataset";
	var nextElementSibling = "nextElementSibling";
	var previousElementSibling = "previousElementSibling";
	var length = "length";
	var hasOwnProperty = "hasOwnProperty";
	var style = "style";
	var zoomwall = {
		create: function (blocks, enableKeys, dataAttributeHighresName, dataAttributeLowresName, done) {
			var _this = this;
			_this.dataAttributeHighresName = dataAttributeHighresName || "highres";
			_this.dataAttributeLowresName = dataAttributeLowresName || "lowres";
			zoomwall.resize(blocks[children]);
			blocks[classList].remove("loading");
			blocks[addEventListener]("click", function () {
				if (_this[children] && _this[children][length] > 0) {
					zoomwall.shrink(_this[children][0]);
				}
			});
			for (var i = 0; i < blocks[children][length]; i++) {
				blocks[children][i][addEventListener]("click", zoomwall.animate);
			}
			if (enableKeys) {
				zoomwall.keys(blocks);
			}
			if (typeof done === "function") {
				done(blocks);
			}
		},
		keys: function (blocks) {
			var keyPager = function (e) {
				if (e.defaultPrevented) {
					return;
				}
				var elem = blocks || document[getElementsByClassName]("zoomwall lightbox")[0];
				if (elem) {
					switch (e.keyCode) {
						case 27:
							if (elem[children] && elem[children][length] > 0) {
								zoomwall.shrink(elem[children][0]);
							}
							e.preventDefault();
							break;
						case 37:
							zoomwall.page(elem, false);
							e.preventDefault();
							break;
						case 39:
							zoomwall.page(elem, true);
							e.preventDefault();
							break;
					}
				}
			};
			document[addEventListener]("keydown", keyPager);
			return keyPager;
		},
		resizeRow: function (row, width) {
			if (row && row[length] > 1) {
				for (var i in row) {
					if (row[hasOwnProperty](i)) {
						row[i][style].width = parseInt(root[getComputedStyle](row[i]).width, 10) / width * 100 + "%";
						row[i][style].height = "auto";
					}
				}
			}
		},
		calcRowWidth: function (row) {
			var width = 0;
			for (var i in row) {
				if (row[hasOwnProperty](i)) {
					width += parseInt(root[getComputedStyle](row[i]).width, 10);
				}
			}
			return width;
		},
		resize: function (blocks) {
			var row = [];
			var top = -1;
			for (var c = 0; c < blocks[length]; c++) {
				var block = blocks[c];
				if (block) {
					if (top == -1) {
						top = block[offsetTop];
					} else if (block[offsetTop] != top) {
						zoomwall.resizeRow(row, zoomwall.calcRowWidth(row));
						row = [];
						top = block[offsetTop];
					}
					row.push(block);
				}
			}
			zoomwall.resizeRow(row, zoomwall.calcRowWidth(row));
		},
		reset: function (block) {
			block[style].transform = "translate(0, 0) scale(1)";
			block[style].webkitTransform = "translate(0, 0) scale(1)";
			block[classList].remove("active");
		},
		shrink: function (block) {
			block[parentNode][classList].remove("lightbox");
			zoomwall.reset(block);
			var prev = block[previousElementSibling];
			while (prev) {
				zoomwall.reset(prev);
				prev = prev[previousElementSibling];
			}
			var next = block[nextElementSibling];
			while (next) {
				zoomwall.reset(next);
				next = next[nextElementSibling];
			}
			if (block[dataset].lowres) {
				block.src = block[dataset].lowres;
			}
		},
		expand: function (block) {
			var _this = this;
			block[classList].add("active");
			block[parentNode][classList].add("lightbox");
			var parentStyle = root[getComputedStyle](block[parentNode]);
			var parentWidth = parseInt(parentStyle.width, 10);
			var parentHeight = parseInt(parentStyle.height, 10);
			var parentTop = block[parentNode].getBoundingClientRect().top;
			var blockStyle = root[getComputedStyle](block);
			var blockWidth = parseInt(blockStyle.width, 10);
			var blockHeight = parseInt(blockStyle.height, 10);
			var targetHeight = root.innerHeight;
			if (parentHeight < root.innerHeight) {
				targetHeight = parentHeight;
			} else if (parentTop > 0) {
				targetHeight -= parentTop;
			}
			if (block[dataset][_this.dataAttributeHighresName]) {
				if (block.src != block[dataset][_this.dataAttributeHighresName] && block[dataset][_this.dataAttributeLowresName] === undefined) {
					block[dataset][_this.dataAttributeLowresName] = block.src;
				}
				block.src = block[dataset][_this.dataAttributeHighresName];
			}
			var row = [];
			row.push(block);
			var next = block[nextElementSibling];
			while (next && next[offsetTop] == block[offsetTop]) {
				row.push(next);
				next = next[nextElementSibling];
			}
			var prev = block[previousElementSibling];
			while (prev && prev[offsetTop] == block[offsetTop]) {
				row.unshift(prev);
				prev = prev[previousElementSibling];
			}
			var scale = targetHeight / blockHeight;
			if (blockWidth * scale > parentWidth) {
				scale = parentWidth / blockWidth;
			}
			var offsetY = parentTop - block[parentNode][offsetTop] + block[offsetTop];
			if (parentHeight < root.innerHeight || blockHeight * scale < parentHeight) {
				offsetY -= targetHeight / 2 - blockHeight * scale / 2;
			}
			if (parentTop > 0) {
				offsetY -= parentTop;
			}
			var leftOffsetX = 0;
			for (var i = 0; i < row[length] && row[i] != block; i++) {
				leftOffsetX += parseInt(root[getComputedStyle](row[i]).width, 10) * scale;
			}
			leftOffsetX = parentWidth / 2 - blockWidth * scale / 2 - leftOffsetX;
			var rightOffsetX = 0;
			for (var j = row[length] - 1; j >= 0 && row[j] != block; j--) {
				rightOffsetX += parseInt(root[getComputedStyle](row[j]).width, 10) * scale;
			}
			rightOffsetX = parentWidth / 2 - blockWidth * scale / 2 - rightOffsetX;
			var itemOffset = 0;
			var prevWidth = 0;
			for (var k = 0; k < row[length]; k++) {
				itemOffset += prevWidth * scale - prevWidth;
				prevWidth = parseInt(root[getComputedStyle](row[k]).width, 10);
				var percentageOffsetX = (itemOffset + leftOffsetX) / prevWidth * 100;
				var percentageOffsetY = -offsetY / parseInt(root[getComputedStyle](row[k]).height, 10) * 100;
				row[k][style].transformOrigin = "0% 0%";
				row[k][style].webkitTransformOrigin = "0% 0%";
				row[k][style].transform = "translate(" + percentageOffsetX.toFixed(8) + "%, " + percentageOffsetY.toFixed(8) + "%) scale(" + scale.toFixed(8) + ")";
				row[k][style].webkitTransform = "translate(" + percentageOffsetX.toFixed(8) + "%, " + percentageOffsetY.toFixed(8) + "%) scale(" + scale.toFixed(8) + ")";
			}
			var nextOffsetY = blockHeight * (scale - 1) - offsetY;
			var prevHeight;
			itemOffset = 0;
			prevWidth = 0;
			var next2 = row[row[length] - 1][nextElementSibling];
			var nextRowTop = -1;
			while (next2) {
				var curTop = next2[offsetTop];
				if (curTop == nextRowTop) {
					itemOffset += prevWidth * scale - prevWidth;
				} else {
					if (nextRowTop != -1) {
						itemOffset = 0;
						nextOffsetY += prevHeight * (scale - 1);
					}
					nextRowTop = curTop;
				}
				prevWidth = parseInt(root[getComputedStyle](next2).width, 10);
				prevHeight = parseInt(root[getComputedStyle](next2).height, 10);
				var percentageOffsetX2 = (itemOffset + leftOffsetX) / prevWidth * 100;
				var percentageOffsetY2 = nextOffsetY / prevHeight * 100;
				next2[style].transformOrigin = "0% 0%";
				next2[style].webkitTransformOrigin = "0% 0%";
				next2[style].transform = "translate(" + percentageOffsetX2.toFixed(8) + "%, " + percentageOffsetY2.toFixed(8) + "%) scale(" + scale.toFixed(8) + ")";
				next2[style].webkitTransform = "translate(" + percentageOffsetX2.toFixed(8) + "%, " + percentageOffsetY2.toFixed(8) + "%) scale(" + scale.toFixed(8) + ")";
				next2 = next2[nextElementSibling];
			}
			var prevOffsetY = -offsetY;
			itemOffset = 0;
			prevWidth = 0;
			var prev2 = row[0][previousElementSibling];
			var prevRowTop = -1;
			while (prev2) {
				var curTop2 = prev2[offsetTop];
				if (curTop2 == prevRowTop) {
					itemOffset -= prevWidth * scale - prevWidth;
				} else {
					itemOffset = 0;
					prevOffsetY -= parseInt(root[getComputedStyle](prev2).height, 10) * (scale - 1);
					prevRowTop = curTop2;
				}
				prevWidth = parseInt(root[getComputedStyle](prev2).width, 10);
				var percentageOffsetX3 = (itemOffset - rightOffsetX) / prevWidth * 100;
				var percentageOffsetY3 = prevOffsetY / parseInt(root[getComputedStyle](prev2).height, 10) * 100;
				prev2[style].transformOrigin = "100% 0%";
				prev2[style].webkitTransformOrigin = "100% 0%";
				prev2[style].transform = "translate(" + percentageOffsetX3.toFixed(8) + "%, " + percentageOffsetY3.toFixed(8) + "%) scale(" + scale.toFixed(8) + ")";
				prev2[style].webkitTransform = "translate(" + percentageOffsetX3.toFixed(8) + "%, " + percentageOffsetY3.toFixed(8) + "%) scale(" + scale.toFixed(8) + ")";
				prev2 = prev2[previousElementSibling];
			}
		},
		animate: function (e) {
			var _this = this;
			if (_this[classList].contains("active")) {
				zoomwall.shrink(_this);
			} else {
				var actives = _this[parentNode][getElementsByClassName]("active");
				for (var i = 0; i < actives[length]; i++) {
					actives[i][classList].remove("active");
				}
				zoomwall.expand(_this);
			}
			e.stopPropagation();
		},
		page: function (blocks, isNext) {
			var actives = blocks[getElementsByClassName]("active");
			if (actives && actives[length] > 0) {
				var current = actives[0];
				var next;
				if (isNext) {
					next = current[nextElementSibling];
				} else {
					next = current[previousElementSibling];
				}
				if (next) {
					current[classList].remove("active");
					if (current[dataset].lowres) {
						current.src = current[dataset].lowres;
					}
					zoomwall.expand(next);
				}
			}
		}
	};
	root.zoomwall = zoomwall;
})("undefined" !== typeof window ? window : this, document);
/*!
 * modified t.js
 * a micro-templating framework in ~400 bytes gzipped
 * @author Jason Mooberry <jasonmoo@me.com>
 * @license MIT
 * @version 0.1.0
 * Simple interpolation: {{=value}}
 * Scrubbed interpolation: {{%unsafe_value}}
 * Name-spaced variables: {{=User.address.city}}
 * If/else blocks: {{value}} <<markup>> {{:value}} <<alternate markup>> {{/value}}
 * If not blocks: {{!value}} <<markup>> {{/!value}}
 * Object/Array iteration: {{@object_value}} {{=_key}}:{{=_val}} {{/@object_value}}
 * Multi-line templates (no removal of newlines required to render)
 * Render the same template multiple times with different data
 * Works in all modern browsers
 * @see {@link https://github.com/loele/t.js/blob/2b3ab7039353cc365fb3463f6df08fd00eb3eb3d/t.js}
 * passes jshint
 */
(function (root) {
	"use strict";

	var blockregex = /\{\{(([@!]?)(.+?))\}\}(([\s\S]+?)(\{\{:\1\}\}([\s\S]+?))?)\{\{\/\1\}\}/g,
	    valregex = /\{\{([=%])(.+?)\}\}/g;
	var t = function (template) {
		this.t = template;
	};
	function scrub(val) {
		return new Option(val).text.replace(/"/g, "&quot;");
	}
	function get_value(vars, key) {
		var parts = key.split(".");
		while (parts.length) {
			if (!(parts[0] in vars)) {
				return false;
			}
			vars = vars[parts.shift()];
		}
		return vars;
	}
	function render(fragment, vars) {
		return fragment.replace(blockregex, function (_, __, meta, key, inner, if_true, has_else, if_false) {
			var val = get_value(vars, key),
			    temp = "",
			    i;
			if (!val) {
				if (meta === "!") {
					return render(inner, vars);
				}
				if (has_else) {
					return render(if_false, vars);
				}
				return "";
			}
			if (!meta) {
				return render(if_true, vars);
			}
			if (meta === "@") {
				_ = vars._key;
				__ = vars._val;
				for (i in val) {
					if (val.hasOwnProperty(i)) {
						vars._key = i;
						vars._val = val[i];
						temp += render(inner, vars);
					}
				}
				vars._key = _;
				vars._val = __;
				return temp;
			}
		}).replace(valregex, function (_, meta, key) {
			var val = get_value(vars, key);
			if (val || val === 0) {
				return meta === "%" ? scrub(val) : val;
			}
			return "";
		});
	}
	t.prototype.render = function (vars) {
		return render(this.t, vars);
	};
	root.t = t;
})("undefined" !== typeof window ? window : this);
/*!
 * modified Echo.js, simple JavaScript image lazy loading
 * added option to specify data attribute and img class
 * @see {@link https://toddmotto.com/echo-js-simple-javascript-image-lazy-loading/}
 * @see {@link https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md#feature-detection}
 * forced passive event listener if supported
 * passes jshint
 */
(function (root, document) {
	"use strict";

	var echo = function (imgClass, dataAttributeName, throttleRate) {
		imgClass = imgClass || "data-src-img";
		dataAttributeName = dataAttributeName || "src";
		throttleRate = throttleRate || 100;
		var addEventListener = "addEventListener";
		var dataset = "dataset";
		var getElementsByClassName = "getElementsByClassName";
		var getBoundingClientRect = "getBoundingClientRect";
		var classList = "classList";
		var getAttribute = "getAttribute";
		var length = "length";
		var documentElement = "documentElement";
		var defineProperty = "defineProperty";
		var Echo = function (elem) {
			var _this = this;
			_this.elem = elem;
			_this.render();
			_this.listen();
		};
		var isBindedEchoClass = "is-binded-echo";
		var isBindedEcho = function () {
			return document[documentElement][classList].contains(isBindedEchoClass) || "";
		}();
		var echoStore = [];
		var scrolledIntoView = function (element) {
			var coords = element[getBoundingClientRect]();
			return (coords.top >= 0 && coords.left >= 0 && coords.top) <= (root.innerHeight || document[documentElement].clientHeight);
		};
		var echoSrc = function (img, callback) {
			img.src = img[dataset][dataAttributeName] || img[getAttribute]("data-" + dataAttributeName);
			if (callback) {
				callback();
			}
		};
		var removeEcho = function (element, index) {
			if (echoStore.indexOf(element) !== -1) {
				echoStore.splice(index, 1);
			}
		};
		var echoImageAll = function () {
			for (var i = 0; i < echoStore.length; i++) {
				var self = echoStore[i];
				if (scrolledIntoView(self)) {
					echoSrc(self, removeEcho(self, i));
				}
			}
		};
		var throttle = function (func, wait) {
			var ctx, args, rtn, timeoutID;
			var last = 0;
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
			function call() {
				timeoutID = 0;
				last = +new Date();
				rtn = func.apply(ctx, args);
				ctx = null;
				args = null;
			}
		};
		var throttleEchoImageAll = throttle(echoImageAll, throttleRate);
		var supportsPassive = function () {
			var support = false;
			try {
				var opts = Object[defineProperty] && Object[defineProperty]({}, "passive", {
					get: function () {
						support = true;
					}
				});
				root[addEventListener]("test", function () {}, opts);
			} catch (err) {}
			return support;
		}();
		Echo.prototype = {
			init: function () {
				echoStore.push(this.elem);
			},
			render: function () {
				echoImageAll();
			},
			listen: function () {
				if (!isBindedEcho) {
					root[addEventListener]("scroll", throttleEchoImageAll, supportsPassive ? { passive: true } : false);
					document[documentElement][classList].add(isBindedEchoClass);
				}
			}
		};
		var lazyImgs = document[getElementsByClassName](imgClass) || "";
		var walkLazyImageAll = function () {
			for (var i = 0; i < lazyImgs[length]; i++) {
				new Echo(lazyImgs[i]).init();
			}
		};
		if (lazyImgs) {
			walkLazyImageAll();
		}
	};
	root.echo = echo;
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

	var doesFontExist = function (fontName) {
		var canvas = document.createElement("canvas");
		var context = canvas.getContext("2d");
		var text = "abcdefghijklmnopqrstuvwxyz0123456789";
		context.font = "72px monospace";
		var baselineSize = context.measureText(text).width;
		context.font = "72px '" + fontName + "', monospace";
		var newSize = context.measureText(text).width;
		canvas = null;
		if (newSize == baselineSize) {
			return false;
		} else {
			return true;
		}
	};
	root.doesFontExist = doesFontExist;
})("undefined" !== typeof window ? window : this, document);
/*!
 * modified loadExt
 * @see {@link https://gist.github.com/englishextra/ff9dc7ab002312568742861cb80865c9}
 * passes jshint
 */
(function (root, document) {
	"use strict";

	var loadJsCss = function (files, callback) {
		var _this = this;
		var getElementsByTagName = "getElementsByTagName";
		var createElement = "createElement";
		var appendChild = "appendChild";
		var body = "body";
		var parentNode = "parentNode";
		var insertBefore = "insertBefore";
		var length = "length";
		_this.files = files;
		_this.js = [];
		_this.head = document[getElementsByTagName]("head")[0] || "";
		_this.body = document[body] || "";
		_this.ref = document[getElementsByTagName]("script")[0] || "";
		_this.callback = callback || function () {};
		_this.loadStyle = function (file) {
			var link = document[createElement]("link");
			link.rel = "stylesheet";
			link.type = "text/css";
			link.href = file;
			_this.head[appendChild](link);
		};
		_this.loadScript = function (i) {
			var script = document[createElement]("script");
			script.type = "text/javascript";
			script.async = true;
			script.src = _this.js[i];
			var loadNextScript = function () {
				if (++i < _this.js[length]) {
					_this.loadScript(i);
				} else {
					_this.callback();
				}
			};
			script.onload = function () {
				loadNextScript();
			};
			_this.head[appendChild](script);
			if (_this.ref[parentNode]) {
				_this.ref[parentNode][insertBefore](script, _this.ref);
			} else {
				(_this.body || _this.head)[appendChild](script);
			}
		};
		var i, l;
		for (i = 0, l = _this.files[length]; i < l; i += 1) {
			if (/\.js$|\.js\?/.test(_this.files[i])) {
				_this.js.push(_this.files[i]);
			}
			if (/\.css$|\.css\?|\/css\?/.test(_this.files[i])) {
				_this.loadStyle(_this.files[i]);
			}
		}
		i = l = null;
		if (_this.js[length] > 0) {
			_this.loadScript(0);
		} else {
			_this.callback();
		}
	};
	root.loadJsCss = loadJsCss;
})("undefined" !== typeof window ? window : this, document);
/*!
 * app logic
 */
(function (root, document) {
	"use strict";

	var createElement = "createElement";
	var length = "length";

	var progressBar = new ToProgress({
		id: "top-progress-bar",
		color: "#FF2C40",
		height: "0.200rem",
		duration: 0.2
	});

	var hideProgressBar = function () {
		progressBar.finish();
		progressBar.hide();
	};

	progressBar.increase(20);

	var run = function () {

		var getElementById = "getElementById";
		var getElementsByClassName = "getElementsByClassName";
		var appendChild = "appendChild";
		var parentNode = "parentNode";
		var classList = "classList";
		var dataset = "dataset";
		var src = "src";
		var alt = "alt";
		var title = "title";
		var style = "style";
		var createTextNode = "createTextNode";
		var hasOwnProperty = "hasOwnProperty";
		var innerHTML = "innerHTML";
		var createContextualFragment = "createContextualFragment";
		var createDocumentFragment = "createDocumentFragment";

		progressBar.increase(20);

		var hasTouch = "ontouchstart" in document[documentElement] || "";

		var hasWheel = "onwheel" in document[createElement]("div") || void 0 !== document.onmousewheel || "";

		var documentTitle = document[title] || "";

		var navigatorUserAgent = navigator.userAgent || "";

		var getHumanDate = function () {
			var newDate = new Date();
			var newDay = newDate.getDate();
			var newYear = newDate.getFullYear();
			var newMonth = newDate.getMonth();
			newMonth += 1;
			if (10 > newDay) {
				newDay = "0" + newDay;
			}
			if (10 > newMonth) {
				newMonth = "0" + newMonth;
			}
			return newYear + "-" + newMonth + "-" + newDay;
		}();

		var platformName = "";
		var platformDescription = "";
		if (navigatorUserAgent && root.platform) {
			platformName = platform.name || "";
			platformDescription = platform.description || "";
			document[title] = documentTitle + " [" + (getHumanDate ? " " + getHumanDate : "") + (platformDescription ? " " + platformDescription : "") + (hasTouch || hasWheel ? " with" : "") + (hasTouch ? " touch" : "") + (hasTouch && hasWheel ? "," : "") + (hasWheel ? " mousewheel" : "") + "]";
		}

		var zoomwallGalleryClass = "zoomwall";
		var zoomwallGallery = document[getElementsByClassName](zoomwallGalleryClass)[0] || "";
		var imgClass = "data-src-img";
		var jsonSrcKeyName = "src";
		var jsonWidthKeyName = "width";
		var jsonHeightKeyName = "height";
		var jsonUrl = "./libs/contents-cards/json/contents.json";

		var safelyParseJSON = function (response) {
			var isJson = function (obj) {
				var objType = typeof obj;
				return ['boolean', 'number', "string", 'symbol', "function"].indexOf(objType) === -1;
			};
			if (!isJson(response)) {
				return JSON.parse(response);
			} else {
				return response;
			}
		};

		var renderTemplate = function (parsedJson, templateId, targetId) {
			var template = document[getElementById](templateId) || "";
			var target = document[getElementById](targetId) || "";
			var jsonObj = safelyParseJSON(parsedJson);
			if (jsonObj && template && target) {
				var targetHtml = template[innerHTML] || "",
				    renderTargetTemplate = new t(targetHtml);
				return renderTargetTemplate.render(jsonObj);
			}
			return {};
		};

		var insertTextAsFragment = function (text, container, callback) {
			var body = document.body || "";
			var cb = function () {
				return callback && "function" === typeof callback && callback();
			};
			try {
				var clonedContainer = container.cloneNode(!1);
				if (document.createRange) {
					var rg = document.createRange();
					rg.selectNode(body);
					var df = rg[createContextualFragment](text);
					clonedContainer[appendChild](df);
					return container[parentNode] ? container[parentNode].replaceChild(clonedContainer, container) : container[innerHTML] = text, cb();
				} else {
					clonedContainer[innerHTML] = text;
					return container[parentNode] ? container[parentNode].replaceChild(document[createDocumentFragment][appendChild](clonedContainer), container) : container[innerHTML] = text, cb();
				}
			} catch (e) {
				console.log(e);
				return;
			}
		};

		var insertFromTemplate = function (parsedJson, templateId, targetId, callback, useInner) {
			var inner = useInner || "";
			var template = document[getElementById](templateId) || "";
			var target = document[getElementById](targetId) || "";
			var cb = function () {
				return callback && "function" === typeof callback && callback();
			};
			if (parsedJson && template && target) {
				var targetRendered = renderTemplate(parsedJson, templateId, targetId);
				if (inner) {
					target[innerHTML] = targetRendered;
					cb();
				} else {
					insertTextAsFragment(targetRendered, target, cb);
				}
			}
		};

		var generateGallery = function (text) {

			return new Promise(function (resolve, reject) {

				var jsonObj;

				try {
					jsonObj = JSON.parse(text);
					if (!jsonObj.pages[0][jsonSrcKeyName]) {
						throw new Error("incomplete JSON data: no " + jsonSrcKeyName);
					}
				} catch (err) {
					console.log("cannot init generateGallery", err);
					return;
				}

				/*!
     * render with <template> and t.js
     * the drawback you cannot know image sizes
     * attention to last param: if false cloneNode will be used
     * and setting listeners or changing its CSS will not be possible
     */
				insertFromTemplate(jsonObj, "template_zoomwall", "target_zoomwall", function () {
					if (document[getElementsByClassName](imgClass)[length] > 0) {
						resolve();
					} else {
						reject();
					}
				}, true);

				/*!
     * render with creating DOM Nodes
     */
				/* jsonObj = jsonObj.pages;
    	var df = document[createDocumentFragment]();
    	var key;
    for (key in jsonObj) {
    	if (jsonObj[hasOwnProperty](key)) {
    		if (jsonObj[key][jsonSrcKeyName]) {
    			var img = document[createElement]("img");
    			if (jsonObj[key][jsonWidthKeyName]) {
    				img[src] = ["data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20viewBox%3D%270%200%20",
    					jsonObj[key][jsonWidthKeyName],
    					"%20",
    					jsonObj[key][jsonHeightKeyName],
    					"%27%2F%3E"].join("");
    			} else {
    				var dummyImg = new Image();
    				dummyImg[src] = jsonObj[key][jsonSrcKeyName];
    				var dummyImgWidth = dummyImg.naturalWidth;
    				var dummyImgHeight = dummyImg.naturalHeight;
    				if (dummyImgWidth && dummyImgHeight) {
    					img[src] = ["data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20viewBox%3D%270%200%20", dummyImgWidth, "%20", dummyImgHeight, "%27%2F%3E"].join("");
    				} else {
    					img[src] = ["data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20viewBox%3D%270%200%20", 640, "%20", 360, "%27%2F%3E"].join("");
    				}
    			}
    			img[dataset][jsonSrcKeyName] = jsonObj[key][jsonSrcKeyName];
    			img[classList].add(imgClass);
    			img[alt] = "";
    				df[appendChild](img);
    			df[appendChild](document[createTextNode]("\n"));
    		}
    	}
    }
    key = null;
    	if (zoomwallGallery[appendChild](df)) {
    	resolve();
    } else {
    	reject();
    } */
			});
		};

		var timerCreateGallery;
		var createGallery = function () {
			clearTimeout(timerCreateGallery);
			timerCreateGallery = null;

			var onZoomwallCreated = function () {
				zoomwallGallery[style].visibility = "visible";
				zoomwallGallery[style].opacity = 1;
			};
			zoomwall.create(zoomwallGallery, true, jsonSrcKeyName, null, onZoomwallCreated);

			progressBar.increase(20);
		};

		var timerSetLazyloading;
		var setLazyloading = function () {
			clearTimeout(timerSetLazyloading);
			timerSetLazyloading = null;

			echo(imgClass, jsonSrcKeyName);

			hideProgressBar();
		};

		var myHeaders = new Headers();

		fetch(jsonUrl, {
			headers: myHeaders,
			credentials: "same-origin"
		}).then(function (response) {
			if (response.ok) {
				return response.text();
			} else {
				throw new Error("cannot fetch", jsonUrl);
			}
		}).then(function (text) {
			generateGallery(text).then(function (result) {
				return result;
			}).then(function (result) {
				timerCreateGallery = setTimeout(createGallery, 100);
			}).then(function (result) {
				timerSetLazyloading = setTimeout(setLazyloading, 200);
			}).catch(function (err) {
				console.log("Cannot create zoomwall gallery", err);
			});
		}).catch(function (err) {
			console.log("cannot parse", jsonUrl);
		});
	};

	var documentElement = "documentElement";
	var defineProperty = "defineProperty";
	var addEventListener = "addEventListener";

	var scripts = ["./libs/picturewall/css/bundle.min.css"];

	var getHTTP = function (force) {
		var any = force || "";
		var locationProtocol = root.location.protocol || "";
		return "http:" === locationProtocol ? "http" : "https:" === locationProtocol ? "https" : any ? "http" : "";
	};

	var forcedHTTP = getHTTP(true);

	var supportsClassList = "classList" in document[createElement]("_") || "";

	if (!supportsClassList) {
		scripts.push(forcedHTTP + "://cdn.jsdelivr.net/npm/classlist.js@1.1.20150312/classList.min.js");
	}

	var supportsDataset = "undefined" !== typeof root.Element && "dataset" in document[documentElement] || "";

	if (!supportsDataset) {
		scripts.push(forcedHTTP + "://cdn.jsdelivr.net/npm/element-dataset@2.2.6/lib/browser/index.cjs.min.js");
	}

	var supportsPassive = function () {
		var support = false;
		try {
			var opts = Object[defineProperty] && Object[defineProperty]({}, "passive", {
				get: function () {
					support = true;
				}
			});
			root[addEventListener]("test", function () {}, opts);
		} catch (err) {}
		return support;
	}();

	if (!supportsPassive) {
		scripts.push(forcedHTTP + "://cdn.jsdelivr.net/npm/dom4@1.8.5/build/dom4.max.min.js");
	}

	if (!root.Promise) {
		scripts.push(forcedHTTP + "://cdn.jsdelivr.net/es6-promise-polyfill/1.2.0/promise.min.js");
	}

	if (!root.fetch) {
		scripts.push(forcedHTTP + "://cdn.jsdelivr.net/fetch/2.0.1/fetch.min.js");
	}

	scripts.push(forcedHTTP + "://cdn.jsdelivr.net/npm/platform@1.3.4/platform.min.js");

	/*!
  * load scripts after webfonts loaded using doesFontExist
  */

	var onFontsLoadedCallback = function () {

		var slot;
		var onFontsLoaded = function () {
			clearInterval(slot);
			slot = null;

			progressBar.increase(20);

			var load;
			load = new loadJsCss(scripts, run);
		};

		var supportsCanvas = function () {
			var elem = document[createElement]("canvas");
			return !!(elem.getContext && elem.getContext("2d"));
		}();

		var checkFontIsLoaded = function () {
			if (doesFontExist("Roboto")) {
				onFontsLoaded();
			}
		};

		if (supportsCanvas) {
			slot = setInterval(checkFontIsLoaded, 100);
		} else {
			slot = null;
			onFontsLoaded();
		}
	};

	var load;
	load = new loadJsCss([forcedHTTP + "://fonts.googleapis.com/css?family=Roboto:400&subset=cyrillic"], onFontsLoadedCallback);

	/*!
  * load scripts after webfonts loaded using webfontloader
  */

	/* root.WebFontConfig = {
 	google: {
 		families: [
 			"Roboto:400:cyrillic"
 		]
 	},
 	listeners: [],
 	active: function () {
 		this.called_ready = true;
 		for (var i = 0; i < this.listeners[length]; i++) {
 			this.listeners[i]();
 		}
 	},
 	ready: function (callback) {
 		if (this.called_ready) {
 			callback();
 		} else {
 			this.listeners.push(callback);
 		}
 	}
 };
 	var onFontsLoadedCallback = function () {
 		var onFontsLoaded = function () {
 		progressBar.increase(20);
 		var load;
 		load = new loadJsCss(scripts, run);
 	};
 		root.WebFontConfig.ready(onFontsLoaded);
 };
 	var load;
 load = new loadJsCss(
 		[forcedHTTP + "://cdn.jsdelivr.net/npm/webfontloader@1.6.28/webfontloader.min.js"],
 		onFontsLoadedCallback
 	); */
})("undefined" !== typeof window ? window : this, document);

//# sourceMappingURL=bundle.js.map