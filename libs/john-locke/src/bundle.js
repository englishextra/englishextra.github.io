(function (root, document) {
	"use strict";
	var aEL = "addEventListener";
	var gEBI = "getElementById";
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
	var slot;
	var hideRipple = function () {
		if (imagesPreloaded) {
			clearInterval(slot);
			slot = null;
			var wrapper = document[gEBCN]("wrapper")[0] || "";
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
	var vkLike = document[gEBI]("vk-like") || "";
	var handleWindow = function () {
		var gEBTN = "getElementsByTagName";
		var ds = "dataset";
		var gA = "getAttribute";
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
			var qrcodeImgTitle = document.title ? ("—сылка на страницу Ђ" + document.title.replace(/\[[^\]]*?\]/g, "").trim() + "ї") : "";
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
		var downloadApp = document[gEBCN]("download-app")[0] || "";
		var downloadAppLink = downloadApp ? downloadApp[gEBTN]("a")[0] || "" : "";
		var downloadAppImg = downloadApp ? downloadApp[gEBTN]("img")[0] || "" : "";
		var navigatorUserAgent = navigator.userAgent || "";
		if (navigatorUserAgent && downloadApp && downloadAppLink && downloadAppImg) {
			var downloadAppImgSrc;
			var downloadAppLinkHref;
			if (/Windows/i.test(navigatorUserAgent) && /(WOW64|Win64)/i.test(navigatorUserAgent)) {
				downloadAppImgSrc = "./libs/products/img/download_windows_app_144x52.png";
				downloadAppLinkHref = "https://github.com/englishextra/englishextra-app/releases/download/v1.0.0/englishextra-win32-x64-setup.exe";
			} else if (/(x86_64|x86-64|x64;|amd64|AMD64|x64_64)/i.test(navigatorUserAgent) && /(Linux|X11)/i.test(navigatorUserAgent)) {
				downloadAppImgSrc = "./libs/products/img/download_linux_app_144x52.png";
				downloadAppLinkHref = "https://github.com/englishextra/englishextra-app/releases/download/v1.0.0/englishextra-linux-x64.tar.gz";
			} else if (/IEMobile/i.test(navigatorUserAgent)) {
				downloadAppImgSrc = "./libs/products/img/download_wp_app_144x52.png";
				downloadAppLinkHref = "https://github.com/englishextra/englishextra-app/releases/download/v1.0.0/englishextra.Windows10_1.0.0.0_x86_debug.appx";
			} else {
				if (/Android/i.test(navigatorUserAgent)) {
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
				downloadAppLink.rel = "external";
				downloadAppLink.target = "_blank";
				downloadAppLink.title = "—качать приложение";
				downloadAppImg.src = downloadAppImgSrc;
				timer2 = setTimeout(showDownloadApp, 1000);
			}
		}
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
		var scene = document[gEBI]("scene") || "";
		var parallax;
		if (scene && root.Parallax) {
			parallax = new Parallax(scene);
		}
	};
	root[aEL]("load", handleWindow);
}
	("undefined" !== typeof window ? window : this, document));
