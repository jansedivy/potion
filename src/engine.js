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
  var AppClass = this._subclassApp(container, methods);

  container.style.position = 'relative';

  var canvas = document.createElement('canvas');
  canvas.style.display = 'block';
  container.appendChild(canvas);

  this.app = new AppClass(canvas);
  this.app.debug = new Debugger(this.app);

  this.tickFunc = (function (self) { return function() { self.tick(); }; })(this);
  this.preloaderTickFunc = (function (self) { return function() { self._preloaderTick(); }; })(this);

  this.strayTime = 0;
  this._time = 0;

  setTimeout(function() {
    this.configureApp();
  }.bind(this), 0);
};

Engine.prototype.configureApp = function() {
  this.app.configure();

  this.app.video.init();

  if (this.app.config.addInputEvents) {
    this.app.input = new Input(this.app, this.app.canvas.parentElement);
  }

  this.app.setSize(this.app.width, this.app.height);

  this._setDefaultStates();

  this._time = Time.now();

  this.app._preloader = new Loading(this.app);

  this.app.assets.start(function() {
    window.cancelAnimationFrame(this.preloaderId);
    this.app._preloader.exit();

    this.start();
  }.bind(this));

  if (this.app.assets.isLoading && this.app.config.showPreloader) {
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
    self.app.input.resetKeys();
    self.app.blur();
  });

  window.addEventListener('focus', function() {
    self.app.input.resetKeys();
    self.app.focus();
  });
};

/**
 * Starts the app, adds events and run first frame
 * @private
 */
Engine.prototype.start = function() {
  if (this.app.config.addInputEvents) {
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

  this.app.debug.begin();

  var now = Time.now();
  var time = (now - this._time) / 1000;
  this._time = now;

  this.app.debug.perf('update');
  this.update(time);
  this.app.debug.stopPerf('update');

  this.app.states.exitUpdate(time);

  this.app.debug.perf('render');
  this.render();
  this.app.debug.stopPerf('render');

  this.app.debug.render();

  this.app.debug.end();
};

/**
 * Updates the app
 * @param {number} time - time in seconds since last frame
 * @private
 */
Engine.prototype.update = function(time) {
  if (time > this.app.config.maxStepTime) { time = this.app.config.maxStepTime; }

  if (this.app.config.fixedStep) {
    this.strayTime = this.strayTime + time;
    while (this.strayTime >= this.app.config.stepTime) {
      this.strayTime = this.strayTime - this.app.config.stepTime;
      this.app.states.update(this.app.config.stepTime);
    }
  } else {
    this.app.states.update(time);
  }
};

/**
 * Renders the app
 * @private
 */
Engine.prototype.render = function() {
  this.app.video.beginFrame();

  this.app.video.clear();

  this.app.states.render();

  this.app.video.endFrame();
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

  this.app.preloading(time);
};

Engine.prototype._setDefaultStates = function() {
  var states = new StateManager();
  states.add('app', this.app);
  states.add('debug', this.app.debug);

  states.protect('app');
  states.protect('debug');
  states.hide('debug');

  this.app.states = states;
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
