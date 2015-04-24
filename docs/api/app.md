# API: `App`

Object returned from Potion.init(). holds all components for communicating with Potion api like Rendering, Audio, Assets, Input, ...

Properties
----------

### `canvas`

DOM reference to the actual canvas element.

### `width`

Width of the game in pixels

### `height`

Height of the game in pixels

### `config`

Object for configuring Potion. Can only be used in `configure()` entry point.

#### Example
```javascript
this.config.fixedStep = true;
```

#### Default values

```javascript
{
  allowHiDPI: true,
  getCanvasContext: true,
  addInputEvents: true,
  showPreloader: true,
  fixedStep: false,
  stepTime: 1/60,
  maxStepTime: 1/60
}
```

### `assets`

Instance of [`Assets`](/docs/api/assets.md)

### `states`

Instance of [`States`](/docs/api/states.md)

### `input`

Instance of [`Input`](/docs/api/input.md)

### `video`

Instance of [`Video`](/docs/api/video.md)

### `debug`

Instance of [`Debugger`](https://github.com/jansedivy/potion-debugger)

Methods
-------

### Entry points

Rest of the methods are defined in [States](/docs/api/states.md)

#### `init()`

This method is called when all assets are loaded.

#### `configure()`

Method for configuring potion, setting up width and height and the main thing is to define which assets to load.

#### `preloading()`

This method is used for rendering loading bar. Could be overwritten to rendering different style of the loading bar.

#### `setSize(width, height)`

Method which sets width and height of the app and the canvas element. This also resizes all the nested Video instances.

#### `focus()`

Event which is called when browser gets focus

#### `blur()`

Event which is called when browser gets blur

