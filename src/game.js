var Class = require('./class');
var Input = require('./input');

var Game = Class.extend({
  init: function(canvas) {
    this.width = 300;
    this.height = 300;
    this.canvasWidth = 300;
    this.canvasHeight = 300;
    this.canvas = canvas;

    this.totalTime = 0;

    this.load = {};

    this.mousedown = false;
    this.mousepos = { x: null, y: null };

    this.input = new Input(this);
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
