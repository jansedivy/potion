module.exports = function(url, loader) {
  var request = new XMLHttpRequest();

  request.open('GET', url, true);
  request.responseType = 'text';

  request.addEventListener('progress', function(e) {
    var percent = e.loaded / e.total;
    loader.progress(percent);
  });

  request.onload = function() {
    if (request.status !== 200) {
      return loader.error(url);
    }

    var data = this.response;
    loader.done(data);
  };
  request.send();
};
