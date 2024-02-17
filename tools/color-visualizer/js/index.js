"use strict";

var body = document.getElementsByTagName("BODY")[0];

new Vue({
	el: "#app",
	name: "color-vis",
	data: {
		rowList: "#1ABC9C\n#16A085\n#2ECC71\n#27AE60\n#3498DB\n#2980B9\n#9B59B6\n#8E44AD\n#34495E\n#2C3E50\n#F1C40F\n#F39C12\n#E67E22\n#D35400\n#E74C3C\n#C0392B\n#ECF0F1\n#BDC3C7\n#95A5A6\n#7F8C8D",
		bg: "white",
		txt: "black",
		temp: "#EEEEEE00",
		colorsList: [],
		removedColors: [],
		codeFormat: "rgb",
		size: 150,
		showNames: false,
		showSaveBtn: false,
		notifs: [],
		notifDur: 3000
	},

	mounted: function mounted() {
		var val = this.rowList;

		if (val !== "") {
			return this.colorsList = val.split("\n");
		}
	},

	computed: {
		all: function all() {
			return {
				"background-color": this.tc(this.txt),
				color: this.tc(this.bg)
			};
		},
		text: function text() {
			return {
				color: this.tc(this.txt)
			};
		},
		border: function border() {
			return {
				"border-color": this.tc(this.txt)
			};
		},
		bubbleSize: function bubbleSize() {
			return {
				width: this.size + "px",
				height: this.size + "px"
			};
		},
		bubblePad: function bubblePad() {
			return {
				padding: this.size / 10 + "px"
			};
		}
	},

	methods: {
		// color format

		tc: function tc(e) {
			var f = tinycolor(e);

			if (f.isValid()) {
				return f;
			}
		},
		toHex: function toHex(e) {
			if (this.codeFormat == "rgb") {
				return this.tc(e).toHexString();
			}

			return this.tc(e).toHex8String();
		},

		// color ops
		copyColor: function copyColor(item) {
			var v = this.toHex(item);

			new Clipboard(".colors__circle");
			this.notifs.push({
				text: v + " copied",
				show: true
			});
		},
		removeColor: function removeColor(item) {
			var index = this.colorsList.indexOf(item);

			this.removedColors.push({
				i: index,
				v: item
			});
			this.colorsList.splice(index, 1);

			this.showSaveBtn = true;

			// suppress color copy notif when removeing
			// as both events use "click"
			this.notifs.map(function (e) {
				return e.show = false;
			});
		},
		undoRemovedColor: function undoRemovedColor() {
			var item = this.removedColors[this.removedColors.length - 1];
			var index = this.removedColors.indexOf(item);

			this.removedColors.splice(index, 1);
			this.colorsList.splice(item.i, 0, item.v);
		},

		// notif
		hideNotif: function hideNotif(i) {
			var _this = this;

			setTimeout(function () {
				return _this.notifs[i].show = false;
			}, this.notifDur);

			return this.notifs[i].show;
		},

		// save list to desktop
		saveList: function saveList() {
			var text = this.colorsList.join("\n");
			var blob = new Blob([text], {
				type: "text/plain;charset=utf-8"
			});
			saveAs(blob, "colors-vis-List.txt");

			this.notifs.push({
				text: 'File Saved To Desktop',
				show: true
			});
		}
	},

	watch: {
		bg: function bg(val) {
			body.style.background = this.tc(val);
		},
		txt: function txt(val) {
			body.style.color = this.tc(val);
		},
		colorsList: function colorsList(val) {
			if (val == this.rowList.split("\n").toString()) {
				this.showSaveBtn = false;
			}
		}
	}
});

// TODO
// make grid like apple iwatch bubbles
// combine colors
