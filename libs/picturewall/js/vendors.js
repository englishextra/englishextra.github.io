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
 * modified Generates event when user makes new movement (like a swipe on a touchscreen).
 * @version 1.1.4
 * @link https://github.com/Promo/wheel-indicator
 * @license MIT
 * @see {@link https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md#feature-detection}
 * forced passive event listener if supported
 * passes jshint
 */

/* global module, window, document */
var WheelIndicator = (function(root, document) {
	var eventWheel = "onwheel" in document ? "wheel" : "mousewheel",
		DEFAULTS = {
			callback: function callback() {},
			elem: document,
			preventMouse: true
		};

	function Module(options) {
		this._options = extend(DEFAULTS, options);
		this._deltaArray = [0, 0, 0];
		this._isAcceleration = false;
		this._isStopped = true;
		this._direction = "";
		this._timer = "";
		this._isWorking = true;
		var self = this;

		this._wheelHandler = function(event) {
			if (self._isWorking) {
				processDelta.call(self, event);

				if (self._options.preventMouse) {
					preventDefault(event);
				}
			}
		};

		addEvent(this._options.elem, eventWheel, this._wheelHandler);
	}

	Module.prototype = {
		constructor: Module,
		turnOn: function turnOn() {
			this._isWorking = true;
			return this;
		},
		turnOff: function turnOff() {
			this._isWorking = false;
			return this;
		},
		setOptions: function setOptions(options) {
			this._options = extend(this._options, options);
			return this;
		},
		getOption: function getOption(option) {
			var neededOption = this._options[option];

			if (neededOption !== undefined) {
				return neededOption;
			}

			throw new Error("Unknown option");
		},
		destroy: function destroy() {
			removeEvent(this._options.elem, eventWheel, this._wheelHandler);
			return this;
		}
	};

	function triggerEvent(event) {
		event.direction = this._direction;

		this._options.callback.call(this, event);
	}

	var _getDeltaY = function getDeltaY(event) {
		if (event.wheelDelta && !event.deltaY) {
			_getDeltaY = function getDeltaY(event) {
				return event.wheelDelta * -1;
			};
		} else {
			_getDeltaY = function getDeltaY(event) {
				return event.deltaY;
			};
		}

		return _getDeltaY(event);
	};

	function preventDefault(event) {
		event = event || root.event;

		if (event.preventDefault) {
			event.preventDefault();
		} else {
			event.returnValue = false;
		}
	}

	function processDelta(event) {
		var self = this,
			delta = _getDeltaY(event);

		if (delta === 0) return;
		var direction = delta > 0 ? "down" : "up",
			arrayLength = self._deltaArray.length,
			changedDirection = false,
			repeatDirection = 0,
			sustainableDirection,
			i;
		clearTimeout(self._timer);
		self._timer = setTimeout(function() {
			self._deltaArray = [0, 0, 0];
			self._isStopped = true;
			self._direction = direction;
		}, 150);

		for (i = 0; i < arrayLength; i++) {
			if (self._deltaArray[i] !== 0) {
				if (self._deltaArray[i] > 0) {
					++repeatDirection;
				} else {
					--repeatDirection;
				}
			}
		}

		if (Math.abs(repeatDirection) === arrayLength) {
			sustainableDirection = repeatDirection > 0 ? "down" : "up";

			if (sustainableDirection !== self._direction) {
				changedDirection = true;
				self._direction = direction;
			}
		}

		if (!self._isStopped) {
			if (changedDirection) {
				self._isAcceleration = true;
				triggerEvent.call(this, event);
			} else {
				if (Math.abs(repeatDirection) === arrayLength) {
					analyzeArray.call(this, event);
				}
			}
		}

		if (self._isStopped) {
			self._isStopped = false;
			self._isAcceleration = true;
			self._direction = direction;
			triggerEvent.call(this, event);
		}

		self._deltaArray.shift();

		self._deltaArray.push(delta);
	}

	function analyzeArray(event) {
		var deltaArray0Abs = Math.abs(this._deltaArray[0]),
			deltaArray1Abs = Math.abs(this._deltaArray[1]),
			deltaArray2Abs = Math.abs(this._deltaArray[2]),
			deltaAbs = Math.abs(_getDeltaY(event));

		if (
			deltaAbs > deltaArray2Abs &&
			deltaArray2Abs > deltaArray1Abs &&
			deltaArray1Abs > deltaArray0Abs
		) {
			if (!this._isAcceleration) {
				triggerEvent.call(this, event);
				this._isAcceleration = true;
			}
		}

		if (deltaAbs < deltaArray2Abs && deltaArray2Abs <= deltaArray1Abs) {
			this._isAcceleration = false;
		}
	}

	var supportsPassive = (function() {
		var support = false;

		try {
			var opts =
				Object.defineProperty &&
				Object.defineProperty({}, "passive", {
					get: function get() {
						support = true;
					}
				});
			root.addEventListener("test", function() {}, opts);
		} catch (err) {}

		return support;
	})();

	function addEvent(elem, type, handler) {
		if (elem.addEventListener) {
			elem.addEventListener(
				type,
				handler,
				supportsPassive
					? {
							passive: true
					  }
					: false
			);
		} else if (elem.attachEvent) {
			elem.attachEvent("on" + type, handler);
		}
	}

	function removeEvent(elem, type, handler) {
		if (elem.removeEventListener) {
			elem.removeEventListener(
				type,
				handler,
				supportsPassive
					? {
							passive: true
					  }
					: false
			);
		} else if (elem.detachEvent) {
			elem.detachEvent("on" + type, handler);
		}
	}

	function extend(defaults, options) {
		var extended = {},
			prop;

		for (prop in defaults) {
			if (Object.prototype.hasOwnProperty.call(defaults, prop)) {
				extended[prop] = defaults[prop];
			}
		}

		for (prop in options) {
			if (Object.prototype.hasOwnProperty.call(options, prop)) {
				extended[prop] = options[prop];
			}
		}

		return extended;
	}

	return Module;
})("undefined" !== typeof window ? window : this, document);

if (
	(typeof exports === "undefined" ? "undefined" : _typeof(exports)) ===
	"object"
) {
	module.exports = WheelIndicator;
}

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
(function(root) {
	"use strict";

	var hasOwnProperty = "hasOwnProperty";
	var _length = "length";
	var replace = "replace";
	var blockregex = /\{\{(([@!]?)(.+?))\}\}(([\s\S]+?)(\{\{:\1\}\}([\s\S]+?))?)\{\{\/\1\}\}/g;
	var valregex = /\{\{([=%])(.+?)\}\}/g;

	var t = function t(template) {
		this.t = template;
	};

	function scrub(val) {
		return new Option(val).text[replace](/"/g, "&quot;");
	}

	function get_value(vars, key) {
		var parts = key.split(".");

		while (parts[_length]) {
			if (!(parts[0] in vars)) {
				return false;
			}

			vars = vars[parts.shift()];
		}

		return vars;
	}

	function render(fragment, vars) {
		return fragment[replace](blockregex, function(
			_,
			__,
			meta,
			key,
			inner,
			if_true,
			has_else,
			if_false
		) {
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
					if (val[hasOwnProperty](i)) {
						vars._key = i;
						vars._val = val[i];
						temp += render(inner, vars);
					}
				}

				vars._key = _;
				vars._val = __;
				return temp;
			}
		}).replace(valregex, function(_, meta, key) {
			var val = get_value(vars, key);

			if (val || val === 0) {
				return meta === "%" ? scrub(val) : val;
			}

			return "";
		});
	}

	t.prototype.render = function(vars) {
		return render(this.t, vars);
	};

	root.t = t;
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
(function(root, document) {
	"use strict";

	var _addEventListener = "addEventListener";
	var children = "children";
	var classList = "classList";
	var dataset = "dataset";
	var getComputedStyle = "getComputedStyle";
	var getElementsByClassName = "getElementsByClassName";
	var hasOwnProperty = "hasOwnProperty";
	var _length = "length";
	var nextElementSibling = "nextElementSibling";
	var offsetTop = "offsetTop";
	var parentNode = "parentNode";
	var previousElementSibling = "previousElementSibling";
	var style = "style";
	var zoomwall = {
		create: function create(
			blocks,
			enableKeys,
			dataAttributeHighresName,
			dataAttributeLowresName,
			done
		) {
			var _this = this;

			_this.dataAttributeHighresName =
				dataAttributeHighresName || "highres";
			_this.dataAttributeLowresName = dataAttributeLowresName || "lowres";
			zoomwall.resize(blocks[children]);
			blocks[classList].remove("loading");

			blocks[_addEventListener]("click", function() {
				if (_this[children] && _this[children][_length] > 0) {
					zoomwall.shrink(_this[children][0]);
				}
			});

			for (var i = 0; i < blocks[children][_length]; i++) {
				blocks[children][i][_addEventListener](
					"click",
					zoomwall.animate
				);
			}

			if (enableKeys) {
				zoomwall.keys(blocks);
			}

			if (typeof done === "function") {
				done(blocks);
			}
		},
		keys: function keys(blocks) {
			var keyPager = function keyPager(e) {
				if (e.defaultPrevented) {
					return;
				}

				var elem =
					blocks ||
					document[getElementsByClassName]("zoomwall lightbox")[0];

				if (elem) {
					switch (e.keyCode) {
						case 27:
							if (elem[children] && elem[children][_length] > 0) {
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

			document[_addEventListener]("keydown", keyPager);

			return keyPager;
		},
		resizeRow: function resizeRow(row, width) {
			if (row && row[_length] > 1) {
				for (var i in row) {
					if (row[hasOwnProperty](i)) {
						row[i][style].width =
							(parseInt(
								root[getComputedStyle](row[i]).width,
								10
							) /
								width) *
								100 +
							"%";
						row[i][style].height = "auto";
					}
				}
			}
		},
		calcRowWidth: function calcRowWidth(row) {
			var width = 0;

			for (var i in row) {
				if (row[hasOwnProperty](i)) {
					width += parseInt(root[getComputedStyle](row[i]).width, 10);
				}
			}

			return width;
		},
		resize: function resize(blocks) {
			var row = [];
			var top = -1;

			for (var c = 0; c < blocks[_length]; c++) {
				var block = blocks[c];

				if (block) {
					if (top === -1) {
						top = block[offsetTop];
					} else if (block[offsetTop] !== top) {
						zoomwall.resizeRow(row, zoomwall.calcRowWidth(row));
						row = [];
						top = block[offsetTop];
					}

					row.push(block);
				}
			}

			zoomwall.resizeRow(row, zoomwall.calcRowWidth(row));
		},
		reset: function reset(block) {
			block[style].transform = "translate(0, 0) scale(1)";
			block[style].webkitTransform = "translate(0, 0) scale(1)";
			block[classList].remove("active");
		},
		shrink: function shrink(block) {
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
		expand: function expand(block) {
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
				if (
					block.src !==
						block[dataset][_this.dataAttributeHighresName] &&
					block[dataset][_this.dataAttributeLowresName] === undefined
				) {
					block[dataset][_this.dataAttributeLowresName] = block.src;
				}

				block.src = block[dataset][_this.dataAttributeHighresName];
			}

			var row = [];
			row.push(block);
			var next = block[nextElementSibling];

			while (next && next[offsetTop] === block[offsetTop]) {
				row.push(next);
				next = next[nextElementSibling];
			}

			var prev = block[previousElementSibling];

			while (prev && prev[offsetTop] === block[offsetTop]) {
				row.unshift(prev);
				prev = prev[previousElementSibling];
			}

			var scale = targetHeight / blockHeight;

			if (blockWidth * scale > parentWidth) {
				scale = parentWidth / blockWidth;
			}

			var offsetY =
				parentTop - block[parentNode][offsetTop] + block[offsetTop];

			if (
				parentHeight < root.innerHeight ||
				blockHeight * scale < parentHeight
			) {
				offsetY -= targetHeight / 2 - (blockHeight * scale) / 2;
			}

			if (parentTop > 0) {
				offsetY -= parentTop;
			}

			var leftOffsetX = 0;

			for (var i = 0; i < row[_length] && row[i] !== block; i++) {
				leftOffsetX +=
					parseInt(root[getComputedStyle](row[i]).width, 10) * scale;
			}

			leftOffsetX =
				parentWidth / 2 - (blockWidth * scale) / 2 - leftOffsetX;
			var rightOffsetX = 0;

			for (var j = row[_length] - 1; j >= 0 && row[j] !== block; j--) {
				rightOffsetX +=
					parseInt(root[getComputedStyle](row[j]).width, 10) * scale;
			}

			rightOffsetX =
				parentWidth / 2 - (blockWidth * scale) / 2 - rightOffsetX;
			var itemOffset = 0;
			var prevWidth = 0;

			for (var k = 0; k < row[_length]; k++) {
				itemOffset += prevWidth * scale - prevWidth;
				prevWidth = parseInt(root[getComputedStyle](row[k]).width, 10);
				var percentageOffsetX =
					((itemOffset + leftOffsetX) / prevWidth) * 100;
				var percentageOffsetY =
					(-offsetY /
						parseInt(root[getComputedStyle](row[k]).height, 10)) *
					100;
				row[k][style].transformOrigin = "0% 0%";
				row[k][style].webkitTransformOrigin = "0% 0%";
				row[k][style].transform =
					"translate(" +
					percentageOffsetX.toFixed(8) +
					"%, " +
					percentageOffsetY.toFixed(8) +
					"%) scale(" +
					scale.toFixed(8) +
					")";
				row[k][style].webkitTransform =
					"translate(" +
					percentageOffsetX.toFixed(8) +
					"%, " +
					percentageOffsetY.toFixed(8) +
					"%) scale(" +
					scale.toFixed(8) +
					")";
			}

			var nextOffsetY = blockHeight * (scale - 1) - offsetY;
			var prevHeight;
			itemOffset = 0;
			prevWidth = 0;
			var next2 = row[row[_length] - 1][nextElementSibling];
			var nextRowTop = -1;

			while (next2) {
				var curTop = next2[offsetTop];

				if (curTop === nextRowTop) {
					itemOffset += prevWidth * scale - prevWidth;
				} else {
					if (nextRowTop !== -1) {
						itemOffset = 0;
						nextOffsetY += prevHeight * (scale - 1);
					}

					nextRowTop = curTop;
				}

				prevWidth = parseInt(root[getComputedStyle](next2).width, 10);
				prevHeight = parseInt(root[getComputedStyle](next2).height, 10);
				var percentageOffsetX2 =
					((itemOffset + leftOffsetX) / prevWidth) * 100;
				var percentageOffsetY2 = (nextOffsetY / prevHeight) * 100;
				next2[style].transformOrigin = "0% 0%";
				next2[style].webkitTransformOrigin = "0% 0%";
				next2[style].transform =
					"translate(" +
					percentageOffsetX2.toFixed(8) +
					"%, " +
					percentageOffsetY2.toFixed(8) +
					"%) scale(" +
					scale.toFixed(8) +
					")";
				next2[style].webkitTransform =
					"translate(" +
					percentageOffsetX2.toFixed(8) +
					"%, " +
					percentageOffsetY2.toFixed(8) +
					"%) scale(" +
					scale.toFixed(8) +
					")";
				next2 = next2[nextElementSibling];
			}

			var prevOffsetY = -offsetY;
			itemOffset = 0;
			prevWidth = 0;
			var prev2 = row[0][previousElementSibling];
			var prevRowTop = -1;

			while (prev2) {
				var curTop2 = prev2[offsetTop];

				if (curTop2 === prevRowTop) {
					itemOffset -= prevWidth * scale - prevWidth;
				} else {
					itemOffset = 0;
					prevOffsetY -=
						parseInt(root[getComputedStyle](prev2).height, 10) *
						(scale - 1);
					prevRowTop = curTop2;
				}

				prevWidth = parseInt(root[getComputedStyle](prev2).width, 10);
				var percentageOffsetX3 =
					((itemOffset - rightOffsetX) / prevWidth) * 100;
				var percentageOffsetY3 =
					(prevOffsetY /
						parseInt(root[getComputedStyle](prev2).height, 10)) *
					100;
				prev2[style].transformOrigin = "100% 0%";
				prev2[style].webkitTransformOrigin = "100% 0%";
				prev2[style].transform =
					"translate(" +
					percentageOffsetX3.toFixed(8) +
					"%, " +
					percentageOffsetY3.toFixed(8) +
					"%) scale(" +
					scale.toFixed(8) +
					")";
				prev2[style].webkitTransform =
					"translate(" +
					percentageOffsetX3.toFixed(8) +
					"%, " +
					percentageOffsetY3.toFixed(8) +
					"%) scale(" +
					scale.toFixed(8) +
					")";
				prev2 = prev2[previousElementSibling];
			}
		},
		animate: function animate(e) {
			var _this = this;

			if (_this[classList].contains("active")) {
				zoomwall.shrink(_this);
			} else {
				var actives = _this[parentNode][getElementsByClassName](
					"active"
				);

				for (var i = 0; i < actives[_length]; i++) {
					actives[i][classList].remove("active");
				}

				zoomwall.expand(_this);
			}

			e.stopPropagation();
		},
		page: function page(blocks, isNext) {
			var actives = blocks[getElementsByClassName]("active");

			if (actives && actives[_length] > 0) {
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
	root.Zoomwall = zoomwall;
})("undefined" !== typeof window ? window : this, document);

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
LegoMushroom @legomushroom http://legomushroom.com
MIT License 2014
 */

/*!
 * @see {@link https://github.com/legomushroom/resize/blob/master/dist/any-resize-event.js}
 * v1.0.0
 * fixed functions within the loop and some variables
 * not defined on more upper level
 * and if (proto.prototype === null || proto.prototype === undefined)
 * passes jshint
 */

/*global define, module*/

/*!
LegoMushroom @legomushroom http://legomushroom.com
MIT License 2014
 */
(function() {
	var Main;

	Main = (function() {
		function Main(o) {
			this.o = o != null ? o : {};

			if (window.isAnyResizeEventInited) {
				return;
			}

			this.vars();
			this.redefineProto();
		}

		Main.prototype.vars = function() {
			window.isAnyResizeEventInited = true;
			this.allowedProtos = [
				HTMLDivElement,
				HTMLFormElement,
				HTMLLinkElement,
				HTMLBodyElement,
				HTMLParagraphElement,
				HTMLFieldSetElement,
				HTMLLegendElement,
				HTMLLabelElement,
				HTMLButtonElement,
				HTMLUListElement,
				HTMLOListElement,
				HTMLLIElement,
				HTMLHeadingElement,
				HTMLQuoteElement,
				HTMLPreElement,
				HTMLBRElement,
				HTMLFontElement,
				HTMLHRElement,
				HTMLModElement,
				HTMLParamElement,
				HTMLMapElement,
				HTMLTableElement,
				HTMLTableCaptionElement,
				HTMLImageElement,
				HTMLTableCellElement,
				HTMLSelectElement,
				HTMLInputElement,
				HTMLTextAreaElement,
				HTMLAnchorElement,
				HTMLObjectElement,
				HTMLTableColElement,
				HTMLTableSectionElement,
				HTMLTableRowElement
			];
			return (this.timerElements = {
				img: 1,
				textarea: 1,
				input: 1,
				embed: 1,
				object: 1,
				svg: 1,
				canvas: 1,
				tr: 1,
				tbody: 1,
				thead: 1,
				tfoot: 1,
				a: 1,
				select: 1,
				option: 1,
				optgroup: 1,
				dl: 1,
				dt: 1,
				br: 1,
				basefont: 1,
				font: 1,
				col: 1,
				iframe: 1
			});
		};

		Main.prototype.redefineProto = function() {
			var i, it, proto, t;
			it = this;
			return (t = function() {
				var _i, _len, _ref, _results;

				_ref = this.allowedProtos;
				_results = [];

				var fn = function fn(proto) {
					var listener, remover;
					listener =
						proto.prototype.addEventListener ||
						proto.prototype.attachEvent;
					var wrappedListener;

					(function(listener) {
						wrappedListener = function wrappedListener() {
							var option;

							if (this !== window || this !== document) {
								option =
									arguments[0] === "onresize" &&
									!this.isAnyResizeEventInited;

								if (option) {
									it.handleResize({
										args: arguments,
										that: this
									});
								}
							}

							return listener.apply(this, arguments);
						};

						if (proto.prototype.addEventListener) {
							return (proto.prototype.addEventListener = wrappedListener);
						} else if (proto.prototype.attachEvent) {
							return (proto.prototype.attachEvent = wrappedListener);
						}
					})(listener);

					remover =
						proto.prototype.removeEventListener ||
						proto.prototype.detachEvent;
					return (function(remover) {
						var wrappedRemover;

						wrappedRemover = function wrappedRemover() {
							this.isAnyResizeEventInited = false;

							if (this.iframe) {
								this.removeChild(this.iframe);
							}

							return remover.apply(this, arguments);
						};

						if (proto.prototype.removeEventListener) {
							return (proto.prototype.removeEventListener = wrappedRemover);
						} else if (proto.prototype.detachEvent) {
							return (proto.prototype.detachEvent = wrappedListener);
						}
					})(remover);
				};

				for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
					proto = _ref[i];

					if (proto.prototype == null) {
						continue;
					}
					/* _results.push(fn.bind(null, proto)()); */

					_results.push(fn(proto));
				}

				return _results;
			}.call(this));
		};

		Main.prototype.handleResize = function(args) {
			var computedStyle, el, iframe, isEmpty, isStatic, _ref;

			el = args.that;

			if (!this.timerElements[el.tagName.toLowerCase()]) {
				iframe = document.createElement("iframe");
				el.appendChild(iframe);
				iframe.style.width = "100%";
				iframe.style.height = "100%";
				iframe.style.position = "absolute";
				iframe.style.zIndex = -999;
				iframe.style.opacity = 0;
				iframe.style.top = 0;
				iframe.style.left = 0;
				iframe.setAttribute("title", "any-resize-event");
				iframe.setAttribute("aria-hidden", true);
				computedStyle = window.getComputedStyle
					? getComputedStyle(el)
					: el.currentStyle;
				isStatic =
					computedStyle.position === "static" &&
					el.style.position === "";
				isEmpty =
					computedStyle.position === "" && el.style.position === "";

				if (isStatic || isEmpty) {
					el.style.position = "relative";
				}

				if ((_ref = iframe.contentWindow) != null) {
					_ref.onresize = (function(_this) {
						return function(e) {
							return _this.dispatchEvent(el);
						};
					})(this);
				}

				el.iframe = iframe;
			} else {
				this.initTimer(el);
			}

			return (el.isAnyResizeEventInited = true);
		};

		Main.prototype.initTimer = function(el) {
			var height, width;
			width = 0;
			height = 0;
			return (this.interval = setInterval(
				(function(_this) {
					return function() {
						var newHeight, newWidth;
						newWidth = el.offsetWidth;
						newHeight = el.offsetHeight;

						if (newWidth !== width || newHeight !== height) {
							_this.dispatchEvent(el);

							width = newWidth;
							return (height = newHeight);
						}
					};
				})(this),
				this.o.interval || 62.5
			));
		};

		Main.prototype.dispatchEvent = function(el) {
			var e;

			if (document.createEvent) {
				e = document.createEvent("HTMLEvents");
				e.initEvent("onresize", false, false);
				return el.dispatchEvent(e);
			} else if (document.createEventObject) {
				e = document.createEventObject();
				return el.fireEvent("onresize", e);
			} else {
				return false;
			}
		};

		Main.prototype.destroy = function() {
			var i, it, proto, _i, _len, _ref, _results;

			clearInterval(this.interval);
			this.interval = null;
			window.isAnyResizeEventInited = false;
			it = this;
			_ref = this.allowedProtos;
			_results = [];

			var fn = function fn(proto) {
				var listener;
				listener =
					proto.prototype.addEventListener ||
					proto.prototype.attachEvent;

				if (proto.prototype.addEventListener) {
					proto.prototype.addEventListener =
						Element.prototype.addEventListener;
				} else if (proto.prototype.attachEvent) {
					proto.prototype.attachEvent = Element.prototype.attachEvent;
				}

				if (proto.prototype.removeEventListener) {
					return (proto.prototype.removeEventListener =
						Element.prototype.removeEventListener);
				} else if (proto.prototype.detachEvent) {
					return (proto.prototype.detachEvent =
						Element.prototype.detachEvent);
				}
			};

			for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
				proto = _ref[i];

				if (proto.prototype == null) {
					continue;
				}

				_results.push(fn(proto));
			}

			return _results;
		};

		return Main;
	})();

	if (typeof define === "function" && define.amd) {
		define("any-resize-event", [], function() {
			return new Main();
		});
	} else if (
		(typeof module === "undefined" ? "undefined" : _typeof(module)) ===
			"object" &&
		_typeof(module.exports) === "object"
	) {
		module.exports = new Main();
	} else {
		if (typeof window !== "undefined" && window !== null) {
			window.AnyResizeEvent = Main;
		}

		if (typeof window !== "undefined" && window !== null) {
			window.anyResizeEvent = new Main();
		}
	}
}.call(this));

var _extends =
	Object.assign ||
	function(target) {
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

var LazyLoad = (function() {
	"use strict";

	var defaultSettings = {
		elements_selector: "img",
		container: document,
		threshold: 300,
		thresholds: null,
		data_src: "src",
		data_srcset: "srcset",
		data_sizes: "sizes",
		data_bg: "bg",
		class_loading: "loading",
		class_loaded: "loaded",
		class_error: "error",
		load_delay: 0,
		callback_load: null,
		callback_error: null,
		callback_set: null,
		callback_enter: null,
		callback_finish: null,
		to_webp: false
	};

	var getInstanceSettings = function getInstanceSettings(customSettings) {
		return _extends({}, defaultSettings, customSettings);
	};

	var dataPrefix = "data-";
	var processedDataName = "was-processed";
	var timeoutDataName = "ll-timeout";
	var trueString = "true";

	var getData = function getData(element, attribute) {
		return element.getAttribute(dataPrefix + attribute);
	};

	var setData = function setData(element, attribute, value) {
		var attrName = dataPrefix + attribute;

		if (value === null) {
			element.removeAttribute(attrName);
			return;
		}

		element.setAttribute(attrName, value);
	};

	var setWasProcessedData = function setWasProcessedData(element) {
		return setData(element, processedDataName, trueString);
	};

	var getWasProcessedData = function getWasProcessedData(element) {
		return getData(element, processedDataName) === trueString;
	};

	var setTimeoutData = function setTimeoutData(element, value) {
		return setData(element, timeoutDataName, value);
	};

	var getTimeoutData = function getTimeoutData(element) {
		return getData(element, timeoutDataName);
	};

	var purgeProcessedElements = function purgeProcessedElements(elements) {
		return elements.filter(function(element) {
			return !getWasProcessedData(element);
		});
	};

	var purgeOneElement = function purgeOneElement(elements, elementToPurge) {
		return elements.filter(function(element) {
			return element !== elementToPurge;
		});
	};
	/* Creates instance and notifies it through the window element */

	var createInstance = function createInstance(classObj, options) {
		var event;
		var eventString = "LazyLoad::Initialized";
		var instance = new classObj(options);

		try {
			// Works in modern browsers
			event = new CustomEvent(eventString, {
				detail: {
					instance: instance
				}
			});
		} catch (err) {
			// Works in Internet Explorer (all versions)
			event = document.createEvent("CustomEvent");
			event.initCustomEvent(eventString, false, false, {
				instance: instance
			});
		}

		window.dispatchEvent(event);
	};
	/* Auto initialization of one or more instances of lazyload, depending on the
   options passed in (plain object or an array) */

	function autoInitialize(classObj, options) {
		if (!options) {
			return;
		}

		if (!options.length) {
			// Plain object
			createInstance(classObj, options);
		} else {
			// Array of objects
			for (var i = 0, optionsItem; (optionsItem = options[i]); i += 1) {
				createInstance(classObj, optionsItem);
			}
		}
	}

	var replaceExtToWebp = function replaceExtToWebp(value, condition) {
		return condition ? value.replace(/\.(jpe?g|png)/gi, ".webp") : value;
	};

	var detectWebp = function detectWebp() {
		var webpString = "image/webp";
		var canvas = document.createElement("canvas");

		if (canvas.getContext && canvas.getContext("2d")) {
			return (
				canvas.toDataURL(webpString).indexOf("data:" + webpString) === 0
			);
		}

		return false;
	};

	var runningOnBrowser = typeof window !== "undefined";
	var isBot =
		(runningOnBrowser && !("onscroll" in window)) ||
		/(gle|ing|ro)bot|crawl|spider/i.test(navigator.userAgent);
	var supportsIntersectionObserver =
		runningOnBrowser && "IntersectionObserver" in window;
	var supportsClassList =
		runningOnBrowser && "classList" in document.createElement("p");
	var supportsWebp = runningOnBrowser && detectWebp();

	var setSourcesInChildren = function setSourcesInChildren(
		parentTag,
		attrName,
		dataAttrName,
		toWebpFlag
	) {
		for (var i = 0, childTag; (childTag = parentTag.children[i]); i += 1) {
			if (childTag.tagName === "SOURCE") {
				var attrValue = getData(childTag, dataAttrName);
				setAttributeIfValue(childTag, attrName, attrValue, toWebpFlag);
			}
		}
	};

	var setAttributeIfValue = function setAttributeIfValue(
		element,
		attrName,
		value,
		toWebpFlag
	) {
		if (!value) {
			return;
		}

		element.setAttribute(attrName, replaceExtToWebp(value, toWebpFlag));
	};

	var setSourcesImg = function setSourcesImg(element, settings) {
		var toWebpFlag = supportsWebp && settings.to_webp;
		var srcsetDataName = settings.data_srcset;
		var parent = element.parentNode;

		if (parent && parent.tagName === "PICTURE") {
			setSourcesInChildren(parent, "srcset", srcsetDataName, toWebpFlag);
		}

		var sizesDataValue = getData(element, settings.data_sizes);
		setAttributeIfValue(element, "sizes", sizesDataValue);
		var srcsetDataValue = getData(element, srcsetDataName);
		setAttributeIfValue(element, "srcset", srcsetDataValue, toWebpFlag);
		var srcDataValue = getData(element, settings.data_src);
		setAttributeIfValue(element, "src", srcDataValue, toWebpFlag);
	};

	var setSourcesIframe = function setSourcesIframe(element, settings) {
		var srcDataValue = getData(element, settings.data_src);
		setAttributeIfValue(element, "src", srcDataValue);
	};

	var setSourcesVideo = function setSourcesVideo(element, settings) {
		var srcDataName = settings.data_src;
		var srcDataValue = getData(element, srcDataName);
		setSourcesInChildren(element, "src", srcDataName);
		setAttributeIfValue(element, "src", srcDataValue);
		element.load();
	};

	var setSourcesBgImage = function setSourcesBgImage(element, settings) {
		var toWebpFlag = supportsWebp && settings.to_webp;
		var srcDataValue = getData(element, settings.data_src);
		var bgDataValue = getData(element, settings.data_bg);

		if (srcDataValue) {
			var setValue = replaceExtToWebp(srcDataValue, toWebpFlag);
			element.style.backgroundImage = 'url("' + setValue + '")';
		}

		if (bgDataValue) {
			var _setValue = replaceExtToWebp(bgDataValue, toWebpFlag);

			element.style.backgroundImage = _setValue;
		}
	};

	var setSourcesFunctions = {
		IMG: setSourcesImg,
		IFRAME: setSourcesIframe,
		VIDEO: setSourcesVideo
	};

	var setSources = function setSources(element, instance) {
		var settings = instance._settings;
		var tagName = element.tagName;
		var setSourcesFunction = setSourcesFunctions[tagName];

		if (setSourcesFunction) {
			setSourcesFunction(element, settings);

			instance._updateLoadingCount(1);

			instance._elements = purgeOneElement(instance._elements, element);
			return;
		}

		setSourcesBgImage(element, settings);
	};

	var addClass = function addClass(element, className) {
		if (supportsClassList) {
			element.classList.add(className);
			return;
		}

		element.className += (element.className ? " " : "") + className;
	};

	var removeClass = function removeClass(element, className) {
		if (supportsClassList) {
			element.classList.remove(className);
			return;
		}

		element.className = element.className
			.replace(new RegExp("(^|\\s+)" + className + "(\\s+|$)"), " ")
			.replace(/^\s+/, "")
			.replace(/\s+$/, "");
	};

	var callbackIfSet = function callbackIfSet(callback, argument) {
		if (callback) {
			callback(argument);
		}
	};

	var genericLoadEventName = "load";
	var mediaLoadEventName = "loadeddata";
	var errorEventName = "error";

	var addEventListener = function addEventListener(
		element,
		eventName,
		handler
	) {
		element.addEventListener(eventName, handler);
	};

	var removeEventListener = function removeEventListener(
		element,
		eventName,
		handler
	) {
		element.removeEventListener(eventName, handler);
	};

	var addEventListeners = function addEventListeners(
		element,
		loadHandler,
		errorHandler
	) {
		addEventListener(element, genericLoadEventName, loadHandler);
		addEventListener(element, mediaLoadEventName, loadHandler);
		addEventListener(element, errorEventName, errorHandler);
	};

	var removeEventListeners = function removeEventListeners(
		element,
		loadHandler,
		errorHandler
	) {
		removeEventListener(element, genericLoadEventName, loadHandler);
		removeEventListener(element, mediaLoadEventName, loadHandler);
		removeEventListener(element, errorEventName, errorHandler);
	};

	var eventHandler = function eventHandler(event, success, instance) {
		var settings = instance._settings;
		var className = success ? settings.class_loaded : settings.class_error;
		var callback = success
			? settings.callback_load
			: settings.callback_error;
		var element = event.target;
		removeClass(element, settings.class_loading);
		addClass(element, className);
		callbackIfSet(callback, element);

		instance._updateLoadingCount(-1);
	};

	var addOneShotEventListeners = function addOneShotEventListeners(
		element,
		instance
	) {
		var loadHandler = function loadHandler(event) {
			eventHandler(event, true, instance);
			removeEventListeners(element, loadHandler, errorHandler);
		};

		var errorHandler = function errorHandler(event) {
			eventHandler(event, false, instance);
			removeEventListeners(element, loadHandler, errorHandler);
		};

		addEventListeners(element, loadHandler, errorHandler);
	};

	var managedTags = ["IMG", "IFRAME", "VIDEO"];

	var loadAndUnobserve = function loadAndUnobserve(
		element,
		observer,
		instance
	) {
		revealElement(element, instance);
		observer.unobserve(element);
	};

	var cancelDelayLoad = function cancelDelayLoad(element) {
		var timeoutId = getTimeoutData(element);

		if (!timeoutId) {
			return; // do nothing if timeout doesn't exist
		}

		clearTimeout(timeoutId);
		setTimeoutData(element, null);
	};

	var delayLoad = function delayLoad(element, observer, instance) {
		var loadDelay = instance._settings.load_delay;
		var timeoutId = getTimeoutData(element);

		if (timeoutId) {
			return; // do nothing if timeout already set
		}

		timeoutId = setTimeout(function() {
			loadAndUnobserve(element, observer, instance);
			cancelDelayLoad(element);
		}, loadDelay);
		setTimeoutData(element, timeoutId);
	};

	function revealElement(element, instance, force) {
		var settings = instance._settings;

		if (!force && getWasProcessedData(element)) {
			return; // element has already been processed and force wasn't true
		}

		callbackIfSet(settings.callback_enter, element);

		if (managedTags.indexOf(element.tagName) > -1) {
			addOneShotEventListeners(element, instance);
			addClass(element, settings.class_loading);
		}

		setSources(element, instance);
		setWasProcessedData(element);
		callbackIfSet(settings.callback_set, element);
	}
	/* entry.isIntersecting needs fallback because is null on some versions of MS Edge, and
  entry.intersectionRatio is not enough alone because it could be 0 on some intersecting elements */

	var isIntersecting = function isIntersecting(entry) {
		return entry.isIntersecting || entry.intersectionRatio > 0;
	};

	var getObserverSettings = function getObserverSettings(settings) {
		return {
			root: settings.container === document ? null : settings.container,
			rootMargin: settings.thresholds || settings.threshold + "px"
		};
	};

	var LazyLoad = function LazyLoad(customSettings, elements) {
		this._settings = getInstanceSettings(customSettings);

		this._setObserver();

		this._loadingCount = 0;
		this.update(elements);
	};

	LazyLoad.prototype = {
		_manageIntersection: function _manageIntersection(entry) {
			var observer = this._observer;
			var loadDelay = this._settings.load_delay;
			var element = entry.target; // WITHOUT LOAD DELAY

			if (!loadDelay) {
				if (isIntersecting(entry)) {
					loadAndUnobserve(element, observer, this);
				}

				return;
			} // WITH LOAD DELAY

			if (isIntersecting(entry)) {
				delayLoad(element, observer, this);
			} else {
				cancelDelayLoad(element);
			}
		},
		_onIntersection: function _onIntersection(entries) {
			entries.forEach(this._manageIntersection.bind(this));
		},
		_setObserver: function _setObserver() {
			if (!supportsIntersectionObserver) {
				return;
			}

			this._observer = new IntersectionObserver(
				this._onIntersection.bind(this),
				getObserverSettings(this._settings)
			);
		},
		_updateLoadingCount: function _updateLoadingCount(plusMinus) {
			this._loadingCount += plusMinus;

			if (this._elements.length === 0 && this._loadingCount === 0) {
				callbackIfSet(this._settings.callback_finish);
			}
		},
		update: function update(elements) {
			var _this = this;

			var settings = this._settings;
			var nodeSet =
				elements ||
				settings.container.querySelectorAll(settings.elements_selector);
			this._elements = purgeProcessedElements(
				Array.prototype.slice.call(nodeSet) // NOTE: nodeset to array for IE compatibility
			);

			if (isBot || !this._observer) {
				this.loadAll();
				return;
			}

			this._elements.forEach(function(element) {
				_this._observer.observe(element);
			});
		},
		destroy: function destroy() {
			var _this2 = this;

			if (this._observer) {
				this._elements.forEach(function(element) {
					_this2._observer.unobserve(element);
				});

				this._observer = null;
			}

			this._elements = null;
			this._settings = null;
		},
		load: function load(element, force) {
			revealElement(element, this, force);
		},
		loadAll: function loadAll() {
			var _this3 = this;

			var elements = this._elements;
			elements.forEach(function(element) {
				_this3.load(element);
			});
		}
	};
	/* Automatic instances creation if required (useful for async script loading) */

	if (runningOnBrowser) {
		autoInitialize(LazyLoad, window.lazyLoadOptions);
	}

	return LazyLoad;
})();
