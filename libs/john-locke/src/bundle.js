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
 * check for passive support
 * @see {@link https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md#feature-detection}
 */
(function (root) {
	"use strict";
	root.supportsPassive = false;
	try {
		var opts = Object.defineProperty({}, "passive", {
				get: function () {
					root.supportsPassive = true;
				}
			});
		root.addEventListener("test", null, opts);
	} catch (err) {
		console.log(err);
	}
}
	("undefined" !== typeof window ? window : this));
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
		if (ripple && rippleParent) {
			rippleParent.removeChild(ripple);
		}
	};
	var wrapper = document[gEBCN]("wrapper")[0] || "";
	var slot;
	var hideRipple = function () {
		if (imagesPreloaded) {
			clearInterval(slot);
			slot = null;
			/* if (wrapper) {
				wrapper.style.opacity = 1;
			} */
			if (ripple) {
				ripple[cL].add("bounceOutUp");
			}
			timer3 = setTimeout(removeRipple, 5000);
			/* progressBar.increase(20); */
		}
	};
	if ("undefined" !== typeof imagesPreloaded) {
		slot = setInterval(hideRipple, 100);
	}
	var hasTouch = "ontouchstart" in document.documentElement ? true : false;
	var hasWheel = "onwheel" in document.documentElement ? true : false;
	var gEBI = "getElementById";
	var vkLike = document[gEBI]("vk-like") || "";
	var run = function () {
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
		var start = document[gEBCN]("start")[0] || "";
		var hand = document[gEBCN]("hand")[0] || "";
		var revealStart = function () {
			if (start) {
				start[cL].add("bounceInUp");
				start.style.display = "block";
			}
			if (hand) {
				hand[cL].add("bounceInUp");
				hand.style.display = "block";
			}
		};
		if (wrapper) {
			if (root.WheelIndicator) {
				var indicator;
				indicator = new WheelIndicator({
						elem: wrapper,
						callback: function (e) {
							if ("down" === e.direction) {
								revealStart();
							}
						}
					});
			}
			if (root.tocca) {
				root[aEL]("swipeup", revealStart, supportsPassive ? { passive: true } : false);
			}
		}
	};
	var scriptsArray = ["//fonts.googleapis.com/css?family=PT+Serif:400,400i%7CRoboto:400,700%7CRoboto+Condensed:700&amp;subset=cyrillic",
		"./libs/john-locke/css/bundle.min.css",
		"//cdnjs.cloudflare.com/ajax/libs/github-fork-ribbon-css/0.2.0/gh-fork-ribbon.min.css",
		"//cdn.rawgit.com/kimmobrunfeldt/progressbar.js/0.5.6/dist/progressbar.js"];
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
