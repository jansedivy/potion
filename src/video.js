var isRetina = require('./retina')();

/**
 * @constructor
 * @param {HTMLCanvasElement} canvas - Canvas DOM element
 */
var Video = function(game, canvas, config) {
  this.game = game;
  this.config = config;
  /**
   * Canvas DOM element
   * @type {HTMLCanvasElement}
   */
  this.canvas = canvas;

  /**
   * Game width in pixels
   * @type {number}
   */
  this.width = game.width;

  /**
   * Game height in pixels
   * @type {number}
   */
  this.height = game.height;

  /**
   * canvas context
   * @type {CanvasRenderingContext2D}
   */
  if (config.initializeCanvas) {
    this.ctx = canvas.getContext('2d');
  }

  this._applySizeToCanvas();
};

/**
 * Includes mixins into Video library
 * @param {object} methods - object of methods that will included in Video
 */
Video.prototype.include = function(methods) {
  for (var method in methods) {
    this[method] = methods[method];
  }
};

/**
 * Called at the beginning of each frame
 */
Video.prototype.beginFrame = function() {};

/**
 * Called at the end of each frame
 */
Video.prototype.endFrame = function() {};

/**
 * Scale canvas buffer, used for retina screens
 * @param {number} scale
 */
Video.prototype.scaleCanvas = function(scale) {
  this.canvas.style.width = this.canvas.width + 'px';
  this.canvas.style.height = this.canvas.height + 'px';

  this.canvas.width *= scale;
  this.canvas.height *= scale;

  if (this.ctx) {
    this.ctx.scale(scale, scale);
  }
};

/**
 * Resize canvas element
 */
Video.prototype.setSize = function(width, height) {
  this.width = width;
  this.height = height;

  this._applySizeToCanvas();
};

Video.prototype._applySizeToCanvas = function() {
  this.canvas.width = this.width;
  this.canvas.height = this.height;

  var container = this.canvas.parentElement;
  container.style.width = this.width + 'px';
  container.style.height = this.height + 'px';

  if (this.config.useRetina && isRetina) {
    this.scaleCanvas(2);
  }
};

/**
 * clear canvas screen
 */
Video.prototype.clear = function() {
  if (this.ctx) { this.ctx.clearRect(0, 0, this.width, this.height); }
};

/**
 * Create another canvas element on top of the previous one
 */
Video.prototype.createLayer = function(config) {
  config = config || {};

  var container = this.canvas.parentElement;
  var canvas = document.createElement('canvas');
  canvas.width = this.width;
  canvas.height = this.height;
  canvas.style.position = 'absolute';
  canvas.style.top = '0px';
  canvas.style.left = '0px';
  container.appendChild(canvas);

  var video = new Video(this.game, canvas, config);

  return video;
};

module.exports = Video;
