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
	var menuTemplate = document.querySelector("#template-navbarLinksLocal") || "",
	menuList = document.querySelector("#links--navigation") || "";
	if (menuTemplate && menuList) {
		var menuTemplateHtml = menuTemplate.innerHTML || "",
		menuHtml = new t(menuTemplateHtml),
		menuJson = {
			navbarLinksLocal: [{
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
	container = ".container",
	rootStyle = document.documentElement.style || "",
	supportTransitions = function () {
		return "WebkitTransition" in rootStyle || "transition" in rootStyle || "OTransition" in rootStyle || "MsTransition" in rootStyle || "MozTransition" in rootStyle ? !0 : !1;
	}
	(),
	on = function (element, eventName, handler) {
		element.addEventListener(eventName, handler, false);
	},
	mouseClick = ("ontouchstart" in document) ? ["tap"] : ["click"],
	openClass = "navbar--open",
	openPositionClass = "navbar--openposition",
	close = function (element) {
		if (element.classList.contains(openClass)) {
			element.classList.remove(openClass);
			setTimeout(function () {
				element.classList.remove(openPositionClass);
			}, (supportTransitions ? 200 : 0));
		}
	},
	Navbar = function (el, outside) {
		var menu = (typeof el === "object") ? el : document.querySelector(el),
		items = menu.getElementsByTagName("LI"),
		enterHandler = function () {
			var that = this;
			clearTimeout(that.timer);
			if (!that.classList.contains(openClass)) {
				that.timer = setTimeout(function () {
						that.classList.add(openClass);
						that.classList.add(openPositionClass);
						var siblings = that.parentNode.getElementsByTagName("LI");
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
				if (items[i].getElementsByTagName("UL").length) {
					close(items[i]);
				}
			}
		};
		for (var i = 0, itemsLength = items.length; i < itemsLength; i++) {
			if (items[i].getElementsByTagName("UL").length) {
				on(items[i], mouseClick[0], enterHandler);
			}
		}
		window.addEventListener("hashchange", closeHandler);
		document.querySelector(outside).addEventListener("click", closeHandler);
	};
	return Navbar(bar, container);
}
	());
