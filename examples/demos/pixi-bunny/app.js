/* global PIXI */

var Potion = require('potion');

var renderer = new PIXI.WebGLRenderer();
document.querySelector('.game').appendChild(renderer.view);

var Bunny;

var app = Potion.init(document.querySelector('.game'), {
  configure: function() {
    this.config.useRetina = false;
    this.config.initializeCanvas = false;

    this.assets.load('image', '/bunny.png');
  },

  gravity: 0.75,

  init: function() {
    Bunny = require('./bunny');

    this.amount = 50;
    this.maxX = 800;
    this.minX = 0;
    this.maxY = 600;
    this.minY = 0;
    this.startBunnyCount = 2;

    this.texture = PIXI.Texture.fromImage('/bunny.png');
    this.bunnys = [];
    this.stage = new PIXI.Stage();

    for (var i=0; i<this.startBunnyCount; i++) {
      var bunny = new Bunny();
      bunny.speedX = Math.random() * 10;
      bunny.speedY = (Math.random() * 10) - 5;
      this.bunnys.push(bunny);
    }

    this.counter = document.createElement('div');
    this.counter.className = 'counter';
    document.querySelector('.container').appendChild(this.counter);

    this.count = this.startBunnyCount;
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
    renderer.render(this.stage);
  }
});

module.exports = app;
