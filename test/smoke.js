import { assert } from 'chai'

// ↓ going through main export (not including specifc module) on purpose
import util, { check, guard } from '../main.js'

/*
    some sanity testing
 */
describe(autoSuiteName(import.meta.url),
  () => {

    describe('just some selftesting', () => {

      it('check some global func', () => {
        assert.isTrue(!!global.captureStream)
      })

      it('assert throws', () => {
        assert.throws(() => {
          assert.equal(1 + 1, 42)
        })
      })
    })

    describe('execute something', () => {
      guard('df', { mute: true })
      util.guard('ls -l', { mute: true })
      assert(check('ls nonsenseFolder6170182309', { mute: true }) !== 0)
    })
  })
