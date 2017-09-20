/*!
 * How can I check if a JS file has been included already?
 * @see {@link https://gist.github.com/englishextra/403a0ca44fc5f495400ed0e20bc51d47}
 * @see {@link https://stackoverflow.com/questions/18155347/how-can-i-check-if-a-js-file-has-been-included-already}
 * @param {String} s path string
 * scriptIsLoaded(s)
 */
(function(root){"use strict";var scriptIsLoaded=function(s){for(var b=document.getElementsByTagName("script")||"",a=0;a<b.length;a+=1){if(b[a].getAttribute("src")===s){return!0;}}return!1;};root.scriptIsLoaded=scriptIsLoaded;}("undefined" !== typeof window ? window : this, document));
/*!
 * modified To load JS and CSS files with vanilla JavaScript
 * @see {@link https://gist.github.com/Aymkdn/98acfbb46fbe7c1f00cdd3c753520ea8}
 * @see {@link https://gist.github.com/englishextra/ff9dc7ab002312568742861cb80865c9}
 */
(function(root,document){"use strict";var loadJsCss=function(files,callback){var _this=this;_this.files=files;_this.js=[];_this.head=document.getElementsByTagName("head")[0]||"";_this.body=document.body||"";_this.ref=document.getElementsByTagName("script")[0]||"";_this.callback=callback||function(){};_this.loadStyle=function(file){var link=document.createElement("link");link.rel="stylesheet";link.type="text/css";link.href=file;_this.head.appendChild(link);};_this.loadScript=function(i){var script=document.createElement("script");script.type="text/javascript";script.async=true;script.src=_this.js[i];var loadNextScript=function(){if(++i<_this.js.length){_this.loadScript(i);}else{_this.callback();}};script.onload=function(){loadNextScript();};_this.head.appendChild(script);if(_this.ref.parentNode){_this.ref.parentNode.insertBefore(script,_this.ref);}else{(_this.body||_this.head).appendChild(script);}};var i,l;for(i=0,l=_this.files.length;i<l;i+=1){if((/\.js$|\.js\?/).test(_this.files[i])){_this.js.push(_this.files[i]);}if((/\.css$|\.css\?|\/css\?/).test(_this.files[i])){_this.loadStyle(_this.files[i]);}}i=null;l=null;if(_this.js.length>0){_this.loadScript(0);}else{_this.after();}};root.loadJsCss=loadJsCss;}("undefined" !== typeof window ? window : this,document));
/*!
 * modified ToProgress v0.1.1
 * @see {@link https://github.com/djyde/ToProgress}
 * @see {@link https://gist.github.com/englishextra/6a8c79c9efbf1f2f50523d46a918b785}
 * @see {@link https://jsfiddle.net/englishextra/z5xhjde8/}
 * arguments.callee changed to TP, a local wrapper function,
 * so that public function name is now customizable;
 * wrapped in curly brackets:
 * else{document.body.appendChild(this.progressBar);};
 * removed module check
 * passes jshint
 */
