var Class = require('./class');

module.exports = Class.extend({
  init: function(left, top, right, bottom) {
    this.set(left, top, right, bottom);
  },

  set: function(left, top, right, bottom) {
    this.left = left;
    this.top = top;
    this.right = right;
    this.bottom = bottom;
  },

  move: function(left, top) {
    this.set(left, top, left + this.getWidth(), top + this.getHeight());
  },

  moveX: function(left) {
    this.set(left, this.top, left + this.getWidth(), this.bottom);
  },

  moveY: function(top) {
    this.set(this.left, top, this.right, top + this.getHeight());
  },

  setWidth: function(width) {
    this.right = this.left + width;
  },

  setHeight: function(height) {
    this.bottom = this.top + height;
  },

  getWidth: function() {
    return this.right - this.left;
  },

  getHeight: function() {
    return this.bottom - this.top;
  },

  nudge: function(x, y) {
    x = x || 0;
    y = y || 0;

    this.left = this.left + x;
    this.top = this.top + y;
    this.right = this.right + x;
    this.bottom = this.bottom + y;
  },

  getCenterX: function() {
    return this.left + this.getWidth() * 0.5;
  },

  getCenterY: function() {
    return this.top + this.getHeight() * 0.5;
  },

  intersect: function(other) {
    return (this.right >= other.left &&
            this.bottom >= other.top &&
            this.left <= other.right &&
            this.top <= other.bottom);
  },

  outside: function(other) {
    return !this.intersect(other);
  },

  resolveCollision: function(other) {
    var dx = (this.getCenterX() - other.getCenterX()) / other.getWidth();
    var dy = (this.getCenterY() - other.getCenterY()) / other.getHeight();

    if (Math.abs(dx) > Math.abs(dy)) {
      if (this.getCenterX() > other.getCenterX()) {
        this.nudge(other.right - this.left, 0);
      } else {
        this.nudge(other.left - this.right, 0);
      }
    } else {
      if (this.getCenterY() > other.getCenterY()) {
        this.nudge(0, other.bottom - this.top);
      } else {
        this.nudge(0, other.top - this.bottom);
      }
    }
  }
});
