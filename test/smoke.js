import { assert } from 'chai'

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

  })
autoSuiteName(import.meta.url)
