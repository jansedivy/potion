var Video = require('./video');
var Assets = require('./assets');

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

  this.states = null;

  this.debug = null;

  /**
   * Object for configuring Potion
   * @type {object}
   */
  this.config = {
    useRetina: true,
    initializeCanvas: true,
    initializeVideo: true,
    addInputEvents: true,
    showPreloader: true,
    fixedStep: false,
    stepTime: 0.01666,
    maxStepTime: 0.01666
  };

  this.configure();

  /**
   * Input instance for mouse and keyboard events
   * @type {Input}
   */
  this.input = null;

  /**
   * Video instance for rendering into canvas
   * @type {Video}
   */
  if (this.config.initializeVideo) {
    this.video = new Video(this, canvas, this.config);
  }
};

/**
 * Is called when all assets are loaded
 * @abstract
 */
Game.prototype.init = function() {};

/**
 * Runs before loading assets. Can be used for configuring Potion and settings assets loader
 * @abstract
 */
Game.prototype.configure = function() {};

/**
 * Runs every frame for rendering the game
 * @abstract
 */
Game.prototype.render = function() {};

/**
 * Runs every frame for updating the game
 * limits time to value set in config.maxStepTime
 * @param {number} time - time in seconds since last frame
 * @abstract
 */
Game.prototype.update = function(time) {};

/**
 * Runs every frame after update method, but it doesn't limit time
 * @param {number} time - time in seconds since last frame
 * @abstract
 */
Game.prototype.exitUpdate = function(time) {};

Game.prototype.setSize = function(width, height) {
  this.width = width;
  this.height = height;

  if (this.video) {
    this.video.setSize(width, height);
  }

  if (this.states) {
    this.states.resize();
  }
};

/**
 * Runs every frame in the loading phase. It's used for rendering the loading bar
 * @param {number} time - time in seconds since last frame
 */
Game.prototype.preloading = function(time) {
  if (!this.config.showPreloader && !(this.video && this.video.ctx)) { return; }

  if (this.video.ctx) {
    if (this._preloaderWidth === undefined) { this._preloaderWidth = 0; }

    var width = Math.min(this.width * 2/3, 300);
    var height = 20;

    var y = (this.height - height) / 2;
    var x = (this.width - width) / 2;

    var currentWidth = width * this.assets.progress;
    this._preloaderWidth = this._preloaderWidth + (currentWidth - this._preloaderWidth) * time * 10;

    this.video.ctx.save();

    this.video.ctx.fillStyle = '#a9c848';
    this.video.ctx.fillRect(0, 0, this.width, this.height);

    this.video.ctx.fillStyle = '#88a237';
    this.video.ctx.fillRect(x, y, width, height);

    this.video.ctx.fillStyle = '#f6ffda';
    this.video.ctx.fillRect(x, y, this._preloaderWidth, height);

    this.video.ctx.restore();
  }
};

/**
 * Window Focus event
 * @abstract
 */
Game.prototype.focus = function() {};

/**
 * Window Blur event
 * @abstract
 */
Game.prototype.blur = function() {};

/**
 * Click event
 * @param {number} x - x position
 * @param {number} y - y position
 * @param {number} button - number of button which is pressed
 * @abstract
 */
Game.prototype.click = function() {};

/**
 * Mousemove event
 * @param {number} x - x position
 * @param {number} y - y position
 * @abstract
 */
Game.prototype.mousemove = function(x, y) {};

/**
 * Mousedown event
 * @param {number} x - x position
 * @param {number} y - y position
 * @param {number} button - number of button which is pressed
 * @abstract
 */
Game.prototype.mousedown = function() {};

/**
 * Mouseup event
 * @param {number} x - x position
 * @param {number} y - y position
 * @param {number} button - number of button which is pressed
 * @abstract
 */
Game.prototype.mouseup = function() {};

/**
 * Keydown event
 * @param {number} key - keyCode for pressed key
 * @param {object} e - event object
 * @abstract
 */
Game.prototype.keydown = function() {};


/**
 * Keyup event
 * @param {number} key - keyCode for pressed key
 * @param {object} e - event object
 * @abstract
 */
Game.prototype.keyup = function() {};

/**
 * Window resize event
 * @abstract
 */
Game.prototype.resize = function() {};

module.exports = Game;
