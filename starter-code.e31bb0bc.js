// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"index.js":[function(require,module,exports) {
// ! MENU
var body = document.querySelector("body");
var container = document.querySelector(".container");
var menuDropdown = document.getElementById("menu-dropdown");
var menuDropdownFont = document.getElementById("menu-dropdown__font");
var slider = document.querySelector(".menu-toggle");
var sliderBtn = document.querySelector(".menu-toggle__slider");
var moonSvg = document.querySelector(".menu-toggle-moon__svg");

//!form
var searchInput = document.querySelector("[data-search]");
var searchBtn = document.querySelector("[data-search-btn]");

//!templates
var errorTemplate = document.querySelector("[error-template-data]");
var erorrWrapper = errorTemplate.content.cloneNode(true).children[0];
var source = document.querySelector(".source");
source.style.opacity = "0";
console.log();

//! dictionary
var searchedWord = document.querySelector(".spelling__word .word-holder");
var transcription = document.querySelector(".spelling__word .word-transcription");
console.log(transcription);
var audioBtn = document.querySelector(".spelling__audio");
audioBtn.classList.add("d-non");
var audioTriangle = document.querySelector(".spelling__audio .audio-btn");
var voice = new Audio();
var defenitionsWrapper = document.querySelector(".definitions-wrapper");

// console.log(sourceLinkText);

//? Fetch function
var fetchFunction = function fetchFunction(endpoint) {
  return fetch("https://api.dictionaryapi.dev/api/v2/entries/en/".concat(endpoint)).then(function (res) {
    if (!res.ok) {
      showErroor();
      throw new Error("API doesn't have this word");
    }
    hideError();
    return res.json();
  });
};

//? showing error function
var showErroor = function showErroor() {
  container.append(erorrWrapper);
  source.style.opacity = "0";
  document.querySelector(".spelling").innerHTML = "";
  document.querySelector(".definitions-wrapper").innerHTML = "";
  document.querySelector(".source").innerHTML = "";
};

//? hide error function
var hideError = function hideError() {
  erorrWrapper.remove();
};

//? audio click function
var handleAudioClick = function handleAudioClick(audio) {
  if (audioBtn.classList.contains("no-audio") && audioTriangle.classList.contains("no-audio")) {
    voice = null;
  } else {
    audioBtn.classList.add("playing");
    audioTriangle.classList.add("playing");
    voice ? voice.pause() : null;
    voice = new Audio();
    voice.src = audio;
    voice.play();
    voice.addEventListener("ended", function () {
      audioBtn.classList.remove("playing");
      audioTriangle.classList.remove("playing");
    });
  }
  if (voice === null) {
    audioBtn.classList.remove("playing");
    audioTriangle.classList.remove("playing");
  }
};

//? toggle class function
var toggleClass = function toggleClass(element, className) {
  element.classList.toggle("".concat(className));
};

//? change innerHTML function
var changeElement = function changeElement(element, text) {
  element.innerHTML = text;
};

//? change theme function
var changeTheme = function changeTheme(theme, element) {
  theme === "dark" ? (body.classList.add("dark"), container.classList.add("dark"), searchInput.classList.add("dark"), audioBtn.classList.add("dark"), audioTriangle.classList.add("dark")) : (body.classList.remove("dark"), container.classList.remove("dark"), searchInput.classList.remove("dark"), audioBtn.classList.remove("dark"), audioTriangle.classList.remove("dark"));
  if (element) {
    theme === "dark" ? (body.classList.add("dark"), element.classList.add("dark")) : (body.classList.remove("dark"), element.classList.remove("dark"));
  }
};

//? check theme function
var checkTheme = function checkTheme() {
  if (body.classList.contains("dark")) {
    return "dark";
  } else {
    return "light";
  }
};

//? change font function
var changeFont = function changeFont(element, font) {
  menuDropdownFont.innerText = font;
  console.log(element);
  var lowerCasedFont = font.toLowerCase();
  body.style.fontFamily = lowerCasedFont === "sans serif" ? "sans-serif" : lowerCasedFont === "serif" ? "serif" : "\"Inconsolata\", monospace";
};

