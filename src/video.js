var Video = function(canvas) {
  this.canvas = canvas;
  this.ctx = canvas.getContext('2d');
};

Video.prototype.scale = function(scale) {
  this.canvas.style.width = this.canvas.width + 'px';
  this.canvas.style.height = this.canvas.heihgt + 'px';

  this.canvas.width *= scale;
  this.canvas.height *= scale;

  this.ctx.scale(scale, scale);
};

Video.prototype.sprite = function(image, sprite, x, y) {
  x = Math.floor(x);
  y = Math.floor(y);

  var w = sprite.width;
  var h = sprite.height;
  var drawWidth = w;
  var drawHeight = h;

  if (sprite.source_image.match(/@2x.png$/)) {
    drawWidth /= 2;
    drawHeight /= 2;
  }

  this.ctx.drawImage(image, sprite.x, sprite.y, w, h, x, y, drawWidth, drawHeight);
};

module.exports = Video;