//(function(root){"use strict";var ToProgress=(function(){var TP=function(){var t=function(){var s=document.createElement("fakeelement"),i={transition:"transitionend",OTransition:"oTransitionEnd",MozTransition:"transitionend",WebkitTransition:"webkitTransitionEnd"};for(var j in i){if(i.hasOwnProperty(j)){if(void 0!==s.style[j]){return i[j];}}}},s=function(t,a){if(this.progress=0,this.options={id:"top-progress-bar",color:"#F44336",height:"2px",duration:0.2},t&&"object"===typeof t){for(var i in t){if(t.hasOwnProperty(i)){this.options[i]=t[i];}}}if(this.options.opacityDuration=3*this.options.duration,this.progressBar=document.createElement("div"),this.progressBar.id=this.options.id,this.progressBar.setCSS=function(t){for(var a in t){if(t.hasOwnProperty(a)){this.style[a]=t[a];}}},this.progressBar.setCSS({position:a?"relative":"fixed",top:"0",left:"0",right:"0","background-color":this.options.color,height:this.options.height,width:"0%",transition:"width "+this.options.duration+"s, opacity "+this.options.opacityDuration+"s","-moz-transition":"width "+this.options.duration+"s, opacity "+this.options.opacityDuration+"s","-webkit-transition":"width "+this.options.duration+"s, opacity "+this.options.opacityDuration+"s"}),a){var o=document.querySelector(a);if(o){if(o.hasChildNodes()){o.insertBefore(this.progressBar,o.firstChild);}else{o.appendChild(this.progressBar);}}}else{document.body.appendChild(this.progressBar);}},i=t();return s.prototype.transit=function(){this.progressBar.style.width=this.progress+"%";},s.prototype.getProgress=function(){return this.progress;},s.prototype.setProgress=function(t,s){this.show();this.progress=t>100?100:0>t?0:t;this.transit();if(s){s();}},s.prototype.increase=function(t,s){this.show();this.setProgress(this.progress+t,s);},s.prototype.decrease=function(t,s){this.show();this.setProgress(this.progress-t,s);},s.prototype.finish=function(t){var s=this;this.setProgress(100,t);this.hide();if(i){this.progressBar.addEventListener(i,function(t){s.reset();s.progressBar.removeEventListener(t.type,TP);});}},s.prototype.reset=function(t){this.progress=0;this.transit();if(t){t();}},s.prototype.hide=function(){this.progressBar.style.opacity="0";},s.prototype.show=function(){this.progressBar.style.opacity="1";},s;};return TP();}());root.ToProgress=ToProgress;}("undefined" !== typeof window ? window : this,document));
/*!
 * start progress indicator
 */
/* (function (root) {
	"use strict";
	root.progressBar = new ToProgress({
			id: "top-progress-bar",
			color: "#FF2C40",
			height: "0.200rem",
			duration: 0.2
		});
	root.progressBar.increase(20);
	root.hideProgressBar = function () {
		root.progressBar.finish();
		root.progressBar.hide();
	};
	root.addEventListener("load", hideProgressBar);
}
	("undefined" !== typeof window ? window : this)); */
/*!
 * app logic
 */
