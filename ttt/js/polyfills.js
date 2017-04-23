/*!
 * Polyfills the querySelector and querySelectorAll methods.
 * @see https://gist.github.com/Fusselwurm/4673695
 * @see {@link https://github.com/cobbdb/polyfill-queryselector/blob/master/querySelector.js}
 * IE8 needs that
 */
(function () {
	var style;
	var select = function (selector, maxCount) {
		var all = document.all,
		l = all.length,
		i,
		resultSet = [];
		style.addRule(selector, "foo:bar");
		for (i = 0; i < l; i += 1) {
			if (all[i].currentStyle.foo === "bar") {
				resultSet.push(all[i]);
				if (resultSet.length > maxCount) {
					break;
				}
			}
		}
		style.removeRule(0);
		return resultSet;
	};
	if (document.querySelectorAll || document.querySelector) {
		return;
	}
	style = document.createStyleSheet();
	document.querySelectorAll = document.body.querySelectorAll = function (selector) {
		return select(selector, Infinity);
	};
	document.querySelector = document.body.querySelector = function (selector) {
		return select(selector, 1)[0] || null;
	};
}
	());
/*!
 * Implementation of standard Array methods (introduced in ECMAScript 5th
 * edition) and shorthand generics (JavaScript 1.8.5)
 *
 * Copyright (c) 2013 Alex K @plusdude
 * http://opensource.org/licenses/MIT
 * @see {@link https://github.com/plusdude/array-generics/blob/master/array.generics.js}
 * IE9 needs that
 */
