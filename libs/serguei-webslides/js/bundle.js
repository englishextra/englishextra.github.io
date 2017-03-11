/*!
 * modified ToProgress v0.1.1
 * http://github.com/djyde/ToProgress
 * gist.github.com/englishextra/6a8c79c9efbf1f2f50523d46a918b785
 * jsfiddle.net/englishextra/z5xhjde8/
 * arguments.callee changed to TP, a local wrapper function,
 * so that public function name is now customizable;
 * wrapped in curly brackets:
 * else{document.body.appendChild(this.progressBar);};
 * removed module check
 * added window check
 * passes jshint
 */
var ToProgress=(function(){if("undefined"==typeof window||!("document"in window)){return console.log("window is undefined or document is not in window"),!1;}var TP=function(){function t(){var s=document.createElement("fakeelement"),i={transition:"transitionend",OTransition:"oTransitionEnd",MozTransition:"transitionend",WebkitTransition:"webkitTransitionEnd"};for(var j in i){if(i.hasOwnProperty(j)){if(void 0!==s.style[j]){return i[j];}}}}function s(t,a){if(this.progress=0,this.options={id:"top-progress-bar",color:"#F44336",height:"2px",duration:0.2},t&&"object"==typeof t){for(var i in t){if(t.hasOwnProperty(i)){this.options[i]=t[i];}}}if(this.options.opacityDuration=3*this.options.duration,this.progressBar=document.createElement("div"),this.progressBar.id=this.options.id,this.progressBar.setCSS=function(t){for(var a in t){if(t.hasOwnProperty(a)){this.style[a]=t[a];}}},this.progressBar.setCSS({position:a?"relative":"fixed",top:"0",left:"0",right:"0","background-color":this.options.color,height:this.options.height,width:"0%",transition:"width "+this.options.duration+"s, opacity "+this.options.opacityDuration+"s","-moz-transition":"width "+this.options.duration+"s, opacity "+this.options.opacityDuration+"s","-webkit-transition":"width "+this.options.duration+"s, opacity "+this.options.opacityDuration+"s"}),a){var o=document.querySelector(a);if(o){if(o.hasChildNodes()){o.insertBefore(this.progressBar,o.firstChild);}else{o.appendChild(this.progressBar);}}}else{document.body.appendChild(this.progressBar);}}var i=t();return s.prototype.transit=function(){this.progressBar.style.width=this.progress+"%";},s.prototype.getProgress=function(){return this.progress;},s.prototype.setProgress=function(t,s){this.show();this.progress=t>100?100:0>t?0:t;this.transit();if(s){s();}},s.prototype.increase=function(t,s){this.show();this.setProgress(this.progress+t,s);},s.prototype.decrease=function(t,s){this.show();this.setProgress(this.progress-t,s);},s.prototype.finish=function(t){var s=this;this.setProgress(100,t);this.hide();if(i){this.progressBar.addEventListener(i,function(t){s.reset();s.progressBar.removeEventListener(t.type,TP);});}},s.prototype.reset=function(t){this.progress=0;this.transit();if(t){t();}},s.prototype.hide=function(){this.progressBar.style.opacity="0";},s.prototype.show=function(){this.progressBar.style.opacity="1";},s;};return TP();}());
/*!
 * A function for elements selection - v0.1.9
 * github.com/finom/bala
 * @param {String} a id, class or tag string
 * @param {String|Object} [b] context tag string or HTML Element object
 * a=BALA("sometag/#someid/.someclass"[,someParent]);
 * a=BALA.one("sometag/#someid/.someclass"[,someParent]);
 * global $ becomes var g
 * renamed function $ to g
 * added window check
 * source: github.com/finom/bala/blob/master/bala.js
 * passes jshint
 */
var BALA=(function(){if("undefined"==typeof window||!("document"in window)){return console.log("window is undefined or document is not in window"),!1;}var g=(function(document,s_addEventListener,s_querySelectorAll){function g(s,context,bala){bala=Object.create(g.fn);if(s){bala.push.apply(bala,s[s_addEventListener]?[s]:""+s===s?/</.test(s)?((context=document.createElement(context||s_addEventListener)).innerHTML=s,context.children):context?((context=g(context)[0])?context[s_querySelectorAll](s):bala):document[s_querySelectorAll](s):typeof s=='function'?document.readyState[7]?s():document[s_addEventListener]('DOMContentLoaded',s):s);}return bala;}g.fn=[];g.one=function(s,context){return g(s,context)[0]||null;};return g;})(document,'addEventListener','querySelectorAll');return g;}());
/*!
 * safe way to handle console.log():
 * sitepoint.com/safe-console-log/
 */
