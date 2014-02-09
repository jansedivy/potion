var Input = require('./input');

var Game = function(canvas) {
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
};

Game.prototype.config = function() {};

Game.prototype.resize = function() {};

Game.prototype.render = function() {};
Game.prototype.update = function() {};

Game.prototype.keypress = function() {};
Game.prototype.click = function() {};

Game.prototype.mousemove = function() {};

Game.prototype.focus = function() {};
Game.prototype.blur = function() {};

module.exports = Game;
