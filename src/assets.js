var util = require('util');
var path = require('path');

var PotionAudio = require('potion-audio');

var JsonLoader = require('./loader/json-loader');
var imageLoader = require('./loader/image-loader');
var textLoader = require('./loader/text-loader');

var Assets = function() {
  this.isLoading = false;

  this.itemsCount = 0;
  this.progress = 0;

  this._thingsToLoad = 0;
  this._data = {};
  this._preloading = true;

  this._callback = null;

  this._toLoad = [];

  this._loaders = {};

  this.audio = new PotionAudio();

  this.addLoader('json', JsonLoader);

  this.addLoader('mp3', this.audio.load.bind(this.audio));
  this.addLoader('music', this.audio.load.bind(this.audio));
  this.addLoader('sound', this.audio.load.bind(this.audio));

  this.addLoader('image', imageLoader);
  this.addLoader('texture', imageLoader);
  this.addLoader('sprite', imageLoader);
};

Assets.prototype.addLoader = function(name, fn) {
  this._loaders[name] = fn;
};

Assets.prototype.start = function(callback) {
  this._callback = callback;

  this._toLoad.forEach(function(current) {
    this._loadAssetFile(current, function(data, name) {
      var finalName = name == null ? current.url : name;
      this.set(finalName, data);
      if (current.callback) { current.callback(data); }

      this._finishedQueuedFile();
    }.bind(this));
  }.bind(this));

  this._thingsToLoad = this.itemsCount;

  if (this._thingsToLoad === 0) {
    this._done();
  }
};

Assets.prototype.get = function(name) {
  return this._data[path.normalize(name)];
};

Assets.prototype.set = function(name, value) {
  this._data[path.normalize(name)] = value;
};

Assets.prototype.remove = function(name) {
  this.set(name, null);
};

Assets.prototype.load = function(type, url, callback) {
  var loadObject = {
    type: type,
    url: (url != null ? path.normalize(url) : null),
    callback: callback
  };

  if (this._preloading) {
    this._queueFile(loadObject);
  } else {
    this._loadAssetFile(loadObject, function(data, name) {
      var finalName = name == null ? loadObject.url : name;
      this.set(finalName, data);
      if (callback) { callback(data); }
    }.bind(this));
  }
};

Assets.prototype._queueFile = function(loadObject) {
  this.isLoading = true;
  this.itemsCount += 1;

  this._toLoad.push(loadObject);
};

Assets.prototype._finishedQueuedFile = function() {
  this._thingsToLoad -= 1;
  this.progress = (this.itemsCount - this._thingsToLoad) / this.itemsCount;

  if (this._thingsToLoad === 0) {
    this._done();
  }
};

Assets.prototype._error = function(url) {
  console.warn('Error loading "' + url + '" asset');
};

Assets.prototype._handleCustomLoading = function(loading, callback) {
  loading(function(name, value) {
    callback(value, name);
  });
};

Assets.prototype._loadAssetFile = function(file, callback) {
  var type = file.type;
  var url = file.url;

  if (util.isFunction(type)) {
    this._handleCustomLoading(type, callback);
    return;
  }

  type = type.toLowerCase();

  var loader = this._loaders[type] || textLoader;
  loader(url, callback, this._error.bind(this));
};

Assets.prototype._done = function() {
  this.isLoading = false;
  this._preloading = false;
  setTimeout(this._callback, 0);
};


module.exports = Assets;
