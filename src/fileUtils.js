'use strict'
import path from 'path'
import { appendFileSync, existsSync, lstatSync, writeFileSync } from 'fs'
import { ensureEqual, ensureFileExists, ensureFolderExists, ensureTrue, pass, validateOptions } from './assert.js'
import { check, guard } from './execute.js'
import { isWindows, trim } from './_common.js'
import { info, warn } from './log.js'

/* returns free space on '/' as a number in Megabytews
 */
export const getDiskUsageInfo = () => {
  const memLine = guard('df -BM / | grep -w /', { mute: true })
    .trim()
    .split(/\s+/)
  ensureEqual(memLine.length, 6, 'should split into 6 values')
  const r = {
    fileSystem: memLine[0],
    used: parseInt(memLine[2].slice(0, -1)),
    avail: parseInt(memLine[3].slice(0, -1)),
    usedPercentage: parseInt(memLine[4].slice(0, -1)),
    mountPoint: memLine[5]
  }
  ensureTrue(
    typeof r.used === 'number' &&
          typeof r.avail === 'number' &&
          typeof r.usedPercentage === 'number'
  )
  return r
}

/* some asserting if a good, harmless destination path
...including user of homeDir ('root' otherwise)
remember to adjust rights, depending on users or shared dir

has some 'commonize' qualities
 */
export const groomDestPath = (filePath) => {
  // some sanity checking on path to avoid damage
  // TODO  how does this handle relative paths?
  // TODO  turned into absolute before groom checks?

  const { root, dir, base, ext } = path.parse(filePath)

  const segments = trim(filePath, '/').split('/')
  ensureTrue(filePath === '/common' || segments.length > 1, `unusually short path ${filePath}`)
  // first 2 segments, unless it's too short like /root/.bash_aliases
  const firstTwoSegs = `/${segments[0]}` + (segments.length > 2 ? `/${segments[1]}` : '')
  ensureTrue(existsSync(firstTwoSegs, `sanity: first two dir segments ${firstTwoSegs} should pre-exist`))

  ensureTrue(
    [
      'home',
      // considered common-ish
      'drive',
      'depot',
      'share',
      'common',
      'usr',
      'var',
      // considered root-ish
      'root',
      'etc'
    ].includes(segments[0]),
          `uncommon top-level path '${segments[0]}' in ${filePath}`
  )

  let user = 'root' // assume for now
  let group = 'root' // assume for now
  // written to a users dir?
  if (segments[0] === 'home' && /^[a-z]*$/.test(segments[1])) {
    user = segments[1]
    group = segments[1]
  }
  if (['drive', 'depot', 'share', 'common', 'usr', 'var'].includes(segments[0])) {
    user = 'root'
    group = 'common' // (bare specific, stricly speaking)
  }

  return { root, dir, base, ext, user, group }
}

export const commonize = (dirPath) => {
  ensureFolderExists(dirPath, `'${dirPath}' does not exist`)
  ensureTrue(groomDestPath(dirPath).group === 'common')

  guard(`chown -R root:common ${dirPath}`)
  // all files and (sub)folders readable
  guard(`chmod -R g+rX ${dirPath}`)
  guard(`chgrp -R --preserve-root -hv common ${dirPath}`)

  // since there is no such thing as an uppercase S (directories only)
  // settings static has to happen separately serverfault.com/a/649101/
  guard(`find '${dirPath}' -type d -exec chmod g+s {} \\;`)
  // Ende wird zu    /-->  '\;''
}


export const writeFile = (filePath, ...lines) => {
  const { _root, _dir, _base, _ext, user, group } = groomDestPath(filePath)

  writeFileSync(filePath, '')
  for (const line of lines) {
    appendFileSync(filePath, line + '\n')
  }

  pass(`file '${filePath}' written`)
  // adjust rights, depending on user / or shared dir
  guard(`chown ${user}:${group} '${filePath}'`)
}


export const getFolderSize = (filePath, size = 'B' /* 'B','K' 'M' 'G' */) => {
  ensureFolderExists(filePath)
  ensureTrue(lstatSync(filePath).isDirectory(), 'getFolderSize: not a folder')
  ensureTrue(['B', 'K', 'M', 'G'].includes(size))

  const stringResult = guard(`du -s '${filePath}' ${size === 'B' ? '-b' : '-B' + size} | grep -E -o ^[0-9]+`)
  const num = Number(stringResult)
  ensureTrue(!Number.isNaN(num))
  return num
}


