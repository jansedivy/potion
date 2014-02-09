var Class = require('./class');

var keys = require('./keys');

var Input = Class.extend({
  init: function(game) {
    this.game = game;
    this.keys = {};
    this.canControlKeys = true;

    this.mouse = {
      isDown: false,
      position: { x: null, y: null }
    };

    this.addEvents();
  },

  resetKeys: function() {
    this.keys = {};
  },

  addEvents: function() {
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
      e.preventDefault();
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
  },

  isKeyDown: function(code) {
    if (this.canControlKeys) {
      return this.keys[keys[code.toUpperCase()]];
    }
  }
});

module.exports = Input;
