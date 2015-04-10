var utils = require('./utils');
var path = require('path');

var PotionAudio = require('potion-audio');

/**
 * Class for managing and loading asset files
 * @constructor
 */
var Assets = function() {
  /**
   * Is currently loading any assets
   * @type {boolean}
   */
  this.isLoading = false;

  this.itemsCount = 0;
  this.loadedItemsCount = 0;
  this.progress = 0;

  this._xhr = new XMLHttpRequest();

  this._thingsToLoad = 0;
  this._data = {};
  this._preloading = true;

  this.callback = null;

  this._toLoad = [];

  this.audio = new PotionAudio();
};

/**
 * Starts loading stored assets urls and runs given callback after everything is loaded
 * @param {function} callback - callback function
 */
Assets.prototype.onload = function(callback) {
  this.callback = callback;

  if (this._thingsToLoad === 0) {
    this.isLoading = false;
    this._preloading = false;
    process.nextTick(function() {
      callback();
    });
  } else {
    this._nextFile();
  }
};

/**
 * Getter for loaded assets
 * @param {string} name - url of stored asset
 */
Assets.prototype.get = function(name) {
  return this._data[path.normalize(name)];
};

Assets.prototype.remove = function(name) {
  this.set(name, null);
};


/**
 * Used for storing some value in assets module
 * useful for overrating values
 * @param {string} name - url of the asset
 * @param {any} value - value to be stored
 */
Assets.prototype.set = function(name, value) {
  this._data[path.normalize(name)] = value;
};

/**
 * Stores url so it can be loaded later
 * @param {string} type - type of asset
 * @param {string} url - url of given asset
 * @param {function} callback - callback function
 */
Assets.prototype.load = function(type, url, callback) {
  var loadObject = { type: type, url: url != null ? path.normalize(url) : null, callback: callback };

  if (this._preloading) {
    this.isLoading = true;
    this.itemsCount += 1;
    this._thingsToLoad += 1;

    this._toLoad.push(loadObject);
  } else {
    var self = this;
    this._loadAssetFile(loadObject, function(data) {
      self.set(loadObject.url, data);
      if (callback) { callback(data); }
    });
  }
};

Assets.prototype._finishedOneFile = function() {
  this._nextFile();
  this.progress = this.loadedItemsCount / this.itemsCount;
  this._thingsToLoad -= 1;
  this.loadedItemsCount += 1;

  if (this._thingsToLoad === 0) {
    var self = this;
    setTimeout(function() {
      self.callback();
      self._preloading = false;
      self.isLoading = false;
    }, 0);
  }
};

Assets.prototype._error = function(type, url) {
  console.warn('Error loading "' + type + '" asset with url ' + url);
  this._nextFile();
};

Assets.prototype._save = function(url, data, callback) {
  this.set(url, data);
  if (callback) { callback(data); }
  this._finishedOneFile();
};

Assets.prototype._handleCustomLoading = function(loading) {
  var self = this;
  var done = function(name, value) {
    self._save(name, value);
  };
  loading(done);
};

Assets.prototype._nextFile = function() {
  var current = this._toLoad.shift();

  if (!current) { return; }

  var self = this;
  this._loadAssetFile(current, function(data) {
    self._save(current.url, data, current.callback);
  });
};

Assets.prototype._loadAssetFile = function(file, callback) {
  var type = file.type;
  var url = file.url;

  var self = this;

  if (utils.isFunction(type)) {
    this._handleCustomLoading(type);
    return;
  }

  type = type.toLowerCase();

  var request = this._xhr;

  switch (type) {
    case 'json':
      request.open('GET', url, true);
      request.responseType = 'text';
      request.onload = function() {
        var data = JSON.parse(this.response);
        callback(data);
      };
      request.onerror = function() { self._error(type, url); };
      request.send();
      break;
    case 'mp3':
    case 'music':
    case 'sound':
      self.audio.load(url, function(audio) {
        callback(audio);
      });
      break;
    case 'image':
    case 'texture':
    case 'sprite':
      var image = new Image();
      image.onload = function() {
        callback(image);
      };
      image.onerror = function() { self._error(type, url); };
      image.src = url;
      break;
    default: // text files
      request.open('GET', url, true);
      request.responseType = 'text';
      request.onload = function() {
        var data = this.response;
        callback(data);
      };
      request.onerror = function() { self._error(type, url); };
      request.send();
      break;
  }
};

module.exports = Assets;
