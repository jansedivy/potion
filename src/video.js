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
 * @param {HTMLImageElement} image - image with sprites
 * @param {object} sprite - sprite data
 * @param {number} x - x position
 * @param {number} y - y position
 */
Video.prototype.sprite = function(image, sprite, x, y) {
  x = Math.floor(x);
  y = Math.floor(y);

  var w = sprite.width;
  var h = sprite.height;
  var drawWidth = w;
  var drawHeight = h;

  if (sprite.source_image.match(/@2x.png$/)) {
    drawWidth /= 2;
    drawHeight /= 2;
  }

  this.ctx.drawImage(image, sprite.x, sprite.y, w, h, x, y, drawWidth, drawHeight);
};

module.exports = Video;
