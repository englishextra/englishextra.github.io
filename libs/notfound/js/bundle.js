/*jslint browser: true */
/*jslint node: true */
/*global global, _, ActiveXObject, alignToMasterBottomLeft, appendFragment, BALA, 
Carousel, changeLocation, container, Cookies, crel, debounce, define, 
DISQUS, DoSlide, Draggabilly, earlyDeviceOrientation, earlyDeviceSize, 
earlyDeviceType, earlyFnGetYyyymmdd, earlyHasTouch, 
earlySvgasimgSupport, earlySvgSupport, escape, fetch, findPos, 
fixEnRuTypo, forEach, getHTTP, getKeyValuesFromJSON, IframeLightbox, 
imagePromise, imagesLoaded, imagesPreloaded, insertExternalHTML, 
insertTextAsFragment, Isotope, isValidId, jQuery, Kamil, 
loadExternalHTML, loadJS, loadUnparsedJSON, manageDataSrcImages, 
manageImgLightboxLinks, Masonry, module, openDeviceBrowser, Packery, 
Parallax, parseLink, PhotoSwipe, PhotoSwipeUI_Default, pnotify, 
prependFragmentBefore, prettyPrint, Promise, Proxy, QRCode, 
removeChildren, removeElement, require, routie, safelyParseJSON, 
scriptIsLoaded, scroll2Top, scrollToElement, scrollToPos, scrollToTop, 
setImmediate, setStyleDisplayBlock, setStyleDisplayNone, 
setStyleOpacity, setStyleVisibilityHidden, setStyleVisibilityVisible, t, 
Tablesort, throttle, Timers, ToProgress, truncString, unescape, verge, 
VK, Ya, ymaps, zenscroll */
/*!
 * define global root
 */
/* var globalRoot = "object" === typeof window && window || "object" === typeof self && self || "object" === typeof global && global || {}; */
var globalRoot = "undefined" !== typeof window ? window : this;
/*!
 * safe way to handle console.log
 * @see {@link https://github.com/paulmillr/console-polyfill}
 */
(function (root) {
  "use strict";
  if (!root.console) {
    root.console = {};
  }var con = root.console;var prop, method;var dummy = function () {};var properties = ["memory"];var methods = ("assert,clear,count,debug,dir,dirxml,error,exception,group," + "groupCollapsed,groupEnd,info,log,markTimeline,profile,profiles,profileEnd," + "show,table,time,timeEnd,timeline,timelineEnd,timeStamp,trace,warn").split(",");while (prop = properties.pop()) {
    if (!con[prop]) {
      con[prop] = {};
    }
  }while (method = methods.pop()) {
    if (!con[method]) {
      con[method] = dummy;
    }
  }
})(globalRoot);
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
(function (root) {
  "use strict";
  var BALA = function () {
    var g = function (document, s_addEventListener, s_querySelectorAll) {
      function g(s, context, bala) {
        bala = Object.create(g.fn);if (s) {
          bala.push.apply(bala, s[s_addEventListener] ? [s] : "" + s === s ? /</.test(s) ? ((context = document.createElement(context || s_addEventListener)).innerHTML = s, context.children) : context ? (context = g(context)[0]) ? context[s_querySelectorAll](s) : bala : document[s_querySelectorAll](s) : typeof s === "function" ? document.readyState[7] ? s() : document[s_addEventListener]('DOMContentLoaded', s) : s);
        }return bala;
      }g.fn = [];g.one = function (s, context) {
        return g(s, context)[0] || null;
      };return g;
    }(document, 'addEventListener', 'querySelectorAll');return g;
  }();root.BALA = BALA;
})(globalRoot);
/*!
 * safe way to handle console.log
 * @see {@link https://github.com/paulmillr/console-polyfill}
 */
(function (root) {
  "use strict";
  if (!root.console) {
    root.console = {};
  }var con = root.console;var prop, method;var dummy = function () {};var properties = ["memory"];var methods = ("assert,clear,count,debug,dir,dirxml,error,exception,group," + "groupCollapsed,groupEnd,info,log,markTimeline,profile,profiles,profileEnd," + "show,table,time,timeEnd,timeline,timelineEnd,timeStamp,trace,warn").split(",");while (prop = properties.pop()) {
    if (!con[prop]) {
      con[prop] = {};
    }
  }while (method = methods.pop()) {
    if (!con[method]) {
      con[method] = dummy;
    }
  }
})(globalRoot);
/*!
 * add js class to html element
 */
