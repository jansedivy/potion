var Potion = require('potion');

var VideoMixins = {
  circle: function(x, y, r) {
    this.ctx.beginPath();
    this.ctx.arc(x, y, r, 0, 2 * Math.PI, false);
    this.ctx.closePath();
  }
};

var app = Potion.init(document.querySelector('.game'), {
  init: function() {
    app.video.include(VideoMixins);
  },

  render: function() {
    app.video.ctx.fillStyle = 'black';
    app.video.circle(app.width/2, app.height/2, 40);
    app.video.ctx.fill();
  }
});
