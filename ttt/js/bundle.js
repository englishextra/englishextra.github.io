/*!
 * modified routie - a tiny hash router
 * v0.3.2
 * http://projects.jga.me/routie
 * copyright Greg Allen 2016
 * MIT License
 * source: github.com/jgallen23/routie/blob/master/dist/routie.js
 * passes jshint
 */
(function(root){var Routie=function(w,isModule){var routes=[];var map={};var reference="routie";var oldReference=w[reference];var Route=function(path,name){this.name=name;this.path=path;this.keys=[];this.fns=[];this.params={};this.regex=pathToRegexp(this.path,this.keys,false,false);};Route.prototype.addHandler=function(fn){this.fns.push(fn);};Route.prototype.removeHandler=function(fn){for(var i=0,c=this.fns.length;i<c;i++){var f=this.fns[i];if(fn==f){this.fns.splice(i,1);return;}}};Route.prototype.run=function(params){for(var i=0,c=this.fns.length;i<c;i++){this.fns[i].apply(this,params);}};Route.prototype.match=function(path,params){var m=this.regex.exec(path);if(!m)return false;for(var i=1,len=m.length;i<len;++i){var key=this.keys[i-1];var val=('string'==typeof m[i])?decodeURIComponent(m[i]):m[i];if(key){this.params[key.name]=val;}params.push(val);}return true;};Route.prototype.toURL=function(params){var path=this.path;for(var param in params){if(params.hasOwnProperty(param)){path=path.replace('/:'+param,'/'+params[param]);}}path=path.replace(/\/:.*\?/g,'/').replace(/\?/g,'');if(path.indexOf(':')!=-1){throw new Error('missing parameters for url: '+path);}return path;};var pathToRegexp=function(path,keys,sensitive,strict){if(path instanceof RegExp)return path;if(path instanceof Array)path='('+path.join('|')+')';path=path.concat(strict?'':'/?').replace(/\/\(/g,'(?:/').replace(/\+/g,'__plus__').replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?/g,function(_,slash,format,key,capture,optional){keys.push({name:key,optional:!!optional});slash=slash||'';return''+(optional?'':slash)+'(?:'+(optional?slash:'')+(format||'')+(capture||(format&&'([^/.]+?)'||'([^/]+?)'))+')'+(optional||'');}).replace(/([\/.])/g,'\\$1').replace(/__plus__/g,'(.+)').replace(/\*/g,'(.*)');return new RegExp('^'+path+'$',sensitive?'':'i');};var addHandler=function(path,fn){var s=path.split(' ');var name=(s.length==2)?s[0]:null;path=(s.length==2)?s[1]:s[0];if(!map[path]){map[path]=new Route(path,name);routes.push(map[path]);}map[path].addHandler(fn);};var routie=function(path,fn){if(typeof fn=='function'){addHandler(path,fn);routie.reload();}else if(typeof path=='object'){for(var p in path){if(path.hasOwnProperty(p)){addHandler(p,path[p]);}}routie.reload();}else if(typeof fn==='undefined'){routie.navbarigate(path);}};routie.lookup=function(name,obj){for(var i=0,c=routes.length;i<c;i++){var route=routes[i];if(route.name==name){return route.toURL(obj);}}};routie.remove=function(path,fn){var route=map[path];if(!route)return;route.removeHandler(fn);};routie.removeAll=function(){map={};routes=[];};routie.navbarigate=function(path,options){options=options||{};var silent=options.silent||false;if(silent){removeListener();}setTimeout(function(){window.location.hash=path;if(silent){setTimeout(function(){addListener();},1);}},1);};routie.noConflict=function(){w[reference]=oldReference;return routie;};var getHash=function(){return window.location.hash.substring(1);};var checkRoute=function(hash,route){var params=[];if(route.match(hash,params)){route.run(params);return true;}return false;};var hashChanged=routie.reload=function(){var hash=getHash();for(var i=0,c=routes.length;i<c;i++){var route=routes[i];if(checkRoute(hash,route)){return;}}};var addListener=function(){if(w.addEventListener){w.addEventListener('hashchange',hashChanged,false);}else{w.attachEvent('onhashchange',hashChanged);}};var removeListener=function(){if(w.removeEventListener){w.removeEventListener('hashchange',hashChanged);}else{w.detachEvent('onhashchange',hashChanged);}};addListener();if(isModule){return routie;}else{w[reference]=routie;}};if(typeof module=='undefined'){Routie(root);}else{module.exports=Routie(root);}})("undefined"===typeof window?"undefined"===typeof self?"undefined"===typeof global?this:global:self:window);
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
 * modified Animated Scroll to Top Control In Vanilla JS
 * jsfiddle.net/englishextra/ssgqhuk5/
 * @see {@link http://cssscript.com/animated-scroll-to-top-control-in-vanilla-js-scroll2top/} 
 * passes jshint
 */
var scroll2Top=function(){var animate=(function(){var action=window.requestAnimationFrame||function(callback){window.setTimeout(callback,1000/60);};return function(runner){action.call(window,runner);};})();var scrollTop=function(el,nextStep){if(nextStep===null||nextStep===undefined){return(el.scrollY!==null&&el.scrollY!==undefined)?el.scrollY:el.scrollTop;}else if(nextStep<=0){if(el.scrollTo){el.scrollTo(0,0);}else{el.scrollTop=0;}return 0;}else{if(el.scrollTo){el.scrollTo(0,nextStep);}else{el.scrollTop=nextStep;}return nextStep;}},speedConduct=function(originSpeed,time,cur,total){if(total===0){return 0;}var method=Math.sin;var PI=Math.PI;var INIT_SPEED=2;return originSpeed*method(PI*(total-cur)/total)+INIT_SPEED;};return function(el,time){var DEFAULT_TIME=1000;if(el===null||el===undefined){throw new Error('You must assign a dom node object or window object as the first param.');}if(time===null||time===undefined){time=DEFAULT_TIME;}var originY=scrollTop(el),currentY=originY,originSpeed=originY/(time/60),currentSpeed;(function operate(){currentSpeed=speedConduct(originSpeed,time,currentY,originY);currentY-=currentSpeed;if(scrollTop(el,currentY)!==0){animate(operate);}})();};}();
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
;(function setJsClassToDocumentElement(a){if(a){a.classList.add("js");}}(document.documentElement||""));
/* jshint ignore:end */
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
 * replacement for inner html
 */
var insertTextAsFragment = function (t, c, f) {
	"use strict";
	var d = document,
	b = d.getElementsByTagName("body")[0] || "",
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
			n.appendChild(df);
			return c.parentNode ? c.parentNode.replaceChild(n, c) : c.innerHTML = t,
			g();
		} else {
			n.innerHTML = t;
			return c.parentNode ? c.parentNode.replaceChild(d.createDocumentFragment.appendChild(n), c) : c.innerHTML = t,
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
	var w = window,
	c = document.querySelector(a) || "",
	g = function (t, s) {
		var q = function () {
			return s && "function" === typeof s && s();
		};
		insertTextAsFragment(t, c, q);
	},
	k = function () {
		if (w.Promise && w.fetch) {
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
		}
	};
	if (c) {
		console.log("triggered function: insertExternalHTML");
		k();
	}
};
/*!
 * render navigation
 */
(function () {
	"use strict";
	var menuTemplate = document.querySelector("#template-navbar_links_local") || "",
	menuList = document.querySelector("#navbar_links_local") || "";
	if (menuTemplate && menuList) {
		var menuTemplateHtml = menuTemplate.innerHTML || "",
		menuHtml = new t(menuTemplateHtml),
		menuJson = {
			navbar_links_local: [{
					"url": "#/home",
					"text": "home"
				}, {
					"url": "#/about",
					"text": "about"
				}
			]
		};
		var menuRendered = menuHtml.render(menuJson);
		insertTextAsFragment(menuRendered, menuList);
	}
	var appContentId = "#app-content",
	appContent = document.querySelector(appContentId) || "";
	if (appContent) {
		routie({
			"": function () {
				/* window.location.hash = "#/home"; */
				insertExternalHTML(appContentId, "./includes/home.html");
			},
			"/home": function () {
				insertExternalHTML(appContentId, "./includes/home.html");
			},
			"/about": function () {
				insertExternalHTML(appContentId, "./includes/about.html");
			},
			"/*": function () {}
		});
	}
}
	());
/*!
 * modified navbar.js - Minimal navigation script
 * by dnp_theme
 * Licensed under MIT-License
 * @see {@link https://gist.github.com/englishextra/76206ce67897113f5520e31a766fc5ce}
 * @see {@link https://github.com/thednp/navbar.js/blob/master/navbar.js}
 * passes jshint
 */
(function () {
	"use strict";
	var bar = '[data-function="navbar"]',
	containerClass = ".container",
	rootStyle = document.documentElement.style || "",
	supportTransitions = function () {
		return "WebkitTransition" in rootStyle || "transition" in rootStyle || "OTransition" in rootStyle || "MsTransition" in rootStyle || "MozTransition" in rootStyle ? !0 : !1;
	}
	(),
	on = function (element, eventName, handler) {
		element.addEventListener(eventName, handler, false);
	},
	openClass = "is-open",
	isPositioned = "is-repositioned",
	close = function (element) {
		if (element.classList.contains(openClass)) {
			element.classList.remove(openClass);
			setTimeout(function () {
				element.classList.remove(isPositioned);
			}, (supportTransitions ? 200 : 0));
		}
	},
	Navbar = function (el, outsideClass) {
		var menu = (typeof el === "object") ? el : document.querySelector(el);
		if (menu) {
			var items = menu.getElementsByTagName("li") || "";
			if (items) {
				var enterHandler = function () {
					var that = this;
					clearTimeout(that.timer);
					if (!that.classList.contains(openClass)) {
						that.timer = setTimeout(function () {
								that.classList.add(openClass);
								that.classList.add(isPositioned);
								var siblings = that.parentNode.getElementsByTagName("li");
								for (var h = 0; h < siblings.length; h++) {
									if (siblings[h] !== that) {
										close(siblings[h]);
									}
								}
							}, 100);
					}
				},
				closeHandler = function () {
					for (var i = 0, itemsLength = items.length; i < itemsLength; i++) {
						if (items[i].getElementsByTagName("ul").length) {
							close(items[i]);
						}
					}
				};
				for (var i = 0, itemsLength = items.length; i < itemsLength; i++) {
					if (items[i].getElementsByTagName("ul").length) {
						on(items[i], "click", enterHandler);
					}
				}
				window.addEventListener("hashchange", closeHandler);
				var outside = document.querySelector(outsideClass) || "";
				if (outside) {
					outside.addEventListener("click", closeHandler);
				}
			}
		}
	};
	return Navbar(bar, containerClass);
}
	());
/*!
 * Carousel v1.0
 * @see {@link https://habrahabr.ru/post/327246/}
 * @see {@link https://codepen.io/iGetPass/pen/apZPMo}
 */
(function () {
	"use strict";
	function Carousel(setting) {
		var _this = this;
		if (document.querySelector(setting.wrap) === null) {
			console.error("Carousel not fount selector " + setting.wrap);
			return;
		}
		var privates = {};
		this.prev_slide = function () {
			--privates.opt.position;
			if (privates.opt.position < 0) {
				privates.sel.wrap.classList.add('s-notransition');
				privates.opt.position = privates.opt.max_position - 1;
			}
			privates.sel.wrap.style.transform = "translateX(-" + privates.opt.position + "00%)";
		};
		this.next_slide = function () {
			++privates.opt.position;
			if (privates.opt.position >= privates.opt.max_position) {
				privates.opt.position = 0;
			}
			privates.sel.wrap.style.transform = "translateX(-" + privates.opt.position + "00%)";
		};
		privates.setting = setting;
		privates.sel = {
			"main": document.querySelector(privates.setting.main),
			"wrap": document.querySelector(privates.setting.wrap),
			"children": document.querySelector(privates.setting.wrap).children,
			"prev": document.querySelector(privates.setting.prev),
			"next": document.querySelector(privates.setting.next)
		};
		privates.opt = {
			"position": 0,
			"max_position": document.querySelector(privates.setting.wrap).children.length
		};
		if (privates.sel.prev !== null) {
			privates.sel.prev.addEventListener('click', function () {
				_this.prev_slide();
			});
		}
		if (privates.sel.next !== null) {
			privates.sel.next.addEventListener('click', function () {
				_this.next_slide();
			});
		}
	}
	new Carousel({
		"main": ".js-carousel",
		"wrap": ".js-carousel__wrap",
		"prev": ".js-carousel__prev",
		"next": ".js-carousel__next"
	});
})();
/*!
 * init ui-totop
 */
(function () {
	"use strict";
	var w = window,
	d = document,
	b = d.querySelector("body") || "",
	h = d.querySelector("html") || "",
	u = "ui-totop",
	is_active = "is-active",
	t = "Наверх",
	cL = "classList",
	cE = "createElement",
	aC = "appendChild",
	cENS = "createElementNS",
	sANS = "setAttributeNS",
	k = function (_this) {
		var a = _this.pageYOffset || h.scrollTop || b.scrollTop || "",
		c = _this.innerHeight || h.clientHeight || b.clientHeight || "",
		e = d.querySelector("." + u) || "";
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
			scroll2Top(w, 400);
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
		a.addEventListener("click", h_a);
		svg[cL].add("ui-icon");
		use[sANS]("http://www.w3.org/1999/xlink", "xlink:href", "#ui-icon-Up");
		svg[aC](use);
		a[aC](svg);
		b[aC](a);
		w.addEventListener("scroll", k.bind(null, w));
	};
	if (b) {
		console.log("triggered function: initUiTotop");
		g();
	}
}());
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
				if (imagesPreloaded) {
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