(function (global, infinity, undefined) {
	/*jshint bitwise:false, maxlen:95, plusplus:false, validthis:true*/
	"use strict";
	/**
	 * Local references to constructors at global scope.
	 * This may speed up access and slightly reduce file size of minified version.
	 */
	var Array = global.Array;
	var Object = global.Object;
	var Math = global.Math;
	var Number = global.Number;
	/**
	 * Converts argument to an integral numeric value.
	 * @see http://www.ecma-international.org/ecma-262/5.1/#sec-9.4
	 */
	function toInteger(value) {
		var number;
		// let number be the result of calling ToNumber on the input argument
		number = Number(value);
		return (
			// if number is NaN, return 0
			number !== number ? 0 :
			// if number is 0, Infinity, or -Infinity, return number
			0 === number || infinity === number || -infinity === number ? number :
			// return the result of computing sign(number) * floor(abs(number))
			(0 < number || -1) * Math.floor(Math.abs(number)));
	}
	/**
	 * Returns a shallow copy of a portion of an array.
	 * @see http://www.ecma-international.org/ecma-262/5.1/#sec-15.4.4.10
	 */
	function slice(begin, end) {
		/*jshint newcap:false*/
		var result,
		elements,
		length,
		index,
		count;
		// convert elements to object
		elements = Object(this);
		// convert length to unsigned 32 bit integer
		length = elements.length >>> 0;
		// calculate begin index, if is set
		if (undefined !== begin) {
			// convert to integer
			begin = toInteger(begin);
			// handle -begin, begin > length
			index = 0 > begin ? Math.max(length + begin, 0) : Math.min(begin, length);
		} else {
			// default value
			index = 0;
		}
		// calculate end index, if is set
		if (undefined !== end) {
			// convert to integer
			end = toInteger(end);
			// handle -end, end > length
			length = 0 > end ? Math.max(length + end, 0) : Math.min(end, length);
		}
		// create result array
		result = new Array(length - index);
		// iterate over elements
		for (count = 0; index < length; ++index, ++count) {
			// current index exists
			if (index in elements) {
				// copy current element to result array
				result[count] = elements[index];
			}
		}
		return result;
	}
	/**
	 * Returns the first index at which a given element
	 * can be found in the array.
	 * @see http://www.ecma-international.org/ecma-262/5.1/#sec-15.4.4.14
	 */
	function indexOf(target, begin) {
		/*jshint newcap:false*/
		var elements,
		length,
		index;
		// convert elements to object
		elements = Object(this);
		// convert length to unsigned 32 bit integer
		length = elements.length >>> 0;
		// calculate begin index, if is set
		if (undefined !== begin) {
			// convert to integer
			begin = toInteger(begin);
			// handle -begin, begin > length
			index = 0 > begin ? Math.max(length + begin, 0) : Math.min(begin, length);
		} else {
			// default value
			index = 0;
		}
		// iterate over elements
		for (; index < length; ++index) {
			// current index exists, target element is equal to current element
			if (index in elements && target === elements[index]) {
				// break loop, target element found
				return index;
			}
		}
		// target element not found
		return -1;
	}
	/**
	 * Returns the last index at which a given element
	 * can be found in the array.
	 * @see http://www.ecma-international.org/ecma-262/5.1/#sec-15.4.4.15
	 */
	function lastIndexOf(target, begin) {
		/*jshint newcap:false*/
		var elements,
		length,
		index;
		// convert elements to object
		elements = Object(this);
		// convert length to unsigned 32 bit integer
		length = elements.length >>> 0;
		// calculate begin index, if is set
		if (undefined !== begin) {
			// convert to integer
			begin = toInteger(begin);
			// handle -begin, begin > length - 1
			index = 0 > begin ? length - Math.abs(begin) : Math.min(begin, length - 1);
		} else {
			// default value
			index = length - 1;
		}
		// iterate over elements backwards
		for (; -1 < index; --index) {
			// current index exists, target element is equal to current element
			if (index in elements && target === elements[index]) {
				// break loop, target element found
				return index;
			}
		}
		// target element not found
		return -1;
	}
	/**
	 * Executes a provided function once per array element.
	 * @see http://www.ecma-international.org/ecma-262/5.1/#sec-15.4.4.18
	 */
	function forEach(callback, scope) {
		/*jshint newcap:false*/
		var elements,
		length,
		index;
		// convert elements to object
		elements = Object(this);
		// make sure callback is a function
		requireFunction(callback);
		// convert length to unsigned 32 bit integer
		length = elements.length >>> 0;
		// iterate over elements
		for (index = 0; index < length; ++index) {
			// current index exists
			if (index in elements) {
				// execute callback
				callback.call(scope, elements[index], index, elements);
			}
		}
	}
	/**
	 * Tests whether all elements in the array pass the test
	 * implemented by the provided function.
	 * @see http://www.ecma-international.org/ecma-262/5.1/#sec-15.4.4.16
	 */
	function every(callback, scope) {
		/*jshint newcap:false*/
		var elements,
		length,
		index;
		// convert elements to object
		elements = Object(this);
		// make sure callback is a function
		requireFunction(callback);
		// convert length to unsigned 32 bit integer
		length = elements.length >>> 0;
		// iterate over elements
		for (index = 0; index < length; ++index) {
			// current index exists
			if (index in elements &&
				// callback returns false
				!callback.call(scope, elements[index], index, elements)) {
				// break loop, test failed
				return false;
			}
		}
		// test passed, controversy began..
		return true;
	}
	/**
	 * Tests whether some element in the array passes the test
	 * implemented by the provided function.
	 * @see http://www.ecma-international.org/ecma-262/5.1/#sec-15.4.4.17
	 */
	function some(callback, scope) {
		/*jshint newcap:false*/
		var elements,
		length,
		index;
		// convert elements to object
		elements = Object(this);
		// make sure callback is a function
		requireFunction(callback);
		// convert length to unsigned 32 bit integer
		length = elements.length >>> 0;
		// iterate over elements
		for (index = 0; index < length; ++index) {
			// current index exists
			if (index in elements &&
				// callback returns true
				callback.call(scope, elements[index], index, elements)) {
				// break loop, test passed
				return true;
			}
		}
		// test failed
		return false;
	}
	/**
	 * Creates a new array with all elements that pass the test
	 * implemented by the provided function.
	 * @see http://www.ecma-international.org/ecma-262/5.1/#sec-15.4.4.20
	 */
	function filter(callback, scope) {
		/*jshint newcap:false*/
		var result = [],
		elements,
		length,
		index,
		count;
		// convert elements to object
		elements = Object(this);
		// make sure callback is a function
		requireFunction(callback);
		// convert length to unsigned 32 bit integer
		length = elements.length >>> 0;
		// iterate over elements
		for (index = count = 0; index < length; ++index) {
			// current index exists
			if (index in elements &&
				// callback returns true
				callback.call(scope, elements[index], index, elements)) {
				// copy current element to result array
				result[count++] = elements[index];
			}
		}
		return result;
	}
	/**
	 * Creates a new array with the results of calling a provided function
	 * on every element in this array.
	 * @see http://www.ecma-international.org/ecma-262/5.1/#sec-15.4.4.19
	 */
	function map(callback, scope) {
		/*jshint newcap:false*/
		var result = [],
		elements,
		length,
		index;
		// convert elements to object
		elements = Object(this);
		// make sure callback is a function
		requireFunction(callback);
		// convert length to unsigned 32 bit integer
		length = elements.length >>> 0;
		// iterate over elements
		for (index = 0; index < length; ++index) {
			// current index exists
			if (index in elements) {
				// copy a return value of callback to result array
				result[index] = callback.call(scope, elements[index], index, elements);
			}
		}
		return result;
	}
	/**
	 * Apply a function against values of the array (from left-to-right)
	 * as to reduce it to a single value.
	 * @see http://www.ecma-international.org/ecma-262/5.1/#sec-15.4.4.21
	 */
	function reduce(callback, value) {
		/*jshint newcap:false*/
		var elements,
		isset,
		length,
		index;
		// convert elements to object
		elements = Object(this);
		// make sure callback is a function
		requireFunction(callback);
		// status of the initial value
		isset = undefined !== value;
		// convert length to unsigned 32 bit integer
		length = elements.length >>> 0;
		// iterate over elements
		for (index = 0; index < length; ++index) {
			// current index exists
			if (index in elements) {
				// initial value is set
				if (isset) {
					// replace initial value with a return value of callback
					value = callback(value, elements[index], index, elements);
				} else {
					// current element becomes initial value
					value = elements[index];
					// status of the initial value
					isset = true;
				}
			}
		}
		// make sure the initial value exists after iteration
		requireValue(isset);
		return value;
	}
	/**
	 * Apply a function against values of the array (from right-to-left)
	 * as to reduce it to a single value.
	 * @see http://www.ecma-international.org/ecma-262/5.1/#sec-15.4.4.22
	 */
	function reduceRight(callback, value) {
		/*jshint newcap:false*/
		var elements,
		isset,
		index;
		// convert elements to object
		elements = Object(this);
		// make sure callback is a function
		requireFunction(callback);
		// status of the initial value
		isset = undefined !== value;
		// index of the last element
		index = (elements.length >>> 0) - 1;
		// iterate over elements backwards
		for (; -1 < index; --index) {
			// current index exists
			if (index in elements) {
				// initial value is set
				if (isset) {
					// replace initial value with a return value of callback
					value = callback(value, elements[index], index, elements);
				} else {
					// current element becomes initial value
					value = elements[index];
					// status of the initial value
					isset = true;
				}
			}
		}
		// make sure the initial value exists after iteration
		requireValue(isset);
		return value;
	}
	/**
	 * Returns true if an argument is an array, false if it is not.
	 * @see http://www.ecma-international.org/ecma-262/5.1/#sec-15.4.3.2
	 */
	function isArray(value) {
		return "[object Array]" === Object.prototype.toString.call(value);
	}
	/**
	 * Tests if an argument is callable and throws an error if it is not.
	 * @private
	 */
	function requireFunction(value) {
		if ("[object Function]" !== Object.prototype.toString.call(value)) {
			throw new Error(value + " is not a function");
		}
	}
	/**
	 * Throws an error if an argument can be converted to true.
	 * @private
	 */
	function requireValue(isset) {
		if (!isset) {
			throw new Error("reduce of empty array with no initial value");
		}
	}
	/**
	 * Tests implementation of standard Array method.
	 * @private
	 */
	function supportsStandard(key) {
		var support = true;
		// a method exists
		if (Array.prototype[key]) {
			try {
				// apply dummy arguments
				Array.prototype[key].call(undefined, /test/, null);
				// passed? implemented wrong
				support = false;
			} catch (e) {
				// do nothing
			}
		} else {
			support = false;
		}
		return support;
	}
	/**
	 * Tests implementation of generic Array method.
	 * @private
	 */
	function supportsGeneric(key) {
		var support = true;
		// a method exists
		if (Array[key]) {
			try {
				// apply dummy arguments
				Array[key](undefined, /test/, null);
				// passed? implemented wrong
				support = false;
			} catch (e) {
				// do nothing
			}
		} else {
			support = false;
		}
		return support;
	}
	/**
	 * Assigns method to Array constructor.
	 * @private
	 */
	function extendArray(key) {
		if (!supportsGeneric(key)) {
			Array[key] = createGeneric(key);
		}
	}
	/**
	 * Creates generic method from an instance method.
	 * @private
	 */
	function createGeneric(key) {
		/** @public */
		return function (elements) {
			var list;
			if (undefined === elements || null === elements) {
				throw new Error("Array.prototype." + key + " called on " + elements);
			}
			list = Array.prototype.slice.call(arguments, 1);
			return Array.prototype[key].apply(elements, list);
		};
	}
	/**
	 * Assign ECMAScript-5 methods to Array constructor,
	 * and Array prototype.
	 */
	var ES5 = {
		"indexOf": indexOf,
		"lastIndexOf": lastIndexOf,
		"forEach": forEach,
		"every": every,
		"some": some,
		"filter": filter,
		"map": map,
		"reduce": reduce,
		"reduceRight": reduceRight
	};
	for (var key in ES5) {
		if (ES5.hasOwnProperty(key)) {
			if (!supportsStandard(key)) {
				Array.prototype[key] = ES5[key];
			}
			extendArray(key);
		}
	}
	Array.isArray = Array.isArray || isArray;
	/**
	 * Assign ECMAScript-3 methods to Array constructor.
	 * The toString method is omitted.
	 */
	[
		"concat",
		"join",
		"slice",
		"pop",
		"push",
		"reverse",
		"shift",
		"sort",
		"splice",
		"unshift"
	].forEach(extendArray);
	/**
	 * Test the slice method on DOM NodeList.
	 * Support: IE < 9
	 */
	/*jshint browser:true*/
	if (document) {
		try {
			Array.slice(document.childNodes);
		} catch (e) {
			Array.prototype.slice = slice;
		}
	}
}
	(typeof self !== 'undefined' ? self : this, 1 / 0));
