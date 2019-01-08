/*!
 * @license Minigrid v3.1.1 minimal cascading grid layout http://alves.im/minigrid
 * @see {@link https://github.com/henriquea/minigrid}
 * changed element selection method
 * passes jshint
 */
(function(root, document) {
	"use strict";

	var getElementsByClassName = "getElementsByClassName";
	var getElementById = "getElementById";
	var _length = "length";

	function extend(a, b) {
		for (var key in b) {
			if (b.hasOwnProperty(key)) {
				a[key] = b[key];
			}
		}

		return a;
	}

	var elementsSelector;

	elementsSelector = function elementsSelector(selector, context, undefined) {
		var matches = {
			"#": "getElementById",
			".": "getElementsByClassName",
			"@": "getElementsByName",
			"=": "getElementsByTagName",
			"*": "querySelectorAll"
		}[selector[0]];
		var el = (context === undefined ? document : context)[matches](
			selector.slice(1)
		);
		return el.length < 2 ? el[0] : el;
	};

	var Minigrid = function Minigrid(props) {
		var containerEle =
			props.container instanceof Node
				? props.container
				: elementsSelector(props.container) || "";
		var itemsNodeList =
			props.item instanceof NodeList
				? props.item
				: elementsSelector(props.item) || "";
		this.props = extend(props, {
			container: containerEle,
			nodeList: itemsNodeList
		});
	};

	Minigrid.prototype.mount = function() {
		if (!this.props.container) {
			return false;
		}

		if (!this.props.nodeList || this.props.nodeList[_length] === 0) {
			return false;
		}

		var gutter =
			typeof this.props.gutter === "number" &&
			isFinite(this.props.gutter) &&
			Math.floor(this.props.gutter) === this.props.gutter
				? this.props.gutter
				: 0;
		var done = this.props.done;
		var containerEle = this.props.container;
		var itemsNodeList = this.props.nodeList;
		containerEle.style.width = "";
		var forEach = Array.prototype.forEach;
		var containerWidth = containerEle.getBoundingClientRect().width;
		var firstChildWidth =
			itemsNodeList[0].getBoundingClientRect().width + gutter;
		var cols = Math.max(
			Math.floor((containerWidth - gutter) / firstChildWidth),
			1
		);
		var count = 0;
		containerWidth = firstChildWidth * cols + gutter + "px";
		containerEle.style.width = containerWidth;
		containerEle.style.position = "relative";
		var itemsGutter = [];
		var itemsPosX = [];

		for (var g = 0; g < cols; ++g) {
			itemsPosX.push(g * firstChildWidth + gutter);
			itemsGutter.push(gutter);
		}

		if (this.props.rtl) {
			itemsPosX.reverse();
		}

		forEach.call(itemsNodeList, function(item) {
			var itemIndex = itemsGutter
				.slice(0)
				.sort(function(a, b) {
					return a - b;
				})
				.shift();
			itemIndex = itemsGutter.indexOf(itemIndex);
			var posX = parseInt(itemsPosX[itemIndex]);
			var posY = parseInt(itemsGutter[itemIndex]);
			item.style.position = "absolute";
			item.style.webkitBackfaceVisibility = item.style.backfaceVisibility =
				"hidden";
			item.style.transformStyle = "preserve-3d";
			item.style.transform =
				"translate3D(" + posX + "px," + posY + "px, 0)";
			itemsGutter[itemIndex] +=
				item.getBoundingClientRect().height + gutter;
			count = count + 1;
		});
		containerEle.style.display = "";
		var containerHeight = itemsGutter
			.slice(0)
			.sort(function(a, b) {
				return a - b;
			})
			.pop();
		containerEle.style.height = containerHeight + "px";

		if (typeof done === "function") {
			done(itemsNodeList);
		}
	};

	root.Minigrid = Minigrid;
})("undefined" !== typeof window ? window : this, document);

/*!
 * @app ReadMoreJS
 * @desc Breaks the content of an element to the specified number of words
 * @version 1.0.0
 * @license The MIT License (MIT)
 * @author George Raptis | http://georap.gr
 * @see {@link https://github.com/georapbox/ReadMore.js/blob/master/src/readMoreJS.js}
 * changed: rmLink = doc.querySelectorAll('.rm-link');
 * to: rmLink = doc.getElementsByClassName('rm-link') || "";
 * changed: var target = doc.querySelectorAll(options.target)
 * to: var target = elementsSelector(options.target)
 */
(function(win, doc, undef) {
	"use strict";

	var RM = {};
	RM.helpers = {
		extendObj: function extendObj() {
			for (var i = 1, l = arguments.length; i < l; i++) {
				for (var key in arguments[i]) {
					if (arguments[i].hasOwnProperty(key)) {
						if (
							arguments[i][key] &&
							arguments[i][key].constructor &&
							arguments[i][key].constructor === Object
						) {
							arguments[0][key] = arguments[0][key] || {};
							this.extendObj(
								arguments[0][key],
								arguments[i][key]
							);
						} else {
							arguments[0][key] = arguments[i][key];
						}
					}
				}
			}

			return arguments[0];
		}
	};

	RM.countWords = function(str) {
		return str.split(/\s+/).length;
	};

	RM.generateTrimmed = function(str, wordsNum) {
		return (
			str
				.split(/\s+/)
				.slice(0, wordsNum)
				.join(" ") + "..."
		);
	};

	RM.init = function(options) {
		var defaults = {
			target: "",
			numOfWords: 50,
			toggle: true,
			moreLink: "read more...",
			lessLink: "read less"
		};
		options = RM.helpers.extendObj({}, defaults, options);
		var elementsSelector;

		elementsSelector = function elementsSelector(
			selector,
			context,
			undefined
		) {
			var matches = {
				"#": "getElementById",
				".": "getElementsByClassName",
				"@": "getElementsByName",
				"=": "getElementsByTagName",
				"*": "querySelectorAll"
			}[selector[0]];
			var el = (context === undefined ? document : context)[matches](
				selector.slice(1)
			);
			return el.length < 2 ? el[0] : el;
		};

		var target = elementsSelector(options.target) || "",
			targetLen = target.length,
			targetContent,
			trimmedTargetContent,
			targetContentWords,
			initArr = [],
			trimmedArr = [],
			i,
			j,
			l,
			moreContainer,
			rmLink,
			moreLinkID,
			index;

		for (i = 0; i < targetLen; i++) {
			targetContent = target[i].innerHTML;
			trimmedTargetContent = RM.generateTrimmed(
				targetContent,
				options.numOfWords
			);
			targetContentWords = RM.countWords(targetContent);
			initArr.push(targetContent);
			trimmedArr.push(trimmedTargetContent);

			if (options.numOfWords < targetContentWords - 1) {
				target[i].innerHTML = trimmedArr[i];

				if (options.inline) {
					moreContainer = doc.createElement("span");
				} else {
					if (options.customBlockElement) {
						moreContainer = doc.createElement(
							options.customBlockElement
						);
					} else {
						moreContainer = doc.createElement("div");
					}
				}

				moreContainer.innerHTML =
					'<a href="javascript:void(0);" id="rm-more_' +
					i +
					'" class="rm-link" style="cursor:pointer;">' +
					options.moreLink +
					"</a>";

				if (options.inline) {
					target[i].appendChild(moreContainer);
				} else {
					target[i].parentNode.insertBefore(
						moreContainer,
						target[i].nextSibling
					);
				}
			}
		}

		rmLink = doc.getElementsByClassName("rm-link") || "";

		var func = function func() {
			moreLinkID = this.getAttribute("id");
			index = moreLinkID.split("_")[1];

			if (this.getAttribute("data-clicked") !== "true") {
				target[index].innerHTML = initArr[index];

				if (options.toggle !== false) {
					this.innerHTML = options.lessLink;
					this.setAttribute("data-clicked", true);
				} else {
					this.innerHTML = "";
				}
			} else {
				target[index].innerHTML = trimmedArr[index];
				this.innerHTML = options.moreLink;
				this.setAttribute("data-clicked", false);
			}
		};

		for (j = 0, l = rmLink.length; j < l; j++) {
			rmLink[j].onclick = func;
		}
	};

	window.$readMoreJS = RM;
})("undefined" !== typeof window ? window : this, document);

