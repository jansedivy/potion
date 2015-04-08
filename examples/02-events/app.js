var Potion = require('potion');

Potion.init(document.querySelector('.game'), {
  /**
   * keyboard events
   */
  keydown: function(key) {
    this.log('keydown key: ' + key);
  },

  keyup: function(key) {
    this.log('keyup key: ' + key);
  },

  /**
   * Mouse events
   */
  mousedown: function(x, y, button) {
    this.log('mousedown x: ' + x + ', y: ' + y + ', button: ' + button);
  },

  mouseup: function(x, y, button) {
    this.log('mouseup x: ' + x + ', y: ' + y + ', button: ' + button);
  },

  mousemove: function(x, y) {
    this.log('mousemove x: ' + x + ', y: ' + y);
  },

  // helper function (not defined in potion)
  log: function(message) {
    var li = document.createElement('li');
    li.textContent = message;
    var debug = document.querySelector('.debug');
    debug.insertBefore(li, debug.firstChild);
  }
});
