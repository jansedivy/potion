/**
 * Animation class for rendering sprites in grid
 * @constructor
 * @param {object} sprite - sprite object
 * @param {number} width - width of individual images in animation
 * @param {number} height - height of individual images in animation
 * @param {number} [columns=null] - optional number of columns in animation
 */
var Animation = function(sprite, width, height, columns) {
  /**
   * @type object
   */
  this.sprite = sprite;

  /**
   * width of individual images in animation
   * @type {number}
   */
  this.width = width;

  /**
   * height of individual images in animation
   * @type {number}
   */
  this.height = height;

  /**
   * number of columns in animation
   * @type {number}
   */
  this.columns = columns;

  /**
   * Current index of image
   * @type {number}
   */
  this.state = 0;

  /**
   * Current X index
   * @type {number}
   */
  this.indexX = 0;

  /**
   * Current Y index
   * @type {number}
   */
  this.indexY = 0;

  /**
   * Image offset X
   * @type {number}
   */
  this.offsetX = 0;

  /**
   * Image offset Y
   * @type {number}
   */
  this.offsetY = 0;
};

/**
 * Set x and y index
 * @param {number} x - x index
 * @param {number} y - y index
 */
Animation.prototype.setIndexes = function(x, y) {
  this.setIndexX(x);
  this.setIndexY(y);
};

/**
 * Set x index
 * @param {number} x - x index
 */
Animation.prototype.setIndexX = function(x) {
  this.indexX = x;
  this.offsetX = this.width * this.indexX;
};

/**
 * Set y index
 * @param {number} y - y index
 */
Animation.prototype.setIndexY = function(y) {
  this.indexY = y;
  this.offsetY = this.height * this.indexY;
};

/**
 * Set image index
 * @param {number} state - image index
 */
Animation.prototype.setState = function(state) {
  this.state = state;

  var x = this.state;
  var y = 0;

  if (this.columns) {
    x = this.state % this.columns;
    y = Math.floor(this.state/this.columns);
  }

  this.setIndexX(x);
  this.setIndexY(y);
};

module.exports = Animation;
