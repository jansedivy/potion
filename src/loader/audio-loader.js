module.exports = function(manager) {
  return function(url, loader) {
    manager.load(url, function(data) {
      loader.done(data);
    });
  };
};
