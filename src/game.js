var Input = require('./input');

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
   * Game heighs in pixels
   * @type {number}
   */
  this.height = 300;

  /**
   * Sprites to load
   * @type {object}
   */
  this.load = {};

  /**
   * Input instance for mouse and keyboard events
   * @type {Input}
   */
  this.input = new Input(this);
};

/**
 * Configure the game
 */
Game.prototype.config = function() {};

/**
 * Window resize event
 */
Game.prototype.resize = function() {};

/**
 * Renders the game
 */
Game.prototype.render = function() {};

/**
 * Updates the game
 * @param {number} time - time in seconds since last frame
 */
Game.prototype.update = function() {};

/**
 * Keypress event
 * @param {number} keycode - char code of the pressed key
 */
Game.prototype.keypress = function(keycode) {};

/**
 * Click event
 * @param {number} x - x position
 * @param {number} y - y position
 */
Game.prototype.click = function(x, y) {};

/**
 * Mousemove event
 * @param {number} x - x position
 * @param {number} y - y position
 */
Game.prototype.mousemove = function(x, y) {};

/**
 * Window Focus event
 */
Game.prototype.focus = function() {};

/**
 * Window Blur event
 */
Game.prototype.blur = function() {};

module.exports = Game;
