/*!
 * @app ReadMoreJS
 * @desc Breaks the content of an element to the specified number of words
 * @version 1.0.0
 * @license The MIT License (MIT)
 * @author George Raptis | http://georap.gr
 * @see {@link https://github.com/georapbox/ReadMore.js/blob/master/src/readMoreJS.js}
 * changed: rmLink = doc.querySelectorAll('.rm-link');
 * to: rmLink = doc.getElementsByClassName('rm-link');
 * changed: var target = doc.querySelectorAll(options.target)
 * to: var target = elementsSelector(options.target)
 */
(function (win, doc, undef) {
	'use strict';
	var RM = {};
	RM.helpers = {
		extendObj: function () {
			for (var i = 1, l = arguments.length; i < l; i++) {
				for (var key in arguments[i]) {
					if (arguments[i].hasOwnProperty(key)) {
						if (arguments[i][key] && arguments[i][key].constructor && arguments[i][key].constructor === Object) {
							arguments[0][key] = arguments[0][key] || {};
							this.extendObj(arguments[0][key], arguments[i][key]);
						} else {
							arguments[0][key] = arguments[i][key];
						}
					}
				}
			}
			return arguments[0];
		}
	};
	RM.countWords = function (str) {
		return str.split(/\s+/).length;
	};
	RM.generateTrimmed = function (str, wordsNum) {
		return str.split(/\s+/).slice(0, wordsNum).join(' ') + '...';
	};
	RM.init = function (options) {
		var defaults = {
			target: '',
			numOfWords: 50,
			toggle: true,
			moreLink: 'read more...',
			lessLink: 'read less'
		};
		options = RM.helpers.extendObj({}, defaults, options);
		var elementsSelector;
		elementsSelector = function (selector, context, undefined) {
			var matches = {
				"#": "getElementById",
				".": "getElementsByClassName",
				"@": "getElementsByName",
				"=": "getElementsByTagName",
				"*": "querySelectorAll"
			}
			[selector[0]];
			var el = (((context === undefined) ? document : context)[matches](selector.slice(1)));
			return ((el.length < 2) ? el[0] : el);
		};
		var target = elementsSelector(options.target),
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
			trimmedTargetContent = RM.generateTrimmed(targetContent, options.numOfWords);
			targetContentWords = RM.countWords(targetContent);
			initArr.push(targetContent);
			trimmedArr.push(trimmedTargetContent);
			if (options.numOfWords < targetContentWords - 1) {
				target[i].innerHTML = trimmedArr[i];
				if (options.inline) {
					moreContainer = doc.createElement('span');
				} else {
					if (options.customBlockElement) {
						moreContainer = doc.createElement(options.customBlockElement);
					} else {
						moreContainer = doc.createElement('div');
					}
				}
				moreContainer.innerHTML = '<a href="javascript:void(0);" id="rm-more_' +
					i +
					'" class="rm-link" style="cursor:pointer;">' +
					options.moreLink +
					'</a>';
				if (options.inline) {
					target[i].appendChild(moreContainer);
				} else {
					target[i].parentNode.insertBefore(moreContainer, target[i].nextSibling);
				}
			}
		}
		rmLink = doc.getElementsByClassName('rm-link');
		var func = function () {
			moreLinkID = this.getAttribute('id');
			index = moreLinkID.split('_')[1];
			if (this.getAttribute('data-clicked') !== 'true') {
				target[index].innerHTML = initArr[index];
				if (options.toggle !== false) {
					this.innerHTML = options.lessLink;
					this.setAttribute('data-clicked', true);
				} else {
					this.innerHTML = '';
				}
			} else {
				target[index].innerHTML = trimmedArr[index];
				this.innerHTML = options.moreLink;
				this.setAttribute('data-clicked', false);
			}
		};
		for (j = 0, l = rmLink.length; j < l; j++) {
			rmLink[j].onclick = func;
		}
	};
	window.$readMoreJS = RM;
})(this, this.document);
