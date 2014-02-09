var Video = require('./video');
var Game = require('./game');

var SpriteSheetManager = require('./spriteSheetManager');

var Class = require('./class');

var isRetina = require('./retina');

var raf = require('./raf');

var Engine = Class.extend({
  init: function(canvas, methods) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    this.game = new (Game.extend(methods))(canvas);
    this.game.video = new Video(this.ctx);
    this.game.sprite = new SpriteSheetManager();
    this.game.isRetina = isRetina();

    this.game.config();

    this.setupCanvasSize();

    this.game.sprite.load(this.game.load.sprite, this.game.load.spriteImage, this.start.bind(this));
  },

  addEvents: function() {
    var self = this;

    window.addEventListener('resize', this.setupCanvasSize.bind(this));

    window.addEventListener('blur', function() {
      self.game.input.resetKeys();
      self.game.blur();
    });

    window.addEventListener('focus', function() {
      self.game.input.resetKeys();
      self.game.focus();
    });
  },

  setupCanvasSize: function() {
    this.game.resize();
    this.canvas.width = this.game.canvasWidth;
    this.canvas.height = this.game.canvasHeight;

    if (this.game.isRetina) {
      this.canvas.width *= 2;
      this.canvas.height *= 2;

      this.canvas.style.width = this.game.canvasWidth + 'px';
      this.canvas.style.height = this.game.canvasHeight + 'px';
      this.ctx.scale(2, 2);
    }

    this.gameOffsetX = (this.game.canvasWidth - this.game.width)/2;
    this.gameOffsetY = (this.game.canvasHeight - this.game.height)/2;
  },

  start: function() {
    this.game.start();
    this.addEvents();
    this.startFrame();
  },

  startFrame: function() {
    this._time = Date.now();
    var self = this;
    raf(function() { self.tick(); });
  },

  tick: function() {
    var time = (Date.now() - this._time) / 1000;
    if (time > 0.016) { time = 0.016; }

    this.update(time);
    this.render();

    this.startFrame();
  },

  update: function(time) {
    this.game.totalTime += time;
    this.game.update(time);
  },

  render: function() {
    this.ctx.clearRect(0, 0, this.game.canvasWidth, this.game.canvasHeight);

    this.ctx.translate(this.gameOffsetX, this.gameOffsetY);
    this.game.render();
    this.ctx.translate(-this.gameOffsetX, -this.gameOffsetY);
  }
});

module.exports = Engine;
