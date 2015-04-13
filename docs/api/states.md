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

## Input Events

### Mouse

#### `mousemove(value)`

Event which is called when the user moves mouse over the canvas element

- `value` is `Mouse Event Object` defined below

#### `mousedown(value)`

Event which is called when the user do mousedown over the canvas element

- `value` is `Mouse Event Object` defined below

#### `mouseup(value)`

Event which is called when the user do mouseup over the canvas element

- `value` is `Mouse Event Object` defined below

### Keyboard

#### `keydown(value)`

Event which is called when the user do presses some key

- `value` is `Keyboard Event Object` defined below

#### `keyup(value)`

Event which is called when the user do releases some key

- `value` is `Keyboard Event Object` defined below

### Mouse Event object

This object is passed to the event methods.

`value.x` - x coordinate of the action

`value.y` - y coordinate of the action

`value.button` - which mouse button is pressed, either (1, 2, 3)

`value.event` - event object

`value.stateStopEvent()` - function which stops event propagation on the other states

### Keyboard Event object

`value.key` - code number of the pressed key

`value.name` - string name of the key

`value.event` - event object

`value.stateStopEvent()` - function which stops event propagation on the other states
