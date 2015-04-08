var Video = require('./video');
var Assets = require('./assets');
var Input = require('./input');

var Game = function(canvas) {
  this.canvas = canvas;

  this.width = 300;

  this.height = 300;

  this.assets = new Assets();

  this.states = null;
  this.debug = null;
  this.input = null;
  this.video = null;

  this.config = {
    useRetina: true,
    initializeCanvas: true,
    initializeVideo: true,
    addInputEvents: true,
    showPreloader: true,
    fixedStep: false,
    stepTime: 0.01666,
    maxStepTime: 0.01666
  };

  this.configure();

  if (this.config.initializeVideo) {
    this.video = new Video(this, canvas, this.config);
  }

  if (this.config.addInputEvents) {
    this.input = new Input(this, canvas.parentElement);
  }
};

Game.prototype.setSize = function(width, height) {
  this.width = width;
  this.height = height;

  if (this.video) {
    this.video.setSize(width, height);
  }
};

Game.prototype.preloading = function(time) {
  if (!this.config.showPreloader && !(this.video && this.video.ctx)) { return; }

  if (this.video.ctx) {
    var color1 = '#b9ff71';
    var color2 = '#8ac250';
    var color3 = '#648e38';

    if (this._preloaderWidth === undefined) { this._preloaderWidth = 0; }

    var width = Math.min(this.width * 2/3, 300);
    var height = 20;

    var y = (this.height - height) / 2;
    var x = (this.width - width) / 2;

    var currentWidth = width * this.assets.progress;
    this._preloaderWidth = this._preloaderWidth + (currentWidth - this._preloaderWidth) * time * 10;

    this.video.ctx.save();

    this.video.ctx.fillStyle = color2;
    this.video.ctx.fillRect(0, 0, this.width, this.height);

    this.video.ctx.font = '400 40px sans-serif';
    this.video.ctx.textAlign = 'center';
    this.video.ctx.textBaseline = 'bottom';

    this.video.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    this.video.ctx.fillText("Potion.js", this.width/2, y + 2);

    this.video.ctx.fillStyle = '#d1ffa1';
    this.video.ctx.fillText("Potion.js", this.width/2, y);

    this.video.ctx.strokeStyle = this.video.ctx.fillStyle = color3;
    this.video.ctx.fillRect(x, y + 15, width, height);

    this.video.ctx.lineWidth = 2;
    this.video.ctx.beginPath();
    this.video.ctx.rect(x - 5, y + 10, width + 10, height + 10);
    this.video.ctx.closePath();
    this.video.ctx.stroke();

    this.video.ctx.strokeStyle = this.video.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    this.video.ctx.fillRect(x, y + 15, this._preloaderWidth, height + 2);

    this.video.ctx.lineWidth = 2;
    this.video.ctx.beginPath();

    this.video.ctx.moveTo(x + this._preloaderWidth, y + 12);
    this.video.ctx.lineTo(x - 5, y + 12);
    this.video.ctx.lineTo(x - 5, y + 10 + height + 12);
    this.video.ctx.lineTo(x + this._preloaderWidth, y + 10 + height + 12);

    this.video.ctx.stroke();
    this.video.ctx.closePath();

    this.video.ctx.strokeStyle = this.video.ctx.fillStyle = color1;
    this.video.ctx.fillRect(x, y + 15, this._preloaderWidth, height);

    this.video.ctx.lineWidth = 2;
    this.video.ctx.beginPath();

    this.video.ctx.moveTo(x + this._preloaderWidth, y + 10);
    this.video.ctx.lineTo(x - 5, y + 10);
    this.video.ctx.lineTo(x - 5, y + 10 + height + 10);
    this.video.ctx.lineTo(x + this._preloaderWidth, y + 10 + height + 10);

    this.video.ctx.stroke();
    this.video.ctx.closePath();

    this.video.ctx.restore();
  }
};

Game.prototype.configure = function() {};

Game.prototype.focus = function() {};

Game.prototype.blur = function() {};

module.exports = Game;
