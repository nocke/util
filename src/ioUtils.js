'use strict'

import readline from 'readline'

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


export default {

  getInput

}
