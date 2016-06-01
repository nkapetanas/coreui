module.exports = function (grunt) {
    // Project configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        clean: {
            dist: [
                'dist/**/*.*',
            ],
        },

        copy: {
            scripts: {
                expand: true,
                cwd: 'src/js',
                src: ['**.js'],
                dest: 'dist/js',
                filter: 'isFile',
            },
            tests: {
                expand: true,
                cwd: 'src/tests',
                src: ['**/*.*'],
                dest: 'dist/tests',
                filter: 'isFile',
            },
            // Copy docs to local dist folder for initial project-level grunt task
            docs: {
                expand: true,
                cwd: 'src/docs',
                src: [
                        '**/*.*',
                        '!**/*.md',
                     ],
                dest: 'dist/docs',
                filter: 'isFile',
            },
            // Copy docs to root folder when using `grunt watch` so they can be viewed in the browser
            docsToRoot: {
                expand: true,
                cwd: 'dist/docs',
                src: [
                        '**/*.*',
                        '!**/*.md',
                     ],
                dest: '../../../../docs/components/modal',
                filter: 'isFile',
            },
        },

        sass: {
            options: {
                sourceMap: true,
                outputStyle: 'nested', // Options: nested, compressed
            },

            cui: {
                files: {
                    'dist/css/modal.css': ['src/scss/modal.scss']
                },
            },
        },

        // https://github.com/gruntjs/grunt-contrib-jshint
        // Supported options: http://jshint.com/docs/
        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                browser: true,
                unused: 'vars',
            },
            files: [
                'src/js/**/*.js',
            ],
        },

        md2html: {
            options: {
                highlightjs: {
                    enabled: true,
                    style: 'github',
                    compressStyle: true,
                },
            },
            docs: {
                options: {
                    layout: 'src/cui/docs/src/assets/templates/default.html',
                },
                files: [{
                    expand: true,
                    cwd: 'src/cui/docs/src',
                    src: ['**/*.md'],
                    dest: 'docs',
                    ext: '.html',
                }],
            },
        },

        watch: {
            options: {
                livereload: 35728,
                interrupt: true,
            },

            styles: {
                files: [
                    '*.scss', // Settings file
                    'src/**/*.scss',
                ],
                tasks: [
                    'sass',
                    'copy',
                ],
            },

            scripts: {
                files: [
                    'src/**/*.js',
                ],
                tasks: [
                    'jshint',
                    'copy',
                ],
            },

            docs: {
                files: [
                    'src/docs/**/*.*',
                ],
                tasks: [
                    'md2html',
                    'copy:docs',
                    'copy:docsToRoot',
                ],
            },
        },
    });

    // Load all Grunt plugins
    require('load-grunt-tasks')(grunt);

    // Default task
    grunt.registerTask('default', ['jshint', 'clean', 'sass', 'md2html', 'copy']);

    // Development task
    grunt.registerTask('dev', ['default', 'watch']);
};
