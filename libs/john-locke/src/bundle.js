/*!
 * modified To load JS and CSS files with vanilla JavaScript
 * @see {@link https://gist.github.com/Aymkdn/98acfbb46fbe7c1f00cdd3c753520ea8}
 * @see {@link https://gist.github.com/englishextra/ff9dc7ab002312568742861cb80865c9}
 */
(function(root,document){"use strict";var loadJsCss=function(files,callback){var _this=this;_this.files=files;_this.js=[];_this.head=document.getElementsByTagName("head")[0]||"";_this.body=document.body||"";_this.ref=document.getElementsByTagName("script")[0]||"";_this.callback=callback||function(){};_this.loadStyle=function(file){var link=document.createElement("link");link.rel="stylesheet";link.type="text/css";link.href=file;_this.head.appendChild(link);};_this.loadScript=function(i){var script=document.createElement("script");script.type="text/javascript";script.async=true;script.src=_this.js[i];var loadNextScript=function(){if(++i<_this.js.length){_this.loadScript(i);}else{_this.callback();}};script.onload=function(){loadNextScript();};_this.head.appendChild(script);if(_this.ref.parentNode){_this.ref.parentNode.insertBefore(script,_this.ref);}else{(_this.body||_this.head).appendChild(script);}};var i,l;for(i=0,l=_this.files.length;i<l;i+=1){if((/\.js$|\.js\?/).test(_this.files[i])){_this.js.push(_this.files[i]);}if((/\.css$|\.css\?|\/css\?/).test(_this.files[i])){_this.loadStyle(_this.files[i]);}}i=null;l=null;if(_this.js.length>0){_this.loadScript(0);}else{_this.after();}};root.loadJsCss=loadJsCss;}("undefined" !== typeof window ? window : this,document));
/*!
 * @see {@link https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md#feature-detection}
 */
var supportsPassive = false;
try {
	var opts = Object.defineProperty({}, "passive", {
			get: function () {
				supportsPassive = true;
			}
		});
	root.addEventListener("test", null, opts);
} catch (e) {}
/*!
 * app logic
 */
