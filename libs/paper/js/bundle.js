/*!
 * define global root
 */
/* var globalRoot = "object" === typeof window && window || "object" === typeof self && self || "object" === typeof global && global || {}; */
var globalRoot = "undefined" !== typeof window ? window : this;
/*!
 * modified ToProgress v0.1.1
 * @see {@link https://github.com/djyde/ToProgress}
 * @see {@link https://gist.github.com/englishextra/6a8c79c9efbf1f2f50523d46a918b785}
 * @see {@link https://jsfiddle.net/englishextra/z5xhjde8/}
 * arguments.callee changed to TP, a local wrapper function,
 * so that public function name is now customizable;
 * wrapped in curly brackets:
 * else{document.body.appendChild(this.progressBar);};
 * removed module check
 * passes jshint
 */
(function(root){"use strict";var ToProgress=(function(){var TP=function(){var t=function(){var s=document.createElement("fakeelement"),i={transition:"transitionend",OTransition:"oTransitionEnd",MozTransition:"transitionend",WebkitTransition:"webkitTransitionEnd"};for(var j in i){if(i.hasOwnProperty(j)){if(void 0!==s.style[j]){return i[j];}}}},s=function(t,a){if(this.progress=0,this.options={id:"top-progress-bar",color:"#F44336",height:"2px",duration:0.2},t&&"object"==typeof t){for(var i in t){if(t.hasOwnProperty(i)){this.options[i]=t[i];}}}if(this.options.opacityDuration=3*this.options.duration,this.progressBar=document.createElement("div"),this.progressBar.id=this.options.id,this.progressBar.setCSS=function(t){for(var a in t){if(t.hasOwnProperty(a)){this.style[a]=t[a];}}},this.progressBar.setCSS({position:a?"relative":"fixed",top:"0",left:"0",right:"0","background-color":this.options.color,height:this.options.height,width:"0%",transition:"width "+this.options.duration+"s, opacity "+this.options.opacityDuration+"s","-moz-transition":"width "+this.options.duration+"s, opacity "+this.options.opacityDuration+"s","-webkit-transition":"width "+this.options.duration+"s, opacity "+this.options.opacityDuration+"s"}),a){var o=document.querySelector(a);if(o){if(o.hasChildNodes()){o.insertBefore(this.progressBar,o.firstChild);}else{o.appendChild(this.progressBar);}}}else{document.body.appendChild(this.progressBar);}},i=t();return s.prototype.transit=function(){this.progressBar.style.width=this.progress+"%";},s.prototype.getProgress=function(){return this.progress;},s.prototype.setProgress=function(t,s){this.show();this.progress=t>100?100:0>t?0:t;this.transit();if(s){s();}},s.prototype.increase=function(t,s){this.show();this.setProgress(this.progress+t,s);},s.prototype.decrease=function(t,s){this.show();this.setProgress(this.progress-t,s);},s.prototype.finish=function(t){var s=this;this.setProgress(100,t);this.hide();if(i){this.progressBar.addEventListener(i,function(t){s.reset();s.progressBar.removeEventListener(t.type,TP);});}},s.prototype.reset=function(t){this.progress=0;this.transit();if(t){t();}},s.prototype.hide=function(){this.progressBar.style.opacity="0";},s.prototype.show=function(){this.progressBar.style.opacity="1";},s;};return TP();}());root.ToProgress=ToProgress;})("undefined" !== typeof window ? window : this);
/*!
 * modified Zenscroll - v3.2.2
 * @see {@link https://github.com/zengabor/zenscroll}
 * Copyright 2015-2016 Gabor Lenard
 * removed module check
 * fixed IIFE enforcing
 * added brackets in if / for
 * @see {@link https://github.com/zengabor/zenscroll/blob/dist/zenscroll.js}
 * passes jshint
 */
(function(root){"use strict";var zenscroll=(function(){if(typeof window==="undefined"||!("document"in window)){return{};}var createScroller=function(scrollContainer,defaultDuration,edgeOffset){defaultDuration=defaultDuration||999;if(!edgeOffset&&edgeOffset!==0){edgeOffset=9;}var scrollTimeoutId;var setScrollTimeoutId=function(newValue){scrollTimeoutId=newValue;};var docElem=document.documentElement;var nativeSmoothScrollEnabled=function(){return("getComputedStyle"in window)&&window.getComputedStyle(scrollContainer?scrollContainer:document.body)["scroll-behavior"]==="smooth";};var getScrollTop=function(){if(scrollContainer){return scrollContainer.scrollTop;}else{return window.scrollY||docElem.scrollTop;}};var getViewHeight=function(){if(scrollContainer){return Math.min(scrollContainer.offsetHeight,window.innerHeight);}else{return window.innerHeight||docElem.clientHeight;}};var getRelativeTopOf=function(elem){if(scrollContainer){return elem.offsetTop;}else{return elem.getBoundingClientRect().top+getScrollTop()-docElem.offsetTop;}};var stopScroll=function(){clearTimeout(scrollTimeoutId);setScrollTimeoutId(0);};var scrollToY=function(endY,duration,onDone){stopScroll();if(nativeSmoothScrollEnabled()){(scrollContainer||window).scrollTo(0,endY);if(onDone){onDone();}}else{var startY=getScrollTop();var distance=Math.max(endY,0)-startY;duration=duration||Math.min(Math.abs(distance),defaultDuration);var startTime=new Date().getTime();(function loopScroll(){setScrollTimeoutId(setTimeout(function(){var p=Math.min((new Date().getTime()-startTime)/duration,1);var y=Math.max(Math.floor(startY+distance*(p<0.5?2*p*p:p*(4-p*2)-1)),0);if(scrollContainer){scrollContainer.scrollTop=y;}else{window.scrollTo(0,y);}if(p<1&&(getViewHeight()+y)<(scrollContainer||docElem).scrollHeight){loopScroll();}else{setTimeout(stopScroll,99);if(onDone){onDone();}}},9));})();}};var scrollToElem=function(elem,duration,onDone){scrollToY(getRelativeTopOf(elem)-edgeOffset,duration,onDone);};var scrollIntoView=function(elem,duration,onDone){var elemHeight=elem.getBoundingClientRect().height;var elemTop=getRelativeTopOf(elem);var elemBottom=elemTop+elemHeight;var containerHeight=getViewHeight();var containerTop=getScrollTop();var containerBottom=containerTop+containerHeight;if((elemTop-edgeOffset)<containerTop||(elemHeight+edgeOffset)>containerHeight){scrollToElem(elem,duration,onDone);}else if((elemBottom+edgeOffset)>containerBottom){scrollToY(elemBottom-containerHeight+edgeOffset,duration,onDone);}else if(onDone){onDone();}};var scrollToCenterOf=function(elem,duration,offset,onDone){scrollToY(Math.max(getRelativeTopOf(elem)-getViewHeight()/2+(offset||elem.getBoundingClientRect().height/2),0),duration,onDone);};var setup=function(newDefaultDuration,newEdgeOffset){if(newDefaultDuration){defaultDuration=newDefaultDuration;}if(newEdgeOffset===0||newEdgeOffset){edgeOffset=newEdgeOffset;}};return{setup:setup,to:scrollToElem,toY:scrollToY,intoView:scrollIntoView,center:scrollToCenterOf,stop:stopScroll,moving:function(){return!!scrollTimeoutId;}};};var defaultScroller=createScroller();if("addEventListener"in window&&document.body.style.scrollBehavior!=="smooth"&&!window.noZensmooth){var replaceUrl=function(hash){try{history.replaceState({},"",window.location.href.split("#")[0]+hash);}catch(e){}};window.addEventListener("click",function(event){var anchor=event.target;while(anchor&&anchor.tagName!=="A"){anchor=anchor.parentNode;}if(!anchor||event.which!==1||event.shiftKey||event.metaKey||event.ctrlKey||event.altKey){return;}var href=anchor.getAttribute("href")||"";if(href.indexOf("#")===0){if(href==="#"){event.preventDefault();defaultScroller.toY(0);replaceUrl("");}else{var targetId=anchor.hash.substring(1);var targetElem=document.getElementById(targetId);if(targetElem){event.preventDefault();defaultScroller.to(targetElem);replaceUrl("#"+targetId);}}}},false);}return{createScroller:createScroller,setup:defaultScroller.setup,to:defaultScroller.to,toY:defaultScroller.toY,intoView:defaultScroller.intoView,center:defaultScroller.stop,moving:defaultScroller.moving};}());root.zenscroll=zenscroll;}("undefined" !== typeof window ? window : this));
/*!
 * A function for elements selection - v0.1.9
 * @see {@link https://github.com/finom/bala}
 * @param {String} a id, class or tag string
 * @param {String|Object} [b] context tag string or HTML Element object
 * a=BALA("sometag/#someid/.someclass"[,someParent]);
 * a=BALA.one("sometag/#someid/.someclass"[,someParent]);
 * global $ becomes var g
 * renamed function $ to g
 * @see {@link https://github.com/finom/bala/blob/master/bala.js}
 * passes jshint
 */
(function(root){"use strict";var BALA=(function(){var g=(function(document,s_addEventListener,s_querySelectorAll){function g(s,context,bala){bala=Object.create(g.fn);if(s){bala.push.apply(bala,s[s_addEventListener]?[s]:""+s===s?/</.test(s)?((context=document.createElement(context||s_addEventListener)).innerHTML=s,context.children):context?((context=g(context)[0])?context[s_querySelectorAll](s):bala):document[s_querySelectorAll](s):typeof s=='function'?document.readyState[7]?s():document[s_addEventListener]('DOMContentLoaded',s):s);}return bala;}g.fn=[];g.one=function(s,context){return g(s,context)[0]||null;};return g;})(document,'addEventListener','querySelectorAll');return g;}());root.BALA=BALA;})("undefined" !== typeof window ? window : this);
/*!
 * modified crel - a small, simple, and fast DOM creation utility
 * @see {@link https://github.com/KoryNunn/crel}
 * crel(tagName/dom element[,attributes,child1,child2,childN...])
 * var element=crel('div',crel('h1','Crello World!'),
 * crel('p','This is crel'),crel('input',{type:'number'}));
 * removed module check
 * fixed Use '===' to compare with 'null'.
 * fixed The body of a for in should be wrapped in an if statement to filter unwanted properties from the prototype.
 * fixed Expected an assignment or function call and instead saw an expression.
 * @see {@link https://github.com/KoryNunn/crel/blob/master/crel.js}
 * passes jshint
 */
