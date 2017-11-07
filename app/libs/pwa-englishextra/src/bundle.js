/*jslint browser: true */
/*jslint node: true */
/*global ActiveXObject, alignToMasterBottomLeft, appendFragment,
Carousel, Cookies, debounce, DISQUS, earlyDeviceOrientation,
earlyDeviceSize, earlyDeviceType, earlyFnGetYyyymmdd, earlyHasTouch,
earlySvgasimgSupport, earlySvgSupport, escape, findPos, fixEnRuTypo,
getHTTP, IframeLightbox, imagePromise, imagesPreloaded,
insertExternalHTML, insertTextAsFragment, isValidId, Kamil, loadJS,
loadUnparsedJSON, Masonry, openDeviceBrowser, Packery, parseLink,
Promise, QRCode, removeChildren, require, safelyParseJSON,
scriptIsLoaded, scroll2Top, t, throttle, Timers, truncString, unescape,
verge, VK, Ya */
/*property console, split */
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
 * modified t.js
 * a micro-templating framework in ~400 bytes gzipped
 * @author Jason Mooberry <jasonmoo@me.com>
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
 * @see {@link https://github.com/loele/t.js/blob/2b3ab7039353cc365fb3463f6df08fd00eb3eb3d/t.js}
 * passes jshint
 */
(function(root){"use strict";var blockregex=/\{\{(([@!]?)(.+?))\}\}(([\s\S]+?)(\{\{:\1\}\}([\s\S]+?))?)\{\{\/\1\}\}/g,valregex=/\{\{([=%])(.+?)\}\}/g;var t=function(template){this.t=template;};function scrub(val){return new Option(val).text.replace(/"/g,"&quot;");}function get_value(vars,key){var parts=key.split(".");while(parts.length){if(!(parts[0]in vars)){return false;}vars=vars[parts.shift()];}return vars;}function render(fragment,vars){return fragment.replace(blockregex,function(_,__,meta,key,inner,if_true,has_else,if_false){var val=get_value(vars,key),temp="",i;if(!val){if(meta==="!"){return render(inner,vars);}if(has_else){return render(if_false,vars);}return"";}if(!meta){return render(if_true,vars);}if(meta==="@"){_=vars._key;__=vars._val;for(i in val){if(val.hasOwnProperty(i)){vars._key=i;vars._val=val[i];temp+=render(inner,vars);}}vars._key=_;vars._val=__;return temp;}}).replace(valregex,function(_,meta,key){var val=get_value(vars,key);if(val||val===0){return meta==="%"?scrub(val):val;}return"";});}t.prototype.render=function(vars){return render(this.t,vars);};root.t=t;}(globalRoot));
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
 * Carousel v1.0
 * @see {@link https://habrahabr.ru/post/327246/}
 * @see {@link https://codepen.io/iGetPass/pen/apZPMo}
 */
(function(root){"use strict";var d=document,getElementsByClassName="getElementsByClassName",_addEventListener="addEventListener";var Carousel=function(setting){var _this=this;if(d[getElementsByClassName](setting.wrap)[0]===null){console.error("Carousel not fount selector "+setting.wrap);return;}var privates={};this.prev_slide=function(){--privates.opt.position;if(privates.opt.position<0){privates.opt.position=privates.opt.max_position-1;}privates.sel.wrap.style.transform="translateX(-"+privates.opt.position+"00%)";};this.next_slide=function(){++privates.opt.position;if(privates.opt.position>=privates.opt.max_position){privates.opt.position=0;}privates.sel.wrap.style.transform="translateX(-"+privates.opt.position+"00%)";};privates.setting=setting;privates.sel={"main":d[getElementsByClassName](privates.setting.main)[0],"wrap":d[getElementsByClassName](privates.setting.wrap)[0],"children":d[getElementsByClassName](privates.setting.wrap)[0].children,"prev":d[getElementsByClassName](privates.setting.prev)[0],"next":d[getElementsByClassName](privates.setting.next)[0]};privates.opt={"position":0,"max_position":d[getElementsByClassName](privates.setting.wrap)[0].children.length};if(privates.sel.prev!==null){privates.sel.prev[_addEventListener]("click",function(){_this.prev_slide();});}if(privates.sel.next!==null){privates.sel.next[_addEventListener]("click",function(){_this.next_slide();});}};root.Carousel=Carousel;}(globalRoot));
/*!
 * modified Simple lightbox effect in pure JS
 * @see {@link https://github.com/squeral/lightbox}
 * @see {@link https://github.com/squeral/lightbox/blob/master/lightbox.js}
 * @params {Object} elem Node element
 * @params {Object} [rate] debounce rate, default 500ms
 * new IframeLightbox(elem)
 * passes jshint
 */
(function(root){"use strict";var d=document,_addEventListener="addEventListener",getElementById="getElementById",getElementsByClassName="getElementsByClassName",createElement="createElement",classList="classList",appendChild="appendChild",dataset="dataset",containerClass="iframe-lightbox",isLoadedClass="is-loaded",isOpenedClass="is-opened",isShowingClass="is-showing";var IframeLightbox=function(elem,rate){if(elem.nodeName){this.trigger=elem;this.rate=rate||500;this.el=d[getElementsByClassName](containerClass)[0]||"";this.body=this.el?this.el[getElementsByClassName]("body")[0]:"";this.content=this.el?this.el[getElementsByClassName]("content")[0]:"";this.href=elem[dataset].src||"";this.paddingBottom=elem[dataset].paddingBottom||"";this.init();}else{return;}};IframeLightbox.prototype.init=function(){var _this=this;if(!this.el){this.create();}var debounce=function(func,wait){var timeout,args,context,timestamp;return function(){context=this;args=[].slice.call(arguments,0);timestamp=new Date();var later=function(){var last=(new Date())-timestamp;if(last<wait){timeout=setTimeout(later,wait-last);}else{timeout=null;func.apply(context,args);}};if(!timeout){timeout=setTimeout(later,wait);}};};var handleOpenIframeLightbox=function(e){e.preventDefault();_this.open();};var debounceHandleOpenIframeLightbox=debounce(handleOpenIframeLightbox,this.rate);this.trigger[_addEventListener]("click",debounceHandleOpenIframeLightbox);};IframeLightbox.prototype.create=function(){var _this=this,bd=d[createElement]("div");this.el=d[createElement]("div");this.content=d[createElement]("div");this.body=d[createElement]("div");this.el[classList].add(containerClass);bd[classList].add("backdrop");this.content[classList].add("content");this.body[classList].add("body");this.el[appendChild](bd);this.content[appendChild](this.body);this.contentHolder=d[createElement]("div");this.contentHolder[classList].add("content-holder");this.contentHolder[appendChild](this.content);this.el[appendChild](this.contentHolder);d.body[appendChild](this.el);bd[_addEventListener]("click",function(){_this.close();});var clearBody=function(){if(_this.isOpen()){return;}_this.el[classList].remove(isShowingClass);_this.body.innerHTML="";};this.el[_addEventListener]("transitionend",clearBody,false);this.el[_addEventListener]("webkitTransitionEnd",clearBody,false);this.el[_addEventListener]("mozTransitionEnd",clearBody,false);this.el[_addEventListener]("msTransitionEnd",clearBody,false);};IframeLightbox.prototype.loadIframe=function(){this.iframeId=containerClass+Date.now();this.body.innerHTML='<iframe src="'+this.href+'" name="'+this.iframeId+'" id="'+this.iframeId+'" onload="this.style.opacity=1;" style="opacity:0;border:none;" scrolling="no" webkitallowfullscreen="true" mozallowfullscreen="true" allowfullscreen="true" frameborder="no" title="Embedded Content"></iframe>';(function(iframeId,body){d[getElementById](iframeId).onload=function(){this.style.opacity=1;body[classList].add(isLoadedClass);};}(this.iframeId,this.body));};IframeLightbox.prototype.open=function(){this.loadIframe();if(this.paddingBottom){this.content.style.paddingBottom=this.paddingBottom;}else{this.content.removeAttribute("style");}this.el[classList].add(isShowingClass);this.el[classList].add(isOpenedClass);};IframeLightbox.prototype.close=function(){this.el[classList].remove(isOpenedClass);this.body[classList].remove(isLoadedClass);};IframeLightbox.prototype.isOpen=function(){return this.el[classList].contains(isOpenedClass);};root.IframeLightbox=IframeLightbox;}(globalRoot));
/*!
 * modified scrollToY
 * @see {@link http://stackoverflow.com/questions/8917921/cross-browser-javascript-not-jquery-scroll-to-top-animation}
 * passes jshint
 */
(function(root){"use strict";var scroll2Top=function(scrollTargetY,speed,easing){var scrollY=root.scrollY||document.documentElement.scrollTop;scrollTargetY=scrollTargetY||0;speed=speed||2000;easing=easing||'easeOutSine';var currentTime=0;var time=Math.max(0.1,Math.min(Math.abs(scrollY-scrollTargetY)/speed,0.8));var easingEquations={easeOutSine:function(pos){return Math.sin(pos*(Math.PI/2));},easeInOutSine:function(pos){return(-0.5*(Math.cos(Math.PI*pos)-1));},easeInOutQuint:function(pos){if((pos/=0.5)<1){return 0.5*Math.pow(pos,5);}return 0.5*(Math.pow((pos-2),5)+2);}};function tick(){currentTime+=1/60;var p=currentTime/time;var t=easingEquations[easing](p);if(p<1){requestAnimationFrame(tick);root.scrollTo(0,scrollY+((scrollTargetY-scrollY)*t));}else{root.scrollTo(0,scrollTargetY);}}tick();};root.scroll2Top=scroll2Top;}(globalRoot));
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
(function(root){"use strict";var Cookies=(function(){function extend(){var i=0;var result={};for(;i<arguments.length;i++){var attributes=arguments[i];for(var key in attributes){if(attributes.hasOwnProperty(key)){result[key]=attributes[key];}}}return result;}function init(converter){var api=function(key,value,attributes){var _this=this;var result;if(typeof document==="undefined"){return;}if(arguments.length>1){attributes=extend({path:'/'},api.defaults,attributes);if(typeof attributes.expires==="number"){var expires=new Date();expires.setMilliseconds(expires.getMilliseconds()+attributes.expires*864e+5);attributes.expires=expires;}try{result=JSON.stringify(value);if(/^[\{\[]/.test(result)){value=result;}}catch(e){}if(!converter.write){value=encodeURIComponent(String(value)).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g,decodeURIComponent);}else{value=converter.write(value,key);}key=encodeURIComponent(String(key));key=key.replace(/%(23|24|26|2B|5E|60|7C)/g,decodeURIComponent);key=key.replace(/[\(\)]/g,escape);var ret=(document.cookie=[key,'=',value,attributes.expires?'; expires='+attributes.expires.toUTCString():'',attributes.path?'; path='+attributes.path:'',attributes.domain?'; domain='+attributes.domain:'',attributes.secure?'; secure':''].join(''));return ret;}if(!key){result={};}var cookies=document.cookie?document.cookie.split("; "):[];var rdecode=/(%[0-9A-Z]{2})+/g;var i=0;for(;i<cookies.length;i++){var parts=cookies[i].split('=');var cookie=parts.slice(1).join('=');if(cookie.charAt(0)==='"'){cookie=cookie.slice(1,-1);}try{var name=parts[0].replace(rdecode,decodeURIComponent);cookie=converter.read?converter.read(cookie,name):converter(cookie,name)||cookie.replace(rdecode,decodeURIComponent);if(_this.json){try{cookie=JSON.parse(cookie);}catch(e){}}if(key===name){result=cookie;break;}if(!key){result[name]=cookie;}}catch(e){}}return result;};api.set=api;api.get=function(key){return api.call(api,key);};api.getJSON=function(){return api.apply({json:true},[].slice.call(arguments));};api.defaults={};api.remove=function(key,attributes){api(key,'',extend(attributes,{expires:-1}));};api.withConverter=init;return api;}return init(function(){});}());root.Cookies=Cookies;}(globalRoot));
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
(function(root){"use strict";var d=root.document;d.ready=function(chainVal){var loaded=(/^loaded|^i|^c/).test(d.readyState),DOMContentLoaded="DOMContentLoaded",load="load";return new Promise(function(resolve){if(loaded){return resolve(chainVal);}function onReady(){resolve(chainVal);d.removeEventListener(DOMContentLoaded,onReady);root.removeEventListener(load,onReady);}d.addEventListener(DOMContentLoaded,onReady);root.addEventListener(load,onReady);});};}(globalRoot));
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
(function(root,undefined){var debounce=function(func,wait,immediate){var timeout,args,context,timestamp,result;if(undefined===wait||null===wait){wait=100;}function later(){var last=Date.now()-timestamp;if(last<wait&&last>=0){timeout=setTimeout(later,wait-last);}else{timeout=null;if(!immediate){result=func.apply(context,args);context=args=null;}}}var debounced=function(){context=this;args=arguments;timestamp=Date.now();var callNow=immediate&&!timeout;if(!timeout){timeout=setTimeout(later,wait);}if(callNow){result=func.apply(context,args);context=args=null;}return result;};debounced.clear=function(){if(timeout){clearTimeout(timeout);timeout=null;}};debounced.flush=function(){if(timeout){result=func.apply(context,args);context=args=null;clearTimeout(timeout);timeout=null;}};return debounced;};root.debounce=debounce;}(globalRoot));
/*!
 * modified Returns a new function that, when invoked, invokes `func` at most once per `wait` milliseconds.
 * @param {Function} func Function to wrap.
 * @param {Number} wait Number of milliseconds that must elapse between `func` invocations.
 * @return {Function} A new function that wraps the `func` function passed in.
 * @see {@link https://github.com/component/throttle/blob/master/index.js}
 * passes jshint
 */
(function(root,undefined){var throttle=function(func,wait){var ctx;var args;var rtn;var timeoutID;var last=0;function call(){timeoutID=0;last=+new Date();rtn=func.apply(ctx,args);ctx=null;args=null;}return function throttled(){ctx=this;args=arguments;var delta=new Date()-last;if(!timeoutID){if(delta>=wait){call();}else{timeoutID=setTimeout(call,wait-delta);}}return rtn;};};root.throttle=throttle;}(globalRoot));
/*!
 * parse JSON without try / catch
 * @param {String} a JSON string
 * @see {@link http://stackoverflow.com/questions/11182924/how-to-check-if-javascript-object-is-json}
 * safelyParseJSON(a)
 */
(function(root){"use strict";var safelyParseJSON=function(a){var isJson=function(obj){var t=typeof obj;return['boolean','number',"string",'symbol',"function"].indexOf(t)===-1;};if(!isJson(a)){return JSON.parse(a);}else{return a;}};root.safelyParseJSON=safelyParseJSON;}(globalRoot));
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
 * set position of slave element to bottom left of master
 * @param {String} masterId id string
 * @param {String} servantId id string
 * @param {Boolean} [sameWidth] set same width as of master, default is false
 * alignToMasterBottomLeft(masterId, servantId, sameWidth)
 */
(function(root){var alignToMasterBottomLeft=function(masterId,servantId,sameWidth){sameWidth=sameWidth||"";var d=document,getElementById="getElementById",master=d[getElementById](masterId)||"",servant=d[getElementById](servantId)||"";if(master&&servant){var style=servant.style||"";if(style){if(sameWidth){style.width=servant.offsetWidth+"px";}style.left=master.offsetLeft+"px";style.top=(master.offsetTop+master.offsetHeight)+"px";}}};root.alignToMasterBottomLeft=alignToMasterBottomLeft;}(globalRoot));
/*!
 * remove all children of parent element
 * @see {@link https://gist.github.com/englishextra/da26bf39bc90fd29435e8ae0b409ddc3}
 * @param {Object} e parent HTML Element
 * removeChildren(e)
 */
(function(root){"use strict";var removeChildren=function(e){return (function(){if(e&&e.firstChild){for(;e.firstChild;){e.removeChild(e.firstChild);}}}());};root.removeChildren=removeChildren;}(globalRoot));
/*!
 * append node into other with fragment
 * @see {@link https://gist.github.com/englishextra/0ff3204d5fb285ef058d72f31e3af766}
 * @param {String|object} e an HTML Element to append
 * @param {Object} a target HTML Element
 * appendFragment(e,a)
 */
(function(root){"use strict";var appendFragment=function(e,a){var d=document;a=a||d.getElementsByTagNames("body")[0]||"";return (function(){if(e){var d=document,df=d.createDocumentFragment()||"",appendChild="appendChild";if("string"===typeof e){e=d.createTextNode(e);}df[appendChild](e);a[appendChild](df);}}());};root.appendFragment=appendFragment;}(globalRoot));
/*!
 * insert text response as fragment into element
 * @see {@link https://gist.github.com/englishextra/4e13afb8ce184ad28d77f6b5eed71d1f}
 * @param {String} text text/response to insert
 * @param {Object} container target HTML Element
 * @param {Object} [callback] callback function
 * insertTextAsFragment(t,c,f)
 */
(function(root){"use strict";var insertTextAsFragment=function(text,container,callback){var d=document,b=d.body||"",appendChild="appendChild",innerHTML="innerHTML",parentNode="parentNode",cb=function(){return callback&&"function"===typeof callback&&callback();};try{var clonedContainer=container.cloneNode(!1);if(d.createRange){var rg=d.createRange();rg.selectNode(b);var df=rg.createContextualFragment(text);clonedContainer[appendChild](df);return container[parentNode]?container[parentNode].replaceChild(clonedContainer,container):container[innerHTML]=text,cb();}else{clonedContainer[innerHTML]=text;return container[parentNode]?container[parentNode].replaceChild(d.createDocumentFragment[appendChild](clonedContainer),container):container[innerHTML]=text,cb();}}catch(e){console.log(e);}return!1;};root.insertTextAsFragment=insertTextAsFragment;}(globalRoot));
/*!
 * get current protocol - "http" or "https", else return ""
 * @param {Boolean} [force] When set to "true", and the result is empty,
 * the function will return "http"
 * getHTTP(true)
 */
(function(root){"use strict";var getHTTP=(function(type){return function(force){force=force||"";return"http:"===type?"http":"https:"===type?"https":force?"http":"";};}(root.location.protocol||""));root.getHTTP=getHTTP;}(globalRoot));
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
/*jshint bitwise: false */
(function(root){"use strict";var parseLink=function(url,full){full=full||!1;return (function(){var _r=function(s){return s.replace(/^(#|\?)/,"").replace(/\:$/,"");},l=location||"",_p=function(protocol){switch(protocol){case"http:":return full?":"+80:80;case"https:":return full?":"+443:443;default:return full?":"+l.port:l.port;}},_s=(0===url.indexOf("//")||!!~url.indexOf("://")),w=root.location||"",_o=function(){var o=w.protocol+"//"+w.hostname+(w.port?":"+w.port:"");return o||"";},_c=function(){var c=document.createElement("a");c.href=url;var v=c.protocol+"//"+c.hostname+(c.port?":"+c.port:"");return v!==_o();},a=document.createElement("a");a.href=url;return{href:a.href,origin:_o(),host:a.host||l.host,port:("0"===a.port||""===a.port)?_p(a.protocol):(full?a.port:_r(a.port)),hash:full?a.hash:_r(a.hash),hostname:a.hostname||l.hostname,pathname:a.pathname.charAt(0)!=="/"?(full?"/"+a.pathname:a.pathname):(full?a.pathname:a.pathname.slice(1)),protocol:!a.protocol||":"===a.protocol?(full?l.protocol:_r(l.protocol)):(full?a.protocol:_r(a.protocol)),search:full?a.search:_r(a.search),query:full?a.search:_r(a.search),isAbsolute:_s,isRelative:!_s,isCrossDomain:_c(),hasHTTP:/^(http|https):\/\//i.test(url)?!0:!1};}());};root.parseLink=parseLink;}(globalRoot));
/*jshint bitwise: true */
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
(function(root){"use strict";var imagePromise=function(s){if(root.Promise){return new Promise(function(y,n){var f=function(e,p){e.onload=function(){y(p);};e.onerror=function(){n(p);};e.src=p;};if("string"===typeof s){var a=new Image();f(a,s);}else{if("img"!==s.tagName){return Promise.reject();}else{if(s.src){f(s,s.src);}}}});}else{throw new Error("Promise is not in "+root);}};root.imagePromise=imagePromise;}(globalRoot));
/*!
 * How can I check if a JS file has been included already?
 * @see {@link https://gist.github.com/englishextra/403a0ca44fc5f495400ed0e20bc51d47}
 * @see {@link https://stackoverflow.com/questions/18155347/how-can-i-check-if-a-js-file-has-been-included-already}
 * @param {String} s path string
 * scriptIsLoaded(s)
 */
(function(root){"use strict";var scriptIsLoaded=function(s){for(var b=document.getElementsByTagName("script")||"",a=0;a<b.length;a+=1){if(b[a].getAttribute("src")===s){return!0;}}return!1;};root.scriptIsLoaded=scriptIsLoaded;}(globalRoot));
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
(function(root){"use strict";var loadUnparsedJSON=function(url,callback,onerror){var cb=function(string){return callback&&"function"===typeof callback&&callback(string);},x=root.XMLHttpRequest?new XMLHttpRequest():new ActiveXObject("Microsoft.XMLHTTP");x.overrideMimeType("application/json;charset=utf-8");x.open("GET",url,!0);x.withCredentials=!1;x.onreadystatechange=function(){if(x.status==="404"||x.status===0){console.log("Error XMLHttpRequest-ing file",x.status);return onerror&&"function"===typeof onerror&&onerror();}else if(x.readyState===4&&x.status===200&&x.responseText){cb(x.responseText);}};x.send(null);};root.loadUnparsedJSON=loadUnparsedJSON;}(globalRoot));
/*!
 * insert External HTML
 * @param {String} id Target Element id
 * @param {String} url path string
 * @param {Object} [callback] callback function
 * @param {Object} [onerror] on error callback function
 * insertExternalHTML(selector,url,callback,onerror)
 */
(function(root){"use strict";var insertExternalHTML=function(id,url,callback,onerror){var d=document,b=d.body||"",getElementById="getElementById",cN="cloneNode",appendChild="appendChild",parentNode="parentNode",innerHTML="innerHTML",replaceChild="replaceChild",createRange="createRange",createContextualFragment="createContextualFragment",createDocumentFragment="createDocumentFragment",container=d[getElementById](id.replace(/^#/,""))||"",arrange=function(){var x=root.XMLHttpRequest?new XMLHttpRequest():new ActiveXObject("Microsoft.XMLHTTP");x.overrideMimeType("text/html;charset=utf-8");x.open("GET",url,!0);x.withCredentials=!1;x.onreadystatechange=function(){var cb=function(){return callback&&"function"===typeof callback&&callback();};if(x.status==="404"||x.status===0){console.log("Error XMLHttpRequest-ing file",x.status);return onerror&&"function"===typeof onerror&&onerror();}else if(x.readyState===4&&x.status===200&&x.responseText){var frag=x.responseText;try{var clonedContainer=container[cN](!1);if(d[createRange]){var rg=d[createRange]();rg.selectNode(b);var df=rg[createContextualFragment](frag);clonedContainer[appendChild](df);return container[parentNode]?container[parentNode][replaceChild](clonedContainer,container):container[innerHTML]=frag,cb();}else{clonedContainer[innerHTML]=frag;return container[parentNode]?container[parentNode][replaceChild](d[createDocumentFragment][appendChild](clonedContainer),container):container[innerHTML]=frag,cb();}}catch(e){console.log(e);}return;}};x.send(null);};if(container){arrange();}};root.insertExternalHTML=insertExternalHTML;}(globalRoot));
/*!
 * Open external links in default browser out of Electron / nwjs
 * @see {@link https://gist.github.com/englishextra/b9a8140e1c1b8aa01772375aeacbf49b}
 * @see {@link https://stackoverflow.com/questions/32402327/how-can-i-force-external-links-from-browser-window-to-open-in-a-default-browser}
 * @see {@link https://github.com/nwjs/nw.js/wiki/shell}
 * electron - file: | nwjs - chrome-extension: | http: Intel XDK
 * wont do in electron and nw,
 * so manageExternalLinkAll will set target blank to links
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
	var d = document;
	var b = d.body || "";
	var getElementsByClassName = "getElementsByClassName";
	var classList = "classList";
	var createElement = "createElement";
	var spinnerClass = "loading-spinner";
	var spinner = d[getElementsByClassName](spinnerClass)[0] || "";
	var isActiveClass = "is-active-loading-spinner";
	if (!spinner) {
		spinner = d[createElement]("div");
		spinner[classList].add(spinnerClass);
		appendFragment(spinner, b);
	}
	return {
		show: function () {
			return b[classList].contains(isActiveClass) || b[classList].add(isActiveClass);
		},
		hide: function (callback, timeout) {
			var delay = timeout || 500;
			var timers = new Timers();
			timers.timeout(function () {
				timers.clear();
				timers = null;
				b[classList].remove(isActiveClass);
				if (callback && "function" === typeof callback) {
					callback();
				}
			}, delay);
		}
	};
}
());
/*!
 * render template
 * @requires t.js
 * @requires safelyParseJSON
 */
var renderTemplate = function (parsedJson, templateId, targetId) {
	"use strict";
	var d = document;
	var getElementById = "getElementById";
	var template = d[getElementById](templateId) || "";
	var target = d[getElementById](targetId) || "";
	parsedJson = safelyParseJSON(parsedJson);
	if (parsedJson && template && target) {
		var targetHtml = template.innerHTML || "",
		renderTargetTemplate = new t(targetHtml);
		return renderTargetTemplate.render(parsedJson);
	}
	return {};
};
/*!
 * insert as fragment from template
 * @requires renderTemplate
 * @requires insertTextAsFragment
 */
var insertFromTemplate = function (parsedJson, templateId, targetId, callback, useInner) {
	"use strict";
	useInner = useInner || "";
	var d = document;
	var getElementById = "getElementById";
	var template = d[getElementById](templateId) || "";
	var target = d[getElementById](targetId) || "";
	var cb = function () {
		return callback && "function" === typeof callback && callback();
	};
	if (parsedJson && template && target) {
		var targetRendered = renderTemplate(parsedJson, templateId, targetId);
		if (useInner) {
			target.innerHTML = targetRendered;
			cb();
		} else {
			insertTextAsFragment(targetRendered, target, cb);
		}
	}
};
/*!
 * replace img src with data-src
 * initiate on load, not on ready
 */
var handleDataSrcImageAll = function () {
	"use strict";
	var d = document;
	var getElementsByClassName = "getElementsByClassName";
	var classList = "classList";
	var dataset = "dataset";
	var imgClass = "data-src-img";
	var img = d[getElementsByClassName](imgClass) || "";
	var isActiveClass = "is-active";
	var isBindedClass = "is-binded";
	var arrange = function (e) {
		/*!
		 * true if elem is in same y-axis as the viewport or within 100px of it
		 * @see {@link https://github.com/ryanve/verge}
		 */
		if (verge.inY(e, 100) /* && 0 !== e.offsetHeight */) {
			if (!e[classList].contains(isBindedClass)) {
				var srcString = e[dataset].src || "";
				if (srcString) {
					if (parseLink(srcString).isAbsolute && !parseLink(srcString).hasHTTP) {
						e[dataset].src = srcString.replace(/^/, getHTTP(true) + ":");
						srcString = e[dataset].src;
					}
					imagePromise(srcString).then(function () {
						e.src = srcString;
					}).catch (function (err) {
						console.log("cannot load image with imagePromise:", srcString, err);
					});
					e[classList].add(isActiveClass);
					e[classList].add(isBindedClass);
				}
			}
		}
	};
	if (img) {
		for (var i = 0, l = img.length; i < l; i += 1) {
			arrange(img[i]);
		}
		/* forEach(img, arrange, false); */
	}
},
handleDataSrcImageAllWindow = function () {
	var throttleHandleDataSrcImageAll = throttle(handleDataSrcImageAll, 100);
	throttleHandleDataSrcImageAll();
},
manageDataSrcImageAll = function () {
	"use strict";
	var w = globalRoot;
	var _addEventListener = "addEventListener";
	var _removeEventListener = "removeEventListener";
	w[_removeEventListener]("scroll", handleDataSrcImageAllWindow, {passive: true});
	w[_removeEventListener]("resize", handleDataSrcImageAllWindow);
	w[_addEventListener]("scroll", handleDataSrcImageAllWindow, {passive: true});
	w[_addEventListener]("resize", handleDataSrcImageAllWindow);
	var timers = new Timers();
	timers.timeout(function () {
		timers.clear();
		timers = null;
		handleDataSrcImageAll();
	}, 500);
};
/*!
 * on load, not on ready
 */
globalRoot.addEventListener("load", manageDataSrcImageAll);
/*!
 * replace iframe src with data-src
 */
var handleDataSrcIframeAll = function () {
	"use strict";
	var d = document;
	var getElementsByClassName = "getElementsByClassName";
	var classList = "classList";
	var dataset = "dataset";
	var setAttribute = "setAttribute";
	var iframeClass = "data-src-iframe";
	var iframe = d[getElementsByClassName](iframeClass) || "";
	var isBindedClass = "is-binded";
	var arrange = function (e) {
		/*!
		 * true if elem is in same y-axis as the viewport or within 100px of it
		 * @see {@link https://github.com/ryanve/verge}
		 */
		if (verge.inY(e, 100) /* && 0 !== e.offsetHeight */) {
			if (!e[classList].contains(isBindedClass)) {
				var srcString = e[dataset].src || "";
				if (srcString) {
					if (parseLink(srcString).isAbsolute && !parseLink(srcString).hasHTTP) {
						e[dataset].src = srcString.replace(/^/, getHTTP(true) + ":");
						srcString = e[dataset].src;
					}
					e.src = srcString;
					e[classList].add(isBindedClass);
					e[setAttribute]("frameborder", "no");
					e[setAttribute]("style", "border:none;");
					e[setAttribute]("webkitallowfullscreen", "true");
					e[setAttribute]("mozallowfullscreen", "true");
					e[setAttribute]("scrolling", "no");
					e[setAttribute]("allowfullscreen", "true");
				}
			}
		}
	};
	if (iframe) {
		for (var i = 0, l = iframe.length; i < l; i += 1) {
			arrange(iframe[i]);
		}
		/* forEach(iframe, arrange, false); */
	}
},
handleDataSrcIframeAllWindow = function () {
	var throttlehandleDataSrcIframeAll = throttle(handleDataSrcIframeAll, 100);
	throttlehandleDataSrcIframeAll();
},
manageDataSrcIframeAll = function () {
	"use strict";
	var w = globalRoot;
	var _addEventListener = "addEventListener";
	var _removeEventListener = "removeEventListener";
	w[_removeEventListener]("scroll", handleDataSrcIframeAllWindow, {passive: true});
	w[_removeEventListener]("resize", handleDataSrcIframeAllWindow);
	w[_addEventListener]("scroll", handleDataSrcIframeAllWindow, {passive: true});
	w[_addEventListener]("resize", handleDataSrcIframeAllWindow);
	var timers = new Timers();
	timers.timeout(function () {
		timers.clear();
		timers = null;
		handleDataSrcIframeAll();
	}, 500);
};
/*!
 * on load, not on ready
 */
globalRoot.addEventListener("load", manageDataSrcIframeAll);
/*!
 * replace iframe src with data-src
 * @param {Object} [ctx] context HTML Element
 */
var manageIframeLightboxLinks = function (scope) {
	"use strict";
	var ctx = scope && scope.nodeName ? scope : "";
	var d = document;
	var getElementsByClassName = "getElementsByClassName";
	var classList = "classList";
	var linkClass = "iframe-lightbox-link";
	var link = ctx ? ctx[getElementsByClassName](linkClass) || "" : d[getElementsByClassName](linkClass) || "";
	var isBindedClass = "is-binded";
	var arrange = function (e) {
		if (!e[classList].contains(isBindedClass)) {
			e.lightbox = new IframeLightbox(e);
			e[classList].add(isBindedClass);
		}
	};
	if (link) {
		for (var i = 0, l = link.length; i < l; i += 1) {
			arrange(link[i]);
		}
		/* forEach(link, arrange, false); */
	}
};
document.ready().then(manageIframeLightboxLinks);
/*!
 * set click event on external links,
 * so that they open in new browser tab
 * @param {Object} [ctx] context HTML Element
 */
var handleExternalLink = function (url, ev) {
	"use strict";
	ev.stopPropagation();
	ev.preventDefault();
	var logicHandleExternalLink = openDeviceBrowser.bind(null, url);
	var debounceLogicHandleExternalLink = debounce(logicHandleExternalLink, 200);
	debounceLogicHandleExternalLink();
},
manageExternalLinkAll = function (scope) {
	"use strict";
	var ctx = scope && scope.nodeName ? scope : "";
	var d = document;
	var getElementsByTagName = "getElementsByTagName";
	var getAttribute = "getAttribute";
	var classList = "classList";
	var _addEventListener = "addEventListener";
	var linkTag = "a";
	var link = ctx ? ctx[getElementsByTagName](linkTag) || "" : d[getElementsByTagName](linkTag) || "";
	var isBindedClass = "is-binded";
	var arrange = function (e) {
		if (!e[classList].contains(isBindedClass)) {
			var url = e[getAttribute]("href") || "";
			if (url && parseLink(url).isCrossDomain && parseLink(url).hasHTTP) {
				e.title = "" + (parseLink(url).hostname || "") + " откроется в новой вкладке";
				if ("undefined" !== typeof getHTTP && getHTTP()) {
					e.target = "_blank";
					e.rel = "noopener";
				} else {
					e[_addEventListener]("click", handleExternalLink.bind(null, url));
				}
				e[classList].add(isBindedClass);
			}
		}
	};
	if (link) {
		for (var i = 0, l = link.length; i < l; i += 1) {
			arrange(link[i]);
		}
		/* forEach(link, arrange, false); */
	}
};
document.ready().then(manageExternalLinkAll);
/*!
 * manage data lightbox img links
 */
var hideImgLightbox = function () {
	"use strict";
	var d = document;
	var getElementsByClassName = "getElementsByClassName";
	var getElementsByTagName = "getElementsByTagName";
	var classList = "classList";
	var container = d[getElementsByClassName]("img-lightbox-container")[0] || "";
	var img = container ? container[getElementsByTagName]("img")[0] || "" : "";
	var an = "animated";
	var an1 = "fadeIn";
	var an2 = "fadeInUp";
	var an3 = "fadeOut";
	var an4 = "fadeOutDown";
	var dummySrc = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
	var hideContainer = function () {
		container[classList].remove(an1);
		container[classList].add(an3);
		var hideImg = function () {
			container[classList].remove(an);
			container[classList].remove(an3);
			img[classList].remove(an);
			img[classList].remove(an4);
			img.src = dummySrc;
			container.style.display = "none";
		};
		var timers = new Timers();
		timers.timeout(function () {
			timers.clear();
			timers = null;
			hideImg();
		}, 400);
	};
	if (container && img) {
		img[classList].remove(an2);
		img[classList].add(an4);
		var timers = new Timers();
		timers.timeout(function () {
			timers.clear();
			timers = null;
			hideContainer();
		}, 400);
	}
},
handleImgLightboxContainer = function () {
	"use strict";
	var d = document;
	var getElementsByClassName = "getElementsByClassName";
	var _removeEventListener = "removeEventListener";
	var container = d[getElementsByClassName]("img-lightbox-container")[0] || "";
	if (container) {
		container[_removeEventListener]("click", handleImgLightboxContainer);
		hideImgLightbox();
	}
},
handleImgLightboxWindow = function (ev) {
	"use strict";
	var w = globalRoot;
	var _removeEventListener = "removeEventListener";
	w[_removeEventListener]("keyup", handleImgLightboxWindow);
	if (27 === (ev.which || ev.keyCode)) {
		hideImgLightbox();
	}
},
manageImgLightboxLinks = function (scope) {
	"use strict";
	var ctx = scope && scope.nodeName ? scope : "";
	var w = globalRoot;
	var d = document;
	var b = d.body || "";
	var getElementsByClassName = "getElementsByClassName";
	var getElementsByTagName = "getElementsByTagName";
	var classList = "classList";
	var createElement = "createElement";
	var getAttribute = "getAttribute";
	var appendChild = "appendChild";
	var _addEventListener = "addEventListener";
	var linkClass = "img-lightbox-link";
	var link = ctx ? ctx[getElementsByClassName](linkClass) || "" : d[getElementsByClassName](linkClass) || "";
	var containerClass = "img-lightbox-container";
	var container = d[getElementsByClassName](containerClass)[0] || "";
	var img = container ? container[getElementsByTagName]("img")[0] || "" : "";
	var an = "animated";
	var an1 = "fadeIn";
	var an2 = "fadeInUp";
	var isBindedClass = "is-binded";
	var dummySrc = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
	if (!container) {
		container = d[createElement]("div");
		img = d[createElement]("img");
		img.src = dummySrc;
		img.alt = "";
		container[appendChild](img);
		container[classList].add(containerClass);
		appendFragment(container, b);
	}
	var arrange = function (e) {
		var handleImgLightboxLink = function (ev) {
			ev.stopPropagation();
			ev.preventDefault();
			var _this = this;
			var logicHandleImgLightboxLink = function () {
				var hrefString = _this[getAttribute]("href") || "";
				if (container && img && hrefString) {
					LoadingSpinner.show();
					container[classList].add(an);
					container[classList].add(an1);
					img[classList].add(an);
					img[classList].add(an2);
					if (parseLink(hrefString).isAbsolute && !parseLink(hrefString).hasHTTP) {
						hrefString = hrefString.replace(/^/, getHTTP(true) + ":");
					}
					imagePromise(hrefString).then(function () {
						img.src = hrefString;
					}).catch (function (err) {
						console.log("cannot load image with imagePromise:", hrefString, err);
					});
					w[_addEventListener]("keyup", handleImgLightboxWindow);
					container[_addEventListener]("click", handleImgLightboxContainer);
					container.style.display = "block";
					LoadingSpinner.hide();
				}
			};
			var debounceLogicHandleImgLightboxLink = debounce(logicHandleImgLightboxLink, 200);
			debounceLogicHandleImgLightboxLink();
		};
		if (!e[classList].contains(isBindedClass)) {
			var hrefString = e[getAttribute]("href") || "";
			if (hrefString) {
				if (parseLink(hrefString).isAbsolute && !parseLink(hrefString).hasHTTP) {
					e.setAttribute("href", hrefString.replace(/^/, getHTTP(true) + ":"));
				}
				e[_addEventListener]("click", handleImgLightboxLink);
				e[classList].add(isBindedClass);
			}
		}
	};
	if (link) {
		for (var j = 0, l = link.length; j < l; j += 1) {
			arrange(link[j]);
		}
		/* forEach(link, arrange, false); */
	}
};
/*!
 * hide other dropdown lists
 * use ev.stopPropagation(); ev.preventDefault();
 * in click event handlers of dropdown openers
 * @param {Object} [_this] node element, if empty will affect everyone
 */
var handleOtherDropdownLists = function (_self) {
	"use strict";
	var _this = _self || this;
	var d = document;
	var getElementsByClassName = "getElementsByClassName";
	var classList = "classList";
	var isActiveClass = "is-active";
	var isDropdownClass = "is-dropdown";
	var list = d[getElementsByClassName](isDropdownClass) || "";
	var removeActiveClass = function (e) {
		if (_this !== e) {
			e[classList].remove(isActiveClass);
		}
	};
	if (list) {
		for (var i = 0, l = list.length; i < l; i += 1) {
			removeActiveClass(list[i]);
		}
		/* forEach(list, removeActiveClass, false); */
	}
},
manageOtherDropdownListAll = function () {
	"use strict";
	var d = document;
	var getElementById = "getElementById";
	var _addEventListener = "addEventListener";
	var container = d[getElementById]("container") || "";
	if (container) {
		container[_addEventListener]("click", handleOtherDropdownLists);
	}
};
document.ready().then(manageOtherDropdownListAll);
globalRoot.addEventListener("hashchange", handleOtherDropdownLists);
/*!
 * add smooth scroll or redirection to static select options
 * @param {Object} [ctx] context HTML Element
 */
var manageChaptersSelect = function () {
	"use strict";
	var w = globalRoot;
	var d = document;
	var getElementById = "getElementById";
	var getElementsByTagName = "getElementsByTagName";
	var getElementsByClassName = "getElementsByClassName";
	var classList = "classList";
	var parentNode = "parentNode";
	var createDocumentFragment = "createDocumentFragment";
	var createElement = "createElement";
	var createElementNS = "createElementNS";
	var setAttributeNS = "setAttributeNS";
	var createTextNode = "createTextNode";
	var appendChild = "appendChild";
	var _addEventListener = "addEventListener";
	var chaptersSelect = d[getElementById]("chapters-select") || "";
	var holderChaptersSelect = d[getElementsByClassName]("holder-chapters-select")[0] || "";
	var uiPanelContentsSelect = d[getElementsByClassName]("ui-panel-contents-select")[0] || "";
	var chaptersListClass = "chapters-list";
	var isFixedClass = "is-fixed";
	var isActiveClass = "is-active";
	var isDropdownClass = "is-dropdown";
	/* var isBindedClass = "is-binded";
	var rerenderChaptersSelect = function () {
		var handleChaptersSelect = function () {
			var _this = this;
			var hashString = _this.options[_this.selectedIndex].value || "";
			var uiPanelContentsSelectHeight = uiPanelContentsSelect ? (uiPanelContentsSelect[classList].contains(isFixedClass) ? uiPanelContentsSelect.offsetHeight : uiPanelContentsSelect.offsetHeight * 2) : 0;
			if (hashString) {
				var tragetObject = hashString ? (isValidId(hashString, true) ? d[getElementById](hashString.replace(/^#/,"")) || "" : "") : "";
				if (tragetObject) {
					scroll2Top(findPos(tragetObject).top - uiPanelContentsSelectHeight, 10000);
				} else {
					w.location.hash = hashString;
				}
			}
		};
		if (!chaptersSelect[classList].contains(isBindedClass)) {
			chaptersSelect[_addEventListener]("change", handleChaptersSelect);
			chaptersSelect[classList].add(isBindedClass);
		}
		var rerenderOption = function (option) {
			if (option) {
				var optionText = option.textContent;
				option.title = optionText;
				var optionTextTruncated = truncString("" + optionText, 28);
				removeChildren(option);
				appendFragment(d.createTextNode(optionTextTruncated), option);
			}
		};
		var chaptersSelectOptions = chaptersSelect ? chaptersSelect[getElementsByTagName]("option") || "" : "";
		for (var i = 0, l = chaptersSelectOptions.length; i < l; i += 1) {
			rerenderOption(chaptersSelectOptions[i]);
		}
	};*/
	var rerenderChaptersList = function () {
		var handleChaptersListItem = function (listObj, hashString) {
			var uiPanelContentsSelectHeight = uiPanelContentsSelect ? (uiPanelContentsSelect[classList].contains(isFixedClass) ? uiPanelContentsSelect.offsetHeight : uiPanelContentsSelect.offsetHeight * 2) : 0;
			if (hashString) {
				var tragetObject = hashString ? (isValidId(hashString, true) ? d[getElementById](hashString.replace(/^#/,"")) || "" : "") : "";
				if (tragetObject) {
					scroll2Top(findPos(tragetObject).top - uiPanelContentsSelectHeight, 10000);
				} else {
					w.location.hash = hashString;
				}
			}
			listObj[classList].remove(isActiveClass);
		};
		var chaptersList = d[createElement]("ul");
		var chaptersListItems = chaptersSelect ? chaptersSelect[getElementsByTagName]("option") || "" : "";
		var chaptersListButtonDefaultText = "";
		var df = d[createDocumentFragment]();
		var generateChaptersListItems = function (_this, i) {
			if (0 === i) {
				chaptersListButtonDefaultText = _this.firstChild.textContent;
			}
			var chaptersListItem = d[createElement]("li"),
			chaptersListItemText = _this.firstChild.textContent || "",
			chaptersListItemValue = _this.value,
			chaptersListItemTextTruncated = truncString("" + chaptersListItemText, 28);
			chaptersListItem[appendChild](d[createTextNode](chaptersListItemTextTruncated));
			chaptersListItem.title = chaptersListItemText;
			chaptersListItem[_addEventListener]("click", handleChaptersListItem.bind(null, chaptersList, chaptersListItemValue));
			df[appendChild](chaptersListItem);
			df[appendChild](d.createTextNode("\n"));
		};
		for (var i = 0, l = chaptersListItems.length; i < l; i += 1) {
			generateChaptersListItems(chaptersListItems[i], i);
		}
		/* forEach(chaptersListItems, generateChaptersListItems, false); */
		appendFragment(df, chaptersList);
		chaptersList[classList].add(chaptersListClass);
		chaptersList[classList].add(isDropdownClass);
		holderChaptersSelect.replaceChild(chaptersList, chaptersSelect[parentNode][parentNode]);
		var chaptersListButton = d[createElement]("a");
		chaptersListButton[appendChild](d[createTextNode](chaptersListButtonDefaultText));
		chaptersList[parentNode].insertBefore(chaptersListButton, chaptersList);
		/*jshint -W107 */
		chaptersListButton.href = "javascript:void(0);";
		/*jshint +W107 */
		var insertChevronDownSmallSvg = function (targetObj) {
			var svg = d[createElementNS]("http://www.w3.org/2000/svg", "svg"),
			use = d[createElementNS]("http://www.w3.org/2000/svg", "use");
			svg[classList].add("ui-icon");
			use[setAttributeNS]("http://www.w3.org/1999/xlink", "xlink:href", "#ui-icon-ChevronDownSmall");
			svg[appendChild](use);
			targetObj[appendChild](svg);
		};
		insertChevronDownSmallSvg(chaptersListButton);
		var handleChaptersListItemsButton = function (ev) {
			ev.stopPropagation();
			ev.preventDefault();
			chaptersList[classList].toggle(isActiveClass);
			handleOtherDropdownLists(chaptersList);
		};
		chaptersListButton[_addEventListener]("click", handleChaptersListItemsButton);
	};
	if (holderChaptersSelect && chaptersSelect) {
		/* rerenderChaptersSelect(); */
		rerenderChaptersList();
	}
};
/*!
 * add click event on hidden-layer show btn
 * @param {Object} [ctx] context HTML Element
 */
var manageExpandingLayers = function (scope) {
	"use strict";
	var ctx = scope && scope.nodeName ? scope : "";
	var d = document;
	var getElementsByClassName = "getElementsByClassName";
	var _addEventListener = "addEventListener";
	var classList = "classList";
	var parentNode = "parentNode";
	var btnClass = "btn-expand-hidden-layer";
	var btn = ctx ? ctx[getElementsByClassName](btnClass) || "" : d[getElementsByClassName](btnClass) || "";
	var isBindedClass = "is-binded";
	var isActiveClass = "is-active";
	var arrange = function (e) {
		var handleExpandingLayerAll = function () {
			var _this = this;
			var s = _this[parentNode] ? _this[parentNode].nextElementSibling : "";
			if (s) {
				_this[classList].toggle(isActiveClass);
				s[classList].toggle(isActiveClass);
			}
			return;
		};
		if (!e[classList].contains(isBindedClass)) {
			e[_addEventListener]("click", handleExpandingLayerAll);
			e[classList].add(isBindedClass);
		}
	};
	if (btn) {
		for (var i = 0, l = btn.length; i < l; i += 1) {
			arrange(btn[i]);
		}
		/* forEach(btn, arrange, false); */
	}
};
/*!
 * init Masonry grid
 * @see {@link https://stackoverflow.com/questions/15160010/jquery-masonry-collapsing-on-initial-page-load-works-fine-after-clicking-home}
 * @see {@link https://gist.github.com/englishextra/5e423ff34f67982f017b}
 * percentPosition: true works well with percent-width items,
 * as items will not transition their position on resize.
 * masonry.desandro.com/options.html
 * use timed out layout property after initialising
 * to level the horizontal gaps
 */
var msnry;
var pckry;
var initMasonry = function (scope) {
	"use strict";
	var ctx = scope && scope.nodeName ? scope : "";
	var w = globalRoot;
	var d = document;
	var getElementsByClassName = "getElementsByClassName";
	var gridClass = "masonry-grid";
	var gridItemClass = "masonry-grid-item";
	var gridItemSelector = ".masonry-grid-item";
	var gridSizerSelector = ".masonry-grid-sizer";
	var grid = ctx ? ctx[getElementsByClassName](gridClass)[0] || "" : d[getElementsByClassName](gridClass)[0] || "";
	var gridItem = ctx ? ctx[getElementsByClassName](gridItemClass)[0] || "" : d[getElementsByClassName](gridItemClass)[0] || "";
	var initScript = function () {
		if (w.Masonry) {
			if (msnry) {
				msnry.destroy();
			}
			msnry = new Masonry(grid, {
					itemSelector: gridItemSelector,
					columnWidth: gridSizerSelector,
					gutter: 0,
					percentPosition: true
				});
		} else {
			if (w.Packery) {
				if (pckry) {
					pckry.destroy();
				}
				pckry = new Packery(grid, {
						itemSelector: gridItemSelector,
						columnWidth: gridSizerSelector,
						gutter: 0,
						percentPosition: true
					});
			}
		}
		var timers = new Timers();
		timers.timeout(function () {
			timers.clear();
			timers = null;
			if ("undefined" !== typeof msnry && msnry) {
				msnry.layout();
			} else {
				if ("undefined" !== typeof pckry && pckry) {
					pckry.layout();
				}
			}
		}, 500);
	};
	if (grid && gridItem) {
		/* var jsUrl = "./cdn/masonry/4.1.1/js/masonry.pkgd.fixed.min.js"; */
		var jsUrl = "./cdn/packery/2.1.1/js/packery.pkgd.fixed.min.js";
		if (!scriptIsLoaded(jsUrl)) {
			loadJS(jsUrl, initScript);
		} else {
			initScript();
		}
	}
};
/*!
 * load or refresh disqus_thread on click
 */
var manageDisqusButton = function (scope) {
	"use strict";
	var ctx = scope && scope.nodeName ? scope : "";
	var w = globalRoot;
	var d = document;
	var getElementById = "getElementById";
	var getElementsByClassName = "getElementsByClassName";
	var classList = "classList";
	var dataset = "dataset";
	var appendChild = "appendChild";
	var _addEventListener = "addEventListener";
	var _removeEventListener = "removeEventListener";
	var createElement = "createElement";
	var btnClass = "btn-show-disqus";
	var btn = ctx ? ctx[getElementsByClassName](btnClass)[0] || "" : d[getElementsByClassName](btnClass)[0] || "";
	var disqusThread = d[getElementById]("disqus_thread") || "";
	var isBindedClass = "is-binded";
	var isActiveClass = "is-active";
	var locationHref = w.location.href || "";
	var disqusThreadShortname = disqusThread ? (disqusThread[dataset].shortname || "") : "";
	var hideDisqusButton = function () {
		disqusThread[classList].add(isActiveClass);
		btn.style.display = "none";
		LoadingSpinner.hide();
	};
	var hideDisqusThread = function () {
		removeChildren(disqusThread);
		var replacementText = d[createElement]("p");
		replacementText[appendChild](d.createTextNode("Комментарии доступны только в веб версии этой страницы."));
		appendFragment(replacementText, disqusThread);
		disqusThread.removeAttribute("id");
		hideDisqusButton();
	};
	var addBtnHandler = function () {
		var handleDisqusButton = function (ev) {
			ev.stopPropagation();
			ev.preventDefault();
			var logicHandleDisqusButton = function () {
				var initScript = function () {
					if (w.DISQUS) {
						try {
							DISQUS.reset({
								reload: !0,
								config: function () {
									this.page.identifier = disqusThreadShortname;
									this.page.url = locationHref;
								}
							});
							btn[_removeEventListener]("click", handleDisqusButton);
							LoadingSpinner.show();
							hideDisqusButton();
						} catch (err) {
							/* console.log("cannot reset DISQUS", err); */
						}
					}
				};
				var jsUrl = getHTTP(true) + "://" + disqusThreadShortname + ".disqus.com/embed.js";
				if (!scriptIsLoaded(jsUrl)) {
					loadJS(jsUrl, initScript);
				} else {
					initScript();
				}
			};
			var debounceLogicHandleDisqusButton = debounce(logicHandleDisqusButton, 200);
			debounceLogicHandleDisqusButton();
		};
		btn[_addEventListener]("click", handleDisqusButton);
		btn[classList].add(isBindedClass);
	};
	if (disqusThread && btn && disqusThreadShortname && locationHref) {
		if ("undefined" !== typeof getHTTP && getHTTP()) {
			if (!btn[classList].contains(isBindedClass)) {
				addBtnHandler();
			}
		} else {
			hideDisqusThread();
		}
	}
};
/*!
 * modified Notibar.js v1.0
 * Lightweight notification bar, no dependency.
 * @see {@link https://github.com/englishextra/notibar.js}
 * passes jshint
 */
var notiBar = function (opt) {
	"use strict";
	var d = document;
	var b = d.body || "";
	var getElementsByClassName = "getElementsByClassName";
	var classList = "classList";
	var createElement = "createElement";
	var createElementNS = "createElementNS";
	var setAttributeNS = "setAttributeNS";
	var appendChild = "appendChild";
	var _addEventListener = "addEventListener";
	var _removeEventListener = "removeEventListener";
	var notibarClass = "notibar";
	var notibarContainer = d[getElementsByClassName](notibarClass)[0] || "";
	var messageClass = "message";
	var closeButtonClass = "close";
	var defaultKey = "_notibar_dismiss_";
	var defaultDatum = "ok";
	var animatedClass = "animated";
	var fadeInDownClass = "fadeInDown";
	var fadeOutUpClass = "fadeOutUp";
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
		return;
	}
	if (notibarContainer) {
		removeChildren(notibarContainer);
	} else {
		notibarContainer = d[createElement]("div");
		notibarContainer[classList].add(notibarClass);
		notibarContainer[classList].add(animatedClass);
	}
	var msgContainer = d[createElement]("div");
	msgContainer[classList].add(messageClass);
	var msgContent = settings.message || "";
	if ("string" === typeof msgContent) {
		msgContent = d.createTextNode(msgContent);
	}
	msgContainer[appendChild](msgContent);
	notibarContainer[appendChild](msgContainer);
	var insertCancelSvg = function (targetObj) {
		var svg = d[createElementNS]("http://www.w3.org/2000/svg", "svg"),
		use = d[createElementNS]("http://www.w3.org/2000/svg", "use");
		svg[classList].add("ui-icon");
		use[setAttributeNS]("http://www.w3.org/1999/xlink", "xlink:href", "#ui-icon-Cancel");
		svg[appendChild](use);
		targetObj[appendChild](svg);
	},
	closeButton = d[createElement]("a");
	closeButton[classList].add(closeButtonClass);
	insertCancelSvg(closeButton);
	var setCookie = function () {
		if (settings.days) {
			Cookies.set(settings.key, settings.datum, {
				expires: settings.days
			});
		} else {
			Cookies.set(settings.key, settings.datum);
		}
	};
	var hideMessage = function () {
		var notibarContainer = d[getElementsByClassName](notibarClass)[0] || "";
		if (notibarContainer) {
			notibarContainer[classList].remove(fadeInDownClass);
			notibarContainer[classList].add(fadeOutUpClass);
			removeChildren(notibarContainer);
		}
	};
	var handleCloseButton = function () {
		closeButton[_removeEventListener]("click", handleCloseButton);
		hideMessage();
		setCookie();
	};
	closeButton[_addEventListener]("click", handleCloseButton);
	notibarContainer[appendChild](closeButton);
	if (b) {
		appendFragment(notibarContainer, b);
		notibarContainer[classList].remove(fadeOutUpClass);
		notibarContainer[classList].add(fadeInDownClass);
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
	var w = globalRoot;
	var d = document;
	var getElementsByClassName = "getElementsByClassName";
	var classList = "classList";
	var appendChild = "appendChild";
	var _addEventListener = "addEventListener";
	var _removeEventListener = "removeEventListener";
	var createElement = "createElement";
	var uiPanelContentsSelect = d[getElementsByClassName]("ui-panel-contents-select")[0] || "";
	var cookieKey = "_notibar_dismiss_";
	var cookieDatum = "Выбрать статью можно щелкнув по самофиксирующейся планке с заголовком текущей страницы.";
	var locationOrigin = parseLink(w.location.href).origin;
	var isFixedClass = "is-fixed";
	var arrange = function () {
		var timers = new Timers();
		timers.timeout(function () {
			timers.clear();
			timers = null;
			var msgObj = d[createElement]("a");
			/*jshint -W107 */
			msgObj.href = "javascript:void(0);";
			/*jshint +W107 */
			var handleMsgObj = function (ev) {
				ev.stopPropagation();
				ev.preventDefault();
				msgObj[_removeEventListener]("click", handleMsgObj);
				var uiPanelContentsSelectPos = uiPanelContentsSelect ? findPos(uiPanelContentsSelect).top : 0;
				var uiPanelContentsSelectHeight = uiPanelContentsSelect ? (uiPanelContentsSelect[classList].contains(isFixedClass) ? uiPanelContentsSelect.offsetHeight : uiPanelContentsSelect.offsetHeight) : 0;
				scroll2Top(uiPanelContentsSelectPos - uiPanelContentsSelectHeight, 2000);
			};
			msgObj[_addEventListener]("click", handleMsgObj);
			msgObj[appendChild](d.createTextNode(cookieDatum));
			notiBar({
				"message": msgObj,
				"timeout": 5000,
				"key": cookieKey,
				"datum": cookieDatum,
				"days": 0
			});
		}, 3000);
	};
	if (locationOrigin && uiPanelContentsSelect) {
		if ("undefined" !== typeof getHTTP && getHTTP()) {
			arrange();
		}
	}
};
document.ready().then(initNotibarMsg);
/*!
 * manage search input
 */
var manageSearchInput = function () {
	"use strict";
	var d = document;
	var getElementById = "getElementById";
	var _addEventListener = "addEventListener";
	var searchInput = d[getElementById]("text") || "";
	var handleSearchInputValue = function () {
		var _this = this;
		var logicHandleSearchInputValue = function () {
			_this.value = _this.value.replace(/\\/g, "").replace(/ +(?= )/g, " ").replace(/\/+(?=\/)/g, "/") || "";
		};
		var debounceLogicHandleSearchInputValue = debounce(logicHandleSearchInputValue, 200);
		debounceLogicHandleSearchInputValue();
	};
	if (searchInput) {
		searchInput.focus();
		searchInput[_addEventListener]("input", handleSearchInputValue);
	}
};
document.ready().then(manageSearchInput);
/*!
 * init Pages Kamil autocomplete
 * @see {@link https://oss6.github.io/kamil/}
 * @see {@link https://github.com/oss6/kamil/wiki/Example-with-label:link-json-and-typo-correct-suggestion}
 */
var initKamilAutocomplete = function (jsonObj) {
	"use strict";
	var w = globalRoot;
	var d = document;
	var getElementById = "getElementById";
	var getElementsByClassName = "getElementsByClassName";
	var getElementsByTagName = "getElementsByTagName";
	var classList = "classList";
	var createElement = "createElement";
	var createTextNode = "createTextNode";
	var appendChild = "appendChild";
	var parentNode = "parentNode";
	var _addEventListener = "addEventListener";
	var searchForm = d[getElementsByClassName]("search-form")[0] || "";
	var textInputSelector = "#text";
	var textInput = d[getElementById]("text") || "";
	var container = d[getElementById]("container") || "";
	var typoAutcompleteListSelector = "kamil-typo-autocomplete";
	var typoAutcompleteListClass = "kamil-autocomplete";
	var initScript = function () {
		var ac;
		try {
			if (!jsonObj[0].hasOwnProperty("title")) {
				throw new Error("incomplete JSON data: no title");
			}
			ac = new Kamil(textInputSelector, {
					source: jsonObj,
					property: "title",
					minChars: 2
				});
		} catch (err) {
			console.log("cannot init Kamil", err);
			return;
		}
		/*!
		 * create typo suggestion list
		 */
		var typoAutcompleteList = d[createElement]("ul");
		var typoListItem = d[createElement]("li");
		var handleTypoSuggestion = function () {
			typoAutcompleteList.style.display = "none";
			typoListItem.style.display = "none";
		};
		var showTypoSuggestion = function () {
			typoAutcompleteList.style.display = "block";
			typoListItem.style.display = "block";
		};
		typoAutcompleteList[classList].add(typoAutcompleteListClass);
		typoAutcompleteList.id = typoAutcompleteListSelector;
		handleTypoSuggestion();
		typoAutcompleteList[appendChild](typoListItem);
		textInput[parentNode].insertBefore(typoAutcompleteList, textInput.nextElementSibling);
		/*!
		 * this is an optional setup of every li
		 * uset to set a description title attribute
		 * comment out the title attribute setup below
		 */
		ac.renderItem = function (ul, item) {
			var li = d[createElement]("li");
			/* li.innerHTML = item.title; */
			appendFragment(d[createTextNode]("" + item.title), li);
			li.title = item.text;
			ul.appendChild(li);
			return li;
		};
		/*!
		 * show suggestions
		 */
		ac.renderMenu = function (ul, items) {
			items = items || "";
			var itemsLength = items.length;
			var _this = this;
			/*!
			 * limit output
			 */
			var limitKamilOutput = function (e, i) {
				if (i < 10) {
					_this._renderItemData(ul, e, i);
				}
			};
			if (items) {
				for (var i = 0; i < itemsLength; i += 1) {
					limitKamilOutput(items[i], i);
				}
				/* forEach(items, function (e, i) {
					limitKamilOutput(e, i);
				}, false); */
			}
			/*!
			 * fix typo - non latin characters found
			 */
			var logicReplaceTypo = function () {
				while (itemsLength < 1) {
					var textInputValue = textInput.value || "";
					if (/[^\u0000-\u007f]/.test(textInputValue)) {
						textInputValue = fixEnRuTypo(textInputValue, "ru", "en");
					} else {
						textInputValue = fixEnRuTypo(textInputValue, "en", "ru");
					}
					showTypoSuggestion();
					removeChildren(typoListItem);
					appendFragment(d[createTextNode]("" + textInputValue), typoListItem);
					if (textInputValue.match(/^\s*$/)) {
						handleTypoSuggestion();
					}
					/*!
					 * hide typo suggestion
					 */
					if (textInput.value.length < 3 || textInput.value.match(/^\s*$/)) {
						handleTypoSuggestion();
					}
					itemsLength += 1;
				}
			};
			var debounceLogicReplaceTypo = debounce(logicReplaceTypo, 200);
			debounceLogicReplaceTypo();
			/*!
			 * truncate text
			 */
			var lis = ul ? ul[getElementsByTagName]("li") || "" : "";
			var truncateKamilText = function (e) {
				var truncText = e.firstChild.textContent || "";
				var truncTextObj = d[createTextNode](truncString(truncText, 24));
				e.replaceChild(truncTextObj, e.firstChild);
				/* e.title = "" + truncText; */
			};
			if (lis) {
				for (var j = 0, m = lis.length; j < m; j += 1) {
					truncateKamilText(lis[j]);
				}
				/* forEach(lis, truncateKamilText, false); */
			}
		};
		/*!
		 * set text input value from typo suggestion
		 */
		var handleTypoListItem = function (ev) {
			ev.stopPropagation();
			ev.preventDefault();
			/*!
			 * set focus first, then set text
			 */
			textInput.focus();
			textInput.value = typoListItem.textContent || "";
			handleTypoSuggestion();
		};
		typoListItem[_addEventListener]("click", handleTypoListItem);
		/*!
		 * hide suggestions on outside click
		 */
		if (container) {
			container[_addEventListener]("click", handleTypoSuggestion);
		}
		/*!
		 * unless you specify property option in new Kamil
		 * use kamil built-in word label as search key in JSON file
		 * [{"link":"/","label":"some text to match"},
		 * {"link":"/pages/contents.html","label":"some text to match"}]
		 */
		ac.on("kamilselect", function (e) {
			var kamilItemLink = e.item.href || "";
			var handleKamilItem = function () {
				e.inputElement.value = "";
				handleTypoSuggestion();
				w.location.href = kamilItemLink;
			};
			if (kamilItemLink) {
				/*!
				 * nwjs wont like setImmediate here
				 */
				/* setImmediate(handleKamilItem); */
				handleKamilItem();
			}
		});
	};
	if (searchForm && textInput) {
		var jsUrl = "./cdn/kamil/0.1.1/js/kamil.fixed.min.js";
		if (!scriptIsLoaded(jsUrl)) {
			loadJS(jsUrl, initScript);
		}
	}
};
/*!
 * render navigation templates
 */
var renderNavigation = function () {
	"use strict";
	var w = globalRoot;
	var d = document;
	var getElementById = "getElementById";
	var getElementsByTagName = "getElementsByTagName";
	var classList = "classList";
	var parentNode = "parentNode";
	var _addEventListener = "addEventListener";
	var navbar = d[getElementById]("navbar") || "";
	var navbarParent = navbar[parentNode] || "";
	var popularTemplateId = "template_navbar_popular";
	var popularTemplate = d[getElementById](popularTemplateId) || "";
	var popularRenderId = "render_navbar_popular";
	var popularRender = d[getElementById](popularRenderId) || "";
	var moreTemplateId = "template_navbar_more";
	var moreTemplate = d[getElementById](moreTemplateId) || "";
	var moreRenderId = "render_navbar_more";
	var moreRender = d[getElementById](moreRenderId) || "";
	var carouselTemplateId = "template_b_carousel";
	var carouselTemplate = d[getElementById](carouselTemplateId) || "";
	var carouselRenderId = "render_b_carousel";
	var carouselRender = d[getElementById](carouselRenderId) || "";
	var carouselRenderParent = carouselRender[parentNode] || "";
	var showRenderNavbarPopularId = "show_render_navbar_popular";
	var showRenderNavbarPopular = d[getElementById](showRenderNavbarPopularId) || "";
	var renderNavbarPopularId = "render_navbar_popular";
	var renderNavbarPopular = d[getElementById](renderNavbarPopularId) || "";
	var showRenderNavbarMoreId = "show_render_navbar_more";
	var showRenderNavbarMore = d[getElementById](showRenderNavbarMoreId) || "";
	var renderNavbarMoreId = "render_navbar_more";
	var renderNavbarMore = d[getElementById](renderNavbarMoreId) || "";
	var navigationJsonUrl = "./libs/pwa-englishextra/json/navigation.json";
	var isActiveClass = "is-active";
	var processNavigationJsonResponse = function (navigationJsonResponse) {
		try {
			var navigationJsonObj = JSON.parse(navigationJsonResponse);
			if (!navigationJsonObj.navbar_popular) {
				throw new Error("incomplete JSON data: no navbar_popular");
			} else if (!navigationJsonObj.navbar_more) {
				throw new Error("incomplete JSON data: no navbar_more");
			} else {
				if (!navigationJsonObj.b_carousel) {
					throw new Error("incomplete JSON data: no b_carousel");
				}
			}
			navigationJsonObj = null;
		} catch (err) {
			console.log("cannot init processNavigationJsonResponse", err);
			return;
		}
		var handleListItemAll = function (e) {
			var items = e ? e[getElementsByTagName]("li") || "" : "";
			var addHandler = function (e) {
				e[_addEventListener]("click", handleOtherDropdownLists);
			};
			if (items) {
				for (var i = 0, l = items.length; i < l; i += 1) {
					addHandler(items[i]);
				}
				/* forEach(btn, addHandler, false); */
			}
		};
		var handleShowRenderNavbarPopularButton = function (ev) {
			ev.stopPropagation();
			ev.preventDefault();
			renderNavbarPopular[classList].toggle(isActiveClass);
			handleOtherDropdownLists(renderNavbarPopular);
		};
		var handleShowRenderNavbarMoreButton = function (ev) {
			ev.stopPropagation();
			ev.preventDefault();
			renderNavbarMore[classList].toggle(isActiveClass);
			handleOtherDropdownLists(renderNavbarMore);
		};
		var alignNavbarListAll = function () {
			alignToMasterBottomLeft(showRenderNavbarPopularId, renderNavbarPopularId);
			alignToMasterBottomLeft(showRenderNavbarMoreId, renderNavbarMoreId);
		};
		var handleShowNavbarListsWindow = function () {
			var logicHandleShowNavbarListsWindow = alignNavbarListAll;
			var throttleLogicHandleShowNavbarListsWindow = throttle(logicHandleShowNavbarListsWindow, 100);
			throttleLogicHandleShowNavbarListsWindow();
		};
		if (popularTemplate && popularRender) {
			insertFromTemplate(navigationJsonResponse, popularTemplateId, popularRenderId, function () {
				if (moreTemplate && moreRender) {
					insertFromTemplate(navigationJsonResponse, moreTemplateId, moreRenderId, function () {
						alignNavbarListAll();
						handleListItemAll(renderNavbarPopular);
						handleListItemAll(renderNavbarMore);
						showRenderNavbarPopular[_addEventListener]("click", handleShowRenderNavbarPopularButton);
						showRenderNavbarMore[_addEventListener]("click", handleShowRenderNavbarMoreButton);
						w[_addEventListener]("resize", handleShowNavbarListsWindow);
						if (navbarParent) {
							manageExternalLinkAll(navbarParent);
						}
					}, true);
				}
			}, true);
		}
		if (carouselTemplate && carouselRender) {
			insertFromTemplate(navigationJsonResponse, carouselTemplateId, carouselRenderId, function () {
				var carousel;
				carousel = new Carousel({
						"main": "js-carousel",
						"wrap": "js-carousel__wrap",
						"prev": "js-carousel__prev",
						"next": "js-carousel__next"
					});
				if (carouselRenderParent) {
					manageExternalLinkAll(carouselRenderParent);
					var timers = new Timers();
					timers.timeout(function () {
						timers.clear();
						timers = null;
						handleDataSrcImageAll();
					}, 500);
				}
			});
		}
	};
	if (navbar) {
		loadUnparsedJSON(navigationJsonUrl, processNavigationJsonResponse);
	}
};
document.ready().then(renderNavigation);
/*!
 * fix panel with contents select on scroll
 */
var fixUiPanelContentsSelect = function () {
	"use strict";
	var w = globalRoot;
	var d = document;
	var getElementsByClassName = "getElementsByClassName";
	var classList = "classList";
	var _addEventListener = "addEventListener";
	var uiPanelNavigation = d[getElementsByClassName]("ui-panel-navigation")[0] || "";
	var holderHero = d[getElementsByClassName]("holder-hero")[0] || "";
	var uiPanelContentsSelect = d[getElementsByClassName]("ui-panel-contents-select")[0] || "";
	var criticalHeight = (uiPanelNavigation ? uiPanelNavigation.offsetHeight : 0) + (holderHero ? holderHero.offsetHeight : 0);
	var isFixedClass = "is-fixed";
	var handleUiPanelContentsSelect = function () {
		var logicHandleUiPanelContentsSelect = function () {
			if ((d.body.scrollTop || d.documentElement.scrollTop || 0) > criticalHeight) {
				uiPanelContentsSelect[classList].add(isFixedClass);
			} else {
				uiPanelContentsSelect[classList].remove(isFixedClass);
			}
		};
		var throttleLogicHandleUiPanelContentsSelect = throttle(logicHandleUiPanelContentsSelect, 100);
		throttleLogicHandleUiPanelContentsSelect();
	};
	if (uiPanelContentsSelect) {
		w[_addEventListener]("scroll", handleUiPanelContentsSelect, {passive: true});
	}
};
document.ready().then(fixUiPanelContentsSelect);
/*!
 * hide other social holders
 * use ev.stopPropagation(); ev.preventDefault();
 * in click event handlers of social openers
 * @param {Object} [_this] node element, if empty will affect everyone
 */
var handleOtherSocialButtons = function (_self) {
	"use strict";
	var _this = _self || this;
	var d = document;
	var getElementsByClassName = "getElementsByClassName";
	var classList = "classList";
	var isActiveClass = "is-active";
	var isSocialClass = "is-social";
	var btn = d[getElementsByClassName](isSocialClass) || "";
	var removeActiveClass = function (e) {
		if (_this !== e) {
			e[classList].remove(isActiveClass);
		}
	};
	if (btn) {
		for (var i = 0, l = btn.length; i < l; i += 1) {
			removeActiveClass(btn[i]);
		}
		/* forEach(btn, removeActiveClass, false); */
	}
},
manageOtherSocialButtonAll = function () {
	"use strict";
	var d = document;
	var getElementById = "getElementById";
	var _addEventListener = "addEventListener";
	var container = d[getElementById]("container") || "";
	if (container) {
		container[_addEventListener]("click", handleOtherSocialButtons);
	}
};
document.ready().then(manageOtherSocialButtonAll);
globalRoot.addEventListener("hashchange", handleOtherSocialButtons);
/*!
 * init qr-code
 * @see {@link https://stackoverflow.com/questions/12777622/how-to-use-enquire-js}
 */
var manageLocationQrCodeImage = function () {
	"use strict";
	var w = globalRoot;
	var d = document;
	var getElementsByClassName = "getElementsByClassName";
	var classList = "classList";
	var createElement = "createElement";
	var _addEventListener = "addEventListener";
	var btn = d[getElementsByClassName]("btn-toggle-holder-location-qr-code")[0] || "";
	var holder = d[getElementsByClassName]("holder-location-qr-code")[0] || "";
	var isActiveClass = "is-active";
	var isSocialClass = "is-social";
	var locationHref = w.location.href || "";
	var handleLocationQrCodeButton = function (ev) {
		ev.stopPropagation();
		ev.preventDefault();
		var logicHandleLocationQrCodeButton = function () {
			holder[classList].toggle(isActiveClass);
			holder[classList].add(isSocialClass);
			handleOtherSocialButtons(holder);
			var locationHref = w.location.href || "";
			var newImg = d[createElement]("img");
			var newTitle = d.title ? ("Ссылка на страницу «" + d.title.replace(/\[[^\]]*?\]/g, "").trim() + "»") : "";
			var newSrc = getHTTP(true) + "://chart.googleapis.com/chart?cht=qr&chld=M%7C4&choe=UTF-8&chs=300x300&chl=" + encodeURIComponent(locationHref);
			newImg.alt = newTitle;
			var initScript = function () {
				if (w.QRCode) {
					if ("undefined" !== typeof earlySvgSupport && "svg" === earlySvgSupport) {
						newSrc = QRCode.generateSVG(locationHref, {
								ecclevel: "M",
								fillcolor: "#FFFFFF",
								textcolor: "#191919",
								margin: 4,
								modulesize: 8
							});
						var XMLS = new XMLSerializer();
						newSrc = XMLS.serializeToString(newSrc);
						newSrc = "data:image/svg+xml;base64," + w.btoa(unescape(encodeURIComponent(newSrc)));
						newImg.src = newSrc;
					} else {
						newSrc = QRCode.generatePNG(locationHref, {
								ecclevel: "M",
								format: "html",
								fillcolor: "#FFFFFF",
								textcolor: "#191919",
								margin: 4,
								modulesize: 8
							});
						newImg.src = newSrc;
					}
				} else {
					newImg.src = newSrc;
				}
				newImg[classList].add("qr-code-img");
				newImg.title = newTitle;
				removeChildren(holder);
				appendFragment(newImg, holder);
			};
			var jsUrl = "./cdn/qrjs2/0.1.6/js/qrjs2.fixed.min.js";
			if (!scriptIsLoaded(jsUrl)) {
				loadJS(jsUrl, initScript);
			} else {
				initScript();
			}
		};
		var debounceLogicHandleLocationQrCodeButton = debounce(logicHandleLocationQrCodeButton, 200);
		debounceLogicHandleLocationQrCodeButton();
	};
	if (btn && holder && locationHref) {
		if ("undefined" !== typeof getHTTP && getHTTP()) {
			btn[_addEventListener]("click", handleLocationQrCodeButton);
		}
	}
};
document.ready().then(manageLocationQrCodeImage);
/*!
 * init share btn
 * class ya-share2 automatically triggers Ya.share2,
 * so use either default class ya-share2 or custom id
 * ya-share2 class will be added if you init share block
 * via ya-share2 api
 * @see {@link https://tech.yandex.ru/share/doc/dg/api-docpage/}
 */
var yshare;
var manageShareButton = function () {
	"use strict";
	var w = globalRoot;
	var d = document;
	var getElementById = "getElementById";
	var getElementsByClassName = "getElementsByClassName";
	var classList = "classList";
	var _addEventListener = "addEventListener";
	var btn = d[getElementsByClassName]("btn-toggle-holder-share-buttons")[0] || "";
	var yaShare2Id = "ya-share2";
	var yaShare2 = d[getElementById](yaShare2Id) || "";
	var holder = d[getElementsByClassName]("holder-share-buttons")[0] || "";
	var isActiveClass = "is-active";
	var isSocialClass = "is-social";
	var handleShareButton = function (ev) {
		ev.stopPropagation();
		ev.preventDefault();
		var logicHandleShareButton = function () {
			holder[classList].toggle(isActiveClass);
			holder[classList].add(isSocialClass);
			handleOtherSocialButtons(holder);
			var initScript = function () {
				if (w.Ya) {
					try {
						if (yshare) {
							yshare.updateContent({
								title: d.title || "",
								description: d.title || "",
								url: w.location.href || ""
							});
						} else {
							yshare = Ya.share2(yaShare2Id, {
								content: {
									title: d.title || "",
									description: d.title || "",
									url: w.location.href || ""
								}
							});
						}
					} catch (err) {
						console.log("cannot update or init Ya", err);
					}
				}
			};
			var jsUrl = getHTTP(true) + "://yastatic.net/share2/share.js";
			if (!scriptIsLoaded(jsUrl)) {
				loadJS(jsUrl, initScript);
			} else {
				initScript();
			}
		};
		var debounceLogicHandleShareButton = debounce(logicHandleShareButton, 200);
		debounceLogicHandleShareButton();
	};
	if (btn && holder && yaShare2) {
		if ("undefined" !== typeof getHTTP && getHTTP()) {
			btn[_addEventListener]("click", handleShareButton);
		}
	}
};
document.ready().then(manageShareButton);
/*!
 * init vk-like btn
 */
var vlike;
var manageVKLikeButton = function () {
	"use strict";
	var w = globalRoot;
	var d = document;
	var getElementById = "getElementById";
	var getElementsByClassName = "getElementsByClassName";
	var classList = "classList";
	var dataset = "dataset";
	var _addEventListener = "addEventListener";
	var btn = d[getElementsByClassName]("btn-toggle-holder-vk-like")[0] || "";
	var holder = d[getElementsByClassName]("holder-vk-like")[0] || "";
	var vkLikeId = "vk-like";
	var vkLike = d[getElementById](vkLikeId) || "";
	var isActiveClass = "is-active";
	var isSocialClass = "is-social";
	var handleVKLikeButton = function (ev) {
		ev.stopPropagation();
		ev.preventDefault();
		var logicHandleVKLikeButton = function () {
			holder[classList].toggle(isActiveClass);
			holder[classList].add(isSocialClass);
			handleOtherSocialButtons(holder);
			var initScript = function () {
				if (w.VK) {
					if (!vlike) {
						try {
							VK.init({
								apiId: (vkLike[dataset].apiid || ""),
								nameTransportPath: "/xd_receiver.htm",
								onlyWidgets: true
							});
							VK.Widgets.Like(vkLikeId, {
								type: "button",
								height: 24
							});
							vlike = true;
						} catch (err) {
							console.log("cannot init VK", err);
						}
					}
				}
			};
			var jsUrl = getHTTP(true) + "://vk.com/js/api/openapi.js?122";
			if (!scriptIsLoaded(jsUrl)) {
				loadJS(jsUrl, initScript);
			} else {
				initScript();
			}
		};
		var debounceLogicHandleVKLikeButton = debounce(logicHandleVKLikeButton, 200);
		debounceLogicHandleVKLikeButton();
	};
	if (btn && holder && vkLike) {
		if ("undefined" !== typeof getHTTP && getHTTP()) {
			btn[_addEventListener]("click", handleVKLikeButton);
		}
	}
};
document.ready().then(manageVKLikeButton);
/*!
 * init col debug btn
 */
var manageDebugGridButton = function () {
	"use strict";
	var w = globalRoot;
	var d = document;
	var b = d.body || "";
	var getElementById = "getElementById";
	var getElementsByClassName = "getElementsByClassName";
	var classList = "classList";
	var _addEventListener = "addEventListener";
	var _removeEventListener = "removeEventListener";
	var container = d[getElementById]("container") || "";
	var page = d[getElementById]("page") || "";
	var btn = d[getElementsByClassName]("btn-toggle-col-debug")[0] || "";
	var debugClass = "debug";
	var cookieKey = "_manageDebugGridButton_";
	var cookieDatum = "ok";
	var handleDebugGridButton = function (ev) {
		ev.stopPropagation();
		ev.preventDefault();
		container[classList].toggle(debugClass);
		var showDebugGridMessage = function () {
			var col = d[getElementsByClassName]("col")[0] || "",
			elements = [b, page, container, col],
			debugMessage = [],
			renderElementsInfo = function (e) {
				if (e) {
					debugMessage.push((e.className ? "." + e.className : e.id ? "#" + e.id : e.tagName), " ", w.getComputedStyle(e).getPropertyValue("font-size"), " ", w.getComputedStyle(e).getPropertyValue("line-height"), " ", e.offsetWidth, "x", e.offsetHeight, " \u003e ");
				}
			};
			for (var i = 0, l = elements.length; i < l; i += 1) {
				renderElementsInfo(elements[i]);
			}
			/* forEach(elements, renderElementsInfo, false); */
			debugMessage = debugMessage.join("");
			debugMessage = debugMessage.slice(0, debugMessage.lastIndexOf(" \u003e "));
			notiBar({
				"message": debugMessage,
				"timeout": 5000,
				"key": cookieKey,
				"datum": cookieDatum,
				"days": 0
			});
		};
		var handleDebugGridContainer = function () {
			if (container) {
				container[classList].remove(debugClass);
				container[_removeEventListener]("click", handleDebugGridContainer);
			}
		};
		if (container[classList].contains(debugClass)) {
			container[_addEventListener]("click", handleDebugGridContainer);
			showDebugGridMessage();
		} else {
			container[_removeEventListener]("click", handleDebugGridContainer);
		}
	};
	if (page && container && btn) {
		var locationHref = w.location.href || "";
		if (locationHref && parseLink(locationHref).hasHTTP && (/^(localhost|127.0.0.1)/).test(parseLink(locationHref).hostname)) {
			btn[_addEventListener]("click", handleDebugGridButton);
		} else {
			btn.style.display = "none";
		}
	}
};
document.ready().then(manageDebugGridButton);
/*!
 * process routes, render contents select
 */
var initRouting = function () {
	"use strict";
	var w = globalRoot;
	var d = document;
	var getElementById = "getElementById";
	var getElementsByClassName = "getElementsByClassName";
	var getElementsByTagName = "getElementsByTagName";
	var classList = "classList";
	var dataset = "dataset";
	var _length = "length";
	var title = "title";
	var href = "href";
	var createElement = "createElement";
	var createTextNode = "createTextNode";
	var createDocumentFragment = "createDocumentFragment";
	var createElementNS = "createElementNS";
	var setAttributeNS = "setAttributeNS";
	var appendChild = "appendChild";
	/* var innerHTML = "innerHTML"; */
	var parentNode = "parentNode";
	var _addEventListener = "addEventListener";
	var appContentId = "app-content";
	var appContent = d[getElementById](appContentId) || "";
	var appContentParent = appContent[parentNode] || "";
	/* var contentsSelectTemplate = d[getElementById]("template_contents_select") || ""; */
	/* var contentsSelectRender = d[getElementById]("render_contents_select") || ""; */
	var contentsSelect = d[getElementsByClassName]("contents-select")[0] || "";
	var holderContentsSelect = d[getElementsByClassName]("holder-contents-select")[0] || "";
	var contentsListClass = "contents-list";
	var searchTextInput = d[getElementById]("text") || "";
	var asideTemplateId = "template_aside";
	var asideRenderId = "render_aside";
	var commentsTemplateId = "template_comments";
	var commentsRenderId = "render_comments";
	var nextHrefTemplateId = "template_bottom_navigation";
	var nextHrefRenderId = "render_bottom_navigation";
	var contentsGridTemplateId = "template_contents_grid";
	var contentsGridRenderId = "render_contents_grid";
	var masonryGridClass = "masonry-grid";
	var isActiveClass = "is-active";
	var isDropdownClass = "is-dropdown";
	var routesJsonUrl = "./libs/pwa-englishextra/json/routes.json";
	var contentsListButtonDefaultText = contentsSelect ? (contentsSelect.options[0].firstChild.textContent || "") : "";
	var processRoutesJsonResponse = function (routesJsonResponse) {
		var routesJsonObj;
		try {
			routesJsonObj = JSON.parse(routesJsonResponse);
			if (!routesJsonObj.hashes) {
				throw new Error("incomplete JSON data: no hashes");
			} else if (!routesJsonObj.home) {
				throw new Error("incomplete JSON data: no home");
			} else {
				if (!routesJsonObj.notfound) {
					throw new Error("incomplete JSON data: no notfound");
				}
			}
		} catch (err) {
			console.log("cannot init processRoutesJsonResponse", err);
			return;
		}
		var renderMasonry;
		var renderComments;
		var triggerOnContentInserted = function (titleString, nextHrefString, asideObj, routesObj) {
			/* var h1 = contentsSelect || d[getElementById]("h1") || "";
			var h1Pos = findPos(h1).top || 0;
			if (h1) {
				scroll2Top(h1Pos, 20000);
			} else {
				scroll2Top(0, 20000);
			} */
			/* scroll2Top(0, 20000); */
			/* if (titleString) { */
			d[title] = (titleString ? titleString + " - " : "") + (initialDocumentTitle ? initialDocumentTitle + (userBrowsingDetails ? userBrowsingDetails : "") : "");
			/* } */
			var locationHash = w.location.hash || "";
			if (contentsSelect) {
				var optionMatched = false;
				for (var i = 0, l = contentsSelect.options[_length]; i < l; i += 1) {
					if (locationHash === contentsSelect.options[i].value) {
						optionMatched = true;
						contentsSelect.selectedIndex = i;
						break;
					}
				}
				/* for (var key in contentsSelect.options) {
					if (contentsSelect.options.hasOwnProperty(key)) {
						if (locationHash === contentsSelect.options[key].value) {
							optionMatched = true;
							contentsSelect.selectedIndex = key;
							break;
						}
					}
				} */
				if (!optionMatched) {
					contentsSelect.selectedIndex = 0;
				}
			}
			var contentsList = d[getElementsByClassName](contentsListClass)[0] || "";
			if (contentsList) {
				var contentsListButton = holderContentsSelect ? holderContentsSelect[getElementsByTagName]("a")[0] || "" : "";
				if (contentsListButton) {
					var itemMatched = false;
					var contentsListItems = contentsList ? contentsList[getElementsByTagName]("li") || "" : "";
					for (var j = 0, m = contentsListItems[_length]; j < m; j += 1) {
						if (locationHash === contentsListItems[j][dataset][href]) {
							itemMatched = true;
							contentsListButton.replaceChild(d[createTextNode](contentsListItems[j].firstChild.textContent), contentsListButton.firstChild);
							break;
						}
					}
					/* for (var key2 in contentsListItems) {
						if (contentsListItems.hasOwnProperty(key2)) {
							if (locationHash === contentsListItems[key2][dataset][href]) {
								itemMatched = true;
								contentsListButton.replaceChild(d[createTextNode](contentsListItems[key2].firstChild.textContent), contentsListButton.firstChild);
								break;
							}
						}
					} */
					if (!itemMatched) {
						contentsListButton.replaceChild(d[createTextNode](contentsListButtonDefaultText), contentsListButton.firstChild);
					}
				}
			}
			if (asideObj) {
				var asideTemplate = d[getElementById](asideTemplateId) || "";
				var asideRender = d[getElementById](asideRenderId) || "";
				var asideRenderParent = asideRender[parentNode] || "";
				if (asideTemplate && asideRender) {
					insertFromTemplate(asideObj, asideTemplateId, asideRenderId, function () {
						if (asideRenderParent) {
							manageExternalLinkAll(asideRenderParent);
							var timers = new Timers();
							timers.timeout(function () {
								timers.clear();
								timers = null;
								handleDataSrcImageAll();
							}, 500);
						}
					});
				}
			}
			if (nextHrefString) {
				var nextHrefTemplate = d[getElementById](nextHrefTemplateId) || "";
				var nextHrefRender = d[getElementById](nextHrefRenderId) || "";
				if (nextHrefTemplate && nextHrefRender) {
					insertFromTemplate({
						"next_href": nextHrefString
					}, nextHrefTemplateId, nextHrefRenderId);
				}
			}
			var commentsTemplate = d[getElementById](commentsTemplateId) || "";
			var commentsRender = d[getElementById](commentsRenderId) || "";
			var commentsRenderParent = commentsRender[parentNode] || "";
			if (commentsTemplate && commentsRender) {
				if (!renderComments) {
					renderComments = renderTemplate({}, commentsTemplateId, commentsRenderId);
				}
				insertTextAsFragment(renderComments, commentsRender, function () {
					if (commentsRenderParent) {
						manageDisqusButton(commentsRenderParent);
					}
				});
			}
			var masonryGrid = d[getElementsByClassName](masonryGridClass)[0] || "";
			var masonryGridParent = masonryGrid[parentNode] || "";
			if (masonryGrid && masonryGridParent) {
				var contentsGridTemplate = d[getElementById](contentsGridTemplateId) || "";
				var contentsGridRender = d[getElementById](contentsGridRenderId) || "";
				var contentsGridRenderParent = contentsGridRender[parentNode] || "";
				if (contentsGridTemplate && contentsGridRender) {
					if (!renderMasonry) {
						if (routesObj) {
							renderMasonry = renderTemplate(routesObj, contentsGridTemplateId, contentsGridRenderId);
						}
					}
					insertTextAsFragment(renderMasonry, contentsGridRender, function () {
						if (contentsGridRenderParent) {
							initMasonry(contentsGridRenderParent);
							manageExternalLinkAll(contentsGridRenderParent);
							var timers = new Timers();
							timers.timeout(function () {
								timers.clear();
								timers = null;
								handleDataSrcImageAll();
							}, 500);
						}
					});
				} else {
					initMasonry(masonryGridParent);
				}
			}
			/*!
			 * cache parent node beforehand
			 * put when templates rendered
			 */
			if (appContentParent) {
				manageExternalLinkAll(appContentParent);
				manageImgLightboxLinks(appContentParent);
				manageIframeLightboxLinks(appContentParent);
				manageChaptersSelect(appContentParent);
				manageExpandingLayers(appContentParent);
				handleDataSrcIframeAll();
				var timers = new Timers();
				timers.timeout(function () {
					timers.clear();
					timers = null;
					handleDataSrcImageAll();
				}, 500);
			}
			LoadingSpinner.hide(scroll2Top.bind(null, 0, 20000));
		};
		initKamilAutocomplete(routesJsonObj.hashes);
		var handleRoutesWindow = function () {
			if (searchTextInput) {
				searchTextInput.blur();
			}
			var locationHash = w.location.hash || "";
			if (locationHash) {
				var isNotfound = false;
				for (var i = 0, l = routesJsonObj.hashes[_length]; i < l; i += 1) {
					if (locationHash === routesJsonObj.hashes[i][href]) {
						isNotfound = true;
						LoadingSpinner.show();
						insertExternalHTML(appContentId, routesJsonObj.hashes[i].url, triggerOnContentInserted.bind(null, routesJsonObj.hashes[i][title], routesJsonObj.hashes[i].next_href, routesJsonObj.hashes[i].aside, routesJsonObj));
						break;
					}
				}
				/* for (var key in routesJsonObj.hashes) {
					if (routesJsonObj.hashes.hasOwnProperty(key)) {
						if (locationHash === routesJsonObj.hashes[key][href]) {
							isNotfound = true;
							LoadingSpinner.show();
							insertExternalHTML(appContentId, routesJsonObj.hashes[key].url, triggerOnContentInserted.bind(null, routesJsonObj.hashes[key][title], routesJsonObj.hashes[key].next_href, routesJsonObj.hashes[key].aside, routesJsonObj));
							break;
						}
					}
				} */
				if (false === isNotfound) {
					var notfoundUrl = routesJsonObj.notfound.url;
					var notfoundTitle = routesJsonObj.notfound[title];
					if (notfoundUrl /* && notfoundTitle */) {
						LoadingSpinner.show();
						insertExternalHTML(appContentId, notfoundUrl, triggerOnContentInserted.bind(null, notfoundTitle, null, null, routesJsonObj));
					}
				}
			} else {
				var homeUrl = routesJsonObj.home.url;
				var homeTitle = routesJsonObj.home[title];
				if (homeUrl /* && homeTitle */) {
					LoadingSpinner.show();
					insertExternalHTML(appContentId, homeUrl, triggerOnContentInserted.bind(null, homeTitle, null, null, routesJsonObj));
				}
			}
		};
		handleRoutesWindow();
		w[_addEventListener]("hashchange", handleRoutesWindow);
		/*var rerenderContentsSelect = function () {
			var handleContentsSelect = function () {
				var _this = this;
				var hashString = _this.options[_this.selectedIndex].value || "";
				if (hashString) {
					var tragetObject = isValidId(hashString, true) ? d[getElementById](hashString.replace(/^#/, "")) || "" : "";
					if (tragetObject) {
						scroll2Top(findPos(tragetObject).top, 10000);
					} else {
						w.location.hash = hashString;
					}
				}
			};
			var df = d[createDocumentFragment]();
			var generateContentsSelectOptions = function (e) {
				if (e[title]) {
					var contentsOption = d[createElement]("option");
					contentsOption.value = e[href];
					var contentsOptionText = e[title];
					contentsOption[title] = contentsOptionText;
					var contentsOptionTextTruncated = truncString("" + contentsOptionText, 44);
					contentsOption[appendChild](d.createTextNode(contentsOptionTextTruncated));
					df[appendChild](contentsOption);
					df[appendChild](d.createTextNode("\n"));
				}
			};
			for (var i = 0, l = routesJsonObj.hashes[_length]; i < l; i += 1) {
				generateContentsSelectOptions(routesJsonObj.hashes[i]);
			}
			appendFragment(df, contentsSelectRender);*/
			/*!
			 * insertFromTemplate used in renderTemplate
			 * will remove event listener from select (parent) element,
			 * because it uses fragment method and not inner html
			 * (UPD now you can set last arg as true, and the event listener will work),
			 * so you will have to use inner html method
			 * alternative way to generate select options
			 * with document fragment
			 */
			/* if (contentsSelectTemplate && contentsSelectRender) {
				var contentsSelectHtml = contentsSelectTemplate[innerHTML] || "";
				var renderContentsSelectTemplate = new t(contentsSelectHtml);
				var contentsSelectRendered = renderContentsSelectTemplate.render(routesJsonObj);
				contentsSelectRender[innerHTML] = contentsSelectRendered;
			} */
			/*contentsSelect[_addEventListener]("change", handleContentsSelect);
		};*/
		var rerenderContentsList = function () {
			var handleContentsListItem = function (listObj, hashString) {
				if (hashString) {
					var tragetObject = isValidId(hashString, true) ? d[getElementById](hashString.replace(/^#/, "")) || "" : "";
					if (tragetObject) {
						scroll2Top(findPos(tragetObject).top, 10000);
					} else {
						w.location.hash = hashString;
					}
				}
				listObj[classList].remove(isActiveClass);
			};
			var contentsList = d[createElement]("ul");
			var contentsListButtonText = contentsSelect.options[0].textContent || "";
			var df = d[createDocumentFragment]();
			var generateContentsListItems = function (e) {
				if (e[title]) {
					var contentsListItem = d[createElement]("li");
					var contentsListItemHref = e[href];
					var contentsListItemText = e[title];
					contentsListItem[title] = contentsListItemText;
					contentsListItem[dataset][href] = contentsListItemHref;
					var contentsListItemTextTruncated = truncString("" + contentsListItemText, 44);
					contentsListItem[appendChild](d.createTextNode(contentsListItemTextTruncated));
					contentsListItem[_addEventListener]("click", handleContentsListItem.bind(null, contentsList, contentsListItemHref));
					df[appendChild](contentsListItem);
					df[appendChild](d.createTextNode("\n"));
				}
			};
			for (var j = 0, m = routesJsonObj.hashes[_length]; j < m; j += 1) {
				generateContentsListItems(routesJsonObj.hashes[j]);
			}
			/* forEach(routesJsonObj.hashes, generateContentsListItems, false); */
			appendFragment(df, contentsList);
			contentsList[classList].add(contentsListClass);
			contentsList[classList].add(isDropdownClass);
			holderContentsSelect.replaceChild(contentsList, contentsSelect[parentNode][parentNode]);
			var contentsListButton = d[createElement]("a");
			contentsListButton[appendChild](d[createTextNode](contentsListButtonText));
			contentsList[parentNode].insertBefore(contentsListButton, contentsList);
			/*jshint -W107 */
			contentsListButton[href] = "javascript:void(0);";
			/*jshint +W107 */
			var insertChevronDownSmallSvg = function (targetObj) {
				var svg = d[createElementNS]("http://www.w3.org/2000/svg", "svg");
				var use = d[createElementNS]("http://www.w3.org/2000/svg", "use");
				svg[classList].add("ui-icon");
				use[setAttributeNS]("http://www.w3.org/1999/xlink", "xlink:href", "#ui-icon-ChevronDownSmall");
				svg[appendChild](use);
				targetObj[appendChild](svg);
			};
			insertChevronDownSmallSvg(contentsListButton);
			var handleContentsListItemsButton = function (ev) {
				ev.stopPropagation();
				ev.preventDefault();
				contentsList[classList].toggle(isActiveClass);
				handleOtherDropdownLists(contentsList);
			};
			contentsListButton[_addEventListener]("click", handleContentsListItemsButton);
		};
		if (contentsSelect) {
			/* if (contentsSelectRender) {
				rerenderContentsSelect();
			} */
			if (holderContentsSelect) {
				rerenderContentsList();
			}
		}
	};
	if (appContent) {
		loadUnparsedJSON(routesJsonUrl, processRoutesJsonResponse);
	}
};
document.ready().then(initRouting);
/*!
 * observe mutations
 * bind functions only for inserted DOM
 * @param {String} ctx HTML Element class or id string
 */
/* var observeMutations = function (scope) {
	"use strict";
	var ctx = scope && scope.nodeName ? scope : "";
	var mo;
	var getMutations = function (e) {
		var triggerOnMutation = function (m) {
			console.log("mutations observer: " + m.type);
			console.log(m.type, "target: " + m.target.tagName + ("." + m.target.className || "#" + m.target.id || ""));
			console.log(m.type, "added: " + m.addedNodes.length + " nodes");
			console.log(m.type, "removed: " + m.removedNodes.length + " nodes");
			if ("childList" === m.type || "subtree" === m.type) {
				mo.disconnect();
			}
		};
		for (var i = 0, l = e.length; i < l; i += 1) {
			triggerOnMutation(e[i]);
		}
	};
	if (ctx) {
		mo = new MutationObserver(getMutations);
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
	var w = globalRoot;
	var d = document;
	var getElementById = "getElementById";
	var parentNode = "parentNode";
	var ctx = d[getElementById]("app-content")[parentNode] || "";
	var locationHash = w.location.hash || "";
	if (ctx && locationHash) {
		console.log("triggered function: updateInsertedDom");
		observeMutations(ctx);
	}
};
globalRoot.addEventListener("hashchange", updateInsertedDom); */
/*!
 * init ui-totop
 */
var initUiTotop = function () {
	"use strict";
	var w = globalRoot;
	var d = document;
	var h = d.documentElement || "";
	var b = d.body || "";
	var getElementsByClassName = "getElementsByClassName";
	var classList = "classList";
	var createElement = "createElement";
	var appendChild = "appendChild";
	var createElementNS = "createElementNS";
	var setAttributeNS = "setAttributeNS";
	var _addEventListener = "addEventListener";
	var btnClass = "ui-totop";
	var btnTitle = "Наверх";
	var isActiveClass = "is-active";
	var anchor = d[createElement]("a");
	var insertUpSvg = function (targetObj) {
		var svg = d[createElementNS]("http://www.w3.org/2000/svg", "svg");
		var use = d[createElementNS]("http://www.w3.org/2000/svg", "use");
		svg[classList].add("ui-icon");
		use[setAttributeNS]("http://www.w3.org/1999/xlink", "xlink:href", "#ui-icon-Up");
		svg[appendChild](use);
		targetObj[appendChild](svg);
	};
	var handleUiTotopAnchor = function (ev) {
		ev.stopPropagation();
		ev.preventDefault();
		scroll2Top(0, 20000);
	};
	var handleUiTotopWindow = function (_this) {
		var logicHandleUiTotopWindow = function () {
			var btn = d[getElementsByClassName](btnClass)[0] || "";
			var scrollPosition = _this.pageYOffset || h.scrollTop || b.scrollTop || "";
			var windowHeight = _this.innerHeight || h.clientHeight || b.clientHeight || "";
			if (scrollPosition && windowHeight && btn) {
				if (scrollPosition > windowHeight) {
					btn[classList].add(isActiveClass);
				} else {
					btn[classList].remove(isActiveClass);
				}
			}
		};
		var throttleLogicHandleUiTotopWindow = throttle(logicHandleUiTotopWindow, 100);
		throttleLogicHandleUiTotopWindow();
	};
	anchor[classList].add(btnClass);
	/*jshint -W107 */
	anchor.href = "javascript:void(0);";
	/*jshint +W107 */
	anchor.title = btnTitle;
	insertUpSvg(anchor);
	b[appendChild](anchor);
	if (b) {
		anchor[_addEventListener]("click", handleUiTotopAnchor);
		w[_addEventListener]("scroll", handleUiTotopWindow, {passive: true});
	}
};
document.ready().then(initUiTotop);
/*!
 * init manUP.js
 */
/* var initManUp = function () {
	"use strict";
	if ("undefined" !== typeof getHTTP && getHTTP()) {
		var jsUrl = "/cdn/ManUp.js/0.7/js/manup.fixed.min.js";
		if (!scriptIsLoaded(jsUrl)) {
			loadJS(jsUrl);
		}
	}
};
document.ready().then(initManUp); */
/*!
 * show page, finish ToProgress
 */
var showPageFinishProgress = function () {
	"use strict";
	var d = document;
	var getElementById = "getElementById";
	var page = d[getElementById]("page") || "";
	var showPage = function () {
		page.style.opacity = 1;
	};
	if (page) {
		if ("undefined" !== typeof imagesPreloaded) {
			var timers = new Timers();
			timers.interval(function () {
				if (imagesPreloaded) {
					timers.clear();
					timers = null;
					showPage();
				}
			}, 100);
		} else {
			showPage();
		}
	}
};
document.ready().then(showPageFinishProgress);
