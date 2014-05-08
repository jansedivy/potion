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
    var x = e.offsetX === undefined ? e.layerX - canvas.offsetLeft : e.offsetX;
    var y = e.offsetY === undefined ? e.layerY - canvas.offsetTop : e.offsetY;

    game.mousemove(x, y);
    self.mouse.position.x = x;
    self.mouse.position.y = y;
  });

  canvas.addEventListener('mouseup', function(e) {
    self.mouse.isDown = false;
    e.preventDefault();
    game.mouseup(e.x, e.y);
  }, false);

  canvas.addEventListener('mousedown', function(e) {
    e.preventDefault();

    var x = e.offsetX === undefined ? e.layerX - canvas.offsetLeft : e.offsetX;
    var y = e.offsetY === undefined ? e.layerY - canvas.offsetTop : e.offsetY;

    self.mouse.position.x = x;
    self.mouse.position.y = y;
    self.mouse.isDown = true;

    game.click(x, y, e.button);
  }, false);

  canvas.addEventListener('contextmenu', function(e) {
    e.preventDefault();
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
};

module.exports = Input;
