module.exports = {
  lerp: function(v0, v1, time) {
    return v0 + (v1 - v0) * time;
  },

  distance2: function(x1, y1, x2, y2) {
    var xd = x2 - x1;
    var yd = y2 - y1;

    return xd*xd + yd*yd;
  },

  angleBetweenPoints: function(x1, y1, x2, y2) {
    return Math.atan2(y2 - y1, x2 - x1);
  },

  round: function(num) {
    return (0.5 + num) << 0;
  }
};
