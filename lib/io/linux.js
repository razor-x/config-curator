'use strict'

const path = require('path')

const exec = require('../exec')
const {
  checkAccess,
  chmod,
  copyFile,
  makeSymlink
} = require('./shared')

const unlink = ({target}) => exec(`rm -rf ${target}`)

const makeDirRecursive = ({target}) => exec(`mkdir -p ${target}`)

const chmodRecursive = ({fmode, dmode, target}) => Promise.all([
  exec(`find ${target} -type f -exec chmod ${fmode.toString(8)} {} +`),
  exec(`find ${target} -type d -exec chmod ${dmode.toString(8)} {} +`)
])

const chown = ({owner, target}) => exec(`chown ${owner} ${target}`)

const chownRecursive = ({owner, target}) => exec(`chown -R ${owner} ${target}`)

const chgrp = ({group, target}) => exec(`chgrp ${group} ${target}`)

const chgrpRecursive = ({group, target}) => exec(`chgrp -R ${group} ${target}`)

const overwriteDirectory = async ({source, destination}) => {
  await makeDirRecursive({target: path.dirname(destination)})
  return exec(`rsync -rtc --del --links ${source}/ ${destination}`)
}

const copyFileLiunx = async ({source, destination}) => {
  await makeDirRecursive({target: path.dirname(destination)})
  return copyFile({source, destination})
}

const makeSymlinkLinux = async ({source, destination}) => {
  await makeDirRecursive({target: path.dirname(source)})
  await unlink({target: source})
  return makeSymlink({source, destination})
}

module.exports = {
  checkAccess,
  unlink,
  chmod,
  chmodRecursive,
  chown,
  chownRecursive,
  chgrp,
  chgrpRecursive,
  overwriteDirectory,
  copyFile: copyFileLiunx,
  makeSymlink: makeSymlinkLinux
}
