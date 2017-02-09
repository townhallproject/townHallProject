module.exports = function(grunt) {
  grunt.initConfig({
        watch: {
      scripts: {
        files: ['styles/customboot.less'],
        tasks: ['dist-css'],
        options: {
          spawn: false,
        },
      },
    },
    bspkg: grunt.file.readJSON('bower_components/bootstrap/package.json'),
    bspath: 'bower_components/bootstrap',
    banner: '/*!\n' +
            ' * Bootstrap v<%= bspkg.version %> (<%= bspkg.homepage %>)\n' +
            ' * Copyright 2011-<%= grunt.template.today("yyyy") %> <%= bspkg.author %>\n' +
            ' * Licensed under <%= bspkg.license.type %> (<%= bspkg.license.url %>)\n' +
            ' */\n',
    less: {
      compileCore: {
        options: {
          strictMath: true,
          sourceMap: true,
          outputSourceFiles: true,
          sourceMapURL: 'styles/css/bootstrap.css.map',
          sourceMapFilename: 'styles/css/bootstrap.css.map',
          paths: '<%= bspath %>/less'
        },
        files: {
          'styles/css/bootstrap.css': 'styles/customboot.less'
        }
      }
    },
    autoprefixer: {
      options: {
        browsers: [
          'Android 2.3',
          'Android >= 4',
          'Chrome >= 20',
          'Firefox >= 24', // Firefox 24 is the latest ESR
          'Explorer >= 8',
          'iOS >= 6',
          'Opera >= 12',
          'Safari >= 6'
        ]
      },
      core: {
        options: {
          map: true
        },
        src: 'styles/css/bootstrap.css'
      }
    },
    cssmin: {
      options: {
        compatibility: 'ie8',
        keepSpecialComments: '*',
        noAdvanced: true
      },
      core: {
        files: {
          'styles/css/bootstrap.min.css': 'styles/css/bootstrap.css'
        }
      }
    }
  });

  // Loading our grunt modules
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // CSS distribution task.
  grunt.registerTask('dist-css', ['less:compileCore', 'autoprefixer', 'cssmin']);

};
