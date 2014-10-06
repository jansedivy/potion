/* global PIXI */

var app = require('./app');

var Bunny = function() {
  this.x = 0;
  this.y = 0;
  this.speedX = 0;
  this.speedY = 0;

  this.object = new PIXI.Sprite(app.texture);
  app.stage.addChild(this.object);
};

Bunny.prototype.update = function() {
  this.x += this.speedX;
  this.y += this.speedY;
  this.speedY += app.gravity;

  if (this.x > app.maxX) {
    this.speedX *= -1;
    this.x = app.maxX;
  } else if (this.x < app.minX) {
    this.speedX *= -1;
    this.x = app.minX;
  } if (this.y > app.maxY) {
    this.speedY *= -0.85;
    this.y = app.maxY;
    if (Math.random() > 0.5) {
      this.speedY -= Math.random() * 6;
    }
  } else if (this.y < app.minY) {
    this.speedY = 0;
    this.y = app.minY;
  }

  this.object.position.x = this.x;
  this.object.position.y = this.y;
};

module.exports = Bunny;
