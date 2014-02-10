/**
 * potion - v0.0.10
 * Copyright (c) 2014, Jan Sedivy
 *
 * Compiled: 2014-02-10
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

},{"./src/engine":2}],2:[function(_dereq_,module,exports){
window.DEBUG = true;

var Game = _dereq_('./game');
if (window.DEBUG) {
  var Profiler = _dereq_('./profiler');
  var profiler = null;
}

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

  var self = this;
  this.game.sprite.load(this.game.load.sprite, this.game.load.spriteImage, function() {
    self.start();
  });
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
  this.game.canvas.width = this.game.width;
  this.game.canvas.height = this.game.height;

  if (this.game.isRetina) {
    this.game.video.scale(2);
  }
};

/**
 * Starts the game, adds events and run first frame
 * @private
 */
Engine.prototype.start = function() {
  if (DEBUG) { profiler = new (Profiler(this.game))(); }
  if (DEBUG) { profiler.startTrace('start'); }
  this.game.start();
  if (DEBUG) { profiler.endTrace('start'); }
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
  if (DEBUG) { profiler.startTrace('update'); }
  this.game.update(time);
  if (DEBUG) { profiler.endTrace('update'); }
};

/**
 * Renders the game
 * @private
 */
Engine.prototype.render = function() {
  this.game.video.ctx.clearRect(0, 0, this.game.width, this.game.height);
  if (DEBUG) { profiler.startTrace('render'); }
  this.game.render();
  if (DEBUG) { profiler.endTrace('render'); }

  if (DEBUG) { profiler.renderDebug(); }
};

