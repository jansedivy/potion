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

app = Potion.init(document.querySelector('.game'), {
  configure: function() {
    this.setSize(800, 600);
    this.config.allowHiDPI = false;
    this.config.getCanvasContext = false;

    this.renderer = new PIXI.WebGLRenderer(this.width, this.height, { view: this.canvas });

    this.assets.addLoader('pixi', function(url, callback) {
      this.assets._loaders.image(url, function(image) {
        callback(new PIXI.Texture(new PIXI.BaseTexture(image)));
      });
    }.bind(this));

    this.assets.load('pixi', 'bunny.png');
  },

  init: function() {
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
