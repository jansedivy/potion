# API: `States`

Object for managing different states in application. State could be menu, pause,
game, inventory and others. Each state has its own update and render method. It
even has all the keyboard and mouse events. State could be paused/unpaused, disabled/enabled,
hid/showed and destroyed.

Methods
-------

#### `add(name, state)`

Registers state with given. State is normal object or instance.

```javascript
app.states.add('game', new Game());
```

#### `get(name)`

Returns state holder with given name. It doesn't return the actual state
object, but another object with defines if the state is paused and so on. On
this object there is property to the actual state.

#### `enable(name)`

Enables and unpauses state with given name. Enabled state is getting all events and is updated and rendered.

#### `disable(name)`

Disables state with given name. Disabled state is not getting events and isn't updated and rendered.

#### `hide(name)`

Hides state with given name. Hidden is not rendered.

#### `show(name)`

Shows state with given name. Showed state is rendered.

#### `pause(name)`

Pauses state with given name. Paused state is not updated.

#### `unpause(name)`

Unpauses state with given name. Unpaused state is updated.

#### `protect(name)`

Protects state with given name. Protected state cannot be removed with `destroyAll`.

#### `unprotect(name)`

Unprotects state with given name.

#### `destroy(name)`

Destroys state with given name.

#### `destroyAll()`

Destroys all unprotected states.

#### `setUpdateOrder(name, order)`

Sets priority number on which order to update states.

#### `setRenderOrder(name, order)`

Sets priority number on which order to render states.

### Functions called on states

#### `init()`

Called when the state is successfully in the state system. This is the main
init function and should be used over constructor functions.

#### `render()`

This method is called every frame. Used for rendering.

#### `update(time)`

This method is called every frame. Used for updating.

`time` is the difference in seconds from the last frame.

#### `exitUpdate(time)`

#### `mousemove(value)`

Event which is called when the user moves mouse over the canvas element

##### `value` Mouse Event object

`x` - x coordinate of the action

`y` - y coordinate of the action

#### `mousedown(value)`

Event which is called when the user do mousedown over the canvas element

##### `value` Mouse Event object

`x` - x coordinate of the action

`y` - y coordinate of the action

`button` - which mouse button was used (1, 2, 3)

#### `mouseup(value)`

Event which is called when the user do mouseup over the canvas element

##### `value` Mouse Event object

`x` - x coordinate of the action

`y` - y coordinate of the action

`button` - which mouse button was used (1, 2, 3)

#### `keydown(value)`

Event which is called when the user do presses some key

##### `value` Keyboard Event object

`key` - code number of the pressed key

`name` - string name of the key

`e` - event object

#### `keyup(value)`

Event which is called when the user do releases some key

##### `value` Keyboard Event object

`key` - code number of the pressed key

`name` - string name of the key

`e` - event object

#### `focus()`

Event which is called when browser gets focus

#### `blur()`

Event which is called when browser gets blur