/*!
 * @see {@link https://github.com/taylorhakes/promise-polyfill/blob/master/promise.js}
 * IE11 needs that
 */
(function (root) {
	// Store setTimeout reference so promise-polyfill will be unaffected by
	// other code modifying setTimeout (like sinon.useFakeTimers())
	var setTimeoutFunc = setTimeout;
	function noop() {}
	// Polyfill for Function.prototype.bind
	function bind(fn, thisArg) {
		return function () {
			fn.apply(thisArg, arguments);
		};
	}
	function Promise(fn) {
		if (typeof this !== 'object')
			throw new TypeError('Promises must be constructed via new');
		if (typeof fn !== 'function')
			throw new TypeError('not a function');
		this._state = 0;
		this._handled = false;
		this._value = undefined;
		this._deferreds = [];
		doResolve(fn, this);
	}
	function handle(self, deferred) {
		while (self._state === 3) {
			self = self._value;
		}
		if (self._state === 0) {
			self._deferreds.push(deferred);
			return;
		}
		self._handled = true;
		Promise._immediateFn(function () {
			var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;
			if (cb === null) {
				(self._state === 1 ? resolve : reject)(deferred.promise, self._value);
				return;
			}
			var ret;
			try {
				ret = cb(self._value);
			} catch (e) {
				reject(deferred.promise, e);
				return;
			}
			resolve(deferred.promise, ret);
		});
	}
	function resolve(self, newValue) {
		try {
			// Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
			if (newValue === self)
				throw new TypeError('A promise cannot be resolved with itself.');
			if (newValue && (typeof newValue === 'object' || typeof newValue === 'function')) {
				var then = newValue.then;
				if (newValue instanceof Promise) {
					self._state = 3;
					self._value = newValue;
					finale(self);
					return;
				} else if (typeof then === 'function') {
					doResolve(bind(then, newValue), self);
					return;
				}
			}
			self._state = 1;
			self._value = newValue;
			finale(self);
		} catch (e) {
			reject(self, e);
		}
	}
	function reject(self, newValue) {
		self._state = 2;
		self._value = newValue;
		finale(self);
	}
	function finale(self) {
		if (self._state === 2 && self._deferreds.length === 0) {
			Promise._immediateFn(function () {
				if (!self._handled) {
					Promise._unhandledRejectionFn(self._value);
				}
			});
		}
		for (var i = 0, len = self._deferreds.length; i < len; i++) {
			handle(self, self._deferreds[i]);
		}
		self._deferreds = null;
	}
	function Handler(onFulfilled, onRejected, promise) {
		this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
		this.onRejected = typeof onRejected === 'function' ? onRejected : null;
		this.promise = promise;
	}
	/**
	 * Take a potentially misbehaving resolver function and make sure
	 * onFulfilled and onRejected are only called once.
	 *
	 * Makes no guarantees about asynchrony.
	 */
	function doResolve(fn, self) {
		var done = false;
		try {
			fn(function (value) {
				if (done)
					return;
				done = true;
				resolve(self, value);
			}, function (reason) {
				if (done)
					return;
				done = true;
				reject(self, reason);
			});
		} catch (ex) {
			if (done)
				return;
			done = true;
			reject(self, ex);
		}
	}
	Promise.prototype['catch'] = function (onRejected) {
		return this.then(null, onRejected);
	};
	Promise.prototype.then = function (onFulfilled, onRejected) {
		var prom = new(this.constructor)(noop);
		handle(this, new Handler(onFulfilled, onRejected, prom));
		return prom;
	};
	Promise.all = function (arr) {
		var args = Array.prototype.slice.call(arr);
		return new Promise(function (resolve, reject) {
			if (args.length === 0)
				return resolve([]);
			var remaining = args.length;
			function res(i, val) {
				try {
					if (val && (typeof val === 'object' || typeof val === 'function')) {
						var then = val.then;
						if (typeof then === 'function') {
							then.call(val, function (val) {
								res(i, val);
							}, reject);
							return;
						}
					}
					args[i] = val;
					if (--remaining === 0) {
						resolve(args);
					}
				} catch (ex) {
					reject(ex);
				}
			}
			for (var i = 0; i < args.length; i++) {
				res(i, args[i]);
			}
		});
	};
	Promise.resolve = function (value) {
		if (value && typeof value === 'object' && value.constructor === Promise) {
			return value;
		}
		return new Promise(function (resolve) {
			resolve(value);
		});
	};
	Promise.reject = function (value) {
		return new Promise(function (resolve, reject) {
			reject(value);
		});
	};
	Promise.race = function (values) {
		return new Promise(function (resolve, reject) {
			for (var i = 0, len = values.length; i < len; i++) {
				values[i].then(resolve, reject);
			}
		});
	};
	// Use polyfill for setImmediate for performance gains
	Promise._immediateFn = (typeof setImmediate === 'function' && function (fn) {
		setImmediate(fn);
	}) ||
	function (fn) {
		setTimeoutFunc(fn, 0);
	};
	Promise._unhandledRejectionFn = function _unhandledRejectionFn(err) {
		if (typeof console !== 'undefined' && console) {
			console.warn('Possible Unhandled Promise Rejection:', err); // eslint-disable-line no-console
		}
	};
	/**
	 * Set the immediate function to execute callbacks
	 * @param fn {function} Function to execute
	 * @deprecated
	 */
	Promise._setImmediateFn = function _setImmediateFn(fn) {
		Promise._immediateFn = fn;
	};
	/**
	 * Change the function to execute on unhandled rejection
	 * @param {function} fn Function to execute on unhandled rejection
	 * @deprecated
	 */
	Promise._setUnhandledRejectionFn = function _setUnhandledRejectionFn(fn) {
		Promise._unhandledRejectionFn = fn;
	};
	if (typeof module !== 'undefined' && module.exports) {
		module.exports = Promise;
	} else if (!root.Promise) {
		root.Promise = Promise;
	}
})(typeof self !== 'undefined' ? self : this);
/*!
 * @see {@link https://github.com/github/fetch/blob/master/fetch.js}
 * IE11/Edge13 needs that
 */