(function (root, document) {
	"use strict";
	var gEBCN = "getElementsByClassName";
	var gA = "getAttribute";
	var supportsSvgAsImg = document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image", "1.1") || "";
	var toStringFn = {}.toString;
	var supportsSvgSmilAnimation = !!document.createElementNS &&
		(/SVGAnimate/).test(toStringFn.call(document.createElementNS("http://www.w3.org/2000/svg", "animate"))) || "";
	if (!supportsSvgAsImg) {
		var svgNosmilImages = document[gEBCN]("svg-nosmil-img") || "";
		if (svgNosmilImages) {
			var i;
			for (i = 0; i < svgNosmilImages.length; i += 1) {
				svgNosmilImages[i].src = svgNosmilImages[i][gA]("data-fallback-src");
			}
			i = null;
		}
	}
	if (!supportsSvgSmilAnimation) {
		var svgSmilImages = document[gEBCN]("svg-smil-img") || "";
		if (svgSmilImages) {
			var j;
			for (j = 0; j < svgSmilImages.length; j += 1) {
				svgSmilImages[j].src = svgSmilImages[j][gA]("data-fallback-src");
			}
			j = null;
		}
	}
	var gEBTN = "getElementsByTagName";
	var drawImageFromUrl = function (canvasObj, url) {
		if (!url) {
			return;
		}
		if (!canvasObj) {
			return;
		}
		var img = new Image();
		img.onload = function () {
			var ctx = canvasObj.getContext("2d");
			if (ctx) {
				ctx.drawImage(img, 0, 0, canvasObj.width, canvasObj.height);
			}
		};
		img.src = url;
	};
	var canvasAll = document[gEBTN]("canvas") || "";
	var cssnum = document.styleSheets.length || 0;
	var slot;
	var drawCanvasAll = function () {
		if (document.styleSheets.length > cssnum) {
			clearInterval(slot);
			slot = null;
			var i;
			for (i = 0; i < canvasAll.length; i += 1) {
				if (canvasAll[i][gA]("data-src")) {
					drawImageFromUrl(canvasAll[i], canvasAll[i][gA]("data-src"));
				}
			}
			i = null;
		}
	};
	if (canvasAll && cssnum) {
		slot = setInterval(drawCanvasAll, 100);
	}
	var cN = "className";
	var pN = "parentNode";
	var ripple = document[gEBCN]("ripple")[0] || "";
	var rippleParent = ripple ? ripple[pN] || "" : "";
	var timer3;
	var removeRipple = function () {
		clearTimeout(timer3);
		timer3 = null;
		if (ripple && rippleParent) {
			rippleParent.removeChild(ripple);
		}
	};
	var wrapper = document[gEBCN]("wrapper")[0] || "";
	var slot2;
	var hideRipple = function () {
		if (imagesPreloaded) {
			clearInterval(slot2);
			slot2 = null;
			/* if (wrapper) {
				wrapper.style.opacity = 1;
			} */
			if (ripple) {
				ripple[cN] += " bounceOutUp";
			}
			timer3 = setTimeout(removeRipple, 5000);
			/* progressBar.increase(20); */
		}
	};
	if ("undefined" !== typeof imagesPreloaded) {
		slot2 = setInterval(hideRipple, 100);
	}
	var hasTouch = "ontouchstart" in document.documentElement ? true : false;
	var hasWheel = "onwheel" in document.createElement("div") || void 0 !== document.onmousewheel ? true : false;
	var run = function () {
		var cL = "classList";
		var cE = "createElement";
		var aC = "appendChild";
		/* progressBar.increase(20); */
		var qrcode = document[gEBCN]("qrcode")[0] || "";
		var timer;
		var showQrcode = function () {
			clearTimeout(timer);
			timer = null;
			qrcode.style.visibility = "visible";
			qrcode.style.opacity = 1;
		};
		if (qrcode) {
			var locationHref = root.location.href || "";
			var qrcodeImg = document[cE]("img");
			var qrcodeImgTitle = document.title ? ("Ссылка на страницу «" + document.title.replace(/\[[^\]]*?\]/g, "").trim() + "»") : "";
			var qrcodeImgSrc = "//chart.googleapis.com/chart?cht=qr&chld=M%7C4&choe=UTF-8&chs=300x300&chl=" + encodeURIComponent(locationHref);
			qrcodeImg.alt = qrcodeImgTitle;
			if (root.QRCode) {
				if (document.implementation.hasFeature("http://www.w3.org/2000/svg", "1.1")) {
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
					qrcodeImg.src = qrcodeImgSrc;
				} else {
					qrcodeImgSrc = QRCode.generatePNG(locationHref, {
							ecclevel: "M",
							format: "html",
							fillcolor: "#FFFFFF",
							textcolor: "#1F1F1F",
							margin: 4,
							modulesize: 8
						});
					qrcodeImg.src = qrcodeImgSrc;
				}
			} else {
				qrcodeImg.src = qrcodeImgSrc;
			}
			qrcodeImg.title = qrcodeImgTitle;
			qrcode[aC](qrcodeImg);
			timer = setTimeout(showQrcode, 2000);
		}
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
		}();
		var gEBTN = "getElementsByTagName";
		var downloadApp = document[gEBCN]("download-app")[0] || "";
		var downloadAppLink = downloadApp ? downloadApp[gEBTN]("a")[0] || "" : "";
		var downloadAppImg = downloadApp ? downloadApp[gEBTN]("img")[0] || "" : "";
		var navigatorUserAgent = navigator.userAgent || "";
		if (navigatorUserAgent && downloadApp && downloadAppLink && downloadAppImg && root.platform) {
			var downloadAppImgSrc;
			var downloadAppLinkHref;
			var platformName = platform.name || "";
			var platformDescription = platform.description || "";
			document.title = document.title +
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
			var timer2;
			var showDownloadApp = function () {
				clearTimeout(timer2);
				timer2 = null;
				downloadApp.style.visibility = "visible";
				downloadApp.style.opacity = 1;
			};
			if (downloadAppImgSrc && downloadAppLinkHref) {
				downloadAppLink.href = downloadAppLinkHref;
				downloadAppLink.rel = "noopener";
				downloadAppLink.target = "_blank";
				downloadAppLink.title = "Скачать приложение";
				if (!supportsSvgAsImg) {
					downloadAppImgSrc = downloadAppImgSrc.slice(0, -3) + "png";
				}
				downloadAppImg.src = downloadAppImgSrc;
				timer2 = setTimeout(showDownloadApp, 1000);
			}
		}
		var gEBI = "getElementById";
		var ds = "dataset";
		var aEL = "addEventListener";
		var scene = document[gEBI]("scene") || "";
		var parallax;
		if (scene && root.Parallax) {
			parallax = new Parallax(scene);
		}
		var guesture = document[gEBCN]("guesture")[0] || "";
		var revealStart = function () {
			var start = document[gEBCN]("start")[0] || "";
			var hand = document[gEBCN]("hand")[0] || "";
			if (start) {
				start[cL].add("bounceInUp");
				start.style.display = "block";
			}
			if (hand) {
				hand[cL].add("bounceInUp");
				hand.style.display = "block";
			}
			if (guesture) {
				guesture[cL].add("bounceOutUp");
			}
		};
		if (wrapper) {
			var mousewheeldown = document[gEBCN]("mousewheeldown")[0] || "";
			var swipeup = document[gEBCN]("swipeup")[0] || "";
			if (hasTouch) {
				mousewheeldown.style.display = "none";
			} else {
				if (hasWheel) {
					swipeup.style.display = "none";
				}
			}
			if (hasTouch || hasWheel) {
				guesture[cL].add("bounceInUp");
				guesture.style.display = "block";
			}
			if (root.WheelIndicator) {
				var indicator;
				indicator = new WheelIndicator({
						elem: wrapper,
						callback: function (e) {
							if ("down" === e.direction) {
								revealStart();
							}
						},
						preventMouse: false
					});
			}
			if (root.tocca) {
				root[aEL]("swipeup", revealStart, supportsPassive ? { passive: true } : false);
			}
		}
		var hideOtherIsSocial = function (_this) {
			_this = _this || this;
			var isSocialAll = document[gEBCN]("is-social") || "";
			if (isSocialAll) {
				var k;
				for (k = 0; k < isSocialAll.length; k += 1) {
					if (_this !== isSocialAll[k]) {
						isSocialAll[k][cL].remove("is-active");
					}
				}
				k = null;
			}
		};
		root[aEL]("click", hideOtherIsSocial);
		var btnShare = document[gEBCN]("btn-share")[0] || "";
		var btnShareLink = btnShare ? btnShare[gEBTN]("a")[0] || "" : "";
		var yaShare2 = document[gEBCN]("ya-share2")[0] || "";
		var yshare;
		var showShareButtons = function (ev) {
			ev.preventDefault();
			ev.stopPropagation();
			yaShare2[cL].toggle("is-active");
			hideOtherIsSocial(yaShare2);
			var initScript = function () {
				if (root.Ya) {
					try {
						if (yshare) {
							yshare.updateContent({
								title: document.title || "",
								description: document.title || "",
								url: root.location.href || ""
							});
						} else {
							yshare = Ya.share2(yaShare2Id, {
								content: {
									title: document.title || "",
									description: document.title || "",
									url: root.location.href || ""
								}
							});
						}
					} catch (err) {
						/* console.log("cannot update or init Ya.share2", err); */
					}
				}
			};
			var jsUrl = "//yastatic.net/share2/share.js";
			if (!scriptIsLoaded(jsUrl)) {
				var load;
				load = new loadJsCss([jsUrl], initScript);
			} else {
				initScript();
			}
		};
		if (btnShareLink && yaShare2) {
			btnShareLink[aEL]("click", showShareButtons);
		}
		var btnLike = document[gEBCN]("btn-like")[0] || "";
		var btnLikeLink = btnLike ? btnLike[gEBTN]("a")[0] || "" : "";
		var vkLike = document[gEBCN]("vk-like")[0] || "";
		var showVkLike = function (ev) {
			ev.preventDefault();
			ev.stopPropagation();
			vkLike[cL].toggle("is-active");
			hideOtherIsSocial(vkLike);
			var initScript = function () {
				if (vkLike && root.VK) {
					try {
						VK.init({
							apiId: (vkLike[ds].apiid || ""),
							nameTransportPath: "/xd_receiver.htm",
							onlyWidgets: true
						});
						VK.Widgets.Like("vk-like", {
							type: "button",
							height: 24
						});
					} catch (err) {
						/* console.log("cannot init VK", err); */
					}
				}
			};
			var jsUrl = "//vk.com/js/api/openapi.js?147";
			if (!scriptIsLoaded(jsUrl)) {
				var load;
				load = new loadJsCss([jsUrl], initScript);
			}
		};
		if (btnLikeLink && vkLike) {
			btnLikeLink[aEL]("click", showVkLike);
		}
	};
	var scriptsArray = ["//fonts.googleapis.com/css?family=PT+Serif:400,400i%7CRoboto:400,700%7CRoboto+Condensed:700&subset=cyrillic",
		"./libs/john-locke/css/bundle.min.css",
		"//cdnjs.cloudflare.com/ajax/libs/github-fork-ribbon-css/0.2.0/gh-fork-ribbon.min.css"];
	if (!("classList" in document.createElement("_"))) {
		scriptsArray.push("//cdn.jsdelivr.net/npm/classlist.js@1.1.20150312/classList.min.js");
	}
	if (("undefined" === typeof window.Element && !("dataset" in document.documentElement))) {
		scriptsArray.push("//cdn.jsdelivr.net/npm/element-dataset@2.2.6/lib/browser/index.cjs.min.js");
	}
	var supportsPassive = function () {
		try {
			var opts = Object.defineProperty({}, "passive", {
					get: function () {
						return true;
					}
				});
			root.addEventListener("test", null, opts);
		} catch (err) {
			/* console.log(err); */
		}
		return false;
	}
	();
	if (!supportsPassive) {
		scriptsArray.push("//cdnjs.cloudflare.com/ajax/libs/dom4/1.8.3/dom4.js");
	}
	scriptsArray.push("//cdn.jsdelivr.net/npm/parallax-js@3.1.0/dist/parallax.min.js",
		"//cdn.jsdelivr.net/npm/qrjs2@0.1.3/qrjs2.min.js",
		"//cdn.jsdelivr.net/npm/platform@1.3.4/platform.min.js");
	if (hasWheel) {
		/* scriptsArray.push("//cdn.jsdelivr.net/npm/wheel-indicator@1.1.4/lib/wheel-indicator.min.js"); */
		scriptsArray.push("./cdn/wheel-indicator/1.1.4/js/wheel-indicator-passive.fixed.min.js");
	}
	if (hasTouch) {
		scriptsArray.push("//cdnjs.cloudflare.com/ajax/libs/Tocca.js/2.0.1/Tocca.min.js");
	}
	var load;
	load = new loadJsCss(scriptsArray, run);
}
	("undefined" !== typeof window ? window : this, document));
