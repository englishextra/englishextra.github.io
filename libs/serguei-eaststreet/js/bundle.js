/*!
 * define global root
 */
/* var globalRoot = "object" === typeof window && window || "object" === typeof self && self || "object" === typeof global && global || {}; */
var globalRoot = "undefined" !== typeof window ? window : this;
/*!
 * safe way to handle console.log
 * @see {@link https://github.com/paulmillr/console-polyfill}
 */
(function(root){"use strict";if(!root.console){root.console={};}var con=root.console;var prop,method;var dummy=function(){};var properties=["memory"];var methods=("assert,clear,count,debug,dir,dirxml,error,exception,group,"+"groupCollapsed,groupEnd,info,log,markTimeline,profile,profiles,profileEnd,"+"show,table,time,timeEnd,timeline,timelineEnd,timeStamp,trace,warn").split(",");while((prop=properties.pop())){if(!con[prop]){con[prop]={};}}while((method=methods.pop())){if(!con[method]){con[method]=dummy;}}}(globalRoot));
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
(function(root){"use strict";var ToProgress=(function(){var TP=function(){var t=function(){var s=document.createElement("fakeelement"),i={transition:"transitionend",OTransition:"oTransitionEnd",MozTransition:"transitionend",WebkitTransition:"webkitTransitionEnd"};for(var j in i){if(i.hasOwnProperty(j)){if(void 0!==s.style[j]){return i[j];}}}},s=function(t,a){if(this.progress=0,this.options={id:"top-progress-bar",color:"#F44336",height:"2px",duration:0.2},t&&"object"===typeof t){for(var i in t){if(t.hasOwnProperty(i)){this.options[i]=t[i];}}}if(this.options.opacityDuration=3*this.options.duration,this.progressBar=document.createElement("div"),this.progressBar.id=this.options.id,this.progressBar.setCSS=function(t){for(var a in t){if(t.hasOwnProperty(a)){this.style[a]=t[a];}}},this.progressBar.setCSS({position:a?"relative":"fixed",top:"0",left:"0",right:"0","background-color":this.options.color,height:this.options.height,width:"0%",transition:"width "+this.options.duration+"s, opacity "+this.options.opacityDuration+"s","-moz-transition":"width "+this.options.duration+"s, opacity "+this.options.opacityDuration+"s","-webkit-transition":"width "+this.options.duration+"s, opacity "+this.options.opacityDuration+"s"}),a){var o=document.querySelector(a);if(o){if(o.hasChildNodes()){o.insertBefore(this.progressBar,o.firstChild);}else{o.appendChild(this.progressBar);}}}else{document.body.appendChild(this.progressBar);}},i=t();return s.prototype.transit=function(){this.progressBar.style.width=this.progress+"%";},s.prototype.getProgress=function(){return this.progress;},s.prototype.setProgress=function(t,s){this.show();this.progress=t>100?100:0>t?0:t;this.transit();if(s){s();}},s.prototype.increase=function(t,s){this.show();this.setProgress(this.progress+t,s);},s.prototype.decrease=function(t,s){this.show();this.setProgress(this.progress-t,s);},s.prototype.finish=function(t){var s=this;this.setProgress(100,t);this.hide();if(i){this.progressBar.addEventListener(i,function(t){s.reset();s.progressBar.removeEventListener(t.type,TP);});}},s.prototype.reset=function(t){this.progress=0;this.transit();if(t){t();}},s.prototype.hide=function(){this.progressBar.style.opacity="0";},s.prototype.show=function(){this.progressBar.style.opacity="1";},s;};return TP();}());root.ToProgress=ToProgress;}(globalRoot));
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
(function(root){"use strict";var zenscroll=(function(){if(typeof root==="undefined"||!("document"in root)){return{};}var createScroller=function(scrollContainer,defaultDuration,edgeOffset){defaultDuration=defaultDuration||999;if(!edgeOffset&&edgeOffset!==0){edgeOffset=9;}var scrollTimeoutId;var setScrollTimeoutId=function(newValue){scrollTimeoutId=newValue;};var docElem=document.documentElement;var nativeSmoothScrollEnabled=function(){return("getComputedStyle"in root)&&root.getComputedStyle(scrollContainer?scrollContainer:document.body)["scroll-behavior"]==="smooth";};var getScrollTop=function(){if(scrollContainer){return scrollContainer.scrollTop;}else{return root.scrollY||docElem.scrollTop;}};var getViewHeight=function(){if(scrollContainer){return Math.min(scrollContainer.offsetHeight,root.innerHeight);}else{return root.innerHeight||docElem.clientHeight;}};var getRelativeTopOf=function(elem){if(scrollContainer){return elem.offsetTop;}else{return elem.getBoundingClientRect().top+getScrollTop()-docElem.offsetTop;}};var stopScroll=function(){clearTimeout(scrollTimeoutId);setScrollTimeoutId(0);};var scrollToY=function(endY,duration,onDone){stopScroll();if(nativeSmoothScrollEnabled()){(scrollContainer||root).scrollTo(0,endY);if(onDone){onDone();}}else{var startY=getScrollTop();var distance=Math.max(endY,0)-startY;duration=duration||Math.min(Math.abs(distance),defaultDuration);var startTime=new Date().getTime();(function loopScroll(){setScrollTimeoutId(setTimeout(function(){var p=Math.min((new Date().getTime()-startTime)/duration,1);var y=Math.max(Math.floor(startY+distance*(p<0.5?2*p*p:p*(4-p*2)-1)),0);if(scrollContainer){scrollContainer.scrollTop=y;}else{root.scrollTo(0,y);}if(p<1&&(getViewHeight()+y)<(scrollContainer||docElem).scrollHeight){loopScroll();}else{setTimeout(stopScroll,99);if(onDone){onDone();}}},9));})();}};var scrollToElem=function(elem,duration,onDone){scrollToY(getRelativeTopOf(elem)-edgeOffset,duration,onDone);};var scrollIntoView=function(elem,duration,onDone){var elemHeight=elem.getBoundingClientRect().height;var elemTop=getRelativeTopOf(elem);var elemBottom=elemTop+elemHeight;var containerHeight=getViewHeight();var containerTop=getScrollTop();var containerBottom=containerTop+containerHeight;if((elemTop-edgeOffset)<containerTop||(elemHeight+edgeOffset)>containerHeight){scrollToElem(elem,duration,onDone);}else if((elemBottom+edgeOffset)>containerBottom){scrollToY(elemBottom-containerHeight+edgeOffset,duration,onDone);}else if(onDone){onDone();}};var scrollToCenterOf=function(elem,duration,offset,onDone){scrollToY(Math.max(getRelativeTopOf(elem)-getViewHeight()/2+(offset||elem.getBoundingClientRect().height/2),0),duration,onDone);};var setup=function(newDefaultDuration,newEdgeOffset){if(newDefaultDuration){defaultDuration=newDefaultDuration;}if(newEdgeOffset===0||newEdgeOffset){edgeOffset=newEdgeOffset;}};return{setup:setup,to:scrollToElem,toY:scrollToY,intoView:scrollIntoView,center:scrollToCenterOf,stop:stopScroll,moving:function(){return!!scrollTimeoutId;}};};var defaultScroller=createScroller();if("addEventListener"in root&&document.body.style.scrollBehavior!=="smooth"&&!root.noZensmooth){var replaceUrl=function(hash){try{history.replaceState({},"",root.location.href.split("#")[0]+hash);}catch(e){}};root.addEventListener("click",function(event){var anchor=event.target;while(anchor&&anchor.tagName!=="A"){anchor=anchor.parentNode;}if(!anchor||event.which!==1||event.shiftKey||event.metaKey||event.ctrlKey||event.altKey){return;}var href=anchor.getAttribute("href")||"";if(href.indexOf("#")===0){if(href==="#"){event.preventDefault();defaultScroller.toY(0);replaceUrl("");}else{var targetId=anchor.hash.substring(1);var targetElem=document.getElementById(targetId);if(targetElem){event.preventDefault();defaultScroller.to(targetElem);replaceUrl("#"+targetId);}}}},false);}return{createScroller:createScroller,setup:defaultScroller.setup,to:defaultScroller.to,toY:defaultScroller.toY,intoView:defaultScroller.intoView,center:defaultScroller.stop,moving:defaultScroller.moving};}());root.zenscroll=zenscroll;}(globalRoot));
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
(function(root){"use strict";var BALA=(function(){var g=(function(document,s_addEventListener,s_querySelectorAll){function g(s,context,bala){bala=Object.create(g.fn);if(s){bala.push.apply(bala,s[s_addEventListener]?[s]:""+s===s?/</.test(s)?((context=document.createElement(context||s_addEventListener)).innerHTML=s,context.children):context?((context=g(context)[0])?context[s_querySelectorAll](s):bala):document[s_querySelectorAll](s):typeof s==="function"?document.readyState[7]?s():document[s_addEventListener]('DOMContentLoaded',s):s);}return bala;}g.fn=[];g.one=function(s,context){return g(s,context)[0]||null;};return g;})(document,'addEventListener','querySelectorAll');return g;}());root.BALA=BALA;}(globalRoot));
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
(function(root){"use strict";var crel=(function(){var fn="function",obj="object",nodeType="nodeType",textContent="textContent",setAttribute="setAttribute",attrMapString="attrMap",isNodeString="isNode",isElementString="isElement",d=typeof document===obj?document:{},isType=function(a,type){return typeof a===type;},isNode=typeof Node===fn?function(object){return object instanceof Node;}:function(object){return object&&isType(object,obj)&&(nodeType in object)&&isType(object.ownerDocument,obj);},isElement=function(object){return _c[isNodeString](object)&&object[nodeType]===1;},isArray=function(a){return a instanceof Array;},appendChild=function(element,child){if(!_c[isNodeString](child)){child=d.createTextNode(child);}element.appendChild(child);};function _c(){var args=arguments,element=args[0],child,settings=args[1],childIndex=2,argumentsLength=args.length,attributeMap=_c[attrMapString];element=_c[isElementString](element)?element:d.createElement(element);if(argumentsLength===1){return element;}if(!isType(settings,obj)||_c[isNodeString](settings)||isArray(settings)){--childIndex;settings=null;}if((argumentsLength-childIndex)===1&&isType(args[childIndex],"string")&&element[textContent]!==undefined){element[textContent]=args[childIndex];}else{for(;childIndex<argumentsLength;++childIndex){child=args[childIndex];if(child===null){continue;}if(isArray(child)){for(var i=0;i<child.length;++i){appendChild(element,child[i]);}}else{appendChild(element,child);}}}for(var key in settings){if(settings.hasOwnProperty(key)){if(!attributeMap[key]){element[setAttribute](key,settings[key]);}else{var attr=attributeMap[key];if(typeof attr===fn){attr(element,settings[key]);}else{element[setAttribute](attr,settings[key]);}}}}return element;}_c[attrMapString]={};_c[isElementString]=isElement;_c[isNodeString]=isNode;if("undefined"!==typeof Proxy){_c.proxy=new Proxy(_c,{get:function(target,key){if(!(key in _c)){_c[key]=_c.bind(null,key);}return _c[key];}});}return _c;})();root.crel=crel;}(globalRoot));
/*!
 * Super lightweight script (~1kb) to detect via Javascript events like
 * 'tap' 'dbltap' "swipeup" "swipedown" "swipeleft" "swiperight"
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
(function(doc,win){"use strict";if(typeof doc.createEvent!=="function"){return false;}var pointerEventSupport=function(type){var lo=type.toLowerCase(),ms="MS"+type;return navigator.msPointerEnabled?ms:win.PointerEvent?lo:false;},defaults={useJquery:!win.IGNORE_JQUERY&&typeof jQuery!=="undefined",swipeThreshold:win.SWIPE_THRESHOLD||100,tapThreshold:win.TAP_THRESHOLD||150,dbltapThreshold:win.DBL_TAP_THRESHOLD||200,longtapThreshold:win.LONG_TAP_THRESHOLD||1000,tapPrecision:win.TAP_PRECISION/2||60/2,justTouchEvents:win.JUST_ON_TOUCH_DEVICES},wasTouch=false,touchevents={touchstart:pointerEventSupport("PointerDown")||"touchstart",touchend:pointerEventSupport("PointerUp")||"touchend",touchmove:pointerEventSupport("PointerMove")||"touchmove"},isTheSameFingerId=function(e){return!e.pointerId||typeof pointerId==="undefined"||e.pointerId===pointerId;},setListener=function(elm,events,callback){var eventsArray=events.split(' '),i=eventsArray.length;while(i--){elm.addEventListener(eventsArray[i],callback,false);}},getPointerEvent=function(event){return event.targetTouches?event.targetTouches[0]:event;},getTimestamp=function(){return new Date().getTime();},sendEvent=function(elm,eventName,originalEvent,data){var customEvent=doc.createEvent("Event");customEvent.originalEvent=originalEvent;data=data||{};data.x=currX;data.y=currY;data.distance=data.distance;if(defaults.useJquery){customEvent=jQuery.Event(eventName,{originalEvent:originalEvent});jQuery(elm).trigger(customEvent,data);}if(customEvent.initEvent){for(var key in data){if(data.hasOwnProperty(key)){customEvent[key]=data[key];}}customEvent.initEvent(eventName,true,true);elm.dispatchEvent(customEvent);}while(elm){if(elm["on"+eventName])elm["on"+eventName](customEvent);elm=elm.parentNode;}},onTouchStart=function(e){if(!isTheSameFingerId(e))return;pointerId=e.pointerId;if(e.type!=="mousedown")wasTouch=true;if(e.type==="mousedown"&&wasTouch)return;var pointer=getPointerEvent(e);cachedX=currX=pointer.pageX;cachedY=currY=pointer.pageY;longtapTimer=setTimeout(function(){sendEvent(e.target,"longtap",e);target=e.target;},defaults.longtapThreshold);timestamp=getTimestamp();tapNum++;},onTouchEnd=function(e){if(!isTheSameFingerId(e))return;pointerId=undefined;if(e.type==="mouseup"&&wasTouch){wasTouch=false;return;}var eventsArr=[],now=getTimestamp(),deltaY=cachedY-currY,deltaX=cachedX-currX;clearTimeout(dblTapTimer);clearTimeout(longtapTimer);if(deltaX<=-defaults.swipeThreshold)eventsArr.push("swiperight");if(deltaX>=defaults.swipeThreshold)eventsArr.push("swipeleft");if(deltaY<=-defaults.swipeThreshold)eventsArr.push("swipedown");if(deltaY>=defaults.swipeThreshold)eventsArr.push("swipeup");if(eventsArr.length){for(var i=0;i<eventsArr.length;i++){var eventName=eventsArr[i];sendEvent(e.target,eventName,e,{distance:{x:Math.abs(deltaX),y:Math.abs(deltaY)}});}tapNum=0;}else{if(cachedX>=currX-defaults.tapPrecision&&cachedX<=currX+defaults.tapPrecision&&cachedY>=currY-defaults.tapPrecision&&cachedY<=currY+defaults.tapPrecision){if(timestamp+defaults.tapThreshold-now>=0){sendEvent(e.target,tapNum>=2&&target===e.target?"dbltap":"tap",e);target=e.target;}}dblTapTimer=setTimeout(function(){tapNum=0;},defaults.dbltapThreshold);}},onTouchMove=function(e){if(!isTheSameFingerId(e))return;if(e.type==="mousemove"&&wasTouch)return;var pointer=getPointerEvent(e);currX=pointer.pageX;currY=pointer.pageY;},tapNum=0,pointerId,currX,currY,cachedX,cachedY,timestamp,target,dblTapTimer,longtapTimer;setListener(doc,touchevents.touchstart+(defaults.justTouchEvents?"":" mousedown"),onTouchStart);setListener(doc,touchevents.touchend+(defaults.justTouchEvents?"":" mouseup"),onTouchEnd);setListener(doc,touchevents.touchmove+(defaults.justTouchEvents?"":" mousemove"),onTouchMove);win.tocca=function(options){for(var opt in options){if(options.hasOwnProperty(opt)){defaults[opt]=options[opt];}}return defaults;};}(document,globalRoot));
/*!
 * modified routie - a tiny hash router - v0.3.2
 * @see {@link https://github.com/jgallen23/routie/blob/master/dist/routie.js}
 * projects.jga.me/routie
 * copyright Greg Allen 2013
 * MIT License
 * "#" => ""
 * "#/" => "/" wont trigger anything? {@link https://github.com/jgallen23/routie/issues/49}
 * "#/home" => "/home"
 * routie({"/contents": function () {},"/feedback": function () {};};
 * routie.navigate("/somepage");
 * in navigate method setImmediate with setTimeout fallback
 * fixed The body of a for in should be wrapped in an if statement to filter unwanted properties from the prototype.
 * @see {@link https://github.com/jgallen23/routie/blob/master/dist/routie.js}
 * passes jshint
 */
