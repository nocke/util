# README

## status

[![](https://github.com/nocke/util/actions/workflows/ci.yml/badge.svg)](https://github.com/nocke/util/actions/workflows/ci.yml?query=branch%3Amaster)
[![](https://shields.io/badge/license-MIT-green)](./package.json)
[![](https://img.shields.io/static/v1?label=dependencies%20(without%20dev%20dependencies)&message=0&color=brightgreen&style=flat&logo=)](./package.json)

## description

**@nocke/util** a collection of opinionated Utilties to facilitate the writing of NodeJS local machine resp. server-side scripting, in particular typical „bash-like“ helper, automation and setup scripts.

Originally written for a series of `barejs` setup script

* dependency-free
* all ES6 (no CJS, no Typescript)

This includes:

* **[Logging](./src/log.js):** Well, not too far apart from `console.log|warn.error()` but with a few twists on serialization and dumping of objects. Output coloring included, too.
* **[Asserts](./src/assert.js):** All kinds of useful asserts. _Not_ meant for testing but for easier, better fast-fail-behaviour and clearer error reporting at runtime
* **[Executions](./src/execute.js):** Execution of binaries and linux commands. At it's heart this is no more than NodeJS' usual `execSync`, but with some convenience on stdout, returned strings and error codes and assertion, if desired
* **[FileUtils](./src/fileUtils.js):** Write complete files with a single command, rsync directories, be more cautious on ensuring paths are user-intended, check files on the existence of snippets...
* **[GitUtils](./src/gitUtils.js):** Well, so far that's just one wrapper to obtain git properties
* **[DconfUtils](./src/dconfUtils.js):** Writing registry data to Linux dconf registry was vital to me for system setup scripts, and is trickier than you might think
* **[ioUtils](./src/ioUtils.js):** Reading one line of input in NodeJS sadly requires a few more lines of NodeJS source code... here they are.

## Installation

```sh
npm install @nocke/util
```

## Usage

This is an ES6 module, thus all `import`, no `require()`.

No submodules, everything is directly importable, resp. available in the module's default export:

```js
import util from '@nocke/util'
util.info(`hello`, ...)
```
or

```js
import { purple, info, warn } from '@nocke/util' 
info(`hello`, ...)
```

Personally I favor the latter.
