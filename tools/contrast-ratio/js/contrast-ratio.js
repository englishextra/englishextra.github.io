/*global background, backgroundDisplay, Color, escape, foreground, foregroundDisplay,
Incrementable, onhashchange:true, preciseContrast, swap,wcag */

/*jshint immed:true */

function $(expr, con) {
	return typeof expr === "string" ? (con || document).querySelector(expr) : expr;
}

function $$(expr, con) {
	return Array.prototype.slice.call((con || document).querySelectorAll(expr));
}

// Make each ID a global variable
// Many browsers do this anyway (it’s in the HTML5 spec), so it ensures consistency

$$("[id]").forEach(function (element) {
	window[element.id] = element;
});

// Math.floor with precision

function floor(number, decimals) {
	decimals = +decimals || 0;
	var multiplier = Math.pow(10, decimals);
	return Math.floor(number * multiplier) / multiplier;
}

var messages = {
	"semitransparent": "The background is semi-transparent, so the contrast ratio cannot be precise. Depending on what’s going to be underneath, it could be any of the following:",
	"fail": "Fails WCAG 2.0 :-(",
	"aa-large": "Passes AA for large text (above 18pt or bold above 14pt)",
	"aa": "Passes AA level for any size text and AAA for large text (above 18pt or bold above 14pt)",
	"aaa": "Passes AAA level for any size text"
};
var canvas = document.createElement("canvas"),
ctx = canvas.getContext("2d");
canvas.width = canvas.height = 16;
document.body.appendChild(canvas);
var bg;
var fg;

if (window.Incrementable) {
	bg = new Incrementable(background);
	fg = new Incrementable(foreground);
}

var output = $(".contrast");
var levels = {
	"fail": {
		range: [0, 3],
		color: "hsl(0, 100%, 40%)"
	},
	"aa-large": {
		range: [3, 4.5],
		color: "hsl(40, 100%, 45%)"
	},
	"aa": {
		range: [4.5, 7],
		color: "hsl(80, 60%, 45%)"
	},
	"aaa": {
		range: [7, 22],
		color: "hsl(95, 60%, 41%)"
	}
};

function rangeIntersect(min, max, upper, lower) {
	return (max < upper ? max : upper) - (lower < min ? min : lower);
}

function updateLuminance(input) {
	var luminanceOutput = $(".rl", input.parentNode);
	var color = input.color;

	if (input.color.alpha < 1) {
		var lumBlack = color.overlayOn(Color.BLACK).luminance;
		var lumWhite = color.overlayOn(Color.WHITE).luminance;
		luminanceOutput.textContent = lumBlack + " - " + lumWhite;
		luminanceOutput.style.color = Math.min(lumBlack, lumWhite) < 0.2 ? "white" : "black";
	} else {
		luminanceOutput.textContent = color.luminance;
		luminanceOutput.style.color = color.luminance < 0.2 ? "white" : "black";
	}
}