(function(root){"use strict";var routie=(function(){var w=root;var routes=[];var map={};var reference="routie";var oldReference=w[reference];var Route=function(path,name){this.name=name;this.path=path;this.keys=[];this.fns=[];this.params={};this.regex=pathToRegexp(this.path,this.keys,false,false);};Route.prototype.addHandler=function(fn){this.fns.push(fn);};Route.prototype.removeHandler=function(fn){for(var i=0,c=this.fns.length;i<c;i++){var f=this.fns[i];if(fn===f){this.fns.splice(i,1);return;}}};Route.prototype.run=function(params){for(var i=0,c=this.fns.length;i<c;i++){this.fns[i].apply(this,params);}};Route.prototype.match=function(path,params){var m=this.regex.exec(path);if(!m){return false;}for(var i=1,len=m.length;i<len;++i){var key=this.keys[i-1];var val=("string"==typeof m[i])?decodeURIComponent(m[i]):m[i];if(key){this.params[key.name]=val;}params.push(val);}return true;};Route.prototype.toURL=function(params){var path=this.path;for(var param in params){if(params.hasOwnProperty(param)){path=path.replace('/:'+param,'/'+params[param]);}}path=path.replace(/\/:.*\?/g,'/').replace(/\?/g,'');if(path.indexOf(':')!=-1){throw new Error('missing parameters for url: '+path);}return path;};var pathToRegexp=function(path,keys,sensitive,strict){if(path instanceof RegExp){return path;}if(path instanceof Array){path='('+path.join('|')+')';}path=path.concat(strict?'':'/?').replace(/\/\(/g,'(?:/').replace(/\+/g,'__plus__').replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?/g,function(_,slash,format,key,capture,optional){keys.push({name:key,optional:!!optional});slash=slash||'';return''+(optional?'':slash)+'(?:'+(optional?slash:'')+(format||'')+(capture||(format&&'([^/.]+?)'||'([^/]+?)'))+')'+(optional||'');}).replace(/([\/.])/g,'\\$1').replace(/__plus__/g,'(.+)').replace(/\*/g,'(.*)');return new RegExp('^'+path+'$',sensitive?'':'i');};var addHandler=function(path,fn){var s=path.split(' ');var name=(s.length===2)?s[0]:null;path=(s.length===2)?s[1]:s[0];if(!map[path]){map[path]=new Route(path,name);routes.push(map[path]);}map[path].addHandler(fn);};var _r=function(path,fn){if(typeof fn==="function"){addHandler(path,fn);_r.reload();}else if(typeof path==="object"){for(var p in path){if(path.hasOwnProperty(p)){addHandler(p,path[p]);}}_r.reload();}else if(typeof fn==="undefined"){_r.navigate(path);}};_r.lookup=function(name,obj){for(var i=0,c=routes.length;i<c;i++){var route=routes[i];if(route.name===name){return route.toURL(obj);}}};_r.remove=function(path,fn){var route=map[path];if(!route){return;}route.removeHandler(fn);};_r.removeAll=function(){map={};routes=[];};_r.navigate=function(path,options){options=options||{};var silent=options.silent||false;if(silent){removeListener();}setTimeout(function(){root.location.hash=path;if(silent){setTimeout(function(){addListener();},1);}},1);if(root.setImmediate){setImmediate(function(){root.location.hash=path;if(silent){setImmediate(function(){addListener();});}});}else{setTimeout(function(){root.location.hash=path;if(silent){setTimeout(function(){addListener();},1);}},1);}};_r.noConflict=function(){w[reference]=oldReference;return _r;};var getHash=function(){return root.location.hash.substring(1);};var checkRoute=function(hash,route){var params=[];if(route.match(hash,params)){route.run(params);return true;}return false;};var hashChanged=_r.reload=function(){var hash=getHash();for(var i=0,c=routes.length;i<c;i++){var route=routes[i];if(checkRoute(hash,route)){return;}}};var addListener=function(){if(w.addEventListener){w.addEventListener('hashchange',hashChanged,false);}else{w.attachEvent('onhashchange',hashChanged);}};var removeListener=function(){if(w.removeEventListener){w.removeEventListener('hashchange',hashChanged);}else{w.detachEvent('onhashchange',hashChanged);}};addListener();return _r;}());root.routie=routie;}(globalRoot));
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
(function(root){"use strict";var Cookies=(function(){function extend(){var i=0;var result={};for(;i<arguments.length;i++){var attributes=arguments[i];for(var key in attributes){if(attributes.hasOwnProperty(key)){result[key]=attributes[key];}}}return result;}function init(converter){var api=function(key,value,attributes){var _this=this;var result;if(typeof document==="undefined"){return;}if(arguments.length>1){attributes=extend({path:'/'},api.defaults,attributes);if(typeof attributes.expires==="number"){var expires=new Date();expires.setMilliseconds(expires.getMilliseconds()+attributes.expires*864e+5);attributes.expires=expires;}try{result=JSON.stringify(value);if(/^[\{\[]/.test(result)){value=result;}}catch(e){}if(!converter.write){value=encodeURIComponent(String(value)).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g,decodeURIComponent);}else{value=converter.write(value,key);}key=encodeURIComponent(String(key));key=key.replace(/%(23|24|26|2B|5E|60|7C)/g,decodeURIComponent);key=key.replace(/[\(\)]/g,escape);var ret=(document.cookie=[key,'=',value,attributes.expires?'; expires='+attributes.expires.toUTCString():'',attributes.path?'; path='+attributes.path:'',attributes.domain?'; domain='+attributes.domain:'',attributes.secure?'; secure':''].join(''));return ret;}if(!key){result={};}var cookies=document.cookie?document.cookie.split('; '):[];var rdecode=/(%[0-9A-Z]{2})+/g;var i=0;for(;i<cookies.length;i++){var parts=cookies[i].split('=');var cookie=parts.slice(1).join('=');if(cookie.charAt(0)==='"'){cookie=cookie.slice(1,-1);}try{var name=parts[0].replace(rdecode,decodeURIComponent);cookie=converter.read?converter.read(cookie,name):converter(cookie,name)||cookie.replace(rdecode,decodeURIComponent);if(_this.json){try{cookie=JSON.parse(cookie);}catch(e){}}if(key===name){result=cookie;break;}if(!key){result[name]=cookie;}}catch(e){}}return result;};api.set=api;api.get=function(key){return api.call(api,key);};api.getJSON=function(){return api.apply({json:true},[].slice.call(arguments));};api.defaults={};api.remove=function(key,attributes){api(key,'',extend(attributes,{expires:-1}));};api.withConverter=init;return api;}return init(function(){});}());root.Cookies=Cookies;}(globalRoot));
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
(function(root){"use strict";var verge=(function(){var xports={},win=typeof root!=="undefined"&&root,doc=typeof document!=="undefined"&&document,docElem=doc&&doc.documentElement,matchMedia=win.matchMedia||win.msMatchMedia,mq=matchMedia?function(q){return!!matchMedia.call(win,q).matches;}:function(){return false;},viewportW=xports.viewportW=function(){var a=docElem.clientWidth,b=win.innerWidth;return a<b?b:a;},viewportH=xports.viewportH=function(){var a=docElem.clientHeight,b=win.innerHeight;return a<b?b:a;};xports.mq=mq;xports.matchMedia=matchMedia?function(){return matchMedia.apply(win,arguments);}:function(){return{};};function viewport(){return{"width":viewportW(),"height":viewportH()};}xports.viewport=viewport;xports.scrollX=function(){return win.pageXOffset||docElem.scrollLeft;};xports.scrollY=function(){return win.pageYOffset||docElem.scrollTop;};function calibrate(coords,cushion){var o={};cushion=+cushion||0;o.width=(o.right=coords.right+cushion)-(o.left=coords.left-cushion);o.height=(o.bottom=coords.bottom+cushion)-(o.top=coords.top-cushion);return o;}function rectangle(el,cushion){el=el&&!el.nodeType?el[0]:el;if(!el||1!==el.nodeType){return false;}return calibrate(el.getBoundingClientRect(),cushion);}xports.rectangle=rectangle;function aspect(o){o=null===o?viewport():1===o.nodeType?rectangle(o):o;var h=o.height,w=o.width;h=typeof h==="function"?h.call(o):h;w=typeof w==="function"?w.call(o):w;return w/h;}xports.aspect=aspect;xports.inX=function(el,cushion){var r=rectangle(el,cushion);return!!r&&r.right>=0&&r.left<=viewportW()&&(0!==el.offsetHeight);};xports.inY=function(el,cushion){var r=rectangle(el,cushion);return!!r&&r.bottom>=0&&r.top<=viewportH()&&(0!==el.offsetHeight);};xports.inViewport=function(el,cushion){var r=rectangle(el,cushion);return!!r&&r.bottom>=0&&r.right>=0&&r.top<=viewportH()&&r.left<=viewportW()&&(0!==el.offsetHeight);};return xports;}());root.verge=verge;}(globalRoot));
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
(function(root){"use strict";var imagePromise=function(s){if(root.Promise){return new Promise(function(y,n){var f=function(e,p){e.onload=function(){y(p);};e.onerror=function(){n(p);};e.src=p;};if("string"===typeof s){var a=new Image();f(a,s);}else{if("img"!==s.tagName){return Promise.reject();}else{if(s.src){f(s,s.src);}}}});}else{throw new Error("Promise is not in global object");}};(globalRoot).imagePromise=imagePromise;}(globalRoot));
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
(function(root,selectors){"use strict";var orientation,size,f=function(a){var b=a.split(" ");if(selectors){for(var c=0;c<b.length;c+=1){a=b[c];selectors.add(a);}}},g=function(a){var b=a.split(" ");if(selectors){for(var c=0;c<b.length;c+=1){a=b[c];selectors.remove(a);}}},h={landscape:"all and (orientation:landscape)",portrait:"all and (orientation:portrait)"},k={small:"all and (max-width:768px)",medium:"all and (min-width:768px) and (max-width:991px)",large:"all and (min-width:992px)"},d,mM="matchMedia",m="matches",o=function(a,b){var c=function(a){if(a[m]){f(b);orientation=b;}else{g(b);}};c(a);a.addListener(c);},s=function(a,b){var c=function(a){if(a[m]){f(b);size=b;}else{g(b);}};c(a);a.addListener(c);};for(d in h){if(h.hasOwnProperty(d)){o(root[mM](h[d]),d);}}for(d in k){if(k.hasOwnProperty(d)){s(root[mM](k[d]),d);}}root.earlyDeviceOrientation=orientation||"";root.earlyDeviceSize=size||"";}(globalRoot,document.documentElement.classList||""));
/*!
 * add mobile or desktop class
 * using Detect Mobile Browsers | Open source mobile phone detection
 * Regex updated: 1 August 2014
 * detectmobilebrowsers.com
 * @see {@link https://github.com/heikojansen/plack-middleware-detectmobilebrowsers}
 */
(function(root,html,mobile,desktop,opera){"use strict";var selector=(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i).test(opera)||(/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i).test(opera.substr(0,4))?mobile:desktop;if(html){html.classList.add(selector);}root.earlyDeviceType=selector||"";}(globalRoot,document.documentElement||"","mobile","desktop",navigator.userAgent||navigator.vendor||globalRoot.opera));
/*!
 * add svg support class
 */
(function(root,html,selector){"use strict";selector=document.implementation.hasFeature("http://www.w3.org/2000/svg","1.1")?selector:"no-"+selector;if(html){html.classList.add(selector);}root.earlySvgSupport=selector||"";}(globalRoot,document.documentElement||"","svg"));
/*!
 * add svgasimg support class
 */
(function(root,html,selector){"use strict";selector=document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image","1.1")?selector:"no-"+selector;if(html){html.classList.add(selector);}root.earlySvgasimgSupport=selector||"";}(globalRoot,document.documentElement||"","svgasimg"));
/*!
 * add touch support class
 * @see {@link https://gist.github.com/englishextra/3cb22aab31a52b6760b5921e4fe8db95}
 * @see {@link https://jsfiddle.net/englishextra/z5xhjde8/}
 */
(function(root,html,selector){"use strict";selector="ontouchstart"in html?selector:"no-"+selector;if(html){html.classList.add(selector);}root.earlyHasTouch=selector||"";}(globalRoot,document.documentElement||"","touch"));
/*!
 * return date in YYYY-MM-DD format
 */
(function(root){"use strict";var newDate=(new Date()),newDay=newDate.getDate(),newYear=newDate.getFullYear(),newMonth=newDate.getMonth();(newMonth+=1);if(10>newDay){newDay="0"+newDay;}if(10>newMonth){newMonth="0"+newMonth;}root.earlyFnGetYyyymmdd=newYear+"-"+newMonth+"-"+newDay;}(globalRoot));
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
(function(root){"use strict";root.forEach=function(arr,eachFn,doneFn){var i=-1;var len=(function(val){val=+val;if(!isFinite(val)||!val){return 0;}return(function(left,right){return left-right*Math.floor(left/right);}(Math.floor(val),Math.pow(2,32)));}(arr.length));(function next(result){var async;var abort=result===false;do{++i;}while(!(i in arr)&&i!==len);if(abort||i===len){if(doneFn){doneFn(!abort,arr);}return;}result=eachFn.call({async:function(){async=true;return next;}},arr[i],i,arr);if(!async){next(result);}}());};}(globalRoot));
/*!
 * Timer management (setInterval / setTimeout)
 * @param {Function} fn
 * @param {Number} ms
 * var timers = new Timers();
 * timers.timeout(function () {
 * console.log("before:", timers);
 * timers.clear();
 * timers = null;
 * doSomething();
 * console.log("after:", timers);
 * }, 3000);
 * @see {@link https://github.com/component/timers}
 * @see {@link https://github.com/component/timers/blob/master/index.js}
 * passes jshint
 */
(function(root){var Timers=function(ids){this.ids=ids||[];};Timers.prototype.timeout=function(fn,ms){var id=setTimeout(fn,ms);this.ids.push(id);return id;};Timers.prototype.interval=function(fn,ms){var id=setInterval(fn,ms);this.ids.push(id);return id;};Timers.prototype.clear=function(){this.ids.forEach(clearTimeout);this.ids=[];};root.Timers=Timers;}(globalRoot));
/*!
 * modified Returns a function, that, as long as it continues to be invoked, will not
 * be triggered. The function will be called after it stops being called for
 * N milliseconds. If `immediate` is passed, trigger the function on the
 * leading edge, instead of the trailing. The function also has a property 'clear'
 * that is a function which will clear the timer to prevent previously scheduled executions.
 * @source underscore.js
 * @see http://unscriptable.com/2009/03/20/debouncing-javascript-methods/
 * @param {Function} function to wrap
 * @param {Number} timeout in ms (`100`)
 * @param {Boolean} whether to execute at the beginning (`false`)
 * @api public
 * @see {@link https://github.com/component/debounce/blob/master/index.js}
 * passes jshint
 */
(function(root,undefined){var debounce=function(func,wait,immediate){var timeout,args,context,timestamp,result;if(undefined===wait||null===wait){wait=100;}function later(){var last=Date.now()-timestamp;if(last<wait&&last>=0){timeout=setTimeout(later,wait-last);}else{timeout=null;if(!immediate){result=func.apply(context,args);context=args=null;}}}var debounced=function(){context=this;args=arguments;timestamp=Date.now();var callNow=immediate&&!timeout;if(!timeout)timeout=setTimeout(later,wait);if(callNow){result=func.apply(context,args);context=args=null;}return result;};debounced.clear=function(){if(timeout){clearTimeout(timeout);timeout=null;}};debounced.flush=function(){if(timeout){result=func.apply(context,args);context=args=null;clearTimeout(timeout);timeout=null;}};return debounced;};root.debounce=debounce;}(globalRoot));
/*!
 * modified Returns a new function that, when invoked, invokes `func` at most once per `wait` milliseconds.
 * @param {Function} func Function to wrap.
 * @param {Number} wait Number of milliseconds that must elapse between `func` invocations.
 * @return {Function} A new function that wraps the `func` function passed in.
 * @see {@link https://github.com/component/throttle/blob/master/index.js}
 * passes jshint
 */
(function(root,undefined){var throttle=function(func,wait){var ctx,args,rtn,timeoutID;var last=0;return function throttled(){ctx=this;args=arguments;var delta=new Date()-last;if(!timeoutID)if(delta>=wait)call();else timeoutID=setTimeout(call,wait-delta);return rtn;};function call(){timeoutID=0;last=+new Date();rtn=func.apply(ctx,args);ctx=null;args=null;}};root.throttle=throttle;}(globalRoot));
/*!
 * A simple promise-compatible "document ready" event handler with a few extra treats.
 * With browserify/webpack:
 * const ready = require('document-ready-promise')
 * ready().then(function(){})
 * If in a non-commonjs environment, just include the script. It will attach document.ready for you.
 * document.ready().then(function() {})
 * The document.ready promise will preserve any values that you may be passing through the promise chain.
 * Using ES2015 and fetch
 * fetch(new Request('kitten.jpg'))
 * .then(response => response.blob())
 * .then(document.ready)
 * .then(blob => document.querySelector("img").src = URL.createObjectURL(blob))
 * @see {@link https://github.com/michealparks/document-ready-promise}
 * @see {@link https://github.com/michealparks/document-ready-promise/blob/master/document-ready-promise.js}
 * passes jshint
 */
(function(document,promise){document.ready=promise;}(globalRoot.document,function(chainVal){"use strict";var d=document,w=globalRoot,loaded=(/^loaded|^i|^c/).test(d.readyState),DOMContentLoaded="DOMContentLoaded",load="load";return new Promise(function(resolve){if(loaded){return resolve(chainVal);}function onReady(){resolve(chainVal);d.removeEventListener(DOMContentLoaded,onReady);w.removeEventListener(load,onReady);}d.addEventListener(DOMContentLoaded,onReady);w.addEventListener(load,onReady);});}));
/*!
 * insert External HTML
 * @param {String} id Target Element id
 * @param {String} url path string
 * @param {Object} [callback] callback function
 * @param {Object} [onerror] on error callback function
 * insertExternalHTML(selector,url,callback,onerror)
 */
(function(root){"use strict";var insertExternalHTML=function(id,url,callback,onerror){var d=document,b=d.body||"",gEBI="getElementById",cN="cloneNode",aC="appendChild",pN="parentNode",iH="innerHTML",rC="replaceChild",cR="createRange",cCF="createContextualFragment",cDF="createDocumentFragment",container=d[gEBI](id.replace(/^#/,""))||"",cb=function(){return callback&&"function"===typeof callback&&callback();},arrange=function(frag){try{var clonedContainer=container[cN](!1);if(d[cR]){var rg=d[cR]();rg.selectNode(b);var df=rg[cCF](frag);clonedContainer[aC](df);return container[pN]?container[pN][rC](clonedContainer,container):container[iH]=frag,cb();}else{clonedContainer[iH]=frag;return container[pN]?container[pN][rC](d[cDF][aC](clonedContainer),container):container[iH]=frag,cb();}}catch(e){console.log(e);}return!1;},init=function(){if(root.Promise&&root.fetch&&!root.chrome&&!("undefined"!==typeof root&&root.process&&"renderer"===root.process.type)){fetch(url).then(function(response){if(!response.ok){if(onerror&&"function"===typeof onerror){onerror();}else{throw new Error(response.statusText);}}return response;}).then(function(response){return response.text();}).then(function(text){arrange(text);}).catch(function(err){console.log("Error fetch-ing file "+url,err);});}else{var x=root.XMLHttpRequest?new XMLHttpRequest():new ActiveXObject("Microsoft.XMLHTTP");x.overrideMimeType("text/html;charset=utf-8");x.open("GET",url,!0);x.withCredentials=!1;x.onreadystatechange=function(){if(x.status==="404"||x.status===0){console.log("Error XMLHttpRequest-ing file",x.status);return onerror&&"function"===typeof onerror&&onerror();}else if(x.readyState===4&&x.status===200&&x.responseText){arrange(x.responseText);}};x.send(null);}};if(container){init();}};root.insertExternalHTML=insertExternalHTML;}(globalRoot));
/*!
 * How can I check if a JS file has been included already?
 * @see {@link https://gist.github.com/englishextra/403a0ca44fc5f495400ed0e20bc51d47}
 * @see {@link https://stackoverflow.com/questions/18155347/how-can-i-check-if-a-js-file-has-been-included-already}
 * @param {String} s path string
 * scriptIsLoaded(s)
 */
(function(root){"use strict";var scriptIsLoaded=function(s){for(var b=document.getElementsByTagName("script")||"",a=0;a<b.length;a+=1){if(b[a].getAttribute("src")===s){return!0;}}return!1;};root.scriptIsLoaded=scriptIsLoaded;}(globalRoot));
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
 * loadTriggerJS(url,callback,onerror)
 */
(function(root){"use strict";var loadTriggerJS=function(url,callback,onerror){var cb=function(string){return callback&&"function"===typeof callback&&callback(string);},fn=function(string){try{var Fn=Function;new Fn(""+string).call(root);}catch(err){throw new Error("Error evaluating file "+url,err);}};if(root.Promise&&root.fetch&&!root.chrome&&!("undefined"!==typeof root&&root.process&&"renderer"===root.process.type)){fetch(url).then(function(response){if(!response.ok){if(onerror&&"function"===typeof onerror){onerror();}else{throw new Error(response.statusText);}}return response;}).then(function(response){return response.text();}).then(function(text){fn(text);cb(text);}).catch(function(err){console.log("Error fetch-ing file "+url,err);});}else{var x=root.XMLHttpRequest?new XMLHttpRequest():new ActiveXObject("Microsoft.XMLHTTP");x.overrideMimeType("application/javascript;charset=utf-8");x.open("GET",url,!0);x.withCredentials=!1;x.onreadystatechange=function(){if(x.status==="404"||x.status===0){console.log("Error XMLHttpRequest-ing file "+url,x.status);return onerror&&"function"===typeof onerror&&onerror();}else if(x.readyState===4&&x.status===200&&x.responseText){fn(x.responseText);cb(x.responseText);}};x.send(null);}};root.loadTriggerJS=loadTriggerJS;}(globalRoot));
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
(function(root){"use strict";var loadUnparsedJSON=function(url,callback,onerror){var cb=function(string){return callback&&"function"===typeof callback&&callback(string);};if(root.Promise&&root.fetch&&!root.chrome&&!("undefined"!==typeof root&&root.process&&"renderer"===root.process.type)){fetch(url).then(function(response){if(!response.ok){if(onerror&&"function"===typeof onerror){onerror();}else{throw new Error(response.statusText);}}return response;}).then(function(response){return response.text();}).then(function(text){cb(text);}).catch(function(err){console.log("Error fetch-ing file "+url,err);});}else{var x=root.XMLHttpRequest?new XMLHttpRequest():new ActiveXObject("Microsoft.XMLHTTP");x.overrideMimeType("application/json;charset=utf-8");x.open("GET",url,!0);x.withCredentials=!1;x.onreadystatechange=function(){if(x.status==="404"||x.status===0){console.log("Error XMLHttpRequest-ing file",x.status);return onerror&&"function"===typeof onerror&&onerror();}else if(x.readyState===4&&x.status===200&&x.responseText){cb(x.responseText);}};x.send(null);}};root.loadUnparsedJSON=loadUnparsedJSON;}(globalRoot));
/*!
 * parse JSON without try / catch
 * @param {String} a JSON string
 * @see {@link http://stackoverflow.com/questions/11182924/how-to-check-if-javascript-object-is-json}
 * safelyParseJSON(a)
 */
(function(root){"use strict";var safelyParseJSON=function(a){var isJson=function(obj){var t=typeof obj;return['boolean','number',"string",'symbol',"function"].indexOf(t)==-1;};if(!isJson(a)){return JSON.parse(a);}else{return a;}};root.safelyParseJSON=safelyParseJSON;}(globalRoot));
/*!
 * return an array of values that match on a certain key
 * techslides.com/how-to-parse-and-search-json-in-javascript
 * @see {@link https://gist.github.com/englishextra/872269c30d7cb2d10e3c3babdefc37b4}
 * var jpr = JSON.parse(response);
 * for(var i=0,l=jpr.length;i<l;i+=1)
 * {var t=getKeyValuesFromJSON(jpr[i],"label"),
 * p=getKeyValuesFromJSON(jpr[i],"link");};
 * @param {String} b JSON entry
 * @param {String} d JSON key to match
 * getKeyValuesFromJSON(b,d)
 */
(function(root){"use strict";var getKeyValuesFromJSON=function(b,d){var c=[];for(var a in b){if(b.hasOwnProperty(a)){if("object"===typeof b[a]){c=c.concat(getKeyValuesFromJSON(b[a],d));}else{if(a===d){c.push(b[a]);}}}}return c;};root.getKeyValuesFromJSON=getKeyValuesFromJSON;}(globalRoot));
/*!
 * loop over the Array
 * @see {@link https://stackoverflow.com/questions/18238173/javascript-loop-through-json-array}
 * @see {@link https://gist.github.com/englishextra/b4939b3430da4b55d731201460d3decb}
 * @param {String} str any text string
 * @param {Int} max a whole positive number
 * @param {String} add any text string
 * truncString(str,max,add)
 */
(function(root){"use strict";var truncString=function(str,max,add){add=add||"\u2026";return("string"===typeof str&&str.length>max?str.substring(0,max)+add:str);};root.truncString=truncString;}(globalRoot));
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
(function(root){"use strict";var fixEnRuTypo=function(e,a,b){var c="";if("ru"===a&&"en"===b){a='\u0430\u0431\u0432\u0433\u0434\u0435\u0451\u0436\u0437\u0438\u0439\u043a\u043b\u043c\u043d\u043e\u043f\u0440\u0441\u0442\u0443\u0444\u0445\u0446\u0447\u0448\u0449\u044a\u044c\u044b\u044d\u044e\u044f\u0410\u0411\u0412\u0413\u0414\u0415\u0401\u0416\u0417\u0418\u0419\u041a\u041b\u041c\u041d\u041e\u041f\u0420\u0421\u0422\u0423\u0424\u0425\u0426\u0427\u0428\u0429\u042a\u042c\u042b\u042d\u042e\u042f"\u2116;:?/.,';b="f,dult`;pbqrkvyjghcnea[wxio]ms'.zF<DULT~:PBQRKVYJGHCNEA{WXIO}MS'>Z@#$^&|/?";}else{a="f,dult`;pbqrkvyjghcnea[wxio]ms'.zF<DULT~:PBQRKVYJGHCNEA{WXIO}MS'>Z@#$^&|/?";b='\u0430\u0431\u0432\u0433\u0434\u0435\u0451\u0436\u0437\u0438\u0439\u043a\u043b\u043c\u043d\u043e\u043f\u0440\u0441\u0442\u0443\u0444\u0445\u0446\u0447\u0448\u0449\u044a\u044c\u044b\u044d\u044e\u044f\u0410\u0411\u0412\u0413\u0414\u0415\u0401\u0416\u0417\u0418\u0419\u041a\u041b\u041c\u041d\u041e\u041f\u0420\u0421\u0422\u0423\u0424\u0425\u0426\u0427\u0428\u0429\u042a\u042c\u042b\u042d\u042e\u042f"\u2116;:?/.,';}for(var d=0;d<e.length;d++){var f=a.indexOf(e.charAt(d));if(c>f){c+=e.charAt(d);}else{c+=b.charAt(f);}}return c;};root.fixEnRuTypo=fixEnRuTypo;}(globalRoot));
/*!
 * Load .html file
 * modified JSON with JS.md
 * @see {@link https://gist.github.com/thiagodebastos/08ea551b97892d585f17}
 * @see {@link https://gist.github.com/englishextra/d5ce0257afcdd9a7387d3eb26e9fdff5}
 * @param {String} url path string
 * @param {Object} [callback] callback function
 * @param {Object} [onerror] on error callback function
 * loadExternalHTML(url,callback,onerror)
 */
(function(root){"use strict";var loadExternalHTML=function(url,callback,onerror){var cb=function(string){return callback&&"function"===typeof callback&&callback(string);};if(root.Promise&&root.fetch&&!root.chrome&&!("undefined"!==typeof root&&root.process&&"renderer"===root.process.type)){fetch(url).then(function(response){if(!response.ok){if(onerror&&"function"===typeof onerror){onerror();}else{throw new Error(response.statusText);}}return response;}).then(function(response){return response.text();}).then(function(text){cb(text);}).catch(function(err){console.log("Error fetch-ing file "+url,err);});}else{var x=root.XMLHttpRequest?new XMLHttpRequest():new ActiveXObject("Microsoft.XMLHTTP");x.overrideMimeType("text/html;charset=utf-8");x.open("GET",url,!0);x.withCredentials=!1;x.onreadystatechange=function(){if(x.status==="404"||x.status===0){console.log("Error XMLHttpRequest-ing file "+url,x.status);return onerror&&"function"===typeof onerror&&onerror();}else if(x.readyState===4&&x.status===200&&x.responseText){cb(x.responseText);}};x.send(null);}};root.loadExternalHTML=loadExternalHTML;}(globalRoot));
/*!
 * remove element from DOM
 * @see {@link https://gist.github.com/englishextra/d2a286f64d404052fbbdac1e416ab808}
 * @param {Object} e an Element to remove
 * removeElement(e)
 */
(function(root){"use strict";var removeElement=function(e){var r="remove",pN="parentNode";if(e){if("undefined"!==typeof e[r]){return e[r]();}else{return e[pN]&&e[pN].removeChild(e);}}};root.removeElement=removeElement;}(globalRoot));
/*!
 * remove all children of parent element
 * @see {@link https://gist.github.com/englishextra/da26bf39bc90fd29435e8ae0b409ddc3}
 * @param {Object} e parent HTML Element
 * removeChildren(e)
 */
(function(root){"use strict";var removeChildren=function(e){return (function(){if(e&&e.firstChild){for(;e.firstChild;){e.removeChild(e.firstChild);}}}());};root.removeChildren=removeChildren;}(globalRoot));
/*!
 * insert text response as fragment into element
 * @see {@link https://gist.github.com/englishextra/4e13afb8ce184ad28d77f6b5eed71d1f}
 * @param {String} text text/response to insert
 * @param {Object} container target HTML Element
 * @param {Object} [callback] callback function
 * insertTextAsFragment(t,c,f)
 */
(function(root){"use strict";var insertTextAsFragment=function(text,container,callback){var d=document,b=d.body||"",aC="appendChild",iH="innerHTML",pN="parentNode",cb=function(){return callback&&"function"===typeof callback&&callback();};try{var clonedContainer=container.cloneNode(!1);if(d.createRange){var rg=d.createRange();rg.selectNode(b);var df=rg.createContextualFragment(text);clonedContainer[aC](df);return container[pN]?container[pN].replaceChild(clonedContainer,container):container[iH]=text,cb();}else{clonedContainer[iH]=text;return container[pN]?container[pN].replaceChild(d.createDocumentFragment[aC](clonedContainer),container):container[iH]=text,cb();}}catch(e){console.log(e);}return!1;};root.insertTextAsFragment=insertTextAsFragment;}(globalRoot));
/*!
 * append node into other with fragment
 * @see {@link https://gist.github.com/englishextra/0ff3204d5fb285ef058d72f31e3af766}
 * @param {String|object} e an HTML Element to append
 * @param {Object} a target HTML Element
 * appendFragment(e,a)
 */
(function(root){"use strict";var appendFragment=function(e,a){var d=document;a=a||d.getElementsByTagNames("body")[0]||"";return (function(){if(e){var d=document,df=d.createDocumentFragment()||"",aC="appendChild";if("string"===typeof e){e=d.createTextNode(e);}df[aC](e);a[aC](df);}}());};root.appendFragment=appendFragment;}(globalRoot));
/*!
 * set style display block of an element
 * @param {Object} a an HTML Element
 * setStyleDisplayBlock(a)
 */
(function(root){var setStyleDisplayBlock=function(a){return (function(){if(a){a.style.display="block";}}());};root.setStyleDisplayBlock=setStyleDisplayBlock;}(globalRoot));
/*!
 * set style display none of an element
 * @param {Object} a an HTML Element
 * setStyleDisplayNone(a)
 */
(function(root){var setStyleDisplayNone=function(a){return (function(){if(a){a.style.display="none";}}());};root.setStyleDisplayNone=setStyleDisplayNone;}(globalRoot));
/*!
 * set style opacity of an element
 * @param {Object} a an HTML Element
 * @param {Number} n any positive decimal number 0.00-1.00
 * setStyleOpacity(a,n)
 */
(function(root){var setStyleOpacity=function(a,n){n=n||1;return (function(){if(a){a.style.opacity=n;}}());};root.setStyleOpacity=setStyleOpacity;}(globalRoot));
/*!
 * Check if string represents a valid HTML id
 * @see {@link https://gist.github.com/englishextra/b5aaef8b555a3ba84c68a6e251db149d}
 * @see {@link https://jsfiddle.net/englishextra/z19tznau/}
 * @param {String} a text string
 * @param {Int} [full] if true, checks with leading hash/number sign
 * isValidId(a,full)
 */
(function(root){"use strict";var isValidId=function(a,full){return full?/^\#[A-Za-z][-A-Za-z0-9_:.]*$/.test(a)?!0:!1:/^[A-Za-z][-A-Za-z0-9_:.]*$/.test(a)?!0:!1;};root.isValidId=isValidId;}(globalRoot));
/*!
 * find element's position
 * @see {@link https://stackoverflow.com/questions/5598743/finding-elements-position-relative-to-the-document}
 * @param {Object} a an HTML element
 * findPos(a).top
 */
(function(root){"use strict";var findPos=function(a){a=a.getBoundingClientRect();var b=document.body,c=document.documentElement;return{top:Math.round(a.top+(root.pageYOffset||c.scrollTop||b.scrollTop)-(c.clientTop||b.clientTop||0)),left:Math.round(a.left+(root.pageXOffset||c.scrollLeft||b.scrollLeft)-(c.clientLeft||b.clientLeft||0))};};root.findPos=findPos;}(globalRoot));
/*!
 * scroll to element using zenscroll with fallback
 * @requires zenscroll
 * @requires findPos
 * @param {Object} a an HTML element
 * scrollToElement(a)
 */
(function(root){var scrollToElement=function(a){if(a){if(root.zenscroll){zenscroll.to(a);}else{root.scroll(0,findPos(a).top);}}return!1;};root.scrollToElement=scrollToElement;}(globalRoot));
/*!
 * Scroll to top with Zenscroll, or fallback
 * @requires zenscroll
 * scrollToTop()
 */
(function(root){var scrollToTop=function(){var w=root;return w.zenscroll?zenscroll.toY(0):w.scroll2Top?scroll2Top(w,400):w.scroll(0,0);};root.scrollToTop=scrollToTop;}(globalRoot));
/*!
 * change document location
 * @param {String} a URL / path string
 * changeLocation(a)
 */
(function(root){var changeLocation=function(a){return function(){if(a){document.location.href=a;}}();};root.changeLocation=changeLocation;}(globalRoot));
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
(function(root){"use strict";var parseLink=function(url,full){full=full||!1;return (function(){var _r=function(s){return s.replace(/^(#|\?)/,"").replace(/\:$/,"");},l=location||"",_p=function(protocol){switch(protocol){case"http:":return full?":"+80:80;case"https:":return full?":"+443:443;default:return full?":"+l.port:l.port;}},_s=(0===url.indexOf("//")||!!~url.indexOf("://")),w=root.location||"",_o=function(){var o=w.protocol+"//"+w.hostname+(w.port?":"+w.port:"");return o||"";},_c=function(){var c=document.createElement("a");c.href=url;var v=c.protocol+"//"+c.hostname+(c.port?":"+c.port:"");return v!==_o();},a=document.createElement("a");a.href=url;return{href:a.href,origin:_o(),host:a.host||l.host,port:("0"===a.port||""===a.port)?_p(a.protocol):(full?a.port:_r(a.port)),hash:full?a.hash:_r(a.hash),hostname:a.hostname||l.hostname,pathname:a.pathname.charAt(0)!=="/"?(full?"/"+a.pathname:a.pathname):(full?a.pathname:a.pathname.slice(1)),protocol:!a.protocol||":"===a.protocol?(full?l.protocol:_r(l.protocol)):(full?a.protocol:_r(a.protocol)),search:full?a.search:_r(a.search),query:full?a.search:_r(a.search),isAbsolute:_s,isRelative:!_s,isCrossDomain:_c(),hasHTTP:/^(http|https):\/\//i.test(url)?!0:!1};}());};root.parseLink=parseLink;}(globalRoot));
/*jslint bitwise: false */
/*!
 * get current protocol - "http" or "https", else return ""
 * @param {Boolean} [force] When set to "true", and the result is empty,
 * the function will return "http"
 * getHTTP(true)
 */
(function(root){"use strict";var getHTTP=(function(type){return function(force){force=force||"";return"http:"===type?"http":"https:"===type?"https":force?"http":"";};}(root.location.protocol||""));root.getHTTP=getHTTP;}(globalRoot));
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
(function(root){"use strict";var isNodejs="undefined"!==typeof process&&"undefined"!==typeof require||"",isElectron="undefined"!==typeof root&&root.process&&"renderer"===root.process.type||"",isNwjs=(function(){if("undefined"!==typeof isNodejs&&isNodejs){try{if("undefined"!==typeof require("nw.gui")){return!0;}}catch(e){return!1;}}return!1;}()),openDeviceBrowser=function(url){var triggerForElectron=function(){var es=isElectron?require("electron").shell:"";return es?es.openExternal(url):"";},triggerForNwjs=function(){var ns=isNwjs?require("nw.gui").Shell:"";return ns?ns.openExternal(url):"";},triggerForHTTP=function(){return!0;},triggerForLocal=function(){return root.open(url,"_system","scrollbars=1,location=no");};if(isElectron){triggerForElectron();}else if(isNwjs){triggerForNwjs();}else{var locationProtocol=root.location.protocol||"",hasHTTP=locationProtocol?"http:"===locationProtocol?"http":"https:"===locationProtocol?"https":"":"";if(hasHTTP){triggerForHTTP();}else{triggerForLocal();}}};root.openDeviceBrowser=openDeviceBrowser;}(globalRoot));
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
 * loading spinner
 * @requires Timers
 * @see {@link https://gist.github.com/englishextra/24ef040fbda405f7468da70e4f3b69e7}
 * @param {Object} [callback] callback function
 * @param {Int} [delay] any positive whole number, default: 500
 * LoadingSpinner.show();
 * LoadingSpinner.hide(f,n);
 */
var LoadingSpinner = (function () {
	"use strict";
	var d = document,
	b = d.body || "",
	qS = "querySelector",
	spinnerClass = "loading-spinner",
	spinner = d[qS]("." + spinnerClass) || "",
	cL = "classList",
	cE = "createElement",
	isActiveClass = "is-active-loading-spinner";
	/* console.log("triggered function: LoadingSpinner"); */
	if (!spinner) {
		spinner = d[cE]("div");
		spinner[cL].add(spinnerClass);
		appendFragment(spinner, b);
	}
	return {
		show: function () {
			return b[cL].contains(isActiveClass) || b[cL].add(isActiveClass);
		},
		hide: function (callback, delay) {
			delay = delay || 500;
			var timers = new Timers();
			timers.timeout(function () {
				timers.clear();
				timers = null;
				b[cL].remove(isActiveClass);
				if (callback && "function" === typeof callback) {
					callback();
				}
			}, delay);
		}
	};
}
());
/*!
 * modified Notibar.js v1.0
 * Lightweight notification bar, no dependency.
 * @see {@link https://github.com/englishextra/notibar.js}
 * passes jshint
 */
var notiBar = function (opt) {
	var d = document,
	b = d.body || "",
	qS = "querySelector",
	cL = "classList",
	aC = "appendChild",
	cE = "createElement",
	cENS = "createElementNS",
	sANS = "setAttributeNS",
	aEL = "addEventListener",
	rEL = "removeEventListener",
	notibarClass = "notibar",
	notibarContainer = d[qS]("." + notibarClass) || "",
	messageClass = "message",
	closeButtonClass = "close",
	defaultKey = "_notibar_dismiss_",
	defaultDatum = "ok",
	animatedClass = "animated",
	fadeInDownClass = "fadeInDown",
	fadeOutUpClass = "fadeOutUp";
	if (b) {
		/* console.log("triggered function: notiBar"); */
		if ("string" === typeof opt) {
			opt = {
				"message": opt
			};
		}
		var settings = {
			"message": "",
			"timeout": 10000,
			"key": defaultKey,
			"datum": defaultDatum,
			"days": 0,
		};
		for (var i in opt) {
			if (opt.hasOwnProperty(i)) {
				settings[i] = opt[i];
			}
		}
		var cookieKey = Cookies.get(settings.key) || "";
		if (cookieKey && cookieKey === decodeURIComponent(settings.datum)) {
			return !1;
		}
		if (notibarContainer) {
			removeChildren(notibarContainer);
		} else {
			notibarContainer = d[cE]("div");
			notibarContainer[cL].add(notibarClass);
			notibarContainer[cL].add(animatedClass);
		}
		var msgContainer = d[cE]("div");
		msgContainer[cL].add(messageClass);
		var msgContent = settings.message || "";
		if ("string" === typeof msgContent) {
			msgContent = d.createTextNode(msgContent);
		}
		msgContainer[aC](msgContent);
		notibarContainer[aC](msgContainer);
		var insertCancelSvg = function (targetObj) {
			var svg = d[cENS]("http://www.w3.org/2000/svg", "svg"),
			use = d[cENS]("http://www.w3.org/2000/svg", "use");
			svg[cL].add("ui-icon");
			use[sANS]("http://www.w3.org/1999/xlink", "xlink:href", "#ui-icon-Cancel");
			svg[aC](use);
			targetObj[aC](svg);
		},
		closeButton = d[cE]("a");
		closeButton[cL].add(closeButtonClass);
		insertCancelSvg(closeButton);
		var set_cookie = function () {
			if (settings.days) {
				Cookies.set(settings.key, settings.datum, {
					expires: settings.days
				});
			} else {
				Cookies.set(settings.key, settings.datum);
			}
		},
		hideMessage = function () {
			var notibarContainer = d[qS]("." + notibarClass) || "";
			if (notibarContainer) {
				notibarContainer[cL].remove(fadeInDownClass);
				notibarContainer[cL].add(fadeOutUpClass);
				removeChildren(notibarContainer);
			}
		},
		handleCloseButton = function () {
			closeButton[rEL]("click", handleCloseButton);
			hideMessage();
			set_cookie();
		};
		closeButton[aEL]("click", handleCloseButton);
		notibarContainer[aC](closeButton);
		appendFragment(notibarContainer, b);
		notibarContainer[cL].remove(fadeOutUpClass);
		notibarContainer[cL].add(fadeInDownClass);
		var timers = new Timers();
		timers.timeout(function () {
			timers.clear();
			timers = null;
			hideMessage();
		}, settings.timeout);
	}
};
/*!
 * init notibar
 */
var initNotibarMsg = function () {
	"use strict";
	var w = globalRoot,
	d = document,
	gEBI = "getElementById",
	aC = "appendChild",
	aEL = "addEventListener",
	rEL = "removeEventListener",
	cE = "createElement",
	cookieKey = "_notibar_dismiss_",
	cookieDatum = "Напишите мне, отвечу очень скоро. Регистрироваться не нужно.",
	locationOrigin = parseLink(w.location.href).origin,
	renderMsg = function () {
		var msgObj = d[cE]("a");
		/*jshint -W107 */
		msgObj.href = "javascript:void(0);";
		/*jshint +W107 */
		var handleMsgObj = function (ev) {
			ev.stopPropagation();
			ev.preventDefault();
			msgObj[rEL]("click", handleMsgObj);
			scrollToElement(d[gEBI]('disqus_thread') || "");
		};
		msgObj[aEL]("click", handleMsgObj);
		msgObj[aC](d.createTextNode(cookieDatum));
		notiBar({
			"message": msgObj,
			"timeout": 5000,
			"key": cookieKey,
			"datum": cookieDatum,
			"days": 0
		});
	};
	if (locationOrigin) {
		if ("undefined" !== typeof getHTTP && getHTTP()) {
			/* console.log("triggered function: initNotibarMsg"); */
			var timers = new Timers();
			timers.timeout(function () {
				timers.clear();
				timers = null;
				renderMsg();
			}, 3000);
		}
	}
};
document.ready().then(initNotibarMsg);
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
	cE = "createElement",
	aEL = "addEventListener",
	rEL = "removeEventListener",
	an = "animated",
	an2 = "fadeInUp",
	an4 = "fadeOutDown";
	/* console.log("triggered function: Notifier42"); */
	if (!c) {
		c = d[cE]("div");
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
		var timers = new Timers();
		timers.timeout(function () {
			timers.clear();
			timers = null;
			r();
		}, 400);
	};
	c[aEL]("click", function h_c() {
		this[rEL]("click", h_c);
		g();
	});
	if (0 !== n) {
		var timers = new Timers();
		timers.timeout(function () {
			timers.clear();
			timers = null;
			g();
		}, n);
	}
	return {
		destroy : function () {
			return g(removeElement.bind(null, c));
		}
	};
};
/*!
 * notifier42-write-me
 */
var initNotifier42WriteMe = function () {
	"use strict";
	if ("undefined" !== typeof getHTTP && getHTTP()) {
		var w = globalRoot,
		d = document,
		gEBI = "getElementById",
		cE = "createElement",
		aEL = "addEventListener",
		n = "_notifier42_write_me_",
		m = "Напишите мне, отвечу очень скоро. Регистрироваться не нужно.",
		p = parseLink(w.location.href).origin,
		g = function () {
			var msgObj = d[cE]("a");
			/*jshint -W107 */
			msgObj.href = "javascript:void(0);";
			appendFragment(m, msgObj);
			/*jshint +W107 */
			msgObj[aEL]("click", scrollToElement.bind(null, d[gEBI]('disqus_thread') || ""));
			Notifier42(msgObj, 5000);
			Cookies.set(n, m);
		};
		if (!Cookies.get(n) && p) {
			/* console.log("triggered function: initNotifier42WriteMe"); */
			var timers = new Timers();
			timers.timeout(function () {
				timers.clear();
				timers = null;
				g();
			}, 8000);
		}
	}
};
document.ready().then(initNotifier42WriteMe);
/*!
 * init sidepanel btn
 */
var initSidepanel = function () {
	"use strict";
	var w = globalRoot,
	b = BALA.one("body") || "",
	btn = ".btn-toggle-ui-sidepanel",
	e = BALA.one(btn) || "",
	page = ".page",
	p = BALA.one(page) || "",
	container = ".container",
	c = BALA.one(container) || "",
	overlay = ".page-overlay",
	o = BALA.one(overlay) || "",
	item = ".ui-sidepanel li",
	active_qrcode = "is-active-holder-location-qr-code",
	active_vk_like = "is-active-holder-vk-like",
	active_share = "is-active-holder-share-buttons",
	active_sidepanel = "is-active-ui-sidepanel",
	active_menumore = "is-active-ui-menumore",
	cL = "classList",
	aEL = "addEventListener";
	if (b && e && p && c) {
		/* console.log("triggered function: initSidepanel"); */
		var f = function () {
			if (p[cL].contains(active_qrcode)) {
				p[cL].remove(active_qrcode);
			}
			if (p[cL].contains(active_vk_like)) {
				p[cL].remove(active_vk_like);
			}
			if (p[cL].contains(active_share)) {
				p[cL].remove(active_share);
			}
			if (p[cL].contains(active_menumore)) {
				p[cL].remove(active_menumore);
			}
		},
		h_e = function (ev) {
			ev.stopPropagation();
			ev.preventDefault();
			p[cL].toggle(active_sidepanel);
			f();
		},
		h_o = function () {
			if (p[cL].contains(active_sidepanel)) {
				p[cL].remove(active_sidepanel);
			}
			f();
		},
		h_c = function () {
			if (!p[cL].contains(active_sidepanel)) {
				p[cL].add(active_sidepanel);
			}
			f();
		};
		e[aEL]("click", h_e);
		if ("undefined" !== typeof earlyHasTouch && "touch" === earlyHasTouch) {
			o[aEL]("swipeleft", h_o);
			/* p.onswipeleft = h_o; */
			c[aEL]("swiperight", h_c);
			/* p.onswiperight = h_p_right; */
		}
		var a = BALA.one(item) || "";
		if (a) {
			a = BALA(item) || "";
			var g = function (e) {
				e[aEL]("click", h_o);
				/* e.onclick = h_o; */
			};
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
		b[aEL]("click", h_o);
		/* b.onclick = h_o; */
	}
};
document.ready().then(initSidepanel);
/*!
 * highlight current sidepanel item
 */
var highlightSidepanelItem = function () {
	"use strict";
	var w = globalRoot,
	c = BALA.one(".ui-sidepanel-list") || "",
	a = BALA("a", c) || "",
	is_active = "is-active",
	p = w.location.href || "",
	cL = "classList",
	g = function (e) {
		if (e.href === p) {
			e[cL].add(is_active);
		} else {
			e[cL].remove(is_active);
		}
	},
	k = function () {
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
	if (c && a && p) {
		/* console.log("triggered function: highlightNavMenuItem"); */
		k();
	}
};
document.ready().then(highlightSidepanelItem);
globalRoot.addEventListener("hashchange", highlightSidepanelItem);
/*!
 * init menumore btn
 */
var initMenumore = function () {
	"use strict";
	var w = globalRoot,
	btn = ".btn-toggle-ui-menumore",
	e = BALA.one(btn) || "",
	page = ".page",
	p = BALA.one(page) || "",
	item = ".ui-menumore li",
	active_qrcode = "is-active-holder-location-qr-code",
	active_vk_like = "is-active-holder-vk-like",
	active_share = "is-active-holder-share-buttons",
	active_sidepanel = "is-active-ui-sidepanel",
	active_menumore = "is-active-ui-menumore",
	cL = "classList",
	aEL = "addEventListener";
	if (e && p) {
		/* console.log("triggered function: initMenumore"); */
		var f = function () {
			if (p[cL].contains(active_qrcode)) {
				p[cL].remove(active_qrcode);
			}
			if (p[cL].contains(active_vk_like)) {
				p[cL].remove(active_vk_like);
			}
			if (p[cL].contains(active_share)) {
				p[cL].remove(active_share);
			}
			if (p[cL].contains(active_sidepanel)) {
				p[cL].remove(active_sidepanel);
			}
		},
		h_e = function (ev) {
			ev.stopPropagation();
			ev.preventDefault();
			p[cL].toggle(active_menumore);
			f();
		};
		e[aEL]("click", h_e);
		var h_a = function () {
			if (p[cL].contains(active_menumore)) {
				p[cL].remove(active_menumore);
			}
			f();
		},
		a = BALA.one(item) || "";
		if (a) {
			a = BALA(item) || "";
			var g = function (e) {
				e[aEL]("click", h_a);
			};
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
	}
};
document.ready().then(initMenumore);
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
	ctx = ctx && ctx.nodeName ? ctx : "";
	var w = globalRoot,
	aEL = "addEventListener",
	cls = "a",
	a = ctx ? BALA.one(cls, ctx) || "" : BALA.one(cls) || "",
	g = function (e) {
		var p = e.getAttribute("href") || "";
		if (p && parseLink(p).isCrossDomain && parseLink(p).hasHTTP) {
			e.title = "" + (parseLink(p).hostname || "") + " откроется в новой вкладке";
			if ("undefined" !== typeof getHTTP && getHTTP()) {
				e.target = "_blank";
				e.rel = "noopener";
			} else {
				e[aEL]("click", handleExternalLink.bind(null, p));
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
		/* console.log("triggered function: manageExternalLinks"); */
		k();
	}
};
document.ready().then(manageExternalLinks);
/*!
 * set event on include HTML links
 */
var includeHTMLintoTarget = function (_this, u, t) {
	"use strict";
	var c = BALA.one(t) || "",
	pN = "parentNode",
	c_pn = c[pN] || "",
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
					manageDataSrcImages(c_pn);
					manageImgLightboxLinks(c_pn);
				}
			};
			insertTextAsFragment(t, c, tf);
		},
		q = function () {
			s();
			setStyleDisplayNone(c);
		};
		loadExternalHTML(u, function (r) {
			k(r);
		}, function (r) {
			q();
		});
	};
	if (c) {
		/* console.log("triggered function: includeHTMLintoTarget"); */
		g();
	}
};
/*!
 * manage data target links
 */
var manageDataTargetLinks = function (ctx) {
	"use strict";
	ctx = ctx && ctx.nodeName ? ctx : "";
	var w = globalRoot,
	cls = "[data-target]",
	a = ctx ? BALA.one(cls, ctx) || "" : BALA.one(cls) || "",
	ds = "dataset",
	aEL = "addEventListener",
	rEL = "removeEventListener",
	g = function (e) {
		var u = e[ds].include || "",
		t = e[ds].target || "";
		if (u && t) {
			e.title = "Появится здесь же";
			var h_e = function (ev) {
				ev.stopPropagation();
				ev.preventDefault();
				e[rEL]("click", h_e);
				includeHTMLintoTarget(e, u, t);
			};
			e[aEL]("click", h_e);
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
		/* console.log("triggered function: manageDataTargetLinks"); */
		k();
	}
};
/*!
 * manage data lightbox img links
 */
var handleImgLightboxLink = function (ev) {
	"use strict";
	ev.stopPropagation();
	ev.preventDefault();
	var _this = this;
	var w = globalRoot,
	ilc = "img-lightbox-container",
	c = BALA.one("." + ilc) || "",
	m = BALA.one("img", c) || "",
	cL = "classList",
	aEL = "addEventListener",
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
				/* console.log("manageDataSrcImages => imagePromise: loaded image:", r); */
			}).catch (function (err) {
				/* console.log("manageDataSrcImages => imagePromise: cannot load image:", err); */
			});
		} else {
			m.src = _href;
		}
		c[aEL]("click", handleImgLightboxContainer);
		w[aEL]("keyup", handleImgLightboxWindow);
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
			var timers = new Timers();
			timers.timeout(function () {
				timers.clear();
				timers = null;
				st1();
			}, 400);
		};
		var timers = new Timers();
		timers.timeout(function () {
			timers.clear();
			timers = null;
			st2();
		}, 400);
	}
},
handleImgLightboxContainer = function () {
	"use strict";
	var ilc = "img-lightbox-container",
	rEL = "removeEventListener",
	c = BALA.one("." + ilc) || "";
	if (c) {
		c[rEL]("click", handleImgLightboxContainer);
		hideImgLightbox();
	}
},
handleImgLightboxWindow = function (ev) {
	"use strict";
	var w = globalRoot,
	rEL = "removeEventListener";
	w[rEL]("keyup", handleImgLightboxWindow);
	if (27 === (ev.which || ev.keyCode)) {
		hideImgLightbox();
	}
},
manageImgLightboxLinks = function (ctx) {
	"use strict";
	ctx = ctx && ctx.nodeName ? ctx : "";
	var w = globalRoot,
	b = BALA.one("body") || "",
	cls = ".img-lightbox-link",
	a = ctx ? BALA.one(cls, ctx) || "" : BALA.one(cls) || "",
	ilc = "img-lightbox-container",
	c = BALA.one("." + ilc) || "",
	m = BALA.one("img", c) || "",
	cL = "classList",
	aEL = "addEventListener",
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
		var p = e.getAttribute("href") || "";
		if (p) {
			if (parseLink(p).isAbsolute && !parseLink(p).hasHTTP) {
				e.setAttribute("href", p.replace(/^/, getHTTP(!0) + ":"));
			}
			e[aEL]("click", handleImgLightboxLink);
		}
	};
	if (a) {
		/* console.log("triggered function: manageImgLightboxLinks"); */
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
/*!
 * replace img src with data-src
 * @param {Object} [ctx] context HTML Element
 */
var handleDataSrcImages = function () {
	"use strict";
	var d = document,
	gEBCN = "getElementsByClassName",
	cL = "classList",
	ds = "dataset",
	imgClass = "data-src-img",
	img = d[gEBCN](imgClass) || "",
	isActiveClass = "is-active",
	isBindedClass = "is-binded",
	rerenderDataSrcImage = function (e) {
		if (!e[cL].contains(isBindedClass)) {
			var _src = e[ds].src || "";
			if (_src) {
				if (parseLink(_src).isAbsolute && !parseLink(_src).hasHTTP) {
					e[ds].src = _src.replace(/^/, getHTTP(!0) + ":");
					_src = e[ds].src;
				}
				imagePromise(_src).then(function (r) {
					e.src = _src;
					/* console.log("manageDataSrcImages => imagePromise: loaded image:", r); */
				}).catch (function (err) {
					/* console.log("manageDataSrcImages => imagePromise: cannot load image:", err); */
				});
				/* e.src = _src; */
				e[cL].add(isActiveClass);
				e[cL].add(isBindedClass);
			}
		}
	},
	arrangeDataSrcImage = function (e) {
		/*!
		 * true if elem is in same y-axis as the viewport or within 100px of it
		 * @see {@link https://github.com/ryanve/verge}
		 */
		if (verge.inY(e, 100) /*  && 0 !== e.offsetHeight */) {
			rerenderDataSrcImage(e);
		}
	},
	rerenderDataSrcImages = function () {
		for (var i = 0, l = img.length; i < l; i += 1) {
			arrangeDataSrcImage(img[i]);
		}
		/* forEach(img, arrangeDataSrcImage); */
	};
	if (img) {
		/* console.log("triggered function: manageDataSrcImages"); */
		rerenderDataSrcImages();
	}
},
handleDataSrcImagesWindow = function () {
	var throttleHandleDataSrcImages = throttle(handleDataSrcImages, 100);
	throttleHandleDataSrcImages();
},
manageDataSrcImages = function () {
	"use strict";
	var w = globalRoot,
	aEL = "addEventListener",
	rEL = "removeEventListener";
	w[rEL]("scroll", handleDataSrcImagesWindow);
	w[rEL]("resize", handleDataSrcImagesWindow);
	w[aEL]("scroll", handleDataSrcImagesWindow);
	w[aEL]("resize", handleDataSrcImagesWindow);
	var timers = new Timers();
	timers.timeout(function () {
		timers.clear();
		timers = null;
		handleDataSrcImages();
	}, 100);
};
document.ready().then(manageDataSrcImages);
/*!
 * replace img src with data-src
 * @param {Object} [ctx] context HTML Element
 */
var manageDataQrcodeImg = function (ctx) {
	"use strict";
	ctx = ctx && ctx.nodeName ? ctx : "";
	var w = globalRoot,
	cls = "img[data-qrcode]",
	a = ctx ? BALA.one(cls, ctx) || "" : BALA.one(cls) || "",
	ds = "dataset",
	g = function (e) {
		var u = e[ds].qrcode || "";
		u = decodeURIComponent(u);
		if (u) {
			var s = getHTTP(!0) + "://chart.googleapis.com/chart?cht=qr&chld=M%7C4&choe=UTF-8&chs=300x300&chl=" + encodeURIComponent(u);
			e.title = u;
			e.alt = u;
			if (w.QRCode) {
				if ("undefined" !== typeof earlySvgSupport && "svg" === earlySvgSupport) {
					s = QRCode.generateSVG(u, {
							ecclevel: "M",
							fillcolor: "#F3F3F3",
							textcolor: "#191919",
							margin: 4,
							modulesize: 8
						});
					var XMLS = new XMLSerializer();
					s = XMLS.serializeToString(s);
					s = "data:image/svg+xml;base64," + w.btoa(unescape(encodeURIComponent(s)));
					e.src = s;
				} else {
					s = QRCode.generatePNG(u, {
							ecclevel: "M",
							format: "html",
							fillcolor: "#F3F3F3",
							textcolor: "#191919",
							margin: 4,
							modulesize: 8
						});
					e.src = s;
				}
			} else {
				e.src = s;
			}
		}
	};
	if (a) {
		/* console.log("triggered function: manageDataQrcodeImg"); */
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
	}
},
loadManageDataQrcodeImg = function (ctx) {
	"use strict";
	ctx = ctx && ctx.nodeName ? ctx : "";
	var js = "../cdn/qrjs2/0.1.3/js/qrjs2.fixed.min.js";
	if (!scriptIsLoaded(js)) {
		loadJS(js, manageDataQrcodeImg.bind(null, ctx));
	} else {
		manageDataQrcodeImg(ctx);
	}
};
/*!
 * add smooth scroll or redirection to static select options
 * @param {Object} [ctx] context HTML Element
 */
var handleChaptersSelect = function () {
	"use strict";
	var _this = this;
	var d = document,
	gEBI = "getElementById",
	_hash = _this.options[_this.selectedIndex].value || "",
	tragetObject = _hash ? (isValidId(_hash, true) ? d[gEBI](_hash.replace(/^#/,"")) || "" : "") : "";
	if (_hash) {
		if (tragetObject) {
			scrollToElement(tragetObject);
		} else {
			changeLocation(_hash);
		}
	}
},
manageChaptersSelect = function (ctx) {
	"use strict";
	ctx = ctx && ctx.nodeName ? ctx : "";
	var cls = "#chapters-select",
	a = ctx ? BALA.one(cls, ctx) || "" : BALA.one(cls) || "",
	aEL = "addEventListener",
	k = function () {
		a[aEL]("change", handleChaptersSelect);
	};
	if (a) {
		/* console.log("triggered function: manageChaptersSelect"); */
		k();
	}
};
/*!
 * manage search input
 */
var manageSearchInput = function () {
	"use strict";
	var a = BALA.one("#text") || "",
	aEL = "addEventListener",
	g = function () {
		var _this = this;
		_this.value = _this.value.replace(/\\/g, "").replace(/ +(?= )/g, " ").replace(/\/+(?=\/)/g, "/") || "";
	},
	k = function (e) {
		e.focus();
		e[aEL]("input", g);
	};
	if (a) {
		/* console.log("triggered function: manageSearchInput"); */
		k(a);
	}
};
document.ready().then(manageSearchInput);
/*!
 * add click event on hidden-layer show btn
 * @param {Object} [ctx] context HTML Element
 */
var handleExpandingLayers = function () {
	"use strict";
	var _this = this;
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
	ctx = ctx && ctx.nodeName ? ctx : "";
	var w = globalRoot,
	cls = ".btn-expand-hidden-layer",
	a = ctx ? BALA.one(cls, ctx) || "" : BALA.one(cls) || "",
	aEL = "addEventListener",
	k = function (e) {
		e[aEL]("click", handleExpandingLayers);
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
		/* console.log("triggered function: manageExpandingLayers"); */
		q();
	}
};
/*!
 * init col debug btn
 */
var hideDebugGrid = function () {
	"use strict";
	var c = BALA.one(".container") || "",
	debug = "debug",
	cL = "classList",
	rEL = "removeEventListener";
	if (c) {
		c[cL].remove(debug);
		c[rEL]("click", hideDebugGrid);
	}
},
showDebugGridMesage = function () {
	"use strict";
	var w = globalRoot,
	b = BALA.one("body") || "",
	page = BALA.one(".page") || "",
	container = BALA.one(".container") || "",
	col = BALA.one(".col") || "",
	a = [b, page, container, col],
	m = [];
	for (var i = 0, l = a.length; i < l; i += 1) {
		if (a[i]) {
			m.push((a[i].className ? "." + a[i].className : a[i].id ? "#" + a[i].id : a[i].tagName), " ", w.getComputedStyle(a[i]).getPropertyValue("font-size"), " ", w.getComputedStyle(a[i]).getPropertyValue("line-height"), " ", a[i].offsetWidth, "x", a[i].offsetHeight, " \u003e ");
		}
	}
	m = m.join("");
	m = m.slice(0, m.lastIndexOf(" \u003e "));
	notiBar({
		"message": m,
		"timeout": 10000,
		/* "key": n,
		"value": m, */
		"days": 0
	});
},
manageDebugGridButton = function () {
	"use strict";
	var w = globalRoot,
	c = BALA.one(".container") || "",
	btn = ".btn-toggle-col-debug",
	e = BALA.one(btn) || "",
	debug = "debug",
	cL = "classList",
	aEL = "addEventListener",
	rEL = "removeEventListener";
	if (e && c) {
		/* console.log("triggered function: manageDebugGridButton"); */
		var u = w.location.href || "";
		if (u && parseLink(u).hasHTTP && (/^(localhost|127.0.0.1)/).test(parseLink(u).hostname)) {
			var h_e = function (ev) {
				ev.stopPropagation();
				ev.preventDefault();
				c[cL].toggle(debug);
				if (c[cL].contains(debug)) {
					c[aEL]("click", hideDebugGrid);
					showDebugGridMesage();
				} else {
					c[rEL]("click", hideDebugGrid);
				}
			};
			e[aEL]("click", h_e);
		} else {
			setStyleDisplayNone(e);
		}
	}
};
document.ready().then(manageDebugGridButton);
/*!
 * init qr-code
 * @see {@link https://stackoverflow.com/questions/12777622/how-to-use-enquire-js}
 */
var generateLocationQrCodeImg = function () {
	"use strict";
	var w = globalRoot,
	d = document,
	holder = ".holder-location-qr-code",
	c = BALA.one(holder) || "",
	cls = "qr-code-img",
	u = w.location.href || "",
	cL = "classList",
	cE = "createElement",
	m = d[cE]("img"),
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
	var w = globalRoot,
	btn = ".btn-toggle-holder-location-qr-code",
	e = BALA.one(btn) || "",
	page = ".page",
	p = BALA.one(page) || "",
	holder = ".holder-location-qr-code",
	c = BALA.one(holder) || "",
	active_qrcode = "is-active-holder-location-qr-code",
	active_vk_like = "is-active-holder-vk-like",
	active_share = "is-active-holder-share-buttons",
	active_sidepanel = "is-active-ui-sidepanel",
	active_menumore = "is-active-ui-menumore",
	u = w.location.href || "",
	cL = "classList",
	aEL = "addEventListener",
	f = function () {
		if (p[cL].contains(active_vk_like)) {
			p[cL].remove(active_vk_like);
		}
		if (p[cL].contains(active_share)) {
			p[cL].remove(active_share);
		}
		if (p[cL].contains(active_sidepanel)) {
			p[cL].remove(active_sidepanel);
		}
		if (p[cL].contains(active_menumore)) {
			p[cL].remove(active_menumore);
		}
	},
	h_e = function (ev) {
		ev.stopPropagation();
		ev.preventDefault();
		p[cL].toggle(active_qrcode);
		f();
	},
	q = function () {
		if (p[cL].contains(active_qrcode)) {
			p[cL].remove(active_qrcode);
		}
	},
	h_c = function () {
		q();
		f();
	};
	if (e && p && c && u) {
		/* console.log("triggered function: manageLocationQrCodeImage"); */
		if ("undefined" !== typeof getHTTP && getHTTP()) {
			q();
			e[aEL]("click", generateLocationQrCodeImg);
			e[aEL]("click", h_e);
			w[aEL]("hashchange", generateLocationQrCodeImg);
			c[aEL]("click", h_c);
		}
	}
},
loadManageLocationQrCodeImg = function () {
	"use strict";
	var js = "../cdn/qrjs2/0.1.3/js/qrjs2.fixed.min.js";
	if (!scriptIsLoaded(js)) {
		loadJS(js, manageLocationQrCodeImage);
	} else {
		manageLocationQrCodeImage();
	}
};
document.ready().then(loadManageLocationQrCodeImg);
/*!
 * init share btn
 */
var manageShareButton = function () {
	"use strict";
	var btn = ".btn-toggle-holder-share-buttons",
	e = BALA.one(btn) || "",
	page = ".page",
	p = BALA.one(page) || "",
	active_qrcode = "is-active-holder-location-qr-code",
	active_vk_like = "is-active-holder-vk-like",
	active_share = "is-active-holder-share-buttons",
	active_sidepanel = "is-active-ui-sidepanel",
	active_menumore = "is-active-ui-menumore",
	cL = "classList",
	aEL = "addEventListener";
	if (e && p) {
		/* console.log("triggered function: manageShareButton"); */
		var h_e = function (ev) {
			ev.stopPropagation();
			ev.preventDefault();
			p[cL].toggle(active_share);
			if (p[cL].contains(active_qrcode)) {
				p[cL].remove(active_qrcode);
			}
			if (p[cL].contains(active_vk_like)) {
				p[cL].remove(active_vk_like);
			}
			if (p[cL].contains(active_sidepanel)) {
				p[cL].remove(active_sidepanel);
			}
			if (p[cL].contains(active_menumore)) {
				p[cL].remove(active_menumore);
			}
			var js = getHTTP(!0) + "://yastatic.net/es5-shims/0.0.2/es5-shims.min.js",
			js2 = getHTTP(!0) + "://yastatic.net/share2/share.js";
			if (p[cL].contains(active_share)) {
				if (!scriptIsLoaded(js)) {
					loadJS(js, function () {
						if (!scriptIsLoaded(js2)) {
							loadJS(js2);
						}
					});
				}
			}
		};
		e[aEL]("click", h_e);
	}
};
document.ready().then(manageShareButton);
/*!
 * init vk-like btn
 */
var manageVKLikeButton = function () {
	"use strict";
	var w = globalRoot,
	btn = ".btn-toggle-holder-vk-like",
	e = BALA.one(btn) || "",
	page = ".page",
	p = BALA.one(page) || "",
	vk_like = "vk-like",
	c = BALA.one("#" + vk_like) || "",
	active_qrcode = "is-active-holder-location-qr-code",
	active_vk_like = "is-active-holder-vk-like",
	active_share = "is-active-holder-share-buttons",
	active_sidepanel = "is-active-ui-sidepanel",
	active_menumore = "is-active-ui-menumore",
	cL = "classList",
	aEL = "addEventListener";
	if (e && p && c) {
		/* console.log("triggered function: manageVKLikeButton"); */
		var h_e = function (ev) {
			ev.stopPropagation();
			ev.preventDefault();
			p[cL].toggle(active_vk_like);
			if (p[cL].contains(active_qrcode)) {
				p[cL].remove(active_qrcode);
			}
			if (p[cL].contains(active_share)) {
				p[cL].remove(active_share);
			}
			if (p[cL].contains(active_sidepanel)) {
				p[cL].remove(active_sidepanel);
			}
			if (p[cL].contains(active_menumore)) {
				p[cL].remove(active_menumore);
			}
			var js = getHTTP(!0) + "://vk.com/js/api/openapi.js?122",
			f = function () {
				if (w.VK) {
					VK.init({
						apiId: (c.dataset.apiid || ""),
						nameTransportPath: "/xd_receiver.htm",
						onlyWidgets: !0
					});
					VK.Widgets.Like(vk_like, {
						type: "button",
						height: 24
					});
				}
			};
			if (p[cL].contains(active_vk_like)) {
				if (!scriptIsLoaded(js)) {
					loadJS(js, f);
				}
			}
		};
		e[aEL]("click", h_e);
	}
};
document.ready().then(manageVKLikeButton);
/*!
 * load or refresh disqus_thread on click
 */
var loadRefreshDisqus = function () {
	"use strict";
	var w = globalRoot,
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
		c[cL].add(is_active);
		setStyleDisplayNone(btn);
		LoadingSpinner.hide();
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
		setStyleDisplayNone(btn[pN]);
	};
	if (c && btn && n && p) {
		/* console.log("triggered function: loadRefreshDisqus"); */
		if ("undefined" !== typeof getHTTP && getHTTP()) {
			LoadingSpinner.show();
			if (scriptIsLoaded(js)) {
				k();
			} else {
				v();
			}
		} else {
			z();
		}
	}
},
manageDisqusButton = function () {
	"use strict";
	var c = BALA.one("#disqus_thread") || "",
	e = c ? (BALA.one(".btn-show-disqus") || "") : "",
	aEL = "addEventListener",
	rEL = "removeEventListener",
	h_e = function (ev) {
		ev.stopPropagation();
		ev.preventDefault();
		e[rEL]("click", h_e);
		loadRefreshDisqus();
	};
	if (c && e) {
		/* console.log("triggered function: manageDisqusButton"); */
		e[aEL]("click", h_e);
	}
};
/*!
 * load Yandex map
 * tech.yandex.ru/maps/jsbox/2.1/mapbasics
 */
var myMap,
initYandexMap = function (a) {
	"use strict";
	var c = BALA.one(a) || "",
	is_active = "is-active",
	ds = "dataset",
	cL = "classList",
	pN = "parentNode",
	aEL = "addEventListener",
	rEL = "removeEventListener",
	f = c ? (c[ds].center || "") : "",
	z = c ? (c[ds].zoom || "") : "",
	b_s = c ? (BALA.one(c[ds].btnShow) || "") : "",
	b_d = c ? (BALA.one(c[ds].btnDestroy) || "") : "",
	js = getHTTP(!0) + "://api-maps.yandex.ru/2.1/?lang=ru_RU",
	init = function () {
		if (myMap) {
			myMap.destroy();
		}
		try {
			myMap = new ymaps.Map(c.id, {
					center : JSON.parse(f),
					zoom : z
				});
		} catch (e) {
			setStyleDisplayBlock(b_s);
		}
	},
	g = function () {
		c[pN][cL].add(is_active);
		setStyleDisplayNone(b_s);
		LoadingSpinner.hide();
	},
	k = function () {
		try {
			ymaps.ready(init);
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
	h_b_d = function (ev) {
		ev.stopPropagation();
		ev.preventDefault();
		b_d[rEL]("click", h_b_d);
		if (myMap) {
			myMap.destroy();
		}
	};
	if (c && f && z && b_s) {
		/* console.log("triggered function: initYandexMap"); */
		if ("undefined" !== typeof getHTTP && getHTTP()) {
			if (b_d) {
				b_d[aEL]("click", h_b_d);
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
},
manageYandexMapButton = function (a) {
	"use strict";
	var c = BALA.one(a) || "",
	ds = "dataset",
	aEL = "addEventListener",
	rEL = "removeEventListener",
	e = c ? (BALA.one(c[ds].btnShow) || "") : "",
	h_e = function (ev) {
		ev.stopPropagation();
		ev.preventDefault();
		e[rEL]("click", h_e);
		initYandexMap(a);
		return !1;
	};
	if (c && e) {
		/* console.log("triggered function: manageYandexMapButton"); */
		e[aEL]("click", h_e);
	}
};
/*!
 * init Pages Kamil autocomplete
 * @see {@link https://github.com/oss6/kamil/wiki/Example-with-label:link-json-and-typo-correct-suggestion}
 */
var initKamilAutocomplete = function () {
	"use strict";
	var w = globalRoot,
	d = document,
	gEBI = "getElementById",
	search_form = BALA.one(".search-form") || "",
	id = "#text",
	text = BALA.one(id) || "",
	outsideContainer = d[gEBI]("container") || "",
	_ul_id = "kamil-typo-autocomplete",
	_ul_class = "kamil-autocomplete",
	jsn = "../libs/contents/json/contents.json",
	cL = "classList",
	aEL = "addEventListener",
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
			handleTypoSuggestions = function () {
				setStyleDisplayNone(_ul);
				setStyleDisplayNone(_li);
			},
			showTypoSuggestions = function () {
				setStyleDisplayBlock(_ul);
				setStyleDisplayBlock(_li);
			};
			_ul[cL].add(_ul_class);
			_ul.id = _ul_id;
			handleTypoSuggestions();
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
					if (v.match(/^\s*$/)) {
						handleTypoSuggestions();
					}
					if (text.value.length < 3 || text.value.match(/^\s*$/)) {
						handleTypoSuggestions();
					}
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
			 * set text input value from typo suggestion
			 */
			var h_li = function (ev) {
				ev.stopPropagation();
				ev.preventDefault();
				/*!
				 * set focus first, then set text
				 */
				text.focus();
				text.value = _li.firstChild.textContent || "";
				setStyleDisplayNone(_ul);
			};
			_li[aEL]("click", h_li);
			/*!
			 * hide suggestions on outside click
			 */
			if (outsideContainer) {
				outsideContainer[aEL]("click", handleTypoSuggestions);
			}
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
					handleTypoSuggestions();
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
		/* console.log("triggered function: initKamilAutocomplete"); */
		v();
	}
},
loadInitKamilAutocomplete = function () {
	"use strict";
	var js = "../cdn/kamil/0.1.1/js/kamil.fixed.min.js";
	if (!scriptIsLoaded(js)) {
		loadJS(js, initKamilAutocomplete);
	}
};
document.ready().then(loadInitKamilAutocomplete);
/*!
 * init ui-totop
 */
var initUiTotop = function () {
	"use strict";
	var w = globalRoot,
	b = BALA.one("body") || "",
	h = BALA.one("html") || "",
	u = "ui-totop",
	is_active = "is-active",
	t = "Наверх",
	cL = "classList",
	aEL = "addEventListener",
	k = function () {
		var _this = this;
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
		/*jshint -W107 */
		a.href = "javascript:void(0);";
		/*jshint +W107 */
		a.title = t;
		a[cL].add(u);
		a[aEL]("click", h_a);
		crel(b, crel(a));
		w[aEL]("scroll", k);
	};
	if (b) {
		/* console.log("triggered function: initUiTotop"); */
		g();
	}
};
document.ready().then(initUiTotop);
/*!
 * init routie
 * @param {String} ctx HTML id string
 */
var initRoutie = function () {
	"use strict";
	var appContentSelector = "#app-content",
	appContent = BALA.one(appContentSelector) || "",
	pN = "parentNode",
	appContentParent = appContent[pN] || "",
	loadVirtualPage = function (c, h, f) {
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
		manageYandexMapButton("#ymap");
		manageDisqusButton(appContentParent);
		manageExternalLinks(appContentParent);
		manageDataTargetLinks(appContentParent);
		manageImgLightboxLinks(appContentParent);
		manageDataSrcImages(appContentParent);
		loadManageDataQrcodeImg(appContentParent);
		manageChaptersSelect(appContentParent);
		manageExpandingLayers(appContentParent);
	},
	loadNotFoundPage = function (a) {
		var c = BALA.one(a) || "",
		s = crel("div", {
				"class": "padded-content"
			}, crel("div", {
					"class": "col"
				}, crel("div", {
						"class": "row"
					}, crel("div", {
							"class": "column"
						}, crel("p", "Нет такой страницы. ", crel("a", {
									"href": "#/home"
								}, "Исправить?"))))));
		if (c) {
			LoadingSpinner.show();
			removeChildren(c);
			appendFragment(s, c);
			reinitVirtualPage(" - Нет такой страницы");
		}
	};
	/*!
	 * init routie
	 * "#" => ""
	 * "#/" => "/"
	 * "#/home" => "/home"
	 */
	if (appContent) {
		/* console.log("triggered function: routie"); */
		routie({
			"": function () {
				loadVirtualPage(appContentSelector, "./includes/home.html", function () {
					reinitVirtualPage(" - Начало");
				});
			},
			"/home": function () {
				loadVirtualPage(appContentSelector, "./includes/home.html", function () {
					reinitVirtualPage(" - Начало");
				});
			},
			"/schedule": function () {
				if ("undefined" !== typeof getHTTP && getHTTP()) {
					loadVirtualPage(appContentSelector, "./includes/schedule.html", function () {
						reinitVirtualPage(" - Расписание");
					});
				}
			},
			"/map": function () {
				if ("undefined" !== typeof getHTTP && getHTTP()) {
					loadVirtualPage(appContentSelector, "./includes/map.html", function () {
						reinitVirtualPage(" - Карта");
					});
				}
			},
			"/level_test": function () {
				loadVirtualPage(appContentSelector, "./includes/level_test.html", function () {
					reinitVirtualPage(" - Уровневый тест");
				});
			},
			"/common_mistakes": function () {
				loadVirtualPage(appContentSelector, "./includes/common_mistakes.html", function () {
					reinitVirtualPage(" - Распространенные ошибки");
				});
			},
			"/demo_ege": function () {
				loadVirtualPage(appContentSelector, "./includes/demo_ege.html", function () {
					reinitVirtualPage(" - Демо-вариант ЕГЭ-11 АЯ (ПЧ)");
				});
			},
			"/demo_ege_speaking": function () {
				loadVirtualPage(appContentSelector, "./includes/demo_ege_speaking.html", function () {
					reinitVirtualPage(" - Демо-вариант ЕГЭ-11 АЯ (УЧ)");
				});
			},
			"/previous_ege_analysis": function () {
				loadVirtualPage(appContentSelector, "./includes/previous_ege_analysis.html", function () {
					reinitVirtualPage(" - ЕГЭ: разбор ошибок");
				});
			},
			"/*": function () {
				loadNotFoundPage(appContentSelector);
			}
		});
	}
};
document.ready().then(initRoutie);
/*!
 * observe mutations
 * bind functions only for inserted DOM
 * @param {String} ctx HTML Element class or id string
 */
/* var observeMutations = function (ctx) {
	"use strict";
	ctx = ctx && ctx.nodeName ? ctx : "";
	var w = globalRoot;
	if (ctx) {
		var g = function (e) {
			var f = function (m) {
				console.log("mutations observer: " + m.type);
				console.log(m.type, "target: " + m.target.tagName + ("." + m.target.className || "#" + m.target.id || ""));
				console.log(m.type, "added: " + m.addedNodes.length + " nodes");
				console.log(m.type, "removed: " + m.removedNodes.length + " nodes");
				if ("childList" === m.type || "subtree" === m.type) {
					mo.disconnect();
				}
			};
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
		mo.observe(ctx, {
			childList: !0,
			subtree: !0,
			attributes: !1,
			characterData: !1
		});
	}
}; */
/*!
 * apply changes to inserted DOM
 * because replace child is used in the first place
 * to insert new content, and if parent node doesnt exist
 * inner html method is applied,
 * the parent node should be observed, not the target
 * node for the insertion
 */
/* var updateInsertedDom = function () {
	"use strict";
	var w = globalRoot,
	h = w.location.hash || "",
	pN = "parentNode",
	ctx = BALA.one("#app-content")[pN] || "";
	if (ctx && h) {
		console.log("triggered function: updateInsertedDom");
		observeMutations(ctx);
	}
};
globalRoot.addEventListener("hashchange", updateInsertedDom); */
/*!
 * init manUP.js
 */
var loadInitManUp = function () {
	"use strict";
	var manUpJsUrl = "/cdn/ManUp.js/0.7/js/manup.fixed.min.js",
	initManUp = function () {
		/* console.log("triggered function: initManUp"); */
	};
	if ("undefined" !== typeof getHTTP && getHTTP()) {
		if (!scriptIsLoaded(manUpJsUrl)) {
			loadJS(manUpJsUrl, initManUp);
		} else {
			initManUp();
		}
	}
};
document.ready().then(loadInitManUp);
/*!
 * show page, finish ToProgress
 */
var showPageFinishProgress = function () {
	"use strict";
	var a = BALA.one("#page") || "",
	g = function () {
		setStyleOpacity(a, 1);
		progressBar.complete();
	},
	k = function () {
		var timers = new Timers();
		timers.interval(function () {
			/* console.log("function showPageFinishProgress => started Interval"); */
			if ("undefined" !== typeof imagesPreloaded && imagesPreloaded) {
				timers.clear();
				timers = null;
				/* console.log("function showPageFinishProgress; imagesPreloaded=" + imagesPreloaded); */
				g();
			}
		}, 100);
	};
	if (a) {
		/* console.log("triggered function: showPageFinishProgress"); */
		if ("undefined" !== typeof imagesPreloaded) {
			k();
		} else {
			g();
		}
	}
};
document.ready().then(showPageFinishProgress);
