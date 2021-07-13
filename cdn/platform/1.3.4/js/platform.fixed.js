/*!
 * Platform.js <https://mths.be/platform>
 * Copyright 2014-2016 Benjamin Tan <https://demoneaux.github.io/>
 * Copyright 2011-2013 John-David Dalton <http://allyoucanleet.com/>
 * Available under MIT license <https://mths.be/mit>
 */

/* jshint ignore:start */
(function () {
	'use strict';
	var objectTypes = {
		'function': true,
		'object': true
	};
	var root = (objectTypes[typeof window] && window) || this;
	var oldRoot = root;
	var freeExports = objectTypes[typeof exports] && exports;
	var freeModule = objectTypes[typeof module] && module && !module.nodeType && module;
	var freeGlobal = freeExports && freeModule && typeof global == 'object' && global;
	if (freeGlobal && (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal || freeGlobal.self === freeGlobal)) {
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
			'10.0': '10',
			'6.4': '10 Technical Preview',
			'6.3': '8.1',
			'6.2': '8',
			'6.1': 'Server 2008 R2 / 7',
			'6.0': 'Server 2008 / Vista',
			'5.2': 'Server 2003 / XP 64-bit',
			'5.1': 'XP',
			'5.01': '2000 SP1',
			'5.0': '2000',
			'4.0': 'NT',
			'4.90': 'ME'
		};
		if (pattern && label && /^Win/i.test(os) && !/^Windows Phone /i.test(os) && (data = data[/[\d.]+$/.exec(os)])) {
			os = 'Windows ' + data;
		}
		os = String(os);
		if (pattern && label) {
			os = os.replace(RegExp(pattern, 'i'), label);
		}
		os = format(os.replace(/ ce$/i, ' CE').replace(/\bhpw/i, 'web').replace(/\bMacintosh\b/, 'Mac OS').replace(/_PowerPC\b/i, ' OS').replace(/\b(OS X) [^ \d]+/i, '$1').replace(/\bMac (OS X)\b/, '$1').replace(/\/(\d)/, ' $1').replace(/_/g, '.').replace(/(?: BePC|[ .]*fc[ \d.]+)$/i, '').replace(/\bx86\.64\b/gi, 'x86_64').replace(/\b(Windows Phone) OS\b/, '$1').replace(/\b(Chrome OS \w+) [\d.]+\b/, '$1').split(' on ')[0]);
		return os;
	}
	function each(object, callback) {
		var index = -1,
		length = object ? object.length : 0;
		if (typeof length == 'number' && length > -1 && length <= maxSafeInteger) {
			while (++index < length) {
				callback(object[index], index, object);
			}
		} else {
			forOwn(object, callback);
		}
	}
	function format(string) {
		string = trim(string);
		return /^(?:webOS|i(?:OS|P))/.test(string) ? string : capitalize(string);
	}
	function forOwn(object, callback) {
		for (var key in object) {
			if (hasOwnProperty.call(object, key)) {
				callback(object[key], key, object);
			}
		}
	}
	function getClassOf(value) {
		return value == null ? capitalize(value) : toString.call(value).slice(8, -1);
	}
	function isHostType(object, property) {
		var type = object != null ? typeof object[property] : 'number';
		return !/^(?:boolean|number|string|undefined)$/.test(type) && (type == 'object' ? !!object[property] : true);
	}
	function qualify(string) {
		return String(string).replace(/([ -])(?!$)/g, '$1?');
	}
	function reduce(array, callback) {
		var accumulator = null;
		each(array, function (value, index) {
			accumulator = callback(accumulator, value, index, array);
		});
		return accumulator;
	}
	function trim(string) {
		return String(string).replace(/^ +| +$/g, '');
	}
	function parse(ua) {
		var context = root;
		var isCustomContext = ua && typeof ua == 'object' && getClassOf(ua) != 'String';
		if (isCustomContext) {
			context = ua;
			ua = null;
		}
		var nav = context.navigator || {};
		var userAgent = nav.userAgent || '';
		ua || (ua = userAgent);
		var isModuleScope = isCustomContext || thisBinding == oldRoot;
		var likeChrome = isCustomContext ? !!nav.likeChrome : /\bChrome\b/.test(ua) && !/internal|\n/i.test(toString.toString());
		var objectClass = 'Object',
		airRuntimeClass = isCustomContext ? objectClass : 'ScriptBridgingProxyObject',
		enviroClass = isCustomContext ? objectClass : 'Environment',
		javaClass = (isCustomContext && context.java) ? 'JavaPackage' : getClassOf(context.java),
		phantomClass = isCustomContext ? objectClass : 'RuntimeObject';
		var java = /\bJava/.test(javaClass) && context.java;
		var rhino = java && getClassOf(context.environment) == enviroClass;
		var alpha = java ? 'a' : '\u03b1';
		var beta = java ? 'b' : '\u03b2';
		var doc = context.document || {};
		var opera = context.operamini || context.opera;
		var operaClass = reOpera.test(operaClass = (isCustomContext && opera) ? opera['[[Class]]'] : getClassOf(opera)) ? operaClass : (opera = null);
		var data;
		var arch = ua;
		var description = [];
		var prerelease = null;
		var useFeatures = ua == userAgent;
		var version = useFeatures && opera && typeof opera.version == 'function' && opera.version();
		var isSpecialCasedOS;
		var layout = getLayout([{
						'label': 'EdgeHTML',
						'pattern': 'Edge'
					}, 'Trident', {
						'label': 'WebKit',
						'pattern': 'AppleWebKit'
					}, 'iCab', 'Presto', 'NetFront', 'Tasman', 'KHTML', 'Gecko']);
		var name = getName(['Adobe AIR', 'Arora', 'Avant Browser', 'Breach', 'Camino', 'Electron', 'Epiphany', 'Fennec', 'Flock', 'Galeon', 'GreenBrowser', 'iCab', 'Iceweasel', 'K-Meleon', 'Konqueror', 'Lunascape', 'Maxthon', {
						'label': 'Microsoft Edge',
						'pattern': 'Edge'
					}, 'Midori', 'Nook Browser', 'PaleMoon', 'PhantomJS', 'Raven', 'Rekonq', 'RockMelt', {
						'label': 'Samsung Internet',
						'pattern': 'SamsungBrowser'
					}, 'SeaMonkey', {
						'label': 'Silk',
						'pattern': '(?:Cloud9|Silk-Accelerated)'
					}, 'Sleipnir', 'SlimBrowser', {
						'label': 'SRWare Iron',
						'pattern': 'Iron'
					}, 'Sunrise', 'Swiftfox', 'Waterfox', 'WebPositive', 'Opera Mini', {
						'label': 'Opera Mini',
						'pattern': 'OPiOS'
					}, 'Opera', {
						'label': 'Opera',
						'pattern': 'OPR'
					}, 'Chrome', {
						'label': 'Chrome Mobile',
						'pattern': '(?:CriOS|CrMo)'
					}, {
						'label': 'Firefox',
						'pattern': '(?:Firefox|Minefield)'
					}, {
						'label': 'Firefox for iOS',
						'pattern': 'FxiOS'
					}, {
						'label': 'IE',
						'pattern': 'IEMobile'
					}, {
						'label': 'IE',
						'pattern': 'MSIE'
					}, 'Safari']);
		var product = getProduct([{
						'label': 'BlackBerry',
						'pattern': 'BB10'
					}, 'BlackBerry', {
						'label': 'Galaxy S',
						'pattern': 'GT-I9000'
					}, {
						'label': 'Galaxy S2',
						'pattern': 'GT-I9100'
					}, {
						'label': 'Galaxy S3',
						'pattern': 'GT-I9300'
					}, {
						'label': 'Galaxy S4',
						'pattern': 'GT-I9500'
					}, {
						'label': 'Galaxy S5',
						'pattern': 'SM-G900'
					}, {
						'label': 'Galaxy S6',
						'pattern': 'SM-G920'
					}, {
						'label': 'Galaxy S6 Edge',
						'pattern': 'SM-G925'
					}, {
						'label': 'Galaxy S7',
						'pattern': 'SM-G930'
					}, {
						'label': 'Galaxy S7 Edge',
						'pattern': 'SM-G935'
					}, 'Google TV', 'Lumia', 'iPad', 'iPod', 'iPhone', 'Kindle', {
						'label': 'Kindle Fire',
						'pattern': '(?:Cloud9|Silk-Accelerated)'
					}, 'Nexus', 'Nook', 'PlayBook', 'PlayStation Vita', 'PlayStation', 'TouchPad', 'Transformer', {
						'label': 'Wii U',
						'pattern': 'WiiU'
					}, 'Wii', 'Xbox One', {
						'label': 'Xbox 360',
						'pattern': 'Xbox'
					}, 'Xoom']);
		var manufacturer = getManufacturer({
				'Apple': {
					'iPad': 1,
					'iPhone': 1,
					'iPod': 1
				},
				'Archos': {},
				'Amazon': {
					'Kindle': 1,
					'Kindle Fire': 1
				},
				'Asus': {
					'Transformer': 1
				},
				'Barnes & Noble': {
					'Nook': 1
				},
				'BlackBerry': {
					'PlayBook': 1
				},
				'Google': {
					'Google TV': 1,
					'Nexus': 1
				},
				'HP': {
					'TouchPad': 1
				},
				'HTC': {},
				'LG': {},
				'Microsoft': {
					'Xbox': 1,
					'Xbox One': 1
				},
				'Motorola': {
					'Xoom': 1
				},
				'Nintendo': {
					'Wii U': 1,
					'Wii': 1
				},
				'Nokia': {
					'Lumia': 1
				},
				'Samsung': {
					'Galaxy S': 1,
					'Galaxy S2': 1,
					'Galaxy S3': 1,
					'Galaxy S4': 1
				},
				'Sony': {
					'PlayStation': 1,
					'PlayStation Vita': 1
				}
			});
		var os = getOS(['Windows Phone', 'Android', 'CentOS', {
						'label': 'Chrome OS',
						'pattern': 'CrOS'
					}, 'Debian', 'Fedora', 'FreeBSD', 'Gentoo', 'Haiku', 'Kubuntu', 'Linux Mint', 'OpenBSD', 'Red Hat', 'SuSE', 'Ubuntu', 'Xubuntu', 'Cygwin', 'Symbian OS', 'hpwOS', 'webOS ', 'webOS', 'Tablet OS', 'Tizen', 'Linux', 'Mac OS X', 'Macintosh', 'Mac', 'Windows 98;', 'Windows ']);
		function getLayout(guesses) {
			return reduce(guesses, function (result, guess) {
				return result || RegExp('\\b' + (guess.pattern || qualify(guess)) + '\\b', 'i').exec(ua) && (guess.label || guess);
			});
		}
		function getManufacturer(guesses) {
			return reduce(guesses, function (result, value, key) {
				return result || (value[product] || value[/^[a-z]+(?: +[a-z]+\b)*/i.exec(product)] || RegExp('\\b' + qualify(key) + '(?:\\b|\\w*\\d)', 'i').exec(ua)) && key;
			});
		}
		function getName(guesses) {
			return reduce(guesses, function (result, guess) {
				return result || RegExp('\\b' + (guess.pattern || qualify(guess)) + '\\b', 'i').exec(ua) && (guess.label || guess);
			});
		}
		function getOS(guesses) {
			return reduce(guesses, function (result, guess) {
				var pattern = guess.pattern || qualify(guess);
				if (!result && (result = RegExp('\\b' + pattern + '(?:/[\\d.]+|[ \\w.]*)', 'i').exec(ua))) {
					result = cleanupOS(result, pattern, guess.label || guess);
				}
				return result;
			});
		}
		function getProduct(guesses) {
			return reduce(guesses, function (result, guess) {
				var pattern = guess.pattern || qualify(guess);
				if (!result && (result = RegExp('\\b' + pattern + ' *\\d+[.\\w_]*', 'i').exec(ua) || RegExp('\\b' + pattern + ' *\\w+-[\\w]*', 'i').exec(ua) || RegExp('\\b' + pattern + '(?:; *(?:[a-z]+[_-])?[a-z]+\\d+|[^ ();-]*)', 'i').exec(ua))) {
					if ((result = String((guess.label && !RegExp(pattern, 'i').test(guess.label)) ? guess.label : result).split('/'))[1] && !/[\d.]+/.test(result[0])) {
						result[0] += ' ' + result[1];
					}
					guess = guess.label || guess;
					result = format(result[0].replace(RegExp(pattern, 'i'), guess).replace(RegExp('; *(?:' + guess + '[_-])?', 'i'), ' ').replace(RegExp('(' + guess + ')[-_.]?(\\w)', 'i'), '$1 $2'));
				}
				return result;
			});
		}
		function getVersion(patterns) {
			return reduce(patterns, function (result, pattern) {
				return result || (RegExp(pattern + '(?:-[\\d.]+/|(?: for [\\w-]+)?[ /-])([\\d.]+[^ ();/_-]*)', 'i').exec(ua) || 0)[1] || null;
			});
		}
		function toStringPlatform() {
			return this.description || '';
		}
		layout && (layout = [layout]);
		if (manufacturer && !product) {
			product = getProduct([manufacturer]);
		}
		if ((data = /\bGoogle TV\b/.exec(product))) {
			product = data[0];
		}
		if (/\bSimulator\b/i.test(ua)) {
			product = (product ? product + ' ' : '') + 'Simulator';
		}
		if (name == 'Opera Mini' && /\bOPiOS\b/.test(ua)) {
			description.push('running in Turbo/Uncompressed mode');
		}
		if (name == 'IE' && /\blike iPhone OS\b/.test(ua)) {
			data = parse(ua.replace(/like iPhone OS/, ''));
			manufacturer = data.manufacturer;
			product = data.product;
		} else if (/^iP/.test(product)) {
			name || (name = 'Safari');
			os = 'iOS' + ((data = / OS ([\d_]+)/i.exec(ua)) ? ' ' + data[1].replace(/_/g, '.') : '');
		} else if (name == 'Konqueror' && !/buntu/i.test(os)) {
			os = 'Kubuntu';
		} else if ((manufacturer && manufacturer != 'Google' && ((/Chrome/.test(name) && !/\bMobile Safari\b/i.test(ua)) || /\bVita\b/.test(product))) || (/\bAndroid\b/.test(os) && /^Chrome/.test(name) && /\bVersion\//i.test(ua))) {
			name = 'Android Browser';
			os = /\bAndroid\b/.test(os) ? os : 'Android';
		} else if (name == 'Silk') {
			if (!/\bMobi/i.test(ua)) {
				os = 'Android';
				description.unshift('desktop mode');
			}
			if (/Accelerated *= *true/i.test(ua)) {
				description.unshift('accelerated');
			}
		} else if (name == 'PaleMoon' && (data = /\bFirefox\/([\d.]+)\b/.exec(ua))) {
			description.push('identifying as Firefox ' + data[1]);
		} else if (name == 'Firefox' && (data = /\b(Mobile|Tablet|TV)\b/i.exec(ua))) {
			os || (os = 'Firefox OS');
			product || (product = data[1]);
		} else if (!name || (data = !/\bMinefield\b/i.test(ua) && /\b(?:Firefox|Safari)\b/.exec(name))) {
			if (name && !product && /[\/,]|^[^(]+?\)/.test(ua.slice(ua.indexOf(data + '/') + 8))) {
				name = null;
			}
			if ((data = product || manufacturer || os) && (product || manufacturer || /\b(?:Android|Symbian OS|Tablet OS|webOS)\b/.test(os))) {
				name = /[a-z]+(?: Hat)?/i.exec(/\bAndroid\b/.test(os) ? os : data) + ' Browser';
			}
		} else if (name == 'Electron' && (data = (/\bChrome\/([\d.]+)\b/.exec(ua) || 0)[1])) {
			description.push('Chromium ' + data);
		}
		if (!version) {
			version = getVersion(['(?:Cloud9|CriOS|CrMo|Edge|FxiOS|IEMobile|Iron|Opera ?Mini|OPiOS|OPR|Raven|SamsungBrowser|Silk(?!/[\\d.]+$))', 'Version', qualify(name), '(?:Firefox|Minefield|NetFront)']);
		}
		if ((data = layout == 'iCab' && parseFloat(version) > 3 && 'WebKit' || /\bOpera\b/.test(name) && (/\bOPR\b/.test(ua) ? 'Blink' : 'Presto') || /\b(?:Midori|Nook|Safari)\b/i.test(ua) && !/^(?:Trident|EdgeHTML)$/.test(layout) && 'WebKit' || !layout && /\bMSIE\b/i.test(ua) && (os == 'Mac OS' ? 'Tasman' : 'Trident') || layout == 'WebKit' && /\bPlayStation\b(?! Vita\b)/i.test(name) && 'NetFront')) {
			layout = [data];
		}
		if (name == 'IE' && (data = (/; *(?:XBLWP|ZuneWP)(\d+)/i.exec(ua) || 0)[1])) {
			name += ' Mobile';
			os = 'Windows Phone ' + (/\+$/.test(data) ? data : data + '.x');
			description.unshift('desktop mode');
		} else if (/\bWPDesktop\b/i.test(ua)) {
			name = 'IE Mobile';
			os = 'Windows Phone 8.x';
			description.unshift('desktop mode');
			version || (version = (/\brv:([\d.]+)/.exec(ua) || 0)[1]);
		} else if (name != 'IE' && layout == 'Trident' && (data = /\brv:([\d.]+)/.exec(ua))) {
			if (name) {
				description.push('identifying as ' + name + (version ? ' ' + version : ''));
			}
			name = 'IE';
			version = data[1];
		}
		if (useFeatures) {
			if (isHostType(context, 'global')) {
				if (java) {
					data = java.lang.System;
					arch = data.getProperty('os.arch');
					os = os || data.getProperty('os.name') + ' ' + data.getProperty('os.version');
				}
				if (isModuleScope && isHostType(context, 'system') && (data = [context.system])[0]) {
					os || (os = data[0].os || null);
					try {
						data[1] = context.require('ringo/engine').version;
						version = data[1].join('.');
						name = 'RingoJS';
					} catch (e) {
						if (data[0].global.system == context.system) {
							name = 'Narwhal';
						}
					}
				} else if (typeof context.process == 'object' && !context.process.browser && (data = context.process)) {
					if (typeof data.versions == 'object') {
						if (typeof data.versions.electron == 'string') {
							description.push('Node ' + data.versions.node);
							name = 'Electron';
							version = data.versions.electron;
						} else if (typeof data.versions.nw == 'string') {
							description.push('Chromium ' + version, 'Node ' + data.versions.node);
							name = 'NW.js';
							version = data.versions.nw;
						}
					} else {
						name = 'Node.js';
						arch = data.arch;
						os = data.platform;
						version = /[\d.]+/.exec(data.version)
							version = version ? version[0] : 'unknown';
					}
				} else if (rhino) {
					name = 'Rhino';
				}
			} else if (getClassOf((data = context.runtime)) == airRuntimeClass) {
				name = 'Adobe AIR';
				os = data.flash.system.Capabilities.os;
			} else if (getClassOf((data = context.phantom)) == phantomClass) {
				name = 'PhantomJS';
				version = (data = data.version || null) && (data.major + '.' + data.minor + '.' + data.patch);
			} else if (typeof doc.documentMode == 'number' && (data = /\bTrident\/(\d+)/i.exec(ua))) {
				version = [version, doc.documentMode];
				if ((data = +data[1] + 4) != version[1]) {
					description.push('IE ' + version[1] + ' mode');
					layout && (layout[1] = '');
					version[1] = data;
				}
				version = name == 'IE' ? String(version[1].toFixed(1)) : version[0];
			} else if (typeof doc.documentMode == 'number' && /^(?:Chrome|Firefox)\b/.test(name)) {
				description.push('masking as ' + name + ' ' + version);
				name = 'IE';
				version = '11.0';
				layout = ['Trident'];
				os = 'Windows';
			}
			os = os && format(os);
		}
		if (version && (data = /(?:[ab]|dp|pre|[ab]\d+pre)(?:\d+\+?)?$/i.exec(version) || /(?:alpha|beta)(?: ?\d)?/i.exec(ua + ';' + (useFeatures && nav.appMinorVersion)) || /\bMinefield\b/i.test(ua) && 'a')) {
			prerelease = /b/i.test(data) ? 'beta' : 'alpha';
			version = version.replace(RegExp(data + '\\+?$'), '') +
				(prerelease == 'beta' ? beta : alpha) + (/\d+\+?/.exec(data) || '');
		}
		if (name == 'Fennec' || name == 'Firefox' && /\b(?:Android|Firefox OS)\b/.test(os)) {
			name = 'Firefox Mobile';
		} else if (name == 'Maxthon' && version) {
			version = version.replace(/\.[\d.]+/, '.x');
		} else if (/\bXbox\b/i.test(product)) {
			if (product == 'Xbox 360') {
				os = null;
			}
			if (product == 'Xbox 360' && /\bIEMobile\b/.test(ua)) {
				description.unshift('mobile mode');
			}
		} else if ((/^(?:Chrome|IE|Opera)$/.test(name) || name && !product && !/Browser|Mobi/.test(name)) && (os == 'Windows CE' || /Mobi/i.test(ua))) {
			name += ' Mobile';
		} else if (name == 'IE' && useFeatures) {
			try {
				if (context.external === null) {
					description.unshift('platform preview');
				}
			} catch (e) {
				description.unshift('embedded');
			}
		} else if ((/\bBlackBerry\b/.test(product) || /\bBB10\b/.test(ua)) && (data = (RegExp(product.replace(/ +/g, ' *') + '/([.\\d]+)', 'i').exec(ua) || 0)[1] || version)) {
			data = [data, /BB10/.test(ua)];
			os = (data[1] ? (product = null, manufacturer = 'BlackBerry') : 'Device Software') + ' ' + data[0];
			version = null;
		} else if (this != forOwn && product != 'Wii' && ((useFeatures && opera) || (/Opera/.test(name) && /\b(?:MSIE|Firefox)\b/i.test(ua)) || (name == 'Firefox' && /\bOS X (?:\d+\.){2,}/.test(os)) || (name == 'IE' && ((os && !/^Win/.test(os) && version > 5.5) || /\bWindows XP\b/.test(os) && version > 8 || version == 8 && !/\bTrident\b/.test(ua)))) && !reOpera.test((data = parse.call(forOwn, ua.replace(reOpera, '') + ';'))) && data.name) {
			data = 'ing as ' + data.name + ((data = data.version) ? ' ' + data : '');
			if (reOpera.test(name)) {
				if (/\bIE\b/.test(data) && os == 'Mac OS') {
					os = null;
				}
				data = 'identify' + data;
			} else {
				data = 'mask' + data;
				if (operaClass) {
					name = format(operaClass.replace(/([a-z])([A-Z])/g, '$1 $2'));
				} else {
					name = 'Opera';
				}
				if (/\bIE\b/.test(data)) {
					os = null;
				}
				if (!useFeatures) {
					version = null;
				}
			}
			layout = ['Presto'];
			description.push(data);
		}
		if ((data = (/\bAppleWebKit\/([\d.]+\+?)/i.exec(ua) || 0)[1])) {
			data = [parseFloat(data.replace(/\.(\d)$/, '.0$1')), data];
			if (name == 'Safari' && data[1].slice(-1) == '+') {
				name = 'WebKit Nightly';
				prerelease = 'alpha';
				version = data[1].slice(0, -1);
			} else if (version == data[1] || version == (data[2] = (/\bSafari\/([\d.]+\+?)/i.exec(ua) || 0)[1])) {
				version = null;
			}
			data[1] = (/\bChrome\/([\d.]+)/i.exec(ua) || 0)[1];
			if (data[0] == 537.36 && data[2] == 537.36 && parseFloat(data[1]) >= 28 && layout == 'WebKit') {
				layout = ['Blink'];
			}
			if (!useFeatures || (!likeChrome && !data[1])) {
				layout && (layout[1] = 'like Safari');
				data = (data = data[0], data < 400 ? 1 : data < 500 ? 2 : data < 526 ? 3 : data < 533 ? 4 : data < 534 ? '4+' : data < 535 ? 5 : data < 537 ? 6 : data < 538 ? 7 : data < 601 ? 8 : '8');
			} else {
				layout && (layout[1] = 'like Chrome');
				data = data[1] || (data = data[0], data < 530 ? 1 : data < 532 ? 2 : data < 532.05 ? 3 : data < 533 ? 4 : data < 534.03 ? 5 : data < 534.07 ? 6 : data < 534.10 ? 7 : data < 534.13 ? 8 : data < 534.16 ? 9 : data < 534.24 ? 10 : data < 534.30 ? 11 : data < 535.01 ? 12 : data < 535.02 ? '13+' : data < 535.07 ? 15 : data < 535.11 ? 16 : data < 535.19 ? 17 : data < 536.05 ? 18 : data < 536.10 ? 19 : data < 537.01 ? 20 : data < 537.11 ? '21+' : data < 537.13 ? 23 : data < 537.18 ? 24 : data < 537.24 ? 25 : data < 537.36 ? 26 : layout != 'Blink' ? '27' : '28');
			}
			layout && (layout[1] += ' ' + (data += typeof data == 'number' ? '.x' : /[.+]/.test(data) ? '' : '+'));
			if (name == 'Safari' && (!version || parseInt(version) > 45)) {
				version = data;
			}
		}
		if (name == 'Opera' && (data = /\bzbov|zvav$/.exec(os))) {
			name += ' ';
			description.unshift('desktop mode');
			if (data == 'zvav') {
				name += 'Mini';
				version = null;
			} else {
				name += 'Mobile';
			}
			os = os.replace(RegExp(' *' + data + '$'), '');
		} else if (name == 'Safari' && /\bChrome\b/.exec(layout && layout[1])) {
			description.unshift('desktop mode');
			name = 'Chrome Mobile';
			version = null;
			if (/\bOS X\b/.test(os)) {
				manufacturer = 'Apple';
				os = 'iOS 4.3+';
			} else {
				os = null;
			}
		}
		if (version && version.indexOf((data = /[\d.]+$/.exec(os))) == 0 && ua.indexOf('/' + data + '-') > -1) {
			os = trim(os.replace(data, ''));
		}
		if (layout && !/\b(?:Avant|Nook)\b/.test(name) && (/Browser|Lunascape|Maxthon/.test(name) || name != 'Safari' && /^iOS/.test(os) && /\bSafari\b/.test(layout[1]) || /^(?:Adobe|Arora|Breach|Midori|Opera|Phantom|Rekonq|Rock|Samsung Internet|Sleipnir|Web)/.test(name) && layout[1])) {
			(data = layout[layout.length - 1]) && description.push(data);
		}
		if (description.length) {
			description = ['(' + description.join('; ') + ')'];
		}
		if (manufacturer && product && product.indexOf(manufacturer) < 0) {
			description.push('on ' + manufacturer);
		}
		if (product) {
			description.push((/^on /.test(description[description.length - 1]) ? '' : 'on ') + product);
		}
		if (os) {
			data = / ([\d.+]+)$/.exec(os);
			isSpecialCasedOS = data && os.charAt(os.length - data[0].length - 1) == '/';
			os = {
				'architecture': 32,
				'family': (data && !isSpecialCasedOS) ? os.replace(data[0], '') : os,
				'version': data ? data[1] : null,
				'toString': function () {
					var version = this.version;
					return this.family + ((version && !isSpecialCasedOS) ? ' ' + version : '') + (this.architecture == 64 ? ' 64-bit' : '');
				}
			};
		}
		if ((data = /\b(?:AMD|IA|Win|WOW|x86_|x)64\b/i.exec(arch)) && !/\bi686\b/i.test(arch)) {
			if (os) {
				os.architecture = 64;
				os.family = os.family.replace(RegExp(' *' + data), '');
			}
			if (name && (/\bWOW64\b/i.test(ua) || (useFeatures && /\w(?:86|32)$/.test(nav.cpuClass || nav.platform) && !/\bWin64; x64\b/i.test(ua)))) {
				description.unshift('32-bit');
			}
		} else if (os && /^OS X/.test(os.family) && name == 'Chrome' && parseFloat(version) >= 39) {
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
			'architecture': null,
			'family': null,
			'version': null,
			'toString': function () {
				return 'null';
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
		if (os && name && !(os == String(os).split(' ')[0] && (os == name.split(' ')[0] || product))) {
			description.push(product ? '(' + os + ')' : 'on ' + os);
		}
		if (description.length) {
			platform.description = description.join(' ');
		}
		return platform;
	}
	var platform = parse();
	if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
		root.platform = platform;
		define(function () {
			return platform;
		});
	} else if (freeExports && freeModule) {
		forOwn(platform, function (value, key) {
			freeExports[key] = value;
		});
	} else {
		root.platform = platform;
	}
}
	.call(this));
/* jshint ignore:end */