(function(root){"use strict";var crel=(function(){var fn="function",obj="object",nodeType="nodeType",textContent="textContent",setAttribute="setAttribute",attrMapString="attrMap",isNodeString="isNode",isElementString="isElement",d=typeof document===obj?document:{},isType=function(a,type){return typeof a===type;},isNode=typeof Node===fn?function(object){return object instanceof Node;}:function(object){return object&&isType(object,obj)&&(nodeType in object)&&isType(object.ownerDocument,obj);},isElement=function(object){return _c[isNodeString](object)&&object[nodeType]===1;},isArray=function(a){return a instanceof Array;},appendChild=function(element,child){if(!_c[isNodeString](child)){child=d.createTextNode(child);}element.appendChild(child);};function _c(){var args=arguments,element=args[0],child,settings=args[1],childIndex=2,argumentsLength=args.length,attributeMap=_c[attrMapString];element=_c[isElementString](element)?element:d.createElement(element);if(argumentsLength===1){return element;}if(!isType(settings,obj)||_c[isNodeString](settings)||isArray(settings)){--childIndex;settings=null;}if((argumentsLength-childIndex)===1&&isType(args[childIndex],"string")&&element[textContent]!==undefined){element[textContent]=args[childIndex];}else{for(;childIndex<argumentsLength;++childIndex){child=args[childIndex];if(child===null){continue;}if(isArray(child)){for(var i=0;i<child.length;++i){appendChild(element,child[i]);}}else{appendChild(element,child);}}}for(var key in settings){if(settings.hasOwnProperty(key)){if(!attributeMap[key]){element[setAttribute](key,settings[key]);}else{var attr=attributeMap[key];if(typeof attr===fn){attr(element,settings[key]);}else{element[setAttribute](attr,settings[key]);}}}}return element;}_c[attrMapString]={};_c[isElementString]=isElement;_c[isNodeString]=isNode;if("undefined"!==typeof Proxy){_c.proxy=new Proxy(_c,{get:function(target,key){if(!(key in _c)){_c[key]=_c.bind(null,key);}return _c[key];}});}return _c;})();root.crel=crel;})("undefined" !== typeof window ? window : this);
/*!
 * Super lightweight script (~1kb) to detect via Javascript events like
 * 'tap' 'dbltap' 'swipeup' 'swipedown' 'swipeleft' 'swiperight'
 * on any kind of device.
 * Version: 2.0.1
 * Author: Gianluca Guarini
 * Contact: gianluca.guarini@gmail.com
 * Website: http://www.gianlucaguarini.com/
 * Twitter: @gianlucaguarini
 * Copyright (c) Gianluca Guarini
 * @see {@link https://github.com/GianlucaGuarini/Tocca.js/blob/master/Tocca.js}
 * passes jshint
 */
(function(doc,win){'use strict';if(typeof doc.createEvent!=='function')return false;var pointerEventSupport=function(type){var lo=type.toLowerCase(),ms='MS'+type;return navigator.msPointerEnabled?ms:window.PointerEvent?lo:false;},defaults={useJquery:!win.IGNORE_JQUERY&&typeof jQuery!=='undefined',swipeThreshold:win.SWIPE_THRESHOLD||100,tapThreshold:win.TAP_THRESHOLD||150,dbltapThreshold:win.DBL_TAP_THRESHOLD||200,longtapThreshold:win.LONG_TAP_THRESHOLD||1000,tapPrecision:win.TAP_PRECISION/2||60/2,justTouchEvents:win.JUST_ON_TOUCH_DEVICES},wasTouch=false,touchevents={touchstart:pointerEventSupport('PointerDown')||'touchstart',touchend:pointerEventSupport('PointerUp')||'touchend',touchmove:pointerEventSupport('PointerMove')||'touchmove'},isTheSameFingerId=function(e){return!e.pointerId||typeof pointerId==='undefined'||e.pointerId===pointerId;},setListener=function(elm,events,callback){var eventsArray=events.split(' '),i=eventsArray.length;while(i--){elm.addEventListener(eventsArray[i],callback,false);}},getPointerEvent=function(event){return event.targetTouches?event.targetTouches[0]:event;},getTimestamp=function(){return new Date().getTime();},sendEvent=function(elm,eventName,originalEvent,data){var customEvent=doc.createEvent('Event');customEvent.originalEvent=originalEvent;data=data||{};data.x=currX;data.y=currY;data.distance=data.distance;if(defaults.useJquery){customEvent=jQuery.Event(eventName,{originalEvent:originalEvent});jQuery(elm).trigger(customEvent,data);}if(customEvent.initEvent){for(var key in data){if(data.hasOwnProperty(key)){customEvent[key]=data[key];}}customEvent.initEvent(eventName,true,true);elm.dispatchEvent(customEvent);}while(elm){if(elm['on'+eventName])elm['on'+eventName](customEvent);elm=elm.parentNode;}},onTouchStart=function(e){if(!isTheSameFingerId(e))return;pointerId=e.pointerId;if(e.type!=='mousedown')wasTouch=true;if(e.type==='mousedown'&&wasTouch)return;var pointer=getPointerEvent(e);cachedX=currX=pointer.pageX;cachedY=currY=pointer.pageY;longtapTimer=setTimeout(function(){sendEvent(e.target,'longtap',e);target=e.target;},defaults.longtapThreshold);timestamp=getTimestamp();tapNum++;},onTouchEnd=function(e){if(!isTheSameFingerId(e))return;pointerId=undefined;if(e.type==='mouseup'&&wasTouch){wasTouch=false;return;}var eventsArr=[],now=getTimestamp(),deltaY=cachedY-currY,deltaX=cachedX-currX;clearTimeout(dblTapTimer);clearTimeout(longtapTimer);if(deltaX<=-defaults.swipeThreshold)eventsArr.push('swiperight');if(deltaX>=defaults.swipeThreshold)eventsArr.push('swipeleft');if(deltaY<=-defaults.swipeThreshold)eventsArr.push('swipedown');if(deltaY>=defaults.swipeThreshold)eventsArr.push('swipeup');if(eventsArr.length){for(var i=0;i<eventsArr.length;i++){var eventName=eventsArr[i];sendEvent(e.target,eventName,e,{distance:{x:Math.abs(deltaX),y:Math.abs(deltaY)}});}tapNum=0;}else{if(cachedX>=currX-defaults.tapPrecision&&cachedX<=currX+defaults.tapPrecision&&cachedY>=currY-defaults.tapPrecision&&cachedY<=currY+defaults.tapPrecision){if(timestamp+defaults.tapThreshold-now>=0){sendEvent(e.target,tapNum>=2&&target===e.target?'dbltap':'tap',e);target=e.target;}}dblTapTimer=setTimeout(function(){tapNum=0;},defaults.dbltapThreshold);}},onTouchMove=function(e){if(!isTheSameFingerId(e))return;if(e.type==='mousemove'&&wasTouch)return;var pointer=getPointerEvent(e);currX=pointer.pageX;currY=pointer.pageY;},tapNum=0,pointerId,currX,currY,cachedX,cachedY,timestamp,target,dblTapTimer,longtapTimer;setListener(doc,touchevents.touchstart+(defaults.justTouchEvents?'':' mousedown'),onTouchStart);setListener(doc,touchevents.touchend+(defaults.justTouchEvents?'':' mouseup'),onTouchEnd);setListener(doc,touchevents.touchmove+(defaults.justTouchEvents?'':' mousemove'),onTouchMove);win.tocca=function(options){for(var opt in options){if(options.hasOwnProperty(opt)){defaults[opt]=options[opt];}}return defaults;};}(document,window));
/*!
 * modified JavaScript Cookie - v2.1.3
 * @see {@link https://github.com/js-cookie/js-cookie}
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
 * fixed this
 * @see {@link https://github.com/js-cookie/js-cookie/blob/master/src/js.cookie.js}
 * passes jshint
 */
