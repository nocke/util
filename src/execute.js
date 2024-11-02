'use strict'
import { exec, execSync } from 'child_process'
import { promisify } from 'util'
import { ensureTrue, ensureWellFormedUser, fail, pass, validateOptions } from './assert.js'
import { warn } from './log.js'
import { trim } from './_common.js'
import { info } from 'console'

// Promisify exec for async usage
const execAsync = promisify(exec)

/* WARN: '&>/dev/null' might suppress error codes and wrongly return 0 (wrongly: ok) */
export const guard = async (cmd, config = {}) => {
  ensureTrue(
    typeof config !== 'boolean',
    'forgot to change a mute param `true|false` to config object?'
  )
  validateOptions(config, ['mute', 'noPass', 'timeout', 'errMsg'])
  const mute = config.mute === true
  const noPass = config.noPass === true
  const errMsg = !!config.errMsg ? config.errMsg + '\n' : ''
  const timeout = config.timeout ? config.timeout : 120 * 1000

  try {
    // Asynchronous execution of the command
    const { stdout } = await execAsync(cmd, {
      timeout,
      stdio: mute ? ['ignore', 'pipe', 'ignore'] : ['pipe', 'pipe', 'inherit'],
      encoding: 'utf8',
    })

    const trimmedResult = trim(stdout.toString(), '\n')
    if (!noPass) pass(cmd)
    if (!mute && trimmedResult !== '') { info(trimmedResult) }

    return trimmedResult
  } catch (error) {
    fail(
      'guard() failed',
      `status: ${error.code}`,
      `message: ${errMsg}${error.message}`,
      `stderr: ${error.stderr?.toString() || 'no stderr output'}`,
      `stdout: ${error.stdout?.toString() || 'no stdout output'}`
    )
  }
}

/* Userguard function unchanged */
export const userguard = (user, userCmd, config = {}) => {
  ensureTrue(
    config !== true,
    'forgot to change a mute true to config object'
  )
  validateOptions(config, ['mute', 'timeout', 'useSudo'])
  const useSudo = config.useSudo === true

  ensureWellFormedUser(user)

  // user will have (most of) its typical env varibles
  // NOTE: user will have its home dir as current path

  // escape quotes in the command, since it gets put into outer quotes
  const escapedUserCmd = userCmd.replace(/"/g, '\\"')
  let cmd
  if (useSudo) {
    warn('using `sudo`')
    // note: might work better without `-i` (on env variables)
    cmd = `sudo -Hu "${user}" -- sh -c "${escapedUserCmd}"`
  } else {
    // single quotes against „premature“ variable substitution
    // stackoverflow.com/a/50119758
    cmd = `runuser -l '${user}' -c '${escapedUserCmd}'`
  }
  return guard(cmd, config)
}

/* like guard, except, returns true or false (thus not “enforcing”)
  NOTE: by default returns error code (not result, like [user]guard())
  NOTE: on error code: 0 is 'falsy' but means everything is ok,
  truthy other value if unsuccessful
  ██
  WARNING: '&>/dev/null' might suppress error codes and wrongly return 0 (everything ok)
  */
export const check = (cmd, config = {}) => {
  ensureTrue(
    config !== true,
    'forgot to change a mute true to config object'
  )
  validateOptions(config, ['mute', 'timeout', 'getResult'])
  const mute = config && config.mute ? !!config.mute : false
  const timeout = config && config.timeout ? config.timeout : 120 * 1000
  const getResult = config && config.getResult === true

  try {
    const stdout = execSync(cmd, {
      stdio: mute ? [] : 'pipe',
      encoding: 'utf8',
      timeout
    })

    const trimmedResult = trim(stdout.toString(), '\n')
    if (!mute) {
      pass(cmd)
      info('status (pass):', 0)
      if (trimmedResult !== '') info(trimmedResult)
    }
    if (getResult) return trimmedResult
    return 0
  } catch (error) {
    if (error.code === 'ETIMEDOUT') warn('check: cause was TIMEOUT!')
    const trimmedResult = trim(error.stdout?.toString() || '', '\n')
    if (!mute) {
      warn('result: ', trimmedResult)
      warn('cmd:    ', cmd)
      warn('status: ', error.status)
    }
    if (getResult) return trimmedResult
    return error.status
  }
}

export default {
  guard,
  userguard,
  check
}
