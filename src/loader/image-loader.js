module.exports = function(url, callback, error) {
  var image = new Image();
  image.onload = function() {
    callback(image);
  };
  image.onerror = function() {
    error(url);
  };
  image.src = url;
};
