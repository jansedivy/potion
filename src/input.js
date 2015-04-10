var keys = require('./keys');

var invKeys = {};
for (var keyName in keys) {
  invKeys[keys[keyName]] = keyName;
}

var Input = function(game, container) {
  this._container = container;
  this._keys = {};

  this.canControlKeys = true;

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

Input.prototype.resetKeys = function() {
  this._keys = {};
};

Input.prototype.isKeyDown = function(key) {
  if (key == null) { return false; }

  if (this.canControlKeys) {
    var code = typeof key === 'number' ? key : keys[key.toLowerCase()];
    return this._keys[code];
  }
};

Input.prototype._addEvents = function(game) {
  var self = this;

  var mouseEvent = {
    x: null,
    y: null,
    button: null,
    event: null
  };

  var keyboardEvent = {
    key: null,
    name: null,
    event: null
  };

  self._container.addEventListener('mousemove', function(e) {
    var x = e.offsetX === undefined ? e.layerX - self._container.offsetLeft : e.offsetX;
    var y = e.offsetY === undefined ? e.layerY - self._container.offsetTop : e.offsetY;

    self.mouse.x = x;
    self.mouse.y = y;

    mouseEvent.x = x;
    mouseEvent.y = y;
    mouseEvent.button = null;
    mouseEvent.event = e;

    game.states.mousemove(mouseEvent);
  });

  self._container.addEventListener('mouseup', function(e) {
    e.preventDefault();

    var x = e.offsetX === undefined ? e.layerX - self._container.offsetLeft : e.offsetX;
    var y = e.offsetY === undefined ? e.layerY - self._container.offsetTop : e.offsetY;

    self.mouse.isDown = false;
    self.mouse.button = e.button;

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

    mouseEvent.x = x;
    mouseEvent.y = y;
    mouseEvent.button = e.button;
    mouseEvent.event = e;

    game.states.mouseup(mouseEvent);
  }, false);

  self._container.addEventListener('mousedown', function(e) {
    e.preventDefault();

    var x = e.offsetX === undefined ? e.layerX - self._container.offsetLeft : e.offsetX;
    var y = e.offsetY === undefined ? e.layerY - self._container.offsetTop : e.offsetY;

    self.mouse.x = x;
    self.mouse.y = y;
    self.mouse.isDown = true;
    self.mouse.button = e.button;

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

    mouseEvent.x = x;
    mouseEvent.y = y;
    mouseEvent.button = e.button;
    mouseEvent.event = e;

    game.states.mousedown(mouseEvent);
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
      self.mouse.isLeftDown = true;

      mouseEvent.x = x;
      mouseEvent.y = y;
      mouseEvent.button = 1;
      mouseEvent.event = e;

      game.states.mousedown(e);
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
      self.mouse.isLeftDown = true;

      mouseEvent.x = x;
      mouseEvent.y = y;
      mouseEvent.event = e;

      game.states.mousemove(e);
    }
  });

  self._container.addEventListener('touchend', function(e) {
    e.preventDefault();

    var touch = e.changedTouches[0];

    var x = touch.pageX - self._container.offsetLeft;
    var y = touch.pageY - self._container.offsetTop;

    self.mouse.x = x;
    self.mouse.y = y;
    self.mouse.isDown = false;
    self.mouse.isLeftDown = false;

    mouseEvent.x = x;
    mouseEvent.y = y;
    mouseEvent.event = e;

    game.states.mouseup(e);
  });

  self._container.addEventListener('contextmenu', function(e) {
    e.preventDefault();
  });

  document.addEventListener('keydown', function(e) {
    self._keys[e.keyCode] = true;

    keyboardEvent.key = e.which;
    keyboardEvent.name = invKeys[e.which];
    keyboardEvent.event = e;

    game.states.keydown(keyboardEvent);
  });

  document.addEventListener('keyup', function(e) {
    self._keys[e.keyCode] = false;

    keyboardEvent.key = e.which;
    keyboardEvent.name = invKeys[e.which];
    keyboardEvent.event = e;

    game.states.keyup(keyboardEvent);
  });
};

module.exports = Input;
