// Color Wheel with D3
// http://github.com/benknight/kuler-d3
// Benjamin Knight
// MIT License
(function (root, factory) {
	// AMD/requirejs: Define the module
	if (typeof define === "function" && define.amd) {
		define(['tinycolor', 'd3'], factory);
	} else {
		// Expose to browser window
		root.ColorWheel = factory(root.tinycolor, root.d3);
	}
}
	(this, function (tinycolor, d3) {
		"use strict";
		var ColorWheel = function ColorWheel(options) {
			var self = this;
			// --- Settings ---
			this.options = {
				container: document.body,
				radius: 175,
				margin: 40, // space around the edge of the wheel
				markerWidth: 40,
				defaultSlice: 15,
				initRoot: 'red',
				initMode: ColorWheel.modes.ANALOGOUS
			};
			// Merge default options with options param. (Similar to jQuery.extend)
			if (typeof options === "object") {
				for (var option in options) {
					if (option == 'initMode') {
						ColorWheel.checkIfModeExists(options[option]);
					}
					this.options[option] = options[option];
				}
			}
			var diameter = this.options.radius * 2;
			this.currentMode = this.options.initMode;
			this.container = d3.select(this.options.container);
			// --- Nodes ---
			this.$ = {};
			this.$.wheel = this.container.append('svg').attr({
					'class': 'wheel',
					width: diameter,
					height: diameter,
					viewBox: [
						-1 * this.options.margin,
						-1 * this.options.margin,
						diameter + 2 * this.options.margin,
						diameter + 2 * this.options.margin
					].join(' ')
				});
			this.$.wheel.append('circle').attr({
				fill: 'black',
				r: this.options.radius,
				cx: this.options.radius,
				cy: this.options.radius,
				transform: 'translate(4, 4)'
			});
			this.$.wheel.append('image').attr({
				width: diameter,
				height: diameter,
				'xlink:href': './img/wheel.png'
			});
			this.$.markerTrails = this.$.wheel.append('g');
			this.$.markers = this.$.wheel.append('g');
			// --- Events ---
			this.dispatch = d3.dispatch('update', 'updateEnd', 'bindData');
			this.dispatch.on('bindData.default', function () {
				self.setHarmony();
			});
			this.dispatch.on('update.default', function () {
				self.container.selectAll('.wheel__marker').attr({
					transform: function (d) {
						var hue = ColorWheel.scientificToArtisticSmooth(d.h);
						var p = self.getSVGPositionFromHS(d.h, d.s);
						return ['translate(' + [p.x, p.y].join() + ')'].join(' ');
					}
				}).select('circle').attr({
					fill: function (d) {
						return ColorWheel.hexFromHS(d.h, d.s);
					}
				});
				self.container.selectAll('.wheel__marker-trail').attr({
					'x2': function (d) {
						var p = self.getSVGPositionFromHS(d.h, d.s);
						return p.x;
					},
					'y2': function (d) {
						var p = self.getSVGPositionFromHS(d.h, d.s);
						return p.y;
					}
				});
			});
			this.dispatch.on('updateEnd.default', function () {
				self.container.attr('data-mode', self.currentMode);
			});
			// --- Plugins ---
			for (var pluginId in ColorWheel.plugins) {
				if (typeof ColorWheel.plugins[pluginId] == "function") {
					ColorWheel.plugins[pluginId](this);
				}
			}
		};
		ColorWheel.prototype.bindData = function (data) {
			var self = this;
			// Data can be passed as a whole number, array of color strings, or array of
			// objects with keys 'colorString' and 'name'.
			if (data.constructor === Array) {
				var data = data.map(function (datum) {
						var d;
						if (typeof datum === 'string') {
							d = tinycolor(datum).toHsv();
						} else if (typeof datum === "object") {
							d = tinycolor(datum.colorString).toHsv();
							d.s = 1.0;
							d.name = datum.name;
						}
						return d;
					});
				this.currentMode = ColorWheel.modes.CUSTOM;
			} else {
				// We weren't given any data so create our own.
				var numColors = (typeof data === 'number') ? data : 5;
				data = Array.apply(null, {
						length: numColors
					}).map(function () {
						return tinycolor(self.options.initRoot).toHsv();
					});
			}
			var markerTrails = this.$.markerTrails.selectAll('.wheel__marker-trail').data(data);
			markerTrails.enter().append('line').attr({
				'class': 'wheel__marker-trail',
				'x1': this.options.radius,
				'y1': this.options.radius,
				'stroke': 'white',
				'stroke-opacity': 0.75,
				'stroke-width': 3,
				'stroke-dasharray': '10, 6'
			});
			markerTrails.exit().remove();
			var markers = this.$.markers.selectAll('.wheel__marker').data(data);
			markers.enter()
			.append('g').attr('class', 'wheel__marker')
			.append('circle')
			.attr({
				'r': this.options.markerWidth / 2,
				'stroke': 'white',
				'stroke-width': 2,
				'stroke-opacity': 0.9,
				'cursor': 'move'
			});
			markers.exit().remove();
			markers.append('text').text(function (d) {
				return d.name;
			}).attr({
				x: (this.options.markerWidth / 2) + 8,
				y: (this.options.markerWidth / 4) - 5,
				fill: 'white',
				'font-size': '13px',
			});
			markers.call(this.getDragBehavior());
			this.dispatch.bindData(data);
			this.dispatch.update();
		};
		ColorWheel.prototype.getDragBehavior = function () {
			var self = this;
			return d3.behavior.drag()
			.on('drag', function (d) {
				var pos,
				hs,
				p,
				dragHue,
				startingHue,
				theta1,
				theta2;
				pos = self.pointOnCircle(d3.event.x, d3.event.y);
				hs = self.getHSFromSVGPosition(pos.x, pos.y);
				d.h = hs.h;
				d.s = hs.s;
				p = self.svgToCartesian(d3.event.x, d3.event.y);
				dragHue = ((Math.atan2(p.y, p.x) * 180 / Math.PI) + 720) % 360;
				startingHue = parseFloat(d3.select(this).attr('data-startingHue'));
				theta1 = (360 + startingHue - dragHue) % 360;
				theta2 = (360 + dragHue - startingHue) % 360;
				self.updateHarmony(this, theta1 < theta2 ? -1 * theta1 : theta2);
				self.dispatch.update();
			})
			.on('dragstart', function () {
				self.container.selectAll('.wheel__marker')
				.attr('data-startingHue', function (d) {
					return ColorWheel.scientificToArtisticSmooth(d.h);
				});
			})
			.on('dragend', function () {
				self.container.selectAll('.wheel__marker').attr('data-startingHue', null);
				self.dispatch.updateEnd();
			});
		};
		ColorWheel.prototype.setHarmony = function () {
			var self = this;
			var root = this.container.select('.wheel__marker');
			var rootHue = ColorWheel.scientificToArtisticSmooth(root.datum().h);
			switch (this.currentMode) {
			case ColorWheel.modes.ANALOGOUS:
				this.container.selectAll('.wheel__marker').each(function (d, i) {
					var newHue = (rootHue + (ColorWheel.markerDistance(i) * self.options.defaultSlice) + 720) % 360;
					d.h = ColorWheel.artisticToScientificSmooth(newHue);
					d.s = 1;
					d.v = 1;
				});
				break;
			case ColorWheel.modes.MONOCHROMATIC:
			case ColorWheel.modes.SHADES:
				this.container.selectAll('.wheel__marker').each(function (d, i) {
					d.h = ColorWheel.artisticToScientificSmooth(rootHue);
					if (self.currentMode == ColorWheel.modes.SHADES) {
						d.s = 1;
						d.v = 0.25 + 0.75 * Math.random();
					} else {
						d.s = 1 - (0.15 * i + Math.random() * 0.1);
						d.v = 0.75 + 0.25 * Math.random();
					}
				});
				break;
			case ColorWheel.modes.COMPLEMENTARY:
				this.container.selectAll('.wheel__marker').each(function (d, i) {
					var newHue = (rootHue + ((i % 2) * 180) + 720) % 360;
					d.h = ColorWheel.artisticToScientificSmooth(newHue);
					d.s = 1 - 0.2 * ColorWheel.stepFn(2)(i);
					d.v = 1;
				});
				break;
			case ColorWheel.modes.TRIAD:
				this.container.selectAll('.wheel__marker').each(function (d, i) {
					var newHue = (rootHue + ((i % 3) * 120) + 720) % 360;
					d.h = ColorWheel.artisticToScientificSmooth(newHue);
					d.s = 1 - 0.3 * ColorWheel.stepFn(3)(i);
					d.v = 1;
				});
				break;
			case ColorWheel.modes.TETRAD:
				this.container.selectAll('.wheel__marker').each(function (d, i) {
					var newHue = (rootHue + ((i % 4) * 90) + 720) % 360;
					d.h = ColorWheel.artisticToScientificSmooth(newHue);
					d.s = 1 - 0.4 * ColorWheel.stepFn(4)(i);
					d.v = 1;
				});
				break;
			}
			this.dispatch.update();
			this.dispatch.updateEnd();
		};
		ColorWheel.prototype.updateHarmony = function (target, theta) {
			var self = this;
			var root = this.container.select('.wheel__marker');
			var rootHue = ColorWheel.scientificToArtisticSmooth(root.datum().h);
			// Find out how far the dragging marker is from the root marker.
			var cursor = target;
			var counter = 0;
			while (cursor = cursor.previousSibling) {
				counter++;
			}
			var targetDistance = ColorWheel.markerDistance(counter);
			switch (this.currentMode) {
			case ColorWheel.modes.ANALOGOUS:
				this.container.selectAll('.wheel__marker').each(function (d, i) {
					var startingHue = parseFloat(d3.select(this).attr('data-startingHue'));
					var slices = 1;
					if (targetDistance !== 0) {
						slices = ColorWheel.markerDistance(i) / targetDistance;
					}
					if (this !== target) {
						d.h = ColorWheel.artisticToScientificSmooth(
								(startingHue + (slices * theta) + 720) % 360);
					}
				});
				break;
			case ColorWheel.modes.MONOCHROMATIC:
			case ColorWheel.modes.COMPLEMENTARY:
			case ColorWheel.modes.SHADES:
			case ColorWheel.modes.TRIAD:
			case ColorWheel.modes.TETRAD:
				this.container.selectAll('.wheel__marker').each(function (d) {
					var startingHue = parseFloat(d3.select(this).attr('data-startingHue'));
					d.h = ColorWheel.artisticToScientificSmooth((startingHue + theta + 720) % 360);
					if (self.currentMode == ColorWheel.modes.SHADES) {
						d.s = 1;
					}
				});
				break;
			}
		};
		ColorWheel.prototype.svgToCartesian = function (x, y) {
			return {
				'x': x - this.options.radius,
				'y': this.options.radius - y
			};
		};
		ColorWheel.prototype.cartesianToSVG = function (x, y) {
			return {
				'x': x + this.options.radius,
				'y': this.options.radius - y
			};
		};
		// Given an SVG point (x, y), returns the closest point to (x, y) still in the circle.
		ColorWheel.prototype.pointOnCircle = function (x, y) {
			var p = this.svgToCartesian(x, y);
			if (Math.sqrt(p.x * p.x + p.y * p.y) <= this.options.radius) {
				return {
					'x': x,
					'y': y
				};
			} else {
				var theta = Math.atan2(p.y, p.x);
				var x_ = this.options.radius * Math.cos(theta);
				var y_ = this.options.radius * Math.sin(theta);
				return this.cartesianToSVG(x_, y_);
			}
		};
		// Get a coordinate pair from hue and saturation components.
		ColorWheel.prototype.getSVGPositionFromHS = function (h, s) {
			var hue = ColorWheel.scientificToArtisticSmooth(h);
			var theta = hue * (Math.PI / 180);
			var y = Math.sin(theta) * this.options.radius * s;
			var x = Math.cos(theta) * this.options.radius * s;
			return this.cartesianToSVG(x, y);
		};
		// Inverse of getSVGPositionFromHS
		ColorWheel.prototype.getHSFromSVGPosition = function (x, y) {
			var p = this.svgToCartesian(x, y);
			var theta = Math.atan2(p.y, p.x);
			var artisticHue = (theta * (180 / Math.PI) + 360) % 360;
			var scientificHue = ColorWheel.artisticToScientificSmooth(artisticHue);
			var s = Math.min(Math.sqrt(p.x * p.x + p.y * p.y) / this.options.radius, 1);
			return {
				h: scientificHue,
				s: s
			};
		};
		ColorWheel.prototype._getColorsAs = function (toFunk) {
			return this.container.selectAll('.wheel__marker').data()
			.sort(function (a, b) {
				return a.h - b.h;
			})
			.map(function (d) {
				return tinycolor({
					h: d.h,
					s: d.s,
					v: d.v
				})[toFunk]();
			});
		};
		ColorWheel.prototype.getColorsAsHEX = function () {
			return this._getColorsAs('toHexString');
		};
		ColorWheel.prototype.getColorsAsRGB = function () {
			return this._getColorsAs('toRgbString');
		};
		ColorWheel.prototype.getColorsAsHSL = function () {
			return this._getColorsAs('toHslString');
		};
		ColorWheel.prototype.getColorsAsHSV = function () {
			return this._getColorsAs('toHsvString');
		};
		ColorWheel.prototype.setMode = function (mode) {
			ColorWheel.checkIfModeExists(mode);
			this.currentMode = mode;
			this.container.select('select').property('value', mode);
			this.setHarmony();
		};
		// These modes define a relationship between the colors on a color wheel,
		// based on "science".
		ColorWheel.modes = {
			ANALOGOUS: 'Analogous',
			COMPLEMENTARY: 'Complementary',
			TRIAD: 'Triad',
			TETRAD: 'Tetrad',
			MONOCHROMATIC: 'Monochromatic',
			SHADES: 'Shades',
			CUSTOM: 'Custom'
		};
		// Simple range mapping function
		// For example, mapRange(5, 0, 10, 0, 100) = 50
		ColorWheel.mapRange = function (value, fromLower, fromUpper, toLower, toUpper) {
			return (toLower + (value - fromLower) * ((toUpper - toLower) / (fromUpper - fromLower)));
		}
		// These two functions are ripped straight from Kuler source.
		// They convert between scientific hue to the color wheel's "artistic" hue.
		ColorWheel.artisticToScientificSmooth = function (hue) {
			return (
				hue < 60 ? hue * (35 / 60) :
				hue < 122 ? this.mapRange(hue, 60, 122, 35, 60) :
				hue < 165 ? this.mapRange(hue, 122, 165, 60, 120) :
				hue < 218 ? this.mapRange(hue, 165, 218, 120, 180) :
				hue < 275 ? this.mapRange(hue, 218, 275, 180, 240) :
				hue < 330 ? this.mapRange(hue, 275, 330, 240, 300) :
				this.mapRange(hue, 330, 360, 300, 360));
		}
		ColorWheel.scientificToArtisticSmooth = function (hue) {
			return (
				hue < 35 ? hue * (60 / 35) :
				hue < 60 ? this.mapRange(hue, 35, 60, 60, 122) :
				hue < 120 ? this.mapRange(hue, 60, 120, 122, 165) :
				hue < 180 ? this.mapRange(hue, 120, 180, 165, 218) :
				hue < 240 ? this.mapRange(hue, 180, 240, 218, 275) :
				hue < 300 ? this.mapRange(hue, 240, 300, 275, 330) :
				this.mapRange(hue, 300, 360, 330, 360));
		}
		// Get a hex string from hue and sat components, with 100% brightness.
		ColorWheel.hexFromHS = function (h, s) {
			return tinycolor({
				h: h,
				s: s,
				v: 1
			}).toHexString();
		}
		// Used to determine the distance from the root marker.
		// (The first DOM node with marker class)
		// Domain: [0, 1, 2, 3, 4, ... ]
		// Range: [0, 1, -1, 2, -2, ... ]
		ColorWheel.markerDistance = function (i) {
			return Math.ceil(i / 2) * Math.pow(-1, i + 1);
		}
		// Returns a step function with the given base.
		// e.g. with base = 3, returns a function with this domain/range:
		// Domain: [0, 1, 2, 3, 4, 5, ...]
		// Range: [0, 0, 0, 1, 1, 1, ...]
		ColorWheel.stepFn = function (base) {
			return function (x) {
				return Math.floor(x / base);
			}
		}
		// Throw an error if someone gives us a bad mode.
		ColorWheel.checkIfModeExists = function (mode) {
			var modeExists = false;
			for (var possibleMode in modes) {
				if (modes[possibleMode] == mode) {
					modeExists = true;
					break;
				}
			}
			if (!modeExists) {
				throw Error('Invalid mode specified: ' + mode);
			}
			return true;
		}
		// Provide a plugin interface
		ColorWheel.plugins = {};
		ColorWheel.extend = function (pluginId, pluginFn) {
			this.plugins[pluginId] = pluginFn;
		}
		return ColorWheel;
	}));
