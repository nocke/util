#!/usr/bin/env node
// TODO 'use strict'
// import { howdy } from "./src/log.js"

import common from './src/_common.js'
import log from './src/log.js'
import assert from './src/assert.js'

export * from './src/_common.js'
export * from './src/log.js'
export * from './src/assert.js'

export const truth = 88
export default {
  ...common,
  ...log,
  ...assert,
  truth
}
