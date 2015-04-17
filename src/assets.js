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
    this._loadAssetFile(current, function(name, data) {
      this.set(name, data);
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
    callback: callback,
    progress: 0
  };

  if (this._preloading) {
    this._queueFile(loadObject);
  } else {
    this._loadAssetFile(loadObject, function(name, data) {
      this.set(name, data);
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

  if (this._thingsToLoad === 0) {
    this._done();
  }
};

Assets.prototype._updateProgress = function() {
  var sum = 0;

  for (var i=0; i<this._toLoad.length; i++) {
    sum += this._toLoad[i].progress;
  }

  this.progress = sum/this._toLoad.length;
};

Assets.prototype._error = function(url) {
  console.warn('Error loading "' + url + '" asset');
};

Assets.prototype._handleCustomLoading = function(loading, loader) {
  loading(function(name, value) {
    loader.done(value, name);
  });
};

Assets.prototype._loadAssetFile = function(file, callback) {
  var type = file.type;
  var url = file.url;

  var manager = {
    done: function(data, name) {
      name = name == null ? file.url : name;

      file.progress = 1;
      callback(name, data);
      this._updateProgress();
    }.bind(this),

    error: function() {
      this._error.bind(this);
    }.bind(this),

    progress: function(percent) {
      file.progress = percent;
      this._updateProgress();
    }.bind(this)
  };

  if (util.isFunction(type)) {
    this._handleCustomLoading(type, manager);
  } else {
    type = type.toLowerCase();
    var loader = this._loaders[type] || textLoader;
    loader(url, manager);
  }
};

Assets.prototype._done = function() {
  this.isLoading = false;
  this._preloading = false;
  setTimeout(this._callback, 0);
};


module.exports = Assets;
