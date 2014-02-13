/**
 * @constructor
 * @param {HTMLCanvasElement} canvas - Canvas DOM element
 */
var Video = function(canvas) {
  /**
   * Canvas DOM element
   * @type {HTMLCanvasElement}
   */
  this.canvas = canvas;

  /**
   * canvas context
   * @type {CanvasRenderingContext2D}
   */
  this.ctx = canvas.getContext('2d');
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
 * Scale canvas buffer, used for retina screens
 * @param {number} scale
 */
Video.prototype.scale = function(scale) {
  this.canvas.style.width = this.canvas.width + 'px';
  this.canvas.style.height = this.canvas.height + 'px';

  this.canvas.width *= scale;
  this.canvas.height *= scale;

  this.ctx.scale(scale, scale);
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
Video.prototype.sprite = function(sprite, x, y, offsetX, offsetY, w, h) {
  offsetX = offsetX || 0;
  offsetY = offsetY || 0;

  w = w || sprite.width;
  h = h || sprite.height;

  x = Math.floor(x);
  y = Math.floor(y);

  var drawWidth = w;
  var drawHeight = h;

  if (sprite.source_image.match(/@2x.png$/)) {
    drawWidth /= 2;
    drawHeight /= 2;
  }

  this.ctx.drawImage(sprite.image, sprite.x + offsetX, sprite.y + offsetY, w, h, x, y, drawWidth, drawHeight);
};

/**
 * Draw animatino at given location
 * @param {Animation} animation - Animation object
 * @param {number} x - x position
 * @param {number} y - y position
 */
Video.prototype.animation = function(animation, x, y) {
  this.sprite(animation.sprite, x, y, animation.offsetX, animation.offsetY, animation.width, animation.height);
};

module.exports = Video;
