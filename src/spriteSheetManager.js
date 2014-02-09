var getJSON = require('./utils').getJSON;

var SpriteSheetManager = function() {
  this.data = [];
  this.image = null;
};

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

SpriteSheetManager.prototype.get = function(name) {
  return this.data[name];
};

module.exports = SpriteSheetManager;
