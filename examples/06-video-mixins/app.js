var Potion = require('potion');

var VideoMixins = {
  circle: function(x, y, r) {
    this.ctx.beginPath();
    this.ctx.arc(x, y, r, 0, 2 * Math.PI, false);
    this.ctx.closePath();
  }
};

Potion.init(document.querySelector('.game'), {
  init: function() {
    this.video.include(VideoMixins);
  },

  render: function() {
    this.video.ctx.fillStyle = 'black';
    this.video.circle(this.width/2, this.height/2, 40);
    this.video.ctx.fill();
  }
});
