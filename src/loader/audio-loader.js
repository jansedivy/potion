module.exports = function(manager) {
  return function(url, loader) {
    manager.load(url, {
      done: function(data) {
        loader.done(data);
      },

      progress: function(e) {
        var percent = e.loaded / e.total;
        loader.progress(percent);
      }
    });
  };
};
