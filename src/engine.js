var Video = require('./video');
var Game = require('./game');

var SpriteSheetManager = require('./spriteSheetManager');

var isRetina = require('./retina');

var raf = require('./raf');

var Engine = function(canvas, methods) {
  var GameClass = function(canvas) { Game.call(this, canvas); };
  GameClass.prototype = Object.create(Game.prototype);
  for (var method in methods) {
    GameClass.prototype[method] = methods[method];
  }

  this.game = new GameClass(canvas);
  this.video = this.game.video = new Video(canvas);
  this.game.sprite = new SpriteSheetManager();
  this.game.isRetina = isRetina();

  this.game.config();

  this.setupCanvasSize();

  this.game.sprite.load(this.game.load.sprite, this.game.load.spriteImage, this.start.bind(this));
};

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

Engine.prototype.setupCanvasSize = function() {
  this.game.resize();
  this.video.canvas.width = this.game.width;
  this.video.canvas.height = this.game.height;

  if (this.game.isRetina) {
    this.video.scale(2);
  }
};

Engine.prototype.start = function() {
  this.game.start();
  this.addEvents();
  this.startFrame();
};

Engine.prototype.startFrame = function() {
  this._time = Date.now();
  var self = this;
  raf(function() { self.tick(); });
};

Engine.prototype.tick = function() {
  var time = (Date.now() - this._time) / 1000;
  if (time > 0.016) { time = 0.016; }

  this.update(time);
  this.render();

  this.startFrame();
};

Engine.prototype.update = function(time) {
  this.game.update(time);
};

Engine.prototype.render = function() {
  this.video.ctx.clearRect(0, 0, this.game.width, this.game.height);
  this.game.render();
};

module.exports = Engine;
