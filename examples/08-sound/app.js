var Potion = require('potion');

var app = Potion.init(document.querySelector('.game'), {
  configure: function() {
    app.assets.load('music', 'sounds/bullet.wav');
    app.assets.load('music', 'sounds/hit.wav');
    app.assets.load('music', 'sounds/hit2.wav');
    app.assets.load('music', 'sounds/pickup.wav');
    app.assets.load('music', 'sounds/power-up.wav');

    this.sounds = [
      'sounds/bullet.wav',
      'sounds/hit.wav',
      'sounds/hit2.wav',
      'sounds/pickup.wav',
      'sounds/power-up.wav'
    ];
  },

  mousedown: function() {
    var index = Math.floor(Math.random() * this.sounds.length);
    var sound = app.assets.get(this.sounds[index]);
    sound.play();
  },

  render: function() {
    app.video.ctx.fillStyle = 'black';
    app.video.ctx.font = '20px sans-serif';
    app.video.ctx.textAlign = 'left';
    app.video.ctx.textBaseline = 'top';
    app.video.ctx.fillText(app.audio.isMuted ? 'Muted' : '', 10, 10);
  },

  keydown: function(value) {
    if (value.name === 'm') {
      app.audio.toggleMute();
    }
  }
});