/* jshint ignore:start */
if ("undefined" === typeof console) {
	console = {};
	console.log = function () {
		return;
	};
}
/* jshint ignore:end */
/*!
 * modified MediaHack - (c) 2013 Pomke Nohkan MIT LICENCED.
 * gist.github.com/englishextra/ff8c9dde94abe32a9d7c4a65e0f2ccac
 * jsfiddle.net/englishextra/xg7ce8kc/
 * removed className fallback and additionally
 * returns earlyDeviceOrientation,earlyDeviceSize
 * Add media query classes to DOM nodes
 * github.com/pomke/mediahack/blob/master/mediahack.js
 */
var earlyDeviceOrientation="",earlyDeviceSize="";(function(w,e){var f=function(a){var b=a.split(" ");if(e){for(var c=0;c<b.length;c++){a=b[c];e.add(a);}}},g=function(a){var b=a.split(" ");if(e){for(var c=0;c<b.length;c++){a=b[c];e.remove(a);}}},h={landscape:"all and (orientation:landscape)",portrait:"all and (orientation:portrait)"},k={small:"all and (max-width:768px)",medium:"all and (min-width:768px) and (max-width:991px)",large:"all and (min-width:992px)"},d,mM="matchMedia",m="matches",o=function(a,b){var c=function(a){if(a[m]){f(b);earlyDeviceOrientation=b;}else{g(b);}};c(a);a.addListener(c);},s=function(a,b){var c=function(a){if(a[m]){f(b);earlyDeviceSize=b;}else{g(b);}};c(a);a.addListener(c);};for(d in h){if(h.hasOwnProperty(d)){o(w[mM](h[d]),d);}}for(d in k){if(k.hasOwnProperty(d)){s(w[mM](k[d]),d);}}})(window,document.documentElement.classList||"");
/*!
 * add mobile or desktop class
 * using Detect Mobile Browsers | Open source mobile phone detection
 * Regex updated: 1 August 2014
 * detectmobilebrowsers.com
 * github.com/heikojansen/plack-middleware-detectmobilebrowsers
 */
var earlyDeviceType="";(function(d,h,k,n){var c=/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(n)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(n.substr(0,4))?h:k;if(d&&c){d.classList.add(c);earlyDeviceType=c;}}(document.documentElement||"","mobile","desktop",navigator.userAgent||navigator.vendor||window.opera));
/*!
 * add svg support class
 */
var earlySvgSupport="";(function(d,s){var c=document.implementation.hasFeature("http://www.w3.org/2000/svg","1.1")?s:"no-"+s;(earlySvgSupport=c);if(d&&c){d.classList.add(c);}}(document.documentElement||"","svg"));
/*!
 * add svgasimg support class
 */
