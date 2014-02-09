module.exports = function(grunt) {
  grunt.initConfig({
    jsdoc : {
      dist : {
        src: ['src/*.js'],
        options: {
          destination: 'docs'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-jsdoc');
};
