var Potion = require('potion');

var app = Potion.init(document.querySelector('.game'), {
  init: function() {
    this.x = 0;
    this.y = 0;
    this.shift = false;
  },

  update: function() {
    if (app.input.isKeyDown('w')) { this.y -= 10; }
    if (app.input.isKeyDown('d')) { this.x += 10; }
    if (app.input.isKeyDown('s')) { this.y += 10; }
    if (app.input.isKeyDown('a')) { this.x -= 10; }
  },

  render: function() {
    var color = 'black';

    if (app.input.isKeyDown('shift')) { color = 'red'; }

    app.video.ctx.fillStyle = color;
    app.video.ctx.fillRect(this.x, this.y, 40, 40);
  }
});
