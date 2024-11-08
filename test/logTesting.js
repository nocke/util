// TODO import { assert } from 'chai'

// ↓ going through main export (not including specifc module) on purpose
import { assert } from 'chai'
import { check, important, info, warn } from '../main.js'

/*
   ensure nothing got forgotten, when moving this into a util library
 */
describe(autoSuiteName(import.meta.url),

  () => {

    class SomeClass {}
    const someInstance = new SomeClass()

    it('some basic logging', () => {

      info('SomeClass.name', SomeClass.name)
      warn('someInstance.constructor.name', someInstance.constructor.name)
      warn('more', typeof SomeClass, typeof someInstance)

      info('info', ['in', 'fo'])
      warn({ wa: 'rn' }, SomeClass, someInstance)
      important([{ the: 'quick' }, 'brown', ['fox'], 'jumps'])
    })

    it('outputting classes and instances', () => {

      info(1, 'A', true, [], {}, () => {}, /regExp/)
      info('-----')
      info(1, 'A', true, ['A'], { B: true }, () => { return 77 }, /regExp.*/)
      info('=====')
      info('SomeClass', SomeClass, [SomeClass, true, 3], { SomeClass }, 'yes', 123)
      warn('someInstance', someInstance, [someInstance], { someInstance })
    })

    it('should return the error status for a failing command', () => {
      const result = check('nonexistentcommand', { mute: true })
      assert.isAbove(result, 0)
    })

    it('should return the result of a successful command', () => {
      const result = check('echo "Hello, World!"', { getResult: true, mute: true })
      assert.strictEqual(result, 'Hello, World!')
    })

  }
)
