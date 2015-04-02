var Potion = require('potion');

Potion.init(document.querySelector('.game'), {
  configure: function() {
    this.assets.load('text', './textfile.txt');
    this.assets.load('image', './bunny.png');
    this.assets.load('json', './data.json');
  },

  render: function() {
    this.video.ctx.font = '20px sans-serif';
    this.video.ctx.fillText(this.assets.get('./textfile.txt'), 10, 30);

    this.video.ctx.drawImage(this.assets.get('./bunny.png'), 10, 50);

    var data = this.assets.get('./data.json');
    for (var i=0; i<data.squares; i++) {
      var x = i * (data.size + data.padding) + 10;
      var y = 100;

      this.video.ctx.fillRect(x, y, data.size, data.size);
    }
  }
});
