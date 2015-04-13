/* global PIXI */

var Potion = require('potion');

var app;

var Particle = function(x, y) {
  this.x = x;
  this.y = y;

  this.r = 1;

  this.dx = Math.random() * 100 - 50;
  this.dy = Math.random() * 100 - 50;

  this.speed = 150;

  this.object = new PIXI.Sprite(app.assets.get('particle.png'));

  this.object.blendMode = PIXI.blendModes.SCREEN;

  app.stage.addChild(this.object);
};

Particle.prototype.update = function(time) {
  var angle = Math.atan2(app.centerY - this.y, app.centerX - this.x);

  this.dx += Math.cos(angle) * 5 * this.speed * time;
  this.dy += Math.sin(angle) * 5 * this.speed * time;

  this.dx = this.dx + (0 - this.dx) * time/4;
  this.dy = this.dy + (0 - this.dy) * time/4;

  this.r = Math.sqrt(Math.pow(this.dx, 2) + Math.pow(this.dy, 2)) / 200 + 0.2;

  this.x += this.dx * time;
  this.y += this.dy * time;

  this.object.scale.set(this.r / 20);
  this.object.position.x = this.x;
  this.object.position.y = this.y;
};

app = Potion.init(document.querySelector('.game'), {
  configure: function() {
    this.setSize(document.body.clientWidth, document.body.clientHeight);
    this.config.allowHiDPI = false;
    this.config.getCanvasContext = false;

    this.renderer = new PIXI.WebGLRenderer(this.width, this.height, { resolution: this.config.allowHiDPI ? 2 : 1, view: this.canvas });

    this.assets.addLoader('pixi', function(url, callback) {
      this.assets._loaders.image(url, function(image) {
        callback(new PIXI.Texture(new PIXI.BaseTexture(image)));
      });
    }.bind(this));

    this.assets.load('pixi', 'particle.png');
  },

  init: function() {
    this.centerX = this.width/2;
    this.centerY = this.height/2;

    this.prevX = null;
    this.prevY = null;

    this.particles = [];
    this.stage = new PIXI.Stage(0x080a25);
  },

  update: function(time) {
    if (this.prevX == null || this.prevY == null) {
      this.prevX = app.input.mouse.x;
      this.prevY = app.input.mouse.y;
    }

    if (app.input.mouse.isDown) {
      for (var i=0; i<10; i++) {
        var angle = Math.random() * Math.PI*2;
        var distance = Math.random() * 20 + 4;

        var particle = new Particle(Math.cos(angle) * distance + app.input.mouse.x, Math.sin(angle) * distance + app.input.mouse.y);

        particle.dx += (app.input.mouse.x - this.prevX) * 20;
        particle.dy += (app.input.mouse.y - this.prevY) * 20;

        this.particles.push(particle);
      }
    }

    this.prevX = app.input.mouse.x;
    this.prevY = app.input.mouse.y;

    for (var i=0, len=this.particles.length; i<len; i++) {
      this.particles[i].update(time);
    }
  },

  render: function() {
    this.renderer.render(this.stage);
  }
});
