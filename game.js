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

    this._keys = {};
    this._controllingKeys = true;
  },

  isKeyDown: function(code) {
    if (this._controllingKeys) {
      return this._keys[keys[code.toUpperCase()]];
    }
  },

  config: function() {},

  resize: function() {},

  render: function() {},
  update: function() {},

  keypress: function() {},
  click: function() {},

  focus: function() {},
  blur: function() {}
});

module.exports = Game;
