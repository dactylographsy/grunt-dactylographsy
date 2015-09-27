# grunt-dactylographsy

[![Build Status](https://travis-ci.org/tdeekens/grunt-dactylographsy.svg?branch=master)](https://travis-ci.org/tdeekens/grunt-dactylographsy) ♦️
[![Coverage Status](https://coveralls.io/repos/tdeekens/grunt-dactylographsy/badge.png)](https://coveralls.io/r/tdeekens/grunt-dactylographsy) ♦️
[![Dependency Status](https://david-dm.org/tdeekens/grunt-dactylographsy.svg?style=flat)](https://david-dm.org/tdeekens/grunt-dactylographsy) ♦️
[![devDependency Status](https://david-dm.org/tdeekens/grunt-dactylographsy/dev-status.svg)](https://david-dm.org/tdeekens/grunt-dactylographsy#info=devDependencies)

> Grunt task generating manifests with fingerprinted assets to be injected and cached via localstorage.

[![NPM](https://nodei.co/npm/grunt-dactylographsy.png)](https://nodei.co/npm/grunt-dactylographsy/)

[![npm version](https://badge.fury.io/js/grunt-dactylographsy.svg)](http://badge.fury.io/js/grunt-dactylographsy) ♦️
[![Bower version](https://badge.fury.io/bo/dactylographsy.svg)](http://badge.fury.io/bo/dactylographsy)

> Note: This project is in an early stage. Still, it has proven its usefulness and has been incorporated in larger projects. Down the road it will move into an organization with seperate grunt- and gulp-task repositories.

## The Idea & Concepts

Complex web applications usually consist of various assets being served from one or multiple hosts. This slows down the user experience while normal browser caching usually is not able to tackle all the resulting load retardations.

Imagine JavaScript und CSS files being cached in the client via localstorage by their fingerprints making the application load instantly while new versions are automatically swapped (cache invalidation) in the background during runtime of the application is running - resulting in an updated application after a refresh.

With dactylographsy every unit of an application can create a custom manifest listing all assets it consists of. These assets will be injected into the page while their contents will be cached when they are once loaded. After the cache is filled it serves all files on any subsequent page load to speed up the initial load time. As mentioned, the caches might be invalidated at runtime by making a comparison between old and eventually new manifest(s).

![Architecture Overview](https://raw.githubusercontent.com/tdeekens/grunt-dactylographsy/master/docs/overview.png)

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

An example configuration can be found [here](https://github.com/tdeekens/grunt-dactylographsy/blob/master/grunt/tasks/dactylographsy.js) and if you want to check the options you might want to check the [Gruntfile](https://github.com/tdeekens/grunt-dactylographsy/blob/master/tasks/dactylographsy.js#L22) itself.

## The client-side bundle

### Embedding as `<script />`-tag

```html
<script
  id="dactylographsy"
  charset="utf-8"
  src="../dist/dactylographsy.js"
  data-config='{"order":["vertical-1", "vertical-2"], "ttl": 1, "appPrefix": "example", "refreshDelay": 1000, "enableLogging": true}'
  data-manifests='["vertical-1/dactylographsy.json", "vertical-2/dactylographsy.json"]'>
</script>
```

More examples can be found in `/examples`.

### Options

```js
// Manifests in order of which their assets will be injected
order: []
// Time to live when exceeded causes whole cache (local storage) to be flushed
ttl: null
// Prefix for the application prepended to all assets' paths
appPrefix: null
// Delay in ms when exceeded performs reqeusts to check if assets are outdated
refreshDelay: null
// Delay in ms when exceeded performing caching requests to assets as XHRs
cacheDelay: null
// Boolean indicating if manifests shall be cached - if false app always resolves to
// current version but slows down launch
cacheManifests: true
// Enable logging as opt-in giving output of what dactylographsy is doing
enableLogging: false
```

## Developing & Contributing

Developing on the task alone is fairly easy just `git clone https://github.com/tdeekens/grunt-dactylographsy.git` then `cd grunt-dactylographsy`. From there one has to link the package to itself via `npm link && npm link grunt-dactylographsy` which will allow for calling `grunt dev`. Now just work the `task/dactylographsy.js` and check results - feel free to submit a pull-request!

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

## Feature Ideas

- [x] Add fallback to unprinted assets when loading fails (no caching)
- ~~[ ] Allow catching up existing script tags (data-default-script)~~
  - ~~Removes intiial load delay by requesting manifests~~
- [x] Feature detect localstorage and don't cache if not present
- [x] Add cache cleaning by unique identifer to not keep n-versions of files in cache
- [x] Add support for specifying a delay to reload assets to cache responses
- [ ] Add support for changing cache to e.g. sessionstorage
  - [ ] Add config for cache lifetime (for sessionstorage)

## Acknowledgements

- ...to [BrowerStack](https://browerstack.com) for supporting this project with their awesome services for free!
- ...to great people around me supporting me with ideas and feedback!
