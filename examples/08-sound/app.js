var Potion = require('potion');

var app = Potion.init(document.querySelector('.game'), {
  configure: function() {
    this.assets.load('music', 'sounds/bullet.wav');
    this.assets.load('music', 'sounds/hit.wav');
    this.assets.load('music', 'sounds/hit2.wav');
    this.assets.load('music', 'sounds/pickup.wav');
    this.assets.load('music', 'sounds/power-up.wav');

    this.sounds = [
      'sounds/bullet.wav',
      'sounds/hit.wav',
      'sounds/hit2.wav',
      'sounds/pickup.wav',
      'sounds/power-up.wav'
    ];
  },

  mousedown: function() {
    app.assets.get(this.sounds[Math.floor(Math.random() * this.sounds.length)]).play();
  }
});
