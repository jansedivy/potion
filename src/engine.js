var Video = require('./video');
var Game = require('./game');

var raf = require('./raf');

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

  /**
   * Video instance for rendering into canvas
   * @type {Video}
   */
  this.video = this.game.video = new Video(canvas);

  this.game.config();

  this.setupCanvasSize();

  var self = this;
  this.game.sprite.load(this.game.load.sprite, this.game.load.spriteImage, function() {
    self.start();
  });
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
  this.video.canvas.width = this.game.width;
  this.video.canvas.height = this.game.height;

  if (this.game.isRetina) {
    this.video.scale(2);
  }
};

/**
 * Starts the game, adds events and run first frame
 * @private
 */
Engine.prototype.start = function() {
  this.game.start();
  this.addEvents();
  this.startFrame();
};

/**
 * Starts next frame in game loop
 * @private
 */
Engine.prototype.startFrame = function() {
  this._time = Date.now();
  var self = this;
  raf(function() { self.tick(); });
};

/**
 * Main tick function in game loop
 * @private
 */
Engine.prototype.tick = function() {
  var time = (Date.now() - this._time) / 1000;
  if (time > 0.016) { time = 0.016; }

  this.update(time);
  this.render();

  this.startFrame();
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
  this.video.ctx.clearRect(0, 0, this.game.width, this.game.height);
  this.game.render();
};

module.exports = Engine;
