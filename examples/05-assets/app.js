var Potion = require('potion');

var app = Potion.init(document.querySelector('.game'), {
  configure: function() {
    this.assets.load('text', 'textfile.txt');
    this.assets.load('image', 'bunny.png');
    this.assets.load('json', 'data.json');
  },

  mousedown: function() {
    app.assets.load('json', 'data.json', function(data) {
      console.log('Reloaded data.json');
      console.log(data);
    });
  },

  render: function() {
    app.video.ctx.font = '20px sans-serif';
    app.video.ctx.fillText(app.assets.get('textfile.txt'), 10, 30);

    app.video.ctx.drawImage(app.assets.get('bunny.png'), 10, 50);

    var data = app.assets.get('data.json');
    for (var i=0; i<data.squares; i++) {
      var x = i * (data.size + data.padding) + 10;
      var y = 100;

      app.video.ctx.fillRect(x, y, data.size, data.size);
    }
  }
});
