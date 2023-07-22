'use strict'

/**
 * the outermost wrapper every ts script needs
 * (indispensable for async/await)
 *
 * this function is handy to wrap NodeJS command-line in
 * • ensures that truly errors are caught and become visible
 * • your function my be async (so await is going to work)
 * • program won't exit before your async functions have completed
 */
export const mainWrap = (main) => {
  main()
    .then(
      () => {
        // TODO, if we ever had a 2nd param config
        // with a  runlog='<path>'
        // → see barejs
        //        guard(`echo "${scriptBasename} PASS" | tee -a /home/BARERUN.log`)

        process.exit(0)
      },
      (err) => {
        console.error(err)
        process.exit(1)
      }
    )
    .catch((err) => {
      console.error('CAUGHT ERROR:' /* , __filename */)
      console.error(err.message || err)
      if (err.stack) console.error(err.stack)
      process.exit(2)
    })
}

export default {
  mainWrap
}
