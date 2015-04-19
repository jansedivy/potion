var Video = require('./video');
var Assets = require('./assets');

var App = function(canvas) {
  this.canvas = canvas;

  this.width = 300;

  this.height = 300;

  this.assets = new Assets();

  this.states = null;
  this.debug = null;
  this.input = null;

  this.config = {
    allowHiDPI: true,
    getCanvasContext: true,
    addInputEvents: true,
    showPreloader: true,
    fixedStep: false,
    stepTime: 1/60,
    maxStepTime: 1/60
  };

  this.video = new Video(this, canvas, this.config);
  this.video._isRoot = true;
};

App.prototype.setSize = function(width, height) {
  this.width = width;
  this.height = height;

  var container = this.canvas.parentElement;
  container.style.width = this.width + 'px';
  container.style.height = this.height + 'px';

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