var earlySvgasimgSupport="";(function(d,s){var c=document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image","1.1")?s:"no-"+s;(earlySvgasimgSupport=c);if(d&&c){d.classList.add(c);}}(document.documentElement||"","svgasimg"));
/*!
 * add touch support class
 * gist.github.com/englishextra/3cb22aab31a52b6760b5921e4fe8db95
 * jsfiddle.net/englishextra/z5xhjde8/
 */
var earlyHasTouch="";(function(d,s){if(d){var c="ontouchstart"in d?s:"no-"+s;earlyHasTouch=c;d.classList.add(c);}}(document.documentElement||"","touch"));
/*!
 * return date in YYYY-MM-DD format
 */
var earlyFnGetYyyymmdd=function(){"use strict";var a=(new Date()),b=a.getDate(),d=a.getFullYear(),c=a.getMonth();(c+=1);if(10>b){b="0"+b;}if(10>c){c="0"+c;}return d+"-"+c+"-"+b;}();
/*!
 * append details to title
 */
var initialDocumentTitle = document.title || "",
userBrowsingDetails = " [" + (earlyFnGetYyyymmdd ? earlyFnGetYyyymmdd : "") + (earlyDeviceType ? " " + earlyDeviceType : "") + (earlyDeviceSize ? " " + earlyDeviceSize : "") + (earlyDeviceOrientation ? " " + earlyDeviceOrientation : "") + (earlySvgSupport ? " " + earlySvgSupport : "") + (earlySvgasimgSupport ? " " + earlySvgasimgSupport : "") + (earlyHasTouch ? " " + earlyHasTouch : "") + "]";
if (document.title) {
	document.title = document.title + userBrowsingDetails;
}
/*!
 * modified Evento - v1.0.0
 * by Erik Royall <erikroyalL@hotmail.com> (http://erikroyall.github.io)
 * Dual licensed under MIT and GPL
 * identifier needs binding if its function has arguments
 * var fn=function(a){a=a||"";if(a){return a;}};
 * evento.add(window,"load",fn.bind(null,some_value));
 * removed Array.prototype.indexOf shim
 * removed Helio stuff which seems to be added
 * for some other library, and works without Helio
 * jsbin.com/jilevi/edit?html,js,output
 * jsfiddle.net/englishextra/hLxyvmcm/
 * exposed as window property
 * added window check
 * source: gist.github.com/erikroyall/6618740
 * source: gist.github.com/englishextra/3a959e4da0fcc268b140
 * passes jshint
 */
var evento=(function(){return function(){if("undefined"==typeof window||!("document"in window)){return console.log("window is undefined or document is not in window"),!1;}var win=window,doc=win.document,_handlers={},addEvent,removeEvent,triggerEvent;addEvent=(function(){if(typeof doc.addEventListener==="function"){return function(el,evt,fn){el.addEventListener(evt,fn,false);_handlers[el]=_handlers[el]||{};_handlers[el][evt]=_handlers[el][evt]||[];_handlers[el][evt].push(fn);};}else if(typeof doc.attachEvent==="function"){return function(el,evt,fn){el.attachEvent(evt,fn);_handlers[el]=_handlers[el]||{};_handlers[el][evt]=_handlers[el][evt]||[];_handlers[el][evt].push(fn);};}else{return function(el,evt,fn){el["on"+evt]=fn;_handlers[el]=_handlers[el]||{};_handlers[el][evt]=_handlers[el][evt]||[];_handlers[el][evt].push(fn);};}}());removeEvent=(function(){if(typeof doc.removeEventListener==="function"){return function(el,evt,fn){el.removeEventListener(evt,fn,false);};}else if(typeof doc.detachEvent==="function"){return function(el,evt,fn){el.detachEvent(evt,fn);};}else{return function(el,evt,fn){el["on"+evt]=undefined;};}}());triggerEvent=function(el,evt){_handlers[el]=_handlers[el]||{};_handlers[el][evt]=_handlers[el][evt]||[];for(var _i=0,_l=_handlers[el][evt].length;_i<_l;_i+=1){_handlers[el][evt][_i]();}};return{add:addEvent,remove:removeEvent,trigger:triggerEvent,_handlers:_handlers};}();}());
/*!
 * set style opacity of an element
 * @param {Object} a an HTML Element
 * @param {Number} n any positive decimal number 0.00-1.00
 * setStyleOpacity(a,n)
 */
var setStyleOpacity=function(a,n){n=n||1;return function(){if(a){a.style.opacity=n;}}();};
/*!
 * init ToProgress and extend methods
 */
var progressBar = new ToProgress({
		id : "top-progress-bar",
		color : "#FF5454",
		height : "3px",
		duration : 0.2
	});
/*!
 * @memberof progressBar
 * @param {Int} [n] a whole positive number
 * progressBar.init(n)
 */
progressBar.init = function (n) {
	n = n || 20;
	return this.increase(n);
};
/*!
 * @memberof progressBar
 * progressBar.complete()
 */
progressBar.complete = function () {
	return this.finish(),
	this.hide();
};
progressBar.init();
/*!
 * init webslides
 */
var initWebslides = function() {
	if ("undefined" !== window.jQuery) {
		/*==================================================================
		Name: WebSlides
		Version: Pro (trackpad gestures and keyboard shortcuts).
		Description: HTML presentations made easy.
		URL: https://github.com/jlantunez/WebSlides
		Thanks @LuisSacristan for your help :)
		-
		Based on SimpleSlides, by Jenn Schiffer:
		https://github.com/jennschiffer/SimpleSlides
		source: github.com/jlantunez/webslides/blob/master/static/js/webslides.js
		==================================================================== */
		/* jshint -W041 */
		jQuery(document).ready(function ($) {
			var ID = {
				slideshow: 'webslides',
				slide: 'slide',
				counter: 'counter',
				navigation: 'navigation',
				next: 'next',
				previous: 'previous',
				current: 'current',
				verticalClass: 'vertical' // #webslides.vertical - You must add this class to slideshow for vertical sliding
			};
			var easing = 'swing';
			var slideOffset = 50; // minimun number of pixels for sliding
			var verticalDelay = 150; // to avoid 2 slides in a row
			var wheelDetail = -6; // how far the wheel turned for Firefox
			var wheelDelta = 150; // how far the wheel turned for Chrome
			var isMobile = ('ontouchstart' in document.documentElement && navigator.userAgent.match(/Mobi/));
			var $slideshow = jQuery('#' + ID.slideshow),
			$navigation = jQuery('<div>').attr('id', 'navigation'),
			$slides = $slideshow.children('section').addClass(ID.slide),
			$currentSlide,
			$firstSlide = $slides.first(),
			$lastSlide = $slides.last(),
			$auxSlide = null;
			var total = $slides.length;
			var labels = {
				next: $slideshow.hasClass(ID.verticalClass) ? '&darr;' : '&rarr;',
				previous: $slideshow.hasClass(ID.verticalClass) ? '&uarr;' : '&larr;',
				separator: ' / '
			};
			// make sure the last slide doesn't page break while printing.
			jQuery('head').append('<style> .slide:nth-child(' + total + ') { page-break-after: auto }</style>');
			// remove non-section children (like html comments which wp wraps in <p> tags)
			$slideshow.children().not('section').remove();
			// add navigational arrows and counter
			$navigation.append(jQuery('<a href="#" title="Предыдущий">').attr('id', ID.previous).html(labels.previous));
			$navigation.append(jQuery('<a href="#" title="Следующий">').attr('id', ID.next).html(labels.next));
			$slideshow.append($navigation);
			$slideshow.append(jQuery('<span>').attr('id', ID.counter));
			var $counter = jQuery('#' + ID.counter),
			$next = jQuery('#' + ID.next),
			$previous = jQuery('#' + ID.previous);
			$navigation.append($counter);
			/*** FUNCTIONS ***/
			var updateCounter = function () {
				// updates the counter
				$counter.text(slidePointer.current + labels.separator + slidePointer.last);
			};
			var updateURL = function () {
				// updates slide state
				var currentURL = document.location.toString();
				if (currentURL.indexOf('#') != 1) {
					currentURL = currentURL.substr(0, currentURL.indexOf('#'));
				}
				history.pushState(null, null, '#slide=' + slidePointer.current);
			};
			var hideCurrentSlide = function () {
				// hide the current slide
				if ($currentSlide) {
					$currentSlide.hide().removeClass(ID.current);
				}
			};
			$slideshow.data('moving', false);
			var nextSlide = function () {
				var nextSlide;
				if ($slideshow.hasClass(ID.verticalClass) && !isMobile) { // Is vertical
					if ($slideshow.data('moving'))
						return;
					$slideshow.data('moving', true);
					jQuery('html').css({
						overflow: 'hidden'
					});
					nextSlide = $currentSlide.next();
					slidePointer.current = ((slidePointer.current + 1) % total);
					if (slidePointer.current === 0)
						slidePointer.current = total;
					// show next slide
					nextSlide.show().addClass(ID.current);
					// scroll to next slide
					var animated = false;
					jQuery('html, body').animate({
						scrollTop: nextSlide.offset().top
					}, 500, easing, function () {
						if (!animated) {
							$currentSlide.hide().removeClass(ID.current);
							$currentSlide.siblings('.slide').last().after($currentSlide);
							$currentSlide = nextSlide;
							// update counter
							updateCounter();
							// update url
							updateURL();
							// fire slide event
							fireSlideEvent();
							jQuery('html').css({
								overflow: 'auto'
							});
							setTimeout(function () {
								$slideshow.data('moving', false);
							}, $slideshow.data('iswheel') ? verticalDelay : 0);
						}
						animated = true;
					});
				} else { // Is landscape
					jQuery("html, body").animate({
						scrollTop: 0
					}, 0);
					// hide current slide
					hideCurrentSlide();
					// get the next slide
					nextSlide = $currentSlide.next();
					nextSlide.show().addClass(ID.current);
					$currentSlide.siblings('.slide').last().after($currentSlide);
					$currentSlide = nextSlide;
					slidePointer.current = ((slidePointer.current + 1) % total);
					if (slidePointer.current == 0)
						slidePointer.current = total;
					// update counter
					updateCounter();
					// update url
					updateURL();
					// fire slide event
					fireSlideEvent();
				}
			};
			var previousSlide = function () {
				var prevSlide;
				if ($slideshow.hasClass(ID.verticalClass) && !isMobile) { // Is vertical
					if ($slideshow.data('moving'))
						return;
					$slideshow.data('moving', true);
					jQuery('html').css({
						overflow: 'hidden'
					});
					$currentSlide.before($currentSlide.siblings('.slide').last());
					prevSlide = $currentSlide.prev();
					if (prevSlide.length === 0)
						return false;
					// show next slide
					prevSlide.show().addClass(ID.current);
					// scroll to next slide
					var animated = false;
					jQuery('html, body').scrollTop($currentSlide.offset().top);
					jQuery('html, body').animate({
						scrollTop: prevSlide.offset().top
					}, 500, easing, function () {
						if (!animated) {
							$currentSlide.hide().removeClass(ID.current);
							$currentSlide = prevSlide;
							// not the last slide => go to the next one and increment the counter
							$currentSlide = prevSlide;
							slidePointer.current = slidePointer.current == 1 ? total : (slidePointer.current - 1);
							// update counter
							updateCounter();
							// update url
							updateURL();
							// fire slide event
							fireSlideEvent();
							jQuery('html').css({
								overflow: 'auto'
							});
							setTimeout(function () {
								$slideshow.data('moving', false);
							}, $slideshow.data('iswheel') ? verticalDelay : 0);
						}
						animated = true;
					});
				} else { // Is landscape
					jQuery("html, body").animate({
						scrollTop: 0
					}, 0);
					// hide current slide
					hideCurrentSlide();
					// get the previous slide
					$currentSlide.before($currentSlide.siblings('.slide').last());
					prevSlide = $currentSlide.prev();
					prevSlide.show().addClass(ID.current);
					$currentSlide = prevSlide;
					slidePointer.current = slidePointer.current == 1 ? total : (slidePointer.current - 1);
					// update counter
					updateCounter();
					// update URL
					updateURL();
					// fire slide event
					fireSlideEvent();
				}
			};
			var goToSlide = function (slideNumber) {
				// hide current slide
				hideCurrentSlide();
				moveToSlide = slideNumber - 1;
				$currentSlide = $slides.eq(moveToSlide);
				$currentSlide.show().addClass(ID.current);
				jQuery('.slide:lt(' + $currentSlide.index() + ')').each(function () {
					var $this = jQuery(this);
					$this.siblings('.slide').last().after($this);
				});
				slidePointer.current = slideNumber;
				// update counter
				updateCounter();
			};
			var fireSlideEvent = function (slide) {
				var slideEvent = new window.CustomEvent('slidechanged', {
						detail: {
							slide: slide || $currentSlide
						}
					});
				window.dispatchEvent(slideEvent);
			};
			/*** INIT SLIDESHOW ***/
			// Initially hide all slides
			$slides.hide();
			// The first slide is number first, last is slides length
			var slidePointer = {
				current: 1,
				last: $slides.length
			};
			var slideState = parseInt(document.location.hash.replace('#slide=', ''));
			if (slideState && (slideState > 0 && slideState <= $slides.length)) {
				// if slide= hash state is given and valid, go to that slide
				goToSlide(slideState);
			} else {
				// The first slide is the first slide, so make visible and set the counter...
				$currentSlide = $firstSlide.show().addClass(ID.current);
				updateCounter();
			}
			/*** EVENTS ***/
			// "next" arrow clicked => next slide
			$next.click(function (e) {
				e.preventDefault();
				nextSlide();
			});
			// "previous" arrow clicked => previous slide
			$previous.click(function (e) {
				e.preventDefault();
				previousSlide();
			});
			// Add keyboard shortcuts for changing slides
			jQuery(document).keydown(function (e) {
				if (!$slideshow.hasClass(ID.verticalClass) || isMobile) {
					$slideshow.data('iswheel', false);
					if (e.which == 39 || e.which == 32) {
						// right key pressed => next slide
						nextSlide();
						return false;
					} else if (e.which == 37) {
						// left or l key pressed => previous slide
						previousSlide();
						return false;
					}
				}
			});
			// Add keyboard shortcuts for changing slides
			jQuery(document).keydown(function (e) {
				if ($slideshow.hasClass(ID.verticalClass) && !isMobile) {
					$slideshow.data('iswheel', false);
					if (e.which == 40 || e.which == 32) {
						// right key pressed => next slide
						nextSlide();
						return false;
					} else if (e.which == 38) {
						// left or l key pressed => previous slide
						previousSlide();
						return false;
					}
				}
			});
			/**
			 *  Bind the event HashChange when the prev/next history button was clicked
			 */
			jQuery(window).bind("hashchange", function () {
				if (hasHash()) {
					goToSlideIfSlideHashChange();
				} else {
					window.location.reload();
				}
			});
			function hasHash() {
				return window.location.hash ? true : false;
			}
			function goToSlideIfSlideHashChange() {
				var paramsArr = getArrayOfHashParams();
				var slideObj = $.grep(paramsArr, function (e) {
						return (e.key == "slide");
					});
				if (slideObj.length == 1) {
					goToSlide(slideObj[0].value);
				}
			}
			function getArrayOfHashParams() {
				var hash = window.location.hash.replace('#', '').split('&');
				var paramsArr = new Array([]);
				for (var i = 0; i < hash.length; i++) {
					var itemArray = hash[i].split('=');
					var action = new Object({});
					action.key = itemArray[0];
					action.value = itemArray[1];
					paramsArr.push(action);
				}
				return paramsArr;
			}
			// Mouse wheel
			jQuery(window).bind('mousewheel DOMMouseScroll', function (event) {
				$slideshow.data('iswheel', true);
				if ($slideshow.hasClass(ID.verticalClass) && !isMobile) {
					if (event.originalEvent.wheelDelta > wheelDelta || event.originalEvent.detail < wheelDetail) {
						// Scroll up
						previousSlide();
					} else if (event.originalEvent.wheelDelta < -wheelDelta || event.originalEvent.detail > -wheelDetail) {
						// scroll down
						nextSlide();
					}
				}
			});
			// Touch
			jQuery(window).on("touchstart", function (ev) {
				var e = ev.originalEvent;
				$slideshow.data('touchYStart', e.touches[0].screenY);
				$slideshow.data('touchXStart', e.touches[0].screenX);
				$slideshow.data('touchYEnd', e.touches[0].screenY);
				$slideshow.data('touchXEnd', e.touches[0].screenX);
			});
			jQuery(window).on("touchmove", function (ev) {
				var e = ev.originalEvent;
				$slideshow.data('touchYEnd', e.touches[0].screenY);
				$slideshow.data('touchXEnd', e.touches[0].screenX);
			});
			jQuery(window).on("touchend", function (ev) {
				$slideshow.data('iswheel', false);
				var e = ev.originalEvent;
				var diffX = $slideshow.data('touchXStart') - $slideshow.data('touchXEnd');
				var diffY = $slideshow.data('touchYStart') - $slideshow.data('touchYEnd');
				if ((!$slideshow.hasClass(ID.verticalClass) || isMobile) && Math.abs(diffX) > Math.abs(diffY)) {
					if (diffX < -slideOffset) {
						previousSlide();
						// Scroll up
					} else if (diffX > slideOffset) {
						// scroll down
						nextSlide();
					}
				}
			});
			// Tabs
			jQuery('ul.tabs li').click(function () {
				var $this = jQuery(this);
				var tab_id = $this.attr('data-tab');
				jQuery('ul.tabs li').removeClass('current');
				jQuery('.tab-content').removeClass('current');
				$this.addClass('current');
				jQuery("#" + tab_id).addClass('current');
			});
			/* jQuery plugin */
			$.WebSlides = function () {};
			/* Public goToSlide */
			$.WebSlides.goToSlide = goToSlide;
			/*!
			 * show page
			 */
			/* $(".page").css({
				opacity: 1
			}); */
		});
		// Prototype better, faster. To show the grid/baseline.png, press Enter on keyboard
		$(document).keypress(function (e) {
			if (e.which == 13) {
				$('body').toggleClass('baseline').css('height', $(document).height());
			}
		});
		/* jshint +W041 */
	}
};
/* loadJS("//cdn.jsdelivr.net/jquery/3.1.1/jquery.min.js", initWebslides); */
loadJS("../libs/serguei-webslides/js/vendors.min.js", initWebslides);
/*!
 * show page, finish ToProgress
 */
var showPageFinishProgress = function () {
	"use strict";
	var a = BALA.one("#page") || "";
	console.log("triggered function: showPageFinishProgress");
	setStyleOpacity(a, 1);
	progressBar.complete();
};
evento.add(window, "load", showPageFinishProgress);
