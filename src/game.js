var Video = require('./video');
var Input = require('./input');
var Assets = require('./assets');
var isRetina = require('./retina');

/**
 * Game class that is subclassed by actual game code
 * @constructor
 * @param {HTMLCanvasElement} canvas - canvas DOM element
 */
var Game = function(canvas) {
  /**
   * Canvas DOM element
   * @type {HTMLCanvasElement}
   */
  this.canvas = canvas;

  /**
   * Video instance for rendering into canvas
   * @type {Video}
   */
  this.video = new Video(canvas);

  /**
   * Game width in pixels
   * @type {number}
   */
  this.width = 300;

  /**
   * Game highs in pixels
   * @type {number}
   */
  this.height = 300;

  /**
   * Instance of Assets for loading assets for the game
   * @type {Assets}
   */
  this.assets = new Assets();

  /**
   * True if you are using retina screen
   * @type {boolean}
   */
  this.isRetina = isRetina();

  /**
   * Input instance for mouse and keyboard events
   * @type {Input}
   */
  this.input = new Input(this);

  this.configure();
};

/**
 * Is called when all assets are loaded
 * @abstract
 */
Game.prototype.init = function() {};

/**
 * Configure the game
 * @abstract
 */
Game.prototype.configure = function() {};

/**
 * Window resize event
 * @abstract
 */
Game.prototype.resize = function() {};

/**
 * Renders the game
 * @abstract
 */
Game.prototype.render = function() {};

/**
 * Updates the game
 * @param {number} time - time in seconds since last frame
 * @abstract
 */
Game.prototype.update = function(time) {};

/**
 * Mousemove event
 * @param {number} x - x position
 * @param {number} y - y position
 * @abstract
 */
Game.prototype.mousemove = function(x, y) {};

Game.prototype.mouseup = function(x, y) {};

/**
 * Window Focus event
 * @abstract
 */
Game.prototype.focus = function() {};

Game.prototype.click = function() {};

/**
 * Window Blur event
 * @abstract
 */
Game.prototype.blur = function() {};

Game.prototype.preloading = function(time) {
  if (!this.video.ctx) { return; }
  if (this._preloaderWidth === undefined) { this._preloaderWidth = 0; }

  var ratio = Math.max(0, Math.min(1, (this.assets.loadedItemsCount)/this.assets.itemsCount));
  var width = Math.min(this.width * 2/3, 300);
  var height = 20;

  var y = (this.height - height) / 2;
  var x = (this.width - width) / 2;

  var currentWidth = width * ratio;
  this._preloaderWidth = this._preloaderWidth + (currentWidth - this._preloaderWidth) * time * 10;

  this.video.ctx.save();

  this.video.ctx.fillStyle = '#a9c848';
  this.video.ctx.fillRect(0, 0, this.width, this.height);

  this.video.ctx.fillStyle = '#88a237';
  this.video.ctx.fillRect(x, y, width, height);

  this.video.ctx.fillStyle = '#f6ffda';
  this.video.ctx.fillRect(x, y, this._preloaderWidth, height);

  this.video.ctx.restore();
},


module.exports = Game;
