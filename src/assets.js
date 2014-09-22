/* global Howl */

var utils = require('./utils');

require('../lib/howler.min.js');

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

  this._xhr = new XMLHttpRequest();

  this._thingsToLoad = 0;
  this._data = {};

  this.callback = null;

  this._toLoad = [];
};

/**
 * Starts loading stored assets urls and runs given callback after everything is loaded
 * @param {function} callback - callback function
 */
Assets.prototype.onload = function(callback) {
  this.callback = callback;

  if (this._thingsToLoad === 0) {
    this.isLoading = false;
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
  return this._data[name];
};

Assets.prototype.set = function(name, value) {
  this._data[name] = value;
};

/**
 * Stores url so it can be loaded later
 * @param {string} type - type of asset
 * @param {string} url - url of given asset
 * @param {function} callback - callback function
 */
Assets.prototype.load = function(type, url, callback) {
  this.isLoading = true;
  this.itemsCount += 1;
  this._thingsToLoad += 1;

  this._toLoad.push({ type: type, url: url, callback: callback });
};

Assets.prototype._finishedOneFile = function() {
  this._nextFile();
  this._thingsToLoad -= 1;

  if (this._thingsToLoad === 0) {
    var self = this;
    setTimeout(function() {
      self.callback();
      self.isLoading = false;
    }, 0);
  }
};

Assets.prototype._error = function(type, url) {
  console.warn('Error loading "' + type + '" asset with url ' + url);
  this._nextFile();
};

Assets.prototype._save = function(url, data, callback) {
  this._data[url] = data;
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

  var type = current.type;
  var url = current.url;
  var callback = current.callback;

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
        self._save(url, data, callback);
      };
      request.onerror = function() { self._error(type, url); };
      request.send();
      break;
    case 'mp3':
    case 'music':
    case 'sound':
      var sound = new Howl({
        urls: [url],
        onload: function() {
          self._save(url, sound, callback);
        },
        onloaderror: function() { self._error(type, url); }
      });
      break;
    case 'image':
    case 'texture':
    case 'sprite':
      var image = new Image();
      image.onload = function() {
        self._save(url, image, callback);
      };
      image.onerror = function() { self._error(type, url); };
      image.src = url;
      break;
    default: // text files
      request.open('GET', url, true);
      request.responseType = 'text';
      request.onload = function() {
        var data = this.response;
        self._save(url, data, callback);
      };
      request.onerror = function() { self._error(type, url); };
      request.send();
      break;
  }
};

module.exports = Assets;
