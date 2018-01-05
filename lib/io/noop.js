'use strict'

const path = require('path')

const checkAccess = ({target}) => {
  console.log(`Access ok for ${target}`)
}

const unlink = ({target}) => {
  console.log(`Unlink ${target}`)
}

const makeDirRecursive = ({target}) => {
  console.log(`Create directory ${target}`)
}

const chmod = ({mode, target}) => {
  console.log(`Set mode ${mode.toString(8)} on ${target}`)
}

const chmodRecursive = ({fmode, dmode, target}) => {
  console.log(`Set recursive fmode ${fmode.toString(8)} and dmode ${dmode.toString(8)} on ${target}`)
}

const chown = ({owner, target}) => {
  console.log(`Set owner ${owner} on ${target}`)
}

const chownRecursive = ({owner, target}) => {
  console.log(`Set recursive owner ${owner} on ${target}`)
}

const chgrp = ({group, target}) => {
  console.log(`Set group ${group} on ${target}`)
}

const chgrpRecursive = ({group, target}) => {
  console.log(`Set recursive group ${group} on ${target}`)
}

const overwriteDirectory = ({source, destination}) => {
  makeDirRecursive({target: path.dirname(destination)})
  console.log(`Copy directory ${source} to ${destination}`)
}

const copyFile = ({source, destination}) => {
  console.log(`Copy file ${source} to ${destination}`)
}

const makeSymlink = ({source, destination}) => {
  makeDirRecursive({target: path.dirname(destination)})
  console.log(`Make symlink from ${source} to ${destination}`)
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
  copyFile,
  makeSymlink
}
