var Class = require('./class');

var getJSON = function(url, callback) {
  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.onload = function() {
    var data = JSON.parse(this.response);
    callback(data);
  };
  request.send();
};

module.exports = Class.extend({
  init: function() {
    this.data = [];
    this.sprite = null;
  },

  load: function(json, imagePath, callback) {
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
  },

  get: function(name) {
    return this.data[name];
  }
});
