/* global Howl */

var utils = require('./utils');

require('../lib/howler.min.js');

/**
 * Class for assets loading
 * @constructor
 */
var Assets = function() {
  this.thingsToLoad = 0;
  this._data = {};
};

Assets.prototype.onload = function(callback) {
  this.callback = callback;
  if (this.thingsToLoad === 0) {
    setTimeout(callback, 0);
  }
};

Assets.prototype.get = function(name) {
  return this._data[name];
};

Assets.prototype._handleCustomLoading = function(loading) {
  var self = this;
  var done = function(name, value) {
    self._save(name, value);
  };
  loading(done);
};

Assets.prototype.load = function(type, url, callback) {
  var self = this;
  this.thingsToLoad += 1;

  if (utils.isFunction(type)) {
    this._handleCustomLoading(type);
    return;
  }

  type = type.toLowerCase();

  var request = new XMLHttpRequest();

  switch (type) {
    case 'json':
      request.open('GET', url, true);
      request.responseType = 'text';
      request.onload = function() {
        var data = JSON.parse(this.response);
        self._save(url, data, callback);
      };
      request.send();
      break;
    case 'mp3':
    case 'music':
    case 'sound':
      var sound = new Howl({
        urls: [url],
        onload: function() {
          self._save(url, sound, callback);
        }
      });
      break;
    case 'image':
    case 'texture':
    case 'sprite':
      var image = new Image();
      image.onload = function() {
        self._save(url, image, callback);
      };
      image.src = url;
      break;
    default: // text files
      request.open('GET', url, true);
      request.responseType = 'text';
      request.onload = function() {
        var data = this.response;
        self._save(url, data, callback);
      };
      request.send();
      break;
  }
};

Assets.prototype._save = function(url, data, callback) {
  this._data[url] = data;
  if (callback) { callback(data); }
  this.finishedOneFile();
};

Assets.prototype.finishedOneFile = function() {
  this.thingsToLoad -= 1;
  if (this.thingsToLoad === 0) {
    this.callback();
  }
};

module.exports = Assets;