(function (root, document) {
	"use strict";
	var gEBCN = "getElementsByClassName";
	var cL = "classList";
	var pN = "parentNode";
	var ripple = document[gEBCN]("ripple")[0] || "";
	var rippleParent = ripple ? ripple[pN] || "" : "";
	var timer3;
	var removeRipple = function () {
		clearTimeout(timer3);
		timer3 = null;
		rippleParent.removeChild(ripple);
	};
	var wrapper = document[gEBCN]("wrapper")[0] || "";
	var slot;
	var hideRipple = function () {
		if (imagesPreloaded) {
			clearInterval(slot);
			slot = null;
			if (wrapper) {
				wrapper.style.opacity = 1;
			}
			ripple[cL].add("bounceOutUp");
			timer3 = setTimeout(removeRipple, 5000);
		}
	};
	if (ripple && rippleParent && "undefined" !== typeof imagesPreloaded) {
		if (rippleParent) {
			slot = setInterval(hideRipple, 100);
		}
	}
	var hasTouch = "ontouchstart" in document.documentElement ? true : false;
	var hasWheel = "onwheel" in document.documentElement ? true : false;
	var gEBI = "getElementById";
	var vkLike = document[gEBI]("vk-like") || "";
	var run = function () {
		var cE = "createElement";
		var aC = "appendChild";
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
				downloadAppImgSrc = "./libs/products/img/download_wp_app_144x52.png";
				downloadAppLinkHref = "https://github.com/englishextra/englishextra-app/releases/download/v1.0.0/englishextra.Windows10_1.0.0.0_x86_debug.appx";
			} else if (platformName.indexOf("IE Mobile", 0) !== -1 && ("7.5" === platformOsVersion || "8.0" === platformOsVersion || "8.1" === platformOsVersion)) {
				downloadAppImgSrc = "./libs/products/img/download_wp_app_144x52.png";
				downloadAppLinkHref = "https://github.com/englishextra/englishextra-app/releases/download/v1.0.0/englishextra_app-debug.xap";
			} else if (platformOsFamily.indexOf("Windows", 0) !== -1 && 64 === platformOsArchitecture) {
				downloadAppImgSrc = "./libs/products/img/download_windows_app_144x52.png";
				downloadAppLinkHref = "https://github.com/englishextra/englishextra-app/releases/download/v1.0.0/englishextra-win32-x64-setup.exe";
			} else if (platformOsFamily.indexOf("Windows", 0) !== -1 && 32 === platformOsArchitecture) {
				downloadAppImgSrc = "./libs/products/img/download_windows_app_144x52.png";
				downloadAppLinkHref = "https://github.com/englishextra/englishextra-app/releases/download/v1.0.0/englishextra-win32-ia32-setup.exe";
			} else if (navigatorUserAgent.indexOf("armv7l", 0) !== -1) {
				downloadAppImgSrc = "./libs/products/img/download_linux_app_144x52.png";
				downloadAppLinkHref = "https://github.com/englishextra/englishextra-app/releases/download/v1.0.0/englishextra-linux-armv7l.tar.gz";
			} else if (navigatorUserAgent.indexOf("X11", 0) !== -1 && navigatorUserAgent.indexOf("Linux") !== -1 && 64 === platformOsArchitecture) {
				downloadAppImgSrc = "./libs/products/img/download_linux_app_144x52.png";
				downloadAppLinkHref = "https://github.com/englishextra/englishextra-app/releases/download/v1.0.0/englishextra-linux-x64.tar.gz";
			} else if (navigatorUserAgent.indexOf("X11", 0) !== -1 && navigatorUserAgent.indexOf("Linux") !== -1 && 32 === platformOsArchitecture) {
				downloadAppImgSrc = "./libs/products/img/download_linux_app_144x52.png";
				downloadAppLinkHref = "https://github.com/englishextra/englishextra-app/releases/download/v1.0.0/englishextra-linux-ia32.tar.gz";
			} else {
				if (platformOsFamily.indexOf("Android", 0) !== -1) {
					downloadAppImgSrc = "./libs/products/img/download_android_app_144x52.png";
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
				downloadAppImg.src = downloadAppImgSrc;
				timer2 = setTimeout(showDownloadApp, 1000);
			}
		}
		var ds = "dataset";
		var gA = "getAttribute";
		if (vkLike && root.VK) {
			try {
				VK.init({
					apiId: (vkLike[ds].apiid || vkLike[gA]("data-apiid") || ""),
					nameTransportPath: "/xd_receiver.htm",
					onlyWidgets: true
				});
				VK.Widgets.Like("vk-like", {
					type: "button",
					height: 24
				});
			} catch (err) {
				console.log("cannot init VK", err);
			}
		}
		var aEL = "addEventListener";
		var scene = document[gEBI]("scene") || "";
		var parallax;
		if (scene && root.Parallax) {
			parallax = new Parallax(scene);
		}
		var changeLocationToContents = function () {
			root.location = "./pages/contents.html";
		};
		if (wrapper) {
			if (root.WheelIndicator) {
				var indicator;
				indicator = new WheelIndicator({
						elem: wrapper,
						callback: function (e) {
							if ("down" === e.direction) {
								changeLocationToContents();
							}
						}
					});
			}
			if (root.tocca) {
				root[aEL]("swipeup", changeLocationToContents, supportsPassive ? { passive: true } : false);
			}
		}
	};
	var scriptsArray = ["//fonts.googleapis.com/css?family=PT+Serif:400,400i%7CRoboto:400,700%7CRoboto+Condensed:700&amp;subset=cyrillic",
		"./libs/john-locke/css/bundle.min.css",
		"//cdnjs.cloudflare.com/ajax/libs/github-fork-ribbon-css/0.2.0/gh-fork-ribbon.min.css"];
	if (!("classList" in document.createElement("_"))) {
		scriptsArray.push("//cdn.jsdelivr.net/npm/classlist.js@1.1.20150312/classList.min.js");
	}
	if (("undefined" === typeof window.Element && !("dataset" in document.documentElement))) {
		scriptsArray.push("//cdn.jsdelivr.net/npm/classlist.js@1.1.20150312/classList.min.js");
	}
	if (!supportsPassive) {
		scriptsArray.push("//cdnjs.cloudflare.com/ajax/libs/dom4/1.8.3/dom4.js");
	}
	scriptsArray.push("//cdn.jsdelivr.net/npm/parallax-js@3.1.0/dist/parallax.min.js",
		"//cdn.jsdelivr.net/npm/qrjs2@0.1.3/qrjs2.min.js",
		"//cdn.jsdelivr.net/npm/platform@1.3.4/platform.min.js");
	if (hasWheel) {
		/* scriptsArray.push("//cdn.jsdelivr.net/npm/wheel-indicator@1.1.4/lib/wheel-indicator.min.js"); */
		scriptsArray.push("./cdn/wheel-indicator/1.1.4/js/wheel-indicator.fixed.min.js");
	}
	if (hasTouch) {
		scriptsArray.push("//cdnjs.cloudflare.com/ajax/libs/Tocca.js/2.0.1/Tocca.min.js");
	}
	if (vkLike) {
		scriptsArray.push("//vk.com/js/api/openapi.js?147");
	}
	var yaShare2 = document[gEBCN]("ya-share2")[0] || "";
	if (yaShare2) {
		scriptsArray.push("//yastatic.net/share2/share.js");
	}
	var load;
	load = new loadJsCss(scriptsArray, run);
}
	("undefined" !== typeof window ? window : this, document));
