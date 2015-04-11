module.exports = function(url, callback, error) {
  var request = new XMLHttpRequest();

  request.open('GET', url, true);
  request.responseType = 'text';
  request.onload = function() {
    if (request.status !== 200) {
      return error(url);
    }

    var data = JSON.parse(this.response);
    callback(data);
  };
  request.send();
};
