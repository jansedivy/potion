var get = exports.get = function(url, callback) {
  var request = new XMLHttpRequest();
  request.open('GET', url, true);

  request.onload = function() {
    callback(this.response);
  };

  request.send();
};

var getJSON = exports.getJSON = function(url, callback) {
  get(url, function(text) {
    callback(JSON.parse(text));
  });
};

exports.isFunction = function(obj) {
  return !!(obj && obj.constructor && obj.call && obj.apply);
};
