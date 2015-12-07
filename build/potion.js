/**
* potion - v1.0.0
* Copyright (c) 2015, Jan Sedivy
*
* Potion is licensed under the MIT License.
*/
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define(factory);
	else if(typeof exports === 'object')
		exports["Potion"] = factory();
	else
		root["Potion"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var Engine = __webpack_require__(1);

	module.exports = {
	  init: function init(canvas, methods) {
	    var engine = new Engine(canvas, methods);
	    return engine.controller;
	  }
	};

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	__webpack_require__(2)();

	var App = __webpack_require__(3);

	var Time = __webpack_require__(4);

	var StateManager = __webpack_require__(5);

	var Input = __webpack_require__(6);
	var Loading = __webpack_require__(7);

	var Engine = function Engine(container, methods) {
	  this.container = container;

	  this.controller = new App(container);

	  this.app = methods;
	  this.controller.main = this.app;
	  this.app.app = this.controller;

	  this.tickFunc = (function (self) {
	    return function () {
	      self.tick();
	    };
	  })(this);
	  this.preloaderTickFunc = (function (self) {
	    return function () {
	      self._preloaderTick();
	    };
	  })(this);

	  this.strayTime = 0;
	  this._time = 0;

	  setTimeout((function () {
	    this.configureApp();
	  }).bind(this), 0);
	};

	Engine.prototype.configureApp = function () {
	  if (this.app.configure) {
	    this.app.configure();
	  }

	  this.controller.video.init();

	  if (this.controller.config.addInputEvents) {
	    this.controller.input = new Input(this.controller);
	  }

	  this.controller.resize(this.controller.width, this.controller.height);

	  this._setDefaultStates();

	  this._time = Time.now();

	  this._preloaderVideo = this.controller.video.createLayer({
	    allowHiDPI: true,
	    getCanvasContext: true
	  });

	  this._preloader = new Loading(this.controller);

	  this.controller.assets.start((function () {
	    window.cancelAnimationFrame(this.preloaderId);
	    this._preloaderVideo.destroy();

	    this.start();
	  }).bind(this));

	  if (this.controller.assets.isLoading && this.controller.config.showPreloader) {
	    this.preloaderId = window.requestAnimationFrame(this.preloaderTickFunc);
	  }
	};

	Engine.prototype.addEvents = function () {
	  var self = this;

	  window.addEventListener("blur", function () {
	    self.controller.input.resetKeys();

	    if (self.app.blur) {
	      self.app.blur();
	    }
	  });

	  window.addEventListener("focus", function () {
	    self.controller.input.resetKeys();

	    if (self.app.focus) {
	      self.app.focus();
	    }
	  });
	};

	Engine.prototype.start = function () {
	  if (this.controller.config.addInputEvents) {
	    this.addEvents();
	  }

	  window.requestAnimationFrame(this.tickFunc);
	};

	Engine.prototype.tick = function () {
	  window.requestAnimationFrame(this.tickFunc);

	  this.controller.debug.begin();

	  var now = Time.now();
	  var time = (now - this._time) / 1000;
	  this._time = now;

	  this.controller.debug.perf("update");
	  this.update(time);
	  this.controller.debug.stopPerf("update");

	  this.controller.states.exitUpdate(time);

	  this.controller.debug.perf("render");
	  this.render();
	  this.controller.debug.stopPerf("render");

	  this.controller.debug.render();

	  this.controller.debug.end();
	};

	Engine.prototype.update = function (time) {
	  if (time > this.controller.config.maxStepTime) {
	    time = this.controller.config.maxStepTime;
	  }

	  if (this.controller.config.fixedStep) {
	    this.strayTime = this.strayTime + time;
	    while (this.strayTime >= this.controller.config.stepTime) {
	      this.strayTime = this.strayTime - this.controller.config.stepTime;
	      this.controller.states.update(this.controller.config.stepTime);
	    }
	  } else {
	    this.controller.states.update(time);
	  }
	};

	Engine.prototype.render = function () {
	  this.controller.video.beginFrame();

	  this.controller.video.clear();

	  this.controller.states.render();

	  this.controller.video.endFrame();
	};

	Engine.prototype._preloaderTick = function () {
	  this.preloaderId = window.requestAnimationFrame(this.preloaderTickFunc);

	  var now = Time.now();
	  var time = (now - this._time) / 1000;
	  this._time = now;

	  if (this.app.preloading) {
	    this.app.preloading(time, this._preloaderVideo);
	  } else {
	    this._preloader.render(time, this._preloaderVideo);
	  }
	};

	Engine.prototype._setDefaultStates = function () {
	  var states = new StateManager();
	  states.add("main", this.app);
	  states.add("debug", this.controller.debug);

	  states.protect("main");
	  states.protect("debug");
	  states.hide("debug");

	  this.controller.states = states;
	};

	module.exports = Engine;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	module.exports = function () {
	  var lastTime = 0;
	  var vendors = ["ms", "moz", "webkit", "o"];

	  for (var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
	    window.requestAnimationFrame = window[vendors[i] + "RequestAnimationFrame"];
	    window.cancelAnimationFrame = window[vendors[i] + "CancelAnimationFrame"] || window[vendors[i] + "CancelRequestAnimationFrame"];
	  }

	  if (!window.requestAnimationFrame) {
	    window.requestAnimationFrame = function (callback) {
	      var currTime = new Date().getTime();
	      var timeToCall = Math.max(0, 16 - (currTime - lastTime));

	      var id = window.setTimeout(function () {
	        callback(currTime + timeToCall);
	      }, timeToCall);

	      lastTime = currTime + timeToCall;
	      return id;
	    };
	  }

	  if (!window.cancelAnimationFrame) {
	    window.cancelAnimationFrame = function (id) {
	      clearTimeout(id);
	    };
	  }
	};

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var Video = __webpack_require__(8);
	var Assets = __webpack_require__(9);

	var Debugger = __webpack_require__(11);

	var PotionAudio = __webpack_require__(12);

	var App = function App(container) {
	  this.container = container;

	  container.style.position = "relative";

	  var canvas = document.createElement("canvas");
	  canvas.style.display = "block";
	  container.appendChild(canvas);

	  this.canvas = canvas;

	  this.width = 300;

	  this.height = 300;

	  this.audio = new PotionAudio();

	  this.assets = new Assets(this);

	  this.states = null;

	  this.input = null;

	  this.config = {
	    allowHiDPI: true,
	    getCanvasContext: true,
	    addInputEvents: true,
	    showPreloader: true,
	    fixedStep: false,
	    stepTime: 1 / 60,
	    maxStepTime: 1 / 60
	  };

	  this.video = new Video(this, canvas, this.config);
	  this.video._isRoot = true;

	  this.debug = new Debugger(this);
	};

	App.prototype.resize = function (width, height) {
	  this.width = width;
	  this.height = height;

	  this.container.style.width = this.width + "px";
	  this.container.style.height = this.height + "px";

	  if (this.video) {
	    this.video._resize(width, height);
	  }

	  if (this.states) {
	    this.states.resize();
	  }
	};

	module.exports = App;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	module.exports = (function () {
	  return window.performance || Date;
	})();

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var renderOrderSort = function renderOrderSort(a, b) {
	  return a.renderOrder < b.renderOrder;
	};

	var updateOrderSort = function updateOrderSort(a, b) {
	  return a.updateOrder < b.updateOrder;
	};

	var StateManager = function StateManager() {
	  this.states = {};
	  this.renderOrder = [];
	  this.updateOrder = [];

	  this._preventEvent = false;
	};

	StateManager.prototype.add = function (name, state) {
	  this.states[name] = this._newStateHolder(name, state);
	  this.refreshOrder();
	  return state;
	};

	StateManager.prototype.enable = function (name) {
	  var holder = this.getHolder(name);
	  if (holder) {
	    if (!holder.enabled) {
	      if (holder.state.enable) {
	        holder.state.enable();
	      }
	      holder.enabled = true;
	      holder.changed = true;

	      if (holder.paused) {
	        this.unpause(name);
	      }
	    }
	  }
	};

	StateManager.prototype.disable = function (name) {
	  var holder = this.getHolder(name);
	  if (holder) {
	    if (holder.enabled) {
	      if (holder.state.disable) {
	        holder.state.disable();
	      }
	      holder.changed = true;
	      holder.enabled = false;
	    }
	  }
	};

	StateManager.prototype.hide = function (name) {
	  var holder = this.getHolder(name);
	  if (holder) {
	    if (holder.enabled) {
	      holder.changed = true;
	      holder.render = false;
	    }
	  }
	};

	StateManager.prototype.show = function (name) {
	  var holder = this.getHolder(name);
	  if (holder) {
	    if (holder.enabled) {
	      holder.changed = true;
	      holder.render = true;
	    }
	  }
	};

	StateManager.prototype.pause = function (name) {
	  var holder = this.getHolder(name);
	  if (holder) {
	    if (holder.state.pause) {
	      holder.state.pause();
	    }

	    holder.changed = true;
	    holder.paused = true;
	  }
	};

	StateManager.prototype.unpause = function (name) {
	  var holder = this.getHolder(name);
	  if (holder) {
	    if (holder.state.unpause) {
	      holder.state.unpause();
	    }

	    holder.changed = true;
	    holder.paused = false;
	  }
	};

	StateManager.prototype.protect = function (name) {
	  var holder = this.getHolder(name);
	  if (holder) {
	    holder.protect = true;
	  }
	};

	StateManager.prototype.unprotect = function (name) {
	  var holder = this.getHolder(name);
	  if (holder) {
	    holder.protect = false;
	  }
	};

	StateManager.prototype.refreshOrder = function () {
	  this.renderOrder.length = 0;
	  this.updateOrder.length = 0;

	  for (var name in this.states) {
	    var holder = this.states[name];
	    if (holder) {
	      this.renderOrder.push(holder);
	      this.updateOrder.push(holder);
	    }
	  }

	  this.renderOrder.sort(renderOrderSort);
	  this.updateOrder.sort(updateOrderSort);
	};

	StateManager.prototype._newStateHolder = function (name, state) {
	  var holder = {};
	  holder.name = name;
	  holder.state = state;

	  holder.protect = false;

	  holder.enabled = true;
	  holder.paused = false;

	  holder.render = true;

	  holder.initialized = false;
	  holder.updated = false;
	  holder.changed = true;

	  holder.updateOrder = 0;
	  holder.renderOrder = 0;

	  return holder;
	};

	StateManager.prototype.setUpdateOrder = function (name, order) {
	  var holder = this.getHolder(name);
	  if (holder) {
	    holder.updateOrder = order;
	    this.refreshOrder();
	  }
	};

	StateManager.prototype.setRenderOrder = function (name, order) {
	  var holder = this.getHolder(name);
	  if (holder) {
	    holder.renderOrder = order;
	    this.refreshOrder();
	  }
	};

	StateManager.prototype.destroy = function (name) {
	  var state = this.getHolder(name);
	  if (state && !state.protect) {
	    if (state.state.close) {
	      state.state.close();
	    }
	    delete this.states[name];
	    this.refreshOrder();
	  }
	};

	StateManager.prototype.destroyAll = function () {
	  for (var i = 0, len = this.updateOrder.length; i < len; i++) {
	    var state = this.updateOrder[i];
	    if (!state.protect) {
	      if (state.state.close) {
	        state.state.close();
	      }
	      delete this.states[state.name];
	    }
	  }

	  this.refreshOrder();
	};

	StateManager.prototype.getHolder = function (name) {
	  return this.states[name];
	};

	StateManager.prototype.get = function (name) {
	  return this.states[name].state;
	};

	StateManager.prototype.update = function (time) {
	  for (var i = 0, len = this.updateOrder.length; i < len; i++) {
	    var state = this.updateOrder[i];

	    if (state) {
	      state.changed = false;

	      if (state.enabled) {
	        if (!state.initialized && state.state.init) {
	          state.initialized = true;
	          state.state.init();
	        }

	        if (state.state.update && !state.paused) {
	          state.state.update(time);
	          state.updated = true;
	        }
	      }
	    }
	  }
	};

	StateManager.prototype.exitUpdate = function (time) {
	  for (var i = 0, len = this.updateOrder.length; i < len; i++) {
	    var state = this.updateOrder[i];

	    if (state && state.enabled && state.state.exitUpdate && !state.paused) {
	      state.state.exitUpdate(time);
	    }
	  }
	};

	StateManager.prototype.render = function () {
	  for (var i = 0, len = this.renderOrder.length; i < len; i++) {
	    var state = this.renderOrder[i];
	    if (state && state.enabled && (state.updated || !state.state.update) && state.render && state.state.render) {
	      state.state.render();
	    }
	  }
	};
	StateManager.prototype.mousemove = function (value) {
	  this._preventEvent = false;

	  for (var i = 0, len = this.updateOrder.length; i < len; i++) {
	    var state = this.updateOrder[i];
	    if (state && state.enabled && !state.changed && state.state.mousemove && !state.paused) {
	      state.state.mousemove(value);
	    }

	    if (this._preventEvent) {
	      break;
	    }
	  }
	};

	StateManager.prototype.mouseup = function (value) {
	  this._preventEvent = false;

	  for (var i = 0, len = this.updateOrder.length; i < len; i++) {
	    var state = this.updateOrder[i];
	    if (state && state.enabled && !state.changed && state.state.mouseup && !state.paused) {
	      state.state.mouseup(value);
	    }

	    if (this._preventEvent) {
	      break;
	    }
	  }
	};

	StateManager.prototype.mousedown = function (value) {
	  this._preventEvent = false;

	  for (var i = 0, len = this.updateOrder.length; i < len; i++) {
	    var state = this.updateOrder[i];
	    if (state && state.enabled && !state.changed && state.state.mousedown && !state.paused) {
	      state.state.mousedown(value);
	    }

	    if (this._preventEvent) {
	      break;
	    }
	  }
	};

	StateManager.prototype.keyup = function (value) {
	  this._preventEvent = false;

	  for (var i = 0, len = this.updateOrder.length; i < len; i++) {
	    var state = this.updateOrder[i];
	    if (state && state.enabled && !state.changed && state.state.keyup && !state.paused) {
	      state.state.keyup(value);
	    }

	    if (this._preventEvent) {
	      break;
	    }
	  }
	};

	StateManager.prototype.keydown = function (value) {
	  this._preventEvent = false;

	  for (var i = 0, len = this.updateOrder.length; i < len; i++) {
	    var state = this.updateOrder[i];
	    if (state && state.enabled && !state.changed && state.state.keydown && !state.paused) {
	      state.state.keydown(value);
	    }

	    if (this._preventEvent) {
	      break;
	    }
	  }
	};

	StateManager.prototype.resize = function () {
	  for (var i = 0, len = this.updateOrder.length; i < len; i++) {
	    var state = this.updateOrder[i];
	    if (state && state.enabled && state.state.resize) {
	      state.state.resize();
	    }
	  }
	};

	module.exports = StateManager;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var keys = __webpack_require__(10);

	var invKeys = {};
	for (var keyName in keys) {
	  invKeys[keys[keyName]] = keyName;
	}

	var Input = function Input(app) {
	  this._container = app.container;
	  this._keys = {};

	  this.canControlKeys = true;

	  this.mouse = {
	    isDown: false,
	    isLeftDown: false,
	    isMiddleDown: false,
	    isRightDown: false,
	    x: null,
	    y: null,
	    dx: 0,
	    dy: 0
	  };

	  this._addEvents(app);
	};

	Input.prototype.resetKeys = function () {
	  this._keys = {};
	};

	Input.prototype.isKeyDown = function (key) {
	  if (key == null) {
	    return false;
	  }

	  if (this.canControlKeys) {
	    var code = typeof key === "number" ? key : keys[key.toLowerCase()];
	    return this._keys[code];
	  }
	};

	Input.prototype._addEvents = function (app) {
	  var self = this;

	  var mouseEvent = {
	    x: null,
	    y: null,
	    button: null,
	    isTouch: false,
	    event: null,
	    stateStopEvent: function stateStopEvent() {
	      app.states._preventEvent = true;
	    }
	  };

	  var keyboardEvent = {
	    key: null,
	    name: null,
	    event: null,
	    stateStopEvent: function stateStopEvent() {
	      app.states._preventEvent = true;
	    }
	  };

	  self._container.addEventListener("mousemove", function (e) {
	    var x = e.offsetX === undefined ? e.layerX - self._container.offsetLeft : e.offsetX;
	    var y = e.offsetY === undefined ? e.layerY - self._container.offsetTop : e.offsetY;

	    if (self.mouse.x != null && self.mouse.x != null) {
	      self.mouse.dx = x - self.mouse.x;
	      self.mouse.dy = y - self.mouse.y;
	    }

	    self.mouse.x = x;
	    self.mouse.y = y;
	    self.mouse.isActive = true;

	    mouseEvent.x = x;
	    mouseEvent.y = y;
	    mouseEvent.button = null;
	    mouseEvent.event = e;
	    mouseEvent.isTouch = false;

	    app.states.mousemove(mouseEvent);
	  });

	  self._container.addEventListener("mouseup", function (e) {
	    e.preventDefault();

	    var x = e.offsetX === undefined ? e.layerX - self._container.offsetLeft : e.offsetX;
	    var y = e.offsetY === undefined ? e.layerY - self._container.offsetTop : e.offsetY;

	    switch (e.button) {
	      case 0:
	        self.mouse.isLeftDown = false;
	        break;
	      case 1:
	        self.mouse.isMiddleDown = false;
	        break;
	      case 2:
	        self.mouse.isRightDown = false;
	        break;
	    }

	    self.mouse.isDown = self.mouse.isLeftDown || self.mouse.isRightDown || self.mouse.isMiddleDown;

	    mouseEvent.x = x;
	    mouseEvent.y = y;
	    mouseEvent.button = e.button;
	    mouseEvent.event = e;
	    mouseEvent.isTouch = false;

	    app.states.mouseup(mouseEvent);
	  }, false);

	  self._container.addEventListener("mouseleave", function () {
	    self.mouse.isActive = false;

	    self.mouse.isDown = false;
	    self.mouse.isLeftDown = false;
	    self.mouse.isRightDown = false;
	    self.mouse.isMiddleDown = false;
	  });

	  self._container.addEventListener("mouseenter", function () {
	    self.mouse.isActive = true;
	  });

	  self._container.addEventListener("mousedown", function (e) {
	    e.preventDefault();

	    var x = e.offsetX === undefined ? e.layerX - self._container.offsetLeft : e.offsetX;
	    var y = e.offsetY === undefined ? e.layerY - self._container.offsetTop : e.offsetY;

	    self.mouse.x = x;
	    self.mouse.y = y;
	    self.mouse.isDown = true;
	    self.mouse.isActive = true;

	    switch (e.button) {
	      case 0:
	        self.mouse.isLeftDown = true;
	        break;
	      case 1:
	        self.mouse.isMiddleDown = true;
	        break;
	      case 2:
	        self.mouse.isRightDown = true;
	        break;
	    }

	    mouseEvent.x = x;
	    mouseEvent.y = y;
	    mouseEvent.button = e.button;
	    mouseEvent.event = e;
	    mouseEvent.isTouch = false;

	    app.states.mousedown(mouseEvent);
	  }, false);

	  self._container.addEventListener("touchstart", function (e) {
	    e.preventDefault();

	    for (var i = 0; i < e.touches.length; i++) {
	      var touch = e.touches[i];

	      var x = touch.pageX - self._container.offsetLeft;
	      var y = touch.pageY - self._container.offsetTop;

	      self.mouse.x = x;
	      self.mouse.y = y;
	      self.mouse.isDown = true;
	      self.mouse.isLeftDown = true;
	      self.mouse.isActive = true;

	      mouseEvent.x = x;
	      mouseEvent.y = y;
	      mouseEvent.button = 1;
	      mouseEvent.event = e;
	      mouseEvent.isTouch = true;

	      app.states.mousedown(mouseEvent);
	    }
	  });

	  self._container.addEventListener("touchmove", function (e) {
	    e.preventDefault();

	    for (var i = 0; i < e.touches.length; i++) {
	      var touch = e.touches[i];

	      var x = touch.pageX - self._container.offsetLeft;
	      var y = touch.pageY - self._container.offsetTop;

	      if (self.mouse.x != null && self.mouse.x != null) {
	        self.mouse.dx = x - self.mouse.x;
	        self.mouse.dy = y - self.mouse.y;
	      }

	      self.mouse.x = x;
	      self.mouse.y = y;
	      self.mouse.isDown = true;
	      self.mouse.isLeftDown = true;
	      self.mouse.isActive = true;

	      mouseEvent.x = x;
	      mouseEvent.y = y;
	      mouseEvent.event = e;
	      mouseEvent.isTouch = true;

	      app.states.mousemove(mouseEvent);
	    }
	  });

	  self._container.addEventListener("touchend", function (e) {
	    e.preventDefault();

	    var touch = e.changedTouches[0];

	    var x = touch.pageX - self._container.offsetLeft;
	    var y = touch.pageY - self._container.offsetTop;

	    self.mouse.x = x;
	    self.mouse.y = y;
	    self.mouse.isActive = false;
	    self.mouse.isDown = false;
	    self.mouse.isLeftDown = false;
	    self.mouse.isRightDown = false;
	    self.mouse.isMiddleDown = false;

	    mouseEvent.x = x;
	    mouseEvent.y = y;
	    mouseEvent.event = e;
	    mouseEvent.isTouch = true;

	    app.states.mouseup(mouseEvent);
	  });

	  self._container.addEventListener("contextmenu", function (e) {
	    e.preventDefault();
	  });

	  document.addEventListener("keydown", function (e) {
	    self._keys[e.keyCode] = true;

	    keyboardEvent.key = e.which;
	    keyboardEvent.name = invKeys[e.which];
	    keyboardEvent.event = e;

	    app.states.keydown(keyboardEvent);
	  });

	  document.addEventListener("keyup", function (e) {
	    self._keys[e.keyCode] = false;

	    keyboardEvent.key = e.which;
	    keyboardEvent.name = invKeys[e.which];
	    keyboardEvent.event = e;

	    app.states.keyup(keyboardEvent);
	  });
	};

	module.exports = Input;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var Loading = function Loading(app) {
	  this.app = app;

	  this.barWidth = 0;
	};

	Loading.prototype.render = function (time, video) {
	  video.clear();

	  var color1 = "#b9ff71";
	  var color2 = "#8ac250";
	  var color3 = "#648e38";

	  var width = Math.min(video.width * 2 / 3, 300);
	  var height = 20;

	  var y = (video.height - height) / 2;
	  var x = (video.width - width) / 2;

	  var currentWidth = width * this.app.assets.progress;
	  this.barWidth = this.barWidth + (currentWidth - this.barWidth) * time * 10;

	  video.ctx.fillStyle = color2;
	  video.ctx.fillRect(0, 0, video.width, video.height);

	  video.ctx.font = "400 40px sans-serif";
	  video.ctx.textAlign = "center";
	  video.ctx.textBaseline = "bottom";

	  video.ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
	  video.ctx.fillText("Potion.js", video.width / 2, y + 2);

	  video.ctx.fillStyle = "#d1ffa1";
	  video.ctx.fillText("Potion.js", video.width / 2, y);

	  video.ctx.strokeStyle = video.ctx.fillStyle = color3;
	  video.ctx.fillRect(x, y + 15, width, height);

	  video.ctx.lineWidth = 2;
	  video.ctx.beginPath();
	  video.ctx.rect(x - 5, y + 10, width + 10, height + 10);
	  video.ctx.closePath();
	  video.ctx.stroke();

	  video.ctx.strokeStyle = video.ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
	  video.ctx.fillRect(x, y + 15, this.barWidth, height + 2);

	  video.ctx.lineWidth = 2;
	  video.ctx.beginPath();

	  video.ctx.moveTo(x + this.barWidth, y + 12);
	  video.ctx.lineTo(x - 5, y + 12);
	  video.ctx.lineTo(x - 5, y + 10 + height + 12);
	  video.ctx.lineTo(x + this.barWidth, y + 10 + height + 12);

	  video.ctx.stroke();
	  video.ctx.closePath();

	  video.ctx.strokeStyle = video.ctx.fillStyle = color1;
	  video.ctx.fillRect(x, y + 15, this.barWidth, height);

	  video.ctx.lineWidth = 2;
	  video.ctx.beginPath();

	  video.ctx.moveTo(x + this.barWidth, y + 10);
	  video.ctx.lineTo(x - 5, y + 10);
	  video.ctx.lineTo(x - 5, y + 10 + height + 10);
	  video.ctx.lineTo(x + this.barWidth, y + 10 + height + 10);

	  video.ctx.stroke();
	  video.ctx.closePath();
	};

	module.exports = Loading;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var isRetina = __webpack_require__(13)();

	var Video = function Video(app, canvas, config) {
	  this.app = app;

	  this.config = config;

	  this.canvas = canvas;

	  this.width = app.width;

	  this.height = app.height;

	  this._parent = null;
	  this._isRoot = false;
	  this._children = [];
	};

	Video.prototype.init = function () {
	  if (this.config.getCanvasContext) {
	    this.ctx = this.canvas.getContext("2d");
	  }

	  this._applySizeToCanvas();
	};

	Video.prototype.include = function (methods) {
	  for (var method in methods) {
	    this[method] = methods[method];
	  }
	};

	Video.prototype.beginFrame = function () {};

	Video.prototype.endFrame = function () {};

	Video.prototype.destroy = function () {
	  if (!this._isRoot) {
	    var index = this._parent._children.indexOf(this);
	    if (index !== -1) {
	      this._parent._children.splice(index, 1);
	    }
	  }

	  this.canvas.parentElement.removeChild(this.canvas);
	};

	Video.prototype.scaleCanvas = function (scale) {
	  this.canvas.width *= scale;
	  this.canvas.height *= scale;

	  if (this.ctx) {
	    this.ctx.scale(scale, scale);
	  }
	};

	Video.prototype._resize = function (width, height) {
	  this.width = width;
	  this.height = height;

	  this._applySizeToCanvas();

	  for (var i = 0, len = this._children.length; i < len; i++) {
	    var item = this._children[i];
	    item._resize(width, height);
	  }
	};

	Video.prototype._applySizeToCanvas = function () {
	  this.canvas.width = this.width;
	  this.canvas.height = this.height;

	  this.canvas.style.width = this.width + "px";
	  this.canvas.style.height = this.height + "px";

	  if (this.config.allowHiDPI && isRetina) {
	    this.scaleCanvas(2);
	  }
	};

	Video.prototype.clear = function () {
	  if (this.ctx) {
	    this.ctx.clearRect(0, 0, this.width, this.height);
	  }
	};

	Video.prototype.createLayer = function (config) {
	  config = config || {};

	  var container = this.app.container;
	  var canvas = document.createElement("canvas");
	  canvas.width = this.width;
	  canvas.height = this.height;
	  canvas.style.position = "absolute";
	  canvas.style.top = "0px";
	  canvas.style.left = "0px";
	  container.appendChild(canvas);

	  var video = new Video(this.app, canvas, config);

	  video._parent = this;
	  video._isRoot = false;

	  video.init();

	  this._children.push(video);

	  return video;
	};

	module.exports = Video;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var util = __webpack_require__(18);
	var path = __webpack_require__(19);

	var JsonLoader = __webpack_require__(14);
	var imageLoader = __webpack_require__(15);
	var textLoader = __webpack_require__(16);

	var Assets = function Assets(app) {
	  this.isLoading = false;

	  this.itemsCount = 0;
	  this.progress = 0;

	  this._thingsToLoad = 0;
	  this._data = {};
	  this._preloading = true;

	  this._callback = null;

	  this._toLoad = [];

	  this._loaders = {};

	  this.addLoader("json", JsonLoader);

	  var audioLoader = __webpack_require__(17)(app.audio);

	  this.addLoader("mp3", audioLoader);
	  this.addLoader("music", audioLoader);
	  this.addLoader("sound", audioLoader);

	  this.addLoader("image", imageLoader);
	  this.addLoader("texture", imageLoader);
	  this.addLoader("sprite", imageLoader);
	};

	Assets.prototype.addLoader = function (name, fn) {
	  this._loaders[name] = fn;
	};

	Assets.prototype.start = function (callback) {
	  this._callback = callback;

	  this._toLoad.forEach((function (current) {
	    this._loadAssetFile(current, (function (name, data) {
	      this.set(name, data);
	      if (current.callback) {
	        current.callback(data);
	      }

	      this._finishedQueuedFile();
	    }).bind(this));
	  }).bind(this));

	  this._thingsToLoad = this.itemsCount;

	  if (this._thingsToLoad === 0) {
	    this._done();
	  }
	};

	Assets.prototype.get = function (name) {
	  return this._data[path.normalize(name)];
	};

	Assets.prototype.set = function (name, value) {
	  this._data[path.normalize(name)] = value;
	};

	Assets.prototype.remove = function (name) {
	  this.set(name, null);
	};

	Assets.prototype.load = function (type, url, callback) {
	  var loadObject = {
	    type: type,
	    url: url != null ? path.normalize(url) : null,
	    callback: callback,
	    progress: 0
	  };

	  if (this._preloading) {
	    this._queueFile(loadObject);
	  } else {
	    this._loadAssetFile(loadObject, (function (name, data) {
	      this.set(name, data);
	      if (callback) {
	        callback(data);
	      }
	    }).bind(this));
	  }
	};

	Assets.prototype._queueFile = function (loadObject) {
	  this.isLoading = true;
	  this.itemsCount += 1;

	  this._toLoad.push(loadObject);
	};

	Assets.prototype._finishedQueuedFile = function () {
	  this._thingsToLoad -= 1;

	  if (this._thingsToLoad === 0) {
	    this._done();
	  }
	};

	Assets.prototype._updateProgress = function () {
	  var sum = 0;

	  for (var i = 0; i < this._toLoad.length; i++) {
	    sum += this._toLoad[i].progress;
	  }

	  this.progress = sum / this._toLoad.length;
	};

	Assets.prototype._error = function (url) {
	  console.warn("Error loading \"" + url + "\" asset");
	};

	Assets.prototype._handleCustomLoading = function (loading, loader) {
	  loading(function (name, value) {
	    loader.done(value, name);
	  });
	};

	Assets.prototype._loadAssetFile = function (file, callback) {
	  var type = file.type;
	  var url = file.url;

	  var manager = {
	    done: (function (data, name) {
	      name = name == null ? file.url : name;

	      file.progress = 1;
	      callback(name, data);
	      this._updateProgress();
	    }).bind(this),

	    error: (function () {
	      this._error.bind(this);
	    }).bind(this),

	    progress: (function (percent) {
	      file.progress = percent;
	      this._updateProgress();
	    }).bind(this)
	  };

	  if (util.isFunction(type)) {
	    this._handleCustomLoading(type, manager);
	  } else {
	    type = type.toLowerCase();
	    var loader = this._loaders[type] || textLoader;
	    loader(url, manager);
	  }
	};

	Assets.prototype._done = function () {
	  this.isLoading = false;
	  this._preloading = false;
	  setTimeout(this._callback, 0);
	};

	module.exports = Assets;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	module.exports = {
	  backspace: 8,
	  tab: 9,
	  enter: 13,
	  pause: 19,
	  caps: 20,
	  esc: 27,
	  space: 32,
	  page_up: 33,
	  page_down: 34,
	  end: 35,
	  home: 36,
	  left: 37,
	  up: 38,
	  right: 39,
	  down: 40,
	  insert: 45,
	  "delete": 46,
	  "0": 48,
	  "1": 49,
	  "2": 50,
	  "3": 51,
	  "4": 52,
	  "5": 53,
	  "6": 54,
	  "7": 55,
	  "8": 56,
	  "9": 57,
	  a: 65,
	  b: 66,
	  c: 67,
	  d: 68,
	  e: 69,
	  f: 70,
	  g: 71,
	  h: 72,
	  i: 73,
	  j: 74,
	  k: 75,
	  l: 76,
	  m: 77,
	  n: 78,
	  o: 79,
	  p: 80,
	  q: 81,
	  r: 82,
	  s: 83,
	  t: 84,
	  u: 85,
	  v: 86,
	  w: 87,
	  x: 88,
	  y: 89,
	  z: 90,
	  numpad_0: 96,
	  numpad_1: 97,
	  numpad_2: 98,
	  numpad_3: 99,
	  numpad_4: 100,
	  numpad_5: 101,
	  numpad_6: 102,
	  numpad_7: 103,
	  numpad_8: 104,
	  numpad_9: 105,
	  multiply: 106,
	  add: 107,
	  substract: 109,
	  decimal: 110,
	  divide: 111,
	  f1: 112,
	  f2: 113,
	  f3: 114,
	  f4: 115,
	  f5: 116,
	  f6: 117,
	  f7: 118,
	  f8: 119,
	  f9: 120,
	  f10: 121,
	  f11: 122,
	  f12: 123,
	  shift: 16,
	  ctrl: 17,
	  alt: 18,
	  plus: 187,
	  comma: 188,
	  minus: 189,
	  period: 190
	};

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	module.exports = __webpack_require__(21);

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	module.exports = __webpack_require__(20);

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var isRetina = function isRetina() {
	  var mediaQuery = "(-webkit-min-device-pixel-ratio: 1.5),  (min--moz-device-pixel-ratio: 1.5),  (-o-min-device-pixel-ratio: 3/2),  (min-resolution: 1.5dppx)";

	  if (window.devicePixelRatio > 1) {
	    return true;
	  }if (window.matchMedia && window.matchMedia(mediaQuery).matches) {
	    return true;
	  }return false;
	};

	module.exports = isRetina;

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	module.exports = function (url, loader) {
	  var request = new XMLHttpRequest();

	  request.open("GET", url, true);
	  request.responseType = "text";

	  request.addEventListener("progress", function (e) {
	    var percent = e.loaded / e.total;
	    loader.progress(percent);
	  });

	  request.onload = function () {
	    if (request.status !== 200) {
	      return loader.error(url);
	    }

	    var data = JSON.parse(this.response);
	    loader.done(data);
	  };
	  request.send();
	};

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	module.exports = function (url, loader) {
	  var URL = window.URL || window.webkitURL;

	  if (URL && "createObjectURL" in URL && "Uint8Array" in window && "Blob" in window) {
	    var request = new XMLHttpRequest();

	    request.open("GET", url, true);
	    request.responseType = "arraybuffer";

	    request.addEventListener("progress", function (e) {
	      var percent = e.loaded / e.total;
	      loader.progress(percent);
	    });

	    request.onload = function () {
	      if (request.status !== 200) {
	        return loader.error(url);
	      }

	      var data = this.response;
	      var blob = new Blob([new Uint8Array(data)], { type: "image/png" });
	      var image = new Image();
	      image.src = URL.createObjectURL(blob);
	      loader.done(image);
	    };
	    request.send();

	    return;
	  }

	  var image = new Image();
	  image.onload = function () {
	    loader.done(image);
	  };
	  image.onerror = function () {
	    loader.error(url);
	  };
	  image.src = url;
	};

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	module.exports = function (url, loader) {
	  var request = new XMLHttpRequest();

	  request.open("GET", url, true);
	  request.responseType = "text";

	  request.addEventListener("progress", function (e) {
	    var percent = e.loaded / e.total;
	    loader.progress(percent);
	  });

	  request.onload = function () {
	    if (request.status !== 200) {
	      return loader.error(url);
	    }

	    var data = this.response;
	    loader.done(data);
	  };
	  request.send();
	};

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	module.exports = function (manager) {
	  return function (url, loader) {
	    manager.load(url, {
	      done: function done(data) {
	        loader.done(data);
	      },

	      progress: function progress(e) {
	        var percent = e.loaded / e.total;
	        loader.progress(percent);
	      }
	    });
	  };
	};

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, process) {// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	"use strict";

	var formatRegExp = /%[sdj%]/g;
	exports.format = function (f) {
	  if (!isString(f)) {
	    var objects = [];
	    for (var i = 0; i < arguments.length; i++) {
	      objects.push(inspect(arguments[i]));
	    }
	    return objects.join(" ");
	  }

	  var i = 1;
	  var args = arguments;
	  var len = args.length;
	  var str = String(f).replace(formatRegExp, function (x) {
	    if (x === "%%") return "%";
	    if (i >= len) return x;
	    switch (x) {
	      case "%s":
	        return String(args[i++]);
	      case "%d":
	        return Number(args[i++]);
	      case "%j":
	        try {
	          return JSON.stringify(args[i++]);
	        } catch (_) {
	          return "[Circular]";
	        }
	      default:
	        return x;
	    }
	  });
	  for (var x = args[i]; i < len; x = args[++i]) {
	    if (isNull(x) || !isObject(x)) {
	      str += " " + x;
	    } else {
	      str += " " + inspect(x);
	    }
	  }
	  return str;
	};

	// Mark that a method should not be used.
	// Returns a modified function which warns once by default.
	// If --no-deprecation is set, then it is a no-op.
	exports.deprecate = function (fn, msg) {
	  // Allow for deprecating things in the process of starting up.
	  if (isUndefined(global.process)) {
	    return function () {
	      return exports.deprecate(fn, msg).apply(this, arguments);
	    };
	  }

	  if (process.noDeprecation === true) {
	    return fn;
	  }

	  var warned = false;
	  function deprecated() {
	    if (!warned) {
	      if (process.throwDeprecation) {
	        throw new Error(msg);
	      } else if (process.traceDeprecation) {
	        console.trace(msg);
	      } else {
	        console.error(msg);
	      }
	      warned = true;
	    }
	    return fn.apply(this, arguments);
	  }

	  return deprecated;
	};

	var debugs = {};
	var debugEnviron;
	exports.debuglog = function (set) {
	  if (isUndefined(debugEnviron)) debugEnviron = process.env.NODE_DEBUG || "";
	  set = set.toUpperCase();
	  if (!debugs[set]) {
	    if (new RegExp("\\b" + set + "\\b", "i").test(debugEnviron)) {
	      var pid = process.pid;
	      debugs[set] = function () {
	        var msg = exports.format.apply(exports, arguments);
	        console.error("%s %d: %s", set, pid, msg);
	      };
	    } else {
	      debugs[set] = function () {};
	    }
	  }
	  return debugs[set];
	};

	/**
	 * Echos the value of a value. Trys to print the value out
	 * in the best way possible given the different types.
	 *
	 * @param {Object} obj The object to print out.
	 * @param {Object} opts Optional options object that alters the output.
	 */
	/* legacy: obj, showHidden, depth, colors*/
	function inspect(obj, opts) {
	  // default options
	  var ctx = {
	    seen: [],
	    stylize: stylizeNoColor
	  };
	  // legacy...
	  if (arguments.length >= 3) ctx.depth = arguments[2];
	  if (arguments.length >= 4) ctx.colors = arguments[3];
	  if (isBoolean(opts)) {
	    // legacy...
	    ctx.showHidden = opts;
	  } else if (opts) {
	    // got an "options" object
	    exports._extend(ctx, opts);
	  }
	  // set default options
	  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
	  if (isUndefined(ctx.depth)) ctx.depth = 2;
	  if (isUndefined(ctx.colors)) ctx.colors = false;
	  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
	  if (ctx.colors) ctx.stylize = stylizeWithColor;
	  return formatValue(ctx, obj, ctx.depth);
	}
	exports.inspect = inspect;

	// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
	inspect.colors = {
	  bold: [1, 22],
	  italic: [3, 23],
	  underline: [4, 24],
	  inverse: [7, 27],
	  white: [37, 39],
	  grey: [90, 39],
	  black: [30, 39],
	  blue: [34, 39],
	  cyan: [36, 39],
	  green: [32, 39],
	  magenta: [35, 39],
	  red: [31, 39],
	  yellow: [33, 39]
	};

	// Don't use 'blue' not visible on cmd.exe
	inspect.styles = {
	  special: "cyan",
	  number: "yellow",
	  boolean: "yellow",
	  undefined: "grey",
	  "null": "bold",
	  string: "green",
	  date: "magenta",
	  // "name": intentionally not styling
	  regexp: "red"
	};

	function stylizeWithColor(str, styleType) {
	  var style = inspect.styles[styleType];

	  if (style) {
	    return "\u001b[" + inspect.colors[style][0] + "m" + str + "\u001b[" + inspect.colors[style][1] + "m";
	  } else {
	    return str;
	  }
	}

	function stylizeNoColor(str, styleType) {
	  return str;
	}

	function arrayToHash(array) {
	  var hash = {};

	  array.forEach(function (val, idx) {
	    hash[val] = true;
	  });

	  return hash;
	}

	function formatValue(ctx, value, recurseTimes) {
	  // Provide a hook for user-specified inspect functions.
	  // Check that value is an object with an inspect function on it
	  if (ctx.customInspect && value && isFunction(value.inspect) &&
	  // Filter out the util module, it's inspect function is special
	  value.inspect !== exports.inspect &&
	  // Also filter out any prototype objects using the circular check.
	  !(value.constructor && value.constructor.prototype === value)) {
	    var ret = value.inspect(recurseTimes, ctx);
	    if (!isString(ret)) {
	      ret = formatValue(ctx, ret, recurseTimes);
	    }
	    return ret;
	  }

	  // Primitive types cannot have properties
	  var primitive = formatPrimitive(ctx, value);
	  if (primitive) {
	    return primitive;
	  }

	  // Look up the keys of the object.
	  var keys = Object.keys(value);
	  var visibleKeys = arrayToHash(keys);

	  if (ctx.showHidden) {
	    keys = Object.getOwnPropertyNames(value);
	  }

	  // IE doesn't make error fields non-enumerable
	  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
	  if (isError(value) && (keys.indexOf("message") >= 0 || keys.indexOf("description") >= 0)) {
	    return formatError(value);
	  }

	  // Some type of object without properties can be shortcutted.
	  if (keys.length === 0) {
	    if (isFunction(value)) {
	      var name = value.name ? ": " + value.name : "";
	      return ctx.stylize("[Function" + name + "]", "special");
	    }
	    if (isRegExp(value)) {
	      return ctx.stylize(RegExp.prototype.toString.call(value), "regexp");
	    }
	    if (isDate(value)) {
	      return ctx.stylize(Date.prototype.toString.call(value), "date");
	    }
	    if (isError(value)) {
	      return formatError(value);
	    }
	  }

	  var base = "",
	      array = false,
	      braces = ["{", "}"];

	  // Make Array say that they are Array
	  if (isArray(value)) {
	    array = true;
	    braces = ["[", "]"];
	  }

	  // Make functions say that they are functions
	  if (isFunction(value)) {
	    var n = value.name ? ": " + value.name : "";
	    base = " [Function" + n + "]";
	  }

	  // Make RegExps say that they are RegExps
	  if (isRegExp(value)) {
	    base = " " + RegExp.prototype.toString.call(value);
	  }

	  // Make dates with properties first say the date
	  if (isDate(value)) {
	    base = " " + Date.prototype.toUTCString.call(value);
	  }

	  // Make error with message first say the error
	  if (isError(value)) {
	    base = " " + formatError(value);
	  }

	  if (keys.length === 0 && (!array || value.length == 0)) {
	    return braces[0] + base + braces[1];
	  }

	  if (recurseTimes < 0) {
	    if (isRegExp(value)) {
	      return ctx.stylize(RegExp.prototype.toString.call(value), "regexp");
	    } else {
	      return ctx.stylize("[Object]", "special");
	    }
	  }

	  ctx.seen.push(value);

	  var output;
	  if (array) {
	    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
	  } else {
	    output = keys.map(function (key) {
	      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
	    });
	  }

	  ctx.seen.pop();

	  return reduceToSingleString(output, base, braces);
	}

	function formatPrimitive(ctx, value) {
	  if (isUndefined(value)) {
	    return ctx.stylize("undefined", "undefined");
	  }if (isString(value)) {
	    var simple = "'" + JSON.stringify(value).replace(/^"|"$/g, "").replace(/'/g, "\\'").replace(/\\"/g, "\"") + "'";
	    return ctx.stylize(simple, "string");
	  }
	  if (isNumber(value)) {
	    return ctx.stylize("" + value, "number");
	  }if (isBoolean(value)) {
	    return ctx.stylize("" + value, "boolean");
	  } // For some reason typeof null is "object", so special case here.
	  if (isNull(value)) {
	    return ctx.stylize("null", "null");
	  }
	}

	function formatError(value) {
	  return "[" + Error.prototype.toString.call(value) + "]";
	}

	function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
	  var output = [];
	  for (var i = 0, l = value.length; i < l; ++i) {
	    if (hasOwnProperty(value, String(i))) {
	      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, String(i), true));
	    } else {
	      output.push("");
	    }
	  }
	  keys.forEach(function (key) {
	    if (!key.match(/^\d+$/)) {
	      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, key, true));
	    }
	  });
	  return output;
	}

	function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
	  var name, str, desc;
	  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
	  if (desc.get) {
	    if (desc.set) {
	      str = ctx.stylize("[Getter/Setter]", "special");
	    } else {
	      str = ctx.stylize("[Getter]", "special");
	    }
	  } else {
	    if (desc.set) {
	      str = ctx.stylize("[Setter]", "special");
	    }
	  }
	  if (!hasOwnProperty(visibleKeys, key)) {
	    name = "[" + key + "]";
	  }
	  if (!str) {
	    if (ctx.seen.indexOf(desc.value) < 0) {
	      if (isNull(recurseTimes)) {
	        str = formatValue(ctx, desc.value, null);
	      } else {
	        str = formatValue(ctx, desc.value, recurseTimes - 1);
	      }
	      if (str.indexOf("\n") > -1) {
	        if (array) {
	          str = str.split("\n").map(function (line) {
	            return "  " + line;
	          }).join("\n").substr(2);
	        } else {
	          str = "\n" + str.split("\n").map(function (line) {
	            return "   " + line;
	          }).join("\n");
	        }
	      }
	    } else {
	      str = ctx.stylize("[Circular]", "special");
	    }
	  }
	  if (isUndefined(name)) {
	    if (array && key.match(/^\d+$/)) {
	      return str;
	    }
	    name = JSON.stringify("" + key);
	    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
	      name = name.substr(1, name.length - 2);
	      name = ctx.stylize(name, "name");
	    } else {
	      name = name.replace(/'/g, "\\'").replace(/\\"/g, "\"").replace(/(^"|"$)/g, "'");
	      name = ctx.stylize(name, "string");
	    }
	  }

	  return name + ": " + str;
	}

	function reduceToSingleString(output, base, braces) {
	  var numLinesEst = 0;
	  var length = output.reduce(function (prev, cur) {
	    numLinesEst++;
	    if (cur.indexOf("\n") >= 0) numLinesEst++;
	    return prev + cur.replace(/\u001b\[\d\d?m/g, "").length + 1;
	  }, 0);

	  if (length > 60) {
	    return braces[0] + (base === "" ? "" : base + "\n ") + " " + output.join(",\n  ") + " " + braces[1];
	  }

	  return braces[0] + base + " " + output.join(", ") + " " + braces[1];
	}

	// NOTE: These type checking functions intentionally don't use `instanceof`
	// because it is fragile and can be easily faked with `Object.create()`.
	function isArray(ar) {
	  return Array.isArray(ar);
	}
	exports.isArray = isArray;

	function isBoolean(arg) {
	  return typeof arg === "boolean";
	}
	exports.isBoolean = isBoolean;

	function isNull(arg) {
	  return arg === null;
	}
	exports.isNull = isNull;

	function isNullOrUndefined(arg) {
	  return arg == null;
	}
	exports.isNullOrUndefined = isNullOrUndefined;

	function isNumber(arg) {
	  return typeof arg === "number";
	}
	exports.isNumber = isNumber;

	function isString(arg) {
	  return typeof arg === "string";
	}
	exports.isString = isString;

	function isSymbol(arg) {
	  return typeof arg === "symbol";
	}
	exports.isSymbol = isSymbol;

	function isUndefined(arg) {
	  return arg === void 0;
	}
	exports.isUndefined = isUndefined;

	function isRegExp(re) {
	  return isObject(re) && objectToString(re) === "[object RegExp]";
	}
	exports.isRegExp = isRegExp;

	function isObject(arg) {
	  return typeof arg === "object" && arg !== null;
	}
	exports.isObject = isObject;

	function isDate(d) {
	  return isObject(d) && objectToString(d) === "[object Date]";
	}
	exports.isDate = isDate;

	function isError(e) {
	  return isObject(e) && (objectToString(e) === "[object Error]" || e instanceof Error);
	}
	exports.isError = isError;

	function isFunction(arg) {
	  return typeof arg === "function";
	}
	exports.isFunction = isFunction;

	function isPrimitive(arg) {
	  return arg === null || typeof arg === "boolean" || typeof arg === "number" || typeof arg === "string" || typeof arg === "symbol" || // ES6 symbol
	  typeof arg === "undefined";
	}
	exports.isPrimitive = isPrimitive;

	exports.isBuffer = __webpack_require__(24);

	function objectToString(o) {
	  return Object.prototype.toString.call(o);
	}

	function pad(n) {
	  return n < 10 ? "0" + n.toString(10) : n.toString(10);
	}

	var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

	// 26 Feb 16:19:34
	function timestamp() {
	  var d = new Date();
	  var time = [pad(d.getHours()), pad(d.getMinutes()), pad(d.getSeconds())].join(":");
	  return [d.getDate(), months[d.getMonth()], time].join(" ");
	}

	// log is just a thin wrapper to console.log that prepends a timestamp
	exports.log = function () {
	  console.log("%s - %s", timestamp(), exports.format.apply(exports, arguments));
	};

	/**
	 * Inherit the prototype methods from one constructor into another.
	 *
	 * The Function.prototype.inherits from lang.js rewritten as a standalone
	 * function (not on Function.prototype). NOTE: If this file is to be loaded
	 * during bootstrapping this function needs to be rewritten using some native
	 * functions as prototype setup using normal JavaScript does not work as
	 * expected during bootstrapping (see mirror.js in r114903).
	 *
	 * @param {function} ctor Constructor function which needs to inherit the
	 *     prototype.
	 * @param {function} superCtor Constructor function to inherit prototype from.
	 */
	exports.inherits = __webpack_require__(26);

	exports._extend = function (origin, add) {
	  // Don't do anything if add isn't an object
	  if (!add || !isObject(add)) return origin;

	  var keys = Object.keys(add);
	  var i = keys.length;
	  while (i--) {
	    origin[keys[i]] = add[keys[i]];
	  }
	  return origin;
	};

	function hasOwnProperty(obj, prop) {
	  return Object.prototype.hasOwnProperty.call(obj, prop);
	}
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(25)))

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	// resolves . and .. elements in a path array with directory names there
	// must be no slashes, empty elements, or device names (c:\) in the array
	// (so also no leading and trailing slashes - it does not distinguish
	// relative and absolute paths)
	"use strict";

	function normalizeArray(parts, allowAboveRoot) {
	  // if the path tries to go above the root, `up` ends up > 0
	  var up = 0;
	  for (var i = parts.length - 1; i >= 0; i--) {
	    var last = parts[i];
	    if (last === ".") {
	      parts.splice(i, 1);
	    } else if (last === "..") {
	      parts.splice(i, 1);
	      up++;
	    } else if (up) {
	      parts.splice(i, 1);
	      up--;
	    }
	  }

	  // if the path is allowed to go above the root, restore leading ..s
	  if (allowAboveRoot) {
	    for (; up--; up) {
	      parts.unshift("..");
	    }
	  }

	  return parts;
	}

	// Split a filename into [root, dir, basename, ext], unix version
	// 'root' is just a slash, or nothing.
	var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
	var splitPath = function splitPath(filename) {
	  return splitPathRe.exec(filename).slice(1);
	};

	// path.resolve([from ...], to)
	// posix version
	exports.resolve = function () {
	  var resolvedPath = "",
	      resolvedAbsolute = false;

	  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
	    var path = i >= 0 ? arguments[i] : process.cwd();

	    // Skip empty and invalid entries
	    if (typeof path !== "string") {
	      throw new TypeError("Arguments to path.resolve must be strings");
	    } else if (!path) {
	      continue;
	    }

	    resolvedPath = path + "/" + resolvedPath;
	    resolvedAbsolute = path.charAt(0) === "/";
	  }

	  // At this point the path should be resolved to a full absolute path, but
	  // handle relative paths to be safe (might happen when process.cwd() fails)

	  // Normalize the path
	  resolvedPath = normalizeArray(filter(resolvedPath.split("/"), function (p) {
	    return !!p;
	  }), !resolvedAbsolute).join("/");

	  return (resolvedAbsolute ? "/" : "") + resolvedPath || ".";
	};

	// path.normalize(path)
	// posix version
	exports.normalize = function (path) {
	  var isAbsolute = exports.isAbsolute(path),
	      trailingSlash = substr(path, -1) === "/";

	  // Normalize the path
	  path = normalizeArray(filter(path.split("/"), function (p) {
	    return !!p;
	  }), !isAbsolute).join("/");

	  if (!path && !isAbsolute) {
	    path = ".";
	  }
	  if (path && trailingSlash) {
	    path += "/";
	  }

	  return (isAbsolute ? "/" : "") + path;
	};

	// posix version
	exports.isAbsolute = function (path) {
	  return path.charAt(0) === "/";
	};

	// posix version
	exports.join = function () {
	  var paths = Array.prototype.slice.call(arguments, 0);
	  return exports.normalize(filter(paths, function (p, index) {
	    if (typeof p !== "string") {
	      throw new TypeError("Arguments to path.join must be strings");
	    }
	    return p;
	  }).join("/"));
	};

	// path.relative(from, to)
	// posix version
	exports.relative = function (from, to) {
	  from = exports.resolve(from).substr(1);
	  to = exports.resolve(to).substr(1);

	  function trim(arr) {
	    var start = 0;
	    for (; start < arr.length; start++) {
	      if (arr[start] !== "") break;
	    }

	    var end = arr.length - 1;
	    for (; end >= 0; end--) {
	      if (arr[end] !== "") break;
	    }

	    if (start > end) {
	      return [];
	    }return arr.slice(start, end - start + 1);
	  }

	  var fromParts = trim(from.split("/"));
	  var toParts = trim(to.split("/"));

	  var length = Math.min(fromParts.length, toParts.length);
	  var samePartsLength = length;
	  for (var i = 0; i < length; i++) {
	    if (fromParts[i] !== toParts[i]) {
	      samePartsLength = i;
	      break;
	    }
	  }

	  var outputParts = [];
	  for (var i = samePartsLength; i < fromParts.length; i++) {
	    outputParts.push("..");
	  }

	  outputParts = outputParts.concat(toParts.slice(samePartsLength));

	  return outputParts.join("/");
	};

	exports.sep = "/";
	exports.delimiter = ":";

	exports.dirname = function (path) {
	  var result = splitPath(path),
	      root = result[0],
	      dir = result[1];

	  if (!root && !dir) {
	    // No dirname whatsoever
	    return ".";
	  }

	  if (dir) {
	    // It has a dirname, strip trailing slash
	    dir = dir.substr(0, dir.length - 1);
	  }

	  return root + dir;
	};

	exports.basename = function (path, ext) {
	  var f = splitPath(path)[2];
	  // TODO: make this comparison case-insensitive on windows?
	  if (ext && f.substr(-1 * ext.length) === ext) {
	    f = f.substr(0, f.length - ext.length);
	  }
	  return f;
	};

	exports.extname = function (path) {
	  return splitPath(path)[3];
	};

	function filter(xs, f) {
	  if (xs.filter) {
	    return xs.filter(f);
	  }var res = [];
	  for (var i = 0; i < xs.length; i++) {
	    if (f(xs[i], i, xs)) res.push(xs[i]);
	  }
	  return res;
	}

	// String.prototype.substr - negative index don't work in IE8
	var substr = "ab".substr(-1) === "b" ? function (str, start, len) {
	  return str.substr(start, len);
	} : function (str, start, len) {
	  if (start < 0) start = str.length + start;
	  return str.substr(start, len);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(25)))

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var util = __webpack_require__(18);
	var LoadedAudio = __webpack_require__(22);

	var AudioManager = function AudioManager() {
	  var AudioContext = window.AudioContext || window.webkitAudioContext;

	  this._ctx = new AudioContext();
	  this._masterGain = this._ctx.createGain();
	  this._volume = 1;
	  this.isMuted = false;

	  var iOS = /(iPad|iPhone|iPod)/g.test(navigator.userAgent);
	  if (iOS) {
	    this._enableiOS();
	  }
	};

	AudioManager.prototype._enableiOS = function () {
	  var self = this;

	  var touch = (function (_touch) {
	    var _touchWrapper = function touch() {
	      return _touch.apply(this, arguments);
	    };

	    _touchWrapper.toString = function () {
	      return _touch.toString();
	    };

	    return _touchWrapper;
	  })(function () {
	    var buffer = self._ctx.createBuffer(1, 1, 22050);
	    var source = self._ctx.createBufferSource();
	    source.buffer = buffer;
	    source.connect(self._ctx.destination);
	    source.start(0);

	    window.removeEventListener("touchstart", touch, false);
	  });

	  window.addEventListener("touchstart", touch, false);
	};

	AudioManager.prototype.mute = function () {
	  this.isMuted = true;
	  this._updateMute();
	};

	AudioManager.prototype.unmute = function () {
	  this.isMuted = false;
	  this._updateMute();
	};

	AudioManager.prototype.toggleMute = function () {
	  this.isMuted = !this.isMuted;
	  this._updateMute();
	};

	AudioManager.prototype._updateMute = function () {
	  this._masterGain.gain.value = this.isMuted ? 0 : this._volume;
	};

	AudioManager.prototype.setVolume = function (volume) {
	  this._volume = volume;
	  this._masterGain.gain.value = volume;
	};

	AudioManager.prototype.load = function (url, callback) {
	  var loader = {
	    done: function done() {},
	    error: function error() {},
	    progress: function progress() {}
	  };

	  if (callback && util.isFunction(callback)) {
	    loader.done = callback;
	  } else {
	    if (callback.done) {
	      loader.done = callback.done;
	    }

	    if (callback.error) {
	      loader.error = callback.error;
	    }

	    if (callback.progress) {
	      loader.progress = callback.progress;
	    }
	  }

	  var self = this;

	  var request = new XMLHttpRequest();
	  request.open("GET", url, true);
	  request.responseType = "arraybuffer";

	  request.addEventListener("progress", function (e) {
	    loader.progress(e);
	  });

	  request.onload = function () {
	    self.decodeAudioData(request.response, function (source) {
	      loader.done(source);
	    });
	  };
	  request.send();
	};

	AudioManager.prototype.decodeAudioData = function (data, callback) {
	  var self = this;

	  this._ctx.decodeAudioData(data, function (result) {
	    var audio = new LoadedAudio(self._ctx, result, self._masterGain);

	    callback(audio);
	  });
	};

	module.exports = AudioManager;

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var util = __webpack_require__(18);
	var DirtyManager = __webpack_require__(23);

	var ObjectPool = [];

	var GetObjectFromPool = function GetObjectFromPool() {
	  var result = ObjectPool.pop();

	  if (result) {
	    return result;
	  }

	  return {};
	};

	var indexToNumberAndLowerCaseKey = function indexToNumberAndLowerCaseKey(index) {
	  if (index <= 9) {
	    return 48 + index;
	  } else if (index === 10) {
	    return 48;
	  } else if (index > 10 && index <= 36) {
	    return 64 + (index - 10);
	  } else {
	    return null;
	  }
	};

	var defaults = [{ name: "Show FPS", entry: "showFps", defaults: true }, { name: "Show Key Codes", entry: "showKeyCodes", defaults: true }, { name: "Show Monitor Values", entry: "showMonitorValues", defaults: true }];

	var Debugger = function Debugger(app) {
	  this.video = app.video.createLayer({
	    allowHiDPI: true,
	    getCanvasContext: true
	  });

	  this.graph = app.video.createLayer({
	    allowHiDPI: false,
	    getCanvasContext: true
	  });

	  this._graphHeight = 100;
	  this._60fpsMark = this._graphHeight * 0.8;
	  this._msToPx = this._60fpsMark / 16.66;

	  this.app = app;

	  this.options = defaults;
	  this._maxLogsCounts = 10;

	  for (var i = 0; i < this.options.length; i++) {
	    var option = this.options[i];
	    this._initOption(option);
	  }

	  this.disabled = false;

	  this.fps = 0;
	  this.fpsCount = 0;
	  this.fpsElapsedTime = 0;
	  this.fpsUpdateInterval = 0.5;
	  this._framePerf = [];

	  this._fontSize = 0;
	  this._dirtyManager = new DirtyManager(this.video.canvas, this.video.ctx);

	  this.logs = [];

	  this._perfValues = {};
	  this._perfNames = [];

	  this.showDebug = false;
	  this.enableDebugKeys = true;
	  this.enableShortcuts = false;

	  this.enableShortcutsKey = 220;

	  this.lastKey = "";

	  this._monitor = {};

	  this._load();

	  this.keyShortcuts = [{ key: 123, entry: "showDebug", type: "toggle" }];

	  var self = this;
	  this.addConfig({ name: "Show Performance Graph", entry: "showGraph", defaults: false, call: function call() {
	      self.graph.clear();
	    } });

	  this._diff = 0;
	  this._frameStart = 0;
	};

	Debugger.prototype.begin = function () {
	  if (this.showDebug) {
	    this._frameStart = window.performance.now();
	  }
	};

	Debugger.prototype.end = function () {
	  if (this.showDebug) {
	    this._diff = window.performance.now() - this._frameStart;
	  }
	};

	Debugger.prototype._setFont = function (px, font) {
	  this._fontSize = px;
	  this.video.ctx.font = px + "px " + font;
	};

	Debugger.prototype.addConfig = function (option) {
	  this.options.push(option);
	  this._initOption(option);
	};

	Debugger.prototype._initOption = function (option) {
	  option.type = option.type || "toggle";
	  option.defaults = option.defaults == null ? false : option.defaults;

	  if (option.type === "toggle") {
	    this[option.entry] = option.defaults;
	  }
	};

	Debugger.prototype.clear = function () {
	  this.logs.length = 0;
	};

	Debugger.prototype.log = function (message, color) {
	  color = color || "white";
	  message = typeof message === "string" ? message : util.inspect(message);

	  var messages = message.replace(/\\'/g, "'").split("\n");

	  for (var i = 0; i < messages.length; i++) {
	    var msg = messages[i];
	    if (this.logs.length >= this._maxLogsCounts) {
	      ObjectPool.push(this.logs.shift());
	    }

	    var messageObject = GetObjectFromPool();
	    messageObject.text = msg;
	    messageObject.life = 10;
	    messageObject.color = color;

	    this.logs.push(messageObject);
	  }
	};

	Debugger.prototype.update = function () {};

	Debugger.prototype.exitUpdate = function (time) {
	  if (this.disabled) {
	    return;
	  }

	  if (this.showDebug) {
	    this._maxLogsCounts = Math.ceil((this.app.height + 20) / 20);
	    this.fpsCount += 1;
	    this.fpsElapsedTime += time;

	    if (this.fpsElapsedTime > this.fpsUpdateInterval) {
	      var fps = this.fpsCount / this.fpsElapsedTime;

	      if (this.showFps) {
	        this.fps = this.fps * (1 - 0.8) + 0.8 * fps;
	      }

	      this.fpsCount = 0;
	      this.fpsElapsedTime = 0;
	    }

	    for (var i = 0, len = this.logs.length; i < len; i++) {
	      var log = this.logs[i];
	      if (log) {
	        log.life -= time;
	        if (log.life <= 0) {
	          var index = this.logs.indexOf(log);
	          if (index > -1) {
	            this.logs.splice(index, 1);
	          }
	        }
	      }
	    }

	    for (var i = 0; i < this._perfNames.length; i++) {
	      var name = this._perfNames[i];
	      var value = this._perfValues[name];
	      this.monitor(name, value.value.toFixed(3) + " sec");
	    }
	  }
	};

	Debugger.prototype.keydown = function (value) {
	  if (this.disabled) {
	    return;
	  }

	  this.lastKey = value.key;

	  var i;

	  if (this.enableDebugKeys) {
	    if (value.key === this.enableShortcutsKey) {
	      value.event.preventDefault();

	      this.enableShortcuts = !this.enableShortcuts;
	      return true;
	    }

	    if (this.enableShortcuts) {
	      for (i = 0; i < this.options.length; i++) {
	        var option = this.options[i];
	        var keyIndex = i + 1;

	        if (this.app.input.isKeyDown("ctrl")) {
	          keyIndex -= 36;
	        }

	        var charId = indexToNumberAndLowerCaseKey(keyIndex);

	        if (charId && value.key === charId) {
	          value.event.preventDefault();

	          if (option.type === "toggle") {

	            this[option.entry] = !this[option.entry];
	            if (option.call) {
	              option.call();
	            }

	            this._save();
	          } else if (option.type === "call") {
	            option.entry();
	          }

	          return true;
	        }
	      }
	    }
	  }

	  for (i = 0; i < this.keyShortcuts.length; i++) {
	    var keyShortcut = this.keyShortcuts[i];
	    if (keyShortcut.key === value.key) {
	      value.event.preventDefault();

	      if (keyShortcut.type === "toggle") {
	        this[keyShortcut.entry] = !this[keyShortcut.entry];
	        this._save();
	      } else if (keyShortcut.type === "call") {
	        this[keyShortcut.entry]();
	      }

	      return true;
	    }
	  }

	  return false;
	};

	Debugger.prototype._save = function () {
	  var data = {
	    showDebug: this.showDebug,
	    options: {}
	  };

	  for (var i = 0; i < this.options.length; i++) {
	    var option = this.options[i];
	    var value = this[option.entry];
	    data.options[option.entry] = value;
	  }

	  window.localStorage.__potionDebug = JSON.stringify(data);
	};

	Debugger.prototype._load = function () {
	  if (window.localStorage && window.localStorage.__potionDebug) {
	    var data = JSON.parse(window.localStorage.__potionDebug);
	    this.showDebug = data.showDebug;

	    for (var name in data.options) {
	      this[name] = data.options[name];
	    }
	  }
	};

	Debugger.prototype.render = function () {
	  if (this.disabled) {
	    return;
	  }

	  this._dirtyManager.clear();

	  if (this.showDebug) {
	    this.video.ctx.save();
	    this._setFont(15, "sans-serif");

	    this._renderLogs();
	    this._renderData();
	    this._renderShortcuts();

	    this.video.ctx.restore();

	    if (this.showMonitorValues) {
	      var i = 0;
	      for (var key in this._monitor) {
	        var value = this._monitor[key];
	        this._setFont(15, "sans-serif");

	        this.video.ctx.textAlign = "right";
	        this.video.ctx.textBaseline = "bottom";

	        this._renderText(key, this.app.width - 14, this.app.height - 28 - 5 - 40 * i, "#e9dc7c");
	        value = typeof value === "string" ? value : util.inspect(value);
	        this._renderText(value, this.app.width - 14, this.app.height - 14 - 40 * i);

	        i += 1;
	      }
	    }

	    if (this.showGraph) {
	      this.graph.ctx.drawImage(this.graph.canvas, 0, this.app.height - this._graphHeight, this.app.width, this._graphHeight, -2, this.app.height - this._graphHeight, this.app.width, this._graphHeight);

	      this.graph.ctx.fillStyle = "#F2F0D8";
	      this.graph.ctx.fillRect(this.app.width - 2, this.app.height - this._graphHeight, 2, this._graphHeight);

	      this.graph.ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
	      this.graph.ctx.fillRect(this.app.width - 2, this.app.height - this._60fpsMark, 2, 1);

	      var last = 0;
	      for (var i = 0; i < this._framePerf.length; i++) {
	        var item = this._framePerf[i];
	        var name = this._perfNames[i];

	        this._drawFrameLine(item, name, last);

	        last += item;
	      }

	      this._drawFrameLine(this._diff - last, "lag", last);
	      this._framePerf.length = 0;
	    }
	  }
	};

	Debugger.prototype._drawFrameLine = function (value, name, last) {
	  var background = "black";
	  if (name === "update") {
	    background = "#6BA5F2";
	  } else if (name === "render") {
	    background = "#F27830";
	  } else if (name === "lag") {
	    background = "#91f682";
	  }
	  this.graph.ctx.fillStyle = background;

	  var height = (value + last) * this._msToPx;

	  var x = this.app.width - 2;
	  var y = this.app.height - height;

	  this.graph.ctx.fillRect(x, y, 2, height - last * this._msToPx);
	};

	Debugger.prototype._renderLogs = function () {
	  this.video.ctx.textAlign = "left";
	  this.video.ctx.textBaseline = "bottom";

	  for (var i = 0, len = this.logs.length; i < len; i++) {
	    var log = this.logs[i];

	    var y = -10 + this.app.height + (i - this.logs.length + 1) * 20;
	    this._renderText(log.text, 10, y, log.color);
	  }
	};

	Debugger.prototype.disable = function () {
	  this.disabled = true;
	  this.showDebug = false;
	};

	Debugger.prototype.monitor = function (name, value) {
	  this._monitor[name] = value;
	};

	Debugger.prototype.perf = function (name) {
	  if (!this.showDebug) {
	    return;
	  }

	  var exists = this._perfValues[name];

	  if (exists == null) {
	    this._perfNames.push(name);

	    this._perfValues[name] = {
	      name: name,
	      value: 0,
	      records: []
	    };
	  }

	  var time = window.performance.now();

	  var record = this._perfValues[name];

	  record.value = time;
	};

	Debugger.prototype.stopPerf = function (name) {
	  if (!this.showDebug) {
	    return;
	  }

	  var record = this._perfValues[name];

	  var time = window.performance.now();
	  var diff = time - record.value;

	  record.records.push(diff);
	  if (record.records.length > 10) {
	    record.records.shift();
	  }

	  var sum = 0;
	  for (var i = 0; i < record.records.length; i++) {
	    sum += record.records[i];
	  }

	  var avg = sum / record.records.length;

	  record.value = avg;
	  this._framePerf.push(diff);
	};

	Debugger.prototype._renderData = function () {
	  this.video.ctx.textAlign = "right";
	  this.video.ctx.textBaseline = "top";

	  var x = this.app.width - 14;
	  var y = 14;

	  if (this.showFps) {
	    this._renderText(Math.round(this.fps) + " fps", x, y);
	  }

	  y += 24;

	  this._setFont(15, "sans-serif");

	  if (this.showKeyCodes) {
	    var buttonName = "";
	    if (this.app.input.mouse.isLeftDown) {
	      buttonName = "left";
	    } else if (this.app.input.mouse.isRightDown) {
	      buttonName = "right";
	    } else if (this.app.input.mouse.isMiddleDown) {
	      buttonName = "middle";
	    }

	    this._renderText("key " + this.lastKey, x, y, this.app.input.isKeyDown(this.lastKey) ? "#e9dc7c" : "white");
	    this._renderText("btn " + buttonName, x - 60, y, this.app.input.mouse.isDown ? "#e9dc7c" : "white");
	  }
	};

	Debugger.prototype._renderShortcuts = function () {
	  if (this.enableShortcuts) {
	    var height = 28;

	    this._setFont(20, "Helvetica Neue, sans-serif");
	    this.video.ctx.textAlign = "left";
	    this.video.ctx.textBaseline = "top";
	    var maxPerCollumn = Math.floor((this.app.height - 14) / height);

	    for (var i = 0; i < this.options.length; i++) {
	      var option = this.options[i];
	      var x = 14 + Math.floor(i / maxPerCollumn) * 320;
	      var y = 14 + i % maxPerCollumn * height;

	      var keyIndex = i + 1;
	      var charId = indexToNumberAndLowerCaseKey(keyIndex);

	      var isOn = this[option.entry];

	      var shortcut = String.fromCharCode(charId);

	      if (!charId) {
	        shortcut = "^+" + String.fromCharCode(indexToNumberAndLowerCaseKey(keyIndex - 36));
	      }

	      var text = "[" + shortcut + "] " + option.name;
	      if (option.type === "toggle") {
	        text += " (" + (isOn ? "ON" : "OFF") + ")";
	      } else if (option.type === "call") {
	        text += " (CALL)";
	      }

	      var color = "rgba(255, 255, 255, 1)";
	      var outline = "rgba(0, 0, 0, 1)";

	      if (!isOn) {
	        color = "rgba(255, 255, 255, .7)";
	        outline = "rgba(0, 0, 0, .7)";
	      }

	      this._renderText(text, x, y, color, outline);
	    }
	  }
	};

	Debugger.prototype._renderText = function (text, x, y, color, outline) {
	  color = color || "white";
	  outline = outline || "black";
	  this.video.ctx.fillStyle = color;
	  this.video.ctx.lineJoin = "round";
	  this.video.ctx.strokeStyle = outline;
	  this.video.ctx.lineWidth = 3;
	  this.video.ctx.strokeText(text, x, y);
	  this.video.ctx.fillText(text, x, y);

	  var width = this.video.ctx.measureText(text).width;

	  var dx = x - 5;
	  var dy = y;
	  var dwidth = width + 10;
	  var dheight = this._fontSize + 10;

	  if (this.video.ctx.textAlign === "right") {
	    dx = x - 5 - width;
	  }

	  this._dirtyManager.addRect(dx, dy, dwidth, dheight);
	};

	module.exports = Debugger;

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var PlayingAudio = __webpack_require__(27);

	var LoadedAudio = function LoadedAudio(ctx, buffer, masterGain) {
	  this._ctx = ctx;
	  this._masterGain = masterGain;
	  this._buffer = buffer;
	  this._buffer.loop = false;
	};

	LoadedAudio.prototype._createSound = function (gain) {
	  var source = this._ctx.createBufferSource();
	  source.buffer = this._buffer;

	  this._masterGain.connect(this._ctx.destination);

	  gain.connect(this._masterGain);

	  source.connect(gain);

	  return source;
	};

	LoadedAudio.prototype.play = function () {
	  var gain = this._ctx.createGain();

	  var sound = this._createSound(gain);

	  sound.start(0);

	  return new PlayingAudio(sound, gain);
	};

	LoadedAudio.prototype.fadeIn = function (value, time) {
	  var gain = this._ctx.createGain();

	  var sound = this._createSound(gain);

	  gain.gain.setValueAtTime(0, 0);
	  gain.gain.linearRampToValueAtTime(0.01, 0);
	  gain.gain.linearRampToValueAtTime(value, time);

	  sound.start(0);

	  return new PlayingAudio(sound, gain);
	};

	LoadedAudio.prototype.loop = function () {
	  var gain = this._ctx.createGain();

	  var sound = this._createSound(gain);

	  sound.loop = true;
	  sound.start(0);

	  return new PlayingAudio(sound, gain);
	};

	module.exports = LoadedAudio;

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var DirtyManager = function DirtyManager(canvas, ctx) {
	  this.ctx = ctx;
	  this.canvas = canvas;

	  this.top = canvas.height;
	  this.left = canvas.width;
	  this.bottom = 0;
	  this.right = 0;

	  this.isDirty = false;
	};

	DirtyManager.prototype.addRect = function (left, top, width, height) {
	  var right = left + width;
	  var bottom = top + height;

	  this.top = top < this.top ? top : this.top;
	  this.left = left < this.left ? left : this.left;
	  this.bottom = bottom > this.bottom ? bottom : this.bottom;
	  this.right = right > this.right ? right : this.right;

	  this.isDirty = true;
	};

	DirtyManager.prototype.clear = function () {
	  if (!this.isDirty) {
	    return;
	  }

	  this.ctx.clearRect(this.left, this.top, this.right - this.left, this.bottom - this.top);

	  this.left = this.canvas.width;
	  this.top = this.canvas.height;
	  this.right = 0;
	  this.bottom = 0;

	  this.isDirty = false;
	};

	module.exports = DirtyManager;

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	module.exports = function isBuffer(arg) {
	  return arg && typeof arg === "object" && typeof arg.copy === "function" && typeof arg.fill === "function" && typeof arg.readUInt8 === "function";
	};

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	// shim for using process in browser

	"use strict";

	var process = module.exports = {};
	var queue = [];
	var draining = false;

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    draining = true;
	    var currentQueue;
	    var len = queue.length;
	    while (len) {
	        currentQueue = queue;
	        queue = [];
	        var i = -1;
	        while (++i < len) {
	            currentQueue[i]();
	        }
	        len = queue.length;
	    }
	    draining = false;
	}
	process.nextTick = function (fun) {
	    queue.push(fun);
	    if (!draining) {
	        setTimeout(drainQueue, 0);
	    }
	};

	process.title = "browser";
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ""; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error("process.binding is not supported");
	};

	// TODO(shtylman)
	process.cwd = function () {
	    return "/";
	};
	process.chdir = function (dir) {
	    throw new Error("process.chdir is not supported");
	};
	process.umask = function () {
	    return 0;
	};

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	if (typeof Object.create === "function") {
	  // implementation from standard node.js 'util' module
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor;
	    ctor.prototype = Object.create(superCtor.prototype, {
	      constructor: {
	        value: ctor,
	        enumerable: false,
	        writable: true,
	        configurable: true
	      }
	    });
	  };
	} else {
	  // old school shim for old browsers
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor;
	    var TempCtor = function TempCtor() {};
	    TempCtor.prototype = superCtor.prototype;
	    ctor.prototype = new TempCtor();
	    ctor.prototype.constructor = ctor;
	  };
	}

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var PlayingAudio = function PlayingAudio(source, gain) {
	  this._gain = gain;
	  this._source = source;
	};

	PlayingAudio.prototype.setVolume = function (volume) {
	  this._gain.gain.value = volume;
	};

	PlayingAudio.prototype.stop = function () {
	  this._source.stop(0);
	};

	PlayingAudio.prototype.loop = function () {
	  this._source.loop = true;
	};

	module.exports = PlayingAudio;

/***/ }
/******/ ])
});
;