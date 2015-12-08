var Video = require('./video');
var Assets = require('./assets');

var Debugger = require('potion-debugger');

var PotionAudio = require('potion-audio');

var App = function(container) {
  this.container = container;

  container.style.position = 'relative';

  var canvas = document.createElement('canvas');
  canvas.style.display = 'block';
  container.appendChild(canvas);

  this.canvas = canvas;

  this.width = 300;

  this.height = 300;

  this.audio = new PotionAudio();

  this.assets = new Assets(this);

  this.states = null;

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

  this.debug = new Debugger(this);
};

App.prototype.resize = function(width, height) {
  this.width = width;
  this.height = height;

  this.scale(width, height);

  if (this.video) {
    this.video._resize(width, height);
  }

  if (this.states) {
    this.states.resize();
  }
};

App.prototype.scale = function(width, height) {
  this.container.style.width = width + 'px';
  this.container.style.height = height + 'px';
};

module.exports = App;