/*!
 * A small javascript library for ripples
 * /Written by Aaron Längert
 * @see {@link https://github.com/SirBaaron/ripple-js}
 * replaced eval with workaround
 * moved functions away from for loop
 * == to ===
 * added is binded ripple class to avoid multiple assignments
 * moved some functions higher
 * passes jshint
 */
(function(root, document) {
	"use strict";

	var ripple = (function() {
		function getRippleContainer(el) {
			var childs = el.childNodes;

			for (var ii = 0; ii < childs.length; ii++) {
				try {
					/* if (childs[ii].className.indexOf("rippleContainer") > -1) { */
					if (childs[ii].classList.contains("rippleContainer")) {
						return childs[ii];
					}
				} catch (err) {}
			}

			return el;
		}

		function rippleStart(e) {
			var rippleContainer = getRippleContainer(e.target);
			/* if ((rippleContainer.getAttribute("animating") === "0" || !rippleContainer.hasAttribute("animating")) && e.target.className.indexOf("ripple") > -1) { */

			if (
				(rippleContainer.getAttribute("animating") === "0" ||
					!rippleContainer.hasAttribute("animating")) &&
				e.target.classList.contains("ripple")
			) {
				rippleContainer.setAttribute("animating", "1");
				var offsetX =
					typeof e.offsetX === "number"
						? e.offsetX
						: e.touches[0].clientX -
						  e.target.getBoundingClientRect().left;
				var offsetY =
					typeof e.offsetY === "number"
						? e.offsetY
						: e.touches[0].clientY -
						  e.target.getBoundingClientRect().top;
				var fullCoverRadius = Math.max(
					Math.sqrt(Math.pow(offsetX, 2) + Math.pow(offsetY, 2)),
					Math.sqrt(
						Math.pow(e.target.clientWidth - offsetX, 2) +
							Math.pow(e.target.clientHeight - offsetY, 2)
					),
					Math.sqrt(
						Math.pow(offsetX, 2) +
							Math.pow(e.target.clientHeight - offsetY, 2)
					),
					Math.sqrt(
						Math.pow(offsetY, 2) +
							Math.pow(e.target.clientWidth - offsetX, 2)
					)
				);
				var expandTime =
					e.target.getAttribute("ripple-press-expand-time") || 3;
				rippleContainer.style.transition =
					"transform " +
					expandTime +
					"s ease-out, box-shadow 0.1s linear";
				rippleContainer.style.background =
					e.target.getAttribute("ripple-color") || "white";
				rippleContainer.style.opacity =
					e.target.getAttribute("ripple-opacity") || "0.6";
				rippleContainer.style.boxShadow =
					e.target.getAttribute("ripple-shadow") || "none";
				rippleContainer.style.top = offsetY + "px";
				rippleContainer.style.left = offsetX + "px";
				rippleContainer.style.transform =
					"translate(-50%, -50%) scale(" +
					fullCoverRadius / 100 +
					")";
			}
		}

		function rippleEnd(e) {
			var rippleContainer = getRippleContainer(e.target);

			if (rippleContainer.getAttribute("animating") === "1") {
				rippleContainer.setAttribute("animating", "2");
				var background = root
					.getComputedStyle(rippleContainer, null)
					.getPropertyValue("background");
				var destinationRadius =
					e.target.clientWidth + e.target.clientHeight;
				rippleContainer.style.transition = "none";
				var expandTime =
					e.target.getAttribute("ripple-release-expand-time") || 0.4;
				rippleContainer.style.transition =
					"transform " +
					expandTime +
					"s linear, background " +
					expandTime +
					"s linear, opacity " +
					expandTime +
					"s ease-in-out";
				rippleContainer.style.transform =
					"translate(-50%, -50%) scale(" +
					destinationRadius / 100 +
					")";
				rippleContainer.style.background =
					"radial-gradient(transparent 10%, " + background + " 40%)";
				rippleContainer.style.opacity = "0";
				e.target.dispatchEvent(
					new CustomEvent("ripple-button-click", {
						target: e.target
					})
				);
				var Fn = Function;
				new Fn("" + e.target.getAttribute("onrippleclick")).call(root);
			}
		}

		function rippleRetrieve(e) {
			var rippleContainer = getRippleContainer(e.target);

			if (
				rippleContainer.style.transform ===
				"translate(-50%, -50%) scale(0)"
			) {
				rippleContainer.setAttribute("animating", "0");
			}

			if (rippleContainer.getAttribute("animating") === "1") {
				rippleContainer.setAttribute("animating", "3");
				var collapseTime =
					e.target.getAttribute("ripple-leave-collapse-time") || 0.4;
				rippleContainer.style.transition =
					"transform " +
					collapseTime +
					"s linear, box-shadow " +
					collapseTime +
					"s linear";
				rippleContainer.style.boxShadow = "none";
				rippleContainer.style.transform =
					"translate(-50%, -50%) scale(0)";
			}
		}

		var ripple = {
			registerRipples: function registerRipples() {
				var rippleButtons = document.getElementsByClassName("ripple");
				var i;

				var fn1 = function fn1() {
					rippleButtons[i].addEventListener(
						"touchstart",
						function(e) {
							rippleStart(e);
						},
						{
							passive: true
						}
					);
					rippleButtons[i].addEventListener(
						"touchmove",
						function(e) {
							if (
								e.target.hasAttribute("ripple-cancel-on-move")
							) {
								rippleRetrieve(e);
								return;
							}

							var overEl;

							try {
								/* overEl = document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY).className.indexOf("ripple") >= 0; */
								overEl = document
									.elementFromPoint(
										e.touches[0].clientX,
										e.touches[0].clientY
									)
									.classList.contains("ripple");
							} catch (err) {
								overEl = false;
							}

							if (!overEl) {
								rippleRetrieve(e);
							}
						},
						{
							passive: true
						}
					);
					rippleButtons[i].addEventListener(
						"touchend",
						function(e) {
							rippleEnd(e);
						},
						{
							passive: true
						}
					);
					rippleButtons[i].addEventListener(
						"mousedown",
						function(e) {
							rippleStart(e);
						},
						{
							passive: true
						}
					);
					rippleButtons[i].addEventListener(
						"mouseup",
						function(e) {
							rippleEnd(e);
						},
						{
							passive: true
						}
					);
					rippleButtons[i].addEventListener(
						"mousemove",
						function(e) {
							if (
								e.target.hasAttribute(
									"ripple-cancel-on-move"
								) &&
								(e.movementX !== 0 || e.movementY !== 0)
							) {
								rippleRetrieve(e);
							}
						},
						{
							passive: true
						}
					);
					rippleButtons[i].addEventListener(
						"mouseleave",
						function(e) {
							rippleRetrieve(e);
						},
						{
							passive: true
						}
					);
					rippleButtons[i].addEventListener(
						"transitionend",
						function(e) {
							if (
								e.target.getAttribute("animating") === "2" ||
								e.target.getAttribute("animating") === "3"
							) {
								e.target.style.transition = "none";
								e.target.style.transform =
									"translate(-50%, -50%) scale(0)";
								e.target.style.boxShadow = "none";
								e.target.setAttribute("animating", "0");
							}
						},
						{
							passive: true
						}
					);

					if (
						getRippleContainer(rippleButtons[i]) ===
						rippleButtons[i]
					) {
						rippleButtons[i].innerHTML +=
							'<div class="rippleContainer"></div>';
					}
				};

				var isBindedRippleClass = "ripple--is-binded";

				for (i = 0; i < rippleButtons.length; i++) {
					if (
						!rippleButtons[i].classList.contains(
							isBindedRippleClass
						)
					) {
						rippleButtons[i].classList.add(isBindedRippleClass);
						fn1();
					}
				}
			},
			ripple: function ripple(el) {
				/* if (el.className.indexOf("ripple") < 0) { */
				if (!el.classList.contains("ripple")) {
					return;
				}

				var rect = el.getBoundingClientRect();
				var e = {
					target: el,
					offsetX: rect.width / 2,
					offsetY: rect.height / 2
				};
				rippleStart(e);
				rippleEnd(e);
			}
		};
		/* root.addEventListener("load", function () { */

		var css = document.createElement("style");
		css.type = "text/css";
		css.innerHTML =
			".ripple { overflow: hidden !important; position: relative; } .ripple .rippleContainer { display: block; height: 200px !important; width: 200px !important; padding: 0px 0px 0px 0px; border-radius: 50%; position: absolute !important; top: 0px; left: 0px; transform: translate(-50%, -50%) scale(0); -webkit-transform: translate(-50%, -50%) scale(0); -ms-transform: translate(-50%, -50%) scale(0); background-color: transparent; } .ripple * {pointer-events: none !important;}";
		document.head.appendChild(css);
		ripple.registerRipples();
		/* }); */

		return ripple;
	})();

	root.ripple = ripple;
})("undefined" !== typeof window ? window : this, document);

