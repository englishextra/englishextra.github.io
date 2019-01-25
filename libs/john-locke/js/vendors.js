function _typeof(obj) {
	if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
		_typeof = function _typeof(obj) {
			return typeof obj;
		};
	} else {
		_typeof = function _typeof(obj) {
			return obj &&
				typeof Symbol === "function" &&
				obj.constructor === Symbol &&
				obj !== Symbol.prototype
				? "symbol"
				: typeof obj;
		};
	}
	return _typeof(obj);
}

/*!
 * Platform.js <https://mths.be/platform>
 * Copyright 2014-2016 Benjamin Tan <https://demoneaux.github.io/>
 * Copyright 2011-2013 John-David Dalton <http://allyoucanleet.com/>
 * Available under MIT license <https://mths.be/mit>
 */

/* jshint ignore:start */
(function() {
	"use strict";

	var objectTypes = {
		function: true,
		object: true
	};
	var root =
		(objectTypes[
			typeof window === "undefined" ? "undefined" : _typeof(window)
		] &&
			window) ||
		this;
	var oldRoot = root;
	var freeExports =
		objectTypes[
			typeof exports === "undefined" ? "undefined" : _typeof(exports)
		] && exports;
	var freeModule =
		objectTypes[
			typeof module === "undefined" ? "undefined" : _typeof(module)
		] &&
		module &&
		!module.nodeType &&
		module;
	var freeGlobal =
		freeExports &&
		freeModule &&
		(typeof global === "undefined" ? "undefined" : _typeof(global)) ==
			"object" &&
		global;

	if (
		freeGlobal &&
		(freeGlobal.global === freeGlobal ||
			freeGlobal.window === freeGlobal ||
			freeGlobal.self === freeGlobal)
	) {
		root = freeGlobal;
	}

	var maxSafeInteger = Math.pow(2, 53) - 1;
	var reOpera = /\bOpera/;
	var thisBinding = this;
	var objectProto = Object.prototype;
	var hasOwnProperty = objectProto.hasOwnProperty;
	var toString = objectProto.toString;

	function capitalize(string) {
		string = String(string);
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	function cleanupOS(os, pattern, label) {
		var data = {
			"10.0": "10",
			"6.4": "10 Technical Preview",
			"6.3": "8.1",
			"6.2": "8",
			"6.1": "Server 2008 R2 / 7",
			"6.0": "Server 2008 / Vista",
			"5.2": "Server 2003 / XP 64-bit",
			"5.1": "XP",
			"5.01": "2000 SP1",
			"5.0": "2000",
			"4.0": "NT",
			"4.90": "ME"
		};

		if (
			pattern &&
			label &&
			/^Win/i.test(os) &&
			!/^Windows Phone /i.test(os) &&
			(data = data[/[\d.]+$/.exec(os)])
		) {
			os = "Windows " + data;
		}

		os = String(os);

		if (pattern && label) {
			os = os.replace(RegExp(pattern, "i"), label);
		}

		os = format(
			os
				.replace(/ ce$/i, " CE")
				.replace(/\bhpw/i, "web")
				.replace(/\bMacintosh\b/, "Mac OS")
				.replace(/_PowerPC\b/i, " OS")
				.replace(/\b(OS X) [^ \d]+/i, "$1")
				.replace(/\bMac (OS X)\b/, "$1")
				.replace(/\/(\d)/, " $1")
				.replace(/_/g, ".")
				.replace(/(?: BePC|[ .]*fc[ \d.]+)$/i, "")
				.replace(/\bx86\.64\b/gi, "x86_64")
				.replace(/\b(Windows Phone) OS\b/, "$1")
				.replace(/\b(Chrome OS \w+) [\d.]+\b/, "$1")
				.split(" on ")[0]
		);
		return os;
	}

	function each(object, callback) {
		var index = -1,
			length = object ? object.length : 0;

		if (
			typeof length == "number" &&
			length > -1 &&
			length <= maxSafeInteger
		) {
			while (++index < length) {
				callback(object[index], index, object);
			}
		} else {
			forOwn(object, callback);
		}
	}

	function format(string) {
		string = trim(string);
		return /^(?:webOS|i(?:OS|P))/.test(string)
			? string
			: capitalize(string);
	}

	function forOwn(object, callback) {
		for (var key in object) {
			if (hasOwnProperty.call(object, key)) {
				callback(object[key], key, object);
			}
		}
	}

	function getClassOf(value) {
		return value == null
			? capitalize(value)
			: toString.call(value).slice(8, -1);
	}

	function isHostType(object, property) {
		var type = object != null ? _typeof(object[property]) : "number";
		return (
			!/^(?:boolean|number|string|undefined)$/.test(type) &&
			(type == "object" ? !!object[property] : true)
		);
	}

	function qualify(string) {
		return String(string).replace(/([ -])(?!$)/g, "$1?");
	}

	function reduce(array, callback) {
		var accumulator = null;
		each(array, function(value, index) {
			accumulator = callback(accumulator, value, index, array);
		});
		return accumulator;
	}

	function trim(string) {
		return String(string).replace(/^ +| +$/g, "");
	}

	function parse(ua) {
		var context = root;
		var isCustomContext =
			ua && _typeof(ua) == "object" && getClassOf(ua) != "String";

		if (isCustomContext) {
			context = ua;
			ua = null;
		}

		var nav = context.navigator || {};
		var userAgent = nav.userAgent || "";
		ua || (ua = userAgent);
		var isModuleScope = isCustomContext || thisBinding == oldRoot;
		var likeChrome = isCustomContext
			? !!nav.likeChrome
			: /\bChrome\b/.test(ua) &&
			  !/internal|\n/i.test(toString.toString());
		var objectClass = "Object",
			airRuntimeClass = isCustomContext
				? objectClass
				: "ScriptBridgingProxyObject",
			enviroClass = isCustomContext ? objectClass : "Environment",
			javaClass =
				isCustomContext && context.java
					? "JavaPackage"
					: getClassOf(context.java),
			phantomClass = isCustomContext ? objectClass : "RuntimeObject";
		var java = /\bJava/.test(javaClass) && context.java;
		var rhino = java && getClassOf(context.environment) == enviroClass;
		var alpha = java ? "a" : "\u03B1";
		var beta = java ? "b" : "\u03B2";
		var doc = context.document || {};
		var opera = context.operamini || context.opera;
		var operaClass = reOpera.test(
			(operaClass =
				isCustomContext && opera
					? opera["[[Class]]"]
					: getClassOf(opera))
		)
			? operaClass
			: (opera = null);
		var data;
		var arch = ua;
		var description = [];
		var prerelease = null;
		var useFeatures = ua == userAgent;
		var version =
			useFeatures &&
			opera &&
			typeof opera.version == "function" &&
			opera.version();
		var isSpecialCasedOS;
		var layout = getLayout([
			{
				label: "EdgeHTML",
				pattern: "Edge"
			},
			"Trident",
			{
				label: "WebKit",
				pattern: "AppleWebKit"
			},
			"iCab",
			"Presto",
			"NetFront",
			"Tasman",
			"KHTML",
			"Gecko"
		]);
		var name = getName([
			"Adobe AIR",
			"Arora",
			"Avant Browser",
			"Breach",
			"Camino",
			"Electron",
			"Epiphany",
			"Fennec",
			"Flock",
			"Galeon",
			"GreenBrowser",
			"iCab",
			"Iceweasel",
			"K-Meleon",
			"Konqueror",
			"Lunascape",
			"Maxthon",
			{
				label: "Microsoft Edge",
				pattern: "Edge"
			},
			"Midori",
			"Nook Browser",
			"PaleMoon",
			"PhantomJS",
			"Raven",
			"Rekonq",
			"RockMelt",
			{
				label: "Samsung Internet",
				pattern: "SamsungBrowser"
			},
			"SeaMonkey",
			{
				label: "Silk",
				pattern: "(?:Cloud9|Silk-Accelerated)"
			},
			"Sleipnir",
			"SlimBrowser",
			{
				label: "SRWare Iron",
				pattern: "Iron"
			},
			"Sunrise",
			"Swiftfox",
			"Waterfox",
			"WebPositive",
			"Opera Mini",
			{
				label: "Opera Mini",
				pattern: "OPiOS"
			},
			"Opera",
			{
				label: "Opera",
				pattern: "OPR"
			},
			"Chrome",
			{
				label: "Chrome Mobile",
				pattern: "(?:CriOS|CrMo)"
			},
			{
				label: "Firefox",
				pattern: "(?:Firefox|Minefield)"
			},
			{
				label: "Firefox for iOS",
				pattern: "FxiOS"
			},
			{
				label: "IE",
				pattern: "IEMobile"
			},
			{
				label: "IE",
				pattern: "MSIE"
			},
			"Safari"
		]);
		var product = getProduct([
			{
				label: "BlackBerry",
				pattern: "BB10"
			},
			"BlackBerry",
			{
				label: "Galaxy S",
				pattern: "GT-I9000"
			},
			{
				label: "Galaxy S2",
				pattern: "GT-I9100"
			},
			{
				label: "Galaxy S3",
				pattern: "GT-I9300"
			},
			{
				label: "Galaxy S4",
				pattern: "GT-I9500"
			},
			{
				label: "Galaxy S5",
				pattern: "SM-G900"
			},
			{
				label: "Galaxy S6",
				pattern: "SM-G920"
			},
			{
				label: "Galaxy S6 Edge",
				pattern: "SM-G925"
			},
			{
				label: "Galaxy S7",
				pattern: "SM-G930"
			},
			{
				label: "Galaxy S7 Edge",
				pattern: "SM-G935"
			},
			"Google TV",
			"Lumia",
			"iPad",
			"iPod",
			"iPhone",
			"Kindle",
			{
				label: "Kindle Fire",
				pattern: "(?:Cloud9|Silk-Accelerated)"
			},
			"Nexus",
			"Nook",
			"PlayBook",
			"PlayStation Vita",
			"PlayStation",
			"TouchPad",
			"Transformer",
			{
				label: "Wii U",
				pattern: "WiiU"
			},
			"Wii",
			"Xbox One",
			{
				label: "Xbox 360",
				pattern: "Xbox"
			},
			"Xoom"
		]);
		var manufacturer = getManufacturer({
			Apple: {
				iPad: 1,
				iPhone: 1,
				iPod: 1
			},
			Archos: {},
			Amazon: {
				Kindle: 1,
				"Kindle Fire": 1
			},
			Asus: {
				Transformer: 1
			},
			"Barnes & Noble": {
				Nook: 1
			},
			BlackBerry: {
				PlayBook: 1
			},
			Google: {
				"Google TV": 1,
				Nexus: 1
			},
			HP: {
				TouchPad: 1
			},
			HTC: {},
			LG: {},
			Microsoft: {
				Xbox: 1,
				"Xbox One": 1
			},
			Motorola: {
				Xoom: 1
			},
			Nintendo: {
				"Wii U": 1,
				Wii: 1
			},
			Nokia: {
				Lumia: 1
			},
			Samsung: {
				"Galaxy S": 1,
				"Galaxy S2": 1,
				"Galaxy S3": 1,
				"Galaxy S4": 1
			},
			Sony: {
				PlayStation: 1,
				"PlayStation Vita": 1
			}
		});
		var os = getOS([
			"Windows Phone",
			"Android",
			"CentOS",
			{
				label: "Chrome OS",
				pattern: "CrOS"
			},
			"Debian",
			"Fedora",
			"FreeBSD",
			"Gentoo",
			"Haiku",
			"Kubuntu",
			"Linux Mint",
			"OpenBSD",
			"Red Hat",
			"SuSE",
			"Ubuntu",
			"Xubuntu",
			"Cygwin",
			"Symbian OS",
			"hpwOS",
			"webOS ",
			"webOS",
			"Tablet OS",
			"Tizen",
			"Linux",
			"Mac OS X",
			"Macintosh",
			"Mac",
			"Windows 98;",
			"Windows "
		]);

		function getLayout(guesses) {
			return reduce(guesses, function(result, guess) {
				return (
					result ||
					(RegExp(
						"\\b" + (guess.pattern || qualify(guess)) + "\\b",
						"i"
					).exec(ua) &&
						(guess.label || guess))
				);
			});
		}

		function getManufacturer(guesses) {
			return reduce(guesses, function(result, value, key) {
				return (
					result ||
					((value[product] ||
						value[/^[a-z]+(?: +[a-z]+\b)*/i.exec(product)] ||
						RegExp(
							"\\b" + qualify(key) + "(?:\\b|\\w*\\d)",
							"i"
						).exec(ua)) &&
						key)
				);
			});
		}

		function getName(guesses) {
			return reduce(guesses, function(result, guess) {
				return (
					result ||
					(RegExp(
						"\\b" + (guess.pattern || qualify(guess)) + "\\b",
						"i"
					).exec(ua) &&
						(guess.label || guess))
				);
			});
		}

		function getOS(guesses) {
			return reduce(guesses, function(result, guess) {
				var pattern = guess.pattern || qualify(guess);

				if (
					!result &&
					(result = RegExp(
						"\\b" + pattern + "(?:/[\\d.]+|[ \\w.]*)",
						"i"
					).exec(ua))
				) {
					result = cleanupOS(result, pattern, guess.label || guess);
				}

				return result;
			});
		}

		function getProduct(guesses) {
			return reduce(guesses, function(result, guess) {
				var pattern = guess.pattern || qualify(guess);

				if (
					!result &&
					(result =
						RegExp("\\b" + pattern + " *\\d+[.\\w_]*", "i").exec(
							ua
						) ||
						RegExp("\\b" + pattern + " *\\w+-[\\w]*", "i").exec(
							ua
						) ||
						RegExp(
							"\\b" +
								pattern +
								"(?:; *(?:[a-z]+[_-])?[a-z]+\\d+|[^ ();-]*)",
							"i"
						).exec(ua))
				) {
					if (
						(result = String(
							guess.label &&
								!RegExp(pattern, "i").test(guess.label)
								? guess.label
								: result
						).split("/"))[1] &&
						!/[\d.]+/.test(result[0])
					) {
						result[0] += " " + result[1];
					}

					guess = guess.label || guess;
					result = format(
						result[0]
							.replace(RegExp(pattern, "i"), guess)
							.replace(
								RegExp("; *(?:" + guess + "[_-])?", "i"),
								" "
							)
							.replace(
								RegExp("(" + guess + ")[-_.]?(\\w)", "i"),
								"$1 $2"
							)
					);
				}

				return result;
			});
		}

		function getVersion(patterns) {
			return reduce(patterns, function(result, pattern) {
				return (
					result ||
					(RegExp(
						pattern +
							"(?:-[\\d.]+/|(?: for [\\w-]+)?[ /-])([\\d.]+[^ ();/_-]*)",
						"i"
					).exec(ua) || 0)[1] ||
					null
				);
			});
		}

		function toStringPlatform() {
			return this.description || "";
		}

		layout && (layout = [layout]);

		if (manufacturer && !product) {
			product = getProduct([manufacturer]);
		}

		if ((data = /\bGoogle TV\b/.exec(product))) {
			product = data[0];
		}

		if (/\bSimulator\b/i.test(ua)) {
			product = (product ? product + " " : "") + "Simulator";
		}

		if (name == "Opera Mini" && /\bOPiOS\b/.test(ua)) {
			description.push("running in Turbo/Uncompressed mode");
		}

		if (name == "IE" && /\blike iPhone OS\b/.test(ua)) {
			data = parse(ua.replace(/like iPhone OS/, ""));
			manufacturer = data.manufacturer;
			product = data.product;
		} else if (/^iP/.test(product)) {
			name || (name = "Safari");
			os =
				"iOS" +
				((data = / OS ([\d_]+)/i.exec(ua))
					? " " + data[1].replace(/_/g, ".")
					: "");
		} else if (name == "Konqueror" && !/buntu/i.test(os)) {
			os = "Kubuntu";
		} else if (
			(manufacturer &&
				manufacturer != "Google" &&
				((/Chrome/.test(name) && !/\bMobile Safari\b/i.test(ua)) ||
					/\bVita\b/.test(product))) ||
			(/\bAndroid\b/.test(os) &&
				/^Chrome/.test(name) &&
				/\bVersion\//i.test(ua))
		) {
			name = "Android Browser";
			os = /\bAndroid\b/.test(os) ? os : "Android";
		} else if (name == "Silk") {
			if (!/\bMobi/i.test(ua)) {
				os = "Android";
				description.unshift("desktop mode");
			}

			if (/Accelerated *= *true/i.test(ua)) {
				description.unshift("accelerated");
			}
		} else if (
			name == "PaleMoon" &&
			(data = /\bFirefox\/([\d.]+)\b/.exec(ua))
		) {
			description.push("identifying as Firefox " + data[1]);
		} else if (
			name == "Firefox" &&
			(data = /\b(Mobile|Tablet|TV)\b/i.exec(ua))
		) {
			os || (os = "Firefox OS");
			product || (product = data[1]);
		} else if (
			!name ||
			(data =
				!/\bMinefield\b/i.test(ua) &&
				/\b(?:Firefox|Safari)\b/.exec(name))
		) {
			if (
				name &&
				!product &&
				/[\/,]|^[^(]+?\)/.test(ua.slice(ua.indexOf(data + "/") + 8))
			) {
				name = null;
			}

			if (
				(data = product || manufacturer || os) &&
				(product ||
					manufacturer ||
					/\b(?:Android|Symbian OS|Tablet OS|webOS)\b/.test(os))
			) {
				name =
					/[a-z]+(?: Hat)?/i.exec(
						/\bAndroid\b/.test(os) ? os : data
					) + " Browser";
			}
		} else if (
			name == "Electron" &&
			(data = (/\bChrome\/([\d.]+)\b/.exec(ua) || 0)[1])
		) {
			description.push("Chromium " + data);
		}

		if (!version) {
			version = getVersion([
				"(?:Cloud9|CriOS|CrMo|Edge|FxiOS|IEMobile|Iron|Opera ?Mini|OPiOS|OPR|Raven|SamsungBrowser|Silk(?!/[\\d.]+$))",
				"Version",
				qualify(name),
				"(?:Firefox|Minefield|NetFront)"
			]);
		}

		if (
			(data =
				(layout == "iCab" && parseFloat(version) > 3 && "WebKit") ||
				(/\bOpera\b/.test(name) &&
					(/\bOPR\b/.test(ua) ? "Blink" : "Presto")) ||
				(/\b(?:Midori|Nook|Safari)\b/i.test(ua) &&
					!/^(?:Trident|EdgeHTML)$/.test(layout) &&
					"WebKit") ||
				(!layout &&
					/\bMSIE\b/i.test(ua) &&
					(os == "Mac OS" ? "Tasman" : "Trident")) ||
				(layout == "WebKit" &&
					/\bPlayStation\b(?! Vita\b)/i.test(name) &&
					"NetFront"))
		) {
			layout = [data];
		}

		if (
			name == "IE" &&
			(data = (/; *(?:XBLWP|ZuneWP)(\d+)/i.exec(ua) || 0)[1])
		) {
			name += " Mobile";
			os = "Windows Phone " + (/\+$/.test(data) ? data : data + ".x");
			description.unshift("desktop mode");
		} else if (/\bWPDesktop\b/i.test(ua)) {
			name = "IE Mobile";
			os = "Windows Phone 8.x";
			description.unshift("desktop mode");
			version || (version = (/\brv:([\d.]+)/.exec(ua) || 0)[1]);
		} else if (
			name != "IE" &&
			layout == "Trident" &&
			(data = /\brv:([\d.]+)/.exec(ua))
		) {
			if (name) {
				description.push(
					"identifying as " + name + (version ? " " + version : "")
				);
			}

			name = "IE";
			version = data[1];
		}

		if (useFeatures) {
			if (isHostType(context, "global")) {
				if (java) {
					data = java.lang.System;
					arch = data.getProperty("os.arch");
					os =
						os ||
						data.getProperty("os.name") +
							" " +
							data.getProperty("os.version");
				}

				if (
					isModuleScope &&
					isHostType(context, "system") &&
					(data = [context.system])[0]
				) {
					os || (os = data[0].os || null);

					try {
						data[1] = context.require("ringo/engine").version;
						version = data[1].join(".");
						name = "RingoJS";
					} catch (e) {
						if (data[0].global.system == context.system) {
							name = "Narwhal";
						}
					}
				} else if (
					_typeof(context.process) == "object" &&
					!context.process.browser &&
					(data = context.process)
				) {
					if (_typeof(data.versions) == "object") {
						if (typeof data.versions.electron == "string") {
							description.push("Node " + data.versions.node);
							name = "Electron";
							version = data.versions.electron;
						} else if (typeof data.versions.nw == "string") {
							description.push(
								"Chromium " + version,
								"Node " + data.versions.node
							);
							name = "NW.js";
							version = data.versions.nw;
						}
					} else {
						name = "Node.js";
						arch = data.arch;
						os = data.platform;
						version = /[\d.]+/.exec(data.version);
						version = version ? version[0] : "unknown";
					}
				} else if (rhino) {
					name = "Rhino";
				}
			} else if (
				getClassOf((data = context.runtime)) == airRuntimeClass
			) {
				name = "Adobe AIR";
				os = data.flash.system.Capabilities.os;
			} else if (getClassOf((data = context.phantom)) == phantomClass) {
				name = "PhantomJS";
				version =
					(data = data.version || null) &&
					data.major + "." + data.minor + "." + data.patch;
			} else if (
				typeof doc.documentMode == "number" &&
				(data = /\bTrident\/(\d+)/i.exec(ua))
			) {
				version = [version, doc.documentMode];

				if ((data = +data[1] + 4) != version[1]) {
					description.push("IE " + version[1] + " mode");
					layout && (layout[1] = "");
					version[1] = data;
				}

				version =
					name == "IE" ? String(version[1].toFixed(1)) : version[0];
			} else if (
				typeof doc.documentMode == "number" &&
				/^(?:Chrome|Firefox)\b/.test(name)
			) {
				description.push("masking as " + name + " " + version);
				name = "IE";
				version = "11.0";
				layout = ["Trident"];
				os = "Windows";
			}

			os = os && format(os);
		}

		if (
			version &&
			(data =
				/(?:[ab]|dp|pre|[ab]\d+pre)(?:\d+\+?)?$/i.exec(version) ||
				/(?:alpha|beta)(?: ?\d)?/i.exec(
					ua + ";" + (useFeatures && nav.appMinorVersion)
				) ||
				(/\bMinefield\b/i.test(ua) && "a"))
		) {
			prerelease = /b/i.test(data) ? "beta" : "alpha";
			version =
				version.replace(RegExp(data + "\\+?$"), "") +
				(prerelease == "beta" ? beta : alpha) +
				(/\d+\+?/.exec(data) || "");
		}

		if (
			name == "Fennec" ||
			(name == "Firefox" && /\b(?:Android|Firefox OS)\b/.test(os))
		) {
			name = "Firefox Mobile";
		} else if (name == "Maxthon" && version) {
			version = version.replace(/\.[\d.]+/, ".x");
		} else if (/\bXbox\b/i.test(product)) {
			if (product == "Xbox 360") {
				os = null;
			}

			if (product == "Xbox 360" && /\bIEMobile\b/.test(ua)) {
				description.unshift("mobile mode");
			}
		} else if (
			(/^(?:Chrome|IE|Opera)$/.test(name) ||
				(name && !product && !/Browser|Mobi/.test(name))) &&
			(os == "Windows CE" || /Mobi/i.test(ua))
		) {
			name += " Mobile";
		} else if (name == "IE" && useFeatures) {
			try {
				if (context.external === null) {
					description.unshift("platform preview");
				}
			} catch (e) {
				description.unshift("embedded");
			}
		} else if (
			(/\bBlackBerry\b/.test(product) || /\bBB10\b/.test(ua)) &&
			(data =
				(RegExp(product.replace(/ +/g, " *") + "/([.\\d]+)", "i").exec(
					ua
				) || 0)[1] || version)
		) {
			data = [data, /BB10/.test(ua)];
			os =
				(data[1]
					? ((product = null), (manufacturer = "BlackBerry"))
					: "Device Software") +
				" " +
				data[0];
			version = null;
		} else if (
			this != forOwn &&
			product != "Wii" &&
			((useFeatures && opera) ||
				(/Opera/.test(name) && /\b(?:MSIE|Firefox)\b/i.test(ua)) ||
				(name == "Firefox" && /\bOS X (?:\d+\.){2,}/.test(os)) ||
				(name == "IE" &&
					((os && !/^Win/.test(os) && version > 5.5) ||
						(/\bWindows XP\b/.test(os) && version > 8) ||
						(version == 8 && !/\bTrident\b/.test(ua))))) &&
			!reOpera.test(
				(data = parse.call(forOwn, ua.replace(reOpera, "") + ";"))
			) &&
			data.name
		) {
			data =
				"ing as " +
				data.name +
				((data = data.version) ? " " + data : "");

			if (reOpera.test(name)) {
				if (/\bIE\b/.test(data) && os == "Mac OS") {
					os = null;
				}

				data = "identify" + data;
			} else {
				data = "mask" + data;

				if (operaClass) {
					name = format(
						operaClass.replace(/([a-z])([A-Z])/g, "$1 $2")
					);
				} else {
					name = "Opera";
				}

				if (/\bIE\b/.test(data)) {
					os = null;
				}

				if (!useFeatures) {
					version = null;
				}
			}

			layout = ["Presto"];
			description.push(data);
		}

		if ((data = (/\bAppleWebKit\/([\d.]+\+?)/i.exec(ua) || 0)[1])) {
			data = [parseFloat(data.replace(/\.(\d)$/, ".0$1")), data];

			if (name == "Safari" && data[1].slice(-1) == "+") {
				name = "WebKit Nightly";
				prerelease = "alpha";
				version = data[1].slice(0, -1);
			} else if (
				version == data[1] ||
				version ==
					(data[2] = (/\bSafari\/([\d.]+\+?)/i.exec(ua) || 0)[1])
			) {
				version = null;
			}

			data[1] = (/\bChrome\/([\d.]+)/i.exec(ua) || 0)[1];

			if (
				data[0] == 537.36 &&
				data[2] == 537.36 &&
				parseFloat(data[1]) >= 28 &&
				layout == "WebKit"
			) {
				layout = ["Blink"];
			}

			if (!useFeatures || (!likeChrome && !data[1])) {
				layout && (layout[1] = "like Safari");
				data = ((data = data[0]),
				data < 400
					? 1
					: data < 500
					? 2
					: data < 526
					? 3
					: data < 533
					? 4
					: data < 534
					? "4+"
					: data < 535
					? 5
					: data < 537
					? 6
					: data < 538
					? 7
					: data < 601
					? 8
					: "8");
			} else {
				layout && (layout[1] = "like Chrome");
				data =
					data[1] ||
					((data = data[0]),
					data < 530
						? 1
						: data < 532
						? 2
						: data < 532.05
						? 3
						: data < 533
						? 4
						: data < 534.03
						? 5
						: data < 534.07
						? 6
						: data < 534.1
						? 7
						: data < 534.13
						? 8
						: data < 534.16
						? 9
						: data < 534.24
						? 10
						: data < 534.3
						? 11
						: data < 535.01
						? 12
						: data < 535.02
						? "13+"
						: data < 535.07
						? 15
						: data < 535.11
						? 16
						: data < 535.19
						? 17
						: data < 536.05
						? 18
						: data < 536.1
						? 19
						: data < 537.01
						? 20
						: data < 537.11
						? "21+"
						: data < 537.13
						? 23
						: data < 537.18
						? 24
						: data < 537.24
						? 25
						: data < 537.36
						? 26
						: layout != "Blink"
						? "27"
						: "28");
			}

			layout &&
				(layout[1] +=
					" " +
					(data +=
						typeof data == "number"
							? ".x"
							: /[.+]/.test(data)
							? ""
							: "+"));

			if (name == "Safari" && (!version || parseInt(version) > 45)) {
				version = data;
			}
		}

		if (name == "Opera" && (data = /\bzbov|zvav$/.exec(os))) {
			name += " ";
			description.unshift("desktop mode");

			if (data == "zvav") {
				name += "Mini";
				version = null;
			} else {
				name += "Mobile";
			}

			os = os.replace(RegExp(" *" + data + "$"), "");
		} else if (name == "Safari" && /\bChrome\b/.exec(layout && layout[1])) {
			description.unshift("desktop mode");
			name = "Chrome Mobile";
			version = null;

			if (/\bOS X\b/.test(os)) {
				manufacturer = "Apple";
				os = "iOS 4.3+";
			} else {
				os = null;
			}
		}

		if (
			version &&
			version.indexOf((data = /[\d.]+$/.exec(os))) == 0 &&
			ua.indexOf("/" + data + "-") > -1
		) {
			os = trim(os.replace(data, ""));
		}

		if (
			layout &&
			!/\b(?:Avant|Nook)\b/.test(name) &&
			(/Browser|Lunascape|Maxthon/.test(name) ||
				(name != "Safari" &&
					/^iOS/.test(os) &&
					/\bSafari\b/.test(layout[1])) ||
				(/^(?:Adobe|Arora|Breach|Midori|Opera|Phantom|Rekonq|Rock|Samsung Internet|Sleipnir|Web)/.test(
					name
				) &&
					layout[1]))
		) {
			(data = layout[layout.length - 1]) && description.push(data);
		}

		if (description.length) {
			description = ["(" + description.join("; ") + ")"];
		}

		if (manufacturer && product && product.indexOf(manufacturer) < 0) {
			description.push("on " + manufacturer);
		}

		if (product) {
			description.push(
				(/^on /.test(description[description.length - 1])
					? ""
					: "on ") + product
			);
		}

		if (os) {
			data = / ([\d.+]+)$/.exec(os);
			isSpecialCasedOS =
				data && os.charAt(os.length - data[0].length - 1) == "/";
			os = {
				architecture: 32,
				family:
					data && !isSpecialCasedOS ? os.replace(data[0], "") : os,
				version: data ? data[1] : null,
				toString: function toString() {
					var version = this.version;
					return (
						this.family +
						(version && !isSpecialCasedOS ? " " + version : "") +
						(this.architecture == 64 ? " 64-bit" : "")
					);
				}
			};
		}

		if (
			(data = /\b(?:AMD|IA|Win|WOW|x86_|x)64\b/i.exec(arch)) &&
			!/\bi686\b/i.test(arch)
		) {
			if (os) {
				os.architecture = 64;
				os.family = os.family.replace(RegExp(" *" + data), "");
			}

			if (
				name &&
				(/\bWOW64\b/i.test(ua) ||
					(useFeatures &&
						/\w(?:86|32)$/.test(nav.cpuClass || nav.platform) &&
						!/\bWin64; x64\b/i.test(ua)))
			) {
				description.unshift("32-bit");
			}
		} else if (
			os &&
			/^OS X/.test(os.family) &&
			name == "Chrome" &&
			parseFloat(version) >= 39
		) {
			os.architecture = 64;
		}

		ua || (ua = null);
		var platform = {};
		platform.description = ua;
		platform.layout = layout && layout[0];
		platform.manufacturer = manufacturer;
		platform.name = name;
		platform.prerelease = prerelease;
		platform.product = product;
		platform.ua = ua;
		platform.version = name && version;
		platform.os = os || {
			architecture: null,
			family: null,
			version: null,
			toString: function toString() {
				return "null";
			}
		};
		platform.parse = parse;
		platform.toString = toStringPlatform;

		if (platform.version) {
			description.unshift(version);
		}

		if (platform.name) {
			description.unshift(name);
		}

		if (
			os &&
			name &&
			!(
				os == String(os).split(" ")[0] &&
				(os == name.split(" ")[0] || product)
			)
		) {
			description.push(product ? "(" + os + ")" : "on " + os);
		}

		if (description.length) {
			platform.description = description.join(" ");
		}

		return platform;
	}

	var platform = parse();

	if (
		typeof define == "function" &&
		_typeof(define.amd) == "object" &&
		define.amd
	) {
		root.platform = platform;
		define(function() {
			return platform;
		});
	} else if (freeExports && freeModule) {
		forOwn(platform, function(value, key) {
			freeExports[key] = value;
		});
	} else {
		root.platform = platform;
	}
}.call(this));
/* jshint ignore:end */

!(function(t, i, e) {
	"use strict";

	function s(t, i) {
		(this.element = t), (this.layers = t.getElementsByClassName("layer"));
		var e = {
			calibrateX: this.data(this.element, "calibrate-x"),
			calibrateY: this.data(this.element, "calibrate-y"),
			invertX: this.data(this.element, "invert-x"),
			invertY: this.data(this.element, "invert-y"),
			limitX: this.data(this.element, "limit-x"),
			limitY: this.data(this.element, "limit-y"),
			scalarX: this.data(this.element, "scalar-x"),
			scalarY: this.data(this.element, "scalar-y"),
			frictionX: this.data(this.element, "friction-x"),
			frictionY: this.data(this.element, "friction-y"),
			originX: this.data(this.element, "origin-x"),
			originY: this.data(this.element, "origin-y"),
			pointerEvents: this.data(this.element, "pointer-events"),
			precision: this.data(this.element, "precision")
		};

		for (var s in e) {
			null === e[s] && delete e[s];
		}

		this.extend(this, r, i, e),
			(this.calibrationTimer = null),
			(this.calibrationFlag = !0),
			(this.enabled = !1),
			(this.depthsX = []),
			(this.depthsY = []),
			(this.raf = null),
			(this.bounds = null),
			(this.ex = 0),
			(this.ey = 0),
			(this.ew = 0),
			(this.eh = 0),
			(this.ecx = 0),
			(this.ecy = 0),
			(this.erx = 0),
			(this.ery = 0),
			(this.cx = 0),
			(this.cy = 0),
			(this.ix = 0),
			(this.iy = 0),
			(this.mx = 0),
			(this.my = 0),
			(this.vx = 0),
			(this.vy = 0),
			(this.onMouseMove = this.onMouseMove.bind(this)),
			(this.onDeviceOrientation = this.onDeviceOrientation.bind(this)),
			(this.onOrientationTimer = this.onOrientationTimer.bind(this)),
			(this.onCalibrationTimer = this.onCalibrationTimer.bind(this)),
			(this.onAnimationFrame = this.onAnimationFrame.bind(this)),
			(this.onWindowResize = this.onWindowResize.bind(this)),
			this.initialise();
	}

	var o = "Parallax",
		n = 30,
		r = {
			relativeInput: !1,
			clipRelativeInput: !1,
			calibrationThreshold: 100,
			calibrationDelay: 500,
			supportDelay: 500,
			calibrateX: !1,
			calibrateY: !0,
			invertX: !0,
			invertY: !0,
			limitX: !1,
			limitY: !1,
			scalarX: 10,
			scalarY: 10,
			frictionX: 0.1,
			frictionY: 0.1,
			originX: 0.5,
			originY: 0.5,
			pointerEvents: !0,
			precision: 1
		};
	(s.prototype.extend = function() {
		if (arguments.length > 1)
			for (
				var t = arguments[0], i = 1, e = arguments.length;
				e > i;
				i++
			) {
				var s = arguments[i];

				for (var o in s) {
					s.hasOwnProperty(o) && (t[o] = s[o]);
				}
			}
	}),
		(s.prototype.data = function(t, i) {
			return this.deserialize(t.getAttribute("data-" + i));
		}),
		(s.prototype.deserialize = function(t) {
			return "true" === t
				? !0
				: "false" === t
				? !1
				: "null" === t
				? null
				: !isNaN(parseFloat(t)) && isFinite(t)
				? parseFloat(t)
				: t;
		}),
		(s.prototype.camelCase = function(t) {
			return t.replace(/-+(.)?/g, function(t, i) {
				return i ? i.toUpperCase() : "";
			});
		}),
		(s.prototype.transformSupport = function(s) {
			for (
				var o = i.createElement("div"),
					n = !1,
					r = null,
					a = !1,
					h = null,
					l = null,
					p = 0,
					c = this.vendors.length;
				c > p;
				p++
			) {
				if (
					(null !== this.vendors[p]
						? ((h = this.vendors[p][0] + "transform"),
						  (l = this.vendors[p][1] + "Transform"))
						: ((h = "transform"), (l = "transform")),
					o.style[l] !== e)
				) {
					n = !0;
					break;
				}
			}

			switch (s) {
				case "2D":
					a = n;
					break;

				case "3D":
					if (n) {
						var m = i.body || i.createElement("body"),
							u = i.documentElement,
							y = u.style.overflow,
							d = !1;
						i.body ||
							((d = !0),
							(u.style.overflow = "hidden"),
							u.appendChild(m),
							(m.style.overflow = "hidden"),
							(m.style.background = "")),
							m.appendChild(o),
							(o.style[l] = "translate3d(1px,1px,1px)"),
							(r = t.getComputedStyle(o).getPropertyValue(h)),
							(a = r !== e && r.length > 0 && "none" !== r),
							(u.style.overflow = y),
							m.removeChild(o),
							d &&
								(m.removeAttribute("style"),
								m.parentNode.removeChild(m));
					}
			}

			return a;
		}),
		(s.prototype.ww = null),
		(s.prototype.wh = null),
		(s.prototype.wcx = null),
		(s.prototype.wcy = null),
		(s.prototype.wrx = null),
		(s.prototype.wry = null),
		(s.prototype.portrait = null),
		(s.prototype.desktop = !navigator.userAgent.match(
			/(iPhone|iPod|iPad|Android|BlackBerry|BB10|mobi|tablet|opera mini|nexus 7)/i
		)),
		(s.prototype.vendors = [
			null,
			["-webkit-", "webkit"],
			["-moz-", "Moz"],
			["-o-", "O"],
			["-ms-", "ms"]
		]),
		(s.prototype.motionSupport = !!t.DeviceMotionEvent),
		(s.prototype.orientationSupport = !!t.DeviceOrientationEvent),
		(s.prototype.orientationStatus = 0),
		(s.prototype.motionStatus = 0),
		(s.prototype.propertyCache = {}),
		(s.prototype.initialise = function() {
			s.prototype.transform2DSupport === e &&
				((s.prototype.transform2DSupport = s.prototype.transformSupport(
					"2D"
				)),
				(s.prototype.transform3DSupport = s.prototype.transformSupport(
					"3D"
				))),
				this.transform3DSupport && this.accelerate(this.element);
			var i = t.getComputedStyle(this.element);
			"static" === i.getPropertyValue("position") &&
				(this.element.style.position = "relative"),
				this.pointerEvents ||
					(this.element.style.pointerEvents = "none"),
				this.updateLayers(),
				this.updateDimensions(),
				this.enable(),
				this.queueCalibration(this.calibrationDelay);
		}),
		(s.prototype.updateLayers = function() {
			(this.layers = this.element.getElementsByClassName("layer")),
				(this.depthsX = []),
				(this.depthsY = []);

			for (var t = 0, i = this.layers.length; i > t; t++) {
				var e = this.layers[t];
				this.transform3DSupport && this.accelerate(e),
					(e.style.position = t ? "absolute" : "relative"),
					(e.style.display = "block"),
					(e.style.left = 0),
					(e.style.top = 0);
				var s = this.data(e, "depth") || 0;
				this.depthsX.push(this.data(e, "depth-x") || s),
					this.depthsY.push(this.data(e, "depth-y") || s);
			}
		}),
		(s.prototype.updateDimensions = function() {
			(this.ww = t.innerWidth),
				(this.wh = t.innerHeight),
				(this.wcx = this.ww * this.originX),
				(this.wcy = this.wh * this.originY),
				(this.wrx = Math.max(this.wcx, this.ww - this.wcx)),
				(this.wry = Math.max(this.wcy, this.wh - this.wcy));
		}),
		(s.prototype.updateBounds = function() {
			(this.bounds = this.element.getBoundingClientRect()),
				(this.ex = this.bounds.left),
				(this.ey = this.bounds.top),
				(this.ew = this.bounds.width),
				(this.eh = this.bounds.height),
				(this.ecx = this.ew * this.originX),
				(this.ecy = this.eh * this.originY),
				(this.erx = Math.max(this.ecx, this.ew - this.ecx)),
				(this.ery = Math.max(this.ecy, this.eh - this.ecy));
		}),
		(s.prototype.queueCalibration = function(t) {
			clearTimeout(this.calibrationTimer),
				(this.calibrationTimer = setTimeout(
					this.onCalibrationTimer,
					t
				));
		}),
		(s.prototype.enable = function() {
			this.enabled ||
				((this.enabled = !0),
				!this.desktop && this.orientationSupport
					? ((this.portrait = null),
					  t.addEventListener(
							"deviceorientation",
							this.onDeviceOrientation
					  ),
					  setTimeout(this.onOrientationTimer, this.supportDelay))
					: !this.desktop && this.motionSupport
					? ((this.portrait = null),
					  t.addEventListener("devicemotion", this.onDeviceMotion),
					  setTimeout(this.onMotionTimer, this.supportDelay))
					: ((this.cx = 0),
					  (this.cy = 0),
					  (this.portrait = !1),
					  t.addEventListener("mousemove", this.onMouseMove)),
				t.addEventListener("resize", this.onWindowResize),
				(this.raf = requestAnimationFrame(this.onAnimationFrame)));
		}),
		(s.prototype.disable = function() {
			this.enabled &&
				((this.enabled = !1),
				this.orientationSupport
					? t.removeEventListener(
							"deviceorientation",
							this.onDeviceOrientation
					  )
					: this.motionSupport
					? t.removeEventListener("devicemotion", this.onDeviceMotion)
					: t.removeEventListener("mousemove", this.onMouseMove),
				t.removeEventListener("resize", this.onWindowResize),
				cancelAnimationFrame(this.raf));
		}),
		(s.prototype.calibrate = function(t, i) {
			(this.calibrateX = t === e ? this.calibrateX : t),
				(this.calibrateY = i === e ? this.calibrateY : i);
		}),
		(s.prototype.invert = function(t, i) {
			(this.invertX = t === e ? this.invertX : t),
				(this.invertY = i === e ? this.invertY : i);
		}),
		(s.prototype.friction = function(t, i) {
			(this.frictionX = t === e ? this.frictionX : t),
				(this.frictionY = i === e ? this.frictionY : i);
		}),
		(s.prototype.scalar = function(t, i) {
			(this.scalarX = t === e ? this.scalarX : t),
				(this.scalarY = i === e ? this.scalarY : i);
		}),
		(s.prototype.limit = function(t, i) {
			(this.limitX = t === e ? this.limitX : t),
				(this.limitY = i === e ? this.limitY : i);
		}),
		(s.prototype.origin = function(t, i) {
			(this.originX = t === e ? this.originX : t),
				(this.originY = i === e ? this.originY : i);
		}),
		(s.prototype.clamp = function(t, i, e) {
			return (t = Math.max(t, i)), (t = Math.min(t, e));
		}),
		(s.prototype.css = function(t, i, s) {
			var o = this.propertyCache[i];
			if (!o)
				for (var n = 0, r = this.vendors.length; r > n; n++) {
					if (
						((o =
							null !== this.vendors[n]
								? this.camelCase(this.vendors[n][1] + "-" + i)
								: i),
						t.style[o] !== e)
					) {
						this.propertyCache[i] = o;
						break;
					}
				}
			t.style[o] = s;
		}),
		(s.prototype.accelerate = function(t) {
			this.css(t, "transform", "translate3d(0,0,0)"),
				this.css(t, "transform-style", "preserve-3d"),
				this.css(t, "backface-visibility", "hidden");
		}),
		(s.prototype.setPosition = function(t, i, e) {
			(i = i.toFixed(this.precision) + "px"),
				(e = e.toFixed(this.precision) + "px"),
				this.transform3DSupport
					? this.css(
							t,
							"transform",
							"translate3d(" + i + "," + e + ",0)"
					  )
					: this.transform2DSupport
					? this.css(t, "transform", "translate(" + i + "," + e + ")")
					: ((t.style.left = i), (t.style.top = e));
		}),
		(s.prototype.onOrientationTimer = function() {
			this.orientationSupport &&
				0 === this.orientationStatus &&
				(this.disable(), (this.orientationSupport = !1), this.enable());
		}),
		(s.prototype.onMotionTimer = function() {
			this.motionSupport &&
				0 === this.motionStatus &&
				(this.disable(), (this.motionSupport = !1), this.enable());
		}),
		(s.prototype.onCalibrationTimer = function() {
			this.calibrationFlag = !0;
		}),
		(s.prototype.onWindowResize = function() {
			this.updateDimensions();
		}),
		(s.prototype.onAnimationFrame = function() {
			this.updateBounds();
			var t = this.ix - this.cx,
				i = this.iy - this.cy;
			(Math.abs(t) > this.calibrationThreshold ||
				Math.abs(i) > this.calibrationThreshold) &&
				this.queueCalibration(0),
				this.portrait
					? ((this.mx = this.calibrateX ? i : this.iy),
					  (this.my = this.calibrateY ? t : this.ix))
					: ((this.mx = this.calibrateX ? t : this.ix),
					  (this.my = this.calibrateY ? i : this.iy)),
				(this.mx *= this.ew * (this.scalarX / 100)),
				(this.my *= this.eh * (this.scalarY / 100)),
				isNaN(parseFloat(this.limitX)) ||
					(this.mx = this.clamp(this.mx, -this.limitX, this.limitX)),
				isNaN(parseFloat(this.limitY)) ||
					(this.my = this.clamp(this.my, -this.limitY, this.limitY)),
				(this.vx += (this.mx - this.vx) * this.frictionX),
				(this.vy += (this.my - this.vy) * this.frictionY);

			for (var e = 0, s = this.layers.length; s > e; e++) {
				var o = this.layers[e],
					n = this.depthsX[e],
					r = this.depthsY[e],
					a = this.vx * n * (this.invertX ? -1 : 1),
					h = this.vy * r * (this.invertY ? -1 : 1);
				this.setPosition(o, a, h);
			}

			this.raf = requestAnimationFrame(this.onAnimationFrame);
		}),
		(s.prototype.rotate = function() {
			var t = (event.beta || 0) / n,
				i = (event.gamma || 0) / n,
				e = this.wh > this.ww;
			this.portrait !== e &&
				((this.portrait = e), (this.calibrationFlag = !0)),
				this.calibrationFlag &&
					((this.calibrationFlag = !1), (this.cx = t), (this.cy = i)),
				(this.ix = t),
				(this.iy = i);
		}),
		(s.prototype.onDeviceOrientation = function(t) {
			var i = t.beta,
				e = t.gamma;
			this.desktop ||
				null === i ||
				null === e ||
				((this.orientationStatus = 1), this.rotate(i, e));
		}),
		(s.prototype.onDeviceMotion = function(t) {
			var i = t.rotationRate.beta,
				e = t.rotationRate.gamma;
			this.desktop ||
				null === i ||
				null === e ||
				((this.motionStatus = 1), this.rotate(i, e));
		}),
		(s.prototype.onMouseMove = function(t) {
			var i = t.clientX,
				e = t.clientY;
			!this.orientationSupport && this.relativeInput
				? (this.clipRelativeInput &&
						((i = Math.max(i, this.ex)),
						(i = Math.min(i, this.ex + this.ew)),
						(e = Math.max(e, this.ey)),
						(e = Math.min(e, this.ey + this.eh))),
				  (this.ix = (i - this.ex - this.ecx) / this.erx),
				  (this.iy = (e - this.ey - this.ecy) / this.ery))
				: ((this.ix = (i - this.wcx) / this.wrx),
				  (this.iy = (e - this.wcy) / this.wry));
		}),
		(t[o] = s);
})(window, document);

/*!
 * modified qr.js -- QR code generator in Javascript (revision 2011-01-19)
 * Written by Kang Seonghoon <public+qrjs@mearie.org>.
 * v0.0.20110119
 * This source code is in the public domain; if your jurisdiction does not
 * recognize the public domain the terms of Creative Commons CC0 license
 * apply. In the other words, you can always do what you want.
 * added options properties: fillcolor and textcolor
 * svg now works in Edge 13 and IE 11
 * @see {@link https://gist.github.com/englishextra/b46969e3382ef737c611bb59d837220b}
 * @see {@link https://github.com/lifthrasiir/qr.js/blob/v0.0.20110119/qr.js}
 * passes jshint with suppressing comments
 */

/*jshint bitwise: false */
(function(root, document) {
	"use strict";

	var length = "length";
	var VERSIONS = [
		null,
		[[10, 7, 17, 13], [1, 1, 1, 1], []],
		[[16, 10, 28, 22], [1, 1, 1, 1], [4, 16]],
		[[26, 15, 22, 18], [1, 1, 2, 2], [4, 20]],
		[[18, 20, 16, 26], [2, 1, 4, 2], [4, 24]],
		[[24, 26, 22, 18], [2, 1, 4, 4], [4, 28]],
		[[16, 18, 28, 24], [4, 2, 4, 4], [4, 32]],
		[[18, 20, 26, 18], [4, 2, 5, 6], [4, 20, 36]],
		[[22, 24, 26, 22], [4, 2, 6, 6], [4, 22, 40]],
		[[22, 30, 24, 20], [5, 2, 8, 8], [4, 24, 44]],
		[[26, 18, 28, 24], [5, 4, 8, 8], [4, 26, 48]],
		[[30, 20, 24, 28], [5, 4, 11, 8], [4, 28, 52]],
		[[22, 24, 28, 26], [8, 4, 11, 10], [4, 30, 56]],
		[[22, 26, 22, 24], [9, 4, 16, 12], [4, 32, 60]],
		[[24, 30, 24, 20], [9, 4, 16, 16], [4, 24, 44, 64]],
		[[24, 22, 24, 30], [10, 6, 18, 12], [4, 24, 46, 68]],
		[[28, 24, 30, 24], [10, 6, 16, 17], [4, 24, 48, 72]],
		[[28, 28, 28, 28], [11, 6, 19, 16], [4, 28, 52, 76]],
		[[26, 30, 28, 28], [13, 6, 21, 18], [4, 28, 54, 80]],
		[[26, 28, 26, 26], [14, 7, 25, 21], [4, 28, 56, 84]],
		[[26, 28, 28, 30], [16, 8, 25, 20], [4, 32, 60, 88]],
		[[26, 28, 30, 28], [17, 8, 25, 23], [4, 26, 48, 70, 92]],
		[[28, 28, 24, 30], [17, 9, 34, 23], [4, 24, 48, 72, 96]],
		[[28, 30, 30, 30], [18, 9, 30, 25], [4, 28, 52, 76, 100]],
		[[28, 30, 30, 30], [20, 10, 32, 27], [4, 26, 52, 78, 104]],
		[[28, 26, 30, 30], [21, 12, 35, 29], [4, 30, 56, 82, 108]],
		[[28, 28, 30, 28], [23, 12, 37, 34], [4, 28, 56, 84, 112]],
		[[28, 30, 30, 30], [25, 12, 40, 34], [4, 32, 60, 88, 116]],
		[[28, 30, 30, 30], [26, 13, 42, 35], [4, 24, 48, 72, 96, 120]],
		[[28, 30, 30, 30], [28, 14, 45, 38], [4, 28, 52, 76, 100, 124]],
		[[28, 30, 30, 30], [29, 15, 48, 40], [4, 24, 50, 76, 102, 128]],
		[[28, 30, 30, 30], [31, 16, 51, 43], [4, 28, 54, 80, 106, 132]],
		[[28, 30, 30, 30], [33, 17, 54, 45], [4, 32, 58, 84, 110, 136]],
		[[28, 30, 30, 30], [35, 18, 57, 48], [4, 28, 56, 84, 112, 140]],
		[[28, 30, 30, 30], [37, 19, 60, 51], [4, 32, 60, 88, 116, 144]],
		[[28, 30, 30, 30], [38, 19, 63, 53], [4, 28, 52, 76, 100, 124, 148]],
		[[28, 30, 30, 30], [40, 20, 66, 56], [4, 22, 48, 74, 100, 126, 152]],
		[[28, 30, 30, 30], [43, 21, 70, 59], [4, 26, 52, 78, 104, 130, 156]],
		[[28, 30, 30, 30], [45, 22, 74, 62], [4, 30, 56, 82, 108, 134, 160]],
		[[28, 30, 30, 30], [47, 24, 77, 65], [4, 24, 52, 80, 108, 136, 164]],
		[[28, 30, 30, 30], [49, 25, 81, 68], [4, 28, 56, 84, 112, 140, 168]]
	];
	var MODE_TERMINATOR = 0;
	var MODE_NUMERIC = 1,
		MODE_ALPHANUMERIC = 2,
		MODE_OCTET = 4,
		MODE_KANJI = 8;
	var NUMERIC_REGEXP = /^\d*$/;
	var ALPHANUMERIC_REGEXP = /^[A-Za-z0-9 $%*+\-./:] * $ /;
	var ALPHANUMERIC_OUT_REGEXP = /^[A-Z0-9 $%*+\-./:] * $ /;
	var ECCLEVEL_L = 1,
		ECCLEVEL_M = 0,
		ECCLEVEL_Q = 3,
		ECCLEVEL_H = 2;
	var GF256_MAP = [],
		GF256_INVMAP = [-1];

	for (var i1 = 0, v = 1; i1 < 255; ++i1) {
		GF256_MAP.push(v);
		GF256_INVMAP[v] = i1;
		v = (v * 2) ^ (v >= 128 ? 0x11d : 0);
	}

	var GF256_GENPOLY = [[]];

	for (var i2 = 0; i2 < 30; ++i2) {
		var prevpoly = GF256_GENPOLY[i2],
			poly = [];

		for (var j1 = 0; j1 <= i2; ++j1) {
			var a = j1 < i2 ? GF256_MAP[prevpoly[j1]] : 0;
			var b = GF256_MAP[(i2 + (prevpoly[j1 - 1] || 0)) % 255];
			poly.push(GF256_INVMAP[a ^ b]);
		}

		GF256_GENPOLY.push(poly);
	}

	var ALPHANUMERIC_MAP = {};

	for (var i = 0; i < 45; ++i) {
		ALPHANUMERIC_MAP[
			"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:".charAt(i)
		] = i;
	}

	var MASKFUNCS = [
		function(i, j) {
			return (i + j) % 2 === 0;
		},
		function(i) {
			return i % 2 === 0;
		},
		function(i, j) {
			return j % 3 === 0;
		},
		function(i, j) {
			return (i + j) % 3 === 0;
		},
		function(i, j) {
			return (((i / 2) | 0) + ((j / 3) | 0)) % 2 === 0;
		},
		function(i, j) {
			return ((i * j) % 2) + ((i * j) % 3) === 0;
		},
		function(i, j) {
			return (((i * j) % 2) + ((i * j) % 3)) % 2 === 0;
		},
		function(i, j) {
			return (((i + j) % 2) + ((i * j) % 3)) % 2 === 0;
		}
	];

	var needsverinfo = function needsverinfo(ver) {
		return ver > 6;
	};

	var getsizebyver = function getsizebyver(ver) {
		return 4 * ver + 17;
	};

	var nfullbits = function nfullbits(ver) {
		var v = VERSIONS[ver];
		var nbits = 16 * ver * ver + 128 * ver + 64;

		if (needsverinfo(ver)) {
			nbits -= 36;
		}

		if (v[2][length]) {
			nbits -= 25 * v[2][length] * v[2][length] - 10 * v[2][length] - 55;
		}

		return nbits;
	};

	var ndatabits = function ndatabits(ver, ecclevel) {
		var nbits = nfullbits(ver) & ~7;
		var v = VERSIONS[ver];
		nbits -= 8 * v[0][ecclevel] * v[1][ecclevel];
		return nbits;
	};

	var ndatalenbits = function ndatalenbits(ver, mode) {
		switch (mode) {
			case MODE_NUMERIC:
				return ver < 10 ? 10 : ver < 27 ? 12 : 14;

			case MODE_ALPHANUMERIC:
				return ver < 10 ? 9 : ver < 27 ? 11 : 13;

			case MODE_OCTET:
				return ver < 10 ? 8 : 16;

			case MODE_KANJI:
				return ver < 10 ? 8 : ver < 27 ? 10 : 12;
		}
	};

	var getmaxdatalen = function getmaxdatalen(ver, mode, ecclevel) {
		var nbits = ndatabits(ver, ecclevel) - 4 - ndatalenbits(ver, mode);

		switch (mode) {
			case MODE_NUMERIC:
				return (
					((nbits / 10) | 0) * 3 +
					(nbits % 10 < 4 ? 0 : nbits % 10 < 7 ? 1 : 2)
				);

			case MODE_ALPHANUMERIC:
				return ((nbits / 11) | 0) * 2 + (nbits % 11 < 6 ? 0 : 1);

			case MODE_OCTET:
				return (nbits / 8) | 0;

			case MODE_KANJI:
				return (nbits / 13) | 0;
		}
	};

	var validatedata = function validatedata(mode, data) {
		switch (mode) {
			case MODE_NUMERIC:
				if (!data.match(NUMERIC_REGEXP)) {
					return null;
				}

				return data;

			case MODE_ALPHANUMERIC:
				if (!data.match(ALPHANUMERIC_REGEXP)) {
					return null;
				}

				return data.toUpperCase();

			case MODE_OCTET:
				if (typeof data === "string") {
					var newdata = [];

					for (var i = 0; i < data[length]; ++i) {
						var ch = data.charCodeAt(i);

						if (ch < 0x80) {
							newdata.push(ch);
						} else if (ch < 0x800) {
							newdata.push(0xc0 | (ch >> 6), 0x80 | (ch & 0x3f));
						} else if (ch < 0x10000) {
							newdata.push(
								0xe0 | (ch >> 12),
								0x80 | ((ch >> 6) & 0x3f),
								0x80 | (ch & 0x3f)
							);
						} else {
							newdata.push(
								0xf0 | (ch >> 18),
								0x80 | ((ch >> 12) & 0x3f),
								0x80 | ((ch >> 6) & 0x3f),
								0x80 | (ch & 0x3f)
							);
						}
					}

					return newdata;
				} else {
					return data;
				}
		}
	};

	var encode = function encode(ver, mode, data, maxbuflen) {
		var buf = [];
		var bits = 0,
			remaining = 8;
		var datalen = data[length];

		var pack = function pack(x, n) {
			if (n >= remaining) {
				buf.push(bits | (x >> (n -= remaining)));

				while (n >= 8) {
					buf.push((x >> (n -= 8)) & 255);
				}

				bits = 0;
				remaining = 8;
			}

			if (n > 0) {
				bits |= (x & ((1 << n) - 1)) << (remaining -= n);
			}
		};

		var nlenbits = ndatalenbits(ver, mode);
		pack(mode, 4);
		pack(datalen, nlenbits);

		switch (mode) {
			case MODE_NUMERIC:
				for (var i = 2; i < datalen; i += 3) {
					pack(parseInt(data.substring(i - 2, i + 1), 10), 10);
				}

				pack(
					parseInt(data.substring(i - 2), 10),
					[0, 4, 7][datalen % 3]
				);
				break;

			case MODE_ALPHANUMERIC:
				for (var i2 = 1; i2 < datalen; i2 += 2) {
					pack(
						ALPHANUMERIC_MAP[data.charAt(i2 - 1)] * 45 +
							ALPHANUMERIC_MAP[data.charAt(i2)],
						11
					);
				}

				if (datalen % 2 === 1) {
					pack(ALPHANUMERIC_MAP[data.charAt(i2 - 1)], 6);
				}

				break;

			case MODE_OCTET:
				for (var i3 = 0; i3 < datalen; ++i3) {
					pack(data[i3], 8);
				}

				break;
		}

		pack(MODE_TERMINATOR, 4);

		if (remaining < 8) {
			buf.push(bits);
		}

		while (buf[length] + 1 < maxbuflen) {
			buf.push(0xec, 0x11);
		}

		if (buf[length] < maxbuflen) {
			buf.push(0xec);
		}

		return buf;
	};

	var calculateecc = function calculateecc(poly, genpoly) {
		var modulus = poly.slice(0);
		var polylen = poly[length],
			genpolylen = genpoly[length];

		for (var k = 0; k < genpolylen; ++k) {
			modulus.push(0);
		}

		for (var i = 0; i < polylen; ) {
			var quotient = GF256_INVMAP[modulus[i++]];

			if (quotient >= 0) {
				for (var j = 0; j < genpolylen; ++j) {
					modulus[i + j] ^= GF256_MAP[(quotient + genpoly[j]) % 255];
				}
			}
		}

		return modulus.slice(polylen);
	};

	var augumenteccs = function augumenteccs(poly, nblocks, genpoly) {
		var subsizes = [];
		var subsize = (poly[length] / nblocks) | 0,
			subsize0 = 0;
		var pivot = nblocks - (poly[length] % nblocks);

		for (var i = 0; i < pivot; ++i) {
			subsizes.push(subsize0);
			subsize0 += subsize;
		}

		for (var i2 = pivot; i2 < nblocks; ++i2) {
			subsizes.push(subsize0);
			subsize0 += subsize + 1;
		}

		subsizes.push(subsize0);
		var eccs = [];

		for (var i3 = 0; i3 < nblocks; ++i3) {
			eccs.push(
				calculateecc(
					poly.slice(subsizes[i3], subsizes[i3 + 1]),
					genpoly
				)
			);
		}

		var result = [];
		var nitemsperblock = (poly[length] / nblocks) | 0;

		for (var i4 = 0; i4 < nitemsperblock; ++i4) {
			for (var j = 0; j < nblocks; ++j) {
				result.push(poly[subsizes[j] + i4]);
			}
		}

		for (var j2 = pivot; j2 < nblocks; ++j2) {
			result.push(poly[subsizes[j2 + 1] - 1]);
		}

		for (var i5 = 0; i5 < genpoly[length]; ++i5) {
			for (var j3 = 0; j3 < nblocks; ++j3) {
				result.push(eccs[j3][i5]);
			}
		}

		return result;
	};

	var augumentbch = function augumentbch(poly, p, genpoly, q) {
		var modulus = poly << q;

		for (var i = p - 1; i >= 0; --i) {
			if ((modulus >> (q + i)) & 1) {
				modulus ^= genpoly << i;
			}
		}

		return (poly << q) | modulus;
	};

	var makebasematrix = function makebasematrix(ver) {
		var v = VERSIONS[ver],
			n = getsizebyver(ver);
		var matrix = [],
			reserved = [];

		for (var i = 0; i < n; ++i) {
			matrix.push([]);
			reserved.push([]);
		}

		var blit = function blit(y, x, h, w, bits) {
			for (var i = 0; i < h; ++i) {
				for (var j = 0; j < w; ++j) {
					matrix[y + i][x + j] = (bits[i] >> j) & 1;
					reserved[y + i][x + j] = 1;
				}
			}
		};

		blit(0, 0, 9, 9, [
			0x7f,
			0x41,
			0x5d,
			0x5d,
			0x5d,
			0x41,
			0x17f,
			0x00,
			0x40
		]);
		blit(n - 8, 0, 8, 9, [0x100, 0x7f, 0x41, 0x5d, 0x5d, 0x5d, 0x41, 0x7f]);
		blit(0, n - 8, 9, 8, [
			0xfe,
			0x82,
			0xba,
			0xba,
			0xba,
			0x82,
			0xfe,
			0x00,
			0x00
		]);

		for (var i2 = 9; i2 < n - 8; ++i2) {
			matrix[6][i2] = matrix[i2][6] = ~i2 & 1;
			reserved[6][i2] = reserved[i2][6] = 1;
		}

		var aligns = v[2],
			m = aligns[length];

		for (var i3 = 0; i3 < m; ++i3) {
			var minj = i3 === 0 || i3 === m - 1 ? 1 : 0,
				maxj = i3 === 0 ? m - 1 : m;

			for (var j = minj; j < maxj; ++j) {
				blit(aligns[i3], aligns[j], 5, 5, [
					0x1f,
					0x11,
					0x15,
					0x11,
					0x1f
				]);
			}
		}

		if (needsverinfo(ver)) {
			var code = augumentbch(ver, 6, 0x1f25, 12);
			var k = 0;

			for (var i4 = 0; i4 < 6; ++i4) {
				for (var j2 = 0; j2 < 3; ++j2) {
					matrix[i4][n - 11 + j2] = matrix[n - 11 + j2][i4] =
						(code >> k++) & 1;
					reserved[i4][n - 11 + j2] = reserved[n - 11 + j2][i4] = 1;
				}
			}
		}

		return {
			matrix: matrix,
			reserved: reserved
		};
	};

	var putdata = function putdata(matrix, reserved, buf) {
		var n = matrix[length];
		var k = 0,
			dir = -1;

		for (var i = n - 1; i >= 0; i -= 2) {
			if (i === 6) {
				--i;
			}

			var jj = dir < 0 ? n - 1 : 0;

			for (var j = 0; j < n; ++j) {
				for (var ii = i; ii > i - 2; --ii) {
					if (!reserved[jj][ii]) {
						matrix[jj][ii] = (buf[k >> 3] >> (~k & 7)) & 1;
						++k;
					}
				}

				jj += dir;
			}

			dir = -dir;
		}

		return matrix;
	};

	var maskdata = function maskdata(matrix, reserved, mask) {
		var maskf = MASKFUNCS[mask];
		var n = matrix[length];

		for (var i = 0; i < n; ++i) {
			for (var j = 0; j < n; ++j) {
				if (!reserved[i][j]) {
					matrix[i][j] ^= maskf(i, j);
				}
			}
		}

		return matrix;
	};

	var putformatinfo = function putformatinfo(
		matrix,
		reserved,
		ecclevel,
		mask
	) {
		var n = matrix[length];
		var code = augumentbch((ecclevel << 3) | mask, 5, 0x537, 10) ^ 0x5412;

		for (var i = 0; i < 15; ++i) {
			var r = [
				0,
				1,
				2,
				3,
				4,
				5,
				7,
				8,
				n - 7,
				n - 6,
				n - 5,
				n - 4,
				n - 3,
				n - 2,
				n - 1
			][i];
			var c = [
				n - 1,
				n - 2,
				n - 3,
				n - 4,
				n - 5,
				n - 6,
				n - 7,
				n - 8,
				7,
				5,
				4,
				3,
				2,
				1,
				0
			][i];
			matrix[r][8] = matrix[8][c] = (code >> i) & 1;
		}

		return matrix;
	};

	var evaluatematrix = function evaluatematrix(matrix) {
		var PENALTY_CONSECUTIVE = 3;
		var PENALTY_TWOBYTWO = 3;
		var PENALTY_FINDERLIKE = 40;
		var PENALTY_DENSITY = 10;

		var evaluategroup = function evaluategroup(groups) {
			var score = 0;

			for (var i = 0; i < groups[length]; ++i) {
				if (groups[i] >= 5) {
					score += PENALTY_CONSECUTIVE + (groups[i] - 5);
				}
			}

			for (var i2 = 5; i2 < groups[length]; i2 += 2) {
				var p = groups[i2];

				if (
					groups[i2 - 1] === p &&
					groups[i2 - 2] === 3 * p &&
					groups[i2 - 3] === p &&
					groups[i2 - 4] === p &&
					(groups[i2 - 5] >= 4 * p || groups[i2 + 1] >= 4 * p)
				) {
					score += PENALTY_FINDERLIKE;
				}
			}

			return score;
		};

		var n = matrix[length];
		var score = 0,
			nblacks = 0;

		for (var i = 0; i < n; ++i) {
			var row = matrix[i];
			var groups;
			groups = [0];

			for (var j = 0; j < n; ) {
				var k;

				for (k = 0; j < n && row[j]; ++k) {
					++j;
				}

				groups.push(k);

				for (k = 0; j < n && !row[j]; ++k) {
					++j;
				}

				groups.push(k);
			}

			score += evaluategroup(groups);
			groups = [0];

			for (var j2 = 0; j2 < n; ) {
				var k2;

				for (k2 = 0; j2 < n && matrix[j2][i]; ++k2) {
					++j2;
				}

				groups.push(k2);

				for (k2 = 0; j2 < n && !matrix[j2][i]; ++k2) {
					++j2;
				}

				groups.push(k2);
			}

			score += evaluategroup(groups);
			var nextrow = matrix[i + 1] || [];
			nblacks += row[0];

			for (var j3 = 1; j3 < n; ++j3) {
				var p = row[j3];
				nblacks += p;

				if (
					row[j3 - 1] === p &&
					nextrow[j3] === p &&
					nextrow[j3 - 1] === p
				) {
					score += PENALTY_TWOBYTWO;
				}
			}
		}

		score +=
			PENALTY_DENSITY * ((Math.abs(nblacks / n / n - 0.5) / 0.05) | 0);
		return score;
	};

	var _generate = function generate(data, ver, mode, ecclevel, mask) {
		var v = VERSIONS[ver];
		var buf = encode(ver, mode, data, ndatabits(ver, ecclevel) >> 3);
		buf = augumenteccs(buf, v[1][ecclevel], GF256_GENPOLY[v[0][ecclevel]]);
		var result = makebasematrix(ver);
		var matrix = result.matrix,
			reserved = result.reserved;
		putdata(matrix, reserved, buf);

		if (mask < 0) {
			maskdata(matrix, reserved, 0);
			putformatinfo(matrix, reserved, ecclevel, 0);
			var bestmask = 0,
				bestscore = evaluatematrix(matrix);
			maskdata(matrix, reserved, 0);

			for (mask = 1; mask < 8; ++mask) {
				maskdata(matrix, reserved, mask);
				putformatinfo(matrix, reserved, ecclevel, mask);
				var score = evaluatematrix(matrix);

				if (bestscore > score) {
					bestscore = score;
					bestmask = mask;
				}

				maskdata(matrix, reserved, mask);
			}

			mask = bestmask;
		}

		maskdata(matrix, reserved, mask);
		putformatinfo(matrix, reserved, ecclevel, mask);
		return matrix;
	};

	var appendChild = "appendChild";
	var createElement = "createElement";
	var createElementNS = "createElementNS";
	var setAttributeNS = "setAttributeNS";
	var createRange = "createRange";
	var selectNodeContents = "selectNodeContents";
	var createContextualFragment = "createContextualFragment";
	var createDocumentFragment = "createDocumentFragment";
	var createTextNode = "createTextNode";
	var QRCode = {
		generate: function generate(data, settings) {
			var options = settings || {};
			var MODES = {
				numeric: MODE_NUMERIC,
				alphanumeric: MODE_ALPHANUMERIC,
				octet: MODE_OCTET
			};
			var ECCLEVELS = {
				L: ECCLEVEL_L,
				M: ECCLEVEL_M,
				Q: ECCLEVEL_Q,
				H: ECCLEVEL_H
			};
			var ver = options.version || -1;
			var ecclevel = ECCLEVELS[(options.ecclevel || "L").toUpperCase()];
			var mode = options.mode ? MODES[options.mode.toLowerCase()] : -1;
			var mask = "mask" in options ? options.mask : -1;

			if (mode < 0) {
				if (typeof data === "string") {
					if (data.match(NUMERIC_REGEXP)) {
						mode = MODE_NUMERIC;
					} else if (data.match(ALPHANUMERIC_OUT_REGEXP)) {
						mode = MODE_ALPHANUMERIC;
					} else {
						mode = MODE_OCTET;
					}
				} else {
					mode = MODE_OCTET;
				}
			} else if (
				!(
					mode === MODE_NUMERIC ||
					mode === MODE_ALPHANUMERIC ||
					mode === MODE_OCTET
				)
			) {
				throw "invalid or unsupported mode";
			}

			data = validatedata(mode, data);

			if (data === null) {
				throw "invalid data format";
			}

			if (ecclevel < 0 || ecclevel > 3) {
				throw "invalid ECC level";
			}

			if (ver < 0) {
				for (ver = 1; ver <= 40; ++ver) {
					if (data[length] <= getmaxdatalen(ver, mode, ecclevel)) {
						break;
					}
				}

				if (ver > 40) {
					throw "too large data";
				}
			} else if (ver < 1 || ver > 40) {
				throw "invalid version";
			}

			if (mask !== -1 && (mask < 0 || mask > 8)) {
				throw "invalid mask";
			}

			return _generate(data, ver, mode, ecclevel, mask);
		},
		generateHTML: function generateHTML(data, settings) {
			var options = settings || {};
			var fillcolor = options.fillcolor ? options.fillcolor : "#FFFFFF";
			var textcolor = options.textcolor ? options.textcolor : "#000000";
			var matrix = QRCode.generate(data, options);
			var modsize = Math.max(options.modulesize || 5, 0.5);
			var margin = Math.max(
				options.margin !== null ? options.margin : 4,
				0.0
			);
			var e = document[createElement]("div");
			var n = matrix[length];
			var html = [
				'<table border="0" cellspacing="0" cellpadding="0" style="border:' +
					modsize * margin +
					"px solid " +
					fillcolor +
					";background:" +
					fillcolor +
					'">'
			];

			for (var i = 0; i < n; ++i) {
				html.push("<tr>");

				for (var j = 0; j < n; ++j) {
					html.push(
						'<td style="width:' +
							modsize +
							"px;height:" +
							modsize +
							"px" +
							(matrix[i][j] ? ";background:" + textcolor : "") +
							'"></td>'
					);
				}

				html.push("</tr>");
			}

			e.className = "qrcode";
			/* e.innerHTML = html.join("") + "</table>"; */

			var range = document[createRange]();
			range[selectNodeContents](e);
			var frag = range[createContextualFragment](
				html.join("") + "</table>"
			);
			e[appendChild](frag);
			return e;
		},
		generateSVG: function generateSVG(data, settings) {
			var options = settings || {};
			var fillcolor = options.fillcolor ? options.fillcolor : "#FFFFFF";
			var textcolor = options.textcolor ? options.textcolor : "#000000";
			var matrix = QRCode.generate(data, options);
			var n = matrix[length];
			var modsize = Math.max(options.modulesize || 5, 0.5);
			var margin = Math.max(options.margin ? options.margin : 4, 0.0);
			var size = modsize * (n + 2 * margin);
			/* var common = ' class= "fg"' + ' width="' + modsize + '" height="' + modsize + '"/>'; */

			var e = document[createElementNS](
				"http://www.w3.org/2000/svg",
				"svg"
			);
			e[setAttributeNS](null, "viewBox", "0 0 " + size + " " + size);
			e[setAttributeNS](null, "style", "shape-rendering:crispEdges");
			var qrcodeId = "qrcode" + Date.now();
			e[setAttributeNS](null, "id", qrcodeId);
			var frag = document[createDocumentFragment]();
			/* var svg = ['<style scoped>.bg{fill:' + fillcolor + '}.fg{fill:' + textcolor + '}</style>', '<rect class="bg" x="0" y="0"', 'width="' + size + '" height="' + size + '"/>', ]; */

			var style = document[createElementNS](
				"http://www.w3.org/2000/svg",
				"style"
			);
			style[appendChild](
				document[createTextNode](
					"#" +
						qrcodeId +
						" .bg{fill:" +
						fillcolor +
						"}#" +
						qrcodeId +
						" .fg{fill:" +
						textcolor +
						"}"
				)
			);
			/* style[setAttributeNS](null, "scoped", "scoped"); */

			frag[appendChild](style);

			var createRect = function createRect(c, f, x, y, s) {
				var fg =
					document[createElementNS](
						"http://www.w3.org/2000/svg",
						"rect"
					) || "";
				fg[setAttributeNS](null, "class", c);
				fg[setAttributeNS](null, "fill", f);
				fg[setAttributeNS](null, "x", x);
				fg[setAttributeNS](null, "y", y);
				fg[setAttributeNS](null, "width", s);
				fg[setAttributeNS](null, "height", s);
				return fg;
			};

			frag[appendChild](createRect("bg", "none", 0, 0, size));
			var yo = margin * modsize;

			for (var y = 0; y < n; ++y) {
				var xo = margin * modsize;

				for (var x = 0; x < n; ++x) {
					if (matrix[y][x]) {
						/* svg.push('<rect x="' + xo + '" y="' + yo + '"', common); */
						frag[appendChild](
							createRect("fg", "none", xo, yo, modsize)
						);
					}

					xo += modsize;
				}

				yo += modsize;
			}
			/* e.innerHTML = svg.join(""); */

			e[appendChild](frag);
			return e;
		},
		generatePNG: function generatePNG(data, settings) {
			var options = settings || {};
			var fillcolor = options.fillcolor || "#FFFFFF";
			var textcolor = options.textcolor || "#000000";
			var matrix = QRCode.generate(data, options);
			var modsize = Math.max(options.modulesize || 5, 0.5);
			var margin = Math.max(
				options.margin !== null && options.margin !== undefined
					? options.margin
					: 4,
				0.0
			);
			var n = matrix[length];
			var size = modsize * (n + 2 * margin);
			var canvas = document[createElement]("canvas"),
				context;
			canvas.width = canvas.height = size;
			context = canvas.getContext("2d");

			if (!context) {
				throw "canvas support is needed for PNG output";
			}

			context.fillStyle = fillcolor;
			context.fillRect(0, 0, size, size);
			context.fillStyle = textcolor;

			for (var i = 0; i < n; ++i) {
				for (var j = 0; j < n; ++j) {
					if (matrix[i][j]) {
						context.fillRect(
							modsize * (margin + j),
							modsize * (margin + i),
							modsize,
							modsize
						);
					}
				}
			}

			return canvas.toDataURL();
		}
	};
	root.QRCode = QRCode;
})("undefined" !== typeof window ? window : this, document);
/*jshint bitwise: true */

function _typeof(obj) {
	if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
		_typeof = function _typeof(obj) {
			return typeof obj;
		};
	} else {
		_typeof = function _typeof(obj) {
			return obj &&
				typeof Symbol === "function" &&
				obj.constructor === Symbol &&
				obj !== Symbol.prototype
				? "symbol"
				: typeof obj;
		};
	}
	return _typeof(obj);
}

var WheelIndicator = (function(t, e) {
	function i(t) {
		(this._options = h(u, t)),
			(this._deltaArray = [0, 0, 0]),
			(this._isAcceleration = !1),
			(this._isStopped = !0),
			(this._direction = ""),
			(this._timer = ""),
			(this._isWorking = !0);
		var e = this;
		(this._wheelHandler = function(t) {
			e._isWorking && (o.call(e, t), e._options.preventMouse && r(t));
		}),
			a(this._options.elem, l, this._wheelHandler);
	}

	function n(t) {
		(t.direction = this._direction), this._options.callback.call(this, t);
	}

	function r(e) {
		(e = e || t.event),
			e.preventDefault ? e.preventDefault() : (e.returnValue = !1);
	}

	function o(t) {
		var e = this,
			i = _d(t);

		if (0 !== i) {
			var r,
				o,
				a = i > 0 ? "down" : "up",
				c = e._deltaArray.length,
				h = !1,
				l = 0;

			for (
				clearTimeout(e._timer),
					e._timer = setTimeout(function() {
						(e._deltaArray = [0, 0, 0]),
							(e._isStopped = !0),
							(e._direction = a);
					}, 150),
					o = 0;
				c > o;
				o++
			) {
				0 !== e._deltaArray[o] && (e._deltaArray[o] > 0 ? ++l : --l);
			}

			Math.abs(l) === c &&
				((r = l > 0 ? "down" : "up"),
				r !== e._direction && ((h = !0), (e._direction = a))),
				e._isStopped ||
					(h
						? ((e._isAcceleration = !0), n.call(this, t))
						: Math.abs(l) === c && s.call(this, t)),
				e._isStopped &&
					((e._isStopped = !1),
					(e._isAcceleration = !0),
					(e._direction = a),
					n.call(this, t)),
				e._deltaArray.shift(),
				e._deltaArray.push(i);
		}
	}

	function s(t) {
		var e = Math.abs(this._deltaArray[0]),
			i = Math.abs(this._deltaArray[1]),
			r = Math.abs(this._deltaArray[2]),
			o = Math.abs(_d(t));
		o > r &&
			r > i &&
			i > e &&
			(this._isAcceleration ||
				(n.call(this, t), (this._isAcceleration = !0))),
			r > o && i >= r && (this._isAcceleration = !1);
	}

	function a(t, e, i) {
		t.addEventListener
			? t.addEventListener(
					e,
					i,
					p
						? {
								passive: !0
						  }
						: !1
			  )
			: t.attachEvent && t.attachEvent("on" + e, i);
	}

	function c(t, e, i) {
		t.removeEventListener
			? t.removeEventListener(
					e,
					i,
					p
						? {
								passive: !0
						  }
						: !1
			  )
			: t.detachEvent && t.detachEvent("on" + e, i);
	}

	function h(t, e) {
		var i,
			n = {};

		for (i in t) {
			Object.prototype.hasOwnProperty.call(t, i) && (n[i] = t[i]);
		}

		for (i in e) {
			Object.prototype.hasOwnProperty.call(e, i) && (n[i] = e[i]);
		}

		return n;
	}

	var l = "onwheel" in e ? "wheel" : "mousewheel",
		u = {
			callback: function callback() {},
			elem: e,
			preventMouse: !0
		};
	i.prototype = {
		constructor: i,
		turnOn: function turnOn() {
			return (this._isWorking = !0), this;
		},
		turnOff: function turnOff() {
			return (this._isWorking = !1), this;
		},
		setOptions: function setOptions(t) {
			return (this._options = h(this._options, t)), this;
		},
		getOption: function getOption(t) {
			var e = this._options[t];
			if (void 0 !== e) return e;
			throw Error("Unknown option");
		},
		destroy: function destroy() {
			return c(this._options.elem, l, this._wheelHandler), this;
		}
	};

	var _d = function d(t) {
			return (_d =
				t.wheelDelta && !t.deltaY
					? function(t) {
							return -1 * t.wheelDelta;
					  }
					: function(t) {
							return t.deltaY;
					  })(t);
		},
		p = (function() {
			var e = !1;

			try {
				var i =
					Object.defineProperty &&
					Object.defineProperty({}, "passive", {
						get: function get() {
							e = !0;
						}
					});
				t.addEventListener("test", function() {}, i);
			} catch (n) {}

			return e;
		})();

	return i;
})("undefined" != typeof window ? window : this, document);

"object" == (typeof exports === "undefined" ? "undefined" : _typeof(exports)) &&
	(module.exports = WheelIndicator);

/*global jQuery */

/*!
 * Super lightweight script (~1kb) to detect via Javascript events like
 * 'tap' 'dbltap' "swipeup" "swipedown" "swipeleft" "swiperight"
 * on any kind of device.
 * Version: 2.0.1
 * Author: Gianluca Guarini
 * Contact: gianluca.guarini@gmail.com
 * Website: http://www.gianlucaguarini.com/
 * Twitter: @gianlucaguarini
 * Copyright (c) Gianluca Guarini
 * @see {@link https://github.com/GianlucaGuarini/Tocca.js/blob/master/Tocca.js}
 * passes jshint
 */
(function(doc, win) {
	"use strict";

	if (typeof doc.createEvent !== "function") {
		return false;
	}

	var tapNum = 0,
		pointerId,
		currX,
		currY,
		cachedX,
		cachedY,
		timestamp,
		target,
		dblTapTimer,
		longtapTimer;

	var pointerEventSupport = function pointerEventSupport(type) {
			var lo = type.toLowerCase(),
				ms = "MS" + type;
			return navigator.msPointerEnabled
				? ms
				: window.PointerEvent
				? lo
				: "";
		},
		defaults = {
			useJquery: !win.IGNORE_JQUERY && typeof jQuery !== "undefined",
			swipeThreshold: win.SWIPE_THRESHOLD || 100,
			tapThreshold: win.TAP_THRESHOLD || 150,
			dbltapThreshold: win.DBL_TAP_THRESHOLD || 200,
			longtapThreshold: win.LONG_TAP_THRESHOLD || 1000,
			tapPrecision: win.TAP_PRECISION / 2 || 60 / 2,
			justTouchEvents: win.JUST_ON_TOUCH_DEVICES
		},
		wasTouch = false,
		touchevents = {
			touchstart: pointerEventSupport("PointerDown") || "touchstart",
			touchend: pointerEventSupport("PointerUp") + " touchend",
			touchmove: pointerEventSupport("PointerMove") + " touchmove"
		},
		isTheSameFingerId = function isTheSameFingerId(e) {
			return (
				!e.pointerId ||
				typeof pointerId === "undefined" ||
				e.pointerId === pointerId
			);
		},
		setListener = function setListener(elm, events, callback) {
			var eventsArray = events.split(" "),
				i = eventsArray.length;

			while (i--) {
				elm.addEventListener(eventsArray[i], callback, false);
			}
		},
		getPointerEvent = function getPointerEvent(event) {
			return event.targetTouches ? event.targetTouches[0] : event;
		},
		getTimestamp = function getTimestamp() {
			return new Date().getTime();
		},
		sendEvent = function sendEvent(elm, eventName, originalEvent, data) {
			var customEvent = doc.createEvent("Event");
			customEvent.originalEvent = originalEvent;
			data = data || {};
			data.x = currX;
			data.y = currY;
			data.distance = data.distance;

			if (defaults.useJquery) {
				customEvent = jQuery.Event(eventName, {
					originalEvent: originalEvent
				});
				jQuery(elm).trigger(customEvent, data);
			}

			if (customEvent.initEvent) {
				for (var key in data) {
					if (data.hasOwnProperty(key)) {
						customEvent[key] = data[key];
					}
				}

				customEvent.initEvent(eventName, true, true);
				elm.dispatchEvent(customEvent);
			}

			while (elm) {
				if (elm["on" + eventName]) {
					elm["on" + eventName](customEvent);
				}

				elm = elm.parentNode;
			}
		},
		onTouchStart = function onTouchStart(e) {
			if (!isTheSameFingerId(e)) {
				return;
			}

			var isMousedown = e.type === "mousedown";
			wasTouch = !isMousedown;
			pointerId = e.pointerId;

			if (e.type === "mousedown" && wasTouch) {
				return;
			}

			var pointer = getPointerEvent(e);
			cachedX = currX = pointer.pageX;
			cachedY = currY = pointer.pageY;
			longtapTimer = setTimeout(function() {
				sendEvent(e.target, "longtap", e);
				target = e.target;
			}, defaults.longtapThreshold);
			timestamp = getTimestamp();
			tapNum++;
		},
		onTouchEnd = function onTouchEnd(e) {
			if (!isTheSameFingerId(e)) {
				return;
			}

			pointerId = undefined;

			if (e.type === "mouseup" && wasTouch) {
				wasTouch = false;
				return;
			}

			var eventsArr = [],
				now = getTimestamp(),
				deltaY = cachedY - currY,
				deltaX = cachedX - currX;
			clearTimeout(dblTapTimer);
			clearTimeout(longtapTimer);

			if (deltaX <= -defaults.swipeThreshold) {
				eventsArr.push("swiperight");
			}

			if (deltaX >= defaults.swipeThreshold) {
				eventsArr.push("swipeleft");
			}

			if (deltaY <= -defaults.swipeThreshold) {
				eventsArr.push("swipedown");
			}

			if (deltaY >= defaults.swipeThreshold) {
				eventsArr.push("swipeup");
			}

			if (eventsArr.length) {
				for (var i = 0; i < eventsArr.length; i++) {
					var eventName = eventsArr[i];
					sendEvent(e.target, eventName, e, {
						distance: {
							x: Math.abs(deltaX),
							y: Math.abs(deltaY)
						}
					});
				}

				tapNum = 0;
			} else {
				if (
					cachedX >= currX - defaults.tapPrecision &&
					cachedX <= currX + defaults.tapPrecision &&
					cachedY >= currY - defaults.tapPrecision &&
					cachedY <= currY + defaults.tapPrecision
				) {
					if (timestamp + defaults.tapThreshold - now >= 0) {
						sendEvent(
							e.target,
							tapNum >= 2 && target === e.target
								? "dbltap"
								: "tap",
							e
						);
						target = e.target;
					}
				}

				dblTapTimer = setTimeout(function() {
					tapNum = 0;
				}, defaults.dbltapThreshold);
			}
		},
		onTouchMove = function onTouchMove(e) {
			if (!isTheSameFingerId(e)) {
				return;
			}

			if (e.type === "mousemove" && wasTouch) {
				return;
			}

			var pointer = getPointerEvent(e);
			currX = pointer.pageX;
			currY = pointer.pageY;
		};

	setListener(
		doc,
		touchevents.touchstart + (defaults.justTouchEvents ? "" : " mousedown"),
		onTouchStart
	);
	setListener(
		doc,
		touchevents.touchend + (defaults.justTouchEvents ? "" : " mouseup"),
		onTouchEnd
	);
	setListener(
		doc,
		touchevents.touchmove + (defaults.justTouchEvents ? "" : " mousemove"),
		onTouchMove
	);

	win.tocca = function(options) {
		for (var opt in options) {
			if (options.hasOwnProperty(opt)) {
				defaults[opt] = options[opt];
			}
		}

		return defaults;
	};
})(document, "undefined" !== typeof window ? window : this);
