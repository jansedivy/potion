/* global createjs */

var Potion = require('potion');

var app = Potion.init(document.querySelector('.game'), {
  configure: function() {
    this.setSize(800, 600);
    this.config.allowHiDPI = false;
    this.config.getCanvasContext = false;

    this.stage = new createjs.Stage(this.canvas);

    this.circle = new createjs.Shape();
    this.circle.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 50);
    this.circle.x = 100;
    this.circle.y = 100;

    this.stage.addChild(this.circle);
  },

  update: function() {
    this.circle.x = app.input.mouse.x;
    this.circle.y = app.input.mouse.y;
  },

  render: function() {
    this.stage.update();
  }
});
