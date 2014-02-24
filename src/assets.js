/* global soundManager */

require('./lib/soundmanager2');

/**
 * Class for loading music
 * @constructor
 */
var Assets = function() {
  /**
   * Loaded sounds
   * @type {object}
   */
  this.sounds = {};

  /**
   * default path for assets
   * @type {string}
   */
  this.basePath = 'assets/';

  /**
   * Default path for sound
   * @type {string}
   */
  this.soundsPath = 'sounds/';
};

/**
 * Method that creates sound object
 * @param {string} path - sound path (without base path)
 * @param {function} callback - callback function that is called when sound is loaded
 */
Assets.prototype.createSound = function(path, callback) {
  var sound = soundManager.createSound({
    autoLoad: true,
    autoPlay: false,
    url: this.basePath + this.soundsPath + path
  }).load({ onload: callback });

  this.sounds[path] = sound;
};

/**
 * Load specified data
 * @param {object} data - data to load
 * @param {function} callback - function that is called when everything is loaded
 */
Assets.prototype.load = function(data, callback) {
  this.assetsPath = data.assetsPath || this.assetsPath;

  if (!data.sounds) {
    callback();
  } else {
    this.soundsPath = data.soundsPath || this.soundsPath;

    var soundsToLoad = data.sounds.length;

    var soundLoaded = function() {
      soundsToLoad -= 1;
      if (soundsToLoad <= 0) {
        callback();
      }
    };

    var self = this;
    soundManager.onload = function() {
      for (var i=0, len=data.sounds.length; i<len; i++) {
        var path = data.sounds[i];
        self.createSound(path, soundLoaded);
      }
    };
  }
};

/**
 * Get sound with specified name
 * @param {string} name - sound name
 * @return {object} sound object
 */
Assets.prototype.getSound = function(name) {
  return this.sounds[name];
};

module.exports = Assets;