(function(){"use strict";var Cookies=function(){function extend(){var i=0;var result={};for(;i<arguments.length;i++){var attributes=arguments[i];for(var key in attributes){if(attributes.hasOwnProperty(key)){result[key]=attributes[key];}}}return result;}function init(converter){var api=function(key,value,attributes){var _this=this;var result;if(typeof document==='undefined'){return;}if(arguments.length>1){attributes=extend({path:'/'},api.defaults,attributes);if(typeof attributes.expires==='number'){var expires=new Date();expires.setMilliseconds(expires.getMilliseconds()+attributes.expires*864e+5);attributes.expires=expires;}try{result=JSON.stringify(value);if(/^[\{\[]/.test(result)){value=result;}}catch(e){}if(!converter.write){value=encodeURIComponent(String(value)).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g,decodeURIComponent);}else{value=converter.write(value,key);}key=encodeURIComponent(String(key));key=key.replace(/%(23|24|26|2B|5E|60|7C)/g,decodeURIComponent);key=key.replace(/[\(\)]/g,escape);var ret=(document.cookie=[key,'=',value,attributes.expires?'; expires='+attributes.expires.toUTCString():'',attributes.path?'; path='+attributes.path:'',attributes.domain?'; domain='+attributes.domain:'',attributes.secure?'; secure':''].join(''));return ret;}if(!key){result={};}var cookies=document.cookie?document.cookie.split('; '):[];var rdecode=/(%[0-9A-Z]{2})+/g;var i=0;for(;i<cookies.length;i++){var parts=cookies[i].split('=');var cookie=parts.slice(1).join('=');if(cookie.charAt(0)==='"'){cookie=cookie.slice(1,-1);}try{var name=parts[0].replace(rdecode,decodeURIComponent);cookie=converter.read?converter.read(cookie,name):converter(cookie,name)||cookie.replace(rdecode,decodeURIComponent);if(_this.json){try{cookie=JSON.parse(cookie);}catch(e){}}if(key===name){result=cookie;break;}if(!key){result[name]=cookie;}}catch(e){}}return result;};api.set=api;api.get=function(key){return api.call(api,key);};api.getJSON=function(){return api.apply({json:true},[].slice.call(arguments));};api.defaults={};api.remove=function(key,attributes){api(key,'',extend(attributes,{expires:-1}));};api.withConverter=init;return api;}return init(function(){});}();("undefined" !== typeof window ? window : this).Cookies=Cookies;}());
/*!
 * modified verge 1.9.1+201402130803
 * @see {@link https://github.com/ryanve/verge}
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
 * @see {@link https://github.com/ryanve/verge/issues/19}
 * @see {@link https://github.com/ryanve/verge/blob/master/verge.js}
 * passes jshint
 */
(function(root,name,make){"use strict";root[name]=make();}("undefined" !== typeof window ? window : this,"verge",function(){var xports={},win=typeof window!="undefined"&&window,doc=typeof document!="undefined"&&document,docElem=doc&&doc.documentElement,matchMedia=win.matchMedia||win.msMatchMedia,mq=matchMedia?function(q){return!!matchMedia.call(win,q).matches;}:function(){return false;},viewportW=xports.viewportW=function(){var a=docElem.clientWidth,b=win.innerWidth;return a<b?b:a;},viewportH=xports.viewportH=function(){var a=docElem.clientHeight,b=win.innerHeight;return a<b?b:a;};xports.mq=mq;xports.matchMedia=matchMedia?function(){return matchMedia.apply(win,arguments);}:function(){return{};};function viewport(){return{"width":viewportW(),"height":viewportH()};}xports.viewport=viewport;xports.scrollX=function(){return win.pageXOffset||docElem.scrollLeft;};xports.scrollY=function(){return win.pageYOffset||docElem.scrollTop;};function calibrate(coords,cushion){var o={};cushion=+cushion||0;o.width=(o.right=coords.right+cushion)-(o.left=coords.left-cushion);o.height=(o.bottom=coords.bottom+cushion)-(o.top=coords.top-cushion);return o;}function rectangle(el,cushion){el=el&&!el.nodeType?el[0]:el;if(!el||1!==el.nodeType)return false;return calibrate(el.getBoundingClientRect(),cushion);}xports.rectangle=rectangle;function aspect(o){o=null===o?viewport():1===o.nodeType?rectangle(o):o;var h=o.height,w=o.width;h=typeof h=="function"?h.call(o):h;w=typeof w=="function"?w.call(o):w;return w/h;}xports.aspect=aspect;xports.inX=function(el,cushion){var r=rectangle(el,cushion);return!!r&&r.right>=0&&r.left<=viewportW()&&(0!==el.offsetHeight);};xports.inY=function(el,cushion){var r=rectangle(el,cushion);return!!r&&r.bottom>=0&&r.top<=viewportH()&&(0!==el.offsetHeight);};xports.inViewport=function(el,cushion){var r=rectangle(el,cushion);return!!r&&r.bottom>=0&&r.right>=0&&r.top<=viewportH()&&r.left<=viewportW()&&(0!==el.offsetHeight);};return xports;}));
/*!
 * return image is loaded promise
 * @see {@link https://jsfiddle.net/englishextra/56pavv7d/}
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
(function(){"use strict";var imagePromise=function(s){if(window.Promise){return new Promise(function(y,n){var f=function(e,p){e.onload=function(){y(p);};e.onerror=function(){n(p);};e.src=p;};if("string"===typeof s){var a=new Image();f(a,s);}else{if("IMG"!==s.tagName){return Promise.reject();}else{if(s.src){f(s,s.src);}}}});}else{throw new Error("Promise is not in window");}};("undefined" !== typeof window ? window : this).imagePromise=imagePromise;}());
/*!
 * modified Simple lightbox effect in pure JS
 * @see {@link https://github.com/squeral/lightbox}
 * @see {@link https://github.com/squeral/lightbox/blob/master/lightbox.js}
 * @params {Object} elem Node element
 * new HDLightbox(elem)
 * passes jshint
 */
(function(root){"use strict";var HDLightbox=function(elem){this.trigger=elem;this.el=document.querySelector(".iframe-lightbox");this.body=document.querySelector(".iframe-lightbox .body");this.content=document.querySelector(".iframe-lightbox .content");this.href=elem.dataset.src||"";this.paddingBottom=elem.dataset.paddingBottom||"";this.image=null;this.video=null;this.init();};HDLightbox.prototype.init=function(){var _this=this;if(!this.el)this.create();this.trigger.addEventListener("click",function(e){e.preventDefault();_this.open();});};HDLightbox.prototype.create=function(){var _this=this,bd=document.createElement("div");this.el=document.createElement("div");this.content=document.createElement("div");this.body=document.createElement("div");this.el.classList.add("iframe-lightbox");bd.classList.add("backdrop");this.content.classList.add("content");this.body.classList.add("body");this.el.appendChild(bd);this.content.appendChild(this.body);this.content_holder=document.createElement("div");this.content_holder.classList.add("content-holder");this.content_holder.appendChild(this.content);this.el.appendChild(this.content_holder);document.body.appendChild(this.el);bd.addEventListener("click",function(){_this.close();});var f=function(e){if(_this.isOpen())return;_this.el.classList.remove("show");_this.body.innerHTML="";};this.el.addEventListener("transitionend",f,false);this.el.addEventListener("webkitTransitionEnd",f,false);this.el.addEventListener("mozTransitionEnd",f,false);this.el.addEventListener("msTransitionEnd",f,false);};HDLightbox.prototype.loadIframe=function(){this.body.innerHTML='<iframe src="'+this.href+'" name="iframe-lightbox-'+Date.now()+'" onload="this.style.opacity=1;" style="opacity:0;border:none;" scrolling="no" webkitallowfullscreen="true" mozallowfullscreen="true" allowfullscreen="true" height="166" frameborder="no"></iframe>';};HDLightbox.prototype.open=function(){this.loadIframe();if(this.paddingBottom){this.content.style.paddingBottom=this.paddingBottom;}else{this.content.removeAttribute("style");}this.el.classList.add("show");this.el.classList.add("open");};HDLightbox.prototype.close=function(){this.el.classList.remove("open");};HDLightbox.prototype.isOpen=function(){return this.el.classList.contains("open");};root.HDLightbox=HDLightbox;})(globalRoot);
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
(function(classes){"use strict";if(classes){classes.add("js");}}(document.documentElement.classList||""));
/*!
 * modified MediaHack - (c) 2013 Pomke Nohkan MIT LICENCED.
 * @see {@link https://gist.github.com/englishextra/ff8c9dde94abe32a9d7c4a65e0f2ccac}
 * @see {@link https://jsfiddle.net/englishextra/xg7ce8kc/}
 * removed className fallback and additionally
 * returns earlyDeviceOrientation,earlyDeviceSize
 * Add media query classes to DOM nodes
 * @see {@link https://github.com/pomke/mediahack/blob/master/mediahack.js}
 */
(function(root,selectors){"use strict";var orientation,size,f=function(a){var b=a.split(" ");if(selectors){for(var c=0;c<b.length;c+=1){a=b[c];selectors.add(a);}}},g=function(a){var b=a.split(" ");if(selectors){for(var c=0;c<b.length;c+=1){a=b[c];selectors.remove(a);}}},h={landscape:"all and (orientation:landscape)",portrait:"all and (orientation:portrait)"},k={small:"all and (max-width:768px)",medium:"all and (min-width:768px) and (max-width:991px)",large:"all and (min-width:992px)"},d,mM="matchMedia",m="matches",o=function(a,b){var c=function(a){if(a[m]){f(b);orientation=b;}else{g(b);}};c(a);a.addListener(c);},s=function(a,b){var c=function(a){if(a[m]){f(b);size=b;}else{g(b);}};c(a);a.addListener(c);};for(d in h){if(h.hasOwnProperty(d)){o(root[mM](h[d]),d);}}for(d in k){if(k.hasOwnProperty(d)){s(root[mM](k[d]),d);}}root.earlyDeviceOrientation=orientation||"";root.earlyDeviceSize=size||"";})("undefined" !== typeof window ? window : this,document.documentElement.classList||"");
/*!
 * add mobile or desktop class
 * using Detect Mobile Browsers | Open source mobile phone detection
 * Regex updated: 1 August 2014
 * detectmobilebrowsers.com
 * @see {@link https://github.com/heikojansen/plack-middleware-detectmobilebrowsers}
 */
(function(root,html,mobile,desktop,opera){"use strict";var selector=(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i).test(opera)||(/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i).test(opera.substr(0,4))?mobile:desktop;if(html){html.classList.add(selector);}root.earlyDeviceType=selector||"";}("undefined" !== typeof window ? window : this,document.documentElement||"","mobile","desktop",navigator.userAgent||navigator.vendor||window.opera));
/*!
 * add svg support class
 */
(function(root,html,selector){"use strict";selector=document.implementation.hasFeature("http://www.w3.org/2000/svg","1.1")?selector:"no-"+selector;if(html){html.classList.add(selector);}root.earlySvgSupport=selector||"";})("undefined" !== typeof window ? window : this,document.documentElement||"","svg");
/*!
 * add svgasimg support class
 */
(function(root,html,selector){"use strict";selector=document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image","1.1")?selector:"no-"+selector;if(html){html.classList.add(selector);}root.earlySvgasimgSupport=selector||"";})("undefined" !== typeof window ? window : this,document.documentElement||"","svgasimg");
/*!
 * add touch support class
 * @see {@link https://gist.github.com/englishextra/3cb22aab31a52b6760b5921e4fe8db95}
 * @see {@link https://jsfiddle.net/englishextra/z5xhjde8/}
 */
(function(root,html,selector){"use strict";selector="ontouchstart"in html?selector:"no-"+selector;if(html){html.classList.add(selector);}root.earlyHasTouch=selector||"";})("undefined" !== typeof window ? window : this,document.documentElement||"","touch");
/*!
 * return date in YYYY-MM-DD format
 */
(function(root){"use strict";var newDate=(new Date()),newDay=newDate.getDate(),newYear=newDate.getFullYear(),newMonth=newDate.getMonth();(newMonth+=1);if(10>newDay){newDay="0"+newDay;}if(10>newMonth){newMonth="0"+newMonth;}root.earlyFnGetYyyymmdd=newYear+"-"+newMonth+"-"+newDay;})("undefined" !== typeof window ? window : this);
/*!
 * append details to title
 */
var initialDocumentTitle = document.title || "",
userBrowsingDetails = " [" + (earlyFnGetYyyymmdd ? earlyFnGetYyyymmdd : "") + (earlyDeviceType ? " " + earlyDeviceType : "") + (earlyDeviceSize ? " " + earlyDeviceSize : "") + (earlyDeviceOrientation ? " " + earlyDeviceOrientation : "") + (earlySvgSupport ? " " + earlySvgSupport : "") + (earlySvgasimgSupport ? " " + earlySvgasimgSupport : "") + (earlyHasTouch ? " " + earlyHasTouch : "") + "]";
if (document.title) {
	document.title = document.title + userBrowsingDetails;
}
/*!
 * modified JavaScript Sync/Async forEach - v0.1.2 - 1/10/2012
 * @see {@link https://github.com/millermedeiros/amd-utils/issues/17}
 * @see {@link https://github.com/cowboy/javascript-sync-async-foreach}
 * @see {@link http://stackoverflow.com/questions/22335853/hack-to-convert-javascript-number-to-uint32}
 * @see {@link https://jsfiddle.net/englishextra/voq0bb62/}
 * Copyright (c) 2012 "Cowboy" Ben Alman; Licensed MIT
 * removed Node.js / browser support wrapper function
 * @param {Object} a Any object to walk through
 * @param {Object} b The sync callback function
 * @param {Object} [c] The async callback function
 * forEach(a,function(e){console.log("eachCallback: "+e);},!1});
 * forEach(a,function(e){console.log("eachCallback: "+e);},function(){console.log("doneCallback");});
 * @see {@link https://github.com/cowboy/javascript-sync-async-foreach/blob/master/dist/ba-foreach.js}
 * passes jshint
 */
(function(root){root.forEach=function(arr,eachFn,doneFn){var i=-1;var len=function(val){val=+val;if(!isFinite(val)||!val){return 0;}return function(left,right){return left-right*Math.floor(left/right);}(Math.floor(val),Math.pow(2,32));}(arr.length);(function next(result){var async;var abort=result===false;do{++i;}while(!(i in arr)&&i!==len);if(abort||i===len){if(doneFn){doneFn(!abort,arr);}return;}result=eachFn.call({async:function(){async=true;return next;}},arr[i],i,arr);if(!async){next(result);}}());};})("undefined" !== typeof window ? window : this);
/*!
 * Behaves the same as setTimeout except uses requestAnimationFrame()
 * where possible for better performance
 * @see {@link https://gist.github.com/joelambert/1002116}
 * the fallback function requestAnimFrame is incorporated
 * @see {@link https://gist.github.com/joelambert/1002116}
 * @see {@link https://gist.github.com/englishextra/873c8f78bfda7cafc905f48a963df07b}
 * @see {@link https://jsfiddle.net/englishextra/dnyomc4j/}
 * @param {Object} fn The callback function
 * @param {Int} delay The delay in milliseconds
 * requestTimeout(fn,delay)
 */
(function(root){"use strict";var requestTimeout=function(fn,delay){var requestAnimFrame=(function(){return root.requestAnimationFrame||function(callback,element){root.setTimeout(callback,1000/60);};})(),start=new Date().getTime(),handle={};function loop(){var current=new Date().getTime(),delta=current-start;if(delta>=delay){fn.call();}else{handle.value=requestAnimFrame(loop);}}handle.value=requestAnimFrame(loop);return handle;};root.requestTimeout=requestTimeout;})("undefined" !== typeof window ? window : this);
/*!
 * Behaves the same as clearTimeout except uses cancelRequestAnimationFrame()
 * where possible for better performance
 * @see {@link https://gist.github.com/joelambert/1002116}
 * @see {@link https://gist.github.com/englishextra/873c8f78bfda7cafc905f48a963df07b}
 * @see {@link https://jsfiddle.net/englishextra/dnyomc4j/}
 * @param {Int|Object} handle The callback function
 * clearRequestTimeout(handle)
 */
(function(root){"use strict";var clearRequestTimeout=function(handle){if(root.cancelAnimationFrame){root.cancelAnimationFrame(handle.value);}else{root.clearTimeout(handle);}};root.clearRequestTimeout=clearRequestTimeout;})("undefined" !== typeof window ? window : this);
/*!
 * set and clear timeout
 * based on requestTimeout and clearRequestTimeout
 * @see {@link https://gist.github.com/joelambert/1002116}
 * @see {@link https://gist.github.com/englishextra/873c8f78bfda7cafc905f48a963df07b}
 * @param {Object} f handle/function
 * @param {Int} [n] a whole positive number
 * setAutoClearedTimeout(f,n)
 */
var setAutoClearedTimeout=function(f,n){n=n||200;if(f&&"function"===typeof f){var st=requestTimeout(function(){clearRequestTimeout(st);f();},n);}};
/*!
 * Plain javascript replacement for jQuery's .ready()
 * so code can be scheduled to run when the document is ready
 * @see {@link https://github.com/jfriend00/docReady}
 * @see {@link https://gist.github.com/englishextra/7c22a9a9cae3320318e9c9eab6777c84}
 * docReady(function(){});
 * @see {@link https://github.com/jfriend00/docReady/blob/master/docready.js}
 * passes jshint
 */
(function(root){"use strict";var docReady=(function(){var readyList=[];var readyFired=false;var readyEventHandlersInstalled=false;function ready(){if(!readyFired){readyFired=true;for(var i=0;i<readyList.length;i++){readyList[i].fn.call(window,readyList[i].ctx);}readyList=[];}}function readyStateChange(){if(document.readyState==="complete"){ready();}}return function(callback,context){if(readyFired){setTimeout(function(){callback(context);},1);return;}else{readyList.push({fn:callback,ctx:context});}if(document.readyState==="complete"||(!document.attachEvent&&document.readyState==="interactive")){setTimeout(ready,1);}else if(!readyEventHandlersInstalled){if(document.addEventListener){document.addEventListener("DOMContentLoaded",ready,false);window.addEventListener("load",ready,false);}else{document.attachEvent("onreadystatechange",readyStateChange);window.attachEvent("onload",ready);}readyEventHandlersInstalled=true;}};})();root.docReady=docReady;})("undefined" !== typeof window ? window : this);
/*!
 * modified Evento - v1.0.0
 * by Erik Royall <erikroyalL@hotmail.com> (http://erikroyall.github.io)
 * Dual licensed under MIT and GPL
 * identifier needs binding if its function has arguments
 * var fn=function(a){a=a||"";if(a){return a;}};
 * evento.add(window,"load",fn.bind(null,some_value));
 * removed Array.prototype.indexOf shim
 * removed Helio stuff which seems to be added
 * for some other library, and works without Helio
 * @see {@link https://jsbin.com/jilevi/edit?html,js,output}
 * @see {@link https://jsfiddle.net/englishextra/hLxyvmcm/}
 * exposed as window property
 * @see {@link https://gist.github.com/erikroyall/6618740}
 * @see {@link https://gist.github.com/englishextra/3a959e4da0fcc268b140}
 * passes jshint
 */
(function(root){"use strict";var evento=(function(){return function(){var win=window,doc=win.document,_handlers={},addEvent,removeEvent,triggerEvent;addEvent=(function(){if(typeof doc.addEventListener==="function"){return function(el,evt,fn){el.addEventListener(evt,fn,false);_handlers[el]=_handlers[el]||{};_handlers[el][evt]=_handlers[el][evt]||[];_handlers[el][evt].push(fn);};}else if(typeof doc.attachEvent==="function"){return function(el,evt,fn){el.attachEvent(evt,fn);_handlers[el]=_handlers[el]||{};_handlers[el][evt]=_handlers[el][evt]||[];_handlers[el][evt].push(fn);};}else{return function(el,evt,fn){el["on"+evt]=fn;_handlers[el]=_handlers[el]||{};_handlers[el][evt]=_handlers[el][evt]||[];_handlers[el][evt].push(fn);};}}());removeEvent=(function(){if(typeof doc.removeEventListener==="function"){return function(el,evt,fn){el.removeEventListener(evt,fn,false);};}else if(typeof doc.detachEvent==="function"){return function(el,evt,fn){el.detachEvent(evt,fn);};}else{return function(el,evt,fn){el["on"+evt]=undefined;};}}());triggerEvent=function(el,evt){_handlers[el]=_handlers[el]||{};_handlers[el][evt]=_handlers[el][evt]||[];for(var _i=0,_l=_handlers[el][evt].length;_i<_l;_i+=1){_handlers[el][evt][_i]();}};return{add:addEvent,remove:removeEvent,trigger:triggerEvent,_handlers:_handlers};}();}());root.evento=evento;})("undefined" !== typeof window ? window : this);
/*!
 * Promise based script loader for the browser using script tags
 * @see {@link https://github.com/MiguelCastillo/load-js}
 * type: defaults to text/javascript
 * async: defaults to false
 * charset: defaults to utf-8
 * id: no default value
 * url: required if no text is provided
 * text: required if no url is provided
 * promiseLoadJS(["https://code.jquery.com/jquery-2.2.1.js",
 * "https://unpkg.com/react@15.3.1/dist/react.min.js"])
 * .then(function(){console.log("jQuery and react are loaded");});
 * promiseLoadJS([{async:true,url:"https://code.jquery.com/jquery-2.2.1.js"},
 * {async:true,url:"https://unpkg.com/react@15.3.1/dist/react.min.js"}])
 * .then(()=>{console.log("all done!");});
 * @see {@link https://gist.github.com/pranksinatra/a4e57e586249dc3833e4}
 * passes jshint
 */
(function(root){"use strict";function exec(options){if("string"===typeof options){options={url:options};}if(!options.url&&!options.text){throw new Error("must provide a url or text to load");}var head=document.getElementsByTagName("head")[0]||document.documentElement;var script=document.createElement("script");script.charset=options.charset||"utf-8";script.type=options.type||"text/javascript";script.async=!!options.async;if(options.hasOwnProperty("id")){script.id=options.id;}if(options.url){script.src=options.url;return loadScript(head,script);}else{script.text=options.text;return runScript(head,script);}}function runScript(head,script){head.appendChild(script);return Promise.resolve(script);}function loadScript(head,script){return new Promise(function(resolve){var done=false;script.onload=script.onreadystatechange=function(){if(!done&&(!this.readyState||this.readyState==="loaded"||this.readyState==="complete")){done=true;script.onload=script.onreadystatechange=null;if(head&&script.parentNode){head.removeChild(script);}resolve(script);}};head.appendChild(script);});}var promiseLoadJS=function(items){return items instanceof Array?Promise.all(items.map(exec)):exec(items);};root.promiseLoadJS=promiseLoadJS;})("undefined" !== typeof window ? window : this);
/*!
 * How can I check if a JS file has been included already?
 * @see {@link https://gist.github.com/englishextra/403a0ca44fc5f495400ed0e20bc51d47}
 * @see {@link https://stackoverflow.com/questions/18155347/how-can-i-check-if-a-js-file-has-been-included-already}
 * @param {String} s path string
 * scriptIsLoaded(s)
 */
(function(root){"use strict";var scriptIsLoaded=function(s){for(var b=document.getElementsByTagName("script")||"",a=0;a<b.length;a++)if(b[a].getAttribute("src")==s)return!0;return!1;};root.scriptIsLoaded=scriptIsLoaded;})("undefined" !== typeof window ? window : this);
/*!
 * Load and execute JS via AJAX
 * @see {@link https://gist.github.com/englishextra/8dc9fe7b6ff8bdf5f9b483bf772b9e1c}
 * IE 5.5+, Firefox, Opera, Chrome, Safari XHR object
 * @see {@link https://gist.github.com/Xeoncross/7663273}
 * modified callback(x.responseText,x); to callback(eval(x.responseText),x);
 * @see {@link https://stackoverflow.com/questions/3728798/running-javascript-downloaded-with-xmlhttprequest}
 * @param {String} url path string
 * @param {Object} [callback] callback function
 * @param {Object} [onerror] on error callback function
 * ajaxLoadTriggerJS(url,callback,onerror)
 */
(function(root){"use strict";var ajaxLoadTriggerJS=function(url,callback,onerror){var w=window,x=w.XMLHttpRequest?new XMLHttpRequest():new ActiveXObject("Microsoft.XMLHTTP");x.overrideMimeType("application/javascript;charset=utf-8");x.open("GET",url,!0);x.withCredentials=!1;x.onreadystatechange=function(){if(x.status=="404"){console.log("Error XMLHttpRequest-ing file "+url,x.status);return onerror&&"function"===typeof onerror&&onerror();}else if(x.readyState==4&&x.status==200&&x.responseText){try{var Fn=Function;new Fn(""+x.responseText).call(root);}catch(err){throw new Error("Error evaluating file "+url,err);}if(callback&&"function"===typeof callback){callback(x.responseText);}}};x.send(null);};root.ajaxLoadTriggerJS=ajaxLoadTriggerJS;})("undefined" !== typeof window ? window : this);
/*!
 * Load .json file, but don't JSON.parse it
 * modified JSON with JS.md
 * @see {@link https://gist.github.com/thiagodebastos/08ea551b97892d585f17}
 * @see {@link https://gist.github.com/englishextra/e2752e27761649479f044fd93a602312}
 * @param {String} url path string
 * @param {Object} [callback] callback function
 * @param {Object} [onerror] on error callback function
 * loadUnparsedJSON(url,callback,onerror)
 */
(function(root){"use strict";var loadUnparsedJSON=function(url,callback,onerror){var cb=function(string){return callback&&"function"===typeof callback&&callback(string);};if(root.Promise&&root.fetch&&!("undefined"!==typeof window&&window.process&&"renderer"===window.process.type)){fetch(url).then(function(response){if(!response.ok){if(onerror&&"function"===typeof onerror){onerror();}else{throw new Error(response.statusText);}}return response;}).then(function(response){return response.text();}).then(function(text){cb(text);}).catch(function(err){console.log("Error fetch-ing file "+url,err);});}else{var x=root.XMLHttpRequest?new XMLHttpRequest():new ActiveXObject("Microsoft.XMLHTTP");x.overrideMimeType("application/json;charset=utf-8");x.open("GET",url,!0);x.withCredentials=!1;x.onreadystatechange=function(){if(x.status=="404"){console.log("Error XMLHttpRequest-ing file",x.status);return onerror&&"function"===typeof onerror&&onerror();}else if(x.readyState==4&&x.status==200&&x.responseText){cb(x.responseText);}};x.send(null);}};root.loadUnparsedJSON=loadUnparsedJSON;})("undefined" !== typeof window ? window : this);
/*!
 * parse JSON without try / catch
 * @param {String} a JSON string
 * @see {@link http://stackoverflow.com/questions/11182924/how-to-check-if-javascript-object-is-json}
 * safelyParseJSON(a)
 */
(function(root){"use strict";var safelyParseJSON=function(a){var isJson=function(obj){var t=typeof obj;return['boolean','number','string','symbol','function'].indexOf(t)==-1;};if(!isJson(a)){return JSON.parse(a);}else{return a;}};root.safelyParseJSON=safelyParseJSON;})("undefined" !== typeof window ? window : this);
/*!
 * loop over the Array
 * @see {@link https://stackoverflow.com/questions/18238173/javascript-loop-through-json-array}
 * @see {@link https://gist.github.com/englishextra/b4939b3430da4b55d731201460d3decb}
 * @param {String} str any text string
 * @param {Int} max a whole positive number
 * @param {String} add any text string
 * truncString(str,max,add)
 */
(function(root){"use strict";var truncString=function(str,max,add){add=add||"\u2026";return("string"===typeof str&&str.length>max?str.substring(0,max)+add:str);};root.truncString=truncString;})("undefined" !== typeof window ? window : this);
/*!
 * fix en ru / ru en typo
 * modified sovtime.ru/soft/convert.html
 * @see {@link https://gist.github.com/englishextra/8f398bb7a3e438b692352a3c114a13ae}
 * @see {@link https://jsfiddle.net/englishextra/6p150wu1/}
 * @see {@link https://jsbin.com/runoju/edit?js,output}
 * @param {String} e any text string
 * @param {String} a "ru" or "en", default "en"
 * @param {String} b "en" or "ru", default "ru"
 * fixEnRuTypo(e,a,b)
 */
(function(root){"use strict";var fixEnRuTypo=function(e,a,b){var c="";if("ru"==a&&"en"==b){a='\u0430\u0431\u0432\u0433\u0434\u0435\u0451\u0436\u0437\u0438\u0439\u043a\u043b\u043c\u043d\u043e\u043f\u0440\u0441\u0442\u0443\u0444\u0445\u0446\u0447\u0448\u0449\u044a\u044c\u044b\u044d\u044e\u044f\u0410\u0411\u0412\u0413\u0414\u0415\u0401\u0416\u0417\u0418\u0419\u041a\u041b\u041c\u041d\u041e\u041f\u0420\u0421\u0422\u0423\u0424\u0425\u0426\u0427\u0428\u0429\u042a\u042c\u042b\u042d\u042e\u042f"\u2116;:?/.,';b="f,dult`;pbqrkvyjghcnea[wxio]ms'.zF<DULT~:PBQRKVYJGHCNEA{WXIO}MS'>Z@#$^&|/?";}else{a="f,dult`;pbqrkvyjghcnea[wxio]ms'.zF<DULT~:PBQRKVYJGHCNEA{WXIO}MS'>Z@#$^&|/?";b='\u0430\u0431\u0432\u0433\u0434\u0435\u0451\u0436\u0437\u0438\u0439\u043a\u043b\u043c\u043d\u043e\u043f\u0440\u0441\u0442\u0443\u0444\u0445\u0446\u0447\u0448\u0449\u044a\u044c\u044b\u044d\u044e\u044f\u0410\u0411\u0412\u0413\u0414\u0415\u0401\u0416\u0417\u0418\u0419\u041a\u041b\u041c\u041d\u041e\u041f\u0420\u0421\u0422\u0423\u0424\u0425\u0426\u0427\u0428\u0429\u042a\u042c\u042b\u042d\u042e\u042f"\u2116;:?/.,';}for(var d=0;d<e.length;d++){var f=a.indexOf(e.charAt(d));if(c>f){c+=e.charAt(d);}else{c+=b.charAt(f);}}return c;};root.fixEnRuTypo=fixEnRuTypo;})("undefined" !== typeof window ? window : this);
/*!
 * if element is in viewport
 * @see {@link https://gist.github.com/englishextra/2e9322e5eea9412f5086f7427009b903}
 * @see {@link https://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport}
 * @see {@link https://jsfiddle.net/englishextra/9mwdxgez/}
 * @param e an HTML element
 * var p = document.getElementById("h1") || "";
 * if(p){var g=function(_that){if(isInViewport(p))
 * {window.removeEventListener("scroll",_that);alert(1);}};
 * window.addEventListener("scroll",function h_w(){g(h_w);});}
 */
var fitsIntoViewport=function(w,d){return function(e){return(e=e?e.getBoundingClientRect()||"":"")?0<=e.top&&0<=e.left&&e.bottom<=(w.innerHeight||d.clientHeight)&&e.right<=(w.innerWidth||d.clientWidth)&&(0!==e.offsetHeight):!0;};}(window,document.documentElement||"");
/*!
 * remove element from DOM
 * @see {@link https://gist.github.com/englishextra/d2a286f64d404052fbbdac1e416ab808}
 * @param {Object} e an Element to remove
 * removeElement(e)
 */
(function(root){"use strict";var removeElement=function(e){var r="remove",pN="parentNode";if(e){if("undefined"!==typeof e[r]){return e[r]();}else{return e[pN]&&e[pN].removeChild(e);}}};root.removeElement=removeElement;})("undefined" !== typeof window ? window : this);
/*!
 * remove all children of parent element
 * @see {@link https://gist.github.com/englishextra/da26bf39bc90fd29435e8ae0b409ddc3}
 * @param {Object} e parent HTML Element
 * removeChildren(e)
 */
(function(root){"use strict";var removeChildren=function(e){return function(){if(e&&e.firstChild){for(;e.firstChild;){e.removeChild(e.firstChild);}}}();};root.removeChildren=removeChildren;})("undefined" !== typeof window ? window : this);
/*!
 * append node into other with fragment
 * @see {@link https://gist.github.com/englishextra/0ff3204d5fb285ef058d72f31e3af766}
 * @param {String|object} e an HTML Element to append
 * @param {Object} a target HTML Element
 * appendFragment(e,a)
 */
(function(root){"use strict";var appendFragment=function(e,a){var d=document;a=a||d.getElementsByTagNames("body")[0]||"";return function(){if(e){var d=document,df=d.createDocumentFragment()||"",aC="appendChild";if("string"===typeof e){e=d.createTextNode(e);}df[aC](e);a[aC](df);}}();};root.appendFragment=appendFragment;})("undefined" !== typeof window ? window : this);
/*!
 * Adds Element as fragment BEFORE NeighborElement
 * @see {@link https://gist.github.com/englishextra/fa19e39ce84982b17fc76485db9d1bea}
 * @param {String|object} e HTML Element to prepend before before
 * @param {Object} a target HTML Element
 * prependFragmentBefore(e,a)
 */
var prependFragmentBefore=function(e,a){if("string"===typeof e){e=document.createTextNode(e);}var p=a.parentNode||"",df=document.createDocumentFragment();return function(){if(p){df.appendChild(e);p.insertBefore(df,a);}}();};
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
 * Check if string represents a valid HTML id
 * @see {@link https://gist.github.com/englishextra/b5aaef8b555a3ba84c68a6e251db149d}
 * @see {@link https://jsfiddle.net/englishextra/z19tznau/}
 * @param {String} a text string
 * @param {Int} [full] if true, returns with leading hash/number sign
 * isValidId(a,full)
 */
(function(root){"use strict";var isValidId=function(a,full){return full?/^\#[A-Za-z][-A-Za-z0-9_:.]*$/.test(a)?!0:!1:/^[A-Za-z][-A-Za-z0-9_:.]*$/.test(a)?!0:!1;};root.isValidId=isValidId;})("undefined" !== typeof window ? window : this);
/*!
 * find element's position
 * @see {@link https://stackoverflow.com/questions/5598743/finding-elements-position-relative-to-the-document}
 * @param {Object} a an HTML element
 * findPos(a).top
 */
(function(root){"use strict";var findPos=function(a){a=a.getBoundingClientRect();var b=document.body,c=document.documentElement;return{top:Math.round(a.top+(root.pageYOffset||c.scrollTop||b.scrollTop)-(c.clientTop||b.clientTop||0)),left:Math.round(a.left+(root.pageXOffset||c.scrollLeft||b.scrollLeft)-(c.clientLeft||b.clientLeft||0))};};root.findPos=findPos;})("undefined" !== typeof window ? window : this);
/*!
 * Scroll to top with Zenscroll, or fallback
 * @requires zenscroll
 * scrollToTop()
 */
var scrollToTop=function(){var w=window;return w.zenscroll?zenscroll.toY(0):w.scroll2Top?scroll2Top(w,400):w.scroll(0,0);};
/*!
 * scroll to element using zenscroll with fallback
 * @requires zenscroll
 * @requires findPos
 * @param {Object} a an HTML element
 * scrollToElement(a)
 */
var scrollToElement=function(a){if(a){if(window.zenscroll){zenscroll.to(a);}else{window.scroll(0,findPos(a).top);}}return!1;};
/*!
 * change document location
 * @param {String} a URL / path string
 * changeLocation(a)
 */
var changeLocation=function(a){return function(){if(a){document.location.href=a;}}();};
/*!
 * modified Unified URL parsing API in the browser and node
 * @see {@link https://github.com/wooorm/parse-link}
 * removed module check
 * @see {@link https://gist.github.com/englishextra/4e9a0498772f05fa5d45cfcc0d8be5dd}
 * @see {@link https://gist.github.com/englishextra/2a7fdabd0b23a8433d5fc148fb788455}
 * @see {@link https://jsfiddle.net/englishextra/fcdds4v6/}
 * @param {String} url URL string
 * @param {Boolean} [true|false] if true, returns protocol:, :port, /pathname, ?search, ?query, #hash
 * if set to false, returns protocol, port, pathname, search, query, hash
 * alert(parseLink("http://localhost/search?s=t&v=z#dev").href|
 * origin|host|port|hash|hostname|pathname|protocol|search|query|isAbsolute|isRelative|isCrossDomain);
 */
/*jslint bitwise: true */
(function(root){"use strict";var parseLink=function(url,full){full=full||!1;return function(){var _r=function(s){return s.replace(/^(#|\?)/,"").replace(/\:$/,"");},l=location||"",_p=function(protocol){switch(protocol){case"http:":return full?":"+80:80;case"https:":return full?":"+443:443;default:return full?":"+l.port:l.port;}},_s=(0===url.indexOf("//")||!!~url.indexOf("://")),w=root.location||"",_o=function(){var o=w.protocol+"//"+w.hostname+(w.port?":"+w.port:"");return o||"";},_c=function(){var c=document.createElement("a");c.href=url;var v=c.protocol+"//"+c.hostname+(c.port?":"+c.port:"");return v!==_o();},a=document.createElement("a");a.href=url;return{href:a.href,origin:_o(),host:a.host||l.host,port:("0"===a.port||""===a.port)?_p(a.protocol):(full?a.port:_r(a.port)),hash:full?a.hash:_r(a.hash),hostname:a.hostname||l.hostname,pathname:a.pathname.charAt(0)!="/"?(full?"/"+a.pathname:a.pathname):(full?a.pathname:a.pathname.slice(1)),protocol:!a.protocol||":"==a.protocol?(full?l.protocol:_r(l.protocol)):(full?a.protocol:_r(a.protocol)),search:full?a.search:_r(a.search),query:full?a.search:_r(a.search),isAbsolute:_s,isRelative:!_s,isCrossDomain:_c(),hasHTTP:/^(http|https):\/\//i.test(url)?!0:!1};}();};root.parseLink=parseLink;})("undefined" !== typeof window ? window : this);
/*jslint bitwise: false */
/*!
 * get current protocol - "http" or "https", else return ""
 * @param {Boolean} [force] When set to "true", and the result is empty,
 * the function will return "http"
 * getHTTP(true)
 */
(function(root){"use strict";var getHTTP=function(type){return function(force){force=force||"";return"http:"===type?"http":"https:"===type?"https":force?"http":"";};}(root.location.protocol||"");root.getHTTP=getHTTP;})("undefined" !== typeof window ? window : this);
/*!
 * init ToProgress and extend methods
 */
var progressBar = new ToProgress({
		id : "top-progress-bar",
		color : "#FF2C40",
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
 * @see {@link https://gist.github.com/englishextra/b9a8140e1c1b8aa01772375aeacbf49b}
 * @see {@link https://stackoverflow.com/questions/32402327/how-can-i-force-external-links-from-browser-window-to-open-in-a-default-browser}
 * @see {@link https://github.com/nwjs/nw.js/wiki/shell}
 * electron - file: | nwjs - chrome-extension: | http: Intel XDK
 * wont do in electron and nw,
 * so manageExternalLinks will set target blank to links
 * var win = w.open(url, "_blank");
 * win.focus();
 * @param {String} url URL/path string
 * openDeviceBrowser(url)
 * detect Node.js
 * @see {@link https://github.com/lyrictenor/node-is-nwjs/blob/master/is-nodejs.js}
 * @returns {Boolean} true or false
 * detect Electron
 * @returns {Boolean} true or false
 * detect NW.js
 * @see {@link https://github.com/lyrictenor/node-is-nwjs/blob/master/index.js}
 * @returns {Boolean} true or false
 */
(function(root){"use strict";var isNodejs="undefined"!==typeof process&&"undefined"!==typeof require||"",isElectron="undefined"!==typeof window&&window.process&&"renderer"===window.process.type||"",isNwjs=function(){if("undefined"!==typeof isNodejs&&isNodejs){try{if("undefined"!==typeof require("nw.gui")){return!0;}}catch(e){return!1;}}return!1;}(),openDeviceBrowser=function(url){var triggerForElectron=function(){var es=isElectron?require("electron").shell:"";return es?es.openExternal(url):"";},triggerForNwjs=function(){var ns=isNwjs?require("nw.gui").Shell:"";return ns?ns.openExternal(url):"";},triggerForHTTP=function(){return!0;},triggerForLocal=function(){return root.open(url,"_system","scrollbars=1,location=no");};if(isElectron){triggerForElectron();}else if(isNwjs){triggerForNwjs();}else{var locationProtocol=root.location.protocol||"",hasHTTP=locationProtocol?"http:"===locationProtocol?"http":"https:"===locationProtocol?"https":"":"";if(hasHTTP){triggerForHTTP();}else{triggerForLocal();}}};root.openDeviceBrowser=openDeviceBrowser;})("undefined" !== typeof window ? window : this);
/*!
 * set click event on external links,
 * so that they open in new browser tab
 * @param {Object} [ctx] context HTML Element
 */
var handleExternalLink = function (p, ev) {
	"use strict";
	ev.stopPropagation();
	ev.preventDefault();
	openDeviceBrowser(p);
},
manageExternalLinks = function (ctx) {
	"use strict";
	ctx = ctx || "";
	var w = window,
	cls = "a",
	a = ctx ? BALA.one(cls, ctx) || "" : BALA.one(cls) || "",
	g = function (e) {
		var p = e.getAttribute("href") || "";
		if (p && parseLink(p).isCrossDomain && parseLink(p).hasHTTP) {
			e.title = "" + (parseLink(p).hostname || "") + " откроется в новой вкладке";
			if ("undefined" !== typeof getHTTP && getHTTP()) {
				e.target = "_blank";
			} else {
				evento.add(e, "click", handleExternalLink.bind(null, p));
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
 * loading spinner
 * dependent on setAutoClearedTimeout
 * @see {@link https://gist.github.com/englishextra/24ef040fbda405f7468da70e4f3b69e7}
 * @param {Object} [f] callback function
 * @param {Int} [n] any positive whole number, default: 500
 * LoadingSpinner.show();
 * LoadingSpinner.hide(f,n);
 */
var LoadingSpinner = function () {
	"use strict";
	var b = BALA.one("body") || "",
	cls = "loading-spinner",
	is_active = "is-active-loading-spinner",
	a = BALA.one("." + cls) || "",
	cL = "classList";
	console.log("triggered function: LoadingSpinner");
	if (!a) {
		a = crel("div");
		a[cL].add(cls);
		appendFragment(a, b);
	}
	return {
		show: function () {
			return b[cL].contains(is_active) || b[cL].add(is_active);
		},
		hide: function (f, n) {
			n = n || 500;
			var s = function () {
				b[cL].remove(is_active);
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
 * @see {@link https://gist.github.com/englishextra/5500a860c26d5e262ef3700d822ff698}
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
	c[cL].add(cls);
	c[cL].add(an);
	c[cL].add(an2);
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
		var r = function () {
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
	};
	evento.add(c, "click", function h_c() {
		evento.remove(this, "click", h_c);
		g();
	});
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
		n = "_notifier42_write_comment_",
		m = "Напишите, что понравилось, а что нет. Регистрироваться не нужно.",
		p = parseLink(w.location.href).origin,
		g = function () {
			var ntfr = new Notifier42(crel("a", {
					"href" : "#disqus_thread"
				}, m),
				8000);
			Cookies.set(n, m);
		};
		if (!Cookies.get(n) && p) {
			console.log("triggered function: initNotifier42WriteComment");
			setAutoClearedTimeout(g, 16000);
		}
	}
};
docReady(initNotifier42WriteComment);
/*!
 * init tablesort
 * @see {@link https://github.com/tristen/tablesort}
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
},
loadInitTablesort = function () {
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
 * manage data lightbox img links
 */
var handleImgLightboxLink = function (_this, ev) {
	"use strict";
	ev.stopPropagation();
	ev.preventDefault();
	var w = window,
	ilc = "img-lightbox-container",
	c = BALA.one("." + ilc) || "",
	m = BALA.one("img", c) || "",
	cL = "classList",
	an = "animated",
	an1 = "fadeIn",
	an2 = "fadeInUp",
	_href = _this.getAttribute("href") || "";
	if (c && m && _href) {
		LoadingSpinner.show();
		c[cL].add(an);
		c[cL].add(an1);
		m[cL].add(an);
		m[cL].add(an2);
		if (parseLink(_href).isAbsolute && !parseLink(_href).hasHTTP) {
			_href = _href.replace(/^/, getHTTP(!0) + ":");
		}
		if (w.Promise) {
			imagePromise(_href).then(function (r) {
				m.src = _href;
				console.log("manageDataSrcImages => imagePromise: loaded image:", r);
			}).catch (function (err) {
				console.log("manageDataSrcImages => imagePromise: cannot load image:", err);
			});
		} else {
			m.src = _href;
		}
		evento.add(c, "click", handleImgLightboxContainer);
		evento.add(w, "keyup", handleImgLightboxWindow);
		setStyleDisplayBlock(c);
		LoadingSpinner.hide();
	}
},
hideImgLightbox = function () {
	"use strict";
	var ilc = "img-lightbox-container",
	c = BALA.one("." + ilc) || "",
	m = BALA.one("img", c) || "",
	cL = "classList",
	an = "animated",
	an1 = "fadeIn",
	an2 = "fadeInUp",
	an3 = "fadeOut",
	an4 = "fadeOutDown",
	dm = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
	if (c && m) {
		m[cL].remove(an2);
		m[cL].add(an4);
		var st1 = function () {
			c[cL].remove(an);
			c[cL].remove(an3);
			m[cL].remove(an);
			m[cL].remove(an4);
			m.src = dm;
			setStyleDisplayNone(c);
		},
		st2 = function () {
			c[cL].remove(an1);
			c[cL].add(an3);
			setAutoClearedTimeout(st1, 400);
		};
		setAutoClearedTimeout(st2, 400);
	}
},
handleImgLightboxContainer = function () {
	"use strict";
	var ilc = "img-lightbox-container",
	c = BALA.one("." + ilc) || "";
	if (c) {
		evento.remove(c, "click", handleImgLightboxContainer);
		hideImgLightbox();
	}
},
handleImgLightboxWindow = function (ev) {
	"use strict";
	var w = window;
	evento.remove(w, "keyup", handleImgLightboxWindow);
	if (27 === (ev.which || ev.keyCode)) {
		hideImgLightbox();
	}
},
manageImgLightboxLinks = function (ctx) {
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
	dm = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
	if (!c) {
		c = crel("div");
		m = crel("img");
		c[cL].add(ilc);
		m.src = dm;
		m.alt = "";
		crel(c, m);
		appendFragment(c, b);
	}
	var k = function (e) {
		var v = e[ds].lightbox || "",
		p = e.getAttribute("href") || "";
		if ("img" === v && p) {
			if (parseLink(p).isAbsolute && !parseLink(p).hasHTTP) {
				e.setAttribute("href", p.replace(/^/, getHTTP(!0) + ":"));
			}
			evento.add(e, "click", handleImgLightboxLink.bind(null, e));
		}
	};
	if (a) {
		console.log("triggered function: manageImgLightboxLinks");
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
evento.add(window, "load", manageImgLightboxLinks.bind(null, ""));
/*!
 * replace img src with data-src
 * @param {Object} [ctx] context HTML Element
 */
var manageDataSrcImages = function (ctx) {
	"use strict";
	ctx = ctx || "";
	var w = window,
	cls = "img[data-src]",
	a = ctx ? BALA.one(cls, ctx) || "" : BALA.one(cls) || "",
	is_active = "is-active",
	cL = "classList",
	ds = "dataset",
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
						console.log("manageDataSrcImages => imagePromise: loaded image:", r);
					}).catch (function (err) {
						console.log("manageDataSrcImages => imagePromise: cannot load image:", err);
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
		 * @see {@link https://github.com/ryanve/verge}
		 */
		if (verge.inY(e, 100) /* && 0 !== e.offsetHeight */) {
			k(e);
		}
	};
	if (a) {
		console.log("triggered function: manageDataSrcImages");
		a = ctx ? BALA(cls, ctx) || "" : BALA(cls) || "";
		var h_w = function () {
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
		h_w();
		evento.add(w, "scroll", h_w);
		evento.add(w, "resize", h_w);
		evento.add(w, "hashchange", function h_r() {
			evento.remove(w, "scroll", h_w);
			evento.remove(w, "resize", h_w);
			evento.remove(w, "hashchange", h_r);
		});
	}
};
evento.add(window, "load", manageDataSrcImages.bind(null, ""));
/*!
 * append media-iframe
 * @param {Object} [ctx] context HTML Element
 */
var manageDataSrcIframes = function (ctx) {
	"use strict";
	ctx = ctx || "";
	var w = window,
	cls = "iframe[data-src]",
	a = ctx ? BALA.one(cls, ctx) || "" : BALA.one(cls) || "",
	is_active = "is-active",
	cL = "classList",
	ds = "dataset",
	pN = "parentNode",
	k = function (e) {
		var _src = e[ds].src || "";
		if (_src) {
			if (parseLink(_src).isAbsolute && !parseLink(_src).hasHTTP) {
				e[ds].src = _src.replace(/^/, getHTTP(!0) + ":");
				_src = e[ds].src;
			}
			if (!e[cL].contains(is_active)) {
				e.src = _src;
				e[cL].add(is_active);
				crel(e, {
					"scrolling" : "no",
					"frameborder" : "no",
					"style" : "border:none;",
					"webkitallowfullscreen" : "true",
					"mozallowfullscreen" : "true",
					"allowfullscreen" : "true"
				});
			}
		}
	},
	g = function (e) {
		/*!
		 * true if elem is in same y-axis as the viewport or within 100px of it
		 * @see {@link https://github.com/ryanve/verge}
		 */
		if (verge.inY(e, 100) /* && 0 !== e.offsetHeight */) {
			k(e);
		}
	};
	if (a) {
		console.log("triggered function: manageDataSrcImages");
		a = ctx ? BALA(cls, ctx) || "" : BALA(cls) || "";
		var h_w = function () {
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
		h_w();
		evento.add(w, "scroll", h_w);
		evento.add(w, "resize", h_w);
		evento.add(w, "hashchange", function h_r() {
			evento.remove(w, "scroll", h_w);
			evento.remove(w, "resize", h_w);
			evento.remove(w, "hashchange", h_r);
		});
	}
};
evento.add(window, "load", manageDataSrcIframes.bind(null, ""));
/*!
 * replace iframe src with data-src
 * @param {Object} [ctx] context HTML Element
 */
var manageIframeLightboxLinks = function (ctx) {
	"use strict";
	ctx = ctx || "";
	var d = document,
	gEBCN = "getElementsByClassName",
	cL = "classList",
	linkClass = "iframe-lightbox-link",
	link = ctx ? ctx[gEBCN](linkClass) || "" : d[gEBCN](linkClass) || "",
	isBindedClass = "is-binded",
	arrangeDataSrcIframe = function (e) {
		if (!e[cL].contains(isBindedClass)) {
			e.lightbox = new HDLightbox(e);
			e[cL].add(isBindedClass);
		}
	},
	rerenderDataSrcIframes = function () {
		for (var i = 0, l = link.length; i < l; i += 1) {
			arrangeDataSrcIframe(link[i]);
		}
		/* forEach(link, arrangeDataSrcIframe); */
	};
	if (link) {
		/* console.log("triggered function: manageIframeLightboxLibks"); */
		rerenderDataSrcIframes();
	}
};
docReady(manageIframeLightboxLinks);
/*!
 * add smooth scroll or redirection to static select options
 * @param {Object} [ctx] context HTML Element
 */
var handleStaticSelect = function (_this) {
	"use strict";
	var h = _this.options[_this.selectedIndex].value || "",
	zh = h ? (isValidId(h, !0) ? BALA.one(h) : "") : "";
	if (h) {
		if (zh) {
			scrollToElement(zh);
		} else {
			changeLocation(h);
		}
	}
},
manageStaticSelect = function (ctx) {
	"use strict";
	ctx = ctx || "";
	var cls = "#pages-select",
	a = ctx ? BALA.one(cls, ctx) || "" : BALA.one(cls) || "",
	k = function () {
		evento.add(a, "change", handleStaticSelect.bind(null, a));
	};
	if (a) {
		console.log("triggered function: manageStaticSelect");
		k();
	}
};
evento.add(window, "load", manageStaticSelect.bind(null, ""));
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
var handleExpandingLayers = function (_this) {
	"use strict";
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
manageExpandingLayers = function (ctx) {
	"use strict";
	ctx = ctx || "";
	var w = window,
	cls = ".btn-expand-hidden-layer",
	a = ctx ? BALA.one(cls, ctx) || "" : BALA.one(cls) || "",
	k = function (e) {
		evento.add(e, "click", handleExpandingLayers.bind(null, e));
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
 * init qr-code
 * @see {@link https://stackoverflow.com/questions/12777622/how-to-use-enquire-js}
 */
var generateLocationQrCodeImg = function () {
	"use strict";
	var w = window,
	d = document,
	holder = ".holder-location-qr-code",
	c = BALA.one(holder) || "",
	cls = "qr-code-img",
	u = w.location.href || "",
	cL = "classList",
	m = crel("img"),
	t = d.title ? ("Ссылка на страницу «" + d.title.replace(/\[[^\]]*?\]/g, "").trim() + "»") : "",
	s = getHTTP(!0) + "://chart.googleapis.com/chart?cht=qr&chld=M%7C4&choe=UTF-8&chs=300x300&chl=" + encodeURIComponent(u);
	m.alt = t;
	if (w.QRCode) {
		if ("undefined" !== typeof earlySvgSupport && "svg" === earlySvgSupport) {
			s = QRCode.generateSVG(u, {
					ecclevel: "M",
					fillcolor: "#FFFFFF",
					textcolor: "#191919",
					margin: 4,
					modulesize: 8
				});
			var XMLS = new XMLSerializer();
			s = XMLS.serializeToString(s);
			s = "data:image/svg+xml;base64," + w.btoa(unescape(encodeURIComponent(s)));
			m.src = s;
		} else {
			s = QRCode.generatePNG(u, {
					ecclevel: "M",
					format: "html",
					fillcolor: "#FFFFFF",
					textcolor: "#191919",
					margin: 4,
					modulesize: 8
				});
			m.src = s;
		}
	} else {
		m.src = s;
	}
	m[cL].add(cls);
	m.title = t;
	removeChildren(c);
	appendFragment(m, c);
},
manageLocationQrCodeImage = function () {
	"use strict";
	var w = window,
	holder = ".holder-location-qr-code",
	c = BALA.one(holder) || "",
	u = w.location.href || "";
	if (c && u) {
		console.log("triggered function: manageLocationQrCodeImage");
		if ("undefined" !== typeof getHTTP && getHTTP()) {
			generateLocationQrCodeImg();
		}
	}
},
loadManageLocationQrCodeImg = function () {
	"use strict";
	var w = window,
	js = "../../cdn/qrjs2/0.1.2/js/qrjs2.fixed.min.js";
	if (!scriptIsLoaded(js)) {
		loadJS(js, manageLocationQrCodeImage);
	} else {
		manageLocationQrCodeImage();
	}
};
evento.add(window, "load", loadManageLocationQrCodeImg);
/*!
 * init nav-menu
 */
var initNavMenu = function () {
	"use strict";
	var w = window,
	container = BALA.one("#container") || "",
	page = BALA.one("#page") || "",
	btn = BALA.one(".btn-nav-menu") || "",
	panel = BALA.one(".panel-nav-menu") || "",
	items = BALA("a", panel) || "",
	holder = BALA.one(".holder-panel-menu-more") || "",
	cL = "classList",
	is_active = "is-active",
	p = w.location.href || "",
	r = function () {
		page[cL].remove(is_active);
		panel[cL].remove(is_active);
		btn[cL].remove(is_active);
	},
	f = function () {
		page[cL].add(is_active);
		panel[cL].add(is_active);
		btn[cL].add(is_active);
	},
	t = function () {
		page[cL].toggle(is_active);
		panel[cL].toggle(is_active);
		btn[cL].toggle(is_active);
	},
	h = function () {
		if (holder && holder[cL].contains(is_active)) {
			holder[cL].remove(is_active);
		}
	},
	g = function () {
		var h_container_left = function () {
			console.log("swipeleft");
			h();
			if (panel[cL].contains(is_active)) {
				r();
			}
		},
		h_container_right = function () {
			console.log("swiperight");
			h();
			if (!panel[cL].contains(is_active)) {
				f();
			}
		};
		evento.add(container, "click", h_container_left);
		/* container.onclick = h_container_left; */
		if ("undefined" !== typeof earlyHasTouch && "touch" === earlyHasTouch) {
			evento.add(container, "swipeleft", h_container_left);
			/* container.onswipeleft = h_container_left; */
			evento.add(container, "swiperight", h_container_right);
			/* container.onswiperight = h_container_right; */
		}
	},
	k = function () {
		var h_btn = function (ev) {
			ev.stopPropagation();
			ev.preventDefault();
			h();
			t();
		};
		evento.add(btn, "click", h_btn);
	},
	q = function () {
		h();
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
		var h_e = function () {
			if (panel[cL].contains(is_active)) {
				q();
			}
			s(items);
			n(e);
		};
		evento.add(e, "click", h_e);
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
	var panel = BALA.one(".panel-menu-more") || "",
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
			 * no prevent default and void .href above
			 */
			/* jshint -W107 */
			a.href = "javascript:void(0);";
			/* jshint +W107 */
			evento.add(a, "click", openDeviceBrowser.bind(null, p));
			/* a.onclick = openDeviceBrowser.bind(null, p); */
		}
		crel(li, crel(a, "" + t));
		if (panel.hasChildNodes()) {
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
	holder = BALA.one(".holder-panel-menu-more") || "",
	btn = BALA.one(".btn-menu-more") || "",
	panel = BALA.one(".panel-menu-more") || "",
	items = BALA("li", panel) || "",
	cL = "classList",
	is_active = "is-active",
	h_e = function () {
		holder[cL].remove(is_active);
	},
	g = function (e) {
		evento.add(e, "click", h_e);
	},
	k = function () {
		evento.add(container, "click", h_e);
	},
	q = function () {
		var h_btn = function (ev) {
			ev.stopPropagation();
			ev.preventDefault();
			holder[cL].toggle(is_active);
		};
		evento.add(btn, "click", h_btn);
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
 * init ui-totop
 */
var initUiTotop = function () {
	"use strict";
	var w = window,
	b = BALA.one("body") || "",
	h = BALA.one("html") || "",
	u = "ui-totop",
	is_active = "is-active",
	t = "Наверх",
	cL = "classList",
	k = function (_this) {
		var a = _this.pageYOffset || h.scrollTop || b.scrollTop || "",
		c = _this.innerHeight || h.clientHeight || b.clientHeight || "",
		e = BALA.one("." + u) || "";
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
			scrollToTop();
		},
		a = crel("a");
		a[cL].add(u);
		/* jshint -W107 */
		a.href = "javascript:void(0);";
		/* jshint +W107 */
		a.title = t;
		a[cL].add(u);
		evento.add(a, "click", h_a);
		crel(b, crel(a));
		evento.add(w, "scroll", k.bind(null, w));
	};
	if (b) {
		console.log("triggered function: initUiTotop");
		g();
	}
};
docReady(initUiTotop);
/*!
 * init pluso-engine or ya-share on click
 */
var initPlusoYaShare = function () {
	"use strict";
	var a = BALA.one(".btn-share-buttons") || "",
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
		var h_a = function (ev) {
			ev.stopPropagation();
			ev.preventDefault();
			evento.remove(a, "click", h_a);
			q();
		};
		evento.add(a, "click", h_a);
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
		var h_a = function (ev) {
			ev.stopPropagation();
			ev.preventDefault();
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
			}
		appendFragment(a, b);
		var s1 = function () {
			evento.remove(a, "click", h_a);
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
},
loadInitDownloadAppBtn = function () {
	var s = function () {
		initDownloadAppBtn(8000);
	};
	setAutoClearedTimeout(s, 3000);
};
evento.add(window, "load", loadInitDownloadAppBtn);
/*!
 * init disqus_thread on scroll
 */
var initDisqusOnScroll = function () {
	"use strict";
	var w = window,
	c = BALA.one("#disqus_thread") || "",
	is_active = "is-active",
	btn = BALA.one(".btn-show-disqus") || "",
	p = w.location.href || "",
	cL = "classList",
	ds = "dataset",
	pN = "parentNode",
	n = c ? (c[ds].shortname || "") : "",
	js = getHTTP(!0) + "://" + n + ".disqus.com/embed.js",
	g = function () {
		setStyleDisplayNone(btn);
		c[cL].add(is_active);
		LoadingSpinner.hide();
	},
	k = function () {
		LoadingSpinner.show();
		if (!scriptIsLoaded(js)) {
			loadJS(js, g);
		}
	},
	q = function () {
		var h_btn = function (ev) {
			ev.preventDefault();
			ev.stopPropagation();
			evento.remove(btn, "click", h_btn);
			k();
		};
		evento.add(btn, "click", h_btn);
	},
	v = function () {
		removeChildren(c);
		appendFragment(crel("p", "Комментарии доступны только в веб версии этой страницы."), c);
		c.removeAttribute("id");
		setStyleDisplayNone(btn[pN]);
	};
	if (c && btn && n && p) {
		console.log("triggered function: initDisqusOnScroll");
		if ("undefined" !== typeof getHTTP && getHTTP()) {
			q();
			/* if (!("undefined" !== typeof earlyDeviceSize && "small" === earlyDeviceSize)) {
				var h_w = function () {
					if (fitsIntoViewport(c)) {
						evento.remove(w, "scroll", h_w);
						k();
					}
				};
				evento.add(w, "scroll", h_w);
			} */
		} else {
			v();
		}
	}
};
evento.add(window, "load", initDisqusOnScroll);
/*!
 * init vk-like on click
 */
var manageVKLikeButton = function () {
	"use strict";
	var w = window,
	vk_like = "vk-like",
	c = BALA.one("#" + vk_like) || "",
	a = BALA.one(".btn-show-vk-like") || "",
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
				VK.Widgets.Like(vk_like, {
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
		var h_a = function (ev) {
			ev.stopPropagation();
			ev.preventDefault();
			evento.remove(a, "click", h_a);
			k();
		};
		evento.add(a, "click", h_a);
	};
	if (c && a) {
		console.log("triggered function: manageVKLikeButton");
		if ("undefined" !== typeof getHTTP && getHTTP()) {
			q();
		} else {
			setStyleDisplayNone(a);
		}
	}
};
docReady(manageVKLikeButton);
/*!
 * init Pages Kamil autocomplete
 * @see {@link https://github.com/oss6/kamil/wiki/Example-with-label:link-json-and-typo-correct-suggestion}
 */
var initPagesKamil = function () {
	"use strict";
	var w = window,
	d = document,
	search_form = BALA.one(".search-form") || "",
	id = "#text",
	text = BALA.one(id) || "",
	_ul_id = "kamil-typo-autocomplete",
	_ul_class = "kamil-autocomplete",
	outsideContainer = BALA.one(".container") || "",
	jsn = "../../libs/paper/json/pages.json",
	cL = "classList",
	q = function (r) {
		var jpr = safelyParseJSON(r);
		if (jpr) {
			var ac = new Kamil(id, {
					source: jpr,
					property: "label",
					minChars: 2
				});
			/*!
			 * create typo suggestion list
			 */
			var _ul = crel("ul"),
			_li = crel("li"),
			hideTypoSuggestions = function () {
				setStyleDisplayNone(_ul);
				setStyleDisplayNone(_li);
			},
			showTypoSuggestions = function () {
				setStyleDisplayBlock(_ul);
				setStyleDisplayBlock(_li);
			};
			_ul[cL].add(_ul_class);
			_ul.id = _ul_id;
			hideTypoSuggestions();
			crel(_ul, _li);
			text.parentNode.insertBefore(_ul, text.nextElementSibling);
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
						hideTypoSuggestions();
					}
				};
				if (outsideContainer) {
					evento.add(outsideContainer, "click", hideTypoSuggestions);
				}
				while (l < 1) {
					var v = text.value;
					if (/[^\u0000-\u007f]/.test(v)) {
						v = fixEnRuTypo(v, "ru", "en");
					} else {
						v = fixEnRuTypo(v, "en", "ru");
					}
					showTypoSuggestions();
					removeChildren(_li);
					crel(_li, "" + v);
					evento.add(_li, "click", h_li.bind(null, v));
					if (v.match(/^\s*$/)) {
						hideTypoSuggestions();
					}
					evento.add(text, "input", h_text);
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
			 * unless you specify property option in new Kamil
			 * use kamil built-in word label as search key in JSON file
			 * [{"link":"/","label":"some text to match"},
			 * {"link":"/pages/contents.html","label":"some text to match"}]
			 */
			ac.on("kamilselect", function (e) {
				var p = e.item.link || "",
				sm = function () {
					e.inputElement.value = "";
					hideTypoSuggestions();
					changeLocation(p);
				};
				if (p) {
					/*!
					 * nwjs wont like setImmediate here
					 */
					/* setImmediate(sm); */
					sm();
				}
			});
		}
	},
	v = function () {
		loadUnparsedJSON(jsn, q);
	};
	if (search_form && text) {
		console.log("triggered function: initPagesKamil");
		v();
	}
},
loadInitPagesKamil = function () {
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
 * init search form and ya-site-form
 */
var initSearchForm = function () {
	"use strict";
	var w = window,
	h = BALA.one("html") || "",
	search_form = BALA.one(".search-form") || "",
	ya_site_form = BALA.one(".ya-site-form.ya-site-form_inited_no") || "",
	all_js_src = getHTTP(!0) + "://site.yandex.net/v2.0/js/all.js",
	cL = "classList",
	g = function () {
		search_form.action = getHTTP(!0) + "://yandex.ru/sitesearch";
		search_form.target = "_blank";
	},
	k = function () {
		if (h && !h[cL].contains("ya-page_js_yes")) {
			h[cL].add("ya-page_js_yes");
		}
		/*!
		 * should be onclick attribute
		 */
		crel(ya_site_form, {
			"onclick" : "return {'action':'https://yandex.com/search/site/','arrow':false,'bg':'transparent','fontsize':16,'fg':'#000000','language':'auto','logo':'rb','publicname':'\u041f\u043e\u0438\u0441\u043a \u043f\u043e \u0441\u0430\u0439\u0442\u0443 englishextra.github.io','suggest':true,'target':'_blank','tld':'com','type':3,'usebigdictionary':true,'searchid':2192588,'input_fg':'#363636','input_bg':'#E9E9E9','input_fontStyle':'normal','input_fontWeight':'normal','input_placeholder':'\u041F\u043E\u0438\u0441\u043A','input_placeholderColor':'#686868','input_borderColor':'#E9E9E9'};"
		});
		var f = function () {
			/*!
			 * yandex will load its own css making form visible
			 */
			if (w.Ya) {
				Ya.Site.Form.init();
			}
		};
		if (!scriptIsLoaded(all_js_src)) {
			loadJS(all_js_src, f);
		}
	},
	q = function () {
		search_form.action = "#";
		search_form.target = "_self";
		var h_search_form = function () {
			return !1;
		};
		evento.add(search_form, "submit", h_search_form);
		setStyleDisplayNone(ya_site_form);
	};
	console.log("triggered function: initSearchForm");
	if ("undefined" !== typeof getHTTP && getHTTP()) {
		if (search_form) {
			g();
		}
		if (ya_site_form) {
			k();
		}
	} else {
		q();
	}
};
evento.add(window, "load", initSearchForm);
/*!
 * init manUP.js
 */
var initManUp = function () {
	console.log("triggered function: initManUp");
},
loadInitManUp = function () {
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
	var a = BALA.one("#container") || "";
	console.log("triggered function: showPageFinishProgress");
	setStyleOpacity(a, 1);
	progressBar.complete();
};
evento.add(window, "load", showPageFinishProgress);
