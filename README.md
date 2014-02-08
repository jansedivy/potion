# Potion

HTML5 canvas game engine

```javascript
var Potion = require('potion');

Potion.init(document.querySelector('canvas'), {
  resize: function() {
    this.canvasWidth = this.width = document.body.clientWidth;
    this.canvasHeight = this.height = document.body.clientHeight;
  },

  start: function() {
    this.x = 0;
    this.y = 0;
    this.dx = 0;
    this.dy = 0;
  },

  update: function(time) {
    if (this.input.isKeyDown('w')) { this.dy -= 5000 * time; }
    if (this.input.isKeyDown('d')) { this.dx += 5000 * time; }
    if (this.input.isKeyDown('s')) { this.dy += 5000 * time; }
    if (this.input.isKeyDown('a')) { this.dx -= 5000 * time; }

    this.dx = this.dx + (0 - this.dx) * 8 * time;
    this.dy = this.dy + (0 - this.dy) * 8 * time;

    this.x += this.dx * time;
    this.y += this.dy * time;
  },

  render: function() {
    this.video.ctx.fillRect(this.x, this.y, 10, 10);
  }
});
```