(function (self) {
	'use strict';
	if (self.fetch) {
		return;
	}
	var support = {
		searchParams: 'URLSearchParams' in self,
		iterable: 'Symbol' in self && 'iterator' in Symbol,
		blob: 'FileReader' in self && 'Blob' in self && (function () {
			try {
				Blob();
				return true;
			} catch (e) {
				return false;
			}
		})(),
		formData: 'FormData' in self,
		arrayBuffer: 'ArrayBuffer' in self
	};
	function normalizeName(name) {
		if (typeof name !== 'string') {
			name = String(name);
		}
		if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
			throw new TypeError('Invalid character in header field name');
		}
		return name.toLowerCase();
	}
	function normalizeValue(value) {
		if (typeof value !== 'string') {
			value = String(value);
		}
		return value;
	}
	function iteratorFor(items) {
		var iterator = {
			next: function () {
				var value = items.shift();
				return {
					done: value === undefined,
					value: value
				};
			}
		};
		if (support.iterable) {
			iterator[Symbol.iterator] = function () {
				return iterator;
			};
		}
		return iterator;
	}
	function Headers(headers) {
		this.map = {};
		if (headers instanceof Headers) {
			headers.forEach(function (value, name) {
				this.append(name, value);
			}, this);
		} else if (headers) {
			Object.getOwnPropertyNames(headers).forEach(function (name) {
				this.append(name, headers[name]);
			}, this);
		}
	}
	Headers.prototype.append = function (name, value) {
		name = normalizeName(name);
		value = normalizeValue(value);
		var list = this.map[name];
		if (!list) {
			list = [];
			this.map[name] = list;
		}
		list.push(value);
	};
	Headers.prototype['delete'] = function (name) {
		delete this.map[normalizeName(name)];
	};
	Headers.prototype.get = function (name) {
		var values = this.map[normalizeName(name)];
		return values ? values[0] : null;
	};
	Headers.prototype.getAll = function (name) {
		return this.map[normalizeName(name)] || [];
	};
	Headers.prototype.has = function (name) {
		return this.map.hasOwnProperty(normalizeName(name));
	};
	Headers.prototype.set = function (name, value) {
		this.map[normalizeName(name)] = [normalizeValue(value)];
	};
	Headers.prototype.forEach = function (callback, thisArg) {
		Object.getOwnPropertyNames(this.map).forEach(function (name) {
			this.map[name].forEach(function (value) {
				callback.call(thisArg, value, name, this);
			}, this);
		}, this);
	};
	Headers.prototype.keys = function () {
		var items = [];
		this.forEach(function (value, name) {
			items.push(name);
		});
		return iteratorFor(items);
	};
	Headers.prototype.values = function () {
		var items = [];
		this.forEach(function (value) {
			items.push(value);
		});
		return iteratorFor(items);
	};
	Headers.prototype.entries = function () {
		var items = [];
		this.forEach(function (value, name) {
			items.push([name, value]);
		});
		return iteratorFor(items);
	};
	if (support.iterable) {
		Headers.prototype[Symbol.iterator] = Headers.prototype.entries;
	}
	function consumed(body) {
		if (body.bodyUsed) {
			return Promise.reject(new TypeError('Already read'));
		}
		body.bodyUsed = true;
	}
	function fileReaderReady(reader) {
		return new Promise(function (resolve, reject) {
			reader.onload = function () {
				resolve(reader.result);
			};
			reader.onerror = function () {
				reject(reader.error);
			};
		});
	}
	function readBlobAsArrayBuffer(blob) {
		var reader = new FileReader();
		reader.readAsArrayBuffer(blob);
		return fileReaderReady(reader);
	}
	function readBlobAsText(blob) {
		var reader = new FileReader();
		reader.readAsText(blob);
		return fileReaderReady(reader);
	}
	function Body() {
		this.bodyUsed = false;
		this._initBody = function (body) {
			this._bodyInit = body;
			if (typeof body === 'string') {
				this._bodyText = body;
			} else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
				this._bodyBlob = body;
			} else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
				this._bodyFormData = body;
			} else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
				this._bodyText = body.toString();
			} else if (!body) {
				this._bodyText = '';
			} else if (support.arrayBuffer && ArrayBuffer.prototype.isPrototypeOf(body)) {}
			else {
				throw new Error('unsupported BodyInit type');
			}
			if (!this.headers.get('content-type')) {
				if (typeof body === 'string') {
					this.headers.set('content-type', 'text/plain;charset=UTF-8');
				} else if (this._bodyBlob && this._bodyBlob.type) {
					this.headers.set('content-type', this._bodyBlob.type);
				} else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
					this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
				}
			}
		};
		if (support.blob) {
			this.blob = function () {
				var rejected = consumed(this);
				if (rejected) {
					return rejected;
				}
				if (this._bodyBlob) {
					return Promise.resolve(this._bodyBlob);
				} else if (this._bodyFormData) {
					throw new Error('could not read FormData body as blob');
				} else {
					return Promise.resolve(new Blob([this._bodyText]));
				}
			};
			this.arrayBuffer = function () {
				return this.blob().then(readBlobAsArrayBuffer);
			};
			this.text = function () {
				var rejected = consumed(this);
				if (rejected) {
					return rejected;
				}
				if (this._bodyBlob) {
					return readBlobAsText(this._bodyBlob);
				} else if (this._bodyFormData) {
					throw new Error('could not read FormData body as text');
				} else {
					return Promise.resolve(this._bodyText);
				}
			};
		} else {
			this.text = function () {
				var rejected = consumed(this);
				return rejected ? rejected : Promise.resolve(this._bodyText);
			};
		}
		if (support.formData) {
			this.formData = function () {
				return this.text().then(decode);
			};
		}
		this.json = function () {
			return this.text().then(JSON.parse);
		};
		return this;
	}
	var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT'];
	function normalizeMethod(method) {
		var upcased = method.toUpperCase();
		return (methods.indexOf(upcased) > -1) ? upcased : method;
	}
	function Request(input, options) {
		options = options || {};
		var body = options.body;
		if (Request.prototype.isPrototypeOf(input)) {
			if (input.bodyUsed) {
				throw new TypeError('Already read');
			}
			this.url = input.url;
			this.credentials = input.credentials;
			if (!options.headers) {
				this.headers = new Headers(input.headers);
			}
			this.method = input.method;
			this.mode = input.mode;
			if (!body) {
				body = input._bodyInit;
				input.bodyUsed = true;
			}
		} else {
			this.url = input;
		}
		this.credentials = options.credentials || this.credentials || 'omit';
		if (options.headers || !this.headers) {
			this.headers = new Headers(options.headers);
		}
		this.method = normalizeMethod(options.method || this.method || 'GET');
		this.mode = options.mode || this.mode || null;
		this.referrer = null;
		if ((this.method === 'GET' || this.method === 'HEAD') && body) {
			throw new TypeError('Body not allowed for GET or HEAD requests');
		}
		this._initBody(body);
	}
	Request.prototype.clone = function () {
		return new Request(this);
	};
	function decode(body) {
		var form = new FormData();
		body.trim().split('&').forEach(function (bytes) {
			if (bytes) {
				var split = bytes.split('=');
				var name = split.shift().replace(/\+/g, ' ');
				var value = split.join('=').replace(/\+/g, ' ');
				form.append(decodeURIComponent(name), decodeURIComponent(value));
			}
		});
		return form;
	}
	function headers(xhr) {
		var head = new Headers();
		var pairs = (xhr.getAllResponseHeaders() || '').trim().split('\n');
		pairs.forEach(function (header) {
			var split = header.trim().split(':');
			var key = split.shift().trim();
			var value = split.join(':').trim();
			head.append(key, value);
		});
		return head;
	}
	Body.call(Request.prototype);
	function Response(bodyInit, options) {
		if (!options) {
			options = {};
		}
		this.type = 'default';
		this.status = options.status;
		this.ok = this.status >= 200 && this.status < 300;
		this.statusText = options.statusText;
		this.headers = options.headers instanceof Headers ? options.headers : new Headers(options.headers);
		this.url = options.url || '';
		this._initBody(bodyInit);
	}
	Body.call(Response.prototype);
	Response.prototype.clone = function () {
		return new Response(this._bodyInit, {
			status: this.status,
			statusText: this.statusText,
			headers: new Headers(this.headers),
			url: this.url
		});
	};
	Response.error = function () {
		var response = new Response(null, {
				status: 0,
				statusText: ''
			});
		response.type = 'error';
		return response;
	};
	var redirectStatuses = [301, 302, 303, 307, 308];
	Response.redirect = function (url, status) {
		if (redirectStatuses.indexOf(status) === -1) {
			throw new RangeError('Invalid status code');
		}
		return new Response(null, {
			status: status,
			headers: {
				location: url
			}
		});
	};
	self.Headers = Headers;
	self.Request = Request;
	self.Response = Response;
	self.fetch = function (input, init) {
		return new Promise(function (resolve, reject) {
			var request;
			if (Request.prototype.isPrototypeOf(input) && !init) {
				request = input;
			} else {
				request = new Request(input, init);
			}
			var xhr = new XMLHttpRequest();
			function responseURL() {
				if ('responseURL' in xhr) {
					return xhr.responseURL;
				}
				if (/^X-Request-URL:/mi.test(xhr.getAllResponseHeaders())) {
					return xhr.getResponseHeader('X-Request-URL');
				}
				return;
			}
			xhr.onload = function () {
				var options = {
					status: xhr.status,
					statusText: xhr.statusText,
					headers: headers(xhr),
					url: responseURL()
				};
				var body = 'response' in xhr ? xhr.response : xhr.responseText;
				resolve(new Response(body, options));
			};
			xhr.onerror = function () {
				reject(new TypeError('Network request failed'));
			};
			xhr.ontimeout = function () {
				reject(new TypeError('Network request failed'));
			};
			xhr.open(request.method, request.url, true);
			if (request.credentials === 'include') {
				xhr.withCredentials = true;
			}
			if ('responseType' in xhr && support.blob) {
				xhr.responseType = 'blob';
			}
			request.headers.forEach(function (value, name) {
				xhr.setRequestHeader(name, value);
			});
			xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit);
		});
	};
	self.fetch.polyfill = true;
})(typeof self !== 'undefined' ? self : this);
/*!
 * @see {@link https://github.com/jonathantneal/EventListener/blob/master/EventListener.js}
 * IE8 needs that
 */
