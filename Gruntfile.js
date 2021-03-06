module.exports = function(grunt) {

    grunt.registerTask( 'default', [ 'clean', 'browserify', 'sass', 'autoprefixer', 'copy', 'hapi', 'watch'] );

    grunt.registerTask( 'build', [ 'clean', 'browserify', 'sass', 'autoprefixer', 'copy' ] );

    grunt.registerTask( 'run', [ 'hapi', 'watch' ]);

    grunt.initConfig({
        browserify: {
            dist: {
                files: {
                    './dist/scripts/app.js': ['./app/scripts/app.js']
                }
            }
        },

        sass: {
            dist: {
                options: {
                    style: 'expanded'
                },
                files: {
                    './dist/css/main.css': './app/sass/main.scss'
                }
            }
        },

        autoprefixer: {
            dist: {
                files: {
                    './dist/css/main.css': './dist/css/main.css'
                }
            }
        },

        watch: {
            hapi: {
                files: [
                    './app/images/*.{png,jpg,jpeg}',
                    './app/scripts/**/*.js',
                    './app/sass/**/*.scss',
                    './app/pages/**/*.html',
                    './app/templates/**/*.html',
                    'Gruntfile.js'
                ],
                tasks: [
                    'clean',
                    'browserify',
                    'sass',
                    'autoprefixer',
                    'copy'
                ],
                options: {
                    spawn: false
                }
            }
        },

        copy: {
            dist: {
                files: [{
                    expand: true,
                    src: [ './assets/**' ],
                    dest: './dist/',
                    cwd: './app'
                }, {
                    expand: true,
                    src: [ './**/*.html' ],
                    dest: './dist',
                    cwd: './app/pages'
                }, {
                    expand: true,
                    src: [ './**/*.html' ],
                    dest: './dist/templates',
                    cwd: './app/templates'
                }, {
                  expand: true,
                  src: [ './**/*.js' ],
                  dest: './dist/scripts',
                  cwd: './app/scripts'
                }]
            }
        },

        hapi: {
            custom_options: {
                options: {
                    server: require('path').resolve('./server'),
                    bases: {
                        '/dist': require('path').resolve('./dist/')
                    }
                }
            }
        },

        clean: ['./dist']
    });

    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-hapi');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-autoprefixer');
};