(function (classes) {
  "use strict";
  if (classes) {
    classes.add("js");
  }
})(document.documentElement.classList || "");
/*!
 * modified MediaHack - (c) 2013 Pomke Nohkan MIT LICENCED.
 * @see {@link https://gist.github.com/englishextra/ff8c9dde94abe32a9d7c4a65e0f2ccac}
 * @see {@link https://jsfiddle.net/englishextra/xg7ce8kc/}
 * removed className fallback and additionally
 * returns earlyDeviceOrientation,earlyDeviceSize
 * Add media query classes to DOM nodes
 * @see {@link https://github.com/pomke/mediahack/blob/master/mediahack.js}
 */
(function (root, selectors) {
  "use strict";
  var orientation,
      size,
      f = function (a) {
    var b = a.split(" ");if (selectors) {
      for (var c = 0; c < b.length; c += 1) {
        a = b[c];selectors.add(a);
      }
    }
  },
      g = function (a) {
    var b = a.split(" ");if (selectors) {
      for (var c = 0; c < b.length; c += 1) {
        a = b[c];selectors.remove(a);
      }
    }
  },
      h = { landscape: "all and (orientation:landscape)", portrait: "all and (orientation:portrait)" },
      k = { small: "all and (max-width:768px)", medium: "all and (min-width:768px) and (max-width:991px)", large: "all and (min-width:992px)" },
      d,
      mM = "matchMedia",
      m = "matches",
      o = function (a, b) {
    var c = function (a) {
      if (a[m]) {
        f(b);orientation = b;
      } else {
        g(b);
      }
    };c(a);a.addListener(c);
  },
      s = function (a, b) {
    var c = function (a) {
      if (a[m]) {
        f(b);size = b;
      } else {
        g(b);
      }
    };c(a);a.addListener(c);
  };for (d in h) {
    if (h.hasOwnProperty(d)) {
      o(root[mM](h[d]), d);
    }
  }for (d in k) {
    if (k.hasOwnProperty(d)) {
      s(root[mM](k[d]), d);
    }
  }root.earlyDeviceOrientation = orientation || "";root.earlyDeviceSize = size || "";
})(globalRoot, document.documentElement.classList || "");
/*!
 * add mobile or desktop class
 * using Detect Mobile Browsers | Open source mobile phone detection
 * Regex updated: 1 August 2014
 * detectmobilebrowsers.com
 * @see {@link https://github.com/heikojansen/plack-middleware-detectmobilebrowsers}
 */
(function (root, html, mobile, desktop, opera) {
  "use strict";
  var selector = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(opera) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(opera.substr(0, 4)) ? mobile : desktop;if (html) {
    html.classList.add(selector);
  }root.earlyDeviceType = selector || "";
})(globalRoot, document.documentElement || "", "mobile", "desktop", navigator.userAgent || navigator.vendor || globalRoot.opera);
/*!
 * add svg support class
 */
(function (root, html, selector) {
  "use strict";
  selector = document.implementation.hasFeature("http://www.w3.org/2000/svg", "1.1") ? selector : "no-" + selector;if (html) {
    html.classList.add(selector);
  }root.earlySvgSupport = selector || "";
})(globalRoot, document.documentElement || "", "svg");
/*!
 * add svgasimg support class
 */
(function (root, html, selector) {
  "use strict";
  selector = document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image", "1.1") ? selector : "no-" + selector;if (html) {
    html.classList.add(selector);
  }root.earlySvgasimgSupport = selector || "";
})(globalRoot, document.documentElement || "", "svgasimg");
/*!
 * add touch support class
 * @see {@link https://gist.github.com/englishextra/3cb22aab31a52b6760b5921e4fe8db95}
 * @see {@link https://jsfiddle.net/englishextra/z5xhjde8/}
 */
(function (root, html, selector) {
  "use strict";
  selector = "ontouchstart" in html ? selector : "no-" + selector;if (html) {
    html.classList.add(selector);
  }root.earlyHasTouch = selector || "";
})(globalRoot, document.documentElement || "", "touch");
/*!
 * return date in YYYY-MM-DD format
 */
(function (root) {
  "use strict";
  var newDate = new Date(),
      newDay = newDate.getDate(),
      newYear = newDate.getFullYear(),
      newMonth = newDate.getMonth();newMonth += 1;if (10 > newDay) {
    newDay = "0" + newDay;
  }if (10 > newMonth) {
    newMonth = "0" + newMonth;
  }root.earlyFnGetYyyymmdd = newYear + "-" + newMonth + "-" + newDay;
})(globalRoot);
/*!
 * append details to title
 */
