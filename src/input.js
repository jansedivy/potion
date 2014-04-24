var keys = require('./keys');

/**
 * Input wrapper
 * @constructor
 * @param {Game} game - Game object
 */
var Input = function(game) {
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

  this._addEvents(game);
};

/**
 * Clears the pressed keys object
 */
Input.prototype.resetKeys = function() {
  this.keys = {};
};

/**
 * Return true or false if key is pressed
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
Input.prototype._addEvents = function(game) {
  var self = this;
  var canvas = game.canvas;

  canvas.addEventListener('mousemove', function(e) {
    game.mousemove(e.offsetX, e.offsetY);
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

  document.addEventListener('keydown', function(e) {
    game.input.keys[e.keyCode] = true;
  });

  document.addEventListener('keyup', function(e) {
    game.input.keys[e.keyCode] = false;
  });

  if (game.keypress) {
    document.addEventListener('keypress', function(e) {
      game.keypress(e.keyCode);
    });
  }

  if (game.click) {
    canvas.addEventListener('click', function(e) {
      game.click(e.offsetX, e.offsetY);
    });
  }
};

module.exports = Input;
