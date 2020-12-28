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
(function (root) {
	"use strict";
	var _hasOwnProperty = "hasOwnProperty";
	var replace = "replace";
	var blockregex = /\{\{(([@!]?)(.+?))\}\}(([\s\S]+?)(\{\{:\1\}\}([\s\S]+?))?)\{\{\/\1\}\}/g;
	var valregex = /\{\{([=%])(.+?)\}\}/g;
	var t = function (template) {
		this.t = template;
	};
	function scrub(val) {
		return new Option(val).text[replace](/"/g, "&quot;");
	}
	function get_value(vars, key) {
		var parts = key.split(".");
		while (parts.length) {
			if (!(parts[0]in vars)) {
				return false;
			}
			vars = vars[parts.shift()];
		}
		return vars;
	}
	function render(fragment, vars) {
		return fragment[replace](blockregex, function (_, __, meta, key, inner, if_true, has_else, if_false) {
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
					if (val.hasOwnProperty(i)) {
						vars._key = i;
						vars._val = val[i];
						temp += render(inner, vars);
					}
				}
				vars._key = _;
				vars._val = __;
				return temp;
			}
		}).replace(valregex, function (_, meta, key) {
			var val = get_value(vars, key);
			if (val || val === 0) {
				return meta === "%" ? scrub(val) : val;
			}
			return "";
		});
	}
	t.prototype.render = function (vars) {
		return render(this.t, vars);
	};
	root.t = t;
})("undefined" !== typeof window ? window : this);
