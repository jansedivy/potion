var Potion = require('potion');

var app = Potion.init(document.querySelector('.game'), {
  render: function() {
    app.video.ctx.fillStyle = 'black';
    app.video.ctx.font = '20px sans-serif';
    app.video.ctx.textAlign = 'left';
    app.video.ctx.textBaseline = 'top';
    app.video.ctx.fillText("Hello Potion", 10, 10);
  }
});
