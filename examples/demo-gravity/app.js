/* global PIXI */

var Potion = require('potion');

var app;

var Particle = function(x, y) {
  this.x = x;
  this.y = y;

  this.r = 1;

  this.dx = Math.random() * 100 - 50;
  this.dy = Math.random() * 100 - 50;

  this.speed = 250;

  this.object = new PIXI.Sprite(app.assets.get('particle.png'));
  this.object.tint = 0xffffff * Math.random();

  this.object.blendMode = PIXI.blendModes.ADD;

  app.stage.addChild(this.object);
};

Particle.prototype.update = function(time) {
  var angle = Math.atan2(app.centerY - this.y, app.centerX - this.x);

  this.dx += Math.cos(angle) * 5 * this.speed * time;
  this.dy += Math.sin(angle) * 5 * this.speed * time;

  this.dx = this.dx + (0 - this.dx) * time/2;
  this.dy = this.dy + (0 - this.dy) * time/2;

  var speed = Math.sqrt(Math.pow(this.dx, 2) + Math.pow(this.dy, 2));
  var distance = Math.sqrt(Math.pow(app.centerX - this.x, 2) + Math.pow(app.centerY - this.y, 2));

  this.r = speed / 200 + 0.2;

  this.x += this.dx * time;
  this.y += this.dy * time;

  this.object.scale.set(this.r / 10);
  this.object.position.x = this.x;
  this.object.position.y = this.y;

  if (speed < 100 && distance < 100) {
    app.stage.removeChild(this.object);
    return true;
  }
};

app = Potion.init(document.querySelector('.game'), {
  configure: function() {
    this.setSize(document.body.clientWidth, document.body.clientHeight);
    this.config.allowHiDPI = true;
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
    if (app.input.mouse.isDown) {
      if (this.prevX == null || this.prevY == null) {
        this.prevX = app.input.mouse.x;
        this.prevY = app.input.mouse.y;
      }

      for (var i=0; i<100; i++) {
        var angle = Math.random() * Math.PI*2;
        var distance = Math.random() * 40;

        var particle = new Particle(Math.cos(angle) * distance + app.input.mouse.x, Math.sin(angle) * distance + app.input.mouse.y);

        particle.dx += (app.input.mouse.x - this.prevX) * Math.random() * 40;
        particle.dy += (app.input.mouse.y - this.prevY) * Math.random() * 40;

        this.particles.push(particle);
      }

      this.prevX = app.input.mouse.x;
      this.prevY = app.input.mouse.y;
    } else {
      this.prevX = null;
      this.prevX = null;
    }

    for (var i=0, len=this.particles.length; i<len; i++) {
      var particle = this.particles[i];
      if (particle && particle.update(time)) {
        this.particles.splice(i, 1);
      }
    }
  },

  render: function() {
    this.renderer.render(this.stage);
  }
});