//*menu dropdown event listener
var newEl = document.createElement("div");
menuDropdown.appendChild(newEl);
newEl.innerHTML = "\n        <ul class=\"font-change d-non\">\n            <li class=\"font-change__item\">Sans Serif</li>\n            <li class=\"font-change__item\">Serif</li>\n            <li class=\"font-change__item\">Mono</li>\n        </ul>";
var dNon = document.querySelector(".d-non");
console.log(newEl);
menuDropdown.addEventListener("click", function () {
  toggleClass(newEl, "menu-dropdown-active");
  toggleClass(dNon, "d-non");
  toggleClass(newEl, "dark");
});

//*font change event listener
var fontChangeItems = document.querySelectorAll(".font-change__item");
fontChangeItems.forEach(function (item) {
  console.log(item);
  item.addEventListener("click", function () {
    changeFont(item, item.textContent);
  });
});

//*slider event listener
slider.addEventListener("click", function () {
  toggleClass(sliderBtn, "active");
  toggleClass(slider, "active");

  //changing moon svg
  slider.classList.contains("active") ? changeElement(moonSvg, "<svg class=\"menu-toggle-moon__svg\" xmlns=\"http://www.w3.org/2000/svg\" width=\"22\" height=\"22\" viewBox=\"0 0 22 22\"><path fill=\"none\" stroke=\"#A445ED\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.5\" d=\"M1 10.449a10.544 10.544 0 0 0 19.993 4.686C11.544 15.135 6.858 10.448 6.858 1A10.545 10.545 0 0 0 1 10.449Z\"/></svg>") : changeElement(moonSvg, "<svg class=\"menu-toggle-moon__svg\" xmlns=\"http://www.w3.org/2000/svg\" width=\"22\" height=\"22\" viewBox=\"0 0 22 22\"><path fill=\"none\" stroke=\"#838383\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.5\" d=\"M1 10.449a10.544 10.544 0 0 0 19.993 4.686C11.544 15.135 6.858 10.448 6.858 1A10.545 10.545 0 0 0 1 10.449Z\"/></svg>");

  //changing theme
  slider.classList.contains("active") ? changeTheme("dark") : changeTheme("light");
});
var loadedWords = [];