// EventListener | CC0 | github.com/jonathantneal/EventListener
if (this.Element && Element.prototype.attachEvent && !Element.prototype.addEventListener) {
	(function () {
		function addToPrototype(name, method) {
			Window.prototype[name] = HTMLDocument.prototype[name] = Element.prototype[name] = method;
		}
		// add
		addToPrototype("addEventListener", function (type, listener) {
			var
			target = this,
			listeners = target.addEventListener.listeners = target.addEventListener.listeners || {},
			typeListeners = listeners[type] = listeners[type] || [];
			// if no events exist, attach the listener
			if (!typeListeners.length) {
				target.attachEvent("on" + type, typeListeners.event = function (event) {
					var documentElement = target.document && target.document.documentElement || target.documentElement || {
						scrollLeft: 0,
						scrollTop: 0
					};
					// polyfill w3c properties and methods
					event.currentTarget = target;
					event.pageX = event.clientX + documentElement.scrollLeft;
					event.pageY = event.clientY + documentElement.scrollTop;
					event.preventDefault = function () {
						event.returnValue = false;
					};
					event.relatedTarget = event.fromElement || null;
					event.stopImmediatePropagation = function () {
						immediatePropagation = false;
						event.cancelBubble = true;
					};
					event.stopPropagation = function () {
						event.cancelBubble = true;
					};
					event.target = event.srcElement || target;
					event.timeStamp = +new Date();
					var plainEvt = {};
					for (var i in event) {
						if (event.hasOwnProperty(i)) {
							plainEvt[i] = event[i];
						}
					}
					// create an cached list of the master events list (to protect this loop from breaking when an event is removed)
					for (var j = 0, typeListenersCache = [].concat(typeListeners), typeListenerCache, immediatePropagation = true; immediatePropagation && (typeListenerCache = typeListenersCache[j]); ++j) {
						// check to see if the cached event still exists in the master events list
						for (var ii = 0, typeListener; !!(typeListener = typeListeners[ii]); ++ii) {
							if (typeListener == typeListenerCache) {
								typeListener.call(target, plainEvt);
								break;
							}
						}
					}
				});
			}
			// add the event to the master event list
			typeListeners.push(listener);
		});
		// remove
		addToPrototype("removeEventListener", function (type, listener) {
			var
			target = this,
			listeners = target.addEventListener.listeners = target.addEventListener.listeners || {},
			typeListeners = listeners[type] = listeners[type] || [];
			// remove the newest matching event from the master event list
			for (var i = typeListeners.length - 1, typeListener; !!(typeListener = typeListeners[i]); --i) {
				if (typeListener == listener) {
					typeListeners.splice(i, 1);
					break;
				}
			}
			// if no events exist, detach the listener
			if (!typeListeners.length && typeListeners.event) {
				target.detachEvent("on" + type, typeListeners.event);
			}
		});
		// dispatch
		addToPrototype("dispatchEvent", function (eventObject) {
			var
			target = this,
			type = eventObject.type,
			listeners = target.addEventListener.listeners = target.addEventListener.listeners || {},
			typeListeners = listeners[type] = listeners[type] || [];
			try {
				return target.fireEvent("on" + type, eventObject);
			} catch (error) {
				if (typeListeners.event) {
					typeListeners.event(eventObject);
				}
				return;
			}
		});
		// CustomEvent
		Object.defineProperty(Window.prototype, "CustomEvent", {
			get: function () {
				var self = this;
				return function CustomEvent(type, eventInitDict) {
					var event = self.document.createEventObject(),
					key;
					event.type = type;
					for (key in eventInitDict) {
						if (key == 'cancelable') {
							event.returnValue = !eventInitDict.cancelable;
						} else if (key == 'bubbles') {
							event.cancelBubble = !eventInitDict.bubbles;
						} else if (key == 'detail') {
							event.detail = eventInitDict.detail;
						}
					}
					return event;
				};
			}
		});
		// ready
		function ready(event) {
			if (ready.interval && document.body) {
				ready.interval = clearInterval(ready.interval);
				document.dispatchEvent(new CustomEvent("DOMContentLoaded"));
			}
		}
		ready.interval = setInterval(ready, 1);
		window.addEventListener("load", ready);
	})();
}
if (!this.CustomEvent || typeof this.CustomEvent === "object") {
	(function () {
		// CustomEvent for browsers which don't natively support the Constructor method
		this.CustomEvent = function CustomEvent(type, eventInitDict) {
			var event;
			eventInitDict = eventInitDict || {
				bubbles: false,
				cancelable: false,
				detail: undefined
			};
			try {
				event = document.createEvent('CustomEvent');
				event.initCustomEvent(type, eventInitDict.bubbles, eventInitDict.cancelable, eventInitDict.detail);
			} catch (error) {
				// for browsers which don't support CustomEvent at all, we use a regular event instead
				event = document.createEvent('Event');
				event.initEvent(type, eventInitDict.bubbles, eventInitDict.cancelable);
				event.detail = eventInitDict.detail;
			}
			return event;
		};
	})();
}
/*!
 * @see {@link https://github.com/webcomponents/template/blob/master/template.js}
 * IE11 needs that, and Edge13 needs that in head
 * @see {@link https://github.com/Polymer/polymer-bundler/issues/347}
 */
