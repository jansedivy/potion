module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    sprite:{
      all: {
        src: './assets/*.png',
        destImg: './sprite.png',
        destCSS: './sprite.json',
        cssFormat: 'json',
        engineOpts: { 'imagemagick': true },
        padding: 2
      }
    },

    browserify: {
      'bundle.min.js': './app.js'
    },

    watch: {
      assets: {
        files: ['assets/**/*.*'],
        tasks: ['sprite'],
        options: {
          interrupt: true,
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-spritesmith');

  grunt.registerTask('default', ['browserify']);
};
