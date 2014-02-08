var Class = require('./class');

var keys = require('./keys');

var Game = Class.extend({
  init: function() {
    this.width = 300;
    this.height = 300;
    this.canvasWidth = 300;
    this.canvasHeight = 300;

    this.totalTime = 0;

    this.load = {};

    this.mousedown = false;
    this.mousepos = { x: null, y: null };

    this.input = {
      keys: {},
      canControlKeys: true,

      mouse: {
        isDown: false,
        position: { x: null, y: null }
      },

      isKeyDown: function(code) {
        if (this.canControlKeys) {
          return this.keys[keys[code.toUpperCase()]];
        }
      }
    };
  },

  config: function() {},

  resize: function() {},

  render: function() {},
  update: function() {},

  keypress: function() {},
  click: function() {},

  mousemove: function() {},

  focus: function() {},
  blur: function() {}
});

module.exports = Game;
