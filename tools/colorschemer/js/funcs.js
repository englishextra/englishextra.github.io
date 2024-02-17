var HSL = new Object();
var RGB = new Object();
var tempRGB = new Object();
RGB.R = RGB.G = RGB.B = 0;
tempRGB.R = tempRGB.G = tempRGB.B = 0;
HSL.H = HSL.S = HSL.L = 0;
var HEXCodes = new Array(256);
var k = 0;
var HEX = new Array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F");
for (i = 0; i < 16; i++) {
	for (j = 0; j < 16; j++) {
		HEXCodes[k] = HEX[i] + HEX[j];
		k++;
	}
}
function SetHex(bgColor) {
	var i = 0;
	if (bgColor.substring(0, 3) == "rgb") {
		bgColor = bgColor.substring(4, bgColor.length - 1);
		rgbArray = bgColor.split(", ");
		ChangeColors(rgbArray[0], rgbArray[1], rgbArray[2]);
		return;
	}
	if (bgColor.length == 0)
		return;
	if (bgColor.length == 7)
		bgColor = bgColor.substring(1, 7);
	if (bgColor.length < 6) {
		alert("You must enter a 6 character HEX value!");
		return;
	}
	bgColor = bgColor.toUpperCase();
	for (j = 0; j < 6; j++) {
		if (!isHex(bgColor.charAt(j))) {
			alert("You may only enter values between A-F and 0-9!");
			return false;
		}
	}
	while (HEXCodes[i] != bgColor.substring(0, 2).toUpperCase())
		i++;
	RGB.R = i;
	i = 0;
	while (HEXCodes[i] != bgColor.substring(2, 4).toUpperCase())
		i++;
	RGB.G = i;
	i = 0;
	while (HEXCodes[i] != bgColor.substring(4, 6).toUpperCase())
		i++;
	RGB.B = i;
	ChangeColors(RGB.R, RGB.G, RGB.B);
}
function isHex(hexChar) {
	for (k = 0; k < HEX.length; k++) {
		if (hexChar == HEX[k]) {
			return true;
		}
	}
	return false;
}
function ChangeColors(r, g, b) {
	if (r > 255)
		r = 255;
	if (g > 255)
		g = 255;
	if (b > 255)
		b = 255;
	if (r < 0)
		r = 0;
	if (g < 0)
		g = 0;
	if (b < 0)
		b = 0;
	if (!(r >= 0) && !(r <= 255))
		r = 0
			if (!(g >= 0) && !(g <= 255))
				g = 0
					if (!(b >= 0) && !(b <= 255))
						b = 0
							RGB.R = r;
					RGB.G = g;
			RGB.B = b;
	document.getElementById('codes').r.value = r;
	document.getElementById('codes').g.value = g;
	document.getElementById('codes').b.value = b;
	document.getElementById('codes').hex.value = HEXCodes[r] + HEXCodes[g] + HEXCodes[b];
	document.getElementById('currentColor').style.backgroundColor = "#" + HEXCodes[r] + HEXCodes[g] + HEXCodes[b];
	DrawWheel();
}
function DrawWheel() {
	var red,
	green,
	blue,
	direction;
	RGBtoHSL(RGB.R, RGB.G, RGB.B);
	for (i = 0; i < 12; i++) {
		HSLtoRGB(HSL.H, HSL.S, HSL.L);
		red = HEXCodes[tempRGB.R];
		green = HEXCodes[tempRGB.G];
		blue = HEXCodes[tempRGB.B];
		document.getElementById(i).style.backgroundColor = "#" + red + green + blue;
		document.getElementById(i + 'HEX').innerHTML = "#" + red + green + blue;
		document.getElementById(i + 'RGB').innerHTML = tempRGB.R + "." + tempRGB.G + "." + tempRGB.B;
		HSL.H += 30;
		if (HSL.H >= 360)
			HSL.H -= 360;
	}
	RGBtoHSL(RGB.R, RGB.G, RGB.B);
	for (i = 1; i <= 4; i++) {
		if (i == 3) {
			RGBtoHSL(RGB.R, RGB.G, RGB.B);
			HSL.H += 180;
			if (HSL.H >= 360)
				HSL.H -= 360;
		}
		if (i == 1) {
			if (HSL.L < 60)
				direction = 1;
			else
				direction = -1;
		}
		HSL.L += direction * 12;
		HSLtoRGB(HSL.H, HSL.S, HSL.L);
		red = HEXCodes[tempRGB.R];
		green = HEXCodes[tempRGB.G];
		blue = HEXCodes[tempRGB.B];
		document.getElementById('m' + i).style.backgroundColor = "#" + red + green + blue;
		document.getElementById('m' + i + 'HEX').innerHTML = "#" + red + green + blue;
		document.getElementById('m' + i + 'RGB').innerHTML = tempRGB.R + "." + tempRGB.G + "." + tempRGB.B;
	}
}
function LightenScheme() {
	RGBtoHSL(RGB.R, RGB.G, RGB.B);
	HSL.L = HSL.L + 5;
	if (HSL.L > 100)
		HSL.L = 100;
	HSLtoRGB(HSL.H, HSL.S, HSL.L);
	ChangeColors(tempRGB.R, tempRGB.G, tempRGB.B);
}
function DarkenScheme() {
	RGBtoHSL(RGB.R, RGB.G, RGB.B);
	HSL.L = HSL.L - 5;
	if (HSL.L < 0)
		HSL.L = 0;
	HSLtoRGB(HSL.H, HSL.S, HSL.L);
	ChangeColors(tempRGB.R, tempRGB.G, tempRGB.B);
}
function HSLtoRGB(H, S, L) {
	var p1,
	p2;
	L /= 100;
	S /= 100;
	if (L <= 0.5)
		p2 = L * (1 + S);
	else
		p2 = L + S - (L * S);
	p1 = 2 * L - p2;
	if (S == 0) {
		tempRGB.R = L;
		tempRGB.G = L;
		tempRGB.B = L;
	} else {
		tempRGB.R = FindRGB(p1, p2, H + 120);
		tempRGB.G = FindRGB(p1, p2, H);
		tempRGB.B = FindRGB(p1, p2, H - 120);
	}
	tempRGB.R *= 255;
	tempRGB.G *= 255;
	tempRGB.B *= 255;
	tempRGB.R = Math.round(tempRGB.R);
	tempRGB.G = Math.round(tempRGB.G);
	tempRGB.B = Math.round(tempRGB.B);
}
function FindRGB(q1, q2, hue) {
	if (hue > 360)
		hue = hue - 360;
	if (hue < 0)
		hue = hue + 360;
	if (hue < 60)
		return (q1 + (q2 - q1) * hue / 60);
	else if (hue < 180)
		return (q2);
	else if (hue < 240)
		return (q1 + (q2 - q1) * (240 - hue) / 60);
	else
		return (q1);
}
function RGBtoHSL(r, g, b) {
	var Min = 0;
	var Max = 0;
	r = (eval(r) / 51) * .2;
	g = (eval(g) / 51) * .2;
	b = (eval(b) / 51) * .2;
	if (eval(r) >= eval(g))
		Max = eval(r);
	else
		Max = eval(g);
	if (eval(b) > eval(Max))
		Max = eval(b);
	if (eval(r) <= eval(g))
		Min = eval(r);
	else
		Min = eval(g);
	if (eval(b) < eval(Min))
		Min = eval(b);
	HSL.L = (eval(Max) + eval(Min)) / 2;
	if (eval(Max) == eval(Min)) {
		HSL.S = 0;
		HSL.H = 0;
	} else {
		if (HSL.L < .5)
			HSL.S = (eval(Max) - eval(Min)) / (eval(Max) + eval(Min));
		if (HSL.L >= .5)
			HSL.S = (eval(Max) - eval(Min)) / (2 - eval(Max) - eval(Min));
		if (r == Max)
			HSL.H = (eval(g) - eval(b)) / (eval(Max) - eval(Min));
		if (g == Max)
			HSL.H = 2 + ((eval(b) - eval(r)) / (eval(Max) - eval(Min)));
		if (b == Max)
			HSL.H = 4 + ((eval(r) - eval(g)) / (eval(Max) - eval(Min)));
	}
	HSL.H = Math.round(HSL.H * 60);
	if (HSL.H < 0)
		HSL.H += 360;
	if (HSL.H >= 360)
		HSL.H -= 360;
	HSL.S = Math.round(HSL.S * 100);
	HSL.L = Math.round(HSL.L * 100);
}
function DrawPalette() {
	var outer,
	middle,
	inner = 255;
	document.write('<div ID="palette">');
	document.write('<table cellpadding=0 cellspacing=1 border=0 bgcolor="#000000">');
	document.write('<tr>');
	for (outer = 255; outer >= 0; outer -= 51) {
		for (middle = 255; middle >= 0; middle -= 51) {
			for (inner = 255; inner >= 0; inner -= 51) {
				tR = HEXCodes[255 - outer];
				tG = HEXCodes[255 - middle];
				tB = HEXCodes[255 - inner];
				document.write('<td height="11" width="11" bgcolor="#' + tR + tG + tB + '"><a href="#" onClick="ChangeColors(' + (255 - outer) + ',' + (255 - middle) + ',' + (255 - inner) + '); return false;"><img src="clear.gif" border="0" width="11" height="11" /></a></td>');
			}
		}
		if (outer != 0)
			document.write('</tr><tr>');
	}
	document.write('</tr>');
	document.write('</table>');
	document.write('</div>');
}