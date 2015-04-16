# API: `Video`

Main object for managing canvas and rendering.

Properties
----------

### `canvas`

DOM reference to canvas element

### `width`

Width of the game in pixels

### `height`

Height of the game in pixels

### `ctx`

Canvas 2d rendering context. Main object used for the actual rendering.

Methods
-------

#### `beginFrame()`

Method called on the beginning of every frame. Could be overwritten to do something special.

#### `endFrame()`

Method called on the end of every frame. Could be overwritten to do something special.

#### `scaleCanvas(scale)`

Method for scaling pixel density of the canvas element. Used for HiDPI screens.

`scale` - number on how much to scale the canvas element

#### `setSize(width, height)`

Sets the width and height

#### `clear()`

Methods which clears the screen. Could be overwritten for different rendering, like WebGL.

#### `createLayer()`

`returns` - `Video` instance

Creates new `Video` instance and new canvas element which is then placed on top
of the current one. This is used for multi canvas rendering. For example
debugger is on its own canvas element.

#### `destroy()`

Removes canvas element from the container.
