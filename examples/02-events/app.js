Potion.init(document.querySelector('.game'), {
  init: function() {
    this.points = [];
  },

  render: function() {
    for (var i=0; i<this.points.length; i++) {
      var point = this.points[i];
      this.video.ctx.fillRect(point.x, point.y, 10, 10);
    }
  },

  click: function(x, y, button) {
    // button 0 is left click
    if (button === 0) {
      this.points.push({ x: x, y: y });
    }
  }
});
