var Engine = require('./src/engine');

module.exports = {
  init: function(canvas, methods) {
    var engine = new Engine(canvas, methods);
    return engine.controller;
  }
};
