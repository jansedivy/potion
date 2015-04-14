var Potion = require('potion');

var app = Potion.init(document.querySelector('.game'), {
  render: function() {
    app.video.ctx.fillStyle = 'black';
    app.video.ctx.font = '20px sans-serif';
    app.video.ctx.textAlign = 'left';
    app.video.ctx.textBaseline = 'top';

    if (app.input.mouse.isDown) {
      app.video.ctx.fillText('Any button is down', 10, 10);
    }

    if (app.input.mouse.isLeftDown) {
      app.video.ctx.fillText('Left button is down', 10, 30);
    }

    if (app.input.mouse.isMiddleDown) {
      app.video.ctx.fillText('Middle button is down', 10, 50);
    }

    if (app.input.mouse.isRightDown) {
      app.video.ctx.fillText('Right button is down', 10, 70);
    }

    app.video.ctx.fillStyle = '#68B4FF';
    app.video.ctx.fillRect(app.input.mouse.x - 15, app.input.mouse.y - 15, 30, 30);
  }
});
