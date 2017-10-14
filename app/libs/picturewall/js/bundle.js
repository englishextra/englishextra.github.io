/*jslint browser: true */
/*jslint node: true */
/*global doesFontExist, echo, Headers, loadJsCss, platform, Promise,
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
		create: function (blocks, enableKeys, dataAttributeHighresName, dataAttributeLowresName) {
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

	var run = function () {

		var getElementById = "getElementById";
		var appendChild = "appendChild";
		var classList = "classList";
		var dataset = "dataset";
		var src = "src";
		var alt = "alt";
		var title = "title";
		var createTextNode = "createTextNode";
		var hasOwnProperty = "hasOwnProperty";
		var createDocumentFragment = "createDocumentFragment";

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

		var zoomwallGallery = document[getElementById]("zoomwall") || "";
		var imgClass = "data-src-img";
		var jsonHighresKeyName = "highres";
		var jsonSrcKeyName = "src";
		var jsonUrl = "./libs/picturewall/json/zoomwall.json";

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

			var generateGallery = new Promise(function (resolve, reject) {

				var jsonObj;

				try {
					jsonObj = JSON.parse(text);
					if (!jsonObj[0][jsonHighresKeyName]) {
						throw new Error("incomplete JSON data: no " + jsonHighresKeyName);
					} else {
						if (!jsonObj[0][jsonSrcKeyName]) {
							throw new Error("incomplete JSON data: no " + jsonSrcKeyName);
						}
					}
				} catch (err) {
					console.log("cannot init generateGallery", err);
					return;
				}

				var df = document[createDocumentFragment]();

				var key;
				for (key in jsonObj) {
					if (jsonObj[hasOwnProperty](key)) {
						if (jsonObj[key][jsonSrcKeyName] && jsonObj[key][jsonHighresKeyName]) {
							var img = document[createElement]("img");
							if (/^([0-9]+)(\x|\ )([0-9]+)$/.test(jsonObj[key][jsonSrcKeyName])) {
								img[src] = ["data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20viewBox%3D%270%200%20", jsonObj[key][jsonSrcKeyName].replace("x", "%20"), "%27%2F%3E"].join("");
							} else {
								var dummyImg = new Image();
								dummyImg[src] = jsonObj[key][jsonSrcKeyName];
								var dummyImgWidth = dummyImg.naturalWidth;
								var dummyImgHeight = dummyImg.naturalHeight;
								if (dummyImgWidth && dummyImgHeight) {
									img[src] = ["data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20viewBox%3D%270%200%20", dummyImgWidth, "%20", dummyImgHeight, "%27%2F%3E"].join("");
								} else {
									img[src] = ["data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20viewBox%3D%270%200%20", 1440, "%20", 810, "%27%2F%3E"].join("");
								}
							}
							img[dataset][jsonHighresKeyName] = jsonObj[key][jsonHighresKeyName];
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
				}
			});

			generateGallery.then(function (result) {
				return result;
			}).then(function (result) {
				var timerCreateGallery;
				var createGallery = function () {
					clearTimeout(timerCreateGallery);
					timerCreateGallery = null;
					zoomwall.create(zoomwallGallery, true, jsonHighresKeyName);
				};
				timerCreateGallery = setTimeout(createGallery, 100);
			}).then(function (result) {
				var timerSetLazyloading;
				var setLazyloading = function () {
					clearTimeout(timerSetLazyloading);
					timerSetLazyloading = null;
					echo(imgClass, jsonHighresKeyName);
				};
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
		force = force || "";
		var locationProtocol = root.location.protocol || "";
		return "http:" === locationProtocol ? "http" : "https:" === locationProtocol ? "https" : force ? "http" : "";
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
 		if (!supportsSvgSmilAnimation) {
 			progressBar.increase(20);
 		}
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