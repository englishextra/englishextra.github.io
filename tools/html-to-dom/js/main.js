/* global hljs,jQuery,htmltodom,ClipboardJS */
var $		   = jQuery;
var converter   = new htmltodom();
var source;
var prefix;
var result;
var output;
var clipboard;
var download;
var error;

var validatePrefix  = function () {
	var isValid	 = converter.validateVarName( prefix.val() );
	var group	   = prefix.closest('.form-group');
	// var validFeed   = group.find('.valid-feedback');
	var invalidFeed = group.find('.invalid-feedback');
	var isEmpty	 = ! prefix.val() || prefix.val().length == 0;

	if ( ! isEmpty && ! isValid ) { // valid
		group.removeClass('is-valid').addClass('is-invalid');
		prefix.removeClass('is-valid').addClass('is-invalid');
		invalidFeed.html("Invalid variable name.");
	} else if ( ! isEmpty ) { // invalid
		group.removeClass('is-invalid').addClass('is-valid');
		prefix.removeClass('is-invalid').addClass('is-valid');
		return true;
	} else { // empty
		group.removeClass('is-valid').addClass('is-invalid');
		prefix.removeClass('is-valid').addClass('is-invalid');
		invalidFeed.html('This field is required.');
	}

	return false;
};

var validateSource  = function () {
	var isEmpty = ! source.val() || source.val().length == 0;
	var group   = source.closest('group');

	if ( isEmpty ) {
		group.addClass('is-invalid').removeClass('is-valid');
		source.addClass('is-invalid').removeClass('is-valid');
	} else {
		group.addClass('is-valid').removeClass('is-invalid');
		source.addClass('is-valid').removeClass('is-invalid');
		return true;
	}

	return false;
};

var downloadFile	= function() {
	'use strict';
	if ( ! validateSource() || ! validatePrefix() )
		return false;

	if (typeof output === 'undefined' || output == null || output.length == 0)
		return false;

	var now	 = Date.now();
	var file	= new File([output], 'htmltodom-' + now + '.js', {
		type: 'text/javascript',
		lastModified: now
	} );

	var link   = document.createElement('a');
	link.href  = URL.createObjectURL(file);
	link.setAttribute('download', file.name);
	document.body.appendChild(link);
	link.click();
	link.remove();
};

var showFullScreen  = function () {
	'use strict';

	if ( ! validateSource() || ! validatePrefix() )
		return false;

	if (typeof output === 'undefined' || output == null || output.length == 0)
		return false;

	$('body').addClass('fullscreen');

	var popup   = $('#source-popup');
	var pre	 = popup.find('pre').find('code');

	pre.html(output);
	hljs.highlightBlock(pre[0]);

	popup.removeClass('hidden');

	$('#popup-close').click(function () {
		popup.addClass('_hiding');
		popup.on('transitionEnd webkitTransitionEnd mozTransitionEnd oTransitionEnd msTransitionEnd', function () {
			if (popup.hasClass('_hiding')) {
				popup.addClass('hidden').removeClass('_hiding');
				$('body').removeClass('fullscreen');
			}
		});
	});
};

$(function () {
	source	  = $('#source');
	prefix	  = $('#prefix');
	result	  = { pre: $('#result') };
	result.code = result.pre.find('code');
	download	= $('#download');
	error	   = $('#error');

	// Higlight.js - Result Code
	result.code.html('// Javascript code will appear here...');
	// hljs.configure({useBR: true});
	hljs.highlightBlock(result.code[0]);
	
	source.on('change focusout blur', validateSource);
	prefix.on('change focusout blur keyup', validatePrefix);
	download.click(downloadFile);
	$('#reset').click(function () {
		result.code.html('// Javascript code will appear here...');
	});
	$('#fullscreen').click(showFullScreen);

	$("#submit").on('click', function () {
		if ( ! validateSource() || ! validatePrefix() )
			return false;

		var data = new Object({
			src: source.val(),
			options: {
				prefix: prefix.val(),
				plaintext: $('#plain-text')[0].checked,
				comments: $('#comments')[0].checked
			}
		});

		// console.log('options', data.options);

		try {
			output  = converter.convert(data);
			result.code.html(output);

			if (window.location.protocol !== 'file:')
				ga('send', 'event', 'click', 'convert');

			// Higlight.js - Result Code
			hljs.highlightBlock(result.code[0]);

			result.pre.removeClass('empty');
			error.addClass('hidden');

			clipboard = new ClipboardJS('#copy', {
				text: function() {
					return output;
				}
			});
			clipboard.on('success', function(e) {
				var og  = e.trigger.getAttribute('aria-label');
				e.trigger.setAttribute('aria-label', 'Copied!');

				e.trigger.addEventListener('mouseleave', function(label, e) {
					e.target.setAttribute('aria-label', label);
				}.bind(null, og), {once: true});
			});
		} catch( e ) {
			console.error(e);

			result.pre.addClass('empty');

			// Higlight.js
			result.code.html('// Error, see above.');
			error.removeClass('hidden').html(e);

			hljs.highlightBlock(result.code[0]);

			output  = '';

			if ( clipboard != null )
				clipboard.destroy();
		}
	});
});