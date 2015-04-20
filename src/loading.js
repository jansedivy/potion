var Loading = function(app) {
  this.app = app;

  this.barWidth = 0;
};

Loading.prototype.render = function(time, video) {
  video.clear();

  var color1 = '#b9ff71';
  var color2 = '#8ac250';
  var color3 = '#648e38';

  var width = Math.min(video.width * 2/3, 300);
  var height = 20;

  var y = (video.height - height) / 2;
  var x = (video.width - width) / 2;

  var currentWidth = width * this.app.assets.progress;
  this.barWidth = this.barWidth + (currentWidth - this.barWidth) * time * 10;

  video.ctx.fillStyle = color2;
  video.ctx.fillRect(0, 0, video.width, video.height);

  video.ctx.font = '400 40px sans-serif';
  video.ctx.textAlign = 'center';
  video.ctx.textBaseline = 'bottom';

  video.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
  video.ctx.fillText("Potion.js", video.width/2, y + 2);

  video.ctx.fillStyle = '#d1ffa1';
  video.ctx.fillText("Potion.js", video.width/2, y);

  video.ctx.strokeStyle = video.ctx.fillStyle = color3;
  video.ctx.fillRect(x, y + 15, width, height);

  video.ctx.lineWidth = 2;
  video.ctx.beginPath();
  video.ctx.rect(x - 5, y + 10, width + 10, height + 10);
  video.ctx.closePath();
  video.ctx.stroke();

  video.ctx.strokeStyle = video.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
  video.ctx.fillRect(x, y + 15, this.barWidth, height + 2);

  video.ctx.lineWidth = 2;
  video.ctx.beginPath();

  video.ctx.moveTo(x + this.barWidth, y + 12);
  video.ctx.lineTo(x - 5, y + 12);
  video.ctx.lineTo(x - 5, y + 10 + height + 12);
  video.ctx.lineTo(x + this.barWidth, y + 10 + height + 12);

  video.ctx.stroke();
  video.ctx.closePath();

  video.ctx.strokeStyle = video.ctx.fillStyle = color1;
  video.ctx.fillRect(x, y + 15, this.barWidth, height);

  video.ctx.lineWidth = 2;
  video.ctx.beginPath();

  video.ctx.moveTo(x + this.barWidth, y + 10);
  video.ctx.lineTo(x - 5, y + 10);
  video.ctx.lineTo(x - 5, y + 10 + height + 10);
  video.ctx.lineTo(x + this.barWidth, y + 10 + height + 10);

  video.ctx.stroke();
  video.ctx.closePath();
};

module.exports = Loading;
