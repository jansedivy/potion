# API: `App`

App object is the main entry point for Potion to call update/render and all input methods.

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
  useRetina: true,
  initializeCanvas: true,
  initializeVideo: true,
  addInputEvents: true,
  showPreloader: true,
  fixedStep: false,
  stepTime: 0.01666,
  maxStepTime: 0.01666
};
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

#### `init()`

This method is called when all assets are loaded.

#### `configure()`

Method for configuring potion, setting up width and height and main probably the main thing is to define which assets to load.

#### `render()`

This method is called every frame. Used for rendering.

#### `update(time)`

This method is called every frame. Used for updating.

`time` is the difference in seconds from the last frame.

#### `exitUpdate(time)`

#### `preloading()`

This method is used for rendering loading bar. Could be overwritten to rendering different style of the loading bar.

#### `setSize(width, height)`

Method which sets width and height of the app and the canvas element.

#### `focus()`

Event which is called when browser gets focus

#### `blur()`

Event which is called when browser gets blur

#### `click(x, y, button)`

Event which is called when the user clicks on the canvas element

`x` - x coordinate of the action

`y` - y coordinate of the action

`button` - which mouse button was used (1, 2, 3)

#### `mousemove(x, y, button)`

Event which is called when the user moves mouse over the canvas element

`x` - x coordinate of the action

`y` - y coordinate of the action

`button` - which mouse button was used (1, 2, 3)

#### `mousedown(x, y, button)`

Event which is called when the user do mousedown over the canvas element

`x` - x coordinate of the action

`y` - y coordinate of the action

`button` - which mouse button was used (1, 2, 3)

#### `mouseup(x, y, button)`

Event which is called when the user do mouseup over the canvas element

`x` - x coordinate of the action

`y` - y coordinate of the action

`button` - which mouse button was used (1, 2, 3)

#### `keydown(keyCode, e)`

Event which is called when the user do presses some key

`keyCode` - code number of the pressed key

`e` - event object

#### `keyup(keyCode, e)`

Event which is called when the user do releases some key

`keyCode` - code number of the pressed key

`e` - event object

#### `keypress(keyCode, e)`

Event which is called when the user do presses some key

`keyCode` - code number of the pressed key

`e` - event object
