[![](https://github.com/nocke/util/actions/workflows/ci.yml/badge.svg)](https://github.com/nocke/util/actions/workflows/ci.yml?query=branch%3Amaster)
[![](https://shields.io/badge/license-MIT-green)](./package.json)
[![](https://img.shields.io/static/v1?label=dependencies%20(without%20dev%20dependencies)&message=0&color=brightgreen&style=flat&logo=)](./package.json)

# @nocke/util

A zero-dependency collection of utility functions to simplify the writing of typical „bash-like“ (or rather: bash-replacing) NodeJS scripts for your local machine (respectively: server-side scripting).

Originally written for a series of `barejs` setup scripts, for a full range of „secondary system setup“ on fresh Ubuntu-MATE machines. Now also used in my [photo organizing cli commands](https://github.com/nocke/photo).

* dependency-free
* all NodeJS, all ES6
* no Common JS, no Typescript, no transpilation
* async as much as possible
* strong emphasis on fast-fail behaviour (plenty of asserts, called „ensure“)

## Areas covered:

* **[Logging](./src/log.js):** Well, not too far apart from `console.log|warn.error()` but with a few twists on serialization and dumping of objects. Output coloring included, too.
* **[Asserts](./src/assert.js):** All kinds of useful asserts. _Not_ meant for testing but for easier, better fast-fail-behaviour and clearer error reporting at runtime
* **[Executions](./src/execute.js):** Execution of binaries aka linux commands. Yes, at its heart this is no more than NodeJS' usual `execSync`, but with some convenience on stdout, returned strings and error codes and assertion, if desired
* **[FileUtils](./src/fileUtils.js):** write complete files with a single command, rsync directories, be more cautious on ensuring paths are user-intended, quickly check files on the existence of snippets...
* **[GitUtils](./src/gitUtils.js):** Well, so far there's just one wrapper to obtain (and usually verify) git properties
* **[DconfUtils](./src/dconfUtils.js):** Writing registry data to Linux dconf registry was vital to me for system setup scripts (and is trickier than you might think)
* **[ioUtils](./src/ioUtils.js):** Reading one line of input in NodeJS sadly requires a few more lines of NodeJS source code... here they are.

## Installation

```sh
npm install -S @nocke/util
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

I somehow favor the latter for simplicity in the actual code.

nb: there is actually [a test](test/properExports.js#L72) to ensure, I did not forget an export on either side (singular or grouped export aka „default“) side.

## Testing

    npm run test -- test/logTesting.js

### single test run:

    npm run test -- test/logTesting.js


## Build

  npm run create-types

creates/updates typescript types (.d.ts) for the library. While these are rather unspecific (this is not a typescript library, not requiring transpilation…), this is picked up by many IDEs, facilitating auto completion.
