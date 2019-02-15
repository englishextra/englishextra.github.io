/*!
 * modified zoomwall.js v1.1.1
 * The MIT License (MIT)
 * Copyright (c) 2014 Eric Leong
 * added option to specify data attributes for high and low resolution
 * @see {@link https://github.com/ericleong/zoomwall.js}
 * @see {@link https://github.com/ericleong/zoomwall.js/blob/master/zoomwall.js}
 * passes jshint
 */
(function (root, document) {
	"use strict";
	var _addEventListener = "addEventListener";
	var children = "children";
	var classList = "classList";
	var dataset = "dataset";
	var getComputedStyle = "getComputedStyle";
	var getElementsByClassName = "getElementsByClassName";
	var hasOwnProperty = "hasOwnProperty";
	var _length = "length";
	var nextElementSibling = "nextElementSibling";
	var offsetTop = "offsetTop";
	var parentNode = "parentNode";
	var previousElementSibling = "previousElementSibling";
	var style = "style";
	var zoomwall = {
		create: function (blocks, enableKeys, dataAttributeHighresName, dataAttributeLowresName, done) {
			var _this = this;
			_this.dataAttributeHighresName = dataAttributeHighresName || "highres";
			_this.dataAttributeLowresName = dataAttributeLowresName || "lowres";
			zoomwall.resize(blocks[children]);
			blocks[classList].remove("loading");
			blocks[_addEventListener]("click", function () {
				if (_this[children] && _this[children][_length] > 0) {
					zoomwall.shrink(_this[children][0]);
				}
			});
			for (var i = 0; i < blocks[children][_length]; i++) {
				blocks[children][i][_addEventListener]("click", zoomwall.animate);
			}
			if (enableKeys) {
				zoomwall.keys(blocks);
			}
			if (typeof done === "function") {
				done(blocks);
			}
		},
		keys: function (blocks) {
			var keyPager = function (e) {
				if (e.defaultPrevented) {
					return;
				}
				var elem = blocks || document[getElementsByClassName]("zoomwall lightbox")[0];
				if (elem) {
					switch (e.keyCode) {
					case 27:
						if (elem[children] && elem[children][_length] > 0) {
							zoomwall.shrink(elem[children][0]);
						}
						e.preventDefault();
						break;
					case 37:
						zoomwall.page(elem, false);
						e.preventDefault();
						break;
					case 39:
						zoomwall.page(elem, true);
						e.preventDefault();
						break;
					}
				}
			};
			document[_addEventListener]("keydown", keyPager);
			return keyPager;
		},
		resizeRow: function (row, width) {
			if (row && row[_length] > 1) {
				for (var i in row) {
					if (row[hasOwnProperty](i)) {
						row[i][style].width = (parseInt(root[getComputedStyle](row[i]).width, 10) / width * 100) + "%";
						row[i][style].height = "auto";
					}
				}
			}
		},
		calcRowWidth: function (row) {
			var width = 0;
			for (var i in row) {
				if (row[hasOwnProperty](i)) {
					width += parseInt(root[getComputedStyle](row[i]).width, 10);
				}
			}
			return width;
		},
		resize: function (blocks) {
			var row = [];
			var top = -1;
			for (var c = 0; c < blocks[_length]; c++) {
				var block = blocks[c];
				if (block) {
					if (top === -1) {
						top = block[offsetTop];
					} else if (block[offsetTop] !== top) {
						zoomwall.resizeRow(row, zoomwall.calcRowWidth(row));
						row = [];
						top = block[offsetTop];
					}
					row.push(block);
				}
			}
			zoomwall.resizeRow(row, zoomwall.calcRowWidth(row));
		},
		reset: function (block) {
			block[style].transform = "translate(0, 0) scale(1)";
			block[style].webkitTransform = "translate(0, 0) scale(1)";
			block[classList].remove("active");
		},
		shrink: function (block) {
			block[parentNode][classList].remove("lightbox");
			zoomwall.reset(block);
			var prev = block[previousElementSibling];
			while (prev) {
				zoomwall.reset(prev);
				prev = prev[previousElementSibling];
			}
			var next = block[nextElementSibling];
			while (next) {
				zoomwall.reset(next);
				next = next[nextElementSibling];
			}
			if (block[dataset].lowres) {
				block.src = block[dataset].lowres;
			}
		},
		expand: function (block) {
			var _this = this;
			block[classList].add("active");
			block[parentNode][classList].add("lightbox");
			var parentStyle = root[getComputedStyle](block[parentNode]);
			var parentWidth = parseInt(parentStyle.width, 10);
			var parentHeight = parseInt(parentStyle.height, 10);
			var parentTop = block[parentNode].getBoundingClientRect().top;
			var blockStyle = root[getComputedStyle](block);
			var blockWidth = parseInt(blockStyle.width, 10);
			var blockHeight = parseInt(blockStyle.height, 10);
			var targetHeight = root.innerHeight;
			if (parentHeight < root.innerHeight) {
				targetHeight = parentHeight;
			} else if (parentTop > 0) {
				targetHeight -= parentTop;
			}
			if (block[dataset][_this.dataAttributeHighresName]) {
				if (block.src !== block[dataset][_this.dataAttributeHighresName] && block[dataset][_this.dataAttributeLowresName] === undefined) {
					block[dataset][_this.dataAttributeLowresName] = block.src;
				}
				block.src = block[dataset][_this.dataAttributeHighresName];
			}
			var row = [];
			row.push(block);
			var next = block[nextElementSibling];
			while (next && next[offsetTop] === block[offsetTop]) {
				row.push(next);
				next = next[nextElementSibling];
			}
			var prev = block[previousElementSibling];
			while (prev && prev[offsetTop] === block[offsetTop]) {
				row.unshift(prev);
				prev = prev[previousElementSibling];
			}
			var scale = targetHeight / blockHeight;
			if (blockWidth * scale > parentWidth) {
				scale = parentWidth / blockWidth;
			}
			var offsetY = parentTop - block[parentNode][offsetTop] + block[offsetTop];
			if (parentHeight < root.innerHeight || blockHeight * scale < parentHeight) {
				offsetY -= targetHeight / 2 - blockHeight * scale / 2;
			}
			if (parentTop > 0) {
				offsetY -= parentTop;
			}
			var leftOffsetX = 0;
			for (var i = 0; i < row[_length] && row[i] !== block; i++) {
				leftOffsetX += parseInt(root[getComputedStyle](row[i]).width, 10) * scale;
			}
			leftOffsetX = parentWidth / 2 - blockWidth * scale / 2 - leftOffsetX;
			var rightOffsetX = 0;
			for (var j = row[_length] - 1; j >= 0 && row[j] !== block; j--) {
				rightOffsetX += parseInt(root[getComputedStyle](row[j]).width, 10) * scale;
			}
			rightOffsetX = parentWidth / 2 - blockWidth * scale / 2 - rightOffsetX;
			var itemOffset = 0;
			var prevWidth = 0;
			for (var k = 0; k < row[_length]; k++) {
				itemOffset += (prevWidth * scale - prevWidth);
				prevWidth = parseInt(root[getComputedStyle](row[k]).width, 10);
				var percentageOffsetX = (itemOffset + leftOffsetX) / prevWidth * 100;
				var percentageOffsetY = -offsetY / parseInt(root[getComputedStyle](row[k]).height, 10) * 100;
				row[k][style].transformOrigin = "0% 0%";
				row[k][style].webkitTransformOrigin = "0% 0%";
				row[k][style].transform = "translate(" + percentageOffsetX.toFixed(8) + "%, " + percentageOffsetY.toFixed(8) + "%) scale(" + scale.toFixed(8) + ")";
				row[k][style].webkitTransform = "translate(" + percentageOffsetX.toFixed(8) + "%, " + percentageOffsetY.toFixed(8) + "%) scale(" + scale.toFixed(8) + ")";
			}
			var nextOffsetY = blockHeight * (scale - 1) - offsetY;
			var prevHeight;
			itemOffset = 0;
			prevWidth = 0;
			var next2 = row[row[_length] - 1][nextElementSibling];
			var nextRowTop = -1;
			while (next2) {
				var curTop = next2[offsetTop];
				if (curTop === nextRowTop) {
					itemOffset += prevWidth * scale - prevWidth;
				} else {
					if (nextRowTop !== -1) {
						itemOffset = 0;
						nextOffsetY += prevHeight * (scale - 1);
					}
					nextRowTop = curTop;
				}
				prevWidth = parseInt(root[getComputedStyle](next2).width, 10);
				prevHeight = parseInt(root[getComputedStyle](next2).height, 10);
				var percentageOffsetX2 = (itemOffset + leftOffsetX) / prevWidth * 100;
				var percentageOffsetY2 = nextOffsetY / prevHeight * 100;
				next2[style].transformOrigin = "0% 0%";
				next2[style].webkitTransformOrigin = "0% 0%";
				next2[style].transform = "translate(" + percentageOffsetX2.toFixed(8) + "%, " + percentageOffsetY2.toFixed(8) + "%) scale(" + scale.toFixed(8) + ")";
				next2[style].webkitTransform = "translate(" + percentageOffsetX2.toFixed(8) + "%, " + percentageOffsetY2.toFixed(8) + "%) scale(" + scale.toFixed(8) + ")";
				next2 = next2[nextElementSibling];
			}
			var prevOffsetY = -offsetY;
			itemOffset = 0;
			prevWidth = 0;
			var prev2 = row[0][previousElementSibling];
			var prevRowTop = -1;
			while (prev2) {
				var curTop2 = prev2[offsetTop];
				if (curTop2 === prevRowTop) {
					itemOffset -= prevWidth * scale - prevWidth;
				} else {
					itemOffset = 0;
					prevOffsetY -= parseInt(root[getComputedStyle](prev2).height, 10) * (scale - 1);
					prevRowTop = curTop2;
				}
				prevWidth = parseInt(root[getComputedStyle](prev2).width, 10);
				var percentageOffsetX3 = (itemOffset - rightOffsetX) / prevWidth * 100;
				var percentageOffsetY3 = prevOffsetY / parseInt(root[getComputedStyle](prev2).height, 10) * 100;
				prev2[style].transformOrigin = "100% 0%";
				prev2[style].webkitTransformOrigin = "100% 0%";
				prev2[style].transform = "translate(" + percentageOffsetX3.toFixed(8) + "%, " + percentageOffsetY3.toFixed(8) + "%) scale(" + scale.toFixed(8) + ")";
				prev2[style].webkitTransform = "translate(" + percentageOffsetX3.toFixed(8) + "%, " + percentageOffsetY3.toFixed(8) + "%) scale(" + scale.toFixed(8) + ")";
				prev2 = prev2[previousElementSibling];
			}
		},
		animate: function (e) {
			var _this = this;
			if (_this[classList].contains("active")) {
				zoomwall.shrink(_this);
			} else {
				var actives = _this[parentNode][getElementsByClassName]("active");
				for (var i = 0; i < actives[_length]; i++) {
					actives[i][classList].remove("active");
				}
				zoomwall.expand(_this);
			}
			e.stopPropagation();
		},
		page: function (blocks, isNext) {
			var actives = blocks[getElementsByClassName]("active");
			if (actives && actives[_length] > 0) {
				var current = actives[0];
				var next;
				if (isNext) {
					next = current[nextElementSibling];
				} else {
					next = current[previousElementSibling];
				}
				if (next) {
					current[classList].remove("active");
					if (current[dataset].lowres) {
						current.src = current[dataset].lowres;
					}
					zoomwall.expand(next);
				}
			}
		}
	};
	root.Zoomwall= zoomwall;
})("undefined" !== typeof window ? window : this, document);
