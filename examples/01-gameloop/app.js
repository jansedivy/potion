Potion.init(document.querySelector('.game'), {
  init: function() {
    this.size = 10;
  },

  update: function(time) {
    this.size += 100 * time;
  },

  render: function() {
    this.video.ctx.fillStyle = '#bada55';
    this.video.ctx.fillRect(10, 10, this.size, this.size);
  }
});
