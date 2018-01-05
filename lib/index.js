'use strict'

const os = require('os')

const normalize = require('./normalize')
const install = require('./install')
const createPackageChecker = require('./packages')
const createIo = require('./io')

module.exports = async manifest => {
  const packageChecker = createPackageChecker(manifest.pkg)
  const io = createIo(manifest.io)
  const hostname = os.hostname()
  const { directories, files, symlinks } = await normalize({
    hostname,
    packageChecker,
    ...manifest
  })
  return install({directories, files, symlinks, io})
}
