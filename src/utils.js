exports.getJSON = function(url, callback) {
  var request = new XMLHttpRequest();
  request.open('GET', url, true);

  request.onload = function() {
    var data = JSON.parse(this.response);
    callback(data);
  };

  request.send();
};