module.exports = Engine;

},{"./game":3,"./profiler":6,"./raf":7}],3:[function(_dereq_,module,exports){
var Video = _dereq_('./video');
var Input = _dereq_('./input');
var SpriteSheetManager = _dereq_('./spriteSheetManager');
var isRetina = _dereq_('./retina');

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
   * If you have retina screen will is true
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

},{"./input":4,"./retina":8,"./spriteSheetManager":9,"./video":11}],4:[function(_dereq_,module,exports){
var keys = _dereq_('./keys');

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

},{"./keys":5}],5:[function(_dereq_,module,exports){
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

},{}],6:[function(_dereq_,module,exports){
if (DEBUG) {
  module.exports = function(app) {
    /**
     * Profiler class for measuring performance
     * @constructor
     */
    var Profiler = function() {
      /**
       * Start time of measured part
       * @type {number|null}
       */
      this.currentProfileStart = null;

      /**
       * Max records
       * @type {number}
       */
      this.maxRecords = 400;

      /**
       * Each column width in graph
       * @type {number}
       */
      this.recordWidth = 2;

      /**
       * Height for 60 fps
       * @type {number}
       */
      this.optimalHeight = 60;

      /**
       * Sixty frames in seconds
       * @type {number}
       */
      this.sixtyFrameMS = 0.016;

      /**
       * Measured data
       * @type {object}
       */
      this.data = {};
    };

    /**
     * Start profiling
     * @param {string} name - name of measured code
     */
    Profiler.prototype.startTrace = function(name) {
      if (!app.useProfiler) { return; }

      if (!this.data[name]) { this.data[name] = []; }
      this.currentProfileStart = window.performance.now();
    };

    /**
     * Stop profiling and save result by given name
     * @param {string} name - name of measured code
     */
    Profiler.prototype.endTrace = function(name) {
      if (!app.useProfiler) { return; }

      var time = window.performance.now() - this.currentProfileStart;
      time = time / 1000;
      var data = this.data[name];
      if (data) {
        if (data.length > this.maxRecords) {
          data.shift();
        }
        data.push(time);
      }
    };

    /**
     * Render data into canvas
     */
    Profiler.prototype.renderDebug = function() {
      if (!app.useProfiler) { return; }

      var updateData = this.data['update'];
      var renderData = this.data['render'];

      var sixtyFramesHeight = this.sixtyFrameMS*-this.optimalHeight/this.sixtyFrameMS;
      app.video.ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      app.video.ctx.fillRect(0, app.height - this.optimalHeight - 20, this.recordWidth * this.maxRecords, this.optimalHeight + 20);

      var updateText = 'update: ' + (updateData[updateData.length-1] * 1000).toFixed(2) + 'ms';
      var renderText = 'render: ' + (renderData[renderData.length-1] * 1000).toFixed(2) + 'ms';
      app.video.ctx.fillStyle = 'white';
      app.video.ctx.fillText(updateText + ' -- ' + renderText, 0, app.height - 5);

      for (var i=0, len=updateData.length; i<len; i++) {
        var update = updateData[i];
        var render = renderData[i];

        var updateHeight = update*-this.optimalHeight/this.sixtyFrameMS;
        var renderHeight = render*-this.optimalHeight/this.sixtyFrameMS;

        app.video.ctx.fillStyle = 'cyan';
        app.video.ctx.fillRect(i * this.recordWidth, app.height - 20, this.recordWidth, updateHeight);

        app.video.ctx.fillStyle = 'orange';
        app.video.ctx.fillRect(i * this.recordWidth, app.height + updateHeight - 20, this.recordWidth, renderHeight);
      }

      app.video.ctx.fillStyle = 'red';
      app.video.ctx.fillRect(0, app.height + sixtyFramesHeight - 20, this.recordWidth * this.maxRecords, 1);
    };

    return Profiler;
  };
}

},{}],7:[function(_dereq_,module,exports){
module.exports = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

},{}],8:[function(_dereq_,module,exports){
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

},{}],9:[function(_dereq_,module,exports){
var getJSON = _dereq_('./utils').getJSON;

/**
 * Class for loading images
 * @constructor
 */
var SpriteSheetManager = function() {
  /**
   * Sprite data
   * @type {object}
   */
  this.data = {};

  /**
   * sprite image
   * @type {HTMLImageElement|null}
   */
  this.image = null;
};

/**
 * Load json file and actual sprite image
 * @param {string} json - path to the json file
 * @param {string} imagePath - path to the image
 * @param {function} callback - function that is called after everything is loaded
 */
SpriteSheetManager.prototype.load = function(json, imagePath, callback) {
  if (!json) { return callback(); }

  var self = this;

  var image = new Image();
  image.onload = function() {
    self.image = image;
    callback();
  };

  getJSON(json, function(data) {
    self.data = data;
    image.src = imagePath;
  });
};

/**
 * Get data about specific image
 * @param {string} name - image name
 * @return {object}
 */
SpriteSheetManager.prototype.get = function(name) {
  return this.data[name];
};

module.exports = SpriteSheetManager;

},{"./utils":10}],10:[function(_dereq_,module,exports){
exports.getJSON = function(url, callback) {
  var request = new XMLHttpRequest();
  request.open('GET', url, true);

  request.onload = function() {
    var data = JSON.parse(this.response);
    callback(data);
  };

  request.send();
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
   * canvas context
   * @type {CanvasRenderingContext2D}
   */
  this.ctx = canvas.getContext('2d');
};

/**
 * Scale canvas buffer, used for retina screens
 * @param {number} scale
 */
Video.prototype.scale = function(scale) {
  this.canvas.style.width = this.canvas.width + 'px';
  this.canvas.style.height = this.canvas.height + 'px';

  this.canvas.width *= scale;
  this.canvas.height *= scale;

  this.ctx.scale(scale, scale);
};

/**
 * Draws image sprite into x a y position
 * @param {HTMLImageElement} image - image with sprites
 * @param {object} sprite - sprite data
 * @param {number} x - x position
 * @param {number} y - y position
 */
Video.prototype.sprite = function(image, sprite, x, y) {
  x = Math.floor(x);
  y = Math.floor(y);

  var w = sprite.width;
  var h = sprite.height;
  var drawWidth = w;
  var drawHeight = h;

  if (sprite.source_image.match(/@2x.png$/)) {
    drawWidth /= 2;
    drawHeight /= 2;
  }

  this.ctx.drawImage(image, sprite.x, sprite.y, w, h, x, y, drawWidth, drawHeight);
};

module.exports = Video;

},{}]},{},[1])
(1)
});