/*!
 * @see {@link https://github.com/jeffcarp/template-polyfill/blob/master/index.js}
 * IE11 needs that, and Edge13 needs that in head
 * @see {@link https://github.com/Polymer/polymer-bundler/issues/347}
 */
/*!
 * @see {@link https://github.com/Financial-Times/polyfill-service/blob/master/polyfills/Event/hashchange/polyfill.js}
 * Chrome4 needs that
 */
(function (global) {
	var hash = global.location.hash;
	function poll() {
		if (hash !== global.location.hash) {
			hash = global.location.hash;
			global.dispatchEvent(new Event('hashchange'));
		}
		setTimeout(poll, 500);
	}
	// Make sure a check for 'onhashchange' in window will pass (note: setting to undefined IE<9 causes 'Not implemented' error)
	global.onhashchange = function () {};
	poll();
}
	((typeof self !== 'undefined' ? self : this)));
/*!
 * @see {@link https://gist.github.com/dchambers/0abcec9eaf529f993b9d}
 */
(function () {
	'use strict';
	if (!window.DocumentFragment && window.HTMLDocument) {
		window.DocumentFragment = HTMLDocument;
	}
	if (!document.ELEMENT_NODE) {
		document.ELEMENT_NODE = 1;
		document.ATTRIBUTE_NODE = 2;
		document.TEXT_NODE = 3;
		document.CDATA_SECTION_NODE = 4;
		document.ENTITY_REFERENCE_NODE = 5;
		document.ENTITY_NODE = 6;
		document.PROCESSING_INSTRUCTION_NODE = 7;
		document.COMMENT_NODE = 8;
		document.DOCUMENT_NODE = 9;
		document.DOCUMENT_TYPE_NODE = 10;
		document.DOCUMENT_FRAGMENT_NODE = 11;
		document.NOTATION_NODE = 12;
	}
	if (!document.createElementNS) {
		document.createElementNS = function (namespaceURI, qualifiedName) {
			return document.createElement(qualifiedName);
		};
	}
	if (!document.importNode) {
		document.importNode = function (node, deep) {
			var a,
			i,
			il;
			switch (node.nodeType) {
			case document.ELEMENT_NODE:
				var newNode = document.createElementNS(node.namespaceURI, node.nodeName);
				if (node.attributes && node.attributes.length > 0) {
					for (i = 0, il = node.attributes.length; i < il; i++) {
						a = node.attributes[i];
						try {
							newNode.setAttributeNS(a.namespaceURI, a.nodeName, node.getAttribute(a.nodeName));
						} catch (err) {
							// ignore this error... doesn't seem to make a difference
						}
					}
				}
				if (deep && node.childNodes && node.childNodes.length > 0) {
					for (i = 0, il = node.childNodes.length; i < il; i++) {
						newNode.appendChild(document.importNode(node.childNodes[i], deep));
					}
				}
				return newNode;
			case document.TEXT_NODE:
			case document.CDATA_SECTION_NODE:
				return document.createTextNode(node.nodeValue);
			case document.COMMENT_NODE:
				return document.createComment(node.nodeValue);
			case document.DOCUMENT_FRAGMENT_NODE:
				docFragment = document.createDocumentFragment();
				for (i = 0, il = node.childNodes.length; i < il; ++i) {
					docFragment.appendChild(document.importNode(node.childNodes[i], deep));
				}
				return docFragment;
			}
		};
	}
}
	());
