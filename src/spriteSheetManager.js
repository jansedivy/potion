var getJSON = require('./utils').getJSON;

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
  if (!json) { return callback(); }

  var self = this;

  var image = new Image();
  image.onload = function() {
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