export const rsyncFolder = (src, dest, config = {}) => {
  // COULDDO general helper to rule out unknown config switches  verifyConfig(config,['foo','bar])
  // REF archive mode: serverfault.com/a/141778
  const forwardDelete = config && config.forward === true ? '--delete' : ''
  const archiveMode = config && config.archive === true ? '--archive' : ''
  const commonMode = config && config.common === true // chmod related
  const rootMode = config && config.root === true
  ensureTrue(!commonMode || !rootMode, 'no simultaneous rootMode and commonMode')
  // to path-thru
  const timeout = config.timeout ? config.timeout : 120 * 1000

  ensureTrue(
    src.slice(-1) === '/',
          `src MUST have trailing slash, '${src}' does not`
  )
  ensureTrue(
    dest.slice(-1) !== '/',
          `dest MUST NOT have trailing slash, '${src}' does not`
  )

  const { _root, _dir, _base, _ext, user, group } = groomDestPath(dest)
  ensureTrue(!rootMode || group === 'common' || group === 'root', 'no rootMode in home-Folders...')

  guard(`rsync --progress --force -Ir ${forwardDelete} ${archiveMode} ${src} ${dest}`, { timeout })

  if (rootMode) {
    warn('rootMode!')
    guard(`chown -R root:root '${dest}'`, { timeout })
  } else {
    // adjust rights, depending on user / or shared dir
    guard(`chown -R ${user}:${group} '${dest}'`, { timeout })
    if (group === 'common' || commonMode) guard(`chmod -R go+rX '${dest}'`, { timeout })
  }
}

/*
   * is cautious about destination paths
   * sets rights accordingly
   */
export const fileCopy = (src, dest, config = {}) => {
  const commonMode = config && config.common === true
  const { _root, _dir, _base, _ext, user, group } = groomDestPath(dest)
  guard(`cp -f '${src}' '${dest}'`)

  // adjust rights, depending on user / or shared dir  ( -R 2× removed)
  guard(`chown ${user}:${group} '${dest}'`)
  if (group === 'common' || commonMode) guard(`chmod go+rX '${dest}'`)
}

/*
   * last parameter may be options object
   */
export const makeDirs = (...dirsAndOptions) => {
  let dirPaths
  let config = {}
  const lastArg = dirsAndOptions[dirsAndOptions.length - 1]

  if (typeof lastArg === 'object') { // is last one a config object? (not a string)
    // then use it so
    config = lastArg
    dirPaths = dirsAndOptions.slice(0, -1)
  } else { // otherwise just prepend to dirPaths
    dirPaths = dirsAndOptions
  }

  dirPaths.map(p => ensureTrue(typeof p === 'string', `makeDirs: ${p} is not a string`))
  validateOptions(config, ['root'])
  const rootRights = config.root === true

  if (isWindows) {
    // Windows fork  (no path grooming, no rights assignment here)
    dirPaths.forEach((rawPath) => {
      const dirPath = path.normalize(rawPath) // 'fix' slashes to backslash
      if (!existsSync(dirPath)) {
        guard(`MKDIR "${dirPath}"`)
      } else {
        pass(`ensured dir '${dirPath}' exists`)
      }
    })
  } else {
    // Linux fork  TODO test that foreach instead of map ok  (map wanted a return)
    dirPaths.foreach(dirPath => {
      const { _root, _dir, _base, _ext, user, group } = groomDestPath(dirPath)

      if (!existsSync(dirPath)) {
        guard(`mkdir -p '${dirPath}'`)
      } else {
        info(`ensured dir '${dirPath}' exists`)
      }

      warn('groom result: user, group', user + ':' + group)

      if (rootRights) {
        ensureTrue(group === 'common', 'mkDirs: root-Option only allowed in “common-ish” dirs')
        guard(`chown root:root '${dirPath}'`)
      } else {
        guard(`chown ${user}:${group} '${dirPath}'`)
      }
      if (group === 'common') guard(`chmod go+rX '${dirPath}'`)
    })
  }
}

/* finds out if any line (of a shorter text file) has the particular snippet grep-able */
export const fileHasSnippet = (file, snippet) => {
  ensureFileExists(file, `fileHasSnippet: '${file}' does not exist`)
  return check(`grep -c "${snippet}" "${file}"`, { mute: true }) === 0
}

export default {
  getDiskUsageInfo,
  groomDestPath,
  commonize,
  writeFile,
  getFolderSize,

  rsyncFolder,
  fileCopy,
  makeDirs,
  fileHasSnippet
}
