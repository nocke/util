'use strict'

import readline from 'readline'
import { warn } from './log.js'

export const getInput = async(
  msg /* COULDDO: , wipeout=false, hash=undefined */
) => {
  // note: being inside async ensures properly going out of scope, ensuring main ends properly
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  return await new Promise((resolve) => {
    rl.question(`\u001b[38;5;202m${msg}: \u001b[0m`, resolve)
    // no rl.close() here!
  })
}

// remember to use `await` when calling this function!
// • sleeps for ms seconds,
// • earlier if key pressed
//
// @returns '' if no key pressed, key character otherwise
export const sleepWithKeypress = async(ms) => new Promise(resolve => {

  const timer = setTimeout(() => {
    rl.close()
    resolve('')
  }, ms)

  process.stdin.setRawMode(true)
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  })
  readline.emitKeypressEvents(process.stdin) // needed.

  process.stdin.on('data', function(data) {
    console.log('recieved ' + data)
  })

  process.stdin.on('keypress', (char, _key) => {
    clearTimeout(timer)
    rl.close()
    warn('key pressed')
    resolve(char)
  })
})

export default {
  getInput,
  sleepWithKeypress
}