/*!
 * @see {@link https://github.com/englishextra/iframe-lightbox}
 * modified Simple lightbox effect in pure JS
 * @see {@link https://github.com/squeral/lightbox}
 * @see {@link https://github.com/squeral/lightbox/blob/master/lightbox.js}
 * @params {Object} elem Node element
 * @params {Object} settings object
 * el.lightbox = new IframeLightbox(elem, settings)
 * passes jshint
 */

/*jshint -W014 */
(function(root, document) {
	"use strict";

	var docElem = document.documentElement || "";
	var docBody = document.body || "";
	var appendChild = "appendChild";
	var classList = "classList";
	var createElement = "createElement";
	var dataset = "dataset";
	var getAttribute = "getAttribute";
	var getElementById = "getElementById";
	var getElementsByClassName = "getElementsByClassName";
	var innerHTML = "innerHTML";
	var setAttribute = "setAttribute";
	var _addEventListener = "addEventListener";
	var containerClass = "iframe-lightbox";
	var iframeLightboxOpenClass = "iframe-lightbox--open";
	var iframeLightboxLinkIsBindedClass = "iframe-lightbox-link--is-binded";
	var isLoadedClass = "is-loaded";
	var isOpenedClass = "is-opened";
	var isShowingClass = "is-showing";
	var isMobile = navigator.userAgent.match(
		/(iPad)|(iPhone)|(iPod)|(Android)|(PlayBook)|(BB10)|(BlackBerry)|(Opera Mini)|(IEMobile)|(webOS)|(MeeGo)/i
	);
	var isTouch =
		isMobile !== null ||
		document.createTouch !== undefined ||
		"ontouchstart" in root ||
		"onmsgesturechange" in root ||
		navigator.msMaxTouchPoints;

	var IframeLightbox = function IframeLightbox(elem, settings) {
		var options = settings || {};
		this.trigger = elem;
		this.el = document[getElementsByClassName](containerClass)[0] || "";
		this.body = this.el ? this.el[getElementsByClassName]("body")[0] : "";
		this.content = this.el
			? this.el[getElementsByClassName]("content")[0]
			: "";
		this.src = elem[dataset].src || "";
		this.href = elem[getAttribute]("href") || "";
		this.dataPaddingBottom = elem[dataset].paddingBottom || "";
		this.dataScrolling = elem[dataset].scrolling || "";
		this.dataTouch = elem[dataset].touch || "";
		this.rate = options.rate || 500;
		this.scrolling = options.scrolling;
		this.touch = options.touch;
		this.onOpened = options.onOpened;
		this.onIframeLoaded = options.onIframeLoaded;
		this.onLoaded = options.onLoaded;
		this.onCreated = options.onCreated;
		this.onClosed = options.onClosed;
		this.init();
	};

	IframeLightbox.prototype.init = function() {
		var _this = this;

		if (!this.el) {
			this.create();
		}

		var debounce = function debounce(func, wait) {
			var timeout, args, context, timestamp;
			return function() {
				context = this;
				args = [].slice.call(arguments, 0);
				timestamp = new Date();

				var later = function later() {
					var last = new Date() - timestamp;

					if (last < wait) {
						timeout = setTimeout(later, wait - last);
					} else {
						timeout = null;
						func.apply(context, args);
					}
				};

				if (!timeout) {
					timeout = setTimeout(later, wait);
				}
			};
		};

		var logic = function logic() {
			_this.open();
		};

		var handleIframeLightboxLink = function handleIframeLightboxLink(e) {
			e.stopPropagation();
			e.preventDefault();
			debounce(logic, this.rate).call();
		};

		if (
			!this.trigger[classList].contains(iframeLightboxLinkIsBindedClass)
		) {
			this.trigger[classList].add(iframeLightboxLinkIsBindedClass);

			this.trigger[_addEventListener]("click", handleIframeLightboxLink);

			if (isTouch && (_this.touch || _this.dataTouch)) {
				this.trigger[_addEventListener](
					"touchstart",
					handleIframeLightboxLink
				);
			}
		}
	};

	IframeLightbox.prototype.create = function() {
		var _this = this,
			backdrop = document[createElement]("div");

		backdrop[classList].add("backdrop");
		this.el = document[createElement]("div");
		this.el[classList].add(containerClass);
		this.el[appendChild](backdrop);
		this.content = document[createElement]("div");
		this.content[classList].add("content");
		this.body = document[createElement]("div");
		this.body[classList].add("body");
		this.content[appendChild](this.body);
		this.contentHolder = document[createElement]("div");
		this.contentHolder[classList].add("content-holder");
		this.contentHolder[appendChild](this.content);
		this.el[appendChild](this.contentHolder);
		this.btnClose = document[createElement]("a");
		this.btnClose[classList].add("btn-close");
		/* jshint -W107 */

		this.btnClose[setAttribute]("href", "javascript:void(0);");
		/* jshint +W107 */

		this.el[appendChild](this.btnClose);
		docBody[appendChild](this.el);

		backdrop[_addEventListener]("click", function() {
			_this.close();
		});

		this.btnClose[_addEventListener]("click", function() {
			_this.close();
		});

		root[_addEventListener]("keyup", function(ev) {
			if (27 === (ev.which || ev.keyCode)) {
				_this.close();
			}
		});

		var clearBody = function clearBody() {
			if (_this.isOpen()) {
				return;
			}

			_this.el[classList].remove(isShowingClass);

			_this.body[innerHTML] = "";
		};

		this.el[_addEventListener]("transitionend", clearBody, false);

		this.el[_addEventListener]("webkitTransitionEnd", clearBody, false);

		this.el[_addEventListener]("mozTransitionEnd", clearBody, false);

		this.el[_addEventListener]("msTransitionEnd", clearBody, false);

		this.callCallback(this.onCreated, this);
	};

	IframeLightbox.prototype.loadIframe = function() {
		var _this = this;

		this.iframeId = containerClass + Date.now();
		this.iframeSrc = this.src || this.href || "";
		var html = [];
		html.push(
			'<iframe src="' +
				this.iframeSrc +
				'" name="' +
				this.iframeId +
				'" id="' +
				this.iframeId +
				'" onload="this.style.opacity=1;" style="opacity:0;border:none;" webkitallowfullscreen="true" mozallowfullscreen="true" allowfullscreen="true" height="166" frameborder="no"></iframe>'
		);
		html.push(
			'<div class="half-circle-spinner"><div class="circle circle-1"></div><div class="circle circle-2"></div></div>'
		);
		this.body[innerHTML] = html.join("");

		(function(iframeId, body) {
			var iframe = document[getElementById](iframeId);

			iframe.onload = function() {
				this.style.opacity = 1;
				body[classList].add(isLoadedClass);

				if (_this.scrolling || _this.dataScrolling) {
					iframe.removeAttribute("scrolling");
					iframe.style.overflow = "scroll";
				} else {
					iframe[setAttribute]("scrolling", "no");
					iframe.style.overflow = "hidden";
				}

				_this.callCallback(_this.onIframeLoaded, _this);

				_this.callCallback(_this.onLoaded, _this);
			};
		})(this.iframeId, this.body);
	};

	IframeLightbox.prototype.open = function() {
		this.loadIframe();

		if (this.dataPaddingBottom) {
			this.content.style.paddingBottom = this.dataPaddingBottom;
		} else {
			this.content.removeAttribute("style");
		}

		this.el[classList].add(isShowingClass);
		this.el[classList].add(isOpenedClass);
		docElem[classList].add(iframeLightboxOpenClass);
		docBody[classList].add(iframeLightboxOpenClass);
		this.callCallback(this.onOpened, this);
	};

	IframeLightbox.prototype.close = function() {
		this.el[classList].remove(isOpenedClass);
		this.body[classList].remove(isLoadedClass);
		docElem[classList].remove(iframeLightboxOpenClass);
		docBody[classList].remove(iframeLightboxOpenClass);
		this.callCallback(this.onClosed, this);
	};

	IframeLightbox.prototype.isOpen = function() {
		return this.el[classList].contains(isOpenedClass);
	};

	IframeLightbox.prototype.callCallback = function(func, data) {
		if (typeof func !== "function") {
			return;
		}

		var caller = func.bind(this);
		caller(data);
	};

	root.IframeLightbox = IframeLightbox;
})("undefined" !== typeof window ? window : this, document);

