var renderOrderSort = function(a, b) {
  return a.renderOrder < b.renderOrder;
};

var updateOrderSort = function(a, b) {
  return a.updateOrder < b.updateOrder;
};

var StateManager = function() {
  this.states = {};
  this.renderOrder = [];
  this.updateOrder = [];
};

StateManager.prototype.add = function(name, state) {
  this.states[name] = this._newStateHolder(name, state);
  this.refreshOrder();
  return state;
};

StateManager.prototype.enable = function(name) {
  var holder = this.get(name);
  if (holder) {
    if (!holder.enabled) {
      if (holder.state.enable) {
        holder.state.enable();
      }
      holder.enabled = true;
      holder.changed = true;

      if (holder.paused) {
        this.unpause(name);
      }
    }
  }
};

StateManager.prototype.disable = function(name) {
  var holder = this.get(name);
  if (holder) {
    if (holder.enabled) {
      if (holder.state.disable) {
        holder.state.disable();
      }
      holder.changed = true;
      holder.enabled = false;
    }
  }
};

StateManager.prototype.hide = function(name) {
  var holder = this.get(name);
  if (holder) {
    if (holder.enabled) {
      holder.changed = true;
      holder.render = false;
    }
  }
};

StateManager.prototype.show = function(name) {
  var holder = this.get(name);
  if (holder) {
    if (holder.enabled) {
      holder.changed = true;
      holder.render = true;
    }
  }
};

StateManager.prototype.pause = function(name) {
  var holder = this.get(name);
  if (holder) {
    if (holder.state.pause) {
      holder.state.pause();
    }

    holder.changed = true;
    holder.paused = true;
  }
};

StateManager.prototype.unpause = function(name) {
  var holder = this.get(name);
  if (holder) {
    if (holder.state.unpause) {
      holder.state.unpause();
    }

    holder.changed = true;
    holder.paused = false;
  }
};

StateManager.prototype.protect = function(name) {
  var holder = this.get(name);
  if (holder) {
    holder.protect = true;
  }
};

StateManager.prototype.unprotect = function(name) {
  var holder = this.get(name);
  if (holder) {
    holder.protect = false;
  }
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

StateManager.prototype._newStateHolder = function(name, state) {
  var holder = {};
  holder.name = name;
  holder.state = state;

  holder.protect = false;

  holder.enabled = true;
  holder.paused = false;

  holder.render = true;

  holder.initialized = false;
  holder.updated = false;
  holder.changed = true;

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

StateManager.prototype.destroy = function(name) {
  var state = this.get(name);
  if (state && !state.protect) {
    if (state.state.close) {
      state.state.close();
    }
    delete this.states[name];
    this.refreshOrder();
  }
};

StateManager.prototype.destroyAll = function() {
  for (var i=0, len=this.updateOrder.length; i<len; i++) {
    var state = this.updateOrder[i];
    if (!state.protect) {
      if (state.state.close) {
        state.state.close();
      }
      delete this.states[state.name];
    }
  }

  this.refreshOrder();
};

StateManager.prototype.get = function(name) {
  return this.states[name];
};

StateManager.prototype.update = function(time) {
  for (var i=0, len=this.updateOrder.length; i<len; i++) {
    var state = this.updateOrder[i];

    if (state) {
      state.changed = false;

      if (state.enabled) {
        if (!state.initialized && state.state.init) {
          state.initialized = true;
          state.state.init();
        }

        if (state.state.update && !state.paused) {
          state.state.update(time);
          state.updated = true;
        }
      }
    }
  }
};

StateManager.prototype.exitUpdate = function(time) {
  for (var i=0, len=this.updateOrder.length; i<len; i++) {
    var state = this.updateOrder[i];

    if (state.enabled && state.state.exitUpdate && !state.paused) {
      state.state.exitUpdate(time);
    }
  }
};

StateManager.prototype.render = function() {
  for (var i=0, len=this.renderOrder.length; i<len; i++) {
    var state = this.renderOrder[i];
    if (state.enabled && (state.updated || !state.state.update) && state.render && state.state.render) {
      state.state.render();
    }
  }
};
StateManager.prototype.mousemove = function(x, y, e) {
  for (var i=0, len=this.updateOrder.length; i<len; i++) {
    var state = this.updateOrder[i];
    if (state.enabled && !state.changed && state.state.mousemove && !state.paused) {
      state.state.mousemove(x, y, e);
    }
  }
};

StateManager.prototype.mouseup = function(x, y, button) {
  for (var i=0, len=this.updateOrder.length; i<len; i++) {
    var state = this.updateOrder[i];
    if (state.enabled && !state.changed && state.state.mouseup && !state.paused) {
      state.state.mouseup(x, y, button);
    }
  }
};

StateManager.prototype.mousedown = function(x, y, button) {
  for (var i=0, len=this.updateOrder.length; i<len; i++) {
    var state = this.updateOrder[i];
    if (state.enabled && !state.changed && state.state.mousedown && !state.paused) {
      state.state.mousedown(x, y, button);
    }
  }
};

StateManager.prototype.keyup = function(key, e) {
  for (var i=0, len=this.updateOrder.length; i<len; i++) {
    var state = this.updateOrder[i];
    if (state.enabled && !state.changed && state.state.keyup && !state.paused) {
      state.state.keyup(key, e);
    }
  }
};

StateManager.prototype.keydown = function(key, e) {
  for (var i=0, len=this.updateOrder.length; i<len; i++) {
    var state = this.updateOrder[i];
    if (state.enabled && !state.changed && state.state.keydown && !state.paused) {
      state.state.keydown(key, e);
    }
  }
};

module.exports = StateManager;
