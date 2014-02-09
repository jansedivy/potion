module.exports = function(grunt) {
  var banner = [
    '/**',
    ' * <%= pkg.name %> - v<%= pkg.version %>',
    ' * Copyright (c) 2014, Jan Sedivy',
    ' *',
    ' * Compiled: <%= grunt.template.today("yyyy-mm-dd") %>',
    ' *',
    ' * <%= pkg.name %> is licensed under the <%= pkg.license %> License.',
    ' */',
    ''
  ].join('\n');

  grunt.initConfig({
    pkg : grunt.file.readJSON('package.json'),

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
      options: {
        banner: banner
      },
      dist: {
        src: 'build/potion.js',
        dest: 'build/potion.min.js'
      }
    },

    concat: {
      options: {
        banner: banner
      },
      dist: {
        src: 'build/potion.js',
        dest: 'build/potion.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('build', ['browserify', 'concat', 'uglify']);
};
