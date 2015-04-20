# Potion

[![npm version](https://badge.fury.io/js/potion.svg)](http://badge.fury.io/js/potion)

Potion is a game library with very simple and powerful abstractions.

- Asset loader
- Input event handling
- Sound manager
- State manager
- Multi-layered canvas
- HiDPI monitor support
- Debugger for in game logging and switch toggling


#### [Examples](http://potionjs.com)

## Documentation

- [API](/docs/api/)

## Installation

Potion is compatible with CommonJS modules. Can be used with browserify,
webpack and others. You can install it from npm.

```sh
npm install potion
```

There is also a built version you can download

- [potion.js](https://raw.githubusercontent.com/jansedivy/potion/master/build/potion.js)
- [potion.min.js](https://raw.githubusercontent.com/jansedivy/potion/master/build/potion.min.js)

## Usage

```html
<div class="container"></div>
```

```javascript
var Potion = require('potion');

var app = Potion.init(document.querySelector('.container'), {
  configure: function() {
    app.setSize(400, 400);
  },

  init: function() {
    this.x = 0;
    this.y = 0;
    this.dx = 0;
    this.dy = 0;
  },

  update: function(time) {
    if (app.input.isKeyDown('w')) { this.dy -= 5000 * time; }
    if (app.input.isKeyDown('d')) { this.dx += 5000 * time; }
    if (app.input.isKeyDown('s')) { this.dy += 5000 * time; }
    if (app.input.isKeyDown('a')) { this.dx -= 5000 * time; }

    this.dx = this.dx + (0 - this.dx) * 8 * time;
    this.dy = this.dy + (0 - this.dy) * 8 * time;

    this.x += this.dx * time;
    this.y += this.dy * time;
  },

  render: function() {
    app.video.ctx.fillRect(this.x, this.y, 10, 10);
  }
});
```


## See also

- [Potion Audio](https://github.com/jansedivy/potion-audio)
- [Potion Debugger](https://github.com/jansedivy/potion-debugger)
- [Potion Template](https://github.com/jansedivy/potion-template)

## License

[MIT license](http://opensource.org/licenses/mit-license.php)
