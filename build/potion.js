/**
 * potion - v0.2.4
 * Copyright (c) 2014, Jan Sedivy
 *
 * Compiled: 2014-04-21
 *
 * potion is licensed under the MIT License.
 */
!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var o;"undefined"!=typeof window?o=window:"undefined"!=typeof global?o=global:"undefined"!=typeof self&&(o=self),o.Potion=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
var Engine = _dereq_('./src/engine');

module.exports = {
  init: function(canvas, methods) {
    var engine = new Engine(canvas, methods);
    return engine.game;
  }
};

},{"./src/engine":4}],2:[function(_dereq_,module,exports){
/**
 * Animation class for rendering sprites in grid
 * @constructor
 * @param {object} sprite - sprite object
 * @param {number} width - width of individual images in animation
 * @param {number} height - height of individual images in animation
 * @param {number} [columns=null] - optional number of columns in animation
 */
var Animation = function(sprite, width, height, columns) {
  /**
   * @type object
   */
  this.sprite = sprite;

  /**
   * width of individual images in animation
   * @type {number}
   */
  this.width = width;

  /**
   * height of individual images in animation
   * @type {number}
   */
  this.height = height;

  /**
   * number of columns in animation
   * @type {number}
   */
  this.columns = columns;

  /**
   * Current index of image
   * @type {number}
   */
  this.state = 0;

  /**
   * Current X index
   * @type {number}
   */
  this.indexX = 0;

  /**
   * Current Y index
   * @type {number}
   */
  this.indexY = 0;

  /**
   * Image offset X
   * @type {number}
   */
  this.offsetX = 0;

  /**
   * Image offset Y
   * @type {number}
   */
  this.offsetY = 0;
};

/**
 * Set x and y index
 * @param {number} x - x index
 * @param {number} y - y index
 */
Animation.prototype.setIndexes = function(x, y) {
  this.setIndexX(x);
  this.setIndexY(y);
};

/**
 * Set x index
 * @param {number} x - x index
 */
Animation.prototype.setIndexX = function(x) {
  this.indexX = x;
  this.offsetX = this.width * this.indexX;
};

/**
 * Set y index
 * @param {number} y - y index
 */
Animation.prototype.setIndexY = function(y) {
  this.indexY = y;
  this.offsetY = this.height * this.indexY;
};

/**
 * Set image index
 * @param {number} state - image index
 */
Animation.prototype.setState = function(state) {
  this.state = state;

  var x = this.state;
  var y = 0;

  if (this.columns) {
    x = this.state % this.columns;
    y = Math.floor(this.state/this.columns);
  }

  this.setIndexX(x);
  this.setIndexY(y);
};

module.exports = Animation;

},{}],3:[function(_dereq_,module,exports){
var utils = _dereq_('./utils');

/**
 * Class for assets loading
 * @constructor
 */
var Assets = function() {
  this.thingsToLoad = 0;
  this._data = {};
};

Assets.prototype.onload = function(callback) {
  this.callback = callback;
  if (this.thingsToLoad === 0) {
    setTimeout(callback, 0);
  }
};

Assets.prototype.get = function(name) {
  return this._data[name];
};

Assets.prototype._handleCustomLoading = function(loading) {
  var self = this;
  var done = function(name, value) {
    self._save(name, value);
  };
  loading(done);
};

Assets.prototype.load = function(type, url, callback) {
  var self = this;
  this.thingsToLoad += 1;

  if (utils.isFunction(type)) {
    this._handleCustomLoading(type);
    return;
  }

  type = type.toLowerCase();

  var request = new XMLHttpRequest();

  switch (type) {
    case 'json':
      request.open('GET', url, true);
      request.responseType = 'text';
      request.onload = function() {
        var data = JSON.parse(this.response);
        self._save(url, data, callback);
      };
      request.send();
      break;
    case 'image':
    case 'texture':
    case 'sprite':
      var image = new Image();
      image.onload = function() {
        self._save(url, image, callback);
      };
      image.src = url;
      break;
    default: // text files
      request.open('GET', url, true);
      request.responseType = 'text';
      request.onload = function() {
        var data = this.response;
        self._save(url, data, callback);
      };
      request.send();
      break;
  }
};

Assets.prototype._save = function(url, data, callback) {
  this._data[url] = data;
  if (callback) { callback(data); }
  this.finishedOneFile();
};

Assets.prototype.finishedOneFile = function() {
  this.thingsToLoad -= 1;
  if (this.thingsToLoad === 0) {
    this.callback();
  }
};

module.exports = Assets;

},{"./utils":10}],4:[function(_dereq_,module,exports){
var Game = _dereq_('./game');

var raf = _dereq_('./raf');

/**
 * Main Engine class which calls the game methods
 * @constructor
 */
var Engine = function(canvas, methods) {
  var GameClass = function(canvas) { Game.call(this, canvas); };
  GameClass.prototype = Object.create(Game.prototype);
  for (var method in methods) {
    GameClass.prototype[method] = methods[method];
  }

  /**
   * Game code instance
   * @type {Game}
   */
  this.game = new GameClass(canvas);

  this.setupCanvasSize();

  this.game.assets.onload(function() {
    this.start();
  }.bind(this));
};

/**
 * Add event listener for window events
 * @private
 */
Engine.prototype.addEvents = function() {
  var self = this;

  window.addEventListener('resize', function() {
    self.setupCanvasSize();
  });

  window.addEventListener('blur', function() {
    self.game.input.resetKeys();
    self.game.blur();
  });

  window.addEventListener('focus', function() {
    self.game.input.resetKeys();
    self.game.focus();
  });
};

/**
 * Runs every time on resize event
 * @private
 */
Engine.prototype.setupCanvasSize = function() {
  this.game.resize();
  this.game.video.width = this.game.canvas.width = this.game.width;
  this.game.video.height = this.game.canvas.height = this.game.height;

  if (this.game.isRetina) {
    this.game.video.scaleCanvas(2);
  }
};

/**
 * Starts the game, adds events and run first frame
 * @private
 */
Engine.prototype.start = function() {
  this.start = true;
  this.game.init();
  this.addEvents();
  this.startFrame();
};

/**
 * Starts next frame in game loop
 * @private
 */
Engine.prototype.startFrame = function() {
  this._time = Date.now();
  var self = this;
  raf(function() { self.tick(); });
};

/**
 * Main tick function in game loop
 * @private
 */
Engine.prototype.tick = function() {
  var time = (Date.now() - this._time) / 1000;
  if (time > 0.016) { time = 0.016; }

  this.update(time);
  this.render();

  this.startFrame();
};

/**
 * Updates the game
 * @param {number} time - time in seconds since last frame
 * @private
 */
Engine.prototype.update = function(time) {
  this.game.update(time);
};

/**
 * Renders the game
 * @private
 */
Engine.prototype.render = function() {
  this.game.video.beginFrame();
  this.game.render();
  this.game.video.endFrame();
};

module.exports = Engine;

},{"./game":5,"./raf":8}],5:[function(_dereq_,module,exports){
var Video = _dereq_('./video');
var Input = _dereq_('./input');
var Assets = _dereq_('./assets');
var isRetina = _dereq_('./retina');
var Animation = _dereq_('./animation');

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
   * Instance of Assets for loading assets for the game
   * @type {Assets}
   */
  this.assets = new Assets();

  this.animation = Animation;

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

  this.config();
};

/**
 * Is called when all assets are loaded
 * @abstract
 */
Game.prototype.init = function() {};

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

},{"./animation":2,"./assets":3,"./input":6,"./retina":9,"./video":11}],6:[function(_dereq_,module,exports){
var keys = _dereq_('./keys');

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

  canvas.addEventListener('click', function(e) {
    game.click(e.offsetX, e.offsetY);
  });

  document.addEventListener('keypress', function(e) {
    game.keypress(e.keyCode);
  });

  document.addEventListener('keydown', function(e) {
    game.input.keys[e.keyCode] = true;
  });

  document.addEventListener('keyup', function(e) {
    game.input.keys[e.keyCode] = false;
  });
};

module.exports = Input;

},{"./keys":7}],7:[function(_dereq_,module,exports){
module.exports = {
  'MOUSE1':-1,
  'MOUSE2':-3,
  'MWHEEL_UP':-4,
  'MWHEEL_DOWN':-5,
  'BACKSPACE':8,
  'TAB':9,
  'ENTER':13,
  'PAUSE':19,
  'CAPS':20,
  'ESC':27,
  'SPACE':32,
  'PAGE_UP':33,
  'PAGE_DOWN':34,
  'END':35,
  'HOME':36,
  'LEFT':37,
  'UP':38,
  'RIGHT':39,
  'DOWN':40,
  'INSERT':45,
  'DELETE':46,
  '_0':48,
  '_1':49,
  '_2':50,
  '_3':51,
  '_4':52,
  '_5':53,
  '_6':54,
  '_7':55,
  '_8':56,
  '_9':57,
  'A':65,
  'B':66,
  'C':67,
  'D':68,
  'E':69,
  'F':70,
  'G':71,
  'H':72,
  'I':73,
  'J':74,
  'K':75,
  'L':76,
  'M':77,
  'N':78,
  'O':79,
  'P':80,
  'Q':81,
  'R':82,
  'S':83,
  'T':84,
  'U':85,
  'V':86,
  'W':87,
  'X':88,
  'Y':89,
  'Z':90,
  'NUMPAD_0':96,
  'NUMPAD_1':97,
  'NUMPAD_2':98,
  'NUMPAD_3':99,
  'NUMPAD_4':100,
  'NUMPAD_5':101,
  'NUMPAD_6':102,
  'NUMPAD_7':103,
  'NUMPAD_8':104,
  'NUMPAD_9':105,
  'MULTIPLY':106,
  'ADD':107,
  'SUBSTRACT':109,
  'DECIMAL':110,
  'DIVIDE':111,
  'F1':112,
  'F2':113,
  'F3':114,
  'F4':115,
  'F5':116,
  'F6':117,
  'F7':118,
  'F8':119,
  'F9':120,
  'F10':121,
  'F11':122,
  'F12':123,
  'SHIFT':16,
  'CTRL':17,
  'ALT':18,
  'PLUS':187,
  'COMMA':188,
  'MINUS':189,
  'PERIOD':190
};

},{}],8:[function(_dereq_,module,exports){
module.exports = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

},{}],9:[function(_dereq_,module,exports){
var isRetina = function() {
  var mediaQuery = "(-webkit-min-device-pixel-ratio: 1.5),\
  (min--moz-device-pixel-ratio: 1.5),\
  (-o-min-device-pixel-ratio: 3/2),\
  (min-resolution: 1.5dppx)";

  if (window.devicePixelRatio > 1)
    return true;

  if (window.matchMedia && window.matchMedia(mediaQuery).matches)
    return true;

  return false;
};

module.exports = isRetina;

},{}],10:[function(_dereq_,module,exports){
var get = exports.get = function(url, callback) {
  var request = new XMLHttpRequest();
  request.open('GET', url, true);

  request.onload = function() {
    callback(this.response);
  };

  request.send();
};

var getJSON = exports.getJSON = function(url, callback) {
  get(url, function(text) {
    callback(JSON.parse(text));
  });
};

exports.isFunction = function(obj) {
  return !!(obj && obj.constructor && obj.call && obj.apply);
};


},{}],11:[function(_dereq_,module,exports){
/**
 * @constructor
 * @param {HTMLCanvasElement} canvas - Canvas DOM element
 */
var Video = function(canvas) {
  /**
   * Canvas DOM element
   * @type {HTMLCanvasElement}
   */
  this.canvas = canvas;

  /**
   * Game width in pixels
   * @type {number}
   */
  this.width = null;

  /**
   * Game height in pixels
   * @type {number}
   */
  this.height = null;

  /**
   * canvas context
   * @type {CanvasRenderingContext2D}
   */
  this.ctx = canvas.getContext('2d');
};

/**
 * Includes mixins into Video library
 * @param {object} methods - object of methods that will included in Video
 */
Video.prototype.include = function(methods) {
  for (var method in methods) {
    this[method] = methods[method];
  }
};

Video.prototype.beginFrame = function() {
  this.ctx.clearRect(0, 0, this.width, this.height);
};

Video.prototype.endFrame = function() {};

/**
 * Scale canvas buffer, used for retina screens
 * @param {number} scale
 */
Video.prototype.scaleCanvas = function(scale) {
  this.canvas.style.width = this.canvas.width + 'px';
  this.canvas.style.height = this.canvas.height + 'px';

  this.canvas.width *= scale;
  this.canvas.height *= scale;

  this.scale(scale);
};

/**
 * Canvas helper for scaling
 * @param {number} scale
 */
Video.prototype.scale = function(scale) {
  this.ctx.scale(scale, scale);
};

/**
 * Draws image sprite into x a y position
 * @param {object} sprite - sprite data
 * @param {number} x - x position
 * @param {number} y - y position
 * @param {number} [offsetX] - image position offset x
 * @param {number} [offsetY] - image position offset y
 * @param {number} [w] - final rendering width
 * @param {number} [h] - final rendering height
 */
Video.prototype.sprite = function(image, x, y, offsetX, offsetY, w, h) {
  offsetX = offsetX || 0;
  offsetY = offsetY || 0;

  w = w || image.width;
  h = h || image.height;

  x = Math.floor(x);
  y = Math.floor(y);

  var drawWidth = w;
  var drawHeight = h;

  if (image.src.match(/@2x.png$/)) {
    drawWidth /= 2;
    drawHeight /= 2;
  }

  this.ctx.drawImage(image, image.x + offsetX, image.y + offsetY, w, h, x, y, drawWidth, drawHeight);
};

/**
 * Draw animatino at given location
 * @param {Animation} animation - Animation object
 * @param {number} x - x position
 * @param {number} y - y position
 */
Video.prototype.animation = function(animation, x, y) {
  this.sprite(animation.sprite, x, y, animation.offsetX, animation.offsetY, animation.width, animation.height);
};

module.exports = Video;

},{}]},{},[1])
(1)
});