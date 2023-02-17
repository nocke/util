'use strict'

import { guard } from './execute.js'

export const getGitProp = (key /* COULDDO: , scope=<default> */) => {
  const r = guard(`git config --get ${key}`, { mute: true })
  if (r === 'false' || r === 'true') {
    return r === 'true' // return as boolean
  }
  if (!Number.isNaN(Number(r))) {
    return Number(r) // return as number
  }
  return r
}

export default {
  getGitProp
}
