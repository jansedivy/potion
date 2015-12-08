var isRetina = require('./retina')();

var Video = function(app, canvas, config) {
  this.app = app;

  this.config = config;

  this.canvas = canvas;

  this.width = app.width;

  this.height = app.height;

  this._parent = null;
  this._isRoot = false;
  this._children = [];
};

Video.prototype.init = function() {
  if (this.config.getCanvasContext) {
    this.ctx = this.canvas.getContext('2d');
  }

  this._applySizeToCanvas();
};

Video.prototype.include = function(methods) {
  for (var method in methods) {
    this[method] = methods[method];
  }
};

Video.prototype.beginFrame = function() {};

Video.prototype.endFrame = function() {};

Video.prototype.destroy = function() {
  if (!this._isRoot) {
    var index = this._parent._children.indexOf(this);
    if (index !== -1) {
      this._parent._children.splice(index, 1);
    }
  }

  this.canvas.parentElement.removeChild(this.canvas);
};

Video.prototype.scaleCanvas = function(scale) {
  this.canvas.width *= scale;
  this.canvas.height *= scale;

  if (this.ctx) {
    this.ctx.scale(scale, scale);
  }
};

Video.prototype._resize = function(width, height) {
  this.width = width;
  this.height = height;

  this.canvas.style.width = '100%';
  this.canvas.style.height = '100%';

  this._applySizeToCanvas();

  for (var i=0, len=this._children.length; i<len; i++) {
    var item = this._children[i];
    item._resize(width, height);
  }
};

Video.prototype._applySizeToCanvas = function() {
  this.canvas.width = this.width;
  this.canvas.height = this.height;

  if (this.config.allowHiDPI && isRetina) {
    this.scaleCanvas(2);
  }
};

Video.prototype.clear = function() {
  if (this.ctx) { this.ctx.clearRect(0, 0, this.width, this.height); }
};

Video.prototype.createLayer = function(config) {
  config = config || {};

  var container = this.app.container;
  var canvas = document.createElement('canvas');
  canvas.width = this.width;
  canvas.height = this.height;
  canvas.style.position = 'absolute';
  canvas.style.top = '0px';
  canvas.style.left = '0px';
  container.appendChild(canvas);

  var video = new Video(this.app, canvas, config);

  video._parent = this;
  video._isRoot = false;

  video.init();
  video._resize(this.width, this.height);

  this._children.push(video);

  return video;
};

module.exports = Video;
