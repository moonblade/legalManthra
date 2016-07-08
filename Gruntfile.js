var args = process.argv;
module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            generated: {
                src: ['public/development/scripts/app.js',
                    'public/development/scripts/app.factory.js',
                    'public/development/scripts/app.filter.js',
                    'public/development/modules/detail/detailController.js',
                    'public/development/modules/input/inputController.js',
                    'public/development/modules/search/searchController.js'
                ],
                dest: 'public/production/scripts/production.js'
            }
        },
        'replace': {
            serverUrl: {
                src: ['public/production/scripts/production.js', 'public/development/scripts/app.js'],
                overwrite: true,
                replacements: [{
                    from: "localhost",
                    to: "63.141.232.148"
                }]
            },
            localUrl: {
                src: ['public/production/scripts/production.js', 'public/development/scripts/app.js'],
                overwrite: true,
                replacements: [{
                    from: "63.141.232.148",
                    to: "localhost",
                }]
            },
            publicDevel: {
                src: ['app.js'],
                overwrite: true,
                replacements: [{
                    from: "public/production/",
                    to: "public/development/",
                }]
            },
            publicProd: {
                src: ['app.js'],
                overwrite: true,
                replacements: [{
                    from: "public/development/",
                    to: "public/production/",
                }]
            },

        },
        'useminPrepare': {
            html: 'public/development/index.html',
        },
        'usemin': {
            html: 'public/production/index.html',
        },
        uglify: {
            production: {
                files: {
                    'public/production/scripts/production.min.js': ['public/production/scripts/production.js']
                }
            }
        },
        gitpush: {
            master: {}
        },
        gitcommit: {
            ammend: {
                options: {
                    message: args[2]
                },
                files: [{
                    src: ["."],
                    expand: true,
                }]
            }
        }
    })
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-text-replace');
    grunt.loadNpmTasks('grunt-usemin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-git');
    grunt.registerTask('default', [
        'useminPrepare',
        'concat',
        'uglify',
        'usemin',
        'replace:localUrl'
    ]);
    grunt.registerTask('test', ['gitcommit:ammend'])
    grunt.registerTask('upload', [
        'replace:serverUrl',
        'replace:publicProd',
        'concat',
        'uglify',
        'gitcommit:ammend',
        'gitpush',
        'replace:localUrl',
        'replace:publicDevel'
    ])
}
