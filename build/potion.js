/**
 * potion - v0.5.1
 * Copyright (c) 2014, Jan Sedivy
 *
 * Compiled: 2014-06-17
 *
 * potion is licensed under the MIT License.
 */
!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var o;"undefined"!=typeof window?o=window:"undefined"!=typeof global?o=global:"undefined"!=typeof self&&(o=self),o.Potion=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
var Engine = _dereq_('./src/engine');

module.exports = {
  init: function(canvas, methods) {
    var engine = new Engine(canvas, methods);
    return engine.game;
  },

  Animation: _dereq_('./src/animation')
};

},{"./src/animation":3,"./src/engine":5}],2:[function(_dereq_,module,exports){
/*!
 *  howler.js v1.1.20
 *  howlerjs.com
 *
 *  (c) 2013-2014, James Simpson of GoldFire Studios
 *  goldfirestudios.com
 *
 *  MIT License
 */
!function(){var e={},t=null,n=!0,r=!1;try{"undefined"!=typeof AudioContext?t=new AudioContext:"undefined"!=typeof webkitAudioContext?t=new webkitAudioContext:n=!1}catch(i){n=!1}if(!n)if("undefined"!=typeof Audio)try{new Audio}catch(i){r=!0}else r=!0;if(n){var s=void 0===t.createGain?t.createGainNode():t.createGain();s.gain.value=1,s.connect(t.destination)}var o=function(){this._volume=1,this._muted=!1,this.usingWebAudio=n,this.noAudio=r,this._howls=[]};o.prototype={volume:function(e){var t=this;if(e=parseFloat(e),e>=0&&1>=e){t._volume=e,n&&(s.gain.value=e);for(var r in t._howls)if(t._howls.hasOwnProperty(r)&&t._howls[r]._webAudio===!1)for(var i=0;i<t._howls[r]._audioNode.length;i++)t._howls[r]._audioNode[i].volume=t._howls[r]._volume*t._volume;return t}return n?s.gain.value:t._volume},mute:function(){return this._setMuted(!0),this},unmute:function(){return this._setMuted(!1),this},_setMuted:function(e){var t=this;t._muted=e,n&&(s.gain.value=e?0:t._volume);for(var r in t._howls)if(t._howls.hasOwnProperty(r)&&t._howls[r]._webAudio===!1)for(var i=0;i<t._howls[r]._audioNode.length;i++)t._howls[r]._audioNode[i].muted=e}};var u=new o,a=null;if(!r){a=new Audio;var f={mp3:!!a.canPlayType("audio/mpeg;").replace(/^no$/,""),opus:!!a.canPlayType('audio/ogg; codecs="opus"').replace(/^no$/,""),ogg:!!a.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/,""),wav:!!a.canPlayType('audio/wav; codecs="1"').replace(/^no$/,""),m4a:!!(a.canPlayType("audio/x-m4a;")||a.canPlayType("audio/aac;")).replace(/^no$/,""),mp4:!!(a.canPlayType("audio/x-mp4;")||a.canPlayType("audio/aac;")).replace(/^no$/,""),weba:!!a.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/,"")}}var l=function(e){var t=this;t._autoplay=e.autoplay||!1,t._buffer=e.buffer||!1,t._duration=e.duration||0,t._format=e.format||null,t._loop=e.loop||!1,t._loaded=!1,t._sprite=e.sprite||{},t._src=e.src||"",t._pos3d=e.pos3d||[0,0,-.5],t._volume=void 0!==e.volume?e.volume:1,t._urls=e.urls||[],t._rate=e.rate||1,t._model=e.model||null,t._onload=[e.onload||function(){}],t._onloaderror=[e.onloaderror||function(){}],t._onend=[e.onend||function(){}],t._onpause=[e.onpause||function(){}],t._onplay=[e.onplay||function(){}],t._onendTimer=[],t._webAudio=n&&!t._buffer,t._audioNode=[],t._webAudio&&t._setupAudioNode(),u._howls.push(t),t.load()};if(l.prototype={load:function(){var t=this,n=null;if(r)return void t.on("loaderror");for(var i=0;i<t._urls.length;i++){var s,a;if(t._format)s=t._format;else{if(a=t._urls[i].toLowerCase().split("?")[0],s=a.match(/.+\.([^?]+)(\?|$)/),s=s&&s.length>=2?s:a.match(/data\:audio\/([^?]+);/),!s)return void t.on("loaderror");s=s[1]}if(f[s]){n=t._urls[i];break}}if(!n)return void t.on("loaderror");if(t._src=n,t._webAudio)c(t,n);else{var l=new Audio;l.addEventListener("error",function(){l.error&&4===l.error.code&&(o.noAudio=!0),t.on("loaderror",{type:l.error?l.error.code:0})},!1),t._audioNode.push(l),l.src=n,l._pos=0,l.preload="auto",l.volume=u._muted?0:t._volume*u.volume(),e[n]=t;var h=function(){t._duration=Math.ceil(10*l.duration)/10,0===Object.getOwnPropertyNames(t._sprite).length&&(t._sprite={_default:[0,1e3*t._duration]}),t._loaded||(t._loaded=!0,t.on("load")),t._autoplay&&t.play(),l.removeEventListener("canplaythrough",h,!1)};l.addEventListener("canplaythrough",h,!1),l.load()}return t},urls:function(e){var t=this;return e?(t.stop(),t._urls="string"==typeof e?[e]:e,t._loaded=!1,t.load(),t):t._urls},play:function(e,n){var r=this;return"function"==typeof e&&(n=e),e&&"function"!=typeof e||(e="_default"),r._loaded?r._sprite[e]?(r._inactiveNode(function(i){i._sprite=e;var s,o=i._pos>0?i._pos:r._sprite[e][0]/1e3,a=r._sprite[e][1]/1e3-i._pos,f=!(!r._loop&&!r._sprite[e][2]),l="string"==typeof n?n:Math.round(Date.now()*Math.random())+"";if(function(){var t={id:l,sprite:e,loop:f};s=setTimeout(function(){!r._webAudio&&f&&r.stop(t.id).play(e,t.id),r._webAudio&&!f&&(r._nodeById(t.id).paused=!0,r._nodeById(t.id)._pos=0),r._webAudio||f||r.stop(t.id),r.on("end",l)},1e3*a),r._onendTimer.push({timer:s,id:t.id})}(),r._webAudio){var c=r._sprite[e][0]/1e3,h=r._sprite[e][1]/1e3;i.id=l,i.paused=!1,p(r,[f,c,h],l),r._playStart=t.currentTime,i.gain.value=r._volume,void 0===i.bufferSource.start?i.bufferSource.noteGrainOn(0,o,a):i.bufferSource.start(0,o,a)}else{if(4!==i.readyState&&(i.readyState||!navigator.isCocoonJS))return r._clearEndTimer(l),function(){var t=r,s=e,o=n,u=i,a=function(){t.play(s,o),u.removeEventListener("canplaythrough",a,!1)};u.addEventListener("canplaythrough",a,!1)}(),r;i.readyState=4,i.id=l,i.currentTime=o,i.muted=u._muted||i.muted,i.volume=r._volume*u.volume(),setTimeout(function(){i.play()},0)}return r.on("play"),"function"==typeof n&&n(l),r}),r):("function"==typeof n&&n(),r):(r.on("load",function(){r.play(e,n)}),r)},pause:function(e){var t=this;if(!t._loaded)return t.on("play",function(){t.pause(e)}),t;t._clearEndTimer(e);var n=e?t._nodeById(e):t._activeNode();if(n)if(n._pos=t.pos(null,e),t._webAudio){if(!n.bufferSource||n.paused)return t;n.paused=!0,void 0===n.bufferSource.stop?n.bufferSource.noteOff(0):n.bufferSource.stop(0)}else n.pause();return t.on("pause"),t},stop:function(e){var t=this;if(!t._loaded)return t.on("play",function(){t.stop(e)}),t;t._clearEndTimer(e);var n=e?t._nodeById(e):t._activeNode();if(n)if(n._pos=0,t._webAudio){if(!n.bufferSource||n.paused)return t;n.paused=!0,void 0===n.bufferSource.stop?n.bufferSource.noteOff(0):n.bufferSource.stop(0)}else isNaN(n.duration)||(n.pause(),n.currentTime=0);return t},mute:function(e){var t=this;if(!t._loaded)return t.on("play",function(){t.mute(e)}),t;var n=e?t._nodeById(e):t._activeNode();return n&&(t._webAudio?n.gain.value=0:n.muted=!0),t},unmute:function(e){var t=this;if(!t._loaded)return t.on("play",function(){t.unmute(e)}),t;var n=e?t._nodeById(e):t._activeNode();return n&&(t._webAudio?n.gain.value=t._volume:n.muted=!1),t},volume:function(e,t){var n=this;if(e=parseFloat(e),e>=0&&1>=e){if(n._volume=e,!n._loaded)return n.on("play",function(){n.volume(e,t)}),n;var r=t?n._nodeById(t):n._activeNode();return r&&(n._webAudio?r.gain.value=e:r.volume=e*u.volume()),n}return n._volume},loop:function(e){var t=this;return"boolean"==typeof e?(t._loop=e,t):t._loop},sprite:function(e){var t=this;return"object"==typeof e?(t._sprite=e,t):t._sprite},pos:function(e,n){var r=this;if(!r._loaded)return r.on("load",function(){r.pos(e)}),"number"==typeof e?r:r._pos||0;e=parseFloat(e);var i=n?r._nodeById(n):r._activeNode();if(i)return e>=0?(r.pause(n),i._pos=e,r.play(i._sprite,n),r):r._webAudio?i._pos+(t.currentTime-r._playStart):i.currentTime;if(e>=0)return r;for(var s=0;s<r._audioNode.length;s++)if(r._audioNode[s].paused&&4===r._audioNode[s].readyState)return r._webAudio?r._audioNode[s]._pos:r._audioNode[s].currentTime},pos3d:function(e,t,n,r){var i=this;if(t=void 0!==t&&t?t:0,n=void 0!==n&&n?n:-.5,!i._loaded)return i.on("play",function(){i.pos3d(e,t,n,r)}),i;if(!(e>=0||0>e))return i._pos3d;if(i._webAudio){var s=r?i._nodeById(r):i._activeNode();s&&(i._pos3d=[e,t,n],s.panner.setPosition(e,t,n),s.panner.panningModel=i._model||"HRTF")}return i},fade:function(e,t,n,r,i){var s=this,o=Math.abs(e-t),u=e>t?"down":"up",a=o/.01,f=n/a;if(!s._loaded)return s.on("load",function(){s.fade(e,t,n,r,i)}),s;s.volume(e,i);for(var l=1;a>=l;l++)!function(){var e=s._volume+("up"===u?.01:-.01)*l,n=Math.round(1e3*e)/1e3,o=t;setTimeout(function(){s.volume(n,i),n===o&&r&&r()},f*l)}()},fadeIn:function(e,t,n){return this.volume(0).play().fade(0,e,t,n)},fadeOut:function(e,t,n,r){var i=this;return i.fade(i._volume,e,t,function(){n&&n(),i.pause(r),i.on("end")},r)},_nodeById:function(e){for(var t=this,n=t._audioNode[0],r=0;r<t._audioNode.length;r++)if(t._audioNode[r].id===e){n=t._audioNode[r];break}return n},_activeNode:function(){for(var e=this,t=null,n=0;n<e._audioNode.length;n++)if(!e._audioNode[n].paused){t=e._audioNode[n];break}return e._drainPool(),t},_inactiveNode:function(e){for(var t=this,n=null,r=0;r<t._audioNode.length;r++)if(t._audioNode[r].paused&&4===t._audioNode[r].readyState){e(t._audioNode[r]),n=!0;break}if(t._drainPool(),!n){var i;t._webAudio?(i=t._setupAudioNode(),e(i)):(t.load(),i=t._audioNode[t._audioNode.length-1],i.addEventListener(navigator.isCocoonJS?"canplaythrough":"loadedmetadata",function(){e(i)}))}},_drainPool:function(){var e,t=this,n=0;for(e=0;e<t._audioNode.length;e++)t._audioNode[e].paused&&n++;for(e=t._audioNode.length-1;e>=0&&!(5>=n);e--)t._audioNode[e].paused&&(t._webAudio&&t._audioNode[e].disconnect(0),n--,t._audioNode.splice(e,1))},_clearEndTimer:function(e){for(var t=this,n=0,r=0;r<t._onendTimer.length;r++)if(t._onendTimer[r].id===e){n=r;break}var i=t._onendTimer[n];i&&(clearTimeout(i.timer),t._onendTimer.splice(n,1))},_setupAudioNode:function(){var e=this,n=e._audioNode,r=e._audioNode.length;return n[r]=void 0===t.createGain?t.createGainNode():t.createGain(),n[r].gain.value=e._volume,n[r].paused=!0,n[r]._pos=0,n[r].readyState=4,n[r].connect(s),n[r].panner=t.createPanner(),n[r].panner.panningModel=e._model||"equalpower",n[r].panner.setPosition(e._pos3d[0],e._pos3d[1],e._pos3d[2]),n[r].panner.connect(n[r]),n[r]},on:function(e,t){var n=this,r=n["_on"+e];if("function"==typeof t)r.push(t);else for(var i=0;i<r.length;i++)t?r[i].call(n,t):r[i].call(n);return n},off:function(e,t){for(var n=this,r=n["_on"+e],i=""+t,s=0;s<r.length;s++)if(i===""+r[s]){r.splice(s,1);break}return n},unload:function(){for(var t=this,n=t._audioNode,r=0;r<t._audioNode.length;r++)n[r].paused||t.stop(n[r].id),t._webAudio?n[r].disconnect(0):n[r].src="";for(r=0;r<t._onendTimer.length;r++)clearTimeout(t._onendTimer[r].timer);var i=u._howls.indexOf(t);null!==i&&i>=0&&u._howls.splice(i,1),delete e[t._src],t=null}},n)var c=function(n,r){if(r in e)n._duration=e[r].duration,h(n);else{var i=new XMLHttpRequest;i.open("GET",r,!0),i.responseType="arraybuffer",i.onload=function(){t.decodeAudioData(i.response,function(t){t&&(e[r]=t,h(n,t))},function(){n.on("loaderror")})},i.onerror=function(){n._webAudio&&(n._buffer=!0,n._webAudio=!1,n._audioNode=[],delete n._gainNode,n.load())};try{i.send()}catch(s){i.onerror()}}},h=function(e,t){e._duration=t?t.duration:e._duration,0===Object.getOwnPropertyNames(e._sprite).length&&(e._sprite={_default:[0,1e3*e._duration]}),e._loaded||(e._loaded=!0,e.on("load")),e._autoplay&&e.play()},p=function(n,r,i){var s=n._nodeById(i);s.bufferSource=t.createBufferSource(),s.bufferSource.buffer=e[n._src],s.bufferSource.connect(s.panner),s.bufferSource.loop=r[0],r[0]&&(s.bufferSource.loopStart=r[1],s.bufferSource.loopEnd=r[1]+r[2]),s.bufferSource.playbackRate.value=n._rate};"function"==typeof define&&define.amd&&define(function(){return{Howler:u,Howl:l}}),"undefined"!=typeof exports&&(exports.Howler=u,exports.Howl=l),"undefined"!=typeof window&&(window.Howler=u,window.Howl=l)}();
},{}],3:[function(_dereq_,module,exports){
/**
 * Animation class for rendering sprites in grid
 * @constructor
 * @param {object} image
 * @param {number} width - width of individual images in animation
 * @param {number} height - height of individual images in animation
 * @param {number} [columns=null] - optional number of columns in animation
 */
var Animation = function(image, width, height, columns) {
  /**
   * @type object
   */
  this.image = image;

  /**
   * width of individual images in animation
   * @type {number}
   */
  this.width = width;

  /**
   * height of individual images in animation
   * @type {number}
   */
  this.height = height;

  /**
   * number of columns in animation
   * @type {number}
   */
  this.columns = columns;

  /**
   * Current index of image
   * @type {number}
   */
  this.state = 0;

  /**
   * Current X index
   * @type {number}
   */
  this.indexX = 0;

  /**
   * Current Y index
   * @type {number}
   */
  this.indexY = 0;

  /**
   * Image offset X
   * @type {number}
   */
  this.offsetX = 0;

  /**
   * Image offset Y
   * @type {number}
   */
  this.offsetY = 0;
};

/**
 * Set x and y index
 * @param {number} x - x index
 * @param {number} y - y index
 */
Animation.prototype.setIndexes = function(x, y) {
  this.setIndexX(x);
  this.setIndexY(y);
};

/**
 * Set x index
 * @param {number} x - x index
 */
Animation.prototype.setIndexX = function(x) {
  this.indexX = x;
  this.offsetX = this.width * this.indexX;
};

/**
 * Set y index
 * @param {number} y - y index
 */
Animation.prototype.setIndexY = function(y) {
  this.indexY = y;
  this.offsetY = this.height * this.indexY;
};

/**
 * Set image index
 * @param {number} state - image index
 */
Animation.prototype.setState = function(state) {
  this.state = state;

  var x = this.state;
  var y = 0;

  if (this.columns) {
    x = this.state % this.columns;
    y = Math.floor(this.state/this.columns);
  }

  this.setIndexX(x);
  this.setIndexY(y);
};

module.exports = Animation;

},{}],4:[function(_dereq_,module,exports){
/* global Howl */

var utils = _dereq_('./utils');

_dereq_('../lib/howler.min.js');

/**
 * Class for assets loading
 * @constructor
 */
var Assets = function() {
  this.isLoading = true;

  this.itemsCount = 0;
  this.loadedItemsCount = 0;

  this._thingsToLoad = 0;
  this._data = {};

  this.callback = null;
};

Assets.prototype.onload = function(callback) {
  this.callback = callback;
  if (this._thingsToLoad === 0) {
    this.isLoading = false;
    setTimeout(callback, 0);
  }
};

Assets.prototype.get = function(name) {
  return this._data[name];
};

Assets.prototype._handleCustomLoading = function(loading) {
  var self = this;
  var done = function(name, value) {
    self._save(name, value);
  };
  loading(done);
};

Assets.prototype.load = function(type, url, callback) {
  var self = this;
  this._thingsToLoad += 1;
  this.itemsCount += 1;

  if (utils.isFunction(type)) {
    this._handleCustomLoading(type);
    return;
  }

  type = type.toLowerCase();

  var request = new XMLHttpRequest();

  switch (type) {
    case 'json':
      request.open('GET', url, true);
      request.responseType = 'text';
      request.onload = function() {
        var data = JSON.parse(this.response);
        self._save(url, data, callback);
      };
      request.send();
      break;
    case 'mp3':
    case 'music':
    case 'sound':
      var sound = new Howl({
        urls: [url],
        onload: function() {
          self._save(url, sound, callback);
        }
      });
      break;
    case 'image':
    case 'texture':
    case 'sprite':
      var image = new Image();
      image.onload = function() {
        self._save(url, image, callback);
      };
      image.src = url;
      break;
    default: // text files
      request.open('GET', url, true);
      request.responseType = 'text';
      request.onload = function() {
        var data = this.response;
        self._save(url, data, callback);
      };
      request.send();
      break;
  }
};

Assets.prototype._save = function(url, data, callback) {
  this._data[url] = data;
  if (callback) { callback(data); }
  this.finishedOneFile();
};

Assets.prototype.finishedOneFile = function() {
  this._thingsToLoad -= 1;
  this.loadedItemsCount += 1;
  if (this._thingsToLoad === 0) {
    var self = this;
    setTimeout(function() {
      self.isLoading = false;
      self.callback();
    }, 300);
  }
};

module.exports = Assets;

},{"../lib/howler.min.js":2,"./utils":12}],5:[function(_dereq_,module,exports){
var Game = _dereq_('./game');

var raf = _dereq_('./raf');
var Time = _dereq_('./time');

/**
 * Main Engine class which calls the game methods
 * @constructor
 */
var Engine = function(canvas, methods) {
  var GameClass = function(canvas) { Game.call(this, canvas); };
  GameClass.prototype = Object.create(Game.prototype);
  for (var method in methods) {
    GameClass.prototype[method] = methods[method];
  }

  /**
   * Game code instance
   * @type {Game}
   */
  this.game = new GameClass(canvas);

  this.tickFunc = (function (self) {
    return function() { self.tick(); };
  })(this);

  this.setupCanvasSize();

  this.game.assets.onload(function() {
    this.start();
  }.bind(this));

  this._time = Time.now();
  raf(this.tickFunc);
};

/**
 * Add event listener for window events
 * @private
 */
Engine.prototype.addEvents = function() {
  var self = this;

  window.addEventListener('resize', function() {
    self.setupCanvasSize();
  });

  window.addEventListener('blur', function() {
    self.game.input.resetKeys();
    self.game.blur();
  });

  window.addEventListener('focus', function() {
    self.game.input.resetKeys();
    self.game.focus();
  });
};

/**
 * Runs every time on resize event
 * @private
 */
Engine.prototype.setupCanvasSize = function() {
  this.game.resize();
  this.game.video.width = this.game.canvas.width = this.game.width;
  this.game.video.height = this.game.canvas.height = this.game.height;

  if (this.game.config.useRetina && this.game.isRetina) {
    this.game.video.scaleCanvas(2);
  }
};

/**
 * Starts the game, adds events and run first frame
 * @private
 */
Engine.prototype.start = function() {
  this.game.init();
  if (this.game.config.addInputEvents) {
    this.addEvents();
  }
};

/**
 * Main tick function in game loop
 * @private
 */
Engine.prototype.tick = function() {
  raf(this.tickFunc);

  var now = Time.now();
  var time = (now - this._time) / 1000;
  if (time > 0.01666) { time = 0.01666; }
  this._time = now;

  if (this.game.assets.isLoading) {
    if (this.game.config.showPreloader) {
      this.game.preloading(time);
    }
  } else {
    this.update(time);
    this.render();
  }
};

/**
 * Updates the game
 * @param {number} time - time in seconds since last frame
 * @private
 */
Engine.prototype.update = function(time) {
  this.game.update(time);
};

/**
 * Renders the game
 * @private
 */
Engine.prototype.render = function() {
  this.game.video.beginFrame();
  this.game.render();
  this.game.video.endFrame();
};

module.exports = Engine;

},{"./game":6,"./raf":9,"./time":11}],6:[function(_dereq_,module,exports){
var Video = _dereq_('./video');
var Input = _dereq_('./input');
var Assets = _dereq_('./assets');
var isRetina = _dereq_('./retina');

/**
 * Game class that is subclassed by actual game code
 * @constructor
 * @param {HTMLCanvasElement} canvas - canvas DOM element
 */
var Game = function(canvas) {
  /**
   * Canvas DOM element
   * @type {HTMLCanvasElement}
   */
  this.canvas = canvas;

  /**
   * Game width in pixels
   * @type {number}
   */
  this.width = 300;

  /**
   * Game highs in pixels
   * @type {number}
   */
  this.height = 300;

  /**
   * Instance of Assets for loading assets for the game
   * @type {Assets}
   */
  this.assets = new Assets();

  /**
   * True if you are using retina screen
   * @type {boolean}
   */
  this.isRetina = isRetina();

  this.config = {
    useRetina: true,
    initializeCanvas: true,
    initializeVideo: true,
    addInputEvents: true,
    showPreloader: true
  };

  this.configure();

  /**
   * Input instance for mouse and keyboard events
   * @type {Input}
   */
  if (this.config.addInputEvents) {
    this.input = new Input(this);
  }

  /**
   * Video instance for rendering into canvas
   * @type {Video}
   */
  if (this.config.initializeVideo) {
    this.video = new Video(canvas, this.config);
  }
};

/**
 * Is called when all assets are loaded
 * @abstract
 */
Game.prototype.init = function() {};

/**
 * Configure the game
 * @abstract
 */
Game.prototype.configure = function() {};

/**
 * Window resize event
 * @abstract
 */
Game.prototype.resize = function() {};

/**
 * Renders the game
 * @abstract
 */
Game.prototype.render = function() {};

/**
 * Updates the game
 * @param {number} time - time in seconds since last frame
 * @abstract
 */
Game.prototype.update = function(time) {};

/**
 * Mousemove event
 * @param {number} x - x position
 * @param {number} y - y position
 * @abstract
 */
Game.prototype.mousemove = function(x, y) {};

Game.prototype.mouseup = function(x, y) {};

/**
 * Window Focus event
 * @abstract
 */
Game.prototype.focus = function() {};

Game.prototype.click = function() {};

Game.prototype.keydown = function() {};

Game.prototype.keyup = function() {};

/**
 * Window Blur event
 * @abstract
 */
Game.prototype.blur = function() {};

Game.prototype.preloading = function(time) {
  if (!this.video && !this.video.ctx) { return; }

  if (this._preloaderWidth === undefined) { this._preloaderWidth = 0; }

  var ratio = Math.max(0, Math.min(1, (this.assets.loadedItemsCount)/this.assets.itemsCount));
  var width = Math.min(this.width * 2/3, 300);
  var height = 20;

  var y = (this.height - height) / 2;
  var x = (this.width - width) / 2;

  var currentWidth = width * ratio;
  this._preloaderWidth = this._preloaderWidth + (currentWidth - this._preloaderWidth) * time * 10;

  this.video.ctx.save();

  this.video.ctx.fillStyle = '#a9c848';
  this.video.ctx.fillRect(0, 0, this.width, this.height);

  this.video.ctx.fillStyle = '#88a237';
  this.video.ctx.fillRect(x, y, width, height);

  this.video.ctx.fillStyle = '#f6ffda';
  this.video.ctx.fillRect(x, y, this._preloaderWidth, height);

  this.video.ctx.restore();
};

module.exports = Game;

},{"./assets":4,"./input":7,"./retina":10,"./video":13}],7:[function(_dereq_,module,exports){
var keys = _dereq_('./keys');

/**
 * Input wrapper
 * @constructor
 * @param {Game} game - Game object
 */
var Input = function(game) {
  /**
   * Pressed keys object
   * @type {object}
   */
  this.keys = {};

  /**
   * Controls if you can press keys
   * @type {boolean}
   */
  this.canControlKeys = true;

  /**
   * Mouse object with positions and if is mouse button pressed
   * @type {object}
   */
  this.mouse = {
    isDown: false,
    button: null,
    x: null,
    y: null
  };

  this._addEvents(game);
};

/**
 * Clears the pressed keys object
 */
Input.prototype.resetKeys = function() {
  this.keys = {};
};

/**
 * Return true or false if key is pressed
 * @param {string} key
 * @return {boolean}
 */
Input.prototype.isKeyDown = function(key) {
  if (this.canControlKeys) {
    return this.keys[keys[key.toUpperCase()]];
  }
};

/**
 * Add canvas event listener
 * @private
 */
Input.prototype._addEvents = function(game) {
  var self = this;
  var canvas = game.canvas;

  canvas.addEventListener('mousemove', function(e) {
    var x = e.offsetX === undefined ? e.layerX - canvas.offsetLeft : e.offsetX;
    var y = e.offsetY === undefined ? e.layerY - canvas.offsetTop : e.offsetY;

    game.mousemove(x, y);
    self.mouse.x = x;
    self.mouse.y = y;
  });

  canvas.addEventListener('mouseup', function(e) {
    e.preventDefault();

    var x = e.offsetX === undefined ? e.layerX - canvas.offsetLeft : e.offsetX;
    var y = e.offsetY === undefined ? e.layerY - canvas.offsetTop : e.offsetY;

    self.mouse.button = e.button;
    self.mouse.isDown = false;

    game.mouseup(x, y, e.button);
  }, false);

  canvas.addEventListener('mousedown', function(e) {
    e.preventDefault();

    var x = e.offsetX === undefined ? e.layerX - canvas.offsetLeft : e.offsetX;
    var y = e.offsetY === undefined ? e.layerY - canvas.offsetTop : e.offsetY;

    self.mouse.x = x;
    self.mouse.y = y;
    self.mouse.button = e.button;
    self.mouse.isDown = true;

    game.click(x, y, e.button);
  }, false);

  var touchX = null;
  var touchY = null;

  canvas.addEventListener('touchstart', function(e) {
    var x = e.layerX;
    var y = e.layerY;

    touchX = x;
    touchY = y;

    self.mouse.x = x;
    self.mouse.y = y;
    self.mouse.isDown = true;
  });

  canvas.addEventListener('touchmove', function(e) {
    e.preventDefault();

    var x = e.layerX;
    var y = e.layerY;

    game.mousemove(x, y);

    self.mouse.x = x;
    self.mouse.y = y;
  });

  canvas.addEventListener('touchend', function(e) {
    e.preventDefault();

    self.mouse.isDown = false;

    for (var i=0, len=e.changedTouches.length; i<len; i++) {
      var touch = e.changedTouches[i];

      var x = touch.pageX - canvas.offsetLeft;
      var y = touch.pageY - canvas.offsetTop;
      var button = 0;

      var dx = Math.abs(touchX - x);
      var dy = Math.abs(touchY - y);

      var threshold = 5;

      if (dx < threshold && dy < threshold) {
        self.mouse.x = x;
        self.mouse.y = y;

        game.click(x, y, button);
      }
    }

  });

  canvas.addEventListener('contextmenu', function(e) {
    e.preventDefault();
  });

  document.addEventListener('keydown', function(e) {
    game.input.keys[e.keyCode] = true;
    game.keydown(e.which);
  });

  document.addEventListener('keyup', function(e) {
    game.input.keys[e.keyCode] = false;
    game.keyup(e.which);
  });

  if (game.keypress) {
    document.addEventListener('keypress', function(e) {
      game.keypress(e.which);
    });
  }
};

module.exports = Input;

},{"./keys":8}],8:[function(_dereq_,module,exports){
module.exports = {
  'MOUSE1':-1,
  'MOUSE2':-3,
  'MWHEEL_UP':-4,
  'MWHEEL_DOWN':-5,
  'BACKSPACE':8,
  'TAB':9,
  'ENTER':13,
  'PAUSE':19,
  'CAPS':20,
  'ESC':27,
  'SPACE':32,
  'PAGE_UP':33,
  'PAGE_DOWN':34,
  'END':35,
  'HOME':36,
  'LEFT':37,
  'UP':38,
  'RIGHT':39,
  'DOWN':40,
  'INSERT':45,
  'DELETE':46,
  '_0':48,
  '_1':49,
  '_2':50,
  '_3':51,
  '_4':52,
  '_5':53,
  '_6':54,
  '_7':55,
  '_8':56,
  '_9':57,
  'A':65,
  'B':66,
  'C':67,
  'D':68,
  'E':69,
  'F':70,
  'G':71,
  'H':72,
  'I':73,
  'J':74,
  'K':75,
  'L':76,
  'M':77,
  'N':78,
  'O':79,
  'P':80,
  'Q':81,
  'R':82,
  'S':83,
  'T':84,
  'U':85,
  'V':86,
  'W':87,
  'X':88,
  'Y':89,
  'Z':90,
  'NUMPAD_0':96,
  'NUMPAD_1':97,
  'NUMPAD_2':98,
  'NUMPAD_3':99,
  'NUMPAD_4':100,
  'NUMPAD_5':101,
  'NUMPAD_6':102,
  'NUMPAD_7':103,
  'NUMPAD_8':104,
  'NUMPAD_9':105,
  'MULTIPLY':106,
  'ADD':107,
  'SUBSTRACT':109,
  'DECIMAL':110,
  'DIVIDE':111,
  'F1':112,
  'F2':113,
  'F3':114,
  'F4':115,
  'F5':116,
  'F6':117,
  'F7':118,
  'F8':119,
  'F9':120,
  'F10':121,
  'F11':122,
  'F12':123,
  'SHIFT':16,
  'CTRL':17,
  'ALT':18,
  'PLUS':187,
  'COMMA':188,
  'MINUS':189,
  'PERIOD':190
};

},{}],9:[function(_dereq_,module,exports){
module.exports = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

},{}],10:[function(_dereq_,module,exports){
var isRetina = function() {
  var mediaQuery = "(-webkit-min-device-pixel-ratio: 1.5),\
  (min--moz-device-pixel-ratio: 1.5),\
  (-o-min-device-pixel-ratio: 3/2),\
  (min-resolution: 1.5dppx)";

  if (window.devicePixelRatio > 1)
    return true;

  if (window.matchMedia && window.matchMedia(mediaQuery).matches)
    return true;

  return false;
};

module.exports = isRetina;

},{}],11:[function(_dereq_,module,exports){
module.exports = (function() {
  return window.performance || Date;
})();

},{}],12:[function(_dereq_,module,exports){
var get = exports.get = function(url, callback) {
  var request = new XMLHttpRequest();
  request.open('GET', url, true);

  request.onload = function() {
    callback(this.response);
  };

  request.send();
};

var getJSON = exports.getJSON = function(url, callback) {
  get(url, function(text) {
    callback(JSON.parse(text));
  });
};

exports.isFunction = function(obj) {
  return !!(obj && obj.constructor && obj.call && obj.apply);
};


},{}],13:[function(_dereq_,module,exports){
/**
 * @constructor
 * @param {HTMLCanvasElement} canvas - Canvas DOM element
 */
var Video = function(canvas, config) {
  /**
   * Canvas DOM element
   * @type {HTMLCanvasElement}
   */
  this.canvas = canvas;

  /**
   * Game width in pixels
   * @type {number}
   */
  this.width = null;

  /**
   * Game height in pixels
   * @type {number}
   */
  this.height = null;

  /**
   * canvas context
   * @type {CanvasRenderingContext2D}
   */
  if (config.initializeCanvas) {
    this.ctx = canvas.getContext('2d');
  }
};

/**
 * Includes mixins into Video library
 * @param {object} methods - object of methods that will included in Video
 */
Video.prototype.include = function(methods) {
  for (var method in methods) {
    this[method] = methods[method];
  }
};

Video.prototype.beginFrame = function() {
  if (this.ctx) {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }
};

Video.prototype.endFrame = function() {};

/**
 * Scale canvas buffer, used for retina screens
 * @param {number} scale
 */
Video.prototype.scaleCanvas = function(scale) {
  this.canvas.style.width = this.canvas.width + 'px';
  this.canvas.style.height = this.canvas.height + 'px';

  this.canvas.width *= scale;
  this.canvas.height *= scale;

  if (this.ctx) {
    this.ctx.scale(scale, scale);
  }
};

/**
 * Draws image sprite into x a y position
 * @param {object} sprite - sprite data
 * @param {number} x - x position
 * @param {number} y - y position
 * @param {number} [offsetX] - image position offset x
 * @param {number} [offsetY] - image position offset y
 * @param {number} [w] - final rendering width
 * @param {number} [h] - final rendering height
 */
Video.prototype.sprite = function(image, x, y, offsetX, offsetY, w, h) {
  if (!this.ctx) { return; }

  offsetX = offsetX || 0;
  offsetY = offsetY || 0;

  w = w || image.width;
  h = h || image.height;

  x = Math.floor(x);
  y = Math.floor(y);

  var drawWidth = w;
  var drawHeight = h;

  if (image.src.match(/@2x.png$/)) {
    drawWidth /= 2;
    drawHeight /= 2;
  }

  this.ctx.drawImage(image, image.x + offsetX, image.y + offsetY, w, h, x, y, drawWidth, drawHeight);
};

/**
 * Draw animatino at given location
 * @param {Animation} animation - Animation object
 * @param {number} x - x position
 * @param {number} y - y position
 */
Video.prototype.animation = function(animation, x, y) {
  if (!this.ctx) { return; }

  this.sprite(animation.image, x, y, animation.offsetX, animation.offsetY, animation.width, animation.height);
};

module.exports = Video;

},{}]},{},[1])
(1)
});