/*jslint browser: true */
/*jslint node: true */
/*global debounce, doesFontExist, imagesPreloaded, loadJsCss, Parallax,
platform, QRCode, ToProgress, unescape, VK, WheelIndicator, Ya */
/*property console, split */
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
	var methods = ("assert,clear,count,debug,dir,dirxml,error,exception,group," +
		"groupCollapsed,groupEnd,info,log,markTimeline,profile,profiles,profileEnd," +
		"show,table,time,timeEnd,timeline,timelineEnd,timeStamp,trace,warn").split(",");
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
}("undefined" !== typeof window ? window : this));
/*!
 * modified ToProgress v0.1.1
 * @see {@link http://github.com/djyde/ToProgress}
 * @see {@link https://github.com/djyde/ToProgress/blob/master/ToProgress.js}
 * passes jshint
 */
(function (root, document, undefined) {
	"use strict";
	var ToProgress = (function () {
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
	}
		());
	root.ToProgress = ToProgress;
}
	("undefined" !== typeof window ? window : this, document));
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
 * modified Returns a function, that, as long as it continues to be invoked, will not
 * be triggered. The function will be called after it stops being called for
 * N milliseconds. If `immediate` is passed, trigger the function on the
 * leading edge, instead of the trailing. The function also has a property 'clear'
 * that is a function which will clear the timer to prevent previously scheduled executions.
 * @source underscore.js
 * @see http://unscriptable.com/2009/03/20/debouncing-javascript-methods/
 * @param {Function} function to wrap
 * @param {Number} timeout in ms (`100`)
 * @param {Boolean} whether to execute at the beginning (`false`)
 * @api public
 * @see {@link https://github.com/component/debounce/blob/master/index.js}
 * passes jshint
 */
(function (root) {
	"use strict";
	var debounce = function (func, wait, immediate) {
		var timeout,
		args,
		context,
		timestamp,
		result;
		if (undefined === wait || null === wait) {
			wait = 100;
		}
		function later() {
			var last = Date.now() - timestamp;
			if (last < wait && last >= 0) {
				timeout = setTimeout(later, wait - last);
			} else {
				timeout = null;
				if (!immediate) {
					result = func.apply(context, args);
					context = args = null;
				}
			}
		}
		var debounced = function () {
			context = this;
			args = arguments;
			timestamp = Date.now();
			var callNow = immediate && !timeout;
			if (!timeout) {
				timeout = setTimeout(later, wait);
			}
			if (callNow) {
				result = func.apply(context, args);
				context = args = null;
			}
			return result;
		};
		debounced.clear = function () {
			if (timeout) {
				clearTimeout(timeout);
				timeout = null;
			}
		};
		debounced.flush = function () {
			if (timeout) {
				result = func.apply(context, args);
				context = args = null;
				clearTimeout(timeout);
				timeout = null;
			}
		};
		return debounced;
	};
	root.debounce = debounce;
}
	("undefined" !== typeof window ? window : this));
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
		var i,
		l;
		for (i = 0, l = _this.files[length]; i < l; i += 1) {
			if ((/\.js$|\.js\?/).test(_this.files[i])) {
				_this.js.push(_this.files[i]);
			}
			if ((/\.css$|\.css\?|\/css\?/).test(_this.files[i])) {
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
}
	("undefined" !== typeof window ? window : this, document));
/*!
 * app logic
 */
(function (root, document, undefined) {
	"use strict";

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

	var slotOnImagesPreloaded;
	var onImagesPreloaded = function () {
		if (imagesPreloaded) {
			clearInterval(slotOnImagesPreloaded);
			slotOnImagesPreloaded = null;
			progressBar.increase(20);
		}
	};

	var addEventListener = "addEventListener";

	var createElementNS = "createElementNS";

	var toStringFn = {}.toString;
	var supportsSvgSmilAnimation = !!document[createElementNS] && (/SVGAnimate/).test(toStringFn.call(document[createElementNS]("http://www.w3.org/2000/svg", "animate"))) || "";

	if (!supportsSvgSmilAnimation) {

		progressBar.increase(20);

		if ("undefined" !== typeof imagesPreloaded) {
			slotOnImagesPreloaded = setInterval(onImagesPreloaded, 100);
		}

		root[addEventListener]("load", hideProgressBar);
	}

	var getElementsByClassName = "getElementsByClassName";

	var parentNode = "parentNode";

	var removeChild = "removeChild";

	var remove = "remove";

	var removeElement = function (elem) {
		if (elem) {
			if ("undefined" !== typeof elem[remove]) {
				return elem[remove]();
			} else {
				return elem[parentNode] && elem[parentNode][removeChild](elem);
			}
		}
	};

	var ripple = document[getElementsByClassName]("ripple")[0] || "";

	var removeRipple = function () {
		removeElement(ripple);
	};

	var timerDeferRemoveRipple;
	var deferRemoveRipple = function () {
		clearTimeout(timerDeferRemoveRipple);
		timerDeferRemoveRipple = null;
		removeRipple();
	};

	var loading = document[getElementsByClassName]("loading")[0] || "";

	var removeLoading = function () {
		removeElement(loading);
	};

	var timerDeferRemoveLoading;
	var deferRemoveLoading = function () {
		clearTimeout(timerDeferRemoveLoading);
		timerDeferRemoveLoading = null;
		removeLoading();
	};

	var className = "className";

	var bounceOutUpClass = "bounceOutUp";

	var hidePreloaders = function () {
		if (ripple) {
			ripple[className] += " " + bounceOutUpClass;
			timerDeferRemoveRipple = setTimeout(deferRemoveRipple, 5000);
		}
		if (loading) {
			loading[className] += " " + bounceOutUpClass;
			timerDeferRemoveLoading = setTimeout(deferRemoveLoading, 5000);
		}
	};

	if (!supportsSvgSmilAnimation) {
		removeRipple();
		removeLoading();
	} else {
		root[addEventListener]("load", hidePreloaders);
	}

	var getAttribute = "getAttribute";

	var src = "src";

	var length = "length";

	var supportsSvgAsImg = document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image", "1.1") || "";

	if (!supportsSvgAsImg) {
		var svgNosmilImages = document[getElementsByClassName]("svg-nosmil-img") || "";
		if (svgNosmilImages) {
			var i,
			l;
			for (i = 0, l = svgNosmilImages[length]; i < l; i += 1) {
				svgNosmilImages[i][src] = svgNosmilImages[i][getAttribute]("data-fallback-src");
			}
			i = l = null;
		}
	}

	if (!supportsSvgSmilAnimation) {
		var svgSmilImages = document[getElementsByClassName]("svg-smil-img") || "";
		if (svgSmilImages) {
			var j,
			m;
			for (j = 0, m = svgSmilImages[length]; j < m; j += 1) {
				svgSmilImages[j][src] = svgSmilImages[j][getAttribute]("data-fallback-src");
			}
			j = m = null;
		}
	}

	var drawImageFromUrl = function (canvasObj, url) {
		if (!canvasObj || !url) {
			return;
		}
		var img = new Image();
		img[addEventListener]("load", function () {
			var ctx = canvasObj.getContext("2d");
			if (ctx) {
				ctx.drawImage(img, 0, 0, canvasObj.width, canvasObj.height);
			}
		});
		img[src] = url;
	};

	var getElementsByTagName = "getElementsByTagName";

	var styleSheets = "styleSheets";

	var canvasAll = document[getElementsByTagName]("canvas") || "";
	var styleSheetsLength = document[styleSheets][length] || 0;

	var slotDrawCanvasAll;
	var drawCanvasAll = function () {
		if (document[styleSheets][length] > styleSheetsLength) {
			clearInterval(slotDrawCanvasAll);
			slotDrawCanvasAll = null;
			var i,
			l;
			for (i = 0, l = canvasAll[length]; i < l; i += 1) {
				if (canvasAll[i][getAttribute]("data-src")) {
					drawImageFromUrl(canvasAll[i], canvasAll[i][getAttribute]("data-src"));
				}
			}
			i = l = null;
		}
	};
	if (canvasAll && styleSheetsLength) {
		slotDrawCanvasAll = setInterval(drawCanvasAll, 100);
	}

	var documentElement = "documentElement";

	var createElement = "createElement";

	var hasTouch = "ontouchstart" in document[documentElement] || "";

	var hasWheel = "onwheel" in document[createElement]("div") || void 0 !== document.onmousewheel || "";

	var getHTTP = function (force) {
		force = force || "";
		var locationProtocol = root.location.protocol || "";
		return "http:" === locationProtocol ? "http" : "https:" === locationProtocol ? "https" : force ? "http" : "";
	};

	var forcedHTTP = getHTTP(true);

	var run = function () {

		if (!supportsSvgSmilAnimation) {
			progressBar.increase(20);
		}

		var style = "style";

		var visibility = "visibility";

		var opacity = "opacity";

		var qrcode = document[getElementsByClassName]("qrcode")[0] || "";
		var timerShowQrcode;
		var showQrcode = function () {
			clearTimeout(timerShowQrcode);
			timerShowQrcode = null;
			qrcode[style][visibility] = "visible";
			qrcode[style][opacity] = 1;
		};

		var href = "href";

		var locationHref = root.location[href] || "";

		var title = "title";

		var documentTitle = document[title] || "";

		var appendChild = "appendChild";

		if (qrcode) {
			var qrcodeImg = document[createElement]("img");
			var qrcodeImgTitle = documentTitle ? ("Ссылка на страницу «" + documentTitle.replace(/\[[^\]]*?\]/g, "").trim() + "»") : "";
			var qrcodeImgSrc = forcedHTTP + "://chart.googleapis.com/chart?cht=qr&chld=M%7C4&choe=UTF-8&chs=300x300&chl=" + encodeURIComponent(locationHref);
			qrcodeImg.alt = qrcodeImgTitle;
			if (root.QRCode) {
				if (supportsSvgAsImg) {
					qrcodeImgSrc = QRCode.generateSVG(locationHref, {
							ecclevel: "M",
							fillcolor: "#FFFFFF",
							textcolor: "#191919",
							margin: 4,
							modulesize: 8
						});
					var XMLS = new XMLSerializer();
					qrcodeImgSrc = XMLS.serializeToString(qrcodeImgSrc);
					qrcodeImgSrc = "data:image/svg+xml;base64," + root.btoa(unescape(encodeURIComponent(qrcodeImgSrc)));
					qrcodeImg[src] = qrcodeImgSrc;
				} else {
					qrcodeImgSrc = QRCode.generatePNG(locationHref, {
							ecclevel: "M",
							format: "html",
							fillcolor: "#FFFFFF",
							textcolor: "#1F1F1F",
							margin: 4,
							modulesize: 8
						});
					qrcodeImg[src] = qrcodeImgSrc;
				}
			} else {
				qrcodeImg[src] = qrcodeImgSrc;
			}
			qrcodeImg[title] = qrcodeImgTitle;
			qrcode[appendChild](qrcodeImg);
			timerShowQrcode = setTimeout(showQrcode, 2000);
		}

		var downloadApp = document[getElementsByClassName]("download-app")[0] || "";
		var downloadAppLink = downloadApp ? downloadApp[getElementsByTagName]("a")[0] || "" : "";
		var downloadAppImg = downloadApp ? downloadApp[getElementsByTagName]("img")[0] || "" : "";
		var navigatorUserAgent = navigator.userAgent || "";

		var getHumanDate = function () {
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
		}
		();

		var timerShowDownloadApp;
		var showDownloadApp = function () {
			clearTimeout(timerShowDownloadApp);
			timerShowDownloadApp = null;
			downloadApp[style][visibility] = "visible";
			downloadApp[style][opacity] = 1;
		};

		if (navigatorUserAgent && downloadApp && downloadAppLink && downloadAppImg && root.platform) {
			var platformName = platform.name || "";
			var platformDescription = platform.description || "";
			document[title] = documentTitle +
			" [" +
			(getHumanDate ? " " + getHumanDate : "") +
			(platformDescription ? " " + platformDescription : "") +
			((hasTouch || hasWheel) ? " with" : "") +
			(hasTouch ? " touch" : "") +
			((hasTouch && hasWheel) ? "," : "") +
			(hasWheel ? " mousewheel" : "") +
			"]";
			var platformOsFamily = platform.os.family || "";
			var platformOsVersion = platform.os.version || "";
			var platformOsArchitecture = platform.os.architecture || "";
			/* console.log(navigatorUserAgent);
			console.log(platform.os);
			console.log(platformName + "|" + platformOsFamily + "|" + platformOsVersion + "|" + platformOsArchitecture + "|" + platformDescription); */
			var downloadAppImgSrc;
			var downloadAppLinkHref;
			if (platformOsFamily.indexOf("Windows Phone", 0) !== -1  && "10.0" === platformOsVersion) {
				downloadAppImgSrc = "./libs/products/img/download_wp_app_144x52.svg";
				downloadAppLinkHref = "https://github.com/englishextra/englishextra-app/releases/download/v1.0.0/englishextra.Windows10_1.0.0.0_x86_debug.appx";
			} else if (platformName.indexOf("IE Mobile", 0) !== -1 && ("7.5" === platformOsVersion || "8.0" === platformOsVersion || "8.1" === platformOsVersion)) {
				downloadAppImgSrc = "./libs/products/img/download_wp_app_144x52.svg";
				downloadAppLinkHref = "https://github.com/englishextra/englishextra-app/releases/download/v1.0.0/englishextra_app-debug.xap";
			} else if (platformOsFamily.indexOf("Windows", 0) !== -1 && 64 === platformOsArchitecture) {
				downloadAppImgSrc = "./libs/products/img/download_windows_app_144x52.svg";
				downloadAppLinkHref = "https://github.com/englishextra/englishextra-app/releases/download/v1.0.0/englishextra-win32-x64-setup.exe";
			} else if (platformOsFamily.indexOf("Windows", 0) !== -1 && 32 === platformOsArchitecture) {
				downloadAppImgSrc = "./libs/products/img/download_windows_app_144x52.svg";
				downloadAppLinkHref = "https://github.com/englishextra/englishextra-app/releases/download/v1.0.0/englishextra-win32-ia32-setup.exe";
			} else if (navigatorUserAgent.indexOf("armv7l", 0) !== -1) {
				downloadAppImgSrc = "./libs/products/img/download_linux_app_144x52.svg";
				downloadAppLinkHref = "https://github.com/englishextra/englishextra-app/releases/download/v1.0.0/englishextra-linux-armv7l.tar.gz";
			} else if (navigatorUserAgent.indexOf("X11", 0) !== -1 && navigatorUserAgent.indexOf("Linux") !== -1 && 64 === platformOsArchitecture) {
				downloadAppImgSrc = "./libs/products/img/download_linux_app_144x52.svg";
				downloadAppLinkHref = "https://github.com/englishextra/englishextra-app/releases/download/v1.0.0/englishextra-linux-x64.tar.gz";
			} else if (navigatorUserAgent.indexOf("X11", 0) !== -1 && navigatorUserAgent.indexOf("Linux") !== -1 && 32 === platformOsArchitecture) {
				downloadAppImgSrc = "./libs/products/img/download_linux_app_144x52.svg";
				downloadAppLinkHref = "https://github.com/englishextra/englishextra-app/releases/download/v1.0.0/englishextra-linux-ia32.tar.gz";
			} else {
				if (platformOsFamily.indexOf("Android", 0) !== -1) {
					downloadAppImgSrc = "./libs/products/img/download_android_app_144x52.svg";
					downloadAppLinkHref = "https://github.com/englishextra/englishextra-app/releases/download/v1.0.0/englishextra-debug.apk";
				}
			}
			if (downloadAppImgSrc && downloadAppLinkHref) {
				downloadAppLink[href] = downloadAppLinkHref;
				downloadAppLink.rel = "noopener";
				downloadAppLink.target = "_blank";
				downloadAppLink[title] = "Скачать приложение";
				if (!supportsSvgAsImg) {
					downloadAppImgSrc = downloadAppImgSrc.slice(0, -3) + "png";
				}
				downloadAppImg[src] = downloadAppImgSrc;
				timerShowDownloadApp = setTimeout(showDownloadApp, 1000);
			}
		}

		var getElementById = "getElementById";

		var scene = document[getElementById]("scene") || "";
		var parallax;
		if (scene && root.Parallax) {
			parallax = new Parallax(scene);
		}

		var classList = "classList";

		var bounceInUpClass = "bounceInUp";
		
		var bounceOutDownClass = "bounceOutDown";

		var guesture = document[getElementsByClassName]("guesture")[0] || "";

		var start = document[getElementsByClassName]("start")[0] || "";
		var hand = document[getElementsByClassName]("hand")[0] || "";
		
		var revealStart = function () {
			if (start) {
				start[classList].remove(bounceOutDownClass);
				start[classList].add(bounceInUpClass);
				start[style].display = "block";
			}
			if (hand) {
				hand[classList].remove(bounceOutDownClass);
				hand[classList].add(bounceInUpClass);
				hand[style].display = "block";
			}
			if (guesture) {
				guesture[classList].add(bounceOutUpClass);
			}
		};
		
		var concealStart = function () {
			if (start) {
				start[classList].remove(bounceInUpClass);
				start[classList].add(bounceOutDownClass);
			}
			if (hand) {
				hand[classList].remove(bounceInUpClass);
				hand[classList].add(bounceOutDownClass);
			}
			var timerDeferHideStart;
			var deferHideStart = function () {
				clearTimeout(timerDeferHideStart);
				timerDeferHideStart = null;
				start[style].display = "none";
				hand[style].display = "none";
			};
			timerDeferHideStart = setTimeout(deferHideStart, 1000);
		};

		var wrapper = document[getElementsByClassName]("wrapper")[0] || "";

		if (wrapper) {
			var mousewheeldown = document[getElementsByClassName]("mousewheeldown")[0] || "";
			var swipeup = document[getElementsByClassName]("swipeup")[0] || "";
			if (hasTouch) {
				mousewheeldown[style].display = "none";
				if (root.tocca) {
					root[addEventListener]("swipeup", revealStart, {
						passive: true
					});
					root[addEventListener]("swipedown", concealStart, {
						passive: true
					});
				}
			} else {
				if (hasWheel) {
					swipeup[style].display = "none";
					if (root.WheelIndicator) {
						var indicator;
						indicator = new WheelIndicator({
								elem: wrapper,
								callback: function (e) {
									if ("down" === e.direction) {
										revealStart();
									}
									if ("up" === e.direction) {
										concealStart();
									}
								},
								preventMouse: false
							});
					}
				}
			}
			if (hasTouch || hasWheel) {
				guesture[classList].add(bounceInUpClass);
				guesture[style].display = "block";
			}
		}

		var scriptIsLoaded = function (_src) {
			var scriptAll,
			i,
			l;
			for (scriptAll = document[getElementsByTagName]("script") || "", i = 0, l = scriptAll[length]; i < l; i += 1) {
				if (scriptAll[i][getAttribute]("src") === _src) {
					scriptAll = i = l = null;
					return true;
				}
			}
			scriptAll = i = l = null;
			return false;
		};

		var isActiveClass = "is-active";

		var hideOtherIsSocial = function (_this) {
			_this = _this || this;
			var isSocialAll = document[getElementsByClassName]("is-social") || "";
			if (isSocialAll) {
				var k,
				n;
				for (k = 0, n = isSocialAll[length]; k < n; k += 1) {
					if (_this !== isSocialAll[k]) {
						isSocialAll[k][classList].remove(isActiveClass);
					}
				}
				k = n = null;
			}
		};

		root[addEventListener]("click", hideOtherIsSocial);

		var yaShare2Id = "ya-share2";

		var yaShare2 =  document[getElementById](yaShare2Id) || "";

		var btnShare = document[getElementsByClassName]("btn-share")[0] || "";
		var btnShareLink = btnShare ? btnShare[getElementsByTagName]("a")[0] || "" : "";
		var yshare;
		var showYaShare2 = function (ev) {
			ev.preventDefault();
			ev.stopPropagation();
			var logicShowShareButtons = function () {
				yaShare2[classList].toggle(isActiveClass);
				hideOtherIsSocial(yaShare2);
				var initScript = function () {
					if (root.Ya) {
						try {
							if (yshare) {
								yshare.updateContent({
									title: documentTitle,
									description: documentTitle,
									url: locationHref
								});
							} else {
								yshare = Ya.share2(yaShare2Id, {
									content: {
										title: documentTitle,
										description: documentTitle,
										url: locationHref
									}
								});
							}
						} catch (err) {
							console.log("cannot update or init Ya", err);
						}
					}
				};
				var jsUrl = forcedHTTP + "://yastatic.net/share2/share.js";
				if (!scriptIsLoaded(jsUrl)) {
					var load;
					load = new loadJsCss([jsUrl], initScript);
				} else {
					initScript();
				}
			};
			var debounceLogicShowShareButtons = debounce(logicShowShareButtons, 200);
			debounceLogicShowShareButtons();
		};

		if (btnShare && btnShareLink && yaShare2) {
			btnShare[style][visibility] = "visible";
			btnShare[style][opacity] = 1;
			btnShareLink[addEventListener]("click", showYaShare2);
		}

		var dataset = "dataset";

		var vkLikeClass = "vk-like";
		var vkLike = document[getElementsByClassName](vkLikeClass)[0] || "";

		var btnLike = document[getElementsByClassName]("btn-like")[0] || "";
		var btnLikeLink = btnLike ? btnLike[getElementsByTagName]("a")[0] || "" : "";
		var vkLikeId = "vk-like";

		var vlike;
		var showVkLike = function (ev) {
			ev.preventDefault();
			ev.stopPropagation();
			var logicShowVkLike = function () {
				vkLike[classList].toggle(isActiveClass);
				hideOtherIsSocial(vkLike);
				var initScript = function () {
					if (root.VK) {
						if (!vlike) {
							try {
								VK.init({
									apiId: (vkLike[dataset].apiid || ""),
									nameTransportPath: "/xd_receiver.htm",
									onlyWidgets: true
								});
								VK.Widgets.Like(vkLikeId, {
									type: "button",
									height: 24
								});
								vlike = true;
							} catch (err) {
								console.log("cannot init VK", err);
							}
						}
					}
				};
				var jsUrl = forcedHTTP + "://vk.com/js/api/openapi.js?147";
				if (!scriptIsLoaded(jsUrl)) {
					var load;
					load = new loadJsCss([jsUrl], initScript);
				} else {
					initScript();
				}
			};
			var debounceLogicShowVkLike = debounce(logicShowVkLike, 200);
			debounceLogicShowVkLike();
		};

		if (btnLike && btnLikeLink && vkLike) {
			btnLike[style][visibility] = "visible";
			btnLike[style][opacity] = 1;
			btnLikeLink[addEventListener]("click", showVkLike);
		}
	};

	var scripts = [
		forcedHTTP + "://cdnjs.cloudflare.com/ajax/libs/github-fork-ribbon-css/0.2.0/gh-fork-ribbon.min.css",
		"./libs/john-locke/css/bundle.min.css"];

	var supportsClassList = "classList" in document[createElement]("_") || "";

	if (!supportsClassList) {
		scripts.push(forcedHTTP + "://cdn.jsdelivr.net/npm/classlist.js@1.1.20150312/classList.min.js");
	}

	var supportsDataset = "undefined" !== typeof root.Element && "dataset" in document[documentElement] || "";

	if (!supportsDataset) {
		scripts.push(forcedHTTP + "://cdn.jsdelivr.net/npm/element-dataset@2.2.6/lib/browser/index.cjs.min.js");
	}

	var defineProperty = "defineProperty";

	var supportsPassive = (function () {
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

	}
		());

	if (!supportsPassive) {
		scripts.push(forcedHTTP + "://cdnjs.cloudflare.com/ajax/libs/dom4/1.8.3/dom4.js");
	}

	scripts.push(forcedHTTP + "://cdn.jsdelivr.net/npm/parallax-js@3.1.0/dist/parallax.min.js",
		forcedHTTP + "://cdn.jsdelivr.net/npm/qrjs2@0.1.3/qrjs2.min.js",
		forcedHTTP + "://cdn.jsdelivr.net/npm/platform@1.3.4/platform.min.js");

	if (hasTouch) {
		scripts.push(forcedHTTP + "://cdnjs.cloudflare.com/ajax/libs/Tocca.js/2.0.1/Tocca.min.js");
	} else {
		if (hasWheel) {
			/* scripts.push(forcedHTTP + "://cdn.jsdelivr.net/npm/wheel-indicator@1.1.4/lib/wheel-indicator.min.js"); */
			scripts.push("./cdn/wheel-indicator/1.1.4/js/wheel-indicator-passive.fixed.min.js");
		}
	}

	/*!
	 * load scripts after webfonts loaded using doesFontExist
	 */

	var onFontsLoadedCallback = function () {

		var slotOnFontsLoaded;
		var onFontsLoaded = function () {
			clearInterval(slotOnFontsLoaded);
			slotOnFontsLoaded = null;
			if (!supportsSvgSmilAnimation) {
				progressBar.increase(20);
			}
			var load;
			load = new loadJsCss(scripts, run);
		};

		var supportsCanvas = (function () {
			var elem = document.createElement("canvas");
			return !!(elem.getContext && elem.getContext("2d"));
		}
			());

		var checkFontIsLoaded = function () {

			if (supportsCanvas) {
				if (doesFontExist("Roboto") && doesFontExist("Roboto Condensed") && doesFontExist("PT Serif")) {
					onFontsLoaded();
				}
			} else {
				onFontsLoaded();
			}
		};

		slotOnFontsLoaded = setInterval(checkFontIsLoaded, 100);
	};

	var load;
	load = new loadJsCss(
			[forcedHTTP + "://fonts.googleapis.com/css?family=PT+Serif:400%7CRoboto:400,700%7CRoboto+Condensed:700&subset=cyrillic"],
			onFontsLoadedCallback
		);

	/*!
	 * load scripts after webfonts loaded using webfontloader
	 */

	/* root.WebFontConfig = {
		google: {
			families: [
				"PT Serif:400:cyrillic",
				"Roboto:400,700:cyrillic",
				"Roboto Condensed:700:cyrillic"
			]
		},
		listeners: [],
		active: function () {
			this.called_ready = true;
			for (var i = 0; i < this.listeners.length; i++) {
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
}
	("undefined" !== typeof window ? window : this, document));
