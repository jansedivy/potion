var Video = require('./video');
var Input = require('./input');
var SpriteSheetManager = require('./spriteSheetManager');
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
   * Sprites to load
   * @type {object}
   */
  this.load = {};

  /**
   * Instance of SpriteSheetManager for managing sprites and images
   * @type {SpriteSheetManager}
   */
  this.sprite = new SpriteSheetManager();

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

  /**
   * If set to true potion will profile game methods, works only in dev version of potion
   * @type {boolean}
   */
  this.useProfiler = false;

  this.config();
};

/**
 * Is called when all assets are loaded
 * @abstract
 */
Game.prototype.start = function() {};

/**
 * Configure the game
 * @abstract
 */
Game.prototype.config = function() {};

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
 * Keypress event
 * @param {number} keycode - char code of the pressed key
 * @abstract
 */
Game.prototype.keypress = function(keycode) {};

/**
 * Click event
 * @param {number} x - x position
 * @param {number} y - y position
 * @abstract
 */
Game.prototype.click = function(x, y) {};

/**
 * Mousemove event
 * @param {number} x - x position
 * @param {number} y - y position
 * @abstract
 */
Game.prototype.mousemove = function(x, y) {};

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

module.exports = Game;
