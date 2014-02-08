var Video = require('./video');
var Game = require('./game');

var SpriteSheetManager = require('./spriteSheetManager');

var Class = require('./class');

var isRetina = require('./retina');

var Engine = Class.extend({
  init: function(canvas, methods) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    this.game = new (Game.extend(methods))();
    this.game.video = new Video(this.ctx);
    this.game.canvas = canvas;
    this.game.sprite = new SpriteSheetManager();
    this.game.isRetina = isRetina();

    this.game.config();


    this.setupCanvasSize();

    this.game.sprite.load(this.game.load.sprite, this.game.load.spriteImage, this.start.bind(this));
  },

  addEvents: function() {
    var self = this;

    window.addEventListener('resize', this.setupCanvasSize.bind(this));

    this.canvas.addEventListener('mousedown', function(e) {
      self.game.mousepos.x = e.offsetX;
      self.game.mousepos.y = e.offsetY;
      self.game.mousedown = true;
    });

    this.canvas.addEventListener('mouseup', function() {
      self.game.mousedown = false;
    });

    this.canvas.addEventListener('mousemove', function(e) {
      self.game.mousemove(e.offsetX, e.offsetY);
      self.game.mousepos.x = e.offsetX;
      self.game.mousepos.y = e.offsetY;
    });

    this.canvas.addEventListener('click', function(e) {
      self.game.click(e.offsetX, e.offsetY);
      e.preventDefault();
    });

    window.addEventListener('blur', function() {
      self.game._keys = {};
      self.game.blur();
    });

    window.addEventListener('focus', function() {
      self.game._keys = {};
      self.game.focus();
    });

    document.addEventListener('keypress', function(e) {
      self.game.keypress(e.keyCode);
    });

    document.addEventListener('keydown', function(e) {
      self.game._keys[e.keyCode] = true;
      //e.preventDefault();
    });

    document.addEventListener('keyup', function(e) {
      self.game._keys[e.keyCode] = false;
      //e.preventDefault();
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
    window.requestAnimationFrame(function() { self.tick(); });
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
