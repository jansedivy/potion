var Potion = require('potion');

var app;

var Particle = function(x, y) {
  this.x = x;
  this.y = y;

  this.r = 1;

  this.dx = Math.random() * 100 - 50;
  this.dy = Math.random() * 100 - 50;

  this.speed = 150;
};

Particle.prototype.update = function(time) {
  var angle = Math.atan2(app.centerY - this.y, app.centerX - this.x);

  this.dx += Math.cos(angle) * this.speed * time;
  this.dy += Math.sin(angle) * this.speed * time;

  this.r = Math.sqrt(Math.pow(this.dx, 2) + Math.pow(this.dy, 2)) / 200 + 0.3;

  this.x += this.dx * time;
  this.y += this.dy * time;
};

Particle.prototype.render = function() {
  app.video.ctx.beginPath();
  app.video.ctx.arc(this.x, this.y, this.r, 0, Math.PI*2, false);
  app.video.ctx.fillStyle = '#04819e';
  app.video.ctx.fill();
  app.video.ctx.closePath();
};

app = Potion.init(document.querySelector('.game'), {
  configure: function() {
    this.setSize(document.body.clientWidth, document.body.clientHeight);

    this.centerX = this.width/2;
    this.centerY = this.height/2;
  },

  init: function() {
    this.particles = [];
  },

  mousemove: function(value) {
    if (this.input.mouse.isDown) {
      for (var i=0; i<10; i++) {
        var angle = Math.random() * Math.PI*2;
        var distance = 3;

        this.particles.push(new Particle(Math.cos(angle) * distance + value.x, Math.sin(angle) * distance + value.y));
      }
    }
  },

  update: function(time) {
    for (var i=0, len=this.particles.length; i<len; i++) {
      this.particles[i].update(time);
    }
  },

  render: function() {
    this.video.ctx.fillStyle = '#38b2ce';
    this.video.ctx.fillRect(this.centerX - 5, this.centerY - 5, 10, 10);

    for (var i=0, len=this.particles.length; i<len; i++) {
      this.particles[i].render();
    }
  }
});
