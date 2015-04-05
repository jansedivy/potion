var Potion = require('potion');

var app = Potion.init(document.querySelector('.game'), {
  init: function() {
    this.size = 10;
  },

  update: function(time) {
    this.size += 100 * time;
  },

  render: function() {
    app.video.ctx.fillStyle = '#bada55';
    app.video.ctx.fillRect(10, 10, this.size, this.size);
  }
});
