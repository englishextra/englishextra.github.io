/*!
 * @license Minigrid v3.1.1 minimal cascading grid layout http://alves.im/minigrid
 * @see {@link https://github.com/henriquea/minigrid}
 * changed element selection method
 * passes jshint
 */
(function(root, document) {
	"use strict";
	function extend(a, b) {
		for (var key in b) {
			if (b.hasOwnProperty(key)) {
				a[key] = b[key];
			}
		}
		return a;
	}
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
	var Minigrid = function(props) {
		var containerEle = props.container instanceof Node ?
			(props.container) :
			(elementsSelector(props.container) || "");
		var itemsNodeList = props.item instanceof NodeList ?
			props.item :
			(elementsSelector(props.item) || "");
		this.props = extend(props, {
			container: containerEle,
			nodeList: itemsNodeList
		});
	};
	Minigrid.prototype.mount = function() {
		if (!this.props.container) {
			return false;
		}
		if (!this.props.nodeList || this.props.nodeList.length === 0) {
			return false;
		}
		var gutter = (typeof this.props.gutter === "number" && isFinite(this.props.gutter) && Math.floor(this.props.gutter) === this.props.gutter) ? this.props.gutter : 0;
		var done = this.props.done;
		var containerEle = this.props.container;
		var itemsNodeList = this.props.nodeList;
		containerEle.style.width = "";
		var forEach = Array.prototype.forEach;
		var containerWidth = containerEle.getBoundingClientRect().width;
		var firstChildWidth = itemsNodeList[0].getBoundingClientRect().width + gutter;
		var cols = Math.max(Math.floor((containerWidth - gutter) / firstChildWidth), 1);
		var count = 0;
		containerWidth = (firstChildWidth * cols + gutter) + "px";
		containerEle.style.width = containerWidth;
		containerEle.style.position = "relative";
		var itemsGutter = [];
		var itemsPosX = [];
		for (var g = 0; g < cols; ++g) {
			itemsPosX.push(g * firstChildWidth + gutter);
			itemsGutter.push(gutter);
		}
		if (this.props.rtl) {
			itemsPosX.reverse();
		}
		forEach.call(itemsNodeList, function(item) {
			var itemIndex = itemsGutter.slice(0).sort(function(a, b) {
				return a - b;
			}).shift();
			itemIndex = itemsGutter.indexOf(itemIndex);
			var posX = parseInt(itemsPosX[itemIndex]);
			var posY = parseInt(itemsGutter[itemIndex]);
			item.style.position = "absolute";
			item.style.webkitBackfaceVisibility = item.style.backfaceVisibility = "hidden";
			item.style.transformStyle = "preserve-3d";
			item.style.transform = "translate3D(" + posX + "px," + posY + "px, 0)";
			itemsGutter[itemIndex] += item.getBoundingClientRect().height + gutter;
			count = count + 1;
		});
		containerEle.style.display = "";
		var containerHeight = itemsGutter.slice(0).sort(function(a, b) {
			return a - b;
		}).pop();
		containerEle.style.height = containerHeight + "px";
		if (typeof done === "function") {
			done(itemsNodeList);
		}
	};
	root.Minigrid = Minigrid;
}
("undefined" !== typeof window ? window : this, document));
