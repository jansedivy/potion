module.exports = function(url, loader) {
  var URL = window.URL || window.webkitURL;

  if (URL && "createObjectURL" in URL && "Uint8Array" in window && "Blob" in window) {
    var request = new XMLHttpRequest();

    request.open('GET', url, true);
    request.responseType = 'arraybuffer';

    request.addEventListener('progress', function(e) {
      var percent = e.loaded / e.total;
      loader.progress(percent);
    });

    request.onload = function() {
      if (request.status !== 200) {
        return loader.error(url);
      }

      var data = this.response;
      var blob = new Blob([new Uint8Array(data)], { type: 'image/png' });
      var image = new Image();
      image.src = URL.createObjectURL(blob);
      loader.done(image);
    };
    request.send();

    return;
  }

  var image = new Image();
  image.onload = function() {
    loader.done(image);
  };
  image.onerror = function() {
    loader.error(url);
  };
  image.src = url;
};
