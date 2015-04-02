var Potion = require('potion');

Potion.init(document.querySelector('.game'), {
  init: function() {
    this.x = 0;
    this.y = 0;
    this.shift = false;
  },

  update: function() {
    if (this.input.isKeyDown('w')) { this.y -= 10; }
    if (this.input.isKeyDown('d')) { this.x += 10; }
    if (this.input.isKeyDown('s')) { this.y += 10; }
    if (this.input.isKeyDown('a')) { this.x -= 10; }
  },

  render: function() {
    var color = 'black';

    if (this.input.isKeyDown('shift')) { color = 'red'; }

    this.video.ctx.fillStyle = color;
    this.video.ctx.fillRect(this.x, this.y, 40, 40);
  }
});
