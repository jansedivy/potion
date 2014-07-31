require('./raf-polyfill')();

var Game = require('./game');

var Time = require('./time');

/**
 * Main Engine class which calls the game methods
 * @constructor
 */
var Engine = function(canvas, methods) {
  var GameClass = function(canvas) { Game.call(this, canvas); };
  GameClass.prototype = Object.create(Game.prototype);
  for (var method in methods) {
    GameClass.prototype[method] = methods[method];
  }

  /**
   * Game code instance
   * @type {Game}
   */
  this.game = new GameClass(canvas);

  this.tickFunc = (function (self) { return function() { self.tick(); }; })(this);
  this.preloaderTickFunc = (function (self) { return function() { self._preloaderTick(); }; })(this);

  this.setupCanvasSize();

  this.strayTime = 0;

  this._time = Time.now();

  this.game.assets.onload(function() {
    this.start();

    window.cancelAnimationFrame(this.preloaderId);
    window.requestAnimationFrame(this.tickFunc);
  }.bind(this));

  if (this.game.assets.isLoading) {
    this.preloaderId = window.requestAnimationFrame(this.preloaderTickFunc);
  }
};

/**
 * Add event listener for window events
 * @private
 */
Engine.prototype.addEvents = function() {
  var self = this;

  window.addEventListener('resize', function() {
    self.setupCanvasSize();
  });

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
 * Runs every time on resize event
 * @private
 */
Engine.prototype.setupCanvasSize = function() {
  this.game.resize();
  this.game.video.width = this.game.canvas.width = this.game.width;
  this.game.video.height = this.game.canvas.height = this.game.height;

  if (this.game.config.useRetina && this.game.isRetina) {
    this.game.video.scaleCanvas(2);
  }
};

/**
 * Starts the game, adds events and run first frame
 * @private
 */
Engine.prototype.start = function() {
  this.game.init();
  if (this.game.config.addInputEvents) {
    this.addEvents();
  }
};

/**
 * Main tick function in game loop
 * @private
 */
Engine.prototype.tick = function() {
  window.requestAnimationFrame(this.tickFunc);

  var now = Time.now();
  var time = (now - this._time) / 1000;
  this._time = now;

  this.update(time);
  this.game.exitUpdate(time);
  this.render();
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

  if (this.game.config.showPreloader) {
    if (this.game.video.ctx) { this.game.video.ctx.clearRect(0, 0, this.game.width, this.game.height); }
    this.game.preloading(time);
  }
};

/**
 * Updates the game
 * @param {number} time - time in seconds since last frame
 * @private
 */
Engine.prototype.update = function(time) {
  if (time > this.game.config.mapStepTime) { time = this.game.config.mapStepTime; }

  if (this.game.config.fixedStep) {
    this.strayTime = this.strayTime + time;
    while (this.strayTime >= this.game.config.stepTime) {
      this.strayTime = this.strayTime - this.game.config.stepTime;
      this.game.update(this.game.config.stepTime);
    }
  } else {
    this.game.update(time);
  }
};

/**
 * Renders the game
 * @private
 */
Engine.prototype.render = function() {
  if (this.game.video.ctx) { this.game.video.ctx.clearRect(0, 0, this.game.width, this.game.height); }
  this.game.render();
};

module.exports = Engine;