/*!
 * @see {@link https://github.com/englishextra/img-lightbox}
 * imgLightbox
 * requires this very img-lightbox.js, and animate.css, img-lightbox.css
 * @params {String} linkClass
 * @params {Object} settings object
 * imgLightbox(linkClass, settings)
 * passes jshint
 */

/*jshint -W014 */
(function(root, document) {
	"use strict";

	var docElem = document.documentElement || "";
	var docBody = document.body || "";
	var animatedClass = "animated";
	var appendChild = "appendChild";
	var classList = "classList";
	var createElement = "createElement";
	var getAttribute = "getAttribute";
	var getElementsByClassName = "getElementsByClassName";
	var getElementsByTagName = "getElementsByTagName";
	var innerHTML = "innerHTML";
	var style = "style";
	var _addEventListener = "addEventListener";
	var _length = "length";
	var btnCloseClass = "btn-close";
	var containerClass = "img-lightbox";
	var fadeInClass = "fadeIn";
	var fadeInUpClass = "fadeInUp";
	var fadeOutClass = "fadeOut";
	var fadeOutDownClass = "fadeOutDown";
	var imgLightboxOpenClass = "img-lightbox--open";
	var imgLightboxLinkIsBindedClass = "img-lightbox-link--is-binded";
	var isLoadedClass = "is-loaded";
	var dummySrc =
		"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
	var isMobile = navigator.userAgent.match(
		/(iPad)|(iPhone)|(iPod)|(Android)|(PlayBook)|(BB10)|(BlackBerry)|(Opera Mini)|(IEMobile)|(webOS)|(MeeGo)/i
	);
	var isTouch =
		isMobile !== null ||
		document.createTouch !== undefined ||
		"ontouchstart" in root ||
		"onmsgesturechange" in root ||
		navigator.msMaxTouchPoints;

	var debounce = function debounce(func, wait) {
		var timeout;
		var args;
		var context;
		var timestamp;
		return function() {
			context = this;
			args = [].slice.call(arguments, 0);
			timestamp = new Date();

			var later = function later() {
				var last = new Date() - timestamp;

				if (last < wait) {
					timeout = setTimeout(later, wait - last);
				} else {
					timeout = null;
					func.apply(context, args);
				}
			};

			if (!timeout) {
				timeout = setTimeout(later, wait);
			}
		};
	};

	var callCallback = function callCallback(func, data) {
		if (typeof func !== "function") {
			return;
		}

		var caller = func.bind(this);
		caller(data);
	};

	var hideImgLightbox = function hideImgLightbox(callback) {
		var container =
			document[getElementsByClassName](containerClass)[0] || "";
		var img = container
			? container[getElementsByTagName]("img")[0] || ""
			: "";

		var hideContainer = function hideContainer() {
			container[classList].remove(fadeInClass);
			container[classList].add(fadeOutClass);

			var hideImg = function hideImg() {
				container[classList].remove(animatedClass);
				container[classList].remove(fadeOutClass);
				img[classList].remove(animatedClass);
				img[classList].remove(fadeOutDownClass);

				img.onload = function() {
					container[classList].remove(isLoadedClass);
				};

				img.src = dummySrc;
				container[style].display = "none";
				callCallback(callback, root);
			};

			var timer = setTimeout(function() {
				clearTimeout(timer);
				timer = null;
				hideImg();
			}, 400);
		};

		if (container && img) {
			img[classList].remove(fadeInUpClass);
			img[classList].add(fadeOutDownClass);
			var timer = setTimeout(function() {
				clearTimeout(timer);
				timer = null;
				hideContainer();
			}, 400);
		}

		docElem[classList].remove(imgLightboxOpenClass);
		docBody[classList].remove(imgLightboxOpenClass);
	};

	var imgLightbox = function imgLightbox(linkClass, settings) {
		var _linkClass = linkClass || "";

		var options = settings || {};
		var rate = options.rate || 500;
		var touch = options.touch;
		var onError = options.onError;
		var onLoaded = options.onLoaded;
		var onCreated = options.onCreated;
		var onClosed = options.onClosed;
		var link = document[getElementsByClassName](_linkClass) || "";
		var container = document[createElement]("div");
		container[classList].add(containerClass);
		var html = [];
		html.push('<img src="' + dummySrc + '" alt="" />');
		html.push(
			'<div class="half-circle-spinner"><div class="circle circle-1"></div><div class="circle circle-2"></div></div>'
		);
		html.push('<a href="javascript:void(0);" class="btn-close"></a>');
		container[innerHTML] = html.join("");
		docBody[appendChild](container);
		container = document[getElementsByClassName](containerClass)[0] || "";
		var img = container
			? container[getElementsByTagName]("img")[0] || ""
			: "";
		var btnClose = container
			? container[getElementsByClassName](btnCloseClass)[0] || ""
			: "";

		var handleImgLightboxContainer = function handleImgLightboxContainer() {
			hideImgLightbox(onClosed);
		};

		container[_addEventListener]("click", handleImgLightboxContainer);

		btnClose[_addEventListener]("click", handleImgLightboxContainer);

		root[_addEventListener]("keyup", function(ev) {
			if (27 === (ev.which || ev.keyCode)) {
				hideImgLightbox(onClosed);
			}
		});

		var arrange = function arrange(e) {
			var hrefString =
				e[getAttribute]("href") || e[getAttribute]("data-src") || "";
			var dataTouch = e[getAttribute]("data-touch") || "";

			if (!hrefString) {
				return;
			}

			var handleImgLightboxLink = function handleImgLightboxLink(ev) {
				ev.stopPropagation();
				ev.preventDefault();
				docElem[classList].add(imgLightboxOpenClass);
				docBody[classList].add(imgLightboxOpenClass);
				container[classList].remove(isLoadedClass);

				var logic = function logic() {
					if (onCreated) {
						callCallback(onCreated, root);
					}

					container[classList].add(animatedClass);
					container[classList].add(fadeInClass);
					img[classList].add(animatedClass);
					img[classList].add(fadeInUpClass);

					img.onload = function() {
						container[classList].add(isLoadedClass);

						if (onLoaded) {
							callCallback(onLoaded, root);
						}
					};

					img.onerror = function() {
						if (onError) {
							callCallback(onError, root);
						}
					};

					img.src = hrefString;
					container[style].display = "block";
				};

				debounce(logic, rate).call();
			};

			if (!e[classList].contains(imgLightboxLinkIsBindedClass)) {
				e[classList].add(imgLightboxLinkIsBindedClass);

				e[_addEventListener]("click", handleImgLightboxLink);

				if (isTouch && (touch || dataTouch)) {
					e[_addEventListener]("touchstart", handleImgLightboxLink);
				}
			}
		};

		if (container && img && link) {
			var i, l;

			for (i = 0, l = link[_length]; i < l; i += 1) {
				arrange(link[i]);
			}

			i = l = null;
		}
	};

	root.imgLightbox = imgLightbox;
})("undefined" !== typeof window ? window : this, document);

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
 * mustache.js - Logic-less {{mustache}} templates with JavaScript
 * http://github.com/janl/mustache.js
 * if (tokens == null) {
 * changed to: if (tokens === null || tokens === undefined)
 * != null changed to: !== null
 * parses jshint
 */

/*global define, exports */
(function defineMustache(global, factory) {
	if (
		(typeof exports === "undefined" ? "undefined" : _typeof(exports)) ===
			"object" &&
		exports &&
		typeof exports.nodeName !== "string"
	) {
		factory(exports);
	} else if (typeof define === "function" && define.amd) {
		define(["exports"], factory);
	} else {
		global.Mustache = {};
		factory(global.Mustache);
	}
})(this, function mustacheFactory(mustache) {
	var objectToString = Object.prototype.toString;

	var isArray =
		Array.isArray ||
		function isArrayPolyfill(object) {
			return objectToString.call(object) === "[object Array]";
		};

	function isFunction(object) {
		return typeof object === "function";
	}

	function typeStr(obj) {
		return isArray(obj) ? "array" : _typeof(obj);
	}

	function escapeRegExp(string) {
		return string.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
	}

	function hasProperty(obj, propName) {
		return obj !== null && _typeof(obj) === "object" && propName in obj;
	}

	var regExpTest = RegExp.prototype.test;

	function testRegExp(re, string) {
		return regExpTest.call(re, string);
	}

	var nonSpaceRe = /\S/;

	function isWhitespace(string) {
		return !testRegExp(nonSpaceRe, string);
	}

	var entityMap = {
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		'"': "&quot;",
		"'": "&#39;",
		"/": "&#x2F;",
		"`": "&#x60;",
		"=": "&#x3D;"
	};

	function escapeHtml(string) {
		return String(string).replace(/[&<>"'`=\/]/g, function fromEntityMap(
			s
		) {
			return entityMap[s];
		});
	}

	var whiteRe = /\s*/;
	var spaceRe = /\s+/;
	var equalsRe = /\s*=/;
	var curlyRe = /\s*\}/;
	var tagRe = /#|\^|\/|>|\{|&|=|!/;

	function squashTokens(tokens) {
		var squashedTokens = [];
		var token, lastToken;

		for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
			token = tokens[i];

			if (token) {
				if (
					token[0] === "text" &&
					lastToken &&
					lastToken[0] === "text"
				) {
					lastToken[1] += token[1];
					lastToken[3] = token[3];
				} else {
					squashedTokens.push(token);
					lastToken = token;
				}
			}
		}

		return squashedTokens;
	}

	function nestTokens(tokens) {
		var nestedTokens = [];
		var collector = nestedTokens;
		var sections = [];
		var token, section;

		for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
			token = tokens[i];

			switch (token[0]) {
				case "#":
				case "^":
					collector.push(token);
					sections.push(token);
					collector = token[4] = [];
					break;

				case "/":
					section = sections.pop();
					section[5] = token[2];
					collector =
						sections.length > 0
							? sections[sections.length - 1][4]
							: nestedTokens;
					break;

				default:
					collector.push(token);
			}
		}

		return nestedTokens;
	}

	function Scanner(string) {
		this.string = string;
		this.tail = string;
		this.pos = 0;
	}

	function parseTemplate(template, tags) {
		if (!template) {
			return [];
		}

		var sections = [];
		var tokens = [];
		var spaces = [];
		var hasTag = false;
		var nonSpace = false;

		function stripSpace() {
			if (hasTag && !nonSpace) {
				while (spaces.length) {
					delete tokens[spaces.pop()];
				}
			} else {
				spaces = [];
			}

			hasTag = false;
			nonSpace = false;
		}

		var openingTagRe, closingTagRe, closingCurlyRe;

		function compileTags(tagsToCompile) {
			if (typeof tagsToCompile === "string") {
				tagsToCompile = tagsToCompile.split(spaceRe, 2);
			}

			if (!isArray(tagsToCompile) || tagsToCompile.length !== 2) {
				throw new Error("Invalid tags: " + tagsToCompile);
			}

			openingTagRe = new RegExp(escapeRegExp(tagsToCompile[0]) + "\\s*");
			closingTagRe = new RegExp("\\s*" + escapeRegExp(tagsToCompile[1]));
			closingCurlyRe = new RegExp(
				"\\s*" + escapeRegExp("}" + tagsToCompile[1])
			);
		}

		compileTags(tags || mustache.tags);
		var scanner = new Scanner(template);
		var start, type, value, chr, token, openSection;

		while (!scanner.eos()) {
			start = scanner.pos;
			value = scanner.scanUntil(openingTagRe);

			if (value) {
				for (
					var i = 0, valueLength = value.length;
					i < valueLength;
					++i
				) {
					chr = value.charAt(i);

					if (isWhitespace(chr)) {
						spaces.push(tokens.length);
					} else {
						nonSpace = true;
					}

					tokens.push(["text", chr, start, start + 1]);
					start += 1;

					if (chr === "\n") {
						stripSpace();
					}
				}
			}

			if (!scanner.scan(openingTagRe)) {
				break;
			}

			hasTag = true;
			type = scanner.scan(tagRe) || "name";
			scanner.scan(whiteRe);

			if (type === "=") {
				value = scanner.scanUntil(equalsRe);
				scanner.scan(equalsRe);
				scanner.scanUntil(closingTagRe);
			} else if (type === "{") {
				value = scanner.scanUntil(closingCurlyRe);
				scanner.scan(curlyRe);
				scanner.scanUntil(closingTagRe);
				type = "&";
			} else {
				value = scanner.scanUntil(closingTagRe);
			}

			if (!scanner.scan(closingTagRe)) {
				throw new Error("Unclosed tag at " + scanner.pos);
			}

			token = [type, value, start, scanner.pos];
			tokens.push(token);

			if (type === "#" || type === "^") {
				sections.push(token);
			} else if (type === "/") {
				openSection = sections.pop();

				if (!openSection) {
					throw new Error(
						'Unopened section "' + value + '" at ' + start
					);
				}

				if (openSection[1] !== value) {
					throw new Error(
						'Unclosed section "' + openSection[1] + '" at ' + start
					);
				}
			} else if (type === "name" || type === "{" || type === "&") {
				nonSpace = true;
			} else if (type === "=") {
				compileTags(value);
			}
		}

		openSection = sections.pop();

		if (openSection) {
			throw new Error(
				'Unclosed section "' + openSection[1] + '" at ' + scanner.pos
			);
		}

		return nestTokens(squashTokens(tokens));
	}

	Scanner.prototype.eos = function eos() {
		return this.tail === "";
	};

	Scanner.prototype.scan = function scan(re) {
		var match = this.tail.match(re);

		if (!match || match.index !== 0) {
			return "";
		}

		var string = match[0];
		this.tail = this.tail.substring(string.length);
		this.pos += string.length;
		return string;
	};

	Scanner.prototype.scanUntil = function scanUntil(re) {
		var index = this.tail.search(re),
			match;

		switch (index) {
			case -1:
				match = this.tail;
				this.tail = "";
				break;

			case 0:
				match = "";
				break;

			default:
				match = this.tail.substring(0, index);
				this.tail = this.tail.substring(index);
		}

		this.pos += match.length;
		return match;
	};

	function Context(view, parentContext) {
		this.view = view;
		this.cache = {
			".": this.view
		};
		this.parent = parentContext;
	}

	Context.prototype.push = function push(view) {
		return new Context(view, this);
	};

	Context.prototype.lookup = function lookup(name) {
		var cache = this.cache;
		var value;

		if (cache.hasOwnProperty(name)) {
			value = cache[name];
		} else {
			var context = this,
				names,
				index,
				lookupHit = false;

			while (context) {
				if (name.indexOf(".") > 0) {
					value = context.view;
					names = name.split(".");
					index = 0;

					while (value !== null && index < names.length) {
						if (index === names.length - 1) {
							lookupHit = hasProperty(value, names[index]);
						}

						value = value[names[index++]];
					}
				} else {
					value = context.view[name];
					lookupHit = hasProperty(context.view, name);
				}

				if (lookupHit) {
					break;
				}

				context = context.parent;
			}

			cache[name] = value;
		}

		if (isFunction(value)) {
			value = value.call(this.view);
		}

		return value;
	};

	function Writer() {
		this.cache = {};
	}

	Writer.prototype.clearCache = function clearCache() {
		this.cache = {};
	};

	Writer.prototype.parse = function parse(template, tags) {
		var cache = this.cache;
		var tokens = cache[template];

		if (tokens === null || tokens === undefined) {
			tokens = cache[template] = parseTemplate(template, tags);
		}

		return tokens;
	};

	Writer.prototype.render = function render(template, view, partials) {
		var tokens = this.parse(template);
		var context = view instanceof Context ? view : new Context(view);
		return this.renderTokens(tokens, context, partials, template);
	};

	Writer.prototype.renderTokens = function renderTokens(
		tokens,
		context,
		partials,
		originalTemplate
	) {
		var buffer = "";
		var token, symbol, value;

		for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
			value = undefined;
			token = tokens[i];
			symbol = token[0];

			if (symbol === "#") {
				value = this.renderSection(
					token,
					context,
					partials,
					originalTemplate
				);
			} else if (symbol === "^") {
				value = this.renderInverted(
					token,
					context,
					partials,
					originalTemplate
				);
			} else if (symbol === ">") {
				value = this.renderPartial(
					token,
					context,
					partials,
					originalTemplate
				);
			} else if (symbol === "&") {
				value = this.unescapedValue(token, context);
			} else if (symbol === "name") {
				value = this.escapedValue(token, context);
			} else if (symbol === "text") {
				value = this.rawValue(token);
			}

			if (value !== undefined) {
				buffer += value;
			}
		}

		return buffer;
	};

	Writer.prototype.renderSection = function renderSection(
		token,
		context,
		partials,
		originalTemplate
	) {
		var self = this;
		var buffer = "";
		var value = context.lookup(token[1]);

		function subRender(template) {
			return self.render(template, context, partials);
		}

		if (!value) {
			return;
		}

		if (isArray(value)) {
			for (var j = 0, valueLength = value.length; j < valueLength; ++j) {
				buffer += this.renderTokens(
					token[4],
					context.push(value[j]),
					partials,
					originalTemplate
				);
			}
		} else if (
			_typeof(value) === "object" ||
			typeof value === "string" ||
			typeof value === "number"
		) {
			buffer += this.renderTokens(
				token[4],
				context.push(value),
				partials,
				originalTemplate
			);
		} else if (isFunction(value)) {
			if (typeof originalTemplate !== "string") {
				throw new Error(
					"Cannot use higher-order sections without the original template"
				);
			}

			value = value.call(
				context.view,
				originalTemplate.slice(token[3], token[5]),
				subRender
			);

			if (value !== null) {
				buffer += value;
			}
		} else {
			buffer += this.renderTokens(
				token[4],
				context,
				partials,
				originalTemplate
			);
		}

		return buffer;
	};

	Writer.prototype.renderInverted = function renderInverted(
		token,
		context,
		partials,
		originalTemplate
	) {
		var value = context.lookup(token[1]);

		if (!value || (isArray(value) && value.length === 0)) {
			return this.renderTokens(
				token[4],
				context,
				partials,
				originalTemplate
			);
		}
	};

	Writer.prototype.renderPartial = function renderPartial(
		token,
		context,
		partials
	) {
		if (!partials) {
			return;
		}

		var value = isFunction(partials)
			? partials(token[1])
			: partials[token[1]];

		if (value !== null) {
			return this.renderTokens(
				this.parse(value),
				context,
				partials,
				value
			);
		}
	};

	Writer.prototype.unescapedValue = function unescapedValue(token, context) {
		var value = context.lookup(token[1]);

		if (value !== null) {
			return value;
		}
	};

	Writer.prototype.escapedValue = function escapedValue(token, context) {
		var value = context.lookup(token[1]);

		if (value !== null) {
			return mustache.escape(value);
		}
	};

	Writer.prototype.rawValue = function rawValue(token) {
		return token[1];
	};

	mustache.name = "mustache.js";
	mustache.version = "2.3.2";
	mustache.tags = ["{{", "}}"];
	var defaultWriter = new Writer();

	mustache.clearCache = function clearCache() {
		return defaultWriter.clearCache();
	};

	mustache.parse = function parse(template, tags) {
		return defaultWriter.parse(template, tags);
	};

	mustache.render = function render(template, view, partials) {
		if (typeof template !== "string") {
			throw new TypeError(
				'Invalid template! Template should be a "string" ' +
					'but "' +
					typeStr(template) +
					'" was given as the first ' +
					"argument for mustache#render(template, view, partials)"
			);
		}

		return defaultWriter.render(template, view, partials);
	};

	mustache.to_html = function to_html(template, view, partials, send) {
		var result = mustache.render(template, view, partials);

		if (isFunction(send)) {
			send(result);
		} else {
			return result;
		}
	};

	mustache.escape = escapeHtml;
	mustache.Scanner = Scanner;
	mustache.Context = Context;
	mustache.Writer = Writer;
	return mustache;
});

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
 * EventEmitter v5.2.5 - git.io/ee
 * Unlicense - http://unlicense.org/
 * Oliver Caldwell - http://oli.me.uk/
 * @preserve
 */

