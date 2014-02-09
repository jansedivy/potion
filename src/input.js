var keys = require('./keys');

/**
 * Input wrapper
 * @constructor
 * @param {Game} game - Game object
 */
var Input = function(game) {
  /**
   * Game object
   * @type {Game}
   */
  this.game = game;

  /**
   * Pressed keys object
   * @type {object}
   */
  this.keys = {};

  /**
   * Controls if you can press keys
   * @type {boolean}
   */
  this.canControlKeys = true;

  /**
   * Mouse object with positions and if is mouse button pressed
   * @type {object}
   */
  this.mouse = {
    isDown: false,
    position: { x: null, y: null }
  };

  this._addEvents();
};

/**
 * Clears the pressed keys object
 */
Input.prototype.resetKeys = function() {
  this.keys = {};
};

/**
 * Return true or false is key is pressed
 * @param {string} key
 * @return {boolean}
 */
Input.prototype.isKeyDown = function(key) {
  if (this.canControlKeys) {
    return this.keys[keys[key.toUpperCase()]];
  }
};

/**
 * Add canvas event listener
 * @private
 */
Input.prototype._addEvents = function() {
  var self = this;
  var canvas = this.game.canvas;

  canvas.addEventListener('mousemove', function(e) {
    self.game.mousemove(e.offsetX, e.offsetY);
    self.mouse.position.x = e.offsetX;
    self.mouse.position.y = e.offsetY;
  });

  canvas.addEventListener('mouseup', function() {
    self.mouse.isDown = false;
  });

  canvas.addEventListener('mousedown', function(e) {
    self.mouse.position.x = e.offsetX;
    self.mouse.position.y = e.offsetY;
    self.mouse.isDown = true;
  });

  canvas.addEventListener('click', function(e) {
    self.game.click(e.offsetX, e.offsetY);
  });

  document.addEventListener('keypress', function(e) {
    self.game.keypress(e.keyCode);
  });

  document.addEventListener('keydown', function(e) {
    self.game.input.keys[e.keyCode] = true;
  });

  document.addEventListener('keyup', function(e) {
    self.game.input.keys[e.keyCode] = false;
  });
};

module.exports = Input;
