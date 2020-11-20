'use strict'

const os = require('os')

const createPackageChecker = require('./package-checker')
const createIo = require('./io')
const normalize = require('./normalize')
const install = require('./install')

module.exports = async manifestOrFunction => {
  const promiseForManifest = typeof manifestOrFunction === 'function'
    ? manifestOrFunction()
    : manifestOrFunction
  const manifest = await promiseForManifest
  const ioType = process.env.CURATOR_IO || manifest.ioType
  const pkgType = process.env.CURATOR_PKG || manifest.pkgType
  const hostname = os.hostname()
  const packageChecker = createPackageChecker(pkgType)
  const io = createIo(ioType)

  const { unlinks, directories, files, symlinks } = await normalize({
    hostname,
    packageChecker,
    ...manifest
  })

  return install({ unlinks, directories, files, symlinks, io })
}
