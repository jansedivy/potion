# Potion

HTML5 canvas game engine

## Documentation

- [API](/docs/api/)

## Installation

### Include potion.js file

- download [potion.js](https://raw.githubusercontent.com/jansedivy/potion/master/build/potion.js) or [potion.min.js](https://raw.githubusercontent.com/jansedivy/potion/master/build/potion.min.js)
- Add this into your html file `<script src="potion.js"></script>`

### Browserify

- `npm install potion`
- `browserify main.js -o bundle.js`

## Features

- Asset loader
- Input event handling
- Sound manager
- State manager
- Multiple canvas layers
- Retina support

## Usage

```html
<div class="container"></div>
```

```javascript
var Potion = require('potion'); // if you use browserify version

Potion.init(document.querySelector('.container'), {
  configure: function() {
    this.setSize(400, 400);
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


## See also

- [Potion Audio](https://github.com/jansedivy/potion-audio)
- [Potion Debugger](https://github.com/jansedivy/potion-debugger)
- [Potion Template](https://github.com/jansedivy/potion-template)

## License

[MIT license](http://opensource.org/licenses/mit-license.php)
