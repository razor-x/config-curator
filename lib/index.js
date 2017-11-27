'use strict'

const os = require('os')

const normalize = require('./normalize')
const install = require('./install')

module.exports = async manifest => {
  const hostname = os.hostname()
  const { directories, files, symlinks } = await normalize({
    hostname,
    ...manifest
  })
  return install({directories, files, symlinks})
}