/*!
 * modified classList.js: Cross-browser full element.classList implementation.
 * 1.1.20150312
 * https://github.com/eligrey/classList.js/pull/57
 * @see {@link https://github.com/beck/classlist-polyfill/commit/d94a623c25bc69caf09f7089c0066fd65e760e82}
 * will work in IE11 jsfiddle.net/englishextra/hru3Lt77/
 * wont work in IE11 jsfiddle.net/englishextra/fhsjpsdt/
 * compiler.appspot.com/code/jsccfd159eea1dcee81ce663f071f4a30ad/default.js
 * developer.mozilla.org/en-US/docs/Web/API/Element/classList
 * By Eli Grey, http://eligrey.com
 * License: Dedicated to the public domain.
 * See https://github.com/eligrey/classList.js/blob/master/LICENSE.md
 * passes jshint
 */
if("document"in self){if(!("classList"in document.createElement("_"))||document.createElementNS&&!("classList"in document.createElementNS("http://www.w3.org/2000/svg","g"))){(function(view){"use strict";if(!('Element'in view))return;var classListProp="classList",protoProp="prototype",elemCtrProto=view.Element[protoProp],objCtr=Object,strTrim=String[protoProp].trim||function(){return this.replace(/^\s+|\s+$/g,"");},arrIndexOf=Array[protoProp].indexOf||function(item){var i=0,len=this.length;for(;i<len;i++){if(i in this&&this[i]===item){return i;}}return-1;},DOMEx=function(type,message){this.name=type;this.code=DOMException[type];this.message=message;},checkTokenAndGetIndex=function(classList,token){if(token===""){throw new DOMEx("SYNTAX_ERR","An invalid or illegal string was specified");}if(/\s/.test(token)){throw new DOMEx("INVALID_CHARACTER_ERR","String contains an invalid character");}return arrIndexOf.call(classList,token);},ClassList=function(elem){var trimmedClasses=strTrim.call(elem.getAttribute("class")||""),classes=trimmedClasses?trimmedClasses.split(/\s+/):[],i=0,len=classes.length;for(;i<len;i++){this.push(classes[i]);}this._updateClassName=function(){elem.setAttribute("class",this.toString());};},classListProto=ClassList[protoProp]=[],classListGetter=function(){return new ClassList(this);};DOMEx[protoProp]=Error[protoProp];classListProto.item=function(i){return this[i]||null;};classListProto.contains=function(token){token+="";return checkTokenAndGetIndex(this,token)!==-1;};classListProto.add=function(){var tokens=arguments,i=0,l=tokens.length,token,updated=false;do{token=tokens[i]+"";if(checkTokenAndGetIndex(this,token)===-1){this.push(token);updated=true;}}while(++i<l);if(updated){this._updateClassName();}};classListProto.remove=function(){var tokens=arguments,i=0,l=tokens.length,token,updated=false,index;do{token=tokens[i]+"";index=checkTokenAndGetIndex(this,token);while(index!==-1){this.splice(index,1);updated=true;index=checkTokenAndGetIndex(this,token);}}while(++i<l);if(updated){this._updateClassName();}};classListProto.toggle=function(token,force){token+="";var result=this.contains(token),method=result?force!==true&&"remove":force!==false&&"add";if(method){this[method](token);}if(force===true||force===false){return force;}else{return!result;}};classListProto.toString=function(){return this.join(" ");};if(objCtr.defineProperty){var classListPropDesc={get:classListGetter,enumerable:true,configurable:true};try{objCtr.defineProperty(elemCtrProto,classListProp,classListPropDesc);}catch(ex){if(ex.number === undefined || ex.number === -0x7FF5EC54){classListPropDesc.enumerable=false;objCtr.defineProperty(elemCtrProto,classListProp,classListPropDesc);}}}else if(objCtr[protoProp].__defineGetter__){elemCtrProto.__defineGetter__(classListProp,classListGetter);}}(self));}(function(){"use strict";var testElement=document.createElement("_");testElement.classList.add("c1","c2");if(!testElement.classList.contains("c2")){var createMethod=function(method){var original=DOMTokenList.prototype[method];DOMTokenList.prototype[method]=function(token){var i,len=arguments.length;for(i=0;i<len;i++){token=arguments[i];original.call(this,token);}};};createMethod('add');createMethod('remove');}testElement.classList.toggle("c3",false);if(testElement.classList.contains("c3")){var _toggle=DOMTokenList.prototype.toggle;DOMTokenList.prototype.toggle=function(token,force){var _contains=!this.contains(token),_force=!force;if(1 in arguments&&_contains===_force){return force;}else{return _toggle.call(this,token);}};}testElement=null;}());}
/*!
 * modified dataset.js
 * source: github.com/remy/polyfills/blob/master/dataset.js
 * passes jshint
 */