/*!
 * @see {@link https://github.com/Olical/EventEmitter}
 * passes jshint
 */
(function(exports) {
	"use strict";

	function EventEmitter() {}

	var proto = EventEmitter.prototype;
	var originalGlobalValue = exports.EventEmitter;

	function indexOfListener(listeners, listener) {
		var i = listeners.length;

		while (i--) {
			if (listeners[i].listener === listener) {
				return i;
			}
		}

		return -1;
	}

	function alias(name) {
		return function aliasClosure() {
			return this[name].apply(this, arguments);
		};
	}

	proto.getListeners = function getListeners(evt) {
		var events = this._getEvents();

		var response;
		var key;

		if (evt instanceof RegExp) {
			response = {};

			for (key in events) {
				if (events.hasOwnProperty(key) && evt.test(key)) {
					response[key] = events[key];
				}
			}
		} else {
			response = events[evt] || (events[evt] = []);
		}

		return response;
	};

	proto.flattenListeners = function flattenListeners(listeners) {
		var flatListeners = [];
		var i;

		for (i = 0; i < listeners.length; i += 1) {
			flatListeners.push(listeners[i].listener);
		}

		return flatListeners;
	};

	proto.getListenersAsObject = function getListenersAsObject(evt) {
		var listeners = this.getListeners(evt);
		var response;

		if (listeners instanceof Array) {
			response = {};
			response[evt] = listeners;
		}

		return response || listeners;
	};

	function isValidListener(listener) {
		if (typeof listener === "function" || listener instanceof RegExp) {
			return true;
		} else if (listener && _typeof(listener) === "object") {
			return isValidListener(listener.listener);
		} else {
			return false;
		}
	}

	proto.addListener = function addListener(evt, listener) {
		if (!isValidListener(listener)) {
			throw new TypeError("listener must be a function");
		}

		var listeners = this.getListenersAsObject(evt);
		var listenerIsWrapped = _typeof(listener) === "object";
		var key;

		for (key in listeners) {
			if (
				listeners.hasOwnProperty(key) &&
				indexOfListener(listeners[key], listener) === -1
			) {
				listeners[key].push(
					listenerIsWrapped
						? listener
						: {
								listener: listener,
								once: false
						  }
				);
			}
		}

		return this;
	};

	proto.on = alias("addListener");

	proto.addOnceListener = function addOnceListener(evt, listener) {
		return this.addListener(evt, {
			listener: listener,
			once: true
		});
	};

	proto.once = alias("addOnceListener");

	proto.defineEvent = function defineEvent(evt) {
		this.getListeners(evt);
		return this;
	};

	proto.defineEvents = function defineEvents(evts) {
		for (var i = 0; i < evts.length; i += 1) {
			this.defineEvent(evts[i]);
		}

		return this;
	};

	proto.removeListener = function removeListener(evt, listener) {
		var listeners = this.getListenersAsObject(evt);
		var index;
		var key;

		for (key in listeners) {
			if (listeners.hasOwnProperty(key)) {
				index = indexOfListener(listeners[key], listener);

				if (index !== -1) {
					listeners[key].splice(index, 1);
				}
			}
		}

		return this;
	};

	proto.off = alias("removeListener");

	proto.addListeners = function addListeners(evt, listeners) {
		return this.manipulateListeners(false, evt, listeners);
	};

	proto.removeListeners = function removeListeners(evt, listeners) {
		return this.manipulateListeners(true, evt, listeners);
	};

	proto.manipulateListeners = function manipulateListeners(
		remove,
		evt,
		listeners
	) {
		var i;
		var value;
		var single = remove ? this.removeListener : this.addListener;
		var multiple = remove ? this.removeListeners : this.addListeners;

		if (_typeof(evt) === "object" && !(evt instanceof RegExp)) {
			for (i in evt) {
				if (evt.hasOwnProperty(i) && (value = evt[i])) {
					if (typeof value === "function") {
						single.call(this, i, value);
					} else {
						multiple.call(this, i, value);
					}
				}
			}
		} else {
			i = listeners.length;

			while (i--) {
				single.call(this, evt, listeners[i]);
			}
		}

		return this;
	};

	proto.removeEvent = function removeEvent(evt) {
		var type = _typeof(evt);

		var events = this._getEvents();

		var key;

		if (type === "string") {
			delete events[evt];
		} else if (evt instanceof RegExp) {
			for (key in events) {
				if (events.hasOwnProperty(key) && evt.test(key)) {
					delete events[key];
				}
			}
		} else {
			delete this._events;
		}

		return this;
	};

	proto.removeAllListeners = alias("removeEvent");

	proto.emitEvent = function emitEvent(evt, args) {
		var listenersMap = this.getListenersAsObject(evt);
		var listeners;
		var listener;
		var i;
		var key;
		var response;

		for (key in listenersMap) {
			if (listenersMap.hasOwnProperty(key)) {
				listeners = listenersMap[key].slice(0);

				for (i = 0; i < listeners.length; i++) {
					listener = listeners[i];

					if (listener.once === true) {
						this.removeListener(evt, listener.listener);
					}

					response = listener.listener.apply(this, args || []);

					if (response === this._getOnceReturnValue()) {
						this.removeListener(evt, listener.listener);
					}
				}
			}
		}

		return this;
	};

	proto.trigger = alias("emitEvent");

	proto.emit = function emit(evt) {
		var args = Array.prototype.slice.call(arguments, 1);
		return this.emitEvent(evt, args);
	};

	proto.setOnceReturnValue = function setOnceReturnValue(value) {
		this._onceReturnValue = value;
		return this;
	};

	proto._getOnceReturnValue = function _getOnceReturnValue() {
		if (this.hasOwnProperty("_onceReturnValue")) {
			return this._onceReturnValue;
		} else {
			return true;
		}
	};

	proto._getEvents = function _getEvents() {
		return this._events || (this._events = {});
	};

	EventEmitter.noConflict = function noConflict() {
		exports.EventEmitter = originalGlobalValue;
		return EventEmitter;
	};

	if (typeof define === "function" && define.amd) {
		define(function() {
			return EventEmitter;
		});
	} else if (
		(typeof module === "undefined" ? "undefined" : _typeof(module)) ===
			"object" &&
		module.exports
	) {
		module.exports = EventEmitter;
	} else {
		exports.EventEmitter = EventEmitter;
	}
})(typeof window !== "undefined" ? window : this || {});
