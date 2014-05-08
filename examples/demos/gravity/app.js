var Particle = function(app) {
  var Particle = function(x, y) {
    this.x = x;
    this.y = y;

    this.r = 2;

    this.dx = Math.random() * 100 - 50;
    this.dy = Math.random() * 100 - 50;

    this.speed = 150;
  };

  Particle.prototype.update = function(time) {
    var angle = Math.atan2(app.centerY - this.y, app.centerX - this.x);
    this.dx += Math.cos(angle) * this.speed * time;
    this.dy += Math.sin(angle) * this.speed * time;

    this.x += this.dx * time;
    this.y += this.dy * time;
  };

  Particle.prototype.render = function() {
    app.video.ctx.beginPath();
    app.video.ctx.arc(this.x, this.y, this.r, 0, Math.PI*2, false);
    app.video.ctx.fillStyle = 'orange';
    app.video.ctx.fill();
    app.video.ctx.closePath();
  };

  return Particle;
};

Potion.init(document.querySelector('.game'), {
  resize: function() {
    this.width = document.body.clientWidth;
    this.height = document.body.clientHeight;
  },

  init: function() {
    this.particles = [];

    this.Particle = Particle(this);
    this.centerX = this.width/2;
    this.centerY = this.height/2;

    var count = 50;
    for (var x=0; x<count; x++) {
      for (var y=0; y<count; y++) {
        //this.particles.push(new this.Particle(Math.random() * this.width, Math.random() * this.height));
      }
    }
  },

  mousemove: function(x, y) {
    if (this.input.mouse.isDown) {
      for (var i=0; i<10; i++) {
        var angle = Math.random() * Math.PI*2;
        var distance = Math.random() * 25;

        this.particles.push(new this.Particle(Math.cos(angle) * distance + x, Math.sin(angle) * distance + y));
      }
    }
  },

  update: function(time) {
    for (var i=0, len=this.particles.length; i<len; i++) {
      this.particles[i].update(time);
    }
  },

  render: function() {
    for (var i=0, len=this.particles.length; i<len; i++) {
      this.particles[i].render();
    }

    this.video.ctx.fillStyle = 'black';
    this.video.ctx.fillRect(this.centerX - 5, this.centerY - 5, 10, 10);
  }
});
