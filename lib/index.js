'use strict'

const os = require('os')

const createPackageChecker = require('./package-checker')
const createIo = require('./io')
const normalize = require('./normalize')
const install = require('./install')

module.exports = async manifest => {
  const hostname = os.hostname()
  const packageChecker = createPackageChecker(manifest.pkg)
  const io = createIo(manifest.io)

  const { directories, files, symlinks } = await normalize({
    hostname,
    packageChecker,
    ...manifest
  })

  return install({directories, files, symlinks, io})
}
