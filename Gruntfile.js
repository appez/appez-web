module.exports = function(grunt) {
	
	var gruntConfig = {
    pkg: {},
	
	proj:{
      // configurable paths
	  root : '',
      dist: 'dist',
	  lib : ''
    },
	// delete previous build artifact.
	clean:['<%= proj.root %><%= proj.dist %>'],
	// include js file listed in index.html
	useminPrepare: {
      html: '<%= proj.root %>index.html',
      options: {
        dest: '<%= proj.root %><%= proj.dist %>/<%= pkg.name %>',
		staging: '<%= proj.root %><%= proj.dist %>/.tmp'
      }
    },
	//Concat js files.
    concat: {
      options: {
        separator: ';'
      }
    },
	// Minify js files
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      }
    },
	// Minify css file.
	cssmin:{
		minify: {
		expand: true,
		cwd: '<%= proj.root %>resources/styles/',
		src: ['*.css', '!*.min.css'],
		dest: '<%= proj.root %><%= proj.dist %>/css/',
		ext: '.min.css'
	  }
	},
	// Execute qunit test cases.
	qunit: {
		all: {
		  options: {
			urls: [
			  'http://localhost:8000/<%= proj.root %>test/test.html',
			]
		  }
		}
	  },
	  // Create server for qunit test execution.
	connect: {
		server: {
		  options: {
			hostname: 'localhost',
			port: 8000,
			base: '.'
		  }
		}
	},
	// Copy files
	copy:{
		// Copy minified and concat file to Libs. 
		minjs: {
			 files: [
			 {
				src: '<%= useminPrepare.options.dest %>/<%= pkg.name %>.js',
				dest: '<%= proj.lib %>/<%= pkg.name %>_<%= pkg.version %>.min.js'
			},
			{
				src: '<%= useminPrepare.options.staging %>/concat/<%= pkg.name %>.js',
				dest: '<%= proj.lib %>/<%= pkg.name %>_<%= pkg.version %>.js'
			},
			]
		},
		// create uic dev bundle.
		uic: {
			 files: [
			 {
				expand: true,
				cwd: '<%= proj.root %>/resources/',
				src: '**',
				dest: '<%= proj.lib %>/<%= pkg.version %>/<%= pkg.name %>/resources/'
			},
			{
				src: '<%= useminPrepare.options.staging %>/concat/<%= pkg.name %>.js',
				dest: '<%= proj.lib %>/<%= pkg.version %>/<%= pkg.name %>/<%= pkg.name %>_<%= pkg.version %>.js'
			},
			]
		},
		// create uic prod bundle.
		uicmin: {
			 files: [
			 {
				expand: true,
				cwd: '<%= proj.root %>/resources/fonts/',
				src: '**',
				dest: '<%= proj.lib %>/<%= pkg.version %>.min/<%= pkg.name %>/resources/fonts/'
			},
			{
				expand: true,
				cwd: '<%= proj.root %>/resources/img/',
				src: '**',
				dest: '<%= proj.lib %>/<%= pkg.version %>.min/<%= pkg.name %>/resources/img/'
			},
			{
				expand: true,
				cwd: '<%= proj.root %>/resources/styles/',
				src: ['*.css', '!*.min.css'],
				dest: '<%= proj.lib %>/<%= pkg.version %>.min/<%= pkg.name %>/resources/styles/'
			},
			{
				src: '<%= useminPrepare.options.dest %>/<%= pkg.name %>.js',
				dest: '<%= proj.lib %>/<%= pkg.version %>.min/<%= pkg.name %>/<%= pkg.name %>_<%= pkg.version %>.min.js'
			},
			]
		}
	  
	}
	
  };
	// initialize grunt with gruntConfig. gruntConfig is defined so that
	//  properties can be further utilized in custom task
	grunt.initConfig(gruntConfig);
  
  
	// Custom task for SmartWeb. set variable according to smartweb then execute task.
	grunt.registerTask('ci-mmi', function () {
		
		gruntConfig.pkg.name = 'mmi';
		gruntConfig.proj.root = 'MMI/Trunk/';
        gruntConfig.proj.lib = 'MMI/Libs/';
		gruntConfig.pkg=grunt.file.readJSON('MMI/Trunk/package.json');
		
		// listen for test case fail event. if failed then stop execution.
		grunt.event.on('qunit.done',function(failed, passed, total, runtime){
			if(failed>0){
				grunt.fail.warn(failed+" of "+total+" test case(s) failed.");
			}
			
		});
		// Run default task.
		grunt.task.run('default');
    });
	// Custom task for SmartWeb. set variable according to smartweb then execute task.
	grunt.registerTask('ci-smartweb', function () {
		
		gruntConfig.pkg.name = 'smartweb';
		gruntConfig.proj.root = 'SmartWeb/Trunk/';
        gruntConfig.proj.lib = 'SmartWeb/Libs/';
		gruntConfig.pkg=grunt.file.readJSON('SmartWeb/Trunk/package.json');
		
		// listen for test case fail event. if failed then stop execution.
		grunt.event.on('qunit.done',function(failed, passed, total, runtime){
			if(failed>0){
				grunt.fail.warn(failed+" of "+total+" test case(s) failed.");
			}
			
		});
		// Run default task.
		grunt.task.run('default');
    });
	
	// Custom task for uic. set variable according to uic then execute task.
	grunt.registerTask('ci-uic', function () {
		
		gruntConfig.pkg.name = 'uic';
		gruntConfig.proj.root = 'UIC/Trunk/';
        gruntConfig.proj.lib = 'UIC/Libs/';
		gruntConfig.pkg=grunt.file.readJSON('UIC/Trunk/package.json');
		
		// listen for test case fail event. if failed then stop execution.
		grunt.event.on('qunit.done',function(failed, passed, total, runtime){
			if(failed>0){
				grunt.fail.warn(failed+" of "+total+" test case(s) failed.");
			}
			
		});
		//Since uic need to minify css hence build-uic extend default custom task.
		grunt.task.run('build-uic');
    });
	// Load grunt npm modules.
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-usemin');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-qunit');
	
	// Define custom task.
	grunt.registerTask('build-uic', ['clean','useminPrepare','concat', 'uglify','cssmin:minify','copy:uic','copy:uicmin']);
	grunt.registerTask('default', ['clean','useminPrepare','concat', 'uglify','copy:minjs']);
	grunt.registerTask('test',['connect','qunit']);

};