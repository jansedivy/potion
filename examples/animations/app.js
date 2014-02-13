var Potion = require('../../');
var app;

var Player = function() {
  this.x = 50;
  this.y = 20;

  this.animation = new app.sprite.animation(app.sprite.get('test'), 130, 150, 27, 7);
  this.animationTime = 0;
};

Player.prototype.update = function(time) {
  this.animationTime += time;

  if (this.animationTime > 0.036) {
    this.animationTime = 0;
    this.animation.setState((this.animation.state + 1) % this.animation.count);
  }
};

Player.prototype.render = function() {
  app.video.ctx.fillText('state: ' + this.animation.state, 10, 10);
  app.video.ctx.fillText('indexX: ' + this.animation.indexX, 10, 20);
  app.video.ctx.fillText('indexY: ' + this.animation.indexY, 10, 30);

  app.video.animation(this.animation, this.x, this.y);
};

app = Potion.init(document.querySelector('canvas'), {
  config: function() {
    this.load = {
      sprite: 'sprite.json',
      spriteImage: 'sprite.png'
    };
  },

  start: function() {
    this.player = new Player();
  },

  update: function(time) {
    this.player.update(time);
  },

  render: function() {
    this.player.render();
  }
});
