var keys = require('./keys');

/**
 * Input wrapper
 * @constructor
 * @param {Game} game - Game object
 */
var Input = function(game, container) {
  this._container = container;
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
    isLeftDown: false,
    isMiddleDown: false,
    isRightDown: false,
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

  self._container.addEventListener('mousemove', function(e) {
    var x = e.offsetX === undefined ? e.layerX - self._container.offsetLeft : e.offsetX;
    var y = e.offsetY === undefined ? e.layerY - self._container.offsetTop : e.offsetY;

    game.states.mousemove(x, y, e);
    self.mouse.x = x;
    self.mouse.y = y;
  });

  self._container.addEventListener('mouseup', function(e) {
    e.preventDefault();

    var x = e.offsetX === undefined ? e.layerX - self._container.offsetLeft : e.offsetX;
    var y = e.offsetY === undefined ? e.layerY - self._container.offsetTop : e.offsetY;

    self.mouse.isDown = false;

    switch (e.button) {
      case 0:
        self.mouse.isLeftDown = false;
      break;
      case 1:
        self.mouse.isMiddleDown = false;
        break;
      case 2:
        self.mouse.isRightDown = false;
        break;
    }

    game.states.mouseup(x, y, e.button);
  }, false);

  self._container.addEventListener('mousedown', function(e) {
    e.preventDefault();

    var x = e.offsetX === undefined ? e.layerX - self._container.offsetLeft : e.offsetX;
    var y = e.offsetY === undefined ? e.layerY - self._container.offsetTop : e.offsetY;

    self.mouse.x = x;
    self.mouse.y = y;
    self.mouse.isDown = true;

    switch (e.button) {
      case 0:
        self.mouse.isLeftDown = true;
      break;
      case 1:
        self.mouse.isMiddleDown = true;
        break;
      case 2:
        self.mouse.isRightDown = true;
        break;
    }

    game.states.mousedown(x, y, e.button);
  }, false);

  self._container.addEventListener('touchstart', function(e) {
    e.preventDefault();

    for (var i=0; i<e.touches.length; i++) {
      var touch = e.touches[i];

      var x = touch.pageX - self._container.offsetLeft;
      var y = touch.pageY - self._container.offsetTop;

      self.mouse.x = x;
      self.mouse.y = y;
      self.mouse.isDown = true;

      game.states.mousedown(x, y, 1);
    }
  });

  self._container.addEventListener('touchmove', function(e) {
    e.preventDefault();

    for (var i=0; i<e.touches.length; i++) {
      var touch = e.touches[i];

      var x = touch.pageX - self._container.offsetLeft;
      var y = touch.pageY - self._container.offsetTop;

      self.mouse.x = x;
      self.mouse.y = y;
      self.mouse.isDown = true;

      game.states.mousemove(x, y);
    }
  });

  self._container.addEventListener('touchend', function(e) {
    e.preventDefault();

    var touch = e.changedTouches[0];

    var x = touch.pageX - self._container.offsetLeft;
    var y = touch.pageY - self._container.offsetTop;

    self.mouse.x = x;
    self.mouse.y = y;
    self.mouse.isDown = true;

    game.states.mouseup(x, y, 1);
  });

  self._container.addEventListener('contextmenu', function(e) {
    e.preventDefault();
  });

  document.addEventListener('keydown', function(e) {
    game.input.keys[e.keyCode] = true;
    game.states.keydown(e.which, e);
  });

  document.addEventListener('keyup', function(e) {
    game.input.keys[e.keyCode] = false;
    game.states.keyup(e.which, e);
  });
};

module.exports = Input;
