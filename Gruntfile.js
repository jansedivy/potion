module.exports = function(grunt) {
  grunt.initConfig({
    jsdoc : {
      dist : {
        src: ['src/*.js'],
        options: {
          destination: 'docs'
        }
      }
    },

    browserify: {
      dist: {
        files: {
          'build/potion.js': 'index.js'
        },
        options: {
          'standalone': 'Potion'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-jsdoc');
};
