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
    },

    uglify: {
      dist: {
        src: 'build/potion.js',
        dest: 'build/potion.min.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('build', ['browserify', 'uglify']);
};
