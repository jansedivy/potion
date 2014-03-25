var app;

var Player = function() {
  this.x = 50;
  this.y = 20;

  this.animation = new app.animation(app.assets.get('test.png'), 130, 150, 7);
  this.animationTime = 0;
};

Player.prototype.update = function(time) {
  this.animationTime += time;

  if (this.animationTime > 0.036) {
    this.animationTime = 0;
    this.animation.setState((this.animation.state + 1) % 27);
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
    this.assets.load('image', 'test.png');
  },

  init: function() {
    this.player = new Player();
  },

  update: function(time) {
    this.player.update(time);
  },

  render: function() {
    this.player.render();
  }
});
