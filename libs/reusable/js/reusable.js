/*!
 * modified for babel ToProgress v0.1.1
 * http://github.com/djyde/ToProgress
 * gist.github.com/englishextra/6a8c79c9efbf1f2f50523d46a918b785
 * jsfiddle.net/englishextra/z5xhjde8/
 * arguments.callee changed to TP, a local wrapper function,
 * so that public function name is now customizable;
 * wrapped in curly brackets:
 * else{document.body.appendChild(this.progressBar);};
 * removed AMD, CommonJS support
 * added window object existence check
 * passes jshint
 */
var ToProgress=(function(){if("undefined"==typeof window||!("document"in window)){return console.log("window is undefined or document is not in window"),!1;}var TP=function(){function t(){var s=document.createElement("fakeelement"),i={transition:"transitionend",OTransition:"oTransitionEnd",MozTransition:"transitionend",WebkitTransition:"webkitTransitionEnd"};for(var j in i){if(i.hasOwnProperty(j)){if(void 0!==s.style[j]){return i[j];}}}}function s(t,a){if(this.progress=0,this.options={id:"top-progress-bar",color:"#F44336",height:"2px",duration:0.2},t&&"object"==typeof t){for(var i in t){if(t.hasOwnProperty(i)){this.options[i]=t[i];}}}if(this.options.opacityDuration=3*this.options.duration,this.progressBar=document.createElement("div"),this.progressBar.id=this.options.id,this.progressBar.setCSS=function(t){for(var a in t){if(t.hasOwnProperty(a)){this.style[a]=t[a];}}},this.progressBar.setCSS({position:a?"relative":"fixed",top:"0",left:"0",right:"0","background-color":this.options.color,height:this.options.height,width:"0%",transition:"width "+this.options.duration+"s, opacity "+this.options.opacityDuration+"s","-moz-transition":"width "+this.options.duration+"s, opacity "+this.options.opacityDuration+"s","-webkit-transition":"width "+this.options.duration+"s, opacity "+this.options.opacityDuration+"s"}),a){var o=document.querySelector(a);if(o){if(o.hasChildNodes()){o.insertBefore(this.progressBar,o.firstChild);}else{o.appendChild(this.progressBar);}}}else{document.body.appendChild(this.progressBar);}}var i=t();return s.prototype.transit=function(){this.progressBar.style.width=this.progress+"%";},s.prototype.getProgress=function(){return this.progress;},s.prototype.setProgress=function(t,s){this.show();this.progress=t>100?100:0>t?0:t;this.transit();if(s){s();}},s.prototype.increase=function(t,s){this.show();this.setProgress(this.progress+t,s);},s.prototype.decrease=function(t,s){this.show();this.setProgress(this.progress-t,s);},s.prototype.finish=function(t){var s=this;this.setProgress(100,t);this.hide();if(i){this.progressBar.addEventListener(i,function(t){s.reset();s.progressBar.removeEventListener(t.type,TP);});}},s.prototype.reset=function(t){this.progress=0;this.transit();if(t){t();}},s.prototype.hide=function(){this.progressBar.style.opacity="0";},s.prototype.show=function(){this.progressBar.style.opacity="1";},s;};return TP();}());
/*!
 * modified for babel Zenscroll - v3.2.2
 * github.com/zengabor/zenscroll
 * Copyright 2015-2016 Gabor Lenard
 * removed AMD, CommonJS support
 * fixed IIFE enforcing
 * added brackets in if / for
 * source: github.com/zengabor/zenscroll/blob/dist/zenscroll.js
 * passes jshint
 */
var zenscroll=(function(){"use strict";if(typeof window==="undefined"||!("document"in window)){return{};}var createScroller=function(scrollContainer,defaultDuration,edgeOffset){defaultDuration=defaultDuration||999;if(!edgeOffset&&edgeOffset!==0){edgeOffset=9;}var scrollTimeoutId;var setScrollTimeoutId=function(newValue){scrollTimeoutId=newValue;};var docElem=document.documentElement;var nativeSmoothScrollEnabled=function(){return("getComputedStyle"in window)&&window.getComputedStyle(scrollContainer?scrollContainer:document.body)["scroll-behavior"]==="smooth";};var getScrollTop=function(){if(scrollContainer){return scrollContainer.scrollTop;}else{return window.scrollY||docElem.scrollTop;}};var getViewHeight=function(){if(scrollContainer){return Math.min(scrollContainer.offsetHeight,window.innerHeight);}else{return window.innerHeight||docElem.clientHeight;}};var getRelativeTopOf=function(elem){if(scrollContainer){return elem.offsetTop;}else{return elem.getBoundingClientRect().top+getScrollTop()-docElem.offsetTop;}};var stopScroll=function(){clearTimeout(scrollTimeoutId);setScrollTimeoutId(0);};var scrollToY=function(endY,duration,onDone){stopScroll();if(nativeSmoothScrollEnabled()){(scrollContainer||window).scrollTo(0,endY);if(onDone){onDone();}}else{var startY=getScrollTop();var distance=Math.max(endY,0)-startY;duration=duration||Math.min(Math.abs(distance),defaultDuration);var startTime=new Date().getTime();(function loopScroll(){setScrollTimeoutId(setTimeout(function(){var p=Math.min((new Date().getTime()-startTime)/duration,1);var y=Math.max(Math.floor(startY+distance*(p<0.5?2*p*p:p*(4-p*2)-1)),0);if(scrollContainer){scrollContainer.scrollTop=y;}else{window.scrollTo(0,y);}if(p<1&&(getViewHeight()+y)<(scrollContainer||docElem).scrollHeight){loopScroll();}else{setTimeout(stopScroll,99);if(onDone){onDone();}}},9));})();}};var scrollToElem=function(elem,duration,onDone){scrollToY(getRelativeTopOf(elem)-edgeOffset,duration,onDone);};var scrollIntoView=function(elem,duration,onDone){var elemHeight=elem.getBoundingClientRect().height;var elemTop=getRelativeTopOf(elem);var elemBottom=elemTop+elemHeight;var containerHeight=getViewHeight();var containerTop=getScrollTop();var containerBottom=containerTop+containerHeight;if((elemTop-edgeOffset)<containerTop||(elemHeight+edgeOffset)>containerHeight){scrollToElem(elem,duration,onDone);}else if((elemBottom+edgeOffset)>containerBottom){scrollToY(elemBottom-containerHeight+edgeOffset,duration,onDone);}else if(onDone){onDone();}};var scrollToCenterOf=function(elem,duration,offset,onDone){scrollToY(Math.max(getRelativeTopOf(elem)-getViewHeight()/2+(offset||elem.getBoundingClientRect().height/2),0),duration,onDone);};var setup=function(newDefaultDuration,newEdgeOffset){if(newDefaultDuration){defaultDuration=newDefaultDuration;}if(newEdgeOffset===0||newEdgeOffset){edgeOffset=newEdgeOffset;}};return{setup:setup,to:scrollToElem,toY:scrollToY,intoView:scrollIntoView,center:scrollToCenterOf,stop:stopScroll,moving:function(){return!!scrollTimeoutId;}};};var defaultScroller=createScroller();if("addEventListener"in window&&document.body.style.scrollBehavior!=="smooth"&&!window.noZensmooth){var replaceUrl=function(hash){try{history.replaceState({},"",window.location.href.split("#")[0]+hash);}catch(e){}};window.addEventListener("click",function(event){var anchor=event.target;while(anchor&&anchor.tagName!=="A"){anchor=anchor.parentNode;}if(!anchor||event.which!==1||event.shiftKey||event.metaKey||event.ctrlKey||event.altKey){return;}var href=anchor.getAttribute("href")||"";if(href.indexOf("#")===0){if(href==="#"){event.preventDefault();defaultScroller.toY(0);replaceUrl("");}else{var targetId=anchor.hash.substring(1);var targetElem=document.getElementById(targetId);if(targetElem){event.preventDefault();defaultScroller.to(targetElem);replaceUrl("#"+targetId);}}}},false);}return{createScroller:createScroller,setup:defaultScroller.setup,to:defaultScroller.to,toY:defaultScroller.toY,intoView:defaultScroller.intoView,center:defaultScroller.stop,moving:defaultScroller.moving};}());
/*!
 * A function for elements selection - v0.1.9
 * github.com/finom/bala
 * @param {String} a id, class or tag string
 * @param {String|Object} [b] context tag string or HTML Element object
 * a=BALA("sometag/#someid/.someclass"[,someParent]);
 * a=BALA.one("sometag/#someid/.someclass"[,someParent]);
 * global $ becomes var g
 * renamed function $ to g
 * added window object existence check
 * source: github.com/finom/bala/blob/master/bala.js
 * passes jshint
 */
var BALA=(function(){if("undefined"==typeof window||!("document"in window)){return console.log("window is undefined or document is not in window"),!1;}var g=(function(document,s_addEventListener,s_querySelectorAll){function g(s,context,bala){bala=Object.create(g.fn);if(s){bala.push.apply(bala,s[s_addEventListener]?[s]:""+s===s?/</.test(s)?((context=document.createElement(context||s_addEventListener)).innerHTML=s,context.children):context?((context=g(context)[0])?context[s_querySelectorAll](s):bala):document[s_querySelectorAll](s):typeof s=='function'?document.readyState[7]?s():document[s_addEventListener]('DOMContentLoaded',s):s);}return bala;}g.fn=[];g.one=function(s,context){return g(s,context)[0]||null;};return g;})(document,'addEventListener','querySelectorAll');return g;}());
/*!
 * modified for babel crel - a small, simple, and fast DOM creation utility
 * github.com/KoryNunn/crel
 * crel(tagName/dom element[,attributes,child1,child2,childN...])
 * var element=crel('div',crel('h1','Crello World!'),
 * crel('p','This is crel'),crel('input',{type:'number'}));
 * removed AMD, CommonJS support
 * fixed Use '===' to compare with 'null'.
 * fixed The body of a for in should be wrapped in an if statement to filter unwanted properties from the prototype.
 * fixed Expected an assignment or function call and instead saw an expression.
 * added window object existence check
 * source: github.com/KoryNunn/crel/blob/master/crel.js
 * passes jshint
 */
var crel=(function(){if("undefined"==typeof window||!("document"in window)){return console.log("window is undefined or document is not in window"),!1;}var fn="function",obj="object",nodeType="nodeType",textContent="textContent",setAttribute="setAttribute",attrMapString="attrMap",isNodeString="isNode",isElementString="isElement",d=typeof document===obj?document:{},isType=function(a,type){return typeof a===type;},isNode=typeof Node===fn?function(object){return object instanceof Node;}:function(object){return object&&isType(object,obj)&&(nodeType in object)&&isType(object.ownerDocument,obj);},isElement=function(object){return _c[isNodeString](object)&&object[nodeType]===1;},isArray=function(a){return a instanceof Array;},appendChild=function(element,child){if(!_c[isNodeString](child)){child=d.createTextNode(child);}element.appendChild(child);};function _c(){var args=arguments,element=args[0],child,settings=args[1],childIndex=2,argumentsLength=args.length,attributeMap=_c[attrMapString];element=_c[isElementString](element)?element:d.createElement(element);if(argumentsLength===1){return element;}if(!isType(settings,obj)||_c[isNodeString](settings)||isArray(settings)){--childIndex;settings=null;}if((argumentsLength-childIndex)===1&&isType(args[childIndex],"string")&&element[textContent]!==undefined){element[textContent]=args[childIndex];}else{for(;childIndex<argumentsLength;++childIndex){child=args[childIndex];if(child===null){continue;}if(isArray(child)){for(var i=0;i<child.length;++i){appendChild(element,child[i]);}}else{appendChild(element,child);}}}for(var key in settings){if(settings.hasOwnProperty(key)){if(!attributeMap[key]){element[setAttribute](key,settings[key]);}else{var attr=attributeMap[key];if(typeof attr===fn){attr(element,settings[key]);}else{element[setAttribute](attr,settings[key]);}}}}return element;}_c[attrMapString]={};_c[isElementString]=isElement;_c[isNodeString]=isNode;if("undefined"!==typeof Proxy){_c.proxy=new Proxy(_c,{get:function(target,key){if(!(key in _c)){_c[key]=_c.bind(null,key);}return _c[key];}});}return _c;})();
/*!
 * modified for babel JavaScript Cookie - v2.1.3
 * github.com/js-cookie/js-cookie
 * Copyright 2006, 2015 Klaus Hartl & Fagner Brack
 * Released under the MIT license
 * Cookies.set('name', 'value');
 * Create a cookie that expires 7 days from now, valid across the entire site:
 * Cookies.set('name', 'value', { expires: 7 });
 * Create an expiring cookie, valid to the path of the current page:
 * Cookies.set('name', 'value', { expires: 7, path: '' });
 * Cookies.get('name'); // => 'value'
 * Cookies.get('nothing'); // => undefined
 * Read all visible cookies:
 * Cookies.get(); // => { name: 'value' }
 * Cookies.remove('name');
 * Delete a cookie valid to the path of the current page:
 * Cookies.set('name', 'value', { path: '' });
 * Cookies.remove('name'); // fail!
 * Cookies.remove('name', { path: '' }); // removed!
 * IMPORTANT! when deleting a cookie, you must pass the exact same path
 * and domain attributes that was used to set the cookie,
 * unless you're relying on the default attributes.
 * removed AMD, CJS, ES6 wrapper
 * source: github.com/js-cookie/js-cookie/blob/master/src/js.cookie.js
 * passes jshint
 */
