/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    watch: {
      lessfiles: {
        files: ['styleguide/stylesheets/*.less'],
        tasks: ['less']
      },
      htmlfiles: {
        files: ['styleguide/index.html'],
        tasks: ['htmlmin']
      }
    },
    less: {
      development: {
        options: {
          paths: ["/"]
        },
        files: {
          "styleguidedist/stylesheets/result.css": "styleguide/stylesheets/main.less"
        }
      },
      production: {
        options: {
          paths: ["/"],
          yuicompress: true
        },
        files: {
          "styleguidedist/stylesheets/result.css": "styleguide/stylesheets/main.less"
        }
      }
    },
    htmlmin: {                                     // Task
      dist: {                                      // Target
        options: {                                 // Target options
          removeComments: true,
          collapseWhitespace: true
        },
        files: {                                   // Dictionary of files
          'styleguidedist/index.html': 'styleguide/index.html'
        }
      },
      dev: {                                       // Another target
        files: {
          'styleguidedist/index.html': 'styleguide/index.html'
        }
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');

  // Default task.
  grunt.registerTask('default', ['less', 'htmlmin']);

};
