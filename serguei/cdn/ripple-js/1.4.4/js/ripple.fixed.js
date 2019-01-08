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
(function (root, document) {
	"use strict";
	var ripple = (function () {
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
			if ((rippleContainer.getAttribute("animating") === "0" || !rippleContainer.hasAttribute("animating")) && e.target.classList.contains("ripple")) {
				rippleContainer.setAttribute("animating", "1");
				var offsetX = typeof e.offsetX === "number" ? e.offsetX : e.touches[0].clientX - e.target.getBoundingClientRect().left;
				var offsetY = typeof e.offsetY === "number" ? e.offsetY : e.touches[0].clientY - e.target.getBoundingClientRect().top;
				var fullCoverRadius = Math.max(Math.sqrt(Math.pow(offsetX, 2) + Math.pow(offsetY, 2)), Math.sqrt(Math.pow(e.target.clientWidth - offsetX, 2) + Math.pow(e.target.clientHeight - offsetY, 2)), Math.sqrt(Math.pow(offsetX, 2) + Math.pow(e.target.clientHeight - offsetY, 2)), Math.sqrt(Math.pow(offsetY, 2) + Math.pow(e.target.clientWidth - offsetX, 2)));
				var expandTime = e.target.getAttribute("ripple-press-expand-time") || 3;
				rippleContainer.style.transition = "transform " + expandTime + "s ease-out, box-shadow 0.1s linear";
				rippleContainer.style.background = e.target.getAttribute("ripple-color") || "white";
				rippleContainer.style.opacity = e.target.getAttribute("ripple-opacity") || "0.6";
				rippleContainer.style.boxShadow = e.target.getAttribute("ripple-shadow") || "none";
				rippleContainer.style.top = offsetY + "px";
				rippleContainer.style.left = offsetX + "px";
				rippleContainer.style.transform = "translate(-50%, -50%) scale(" + fullCoverRadius / 100 + ")";
			}
		}
		function rippleEnd(e) {
			var rippleContainer = getRippleContainer(e.target);
			if (rippleContainer.getAttribute("animating") === "1") {
				rippleContainer.setAttribute("animating", "2");
				var background = root.getComputedStyle(rippleContainer, null).getPropertyValue("background");
				var destinationRadius = e.target.clientWidth + e.target.clientHeight;
				rippleContainer.style.transition = "none";
				var expandTime = e.target.getAttribute("ripple-release-expand-time") || 0.4;
				rippleContainer.style.transition = "transform " + expandTime + "s linear, background " + expandTime + "s linear, opacity " + expandTime + "s ease-in-out";
				rippleContainer.style.transform = "translate(-50%, -50%) scale(" + destinationRadius / 100 + ")";
				rippleContainer.style.background = "radial-gradient(transparent 10%, " + background + " 40%)";
				rippleContainer.style.opacity = "0";
				e.target.dispatchEvent(new CustomEvent("ripple-button-click", {
						target: e.target
					}));
				var Fn = Function;
				new Fn("" + e.target.getAttribute("onrippleclick")).call(root);
			}
		}
		function rippleRetrieve(e) {
			var rippleContainer = getRippleContainer(e.target);
			if (rippleContainer.style.transform === "translate(-50%, -50%) scale(0)") {
				rippleContainer.setAttribute("animating", "0");
			}
			if (rippleContainer.getAttribute("animating") === "1") {
				rippleContainer.setAttribute("animating", "3");
				var collapseTime = e.target.getAttribute("ripple-leave-collapse-time") || 0.4;
				rippleContainer.style.transition = "transform " + collapseTime + "s linear, box-shadow " + collapseTime + "s linear";
				rippleContainer.style.boxShadow = "none";
				rippleContainer.style.transform = "translate(-50%, -50%) scale(0)";
			}
		}
		var ripple = {
			registerRipples: function () {
				var rippleButtons = document.getElementsByClassName("ripple");
				var i;
				var fn1 = function () {
					rippleButtons[i].addEventListener("touchstart", function (e) {
						rippleStart(e);
					}, {
						passive: true
					});
					rippleButtons[i].addEventListener("touchmove", function (e) {
						if (e.target.hasAttribute("ripple-cancel-on-move")) {
							rippleRetrieve(e);
							return;
						}
						var overEl;
						try {
							/* overEl = document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY).className.indexOf("ripple") >= 0; */
							overEl = document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY).classList.contains("ripple");
						} catch (err) {
							overEl = false;
						}
						if (!overEl) {
							rippleRetrieve(e);
						}
					}, {
						passive: true
					});
					rippleButtons[i].addEventListener("touchend", function (e) {
						rippleEnd(e);
					}, {
						passive: true
					});
					rippleButtons[i].addEventListener("mousedown", function (e) {
						rippleStart(e);
					}, {
						passive: true
					});
					rippleButtons[i].addEventListener("mouseup", function (e) {
						rippleEnd(e);
					}, {
						passive: true
					});
					rippleButtons[i].addEventListener("mousemove", function (e) {
						if (e.target.hasAttribute("ripple-cancel-on-move") && (e.movementX !== 0 || e.movementY !== 0)) {
							rippleRetrieve(e);
						}
					}, {
						passive: true
					});
					rippleButtons[i].addEventListener("mouseleave", function (e) {
						rippleRetrieve(e);
					}, {
						passive: true
					});
					rippleButtons[i].addEventListener("transitionend", function (e) {
						if (e.target.getAttribute("animating") === "2" || e.target.getAttribute("animating") === "3") {
							e.target.style.transition = "none";
							e.target.style.transform = "translate(-50%, -50%) scale(0)";
							e.target.style.boxShadow = "none";
							e.target.setAttribute("animating", "0");
						}
					}, {
						passive: true
					});
					if (getRippleContainer(rippleButtons[i]) === rippleButtons[i]) {
						rippleButtons[i].innerHTML += '<div class="rippleContainer"></div>';
					}
				};
				var isBindedRippleClass = "ripple--is-binded";
				for (i = 0; i < rippleButtons.length; i++) {
					if (!rippleButtons[i].classList.contains(isBindedRippleClass)) {
						rippleButtons[i].classList.add(isBindedRippleClass);
						fn1();
					}
				}
			},
			ripple: function (el) {
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
			css.innerHTML = ".ripple { overflow: hidden !important; position: relative; } .ripple .rippleContainer { display: block; height: 200px !important; width: 200px !important; padding: 0px 0px 0px 0px; border-radius: 50%; position: absolute !important; top: 0px; left: 0px; transform: translate(-50%, -50%) scale(0); -webkit-transform: translate(-50%, -50%) scale(0); -ms-transform: translate(-50%, -50%) scale(0); background-color: transparent; } .ripple * {pointer-events: none !important;}";
			document.head.appendChild(css);
			ripple.registerRipples();
		/* }); */
		return ripple;
	})
	();
	root.ripple = ripple;
})("undefined" !== typeof window ? window : this, document);
