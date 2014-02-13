var getJSON = require('./utils').getJSON;

var animation = require('./animation');

/**
 * Class for loading images
 * @constructor
 */
var SpriteSheetManager = function() {
  /**
   * Sprite data
   * @type {object}
   */
  this.data = {};

  /**
   * animation class
   * @type {Animation}
   */
  this.animation = animation;

  /**
   * sprite image
   * @type {HTMLImageElement|null}
   */
  this.image = null;
};

/**
 * Load json file and actual sprite image
 * @param {string} json - path to the json file
 * @param {string} imagePath - path to the image
 * @param {function} callback - function that is called after everything is loaded
 */
SpriteSheetManager.prototype.load = function(json, imagePath, callback) {
  if (!json) { return setTimeout(callback, 0); }

  var self = this;

  var image = new Image();
  image.onload = function() {
    for (var name in self.data) {
      var item = self.data[name];
      item.image = image;
    }

    self.image = image;
    callback();
  };

  getJSON(json, function(data) {
    self.data = data;
    image.src = imagePath;
  });
};

/**
 * Get data about specific image
 * @param {string} name - image name
 * @return {object}
 */
SpriteSheetManager.prototype.get = function(name) {
  return this.data[name];
};

module.exports = SpriteSheetManager;