//* Search input listener
searchBtn.addEventListener("click", function () {
  var value = searchInput.value;
  console.log(value);
  fetchFunction(value).then(function (data) {
    var _data$0$word, _data$0$phonetics$0$t;
    //! spelling start

    //* audio button listener

    var audio = data[0].phonetics[0].audio;
    if (audio) {
      audioBtn.classList.remove("no-audio");
      audioTriangle.classList.remove("no-audio");
      console.log(audio);
      audioBtn.addEventListener("click", handleAudioClick.bind(null, audio));
    } else {
      console.log("No audio");
      audioBtn.classList.add("no-audio");
      audioTriangle.classList.add("no-audio");
    }
    audioBtn.classList.remove("d-non");
    source.style.opacity = "1";

    //* word and transcription
    searchedWord.innerHTML = (_data$0$word = data[0].word) !== null && _data$0$word !== void 0 ? _data$0$word : "";
    transcription.innerHTML = (_data$0$phonetics$0$t = data[0].phonetics[0].text) !== null && _data$0$phonetics$0$t !== void 0 ? _data$0$phonetics$0$t : "";

    //! spelling finish

    //! defination start
    var word = data[0].word;
    var meanings = data[0].meanings;
    console.log(data[0]);

    // console.log(meanings);
    if (!loadedWords.includes(word)) {
      defenitionsWrapper.innerHTML = "";
      var html = "";
      meanings.forEach(function (item) {
        var html = "";
        item.definitions.forEach(function (item) {
          // console.log(item);
          html += "\n                    <li class=\"list__item\">\n                        <div class=\"item__dot\"></div>\n                        <div class=\"item__text\">".concat(item.definition, "</div>\n                    </li>\n                    ");
        });
        console.log(html);
        defenitionsWrapper.innerHTML += "\n                            <div class=\"definition\">\n                                <div class=\"divider-wrapper\">\n                                    <div\n                                        id=\"part-of-speech\"\n                                        class=\"part-of-speech\"\n                                    >".concat(item.partOfSpeech, "</div>\n                                    <div class=\"definition-divider divider\"></div>\n                                </div>\n                                <div class=\"word-data\">\n                                    <h2\n                                        class=\"word-data__heading\"\n                                    >Meaning</h2>\n                                    <ul class=\"word-data__list\">\n                                        ").concat(html, "\n                                    </ul>\n                                </div>\n                            </div>\n                ");

        //get html for all synonims
        var getAllSynonims = function getAllSynonims() {
          var text = "";
          item.synonyms.forEach(function (item) {
            text += "\n                        <li id=\"synonyms__item\" class=\"synonyms__item\">\n                        ".concat(item, "\n                        </li>\n                        ");
          });
          return text;
        };
        //get html for all antonyms
        var getAllAntonyms = function getAllAntonyms() {
          var text = "";
          item.antonyms.forEach(function (item) {
            text += "\n                        <li id=\"antonyms__item\" class=\"antonyms__item\">\n                        ".concat(item, "\n                        </li>\n                        ");
          });
          return text;
        };
        if (item.synonyms.length > 0) {
          console.log(item);
          defenitionsWrapper.innerHTML += "\n                <div class=\"synonyms-wrapper\">\n                    <div class=\"synonyms__heading\">\n                        Synonyms\n                    </div>\n                    <ul class=\"synonyms__list\">\n                    ".concat(getAllSynonims(), "\n                    </ul>\n                </div>  \n                ");
        }
        if (item.antonyms.length > 0) {
          console.log(item);
          defenitionsWrapper.innerHTML += "\n                <div class=\"antonyms-wrapper\">\n                    <div class=\"antonyms__heading\">\n                        Antonyms\n                    </div>\n                    <ul class=\"antonyms__list\">\n                    ".concat(getAllAntonyms(), "\n                    </ul>\n                </div>  \n                    ");
        }
      });
      loadedWords.push(word);

      //*source

      var _source = document.querySelector(".source");
      _source.innerHTML = "\n                        <a href=\"".concat(data[0].sourceUrls, "\" class=\"source-text\" target=\"_blank\" rel=\"noopener noreferrer\">Source</a>\n                        <a href=\"").concat(data[0].sourceUrls, "\" class=\"source-link\" target=\"_blank\" rel=\"noopener noreferrer\">\n                            <div\n                                class=\"source-link__text\"\n                            >").concat(data[0].sourceUrls, "</div>\n                            <svg\n                                class=\"source-link__icon\"\n                                xmlns=\"http://www.w3.org/2000/svg\"\n                                width=\"14\"\n                                height=\"14\"\n                                viewBox=\"0 0 14 14\"\n                            >\n                                <path\n                                    fill=\"none\"\n                                    stroke=\"#838383\"\n                                    stroke-linecap=\"round\"\n                                    stroke-linejoin=\"round\"\n                                    stroke-width=\"1.5\"\n                                    d=\"M6.09 3.545H2.456A1.455 1.455 0 0 0 1 5v6.545A1.455 1.455 0 0 0 2.455 13H9a1.455 1.455 0 0 0 1.455-1.455V7.91m-5.091.727 7.272-7.272m0 0H9m3.636 0V5\"\n                                />\n                            </svg>\n                        </a>\n                            \n            ");
    }
    var definationElements = document.querySelectorAll(".definition");
    console.log(definationElements);
    var defenitionDividers = document.querySelectorAll(".defination-divider");

    //*change theme if needed when elements apear
    defenitionDividers.forEach(function (item) {
      changeTheme(checkTheme(), item);
    });
    //* change theme onclick
    slider.addEventListener("click", function () {
      defenitionDividers.forEach(function (item) {
        changeTheme(checkTheme(), item);
      });
    });

    //! defination end
  });
});

// * listener on pressing enter
searchInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    searchBtn.click();
  }
});

// console.log("indexJs");
},{}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;
function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}
module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "53610" + '/');
  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);
    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);
          if (didAccept) {
            handled = true;
          }
        }
      });

      // Enable HMR for CSS by default.
      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });
      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }
    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }
    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }
    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}
function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}
function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}
function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }
  var parents = [];
  var k, d, dep;
  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }
  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }
  return parents;
}
function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}
function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }
  if (checkedAssets[id]) {
    return;
  }
  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }
  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}
function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }
  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }
  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/starter-code.e31bb0bc.js.map