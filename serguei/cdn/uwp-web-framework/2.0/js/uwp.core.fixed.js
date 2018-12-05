"use strict";

/*global ActiveXObject, console */
(function (root, document) {
  "use strict";
  /* Helpers */

  Element.prototype.prependChild = function (child) {
    return this.insertBefore(child, this.firstChild);
  };

  Element.prototype.insertAfter = function (newNode, referenceNode) {
    return referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
  };

  var toArray = function toArray(obj) {
    if (!obj) {
      return [];
    }

    return Array.prototype.slice.call(obj);
  };

  var parseColor = function parseColor(color) {
    var RGB_match = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/;
    var hex_match = /^#(([0-9a-f]{1,2})([0-9a-f]{1,2})([0-9a-f]{1,2}))$/;

    var _color = color.toLowerCase();

    if (RGB_match.test(_color)) {
      return _color.match(RGB_match).slice(1);
    } else if (hex_match.test(_color)) {
      return _color.match(hex_match).slice(2).map(function (piece) {
        return parseInt(piece, 16);
      });
    }

    console.error("Unrecognized color format.");
    return null;
  };

  var calculateBrightness = function calculateBrightness(color) {
    return color.reduce(function (p, c) {
      return p + parseInt(c, 10);
    }, 0) / 3;
  };
  /*!
   * @see {@link http://www.javascriptkit.com/javatutors/loadjavascriptcss2.shtml}
   */


  var removeJsCssFile = function removeJsCssFile(filename, filetype) {
    var targetelement = filetype == "js" ? "script" : filetype == "css" ? "link" : "none";
    var targetattr = filetype == "js" ? "src" : filetype == "css" ? "href" : "none";
    var allsuspects = document.getElementsByTagName(targetelement) || "";

    for (var i = allsuspects.length; i >= 0; i--) {
      if (allsuspects[i] && allsuspects[i].getAttribute(targetattr) != null && allsuspects[i].getAttribute(targetattr).indexOf(filename) != -1) {
        allsuspects[i].parentNode.removeChild(allsuspects[i]);
        /* remove element by calling parentNode.removeChild() */
      }
    }
  };

  var _extends = function _extends() {
    var _extends = Object.assign || function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];

        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }

      return target;
    };

    return _extends.apply(this, arguments);
  };

  var parseDomFromString = function parseDomFromString(responseText) {
    var tempDiv = document.createElement('div');
    tempDiv.innerHTML = responseText;
    return tempDiv;
  };
  /* Define UWP namespace */


  var UWP = {
    version: "2.0.0",

    /* Default config */
    config: {
      pageTitle: "UWP web framework",
      layoutType: "docked-minimized",
      activeColor: "#26C6DA",
      mainColor: "#373737",
      mainColorDarkened: "#0097A7",
      includes: "./includes/serguei-uwp",
      includeScript: "./libs/serguei-uwp/js/include-script",
      includeStyle: "./libs/serguei-uwp/css/include-style",
      navContainer: "nav-container",
      home: "home",
      hashNavKey: "page"
    },

    /* Main init function */
    init: function init(params) {
      console.log("UWP.init()");
      /* Define main elements */

      UWP.head = document.head;
      UWP.body = document.body;
      /* UWP.pageTitle = document.createElement("h1"); */

      var pageTitle = document.createElement("div");
      pageTitle.setAttribute("class", "uwp-title");
      pageTitle.style.display = "none";
      UWP.pageTitle = pageTitle;
      document.body.appendChild(UWP.pageTitle);
      var header = document.createElement("div");
      header.setAttribute("class", "uwp-header");
      /* UWP.header = document.getElementsByClassName("uwp-header")[0] || ""; */

      UWP.header = header;
      document.body.appendChild(UWP.header);
      var main = document.createElement("div");
      main.setAttribute("class", "uwp-main");
      main.setAttribute("role", "main");
      /* UWP.main = document.getElementsByClassName("uwp-main")[0] || ""; */

      UWP.main = main;
      document.body.appendChild(UWP.main);
      /* Gets user-set config */

      UWP.getConfig(params);
      /* Set page title */

      UWP.pageTitle = UWP.config.pageTitle;
      /* Define additional variables */

      UWP.header.type = UWP.config.layoutType;
      UWP.body.setAttribute("data-layout-type", UWP.header.type);
      /* Handles clicking internal links */

      UWP.body.addEventListener("click", function (event) {
        if (event.target.getAttribute("data-target") !== null) {
          event.stopPropagation();
          event.preventDefault();
          UWP.navigate(event.target.getAttribute("data-target"));
        }
      });
      /* Gets navigation */

      UWP.getNavigation();
      /* Creates custom styles */

      UWP.createStyles();
      /* Handles navigation between pages */

      /* UWP.navigate(root.location.hash.split("=")[1], false); */

      UWP.navigate(root.location.hash.split(/#\//)[1], false);

      root.onhashchange = function () {
        /* UWP.navigate(root.location.hash.split("=")[1], false); */
        UWP.navigate(root.location.hash.split(/#\//)[1], false);
      };
      /* Prepares space for document's title, puts it in place */


      UWP.pageTitle = document.createElement("span");
      UWP.header.prependChild(UWP.pageTitle);
    },

    /* Gets document's navigation, puts it in place */
    getConfig: function getConfig(params) {
      console.log("UWP.getConfig()");
      UWP.config = _extends(UWP.config, params);
    },

    /* Gets document's navigation, puts it in place */
    getNavigation: function getNavigation(target) {
      console.log("UWP.getNavigation()");

      if (typeof target === "undefined") {
        target = UWP.config.navContainer;
      }

      function parseNavElement(el) {
        var elLabel = el ? el.getElementsByTagName("nav-label")[0] || "" : "";
        var navLabel = elLabel.textContent || "";
        var elTarget = el ? el.getElementsByTagName("nav-target")[0] || "" : "";
        var navTarget = elTarget.textContent || "";
        var elIcon = el ? el.getElementsByTagName("nav-icon")[0] || "" : "";
        var navIconSource = elIcon;
        var navElement = document.createElement("li");
        var navLink = document.createElement("a");
        /* jshint -W107 */

        navLink.href = "javascript:void(0);";
        /* jshint +W107 */

        navLink.title = navLabel;
        navLink.innerHTML = navLabel;

        if (navIconSource) {
          var navIcon = document.createElement("span");
          /* If that's a file, we'll create an img object with src pointed to it */

          if (/\.(jpg|png|gif|svg)/.test(navIconSource.textContent)) {
            var navIconImage = document.createElement("img");
            navIconImage.src = navIconSource.textContent;
            navIcon.appendChild(navIconImage);
          }
          /* ...otherwise, it must be Segoe MDL2 symbol */
          else {
              /* navIcon.innerHTML = navIconSource.textContent; */
              navIcon.innerHTML = navIconSource.innerHTML;
            }

          navLink.prependChild(navIcon);
        }

        navLink.addEventListener("click", function (event) {
          event.stopPropagation();
          event.preventDefault();
          /* if (root.location.hash !== "".concat("#", UWP.config.hashNavKey, "=", navTarget)) { */

          if (root.location.hash !== "".concat("#/", navTarget)) {
            UWP.menuList.classList.remove("active");
            UWP.navigate(navTarget);
          }
        });
        navLink.setAttribute("data-target", navTarget);
        navElement.appendChild(navLink);
        return navElement;
      }

      var URL = "".concat(UWP.config.includes, "/", target, ".html");
      var UWP_navigation_request = root.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
      UWP_navigation_request.overrideMimeType("text/html;charset=utf-8");
      UWP_navigation_request.open("GET", URL, true);
      UWP_navigation_request.withCredentials = false;

      UWP_navigation_request.onreadystatechange = function () {
        if (UWP_navigation_request.status === 404 || UWP_navigation_request.status === 0) {
          console.log("Error XMLHttpRequest-ing file", UWP_navigation_request.status);
        } else if (UWP_navigation_request.readyState === 4 && UWP_navigation_request.status === 200 && UWP_navigation_request.responseText) {
          /* var parser = new DOMParser();
          var parsed = parser.parseFromString(UWP_navigation_request.responseText, "text/xml"); */
          var parsed = parseDomFromString(UWP_navigation_request.responseText);
          var elMainMenu = parsed.getElementsByTagName("nav-container")[0] || "";
          var navsSource = elMainMenu || "";
          /* UWP.nav = document.createElement("nav"); */

          var nav = document.createElement("div");
          nav.setAttribute("class", "uwp-nav");
          UWP.nav = nav;
          /* Adds all the navigations to the DOM tree */

          var elList = navsSource ? navsSource.getElementsByTagName("nav-list") || "" : "";
          toArray(elList).forEach(function (navSource) {
            var navMain = document.createElement("ul");
            UWP.nav.appendChild(navMain);
            var elEl = navsSource ? navSource.getElementsByTagName("nav-item") || "" : "";
            toArray(elEl).forEach(function (el) {
              navMain.appendChild(parseNavElement(el));
            });
          });
          /* If navigation was constructed, adds it to the DOM tree and displays menu button */

          if (toArray(elList).length) {
            UWP.header.appendChild(UWP.nav);
            UWP.addMenuButton();
          }
        }
      };

      UWP_navigation_request.send(null);
    },

    /* Highlights current page in navigation */
    updateNavigation: function updateNavigation() {
      console.log("UWP.updateNavigation()");
      /* var nav = document.getElementsByTagName("nav")[0] || ""; */

      var nav = document.getElementsByClassName("uwp-nav")[0] || "";
      var navA = nav ? nav.getElementsByTagName("a") || "" : "";
      toArray(navA).forEach(function (link) {
        if (link.getAttribute("data-target") === UWP.config.currentPage) {
          link.parentElement.classList.add("active");
        } else {
          link.parentElement.classList.remove("active");
        }
      });
    },

    /* Creates custom styles based on config */
    createStyles: function createStyles() {
      console.log("UWP.createStyles()");
      UWP.customStyle = document.createElement("style");

      if (UWP.config.mainColor) {
        var mainColor_RGB = parseColor(UWP.config.mainColor);

        if (mainColor_RGB) {
          var mainColor_brightness = calculateBrightness(mainColor_RGB);

          if (mainColor_brightness >= 128) {
            UWP.body.classList.add("theme-light");
          } else {
            UWP.body.classList.add("theme-dark");
          }

          var mainColorDarkened = mainColor_RGB.map(function (color) {
            var newColor = color - 20;
            if (newColor < 0) newColor = 0;
            return newColor;
          });

          if (!UWP.config.mainColorDarkened) {
            UWP.config.mainColorDarkened = "rgb(".concat(mainColorDarkened, ")");
          }
        }
        /* var Darkened_RGB = parseColor(UWP.config.Darkened); */


        UWP.customStyle.innerHTML += "\n\t\t\t\t[data-layout-type=\"tabs\"] .uwp-header {\n\t\t\t\t\tbackground: ".concat(UWP.config.mainColor, ";\n\t\t\t\t}\n\n\t\t\t\t[data-layout-type=\"overlay\"] .uwp-header {\n\t\t\t\t\tbackground: ").concat(UWP.config.mainColor, ";\n\t\t\t\t}\n\t\t\t\t[data-layout-type=\"overlay\"] .uwp-header .uwp-nav:nth-of-type(1) {\n\t\t\t\t\tbackground-color: ").concat(UWP.config.mainColorDarkened, ";\n\t\t\t\t}\n\n\t\t\t\t[data-layout-type=\"docked-minimized\"] .uwp-header {\n\t\t\t\t\tbackground: ").concat(UWP.config.mainColor, ";\n\t\t\t\t}\n\t\t\t\t[data-layout-type=\"docked-minimized\"] .uwp-header .uwp-nav:nth-of-type(1) {\n\t\t\t\t\tbackground: ").concat(UWP.config.mainColorDarkened, ";\n\t\t\t\t}\n\n\t\t\t\t[data-layout-type=\"docked\"] .uwp-header {\n\t\t\t\t\tbackground: ").concat(UWP.config.mainColor, ";\n\t\t\t\t}\n\t\t\t\t[data-layout-type=\"docked\"] .uwp-header .uwp-nav:nth-of-type(1) {\n\t\t\t\t\tbackground: ").concat(UWP.config.mainColorDarkened, ";\n\t\t\t\t}\n\t\t\t");
      }

      if (UWP.config.activeColor) {
        var activeColor_RGB = parseColor(UWP.config.activeColor);

        if (activeColor_RGB) {
          var activeColor_brightness = calculateBrightness(activeColor_RGB);

          if (activeColor_brightness >= 128) {
            UWP.body.classList.add("active-light");
          } else {
            UWP.body.classList.add("active-dark");
          }
        }

        UWP.customStyle.innerHTML += "\n\t\t\t\t[data-layout-type=\"tabs\"] .uwp-header .uwp-nav:nth-of-type(1) ul li.active {\n\t\t\t\t\tcolor: ".concat(UWP.config.activeColor, ";\n\t\t\t\t\tborder-bottom-color: ").concat(UWP.config.activeColor, ";\n\t\t\t\t}\n\t\t\t\t[data-layout-type=\"overlay\"] .uwp-header .uwp-nav:nth-of-type(1) ul li.active {\n\t\t\t\t\tbackground-color: ").concat(UWP.config.activeColor, ";\n\t\t\t\t}\n\t\t\t\t[data-layout-type=\"docked-minimized\"] .uwp-header .uwp-nav:nth-of-type(1) ul li.active {\n\t\t\t\t\tbackground-color: ").concat(UWP.config.activeColor, ";\n\t\t\t\t}\n\t\t\t\t[data-layout-type=\"docked\"] .uwp-header .uwp-nav:nth-of-type(1) ul li.active {\n\t\t\t\t\tbackground-color: ").concat(UWP.config.activeColor, ";\n\t\t\t\t}\n\t\t\t");
      }

      if (UWP.customStyle.innerHTML.length) {
        UWP.body.appendChild(UWP.customStyle);
        /* UWP.body.insertBefore(UWP.customStyle, UWP.body.firstChild); */
      }
    },

    /* Puts a menu button in title bar */
    addMenuButton: function addMenuButton() {
      console.log("UWP.addMenuButton()");
      /* UWP.menuButton = document.createElement("button"); */

      var menuButton = document.createElement("button");
      menuButton.setAttribute("class", "uwp-menu-button");
      UWP.menuButton = menuButton;
      /* UWP.menuButton.innerHTML = "&#xE700;"; */

      /* var GlobalNavButton = document.createElement("img");
      GlobalNavButton.src = "./static/img/svg/GlobalNavButton.svg";
      UWP.menuButton.appendChild(GlobalNavButton); */

      UWP.menuButton.innerHTML = '<svg width="1792" height="1792" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" transform="scale(1.75 1.75) translate(0 0)" d="M1024 320h-1024v-64h1024v64zm0 512h-1024v-64h1024v64zm0-256.5h-1024v-63.5h1024v63.5z"/></svg>';
      UWP.menuButton.setAttribute("aria-label", "Menu");
      /* var headerNav = UWP.header.getElementsByTagName("nav")[0] || ""; */

      var headerNav = UWP.header.getElementsByClassName("uwp-nav")[0] || "";
      UWP.menuList = headerNav || "";
      UWP.menuButton.addEventListener("click", function () {
        UWP.menuList.classList.toggle("active");
      });
      UWP.main.addEventListener("click", function () {
        UWP.menuList.classList.remove("active");
      });
      UWP.header.prependChild(UWP.menuButton);
    },

    /* Puts content in place */
    navigate: function navigate(target, addHistory) {
      console.log("UWP.navigate()");

      if (typeof target === "undefined") {
        target = UWP.config.home;
      }

      UWP.config.currentPage = target;
      /* Pushes history state */

      if (addHistory !== false) {
        /* history.pushState("", "", "".concat(root.location.href.split("#")[0], "#", UWP.config.hashNavKey, "=", target)); */
        history.pushState("", "", "".concat(root.location.href.split(/#\//)[0], "#/", target));
      }
      /* Clears the page content */


      UWP.main.classList.remove("error");
      UWP.main.innerHTML = "";
      /* Displays error message */

      function displayError(title) {
        UWP.main.classList.add("error");
        UWP.main.innerHTML = "\n\t\t\t\t<div class=\"error-container\">\n\t\t\t\t\t<p>".concat(title, "</p>\n\t\t\t\t\t<p><a href=\"javascript:void(0);\">Go Home</a></p>\n\t\t\t\t</div>\n\t\t\t");
        var mainA = UWP.main.getElementsByTagName("a")[0] || "";
        mainA.addEventListener("click", function (event) {
          event.stopPropagation();
          event.preventDefault();
          UWP.navigate(UWP.config.home);
        });
        UWP.updateNavigation();
      }

      var URL = "".concat(UWP.config.includes, "/").concat(target, ".html");
      /* Requests page data */

      var UWP_navigate_request = root.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
      UWP_navigate_request.overrideMimeType("text/html;charset=utf-8");
      UWP_navigate_request.open("GET", URL, true);
      UWP_navigate_request.withCredentials = false;

      UWP_navigate_request.onreadystatechange = function () {
        if (UWP_navigate_request.status === 404 || UWP_navigate_request.status === 0) {
          console.log("Error XMLHttpRequest-ing file", UWP_navigate_request.status);
          console.error("Something went wrong");
          displayError("Something went wrong");
        } else if (UWP_navigate_request.readyState === 4 && UWP_navigate_request.status === 200 && UWP_navigate_request.responseText) {
          /* var parser = new DOMParser();
          var parsed = parser.parseFromString(UWP_navigate_request.responseText, "text/xml"); */
          var parsed = parseDomFromString(UWP_navigate_request.responseText);
          var page = parsed.getElementsByTagName("page-container")[0] || "";

          if (!page) {
            console.error("Something went wrong");
            displayError("Something went wrong");
          }

          var elTitle = page ? page.getElementsByTagName("page-title")[0] || "" : "";
          var pageTitle = elTitle.textContent || "";
          var elBody = page ? page.getElementsByTagName("page-content")[0] || "" : "";
          var pageBody = elBody.innerHTML || "";
          var pageIncludeScript = page ? page.getElementsByTagName("include-script")[0] || "" : "";
          var pageIncludeStyle = page ? page.getElementsByTagName("include-style")[0] || "" : "";
          /* Puts the new content in place */

          UWP.main.innerHTML = "";
          UWP.main.innerHTML = pageBody;
          UWP.main.classList.remove("start-animation");
          /*!
           * @see {@link https://stackoverflow.com/questions/30453078/uncaught-typeerror-cannot-set-property-offsetwidth-of-htmlelement-which-has/53089566#53089566}
           */

          (function () {
            return UWP.main.offsetWidth;
          })();

          UWP.main.classList.add("start-animation");
          /* Puts the new page title in place */

          UWP.pageTitle.innerHTML = pageTitle;
          document.title = "".concat(pageTitle, " - ").concat(UWP.config.pageTitle);
          /* Runs defined script */

          if (pageIncludeScript) {
            var scriptName = pageIncludeScript.textContent;

            var _src = "".concat(UWP.config.includeScript, "/").concat(scriptName);

            removeJsCssFile(_src, "js");
            var script = document.createElement("script");
            script.setAttribute("src", _src);
            script.async = true;
            UWP.body.appendChild(script);
          }
          /* Loads defined style */


          if (pageIncludeStyle) {
            var styleName = pageIncludeStyle.textContent;

            var _href = "".concat(UWP.config.includeStyle, "/").concat(styleName);

            removeJsCssFile(_href, "css");
            var link = document.createElement("link");
            link.setAttribute("href", _href);
            link.setAttribute("property", "stylesheet");
            link.rel = "stylesheet";
            link.media = "all";
            /* UWP.head.appendChild(link); */

            UWP.body.appendChild(link);
          }

          UWP.updateNavigation();
        }
      };

      UWP_navigate_request.send(null);
    }
  };
  root.UWP = UWP;
})("undefined" !== typeof window ? window : this, document);