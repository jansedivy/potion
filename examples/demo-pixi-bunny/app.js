/* global PIXI */

var Potion = require('potion');

var app;

var Bunny = function() {
  this.x = 0;
  this.y = 0;
  this.speedX = 0;
  this.speedY = 0;

  this.object = new PIXI.Sprite(app.assets.get('bunny.png'));

  this.object.scale.set(0.5 + Math.random() * 0.5);
  this.object.rotation = Math.random() - 0.5;

  app.main.stage.addChild(this.object);
};

Bunny.prototype.update = function() {
  this.x += this.speedX;
  this.y += this.speedY;
  this.speedY += app.main.gravity;

  if (this.x > app.main.maxX) {
    this.speedX *= -1;
    this.x = app.main.maxX;
  } else if (this.x < app.main.minX) {
    this.speedX *= -1;
    this.x = app.main.minX;
  } if (this.y > app.main.maxY) {
    this.speedY *= -0.85;
    this.y = app.main.maxY;
    if (Math.random() > 0.5) {
      this.speedY -= Math.random() * 6;
    }
  } else if (this.y < app.main.minY) {
    this.speedY = 0;
    this.y = app.main.minY;
  }

  this.object.position.x = this.x;
  this.object.position.y = this.y;
};

app = Potion.init(document.querySelector('.game'), {
  configure: function() {
    app.resize(800, 600);
    app.config.allowHiDPI = false;
    app.config.getCanvasContext = false;

    app.assets.load('image', 'bunny.png');

    this.renderer = new PIXI.WebGLRenderer(app.width, app.height, { view: app.canvas });
  },

  init: function() {
    app.assets.set('bunny.png', new PIXI.Texture(new PIXI.BaseTexture(app.assets.get('bunny.png'))));

    this.gravity = 0.75;
    this.amount = 50;
    this.maxX = 800;
    this.minX = 0;
    this.maxY = 600;
    this.minY = 0;

    this.bunnys = [];
    this.stage = new PIXI.Stage();

    this.counter = document.createElement('div');
    this.counter.className = 'counter';
    document.querySelector('.container').appendChild(this.counter);

    this.count = 0;
    this.counter.innerHTML = this.count + ' BUNNIES';
  },

  update: function() {
    if (app.input.mouse.isDown) {
      for (var i=0; i<this.amount; i++) {
        var bunny = new Bunny();
        bunny.speedX = Math.random() * 10;
        bunny.speedY = (Math.random() * 10) - 5;
        this.bunnys.push(bunny);

        this.count += 1;
      }

      this.counter.innerHTML = this.count + ' BUNNIES';
    }

    for (var i=0, len=this.bunnys.length; i<len; i++) {
      var bunny = this.bunnys[i];
      bunny.update();
    }
  },

  render: function() {
    this.renderer.render(this.stage);
  }
});

module.exports = app;
