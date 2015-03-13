# grunt-dactylographsy

> Grunt task for gathering the file sizes of different asset types over time.

[![NPM](https://nodei.co/npm/grunt-dactylographsy.png?mini=true)](https://nodei.co/npm/grunt-dactylographsy/)

[![Build Status](https://travis-ci.org/tdeekens/grunt-dactylographsy.svg?branch=master)](https://travis-ci.org/tdeekens/grunt-dactylographsy)
[![Coverage Status](https://coveralls.io/repos/tdeekens/grunt-dactylographsy/badge.png)](https://coveralls.io/r/tdeekens/grunt-dactylographsy)
[![Dependency Status](https://david-dm.org/tdeekens/grunt-dactylographsy.svg?style=flat)](https://david-dm.org/tdeekens/grunt-dactylographsy)

## Getting Started
This plugin requires Grunt `~0.4.2`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-dactylographsy --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-dactylographsy');
```

## The "dactylographsy" task

### Overview
In your project's Gruntfile, the `dactylographsy` task is available to use.

You can run `grunt dactylographsy` standalone
Or add it to an existing task: `grunt.registerTask('test', ['clean', 'dactylographsy']);`

### Options

```js
// Location of manifest file containing file information with hashes
location: 'dactylographsy.json'
// Root impacting location
root: 'dist'
// Additional meta information for manifest (JSON stringified)
package: 'None'
```

An example configuration can be found [here](https://github.com/tdeekens/grunt-dactylographsy/blob/master/grunt/tasks/dactylographsy.js) and if you want to check the options you might want to check the [Gruntfile](https://github.com/tdeekens/grunt-dactylographsy/blob/master/tasks/dactylographsy.js#L22) itself.

## Developing & Contributing

Developing on the task alone is fairly easy just `git clone https://github.com/tdeekens/grunt-dactylographsy.git` then `cd grunt-dactylographsy`. From there one has to link the package to itself via `npm link && npm link grunt-dactylographsy` which will allow for calling `grunt dev`. Now just work the `task/dactylographsy.js` and check results - feel free to submit a pull-request!

## Release History
- 0.0.0 Development, do not use!
