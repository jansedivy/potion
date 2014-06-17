var Game = require('./game');

var raf = require('./raf');
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

  this.tickFunc = (function (self) {
    return function() { self.tick(); };
  })(this);

  this.setupCanvasSize();

  this.game.assets.onload(function() {
    this.start();
  }.bind(this));

  this._time = Time.now();
  raf(this.tickFunc);
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
  if (this.game.addInputEvents) {
    this.addEvents();
  }
};

/**
 * Main tick function in game loop
 * @private
 */
Engine.prototype.tick = function() {
  raf(this.tickFunc);

  var now = Time.now();
  var time = (now - this._time) / 1000;
  if (time > 0.01666) { time = 0.01666; }
  this._time = now;

  if (this.game.assets.isLoading) {
    if (this.game.config.showPreloader) {
      this.game.preloading(time);
    }
  } else {
    this.update(time);
    this.render();
  }
};

/**
 * Updates the game
 * @param {number} time - time in seconds since last frame
 * @private
 */
Engine.prototype.update = function(time) {
  this.game.update(time);
};

/**
 * Renders the game
 * @private
 */
Engine.prototype.render = function() {
  this.game.video.beginFrame();
  this.game.render();
  this.game.video.endFrame();
};

module.exports = Engine;
