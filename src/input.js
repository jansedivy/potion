var keys = require('./keys');

var invKeys = {};
for (var keyName in keys) {
  invKeys[keys[keyName]] = keyName;
}

var Input = function(app) {
  this._container = app.container;
  this._keys = {};

  this.canControlKeys = true;

  this.mouse = {
    isDown: false,
    isLeftDown: false,
    isMiddleDown: false,
    isRightDown: false,
    x: null,
    y: null,
    dx: 0,
    dy: 0
  };

  this._addEvents(app);
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

Input.prototype._addEvents = function(app) {
  var self = this;

  var mouseEvent = {
    x: null,
    y: null,
    button: null,
    isTouch: false,
    event: null,
    stateStopEvent: function() {
      app.states._preventEvent = true;
    }
  };

  var keyboardEvent = {
    key: null,
    name: null,
    event: null,
    stateStopEvent: function() {
      app.states._preventEvent = true;
    }
  };

  self._container.addEventListener('mousemove', function(e) {
    var x = e.offsetX === undefined ? e.layerX - self._container.offsetLeft : e.offsetX;
    var y = e.offsetY === undefined ? e.layerY - self._container.offsetTop : e.offsetY;

    if (self.mouse.x != null && self.mouse.x != null) {
      self.mouse.dx = x - self.mouse.x;
      self.mouse.dy = y - self.mouse.y;
    }

    self.mouse.x = x;
    self.mouse.y = y;
    self.mouse.isActive = true;

    mouseEvent.x = x;
    mouseEvent.y = y;
    mouseEvent.button = null;
    mouseEvent.event = e;
    mouseEvent.isTouch = false;

    app.states.mousemove(mouseEvent);
  });

  self._container.addEventListener('mouseup', function(e) {
    e.preventDefault();

    var x = e.offsetX === undefined ? e.layerX - self._container.offsetLeft : e.offsetX;
    var y = e.offsetY === undefined ? e.layerY - self._container.offsetTop : e.offsetY;

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

    self.mouse.isDown = self.mouse.isLeftDown || self.mouse.isRightDown || self.mouse.isMiddleDown;

    mouseEvent.x = x;
    mouseEvent.y = y;
    mouseEvent.button = e.button;
    mouseEvent.event = e;
    mouseEvent.isTouch = false;

    app.states.mouseup(mouseEvent);
  }, false);

  self._container.addEventListener('mouseleave', function() {
    self.mouse.isActive = false;

    self.mouse.isDown = false;
    self.mouse.isLeftDown = false;
    self.mouse.isRightDown = false;
    self.mouse.isMiddleDown = false;
  });

  self._container.addEventListener('mouseenter', function() {
    self.mouse.isActive = true;
  });

  self._container.addEventListener('mousedown', function(e) {
    e.preventDefault();

    var x = e.offsetX === undefined ? e.layerX - self._container.offsetLeft : e.offsetX;
    var y = e.offsetY === undefined ? e.layerY - self._container.offsetTop : e.offsetY;

    self.mouse.x = x;
    self.mouse.y = y;
    self.mouse.isDown = true;
    self.mouse.isActive = true;

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
    mouseEvent.isTouch = false;

    app.states.mousedown(mouseEvent);
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
      self.mouse.isActive = true;

      mouseEvent.x = x;
      mouseEvent.y = y;
      mouseEvent.button = 1;
      mouseEvent.event = e;
      mouseEvent.isTouch = true;

      app.states.mousedown(mouseEvent);
    }
  });

  self._container.addEventListener('touchmove', function(e) {
    e.preventDefault();

    for (var i=0; i<e.touches.length; i++) {
      var touch = e.touches[i];

      var x = touch.pageX - self._container.offsetLeft;
      var y = touch.pageY - self._container.offsetTop;

      if (self.mouse.x != null && self.mouse.x != null) {
        self.mouse.dx = x - self.mouse.x;
        self.mouse.dy = y - self.mouse.y;
      }

      self.mouse.x = x;
      self.mouse.y = y;
      self.mouse.isDown = true;
      self.mouse.isLeftDown = true;
      self.mouse.isActive = true;

      mouseEvent.x = x;
      mouseEvent.y = y;
      mouseEvent.event = e;
      mouseEvent.isTouch = true;

      app.states.mousemove(mouseEvent);
    }
  });

  self._container.addEventListener('touchend', function(e) {
    e.preventDefault();

    var touch = e.changedTouches[0];

    var x = touch.pageX - self._container.offsetLeft;
    var y = touch.pageY - self._container.offsetTop;

    self.mouse.x = x;
    self.mouse.y = y;
    self.mouse.isActive = false;
    self.mouse.isDown = false;
    self.mouse.isLeftDown = false;
    self.mouse.isRightDown = false;
    self.mouse.isMiddleDown = false;

    mouseEvent.x = x;
    mouseEvent.y = y;
    mouseEvent.event = e;
    mouseEvent.isTouch = true;

    app.states.mouseup(mouseEvent);
  });

  self._container.addEventListener('contextmenu', function(e) {
    e.preventDefault();
  });

  document.addEventListener('keydown', function(e) {
    self._keys[e.keyCode] = true;

    keyboardEvent.key = e.which;
    keyboardEvent.name = invKeys[e.which];
    keyboardEvent.event = e;

    app.states.keydown(keyboardEvent);
  });

  document.addEventListener('keyup', function(e) {
    self._keys[e.keyCode] = false;

    keyboardEvent.key = e.which;
    keyboardEvent.name = invKeys[e.which];
    keyboardEvent.event = e;

    app.states.keyup(keyboardEvent);
  });
};

module.exports = Input;
