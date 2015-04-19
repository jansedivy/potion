/* global PIXI */

var Potion = require('potion');

var app;

var Particle = function(x, y) {
  this.x = x;
  this.y = y;

  this.r = 1;

  this.dx = Math.random() * 100 - 50;
  this.dy = Math.random() * 100 - 50;

  this.speed = 1250;

  this.object = new PIXI.Sprite(app.assets.get('particle.png'));
  this.object.tint = 0xffffff * Math.random();
  this.object.scale.set(this.r / 10);
  this.object.position.x = this.x;
  this.object.position.y = this.y;

  this.object.blendMode = PIXI.blendModes.ADD;

  app.main.stage.addChild(this.object);
};

Particle.prototype.update = function(time) {
  var dx = app.main.centerX - this.x;
  var dy = app.main.centerY - this.y;

  var deltaLength = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

  this.dx += dx/deltaLength * this.speed * time;
  this.dy += dy/deltaLength * this.speed * time;

  this.dx = this.dx + (0 - this.dx) * time/2;
  this.dy = this.dy + (0 - this.dy) * time/2;

  var speed = Math.sqrt(Math.pow(this.dx, 2) + Math.pow(this.dy, 2));
  var distance = Math.pow(app.main.centerX - this.x, 2) + Math.pow(app.main.centerY - this.y, 2);

  this.r = speed / 200 + 0.2;

  this.x += this.dx * time;
  this.y += this.dy * time;

  this.object.scale.set(this.r / 10);
  this.object.position.x = this.x;
  this.object.position.y = this.y;

  if (speed < 100 && distance < 100000) {
    app.main.stage.removeChild(this.object);
    return true;
  }
};

app = Potion.init(document.querySelector('.game'), {
  configure: function() {
    app.setSize(document.body.clientWidth, document.body.clientHeight);
    app.config.allowHiDPI = false;
    app.config.getCanvasContext = false;

    app.assets.load('image', 'particle.png');

    this.renderer = new PIXI.WebGLRenderer(app.width, app.height, { view: app.canvas });
  },

  init: function() {
    app.assets.set('particle.png', new PIXI.Texture(new PIXI.BaseTexture(app.assets.get('particle.png'))));

    this.centerX = app.width/2;
    this.centerY = app.height/2;

    this.prevX = null;
    this.prevY = null;

    this.particles = [];
    this.stage = new PIXI.Stage(0x080a25);

    window.addEventListener('resize', function() {
      app.setSize(document.body.clientWidth, document.body.clientHeight);
    }.bind(this));
  },

  resize: function() {
    this.centerX = app.width/2;
    this.centerY = app.height/2;

    this.renderer.resize(app.width, app.height);
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
