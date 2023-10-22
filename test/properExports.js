import { assert } from 'chai'

import * as existingExports from '../main.js'

/*
   ensure nothing got forgotten, when moving this into a util library
 */

const preExistingExports = [
  'serializeMsg',
  'xor',
  'argv',
  'info',
  'warn',
  'important',
  'pass',
  'fail',
  'trim',
  'getInput',
  'ensureTrue',
  'ensureFalse',
  'ensureFails',
  'ensureValidURL',
  'ensureWellFormedUser',
  'ensureMachine',
  'ensureRoot',
  'ensureRealObject',
  'ensureArray',
  'guard',
  'fileCopy',
  'commonize',
  'userguard',
  'check',
  'iterate',
  'clear',
  'red',
  'green',
  'blue',
  'yellow',
  'getFolderSize',
  'loggedMainWrap',
  'mainWrap',
  'ucFirst',
  'sleep',
  'writeFile',
  'rsyncFolder',
  'getDiskUsageInfo',
  'getDiskUsageSummary',
  'ensureFileExists', // was: 'ensureDirExists',
  'ensureFileOrFolderExists',
  'ensureFileExists',
  'makeDirs',
  'getGitProp',
  'validateOptions',
  'worthySuperlog',
  'getIsoDateAndTime'
]

describe(autoSuiteName(import.meta.url),
  () => {
    it('check all prior exports still exist', () => {

      // NOTE: `!!` is a bad idea, e.g. `isWindows` is a boolean export (and most often false...) → Use assert.exists() to check against null and undefined

      preExistingExports.forEach(prior => {
        assert.exists(existingExports[prior],
            `prior export '${prior}' no longer gets exported DIRECTLY`)
        assert.exists(existingExports.default[prior],
            `prior export '${prior}' no longer gets exported IN DEFAULT`)
      })

    })

    it('check for any direct <-> default differences (including new functions)', () => {
      const allExports = Object.keys(Object.assign({}, existingExports, existingExports.default)).filter(k => !['default', 'argv'].includes(k)).sort()
      // DEBUG console.log(allExports)
      allExports.forEach(e => {
        assert.exists(existingExports[e], `does not exist as direct export '${e}'(${typeof existingExports.default[e]})`)
        assert.exists(existingExports.default[e], `does not exist in default export '${e}'(${typeof existingExports[e]})`)
      })
    })
  }
)
