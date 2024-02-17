var RGB=function(r,g,b){this.r=r;this.g=g;this.b=b;this.hex=function () {return((this.r+0x10000).toString(16).substr(-2)
+(this.g+0x10000).toString(16).substr(-2)
+(this.b+0x10000).toString(16).substr(-2)).toUpperCase();}
this.rgb=function () {return this;}
this.hsl=function () {var r=this.r/255;var g=this.g/255;var b=this.b/255;var min=Math.min(r,g,b);var max=Math.max(r,g,b);var l=(max+min)/2;var s=0;var h=0;if(max!=min){if(l<.5){s=(max-min)/(max+min);}else{s=(max-min)/(2-max-min);}
if(r==max){h=(g-b)/(max-min);}else if(g==max){h=2+(b-r)/(max-min);}else if(b==max){h=4+(r-g)/(max-min);}}
h=(Math.round(h*60*100)/100)%360;while(h<0)
h+=360;s=Math.round(s*100*100)/100;l=Math.round(l*100*100)/100;return new HSL(h,s,l);}
this.toString=function () {return'RGB('+r+', '+g+', '+b+')';}}
var HSL=function(h,s,l){this.h=h;this.s=s;this.l=l;this.hsl=function () {return this;}
function findColor(p1,p2,h){h=h%360;while(h<0)
h+=360;if(h<60){return p1+(p2-p1)*h/60;}
if(h<180){return p2;}
if(h<240){return p1+(p2-p1)*(240-h)/60;}
return p1;}
this.rgb=function () {var l=this.l/100;var s=this.s/100;var r=0,g=0,b=0;if(s==0){r=l;g=l;b=l;}else{var p2=(l<=.5)?(l*(1+s)):(l+s-(l*s));var p1=2*l-p2;r=findColor(p1,p2,this.h+120);g=findColor(p1,p2,this.h);b=findColor(p1,p2,this.h-120);}
r=Math.round(r*255);g=Math.round(g*255);b=Math.round(b*255);return new RGB(r,g,b);}
this.hex=function () {return this.rgb().hex();}
this.toString=function () {return'HSL('+h+', '+s+', '+l+')';}}
function parseHex(hex){var r=parseInt(hex.substr(0,2),16);var g=parseInt(hex.substr(2,2),16);var b=parseInt(hex.substr(4,2),16);return new RGB(r,g,b);}
var NoOp=function () {this.apply=function(col){return col;}}
var ShiftHue=function(angle){this.angle=angle;this.apply=function(col){var hsl=col.hsl();var h=(hsl.h+this.angle)%360;while(h<0)
h+=360;return new HSL(h,hsl.s,hsl.l);}}
var Desaturate=function(factor){this.factor=factor;this.apply=function(col){var hsl=col.hsl();s=Math.max(Math.min(hsl.s*this.factor,100),0);return new HSL(hsl.h,s,hsl.l);}}
var Saturate=function(factor){this.factor=factor;this.apply=function(col){var hsl=col.hsl();s=100-Math.max(Math.min((100-hsl.s)*this.factor,100),0);return new HSL(hsl.h,s,hsl.l);}}
var Darken=function(factor){this.factor=factor;this.apply=function(col){var hsl=col.hsl();l=Math.max(Math.min(hsl.l*this.factor,100),0);return new HSL(hsl.h,hsl.s,l);}}
var Brighten=function(factor){this.factor=factor;this.apply=function(col){var hsl=col.hsl();l=100-Math.max(Math.min((100-hsl.l)*this.factor,100),0);return new HSL(hsl.h,hsl.s,l);}}
var groups=[];groups.push({id:'saturation',title:'Saturation',operations:[new Desaturate(0/8),new Desaturate(2/8),new Desaturate(4/8),new Desaturate(6/8),new NoOp(8/8),new Saturate(6/8),new Saturate(4/8),new Saturate(2/8),new Saturate(0/8)]});groups.push({id:'brightness',title:'Brightness',operations:[new Darken(1/8),new Darken(2/8),new Darken(4/8),new Darken(6/8),new NoOp(8/8),new Brighten(6/8),new Brighten(4/8),new Brighten(2/8),new Brighten(1/8)]});groups.push({id:'hue',title:'Hue',operations:[new ShiftHue(-180),new ShiftHue(-135),new ShiftHue(-90),new ShiftHue(-45),new ShiftHue(0),new ShiftHue(45),new ShiftHue(90),new ShiftHue(135),new ShiftHue(180)]});$(function () {function updateAll(c){setRGB(c);setHSL(c);setHex(c);update(c);}
function updateRGB(){var r=parseInt($('#r').val());var g=parseInt($('#g').val());var b=parseInt($('#b').val());var c=new RGB(r,g,b);setHSL(c);setHex(c);update(c);}
function updateHSL(){var h=parseInt($('#h').val());var s=parseInt($('#s').val());var l=parseInt($('#l').val());var c=new HSL(h,s,l);setRGB(c);setHex(c);update(c);}
function updateHex(){var c=parseHex($('#hex').val());setRGB(c);setHSL(c);update(c);}
function update(col){var rgb=col.rgb();var hsl=col.hsl();setHash(rgb);for(var i in groups){var group=groups[i];for(var k in group.operations){var op=group.operations[k];var s=$('#swatch-'+group.id+'-'+k);var c=op.apply(hsl);var srgb=c.rgb();var shsl=c.hsl();var shex=c.hex();s.find('.col').css('background','#'+shex);s.find('.rgb').text('rgb('+srgb.r+', '+srgb.g+', '+srgb.b+')');s.find('.hsl').text('hsl('+Math.round(shsl.h)+', '+Math.round(shsl.s)+', '+Math.round(shsl.l)+')');s.find('.hex').text('#'+shex);s.unbind('click');s.click(getUpdateHandler(c));}}}
function getUpdateHandler(col){return function () {updateAll(col);return false;}}
function setRGB(col){var rgb=col.rgb();$('#r').val(Math.round(rgb.r));$('#g').val(Math.round(rgb.g));$('#b').val(Math.round(rgb.b));}
function setHSL(col){var hsl=col.hsl();$('#h').val(Math.round(hsl.h));$('#s').val(Math.round(hsl.s));$('#l').val(Math.round(hsl.l));}
function setHex(col){$('#hex').val(col.hex());}
function loadHash(){var hash=location.hash.substr(1);if(hash){return parseHex(hash);}}
function setHash(col){location.hash=col?('#'+col.hex()):'';}
var groupsContainer=$('#groups');for(var i in groups){var group=groups[i];var g=$('<section>').addClass('group').attr('id','group-'+group.id);$('<h3>').text(group.title).appendTo(g);var s=$('<div>').addClass('swatches');for(var k in group.operations){$('<a>').addClass('swatch').attr('id','swatch-'+group.id+'-'+k).attr('href','#').append($('<span>').addClass('col')).append($('<div>').addClass('details').append($('<span>').addClass('rgb')).append($('<span>').addClass('hsl')).append($('<span>').addClass('hex'))).appendTo(s);}
s.appendTo(g);g.appendTo(groupsContainer);}
$('#color-selector-form').submit(function () {return false;});$('#r, #g, #b').change(updateRGB).keyup(updateRGB);$('#h, #s, #l').change(updateHSL).keyup(updateHSL);$('#hex').change(updateHex).keyup(updateHex);$('#labels').change(function () {var show=$(this).attr('checked')=='checked';$('body')[show?'addClass':'removeClass']('show-labels');});var col=loadHash();if(col){updateAll(col);}else{$('#r').val(Math.floor((Math.random()*255)+1));$('#g').val(Math.floor((Math.random()*255)+1));$('#b').val(Math.floor((Math.random()*255)+1));updateRGB();}});
