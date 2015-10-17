# grunt-dactylographsy

[![Build Status](https://travis-ci.org/dactylographsy/grunt-dactylographsy.svg?branch=master)](https://travis-ci.org/dactylographsy/grunt-dactylographsy) ♦️
[![Dependency Status](https://david-dm.org/dactylographsy/grunt-dactylographsy.svg?style=flat)](https://david-dm.org/dactylographsy/grunt-dactylographsy) ♦️
[![devDependency Status](https://david-dm.org/dactylographsy/grunt-dactylographsy/dev-status.svg)](https://david-dm.org/dactylographsy/grunt-dactylographsy#info=devDependencies) ♦
[![npm version](https://badge.fury.io/js/grunt-dactylographsy.svg)](http://badge.fury.io/js/grunt-dactylographsy)

> Grunt task generating manifests with fingerprinted assets to be injected and cached via localstorage.

[![NPM](https://nodei.co/npm/grunt-dactylographsy.png)](https://nodei.co/npm/grunt-dactylographsy/)

## Getting Started
This plugin requires Grunt `~0.4.2`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

### Install node dependency via npm

```shell
npm install grunt-dactylographsy --save-dev
``````

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
// Root impacting location of dactylographsy.json
root: 'dist'
// The project's root url: written into manifest, consumed by client-side script
rootUrl: null
// Additional package url: e.g. if multiple packages reside on the same host
packageUrl: null
// Paths which assets are stored internally but which are not relevant for client-side script
// e.g. /dist. These will be removed from paths to assets!
devPaths: []
// The package name to identify the manifest by
package: 'None'
```

An example configuration can be found [here](https://github.com/dactylographsy/grunt-dactylographsy/blob/master/grunt/tasks/dactylographsy.js) and if you want to check the options you might want to check the [Gruntfile](https://github.com/dactylographsy/grunt-dactylographsy/blob/master/tasks/dactylographsy.js#L22) itself.

## Developing & Contributing

Developing on the task alone is fairly easy just `git clone https://github.com/dactylographsy/grunt-dactylographsy.git` then `cd grunt-dactylographsy`. From there one has to link the package to itself via `npm link && npm link grunt-dactylographsy` which will allow for calling `grunt dev`. Now just work the `task/dactylographsy.js` and check results - feel free to submit a pull-request!

## Release History

- 0.0.0 Development, do not use!
- 1.0.0 Initial release with grunt-task and client-side script
- 1.0.1 Add support for stripping dev folders from asset directories via devPaths option
- 1.0.2 Add versioned client side bundles
- 1.1.0 Refactor root path resolving and add support for cache prefix
- 1.1.1 Fix root path resolving adding stripping of null'ed values
- 1.1.2 Add a package url option
- 1.1.3 Release caused by upgrade of UglifyJS
- 1.2.0 Add injection of unprinted scripts in case of error
- 1.2.1 Delay caching while still immediately taking care of 404'ed assets
- 1.3.0 Feature detect localstorage
- 1.4.0 Add delayed refreshing of app
- 1.5.0 Add data-attribtue with script name to inline-scripts from cache
- 1.6.0 Add cache cleaning by unique identifer to not keep n-versions of files in cache and add cache delay
- 1.6.1 Fix assets being deduped by filename, extension and their path
- 1.7.0 Stable release
- 1.8.0 Add 'cacheManifests' option to indicate if manifests shall be cached or not
- 1.9.0 Add configurable logging (not removing console-statements with minifiction)
- 1.9.1 Fix major issue in script injection order (promise resolving on cache with earlier rejection)
- 1.9.2 Fix auto deferring inline scripts breaking the injection order too
- 1.9.3 Fix singarity of cached assets for adding entry on serialized object
- 1.10.0 Add using document fragments for injections (speeds up DOM access)
- 1.11.0 Fix issue where cached js-files where executed before uncached files
- 1.12.0 Add using `node-dactylographsy` and remove thereby duplicate sources
- 1.13.0 Moves all browser related sources to `browser-dactylographsy`

## Acknowledgements

- ...to great people around me supporting me with ideas and feedback!
