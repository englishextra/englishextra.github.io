/*!
 * modified qr.js -- QR code generator in Javascript (revision 2011-01-19)
 * Written by Kang Seonghoon <public+qrjs@mearie.org>.
 * v0.0.20110119
 * This source code is in the public domain; if your jurisdiction does not
 * recognize the public domain the terms of Creative Commons CC0 license
 * apply. In the other words, you can always do what you want.
 * added options properties: fillcolor and textcolor
 * svg now works in Edge 13 and IE 11
 * @see {@link https://gist.github.com/englishextra/b46969e3382ef737c611bb59d837220b}
 * @see {@link https://github.com/lifthrasiir/qr.js/blob/v0.0.20110119/qr.js}
 * passes jshint with suppressing comments
 */

/*jshint bitwise: false */
(function(root, document) {
	"use strict";

	var length = "length";
	var VERSIONS = [
		null,
		[[10, 7, 17, 13], [1, 1, 1, 1], []],
		[[16, 10, 28, 22], [1, 1, 1, 1], [4, 16]],
		[[26, 15, 22, 18], [1, 1, 2, 2], [4, 20]],
		[[18, 20, 16, 26], [2, 1, 4, 2], [4, 24]],
		[[24, 26, 22, 18], [2, 1, 4, 4], [4, 28]],
		[[16, 18, 28, 24], [4, 2, 4, 4], [4, 32]],
		[[18, 20, 26, 18], [4, 2, 5, 6], [4, 20, 36]],
		[[22, 24, 26, 22], [4, 2, 6, 6], [4, 22, 40]],
		[[22, 30, 24, 20], [5, 2, 8, 8], [4, 24, 44]],
		[[26, 18, 28, 24], [5, 4, 8, 8], [4, 26, 48]],
		[[30, 20, 24, 28], [5, 4, 11, 8], [4, 28, 52]],
		[[22, 24, 28, 26], [8, 4, 11, 10], [4, 30, 56]],
		[[22, 26, 22, 24], [9, 4, 16, 12], [4, 32, 60]],
		[[24, 30, 24, 20], [9, 4, 16, 16], [4, 24, 44, 64]],
		[[24, 22, 24, 30], [10, 6, 18, 12], [4, 24, 46, 68]],
		[[28, 24, 30, 24], [10, 6, 16, 17], [4, 24, 48, 72]],
		[[28, 28, 28, 28], [11, 6, 19, 16], [4, 28, 52, 76]],
		[[26, 30, 28, 28], [13, 6, 21, 18], [4, 28, 54, 80]],
		[[26, 28, 26, 26], [14, 7, 25, 21], [4, 28, 56, 84]],
		[[26, 28, 28, 30], [16, 8, 25, 20], [4, 32, 60, 88]],
		[[26, 28, 30, 28], [17, 8, 25, 23], [4, 26, 48, 70, 92]],
		[[28, 28, 24, 30], [17, 9, 34, 23], [4, 24, 48, 72, 96]],
		[[28, 30, 30, 30], [18, 9, 30, 25], [4, 28, 52, 76, 100]],
		[[28, 30, 30, 30], [20, 10, 32, 27], [4, 26, 52, 78, 104]],
		[[28, 26, 30, 30], [21, 12, 35, 29], [4, 30, 56, 82, 108]],
		[[28, 28, 30, 28], [23, 12, 37, 34], [4, 28, 56, 84, 112]],
		[[28, 30, 30, 30], [25, 12, 40, 34], [4, 32, 60, 88, 116]],
		[[28, 30, 30, 30], [26, 13, 42, 35], [4, 24, 48, 72, 96, 120]],
		[[28, 30, 30, 30], [28, 14, 45, 38], [4, 28, 52, 76, 100, 124]],
		[[28, 30, 30, 30], [29, 15, 48, 40], [4, 24, 50, 76, 102, 128]],
		[[28, 30, 30, 30], [31, 16, 51, 43], [4, 28, 54, 80, 106, 132]],
		[[28, 30, 30, 30], [33, 17, 54, 45], [4, 32, 58, 84, 110, 136]],
		[[28, 30, 30, 30], [35, 18, 57, 48], [4, 28, 56, 84, 112, 140]],
		[[28, 30, 30, 30], [37, 19, 60, 51], [4, 32, 60, 88, 116, 144]],
		[[28, 30, 30, 30], [38, 19, 63, 53], [4, 28, 52, 76, 100, 124, 148]],
		[[28, 30, 30, 30], [40, 20, 66, 56], [4, 22, 48, 74, 100, 126, 152]],
		[[28, 30, 30, 30], [43, 21, 70, 59], [4, 26, 52, 78, 104, 130, 156]],
		[[28, 30, 30, 30], [45, 22, 74, 62], [4, 30, 56, 82, 108, 134, 160]],
		[[28, 30, 30, 30], [47, 24, 77, 65], [4, 24, 52, 80, 108, 136, 164]],
		[[28, 30, 30, 30], [49, 25, 81, 68], [4, 28, 56, 84, 112, 140, 168]]
	];
	var MODE_TERMINATOR = 0;
	var MODE_NUMERIC = 1,
		MODE_ALPHANUMERIC = 2,
		MODE_OCTET = 4,
		MODE_KANJI = 8;
	var NUMERIC_REGEXP = /^\d*$/;
	var ALPHANUMERIC_REGEXP = /^[A-Za-z0-9 $%*+\-./:] * $ /;
	var ALPHANUMERIC_OUT_REGEXP = /^[A-Z0-9 $%*+\-./:] * $ /;
	var ECCLEVEL_L = 1,
		ECCLEVEL_M = 0,
		ECCLEVEL_Q = 3,
		ECCLEVEL_H = 2;
	var GF256_MAP = [],
		GF256_INVMAP = [-1];

	for (var i1 = 0, v = 1; i1 < 255; ++i1) {
		GF256_MAP.push(v);
		GF256_INVMAP[v] = i1;
		v = (v * 2) ^ (v >= 128 ? 0x11d : 0);
	}

	var GF256_GENPOLY = [[]];

	for (var i2 = 0; i2 < 30; ++i2) {
		var prevpoly = GF256_GENPOLY[i2],
			poly = [];

		for (var j1 = 0; j1 <= i2; ++j1) {
			var a = j1 < i2 ? GF256_MAP[prevpoly[j1]] : 0;
			var b = GF256_MAP[(i2 + (prevpoly[j1 - 1] || 0)) % 255];
			poly.push(GF256_INVMAP[a ^ b]);
		}

		GF256_GENPOLY.push(poly);
	}

	var ALPHANUMERIC_MAP = {};

	for (var i = 0; i < 45; ++i) {
		ALPHANUMERIC_MAP[
			"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:".charAt(i)
		] = i;
	}

	var MASKFUNCS = [
		function(i, j) {
			return (i + j) % 2 === 0;
		},
		function(i) {
			return i % 2 === 0;
		},
		function(i, j) {
			return j % 3 === 0;
		},
		function(i, j) {
			return (i + j) % 3 === 0;
		},
		function(i, j) {
			return (((i / 2) | 0) + ((j / 3) | 0)) % 2 === 0;
		},
		function(i, j) {
			return ((i * j) % 2) + ((i * j) % 3) === 0;
		},
		function(i, j) {
			return (((i * j) % 2) + ((i * j) % 3)) % 2 === 0;
		},
		function(i, j) {
			return (((i + j) % 2) + ((i * j) % 3)) % 2 === 0;
		}
	];

	var needsverinfo = function needsverinfo(ver) {
		return ver > 6;
	};

	var getsizebyver = function getsizebyver(ver) {
		return 4 * ver + 17;
	};

	var nfullbits = function nfullbits(ver) {
		var v = VERSIONS[ver];
		var nbits = 16 * ver * ver + 128 * ver + 64;

		if (needsverinfo(ver)) {
			nbits -= 36;
		}

		if (v[2][length]) {
			nbits -= 25 * v[2][length] * v[2][length] - 10 * v[2][length] - 55;
		}

		return nbits;
	};

	var ndatabits = function ndatabits(ver, ecclevel) {
		var nbits = nfullbits(ver) & ~7;
		var v = VERSIONS[ver];
		nbits -= 8 * v[0][ecclevel] * v[1][ecclevel];
		return nbits;
	};

	var ndatalenbits = function ndatalenbits(ver, mode) {
		switch (mode) {
			case MODE_NUMERIC:
				return ver < 10 ? 10 : ver < 27 ? 12 : 14;

			case MODE_ALPHANUMERIC:
				return ver < 10 ? 9 : ver < 27 ? 11 : 13;

			case MODE_OCTET:
				return ver < 10 ? 8 : 16;

			case MODE_KANJI:
				return ver < 10 ? 8 : ver < 27 ? 10 : 12;
		}
	};

	var getmaxdatalen = function getmaxdatalen(ver, mode, ecclevel) {
		var nbits = ndatabits(ver, ecclevel) - 4 - ndatalenbits(ver, mode);

		switch (mode) {
			case MODE_NUMERIC:
				return (
					((nbits / 10) | 0) * 3 +
					(nbits % 10 < 4 ? 0 : nbits % 10 < 7 ? 1 : 2)
				);

			case MODE_ALPHANUMERIC:
				return ((nbits / 11) | 0) * 2 + (nbits % 11 < 6 ? 0 : 1);

			case MODE_OCTET:
				return (nbits / 8) | 0;

			case MODE_KANJI:
				return (nbits / 13) | 0;
		}
	};

	var validatedata = function validatedata(mode, data) {
		switch (mode) {
			case MODE_NUMERIC:
				if (!data.match(NUMERIC_REGEXP)) {
					return null;
				}

				return data;

			case MODE_ALPHANUMERIC:
				if (!data.match(ALPHANUMERIC_REGEXP)) {
					return null;
				}

				return data.toUpperCase();

			case MODE_OCTET:
				if (typeof data === "string") {
					var newdata = [];

					for (var i = 0; i < data[length]; ++i) {
						var ch = data.charCodeAt(i);

						if (ch < 0x80) {
							newdata.push(ch);
						} else if (ch < 0x800) {
							newdata.push(0xc0 | (ch >> 6), 0x80 | (ch & 0x3f));
						} else if (ch < 0x10000) {
							newdata.push(
								0xe0 | (ch >> 12),
								0x80 | ((ch >> 6) & 0x3f),
								0x80 | (ch & 0x3f)
							);
						} else {
							newdata.push(
								0xf0 | (ch >> 18),
								0x80 | ((ch >> 12) & 0x3f),
								0x80 | ((ch >> 6) & 0x3f),
								0x80 | (ch & 0x3f)
							);
						}
					}

					return newdata;
				} else {
					return data;
				}
		}
	};

	var encode = function encode(ver, mode, data, maxbuflen) {
		var buf = [];
		var bits = 0,
			remaining = 8;
		var datalen = data[length];

		var pack = function pack(x, n) {
			if (n >= remaining) {
				buf.push(bits | (x >> (n -= remaining)));

				while (n >= 8) {
					buf.push((x >> (n -= 8)) & 255);
				}

				bits = 0;
				remaining = 8;
			}

			if (n > 0) {
				bits |= (x & ((1 << n) - 1)) << (remaining -= n);
			}
		};

		var nlenbits = ndatalenbits(ver, mode);
		pack(mode, 4);
		pack(datalen, nlenbits);

		switch (mode) {
			case MODE_NUMERIC:
				for (var i = 2; i < datalen; i += 3) {
					pack(parseInt(data.substring(i - 2, i + 1), 10), 10);
				}

				pack(
					parseInt(data.substring(i - 2), 10),
					[0, 4, 7][datalen % 3]
				);
				break;

			case MODE_ALPHANUMERIC:
				for (var i2 = 1; i2 < datalen; i2 += 2) {
					pack(
						ALPHANUMERIC_MAP[data.charAt(i2 - 1)] * 45 +
							ALPHANUMERIC_MAP[data.charAt(i2)],
						11
					);
				}

				if (datalen % 2 === 1) {
					pack(ALPHANUMERIC_MAP[data.charAt(i2 - 1)], 6);
				}

				break;

			case MODE_OCTET:
				for (var i3 = 0; i3 < datalen; ++i3) {
					pack(data[i3], 8);
				}

				break;
		}

		pack(MODE_TERMINATOR, 4);

		if (remaining < 8) {
			buf.push(bits);
		}

		while (buf[length] + 1 < maxbuflen) {
			buf.push(0xec, 0x11);
		}

		if (buf[length] < maxbuflen) {
			buf.push(0xec);
		}

		return buf;
	};

	var calculateecc = function calculateecc(poly, genpoly) {
		var modulus = poly.slice(0);
		var polylen = poly[length],
			genpolylen = genpoly[length];

		for (var k = 0; k < genpolylen; ++k) {
			modulus.push(0);
		}

		for (var i = 0; i < polylen; ) {
			var quotient = GF256_INVMAP[modulus[i++]];

			if (quotient >= 0) {
				for (var j = 0; j < genpolylen; ++j) {
					modulus[i + j] ^= GF256_MAP[(quotient + genpoly[j]) % 255];
				}
			}
		}

		return modulus.slice(polylen);
	};

	var augumenteccs = function augumenteccs(poly, nblocks, genpoly) {
		var subsizes = [];
		var subsize = (poly[length] / nblocks) | 0,
			subsize0 = 0;
		var pivot = nblocks - (poly[length] % nblocks);

		for (var i = 0; i < pivot; ++i) {
			subsizes.push(subsize0);
			subsize0 += subsize;
		}

		for (var i2 = pivot; i2 < nblocks; ++i2) {
			subsizes.push(subsize0);
			subsize0 += subsize + 1;
		}

		subsizes.push(subsize0);
		var eccs = [];

		for (var i3 = 0; i3 < nblocks; ++i3) {
			eccs.push(
				calculateecc(
					poly.slice(subsizes[i3], subsizes[i3 + 1]),
					genpoly
				)
			);
		}

		var result = [];
		var nitemsperblock = (poly[length] / nblocks) | 0;

		for (var i4 = 0; i4 < nitemsperblock; ++i4) {
			for (var j = 0; j < nblocks; ++j) {
				result.push(poly[subsizes[j] + i4]);
			}
		}

		for (var j2 = pivot; j2 < nblocks; ++j2) {
			result.push(poly[subsizes[j2 + 1] - 1]);
		}

		for (var i5 = 0; i5 < genpoly[length]; ++i5) {
			for (var j3 = 0; j3 < nblocks; ++j3) {
				result.push(eccs[j3][i5]);
			}
		}

		return result;
	};

	var augumentbch = function augumentbch(poly, p, genpoly, q) {
		var modulus = poly << q;

		for (var i = p - 1; i >= 0; --i) {
			if ((modulus >> (q + i)) & 1) {
				modulus ^= genpoly << i;
			}
		}

		return (poly << q) | modulus;
	};

	var makebasematrix = function makebasematrix(ver) {
		var v = VERSIONS[ver],
			n = getsizebyver(ver);
		var matrix = [],
			reserved = [];

		for (var i = 0; i < n; ++i) {
			matrix.push([]);
			reserved.push([]);
		}

		var blit = function blit(y, x, h, w, bits) {
			for (var i = 0; i < h; ++i) {
				for (var j = 0; j < w; ++j) {
					matrix[y + i][x + j] = (bits[i] >> j) & 1;
					reserved[y + i][x + j] = 1;
				}
			}
		};

		blit(0, 0, 9, 9, [
			0x7f,
			0x41,
			0x5d,
			0x5d,
			0x5d,
			0x41,
			0x17f,
			0x00,
			0x40
		]);
		blit(n - 8, 0, 8, 9, [0x100, 0x7f, 0x41, 0x5d, 0x5d, 0x5d, 0x41, 0x7f]);
		blit(0, n - 8, 9, 8, [
			0xfe,
			0x82,
			0xba,
			0xba,
			0xba,
			0x82,
			0xfe,
			0x00,
			0x00
		]);

		for (var i2 = 9; i2 < n - 8; ++i2) {
			matrix[6][i2] = matrix[i2][6] = ~i2 & 1;
			reserved[6][i2] = reserved[i2][6] = 1;
		}

		var aligns = v[2],
			m = aligns[length];

		for (var i3 = 0; i3 < m; ++i3) {
			var minj = i3 === 0 || i3 === m - 1 ? 1 : 0,
				maxj = i3 === 0 ? m - 1 : m;

			for (var j = minj; j < maxj; ++j) {
				blit(aligns[i3], aligns[j], 5, 5, [
					0x1f,
					0x11,
					0x15,
					0x11,
					0x1f
				]);
			}
		}

		if (needsverinfo(ver)) {
			var code = augumentbch(ver, 6, 0x1f25, 12);
			var k = 0;

			for (var i4 = 0; i4 < 6; ++i4) {
				for (var j2 = 0; j2 < 3; ++j2) {
					matrix[i4][n - 11 + j2] = matrix[n - 11 + j2][i4] =
						(code >> k++) & 1;
					reserved[i4][n - 11 + j2] = reserved[n - 11 + j2][i4] = 1;
				}
			}
		}

		return {
			matrix: matrix,
			reserved: reserved
		};
	};

	var putdata = function putdata(matrix, reserved, buf) {
		var n = matrix[length];
		var k = 0,
			dir = -1;

		for (var i = n - 1; i >= 0; i -= 2) {
			if (i === 6) {
				--i;
			}

			var jj = dir < 0 ? n - 1 : 0;

			for (var j = 0; j < n; ++j) {
				for (var ii = i; ii > i - 2; --ii) {
					if (!reserved[jj][ii]) {
						matrix[jj][ii] = (buf[k >> 3] >> (~k & 7)) & 1;
						++k;
					}
				}

				jj += dir;
			}

			dir = -dir;
		}

		return matrix;
	};

	var maskdata = function maskdata(matrix, reserved, mask) {
		var maskf = MASKFUNCS[mask];
		var n = matrix[length];

		for (var i = 0; i < n; ++i) {
			for (var j = 0; j < n; ++j) {
				if (!reserved[i][j]) {
					matrix[i][j] ^= maskf(i, j);
				}
			}
		}

		return matrix;
	};

	var putformatinfo = function putformatinfo(
		matrix,
		reserved,
		ecclevel,
		mask
	) {
		var n = matrix[length];
		var code = augumentbch((ecclevel << 3) | mask, 5, 0x537, 10) ^ 0x5412;

		for (var i = 0; i < 15; ++i) {
			var r = [
				0,
				1,
				2,
				3,
				4,
				5,
				7,
				8,
				n - 7,
				n - 6,
				n - 5,
				n - 4,
				n - 3,
				n - 2,
				n - 1
			][i];
			var c = [
				n - 1,
				n - 2,
				n - 3,
				n - 4,
				n - 5,
				n - 6,
				n - 7,
				n - 8,
				7,
				5,
				4,
				3,
				2,
				1,
				0
			][i];
			matrix[r][8] = matrix[8][c] = (code >> i) & 1;
		}

		return matrix;
	};

	var evaluatematrix = function evaluatematrix(matrix) {
		var PENALTY_CONSECUTIVE = 3;
		var PENALTY_TWOBYTWO = 3;
		var PENALTY_FINDERLIKE = 40;
		var PENALTY_DENSITY = 10;

		var evaluategroup = function evaluategroup(groups) {
			var score = 0;

			for (var i = 0; i < groups[length]; ++i) {
				if (groups[i] >= 5) {
					score += PENALTY_CONSECUTIVE + (groups[i] - 5);
				}
			}

			for (var i2 = 5; i2 < groups[length]; i2 += 2) {
				var p = groups[i2];

				if (
					groups[i2 - 1] === p &&
					groups[i2 - 2] === 3 * p &&
					groups[i2 - 3] === p &&
					groups[i2 - 4] === p &&
					(groups[i2 - 5] >= 4 * p || groups[i2 + 1] >= 4 * p)
				) {
					score += PENALTY_FINDERLIKE;
				}
			}

			return score;
		};

		var n = matrix[length];
		var score = 0,
			nblacks = 0;

		for (var i = 0; i < n; ++i) {
			var row = matrix[i];
			var groups;
			groups = [0];

			for (var j = 0; j < n; ) {
				var k;

				for (k = 0; j < n && row[j]; ++k) {
					++j;
				}

				groups.push(k);

				for (k = 0; j < n && !row[j]; ++k) {
					++j;
				}

				groups.push(k);
			}

			score += evaluategroup(groups);
			groups = [0];

			for (var j2 = 0; j2 < n; ) {
				var k2;

				for (k2 = 0; j2 < n && matrix[j2][i]; ++k2) {
					++j2;
				}

				groups.push(k2);

				for (k2 = 0; j2 < n && !matrix[j2][i]; ++k2) {
					++j2;
				}

				groups.push(k2);
			}

			score += evaluategroup(groups);
			var nextrow = matrix[i + 1] || [];
			nblacks += row[0];

			for (var j3 = 1; j3 < n; ++j3) {
				var p = row[j3];
				nblacks += p;

				if (
					row[j3 - 1] === p &&
					nextrow[j3] === p &&
					nextrow[j3 - 1] === p
				) {
					score += PENALTY_TWOBYTWO;
				}
			}
		}

		score +=
			PENALTY_DENSITY * ((Math.abs(nblacks / n / n - 0.5) / 0.05) | 0);
		return score;
	};

	var _generate = function generate(data, ver, mode, ecclevel, mask) {
		var v = VERSIONS[ver];
		var buf = encode(ver, mode, data, ndatabits(ver, ecclevel) >> 3);
		buf = augumenteccs(buf, v[1][ecclevel], GF256_GENPOLY[v[0][ecclevel]]);
		var result = makebasematrix(ver);
		var matrix = result.matrix,
			reserved = result.reserved;
		putdata(matrix, reserved, buf);

		if (mask < 0) {
			maskdata(matrix, reserved, 0);
			putformatinfo(matrix, reserved, ecclevel, 0);
			var bestmask = 0,
				bestscore = evaluatematrix(matrix);
			maskdata(matrix, reserved, 0);

			for (mask = 1; mask < 8; ++mask) {
				maskdata(matrix, reserved, mask);
				putformatinfo(matrix, reserved, ecclevel, mask);
				var score = evaluatematrix(matrix);

				if (bestscore > score) {
					bestscore = score;
					bestmask = mask;
				}

				maskdata(matrix, reserved, mask);
			}

			mask = bestmask;
		}

		maskdata(matrix, reserved, mask);
		putformatinfo(matrix, reserved, ecclevel, mask);
		return matrix;
	};

	var appendChild = "appendChild";
	var createElement = "createElement";
	var createElementNS = "createElementNS";
	var setAttributeNS = "setAttributeNS";
	var createRange = "createRange";
	var selectNodeContents = "selectNodeContents";
	var createContextualFragment = "createContextualFragment";
	var createDocumentFragment = "createDocumentFragment";
	var createTextNode = "createTextNode";
	var QRCode = {
		generate: function generate(data, settings) {
			var options = settings || {};
			var MODES = {
				numeric: MODE_NUMERIC,
				alphanumeric: MODE_ALPHANUMERIC,
				octet: MODE_OCTET
			};
			var ECCLEVELS = {
				L: ECCLEVEL_L,
				M: ECCLEVEL_M,
				Q: ECCLEVEL_Q,
				H: ECCLEVEL_H
			};
			var ver = options.version || -1;
			var ecclevel = ECCLEVELS[(options.ecclevel || "L").toUpperCase()];
			var mode = options.mode ? MODES[options.mode.toLowerCase()] : -1;
			var mask = "mask" in options ? options.mask : -1;

			if (mode < 0) {
				if (typeof data === "string") {
					if (data.match(NUMERIC_REGEXP)) {
						mode = MODE_NUMERIC;
					} else if (data.match(ALPHANUMERIC_OUT_REGEXP)) {
						mode = MODE_ALPHANUMERIC;
					} else {
						mode = MODE_OCTET;
					}
				} else {
					mode = MODE_OCTET;
				}
			} else if (
				!(
					mode === MODE_NUMERIC ||
					mode === MODE_ALPHANUMERIC ||
					mode === MODE_OCTET
				)
			) {
				throw "invalid or unsupported mode";
			}

			data = validatedata(mode, data);

			if (data === null) {
				throw "invalid data format";
			}

			if (ecclevel < 0 || ecclevel > 3) {
				throw "invalid ECC level";
			}

			if (ver < 0) {
				for (ver = 1; ver <= 40; ++ver) {
					if (data[length] <= getmaxdatalen(ver, mode, ecclevel)) {
						break;
					}
				}

				if (ver > 40) {
					throw "too large data";
				}
			} else if (ver < 1 || ver > 40) {
				throw "invalid version";
			}

			if (mask !== -1 && (mask < 0 || mask > 8)) {
				throw "invalid mask";
			}

			return _generate(data, ver, mode, ecclevel, mask);
		},
		generateHTML: function generateHTML(data, settings) {
			var options = settings || {};
			var fillcolor = options.fillcolor ? options.fillcolor : "#FFFFFF";
			var textcolor = options.textcolor ? options.textcolor : "#000000";
			var matrix = QRCode.generate(data, options);
			var modsize = Math.max(options.modulesize || 5, 0.5);
			var margin = Math.max(
				options.margin !== null ? options.margin : 4,
				0.0
			);
			var e = document[createElement]("div");
			var n = matrix[length];
			var html = [
				'<table border="0" cellspacing="0" cellpadding="0" style="border:' +
					modsize * margin +
					"px solid " +
					fillcolor +
					";background:" +
					fillcolor +
					'">'
			];

			for (var i = 0; i < n; ++i) {
				html.push("<tr>");

				for (var j = 0; j < n; ++j) {
					html.push(
						'<td style="width:' +
							modsize +
							"px;height:" +
							modsize +
							"px" +
							(matrix[i][j] ? ";background:" + textcolor : "") +
							'"></td>'
					);
				}

				html.push("</tr>");
			}

			e.className = "qrcode";
			/* e.innerHTML = html.join("") + "</table>"; */

			var range = document[createRange]();
			range[selectNodeContents](e);
			var frag = range[createContextualFragment](
				html.join("") + "</table>"
			);
			e[appendChild](frag);
			return e;
		},
		generateSVG: function generateSVG(data, settings) {
			var options = settings || {};
			var fillcolor = options.fillcolor ? options.fillcolor : "#FFFFFF";
			var textcolor = options.textcolor ? options.textcolor : "#000000";
			var matrix = QRCode.generate(data, options);
			var n = matrix[length];
			var modsize = Math.max(options.modulesize || 5, 0.5);
			var margin = Math.max(options.margin ? options.margin : 4, 0.0);
			var size = modsize * (n + 2 * margin);
			/* var common = ' class= "fg"' + ' width="' + modsize + '" height="' + modsize + '"/>'; */

			var e = document[createElementNS](
				"http://www.w3.org/2000/svg",
				"svg"
			);
			e[setAttributeNS](null, "viewBox", "0 0 " + size + " " + size);
			e[setAttributeNS](null, "style", "shape-rendering:crispEdges");
			var qrcodeId = "qrcode" + Date.now();
			e[setAttributeNS](null, "id", qrcodeId);
			var frag = document[createDocumentFragment]();
			/* var svg = ['<style scoped>.bg{fill:' + fillcolor + '}.fg{fill:' + textcolor + '}</style>', '<rect class="bg" x="0" y="0"', 'width="' + size + '" height="' + size + '"/>', ]; */

			var style = document[createElementNS](
				"http://www.w3.org/2000/svg",
				"style"
			);
			style[appendChild](
				document[createTextNode](
					"#" +
						qrcodeId +
						" .bg{fill:" +
						fillcolor +
						"}#" +
						qrcodeId +
						" .fg{fill:" +
						textcolor +
						"}"
				)
			);
			/* style[setAttributeNS](null, "scoped", "scoped"); */

			frag[appendChild](style);

			var createRect = function createRect(c, f, x, y, s) {
				var fg =
					document[createElementNS](
						"http://www.w3.org/2000/svg",
						"rect"
					) || "";
				fg[setAttributeNS](null, "class", c);
				fg[setAttributeNS](null, "fill", f);
				fg[setAttributeNS](null, "x", x);
				fg[setAttributeNS](null, "y", y);
				fg[setAttributeNS](null, "width", s);
				fg[setAttributeNS](null, "height", s);
				return fg;
			};

			frag[appendChild](createRect("bg", "none", 0, 0, size));
			var yo = margin * modsize;

			for (var y = 0; y < n; ++y) {
				var xo = margin * modsize;

				for (var x = 0; x < n; ++x) {
					if (matrix[y][x]) {
						/* svg.push('<rect x="' + xo + '" y="' + yo + '"', common); */
						frag[appendChild](
							createRect("fg", "none", xo, yo, modsize)
						);
					}

					xo += modsize;
				}

				yo += modsize;
			}
			/* e.innerHTML = svg.join(""); */

			e[appendChild](frag);
			return e;
		},
		generatePNG: function generatePNG(data, settings) {
			var options = settings || {};
			var fillcolor = options.fillcolor || "#FFFFFF";
			var textcolor = options.textcolor || "#000000";
			var matrix = QRCode.generate(data, options);
			var modsize = Math.max(options.modulesize || 5, 0.5);
			var margin = Math.max(
				options.margin !== null && options.margin !== undefined
					? options.margin
					: 4,
				0.0
			);
			var n = matrix[length];
			var size = modsize * (n + 2 * margin);
			var canvas = document[createElement]("canvas"),
				context;
			canvas.width = canvas.height = size;
			context = canvas.getContext("2d");

			if (!context) {
				throw "canvas support is needed for PNG output";
			}

			context.fillStyle = fillcolor;
			context.fillRect(0, 0, size, size);
			context.fillStyle = textcolor;

			for (var i = 0; i < n; ++i) {
				for (var j = 0; j < n; ++j) {
					if (matrix[i][j]) {
						context.fillRect(
							modsize * (margin + j),
							modsize * (margin + i),
							modsize,
							modsize
						);
					}
				}
			}

			return canvas.toDataURL();
		}
	};
	root.QRCode = QRCode;
})("undefined" !== typeof window ? window : this, document);
/*jshint bitwise: true */

function _typeof(obj) {
	if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
		_typeof = function _typeof(obj) {
			return typeof obj;
		};
	} else {
		_typeof = function _typeof(obj) {
			return obj &&
				typeof Symbol === "function" &&
				obj.constructor === Symbol &&
				obj !== Symbol.prototype
				? "symbol"
				: typeof obj;
		};
	}
	return _typeof(obj);
}

/*jslint browser: true */

/*jslint node: true */

/*global global, ActiveXObject, define, escape, module, pnotify, Proxy, jQuery, require, self, setImmediate, window */

/*!
 * modified jQuery JavaScript Library v3.1.1
 * @see {@link https://jquery.com/}
 *
 * Includes Sizzle.js
 * @see {@link https://sizzlejs.com/}
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * @see {@link https://jquery.org/license}
 *
 * Date: 2016-09-22T22:30Z
 * source: cdn.jsdelivr.net/jquery/3.1.1/jquery.js
 * pass jshint with suppressing comments
 */

/*jshint ignore:start */
(function(global, factory) {
	"use strict";

	if (
		(typeof module === "undefined" ? "undefined" : _typeof(module)) ===
			"object" &&
		_typeof(module.exports) === "object"
	) {
		module.exports = global.document
			? factory(global, true)
			: function(w) {
					if (!w.document) {
						throw new Error(
							"jQuery requires a window with a document"
						);
					}

					return factory(w);
			  };
	} else {
		factory(global);
	}
})("undefined" !== typeof window ? window : this, function(window, noGlobal) {
	"use strict";

	var arr = [];
	var document = window.document;
	var getProto = Object.getPrototypeOf;
	var _slice = arr.slice;
	var concat = arr.concat;
	var push = arr.push;
	var indexOf = arr.indexOf;
	var class2type = {};
	var toString = class2type.toString;
	var hasOwn = class2type.hasOwnProperty;
	var fnToString = hasOwn.toString;
	var ObjectFunctionString = fnToString.call(Object);
	var support = {};

	function DOMEval(code, doc) {
		doc = doc || document;
		var script = doc.createElement("script");
		script.text = code;
		doc.head.appendChild(script).parentNode.removeChild(script);
	}

	var version = "3.1.1",
		jQuery = function jQuery(selector, context) {
			return new jQuery.fn.init(selector, context);
		},
		rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
		rmsPrefix = /^-ms-/,
		rdashAlpha = /-([a-z])/g,
		fcamelCase = function fcamelCase(all, letter) {
			return letter.toUpperCase();
		};

	jQuery.fn = jQuery.prototype = {
		jquery: version,
		constructor: jQuery,
		length: 0,
		toArray: function toArray() {
			return _slice.call(this);
		},
		get: function get(num) {
			if (num == null) {
				return _slice.call(this);
			}

			return num < 0 ? this[num + this.length] : this[num];
		},
		pushStack: function pushStack(elems) {
			var ret = jQuery.merge(this.constructor(), elems);
			ret.prevObject = this;
			return ret;
		},
		each: function each(callback) {
			return jQuery.each(this, callback);
		},
		map: function map(callback) {
			return this.pushStack(
				jQuery.map(this, function(elem, i) {
					return callback.call(elem, i, elem);
				})
			);
		},
		slice: function slice() {
			return this.pushStack(_slice.apply(this, arguments));
		},
		first: function first() {
			return this.eq(0);
		},
		last: function last() {
			return this.eq(-1);
		},
		eq: function eq(i) {
			var len = this.length,
				j = +i + (i < 0 ? len : 0);
			return this.pushStack(j >= 0 && j < len ? [this[j]] : []);
		},
		end: function end() {
			return this.prevObject || this.constructor();
		},
		push: push,
		sort: arr.sort,
		splice: arr.splice
	};

	jQuery.extend = jQuery.fn.extend = function() {
		var options,
			name,
			src,
			copy,
			copyIsArray,
			clone,
			target = arguments[0] || {},
			i = 1,
			length = arguments.length,
			deep = false;

		if (typeof target === "boolean") {
			deep = target;
			target = arguments[i] || {};
			i++;
		}

		if (_typeof(target) !== "object" && !jQuery.isFunction(target)) {
			target = {};
		}

		if (i === length) {
			target = this;
			i--;
		}

		for (; i < length; i++) {
			if ((options = arguments[i]) != null) {
				for (name in options) {
					src = target[name];
					copy = options[name];

					if (target === copy) {
						continue;
					}

					if (
						deep &&
						copy &&
						(jQuery.isPlainObject(copy) ||
							(copyIsArray = jQuery.isArray(copy)))
					) {
						if (copyIsArray) {
							copyIsArray = false;
							clone = src && jQuery.isArray(src) ? src : [];
						} else {
							clone = src && jQuery.isPlainObject(src) ? src : {};
						}

						target[name] = jQuery.extend(deep, clone, copy);
					} else if (copy !== undefined) {
						target[name] = copy;
					}
				}
			}
		}

		return target;
	};

	jQuery.extend({
		expando: "jQuery" + (version + Math.random()).replace(/\D/g, ""),
		isReady: true,
		error: function error(msg) {
			throw new Error(msg);
		},
		noop: function noop() {},
		isFunction: function isFunction(obj) {
			return jQuery.type(obj) === "function";
		},
		isArray: Array.isArray,
		isWindow: function isWindow(obj) {
			return obj != null && obj === obj.window;
		},
		isNumeric: function isNumeric(obj) {
			var type = jQuery.type(obj);
			return (
				(type === "number" || type === "string") &&
				!isNaN(obj - parseFloat(obj))
			);
		},
		isPlainObject: function isPlainObject(obj) {
			var proto, Ctor;

			if (!obj || toString.call(obj) !== "[object Object]") {
				return false;
			}

			proto = getProto(obj);

			if (!proto) {
				return true;
			}

			Ctor = hasOwn.call(proto, "constructor") && proto.constructor;
			return (
				typeof Ctor === "function" &&
				fnToString.call(Ctor) === ObjectFunctionString
			);
		},
		isEmptyObject: function isEmptyObject(obj) {
			var name;

			for (name in obj) {
				return false;
			}

			return true;
		},
		type: function type(obj) {
			if (obj == null) {
				return obj + "";
			}

			return _typeof(obj) === "object" || typeof obj === "function"
				? class2type[toString.call(obj)] || "object"
				: _typeof(obj);
		},
		globalEval: function globalEval(code) {
			DOMEval(code);
		},
		camelCase: function camelCase(string) {
			return string
				.replace(rmsPrefix, "ms-")
				.replace(rdashAlpha, fcamelCase);
		},
		nodeName: function nodeName(elem, name) {
			return (
				elem.nodeName &&
				elem.nodeName.toLowerCase() === name.toLowerCase()
			);
		},
		each: function each(obj, callback) {
			var length,
				i = 0;

			if (isArrayLike(obj)) {
				length = obj.length;

				for (; i < length; i++) {
					if (callback.call(obj[i], i, obj[i]) === false) {
						break;
					}
				}
			} else {
				for (i in obj) {
					if (callback.call(obj[i], i, obj[i]) === false) {
						break;
					}
				}
			}

			return obj;
		},
		trim: function trim(text) {
			return text == null ? "" : (text + "").replace(rtrim, "");
		},
		makeArray: function makeArray(arr, results) {
			var ret = results || [];

			if (arr != null) {
				if (isArrayLike(Object(arr))) {
					jQuery.merge(ret, typeof arr === "string" ? [arr] : arr);
				} else {
					push.call(ret, arr);
				}
			}

			return ret;
		},
		inArray: function inArray(elem, arr, i) {
			return arr == null ? -1 : indexOf.call(arr, elem, i);
		},
		merge: function merge(first, second) {
			var len = +second.length,
				j = 0,
				i = first.length;

			for (; j < len; j++) {
				first[i++] = second[j];
			}

			first.length = i;
			return first;
		},
		grep: function grep(elems, callback, invert) {
			var callbackInverse,
				matches = [],
				i = 0,
				length = elems.length,
				callbackExpect = !invert;

			for (; i < length; i++) {
				callbackInverse = !callback(elems[i], i);

				if (callbackInverse !== callbackExpect) {
					matches.push(elems[i]);
				}
			}

			return matches;
		},
		map: function map(elems, callback, arg) {
			var length,
				value,
				i = 0,
				ret = [];

			if (isArrayLike(elems)) {
				length = elems.length;

				for (; i < length; i++) {
					value = callback(elems[i], i, arg);

					if (value != null) {
						ret.push(value);
					}
				}
			} else {
				for (i in elems) {
					value = callback(elems[i], i, arg);

					if (value != null) {
						ret.push(value);
					}
				}
			}

			return concat.apply([], ret);
		},
		guid: 1,
		proxy: function proxy(fn, context) {
			var tmp, args, proxy;

			if (typeof context === "string") {
				tmp = fn[context];
				context = fn;
				fn = tmp;
			}

			if (!jQuery.isFunction(fn)) {
				return undefined;
			}

			args = _slice.call(arguments, 2);

			proxy = function proxy() {
				return fn.apply(
					context || this,
					args.concat(_slice.call(arguments))
				);
			};

			proxy.guid = fn.guid = fn.guid || jQuery.guid++;
			return proxy;
		},
		now: Date.now,
		support: support
	});

	if (typeof Symbol === "function") {
		jQuery.fn[Symbol.iterator] = arr[Symbol.iterator];
	}

	jQuery.each(
		"Boolean Number String Function Array Date RegExp Object Error Symbol".split(
			" "
		),
		function(i, name) {
			class2type["[object " + name + "]"] = name.toLowerCase();
		}
	);

	function isArrayLike(obj) {
		var length = !!obj && "length" in obj && obj.length,
			type = jQuery.type(obj);

		if (type === "function" || jQuery.isWindow(obj)) {
			return false;
		}

		return (
			type === "array" ||
			length === 0 ||
			(typeof length === "number" && length > 0 && length - 1 in obj)
		);
	}

	var Sizzle = (function(window) {
		var i,
			support,
			Expr,
			getText,
			isXML,
			tokenize,
			compile,
			select,
			outermostContext,
			sortInput,
			hasDuplicate,
			setDocument,
			document,
			docElem,
			documentIsHTML,
			rbuggyQSA,
			rbuggyMatches,
			matches,
			contains,
			expando = "sizzle" + 1 * new Date(),
			preferredDoc = window.document,
			dirruns = 0,
			done = 0,
			classCache = createCache(),
			tokenCache = createCache(),
			compilerCache = createCache(),
			sortOrder = function sortOrder(a, b) {
				if (a === b) {
					hasDuplicate = true;
				}

				return 0;
			},
			hasOwn = {}.hasOwnProperty,
			arr = [],
			pop = arr.pop,
			push_native = arr.push,
			push = arr.push,
			slice = arr.slice,
			indexOf = function indexOf(list, elem) {
				var i = 0,
					len = list.length;

				for (; i < len; i++) {
					if (list[i] === elem) {
						return i;
					}
				}

				return -1;
			},
			booleans =
				"checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
			whitespace = "[\\x20\\t\\r\\n\\f]",
			identifier = "(?:\\\\.|[\\w-]|[^\0-\\xa0])+",
			attributes =
				"\\[" +
				whitespace +
				"*(" +
				identifier +
				")(?:" +
				whitespace +
				"*([*^$|!~]?=)" +
				whitespace +
				"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" +
				identifier +
				"))|)" +
				whitespace +
				"*\\]",
			pseudos =
				":(" +
				identifier +
				")(?:\\((" +
				"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
				"((?:\\\\.|[^\\\\()[\\]]|" +
				attributes +
				")*)|" +
				".*" +
				")\\)|)",
			rwhitespace = new RegExp(whitespace + "+", "g"),
			rtrim = new RegExp(
				"^" +
					whitespace +
					"+|((?:^|[^\\\\])(?:\\\\.)*)" +
					whitespace +
					"+$",
				"g"
			),
			rcomma = new RegExp("^" + whitespace + "*," + whitespace + "*"),
			rcombinators = new RegExp(
				"^" +
					whitespace +
					"*([>+~]|" +
					whitespace +
					")" +
					whitespace +
					"*"
			),
			rattributeQuotes = new RegExp(
				"=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]",
				"g"
			),
			rpseudo = new RegExp(pseudos),
			ridentifier = new RegExp("^" + identifier + "$"),
			matchExpr = {
				ID: new RegExp("^#(" + identifier + ")"),
				CLASS: new RegExp("^\\.(" + identifier + ")"),
				TAG: new RegExp("^(" + identifier + "|[*])"),
				ATTR: new RegExp("^" + attributes),
				PSEUDO: new RegExp("^" + pseudos),
				CHILD: new RegExp(
					"^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" +
						whitespace +
						"*(even|odd|(([+-]|)(\\d*)n|)" +
						whitespace +
						"*(?:([+-]|)" +
						whitespace +
						"*(\\d+)|))" +
						whitespace +
						"*\\)|)",
					"i"
				),
				bool: new RegExp("^(?:" + booleans + ")$", "i"),
				needsContext: new RegExp(
					"^" +
						whitespace +
						"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
						whitespace +
						"*((?:-\\d)?\\d*)" +
						whitespace +
						"*\\)|)(?=[^-]|$)",
					"i"
				)
			},
			rinputs = /^(?:input|select|textarea|button)$/i,
			rheader = /^h\d$/i,
			rnative = /^[^{]+\{\s*\[native \w/,
			rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
			rsibling = /[+~]/,
			runescape = new RegExp(
				"\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)",
				"ig"
			),
			funescape = function funescape(_, escaped, escapedWhitespace) {
				var high = "0x" + escaped - 0x10000;
				return high !== high || escapedWhitespace
					? escaped
					: high < 0
					? String.fromCharCode(high + 0x10000)
					: String.fromCharCode(
							(high >> 10) | 0xd800,
							(high & 0x3ff) | 0xdc00
					  );
			},
			rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,
			fcssescape = function fcssescape(ch, asCodePoint) {
				if (asCodePoint) {
					if (ch === "\0") {
						return "\uFFFD";
					}

					return (
						ch.slice(0, -1) +
						"\\" +
						ch.charCodeAt(ch.length - 1).toString(16) +
						" "
					);
				}

				return "\\" + ch;
			},
			unloadHandler = function unloadHandler() {
				setDocument();
			},
			disabledAncestor = addCombinator(
				function(elem) {
					return (
						elem.disabled === true &&
						("form" in elem || "label" in elem)
					);
				},
				{
					dir: "parentNode",
					next: "legend"
				}
			);

		try {
			push.apply(
				(arr = slice.call(preferredDoc.childNodes)),
				preferredDoc.childNodes
			);
			arr[preferredDoc.childNodes.length].nodeType;
		} catch (e) {
			push = {
				apply: arr.length
					? function(target, els) {
							push_native.apply(target, slice.call(els));
					  }
					: function(target, els) {
							var j = target.length,
								i = 0;

							while ((target[j++] = els[i++])) {}

							target.length = j - 1;
					  }
			};
		}

		function Sizzle(selector, context, results, seed) {
			var m,
				i,
				elem,
				nid,
				match,
				groups,
				newSelector,
				newContext = context && context.ownerDocument,
				nodeType = context ? context.nodeType : 9;
			results = results || [];

			if (
				typeof selector !== "string" ||
				!selector ||
				(nodeType !== 1 && nodeType !== 9 && nodeType !== 11)
			) {
				return results;
			}

			if (!seed) {
				if (
					(context
						? context.ownerDocument || context
						: preferredDoc) !== document
				) {
					setDocument(context);
				}

				context = context || document;

				if (documentIsHTML) {
					if (
						nodeType !== 11 &&
						(match = rquickExpr.exec(selector))
					) {
						if ((m = match[1])) {
							if (nodeType === 9) {
								if ((elem = context.getElementById(m))) {
									if (elem.id === m) {
										results.push(elem);
										return results;
									}
								} else {
									return results;
								}
							} else {
								if (
									newContext &&
									(elem = newContext.getElementById(m)) &&
									contains(context, elem) &&
									elem.id === m
								) {
									results.push(elem);
									return results;
								}
							}
						} else if (match[2]) {
							push.apply(
								results,
								context.getElementsByTagName(selector)
							);
							return results;
						} else if (
							(m = match[3]) &&
							support.getElementsByClassName &&
							context.getElementsByClassName
						) {
							push.apply(
								results,
								context.getElementsByClassName(m)
							);
							return results;
						}
					}

					if (
						support.qsa &&
						!compilerCache[selector + " "] &&
						(!rbuggyQSA || !rbuggyQSA.test(selector))
					) {
						if (nodeType !== 1) {
							newContext = context;
							newSelector = selector;
						} else if (
							context.nodeName.toLowerCase() !== "object"
						) {
							if ((nid = context.getAttribute("id"))) {
								nid = nid.replace(rcssescape, fcssescape);
							} else {
								context.setAttribute("id", (nid = expando));
							}

							groups = tokenize(selector);
							i = groups.length;

							while (i--) {
								groups[i] =
									"#" + nid + " " + toSelector(groups[i]);
							}

							newSelector = groups.join(",");
							newContext =
								(rsibling.test(selector) &&
									testContext(context.parentNode)) ||
								context;
						}

						if (newSelector) {
							try {
								push.apply(
									results,
									newContext.querySelectorAll(newSelector)
								);
								return results;
							} catch (qsaError) {
							} finally {
								if (nid === expando) {
									context.removeAttribute("id");
								}
							}
						}
					}
				}
			}

			return select(
				selector.replace(rtrim, "$1"),
				context,
				results,
				seed
			);
		}

		function createCache() {
			var keys = [];

			function cache(key, value) {
				if (keys.push(key + " ") > Expr.cacheLength) {
					delete cache[keys.shift()];
				}

				return (cache[key + " "] = value);
			}

			return cache;
		}

		function markFunction(fn) {
			fn[expando] = true;
			return fn;
		}

		function assert(fn) {
			var el = document.createElement("fieldset");

			try {
				return !!fn(el);
			} catch (e) {
				return false;
			} finally {
				if (el.parentNode) {
					el.parentNode.removeChild(el);
				}

				el = null;
			}
		}

		function addHandle(attrs, handler) {
			var arr = attrs.split("|"),
				i = arr.length;

			while (i--) {
				Expr.attrHandle[arr[i]] = handler;
			}
		}

		function siblingCheck(a, b) {
			var cur = b && a,
				diff =
					cur &&
					a.nodeType === 1 &&
					b.nodeType === 1 &&
					a.sourceIndex - b.sourceIndex;

			if (diff) {
				return diff;
			}

			if (cur) {
				while ((cur = cur.nextSibling)) {
					if (cur === b) {
						return -1;
					}
				}
			}

			return a ? 1 : -1;
		}

		function createInputPseudo(type) {
			return function(elem) {
				var name = elem.nodeName.toLowerCase();
				return name === "input" && elem.type === type;
			};
		}

		function createButtonPseudo(type) {
			return function(elem) {
				var name = elem.nodeName.toLowerCase();
				return (
					(name === "input" || name === "button") &&
					elem.type === type
				);
			};
		}

		function createDisabledPseudo(disabled) {
			return function(elem) {
				if ("form" in elem) {
					if (elem.parentNode && elem.disabled === false) {
						if ("label" in elem) {
							if ("label" in elem.parentNode) {
								return elem.parentNode.disabled === disabled;
							} else {
								return elem.disabled === disabled;
							}
						}

						return (
							elem.isDisabled === disabled ||
							(elem.isDisabled !== !disabled &&
								disabledAncestor(elem) === disabled)
						);
					}

					return elem.disabled === disabled;
				} else if ("label" in elem) {
					return elem.disabled === disabled;
				}

				return false;
			};
		}

		function createPositionalPseudo(fn) {
			return markFunction(function(argument) {
				argument = +argument;
				return markFunction(function(seed, matches) {
					var j,
						matchIndexes = fn([], seed.length, argument),
						i = matchIndexes.length;

					while (i--) {
						if (seed[(j = matchIndexes[i])]) {
							seed[j] = !(matches[j] = seed[j]);
						}
					}
				});
			});
		}

		function testContext(context) {
			return (
				context &&
				typeof context.getElementsByTagName !== "undefined" &&
				context
			);
		}

		support = Sizzle.support = {};

		isXML = Sizzle.isXML = function(elem) {
			var documentElement =
				elem && (elem.ownerDocument || elem).documentElement;
			return documentElement
				? documentElement.nodeName !== "HTML"
				: false;
		};

		setDocument = Sizzle.setDocument = function(node) {
			var hasCompare,
				subWindow,
				doc = node ? node.ownerDocument || node : preferredDoc;

			if (
				doc === document ||
				doc.nodeType !== 9 ||
				!doc.documentElement
			) {
				return document;
			}

			document = doc;
			docElem = document.documentElement;
			documentIsHTML = !isXML(document);

			if (
				preferredDoc !== document &&
				(subWindow = document.defaultView) &&
				subWindow.top !== subWindow
			) {
				if (subWindow.addEventListener) {
					subWindow.addEventListener("unload", unloadHandler, false);
				} else if (subWindow.attachEvent) {
					subWindow.attachEvent("onunload", unloadHandler);
				}
			}

			support.attributes = assert(function(el) {
				el.className = "i";
				return !el.getAttribute("className");
			});
			support.getElementsByTagName = assert(function(el) {
				el.appendChild(document.createComment(""));
				return !el.getElementsByTagName("*").length;
			});
			support.getElementsByClassName = rnative.test(
				document.getElementsByClassName
			);
			support.getById = assert(function(el) {
				docElem.appendChild(el).id = expando;
				return (
					!document.getElementsByName ||
					!document.getElementsByName(expando).length
				);
			});

			if (support.getById) {
				Expr.filter["ID"] = function(id) {
					var attrId = id.replace(runescape, funescape);
					return function(elem) {
						return elem.getAttribute("id") === attrId;
					};
				};

				Expr.find["ID"] = function(id, context) {
					if (
						typeof context.getElementById !== "undefined" &&
						documentIsHTML
					) {
						var elem = context.getElementById(id);
						return elem ? [elem] : [];
					}
				};
			} else {
				Expr.filter["ID"] = function(id) {
					var attrId = id.replace(runescape, funescape);
					return function(elem) {
						var node =
							typeof elem.getAttributeNode !== "undefined" &&
							elem.getAttributeNode("id");
						return node && node.value === attrId;
					};
				};

				Expr.find["ID"] = function(id, context) {
					if (
						typeof context.getElementById !== "undefined" &&
						documentIsHTML
					) {
						var node,
							i,
							elems,
							elem = context.getElementById(id);

						if (elem) {
							node = elem.getAttributeNode("id");

							if (node && node.value === id) {
								return [elem];
							}

							elems = context.getElementsByName(id);
							i = 0;

							while ((elem = elems[i++])) {
								node = elem.getAttributeNode("id");

								if (node && node.value === id) {
									return [elem];
								}
							}
						}

						return [];
					}
				};
			}

			Expr.find["TAG"] = support.getElementsByTagName
				? function(tag, context) {
						if (
							typeof context.getElementsByTagName !== "undefined"
						) {
							return context.getElementsByTagName(tag);
						} else if (support.qsa) {
							return context.querySelectorAll(tag);
						}
				  }
				: function(tag, context) {
						var elem,
							tmp = [],
							i = 0,
							results = context.getElementsByTagName(tag);

						if (tag === "*") {
							while ((elem = results[i++])) {
								if (elem.nodeType === 1) {
									tmp.push(elem);
								}
							}

							return tmp;
						}

						return results;
				  };

			Expr.find["CLASS"] =
				support.getElementsByClassName &&
				function(className, context) {
					if (
						typeof context.getElementsByClassName !== "undefined" &&
						documentIsHTML
					) {
						return context.getElementsByClassName(className);
					}
				};

			rbuggyMatches = [];
			rbuggyQSA = [];

			if ((support.qsa = rnative.test(document.querySelectorAll))) {
				assert(function(el) {
					docElem.appendChild(el).innerHTML =
						"<a id='" +
						expando +
						"'></a>" +
						"<select id='" +
						expando +
						"-\r\\' msallowcapture=''>" +
						"<option selected=''></option></select>";

					if (el.querySelectorAll("[msallowcapture^='']").length) {
						rbuggyQSA.push("[*^$]=" + whitespace + "*(?:''|\"\")");
					}

					if (!el.querySelectorAll("[selected]").length) {
						rbuggyQSA.push(
							"\\[" + whitespace + "*(?:value|" + booleans + ")"
						);
					}

					if (!el.querySelectorAll("[id~=" + expando + "-]").length) {
						rbuggyQSA.push("~=");
					}

					if (!el.querySelectorAll(":checked").length) {
						rbuggyQSA.push(":checked");
					}

					if (!el.querySelectorAll("a#" + expando + "+*").length) {
						rbuggyQSA.push(".#.+[+~]");
					}
				});
				assert(function(el) {
					el.innerHTML =
						"<a href='' disabled='disabled'></a>" +
						"<select disabled='disabled'><option/></select>";
					var input = document.createElement("input");
					input.setAttribute("type", "hidden");
					el.appendChild(input).setAttribute("name", "D");

					if (el.querySelectorAll("[name=d]").length) {
						rbuggyQSA.push("name" + whitespace + "*[*^$|!~]?=");
					}

					if (el.querySelectorAll(":enabled").length !== 2) {
						rbuggyQSA.push(":enabled", ":disabled");
					}

					docElem.appendChild(el).disabled = true;

					if (el.querySelectorAll(":disabled").length !== 2) {
						rbuggyQSA.push(":enabled", ":disabled");
					}

					el.querySelectorAll("*,:x");
					rbuggyQSA.push(",.*:");
				});
			}

			if (
				(support.matchesSelector = rnative.test(
					(matches =
						docElem.matches ||
						docElem.webkitMatchesSelector ||
						docElem.mozMatchesSelector ||
						docElem.oMatchesSelector ||
						docElem.msMatchesSelector)
				))
			) {
				assert(function(el) {
					support.disconnectedMatch = matches.call(el, "*");
					matches.call(el, "[s!='']:x");
					rbuggyMatches.push("!=", pseudos);
				});
			}

			rbuggyQSA = rbuggyQSA.length && new RegExp(rbuggyQSA.join("|"));
			rbuggyMatches =
				rbuggyMatches.length && new RegExp(rbuggyMatches.join("|"));
			hasCompare = rnative.test(docElem.compareDocumentPosition);
			contains =
				hasCompare || rnative.test(docElem.contains)
					? function(a, b) {
							var adown =
									a.nodeType === 9 ? a.documentElement : a,
								bup = b && b.parentNode;
							return (
								a === bup ||
								!!(
									bup &&
									bup.nodeType === 1 &&
									(adown.contains
										? adown.contains(bup)
										: a.compareDocumentPosition &&
										  a.compareDocumentPosition(bup) & 16)
								)
							);
					  }
					: function(a, b) {
							if (b) {
								while ((b = b.parentNode)) {
									if (b === a) {
										return true;
									}
								}
							}

							return false;
					  };
			sortOrder = hasCompare
				? function(a, b) {
						if (a === b) {
							hasDuplicate = true;
							return 0;
						}

						var compare =
							!a.compareDocumentPosition -
							!b.compareDocumentPosition;

						if (compare) {
							return compare;
						}

						compare =
							(a.ownerDocument || a) === (b.ownerDocument || b)
								? a.compareDocumentPosition(b)
								: 1;

						if (
							compare & 1 ||
							(!support.sortDetached &&
								b.compareDocumentPosition(a) === compare)
						) {
							if (
								a === document ||
								(a.ownerDocument === preferredDoc &&
									contains(preferredDoc, a))
							) {
								return -1;
							}

							if (
								b === document ||
								(b.ownerDocument === preferredDoc &&
									contains(preferredDoc, b))
							) {
								return 1;
							}

							return sortInput
								? indexOf(sortInput, a) - indexOf(sortInput, b)
								: 0;
						}

						return compare & 4 ? -1 : 1;
				  }
				: function(a, b) {
						if (a === b) {
							hasDuplicate = true;
							return 0;
						}

						var cur,
							i = 0,
							aup = a.parentNode,
							bup = b.parentNode,
							ap = [a],
							bp = [b];

						if (!aup || !bup) {
							return a === document
								? -1
								: b === document
								? 1
								: aup
								? -1
								: bup
								? 1
								: sortInput
								? indexOf(sortInput, a) - indexOf(sortInput, b)
								: 0;
						} else if (aup === bup) {
							return siblingCheck(a, b);
						}

						cur = a;

						while ((cur = cur.parentNode)) {
							ap.unshift(cur);
						}

						cur = b;

						while ((cur = cur.parentNode)) {
							bp.unshift(cur);
						}

						while (ap[i] === bp[i]) {
							i++;
						}

						return i
							? siblingCheck(ap[i], bp[i])
							: ap[i] === preferredDoc
							? -1
							: bp[i] === preferredDoc
							? 1
							: 0;
				  };
			return document;
		};

		Sizzle.matches = function(expr, elements) {
			return Sizzle(expr, null, null, elements);
		};

		Sizzle.matchesSelector = function(elem, expr) {
			if ((elem.ownerDocument || elem) !== document) {
				setDocument(elem);
			}

			expr = expr.replace(rattributeQuotes, "='$1']");

			if (
				support.matchesSelector &&
				documentIsHTML &&
				!compilerCache[expr + " "] &&
				(!rbuggyMatches || !rbuggyMatches.test(expr)) &&
				(!rbuggyQSA || !rbuggyQSA.test(expr))
			) {
				try {
					var ret = matches.call(elem, expr);

					if (
						ret ||
						support.disconnectedMatch ||
						(elem.document && elem.document.nodeType !== 11)
					) {
						return ret;
					}
				} catch (e) {}
			}

			return Sizzle(expr, document, null, [elem]).length > 0;
		};

		Sizzle.contains = function(context, elem) {
			if ((context.ownerDocument || context) !== document) {
				setDocument(context);
			}

			return contains(context, elem);
		};

		Sizzle.attr = function(elem, name) {
			if ((elem.ownerDocument || elem) !== document) {
				setDocument(elem);
			}

			var fn = Expr.attrHandle[name.toLowerCase()],
				val =
					fn && hasOwn.call(Expr.attrHandle, name.toLowerCase())
						? fn(elem, name, !documentIsHTML)
						: undefined;
			return val !== undefined
				? val
				: support.attributes || !documentIsHTML
				? elem.getAttribute(name)
				: (val = elem.getAttributeNode(name)) && val.specified
				? val.value
				: null;
		};

		Sizzle.escape = function(sel) {
			return (sel + "").replace(rcssescape, fcssescape);
		};

		Sizzle.error = function(msg) {
			throw new Error("Syntax error, unrecognized expression: " + msg);
		};

		Sizzle.uniqueSort = function(results) {
			var elem,
				duplicates = [],
				j = 0,
				i = 0;
			hasDuplicate = !support.detectDuplicates;
			sortInput = !support.sortStable && results.slice(0);
			results.sort(sortOrder);

			if (hasDuplicate) {
				while ((elem = results[i++])) {
					if (elem === results[i]) {
						j = duplicates.push(i);
					}
				}

				while (j--) {
					results.splice(duplicates[j], 1);
				}
			}

			sortInput = null;
			return results;
		};

		getText = Sizzle.getText = function(elem) {
			var node,
				ret = "",
				i = 0,
				nodeType = elem.nodeType;

			if (!nodeType) {
				while ((node = elem[i++])) {
					ret += getText(node);
				}
			} else if (nodeType === 1 || nodeType === 9 || nodeType === 11) {
				if (typeof elem.textContent === "string") {
					return elem.textContent;
				} else {
					for (
						elem = elem.firstChild;
						elem;
						elem = elem.nextSibling
					) {
						ret += getText(elem);
					}
				}
			} else if (nodeType === 3 || nodeType === 4) {
				return elem.nodeValue;
			}

			return ret;
		};

		Expr = Sizzle.selectors = {
			cacheLength: 50,
			createPseudo: markFunction,
			match: matchExpr,
			attrHandle: {},
			find: {},
			relative: {
				">": {
					dir: "parentNode",
					first: true
				},
				" ": {
					dir: "parentNode"
				},
				"+": {
					dir: "previousSibling",
					first: true
				},
				"~": {
					dir: "previousSibling"
				}
			},
			preFilter: {
				ATTR: function ATTR(match) {
					match[1] = match[1].replace(runescape, funescape);
					match[3] = (match[3] || match[4] || match[5] || "").replace(
						runescape,
						funescape
					);

					if (match[2] === "~=") {
						match[3] = " " + match[3] + " ";
					}

					return match.slice(0, 4);
				},
				CHILD: function CHILD(match) {
					match[1] = match[1].toLowerCase();

					if (match[1].slice(0, 3) === "nth") {
						if (!match[3]) {
							Sizzle.error(match[0]);
						}

						match[4] = +(match[4]
							? match[5] + (match[6] || 1)
							: 2 * (match[3] === "even" || match[3] === "odd"));
						match[5] = +(match[7] + match[8] || match[3] === "odd");
					} else if (match[3]) {
						Sizzle.error(match[0]);
					}

					return match;
				},
				PSEUDO: function PSEUDO(match) {
					var excess,
						unquoted = !match[6] && match[2];

					if (matchExpr["CHILD"].test(match[0])) {
						return null;
					}

					if (match[3]) {
						match[2] = match[4] || match[5] || "";
					} else if (
						unquoted &&
						rpseudo.test(unquoted) &&
						(excess = tokenize(unquoted, true)) &&
						(excess =
							unquoted.indexOf(")", unquoted.length - excess) -
							unquoted.length)
					) {
						match[0] = match[0].slice(0, excess);
						match[2] = unquoted.slice(0, excess);
					}

					return match.slice(0, 3);
				}
			},
			filter: {
				TAG: function TAG(nodeNameSelector) {
					var nodeName = nodeNameSelector
						.replace(runescape, funescape)
						.toLowerCase();
					return nodeNameSelector === "*"
						? function() {
								return true;
						  }
						: function(elem) {
								return (
									elem.nodeName &&
									elem.nodeName.toLowerCase() === nodeName
								);
						  };
				},
				CLASS: function CLASS(className) {
					var pattern = classCache[className + " "];
					return (
						pattern ||
						((pattern = new RegExp(
							"(^|" +
								whitespace +
								")" +
								className +
								"(" +
								whitespace +
								"|$)"
						)) &&
							classCache(className, function(elem) {
								return pattern.test(
									(typeof elem.className === "string" &&
										elem.className) ||
										(typeof elem.getAttribute !==
											"undefined" &&
											elem.getAttribute("class")) ||
										""
								);
							}))
					);
				},
				ATTR: function ATTR(name, operator, check) {
					return function(elem) {
						var result = Sizzle.attr(elem, name);

						if (result == null) {
							return operator === "!=";
						}

						if (!operator) {
							return true;
						}

						result += "";
						return operator === "="
							? result === check
							: operator === "!="
							? result !== check
							: operator === "^="
							? check && result.indexOf(check) === 0
							: operator === "*="
							? check && result.indexOf(check) > -1
							: operator === "$="
							? check && result.slice(-check.length) === check
							: operator === "~="
							? (
									" " +
									result.replace(rwhitespace, " ") +
									" "
							  ).indexOf(check) > -1
							: operator === "|="
							? result === check ||
							  result.slice(0, check.length + 1) === check + "-"
							: false;
					};
				},
				CHILD: function CHILD(type, what, argument, first, last) {
					var simple = type.slice(0, 3) !== "nth",
						forward = type.slice(-4) !== "last",
						ofType = what === "of-type";
					return first === 1 && last === 0
						? function(elem) {
								return !!elem.parentNode;
						  }
						: function(elem, context, xml) {
								var cache,
									uniqueCache,
									outerCache,
									node,
									nodeIndex,
									start,
									dir =
										simple !== forward
											? "nextSibling"
											: "previousSibling",
									parent = elem.parentNode,
									name =
										ofType && elem.nodeName.toLowerCase(),
									useCache = !xml && !ofType,
									diff = false;

								if (parent) {
									if (simple) {
										while (dir) {
											node = elem;

											while ((node = node[dir])) {
												if (
													ofType
														? node.nodeName.toLowerCase() ===
														  name
														: node.nodeType === 1
												) {
													return false;
												}
											}

											start = dir =
												type === "only" &&
												!start &&
												"nextSibling";
										}

										return true;
									}

									start = [
										forward
											? parent.firstChild
											: parent.lastChild
									];

									if (forward && useCache) {
										node = parent;
										outerCache =
											node[expando] ||
											(node[expando] = {});
										uniqueCache =
											outerCache[node.uniqueID] ||
											(outerCache[node.uniqueID] = {});
										cache = uniqueCache[type] || [];
										nodeIndex =
											cache[0] === dirruns && cache[1];
										diff = nodeIndex && cache[2];
										node =
											nodeIndex &&
											parent.childNodes[nodeIndex];

										while (
											(node =
												(++nodeIndex &&
													node &&
													node[dir]) ||
												(diff = nodeIndex = 0) ||
												start.pop())
										) {
											if (
												node.nodeType === 1 &&
												++diff &&
												node === elem
											) {
												uniqueCache[type] = [
													dirruns,
													nodeIndex,
													diff
												];
												break;
											}
										}
									} else {
										if (useCache) {
											node = elem;
											outerCache =
												node[expando] ||
												(node[expando] = {});
											uniqueCache =
												outerCache[node.uniqueID] ||
												(outerCache[
													node.uniqueID
												] = {});
											cache = uniqueCache[type] || [];
											nodeIndex =
												cache[0] === dirruns &&
												cache[1];
											diff = nodeIndex;
										}

										if (diff === false) {
											while (
												(node =
													(++nodeIndex &&
														node &&
														node[dir]) ||
													(diff = nodeIndex = 0) ||
													start.pop())
											) {
												if (
													(ofType
														? node.nodeName.toLowerCase() ===
														  name
														: node.nodeType ===
														  1) &&
													++diff
												) {
													if (useCache) {
														outerCache =
															node[expando] ||
															(node[
																expando
															] = {});
														uniqueCache =
															outerCache[
																node.uniqueID
															] ||
															(outerCache[
																node.uniqueID
															] = {});
														uniqueCache[type] = [
															dirruns,
															diff
														];
													}

													if (node === elem) {
														break;
													}
												}
											}
										}
									}

									diff -= last;
									return (
										diff === first ||
										(diff % first === 0 &&
											diff / first >= 0)
									);
								}
						  };
				},
				PSEUDO: function PSEUDO(pseudo, argument) {
					var args,
						fn =
							Expr.pseudos[pseudo] ||
							Expr.setFilters[pseudo.toLowerCase()] ||
							Sizzle.error("unsupported pseudo: " + pseudo);

					if (fn[expando]) {
						return fn(argument);
					}

					if (fn.length > 1) {
						args = [pseudo, pseudo, "", argument];
						return Expr.setFilters.hasOwnProperty(
							pseudo.toLowerCase()
						)
							? markFunction(function(seed, matches) {
									var idx,
										matched = fn(seed, argument),
										i = matched.length;

									while (i--) {
										idx = indexOf(seed, matched[i]);
										seed[idx] = !(matches[idx] =
											matched[i]);
									}
							  })
							: function(elem) {
									return fn(elem, 0, args);
							  };
					}

					return fn;
				}
			},
			pseudos: {
				not: markFunction(function(selector) {
					var input = [],
						results = [],
						matcher = compile(selector.replace(rtrim, "$1"));
					return matcher[expando]
						? markFunction(function(seed, matches, context, xml) {
								var elem,
									unmatched = matcher(seed, null, xml, []),
									i = seed.length;

								while (i--) {
									if ((elem = unmatched[i])) {
										seed[i] = !(matches[i] = elem);
									}
								}
						  })
						: function(elem, context, xml) {
								input[0] = elem;
								matcher(input, null, xml, results);
								input[0] = null;
								return !results.pop();
						  };
				}),
				has: markFunction(function(selector) {
					return function(elem) {
						return Sizzle(selector, elem).length > 0;
					};
				}),
				contains: markFunction(function(text) {
					text = text.replace(runescape, funescape);
					return function(elem) {
						return (
							(
								elem.textContent ||
								elem.innerText ||
								getText(elem)
							).indexOf(text) > -1
						);
					};
				}),
				lang: markFunction(function(lang) {
					if (!ridentifier.test(lang || "")) {
						Sizzle.error("unsupported lang: " + lang);
					}

					lang = lang.replace(runescape, funescape).toLowerCase();
					return function(elem) {
						var elemLang;

						do {
							if (
								(elemLang = documentIsHTML
									? elem.lang
									: elem.getAttribute("xml:lang") ||
									  elem.getAttribute("lang"))
							) {
								elemLang = elemLang.toLowerCase();
								return (
									elemLang === lang ||
									elemLang.indexOf(lang + "-") === 0
								);
							}
						} while ((elem = elem.parentNode) && elem.nodeType === 1);

						return false;
					};
				}),
				target: function target(elem) {
					var hash = window.location && window.location.hash;
					return hash && hash.slice(1) === elem.id;
				},
				root: function root(elem) {
					return elem === docElem;
				},
				focus: function focus(elem) {
					return (
						elem === document.activeElement &&
						(!document.hasFocus || document.hasFocus()) &&
						!!(elem.type || elem.href || ~elem.tabIndex)
					);
				},
				enabled: createDisabledPseudo(false),
				disabled: createDisabledPseudo(true),
				checked: function checked(elem) {
					var nodeName = elem.nodeName.toLowerCase();
					return (
						(nodeName === "input" && !!elem.checked) ||
						(nodeName === "option" && !!elem.selected)
					);
				},
				selected: function selected(elem) {
					if (elem.parentNode) {
						elem.parentNode.selectedIndex;
					}

					return elem.selected === true;
				},
				empty: function empty(elem) {
					for (
						elem = elem.firstChild;
						elem;
						elem = elem.nextSibling
					) {
						if (elem.nodeType < 6) {
							return false;
						}
					}

					return true;
				},
				parent: function parent(elem) {
					return !Expr.pseudos["empty"](elem);
				},
				header: function header(elem) {
					return rheader.test(elem.nodeName);
				},
				input: function input(elem) {
					return rinputs.test(elem.nodeName);
				},
				button: function button(elem) {
					var name = elem.nodeName.toLowerCase();
					return (
						(name === "input" && elem.type === "button") ||
						name === "button"
					);
				},
				text: function text(elem) {
					var attr;
					return (
						elem.nodeName.toLowerCase() === "input" &&
						elem.type === "text" &&
						((attr = elem.getAttribute("type")) == null ||
							attr.toLowerCase() === "text")
					);
				},
				first: createPositionalPseudo(function() {
					return [0];
				}),
				last: createPositionalPseudo(function(matchIndexes, length) {
					return [length - 1];
				}),
				eq: createPositionalPseudo(function(
					matchIndexes,
					length,
					argument
				) {
					return [argument < 0 ? argument + length : argument];
				}),
				even: createPositionalPseudo(function(matchIndexes, length) {
					var i = 0;

					for (; i < length; i += 2) {
						matchIndexes.push(i);
					}

					return matchIndexes;
				}),
				odd: createPositionalPseudo(function(matchIndexes, length) {
					var i = 1;

					for (; i < length; i += 2) {
						matchIndexes.push(i);
					}

					return matchIndexes;
				}),
				lt: createPositionalPseudo(function(
					matchIndexes,
					length,
					argument
				) {
					var i = argument < 0 ? argument + length : argument;

					for (; --i >= 0; ) {
						matchIndexes.push(i);
					}

					return matchIndexes;
				}),
				gt: createPositionalPseudo(function(
					matchIndexes,
					length,
					argument
				) {
					var i = argument < 0 ? argument + length : argument;

					for (; ++i < length; ) {
						matchIndexes.push(i);
					}

					return matchIndexes;
				})
			}
		};
		Expr.pseudos["nth"] = Expr.pseudos["eq"];

		for (i in {
			radio: true,
			checkbox: true,
			file: true,
			password: true,
			image: true
		}) {
			Expr.pseudos[i] = createInputPseudo(i);
		}

		for (i in {
			submit: true,
			reset: true
		}) {
			Expr.pseudos[i] = createButtonPseudo(i);
		}

		function setFilters() {}

		setFilters.prototype = Expr.filters = Expr.pseudos;
		Expr.setFilters = new setFilters();

		tokenize = Sizzle.tokenize = function(selector, parseOnly) {
			var matched,
				match,
				tokens,
				type,
				soFar,
				groups,
				preFilters,
				cached = tokenCache[selector + " "];

			if (cached) {
				return parseOnly ? 0 : cached.slice(0);
			}

			soFar = selector;
			groups = [];
			preFilters = Expr.preFilter;

			while (soFar) {
				if (!matched || (match = rcomma.exec(soFar))) {
					if (match) {
						soFar = soFar.slice(match[0].length) || soFar;
					}

					groups.push((tokens = []));
				}

				matched = false;

				if ((match = rcombinators.exec(soFar))) {
					matched = match.shift();
					tokens.push({
						value: matched,
						type: match[0].replace(rtrim, " ")
					});
					soFar = soFar.slice(matched.length);
				}

				for (type in Expr.filter) {
					if (
						(match = matchExpr[type].exec(soFar)) &&
						(!preFilters[type] || (match = preFilters[type](match)))
					) {
						matched = match.shift();
						tokens.push({
							value: matched,
							type: type,
							matches: match
						});
						soFar = soFar.slice(matched.length);
					}
				}

				if (!matched) {
					break;
				}
			}

			return parseOnly
				? soFar.length
				: soFar
				? Sizzle.error(selector)
				: tokenCache(selector, groups).slice(0);
		};

		function toSelector(tokens) {
			var i = 0,
				len = tokens.length,
				selector = "";

			for (; i < len; i++) {
				selector += tokens[i].value;
			}

			return selector;
		}

		function addCombinator(matcher, combinator, base) {
			var dir = combinator.dir,
				skip = combinator.next,
				key = skip || dir,
				checkNonElements = base && key === "parentNode",
				doneName = done++;
			return combinator.first
				? function(elem, context, xml) {
						while ((elem = elem[dir])) {
							if (elem.nodeType === 1 || checkNonElements) {
								return matcher(elem, context, xml);
							}
						}

						return false;
				  }
				: function(elem, context, xml) {
						var oldCache,
							uniqueCache,
							outerCache,
							newCache = [dirruns, doneName];

						if (xml) {
							while ((elem = elem[dir])) {
								if (elem.nodeType === 1 || checkNonElements) {
									if (matcher(elem, context, xml)) {
										return true;
									}
								}
							}
						} else {
							while ((elem = elem[dir])) {
								if (elem.nodeType === 1 || checkNonElements) {
									outerCache =
										elem[expando] || (elem[expando] = {});
									uniqueCache =
										outerCache[elem.uniqueID] ||
										(outerCache[elem.uniqueID] = {});

									if (
										skip &&
										skip === elem.nodeName.toLowerCase()
									) {
										elem = elem[dir] || elem;
									} else if (
										(oldCache = uniqueCache[key]) &&
										oldCache[0] === dirruns &&
										oldCache[1] === doneName
									) {
										return (newCache[2] = oldCache[2]);
									} else {
										uniqueCache[key] = newCache;

										if (
											(newCache[2] = matcher(
												elem,
												context,
												xml
											))
										) {
											return true;
										}
									}
								}
							}
						}

						return false;
				  };
		}

		function elementMatcher(matchers) {
			return matchers.length > 1
				? function(elem, context, xml) {
						var i = matchers.length;

						while (i--) {
							if (!matchers[i](elem, context, xml)) {
								return false;
							}
						}

						return true;
				  }
				: matchers[0];
		}

		function multipleContexts(selector, contexts, results) {
			var i = 0,
				len = contexts.length;

			for (; i < len; i++) {
				Sizzle(selector, contexts[i], results);
			}

			return results;
		}

		function condense(unmatched, map, filter, context, xml) {
			var elem,
				newUnmatched = [],
				i = 0,
				len = unmatched.length,
				mapped = map != null;

			for (; i < len; i++) {
				if ((elem = unmatched[i])) {
					if (!filter || filter(elem, context, xml)) {
						newUnmatched.push(elem);

						if (mapped) {
							map.push(i);
						}
					}
				}
			}

			return newUnmatched;
		}

		function setMatcher(
			preFilter,
			selector,
			matcher,
			postFilter,
			postFinder,
			postSelector
		) {
			if (postFilter && !postFilter[expando]) {
				postFilter = setMatcher(postFilter);
			}

			if (postFinder && !postFinder[expando]) {
				postFinder = setMatcher(postFinder, postSelector);
			}

			return markFunction(function(seed, results, context, xml) {
				var temp,
					i,
					elem,
					preMap = [],
					postMap = [],
					preexisting = results.length,
					elems =
						seed ||
						multipleContexts(
							selector || "*",
							context.nodeType ? [context] : context,
							[]
						),
					matcherIn =
						preFilter && (seed || !selector)
							? condense(elems, preMap, preFilter, context, xml)
							: elems,
					matcherOut = matcher
						? postFinder ||
						  (seed ? preFilter : preexisting || postFilter)
							? []
							: results
						: matcherIn;

				if (matcher) {
					matcher(matcherIn, matcherOut, context, xml);
				}

				if (postFilter) {
					temp = condense(matcherOut, postMap);
					postFilter(temp, [], context, xml);
					i = temp.length;

					while (i--) {
						if ((elem = temp[i])) {
							matcherOut[postMap[i]] = !(matcherIn[
								postMap[i]
							] = elem);
						}
					}
				}

				if (seed) {
					if (postFinder || preFilter) {
						if (postFinder) {
							temp = [];
							i = matcherOut.length;

							while (i--) {
								if ((elem = matcherOut[i])) {
									temp.push((matcherIn[i] = elem));
								}
							}

							postFinder(null, (matcherOut = []), temp, xml);
						}

						i = matcherOut.length;

						while (i--) {
							if (
								(elem = matcherOut[i]) &&
								(temp = postFinder
									? indexOf(seed, elem)
									: preMap[i]) > -1
							) {
								seed[temp] = !(results[temp] = elem);
							}
						}
					}
				} else {
					matcherOut = condense(
						matcherOut === results
							? matcherOut.splice(preexisting, matcherOut.length)
							: matcherOut
					);

					if (postFinder) {
						postFinder(null, results, matcherOut, xml);
					} else {
						push.apply(results, matcherOut);
					}
				}
			});
		}

		function matcherFromTokens(tokens) {
			var checkContext,
				matcher,
				j,
				len = tokens.length,
				leadingRelative = Expr.relative[tokens[0].type],
				implicitRelative = leadingRelative || Expr.relative[" "],
				i = leadingRelative ? 1 : 0,
				matchContext = addCombinator(
					function(elem) {
						return elem === checkContext;
					},
					implicitRelative,
					true
				),
				matchAnyContext = addCombinator(
					function(elem) {
						return indexOf(checkContext, elem) > -1;
					},
					implicitRelative,
					true
				),
				matchers = [
					function(elem, context, xml) {
						var ret =
							(!leadingRelative &&
								(xml || context !== outermostContext)) ||
							((checkContext = context).nodeType
								? matchContext(elem, context, xml)
								: matchAnyContext(elem, context, xml));
						checkContext = null;
						return ret;
					}
				];

			for (; i < len; i++) {
				if ((matcher = Expr.relative[tokens[i].type])) {
					matchers = [
						addCombinator(elementMatcher(matchers), matcher)
					];
				} else {
					matcher = Expr.filter[tokens[i].type].apply(
						null,
						tokens[i].matches
					);

					if (matcher[expando]) {
						j = ++i;

						for (; j < len; j++) {
							if (Expr.relative[tokens[j].type]) {
								break;
							}
						}

						return setMatcher(
							i > 1 && elementMatcher(matchers),
							i > 1 &&
								toSelector(
									tokens.slice(0, i - 1).concat({
										value:
											tokens[i - 2].type === " "
												? "*"
												: ""
									})
								).replace(rtrim, "$1"),
							matcher,
							i < j && matcherFromTokens(tokens.slice(i, j)),
							j < len &&
								matcherFromTokens((tokens = tokens.slice(j))),
							j < len && toSelector(tokens)
						);
					}

					matchers.push(matcher);
				}
			}

			return elementMatcher(matchers);
		}

		function matcherFromGroupMatchers(elementMatchers, setMatchers) {
			var bySet = setMatchers.length > 0,
				byElement = elementMatchers.length > 0,
				superMatcher = function superMatcher(
					seed,
					context,
					xml,
					results,
					outermost
				) {
					var elem,
						j,
						matcher,
						matchedCount = 0,
						i = "0",
						unmatched = seed && [],
						setMatched = [],
						contextBackup = outermostContext,
						elems =
							seed ||
							(byElement && Expr.find["TAG"]("*", outermost)),
						dirrunsUnique = (dirruns +=
							contextBackup == null ? 1 : Math.random() || 0.1),
						len = elems.length;

					if (outermost) {
						outermostContext =
							context === document || context || outermost;
					}

					for (; i !== len && (elem = elems[i]) != null; i++) {
						if (byElement && elem) {
							j = 0;

							if (!context && elem.ownerDocument !== document) {
								setDocument(elem);
								xml = !documentIsHTML;
							}

							while ((matcher = elementMatchers[j++])) {
								if (matcher(elem, context || document, xml)) {
									results.push(elem);
									break;
								}
							}

							if (outermost) {
								dirruns = dirrunsUnique;
							}
						}

						if (bySet) {
							if ((elem = !matcher && elem)) {
								matchedCount--;
							}

							if (seed) {
								unmatched.push(elem);
							}
						}
					}

					matchedCount += i;

					if (bySet && i !== matchedCount) {
						j = 0;

						while ((matcher = setMatchers[j++])) {
							matcher(unmatched, setMatched, context, xml);
						}

						if (seed) {
							if (matchedCount > 0) {
								while (i--) {
									if (!(unmatched[i] || setMatched[i])) {
										setMatched[i] = pop.call(results);
									}
								}
							}

							setMatched = condense(setMatched);
						}

						push.apply(results, setMatched);

						if (
							outermost &&
							!seed &&
							setMatched.length > 0 &&
							matchedCount + setMatchers.length > 1
						) {
							Sizzle.uniqueSort(results);
						}
					}

					if (outermost) {
						dirruns = dirrunsUnique;
						outermostContext = contextBackup;
					}

					return unmatched;
				};

			return bySet ? markFunction(superMatcher) : superMatcher;
		}

		compile = Sizzle.compile = function(selector, match) {
			var i,
				setMatchers = [],
				elementMatchers = [],
				cached = compilerCache[selector + " "];

			if (!cached) {
				if (!match) {
					match = tokenize(selector);
				}

				i = match.length;

				while (i--) {
					cached = matcherFromTokens(match[i]);

					if (cached[expando]) {
						setMatchers.push(cached);
					} else {
						elementMatchers.push(cached);
					}
				}

				cached = compilerCache(
					selector,
					matcherFromGroupMatchers(elementMatchers, setMatchers)
				);
				cached.selector = selector;
			}

			return cached;
		};

		select = Sizzle.select = function(selector, context, results, seed) {
			var i,
				tokens,
				token,
				type,
				find,
				compiled = typeof selector === "function" && selector,
				match =
					!seed &&
					tokenize((selector = compiled.selector || selector));
			results = results || [];

			if (match.length === 1) {
				tokens = match[0] = match[0].slice(0);

				if (
					tokens.length > 2 &&
					(token = tokens[0]).type === "ID" &&
					context.nodeType === 9 &&
					documentIsHTML &&
					Expr.relative[tokens[1].type]
				) {
					context = (Expr.find["ID"](
						token.matches[0].replace(runescape, funescape),
						context
					) || [])[0];

					if (!context) {
						return results;
					} else if (compiled) {
						context = context.parentNode;
					}

					selector = selector.slice(tokens.shift().value.length);
				}

				i = matchExpr["needsContext"].test(selector)
					? 0
					: tokens.length;

				while (i--) {
					token = tokens[i];

					if (Expr.relative[(type = token.type)]) {
						break;
					}

					if ((find = Expr.find[type])) {
						if (
							(seed = find(
								token.matches[0].replace(runescape, funescape),
								(rsibling.test(tokens[0].type) &&
									testContext(context.parentNode)) ||
									context
							))
						) {
							tokens.splice(i, 1);
							selector = seed.length && toSelector(tokens);

							if (!selector) {
								push.apply(results, seed);
								return results;
							}

							break;
						}
					}
				}
			}

			(compiled || compile(selector, match))(
				seed,
				context,
				!documentIsHTML,
				results,
				!context ||
					(rsibling.test(selector) &&
						testContext(context.parentNode)) ||
					context
			);
			return results;
		};

		support.sortStable =
			expando
				.split("")
				.sort(sortOrder)
				.join("") === expando;
		support.detectDuplicates = !!hasDuplicate;
		setDocument();
		support.sortDetached = assert(function(el) {
			return (
				el.compareDocumentPosition(document.createElement("fieldset")) &
				1
			);
		});

		if (
			!assert(function(el) {
				el.innerHTML = "<a href='#'></a>";
				return el.firstChild.getAttribute("href") === "#";
			})
		) {
			addHandle("type|href|height|width", function(elem, name, isXML) {
				if (!isXML) {
					return elem.getAttribute(
						name,
						name.toLowerCase() === "type" ? 1 : 2
					);
				}
			});
		}

		if (
			!support.attributes ||
			!assert(function(el) {
				el.innerHTML = "<input/>";
				el.firstChild.setAttribute("value", "");
				return el.firstChild.getAttribute("value") === "";
			})
		) {
			addHandle("value", function(elem, name, isXML) {
				if (!isXML && elem.nodeName.toLowerCase() === "input") {
					return elem.defaultValue;
				}
			});
		}

		if (
			!assert(function(el) {
				return el.getAttribute("disabled") == null;
			})
		) {
			addHandle(booleans, function(elem, name, isXML) {
				var val;

				if (!isXML) {
					return elem[name] === true
						? name.toLowerCase()
						: (val = elem.getAttributeNode(name)) && val.specified
						? val.value
						: null;
				}
			});
		}

		return Sizzle;
	})(window);

	jQuery.find = Sizzle;
	jQuery.expr = Sizzle.selectors;
	jQuery.expr[":"] = jQuery.expr.pseudos;
	jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
	jQuery.text = Sizzle.getText;
	jQuery.isXMLDoc = Sizzle.isXML;
	jQuery.contains = Sizzle.contains;
	jQuery.escapeSelector = Sizzle.escape;

	var dir = function dir(elem, _dir, until) {
		var matched = [],
			truncate = until !== undefined;

		while ((elem = elem[_dir]) && elem.nodeType !== 9) {
			if (elem.nodeType === 1) {
				if (truncate && jQuery(elem).is(until)) {
					break;
				}

				matched.push(elem);
			}
		}

		return matched;
	};

	var _siblings = function siblings(n, elem) {
		var matched = [];

		for (; n; n = n.nextSibling) {
			if (n.nodeType === 1 && n !== elem) {
				matched.push(n);
			}
		}

		return matched;
	};

	var rneedsContext = jQuery.expr.match.needsContext;
	var rsingleTag = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;
	var risSimple = /^.[^:#\[\.,]*$/;

	function winnow(elements, qualifier, not) {
		if (jQuery.isFunction(qualifier)) {
			return jQuery.grep(elements, function(elem, i) {
				return !!qualifier.call(elem, i, elem) !== not;
			});
		}

		if (qualifier.nodeType) {
			return jQuery.grep(elements, function(elem) {
				return (elem === qualifier) !== not;
			});
		}

		if (typeof qualifier !== "string") {
			return jQuery.grep(elements, function(elem) {
				return indexOf.call(qualifier, elem) > -1 !== not;
			});
		}

		if (risSimple.test(qualifier)) {
			return jQuery.filter(qualifier, elements, not);
		}

		qualifier = jQuery.filter(qualifier, elements);
		return jQuery.grep(elements, function(elem) {
			return (
				indexOf.call(qualifier, elem) > -1 !== not &&
				elem.nodeType === 1
			);
		});
	}

	jQuery.filter = function(expr, elems, not) {
		var elem = elems[0];

		if (not) {
			expr = ":not(" + expr + ")";
		}

		if (elems.length === 1 && elem.nodeType === 1) {
			return jQuery.find.matchesSelector(elem, expr) ? [elem] : [];
		}

		return jQuery.find.matches(
			expr,
			jQuery.grep(elems, function(elem) {
				return elem.nodeType === 1;
			})
		);
	};

	jQuery.fn.extend({
		find: function find(selector) {
			var i,
				ret,
				len = this.length,
				self = this;

			if (typeof selector !== "string") {
				return this.pushStack(
					jQuery(selector).filter(function() {
						for (i = 0; i < len; i++) {
							if (jQuery.contains(self[i], this)) {
								return true;
							}
						}
					})
				);
			}

			ret = this.pushStack([]);

			for (i = 0; i < len; i++) {
				jQuery.find(selector, self[i], ret);
			}

			return len > 1 ? jQuery.uniqueSort(ret) : ret;
		},
		filter: function filter(selector) {
			return this.pushStack(winnow(this, selector || [], false));
		},
		not: function not(selector) {
			return this.pushStack(winnow(this, selector || [], true));
		},
		is: function is(selector) {
			return !!winnow(
				this,
				typeof selector === "string" && rneedsContext.test(selector)
					? jQuery(selector)
					: selector || [],
				false
			).length;
		}
	});

	var rootjQuery,
		rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,
		init = (jQuery.fn.init = function(selector, context, root) {
			var match, elem;

			if (!selector) {
				return this;
			}

			root = root || rootjQuery;

			if (typeof selector === "string") {
				if (
					selector[0] === "<" &&
					selector[selector.length - 1] === ">" &&
					selector.length >= 3
				) {
					match = [null, selector, null];
				} else {
					match = rquickExpr.exec(selector);
				}

				if (match && (match[1] || !context)) {
					if (match[1]) {
						context =
							context instanceof jQuery ? context[0] : context;
						jQuery.merge(
							this,
							jQuery.parseHTML(
								match[1],
								context && context.nodeType
									? context.ownerDocument || context
									: document,
								true
							)
						);

						if (
							rsingleTag.test(match[1]) &&
							jQuery.isPlainObject(context)
						) {
							for (match in context) {
								if (jQuery.isFunction(this[match])) {
									this[match](context[match]);
								} else {
									this.attr(match, context[match]);
								}
							}
						}

						return this;
					} else {
						elem = document.getElementById(match[2]);

						if (elem) {
							this[0] = elem;
							this.length = 1;
						}

						return this;
					}
				} else if (!context || context.jquery) {
					return (context || root).find(selector);
				} else {
					return this.constructor(context).find(selector);
				}
			} else if (selector.nodeType) {
				this[0] = selector;
				this.length = 1;
				return this;
			} else if (jQuery.isFunction(selector)) {
				return root.ready !== undefined
					? root.ready(selector)
					: selector(jQuery);
			}

			return jQuery.makeArray(selector, this);
		});

	init.prototype = jQuery.fn;
	rootjQuery = jQuery(document);
	var rparentsprev = /^(?:parents|prev(?:Until|All))/,
		guaranteedUnique = {
			children: true,
			contents: true,
			next: true,
			prev: true
		};
	jQuery.fn.extend({
		has: function has(target) {
			var targets = jQuery(target, this),
				l = targets.length;
			return this.filter(function() {
				var i = 0;

				for (; i < l; i++) {
					if (jQuery.contains(this, targets[i])) {
						return true;
					}
				}
			});
		},
		closest: function closest(selectors, context) {
			var cur,
				i = 0,
				l = this.length,
				matched = [],
				targets = typeof selectors !== "string" && jQuery(selectors);

			if (!rneedsContext.test(selectors)) {
				for (; i < l; i++) {
					for (
						cur = this[i];
						cur && cur !== context;
						cur = cur.parentNode
					) {
						if (
							cur.nodeType < 11 &&
							(targets
								? targets.index(cur) > -1
								: cur.nodeType === 1 &&
								  jQuery.find.matchesSelector(cur, selectors))
						) {
							matched.push(cur);
							break;
						}
					}
				}
			}

			return this.pushStack(
				matched.length > 1 ? jQuery.uniqueSort(matched) : matched
			);
		},
		index: function index(elem) {
			if (!elem) {
				return this[0] && this[0].parentNode
					? this.first().prevAll().length
					: -1;
			}

			if (typeof elem === "string") {
				return indexOf.call(jQuery(elem), this[0]);
			}

			return indexOf.call(this, elem.jquery ? elem[0] : elem);
		},
		add: function add(selector, context) {
			return this.pushStack(
				jQuery.uniqueSort(
					jQuery.merge(this.get(), jQuery(selector, context))
				)
			);
		},
		addBack: function addBack(selector) {
			return this.add(
				selector == null
					? this.prevObject
					: this.prevObject.filter(selector)
			);
		}
	});

	function sibling(cur, dir) {
		while ((cur = cur[dir]) && cur.nodeType !== 1) {}

		return cur;
	}

	jQuery.each(
		{
			parent: function parent(elem) {
				var parent = elem.parentNode;
				return parent && parent.nodeType !== 11 ? parent : null;
			},
			parents: function parents(elem) {
				return dir(elem, "parentNode");
			},
			parentsUntil: function parentsUntil(elem, i, until) {
				return dir(elem, "parentNode", until);
			},
			next: function next(elem) {
				return sibling(elem, "nextSibling");
			},
			prev: function prev(elem) {
				return sibling(elem, "previousSibling");
			},
			nextAll: function nextAll(elem) {
				return dir(elem, "nextSibling");
			},
			prevAll: function prevAll(elem) {
				return dir(elem, "previousSibling");
			},
			nextUntil: function nextUntil(elem, i, until) {
				return dir(elem, "nextSibling", until);
			},
			prevUntil: function prevUntil(elem, i, until) {
				return dir(elem, "previousSibling", until);
			},
			siblings: function siblings(elem) {
				return _siblings((elem.parentNode || {}).firstChild, elem);
			},
			children: function children(elem) {
				return _siblings(elem.firstChild);
			},
			contents: function contents(elem) {
				return (
					elem.contentDocument || jQuery.merge([], elem.childNodes)
				);
			}
		},
		function(name, fn) {
			jQuery.fn[name] = function(until, selector) {
				var matched = jQuery.map(this, fn, until);

				if (name.slice(-5) !== "Until") {
					selector = until;
				}

				if (selector && typeof selector === "string") {
					matched = jQuery.filter(selector, matched);
				}

				if (this.length > 1) {
					if (!guaranteedUnique[name]) {
						jQuery.uniqueSort(matched);
					}

					if (rparentsprev.test(name)) {
						matched.reverse();
					}
				}

				return this.pushStack(matched);
			};
		}
	);
	var rnothtmlwhite = /[^\x20\t\r\n\f]+/g;

	function createOptions(options) {
		var object = {};
		jQuery.each(options.match(rnothtmlwhite) || [], function(_, flag) {
			object[flag] = true;
		});
		return object;
	}

	jQuery.Callbacks = function(options) {
		options =
			typeof options === "string"
				? createOptions(options)
				: jQuery.extend({}, options);

		var firing,
			memory,
			_fired,
			_locked,
			list = [],
			queue = [],
			firingIndex = -1,
			fire = function fire() {
				_locked = options.once;
				_fired = firing = true;

				for (; queue.length; firingIndex = -1) {
					memory = queue.shift();

					while (++firingIndex < list.length) {
						if (
							list[firingIndex].apply(memory[0], memory[1]) ===
								false &&
							options.stopOnFalse
						) {
							firingIndex = list.length;
							memory = false;
						}
					}
				}

				if (!options.memory) {
					memory = false;
				}

				firing = false;

				if (_locked) {
					if (memory) {
						list = [];
					} else {
						list = "";
					}
				}
			},
			self = {
				add: function add() {
					if (list) {
						if (memory && !firing) {
							firingIndex = list.length - 1;
							queue.push(memory);
						}

						(function add(args) {
							jQuery.each(args, function(_, arg) {
								if (jQuery.isFunction(arg)) {
									if (!options.unique || !self.has(arg)) {
										list.push(arg);
									}
								} else if (
									arg &&
									arg.length &&
									jQuery.type(arg) !== "string"
								) {
									add(arg);
								}
							});
						})(arguments);

						if (memory && !firing) {
							fire();
						}
					}

					return this;
				},
				remove: function remove() {
					jQuery.each(arguments, function(_, arg) {
						var index;

						while (
							(index = jQuery.inArray(arg, list, index)) > -1
						) {
							list.splice(index, 1);

							if (index <= firingIndex) {
								firingIndex--;
							}
						}
					});
					return this;
				},
				has: function has(fn) {
					return fn ? jQuery.inArray(fn, list) > -1 : list.length > 0;
				},
				empty: function empty() {
					if (list) {
						list = [];
					}

					return this;
				},
				disable: function disable() {
					_locked = queue = [];
					list = memory = "";
					return this;
				},
				disabled: function disabled() {
					return !list;
				},
				lock: function lock() {
					_locked = queue = [];

					if (!memory && !firing) {
						list = memory = "";
					}

					return this;
				},
				locked: function locked() {
					return !!_locked;
				},
				fireWith: function fireWith(context, args) {
					if (!_locked) {
						args = args || [];
						args = [context, args.slice ? args.slice() : args];
						queue.push(args);

						if (!firing) {
							fire();
						}
					}

					return this;
				},
				fire: function fire() {
					self.fireWith(this, arguments);
					return this;
				},
				fired: function fired() {
					return !!_fired;
				}
			};

		return self;
	};

	function Identity(v) {
		return v;
	}

	function Thrower(ex) {
		throw ex;
	}

	function adoptValue(value, resolve, reject) {
		var method;

		try {
			if (value && jQuery.isFunction((method = value.promise))) {
				method
					.call(value)
					.done(resolve)
					.fail(reject);
			} else if (value && jQuery.isFunction((method = value.then))) {
				method.call(value, resolve, reject);
			} else {
				resolve.call(undefined, value);
			}
		} catch (value) {
			reject.call(undefined, value);
		}
	}

	jQuery.extend({
		Deferred: function Deferred(func) {
			var tuples = [
					[
						"notify",
						"progress",
						jQuery.Callbacks("memory"),
						jQuery.Callbacks("memory"),
						2
					],
					[
						"resolve",
						"done",
						jQuery.Callbacks("once memory"),
						jQuery.Callbacks("once memory"),
						0,
						"resolved"
					],
					[
						"reject",
						"fail",
						jQuery.Callbacks("once memory"),
						jQuery.Callbacks("once memory"),
						1,
						"rejected"
					]
				],
				_state = "pending",
				_promise = {
					state: function state() {
						return _state;
					},
					always: function always() {
						deferred.done(arguments).fail(arguments);
						return this;
					},
					catch: function _catch(fn) {
						return _promise.then(null, fn);
					},
					pipe: function pipe() {
						var fns = arguments;
						return jQuery
							.Deferred(function(newDefer) {
								jQuery.each(tuples, function(i, tuple) {
									var fn =
										jQuery.isFunction(fns[tuple[4]]) &&
										fns[tuple[4]];
									deferred[tuple[1]](function() {
										var returned =
											fn && fn.apply(this, arguments);

										if (
											returned &&
											jQuery.isFunction(returned.promise)
										) {
											returned
												.promise()
												.progress(newDefer.notify)
												.done(newDefer.resolve)
												.fail(newDefer.reject);
										} else {
											newDefer[tuple[0] + "With"](
												this,
												fn ? [returned] : arguments
											);
										}
									});
								});
								fns = null;
							})
							.promise();
					},
					then: function then(onFulfilled, onRejected, onProgress) {
						var maxDepth = 0;

						function resolve(depth, deferred, handler, special) {
							return function() {
								var that = this,
									args = arguments,
									mightThrow = function mightThrow() {
										var returned, then;

										if (depth < maxDepth) {
											return;
										}

										returned = handler.apply(that, args);

										if (returned === deferred.promise()) {
											throw new TypeError(
												"Thenable self-resolution"
											);
										}

										then =
											returned &&
											(_typeof(returned) === "object" ||
												typeof returned ===
													"function") &&
											returned.then;

										if (jQuery.isFunction(then)) {
											if (special) {
												then.call(
													returned,
													resolve(
														maxDepth,
														deferred,
														Identity,
														special
													),
													resolve(
														maxDepth,
														deferred,
														Thrower,
														special
													)
												);
											} else {
												maxDepth++;
												then.call(
													returned,
													resolve(
														maxDepth,
														deferred,
														Identity,
														special
													),
													resolve(
														maxDepth,
														deferred,
														Thrower,
														special
													),
													resolve(
														maxDepth,
														deferred,
														Identity,
														deferred.notifyWith
													)
												);
											}
										} else {
											if (handler !== Identity) {
												that = undefined;
												args = [returned];
											}

											(special || deferred.resolveWith)(
												that,
												args
											);
										}
									},
									process = special
										? mightThrow
										: function() {
												try {
													mightThrow();
												} catch (e) {
													if (
														jQuery.Deferred
															.exceptionHook
													) {
														jQuery.Deferred.exceptionHook(
															e,
															process.stackTrace
														);
													}

													if (depth + 1 >= maxDepth) {
														if (
															handler !== Thrower
														) {
															that = undefined;
															args = [e];
														}

														deferred.rejectWith(
															that,
															args
														);
													}
												}
										  };

								if (depth) {
									process();
								} else {
									if (jQuery.Deferred.getStackHook) {
										process.stackTrace = jQuery.Deferred.getStackHook();
									}

									window.setTimeout(process);
								}
							};
						}

						return jQuery
							.Deferred(function(newDefer) {
								tuples[0][3].add(
									resolve(
										0,
										newDefer,
										jQuery.isFunction(onProgress)
											? onProgress
											: Identity,
										newDefer.notifyWith
									)
								);
								tuples[1][3].add(
									resolve(
										0,
										newDefer,
										jQuery.isFunction(onFulfilled)
											? onFulfilled
											: Identity
									)
								);
								tuples[2][3].add(
									resolve(
										0,
										newDefer,
										jQuery.isFunction(onRejected)
											? onRejected
											: Thrower
									)
								);
							})
							.promise();
					},
					promise: function promise(obj) {
						return obj != null
							? jQuery.extend(obj, _promise)
							: _promise;
					}
				},
				deferred = {};
			jQuery.each(tuples, function(i, tuple) {
				var list = tuple[2],
					stateString = tuple[5];
				_promise[tuple[1]] = list.add;

				if (stateString) {
					list.add(
						function() {
							_state = stateString;
						},
						tuples[3 - i][2].disable,
						tuples[0][2].lock
					);
				}

				list.add(tuple[3].fire);

				deferred[tuple[0]] = function() {
					deferred[tuple[0] + "With"](
						this === deferred ? undefined : this,
						arguments
					);
					return this;
				};

				deferred[tuple[0] + "With"] = list.fireWith;
			});

			_promise.promise(deferred);

			if (func) {
				func.call(deferred, deferred);
			}

			return deferred;
		},
		when: function when(singleValue) {
			var remaining = arguments.length,
				i = remaining,
				resolveContexts = Array(i),
				resolveValues = _slice.call(arguments),
				master = jQuery.Deferred(),
				updateFunc = function updateFunc(i) {
					return function(value) {
						resolveContexts[i] = this;
						resolveValues[i] =
							arguments.length > 1
								? _slice.call(arguments)
								: value;

						if (!--remaining) {
							master.resolveWith(resolveContexts, resolveValues);
						}
					};
				};

			if (remaining <= 1) {
				adoptValue(
					singleValue,
					master.done(updateFunc(i)).resolve,
					master.reject
				);

				if (
					master.state() === "pending" ||
					jQuery.isFunction(resolveValues[i] && resolveValues[i].then)
				) {
					return master.then();
				}
			}

			while (i--) {
				adoptValue(resolveValues[i], updateFunc(i), master.reject);
			}

			return master.promise();
		}
	});
	var rerrorNames = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;

	jQuery.Deferred.exceptionHook = function(error, stack) {
		if (
			window.console &&
			window.console.warn &&
			error &&
			rerrorNames.test(error.name)
		) {
			window.console.warn(
				"jQuery.Deferred exception: " + error.message,
				error.stack,
				stack
			);
		}
	};

	jQuery.readyException = function(error) {
		window.setTimeout(function() {
			throw error;
		});
	};

	var readyList = jQuery.Deferred();

	jQuery.fn.ready = function(fn) {
		readyList.then(fn).catch(function(error) {
			jQuery.readyException(error);
		});
		return this;
	};

	jQuery.extend({
		isReady: false,
		readyWait: 1,
		holdReady: function holdReady(hold) {
			if (hold) {
				jQuery.readyWait++;
			} else {
				jQuery.ready(true);
			}
		},
		ready: function ready(wait) {
			if (wait === true ? --jQuery.readyWait : jQuery.isReady) {
				return;
			}

			jQuery.isReady = true;

			if (wait !== true && --jQuery.readyWait > 0) {
				return;
			}

			readyList.resolveWith(document, [jQuery]);
		}
	});
	jQuery.ready.then = readyList.then;

	function completed() {
		document.removeEventListener("DOMContentLoaded", completed);
		window.removeEventListener("load", completed);
		jQuery.ready();
	}

	if (
		document.readyState === "complete" ||
		(document.readyState !== "loading" &&
			!document.documentElement.doScroll)
	) {
		window.setTimeout(jQuery.ready);
	} else {
		document.addEventListener("DOMContentLoaded", completed);
		window.addEventListener("load", completed);
	}

	var access = function access(
		elems,
		fn,
		key,
		value,
		chainable,
		emptyGet,
		raw
	) {
		var i = 0,
			len = elems.length,
			bulk = key == null;

		if (jQuery.type(key) === "object") {
			chainable = true;

			for (i in key) {
				access(elems, fn, i, key[i], true, emptyGet, raw);
			}
		} else if (value !== undefined) {
			chainable = true;

			if (!jQuery.isFunction(value)) {
				raw = true;
			}

			if (bulk) {
				if (raw) {
					fn.call(elems, value);
					fn = null;
				} else {
					bulk = fn;

					fn = function fn(elem, key, value) {
						return bulk.call(jQuery(elem), value);
					};
				}
			}

			if (fn) {
				for (; i < len; i++) {
					fn(
						elems[i],
						key,
						raw ? value : value.call(elems[i], i, fn(elems[i], key))
					);
				}
			}
		}

		if (chainable) {
			return elems;
		}

		if (bulk) {
			return fn.call(elems);
		}

		return len ? fn(elems[0], key) : emptyGet;
	};

	var acceptData = function acceptData(owner) {
		return owner.nodeType === 1 || owner.nodeType === 9 || !+owner.nodeType;
	};

	function Data() {
		this.expando = jQuery.expando + Data.uid++;
	}

	Data.uid = 1;
	Data.prototype = {
		cache: function cache(owner) {
			var value = owner[this.expando];

			if (!value) {
				value = {};

				if (acceptData(owner)) {
					if (owner.nodeType) {
						owner[this.expando] = value;
					} else {
						Object.defineProperty(owner, this.expando, {
							value: value,
							configurable: true
						});
					}
				}
			}

			return value;
		},
		set: function set(owner, data, value) {
			var prop,
				cache = this.cache(owner);

			if (typeof data === "string") {
				cache[jQuery.camelCase(data)] = value;
			} else {
				for (prop in data) {
					cache[jQuery.camelCase(prop)] = data[prop];
				}
			}

			return cache;
		},
		get: function get(owner, key) {
			return key === undefined
				? this.cache(owner)
				: owner[this.expando] &&
						owner[this.expando][jQuery.camelCase(key)];
		},
		access: function access(owner, key, value) {
			if (
				key === undefined ||
				(key && typeof key === "string" && value === undefined)
			) {
				return this.get(owner, key);
			}

			this.set(owner, key, value);
			return value !== undefined ? value : key;
		},
		remove: function remove(owner, key) {
			var i,
				cache = owner[this.expando];

			if (cache === undefined) {
				return;
			}

			if (key !== undefined) {
				if (jQuery.isArray(key)) {
					key = key.map(jQuery.camelCase);
				} else {
					key = jQuery.camelCase(key);
					key = key in cache ? [key] : key.match(rnothtmlwhite) || [];
				}

				i = key.length;

				while (i--) {
					delete cache[key[i]];
				}
			}

			if (key === undefined || jQuery.isEmptyObject(cache)) {
				if (owner.nodeType) {
					owner[this.expando] = undefined;
				} else {
					delete owner[this.expando];
				}
			}
		},
		hasData: function hasData(owner) {
			var cache = owner[this.expando];
			return cache !== undefined && !jQuery.isEmptyObject(cache);
		}
	};
	var dataPriv = new Data();
	var dataUser = new Data();
	var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
		rmultiDash = /[A-Z]/g;

	function getData(data) {
		if (data === "true") {
			return true;
		}

		if (data === "false") {
			return false;
		}

		if (data === "null") {
			return null;
		}

		if (data === +data + "") {
			return +data;
		}

		if (rbrace.test(data)) {
			return JSON.parse(data);
		}

		return data;
	}

	function dataAttr(elem, key, data) {
		var name;

		if (data === undefined && elem.nodeType === 1) {
			name = "data-" + key.replace(rmultiDash, "-$&").toLowerCase();
			data = elem.getAttribute(name);

			if (typeof data === "string") {
				try {
					data = getData(data);
				} catch (e) {}

				dataUser.set(elem, key, data);
			} else {
				data = undefined;
			}
		}

		return data;
	}

	jQuery.extend({
		hasData: function hasData(elem) {
			return dataUser.hasData(elem) || dataPriv.hasData(elem);
		},
		data: function data(elem, name, _data) {
			return dataUser.access(elem, name, _data);
		},
		removeData: function removeData(elem, name) {
			dataUser.remove(elem, name);
		},
		_data: function _data(elem, name, data) {
			return dataPriv.access(elem, name, data);
		},
		_removeData: function _removeData(elem, name) {
			dataPriv.remove(elem, name);
		}
	});
	jQuery.fn.extend({
		data: function data(key, value) {
			var i,
				name,
				data,
				elem = this[0],
				attrs = elem && elem.attributes;

			if (key === undefined) {
				if (this.length) {
					data = dataUser.get(elem);

					if (
						elem.nodeType === 1 &&
						!dataPriv.get(elem, "hasDataAttrs")
					) {
						i = attrs.length;

						while (i--) {
							if (attrs[i]) {
								name = attrs[i].name;

								if (name.indexOf("data-") === 0) {
									name = jQuery.camelCase(name.slice(5));
									dataAttr(elem, name, data[name]);
								}
							}
						}

						dataPriv.set(elem, "hasDataAttrs", true);
					}
				}

				return data;
			}

			if (_typeof(key) === "object") {
				return this.each(function() {
					dataUser.set(this, key);
				});
			}

			return access(
				this,
				function(value) {
					var data;

					if (elem && value === undefined) {
						data = dataUser.get(elem, key);

						if (data !== undefined) {
							return data;
						}

						data = dataAttr(elem, key);

						if (data !== undefined) {
							return data;
						}

						return;
					}

					this.each(function() {
						dataUser.set(this, key, value);
					});
				},
				null,
				value,
				arguments.length > 1,
				null,
				true
			);
		},
		removeData: function removeData(key) {
			return this.each(function() {
				dataUser.remove(this, key);
			});
		}
	});
	jQuery.extend({
		queue: function queue(elem, type, data) {
			var queue;

			if (elem) {
				type = (type || "fx") + "queue";
				queue = dataPriv.get(elem, type);

				if (data) {
					if (!queue || jQuery.isArray(data)) {
						queue = dataPriv.access(
							elem,
							type,
							jQuery.makeArray(data)
						);
					} else {
						queue.push(data);
					}
				}

				return queue || [];
			}
		},
		dequeue: function dequeue(elem, type) {
			type = type || "fx";

			var queue = jQuery.queue(elem, type),
				startLength = queue.length,
				fn = queue.shift(),
				hooks = jQuery._queueHooks(elem, type),
				next = function next() {
					jQuery.dequeue(elem, type);
				};

			if (fn === "inprogress") {
				fn = queue.shift();
				startLength--;
			}

			if (fn) {
				if (type === "fx") {
					queue.unshift("inprogress");
				}

				delete hooks.stop;
				fn.call(elem, next, hooks);
			}

			if (!startLength && hooks) {
				hooks.empty.fire();
			}
		},
		_queueHooks: function _queueHooks(elem, type) {
			var key = type + "queueHooks";
			return (
				dataPriv.get(elem, key) ||
				dataPriv.access(elem, key, {
					empty: jQuery.Callbacks("once memory").add(function() {
						dataPriv.remove(elem, [type + "queue", key]);
					})
				})
			);
		}
	});
	jQuery.fn.extend({
		queue: function queue(type, data) {
			var setter = 2;

			if (typeof type !== "string") {
				data = type;
				type = "fx";
				setter--;
			}

			if (arguments.length < setter) {
				return jQuery.queue(this[0], type);
			}

			return data === undefined
				? this
				: this.each(function() {
						var queue = jQuery.queue(this, type, data);

						jQuery._queueHooks(this, type);

						if (type === "fx" && queue[0] !== "inprogress") {
							jQuery.dequeue(this, type);
						}
				  });
		},
		dequeue: function dequeue(type) {
			return this.each(function() {
				jQuery.dequeue(this, type);
			});
		},
		clearQueue: function clearQueue(type) {
			return this.queue(type || "fx", []);
		},
		promise: function promise(type, obj) {
			var tmp,
				count = 1,
				defer = jQuery.Deferred(),
				elements = this,
				i = this.length,
				resolve = function resolve() {
					if (!--count) {
						defer.resolveWith(elements, [elements]);
					}
				};

			if (typeof type !== "string") {
				obj = type;
				type = undefined;
			}

			type = type || "fx";

			while (i--) {
				tmp = dataPriv.get(elements[i], type + "queueHooks");

				if (tmp && tmp.empty) {
					count++;
					tmp.empty.add(resolve);
				}
			}

			resolve();
			return defer.promise(obj);
		}
	});
	var pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source;
	var rcssNum = new RegExp("^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i");
	var cssExpand = ["Top", "Right", "Bottom", "Left"];

	var isHiddenWithinTree = function isHiddenWithinTree(elem, el) {
		elem = el || elem;
		return (
			elem.style.display === "none" ||
			(elem.style.display === "" &&
				jQuery.contains(elem.ownerDocument, elem) &&
				jQuery.css(elem, "display") === "none")
		);
	};

	var swap = function swap(elem, options, callback, args) {
		var ret,
			name,
			old = {};

		for (name in options) {
			old[name] = elem.style[name];
			elem.style[name] = options[name];
		}

		ret = callback.apply(elem, args || []);

		for (name in options) {
			elem.style[name] = old[name];
		}

		return ret;
	};

	function adjustCSS(elem, prop, valueParts, tween) {
		var adjusted,
			scale = 1,
			maxIterations = 20,
			currentValue = tween
				? function() {
						return tween.cur();
				  }
				: function() {
						return jQuery.css(elem, prop, "");
				  },
			initial = currentValue(),
			unit =
				(valueParts && valueParts[3]) ||
				(jQuery.cssNumber[prop] ? "" : "px"),
			initialInUnit =
				(jQuery.cssNumber[prop] || (unit !== "px" && +initial)) &&
				rcssNum.exec(jQuery.css(elem, prop));

		if (initialInUnit && initialInUnit[3] !== unit) {
			unit = unit || initialInUnit[3];
			valueParts = valueParts || [];
			initialInUnit = +initial || 1;

			do {
				scale = scale || ".5";
				initialInUnit = initialInUnit / scale;
				jQuery.style(elem, prop, initialInUnit + unit);
			} while (
				scale !== (scale = currentValue() / initial) &&
				scale !== 1 &&
				--maxIterations
			);
		}

		if (valueParts) {
			initialInUnit = +initialInUnit || +initial || 0;
			adjusted = valueParts[1]
				? initialInUnit + (valueParts[1] + 1) * valueParts[2]
				: +valueParts[2];

			if (tween) {
				tween.unit = unit;
				tween.start = initialInUnit;
				tween.end = adjusted;
			}
		}

		return adjusted;
	}

	var defaultDisplayMap = {};

	function getDefaultDisplay(elem) {
		var temp,
			doc = elem.ownerDocument,
			nodeName = elem.nodeName,
			display = defaultDisplayMap[nodeName];

		if (display) {
			return display;
		}

		temp = doc.body.appendChild(doc.createElement(nodeName));
		display = jQuery.css(temp, "display");
		temp.parentNode.removeChild(temp);

		if (display === "none") {
			display = "block";
		}

		defaultDisplayMap[nodeName] = display;
		return display;
	}

	function showHide(elements, show) {
		var display,
			elem,
			values = [],
			index = 0,
			length = elements.length;

		for (; index < length; index++) {
			elem = elements[index];

			if (!elem.style) {
				continue;
			}

			display = elem.style.display;

			if (show) {
				if (display === "none") {
					values[index] = dataPriv.get(elem, "display") || null;

					if (!values[index]) {
						elem.style.display = "";
					}
				}

				if (elem.style.display === "" && isHiddenWithinTree(elem)) {
					values[index] = getDefaultDisplay(elem);
				}
			} else {
				if (display !== "none") {
					values[index] = "none";
					dataPriv.set(elem, "display", display);
				}
			}
		}

		for (index = 0; index < length; index++) {
			if (values[index] != null) {
				elements[index].style.display = values[index];
			}
		}

		return elements;
	}

	jQuery.fn.extend({
		show: function show() {
			return showHide(this, true);
		},
		hide: function hide() {
			return showHide(this);
		},
		toggle: function toggle(state) {
			if (typeof state === "boolean") {
				return state ? this.show() : this.hide();
			}

			return this.each(function() {
				if (isHiddenWithinTree(this)) {
					jQuery(this).show();
				} else {
					jQuery(this).hide();
				}
			});
		}
	});
	var rcheckableType = /^(?:checkbox|radio)$/i;
	var rtagName = /<([a-z][^\/\0>\x20\t\r\n\f]+)/i;
	var rscriptType = /^$|\/(?:java|ecma)script/i;
	var wrapMap = {
		option: [1, "<select multiple='multiple'>", "</select>"],
		thead: [1, "<table>", "</table>"],
		col: [2, "<table><colgroup>", "</colgroup></table>"],
		tr: [2, "<table><tbody>", "</tbody></table>"],
		td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
		_default: [0, "", ""]
	};
	wrapMap.optgroup = wrapMap.option;
	wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption =
		wrapMap.thead;
	wrapMap.th = wrapMap.td;

	function getAll(context, tag) {
		var ret;

		if (typeof context.getElementsByTagName !== "undefined") {
			ret = context.getElementsByTagName(tag || "*");
		} else if (typeof context.querySelectorAll !== "undefined") {
			ret = context.querySelectorAll(tag || "*");
		} else {
			ret = [];
		}

		if (tag === undefined || (tag && jQuery.nodeName(context, tag))) {
			return jQuery.merge([context], ret);
		}

		return ret;
	}

	function setGlobalEval(elems, refElements) {
		var i = 0,
			l = elems.length;

		for (; i < l; i++) {
			dataPriv.set(
				elems[i],
				"globalEval",
				!refElements || dataPriv.get(refElements[i], "globalEval")
			);
		}
	}

	var rhtml = /<|&#?\w+;/;

	function buildFragment(elems, context, scripts, selection, ignored) {
		var elem,
			tmp,
			tag,
			wrap,
			contains,
			j,
			fragment = context.createDocumentFragment(),
			nodes = [],
			i = 0,
			l = elems.length;

		for (; i < l; i++) {
			elem = elems[i];

			if (elem || elem === 0) {
				if (jQuery.type(elem) === "object") {
					jQuery.merge(nodes, elem.nodeType ? [elem] : elem);
				} else if (!rhtml.test(elem)) {
					nodes.push(context.createTextNode(elem));
				} else {
					tmp =
						tmp ||
						fragment.appendChild(context.createElement("div"));
					tag = (rtagName.exec(elem) || ["", ""])[1].toLowerCase();
					wrap = wrapMap[tag] || wrapMap._default;
					tmp.innerHTML =
						wrap[1] + jQuery.htmlPrefilter(elem) + wrap[2];
					j = wrap[0];

					while (j--) {
						tmp = tmp.lastChild;
					}

					jQuery.merge(nodes, tmp.childNodes);
					tmp = fragment.firstChild;
					tmp.textContent = "";
				}
			}
		}

		fragment.textContent = "";
		i = 0;

		while ((elem = nodes[i++])) {
			if (selection && jQuery.inArray(elem, selection) > -1) {
				if (ignored) {
					ignored.push(elem);
				}

				continue;
			}

			contains = jQuery.contains(elem.ownerDocument, elem);
			tmp = getAll(fragment.appendChild(elem), "script");

			if (contains) {
				setGlobalEval(tmp);
			}

			if (scripts) {
				j = 0;

				while ((elem = tmp[j++])) {
					if (rscriptType.test(elem.type || "")) {
						scripts.push(elem);
					}
				}
			}
		}

		return fragment;
	}

	(function() {
		var fragment = document.createDocumentFragment(),
			div = fragment.appendChild(document.createElement("div")),
			input = document.createElement("input");
		input.setAttribute("type", "radio");
		input.setAttribute("checked", "checked");
		input.setAttribute("name", "t");
		div.appendChild(input);
		support.checkClone = div
			.cloneNode(true)
			.cloneNode(true).lastChild.checked;
		div.innerHTML = "<textarea>x</textarea>";
		support.noCloneChecked = !!div.cloneNode(true).lastChild.defaultValue;
	})();

	var documentElement = document.documentElement;
	var rkeyEvent = /^key/,
		rmouseEvent = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
		rtypenamespace = /^([^.]*)(?:\.(.+)|)/;

	function returnTrue() {
		return true;
	}

	function returnFalse() {
		return false;
	}

	function safeActiveElement() {
		try {
			return document.activeElement;
		} catch (err) {}
	}

	function _on(elem, types, selector, data, fn, one) {
		var origFn, type;

		if (_typeof(types) === "object") {
			if (typeof selector !== "string") {
				data = data || selector;
				selector = undefined;
			}

			for (type in types) {
				_on(elem, type, selector, data, types[type], one);
			}

			return elem;
		}

		if (data == null && fn == null) {
			fn = selector;
			data = selector = undefined;
		} else if (fn == null) {
			if (typeof selector === "string") {
				fn = data;
				data = undefined;
			} else {
				fn = data;
				data = selector;
				selector = undefined;
			}
		}

		if (fn === false) {
			fn = returnFalse;
		} else if (!fn) {
			return elem;
		}

		if (one === 1) {
			origFn = fn;

			fn = function fn(event) {
				jQuery().off(event);
				return origFn.apply(this, arguments);
			};

			fn.guid = origFn.guid || (origFn.guid = jQuery.guid++);
		}

		return elem.each(function() {
			jQuery.event.add(this, types, fn, data, selector);
		});
	}

	jQuery.event = {
		global: {},
		add: function add(elem, types, handler, data, selector) {
			var handleObjIn,
				eventHandle,
				tmp,
				events,
				t,
				handleObj,
				special,
				handlers,
				type,
				namespaces,
				origType,
				elemData = dataPriv.get(elem);

			if (!elemData) {
				return;
			}

			if (handler.handler) {
				handleObjIn = handler;
				handler = handleObjIn.handler;
				selector = handleObjIn.selector;
			}

			if (selector) {
				jQuery.find.matchesSelector(documentElement, selector);
			}

			if (!handler.guid) {
				handler.guid = jQuery.guid++;
			}

			if (!(events = elemData.events)) {
				events = elemData.events = {};
			}

			if (!(eventHandle = elemData.handle)) {
				eventHandle = elemData.handle = function(e) {
					return typeof jQuery !== "undefined" &&
						jQuery.event.triggered !== e.type
						? jQuery.event.dispatch.apply(elem, arguments)
						: undefined;
				};
			}

			types = (types || "").match(rnothtmlwhite) || [""];
			t = types.length;

			while (t--) {
				tmp = rtypenamespace.exec(types[t]) || [];
				type = origType = tmp[1];
				namespaces = (tmp[2] || "").split(".").sort();

				if (!type) {
					continue;
				}

				special = jQuery.event.special[type] || {};
				type =
					(selector ? special.delegateType : special.bindType) ||
					type;
				special = jQuery.event.special[type] || {};
				handleObj = jQuery.extend(
					{
						type: type,
						origType: origType,
						data: data,
						handler: handler,
						guid: handler.guid,
						selector: selector,
						needsContext:
							selector &&
							jQuery.expr.match.needsContext.test(selector),
						namespace: namespaces.join(".")
					},
					handleObjIn
				);

				if (!(handlers = events[type])) {
					handlers = events[type] = [];
					handlers.delegateCount = 0;

					if (
						!special.setup ||
						special.setup.call(
							elem,
							data,
							namespaces,
							eventHandle
						) === false
					) {
						if (elem.addEventListener) {
							elem.addEventListener(type, eventHandle);
						}
					}
				}

				if (special.add) {
					special.add.call(elem, handleObj);

					if (!handleObj.handler.guid) {
						handleObj.handler.guid = handler.guid;
					}
				}

				if (selector) {
					handlers.splice(handlers.delegateCount++, 0, handleObj);
				} else {
					handlers.push(handleObj);
				}

				jQuery.event.global[type] = true;
			}
		},
		remove: function remove(elem, types, handler, selector, mappedTypes) {
			var j,
				origCount,
				tmp,
				events,
				t,
				handleObj,
				special,
				handlers,
				type,
				namespaces,
				origType,
				elemData = dataPriv.hasData(elem) && dataPriv.get(elem);

			if (!elemData || !(events = elemData.events)) {
				return;
			}

			types = (types || "").match(rnothtmlwhite) || [""];
			t = types.length;

			while (t--) {
				tmp = rtypenamespace.exec(types[t]) || [];
				type = origType = tmp[1];
				namespaces = (tmp[2] || "").split(".").sort();

				if (!type) {
					for (type in events) {
						jQuery.event.remove(
							elem,
							type + types[t],
							handler,
							selector,
							true
						);
					}

					continue;
				}

				special = jQuery.event.special[type] || {};
				type =
					(selector ? special.delegateType : special.bindType) ||
					type;
				handlers = events[type] || [];
				tmp =
					tmp[2] &&
					new RegExp(
						"(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)"
					);
				origCount = j = handlers.length;

				while (j--) {
					handleObj = handlers[j];

					if (
						(mappedTypes || origType === handleObj.origType) &&
						(!handler || handler.guid === handleObj.guid) &&
						(!tmp || tmp.test(handleObj.namespace)) &&
						(!selector ||
							selector === handleObj.selector ||
							(selector === "**" && handleObj.selector))
					) {
						handlers.splice(j, 1);

						if (handleObj.selector) {
							handlers.delegateCount--;
						}

						if (special.remove) {
							special.remove.call(elem, handleObj);
						}
					}
				}

				if (origCount && !handlers.length) {
					if (
						!special.teardown ||
						special.teardown.call(
							elem,
							namespaces,
							elemData.handle
						) === false
					) {
						jQuery.removeEvent(elem, type, elemData.handle);
					}

					delete events[type];
				}
			}

			if (jQuery.isEmptyObject(events)) {
				dataPriv.remove(elem, "handle events");
			}
		},
		dispatch: function dispatch(nativeEvent) {
			var event = jQuery.event.fix(nativeEvent);
			var i,
				j,
				ret,
				matched,
				handleObj,
				handlerQueue,
				args = new Array(arguments.length),
				handlers =
					(dataPriv.get(this, "events") || {})[event.type] || [],
				special = jQuery.event.special[event.type] || {};
			args[0] = event;

			for (i = 1; i < arguments.length; i++) {
				args[i] = arguments[i];
			}

			event.delegateTarget = this;

			if (
				special.preDispatch &&
				special.preDispatch.call(this, event) === false
			) {
				return;
			}

			handlerQueue = jQuery.event.handlers.call(this, event, handlers);
			i = 0;

			while (
				(matched = handlerQueue[i++]) &&
				!event.isPropagationStopped()
			) {
				event.currentTarget = matched.elem;
				j = 0;

				while (
					(handleObj = matched.handlers[j++]) &&
					!event.isImmediatePropagationStopped()
				) {
					if (
						!event.rnamespace ||
						event.rnamespace.test(handleObj.namespace)
					) {
						event.handleObj = handleObj;
						event.data = handleObj.data;
						ret = (
							(jQuery.event.special[handleObj.origType] || {})
								.handle || handleObj.handler
						).apply(matched.elem, args);

						if (ret !== undefined) {
							if ((event.result = ret) === false) {
								event.preventDefault();
								event.stopPropagation();
							}
						}
					}
				}
			}

			if (special.postDispatch) {
				special.postDispatch.call(this, event);
			}

			return event.result;
		},
		handlers: function handlers(event, _handlers) {
			var i,
				handleObj,
				sel,
				matchedHandlers,
				matchedSelectors,
				handlerQueue = [],
				delegateCount = _handlers.delegateCount,
				cur = event.target;

			if (
				delegateCount &&
				cur.nodeType &&
				!(event.type === "click" && event.button >= 1)
			) {
				for (; cur !== this; cur = cur.parentNode || this) {
					if (
						cur.nodeType === 1 &&
						!(event.type === "click" && cur.disabled === true)
					) {
						matchedHandlers = [];
						matchedSelectors = {};

						for (i = 0; i < delegateCount; i++) {
							handleObj = _handlers[i];
							sel = handleObj.selector + " ";

							if (matchedSelectors[sel] === undefined) {
								matchedSelectors[sel] = handleObj.needsContext
									? jQuery(sel, this).index(cur) > -1
									: jQuery.find(sel, this, null, [cur])
											.length;
							}

							if (matchedSelectors[sel]) {
								matchedHandlers.push(handleObj);
							}
						}

						if (matchedHandlers.length) {
							handlerQueue.push({
								elem: cur,
								handlers: matchedHandlers
							});
						}
					}
				}
			}

			cur = this;

			if (delegateCount < _handlers.length) {
				handlerQueue.push({
					elem: cur,
					handlers: _handlers.slice(delegateCount)
				});
			}

			return handlerQueue;
		},
		addProp: function addProp(name, hook) {
			Object.defineProperty(jQuery.Event.prototype, name, {
				enumerable: true,
				configurable: true,
				get: jQuery.isFunction(hook)
					? function() {
							if (this.originalEvent) {
								return hook(this.originalEvent);
							}
					  }
					: function() {
							if (this.originalEvent) {
								return this.originalEvent[name];
							}
					  },
				set: function set(value) {
					Object.defineProperty(this, name, {
						enumerable: true,
						configurable: true,
						writable: true,
						value: value
					});
				}
			});
		},
		fix: function fix(originalEvent) {
			return originalEvent[jQuery.expando]
				? originalEvent
				: new jQuery.Event(originalEvent);
		},
		special: {
			load: {
				noBubble: true
			},
			focus: {
				trigger: function trigger() {
					if (this !== safeActiveElement() && this.focus) {
						this.focus();
						return false;
					}
				},
				delegateType: "focusin"
			},
			blur: {
				trigger: function trigger() {
					if (this === safeActiveElement() && this.blur) {
						this.blur();
						return false;
					}
				},
				delegateType: "focusout"
			},
			click: {
				trigger: function trigger() {
					if (
						this.type === "checkbox" &&
						this.click &&
						jQuery.nodeName(this, "input")
					) {
						this.click();
						return false;
					}
				},
				_default: function _default(event) {
					return jQuery.nodeName(event.target, "a");
				}
			},
			beforeunload: {
				postDispatch: function postDispatch(event) {
					if (event.result !== undefined && event.originalEvent) {
						event.originalEvent.returnValue = event.result;
					}
				}
			}
		}
	};

	jQuery.removeEvent = function(elem, type, handle) {
		if (elem.removeEventListener) {
			elem.removeEventListener(type, handle);
		}
	};

	jQuery.Event = function(src, props) {
		if (!(this instanceof jQuery.Event)) {
			return new jQuery.Event(src, props);
		}

		if (src && src.type) {
			this.originalEvent = src;
			this.type = src.type;
			this.isDefaultPrevented =
				src.defaultPrevented ||
				(src.defaultPrevented === undefined &&
					src.returnValue === false)
					? returnTrue
					: returnFalse;
			this.target =
				src.target && src.target.nodeType === 3
					? src.target.parentNode
					: src.target;
			this.currentTarget = src.currentTarget;
			this.relatedTarget = src.relatedTarget;
		} else {
			this.type = src;
		}

		if (props) {
			jQuery.extend(this, props);
		}

		this.timeStamp = (src && src.timeStamp) || jQuery.now();
		this[jQuery.expando] = true;
	};

	jQuery.Event.prototype = {
		constructor: jQuery.Event,
		isDefaultPrevented: returnFalse,
		isPropagationStopped: returnFalse,
		isImmediatePropagationStopped: returnFalse,
		isSimulated: false,
		preventDefault: function preventDefault() {
			var e = this.originalEvent;
			this.isDefaultPrevented = returnTrue;

			if (e && !this.isSimulated) {
				e.preventDefault();
			}
		},
		stopPropagation: function stopPropagation() {
			var e = this.originalEvent;
			this.isPropagationStopped = returnTrue;

			if (e && !this.isSimulated) {
				e.stopPropagation();
			}
		},
		stopImmediatePropagation: function stopImmediatePropagation() {
			var e = this.originalEvent;
			this.isImmediatePropagationStopped = returnTrue;

			if (e && !this.isSimulated) {
				e.stopImmediatePropagation();
			}

			this.stopPropagation();
		}
	};
	jQuery.each(
		{
			altKey: true,
			bubbles: true,
			cancelable: true,
			changedTouches: true,
			ctrlKey: true,
			detail: true,
			eventPhase: true,
			metaKey: true,
			pageX: true,
			pageY: true,
			shiftKey: true,
			view: true,
			char: true,
			charCode: true,
			key: true,
			keyCode: true,
			button: true,
			buttons: true,
			clientX: true,
			clientY: true,
			offsetX: true,
			offsetY: true,
			pointerId: true,
			pointerType: true,
			screenX: true,
			screenY: true,
			targetTouches: true,
			toElement: true,
			touches: true,
			which: function which(event) {
				var button = event.button;

				if (event.which == null && rkeyEvent.test(event.type)) {
					return event.charCode != null
						? event.charCode
						: event.keyCode;
				}

				if (
					!event.which &&
					button !== undefined &&
					rmouseEvent.test(event.type)
				) {
					if (button & 1) {
						return 1;
					}

					if (button & 2) {
						return 3;
					}

					if (button & 4) {
						return 2;
					}

					return 0;
				}

				return event.which;
			}
		},
		jQuery.event.addProp
	);
	jQuery.each(
		{
			mouseenter: "mouseover",
			mouseleave: "mouseout",
			pointerenter: "pointerover",
			pointerleave: "pointerout"
		},
		function(orig, fix) {
			jQuery.event.special[orig] = {
				delegateType: fix,
				bindType: fix,
				handle: function handle(event) {
					var ret,
						target = this,
						related = event.relatedTarget,
						handleObj = event.handleObj;

					if (
						!related ||
						(related !== target &&
							!jQuery.contains(target, related))
					) {
						event.type = handleObj.origType;
						ret = handleObj.handler.apply(this, arguments);
						event.type = fix;
					}

					return ret;
				}
			};
		}
	);
	jQuery.fn.extend({
		on: function on(types, selector, data, fn) {
			return _on(this, types, selector, data, fn);
		},
		one: function one(types, selector, data, fn) {
			return _on(this, types, selector, data, fn, 1);
		},
		off: function off(types, selector, fn) {
			var handleObj, type;

			if (types && types.preventDefault && types.handleObj) {
				handleObj = types.handleObj;
				jQuery(types.delegateTarget).off(
					handleObj.namespace
						? handleObj.origType + "." + handleObj.namespace
						: handleObj.origType,
					handleObj.selector,
					handleObj.handler
				);
				return this;
			}

			if (_typeof(types) === "object") {
				for (type in types) {
					this.off(type, selector, types[type]);
				}

				return this;
			}

			if (selector === false || typeof selector === "function") {
				fn = selector;
				selector = undefined;
			}

			if (fn === false) {
				fn = returnFalse;
			}

			return this.each(function() {
				jQuery.event.remove(this, types, fn, selector);
			});
		}
	});
	var rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi,
		rnoInnerhtml = /<script|<style|<link/i,
		rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
		rscriptTypeMasked = /^true\/(.*)/,
		rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;

	function manipulationTarget(elem, content) {
		if (
			jQuery.nodeName(elem, "table") &&
			jQuery.nodeName(
				content.nodeType !== 11 ? content : content.firstChild,
				"tr"
			)
		) {
			return elem.getElementsByTagName("tbody")[0] || elem;
		}

		return elem;
	}

	function disableScript(elem) {
		elem.type = (elem.getAttribute("type") !== null) + "/" + elem.type;
		return elem;
	}

	function restoreScript(elem) {
		var match = rscriptTypeMasked.exec(elem.type);

		if (match) {
			elem.type = match[1];
		} else {
			elem.removeAttribute("type");
		}

		return elem;
	}

	function cloneCopyEvent(src, dest) {
		var i, l, type, pdataOld, pdataCur, udataOld, udataCur, events;

		if (dest.nodeType !== 1) {
			return;
		}

		if (dataPriv.hasData(src)) {
			pdataOld = dataPriv.access(src);
			pdataCur = dataPriv.set(dest, pdataOld);
			events = pdataOld.events;

			if (events) {
				delete pdataCur.handle;
				pdataCur.events = {};

				for (type in events) {
					for (i = 0, l = events[type].length; i < l; i++) {
						jQuery.event.add(dest, type, events[type][i]);
					}
				}
			}
		}

		if (dataUser.hasData(src)) {
			udataOld = dataUser.access(src);
			udataCur = jQuery.extend({}, udataOld);
			dataUser.set(dest, udataCur);
		}
	}

	function fixInput(src, dest) {
		var nodeName = dest.nodeName.toLowerCase();

		if (nodeName === "input" && rcheckableType.test(src.type)) {
			dest.checked = src.checked;
		} else if (nodeName === "input" || nodeName === "textarea") {
			dest.defaultValue = src.defaultValue;
		}
	}

	function domManip(collection, args, callback, ignored) {
		args = concat.apply([], args);
		var fragment,
			first,
			scripts,
			hasScripts,
			node,
			doc,
			i = 0,
			l = collection.length,
			iNoClone = l - 1,
			value = args[0],
			isFunction = jQuery.isFunction(value);

		if (
			isFunction ||
			(l > 1 &&
				typeof value === "string" &&
				!support.checkClone &&
				rchecked.test(value))
		) {
			return collection.each(function(index) {
				var self = collection.eq(index);

				if (isFunction) {
					args[0] = value.call(this, index, self.html());
				}

				domManip(self, args, callback, ignored);
			});
		}

		if (l) {
			fragment = buildFragment(
				args,
				collection[0].ownerDocument,
				false,
				collection,
				ignored
			);
			first = fragment.firstChild;

			if (fragment.childNodes.length === 1) {
				fragment = first;
			}

			if (first || ignored) {
				scripts = jQuery.map(getAll(fragment, "script"), disableScript);
				hasScripts = scripts.length;

				for (; i < l; i++) {
					node = fragment;

					if (i !== iNoClone) {
						node = jQuery.clone(node, true, true);

						if (hasScripts) {
							jQuery.merge(scripts, getAll(node, "script"));
						}
					}

					callback.call(collection[i], node, i);
				}

				if (hasScripts) {
					doc = scripts[scripts.length - 1].ownerDocument;
					jQuery.map(scripts, restoreScript);

					for (i = 0; i < hasScripts; i++) {
						node = scripts[i];

						if (
							rscriptType.test(node.type || "") &&
							!dataPriv.access(node, "globalEval") &&
							jQuery.contains(doc, node)
						) {
							if (node.src) {
								if (jQuery._evalUrl) {
									jQuery._evalUrl(node.src);
								}
							} else {
								DOMEval(
									node.textContent.replace(rcleanScript, ""),
									doc
								);
							}
						}
					}
				}
			}
		}

		return collection;
	}

	function _remove(elem, selector, keepData) {
		var node,
			nodes = selector ? jQuery.filter(selector, elem) : elem,
			i = 0;

		for (; (node = nodes[i]) != null; i++) {
			if (!keepData && node.nodeType === 1) {
				jQuery.cleanData(getAll(node));
			}

			if (node.parentNode) {
				if (keepData && jQuery.contains(node.ownerDocument, node)) {
					setGlobalEval(getAll(node, "script"));
				}

				node.parentNode.removeChild(node);
			}
		}

		return elem;
	}

	jQuery.extend({
		htmlPrefilter: function htmlPrefilter(html) {
			return html.replace(rxhtmlTag, "<$1></$2>");
		},
		clone: function clone(elem, dataAndEvents, deepDataAndEvents) {
			var i,
				l,
				srcElements,
				destElements,
				clone = elem.cloneNode(true),
				inPage = jQuery.contains(elem.ownerDocument, elem);

			if (
				!support.noCloneChecked &&
				(elem.nodeType === 1 || elem.nodeType === 11) &&
				!jQuery.isXMLDoc(elem)
			) {
				destElements = getAll(clone);
				srcElements = getAll(elem);

				for (i = 0, l = srcElements.length; i < l; i++) {
					fixInput(srcElements[i], destElements[i]);
				}
			}

			if (dataAndEvents) {
				if (deepDataAndEvents) {
					srcElements = srcElements || getAll(elem);
					destElements = destElements || getAll(clone);

					for (i = 0, l = srcElements.length; i < l; i++) {
						cloneCopyEvent(srcElements[i], destElements[i]);
					}
				} else {
					cloneCopyEvent(elem, clone);
				}
			}

			destElements = getAll(clone, "script");

			if (destElements.length > 0) {
				setGlobalEval(destElements, !inPage && getAll(elem, "script"));
			}

			return clone;
		},
		cleanData: function cleanData(elems) {
			var data,
				elem,
				type,
				special = jQuery.event.special,
				i = 0;

			for (; (elem = elems[i]) !== undefined; i++) {
				if (acceptData(elem)) {
					if ((data = elem[dataPriv.expando])) {
						if (data.events) {
							for (type in data.events) {
								if (special[type]) {
									jQuery.event.remove(elem, type);
								} else {
									jQuery.removeEvent(elem, type, data.handle);
								}
							}
						}

						elem[dataPriv.expando] = undefined;
					}

					if (elem[dataUser.expando]) {
						elem[dataUser.expando] = undefined;
					}
				}
			}
		}
	});
	jQuery.fn.extend({
		detach: function detach(selector) {
			return _remove(this, selector, true);
		},
		remove: function remove(selector) {
			return _remove(this, selector);
		},
		text: function text(value) {
			return access(
				this,
				function(value) {
					return value === undefined
						? jQuery.text(this)
						: this.empty().each(function() {
								if (
									this.nodeType === 1 ||
									this.nodeType === 11 ||
									this.nodeType === 9
								) {
									this.textContent = value;
								}
						  });
				},
				null,
				value,
				arguments.length
			);
		},
		append: function append() {
			return domManip(this, arguments, function(elem) {
				if (
					this.nodeType === 1 ||
					this.nodeType === 11 ||
					this.nodeType === 9
				) {
					var target = manipulationTarget(this, elem);
					target.appendChild(elem);
				}
			});
		},
		prepend: function prepend() {
			return domManip(this, arguments, function(elem) {
				if (
					this.nodeType === 1 ||
					this.nodeType === 11 ||
					this.nodeType === 9
				) {
					var target = manipulationTarget(this, elem);
					target.insertBefore(elem, target.firstChild);
				}
			});
		},
		before: function before() {
			return domManip(this, arguments, function(elem) {
				if (this.parentNode) {
					this.parentNode.insertBefore(elem, this);
				}
			});
		},
		after: function after() {
			return domManip(this, arguments, function(elem) {
				if (this.parentNode) {
					this.parentNode.insertBefore(elem, this.nextSibling);
				}
			});
		},
		empty: function empty() {
			var elem,
				i = 0;

			for (; (elem = this[i]) != null; i++) {
				if (elem.nodeType === 1) {
					jQuery.cleanData(getAll(elem, false));
					elem.textContent = "";
				}
			}

			return this;
		},
		clone: function clone(dataAndEvents, deepDataAndEvents) {
			dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
			deepDataAndEvents =
				deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;
			return this.map(function() {
				return jQuery.clone(this, dataAndEvents, deepDataAndEvents);
			});
		},
		html: function html(value) {
			return access(
				this,
				function(value) {
					var elem = this[0] || {},
						i = 0,
						l = this.length;

					if (value === undefined && elem.nodeType === 1) {
						return elem.innerHTML;
					}

					if (
						typeof value === "string" &&
						!rnoInnerhtml.test(value) &&
						!wrapMap[
							(rtagName.exec(value) || ["", ""])[1].toLowerCase()
						]
					) {
						value = jQuery.htmlPrefilter(value);

						try {
							for (; i < l; i++) {
								elem = this[i] || {};

								if (elem.nodeType === 1) {
									jQuery.cleanData(getAll(elem, false));
									elem.innerHTML = value;
								}
							}

							elem = 0;
						} catch (e) {}
					}

					if (elem) {
						this.empty().append(value);
					}
				},
				null,
				value,
				arguments.length
			);
		},
		replaceWith: function replaceWith() {
			var ignored = [];
			return domManip(
				this,
				arguments,
				function(elem) {
					var parent = this.parentNode;

					if (jQuery.inArray(this, ignored) < 0) {
						jQuery.cleanData(getAll(this));

						if (parent) {
							parent.replaceChild(elem, this);
						}
					}
				},
				ignored
			);
		}
	});
	jQuery.each(
		{
			appendTo: "append",
			prependTo: "prepend",
			insertBefore: "before",
			insertAfter: "after",
			replaceAll: "replaceWith"
		},
		function(name, original) {
			jQuery.fn[name] = function(selector) {
				var elems,
					ret = [],
					insert = jQuery(selector),
					last = insert.length - 1,
					i = 0;

				for (; i <= last; i++) {
					elems = i === last ? this : this.clone(true);
					jQuery(insert[i])[original](elems);
					push.apply(ret, elems.get());
				}

				return this.pushStack(ret);
			};
		}
	);
	var rmargin = /^margin/;
	var rnumnonpx = new RegExp("^(" + pnum + ")(?!px)[a-z%]+$", "i");

	var getStyles = function getStyles(elem) {
		var view = elem.ownerDocument.defaultView;

		if (!view || !view.opener) {
			view = window;
		}

		return view.getComputedStyle(elem);
	};

	(function() {
		function computeStyleTests() {
			if (!div) {
				return;
			}

			div.style.cssText =
				"box-sizing:border-box;" +
				"position:relative;display:block;" +
				"margin:auto;border:1px;padding:1px;" +
				"top:1%;width:50%";
			div.innerHTML = "";
			documentElement.appendChild(container);
			var divStyle = window.getComputedStyle(div);
			pixelPositionVal = divStyle.top !== "1%";
			reliableMarginLeftVal = divStyle.marginLeft === "2px";
			boxSizingReliableVal = divStyle.width === "4px";
			div.style.marginRight = "50%";
			pixelMarginRightVal = divStyle.marginRight === "4px";
			documentElement.removeChild(container);
			div = null;
		}

		var pixelPositionVal,
			boxSizingReliableVal,
			pixelMarginRightVal,
			reliableMarginLeftVal,
			container = document.createElement("div"),
			div = document.createElement("div");

		if (!div.style) {
			return;
		}

		div.style.backgroundClip = "content-box";
		div.cloneNode(true).style.backgroundClip = "";
		support.clearCloneStyle = div.style.backgroundClip === "content-box";
		container.style.cssText =
			"border:0;width:8px;height:0;top:0;left:-9999px;" +
			"padding:0;margin-top:1px;position:absolute";
		container.appendChild(div);
		jQuery.extend(support, {
			pixelPosition: function pixelPosition() {
				computeStyleTests();
				return pixelPositionVal;
			},
			boxSizingReliable: function boxSizingReliable() {
				computeStyleTests();
				return boxSizingReliableVal;
			},
			pixelMarginRight: function pixelMarginRight() {
				computeStyleTests();
				return pixelMarginRightVal;
			},
			reliableMarginLeft: function reliableMarginLeft() {
				computeStyleTests();
				return reliableMarginLeftVal;
			}
		});
	})();

	function curCSS(elem, name, computed) {
		var width,
			minWidth,
			maxWidth,
			ret,
			style = elem.style;
		computed = computed || getStyles(elem);

		if (computed) {
			ret = computed.getPropertyValue(name) || computed[name];

			if (ret === "" && !jQuery.contains(elem.ownerDocument, elem)) {
				ret = jQuery.style(elem, name);
			}

			if (
				!support.pixelMarginRight() &&
				rnumnonpx.test(ret) &&
				rmargin.test(name)
			) {
				width = style.width;
				minWidth = style.minWidth;
				maxWidth = style.maxWidth;
				style.minWidth = style.maxWidth = style.width = ret;
				ret = computed.width;
				style.width = width;
				style.minWidth = minWidth;
				style.maxWidth = maxWidth;
			}
		}

		return ret !== undefined ? ret + "" : ret;
	}

	function addGetHookIf(conditionFn, hookFn) {
		return {
			get: function get() {
				if (conditionFn()) {
					delete this.get;
					return;
				}

				return (this.get = hookFn).apply(this, arguments);
			}
		};
	}

	var rdisplayswap = /^(none|table(?!-c[ea]).+)/,
		cssShow = {
			position: "absolute",
			visibility: "hidden",
			display: "block"
		},
		cssNormalTransform = {
			letterSpacing: "0",
			fontWeight: "400"
		},
		cssPrefixes = ["Webkit", "Moz", "ms"],
		emptyStyle = document.createElement("div").style;

	function vendorPropName(name) {
		if (name in emptyStyle) {
			return name;
		}

		var capName = name[0].toUpperCase() + name.slice(1),
			i = cssPrefixes.length;

		while (i--) {
			name = cssPrefixes[i] + capName;

			if (name in emptyStyle) {
				return name;
			}
		}
	}

	function setPositiveNumber(elem, value, subtract) {
		var matches = rcssNum.exec(value);
		return matches
			? Math.max(0, matches[2] - (subtract || 0)) + (matches[3] || "px")
			: value;
	}

	function augmentWidthOrHeight(elem, name, extra, isBorderBox, styles) {
		var i,
			val = 0;

		if (extra === (isBorderBox ? "border" : "content")) {
			i = 4;
		} else {
			i = name === "width" ? 1 : 0;
		}

		for (; i < 4; i += 2) {
			if (extra === "margin") {
				val += jQuery.css(elem, extra + cssExpand[i], true, styles);
			}

			if (isBorderBox) {
				if (extra === "content") {
					val -= jQuery.css(
						elem,
						"padding" + cssExpand[i],
						true,
						styles
					);
				}

				if (extra !== "margin") {
					val -= jQuery.css(
						elem,
						"border" + cssExpand[i] + "Width",
						true,
						styles
					);
				}
			} else {
				val += jQuery.css(elem, "padding" + cssExpand[i], true, styles);

				if (extra !== "padding") {
					val += jQuery.css(
						elem,
						"border" + cssExpand[i] + "Width",
						true,
						styles
					);
				}
			}
		}

		return val;
	}

	function getWidthOrHeight(elem, name, extra) {
		var val,
			valueIsBorderBox = true,
			styles = getStyles(elem),
			isBorderBox =
				jQuery.css(elem, "boxSizing", false, styles) === "border-box";

		if (elem.getClientRects().length) {
			val = elem.getBoundingClientRect()[name];
		}

		if (val <= 0 || val == null) {
			val = curCSS(elem, name, styles);

			if (val < 0 || val == null) {
				val = elem.style[name];
			}

			if (rnumnonpx.test(val)) {
				return val;
			}

			valueIsBorderBox =
				isBorderBox &&
				(support.boxSizingReliable() || val === elem.style[name]);
			val = parseFloat(val) || 0;
		}

		return (
			val +
			augmentWidthOrHeight(
				elem,
				name,
				extra || (isBorderBox ? "border" : "content"),
				valueIsBorderBox,
				styles
			) +
			"px"
		);
	}

	jQuery.extend({
		cssHooks: {
			opacity: {
				get: function get(elem, computed) {
					if (computed) {
						var ret = curCSS(elem, "opacity");
						return ret === "" ? "1" : ret;
					}
				}
			}
		},
		cssNumber: {
			animationIterationCount: true,
			columnCount: true,
			fillOpacity: true,
			flexGrow: true,
			flexShrink: true,
			fontWeight: true,
			lineHeight: true,
			opacity: true,
			order: true,
			orphans: true,
			widows: true,
			zIndex: true,
			zoom: true
		},
		cssProps: {
			float: "cssFloat"
		},
		style: function style(elem, name, value, extra) {
			if (
				!elem ||
				elem.nodeType === 3 ||
				elem.nodeType === 8 ||
				!elem.style
			) {
				return;
			}

			var ret,
				type,
				hooks,
				origName = jQuery.camelCase(name),
				style = elem.style;
			name =
				jQuery.cssProps[origName] ||
				(jQuery.cssProps[origName] =
					vendorPropName(origName) || origName);
			hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName];

			if (value !== undefined) {
				type = _typeof(value);

				if (
					type === "string" &&
					(ret = rcssNum.exec(value)) &&
					ret[1]
				) {
					value = adjustCSS(elem, name, ret);
					type = "number";
				}

				if (value == null || value !== value) {
					return;
				}

				if (type === "number") {
					value +=
						(ret && ret[3]) ||
						(jQuery.cssNumber[origName] ? "" : "px");
				}

				if (
					!support.clearCloneStyle &&
					value === "" &&
					name.indexOf("background") === 0
				) {
					style[name] = "inherit";
				}

				if (
					!hooks ||
					!("set" in hooks) ||
					(value = hooks.set(elem, value, extra)) !== undefined
				) {
					style[name] = value;
				}
			} else {
				if (
					hooks &&
					"get" in hooks &&
					(ret = hooks.get(elem, false, extra)) !== undefined
				) {
					return ret;
				}

				return style[name];
			}
		},
		css: function css(elem, name, extra, styles) {
			var val,
				num,
				hooks,
				origName = jQuery.camelCase(name);
			name =
				jQuery.cssProps[origName] ||
				(jQuery.cssProps[origName] =
					vendorPropName(origName) || origName);
			hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName];

			if (hooks && "get" in hooks) {
				val = hooks.get(elem, true, extra);
			}

			if (val === undefined) {
				val = curCSS(elem, name, styles);
			}

			if (val === "normal" && name in cssNormalTransform) {
				val = cssNormalTransform[name];
			}

			if (extra === "" || extra) {
				num = parseFloat(val);
				return extra === true || isFinite(num) ? num || 0 : val;
			}

			return val;
		}
	});
	jQuery.each(["height", "width"], function(i, name) {
		jQuery.cssHooks[name] = {
			get: function get(elem, computed, extra) {
				if (computed) {
					return rdisplayswap.test(jQuery.css(elem, "display")) &&
						(!elem.getClientRects().length ||
							!elem.getBoundingClientRect().width)
						? swap(elem, cssShow, function() {
								return getWidthOrHeight(elem, name, extra);
						  })
						: getWidthOrHeight(elem, name, extra);
				}
			},
			set: function set(elem, value, extra) {
				var matches,
					styles = extra && getStyles(elem),
					subtract =
						extra &&
						augmentWidthOrHeight(
							elem,
							name,
							extra,
							jQuery.css(elem, "boxSizing", false, styles) ===
								"border-box",
							styles
						);

				if (
					subtract &&
					(matches = rcssNum.exec(value)) &&
					(matches[3] || "px") !== "px"
				) {
					elem.style[name] = value;
					value = jQuery.css(elem, name);
				}

				return setPositiveNumber(elem, value, subtract);
			}
		};
	});
	jQuery.cssHooks.marginLeft = addGetHookIf(
		support.reliableMarginLeft,
		function(elem, computed) {
			if (computed) {
				return (
					(parseFloat(curCSS(elem, "marginLeft")) ||
						elem.getBoundingClientRect().left -
							swap(
								elem,
								{
									marginLeft: 0
								},
								function() {
									return elem.getBoundingClientRect().left;
								}
							)) + "px"
				);
			}
		}
	);
	jQuery.each(
		{
			margin: "",
			padding: "",
			border: "Width"
		},
		function(prefix, suffix) {
			jQuery.cssHooks[prefix + suffix] = {
				expand: function expand(value) {
					var i = 0,
						expanded = {},
						parts =
							typeof value === "string"
								? value.split(" ")
								: [value];

					for (; i < 4; i++) {
						expanded[prefix + cssExpand[i] + suffix] =
							parts[i] || parts[i - 2] || parts[0];
					}

					return expanded;
				}
			};

			if (!rmargin.test(prefix)) {
				jQuery.cssHooks[prefix + suffix].set = setPositiveNumber;
			}
		}
	);
	jQuery.fn.extend({
		css: function css(name, value) {
			return access(
				this,
				function(elem, name, value) {
					var styles,
						len,
						map = {},
						i = 0;

					if (jQuery.isArray(name)) {
						styles = getStyles(elem);
						len = name.length;

						for (; i < len; i++) {
							map[name[i]] = jQuery.css(
								elem,
								name[i],
								false,
								styles
							);
						}

						return map;
					}

					return value !== undefined
						? jQuery.style(elem, name, value)
						: jQuery.css(elem, name);
				},
				name,
				value,
				arguments.length > 1
			);
		}
	});

	function Tween(elem, options, prop, end, easing) {
		return new Tween.prototype.init(elem, options, prop, end, easing);
	}

	jQuery.Tween = Tween;
	Tween.prototype = {
		constructor: Tween,
		init: function init(elem, options, prop, end, easing, unit) {
			this.elem = elem;
			this.prop = prop;
			this.easing = easing || jQuery.easing._default;
			this.options = options;
			this.start = this.now = this.cur();
			this.end = end;
			this.unit = unit || (jQuery.cssNumber[prop] ? "" : "px");
		},
		cur: function cur() {
			var hooks = Tween.propHooks[this.prop];
			return hooks && hooks.get
				? hooks.get(this)
				: Tween.propHooks._default.get(this);
		},
		run: function run(percent) {
			var eased,
				hooks = Tween.propHooks[this.prop];

			if (this.options.duration) {
				this.pos = eased = jQuery.easing[this.easing](
					percent,
					this.options.duration * percent,
					0,
					1,
					this.options.duration
				);
			} else {
				this.pos = eased = percent;
			}

			this.now = (this.end - this.start) * eased + this.start;

			if (this.options.step) {
				this.options.step.call(this.elem, this.now, this);
			}

			if (hooks && hooks.set) {
				hooks.set(this);
			} else {
				Tween.propHooks._default.set(this);
			}

			return this;
		}
	};
	Tween.prototype.init.prototype = Tween.prototype;
	Tween.propHooks = {
		_default: {
			get: function get(tween) {
				var result;

				if (
					tween.elem.nodeType !== 1 ||
					(tween.elem[tween.prop] != null &&
						tween.elem.style[tween.prop] == null)
				) {
					return tween.elem[tween.prop];
				}

				result = jQuery.css(tween.elem, tween.prop, "");
				return !result || result === "auto" ? 0 : result;
			},
			set: function set(tween) {
				if (jQuery.fx.step[tween.prop]) {
					jQuery.fx.step[tween.prop](tween);
				} else if (
					tween.elem.nodeType === 1 &&
					(tween.elem.style[jQuery.cssProps[tween.prop]] != null ||
						jQuery.cssHooks[tween.prop])
				) {
					jQuery.style(
						tween.elem,
						tween.prop,
						tween.now + tween.unit
					);
				} else {
					tween.elem[tween.prop] = tween.now;
				}
			}
		}
	};
	Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
		set: function set(tween) {
			if (tween.elem.nodeType && tween.elem.parentNode) {
				tween.elem[tween.prop] = tween.now;
			}
		}
	};
	jQuery.easing = {
		linear: function linear(p) {
			return p;
		},
		swing: function swing(p) {
			return 0.5 - Math.cos(p * Math.PI) / 2;
		},
		_default: "swing"
	};
	jQuery.fx = Tween.prototype.init;
	jQuery.fx.step = {};
	var fxNow,
		timerId,
		rfxtypes = /^(?:toggle|show|hide)$/,
		rrun = /queueHooks$/;

	function raf() {
		if (timerId) {
			window.requestAnimationFrame(raf);
			jQuery.fx.tick();
		}
	}

	function createFxNow() {
		window.setTimeout(function() {
			fxNow = undefined;
		});
		return (fxNow = jQuery.now());
	}

	function genFx(type, includeWidth) {
		var which,
			i = 0,
			attrs = {
				height: type
			};
		includeWidth = includeWidth ? 1 : 0;

		for (; i < 4; i += 2 - includeWidth) {
			which = cssExpand[i];
			attrs["margin" + which] = attrs["padding" + which] = type;
		}

		if (includeWidth) {
			attrs.opacity = attrs.width = type;
		}

		return attrs;
	}

	function createTween(value, prop, animation) {
		var tween,
			collection = (Animation.tweeners[prop] || []).concat(
				Animation.tweeners["*"]
			),
			index = 0,
			length = collection.length;

		for (; index < length; index++) {
			if ((tween = collection[index].call(animation, prop, value))) {
				return tween;
			}
		}
	}

	function defaultPrefilter(elem, props, opts) {
		var prop,
			value,
			toggle,
			hooks,
			oldfire,
			propTween,
			restoreDisplay,
			display,
			isBox = "width" in props || "height" in props,
			anim = this,
			orig = {},
			style = elem.style,
			hidden = elem.nodeType && isHiddenWithinTree(elem),
			dataShow = dataPriv.get(elem, "fxshow");

		if (!opts.queue) {
			hooks = jQuery._queueHooks(elem, "fx");

			if (hooks.unqueued == null) {
				hooks.unqueued = 0;
				oldfire = hooks.empty.fire;

				hooks.empty.fire = function() {
					if (!hooks.unqueued) {
						oldfire();
					}
				};
			}

			hooks.unqueued++;
			anim.always(function() {
				anim.always(function() {
					hooks.unqueued--;

					if (!jQuery.queue(elem, "fx").length) {
						hooks.empty.fire();
					}
				});
			});
		}

		for (prop in props) {
			value = props[prop];

			if (rfxtypes.test(value)) {
				delete props[prop];
				toggle = toggle || value === "toggle";

				if (value === (hidden ? "hide" : "show")) {
					if (
						value === "show" &&
						dataShow &&
						dataShow[prop] !== undefined
					) {
						hidden = true;
					} else {
						continue;
					}
				}

				orig[prop] =
					(dataShow && dataShow[prop]) || jQuery.style(elem, prop);
			}
		}

		propTween = !jQuery.isEmptyObject(props);

		if (!propTween && jQuery.isEmptyObject(orig)) {
			return;
		}

		if (isBox && elem.nodeType === 1) {
			opts.overflow = [style.overflow, style.overflowX, style.overflowY];
			restoreDisplay = dataShow && dataShow.display;

			if (restoreDisplay == null) {
				restoreDisplay = dataPriv.get(elem, "display");
			}

			display = jQuery.css(elem, "display");

			if (display === "none") {
				if (restoreDisplay) {
					display = restoreDisplay;
				} else {
					showHide([elem], true);
					restoreDisplay = elem.style.display || restoreDisplay;
					display = jQuery.css(elem, "display");
					showHide([elem]);
				}
			}

			if (
				display === "inline" ||
				(display === "inline-block" && restoreDisplay != null)
			) {
				if (jQuery.css(elem, "float") === "none") {
					if (!propTween) {
						anim.done(function() {
							style.display = restoreDisplay;
						});

						if (restoreDisplay == null) {
							display = style.display;
							restoreDisplay = display === "none" ? "" : display;
						}
					}

					style.display = "inline-block";
				}
			}
		}

		if (opts.overflow) {
			style.overflow = "hidden";
			anim.always(function() {
				style.overflow = opts.overflow[0];
				style.overflowX = opts.overflow[1];
				style.overflowY = opts.overflow[2];
			});
		}

		propTween = false;

		for (prop in orig) {
			if (!propTween) {
				if (dataShow) {
					if ("hidden" in dataShow) {
						hidden = dataShow.hidden;
					}
				} else {
					dataShow = dataPriv.access(elem, "fxshow", {
						display: restoreDisplay
					});
				}

				if (toggle) {
					dataShow.hidden = !hidden;
				}

				if (hidden) {
					showHide([elem], true);
				}

				anim.done(function() {
					if (!hidden) {
						showHide([elem]);
					}

					dataPriv.remove(elem, "fxshow");

					for (prop in orig) {
						jQuery.style(elem, prop, orig[prop]);
					}
				});
			}

			propTween = createTween(hidden ? dataShow[prop] : 0, prop, anim);

			if (!(prop in dataShow)) {
				dataShow[prop] = propTween.start;

				if (hidden) {
					propTween.end = propTween.start;
					propTween.start = 0;
				}
			}
		}
	}

	function propFilter(props, specialEasing) {
		var index, name, easing, value, hooks;

		for (index in props) {
			name = jQuery.camelCase(index);
			easing = specialEasing[name];
			value = props[index];

			if (jQuery.isArray(value)) {
				easing = value[1];
				value = props[index] = value[0];
			}

			if (index !== name) {
				props[name] = value;
				delete props[index];
			}

			hooks = jQuery.cssHooks[name];

			if (hooks && "expand" in hooks) {
				value = hooks.expand(value);
				delete props[name];

				for (index in value) {
					if (!(index in props)) {
						props[index] = value[index];
						specialEasing[index] = easing;
					}
				}
			} else {
				specialEasing[name] = easing;
			}
		}
	}

	function Animation(elem, properties, options) {
		var result,
			stopped,
			index = 0,
			length = Animation.prefilters.length,
			deferred = jQuery.Deferred().always(function() {
				delete tick.elem;
			}),
			tick = function tick() {
				if (stopped) {
					return false;
				}

				var currentTime = fxNow || createFxNow(),
					remaining = Math.max(
						0,
						animation.startTime + animation.duration - currentTime
					),
					temp = remaining / animation.duration || 0,
					percent = 1 - temp,
					index = 0,
					length = animation.tweens.length;

				for (; index < length; index++) {
					animation.tweens[index].run(percent);
				}

				deferred.notifyWith(elem, [animation, percent, remaining]);

				if (percent < 1 && length) {
					return remaining;
				} else {
					deferred.resolveWith(elem, [animation]);
					return false;
				}
			},
			animation = deferred.promise({
				elem: elem,
				props: jQuery.extend({}, properties),
				opts: jQuery.extend(
					true,
					{
						specialEasing: {},
						easing: jQuery.easing._default
					},
					options
				),
				originalProperties: properties,
				originalOptions: options,
				startTime: fxNow || createFxNow(),
				duration: options.duration,
				tweens: [],
				createTween: function createTween(prop, end) {
					var tween = jQuery.Tween(
						elem,
						animation.opts,
						prop,
						end,
						animation.opts.specialEasing[prop] ||
							animation.opts.easing
					);
					animation.tweens.push(tween);
					return tween;
				},
				stop: function stop(gotoEnd) {
					var index = 0,
						length = gotoEnd ? animation.tweens.length : 0;

					if (stopped) {
						return this;
					}

					stopped = true;

					for (; index < length; index++) {
						animation.tweens[index].run(1);
					}

					if (gotoEnd) {
						deferred.notifyWith(elem, [animation, 1, 0]);
						deferred.resolveWith(elem, [animation, gotoEnd]);
					} else {
						deferred.rejectWith(elem, [animation, gotoEnd]);
					}

					return this;
				}
			}),
			props = animation.props;

		propFilter(props, animation.opts.specialEasing);

		for (; index < length; index++) {
			result = Animation.prefilters[index].call(
				animation,
				elem,
				props,
				animation.opts
			);

			if (result) {
				if (jQuery.isFunction(result.stop)) {
					jQuery._queueHooks(
						animation.elem,
						animation.opts.queue
					).stop = jQuery.proxy(result.stop, result);
				}

				return result;
			}
		}

		jQuery.map(props, createTween, animation);

		if (jQuery.isFunction(animation.opts.start)) {
			animation.opts.start.call(elem, animation);
		}

		jQuery.fx.timer(
			jQuery.extend(tick, {
				elem: elem,
				anim: animation,
				queue: animation.opts.queue
			})
		);
		return animation
			.progress(animation.opts.progress)
			.done(animation.opts.done, animation.opts.complete)
			.fail(animation.opts.fail)
			.always(animation.opts.always);
	}

	jQuery.Animation = jQuery.extend(Animation, {
		tweeners: {
			"*": [
				function(prop, value) {
					var tween = this.createTween(prop, value);
					adjustCSS(tween.elem, prop, rcssNum.exec(value), tween);
					return tween;
				}
			]
		},
		tweener: function tweener(props, callback) {
			if (jQuery.isFunction(props)) {
				callback = props;
				props = ["*"];
			} else {
				props = props.match(rnothtmlwhite);
			}

			var prop,
				index = 0,
				length = props.length;

			for (; index < length; index++) {
				prop = props[index];
				Animation.tweeners[prop] = Animation.tweeners[prop] || [];
				Animation.tweeners[prop].unshift(callback);
			}
		},
		prefilters: [defaultPrefilter],
		prefilter: function prefilter(callback, prepend) {
			if (prepend) {
				Animation.prefilters.unshift(callback);
			} else {
				Animation.prefilters.push(callback);
			}
		}
	});

	jQuery.speed = function(speed, easing, fn) {
		var opt =
			speed && _typeof(speed) === "object"
				? jQuery.extend({}, speed)
				: {
						complete:
							fn ||
							(!fn && easing) ||
							(jQuery.isFunction(speed) && speed),
						duration: speed,
						easing:
							(fn && easing) ||
							(easing && !jQuery.isFunction(easing) && easing)
				  };

		if (jQuery.fx.off || document.hidden) {
			opt.duration = 0;
		} else {
			if (typeof opt.duration !== "number") {
				if (opt.duration in jQuery.fx.speeds) {
					opt.duration = jQuery.fx.speeds[opt.duration];
				} else {
					opt.duration = jQuery.fx.speeds._default;
				}
			}
		}

		if (opt.queue == null || opt.queue === true) {
			opt.queue = "fx";
		}

		opt.old = opt.complete;

		opt.complete = function() {
			if (jQuery.isFunction(opt.old)) {
				opt.old.call(this);
			}

			if (opt.queue) {
				jQuery.dequeue(this, opt.queue);
			}
		};

		return opt;
	};

	jQuery.fn.extend({
		fadeTo: function fadeTo(speed, to, easing, callback) {
			return this.filter(isHiddenWithinTree)
				.css("opacity", 0)
				.show()
				.end()
				.animate(
					{
						opacity: to
					},
					speed,
					easing,
					callback
				);
		},
		animate: function animate(prop, speed, easing, callback) {
			var empty = jQuery.isEmptyObject(prop),
				optall = jQuery.speed(speed, easing, callback),
				doAnimation = function doAnimation() {
					var anim = Animation(this, jQuery.extend({}, prop), optall);

					if (empty || dataPriv.get(this, "finish")) {
						anim.stop(true);
					}
				};

			doAnimation.finish = doAnimation;
			return empty || optall.queue === false
				? this.each(doAnimation)
				: this.queue(optall.queue, doAnimation);
		},
		stop: function stop(type, clearQueue, gotoEnd) {
			var stopQueue = function stopQueue(hooks) {
				var stop = hooks.stop;
				delete hooks.stop;
				stop(gotoEnd);
			};

			if (typeof type !== "string") {
				gotoEnd = clearQueue;
				clearQueue = type;
				type = undefined;
			}

			if (clearQueue && type !== false) {
				this.queue(type || "fx", []);
			}

			return this.each(function() {
				var dequeue = true,
					index = type != null && type + "queueHooks",
					timers = jQuery.timers,
					data = dataPriv.get(this);

				if (index) {
					if (data[index] && data[index].stop) {
						stopQueue(data[index]);
					}
				} else {
					for (index in data) {
						if (
							data[index] &&
							data[index].stop &&
							rrun.test(index)
						) {
							stopQueue(data[index]);
						}
					}
				}

				for (index = timers.length; index--; ) {
					if (
						timers[index].elem === this &&
						(type == null || timers[index].queue === type)
					) {
						timers[index].anim.stop(gotoEnd);
						dequeue = false;
						timers.splice(index, 1);
					}
				}

				if (dequeue || !gotoEnd) {
					jQuery.dequeue(this, type);
				}
			});
		},
		finish: function finish(type) {
			if (type !== false) {
				type = type || "fx";
			}

			return this.each(function() {
				var index,
					data = dataPriv.get(this),
					queue = data[type + "queue"],
					hooks = data[type + "queueHooks"],
					timers = jQuery.timers,
					length = queue ? queue.length : 0;
				data.finish = true;
				jQuery.queue(this, type, []);

				if (hooks && hooks.stop) {
					hooks.stop.call(this, true);
				}

				for (index = timers.length; index--; ) {
					if (
						timers[index].elem === this &&
						timers[index].queue === type
					) {
						timers[index].anim.stop(true);
						timers.splice(index, 1);
					}
				}

				for (index = 0; index < length; index++) {
					if (queue[index] && queue[index].finish) {
						queue[index].finish.call(this);
					}
				}

				delete data.finish;
			});
		}
	});
	jQuery.each(["toggle", "show", "hide"], function(i, name) {
		var cssFn = jQuery.fn[name];

		jQuery.fn[name] = function(speed, easing, callback) {
			return speed == null || typeof speed === "boolean"
				? cssFn.apply(this, arguments)
				: this.animate(genFx(name, true), speed, easing, callback);
		};
	});
	jQuery.each(
		{
			slideDown: genFx("show"),
			slideUp: genFx("hide"),
			slideToggle: genFx("toggle"),
			fadeIn: {
				opacity: "show"
			},
			fadeOut: {
				opacity: "hide"
			},
			fadeToggle: {
				opacity: "toggle"
			}
		},
		function(name, props) {
			jQuery.fn[name] = function(speed, easing, callback) {
				return this.animate(props, speed, easing, callback);
			};
		}
	);
	jQuery.timers = [];

	jQuery.fx.tick = function() {
		var timer,
			i = 0,
			timers = jQuery.timers;
		fxNow = jQuery.now();

		for (; i < timers.length; i++) {
			timer = timers[i];

			if (!timer() && timers[i] === timer) {
				timers.splice(i--, 1);
			}
		}

		if (!timers.length) {
			jQuery.fx.stop();
		}

		fxNow = undefined;
	};

	jQuery.fx.timer = function(timer) {
		jQuery.timers.push(timer);

		if (timer()) {
			jQuery.fx.start();
		} else {
			jQuery.timers.pop();
		}
	};

	jQuery.fx.interval = 13;

	jQuery.fx.start = function() {
		if (!timerId) {
			timerId = window.requestAnimationFrame
				? window.requestAnimationFrame(raf)
				: window.setInterval(jQuery.fx.tick, jQuery.fx.interval);
		}
	};

	jQuery.fx.stop = function() {
		if (window.cancelAnimationFrame) {
			window.cancelAnimationFrame(timerId);
		} else {
			window.clearInterval(timerId);
		}

		timerId = null;
	};

	jQuery.fx.speeds = {
		slow: 600,
		fast: 200,
		_default: 400
	};

	jQuery.fn.delay = function(time, type) {
		time = jQuery.fx ? jQuery.fx.speeds[time] || time : time;
		type = type || "fx";
		return this.queue(type, function(next, hooks) {
			var timeout = window.setTimeout(next, time);

			hooks.stop = function() {
				window.clearTimeout(timeout);
			};
		});
	};

	(function() {
		var input = document.createElement("input"),
			select = document.createElement("select"),
			opt = select.appendChild(document.createElement("option"));
		input.type = "checkbox";
		support.checkOn = input.value !== "";
		support.optSelected = opt.selected;
		input = document.createElement("input");
		input.value = "t";
		input.type = "radio";
		support.radioValue = input.value === "t";
	})();

	var boolHook,
		attrHandle = jQuery.expr.attrHandle;
	jQuery.fn.extend({
		attr: function attr(name, value) {
			return access(this, jQuery.attr, name, value, arguments.length > 1);
		},
		removeAttr: function removeAttr(name) {
			return this.each(function() {
				jQuery.removeAttr(this, name);
			});
		}
	});
	jQuery.extend({
		attr: function attr(elem, name, value) {
			var ret,
				hooks,
				nType = elem.nodeType;

			if (nType === 3 || nType === 8 || nType === 2) {
				return;
			}

			if (typeof elem.getAttribute === "undefined") {
				return jQuery.prop(elem, name, value);
			}

			if (nType !== 1 || !jQuery.isXMLDoc(elem)) {
				hooks =
					jQuery.attrHooks[name.toLowerCase()] ||
					(jQuery.expr.match.bool.test(name) ? boolHook : undefined);
			}

			if (value !== undefined) {
				if (value === null) {
					jQuery.removeAttr(elem, name);
					return;
				}

				if (
					hooks &&
					"set" in hooks &&
					(ret = hooks.set(elem, value, name)) !== undefined
				) {
					return ret;
				}

				elem.setAttribute(name, value + "");
				return value;
			}

			if (
				hooks &&
				"get" in hooks &&
				(ret = hooks.get(elem, name)) !== null
			) {
				return ret;
			}

			ret = jQuery.find.attr(elem, name);
			return ret == null ? undefined : ret;
		},
		attrHooks: {
			type: {
				set: function set(elem, value) {
					if (
						!support.radioValue &&
						value === "radio" &&
						jQuery.nodeName(elem, "input")
					) {
						var val = elem.value;
						elem.setAttribute("type", value);

						if (val) {
							elem.value = val;
						}

						return value;
					}
				}
			}
		},
		removeAttr: function removeAttr(elem, value) {
			var name,
				i = 0,
				attrNames = value && value.match(rnothtmlwhite);

			if (attrNames && elem.nodeType === 1) {
				while ((name = attrNames[i++])) {
					elem.removeAttribute(name);
				}
			}
		}
	});
	boolHook = {
		set: function set(elem, value, name) {
			if (value === false) {
				jQuery.removeAttr(elem, name);
			} else {
				elem.setAttribute(name, name);
			}

			return name;
		}
	};
	jQuery.each(jQuery.expr.match.bool.source.match(/\w+/g), function(i, name) {
		var getter = attrHandle[name] || jQuery.find.attr;

		attrHandle[name] = function(elem, name, isXML) {
			var ret,
				handle,
				lowercaseName = name.toLowerCase();

			if (!isXML) {
				handle = attrHandle[lowercaseName];
				attrHandle[lowercaseName] = ret;
				ret = getter(elem, name, isXML) != null ? lowercaseName : null;
				attrHandle[lowercaseName] = handle;
			}

			return ret;
		};
	});
	var rfocusable = /^(?:input|select|textarea|button)$/i,
		rclickable = /^(?:a|area)$/i;
	jQuery.fn.extend({
		prop: function prop(name, value) {
			return access(this, jQuery.prop, name, value, arguments.length > 1);
		},
		removeProp: function removeProp(name) {
			return this.each(function() {
				delete this[jQuery.propFix[name] || name];
			});
		}
	});
	jQuery.extend({
		prop: function prop(elem, name, value) {
			var ret,
				hooks,
				nType = elem.nodeType;

			if (nType === 3 || nType === 8 || nType === 2) {
				return;
			}

			if (nType !== 1 || !jQuery.isXMLDoc(elem)) {
				name = jQuery.propFix[name] || name;
				hooks = jQuery.propHooks[name];
			}

			if (value !== undefined) {
				if (
					hooks &&
					"set" in hooks &&
					(ret = hooks.set(elem, value, name)) !== undefined
				) {
					return ret;
				}

				return (elem[name] = value);
			}

			if (
				hooks &&
				"get" in hooks &&
				(ret = hooks.get(elem, name)) !== null
			) {
				return ret;
			}

			return elem[name];
		},
		propHooks: {
			tabIndex: {
				get: function get(elem) {
					var tabindex = jQuery.find.attr(elem, "tabindex");

					if (tabindex) {
						return parseInt(tabindex, 10);
					}

					if (
						rfocusable.test(elem.nodeName) ||
						(rclickable.test(elem.nodeName) && elem.href)
					) {
						return 0;
					}

					return -1;
				}
			}
		},
		propFix: {
			for: "htmlFor",
			class: "className"
		}
	});

	if (!support.optSelected) {
		jQuery.propHooks.selected = {
			get: function get(elem) {
				var parent = elem.parentNode;

				if (parent && parent.parentNode) {
					parent.parentNode.selectedIndex;
				}

				return null;
			},
			set: function set(elem) {
				var parent = elem.parentNode;

				if (parent) {
					parent.selectedIndex;

					if (parent.parentNode) {
						parent.parentNode.selectedIndex;
					}
				}
			}
		};
	}

	jQuery.each(
		[
			"tabIndex",
			"readOnly",
			"maxLength",
			"cellSpacing",
			"cellPadding",
			"rowSpan",
			"colSpan",
			"useMap",
			"frameBorder",
			"contentEditable"
		],
		function() {
			jQuery.propFix[this.toLowerCase()] = this;
		}
	);

	function stripAndCollapse(value) {
		var tokens = value.match(rnothtmlwhite) || [];
		return tokens.join(" ");
	}

	function getClass(elem) {
		return (elem.getAttribute && elem.getAttribute("class")) || "";
	}

	jQuery.fn.extend({
		addClass: function addClass(value) {
			var classes,
				elem,
				cur,
				curValue,
				clazz,
				j,
				finalValue,
				i = 0;

			if (jQuery.isFunction(value)) {
				return this.each(function(j) {
					jQuery(this).addClass(value.call(this, j, getClass(this)));
				});
			}

			if (typeof value === "string" && value) {
				classes = value.match(rnothtmlwhite) || [];

				while ((elem = this[i++])) {
					curValue = getClass(elem);
					cur =
						elem.nodeType === 1 &&
						" " + stripAndCollapse(curValue) + " ";

					if (cur) {
						j = 0;

						while ((clazz = classes[j++])) {
							if (cur.indexOf(" " + clazz + " ") < 0) {
								cur += clazz + " ";
							}
						}

						finalValue = stripAndCollapse(cur);

						if (curValue !== finalValue) {
							elem.setAttribute("class", finalValue);
						}
					}
				}
			}

			return this;
		},
		removeClass: function removeClass(value) {
			var classes,
				elem,
				cur,
				curValue,
				clazz,
				j,
				finalValue,
				i = 0;

			if (jQuery.isFunction(value)) {
				return this.each(function(j) {
					jQuery(this).removeClass(
						value.call(this, j, getClass(this))
					);
				});
			}

			if (!arguments.length) {
				return this.attr("class", "");
			}

			if (typeof value === "string" && value) {
				classes = value.match(rnothtmlwhite) || [];

				while ((elem = this[i++])) {
					curValue = getClass(elem);
					cur =
						elem.nodeType === 1 &&
						" " + stripAndCollapse(curValue) + " ";

					if (cur) {
						j = 0;

						while ((clazz = classes[j++])) {
							while (cur.indexOf(" " + clazz + " ") > -1) {
								cur = cur.replace(" " + clazz + " ", " ");
							}
						}

						finalValue = stripAndCollapse(cur);

						if (curValue !== finalValue) {
							elem.setAttribute("class", finalValue);
						}
					}
				}
			}

			return this;
		},
		toggleClass: function toggleClass(value, stateVal) {
			var type = _typeof(value);

			if (typeof stateVal === "boolean" && type === "string") {
				return stateVal
					? this.addClass(value)
					: this.removeClass(value);
			}

			if (jQuery.isFunction(value)) {
				return this.each(function(i) {
					jQuery(this).toggleClass(
						value.call(this, i, getClass(this), stateVal),
						stateVal
					);
				});
			}

			return this.each(function() {
				var className, i, self, classNames;

				if (type === "string") {
					i = 0;
					self = jQuery(this);
					classNames = value.match(rnothtmlwhite) || [];

					while ((className = classNames[i++])) {
						if (self.hasClass(className)) {
							self.removeClass(className);
						} else {
							self.addClass(className);
						}
					}
				} else if (value === undefined || type === "boolean") {
					className = getClass(this);

					if (className) {
						dataPriv.set(this, "__className__", className);
					}

					if (this.setAttribute) {
						this.setAttribute(
							"class",
							className || value === false
								? ""
								: dataPriv.get(this, "__className__") || ""
						);
					}
				}
			});
		},
		hasClass: function hasClass(selector) {
			var className,
				elem,
				i = 0;
			className = " " + selector + " ";

			while ((elem = this[i++])) {
				if (
					elem.nodeType === 1 &&
					(" " + stripAndCollapse(getClass(elem)) + " ").indexOf(
						className
					) > -1
				) {
					return true;
				}
			}

			return false;
		}
	});
	var rreturn = /\r/g;
	jQuery.fn.extend({
		val: function val(value) {
			var hooks,
				ret,
				isFunction,
				elem = this[0];

			if (!arguments.length) {
				if (elem) {
					hooks =
						jQuery.valHooks[elem.type] ||
						jQuery.valHooks[elem.nodeName.toLowerCase()];

					if (
						hooks &&
						"get" in hooks &&
						(ret = hooks.get(elem, "value")) !== undefined
					) {
						return ret;
					}

					ret = elem.value;

					if (typeof ret === "string") {
						return ret.replace(rreturn, "");
					}

					return ret == null ? "" : ret;
				}

				return;
			}

			isFunction = jQuery.isFunction(value);
			return this.each(function(i) {
				var val;

				if (this.nodeType !== 1) {
					return;
				}

				if (isFunction) {
					val = value.call(this, i, jQuery(this).val());
				} else {
					val = value;
				}

				if (val == null) {
					val = "";
				} else if (typeof val === "number") {
					val += "";
				} else if (jQuery.isArray(val)) {
					val = jQuery.map(val, function(value) {
						return value == null ? "" : value + "";
					});
				}

				hooks =
					jQuery.valHooks[this.type] ||
					jQuery.valHooks[this.nodeName.toLowerCase()];

				if (
					!hooks ||
					!("set" in hooks) ||
					hooks.set(this, val, "value") === undefined
				) {
					this.value = val;
				}
			});
		}
	});
	jQuery.extend({
		valHooks: {
			option: {
				get: function get(elem) {
					var val = jQuery.find.attr(elem, "value");
					return val != null
						? val
						: stripAndCollapse(jQuery.text(elem));
				}
			},
			select: {
				get: function get(elem) {
					var value,
						option,
						i,
						options = elem.options,
						index = elem.selectedIndex,
						one = elem.type === "select-one",
						values = one ? null : [],
						max = one ? index + 1 : options.length;

					if (index < 0) {
						i = max;
					} else {
						i = one ? index : 0;
					}

					for (; i < max; i++) {
						option = options[i];

						if (
							(option.selected || i === index) &&
							!option.disabled &&
							(!option.parentNode.disabled ||
								!jQuery.nodeName(option.parentNode, "optgroup"))
						) {
							value = jQuery(option).val();

							if (one) {
								return value;
							}

							values.push(value);
						}
					}

					return values;
				},
				set: function set(elem, value) {
					var optionSet,
						option,
						options = elem.options,
						values = jQuery.makeArray(value),
						i = options.length;

					while (i--) {
						option = options[i];

						if (
							(option.selected =
								jQuery.inArray(
									jQuery.valHooks.option.get(option),
									values
								) > -1)
						) {
							optionSet = true;
						}
					}

					if (!optionSet) {
						elem.selectedIndex = -1;
					}

					return values;
				}
			}
		}
	});
	jQuery.each(["radio", "checkbox"], function() {
		jQuery.valHooks[this] = {
			set: function set(elem, value) {
				if (jQuery.isArray(value)) {
					return (elem.checked =
						jQuery.inArray(jQuery(elem).val(), value) > -1);
				}
			}
		};

		if (!support.checkOn) {
			jQuery.valHooks[this].get = function(elem) {
				return elem.getAttribute("value") === null ? "on" : elem.value;
			};
		}
	});
	var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/;
	jQuery.extend(jQuery.event, {
		trigger: function trigger(event, data, elem, onlyHandlers) {
			var i,
				cur,
				tmp,
				bubbleType,
				ontype,
				handle,
				special,
				eventPath = [elem || document],
				type = hasOwn.call(event, "type") ? event.type : event,
				namespaces = hasOwn.call(event, "namespace")
					? event.namespace.split(".")
					: [];
			cur = tmp = elem = elem || document;

			if (elem.nodeType === 3 || elem.nodeType === 8) {
				return;
			}

			if (rfocusMorph.test(type + jQuery.event.triggered)) {
				return;
			}

			if (type.indexOf(".") > -1) {
				namespaces = type.split(".");
				type = namespaces.shift();
				namespaces.sort();
			}

			ontype = type.indexOf(":") < 0 && "on" + type;
			event = event[jQuery.expando]
				? event
				: new jQuery.Event(type, _typeof(event) === "object" && event);
			event.isTrigger = onlyHandlers ? 2 : 3;
			event.namespace = namespaces.join(".");
			event.rnamespace = event.namespace
				? new RegExp(
						"(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)"
				  )
				: null;
			event.result = undefined;

			if (!event.target) {
				event.target = elem;
			}

			data = data == null ? [event] : jQuery.makeArray(data, [event]);
			special = jQuery.event.special[type] || {};

			if (
				!onlyHandlers &&
				special.trigger &&
				special.trigger.apply(elem, data) === false
			) {
				return;
			}

			if (!onlyHandlers && !special.noBubble && !jQuery.isWindow(elem)) {
				bubbleType = special.delegateType || type;

				if (!rfocusMorph.test(bubbleType + type)) {
					cur = cur.parentNode;
				}

				for (; cur; cur = cur.parentNode) {
					eventPath.push(cur);
					tmp = cur;
				}

				if (tmp === (elem.ownerDocument || document)) {
					eventPath.push(
						tmp.defaultView || tmp.parentWindow || window
					);
				}
			}

			i = 0;

			while ((cur = eventPath[i++]) && !event.isPropagationStopped()) {
				event.type = i > 1 ? bubbleType : special.bindType || type;
				handle =
					(dataPriv.get(cur, "events") || {})[event.type] &&
					dataPriv.get(cur, "handle");

				if (handle) {
					handle.apply(cur, data);
				}

				handle = ontype && cur[ontype];

				if (handle && handle.apply && acceptData(cur)) {
					event.result = handle.apply(cur, data);

					if (event.result === false) {
						event.preventDefault();
					}
				}
			}

			event.type = type;

			if (!onlyHandlers && !event.isDefaultPrevented()) {
				if (
					(!special._default ||
						special._default.apply(eventPath.pop(), data) ===
							false) &&
					acceptData(elem)
				) {
					if (
						ontype &&
						jQuery.isFunction(elem[type]) &&
						!jQuery.isWindow(elem)
					) {
						tmp = elem[ontype];

						if (tmp) {
							elem[ontype] = null;
						}

						jQuery.event.triggered = type;
						elem[type]();
						jQuery.event.triggered = undefined;

						if (tmp) {
							elem[ontype] = tmp;
						}
					}
				}
			}

			return event.result;
		},
		simulate: function simulate(type, elem, event) {
			var e = jQuery.extend(new jQuery.Event(), event, {
				type: type,
				isSimulated: true
			});
			jQuery.event.trigger(e, null, elem);
		}
	});
	jQuery.fn.extend({
		trigger: function trigger(type, data) {
			return this.each(function() {
				jQuery.event.trigger(type, data, this);
			});
		},
		triggerHandler: function triggerHandler(type, data) {
			var elem = this[0];

			if (elem) {
				return jQuery.event.trigger(type, data, elem, true);
			}
		}
	});
	jQuery.each(
		(
			"blur focus focusin focusout resize scroll click dblclick " +
			"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
			"change select submit keydown keypress keyup contextmenu"
		).split(" "),
		function(i, name) {
			jQuery.fn[name] = function(data, fn) {
				return arguments.length > 0
					? this.on(name, null, data, fn)
					: this.trigger(name);
			};
		}
	);
	jQuery.fn.extend({
		hover: function hover(fnOver, fnOut) {
			return this.mouseenter(fnOver).mouseleave(fnOut || fnOver);
		}
	});
	support.focusin = "onfocusin" in window;

	if (!support.focusin) {
		jQuery.each(
			{
				focus: "focusin",
				blur: "focusout"
			},
			function(orig, fix) {
				var handler = function handler(event) {
					jQuery.event.simulate(
						fix,
						event.target,
						jQuery.event.fix(event)
					);
				};

				jQuery.event.special[fix] = {
					setup: function setup() {
						var doc = this.ownerDocument || this,
							attaches = dataPriv.access(doc, fix);

						if (!attaches) {
							doc.addEventListener(orig, handler, true);
						}

						dataPriv.access(doc, fix, (attaches || 0) + 1);
					},
					teardown: function teardown() {
						var doc = this.ownerDocument || this,
							attaches = dataPriv.access(doc, fix) - 1;

						if (!attaches) {
							doc.removeEventListener(orig, handler, true);
							dataPriv.remove(doc, fix);
						} else {
							dataPriv.access(doc, fix, attaches);
						}
					}
				};
			}
		);
	}

	var location = window.location;
	var nonce = jQuery.now();
	var rquery = /\?/;

	jQuery.parseXML = function(data) {
		var xml;

		if (!data || typeof data !== "string") {
			return null;
		}

		try {
			xml = new window.DOMParser().parseFromString(data, "text/xml");
		} catch (e) {
			xml = undefined;
		}

		if (!xml || xml.getElementsByTagName("parsererror").length) {
			jQuery.error("Invalid XML: " + data);
		}

		return xml;
	};

	var rbracket = /\[\]$/,
		rCRLF = /\r?\n/g,
		rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
		rsubmittable = /^(?:input|select|textarea|keygen)/i;

	function buildParams(prefix, obj, traditional, add) {
		var name;

		if (jQuery.isArray(obj)) {
			jQuery.each(obj, function(i, v) {
				if (traditional || rbracket.test(prefix)) {
					add(prefix, v);
				} else {
					buildParams(
						prefix +
							"[" +
							(_typeof(v) === "object" && v != null ? i : "") +
							"]",
						v,
						traditional,
						add
					);
				}
			});
		} else if (!traditional && jQuery.type(obj) === "object") {
			for (name in obj) {
				buildParams(
					prefix + "[" + name + "]",
					obj[name],
					traditional,
					add
				);
			}
		} else {
			add(prefix, obj);
		}
	}

	jQuery.param = function(a, traditional) {
		var prefix,
			s = [],
			add = function add(key, valueOrFunction) {
				var value = jQuery.isFunction(valueOrFunction)
					? valueOrFunction()
					: valueOrFunction;
				s[s.length] =
					encodeURIComponent(key) +
					"=" +
					encodeURIComponent(value == null ? "" : value);
			};

		if (jQuery.isArray(a) || (a.jquery && !jQuery.isPlainObject(a))) {
			jQuery.each(a, function() {
				add(this.name, this.value);
			});
		} else {
			for (prefix in a) {
				buildParams(prefix, a[prefix], traditional, add);
			}
		}

		return s.join("&");
	};

	jQuery.fn.extend({
		serialize: function serialize() {
			return jQuery.param(this.serializeArray());
		},
		serializeArray: function serializeArray() {
			return this.map(function() {
				var elements = jQuery.prop(this, "elements");
				return elements ? jQuery.makeArray(elements) : this;
			})
				.filter(function() {
					var type = this.type;
					return (
						this.name &&
						!jQuery(this).is(":disabled") &&
						rsubmittable.test(this.nodeName) &&
						!rsubmitterTypes.test(type) &&
						(this.checked || !rcheckableType.test(type))
					);
				})
				.map(function(i, elem) {
					var val = jQuery(this).val();

					if (val == null) {
						return null;
					}

					if (jQuery.isArray(val)) {
						return jQuery.map(val, function(val) {
							return {
								name: elem.name,
								value: val.replace(rCRLF, "\r\n")
							};
						});
					}

					return {
						name: elem.name,
						value: val.replace(rCRLF, "\r\n")
					};
				})
				.get();
		}
	});
	var r20 = /%20/g,
		rhash = /#.*$/,
		rantiCache = /([?&])_=[^&]*/,
		rheaders = /^(.*?):[ \t]*([^\r\n]*)$/gm,
		rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
		rnoContent = /^(?:GET|HEAD)$/,
		rprotocol = /^\/\//,
		prefilters = {},
		transports = {},
		allTypes = "*/".concat("*"),
		originAnchor = document.createElement("a");
	originAnchor.href = location.href;

	function addToPrefiltersOrTransports(structure) {
		return function(dataTypeExpression, func) {
			if (typeof dataTypeExpression !== "string") {
				func = dataTypeExpression;
				dataTypeExpression = "*";
			}

			var dataType,
				i = 0,
				dataTypes =
					dataTypeExpression.toLowerCase().match(rnothtmlwhite) || [];

			if (jQuery.isFunction(func)) {
				while ((dataType = dataTypes[i++])) {
					if (dataType[0] === "+") {
						dataType = dataType.slice(1) || "*";
						(structure[dataType] =
							structure[dataType] || []).unshift(func);
					} else {
						(structure[dataType] = structure[dataType] || []).push(
							func
						);
					}
				}
			}
		};
	}

	function inspectPrefiltersOrTransports(
		structure,
		options,
		originalOptions,
		jqXHR
	) {
		var inspected = {},
			seekingTransport = structure === transports;

		function inspect(dataType) {
			var selected;
			inspected[dataType] = true;
			jQuery.each(structure[dataType] || [], function(
				_,
				prefilterOrFactory
			) {
				var dataTypeOrTransport = prefilterOrFactory(
					options,
					originalOptions,
					jqXHR
				);

				if (
					typeof dataTypeOrTransport === "string" &&
					!seekingTransport &&
					!inspected[dataTypeOrTransport]
				) {
					options.dataTypes.unshift(dataTypeOrTransport);
					inspect(dataTypeOrTransport);
					return false;
				} else if (seekingTransport) {
					return !(selected = dataTypeOrTransport);
				}
			});
			return selected;
		}

		return (
			inspect(options.dataTypes[0]) || (!inspected["*"] && inspect("*"))
		);
	}

	function ajaxExtend(target, src) {
		var key,
			deep,
			flatOptions = jQuery.ajaxSettings.flatOptions || {};

		for (key in src) {
			if (src[key] !== undefined) {
				(flatOptions[key] ? target : deep || (deep = {}))[key] =
					src[key];
			}
		}

		if (deep) {
			jQuery.extend(true, target, deep);
		}

		return target;
	}

	function ajaxHandleResponses(s, jqXHR, responses) {
		var ct,
			type,
			finalDataType,
			firstDataType,
			contents = s.contents,
			dataTypes = s.dataTypes;

		while (dataTypes[0] === "*") {
			dataTypes.shift();

			if (ct === undefined) {
				ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
			}
		}

		if (ct) {
			for (type in contents) {
				if (contents[type] && contents[type].test(ct)) {
					dataTypes.unshift(type);
					break;
				}
			}
		}

		if (dataTypes[0] in responses) {
			finalDataType = dataTypes[0];
		} else {
			for (type in responses) {
				if (!dataTypes[0] || s.converters[type + " " + dataTypes[0]]) {
					finalDataType = type;
					break;
				}

				if (!firstDataType) {
					firstDataType = type;
				}
			}

			finalDataType = finalDataType || firstDataType;
		}

		if (finalDataType) {
			if (finalDataType !== dataTypes[0]) {
				dataTypes.unshift(finalDataType);
			}

			return responses[finalDataType];
		}
	}

	function ajaxConvert(s, response, jqXHR, isSuccess) {
		var conv2,
			current,
			conv,
			tmp,
			prev,
			converters = {},
			dataTypes = s.dataTypes.slice();

		if (dataTypes[1]) {
			for (conv in s.converters) {
				converters[conv.toLowerCase()] = s.converters[conv];
			}
		}

		current = dataTypes.shift();

		while (current) {
			if (s.responseFields[current]) {
				jqXHR[s.responseFields[current]] = response;
			}

			if (!prev && isSuccess && s.dataFilter) {
				response = s.dataFilter(response, s.dataType);
			}

			prev = current;
			current = dataTypes.shift();

			if (current) {
				if (current === "*") {
					current = prev;
				} else if (prev !== "*" && prev !== current) {
					conv =
						converters[prev + " " + current] ||
						converters["* " + current];

					if (!conv) {
						for (conv2 in converters) {
							tmp = conv2.split(" ");

							if (tmp[1] === current) {
								conv =
									converters[prev + " " + tmp[0]] ||
									converters["* " + tmp[0]];

								if (conv) {
									if (conv === true) {
										conv = converters[conv2];
									} else if (converters[conv2] !== true) {
										current = tmp[0];
										dataTypes.unshift(tmp[1]);
									}

									break;
								}
							}
						}
					}

					if (conv !== true) {
						if (conv && s.throws) {
							response = conv(response);
						} else {
							try {
								response = conv(response);
							} catch (e) {
								return {
									state: "parsererror",
									error: conv
										? e
										: "No conversion from " +
										  prev +
										  " to " +
										  current
								};
							}
						}
					}
				}
			}
		}

		return {
			state: "success",
			data: response
		};
	}

	jQuery.extend({
		active: 0,
		lastModified: {},
		etag: {},
		ajaxSettings: {
			url: location.href,
			type: "GET",
			isLocal: rlocalProtocol.test(location.protocol),
			global: true,
			processData: true,
			async: true,
			contentType: "application/x-www-form-urlencoded; charset=UTF-8",
			accepts: {
				"*": allTypes,
				text: "text/plain",
				html: "text/html",
				xml: "application/xml, text/xml",
				json: "application/json, text/javascript"
			},
			contents: {
				xml: /\bxml\b/,
				html: /\bhtml/,
				json: /\bjson\b/
			},
			responseFields: {
				xml: "responseXML",
				text: "responseText",
				json: "responseJSON"
			},
			converters: {
				"* text": String,
				"text html": true,
				"text json": JSON.parse,
				"text xml": jQuery.parseXML
			},
			flatOptions: {
				url: true,
				context: true
			}
		},
		ajaxSetup: function ajaxSetup(target, settings) {
			return settings
				? ajaxExtend(ajaxExtend(target, jQuery.ajaxSettings), settings)
				: ajaxExtend(jQuery.ajaxSettings, target);
		},
		ajaxPrefilter: addToPrefiltersOrTransports(prefilters),
		ajaxTransport: addToPrefiltersOrTransports(transports),
		ajax: function ajax(url, options) {
			if (_typeof(url) === "object") {
				options = url;
				url = undefined;
			}

			options = options || {};

			var transport,
				cacheURL,
				responseHeadersString,
				responseHeaders,
				timeoutTimer,
				urlAnchor,
				completed,
				fireGlobals,
				i,
				uncached,
				s = jQuery.ajaxSetup({}, options),
				callbackContext = s.context || s,
				globalEventContext =
					s.context &&
					(callbackContext.nodeType || callbackContext.jquery)
						? jQuery(callbackContext)
						: jQuery.event,
				deferred = jQuery.Deferred(),
				completeDeferred = jQuery.Callbacks("once memory"),
				_statusCode = s.statusCode || {},
				requestHeaders = {},
				requestHeadersNames = {},
				strAbort = "canceled",
				jqXHR = {
					readyState: 0,
					getResponseHeader: function getResponseHeader(key) {
						var match;

						if (completed) {
							if (!responseHeaders) {
								responseHeaders = {};

								while (
									(match = rheaders.exec(
										responseHeadersString
									))
								) {
									responseHeaders[match[1].toLowerCase()] =
										match[2];
								}
							}

							match = responseHeaders[key.toLowerCase()];
						}

						return match == null ? null : match;
					},
					getAllResponseHeaders: function getAllResponseHeaders() {
						return completed ? responseHeadersString : null;
					},
					setRequestHeader: function setRequestHeader(name, value) {
						if (completed == null) {
							name = requestHeadersNames[name.toLowerCase()] =
								requestHeadersNames[name.toLowerCase()] || name;
							requestHeaders[name] = value;
						}

						return this;
					},
					overrideMimeType: function overrideMimeType(type) {
						if (completed == null) {
							s.mimeType = type;
						}

						return this;
					},
					statusCode: function statusCode(map) {
						var code;

						if (map) {
							if (completed) {
								jqXHR.always(map[jqXHR.status]);
							} else {
								for (code in map) {
									_statusCode[code] = [
										_statusCode[code],
										map[code]
									];
								}
							}
						}

						return this;
					},
					abort: function abort(statusText) {
						var finalText = statusText || strAbort;

						if (transport) {
							transport.abort(finalText);
						}

						done(0, finalText);
						return this;
					}
				};

			deferred.promise(jqXHR);
			s.url = ((url || s.url || location.href) + "").replace(
				rprotocol,
				location.protocol + "//"
			);
			s.type = options.method || options.type || s.method || s.type;
			s.dataTypes = (s.dataType || "*")
				.toLowerCase()
				.match(rnothtmlwhite) || [""];

			if (s.crossDomain == null) {
				urlAnchor = document.createElement("a");

				try {
					urlAnchor.href = s.url;
					urlAnchor.href = urlAnchor.href;
					s.crossDomain =
						originAnchor.protocol + "//" + originAnchor.host !==
						urlAnchor.protocol + "//" + urlAnchor.host;
				} catch (e) {
					s.crossDomain = true;
				}
			}

			if (s.data && s.processData && typeof s.data !== "string") {
				s.data = jQuery.param(s.data, s.traditional);
			}

			inspectPrefiltersOrTransports(prefilters, s, options, jqXHR);

			if (completed) {
				return jqXHR;
			}

			fireGlobals = jQuery.event && s.global;

			if (fireGlobals && jQuery.active++ === 0) {
				jQuery.event.trigger("ajaxStart");
			}

			s.type = s.type.toUpperCase();
			s.hasContent = !rnoContent.test(s.type);
			cacheURL = s.url.replace(rhash, "");

			if (!s.hasContent) {
				uncached = s.url.slice(cacheURL.length);

				if (s.data) {
					cacheURL += (rquery.test(cacheURL) ? "&" : "?") + s.data;
					delete s.data;
				}

				if (s.cache === false) {
					cacheURL = cacheURL.replace(rantiCache, "$1");
					uncached =
						(rquery.test(cacheURL) ? "&" : "?") +
						"_=" +
						nonce++ +
						uncached;
				}

				s.url = cacheURL + uncached;
			} else if (
				s.data &&
				s.processData &&
				(s.contentType || "").indexOf(
					"application/x-www-form-urlencoded"
				) === 0
			) {
				s.data = s.data.replace(r20, "+");
			}

			if (s.ifModified) {
				if (jQuery.lastModified[cacheURL]) {
					jqXHR.setRequestHeader(
						"If-Modified-Since",
						jQuery.lastModified[cacheURL]
					);
				}

				if (jQuery.etag[cacheURL]) {
					jqXHR.setRequestHeader(
						"If-None-Match",
						jQuery.etag[cacheURL]
					);
				}
			}

			if (
				(s.data && s.hasContent && s.contentType !== false) ||
				options.contentType
			) {
				jqXHR.setRequestHeader("Content-Type", s.contentType);
			}

			jqXHR.setRequestHeader(
				"Accept",
				s.dataTypes[0] && s.accepts[s.dataTypes[0]]
					? s.accepts[s.dataTypes[0]] +
							(s.dataTypes[0] !== "*"
								? ", " + allTypes + "; q=0.01"
								: "")
					: s.accepts["*"]
			);

			for (i in s.headers) {
				jqXHR.setRequestHeader(i, s.headers[i]);
			}

			if (
				s.beforeSend &&
				(s.beforeSend.call(callbackContext, jqXHR, s) === false ||
					completed)
			) {
				return jqXHR.abort();
			}

			strAbort = "abort";
			completeDeferred.add(s.complete);
			jqXHR.done(s.success);
			jqXHR.fail(s.error);
			transport = inspectPrefiltersOrTransports(
				transports,
				s,
				options,
				jqXHR
			);

			if (!transport) {
				done(-1, "No Transport");
			} else {
				jqXHR.readyState = 1;

				if (fireGlobals) {
					globalEventContext.trigger("ajaxSend", [jqXHR, s]);
				}

				if (completed) {
					return jqXHR;
				}

				if (s.async && s.timeout > 0) {
					timeoutTimer = window.setTimeout(function() {
						jqXHR.abort("timeout");
					}, s.timeout);
				}

				try {
					completed = false;
					transport.send(requestHeaders, done);
				} catch (e) {
					if (completed) {
						throw e;
					}

					done(-1, e);
				}
			}

			function done(status, nativeStatusText, responses, headers) {
				var isSuccess,
					success,
					error,
					response,
					modified,
					statusText = nativeStatusText;

				if (completed) {
					return;
				}

				completed = true;

				if (timeoutTimer) {
					window.clearTimeout(timeoutTimer);
				}

				transport = undefined;
				responseHeadersString = headers || "";
				jqXHR.readyState = status > 0 ? 4 : 0;
				isSuccess = (status >= 200 && status < 300) || status === 304;

				if (responses) {
					response = ajaxHandleResponses(s, jqXHR, responses);
				}

				response = ajaxConvert(s, response, jqXHR, isSuccess);

				if (isSuccess) {
					if (s.ifModified) {
						modified = jqXHR.getResponseHeader("Last-Modified");

						if (modified) {
							jQuery.lastModified[cacheURL] = modified;
						}

						modified = jqXHR.getResponseHeader("etag");

						if (modified) {
							jQuery.etag[cacheURL] = modified;
						}
					}

					if (status === 204 || s.type === "HEAD") {
						statusText = "nocontent";
					} else if (status === 304) {
						statusText = "notmodified";
					} else {
						statusText = response.state;
						success = response.data;
						error = response.error;
						isSuccess = !error;
					}
				} else {
					error = statusText;

					if (status || !statusText) {
						statusText = "error";

						if (status < 0) {
							status = 0;
						}
					}
				}

				jqXHR.status = status;
				jqXHR.statusText = (nativeStatusText || statusText) + "";

				if (isSuccess) {
					deferred.resolveWith(callbackContext, [
						success,
						statusText,
						jqXHR
					]);
				} else {
					deferred.rejectWith(callbackContext, [
						jqXHR,
						statusText,
						error
					]);
				}

				jqXHR.statusCode(_statusCode);
				_statusCode = undefined;

				if (fireGlobals) {
					globalEventContext.trigger(
						isSuccess ? "ajaxSuccess" : "ajaxError",
						[jqXHR, s, isSuccess ? success : error]
					);
				}

				completeDeferred.fireWith(callbackContext, [jqXHR, statusText]);

				if (fireGlobals) {
					globalEventContext.trigger("ajaxComplete", [jqXHR, s]);

					if (!--jQuery.active) {
						jQuery.event.trigger("ajaxStop");
					}
				}
			}

			return jqXHR;
		},
		getJSON: function getJSON(url, data, callback) {
			return jQuery.get(url, data, callback, "json");
		},
		getScript: function getScript(url, callback) {
			return jQuery.get(url, undefined, callback, "script");
		}
	});
	jQuery.each(["get", "post"], function(i, method) {
		jQuery[method] = function(url, data, callback, type) {
			if (jQuery.isFunction(data)) {
				type = type || callback;
				callback = data;
				data = undefined;
			}

			return jQuery.ajax(
				jQuery.extend(
					{
						url: url,
						type: method,
						dataType: type,
						data: data,
						success: callback
					},
					jQuery.isPlainObject(url) && url
				)
			);
		};
	});

	jQuery._evalUrl = function(url) {
		return jQuery.ajax({
			url: url,
			type: "GET",
			dataType: "script",
			cache: true,
			async: false,
			global: false,
			throws: true
		});
	};

	jQuery.fn.extend({
		wrapAll: function wrapAll(html) {
			var wrap;

			if (this[0]) {
				if (jQuery.isFunction(html)) {
					html = html.call(this[0]);
				}

				wrap = jQuery(html, this[0].ownerDocument)
					.eq(0)
					.clone(true);

				if (this[0].parentNode) {
					wrap.insertBefore(this[0]);
				}

				wrap.map(function() {
					var elem = this;

					while (elem.firstElementChild) {
						elem = elem.firstElementChild;
					}

					return elem;
				}).append(this);
			}

			return this;
		},
		wrapInner: function wrapInner(html) {
			if (jQuery.isFunction(html)) {
				return this.each(function(i) {
					jQuery(this).wrapInner(html.call(this, i));
				});
			}

			return this.each(function() {
				var self = jQuery(this),
					contents = self.contents();

				if (contents.length) {
					contents.wrapAll(html);
				} else {
					self.append(html);
				}
			});
		},
		wrap: function wrap(html) {
			var isFunction = jQuery.isFunction(html);
			return this.each(function(i) {
				jQuery(this).wrapAll(isFunction ? html.call(this, i) : html);
			});
		},
		unwrap: function unwrap(selector) {
			this.parent(selector)
				.not("body")
				.each(function() {
					jQuery(this).replaceWith(this.childNodes);
				});
			return this;
		}
	});

	jQuery.expr.pseudos.hidden = function(elem) {
		return !jQuery.expr.pseudos.visible(elem);
	};

	jQuery.expr.pseudos.visible = function(elem) {
		return !!(
			elem.offsetWidth ||
			elem.offsetHeight ||
			elem.getClientRects().length
		);
	};

	jQuery.ajaxSettings.xhr = function() {
		try {
			return new window.XMLHttpRequest();
		} catch (e) {}
	};

	var xhrSuccessStatus = {
			0: 200,
			1223: 204
		},
		xhrSupported = jQuery.ajaxSettings.xhr();
	support.cors = !!xhrSupported && "withCredentials" in xhrSupported;
	support.ajax = xhrSupported = !!xhrSupported;
	jQuery.ajaxTransport(function(options) {
		var _callback, errorCallback;

		if (support.cors || (xhrSupported && !options.crossDomain)) {
			return {
				send: function send(headers, complete) {
					var i,
						xhr = options.xhr();
					xhr.open(
						options.type,
						options.url,
						options.async,
						options.username,
						options.password
					);

					if (options.xhrFields) {
						for (i in options.xhrFields) {
							xhr[i] = options.xhrFields[i];
						}
					}

					if (options.mimeType && xhr.overrideMimeType) {
						xhr.overrideMimeType(options.mimeType);
					}

					if (!options.crossDomain && !headers["X-Requested-With"]) {
						headers["X-Requested-With"] = "XMLHttpRequest";
					}

					for (i in headers) {
						xhr.setRequestHeader(i, headers[i]);
					}

					_callback = function callback(type) {
						return function() {
							if (_callback) {
								_callback = errorCallback = xhr.onload = xhr.onerror = xhr.onabort = xhr.onreadystatechange = null;

								if (type === "abort") {
									xhr.abort();
								} else if (type === "error") {
									if (typeof xhr.status !== "number") {
										complete(0, "error");
									} else {
										complete(xhr.status, xhr.statusText);
									}
								} else {
									complete(
										xhrSuccessStatus[xhr.status] ||
											xhr.status,
										xhr.statusText,
										(xhr.responseType || "text") !==
											"text" ||
											typeof xhr.responseText !== "string"
											? {
													binary: xhr.response
											  }
											: {
													text: xhr.responseText
											  },
										xhr.getAllResponseHeaders()
									);
								}
							}
						};
					};

					xhr.onload = _callback();
					errorCallback = xhr.onerror = _callback("error");

					if (xhr.onabort !== undefined) {
						xhr.onabort = errorCallback;
					} else {
						xhr.onreadystatechange = function() {
							if (xhr.readyState === 4) {
								window.setTimeout(function() {
									if (_callback) {
										errorCallback();
									}
								});
							}
						};
					}

					_callback = _callback("abort");

					try {
						xhr.send((options.hasContent && options.data) || null);
					} catch (e) {
						if (_callback) {
							throw e;
						}
					}
				},
				abort: function abort() {
					if (_callback) {
						_callback();
					}
				}
			};
		}
	});
	jQuery.ajaxPrefilter(function(s) {
		if (s.crossDomain) {
			s.contents.script = false;
		}
	});
	jQuery.ajaxSetup({
		accepts: {
			script:
				"text/javascript, application/javascript, " +
				"application/ecmascript, application/x-ecmascript"
		},
		contents: {
			script: /\b(?:java|ecma)script\b/
		},
		converters: {
			"text script": function textScript(text) {
				jQuery.globalEval(text);
				return text;
			}
		}
	});
	jQuery.ajaxPrefilter("script", function(s) {
		if (s.cache === undefined) {
			s.cache = false;
		}

		if (s.crossDomain) {
			s.type = "GET";
		}
	});
	jQuery.ajaxTransport("script", function(s) {
		if (s.crossDomain) {
			var script, _callback2;

			return {
				send: function send(_, complete) {
					script = jQuery("<script>")
						.prop({
							charset: s.scriptCharset,
							src: s.url
						})
						.on(
							"load error",
							(_callback2 = function callback(evt) {
								script.remove();
								_callback2 = null;

								if (evt) {
									complete(
										evt.type === "error" ? 404 : 200,
										evt.type
									);
								}
							})
						);
					document.head.appendChild(script[0]);
				},
				abort: function abort() {
					if (_callback2) {
						_callback2();
					}
				}
			};
		}
	});
	var oldCallbacks = [],
		rjsonp = /(=)\?(?=&|$)|\?\?/;
	jQuery.ajaxSetup({
		jsonp: "callback",
		jsonpCallback: function jsonpCallback() {
			var callback = oldCallbacks.pop() || jQuery.expando + "_" + nonce++;
			this[callback] = true;
			return callback;
		}
	});
	jQuery.ajaxPrefilter("json jsonp", function(s, originalSettings, jqXHR) {
		var callbackName,
			overwritten,
			responseContainer,
			jsonProp =
				s.jsonp !== false &&
				(rjsonp.test(s.url)
					? "url"
					: typeof s.data === "string" &&
					  (s.contentType || "").indexOf(
							"application/x-www-form-urlencoded"
					  ) === 0 &&
					  rjsonp.test(s.data) &&
					  "data");

		if (jsonProp || s.dataTypes[0] === "jsonp") {
			callbackName = s.jsonpCallback = jQuery.isFunction(s.jsonpCallback)
				? s.jsonpCallback()
				: s.jsonpCallback;

			if (jsonProp) {
				s[jsonProp] = s[jsonProp].replace(rjsonp, "$1" + callbackName);
			} else if (s.jsonp !== false) {
				s.url +=
					(rquery.test(s.url) ? "&" : "?") +
					s.jsonp +
					"=" +
					callbackName;
			}

			s.converters["script json"] = function() {
				if (!responseContainer) {
					jQuery.error(callbackName + " was not called");
				}

				return responseContainer[0];
			};

			s.dataTypes[0] = "json";
			overwritten = window[callbackName];

			window[callbackName] = function() {
				responseContainer = arguments;
			};

			jqXHR.always(function() {
				if (overwritten === undefined) {
					jQuery(window).removeProp(callbackName);
				} else {
					window[callbackName] = overwritten;
				}

				if (s[callbackName]) {
					s.jsonpCallback = originalSettings.jsonpCallback;
					oldCallbacks.push(callbackName);
				}

				if (responseContainer && jQuery.isFunction(overwritten)) {
					overwritten(responseContainer[0]);
				}

				responseContainer = overwritten = undefined;
			});
			return "script";
		}
	});

	support.createHTMLDocument = (function() {
		var body = document.implementation.createHTMLDocument("").body;
		body.innerHTML = "<form></form><form></form>";
		return body.childNodes.length === 2;
	})();

	jQuery.parseHTML = function(data, context, keepScripts) {
		if (typeof data !== "string") {
			return [];
		}

		if (typeof context === "boolean") {
			keepScripts = context;
			context = false;
		}

		var base, parsed, scripts;

		if (!context) {
			if (support.createHTMLDocument) {
				context = document.implementation.createHTMLDocument("");
				base = context.createElement("base");
				base.href = document.location.href;
				context.head.appendChild(base);
			} else {
				context = document;
			}
		}

		parsed = rsingleTag.exec(data);
		scripts = !keepScripts && [];

		if (parsed) {
			return [context.createElement(parsed[1])];
		}

		parsed = buildFragment([data], context, scripts);

		if (scripts && scripts.length) {
			jQuery(scripts).remove();
		}

		return jQuery.merge([], parsed.childNodes);
	};

	jQuery.fn.load = function(url, params, callback) {
		var selector,
			type,
			response,
			self = this,
			off = url.indexOf(" ");

		if (off > -1) {
			selector = stripAndCollapse(url.slice(off));
			url = url.slice(0, off);
		}

		if (jQuery.isFunction(params)) {
			callback = params;
			params = undefined;
		} else if (params && _typeof(params) === "object") {
			type = "POST";
		}

		if (self.length > 0) {
			jQuery
				.ajax({
					url: url,
					type: type || "GET",
					dataType: "html",
					data: params
				})
				.done(function(responseText) {
					response = arguments;
					self.html(
						selector
							? jQuery("<div>")
									.append(jQuery.parseHTML(responseText))
									.find(selector)
							: responseText
					);
				})
				.always(
					callback &&
						function(jqXHR, status) {
							self.each(function() {
								callback.apply(
									this,
									response || [
										jqXHR.responseText,
										status,
										jqXHR
									]
								);
							});
						}
				);
		}

		return this;
	};

	jQuery.each(
		[
			"ajaxStart",
			"ajaxStop",
			"ajaxComplete",
			"ajaxError",
			"ajaxSuccess",
			"ajaxSend"
		],
		function(i, type) {
			jQuery.fn[type] = function(fn) {
				return this.on(type, fn);
			};
		}
	);

	jQuery.expr.pseudos.animated = function(elem) {
		return jQuery.grep(jQuery.timers, function(fn) {
			return elem === fn.elem;
		}).length;
	};

	function getWindow(elem) {
		return jQuery.isWindow(elem)
			? elem
			: elem.nodeType === 9 && elem.defaultView;
	}

	jQuery.offset = {
		setOffset: function setOffset(elem, options, i) {
			var curPosition,
				curLeft,
				curCSSTop,
				curTop,
				curOffset,
				curCSSLeft,
				calculatePosition,
				position = jQuery.css(elem, "position"),
				curElem = jQuery(elem),
				props = {};

			if (position === "static") {
				elem.style.position = "relative";
			}

			curOffset = curElem.offset();
			curCSSTop = jQuery.css(elem, "top");
			curCSSLeft = jQuery.css(elem, "left");
			calculatePosition =
				(position === "absolute" || position === "fixed") &&
				(curCSSTop + curCSSLeft).indexOf("auto") > -1;

			if (calculatePosition) {
				curPosition = curElem.position();
				curTop = curPosition.top;
				curLeft = curPosition.left;
			} else {
				curTop = parseFloat(curCSSTop) || 0;
				curLeft = parseFloat(curCSSLeft) || 0;
			}

			if (jQuery.isFunction(options)) {
				options = options.call(elem, i, jQuery.extend({}, curOffset));
			}

			if (options.top != null) {
				props.top = options.top - curOffset.top + curTop;
			}

			if (options.left != null) {
				props.left = options.left - curOffset.left + curLeft;
			}

			if ("using" in options) {
				options.using.call(elem, props);
			} else {
				curElem.css(props);
			}
		}
	};
	jQuery.fn.extend({
		offset: function offset(options) {
			if (arguments.length) {
				return options === undefined
					? this
					: this.each(function(i) {
							jQuery.offset.setOffset(this, options, i);
					  });
			}

			var docElem,
				win,
				rect,
				doc,
				elem = this[0];

			if (!elem) {
				return;
			}

			if (!elem.getClientRects().length) {
				return {
					top: 0,
					left: 0
				};
			}

			rect = elem.getBoundingClientRect();

			if (rect.width || rect.height) {
				doc = elem.ownerDocument;
				win = getWindow(doc);
				docElem = doc.documentElement;
				return {
					top: rect.top + win.pageYOffset - docElem.clientTop,
					left: rect.left + win.pageXOffset - docElem.clientLeft
				};
			}

			return rect;
		},
		position: function position() {
			if (!this[0]) {
				return;
			}

			var offsetParent,
				offset,
				elem = this[0],
				parentOffset = {
					top: 0,
					left: 0
				};

			if (jQuery.css(elem, "position") === "fixed") {
				offset = elem.getBoundingClientRect();
			} else {
				offsetParent = this.offsetParent();
				offset = this.offset();

				if (!jQuery.nodeName(offsetParent[0], "html")) {
					parentOffset = offsetParent.offset();
				}

				parentOffset = {
					top:
						parentOffset.top +
						jQuery.css(offsetParent[0], "borderTopWidth", true),
					left:
						parentOffset.left +
						jQuery.css(offsetParent[0], "borderLeftWidth", true)
				};
			}

			return {
				top:
					offset.top -
					parentOffset.top -
					jQuery.css(elem, "marginTop", true),
				left:
					offset.left -
					parentOffset.left -
					jQuery.css(elem, "marginLeft", true)
			};
		},
		offsetParent: function offsetParent() {
			return this.map(function() {
				var offsetParent = this.offsetParent;

				while (
					offsetParent &&
					jQuery.css(offsetParent, "position") === "static"
				) {
					offsetParent = offsetParent.offsetParent;
				}

				return offsetParent || documentElement;
			});
		}
	});
	jQuery.each(
		{
			scrollLeft: "pageXOffset",
			scrollTop: "pageYOffset"
		},
		function(method, prop) {
			var top = "pageYOffset" === prop;

			jQuery.fn[method] = function(val) {
				return access(
					this,
					function(elem, method, val) {
						var win = getWindow(elem);

						if (val === undefined) {
							return win ? win[prop] : elem[method];
						}

						if (win) {
							win.scrollTo(
								!top ? val : win.pageXOffset,
								top ? val : win.pageYOffset
							);
						} else {
							elem[method] = val;
						}
					},
					method,
					val,
					arguments.length
				);
			};
		}
	);
	jQuery.each(["top", "left"], function(i, prop) {
		jQuery.cssHooks[prop] = addGetHookIf(support.pixelPosition, function(
			elem,
			computed
		) {
			if (computed) {
				computed = curCSS(elem, prop);
				return rnumnonpx.test(computed)
					? jQuery(elem).position()[prop] + "px"
					: computed;
			}
		});
	});
	jQuery.each(
		{
			Height: "height",
			Width: "width"
		},
		function(name, type) {
			jQuery.each(
				{
					padding: "inner" + name,
					content: type,
					"": "outer" + name
				},
				function(defaultExtra, funcName) {
					jQuery.fn[funcName] = function(margin, value) {
						var chainable =
								arguments.length &&
								(defaultExtra || typeof margin !== "boolean"),
							extra =
								defaultExtra ||
								(margin === true || value === true
									? "margin"
									: "border");
						return access(
							this,
							function(elem, type, value) {
								var doc;

								if (jQuery.isWindow(elem)) {
									return funcName.indexOf("outer") === 0
										? elem["inner" + name]
										: elem.document.documentElement[
												"client" + name
										  ];
								}

								if (elem.nodeType === 9) {
									doc = elem.documentElement;
									return Math.max(
										elem.body["scroll" + name],
										doc["scroll" + name],
										elem.body["offset" + name],
										doc["offset" + name],
										doc["client" + name]
									);
								}

								return value === undefined
									? jQuery.css(elem, type, extra)
									: jQuery.style(elem, type, value, extra);
							},
							type,
							chainable ? margin : undefined,
							chainable
						);
					};
				}
			);
		}
	);
	jQuery.fn.extend({
		bind: function bind(types, data, fn) {
			return this.on(types, null, data, fn);
		},
		unbind: function unbind(types, fn) {
			return this.off(types, null, fn);
		},
		delegate: function delegate(selector, types, data, fn) {
			return this.on(types, selector, data, fn);
		},
		undelegate: function undelegate(selector, types, fn) {
			return arguments.length === 1
				? this.off(selector, "**")
				: this.off(types, selector || "**", fn);
		}
	});
	jQuery.parseJSON = JSON.parse;

	if (typeof define === "function" && define.amd) {
		define("jquery", [], function() {
			return jQuery;
		});
	}

	var _jQuery = window.jQuery,
		_$ = window.$;

	jQuery.noConflict = function(deep) {
		if (window.$ === jQuery) {
			window.$ = _$;
		}

		if (deep && window.jQuery === jQuery) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	};

	if (!noGlobal) {
		window.jQuery = window.$ = jQuery;
	}

	return jQuery;
});
/*jshint ignore:end */

/*!
 * Name: WebSlides
 * Version: 1.4.2
 * Date: 2017-09-12
 * Description: Making HTML presentations easy
 * URL: https://github.com/webslides/webslides#readme
 * Credits: @jlantunez, @LuisSacristan, @Belelros
 */

/******/
(function(modules) {
	// webpackBootstrap

	/******/
	// The module cache

	/******/
	var installedModules = {};
	/******/

	/******/
	// The require function

	/******/

	function __webpack_require__(moduleId) {
		/******/

		/******/
		// Check if module is in cache

		/******/
		if (installedModules[moduleId]) {
			/******/
			return installedModules[moduleId].exports;
			/******/
		}
		/******/
		// Create a new module (and put it into the cache)

		/******/

		var module = (installedModules[moduleId] = {
			/******/
			i: moduleId,

			/******/
			l: false,

			/******/
			exports: {}
			/******/
		});
		/******/

		/******/
		// Execute the module function

		/******/

		modules[moduleId].call(
			module.exports,
			module,
			module.exports,
			__webpack_require__
		);
		/******/

		/******/
		// Flag the module as loaded

		/******/

		module.l = true;
		/******/

		/******/
		// Return the exports of the module

		/******/

		return module.exports;
		/******/
	}
	/******/

	/******/

	/******/
	// expose the modules object (__webpack_modules__)

	/******/

	__webpack_require__.m = modules;
	/******/

	/******/
	// expose the module cache

	/******/

	__webpack_require__.c = installedModules;
	/******/

	/******/
	// define getter function for harmony exports

	/******/

	__webpack_require__.d = function(exports, name, getter) {
		/******/
		if (!__webpack_require__.o(exports, name)) {
			/******/
			Object.defineProperty(exports, name, {
				/******/
				configurable: false,

				/******/
				enumerable: true,

				/******/
				get: getter
				/******/
			});
			/******/
		}
		/******/
	};
	/******/

	/******/
	// getDefaultExport function for compatibility with non-harmony modules

	/******/

	__webpack_require__.n = function(module) {
		/******/
		var getter =
			module && module.__esModule
				? /******/
				  function getDefault() {
						return module["default"];
				  }
				: /******/
				  function getModuleExports() {
						return module;
				  };
		/******/

		__webpack_require__.d(getter, "a", getter);
		/******/

		return getter;
		/******/
	};
	/******/

	/******/
	// Object.prototype.hasOwnProperty.call

	/******/

	__webpack_require__.o = function(object, property) {
		return Object.prototype.hasOwnProperty.call(object, property);
	};
	/******/

	/******/
	// __webpack_public_path__

	/******/

	__webpack_require__.p = "/static/js/";
	/******/

	/******/
	// Load entry module and return exports

	/******/

	return __webpack_require__((__webpack_require__.s = 5));
	/******/
})(
	/************************************************************************/

	/******/
	[
		/* 0 */

		/***/
		function(module, __webpack_exports__, __webpack_require__) {
			"use strict";
			/* harmony import */

			var __WEBPACK_IMPORTED_MODULE_0__custom_event__ = __webpack_require__(
				9
			);

			var _createClass = (function() {
				function defineProperties(target, props) {
					for (var i = 0; i < props.length; i++) {
						var descriptor = props[i];
						descriptor.enumerable = descriptor.enumerable || false;
						descriptor.configurable = true;
						if ("value" in descriptor) descriptor.writable = true;
						Object.defineProperty(
							target,
							descriptor.key,
							descriptor
						);
					}
				}

				return function(Constructor, protoProps, staticProps) {
					if (protoProps)
						defineProperties(Constructor.prototype, protoProps);
					if (staticProps) defineProperties(Constructor, staticProps);
					return Constructor;
				};
			})();

			function _classCallCheck(instance, Constructor) {
				if (!(instance instanceof Constructor)) {
					throw new TypeError("Cannot call a class as a function");
				}
			}

			var transitionEvent = "";
			var animationEvent = "";
			/**
			 * Static class for DOM helper.
			 */

			var DOM = (function() {
				function DOM() {
					_classCallCheck(this, DOM);
				}

				_createClass(DOM, null, [
					{
						key: "createNode",

						/**
						 * Creates a node with optional parameters.
						 * @param {string} tag The name of the tag of the needed element.
						 * @param {string} id The desired id for the element. It defaults to an
						 * empty string.
						 * @param {string} text The desired text to go inside of the element. It
						 * defaults to an empty string.
						 * @return {Element}
						 */
						value: function createNode(tag) {
							var id =
								arguments.length > 1 &&
								arguments[1] !== undefined
									? arguments[1]
									: "";
							var text =
								arguments.length > 2 &&
								arguments[2] !== undefined
									? arguments[2]
									: "";
							var node = document.createElement(tag);

							if (id) {
								node.id = id;
							}

							if (text) {
								node.textContent = text;
							}

							return node;
						}
						/**
						 * Listens for an event once.
						 * @param {Element} el Element to listen to.
						 * @param {string} event Event Type.
						 * @param {Function} callback Function to execute once the event fires.
						 */
					},
					{
						key: "once",
						value: function once(el, event, callback) {
							var cb = function cb(e) {
								if (e.target === el) {
									el.removeEventListener(event, cb);
									callback(e);
								}
							};

							el.addEventListener(event, cb, false);
						}
						/**
						 * Gets the prefixed transitionend event.
						 * @param {?Element} optEl Element to check
						 * @return {string}
						 */
					},
					{
						key: "getTransitionEvent",
						value: function getTransitionEvent(optEl) {
							if (transitionEvent && !optEl) {
								return transitionEvent;
							}

							transitionEvent = "";
							var el = optEl || document.createElement("ws");
							var transitions = {
								transition: "transitionend",
								OTransition: "oTransitionEnd",
								MozTransition: "transitionend",
								WebkitTransition: "webkitTransitionEnd"
							};
							var transitionNames = Object.keys(transitions);

							for (
								var i = 0, length = transitionNames.length;
								i < length && !transitionEvent;
								i++
							) {
								var transitionName = transitionNames[i];

								if (
									typeof el.style[transitionName] !==
									"undefined"
								) {
									transitionEvent =
										transitions[transitionName];
								}
							}

							return transitionEvent;
						}
						/**
						 * Gets the prefixed animation end event.
						 * @param {?Element} optEl Element to check
						 * @return {string}
						 */
					},
					{
						key: "getAnimationEvent",
						value: function getAnimationEvent(optEl) {
							if (animationEvent && !optEl) {
								return animationEvent;
							}

							animationEvent = "animationend";
							var el = optEl || document.createElement("ws");
							var animations = {
								animation: "animationend",
								OAnimation: "oAnimationEnd",
								MozAnimation: "animationend",
								WebkitAnimation: "webkitAnimationEnd"
							};
							var animationNames = Object.keys(animations);

							for (
								var i = 0, length = animationNames.length;
								i < length;
								i++
							) {
								var animationName = animationNames[i];

								if (
									typeof el.style[animationName] !==
									"undefined"
								) {
									animationEvent = animations[animationName];
									break;
								}
							}

							return animationEvent;
						}
						/**
						 * Hides an element setting the display to none.
						 * @param {Element} el Element to be hidden.
						 */
					},
					{
						key: "hide",
						value: function hide(el) {
							el.style.display = "none";
						}
						/**
						 * Shows an element by removing the display property. This is only intended
						 * to be used in conjunction with DOM.hide.
						 * @param {Element} el Element to be shown.
						 */
					},
					{
						key: "show",
						value: function show(el) {
							el.style.display = "";
						}
						/**
						 * Checks if the element is visible.
						 * @param {Element} el Element to check.
						 * @return {boolean}
						 */
					},
					{
						key: "isVisible",
						value: function isVisible(el) {
							return el.offsetParent !== null;
						}
						/**
						 * Fires a custom event on the given target.
						 * @param {Element} target The target of the event.
						 * @param {string} eventType The event type.
						 * @param {Object} eventInfo Optional parameter to provide additional data
						 * to the event.
						 */
					},
					{
						key: "fireEvent",
						value: function fireEvent(target, eventType) {
							var eventInfo =
								arguments.length > 2 &&
								arguments[2] !== undefined
									? arguments[2]
									: {};
							var event = new __WEBPACK_IMPORTED_MODULE_0__custom_event__[
								"a"
								/* default */
							](eventType, {
								detail: eventInfo
							});
							target.dispatchEvent(event);
						}
						/**
						 * Converts an iterable to an array.
						 * @param {*} iterable Element to convert to array
						 * @return {Array} the element casted to an array.
						 */
					},
					{
						key: "toArray",
						value: function toArray(iterable) {
							return [].slice.call(iterable);
						}
						/**
						 * Checks whether the document has focus on an input or contenteditable
						 * element.
						 * @return {boolean} Whether the focused element is an input or content
						 * editable.
						 */
					},
					{
						key: "isFocusableElement",
						value: function isFocusableElement() {
							var result = false;

							if (document.activeElement) {
								var isContentEditable =
									document.activeElement.contentEditable !==
										"inherit" &&
									document.activeElement.contentEditable !==
										undefined;
								var isInput =
									[
										"INPUT",
										"SELECT",
										"OPTION",
										"TEXTAREA"
									].indexOf(document.activeElement.tagName) >
									-1;
								result = isInput || isContentEditable;
							}

							return result;
						}
						/**
						 * Gets the integer value of a style property.
						 * @param {string} prop CSS property value.
						 * @return {Number} The property without the units.
						 */
					},
					{
						key: "parseSize",
						value: function parseSize(prop) {
							return Number(prop.replace(/[^\d\.]/g, ""));
						}
						/**
						 * Wraps a HTML structure around an element.
						 * @param {Element} elem the element to be wrapped.
						 * @param {string} tag the new element tag.
						 * @return {Element} the new element.
						 */
					},
					{
						key: "wrap",
						value: function wrap(elem, tag) {
							var wrap = document.createElement(tag);
							elem.parentElement.insertBefore(wrap, elem);
							wrap.appendChild(elem);
							return wrap;
						}
						/**
						 * Inserts and element after another element.
						 * @param {Element} elem the element to be inserted.
						 * @param {Element} target the element to be inserted after.
						 */
					},
					{
						key: "after",
						value: function after(elem, target) {
							var parent = target.parentNode;

							if (parent.lastChild === target) {
								parent.appendChild(elem);
							} else {
								parent.insertBefore(elem, target.nextSibling);
							}
						}
					}
				]);

				return DOM;
			})();
			/* harmony default export */

			__webpack_exports__["a"] = DOM;
			/***/
		},
		/* 1 */

		/***/
		function(module, __webpack_exports__, __webpack_require__) {
			"use strict";
			/* harmony export (binding) */

			__webpack_require__.d(__webpack_exports__, "b", function() {
				return Slide;
			});
			/* harmony export (binding) */

			__webpack_require__.d(__webpack_exports__, "a", function() {
				return Events;
			});
			/* harmony import */

			var __WEBPACK_IMPORTED_MODULE_0__utils_dom__ = __webpack_require__(
				0
			);

			var _createClass = (function() {
				function defineProperties(target, props) {
					for (var i = 0; i < props.length; i++) {
						var descriptor = props[i];
						descriptor.enumerable = descriptor.enumerable || false;
						descriptor.configurable = true;
						if ("value" in descriptor) descriptor.writable = true;
						Object.defineProperty(
							target,
							descriptor.key,
							descriptor
						);
					}
				}

				return function(Constructor, protoProps, staticProps) {
					if (protoProps)
						defineProperties(Constructor.prototype, protoProps);
					if (staticProps) defineProperties(Constructor, staticProps);
					return Constructor;
				};
			})();

			function _classCallCheck(instance, Constructor) {
				if (!(instance instanceof Constructor)) {
					throw new TypeError("Cannot call a class as a function");
				}
			}

			var CLASSES = {
				SLIDE: "slide",
				CURRENT: "current"
			};
			var Events = {
				ENTER: "dom:enter",
				LEAVE: "dom:leave",
				ENABLE: "slide:enable",
				DISABLE: "slide:disable"
			};
			/**
			 * Wrapper for the Slide section.
			 */

			var Slide = (function() {
				/**
				 * Bootstraps the slide by saving some data, adding a class and hiding it.
				 * @param {Element} el Section element.
				 * @param {number} i Zero based index of the slide.
				 */
				function Slide(el, i) {
					_classCallCheck(this, Slide);
					/**
					 * @type {Element}
					 */

					this.el = el;
					/**
					 * The section's parent.
					 * @type {Node}
					 */

					this.parent = el.parentNode;
					/**
					 * @type {number}
					 */

					this.i = i;
					this.el.id = "section-" + (i + 1);
					this.el.classList.add(CLASSES.SLIDE); // Hide slides by default

					this.hide();
				}
				/**
				 * Hides the node and removes the class that makes it "active".
				 */

				_createClass(
					Slide,
					[
						{
							key: "hide",
							value: function hide() {
								__WEBPACK_IMPORTED_MODULE_0__utils_dom__[
									"a"
									/* default */
								].hide(this.el);

								this.el.classList.remove(CLASSES.CURRENT);
							}
							/**
							 * Shows the node and adds the class that makes it "active".
							 */
						},
						{
							key: "show",
							value: function show() {
								__WEBPACK_IMPORTED_MODULE_0__utils_dom__[
									"a"
									/* default */
								].show(this.el);

								this.el.classList.add(CLASSES.CURRENT);
							}
							/**
							 * Moves the section to the bottom of the section's list.
							 * @fires Slide#dom:leave
							 * @fires Slide#dom:enter
							 */
						},
						{
							key: "moveAfterLast",
							value: function moveAfterLast() {
								var last = this.parent.childNodes[
									this.parent.childElementCount - 1
								];
								this.fire_(Events.LEAVE);
								this.parent.insertBefore(
									this.el,
									last.nextSibling
								);
								this.fire_(Events.ENTER);
							}
							/**
							 * Moves the section to the top of the section's list.
							 * @fires Slide#dom:leave
							 * @fires Slide#dom:enter
							 */
						},
						{
							key: "moveBeforeFirst",
							value: function moveBeforeFirst() {
								var first = this.parent.childNodes[0];
								this.fire_(Events.LEAVE);
								this.parent.insertBefore(this.el, first);
								this.fire_(Events.ENTER);
							}
							/**
							 * Fires an enable event.
							 * @fires Slide#slide:enable
							 */
						},
						{
							key: "enable",
							value: function enable() {
								this.fire_(Events.ENABLE);
							}
							/**
							 * Fires a disable event.
							 * @fires Slide#slide:disable
							 */
						},
						{
							key: "disable",
							value: function disable() {
								this.fire_(Events.DISABLE);
							}
							/**
							 * Fires an event passing the slide instance on the detail.
							 * @param {String} name Name of the event to fire.
							 * @private
							 */
						},
						{
							key: "fire_",
							value: function fire_(name) {
								__WEBPACK_IMPORTED_MODULE_0__utils_dom__[
									"a"
									/* default */
								].fireEvent(this.el, name, {
									slide: this
								});
							}
							/**
							 * Checks whether an element is a valid candidate to be a slide by ensuring
							 * it's a "section" element.
							 * @param {Element} el Element to be checked.
							 * @return {boolean} Whether is candidate or not.
							 */
						}
					],
					[
						{
							key: "isCandidate",
							value: function isCandidate(el) {
								return (
									el.nodeType === 1 &&
									el.tagName === "SECTION"
								);
							}
							/**
							 * Gets the section element from an inner element.
							 * @param {Node} el
							 * @return {{section: ?Node, i: ?number}} A map with the section and the
							 * position of the section.
							 */
						},
						{
							key: "getSectionFromEl",
							value: function getSectionFromEl(el) {
								var parent = el;
								var section = null;
								var i = null;

								while (
									parent.parentElement &&
									!parent.classList.contains(CLASSES.SLIDE)
								) {
									parent = parent.parentElement;
								}

								if (parent.classList.contains(CLASSES.SLIDE)) {
									section = parent;
									i = parseInt(
										section.id.replace("section-", ""),
										10
									);
								}

								return {
									section: section,
									i: i
								};
							}
						}
					]
				);

				return Slide;
			})();
			/***/
		},
		/* 2 */

		/***/
		function(module, __webpack_exports__, __webpack_require__) {
			"use strict";

			var Keys = {
				ENTER: 13,
				SPACE: 32,
				RE_PAGE: 33,
				AV_PAGE: 34,
				END: 35,
				HOME: 36,
				LEFT: 37,
				UP: 38,
				RIGHT: 39,
				DOWN: 40,
				PLUS: [107, 171, 187],
				MINUS: [109, 173, 189],
				ESCAPE: 27,
				F: 70
			};
			/* harmony default export */

			__webpack_exports__["a"] = Keys;
			/***/
		},
		/* 3 */

		/***/
		function(module, __webpack_exports__, __webpack_require__) {
			"use strict";

			var _createClass = (function() {
				function defineProperties(target, props) {
					for (var i = 0; i < props.length; i++) {
						var descriptor = props[i];
						descriptor.enumerable = descriptor.enumerable || false;
						descriptor.configurable = true;
						if ("value" in descriptor) descriptor.writable = true;
						Object.defineProperty(
							target,
							descriptor.key,
							descriptor
						);
					}
				}

				return function(Constructor, protoProps, staticProps) {
					if (protoProps)
						defineProperties(Constructor.prototype, protoProps);
					if (staticProps) defineProperties(Constructor, staticProps);
					return Constructor;
				};
			})();

			function _classCallCheck(instance, Constructor) {
				if (!(instance instanceof Constructor)) {
					throw new TypeError("Cannot call a class as a function");
				}
			}

			var UA = window.navigator.userAgent;
			/**
			 * Mobile detector helper class. Tests the User Agent to see if we're, likely,
			 * on a mobile device.
			 */

			var MobileDetector = (function() {
				function MobileDetector() {
					_classCallCheck(this, MobileDetector);
				}

				_createClass(MobileDetector, null, [
					{
						key: "isAndroid",

						/**
						 * Whether the device is Android or not.
						 * @return {Boolean}
						 */
						value: function isAndroid() {
							return !!UA.match(/Android/i);
						}
						/**
						 * Whether the device is BlackBerry or not.
						 * @return {Boolean}
						 */
					},
					{
						key: "isBlackBerry",
						value: function isBlackBerry() {
							return !!UA.match(/BlackBerry/i);
						}
						/**
						 * Whether the device is iOS or not.
						 * @return {Boolean}
						 */
					},
					{
						key: "isiOS",
						value: function isiOS() {
							return !!UA.match(/iPad|iPhone|iPod/i);
						}
						/**
						 * Whether the device is Opera or not.
						 * @return {Boolean}
						 */
					},
					{
						key: "isOpera",
						value: function isOpera() {
							return !!UA.match(/Opera Mini/i);
						}
						/**
						 * Whether the device is Windows or not.
						 * @return {Boolean}
						 */
					},
					{
						key: "isWindows",
						value: function isWindows() {
							return !!UA.match(/IEMobile/i);
						}
						/**
						 * Whether the device is Windows Phone or not.
						 * @return {Boolean}
						 */
					},
					{
						key: "isWindowsPhone",
						value: function isWindowsPhone() {
							return !!UA.match(/Windows Phone/i);
						}
						/**
						 * Whether the device is any mobile device or not.
						 * @return {Boolean}
						 */
					},
					{
						key: "isAny",
						value: function isAny() {
							return (
								MobileDetector.isAndroid() ||
								MobileDetector.isBlackBerry() ||
								MobileDetector.isiOS() ||
								MobileDetector.isOpera() ||
								MobileDetector.isWindows() ||
								MobileDetector.isWindowsPhone()
							);
						}
					}
				]);

				return MobileDetector;
			})();
			/* harmony default export */

			__webpack_exports__["a"] = MobileDetector;
			/***/
		},
		/* 4 */

		/***/
		function(module, __webpack_exports__, __webpack_require__) {
			"use strict";
			/* harmony export (immutable) */

			__webpack_exports__["a"] = scrollTo;
			/* harmony import */

			var __WEBPACK_IMPORTED_MODULE_0__easing__ = __webpack_require__(20);

			var SCROLLABLE_CONTAINER = document.getElementById("webslides");
			/**
			 * Smoothly scrolls to a given Y position using Easing.Swing. It'll run a
			 * callback upon finishing.
			 * @param {number} y Offset of the page to scroll to.
			 * @param {number} duration Duration of the animation. 500ms by default.
			 * @param {function} cb Callback function to call upon completion.
			 * @param {HTMLElement} container The HTML element where to scroll
			 */

			function scrollTo(y) {
				var duration =
					arguments.length > 1 && arguments[1] !== undefined
						? arguments[1]
						: 500;
				var cb =
					arguments.length > 2 && arguments[2] !== undefined
						? arguments[2]
						: function() {};
				var container =
					arguments.length > 3 && arguments[3] !== undefined
						? arguments[3]
						: null;
				SCROLLABLE_CONTAINER = container
					? container
					: document.getElementById("webslides");
				var delta = y - SCROLLABLE_CONTAINER.scrollTop;
				var startLocation = SCROLLABLE_CONTAINER.scrollTop;
				var increment = 16;

				if (!duration) {
					SCROLLABLE_CONTAINER.scrollTop = y;
					cb();
					return;
				}

				var animateScroll = function animateScroll(elapsedTime) {
					elapsedTime += increment;
					var percent = Math.min(1, elapsedTime / duration);

					var easingP = __WEBPACK_IMPORTED_MODULE_0__easing__[
						"a"
						/* default */
					].swing(percent, elapsedTime * percent, y, delta, duration);

					SCROLLABLE_CONTAINER.scrollTop = Math.floor(
						startLocation + easingP * delta
					);

					if (elapsedTime < duration) {
						setTimeout(function() {
							return animateScroll(elapsedTime);
						}, increment);
					} else {
						cb();
					}
				};

				animateScroll(0);
			}
			/***/
		},
		/* 5 */

		/***/
		function(module, __webpack_exports__, __webpack_require__) {
			"use strict";

			Object.defineProperty(__webpack_exports__, "__esModule", {
				value: true
			});
			/* harmony import */

			var __WEBPACK_IMPORTED_MODULE_0__modules_webslides__ = __webpack_require__(
				6
			);

			__webpack_require__(21);

			window.WebSlides =
				__WEBPACK_IMPORTED_MODULE_0__modules_webslides__[
					"a"
					/* default */
				];
			/***/
		},
		/* 6 */

		/***/
		function(module, __webpack_exports__, __webpack_require__) {
			"use strict";
			/* harmony import */

			var __WEBPACK_IMPORTED_MODULE_0__plugins_plugins__ = __webpack_require__(
				7
			);
			/* harmony import */

			var __WEBPACK_IMPORTED_MODULE_1__slide__ = __webpack_require__(1);
			/* harmony import */

			var __WEBPACK_IMPORTED_MODULE_2__utils_dom__ = __webpack_require__(
				0
			);
			/* harmony import */

			var __WEBPACK_IMPORTED_MODULE_3__utils_scroll_to__ = __webpack_require__(
				4
			);

			var _createClass = (function() {
				function defineProperties(target, props) {
					for (var i = 0; i < props.length; i++) {
						var descriptor = props[i];
						descriptor.enumerable = descriptor.enumerable || false;
						descriptor.configurable = true;
						if ("value" in descriptor) descriptor.writable = true;
						Object.defineProperty(
							target,
							descriptor.key,
							descriptor
						);
					}
				}

				return function(Constructor, protoProps, staticProps) {
					if (protoProps)
						defineProperties(Constructor.prototype, protoProps);
					if (staticProps) defineProperties(Constructor, staticProps);
					return Constructor;
				};
			})();

			function _classCallCheck(instance, Constructor) {
				if (!(instance instanceof Constructor)) {
					throw new TypeError("Cannot call a class as a function");
				}
			}

			var CLASSES = {
				VERTICAL: "vertical",
				READY: "ws-ready",
				DISABLED: "disabled"
			}; // Default plugins

			var PLUGINS = {
				autoslide:
					__WEBPACK_IMPORTED_MODULE_0__plugins_plugins__[
						"a"
						/* default */
					].AutoSlide,
				clickNav:
					__WEBPACK_IMPORTED_MODULE_0__plugins_plugins__[
						"a"
						/* default */
					].ClickNav,
				grid:
					__WEBPACK_IMPORTED_MODULE_0__plugins_plugins__[
						"a"
						/* default */
					].Grid,
				hash:
					__WEBPACK_IMPORTED_MODULE_0__plugins_plugins__[
						"a"
						/* default */
					].Hash,
				keyboard:
					__WEBPACK_IMPORTED_MODULE_0__plugins_plugins__[
						"a"
						/* default */
					].Keyboard,
				nav:
					__WEBPACK_IMPORTED_MODULE_0__plugins_plugins__[
						"a"
						/* default */
					].Navigation,
				scroll:
					__WEBPACK_IMPORTED_MODULE_0__plugins_plugins__[
						"a"
						/* default */
					].Scroll,
				touch:
					__WEBPACK_IMPORTED_MODULE_0__plugins_plugins__[
						"a"
						/* default */
					].Touch,
				video:
					__WEBPACK_IMPORTED_MODULE_0__plugins_plugins__[
						"a"
						/* default */
					].Video,
				youtube:
					__WEBPACK_IMPORTED_MODULE_0__plugins_plugins__[
						"a"
						/* default */
					].YouTube,
				zoom:
					__WEBPACK_IMPORTED_MODULE_0__plugins_plugins__[
						"a"
						/* default */
					].Zoom
			};
			/**
			 * WebSlides module.
			 */

			var WebSlides = (function() {
				/**
				 * Options for WebSlides
				 * @param {number|boolean} autoslide If a number is provided, it will allow
				 * autosliding by said amount of milliseconds.
				 * @param {boolean} changeOnClick If true, it will allow
				 * clicking on any place to change the slide.
				 * @param {boolean} loop Whether to go to first slide from last one or not.
				 * @param {number} minWheelDelta Controls the amount of needed scroll to
				 * trigger navigation.
				 * @param {boolean} navigateOnScroll Whether scroll can trigger navigation or
				 * not.
				 * @param {number} scrollWait Controls the amount of time to wait till
				 * navigation can occur again with scroll.
				 * @param {number} slideOffset Controls the amount of needed touch delta to
				 * trigger navigation.
				 * @param {boolean} showIndex Controls if the index can be shown.
				 */
				function WebSlides() {
					var _ref =
							arguments.length > 0 && arguments[0] !== undefined
								? arguments[0]
								: {},
						_ref$autoslide = _ref.autoslide,
						autoslide =
							_ref$autoslide === undefined
								? false
								: _ref$autoslide,
						_ref$changeOnClick = _ref.changeOnClick,
						changeOnClick =
							_ref$changeOnClick === undefined
								? false
								: _ref$changeOnClick,
						_ref$loop = _ref.loop,
						loop = _ref$loop === undefined ? true : _ref$loop,
						_ref$minWheelDelta = _ref.minWheelDelta,
						minWheelDelta =
							_ref$minWheelDelta === undefined
								? 40
								: _ref$minWheelDelta,
						_ref$navigateOnScroll = _ref.navigateOnScroll,
						navigateOnScroll =
							_ref$navigateOnScroll === undefined
								? true
								: _ref$navigateOnScroll,
						_ref$scrollWait = _ref.scrollWait,
						scrollWait =
							_ref$scrollWait === undefined
								? 450
								: _ref$scrollWait,
						_ref$slideOffset = _ref.slideOffset,
						slideOffset =
							_ref$slideOffset === undefined
								? 50
								: _ref$slideOffset,
						_ref$showIndex = _ref.showIndex,
						showIndex =
							_ref$showIndex === undefined
								? true
								: _ref$showIndex;

					_classCallCheck(this, WebSlides);
					/**
					 * WebSlide element.
					 * @type {Element}
					 */

					this.el = document.getElementById("webslides");

					if (!this.el) {
						throw new Error(
							"Couldn't find the webslides container!"
						);
					}
					/**
					 * Moving flag.
					 * @type {boolean}
					 */

					this.isMoving = false;
					/**
					 * Slide's array.
					 * @type {?Array<Slide>}
					 */

					this.slides = null;
					/**
					 * Current slide's index.
					 * @type {number}
					 * @private
					 */

					this.currentSlideI_ = -1;
					/**
					 * Current slide reference.
					 * @type {?Slide}
					 * @private
					 */

					this.currentSlide_ = null;
					/**
					 * Max slide index.
					 * @type {number}
					 * @private
					 */

					this.maxSlide_ = 0;
					/**
					 * Whether the layout is going to be vertical or horizontal.
					 * @type {boolean}
					 */

					this.isVertical = this.el.classList.contains(
						CLASSES.VERTICAL
					);
					/**
					 * Plugin's dictionary.
					 * @type {Object}
					 */

					this.plugins = {};
					/**
					 * Options dictionary.
					 * @type {Object}
					 */

					this.options = {
						autoslide: autoslide,
						changeOnClick: changeOnClick,
						loop: loop,
						minWheelDelta: minWheelDelta,
						navigateOnScroll: navigateOnScroll,
						scrollWait: scrollWait,
						slideOffset: slideOffset,
						showIndex: showIndex
					};
					/**
					 * Initialisation flag.
					 * @type {boolean}
					 */

					this.initialised = false; // Bootstrapping

					this.removeChildren_();
					this.grabSlides_();
					this.createPlugins_();
					this.initSlides_(); // Finished

					this.onInit_();
				}
				/**
				 * Removes all children elements inside of the main container that are not
				 * eligible to be a Slide Element.
				 * @private
				 */

				_createClass(
					WebSlides,
					[
						{
							key: "removeChildren_",
							value: function removeChildren_() {
								var nodes = this.el.childNodes;
								var i = nodes.length;

								while (i--) {
									var node = nodes[i];

									if (
										!__WEBPACK_IMPORTED_MODULE_1__slide__[
											"b"
											/* default */
										].isCandidate(node)
									) {
										this.el.removeChild(node);
									}
								}
							}
							/**
							 * Creates all the registered plugins and store the instances inside of the
							 * the webslide instance.
							 * @private
							 */
						},
						{
							key: "createPlugins_",
							value: function createPlugins_() {
								var _this = this;

								Object.keys(PLUGINS).forEach(function(
									pluginName
								) {
									var PluginCto = PLUGINS[pluginName];
									_this.plugins[pluginName] = new PluginCto(
										_this
									);
								});
							}
							/**
							 * Called once the WebSlide instance has finished initialising.
							 * @private
							 * @fires WebSlide#ws:init
							 */
						},
						{
							key: "onInit_",
							value: function onInit_() {
								this.initialised = true;

								__WEBPACK_IMPORTED_MODULE_2__utils_dom__[
									"a"
									/* default */
								].fireEvent(this.el, "ws:init");

								document.documentElement.classList.add(
									CLASSES.READY
								);
							}
							/**
							 * Grabs the slides from the DOM and creates all the Slides modules.
							 * @private
							 */
						},
						{
							key: "grabSlides_",
							value: function grabSlides_() {
								this.slides = __WEBPACK_IMPORTED_MODULE_2__utils_dom__[
									"a"
									/* default */
								]
									.toArray(this.el.childNodes)
									.map(function(slide, i) {
										return new __WEBPACK_IMPORTED_MODULE_1__slide__[
											"b"
											/* default */
										](slide, i);
									});
								this.maxSlide_ = this.slides.length;
							}
							/**
							 * Goes to a given slide.
							 * @param {!number} slideI The slide index.
							 * @param {?boolean=} forward Whether we're forcing moving forward/backwards.
							 * This parameter is used only from the goNext, goPrev functions to adjust the
							 * scroll animations.
							 */
						},
						{
							key: "goToSlide",
							value: function goToSlide(slideI) {
								var forward =
									arguments.length > 1 &&
									arguments[1] !== undefined
										? arguments[1]
										: null;

								if (
									this.isValidIndexSlide_(slideI) &&
									!this.isMoving &&
									this.currentSlideI_ !== slideI
								) {
									this.isMoving = true;
									var isMovingForward = false;

									if (forward !== null) {
										isMovingForward = forward;
									} else {
										if (this.currentSlideI_ >= 0) {
											isMovingForward =
												slideI > this.currentSlideI_;
										}
									}

									var nextSlide = this.slides[slideI];

									if (
										this.currentSlide_ !== null &&
										this.isVertical &&
										(!this.plugins.touch ||
											!this.plugins.touch.isEnabled)
									) {
										this.scrollTransitionToSlide_(
											isMovingForward,
											nextSlide,
											this.onSlideChange_
										);
									} else {
										this.transitionToSlide_(
											isMovingForward,
											nextSlide,
											this.onSlideChange_
										);
									}
								}
							}
							/**
							 * Transitions to a slide, doing the scroll animation.
							 * @param {boolean} isMovingForward Whether we're going forward or backwards.
							 * @param {Slide} nextSlide Next slide.
							 * @param {Function} callback Callback to be called upon finishing. This is an
							 * async function so it'll happen once the scroll animation finishes.
							 * @private
							 * @see scrollTo
							 */
						},
						{
							key: "scrollTransitionToSlide_",
							value: function scrollTransitionToSlide_(
								isMovingForward,
								nextSlide,
								callback
							) {
								var _this2 = this;

								this.el.style.overflow = "hidden";

								if (!isMovingForward) {
									nextSlide.moveBeforeFirst();
									nextSlide.show();
									Object(
										__WEBPACK_IMPORTED_MODULE_3__utils_scroll_to__[
											"a"
											/* default */
										]
									)(this.currentSlide_.el.offsetTop, 0);
								} else {
									nextSlide.show();
								}

								Object(
									__WEBPACK_IMPORTED_MODULE_3__utils_scroll_to__[
										"a"
										/* default */
									]
								)(nextSlide.el.offsetTop, 500, function() {
									_this2.currentSlide_.hide();

									if (isMovingForward) {
										_this2.currentSlide_.moveAfterLast();
									}

									_this2.el.style.overflow = "auto";
									setTimeout(function() {
										callback.call(_this2, nextSlide);
									}, 150);
								});
							}
							/**
							 * Transitions to a slide, without doing the scroll animation. If the page is
							 * already initialised and on mobile device, it will do a slide animation.
							 * @param {boolean} isMovingForward Whether we're going forward or backwards.
							 * @param {Slide} nextSlide Next slide.
							 * @param {Function} callback Callback to be called upon finishing. This is a
							 * sync function so it'll happen on run time.
							 * @private
							 */
						},
						{
							key: "transitionToSlide_",
							value: function transitionToSlide_(
								isMovingForward,
								nextSlide,
								callback
							) {
								var _this3 = this;

								Object(
									__WEBPACK_IMPORTED_MODULE_3__utils_scroll_to__[
										"a"
										/* default */
									]
								)(0, 0);
								var className = "slideInRight";

								if (!isMovingForward) {
									nextSlide.moveBeforeFirst();
									className = "slideInLeft";
								}

								if (this.currentSlide_) {
									if (isMovingForward) {
										this.currentSlide_.moveAfterLast();
									}

									this.currentSlide_.hide();
								}

								nextSlide.show();

								if (
									this.initialised &&
									this.plugins.touch &&
									this.plugins.touch.isEnabled
								) {
									__WEBPACK_IMPORTED_MODULE_2__utils_dom__[
										"a"
										/* default */
									].once(
										nextSlide.el,
										__WEBPACK_IMPORTED_MODULE_2__utils_dom__[
											"a"
											/* default */
										].getAnimationEvent(),
										function() {
											nextSlide.el.classList.remove(
												className
											);
											callback.call(_this3, nextSlide);
										}
									);

									nextSlide.el.classList.add(className);
								} else {
									callback.call(this, nextSlide);
								}
							}
							/**
							 * Whenever a slide is changed, this function gets called. It updates the
							 * references to the current slide, disables the moving flag and fires
							 * a custom event.
							 * @param {Slide} slide The slide we're transitioning to.
							 * @fires WebSlide#ws:slide-change
							 * @private
							 */
						},
						{
							key: "onSlideChange_",
							value: function onSlideChange_(slide) {
								if (this.currentSlide_) {
									this.currentSlide_.disable();
								}

								this.currentSlide_ = slide;
								this.currentSlideI_ = slide.i;
								this.currentSlide_.enable();
								this.isMoving = false;

								__WEBPACK_IMPORTED_MODULE_2__utils_dom__[
									"a"
									/* default */
								].fireEvent(this.el, "ws:slide-change", {
									slides: this.maxSlide_,
									currentSlide0: this.currentSlideI_,
									currentSlide: this.currentSlideI_ + 1
								});
							}
							/**
							 * Goes to the next slide.
							 */
						},
						{
							key: "goNext",
							value: function goNext() {
								var nextIndex = this.currentSlideI_ + 1;

								if (nextIndex >= this.maxSlide_) {
									if (!this.options.loop) {
										return;
									}

									nextIndex = 0;
								}

								this.goToSlide(nextIndex, true);
							}
							/**
							 * Goes to the previous slide.
							 */
						},
						{
							key: "goPrev",
							value: function goPrev() {
								var prevIndex = this.currentSlideI_ - 1;

								if (prevIndex < 0) {
									if (!this.options.loop) {
										return;
									}

									prevIndex = this.maxSlide_ - 1;
								}

								this.goToSlide(prevIndex, false);
							}
							/**
							 * Check if the given number is a valid index to go to.
							 * @param {number} i The index to check.
							 * @return {boolean} Whether you can move to that slide or not.
							 * @private
							 */
						},
						{
							key: "isValidIndexSlide_",
							value: function isValidIndexSlide_(i) {
								return (
									typeof i === "number" &&
									i >= 0 &&
									i < this.maxSlide_
								);
							}
							/**
							 * Init the shown slide on load. It'll fetch it from the Hash if present
							 * and, otherwise, it'll default to the first one.
							 * @private
							 * @see Hash.getSlideNumber
							 */
						},
						{
							key: "initSlides_",
							value: function initSlides_() {
								var slideNumber = this.plugins.hash.constructor.getSlideNumber(); // Not valid

								if (
									slideNumber === null ||
									slideNumber >= this.maxSlide_
								) {
									slideNumber = 0;
								} // Keeping the order

								if (slideNumber !== 0) {
									var i = 0;

									while (i < slideNumber) {
										this.slides[i].moveAfterLast();
										i++;
									}
								}

								this.goToSlide(slideNumber);
							}
							/**
							 * Toggles zoom
							 */
						},
						{
							key: "toggleZoom",
							value: function toggleZoom() {
								if (this.options.showIndex) {
									this.plugins.zoom.toggleZoom();
								}
							}
							/**
							 * Disables the webslides element adding a class "disabled"
							 */
						},
						{
							key: "disable",
							value: function disable() {
								this.el.classList.add(CLASSES.DISABLED);

								if (
									this.plugins.autoslide &&
									this.plugins.autoslide.time !== false
								) {
									this.plugins.autoslide.stop();
								}
							}
							/**
							 * Enables the webslides element removing a class "disabled"
							 */
						},
						{
							key: "enable",
							value: function enable() {
								this.el.classList.remove(CLASSES.DISABLED);

								if (
									this.plugins.autoslide &&
									this.plugins.autoslide.time !== false
								) {
									this.plugins.autoslide.play();
								}
							}
							/**
							 * Checks if it is disabled
							 * @return {boolean}
							 */
						},
						{
							key: "isDisabled",
							value: function isDisabled() {
								return this.el.classList.contains(
									CLASSES.DISABLED
								);
							}
							/**
							 * Puts the browser into fullscreen
							 */
						},
						{
							key: "fullscreen",
							value: function fullscreen() {
								var el = document.documentElement;
								var isFullscreen =
									document.fullscreen ||
									document.webkitIsFullScreen ||
									document.mozFullScreen ||
									document.msFullScreenElement;

								if (!isFullscreen) {
									/* istanbul ignore next hard to test prefixes */
									var requestFullscreen =
										el.requestFullscreen ||
										el.webkitRequestFullScreen ||
										el.mozRequestFullScreen ||
										el.msRequestFullscreen;
									requestFullscreen.call(el);
								} else {
									/* istanbul ignore next hard to test prefixes */
									var cancelFullscreen =
										document.exitFullScreen ||
										document.webkitCancelFullScreen ||
										document.mozCancelFullScreen ||
										document.msExitFullscreen;
									cancelFullscreen.call(document);
								}
							}
							/**
							 * Registers a plugin to be loaded when the instance is created. It allows
							 * (on purpose) to replace default plugins.
							 * @param {!string} key They key under which it'll be stored inside of the
							 * instance, inside the plugins dict.
							 * @param {!Function} cto Plugin constructor.
							 */
						}
					],
					[
						{
							key: "registerPlugin",
							value: function registerPlugin(key, cto) {
								PLUGINS[key] = cto;
							}
						}
					]
				);

				return WebSlides;
			})();
			/* harmony default export */

			__webpack_exports__["a"] = WebSlides;
			/***/
		},
		/* 7 */

		/***/
		function(module, __webpack_exports__, __webpack_require__) {
			"use strict";
			/* harmony import */

			var __WEBPACK_IMPORTED_MODULE_0__autoslide__ = __webpack_require__(
				8
			);
			/* harmony import */

			var __WEBPACK_IMPORTED_MODULE_1__click_nav__ = __webpack_require__(
				10
			);
			/* harmony import */

			var __WEBPACK_IMPORTED_MODULE_2__grid__ = __webpack_require__(11);
			/* harmony import */

			var __WEBPACK_IMPORTED_MODULE_3__hash__ = __webpack_require__(12);
			/* harmony import */

			var __WEBPACK_IMPORTED_MODULE_4__keyboard__ = __webpack_require__(
				13
			);
			/* harmony import */

			var __WEBPACK_IMPORTED_MODULE_5__navigation__ = __webpack_require__(
				14
			);
			/* harmony import */

			var __WEBPACK_IMPORTED_MODULE_6__scroll__ = __webpack_require__(15);
			/* harmony import */

			var __WEBPACK_IMPORTED_MODULE_7__touch__ = __webpack_require__(16);
			/* harmony import */

			var __WEBPACK_IMPORTED_MODULE_8__video__ = __webpack_require__(17);
			/* harmony import */

			var __WEBPACK_IMPORTED_MODULE_9__youtube__ = __webpack_require__(
				18
			);
			/* harmony import */

			var __WEBPACK_IMPORTED_MODULE_10__zoom__ = __webpack_require__(19);
			/* harmony default export */

			__webpack_exports__["a"] = {
				AutoSlide:
					__WEBPACK_IMPORTED_MODULE_0__autoslide__[
						"a"
						/* default */
					],
				ClickNav:
					__WEBPACK_IMPORTED_MODULE_1__click_nav__[
						"a"
						/* default */
					],
				Grid:
					__WEBPACK_IMPORTED_MODULE_2__grid__[
						"a"
						/* default */
					],
				Hash:
					__WEBPACK_IMPORTED_MODULE_3__hash__[
						"a"
						/* default */
					],
				Keyboard:
					__WEBPACK_IMPORTED_MODULE_4__keyboard__[
						"a"
						/* default */
					],
				Navigation:
					__WEBPACK_IMPORTED_MODULE_5__navigation__[
						"a"
						/* default */
					],
				Scroll:
					__WEBPACK_IMPORTED_MODULE_6__scroll__[
						"a"
						/* default */
					],
				Touch:
					__WEBPACK_IMPORTED_MODULE_7__touch__[
						"a"
						/* default */
					],
				Video:
					__WEBPACK_IMPORTED_MODULE_8__video__[
						"a"
						/* default */
					],
				YouTube:
					__WEBPACK_IMPORTED_MODULE_9__youtube__[
						"a"
						/* default */
					],
				Zoom:
					__WEBPACK_IMPORTED_MODULE_10__zoom__[
						"a"
						/* default */
					]
			};
			/***/
		},
		/* 8 */

		/***/
		function(module, __webpack_exports__, __webpack_require__) {
			"use strict";
			/* harmony import */

			var __WEBPACK_IMPORTED_MODULE_0__utils_dom__ = __webpack_require__(
				0
			);

			var _createClass = (function() {
				function defineProperties(target, props) {
					for (var i = 0; i < props.length; i++) {
						var descriptor = props[i];
						descriptor.enumerable = descriptor.enumerable || false;
						descriptor.configurable = true;
						if ("value" in descriptor) descriptor.writable = true;
						Object.defineProperty(
							target,
							descriptor.key,
							descriptor
						);
					}
				}

				return function(Constructor, protoProps, staticProps) {
					if (protoProps)
						defineProperties(Constructor.prototype, protoProps);
					if (staticProps) defineProperties(Constructor, staticProps);
					return Constructor;
				};
			})();

			function _classCallCheck(instance, Constructor) {
				if (!(instance instanceof Constructor)) {
					throw new TypeError("Cannot call a class as a function");
				}
			}
			/**
			 * Autoslide plugin.
			 */

			var AutoSlide = (function() {
				/**
				 * @param {WebSlides} wsInstance The WebSlides instance
				 * @constructor
				 */
				function AutoSlide(wsInstance) {
					_classCallCheck(this, AutoSlide);
					/**
					 * @type {WebSlides}
					 * @private
					 */

					this.ws_ = wsInstance;
					/**
					 * Interval ID reference for the autoslide.
					 * @type {?number}
					 * @private
					 */

					this.interval_ = null;
					/**
					 * Internal stored time.
					 * @type {?number}
					 */

					this.time = this.ws_.options.autoslide;

					if (this.time) {
						__WEBPACK_IMPORTED_MODULE_0__utils_dom__[
							"a"
							/* default */
						].once(wsInstance.el, "ws:init", this.play.bind(this));

						document.body.addEventListener(
							"focus",
							this.onFocus.bind(this)
						);
					}
				}
				/**
				 * On focus handler. Will decide if stops/play depending on the focused
				 * element if autoslide is active.
				 */

				_createClass(AutoSlide, [
					{
						key: "onFocus",
						value: function onFocus() {
							if (
								__WEBPACK_IMPORTED_MODULE_0__utils_dom__[
									"a"
									/* default */
								].isFocusableElement()
							) {
								this.stop();
							} else if (this.interval_ === null) {
								this.play();
							}
						}
						/**
						 * Starts autosliding all the slides if it's not currently doing it and the
						 * autoslide option was a number greater than 0.
						 * @param {?number=} time Amount of milliseconds to wait to go to next slide
						 * automatically.
						 */
					},
					{
						key: "play",
						value: function play(time) {
							if (typeof time !== "number") {
								time = this.time;
							}

							this.time = time;

							if (
								!this.interval_ &&
								typeof time === "number" &&
								time > 0
							) {
								this.interval_ = setInterval(
									this.ws_.goNext.bind(this.ws_),
									time
								);
							}
						}
						/**
						 * Stops autosliding all the slides.
						 */
					},
					{
						key: "stop",
						value: function stop() {
							if (this.interval_) {
								clearInterval(this.interval_);
								this.interval_ = null;
							}
						}
					}
				]);

				return AutoSlide;
			})();
			/* harmony default export */

			__webpack_exports__["a"] = AutoSlide;
			/***/
		},
		/* 9 */

		/***/
		function(module, __webpack_exports__, __webpack_require__) {
			"use strict";

			var NativeCustomEvent = window.CustomEvent;
			/**
			 * Check for the usage of native support for CustomEvents which is lacking
			 * completely on IE.
			 * @return {boolean} Whether it can be used or not.
			 */

			function canIuseNativeCustom() {
				try {
					var p = new NativeCustomEvent("t", {
						detail: {
							a: "b"
						}
					});
					return "t" === p.type && "b" === p.detail.a;
				} catch (e) {}
				/* istanbul ignore next: hard to reproduce on test environment  */

				return false;
			}
			/**
			 * Lousy polyfill for the Custom Event constructor for IE.
			 * @param {!string} type The type of the event.
			 * @param {?Object} params Additional information for the event.
			 * @return {Event}
			 * @constructor
			 */

			/* istanbul ignore next: hard to reproduce on test environment  */

			var IECustomEvent = function CustomEvent(type, params) {
				var e = document.createEvent("CustomEvent");

				if (params) {
					e.initCustomEvent(
						type,
						params.bubbles,
						params.cancelable,
						params.detail
					);
				} else {
					e.initCustomEvent(type, false, false, undefined);
				}

				return e;
			};
			/* istanbul ignore next: hard to reproduce on test environment  */

			var WSCustomEvent = canIuseNativeCustom()
				? NativeCustomEvent
				: IECustomEvent;
			/* harmony default export */

			__webpack_exports__["a"] = WSCustomEvent;
			/***/
		},
		/* 10 */

		/***/
		function(module, __webpack_exports__, __webpack_require__) {
			"use strict";

			var _createClass = (function() {
				function defineProperties(target, props) {
					for (var i = 0; i < props.length; i++) {
						var descriptor = props[i];
						descriptor.enumerable = descriptor.enumerable || false;
						descriptor.configurable = true;
						if ("value" in descriptor) descriptor.writable = true;
						Object.defineProperty(
							target,
							descriptor.key,
							descriptor
						);
					}
				}

				return function(Constructor, protoProps, staticProps) {
					if (protoProps)
						defineProperties(Constructor.prototype, protoProps);
					if (staticProps) defineProperties(Constructor, staticProps);
					return Constructor;
				};
			})();

			function _classCallCheck(instance, Constructor) {
				if (!(instance instanceof Constructor)) {
					throw new TypeError("Cannot call a class as a function");
				}
			}

			var CLICKABLE_ELS = [
				"INPUT",
				"SELECT",
				"OPTION",
				"BUTTON",
				"A",
				"TEXTAREA"
			];
			/**
			 * ClickNav plugin that allows to click on the page to get to the next slide.
			 */

			var ClickNav = (function() {
				/**
				 * @param {WebSlides} wsInstance The WebSlides instance
				 * @constructor
				 */
				function ClickNav(wsInstance) {
					_classCallCheck(this, ClickNav);
					/**
					 * @type {WebSlides}
					 * @private
					 */

					this.ws_ = wsInstance;

					if (wsInstance.options.changeOnClick) {
						this.ws_.el.addEventListener(
							"click",
							this.onClick_.bind(this)
						);
					}
				}
				/**
				 * Reacts to the click event. It will go to the next slide unless the element
				 * has a data-prevent-nav attribute or is on the list of CLICKABLE_ELS.
				 * @param {MouseEvent} event The click event.
				 * @private
				 */

				_createClass(ClickNav, [
					{
						key: "onClick_",
						value: function onClick_(event) {
							if (
								CLICKABLE_ELS.indexOf(event.target.tagName) <
									0 &&
								typeof event.target.dataset.preventNav ===
									"undefined"
							) {
								this.ws_.goNext();
							}
						}
					}
				]);

				return ClickNav;
			})();
			/* harmony default export */

			__webpack_exports__["a"] = ClickNav;
			/***/
		},
		/* 11 */

		/***/
		function(module, __webpack_exports__, __webpack_require__) {
			"use strict";
			/* harmony import */

			var __WEBPACK_IMPORTED_MODULE_0__utils_keys__ = __webpack_require__(
				2
			);

			var _createClass = (function() {
				function defineProperties(target, props) {
					for (var i = 0; i < props.length; i++) {
						var descriptor = props[i];
						descriptor.enumerable = descriptor.enumerable || false;
						descriptor.configurable = true;
						if ("value" in descriptor) descriptor.writable = true;
						Object.defineProperty(
							target,
							descriptor.key,
							descriptor
						);
					}
				}

				return function(Constructor, protoProps, staticProps) {
					if (protoProps)
						defineProperties(Constructor.prototype, protoProps);
					if (staticProps) defineProperties(Constructor, staticProps);
					return Constructor;
				};
			})();

			function _classCallCheck(instance, Constructor) {
				if (!(instance instanceof Constructor)) {
					throw new TypeError("Cannot call a class as a function");
				}
			}

			var GRID_IMAGE =
				"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYAg" +
				"MAAACdGdVrAAAACVBMVEUAAAAtXsUtXcPDDPUWAAAAA3RSTlMAZmHzZFkxAAAAFklEQVQI12M" +
				"AA9bBR3ExhAJB1iooBQBGwgVEs/QtuAAAAABJRU5ErkJggg==";
			/**
			 * Grid plugin that shows a grid on top of the WebSlides for easy prototyping.
			 */

			var Grid = (function() {
				/**
				 * @param {WebSlides} wsInstance The WebSlides instance
				 * @constructor
				 */
				function Grid(wsInstance) {
					_classCallCheck(this, Grid);
					/**
					 * @type {WebSlides}
					 * @private
					 */

					this.ws_ = wsInstance;
					var CSS =
						"body.baseline {\n				  background: url(" +
						GRID_IMAGE +
						") left top .8rem/.8rem;\n				}";
					var head =
						document.head ||
						document.getElementsByTagName("head")[0];
					var style = document.createElement("style");
					style.type = "text/css";

					if (style.styleSheet) {
						style.styleSheet.cssText = CSS;
					} else {
						style.appendChild(document.createTextNode(CSS));
					}

					head.appendChild(style);
					document.addEventListener(
						"keydown",
						this.onKeyPress_.bind(this),
						false
					);
				}
				/**
				 * Reacts to the keydown event. It reacts to ENTER key to toggle the class.
				 * @param {KeyboardEvent} event The key event.
				 * @private
				 */

				_createClass(Grid, [
					{
						key: "onKeyPress_",
						value: function onKeyPress_(event) {
							if (
								event.which ===
								__WEBPACK_IMPORTED_MODULE_0__utils_keys__[
									"a"
									/* default */
								].ENTER
							) {
								document.body.classList.toggle("baseline");
							}
						}
					}
				]);

				return Grid;
			})();
			/* harmony default export */

			__webpack_exports__["a"] = Grid;
			/***/
		},
		/* 12 */

		/***/
		function(module, __webpack_exports__, __webpack_require__) {
			"use strict";

			var _createClass = (function() {
				function defineProperties(target, props) {
					for (var i = 0; i < props.length; i++) {
						var descriptor = props[i];
						descriptor.enumerable = descriptor.enumerable || false;
						descriptor.configurable = true;
						if ("value" in descriptor) descriptor.writable = true;
						Object.defineProperty(
							target,
							descriptor.key,
							descriptor
						);
					}
				}

				return function(Constructor, protoProps, staticProps) {
					if (protoProps)
						defineProperties(Constructor.prototype, protoProps);
					if (staticProps) defineProperties(Constructor, staticProps);
					return Constructor;
				};
			})();

			function _classCallCheck(instance, Constructor) {
				if (!(instance instanceof Constructor)) {
					throw new TypeError("Cannot call a class as a function");
				}
			}

			var HASH = "#slide";
			var slideRegex = /#slide=(\d+)/;
			/**
			 * Static class with methods to manipulate and extract info from the hash of
			 * the URL.
			 */

			var Hash = (function() {
				/**
				 * @param {WebSlides} wsInstance
				 * @constructor
				 */
				function Hash(wsInstance) {
					_classCallCheck(this, Hash);

					this.ws_ = wsInstance;
					wsInstance.el.addEventListener(
						"ws:slide-change",
						Hash.onSlideChange_
					);
					window.addEventListener(
						"hashchange",
						this.onHashChange_.bind(this),
						false
					);
				}
				/**
				 * hashchange event handler, makes the WebSlide instance navigate to the
				 * needed slide.
				 */

				_createClass(
					Hash,
					[
						{
							key: "onHashChange_",
							value: function onHashChange_() {
								var newSlideIndex = Hash.getSlideNumber();

								if (newSlideIndex !== null) {
									this.ws_.goToSlide(newSlideIndex);
								}
							}
							/**
							 * Handler for the slide change event which updates the slide on the hash.
							 * @param {Event} event
							 * @private
							 */
						}
					],
					[
						{
							key: "onSlideChange_",
							value: function onSlideChange_(event) {
								Hash.setSlideNumber(event.detail.currentSlide);
							}
							/**
							 * Gets the slide number from the hash by a regex matching `#slide=` and gets
							 * the number after it. If the number is invalid or less than 0, it will
							 * return null as an invalid value.
							 * @return {?number}
							 */
						},
						{
							key: "getSlideNumber",
							value: function getSlideNumber() {
								var results = document.location.hash.match(
									slideRegex
								);
								var slide = 0;

								if (Array.isArray(results)) {
									slide = parseInt(results[1], 10);
								}

								if (
									typeof slide !== "number" ||
									slide < 0 ||
									!Array.isArray(results)
								) {
									slide = null;
								} else {
									slide--; // Convert to 0 index
								}

								return slide;
							}
							/**
							 * It will update the hash (if it's different) so it reflects the slide
							 * number being visible.
							 * @param {number} number The number of the slide we're transitioning to.
							 */
						},
						{
							key: "setSlideNumber",
							value: function setSlideNumber(number) {
								if (Hash.getSlideNumber() !== number - 1) {
									history.pushState(
										{
											slideI: number - 1
										},
										"Slide " + number,
										HASH + "=" + number
									);
								}
							}
						}
					]
				);

				return Hash;
			})();
			/* harmony default export */

			__webpack_exports__["a"] = Hash;
			/***/
		},
		/* 13 */

		/***/
		function(module, __webpack_exports__, __webpack_require__) {
			"use strict";
			/* harmony import */

			var __WEBPACK_IMPORTED_MODULE_0__utils_keys__ = __webpack_require__(
				2
			);
			/* harmony import */

			var __WEBPACK_IMPORTED_MODULE_1__utils_dom__ = __webpack_require__(
				0
			);

			var _createClass = (function() {
				function defineProperties(target, props) {
					for (var i = 0; i < props.length; i++) {
						var descriptor = props[i];
						descriptor.enumerable = descriptor.enumerable || false;
						descriptor.configurable = true;
						if ("value" in descriptor) descriptor.writable = true;
						Object.defineProperty(
							target,
							descriptor.key,
							descriptor
						);
					}
				}

				return function(Constructor, protoProps, staticProps) {
					if (protoProps)
						defineProperties(Constructor.prototype, protoProps);
					if (staticProps) defineProperties(Constructor, staticProps);
					return Constructor;
				};
			})();

			function _classCallCheck(instance, Constructor) {
				if (!(instance instanceof Constructor)) {
					throw new TypeError("Cannot call a class as a function");
				}
			}
			/**
			 * Keyboard interaction plugin.
			 */

			var Keyboard = (function() {
				/**
				 * @param {WebSlides} wsInstance The WebSlides instance
				 * @constructor
				 */
				function Keyboard(wsInstance) {
					_classCallCheck(this, Keyboard);
					/**
					 * @type {WebSlides}
					 * @private
					 */

					this.ws_ = wsInstance;
					document.addEventListener(
						"keydown",
						this.onKeyPress_.bind(this),
						false
					);
				}
				/**
				 * Reacts to the keydown event. It reacts to the arrows and space key
				 * depending on the layout of the page.
				 * @param {KeyboardEvent} event The key event.
				 * @private
				 */

				_createClass(Keyboard, [
					{
						key: "onKeyPress_",
						value: function onKeyPress_(event) {
							var method = void 0;
							var argument = void 0;

							if (
								__WEBPACK_IMPORTED_MODULE_1__utils_dom__[
									"a"
									/* default */
								].isFocusableElement() ||
								this.ws_.isDisabled()
							) {
								return;
							}

							switch (event.which) {
								case __WEBPACK_IMPORTED_MODULE_0__utils_keys__[
									"a"
									/* default */
								].AV_PAGE:
								case __WEBPACK_IMPORTED_MODULE_0__utils_keys__[
									"a"
									/* default */
								].SPACE:
									method = this.ws_.goNext;
									break;

								case __WEBPACK_IMPORTED_MODULE_0__utils_keys__[
									"a"
									/* default */
								].RE_PAGE:
									method = this.ws_.goPrev;
									break;

								case __WEBPACK_IMPORTED_MODULE_0__utils_keys__[
									"a"
									/* default */
								].HOME:
									method = this.ws_.goToSlide;
									argument = 0;
									break;

								case __WEBPACK_IMPORTED_MODULE_0__utils_keys__[
									"a"
									/* default */
								].END:
									method = this.ws_.goToSlide;
									argument = this.ws_.maxSlide_ - 1;
									break;

								case __WEBPACK_IMPORTED_MODULE_0__utils_keys__[
									"a"
									/* default */
								].DOWN:
									method = this.ws_.isVertical
										? this.ws_.goNext
										: null;
									break;

								case __WEBPACK_IMPORTED_MODULE_0__utils_keys__[
									"a"
									/* default */
								].UP:
									method = this.ws_.isVertical
										? this.ws_.goPrev
										: null;
									break;

								case __WEBPACK_IMPORTED_MODULE_0__utils_keys__[
									"a"
									/* default */
								].LEFT:
									method = !this.ws_.isVertical
										? this.ws_.goPrev
										: null;
									break;

								case __WEBPACK_IMPORTED_MODULE_0__utils_keys__[
									"a"
									/* default */
								].RIGHT:
									method = !this.ws_.isVertical
										? this.ws_.goNext
										: null;
									break;

								case __WEBPACK_IMPORTED_MODULE_0__utils_keys__[
									"a"
									/* default */
								].F:
									method = this.ws_.fullscreen;
									break;
							}

							if (method) {
								method.call(this.ws_, argument); // Prevents Firefox key events.

								event.preventDefault();
							}
						}
					}
				]);

				return Keyboard;
			})();
			/* harmony default export */

			__webpack_exports__["a"] = Keyboard;
			/***/
		},
		/* 14 */

		/***/
		function(module, __webpack_exports__, __webpack_require__) {
			"use strict";
			/* harmony import */

			var __WEBPACK_IMPORTED_MODULE_0__utils_dom__ = __webpack_require__(
				0
			);

			var _createClass = (function() {
				function defineProperties(target, props) {
					for (var i = 0; i < props.length; i++) {
						var descriptor = props[i];
						descriptor.enumerable = descriptor.enumerable || false;
						descriptor.configurable = true;
						if ("value" in descriptor) descriptor.writable = true;
						Object.defineProperty(
							target,
							descriptor.key,
							descriptor
						);
					}
				}

				return function(Constructor, protoProps, staticProps) {
					if (protoProps)
						defineProperties(Constructor.prototype, protoProps);
					if (staticProps) defineProperties(Constructor, staticProps);
					return Constructor;
				};
			})();

			function _classCallCheck(instance, Constructor) {
				if (!(instance instanceof Constructor)) {
					throw new TypeError("Cannot call a class as a function");
				}
			}

			var ELEMENT_ID = {
				NAV: "navigation",
				NEXT: "next",
				PREV: "previous",
				COUNTER: "counter"
			};
			var LABELS = {
				VERTICAL: {
					NEXT: "↓",
					PREV: "↑"
				},
				HORIZONTAL: {
					NEXT: "→",
					PREV: "←"
				}
			};
			/**
			 * Navigation plugin.
			 */

			var Navigation = (function() {
				/**
				 * @param {WebSlides} wsInstance The WebSlides instance
				 * @constructor
				 */
				function Navigation(wsInstance) {
					_classCallCheck(this, Navigation);

					var arrowLabels = wsInstance.isVertical
						? LABELS.VERTICAL
						: LABELS.HORIZONTAL;
					/**
					 * Navigation element.
					 * @type {Element}
					 */

					this.el = __WEBPACK_IMPORTED_MODULE_0__utils_dom__[
						"a"
						/* default */
					].createNode("div", "navigation");
					/**
					 * Next button.
					 * @type {Element}
					 */

					this.next = Navigation.createArrow(
						ELEMENT_ID.NEXT,
						arrowLabels.NEXT
					);
					/**
					 * Prev button.
					 * @type {Element}
					 */

					this.prev = Navigation.createArrow(
						ELEMENT_ID.PREV,
						arrowLabels.PREV
					);
					/**
					 * Counter Element.
					 * @type {Element}
					 */

					this.counter = Navigation.createCounter(
						ELEMENT_ID.COUNTER,
						wsInstance
					);
					/**
					 * @type {WebSlides}
					 * @private
					 */

					this.ws_ = wsInstance;
					this.el.appendChild(this.next);
					this.el.appendChild(this.prev);
					this.el.appendChild(this.counter);
					this.ws_.el.appendChild(this.el);
					this.bindEvents_();
				}
				/**
				 * Bind all events for the navigation.
				 * @private
				 */

				_createClass(
					Navigation,
					[
						{
							key: "bindEvents_",
							value: function bindEvents_() {
								this.ws_.el.addEventListener(
									"ws:slide-change",
									this.onSlideChanged_.bind(this)
								);
								this.next.addEventListener(
									"click",
									this.onButtonClicked_.bind(this)
								);
								this.prev.addEventListener(
									"click",
									this.onButtonClicked_.bind(this)
								);
								this.counter.addEventListener(
									"click",
									this.onButtonClicked_.bind(this)
								);
							}
							/**
							 * Updates the counter inside the navigation.
							 * @param {string|number} current Current slide number.
							 * @param {string|number} max Max slide number.
							 */
						},
						{
							key: "updateCounter",
							value: function updateCounter(current, max) {
								if (this.ws_.options.showIndex) {
									this.counter.childNodes[0].textContent =
										current + " / " + max;
								} else {
									this.counter.textContent =
										current + " / " + max;
								}
							}
							/**
							 * Creates an arrow to navigate.
							 * @param {!String} id Desired ID for the arrow.
							 * @param {!String} text Desired text for the arrow.
							 * @return {Element} The arrow element.
							 */
						},
						{
							key: "onSlideChanged_",

							/**
							 * Slide Change event handler. Will update the text on the navigation.
							 * @param {CustomEvent} event
							 * @private
							 */
							value: function onSlideChanged_(event) {
								this.updateCounter(
									event.detail.currentSlide,
									event.detail.slides
								);
							}
							/**
							 * Handles clicks on the next/prev buttons.
							 * @param {MouseEvent} event
							 * @private
							 */
						},
						{
							key: "onButtonClicked_",
							value: function onButtonClicked_(event) {
								event.preventDefault();

								if (event.target === this.next) {
									this.ws_.goNext();
								} else if (event.target === this.prev) {
									this.ws_.goPrev();
								} else {
									this.ws_.toggleZoom();
								}
							}
						}
					],
					[
						{
							key: "createArrow",
							value: function createArrow(id, text) {
								var arrow = __WEBPACK_IMPORTED_MODULE_0__utils_dom__[
									"a"
									/* default */
								].createNode("a", id, text);

								arrow.href = "#";
								arrow.title = "Arrow Keys";
								return arrow;
							}
							/**
							 * Creates the navigation counter.
							 * @param {!String} id Desired ID for the counter.
							 * @param {WebSlides} ws_ WebSlides object.
							 * @return {Element} The arrow element.
							 */
						},
						{
							key: "createCounter",
							value: function createCounter(id, ws_) {
								var counter = __WEBPACK_IMPORTED_MODULE_0__utils_dom__[
									"a"
									/* default */
								].createNode("span", id);

								if (ws_.options.showIndex) {
									var link = document.createElement("a");
									link.href = "#";
									link.title = "View all slides";
									counter.appendChild(link);
								}

								return counter;
							}
						}
					]
				);

				return Navigation;
			})();
			/* harmony default export */

			__webpack_exports__["a"] = Navigation;
			/***/
		},
		/* 15 */

		/***/
		function(module, __webpack_exports__, __webpack_require__) {
			"use strict";
			/* harmony import */

			var __WEBPACK_IMPORTED_MODULE_0__utils_mobile_detector__ = __webpack_require__(
				3
			);

			var _createClass = (function() {
				function defineProperties(target, props) {
					for (var i = 0; i < props.length; i++) {
						var descriptor = props[i];
						descriptor.enumerable = descriptor.enumerable || false;
						descriptor.configurable = true;
						if ("value" in descriptor) descriptor.writable = true;
						Object.defineProperty(
							target,
							descriptor.key,
							descriptor
						);
					}
				}

				return function(Constructor, protoProps, staticProps) {
					if (protoProps)
						defineProperties(Constructor.prototype, protoProps);
					if (staticProps) defineProperties(Constructor, staticProps);
					return Constructor;
				};
			})();

			function _classCallCheck(instance, Constructor) {
				if (!(instance instanceof Constructor)) {
					throw new TypeError("Cannot call a class as a function");
				}
			}
			/**
			 * Scroll plugin.
			 */

			var Scroll = (function() {
				/**
				 * @param {WebSlides} wsInstance The WebSlides instance
				 * @constructor
				 */
				function Scroll(wsInstance) {
					_classCallCheck(this, Scroll);
					/**
					 * @type {WebSlides}
					 * @private
					 */

					this.ws_ = wsInstance;
					/**
					 * Where the scroll is going to happen. The WebSlides element.
					 * @type {Element}
					 * @private
					 */

					this.scrollContainer_ = wsInstance.el;
					/**
					 * Whether movement is happening up or down.
					 * @type {boolean}
					 * @private
					 */

					this.isGoingUp_ = false;
					/**
					 * Whether movement is happening left or right.
					 * @type {boolean}
					 * @private
					 */

					this.isGoingLeft_ = false;
					/**
					 * Timeout id holder.
					 * @type {?number}
					 * @private
					 */

					this.timeout_ = null; // Disabling from option

					if (!this.ws_.options.navigateOnScroll) {
						return;
					}

					if (
						!__WEBPACK_IMPORTED_MODULE_0__utils_mobile_detector__[
							"a"
							/* default */
						].isAny()
					) {
						this.scrollContainer_.addEventListener(
							"wheel",
							this.onMouseWheel_.bind(this)
						);

						if (!wsInstance.isVertical) {
							wsInstance.el.addEventListener(
								"ws:slide-change",
								this.onSlideChange_.bind(this)
							);
						}
					}
				}
				/**
				 * When the slides change, set an inner timeout to avoid prematurely
				 * changing to the next slide again.
				 * @private
				 */

				_createClass(Scroll, [
					{
						key: "onSlideChange_",
						value: function onSlideChange_() {
							var _this = this;

							this.timeout_ = setTimeout(function() {
								_this.timeout_ = null;
							}, this.ws_.options.scrollWait);
						}
						/**
						 * Reacts to the wheel event. Detects whether is going up or down and decides
						 * if it needs to move the slide based on the amount of delta.
						 * @param {WheelEvent} event The Wheel Event.
						 * @private
						 */
					},
					{
						key: "onMouseWheel_",
						value: function onMouseWheel_(event) {
							if (this.ws_.isDisabled()) {
								return;
							}

							if (this.ws_.isMoving || this.timeout_) {
								event.preventDefault();
								return;
							} // Firefox uses lines instead of pixels for delta

							var linesToPx =
								event.deltaMode *
								this.ws_.options.minWheelDelta;
							var wheelDeltaY = event.deltaY,
								wheelDeltaX = event.deltaX;
							var isVertical = this.ws_.isVertical;
							var isHorizontalMovement =
								Math.abs(wheelDeltaX) > Math.abs(wheelDeltaY);
							this.isGoingUp_ = wheelDeltaY < 0;
							this.isGoingLeft_ = wheelDeltaX < 0; // If we're mainly moving horizontally, prevent default

							if (isHorizontalMovement) {
								if (!isVertical) {
									event.preventDefault();
								} else {
									// If we're moving horizontally but this is vertical, return to avoid
									// unwanted navigation.
									return;
								}
							}

							if (
								Math.abs(wheelDeltaY + linesToPx) >=
									this.ws_.options.minWheelDelta ||
								Math.abs(wheelDeltaX + linesToPx) >=
									this.ws_.options.minWheelDelta
							) {
								if (
									(isHorizontalMovement &&
										this.isGoingLeft_) ||
									(!isHorizontalMovement && this.isGoingUp_)
								) {
									this.ws_.goPrev();
								} else {
									this.ws_.goNext();
								}

								event.preventDefault();
							}
						}
					}
				]);

				return Scroll;
			})();
			/* harmony default export */

			__webpack_exports__["a"] = Scroll;
			/***/
		},
		/* 16 */

		/***/
		function(module, __webpack_exports__, __webpack_require__) {
			"use strict";
			/* harmony import */

			var __WEBPACK_IMPORTED_MODULE_0__utils_mobile_detector__ = __webpack_require__(
				3
			);

			var _createClass = (function() {
				function defineProperties(target, props) {
					for (var i = 0; i < props.length; i++) {
						var descriptor = props[i];
						descriptor.enumerable = descriptor.enumerable || false;
						descriptor.configurable = true;
						if ("value" in descriptor) descriptor.writable = true;
						Object.defineProperty(
							target,
							descriptor.key,
							descriptor
						);
					}
				}

				return function(Constructor, protoProps, staticProps) {
					if (protoProps)
						defineProperties(Constructor.prototype, protoProps);
					if (staticProps) defineProperties(Constructor, staticProps);
					return Constructor;
				};
			})();

			function _classCallCheck(instance, Constructor) {
				if (!(instance instanceof Constructor)) {
					throw new TypeError("Cannot call a class as a function");
				}
			}

			var EVENTS = {
				touch: {
					START: "touchstart",
					MOVE: "touchmove",
					END: "touchend"
				},
				pointer: {
					START: "pointerdown",
					MOVE: "pointermove",
					END: "pointerup"
				}
			};
			/**
			 * Touch plugin.
			 */

			var Touch = (function() {
				/**
				 * @param {WebSlides} wsInstance The WebSlides instance
				 * @constructor
				 */
				function Touch(wsInstance) {
					_classCallCheck(this, Touch);
					/**
					 * @type {WebSlides}
					 * @private
					 */

					this.ws_ = wsInstance;
					/**
					 * Start position for the X coordinate.
					 * @type {number}
					 * @private
					 */

					this.startX_ = 0;
					/**
					 * Start position for the Y coordinate.
					 * @type {number}
					 * @private
					 */

					this.startY_ = 0;
					/**
					 * Start position for the X coord.
					 * @type {number}
					 * @private
					 */

					this.endX_ = 0;
					/**
					 * Start position for the Y coord.
					 * @type {number}
					 * @private
					 */

					this.endY_ = 0;
					/**
					 * Whether is enabled or not. Only enabled for touch devices.
					 * @type {boolean}
					 * @private
					 */

					this.isEnabled = false;
					/**
					 * Whether is a gesture or not.
					 * @type {boolean}
					 * @private
					 */

					this.isGesture = false;
					/**
					 * Stores start touch event (x, y).
					 * @type {array}
					 * @private
					 */

					this.startTouches = [];
					/**
					 * Stores end touch event (x, y).
					 * @type {array}
					 * @private
					 */

					this.endTouches = [];
					var events = void 0;

					if (
						__WEBPACK_IMPORTED_MODULE_0__utils_mobile_detector__[
							"a"
							/* default */
						].isAny()
					) {
						// Likely IE
						if (
							window.PointerEvent &&
							(__WEBPACK_IMPORTED_MODULE_0__utils_mobile_detector__[
								"a"
								/* default */
							].isWindows() ||
								__WEBPACK_IMPORTED_MODULE_0__utils_mobile_detector__[
									"a"
									/* default */
								].isWindowsPhone())
						) {
							events = EVENTS.pointer;
						} else {
							events = EVENTS.touch;
						}

						this.isEnabled = true;
						document.addEventListener(
							events.START,
							this.onStart_.bind(this),
							false
						);
						document.addEventListener(
							events.MOVE,
							this.onMove_.bind(this),
							false
						);
						document.addEventListener(
							events.END,
							this.onStop_.bind(this),
							false
						);
					}
				}
				/**
				 * Start touch handler. Saves starting points.
				 * @param {Event} event The Touch event.
				 * @private
				 */

				_createClass(
					Touch,
					[
						{
							key: "onStart_",
							value: function onStart_(event) {
								if (this.ws_.isDisabled()) {
									return;
								}

								var info = Touch.normalizeEventInfo(event);

								if (event.touches.length === 1) {
									this.startX_ = info.x;
									this.startY_ = info.y;
									this.endX_ = info.x;
									this.endY_ = info.y;
								} else if (event.touches.length > 1) {
									this.startTouches = Touch.getTouchCoordinates(
										event
									);
									this.endTouches = this.startTouches;
									this.isGesture = true;
								}
							}
							/**
							 * Move touch handler. Saves end points.
							 * @param {Event} event The Touch event.
							 * @private
							 */
						},
						{
							key: "onMove_",
							value: function onMove_(event) {
								if (this.ws_.isDisabled()) {
									return;
								}

								var info = Touch.normalizeEventInfo(event);

								if (this.isGesture) {
									this.endTouches = Touch.getTouchCoordinates(
										event
									);
								} else {
									this.endX_ = info.x;
									this.endY_ = info.y;
								}
							}
							/**
							 * Stop touch handler. Checks if it needs to make any actions.
							 * @private
							 */
						},
						{
							key: "onStop_",
							value: function onStop_() {
								if (this.ws_.isDisabled()) {
									return;
								}

								if (this.isGesture) {
									var startDistance = Math.sqrt(
										Math.pow(
											this.startTouches[0].x -
												this.startTouches[1].x,
											2
										) +
											Math.pow(
												this.startTouches[0].y -
													this.startTouches[1].y,
												2
											)
									);
									var endDistance = Math.sqrt(
										Math.pow(
											this.endTouches[0].x -
												this.endTouches[1].x,
											2
										) +
											Math.pow(
												this.endTouches[0].y -
													this.endTouches[1].y,
												2
											)
									);

									if (startDistance > endDistance) {
										// Pinch gesture
										this.ws_.toggleZoom();
									}

									this.isGesture = false;
								} else {
									var diffX = this.startX_ - this.endX_;
									var diffY = this.startY_ - this.endY_; // It's an horizontal drag

									if (Math.abs(diffX) > Math.abs(diffY)) {
										if (
											diffX <
											-this.ws_.options.slideOffset
										) {
											this.ws_.goPrev();
										} else if (
											diffX > this.ws_.options.slideOffset
										) {
											this.ws_.goNext();
										}
									}
								}
							}
							/**
							 * Get X,Y coordinates from touch pointers.
							 * @param {Event} event
							 * @return {Object}
							 */
						}
					],
					[
						{
							key: "getTouchCoordinates",
							value: function getTouchCoordinates(event) {
								return [
									{
										x: event.touches[0].clientX,
										y: event.touches[0].clientY
									},
									{
										x: event.touches[1].clientX,
										y: event.touches[1].clientY
									}
								];
							}
							/**
							 * Normalizes an event to deal with differences between PointerEvent and
							 * TouchEvent.
							 * @param {Event} event
							 * @return {Object} Normalised touch points.
							 */
						},
						{
							key: "normalizeEventInfo",
							value: function normalizeEventInfo(event) {
								var touchEvent = {
									pageX: 0,
									pageY: 0
								};

								if (
									typeof event.changedTouches !== "undefined"
								) {
									touchEvent = event.changedTouches[0];
								} else if (
									typeof event.originalEvent !==
										"undefined" &&
									typeof event.originalEvent
										.changedTouches !== "undefined"
								) {
									touchEvent =
										event.originalEvent.changedTouches[0];
								}

								var x =
									event.offsetX ||
									event.layerX ||
									touchEvent.pageX;
								var y =
									event.offsetY ||
									event.layerY ||
									touchEvent.pageY;
								return {
									x: x,
									y: y
								};
							}
						}
					]
				);

				return Touch;
			})();
			/* harmony default export */

			__webpack_exports__["a"] = Touch;
			/***/
		},
		/* 17 */

		/***/
		function(module, __webpack_exports__, __webpack_require__) {
			"use strict";
			/* harmony import */

			var __WEBPACK_IMPORTED_MODULE_0__utils_dom__ = __webpack_require__(
				0
			);
			/* harmony import */

			var __WEBPACK_IMPORTED_MODULE_1__modules_slide__ = __webpack_require__(
				1
			);

			var _createClass = (function() {
				function defineProperties(target, props) {
					for (var i = 0; i < props.length; i++) {
						var descriptor = props[i];
						descriptor.enumerable = descriptor.enumerable || false;
						descriptor.configurable = true;
						if ("value" in descriptor) descriptor.writable = true;
						Object.defineProperty(
							target,
							descriptor.key,
							descriptor
						);
					}
				}

				return function(Constructor, protoProps, staticProps) {
					if (protoProps)
						defineProperties(Constructor.prototype, protoProps);
					if (staticProps) defineProperties(Constructor, staticProps);
					return Constructor;
				};
			})();

			function _classCallCheck(instance, Constructor) {
				if (!(instance instanceof Constructor)) {
					throw new TypeError("Cannot call a class as a function");
				}
			}
			/**
			 * Video plugin. Video plugin that allows to autoplay videos once the slide gets
			 * active.
			 */

			var Video = (function() {
				/**
				 * @param {WebSlides} wsInstance The WebSlides instance.
				 * @constructor
				 */
				function Video(wsInstance) {
					_classCallCheck(this, Video);
					/**
					 * @type {WebSlides}
					 * @private
					 */

					this.ws_ = wsInstance;

					var videos = __WEBPACK_IMPORTED_MODULE_0__utils_dom__[
						"a"
						/* default */
					].toArray(this.ws_.el.querySelectorAll("video"));

					if (videos.length) {
						videos.forEach(function(video) {
							if (!video.hasAttribute("autoplay")) {
								return;
							}

							video.removeAttribute("autoplay");
							video.pause();
							video.currentTime = 0;

							var _Slide$getSectionFrom = __WEBPACK_IMPORTED_MODULE_1__modules_slide__[
									"b"
									/* default */
								].getSectionFromEl(video),
								i = _Slide$getSectionFrom.i;

							var slide = wsInstance.slides[i - 1];
							slide.video = video;
							slide.el.addEventListener(
								__WEBPACK_IMPORTED_MODULE_1__modules_slide__[
									"a"
									/* Events */
								].ENABLE,
								Video.onSectionEnabled
							);
							slide.el.addEventListener(
								__WEBPACK_IMPORTED_MODULE_1__modules_slide__[
									"a"
									/* Events */
								].DISABLE,
								Video.onSectionDisabled
							);
						});
					}
				}
				/**
				 * On Section enable hook. Will play the video.
				 * @param {CustomEvent} event
				 */

				_createClass(Video, null, [
					{
						key: "onSectionEnabled",
						value: function onSectionEnabled(event) {
							event.detail.slide.video.play();
						}
						/**
						 * On Section enable hook. Will pause the video.
						 * @param {CustomEvent} event
						 */
					},
					{
						key: "onSectionDisabled",
						value: function onSectionDisabled(event) {
							event.detail.slide.video.pause();
						}
					}
				]);

				return Video;
			})();
			/* harmony default export */

			__webpack_exports__["a"] = Video;
			/***/
		},
		/* 18 */

		/***/
		function(module, __webpack_exports__, __webpack_require__) {
			"use strict";
			/* harmony import */

			var __WEBPACK_IMPORTED_MODULE_0__utils_dom__ = __webpack_require__(
				0
			);
			/* harmony import */

			var __WEBPACK_IMPORTED_MODULE_1__modules_slide__ = __webpack_require__(
				1
			);

			var _createClass = (function() {
				function defineProperties(target, props) {
					for (var i = 0; i < props.length; i++) {
						var descriptor = props[i];
						descriptor.enumerable = descriptor.enumerable || false;
						descriptor.configurable = true;
						if ("value" in descriptor) descriptor.writable = true;
						Object.defineProperty(
							target,
							descriptor.key,
							descriptor
						);
					}
				}

				return function(Constructor, protoProps, staticProps) {
					if (protoProps)
						defineProperties(Constructor.prototype, protoProps);
					if (staticProps) defineProperties(Constructor, staticProps);
					return Constructor;
				};
			})();

			function _classCallCheck(instance, Constructor) {
				if (!(instance instanceof Constructor)) {
					throw new TypeError("Cannot call a class as a function");
				}
			}
			/* global YT */

			/**
			 * Player wrapper around the YT player. This is mostly to get around the event
			 * in which we need to play a video which player isn't ready yet.
			 */

			var Player = (function() {
				/**
				 * @param {Element} el
				 */
				function Player(el) {
					_classCallCheck(this, Player);
					/**
					 * Whether the Player is ready or not.
					 * @type {boolean}
					 */

					this.ready = false;
					/**
					 * Ready callback.
					 * @type {?function}
					 */

					this.onReadyCb = null;
					/**
					 * Slide element in which the video is located.
					 * @type {Node}
					 */

					this.slide = __WEBPACK_IMPORTED_MODULE_1__modules_slide__[
						"b"
						/* default */
					].getSectionFromEl(el).section;
					/**
					 * Whether it should autoplay on load or not.
					 * @type {boolean}
					 */

					this.autoplay = typeof el.dataset.autoplay !== "undefined";
					/**
					 * Whether the video should be muted or not.
					 * @type {boolean}
					 */

					this.isMuted = typeof el.dataset.mute !== "undefined";
					/**
					 * Options with which the player is created.
					 * @type {Object}
					 */

					this.options = {
						videoId: el.dataset.youtubeId,
						playerVars: this.getPlayerVars(el),
						events: {
							onReady: this.onPlayerReady.bind(this)
						}
					};
					/**
					 * The iframe in which the video is loaded.
					 * @type {Element}
					 */

					this.el = el;
					/**
					 * Timeout id.
					 * @type {?number}
					 */

					this.timeout = null;
					this.create();
				}
				/**
				 * Destroys the iframe. Saves the current time in case it gets restored.
				 */

				_createClass(Player, [
					{
						key: "destroy",
						value: function destroy() {
							this.currentTime = this.player.getCurrentTime();
							this.player.destroy();
							this.player = null;
							this.el = this.slide.querySelector(
								"[data-youtube]"
							);
							this.ready = false;
						}
						/**
						 * Creates the player.
						 */
					},
					{
						key: "create",
						value: function create() {
							this.player = new YT.Player(this.el, this.options);
							this.el = this.player.getIframe();
						}
						/**
						 * Player ready callback. Will play the video if it was intended to be played
						 * and will also call any pending callbacks.
						 */
					},
					{
						key: "onPlayerReady",
						value: function onPlayerReady() {
							this.ready = true; // Restoring the current time if saved

							if (this.currentTime) {
								this.player.seekTo(this.currentTime, true);
								this.player.pauseVideo();
								this.currentTime = null;
							}

							if (
								this.timeout &&
								this.player.getPlayerState() !== 1
							) {
								this.play();
							}

							if (this.onReadyCb) {
								this.onReadyCb();
								this.onReadyCb = null;
							}
						}
						/**
						 * Plays the video.
						 */
					},
					{
						key: "play",
						value: function play() {
							var _this = this;

							if (this.ready) {
								this.timeout = setTimeout(function() {
									_this.timeout = null;
								}, 1000);

								if (this.isMuted) {
									this.player.mute();
								} else {
									this.player.unMute();
								}

								this.player.playVideo();
							} else {
								this.onReadyCb = this.play;
							}
						}
						/**
						 * Pause playing the video if it's already playing.
						 */
					},
					{
						key: "pause",
						value: function pause() {
							if (
								this.player &&
								this.player.pauseVideo &&
								this.player.getPlayerState() === 1
							) {
								this.player.pauseVideo();
							}
						}
						/**
						 * Parses the element to have the proper variables.
						 * @param {Element} element
						 * @return {Object} Player variables.
						 */
					},
					{
						key: "getPlayerVars",
						value: function getPlayerVars(element) {
							var vars = {
								modestbranding: 1,
								rel: 0,
								origin: window.location.origin
							};

							if (this.slide.classList.contains("fullscreen")) {
								// Disabling keyboard interaction for fullscreenvideos
								vars.disablekb = 1;
							}

							if (
								typeof element.dataset.noControls !==
								"undefined"
							) {
								vars.controls = 0;
								vars.showinfo = 0;
							}

							if (typeof element.dataset.loop !== "undefined") {
								vars.loop = 1;
								vars.playlist = element.dataset.youtubeId;
							}

							return vars;
						}
					}
				]);

				return Player;
			})();
			/**
			 * Video plugin.
			 */

			var YouTube = (function() {
				/**
				 * Grid plugin that shows a grid on top of the WebSlides for easy prototyping.
				 * @param {WebSlides} wsInstance The WebSlides instance
				 */
				function YouTube(wsInstance) {
					_classCallCheck(this, YouTube);
					/**
					 * @type {WebSlides}
					 * @private
					 */

					this.ws_ = wsInstance;
					this.videos = __WEBPACK_IMPORTED_MODULE_0__utils_dom__[
						"a"
						/* default */
					].toArray(this.ws_.el.querySelectorAll("[data-youtube]"));

					if (this.videos.length) {
						this.inject();
					}
				}
				/**
				 * Once the YouTube API is ready this gets called so we can start the videos.
				 */

				_createClass(
					YouTube,
					[
						{
							key: "onYTReady",
							value: function onYTReady() {
								var _this2 = this;

								this.videos.forEach(function(video) {
									var player = new Player(video);

									if (
										typeof video.dataset.autoplay !==
										"undefined"
									) {
										var _Slide$getSectionFrom = __WEBPACK_IMPORTED_MODULE_1__modules_slide__[
												"b"
												/* default */
											].getSectionFromEl(player.el),
											i = _Slide$getSectionFrom.i;

										var slide = _this2.ws_.slides[i - 1];
										slide.player = player;
										slide.el.addEventListener(
											__WEBPACK_IMPORTED_MODULE_1__modules_slide__[
												"a"
												/* Events */
											].ENABLE,
											YouTube.onSlideEvent
										);
										slide.el.addEventListener(
											__WEBPACK_IMPORTED_MODULE_1__modules_slide__[
												"a"
												/* Events */
											].DISABLE,
											YouTube.onSlideEvent
										);
										slide.el.addEventListener(
											__WEBPACK_IMPORTED_MODULE_1__modules_slide__[
												"a"
												/* Events */
											].ENTER,
											YouTube.onSlideEvent
										);
										slide.el.addEventListener(
											__WEBPACK_IMPORTED_MODULE_1__modules_slide__[
												"a"
												/* Events */
											].LEAVE,
											YouTube.onSlideEvent
										);

										if (
											_this2.ws_.currentSlide_ === slide
										) {
											YouTube.onSectionEnabled(slide);
										}
									}
								});
							}
							/**
							 * Injects the YouTube iFrame API into the page.
							 */
						},
						{
							key: "inject",
							value: function inject() {
								window.onYouTubeIframeAPIReady = this.onYTReady.bind(
									this
								);
								var tag = document.createElement("script");
								tag.src = "https://www.youtube.com/iframe_api";
								var firstScriptTag = document.getElementsByTagName(
									"script"
								)[0];
								firstScriptTag.parentNode.insertBefore(
									tag,
									firstScriptTag
								);
							}
							/**
							 * Reacts to any event on the slide.
							 * @param {CustomEvent} event
							 */
						}
					],
					[
						{
							key: "onSlideEvent",
							value: function onSlideEvent(event) {
								var slide = event.detail.slide;

								switch (event.type) {
									case __WEBPACK_IMPORTED_MODULE_1__modules_slide__[
										"a"
										/* Events */
									].ENABLE:
										YouTube.onSectionEnabled(slide);
										break;

									case __WEBPACK_IMPORTED_MODULE_1__modules_slide__[
										"a"
										/* Events */
									].DISABLE:
										YouTube.onSectionDisabled(slide);
										break;

									case __WEBPACK_IMPORTED_MODULE_1__modules_slide__[
										"a"
										/* Events */
									].LEAVE:
										slide.player.destroy();
										break;

									case __WEBPACK_IMPORTED_MODULE_1__modules_slide__[
										"a"
										/* Events */
									].ENTER:
										slide.player.create();
										break;
								}
							}
							/**
							 * On Section enable hook. Will play the video.
							 * @param {Slide} slide
							 */
						},
						{
							key: "onSectionEnabled",
							value: function onSectionEnabled(slide) {
								if (slide.player.autoplay) {
									slide.player.play();
								}
							}
							/**
							 * On Section enable hook. Will pause the video.
							 * @param {Slide} slide
							 */
						},
						{
							key: "onSectionDisabled",
							value: function onSectionDisabled(slide) {
								slide.player.pause();
							}
						}
					]
				);

				return YouTube;
			})();
			/* harmony default export */

			__webpack_exports__["a"] = YouTube;
			/***/
		},
		/* 19 */

		/***/
		function(module, __webpack_exports__, __webpack_require__) {
			"use strict";
			/* harmony import */

			var __WEBPACK_IMPORTED_MODULE_0__utils_dom__ = __webpack_require__(
				0
			);
			/* harmony import */

			var __WEBPACK_IMPORTED_MODULE_1__utils_keys__ = __webpack_require__(
				2
			);
			/* harmony import */

			var __WEBPACK_IMPORTED_MODULE_2__utils_scroll_to__ = __webpack_require__(
				4
			);
			/* harmony import */

			var __WEBPACK_IMPORTED_MODULE_3__modules_slide__ = __webpack_require__(
				1
			);

			var _createClass = (function() {
				function defineProperties(target, props) {
					for (var i = 0; i < props.length; i++) {
						var descriptor = props[i];
						descriptor.enumerable = descriptor.enumerable || false;
						descriptor.configurable = true;
						if ("value" in descriptor) descriptor.writable = true;
						Object.defineProperty(
							target,
							descriptor.key,
							descriptor
						);
					}
				}

				return function(Constructor, protoProps, staticProps) {
					if (protoProps)
						defineProperties(Constructor.prototype, protoProps);
					if (staticProps) defineProperties(Constructor, staticProps);
					return Constructor;
				};
			})();

			function _classCallCheck(instance, Constructor) {
				if (!(instance instanceof Constructor)) {
					throw new TypeError("Cannot call a class as a function");
				}
			}

			var CLASSES = {
				ZOOM: "grid",
				DIV: "column",
				WRAP: "wrap-zoom",
				WRAP_CONTAINER: "wrap",
				CURRENT: "current",
				SLIDE: "slide",
				ZOOM_ENABLED: "ws-ready-zoom"
			};
			var ID = "webslides-zoomed";
			/**
			 * Zoom plugin.
			 */

			var Zoom = (function() {
				/**
				 * @param {WebSlides} wsInstance The WebSlides instance
				 * @constructor
				 */
				function Zoom(wsInstance) {
					_classCallCheck(this, Zoom);
					/**
					 * @type {WebSlides}
					 * @private
					 */

					this.ws_ = wsInstance;
					/**
					 * @type {WebSlides}
					 * @private
					 */

					this.zws_ = {};
					/**
					 * @type {boolean}
					 * @private
					 */

					this.isZoomed_ = false;
					this.preBuildZoom_();
					document.body.addEventListener(
						"keydown",
						this.onKeyDown.bind(this)
					);
				}
				/**
				 * On key down handler. Will decide if Zoom in or out
				 * @param {Event} event Key down event.
				 */

				_createClass(Zoom, [
					{
						key: "onKeyDown",
						value: function onKeyDown(event) {
							if (
								!this.isZoomed_ &&
								__WEBPACK_IMPORTED_MODULE_1__utils_keys__[
									"a"
									/* default */
								].MINUS.some(function(key) {
									return key === event.which;
								})
							) {
								this.zoomIn();
							} else if (
								this.isZoomed_ &&
								(__WEBPACK_IMPORTED_MODULE_1__utils_keys__[
									"a"
									/* default */
								].PLUS.some(function(key) {
									return key === event.which;
								}) ||
									event.which ===
										__WEBPACK_IMPORTED_MODULE_1__utils_keys__[
											"a"
											/* default */
										].ESCAPE)
							) {
								this.zoomOut();
							}
						}
						/**
						 * Prepare zoom structure, scales the slides and uses a grid layout
						 * to show them.
						 */
					},
					{
						key: "preBuildZoom_",
						value: function preBuildZoom_() {
							var _this = this; // Clone #webslides element

							this.zws_.el = this.ws_.el.cloneNode();
							this.zws_.el.id = ID;
							this.zws_.wrap = __WEBPACK_IMPORTED_MODULE_0__utils_dom__[
								"a"
								/* default */
							].createNode("div");
							this.zws_.wrap.className = CLASSES.WRAP_CONTAINER;
							this.zws_.el.appendChild(this.zws_.wrap);
							this.zws_.grid = __WEBPACK_IMPORTED_MODULE_0__utils_dom__[
								"a"
								/* default */
							].createNode("div");
							this.zws_.grid.className = CLASSES.ZOOM;
							this.zws_.wrap.appendChild(this.zws_.grid);
							this.zws_.el.addEventListener("click", function() {
								return _this.toggleZoom();
							}); // Clone the slides

							this.zws_.slides = [].map.call(
								this.ws_.slides,
								function(slide, i) {
									var s_ = slide.el.cloneNode(true);

									_this.zws_.grid.appendChild(s_);

									return new __WEBPACK_IMPORTED_MODULE_3__modules_slide__[
										"b"
										/* default */
									](s_, i);
								}
							);
							this.disable();

							__WEBPACK_IMPORTED_MODULE_0__utils_dom__[
								"a"
								/* default */
							].after(this.zws_.el, this.ws_.el); // Creates the container for each slide

							this.zws_.slides.forEach(function(elem) {
								return _this.createSlideBlock_(elem);
							});
						}
						/**
						 * Creates a block structure around the slide.
						 * @param {Element} elem slide element.
						 */
					},
					{
						key: "createSlideBlock_",
						value: function createSlideBlock_(elem) {
							var _this2 = this; // Wraps the slide around a container

							var wrap = __WEBPACK_IMPORTED_MODULE_0__utils_dom__[
								"a"
								/* default */
							].wrap(elem.el, "div");

							wrap.className = CLASSES.WRAP;
							wrap.setAttribute(
								"id",
								"zoomed-" + elem.el.getAttribute("id")
							); // Slide container, need due to flexbox styles

							var div = __WEBPACK_IMPORTED_MODULE_0__utils_dom__[
								"a"
								/* default */
							].wrap(wrap, "div");

							div.className = CLASSES.DIV; // Adding some layer for controlling click events

							var divLayer = __WEBPACK_IMPORTED_MODULE_0__utils_dom__[
								"a"
								/* default */
							].createNode("div");

							divLayer.className = "zoom-layer";
							divLayer.addEventListener("click", function(e) {
								e.stopPropagation();

								_this2.zoomOut();

								_this2.ws_.goToSlide(elem.i);
							});
							wrap.appendChild(divLayer); // Slide number

							var slideNumber = __WEBPACK_IMPORTED_MODULE_0__utils_dom__[
								"a"
								/* default */
							].createNode("p", "", "" + (elem.i + 1));

							slideNumber.className = "text-slide-number";
							div.appendChild(slideNumber);
						}
						/**
						 * Toggles zoom.
						 */
					},
					{
						key: "toggleZoom",
						value: function toggleZoom() {
							if (this.isZoomed_) {
								this.zoomOut();
							} else {
								this.zoomIn();
							}
						}
						/**
						 * Zoom In the slider, scales the slides and uses a grid layout to show them.
						 */
					},
					{
						key: "zoomIn",
						value: function zoomIn() {
							var _this3 = this;

							if (!this.ws_.options.showIndex) return;
							this.enable();
							var currentId = this.ws_.currentSlide_.el.id;
							var zoomedCurrent = this.zws_.el.querySelector(
								"." + CLASSES.WRAP + "." + CLASSES.CURRENT
							);

							if (zoomedCurrent) {
								zoomedCurrent.classList.remove(CLASSES.CURRENT);
							}

							var actualCurrent = this.zws_.el.querySelector(
								"#zoomed-" + currentId
							);
							actualCurrent.classList.add(CLASSES.CURRENT);
							this.isZoomed_ = true;
							document.documentElement.classList.add(
								CLASSES.ZOOM_ENABLED
							);
							setTimeout(function() {
								_this3.ws_.disable();

								_this3.zws_.el.classList.add("in");

								var wrapCSS = window.getComputedStyle(
									_this3.zws_.grid
								);
								var scrollingElement = document.body;
								Object(
									__WEBPACK_IMPORTED_MODULE_2__utils_scroll_to__[
										"a"
										/* default */
									]
								)(
									actualCurrent.parentNode.offsetTop +
										__WEBPACK_IMPORTED_MODULE_0__utils_dom__[
											"a"
											/* default */
										].parseSize(wrapCSS.paddingTop),
									50,
									function() {},
									scrollingElement
								);
							}, 50);
						}
						/**
						 * Zoom Out the slider, remove scale from the slides.
						 */
					},
					{
						key: "zoomOut",
						value: function zoomOut() {
							var _this4 = this;

							if (!this.ws_.options.showIndex) return;
							this.zws_.el.classList.remove("in");
							setTimeout(function() {
								_this4.ws_.enable();

								_this4.disable();

								_this4.isZoomed_ = false;
								document.documentElement.classList.remove(
									CLASSES.ZOOM_ENABLED
								);
							}, 400);
						}
						/**
						 * Hides the zoom container
						 */
					},
					{
						key: "disable",
						value: function disable() {
							this.zws_.el.classList.add("disabled");
						}
						/**
						 * Shows the zoom container
						 */
					},
					{
						key: "enable",
						value: function enable() {
							this.zws_.el.classList.remove("disabled");
						}
					}
				]);

				return Zoom;
			})();
			/* harmony default export */

			__webpack_exports__["a"] = Zoom;
			/***/
		},
		/* 20 */

		/***/
		function(module, __webpack_exports__, __webpack_require__) {
			"use strict";
			/**
			 * Swing easing function.
			 * @param {number} p The percentage of time that has passed.
			 * @return {number}
			 */

			function swing(p) {
				return 0.5 - Math.cos(p * Math.PI) / 2;
			}
			/* harmony default export */

			__webpack_exports__["a"] = {
				swing: swing
			};
			/***/
		},
		/* 21 */

		/***/
		function(module, exports) {
			// removed by extract-text-webpack-plugin
			/***/
		}
	]
);