var userBrowsingDetails = " [" + (earlyFnGetYyyymmdd ? earlyFnGetYyyymmdd : "") + (earlyDeviceType ? " " + earlyDeviceType : "") + (earlyDeviceSize ? " " + earlyDeviceSize : "") + (earlyDeviceOrientation ? " " + earlyDeviceOrientation : "") + (earlySvgSupport ? " " + earlySvgSupport : "") + (earlySvgasimgSupport ? " " + earlySvgasimgSupport : "") + (earlyHasTouch ? " " + earlyHasTouch : "") + "]";
if (document.title) {
  document.title = document.title + userBrowsingDetails;
}
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
(function (root) {
  var Timers = function (ids) {
    this.ids = ids || [];
  };Timers.prototype.timeout = function (fn, ms) {
    var id = setTimeout(fn, ms);this.ids.push(id);return id;
  };Timers.prototype.interval = function (fn, ms) {
    var id = setInterval(fn, ms);this.ids.push(id);return id;
  };Timers.prototype.clear = function () {
    this.ids.forEach(clearTimeout);this.ids = [];
  };root.Timers = Timers;
})(globalRoot);
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
(function (document, promise) {
  document.ready = promise;
})(globalRoot.document, function (chainVal) {
  "use strict";
  var d = document,
      w = globalRoot,
      loaded = /^loaded|^i|^c/.test(d.readyState),
      DOMContentLoaded = "DOMContentLoaded",
      load = "load";return new Promise(function (resolve) {
    if (loaded) {
      return resolve(chainVal);
    }function onReady() {
      resolve(chainVal);d.removeEventListener(DOMContentLoaded, onReady);w.removeEventListener(load, onReady);
    }d.addEventListener(DOMContentLoaded, onReady);w.addEventListener(load, onReady);
  });
});
/*!
 * How can I check if a JS file has been included already?
 * @see {@link https://gist.github.com/englishextra/403a0ca44fc5f495400ed0e20bc51d47}
 * @see {@link https://stackoverflow.com/questions/18155347/how-can-i-check-if-a-js-file-has-been-included-already}
 * @param {String} s path string
 * scriptIsLoaded(s)
 */
(function (root) {
  "use strict";
  var scriptIsLoaded = function (s) {
    for (var b = document.getElementsByTagName("script") || "", a = 0; a < b.length; a += 1) {
      if (b[a].getAttribute("src") === s) {
        return !0;
      }
    }return !1;
  };root.scriptIsLoaded = scriptIsLoaded;
})(globalRoot);
/*!
 * set style display block of an element
 * @param {Object} a an HTML Element
 * setStyleDisplayBlock(a)
 */
(function (root) {
  var setStyleDisplayBlock = function (a) {
    return function () {
      if (a) {
        a.style.display = "block";
      }
    }();
  };root.setStyleDisplayBlock = setStyleDisplayBlock;
})(globalRoot);
/*!
 * set style display none of an element
 * @param {Object} a an HTML Element
 * setStyleDisplayNone(a)
 */
(function (root) {
  var setStyleDisplayNone = function (a) {
    return function () {
      if (a) {
        a.style.display = "none";
      }
    }();
  };root.setStyleDisplayNone = setStyleDisplayNone;
})(globalRoot);
/*!
 * set style opacity of an element
 * @param {Object} a an HTML Element
 * @param {Number} n any positive decimal number 0.00-1.00
 * setStyleOpacity(a,n)
 */
(function (root) {
  var setStyleOpacity = function (a, n) {
    n = n || 1;return function () {
      if (a) {
        a.style.opacity = n;
      }
    }();
  };root.setStyleOpacity = setStyleOpacity;
})(globalRoot);
/*!
 * init parallax
 */
var initParallax = function () {
  "use strict";

  var w = globalRoot,
      mq = w.matchMedia("(min-width: 768px)"),
      s = BALA.one(".scene1") || "",
      p = BALA.one(".parallax") || "",
      m = BALA.one(".parallax-disabled") || "";
  if (mq.matches) {
    setStyleDisplayBlock(p);
    setStyleDisplayNone(m);
    if (s) {
      if (w.Parallax) {
        var prlx;
        prlx = new Parallax(s);
      }
    }
  } else {
    setStyleDisplayNone(p);
    setStyleDisplayBlock(m);
  }
},
    loadInitParallax = function () {
  "use strict";

  var js = "/cdn/parallax/2.1.3/js/parallax.fixed.min.js";
  if (!scriptIsLoaded(js)) {
    loadJS(js, initParallax);
  }
};
document.ready().then(loadInitParallax);
/*!
 * show page, finish ToProgress
 */
var showPageFinishProgress = function () {
  "use strict";

  var a = BALA.one("#page") || "",
      c = BALA.one(".progress") || "",
      g = function () {
    setStyleOpacity(a, 1);
    var timers = new Timers();
    timers.timeout(function () {
      timers.clear();
      timers = null;
      setStyleDisplayNone(c);
    }, 100);
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

//# sourceMappingURL=bundle.js.map