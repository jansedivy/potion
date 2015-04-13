var Loading = function(app) {
  this.app = app;

  this.barWidth = 0;

  this.video = app.video.createLayer({
    allowHiDPI: true,
    getCanvasContext: true
  });

  this.video.canvas.className += ' test';
};

Loading.prototype.render = function(time) {
  this.video.clear();

  var color1 = '#b9ff71';
  var color2 = '#8ac250';
  var color3 = '#648e38';

  var width = Math.min(this.app.width * 2/3, 300);
  var height = 20;

  var y = (this.app.height - height) / 2;
  var x = (this.app.width - width) / 2;

  var currentWidth = width * this.app.assets.progress;
  this.barWidth = this.barWidth + (currentWidth - this.barWidth) * time * 10;

  this.video.ctx.fillStyle = color2;
  this.video.ctx.fillRect(0, 0, this.app.width, this.app.height);

  this.video.ctx.font = '400 40px sans-serif';
  this.video.ctx.textAlign = 'center';
  this.video.ctx.textBaseline = 'bottom';

  this.video.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
  this.video.ctx.fillText("Potion.js", this.app.width/2, y + 2);

  this.video.ctx.fillStyle = '#d1ffa1';
  this.video.ctx.fillText("Potion.js", this.app.width/2, y);

  this.video.ctx.strokeStyle = this.video.ctx.fillStyle = color3;
  this.video.ctx.fillRect(x, y + 15, width, height);

  this.video.ctx.lineWidth = 2;
  this.video.ctx.beginPath();
  this.video.ctx.rect(x - 5, y + 10, width + 10, height + 10);
  this.video.ctx.closePath();
  this.video.ctx.stroke();

  this.video.ctx.strokeStyle = this.video.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
  this.video.ctx.fillRect(x, y + 15, this.barWidth, height + 2);

  this.video.ctx.lineWidth = 2;
  this.video.ctx.beginPath();

  this.video.ctx.moveTo(x + this.barWidth, y + 12);
  this.video.ctx.lineTo(x - 5, y + 12);
  this.video.ctx.lineTo(x - 5, y + 10 + height + 12);
  this.video.ctx.lineTo(x + this.barWidth, y + 10 + height + 12);

  this.video.ctx.stroke();
  this.video.ctx.closePath();

  this.video.ctx.strokeStyle = this.video.ctx.fillStyle = color1;
  this.video.ctx.fillRect(x, y + 15, this.barWidth, height);

  this.video.ctx.lineWidth = 2;
  this.video.ctx.beginPath();

  this.video.ctx.moveTo(x + this.barWidth, y + 10);
  this.video.ctx.lineTo(x - 5, y + 10);
  this.video.ctx.lineTo(x - 5, y + 10 + height + 10);
  this.video.ctx.lineTo(x + this.barWidth, y + 10 + height + 10);

  this.video.ctx.stroke();
  this.video.ctx.closePath();
};

Loading.prototype.exit = function() {
  this.video.destroy();
};

module.exports = Loading;
