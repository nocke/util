import path from 'path'

console.log('############## common called ######################')

export const scriptPath = process.argv[1]
export const scriptBasename = path.basename(scriptPath)
export const scriptDir = path.dirname(scriptPath)

export default {
    scriptPath,
    scriptBasename,
    scriptDir
}
