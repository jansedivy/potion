var Input = require('./input');

var Game = function(canvas) {
  this.canvas = canvas;

  this.width = 300;
  this.height = 300;

  this.load = {};

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