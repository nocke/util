'use strict'
import fs from 'fs'
import { exec } from 'child_process'
import { serializeMsg, warn } from './log.js'
import { isWindows, symbols } from './_common.js'
import { check, guard } from './execute.js'

// make Errors a bit more specific (also in stacktrace)
export class FailError extends Error {
  constructor(message) {
    super(message)
    this.name = 'FailError'
    // this.channel = 'logging' // Example custom property
  }
}

export const pass = (...msg) => {
  console.log(
    '\u001b[32mpass: ' + serializeMsg(msg) + ` ${symbols.ok}\u001b[0m`
  )
}

export const fail = (...msg) => {
  const errMsg =
          '\u001b[91;48;5;52mfail(): ' +
          serializeMsg(msg) +
          ` failed ${symbols.tripleCross}\u001b[0m`

  // TODO depend on context, i.e. not in mocha
  exec('aplay -q ./util/sounds/CantinaBand3.wav &')
  throw new FailError(errMsg)

  // REF stacktrace matters
  // https://stackoverflow.com/questions/16697791/nodejs-get-filename-of-caller-function

  // Error.captureStackTrace(err);
  // warn(
  //   '\n',
  //   // @ts-ignore
  //   err.stack
  //     .split(/\r\n|\r|\n/)
  //     .slice(2, -5)
  //     .map(line => (stackLine.test(line) ? '\u001b[38;5;112m' + line + '\u001b[0m' : line))
  //     .join('\n')
  // );
  // throw err;
  // process.exit(1);
}

// exit with just an error message (no stacktrace)
// used for more trivial user errors
export const gracefulFail = (...msg) => {
  warn(...msg)
  process.exit(1)
}

// ===========================================================
// ensure Functions (asserts)
// ===========================================================

export const ensureTrue = (value, ...msg) => {
  value === true || fail('ensureTrue():', ...msg)
}

export const ensureFalse = (value, ...msg) => {
  value === false || fail('ensureTrue():', ...msg)
}

export const ensureTruthy = (value, ...msg) => {
  !!value || fail('ensureTruthy():', ...msg)
}

export const ensureEqual = (shouldValue, isValue, ...msg) => {
  shouldValue === isValue ||
          fail(
            `ensureEqual(): shouldValue '${shouldValue}' (${typeof shouldValue}) does not match isValue '${isValue}' (${typeof isValue})`,
            ...msg
          )
}

export const ensureString = (value, ...msg) => {
  typeof value === 'undefined' &&
          fail('ensureString(): Value not even defined', ...msg)
  typeof value === 'string' ||
          fail(`ensureString(): Not a string '${value}'`, ...msg)
  value.length > 0 || fail(`ensureString(): empty string '${value}'`, ...msg)
}


export const ensureFileExists = (path, ...msg) => {
  ensureTrue(
    fs.existsSync(path),
    `ensureFileExists: no such file '${path}'`,
    ...msg
  )
  ensureTrue(
    fs.lstatSync(path).isFile(),
    `ensureFileExists: '${path}' is a dir (should be a file)`,
    ...msg
  )
}

// Note: was ensureDirExists
export const ensureFolderExists = (path, ...msg) => {
  ensureTrue(
    fs.existsSync(path),
    `ensureFolderExists: no such directory '${path}'`,
    ...msg
  )
  ensureTrue(
    fs.lstatSync(path).isDirectory(),
    `ensureFolderExists: '${path}' is a file, not a directory)`,
    ...msg
  )
}

export const ensureFileOrFolderExists = (path, ...msg) => {
  ensureTrue(
    fs.existsSync(path),
    `ensureFileExists: no such file/folder '${path}'`,
    ...msg
  )
}

export const ensureFileOrFolderOrLinkExists = (path, ...msg) => {
  const stat = fs.lstatSync(path)
  ensureTrue(stat.isFile() || stat.isDirectory() || stat.isSymbolicLink(),
    `ensureFileExists: no such file/folder/link '${path}'`,
    ...msg
  )
}

export const ensureWellFormedUser = (user, ...msg) => {
  ensureTrue(
    /^[a-z]*$/.test(user),
    `not a valid user '${user}', possibly a command?`, ...msg
  )
}

export const ensureRoot = () => {
  if (isWindows) {
    if (check('net session > nul 2>&1', { mute: true }) !== 0) {
      fail('you are not in an admin prompt')
    }
  } else {
    // @ts-ignore
    process.getuid() === 0 || fail('you are not root')
  }
}

export const ensureNonRoot = () => {
  if (isWindows) {
    if (check('net session > nul 2>&1', { mute: true }) === 0) {
      fail('you are in an admin prompt, please run in a non-admin prompt')
    }
  } else {
    // @ts-ignore
    process.getuid() !== 0 || fail('you are root, run as a non-root')
  }
}

export const ensureMachine = machineName => {
  const actualMachineName = guard('uname -n', { mute: true, noPass: true }).trim()
  ensureTrue(machineName === actualMachineName, `ensureMachine: machine name '${actualMachineName}' does not match expected machine name '${machineName}'.`)
  pass(`ensureMachine: '${machineName}'`)
}

const validURL = /^(http[s]?:\/\/(www\.)?|ftp:\/\/(www\.)?|www\.){1}([0-9A-Za-z-.@:%_+~#=]+)+((\.[a-zA-Z]{2,3})+)(\/(.*))?(\?(.*))?/

export const ensureValidURL = (url) => {
  ensureTrue(validURL.test(url), `url '${url}' seems not to be a valid url`)
}

// only used for self-testing in UtilsDEmo
export const ensureFails = (fn, ...msg) => {
  let failed = false
  try {
    fn()
  } catch (error) {
    pass('↑ ensureFails: Des g\'hört so (all good)', error)
    failed = true
  }
  ensureTrue(failed, 'function did NOT fail!', ...msg)
}

export const ensureRealObject = (o) => {
  ensureTrue(
    typeof o === 'object' && o !== null && !Array.isArray(o),
    `not a real object (not counting null, array): ${o}`
  )
}

export const ensureArray = (a) => {
  ensureTrue(Array.isArray(a), `not an array: ${a}`)
}

export const validateOptions = (optionsObject, validOptions) => {
  ensureRealObject(optionsObject)
  ensureArray(validOptions)
  Object.keys(optionsObject).map(k => ensureTrue(validOptions.includes(k), `unknown key '${k}' (upper/lowercase?) not in`, validOptions))
}

export default {
  FailError,

  pass,
  fail,
  gracefulFail,

  ensureTrue,
  ensureFalse,
  ensureTruthy,
  ensureEqual,
  ensureString,

  ensureFileExists,
  ensureFolderExists,
  ensureFileOrFolderExists,
  ensureFileOrFolderOrLinkExists,

  ensureRoot,
  ensureNonRoot,
  ensureMachine,

  ensureWellFormedUser,
  ensureValidURL,
  ensureFails,
  ensureRealObject,
  ensureArray,
  validateOptions
}
