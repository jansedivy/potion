var Engine = require('./engine');

module.exports = {
  init: function(canvas, methods) {
    var engine = new Engine(canvas, methods);
    return engine.game;
  },

  Class: require('./class'),
  Bounds: require('./bounds'),
  MathUtil: require('./mathUtil')
};
