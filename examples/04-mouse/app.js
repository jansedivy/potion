Potion.init(document.querySelector('.game'), {
  render: function() {
    var color = 'black';

    if (this.input.mouse.isDown) {
      color = 'red';
    }

    this.video.ctx.fillStyle = color;
    this.video.ctx.fillRect(this.input.mouse.x, this.input.mouse.y, 30, 30);
  }
});
