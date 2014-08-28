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
    button: null,
    x: null,
    y: null
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
  if (key == null) { return false; }

  if (this.canControlKeys) {
    var code = typeof key === 'number' ? key : keys[key.toUpperCase()];
    return this.keys[code];
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

    game.mousemove(x, y, e);
    self.mouse.x = x;
    self.mouse.y = y;
  });

  canvas.addEventListener('click', function(e) {
    e.preventDefault();

    var x = e.offsetX === undefined ? e.layerX - canvas.offsetLeft : e.offsetX;
    var y = e.offsetY === undefined ? e.layerY - canvas.offsetTop : e.offsetY;

    game.click(x, y, e.button);
    game.states.click(x, y, e.button);
  });

  canvas.addEventListener('mouseup', function(e) {
    e.preventDefault();

    var x = e.offsetX === undefined ? e.layerX - canvas.offsetLeft : e.offsetX;
    var y = e.offsetY === undefined ? e.layerY - canvas.offsetTop : e.offsetY;

    self.mouse.button = e.button;
    self.mouse.isDown = false;

    game.mouseup(x, y, e.button);
    game.states.mouseup(x, y, e.button);
  }, false);

  canvas.addEventListener('mousedown', function(e) {
    e.preventDefault();

    var x = e.offsetX === undefined ? e.layerX - canvas.offsetLeft : e.offsetX;
    var y = e.offsetY === undefined ? e.layerY - canvas.offsetTop : e.offsetY;

    self.mouse.x = x;
    self.mouse.y = y;
    self.mouse.button = e.button;
    self.mouse.isDown = true;

    game.mousedown(x, y, e.button);
    game.states.mousedown(x, y, e.button);
  }, false);

  var touchX = null;
  var touchY = null;

  canvas.addEventListener('touchstart', function(e) {
    var x = e.layerX;
    var y = e.layerY;

    touchX = x;
    touchY = y;

    self.mouse.x = x;
    self.mouse.y = y;
    self.mouse.isDown = true;
  });

  canvas.addEventListener('touchmove', function(e) {
    e.preventDefault();

    var x = e.layerX;
    var y = e.layerY;

    game.mousemove(x, y);

    self.mouse.x = x;
    self.mouse.y = y;
  });

  canvas.addEventListener('touchend', function(e) {
    e.preventDefault();

    self.mouse.isDown = false;

    for (var i=0, len=e.changedTouches.length; i<len; i++) {
      var touch = e.changedTouches[i];

      var x = touch.pageX - canvas.offsetLeft;
      var y = touch.pageY - canvas.offsetTop;
      var button = 0;

      var dx = Math.abs(touchX - x);
      var dy = Math.abs(touchY - y);

      var threshold = 5;

      if (dx < threshold && dy < threshold) {
        self.mouse.x = x;
        self.mouse.y = y;

        game.click(x, y, button);
        game.states.click(x, y, button);
      }
    }
  });

  canvas.addEventListener('contextmenu', function(e) {
    e.preventDefault();
  });

  document.addEventListener('keydown', function(e) {
    game.input.keys[e.keyCode] = true;
    game.keydown(e.which, e);
    game.states.keydown(e.which, e);
  });

  document.addEventListener('keyup', function(e) {
    game.input.keys[e.keyCode] = false;
    game.keyup(e.which, e);
    game.states.keyup(e.which, e);
  });

  document.addEventListener('keypress', function(e) {
    if (game.keypress) { game.keypress(e.which, e); }
    game.states.keypress(e.which, e);
  });
};

module.exports = Input;
