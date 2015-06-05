module.exports = function(grunt) {
	
	//Get all tasks from the package.json file
	require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);
	
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),    
        
		concurrent: {
		    watch: {
		        tasks: ['compass:dist', 'watch'],
		        options: {
		            logConcurrentOutput: true
		        }
		    }
		},
	
		 compass: {
			dist: {
				options: {
				  sassDir: ['scss/'],
				  cssDir: ['css/'],
				  environment: 'development', /* development | production */
				  importPath: ['scss/'],
				  outputStyle: 'expanded', /* expanded for development | compressed for production */
				  watch: true
				}
			}
		},

		concat: { 
            dist: {
	            src: [
	            	'lib/jquery/dist/jquery.min.js'
	            ],
	            dest: 'js/dependencies.js'
            }            
        },

        uglify: {
	        build: {
		        src: 'js/dependencies.js',
		        dest: 'js/dependencies.min.js'
	        }	        
        },
		
		watch: {
			css: {
				files: ['css/**/*.css'],
				options: { livereload: true }
			},
            js: {
                files: ['js/app.js'],
                tasks: ['concat', 'uglify'],
                options: { livereload: true }
            },
			templates: {
				files: ['**/*.php', '**/*.html'],
				options: { livereload: true }
			}
		}

    });

    // Where we tell Grunt what to do when we type "grunt" into the terminal.
    
	grunt.registerTask('default', ['concurrent:watch']);    

}; 
		          
		          