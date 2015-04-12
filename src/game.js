var Video = require('./video');
var Assets = require('./assets');
var Input = require('./input');
var Loading = require('./loading');

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

  this._preloader = new Loading(this);
};

Game.prototype.setSize = function(width, height) {
  this.width = width;
  this.height = height;

  if (this.video) {
    this.video.setSize(width, height);
  }
};

Game.prototype.preloading = function(time) {
  if (this.config.showPreloader) {
    this._preloader.render(time);
  }
};

Game.prototype.configure = function() {};

Game.prototype.focus = function() {};

Game.prototype.blur = function() {};

module.exports = Game;
