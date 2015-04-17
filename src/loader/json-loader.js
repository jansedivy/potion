module.exports = function(url, loader) {
  var request = new XMLHttpRequest();

  request.open('GET', url, true);
  request.responseType = 'text';
  request.onload = function() {
    if (request.status !== 200) {
      return loader.error(url);
    }

    var data = JSON.parse(this.response);
    loader.done(data);
  };
  request.send();
};
