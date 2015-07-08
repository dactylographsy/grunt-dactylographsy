# grunt-dactylographsy

> Grunt task for fetching and injecting fingerprinted assets from multiple manifest files with general caching.

[![NPM](https://nodei.co/npm/grunt-dactylographsy.png?mini=true)](https://nodei.co/npm/grunt-dactylographsy/)

[![Build Status](https://travis-ci.org/tdeekens/grunt-dactylographsy.svg?branch=master)](https://travis-ci.org/tdeekens/grunt-dactylographsy)
[![Coverage Status](https://coveralls.io/repos/tdeekens/grunt-dactylographsy/badge.png)](https://coveralls.io/r/tdeekens/grunt-dactylographsy)
[![Dependency Status](https://david-dm.org/tdeekens/grunt-dactylographsy.svg?style=flat)](https://david-dm.org/tdeekens/grunt-dactylographsy)

## The Idea & Concepts

Complex web applications usually consist of various assets being served from one or multiple hosts. This slows down the user experience while normal browser caching usually is not able to tackle all the resulting load retardations.

Imagine JavaScript und CSS files being cached in the client via localstorage by their fingerprints making the application load instantly while new versions are automatically swapped (cache invalidation) in the background while the application is running - resulting in an updated application after a refresh.

With dactylographsy every unit of an application can create a custom manifest listing all assets it consists of. These assets will be injected into the page while their contents will be cached when they are once loaded. After the cache is filled it serves all files on any subsequent page load to speed up the initial load time. As mentioned, the caches might be invalidated at runtime by making a comparison between old and eventually new manifest(s).

[![Architecture Overview](https://github.com/tdeekens/grunt-dactylographsy/blob/master/docs/overview.png)](https://github.com/tdeekens/grunt-dactylographsy/blob/master/docs/overview.png)

A running example can be found [here](https://github.com/tdeekens/grunt-dactylographsy/blob/master/example).

## Getting Started
This plugin requires Grunt `~0.4.2`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

### Install node dependency via npm

```shell
npm install grunt-dactylographsy --save-dev
```

### Install client dependency via bower

```shell
bower install dactylographsy --save
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
// The project's root url: written into manifest, consumed by client-side script
rootUrl: ''
// Additional meta information for manifest (JSON stringified)
package: 'None'
```

An example configuration can be found [here](https://github.com/tdeekens/grunt-dactylographsy/blob/master/grunt/tasks/dactylographsy.js) and if you want to check the options you might want to check the [Gruntfile](https://github.com/tdeekens/grunt-dactylographsy/blob/master/tasks/dactylographsy.js#L22) itself.

## Developing & Contributing

Developing on the task alone is fairly easy just `git clone https://github.com/tdeekens/grunt-dactylographsy.git` then `cd grunt-dactylographsy`. From there one has to link the package to itself via `npm link && npm link grunt-dactylographsy` which will allow for calling `grunt dev`. Now just work the `task/dactylographsy.js` and check results - feel free to submit a pull-request!

## Release History

- 0.0.0 Development, do not use!
- 1.0.0 Initial release with grunt-task and client-side script
