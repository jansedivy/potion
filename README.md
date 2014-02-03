# Potion

HTML5 canvas game engine

```
var Engine = require('./engine');

Engine.init(document.querySelector('canvas'), {
  setupSize: function() {
    this.canvasWidth = this.width = document.body.clientWidth;
    this.canvasHeight = this.height = document.body.clientHeight;
  },

  config: function() {
    this.load = {
      sprite: './sprite.json',
      spriteImage: './sprite.png'
    };
  },

  start: function() {
    this.x = 0;
  },

  update: function(time) {
    this.x += 10 * time;
  },

  render: function() {
    this.video.ctx.fillRect(this.x, 10, 10, 10);
  }
});
```
