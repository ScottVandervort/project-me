module.exports = function(grunt) {
  // Do grunt-related things in here

  grunt.config( 'javascriptFiles', 
                [ 'public/javascripts/app.js',
                  'public/javascripts/directives/googleMap.js',
                  'public/javascripts/directives/imageEditor.js',
                  'public/javascripts/services/entryService.js',
                  'public/javascripts/services/searchService.js',
                  'public/javascripts/controllers/imageEntryController.js',
                  'public/javascripts/controllers/journalEntryController.js',
                  'public/javascripts/controllers/locationEntryController.js',
                  'public/javascripts/controllers/homeController.js',
                  'public/javascripts/controllers/navigationController.js' ]);

  grunt.config( 'cssFiles', 
                [ 'public/stylesheets/style.css' ]);                  

  grunt.initConfig({
    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          captureFile: 'results.txt', // Optionally capture the reporter output to a file
          quiet: false, // Optionally suppress output to standard out (defaults to false)
          clearRequireCache: false, // Optionally clear the require cache before running tests (defaults to false)
          noFail: false // Optionally set to not fail on failed tests (will still fail on other errors)
        },
        src: ['test/**/*.js']
      }
    },    
    jshint: {
      all: ['app.js',
            'routes/*.js',
            'public/javascripts/**/*.js']
    },
    cssmin: {
      options: {
        shorthandCompacting: false,
        roundingPrecision: -1
      },
      target: {
        files: {
          '../dist/public/stylesheets/me.min.css' : grunt.config( 'cssFiles'),
        }
      }
    },    
    uglify: {
      options: {
        mangle: false
      },
      js: {
        files: {
          '../dist/public/javascripts/me.min.js': grunt.config( 'javascriptFiles')
        }
      }    
    },    
    concat: {
      js: {
        src: grunt.config( 'javascriptFiles'),      
        dest: '../dist/public/javascripts/me.js',        
        options: {
          separator: ';',
        }
      },
      css: {
        src: grunt.config( 'cssFiles'),      
        dest: '../dist/public/stylesheets/me.css',        
        options: {
          separator: ' ',
        }
      }
    },
    copy: {
      main: {
        files: [
          {expand: true, src: ['routes/**'], dest: '../dist/'},
          {expand: true, src: ['views/**'], dest: '../dist/'},
          {expand: true, src: ['config/**'], dest: '../dist/'},
          {expand: true, src: ['bin/**'], dest: '../dist/'},
          {expand: true, src: ['public/views/**'], dest: '../dist/'},                                           
          {expand: true, src: ['package.json'], dest: '../dist/'},
          {expand: true, src: ['bower.json'], dest: '../dist/'},          
          {expand: true, src: ['app.js'], dest: '../dist/'},                             
        ],
      }
},    
  });  

  // Load the plugins ...
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-copy');  
  grunt.loadNpmTasks('grunt-contrib-uglify');  
  grunt.loadNpmTasks('grunt-contrib-cssmin')  

  grunt.registerTask('default', ['test','build']);
  
  grunt.registerTask('test', '', ['jshint','mochaTest']);

  grunt.registerTask('build', '', function() {

    grunt.file.mkdir('../dist');
    grunt.file.mkdir('../dist/uploads');
    grunt.file.mkdir('../dist/logs');
    grunt.file.mkdir('../dist/public/images');     

    grunt.task.run(['uglify']);
    grunt.task.run(['cssmin']);    
    grunt.task.run(['copy']);
  });  

};