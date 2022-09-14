import path from 'path'

import exec from '../exec.js'
import {
  checkAccess,
  chmod,
  copyFile as copyFileShared,
  makeSymlink as makeSymlinkShared
} from './shared.js'

const makeDirRecursive = ({ target }) => exec(`mkdir -p ${target}`)

const unlink = ({ target }) => exec(`rm -rf ${target}`)

const chmodRecursive = ({ fmode, dmode, target }) =>
  Promise.all([
    exec(`find ${target} -type f -exec chmod ${fmode.toString(8)} {} +`),
    exec(`find ${target} -type d -exec chmod ${dmode.toString(8)} {} +`)
  ])

const chown = ({ owner, target }) => exec(`chown ${owner} ${target}`)

const chownRecursive = ({ owner, target }) =>
  exec(`chown -R ${owner} ${target}`)

const chgrp = ({ group, target }) => exec(`chgrp ${group} ${target}`)

const chgrpRecursive = ({ group, target }) =>
  exec(`chgrp -R ${group} ${target}`)

const overwriteDirectory = async ({ source, destination }) => {
  await makeDirRecursive({ target: path.dirname(destination) })
  return exec(`rsync -rtc --del --links ${source}/ ${destination}`)
}

const copyFile = async ({ source, destination }) => {
  await makeDirRecursive({ target: path.dirname(destination) })
  return copyFileShared({ source, destination })
}

const makeSymlink = async ({ source, destination }) => {
  await makeDirRecursive({ target: path.dirname(source) })
  await unlink({ target: source })
  return makeSymlinkShared({ source, destination })
}

export default {
  checkAccess,
  unlink,
  chmod,
  chmodRecursive,
  chown,
  chownRecursive,
  chgrp,
  chgrpRecursive,
  overwriteDirectory,
  copyFile,
  makeSymlink
}