var Cookies=(function(){function extend(){var i=0;var result={};for(;i<arguments.length;i++){var attributes=arguments[i];for(var key in attributes){if(attributes.hasOwnProperty(key)){result[key]=attributes[key];}}}return result;}function init(converter){function api(key,value,attributes){var result;if(typeof document==='undefined'){return;}if(arguments.length>1){attributes=extend({path:'/'},api.defaults,attributes);if(typeof attributes.expires==='number'){var expires=new Date();expires.setMilliseconds(expires.getMilliseconds()+attributes.expires*864e+5);attributes.expires=expires;}try{result=JSON.stringify(value);if(/^[\{\[]/.test(result)){value=result;}}catch(e){}if(!converter.write){value=encodeURIComponent(String(value)).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g,decodeURIComponent);}else{value=converter.write(value,key);}key=encodeURIComponent(String(key));key=key.replace(/%(23|24|26|2B|5E|60|7C)/g,decodeURIComponent);key=key.replace(/[\(\)]/g,escape);var ret=(document.cookie=[key,'=',value,attributes.expires?'; expires='+attributes.expires.toUTCString():'',attributes.path?'; path='+attributes.path:'',attributes.domain?'; domain='+attributes.domain:'',attributes.secure?'; secure':''].join(''));return ret;}if(!key){result={};}var cookies=document.cookie?document.cookie.split('; '):[];var rdecode=/(%[0-9A-Z]{2})+/g;var i=0;for(;i<cookies.length;i++){var parts=cookies[i].split('=');var cookie=parts.slice(1).join('=');if(cookie.charAt(0)==='"'){cookie=cookie.slice(1,-1);}try{var name=parts[0].replace(rdecode,decodeURIComponent);cookie=converter.read?converter.read(cookie,name):converter(cookie,name)||cookie.replace(rdecode,decodeURIComponent);if(this.json){try{cookie=JSON.parse(cookie);}catch(e){}}if(key===name){result=cookie;break;}if(!key){result[name]=cookie;}}catch(e){}}return result;}api.set=api;api.get=function(key){return api.call(api,key);};api.getJSON=function(){return api.apply({json:true},[].slice.call(arguments));};api.defaults={};api.remove=function(key,attributes){api(key,'',extend(attributes,{expires:-1}));};api.withConverter=init;return api;}return init(function(){});}());
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
 * detect Old Opera
 * @returns {Boolean} true or false
 */
var isOldOpera = !!window.opera || !1;
/*!
 * detect SystemJS
 * @returns {Boolean} true or false
 */
var isSystemJS = window.System || "";
/*!
 * Temporal hiding of module
 * github.com/electron/electron/pull/3497
 * gist.github.com/englishextra/1bf72395f77c8cf25ddd900aa69a0d68
 */
var hideWindowModule=function(){if("object"===typeof module){window.module=module;module=void 0;}};
/*!
 * Temporal reveal of module
 * github.com/electron/electron/pull/3497
 * gist.github.com/englishextra/1bf72395f77c8cf25ddd900aa69a0d68
 */
var revealWindowModule=function(){if(window.module){module=window.module;}};
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
 * A minimal html entities decoder/encoder using DOM.
 * github.com/jussi-kalliokoski/htmlentities.js
 * htmlentities.encode('<&>'); returns '&lt;&amp;&gt;';
 * htmlentities.decode('&lt;&amp;&gt;'); returns '<&>';
 * htmlentities is a shorthand for htmlentities.encode
 */
var htmlentities=(function(a){function b(c){var d=a.createElement("div");d.appendChild(a.createTextNode(c));c=d.innerHTML;d=null;return c;}b.decode=function(c){var d=a.createElement("div");d.innerHTML=c;c=d.innerText||d.textContent;d=null;return c;};return(b.encode=b);}(document));
/*!
 * escape string for HTML
 * gist.github.com/englishextra/214582c0f3ba64be19c655f57f11241d
 * jsfiddle.net/englishextra/dvw66vg1/
 */
var escapeHtml=function(s){return(s=s.replace(/[<!="'\/>&]/g,function(s){return{"<":"&lt;","!":"&#033;","=":"&#061;",'"':"&quot;","'":"&#39;","/":"&#047;",">":"&gt;","&":"&amp;"}[s];})||"");};
/*!
 * Escape strings for use as JavaScript string literals
 * gist.github.com/englishextra/3053a4dc18c2de3c80ce7d26207681e0
 * modified github.com/joliss/js-string-escape
 */
var jsStringEscape=function(s){return(""+s).replace(/["'\\\n\r\u2028\u2029]/g,function(a){switch(a){case'"':case"'":case"\\":return"\\"+a;case"\n":return"\\n";case"\r":return"\\r";case"\u2028":return"\\u2028";case"\u2029":return"\\u2029";}});};
/*!
 * append details to title
 */
var initialDocumentTitle = document.title || "",
userBrowsingDetails = " [" + (earlyFnGetYyyymmdd ? earlyFnGetYyyymmdd : "") + (earlyDeviceType ? " " + earlyDeviceType : "") + (earlyDeviceSize ? " " + earlyDeviceSize : "") + (earlyDeviceOrientation ? " " + earlyDeviceOrientation : "") + (earlySvgSupport ? " " + earlySvgSupport : "") + (earlySvgasimgSupport ? " " + earlySvgasimgSupport : "") + (earlyHasTouch ? " " + earlyHasTouch : "") + "]";
if (document.title) {
	document.title = document.title + userBrowsingDetails;
}
/*!
 * Get Timestamp
 * github.com/FreeCodeCamp/FreeCodeCamp/wiki/JS-Get-Timestamp
 */
var dateGetTime=function(){return new Date().getTime();}();
/*!
 * stackoverflow.com/questions/16053357/what-does-foreach-call-do-in-javascript
 * Instead of using [].forEach.call() or Array.prototype.forEach.call() every time
 * you do this, make a simple function out of it:
 */
var forEach=function(a,b){if(Array.prototype.forEach){Array.prototype.forEach.call(a,b);}else{return!1;}};
/*!
 * modified JavaScript Sync/Async forEach - v0.1.2 - 1/10/2012
 * github.com/cowboy/javascript-sync-async-foreach
 * Copyright (c) 2012 "Cowboy" Ben Alman; Licensed MIT
 * removed Node.js / browser support wrapper function
 * @param {Object} a Any object to walk through
 * @param {Object} b The sync callback function
 * @param {Object} [c] The async callback function
 * forEach(a,function(e){console.log("eachCallback: "+e);},!1});
 * forEach(a,function(e){console.log("eachCallback: "+e);},function(){console.log("doneCallback");});
 * passes jshint
 */
/*jslint bitwise: true */
var forEach=(function(){return function(a,b,c){var d=-1,e=a.length>>>0;(function f(g){var h,j=false===g;do++d;while(!(d in a)&&d!==e);if(j||d===e){if(c){c(!j,a);}return;}g=b.call({async:function(){return h=!0,f;}},a[d],d,a);if(!h){f(g);}})();};}());
/*jslint bitwise: false */
/*!
 * requestAnimationFrame() shim by Paul Irish
 * gist.github.com/joelambert/1002116
 * gist.github.com/englishextra/873c8f78bfda7cafc905f48a963df07b
 * paulirish.com/2011/requestanimationframe-for-smart-animating/
 */
var requestAnimFrame=(function(){return window.requestAnimationFrame||function(callback,element){window.setTimeout(callback,1000/60);};})();
/*!
 * Behaves the same as setTimeout except uses requestAnimationFrame()
 * where possible for better performance
 * modified gist.github.com/joelambert/1002116
 * the fallback function requestAnimFrame is incorporated
 * gist.github.com/joelambert/1002116
 * gist.github.com/englishextra/873c8f78bfda7cafc905f48a963df07b
 * jsfiddle.net/englishextra/dnyomc4j/
 * @param {Object} fn The callback function
 * @param {Int} delay The delay in milliseconds
 * requestTimeout(fn,delay)
 */
var requestTimeout=function(fn,delay){var requestAnimFrame=(function(){return window.requestAnimationFrame||function(callback,element){window.setTimeout(callback,1000/60);};})(),start=new Date().getTime(),handle={};function loop(){var current=new Date().getTime(),delta=current-start;if(delta>=delay){fn.call();}else{handle.value=requestAnimFrame(loop);}}handle.value=requestAnimFrame(loop);return handle;};
/*!
 * Behaves the same as clearTimeout except uses cancelRequestAnimationFrame()
 * where possible for better performance
 * gist.github.com/joelambert/1002116
 * gist.github.com/englishextra/873c8f78bfda7cafc905f48a963df07b
 * jsfiddle.net/englishextra/dnyomc4j/
 * @param {Int|Object} handle The callback function
 * clearRequestTimeout(handle)
 */
var clearRequestTimeout=function(handle){if(window.cancelAnimationFrame){window.cancelAnimationFrame(handle.value);}else{window.clearTimeout(handle);}};
/*!
 * set and clear timeout
 * based on requestTimeout and clearRequestTimeout
 * gist.github.com/joelambert/1002116
 * gist.github.com/englishextra/873c8f78bfda7cafc905f48a963df07b
 * @param {Object} f handle/function
 * @param {Int} [n] a whole positive number
 * setAutoClearedTimeout(f,n)
 */
var setAutoClearedTimeout=function(f,n){n=n||200;if(f&&"function"===typeof f){var st=requestTimeout(function(){clearRequestTimeout(st);f();},n);}};
/*!
 * Behaves the same as setInterval except uses requestAnimationFrame() where possible for better performance
 * modified gist.github.com/joelambert/1002116
 * the fallback function requestAnimFrame is incorporated
 * gist.github.com/joelambert/1002116
 * gist.github.com/englishextra/873c8f78bfda7cafc905f48a963df07b
 * jsfiddle.net/englishextra/sxrzktkz/
 * @param {Object} fn The callback function
 * @param {Int} delay The delay in milliseconds
 * requestInterval(fn, delay);
 */
var requestInterval=function(fn,delay){var requestAnimFrame=(function(){return window.requestAnimationFrame||function(callback,element){window.setTimeout(callback,1000/60);};})(),start=new Date().getTime(),handle={};function loop(){handle.value=requestAnimFrame(loop);var current=new Date().getTime(),delta=current-start;if(delta>=delay){fn.call();start=new Date().getTime();}}handle.value=requestAnimFrame(loop);return handle;};
/*!
 * Behaves the same as clearInterval except uses cancelRequestAnimationFrame()
 * where possible for better performance
 * gist.github.com/joelambert/1002116
 * gist.github.com/englishextra/873c8f78bfda7cafc905f48a963df07b
 * jsfiddle.net/englishextra/sxrzktkz/
 * @param {Int|Object} handle function handle, or function
 * clearRequestInterval(handle);
 */
var clearRequestInterval=function(handle){if(window.cancelAnimationFrame){window.cancelAnimationFrame(handle.value);}else{window.clearInterval(handle);}};
/*!
 * Fade In
 * gist.github.com/englishextra/cbf5137a95ed5e02927cd3e19e271bae
 * youmightnotneedjquery.com
 * fadeIn(el);
 * fadeIn(el, "inline-block");
 */
var fadeIn=function(el){el.style.opacity=0;var last=+new Date(),tick=function(){el.style.opacity=+el.style.opacity+(new Date()-last)/400;last=+new Date();if(+el.style.opacity<1){if(window.requestAnimationFrame){requestAnimationFrame(tick);}else{setTimeout(tick,160);}}};tick();};
/*!
 * Fade Out
 * gist.github.com/englishextra/818ba5b558f9c15f9776684b8e8feaf9
 * youmightnotneedjquery.com
 * chrisbuttery.com/articles/fade-in-fade-out-with-javascript/
 * fadeOut(el);
 */
var fadeOut=function(el){el.style.opacity=1;(function fade(){if((el.style.opacity-=0.1)<0){el.style.display="none";}else{requestAnimationFrame(fade);}})();};
/*!
 * implementing fadeIn and fadeOut without jQuery
 * modified jsfiddle.net/LzX4s/
 * gist.github.com/englishextra/baaa687f6ae9c7733d560d3ec74815cd
 * jsfiddle.net/englishextra/c3ap4y06/
 * changed options.complete(); to:
 * function"==typeof options.complete && options.complete();
 * var a=document.getElementById('test');
 * FX.fadeIn(a,{duration:2000,complete:function(){alert('Complete');}});
 * setTimeout(function(){FX.fadeOut(a,{duration:4000,complete:function(){alert('Complete');}})},2000);
 * source: jsfiddle.net/LzX4s/
 * passes jshint
 */
var FX=(function(){var e={easing:{linear:function(a){return a;},quadratic:function(a){return Math.pow(a,2);},swing:function(a){return 0.5-Math.cos(a*Math.PI)/2;},circ:function(a){return 1-Math.sin(Math.acos(a));},back:function(a,b){return Math.pow(a,2)*((b+1)*a-b);},bounce:function(a){for(var b=0,c=1;;b+=c,c/=2){if(a>=(7-4*b)/11){return-Math.pow((11-6*b-11*a)/4,2)+Math.pow(c,2);}}},elastic:function(a,b){return Math.pow(2,10*(a-1))*Math.cos(20*Math.PI*b/3*a);}},animate:function(a){if(a){var b=new Date(),c=setInterval(function(){var d=(new Date()-b)/a.duration;if(1<d){d=1;}a.progress=d;var e=a.delta(d);a.step(e);if(1==d){clearInterval(c);if("function"===typeof a.complete){a.complete();}}},a.delay||10);}},fadeOut:function(a,b){if(a){this.animate({duration:b.duration,delta:function(a){a=this.progress;return e.easing.swing(a);},complete:b.complete,step:function(b){a.style.opacity=1-b;}});}},fadeIn:function(a,b){if(a){this.animate({duration:b.duration,delta:function(a){a=this.progress;return e.easing.swing(a);},complete:b.complete,step:function(b){a.style.opacity=0+b;}});}}};return e;})();
/*!
 * Plain javascript replacement for jQuery's .ready()
 * so code can be scheduled to run when the document is ready
 * github.com/jfriend00/docReady
 * gist.github.com/englishextra/7c22a9a9cae3320318e9c9eab6777c84
 * added window object existence check
 * docReady(function(){});
 * source: github.com/jfriend00/docReady/blob/master/docready.js
 * passes jshint
 */
var docReady=(function(){"use strict";if("undefined"==typeof window||!("document"in window)){return console.log("window is undefined or document is not in window"),!1;}var readyList=[];var readyFired=false;var readyEventHandlersInstalled=false;function ready(){if(!readyFired){readyFired=true;for(var i=0;i<readyList.length;i++){readyList[i].fn.call(window,readyList[i].ctx);}readyList=[];}}function readyStateChange(){if(document.readyState==="complete"){ready();}}return function(callback,context){if(readyFired){setTimeout(function(){callback(context);},1);return;}else{readyList.push({fn:callback,ctx:context});}if(document.readyState==="complete"||(!document.attachEvent&&document.readyState==="interactive")){setTimeout(ready,1);}else if(!readyEventHandlersInstalled){if(document.addEventListener){document.addEventListener("DOMContentLoaded",ready,false);window.addEventListener("load",ready,false);}else{document.attachEvent("onreadystatechange",readyStateChange);window.attachEvent("onload",ready);}readyEventHandlersInstalled=true;}};})();
/*!
 * modified for babel Evento - v1.0.0
 * by Erik Royall <erikroyalL@hotmail.com> (http://erikroyall.github.io)
 * Dual licensed under MIT and GPL
 * identifier needs binding if its function has arguments
 * var fn=function(a){a=a||"";if(a){return a;}};
 * evento.add(window,"load",fn.bind(null,some_value));
 * removed Array.prototype.indexOf shim
 * removed Helio stuff which seems to be added
 * for some other library, and works without Helio
 * jsbin.com/jilevi/edit?html,js,output
 * jsfiddle.net/englishextra/hLxyvmcm/
 * exposed as window property
 * added window object existence check
 * source: gist.github.com/erikroyall/6618740
 * source: gist.github.com/englishextra/3a959e4da0fcc268b140
 * passes jshint
 */
var evento=(function(){return function(){if("undefined"==typeof window||!("document"in window)){return console.log("window is undefined or document is not in window"),!1;}var win=window,doc=win.document,_handlers={},addEvent,removeEvent,triggerEvent;addEvent=(function(){if(typeof doc.addEventListener==="function"){return function(el,evt,fn){el.addEventListener(evt,fn,false);_handlers[el]=_handlers[el]||{};_handlers[el][evt]=_handlers[el][evt]||[];_handlers[el][evt].push(fn);};}else if(typeof doc.attachEvent==="function"){return function(el,evt,fn){el.attachEvent(evt,fn);_handlers[el]=_handlers[el]||{};_handlers[el][evt]=_handlers[el][evt]||[];_handlers[el][evt].push(fn);};}else{return function(el,evt,fn){el["on"+evt]=fn;_handlers[el]=_handlers[el]||{};_handlers[el][evt]=_handlers[el][evt]||[];_handlers[el][evt].push(fn);};}}());removeEvent=(function(){if(typeof doc.removeEventListener==="function"){return function(el,evt,fn){el.removeEventListener(evt,fn,false);};}else if(typeof doc.detachEvent==="function"){return function(el,evt,fn){el.detachEvent(evt,fn);};}else{return function(el,evt,fn){el["on"+evt]=undefined;};}}());triggerEvent=function(el,evt){_handlers[el]=_handlers[el]||{};_handlers[el][evt]=_handlers[el][evt]||[];for(var _i=0,_l=_handlers[el][evt].length;_i<_l;_i+=1){_handlers[el][evt][_i]();}};return{add:addEvent,remove:removeEvent,trigger:triggerEvent,_handlers:_handlers};}();}());
/*!
 * if element is in viewport
 * gist.github.com/englishextra/2e9322e5eea9412f5086f7427009b903
 * stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport
 * jsfiddle.net/englishextra/9mwdxgez/
 * @param e an HTML element
 * var p = document.getElementById("h1") || "";
 * if(p){var g=function(_that){if(isInViewport(p))
 * {window.removeEventListener("scroll",_that);alert(1);}};
 * window.addEventListener("scroll",function h_w(){g(h_w);});}
 */
var isInViewport=function(w,d){var g=function(e){return(e=e?e.getBoundingClientRect()||"":"")?0<=e.top&&0<=e.left&&e.bottom<=(w.innerHeight||d.clientHeight)&&e.right<=(w.innerWidth||d.clientWidth):!0;};return g;}(window,document.documentElement||"");
/*!
 * preload an image with callback
 */
var imagesPreloaded=!1;(function(m){m="[object Array]"===Object.prototype.toString.apply(m)?m:[m];var t=function(){imagesPreloaded=!0;},f=function(){imagesPreloaded=!1;},c=[];for(var i=0,l=m.length;i<l;i++){c[i]=new Image();c[i].onabort=f;c[i].onerror=f;c[i].onload=t;c[i].src=m[i];}})(["sprite.png"]);
/*!
 * Dynamically removing / replacing an external JavaScript or CSS file
 * javascriptkit.com/javatutors/loadjavascriptcss2.shtml
 * removeJsCssFile("somescript.js", "js");
 * removeJsCssFile("somestyle.css", "css");
 * replaceJsCssFile("oldscript.js", "newscript.js", "js");
 * replaceJsCssFile("oldstyle.css", "newstyle", "css");
 */
var removeJsCssFile=function(e,c){for(var d="js"==c?"src":"css"==c?"href":"none",b=document.getElementsByTagName("js"==c?"script":"css"==c?"link":"none"),a=b.length;0<=a;a--){if(b[a]&&null!==b[a].getAttribute(d)&&-1!=b[a].getAttribute(d).indexOf(e)){b[a].parentNode.removeChild(b[a]);}}};
var createJsCssFile=function(b,c){var a=!1;if("js"==c){a=document.createElement("script");a.setAttribute("type","text/javascript");a.setAttribute("src",b);}else{if("css"==c){a=document.createElement("link");a.setAttribute("rel","stylesheet");a.setAttribute("type","text/css");a.setAttribute("href",b);}}return a;};
var replaceJsCssFile=function(e,f,c){for(var d="js"==c?"src":"css"==c?"href":"none",b=document.getElementsByTagName("js"==c?"script":"css"==c?"link":"none"),a=b.length;0<=a;a--){if(b[a]&&null!==b[a].getAttribute(d)&&-1!=b[a].getAttribute(d).indexOf(e)){var g=createJsCssFile(f,c);b[a].parentNode.replaceChild(g,b[a]);}}};
/*!
 * load CSS async
 * modified order of arguments, added callback option, removed CommonJS stuff
 * github.com/filamentgroup/loadCSS
 * gist.github.com/englishextra/50592e9944bd2edc46fe5a82adec3396
 * @param {String} _href path string
 * @param {Object} callback callback function
 * @param {String} media media attribute string value
 * @param {Object} [before] target HTML element
 * loadCSS(_href,callback,media,before)
 */
;(function(){var loadCSS=function(_href,callback,media,before){"use strict";var doc=document;var ss=doc.createElement("link");var ref;if(before){ref=before;}else{var refs=(doc.body||doc.getElementsByTagName("head")[0]).childNodes;ref=refs[refs.length-1];}var sheets=doc.styleSheets;ss.rel="stylesheet";ss.href=_href;ss.media="only x";if(callback&&"function"===typeof callback){ss.onload=callback;}function ready(cb){if(doc.body){return cb();}setTimeout(function(){ready(cb);});}ready(function(){ref.parentNode.insertBefore(ss,(before?ref:ref.nextSibling));});var onloadcssdefined=function(cb){var resolvedHref=ss.href;var i=sheets.length;while(i--){if(sheets[i].href===resolvedHref){return cb();}}setTimeout(function(){onloadcssdefined(cb);});};function loadCB(){if(ss.addEventListener){ss.removeEventListener("load",loadCB);}ss.media=media||"all";}if(ss.addEventListener){ss.addEventListener("load",loadCB);}ss.onloadcssdefined=onloadcssdefined;onloadcssdefined(loadCB);return ss;};("undefined"!==typeof window?window:this).loadCSS=loadCSS;}());
/*!
 * load JS async
 * modified order of arguments, removed CommonJS stuff
 * github.com/filamentgroup/loadJS
 * gist.github.com/englishextra/397e62184fde65d7755744fdb7a01829
 * @param {String} _src path string
 * @param {Object} callback callback function
 * loadJS(_src,callback)
 */
;(function(){var loadJS=function(_src,callback){"use strict";var ref=document.getElementsByTagName("script")[0];var script=document.createElement("script");script.src=_src;script.async=true;ref.parentNode.insertBefore(script,ref);if(callback&&"function"===typeof callback){script.onload=callback;}return script;};("undefined"!==typeof window?window:this).loadJS=loadJS;}());
/*!
 * Promise based script loader for the browser using script tags
 * github.com/MiguelCastillo/load-js
 * type: defaults to text/javascript
 * async: defaults to false
 * charset: defaults to utf-8
 * id: no default value
 * url: required if no text is provided
 * text: required if no url is provided
 * loadJS(["https://code.jquery.com/jquery-2.2.1.js",
 * "https://unpkg.com/react@15.3.1/dist/react.min.js"])
 * .then(function(){console.log("jQuery and react are loaded");});
 * loadJS([{async:true,url:"https://code.jquery.com/jquery-2.2.1.js"},
 * {async:true,url:"https://unpkg.com/react@15.3.1/dist/react.min.js"}])
 * .then(()=>{console.log("all done!");});
 * source: gist.github.com/pranksinatra/a4e57e586249dc3833e4
 * passes jshint
 */
;(function(){function exec(options){if("string"===typeof options){options={url:options};}if(!options.url&&!options.text){throw new Error("must provide a url or text to load");}var head=document.getElementsByTagName("head")[0]||document.documentElement;var script=document.createElement("script");script.charset=options.charset||"utf-8";script.type=options.type||"text/javascript";script.async=!!options.async;if(options.hasOwnProperty("id")){script.id=options.id;}if(options.url){script.src=options.url;return loadScript(head,script);}else{script.text=options.text;return runScript(head,script);}}function runScript(head,script){head.appendChild(script);return Promise.resolve(script);}function loadScript(head,script){return new Promise(function(resolve){var done=false;script.onload=script.onreadystatechange=function(){if(!done&&(!this.readyState||this.readyState==="loaded"||this.readyState==="complete")){done=true;script.onload=script.onreadystatechange=null;if(head&&script.parentNode){head.removeChild(script);}resolve(script);}};head.appendChild(script);});}var promiseLoadJS=function(items){return items instanceof Array?Promise.all(items.map(exec)):exec(items);};("undefined"!==typeof window?window:this).promiseLoadJS=promiseLoadJS;}());
/*!
 * How can I check if a CSS file has been included already?
 * gist.github.com/englishextra/d00e7046c9957199ff3e87af693f38be
 * stackoverflow.com/questions/18155347/how-can-i-check-if-a-js-file-has-been-included-already
 * @param {String} h path string
 * styleIsLoaded(h)
 */
var styleIsLoaded=function(h){var a=document.styleSheets||"";if(a)for(var b=0,d=a.length;b<d;b++)if(a[b].href==h)return!0;return!1;};
/*!
 * How can I check if a JS file has been included already?
 * gist.github.com/englishextra/403a0ca44fc5f495400ed0e20bc51d47
 * stackoverflow.com/questions/18155347/how-can-i-check-if-a-js-file-has-been-included-already
 * @param {String} s path string
 * scriptIsLoaded(s)
 */
var scriptIsLoaded=function(s){for(var b=document.getElementsByTagName("script")||"",a=0;a<b.length;a++)if(b[a].getAttribute("src")==s)return!0;return!1;};
/*!
 * Load and execute JS via AJAX
 * gist.github.com/englishextra/8dc9fe7b6ff8bdf5f9b483bf772b9e1c
 * IE 5.5+, Firefox, Opera, Chrome, Safari XHR object
 * gist.github.com/Xeoncross/7663273
 * modified callback(x.responseText,x); to callback(eval(x.responseText),x);
 * stackoverflow.com/questions/3728798/running-javascript-downloaded-with-xmlhttprequest
 * @param {String} u path string
 * @param {Object} [f] callback function
 * @param {Object} [e] on error callback function
 * ajaxLoadTriggerJS(u,f,e)
 */
var ajaxLoadTriggerJS=function(u,f,e){var w=window,x=w.XMLHttpRequest?new XMLHttpRequest():new ActiveXObject("Microsoft.XMLHTTP");x.overrideMimeType("application/javascript;charset=utf-8");x.open("GET",u,!0);x.onreadystatechange=function(){if(x.status=="404"){if(e&&"function"===typeof e){e();}console.log("Error XMLHttpRequest-ing file",x.status);return!1;}else if(x.readyState==4&&x.status==200&&x.responseText){try{var Fn=Function;new Fn(""+x.responseText).call("undefined"===typeof window?"undefined"===typeof self?"undefined"===typeof global?this:global:self:window);}catch(m){throw new Error("Error evaluating file. "+m);}if(f&&"function"===typeof f){f(x.responseText);}}};x.send(null);};
/*!
 * Load .html file
 * modified JSON with JS.md
 * gist.github.com/thiagodebastos/08ea551b97892d585f17
 * gist.github.com/englishextra/d5ce0257afcdd9a7387d3eb26e9fdff5
 * @param {String} u path string
 * @param {Object} [f] callback function
 * @param {Object} [e] on error callback function
 * ajaxLoadHTML(u,f,e)
 */
var ajaxLoadHTML=function(u,f,e){var w=window,x=w.XMLHttpRequest?new XMLHttpRequest():new ActiveXObject("Microsoft.XMLHTTP");x.overrideMimeType("text/html;charset=utf-8");x.open("GET",u,!0);x.onreadystatechange=function(){if(x.status=="404"){if(e&&"function"===typeof e){e();}console.log("Error XMLHttpRequest-ing file",x.status);return!1;}else if(x.readyState==4&&x.status==200&&x.responseText){if(f&&"function"===typeof f){f(x.responseText);}}};x.send(null);};
/*!
 * Load .json file, but don't JSON.parse it
 * modified JSON with JS.md
 * gist.github.com/thiagodebastos/08ea551b97892d585f17
 * gist.github.com/englishextra/e2752e27761649479f044fd93a602312
 * @param {String} u path string
 * @param {Object} [f] callback function
 * @param {Object} [e] on error callback function
 * ajaxLoadUnparsedJSON(u,f,e)
 */
var ajaxLoadUnparsedJSON=function(u,f,e){var w=window,x=w.XMLHttpRequest?new XMLHttpRequest():new ActiveXObject("Microsoft.XMLHTTP");x.overrideMimeType("application/json;charset=utf-8");x.open("GET",u,!0);x.onreadystatechange=function(){if(x.status=="404"){if(e&&"function"===typeof e){e();}console.log("Error XMLHttpRequest-ing file",x.status);return!1;}else if(x.readyState==4&&x.status==200&&x.responseText){if(f&&"function"===typeof f){f(x.responseText);}}};x.send(null);};
/*!
 * parse JSON with no eval using JSON-js/json_parse.js
 * with fallback to native JSON.parse
 * gist.github.com/englishextra/4c0c2dec65953cae0d3b909ee64650f7
 * @param {String} a JSON string
 * safelyParseJSON(a)
 */
var safelyParseJSON=function(a){var w=window;try{return"string"===typeof a?w.json_parse?json_parse(a):JSON.parse(a):a;}catch(e){console.log(e.name+": "+e.message);}};
/*!
 * return an array of values that match on a certain key
 * techslides.com/how-to-parse-and-search-json-in-javascript
 * gist.github.com/englishextra/872269c30d7cb2d10e3c3babdefc37b4
 * var jpr = JSON.parse(response);
 * for(var i=0,l=jpr.length;i<l;i+=1)
 * {var t=getKeyValuesFromJSON(jpr[i],"label"),
 * p=getKeyValuesFromJSON(jpr[i],"link");};
 * @param {String} b JSON entry
 * @param {String} d JSON key to match
 * getKeyValuesFromJSON(b,d)
 */
var getKeyValuesFromJSON=function(b,d){var c=[];for(var a in b){if(b.hasOwnProperty(a)){if("object"===typeof b[a]){c=c.concat(getKeyValuesFromJSON(b[a],d));}else{if(a==d){c.push(b[a]);}}}}return c;};
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
 * remove element from DOM
 * gist.github.com/englishextra/d2a286f64d404052fbbdac1e416ab808
 * @param {Object} e an Element to remove
 * removeElement(e)
 */
var removeElement=function(e){var r="remove",pN="parentNode";if(e){if("undefined"!==typeof e[r]){return e[r]();}else{return e[pN]&&e[pN].removeChild(e);}}};
/*!
 * remove all children of parent element
 * gist.github.com/englishextra/da26bf39bc90fd29435e8ae0b409ddc3
 * @param {Object} e parent HTML Element
 * removeChildren(e)
 */
var removeChildren=function(e){return function(){if(e&&e.firstChild){for(;e.firstChild;){e.removeChild(e.firstChild);}}}();};
/*!
 * Create Fragment from string/element
 * gist.github.com/englishextra/974922256540c9570e969096a00765bc
 * @param {String|object} e a text string or HTML Element to convert to fragment
 * createFragment(e)
 */
var createFragment=function(e){if("string"===typeof e){e=document.createTextNode(e);}var df=document.createDocumentFragment();df.appendChild(e);return df;};
/*!
 * insert text response as fragment into element
 * gist.github.com/englishextra/4e13afb8ce184ad28d77f6b5eed71d1f
 * @param {String} t text/response to insert
 * @param {Object} c target HTML Element
 * @param {Object} [cb] callback function
 * insertTextAsFragment(t,c)
 */
var insertTextAsFragment=function(t,c,cb){"use strict";var d=document,b=d.getElementsByTagName("body")[0]||"",cN="cloneNode",aC="appendChild",pN="parentNode",iH="innerHTML",rC="replaceChild",cR="createRange",cCF="createContextualFragment",cDF="createDocumentFragment",f=function(){return cb&&"function"===typeof cb&&cb();};try{var n=c[cN](!1);if(d[cR]){var rg=d[cR]();rg.selectNode(b);var df=rg[cCF](t);n[aC](df);return c[pN]?c[pN][rC](n,c):c[iH]=t,f();}else{n[iH]=t;return c[pN]?c[pN][rC](d[cDF][aC](n),c):c[iH]=t,f();}}catch(e){console.log(e);}return!1;};
/*!
 * append node into other with fragment
 * gist.github.com/englishextra/0ff3204d5fb285ef058d72f31e3af766
 * @param {String|object} e an HTML Element to append
 * @param {Object} a target HTML Element
 * appendFragment(e,a)
 */
var appendFragment=function(e,a){"use strict";var d=document;a=a||d.getElementsByTagNames("body")[0]||"";return function(){if(e){var d=document,df=d.createDocumentFragment()||"",aC="appendChild";if("string"===typeof e){e=d.createTextNode(e);}df[aC](e);a[aC](df);}}();};
/*!
 * Adds Element as fragment BEFORE NeighborElement
 * gist.github.com/englishextra/fa19e39ce84982b17fc76485db9d1bea
 * @param {String|object} e HTML Element to prepend before before
 * @param {Object} a target HTML Element
 * prependFragmentBefore(e,a)
 */
var prependFragmentBefore=function(e,a){if("string"===typeof e){e=document.createTextNode(e);}var p=a.parentNode||"",df=document.createDocumentFragment();return function(){if(p){df.appendChild(e);p.insertBefore(df,a);}}();};
/*!
 * Adds Element as fragment AFTER NeighborElement
 * gist.github.com/englishextra/75020c8ba3b389b19d501d8ec88e3121
 * @param {String|object} e HTML Element to append after
 * @param {Object} a target HTML Element
 * appendFragmentAfter(e,a)
 */
var appendFragmentAfter=function(e,a){if("string"===typeof e){e=document.createTextNode(e);}var p=a.parentNode||"",s=a.nextSibling||"",df=document.createDocumentFragment();return function(){if(p&&s){df.appendChild(e);p.insertBefore(df,s);}}();};
/*!
 * Adds Element BEFORE NeighborElement
 * gist.github.com/englishextra/ad6b0ed6aa934434ddbb65d3a60ba28f
 * @param {String|object} e HTML Element to prepend before
 * @param {Object} a target HTML Element
 * prependBefore(e,a)
 */
var prependBefore=function(e,a){var p=a.parentNode||"";if(p){p.insertBefore(e,a);}return!1;};
/*!
 * Adds Element AFTER NeighborElement
 * gist.github.com/englishextra/c19556b7a61865e3631cc879aaeb314e
 * @param {String|object} e HTML Element to append after
 * @param {Object} a target HTML Element
 * appendAfter(e,a)
 */
var appendAfter=function(e,a){var p=a.parentNode||"",s=a.nextSibling||"";return function(){if(p&&s){p.insertBefore(e,s);}}();};
/*!
 * set style display block of an element
 * @param {Object} a an HTML Element
 * setStyleDisplayBlock(a)
 */
var setStyleDisplayBlock=function(a){return function(){if(a){a.style.display="block";}}();};
/*!
 * set style display none of an element
 * @param {Object} a an HTML Element
 * setStyleDisplayNone(a)
 */
var setStyleDisplayNone=function(a){return function(){if(a){a.style.display="none";}}();};
/*!
 * toggle style display of an element
 * @param {Object} a an HTML Element
 * @param {String} show CSS display value
 * @param {String} hide CSS display value
 * toggleStyleDisplay(a,show,hide)
 */
var toggleStyleDisplay=function(a,show,hide){if(a){a.style.display=hide==a.style.display||""===a.style.display?show:hide;}};
/*!
 * set style opacity of an element
 * @param {Object} a an HTML Element
 * @param {Number} n any positive decimal number 0.00-1.00
 * setStyleOpacity(a,n)
 */
var setStyleOpacity=function(a,n){n=n||1;return function(){if(a){a.style.opacity=n;}}();};
/*!
 * set style visibility visible of an element
 * @param {Object} a an HTML Element
 * setStyleVisibilityVisible(a)
 */
var setStyleVisibilityVisible=function(a){return function(){if(a){a.style.visibility="visible";}}();};
/*!
 * set style visibility hidden of an element
 * @param {Object} a an HTML Element
 * setStyleVisibilityHidden(a)
 */
var setStyleVisibilityHidden=function(a){return function(){if(a){a.style.visibility="hidden";}}();};
/*!
 * set style visibility hidden of an element
 * @param {Object} a an HTML Element
 * @param {Number|String} n any decimal number 0.00-1.00, or string
 * setStyleVisibilityHidden(a)
 */
var setStyleZindex=function(a,n){n=n||1;return function(){if(a){a.style.zIndex=n;}}();};
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
 * findPos(a)
 */
var findPos=function(a){a=a.getBoundingClientRect();var b=document.body,c=document.documentElement;return{top:Math.round(a.top+(window.pageYOffset||c.scrollTop||b.scrollTop)-(c.clientTop||b.clientTop||0)),left:Math.round(a.left+(window.pageXOffset||c.scrollLeft||b.scrollLeft)-(c.clientLeft||b.clientLeft||0))};};
/*!
 * Scroll to top with Zenscroll, or fallback
 * scrollToTop()
 */
var scrollToTop=function(){var w=window;return w.zenscroll?zenscroll.toY(0):w.scrollTo(0,0);};
/*!
 * change window hash
 * @param {String} a hash string without hash sign
 * changeHash(a)
 */
var changeHash=function(a){return function(){if(a){window.location.hash="#"+("#"===a[0]?a.substr(1):a);}}();};
/*!
 * change document location
 * @param {String} a URL / path string
 * changeLocation(a)
 */
var changeLocation=function(a){return function(){if(a){document.location.href=a;}}();};
/*!
 * modified for babel Unified URL parsing API in the browser and node
 * github.com/wooorm/parse-link
 * removed AMD, CommonJS support
 * gist.github.com/englishextra/4e9a0498772f05fa5d45cfcc0d8be5dd
 * gist.github.com/englishextra/2a7fdabd0b23a8433d5fc148fb788455
 * jsfiddle.net/englishextra/fcdds4v6/
 * @param {String} url URL string
 * @param {Boolean} [true|false] if true, returns protocol:, :port, /pathname, ?search, ?query, #hash
 * if set to  false, returns protocol, port, pathname, search, query, hash
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
 * init ToProgress and extend methods
 */
var progressBar = new ToProgress({
		id : "top-progress-bar",
		color : "#FE5F55",
		height : "3px",
		duration : 0.2
	});
/*!
 * @memberof progressBar
 * @param {Int} [n] a whole positive number
 * progressBar.init(n)
 */
progressBar.init = function (n) {
	n = n || 20;
	return this.increase(n);
};
/*!
 * @memberof progressBar
 * progressBar.complete()
 */
progressBar.complete = function () {
	return this.finish(),
	this.hide();
};
progressBar.init();
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
	var w = window,
	cls = "a",
	a = ctx ? BALA.one(cls, ctx) || "" : BALA.one(cls) || "",
	g = function (e) {
		var p = e.getAttribute("href") || "",
		h_e = function (ev) {
			ev.stopPropagation();
			ev.preventDefault();
			openDeviceBrowser(p);
		};
		if (p && parseLink(p).isCrossDomain && parseLink(p).hasHTTP) {
			e.title = "" + (parseLink(p).hostname || "") + " откроется в новой вкладке";
			if ("undefined" !== typeof getHTTP && getHTTP()) {
				e.target = "_blank";
			} else {
				/* evento.add(e, "click", h_e); */
				e.onclick = h_e;
			}
		}
	},
	k = function () {
		a = ctx ? BALA(cls, ctx) || "" : BALA(cls) || "";
		if (w._) {
			_.each(a, g);
		} else if (w.forEach) {
			forEach(a, g, !1);
		} else {
			for (var i = 0, l = a.length; i < l; i += 1) {
				g(a[i]);
			}
		}
	};
	if (a) {
		console.log("triggered function: manageExternalLinks");
		k();
	}
};
evento.add(window, "load", manageExternalLinks.bind(null, ""));
/*!
 * set title on local links,
 * so that they inform that they open in currnet tab
 * @param {Object} [ctx] context HTML Element
 */
var manageLocalLinks = function (ctx) {
	"use strict";
	ctx = ctx || "";
	var w = window,
	cls = "a",
	a = ctx ? BALA.one(cls, ctx) || "" : BALA.one(cls) || "",
	g = function (e) {
		var p = e.getAttribute("href") || "";
		if (p && parseLink(p).isRelative && !e.getAttribute("title")) {
			e.title = "Откроется здесь же";
		}
	},
	k = function () {
		a = ctx ? BALA(cls, ctx) || "" : BALA(cls) || "";
		if (w._) {
			_.each(a, g);
		} else if (w.forEach) {
			forEach(a, g, !1);
		} else {
			for (var i = 0, l = a.length; i < l; i += 1) {
				g(a[i]);
			}
		}
	};
	if (a) {
		console.log("triggered function: manageLocalLinks");
		k();
	}
};
evento.add(window, "load", manageLocalLinks.bind(null, ""));
/*!
 * set click event on data path links,
 * so that they change window path
 * @param {Object} [ctx] context HTML Element
 */
var manageDataPathLinks = function (ctx) {
	"use strict";
	ctx = ctx || "";
	var w = window,
	cls = "[data-path]",
	a = ctx ? BALA.one(cls, ctx) || "" : BALA.one(cls) || "",
	ds = "dataset",
	g = function (e) {
		var p = e[ds].path || "";
		if (p && parseLink(p).isRelative) {
			/* evento.add(e, "click", changeLocation.bind(null, p)); */
			e.onclick = changeLocation.bind(null, p);
		}
	},
	k = function () {
		a = ctx ? BALA(cls, ctx) || "" : BALA(cls) || "";
		if (w._) {
			_.each(a, g);
		} else if (w.forEach) {
			forEach(a, g, !1);
		} else {
			for (var i = 0, l = a.length; i < l; i += 1) {
				g(a[i]);
			}
		}
	};
	if (a) {
		console.log("triggered function: manageDataPathLinks");
		k();
	}
};
evento.add(window, "load", manageDataPathLinks.bind(null, ""));
/*!
 * set click event on data url links,
 * so that they change window url
 * @param {Object} [ctx] context HTML Element
 */
var manageDataUrlLinks = function (ctx) {
	"use strict";
	ctx = ctx || "";
	var w = window,
	cls = "[data-url]",
	a = ctx ? BALA.one(cls, ctx) || "" : BALA.one(cls) || "",
	ds = "dataset",
	g = function (e) {
		var p = e[ds].url || "",
		h_e = function (ev) {
			ev.stopPropagation();
			ev.preventDefault();
			openDeviceBrowser(p);
		},
		w_e = function () {
			/* w.location.href = p; */
			var win = w.open(p, "_blank");
			win.focus();
		};
		if (p && parseLink(p).isCrossDomain && parseLink(p).hasHTTP) {
			e.title = "" + (parseLink(p).hostname || "") + " откроется в новой вкладке";
			if ("undefined" !== typeof getHTTP && getHTTP()) {
				/* evento.add(e, "click", w_e); */
				e.onclick = w_e;
			} else {
				/* evento.add(e, "click", h_e); */
				e.onclick = h_e;
			}
		}
	},
	k = function () {
		a = ctx ? BALA(cls, ctx) || "" : BALA(cls) || "";
		if (w._) {
			_.each(a, g);
		} else if (w.forEach) {
			forEach(a, g, !1);
		} else {
			for (var i = 0, l = a.length; i < l; i += 1) {
				g(a[i]);
			}
		}
	};
	if (a) {
		console.log("triggered function: manageDataUrlLinks");
		k();
	}
};
evento.add(window, "load", manageDataUrlLinks.bind(null, ""));
/*!
 * init fastclick
 * github.com/ftlabs/fastclick
 */
var initFastClick = function () {
	"use strict";
	var w = window,
	b = BALA.one("body") || "";
	if (w.FastClick) {
		console.log("triggered function: initFastClick");
		FastClick.attach(b);
	}
};
var loadInitFastClick = function () {
	"use strict";
	if ("undefined" !== typeof getHTTP && getHTTP()) {
		if ("undefined" !== typeof earlyHasTouch && "touch" === earlyHasTouch) {
			ajaxLoadTriggerJS("/cdn/fastclick/1.0.6/js/fastclick.fixed.min.js", initFastClick);
		}
	}
};
docReady(loadInitFastClick);
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
	var h = BALA.one("html") || "",
	cls = "loading-spinner",
	a = BALA.one("." + cls) || "",
	cL = "classList";
	console.log("triggered function: LoadingSpinner");
	if (!a) {
		a = crel("div");
		a[cL].add(cls);
		appendFragment(a, h);
	}
	return {
		show: function () {
			return h[cL].contains(cls) || h[cL].add(cls);
		},
		hide: function (f, n) {
			n = n || 500;
			var s = function () {
				h[cL].remove(cls);
				if (f && "function" === typeof f) {
					f();
				}
			};
			return setAutoClearedTimeout(s, n);
		}
	};
}
();
/*!
 * notifier42
 * Toast messages with pure JS
 * gist.github.com/englishextra/5500a860c26d5e262ef3700d822ff698
 * inspired by github.com/mlcheng/js-toast
 * @param {String|Object} m text string or HTML ELement
 * @param {Int} [n] any positive whole number, default: 0
 * @param {String} t [additioal css class name]
 * var nf=notifier42("message",8000);setTimeout(function(){nf.destroy()},2000);
 */
var Notifier42 = function (m, n, t) {
	"use strict";
	m = m || "No message passed as argument";
	n = n || 0;
	t = t || "";
	var d = document,
	b = BALA.one("body") || "",
	cls = "notifier42",
	c = BALA.one("." + cls) || "",
	cL = "classList",
	an = "animated",
	an2 = "fadeInUp",
	an4 = "fadeOutDown";
	console.log("triggered function: Notifier42");
	if (!c) {
		c = crel("div");
		appendFragment(c, b);
	}
	c[cL].add(cls, an, an2);
	if (t) {
		c[cL].add(t);
	}
	if ("string" === typeof m) {
		m = d.createTextNode(m);
	}
	appendFragment(m, c);
	var g = function (f) {
		c[cL].remove(an2);
		c[cL].add(an4);
		var r = function  ()  {
			c[cL].remove(an);
			c[cL].remove(an4);
			if (t) {
				c[cL].remove(t);
			}
			removeChildren(c);
			if (f && "function" === typeof f) {
				f();
			}
		};
		setAutoClearedTimeout(r, 400);
	},
	h_b = function () {
		evento.remove(b, "click", h_b);
		/* b.onclick = null; */
		g();
	},
	h_c = function () {
		evento.remove(c, "click", h_c);
		/* c.onclick = null; */
		g();
	};
	evento.add(b, "click", h_b);
	evento.add(c, "click", h_c);
	/* b.onclick = h_b;
	c.onclick = h_c; */
	if (0 !== n) {
		setAutoClearedTimeout(g, n);
	}
	return {
		destroy : function () {
			return g(removeElement.bind(null, c));
		}
	};
};
/*!
 * notifier42-write-a-comment-on-content
 */
var initNotifier42WriteComment = function () {
	"use strict";
	if ("undefined" !== typeof getHTTP && getHTTP()) {
		var w = window,
		n = "notifier42-write-comment",
		m = "Напишите, что понравилось, а что нет. Регистрироваться не нужно.",
		p = parseLink(w.location.href).origin,
		g = function () {
			var ntfr = new Notifier42(crel("a", {
					"href" : "#disqus_thread"
				}, m),
				8000);
			Cookies.set(n, encodeURIComponent(m));
		};
		if (!Cookies.get(n) && p) {
			console.log("triggered function: initNotifier42WriteComment");
			setAutoClearedTimeout(g, 16000);
		}
	}
};
docReady(initNotifier42WriteComment);
/*!
 * notifier42-write-me
 */
var initNotifier42WriteMe = function () {
	"use strict";
	if ("undefined" !== typeof getHTTP && getHTTP()) {
		var w = window,
		n = "notifier42-write-me",
		m = "Напишите мне, отвечу очень скоро. Регистрироваться не нужно.",
		p = parseLink(w.location.href).origin,
		g = function () {
			var ntfr = new Notifier42(crel("a", {
					"href" : "#/feedback"
				}, m),
				8000);
			Cookies.set(n, encodeURIComponent(m));
		};
		if (!Cookies.get(n) && p) {
			console.log("triggered function: initNotifier42WriteMe");
			setAutoClearedTimeout(g, 8000);
		}
	}
};
docReady(initNotifier42WriteMe);
/*!
 * load Yandex map
 * tech.yandex.ru/maps/jsbox/2.1/mapbasics
 */
var initYandexMap = function (a) {
	"use strict";
	var c = BALA.one(a) || "",
	is_active = "is-active",
	ds = "dataset",
	cL = "classList",
	f = c ? (c[ds].center || "") : "",
	z = c ? (c[ds].zoom || "") : "",
	b_s = c ? (BALA.one(c[ds].btnShow) || "") : "",
	b_d = c ? (BALA.one(c[ds].btnDestroy) || "") : "",
	js = getHTTP(!0) + "://api-maps.yandex.ru/2.1/?lang=ru_RU",
	myMap,
	init = function () {
		try {
			myMap = new ymaps.Map(c.id, {
					center : JSON.parse(f),
					zoom : z
				});
			LoadingSpinner.hide();
		} catch (e) {
			setStyleDisplayBlock(b_s);
		}
	},
	g = function () {
		ymaps.ready(init);
		c[cL].add(is_active);
		setStyleDisplayNone(b_s);
	},
	k = function () {
		try {
			g();
		} catch(e) {
			setStyleDisplayBlock(b_s);
		}
	},
	v = function () {
		loadJS(js, k);
	},
	q = function () {
		removeChildren(c);
		appendFragment(crel("p", "Карты доступны только в веб версии этой страницы."), c);
		c.removeAttribute("id");
		setStyleDisplayNone(b_s.parentNode);
	},
	h_b_d = function () {
		evento.remove(b_d, "click", h_b_d);
		/* b_d.onclick = null; */
		myMap.destroy();
	};
	if (c && f && z && b_s) {
		console.log("triggered function: initYandexMap");
		if ("undefined" !== typeof getHTTP && getHTTP()) {
			if (b_d) {
				evento.add(b_d, "click", h_b_d);
				/* b_d.onclick = h_b_d; */
			}
			LoadingSpinner.show();
			if (scriptIsLoaded(js)) {
				k();
			} else {
				v();
			}
		} else {
			q();
		}
	}
};
/*!
 * manage Yandex Map Button
 */
var manageYandexMapButton = function (a) {
	"use strict";
	var c = BALA.one(a) || "",
	ds = "dataset",
	e = c ? (BALA.one(c[ds].btnShow) || "") : "",
	h_e = function () {
		evento.remove(e, "click", h_e);
		/* e.onclick = null; */
		initYandexMap(a);
		return !1;
	};
	if (c && e) {
		console.log("triggered function: manageYandexMapButton");
		evento.add(e, "click", h_e);
		/* e.onclick = h_e; */
	}
};
evento.add(window, "load", manageYandexMapButton.bind(null, "#ymap"));
/*!
 * manage data lightbox img links
 */
var manageDataLightboxImgLinks = function (ctx) {
	"use strict";
	ctx = ctx || "";
	var w = window,
	b = BALA.one("body") || "",
	cls = "[data-lightbox]",
	a = ctx ? BALA.one(cls, ctx) || "" : BALA.one(cls) || "",
	ilc = "img-lightbox-container",
	c = BALA.one("." + ilc) || "",
	m = BALA.one("img", c) || "",
	cL = "classList",
	ds = "dataset",
	an = "animated",
	an1 = "fadeIn",
	an2 = "fadeInUp",
	an3 = "fadeOut",
	an4 = "fadeOutDown";
	if (!c) {
		c = crel("div");
		m = crel("img");
		c[cL].add(ilc);
		m.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
		m.alt = "";
		crel(c, m);
		appendFragment(c, b);
	}
	var g = function (_this) {
		LoadingSpinner.show();
		c[cL].add(an, an1);
		m[cL].add(an, an2);
		var _href = _this.getAttribute("href") || "",
		r = function () {
			m[cL].remove(an2);
			m[cL].add(an4);
			var st1 = function ()  {
				c[cL].remove(an, an3);
				m[cL].remove(an, an4);
				setStyleDisplayNone(c);
			},
			st2 = function () {
				c[cL].remove(an1);
				c[cL].add(an3);
				setAutoClearedTimeout(st1, 400);
			};
			setAutoClearedTimeout(st2, 400);
		},
		v = function (e) {
			if (27 === (e.which || e.keyCode)) {
				r();
			}
		},
		z = function () {
			var h_c = function () {
				/* evento.remove(c, "click", h_c); */
				c.onclick = null;
				r();
			},
			h_w = function (e) {
				/* evento.remove(w, "keyup", h_w); */
				w.onkeyup =  null;
				v(e);
			};
			/* evento.add(c, "click", h_c);
			evento.add(w, "keyup",  h_w); */
			c.onclick = h_c;
			w.onkeyup =  h_w;
			setStyleDisplayBlock(c);
			LoadingSpinner.hide();
		},
		pr = function (u) {
			return new Promise(function (y, n) {
				var a = new Image();
				a.onload = function () {
					y(u);
				};
				a.onerror = function () {
					n(u);
				};
				a.src = u;
			});
		};
		pr(_href).then(function (u) {
			m.src = u;
			z();
		}).catch (function (e) {
			r();
			console.log("Error loading image", e);
		});
	},
	k = function (e) {
		var v = e[ds].lightbox || "",
		p = e.getAttribute("href") || "",
		h_e = function (_this, e) {
			e.stopPropagation();
			e.preventDefault();
			g(_this);
		};
		if ("img" === v && p) {
			if (parseLink(p).isAbsolute && !parseLink(p).hasHTTP) {
				e.setAttribute("href", p.replace(/^/, getHTTP(!0) + ":"));
			}
			/* evento.add(e, "click", h_e.bind(null, e)); */
			e.onclick = h_e.bind(null, e);
		}
	};
	if (a) {
		console.log("triggered function: manageDataLightboxImgLinks");
		a = ctx ? BALA(cls, ctx) || "" : BALA(cls) || "";
		if (w._) {
			_.each(a, k);
		} else if (w.forEach) {
			forEach(a, k, !1);
		} else {
			for (var j = 0, l = a.length; j < l; j += 1) {
				k(a[j]);
			}
		}
	}
};
evento.add(window, "load", manageDataLightboxImgLinks.bind(null, ""));
/*!
 * hide ui buttons in fullscreen mode
 */
var hideUiBtnsInFullScreen = function () {
	"use strict";
	var w = window,
	cd_prev = BALA.one(".cd-prev") || "",
	cd_next = BALA.one(".cd-next") || "",
	btn_nav_menu = BALA.one(".btn-nav-menu") || "",
	btn_menu_more = BALA.one(".btn-menu-more") || "",
	btn_show_vk_like = BALA.one(".btn-show-vk-like") || "",
	openapi_js_src = getHTTP(!0) + "://vk.com/js/api/openapi.js?122",
	btn_block_social_buttons = BALA.one(".share-buttons") || "",
	ui_totop = BALA.one("#ui-totop") || "",
	holder_search_form = BALA.one(".holder-search-form") || "",
	f = !1;
	if (!f) {
		f = !0;
		/*!
		 * Detecting if a browser is in full screen mode
		 * stackoverflow.com/questions/2863351/checking-if-browser-is-in-fullscreen
		 * stackoverflow.com/questions/1047319/detecting-if-a-browser-is-in-full-screen-mode
		 */
		var args = [cd_prev, cd_next, btn_nav_menu, btn_menu_more, btn_block_social_buttons, ui_totop, holder_search_form];
		if ((w.navigator.standalone) || (screen.height === w.outerHeight) || (w.fullScreen) || (w.innerWidth == screen.width && w.innerHeight == screen.height)) {
			for (var i = 0, l = args.length; i < l; i  += 1) {
				setStyleDisplayNone(args[i]);
			}
			setStyleDisplayNone(btn_show_vk_like);
		} else {
			for (var j = 0, m = args.length; j < m; j += 1) {
				setStyleDisplayBlock(args[j]);
			}
			if (!scriptIsLoaded(openapi_js_src)) {
				setStyleDisplayBlock(btn_show_vk_like);
			}
		}
	}
};
var resizeHideUiBtnsInFullScreen = function () {
	if (!("undefined" !== typeof earlyDeviceSize && "medium" === earlyDeviceSize)) {
		hideUiBtnsInFullScreen();
	}
};
evento.add(window, "resize", resizeHideUiBtnsInFullScreen);
/*!
 * init all Masonry grids
 */
var initAllMasonry = function () {
	"use strict";
	var w = window,
	g = ".masonry-grid",
	h = ".masonry-grid-item",
	k = ".masonry-grid-sizer",
	grid = BALA.one(g) || "",
	grid_item = BALA.one(h) || "",
	q = function (a) {
		var f = function (e) {
			if (w.Masonry) {
				var msnry = new Masonry(e, {
						itemSelector : h,
						columnWidth : k,
						gutter : 0
					});
			}
		};
		if (w._) {
			_.each(a, f);
		} else if (w.forEach) {
			forEach(a, f, !1);
		} else {
			for (var i = 0, l = a.length; i < l; i += 1) {
				f(a[i]);
			}
		}
	},
	v = function (a) {
		q(a);
	};
	if (grid && grid_item) {
		console.log("triggered function: initAllMasonry");
		var a = BALA(g);
		if (a) {
			v(a);
		}
	}
};
var loadInitAllMasonry = function () {
	"use strict";
	var w = window,
	js = "../../cdn/masonry/4.1.1/js/masonry.pkgd.fixed.min.js";
	if (w.XMLHttpRequest || w.ActiveXObject) {
		if (w.Promise) {
			promiseLoadJS(js).then(initAllMasonry);
		} else {
			ajaxLoadTriggerJS(js, initAllMasonry);
		}
	} else {
		if (!scriptIsLoaded(js)) {
			loadJS(js, initAllMasonry);
		}
	}
};
evento.add(window, "load", loadInitAllMasonry);
/*!
 * init all Packery grids
 */
/*
var initAllPackery = function () {
	"use strict";
	var w = window,
	g = ".masonry-grid",
	h = ".masonry-grid-item",
	k = ".masonry-grid-sizer",
	grid = BALA.one(g) || "",
	grid_item = BALA.one(h) || "",
	q = function (a, c) {
		if (w.Packery) {
			var pckry,
			f = function (e) {
				pckry = new Packery(e, {
						itemSelector : h,
						columnWidth : k,
						gutter : 0,
						percentPosition: !0
					});
			};
			if (w._) {
				_.each(a, f);
			} else if (w.forEach) {
				forEach(a, f, !1);
			} else {
				for (var j = 0, m = a.length; j < m; j += 1) {
					f(a[j]);
				}
			}
			if (w.Draggabilly) {
				var draggie,
				s = function (e) {
					var draggableElem = e;
					draggie = new Draggabilly(draggableElem, {});
					draggies.push(draggie);
				},
				draggies = [];
				if (w._) {
					_.each(c, s);
				} else if (w.forEach) {
					forEach(c, s, !1);
				} else {
					for (var i = 0, l = c.length; i < l; i += 1) {
						s(c[i]);
					}
				}
				if (pckry) {
					pckry.bindDraggabillyEvents(draggie);
				}
			}
		}
	},
	v = function (a, c) {
		q(a, c);
	};
	if (grid && grid_item) {
		console.log("triggered function: initAllPackery");
		var a = BALA(g),
		c = BALA(h) || "";
		if (a, c) {
			v(a, c);
		}
	}
};
var loadInitAllPackery = function () {
	"use strict";
	var w = window,
	js = "../../cdn/packery/2.1.1/js/packery.draggabilly.pkgd.fixed.min.js";
	if (w.XMLHttpRequest || w.ActiveXObject) {
		if (w.Promise) {
			promiseLoadJS(js).then(initAllPackery);
		} else {
			ajaxLoadTriggerJS(js, initAllPackery);
		}
	} else {
		if (!scriptIsLoaded(js)) {
			loadJS(js, initAllPackery);
		}
	}
};
evento.add(window, "load", loadInitAllPackery);
*/
/*!
 * init photoswipe
 */
var initPhotoswipe = function () {
	"use strict";
	var w = window,
	c = ".masonry-grid",
	gallery = BALA.one(c) || "",
	item = ".masonry-grid-item",
	gallery_item = BALA.one(item) || "",
	ds = "dataset",
	pswp = function (k) {
		var p = function (l) {
			for (var a = l.childNodes, b = a.length, e = [], c, g, d, f = 0; f < b; f++)
				if (l = a[f], 1 === l.nodeType) {
					c = l.children;
					g = l.getAttribute("data-size").split("x");
					d = {
						src: l.getAttribute("href"),
						w: parseInt(g[0], 10),
						h: parseInt(g[1], 10),
						author: l.getAttribute("data-author")
					};
					d.el = l;
					if (0 < c.length) {
						d.msrc = c[0].getAttribute("src");
						if (1 < c.length) {
							d.title = c[1].innerHTML;
						}
					}
					if (l.getAttribute("data-med"))
						g = l.getAttribute("data-med-size").split("x");
					d.m = {
						src: l.getAttribute("data-med"),
						w: parseInt(g[0], 10),
						h: parseInt(g[1], 10)
					};
					d.o = {
						src: d.src,
						w: d.w,
						h: d.h
					};
					e.push(d);
				}
			return e;
		},
		q = function a(b, e) {
			return b && (e(b) ? b : a(b.parentNode, e));
		},
		h = function (a) {
			a = a || window.event;
			if (a.preventDefault) {
				a.preventDefault();
			} else {
				a.returnValue = !1;
			}
			a = q(a.target || a.srcElement, function (a) {
					return "A" === a.tagName;
				});
			if (a) {
				for (var b = a.parentNode, e = a.parentNode.childNodes, c = e.length, g = 0, d, f = 0; f < c; f++)
					if (1 === e[f].nodeType) {
						if (e[f] === a) {
							d = g;
							break;
						}
						g++;
					}
				if (0 <= d) {
					n(d, b);
				}
				return !1;
			}
		},
		n = function (a, b, e) {
			e = document.querySelectorAll(".pswp")[0];
			var c,
			g;
			g = p(b);
			a = {
				index: a,
				galleryUID: b.getAttribute("data-pswp-uid"),
				getThumbBoundsFn: function (a) {
					var b = window.pageYOffset || document.documentElement.scrollTop;
					a = g[a].el.children[0].getBoundingClientRect();
					return {
						x: a.left,
						y: a.top + b,
						w: a.width
					};
				},
				addCaptionHTMLFn: function (a, b, c) {
					if (!a.title)
						return b.children[0].innerText = "", !1;
					b.children[0].innerHTML = a.title + "<br/><small>Photo: " + a.author + "</small>";
					return !0;
				}
			};
			c = new PhotoSwipe(e, PhotoSwipeUI_Default, g, a);
			var f = !1,
			k = !0,
			h;
			c.listen("beforeResize", function () {
				var a = window.devicePixelRatio ? window.devicePixelRatio : 1;
				a = Math.min(a, 2.5);
				var d = c.viewportSize.x * a;
				if (1200 <= d || !c.likelyTouchDevice && 800 < d || 1200 < screen.width) {
					if (!f) {
						h = f = !0;
					}
				} else {
					if (f) {
						f = !1;
						h = !0;
					}
				}
				if (h && !k) {
					c.invalidateCurrItems();
				}
				if (k) {
					k = !1;
				}
				h = !1;
			});
			c.listen("gettingData", function (a, b) {
				if (f) {
					b.src = b.o.src;
					b.w = b.o.w;
					b.h = b.o.h;
				} else {
					b.src = b.m.src;
					b.w = b.m.w;
					b.h = b.m.h;
				}
			});
			c.init();
		};
		k = document.querySelectorAll(k);
		for (var m = 0, r = k.length; m < r; m++) {
			k[m].setAttribute("data-pswp-uid", m + 1);
			k[m].onclick = h;
		}
		h = function () {
			var a = window.location.hash.substring(1),
			b = {};
			if (5 > a.length)
				return b;
			for (var z = z.split("&"), e = 0; e < z.length; e++)
				if (z[e]) {
					var c = z[e].split("=");
					if (2 < c.length) {
						b[c[0]] = c[1];
					}
				}
			if (b.gid) {
				b.gid = parseInt(b.gid, 10);
			}
			if (!b.hasOwnProperty("pid"))
				return b;
			b.pid = parseInt(b.pid, 10);
			return b;
		}
		();
		if (0 < h.pid && 0 < h.gid) {
			n(h.pid - 1, k[h.gid - 1], !0);
		}
	},
	g = function (e) {
		var m = e[ds].med || "";
		if (m && parseLink(m).isCrossDomain && !parseLink(m).hasHTTP) {
			e[ds].med = m.replace (/^/, getHTTP(!0) + ":");
		}
		/*!
		 * dont use href to read href, use getAttribute, because href adds protocol
		 */
		var h = e.getAttribute("href");
		if (h && parseLink(h).isCrossDomain && !parseLink(h).hasHTTP) {
			e.href = h.replace (/^/, getHTTP(!0) + ":");
		}
	},
	k = function (a) {
		if (w._) {
			_.each(a, g);
		} else if (w.forEach) {
			forEach(a, g, !1);
		} else {
			for (var i = 0, l = a.length; i < l; i += 1) {
				g(a[i]);
			}
		}
	},
	q = function (e) {
		setStyleDisplayBlock(e);
		var a = BALA("a", e) || "";
		if (a) {
			k(a);
		}
	},
	s = function () {
		var galleries = BALA(c);
		if (w._) {
			_.each(galleries, q);
		} else if (w.forEach) {
			forEach(galleries, q, !1);
		} else {
			for (var i = 0, l = galleries.length; i < l; i += 1) {
				q(galleries[i]);
			}
		}
	},
	v = function () {
		/* var fn = function () {
			s();
			pswp(c);
		};
		ajaxLoadTriggerJS(photoswipe_js_src, fn); */
		s();
		pswp(c);
	};
	if (gallery && gallery_item) {
		console.log("triggered function: initPhotoswipe");
		v();
	}
};
var loadInitPhotoswipe = function () {
	"use strict";
	var w = window,
	js = "../cdn/photoswipe/4.1.0/js/photoswipe.photoswipe-ui-default.fixed.min.js";
	if (w.XMLHttpRequest || w.ActiveXObject) {
		if (w.Promise) {
			promiseLoadJS(js).then(initPhotoswipe);
		} else {
			ajaxLoadTriggerJS(js, initPhotoswipe);
		}
	} else {
		if (!scriptIsLoaded(js)) {
			loadJS(js, initPhotoswipe);
		}
	}
};
docReady(loadInitPhotoswipe);
/*!
 * init tablesort
 * github.com/tristen/tablesort
 */
var initTablesort = function (ctx) {
	"use strict";
	ctx = ctx || "";
	var w = window,
	cls = "table.sort",
	a = ctx ? BALA.one(cls, ctx) || "" : BALA.one(cls) || "",
	g = function (e) {
		var s = e.id || "";
		if (s && w.Tablesort) {
			var t = BALA.one("#" + s),
			c = BALA.one("#" + s + " caption") || "";
			if (!c) {
				prependFragmentBefore(crel("caption"), t.firstChild);
				c = t.firstChild;
			}
			appendFragment("Сортируемая таблица", c);
			var tablesort = new Tablesort(t);
		}
	},
	k = function () {
		a = ctx ? BALA(cls, ctx) || "" : BALA(cls) || "";
		if (w._) {
			_.each(a, g);
		} else if (w.forEach) {
			forEach(a, g, !1);
		} else {
			for (var i = 0, l = a.length; i < l; i += 1) {
				g(a[i]);
			}
		}
	};
	if (a) {
		console.log("triggered function: initTablesort");
		k();
	}
};
var loadInitTablesort = function () {
	"use strict";
	var w = window,
	js = "../../cdn/tablesort/4.0.1/js/tablesort.fixed.min.js";
	if (w.XMLHttpRequest || w.ActiveXObject) {
		if (w.Promise) {
			promiseLoadJS(js).then(initTablesort.bind(null, ""));
		} else {
			ajaxLoadTriggerJS(js, initTablesort.bind(null, ""));
		}
	} else {
		if (!scriptIsLoaded(js)) {
			loadJS(js, initTablesort.bind(null, ""));
		}
	}
};
docReady(loadInitTablesort);
/*!
 * init prettyPrint
 */
var initPrettyPrint = function () {
	"use strict";
	var w = window,
	a = BALA.one('[class^="prettyprint"]') || "";
	if (a) {
		console.log("triggered function: initPrettyPrint");
		if (w.prettyPrint) {
			prettyPrint();
		}
	}
};
var loadInitPrettyPrint = function () {
	"use strict";
	var w = window,
	js = "../../cdn/google-code-prettify/0.1/js/prettify.lang-css.fixed.min.js";
	if (w.XMLHttpRequest || w.ActiveXObject) {
		if (w.Promise) {
			promiseLoadJS(js).then(initPrettyPrint);
		} else {
			ajaxLoadTriggerJS(js, initPrettyPrint);
		}
	} else {
		if (!scriptIsLoaded(js)) {
			loadJS(js, initPrettyPrint);
		}
	}
};
docReady(loadInitPrettyPrint);
/*!
 * init download app btn
 */
var initDownloadAppBtn = function (n) {
	"use strict";
	n = n || 2000;
	var b = BALA.one("body") || "",
	s = navigator.userAgent || "",
	cls = "btn-download-app",
	cL = "classList",
	an = "animated",
	an2 = "bounceInRight",
	an4 = "bounceOutRight",
	m,
	p;
	if (/Windows/i.test(s) && /(WOW64|Win64)/i.test(s)) {
		m = "url(../../libs/products/img/download_windows_app_144x52.png)";
		p = "https://englishextraapp.codeplex.com/downloads/get/1539373";
	} else if (/(x86_64|x86-64|x64;|amd64|AMD64|x64_64)/i.test(s) && /(Linux|X11)/i.test(s)) {
		m = "url(../../libs/products/img/download_linux_app_144x52.png)";
		p = "https://englishextraapp.codeplex.com/downloads/get/1540156";
	} else if (/IEMobile/i.test(s)) {
		m = "url(../../libs/products/img/download_wp_app_144x52.png)";
		p = "https://englishextraapp.codeplex.com/downloads/get/1536102";
	} else if (/Android/i.test(s)) {
		m = "url(../../libs/products/img/download_android_app_144x52.png)";
		p = "https://englishextraapp.codeplex.com/downloads/get/1528911";
	} else {
		m = "";
		p = "";
	}
	var g = function () {
		var h_a = function (e) {
			e.stopPropagation();
			e.preventDefault();
			openDeviceBrowser(p);
		},
		a = crel("a");
		a.style.backgroundImage = m;
		a[cL].add(cls, an, an2);
		a.href = p;
		if ("undefined" !== typeof getHTTP && getHTTP()) {
			a.target = "_blank";
		} else {
			evento.add(a, "click", h_a);
			/* a.onclick = h_a; */
		}
		appendFragment(a, b);
		var s1 = function () {
			evento.remove(a, "click", h_a);
			/* a.onclick = null; */
			removeElement(a);
		},
		s2 = function () {
			a[cL].remove(an2);
			a[cL].add(an4);
			setAutoClearedTimeout(s1, 750);
		};
		setAutoClearedTimeout(s2, n);
	};
	if (b && s && p) {
		console.log("triggered function: initDownloadAppBtn");
		g();
	}
};
var loadInitDownloadAppBtn = function () {
	var s = function () {
		initDownloadAppBtn(8000);
	};
	setAutoClearedTimeout(s, 3000);
};
evento.add(window, "load", loadInitDownloadAppBtn);
/*!
 * replace img src with data-src
 * @param {Object} [ctx] context HTML Element
 */
var manageDataSrcImg = function (ctx) {
	"use strict";
	ctx = ctx || "";
	var w = window,
	el = "img[data-src]",
	a = ctx ? BALA.one(el, ctx) || "" : BALA.one(el) || "",
	ds = "dataset",
	pN = "parentNode",
	g = function (e) {
		var p = e[ds].src || "";
		if (p) {
			if (parseLink(p).isAbsolute && !parseLink(p).hasHTTP) {
				e[ds].src = p.replace(/^/, getHTTP(!0) + ":");
			}
			if (w.lzld) {
				lzld(e);
			} else {
				e.src = e[ds].src;
			}
			setStyleVisibilityVisible(e[pN]);
			setStyleOpacity(e[pN], 1);
		}
	};
	if (a) {
		console.log("triggered function: manageDataSrcImg");
		a = ctx ? BALA(el, ctx) || "" : BALA(el) || "";
		if (w._) {
			_.each(a, g);
		} else if (w.forEach) {
			forEach(a, g, !1);
		} else {
			for (var i = 0, l = a.length; i < l; i += 1) {
				g(a[i]);
			}
		}
	}
};
/*!
 * append media-iframe
 * @param {Object} [ctx] context HTML Element
 */
var manageDataSrcIframe = function (ctx) {
	"use strict";
	ctx = ctx || "";
	var w = window,
	el = "iframe[data-src]",
	a = ctx ? BALA.one(el, ctx) || "" : BALA.one(el) || "",
	ds = "dataset",
	pN = "parentNode",
	g = function (e) {
		var p = e[ds].src || "";
		if (p) {
			if (parseLink(p).isAbsolute && !parseLink(p).hasHTTP) {
				e[ds].src = p.replace(/^/, getHTTP(!0) + ":");
			}
			if (w.lzld) {
				lzld(e);
			} else {
				e.src = e[ds].src;
			}
			setStyleVisibilityVisible(e[pN]);
			setStyleOpacity(e[pN], 1);
			crel(e, {
				"scrolling" : "no",
				"frameborder" : "no",
				"style" : "border:none;",
				"webkitallowfullscreen" : "true",
				"mozallowfullscreen" : "true",
				"allowfullscreen" : "true"
			});
		}
	};
	if (a) {
		console.log("triggered function: manageDataSrcIframe");
		a = ctx ? BALA(el, ctx) || "" : BALA(el) || "";
		if (w._) {
			_.each(a, g);
		} else if (w.forEach) {
			forEach(a, g, !1);
		} else {
			for (var i = 0, l = a.length; i < l; i += 1) {
				g(a[i]);
			}
		}
	}
};
var loadManageDataSrcImgIframe = function () {
	"use strict";
	var w = window,
	a = BALA.one("img[data-src]") || "",
	c = BALA.one("iframe[data-src]") || "",
	js = "../../cdn/lazyload/3.2.2/js/lazyload.fixed.min.js",
	f = function () {
		if (a) {
			manageDataSrcImg();
		}
		if (c) {
			manageDataSrcIframe();
		}
	};
	if (a || c) {
		if (w.XMLHttpRequest || w.ActiveXObject) {
			if (w.Promise) {
				promiseLoadJS(js).then(f);
			} else {
				ajaxLoadTriggerJS(js, f);
			}
		} else {
			if (!scriptIsLoaded(js)) {
				loadJS(js, f);
			}
		}
	}
};
evento.add(window, "load", loadManageDataSrcImgIframe);
/*!
 * manage search input
 */
var manageSearchInput = function () {
	"use strict";
	var a = BALA.one("#text") || "",
	g = function (_this) {
		_this.value = _this.value.replace(/\\/g, "").replace(/ +(?= )/g, " ").replace(/\/+(?=\/)/g, "/") || "";
	},
	k = function (e) {
		e.focus();
		evento.add(e, "input", g.bind(null, e));
		/* e.oninput = g.bind(null, e); */
	};
	if (a) {
		console.log("triggered function: manageSearchInput");
		k(a);
	}
};
docReady(manageSearchInput);
/*!
 * add click event on hidden-layer show btn
 * @param {Object} [ctx] context HTML Element
 */
var manageExpandingLayers = function (ctx) {
	"use strict";
	ctx = ctx || "";
	var w = window,
	cls = ".btn-expand-hidden-layer",
	a = ctx ? BALA.one(cls, ctx) || "" : BALA.one(cls) || "",
	cL = "classList",
	pN = "parentNode",
	is_active = "is-active",
	h_e = function (_this) {
		var s = _this[pN] ? _this[pN].nextElementSibling : "";
		if (s) {
			_this[cL].toggle(is_active);
			s[cL].toggle(is_active);
		}
		return !1;
	},
	k = function (e) {
		/* evento.add(e, "click", h_e.bind(null, e)); */
		e.onclick = h_e.bind(null, e);
	},
	q = function () {
		a = ctx ? BALA(cls, ctx) || "" : BALA(cls) || "";
		if (w._) {
			_.each(a, k);
		} else if (w.forEach) {
			forEach(a, k, !1);
		} else {
			for (var i = 0, l = a.length; i < l; i += 1) {
				k(a[i]);
			}
		}
	};
	if (a) {
		console.log("triggered function: manageExpandingLayers");
		q();
	}
};
evento.add(window, "load", manageExpandingLayers.bind(null, ""));
/*!
 * add click event on source code show btn
 * @param {Object} [ctx] context HTML Element
 */
var manageSourceCodeLayers = function (ctx) {
	"use strict";
	ctx = ctx || "";
	var w = window,
	cls = ".sg-btn--source",
	a = ctx ? BALA.one(cls, ctx) || "" : BALA.one(cls) || "",
	cL = "classList",
	pN = "parentNode",
	is_active = "is-active",
	h_e = function (_this) {
		var s = _this[pN] ? _this[pN].nextElementSibling : "";
		if (s) {
			_this[cL].toggle(is_active);
			s[cL].toggle(is_active);
		}
		return !1;
	},
	k = function (e) {
		/* evento.add(e, "click", h_e.bind(null, e)); */
		e.onclick = h_e.bind(null, e);
	},
	q = function () {
		a = ctx ? BALA(cls, ctx) || "" : BALA(cls) || "";
		if (w._) {
			_.each(a, k);
		} else if (w.forEach) {
			forEach(a, k, !1);
		} else {
			for (var i = 0, l = a.length; i < l; i += 1) {
				k(a[i]);
			}
		}
	};
	if (a) {
		console.log("triggered function: manageSourceCodeLayers");
		q();
	}
};
evento.add(window, "load", manageSourceCodeLayers.bind(null, ""));
/*!
 * init qr-code
 * stackoverflow.com/questions/12777622/how-to-use-enquire-js
 */
var showLocationQR = function () {
	"use strict";
	var w = window,
	d = document,
	a = BALA.one("#location-qr-code") || "",
	p = w.location.href || "",
	cls = "qr-code-img",
	cL = "classList",
	g = function () {
		removeChildren(a);
		var t = d.title ? ("Ссылка на страницу «" + d.title.replace(/\[[^\]]*?\]/g, "").trim() + "»") : "",
		s = getHTTP(!0) + "://chart.googleapis.com/chart?cht=qr&chld=M%7C4&choe=UTF-8&chs=300x300&chl=" + encodeURIComponent(p),
		m = crel("img");
		m[cL].add(cls);
		m.src = s;
		m.title = t;
		m.alt = t;
		appendFragment(m, a);
	};
	if (a && p) {
		console.log("triggered function: showLocationQR");
		if ("undefined" !== typeof getHTTP && getHTTP()) {
			if (!("undefined" !== typeof earlyDeviceSize && "small" === earlyDeviceSize)) {
				g();
			}
		} else {
			setStyleDisplayNone(a);
		}
	}
};
evento.add(window, "load", showLocationQR);
/*!
 * init nav-menu
 */
var initNavMenu = function () {
	"use strict";
	var w = window,
	container = BALA.one("#container") || "",
	page = BALA.one("#page") || "",
	btn = BALA.one("#btn-nav-menu") || "",
	panel = BALA.one("#panel-nav-menu") || "",
	items = BALA("a", panel) || "",
	holder = BALA.one("#holder-panel-menu-more") || "",
	cL = "classList",
	is_active = "is-active",
	p = w.location.href || "",
	r = function () {
		page[cL].remove(is_active);
		panel[cL].remove(is_active);
		btn[cL].remove(is_active);
	},
	g = function () {
		var h_container = function () {
			if (panel[cL].contains(is_active)) {
				r();
			}
		};
		evento.add(container, "click", h_container);
		/* container.onclick = h_container; */
	},
	k = function () {
		var h_btn = function (e) {
			e.preventDefault();
			e.stopPropagation();
			holder[cL].remove(is_active);
			page[cL].toggle(is_active);
			panel[cL].toggle(is_active);
			btn[cL].toggle(is_active);
		};
		evento.add(btn, "click", h_btn);
		/* btn.onclick = h_btn; */
	},
	q = function () {
		holder[cL].remove(is_active);
		r();
	},
	m = function (e) {
		e[cL].remove(is_active);
	},
	n = function (e) {
		e[cL].add(is_active);
	},
	s = function (a) {
		if (w._) {
			_.each(a, m);
		} else if (w.forEach) {
			forEach(a, m, !1);
		} else {
			for (var j = 0, l = a.length; j < l; j += 1) {
				m(a[j]);
			}
		}
	},
	v = function (e) {
		var h_e = function ()  {
			if (panel[cL].contains(is_active)) {
				q();
			}
			s(items);
			n(e);
		};
		evento.add(e, "click", h_e);
		/* e.onclick = h_e; */
		if (e.href == p) {
			n(e);
		} else {
			m(e);
		}
	},
	z = function () {
		if (w._) {
			_.each(items, v);
		} else if (w.forEach) {
			forEach(items, v, !1);
		} else {
			for (var i = 0, l = items.length; i < l; i += 1) {
				v(items[i]);
			}
		}
	};
	if (container && page && btn && panel && items) {
		console.log("triggered function: initNavMenu");
		/*!
		 * open or close nav
		 */
		k();
		g();
		/*!
		 * close nav, scroll to top, highlight active nav item
		 */
		z();
	}
};
docReady(initNavMenu);
/*!
 * add updates link to menu more
 * place that above init menu more
 */
var addAppUpdatesLink = function () {
	"use strict";
	var panel = BALA.one("#panel-menu-more") || "",
	items = BALA("li", panel) || "",
	s = navigator.userAgent || "",
	p;
	if (/Windows/i.test(s) && /(WOW64|Win64)/i.test(s)) {
		p = "https://englishextraapp.codeplex.com/downloads/get/1539373";
	} else if (/(x86_64|x86-64|x64;|amd64|AMD64|x64_64)/i.test(s) && /(Linux|X11)/i.test(s)) {
		p = "https://englishextraapp.codeplex.com/downloads/get/1540156";
	} else if (/IEMobile/i.test(s)) {
		p = "https://englishextraapp.codeplex.com/downloads/get/1536102";
	} else if (/Android/i.test(s)) {
		p = "https://englishextraapp.codeplex.com/downloads/get/1528911";
	} else {
		p = "";
	}
	var	g = function () {
		var li = crel("li"),
		a = crel("a"),
		t = "Скачать приложение сайта";
		a.title = "" + (parseLink(p).hostname || "") + " откроется в новой вкладке";
		a.href = p;
		if ("undefined" !== typeof getHTTP && getHTTP()) {
			a.target = "_blank";
		} else {
			/*!
			 * no prevent default and  void .href above
			 */
			/* jshint -W107 */
			a.href = "javascript:void(0);";
			/* jshint +W107 */
			evento.add(a, "click", openDeviceBrowser.bind(null, p));
			/* a.onclick = openDeviceBrowser.bind(null, p); */
		}
		crel(li, crel(a, "" + t));
		if (!!panel.firstChild) {
			prependFragmentBefore(li, panel.firstChild);
		}
	};
	if (panel && items && p) {
		console.log("triggered function: addAppUpdatesLink");
		g();
	}
};
docReady(addAppUpdatesLink);
/*!
 * init menu-more
 */
var initMenuMore = function () {
	"use strict";
	var w = window,
	container = BALA.one("#container") || "",
	holder = BALA.one("#holder-panel-menu-more") || "",
	btn = BALA.one("#btn-menu-more") || "",
	panel = BALA.one("#panel-menu-more") || "",
	items = BALA("li", panel) || "",
	cL = "classList",
	is_active = "is-active",
	h_e = function () {
		holder[cL].remove(is_active);
	},
	g = function (e) {
		evento.add(e, "click", h_e);
		/* e.onclick = h_e; */
	},
	k = function () {
		evento.add(container, "click", h_e);
		/* container.onclick = h_e; */
	},
	q = function () {
		var h_btn = function (e)  {
			e.preventDefault();
			e.stopPropagation();
			holder[cL].toggle(is_active);
		};
		evento.add(btn, "click", h_btn);
		/* btn.onclick = h_btn; */
	},
	v = function () {
		if (w._) {
			_.each(items, g);
		} else if (w.forEach) {
			forEach(items, g, !1);
		} else {
			for (var i = 0, l = items.length; i < l; i += 1) {
				g(items[i]);
			}
		}
	};
	if (container && holder && btn && panel && items) {
		console.log("triggered function: initMenuMore");
		/*!
		 * hide menu more on outside click
		 */
		k();
		/*!
		 * show or hide menu more
		 */
		q();
		/*!
		 * hide menu more on item clicked
		 */
		v();
	}
};
docReady(initMenuMore);
/*!
 * show menu-more on document ready
 */
var showMenuMore = function (n) {
	"use strict";
	n = n || 2000;
	var a = BALA.one("#holder-panel-menu-more") || "",
	is_active = "is-active",
	cL = "classList",
	s = function () {
		a[cL].add(is_active);
	};
	if (a) {
		setAutoClearedTimeout(s, n);
	}
};
docReady(showMenuMore.bind(null, 2000));
/*!
 * init ui-totop
 */
var initUiTotop = function () {
	"use strict";
	var w = window,
	b = BALA.one("body") || "",
	h = BALA.one("html") || "",
	u = "ui-totop",
	v = "ui-totop-hover",
	g = function (f) {
		var z = function (n) {
			var o = w.pageYOffset,
			i = 0,
			x = function (o, l) {
					return function () {
						l -= o * n;
						w.scrollTo(0, l);
						i += 1;
						if (150 < i || 0 > l) {
							clearInterval(si);
						}
					};
				},
			si = setInterval(x.bind(null, n, o--), 50);
		},
		t = "Наверх",
		a = crel("a"),
		s = crel("span"),
		h_a = function (e) {
			e.preventDefault();
			e.stopPropagation();
			if (w.zenscroll) {
				zenscroll.toY(0);
			} else {
				z(50);
			}
		};
		a.id = u;
		/* jshint -W107 */
		a.href = "javascript:void(0);";
		/* jshint +W107 */
		a.title = t;
		evento.add(a, "click", h_a);
		/* a.onclick = h_a; */
		setStyleOpacity(a, 0);
		s.id = v;
		appendFragment(crel(a, s, "" + t), b);
		if (f && "function" === typeof f) {
			f();
		}
	},
	k = function (_this) {
		var a = _this.pageYOffset || h.scrollTop || b.scrollTop || "",
		c = _this.innerHeight || h.clientHeight || b.clientHeight || "",
		e = BALA.one("#" + u) || "";
		if (a && c && e) {
			if (a > c) {
				setStyleVisibilityVisible(e);
				setStyleOpacity(e, 1);
			} else {
				setStyleVisibilityHidden(e);
				setStyleOpacity(e, 0);
			}
		}
	},
	q = function () {
		evento.add(w, "scroll", k.bind(null, w));
		/* w.onscroll = k.bind(null, w); */
	};
	if (b) {
		console.log("triggered function: initUiTotop");
		g(q);
	}
};
docReady(initUiTotop);
/*!
 * init pluso-engine or ya-share on click
 */
var initPlusoYaShare = function () {
	"use strict";
	var a = BALA.one("#share-buttons") || "",
	pluso = BALA.one(".pluso") || "",
	ya_share2 = BALA.one(".ya-share2") || "",
	pluso_like_js_src = getHTTP(!0) + "://share.pluso.ru/pluso-like.js",
	share_js_src = getHTTP(!0) + "://yastatic.net/share2/share.js",
	g = function (s, b) {
		setStyleVisibilityVisible(s);
		setStyleOpacity(s, 1);
		setStyleDisplayNone(b);
	},
	k = function (js, s, b) {
		if (!scriptIsLoaded(js)) {
			loadJS(js, g.bind(null, s, b));
		}
	},
	q = function () {
		if (pluso) {
			k(pluso_like_js_src, pluso, a);
		} else {
			if (ya_share2) {
				k(share_js_src, ya_share2, a);
			}
		}
	},
	v = function () {
		var h_a = function (e) {
			evento.remove(a, "click", h_a);
			/* a.onclick = null; */
			e.preventDefault();
			e.stopPropagation();
			q();
		};
		evento.add(a, "click", h_a);
		/* a.onclick = h_a; */
	};
	if ((pluso || ya_share2) && a) {
		console.log("triggered function: initPlusoYaShare");
		if ("undefined" !== typeof getHTTP && getHTTP()) {
			v();
		} else {
			setStyleDisplayNone(a);
		}
	}
};
docReady(initPlusoYaShare);
/*!
 * init Masonry grid and rerender on imagesLoaded progress
 */
var initMasonryImagesLoaded = function () {
	"use strict";
	var w = window,
	g = ".masonry-grid",
	h = ".masonry-grid-item",
	k = ".masonry-grid-sizer",
	c = BALA.one(g) || "",
	a = BALA.one(h) || "",
	q = function () {
		var imgLoad;
		if (w.Masonry && w.imagesLoaded) {
			var msnry = new Masonry(c, {
					itemSelector: h,
					columnWidth: k,
					gutter: 0,
					percentPosition: !0
				});
			console.log("function initMasonryImagesLoaded => initialised msnry");
			imgLoad = imagesLoaded(g);
			imgLoad.on("progress", function (instance) {
				msnry.layout();
				console.log("function initMasonryImagesLoaded => reinitialised imgLoad");
			});
			if ("undefined" !== typeof imagesPreloaded) {
				imagesPreloaded = !0;
			}
		} else if (w.Packery && w.imagesLoaded) {
			var pckry = new Packery(c, {
					itemSelector: h,
					columnWidth: k,
					gutter: 0,
					percentPosition: !0
				});
			console.log("function initMasonryImagesLoaded => initialised pckry");
			imgLoad = imagesLoaded(g);
			imgLoad.on("progress", function (instance) {
				pckry.layout();
				console.log("function initMasonryImagesLoaded => reinitialised imgLoad");
			});
			if ("undefined" !== typeof imagesPreloaded) {
				imagesPreloaded = !0;
			}
		} else {
			console.log("function initMasonry => no library is loaded");
		}
	};
	if (c && a) {
		setAutoClearedTimeout(q, 100);
	}
};
var loadInitMasonryImagesLoaded = function () {
	"use strict";
	var w = window,
	/* js = "../cdn/masonry/4.1.1/js/masonry.imagesloaded.pkgd.fixed.min.js"; */
	js = "../cdn/packery/2.1.1/js/packery.imagesloaded.pkgd.fixed.min.js";
	if (w.XMLHttpRequest || w.ActiveXObject) {
		if (w.Promise) {
			promiseLoadJS(js).then(initMasonryImagesLoaded);
		} else {
			ajaxLoadTriggerJS(js, initMasonryImagesLoaded);
		}
	} else {
		if (!scriptIsLoaded(js)) {
			loadJS(js, initMasonryImagesLoaded);
		}
	}
};
evento.add(window, "load", loadInitMasonryImagesLoaded);
/*!
 * init superbox
 * If you want coords relative to the parent node, use element.offsetTop.
 * Add element.scrollTop if you want to take the parent scrolling into account.
 * (or use jQuery .position() if you are fan of that library)
 * If you want coords relative to the document use element.getBoundingClientRect().top.
 * Add window.pageYOffset if you want to take the document scrolling into account.
 * Subtract element.clientTop if you don't consider the element border as the part of the element
 * stackoverflow.com/questions/6777506/offsettop-vs-jquery-offset-top
 * In IE<=11, calling getBoundingClientRect on an element outside of the DOM
 * throws an unspecified error instead of returning a 0x0 DOMRect. See IE bug #829392.
 * caniuse.com/#feat=getboundingclientrect
 * stackoverflow.com/questions/3464876/javascript-get-window-x-y-position-for-scroll
 */
var initSuperBox = function () {
	"use strict";
	var w = window,
	d = document,
	cL = "classList",
	s1 = "superbox-list",
	s2 = "superbox-show",
	s3 = "superbox-current-desc",
	s4 = "superbox-close",
	s5 = "superbox-desc",
	an = "animated",
	an1 = "fadeIn",
	an2  = "fadeOut",
	lists = BALA("." + s1) || "",
	s_show_div = crel("div", {
			"class" : s2
		}, crel("div", {
				"class" : s3
			})),
	s_close_div = crel("div", {
			"class" : s4
		}),
	g = function (_this) {
		var s_desc = BALA.one("." + s5, _this) || "",
		s_desc_html = s_desc.innerHTML;
		appendFragmentAfter(s_show_div, _this);
		var s_show = BALA.one("." + s2) || "";
		setStyleDisplayBlock(s_show);
		var s_cur_desc = BALA.one("." + s3) || "";
		removeChildren(s_cur_desc);
		s_cur_desc.insertAdjacentHTML("beforeend", s_desc_html);
		crel(s_cur_desc, s_close_div);
		setStyleOpacity(s_cur_desc, 0);
		setStyleDisplayBlock(s_cur_desc);
		var reveal_pos = _this.offsetTop,
		hide_pos = w.pageYOffset || d.documentElement.scrollTop;
		/* crel(s_cur_desc, crel("p", "" + reveal_pos + " / " + hide_pos)); */
		var si1 = function () {
			if (w.zenscroll) {
				zenscroll.toY(reveal_pos, 200);
			} else {
				w.scroll(0, reveal_pos);
			}
		};
		/* setImmediate(si1); */
		setAutoClearedTimeout(si1, 100);
		s_cur_desc[cL].add(an, an1);
		/*!
		 * track clicks on external links
		 */
		var link = BALA.one("a", s_cur_desc) || "";
		if (link) {
			var links = BALA("a", s_cur_desc),
			q = function (_this) {
				var b = BALA.one("body") || "",
				rfrr = encodeURIComponent(d.location.href || ""),
				ttl = encodeURIComponent(d.title || "").replace("\x27", "&#39;"),
				p = _this.getAttribute("href") || "",
				dmn = p ? encodeURIComponent(p) : "",
				s = /localhost/.test(self.location.host) ? "http://localhost/externalcounters/" : "";
				if (s) {
					var a = crel("div", {
							"style" : "position:absolute;left:-9999px;width:1px;height:1px;border:0;background:transparent url(" + s + "?dmn=" + dmn + "&rfrr=" + rfrr + "&ttl=" + ttl + "&encoding=utf-8) top left no-repeat;"
						});
					appendFragment(a, b);
				}
			},
			trackClicks = function (e) {
				var p = e.getAttribute("href") || "",
				h_n = function (_this, e) {
					e.preventDefault();
					e.stopPropagation();
					q(_this);
					openDeviceBrowser(p);
				};
				if ("undefined" !== typeof getHTTP && getHTTP()) {
					e.target = "_blank";
					evento.add(e, "click", q.bind(null, e));
					/* e.onclick = q.bind(null, e); */
				} else {
					evento.add(e, "click", h_n.bind(null, e));
					/* e.onclick = h_n.bind(null, e); */
				}
			};
			if (w._) {
				_.each(links, trackClicks);
			} else if (w.forEach) {
				forEach(links, trackClicks, !1);
			} else {
				for (var j = 0, l = links.length; j < l; j += 1) {
					trackClicks(links[j]);
				}
			}
		}
		/*!
		 * hide description
		 */
		var s_close = BALA.one("." + s4, s_cur_desc) || "",
		doOnClose = function () {
			var si2 = function () {
				if (w.zenscroll) {
					zenscroll.toY(hide_pos, 200);
				} else {
					w.scroll(0, hide_pos);
				}
			};
			/* setImmediate(si2); */
			setAutoClearedTimeout(si2, 100);
			s_cur_desc[cL].remove(an1);
			s_cur_desc[cL].add(an2);
			var s = function () {
				setStyleDisplayNone(s_cur_desc);
				setStyleDisplayNone(s_show);
				s_cur_desc[cL].remove(an, an2);
			};
			setAutoClearedTimeout(s, 200);
		};
		if (s_close) {
			var h_s_close = function (e) {
				evento.remove(s_close, "click", h_s_close);
				/* s_close.onclick = null; */
				e.preventDefault();
				e.stopPropagation();
				doOnClose();
			};
			evento.add(s_close, "click", h_s_close);
			/* s_close.onclick = h_s_close; */
		}
	},
	k = function (e) {
		var h_e = function (_this, e) {
			e.preventDefault();
			e.stopPropagation();
			g(_this);
		};
		/* evento.add(e, "click", h_e.bind(null, e)); */
		e.onclick = h_e.bind(null, e);
	};
	if (lists) {
		console.log("triggered function: initSuperBox");
		if (w._) {
			_.each(lists, k);
		} else if (w.forEach) {
			forEach(lists, k, !1);
		} else {
			for (var i = 0, l = lists.length; i < l; i += 1) {
				k(lists[i]);
			}
		}
	}
};
docReady(initSuperBox);
/*!
 * init disqus_thread and Masonry / Packery
 * add Draggabilly to Packarey
 * gist.github.com/englishextra/5e423ff34f67982f017b
 * percentPosition: !0 works well with percent-width items,
 * as items will not transition their position on resize.
 * masonry.desandro.com/options.html
 */
var initMasonryDisqus = function () {
	"use strict";
	var w = window,
	disqus_thread = BALA.one("#disqus_thread") || "",
	is_active = "is-active",
	ds = "dataset",
	disqus_shortname = disqus_thread ? (disqus_thread[ds].shortname || "") : "",
	embed_js_src = getHTTP(!0) + "://" + disqus_shortname + ".disqus.com/embed.js",
	g = ".masonry-grid",
	h = ".masonry-grid-item",
	k = ".masonry-grid-sizer",
	grid = BALA.one(g) || "",
	grid_item = BALA.one(h) || "",
	cL = "classList",
	pN = "parentNode",
	/*! Masonry */
	q = function (a) {
		var t = function () {
			if (w.Masonry) {
				msnry = new Masonry(a, {
						itemSelector: h,
						columnWidth: k,
						gutter: 0,
						percentPosition: !0
					});
				console.log("function initMasonryDisqus => initialised msnry");
				var si = requestInterval(function () {
						console.log("function initMasonryDisqus => started Interval");
						if (imagesPreloaded) {
							clearRequestInterval(si);
							console.log("function initMasonryDisqus => si=" + si + "; imagesPreloaded=" + imagesPreloaded);
							msnry.layout();
							console.log("function initMasonryDisqus => reinitialised msnry");
						}
					}, 100);
			}
		};
		if ("undefined" !== typeof imagesPreloaded) {
			setAutoClearedTimeout(t, 100);
		} else {
			console.log("function initMasonryDisqus => undefined: imagesPreloaded");
		}
	},
	/*! or Packery */
	v = function (a, c) {
		var x = function () {
			if (w.Packery) {
				pckry = new Packery(a, {
						itemSelector: h,
						columnWidth: k,
						gutter: 0,
						percentPosition: !0
					});
				console.log("function initMasonryDisqus => initialised pckry");
				var si = requestInterval(function () {
						console.log("function initMasonryDisqus => started Interval");
						if (imagesPreloaded) {
							clearRequestInterval(si);
							console.log("function initMasonryDisqus => si=" + si + "; imagesPreloaded=" + imagesPreloaded);
							pckry.layout();
							console.log("function initMasonryDisqus => reinitialised pckry");
						}
					}, 100);
				if (c) {
					if (w.Draggabilly) {
						var draggie,
						f = function (e) {
							var draggableElem = e;
							draggie = new Draggabilly(draggableElem, {});
							draggies.push(draggie);
							console.log("function initMasonryDisqus => initialised draggie");
						},
						draggies = [];
						if (w._) {
							_.each(c, f);
						} else if (w.forEach) {
							forEach(c, f, !1);
						} else {
							for (var i = 0, l = c.length; i < l; i += 1) {
								f(c[i]);
							}
						}
						if (pckry && draggie) {
							pckry.bindDraggabillyEvents(draggie);
							console.log("function initMasonryDisqus => binded draggie to pckry");
						}
					}
				}
			}
		};
		if ("undefined" !== typeof imagesPreloaded) {
			setAutoClearedTimeout(x, 100);
		} else {
			console.log("function initMasonryDisqus => undefined: imagesPreloaded");
		}
	},
	z = function () {
		var s = function () {
			var si = requestInterval(function () {
					console.log("function initMasonryDisqus => started Interval");
					var disqus_thread_height = disqus_thread.clientHeight || disqus_thread.offsetHeight || "";
					if (108 < disqus_thread_height) {
						clearRequestInterval(si);
						console.log("function initMasonryDisqus => si=" + si + "; disqus_thread_height=" + disqus_thread_height);
						if ("undefined" !== typeof msnry && msnry) {
							msnry.layout();
							console.log("function initMasonryDisqus => reinitialised msnry");
						} else {
							if ("undefined" !== typeof pckry && pckry) {
								pckry.layout();
								console.log("function initMasonryDisqus => reinitialised pckry");
							}
						}
					}
				}, 100);
			disqus_thread[cL].add(is_active);
		};
		if (!scriptIsLoaded(embed_js_src)) {
			loadJS(embed_js_src, s);
		}
	};
	if (grid && grid_item) {
		console.log("triggered function: initMasonryDisqus");
		var msnry,
		pckry;
		/*! Masonry */
		q(grid);
		/*! or Packery */
		var c = BALA(h) || "";
		v(grid, c);
		if (disqus_thread && disqus_shortname) {
			if ("undefined" !== typeof getHTTP && getHTTP()) {
				z();
			} else {
				setStyleDisplayNone(disqus_thread[pN][pN]);
			}
		}
	}
};
var loadInitMasonryDisqus = function () {
	"use strict";
	var w = window,
	js = "../cdn/masonry/4.1.1/js/masonry.pkgd.fixed.min.js";
	/* js = "../cdn/packery/2.1.1/js/packery.draggabilly.pkgd.fixed.min.js"; */
	if (w.XMLHttpRequest || w.ActiveXObject) {
		if (w.Promise) {
			promiseLoadJS(js).then(initMasonryDisqus);
		} else {
			ajaxLoadTriggerJS(js, initMasonryDisqus);
		}
	} else {
		if (!scriptIsLoaded(js)) {
			loadJS(js, initMasonryDisqus);
		}
	}
};
evento.add(window, "load", loadInitMasonryDisqus);
/*!
 * init parallax
 */
var initParallax = function () {
	"use strict";
	var w = window,
	mq = w.matchMedia("(min-width: 768px)"),
	s = BALA.one("#scene1") || "",
	p = BALA.one("#parallax") || "",
	m = BALA.one("#parallax-disabled") || "";
	if (mq.matches) {
		setStyleDisplayBlock(p);
		setStyleDisplayNone(m);
		if (s) {
			if (w.Parallax) {
				var prlx = new Parallax(s);
			}
		}
	} else {
		setStyleDisplayNone(p);
		setStyleDisplayBlock(m);
	}
};
var loadInitParallax = function () {
	"use strict";
	var w = window,
	js = "/cdn/parallax/2.1.3/js/parallax.fixed.min.js";
	if (w.XMLHttpRequest || w.ActiveXObject) {
		if (w.Promise) {
			promiseLoadJS(js).then(initParallax);
		} else {
			ajaxLoadTriggerJS(js, initParallax);
		}
	} else {
		if (!scriptIsLoaded(js)) {
			loadJS(js, initParallax);
		}
	}
};
evento.add(window, "load", loadInitParallax);
/*!
 * set event on include HTML links
 */
var includeHTMLintoTarget = function (_this, u, t) {
	"use strict";
	var w = window,
	c = BALA.one(t) || "",
	pN = "parentNode",
	c_pn = c[pN]  || "",
	g = function () {
		var s = function () {
			if (_this[pN]) {
				setStyleDisplayNone(_this[pN]);
			} else {
				setStyleDisplayNone(_this);
			}
		},
		k = function (t) {
			var tf = function () {
				s();
				if (c_pn) {
					manageExternalLinks(c_pn);
					manageLocalLinks(c_pn);
					manageDataSrcImg(c_pn);
					manageDataLightboxImgLinks(c_pn);
				}
			};
			insertTextAsFragment(t, c, tf);
		},
		q = function () {
			s();
			setStyleDisplayNone(c);
		};
		if (w.Promise && w.fetch && !isElectron) {
			fetch(u).then(function (r) {
				if (!r.ok) {
					q();
					throw new Error(r.statusText);
				}
				return r;
			}).then(function (r) {
				return r.text();
			}).then(function (b) {
				k(b);
			}).catch (function (e) {
				console.log("Error inserting content", e);
			});
		} else if (w.reqwest) {
			reqwest({
				url : u,
				type : "html",
				method : "get",
				error : function (e) {
					q();
					console.log("Error reqwest-ing file", e);
				},
				success : function (r) {
					k(r);
				}
			});
		} else {
			ajaxLoadHTML(u, function (r) {
				k(r);
			}, function (r) {
				q();
			});
		}
	};
	if (c) {
		console.log("triggered function: includeHTMLintoTarget");
		g();
	}
};
/*!
 * manage data target links
 */
var manageDataTargetLinks = function (ctx) {
	"use strict";
	ctx = ctx || "";
	var w = window,
	cls = "[data-target]",
	a = ctx ? BALA.one(cls, ctx) || "" : BALA.one(cls) || "",
	ds = "dataset",
	g = function (e) {
		var u = e[ds].include || "",
		t = e[ds].target || "",
		h_e = function (_this, e) {
			/* evento.remove(_this, "click", h_e); */
			_this.onclick = null;
			e.preventDefault();
			e.stopPropagation();
			includeHTMLintoTarget(_this, u, t);
		};
		if (u && t) {
			e.title = "Появится здесь же";
			/* evento.add(e, "click", h_e.bind(null, e)); */
			e.onclick = h_e.bind(null, e);
		}
	},
	k = function () {
		a = ctx ? BALA(cls, ctx) || "" : BALA(cls) || "";
		if (w._) {
			_.each(a, g);
		} else if (w.forEach) {
			forEach(a, g, !1);
		} else {
			for (var i = 0, l = a.length; i < l; i += 1) {
				g(a[i]);
			}
		}
	};
	if (a) {
		console.log("triggered function: manageDataTargetLinks");
		k();
	}
};
evento.add(window, "load", manageDataTargetLinks.bind(null, ""));
/*!
 * load or refresh disqus_thread on click
 */
var loadRefreshDisqus = function () {
	"use strict";
	var w = window,
	c = BALA.one("#disqus_thread") || "",
	is_active = "is-active",
	btn = BALA.one("#btn-show-disqus") || "",
	p = w.location.href || "",
	cL = "classList",
	ds = "dataset",
	n = c ? (c[ds].shortname || "") : "",
	js = getHTTP(!0) + "://" + n + ".disqus.com/embed.js",
	g = function () {
		setStyleDisplayNone(btn);
		c[cL].add(is_active);
	},
	k = function () {
		try {
			DISQUS.reset({
				reload : !0,
				config : function () {
					this.page.identifier = n;
					this.page.url = p;
				}
			});
			g();
		} catch(e) {
			setStyleDisplayBlock(btn);
		}
	},
	v = function () {
		loadJS(js, g);
	},
	z = function () {
		removeChildren(c);
		appendFragment(crel("p", "Комментарии доступны только в веб версии этой страницы."), c);
		c.removeAttribute("id");
		setStyleDisplayNone(btn.parentNode);
	};
	if (c && btn && n && p) {
		console.log("triggered function: loadRefreshDisqus");
		if ("undefined" !== typeof getHTTP && getHTTP()) {
			if (scriptIsLoaded(js)) {
				k();
			} else {
				v();
			}
		} else {
			z();
		}
	}
};
/*!
 * manage Disqus Button
 */
var manageDisqusButton = function () {
	"use strict";
	var c = BALA.one("#disqus_thread") || "",
	e = c ? (BALA.one("#btn-show-disqus") || "") : "",
	h_e = function () {
		evento.remove(e, "click", h_e);
		/* e.onclick = null; */
		loadRefreshDisqus();
		return !1;
	};
	if (c && e) {
		console.log("triggered function: manageDisqusButton");
		evento.add(e, "click", h_e);
		/* e.onclick = h_e; */
	}
};
evento.add(window, "load", manageDisqusButton);
/*!
 * init disqus_thread on scroll
 */
var initDisqusOnScroll = function () {
	"use strict";
	var h1 = BALA.one("#h1") || "";
	if (h1) {
		var w = window,
		disqus_thread = BALA.one("#disqus_thread") || "",
		is_active = "is-active",
		btn = BALA.one("#btn-show-disqus") || "",
		p = w.location.href || "",
		cL = "classList",
		ds = "dataset",
		pN = "parentNode",
		disqus_shortname = disqus_thread ? (disqus_thread[ds].shortname || "") : "",
		embed_js_src = getHTTP(!0) + "://" + disqus_shortname + ".disqus.com/embed.js",
		g = function () {
			setStyleDisplayNone(btn);
			disqus_thread[cL].add(is_active);
			if ("undefined" !== typeof waypoint && waypoint) {
				waypoint.destroy();
			}
		},
		k = function () {
			if (!scriptIsLoaded(embed_js_src)) {
				loadJS(embed_js_src, g);
			}
		},
		q = function () {
			var h_btn = function (e) {
				evento.remove(btn, "click", h_btn);
				/* btn.onclick = null; */
				e.preventDefault();
				e.stopPropagation();
				k();
			};
			evento.add(btn, "click", h_btn);
			/* btn.onclick = h_btn; */
		},
		v = function () {
			removeChildren(disqus_thread);
			appendFragment(crel("p", "Комментарии доступны только в веб версии этой страницы."), disqus_thread);
			disqus_thread.removeAttribute("id");
			setStyleDisplayNone(btn[pN]);
		};
		if (disqus_thread && btn && disqus_shortname && p) {
			console.log("triggered function: initDisqusOnScroll");
			if ("undefined" !== typeof getHTTP && getHTTP()) {
				if ("undefined" !== typeof earlyDeviceSize && "small" === earlyDeviceSize) {
					q();
				} else {
					if (w.Waypoint) {
						try {
							var waypoint = new Waypoint({
									element : disqus_thread,
									handler : function (direction) {
										k();
									}
								});
						} catch (e) {
							console.log(e);
						}
						q();
					} else if (w.isInViewport) {
						var h_w = function () {
							if (isInViewport(disqus_thread)) {
								evento.remove(w, "scroll", h_w);
								/* w.onscroll = null; */
								k();
							}
						};
						evento.add(w, "scroll", h_w);
						/* w.onscroll = h_w; */
					} else {
						q();
					}
				}
			} else {
				v();
			}
		}
	}
};
evento.add(window, "load", initDisqusOnScroll);
/*!
 * init DoSlide
 * A simple slider.
 * github.com/MopTym/doSlide/blob/master/demo/3_1_slider.html
 */
var initDoSlide = function () {
	"use strict";
	var w = window,
	d = document,
	cd_prev = BALA.one(".cd-prev") || "",
	cd_next = BALA.one(".cd-next") || "",
	timer = function (slide, interval, token) {
		var next = function () {
			token = setTimeout(next, interval);
			if (!(d.hidden || d.webkitHidden)) {
				slide.next();
			}
		};
		return function () {
			clearTimeout(token);
			token = setTimeout(next, interval);
		};
	},
	g = function () {
		if ("undefined" !== typeof slideTimer) {
			/* setStyleDisplayNone(cd_prev);
			setStyleDisplayNone(cd_next);
		} else { */
			setStyleDisplayBlock(cd_prev);
			setStyleDisplayBlock(cd_next);
			var h_cd_prev = function (e) {
				e.preventDefault();
				e.stopPropagation();
				slide.prev();
			};
			evento.add(cd_prev, "click", h_cd_prev);
			/* cd_prev.onclick = h_cd_prev; */
			var h_cd_next = function (e) {
				e.preventDefault();
				e.stopPropagation();
				slide.next();
			};
			evento.add(cd_next, "click", h_cd_next);
			/* cd_next.onclick = h_cd_next; */
		}
	};
	/*!
	 * dont JSMin line below: Notepad++ will freeze
	 * comment out if you dont want slide autorotation
	 */
	if (w.DoSlide) {
		var slide = new DoSlide(".container", {
			duration : 2000,
			horizontal : true,
			infinite : true
		}),
		slideTimer = timer(slide, 5000);
		slide.onChanged(slideTimer).do(slideTimer);
		/*!
		 * init next button if no slide autorotation
		 */
		if (cd_next || cd_prev) {
			g();
		}
	}
};
var loadInitDoSlide = function () {
	"use strict";
	var w = window,
	js = "../../cdn/doSlide/1.1.4/js/do-slide.fixed.min.js";
	if (w.XMLHttpRequest || w.ActiveXObject) {
		if (w.Promise) {
			promiseLoadJS(js).then(initDoSlide);
		} else {
			ajaxLoadTriggerJS(js, initDoSlide);
		}
	} else {
		if (!scriptIsLoaded(js)) {
			loadJS(js, initDoSlide);
		}
	}
};
docReady(loadInitDoSlide);
/*!
 * add smooth scroll or redirection to static select options
 * @param {Object} [ctx] context HTML Element
 */
var manageStaticSelect = function (ctx) {
	"use strict";
	ctx = ctx || "";
	var w = window,
	cls = "#pages_select",
	a = ctx ? BALA.one(cls, ctx) || "" : BALA.one(cls) || "",
	g = function (_this) {
		var h = _this.options[_this.selectedIndex].value || "",
		zh = h ? (isValidId(h, !0) ? BALA.one(h) : "") : "";
		if (h) {
			if (w.zenscroll) {
				if (zh) {
					zenscroll.to(zh);
				} else {
					changeLocation(h);
				}
			} else {
				if (zh) {
					w.scroll(0, findPos(zh));
				} else {
					changeLocation(h);
				}
			}
		}
	},
	k = function () {
		/* evento.add(a, "change", g.bind(null, a)); */
		a.onchange = g.bind(null, a);
	};
	if (a) {
		console.log("triggered function: manageStaticSelect");
		k();
	}
};
evento.add(window, "load", manageStaticSelect.bind(null, ""));
/*!
 * load json and tronsform into select options
 * add smooth scroll or redirection to static select options
 * @param {Object} [ctx] context HTML Element
 */
var manageContentsSelect = function (ctx) {
	"use strict";
	ctx = ctx || "";
	var w = window,
	d = document,
	cls = "#contents_select",
	a = ctx ? BALA.one(cls, ctx) || "" : BALA.one(cls) || "",
	jsn = "../libs/contents/json/contents.json",
	aC = "appendChild",
	g = function (e, f) {
		var t = getKeyValuesFromJSON(e, "label") || "",
		p = getKeyValuesFromJSON(e, "link") || "";
		if (t && p) {
			f[aC](crel("option", {
					"value" : p,
					"title" : "" + t
				}, truncString("" + t, 33)));
		}
	},
	k = function (_this) {
		var h = _this.options[_this.selectedIndex].value || "",
		zh = h ? (isValidId(h, !0) ? BALA.one(h) : "") : "";
		if (h) {
			if (w.zenscroll) {
				if (zh) {
					zenscroll.to(zh);
				} else {
					changeLocation(h);
				}
			} else {
				if (zh) {
					w.scroll(0, findPos(zh));
				} else {
					changeLocation(h);
				}
			}
		}
	},
	q = function (r) {
		var jpr = safelyParseJSON(r);
		if (jpr) {
			var df = d.createDocumentFragment(),
			f = function (e) {
				g(e, df);
			};
			if (w._) {
				_.each(jpr, f);
			} else if (w.forEach) {
				forEach(jpr, f, !1);
			} else {
				for (var i = 0, l = jpr.length; i < l; i += 1) {
					g(jpr[i], df);
				}
			}
			a[aC](df);
			/* evento.add(a, "change", k.bind(null, a)); */
			a.onchange = k.bind(null, a);
		}
	},
	v = function () {
		if (w.Promise && w.fetch && !isElectron) {
			fetch(jsn).then(function (r) {
				if (!r.ok) {
					throw new Error(r.statusText);
				}
				return r;
			}).then(function (r) {
				return r.text();
			}).then(function (t) {
				q(t);
			}).catch (function (e) {
				console.log("Error parsing file", e);
			});
		} else {
			var f = function (r) {
				q(r);
			};
			ajaxLoadUnparsedJSON(jsn, f);
		}
	};
	if (a) {
		console.log("triggered function: manageContentsSelect");
		v();
	}
};
evento.add(window, "load", manageContentsSelect.bind(null, ""));
/*!
 * init Contents Kamil autocomplete
 * github.com/oss6/kamil/wiki/Example-with-label:link-json-and-typo-correct-suggestion
 */
var initContentsKamil = function () {
	"use strict";
	var w = window,
	d = document,
	search_form = BALA.one("#search_form") || "",
	text_id = "text",
	text = BALA.one("#" + text_id) || "",
	jsn = "../libs/contents/json/contents.json",
	q = function (r) {
		var jpr = safelyParseJSON(r);
		if (jpr) {
			var ac = new Kamil("#" + text_id, {
					source : jpr,
					minChars : 2
				});
			/*!
			 * show suggestions
			 */
			ac.renderMenu = function (ul, items) {
				items = items || "";
				var _this = this,
				/*!
				 * limit output
				 */
				f = function (e, i) {
					if (i < 10) {
						_this._renderItemData(ul, e, i);
					}
				};
				if (items) {
					if (w._) {
						_.each(items, f);
					} else if (w.forEach) {
						forEach(items, f, !1);
					} else {
						for (var j = 0, l = items.length; j < l; j += 1) {
							f(items[j], j);
						}
					}
				}
				/*!
				 * truncate text
				 */
				var lis = BALA("li", ul) || "",
				g = function (e) {
					var t = e.firstChild.textContent || "",
					n = d.createTextNode(truncString(t, 24));
					e.replaceChild(n, e.firstChild);
					e.title = "" + t;
				};
				if (lis) {
					if (w._) {
						_.each(lis, g);
					} else if (w.forEach) {
						forEach(lis, g, !1);
					} else {
						for (var k = 0, m = lis.length; k < m; k += 1) {
							g(lis[k]);
						}
					}
				}
			};
			/*!
			 * use kamil built-in word label as search key in JSON file
			 * [{"link":"/","label":"some text to match"},
			 * {"link":"/pages/contents.html","label":"some text to match"}]
			 */
			ac.on("kamilselect", function (e) {
				var p = e.item.link || "";
				if (p) {
					/* setImmediate(function () {
						e.inputElement.value = "";
						changeLocation(p);
					}); */
					e.inputElement.value = "";
					changeLocation(p);
				}
			});
		}
	},
	v = function () {
		if (w.Promise && w.fetch && !isElectron) {
			fetch(jsn).then(function (r) {
				if (!r.ok) {
					throw new Error(r.statusText);
				}
				return r;
			}).then(function (r) {
				return r.text();
			}).then(function (t) {
				q(t);
			}).catch (function (e) {
				console.log("Error parsing file", e);
			});
		} else {
			var f = function (r) {
				q(r);
			};
			ajaxLoadUnparsedJSON(jsn, f);
		}
	};
	if (search_form && text) {
		console.log("triggered function: initPagesKamil");
		v();
	}
};
evento.add(window, "load", function () {
	initContentsKamil();
});
/*!
 * init Contents Kamil autocomplete
 * github.com/oss6/kamil/wiki/Example-with-label:link-json-and-typo-correct-suggestion
 */
var initContentsKamil = function () {
	"use strict";
	var w = window,
	d = document,
	search_form = BALA.one("#search_form") || "",
	id = "#text",
	text = BALA.one(id) || "",
	_ul_id = "kamil-typo-autocomplete",
	_ul_class = "kamil-autocomplete",
	jsn = "../libs/contents/json/contents.json",
	cL = "classList",
	q = function (r) {
		var jpr = safelyParseJSON(r);
		if (jpr) {
			var ac = new Kamil(id, {
					source: jpr,
					minChars: 2
				});
			/*!
			 * create typo suggestion list
			 */
			var _ul = crel("ul"),
			_li = crel("li");
			_ul[cL].add(_ul_class);
			_ul.id = _ul_id;
			setStyleDisplayNone(_ul);
			setStyleDisplayNone(_li);
			crel(_ul, _li);
			appendFragmentAfter(_ul, text);
			/*!
			 * show suggestions
			 */
			ac.renderMenu = function (ul, items) {
				items = items || "";
				var l = items.length,
				_this = this,
				/*!
				 * limit output
				 */
				f = function (e, i) {
					if (i < 10) {
						_this._renderItemData(ul, e, i);
					}
				};
				if (items) {
					if (w._) {
						_.each(items, f);
					} else if (w.forEach) {
						forEach(items, f, !1);
					} else {
						for (var i = 0; i < l; i += 1) {
							f(items[i], i);
						}
					}
				}
				/*!
				 * fix typo - non latin characters found
				 */
				var h_li = function (v) {
					text.value = v;
					text.focus();
					setStyleDisplayNone(_ul);
				},
				h_text = function () {
					if (text.value.length < 3 || text.value.match(/^\s*$/)) {
						setStyleDisplayNone(_ul);
						setStyleDisplayNone(_li);
					}
				};
				while (l < 1) {
					var v = text.value;
					if (/[^\u0000-\u007f]/.test(v)) {
						v = fixEnRuTypo(v, "ru", "en");
					} else {
						v = fixEnRuTypo(v, "en", "ru");
					}
					setStyleDisplayBlock(_ul);
					setStyleDisplayBlock(_li);
					removeChildren(_li);
					crel(_li, "" + v);
					evento.add(_li, "click", h_li.bind(null, v));
					/* _li.onclick = h_li.bind(null, v); */
					if (v.match(/^\s*$/)) {
						setStyleDisplayNone(_ul);
						setStyleDisplayNone(_li);
					}
					evento.add(text, "input", h_text);
					/* text.oninput = h_text; */
					l += 1;
				}
				/*!
				 * truncate text
				 */
				var lis = BALA("li", ul) || "",
				g = function (e) {
					var t = e.firstChild.textContent || "",
					n = d.createTextNode(truncString(t, 24));
					e.replaceChild(n, e.firstChild);
					e.title = "" + t;
				};
				if (lis) {
					if (w._) {
						_.each(lis, g);
					} else if (w.forEach) {
						forEach(lis, g, !1);
					} else {
						for (var j = 0, m = lis.length; j < m; j += 1) {
							g(lis[j]);
						}
					}
				}
			};
			/*!
			 * use kamil built-in word label as search key in JSON file
			 * [{"link":"/","label":"some text to match"},
			 * {"link":"/pages/contents.html","label":"some text to match"}]
			 */
			ac.on("kamilselect", function (e) {
				var p = e.item.link || "",
				si = function () {
					e.inputElement.value = "";
					changeLocation(p);
				};
				if (p) {
					/*!
					 * nwjs wont like setImmediate here
					 */
					/* setImmediate(si); */
					si();
				}
			});
		}
	},
	v = function () {
		if (w.Promise && w.fetch && !isElectron) {
			fetch(jsn).then(function (r) {
				if (!r.ok) {
					throw new Error(r.statusText);
				}
				return r;
			}).then(function (r) {
				return r.text();
			}).catch (function (e) {
				console.log("Error fetch-ing file", e);
			}).then(function (t) {
				q(t);
			}).catch (function (e) {
				console.log("Error parsing file", e);
			});
		} else {
			var f = function (r) {
				q(r);
			};
			ajaxLoadUnparsedJSON(jsn, f);
		}
	};
	if (search_form && text) {
		console.log("triggered function: initContentsKamil");
		v();
	}
};
var loadInitContentsKamil = function () {
	"use strict";
	var w = window,
	js = "../cdn/kamil/0.1.1/js/kamil.fixed.min.js";
	if (w.XMLHttpRequest || w.ActiveXObject) {
		if (w.Promise) {
			promiseLoadJS(js).then(initContentsKamil);
		} else {
			ajaxLoadTriggerJS(js, initContentsKamil);
		}
	} else {
		if (!scriptIsLoaded(js)) {
			loadJS(js, initContentsKamil);
		}
	}
};
docReady(loadInitContentsKamil);
/*!
 * init Pages Kamil autocomplete
 * github.com/oss6/kamil/wiki/Example-with-label:link-json-and-typo-correct-suggestion
 */
var initPagesKamil = function () {
	"use strict";
	var w = window,
	d = document,
	search_form = BALA.one("#search_form") || "",
	text_id = "text",
	text = BALA.one("#" + text_id) || "",
	jsn = "../../libs/englishextra-ui/json/pages.json",
	q = function (r) {
		var jpr = safelyParseJSON(r);
		if (jpr) {
			var ac = new Kamil("#" + text_id, {
					source: jpr,
					minChars: 2
				});
			/*!
			 * show suggestions
			 */
			ac.renderMenu = function (ul, items) {
				items = items || "";
				var _this = this,
				/*!
				 * limit output
				 */
				f = function (e, i) {
					if (i < 10) {
						_this._renderItemData(ul, e, i);
					}
				};
				if (items) {
					if (w._) {
						_.each(items, f);
					} else if (w.forEach) {
						forEach(items, f, !1);
					} else {
						for (var j = 0, l = items.length; j < l; j += 1) {
							f(items[j], j);
						}
					}
				}
				/*!
				 * truncate text
				 */
				var lis = BALA("li", ul) || "",
				g = function (e) {
					var t = e.firstChild.textContent || "",
					n = d.createTextNode(truncString(t, 24));
					e.replaceChild(n, e.firstChild);
					e.title = "" + t;
				};
				if (lis) {
					if (w._) {
						_.each(lis, g);
					} else if (w.forEach) {
						forEach(lis, g, !1);
					} else {
						for (var k = 0, m = lis.length; k < m; k += 1) {
							g(lis[k]);
						}
					}
				}
			};
			/*!
			 * use kamil built-in word label as search key in JSON file
			 * [{"link":"/","label":"some text to match"},
			 * {"link":"/pages/contents.html","label":"some text to match"}]
			 */
			ac.on("kamilselect", function (e) {
				var p = e.item.link || "";
				if (p) {
					/* setImmediate(function () {
						e.inputElement.value = "";
						changeLocation(p);
					}); */
					e.inputElement.value = "";
					changeLocation(p);
				}
			});
		}
	},
	v = function () {
		if (w.Promise && w.fetch && !isElectron) {
			fetch(jsn).then(function (r) {
				if (!r.ok) {
					throw new Error(r.statusText);
				}
				return r;
			}).then(function (r) {
				return r.text();
			}).then(function (t) {
				q(t);
			}).catch (function (e) {
				console.log("Error parsing file", e);
			});
		} else {
			var f = function (r) {
				q(r);
			};
			ajaxLoadUnparsedJSON(jsn, f);
		}
	};
	if (search_form && text) {
		console.log("triggered function: initPagesKamil");
		v();
	}
};
evento.add(window, "load", function () {
	initPagesKamil();
});
/*!
 * init Pages Kamil autocomplete
 * github.com/oss6/kamil/wiki/Example-with-label:link-json-and-typo-correct-suggestion
 */
var initPagesKamil = function () {
	"use strict";
	var w = window,
	d = document,
	search_form = BALA.one("#search_form") || "",
	id = "#text",
	text = BALA.one(id) || "",
	_ul_id = "kamil-typo-autocomplete",
	_ul_class = "kamil-autocomplete",
	jsn = "../../libs/englishextra-ui/json/pages.json",
	cL = "classList",
	q = function (r) {
		var jpr = safelyParseJSON(r);
		if (jpr) {
			var ac = new Kamil(id, {
					source: jpr,
					minChars: 2
				});
			/*!
			 * create typo suggestion list
			 */
			var _ul = crel("ul"),
			_li = crel("li");
			_ul[cL].add(_ul_class);
			_ul.id = _ul_id;
			setStyleDisplayNone(_ul);
			setStyleDisplayNone(_li);
			crel(_ul, _li);
			appendFragmentAfter(_ul, text);
			/*!
			 * show suggestions
			 */
			ac.renderMenu = function (ul, items) {
				items = items || "";
				var l = items.length,
				_this = this,
				/*!
				 * limit output
				 */
				f = function (e, i) {
					if (i < 10) {
						_this._renderItemData(ul, e, i);
					}
				};
				if (items) {
					if (w._) {
						_.each(items, f);
					} else if (w.forEach) {
						forEach(items, f, !1);
					} else {
						for (var i = 0; i < l; i += 1) {
							f(items[i], i);
						}
					}
				}
				/*!
				 * fix typo - non latin characters found
				 */
				var h_li = function (v) {
					text.value = v;
					text.focus();
					setStyleDisplayNone(_ul);
				},
				h_text = function () {
					if (text.value.length < 3 || text.value.match(/^\s*$/)) {
						setStyleDisplayNone(_ul);
						setStyleDisplayNone(_li);
					}
				};
				while (l < 1) {
					var v = text.value;
					if (/[^\u0000-\u007f]/.test(v)) {
						v = fixEnRuTypo(v, "ru", "en");
					} else {
						v = fixEnRuTypo(v, "en", "ru");
					}
					setStyleDisplayBlock(_ul);
					setStyleDisplayBlock(_li);
					removeChildren(_li);
					crel(_li, "" + v);
					evento.add(_li, "click", h_li.bind(null, v));
					/* _li.onclick = h_li.bind(null, v); */
					if (v.match(/^\s*$/)) {
						setStyleDisplayNone(_ul);
						setStyleDisplayNone(_li);
					}
					evento.add(text, "input", h_text);
					/* text.oninput = h_text; */
					l += 1;
				}
				/*!
				 * truncate text
				 */
				var lis = BALA("li", ul) || "",
				g = function (e) {
					var t = e.firstChild.textContent || "",
					n = d.createTextNode(truncString(t, 24));
					e.replaceChild(n, e.firstChild);
					e.title = "" + t;
				};
				if (lis) {
					if (w._) {
						_.each(lis, g);
					} else if (w.forEach) {
						forEach(lis, g, !1);
					} else {
						for (var j = 0, m = lis.length; j < m; j += 1) {
							g(lis[j]);
						}
					}
				}
			};
			/*!
			 * use kamil built-in word label as search key in JSON file
			 * [{"link":"/","label":"some text to match"},
			 * {"link":"/pages/contents.html","label":"some text to match"}]
			 */
			ac.on("kamilselect", function (e) {
				var p = e.item.link || "",
				si = function () {
					e.inputElement.value = "";
					changeLocation(p);
				};
				if (p) {
					/*!
					 * nwjs wont like setImmediate here
					 */
					/* setImmediate(si); */
					si();
				}
			});
		}
	},
	v = function () {
		if (w.Promise && w.fetch && !isElectron) {
			fetch(jsn).then(function (r) {
				if (!r.ok) {
					throw new Error(r.statusText);
				}
				return r;
			}).then(function (r) {
				return r.text();
			}).catch (function (e) {
				console.log("Error fetch-ing file", e);
			}).then(function (t) {
				q(t);
			}).catch (function (e) {
				console.log("Error parsing file", e);
			});
		} else {
			var f = function (r) {
				q(r);
			};
			ajaxLoadUnparsedJSON(jsn, f);
		}
	};
	if (search_form && text) {
		console.log("triggered function: initPagesKamil");
		v();
	}
};
var loadInitPagesKamil = function () {
	"use strict";
	var w = window,
	js = "../../cdn/kamil/0.1.1/js/kamil.fixed.min.js";
	if (w.XMLHttpRequest || w.ActiveXObject) {
		if (w.Promise) {
			promiseLoadJS(js).then(initPagesKamil);
		} else {
			ajaxLoadTriggerJS(js, initPagesKamil);
		}
	} else {
		if (!scriptIsLoaded(js)) {
			loadJS(js, initPagesKamil);
		}
	}
};
docReady(loadInitPagesKamil);
/*!
 * init vk-like on click
 */
var initVKLike = function () {
	"use strict";
	var w = window,
	c = BALA.one("#vk-like") || "",
	a = BALA.one("#btn-show-vk-like") || "",
	js = getHTTP(!0) + "://vk.com/js/api/openapi.js?122",
	ds = "dataset",
	g = function () {
		try {
			if (w.VK) {
				VK.init({
					apiId: (c[ds].apiid || ""),
					nameTransportPath: "/xd_receiver.htm",
					onlyWidgets: !0
				});
				VK.Widgets.Like("vk-like", {
					type: "button",
					height: 24
				});
			}
			setStyleVisibilityVisible(c);
			setStyleOpacity(c, 1);
			setStyleDisplayNone(a);
		} catch(e) {
			setStyleVisibilityHidden(c);
			setStyleOpacity(c, 0);
			setStyleDisplayBlock(a);
		}
	},
	k = function () {
		if (!scriptIsLoaded(js)) {
			loadJS(js, g);
		}
	},
	q = function () {
		var h_a = function (e) {
			evento.remove(a, "click", h_a);
			/* a.onclick = null; */
			e.preventDefault();
			e.stopPropagation();
			k();
		};
		evento.add(a, "click", h_a);
		/* a.onclick = h_a; */
	};
	if (c && a) {
		console.log("triggered function: initVKLike");
		if ("undefined" !== typeof getHTTP && getHTTP()) {
			q();
		} else {
			setStyleDisplayNone(a);
		}
	}
};
docReady(initVKLike);
/*!
 * externalcounters.js
 * track visitors
 * gist.github.com/englishextra/12dec2c7a796ab9ec5e9ed84b134c055
 */
if (!/localhost/.test(self.location.host)) {
	(function (b, a, c, d) {
		if (c && d) {
			var e = encodeURIComponent(a.referrer || "");
			b = encodeURIComponent(b.location.href || "");
			a = encodeURIComponent(("undefined" !== typeof initialDocumentTitle ? initialDocumentTitle : (a.title || "")).replace("\x27", "&#39;").replace("\x28", "&#40;").replace("\x29", "&#41;"));
			c.setAttribute("style", "position:absolute;left:-9999px;width:1px;height:1px;border:0;background:transparent url(" + d + "?dmn=" + b + "&rfrr=" + e + "&ttl=" + a + "&encoding=utf-8) top left no-repeat;");
		}
	})(window, document, document.getElementById("externalcounters") || "", /localhost/.test(self.location.host) ? "http://localhost/externalcounters/" : "//shimansky.biz/externalcounters/");
}
;(function (d) {
	var g = /localhost/.test(self.location.host) ? "http://localhost/externalcounters/" : "//shimansky.biz/externalcounters/",
	c = d.getElementsByTagName("a") || "",
	a = self.location.protocol + "//" + self.location.host + "/" || "",
	h = self.location.host + "/" || "",
	k = encodeURIComponent(d.location.href || ""),
	l = encodeURIComponent((d.title || "").replace("\x27", "&#39;").replace("\x28", "&#40;").replace("\x29", "&#41;"));
	if (c && a && h) {
		var s = function () {
			var a = this.getAttribute("href"),
			c = document.body.firstChild,
			f = d.createElement("div");
			f.setAttribute("style", "position:absolute;left:-9999px;width:1px;height:1px;border:0;background:transparent url(" + g + "?dmn=" + encodeURIComponent(a) + "&rfrr=" + k + "&ttl=" + l + "&encoding=utf-8) top left no-repeat;");
			c.parentNode.insertBefore(f, c);
		};
		for (a = 0; a < c.length; a += 1) {
			if (b = c[a], (e = b.getAttribute("href") || "") && (e.match(/^\/scripts\//) || /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)|(localhost)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/.test(e)) && !b.getAttribute("rel")) {
				c[a].onclick = s;
			}
		}
	}
})(document);
(function (k) {
	k.addEventListener("blur", function () {
		(function (d, w) {
			var a = /localhost/.test(self.location.host) ? "http://localhost/externalcounters/" : "//shimansky.biz/externalcounters/",
			b = encodeURIComponent(d.referrer || ""),
			c = encodeURIComponent(w.location.href || ""),
			e = encodeURIComponent((d.title || "").replace("\x27", "&#39;").replace("\x28", "&#40;").replace("\x29", "&#41;") + " - \u0414\u043e\u043a\u0443\u043c\u0435\u043d\u0442 \u043d\u0435 \u0430\u043a\u0442\u0438\u0432\u0435\u043d"),
			f = d.createElement("div"),
			g = document.body.firstChild;
			f.setAttribute("style", "position:absolute;left:-9999px;width:1px;height:1px;border:0;background:transparent url(" + a + "?dmn=" + c + "\x26rfrr=" + b + "\x26ttl=" + e + "\x26encoding=utf-8) top left no-repeat;");
			g.parentNode.insertBefore(f, g);
		}
			(document, window));
	}, !1);
}
	(window));
/*!
 * insert External HTML
 * @param {String} a Target Element id/class
 * @param {String} u path string
 * @param {Object} [f] callback function
 * insertExternalHTML(a, u, f)
 */
var insertExternalHTML = function (a, u, f) {
	"use strict";
	var w = window,
	c = BALA.one(a) || "",
	g = function (t, s) {
		var q = function () {
			if (s && "function" === typeof s) {
				s();
			}
		};
		insertTextAsFragment(t, c, q);
	},
	k = function () {
		if (w.Promise && w.fetch && !isElectron) {
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
				console.log("Error inserting content", e);
			});
		} else if (w.reqwest) {
			reqwest({
				url : u,
				type : "html",
				method : "get",
				error : function (e) {
					console.log("Error reqwest-ing file", e);
				},
				success : function (r) {
					g(r, f);
				}
			});
		} else {
			ajaxLoadHTML(u, function (r) {
				g(r, f);
			});
		}
	};
	if (c) {
		console.log("triggered function: insertExternalHTML");
		k();
	}
};
/*!
 * init routie
 * @param {String} ctx HTML id string
 */
var initRoutie = function (ctx) {
	"use strict";
	var loadVirtualPage = function (c, h, f) {
		if (c && h) {
			LoadingSpinner.show();
			insertExternalHTML(c, h, f);
		}
	},
	reinitVirtualPage = function (t) {
		t = t || "";
		var d = document;
		/*!
		 * hide loading spinner before scrolling
		 */
		LoadingSpinner.hide(scrollToTop);
		d.title = initialDocumentTitle + "" + t + userBrowsingDetails;
	},
	loadNotFoundPage = function (a) {
		var c = BALA.one(a) || "",
		s = crel("div", {
				"class": "content-wrapper"
			}, crel("div", {
					"class": "grid grid-pad"
				}, crel("div", {
						"class": "col col-1-1"
					}, crel("div", {
							"class": "content"
						}, crel("p", "Нет такой страницы. ", crel("a", {
									"href": "#/contents"
								}, "Исправить?"))))));
		if (c) {
			LoadingSpinner.show();
			removeChildren(c);
			appendFragment(s, c);
			reinitVirtualPage(" - Нет такой страницы");
		}
	},
	redirectToDefaultPage = function (h, t) {
		t = t || "";
		if (h) {
			reinitVirtualPage("" + t);
			changeHash(h);
			console.log("function routie.redirectToDefaultPage => changed window hash: #" + h);
			/* if (history.pushState) {
				history.replaceState(null, null, "#" + h);
			} */
		}
	},
	appContent = BALA.one(ctx) || "";
	/*!
	 * init routie
	 * "#" => ""
	 * "#/" => "/"
	 * "#/home" => "/home"
	 */
	if (appContent) {
		console.log("triggered function: routie");
		routie({
			"": function () {
				redirectToDefaultPage("/contents");
			},
			"/contents": function () {
				loadVirtualPage(ctx, "./includes/contents.html", function () {
					reinitVirtualPage(" - Содержание");
					manageYandexMapButton("#ymap");
					/* try {
						if (!("undefined" !== typeof earlyDeviceSize && "small" === earlyDeviceSize)) {
							initYandexMap("#ymap");
						}
					} catch (e) {
						console.log(e);
					} */
				});
			},
			"/feedback": function () {
				loadVirtualPage(ctx, "./includes/feedback.html", function () {
					reinitVirtualPage(" - Напишите мне");
					manageDisqusButton();
					/* if (!("undefined" !== typeof earlyDeviceSize && "small" === earlyDeviceSize)) {
						loadRefreshDisqus();
					} */
				});
			},
			"/schedule": function () {
				if ("undefined" !== typeof getHTTP && getHTTP()) {
					if ("undefined" !== typeof isOldOpera && !isOldOpera) {
						loadVirtualPage(ctx, "./includes/schedule.html", function () {
							reinitVirtualPage(" - Расписание");
						});
					}
				}
			},
			"/map": function () {
				if ("undefined" !== typeof getHTTP && getHTTP()) {
					if ("undefined" !== typeof isOldOpera && !isOldOpera) {
						loadVirtualPage(ctx, "./includes/map.html", function () {
							reinitVirtualPage(" - Смотреть на карте");
						});
					}
				}
			},
			"/level_test": function () {
				loadVirtualPage(ctx, "./includes/level_test.html", function () {
					reinitVirtualPage(" - Уровневый тест");
				});
			},
			"/common_mistakes": function () {
				loadVirtualPage(ctx, "./includes/common_mistakes.html", function () {
					reinitVirtualPage(" - Распространенные ошибки");
				});
			},
			"/demo_ege": function () {
				loadVirtualPage(ctx, "./includes/demo_ege.html", function () {
					reinitVirtualPage(" - Демо-вариант ЕГЭ-11 АЯ (ПЧ)");
				});
			},
			"/demo_ege_speaking": function () {
				loadVirtualPage(ctx, "./includes/demo_ege_speaking.html", function () {
					reinitVirtualPage(" - Демо-вариант ЕГЭ-11 АЯ (УЧ)");
				});
			},
			"/previous_ege_analysis": function () {
				loadVirtualPage(ctx, "./includes/previous_ege_analysis.html", function () {
					reinitVirtualPage(" - ЕГЭ 2015: разбор ошибок");
				});
			},
			"/*": function () {
				loadNotFoundPage(ctx);
			}
		});
	}
};
docReady(initRoutie.bind(null, "#app-content"));
/*!
 * observe mutations
 * bind functions only for inserted DOM
 * @param {String} ctx HTML Element class or id string
 */
var observeMutations = function (ctx) {
	"use strict";
	ctx = ctx || "";
	var w = window,
	c = BALA.one(ctx) || "";
	if (c) {
		var g = function (e) {
			var f = function (m) {
				console.log("mutations observer: " + m.type);
				console.log(m.type, "added: " + m.addedNodes.length + " nodes");
				console.log(m.type, "removed: " + m.removedNodes.length + " nodes");
				if ("childList" === m.type || "subtree" === m.type) {
					mo.disconnect();
					manageYandexMapButton("#ymap");
					manageDisqusButton();
					manageExternalLinks(c);
					manageLocalLinks(c);
					manageDataTargetLinks(c);
					manageDataSrcImg(c);
					manageDataLightboxImgLinks(c);
				}
			};
			/* e.forEach(f); */
			if (w._) {
				_.each(e, f);
			} else if (w.forEach) {
				forEach(e, f, !1);
			} else {
				for (var i = 0, l = e.length; i < l; i += 1) {
					f(e[i]);
				}
			}
		},
		mo = new MutationObserver(g);
		mo.observe(c, {
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
	h = w.location.hash || "",
	pN = "parentNode",
	c = BALA.one("#app-content")[pN] || "";
	if (c && h) {
		console.log("triggered function: updateInsertedDom");
		observeMutations(c);
	}
};
evento.add(window, "load", updateInsertedDom);
evento.add(window, "hashchange", updateInsertedDom);
/*!
 * init manUP.js
 */
var initManUp = function () {
	console.log("triggered function: initManUp");
};
var loadInitManUp = function () {
	if ("undefined" !== typeof getHTTP && getHTTP()) {
		ajaxLoadTriggerJS("/cdn/ManUp.js/0.7/js/manup.fixed.min.js", initManUp);
	}
};
docReady(loadInitManUp);
/*!
 * show page, finish ToProgress
 */
var showPageFinishProgress = function () {
	"use strict";
	var b = BALA.one("body") || "",
	c = BALA.one("#container") || "",
	a = BALA.one(".holder-site-logo") || "",
	g = function () {
		setStyleOpacity(c, 1);
		progressBar.complete();
	},
	k = function () {
		var si = requestInterval(function () {
				console.log("function showPageFinishProgress => started Interval");
				if (imagesPreloaded) {
					clearRequestInterval(si);
					console.log("function showPageFinishProgress => si=" + si + "; imagesPreloaded=" + imagesPreloaded);
					g();
				}
			}, 100);
	},
	q = function () {
		setStyleDisplayNone(a);
		/* setStyleZindex(a, "-1"); */
		if (b) {
			b.style.overflowY = "auto";
		}
	},
	v = function () {
		a.classList.add("animated", "fadeOut");
		setAutoClearedTimeout(q, 500);
	};
	console.log("triggered function: showPageFinishProgress");
	if (c) {
		if ("undefined" !== typeof imagesPreloaded) {
			k();
		} else {
			g();
		}
	}
	if (a) {
		setAutoClearedTimeout(v, 1500);
	}
};
evento.add(window, "load", showPageFinishProgress);
/*!
 * manage infinit scroll
 * @param {String} ctx HTML id string
 */
var manageInfiniteScroll = function (ctx) {
	"use strict";
	ctx = ctx || "";
	var w = window,
	cls = ".holder-btn-next-article [data-hash]",
	a = ctx ? BALA.one(cls, ctx) || "" : BALA.one(cls) || "",
	ds = "dataset",
	h = a ? (a[ds].hash || "") : "",
	g = function () {
		if (isInViewport(a)) {
			var st = requestTimeout(function () {
					clearRequestTimeout(st);
					/* evento.remove(w, "scroll", g); */
					w.onscroll = null;
					changeHash(h);
				}, 2000);
		}
	},
	k = function () {
		/* evento.add(w, "scroll", g); */
		w.onscroll = g;
	};
	if (a && h) {
		k();
	}
};
evento.add(window, "load", manageInfiniteScroll);
