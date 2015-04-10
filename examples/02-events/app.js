var Potion = require('potion');

Potion.init(document.querySelector('.game'), {
  /**
   * keyboard events
   */
  keydown: function(value) {
    this.log('keydown key: ' + value.key + ' name: ' + value.name);
  },

  keyup: function(value) {
    this.log('keyup key: ' + value.key + ' name: ' + value.name);
  },

  /**
   * Mouse events
   */
  mousedown: function(value) {
    this.log('mousedown x: ' + value.x + ', y: ' + value.y + ', button: ' + value.button);
  },

  mouseup: function(value) {
    this.log('mouseup x: ' + value.x + ', y: ' + value.y + ', button: ' + value.button);
  },

  mousemove: function(value) {
    this.log('mousemove x: ' + value.x + ', y: ' + value.y);
  },

  // helper function (not defined in potion)
  log: function(message) {
    var li = document.createElement('li');
    li.textContent = message;
    var debug = document.querySelector('.debug');
    debug.insertBefore(li, debug.firstChild);
  }
});
