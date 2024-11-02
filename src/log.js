'use strict'
import { exec } from 'child_process'
import { scriptBasename, scriptPath } from './_common.js'
import { check } from './execute.js'

// properly stringify objects ( [Object][Object] is helping noone)
// NOTE `typeof m === 'object'` is a much broader selection than `m typeof object`!
// (i.e. matching imported modules)

const literalSerialize = (l) => {
  if (l === null) return '<null>'
  if (l === undefined) return '<undefined>'
  if (!!l.name) return l.name + '(class)' // return class
  if (
    !!l.constructor?.name &&
    !['Number', 'Boolean', 'String', 'RegExp', 'Function'].includes(l.constructor.name)) {
    return l.constructor.name + '(instance)' // return class
  }
  const ltype = typeof l
  if (Array.isArray(l)) return '[…array…]'
  if (l instanceof RegExp) return l
  if (ltype === 'string') return '\'' + l + '\''
  if (['number', 'boolean'].includes(ltype)) return l
  return '<' + (l?.constructor?.name ?? ltype) + '>'
}

const subSerialize = (s) =>
  Array.isArray(s)
    ? '[ ' + s.map((t) => literalSerialize(t)).join(', ') + ' ]'
    : literalSerialize(s)

// this function may look more than Confucian, but it is sheer assembled wisdom 😬
export const serializeMsg = (args) =>
  args
    .map((m) => {
      if (m === null) return '<null>' // sort out beforehand, because typeof null === 'object'
      if (m === undefined) return '<undefined>'

      const mtype = typeof m
      if (mtype === 'string') { return m.toString() } // prevent non-nested strings from getting quotes
      if (m instanceof RegExp) { return literalSerialize(m) }

      if (Array.isArray(m) && m.length === 0) { return '[]' }
      // COULDDO: short arrays as one-liner
      if (Array.isArray(m)) {
        return '\n[\n    ' + m.map(subSerialize).join(',\n    ') + '\n]\n'
      }

      // class instances as 'special object'
      let instanceName = m.constructor?.name ?? ''
      if (instanceName === 'Object') instanceName = ''

      // empty object
      if (mtype === 'object' && Object.entries(m).length === 0) { return instanceName + '{}' }
      if (mtype === 'object') {
        // COULDDO: short arrays as one-liner
        const keys = Object.keys(m)
        return (
          keys.reduce(
            (out, key, idx) =>
              out + `    ${key}: ${subSerialize(m[key])}${keys.length - 1 > idx ? ',' : ''}\n`,
            `\n${instanceName}{\n`
          ) + '}\n'
        )
      }
      return literalSerialize(m)
    })
    .join(' ')
    .replace(/\n\s\n?/g, '\n')

// ===========================================================
// logging and asserts
// ===========================================================
// great REF ansi colors: https://misc.flogisoft.com/bash/tip_colors_and_formatting

export const clear = '\x1b[2J\x1b[H'

// TODO: a loglevel!

// TODO?: will wrap and then lead to inner non-serializing (<purpleEsc>[Object] [Object]</purpleEsc)
// perhaps rather pass down a 'magic' token prepended first param down the line, that THEN leads to wrapping
// in serializeMsg() ?
// TODO, make it work with multiple parts: warn(purple(`core: ${core}`, family, 'OO'))
export const red = (...msg) => `\x1b[31m${serializeMsg(msg)}\x1b[0m`
export const gray = (...msg) => `\x1b[90m${serializeMsg(msg)}\x1b[0m`
export const green = (...msg) => `\x1b[32m${serializeMsg(msg)}\x1b[0m`
export const blue = (...msg) => `\x1b[94m${serializeMsg(msg)}\x1b[0m`
export const purple = (...msg) => `\x1b[95m${serializeMsg(msg)}\x1b[0m`
export const yellow = (...msg) => `\x1b[93m${serializeMsg(msg)}\x1b[0m`

export const info = (...msg) => {
  console.log('\x1b[33m' + serializeMsg(msg) + '\x1b[0m')
}

export const warn = (...msg) => {
  console.log('\x1b[38;5;202m' + serializeMsg(msg) + '\x1b[0m')
}

export const important = (...msg) => {
  console.log(
    '\x1b[107;48;5;58m' + serializeMsg(msg).padEnd(60) + '\x1b[0m'
  )
}

/*
   * also appends the log message to a central log
   * TODO /home/ <user missing?> SUPERLOG.txt
   */
export const superLog = (...msg) => {
  const msgString = serializeMsg(msg)
  console.log('\x1b[107;48;5;58m' + msgString + '\x1b[0m')
  check(`echo "${msgString}" >> /home/SUPERLOG.txt`, { mute: true })
}

/*
* this is a bad (way too usecase-specific) function, TODO to be remove!
*
*/
export const worthySuperlog = /\/barejs\/\d{1,3}\D[^\d.]*\.js/i
export const loggedMainWrap = (main) => {
  const padWidth = 60

  // only do superLog + sound for regular setup script (/barejs/08_something) not helpers, test, util scripts
  const doSuperLog = worthySuperlog.test(scriptPath)

  info('\n\x1b[42;1m' + `  CALLING  ${scriptPath}`.padEnd(padWidth) + '\x1b[0m')
  if (doSuperLog) superLog(`START ${scriptBasename}`)
  main()
    .then(
      () => {
        // TODO: only play on main wraps taking longer than 20 seconds (nerves…)
        if (doSuperLog) exec('aplay -q ./util/sounds/StarWars3.wav &')
        info('\x1b[42;1m' + `  DONE  ${scriptPath}`.padEnd(padWidth) + '\x1b[0m')
        if (doSuperLog) superLog(`SUCCESS ${scriptBasename}`)
        process.exit(0)
      },
      (err) => {
        if (doSuperLog) superLog(`ERROR ${scriptBasename}`)
        // ‘regular’ fail's end up here
        console.error(err)
        process.exit(1)
      }
    )
    .catch((err) => {
      if (doSuperLog) superLog(`ERROR ${scriptBasename}`)
      // more unspecified errors
      console.error('CAUGHT ERROR:' /* , __filename */)
      console.error(err.message || err)
      if (err.stack) console.error(err.stack)
      process.exit(2)
    })
}

export default {
  serializeMsg,
  clear,
  red,
  gray,
  green,
  blue,
  purple,
  yellow,
  info,
  warn,
  important,
  loggedMainWrap,
  superLog,
  worthySuperlog
}
