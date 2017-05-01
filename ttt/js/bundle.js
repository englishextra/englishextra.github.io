/*!
 * t.js
 * a micro-templating framework in ~400 bytes gzipped
 * @author  Jason Mooberry <jasonmoo@me.com>
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
 * source: github.com/loele/t.js/blob/2b3ab7039353cc365fb3463f6df08fd00eb3eb3d/t.js
 * passes jshint
 */
(function(){var blockregex=/\{\{(([@!]?)(.+?))\}\}(([\s\S]+?)(\{\{:\1\}\}([\s\S]+?))?)\{\{\/\1\}\}/g,valregex=/\{\{([=%])(.+?)\}\}/g;function t(template){this.t=template;}function scrub(val){return new Option(val).text.replace(/"/g,"&quot;");}function get_value(vars,key){var parts=key.split('.');while(parts.length){if(!(parts[0]in vars)){return false;}vars=vars[parts.shift()];}return vars;}function render(fragment,vars){return fragment.replace(blockregex,function(_,__,meta,key,inner,if_true,has_else,if_false){var val=get_value(vars,key),temp="",i;if(!val){if(meta=='!'){return render(inner,vars);}if(has_else){return render(if_false,vars);}return"";}if(!meta){return render(if_true,vars);}if(meta=='@'){_=vars._key;__=vars._val;for(i in val){if(val.hasOwnProperty(i)){vars._key=i;vars._val=val[i];temp+=render(inner,vars);}}vars._key=_;vars._val=__;return temp;}}).replace(valregex,function(_,meta,key){var val=get_value(vars,key);if(val||val===0){return meta=='%'?scrub(val):val;}return"";});}t.prototype.render=function(vars){return render(this.t,vars);};("undefined"===typeof window?"undefined"===typeof self?"undefined"===typeof global?this:global:self:window).t=t;})();
/*!
 * modified verge 1.9.1+201402130803
 * github.com/ryanve/verge
 * MIT License 2013 Ryan Van Etten
 * removed module
 * converted to dot notation
 * added &&r.left<=viewportW()&&(0!==el.offsetHeight);
 * added &&r.left<=viewportW()&&(0!==el.offsetHeight);
 * added &&r.top<=viewportH()&&(0!==el.offsetHeight);
 * Substitute inViewport with: inY on vertical sites, inX on horizontal ones.
 * On pages without horizontal scroll, inX is always true.
 * On pages without vertical scroll, inY is always true.
 * If the viewport width is >= the document width, then inX is always true.
 * bug: inViewport returns true if element is hidden
 * github.com/ryanve/verge/issues/19
 * source: github.com/ryanve/verge/blob/master/verge.js
 * passes jshint
 */
(function(root,name,make){root[name]=make();}("undefined"!==typeof window?window:this,"verge",function(){var xports={},win=typeof window!="undefined"&&window,doc=typeof document!="undefined"&&document,docElem=doc&&doc.documentElement,matchMedia=win.matchMedia||win.msMatchMedia,mq=matchMedia?function(q){return!!matchMedia.call(win,q).matches;}:function(){return false;},viewportW=xports.viewportW=function(){var a=docElem.clientWidth,b=win.innerWidth;return a<b?b:a;},viewportH=xports.viewportH=function(){var a=docElem.clientHeight,b=win.innerHeight;return a<b?b:a;};xports.mq=mq;xports.matchMedia=matchMedia?function(){return matchMedia.apply(win,arguments);}:function(){return{};};function viewport(){return{"width":viewportW(),"height":viewportH()};}xports.viewport=viewport;xports.scrollX=function(){return win.pageXOffset||docElem.scrollLeft;};xports.scrollY=function(){return win.pageYOffset||docElem.scrollTop;};function calibrate(coords,cushion){var o={};cushion=+cushion||0;o.width=(o.right=coords.right+cushion)-(o.left=coords.left-cushion);o.height=(o.bottom=coords.bottom+cushion)-(o.top=coords.top-cushion);return o;}function rectangle(el,cushion){el=el&&!el.nodeType?el[0]:el;if(!el||1!==el.nodeType)return false;return calibrate(el.getBoundingClientRect(),cushion);}xports.rectangle=rectangle;function aspect(o){o=null===o?viewport():1===o.nodeType?rectangle(o):o;var h=o.height,w=o.width;h=typeof h=="function"?h.call(o):h;w=typeof w=="function"?w.call(o):w;return w/h;}xports.aspect=aspect;xports.inX=function(el,cushion){var r=rectangle(el,cushion);return!!r&&r.right>=0&&r.left<=viewportW()&&(0!==el.offsetHeight);};xports.inY=function(el,cushion){var r=rectangle(el,cushion);return!!r&&r.bottom>=0&&r.top<=viewportH()&&(0!==el.offsetHeight);};xports.inViewport=function(el,cushion){var r=rectangle(el,cushion);return!!r&&r.bottom>=0&&r.right>=0&&r.top<=viewportH()&&r.left<=viewportW()&&(0!==el.offsetHeight);};return xports;}));
/*!
 * modified navbar.js - Minimal navigation script
 * by dnp_theme
 * Licensed under MIT-License
 * @see {@link https://gist.github.com/englishextra/76206ce67897113f5520e31a766fc5ce}
 * @see {@link https://github.com/thednp/navbar.js/blob/master/navbar.js}
 * passes jshint
 */
(function(){"use strict";var w=window,d=document,qS="querySelector",gEBTN="getElementsByTagName",aEL="addEventListener",cL="classList",rootStyle=d.documentElement.style||"",supportTransitions=function(){return"WebkitTransition"in rootStyle||"transition"in rootStyle||"OTransition"in rootStyle||"MsTransition"in rootStyle||"MozTransition"in rootStyle?!0:!1;}(),on=function(element,eventName,handler){element[aEL](eventName,handler,false);},openClass="is-open",isPositioned="is-repositioned",close=function(element){if(element[cL].contains(openClass)){element[cL].remove(openClass);setTimeout(function(){element[cL].remove(isPositioned);},(supportTransitions?200:0));}},Navbar=function(el,outsideClass){var menu=(typeof el==="object")?el:d[qS](el);if(menu){var items=menu[gEBTN]("li")||"";if(items){var enterHandler=function(){var that=this;clearTimeout(that.timer);if(!that[cL].contains(openClass)){that.timer=setTimeout(function(){that[cL].add(openClass);that[cL].add(isPositioned);var siblings=that.parentNode[gEBTN]("li");for(var h=0;h<siblings.length;h++){if(siblings[h]!==that){close(siblings[h]);}}},100);}},closeHandler=function(){for(var i=0,itemsLength=items.length;i<itemsLength;i++){if(items[i][gEBTN]("ul").length){close(items[i]);}}};for(var i=0,itemsLength=items.length;i<itemsLength;i++){if(items[i][gEBTN]("ul").length){on(items[i],"click",enterHandler);}}w[aEL]("hashchange",closeHandler);var outside=d[qS](outsideClass)||"";if(outside){outside[aEL]("click",closeHandler);}}}};("undefined"===typeof window?"undefined"===typeof self?"undefined"===typeof global?this:global:self:window).Navbar=Navbar;}());
/*!
 * Carousel v1.0
 * @see {@link https://habrahabr.ru/post/327246/}
 * @see {@link https://codepen.io/iGetPass/pen/apZPMo}
 */
(function(){"use strict";var d=document,qS="querySelector",aEL="addEventListener";var Carousel=function(setting){var _this=this;if(d[qS](setting.wrap)===null){console.error("Carousel not fount selector "+setting.wrap);return;}var privates={};this.prev_slide=function(){--privates.opt.position;if(privates.opt.position<0){privates.opt.position=privates.opt.max_position-1;}privates.sel.wrap.style.transform="translateX(-"+privates.opt.position+"00%)";};this.next_slide=function(){++privates.opt.position;if(privates.opt.position>=privates.opt.max_position){privates.opt.position=0;}privates.sel.wrap.style.transform="translateX(-"+privates.opt.position+"00%)";};privates.setting=setting;privates.sel={"main":d[qS](privates.setting.main),"wrap":d[qS](privates.setting.wrap),"children":d[qS](privates.setting.wrap).children,"prev":d[qS](privates.setting.prev),"next":d[qS](privates.setting.next)};privates.opt={"position":0,"max_position":d[qS](privates.setting.wrap).children.length};if(privates.sel.prev!==null){privates.sel.prev[aEL]("click",function(){_this.prev_slide();});}if(privates.sel.next!==null){privates.sel.next[aEL]("click",function(){_this.next_slide();});}};("undefined"===typeof window?"undefined"===typeof self?"undefined"===typeof global?this:global:self:window).Carousel=Carousel;}());
/*!
 * modified scrollToY
 * @see {@link http://stackoverflow.com/questions/8917921/cross-browser-javascript-not-jquery-scroll-to-top-animation}
 * passes jshint
 */
(function(){"use strict";var scroll2Top=function(scrollTargetY,speed,easing){var scrollY=window.scrollY||document.documentElement.scrollTop;scrollTargetY=scrollTargetY||0;speed=speed||2000;easing=easing||'easeOutSine';var currentTime=0;var time=Math.max(0.1,Math.min(Math.abs(scrollY-scrollTargetY)/speed,0.8));var easingEquations={easeOutSine:function(pos){return Math.sin(pos*(Math.PI/2));},easeInOutSine:function(pos){return(-0.5*(Math.cos(Math.PI*pos)-1));},easeInOutQuint:function(pos){if((pos/=0.5)<1){return 0.5*Math.pow(pos,5);}return 0.5*(Math.pow((pos-2),5)+2);}};function tick(){currentTime+=1/60;var p=currentTime/time;var t=easingEquations[easing](p);if(p<1){requestAnimationFrame(tick);window.scrollTo(0,scrollY+((scrollTargetY-scrollY)*t));}else{console.log('scroll done');window.scrollTo(0,scrollTargetY);}}tick();};("undefined"===typeof window?"undefined"===typeof self?"undefined"===typeof global?this:global:self:window).scroll2Top=scroll2Top;}());
/*!
 * return image is loaded promise
 * jsfiddle.net/englishextra/56pavv7d/
 * @param {String|Object} s image path string or HTML DOM Image Object
 * var m = document.querySelector("img") || "";
 * var s = m.src || "";
 * imagePromise(m).then(function (r) {
 * alert(r);
 * }).catch (function (err) {
 * alert(err);
 * });
 * imagePromise(s).then(function (r) {
 * alert(r);
 * }).catch (function (err) {
 * alert(err);
 * });
 * @see {@link https://gist.github.com/englishextra/3e95d301d1d47fe6e26e3be198f0675e}
 * passes jshint
 */
(function(){"use strict";var imagePromise=function(s){if(window.Promise){return new Promise(function(y,n){var f=function(e,p){e.onload=function(){y(p);};e.onerror=function(){n(p);};e.src=p;};if("string"===typeof s){var a=new Image();f(a,s);}else{if("IMG"!==s.tagName){return Promise.reject();}else{if(s.src){f(s,s.src);}}}});}else{throw new Error("Promise is not in window");}};("undefined"===typeof window?"undefined"===typeof self?"undefined"===typeof global?this:global:self:window).imagePromise=imagePromise;}());
/*!
 * A simple promise-compatible "document ready" event handler with a few extra treats.
 * With browserify/webpack:
 * const ready = require('document-ready-promise')
 * ready().then(function(){})
 * If in a non-commonjs environment, just include the script. It will attach document.ready for you.
 * document.ready().then(function() {})
 * The document.ready promise will preserve any values that you may be passing through the promise chain.
 * Using ES2015 and window.fetch
 * fetch(new Request('kitten.jpg'))
 * .then(response => response.blob())
 * .then(document.ready)
 * .then(blob => document.querySelector('img').src = URL.createObjectURL(blob))
 * @see {@link https://github.com/michealparks/document-ready-promise}
 * @see {@link https://github.com/michealparks/document-ready-promise/blob/master/document-ready-promise.js}
 * passes jshint
 */
(function(document,promise){if(typeof module!=="undefined")module.exports=promise;else document.ready=promise;})(window.document,function(chainVal){"use strict";var d=document,w=window,loaded=/^loaded|^i|^c/.test(d.readyState),DOMContentLoaded="DOMContentLoaded",load="load";return new Promise(function(resolve){if(loaded)return resolve(chainVal);function onReady(){resolve(chainVal);d.removeEventListener(DOMContentLoaded,onReady);w.removeEventListener(load,onReady);}d.addEventListener(DOMContentLoaded,onReady);w.addEventListener(load,onReady);});});
/*!
 * safe way to handle console.log():
 * sitepoint.com/safe-console-log/
 */
/* jshint ignore:start */
if ("undefined" === typeof console) {
	console = {};
	console.log = function () {
		return;
	};
}
/* jshint ignore:end */
/*!
 * add js class to html element
 */
(function setJsClassToDocumentElement(a){if(a){a.classList.add("js");}}(document.documentElement||""));
/*!
 * detect Node.js
 * github.com/lyrictenor/node-is-nwjs/blob/master/is-nodejs.js
 * @returns {Boolean} true or false
 */
var isNodejs = "undefined" !== typeof process && "undefined" !== typeof require || "";
/*!
 * detect Electron
 * @returns {Boolean} true or false
 */
var isElectron = "undefined" !== typeof window && window.process && "renderer" === window.process.type || "";
/*!
 * detect NW.js
 * github.com/lyrictenor/node-is-nwjs/blob/master/index.js
 * @returns {Boolean} true or false
 */
var isNwjs = function () {
	if ("undefined" !== typeof isNodejs && isNodejs) {
		try {
			if ("undefined" !== typeof require("nw.gui")) {
				return !0;
			}
		} catch (e) {
			return !1;
		}
	}
	return !1;
}
();
/*!
 * modified MediaHack - (c) 2013 Pomke Nohkan MIT LICENCED.
 * gist.github.com/englishextra/ff8c9dde94abe32a9d7c4a65e0f2ccac
 * jsfiddle.net/englishextra/xg7ce8kc/
 * removed className fallback and additionally
 * returns earlyDeviceOrientation,earlyDeviceSize
 * Add media query classes to DOM nodes
 * github.com/pomke/mediahack/blob/master/mediahack.js
 */
var earlyDeviceOrientation="",earlyDeviceSize="";(function(w,e){var f=function(a){var b=a.split(" ");if(e){for(var c=0;c<b.length;c++){a=b[c];e.add(a);}}},g=function(a){var b=a.split(" ");if(e){for(var c=0;c<b.length;c++){a=b[c];e.remove(a);}}},h={landscape:"all and (orientation:landscape)",portrait:"all and (orientation:portrait)"},k={small:"all and (max-width:768px)",medium:"all and (min-width:768px) and (max-width:991px)",large:"all and (min-width:992px)"},d,mM="matchMedia",m="matches",o=function(a,b){var c=function(a){if(a[m]){f(b);earlyDeviceOrientation=b;}else{g(b);}};c(a);a.addListener(c);},s=function(a,b){var c=function(a){if(a[m]){f(b);earlyDeviceSize=b;}else{g(b);}};c(a);a.addListener(c);};for(d in h){if(h.hasOwnProperty(d)){o(w[mM](h[d]),d);}}for(d in k){if(k.hasOwnProperty(d)){s(w[mM](k[d]),d);}}})(window,document.documentElement.classList||"");
/*!
 * add mobile or desktop class
 * using Detect Mobile Browsers | Open source mobile phone detection
 * Regex updated: 1 August 2014
 * detectmobilebrowsers.com
 * github.com/heikojansen/plack-middleware-detectmobilebrowsers
 */
var earlyDeviceType="";(function(d,h,k,n){var c=/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(n)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(n.substr(0,4))?h:k;if(d&&c){d.classList.add(c);earlyDeviceType=c;}}(document.documentElement||"","mobile","desktop",navigator.userAgent||navigator.vendor||window.opera));
/*!
 * add svg support class
 */
var earlySvgSupport="";(function(d,s){var c=document.implementation.hasFeature("http://www.w3.org/2000/svg","1.1")?s:"no-"+s;(earlySvgSupport=c);if(d&&c){d.classList.add(c);}}(document.documentElement||"","svg"));
/*!
 * add svgasimg support class
 */
var earlySvgasimgSupport="";(function(d,s){var c=document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image","1.1")?s:"no-"+s;(earlySvgasimgSupport=c);if(d&&c){d.classList.add(c);}}(document.documentElement||"","svgasimg"));
/*!
 * add touch support class
 * gist.github.com/englishextra/3cb22aab31a52b6760b5921e4fe8db95
 * jsfiddle.net/englishextra/z5xhjde8/
 */
var earlyHasTouch="";(function(d,s){if(d){var c="ontouchstart"in d?s:"no-"+s;earlyHasTouch=c;d.classList.add(c);}}(document.documentElement||"","touch"));
/*!
 * return date in YYYY-MM-DD format
 */
var earlyFnGetYyyymmdd=function(){"use strict";var a=(new Date()),b=a.getDate(),d=a.getFullYear(),c=a.getMonth();(c+=1);if(10>b){b="0"+b;}if(10>c){c="0"+c;}return d+"-"+c+"-"+b;}();
/*!
 * append details to title
 */
var initialDocumentTitle = document.title || "",
userBrowsingDetails = " [" + (earlyFnGetYyyymmdd ? earlyFnGetYyyymmdd : "") + (earlyDeviceType ? " " + earlyDeviceType : "") + (earlyDeviceSize ? " " + earlyDeviceSize : "") + (earlyDeviceOrientation ? " " + earlyDeviceOrientation : "") + (earlySvgSupport ? " " + earlySvgSupport : "") + (earlySvgasimgSupport ? " " + earlySvgasimgSupport : "") + (earlyHasTouch ? " " + earlyHasTouch : "") + "]";
if (document.title) {
	document.title = document.title + userBrowsingDetails;
}
/*!
 * How can I check if a JS file has been included already?
 * gist.github.com/englishextra/403a0ca44fc5f495400ed0e20bc51d47
 * stackoverflow.com/questions/18155347/how-can-i-check-if-a-js-file-has-been-included-already
 * @param {String} s path string
 * scriptIsLoaded(s)
 */
var scriptIsLoaded=function(s){for(var b=document.getElementsByTagName("script")||"",a=0;a<b.length;a++)if(b[a].getAttribute("src")==s)return!0;return!1;};
/*!
 * loop over the Array
 * stackoverflow.com/questions/18238173/javascript-loop-through-json-array
 * gist.github.com/englishextra/b4939b3430da4b55d731201460d3decb
 * @param {String} str any text string
 * @param {Int} max a whole positive number
 * @param {String} add any text string
 * truncString(str,max,add)
 */
var truncString=function(str,max,add){add=add||"\u2026";return("string"===typeof str&&str.length>max?str.substring(0,max)+add:str);};
/*!
 * Check if string represents a valid HTML id
 * gist.github.com/englishextra/b5aaef8b555a3ba84c68a6e251db149d
 * jsfiddle.net/englishextra/z19tznau/
 * @param {String} a text string
 * @param {Int} [full] if true, returns with leading hash/number sign
 * isValidId(a,full)
 */
var isValidId=function(a,full){return full?/^\#[A-Za-z][-A-Za-z0-9_:.]*$/.test(a)?!0:!1:/^[A-Za-z][-A-Za-z0-9_:.]*$/.test(a)?!0:!1;};
/*!
 * find element's position
 * stackoverflow.com/questions/5598743/finding-elements-position-relative-to-the-document
 * @param {Object} a an HTML element
 * findPos(a).top
 */
var findPos=function(a){a=a.getBoundingClientRect();var b=document.body,c=document.documentElement;return{top:Math.round(a.top+(window.pageYOffset||c.scrollTop||b.scrollTop)-(c.clientTop||b.clientTop||0)),left:Math.round(a.left+(window.pageXOffset||c.scrollLeft||b.scrollLeft)-(c.clientLeft||b.clientLeft||0))};};
/*!
 * modified Unified URL parsing API in the browser and node
 * github.com/wooorm/parse-link
 * removed module check
 * gist.github.com/englishextra/4e9a0498772f05fa5d45cfcc0d8be5dd
 * gist.github.com/englishextra/2a7fdabd0b23a8433d5fc148fb788455
 * jsfiddle.net/englishextra/fcdds4v6/
 * @param {String} url URL string
 * @param {Boolean} [true|false] if true, returns protocol:, :port, /pathname, ?search, ?query, #hash
 * if set to false, returns protocol, port, pathname, search, query, hash
 * alert(parseLink("http://localhost/search?s=t&v=z#dev").href|
 * origin|host|port|hash|hostname|pathname|protocol|search|query|isAbsolute|isRelative|isCrossDomain);
 */
/*jslint bitwise: true */
var parseLink=function(url,full){full=full||!1;return function(){var _r=function(s){return s.replace(/^(#|\?)/,"").replace(/\:$/,"");},l=location||"",_p=function(protocol){switch(protocol){case"http:":return full?":"+80:80;case"https:":return full?":"+443:443;default:return full?":"+l.port:l.port;}},_s=(0===url.indexOf("//")||!!~url.indexOf("://")),w=window.location||"",_o=function(){var o=w.protocol+"//"+w.hostname+(w.port?":"+w.port:"");return o||"";},_c=function(){var c=document.createElement("a");c.href=url;var v=c.protocol+"//"+c.hostname+(c.port?":"+c.port:"");return v!==_o();},a=document.createElement("a");a.href=url;return{href:a.href,origin:_o(),host:a.host||l.host,port:("0"===a.port||""===a.port)?_p(a.protocol):(full?a.port:_r(a.port)),hash:full?a.hash:_r(a.hash),hostname:a.hostname||l.hostname,pathname:a.pathname.charAt(0)!="/"?(full?"/"+a.pathname:a.pathname):(full?a.pathname:a.pathname.slice(1)),protocol:!a.protocol||":"==a.protocol?(full?l.protocol:_r(l.protocol)):(full?a.protocol:_r(a.protocol)),search:full?a.search:_r(a.search),query:full?a.search:_r(a.search),isAbsolute:_s,isRelative:!_s,isCrossDomain:_c(),hasHTTP:/^(http|https):\/\//i.test(url)?!0:!1};}();};
/*jslint bitwise: false */
/*!
 * get current protocol - "http" or "https", else return ""
 * @param {Boolean} [a] When set to "true", and the result is empty,
 * the function will return "http"
 * getHTTP(a)
 */
var getHTTP=function(a){return function(f){return"http:"===a?"http":"https:"===a?"https":f?"http":"";};}(window.location.protocol||"");
/*!
 * loading spinner
 * dependent on setAutoClearedTimeout
 * gist.github.com/englishextra/24ef040fbda405f7468da70e4f3b69e7
 * @param {Object} [f] callback function
 * @param {Int} [n] any positive whole number, default: 500
 * LoadingSpinner.show();
 * LoadingSpinner.hide(f,n);
 */
var LoadingSpinner = function () {
	"use strict";
	var d = document,
	b = d.body || "",
	cls = "loading-spinner",
	a = d.querySelector("." + cls) || "",
	is_active = "is-active-loading-spinner",
	cL = "classList";
	console.log("triggered function: LoadingSpinner");
	if (!a) {
		a = d.createElement("div");
		a[cL].add(cls);
		b.appendChild(a);
	}
	return {
		show: function () {
			return b[cL].contains(is_active) || b[cL].add(is_active);
		},
		hide: function (f, n) {
			n = n || 500;
			return function () {
				var st = setTimeout(function () {
						clearTimeout(st);
						b[cL].remove(is_active);
						if (f && "function" === typeof f) {
							f();
						}
					}, n);
			}
			();
		}
	};
}
();
/*!
 * Open external links in default browser out of Electron / nwjs
 * gist.github.com/englishextra/b9a8140e1c1b8aa01772375aeacbf49b
 * stackoverflow.com/questions/32402327/how-can-i-force-external-links-from-browser-window-to-open-in-a-default-browser
 * github.com/nwjs/nw.js/wiki/shell
 * electron - file: | nwjs - chrome-extension: | http: Intel XDK
 * @param {String} a URL/path string
 * openDeviceBrowser(a)
 */
var openDeviceBrowser = function (a) {
	"use strict";
	var w = window,
	g = function () {
		var es = "undefined" !== typeof isElectron && isElectron ? require("electron").shell : "";
		return es ? es.openExternal(a) : "";
	},
	k = function () {
		var ns = "undefined" !== typeof isNwjs && isNwjs ? require("nw.gui").Shell : "";
		return ns ? ns.openExternal(a) : "";
	},
	q = function () {
		/*!
		 * wont do in electron and nw,
		 * so manageExternalLinks will set target blank to links
		 */
		/* var win = w.open(a, "_blank");
		win.focus(); */
		return !0;
	},
	v = function () {
		return w.open(a, "_system", "scrollbars=1,location=no");
	};
	console.log("triggered function: openDeviceBrowser");
	if ("undefined" !== typeof isElectron && isElectron) {
		g();
	} else if ("undefined" !== typeof isNwjs && isNwjs) {
		k();
	} else {
		if ("undefined" !== typeof getHTTP && getHTTP()) {
			q();
		} else {
			v();
		}
	}
};
/*!
 * set click event on external links,
 * so that they open in new browser tab
 * @param {Object} [ctx] context HTML Element
 */
var manageExternalLinks = function (ctx) {
	"use strict";
	ctx = ctx || "";
	var d = document,
	cls = "a",
	qS = "querySelector",
	qSA = "querySelectorAll",
	a = ctx ? ctx[qS](cls) || "" : d[qS](cls) || "",
	handleExternalLink = function (p, ev) {
		ev.stopPropagation();
		ev.preventDefault();
		openDeviceBrowser(p);
	},
	g = function (e) {
		var p = e.getAttribute("href") || "";
		if (p && parseLink(p).isCrossDomain && parseLink(p).hasHTTP) {
			e.title = "" + (parseLink(p).hostname || "") + " откроется в новой вкладке";
			if ("undefined" !== typeof getHTTP && getHTTP()) {
				e.target = "_blank";
			} else {
				e.addEventListener("click", handleExternalLink.bind(null, p));
			}
		}
	},
	k = function () {
		a = ctx ? ctx[qSA](cls) || "" : d[qSA](cls) || "";
		for (var i = 0, l = a.length; i < l; i += 1) {
			g(a[i]);
		}
	};
	if (a) {
		console.log("triggered function: manageExternalLinks");
		k();
	}
};
/* window.addEventListener("load", manageExternalLinks.bind(null, "")); */
/* document.ready().then(manageExternalLinks.bind(null, "")); */
/*!
 * replace img src with data-src
 * @param {Object} [ctx] context HTML Element
 */
var manageDataSrcImg = function (ctx) {
	"use strict";
	ctx = ctx || "";
	var w = window,
	d = document,
	cls = "img[data-src]",
	qS = "querySelector",
	qSA = "querySelectorAll",
	a = ctx ? ctx[qS](cls) || "" : d[qS](cls) || "",
	is_active = "is-active",
	cL = "classList",
	ds = "dataset",
	aEL = "addEventListener",
	rEL = "removeEventListener",
	k = function (e) {
		var _src = e[ds].src || "";
		if (_src) {
			if (parseLink(_src).isAbsolute && !parseLink(_src).hasHTTP) {
				e[ds].src = _src.replace(/^/, getHTTP(!0) + ":");
				_src = e[ds].src;
			}
			if (!e[cL].contains(is_active)) {
				if (w.Promise) {
					imagePromise(_src).then(function (r) {
						e.src = _src;
						console.log("manageDataSrcImg => imagePromise: loaded image:", r);
					}).catch (function (err) {
						console.log("manageDataSrcImg => imagePromise: cannot load image:", err);
					});
				} else {
					e.src = _src;
				}
				e[cL].add(is_active);
			}
		}
	},
	g = function (e) {
		/*!
		 * true if elem is in same y-axis as the viewport or within 100px of it
		 * github.com/ryanve/verge
		 */
		if (verge.inY(e, 100) /* && 0 !== e.offsetHeight */) {
			k(e);
		}
	};
	if (a) {
		console.log("triggered function: manageDataSrcImg");
		a = ctx ? ctx[qSA](cls) || "" : d[qSA](cls) || "";
		var h_w = function () {
			for (var i = 0, l = a.length; i < l; i += 1) {
				g(a[i]);
			}
		};
		h_w();
		w[aEL]("scroll", h_w);
		w[aEL]("resize", h_w);
		w[aEL]("hashchange", function h_r() {
			w[rEL]("scroll", h_w);
			w[rEL]("resize", h_w);
			w[rEL]("hashchange", h_r);
		});
	}
};
/* window.addEventListener("load", manageDataSrcImg.bind(null, "")); */
/* document.ready().then(manageDataSrcImg.bind(null, "")); */
/*!
 * add smooth scroll or redirection to static select options
 * @param {Object} [ctx] context HTML Element
 */
var manageStaticSelect = function (ctx) {
	"use strict";
	ctx = ctx || "";
	var w = window,
	d = document,
	cls = "#pages-select",
	qS = "querySelector",
	a = ctx ? ctx[qS](cls) || "" : d[qS](cls) || "",
	uiPanelContentsSelect = d[qS](".ui-panel-contents-select") || "",
	cL = "classList",
	is_active = "is-active",
	aEL = "addEventListener",
	handleStaticSelect = function (_this) {
		var h = _this.options[_this.selectedIndex].value || "",
		zh = h ? (isValidId(h, !0) ? d[qS](h) : "") : "",
		uiPanelContentsSelectHeight = uiPanelContentsSelect ? (uiPanelContentsSelect[cL].contains(is_active) ? uiPanelContentsSelect.offsetHeight : uiPanelContentsSelect.offsetHeight * 2) : 0;
		if (h) {
			if (zh) {
				scroll2Top(findPos(d[qS](h)).top - uiPanelContentsSelectHeight, 10000);
			} else {
				w.location.hash = h;
			}
		}
	},
	k = function () {
		a[aEL]("change", handleStaticSelect.bind(null, a));
	};
	if (a) {
		console.log("triggered function: manageStaticSelect");
		k();
	}
};
/* window.addEventListener("load", manageStaticSelect.bind(null, "")); */
/* document.ready().then(manageStaticSelect.bind(null, "")); */
/*!
 * add click event on hidden-layer show btn
 * @param {Object} [ctx] context HTML Element
 */
var manageExpandingLayers = function (ctx) {
	"use strict";
	ctx = ctx || "";
	var d = document,
	cls = ".btn-expand-hidden-layer",
	qS = "querySelector",
	qSA = "querySelectorAll",
	a = ctx ? ctx[qS](cls) || "" : d[qS](cls) || "",
	aEL = "addEventListener",
	handleExpandingLayers = function (_this) {
		var cL = "classList",
		pN = "parentNode",
		is_active = "is-active",
		s = _this[pN] ? _this[pN].nextElementSibling : "";
		if (s) {
			_this[cL].toggle(is_active);
			s[cL].toggle(is_active);
		}
		return !1;
	},
	k = function (e) {
		e[aEL]("click", handleExpandingLayers.bind(null, e));
	},
	q = function () {
		a = ctx ? ctx[qSA](cls) || "" : d[qSA](cls) || "";
		for (var i = 0, l = a.length; i < l; i += 1) {
			k(a[i]);
		}
	};
	if (a) {
		console.log("triggered function: manageExpandingLayers");
		q();
	}
};
/* window.addEventListener("load", manageExpandingLayers.bind(null, "")); */
/* document.ready().then(manageExpandingLayers.bind(null, "")); */
/*!
 * init Masonry grid
 * stackoverflow.com/questions/15160010/jquery-masonry-collapsing-on-initial-page-load-works-fine-after-clicking-home
 * percentPosition: !0 works well with percent-width items,
 * as items will not transition their position on resize.
 * masonry.desandro.com/options.html
 */
var msnry,
pckry,
initMasonry = function (ctx) {
	"use strict";
	ctx = ctx || "";
	var w = window,
	d = document,
	qS = "querySelector",
	cls = ".masonry-grid",
	h = ".masonry-grid-item",
	k = ".masonry-grid-sizer",
	a = ctx ? ctx[qS](cls) || "" : d[qS](cls) || "",
	c = ctx ? ctx[qS](h) || "" : d[qS](h) || "",
	g = function () {
		var si;
		if (w.Masonry) {
			if (msnry) {
				msnry.destroy();
			}
			msnry = new Masonry(a, {
					itemSelector: h,
					columnWidth: k,
					gutter: 0,
					percentPosition: !0
				});
			console.log("function initMasonry => initialised msnry");
			si = setInterval(function () {
					console.log("function initMasonry => started Interval");
					if ("undefined" !== typeof imagesPreloaded && imagesPreloaded) {
						clearInterval(si);
						console.log("function initMasonry => si=" + si + "; imagesPreloaded=" + imagesPreloaded);
						msnry.layout();
						console.log("function initMasonry => reinitialised msnry");
					}
				}, 100);
		} else if (w.Packery) {
			if (pckry) {
				pckry.destroy();
			}
			pckry = new Packery(a, {
					itemSelector: h,
					columnWidth: k,
					gutter: 0,
					percentPosition: !0
				});
			console.log("function initMasonry => initialised pckry");
			si = setInterval(function () {
					console.log("function initMasonry => started Interval");
					if ("undefined" !== typeof imagesPreloaded && imagesPreloaded) {
						clearInterval(si);
						console.log("function initMasonry => si=" + si + "; imagesPreloaded=" + imagesPreloaded);
						pckry.layout();
						console.log("function initMasonry => reinitialised pckry");
					}
				}, 100);
		} else {
			console.log("function initMasonry => no library is loaded");
		}
	};
	if (a && c) {
		console.log("triggered function: initMasonryGrid");
		if ("undefined" !== typeof imagesPreloaded) {
			var st = setTimeout(function () {
					clearTimeout(st);
					g();
				}, 100);
		} else {
			console.log("function initMasonry => undefined: imagesPreloaded");
		}
	}
},
loadInitMasonry = function (ctx) {
	"use strict";
	ctx = ctx || "";
	/* var js = "./cdn/masonry/4.1.1/js/masonry.pkgd.fixed.min.js"; */
	var js = "./cdn/packery/2.1.1/js/packery.pkgd.fixed.min.js";
	if (!scriptIsLoaded(js)) {
		loadJS(js, initMasonry.bind(null, ctx));
	} else {
		initMasonry(ctx);
	}
};
/* window.addEventListener("load", loadInitMasonry.bind(null, "")); */
/* document.ready().then(loadInitMasonry.bind(null, "")); */
/*!
 * replacement for inner html
 */
var insertTextAsFragment = function (t, c, f) {
	"use strict";
	var d = document,
	b = d.getElementsByTagName("body")[0] || "",
	aC = "appendChild",
	iH = "innerHTML",
	pN = "parentNode",
	g = function () {
		return f && "function" === typeof f && f();
	};
	console.log("triggered function: insertTextAsFragment");
	try {
		var n = c.cloneNode(!1);
		if (d.createRange) {
			var rg = d.createRange();
			rg.selectNode(b);
			var df = rg.createContextualFragment(t);
			n[aC](df);
			return c[pN] ? c[pN].replaceChild(n, c) : c[iH] = t,
			g();
		} else {
			n[iH] = t;
			return c[pN] ? c[pN].replaceChild(d.createDocumentFragment[aC](n), c) : c[iH] = t,
			g();
		}
	} catch (e) {
		console.log(e);
	}
	return !1;
};
/*!
 * load content via ajax
 */
var insertExternalHTML = function (a, u, f) {
	"use strict";
	var c = document.querySelector(a) || "",
	g = function (t, s) {
		var q = function () {
			return s && "function" === typeof s && s();
		};
		insertTextAsFragment(t, c, q);
	},
	k = function () {
		fetch(u).then(function (r) {
			if (!r.ok) {
				throw new Error(r.statusText);
			}
			return r;
		}).then(function (r) {
			return r.text();
		}).then(function (t) {
			g(t, f);
		}).catch (function (e) {
			console.log("Error inserting content from file " + u, e);
		});
	};
	if (c) {
		console.log("triggered function: insertExternalHTML");
		k();
	}
};
/*!
 * render navigation templates
 */
var renderNavigation = function () {
	"use strict";
	var d = document,
	qS = "querySelector",
	qSA = "querySelectorAll",
	navbarClass = '[data-function="navbar"]',
	navbar = d[qS](navbarClass) || "",
	outsideContainerClass = ".container",
	is_active = "is-active",
	cL = "classList",
	navigationJsonUrl = "./json/navigation.json";
	if (navbar) {
		fetch(navigationJsonUrl).then(function (navigationJson) {
			if (!navigationJson.ok) {
				throw new Error(navigationJson.statusText);
			}
			return navigationJson;
		}).then(function (navigationJson) {
			return navigationJson.text();
		}).then(function (navigationJson) {
			var popularTemplate = d[qS]("#template_navbar_popular_pages") || "",
			popularRender = d[qS]("#render_navbar_popular_pages") || "";
			if (popularTemplate && popularRender) {
				var popularHtml = popularTemplate.innerHTML || "",
				renderPopularTemplate = new t(popularHtml);
				var popularRendered = renderPopularTemplate.render(JSON.parse(navigationJson));
				insertTextAsFragment(popularRendered, popularRender, function () {
					var moreTemplate = d[qS]("#template_navbar_more_info") || "",
					moreRender = d[qS]("#render_navbar_more_info") || "";
					if (moreTemplate && moreRender) {
						var moreHtml = moreTemplate.innerHTML || "",
						renderMoreTemplate = new t(moreHtml);
						var moreRendered = renderMoreTemplate.render(JSON.parse(navigationJson));
						insertTextAsFragment(moreRendered, moreRender, function () {
							Navbar(navbarClass, outsideContainerClass);
							manageExternalLinks(navbar);
						});
					}
				});
			}
			var carouselTemplate = d[qS]("#template_b_carousel_items") || "",
			carouselRender = d[qS]("#render_b_carousel_items") || "";
			if (carouselTemplate && carouselRender) {
				var carouselHtml = carouselTemplate.innerHTML || "",
				renderCarouselTemplate = new t(carouselHtml),
				carouselRendered = renderCarouselTemplate.render(JSON.parse(navigationJson));
				insertTextAsFragment(carouselRendered, carouselRender, function () {
					var imgs = d[qSA]("img[data-src]") || "",
					setNewSrc = function (e) {
						var _src = e.dataset.src || "";
						if (_src) {
							e.src = _src;
						}
						e[cL].add(is_active);
					};
					if (imgs) {
						for (var i = 0, l = imgs.length; i < l; i += 1) {
							setNewSrc(imgs[i]);
						}
					}
					var carousel = new Carousel({
							"main": ".js-carousel",
							"wrap": ".js-carousel__wrap",
							"prev": ".js-carousel__prev",
							"next": ".js-carousel__next"
						});
				});
			}
		}).catch (function (err) {
			console.log("Error inserting content from file " + navigationJsonUrl, err);
		});
	}
};
/* window.addEventListener("load", renderNavigation); */
document.ready().then(renderNavigation);
/*!
 * fix panel with contents select on scroll
 */
var nailUiPanelContentsSelect = function () {
	"use strict";
	var w = window,
	d = document,
	qS = "querySelector",
	cL = "classList",
	uiPanelNavigation = d[qS](".ui-panel-navigation") || "",
	holderHero = d[qS](".holder-hero") || "",
	criticalHeight = (uiPanelNavigation ? uiPanelNavigation.offsetHeight : 0) + (holderHero ? holderHero.offsetHeight : 0),
	uiPanelContentsSelect = d[qS](".ui-panel-contents-select") || "",
	is_active = "is-active",
	handleUiPanelContentsSelect = function () {
		if ((document.body.scrollTop || document.documentElement.scrollTop || 0) > criticalHeight) {
			uiPanelContentsSelect[cL].add(is_active);
		} else {
			uiPanelContentsSelect[cL].remove(is_active);
		}
	};
	if (uiPanelContentsSelect) {
		w.addEventListener("scroll", handleUiPanelContentsSelect);
	}
};
document.ready().then(nailUiPanelContentsSelect);
/*!
 * process routes, render contents select
 */
var processRoutes = function () {
	"use strict";
	var w = window,
	d = document,
	qS = "querySelector",
	aC = "appendChild",
	aEL = "addEventListener",
	pN = "parentNode",
	appContentId = "#app-content",
	appContent = d[qS](appContentId) || "",
	contentsTemplate = d[qS]("#template_contents_select") || "",
	contentsSelect = d[qS]("#render_contents_select") || "",
	routesJsonUrl = "./json/routes.json";
	if (appContent) {
		fetch(routesJsonUrl).then(function (routesJson) {
			if (!routesJson.ok) {
				throw new Error(routesJson.statusText);
			}
			return routesJson;
		}).then(function (routesJson) {
			return routesJson.text();
		}).then(function (routesJson) {
			var routesData = JSON.parse(routesJson),
			onInsertion = function (text) {
				LoadingSpinner.hide();
				/* var h1 = contentsSelect || d[qS]("#h1") || "",
				h1Pos = findPos(h1).top || 0;
				if (h1) {
					scroll2Top(h1Pos, 20000);
				} else {
					scroll2Top(0, 20000);
				} */
				scroll2Top(0, 20000);
				document.title = text + (initialDocumentTitle ? " - " + initialDocumentTitle : "") + userBrowsingDetails;
				for (var i = 0, l = contentsSelect.options.length; i < l; i += 1) {
					if (contentsSelect.options[i].value === w.location.hash) {
						contentsSelect.selectedIndex = i;
						break;
					}
				}
				manageExternalLinks(appContent[pN]);
				manageDataSrcImg(appContent[pN]);
				manageStaticSelect(appContent[pN]);
				manageExpandingLayers(appContent[pN]);
				loadInitMasonry(appContent[pN]);
			};
			if (routesData) {
				var navigateOnHashChange = function () {
					if (w.location.hash) {
						var notfound = false;
						for (var key in routesData.hashes) {
							if (routesData.hashes.hasOwnProperty(key)) {
								if (w.location.hash === routesData.hashes[key].href) {
									notfound = true;
									LoadingSpinner.show();
									insertExternalHTML(appContentId, routesData.hashes[key].url, onInsertion.bind(null, routesData.hashes[key].text));
									break;
								}
							}
						}
						if (false === notfound) {
							var notfoundUrl = routesData.notfound.url,
							notfoundText = routesData.notfound.text;
							if (notfoundUrl && notfoundText) {
								LoadingSpinner.show();
								insertExternalHTML(appContentId, notfoundUrl, onInsertion.bind(null, notfoundText));
							}
						}
					} else {
						var homeUrl = routesData.home.url,
						homeText = routesData.home.text;
						if (homeUrl && homeText) {
							LoadingSpinner.show();
							insertExternalHTML(appContentId, homeUrl, onInsertion.bind(null, homeText));
						}
					}
				};
				navigateOnHashChange();
				w[aEL]("hashchange", navigateOnHashChange);
				var handleContentsSelect = function (_this) {
					var h = _this.options[_this.selectedIndex].value || "";
					if (h) {
						w.location.hash = h;
					}
				};
				/*!
				 * insertTextAsFragment will remove event listener from select element,
				 * so you will have to use inner html method
				 */
				if (contentsTemplate && contentsSelect) {
					/* var contentsHtml = contentsTemplate.innerHTML || "",
					renderContentsTemplate = new t(contentsHtml);
					var contentsRendered = renderContentsTemplate.render(routesData);
					contentsSelect.innerHTML = contentsRendered;
					contentsSelect[aEL]("change", handleContentsSelect.bind(null, contentsSelect)); */
				}
				/*!
				 * alternative way to generate select options
				 * with document fragment
				 */
				var df = d.createDocumentFragment();
				for (var key in routesData.hashes) {
					if (routesData.hashes.hasOwnProperty(key)) {
						var contentsOption = d.createElement("option");
						contentsOption.value = routesData.hashes[key].href;
						var contentsOptionText = routesData.hashes[key].text;
						contentsOption.title = contentsOptionText;
						var contentsOptionTextTruncated = truncString("" + contentsOptionText, 48);
						contentsOption[aC](d.createTextNode(contentsOptionTextTruncated));
						df[aC](contentsOption);
					}
				}
				contentsSelect[aC](df);
				contentsSelect[aEL]("change", handleContentsSelect.bind(null, contentsSelect));
			}
		}).catch (function (err) {
			console.log("Error inserting content from file " + routesJsonUrl, err);
		});
	}
};
/* window.addEventListener("load", processRoutes); */
document.ready().then(processRoutes);
/*!
 * observe mutations
 * bind functions only for inserted DOM
 * @param {String} ctx HTML Element class or id string
 */
var observeMutations = function (ctx) {
	"use strict";
	ctx = ctx || "";
	if (ctx) {
		var g = function (e) {
			var f = function (m) {
				console.log("mutations observer: " + m.type);
				console.log(m.type, "target: " + m.target.tagName + ("." + m.target.className || "#" + m.target.id || ""));
				console.log(m.type, "added: " + m.addedNodes.length + " nodes");
				console.log(m.type, "removed: " + m.removedNodes.length + " nodes");
				if ("childList" === m.type || "subtree" === m.type) {
					mo.disconnect();
					/* manageExternalLinks(ctx);
					manageDataSrcImg(ctx);
					manageStaticSelect(ctx);
					manageExpandingLayers(ctx);
					loadInitMasonry(ctx); */
				}
			};
			for (var i = 0, l = e.length; i < l; i += 1) {
				f(e[i]);
			}
		},
		mo = new MutationObserver(g);
		mo.observe(ctx, {
			childList: !0,
			subtree: !0,
			attributes: !1,
			characterData: !1
		});
	}
};
/*!
 * apply changes to inserted DOM
 */
var updateInsertedDom = function () {
	"use strict";
	var w = window,
	d = document,
	qS = "querySelector",
	h = w.location.hash || "",
	pN = "parentNode",
	/*!
	 * because replace child is used in the first place
	 * to insert new content, and if parent node doesnt exist
	 * inner html method is applied,
	 * the parent node should be observed, not the target
	 * node for the insertion
	 */
	ctx = d[qS]("#app-content")[pN] || "";
	if (ctx && h) {
		console.log("triggered function: updateInsertedDom");
		observeMutations(ctx);
	}
};
window.addEventListener("load", updateInsertedDom);
window.addEventListener("hashchange", updateInsertedDom);
/*!
 * init ui-totop
 */
var initUiTotop = function () {
	"use strict";
	var w = window,
	d = document,
	qS = "querySelector",
	b = d[qS]("body") || "",
	h = d[qS]("html") || "",
	u = "ui-totop",
	is_active = "is-active",
	t = "Наверх",
	cL = "classList",
	cE = "createElement",
	aC = "appendChild",
	cENS = "createElementNS",
	sANS = "setAttributeNS",
	aEL = "addEventListener",
	k = function (_this) {
		var a = _this.pageYOffset || h.scrollTop || b.scrollTop || "",
		c = _this.innerHeight || h.clientHeight || b.clientHeight || "",
		e = d[qS]("." + u) || "";
		if (a && c && e) {
			if (a > c) {
				e[cL].add(is_active);
			} else {
				e[cL].remove(is_active);
			}
		}
	},
	g = function (f) {
		var h_a = function (ev) {
			ev.stopPropagation();
			ev.preventDefault();
			scroll2Top(0, 20000);
		},
		a = d[cE]("a"),
		svg = d[cENS]("http://www.w3.org/2000/svg", "svg"),
		use = d[cENS]("http://www.w3.org/2000/svg", "use");
		a[cL].add(u);
		/* jshint -W107 */
		a.href = "javascript:void(0);";
		/* jshint +W107 */
		a.title = t;
		a[cL].add(u);
		a[aEL]("click", h_a);
		svg[cL].add("ui-icon");
		use[sANS]("http://www.w3.org/1999/xlink", "xlink:href", "#ui-icon-Up");
		svg[aC](use);
		a[aC](svg);
		b[aC](a);
		w[aEL]("scroll", k.bind(null, w));
	};
	if (b) {
		console.log("triggered function: initUiTotop");
		g();
	}
};
document.ready().then(initUiTotop);
/*!
 * show page, finish ToProgress
 */
var showPageFinishProgress = function () {
	"use strict";
	var a = document.querySelector("#page") || "",
	g = function () {
		a.style.opacity = 1;
		/* progressBar.complete(); */
	},
	k = function () {
		var si = setInterval(function () {
				console.log("function showPageFinishProgress => started Interval");
				if ("undefined" !== typeof imagesPreloaded && imagesPreloaded) {
					clearInterval(si);
					console.log("function showPageFinishProgress => si=" + si.value + "; imagesPreloaded=" + imagesPreloaded);
					g();
				}
			}, 100);
	};
	if (a) {
		console.log("triggered function: showPageFinishProgress");
		if ("undefined" !== typeof imagesPreloaded) {
			k();
		} else {
			g();
		}
	}
};
window.addEventListener("load", showPageFinishProgress);
