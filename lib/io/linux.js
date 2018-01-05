'use strict'

const path = require('path')

const checkAccess = ({target}) => {
  throw new Error('TODO: Not implemented.')
}

const makeDirRecursive = ({target}) => {
  throw new Error('TODO: Not implemented.')
}

const chmod = ({mode, target}) => {
  throw new Error('TODO: Not implemented.')
}

const chmodRecursive = ({fmode, dmode, target}) => {
  throw new Error('TODO: Not implemented.')
}

const chown = ({owner, target}) => {
  throw new Error('TODO: Not implemented.')
}

const chownRecursive = ({owner, target}) => {
  throw new Error('TODO: Not implemented.')
}

const chgrp = ({group, target}) => {
  throw new Error('TODO: Not implemented.')
}

const chgrpRecursive = ({group, target}) => {
  throw new Error('TODO: Not implemented.')
}

const overwriteDirectory = ({source, destination}) => {
  makeDirRecursive({target: path.dirname(destination)})
  throw new Error('TODO: Not implemented.')
}

const copyFile = ({source, destination}) => {
  throw new Error('TODO: Not implemented.')
}

const makeSymlink = ({source, destination}) => {
  makeDirRecursive({target: path.dirname(destination)})
  throw new Error('TODO: Not implemented.')
}

module.exports = {
  checkAccess,
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
