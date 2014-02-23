# Potion

HTML5 canvas game engine

## Installation

### Include potion.js file

- download [potion.js](https://raw2.github.com/jsedivy/potion/master/build/potion.js) or [potion.min.js](https://raw2.github.com/jsedivy/potion/master/build/potion.min.js)
- Add this into your html file `<script src="potion.js"></script>`

### Browserify

- `npm install potion`
- `browserify main.js -o bundle.js`

## Features

- Asset loader
- sounds
- Sprites
- Retina support

## Usage

```javascript
var Potion = require('potion'); // if you use browserify version

Potion.init(document.querySelector('canvas'), {
  resize: function() {
    this.width = document.body.clientWidth;
    this.height = document.body.clientHeight;
  },

  init: function() {
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
