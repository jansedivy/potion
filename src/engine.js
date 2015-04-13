require('./raf-polyfill')();

var Game = require('./game');

var Time = require('./time');

var Debugger = require('potion-debugger');

var StateManager = require('./state-manager');

/**
 * Main Engine class which calls the game methods
 * @constructor
 */
var Engine = function(container, methods) {
  var GameClass = this._subclassGame(container, methods);

  container.style.position = 'relative';

  var canvas = document.createElement('canvas');
  canvas.style.display = 'block';
  container.appendChild(canvas);

  this.game = new GameClass(canvas);
  this.game.debug = new Debugger(this.game);

  this._setDefaultStates();

  this.tickFunc = (function (self) { return function() { self.tick(); }; })(this);
  this.preloaderTickFunc = (function (self) { return function() { self._preloaderTick(); }; })(this);

  this.strayTime = 0;

  this._time = Time.now();

  this.game.assets.onload(function() {
    window.cancelAnimationFrame(this.preloaderId);
    this.game._preloader.exit();

    this.start();
  }.bind(this));

  if (this.game.assets.isLoading && this.game.config.showPreloader) {
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
    self.game.input.resetKeys();
    self.game.blur();
  });

  window.addEventListener('focus', function() {
    self.game.input.resetKeys();
    self.game.focus();
  });
};

/**
 * Starts the game, adds events and run first frame
 * @private
 */
Engine.prototype.start = function() {
  if (this.game.config.addInputEvents) {
    this.addEvents();
  }

  window.requestAnimationFrame(this.tickFunc);
};

/**
 * Main tick function in game loop
 * @private
 */
Engine.prototype.tick = function() {
  window.requestAnimationFrame(this.tickFunc);

  this.game.debug.begin();

  var now = Time.now();
  var time = (now - this._time) / 1000;
  this._time = now;

  this.game.debug.perf('update');
  this.update(time);
  this.game.debug.stopPerf('update');

  this.game.states.exitUpdate(time);

  this.game.debug.perf('render');
  this.render();
  this.game.debug.stopPerf('render');

  this.game.debug.render();

  this.game.debug.end();
};

/**
 * Updates the game
 * @param {number} time - time in seconds since last frame
 * @private
 */
Engine.prototype.update = function(time) {
  if (time > this.game.config.maxStepTime) { time = this.game.config.maxStepTime; }

  if (this.game.config.fixedStep) {
    this.strayTime = this.strayTime + time;
    while (this.strayTime >= this.game.config.stepTime) {
      this.strayTime = this.strayTime - this.game.config.stepTime;
      this.game.states.update(this.game.config.stepTime);
    }
  } else {
    this.game.states.update(time);
  }
};

/**
 * Renders the game
 * @private
 */
Engine.prototype.render = function() {
  this.game.video.beginFrame();

  this.game.video.clear();

  this.game.states.render();

  this.game.video.endFrame();
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

  this.game.preloading(time);
};

Engine.prototype._setDefaultStates = function() {
  var states = new StateManager();
  states.add('app', this.game);
  states.add('debug', this.game.debug);

  states.protect('app');
  states.protect('debug');
  states.hide('debug');

  this.game.states = states;
};

Engine.prototype._subclassGame = function(container, methods) {
  var GameClass = function(container) {
    Game.call(this, container);
  };

  GameClass.prototype = Object.create(Game.prototype);

  for (var method in methods) {
    GameClass.prototype[method] = methods[method];
  }

  return GameClass;
};

module.exports = Engine;
