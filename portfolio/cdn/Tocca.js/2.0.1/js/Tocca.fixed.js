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
	if (typeof doc.createEvent !== 'function') {
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
	var pointerEventSupport = function(type) {
			var lo = type.toLowerCase(),
				ms = 'MS' + type;
			return navigator.msPointerEnabled ? ms : window.PointerEvent ? lo : '';
		},
		defaults = {
			useJquery: !win.IGNORE_JQUERY && typeof jQuery !== 'undefined',
			swipeThreshold: win.SWIPE_THRESHOLD || 100,
			tapThreshold: win.TAP_THRESHOLD || 150,
			dbltapThreshold: win.DBL_TAP_THRESHOLD || 200,
			longtapThreshold: win.LONG_TAP_THRESHOLD || 1000,
			tapPrecision: win.TAP_PRECISION / 2 || 60 / 2,
			justTouchEvents: win.JUST_ON_TOUCH_DEVICES
		},
		wasTouch = false,
		touchevents = {
			touchstart: pointerEventSupport('PointerDown') || 'touchstart',
			touchend: pointerEventSupport('PointerUp') + ' touchend',
			touchmove: pointerEventSupport('PointerMove') + ' touchmove'
		},
		isTheSameFingerId = function(e) {
			return !e.pointerId || typeof pointerId === 'undefined' || e.pointerId === pointerId;
		},
		setListener = function(elm, events, callback) {
			var eventsArray = events.split(' '),
				i = eventsArray.length;
			while (i--) {
				elm.addEventListener(eventsArray[i], callback, false);
			}
		},
		getPointerEvent = function(event) {
			return event.targetTouches ? event.targetTouches[0] : event;
		},
		getTimestamp = function() {
			return new Date().getTime();
		},
		sendEvent = function(elm, eventName, originalEvent, data) {
			var customEvent = doc.createEvent('Event');
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
				if (elm['on' + eventName]) {
					elm['on' + eventName](customEvent);
				}
				elm = elm.parentNode;
			}
		},
		onTouchStart = function(e) {
			if (!isTheSameFingerId(e)) {
				return;
			}
			var isMousedown = e.type === 'mousedown';
			wasTouch = !isMousedown;
			pointerId = e.pointerId;
			if (e.type === 'mousedown' && wasTouch) {
				return;
			}
			var pointer = getPointerEvent(e);
			cachedX = currX = pointer.pageX;
			cachedY = currY = pointer.pageY;
			longtapTimer = setTimeout(function() {
				sendEvent(e.target, 'longtap', e);
				target = e.target;
			}, defaults.longtapThreshold);
			timestamp = getTimestamp();
			tapNum++;
		},
		onTouchEnd = function(e) {
			if (!isTheSameFingerId(e)) {
				return;
			}
			pointerId = undefined;
			if (e.type === 'mouseup' && wasTouch) {
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
				eventsArr.push('swiperight');
			}
			if (deltaX >= defaults.swipeThreshold) {
				eventsArr.push('swipeleft');
			}
			if (deltaY <= -defaults.swipeThreshold) {
				eventsArr.push('swipedown');
			}
			if (deltaY >= defaults.swipeThreshold) {
				eventsArr.push('swipeup');
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
				if (cachedX >= currX - defaults.tapPrecision && cachedX <= currX + defaults.tapPrecision && cachedY >= currY - defaults.tapPrecision && cachedY <= currY + defaults.tapPrecision) {
					if (timestamp + defaults.tapThreshold - now >= 0) {
						sendEvent(e.target, tapNum >= 2 && target === e.target ? 'dbltap' : 'tap', e);
						target = e.target;
					}
				}
				dblTapTimer = setTimeout(function() {
					tapNum = 0;
				}, defaults.dbltapThreshold);
			}
		},
		onTouchMove = function(e) {
			if (!isTheSameFingerId(e)) {
				return;
			}
			if (e.type === 'mousemove' && wasTouch) {
				return;
			}
			var pointer = getPointerEvent(e);
			currX = pointer.pageX;
			currY = pointer.pageY;
		};
	setListener(doc, touchevents.touchstart + (defaults.justTouchEvents ? '' : ' mousedown'), onTouchStart);
	setListener(doc, touchevents.touchend + (defaults.justTouchEvents ? '' : ' mouseup'), onTouchEnd);
	setListener(doc, touchevents.touchmove + (defaults.justTouchEvents ? '' : ' mousemove'), onTouchMove);
	win.tocca = function(options) {
		for (var opt in options) {
			if (options.hasOwnProperty(opt)) {
				defaults[opt] = options[opt];
			}
		}
		return defaults;
	};
})(document, "undefined" !== typeof window ? window : this);
