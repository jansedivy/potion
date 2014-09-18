var StateManager = function() {
  this.states = {};
  this.renderOrder = [];
  this.updateOrder = [];
};

StateManager.prototype.add = function(name, state) {
  this.states[name] = this.newStateHolder(name, state);
  this.refreshOrder();
  return state;
};

var renderOrderSort = function(a, b) {
  return a.renderOrder < b.renderOrder;
};

var updateOrderSort = function(a, b) {
  return a.updateOrder < b.updateOrder;
};

StateManager.prototype.refreshOrder = function() {
  this.renderOrder.length = 0;
  this.updateOrder.length = 0;

  for (var name in this.states) {
    var holder = this.states[name];
    if (holder) {
      this.renderOrder.push(holder);
      this.updateOrder.push(holder);
    }
  }

  this.renderOrder.sort(renderOrderSort);
  this.updateOrder.sort(updateOrderSort);
};

StateManager.prototype.newStateHolder = function(name, state) {
  var holder = {};
  holder.name = name;
  holder.state = state;
  holder.enabled = true;
  holder.paused = false;
  holder.render = true;
  holder.initialized = false;
  holder.update = true;
  holder.updated = !state.update;
  holder.updateOrder = 0;
  holder.renderOrder = 0;
  return holder;
};

StateManager.prototype.setUpdateOrder = function(name, order) {
  var holder = this.get(name);
  if (holder) {
    holder.updateOrder = order;
    this.refreshOrder();
  }
};

StateManager.prototype.setRenderOrder = function(name, order) {
  var holder = this.get(name);
  if (holder) {
    holder.renderOrder = order;
    this.refreshOrder();
  }
};

StateManager.prototype.get = function(name) {
  return this.states[name];
};

StateManager.prototype.destroy = function(name) {
  var state = this.get(name);
  if (state) {
    if (state.state.close) {
      state.state.close();
    }
    delete this.states[name];
    this.refreshOrder();
  }
};

StateManager.prototype.update = function(time) {
  for (var i=0, len=this.updateOrder.length; i<len; i++) {
    var state = this.updateOrder[i];
    if (!state.initialized && state.state.init) {
      state.initialized = true;
      state.state.init();
    }

    if (state.enabled && state.state.update && !state.paused) {
      state.state.update(time);
      state.updated = true;
    }
  }
};

StateManager.prototype.render = function() {
  for (var i=0, len=this.renderOrder.length; i<len; i++) {
    var state = this.renderOrder[i];
    if (state.enabled && state.updated && state.state.render && !state.paused) {
      state.state.render();
    }
  }
};

StateManager.prototype.mouseup = function(x, y) {
  for (var i=0, len=this.updateOrder.length; i<len; i++) {
    var state = this.updateOrder[i];
    if (state.enabled && state.state.mouseup && !state.paused) {
      state.state.mouseup(x, y);
    }
  }
};

StateManager.prototype.mousedown = function(x, y, button) {
  for (var i=0, len=this.updateOrder.length; i<len; i++) {
    var state = this.updateOrder[i];
    if (state.enabled && state.state.mousedown && !state.paused) {
      state.state.mousedown(x, y, button);
    }
  }
};

StateManager.prototype.click = function(x, y, button) {
  for (var i=0, len=this.updateOrder.length; i<len; i++) {
    var state = this.updateOrder[i];
    if (state.enabled && state.state.click && !state.paused) {
      state.state.click(x, y, button);
    }
  }
};

StateManager.prototype.keypress = function(key) {
  for (var i=0, len=this.updateOrder.length; i<len; i++) {
    var state = this.updateOrder[i];
    if (state.enabled && state.state.keypress && !state.paused) {
      state.state.keypress(key);
    }
  }
};

StateManager.prototype.keyup = function(key) {
  for (var i=0, len=this.updateOrder.length; i<len; i++) {
    var state = this.updateOrder[i];
    if (state.enabled && state.state.keyup && !state.paused) {
      state.state.keyup(key);
    }
  }
};

StateManager.prototype.keydown = function(key) {
  for (var i=0, len=this.updateOrder.length; i<len; i++) {
    var state = this.updateOrder[i];
    if (state.enabled && state.state.keydown && !state.paused) {
      state.state.keydown(key);
    }
  }
};

StateManager.prototype.resize = function() {
  for (var i=0, len=this.updateOrder.length; i<len; i++) {
    var state = this.updateOrder[i];
    if (state.enabled && state.state.resize && !state.paused) {
      state.state.resize();
    }
  }
};

module.exports = StateManager;
