Potion.init(document.querySelector('.game'), {
  configure: function() {
    this.assets.load('image', 'test.png');
  },

  init: function() {
    this.playerAnimation = new Potion.Animation(this.assets.get('test.png'), 130, 150, 7);
    this.animationTime = 0;
  },

  update: function(time) {
    this.animationTime += time;

    if (this.animationTime > 0.036) {
      this.animationTime = 0;
      this.playerAnimation.setState((this.playerAnimation.state + 1) % 27);
    }
  },

  render: function() {
    this.video.ctx.fillText('state: ' + this.playerAnimation.state, 10, 20);
    this.video.ctx.fillText('indexX: ' + this.playerAnimation.indexX, 10, 30);
    this.video.ctx.fillText('indexY: ' + this.playerAnimation.indexY, 10, 40);

    this.video.animation(this.playerAnimation, 20, 20);
  }
});
