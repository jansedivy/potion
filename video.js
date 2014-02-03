var Class = require('./class');

var Video = Class.extend({
  init: function(ctx) {
    this.ctx = ctx;
  },

  sprite: function(image, sprite, x, y) {
    x = Math.floor(x);
    y = Math.floor(y);

    var w = sprite.width;
    var h = sprite.height;

    this.ctx.drawImage(image, sprite.x, sprite.y, w, h, x, y, w, h);
  }
});

module.exports = Video;
