var Video = require('./video');
var Assets = require('./assets');
var Input = require('./input');
var Loading = require('./loading');

var App = function(canvas) {
  this.canvas = canvas;

  this.width = 300;

  this.height = 300;

  this.assets = new Assets();

  this.states = null;
  this.debug = null;
  this.input = null;
  this.video = null;

  this.config = {
    allowHiDPI: true,
    getCanvasContext: true,
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
    this.video._isRoot = true;
  }

  if (this.config.addInputEvents) {
    this.input = new Input(this, canvas.parentElement);
  }

  this._preloader = new Loading(this);

  if (this.resize) {
    this.resize();
  }
};

App.prototype.setSize = function(width, height) {
  if (width === this.width && height === this.height) {
    return;
  }

  this.width = width;
  this.height = height;

  if (this.video) {
    this.video._setSize(width, height);
  }

  if (this.states) {
    this.states.resize();
  }
};

App.prototype.preloading = function(time) {
  if (this.config.showPreloader) {
    this._preloader.render(time);
  }
};

App.prototype.configure = function() {};

App.prototype.focus = function() {};

App.prototype.blur = function() {};

module.exports = App;
