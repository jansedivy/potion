module.exports = function(url, loader) {
  var image = new Image();
  image.onload = function() {
    loader.done(image);
  };
  image.onerror = function() {
    loader.error(url);
  };
  image.src = url;
};
