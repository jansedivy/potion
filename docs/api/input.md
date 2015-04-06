# API: `Input`

Input object is used for getting current state of user input like mouse and keyboard.

Properties
----------

### `mouse`

Object which contains information about the current state of the mouse

```javascript
input.mouse.isLeftDown // if the right button is pressed
input.mouse.isRightDown // if the left button is pressed
input.mouse.isMiddleDown // if the scroll wheel is pressed
input.mouse.isDown // if any button is pressed
input.mouse.x // x coordinate
input.mouse.y // y coordinate
```

Methods
-------

#### `isKeyDown(key)`

Function used for testing if some key is pressed right now. This method is good for doing something every frame, like moving a player.

`key` - could be either string name of the key or number representing the keyCode defined in [keys](/src/keys.js)

##### Example

```javascript
if (app.input.isKeyDown('space')) {
}

if (app.input.isKeyDown(32)) { // 32 is keyCode for space
}
```

#### 'resetKeys()'

Resets currently pressed keys.
