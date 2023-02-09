'use strict'
/**
 * general NodeJS Javascript utility stuff (not specific to bare)
 * TODO distinct, published module
 * TODO split into files
 * TODO mocha testing
 * TODO logging with channel concept
 */

import path from 'path'
import { important, info } from './log'
import { ensureTrue, ensureWellFormedUser } from './assert'
import { fail } from 'assert'
import { check } from './execute'

// TEMPTEMP REF
// import fs, { existsSync } from 'fs'
// import path from 'path'
// import { exec, execSync } from 'child_process'
// import readline from 'readline'


console.log('############## common called ######################')

// name+path of calling script
export const scriptPath = process.argv[1]
export const scriptBasename = path.basename(scriptPath)
export const scriptDir = path.dirname(scriptPath)

// 'pure' arguments
export const argv = process.argv.slice(2)
export const isWindows = process.platform === 'win32'

// detect if running as root
const isRoot = process.getuid() === 0 // UID 0 is always root
// info(isRoot ? 'RUNNING AS: ROOT' : 'running as: normal user')
if (isRoot) {
  important('RUNNING AS: ROOT')
}

// Symbols
const symbols = {
  ok: isWindows ? '\u221A' : '✓',
  tripleCross: isWindows ? '\u00D7\u00D7\u00D7' : '✗✗✗'
}

// ES6 still lacks an exclusive-or function
export const xor = (a, b) => ((a ? 1 : 0) ^ (b ? 1 : 0)) === 1

// a flexible, performant (no RexEx) trim was missing as well
export const trim = (str, ch) => {
  let start = 0
  let end = str.length
  while (start < end && str[start] === ch) ++start
  while (end > start && str[end - 1] === ch) --end
  return start > 0 || end < str.length ? str.substring(start, end) : str
}

export const ucFirst = ([first = '', ...rest]) => [first.toUpperCase(), ...rest].join('')

// remember to use `await` when calling this function!
export const sleep = async(ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}


export const iterate = (...argsAndFn) => {
  ensureTrue(!!argsAndFn && argsAndFn.length >= 2)
  ensureTrue(
    argsAndFn.length <= 4,
    'currently up to 3 dimensions supported (thus 3 arrays + fn)'
  )
  const args = argsAndFn
    .slice(0, -1) // take of last
    .map(arg => {
      // only objects and arrays
      ensureTrue(typeof arg === 'object')
      // convert to be iterable
      return Array.isArray(arg) ? arg : Object.keys(arg)
    })
  const fn = argsAndFn[argsAndFn.length - 1]
  ensureTrue(
    typeof fn === 'function',
    'iterate: last argument must be function'
  )

  switch (args.length) {
    case 1:
      for (const a0 of args[0]) {
        info(`iterate ${a0} --------`)
        fn(a0)
      }
      break
    case 2:
      for (const a0 of args[0]) {
        for (const a1 of args[1]) {
          info(`iterate ${a0} × ${a1} --------`)
          fn(a0, a1)
        }
      }
      break
    case 3:
      for (const a0 of args[0]) {
        for (const a1 of args[1]) {
          for (const a2 of args[2]) {
            info(`iterate ${a0} × ${a1} × ${a2} --------`)
            fn(a0, a1, a2)
          }
        }
      }
      break
    default:
      fail('that many args not yet implemented')
  }
}

export const userIsLoggedIn = (user) => {
  ensureWellFormedUser(user)
  return (check(`who -u | grep "${user}"`, { mute: true }) == 0)
}

export const getIsoDateAndTime = () => {
  const d = new Date()
  return d.getFullYear() + '-' +
          ('0' + (d.getMonth() + 1)).slice(-2) + '-' +
          ('0' + d.getDate()).slice(-2) + '  ' +
          d.getHours() + ':' +
          d.getMinutes() + 'h'
}


export default {
  scriptPath,
  scriptBasename,
  scriptDir,
  argv,
  isWindows,
  symbols,
  xor,
  ucFirst,
  sleep,
  userIsLoggedIn
}
