var Potion = require('potion');

var app;

var GameState = function() {};

GameState.prototype.init = function() {
  this.position = 0;
  this.totalTime = 0;
};

GameState.prototype.update = function(time) {
  this.totalTime += time;
  this.position = Math.sin(this.totalTime) * (app.width - 80)/2 + (app.width - 80)/2;
};

GameState.prototype.render = function() {
  app.video.ctx.fillStyle = '#bada55';
  app.video.ctx.fillRect(this.position, app.height-100, 80, 100);

  app.video.ctx.fillStyle = 'black';
  app.video.ctx.font = '20px sans-serif';
  app.video.ctx.textAlign = 'left';
  app.video.ctx.textBaseline = 'top';
  app.video.ctx.fillText('Esc to pause', 10, 10);
};

GameState.prototype.keydown = function(key) {
  if (key === 27) { // esc
    app.states.pause('game');
    app.states.enable('pause');
  }
};

var PauseState = function() {};

PauseState.prototype.render = function() {
  app.video.ctx.fillStyle = 'black';
  app.video.ctx.font = '20px sans-serif';
  app.video.ctx.textAlign = 'center';
  app.video.ctx.textBaseline = 'middle';
  app.video.ctx.fillText('Pause', app.width/2, 100);

  app.video.ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  app.video.ctx.fillRect(0, 0, app.width, app.height);
};


PauseState.prototype.keydown = function(key) {
  if (key === 27) { // esc
    app.states.disable('pause');
    app.states.unpause('game');
  }
};

var MenuState = function() {};

MenuState.prototype.render = function() {
  app.video.ctx.fillStyle = 'black';
  app.video.ctx.font = '20px sans-serif';
  app.video.ctx.textAlign = 'center';
  app.video.ctx.textBaseline = 'middle';
  app.video.ctx.fillText('Main Menu', app.width/2, 100);

  app.video.ctx.font = '14px sans-serif';
  app.video.ctx.fillText('Press any key to start the game', app.width/2, 160);
};

MenuState.prototype.keyup = function() {
  app.states.enable('game');
  app.states.disable('menu');
};

app = Potion.init(document.querySelector('.game'), {
  init: function() {
    app.states.add('game', new GameState());
    app.states.add('pause', new PauseState());
    app.states.add('menu', new MenuState());

    app.states.disable('game');
    app.states.disable('pause');
  }
});
