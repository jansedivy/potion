# API: `Assets`

Object which is used for storing and loading assets used in the app.

The only place to tell `Assets` which files to load is `configure()` hook in `App` object.

### Example

```javascript
configure: function() {
  this.assets.load('image', 'foo.png');
  this.assets.load('image', 'bar.png');
  this.assets.load('image', 'baz.png');

  this.assets.load('text', 'file.txt');

  this.assets.load('json', 'map.json');

  this.assets.load('music', 'victory.wav');
}
```

Properties
----------

### `isLoading`

Property which indicates if the app is stil loading.

### `itemsCount`

Number of items to load.

### `loadedItemsCount`

Number of already loaded items.

### `progress`

Number between 0 and 1 which tells how far we are in loading.

Methods
-------

#### `load(type, path)`

Main function which defines what file to load.

`type` - file type of given path. It's used for setting up images, json, music, text files

`path` - url of the file

##### File types

(`json`) - JSON file

(`mp3`, `music`, `sound`) - Sound file, returns item from [Audio](https://github.com/jansedivy/potion-audio) libary

(`image`, `texture`, `sprite`) - Image file, returns instance of `Image` object

default - text file

#### `get(path)`

Method for getting loaded items

`path` - path of the loaded asset. Must be same as given to `load` method.

#### `set(path, value)`

Method for setting items in assets. Used for overwriting items in assets object.

`path` - path of the asset

`value` - value to store in assets object
