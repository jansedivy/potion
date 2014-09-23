var isRetina = require('./retina');

/**
 * @constructor
 * @param {HTMLCanvasElement} canvas - Canvas DOM element
 */
var Video = function(canvas, config) {
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
  this.width = canvas.width;

  /**
   * Game height in pixels
   * @type {number}
   */
  this.height = canvas.height;

  /**
   * canvas context
   * @type {CanvasRenderingContext2D}
   */
  if (config.initializeCanvas) {
    this.ctx = canvas.getContext('2d');
  }
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

Video.prototype.beginFrame = function() {};

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

Video.prototype.setSize = function(width, height, resizeParent) {
  this.width = width;
  this.height = height;

  if (resizeParent) {
    this.canvas.parentElement.style.width = width + 'px';
    this.canvas.parentElement.style.height = height + 'px';
  }

  this.canvas.width = width;
  this.canvas.height = height;
};

/**
 * Draws image sprite into x a y position
 * @param {object} sprite - sprite data
 * @param {number} x - x position
 * @param {number} y - y position
 * @param {number} [offsetX] - image position offset x
 * @param {number} [offsetY] - image position offset y
 * @param {number} [w] - final rendering width
 * @param {number} [h] - final rendering height
 */
Video.prototype.sprite = function(image, x, y, offsetX, offsetY, w, h) {
  if (!this.ctx) { return; }

  offsetX = offsetX || 0;
  offsetY = offsetY || 0;

  w = w || image.width;
  h = h || image.height;

  x = Math.floor(x);
  y = Math.floor(y);

  var drawWidth = w;
  var drawHeight = h;

  if (image.src.match(/@2x.png$/)) {
    drawWidth /= 2;
    drawHeight /= 2;
  }

  this.ctx.drawImage(image, image.x + offsetX, image.y + offsetY, w, h, x, y, drawWidth, drawHeight);
};

/**
 * Draw animatino at given location
 * @param {Animation} animation - Animation object
 * @param {number} x - x position
 * @param {number} y - y position
 */
Video.prototype.animation = function(animation, x, y) {
  if (!this.ctx) { return; }

  this.sprite(animation.image, x, y, animation.offsetX, animation.offsetY, animation.width, animation.height);
};

Video.prototype.clear = function() {
  if (this.ctx) { this.ctx.clearRect(0, 0, this.width, this.height); }
};

Video.prototype.createLayer = function(config) {
  config = config || {};

  var container = this.canvas.parentElement;
  var canvas = document.createElement('canvas');
  canvas.width = container.clientWidth;
  canvas.height = container.clientHeight;
  canvas.style.position = 'absolute';
  canvas.style.top = '0px';
  canvas.style.left = '0px';
  container.appendChild(canvas);
  var video = new Video(canvas, this.config);

  if (config.useRetina && isRetina()) {
    video.scaleCanvas(2);
  }

  return video;
};

module.exports = Video;
