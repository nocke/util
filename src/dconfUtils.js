'use strict'

import { sleep, userIsLoggedIn } from './_common.js'
import { ensureWellFormedUser } from './assert.js'
import { check, guard } from './execute.js'
import { info } from './log.js'

/* writes a dconf for a particular user
   yes, tricky it is. Needs the help of a shell script.
*/
export const applyDconf = async (user, dconfFile) => {

  ensureWellFormedUser(user)
  const userID = parseInt(check(`id -u ${user}`, { getResult: true, mute: true }))

  if (userIsLoggedIn(user)) {
    info(`dconf for logged-in user ${user}`)
    const xDispEnv = `DBUS_SESSION_BUS_ADDRESS=unix:path=/run/user/${userID}/bus`
    guard(`${xDispEnv} su -c "./script/executeDConfNonSudo.sh ${dconfFile}" ${user}`)
  } else {
    info(`dconf for logged-out user ${user}`)
    guard('xhost +')
    const xDispEnv = `export HOME=/home/${user}; export DISPLAY=localhost:0; NO_AT_BRIDGE=1;`
    guard(`${xDispEnv} su -c "dbus-launch ./script/executeDConfNonSudo.sh ${dconfFile}" ${user}`)
    guard('xhost -')
  }
  await sleep(200)
}

export default {
  applyDconf
}
