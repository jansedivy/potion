exports.isFunction = function(obj) {
  return !!(obj && obj.constructor && obj.call && obj.apply);
};
