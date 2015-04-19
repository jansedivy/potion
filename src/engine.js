require('./raf-polyfill')();

var App = require('./app');

var Time = require('./time');

var Debugger = require('potion-debugger');

var StateManager = require('./state-manager');

var Input = require('./input');
var Loading = require('./loading');

/**
 * Main Engine class which calls the app methods
 * @constructor
 */
var Engine = function(container, methods) {
  container.style.position = 'relative';

  var canvas = document.createElement('canvas');
  canvas.style.display = 'block';
  container.appendChild(canvas);

  this.controller = new App(canvas);

  this.app = methods;
  this.controller.main = this.app;
  this.app.app = this.controller;

  this.controller.debug = new Debugger(this.controller);

  this.tickFunc = (function (self) { return function() { self.tick(); }; })(this);
  this.preloaderTickFunc = (function (self) { return function() { self._preloaderTick(); }; })(this);

  this.strayTime = 0;
  this._time = 0;

  setTimeout(function() {
    this.configureApp();
  }.bind(this), 0);
};

Engine.prototype.configureApp = function() {
  if (this.app.configure) {
    this.app.configure();
  }

  this.controller.video.init();

  if (this.controller.config.addInputEvents) {
    this.controller.input = new Input(this.controller, this.controller.canvas.parentElement);
  }

  this.controller.setSize(this.controller.width, this.controller.height);

  this._setDefaultStates();

  this._time = Time.now();

  this.controller._preloader = new Loading(this.controller);

  this.controller.assets.start(function() {
    window.cancelAnimationFrame(this.preloaderId);
    this.controller._preloader.exit();

    this.start();
  }.bind(this));

  if (this.controller.assets.isLoading && this.controller.config.showPreloader) {
    this.preloaderId = window.requestAnimationFrame(this.preloaderTickFunc);
  }
};

/**
 * Add event listener for window events
 * @private
 */
Engine.prototype.addEvents = function() {
  var self = this;

  window.addEventListener('blur', function() {
    self.controller.input.resetKeys();

    if (self.app.blur) {
      self.app.blur();
    }
  });

  window.addEventListener('focus', function() {
    self.controller.input.resetKeys();

    if (self.app.focus) {
      self.app.focus();
    }
  });
};

/**
 * Starts the app, adds events and run first frame
 * @private
 */
Engine.prototype.start = function() {
  if (this.controller.config.addInputEvents) {
    this.addEvents();
  }

  window.requestAnimationFrame(this.tickFunc);
};

/**
 * Main tick function in app loop
 * @private
 */
Engine.prototype.tick = function() {
  window.requestAnimationFrame(this.tickFunc);

  this.controller.debug.begin();

  var now = Time.now();
  var time = (now - this._time) / 1000;
  this._time = now;

  this.controller.debug.perf('update');
  this.update(time);
  this.controller.debug.stopPerf('update');

  this.controller.states.exitUpdate(time);

  this.controller.debug.perf('render');
  this.render();
  this.controller.debug.stopPerf('render');

  this.controller.debug.render();

  this.controller.debug.end();
};

/**
 * Updates the app
 * @param {number} time - time in seconds since last frame
 * @private
 */
Engine.prototype.update = function(time) {
  if (time > this.controller.config.maxStepTime) { time = this.controller.config.maxStepTime; }

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

/**
 * Renders the app
 * @private
 */
Engine.prototype.render = function() {
  this.controller.video.beginFrame();

  this.controller.video.clear();

  this.controller.states.render();

  this.controller.video.endFrame();
};

/**
 * Main tick function in preloader loop
 * @private
 */
Engine.prototype._preloaderTick = function() {
  this.preloaderId = window.requestAnimationFrame(this.preloaderTickFunc);

  var now = Time.now();
  var time = (now - this._time) / 1000;
  this._time = now;

  this.controller.preloading(time);
};

Engine.prototype._setDefaultStates = function() {
  var states = new StateManager();
  states.add('main', this.app);
  states.add('debug', this.controller.debug);

  states.protect('main');
  states.protect('debug');
  states.hide('debug');

  this.controller.states = states;
};

Engine.prototype._subclassApp = function(container, methods) {
  var AppClass = function(container) {
    App.call(this, container);
  };

  AppClass.prototype = Object.create(App.prototype);

  for (var method in methods) {
    AppClass.prototype[method] = methods[method];
  }

  return AppClass;
};

module.exports = Engine;
