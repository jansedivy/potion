Potion.init(document.querySelector('.game'), {
  render: function() {
    if (this.input.mouse.isDown) {
      this.video.ctx.fillStyle = '#8298a6';
    } else {
      this.video.ctx.fillStyle = '#B4CBD9';
    }

    this.video.ctx.fillRect(0, 0, this.width, 50);

    var color = 'black';

    if (this.input.mouse.isLeftDown) {
      color = '#048ABF';
    } else if (this.input.mouse.isMiddleDown) {
      color = '#03738C';
    } else if (this.input.mouse.isRightDown) {
      color = '#F2B366';
    }

    this.video.ctx.fillStyle = color;
    this.video.ctx.fillRect(this.input.mouse.x, this.input.mouse.y, 30, 30);
  }
});
