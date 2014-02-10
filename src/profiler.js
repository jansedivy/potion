if (DEBUG) {
  module.exports = function(app) {
    /**
     * Profiler class for measuring performance
     * @constructor
     */
    var Profiler = function() {
      /**
       * Start time of measured part
       * @type {number|null}
       */
      this.currentProfileStart = null;

      /**
       * Max records
       * @type {number}
       */
      this.maxRecords = 400;

      /**
       * Each column width in graph
       * @type {number}
       */
      this.recordWidth = 2;

      /**
       * Height for 60 fps
       * @type {number}
       */
      this.optimalHeight = 60;

      /**
       * Sixty frames in seconds
       * @type {number}
       */
      this.sixtyFrameMS = 0.016;

      /**
       * Measured data
       * @type {object}
       */
      this.data = {};
    };

    /**
     * Start profiling
     * @param {string} name - name of measured code
     */
    Profiler.prototype.startTrace = function(name) {
      if (!app.useProfiler) { return; }

      if (!this.data[name]) { this.data[name] = []; }
      this.currentProfileStart = window.performance.now();
    };

    /**
     * Stop profiling and save result by given name
     * @param {string} name - name of measured code
     */
    Profiler.prototype.endTrace = function(name) {
      if (!app.useProfiler) { return; }

      var time = window.performance.now() - this.currentProfileStart;
      time = time / 1000;
      var data = this.data[name];
      if (data) {
        if (data.length > this.maxRecords) {
          data.shift();
        }
        data.push(time);
      }
    };

    /**
     * Render data into canvas
     */
    Profiler.prototype.renderDebug = function() {
      if (!app.useProfiler) { return; }

      var updateData = this.data['update'];
      var renderData = this.data['render'];

      var sixtyFramesHeight = this.sixtyFrameMS*-this.optimalHeight/this.sixtyFrameMS;
      app.video.ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      app.video.ctx.fillRect(0, app.height - this.optimalHeight - 20, this.recordWidth * this.maxRecords, this.optimalHeight + 20);

      var updateText = 'update: ' + (updateData[updateData.length-1] * 1000).toFixed(2) + 'ms';
      var renderText = 'render: ' + (renderData[renderData.length-1] * 1000).toFixed(2) + 'ms';
      app.video.ctx.fillStyle = 'white';
      app.video.ctx.fillText(updateText + ' -- ' + renderText, 0, app.height - 5);

      for (var i=0, len=updateData.length; i<len; i++) {
        var update = updateData[i];
        var render = renderData[i];

        var updateHeight = update*-this.optimalHeight/this.sixtyFrameMS;
        var renderHeight = render*-this.optimalHeight/this.sixtyFrameMS;

        app.video.ctx.fillStyle = 'cyan';
        app.video.ctx.fillRect(i * this.recordWidth, app.height - 20, this.recordWidth, updateHeight);

        app.video.ctx.fillStyle = 'orange';
        app.video.ctx.fillRect(i * this.recordWidth, app.height + updateHeight - 20, this.recordWidth, renderHeight);
      }

      app.video.ctx.fillStyle = 'red';
      app.video.ctx.fillRect(0, app.height + sixtyFramesHeight - 20, this.recordWidth * this.maxRecords, 1);
    };

    return Profiler;
  };
}