function update() {
	if (foreground.color && background.color) {
		if (foreground.value !== foreground.defaultValue || background.value !== background.defaultValue) {
			window.onhashchange = null;
			location.hash = "#" + encodeURIComponent(foreground.value) + "-on-" + encodeURIComponent(background.value);
			setTimeout(function () {
				window.onhashchange = hashchange;
			}, 10);
		}

		var contrast = background.color.contrast(foreground.color);
		console.log(contrast);
		updateLuminance(background);
		updateLuminance(foreground);
		var min = contrast.min,
		max = contrast.max,
		range = max - min,
		classes = [],
		percentages = [];

		for (var level in levels) {
			if (levels.hasOwnProperty(level)) {
				var bounds = levels[level].range,
				lower = bounds[0],
				upper = bounds[1];

				if (min < upper && max >= lower) {
					classes.push(level);
					percentages.push({
						level: level,
						percentage: 100 * rangeIntersect(min, max, upper, lower) / range
					});
				}
			}
		}

		$("strong", output).textContent = floor(contrast.ratio, 2);
		preciseContrast.innerHTML = "Precise contrast: ".concat(contrast.ratio - contrast.error);
		var error = $(".error", output);

		if (contrast.error) {
			error.textContent = "±" + floor(contrast.error, 2);
			error.title = floor(min, 2) + " - " + floor(max, 2);
			preciseContrast.textContent = "".concat(min, " - ").concat(max);
		} else {
			error.textContent = "";
			error.title = "";
			preciseContrast.textContent = contrast.ratio;
		}

		if (classes.length <= 1) {
			wcag.textContent = messages[classes[0]];
			output.style.backgroundImage = "";
			output.style.backgroundColor = levels[classes[0]].color;
		} else {
			var fragment = document.createDocumentFragment();
			var p = document.createElement("p");
			p.textContent = messages.semitransparent;
			fragment.appendChild(p);
			var ul = document.createElement("ul");

			for (var i = 0; i < classes.length; i++) {
				var li = document.createElement("li");
				li.textContent = messages[classes[i]];
				ul.appendChild(li);
			}

			fragment.appendChild(ul);
			wcag.textContent = "";
			wcag.appendChild(fragment); // Create gradient illustrating levels

			var stops = [],
			previousPercentage = 0;

			for (var j = 0; j < 2 * percentages.length; j++) {
				var info = percentages[j % percentages.length];
				var level2 = info.level2;
				var color = levels[level2].color,
				percentage = previousPercentage + info.percentage / 2;
				stops.push(color + " " + previousPercentage + "%", color + " " + percentage + "%");
				previousPercentage = percentage;
			}

			var gradient = "linear-gradient(135deg, " + stops.join(", ") + ")";
			output.style.backgroundImage = gradient;
		}

		output.className = "contrast " + classes.join(" ");
		ctx.clearRect(0, 0, 16, 16);
		ctx.fillStyle = background.color + "";
		ctx.fillRect(0, 0, 8, 16);
		ctx.fillStyle = foreground.color + "";
		ctx.fillRect(8, 0, 8, 16);
	}
}

function colorChanged(input) {
	input.style.width = input.value.length * 0.56 + "em";
	input.style.width = input.value.length + "ch";
	var isForeground = input == foreground;
	var display = isForeground ? foregroundDisplay : backgroundDisplay;
	var previousColor = getComputedStyle(display).backgroundColor; // Add hash to front of 3, 4, 6, and 8 digit hex codes.

	var accepted_matches = [3, 4, 6, 8];
	var match_result = input.value.match(/^[0-9a-f]{3,8}$/i);

	if (match_result && accepted_matches.includes(match_result[0].length)) {
		input.value = "#" + input.value;
	}

	display.style.background = input.value;
	var color = getComputedStyle(display).backgroundColor;

	if (color && input.value && (color !== previousColor || color === "transparent" || color === "rgba(0, 0, 0, 0)")) {
		// Valid & different color
		if (isForeground) {
			backgroundDisplay.style.color = input.value;
		}

		input.color = new Color(color);
		return true;
	}

	return false;
}

function hashchange() {
	if (location.hash) {
		var colors = location.hash.slice(1).split("-on-");
		foreground.value = decodeURIComponent(colors[0]);
		background.value = decodeURIComponent(colors[1]);
	} else {
		foreground.value = foreground.defaultValue;
		background.value = background.defaultValue;
	}

	background.oninput();
	foreground.oninput();
}

background.oninput = foreground.oninput = function () {
	var valid = colorChanged(this);

	if (valid) {
		update();
	}
};

swap.onclick = function () {
	var backgroundColor = background.value;
	background.value = foreground.value;
	foreground.value = backgroundColor;
	colorChanged(background);
	colorChanged(foreground);
	update();
};

window.encodeURIComponent = (function () {
	var encodeURIComponent = window.encodeURIComponent;
	return function (str) {
		return encodeURIComponent(str).replace(/[()]/g, function ($0) {
			return escape($0);
		});
	};
}
	());

window.decodeURIComponent = (function () {
	var decodeURIComponent = window.decodeURIComponent;
	return function (str) {
		return str.search(/%[\da-f]/i) > -1 ? decodeURIComponent(str) : str;
	};
}
	());

onhashchange = hashchange;
onhashchange();