(function(){var forEach=[].forEach,regex=/^data-(.+)/,dashChar=/\-([a-z])/ig,el=document.createElement("div"),mutationSupported=false,match;function detectMutation(){mutationSupported=true;this.removeEventListener("DOMAttrModified",detectMutation,false);} function toCamelCase(s){return s.replace(dashChar,function(m,l){return l.toUpperCase();});} function updateDataset(){var dataset={};forEach.call(this.attributes,function(attr){match=attr.name.match(regex)||"";if(match){dataset[toCamelCase(match[1])]=attr.value;}});return dataset;} if("undefined"!==el.dataset){return;} el.addEventListener("DOMAttrModified",detectMutation,false);el.setAttribute("foo","bar");function defineElementGetter(obj,prop,getter){if(Object.defineProperty){Object.defineProperty(obj,prop,{get:getter});}else{obj.__defineGetter__(prop,getter);}} defineElementGetter(Element.prototype,"dataset",mutationSupported?function(){if(!this._datasetCache){this._datasetCache=updateDataset.call(this);} return this._datasetCache;}:updateDataset);document.addEventListener("DOMAttrModified",function(event){delete event.target._datasetCache;},false);})();
/*!
 * modified matchMedia() polyfill - Test a CSS media type/query in JS.
 * github.com/paulirish/matchMedia.js
 * Authors & copyright (c) 2012:
 * Scott Jehl, Paul Irish, Nicholas Zakas, David Knight.
 * Dual MIT/BSD license
 * fixed Expected an assignment or function call and instead saw an expression.
 * source: github.com/paulirish/matchMedia.js/blob/master/matchMedia.js
 * passes jshint
 */
if(!window.matchMedia){window.matchMedia=function(){"use strict";var styleMedia=(window.styleMedia||window.media);if(!styleMedia){var style=document.createElement('style'),script=document.getElementsByTagName('script')[0],info=null;style.type='text/css';style.id='matchmediajs-test';script.parentNode.insertBefore(style,script);info=('getComputedStyle'in window)&&window.getComputedStyle(style,null)||style.currentStyle;styleMedia={matchMedium:function(media){var text='@media '+media+'{ #matchmediajs-test { width: 1px; } }';if(style.styleSheet){style.styleSheet.cssText=text;}else{style.textContent=text;}return info.width==='1px';}};}return function(media){return{matches:styleMedia.matchMedium(media||'all'),media:media||'all'};};}();}
/*!
 * modified paulirish.com/2011/requestanimationframe-for-smart-animating/
 * my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
 * requestAnimationFrame polyfill by Erik Moller. fixes from Paul Irish and Tino Zijdel
 * MIT license
 * source: gist.github.com/paulirish/1579671
 * passes jshint
 */
(function(){for(var e=0,b=["ms","moz","webkit","o"],a=0;a<b.length&&!window.requestAnimationFrame;++a){window.requestAnimationFrame=window[b[a]+"RequestAnimationFrame"];window.cancelAnimationFrame=window[b[a]+"CancelAnimationFrame"]||window[b[a]+"CancelRequestAnimationFrame"];}if(!window.requestAnimationFrame){window.requestAnimationFrame=function(a,b){var c=(new Date()).getTime(),d=Math.max(0,16-(c-e)),f=window.setTimeout(function(){a(c+d);},d);e=c+d;return f;};}if(!window.cancelAnimationFrame){window.cancelAnimationFrame=function(a){clearTimeout(a);};}})();
